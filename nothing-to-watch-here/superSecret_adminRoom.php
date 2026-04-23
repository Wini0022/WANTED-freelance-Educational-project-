<!DOCTYPE html>
<html lang="en">
<?php
    require_once '../auth_bootstep.php';
    if (!isset($_SESSION['user_id'])) {
        header('Location: ../index.php');
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
    <div class="admin__panel">

        <div class="admin__panel_section admin__panel_section-without">

            <div class="admin__pnael_container-trigger">Without response</div> 
            <div class = "admin__containers_searching">
                <!--Как нибудь попозже-->
            </div>

            <div class="admin__containers admin__containers_without">

            </div>

        </div>
        <div class="admin__panel_section admin__panel_section-responses">

            <div class="admin__pnael_container-trigger">Responses</div> 
            <div class = "admin__containers_searching">
                <!--Как нибудь попозже-->
            </div>

            <div class="admin__containers admin__containers_response">
                <div class="admin__panel_container">
                    <div class = "admin__container_info">
                        <div class = "admin__container_top">
                            <p class="admin__specilization">specilization</p>
                        </div>
                        <div class="admin__container_texts">
                            <h3 class="admin__container_title">title</h3>
                            <div class = "admin__container_texts_top">
                                <h3 class="admin__container_award">award</h3>
                                <p class = "admin__container_award_desc">award_desc</p>
                            </div>
                            <p class="admin__container_desc">description</p>
                        </div>
                    </div>
                    <div class="admin__container_reviews">

                        <div class="admin__review">
                            <div class="admin__review_top">
                                <div class="admin__review_top_user">
                                    <img src="users_avatars/content" class="admin__review_avatar">
                                    <div>
                                        <p class="admin__review_name">Name</p>
                                        <p class="admin__review_exp">Experience</p>
                                    </div>
                                </div>
                                <p class="admin__review_number">number</p>
                            </div>
                            <button class = "delete_container">Delete</button>
                            <p class="admin__review_desc">User description</p>
                            <div class="admin__review_buttons">
                                <button class = "admin__review_button admin__review_approve admin__review_response_approve">Claim award</button>
                                <button class = "admin__review_button admin__review_reject admin__review_response_reject">Reject</button>                                
                            </div>
                        </div>

                    </div>
            </div>

        </div>

    </div>
    <script src = "./superSecretScript.js"></script>
    <script src = "./without_update.js"></script>
</body>
</html>