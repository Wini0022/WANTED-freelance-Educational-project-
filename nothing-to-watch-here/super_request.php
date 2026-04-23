<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../auth_bootstep.php';
require_once '../connect.php';

$stmt = $mysqli->prepare("SELECT a.* FROM Applications a WHERE a.status IN (0) AND NOT EXISTS ( SELECT 1 FROM requests r WHERE r.application_id = a.id)");
$stmt->execute();
$without = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

$stmt = $mysqli->prepare("    
    SELECT
        a.*,
        r.user_id,
        r.message,
        u.name,
        u.nickname,
        u.avatar,
        u.user_desc,
        u.country,
        u.experience_months
    FROM Applications a
    JOIN requests r ON r.application_id = a.id
    JOIN Users u ON u.id = r.user_id
    WHERE a.status = 1");
    
$stmt->execute();
$responseRows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

echo json_encode([
    'without' => $without,
    'responseRows' => $responseRows
], JSON_UNESCAPED_UNICODE);
