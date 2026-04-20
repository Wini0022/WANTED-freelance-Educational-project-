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

$stmt = $mysqli->prepare('SELECT id, nickname, name, avatar, password_hash, country, role, user_desc, experience_months FROM users WHERE nickname = ?  LIMIT 1');
$stmt->bind_param('s', $nickname);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$user || !password_verify($password, $user['password_hash'])) {
    $_SESSION['auth_error'] = 'Wrong nickname or password :<';
    header('Location: index.php');
    exit;
}

$avatar = trim((string)($user['avatar'] ?? ''));
$_SESSION['AvatarFileName'] = $avatar !== '' ? $avatar : 'user_default.png';


$_SESSION['user_id'] = (int)$user['id'];
$_SESSION['user_role'] = (int)$user['role'];
$_SESSION['nickname'] = $user['nickname'] ?? '';
$_SESSION['country'] = $user['country'] ?? '';
$_SESSION['name'] = $user['name'] ?? '';
$_SESSION['user_desc'] = $user['user_desc'] ?? '';
$experienceMonths = max(0, (int)($user['experience_months'] ?? 0));

$_SESSION['exp_years'] = intdiv($experienceMonths, 12); //intdiv - целочисленное деление без дроби
$_SESSION['exp_months'] = $experienceMonths % 12;


header('Location: index.php');
exit;

?>