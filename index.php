<?php
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WANTED биржа фрилансов</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <?php
        require_once './auth_bootstep.php'; // одна . показывает что это в этой же папке
        $isAuth = isset($_SESSION['user_id']);
        $error = $_SESSION['auth_error'] ?? null;
        echo($error);
        unset($_SESSION['auth_error']); //unset удалить
    ?>
    <?php
        if ($isAuth): 
    ?>
    <a href="logout.php">Выйти</a>

    <a class ="accont" href = "account.php">
        <p class="account_nickname"><?= $_SESSION['nickname'] ?></p>
        <img src="users_avatars/<?=$_SESSION['AvatarFileName']?>">
    </a>
    <?php endif ?>
    <?php
        if (!$isAuth): 
    ?>
    <section class = "account__enter">
        <h2 class="account__enter_title">Регистрация</h2>
        <form class="account__enter_inputs" method="post" action="registration.php" enctype="multipart/form-data">
            <input class = "account__avatar account__input" name = "avatar" type = "file" placeholder = "Avatar image">
            <input class = "account__name account__input" name = "account__name" type = "text" placeholder = "Name Surname" required autocomplete="name">
            <input class = "account__nickname account__input" name = "account__nickname" type = "text" placeholder = "Nickname" required autocomplete="new-username">
            <input class = "account__desc account__input" name = "account__description" type = "textarea" placeholder = "Your portfolio shortly" required>
            <input class = "account__exp account__input" name = "account__experience" type = "text" placeholder = "Experience in months" required >
            <select class="account__country account__input" name="country" required>
                <option value="" selected disabled>Country</option>
                <option value="RU">Russia</option>
                <option value="US">United States</option>
                <option value="DE">Germany</option>
                <option value="KZ">Kazakhstan</option>
                <option value="OTHER">Other</option>
            </select>
            <input class = "account__password account__input" name = "account__password" type = "password" placeholder = "Password" required minlength = "5" autocomplete="new-password">
            <input class = "account__submit account__input" name = "account__submit" type = "submit" value = "Enter">            
        </form>
    </section>
    <section class = "account__enter">
        <h2 class="account__enter_title">Вход</h2>
        <form class="account__enter_inputs" method="post" action="login.php">
            <input class = "account__nickname account__input" name = "account__nickname" autocomplete="username" type = "text" placeholder = "Nickname" required>
            <input class = "account__password account__input" name = "account__password" type = "password" placeholder = "Password" required minlength = "5" autocomplete="current-password">   
            <input class = "account__submit account__input" name = "account__submit" type = "submit" value = "Enter">   
        </form>
    </section>
    <?php endif ?>
    <header>
        <h3>FREELANCE</h3>
        <h1 class="freelance__wanted_title">WANTED</h1>
        <?php
            if (!$isAuth): 
        ?>
        <button class = "freelance__button">Find your award</button>
        <?php endif ?>
    </header>
    <section class="offers offers__considered">
        <h3 class = "offers__title">Being considered 👀</h3>
        <div class="offers__containers offers__considered_containers">
        </div>
    </section>
    <section class="offers offers__approved" style = "display: none">
        <h3 class = "offers__title">Your approved offers 💪</h3>
        <div class="offers__containers offers__approved_containers">
        </div>
    </section>
    <section class="offers offers__available">
        <h3 class = "offers__title">Available offers 🌍 </h3>
        <div class="offers__containers offers__available_containers">

        </div>
    </section>
    <script>
        window.IS_AUTH = <?= $isAuth ? 'true' : 'false' ?>;
    </script>
    <script src = "viewing_offers.js"></script>
    <script src = "script.js" ></script>
</body>
</html>