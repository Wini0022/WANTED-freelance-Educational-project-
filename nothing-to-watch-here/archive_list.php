<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../auth_bootstep.php';
require_once __DIR__ . '/../connect.php';

if (!isset($_SESSION['user_id']) || (int)($_SESSION['user_role'] ?? 0) !== 1) {
    echo json_encode(['ok' => false, 'error' => 'forbidden'], JSON_UNESCAPED_UNICODE);
    exit;
}

$mysqli->begin_transaction();
try {
    $mysqli->query("
        DELETE cm
        FROM chat_messages cm
        JOIN chats c ON c.id = cm.chat_id
        JOIN Applications a ON a.id = c.application_id
        WHERE a.status = 9
          AND a.archived_at IS NOT NULL
          AND a.archived_at <= (NOW() - INTERVAL 30 DAY)
    ");

    $mysqli->query("
        DELETE c
        FROM chats c
        JOIN Applications a ON a.id = c.application_id
        WHERE a.status = 9
          AND a.archived_at IS NOT NULL
          AND a.archived_at <= (NOW() - INTERVAL 30 DAY)
    ");

    $mysqli->query("
        DELETE r
        FROM requests r
        JOIN Applications a ON a.id = r.application_id
        WHERE a.status = 9
          AND a.archived_at IS NOT NULL
          AND a.archived_at <= (NOW() - INTERVAL 30 DAY)
    ");

    $mysqli->query("
        DELETE FROM Applications
        WHERE status = 9
          AND archived_at IS NOT NULL
          AND archived_at <= (NOW() - INTERVAL 30 DAY)
    ");

    $mysqli->commit();
} catch (Throwable $e) {
    $mysqli->rollback();
    echo json_encode(['ok' => false, 'error' => 'cleanup failed'], JSON_UNESCAPED_UNICODE);
    exit;
}

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
      u.name,
      u.nickname,
      u.avatar,
      u.user_desc,
      u.experience_months,
      a.archived_at,
      GREATEST(0, TIMESTAMPDIFF(DAY, NOW(), DATE_ADD(a.archived_at, INTERVAL 30 DAY))) AS days_left
  FROM Applications a
  LEFT JOIN categories cat ON cat.id = a.category_id
  LEFT JOIN currencies cur ON cur.id = a.currency_id
  LEFT JOIN chats c ON a.id = c.application_id
  LEFT JOIN Users u ON u.id = c.executor_id
  WHERE a.status = 9
  ORDER BY a.archived_at DESC
"); //GREATEST(0, ...) → если уже просрочено, не дает минус, возвращает 0. TIMESTAMPDIFF разница в днях от сейчас до даты удаления.
$stmt->execute();
$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

echo json_encode(['ok' => true, 'archive' => $rows], JSON_UNESCAPED_UNICODE);
