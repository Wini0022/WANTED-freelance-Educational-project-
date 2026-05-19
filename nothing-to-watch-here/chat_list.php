<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../auth_bootstep.php';
require_once __DIR__ . '/../connect.php';

if (!isset($_SESSION['user_id'])) {
  echo json_encode(['ok' => false, 'error' => 'unauthorized']); exit;
}

$userId = (int)$_SESSION['user_id'];
$isAdmin = ((int)($_SESSION['user_role'] ?? 0) === 1);

$stmt = $mysqli->prepare("
    SELECT
        c.id,
        c.application_id,
        c.owner_id,
        c.executor_id,
        c.created_at,
        a.title,
        a.category_id,
        cat.name AS category_name,
        cur.name AS currency_name,
        a.description AS application_description,
        a.deadline,
        a.award,
        a.award_desc,
        u.name,
        u.nickname,
        u.avatar,
        u.user_desc,
        u.experience_months
    FROM chats c
    JOIN Applications a ON a.id = c.application_id
    LEFT JOIN categories cat ON cat.id = a.category_id
    LEFT JOIN currencies cur ON cur.id = a.currency_id
    JOIN Users u ON u.id = c.executor_id
    WHERE a.status = 2 AND (? = 1 OR c.owner_id = ? OR c.executor_id = ?)
    ORDER BY c.id DESC
");
$isAdminInt = $isAdmin ? 1 : 0;
$stmt->bind_param('iii', $isAdminInt ,$userId, $userId);
$stmt->execute();
$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

echo json_encode(['ok' => true, 'chats' => $rows], JSON_UNESCAPED_UNICODE);
