<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../auth_bootstep.php';
require_once __DIR__ . '/../connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['ok' => false, 'error' => 'unauthorized'], JSON_UNESCAPED_UNICODE);
    exit;
}

$userId = (int)$_SESSION['user_id'];
$chatId = (int)($_GET['chat_id'] ?? 0);

if ($chatId <= 0) {
    echo json_encode(['ok' => false, 'error' => 'chat_id required'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $mysqli->prepare('SELECT id FROM chats WHERE id = ? AND (owner_id = ? OR executor_id = ?) LIMIT 1');
$stmt->bind_param('iii', $chatId, $userId, $userId);
$stmt->execute();
$chat = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$chat) {
    echo json_encode(['ok' => false, 'error' => 'forbidden'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $mysqli->prepare('
    SELECT id, chat_id, sender_id, body, created_at
    FROM chat_messages
    WHERE chat_id = ?
    ORDER BY id ASC
');
$stmt->bind_param('i', $chatId);
$stmt->execute();
$messages = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

echo json_encode(['ok' => true, 'messages' => $messages], JSON_UNESCAPED_UNICODE);
