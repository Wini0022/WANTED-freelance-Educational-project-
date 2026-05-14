<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../auth_bootstep.php';
require_once __DIR__ . '/../connect.php';

if (!isset($_SESSION['user_id'])) { echo json_encode(['ok'=>false,'error'=>'unauthorized']); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { echo json_encode(['ok'=>false,'error'=>'method']); exit; }

$userId = (int)$_SESSION['user_id'];
$chatId = (int)($_POST['chat_id'] ?? 0);
$body = trim((string)($_POST['body'] ?? ''));

if ($chatId <= 0 || $body === '') {
    echo json_encode(['ok'=>false,'error'=>'invalid input'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $mysqli->prepare('SELECT id FROM chats WHERE id = ? AND (owner_id = ? OR executor_id = ?) LIMIT 1');
$stmt->bind_param('iii', $chatId, $userId, $userId);
$stmt->execute();
$chat = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$chat) {
    echo json_encode(['ok'=>false,'error'=>'forbidden'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $mysqli->prepare('INSERT INTO chat_messages (chat_id, sender_id, body) VALUES (?, ?, ?)');
$stmt->bind_param('iis', $chatId, $userId, $body);
$ok = $stmt->execute();
$stmt->close();

echo json_encode(['ok' => $ok], JSON_UNESCAPED_UNICODE);
