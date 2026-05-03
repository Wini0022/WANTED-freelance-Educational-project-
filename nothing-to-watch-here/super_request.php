<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../auth_bootstep.php';
require_once '../connect.php';

$stmt = $mysqli->prepare("SELECT a.* FROM Applications a WHERE a.status IN (0) AND NOT EXISTS ( SELECT 1 FROM requests r WHERE r.application_id = a.id)");
$stmt->execute();
$without = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

$catResult = $mysqli->query("SELECT id, name FROM categories ORDER BY name");
$categories = $catResult ? $catResult->fetch_all(MYSQLI_ASSOC) : [];

$curResult = $mysqli->query("SELECT id, name FROM currencies ORDER BY name");
$currencies = $curResult ? $curResult->fetch_all(MYSQLI_ASSOC) : [];


$stmt = $mysqli->prepare("    
    SELECT
        a.*,
        a.id AS application_id,
        r.id AS request_id,
        r.user_id,
        r.message,
        u.name,
        u.nickname,
        u.avatar,
        u.user_desc,
        u.country,
        u.experience_months,
        c.name  AS category_name,
        cu.name AS currency_name

        FROM Applications a
        JOIN requests r ON r.application_id = a.id
        JOIN Users u ON u.id = r.user_id
        LEFT JOIN categories c ON c.id = a.category_id
        LEFT JOIN currencies cu ON cu.id = a.currency_id

        WHERE a.status = 1 AND r.status = 0");
    
$stmt->execute();
$responseRows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

echo json_encode([
    'without' => $without,
    'responseRows' => $responseRows,
    'categories' => $categories,
    'currencies' => $currencies
], JSON_UNESCAPED_UNICODE);
