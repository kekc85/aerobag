// AeroBag Predictor Application Logic

// Глобальное состояние
let baggageDb = null;
let userFlights = [];
let predictionsHistory = [];
let currentLang = 'ru';
let currentTheme = 'dark';
let isAdminAuthenticated = false;
let isOfflineMode = false;
let isAutoSelectingRoute = false;
let currentActivePredictionId = null; // ID активного рейса из Истории расчетов (для сохранения раскладки отсеков)

// Отладка ошибок прямо на экране
window.addEventListener('error', function(e) {
    if (typeof showAviationAlert === 'function') {
        showAviationAlert("ERR: " + e.message + " (" + e.filename + ":" + e.lineno + ")", true);
    }
});
window.addEventListener('unhandledrejection', function(e) {
    if (typeof showAviationAlert === 'function') {
        showAviationAlert("PROMISE REJECTION: " + e.reason, true);
    }
});

// Словари локализации
const translations = {
    ru: {
        'app-title': 'AeroBag Predictor: Расчет Веса Багажа',
        'logo-sub': 'КОНТРОЛЬ ЗАГРУЗКИ РЕЙСОВ',
        'status-dispatch': 'ДИСПЕТЧЕР ОНЛАЙН',
        'status-local': 'ЛОКАЛЬНЫЙ РЕЖИМ (OFFLINE)',
        'tab-predict': 'Прогнозирование',
        'tab-admin': 'Администрирование',
        'predict-title': 'Прогнозирование рейса',
        'label-from': 'Аэропорт вылета (FROM)',
        'label-to': 'Аэропорт прилета (TO)',
        'select-from-first': 'Сначала выберите аэропорт вылета',
        'label-flight-no': 'Номер рейса',
        'placeholder-flight-no': 'Введите номер рейса (напр. 505)',
        'select-all-flights': 'Все рейсы',
        'label-pax': 'Пассажиры (PAX)',
        'btn-calculate': 'Рассчитать прогноз',
        'manual-title': 'Вручную добавить рейс',
        'label-airline': 'Авиакомпания',
        'label-flight-num': 'Рейс №',
        'label-date': 'Дата',
        'label-from-airport': 'Вылет (FROM)',
        'label-to-airport': 'Прилет (TO)',
        'pax-distribution': 'Распределение пассажиров',
        'pax-men': 'Мужчины',
        'pax-women': 'Женщины',
        'pax-rb': 'РБ (Дети)',
        'pax-rm': 'РМ (Млад.)',
        'actual-baggage-title': 'Фактические данные (для базы)',
        'label-bag-pcs': 'Мест багажа',
        'label-bag-weight': 'Вес багажа (кг)',
        'label-hb-weight': 'Р/кладь (кг)',
        'btn-add-flight': 'Добавить рейс в базу',
        'results-title': 'Ожидаемые параметры багажа',
        'res-bag-pcs': 'Мест багажа (PCS)',
        'res-bag-weight': 'Вес багажа (Baggage Weight)',
        'res-hb-weight': 'Вес ручной клади (Cabin Bag)',
        'applied-coeffs': 'Примененные коэффициенты',
        'coef-pcs-pax': 'Мест на 1 пасс. (PCS/PAX)',
        'coef-weight-pc': 'Вес 1 места (Weight/PC)',
        'coef-hb-pax': 'Ручная кладь на 1 пасс. (HB/PAX)',
        'coef-source-label': 'Источник данных для расчета:',
        'upload-title': 'Загрузка файлов системы регистрации',
        'drop-text': 'Перетащите файлы .xls / .xlsx сюда или нажмите для выбора',
        'drop-sub': 'Поддержка SpreadsheetML 2003 (.xls) и Excel (.xlsx)',
        'total-flights-label': 'Всего рейсов в базе:',
        'active-flights-label': 'Активных (30 дней):',
        'chk-show-all-flights': 'Показать все рейсы',
        'flights-table-title': 'База данных рейсов (последние 10 дней)',
        'flights-table-title-all': 'База данных рейсов (все)',
        'btn-clear-db': 'Очистить базу',
        'th-airline': 'АК',
        'th-flight': 'Рейс',
        'th-date': 'Дата',
        'th-route': 'Маршрут',
        'th-pax': 'Пассажиры (ВЗ / РБ / РМ)',
        'th-bag-pcs': 'Багаж мест',
        'th-bag-weight': 'Вес багажа',
        'th-hb-weight': 'Вес р/к',
        'th-status': 'Статус',
        'th-action': 'Действие',
        'empty-table': 'База данных пуста. Загрузите отчеты или введите рейс вручную.',
        'status-active': 'Активен',
        'status-inactive': 'Вне 30 дней',
        'source-desc-historical': 'Историческая база данных (Июль 2026)',
        'source-desc-uploaded-30': 'Загруженные данные за последние 30 дней',
        'source-desc-uploaded-closest': 'Загруженные данные за ближайшую дату ({date})',
        'source-desc-default': 'Среднеотраслевые стандарты (Дефолт)',
        'warning-no-flights-30': 'Внимание! За последние 30 дней по рейсу {flight} {from}➔{to} данных нет. Использован ближайший рейс от {date}.',
        'warning-no-route-30': 'Внимание! За последние 30 дней по направлению {from}➔{to} данных нет. Использован ближайший рейс от {date}.',
        'error-fields-required': 'Пожалуйста, заполните все обязательные поля!',
        'success-flight-added': 'Рейс успешно добавлен в базу!',
        'confirm-clear-db': 'Вы уверены, что хотите очистить всю базу данных рейсов?',
        'file-processed-success': 'Файл "{name}" успешно обработан. Загружено {count} рейсов, отфильтровано {skipped} невылетных направлений.',
        'file-process-error': 'Ошибка при чтении файла "{name}". Проверьте структуру.',
        'select-all-flights-placeholder': 'Все рейсы',
        'theme-light': 'Светлая тема',
        'theme-dark': 'Темная тема',
        'unit-kg': 'кг',
        // Новые строки для истории прогнозов
        'predictions-table-title': 'История расчетов прогнозов',
        'btn-clear-predictions': 'Очистить историю',
        'th-pax-count': 'Пассажиры (PAX)',
        'th-calc-date': 'Дата расчета',
        'empty-predictions-table': 'История прогнозов пуста. Сделайте расчет выше.',
        'confirm-clear-predictions': 'Вы уверены, что хотите очистить всю историю прогнозов?',
        'modal-confirm-title': '[\u00A0ТРЕБУЕТСЯ\u00A0ДЕЙСТВИЕ:\u00A0ОЧИСТКА\u00A0СИСТЕМЫ\u00A0]',
        'modal-confirm-cancel': '[\u00A0ОТМЕНА\u00A0]',
        'modal-confirm-submit': '[\u00A0ПОДТВЕРДИТЬ\u00A0ОЧИСТКУ\u00A0]',
        'btn-load-sample': 'Загрузить системную статистику',
        'btn-transfer-preliminary': '[ ⬇️ ПЕРЕНЕСТИ В PRELIMINARY ]',
        'load-planning-title': '[ СРЕДНИЙ ВЕС БАГАЖА И ДАННЫЕ ЗАГРУЗКИ ]',
        'load-planning-sub-title': 'ДАННЫЕ РАСПРЕДЕЛЕНИЯ БАГАЖА',
        'th-status-cat': 'СТАТУС',
        'th-pax-no': 'ПАССАЖИРЫ',
        'th-pcs': 'МЕСТА',
        'th-weight': 'ВЕС (кг)',
        'th-avg-bag-weight': 'СРЕДНИЙ ВЕС БАГАЖА',
        'th-avg-bag-pax': 'МЕСТ НА ПАССАЖИРА',
        'row-preliminary': 'ПРЕДВАРИТЕЛЬНЫЙ',
        'row-lir-final': 'LIR / ФИНАЛЬНЫЙ',
        'header-uld': 'ULD (Контейнеры)',
        'header-bulk': 'BULK (Багажники)',
        'th-uld-no': '№ ULD',
        'th-cpt-sec': 'ОТСЕК',
        'row-rest': 'ОСТАТОК',
        'row-ttl': 'ИТОГО',
        'admin-auth-title': '[ ОГРАНИЧЕННЫЙ ДОСТУП: АВТОРИЗАЦИЯ ]',
        'admin-auth-desc': 'Внимание! Для доступа к разделу "Администрирование" требуется ввод пароля диспетчера:',
        'admin-auth-label': 'ПАРОЛЬ ДОСТУПА',
        'admin-auth-error': '❌ Неверный пароль доступа!',
        'admin-auth-cancel': '[ ОТМЕНА ]',
        'admin-auth-submit': '[ ВОЙТИ ]',
        
        // Аналитические параметры
        'analysis-settings-title': 'ПАРАМЕТРЫ АНАЛИЗА И СЕЗОННОСТИ',
        'label-analysis-scope': 'Область сопоставления (Matching Scope)',
        'opt-scope-auto': 'Автомат (Рейс ➔ Направление)',
        'opt-scope-flight': 'Только выбранный рейс',
        'opt-scope-route': 'Всё направление (Маршрут)',
        'label-period-type': 'Период анализа данных (Data Period)',
        'opt-period-weekday4': 'Последние 4 рейса (по дням недели) (По умолчанию)',
        'opt-period-30days': 'Последние 30 дней',
        'opt-period-custom': 'Произвольный диапазон',
        'opt-period-seasonal': 'Сезонный месяц',
        'label-flight-date': 'Дата рейса',
        'sampled-flights-title': 'Отобранные рейсы для расчета ({count} вып.):',
        'th-sample-date': 'Дата (день)',
        'th-sample-flight': 'Рейс',
        'th-sample-pax': 'Пасс.',
        'th-sample-pcs': 'Багаж',
        'th-sample-weight': 'Вес баг.',
        'th-sample-hb': 'Р/кладь',
        'sample-totals-label': 'ИТОГО (СУММЫ):',
        'source-desc-uploaded-weekday4': 'Последние 4 рейса ({weekday}) ({scope})',
        'source-desc-uploaded-weekday4-fallback': 'Среднее за ближайшие 30 дней до вылета ({scope}, последний рейс от {date})',
        'warning-no-flights-weekday4': 'Внимание! По рейсу {flight} {from}➔{to} нет данных на {weekday} за последние 60 дней. Использовано среднее значение за ближайшие 30 дней до вылета (последний рейс от {date}).',
        'warning-no-route-weekday4': 'Внимание! По направлению {from}➔{to} нет данных на {weekday} за последние 60 дней. Использовано среднее значение за ближайшие 30 дней до вылета (последний рейс от {date}).',
        'label-start-date': 'Дата начала (From)',
        'label-end-date': 'Дата окончания (To)',
        'label-month': 'Месяц (Month)',
        'label-year': 'Год (Year)',
        'opt-all-years': 'Все года',
        'month-jan': 'Январь',
        'month-feb': 'Февраль',
        'month-mar': 'Март',
        'month-apr': 'Апрель',
        'month-may': 'Май',
        'month-jun': 'Июнь',
        'month-jul': 'Июль',
        'month-aug': 'Август',
        'month-sep': 'Сентябрь',
        'month-oct': 'Октябрь',
        'month-nov': 'Ноябрь',
        'month-dec': 'Декабрь',
        'source-desc-uploaded-custom': 'Загруженные данные с {start} по {end} ({scope})',
        'source-desc-uploaded-seasonal': 'Загруженные данные за {month} {year} ({scope})',
        'scope-flight': 'Рейс',
        'scope-route': 'Направление',
        
        // Резервное копирование
        'btn-export-db': 'Экспорт базы (Backup)',
        'btn-import-db': 'Импорт базы (Restore)',
        'backup-import-success': 'База данных успешно восстановлена! Загружено {flights} рейсов и {predictions} прогнозов.',
        'backup-import-error': 'Ошибка чтения файла резервной копии. Убедитесь, что формат файла верен.',
        'btn-manual': 'Руководство'
    },
    en: {
        'app-title': 'AeroBag Predictor: Baggage Weight Calculator',
        'logo-sub': 'FLIGHT OPS CONTROL',
        'status-dispatch': 'DISPATCH ONLINE',
        'status-local': 'LOCAL MODE (OFFLINE)',
        'tab-predict': 'Forecasting',
        'tab-admin': 'Administration',
        'predict-title': 'Flight Forecasting',
        'label-from': 'Departure Airport (FROM)',
        'label-to': 'Arrival Airport (TO)',
        'select-from-first': 'Select departure airport first',
        'label-flight-no': 'Flight Number',
        'placeholder-flight-no': 'Enter flight number (e.g. 505)',
        'select-all-flights': 'All Flights',
        'label-pax': 'Passengers (PAX)',
        'btn-calculate': 'Calculate Forecast',
        'manual-title': 'Add Flight Manually',
        'label-airline': 'Airline',
        'label-flight-num': 'Flight No.',
        'label-date': 'Date',
        'label-from-airport': 'Departure (FROM)',
        'label-to-airport': 'Arrival (TO)',
        'pax-distribution': 'Passenger Distribution',
        'pax-men': 'Male',
        'pax-women': 'Female',
        'pax-rb': 'Children (CHD)',
        'pax-rm': 'Infants (INF)',
        'actual-baggage-title': 'Actual Baggage (for Database)',
        'label-bag-pcs': 'Baggage Pieces',
        'label-bag-weight': 'Baggage Weight (kg)',
        'label-hb-weight': 'Cabin Bag (kg)',
        'btn-add-flight': 'Add Flight to DB',
        'results-title': 'Expected Baggage Parameters',
        'res-bag-pcs': 'Baggage Pieces (PCS)',
        'res-bag-weight': 'Baggage Weight',
        'res-hb-weight': 'Cabin Bag Weight',
        'applied-coeffs': 'Applied Coefficients',
        'coef-pcs-pax': 'Pieces per Pax (PCS/PAX)',
        'coef-weight-pc': 'Weight per Piece (Weight/PC)',
        'coef-hb-pax': 'Cabin Bag per Pax (HB/PAX)',
        'coef-source-label': 'Calculation source:',
        'upload-title': 'Upload Registration Reports',
        'drop-text': 'Drag & Drop .xls / .xlsx files here or click to select',
        'drop-sub': 'Supports SpreadsheetML 2003 (.xls) and Excel (.xlsx)',
        'total-flights-label': 'Total flights in DB:',
        'active-flights-label': 'Active (30 days):',
        'chk-show-all-flights': 'Show all flights',
        'flights-table-title': 'Flights Database (last 10 days)',
        'flights-table-title-all': 'Flights Database (all)',
        'btn-clear-db': 'Clear Database',
        'th-airline': 'AL',
        'th-flight': 'Flight',
        'th-date': 'Date',
        'th-route': 'Route',
        'th-pax': 'Passengers (Adult / Child / Infant)',
        'th-bag-pcs': 'Baggage Pcs',
        'th-bag-weight': 'Baggage Weight',
        'th-hb-weight': 'Cabin Bag Weight',
        'th-status': 'Status',
        'th-action': 'Action',
        'empty-table': 'Database is empty. Upload reports or add a flight manually.',
        'status-active': 'Active',
        'status-inactive': 'Out of 30 days',
        'source-desc-historical': 'Historical Database (July 2026)',
        'source-desc-uploaded-30': 'Uploaded data for the last 30 days',
        'source-desc-uploaded-closest': 'Uploaded data for the closest date ({date})',
        'source-desc-default': 'Industry standards (Default)',
        'warning-no-flights-30': 'Warning! No data for flight {flight} {from}➔{to} in the last 30 days. Used closest flight from {date}.',
        'warning-no-route-30': 'Warning! No data for route {from}➔{to} in the last 30 days. Used closest flight from {date}.',
        'error-fields-required': 'Please fill in all required fields!',
        'success-flight-added': 'Flight successfully added to database!',
        'confirm-clear-db': 'Are you sure you want to clear the entire flights database?',
        'file-processed-success': 'File "{name}" successfully processed. Loaded {count} flights, skipped {skipped} non-departure destinations.',
        'file-process-error': 'Error reading file "{name}". Check its structure.',
        'select-all-flights-placeholder': 'All flights',
        'theme-light': 'Light Theme',
        'theme-dark': 'Dark Theme',
        'unit-kg': 'kg',
        // New strings for predictions history
        'predictions-table-title': 'Prediction Calculation History',
        'btn-clear-predictions': 'Clear History',
        'th-pax-count': 'Passengers (PAX)',
        'th-calc-date': 'Calculation Date',
        'empty-predictions-table': 'Predictions history is empty. Calculate a forecast above.',
        'confirm-clear-predictions': 'Are you sure you want to clear the entire predictions history?',
        'modal-confirm-title': '[\u00A0ACTION\u00A0REQUIRED:\u00A0SYSTEM\u00A0PURGE\u00A0]',
        'modal-confirm-cancel': '[\u00A0CANCEL\u00A0]',
        'modal-confirm-submit': '[\u00A0CONFIRM\u00A0PURGE\u00A0]',
        'btn-load-sample': '[ LOAD SYSTEM STATISTICS ]',
        'btn-transfer-preliminary': '[ ⬇️ TRANSFER TO PRELIMINARY ]',
        'load-planning-title': '[ AVERAGE BAGGAGE WEIGHT & LOAD PLANNING DATA ]',
        'load-planning-sub-title': 'BAGGAGE DISTRIBUTION (LOAD PLANNING DATA)',
        'th-status-cat': 'STATUS',
        'th-pax-no': 'PAX NO',
        'th-pcs': 'PCS',
        'th-weight': 'WEIGHT (kg)',
        'th-avg-bag-weight': 'AVERAGE BAG WEIGHT',
        'th-avg-bag-pax': 'AVERAGE BAG NO/PAX',
        'row-preliminary': 'PRELIMINARY',
        'row-lir-final': 'LIR OR FINAL',
        'header-uld': 'ULD (Containers)',
        'header-bulk': 'BULK (Loose Cargo)',
        'th-uld-no': 'ULD NO',
        'th-cpt-sec': 'CPT/SEC',
        'row-rest': 'REST',
        'row-ttl': 'TTL',
        
        // Admin Auth translations in EN
        'admin-auth-title': '[ RESTRICTED ACCESS: AUTHORIZATION ]',
        'admin-auth-desc': 'Attention! Dispatcher password is required to access "Administration":',
        'admin-auth-label': 'ACCESS PASSWORD',
        'admin-auth-error': '❌ Incorrect access password!',
        'admin-auth-cancel': '[ CANCEL ]',
        'admin-auth-submit': '[ ENTER ]',
        
        // Analytical settings
        'analysis-settings-title': 'ANALYSIS & SEASONALITY SETTINGS',
        'label-analysis-scope': 'Matching Scope',
        'opt-scope-auto': 'Auto (Flight ➔ Route)',
        'opt-scope-flight': 'Strict Flight Match',
        'opt-scope-route': 'Entire Route (Ignore Flight No)',
        'label-period-type': 'Analysis Period (Data Period)',
        'opt-period-weekday4': 'Last 4 Flights (by weekday) (Default)',
        'opt-period-30days': 'Last 30 Days',
        'opt-period-custom': 'Custom Date Range',
        'opt-period-seasonal': 'Seasonal Month',
        'label-flight-date': 'Flight Date',
        'sampled-flights-title': 'Selected Flights for Calculation ({count} flts):',
        'th-sample-date': 'Date (Day)',
        'th-sample-flight': 'Flight',
        'th-sample-pax': 'Pax',
        'th-sample-pcs': 'Baggage',
        'th-sample-weight': 'Baggage Wt',
        'th-sample-hb': 'Cabin Bag',
        'sample-totals-label': 'TOTALS:',
        'source-desc-uploaded-weekday4': 'Last 4 flights ({weekday}) ({scope})',
        'source-desc-uploaded-weekday4-fallback': 'Average for 30 days prior to departure ({scope}, latest flight from {date})',
        'warning-no-flights-weekday4': 'Warning! No data on {weekday} for flight {flight} {from}➔{to} for the last 60 days. Used average for 30 days prior to departure (latest flight from {date}).',
        'warning-no-route-weekday4': 'Warning! No data on {weekday} for route {from}➔{to} for the last 60 days. Used average for 30 days prior to departure (latest flight from {date}).',
        'label-start-date': 'Start Date (From)',
        'label-end-date': 'End Date (To)',
        'label-month': 'Month',
        'label-year': 'Year',
        'opt-all-years': 'All Years',
        'month-jan': 'January',
        'month-feb': 'February',
        'month-mar': 'March',
        'month-apr': 'April',
        'month-may': 'May',
        'month-jun': 'June',
        'month-jul': 'July',
        'month-aug': 'August',
        'month-sep': 'September',
        'month-oct': 'October',
        'month-nov': 'November',
        'month-dec': 'December',
        'source-desc-uploaded-custom': 'Uploaded data from {start} to {end} ({scope})',
        'source-desc-uploaded-seasonal': 'Uploaded data for {month} {year} ({scope})',
        'scope-flight': 'Flight',
        'scope-route': 'Route',
        
        // Backups
        'btn-export-db': 'Export Database (Backup)',
        'btn-import-db': 'Import Database (Restore)',
        'backup-import-success': 'Database successfully restored! Loaded {flights} flights and {predictions} predictions.',
        'backup-import-error': 'Error reading backup file. Make sure file format is correct.',
        'btn-manual': 'Manual'
    }
};

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ КОДОВ АЭРОПОРТОВ (ИАТА <-> Русский) ---

// Проверка на мусорные строки заголовков таблицы Excel
function isHeaderGarbage(str) {
    if (!str) return true;
    const clean = String(str).trim().toLowerCase();
    if (clean.length < 2) return true;
    const exactHeaderWords = [
        'код а/п', 'код а/к', 'номер рейса', 'направление', 'код', 'а/п', 'а/к', 'рейс',
        'flt', 'flight', 'airline', 'direction', 'from', 'to', 'дата', 'date', 'пасс', 'pax',
        'взрослые', 'дети', 'ручная', 'багаж', 'мест', 'вес', 'ние', 'всего', 'номер'
    ];
    return exactHeaderWords.includes(clean);
}

function ruToIata(ruCode) {
    if (!ruCode) return '';
    const cleanCode = String(ruCode).trim().toUpperCase();
    if (!baggageDb || !baggageDb.airports) {
        return cleanCode;
    }
    
    if (baggageDb.airports[cleanCode]) {
        return baggageDb.airports[cleanCode].iata;
    }
    
    const found = Object.values(baggageDb.airports).find(ap => 
        (ap.ru && ap.ru.trim().toUpperCase() === cleanCode) ||
        (ap.iata && ap.iata.trim().toUpperCase() === cleanCode) ||
        (ap.name && ap.name.trim().toUpperCase() === cleanCode) ||
        (ap.city && ap.city.trim().toUpperCase() === cleanCode)
    );
    if (found) {
        return found.iata;
    }
    
    return cleanCode;
}

// Парсинг чистого 3-буквенного ИАТА кода из сложных строк отчета (напр. "ЕКАТЕРИНБУРГ AER-SVX", "КАЗАНЬ AER-KZN", "БОХТАР KQT-UFA")
function parseCleanAirportCode(rawStr) {
    if (!rawStr) return '';
    const str = String(rawStr).trim();
    if (str.length === 3 && /^[A-ZА-Я]{3}$/i.test(str)) {
        return ruToIata(str) || str;
    }
    const words = str.split(/\s+/);
    const firstWordCode = ruToIata(words[0]);
    if (firstWordCode && firstWordCode.length === 3 && baggageDb && baggageDb.airports && baggageDb.airports[firstWordCode]) {
        return firstWordCode;
    }
    const tokens = str.match(/[A-ZА-Я]{3}/gi) || [];
    for (const t of tokens) {
        const code = ruToIata(t);
        if (code && code.length === 3 && baggageDb && baggageDb.airports && baggageDb.airports[code]) {
            return code;
        }
    }
    return ruToIata(str) || str;
}

function iataToRu(iataCode) {
    if (!baggageDb || !baggageDb.airports) {
        return iataCode;
    }
    const ap = Object.values(baggageDb.airports).find(a => a.iata === iataCode);
    return ap ? ap.ru : iataCode;
}

// Вспомогательная функция для получения количества пассажиров без учета младенцев (ВЗ + РБ, без РМ)
function getEffectivePaxCount(f) {
    if (!f) return 0;
    const men = parseInt(f.men) || 0;
    const women = parseInt(f.women) || 0;
    const rb = parseInt(f.rb) || 0;
    const rm = parseInt(f.rm) || 0;

    if (men > 0 || women > 0 || rb > 0) {
        return men + women + rb;
    }

    const rawPax = parseInt(f.pax) || 0;
    if (rawPax > 0) {
        return Math.max(0, rawPax - rm);
    }

    return 0;
}

function formatAirline(code) {
    if (!code) return 'N4';
    const clean = String(code).trim().toUpperCase();

    // N4 / Nordwind / Нордвинд / Н4 / КЛ / KL
    if (clean === 'N4' || clean === 'Н4' || clean === 'КЛ' || clean === 'KL' || clean.includes('NORD') || clean.includes('НОРД')) {
        return 'N4';
    }

    // EO / Ikar / Икар / КАР / KAR
    if (clean === 'EO' || clean === 'ЕО' || clean.includes('IKAR') || clean.includes('ИКАР') || clean.includes('KAR') || clean.includes('КАР')) {
        return 'EO';
    }

    return code;
}

// Надежный форматировщик дат из Excel в YYYY-MM-DD без UTC-сдвига на +1 день
function formatExcelDate(rawDate) {
    if (!rawDate) return new Date().toISOString().split('T')[0];
    
    // Если передана дата как числовой серийный код Excel (например 46097)
    const num = Number(rawDate);
    if (!isNaN(num) && num > 30000 && num < 100000) {
        if (typeof XLSX !== 'undefined' && XLSX.SSF && XLSX.SSF.parse_date_code) {
            const parsed = XLSX.SSF.parse_date_code(num);
            if (parsed && parsed.y && parsed.m && parsed.d) {
                return `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
            }
        }
        const jsDate = new Date(Math.round((num - 25569) * 86400 * 1000));
        const year = jsDate.getUTCFullYear();
        const month = String(jsDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(jsDate.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const str = String(rawDate).trim();
    if (!str) return new Date().toISOString().split('T')[0];

    // Разбор форматов DD.MM.YYYY или DD.MM.YY (например 01.07.2026 или 01.07.26)
    if (str.includes('.')) {
        const parts = str.split('.');
        if (parts.length === 3) {
            let day = parseInt(parts[0], 10);
            let month = parseInt(parts[1], 10);
            let year = parseInt(parts[2], 10);
            if (year < 100) year += 2000;
            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            }
        }
    }

    // Разбор формата YYYY-MM-DD
    if (str.includes('-')) {
        const parts = str.split('-');
        if (parts.length === 3 && parts[0].length === 4) {
            return str;
        }
    }

    // Если объект Date, извлекаем компоненты по UTC, исключая сдвиг часовых поясов
    if (rawDate instanceof Date) {
        const year = rawDate.getUTCFullYear();
        const month = String(rawDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(rawDate.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return str;
}

function resetCompartments() {
    for (let i = 1; i <= 12; i++) {
        const bulkPcsInput = document.getElementById(`bulk-pcs-${i}`);
        const bulkWeightInput = document.getElementById(`bulk-weight-${i}`);
        if (bulkPcsInput) bulkPcsInput.value = '0';
        if (bulkWeightInput) {
            bulkWeightInput.value = '0';
            bulkWeightInput.removeAttribute('data-locked');
            bulkWeightInput.classList.remove('weight-locked');
        }

        const uldPcsInput = document.getElementById(`uld-pcs-${i}`);
        const uldWeightInput = document.getElementById(`uld-weight-${i}`);
        if (uldPcsInput) uldPcsInput.value = '0';
        if (uldWeightInput) {
            if (uldWeightInput.tagName === 'INPUT') uldWeightInput.value = '0';
            else uldWeightInput.textContent = '0';
            uldWeightInput.removeAttribute('data-locked');
            uldWeightInput.classList.remove('weight-locked');
        }
    }
}

// Сохранение текущей раскладки BULK отсеков в объект prediction из Истории расчетов
function saveCompartmentsToPrediction() {
    if (!currentActivePredictionId) return;
    const p = predictionsHistory.find(item => item.id === currentActivePredictionId);
    if (!p) return;

    const compartments = [];
    for (let i = 1; i <= 12; i++) {
        const pcsInput = document.getElementById(`bulk-pcs-${i}`);
        const weightInput = document.getElementById(`bulk-weight-${i}`);
        const pcs = pcsInput ? parseInt(pcsInput.value, 10) || 0 : 0;
        const weight = weightInput ? parseInt(weightInput.value, 10) || 0 : 0;
        const locked = weightInput ? (weightInput.getAttribute('data-locked') === 'true') : false;
        compartments.push({ pcs, weight, locked });
    }

    // Сохраняем только если хотя бы один отсек непустой
    const hasData = compartments.some(c => c.pcs > 0 || c.weight > 0);
    p.compartments = hasData ? compartments : null;
    savePredictionsHistory();
}

// Восстановление раскладки BULK отсеков из объекта prediction
function restoreCompartmentsFromPrediction(p) {
    if (!p || !p.compartments || !Array.isArray(p.compartments)) {
        resetCompartments();
        return;
    }

    for (let i = 1; i <= 12; i++) {
        const comp = p.compartments[i - 1];
        if (!comp) continue;

        const pcsInput = document.getElementById(`bulk-pcs-${i}`);
        const weightInput = document.getElementById(`bulk-weight-${i}`);

        if (pcsInput) pcsInput.value = String(comp.pcs || 0);
        if (weightInput) {
            weightInput.value = String(comp.weight || 0);
            if (comp.locked) {
                weightInput.setAttribute('data-locked', 'true');
                weightInput.classList.add('weight-locked');
            } else {
                weightInput.removeAttribute('data-locked');
                weightInput.classList.remove('weight-locked');
            }
        }
    }
}


function transferToPreliminary() {
    const paxInput = document.getElementById('input-pax');
    const resPcs = document.getElementById('res-pcs');
    const resWeight = document.getElementById('res-weight');

    const paxVal = parseInt(paxInput ? paxInput.value : 0) || 0;
    const pcsVal = parseInt(resPcs ? resPcs.textContent : 0) || 0;
    const weightVal = parseFloat(resWeight ? resWeight.textContent : 0) || 0;

    const prelimPax = document.getElementById('prelim-pax');
    const prelimPcs = document.getElementById('prelim-pcs');
    const prelimWeight = document.getElementById('prelim-weight');

    const lirPax = document.getElementById('lir-pax');
    const lirPcs = document.getElementById('lir-pcs');
    const lirWeight = document.getElementById('lir-weight');

    if (prelimPax) prelimPax.textContent = paxVal;
    if (prelimPcs) prelimPcs.textContent = pcsVal;
    if (prelimWeight) prelimWeight.textContent = weightVal;

    if (lirPax) lirPax.value = paxVal;
    if (lirPcs) lirPcs.value = pcsVal;
    if (lirWeight) lirWeight.value = weightVal;

    resetCompartments();
    recalculateLoadPlanning();
}

function transferPredictionToPreliminary(predId) {
    const p = predictionsHistory.find(item => item.id === predId);
    if (!p) return;

    // Сохраняем раскладку BULK текущего активного рейса из Истории перед переключением
    saveCompartmentsToPrediction();

    // Устанавливаем новый активный рейс из Истории
    currentActivePredictionId = predId;

    const paxVal = parseInt(p.pax, 10) || 0;
    const pcsVal = parseInt(p.bag_pcs, 10) || 0;
    const weightVal = parseFloat(p.bag_weight) || 0;

    const prelimPax = document.getElementById('prelim-pax');
    const prelimPcs = document.getElementById('prelim-pcs');
    const prelimWeight = document.getElementById('prelim-weight');

    const lirPax = document.getElementById('lir-pax');
    const lirPcs = document.getElementById('lir-pcs');
    const lirWeight = document.getElementById('lir-weight');

    if (prelimPax) prelimPax.textContent = paxVal;
    if (prelimPcs) prelimPcs.textContent = pcsVal;
    if (prelimWeight) prelimWeight.textContent = weightVal;

    if (lirPax) lirPax.value = paxVal;
    if (lirPcs) lirPcs.value = pcsVal;
    if (lirWeight) lirWeight.value = weightVal;

    const resPcs = document.getElementById('res-pcs');
    const resWeight = document.getElementById('res-weight');
    const resHb = document.getElementById('res-hb');

    if (resPcs) resPcs.textContent = p.bag_pcs || 0;
    if (resWeight) resWeight.textContent = p.bag_weight || 0;
    if (resHb) resHb.textContent = p.hb_weight || 0;

    // Восстанавливаем раскладку BULK из сохранённых данных рейса (или обнуляем если пустые)
    restoreCompartmentsFromPrediction(p);
    recalculateLoadPlanning();

    updateActiveFlightBadge(p.from, p.to, p.flight_no, p.flight_date || p.calc_date);
    highlightPredictionRow(predId);

    const targetEl = document.querySelector('.load-planning-panel') || document.getElementById('prelim-pax');
    if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function recalculateLoadPlanning() {
    const prelimPax = parseInt(document.getElementById('prelim-pax')?.textContent || 0) || 0;
    const prelimPcs = parseInt(document.getElementById('prelim-pcs')?.textContent || 0) || 0;
    const prelimWeight = parseFloat(document.getElementById('prelim-weight')?.textContent || 0) || 0;

    const lirPaxInput = document.getElementById('lir-pax');
    const lirPcsInput = document.getElementById('lir-pcs');
    const lirWeightInput = document.getElementById('lir-weight');

    let lirPax = parseInt(lirPaxInput ? lirPaxInput.value : 0) || 0;
    let lirPcs = parseInt(lirPcsInput ? lirPcsInput.value : 0) || 0;
    let lirWeight = parseFloat(lirWeightInput ? lirWeightInput.value : 0) || 0;

    const targetPax = lirPax > 0 ? lirPax : prelimPax;
    const targetPcs = lirPcs > 0 ? lirPcs : prelimPcs;
    const targetWeight = lirWeight > 0 ? lirWeight : prelimWeight;

    const prelimAvgWeight = document.getElementById('prelim-avg-weight');
    const prelimAvgPax = document.getElementById('prelim-avg-pax');

    if (prelimAvgWeight) {
        const avgW = targetPcs > 0 ? (targetWeight / targetPcs) : 0;
        prelimAvgWeight.textContent = avgW.toFixed(2).replace('.', ',');
    }
    if (prelimAvgPax) {
        const avgP = targetPax > 0 ? (targetPcs / targetPax) : 0;
        prelimAvgPax.textContent = avgP.toFixed(2).replace('.', ',');
    }

    // 1-й проход: Подсчет зафиксированных весов и мест
    let lockedWeightSum = 0;
    let lockedPcsSum = 0;

    for (let i = 1; i <= 12; i++) {
        const pcsInput = document.getElementById(`bulk-pcs-${i}`);
        const weightCell = document.getElementById(`bulk-weight-${i}`);

        if (pcsInput) {
            const pcs = parseInt(pcsInput.value, 10) || 0;

            if (weightCell && weightCell.tagName === 'INPUT' && weightCell.getAttribute('data-locked') === 'true') {
                const w = parseFloat(weightCell.value) || 0;
                lockedWeightSum += w;
                lockedPcsSum += pcs;
            }
        }
    }

    // Расчет удельного веса 1 места на оставшийся свободный вес от общего плана
    const remainingWeight = Math.max(0, targetWeight - lockedWeightSum);
    const remainingPcs = Math.max(1, targetPcs - lockedPcsSum);
    const dynamicAvgBagWeight = targetPcs > 0 ? (remainingWeight / remainingPcs) : 0;

    // 2-й проход: Вычисление и распределение оставшегося веса по незафиксированным отсекам
    let ttlBulkPcs = 0;
    let ttlBulkWeight = 0;

    for (let i = 1; i <= 12; i++) {
        const pcsInput = document.getElementById(`bulk-pcs-${i}`);
        const weightCell = document.getElementById(`bulk-weight-${i}`);

        if (pcsInput) {
            const pcs = parseInt(pcsInput.value, 10) || 0;
            let w = 0;

            if (weightCell && weightCell.tagName === 'INPUT' && weightCell.getAttribute('data-locked') === 'true') {
                w = parseFloat(weightCell.value) || 0;
            } else {
                w = Math.round(pcs * dynamicAvgBagWeight);
                if (weightCell) {
                    if (weightCell.tagName === 'INPUT') {
                        weightCell.value = w;
                    } else {
                        weightCell.textContent = w;
                    }
                }
            }

            ttlBulkPcs += pcs;
            ttlBulkWeight += w;
        }
    }

    const bulkTtlPcsEl = document.getElementById('bulk-ttl-pcs');
    const bulkTtlWghtEl = document.getElementById('bulk-ttl-weight');
    if (bulkTtlPcsEl) bulkTtlPcsEl.textContent = ttlBulkPcs;
    if (bulkTtlWghtEl) bulkTtlWghtEl.textContent = ttlBulkWeight;

    const bulkRestPcs = targetPcs - ttlBulkPcs;
    const bulkRestWeight = targetWeight - ttlBulkWeight;

    const bulkRestPcsCell = document.getElementById('bulk-rest-pcs');
    const bulkRestWghtCell = document.getElementById('bulk-rest-weight');

    if (bulkRestPcsCell) {
        bulkRestPcsCell.textContent = bulkRestPcs;
        bulkRestPcsCell.classList.toggle('rest-balanced', bulkRestPcs === 0 && targetPcs > 0);
        bulkRestPcsCell.classList.toggle('rest-overload', bulkRestPcs < 0);
    }
    if (bulkRestWghtCell) {
        bulkRestWghtCell.textContent = bulkRestWeight;
        bulkRestWghtCell.classList.toggle('rest-balanced', bulkRestWeight === 0 && targetWeight > 0);
        bulkRestWghtCell.classList.toggle('rest-overload', bulkRestWeight < 0);
    }
}

// Инициализация таблицы коммерческой загружеб (12 отсеков BULK)
function initLoadPlanningData() {
    const unifiedBody = document.getElementById('unified-load-tbody');
    if (unifiedBody) {
        if (unifiedBody.children.length === 0) {
            unifiedBody.innerHTML = '';
            for (let bulkNo = 1; bulkNo <= 12; bulkNo++) {
                const tr = document.createElement('tr');
                const bulkTabIndex = 10 + (bulkNo * 2) - 1;
                const weightTabIndex = 10 + (bulkNo * 2);

                tr.innerHTML = `
                    <td colspan="2" style="text-align: center;"><strong>${bulkNo}</strong></td>
                    <td colspan="2" style="text-align: center;"><input type="number" id="bulk-pcs-${bulkNo}" class="form-control table-input bulk-pcs-input monospace-val super-input-cyan" min="0" max="1000" value="0" tabindex="${bulkTabIndex}"></td>
                    <td colspan="2" style="text-align: center;"><input type="number" id="bulk-weight-${bulkNo}" class="form-control table-input bulk-weight-input monospace-val super-input-gold" min="0" max="50000" value="0" tabindex="${weightTabIndex}"></td>
                `;
                unifiedBody.appendChild(tr);
            }
        }
    }

    const btnTransfer = document.getElementById('btn-transfer-preliminary');
    if (btnTransfer && !btnTransfer.dataset.hasLoadListener) {
        btnTransfer.dataset.hasLoadListener = 'true';
        btnTransfer.addEventListener('click', transferToPreliminary);
        btnTransfer.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                e.preventDefault();
                const targetEl = document.getElementById('bulk-pcs-1');
                if (targetEl) {
                    targetEl.focus();
                    if (typeof targetEl.select === 'function') targetEl.select();
                }
            }
        });
    }

    ['lir-pax', 'lir-pcs', 'lir-weight'].forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.dataset.hasRecalcListener) {
            el.dataset.hasRecalcListener = 'true';
            ['input', 'change', 'keyup', 'blur'].forEach(evt => {
                el.addEventListener(evt, () => recalculateLoadPlanning());
            });
        }
    });

    document.querySelectorAll('.table-input').forEach(input => {
        if (!input.dataset.hasKeyNavListener) {
            input.dataset.hasKeyNavListener = 'true';
            input.addEventListener('keydown', (e) => {
                if (['-', '+', '.', ',', 'e', 'E'].includes(e.key)) {
                    e.preventDefault();
                    return;
                }
                if (e.key === 'Enter' || (e.key === 'Tab' && !e.shiftKey)) {
                    e.preventDefault();
                    const curTab = parseInt(input.getAttribute('tabindex'), 10);
                    if (curTab) {
                        const nextEl = document.querySelector(`[tabindex="${curTab + 1}"]`);
                        if (nextEl) {
                            nextEl.focus();
                            if (typeof nextEl.select === 'function') nextEl.select();
                        } else {
                            input.blur();
                        }
                    }
                }
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('uld-pcs-input')) {
                    const uldId = input.id.replace('uld-pcs-', '');
                    const weightInput = document.getElementById(`uld-weight-${uldId}`);
                    if (weightInput) {
                        weightInput.removeAttribute('data-locked');
                        weightInput.classList.remove('weight-locked');
                    }
                } else if (input.classList.contains('bulk-pcs-input')) {
                    const bulkId = input.id.replace('bulk-pcs-', '');
                    const weightInput = document.getElementById(`bulk-weight-${bulkId}`);
                    if (weightInput) {
                        weightInput.removeAttribute('data-locked');
                        weightInput.classList.remove('weight-locked');
                    }
                } else if (input.classList.contains('uld-weight-input') || input.classList.contains('bulk-weight-input')) {
                    if (input.value.trim() !== '') {
                        input.setAttribute('data-locked', 'true');
                        input.classList.add('weight-locked');
                    } else {
                        input.removeAttribute('data-locked');
                        input.classList.remove('weight-locked');
                    }
                }

                recalculateLoadPlanning();
                // Автосохранение раскладки BULK в активный рейс из Истории
                saveCompartmentsToPrediction();
            });

            ['change', 'blur'].forEach(evt => {
                input.addEventListener(evt, () => {
                    let v = input.value;
                    if (v && v.length > 1 && v.startsWith('0')) {
                        input.value = String(parseInt(v, 10));
                    }
                    if (v === '' || isNaN(v) || parseInt(v, 10) < 0) {
                        input.value = '0';
                    }
                    recalculateLoadPlanning();
                    // Автосохранение раскладки BULK в активный рейс из Истории
                    saveCompartmentsToPrediction();
                });
            });
        }
    });

    recalculateLoadPlanning();
}

// --- ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ---
document.addEventListener('DOMContentLoaded', async () => {
    loadSettings();
    
    // Инициализация даты в форме прогноза (сегодняшняя дата)
    const dateInput = document.getElementById('input-date');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    await loadBaggageDb();
    await loadUserFlights();
    loadPredictionsHistory();
    
    // Автоматическая тихая фоновая подгрузка системного файла статистики
    await loadSystemStats(true);

    setupEventListeners();
    setupNumericInputValidation();
    setupDatePickerTrigger();
    initAviationModal();
    initLoadPlanningData();
});

// Загрузка настроек темы и языка
function loadSettings() {
    // Язык
    const savedLang = localStorage.getItem('averago_lang');
    if (savedLang && (savedLang === 'ru' || savedLang === 'en')) {
        currentLang = savedLang;
    } else {
        currentLang = navigator.language.startsWith('ru') ? 'ru' : 'en';
    }
    setLanguage(currentLang);

    // Тема
    const savedTheme = localStorage.getItem('averago_theme');
    if (savedTheme) {
        currentTheme = savedTheme;
    }
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
    updateThemeButtonUI();
}

// Установка языка интерфейса
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('averago_lang', lang);

    // Подсветка кнопок
    document.getElementById('btn-lang-ru').classList.toggle('active', lang === 'ru');
    document.getElementById('btn-lang-en').classList.toggle('active', lang === 'en');

    // Перевод элементов
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.setAttribute('placeholder', translations[lang][key]);
            } else if (el.tagName === 'OPTION') {
                el.text = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    updateThemeButtonUI();
    updateOfflineStatusUI();

    // Перерисовать таблицу и графики, если они готовы
    if (baggageDb) {
        updateActiveDateRangeAndCounts();
        renderFlightsTable();
        renderPredictionsTable();
    }
}

// Переключение темы оформления
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('averago_theme', currentTheme);
    document.body.classList.toggle('light-theme', currentTheme === 'light');
    updateThemeButtonUI();
}

// Обновление текста на кнопке темы
function updateThemeButtonUI() {
    const btn = document.getElementById('btn-theme-toggle');
    if (!btn) return;

    const isLight = document.body.classList.contains('light-theme');
    const emoji = isLight ? '☀️' : '🌙';
    const textKey = isLight ? 'theme-light' : 'theme-dark';
    const text = translations[currentLang][textKey];

    btn.querySelector('.theme-emoji').textContent = emoji;
    btn.querySelector('.theme-text').textContent = text;
}

// Загрузка базы данных аэропортов и исторических правил
async function loadBaggageDb() {
    try {
        const response = await fetch('baggage_db.json');
        baggageDb = await response.json();
        
        populateAirportDropdowns();
        populateAllFlightsDropdown();
        updateActiveDateRangeAndCounts();
        renderFlightsTable();
        renderPredictionsTable();
        renderUploadedFilesList();
    } catch (e) {
        console.error("Ошибка загрузки baggage_db.json:", e);
        baggageDb = { airports: {}, departures_filter: [], arrivals_filter: [], rules: [] };
    }
}

// Загрузка рейсов из локального хранилища (localStorage)
function loadFlightsFromLocalStorage() {
    try {
        const saved = localStorage.getItem('averago_user_flights_local');
        if (saved) {
            userFlights = JSON.parse(saved);
        } else {
            userFlights = [];
        }
    } catch (e) {
        console.error("Ошибка парсинга рейсов из LocalStorage:", e);
        userFlights = [];
    }
}

// Обновление интерфейса статуса подключения (Online/Offline)
function updateOfflineStatusUI() {
    const indicator = document.querySelector('.header-status-indicator');
    const textEl = document.querySelector('.status-text');
    if (!indicator || !textEl) return;

    if (isOfflineMode) {
        indicator.classList.add('offline');
        textEl.setAttribute('data-translate', 'status-local');
        textEl.textContent = translations[currentLang]['status-local'];
    } else {
        indicator.classList.remove('offline');
        textEl.setAttribute('data-translate', 'status-dispatch');
        textEl.textContent = translations[currentLang]['status-dispatch'];
    }
}

// Загрузка рейсов пользователя с сервера MySQL с автоматическим переходом на LocalStorage при ошибке
async function loadUserFlights() {
    try {
        const response = await fetch('api.php?action=get_flights');
        
        // Проверяем тип ответа (если локальный сервер без PHP вернул исходный код PHP-файла)
        const contentType = response.headers.get('content-type');
        if (contentType && !contentType.includes('application/json')) {
            throw new Error('Server returned non-JSON content: ' + contentType);
        }

        const data = await response.json();
        
        if (data.db_not_configured) {
            console.warn("База данных MySQL еще не настроена. Включаем локальный режим.");
            isOfflineMode = true;
            loadFlightsFromLocalStorage();
        } else if (data.success) {
            userFlights = data.flights;
            isOfflineMode = false;
        } else {
            console.error("Ошибка загрузки рейсов с сервера:", data.error);
            showAviationAlert("Ошибка загрузки рейсов: " + data.error, true);
            userFlights = [];
            isOfflineMode = false;
        }
    } catch (e) {
        console.warn("Ошибка подключения к API. Переключаемся в локальный режим:", e);
        isOfflineMode = true;
        loadFlightsFromLocalStorage();
    }
    
    // Если в локальном режиме база пуста, автоматически подгружаем 226 системных рейсов за июль из stats_july.xls
    if (userFlights.length === 0) {
        await loadSystemStats(true);
    }

    updateActiveDateRangeAndCounts();
    renderFlightsTable();
    renderUploadedFilesList();
    updateOfflineStatusUI();
    populateAllFlightsDropdown();
}

// Тихое обновление списка рейсов с сервера для фоновой синхронизации
async function loadUserFlightsSilent() {
    if (isOfflineMode) {
        loadFlightsFromLocalStorage();
        updateActiveDateRangeAndCounts();
        renderFlightsTable();
        renderUploadedFilesList();
        return;
    }
    try {
        const response = await fetch('api.php?action=get_flights');
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data.success) {
                userFlights = data.flights;
            }
        }
    } catch (e) {
        console.error("Ошибка тихого обновления рейсов:", e);
    }
    updateActiveDateRangeAndCounts();
    renderFlightsTable();
    renderUploadedFilesList();
    populateAllFlightsDropdown();
}

// Сохранение рейсов пользователя на сервере MySQL или в LocalStorage
async function saveUserFlights() {
    // 1. Всегда надежно сохраняем в LocalStorage
    try {
        localStorage.setItem('averago_user_flights_local', JSON.stringify(userFlights));
        updateActiveDateRangeAndCounts();
        renderFlightsTable();
        renderUploadedFilesList();
        populateAllFlightsDropdown();
    } catch (e) {
        console.error("Ошибка сохранения в LocalStorage:", e);
    }

    if (isOfflineMode) return;

    // 2. Если сервеная часть активна, проуем тихо синхронизировать
    try {
        const response = await fetch('api.php?action=save_flights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userFlights)
        });
        if (!response || !response.ok) return;
        const data = await response.json();
        if (data && data.success) {
            await loadUserFlightsSilent();
        }
    } catch (e) {
        console.warn("Серверный API недоступен, работаем в локальном режиме:", e);
    }
}

// Загрузка истории прогнозов из LocalStorage
function loadPredictionsHistory() {
    const saved = localStorage.getItem('averago_predictions_history');
    if (saved) {
        try {
            predictionsHistory = JSON.parse(saved);
        } catch (e) {
            console.error("Ошибка парсинга истории прогнозов из LocalStorage:", e);
            predictionsHistory = [];
        }
    }
    renderPredictionsTable();
}

// Сохранение истории прогнозов в LocalStorage
function savePredictionsHistory() {
    localStorage.setItem('averago_predictions_history', JSON.stringify(predictionsHistory));
}

// Заполнение выпадающего списка годов для сезонного фильтра на основе базы рейсов
function populateSeasonalYears() {
    const selectYear = document.getElementById('select-seasonal-year');
    if (!selectYear) return;

    const savedVal = selectYear.value; // сохраняем выбранное значение, если оно было
    selectYear.innerHTML = '';

    // Опция "Все года"
    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.setAttribute('data-translate', 'opt-all-years');
    allOpt.textContent = translations[currentLang]['opt-all-years'] || 'Все года';
    selectYear.appendChild(allOpt);

    // Извлекаем все уникальные года из userFlights
    const yearsSet = new Set();
    userFlights.forEach(f => {
        if (f.date) {
            const dateObj = new Date(f.date);
            if (!isNaN(dateObj.getTime())) {
                yearsSet.add(dateObj.getFullYear());
            }
        }
    });

    // Сортируем года по возрастанию и добавляем
    const sortedYears = Array.from(yearsSet).sort((a, b) => a - b);
    sortedYears.forEach(year => {
        const opt = document.createElement('option');
        opt.value = year;
        opt.textContent = year;
        selectYear.appendChild(opt);
    });

    // Восстанавливаем выбранное значение, если оно все еще существует в списке
    if (savedVal && Array.from(selectYear.options).some(opt => opt.value === savedVal)) {
        selectYear.value = savedVal;
    }
}

// Заполнение выпадающих списков аэропортов и автозаполнения
function populateAirportDropdowns() {
    const selectFrom = document.getElementById('select-from');
    const manualFrom = document.getElementById('manual-from');
    const manualTo = document.getElementById('manual-to');

    const savedFrom = selectFrom ? selectFrom.value : '';
    const savedManualFrom = manualFrom ? manualFrom.value : '';
    const savedManualTo = manualTo ? manualTo.value : '';

    if (selectFrom) selectFrom.innerHTML = '';
    if (manualFrom) manualFrom.innerHTML = '';
    if (manualTo) manualTo.innerHTML = '';

    const uniqueAirportsMap = {};
    if (baggageDb && baggageDb.airports) {
        Object.values(baggageDb.airports).forEach(ap => {
            if (!ap) return;
            // Исключаем кириллические 3-буквенные коды (ВЛА, ХБР, ХКТ) — используем исключительно 3-буквенную ИАТА латиницу
            const iataCandidate = (ap.iata && /^[A-Z]{3}$/i.test(ap.iata)) ? ap.iata.toUpperCase() : ruToIata(ap.iata || ap.ru);
            if (iataCandidate && /^[A-Z]{3}$/.test(iataCandidate)) {
                if (!uniqueAirportsMap[iataCandidate]) {
                    uniqueAirportsMap[iataCandidate] = {
                        iata: iataCandidate,
                        ru: ap.ru || iataCandidate,
                        name: ap.name || ap.ru || iataCandidate
                    };
                }
            }
        });
    }

    const sortedAirports = Object.values(uniqueAirportsMap).sort((a, b) => a.iata.localeCompare(b.iata));

    if (selectFrom) {
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = currentLang === 'ru' ? '-- Выберите аэропорт --' : '-- Select Airport --';
        selectFrom.appendChild(defaultOpt);
    }

    if (manualFrom) {
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = currentLang === 'ru' ? '-- Выберите вылет --' : '-- Select Departure --';
        manualFrom.appendChild(defaultOpt);

        const customOpt = document.createElement('option');
        customOpt.value = '__custom__';
        customOpt.textContent = currentLang === 'ru' ? '✏️ + Вписать свой код...' : '✏️ + Enter custom code...';
        manualFrom.appendChild(customOpt);
    }

    if (manualTo) {
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = currentLang === 'ru' ? '-- Выберите прилет --' : '-- Select Destination --';
        manualTo.appendChild(defaultOpt);

        const customOpt = document.createElement('option');
        customOpt.value = '__custom__';
        customOpt.textContent = currentLang === 'ru' ? '✏️ + Вписать свой код...' : '✏️ + Enter custom code...';
        manualTo.appendChild(customOpt);
    }

    // Вылетные направления (16 базовая система + добавленные вручную/из файлов)
    const departuresSet = new Set([
        'AER', 'СОЧ', 'CCC', 'DYU', 'ДШБ', 'GOX', 'HOG', 'HRG',
        'KQT', 'КГТ', 'LBD', 'ХДТ', 'OSS', 'ОШШ', 'PMV', 'REN', 'ОНГ',
        'SSH', 'SUI', 'СУИ', 'TAS', 'ТАС', 'UTP', 'VRA'
    ]);
    if (baggageDb && baggageDb.departures_filter) {
        baggageDb.departures_filter.forEach(d => {
            if (d && !isHeaderGarbage(d)) {
                departuresSet.add(d);
                const iata = ruToIata(d);
                if (iata && !isHeaderGarbage(iata)) departuresSet.add(iata);
            }
        });
    }
    if (userFlights) {
        userFlights.forEach(f => {
            if (f.from && !isHeaderGarbage(f.from)) {
                departuresSet.add(f.from);
                const iata = ruToIata(f.from);
                if (iata && !isHeaderGarbage(iata)) departuresSet.add(iata);
            }
        });
    }

    // Прилетные направления (из arrivals_filter + всех ручных и загруженных рейсов)
    const arrivalsSet = new Set();
    if (baggageDb && baggageDb.arrivals_filter) {
        baggageDb.arrivals_filter.forEach(a => {
            if (a && !isHeaderGarbage(a)) {
                arrivalsSet.add(a);
                const iata = ruToIata(a);
                if (iata && !isHeaderGarbage(iata)) arrivalsSet.add(iata);
            }
        });
    }
    if (userFlights) {
        userFlights.forEach(f => {
            if (f.to && !isHeaderGarbage(f.to)) {
                arrivalsSet.add(f.to);
                const iata = ruToIata(f.to);
                if (iata && !isHeaderGarbage(iata)) arrivalsSet.add(iata);
            }
        });
    }

    sortedAirports.forEach(ap => {
        if (!ap || !ap.iata || !/^[A-Z]{3}$/.test(ap.iata)) return;
        const optText = ap.iata;
        
        // В выпадающие списки вылета (selectFrom и manualFrom)
        const isAllowedDep = departuresSet.has(ap.iata) || departuresSet.has(ap.ru);
        if (isAllowedDep) {
            if (selectFrom) {
                const opt = document.createElement('option');
                opt.value = ap.ru;
                opt.textContent = optText;
                selectFrom.appendChild(opt);
            }

            if (manualFrom) {
                const opt = document.createElement('option');
                opt.value = ap.iata;
                opt.textContent = optText;
                manualFrom.appendChild(opt);
            }
        }

        // В выпадающий список прилета (manualTo)
        const isAllowedArr = arrivalsSet.size === 0 || arrivalsSet.has(ap.iata) || arrivalsSet.has(ap.ru);
        if (isAllowedArr) {
            if (manualTo) {
                const opt = document.createElement('option');
                opt.value = ap.iata;
                opt.textContent = optText;
                manualTo.appendChild(opt);
            }
        }
    });

    // Восстанавливаем выбранные значения
    if (selectFrom && savedFrom && Array.from(selectFrom.options).some(opt => opt.value === savedFrom)) {
        selectFrom.value = savedFrom;
    }
    if (manualFrom && savedManualFrom && Array.from(manualFrom.options).some(opt => opt.value === savedManualFrom)) {
        manualFrom.value = savedManualFrom;
    }
    if (manualTo && savedManualTo && Array.from(manualTo.options).some(opt => opt.value === savedManualTo)) {
        manualTo.value = savedManualTo;
    }

    const today = new Date().toISOString().split('T')[0];
    const manualDate = document.getElementById('manual-date');
    if (manualDate && !manualDate.value) manualDate.value = today;
}

// Получение числовой части номера рейса без префиксов авиакомпаний (N4, EO, KL и т.д.)
function getNumericFlightNo(fltStr) {
    if (!fltStr) return '';
    const clean = String(fltStr).trim().toUpperCase().replace(/^(N4|EO|KL|КЛ|Н4|ЕО)\s*[-]?\s*/i, '');
    const m = clean.match(/\d+/);
    return m ? m[0] : String(fltStr).replace(/\D+/g, '');
}

// Поиск маршрута вылета/прилета по номеру рейса (возвращает ИАТА коды)
function findRouteByFlightNo(flightNo) {
    if (!flightNo) return null;
    const targetNum = getNumericFlightNo(flightNo);
    if (!targetNum) return null;

    // Сначала ищем в загруженных рейсах
    if (userFlights && userFlights.length > 0) {
        for (const f of userFlights) {
            if (f.flight_no && getNumericFlightNo(f.flight_no) === targetNum) {
                const fromIata = ruToIata(f.from) || f.from;
                const toIata = ruToIata(f.to) || f.to;
                return { from: fromIata, to: toIata };
            }
        }
    }

    // Если нет, ищем в правилах базы данных
    if (baggageDb && baggageDb.rules) {
        for (const rule of baggageDb.rules) {
            if (rule.flt_no && getNumericFlightNo(rule.flt_no) === targetNum) {
                const fromIata = ruToIata(rule.from) || rule.from;
                const toIata = ruToIata(rule.to) || rule.to;
                return { from: fromIata, to: toIata };
            }
        }
    }

    return null;
}

// Автоматический двуэтапный выбор вылета и прилета в элементах select
function applyRouteSelection(route) {
    if (!route || !route.from || !route.to) return false;
    const selectFrom = document.getElementById('select-from');
    const selectTo = document.getElementById('select-to');
    if (!selectFrom || !selectTo) return false;

    isAutoSelectingRoute = true;
    let fromOptionFound = false;

    const targetFromIata = (ruToIata(route.from) || route.from).trim().toUpperCase();
    const targetToIata = (ruToIata(route.to) || route.to).trim().toUpperCase();

    // 1. Выбираем аэропорт вылета
    for (let opt of selectFrom.options) {
        const optIata = (ruToIata(opt.value) || opt.value).trim().toUpperCase();
        if (opt.value === route.from || optIata === targetFromIata) {
            selectFrom.value = opt.value;
            fromOptionFound = true;
            break;
        }
    }

    // 2. Генерация списка прилетов и выбор аэропорта прилета
    if (fromOptionFound) {
        selectFrom.dispatchEvent(new Event('change'));

        selectTo.disabled = false;
        let toOptionFound = false;
        for (let opt of selectTo.options) {
            const optIata = (ruToIata(opt.value) || opt.value).trim().toUpperCase();
            if (opt.value === route.to || optIata === targetToIata) {
                selectTo.value = opt.value;
                toOptionFound = true;
                break;
            }
        }
        isAutoSelectingRoute = false;
        return toOptionFound;
    }

    isAutoSelectingRoute = false;
    return false;
}

// Индекс выделенного элемента клавиатурной навигацией
let currentHighlightedSuggestionIndex = -1;

// Генерация и отображение кастомных автоподсказок для поля "Номер рейса" (HUD Style)
function renderCustomFlightSuggestions(filterText = '', forceShow = false) {
    const dropdownPanel = document.getElementById('flight-suggestions-dropdown');
    const chevron = document.getElementById('btn-toggle-flight-dropdown');
    if (!dropdownPanel) return;

    const val = String(filterText).trim().toUpperCase();

    // Изначально выпадающий список со всеми рейсами должен быть сложен
    if (val === '' && !forceShow) {
        hideCustomFlightSuggestions();
        return;
    }

    const selectFrom = document.getElementById('select-from');
    const selectTo = document.getElementById('select-to');

    const routeFrom = selectFrom ? selectFrom.value : '';
    const routeTo = selectTo ? selectTo.value : '';

    const fromIata = routeFrom ? (ruToIata(routeFrom) || routeFrom) : '';
    const toIata = routeTo ? (ruToIata(routeTo) || routeTo) : '';

    const flightMap = new Map(); // flight_no -> route text

    // 1. Из правил базы данных
    if (baggageDb && baggageDb.rules) {
        baggageDb.rules.forEach(rule => {
            if (rule.flt_no) {
                const rFrom = rule.from;
                const rTo = rule.to;
                const cleanNo = getNumericFlightNo(rule.flt_no) || rule.flt_no;
                if ((!fromIata || rFrom === fromIata) && (!toIata || rTo === toIata)) {
                    flightMap.set(cleanNo, `${rFrom} ➔ ${rTo}`);
                }
            }
        });
    }

    // 2. Из пользовательской базы рейсов
    if (userFlights) {
        userFlights.forEach(f => {
            if (f.flight_no) {
                const fFrom = ruToIata(f.from) || f.from;
                const fTo = ruToIata(f.to) || f.to;
                const cleanNo = getNumericFlightNo(f.flight_no) || f.flight_no;
                if ((!fromIata || fFrom === fromIata) && (!toIata || fTo === toIata)) {
                    flightMap.set(cleanNo, `${fFrom} ➔ ${fTo}`);
                }
            }
        });
    }

    // 3. Строгая префиксная фильтрация по началу имени рейса или его числовой части
    let matchedFlights = Array.from(flightMap.keys());
    if (val !== '') {
        matchedFlights = matchedFlights.filter(fl => {
            const flUpper = String(fl).toUpperCase();
            const numPart = getNumericFlightNo(fl);

            // Рейс подходит только если полное имя (EO-347, 409) или числовая часть (347, 409) НАЧИНАЕТСЯ с введенных символов
            const fullStartsWith = flUpper.startsWith(val);
            const numStartsWith = numPart.startsWith(val);

            return fullStartsWith || numStartsWith;
        });
    }

    // 4. Строгая последовательная сортировка по возрастанию числового номера рейса
    matchedFlights.sort((a, b) => {
        const numA = parseInt(getNumericFlightNo(a), 10) || 0;
        const numB = parseInt(getNumericFlightNo(b), 10) || 0;
        if (numA !== numB) return numA - numB;
        return a.localeCompare(b);
    });

    // Перебираем варианты для выпадающего списка

    dropdownPanel.innerHTML = '';
    currentHighlightedSuggestionIndex = -1;

    if (matchedFlights.length === 0) {
        hideCustomFlightSuggestions();
        return;
    } else {
        matchedFlights.forEach((fl) => {
            const routeStr = flightMap.get(fl);
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.setAttribute('data-flight', fl);

            item.innerHTML = `
                <span class="suggestion-flight-no">${fl}</span>
                <span class="suggestion-route-tag">${routeStr}</span>
            `;

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                selectFlightOption(fl);
            });

            dropdownPanel.appendChild(item);
        });
    }

    dropdownPanel.classList.remove('hidden');
    if (chevron) chevron.classList.add('open');
}

// Скрытие кастомного выпадающего списка
function hideCustomFlightSuggestions() {
    const dropdownPanel = document.getElementById('flight-suggestions-dropdown');
    const chevron = document.getElementById('btn-toggle-flight-dropdown');
    if (dropdownPanel) dropdownPanel.classList.add('hidden');
    if (chevron) chevron.classList.remove('open');
    currentHighlightedSuggestionIndex = -1;
}

// Выбор конкретного рейса из списка подсказок
function selectFlightOption(flightNo) {
    const selectFlight = document.getElementById('select-flight');

    if (selectFlight) {
        selectFlight.value = flightNo;
    }

    const route = findRouteByFlightNo(flightNo);
    if (route) {
        applyRouteSelection(route);
    }

    hideCustomFlightSuggestions();
}

function populateAllFlightsDropdown(routeFrom = '', routeTo = '') {
    // Вспомогательная функция для обновления подсказок при смене вылета/прилета
    if (document.getElementById('select-flight')) {
        renderCustomFlightSuggestions(document.getElementById('select-flight').value);
    }
}

// Настройка сквозной мгновенной навигации по клавише TAB (по 1 нажатию) между всеми окнами формы прогнозирования
function setupFormTabNavigation() {
    const selectFlight = document.getElementById('select-flight');
    const selectFrom = document.getElementById('select-from');
    const selectTo = document.getElementById('select-to');
    const inputPax = document.getElementById('input-pax');
    const inputDate = document.getElementById('input-date');
    const btnCalculate = document.getElementById('btn-calculate');

    // 1. Из "Номер рейса" по 1-му TAB ➔ в "Аэропорт вылета"
    if (selectFlight) {
        selectFlight.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                hideCustomFlightSuggestions();
                if (selectFrom) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    selectFrom.focus();
                }
            }
        }, true);
    }

    // 2. Из "Аэропорт вылета" по 1-му TAB ➔ в "Аэропорт прилета"
    if (selectFrom) {
        selectFrom.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                if (selectTo && !selectTo.disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    selectTo.focus();
                } else if (inputPax) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    inputPax.focus();
                }
            }
        }, true);
    }

    // 3. Из "Аэропорт прилета" по 1-му TAB ➔ в "Пассажиры"
    if (selectTo) {
        selectTo.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                if (inputPax) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    inputPax.focus();
                }
            }
        }, true);
    }

    // 4. Из "Пассажиры" по 1-му TAB ➔ в "Дата рейса"
    if (inputPax) {
        inputPax.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                if (inputDate) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    inputDate.focus();
                }
            }
        }, true);
    }

    // 5. Из "Дата рейса" по 1-му TAB ➔ на кнопку "Рассчитать прогноз"
    if (inputDate) {
        inputDate.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                if (btnCalculate) {
                    btnCalculate.focus();
                }
            }
        }, true);
    }
}

// Вызов стандартного календаря
function setupDatePickerTrigger() {
    ['manual-date', 'input-date'].forEach(id => {
        const dateInput = document.getElementById(id);
        if (dateInput) {
            dateInput.addEventListener('click', (e) => {
                try {
                    if (typeof e.target.showPicker === 'function') {
                        e.target.showPicker();
                    }
                } catch (err) {
                    console.log("showPicker not supported or failed", err);
                }
            });
        }
    });
}

// Настройка слушателей событий
function setupEventListeners() {
    setupFormTabNavigation();
    // Резервное копирование и восстановление базы данных
    const btnExportDb = document.getElementById('btn-export-db');
    if (btnExportDb) {
        btnExportDb.addEventListener('click', handleExportDatabase);
    }

    const btnImportDb = document.getElementById('btn-import-db');
    const backupFileInput = document.getElementById('backup-file-input');
    if (btnImportDb && backupFileInput) {
        btnImportDb.addEventListener('click', () => {
            backupFileInput.click();
        });
        backupFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                handleImportDatabase(e.target.files[0]);
            }
        });
    }

    const chkShowAll = document.getElementById('chk-show-all-flights');
    if (chkShowAll) {
        chkShowAll.addEventListener('change', () => {
            renderFlightsTable();
        });
    }

    // Настройки анализа и сезонности
    const btnToggleSettings = document.getElementById('btn-toggle-settings');
    const settingsPanel = document.getElementById('analysis-settings-panel');
    if (btnToggleSettings && settingsPanel) {
        btnToggleSettings.addEventListener('click', () => {
            btnToggleSettings.classList.toggle('active');
            settingsPanel.classList.toggle('hidden');
        });
    }

    const selectPeriodType = document.getElementById('select-period-type');
    const customRangeInputs = document.getElementById('custom-range-inputs');
    const seasonalInputs = document.getElementById('seasonal-inputs');
    if (selectPeriodType) {
        selectPeriodType.addEventListener('change', () => {
            const val = selectPeriodType.value;
            if (val === 'custom') {
                if (customRangeInputs) customRangeInputs.classList.remove('hidden');
                if (seasonalInputs) seasonalInputs.classList.add('hidden');
            } else if (val === 'seasonal') {
                if (customRangeInputs) customRangeInputs.classList.add('hidden');
                if (seasonalInputs) seasonalInputs.classList.remove('hidden');
            } else {
                if (customRangeInputs) customRangeInputs.classList.add('hidden');
                if (seasonalInputs) seasonalInputs.classList.add('hidden');
            }
        });
    }

    // Язык
    document.getElementById('btn-lang-ru').addEventListener('click', () => setLanguage('ru'));
    document.getElementById('btn-lang-en').addEventListener('click', () => setLanguage('en'));

    // Тема
    document.getElementById('btn-theme-toggle').addEventListener('click', toggleTheme);

    // Вкладки (Tabs)
    setupTabs();

    // Связка выпадающих списков вылета и прилета
    const selectFrom = document.getElementById('select-from');
    const selectTo = document.getElementById('select-to');
    const selectFlight = document.getElementById('select-flight');

    selectFrom.addEventListener('change', () => {
        const fromVal = selectFrom.value;
        if (!fromVal) {
            selectTo.disabled = true;
            selectTo.innerHTML = `<option value="">${translations[currentLang]['select-from-first']}</option>`;
            
            if (!isAutoSelectingRoute) {
                populateAllFlightsDropdown();
            }
            return;
        }

        const availableTos = new Set();
        const fromIata = ruToIata(fromVal);
        
        // Из правил (ИАТА)
        baggageDb.rules.forEach(rule => {
            if (rule.from === fromIata) {
                availableTos.add(iataToRu(rule.to));
            }
        });

        // Из загруженных
        userFlights.forEach(flight => {
            if (ruToIata(flight.from) === ruToIata(fromVal)) {
                availableTos.add(flight.to);
            }
        });

        selectTo.innerHTML = '';
        const defaultToOpt = document.createElement('option');
        defaultToOpt.value = '';
        defaultToOpt.textContent = currentLang === 'ru' ? '-- Выберите направление --' : '-- Select Destination --';
        selectTo.appendChild(defaultToOpt);

        Array.from(availableTos)
            .map(toRu => {
                const ap = baggageDb.airports[toRu] || Object.values(baggageDb.airports).find(a => a.iata === ruToIata(toRu));
                const iata = ap ? ap.iata : ruToIata(toRu);
                return { toRu, iata };
            })
            .sort((a, b) => a.iata.localeCompare(b.iata))
            .forEach(({ toRu, iata }) => {
                const opt = document.createElement('option');
                opt.value = iata;
                opt.textContent = iata;
                selectTo.appendChild(opt);
            });

        selectTo.disabled = false;
        
        if (!isAutoSelectingRoute) {
            populateAllFlightsDropdown(selectFrom.value, selectTo.value);
        }
    });

    selectTo.addEventListener('change', () => {
        if (!isAutoSelectingRoute) {
            populateAllFlightsDropdown(selectFrom.value, selectTo.value);
        }
    });

    const handleFlightInput = () => {
        if (isAutoSelectingRoute) return;
        const flightVal = selectFlight ? selectFlight.value.trim().toUpperCase() : '';

        // Если поле рейса очищено, направления Аэропорта вылета и Аэропорта прилёта ТОЖЕ ДОЛЖНЫ ПРОПАСТЬ
        if (!flightVal) {
            if (selectFrom) selectFrom.value = '';
            if (selectTo) {
                selectTo.disabled = true;
                selectTo.innerHTML = `<option value="">${translations[currentLang]['select-from-first']}</option>`;
                selectTo.value = '';
            }
            hideCustomFlightSuggestions();
            return;
        }

        // Показываем кастомный темно-синий HUD-список подсказок со строгой префиксной фильтрацией по порядку
        renderCustomFlightSuggestions(flightVal);

        const route = findRouteByFlightNo(flightVal);
        if (route) {
            applyRouteSelection(route);
        }
    };

    if (selectFlight) {
        selectFlight.addEventListener('input', handleFlightInput);

        selectFlight.addEventListener('focus', () => {
            if (selectFlight.value.trim() !== '') {
                renderCustomFlightSuggestions(selectFlight.value);
            }
        });

        // Навигация с клавиатуры (Стрелки вверх/вниз, Enter, Escape)
        selectFlight.addEventListener('keydown', (e) => {
            const dropdownPanel = document.getElementById('flight-suggestions-dropdown');
            if (!dropdownPanel || dropdownPanel.classList.contains('hidden')) return;

            const items = dropdownPanel.querySelectorAll('.suggestion-item');
            if (items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentHighlightedSuggestionIndex = (currentHighlightedSuggestionIndex + 1) % items.length;
                updateSuggestionHighlight(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentHighlightedSuggestionIndex = (currentHighlightedSuggestionIndex - 1 + items.length) % items.length;
                updateSuggestionHighlight(items);
            } else if (e.key === 'Enter') {
                if (currentHighlightedSuggestionIndex >= 0 && currentHighlightedSuggestionIndex < items.length) {
                    e.preventDefault();
                    const selectedFlight = items[currentHighlightedSuggestionIndex].getAttribute('data-flight');
                    if (selectedFlight) selectFlightOption(selectedFlight);
                }
            } else if (e.key === 'Escape' || e.key === 'Tab') {
                hideCustomFlightSuggestions();
            }
        });
    }

    function updateSuggestionHighlight(items) {
        items.forEach((item, idx) => {
            if (idx === currentHighlightedSuggestionIndex) {
                item.classList.add('active');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
    }

    const chevronBtn = document.getElementById('btn-toggle-flight-dropdown');
    if (chevronBtn) {
        chevronBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdownPanel = document.getElementById('flight-suggestions-dropdown');
            if (dropdownPanel && !dropdownPanel.classList.contains('hidden')) {
                hideCustomFlightSuggestions();
            } else {
                if (selectFlight) {
                    renderCustomFlightSuggestions(selectFlight.value, true);
                    selectFlight.focus();
                }
            }
        });
    }

    document.addEventListener('click', (e) => {
        const wrapper = document.querySelector('.custom-autocomplete-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
            hideCustomFlightSuggestions();
        }
    });

    // Функция жесткого сброса при вводе более 1000 человек
    const attachPaxMaxLimit = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const enforce = () => {
            if (el.value === '') return;
            let val = parseInt(el.value, 10);
            if (isNaN(val) || val < 0) {
                el.value = 0;
            } else if (val > 1000) {
                el.value = 1000;
            }
        };
        ['input', 'change', 'keyup', 'blur'].forEach(evt => el.addEventListener(evt, enforce));
    };

    ['input-pax', 'manual-men', 'manual-women', 'manual-rb', 'manual-rm'].forEach(attachPaxMaxLimit);

    // Обработчик переключения на кастомный аэропорт
    const manualFrom = document.getElementById('manual-from');
    const manualFromCustom = document.getElementById('manual-from-custom');
    if (manualFrom && manualFromCustom) {
        manualFrom.addEventListener('change', () => {
            if (manualFrom.value === '__custom__') {
                manualFromCustom.classList.remove('hidden');
                manualFromCustom.focus();
            } else {
                manualFromCustom.classList.add('hidden');
                manualFromCustom.value = '';
            }
        });
    }

    const manualTo = document.getElementById('manual-to');
    const manualToCustom = document.getElementById('manual-to-custom');
    if (manualTo && manualToCustom) {
        manualTo.addEventListener('change', () => {
            if (manualTo.value === '__custom__') {
                manualToCustom.classList.remove('hidden');
                manualToCustom.focus();
            } else {
                manualToCustom.classList.add('hidden');
                manualToCustom.value = '';
            }
        });
    }

    // Жесткое ограничение до 3 заглавных символов в полях ввода своего кода
    const enforce3LetterCaps = (el) => {
        if (!el) return;
        ['input', 'change', 'keyup', 'blur', 'paste'].forEach(evt => {
            el.addEventListener(evt, () => {
                setTimeout(() => {
                    el.value = el.value.toUpperCase().replace(/[^A-ZА-Я0-9]/gi, '').slice(0, 3);
                }, 0);
            });
        });
    };
    enforce3LetterCaps(manualFromCustom);
    enforce3LetterCaps(manualToCustom);


    // Обработчик кнопки расчета (пишет в историю прогнозов)
    document.getElementById('btn-calculate').addEventListener('click', () => calculateBaggageForecast(true));
    document.getElementById('form-manual-flight').addEventListener('submit', handleManualFlightSubmit);

    const btnLoadSample = document.getElementById('btn-load-sample');
    if (btnLoadSample) {
        btnLoadSample.addEventListener('click', async () => {
            await loadSystemStats(false);
        });
    }

    setupDragAndDrop();

}

// Автоматическая/ручная загрузка системной статистики stats_july.xls
async function loadSystemStats(isSilent = true) {
    try {
        const response = await fetch('stats_july.xls');
        if (!response.ok) {
            throw new Error("Файл не найден");
        }
        const data = await response.arrayBuffer();
        const arr = new Uint8Array(data);
        const workbook = XLSX.read(arr, {type: 'array', cellDates: false});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, {header: 1, raw: false});
        
        processRegistrationData('Подробная статистика за Июль.xls', rows, { isSilent: isSilent, isSystem: true });
    } catch (err) {
        console.error("Ошибка автозагрузки статистики:", err);
        if (!isSilent) {
            showAviationAlert((currentLang === 'ru' ? 'Не удалось загрузить системную статистику: ' : 'Failed to load system statistics: ') + err.message, true);
        }
    }
}

// Настройка вкладок (Tabs) и авторизация по паролю NW2026
function setupTabs() {
    const tabPredictBtn = document.getElementById('tab-btn-predict');
    const tabAdminBtn = document.getElementById('tab-btn-admin');
    const predictContent = document.getElementById('tab-content-predict');
    const adminContent = document.getElementById('tab-content-admin');

    const authModal = document.getElementById('admin-auth-modal');
    const authForm = document.getElementById('admin-auth-form');
    const passwordInput = document.getElementById('admin-password-input');
    const authError = document.getElementById('admin-auth-error');
    const authCancelBtn = document.getElementById('admin-auth-cancel');
    const togglePassBtn = document.getElementById('btn-toggle-show-pass');

    if (togglePassBtn && passwordInput) {
        togglePassBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                togglePassBtn.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                togglePassBtn.textContent = '👁️';
            }
        });
    }

    if (tabPredictBtn) {
        tabPredictBtn.addEventListener('click', () => {
            tabPredictBtn.classList.add('active');
            if (tabAdminBtn) tabAdminBtn.classList.remove('active');
            if (predictContent) predictContent.classList.remove('hidden');
            if (adminContent) adminContent.classList.add('hidden');
        });
    }

    if (tabAdminBtn) {
        tabAdminBtn.addEventListener('click', () => {
            if (isAdminAuthenticated) {
                tabAdminBtn.classList.add('active');
                if (tabPredictBtn) tabPredictBtn.classList.remove('active');
                if (adminContent) adminContent.classList.remove('hidden');
                if (predictContent) predictContent.classList.add('hidden');
            } else {
                // Запрос ввода пароля NW2026 через стильное авиационное модальное окно
                if (authModal) {
                    if (passwordInput) passwordInput.value = '';
                    if (authError) authError.classList.add('hidden');
                    authModal.classList.remove('hidden');
                    setTimeout(() => {
                        if (passwordInput) passwordInput.focus();
                    }, 100);
                }
            }
        });
    }

    if (authCancelBtn) {
        authCancelBtn.addEventListener('click', () => {
            if (authModal) authModal.classList.add('hidden');
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const entered = passwordInput ? passwordInput.value.trim() : '';
            if (entered === 'NW2026') {
                isAdminAuthenticated = true;
                if (authModal) authModal.classList.add('hidden');
                if (tabAdminBtn) tabAdminBtn.classList.add('active');
                if (tabPredictBtn) tabPredictBtn.classList.remove('active');
                if (adminContent) adminContent.classList.remove('hidden');
                if (predictContent) predictContent.classList.add('hidden');
            } else {
                if (authError) authError.classList.remove('hidden');
                if (passwordInput) {
                    passwordInput.value = '';
                    passwordInput.focus();
                }
            }
        });
    }
}
// --- ФУНКЦИИ ФИЛЬТРАЦИИ И ВРЕМЕННЫХ ДИАПАЗОНОВ (30 ДНЕЙ) ---

// Регистрация аэропортов из загруженных рейсов в БД
function registerFlightsAirports(flights) {
    if (!flights || !baggageDb) return;
    flights.forEach(f => {
        const fromCode = String(f.from || '').trim().toUpperCase();
        const toCode = String(f.to || '').trim().toUpperCase();
        if (!fromCode || !toCode) return;

        const fromIata = ruToIata(fromCode) || fromCode;
        const toIata = ruToIata(toCode) || toCode;

        if (!baggageDb.airports[fromCode]) {
            baggageDb.airports[fromCode] = { iata: fromIata, ru: fromCode, name: fromCode };
        }
        if (!baggageDb.airports[toCode]) {
            baggageDb.airports[toCode] = { iata: toIata, ru: toCode, name: toCode };
        }

        if (baggageDb.departures_filter && !baggageDb.departures_filter.includes(fromCode) && !baggageDb.departures_filter.includes(fromIata)) {
            baggageDb.departures_filter.push(fromCode);
        }
        if (baggageDb.arrivals_filter && !baggageDb.arrivals_filter.includes(toCode) && !baggageDb.arrivals_filter.includes(toIata)) {
            baggageDb.arrivals_filter.push(toCode);
        }
    });
}

function updateActiveDateRangeAndCounts() {
    registerFlightsAirports(userFlights);
    populateAirportDropdowns();
    populateSeasonalYears();
    
    const totalCountEl = document.getElementById('total-flights-count');
    if (totalCountEl) {
        totalCountEl.textContent = userFlights.length;
    }

    if (userFlights.length === 0) {
        const activeCountEl = document.getElementById('active-flights-count');
        if (activeCountEl) activeCountEl.textContent = '0';
        const activeRangeEl = document.getElementById('active-date-range');
        if (activeRangeEl) activeRangeEl.textContent = '-';
        return;
    }

    let maxDateMs = 0;
    userFlights.forEach(flight => {
        const time = Date.parse(flight.date);
        if (!isNaN(time) && time > maxDateMs) {
            maxDateMs = time;
        }
    });

    if (maxDateMs === 0) {
        const activeCountEl = document.getElementById('active-flights-count');
        if (activeCountEl) activeCountEl.textContent = '0';
        const activeRangeEl = document.getElementById('active-date-range');
        if (activeRangeEl) activeRangeEl.textContent = '-';
        return;
    }

    // 30-дневный период для флага flight.active и для вывода в статус-бар Администрирования
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const minDateMs30 = maxDateMs - thirtyDaysMs;
    
    let activeCount30 = 0;
    userFlights.forEach(flight => {
        const time = Date.parse(flight.date);
        if (!isNaN(time) && time >= minDateMs30 && time <= maxDateMs) {
            flight.active = true;
            activeCount30++;
        } else {
            flight.active = false;
        }
    });

    const maxDate = new Date(maxDateMs);
    const minDate30 = new Date(minDateMs30);

    const formatDate = (d) => {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const dateRangeStr = `${formatDate(minDate30)} - ${formatDate(maxDate)}`;
    const activeRangeEl = document.getElementById('active-date-range');
    if (activeRangeEl) activeRangeEl.textContent = dateRangeStr;

    const activeCountEl = document.getElementById('active-flights-count');
    if (activeCountEl) activeCountEl.textContent = activeCount30;
}

// --- ЛОГИКА РАСЧЕТА ПРОГНОЗА БАГАЖА ---

function calculateBaggageForecast(logToHistory = false) {
    const fromVal = document.getElementById('select-from').value;
    const toVal = document.getElementById('select-to').value;
    const flightVal = document.getElementById('select-flight').value;
    const paxInputEl = document.getElementById('input-pax');
    let paxVal = parseInt(paxInputEl.value) || 0;
    if (paxVal > 1000) {
        paxVal = 1000;
        paxInputEl.value = 1000;
    }
    
    const warningBox = document.getElementById('date-warning');
    warningBox.classList.add('hidden');

    if (!fromVal || !toVal || paxVal <= 0) {
        document.getElementById('res-pcs').textContent = '0';
        document.getElementById('res-weight').textContent = '0';
        document.getElementById('res-hb').textContent = '0';
        document.getElementById('coef-pcs-pax').textContent = '-';
        document.getElementById('coef-weight-pc').textContent = '-';
        document.getElementById('coef-hb-pax').textContent = '-';
        document.getElementById('calc-source-desc').textContent = '-';
        return;
    }

    // Считываем параметры расширенного анализа данных
    const scopeVal = document.getElementById('select-analysis-scope').value;
    const periodTypeVal = document.getElementById('select-period-type').value;
    const customStartVal = document.getElementById('input-analysis-start-date').value;
    const customEndVal = document.getElementById('input-analysis-end-date').value;
    const seasonalMonthVal = document.getElementById('select-seasonal-month').value;
    const seasonalYearVal = document.getElementById('select-seasonal-year').value;

    let coefs = null;
    let sourceDesc = '';

    // Всегда по умолчанию приоритет загруженным данным
    coefs = getUploadedCoefficients(
        fromVal, toVal, flightVal,
        scopeVal, periodTypeVal,
        customStartVal, customEndVal,
        seasonalMonthVal, seasonalYearVal
    );

    if (coefs) {
        const scopeText = coefs.isFlightSpecific 
            ? (translations[currentLang]['scope-flight'] || 'Рейс')
            : (translations[currentLang]['scope-route'] || 'Направление');

        const fromIata = ruToIata(fromVal) || fromVal;
        const toIata = ruToIata(toVal) || toVal;

        if (coefs.periodType === '30days') {
            if (coefs.isFallback) {
                const dateStr = formatDateStr(coefs.fallbackDate);
                let msg = '';
                if (flightVal) {
                    msg = translations[currentLang]['warning-no-flights-30']
                        .replace('{flight}', flightVal)
                        .replace('{from}', fromIata)
                        .replace('{to}', toIata)
                        .replace('{date}', dateStr);
                } else {
                    msg = translations[currentLang]['warning-no-route-30']
                        .replace('{from}', fromIata)
                        .replace('{to}', toIata)
                        .replace('{date}', dateStr);
                }
                document.getElementById('warning-text').textContent = msg;
                warningBox.classList.remove('hidden');
                
                sourceDesc = translations[currentLang]['source-desc-uploaded-closest'].replace('{date}', dateStr);
            } else {
                sourceDesc = `${translations[currentLang]['source-desc-uploaded-30']} (${scopeText})`;
            }
        } else if (coefs.periodType === 'weekday4') {
            const dateInputEl = document.getElementById('input-date');
            const targetDateVal = dateInputEl ? dateInputEl.value : '';
            const targetDayOfWeek = getDayOfWeekFromIsoStr(targetDateVal || new Date().toISOString().split('T')[0]);
            
            const ruDaysAccusative = ['воскресенье', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу'];
            const ruDaysNominative = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
            const enDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            const weekdayAccusative = currentLang === 'ru' ? ruDaysAccusative[targetDayOfWeek] : enDays[targetDayOfWeek];
            const weekdayNominative = currentLang === 'ru' ? ruDaysNominative[targetDayOfWeek] : enDays[targetDayOfWeek];

            if (coefs.isFallback) {
                const dateStr = formatDateStr(coefs.fallbackDate);
                let msg = '';
                if (flightVal) {
                    msg = translations[currentLang]['warning-no-flights-weekday4']
                        .replace('{flight}', flightVal)
                        .replace('{from}', fromIata)
                        .replace('{to}', toIata)
                        .replace('{weekday}', weekdayAccusative)
                        .replace('{date}', dateStr);
                } else {
                    msg = translations[currentLang]['warning-no-route-weekday4']
                        .replace('{from}', fromIata)
                        .replace('{to}', toIata)
                        .replace('{weekday}', weekdayAccusative)
                        .replace('{date}', dateStr);
                }
                document.getElementById('warning-text').textContent = msg;
                warningBox.classList.remove('hidden');
                
                sourceDesc = translations[currentLang]['source-desc-uploaded-weekday4-fallback'].replace('{date}', dateStr).replace('{scope}', scopeText);
            } else {
                sourceDesc = translations[currentLang]['source-desc-uploaded-weekday4']
                    .replace('{weekday}', weekdayNominative)
                    .replace('{scope}', scopeText);
            }
        } else if (coefs.periodType === 'custom') {
            const startStr = customStartVal ? formatDateStr(customStartVal) : '...';
            const endStr = customEndVal ? formatDateStr(customEndVal) : '...';
            sourceDesc = translations[currentLang]['source-desc-uploaded-custom']
                .replace('{start}', startStr)
                .replace('{end}', endStr)
                .replace('{scope}', scopeText);
        } else if (coefs.periodType === 'seasonal') {
            const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            const monthKey = monthKeys[parseInt(seasonalMonthVal)] || 'jan';
            const monthName = translations[currentLang][`month-${monthKey}`] || 'Month';
            const yearStr = seasonalYearVal === 'all' 
                ? (translations[currentLang]['opt-all-years'] || 'все года')
                : seasonalYearVal;
            sourceDesc = translations[currentLang]['source-desc-uploaded-seasonal']
                .replace('{month}', monthName)
                .replace('{year}', yearStr)
                .replace('{scope}', scopeText);
        }
    }

    // Если в загруженных нет вообще, делаем фолбэк к историческим
    if (!coefs) {
        coefs = getHistoricalCoefficients(fromVal, toVal, flightVal);
        if (coefs) {
            sourceDesc = translations[currentLang]['source-desc-historical'];
        }
    }

    // Крайний фолбэк к стандартным нормам
    if (!coefs) {
        coefs = {
            pcs_pax: 0.4,
            wght_pc: 13.0,
            hb_pax: 2.0
        };
        sourceDesc = translations[currentLang]['source-desc-default'];
    }

    // --- ВЫЧИСЛЕНИЕ РЕЗУЛЬТАТОВ (ОКРУГЛЕНИЕ ДО ЦЕЛЫХ) ---
    const expectedPcs = Math.round(paxVal * coefs.pcs_pax);
    // Вес багажа и ручной клади округляются до целых
    const expectedWeight = Math.round(expectedPcs * coefs.wght_pc);
    const expectedHb = Math.round(paxVal * coefs.hb_pax);

    // Вывод результатов с красивой анимацией (с целыми числами)
    animateNumber('res-pcs', expectedPcs, 0);
    animateNumber('res-weight', expectedWeight, 0);
    animateNumber('res-hb', expectedHb, 0);

    // Вывод коэффициентов
    document.getElementById('coef-pcs-pax').textContent = coefs.pcs_pax.toFixed(4);
    document.getElementById('coef-weight-pc').textContent = coefs.wght_pc.toFixed(2) + ' кг';
    document.getElementById('coef-hb-pax').textContent = coefs.hb_pax.toFixed(2) + ' кг';
    document.getElementById('calc-source-desc').textContent = sourceDesc;

    // Отрисовываем детализацию отобранных рейсов и расчётных агрегированных значений
    renderSampledFlightsDetails(coefs);

    // Обновляем связанные расчеты средней массы и распределения
    // Обновляем плашку активного рейса в шапке
    const dateInputEl = document.getElementById('input-date');
    const targetDateVal = dateInputEl ? dateInputEl.value : '';
    updateActiveFlightBadge(fromVal, toVal, flightVal, targetDateVal);

    // Сохраняем расчет в историю прогнозов (только если нажата кнопка)
    if (logToHistory) {
        const prediction = {
            id: 'pred_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            from: fromVal,
            to: toVal,
            flight_no: flightVal || translations[currentLang]['select-all-flights-placeholder'],
            pax: paxVal,
            bag_pcs: expectedPcs,
            bag_weight: expectedWeight,
            hb_weight: expectedHb,
            flight_date: targetDateVal || new Date().toISOString().split('T')[0],
            calc_date: new Date().toISOString()
        };
        predictionsHistory.unshift(prediction);
        savePredictionsHistory();
        renderPredictionsTable();

        // Выделяем новую сохраненную строку в истории
        setTimeout(() => {
            highlightPredictionRow(prediction.id);
        }, 50);
    }
}

// Функция отрисовки детализации отобранных рейсов и формул в карточку ответа
function renderSampledFlightsDetails(coefs) {
    const containerEl = document.getElementById('sampled-flights-container');
    const tbodyEl = document.getElementById('sampled-flights-tbody');
    const tfootEl = document.getElementById('sampled-flights-tfoot');
    const titleEl = document.getElementById('sampled-flights-title');

    if (!containerEl || !tbodyEl || !tfootEl) return;

    // Навешиваем клик для разворачивания/сворачивания
    const toggleEl = document.getElementById('sampled-flights-toggle');
    if (toggleEl && !toggleEl.dataset.hasListener) {
        toggleEl.dataset.hasListener = 'true';
        toggleEl.addEventListener('click', function() {
            containerEl.classList.toggle('collapsed');
        });
    }

    if (!coefs) {
        containerEl.classList.add('hidden');
        tbodyEl.innerHTML = '';
        tfootEl.innerHTML = '';
        return;
    }

    // Если есть реальные отобранные рейсы
    if (coefs.usedFlights && coefs.usedFlights.length > 0) {
        const flights = coefs.usedFlights;
        containerEl.classList.remove('hidden');

        if (titleEl) {
            const titlePattern = translations[currentLang]['sampled-flights-title'] || 'Отобранные рейсы для расчета ({count} вып.):';
            titleEl.textContent = titlePattern.replace('{count}', flights.length);
        }

        const ruShortDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const enShortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        let htmlBody = '';
        flights.forEach((f, idx) => {
            const pax = getEffectivePaxCount(f);
            const pcs = parseInt(f.bag_pcs) || 0;
            const weight = parseFloat(f.bag_weight) || 0;
            const hb = parseFloat(f.hb_weight) || 0;

            let formattedDate = f.date ? formatDateStr(f.date) : '-';
            if (f.date) {
                const dayIdx = getDayOfWeekFromIsoStr(f.date);
                const dayName = currentLang === 'ru' ? ruShortDays[dayIdx] : enShortDays[dayIdx];
                formattedDate += ` (${dayName})`;
            }

            let weightBadge = '';
            if (coefs.isWeighted && coefs.weights && coefs.weights[idx] !== undefined) {
                const wPct = Math.round(coefs.weights[idx] * 100);
                weightBadge = `<span style="background: rgba(0, 240, 255, 0.15); border: 1px solid var(--accent-cyan); color: var(--accent-cyan); font-size: 0.75rem; padding: 1px 6px; border-radius: 4px; margin-left: 6px; font-weight: bold;">${wPct}%</span>`;
            }

            htmlBody += `
                <tr>
                    <td>${formattedDate} ${weightBadge}</td>
                    <td><strong>${f.flight_no || '-'}</strong></td>
                    <td class="cyan-val">${pax}</td>
                    <td class="gold-val">${pcs}</td>
                    <td class="gold-val">${weight.toLocaleString('ru-RU')} кг</td>
                    <td class="purple-val">${hb.toLocaleString('ru-RU')} кг</td>
                </tr>
            `;
        });
        tbodyEl.innerHTML = htmlBody;

        const totalsLabel = translations[currentLang]['sample-totals-label'] || 'ИТОГО (СУММЫ):';
        const unitKg = translations[currentLang]['unit-kg'] || 'кг';

        let formulaTitle = coefs.isWeighted
            ? '📐 <strong>Расчет коэффициентов (Экспоненциальное весовое сглаживание 40% / 30% / 20% / 10%):</strong>'
            : '📐 <strong>Расчет коэффициентов (Суммарное среднее):</strong>';

        let formulaDetails = coefs.isWeighted && coefs.weights && coefs.weights.length > 0
            ? `• <strong>PCS/PAX</strong> = <strong>${coefs.pcs_pax.toFixed(4)}</strong> (веса свежести: ${coefs.weights.map(w => Math.round(w*100) + '%').join(' / ')})<br/>
               • <strong>Weight/PC</strong> = <strong>${coefs.wght_pc.toFixed(2)} ${unitKg}</strong><br/>
               • <strong>HB/PAX</strong> = <strong>${coefs.hb_pax.toFixed(2)} ${unitKg}</strong>`
            : `• <strong>PCS/PAX</strong> = ${coefs.totalBags} / ${coefs.totalPax} = <strong>${coefs.pcs_pax.toFixed(4)}</strong><br/>
               • <strong>Weight/PC</strong> = ${coefs.totalBagWeight.toLocaleString('ru-RU')} / ${coefs.totalBags} = <strong>${coefs.wght_pc.toFixed(2)} ${unitKg}</strong><br/>
               • <strong>HB/PAX</strong> = ${coefs.totalHbWeight.toLocaleString('ru-RU')} / ${coefs.totalPax} = <strong>${coefs.hb_pax.toFixed(2)} ${unitKg}</strong>`;

        let htmlFoot = `
            <tr class="sample-totals-row">
                <td colspan="2"><strong>${totalsLabel}</strong> (${flights.length})</td>
                <td class="cyan-val">${coefs.totalPax} чел.</td>
                <td class="gold-val">${coefs.totalBags} pcs</td>
                <td class="gold-val">${coefs.totalBagWeight.toLocaleString('ru-RU')} ${unitKg}</td>
                <td class="purple-val">${coefs.totalHbWeight.toLocaleString('ru-RU')} ${unitKg}</td>
            </tr>
            <tr class="sample-formulas-row">
                <td colspan="6">
                    ${formulaTitle}<br/>
                    ${formulaDetails}
                </td>
            </tr>
        `;
        tfootEl.innerHTML = htmlFoot;
    } else {
        // Если использовались нормативные правила базы данных (rules) без списка выполнений
        containerEl.classList.remove('hidden');
        if (titleEl) {
            titleEl.textContent = currentLang === 'ru' ? 'Исторические нормативы базы данных:' : 'Historical Database Standards:';
        }
        tbodyEl.innerHTML = '';
        const unitKg = translations[currentLang]['unit-kg'] || 'кг';
        tfootEl.innerHTML = `
            <tr class="sample-formulas-row">
                <td colspan="6">
                    📐 <strong>Нормативные коэффициенты направления:</strong><br/>
                    • <strong>PCS/PAX</strong> = <strong>${coefs.pcs_pax.toFixed(4)}</strong><br/>
                    • <strong>Weight/PC</strong> = <strong>${coefs.wght_pc.toFixed(2)} ${unitKg}</strong><br/>
                    • <strong>HB/PAX</strong> = <strong>${coefs.hb_pax.toFixed(2)} ${unitKg}</strong>
                </td>
            </tr>
        `;
    }
}

// Вспомогательная функция анимации чисел
function animateNumber(elementId, targetVal, decimals = 0) {
    const el = document.getElementById(elementId);
    const startVal = parseFloat(el.textContent) || 0;
    const duration = 400;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress * (2 - progress);
        const currentVal = startVal + (targetVal - startVal) * ease;
        el.textContent = currentVal.toFixed(decimals);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = targetVal.toFixed(decimals);
        }
    }
    requestAnimationFrame(update);
}

// Вспомогательная функция для получения дня недели без сдвига часовых поясов
function getDayOfWeekFromIsoStr(isoStr) {
    if (!isoStr) return 0;
    const parts = isoStr.split('-');
    if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        return new Date(y, m, d).getDay();
    }
    const d = new Date(isoStr);
    return isNaN(d.getTime()) ? 0 : d.getDay();
}

// Поиск коэффициентов по загруженной базе рейсов с учетом параметров фильтрации и сезонности
function getUploadedCoefficients(from, to, flightNo, scope = 'auto', periodType = '30days', customStart = '', customEnd = '', seasonalMonth = '0', seasonalYear = 'all') {
    if (userFlights.length === 0) return null;

    const fromIata = ruToIata(from);
    const toIata = ruToIata(to);
    
    // Фильтруем строго по маршруту
    const routeFlights = userFlights.filter(f => ruToIata(f.from) === fromIata && ruToIata(f.to) === toIata);
    if (routeFlights.length === 0) return null;

    // Определяем целевые рейсы на основе области (scope)
    let targetFlights = routeFlights;
    let isFlightSpecific = false;

    if (flightNo && (scope === 'flight' || scope === 'auto')) {
        const matchingFlights = routeFlights.filter(f => f.flight_no === flightNo);
        if (matchingFlights.length > 0) {
            targetFlights = matchingFlights;
            isFlightSpecific = true;
        } else if (scope === 'flight') {
            // Если область "Строго по рейсу" и совпадений нет
            return null;
        }
    }

    // Определяем целевой день недели, если используется weekday4
    let targetDayOfWeek = new Date().getDay();
    let targetDateVal = '';
    if (periodType === 'weekday4') {
        const dateInputEl = document.getElementById('input-date');
        targetDateVal = dateInputEl ? dateInputEl.value : '';
        targetDayOfWeek = getDayOfWeekFromIsoStr(targetDateVal || new Date().toISOString().split('T')[0]);
    }

    // Фильтруем по времени
    let filtered = [];
    let isFallback = false;
    let fallbackDate = '';

    if (periodType === '30days') {
        filtered = targetFlights.filter(f => f.active);
        if (filtered.length === 0 && scope === 'auto') {
            // Фолбэк на ближайшую дату для конкретного рейса
            const sorted = [...targetFlights].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
            if (sorted.length > 0) {
                fallbackDate = sorted[0].date;
                filtered = targetFlights.filter(f => f.date === fallbackDate);
                isFallback = true;
            }
        }
    } else if (periodType === 'weekday4') {
        const targetDateMs = targetDateVal ? Date.parse(targetDateVal) : Date.now();
        const window60Ms = 60 * 24 * 60 * 60 * 1000; // 60 дней диапазона

        // 1. Ищем последние 4 рейса за 60 дней в тот же день недели
        filtered = targetFlights.filter(f => {
            if (getDayOfWeekFromIsoStr(f.date) !== targetDayOfWeek) return false;
            const fMs = Date.parse(f.date);
            if (isNaN(fMs)) return false;
            const diff = targetDateMs - fMs;
            return diff >= 0 && diff <= window60Ms;
        });

        // Сортируем по дате (свежие вверху) и берем последние 4
        filtered = filtered.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 4);

        // 2. Если за 60 дней по дню недели рейсов нет — берем среднее значение за ближайшие 30 дней до даты вылета
        if (filtered.length === 0) {
            isFallback = true;
            filtered = targetFlights.filter(f => {
                const fMs = Date.parse(f.date);
                if (isNaN(fMs)) return false;
                const diff = targetDateMs - fMs;
                return diff >= 0 && diff <= 30 * 24 * 60 * 60 * 1000;
            });
            filtered = filtered.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

            // Если за 30 дней до целевой даты рейсов не летело, берем 1 последний рейс до даты вылета
            if (filtered.length === 0) {
                const pastFlights = targetFlights
                    .filter(f => Date.parse(f.date) <= targetDateMs)
                    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
                if (pastFlights.length > 0) {
                    filtered = [pastFlights[0]];
                }
            }

            if (filtered.length > 0) {
                fallbackDate = filtered[0].date;
            }
        }
    } else if (periodType === 'custom') {
        const startMs = customStart ? Date.parse(customStart) : 0;
        const endMs = customEnd ? Date.parse(customEnd) : Infinity;
        
        filtered = targetFlights.filter(f => {
            const fTime = Date.parse(f.date);
            return !isNaN(fTime) && fTime >= startMs && fTime <= endMs;
        });
    } else if (periodType === 'seasonal') {
        filtered = targetFlights.filter(f => {
            if (!f.date) return false;
            const dateObj = new Date(f.date);
            const mMatch = dateObj.getMonth() === parseInt(seasonalMonth);
            const yMatch = (seasonalYear === 'all') || (dateObj.getFullYear() === parseInt(seasonalYear));
            return mMatch && yMatch;
        });
    }

    // Фолбэк с уровня рейса на уровень маршрута в режиме "auto", если за выбранный период по конкретному рейсу нет данных
    if (filtered.length === 0 && scope === 'auto' && isFlightSpecific) {
        let routeTargetFlights = routeFlights;
        if (periodType === '30days') {
            filtered = routeTargetFlights.filter(f => f.active);
            if (filtered.length === 0) {
                const sorted = [...routeTargetFlights].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
                if (sorted.length > 0) {
                    fallbackDate = sorted[0].date;
                    filtered = routeTargetFlights.filter(f => f.date === fallbackDate);
                    isFallback = true;
                }
            }
        } else if (periodType === 'weekday4') {
            // Фолбэк на уровень маршрута с тем же днем недели
            filtered = routeTargetFlights.filter(f => {
                return getDayOfWeekFromIsoStr(f.date) === targetDayOfWeek;
            });
            filtered = filtered.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 4);
            
            // Если и на уровне маршрута нет этого дня недели, берем последние 4 рейса по маршруту за любые дни
            if (filtered.length === 0) {
                filtered = routeTargetFlights.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 4);
                if (filtered.length > 0) {
                    isFallback = true;
                    fallbackDate = filtered[0].date;
                }
            }
        } else if (periodType === 'custom') {
            const startMs = customStart ? Date.parse(customStart) : 0;
            const endMs = customEnd ? Date.parse(customEnd) : Infinity;
            filtered = routeTargetFlights.filter(f => {
                const fTime = Date.parse(f.date);
                return !isNaN(fTime) && fTime >= startMs && fTime <= endMs;
            });
        } else if (periodType === 'seasonal') {
            filtered = routeTargetFlights.filter(f => {
                if (!f.date) return false;
                const dateObj = new Date(f.date);
                const mMatch = dateObj.getMonth() === parseInt(seasonalMonth);
                const yMatch = (seasonalYear === 'all') || (dateObj.getFullYear() === parseInt(seasonalYear));
                return mMatch && yMatch;
            });
        }
        if (filtered.length > 0) {
            isFlightSpecific = false; // Успешно откатились до общего маршрута
        }
    }

    if (filtered.length === 0) return null;

    const isWeighted = false;
    const result = calculateMeansFromFlights(filtered, isWeighted);
    if (result) {
        result.isFallback = isFallback;
        result.fallbackDate = fallbackDate;
        result.isFlightSpecific = isFlightSpecific;
        result.periodType = periodType;
        result.matchedCount = filtered.length;
    }
    return result;
}

// Расчет средних коэффициентов по переданному массиву рейсов (с поддержкой экспоненциального весового сглаживания)
function calculateMeansFromFlights(flights, isWeighted = false) {
    if (!flights || flights.length === 0) return null;

    // Сортируем по дате в обратном порядке (самый свежий — индекс 0)
    const sortedFlights = [...flights].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

    let totalPax = 0;
    let totalBags = 0;
    let totalBagWeight = 0;
    let totalHbWeight = 0;

    sortedFlights.forEach(f => {
        const pax = getEffectivePaxCount(f);
        const pcs = parseInt(f.bag_pcs) || 0;
        const bagWeight = parseFloat(f.bag_weight) || 0;
        const hbWeight = parseFloat(f.hb_weight) || 0;

        totalPax += pax;
        totalBags += pcs;
        totalBagWeight += bagWeight;
        totalHbWeight += hbWeight;
    });

    if (totalPax === 0) return null;

    let pcs_pax = 0;
    let wght_pc = 0;
    let hb_pax = 0;
    let weights = [];

    if (isWeighted && sortedFlights.length > 0) {
        // Базовые веса: 4-й самый свежий (индекс 0) = 40%, 3-й = 30%, 2-й = 20%, 1-й = 10%
        const baseWeights = [0.40, 0.30, 0.20, 0.10].slice(0, sortedFlights.length);
        const sumW = baseWeights.reduce((a, b) => a + b, 0);
        weights = baseWeights.map(w => w / sumW);

        sortedFlights.forEach((f, idx) => {
            const pax = getEffectivePaxCount(f);
            const pcs = parseInt(f.bag_pcs) || 0;
            const bagWeight = parseFloat(f.bag_weight) || 0;
            const hbWeight = parseFloat(f.hb_weight) || 0;

            const fl_pcs_pax = pax > 0 ? (pcs / pax) : 0;
            const fl_wght_pc = pcs > 0 ? (bagWeight / pcs) : 0;
            const fl_hb_pax = pax > 0 ? (hbWeight / pax) : 0;

            const w = weights[idx];
            pcs_pax += w * fl_pcs_pax;
            wght_pc += w * fl_wght_pc;
            hb_pax += w * fl_hb_pax;
        });
    } else {
        pcs_pax = totalBags / totalPax;
        wght_pc = totalBags > 0 ? (totalBagWeight / totalBags) : 0.0;
        hb_pax = totalHbWeight / totalPax;
    }

    return {
        pcs_pax: pcs_pax,
        wght_pc: wght_pc,
        hb_pax: hb_pax,
        usedFlights: sortedFlights,
        weights: weights,
        isWeighted: isWeighted,
        totalPax: totalPax,
        totalBags: totalBags,
        totalBagWeight: totalBagWeight,
        totalHbWeight: totalHbWeight
    };
}

// Поиск коэффициентов в исторической базе baggageDb
function getHistoricalCoefficients(fromRu, toRu, flightNo) {
    if (!baggageDb || !baggageDb.rules) return null;

    const fromIata = ruToIata(fromRu);
    const toIata = ruToIata(toRu);

    if (flightNo) {
        const rule = baggageDb.rules.find(r => r.from === fromIata && r.to === toIata && r.flt_no === flightNo);
        if (rule) return rule;
    }

    const dirRule = baggageDb.rules.find(r => r.from === fromIata && r.to === toIata && !r.flt_no);
    if (dirRule) return dirRule;

    const anyRule = baggageDb.rules.find(r => r.from === fromIata && r.to === toIata);
    if (anyRule) return anyRule;

    return null;
}



// --- HUD ТОСТ УВЕДОМЛЕНИЯ ---
function showAviationAlert(message, isError = false) {
    let container = document.getElementById('aviation-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'aviation-toast-container';
        container.className = 'aviation-toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `aviation-toast glass ${isError ? 'error-toast' : 'success-toast'}`;
    toast.innerHTML = `
        <div class="hud-corner top-left"></div>
        <div class="hud-corner top-right"></div>
        <div class="hud-corner bottom-left"></div>
        <div class="hud-corner bottom-right"></div>
        <span class="toast-icon">${isError ? '⚠️' : '✅'}</span>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('visible');
    }, 50);
    
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// --- УДАЛЕНИЕ И ОЧИСТКА ---

let activeConfirmCallback = null;

function showAviationConfirm(message, onConfirm) {
    const modal = document.getElementById('aviation-confirm-modal');
    const msgEl = document.getElementById('aviation-confirm-message');
    if (!modal || !msgEl) {
        if (confirm(message)) {
            onConfirm();
        }
        return;
    }
    
    // Принудительный перевод шапки и кнопок модального окна перед открытием
    const titleEl = modal.querySelector('.modal-title-text');
    const cancelBtn = document.getElementById('modal-btn-cancel');
    const confirmBtn = document.getElementById('modal-btn-confirm');
    
    if (titleEl && translations[currentLang]['modal-confirm-title']) {
        titleEl.textContent = translations[currentLang]['modal-confirm-title'];
    }
    if (cancelBtn && translations[currentLang]['modal-confirm-cancel']) {
        cancelBtn.textContent = translations[currentLang]['modal-confirm-cancel'];
    }
    if (confirmBtn && translations[currentLang]['modal-confirm-submit']) {
        confirmBtn.textContent = translations[currentLang]['modal-confirm-submit'];
    }
    
    msgEl.textContent = message;
    activeConfirmCallback = onConfirm;
    modal.classList.remove('hidden');
}

function initAviationModal() {
    const modal = document.getElementById('aviation-confirm-modal');
    const cancelBtn = document.getElementById('modal-btn-cancel');
    const confirmBtn = document.getElementById('modal-btn-confirm');
    
    if (!modal || !cancelBtn || !confirmBtn) return;
    
    cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        activeConfirmCallback = null;
    });
    
    confirmBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        if (typeof activeConfirmCallback === 'function') {
            activeConfirmCallback();
        }
        activeConfirmCallback = null;
    });
}

// Сравнение рейсов на полное совпадение (номер рейса, дата, маршрут вылета/прилета)
function isSameFlight(f1, f2) {
    if (!f1 || !f2) return false;
    const sameNum = getNumericFlightNo(f1.flight_no) === getNumericFlightNo(f2.flight_no);
    const sameDate = String(f1.date || '').trim() === String(f2.date || '').trim();
    const sameFrom = ruToIata(f1.from) === ruToIata(f2.from);
    const sameTo = ruToIata(f1.to) === ruToIata(f2.to);
    return sameNum && sameDate && sameFrom && sameTo;
}

function upsertFlight(newFlight) {
    const idx = userFlights.findIndex(oldF => isSameFlight(oldF, newFlight));
    if (idx !== -1) {
        userFlights[idx] = newFlight;
    } else {
        userFlights.push(newFlight);
    }
}

function handleManualFlightSubmit(e) {
    if (e) e.preventDefault();

    const airline = document.getElementById('manual-airline').value || 'N4';
    const flightNo = (document.getElementById('manual-flight-no').value || '').trim();
    const dateIso = document.getElementById('manual-date').value;
    
    const manualFromEl = document.getElementById('manual-from');
    const manualFromCustomEl = document.getElementById('manual-from-custom');
    const manualToEl = document.getElementById('manual-to');
    const manualToCustomEl = document.getElementById('manual-to-custom');

    let rawFrom = (manualFromEl && manualFromEl.value === '__custom__' && manualFromCustomEl ? manualFromCustomEl.value : (manualFromEl ? manualFromEl.value : '')).trim().toUpperCase();
    let rawTo = (manualToEl && manualToEl.value === '__custom__' && manualToCustomEl ? manualToCustomEl.value : (manualToEl ? manualToEl.value : '')).trim().toUpperCase();

    if (!flightNo || !dateIso || !rawFrom || !rawTo) {
        showAviationAlert(translations[currentLang]['error-fields-required'], true);
        return;
    }

    let fromCode = rawFrom.split(' ')[0].split('(')[0].trim();
    let toCode = rawTo.split(' ')[0].split('(')[0].trim();

    const men = parseInt(document.getElementById('manual-men').value, 10) || 0;
    const women = parseInt(document.getElementById('manual-women').value, 10) || 0;
    const rb = parseInt(document.getElementById('manual-rb').value, 10) || 0;
    const rm = parseInt(document.getElementById('manual-rm').value, 10) || 0;

    const pax = men + women + rb;
    if (pax <= 0) {
        showAviationAlert(currentLang === 'ru' ? 'Укажите количество пассажиров!' : 'Please enter passenger count!', true);
        return;
    }

    const bagPcs = parseInt(document.getElementById('manual-bag-pcs').value, 10) || 0;
    const bagWeight = parseFloat(document.getElementById('manual-bag-weight').value) || 0.0;
    const hbWeight = parseFloat(document.getElementById('manual-hb-weight').value) || 0.0;

    const fromIata = ruToIata(fromCode);
    const toIata = ruToIata(toCode);

    if (!baggageDb.airports[fromCode]) {
        baggageDb.airports[fromCode] = { iata: fromIata, ru: fromCode, name: fromCode };
    }
    if (!baggageDb.airports[toCode]) {
        baggageDb.airports[toCode] = { iata: toIata, ru: toCode, name: toCode };
    }
    if (baggageDb.departures_filter && !baggageDb.departures_filter.includes(fromCode) && !baggageDb.departures_filter.includes(fromIata)) {
        baggageDb.departures_filter.push(fromIata);
    }
    if (baggageDb.arrivals_filter && !baggageDb.arrivals_filter.includes(toCode) && !baggageDb.arrivals_filter.includes(toIata)) {
        baggageDb.arrivals_filter.push(toIata);
    }

    const newFlight = {
        id: 'manual_' + Date.now(),
        airline: airline,
        flight_no: flightNo,
        date: dateIso,
        from: iataToRu(fromIata) || fromCode,
        to: iataToRu(toIata) || toCode,
        men: men,
        women: women,
        rb: rb,
        rm: rm,
        pax: pax,
        bag_pcs: bagPcs,
        bag_weight: bagWeight,
        hb_weight: hbWeight,
        source: 'manual',
        active: true
    };

    upsertFlight(newFlight);
    saveUserFlights();

    populateAirportDropdowns();
    populateAllFlightsDropdown();

    const selectFrom = document.getElementById('select-from');
    if (selectFrom) {
        const evt = new Event('change');
        selectFrom.dispatchEvent(evt);
    }

    showAviationAlert(translations[currentLang]['success-flight-added'], false);

    document.getElementById('manual-flight-no').value = '';
    document.getElementById('manual-men').value = 0;
    document.getElementById('manual-women').value = 0;
    document.getElementById('manual-rb').value = 0;
    document.getElementById('manual-rm').value = 0;
    document.getElementById('manual-bag-pcs').value = 0;
    document.getElementById('manual-bag-weight').value = 0;
    document.getElementById('manual-hb-weight').value = 0;
    
    if (manualFromEl) manualFromEl.value = '';
    if (manualToEl) manualToEl.value = '';
    if (manualFromCustomEl) {
        manualFromCustomEl.value = '';
        manualFromCustomEl.classList.add('hidden');
    }
    if (manualToCustomEl) {
        manualToCustomEl.value = '';
        manualToCustomEl.classList.add('hidden');
    }
}

// Экспорт всей базы данных (рейсы + история прогнозов) в JSON файл
function handleExportDatabase() {
    try {
        const backupData = {
            backup_version: "1.0",
            exported_at: new Date().toISOString(),
            flights: userFlights,
            predictions_history: predictionsHistory
        };

        const jsonString = JSON.stringify(backupData, null, 4);
        const blob = new Blob([jsonString], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        const dateObj = new Date();
        const dateStr = dateObj.getFullYear() + "_" + 
                        String(dateObj.getMonth() + 1).padStart(2, '0') + "_" + 
                        String(dateObj.getDate()).padStart(2, '0');
        
        link.href = url;
        link.download = `aerobag_backup_${dateStr}.json`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        // Небольшая задержка перед удалением и очисткой URL для стабильности в некоторых браузерах
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    } catch (err) {
        console.error("Ошибка экспорта базы данных:", err);
        showAviationAlert("Ошибка экспорта базы данных", true);
    }
}

// Импорт базы данных из JSON файла резервной копии
function handleImportDatabase(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            let importedFlights = [];
            let importedPredictions = [];

            // Проверяем структуру бэкапа
            if (parsed && typeof parsed === 'object') {
                if (Array.isArray(parsed)) {
                    // Обратная совместимость: если бэкап - это просто массив рейсов
                    importedFlights = parsed;
                } else {
                    importedFlights = Array.isArray(parsed.flights) ? parsed.flights : [];
                    importedPredictions = Array.isArray(parsed.predictions_history) ? parsed.predictions_history : [];
                }
            } else {
                throw new Error("Неверный формат JSON");
            }

            // Записываем данные в глобальное состояние
            userFlights = importedFlights;
            predictionsHistory = importedPredictions;

            // Сохраняем в зависимости от оффлайн/онлайн режима
            if (isOfflineMode) {
                localStorage.setItem('averago_user_flights_local', JSON.stringify(userFlights));
            } else {
                // В режиме MySQL отправляем все восстановленные рейсы на сервер (UPSERT)
                await saveUserFlights();
            }

            // История прогнозов всегда сохраняется в localStorage
            savePredictionsHistory();

            // Обновляем весь UI
            updateActiveDateRangeAndCounts();
            renderFlightsTable();
            renderPredictionsTable();
            renderUploadedFilesList();

            // Сбрасываем фильтры, чтобы пересчитать выпадающие списки
            const selectFrom = document.getElementById('select-from');
            if (selectFrom) {
                selectFrom.value = '';
                const event = new Event('change');
                selectFrom.dispatchEvent(event);
            }

            // Показываем сообщение об успехе
            const successMsg = (translations[currentLang]['backup-import-success'] || 'База успешно восстановлена!')
                .replace('{flights}', userFlights.length)
                .replace('{predictions}', predictionsHistory.length);
            
            showAviationAlert(successMsg, false);

        } catch (err) {
            console.error("Ошибка импорта базы данных:", err);
            const errMsg = translations[currentLang]['backup-import-error'] || 'Ошибка чтения файла резервной копии.';
            showAviationAlert(errMsg, true);
        }
        
        // Очищаем значение input, чтобы можно было загрузить тот же файл повторно
        document.getElementById('backup-file-input').value = '';
    };

    reader.readAsText(file);
}

function handleClearDb(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    console.log("handleClearDb called, currentLang:", currentLang);
    const msg = (translations[currentLang] && translations[currentLang]['confirm-clear-db']) 
        || (currentLang === 'en' ? "Are you sure you want to clear the entire flights database?" : "Вы уверены, что хотите очистить всю базу данных рейсов?");
    
    showAviationConfirm(msg, async () => {
        userFlights = [];
        try {
            localStorage.setItem('averago_user_flights_local', JSON.stringify([]));
        } catch (e) {
            console.error("Ошибка очистки LocalStorage:", e);
        }

        if (!isOfflineMode) {
            try {
                await fetch('api.php?action=clear_db');
            } catch (err) {
                console.warn("Серверная очистка недоступна, очищено локально:", err);
            }
        }

        updateActiveDateRangeAndCounts();
        renderFlightsTable();
        renderUploadedFilesList();
        populateAirportDropdowns();
        populateAllFlightsDropdown();

        showAviationAlert(translations[currentLang]['success-db-cleared'] || "База данных рейсов успешно очищена", false);

        const selectFrom = document.getElementById('select-from');
        if (selectFrom) {
            selectFrom.value = '';
            const event = new Event('change');
            selectFrom.dispatchEvent(event);
        }
    });
}

function handleClearPredictions(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    console.log("handleClearPredictions called, currentLang:", currentLang);
    const msg = (translations[currentLang] && translations[currentLang]['confirm-clear-predictions']) 
        || (currentLang === 'en' ? "Are you sure you want to clear the entire predictions history?" : "Вы уверены, что хотите очистить всю историю прогнозов?");
    
    showAviationConfirm(msg, () => {
        predictionsHistory = [];
        savePredictionsHistory();
        renderPredictionsTable();
    });
}

async function deleteFlight(id) {
    if (isOfflineMode) {
        try {
            userFlights = userFlights.filter(f => f.id !== id);
            localStorage.setItem('averago_user_flights_local', JSON.stringify(userFlights));
            updateActiveDateRangeAndCounts();
            renderFlightsTable();
            renderUploadedFilesList();
        } catch (err) {
            console.error("Ошибка при локальном удалении рейса:", err);
            showAviationAlert("Ошибка при удалении локального рейса", true);
        }
    } else {
        try {
            const response = await fetch(`api.php?action=delete_flight&id=${encodeURIComponent(id)}`);
            const data = await response.json();
            if (data.success) {
                userFlights = userFlights.filter(f => f.id !== id);
                updateActiveDateRangeAndCounts();
                renderFlightsTable();
                renderUploadedFilesList();
            } else {
                showAviationAlert("Ошибка при удалении рейса: " + data.error, true);
            }
        } catch (err) {
            console.error("Ошибка при удалении рейса:", err);
            showAviationAlert("Ошибка сети при удалении рейса", true);
        }
    }

    const selectFrom = document.getElementById('select-from');
    if (selectFrom) {
        const event = new Event('change');
        selectFrom.dispatchEvent(event);
    }
}

function deletePrediction(id) {
    predictionsHistory = predictionsHistory.filter(p => p.id !== id);
    savePredictionsHistory();
    renderPredictionsTable();
}

// Экспортируем в глобальную область для инлайновых обработчиков
window.handleClearDb = handleClearDb;
window.handleClearPredictions = handleClearPredictions;
window.deleteFlight = deleteFlight;
window.deletePrediction = deletePrediction;

// --- ОТРИСОВКА ТАБЛИЦЫ РЕЙСОВ (База данных - только за последние 10 дней) ---
function renderFlightsTable() {
    const tbody = document.getElementById('flights-table-body');
    tbody.innerHTML = '';

    if (userFlights.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="10" class="empty-table-text">${translations[currentLang]['empty-table']}</td>`;
        tbody.appendChild(tr);
        return;
    }

    // Находим максимальную дату среди рейсов в базе
    let maxDateMs = 0;
    userFlights.forEach(flight => {
        const time = Date.parse(flight.date);
        if (!isNaN(time) && time > maxDateMs) {
            maxDateMs = time;
        }
    });

    const showAll = document.getElementById('chk-show-all-flights')?.checked || false;
    // Динамически обновляем заголовок таблицы
    const titleEl = document.querySelector('[data-translate="flights-table-title"]');
    if (titleEl) {
        const key = showAll ? 'flights-table-title-all' : 'flights-table-title';
        titleEl.textContent = translations[currentLang][key] || (showAll ? 'Flights Database (all)' : 'Flights Database (last 10 days)');
    }

    let visibleFlights;
    if (showAll) {
        visibleFlights = userFlights;
    } else {
        // Фильтр за последние 10 дней
        const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
        const minDateMsVisible = maxDateMs - tenDaysMs;

        visibleFlights = userFlights.filter(f => {
            const time = Date.parse(f.date);
            return isNaN(time) || time >= minDateMsVisible;
        });
    }

    if (visibleFlights.length === 0) {
        const tr = document.createElement('tr');
        const emptyMsg = showAll 
            ? (currentLang === 'ru' ? 'База данных пуста.' : 'Database is empty.')
            : (currentLang === 'ru' ? 'Нет рейсов за последние 10 дней.' : 'No flights within the last 10 days.');
        tr.innerHTML = `<td colspan="10" class="empty-table-text">${emptyMsg}</td>`;
        tbody.appendChild(tr);
        return;
    }

    const sorted = [...visibleFlights].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

    sorted.forEach(f => {
        const tr = document.createElement('tr');
        if (!f.active) {
            tr.classList.add('inactive-row');
        }

        const dateStr = formatDateStr(f.date);
        const adult = f.men + f.women;
        const paxStr = `${f.pax} (${adult} / ${f.rb} / ${f.rm})`;
        const statusText = f.active ? translations[currentLang]['status-active'] : translations[currentLang]['status-inactive'];
        const statusClass = f.active ? 'active' : 'inactive';

        tr.innerHTML = `
            <td><strong>${formatAirline(f.airline)}</strong></td>
            <td>${f.flight_no}</td>
            <td>${dateStr}</td>
            <td><strong>${ruToIata(f.from)} ➔ ${ruToIata(f.to)}</strong></td>
            <td>${paxStr}</td>
            <td>${f.bag_pcs}</td>
            <td>${Math.round(f.bag_weight)} кг</td>
            <td>${Math.round(f.hb_weight)} кг</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <button class="btn-delete-row" title="Удалить" onclick="deleteFlight('${f.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- ОТРИСОВКА ТАБЛИЦЫ ПРОГНОЗОВ (История прогнозирования) ---
function renderPredictionsTable() {
    const tbody = document.getElementById('predictions-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (predictionsHistory.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="8" class="empty-table-text">${translations[currentLang]['empty-predictions-table']}</td>`;
        tbody.appendChild(tr);
        return;
    }

    predictionsHistory.forEach(p => {
        const tr = document.createElement('tr');
        tr.className = 'history-row-clickable';
        tr.setAttribute('data-pred-id', p.id);
        tr.title = currentLang === 'ru' ? 'Нажмите для переноса в Средний вес багажа и данные загрузки' : 'Click to transfer to Load Planning';

        tr.addEventListener('click', (e) => {
            if (e.target.closest('.btn-delete-row')) return;
            transferPredictionToPreliminary(p.id);
        });
        
        // Форматирование суффикса даты рейса /ДД.ММ
        let flightDayMonthStr = '';
        const flightDateSrc = p.flight_date || p.calc_date;
        if (flightDateSrc) {
            try {
                const parts = String(flightDateSrc).split('T')[0].split('-');
                if (parts.length === 3) {
                    flightDayMonthStr = `/${parts[2]}.${parts[1]}`;
                }
            } catch (e) {
                console.error("Ошибка парсинга даты вылета:", e);
            }
        }

        // Форматирование даты и времени расчета
        let formattedCalcDate = '';
        try {
            const d = new Date(p.calc_date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            formattedCalcDate = `${day}.${month} ${hours}:${minutes}`;
        } catch (e) {
            formattedCalcDate = p.calc_date;
        }

        tr.innerHTML = `
            <td><strong>${ruToIata(p.from)} ➔ ${ruToIata(p.to)}</strong></td>
            <td><strong>${p.flight_no}</strong><span class="flight-day-tag">${flightDayMonthStr}</span></td>
            <td>${p.pax}</td>
            <td>${p.bag_pcs}</td>
            <td>${p.bag_weight} кг</td>
            <td>${p.hb_weight} кг</td>
            <td>${formattedCalcDate}</td>
            <td>
                <button class="btn-delete-row" title="Удалить" onclick="deletePrediction('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Вспомогательная функция обновления верхней инфо-плашки активного рейса в таблице загрузки
function updateActiveFlightBadge(from, to, flightNo, flightDate) {
    const badgeEl = document.getElementById('active-flight-badge');
    const badgeRoute = document.getElementById('badge-route');
    const badgeFlightNo = document.getElementById('badge-flight-no');
    const badgeFlightDate = document.getElementById('badge-flight-date');

    if (!badgeEl || !from || !to) return;

    const fromIata = ruToIata(from) || from;
    const toIata = ruToIata(to) || to;

    let dateTag = '';
    if (flightDate) {
        try {
            const parts = String(flightDate).split('T')[0].split('-');
            if (parts.length === 3) {
                dateTag = `/${parts[2]}.${parts[1]}`;
            }
        } catch (e) {}
    }

    if (badgeRoute) badgeRoute.textContent = `${fromIata} ➔ ${toIata}`;
    if (badgeFlightNo) badgeFlightNo.textContent = flightNo || '';
    if (badgeFlightDate) badgeFlightDate.textContent = dateTag;

    badgeEl.classList.remove('hidden');
}

// Вспомогательная функция выделения строки в таблице истории
function highlightPredictionRow(predId) {
    const tbody = document.getElementById('predictions-table-body');
    if (!tbody) return;

    Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
        tr.classList.remove('selected-history-row');
    });

    const targetTr = tbody.querySelector(`tr[data-pred-id="${predId}"]`);
    if (targetTr) {
        targetTr.classList.add('selected-history-row');
    }
}

// --- ПАРСИНГ EXCEL ФАЙЛОВ СИСТЕМЫ РЕГИСТРАЦИИ ---

function setupDragAndDrop() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    ['dragleave', 'dragend'].forEach(type => {
        dropZone.addEventListener(type, () => {
            dropZone.classList.remove('dragover');
        });
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleUploadedFiles(files);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleUploadedFiles(fileInput.files);
        }
    });
}

function handleUploadedFiles(files) {
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const rawResult = e.target.result;
            let workbook = null;

            // 1. Попытка 1: Чтение через ArrayBuffer (стандартные xls/xlsx)
            try {
                const arr = new Uint8Array(rawResult);
                workbook = XLSX.read(arr, { type: 'array', cellDates: false });
            } catch (err1) {
                console.warn("ArrayBuffer read failed, trying UTF-8 text string...", err1);
            }

            // 2. Попытка 2: Чтение как ТЕКСТ UTF-8 (HTML / XML / SpreadsheetML 2003 / CSV с расширением .xls)
            if (!workbook) {
                try {
                    const textDecoder = new TextDecoder('utf-8');
                    const textStr = textDecoder.decode(rawResult);
                    workbook = XLSX.read(textStr, { type: 'string', cellDates: false });
                } catch (err2) {
                    console.warn("UTF-8 text string read failed, trying windows-1251...", err2);
                    try {
                        const textDecoder1251 = new TextDecoder('windows-1251');
                        const textStr1251 = textDecoder1251.decode(rawResult);
                        workbook = XLSX.read(textStr1251, { type: 'string', cellDates: false });
                    } catch (err3) {
                        console.error("All read attempts failed for file:", file.name, err3);
                    }
                }
            }

            if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
                showAviationAlert(translations[currentLang]['file-process-error'].replace('{name}', file.name), true);
                return;
            }

            try {
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
                
                processRegistrationData(file.name, rows);
            } catch (processErr) {
                console.error("Ошибка обработки таблицы:", processErr);
                showAviationAlert(translations[currentLang]['file-process-error'].replace('{name}', file.name), true);
            }
        };

        reader.readAsArrayBuffer(file);
    });
}

function processRegistrationData(filename, rows, options = {}) {
    const isSilent = !!options.isSilent;
    const isSystem = !!options.isSystem;

    if (!rows || rows.length === 0) {
        if (!isSilent) {
            showAviationAlert(translations[currentLang]['file-process-error'].replace('{name}', filename), true);
        }
        return;
    }

    let headerRowIdx = -1;

    // 1. Поиск строки заголовков по ключевым словам (рейс + направление/пассажиры)
    for (let i = 0; i < Math.min(rows.length, 25); i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;
        
        const cleanCells = Array.from(row).map(cell => cell !== null && cell !== undefined ? String(cell).trim().toLowerCase() : '');
        
        const hasFlight = cleanCells.some(c => c && (c.includes('рейс') || c.includes('flt') || c.includes('flight') || c.includes('№')));
        const hasDirection = cleanCells.some(c => c && (c.includes('направление') || c.includes('direction') || c.includes('прилет') || c.includes('куда') || c.includes('destination') || c.includes('маршрут') || c.includes('to')));
        const hasPax = cleanCells.some(c => c && (c.includes('пасс') || c.includes('pax') || c.includes('кол-во') || c.includes('passengers') || c.includes('всего') || c.includes('вз')));
        
        if (hasFlight && (hasDirection || hasPax)) {
            headerRowIdx = i;
            break;
        }
    }

    // 2. Если не найдено, проверяем первую непустую строку
    if (headerRowIdx === -1) {
        for (let i = 0; i < Math.min(rows.length, 5); i++) {
            if (rows[i] && rows[i].length > 3) {
                headerRowIdx = i;
                break;
            }
        }
    }

    if (headerRowIdx === -1) headerRowIdx = 0;

    const rawHeaders = Array.from(rows[headerRowIdx] || []);
    const headers = rawHeaders.map(h => (h !== null && h !== undefined) ? String(h).trim().toLowerCase() : '');
    
    // Каноничный сопоставитель по названию или спецификации колонок (A=0, B=1, C=2, D=3, E=4, P=15, Q=16, S=18, T=19, U=20, V=21)
    const colMap = {
        airline: headers.findIndex(h => h && (h.includes('код а/к') || h.includes('а/к') || h.includes('airline') || h === 'ак')),
        airportFrom: headers.findIndex(h => h && (h.includes('код а/п') || h.includes('вылет') || h.includes('from') || h.includes('аэропорт вылета') || h.includes('откуда'))),
        flightNo: headers.findIndex(h => h && (h.includes('рейс') || h.includes('flt') || h.includes('flight') || h.includes('номер рейса') || h.includes('№'))),
        date: headers.findIndex(h => h && (h.includes('дата') || h.includes('date'))),
        direction: headers.findIndex(h => h && (h.includes('направление') || h.includes('прилет') || h.includes('to') || h.includes('dest') || h.includes('куда') || h.includes('маршрут'))),
        pax: headers.findIndex(h => h && (h.includes('пасс') || h.includes('pax') || h.includes('кол-во') || h.includes('passenger') || h.includes('всего'))),
        men: headers.findIndex(h => h && (h === 'м' || h.includes('муж') || h.includes('men') || h === 'm')),
        women: headers.findIndex(h => h && (h === 'ж' || h.includes('жен') || h.includes('women') || h === 'w' || h === 'f')),
        rb: headers.findIndex(h => h && (h === 'рб' || h.includes('chd') || h.includes('дети') || h.includes('ребенок'))),
        rm: headers.findIndex(h => h && (h === 'рм' || h.includes('inf') || h.includes('млад') || h.includes('младен'))),
        vz: headers.findIndex(h => h && (h === 'вз' || h.includes('adl') || h.includes('взрос'))),
        hbWeight: headers.findIndex(h => h && (h.includes('р/кладь') || h.includes('ручная') || h.includes('hb') || h.includes('cabin'))),
        bagPcs: headers.findIndex(h => h && (h.includes('бг мест') || h.includes('багаж мест') || h.includes('bag pcs') || h.includes('мест'))),
        bagWeight: headers.findIndex(h => h && (h === 'бг вес' || h.includes('бг вес') || h.includes('багаж вес') || h.includes('bag weight') || h.includes('вес бг') || h.includes('вес багаж')))
    };

    // Строгие стандартизированные столбцы отчета регистрации: A=0, B=1, C=2, D=3, E=4, P=15, Q=16, S=18, T=19, U=20, V=21
    if (colMap.airline === -1) colMap.airline = 0;      // Столбец A (Код авиакомпании)
    if (colMap.airportFrom === -1) colMap.airportFrom = 1; // Столбец B (Аэропорт вылета)
    if (colMap.flightNo === -1) colMap.flightNo = 2;    // Столбец C (Номер рейса)
    if (colMap.date === -1) colMap.date = 3;            // Столбец D (Дата рейса)
    if (colMap.direction === -1) colMap.direction = 4;   // Столбец E (Аэропорт прилёта)
    if (colMap.vz === -1) colMap.vz = 15;                // Столбец P (Взрослые)
    if (colMap.rb === -1) colMap.rb = 16;                // Столбец Q (РБ)
    if (colMap.rm === -1) colMap.rm = 18;                // Столбец S (РМ)
    if (colMap.hbWeight === -1) colMap.hbWeight = 19;    // Столбец T (Р/кладь вес)
    if (colMap.bagPcs === -1) colMap.bagPcs = 20;        // Столбец U (Багаж мест)
    if (colMap.bagWeight === -1) colMap.bagWeight = 21;    // Столбец V (Багаж вес)

    let addedCount = 0;
    const departuresFilter = (baggageDb && baggageDb.departures_filter) ? baggageDb.departures_filter : [];

    for (let i = headerRowIdx + 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        const getVal = (idx) => (idx !== -1 && row[idx] !== undefined && row[idx] !== null) ? String(row[idx]).trim() : '';

        let rawAirline = getVal(colMap.airline);
        let rawFrom = getVal(colMap.airportFrom);
        let rawFltNo = getVal(colMap.flightNo);
        let rawDate = getVal(colMap.date);
        let rawDirectionFull = getVal(colMap.direction);

        // Строка является данными рейса, если в номере рейса или дате присутствуют цифры (отсеиваем шапки повторных страниц)
        const hasFltDigits = /\d+/.test(rawFltNo);
        const hasDateDigits = /\d+/.test(rawDate);
        if (!hasFltDigits && !hasDateDigits) continue;

        let cleanFrom = parseCleanAirportCode(rawFrom);
        let last3 = rawDirectionFull.length >= 3 ? rawDirectionFull.slice(-3).trim() : rawDirectionFull.trim();
        let cleanDirection = parseCleanAirportCode(last3) || parseCleanAirportCode(rawDirectionFull) || last3;

        if (!cleanFrom) cleanFrom = 'AER';
        if (!cleanDirection) cleanDirection = 'AYT';

        const fromIata = ruToIata(cleanFrom) || cleanFrom;
        const toIata = ruToIata(cleanDirection) || cleanDirection;
        const fromRu = iataToRu(fromIata);
        
        // Строгий фильтр: загружаются ИСКЛЮЧИТЕЛЬНО рейсы из списка разрешенных аэропортов вылета
        const allowedDeparturesSet = new Set([
            'AER', 'СОЧ', 'CCC', 'DYU', 'ДШБ', 'GOX', 'HOG', 'HRG',
            'KQT', 'КГТ', 'LBD', 'ХДТ', 'OSS', 'ОШШ', 'PMV', 'REN', 'ОНГ',
            'SSH', 'SUI', 'СУИ', 'TAS', 'ТАС', 'UTP', 'VRA'
        ]);

        const isAllowedDep = allowedDeparturesSet.has(fromIata) || allowedDeparturesSet.has(cleanFrom) || allowedDeparturesSet.has(rawFrom) || (fromRu && allowedDeparturesSet.has(fromRu));
        if (!isAllowedDep) {
            // Рейс из неразрешенного аэропорта вылета пропускается
            continue;
        }

        // Пассажиры: ВЗ (Столбец P / 15), РБ (Столбец Q / 16), РМ (Столбец S / 18)
        let vz = parseInt(getVal(colMap.vz), 10) || 0;
        let rb = parseInt(getVal(colMap.rb), 10) || 0;
        let rm = parseInt(getVal(colMap.rm), 10) || 0;

        let totalPax = vz + rb;
        if (totalPax === 0) {
            const rawPaxCol = parseInt(getVal(colMap.pax), 10) || 0;
            if (rawPaxCol > 0) {
                totalPax = Math.max(0, rawPaxCol - rm);
            }
        }
        if (totalPax <= 0) totalPax = 1;

        // Р/кладь (Столбец T / 19), Багаж мест (Столбец U / 20), Багаж вес (Столбец V / 21)
        const hbWeight = parseFloat(getVal(colMap.hbWeight).replace(',', '.')) || 0;
        const bagPcs = parseInt(getVal(colMap.bagPcs), 10) || 0;
        const bagWeight = parseFloat(getVal(colMap.bagWeight).replace(',', '.')) || 0;

        const formattedDate = formatExcelDate(rawDate);

        const newFlight = {
            id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            airline: formatAirline(rawAirline),
            flight_no: getNumericFlightNo(rawFltNo) || rawFltNo,
            date: formattedDate,
            from: fromIata,
            to: toIata,
            men: vz,
            women: 0,
            rb: rb,
            rm: rm,
            pax: totalPax,
            bag_pcs: bagPcs,
            bag_weight: bagWeight,
            hb_weight: hbWeight,
            source: filename,
            isSystem: isSystem,
            active: true
        };

        upsertFlight(newFlight);
        addedCount++;
    }

    saveUserFlights();
    populateAirportDropdowns();
    updateActiveDateRangeAndCounts();
    renderFlightsTable();
    renderUploadedFilesList();
    populateAllFlightsDropdown();

    if (!isSilent) {
        const msg = (translations[currentLang]['file-processed-success'] || 'Файл "{name}" успешно обработан. Загружено {count} рейсов.').replace('{name}', filename).replace('{count}', addedCount);
        showAviationAlert(msg, false);
    }
}

function renderFileItem(name, count) {
    const list = document.getElementById('uploaded-files-list');
    
    const existing = document.getElementById(`file-item-${name.replace(/[^a-zA-Z0-9]/g, '_')}`);
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.id = `file-item-${name.replace(/[^a-zA-Z0-9]/g, '_')}`;
    div.className = 'file-item';
    
    const textLabel = currentLang === 'ru' ? 'рейсов' : 'flights';
    
    div.innerHTML = `
        <div class="file-info">
            <span class="file-icon">📄</span>
            <span class="file-name" title="${name}">${name.length > 25 ? name.substring(0, 22) + '...' : name}</span>
            <span class="file-flights-count">(${count} ${textLabel})</span>
        </div>
        <button class="btn-remove-file" onclick="removeUploadedFile('${name}')">✕</button>
    `;
    list.appendChild(div);
}

function renderUploadedFilesList() {
    const list = document.getElementById('uploaded-files-list');
    if (!list) return;
    list.innerHTML = '';

    const counts = {};
    if (userFlights && userFlights.length > 0) {
        userFlights.forEach(f => {
            if (f.source && f.source !== 'manual') {
                counts[f.source] = (counts[f.source] || 0) + 1;
            }
        });
    }

    Object.keys(counts).forEach(filename => {
        renderFileItem(filename, counts[filename]);
    });
}

function removeUploadedFile(filename) {
    userFlights = userFlights.filter(f => f.source !== filename);
    saveUserFlights();

    const item = document.getElementById(`file-item-${filename.replace(/[^a-zA-Z0-9]/g, '_')}`);
    if (item) item.remove();

    const selectFrom = document.getElementById('select-from');
    const event = new Event('change');
    selectFrom.dispatchEvent(event);
}

function parseExcelDate(val) {
    if (!val) return null;
    
    // Если это объект Date (от SheetJS или JS)
    if (val instanceof Date && !isNaN(val.getTime())) {
        const yyyy = val.getFullYear();
        const mm = String(val.getMonth() + 1).padStart(2, '0');
        const dd = String(val.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    const valStr = String(val).trim();
    if (!valStr) return null;

    // Строковый формат DD.MM.YYYY или DD.MM.YY (например 22.07.2026 или 22.07.26)
    const match = valStr.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
    if (match) {
        let d = parseInt(match[1], 10);
        let m = parseInt(match[2], 10);
        let y = parseInt(match[3], 10);
        if (y < 100) {
            y += (y < 50 ? 2000 : 1900);
        }
        const yyyy = String(y).padStart(4, '0');
        const mm = String(m).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    // ИСО формат YYYY-MM-DD
    const isoMatch = valStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
        return isoMatch[0];
    }

    return null;
}

function formatDateStr(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateStr;
}

// Валидация числовых полей ввода и автоочистка ведущих нулей
function setupNumericInputValidation() {
    // Инпуты количества пассажиров и целых чисел
    const paxInputs = [
        'input-pax',
        'lir-pax',
        'lir-pcs',
        'lir-weight',
        'manual-men',
        'manual-women',
        'manual-rb',
        'manual-rm',
        'manual-bag-pcs'
    ];
    for (let i = 1; i <= 12; i++) {
        paxInputs.push(`bulk-pcs-${i}`);
        paxInputs.push(`bulk-weight-${i}`);
    }

    paxInputs.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.dataset.prevValue = el.value || (id === 'input-pax' ? '150' : '0');
        el.dataset.readyToOverwrite = 'false';

        // 1. При фокусе (клик или TAB) число НЕ пропадает, но подсвечивается и помечается к перезаписи
        el.addEventListener('focus', (e) => {
            if (e.target.value !== '') {
                e.target.dataset.prevValue = e.target.value;
            }
            e.target.dataset.readyToOverwrite = 'true';
            setTimeout(() => {
                if (typeof e.target.select === 'function') {
                    e.target.select();
                }
            }, 0);
        });

        // 2. Повторный клик внутри уже активного поля помечает текст к авто-перезаписи при вводе
        el.addEventListener('click', (e) => {
            e.target.dataset.readyToOverwrite = 'true';
            if (typeof e.target.select === 'function') {
                e.target.select();
            }
        });

        // 3. Перехвачик нажатия клавиш: стирает старое значение при первом вводе цифры
        el.addEventListener('keydown', (e) => {
            if (e.target.dataset.readyToOverwrite === 'true') {
                const isNavigationKey = ['Tab', 'Enter', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key);
                if (!isNavigationKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
                    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
                        e.target.value = '';
                        e.target.dataset.readyToOverwrite = 'false';
                        if (id === 'lir-pax') {
                            recalculateLoadPlanning();
                        }
                    }
                }
            }
        });

        // 4. Фильтрация ввода (только цифры, авто-удаление ведущих нулей)
        el.addEventListener('input', (e) => {
            e.target.dataset.readyToOverwrite = 'false';
            let val = e.target.value;
            let clean = val.replace(/[^0-9]/g, '');
            if (clean.length > 1 && clean.startsWith('0')) {
                clean = clean.replace(/^0+/, '');
            }
            e.target.value = clean;
            if (id === 'lir-pax') {
                recalculateLoadPlanning();
            }
        });

        // 5. Восстановление сохраненного значения при уходе (blur), если поле осталось пустым
        el.addEventListener('blur', (e) => {
            e.target.dataset.readyToOverwrite = 'false';
            let val = e.target.value.trim();
            if (val === '') {
                e.target.value = e.target.dataset.prevValue || (id === 'input-pax' ? '150' : '0');
            } else if (id === 'input-pax' && parseInt(val, 10) === 0) {
                e.target.value = '1';
            }
            if (id === 'lir-pax') {
                recalculateLoadPlanning();
            }
        });
    });

    // Инпуты дробных чисел (вес)
    const floatInputs = [
        'manual-bag-weight',
        'manual-hb-weight'
    ];

    floatInputs.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.addEventListener('input', (e) => {
            let val = e.target.value;
            
            // Разрешаем только цифры и одну точку
            let clean = val.replace(/[^0-9.]/g, '');
            const parts = clean.split('.');
            if (parts.length > 2) {
                clean = parts[0] + '.' + parts.slice(1).join('');
            }
            
            // Убираем ведущие нули (напр. 020 -> 20, но 0.5 остается 0.5)
            if (clean.length > 1 && clean.startsWith('0') && clean[1] !== '.') {
                clean = clean.replace(/^0+/, '');
            }
            
            e.target.value = clean;
        });

        el.addEventListener('blur', (e) => {
            let val = e.target.value.trim();
            if (val === '' || val === '.') {
                e.target.value = '0';
            }
        });
    });

    // Обнуляем количество мест и веса в BULK (отсеки 1..12)
    for (let i = 1; i <= 12; i++) {
        const pcsInput = document.getElementById(`bulk-pcs-${i}`);
        if (pcsInput) pcsInput.value = '0';
        
        const wInput = document.getElementById(`bulk-weight-${i}`);
        if (wInput) {
            wInput.removeAttribute('data-locked');
            wInput.classList.remove('weight-locked');
            wInput.value = '0';
        }
    }

    recalculateLoadPlanning();
}

// Перенос выбранного расчета из Истории расчетов прогнозов в табличный блок PRELIMINARY и LIR / ФИНАЛЬНЫЙ
function transferPredictionToPreliminary(predId) {
    const p = predictionsHistory.find(item => item.id === predId);
    if (!p) return;

    // Сохраняем раскладку BULK текущего активного рейса из Истории перед переключением
    saveCompartmentsToPrediction();

    // Устанавливаем новый активный рейс из Истории
    currentActivePredictionId = predId;

    const paxVal = parseInt(p.pax, 10) || 0;
    const pcsVal = parseInt(p.bag_pcs, 10) || 0;
    const weightVal = parseFloat(p.bag_weight) || 0;

    const prelimPax = document.getElementById('prelim-pax');
    const prelimPcs = document.getElementById('prelim-pcs');
    const prelimWeight = document.getElementById('prelim-weight');

    if (prelimPax) prelimPax.textContent = paxVal;
    if (prelimPcs) prelimPcs.textContent = pcsVal;
    if (prelimWeight) prelimWeight.textContent = weightVal;

    // Дублируем спрогнозированные параметры в инпуты LIR OR FINAL
    const lirPax = document.getElementById('lir-pax');
    const lirPcs = document.getElementById('lir-pcs');
    const lirWeight = document.getElementById('lir-weight');

    if (lirPax) lirPax.value = paxVal;
    if (lirPcs) lirPcs.value = pcsVal;
    if (lirWeight) lirWeight.value = weightVal;

    // Восстанавливаем раскладку BULK из сохранённых данных рейса (или обнуляем если пустые)
    restoreCompartmentsFromPrediction(p);

    // Синхронизируем верхнюю форму прогнозирования
    const selectFlight = document.getElementById('select-flight');
    const selectFrom = document.getElementById('select-from');
    const selectTo = document.getElementById('select-to');
    const inputPax = document.getElementById('input-pax');

    if (selectFlight && p.flight_no) selectFlight.value = p.flight_no;
    if (selectFrom && p.from) selectFrom.value = p.from;
    if (selectTo && p.to) {
        selectTo.disabled = false;
        selectTo.value = p.to;
    }
    if (inputPax && p.pax) inputPax.value = p.pax;

    // Результаты в главной панели результатов
    const resPcs = document.getElementById('res-pcs');
    const resWeight = document.getElementById('res-weight');
    const resHb = document.getElementById('res-hb');

    if (resPcs) resPcs.textContent = p.bag_pcs;
    if (resWeight) resWeight.textContent = p.bag_weight;
    if (resHb) resHb.textContent = p.hb_weight || 0;

    recalculateLoadPlanning();

    // Обновляем верхнюю инфо-плашку акцента выбранного рейса
    updateActiveFlightBadge(p.from, p.to, p.flight_no, p.flight_date || p.calc_date);
    highlightPredictionRow(predId);

    // Плавный скролл к блоку "Средний вес багажа и данные загрузки"
    const targetEl = document.querySelector('.load-planning-panel') || document.getElementById('prelim-pax');
    if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
