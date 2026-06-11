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

        $authSuccess = $_SESSION['auth_success'] ?? false;
        unset($_SESSION['auth_success']);

        $loginSuccess = $_SESSION['login_success'] ?? false;
        unset($_SESSION['login_success']);

        $isAuth = isset($_SESSION['user_id']);
        $isAdmin = $isAuth && (int)($_SESSION['user_role'] ?? 0) === 1;
        $error = $_SESSION['auth_error'] ?? null;
        unset($_SESSION['auth_error']); //unset удалить
    ?>
    <?php
        if ($isAuth): 
    ?>
    <header>
        <img class = "header__logo" src = "images/rush_logo.svg">
        <a class ="accont" href = "account.php">
            <p class="account_nickname"><?= $_SESSION['nickname'] ?></p>
            <img class = "accont__image" src="users_avatars/<?=$_SESSION['AvatarFileName']?>">
        </a>
    </header>
    <?php endif ?>
    <?php
        if (!$isAuth): 
    ?>
    <div class="auth_overlay">
        <section class = "account__enter" data-auth-panel="register">
            <button type="button" class="account__enter_close"><img class = "account__enter_close_img" src = "images/close-button.svg"></button>
            <h2 class="account__enter_title">Create account</h2>
            <form class="account__enter_inputs" method="post" action="registration.php" enctype="multipart/form-data">

                <div class="account__avatar_wrap">
                    <label for="accountAvatar" class="account__avatar_preview_label">
                        <img class="account__avatar_preview" src="users_avatars/user_default.png" alt="">
                    </label>

                    <input id="accountAvatar" class="account__avatar account__input" name="avatar" type="file" accept=".jpg,.jpeg,.png,.webp">

                    <label for="accountAvatar" class="account__avatar_button">
                        <img src="images/upload_image-button.svg" alt="">
                    </label>
                </div>
                <div class = "account__inputs_wrap">
                    <input class = "account__name account__input" name = "account__name" type = "text" placeholder = "Name Surname" required autocomplete="name">
                    <input class = "account__nickname account__input" name = "account__nickname" type = "text" placeholder = "Nickname" required autocomplete="new-username">
                    <textarea class = "account__desc account__input" name = "account__description" placeholder = "Your portfolio shortly"></textarea>
                    <div class = "account__inputs_row">
                        <select class="account__country account__input" name="country" required>
                            <option value="" selected disabled>Country</option>
                            <option value="RU">Russia&nbsp;&nbsp🇷🇺</option>
                            <option value="US">United States&nbsp;&nbsp🇺🇸</option>
                            <option value="DE">Germany&nbsp;&nbsp🇩🇪</option>
                            <option value="KZ">Kazakhstan&nbsp;&nbsp🇰🇿</option>
                            <option value="OTHER">Other&nbsp;&nbsp🌎</option>
                        </select>
                        <select class="account__exp account__input" name="account__experience">
                            <option value="0" selected>No experience</option>
                            <option value="6">Up to 6 months</option>
                            <option value="12">6-12 months</option>
                            <option value="24">1-2 years</option>
                            <option value="36">2-3 years</option>
                            <option value="60">3-5 years</option>
                            <option value="120">5+ years</option>
                        </select>
                     </div>

                    <input type="password" class = "account__password account__input" name = "account__password" placeholder = "Password" required minlength = "5" autocomplete="new-password">
                </div>

                <input class = "account__submit account__input" disabled name = "account__submit" type = "submit" value = "Start now">            
            </form>
        </section>
    </div>
    <div class="auth_overlay">
        <section class = "account__enter" data-auth-panel="login">
            <button type="button" class="account__enter_close"><img class = "account__enter_close_img" src = "images/close-button.svg"></button>
            <h2 class="account__enter_title account__enter_login">Log in</h2>
            <form class="account__enter_inputs" method="post" action="login.php">
                <div class = "account__inputs_wrap">
                    <input class = "account__nickname account__input" name = "account__nickname" autocomplete="username" type = "text" placeholder = "Nickname" required>
                    <input class = "account__password account__input" name = "account__password" type = "password" placeholder = "Password" required minlength = "5" autocomplete="current-password">   
                </div>
                <?php if ($error): ?>
                    <p class="account__auth_error"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p>
                <?php endif ?>
                <input class = "account__submit account__input" disabled name = "account__submit" type = "submit" value = "Enter">   
            </form>
        </section>
    </div>
    <section class = "landing">
        <!--<h3>FREELANCE</h3>
        <h1 class="freelance__wanted_title">WANTED</h1> rest in peace 💔-->
        <div class = "landing__top">
           <img class = "landing__logo" src = "images/rush_logo.svg">
           <p class="landing__text">FREELANCE<br> WITHOUT BORDERS.</p>
        </div> 
        <div class = "landing__buttons">
            <button class = "freelance__button" data-auth-target="register">Start now</button>
            <button class = "freelance__button freelance__button_login" data-auth-target="login">Log in</button>
        </div>

    </section>
    <?php endif ?>
    <div class = "top__offers_wrap">
        <section class="offers offers__considered<?= (!$isAuth || $isAdmin) ? ' offers__admin-hidden' : '' ?>" data-section="considered">
            <button type="button" class="offers__section_trigger">Being considered 👀</button>

            <div class="offers__section_body">

                <div class="offers__containers_searching">
                    <input class="offers__search_input offers__considered_search_input" type="search" placeholder="Search offer...">

                    <div class="offers__searching_bottom">
                        <div class="offers__search_sort">
                            <button type="button" class="offers__search_sort-trigger offers__considered_search_sort-trigger" aria-label="Filter">
                                <img class="offers__trigger_image offers__trigger_image_not-available" src="images/filter_not-available_icon.svg" alt="">
                            </button>

                            <div class="offers__search_sort_options">
                                <button type="button" class="offers__search_sort-option offers__considered_search_sort-option offers__search_chip-active" data-sort="default">Default</button>
                                <button type="button" class="offers__search_sort-option offers__considered_search_sort-option" data-sort="award_desc">Award: high to low</button>
                                <button type="button" class="offers__search_sort-option offers__considered_search_sort-option" data-sort="award_asc">Award: low to high</button>
                            </div>
                        </div>
                        <div class="offers__search_categories offers__considered_search_categories"></div>
                    </div>
                </div>

                <div class="offers__containers offers__considered_containers"></div>
            </div>
        </section>

        <section class="offers offers__chats<?= (!$isAuth || $isAdmin) ? ' offers__admin-hidden' : '' ?>" data-section="chats">
            <button type="button" class="offers__section_trigger">Active work & Chats 💼</button>

            <div class="offers__section_body">

                <div class="offers__containers_searching">
                    <input class="offers__search_input offers__chats_search_input" type="search" placeholder="Search offer...">

                    <div class="offers__searching_bottom">
                        <div class="offers__search_sort">
                            <button type="button" class="offers__search_sort-trigger offers__chats_search_sort-trigger" aria-label="Filter">
                                <img class="offers__trigger_image offers__trigger_image_not-available" src="images/filter_not-available_icon.svg" alt="">
                            </button>

                            <div class="offers__search_sort_options">
                                <button type="button" class="offers__search_sort-option offers__chats_search_sort-option offers__search_chip-active" data-sort="default">Default</button>
                                <button type="button" class="offers__search_sort-option offers__chats_search_sort-option" data-sort="award_desc">Award: high to low</button>
                                <button type="button" class="offers__search_sort-option offers__chats_search_sort-option" data-sort="award_asc">Award: low to high</button>
                            </div>
                        </div>
                        <div class="offers__search_categories offers__chats_search_categories"></div>
                    </div>
                </div>

                <div class="offers__containers offers__chats_containers"></div>
            </div>
        </section>

        <section class="offers offers__done<?= (!$isAuth || $isAdmin) ? ' offers__admin-hidden' : '' ?>" data-section="done">
            <button type="button" class="offers__section_trigger">Done ✅</button>

            <div class="offers__section_body">

                <div class="offers__containers_searching">
                    <input class="offers__search_input offers__done_search_input" type="search" placeholder="Search offer...">

                    <div class="offers__searching_bottom">
                        <div class="offers__search_sort">
                            <button type="button" class="offers__search_sort-trigger offers__done_search_sort-trigger" aria-label="Filter">
                                <img class="offers__trigger_image offers__trigger_image_not-available" src="images/filter_not-available_icon.svg" alt="">
                            </button>

                            <div class="offers__search_sort_options">
                                <button type="button" class="offers__search_sort-option offers__done_search_sort-option offers__search_chip-active" data-sort="default">Default</button>
                                <button type="button" class="offers__search_sort-option offers__done_search_sort-option" data-sort="award_desc">Award: high to low</button>
                                <button type="button" class="offers__search_sort-option offers__done_search_sort-option" data-sort="award_asc">Award: low to high</button>
                            </div>
                        </div>
                        <div class="offers__search_categories offers__done_search_categories"></div>
                    </div>
                </div>

                <div class="offers__containers offers__done_containers"></div>
            </div>
        </section>
    </div> 


    <section class="offers offers__available" data-section="available">
        <h2 class = "offers__available_title">All global offers  🌎</h2>
        <div class="offers__section_body offers__section_body_available">

            <div class="offers__containers_searching">
                <div class = "offers__available_top">
                    <input class="offers__search_input offers__available_search_input" type="search" placeholder="Search offer...">
                    <div class="offers__search_sort">
                        <button type="button" class="offers__search_sort-trigger offers__available_search_sort-trigger"><img class = "offers__trigger_image" src = "images/filter_icon.svg"></button>
                        <div class="offers__search_sort_options">
                            <button type="button" class="offers__search_sort-option offers__available_search_sort-option offers__search_chip-active" data-sort="default">Default</button>
                            <button type="button" class="offers__search_sort-option offers__available_search_sort-option" data-sort="award_desc">💰 High to low</button>
                            <button type="button" class="offers__search_sort-option offers__available_search_sort-option" data-sort="award_asc">💰 Low to high</button>
                        </div>
                    </div>
                </div>
                <div class="offers__search_categories offers__available_search_categories"></div>
            </div>

            <div class="offers__containers offers__available_containers"></div>
        </div>
    </section>
    <script>
        window.IS_AUTH = <?= $isAuth ? 'true' : 'false' ?>;
        window.AUTH_SUCCESS = <?= $authSuccess ? 'true' : 'false' ?>;
        window.LOGIN_SUCCESS = <?= $loginSuccess ? 'true' : 'false' ?>;
    </script>
    <script src = "viewing_offers.js"></script>
    <script src = "script.js" ></script>
</body>
</html>
