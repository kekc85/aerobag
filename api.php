<?php
// AeroBag Predictor - Backend API for MySQL Synchronization
header('Content-Type: application/json; charset=utf-8');

// Отключение вывода ошибок в HTML, чтобы не ломать JSON-ответы
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Подключаем файл конфигурации
$configPath = __DIR__ . '/db_config.php';
if (!file_exists($configPath)) {
    echo json_encode([
        'success' => false,
        'error' => 'Файл конфигурации db_config.php отсутствует. Пожалуйста, создайте его на основе шаблона.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once $configPath;

// Проверка дефолтных настроек
if (DB_USER === 'your_db_username' || DB_NAME === 'your_db_name') {
    echo json_encode([
        'success' => false,
        'db_not_configured' => true,
        'error' => 'База данных еще не настроена. Пожалуйста, укажите реквизиты доступа в файле db_config.php.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Подключение к MySQL через PDO
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);

    // Автоматическая инициализация таблицы при первом обращении
    initDatabase($pdo);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка подключения к базе данных: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Маршрутизация запросов
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'get_flights':
        handleGetFlights($pdo);
        break;

    case 'save_flights':
        handleSaveFlights($pdo);
        break;

    case 'delete_flight':
        handleDeleteFlight($pdo);
        break;

    case 'clear_db':
        handleClearDb($pdo);
        break;

    default:
        echo json_encode([
            'success' => false,
            'error' => 'Неверное действие (action)'
        ], JSON_UNESCAPED_UNICODE);
        break;
}

/**
 * Инициализация структуры БД
 */
function initDatabase($pdo) {
    $sql = "CREATE TABLE IF NOT EXISTS flights (
        id VARCHAR(100) PRIMARY KEY,
        airline VARCHAR(10) NOT NULL,
        flight_no VARCHAR(20) NOT NULL,
        flight_date DATE NOT NULL,
        airport_from VARCHAR(10) NOT NULL,
        airport_to VARCHAR(10) NOT NULL,
        men INT DEFAULT 0,
        women INT DEFAULT 0,
        rb INT DEFAULT 0,
        rm INT DEFAULT 0,
        pax INT DEFAULT 0,
        bag_pcs INT DEFAULT 0,
        bag_weight DECIMAL(10, 2) DEFAULT 0.00,
        hb_weight DECIMAL(10, 2) DEFAULT 0.00,
        source VARCHAR(255) DEFAULT '',
        active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_flight (flight_no, flight_date, airport_from, airport_to)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $pdo->exec($sql);
}

/**
 * Получение списка рейсов
 */
function handleGetFlights($pdo) {
    try {
        // Запрашиваем все рейсы. Сортировка по дате (сначала свежие)
        $stmt = $pdo->query("SELECT * FROM flights ORDER BY flight_date DESC, created_at DESC");
        $rows = $stmt->fetchAll();

        // Преобразование формата БД во формат JSON-объекта приложения
        $flights = [];
        foreach ($rows as $row) {
            $flights[] = [
                'id' => $row['id'],
                'airline' => $row['airline'],
                'flight_no' => $row['flight_no'],
                'date' => $row['flight_date'],
                'from' => $row['airport_from'],
                'to' => $row['airport_to'],
                'men' => (int)$row['men'],
                'women' => (int)$row['women'],
                'rb' => (int)$row['rb'],
                'rm' => (int)$row['rm'],
                'pax' => (int)$row['pax'],
                'bag_pcs' => (int)$row['bag_pcs'],
                'bag_weight' => (float)$row['bag_weight'],
                'hb_weight' => (float)$row['hb_weight'],
                'source' => $row['source'],
                'active' => (bool)$row['active']
            ];
        }

        echo json_encode([
            'success' => true,
            'flights' => $flights
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка при получении рейсов: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Сохранение / обновление массива рейсов (UPSERT)
 */
function handleSaveFlights($pdo) {
    // Читаем JSON-тело запроса
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!is_array($data)) {
        echo json_encode([
            'success' => false,
            'error' => 'Неверный формат данных. Ожидался JSON-массив.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    try {
        // Используем транзакцию для многократного ускорения пакетной вставки (Excel-файлы)
        $pdo->beginTransaction();

        $sql = "INSERT INTO flights (
                    id, airline, flight_no, flight_date, airport_from, airport_to, 
                    men, women, rb, rm, pax, bag_pcs, bag_weight, hb_weight, source, active
                ) VALUES (
                    :id, :airline, :flight_no, :flight_date, :airport_from, :airport_to, 
                    :men, :women, :rb, :rm, :pax, :bag_pcs, :bag_weight, :hb_weight, :source, :active
                )
                ON DUPLICATE KEY UPDATE 
                    airline = VALUES(airline),
                    men = VALUES(men),
                    women = VALUES(women),
                    rb = VALUES(rb),
                    rm = VALUES(rm),
                    pax = VALUES(pax),
                    bag_pcs = VALUES(bag_pcs),
                    bag_weight = VALUES(bag_weight),
                    hb_weight = VALUES(hb_weight),
                    source = VALUES(source),
                    active = VALUES(active)";

        $stmt = $pdo->prepare($sql);

        foreach ($data as $f) {
            // Валидация полей
            $id = isset($f['id']) ? $f['id'] : ('srv_' . uniqid() . '_' . rand(100, 999));
            $airline = isset($f['airline']) ? $f['airline'] : 'N4';
            $flight_no = isset($f['flight_no']) ? $f['flight_no'] : '';
            $flight_date = isset($f['date']) ? $f['date'] : '';
            $airport_from = isset($f['from']) ? $f['from'] : '';
            $airport_to = isset($f['to']) ? $f['to'] : '';
            
            if (empty($flight_no) || empty($flight_date) || empty($airport_from) || empty($airport_to)) {
                continue; // Пропускаем некорректные записи
            }

            $men = isset($f['men']) ? (int)$f['men'] : 0;
            $women = isset($f['women']) ? (int)$f['women'] : 0;
            $rb = isset($f['rb']) ? (int)$f['rb'] : 0;
            $rm = isset($f['rm']) ? (int)$f['rm'] : 0;
            $pax = isset($f['pax']) ? (int)$f['pax'] : ($men + $women + $rb + $rm);
            $bag_pcs = isset($f['bag_pcs']) ? (int)$f['bag_pcs'] : 0;
            $bag_weight = isset($f['bag_weight']) ? (float)$f['bag_weight'] : 0.0;
            $hb_weight = isset($f['hb_weight']) ? (float)$f['hb_weight'] : 0.0;
            $source = isset($f['source']) ? $f['source'] : 'manual';
            $active = isset($f['active']) ? ($f['active'] ? 1 : 0) : 1;

            $stmt->execute([
                ':id' => $id,
                ':airline' => $airline,
                ':flight_no' => $flight_no,
                ':flight_date' => $flight_date,
                ':airport_from' => $airport_from,
                ':airport_to' => $airport_to,
                ':men' => $men,
                ':women' => $women,
                ':rb' => $rb,
                ':rm' => $rm,
                ':pax' => $pax,
                ':bag_pcs' => $bag_pcs,
                ':bag_weight' => $bag_weight,
                ':hb_weight' => $hb_weight,
                ':source' => $source,
                ':active' => $active
            ]);
        }

        $pdo->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Рейсы успешно синхронизированы с базой данных MySQL.'
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка при сохранении рейсов: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Удаление одного рейса
 */
function handleDeleteFlight($pdo) {
    $id = isset($_GET['id']) ? $_GET['id'] : '';
    if (empty($id)) {
        echo json_encode([
            'success' => false,
            'error' => 'Не указан ID рейса для удаления.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM flights WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode([
            'success' => true,
            'message' => 'Рейс успешно удален.'
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка при удалении рейса: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Полная очистка базы данных рейсов
 */
function handleClearDb($pdo) {
    try {
        $pdo->exec("DELETE FROM flights"); // DELETE быстрее TRUNCATE в транзакциях и безопаснее в ряде хостингов

        echo json_encode([
            'success' => true,
            'message' => 'База данных рейсов успешно очищена.'
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка при очистке базы данных: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}
