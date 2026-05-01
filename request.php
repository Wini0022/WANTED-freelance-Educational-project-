<?php
header('Content-Type: application/json; charset=utf-8');
require_once './auth_bootstep.php';
require_once './connect.php';

$userId = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 0;

if ($userId > 0) {
    // Available: только 0/1, и только те, на которые текущий user еще не откликался
    $stmt = $mysqli->prepare("SELECT a.*, c.name AS category, cu.name AS currency FROM Applications a LEFT JOIN categories c ON c.id = a.category_id LEFT JOIN currencies cu ON cu.id = a.currency_id WHERE a.status IN (0, 1) AND NOT EXISTS ( SELECT 1 FROM requests r WHERE r.application_id = a.id AND r.user_id = ? )");
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $available = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // Being considered: заявки, на которые этот user уже откликнулся
    $stmt = $mysqli->prepare("
    SELECT DISTINCT
        a.*,
        c.name AS category,
        cu.name AS currency
    FROM Applications a
    INNER JOIN requests r ON r.application_id = a.id
    LEFT JOIN categories c ON c.id = a.category_id
    LEFT JOIN currencies cu ON cu.id = a.currency_id
    WHERE r.user_id = ? AND a.status IN (0, 1)
"); // DISTINCT убирает повторы
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $considered = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
} else {
    // неавторизованному показываем обычный список
    $result = $mysqli->query("SELECT * FROM Applications WHERE status IN (0, 1)");
    $available = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    $considered = [];
}

echo json_encode([
    'available' => $available,
    'considered' => $considered
], JSON_UNESCAPED_UNICODE);
