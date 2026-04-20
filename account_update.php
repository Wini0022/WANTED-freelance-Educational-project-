<?php

require_once './auth_bootstep.php';
require_once './connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: account.php');
    exit;
}

$userId = (int)$_SESSION['user_id'];

$name = trim($_POST['personal__name'] ?? '');
$country = trim($_POST['country'] ?? '');
$expRaw = trim($_POST['personal__experience'] ?? '');
$user_desc = trim($_POST['personal__description'] ?? ($_SESSION['user_desc'] ?? ''));

if ($name === '') {
    $_SESSION['auth_error'] = 'Name is required';
    header('Location: account.php');
    exit;
}

// placeholder можно оставить: если поле опыта пустое, берем старое из сессии
$currentMonths = ((int)($_SESSION['exp_years'] ?? 0) * 12) + (int)($_SESSION['exp_months'] ?? 0);
$experience_months = $currentMonths;

if ($expRaw !== '') {
    if (!ctype_digit($expRaw)) {
        $_SESSION['auth_error'] = 'Experience must be integer months';
        header('Location: account.php');
        exit;
    }
    $experience_months = (int)$expRaw;
}

if ($experience_months < 0 || $experience_months > 1200) {
    $_SESSION['auth_error'] = 'Experience out of range';
    header('Location: account.php');
    exit;
}

// по умолчанию оставляем текущую аватарку
$avatarFileName = (string)($_SESSION['AvatarFileName'] ?? 'user_default.png');

$oldAvatar = (string)($_SESSION['AvatarFileName'] ?? 'user_default.png');
$newAvatar = $oldAvatar;
$newAvatarUploaded = false;
$newAvatarPath = '';

if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] !== UPLOAD_ERR_NO_FILE) {
    $file = $_FILES['avatar'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        $_SESSION['auth_error'] = 'Avatar upload error';
        header('Location: account.php');
        exit;
    }

    $maxSize = 2 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        $_SESSION['auth_error'] = 'Avatar too large (max 2MB)';
        header('Location: account.php');
        exit;
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);

    $allowed = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    ];

    if (!isset($allowed[$mime])) {
        $_SESSION['auth_error'] = 'Only JPG, PNG, WEBP allowed';
        header('Location: account.php');
        exit;
    }

    $ext = $allowed[$mime];
    $uploadDir = __DIR__ . '/users_avatars';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $avatarFileName = 'avatar_' . bin2hex(random_bytes(8)) . '.' . $ext;
    $targetPath = $uploadDir . '/' . $avatarFileName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        $_SESSION['auth_error'] = 'Failed to save avatar';
        header('Location: account.php');
        exit;
    }
    $newAvatar = $avatarFileName;
    $newAvatarUploaded = true;
    $newAvatarPath = $targetPath;
}

$stmt = $mysqli->prepare('UPDATE users SET name = ?, avatar = ?, user_desc = ?, country = ?, experience_months = ? WHERE id = ? LIMIT 1');
$stmt->bind_param('ssssii', $name, $newAvatar, $user_desc, $country, $experience_months, $userId);

$ok = $stmt->execute();
$affectedRows = $stmt->affected_rows;
$stmt->close();

if (!$ok) {
    $_SESSION['auth_error'] = 'Update failed';
    header('Location: account.php');
    exit;
}
if ($ok) {
    if ($newAvatarUploaded && $oldAvatar !== 'user_default.png' && $oldAvatar !== $newAvatar) {
        $oldPath = __DIR__ . '/users_avatars/' . $oldAvatar;
        if (is_file($oldPath) && !unlink($oldPath)) {
            error_log('Avatar delete failed: ' . $oldPath);
        }
    }
} else {
    if ($newAvatarUploaded && is_file($newAvatarPath)) {
        unlink($newAvatarPath);
    }
    $_SESSION['auth_error'] = 'Update failed';
    header('Location: account.php');
    exit;
}
$_SESSION['name'] = $name;
$_SESSION['country'] = $country;
$_SESSION['user_desc'] = $user_desc;
$_SESSION['AvatarFileName'] = $newAvatar;
$_SESSION['exp_years'] = intdiv($experience_months, 12);
$_SESSION['exp_months'] = $experience_months % 12;

$_SESSION['profile_info'] = ($affectedRows > 0) ? 'Profile updated' : 'No changes';

header('Location: account.php');
exit;
