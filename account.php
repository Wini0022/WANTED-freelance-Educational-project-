<!DOCTYPE html>
<html lang="en">
<?php
    require_once './auth_bootstep.php';
    if (!isset($_SESSION['user_id'])) {
        header('Location: index.php');
        exit;
    }
    $years = (int)($_SESSION['exp_years'] ?? 0);
    $months = (int)($_SESSION['exp_months'] ?? 0);
    $yearWord = $years === 1 ? 'year' : 'years';
    $monthWord = $months === 1 ? 'month' : 'months';
    $expText = $years . ' ' . $yearWord . ' ' . $months . ' ' . $monthWord;
    $currentCountry = $_SESSION['country'] ?? '';
?>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Личный кабинет <?= $_SESSION['nickname']?></title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <form class = "personal_space" method = "post" action="account_update.php" enctype="multipart/form-data"> 
        <div class="personal__div_image">
            <img class="personal__avatar" src="users_avatars/<?=$_SESSION['AvatarFileName']?>">
            <input class = "personal__avatar_upload" name = "avatar" type = "file" style = "background: url(personal__div_image_uploader)center/cover no-repeat">
        </div>
        <div class="personal__div_texts">
            <input class = "personal__name personal__input" name = "personal__name" type = "text" value = "<?=$_SESSION['name']?>">
            <p class = "personal__nickname"><?=$_SESSION['nickname']?></p>           
        </div>
        <div class="personal_exp">
            <input class = "personal__exp personal__input" name = "personal__experience" type = "text" placeholder = "<?=$expText?>">
        </div>
        <div class="personal_country">
            <select class="personal__country personal__input" name="country">
                <option value="" <?=  $currentCountry === '' ? 'selected' : '' ?>>Country</option>
                <option value="RU" <?=  $currentCountry === 'RU' ? 'selected' : '' ?>>Russia</option>
                <option value="US" <?=  $currentCountry === 'US' ? 'selected' : '' ?>>United States</option>
                <option value="DE" <?=  $currentCountry === 'DE' ? 'selected' : '' ?>>Germany</option>
                <option value="KZ" <?=  $currentCountry === 'KZ' ? 'selected' : '' ?>>Kazakhstan</option>
                <option value="OTHER" <?=  $currentCountry === 'OTHER' ? 'selected' : '' ?>>Other</option>
            </select>
        </div>
        <input class = "personal__submit personal__input" name = "personal__submit" type = "submit" value = "Enter">    
</form>
    <script src = "account_script.js"></script>
</body>
</html>