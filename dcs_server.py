# -*- coding: utf-8 -*-
"""
AeroBag Predictor - Local Development & DCS Sync Server
Совмещает статический HTTP-сервер (порт 8080) и локальный API-шлюз к Lydia DCS.
"""

import http.server
import socketserver
import urllib.request
import urllib.parse
import http.cookiejar
import ssl
import re
import json
import os
import sys

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Загрузка учетных данных из dcs_config.php или dcs_config.json
def load_dcs_config():
    config = {
        'base_url': 'https://newdcs.nwsesys.com/ADSDCS',
        'username': '',
        'password': '',
        'airline': 'N4',
        'default_locations': ['DYU', 'NMA', 'TJU', 'SKD', 'TAS', 'CXR', 'IST'],
        'request_delay_ms': 500
    }
    
    php_config_path = os.path.join(BASE_DIR, 'dcs_config.php')
    if os.path.exists(php_config_path):
        try:
            with open(php_config_path, 'r', encoding='utf-8') as f:
                content = f.read()
                user_m = re.search(r"['\"]username['\"]\s*=>\s*['\"]([^'\"]+)['\"]", content)
                pass_m = re.search(r"['\"]password['\"]\s*=>\s*['\"]([^'\"]+)['\"]", content)
                air_m = re.search(r"['\"]airline['\"]\s*=>\s*['\"]([^'\"]+)['\"]", content)
                if user_m: config['username'] = user_m.group(1)
                if pass_m: config['password'] = pass_m.group(1)
                if air_m: config['airline'] = air_m.group(1)
        except Exception as e:
            print("Config read error:", e)

    return config

class DcsScraper:
    def __init__(self, config):
        self.config = config
        self.base_url = config['base_url'].rstrip('/')
        self.ctx = ssl.create_default_context()
        self.ctx.check_hostname = False
        self.ctx.verify_mode = ssl.CERT_NONE
        self.cj = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(
            urllib.request.HTTPCookieProcessor(self.cj),
            urllib.request.HTTPSHandler(context=self.ctx)
        )
        self.auth_token = ''
        self.is_logged_in = False

    def login(self, username=None, password=None):
        user = username or self.config['username']
        pw = password or self.config['password']
        if not user or not pw:
            return {'success': False, 'error': 'Учетные данные Lydia DCS не настроены.'}

        # 1. Начальная страница для получения токена
        req0 = urllib.request.Request(self.base_url + '/', headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        with self.opener.open(req0) as r0:
            p0 = r0.read().decode('utf-8', errors='ignore')
            m0 = re.search(r'name=["\']auth-token["\']\s+content=["\']([^"\']+)["\']', p0)
            if not m0:
                m0 = re.search(r'content=["\']([^"\']+)["\']\s+name=["\']auth-token["\']', p0)
            tok0 = m0.group(1) if m0 else ''

        # 2. Отправка логина
        login_url = self.base_url + '/dcsIndex.do'
        post_data = urllib.parse.urlencode({
            'username': user,
            'password': pw,
            'checkUserSession': '0',
            'airline': self.config.get('airline', 'N4'),
            'osVersion': 'w10',
            'systemName': '',
            '_token': tok0
        }).encode('utf-8')

        req_login = urllib.request.Request(login_url, data=post_data, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': self.base_url + '/',
            'Content-Type': 'application/x-www-form-urlencoded'
        })

        with self.opener.open(req_login) as r_login:
            login_body = r_login.read().decode('utf-8', errors='ignore')
            m_post = re.search(r'content=["\']([^"\']+)["\']\s+name=["\']auth-token["\']', login_body)
            if not m_post:
                m_post = re.search(r'name=["\']auth-token["\']\s+content=["\']([^"\']+)["\']', login_body)
            self.auth_token = m_post.group(1) if m_post else tok0

        # 3. Открываем flightListsInfo.jsp для закрепления сессии и обновления токена
        flt_page = self.base_url + '/ADSDCS/flightManagement/flightListsInfo.jsp'
        req_page = urllib.request.Request(flt_page, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with self.opener.open(req_page) as r_page:
            page_html = r_page.read().decode('utf-8', errors='ignore')
            m_flt = re.search(r'content=["\']([^"\']+)["\']\s+name=["\']auth-token["\']', page_html)
            if m_flt:
                self.auth_token = m_flt.group(1)

        self.is_logged_in = True
        return {'success': True, 'message': 'Авторизация в Lydia DCS успешно пройдена.'}

    def scan_flights(self, start_date, end_date, locations=None, only_finalized=True):
        if not self.is_logged_in:
            lres = self.login()
            if not lres.get('success'):
                return lres

        if not locations:
            locations = self.config.get('default_locations', ['DYU', 'NMA', 'TJU', 'SKD', 'TAS', 'CXR', 'IST'])

        flt_page = self.base_url + '/ADSDCS/flightManagement/flightListsInfo.jsp'
        flt_ajax = self.base_url + '/ADSDCS/ajax/ajaxFlightsInfo.jsp'
        
        all_flights = []

        for loc in locations:
            loc = loc.strip().upper()
            if not loc: continue

            # 1. Переключаем активную станцию в сессии DCS
            loc_url = self.base_url + '/ADSDCS/ajax/ajaxGetUserLocationList.jsp'
            loc_data = urllib.parse.urlencode({'location': loc, '_token': self.auth_token}).encode('utf-8')
            req_loc = urllib.request.Request(loc_url, data=loc_data, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Referer': flt_page,
                'X-Requested-With': 'XMLHttpRequest'
            })
            try:
                with self.opener.open(req_loc) as r_loc:
                    r_loc.read()
            except Exception as e:
                print(f"Location switch error for {loc}:", e)

            # 2. Запрос списка рейсов для выбранной станции
            payload = f"destination=null&planeType=null&departureDate={start_date}&rout=&flightTpe=null&endDate={end_date}&companyId=&_token={self.auth_token}"
            req_flt = urllib.request.Request(flt_ajax, data=payload.encode('utf-8'), headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Referer': flt_page,
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            })

            try:
                with self.opener.open(req_flt) as r_flt:
                    flt_body = r_flt.read().decode('utf-8', errors='ignore')
            except Exception as e:
                print(f"Error fetching flights for {loc}:", e)
                continue

            # Парсинг строк таблицы
            tr_matches = re.findall(r'<tr[^>]*>([\s\S]*?)</tr>', flt_body, re.IGNORECASE)
            for tr in tr_matches:
                clean_tds = [re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', td)).strip() for td in re.findall(r'<td[^>]*>([\s\S]*?)</td>', tr)]
                if len(clean_tds) < 7:
                    continue

                raw_status = ''
                for td in clean_tds:
                    if any(st in td for st in ['Finalize', 'Open', 'Close', 'Boarding']):
                        raw_status = td
                        break
                if not raw_status and len(clean_tds) > 6:
                    raw_status = clean_tds[6]

                is_finalized = ('Finalize' in raw_status or 'FINALIZE' in raw_status.upper())
                if only_finalized and not is_finalized:
                    continue

                # Извлекаем параметры вызова манифеста
                manifest_calls = re.findall(r'flightManifestoListCheckin\(([^)]+)\)', tr)
                flight_no = ''
                flight_date_raw = ''
                dest_code = ''
                dep_code = loc
                manifest_args = None

                if manifest_calls:
                    manifest_args = [a.strip(" '\"") for a in manifest_calls[0].split(',')]
                    if len(manifest_args) >= 6:
                        flight_date_raw = manifest_args[1]
                        flight_no = manifest_args[2]
                        dest_code = manifest_args[4]
                        dep_code = manifest_args[5] or loc

                if not flight_no and len(clean_tds) > 1:
                    flight_no = clean_tds[1]
                if not dest_code and len(clean_tds) > 2:
                    rm = re.search(r'([A-Z]{3})\s*-\s*([A-Z]{3})', clean_tds[2])
                    if rm:
                        dep_code = rm.group(1)
                        dest_code = rm.group(2)

                # Нормализация даты
                clean_date = ''
                dm = re.search(r'(\d{2})/(\d{2})/(\d{4})', (clean_tds[0] if clean_tds else '') + ' ' + flight_date_raw)
                if dm:
                    clean_date = f"{dm.group(3)}-{dm.group(2)}-{dm.group(1)}"
                    if not flight_date_raw:
                        flight_date_raw = f"{dm.group(1)}/{dm.group(2)}/{dm.group(3)}"

                if not flight_no or not dest_code:
                    continue

                # Дедупликация в рамках одного ответа (чтобы не парсить один и тот же рейс несколько раз)
                flight_key = f"{flight_no}_{clean_date}_{dep_code}_{dest_code}"
                if any(f.get('id') == f"dcs_{re.sub(r'[^A-Za-z0-9]', '', flight_no)}_{clean_date}_{dep_code}_{dest_code}" for f in all_flights):
                    continue

                # Получаем манифест рейса
                manifest_data = self.get_manifest(flight_no, flight_date_raw, dest_code, dep_code, manifest_args)

                flight_item = {
                    'id': f"dcs_{re.sub(r'[^A-Za-z0-9]', '', flight_no)}_{clean_date}_{dep_code}_{dest_code}",
                    'airline': flight_no[:2] if len(flight_no) >= 2 else 'N4',
                    'flight_no': flight_no,
                    'flight_date': clean_date,
                    'departure_date_raw': flight_date_raw,
                    'departure_code': dep_code,
                    'dest_code': dest_code,
                    'route': f"{dep_code} → {dest_code}",
                    'aircraft': clean_tds[3] if len(clean_tds) > 3 else '',
                    'status': raw_status,
                    'is_finalized': is_finalized,
                    'men': manifest_data.get('men', 0),
                    'women': manifest_data.get('women', 0),
                    'vz': manifest_data.get('vz', 0),
                    'rb': manifest_data.get('rb', 0),
                    'rm': manifest_data.get('rm', 0),
                    'pax': manifest_data.get('pax', 0),
                    'bag_pcs': manifest_data.get('bag_pcs', 0),
                    'bag_weight': manifest_data.get('bag_weight', 0.0),
                    'hb_pcs': manifest_data.get('hb_pcs', 0),
                    'hb_weight': manifest_data.get('hb_weight', 0.0),
                    'zones': manifest_data.get('zones', {})
                }
                all_flights.append(flight_item)

        # Сверка с существующей базой baggage_db.json
        db_path = os.path.join(BASE_DIR, 'baggage_db.json')
        existing_keys = set()
        if os.path.exists(db_path):
            try:
                with open(db_path, 'r', encoding='utf-8') as f:
                    db_json = json.load(f)
                    if isinstance(db_json, list):
                        for item in db_json:
                            k = f"{item.get('flight_no','')}_{item.get('date','')}_{item.get('from','')}_{item.get('to','')}"
                            existing_keys.add(k)
            except Exception as e:
                print("DB read check error:", e)

        for flt in all_flights:
            k = f"{flt['flight_no']}_{flt['flight_date']}_{flt['departure_code']}_{flt['dest_code']}"
            flt['already_in_db'] = (k in existing_keys)

        return {
            'success': True,
            'count': len(all_flights),
            'flights': all_flights
        }

    def get_manifest(self, flight_no, departure_date, dest_code, departure, manifest_args=None):
        mani_url = self.base_url + '/ADSDCS/ajax/manifest/ajaxManifestFlightInfo.jsp'
        flt_page = self.base_url + '/ADSDCS/flightManagement/flightListsInfo.jsp'

        # Всегда запрашиваем зарегистрированных пассажиров (f_checkin=1) для соответствия Checked in Passengers
        f_checkin = '1'
        mani_sort = manifest_args[3] if manifest_args and len(manifest_args) > 3 else '0'

        mani_data = urllib.parse.urlencode({
            'f_checkin': f_checkin,
            'flightNumber': flight_no,
            'departureDate': departure_date,
            'manifestoSort': mani_sort,
            'destCode': dest_code,
            'departure': departure,
            '_token': self.auth_token
        }).encode('utf-8')

        req_m = urllib.request.Request(mani_url, data=mani_data, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Referer': flt_page,
            'X-Requested-With': 'XMLHttpRequest'
        })

        try:
            with self.opener.open(req_m) as rm:
                m_html = rm.read().decode('utf-8', errors='ignore')
        except Exception as e:
            print("Manifest fetch error:", e)
            return {}

        return self.parse_manifest_html(m_html)

    def parse_manifest_html(self, html):
        data = {
            'total_pax': 0, 'men': 0, 'women': 0, 'vz': 0,
            'rb': 0, 'rm': 0, 'pax': 0, 'bag_pcs': 0,
            'bag_weight': 0.0, 'hb_pcs': 0, 'hb_weight': 0.0, 'zones': {}
        }

        tot = re.search(r'<tr[^>]*>[\s\S]*?Total[\s\S]*?</tr>', html, re.IGNORECASE)
        if tot:
            cells = [re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', td)).strip() for td in re.findall(r'<td[^>]*>([\s\S]*?)</td>', tot.group(0), re.IGNORECASE)]
            tot_idx = -1
            for i, c in enumerate(cells):
                if 'Total' in c:
                    tot_idx = i
                    break

            if tot_idx != -1 and len(cells) > tot_idx + 5:
                def to_int(v):
                    try: return int(re.sub(r'[^\d]', '', v))
                    except: return 0
                def to_float(v):
                    try: return float(re.sub(r'[^\d.]', '', v.replace(',', '.')))
                    except: return 0.0

                total_pax = to_int(cells[tot_idx + 1])
                men = to_int(cells[tot_idx + 2])
                women = to_int(cells[tot_idx + 3])
                chd = to_int(cells[tot_idx + 4])
                inf = to_int(cells[tot_idx + 5])

                # Багаж и ручная кладь в конце строки
                num_tail = []
                for k in range(tot_idx + 6, len(cells)):
                    val = re.sub(r'[^\d.]', '', cells[k].replace(',', '.'))
                    if val:
                        try: num_tail.append(float(val))
                        except: pass

                bag_pcs = 0; bag_wt = 0.0; hb_pcs = 0; hb_wt = 0.0
                if len(num_tail) >= 4:
                    bag_pcs = int(num_tail[-4])
                    bag_wt  = float(num_tail[-3])
                    hb_pcs  = int(num_tail[-2])
                    hb_wt   = float(num_tail[-1])

                data['total_pax'] = total_pax
                data['men'] = men
                data['women'] = women
                data['vz'] = men + women
                data['rb'] = chd
                data['rm'] = inf
                data['pax'] = men + women + chd
                data['bag_pcs'] = bag_pcs
                data['bag_weight'] = bag_wt
                data['hb_pcs'] = hb_pcs
                data['hb_weight'] = hb_wt

        return data


class AeroBagRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        parsed_path = urllib.parse.urlparse(self.path)
        
        # Обработка DCS API запросов
        if parsed_path.path in ['/api/dcs_sync', '/lydia_dcs_sync.php']:
            query_params = urllib.parse.parse_qs(parsed_path.query)
            action = query_params.get('action', [''])[0]

            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len) if content_len > 0 else b''
            
            try:
                payload = json.loads(post_body.decode('utf-8')) if post_body else {}
            except:
                payload = dict(urllib.parse.parse_qsl(post_body.decode('utf-8')))

            if not action:
                action = payload.get('action', '')

            config = load_dcs_config()
            scraper = DcsScraper(config)

            if action == 'test_connection':
                res = scraper.login(payload.get('username'), payload.get('password'))
                self._send_json(res)
                return

            elif action == 'scan_flights':
                s_date = payload.get('start_date', '08/09/2026')
                e_date = payload.get('end_date', '09/09/2026')
                locs = payload.get('locations') or config.get('default_locations')
                if isinstance(locs, str): locs = [l.strip() for l in locs.split(',') if l.strip()]
                only_fin = payload.get('only_finalized', True)
                if isinstance(only_fin, str): only_fin = (only_fin.lower() in ['true', '1', 'yes'])

                res = scraper.scan_flights(s_date, e_date, locs, only_fin)
                self._send_json(res)
                return

            elif action == 'save_to_database':
                flights_to_save = payload.get('flights', [])
                if not flights_to_save:
                    self._send_json({'success': False, 'error': 'Нет рейсов для сохранения.'})
                    return

                # Сохраняем в baggage_db.json
                db_path = os.path.join(BASE_DIR, 'baggage_db.json')
                current_db = []
                if os.path.exists(db_path):
                    try:
                        with open(db_path, 'r', encoding='utf-8') as f:
                            current_db = json.load(f)
                            if not isinstance(current_db, list): current_db = []
                    except: current_db = []

                db_map = {}
                for idx, item in enumerate(current_db):
                    k = f"{item.get('flight_no','')}_{item.get('date','')}_{item.get('from','')}_{item.get('to','')}"
                    db_map[k] = idx

                saved_count = 0
                for f in flights_to_save:
                    clean_item = {
                        'id': f.get('id', f"dcs_{os.urandom(4).hex()}"),
                        'airline': f.get('airline', 'N4'),
                        'flight_no': f.get('flight_no', ''),
                        'date': f.get('flight_date', ''),
                        'from': f.get('departure_code', 'DYU'),
                        'to': f.get('dest_code', 'UFA'),
                        'men': int(f.get('men', 0)),
                        'women': int(f.get('women', 0)),
                        'rb': int(f.get('rb', 0)),
                        'rm': int(f.get('rm', 0)),
                        'pax': int(f.get('pax', 0)),
                        'bag_pcs': int(f.get('bag_pcs', 0)),
                        'bag_weight': float(f.get('bag_weight', 0)),
                        'hb_weight': float(f.get('hb_weight', 0)),
                        'source': 'Lydia DCS',
                        'active': True
                    }
                    k = f"{clean_item['flight_no']}_{clean_item['date']}_{clean_item['from']}_{clean_item['to']}"
                    if k in db_map:
                        current_db[db_map[k]].update(clean_item)
                    else:
                        current_db.append(clean_item)
                        db_map[k] = len(current_db) - 1
                    saved_count += 1

                with open(db_path, 'w', encoding='utf-8') as f:
                    json.dump(current_db, f, ensure_ascii=False, indent=2)

                self._send_json({
                    'success': True,
                    'message': f"Успешно сохранено рейсов: {saved_count}",
                    'saved_count': saved_count
                })
                return

            else:
                self._send_json({'success': False, 'error': f'Неизвестное действие: {action}'})
                return

        # Для всех остальных запросов — стандартная раздача файлов
        super().do_POST()

    def _send_json(self, data):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

if __name__ == '__main__':
    os.chdir(BASE_DIR)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), AeroBagRequestHandler) as httpd:
        print(f"================================================================")
        print(f" [AeroBag + Lydia DCS Server] Запущен на http://localhost:{PORT}")
        print(f"================================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nСервер остановлен.")
