<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../auth_bootstep.php';
require_once __DIR__ . '/../connect.php';

if (!isset($_SESSION['user_id']) || (int)($_SESSION['user_role'] ?? 0) !== 1) {
    echo json_encode(['ok' => false, 'error' => 'forbidden'], JSON_UNESCAPED_UNICODE);
    exit;
}

$applicationId = (int)($_POST['application_id'] ?? 0);
if ($applicationId <= 0) {
  echo json_encode(['ok' => false, 'error' => 'application_id required'], JSON_UNESCAPED_UNICODE);
  exit;
}
$mysqli->begin_transaction(); // группа stmt

try {
    // 1) только из архива
    $stmt = $mysqli->prepare('SELECT id FROM Applications WHERE id = ? AND status = 9 LIMIT 1 FOR UPDATE');
    $stmt->bind_param('i', $applicationId);
    $stmt->execute();
    $app = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$app) {
        throw new Exception('not archived or not found');
    }

    // 2) удалить сообщения чатов этой заявки
    $stmt = $mysqli->prepare('
        DELETE cm
        FROM chat_messages cm
        INNER JOIN chats c ON c.id = cm.chat_id
        WHERE c.application_id = ?
    ');
    $stmt->bind_param('i', $applicationId);
    $stmt->execute();
    $stmt->close();

    // 3) удалить чаты заявки
    $stmt = $mysqli->prepare('DELETE FROM chats WHERE application_id = ?');
    $stmt->bind_param('i', $applicationId);
    $stmt->execute();
    $stmt->close();

    // 4) удалить старые отклики, чтобы заявка стала "новой"
    $stmt = $mysqli->prepare('DELETE FROM requests WHERE application_id = ?');
    $stmt->bind_param('i', $applicationId);
    $stmt->execute();
    $stmt->close();

    // 5) удалить заявку
    $stmt = $mysqli->prepare('DELETE FROM Applications WHERE id = ? AND status = 9 LIMIT 1');
    $stmt->bind_param('i', $applicationId);
    $stmt->execute();
    $affected = $stmt->affected_rows;
    $stmt->close();

    if ($affected <= 0) {
        throw new Exception('delete failed');
    }

    $mysqli->commit();
    echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    $mysqli->rollback();
    echo json_encode(['ok' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}