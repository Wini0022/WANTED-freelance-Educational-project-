<?php
require_once '../auth_bootstep.php';
require_once '../connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: superSecret_adminRoom.php');
    exit;
}

if (!isset($_SESSION['user_id']) || (int)($_SESSION['user_role'] ?? 0) !== 1) {
    header('Location: ../index.php');
    exit;
}

$applicationId = (int)($_POST['application_id'] ?? 0);
$title         = trim($_POST['title'] ?? '');
$deadline      = trim($_POST['deadline'] ?? '');
$awardRaw      = trim((string)($_POST['award'] ?? ''));
$currencyId    = (int)($_POST['currency_id'] ?? 0);
$categoryId    = (int)($_POST['category_id'] ?? 0);
$awardDesc     = trim($_POST['award_desc'] ?? '');
$description   = trim($_POST['description'] ?? '');

if (
    $applicationId <= 0 ||
    $title === '' ||
    $deadline === '' ||
    $awardRaw === '' ||
    !is_numeric($awardRaw) || // is_numeric число ли
    $currencyId <= 0 ||
    $categoryId <= 0 ||
    $description === ''
) {
    $_SESSION['admin_error'] = 'Invalid form data';
    header('Location: superSecret_adminRoom.php');
    exit;
}

$award = (float)$awardRaw; // целое

// редактируем только офферы без откликов
$stmt = $mysqli->prepare('SELECT id FROM requests WHERE application_id = ? LIMIT 1');
$stmt->bind_param('i', $applicationId);
$stmt->execute();
$hasResponse = $stmt->get_result()->fetch_assoc();
$stmt->close();

if ($hasResponse) {
    $_SESSION['admin_error'] = 'Offer already has responses. Please update this page.';
    header('Location: superSecret_adminRoom.php');
    exit;
}

$stmt = $mysqli->prepare('
    UPDATE Applications
    SET title = ?, category_id = ?, deadline = ?, award = ?, currency_id = ?, award_desc = ?, description = ?
    WHERE id = ? AND status = 0
    LIMIT 1
');
$stmt->bind_param(
    'sisdissi',
    $title,
    $categoryId,
    $deadline,
    $award,
    $currencyId,
    $awardDesc,
    $description,
    $applicationId
);

$ok = $stmt->execute();
$affected = $stmt->affected_rows;
$stmt->close();

$_SESSION['admin_info'] = ($ok && $affected > 0) ? 'Offer updated' : 'No changes';
header('Location: superSecret_adminRoom.php');
exit;
