// Версия сборки приложения (SemVer)
const APP_VERSION = 'v12.0.85';
const APP_BUILD_DATE = '18.08.2026';

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
        'tab-dashboard': 'Дашборд аналитики',
        'tab-admin': 'Администрирование',
        'dashboard-title': '[ ДАШБОРД АНАЛИТИКИ И МАСШТАБИРОВАНИЯ ]',
        'dash-subtext': 'Аналитический обзор коммерческих нормативов багажа за весь период загруженной базы данных',
        'dash-label-route': 'Маршрут / Аэропорт',
        'dash-opt-all-routes': 'Все направления',
        'dash-label-period': 'Период времени',
        'dash-opt-all-period': 'За весь период',
        'dash-opt-30-days': 'За последние 30 дней',
        'dash-opt-60-days': 'За последние 60 дней',
        'dash-opt-90-days': 'За последние 90 дней',
        'dash-opt-current-year': 'За текущий год',
        'dash-opt-custom-range': 'Произвольный интервал...',
        'dash-label-date-from': 'С даты',
        'dash-label-date-to': 'По дату',
        'dashboard-kpi-total-flights': 'Проанализировано рейсов',
        'dashboard-kpi-routes': 'Номеров рейсов',
        'dashboard-kpi-avg-weight': 'Средний вес на 1 пассажира',
        'dashboard-kpi-avg-pcs': 'Среднее мест на 1 пассажира',
        'dashboard-kpi-period-all': 'За весь период базы данных',
        'dash-chart1-title': '[ ВЕС НА 1 PAX ПО МАРШРУТАМ (КГ) ]',
        'dash-chart2-title': '[ МЕСТА НА 1 PAX ПО МАРШРУТАМ (PCS) ]',
        'dash-chart3-title': '[ ДИНАМИКА ПО ДНЯМ НЕДЕЛИ (КГ/PAX) ]',
        'dash-chart4-title': '[ ДОЛИ ВЫЛЕТОВ ПО МАРШРУТАМ (%) ]',
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
        'coef-source-label': 'Источник данных:',
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
        'opt-scope-auto': 'Умный каскад (Авто)',
        'opt-scope-flight': 'Только выбранный рейс',
        'opt-scope-route': 'Всё направление (Маршрут)',
        'label-period-type': 'Период анализа данных (Data Period)',
        'opt-period-auto': 'Умный каскад (180 дн., α=0.3, сезонность)',
        'opt-period-all-history': 'Вся история базы (3 года)',
        'opt-period-custom': 'Произвольный диапазон дат',
        'opt-period-seasonal': 'Сезонный срез (месяц / год)',
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
        
        // Резервное копирование и верификация
        'btn-open-backtest': '🔬 Тест точности (Backtest)',
        'backtest-modal-title': '[ ИСТОРИЧЕСКИЙ БЭКТЕСТИНГ И ВЕРИФИКАЦИЯ ТОЧНОСТИ ]',
        'backtest-label-period': 'Период выборки:',
        'backtest-opt-3m': 'Последние 3 месяца',
        'backtest-opt-6m': 'Последние 6 месяцев (Рекомендуется)',
        'backtest-opt-1y': 'Последний 1 год',
        'backtest-opt-all': 'Вся доступная база рейсов',
        'backtest-label-limit': 'Количество рейсов:',
        'btn-start-backtest': '▶ Запустить тест',
        'backtest-badge-gain': 'ПРИРОСТ ТОЧНОСТИ',
        'backtest-label-gain-weight': 'Прирост точности (вес):',
        'backtest-label-gain-pcs': 'Прирост точности (места):',
        'backtest-sample-table-title': 'Примеры прогнозов по реальным вылетам:',
        'btn-export-db': 'Экспорт базы (Backup)',
        'btn-import-db': 'Импорт базы (Restore)',
        'backup-import-success': 'База данных успешно восстановлена! Загружено {flights} рейсов и {predictions} прогнозов.',
        'backup-import-error': 'Ошибка чтения файла резервной копии. Убедитесь, что формат файла верен.',
        'footer-build-label': 'Сборка',
        'btn-manual': 'Руководство'
    },
    en: {
        'app-title': 'AeroBag Predictor: Baggage Weight Calculator',
        'logo-sub': 'FLIGHT OPS CONTROL',
        'status-dispatch': 'DISPATCH ONLINE',
        'status-local': 'LOCAL MODE (OFFLINE)',
        'tab-predict': 'Forecasting',
        'tab-dashboard': 'Analytics Dashboard',
        'tab-admin': 'Administration',
        'dashboard-title': '[ ANALYTICS & SCALING DASHBOARD ]',
        'dash-subtext': 'Analytical overview of baggage commercial norms across the loaded database',
        'dash-label-route': 'Route / Airport',
        'dash-opt-all-routes': 'All Routes',
        'dash-label-period': 'Time Period',
        'dash-opt-all-period': 'All Time',
        'dash-opt-30-days': 'Last 30 Days',
        'dash-opt-60-days': 'Last 60 Days',
        'dash-opt-90-days': 'Last 90 Days',
        'dash-opt-current-year': 'Current Year',
        'dash-opt-custom-range': 'Custom Date Range...',
        'dash-label-date-from': 'From Date',
        'dash-label-date-to': 'To Date',
        'dashboard-kpi-total-flights': 'Flights Analyzed',
        'dashboard-kpi-routes': 'Flight Numbers',
        'dashboard-kpi-avg-weight': 'Avg Weight / PAX',
        'dashboard-kpi-avg-pcs': 'Avg Pieces / PAX',
        'dashboard-kpi-period-all': 'For entire database period',
        'dash-chart1-title': '[ WEIGHT PER PAX BY ROUTE (KG) ]',
        'dash-chart2-title': '[ PIECES PER PAX BY ROUTE (PCS) ]',
        'dash-chart3-title': '[ WEEKDAY DYNAMICS (KG/PAX) ]',
        'dash-chart4-title': '[ FLIGHT SHARES BY ROUTE (%) ]',
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
        'opt-scope-auto': 'Smart Waterfall (Auto Cascade)',
        'opt-scope-flight': 'Strict Flight Match',
        'opt-scope-route': 'Entire Route',
        'label-period-type': 'Analysis Period (Data Period)',
        'opt-period-auto': 'Smart Waterfall (180 days, α=0.3, season)',
        'opt-period-all-history': 'All Database History (3 Years)',
        'opt-period-custom': 'Custom Date Range',
        'opt-period-seasonal': 'Seasonal Slice (Month / Year)',
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
        
        // Backups and verification
        'btn-open-backtest': '🔬 Accuracy Test (Backtest)',
        'backtest-modal-title': '[ FORECAST ACCURACY VERIFICATION & BACKTESTING ]',
        'backtest-label-period': 'Sample Period:',
        'backtest-opt-3m': 'Last 3 Months',
        'backtest-opt-6m': 'Last 6 Months (Recommended)',
        'backtest-opt-1y': 'Last 1 Year',
        'backtest-opt-all': 'All Available Database Flights',
        'backtest-label-limit': 'Number of Flights:',
        'btn-start-backtest': '▶ Run Test',
        'backtest-badge-gain': 'ACCURACY GAIN',
        'backtest-label-gain-weight': 'Weight Accuracy Gain:',
        'backtest-label-gain-pcs': 'Pieces Accuracy Gain:',
        'backtest-sample-table-title': 'Sample Forecasts for Real Flights:',
        'btn-export-db': 'Export Database (Backup)',
        'btn-import-db': 'Import Database (Restore)',
        'backup-import-success': 'Database successfully restored! Loaded {flights} flights and {predictions} predictions.',
        'backup-import-error': 'Error reading backup file. Make sure file format is correct.',
        'footer-build-label': 'Build',
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

    const lirPaxInput = document.getElementById('lir-pax');
    const lirPcsInput = document.getElementById('lir-pcs');
    const lirWeightInput = document.getElementById('lir-weight');

    if (lirPaxInput && lirPaxInput.value !== '') p.lir_pax = parseInt(lirPaxInput.value, 10) || 0;
    if (lirPcsInput && lirPcsInput.value !== '') p.lir_pcs = parseInt(lirPcsInput.value, 10) || 0;
    if (lirWeightInput && lirWeightInput.value !== '') p.lir_weight = parseFloat(lirWeightInput.value) || 0;

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

    let paxVal = parseInt(paxInput ? paxInput.value : 0) || 0;

    // Проверяем режим явки пассажиров (Факт 100% или Бронь 97%)
    const paxModeRadio = document.querySelector('input[name="pax-mode"]:checked');
    const paxModeFactor = paxModeRadio ? parseFloat(paxModeRadio.value) : 1.0;
    const isBookingMode = paxModeFactor < 0.99;
    if (isBookingMode && paxVal > 0) {
        // Если переключатель на Брони (97%), переносим ожидаемое число пассажиров с учетом неявки
        paxVal = Math.max(1, Math.round(paxVal * paxModeFactor));
    }

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

    const curLirPax = (p.lir_pax !== undefined && p.lir_pax !== null) ? p.lir_pax : paxVal;
    const curLirPcs = (p.lir_pcs !== undefined && p.lir_pcs !== null) ? p.lir_pcs : pcsVal;
    const curLirWeight = (p.lir_weight !== undefined && p.lir_weight !== null) ? p.lir_weight : weightVal;

    if (lirPax) lirPax.value = curLirPax;
    if (lirPcs) lirPcs.value = curLirPcs;
    if (lirWeight) lirWeight.value = curLirWeight;

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

    // 1-й проход: Подсчет зафиксированных весов и мест, а также сбор незафиксированных отсеков
    let lockedWeightSum = 0;
    let lockedPcsSum = 0;
    const unlockedComps = [];

    for (let i = 1; i <= 12; i++) {
        const pcsInput = document.getElementById(`bulk-pcs-${i}`);
        const weightCell = document.getElementById(`bulk-weight-${i}`);

        if (pcsInput) {
            const pcs = parseInt(pcsInput.value, 10) || 0;
            const isLocked = weightCell && weightCell.tagName === 'INPUT' && weightCell.getAttribute('data-locked') === 'true';

            if (isLocked) {
                const w = parseFloat(weightCell.value) || 0;
                lockedWeightSum += w;
                lockedPcsSum += pcs;
            } else {
                if (pcs > 0) {
                    unlockedComps.push({ index: i, pcs: pcs, weightCell: weightCell });
                } else {
                    // Если мест 0 и отсек не зафиксирован - сбрасываем вес в 0
                    if (weightCell) {
                        if (weightCell.tagName === 'INPUT') weightCell.value = '0';
                        else weightCell.textContent = '0';
                    }
                }
            }
        }
    }

    // Расчет удельного веса 1 места на оставшийся свободный вес от общего плана
    const remainingWeight = Math.max(0, targetWeight - lockedWeightSum);
    const remainingPcs = Math.max(1, targetPcs - lockedPcsSum);
    const dynamicAvgBagWeight = targetPcs > 0 ? (remainingWeight / remainingPcs) : 0;

    // Суммарное количество мест, введенных в незафиксированные отсеки
    const totalUnlockedEnteredPcs = unlockedComps.reduce((acc, c) => acc + c.pcs, 0);
    // Проверка: распределены ли абсолютно все места (с учетом возможных зафиксированных)
    const isAllPcsDistributed = (targetPcs > 0) && (totalUnlockedEnteredPcs === (targetPcs - lockedPcsSum));

    // 2-й проход: Распределение веса по незафиксированным отсекам
    let allocatedUnlockedWeight = 0;

    unlockedComps.forEach((comp, idx) => {
        const isLastComp = (idx === unlockedComps.length - 1);
        let w = 0;

        if (isAllPcsDistributed && isLastComp) {
            // Последний отсек, закрывающий все оставшиеся места, забирает точный остаток веса!
            w = Math.max(0, remainingWeight - allocatedUnlockedWeight);
        } else {
            w = Math.round(comp.pcs * dynamicAvgBagWeight);
            allocatedUnlockedWeight += w;
        }

        if (comp.weightCell) {
            if (comp.weightCell.tagName === 'INPUT') {
                comp.weightCell.value = String(w);
            } else {
                comp.weightCell.textContent = String(w);
            }
        }
    });

    // 3-й проход: Подсчет итогов по всей таблице
    let ttlBulkPcs = lockedPcsSum + totalUnlockedEnteredPcs;
    let ttlBulkWeight = lockedWeightSum;

    for (let i = 1; i <= 12; i++) {
        const pcsInput = document.getElementById(`bulk-pcs-${i}`);
        const weightCell = document.getElementById(`bulk-weight-${i}`);
        if (pcsInput && weightCell) {
            const isLocked = weightCell.tagName === 'INPUT' && weightCell.getAttribute('data-locked') === 'true';
            if (!isLocked) {
                const w = parseFloat(weightCell.tagName === 'INPUT' ? weightCell.value : weightCell.textContent) || 0;
                ttlBulkWeight += w;
            }
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
                el.addEventListener(evt, () => {
                    recalculateLoadPlanning();
                    saveCompartmentsToPrediction();
                });
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
    
    const versionTag = document.getElementById('app-version-tag');
    if (versionTag) versionTag.textContent = APP_VERSION;
    const buildDateTag = document.getElementById('app-build-date');
    if (buildDateTag) buildDateTag.textContent = APP_BUILD_DATE;
    
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
    renderDashboardAnalytics();
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
                opt.value = ap.iata;
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


    // Обработчик переключателя режима явки пассажиров (Факт 100% / Бронь 97%) с автоматическим пересчетом
    document.querySelectorAll('input[name="pax-mode"]').forEach(radio => {
        radio.addEventListener('change', () => {
            updatePaxExpectedHint();
            calculateBaggageForecast(false);
        });
    });

    const inputPaxEl = document.getElementById('input-pax');
    if (inputPaxEl) {
        ['input', 'change'].forEach(evt => {
            inputPaxEl.addEventListener(evt, updatePaxExpectedHint);
        });
    }

    // Обработчик кнопки расчета: весь пересчет выполняется строго по нажатию на кнопку
    document.getElementById('btn-calculate').addEventListener('click', () => calculateBaggageForecast(true));
    document.getElementById('form-manual-flight').addEventListener('submit', handleManualFlightSubmit);

    const btnLoadSample = document.getElementById('btn-load-sample');
    if (btnLoadSample) {
        btnLoadSample.addEventListener('click', async () => {
            await loadSystemStats(false);
        });
    }

    updatePaxExpectedHint();
    initBacktestModule();
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
    const tabDashboardBtn = document.getElementById('tab-btn-dashboard');
    const tabAdminBtn = document.getElementById('tab-btn-admin');
    
    const predictContent = document.getElementById('tab-content-predict');
    const dashboardContent = document.getElementById('tab-content-dashboard');
    const adminContent = document.getElementById('tab-content-admin');

    const authModal = document.getElementById('admin-auth-modal');
    const authForm = document.getElementById('admin-auth-form');
    const passwordInput = document.getElementById('admin-password-input');
    const authError = document.getElementById('admin-auth-error');
    const authCancelBtn = document.getElementById('admin-auth-cancel');
    const togglePassBtn = document.getElementById('btn-toggle-show-pass');

    function switchTab(tabKey) {
        if (tabPredictBtn) tabPredictBtn.classList.toggle('active', tabKey === 'predict');
        if (tabDashboardBtn) tabDashboardBtn.classList.toggle('active', tabKey === 'dashboard');
        if (tabAdminBtn) tabAdminBtn.classList.toggle('active', tabKey === 'admin');

        if (predictContent) predictContent.classList.toggle('hidden', tabKey !== 'predict');
        if (dashboardContent) dashboardContent.classList.toggle('hidden', tabKey !== 'dashboard');
        if (adminContent) adminContent.classList.toggle('hidden', tabKey !== 'admin');

        if (tabKey === 'dashboard') {
            renderDashboardAnalytics();
        } else if (tabKey === 'admin') {
            populateAirportDropdowns();
        }
    }

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
        tabPredictBtn.addEventListener('click', () => switchTab('predict'));
    }

    if (tabDashboardBtn) {
        tabDashboardBtn.addEventListener('click', () => switchTab('dashboard'));
    }

    if (tabAdminBtn) {
        tabAdminBtn.addEventListener('click', () => {
            if (isAdminAuthenticated) {
                switchTab('admin');
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

    // Слушатели фильтров Дашборда
    const filterRoute = document.getElementById('dash-filter-route');
    const filterPeriod = document.getElementById('dash-filter-period');
    const customDateContainer = document.getElementById('dash-custom-date-container');
    const dateFrom = document.getElementById('dash-date-from');
    const dateTo = document.getElementById('dash-date-to');

    if (filterRoute) filterRoute.addEventListener('change', renderDashboardAnalytics);
    if (filterPeriod) {
        filterPeriod.addEventListener('change', () => {
            if (filterPeriod.value === 'custom') {
                if (customDateContainer) customDateContainer.classList.remove('hidden');
            } else {
                if (customDateContainer) customDateContainer.classList.add('hidden');
            }
            renderDashboardAnalytics();
        });
    }
    if (dateFrom) dateFrom.addEventListener('change', renderDashboardAnalytics);
    if (dateTo) dateTo.addEventListener('change', renderDashboardAnalytics);

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
                switchTab('admin');
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

// --- ЛОГИКА РАСЧЕТА ПРОГНОЗА БАГАЖА (SMART WATERFALL + АДАПТИВНАЯ ВЫБОРКА) ---

function getRuDayShort(dayIdx) {
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return days[dayIdx] || '';
}

function getEnDayShort(dayIdx) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIdx] || '';
}

function updatePaxExpectedHint() {
    const paxInputEl = document.getElementById('input-pax');
    const paxVal = parseInt(paxInputEl ? paxInputEl.value : 0, 10) || 0;
    const paxModeRadio = document.querySelector('input[name="pax-mode"]:checked');
    const paxModeFactor = paxModeRadio ? parseFloat(paxModeRadio.value) : 1.0;
    const isBookingMode = paxModeFactor < 0.99;
    const effectivePaxVal = isBookingMode ? Math.max(1, Math.round(paxVal * paxModeFactor)) : paxVal;

    const hintEl = document.getElementById('pax-expected-hint');
    if (hintEl) {
        if (isBookingMode && paxVal > 0) {
            const hintText = currentLang === 'ru'
                ? `Ожидается ~${effectivePaxVal} пасс. (с учетом неявки 3%)`
                : `Expected ~${effectivePaxVal} pax (with 3% no-show)`;
            hintEl.textContent = hintText;
            hintEl.classList.remove('hidden');
        } else {
            hintEl.classList.add('hidden');
        }
    }
}

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

    // Проверяем выбранный режим явки пассажиров (Факт 100% или Бронь 97%)
    const paxModeRadio = document.querySelector('input[name="pax-mode"]:checked');
    const paxModeFactor = paxModeRadio ? parseFloat(paxModeRadio.value) : 1.0;
    const isBookingMode = paxModeFactor < 0.99;
    const effectivePaxVal = isBookingMode ? Math.max(1, Math.round(paxVal * paxModeFactor)) : paxVal;

    updatePaxExpectedHint();
    
    const warningBox = document.getElementById('date-warning');
    if (warningBox) warningBox.classList.add('hidden');

    if (!fromVal || !toVal || paxVal <= 0) {
        document.getElementById('res-pcs').textContent = '0';
        document.getElementById('res-weight').textContent = '0';
        document.getElementById('res-hb').textContent = '0';
        document.getElementById('coef-pcs-pax').textContent = '-';
        document.getElementById('coef-weight-pc').textContent = '-';
        document.getElementById('coef-hb-pax').textContent = '-';
        document.getElementById('calc-source-desc').innerHTML = '-';
        return;
    }

    // Считываем параметры расширенного анализа данных
    const scopeVal = document.getElementById('select-analysis-scope')?.value || 'auto';
    const periodTypeVal = document.getElementById('select-period-type')?.value || 'auto';
    const customStartVal = document.getElementById('input-analysis-start-date')?.value || '';
    const customEndVal = document.getElementById('input-analysis-end-date')?.value || '';
    const seasonalMonthVal = document.getElementById('select-seasonal-month')?.value || '0';
    const seasonalYearVal = document.getElementById('select-seasonal-year')?.value || 'all';

    let coefs = null;
    let sourceDescHtml = '';

    // Вызываем интеллектуальный расчет с 4-уровневым каскадом и адаптивным окном
    coefs = getUploadedCoefficients(
        fromVal, toVal, flightVal,
        scopeVal, periodTypeVal,
        customStartVal, customEndVal,
        seasonalMonthVal, seasonalYearVal
    );

    if (coefs) {
        const badgeClass = coefs.levelCode || `level-${coefs.level || 1}`;
        sourceDescHtml = `<span class="waterfall-badge ${badgeClass}">${coefs.levelName || 'Загруженные данные'}</span>`;
    }

    // Если в загруженных нет данных вообще, обращаемся к историческим нормативам базы
    if (!coefs) {
        coefs = getHistoricalCoefficients(fromVal, toVal, flightVal);
        if (coefs) {
            sourceDescHtml = `<span class="waterfall-badge level-4">${translations[currentLang]['source-desc-historical']}</span>`;
        }
    }

    // Крайний дефолтный норматив
    if (!coefs) {
        coefs = {
            pcs_pax: 0.4,
            wght_pc: 13.0,
            hb_pax: 2.0
        };
        sourceDescHtml = `<span class="waterfall-badge level-4">${translations[currentLang]['source-desc-default']}</span>`;
    }

    // --- ВЫЧИСЛЕНИЕ РЕЗУЛЬТАТОВ НА ЭФФЕКТИВНЫХ ПАССАЖИРОВ ---
    const expectedPcs = Math.round(effectivePaxVal * coefs.pcs_pax);
    // Вес багажа и ручной клади округляются до целых
    const expectedWeight = Math.round(expectedPcs * coefs.wght_pc);
    const expectedHb = Math.round(effectivePaxVal * coefs.hb_pax);

    // Вывод результатов с плавной анимацией
    animateNumber('res-pcs', expectedPcs, 0);
    animateNumber('res-weight', expectedWeight, 0);
    animateNumber('res-hb', expectedHb, 0);

    // Вывод коэффициентов
    document.getElementById('coef-pcs-pax').textContent = coefs.pcs_pax.toFixed(4);
    document.getElementById('coef-weight-pc').textContent = coefs.wght_pc.toFixed(2) + ' кг';
    document.getElementById('coef-hb-pax').textContent = coefs.hb_pax.toFixed(2) + ' кг';
    document.getElementById('calc-source-desc').innerHTML = sourceDescHtml;

    // Отрисовываем детализацию отобранных рейсов и расчётных агрегированных значений
    renderSampledFlightsDetails(coefs);

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
            pax: effectivePaxVal,
            raw_pax: paxVal,
            bag_pcs: expectedPcs,
            bag_weight: expectedWeight,
            hb_weight: expectedHb,
            flight_date: targetDateVal || new Date().toISOString().split('T')[0],
            calc_date: new Date().toISOString(),
            pax_mode: isBookingMode ? 'booking_97' : 'fact_100',
            waterfall_level: coefs.level || 1
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
            const levelHeader = coefs.levelName ? `[ ${coefs.levelName} ]` : '';
            const titlePattern = translations[currentLang]['sampled-flights-title'] || 'Отобранные рейсы для расчета ({count} вып.):';
            titleEl.textContent = `${levelHeader} ${titlePattern.replace('{count}', flights.length)}`.trim();
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
            if (coefs.weights && coefs.weights[idx] !== undefined) {
                const wPct = (coefs.weights[idx] * 100).toFixed(1).replace('.0', '');
                weightBadge = `<span class="weight-badge-pill" title="Вес свежести">${wPct}%</span>`;
            }

            htmlBody += `
                <tr>
                    <td><div class="sample-date-cell"><span>${formattedDate}</span>${weightBadge}</div></td>
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

        let seasonalNote = '';
        if (coefs.seasonInfo && coefs.seasonInfo.hasSeasonality) {
            const sign = coefs.seasonInfo.multiplier >= 1.0 ? '+' : '';
            const pct = Math.round((coefs.seasonInfo.multiplier - 1.0) * 100);
            seasonalNote = `<div class="seasonality-pill">🌸 Сезонная поправка (${coefs.seasonInfo.monthName}): x${coefs.seasonInfo.multiplier.toFixed(3)} (${sign}${pct}%)</div><br/>`;
        }

        const formulaTitle = '📐 <strong>Расчет коэффициентов (Экспоненциальное сглаживание &alpha; = 0.3):</strong>';
        const formulaDetails = `${seasonalNote}• <strong>PCS/PAX</strong> = <strong>${coefs.pcs_pax.toFixed(4)}</strong> ${coefs.raw_pcs_pax ? `(базовый ${coefs.raw_pcs_pax.toFixed(4)} × ${coefs.seasonInfo.multiplier.toFixed(3)})` : ''}<br/>
               • <strong>Weight/PC</strong> = <strong>${coefs.wght_pc.toFixed(2)} ${unitKg}</strong><br/>
               • <strong>HB/PAX</strong> = <strong>${coefs.hb_pax.toFixed(2)} ${unitKg}</strong>`;

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
        // Если использовались нормативные правила базы данных без списка выполнений
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

// Поиск коэффициентов по загруженной базе рейсов с использованием 4-уровневой интеллектуальной иерархии (Smart Waterfall)
function getUploadedCoefficients(from, to, flightNo, scope = 'auto', periodType = 'auto', customStart = '', customEnd = '', seasonalMonth = '0', seasonalYear = 'all') {
    if (!userFlights || userFlights.length === 0) return null;

    const fromIata = ruToIata(from) || from;
    const toIata = ruToIata(to) || to;

    const dateInputEl = document.getElementById('input-date');
    const targetDateVal = dateInputEl ? dateInputEl.value : '';
    const targetDateMs = targetDateVal ? Date.parse(targetDateVal) : Date.now();
    const targetDayOfWeek = getDayOfWeekFromIsoStr(targetDateVal || new Date().toISOString().split('T')[0]);

    const routeFlights = userFlights.filter(f => ruToIata(f.from) === fromIata && ruToIata(f.to) === toIata);

    const finalizeResult = (res) => {
        if (!res) return null;
        const seasonInfo = getRouteSeasonalityMultiplier(from, to, targetDateVal);
        if (seasonInfo && seasonInfo.hasSeasonality) {
            res.raw_pcs_pax = res.pcs_pax;
            res.pcs_pax = res.pcs_pax * seasonInfo.multiplier;
            res.seasonalMultiplier = seasonInfo.multiplier;
            res.seasonInfo = seasonInfo;
        }
        return res;
    };

    // 1. Если выбран явный кастомный диапазон дат
    if (periodType === 'custom') {
        const startMs = customStart ? Date.parse(customStart) : 0;
        const endMs = customEnd ? Date.parse(customEnd) : Infinity;
        let targetFlights = (flightNo && scope === 'flight') ? routeFlights.filter(f => f.flight_no === flightNo) : routeFlights;
        const filtered = targetFlights.filter(f => {
            const fTime = Date.parse(f.date);
            return !isNaN(fTime) && fTime >= startMs && fTime <= endMs;
        });
        if (filtered.length > 0) {
            const result = calculateMeansFromFlights(filtered);
            result.level = 3;
            result.levelCode = 'level-3';
            result.levelName = `${currentLang === 'ru' ? 'Пользовательский период' : 'Custom Period'} (${filtered.length} выл.)`;
            result.matchedCount = filtered.length;
            return finalizeResult(result);
        }
        return null;
    }

    // 2. Если выбран явный сезонный срез
    if (periodType === 'seasonal') {
        let targetFlights = (flightNo && scope === 'flight') ? routeFlights.filter(f => f.flight_no === flightNo) : routeFlights;
        const filtered = targetFlights.filter(f => {
            if (!f.date) return false;
            const dateObj = new Date(f.date);
            const mMatch = dateObj.getMonth() === parseInt(seasonalMonth, 10);
            const yMatch = (seasonalYear === 'all') || (dateObj.getFullYear() === parseInt(seasonalYear, 10));
            return mMatch && yMatch;
        });
        if (filtered.length > 0) {
            const result = calculateMeansFromFlights(filtered);
            result.level = 3;
            result.levelCode = 'level-3';
            result.levelName = `${currentLang === 'ru' ? 'Сезонный срез' : 'Seasonal Slice'} (${filtered.length} выл.)`;
            result.matchedCount = filtered.length;
            return finalizeResult(result);
        }
        return null;
    }

    // 3. Если выбрана вся доступная история базы (3 года)
    if (periodType === 'all_history') {
        let targetFlights = (flightNo && scope === 'flight') ? routeFlights.filter(f => f.flight_no === flightNo) : routeFlights;
        const filtered = targetFlights.filter(f => {
            const fTime = Date.parse(f.date);
            return !isNaN(fTime) && fTime <= targetDateMs;
        }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        if (filtered.length > 0) {
            const sample = filtered.slice(0, 30);
            const result = calculateMeansFromFlights(sample);
            result.level = 3;
            result.levelCode = 'level-3';
            result.levelName = `${currentLang === 'ru' ? 'Вся история базы' : 'All Database History'} • ${sample.length} выл.`;
            result.matchedCount = sample.length;
            return finalizeResult(result);
        }
        return null;
    }

    // --- УМНЫЙ ВОДОПАД (4 УРОВНЯ НАДЕЖНОСТИ) ---
    // Окно анализа: 180 дней до даты вылета
    const window180Ms = 180 * 24 * 60 * 60 * 1000;
    const MAX_SAMPLE_SIZE = 20; // Оптимальный объем выборки (до 20 актуальных рейсов)
    const MIN_SAMPLE_THRESHOLD = 5; // Порог минимального числа рейсов для надежной группы (Уровень 1 и 2)

    const dayNameRu = getRuDayShort(targetDayOfWeek);
    const dayNameEn = getEnDayShort(targetDayOfWeek);

    // УРОВЕНЬ 1: Номер рейса + День недели (самое точное совпадение)
    if (flightNo && (scope === 'auto' || scope === 'flight')) {
        let level1Flights = routeFlights.filter(f => {
            if (f.flight_no !== flightNo) return false;
            if (getDayOfWeekFromIsoStr(f.date) !== targetDayOfWeek) return false;
            const fMs = Date.parse(f.date);
            if (isNaN(fMs)) return false;
            const diff = targetDateMs - fMs;
            return diff >= 0 && diff <= window180Ms;
        }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

        // Если за 180 дней мало рейсов, но они есть в истории до даты вылета
        if (level1Flights.length < MIN_SAMPLE_THRESHOLD) {
            level1Flights = routeFlights.filter(f => {
                if (f.flight_no !== flightNo) return false;
                if (getDayOfWeekFromIsoStr(f.date) !== targetDayOfWeek) return false;
                const fMs = Date.parse(f.date);
                return !isNaN(fMs) && fMs <= targetDateMs;
            }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        }

        if (level1Flights.length >= MIN_SAMPLE_THRESHOLD || (scope === 'flight' && level1Flights.length > 0)) {
            const sample = level1Flights.slice(0, MAX_SAMPLE_SIZE);
            const res = calculateMeansFromFlights(sample);
            if (res) {
                res.level = 1;
                res.levelCode = 'level-1';
                res.levelName = currentLang === 'ru' 
                    ? `🟢 Уровень 1: Рейс ${flightNo} (${dayNameRu}) • ${sample.length} выл.`
                    : `🟢 Level 1: Flight ${flightNo} (${dayNameEn}) • ${sample.length} flt.`;
                res.matchedCount = sample.length;
                return finalizeResult(res);
            }
        }
    }

    // УРОВЕНЬ 2: Маршрут (FROM -> TO) + День недели (все рейсы по маршруту в этот день недели)
    if (scope === 'auto' || scope === 'route') {
        let level2Flights = routeFlights.filter(f => {
            if (getDayOfWeekFromIsoStr(f.date) !== targetDayOfWeek) return false;
            const fMs = Date.parse(f.date);
            if (isNaN(fMs)) return false;
            const diff = targetDateMs - fMs;
            return diff >= 0 && diff <= window180Ms;
        }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

        if (level2Flights.length < MIN_SAMPLE_THRESHOLD) {
            level2Flights = routeFlights.filter(f => {
                if (getDayOfWeekFromIsoStr(f.date) !== targetDayOfWeek) return false;
                const fMs = Date.parse(f.date);
                return !isNaN(fMs) && fMs <= targetDateMs;
            }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        }

        if (level2Flights.length >= MIN_SAMPLE_THRESHOLD || (scope === 'route' && level2Flights.length > 0)) {
            const sample = level2Flights.slice(0, MAX_SAMPLE_SIZE);
            const res = calculateMeansFromFlights(sample);
            if (res) {
                res.level = 2;
                res.levelCode = 'level-2';
                res.levelName = currentLang === 'ru'
                    ? `🔵 Уровень 2: Маршрут ${fromIata}➔${toIata} (${dayNameRu}) • ${sample.length} выл.`
                    : `🔵 Level 2: Route ${fromIata}➔${toIata} (${dayNameEn}) • ${sample.length} flt.`;
                res.matchedCount = sample.length;
                return finalizeResult(res);
            }
        }

        // УРОВЕНЬ 3: Маршрут (FROM -> TO) за все дни недели
        let level3Flights = routeFlights.filter(f => {
            const fMs = Date.parse(f.date);
            if (isNaN(fMs)) return false;
            const diff = targetDateMs - fMs;
            return diff >= 0 && diff <= window180Ms;
        }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

        if (level3Flights.length < MIN_SAMPLE_THRESHOLD) {
            level3Flights = routeFlights.filter(f => {
                const fMs = Date.parse(f.date);
                return !isNaN(fMs) && fMs <= targetDateMs;
            }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        }

        if (level3Flights.length > 0) {
            const sample = level3Flights.slice(0, MAX_SAMPLE_SIZE);
            const res = calculateMeansFromFlights(sample);
            if (res) {
                res.level = 3;
                res.levelCode = 'level-3';
                res.levelName = currentLang === 'ru'
                    ? `🟡 Уровень 3: Маршрут ${fromIata}➔${toIata} (все дни) • ${sample.length} выл.`
                    : `🟡 Level 3: Route ${fromIata}➔${toIata} (all days) • ${sample.length} flt.`;
                res.matchedCount = sample.length;
                return finalizeResult(res);
            }
        }
    }

    // УРОВЕНЬ 4: Аэропорт вылета (DEP / FROM) — все направления из этого аэропорта
    const originFlights = userFlights.filter(f => ruToIata(f.from) === fromIata && Date.parse(f.date) <= targetDateMs)
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

    if (originFlights.length > 0) {
        const sample = originFlights.slice(0, MAX_SAMPLE_SIZE);
        const res = calculateMeansFromFlights(sample);
        if (res) {
            res.level = 4;
            res.levelCode = 'level-4';
            res.levelName = currentLang === 'ru'
                ? `⚪ Уровень 4: Аэропорт вылета ${fromIata} (все напр.) • ${sample.length} выл.`
                : `⚪ Level 4: Departure Airport ${fromIata} (all routes) • ${sample.length} flt.`;
            res.matchedCount = sample.length;
            return finalizeResult(res);
        }
    }

    return null;
}

// Автоматический расчет помесячного сезонного множителя на основе всей 3-летней истории базы
function getRouteSeasonalityMultiplier(from, to, targetDateStr) {
    if (!userFlights || userFlights.length < 10) return { multiplier: 1.0, hasSeasonality: false };

    const fromIata = ruToIata(from) || from;
    const toIata = ruToIata(to) || to;

    const targetMonth = targetDateStr ? new Date(targetDateStr).getMonth() : new Date().getMonth();
    const ruMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const enMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = currentLang === 'ru' ? ruMonths[targetMonth] : enMonths[targetMonth];

    // Ищем все исторические рейсы по маршруту
    const rf = userFlights.filter(f => (ruToIata(f.from) || f.from) === fromIata && (ruToIata(f.to) || f.to) === toIata);
    if (rf.length < 8) {
        return { multiplier: 1.0, hasSeasonality: false, monthName };
    }

    let totPax = 0, totBags = 0;
    let monthPax = 0, monthBags = 0, monthFlightCount = 0;

    rf.forEach(f => {
        const p = getEffectivePaxCount(f);
        const b = parseInt(f.bag_pcs, 10) || 0;
        totPax += p;
        totBags += b;

        if (f.date) {
            const m = new Date(f.date).getMonth();
            if (m === targetMonth) {
                monthPax += p;
                monthBags += b;
                monthFlightCount++;
            }
        }
    });

    if (totPax === 0 || monthPax === 0 || monthFlightCount < 3) {
        return { multiplier: 1.0, hasSeasonality: false, monthName };
    }

    const k_year = totBags / totPax;
    const k_month = monthBags / monthPax;
    const rawMultiplier = k_month / k_year;

    // Ограничиваем разумным авиационным диапазоном [0.80, 1.25]
    const multiplier = Math.max(0.80, Math.min(1.25, parseFloat(rawMultiplier.toFixed(3))));
    const isSignificant = Math.abs(multiplier - 1.0) >= 0.02;

    return {
        multiplier: multiplier,
        hasSeasonality: isSignificant,
        k_year: k_year,
        k_month: k_month,
        monthFlightCount: monthFlightCount,
        monthName: monthName
    };
}

// Расчет средних коэффициентов по переданному массиву рейсов (Экспоненциальное сглаживание alpha = 0.3)
function calculateMeansFromFlights(flights, alpha = 0.3) {
    if (!flights || flights.length === 0) return null;

    // Сортируем по дате в обратном порядке (самый свежий — индекс 0)
    const sortedFlights = [...flights].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    const N = sortedFlights.length;

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

    let weights = [];
    if (N === 1) {
        weights = [1.0];
    } else {
        const rawWeights = [];
        for (let k = 0; k < N; k++) {
            if (k === N - 1) {
                rawWeights.push(Math.pow(1 - alpha, N - 1));
            } else {
                rawWeights.push(alpha * Math.pow(1 - alpha, k));
            }
        }
        const sumW = rawWeights.reduce((a, b) => a + b, 0);
        weights = rawWeights.map(w => w / sumW);
    }

    let pcs_pax = 0;
    let wght_pc = 0;
    let hb_pax = 0;

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

    return {
        pcs_pax: pcs_pax,
        wght_pc: wght_pc,
        hb_pax: hb_pax,
        usedFlights: sortedFlights,
        weights: weights,
        isWeighted: true,
        alpha: alpha,
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

function parseDateToJsDate(val) {
    if (!val) return null;
    if (val instanceof Date && !isNaN(val.getTime())) {
        return val;
    }
    const isoStr = parseExcelDate(val);
    if (isoStr) {
        const parts = isoStr.split('-');
        if (parts.length === 3) {
            const y = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10) - 1;
            const d = parseInt(parts[2], 10);
            const dt = new Date(y, m, d);
            if (!isNaN(dt.getTime())) return dt;
        }
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

// --- ОТРИСОВКА И РАСЧЕТ ДАШБОРДА АНАЛИТИКИ И МАСШТАБИРОВАНИЯ ---
function renderDashboardAnalytics() {
    const routeSelect = document.getElementById('dash-filter-route');
    const selectedRoute = routeSelect ? routeSelect.value : 'all';

    // Helper for checking valid 3-letter IATA codes (rejects #REF!, NULL, undefined)
    const isValidIataCode = (code) => {
        if (!code) return false;
        const str = String(code).trim().toUpperCase();
        if (str.includes('#') || str.includes('REF') || str.includes('NULL') || str.includes('UNDEFINED')) {
            return false;
        }
        return /^[A-Z]{3}$/.test(str);
    };

    // 1. Используем данные из загруженной базы рейсов и системных нормативов (baggageDb.rules)
    let dataset = [];

    if (userFlights && Array.isArray(userFlights)) {
        userFlights.forEach(f => {
            const fromIata = ruToIata(f.from) || f.from;
            const toIata = ruToIata(f.to) || f.to;
            if (isValidIataCode(fromIata) && isValidIataCode(toIata)) {
                dataset.push({
                    from: fromIata,
                    to: toIata,
                    flight_no: f.flight_no,
                    pax: getEffectivePaxCount(f),
                    bag_pcs: parseInt(f.bag_pcs, 10) || 0,
                    bag_weight: parseFloat(f.bag_weight) || 0,
                    hb_weight: parseFloat(f.hb_weight) || 0,
                    date: f.date,
                    source: 'user_db'
                });
            }
        });
    }

    if (baggageDb && Array.isArray(baggageDb.rules)) {
        baggageDb.rules.forEach(r => {
            const fromIata = ruToIata(r.from) || r.from;
            const toIata = ruToIata(r.to) || r.to;
            if (isValidIataCode(fromIata) && isValidIataCode(toIata)) {
                const paxCount = parseInt(r.pax_no, 10) || 150;
                const pcsPax = parseFloat(r.pcs_pax) || 0;
                const wghtPc = parseFloat(r.wght_pc) || 0;
                const totalPcs = Math.round(paxCount * pcsPax);
                const totalWeight = totalPcs * wghtPc;
                const hbWeight = Math.round(paxCount * (parseFloat(r.hb_pax) || 0));

                dataset.push({
                    from: fromIata,
                    to: toIata,
                    flight_no: r.flt_no || '',
                    pax: paxCount,
                    bag_pcs: totalPcs,
                    bag_weight: totalWeight,
                    hb_weight: hbWeight,
                    date: r.date || null,
                    source: 'system_rules'
                });
            }
        });
    }

    // 2. Обновляем списки выпадающего фильтра маршрутов (исключая битые типы #REF!)
    if (routeSelect) {
        const savedRoute = routeSelect.value;
        const routesSet = new Set();
        dataset.forEach(f => {
            if (isValidIataCode(f.from) && isValidIataCode(f.to)) {
                routesSet.add(`${f.from} ➔ ${f.to}`);
            }
        });

        // Сохраняем первую опцию "Все направления" / "All Routes"
        routeSelect.innerHTML = `<option value="all">${currentLang === 'ru' ? 'Все направления' : 'All Routes'}</option>`;
        Array.from(routesSet).sort().forEach(r => {
            const opt = document.createElement('option');
            opt.value = r;
            opt.textContent = r;
            routeSelect.appendChild(opt);
        });

        if (Array.from(routeSelect.options).some(o => o.value === savedRoute)) {
            routeSelect.value = savedRoute;
        }
    }

    // 3. Фильтрация набора данных по периоду времени и маршруту
    const periodSelect = document.getElementById('dash-filter-period');
    const selectedPeriod = periodSelect ? periodSelect.value : 'all';
    
    let filteredDataset = dataset;
    let periodSubtext = currentLang === 'ru' ? 'За весь период базы данных' : 'For entire database period';

    if (selectedPeriod !== 'all') {
        const now = new Date();
        
        if (selectedPeriod === '30' || selectedPeriod === '60' || selectedPeriod === '90') {
            const days = parseInt(selectedPeriod, 10);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            
            filteredDataset = filteredDataset.filter(f => {
                if (!f.date) return false;
                const d = parseDateToJsDate(f.date);
                return d && d >= cutoffDate;
            });
            periodSubtext = currentLang === 'ru' ? `За последние ${days} дней` : `Last ${days} days`;
        } else if (selectedPeriod === 'year') {
            const currentYear = now.getFullYear();
            filteredDataset = filteredDataset.filter(f => {
                if (!f.date) return false;
                const d = parseDateToJsDate(f.date);
                return d && d.getFullYear() === currentYear;
            });
            periodSubtext = currentLang === 'ru' ? `За ${currentYear} год` : `For year ${currentYear}`;
        } else if (selectedPeriod === 'custom') {
            const dateFromInput = document.getElementById('dash-date-from');
            const dateToInput = document.getElementById('dash-date-to');
            const fromVal = dateFromInput ? dateFromInput.value : '';
            const toVal = dateToInput ? dateToInput.value : '';

            if (fromVal || toVal) {
                const fromDate = fromVal ? new Date(fromVal) : new Date('1970-01-01');
                const toDate = toVal ? new Date(toVal) : new Date('2099-12-31');
                toDate.setHours(23, 59, 59, 999);

                filteredDataset = filteredDataset.filter(f => {
                    if (!f.date) return false;
                    const d = parseDateToJsDate(f.date);
                    return d && d >= fromDate && d <= toDate;
                });
                periodSubtext = currentLang === 'ru' 
                    ? `Интервал: ${fromVal || '...'} — ${toVal || '...'}`
                    : `Interval: ${fromVal || '...'} — ${toVal || '...'}`;
            }
        }
    }

    // Сохраняем срез периода (до сужения по выбранному маршруту selectedRoute)
    const periodFilteredDataset = [...filteredDataset];

    if (selectedRoute && selectedRoute !== 'all') {
        const [fromCode, toCode] = selectedRoute.split(' ➔ ').map(s => s.trim());
        filteredDataset = filteredDataset.filter(f => f.from === fromCode && f.to === toCode);
    }

    // 4. Расчет KPI Метрик
    const totalFlights = filteredDataset.length;

    const uniqueFlightNumbersSet = new Set();
    let totalPax = 0;
    let totalPcs = 0;
    let totalWeight = 0;
    let totalHb = 0;

    filteredDataset.forEach(f => {
        if (f.flight_no && String(f.flight_no).trim() !== '') {
            uniqueFlightNumbersSet.add(String(f.flight_no).trim());
        }
        totalPax += f.pax;
        totalPcs += f.bag_pcs;
        totalWeight += f.bag_weight;
        totalHb += f.hb_weight;
    });

    const totalFlightNumbers = uniqueFlightNumbersSet.size > 0 ? uniqueFlightNumbersSet.size : (filteredDataset.length > 0 ? 1 : 0);
    const avgWeightPerPax = totalPax > 0 ? (totalWeight / totalPax) : 0;
    const avgPcsPerPax = totalPax > 0 ? (totalPcs / totalPax) : 0;

    // Обновляем карточки KPI
    const kpiFlights = document.getElementById('dash-kpi-flights');
    const kpiRoutes = document.getElementById('dash-kpi-routes');
    const kpiWeight = document.getElementById('dash-kpi-weight');
    const kpiPcs = document.getElementById('dash-kpi-pcs');

    const kgUnitText = currentLang === 'ru' ? 'кг/пассажира' : 'kg/passenger';
    const pcsUnitText = currentLang === 'ru' ? 'мест/пассажира' : 'pcs/passenger';

    if (kpiFlights) kpiFlights.textContent = totalFlights;
    if (kpiRoutes) kpiRoutes.textContent = totalFlightNumbers;
    if (kpiWeight) kpiWeight.innerHTML = `${avgWeightPerPax.toFixed(2)} <span class="kpi-unit">${kgUnitText}</span>`;
    if (kpiPcs) kpiPcs.innerHTML = `${avgPcsPerPax.toFixed(2)} <span class="kpi-unit">${pcsUnitText}</span>`;

    // Обновляем подписи периода под KPI карточками
    const kpiSubs = document.querySelectorAll('.dashboard-kpi-grid .kpi-sub');
    kpiSubs.forEach(el => el.textContent = periodSubtext);

    // 5. Группировка по маршрутам для графиков
    const routeStats = {};
    filteredDataset.forEach(f => {
        const routeKey = (f.from && f.to) ? `${f.from} ➔ ${f.to}` : 'Прочие';
        if (!routeStats[routeKey]) {
            routeStats[routeKey] = { route: routeKey, pax: 0, pcs: 0, weight: 0, hb: 0, flights: 0 };
        }
        routeStats[routeKey].pax += f.pax;
        routeStats[routeKey].pcs += f.bag_pcs;
        routeStats[routeKey].weight += f.bag_weight;
        routeStats[routeKey].hb += f.hb_weight;
        routeStats[routeKey].flights += 1;
    });

    const routeStatsList = Object.values(routeStats).map(r => ({
        ...r,
        avgWeight: r.pax > 0 ? (r.weight / r.pax) : 0,
        avgPcs: r.pax > 0 ? (r.pcs / r.pax) : 0,
        avgHb: r.pax > 0 ? (r.hb / r.pax) : 0
    }));

    // График 1: Вес на 1 PAX по маршрутам (Ранжированные полосы с бейджами ТОП-направлений)
    const weightContainer = document.getElementById('dash-chart-weight-container');
    if (weightContainer) {
        weightContainer.innerHTML = '';
        const sortedByWeight = [...routeStatsList].sort((a, b) => b.avgWeight - a.avgWeight);
        const maxW = sortedByWeight.length > 0 ? Math.max(...sortedByWeight.map(r => r.avgWeight), 1) : 1;

        if (sortedByWeight.length === 0) {
            weightContainer.innerHTML = '<div class="empty-table-text">Нет данных для графиков</div>';
        } else {
            sortedByWeight.forEach((r, idx) => {
                const percent = Math.min(100, Math.round((r.avgWeight / maxW) * 100));
                const item = document.createElement('div');
                item.className = 'chart-bar-item';
                item.innerHTML = `
                    <div class="bar-label-group">
                        <span class="bar-label">
                            <span class="bar-rank-badge ${idx === 0 ? 'top-1' : ''}">#${idx + 1}</span>
                            <strong>${r.route}</strong>
                        </span>
                        <span class="bar-value font-mono highlight-gold">${r.avgWeight.toFixed(2)} <span class="val-unit">${currentLang === 'ru' ? 'кг' : 'kg'}</span></span>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill gold" style="width: ${percent}%;"></div>
                    </div>
                `;
                weightContainer.appendChild(item);
            });
        }
    }

    // График 2: Места на 1 PAX по направлениям (Ранжированные карточки емкости / Capacity Tiles)
    const pcsContainer = document.getElementById('dash-chart-pcs-container');
    if (pcsContainer) {
        pcsContainer.innerHTML = '';
        pcsContainer.className = 'pcs-tiles-list';
        const sortedByPcs = [...routeStatsList].sort((a, b) => b.avgPcs - a.avgPcs);

        if (sortedByPcs.length === 0) {
            pcsContainer.innerHTML = '<div class="empty-table-text">Нет данных для графиков</div>';
        } else {
            sortedByPcs.forEach((r, idx) => {
                // Определение категории загрузки багажа
                let statusClass = 'standard';
                let statusLabel = currentLang === 'ru' ? 'СТАНДАРТ' : 'STANDARD';
                if (r.avgPcs >= 1.35) {
                    statusClass = 'heavy';
                    statusLabel = currentLang === 'ru' ? 'ТЯЖЕЛЫЙ' : 'HEAVY';
                } else if (r.avgPcs < 0.85) {
                    statusClass = 'light';
                    statusLabel = currentLang === 'ru' ? 'ЛЕГКИЙ' : 'LIGHT';
                }

                const item = document.createElement('div');
                item.className = 'pcs-rank-tile';
                item.innerHTML = `
                    <div class="pcs-tile-left">
                        <span class="pcs-rank-number ${idx === 0 ? 'top-1' : ''}">#${idx + 1}</span>
                        <span class="pcs-tile-route">${r.route}</span>
                        <span class="pcs-status-badge ${statusClass}">${statusLabel}</span>
                    </div>
                    <div class="pcs-tile-right font-mono">
                        <span class="pcs-tile-val">${r.avgPcs.toFixed(2)}</span>
                        <span class="pcs-tile-unit">${currentLang === 'ru' ? 'мест' : 'pcs'}</span>
                    </div>
                `;
                pcsContainer.appendChild(item);
            });
        }
    }

    // График 3: Динамика по дням недели (ПН - ВС) (Вертикальный столбчатый график / Vertical Columns Chart)
    const weekdayContainer = document.getElementById('dash-chart-weekdays-container');
    if (weekdayContainer) {
        weekdayContainer.innerHTML = '';
        const dayNames = currentLang === 'ru' ? ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'] : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        const dayStats = Array(7).fill(0).map(() => ({ pax: 0, weight: 0, count: 0 }));

        filteredDataset.forEach(f => {
            let dayIdx = null;
            if (f.date) {
                const dt = parseDateToJsDate(f.date);
                if (dt && !isNaN(dt.getDay())) {
                    const jsDay = dt.getDay(); // 0=Вс, 1=Пн, 2=Вт, 3=Ср, 4=Чт, 5=Пт, 6=Сб
                    dayIdx = (jsDay === 0) ? 6 : jsDay - 1; // 0=Пн ... 6=Вс
                }
            }

            if (dayIdx === null) {
                dayIdx = 0; // Пн по умолчанию
            }

            dayStats[dayIdx].pax += f.pax;
            dayStats[dayIdx].weight += f.bag_weight;
            dayStats[dayIdx].count += 1;
        });

        const dayAverages = dayStats.map((d, idx) => ({
            day: dayNames[idx],
            avgWeight: d.pax > 0 ? (d.weight / d.pax) : 0,
            count: d.count
        }));

        const maxDayW = Math.max(...dayAverages.map(d => d.avgWeight), 0.1);
        
        // Находим индекс дня с пиковой нагрузкой (больше 0)
        let peakIdx = -1;
        let peakVal = 0;
        dayAverages.forEach((d, idx) => {
            if (d.avgWeight > peakVal) {
                peakVal = d.avgWeight;
                peakIdx = idx;
            }
        });

        const chartWrap = document.createElement('div');
        chartWrap.className = 'weekday-chart-wrapper';

        // Подсказка с описанием метрики
        const hintBar = document.createElement('div');
        hintBar.className = 'weekday-hint-bar';
        hintBar.innerHTML = `
            <span class="hint-icon">⚖️</span>
            <span>${currentLang === 'ru' ? 'Средний вес багажа на 1 пассажира (кг/PAX)' : 'Avg baggage weight per passenger (kg/PAX)'}</span>
        `;
        chartWrap.appendChild(hintBar);

        // 1. Верхняя область с вертикальными колонками
        const colsGrid = document.createElement('div');
        colsGrid.className = 'weekday-columns-grid';

        dayAverages.forEach((d, idx) => {
            const isPeak = (idx === peakIdx && peakVal > 0);
            const heightPct = Math.min(100, Math.max(8, Math.round((d.avgWeight / maxDayW) * 100)));

            const col = document.createElement('div');
            col.className = `weekday-col ${isPeak ? 'peak-day' : ''}`;
            col.title = `${d.day}: ${d.avgWeight.toFixed(2)} ${kgUnitText} (${d.count} ${currentLang === 'ru' ? 'рейсов' : 'flights'})`;
            col.innerHTML = `
                <div class="weekday-bar-val font-mono">
                    ${isPeak ? '<span class="peak-pill">MAX</span>' : '<span class="peak-pill-placeholder"></span>'}
                    <div class="val-num-group">
                        <span class="val-num">${d.avgWeight > 0 ? d.avgWeight.toFixed(2) : '-'}</span>
                        <span class="val-unit">${currentLang === 'ru' ? 'кг' : 'kg'}</span>
                    </div>
                </div>
                <div class="weekday-col-track">
                    <div class="weekday-col-fill" style="height: ${heightPct}%;"></div>
                </div>
            `;
            colsGrid.appendChild(col);
        });
        chartWrap.appendChild(colsGrid);

        // 2. Нижняя область с подписями дней и количеством рейсов
        const footer = document.createElement('div');
        footer.className = 'weekday-labels-footer';

        dayAverages.forEach(d => {
            const item = document.createElement('div');
            item.className = 'weekday-footer-item';
            item.innerHTML = `
                <span class="weekday-name">${d.day}</span>
                <span class="weekday-flights-count">${d.count} ${currentLang === 'ru' ? 'рейс.' : 'flt.'}</span>
            `;
            footer.appendChild(item);
        });
        chartWrap.appendChild(footer);

        weekdayContainer.appendChild(chartWrap);
    }

    // 6. График 4: Круговая диаграмма процентного распределения вылетов (НЕ зависимая от выбранного маршрута)
    const sharesContainer = document.getElementById('dash-chart-shares-container');
    if (sharesContainer) {
        sharesContainer.innerHTML = '';
        
        const periodTotalFlights = periodFilteredDataset.length;

        if (periodTotalFlights === 0) {
            sharesContainer.innerHTML = '<div class="empty-table-text">Нет данных за период</div>';
        } else {
            // Группировка рейсов периода по маршрутам
            const periodRouteMap = {};
            periodFilteredDataset.forEach(f => {
                const rKey = (f.from && f.to) ? `${f.from} ➔ ${f.to}` : 'Прочие';
                if (!periodRouteMap[rKey]) {
                    periodRouteMap[rKey] = { route: rKey, flights: 0 };
                }
                periodRouteMap[rKey].flights += 1;
            });

            const sortedPeriodRoutes = Object.values(periodRouteMap).sort((a, b) => b.flights - a.flights);
            
            // Формируем карту цветов: яркий уникальный цвет для рейсов (>1), серый для одиночных (===1)
            const allPeriodRoutes = sortedPeriodRoutes;

            const activePalette = [
                '#00f2ff', '#ffb700', '#10b981', '#8b5cf6', 
                '#f97316', '#06b6d4', '#ec4899', '#3b82f6', 
                '#a855f7', '#14b8a6', '#f43f5e', '#eab308',
                '#38bdf8', '#fb923c', '#4ade80', '#c084fc'
            ];
            const singleFlightColor = '#64748b';

            let activeColorIdx = 0;
            const routeColorMap = {};
            allPeriodRoutes.forEach(s => {
                if (s.flights > 1) {
                    routeColorMap[s.route] = activePalette[activeColorIdx % activePalette.length];
                    activeColorIdx++;
                } else {
                    routeColorMap[s.route] = singleFlightColor;
                }
            });

            // Расчет круговых сегментов SVG (окружность R=40 => C = 2*PI*40 ≈ 251.327)
            const C = 251.327;
            let currentOffset = 0;
            let svgCircles = '';

            allPeriodRoutes.forEach(s => {
                const sharePct = (s.flights / periodTotalFlights) * 100;
                const dashLen = (sharePct / 100) * C;
                const gapLen = C - dashLen;
                const strokeColor = routeColorMap[s.route] || singleFlightColor;

                svgCircles += `
                    <circle class="pie-slice-circle" 
                            data-route="${s.route}"
                            data-flights="${s.flights}"
                            data-pct="${((s.flights / periodTotalFlights) * 100).toFixed(1)}"
                            cx="50" cy="50" r="40" 
                            fill="transparent" 
                            stroke="${strokeColor}" 
                            stroke-width="14" 
                            stroke-dasharray="${dashLen.toFixed(2)} ${gapLen.toFixed(2)}" 
                            stroke-dashoffset="${(-currentOffset).toFixed(2)}" />
                `;
                currentOffset += dashLen;
            });

            // Генерируем легенду ДЛЯ ВСЕХ НАПРАВЛЕНИЙ с их индивидуальными цветами
            let legendHtml = '';
            allPeriodRoutes.forEach(s => {
                const sharePct = ((s.flights / periodTotalFlights) * 100).toFixed(1);
                const dotColor = routeColorMap[s.route] || singleFlightColor;

                legendHtml += `
                    <div class="pie-legend-item" data-route="${s.route}" data-flights="${s.flights}" data-pct="${sharePct}">
                        <div class="pie-legend-left">
                            <span class="pie-legend-dot" style="background: ${dotColor};"></span>
                            <span class="pie-legend-name">${s.route}</span>
                        </div>
                        <span class="pie-legend-val">${s.flights} (${sharePct}%)</span>
                    </div>
                `;
            });

            sharesContainer.innerHTML = `
                <div class="pie-chart-wrapper">
                    <div class="pie-chart-container">
                        <svg class="pie-chart-svg" viewBox="0 0 100 100">
                            ${svgCircles}
                        </svg>
                        <div class="pie-chart-center">
                            <div class="pie-chart-center-val">${periodTotalFlights}</div>
                            <div class="pie-chart-center-lbl">${currentLang === 'ru' ? 'РЕЙСОВ' : 'FLIGHTS'}</div>
                        </div>
                    </div>
                    <div class="pie-chart-legend">
                        ${legendHtml}
                    </div>
                </div>
            `;

            // Подключение интерактивных кликов по сегментам и строкам легенды
            let selectedPieRoute = null;

            const centerVal = sharesContainer.querySelector('.pie-chart-center-val');
            const centerLbl = sharesContainer.querySelector('.pie-chart-center-lbl');
            const circles = sharesContainer.querySelectorAll('.pie-slice-circle');
            const legendItems = sharesContainer.querySelectorAll('.pie-legend-item');

            const handleRouteHighlight = (targetRoute, targetFlights, targetPct) => {
                if (selectedPieRoute === targetRoute) {
                    // Сброс выделения при повторном клике
                    selectedPieRoute = null;
                    if (centerVal) centerVal.textContent = periodTotalFlights;
                    if (centerLbl) centerLbl.textContent = currentLang === 'ru' ? 'РЕЙСОВ' : 'FLIGHTS';

                    circles.forEach(c => {
                        c.style.strokeWidth = '14px';
                        c.style.opacity = '1';
                        c.style.filter = 'none';
                    });

                    legendItems.forEach(item => {
                        item.classList.remove('active-pie-route');
                    });
                } else {
                    // Установка выделения на выбранное направление
                    selectedPieRoute = targetRoute;
                    if (centerVal) centerVal.textContent = targetFlights;
                    if (centerLbl) centerLbl.textContent = `${targetRoute} (${targetPct}%)`;

                    circles.forEach(c => {
                        if (c.getAttribute('data-route') === targetRoute) {
                            c.style.strokeWidth = '18px';
                            c.style.opacity = '1';
                            c.style.filter = 'drop-shadow(0 0 8px currentColor)';
                        } else {
                            c.style.strokeWidth = '12px';
                            c.style.opacity = '0.25';
                            c.style.filter = 'none';
                        }
                    });

                    legendItems.forEach(item => {
                        if (item.getAttribute('data-route') === targetRoute) {
                            item.classList.add('active-pie-route');
                            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        } else {
                            item.classList.remove('active-pie-route');
                        }
                    });
                }
            };

            circles.forEach(c => {
                c.addEventListener('click', () => {
                    const r = c.getAttribute('data-route');
                    const f = c.getAttribute('data-flights');
                    const p = c.getAttribute('data-pct');
                    handleRouteHighlight(r, f, p);
                });
            });

            legendItems.forEach(item => {
                item.addEventListener('click', () => {
                    const r = item.getAttribute('data-route');
                    const f = item.getAttribute('data-flights');
                    const p = item.getAttribute('data-pct');
                    handleRouteHighlight(r, f, p);
                });
            });
        }
    }
}

// --- МОДУЛЬ БЭКТЕСТИНГА И ВЕРИФИКАЦИИ ТОЧНОСТИ (STAGE 3) ---

function initBacktestModule() {
    const btnOpen = document.getElementById('btn-open-backtest');
    const btnClose = document.getElementById('btn-close-backtest');
    const modal = document.getElementById('backtest-modal');
    const btnStart = document.getElementById('btn-start-backtest');

    if (btnOpen && modal) {
        btnOpen.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
    }

    if (btnClose && modal) {
        btnClose.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    if (btnStart) {
        btnStart.addEventListener('click', () => {
            runBacktestAccuracySimulation();
        });
    }
}

function runBacktestAccuracySimulation() {
    if (!userFlights || userFlights.length === 0) {
        showAviationAlert(currentLang === 'ru' ? 'База данных пуста! Загрузите архив полетов.' : 'Database is empty! Please load flights data.', true);
        return;
    }

    const periodVal = document.getElementById('backtest-period-select')?.value || '180';
    const limitVal = parseInt(document.getElementById('backtest-limit-select')?.value || '250', 10);
    const btnStart = document.getElementById('btn-start-backtest');
    const progressContainer = document.getElementById('backtest-progress-container');
    const progressStatus = document.getElementById('backtest-progress-status');
    const progressPercent = document.getElementById('backtest-progress-percent');
    const progressFill = document.getElementById('backtest-progress-fill');
    const resultsContainer = document.getElementById('backtest-results-container');

    // 1. Фильтрация и хронологическая сортировка
    const validFlights = userFlights.filter(f => {
        if (!f.date) return false;
        const pax = getEffectivePaxCount(f);
        const w = parseFloat(f.bag_weight) || 0;
        return pax > 0 && w > 0 && parseDateToJsDate(f.date) !== null;
    }).sort((a, b) => {
        const da = parseDateToJsDate(a.date);
        const db = parseDateToJsDate(b.date);
        return (da ? da.getTime() : 0) - (db ? db.getTime() : 0);
    });

    if (validFlights.length < 10) {
        showAviationAlert(currentLang === 'ru' ? 'Слишком мало рейсов с датами для бэктестинга (требуется >= 10).' : 'Not enough flights for backtesting (>= 10 required).', true);
        return;
    }

    // Фильтрация по периоду
    let targetPool = validFlights;
    if (periodVal !== 'all') {
        const days = parseInt(periodVal, 10);
        const newestFlightDate = parseDateToJsDate(validFlights[validFlights.length - 1].date);
        if (newestFlightDate) {
            const cutoffMs = newestFlightDate.getTime() - (days * 24 * 60 * 60 * 1000);
            targetPool = validFlights.filter(f => {
                const fd = parseDateToJsDate(f.date);
                return fd && fd.getTime() >= cutoffMs;
            });
        }
    }

    if (targetPool.length < 5) {
        targetPool = validFlights.slice(-50);
    }

    // Выборка из пула (до limitVal самых свежих)
    const testSample = targetPool.slice(-limitVal);

    if (btnStart) btnStart.disabled = true;
    if (progressContainer) progressContainer.classList.remove('hidden');
    if (resultsContainer) resultsContainer.classList.add('hidden');
    if (progressFill) progressFill.style.width = '0%';
    if (progressPercent) progressPercent.textContent = '0%';

    let currentIndex = 0;
    const oldWeightErrors = [];
    const newWeightErrors = [];
    const oldPcsErrors = [];
    const newPcsErrors = [];
    let oldAccurateCount = 0;
    let newAccurateCount = 0;
    const sampleRowsData = [];

    function processBatch() {
        const batchSize = 20;
        const endIndex = Math.min(currentIndex + batchSize, testSample.length);

        for (let i = currentIndex; i < endIndex; i++) {
            const targetFlight = testSample[i];
            const targetDt = parseDateToJsDate(targetFlight.date);
            if (!targetDt) continue;
            const targetMs = targetDt.getTime();
            const targetDay = getDayOfWeekFromIsoStr(targetFlight.date);
            const actualPax = getEffectivePaxCount(targetFlight);
            const actualWeight = parseFloat(targetFlight.bag_weight) || 0;
            const actualPcs = parseInt(targetFlight.bag_pcs, 10) || 0;

            // История СТРОГО ДО даты вылета targetFlight
            const historyBefore = validFlights.filter(f => {
                const fd = parseDateToJsDate(f.date);
                return fd && fd.getTime() < targetMs;
            });

            // 1. Старый метод (4 рейса за 60 дней)
            const window60Ms = 60 * 24 * 60 * 60 * 1000;
            let oldSample = historyBefore.filter(f => {
                if (f.flight_no !== targetFlight.flight_no) return false;
                if (getDayOfWeekFromIsoStr(f.date) !== targetDay) return false;
                const fd = parseDateToJsDate(f.date);
                const diff = targetMs - fd.getTime();
                return diff > 0 && diff <= window60Ms;
            }).sort((a, b) => parseDateToJsDate(b.date) - parseDateToJsDate(a.date)).slice(0, 4);

            if (oldSample.length === 0) {
                const window30Ms = 30 * 24 * 60 * 60 * 1000;
                oldSample = historyBefore.filter(f => {
                    const fd = parseDateToJsDate(f.date);
                    const diff = targetMs - fd.getTime();
                    return diff > 0 && diff <= window30Ms;
                }).sort((a, b) => parseDateToJsDate(b.date) - parseDateToJsDate(a.date)).slice(0, 4);
            }

            let oldPredWeight = actualWeight;
            let oldPredPcs = actualPcs;
            if (oldSample.length > 0) {
                let sumK = 0, sumV = 0;
                oldSample.forEach(f => {
                    const p = getEffectivePaxCount(f);
                    const pcs = parseInt(f.bag_pcs, 10) || 0;
                    const w = parseFloat(f.bag_weight) || 0;
                    sumK += (pcs / p);
                    sumV += pcs > 0 ? (w / pcs) : 0;
                });
                const avgK = sumK / oldSample.length;
                const avgV = sumV / oldSample.length;
                oldPredPcs = Math.round(actualPax * avgK);
                oldPredWeight = Math.round(oldPredPcs * avgV);
            }

            // 2. Новый Smart Waterfall метод (180 дней, порог >=5, сглаживание альфа=0.3, авто-сезонность, 97% явка)
            const window180Ms = 180 * 24 * 60 * 60 * 1000;
            const routeFlights = historyBefore.filter(f => f.from === targetFlight.from && f.to === targetFlight.to);

            let newSample = routeFlights.filter(f => {
                if (f.flight_no !== targetFlight.flight_no) return false;
                if (getDayOfWeekFromIsoStr(f.date) !== targetDay) return false;
                const fd = parseDateToJsDate(f.date);
                const diff = targetMs - fd.getTime();
                return diff > 0 && diff <= window180Ms;
            }).sort((a, b) => parseDateToJsDate(b.date) - parseDateToJsDate(a.date));

            if (newSample.length < 5) {
                newSample = routeFlights.filter(f => {
                    if (getDayOfWeekFromIsoStr(f.date) !== targetDay) return false;
                    const fd = parseDateToJsDate(f.date);
                    const diff = targetMs - fd.getTime();
                    return diff > 0 && diff <= window180Ms;
                }).sort((a, b) => parseDateToJsDate(b.date) - parseDateToJsDate(a.date));
            }

            if (newSample.length < 5) {
                newSample = routeFlights.filter(f => {
                    const fd = parseDateToJsDate(f.date);
                    const diff = targetMs - fd.getTime();
                    return diff > 0 && diff <= window180Ms;
                }).sort((a, b) => parseDateToJsDate(b.date) - parseDateToJsDate(a.date));
            }

            if (newSample.length === 0) {
                newSample = historyBefore.filter(f => {
                    if (f.from !== targetFlight.from) return false;
                    const fd = parseDateToJsDate(f.date);
                    const diff = targetMs - fd.getTime();
                    return diff > 0 && diff <= window180Ms;
                }).sort((a, b) => parseDateToJsDate(b.date) - parseDateToJsDate(a.date));
            }

            let newPredWeight = actualWeight;
            let newPredPcs = actualPcs;
            if (newSample.length > 0) {
                const sampleSlice = newSample.slice(0, 20);
                const means = calculateMeansFromFlights(sampleSlice, 0.3);
                if (means && typeof means.pcs_pax === 'number' && typeof means.wght_pc === 'number' && !isNaN(means.pcs_pax) && !isNaN(means.wght_pc)) {
                    // При симуляции на исторических данных базы пассажиры уже являются 100% фактическими
                    const effectivePax = Math.max(1, actualPax);
                    const seasonInfo = getRouteSeasonalityMultiplier(targetFlight.from, targetFlight.to, targetFlight.date);
                    const seasonMultiplier = (seasonInfo && typeof seasonInfo.multiplier === 'number') ? seasonInfo.multiplier : 1.0;
                    const adjustedK = means.pcs_pax * seasonMultiplier;
                    newPredPcs = Math.round(effectivePax * adjustedK);
                    newPredWeight = Math.round(newPredPcs * means.wght_pc);
                }
            }

            const oldErrW = Math.abs(actualWeight - oldPredWeight);
            const newErrW = Math.abs(actualWeight - newPredWeight);
            const oldErrPcs = Math.abs(actualPcs - oldPredPcs);
            const newErrPcs = Math.abs(actualPcs - newPredPcs);

            oldWeightErrors.push(oldErrW);
            newWeightErrors.push(newErrW);
            oldPcsErrors.push(oldErrPcs);
            newPcsErrors.push(newErrPcs);

            if (actualWeight > 0) {
                if (oldErrW / actualWeight <= 0.10) oldAccurateCount++;
                if (newErrW / actualWeight <= 0.10) newAccurateCount++;
            }

            if (sampleRowsData.length < 15) {
                sampleRowsData.push({
                    date: targetFlight.date ? formatDateStr(targetFlight.date) : '-',
                    flight: targetFlight.flight_no || '-',
                    route: `${targetFlight.from}➔${targetFlight.to}`,
                    pax: actualPax,
                    factW: Math.round(actualWeight),
                    oldW: oldPredWeight,
                    newW: newPredWeight,
                    newDiff: Math.round(newPredWeight - actualWeight)
                });
            }
        }

        currentIndex = endIndex;
        const progressPct = Math.round((currentIndex / testSample.length) * 100);
        if (progressFill) progressFill.style.width = `${progressPct}%`;
        if (progressPercent) progressPercent.textContent = `${progressPct}%`;
        if (progressStatus) {
            progressStatus.textContent = currentLang === 'ru'
                ? `Тестирование алгоритмов: рейс ${currentIndex} из ${testSample.length}...`
                : `Testing algorithms: flight ${currentIndex} of ${testSample.length}...`;
        }

        if (currentIndex < testSample.length) {
            setTimeout(processBatch, 0);
        } else {
            // Завершение тестирования
            if (btnStart) btnStart.disabled = false;
            if (progressContainer) progressContainer.classList.add('hidden');
            if (resultsContainer) resultsContainer.classList.remove('hidden');

            const totalTested = oldWeightErrors.length || 1;
            const avgOldW = oldWeightErrors.reduce((a, b) => a + b, 0) / totalTested;
            const avgNewW = newWeightErrors.reduce((a, b) => a + b, 0) / totalTested;
            const avgOldPcs = oldPcsErrors.reduce((a, b) => a + b, 0) / totalTested;
            const avgNewPcs = newPcsErrors.reduce((a, b) => a + b, 0) / totalTested;

            const oldAccPct = Math.round((oldAccurateCount / totalTested) * 100);
            const newAccPct = Math.round((newAccurateCount / totalTested) * 100);

            const gainWeightPct = avgOldW > 0 ? (((avgOldW - avgNewW) / avgOldW) * 100) : 0;
            const gainPcsPct = avgOldPcs > 0 ? (((avgOldPcs - avgNewPcs) / avgOldPcs) * 100) : 0;

            const elOldW = document.getElementById('bt-old-weight-mae');
            const elNewW = document.getElementById('bt-new-weight-mae');
            const elOldP = document.getElementById('bt-old-pcs-mae');
            const elNewP = document.getElementById('bt-new-pcs-mae');
            const elOldAcc = document.getElementById('bt-old-accuracy');
            const elNewAcc = document.getElementById('bt-new-accuracy');
            const elGainW = document.getElementById('bt-weight-gain');
            const elGainP = document.getElementById('bt-pcs-gain');

            if (elOldW) elOldW.textContent = `${avgOldW.toFixed(1)} кг`;
            if (elNewW) elNewW.textContent = `${avgNewW.toFixed(1)} кг`;
            if (elOldP) elOldP.textContent = `${avgOldPcs.toFixed(1)} шт`;
            if (elNewP) elNewP.textContent = `${avgNewPcs.toFixed(1)} шт`;
            if (elOldAcc) elOldAcc.textContent = `${oldAccPct}%`;
            if (elNewAcc) elNewAcc.textContent = `${newAccPct}%`;

            if (elGainW) {
                elGainW.textContent = `${gainWeightPct >= 0 ? '+' : '-'}${Math.abs(gainWeightPct).toFixed(1)}%`;
                elGainW.style.color = gainWeightPct >= 0 ? '#34d399' : '#f87171';
            }
            if (elGainP) {
                elGainP.textContent = `${gainPcsPct >= 0 ? '+' : '-'}${Math.abs(gainPcsPct).toFixed(1)}%`;
                elGainP.style.color = gainPcsPct >= 0 ? '#34d399' : '#f87171';
            }

            // Рендер таблицы примеров
            const tbody = document.getElementById('backtest-table-body');
            if (tbody) {
                let html = '';
                sampleRowsData.forEach(r => {
                    const diffSign = r.newDiff > 0 ? `+${r.newDiff}` : `${r.newDiff}`;
                    const diffColor = Math.abs(r.newDiff) <= Math.round(r.factW * 0.1) ? 'highlight-green' : 'cyan-val';
                    html += `
                        <tr>
                            <td>${r.date}</td>
                            <td><strong>${r.flight}</strong></td>
                            <td class="cyan-val">${r.route}</td>
                            <td>${r.pax}</td>
                            <td class="gold-val"><strong>${r.factW} кг</strong></td>
                            <td style="opacity: 0.75;">${r.oldW} кг</td>
                            <td class="highlight-green"><strong>${r.newW} кг</strong></td>
                            <td class="${diffColor} font-mono">${diffSign} кг</td>
                        </tr>
                    `;
                });
                tbody.innerHTML = html;
            }
        }
    }

    setTimeout(processBatch, 50);
}


