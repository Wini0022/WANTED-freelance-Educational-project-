<?php
require_once './auth_bootstep.php';
require_once './connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

$name = trim($_POST['account__name'] ?? ''); //$_POST для всееех form и вообще всего что этим передаем
$nickname = trim($_POST['account__nickname'] ?? '');
$country = trim($_POST['country'] ?? '');
$password = $_POST['account__password'] ?? '';

if ($name === '' || $nickname === '' || $country === '' || mb_strlen($password) < 5) {
    $_SESSION['auth_error'] = 'You should fill all reqiured rows';
    header('Location: index.php');
    exit; // прекращение работы остального кода
}

$stmt = $mysqli->prepare('SELECT id FROM users WHERE nickname = ? LIMIT 1');
$stmt->bind_param('s', $nickname); //привязка к ?
$stmt->execute(); // execute выполнение запроса
$exists = $stmt->get_result()->fetch_assoc();
$stmt->close();

if ($exists) {
    $_SESSION['auth_error'] = 'Nickname already exists';
    header('Location: index.php');
    exit;
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $mysqli->prepare('INSERT INTO users (name, nickname, country, password_hash) VALUES (?, ?, ?, ?)');
$stmt->bind_param('ssss', $name, $nickname, $country, $passwordHash);
$ok = $stmt->execute();
$stmt->close();

if (!$ok) {
    $_SESSION['auth_error'] = 'Registration failed. Something went wrong.';
    header('Location: index.php');
    exit;
}

$_SESSION['user_id'] = (int)$mysqli->insert_id;
$_SESSION['nickname'] = $nickname;

header('Location: index.php');
exit;