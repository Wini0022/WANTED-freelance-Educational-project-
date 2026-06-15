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
    $experienceOptions = [
        0 => 'No experience',
        6 => 'Up to 6 months',
        12 => '6-12 months',
        24 => '1-2 years',
        36 => '2-3 years',
        60 => '3-5 years',
        120 => '5+ years',
    ];
    /*$yearWord = $years === 1 ? 'year' : 'years';
    $monthWord = $months === 1 ? 'month' : 'months';
    $expText = $years . ' ' . $yearWord . ' ' . $months . ' ' . $monthWord;*/
    $currentCountry = $_SESSION['country'] ?? '';
    $error = $_SESSION['auth_error'] ?? null;
    unset($_SESSION['auth_error'], $_SESSION['profile_info'], $_SESSION['profile_saved']);

    $avatarFile = htmlspecialchars($_SESSION['AvatarFileName'] ?? 'user_default.png', ENT_QUOTES, 'UTF-8');
    $name = htmlspecialchars($_SESSION['name'] ?? '', ENT_QUOTES, 'UTF-8');
    $nickname = htmlspecialchars($_SESSION['nickname'] ?? '', ENT_QUOTES, 'UTF-8');
    $userDesc = htmlspecialchars($_SESSION['user_desc'] ?? '', ENT_QUOTES, 'UTF-8');
?>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Личный кабинет <?= $nickname ?></title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <a href="index.php" class="account__leave"><img src="images/close-button.svg"></a>
    <form class = "personal_space" method = "post" action="account_update.php" enctype="multipart/form-data"> 
        <div class="personal__div_image">
            <div class="personal__avatar_wrap">
                <label for="avatarInput" class="personal__avatar_preview_label">
                    <img class="personal__avatar" src="users_avatars/<?= $avatarFile ?>" alt="">
                </label>
                <input id="avatarInput" class="personal__avatar_upload_input" name="avatar" type="file" accept=".jpg,.jpeg,.png,.webp">
                <label for="avatarInput" class="personal__avatar_button">
                    <img src="images/upload_image-button.svg" alt="">
                </label>
            </div>
            <span class="personal__avatar_upload_name"></span>
        </div>
        <div class="personal__div_texts">
            <input id="personalName" class = "personal__name personal__input" name = "personal__name" type = "text" value = "<?= $name ?>" required autocomplete="name">
            <input id="personalNickname" class="personal__nickname personal__input" type="text" value="<?= $nickname ?>" readonly>
            <textarea id="personalDescription" class="personal__desc personal__input" name="personal__description"><?= $userDesc ?></textarea>
        </div>
        <div class="personal_exp">
            <select id="personalExperience" class="personal__exp personal__input" name="personal__experience">
                <?php if (!array_key_exists($months, $experienceOptions)): ?>
                    <option value="<?= $months ?>" selected><?= $months ?> months</option>
                <?php endif; ?>
                <?php foreach ($experienceOptions as $value => $label): ?>
                    <option value="<?= $value ?>" <?= $months === $value ? 'selected' : '' ?>><?= $label ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="personal_country">
            <select id="personalCountry" class="personal__country personal__input" name="country" required>
                <option value="" <?=  $currentCountry === '' ? 'selected' : '' ?> disabled>Country</option>
                <option value="RU" <?=  $currentCountry === 'RU' ? 'selected' : '' ?>>Russia 🇷🇺</option>
                <option value="US" <?=  $currentCountry === 'US' ? 'selected' : '' ?>>United States 🇺🇸</option>
                <option value="DE" <?=  $currentCountry === 'DE' ? 'selected' : '' ?>>Germany 🇩🇪</option>
                <option value="KZ" <?=  $currentCountry === 'KZ' ? 'selected' : '' ?>>Kazakhstan 🇰🇿</option>
                <option value="OTHER" <?=  $currentCountry === 'OTHER' ? 'selected' : '' ?>>Other 🇺🇳</option>
            </select>
        </div>

        <?php if ($error): ?>
            <p class="personal__form_message personal__form_error"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p>
        <?php endif; ?>

        <a href="logout.php">Log out</a>
        <div class="personal__actions">
            <input class = "personal__submit personal__input" name = "personal__submit" type = "submit" value = "Save">
            <input class = "personal__cancel personal__input" type = "button" value = "Cancel">
        </div>
</form>
    <script>
        window.ACCOUNT_USER_ID = <?= (int)$_SESSION['user_id'] ?>;
        window.PROFILE_SAVED = <?= !empty($_SESSION['profile_saved']) ? 'true' : 'false' ?>;
    </script>
    <script src = "account_script.js"></script>
</body>
</html>
