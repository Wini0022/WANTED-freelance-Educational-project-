<!DOCTYPE html>
<html lang="en">
<?php
    require_once '../auth_bootstep.php';
    if (!isset($_SESSION['user_id'])) {
        header('Location: index.php');
        exit;
    }
?>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $_SESSION['name']?>'s Admin panel</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h2 class="admin__title">Welcome to admin panel, <?= $_SESSION['name']?>! 👑</h2>
</body>
</html>