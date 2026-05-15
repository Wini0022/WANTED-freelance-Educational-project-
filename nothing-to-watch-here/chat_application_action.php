<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../auth_bootstep.php';
require_once __DIR__ . '/../connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['ok' => false, 'error' => 'unauthorized'], JSON_UNESCAPED_UNICODE);
    exit;
}
if ($_SESSION['user_role'] !== 1) {
    echo json_encode(['ok' => false, 'error' => 'forbidden'], JSON_UNESCAPED_UNICODE);
    exit;
}
$applicationId = $_POST['application_id'];
$action = $_POST['action'];

$stmt = $mysqli->prepare('SELECT executor_id FROM Applications WHERE id = ? LIMIT 1');
$stmt->bind_param('i', $applicationId);
$stmt->execute();
$app = $stmt->get_result()->fetch_assoc();
$stmt->close();

$oldExecutorId = (int)($app['executor_id'] ?? 0);

if ($action === 'complete') {
    $stmt = $mysqli->prepare('UPDATE Applications SET status = 3 WHERE id = ? AND status = 2 LIMIT 1');
    $stmt->bind_param('i', $applicationId);
    $ok = $stmt->execute();
    $affected = $stmt->affected_rows;
    $stmt->close();
} elseif ($action === 'reject_candidate') { 
    $stmt = $mysqli->prepare('UPDATE Applications SET executor_id = NULL, status = 0 WHERE id = ? AND status = 2 LIMIT 1');
    $stmt->bind_param('i', $applicationId);
    $ok = $stmt->execute();
    $affected = $stmt->affected_rows;
    $stmt->close();

    if ($ok && $affected > 0) {
        $stmt = $mysqli->prepare('
            UPDATE chats
            SET executor_id = NULL, executor_last_read_message_id = NULL
            WHERE application_id = ? AND executor_id = ?
            LIMIT 1
        ');
        $stmt->bind_param('ii', $applicationId, $oldExecutorId);
        $stmt->execute();
        $stmt->close();
    }
} else {
    echo json_encode(['ok' => false, 'error' => 'invalid action'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!$ok) {
    echo json_encode(['ok' => false, 'error' => 'update failed'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($affected <= 0) {
    echo json_encode(['ok' => false, 'error' => 'state mismatch or not found'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => true, 'action' => $action, 'application_id' => $applicationId], JSON_UNESCAPED_UNICODE);