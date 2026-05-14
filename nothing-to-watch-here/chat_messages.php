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

$stmt = $mysqli->prepare('SELECT owner_id, executor_id, owner_last_read_message_id, executor_last_read_message_id FROM chats WHERE id = ? AND (owner_id = ? OR executor_id = ?) LIMIT 1');
$stmt->bind_param('iii', $chatId, $userId, $userId);
$stmt->execute();
$chat = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$chat) {
    echo json_encode(['ok' => false, 'error' => 'forbidden'], JSON_UNESCAPED_UNICODE);
    exit;
}
$isOwner = ((int)$chat['owner_id'] === $userId);

$stmt = $mysqli->prepare('
  SELECT MAX(id) AS max_incoming_id
  FROM chat_messages
  WHERE chat_id = ? AND sender_id <> ?
'); // <> - не в SQL
$stmt->bind_param('ii', $chatId, $userId);
$stmt->execute();
$rowMax = $stmt->get_result()->fetch_assoc();
$stmt->close();

$maxIncomingId = $rowMax['max_incoming_id'] !== null ? (int)$rowMax['max_incoming_id'] : null;

if ($maxIncomingId !== null) {
  if ($isOwner) {
    $stmt = $mysqli->prepare('UPDATE chats SET owner_last_read_message_id = ? WHERE id = ? LIMIT 1');
  } else {
    $stmt = $mysqli->prepare('UPDATE chats SET executor_last_read_message_id = ? WHERE id = ? LIMIT 1');
  }

  $stmt->bind_param('ii', $maxIncomingId, $chatId);
  $stmt->execute();
  $stmt->close();
};

$stmt = $mysqli->prepare('
    SELECT
      m.id, m.chat_id, m.sender_id, m.body, m.created_at,
      u.role AS sender_role
    FROM chat_messages m
    JOIN users u ON u.id = m.sender_id
    WHERE m.chat_id = ?
    ORDER BY m.id ASC
');

$stmt->bind_param('i', $chatId);
$stmt->execute();
$messages = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

$peerReadUpto = $isOwner
  ? (int)($chat['executor_last_read_message_id'] ?? 0)
  : (int)($chat['owner_last_read_message_id'] ?? 0);

foreach ($messages as &$m) {
  $isMine = ((int)$m['sender_id'] === $userId);
  $m['is_read_by_peer'] = $isMine && ((int)$m['id'] <= $peerReadUpto);
}
unset($m);

echo json_encode(['ok' => true, 'messages' => $messages], JSON_UNESCAPED_UNICODE);
