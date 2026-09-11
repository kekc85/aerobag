<?php
// AeroBag Predictor - Backend API for MySQL Synchronization, RBAC & Automated Backups
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

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

    // Автоматическая самоинициализация таблиц и первого администратора при обращении
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
    // --- АВТОРИЗАЦИЯ И СЕССИЯ ---
    case 'login':
        handleLogin($pdo);
        break;

    case 'logout':
        handleLogout($pdo);
        break;

    case 'check_auth':
        handleCheckAuth($pdo);
        break;

    // --- УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ (ТОЛЬКО ADMIN) ---
    case 'get_users':
        requireAdmin();
        handleGetUsers($pdo);
        break;

    case 'create_user':
        requireAdmin();
        handleCreateUser($pdo);
        break;

    case 'update_user':
        requireAdmin();
        handleUpdateUser($pdo);
        break;

    case 'change_password':
        handleChangePassword($pdo);
        break;

    case 'delete_user':
        requireAdmin();
        handleDeleteUser($pdo);
        break;

    // --- РЕЙСЫ (ПРОГНОЗИРОВАНИЕ И БАЗА) ---
    case 'get_flights':
        requireAuth();
        handleGetFlights($pdo);
        break;

    case 'save_flights':
        requireAdmin();
        handleSaveFlights($pdo);
        break;

    case 'delete_flight':
        requireAdmin();
        handleDeleteFlight($pdo);
        break;

    case 'clear_db':
        requireAdmin();
        handleClearDb($pdo);
        break;

    // --- УПРАВЛЕНИЕ РЕЗЕРВНЫМИ КОПИЯМИ (ТОЛЬКО ADMIN) ---
    case 'list_backups':
        requireAdmin();
        checkAndPerformDailyAutoBackup($pdo);
        handleListBackups();
        break;

    case 'create_backup':
        requireAdmin();
        handleCreateBackup($pdo);
        break;

    case 'delete_backup':
        requireAdmin();
        handleDeleteBackup($pdo);
        break;

    case 'download_backup':
        requireAdmin();
        handleDownloadBackup($pdo);
        break;

    case 'restore_backup':
        requireAdmin();
        handleRestoreBackup($pdo);
        break;

    // --- ЛОГИ, АУДИТ И МОНИТОРИНГ ОШИБОК (ТОЛЬКО ADMIN) ---
    case 'get_logs':
        requireAdmin();
        rotateSystemLogs($pdo);
        handleGetLogs($pdo);
        break;

    case 'set_log_retention':
        requireAdmin();
        handleSetLogRetention($pdo);
        break;

    case 'clear_logs':
        requireAdmin();
        handleClearLogs($pdo);
        break;

    case 'export_logs':
        requireAdmin();
        handleExportLogs($pdo);
        break;

    case 'log_client_error':
        handleLogClientError($pdo);
        break;

    // --- НАСТРОЙКИ СИСТЕМЫ (ФИЛЬТРЫ ГОРОДОВ И АЭРОПОРТОВ) ---
    case 'health':
        handleHealthCheck($pdo);
        break;

    case 'get_telegram_settings':
        handleGetTelegramSettings($pdo);
        break;

    case 'save_telegram_settings':
        handleSaveTelegramSettings($pdo);
        break;

    case 'test_telegram':
        handleTestTelegram($pdo);
        break;

    case 'log_error':
        handleLogClientError($pdo);
        break;

    case 'get_audit_logs':
        handleGetSystemLogs($pdo);
        break;

    case 'system_diagnostics':
        handleSystemDiagnostics($pdo);
        break;

    case 'get_settings':
        handleGetSettings($pdo);
        break;

    case 'save_settings':
        requireAdmin();
        handleSaveSettings($pdo);
        break;

    default:
        echo json_encode([
            'success' => false,
            'error' => 'Неверное действие (action)'
        ], JSON_UNESCAPED_UNICODE);
        break;
}

/**
 * Проверка авторизации
 */
function requireAuth() {
    if (empty($_SESSION['user_id'])) {
        echo json_encode([
            'success' => false,
            'unauthorized' => true,
            'error' => 'Требуется авторизация в системе.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

/**
 * Проверка прав администратора
 */
function requireAdmin() {
    requireAuth();
    if (empty($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        echo json_encode([
            'success' => false,
            'forbidden' => true,
            'error' => 'Доступ запрещен. Требуются права Администратора.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

/**
 * Автоматическая инициализация структуры БД, первого администратора и защищенной папки бэкапов
 */
function initDatabase($pdo) {
    // 1. Таблица рейсов
    $sqlFlights = "CREATE TABLE IF NOT EXISTS flights (
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
    $pdo->exec($sqlFlights);

    // 2. Таблица пользователей
    $sqlUsers = "CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role ENUM('admin', 'dispatcher') NOT NULL DEFAULT 'dispatcher',
        is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sqlUsers);

    // 3. Таблица настроек системы (фильтры городов и параметры)
    $sqlSettings = "CREATE TABLE IF NOT EXISTS app_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sqlSettings);

    // 4. Таблица системных логов и аудита действий (с настраиваемой ротацией 7/15/30 дней)
    $sqlLogs = "CREATE TABLE IF NOT EXISTS system_logs (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        level ENUM('INFO', 'WARNING', 'ERROR') NOT NULL DEFAULT 'INFO',
        category VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        details JSON NULL,
        user_id VARCHAR(50) NULL,
        username VARCHAR(50) NULL,
        role VARCHAR(20) NULL,
        ip_address VARCHAR(45) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_created_at (created_at),
        INDEX idx_level (level),
        INDEX idx_category (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sqlLogs);

    // 5. Автосоздание первого Главного Администратора (если таблица пуста)
    $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
    $adminCount = $stmt->fetchColumn();
    if ($adminCount == 0) {
        $defaultAdminId = 'usr_admin_' . substr(md5(uniqid()), 0, 8);
        $defaultUsername = 'admin';
        $defaultPassHash = password_hash('AeroBag#2026!Master', PASSWORD_BCRYPT);
        $defaultFullName = 'Главный Администратор';
        
        $insertAdmin = $pdo->prepare("INSERT INTO users (id, username, password_hash, full_name, role, is_active) 
                                      VALUES (?, ?, ?, ?, 'admin', 1)");
        $insertAdmin->execute([$defaultAdminId, $defaultUsername, $defaultPassHash, $defaultFullName]);
    }

    // 6. Создание защищенной папки backups/ с .htaccess
    $backupDir = __DIR__ . '/backups';
    if (!is_dir($backupDir)) {
        @mkdir($backupDir, 0755, true);
    }
    $htaccessPath = $backupDir . '/.htaccess';
    $htaccessContent = "# Защита папки резервных копий от прямого HTTP-доступа (Apache 2.2 / 2.4)\n<IfModule mod_authz_core.c>\n    Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n    Order Deny,Allow\n    Deny from all\n</IfModule>\n";
    @file_put_contents($htaccessPath, $htaccessContent);

    // 7. Создание защищенной папки logs/ с .htaccess для аварийных логов
    $logsDir = __DIR__ . '/logs';
    if (!is_dir($logsDir)) {
        @mkdir($logsDir, 0755, true);
    }
    $logsHtaccess = $logsDir . '/.htaccess';
    if (!file_exists($logsHtaccess)) {
        @file_put_contents($logsHtaccess, "# Защита папки логов от прямого HTTP-доступа\n<IfModule mod_authz_core.c>\n    Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n    Order Deny,Allow\n    Deny from all\n</IfModule>\n");
    }
}

/**
 * Аутентификация пользователя
 */
function handleLogin($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = trim($input['username'] ?? '');
    $password = $input['password'] ?? '';

    if (empty($username) || empty($password)) {
        echo json_encode([
            'success' => false,
            'error' => 'Введите логин и пароль.'
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Защита от перебора паролей (Rate limiting / Brute-force delay)
    if (!isset($_SESSION['login_failed_attempts'])) {
        $_SESSION['login_failed_attempts'] = 0;
    }
    if ($_SESSION['login_failed_attempts'] >= 5) {
        // Если более 5 неудачных попыток подряд - задержка 1 секунда
        sleep(1);
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? LIMIT 1");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        $_SESSION['login_failed_attempts']++;
        usleep(300000); // 300ms искусственная задержка от тайминг-атак
        logSystemEvent($pdo, 'WARNING', 'AUTH', "Неудачная попытка входа: логин '{$username}'");
        echo json_encode([
            'success' => false,
            'error' => 'Неверный логин или пароль.'
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Сброс счетчика неудачных попыток при успешном входе
    $_SESSION['login_failed_attempts'] = 0;

    if ((int)$user['is_active'] !== 1) {
        logSystemEvent($pdo, 'WARNING', 'AUTH', "Попытка входа в заблокированную учетную запись: '{$username}'");
        echo json_encode([
            'success' => false,
            'error' => 'Учетная запись заблокирована. Обратитесь к администратору.'
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Обновляем время последнего входа
    $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?")->execute([$user['id']]);

    // Записываем сессию
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['full_name'] = $user['full_name'];
    $_SESSION['role'] = $user['role'];

    logSystemEvent($pdo, 'INFO', 'AUTH', "Успешный вход в систему: {$user['username']} ({$user['full_name']}, роль: {$user['role']})");

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'full_name' => $user['full_name'],
            'role' => $user['role']
        ]
    ], JSON_UNESCAPED_UNICODE);
}

/**
 * Завершение сессии (Logout)
 */
function handleLogout($pdo = null) {
    if (isset($_SESSION['username'])) {
        logSystemEvent($pdo, 'INFO', 'AUTH', "Выход из системы пользователя {$_SESSION['username']}");
    }
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();

    echo json_encode([
        'success' => true,
        'message' => 'Сессия завершена.'
    ], JSON_UNESCAPED_UNICODE);
}

/**
 * Проверка текущей сессии
 */
function handleCheckAuth($pdo) {
    if (empty($_SESSION['user_id'])) {
        echo json_encode([
            'success' => true,
            'authenticated' => false
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    $stmt = $pdo->prepare("SELECT id, username, full_name, role, is_active FROM users WHERE id = ? LIMIT 1");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();

    if (!$user || (int)$user['is_active'] !== 1) {
        session_destroy();
        echo json_encode([
            'success' => true,
            'authenticated' => false
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Синхронизируем роль
    $_SESSION['role'] = $user['role'];
    $_SESSION['full_name'] = $user['full_name'];

    echo json_encode([
        'success' => true,
        'authenticated' => true,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'full_name' => $user['full_name'],
            'role' => $user['role']
        ]
    ], JSON_UNESCAPED_UNICODE);
}

/**
 * Список пользователей (Admin)
 */
function handleGetUsers($pdo) {
    try {
        $stmt = $pdo->query("SELECT id, username, full_name, role, is_active, created_at, last_login FROM users ORDER BY role ASC, full_name ASC");
        $users = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'users' => $users
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка получения пользователей: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Создание пользователя (Admin)
 */
function handleCreateUser($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = trim($input['username'] ?? '');
    $password = $input['password'] ?? '';
    $fullName = trim($input['full_name'] ?? '');
    $role = in_array($input['role'] ?? '', ['admin', 'dispatcher']) ? $input['role'] : 'dispatcher';

    if (empty($username) || empty($password) || empty($fullName)) {
        echo json_encode([
            'success' => false,
            'error' => 'Заполните все обязательные поля (Логин, Пароль, ФИО).'
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Проверка уникальности логина
    $check = $pdo->prepare("SELECT id FROM users WHERE username = ? LIMIT 1");
    $check->execute([$username]);
    if ($check->fetch()) {
        echo json_encode([
            'success' => false,
            'error' => 'Пользователь с таким логином уже существует.'
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    $id = 'usr_' . substr(md5(uniqid()), 0, 10);
    $hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("INSERT INTO users (id, username, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, 1)");
    $stmt->execute([$id, $username, $hash, $fullName, $role]);

    logSystemEvent($pdo, 'INFO', 'AUTH', "Создан новый пользователь: $username ($fullName, роль: $role)");

    echo json_encode([
        'success' => true,
        'message' => 'Пользователь успешно создан.'
    ], JSON_UNESCAPED_UNICODE);
}

/**
 * Обновление пользователя (Admin)
 */
function handleUpdateUser($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? '';
    $fullName = trim($input['full_name'] ?? '');
    $role = in_array($input['role'] ?? '', ['admin', 'dispatcher']) ? $input['role'] : 'dispatcher';
    $isActive = isset($input['is_active']) ? ((int)$input['is_active'] ? 1 : 0) : 1;

    if (empty($id) || empty($fullName)) {
        echo json_encode([
            'success' => false,
            'error' => 'Не указан ID или ФИО пользователя.'
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Защита от блокировки самого себя
    if ($id === $_SESSION['user_id'] && $isActive === 0) {
        echo json_encode([
            'success' => false,
            'error' => 'Нельзя заблокировать свою собственную учетную запись.'
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    $stmt = $pdo->prepare("UPDATE users SET full_name = ?, role = ?, is_active = ? WHERE id = ?");
    $stmt->execute([$fullName, $role, $isActive, $id]);

    logSystemEvent($pdo, 'INFO', 'AUTH', "Обновлены данные пользователя ID $id: $fullName (роль: $role, статус: " . ($isActive ? 'активен' : 'заблокирован') . ")");

    echo json_encode([
        'success' => true,
        'message' => 'Данные пользователя обновлены.'
    ], JSON_UNESCAPED_UNICODE);
}

/**
 * Смена пароля пользователя (Admin или самого себя)
 */
function handleChangePassword($pdo) {
    requireAuth();
    $input = json_decode(file_get_contents('php://input'), true);
    $userId = $input['id'] ?? $_SESSION['user_id'];
    $newPassword = $input['new_password'] ?? '';

    if (empty($newPassword) || strlen($newPassword) < 4) {
        echo json_encode([
            'success' => false,
            'error' => 'Пароль должен содержать не менее 4 символов.'
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Менять чужой пароль может только Администратор
    if ($userId !== $_SESSION['user_id'] && $_SESSION['role'] !== 'admin') {
        echo json_encode([
            'success' => false,
            'error' => 'Недостаточно прав для смены пароля другого пользователя.'
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    $hash = password_hash($newPassword, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
    $stmt->execute([$hash, $userId]);

    logSystemEvent($pdo, 'INFO', 'AUTH', "Сменен пароль пользователя ID $userId");

    echo json_encode([
        'success' => true,
        'message' => 'Пароль успешно изменен.'
    ], JSON_UNESCAPED_UNICODE);
}

/**
 * Удаление пользователя (Admin)
 */
function handleDeleteUser($pdo) {
    $id = $_GET['id'] ?? '';
    if (empty($id)) {
        echo json_encode(['success' => false, 'error' => 'Не указан ID пользователя.'], JSON_UNESCAPED_UNICODE);
        return;
    }

    if ($id === $_SESSION['user_id']) {
        echo json_encode(['success' => false, 'error' => 'Нельзя удалить свою собственную учетную запись.'], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Проверка, что это не последний администратор
    $checkAdmin = $pdo->prepare("SELECT role, username FROM users WHERE id = ?");
    $checkAdmin->execute([$id]);
    $userToDelete = $checkAdmin->fetch();
    if ($userToDelete && $userToDelete['role'] === 'admin') {
        $count = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
        if ($count <= 1) {
            echo json_encode(['success' => false, 'error' => 'Нельзя удалить последнего администратора в системе.'], JSON_UNESCAPED_UNICODE);
            return;
        }
    }

    $deletedName = $userToDelete['username'] ?? $id;
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$id]);

    logSystemEvent($pdo, 'INFO', 'AUTH', "Удален пользователь $deletedName (ID: $id)");

    echo json_encode([
        'success' => true,
        'message' => 'Пользователь успешно удален.'
    ], JSON_UNESCAPED_UNICODE);
}

/**
 * Получение списка рейсов
 */
function handleGetFlights($pdo) {
    checkAndPerformDailyAutoBackup($pdo);
    try {
        $stmt = $pdo->query("SELECT * FROM flights ORDER BY flight_date DESC, created_at DESC");
        $rows = $stmt->fetchAll();

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
            $id = isset($f['id']) ? $f['id'] : ('srv_' . uniqid() . '_' . rand(100, 999));
            $airline = isset($f['airline']) ? $f['airline'] : 'N4';
            $flight_no = isset($f['flight_no']) ? $f['flight_no'] : '';
            $flight_date = isset($f['date']) ? $f['date'] : '';
            $airport_from = isset($f['from']) ? $f['from'] : '';
            $airport_to = isset($f['to']) ? $f['to'] : '';
            
            if (empty($flight_no) || empty($flight_date) || empty($airport_from) || empty($airport_to)) {
                continue;
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

        $flightsCount = count($data);
        logSystemEvent($pdo, 'INFO', 'DATABASE', "Синхронизировано рейсов: $flightsCount");

        echo json_encode([
            'success' => true,
            'message' => 'Рейсы успешно синхронизированы с базой данных MySQL.'
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        logSystemEvent($pdo, 'ERROR', 'DATABASE', "Ошибка при сохранении рейсов: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
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
        echo json_encode(['success' => false, 'error' => 'Не указан ID рейса для удаления.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM flights WHERE id = ?");
        $stmt->execute([$id]);

        logSystemEvent($pdo, 'INFO', 'DATABASE', "Удален рейс ID $id из базы данных");

        echo json_encode([
            'success' => true,
            'message' => 'Рейс успешно удален.'
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        logSystemEvent($pdo, 'ERROR', 'DATABASE', "Ошибка при удалении рейса ID $id: " . $e->getMessage());
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
        $count = (int)$pdo->query("SELECT COUNT(*) FROM flights")->fetchColumn();
        $pdo->exec("DELETE FROM flights");

        $adminName = $_SESSION['username'] ?? 'admin';
        logSystemEvent($pdo, 'WARNING', 'DATABASE', "База данных рейсов полностью очищена администратором $adminName ($count рейсов удалено)");

        echo json_encode([
            'success' => true,
            'message' => 'База данных рейсов успешно очищена.'
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        logSystemEvent($pdo, 'ERROR', 'DATABASE', "Ошибка при очистке базы рейсов: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка при очистке базы данных: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Автоматический ежедневный бэкап при активности в приложении (Smart In-App Daily Auto-Backup)
 */
function checkAndPerformDailyAutoBackup($pdo) {
    if (!$pdo) return;
    try {
        $backupDir = __DIR__ . '/backups';
        if (!is_dir($backupDir)) {
            @mkdir($backupDir, 0755, true);
            $htaccessPath = $backupDir . '/.htaccess';
            $htaccessContent = "# Защита папки резервных копий от прямого HTTP-доступа (Apache 2.2 / 2.4)\n<IfModule mod_authz_core.c>\n    Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n    Order Deny,Allow\n    Deny from all\n</IfModule>\n";
            @file_put_contents($htaccessPath, $htaccessContent);
        }

        $todayPrefix = 'aerobag_auto_' . date('Y_m_d_');
        $hasTodayBackup = false;

        if (is_dir($backupDir)) {
            $files = scandir($backupDir);
            foreach ($files as $file) {
                if (strpos($file, $todayPrefix) === 0 && pathinfo($file, PATHINFO_EXTENSION) === 'json') {
                    $hasTodayBackup = true;
                    break;
                }
            }
        }

        // Если сегодня бэкап еще не создавался - автоматически делаем снимок базы
        if (!$hasTodayBackup) {
            $stmt = $pdo->query("SELECT * FROM flights ORDER BY flight_date ASC");
            $rows = $stmt->fetchAll();

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

            $backupData = [
                'backup_version' => '1.0',
                'backup_type' => 'daily_smart_auto',
                'exported_at' => date('c'),
                'flights_count' => count($flights),
                'flights' => $flights
            ];

            $filename = 'aerobag_auto_' . date('Y_m_d_His') . '.json';
            $fullPath = $backupDir . '/' . $filename;
            @file_put_contents($fullPath, json_encode($backupData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

            // Ротация: удаляем бэкапы старше 30 дней
            rotateBackups($backupDir, 30);

            logSystemEvent($pdo, 'INFO', 'BACKUP', "Автоматический ежедневный бэкап: $filename (" . count($flights) . " рейсов)");
        }
    } catch (Exception $e) {
        logSystemEvent($pdo, 'ERROR', 'BACKUP', "Ошибка автобэкапа: " . $e->getMessage());
        error_log("Smart auto-backup error: " . $e->getMessage());
    }
}

/**
 * Ручное удаление конкретного файла резервной копии (Admin)
 */
function handleDeleteBackup($pdo = null) {
    $input = json_decode(file_get_contents('php://input'), true);
    $filename = basename($input['filename'] ?? $_GET['file'] ?? $_POST['file'] ?? '');

    if (empty($filename) || pathinfo($filename, PATHINFO_EXTENSION) !== 'json') {
        echo json_encode(['success' => false, 'error' => 'Неверное имя файла резервной копии.'], JSON_UNESCAPED_UNICODE);
        return;
    }

    $backupDir = __DIR__ . '/backups';
    $fullPath = $backupDir . '/' . $filename;

    if (file_exists($fullPath)) {
        if (@unlink($fullPath)) {
            logSystemEvent($pdo, 'INFO', 'BACKUP', "Удалена резервная копия: $filename");
            echo json_encode(['success' => true, 'message' => 'Резервная копия успешно удалена.'], JSON_UNESCAPED_UNICODE);
        } else {
            logSystemEvent($pdo, 'ERROR', 'BACKUP', "Не удалось удалить файл резервной копии с диска: $filename");
            echo json_encode(['success' => false, 'error' => 'Не удалось удалить файл с сервера.'], JSON_UNESCAPED_UNICODE);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Файл резервной копии не найден.'], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Список резервных копий в папке backups/ (Admin)
 */
function handleListBackups() {
    $backupDir = __DIR__ . '/backups';
    $backups = [];

    if (is_dir($backupDir)) {
        $files = scandir($backupDir);
        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'json') {
                $fullPath = $backupDir . '/' . $file;
                $backups[] = [
                    'filename' => $file,
                    'size' => filesize($fullPath),
                    'created_at' => date('Y-m-d H:i:s', filemtime($fullPath)),
                    'timestamp' => filemtime($fullPath)
                ];
            }
        }
        usort($backups, function($a, $b) {
            return $b['timestamp'] - $a['timestamp'];
        });
    }

    echo json_encode([
        'success' => true,
        'backups' => $backups
    ], JSON_UNESCAPED_UNICODE);
}

/**
 * Создание мгновенной резервной копии базы (Admin)
 */
function handleCreateBackup($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM flights ORDER BY flight_date ASC");
        $rows = $stmt->fetchAll();

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

        $backupData = [
            'backup_version' => '1.0',
            'exported_at' => date('c'),
            'flights_count' => count($flights),
            'flights' => $flights
        ];

        $backupDir = __DIR__ . '/backups';
        if (!is_dir($backupDir)) {
            @mkdir($backupDir, 0755, true);
        }

        $filename = 'aerobag_auto_' . date('Y_m_d_His') . '.json';
        $fullPath = $backupDir . '/' . $filename;

        file_put_contents($fullPath, json_encode($backupData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        // Ротация: удаляем бэкапы старше 30 дней
        rotateBackups($backupDir, 30);

        logSystemEvent($pdo, 'INFO', 'BACKUP', "Создана ручная резервная копия: $filename (" . count($flights) . " рейсов)");

        echo json_encode([
            'success' => true,
            'filename' => $filename,
            'flights_count' => count($flights),
            'message' => 'Резервная копия успешно создана.'
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        logSystemEvent($pdo, 'ERROR', 'BACKUP', "Ошибка создания бэкапа: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка создания бэкапа: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Скачивание резервной копии (Admin)
 */
function handleDownloadBackup($pdo = null) {
    $filename = basename($_GET['file'] ?? '');
    if (empty($filename)) {
        header('HTTP/1.0 400 Bad Request');
        echo json_encode(['success' => false, 'error' => 'Не указано имя файла.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $backupDir = __DIR__ . '/backups';
    $fullPath = $backupDir . '/' . $filename;

    if (!file_exists($fullPath) || pathinfo($fullPath, PATHINFO_EXTENSION) !== 'json') {
        header('HTTP/1.0 404 Not Found');
        echo json_encode(['success' => false, 'error' => 'Файл бэкапа не найден.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    logSystemEvent($pdo, 'INFO', 'BACKUP', "Скачан файл резервной копии: $filename");

    header('Content-Type: application/json; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . filesize($fullPath));
    readfile($fullPath);
    exit;
}

/**
 * Восстановление базы из сохраненного файла бэкапа на сервере (Admin)
 */
function handleRestoreBackup($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $filename = basename($input['filename'] ?? '');

    if (empty($filename)) {
        echo json_encode(['success' => false, 'error' => 'Не указан файл бэкапа для восстановления.'], JSON_UNESCAPED_UNICODE);
        return;
    }

    $backupDir = __DIR__ . '/backups';
    $fullPath = $backupDir . '/' . $filename;

    if (!file_exists($fullPath)) {
        echo json_encode(['success' => false, 'error' => 'Указанный файл резервной копии не найден.'], JSON_UNESCAPED_UNICODE);
        return;
    }

    $content = file_get_contents($fullPath);
    $data = json_decode($content, true);
    $flights = $data['flights'] ?? [];

    if (!is_array($flights) || empty($flights)) {
        echo json_encode(['success' => false, 'error' => 'Файл резервной копии пуст или поврежден.'], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {
        $pdo->beginTransaction();
        $pdo->exec("DELETE FROM flights");

        $sql = "INSERT INTO flights (
                    id, airline, flight_no, flight_date, airport_from, airport_to, 
                    men, women, rb, rm, pax, bag_pcs, bag_weight, hb_weight, source, active
                ) VALUES (
                    :id, :airline, :flight_no, :flight_date, :airport_from, :airport_to, 
                    :men, :women, :rb, :rm, :pax, :bag_pcs, :bag_weight, :hb_weight, :source, :active
                )";
        $stmt = $pdo->prepare($sql);

        foreach ($flights as $f) {
            $id = isset($f['id']) ? $f['id'] : ('srv_' . uniqid() . '_' . rand(100, 999));
            $airline = isset($f['airline']) ? $f['airline'] : 'N4';
            $flight_no = isset($f['flight_no']) ? $f['flight_no'] : '';
            $flight_date = isset($f['date']) ? $f['date'] : '';
            $airport_from = isset($f['from']) ? $f['from'] : '';
            $airport_to = isset($f['to']) ? $f['to'] : '';

            if (empty($flight_no) || empty($flight_date) || empty($airport_from) || empty($airport_to)) {
                continue;
            }

            $men = isset($f['men']) ? (int)$f['men'] : 0;
            $women = isset($f['women']) ? (int)$f['women'] : 0;
            $rb = isset($f['rb']) ? (int)$f['rb'] : 0;
            $rm = isset($f['rm']) ? (int)$f['rm'] : 0;
            $pax = isset($f['pax']) ? (int)$f['pax'] : ($men + $women + $rb + $rm);
            $bag_pcs = isset($f['bag_pcs']) ? (int)$f['bag_pcs'] : 0;
            $bag_weight = isset($f['bag_weight']) ? (float)$f['bag_weight'] : 0.0;
            $hb_weight = isset($f['hb_weight']) ? (float)$f['hb_weight'] : 0.0;
            $source = isset($f['source']) ? $f['source'] : 'backup_restore';
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

        $restoredCount = count($flights);
        logSystemEvent($pdo, 'WARNING', 'BACKUP', "База рейсов восстановлена из бэкапа: $filename ($restoredCount рейсов)");

        echo json_encode([
            'success' => true,
            'restored_count' => $restoredCount,
            'message' => 'База данных успешно восстановлена из резервной копии.'
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        logSystemEvent($pdo, 'ERROR', 'BACKUP', "Ошибка при восстановлении базы из бэкапа $filename: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка при восстановлении базы: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Автоудаление старых бэкапов (храним последние $daysCount дней)
 */
function rotateBackups($dir, $daysCount = 30) {
    if (!is_dir($dir)) return;
    $files = scandir($dir);
    $cutoff = time() - ($daysCount * 86400);

    foreach ($files as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'json') {
            $path = $dir . '/' . $file;
            if (filemtime($path) < $cutoff) {
                @unlink($path);
            }
        }
    }
}

/**
 * Получение системных настроек (например, фильтров городов)
 */
function handleGetSettings($pdo) {
    $key = $_GET['key'] ?? '';
    try {
        if (!empty($key)) {
            $stmt = $pdo->prepare("SELECT setting_value FROM app_settings WHERE setting_key = ? LIMIT 1");
            $stmt->execute([$key]);
            $val = $stmt->fetchColumn();
            $data = $val ? json_decode($val, true) : null;

            echo json_encode([
                'success' => true,
                'key' => $key,
                'value' => $data
            ], JSON_UNESCAPED_UNICODE);
        } else {
            $stmt = $pdo->query("SELECT setting_key, setting_value FROM app_settings");
            $rows = $stmt->fetchAll();
            $settings = [];
            foreach ($rows as $r) {
                $settings[$r['setting_key']] = json_decode($r['setting_value'], true);
            }
            echo json_encode([
                'success' => true,
                'settings' => $settings
            ], JSON_UNESCAPED_UNICODE);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка получения настроек: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Сохранение системных настроек (Admin)
 */
function handleSaveSettings($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $key = trim($input['setting_key'] ?? '');
    $value = $input['setting_value'] ?? null;

    if (empty($key)) {
        echo json_encode(['success' => false, 'error' => 'Не указан ключ настройки.'], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {
        $jsonVal = json_encode($value, JSON_UNESCAPED_UNICODE);
        $stmt = $pdo->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) 
                               ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
        $stmt->execute([$key, $jsonVal]);

        logSystemEvent($pdo, 'INFO', 'SYSTEM', "Сохранена системная настройка: $key");

        echo json_encode([
            'success' => true,
            'message' => 'Настройка успешно сохранена.'
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        logSystemEvent($pdo, 'ERROR', 'SYSTEM', "Ошибка сохранения настройки $key: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка сохранения настройки: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

// --------------------------------------------------------------------------
// ПОДСИСТЕМА АУДИТА, ЛОГИРОВАНИЯ И РОТАЦИИ (7 / 15 / 30 ДНЕЙ)
// --------------------------------------------------------------------------

/**
 * Получение реального IP адреса клиента с учетом прокси
 */
function getClientIpAddress() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip = trim($parts[0]);
    } elseif (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    }
    return substr($ip, 0, 45);
}

/**
 * Централизованная функция логирования системных событий и ошибок
 * 
 * @param PDO|null $pdo Экземпляр подключения к MySQL
 * @param string $level INFO | WARNING | ERROR
 * @param string $category AUTH | DATABASE | IMPORT | BACKUP | FORECAST | CLIENT_JS | SYSTEM
 * @param string $message Описание события
 * @param mixed $details Дополнительный контекст (массив или строка)
 */

// -----------------------------------------------------------------------------
// TELEGRAM ALERTING & NOTIFICATION UTILS
// -----------------------------------------------------------------------------

function checkAntiFlood($cacheKey, $throttleSeconds = 180) {
    $cacheDir = __DIR__ . '/logs';
    if (!is_dir($cacheDir)) {
        @mkdir($cacheDir, 0755, true);
    }
    $cacheFile = $cacheDir . '/.flood_cache.json';
    $cache = [];
    if (file_exists($cacheFile)) {
        $content = @file_get_contents($cacheFile);
        if ($content) {
            $cache = @json_decode($content, true) ?: [];
        }
    }

    $now = time();
    $cleanCache = [];
    foreach ($cache as $k => $ts) {
        if ($now - $ts < 3600) {
            $cleanCache[$k] = $ts;
        }
    }

    if (isset($cleanCache[$cacheKey]) && ($now - $cleanCache[$cacheKey] < $throttleSeconds)) {
        return false;
    }

    $cleanCache[$cacheKey] = $now;
    @file_put_contents($cacheFile, json_encode($cleanCache), LOCK_EX);
    return true;
}

function sendTelegramAlert($message, $pdo = null) {
    try {
        $botToken = '';
        $chatId = '';
        $isEnabled = false;

        if ($pdo) {
            try {
                $stmt = $pdo->prepare("SELECT setting_value FROM app_settings WHERE setting_key = 'telegram_config' LIMIT 1");
                $stmt->execute();
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($row && !empty($row['setting_value'])) {
                    $cfg = json_decode($row['setting_value'], true);
                    if ($cfg) {
                        $botToken = $cfg['bot_token'] ?? '';
                        $chatId = $cfg['chat_id'] ?? '';
                        $isEnabled = !empty($cfg['is_enabled']);
                    }
                }
            } catch (Exception $e) {}
        }

        if (!$isEnabled || empty($botToken) || empty($chatId)) {
            return false;
        }

        $url = "https://api.telegram.org/bot" . urlencode($botToken) . "/sendMessage";
        $postData = json_encode([
            'chat_id' => $chatId,
            'text' => $message,
            'parse_mode' => 'HTML',
            'disable_web_page_preview' => true
        ]);

        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 3);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            $res = curl_exec($ch);
            curl_close($ch);
            return true;
        } else {
            $ctx = stream_context_create([
                'http' => [
                    'method' => 'POST',
                    'header' => "Content-Type: application/json\r\n",
                    'content' => $postData,
                    'timeout' => 3
                ]
            ]);
            @file_get_contents($url, false, $ctx);
            return true;
        }
    } catch (Exception $e) {
        return false;
    }
}

function logSystemEvent($pdo, $level, $category, $message, $details = null) {
    $level = in_array(strtoupper($level), ['INFO', 'WARNING', 'ERROR'], true) ? strtoupper($level) : 'INFO';
    $category = strtoupper(trim($category));
    $userId = $_SESSION['user_id'] ?? null;
    $username = $_SESSION['username'] ?? ($userId ? 'USER' : 'GUEST');
    $role = $_SESSION['role'] ?? 'guest';
    $ip = getClientIpAddress();
    $detailsJson = null;

    if ($details !== null) {
        $detailsJson = is_string($details) ? $details : json_encode($details, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO system_logs (level, category, message, details, user_id, username, role, ip_address) 
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$level, $category, $message, $detailsJson, $userId, $username, $role, $ip]);
            return true;
        } catch (Exception $e) {
            writeEmergencyLog($level, $category, $message, $detailsJson, $username, $ip, $e->getMessage());
        }
    } else {
        writeEmergencyLog($level, $category, $message, $detailsJson, $username, $ip, "No PDO instance");
    }
    return false;
}

/**
 * Запись в аварийный файл emergency.log при сбое MySQL
 */
function writeEmergencyLog($level, $category, $message, $details, $username, $ip, $dbErr = '') {
    $logsDir = __DIR__ . '/logs';
    if (!is_dir($logsDir)) {
        @mkdir($logsDir, 0755, true);
        @file_put_contents($logsDir . '/.htaccess', "# Защита папки логов\n<IfModule mod_authz_core.c>\n    Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n    Order Deny,Allow\n    Deny from all\n</IfModule>\n");
    }
    $line = sprintf("[%s] [%s] [%s] [%s] [%s] %s | Details: %s | DB_Err: %s\n",
        date('Y-m-d H:i:s'),
        $level,
        $category,
        $username,
        $ip,
        $message,
        $details ?: 'none',
        $dbErr ?: 'none'
    );
    @file_put_contents($logsDir . '/emergency.log', $line, FILE_APPEND);
}

/**
 * Получение настройки глубины ротации логов (7, 15 или 30 дней)
 */
function getLogRetentionDays($pdo) {
    if (!$pdo) return 7;
    try {
        $stmt = $pdo->prepare("SELECT setting_value FROM app_settings WHERE setting_key = 'log_retention_days' LIMIT 1");
        $stmt->execute();
        $val = $stmt->fetchColumn();
        if ($val !== false) {
            $parsed = json_decode($val, true);
            $days = is_numeric($parsed) ? (int)$parsed : (int)$val;
            if (in_array($days, [7, 15, 30], true)) {
                return $days;
            }
        }
    } catch (Exception $e) {}
    return 7; // По умолчанию 7 дней
}

/**
 * Автоматическая ротация таблицы логов system_logs
 */
function rotateSystemLogs($pdo) {
    if (!$pdo) return;
    try {
        $days = getLogRetentionDays($pdo);
        $stmt = $pdo->prepare("DELETE FROM system_logs WHERE created_at < NOW() - INTERVAL ? DAY");
        $stmt->execute([$days]);
    } catch (Exception $e) {
        error_log("Rotate system logs error: " . $e->getMessage());
    }
}

/**
 * Получение списка логов с фильтрацией, поиском и пагинацией (Admin)
 */
function handleGetLogs($pdo) {
    $level = trim($_GET['level'] ?? 'all');
    $category = trim($_GET['category'] ?? 'all');
    $search = trim($_GET['search'] ?? '');
    $limit = min(max((int)($_GET['limit'] ?? 200), 10), 1000);
    $offset = max((int)($_GET['offset'] ?? 0), 0);

    try {
        $where = [];
        $params = [];

        if (!empty($level) && $level !== 'all') {
            $where[] = "level = ?";
            $params[] = strtoupper($level);
        }

        if (!empty($category) && $category !== 'all') {
            $where[] = "category = ?";
            $params[] = strtoupper($category);
        }

        if (!empty($search)) {
            $where[] = "(message LIKE ? OR username LIKE ? OR ip_address LIKE ? OR details LIKE ?)";
            $searchTerm = '%' . $search . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereSql = !empty($where) ? ('WHERE ' . implode(' AND ', $where)) : '';

        // Подсчет общего количества отфильтрованных записей
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM system_logs $whereSql");
        $countStmt->execute($params);
        $totalCount = (int)$countStmt->fetchColumn();

        // Сводная статистика за последние 24 часа
        $stats24h = [
            'errors' => 0,
            'warnings' => 0,
            'info' => 0,
            'total' => 0
        ];
        $statStmt = $pdo->query("SELECT level, COUNT(*) as cnt FROM system_logs 
                                 WHERE created_at >= NOW() - INTERVAL 24 HOUR 
                                 GROUP BY level");
        $statRows = $statStmt->fetchAll();
        foreach ($statRows as $row) {
            $lvl = strtolower($row['level']);
            $c = (int)$row['cnt'];
            if ($lvl === 'error') $stats24h['errors'] = $c;
            elseif ($lvl === 'warning') $stats24h['warnings'] = $c;
            elseif ($lvl === 'info') $stats24h['info'] = $c;
            $stats24h['total'] += $c;
        }

        // Общее число всех логов в базе
        $totalAllLogs = (int)$pdo->query("SELECT COUNT(*) FROM system_logs")->fetchColumn();

        // Текущая глубина ротации
        $retentionDays = getLogRetentionDays($pdo);

        // Выборка логов
        $querySql = "SELECT id, level, category, message, details, user_id, username, role, ip_address, created_at 
                     FROM system_logs 
                     $whereSql 
                     ORDER BY created_at DESC 
                     LIMIT $limit OFFSET $offset";
        
        $logStmt = $pdo->prepare($querySql);
        $logStmt->execute($params);
        $logs = $logStmt->fetchAll();

        // Декодируем JSON-детали для удобства фронтенда
        foreach ($logs as &$log) {
            if (!empty($log['details'])) {
                $decoded = json_decode($log['details'], true);
                if ($decoded !== null) {
                    $log['details_parsed'] = $decoded;
                }
            }
        }
        unset($log);

        echo json_encode([
            'success' => true,
            'logs' => $logs,
            'total' => $totalCount,
            'total_all' => $totalAllLogs,
            'limit' => $limit,
            'offset' => $offset,
            'stats_24h' => $stats24h,
            'retention_days' => $retentionDays
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка получения логов: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Установка глубины ротации логов (7, 15 или 30 дней) (Admin)
 */
function handleSetLogRetention($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $days = isset($input['days']) ? (int)$input['days'] : 7;

    if (!in_array($days, [7, 15, 30], true)) {
        echo json_encode([
            'success' => false,
            'error' => 'Недопустимый период ротации. Разрешены значения: 7, 15 или 30 дней.'
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {
        $jsonVal = json_encode($days);
        $stmt = $pdo->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES ('log_retention_days', ?) 
                               ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
        $stmt->execute([$jsonVal]);

        // Немедленно выполняем ротацию под новый период
        rotateSystemLogs($pdo);

        logSystemEvent($pdo, 'INFO', 'SYSTEM', "Администратор {$_SESSION['username']} установил период ротации логов: $days дней");

        echo json_encode([
            'success' => true,
            'retention_days' => $days,
            'message' => "Период хранения логов установлен на $days дней. Ротация выполнена."
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка сохранения периода ротации: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Ручная очистка таблицы логов (Admin)
 */
function handleClearLogs($pdo) {
    try {
        $count = (int)$pdo->query("SELECT COUNT(*) FROM system_logs")->fetchColumn();
        $pdo->exec("DELETE FROM system_logs");

        $adminName = $_SESSION['username'] ?? 'admin';
        logSystemEvent($pdo, 'INFO', 'SYSTEM', "Журнал логов очищен администратором $adminName (удалено $count записей)");

        echo json_encode([
            'success' => true,
            'deleted_count' => $count,
            'message' => "Журнал логов успешно очищен ($count записей удалено)."
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка при очистке журнала логов: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Экспорт логов в файл JSON или TXT (Admin)
 */
function handleExportLogs($pdo) {
    $format = strtolower($_GET['format'] ?? 'json');
    $level = trim($_GET['level'] ?? 'all');
    $category = trim($_GET['category'] ?? 'all');

    try {
        $where = [];
        $params = [];

        if (!empty($level) && $level !== 'all') {
            $where[] = "level = ?";
            $params[] = strtoupper($level);
        }
        if (!empty($category) && $category !== 'all') {
            $where[] = "category = ?";
            $params[] = strtoupper($category);
        }

        $whereSql = !empty($where) ? ('WHERE ' . implode(' AND ', $where)) : '';
        $stmt = $pdo->prepare("SELECT id, level, category, message, details, username, role, ip_address, created_at 
                               FROM system_logs 
                               $whereSql 
                               ORDER BY created_at DESC 
                               LIMIT 5000");
        $stmt->execute($params);
        $logs = $stmt->fetchAll();

        logSystemEvent($pdo, 'INFO', 'SYSTEM', "Администратор {$_SESSION['username']} экспортировал лог-отчет (" . count($logs) . " записей, формат $format)");

        $timestamp = date('Y_m_d_His');

        if ($format === 'txt') {
            $filename = "aerobag_logs_{$timestamp}.txt";
            header('Content-Type: text/plain; charset=utf-8');
            header('Content-Disposition: attachment; filename="' . $filename . '"');

            echo "================================================================================\n";
            echo "AeroBag Predictor - Журнал системных событий и ошибок\n";
            echo "Сформирован: " . date('Y-m-d H:i:s') . " | Пользователь: " . ($_SESSION['username'] ?? 'admin') . "\n";
            echo "Всего записей в выгрузке: " . count($logs) . "\n";
            echo "================================================================================\n\n";

            foreach ($logs as $log) {
                echo sprintf("[%s] [%s] [%s] [%s@%s] %s\n",
                    $log['created_at'],
                    str_pad($log['level'], 7),
                    str_pad($log['category'], 10),
                    $log['username'] ?? 'ANON',
                    $log['ip_address'] ?? '127.0.0.1',
                    $log['message']
                );
                if (!empty($log['details'])) {
                    echo "  -> Details: " . $log['details'] . "\n";
                }
            }
            exit;
        } else {
            $filename = "aerobag_logs_{$timestamp}.json";
            header('Content-Type: application/json; charset=utf-8');
            header('Content-Disposition: attachment; filename="' . $filename . '"');

            $exportData = [
                'app' => 'AeroBag Predictor',
                'exported_at' => date('c'),
                'exported_by' => $_SESSION['username'] ?? 'admin',
                'logs_count' => count($logs),
                'logs' => $logs
            ];

            echo json_encode($exportData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }

    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка экспорта логов: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Логирование клиентских ошибок JavaScript (Frontend runtime error tracking)
 */
function handleLogClientError($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $message = trim($input['message'] ?? '');
    $details = $input['details'] ?? null;
    $level = in_array(strtoupper($input['level'] ?? ''), ['WARNING', 'ERROR'], true) ? strtoupper($input['level']) : 'ERROR';

    if (empty($message)) {
        echo json_encode(['success' => false, 'error' => 'Пустое сообщение об ошибке.'], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Защита от спама (максимум 50 клиентских ошибок в минуту на сессию)
    if (!isset($_SESSION['client_error_count'])) {
        $_SESSION['client_error_count'] = 0;
        $_SESSION['client_error_reset_time'] = time() + 60;
    }
    if (time() > $_SESSION['client_error_reset_time']) {
        $_SESSION['client_error_count'] = 0;
        $_SESSION['client_error_reset_time'] = time() + 60;
    }
    $_SESSION['client_error_count']++;

    if ($_SESSION['client_error_count'] > 50) {
        echo json_encode(['success' => false, 'rate_limited' => true], JSON_UNESCAPED_UNICODE);
        return;
    }

    logSystemEvent($pdo, $level, 'CLIENT_JS', $message, $details);

    echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
}


function handleHealthCheck($pdo) {
    $t0 = microtime(true);
    $dbOk = false;
    $totalFlights = 0;
    $totalUsers = 0;
    
    try {
        if ($pdo) {
            $stmt = $pdo->query("SELECT 1");
            if ($stmt) {
                $dbOk = true;
                $stmtFlt = $pdo->query("SELECT COUNT(*) FROM flights");
                $totalFlights = (int)($stmtFlt ? $stmtFlt->fetchColumn() : 0);
                $stmtUsr = $pdo->query("SELECT COUNT(*) FROM users");
                $totalUsers = (int)($stmtUsr ? $stmtUsr->fetchColumn() : 0);
            }
        }
    } catch (Exception $e) {
        $dbOk = false;
    }
    
    $latencyMs = round((microtime(true) - $t0) * 1000, 2);
    $logsDir = __DIR__ . '/logs';
    $backupsDir = __DIR__ . '/backups';
    
    sendJsonResponse([
        'success' => true,
        'status' => $dbOk ? 'healthy' : 'degraded',
        'latency_ms' => $latencyMs,
        'database' => [
            'connected' => $dbOk,
            'total_flights' => $totalFlights,
            'total_users' => $totalUsers
        ],
        'filesystem' => [
            'logs_writable' => is_dir($logsDir) ? is_writable($logsDir) : is_writable(__DIR__),
            'backups_writable' => is_dir($backupsDir) ? is_writable($backupsDir) : is_writable(__DIR__)
        ],
        'server' => [
            'php_version' => PHP_VERSION,
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ]);
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function handleGetTelegramSettings($pdo) {
    requireAdmin();
    try {
        $stmt = $pdo->prepare("SELECT setting_value FROM app_settings WHERE setting_key = 'telegram_config' LIMIT 1");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $config = ['bot_token' => '', 'chat_id' => '', 'is_enabled' => false];
        if ($row && !empty($row['setting_value'])) {
            $parsed = json_decode($row['setting_value'], true);
            if (is_array($parsed)) {
                $config = array_merge($config, $parsed);
            }
        }
        sendJsonResponse(['success' => true, 'config' => $config]);
    } catch (Exception $e) {
        sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

function handleSaveTelegramSettings($pdo) {
    requireAdmin();
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        sendJsonResponse(['success' => false, 'error' => 'Некорректные входные данные.'], 400);
    }

    $botToken = trim($input['bot_token'] ?? '');
    $chatId = trim($input['chat_id'] ?? '');
    $isEnabled = !empty($input['is_enabled']);

    $config = [
        'bot_token' => $botToken,
        'chat_id' => $chatId,
        'is_enabled' => $isEnabled,
        'updated_at' => date('Y-m-d H:i:s')
    ];

    try {
        $stmt = $pdo->prepare("INSERT INTO app_settings (setting_key, setting_value, updated_at) 
                               VALUES ('telegram_config', :val, NOW()) 
                               ON DUPLICATE KEY UPDATE setting_value = :val2, updated_at = NOW()");
        $val = json_encode($config, JSON_UNESCAPED_UNICODE);
        $stmt->execute([':val' => $val, ':val2' => $val]);

        logSystemEvent($pdo, 'INFO', 'SYSTEM', "Обновлены настройки Telegram-оповещений: статус=" . ($isEnabled ? 'ВКЛ' : 'ВЫКЛ') . ", Chat ID={$chatId}");

        sendJsonResponse(['success' => true, 'config' => $config]);
    } catch (Exception $e) {
        sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

function handleTestTelegram($pdo) {
    requireAdmin();
    $input = json_decode(file_get_contents('php://input'), true);
    $botToken = trim($input['bot_token'] ?? '');
    $chatId = trim($input['chat_id'] ?? '');

    if (empty($botToken) || empty($chatId)) {
        sendJsonResponse(['success' => false, 'error' => 'Укажите токен бота и ID чата.'], 400);
    }

    $timeStr = date('Y-m-d H:i:s (T)');
    $userName = $_SESSION['username'] ?? 'Администратор';
    $message = "🚀 <b>ТЕСТОВОЕ СООБЩЕНИЕ AEROBAG PREDICTOR</b>\n\n" .
               "✅ Связь с Telegram Bot API успешно установлена!\n" .
               "📍 Сервер: <code>" . htmlspecialchars($_SERVER['SERVER_NAME'] ?? 'AeroBag Server') . "</code>\n" .
               "👤 Инициатор: <b>" . htmlspecialchars($userName) . "</b>\n" .
               "⏱ Время сервера: " . $timeStr . "\n\n" .
               "<i>Бот готов к доставке критических алертов и отчетов.</i>";

    $url = "https://api.telegram.org/bot" . urlencode($botToken) . "/sendMessage";
    $postData = json_encode([
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML'
    ]);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    $curlErr = curl_error($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($curlErr) {
        sendJsonResponse(['success' => false, 'error' => 'cURL Error: ' . $curlErr], 500);
    }

    $resData = json_decode($response, true);
    if ($httpCode === 200 && !empty($resData['ok'])) {
        logSystemEvent($pdo, 'INFO', 'SYSTEM', "Успешная проверка отправки тестового сообщения в Telegram (Chat ID: {$chatId})");
        sendJsonResponse(['success' => true, 'result' => $resData['result'] ?? null]);
    } else {
        $desc = $resData['description'] ?? "HTTP {$httpCode}: Неизвестная ошибка Telegram API";
        sendJsonResponse(['success' => false, 'error' => $desc], 400);
    }
}

function handleSystemDiagnostics($pdo) {
    requireAdmin();
    try {
        $dbSizeMb = 0;
        $totalFlights = 0;
        $minDate = null;
        $maxDate = null;
        $airlines = [];

        if ($pdo) {
            $dbName = defined('DB_NAME') ? DB_NAME : '';
            if ($dbName) {
                $stmt = $pdo->prepare("SELECT SUM(data_length + index_length) / 1024 / 1024 AS size_mb 
                                       FROM information_schema.TABLES 
                                       WHERE table_schema = :dbname");
                $stmt->execute([':dbname' => $dbName]);
                $dbSizeMb = round((float)$stmt->fetchColumn(), 2);
            }

            $stmtFlt = $pdo->query("SELECT COUNT(*) AS cnt, MIN(flight_date) AS min_d, MAX(flight_date) AS max_d FROM flights");
            $fltData = $stmtFlt ? $stmtFlt->fetch(PDO::FETCH_ASSOC) : [];
            $totalFlights = (int)($fltData['cnt'] ?? 0);
            $minDate = $fltData['min_d'] ?? '-';
            $maxDate = $fltData['max_d'] ?? '-';

            $stmtAl = $pdo->query("SELECT airline, COUNT(*) AS cnt FROM flights GROUP BY airline ORDER BY cnt DESC");
            $airlines = $stmtAl ? $stmtAl->fetchAll(PDO::FETCH_ASSOC) : [];
        }

        $backupsDir = __DIR__ . '/backups';
        $backupCount = 0;
        $backupSizeMb = 0;
        if (is_dir($backupsDir)) {
            $files = glob($backupsDir . '/*.json');
            $backupCount = count($files);
            foreach ($files as $f) {
                $backupSizeMb += filesize($f);
            }
            $backupSizeMb = round($backupSizeMb / 1024 / 1024, 2);
        }

        $logsDir = __DIR__ . '/logs';
        $logSizeKb = 0;
        $auditCount = 0;
        if (is_dir($logsDir)) {
            $logFiles = glob($logsDir . '/*.log');
            foreach ($logFiles as $lf) {
                $logSizeKb += filesize($lf);
            }
            $logSizeKb = round($logSizeKb / 1024, 1);
        }
        if ($pdo) {
            try {
                $stmtAudit = $pdo->query("SELECT COUNT(*) FROM system_logs");
                if (!$stmtAudit) $stmtAudit = $pdo->query("SELECT COUNT(*) FROM audit_logs");
                $auditCount = (int)($stmtAudit ? $stmtAudit->fetchColumn() : 0);
            } catch (Exception $e) {}
        }

        sendJsonResponse([
            'success' => true,
            'database' => [
                'size_mb' => $dbSizeMb,
                'total_flights' => $totalFlights,
                'min_date' => $minDate,
                'max_date' => $maxDate,
                'airlines' => $airlines
            ],
            'backups' => [
                'count' => $backupCount,
                'size_mb' => $backupSizeMb
            ],
            'logs' => [
                'errors_size_kb' => $logSizeKb,
                'audit_events_count' => $auditCount
            ],
            'server' => [
                'php_version' => PHP_VERSION,
                'os' => PHP_OS,
                'memory_limit' => ini_get('memory_limit')
            ]
        ]);
    } catch (Exception $e) {
        sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
}


