<?php
header('Content-Type: application/json; charset=utf-8');
require_once './auth_bootstep.php';
require_once './connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['ok' => false, 'error' => 'unauthorized'], JSON_UNESCAPED_UNICODE);
    exit;
}

$userId = (int)$_SESSION['user_id'];
$applicationId = (int)($_POST['application_id'] ?? 0);

if ($applicationId <= 0) {
    echo json_encode(['ok' => false, 'error' => 'application_id required'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $mysqli->prepare('
    UPDATE Applications
    SET executor_id = NULL, status = 0
    WHERE id = ? AND executor_id = ? AND status = 2
    LIMIT 1
');
$stmt->bind_param('ii', $applicationId, $userId);
$ok = $stmt->execute();
$affected = $stmt->affected_rows;
$stmt->close();

if (!$ok || $affected <= 0) {
    echo json_encode(['ok' => false, 'error' => 'Withdraw failed'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $mysqli->prepare('
    UPDATE chats
    SET executor_id = NULL, executor_last_read_message_id = NULL
    WHERE application_id = ? AND executor_id = ?
    LIMIT 1
');
$stmt->bind_param('ii', $applicationId, $userId);
$stmt->execute();
$stmt->close();

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);