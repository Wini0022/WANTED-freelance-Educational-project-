<?php
header('Content-Type: application/json; charset=utf-8');

require_once '../auth_bootstep.php';
require_once '../connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!isset($_SESSION['user_id']) || (int)($_SESSION['user_role'] ?? 0) !== 1) {
    echo json_encode(['ok' => false, 'error' => 'Forbidden'], JSON_UNESCAPED_UNICODE);
    exit;
}

$applicationId = (int)($_POST['application_id'] ?? 0);
if ($applicationId <= 0) {
    echo json_encode(['ok' => false, 'error' => 'application_id is required'], JSON_UNESCAPED_UNICODE);
    exit;
}

$archivedStatus = 9; // архив

$stmt = $mysqli->prepare('UPDATE Applications SET status = ? WHERE id = ? AND status IN (0, 1) LIMIT 1');
$stmt->bind_param('ii', $archivedStatus, $applicationId);
$ok = $stmt->execute();
$affected = $stmt->affected_rows;
$stmt->close();

if (!$ok) {
    echo json_encode(['ok' => false, 'error' => 'Update failed'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($affected <= 0) {
    echo json_encode(['ok' => false, 'error' => 'Not found or already changed'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
