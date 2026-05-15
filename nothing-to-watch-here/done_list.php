<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../auth_bootstep.php';
require_once __DIR__ . '/../connect.php';

if (!isset($_SESSION['user_id']) || (int)($_SESSION['user_role'] ?? 0) !== 1) {
    echo json_encode(['ok' => false, 'error' => 'forbidden'], JSON_UNESCAPED_UNICODE);
    exit;
}
$stmt = $mysqli->prepare("
    SELECT 
        a.id, 
        a.title, 
        a.description, 
        a.award, 
        a.award_desc, 
        deadline,
        cat.name AS category_name,
        cur.name AS currency_name,
        c.id AS chat_id
    FROM Applications a
    LEFT JOIN categories cat ON cat.id = a.category_id
    LEFT JOIN currencies cur ON cur.id = a.currency_id
    LEFT JOIN chats c ON c.application_id = a.id
    WHERE a.status = 3
    ORDER BY a.id DESC
");
if (!$stmt) {
    throw new Exception('Application is not found');
}
$stmt->execute();
$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

echo json_encode(['ok' => true, 'done' => $rows], JSON_UNESCAPED_UNICODE);