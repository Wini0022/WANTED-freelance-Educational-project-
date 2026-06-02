<?php
header('Content-Type: application/json; charset=utf-8');
require_once './auth_bootstep.php';
require_once './connect.php';

$userId = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 0;

if ($userId > 0) {
    // Available: только 0/1, и только те, на которые текущий user еще не откликался
    $stmt = $mysqli->prepare("SELECT a.*, c.name AS category, cu.name AS currency FROM Applications a LEFT JOIN categories c ON c.id = a.category_id LEFT JOIN currencies cu ON cu.id = a.currency_id WHERE a.status IN (0, 1) AND a.executor_id IS NULL AND NOT EXISTS ( SELECT 1 FROM requests r WHERE r.application_id = a.id AND r.user_id = ? )");
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
    WHERE r.user_id = ? AND a.status IN (0, 1) AND r.status = 0
"); // DISTINCT убирает повторы
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $considered = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    $stmt = $mysqli->prepare("
        SELECT
            c.id,
            c.application_id,
            c.owner_id,
            c.executor_id,
            c.created_at,
            a.title,
            a.category_id,
            cat.name AS category_name,
            cur.name AS currency_name,
            a.description AS application_description,
            a.deadline,
            a.award,
            a.award_desc,
            COALESCE(msg.messages_text, '') AS messages_text
        FROM chats c
        JOIN Applications a ON a.id = c.application_id
        LEFT JOIN categories cat ON cat.id = a.category_id
        LEFT JOIN currencies cur ON cur.id = a.currency_id
        LEFT JOIN (
            SELECT
                chat_id,
                GROUP_CONCAT(body SEPARATOR ' ') AS messages_text
            FROM chat_messages
            GROUP BY chat_id
        ) msg ON msg.chat_id = c.id
        WHERE a.status = 2 AND (? = 1 OR c.owner_id = ? OR c.executor_id = ?)
        ORDER BY c.id DESC
    ");
    $isAdmin = ((int)($_SESSION['user_role'] ?? 0) === 1);
    $isAdminInt = $isAdmin ? 1 : 0;

    $stmt->bind_param('iii', $isAdminInt, $userId, $userId);
    $stmt->execute();
    $chats = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    foreach ($chats as &$chat) {
        $chat['can_withdraw'] = ((int)$chat['executor_id'] === $userId) ? 1 : 0;
        $chat['current_user_id'] = $userId;
    }
    unset($chat);
    $stmt->close();

    $stmt = $mysqli->prepare("
    SELECT
        a.id,
        c.id AS chat_id,
        c.application_id,
        c.owner_id,
        c.executor_id,
        c.created_at,
        a.title,
        a.category_id,
        cat.name AS category_name,
        cur.name AS currency_name,
        a.description AS application_description,
        a.deadline,
        a.award,
        a.award_desc,
        COALESCE(msg.messages_text, '') AS messages_text
    FROM Applications a
    LEFT JOIN categories cat ON cat.id = a.category_id
    LEFT JOIN currencies cur ON cur.id = a.currency_id
    JOIN chats c ON c.application_id = a.id
    LEFT JOIN (
            SELECT
                chat_id,
                GROUP_CONCAT(body SEPARATOR ' ') AS messages_text
            FROM chat_messages
            GROUP BY chat_id
    ) msg ON msg.chat_id = c.id
    WHERE a.status = 3 AND c.executor_id = ?
    ORDER BY a.id DESC
");
$stmt->bind_param('i', $userId);
$stmt->execute();
$done = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

} else {
    // неавторизованному показываем обычный список
    $result = $mysqli->query("    
    SELECT a.*, c.name AS category, cu.name AS currency
    FROM Applications a
    LEFT JOIN categories c ON c.id = a.category_id
    LEFT JOIN currencies cu ON cu.id = a.currency_id
    WHERE a.status IN (0, 1) AND a.executor_id IS NULL
    ");
    $available = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    $considered = [];
    $chats = [];
    $done = [];
}

echo json_encode([
    'available' => $available,
    'considered' => $considered,
    'chats' => $chats,
    'done' => $done
], JSON_UNESCAPED_UNICODE);
