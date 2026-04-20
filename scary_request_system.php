<?php
require_once './auth_bootstep.php';
require_once './connect.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}



if (!isset($_SESSION['user_id'])) { echo json_encode(['ok'=>false,'error'=>'unauthorized']); exit; }
$userId = (int)$_SESSION['user_id'];

$applicationId= $_POST['application_id'] ?? 0;
if ($applicationId<= 0) { echo json_encode(['ok'=>false,'error'=>'application_id isnt found']); exit; }





$stmt = $mysqli->prepare('SELECT status FROM Applications WHERE id=?');
$stmt->bind_param('i', $applicationId); //привязка к ?
$stmt->execute(); 
$app = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$app) {
    echo json_encode(['ok' => false, 'error' => 'application isnt found'], JSON_UNESCAPED_UNICODE);
    exit;
}

$currentStatus = (int)$app['status'];

if ($currentStatus !== 0 && $currentStatus !== 1) {
    echo json_encode(['ok' => false, 'error' => 'status isnt allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $mysqli->prepare('SELECT id FROM requests WHERE application_id= ? AND user_id= ? LIMIT 1');
$stmt->bind_param('ii', $applicationId, $userId); //привязка к ?
$stmt->execute(); 
$app = $stmt->get_result()->fetch_assoc();
$stmt->close();

$message = ''; 
$requestStatus = 0;

if ($app){
    echo json_encode(['ok' => false, 'error' => 'application taken already'], JSON_UNESCAPED_UNICODE);
    exit;
}
if (!$app){
    $stmt = $mysqli->prepare('INSERT INTO requests (application_id, user_id, message, status) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('iisi', $applicationId,$userId,$message,$requestStatus);
    $ok = $stmt->execute();
    $stmt->close();

    if($ok){
        $stmt = $mysqli->prepare('UPDATE Applications SET status = 1 WHERE id = ? AND status = 0');
        $stmt->bind_param('i', $applicationId);
        $stmt->execute();
        $stmt->close();

        echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
        exit;
    }
    else{
        echo json_encode(['ok' => false, 'error' => 'Something went wrong'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    }