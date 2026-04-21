<!DOCTYPE html>
<html lang="en">
<?php
    require_once './auth_bootstep.php';
    if (!isset($_SESSION['user_id'])) {
        header('Location: index.php');
        exit;
    }
    if ($_SESSION['user_role'] == 1){
        header('Location: nothing-to-watch-here/superSecret_adminRoom.php');
        exit;
    }
    //$years = (int)($_SESSION['exp_years'] ?? 0);
    $months = (int)($_SESSION['all_exp_months'] ?? 0);
    /*$yearWord = $years === 1 ? 'year' : 'years';
    $monthWord = $months === 1 ? 'month' : 'months';
    $expText = $years . ' ' . $yearWord . ' ' . $months . ' ' . $monthWord;*/
    $currentCountry = $_SESSION['country'] ?? '';
?>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Личный кабинет <?= $_SESSION['nickname']?></title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <a href="index.php" class="account__leave"><img src="images/account__leave.svg"></a>
    <form class = "personal_space" method = "post" action="account_update.php" enctype="multipart/form-data"> 
        <div class="personal__div_image">
            <img class="personal__avatar" src="users_avatars/<?=$_SESSION['AvatarFileName']?>">
            <div class="personal__avatar_upload_wrap">
            <input id="avatarInput" class="personal__avatar_upload_input" name="avatar" type="file" accept=".jpg,.jpeg,.png,.webp">
            <label for="avatarInput" class="personal__avatar_upload_btn">Change avatar</label>
            <span class="personal__avatar_upload_name"></span>
            </div>
        </div>
        <div class="personal__div_texts">
            <input class = "personal__name personal__input" name = "personal__name" type = "text" value = "<?=$_SESSION['name']?>">
            <p class = "personal__nickname"><?=$_SESSION['nickname']?></p>      
            <textarea class="personal__desc personal__input" name="personal__description"><?= $_SESSION['user_desc'] ?? '' ?></textarea>     
        </div>
        <div class="personal_exp">
            <input class = "personal__exp personal__input" name = "personal__experience" type = "text" value = "<?=$months?>">
        <p class="personal_exp_label"><?= $months === 1 ? 'month' : 'months' ?></p>
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
        <input class = "personal__cancel personal__input" type = "button" value = "Cancel">  
        <a href="logout.php">Выйти</a>
</form>
    <script src = "account_script.js"></script>
</body>
</html>