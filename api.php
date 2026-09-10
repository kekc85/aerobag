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
        handleLogout();
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
        handleDeleteBackup();
        break;

    case 'download_backup':
        requireAdmin();
        handleDownloadBackup();
        break;

    case 'restore_backup':
        requireAdmin();
        handleRestoreBackup($pdo);
        break;

    // --- НАСТРОЙКИ СИСТЕМЫ (ФИЛЬТРЫ ГОРОДОВ И АЭРОПОРТОВ) ---
    case 'get_settings':
        handleGetSettings($pdo);
        break;

    case 'save_settings':
        requireAdmin();
        handleSaveSettings($pdo);
        break;

    // --- МОНИТОРИНГ, HEALTH CHECK И TELEGRAM-УВЕДОМЛЕНИЯ ---
    case 'health':
        handleHealthCheck($pdo);
        break;

    case 'get_telegram_settings':
        requireAdmin();
        handleGetTelegramSettings($pdo);
        break;

    case 'save_telegram_settings':
        requireAdmin();
        handleSaveTelegramSettings($pdo);
        break;

    case 'test_telegram':
        requireAdmin();
        handleTestTelegram($pdo);
        break;

    case 'log_error':
        handleLogError($pdo);
        break;

    // --- ЖУРНАЛ АУДИТА ДЕЙСТВИЙ И ДИАГНОСТИКА СИСТЕМЫ ---
    case 'get_audit_logs':
        requireAdmin();
        handleGetAuditLogs($pdo);
        break;

    case 'system_diagnostics':
        requireAdmin();
        handleSystemDiagnostics($pdo);
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

    // 4. Таблица журнала аудита действий (Audit Trail)
    $sqlAudit = "CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50) DEFAULT NULL,
        username VARCHAR(50) NOT NULL,
        event_type VARCHAR(50) NOT NULL,
        event_desc TEXT NOT NULL,
        entity_type VARCHAR(50) DEFAULT NULL,
        entity_id VARCHAR(100) DEFAULT NULL,
        ip_address VARCHAR(45) NOT NULL,
        user_agent VARCHAR(255) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_audit_time (created_at),
        INDEX idx_audit_user (username),
        INDEX idx_audit_event (event_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sqlAudit);

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
    $htaccessBackupPath = $backupDir . '/.htaccess';
    $htaccessContent = "# Защита от прямого HTTP-доступа (Apache 2.2 / 2.4)\n<IfModule mod_authz_core.c>\n    Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n    Order Deny,Allow\n    Deny from all\n</IfModule>\n";
    @file_put_contents($htaccessBackupPath, $htaccessContent);

    // 7. Создание защищенной папки logs/ с .htaccess
    $logsDir = __DIR__ . '/logs';
    if (!is_dir($logsDir)) {
        @mkdir($logsDir, 0755, true);
    }
    $htaccessLogsPath = $logsDir . '/.htaccess';
    @file_put_contents($htaccessLogsPath, $htaccessContent);
}

/**
 * Логирование событий в Журнал Аудита (Audit Trail)
 */
function logAuditEvent($pdo, $eventType, $eventDesc, $entityType = null, $entityId = null) {
    try {
        $userId = $_SESSION['user_id'] ?? null;
        $username = $_SESSION['username'] ?? 'anonymous';
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255);

        $stmt = $pdo->prepare("INSERT INTO audit_logs (user_id, username, event_type, event_desc, entity_type, entity_id, ip_address, user_agent) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $username, $eventType, $eventDesc, $entityType, $entityId, $ip, $ua]);

        // Автоочистка записей старше 90 дней (с вероятностью 1 к 50)
        if (mt_rand(1, 50) === 1) {
            $pdo->exec("DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL 90 DAY");
        }
    } catch (Exception $e) {
        // Ошибки аудита не прерывают основной поток выполнения
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
        logAuditEvent($pdo, 'AUTH_FAILED', "Неудачная попытка входа для пользователя: {$username}", 'user', $username);
        usleep(300000); // 300ms искусственная задержка от тайминг-атак
        echo json_encode([
            'success' => false,
            'error' => 'Неверный логин или пароль.'
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Сброс счетчика неудачных попыток при успешном входе
    $_SESSION['login_failed_attempts'] = 0;

    if ((int)$user['is_active'] !== 1) {
        logAuditEvent($pdo, 'AUTH_BLOCKED', "Попытка входа заблокированной учетной записи: {$username}", 'user', $user['id']);
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

    logAuditEvent($pdo, 'AUTH_LOGIN', "Успешный вход в систему (Роль: {$user['role']})", 'user', $user['id']);

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
    if ($pdo) {
        logAuditEvent($pdo, 'AUTH_LOGOUT', "Выход из системы", 'user', $_SESSION['user_id'] ?? null);
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

    logAuditEvent($pdo, 'USER_CREATE', "Создан пользователь '{$username}' (ФИО: {$fullName}, Роль: {$role})", 'user', $id);

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

    logAuditEvent($pdo, 'USER_UPDATE', "Обновлен пользователь '{$fullName}' (Статус: " . ($isActive ? 'Активен' : 'Заблокирован') . ", Роль: {$role})", 'user', $id);

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

    logAuditEvent($pdo, 'PASSWORD_CHANGE', "Изменен пароль учетной записи id: {$userId}", 'user', $userId);

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
    $checkAdmin = $pdo->prepare("SELECT username, role FROM users WHERE id = ?");
    $checkAdmin->execute([$id]);
    $userToDelete = $checkAdmin->fetch();
    if ($userToDelete && $userToDelete['role'] === 'admin') {
        $count = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
        if ($count <= 1) {
            echo json_encode(['success' => false, 'error' => 'Нельзя удалить последнего администратора в системе.'], JSON_UNESCAPED_UNICODE);
            return;
        }
    }

    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$id]);

    $delUsername = $userToDelete['username'] ?? $id;
    logAuditEvent($pdo, 'USER_DELETE', "Удален пользователь '{$delUsername}'", 'user', $id);

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

        logAuditEvent($pdo, 'FLIGHT_SAVE', "Синхронизировано/импортировано рейсов: " . count($data), 'flights');

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
        echo json_encode(['success' => false, 'error' => 'Не указан ID рейса для удаления.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM flights WHERE id = ?");
        $stmt->execute([$id]);

        logAuditEvent($pdo, 'FLIGHT_DELETE', "Удален рейс id: {$id}", 'flight', $id);

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
        $pdo->exec("DELETE FROM flights");

        logAuditEvent($pdo, 'DB_CLEAR', "Произведена полная очистка базы рейсов", 'database');

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
        }
    } catch (Exception $e) {
        error_log("Smart auto-backup error: " . $e->getMessage());
    }
}

/**
 * Ручное удаление конкретного файла резервной копии (Admin)
 */
function handleDeleteBackup() {
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
            logAuditEvent($pdo, 'BACKUP_DELETE', "Удалена резервная копия {$filename}", 'backup', $filename);
            echo json_encode(['success' => true, 'message' => 'Резервная копия успешно удалена.'], JSON_UNESCAPED_UNICODE);
        } else {
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

        logAuditEvent($pdo, 'BACKUP_CREATE', "Создана резервная копия {$filename} (Рейсов: " . count($flights) . ")", 'backup', $filename);

        echo json_encode([
            'success' => true,
            'filename' => $filename,
            'flights_count' => count($flights),
            'message' => 'Резервная копия успешно создана.'
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка создания бэкапа: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Скачивание резервной копии (Admin)
 */
function handleDownloadBackup() {
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

        logAuditEvent($pdo, 'BACKUP_RESTORE', "Восстановлена база из резервной копии {$filename} (Рейсов: " . count($flights) . ")", 'backup', $filename);

        echo json_encode([
            'success' => true,
            'restored_count' => count($flights),
            'message' => 'База данных успешно восстановлена из резервной копии.'
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
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

        logAuditEvent($pdo, 'SETTINGS_UPDATE', "Обновлена системная настройка: {$key}", 'settings', $key);

        echo json_encode([
            'success' => true,
            'message' => 'Настройка успешно сохранена.'
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка сохранения настройки: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Отправка оповещения в Telegram Bot
 * @param string $message HTML-форматированное сообщение
 * @param PDO $pdo Подключение к БД для чтения настроек
 * @param bool $isTest Флаг тестового сообщения
 * @param array|null $customConfig Переопределение настроек (для теста)
 * @return array ['success' => bool, 'error' => string|null]
 */
function sendTelegramAlert($message, $pdo, $isTest = false, $customConfig = null) {
    try {
        $config = $customConfig;
        if (!$config) {
            $stmt = $pdo->prepare("SELECT setting_value FROM app_settings WHERE setting_key = 'telegram_config' LIMIT 1");
            $stmt->execute();
            $raw = $stmt->fetchColumn();
            $config = $raw ? json_decode($raw, true) : null;
        }

        if (!$config || empty($config['bot_token']) || empty($config['chat_id'])) {
            return ['success' => false, 'error' => 'Telegram Bot не настроен (отсутствует токен или Chat ID).'];
        }

        if (!$isTest && empty($config['is_enabled'])) {
            return ['success' => false, 'error' => 'Уведомления в Telegram отключены в настройках.'];
        }

        $botToken = trim($config['bot_token']);
        $chatId = trim($config['chat_id']);

        $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
        $payload = [
            'chat_id' => $chatId,
            'text' => $message,
            'parse_mode' => 'HTML',
            'disable_web_page_preview' => true
        ];

        // Неблокирующий cURL с таймаутом 2.5 сек
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($payload),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 3,
            CURLOPT_CONNECTTIMEOUT => 2,
            CURLOPT_SSL_VERIFYPEER => true
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErr = curl_error($ch);
        curl_close($ch);

        if ($curlErr) {
            return ['success' => false, 'error' => "cURL ошибка: " . $curlErr];
        }

        $resJson = json_decode($response, true);
        if ($httpCode !== 200 || empty($resJson['ok'])) {
            $desc = $resJson['description'] ?? "HTTP код $httpCode";
            return ['success' => false, 'error' => "Ошибка Telegram API: " . $desc];
        }

        return ['success' => true];
    } catch (Exception $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

/**
 * Защита от флуда одинаковыми ошибками (Anti-flood / Rate Limiting)
 * Подавляет дубликаты одного типа ошибок на 180 секунд (3 мин)
 */
function checkAntiFlood($signature, $windowSeconds = 180) {
    $cacheFile = __DIR__ . '/logs/.flood_cache.json';
    $cache = [];
    if (file_exists($cacheFile)) {
        $content = @file_get_contents($cacheFile);
        $cache = $content ? json_decode($content, true) : [];
    }
    if (!is_array($cache)) $cache = [];

    $now = time();
    // Очистка устаревших записей
    foreach ($cache as $k => $item) {
        if ($now - ($item['time'] ?? 0) > $windowSeconds * 2) {
            unset($cache[$k]);
        }
    }

    if (isset($cache[$signature])) {
        $lastTime = $cache[$signature]['time'] ?? 0;
        if ($now - $lastTime < $windowSeconds) {
            $cache[$signature]['count'] = ($cache[$signature]['count'] ?? 1) + 1;
            @file_put_contents($cacheFile, json_encode($cache));
            return false; // Подавить отправку (флуд)
        }
    }

    $cache[$signature] = [
        'time' => $now,
        'count' => 1
    ];
    @file_put_contents($cacheFile, json_encode($cache));
    return true; // Разрешить отправку
}

/**
 * Получение настроек Telegram (Admin)
 */
function handleGetTelegramSettings($pdo) {
    try {
        $stmt = $pdo->prepare("SELECT setting_value FROM app_settings WHERE setting_key = 'telegram_config' LIMIT 1");
        $stmt->execute();
        $val = $stmt->fetchColumn();
        $config = $val ? json_decode($val, true) : [
            'bot_token' => '',
            'chat_id' => '',
            'is_enabled' => false
        ];

        echo json_encode([
            'success' => true,
            'config' => $config
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка получения настроек Telegram: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Сохранение настроек Telegram (Admin)
 */
function handleSaveTelegramSettings($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $botToken = trim($input['bot_token'] ?? '');
    $chatId = trim($input['chat_id'] ?? '');
    $isEnabled = !empty($input['is_enabled']);

    $config = [
        'bot_token' => $botToken,
        'chat_id' => $chatId,
        'is_enabled' => $isEnabled
    ];

    try {
        $jsonVal = json_encode($config, JSON_UNESCAPED_UNICODE);
        $stmt = $pdo->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES ('telegram_config', ?) 
                               ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
        $stmt->execute([$jsonVal]);

        logAuditEvent($pdo, 'TELEGRAM_CONFIG', "Обновлена конфигурация Telegram-бота (Статус: " . ($isEnabled ? 'Активен' : 'Отключен') . ")", 'telegram');

        echo json_encode([
            'success' => true,
            'message' => 'Настройки Telegram успешно сохранены.'
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка сохранения настроек Telegram: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Тестирование подключения Telegram Bot (Admin)
 */
function handleTestTelegram($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $customConfig = null;
    if (!empty($input['bot_token']) && !empty($input['chat_id'])) {
        $customConfig = [
            'bot_token' => trim($input['bot_token']),
            'chat_id' => trim($input['chat_id']),
            'is_enabled' => true
        ];
    }

    $curUser = $_SESSION['username'] ?? 'admin';
    $curFullName = $_SESSION['full_name'] ?? 'Главный Администратор';
    $dateStr = date('d.m.Y H:i:s');

    $msg = "✈️ <b>[AeroBag Predictor]</b>\n"
         . "✅ <b>Тестовое уведомление: связь с Telegram успешно установлена!</b>\n"
         . "━━━━━━━━━━━━━━━━━━━\n"
         . "⏰ <b>Время:</b> <code>{$dateStr}</code>\n"
         . "👤 <b>Администратор:</b> {$curFullName} (<code>@{$curUser}</code>)\n"
         . "🌐 <b>Хост:</b> <code>" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . "</code>\n"
         . "📡 <b>Статус:</b> Мониторинг активен, алерты о сбоях готовы к отправке.";

    $res = sendTelegramAlert($msg, $pdo, true, $customConfig);

    if ($res['success']) {
        echo json_encode([
            'success' => true,
            'message' => 'Тестовое сообщение успешно отправлено в Telegram!'
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            'success' => false,
            'error' => $res['error']
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Прием и запись логов ошибок (клиент / сервер) с отправкой алерта в Telegram
 */
function handleLogError($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        echo json_encode(['success' => false, 'error' => 'Пустой лог.'], JSON_UNESCAPED_UNICODE);
        return;
    }

    $timestamp = date('Y-m-d H:i:s');
    $source = $input['source'] ?? 'client_js';
    $errorMsg = trim($input['message'] ?? 'Неизвестная ошибка');
    $stack = trim($input['stack'] ?? '');
    $flightContext = $input['flight_context'] ?? '-';
    $user = $_SESSION['username'] ?? ($input['username'] ?? 'anonymous');
    $url = $input['url'] ?? ($_SERVER['REQUEST_URI'] ?? '');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

    // 1. Запись в защищенный локальный лог-файл logs/app_errors.log
    $logsDir = __DIR__ . '/logs';
    if (!is_dir($logsDir)) {
        @mkdir($logsDir, 0755, true);
    }
    $cleanStack = str_replace(["\r\n", "\r", "\n"], " -> ", $stack);
    $logLine = sprintf("[%s] [%s] [User:%s] [IP:%s] [Flight:%s] Msg: %s | Stack: %s\n",
        $timestamp, $source, $user, $ip, $flightContext, $errorMsg, $cleanStack
    );
    @file_put_contents($logsDir . '/app_errors.log', $logLine, FILE_APPEND);

    // 2. Отправка алерта в Telegram (с защитой от флуда)
    $sig = md5($source . '_' . $errorMsg);
    if (checkAntiFlood($sig, 180)) {
        $safeMsg = htmlspecialchars($errorMsg, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $safeFlight = htmlspecialchars($flightContext, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $safeUser = htmlspecialchars($user, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

        $tgText = "🚨 <b>[AeroBag Alert] Ошибка в системе!</b>\n"
                . "━━━━━━━━━━━━━━━━━━━\n"
                . "⏰ <b>Время:</b> <code>{$timestamp}</code>\n"
                . "👤 <b>Пользователь:</b> <code>{$safeUser}</code>\n"
                . "✈️ <b>Рейс/Контекст:</b> <code>{$safeFlight}</code>\n"
                . "📍 <b>Источник:</b> <code>{$source}</code>\n"
                . "💥 <b>Ошибка:</b> <code>{$safeMsg}</code>\n";
        
        if (!empty($stack)) {
            $shortStack = mb_substr($stack, 0, 250);
            $safeStack = htmlspecialchars($shortStack, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
            $tgText .= "📋 <b>Стек:</b> <code>{$safeStack}</code>\n";
        }
        $tgText .= "🌐 <b>Хост:</b> <code>" . ($_SERVER['HTTP_HOST'] ?? '') . "</code>";

        sendTelegramAlert($tgText, $pdo, false);
    }

    echo json_encode(['success' => true, 'logged' => true], JSON_UNESCAPED_UNICODE);
}

/**
 * Health Check эндпоинт для проверки здоровья системы и пинга
 */
function handleHealthCheck($pdo) {
    $t0 = microtime(true);
    $dbOk = false;
    $totalFlights = 0;
    $activeUsers = 0;
    
    try {
        $stmt = $pdo->query("SELECT COUNT(*) FROM flights");
        $totalFlights = (int)$stmt->fetchColumn();
        
        $stmtUsers = $pdo->query("SELECT COUNT(*) FROM users WHERE is_active = 1");
        $activeUsers = (int)$stmtUsers->fetchColumn();
        
        $dbOk = true;
    } catch (Exception $e) {
        $dbOk = false;
    }
    
    $latencyMs = round((microtime(true) - $t0) * 1000, 2);
    
    $backupDir = __DIR__ . '/backups';
    $backupsWritable = is_dir($backupDir) && is_writable($backupDir);
    $logsDir = __DIR__ . '/logs';
    $logsWritable = is_dir($logsDir) && is_writable($logsDir);

    // Проверка настроек Telegram
    $tgConfigured = false;
    $tgEnabled = false;
    try {
        $stmtTg = $pdo->prepare("SELECT setting_value FROM app_settings WHERE setting_key = 'telegram_config' LIMIT 1");
        $stmtTg->execute();
        $rawTg = $stmtTg->fetchColumn();
        if ($rawTg) {
            $tgData = json_decode($rawTg, true);
            $tgConfigured = !empty($tgData['bot_token']) && !empty($tgData['chat_id']);
            $tgEnabled = !empty($tgData['is_enabled']);
        }
    } catch (Exception $e) {}

    echo json_encode([
        'success' => true,
        'status' => $dbOk ? 'healthy' : 'degraded',
        'database' => [
            'connected' => $dbOk,
            'latency_ms' => $latencyMs,
            'total_flights' => $totalFlights,
            'active_users' => $activeUsers
        ],
        'filesystem' => [
            'backups_writable' => $backupsWritable,
            'logs_writable' => $logsWritable
        ],
        'telegram' => [
            'configured' => $tgConfigured,
            'enabled' => $tgEnabled
        ],
        'server' => [
            'php_version' => PHP_VERSION,
            'server_time' => date('Y-m-d H:i:s')
        ]
    ], JSON_UNESCAPED_UNICODE);
}

/**
 * Получение записей Журнала Аудита (Audit Trail) с фильтрацией (Admin)
 */
function handleGetAuditLogs($pdo) {
    $limit = isset($_GET['limit']) ? min(500, max(10, (int)$_GET['limit'])) : 100;
    $eventType = trim($_GET['event_type'] ?? '');
    $username = trim($_GET['username'] ?? '');

    $where = [];
    $params = [];

    if (!empty($eventType) && $eventType !== 'ALL') {
        $where[] = "event_type = ?";
        $params[] = $eventType;
    }
    if (!empty($username)) {
        $where[] = "username LIKE ?";
        $params[] = "%{$username}%";
    }

    $whereSql = !empty($where) ? ('WHERE ' . implode(' AND ', $where)) : '';
    $sql = "SELECT id, user_id, username, event_type, event_desc, entity_type, entity_id, ip_address, created_at 
            FROM audit_logs {$whereSql} 
            ORDER BY id DESC 
            LIMIT {$limit}";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $logs = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'count' => count($logs),
            'logs' => $logs
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка чтения журнала аудита: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * Диагностика системы и метрики базы данных (Admin)
 */
function handleSystemDiagnostics($pdo) {
    try {
        // 1. Размер базы данных MySQL
        $dbName = DB_NAME;
        $stmtSize = $pdo->prepare("SELECT SUM(data_length + index_length) / 1024 / 1024 AS size_mb 
                                   FROM information_schema.TABLES 
                                   WHERE table_schema = ?");
        $stmtSize->execute([$dbName]);
        $dbSizeMb = round((float)$stmtSize->fetchColumn(), 2);

        // 2. Статистика рейсов по авиакомпаниям
        $stmtAirlines = $pdo->query("SELECT airline, COUNT(*) as cnt FROM flights GROUP BY airline ORDER BY cnt DESC");
        $airlineStats = $stmtAirlines->fetchAll();

        // 3. Диапазон дат в базе
        $stmtDates = $pdo->query("SELECT MIN(flight_date) as min_date, MAX(flight_date) as max_date, COUNT(*) as total FROM flights");
        $dateRange = $stmtDates->fetch();

        // 4. Размер директории бэкапов и логов
        $backupDir = __DIR__ . '/backups';
        $backupCount = 0;
        $backupTotalSize = 0;
        if (is_dir($backupDir)) {
            foreach (scandir($backupDir) as $f) {
                if (pathinfo($f, PATHINFO_EXTENSION) === 'json') {
                    $backupCount++;
                    $backupTotalSize += filesize($backupDir . '/' . $f);
                }
            }
        }
        $backupSizeMb = round($backupTotalSize / 1024 / 1024, 2);

        $logsDir = __DIR__ . '/logs';
        $logErrorsSizeKb = 0;
        if (file_exists($logsDir . '/app_errors.log')) {
            $logErrorsSizeKb = round(filesize($logsDir . '/app_errors.log') / 1024, 1);
        }

        // 5. Записи аудита
        $auditCount = (int)$pdo->query("SELECT COUNT(*) FROM audit_logs")->fetchColumn();

        echo json_encode([
            'success' => true,
            'database' => [
                'name' => $dbName,
                'size_mb' => $dbSizeMb,
                'total_flights' => (int)($dateRange['total'] ?? 0),
                'min_date' => $dateRange['min_date'] ?? '-',
                'max_date' => $dateRange['max_date'] ?? '-',
                'airlines' => $airlineStats
            ],
            'backups' => [
                'count' => $backupCount,
                'size_mb' => $backupSizeMb
            ],
            'logs' => [
                'errors_size_kb' => $logErrorsSizeKb,
                'audit_events_count' => $auditCount
            ],
            'server' => [
                'php_version' => PHP_VERSION,
                'os' => PHP_OS,
                'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Beget WebServer',
                'server_time' => date('Y-m-d H:i:s')
            ]
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка получения диагностики: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}


