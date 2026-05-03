<?php
header('Content-Type: application/json; charset=utf-8');

require_once '../auth_bootstep.php';
require_once '../connect.php';

function out(array $payload, int $code = 200): void {
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    out(['ok' => false, 'error' => 'Method not allowed'], 405);
}

if (!isset($_SESSION['user_id']) || (int)($_SESSION['user_role'] ?? 0) !== 1) {
    out(['ok' => false, 'error' => 'Forbidden'], 403);
}

$requestId = (int)($_POST['request_id'] ?? 0);
$action = trim((string)($_POST['action'] ?? ''));

if ($requestId <= 0 || !in_array($action, ['approve', 'reject'], true)) {
    out(['ok' => false, 'error' => 'Invalid input'], 422);
}

$mysqli->begin_transaction();

try {
    $stmt = $mysqli->prepare("
        SELECT r.id, r.application_id, r.user_id, r.status AS request_status, a.executor_id
        FROM requests r
        INNER JOIN Applications a ON a.id = r.application_id
        WHERE r.id = ?
        FOR UPDATE
    ");
    if (!$stmt) {
        throw new Exception('Prepare failed');
    }
    $stmt->bind_param('i', $requestId);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$row) {
        throw new Exception('Request not found');
    }

    if ((int)$row['request_status'] !== 0) {
        throw new Exception('Request already processed');
    }

    $applicationId = (int)$row['application_id'];
    $candidateUserId = (int)$row['user_id'];

    if ($action === 'approve') {
        $stmt = $mysqli->prepare("
            UPDATE Applications
            SET executor_id = ?, status = 2
            WHERE id = ? AND (executor_id IS NULL OR executor_id = ?)
            LIMIT 1
        ");
        if (!$stmt) {
            throw new Exception('Prepare failed');
        }
        $stmt->bind_param('iii', $candidateUserId, $applicationId, $candidateUserId);
        $stmt->execute();
        $affectedApp = $stmt->affected_rows;
        $stmt->close();

        if ($affectedApp <= 0) {
            throw new Exception('Application already assigned');
        }
        // chat
        $stmt = $mysqli->prepare("SELECT owner_id FROM Applications WHERE id = ? LIMIT 1");
        $stmt->bind_param('i', $applicationId);
        $stmt->execute();
        $appOwner = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        $ownerId = (int)($appOwner['owner_id'] ?? 0);
        if ($ownerId <= 0) {
            throw new Exception('Owner not found for application');
        }

        $stmt = $mysqli->prepare("
            INSERT INTO chats (application_id, owner_id, executor_id)
            VALUES (?, ?, ?)
        ");
        $stmt->bind_param('iii', $applicationId, $ownerId, $candidateUserId);
        $stmt->execute();
        $stmt->close();


        $stmt = $mysqli->prepare("
            UPDATE requests
            SET status = 1
            WHERE id = ? AND status = 0
            LIMIT 1
        ");
        if (!$stmt) {
            throw new Exception('Prepare failed');
        }
        $stmt->bind_param('i', $requestId);
        $stmt->execute();
        $affectedReq = $stmt->affected_rows;
        $stmt->close();

        if ($affectedReq <= 0) {
            throw new Exception('Approve failed');
        }

        $stmt = $mysqli->prepare("
            UPDATE requests
            SET status = 2
            WHERE application_id = ? AND id <> ? AND status = 0
        ");
        if (!$stmt) {
            throw new Exception('Prepare failed');
        }
        $stmt->bind_param('ii', $applicationId, $requestId);
        $stmt->execute();
        $stmt->close();
    } else {
        $stmt = $mysqli->prepare("
            UPDATE requests
            SET status = 2
            WHERE id = ? AND status = 0
            LIMIT 1
        ");
        if (!$stmt) {
            throw new Exception('Prepare failed');
        }
        $stmt->bind_param('i', $requestId);
        $stmt->execute();
        $affected = $stmt->affected_rows;
        $stmt->close();

        if ($affected <= 0) {
            throw new Exception('Reject failed');
        }
    }

    $mysqli->commit();
    out([
        'ok' => true,
        'action' => $action,
        'request_id' => $requestId,
        'application_id' => $applicationId
    ]);
} catch (Throwable $e) {
    $mysqli->rollback();
    out(['ok' => false, 'error' => $e->getMessage()], 400);
}
