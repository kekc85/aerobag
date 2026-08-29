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
        handleListBackups();
        break;

    case 'create_backup':
        requireAdmin();
        handleCreateBackup($pdo);
        break;

    case 'download_backup':
        requireAdmin();
        handleDownloadBackup();
        break;

    case 'restore_backup':
        requireAdmin();
        handleRestoreBackup($pdo);
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

    // 3. Автосоздание первого Главного Администратора (если таблица пуста)
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

    // 4. Создание защищенной папки backups/ с .htaccess
    $backupDir = __DIR__ . '/backups';
    if (!is_dir($backupDir)) {
        @mkdir($backupDir, 0755, true);
    }
    $htaccessPath = $backupDir . '/.htaccess';
    $htaccessContent = "# Защита папки резервных копий от прямого HTTP-доступа (Apache 2.2 / 2.4)\n<IfModule mod_authz_core.c>\n    Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n    Order Deny,Allow\n    Deny from all\n</IfModule>\n";
    @file_put_contents($htaccessPath, $htaccessContent);
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
        echo json_encode([
            'success' => false,
            'error' => 'Неверный логин или пароль.'
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Сброс счетчика неудачных попыток при успешном входе
    $_SESSION['login_failed_attempts'] = 0;

    if ((int)$user['is_active'] !== 1) {
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
function handleLogout() {
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
    $checkAdmin = $pdo->prepare("SELECT role FROM users WHERE id = ?");
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

    echo json_encode([
        'success' => true,
        'message' => 'Пользователь успешно удален.'
    ], JSON_UNESCAPED_UNICODE);
}

/**
 * Получение списка рейсов
 */
function handleGetFlights($pdo) {
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
