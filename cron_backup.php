<?php
// AeroBag Predictor - Automated Daily Backup Script for Beget Cron
// На хостинге Beget в разделе Cron запускается командой:
// /usr/bin/php /home/b/username/site/public_html/aerobag/cron_backup.php

ini_set('display_errors', 0);
error_reporting(E_ALL);

$configPath = __DIR__ . '/db_config.php';
if (!file_exists($configPath)) {
    die("Error: db_config.php not found.\n");
}

require_once $configPath;

if (DB_USER === 'your_db_username' || DB_NAME === 'your_db_name') {
    die("Error: DB not configured.\n");
}

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);

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
        'backup_type' => 'cron_auto',
        'exported_at' => date('c'),
        'flights_count' => count($flights),
        'flights' => $flights
    ];

    $backupDir = __DIR__ . '/backups';
    if (!is_dir($backupDir)) {
        @mkdir($backupDir, 0755, true);
    }

    $htaccessPath = $backupDir . '/.htaccess';
    if (!file_exists($htaccessPath)) {
        @file_put_contents($htaccessPath, "Order Deny,Allow\nDeny from all\n");
    }

    $filename = 'aerobag_auto_' . date('Y_m_d_His') . '.json';
    $fullPath = $backupDir . '/' . $filename;

    file_put_contents($fullPath, json_encode($backupData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

    // Ротация: удаляем старые бэкапы старше 30 дней
    $cutoff = time() - (30 * 86400);
    $files = scandir($backupDir);
    $deleted = 0;
    foreach ($files as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'json') {
            $path = $backupDir . '/' . $file;
            if (filemtime($path) < $cutoff) {
                @unlink($path);
                $deleted++;
            }
        }
    }

    echo "[" . date('Y-m-d H:i:s') . "] Auto-backup completed successfully. Saved " . count($flights) . " flights to " . $filename . ". (Old deleted: $deleted)\n";

} catch (Exception $e) {
    echo "[" . date('Y-m-d H:i:s') . "] Error during cron backup: " . $e->getMessage() . "\n";
}
