<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../auth_bootstep.php';
require_once __DIR__ . '/../connect.php';

if (!isset($_SESSION['user_id'])) {
  echo json_encode(['ok' => false, 'error' => 'unauthorized']); exit;
}

$userId = (int)$_SESSION['user_id'];

$stmt = $mysqli->prepare("
    SELECT
        c.id,
        c.application_id,
        c.owner_id,
        c.executor_id,
        c.created_at,
        a.title,
        cat.name AS category_name,
        cur.name AS currency_name,
        a.description AS application_description,
        a.award,
        a.award_desc
    FROM chats c
    JOIN Applications a ON a.id = c.application_id
    LEFT JOIN categories cat ON cat.id = a.category_id
    LEFT JOIN currencies cur ON cur.id = a.currency_id
    WHERE c.owner_id = ? OR c.executor_id = ?
    ORDER BY c.id DESC
");
$stmt->bind_param('ii', $userId, $userId);
$stmt->execute();
$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

echo json_encode(['ok' => true, 'chats' => $rows], JSON_UNESCAPED_UNICODE);
