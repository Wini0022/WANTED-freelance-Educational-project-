<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../auth_bootstep.php';
require_once __DIR__ . '/../connect.php';

if (!isset($_SESSION['user_id']) || (int)($_SESSION['user_role'] ?? 0) !== 1) {
    echo json_encode(['ok' => false, 'error' => 'forbidden'], JSON_UNESCAPED_UNICODE);
    exit;
}
$title       = trim($_POST['title'] ?? '');
$deadline    = trim($_POST['deadline'] ?? '');
$description = trim($_POST['description'] ?? '');
$awardRaw    = trim((string)($_POST['award'] ?? ''));
$awardDesc   = trim($_POST['award_desc'] ?? '');
$currencyId  = (int)($_POST['currency_id'] ?? 0);
$categoryId  = (int)($_POST['category_id'] ?? 0);
$categoryNew = trim($_POST['category_new'] ?? '');

if ($currencyId <= 0) {
    $result = $mysqli->query('SELECT id FROM currencies ORDER BY id LIMIT 1');
    $currency = $result ? $result->fetch_assoc() : null;
    $currencyId = $currency ? (int)$currency['id'] : 0;
}

if ($deadline === '') {
    $deadline = 'No deadline';
}

if ($awardRaw === '') {
    $awardRaw = '0';
}

if ($awardDesc === '') {
    $awardDesc = 'Debit transfer';
}

if (
    $title === '' ||
    $description === '' ||
    !is_numeric($awardRaw) ||
    $currencyId <= 0 ||
    ($categoryId <= 0 && $categoryNew === '')
) {
    echo json_encode(['ok' => false, 'error' => 'Invalid form data'], JSON_UNESCAPED_UNICODE);
    exit;
}

$award = (float)$awardRaw;

if ($categoryNew !== '') {
    $stmt = $mysqli->prepare('SELECT id FROM categories WHERE LOWER(name) = LOWER(?) LIMIT 1');
    $stmt->bind_param('s', $categoryNew);
    $stmt->execute();
    $existingCategory = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($existingCategory) {
        $categoryId = (int)$existingCategory['id'];
    } else {
        $stmt = $mysqli->prepare('INSERT INTO categories (name) VALUES (?)');
        $stmt->bind_param('s', $categoryNew);
        $stmt->execute();
        $categoryId = $stmt->insert_id; //insert_id — это id последней строки, которую MySQL создал через INSERT
        $stmt->close();
    }
}

$stmt = $mysqli->prepare('
    INSERT INTO Applications
        (title, category_id, deadline, award, currency_id, award_desc, description, status)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, 0)
');

$stmt->bind_param(
    'sisdiss',
    $title,
    $categoryId,
    $deadline,
    $award,
    $currencyId,
    $awardDesc,
    $description
);

$ok = $stmt->execute();
$stmt->close();

echo json_encode([
    'ok' => $ok,
    'error' => $ok ? null : 'Create failed'
], JSON_UNESCAPED_UNICODE);
exit;