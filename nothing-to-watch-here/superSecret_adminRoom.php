<!DOCTYPE html>
<html lang="en">
<?php
    require_once '../auth_bootstep.php';
    if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] != 1) {
        header('Location: ../index.php');
        exit;
    }
?>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $_SESSION['name']?>'s Admin panel</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <h2 class="admin__title">Welcome to admin panel, <?= $_SESSION['name']?>! 👑</h2>
    <div class="admin__panel">

        <div class="admin__panel_section admin__panel_section-without">

            <div class="admin__pnael_container-trigger">Without response</div> 
            <div class = "admin__containers_searching">
                <input class="admin__search_input" type="search" placeholder="Search offer...">

                <div class = "admin__searching_bottom">

                    <div class = "admin__search_sort">
                        <button type="button" class="admin__search_sort-trigger">Filter</button>
                        <div class = "admin__search_sort_options" hidden>
                            <button type="button" class="admin__search_sort-option" data-sort="default">Default</button>
                            <button type="button" class="admin__search_sort-option" data-sort="award_desc">Award: high to low</button>
                            <button type="button" class="admin__search_sort-option" data-sort="award_asc">Award: low to high</button>
                        </div>  
                    </div>

                    <div class="admin__search_categories"></div>
                </div>
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
                <div class="admin__panel_container admin__response_container">

                </div>
            </div>

        </div>

        <div class="admin__panel_section admin__panel_section-chats">

            <div class="admin__pnael_container-trigger">Chats</div> 
            <div class = "admin__containers_searching">
                <!--Как нибудь попозже-->
            </div>

            <div class="admin__containers admin__containers_chat">
                <div class="admin__panel_container admin__chat_container">

                </div>
            </div>

        </div>
        <div class="admin__panel_section admin__panel_section-done">

            <div class="admin__pnael_container-trigger">Already done</div> 
            <div class = "admin__containers_searching">
                <!--Как нибудь попозже-->
            </div>

            <div class="admin__containers admin__containers_done">
                <div class="admin__panel_container admin__done_container">

                </div>
            </div>

        </div>

        <div class="admin__panel_section admin__panel_section-archive">

            <div class="admin__pnael_container-trigger">Archivated</div> 
            <div class = "admin__containers_searching">
                <!--Как нибудь попозже-->
            </div>

            <div class="admin__containers admin__containers_archive">
                <div class="admin__panel_container admin__archive_container">

                </div>
            </div>

        </div>

    </div>
    <link rel="stylesheet" href="./vendor/tom-select/tom-select.css">
    <script src="./vendor/tom-select/tom-select.complete.min.js"></script>
    <script src="./superSecretScript.js"></script>
    <script src="./suffering_response.js"></script>  <!--npm init -y, npm i tom-select, mkdir -p nothing-to-watch-here/vendor/tom-select && \cp node_modules/tom-select/dist/css/tom-select.css nothing-to-watch-here/vendor/tom-select/ && \cp node_modules/tom-select/dist/js/tom-select.complete.min.js nothing-to-watch-here/vendor/tom-select/ -->
    <script src="./chats.js"></script>   
    <script src="./offers_done.js"></script>
    <script src="./archive.js"></script>


    <!--<script src="https://cdn.jsdelivr.net/npm/tom-select/dist/js/tom-select.complete.min.js"></script> В ПУБЛИЧНОМ ХОСТИНГЕ РАЗОРХИРОВАТЬ--> 

</body>
</html>