<?php
header('Content-Type: application/json; charset=utf-8');
require_once("connect.php");


$applications = 'SELECT * FROM `Applications`';
$result = $mysqli -> query($applications);
if ($result === false){
    http_response_code(500);
    echo json_encode(['error' => $mysqli->error], JSON_UNESCAPED_UNICODE);
    exit;
}
$offers = $result -> fetch_All(MYSQLI_ASSOC);
echo json_encode($offers, JSON_UNESCAPED_UNICODE);
?>