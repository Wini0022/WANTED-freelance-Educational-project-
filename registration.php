<?php
require_once './auth_bootstep.php';
require_once './connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

$name = trim($_POST['account__name'] ?? ''); //$_POST для всееех form и вообще всего что этим передаем
$nickname = trim($_POST['account__nickname'] ?? '');

$expRaw = trim($_POST['account__experience'] ?? '');

if ($expRaw === '' || !ctype_digit($expRaw)) { //ctype_digit цифры
    $_SESSION['auth_error'] = 'Experience must be a non-negative integer (months)';
    header('Location: index.php');
    exit;
}

$experience_months = (int)$expRaw;

if ($experience_months > 1200) { // защитный потолок
    $_SESSION['auth_error'] = 'You lie man';
    header('Location: index.php');
    exit;
}

$user_desc = trim($_POST['account__description'] ?? '');
$country = trim($_POST['country'] ?? '');
$password = $_POST['account__password'] ?? '';

// form: <form method="post" enctype="multipart/form-data">

$avatarFileName = null;

if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] !== UPLOAD_ERR_NO_FILE) {
    $file = $_FILES['avatar'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        die('Ошибка загрузки файла');
    }

    $maxSize = 2 * 1024 * 1024; // 2MB
    if ($file['size'] > $maxSize) {
        die('Файл слишком большой');
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE); //тип файла
    $mime = $finfo->file($file['tmp_name']);

    $allowed = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    ];

    if (!isset($allowed[$mime])) {
        die('Разрешены только JPG, PNG, WEBP');
    }

    $ext = $allowed[$mime];
    $uploadDir = __DIR__ . '/users_avatars';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $avatarFileName = 'avatar_' . bin2hex(random_bytes(8)) . '.' . $ext;
    $targetPath = $uploadDir . '/' . $avatarFileName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        die('Не удалось сохранить файл');
    }
}
else{
    $avatarFileName = "user_default.png";
}



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

$stmt = $mysqli->prepare('INSERT INTO users (name, nickname, avatar, user_desc, country, experience_months, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)');
$stmt->bind_param('sssssis', $name, $nickname, $avatarFileName, $user_desc, $country, $experience_months, $passwordHash);
$ok = $stmt->execute();
$stmt->close();


if (!$ok) {
    $_SESSION['auth_error'] = 'Registration failed. Something went wrong.';
    header('Location: index.php');
    exit;
}


header('Location: index.php');
exit;