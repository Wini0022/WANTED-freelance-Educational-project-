<?php
header('Content-Type: application/json; charset=utf-8');
require_once './auth_bootstep.php';
require_once './connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['ok' => false, 'error' => 'unauthorized'], JSON_UNESCAPED_UNICODE);
    exit;
}

$userId = (int)$_SESSION['user_id'];
$requestId = (int)($_POST['request_id'] ?? 0);

if ($requestId <= 0) {
    echo json_encode(['ok' => false, 'error' => 'invaild request_id'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $mysqli->prepare("
    SELECT application_id
    FROM requests
    WHERE id = ? AND user_id = ? AND status = 0
");
$stmt->bind_param('ii', $requestId, $userId);
$stmt->execute();
$request = $stmt->get_result()->fetch_assoc();
$stmt->close();


if (!$request) {
    echo json_encode(['ok' => false, 'error' => 'apllication_id not found'], JSON_UNESCAPED_UNICODE);
    exit;
}

$applicationId = (int)$request['application_id'];

$stmt = $mysqli->prepare("
    DELETE FROM requests
    WHERE id = ? AND user_id = ? AND status = 0
");
$stmt->bind_param('ii', $requestId, $userId);
$ok = $stmt->execute();
$affected = $stmt->affected_rows;
$stmt->close();

if (!$ok || $affected <= 0) {
    echo json_encode(['ok' => false, 'error' => 'Withdraw failed'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $mysqli->prepare("
    SELECT COUNT(*) AS count
    FROM requests
    WHERE application_id = ? AND status = 0
");
$stmt->bind_param('i', $applicationId);
$stmt->execute();
$countRequests = (int)$stmt->get_result()->fetch_assoc()['count'];
$stmt->close();


if ($countRequests === 0){
    $stmt = $mysqli->prepare("
        UPDATE Applications
        SET status = 1
        WHERE id = ? AND status = 1 AND executor_id IS NULL
    ");
    $stmt->bind_param('i', $applicationId);
    $stmt->execute();
    $stmt->close();
}



echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);