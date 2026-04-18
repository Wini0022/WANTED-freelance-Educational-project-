<?php

require_once './auth_bootstep.php';
require_once './connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
} //везде втыкать в form чтобы не было вбросов

$nickname = trim($_POST['account__nickname'] ?? '');
$password = $_POST['account__password'] ?? '';

if ($nickname === '' || $password === '') {
    $_SESSION['auth_error'] = 'Nickname and password are required';
    header('Location: index.php');
    exit;
}

$stmt = $mysqli->prepare('SELECT id, nickname, password_hash FROM users WHERE nickname = ?  LIMIT 1');
$stmt->bind_param('s', $nickname);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$user || !password_verify($password, $user['password_hash'])) {
    $_SESSION['auth_error'] = 'Wrong nickname or password :<';
    header('Location: index.php');
    exit;
}

$_SESSION['user_id'] = (int)$user['id'];
$_SESSION['nickname'] = $user['nickname'];

header('Location: index.php');
exit;

?>