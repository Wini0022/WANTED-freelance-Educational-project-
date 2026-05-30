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

            <div class="admin__panel_container-trigger">Without response</div> 
            <div class = "admin__containers_searching">
                <input class="admin__search_input" type="search" placeholder="Search offer...">

                <div class = "admin__searching_bottom">

                    <div class = "admin__search_sort">
                        <button type="button" class="admin__search_sort-trigger">Filter</button>
                        <div class = "admin__search_sort_options" hidden>
                            <button type="button" class="admin__search_sort-option admin__search_chip-active" data-sort="default">Default</button>
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

            <div class="admin__panel_container-trigger">Responses</div> 
            <div class = "admin__containers_searching">
                <input class="admin__search_input admin__response_search_input" type="search" placeholder="Search offer or people...">

                <div class="admin__searching_bottom">
                    <div class="admin__search_sort">
                        <button type="button" class="admin__search_sort-trigger admin__response_search_sort-trigger">Filter</button>
                        <div class="admin__search_sort_options" hidden>
                            <button type="button" class="admin__search_sort-option admin__response_search_sort-option admin__search_chip-active" data-sort="default" >Default</button>
                            <button type="button" class="admin__search_sort-option admin__response_search_sort-option" data-sort="award_desc">Award: high to low</button>
                            <button type="button" class="admin__search_sort-option admin__response_search_sort-option" data-sort="award_asc">Award: low to high</button>
                        </div>
                    </div>

                    <div class="admin__search_categories admin__response_search_categories"></div>
                </div>

            </div>

            <div class="admin__containers admin__containers_response">
                <div class="admin__panel_container admin__response_container">

                </div>
            </div>

        </div>

        <div class="admin__panel_section admin__panel_section-chats">

            <div class="admin__panel_container-trigger">Chats</div> 
            <div class = "admin__containers_searching">
                <input class="admin__search_input admin__chats_search_input" type="search" placeholder="Search offer or people...">

                <div class="admin__searching_bottom">
                    <div class="admin__search_sort">
                        <button type="button" class="admin__search_sort-trigger admin__chats_search_sort-trigger">Filter</button>
                        <div class="admin__search_sort_options" hidden>
                            <button type="button" class="admin__search_sort-option admin__chats_search_sort-option admin__search_chip-active" data-sort="default" >Default</button>
                            <button type="button" class="admin__search_sort-option admin__chats_search_sort-option" data-sort="award_desc">Award: high to low</button>
                            <button type="button" class="admin__search_sort-option admin__chats_search_sort-option" data-sort="award_asc">Award: low to high</button>
                        </div>
                    </div>

                    <div class="admin__search_categories admin__chats_search_categories"></div>
                </div>
            </div>

            <div class="admin__containers admin__containers_chat">
                <div class="admin__panel_container admin__chat_container">

                </div>
            </div>

        </div>
        <div class="admin__panel_section admin__panel_section-done">

            <div class="admin__panel_container-trigger">Already done</div> 
            <div class = "admin__containers_searching">
                <input class="admin__search_input admin__done_search_input" type="search" placeholder="Search offer...">

                <div class="admin__searching_bottom">
                    <div class="admin__search_sort">
                        <button type="button" class="admin__search_sort-trigger admin__done_search_sort-trigger">Filter</button>
                        <div class="admin__search_sort_options" hidden>
                            <button type="button" class="admin__search_sort-option admin__done_search_sort-option admin__search_chip-active" data-sort="default" >Default</button>
                            <button type="button" class="admin__search_sort-option admin__done_search_sort-option" data-sort="award_desc">Award: high to low</button>
                            <button type="button" class="admin__search_sort-option admin__done_search_sort-option" data-sort="award_asc">Award: low to high</button>
                        </div>
                    </div>

                    <div class="admin__search_categories admin__done_search_categories"></div>
                </div>
            </div>

            <div class="admin__containers admin__containers_done">
                <div class="admin__panel_container admin__done_container">

                </div>
            </div>

        </div>

        <div class="admin__panel_section admin__panel_section-archive">

            <div class="admin__panel_container-trigger">Archivated</div> 
            <div class = "admin__containers_searching">
                <input class="admin__search_input admin__archivated_search_input" type="search" placeholder="Search offer...">

                <div class="admin__searching_bottom">
                    <div class="admin__search_sort">
                        <button type="button" class="admin__search_sort-trigger admin__archivated_search_sort-trigger">Filter</button>
                        <div class="admin__search_sort_options" hidden>
                            <button type="button" class="admin__search_sort-option admin__archivated_search_sort-option admin__search_chip-active" data-sort="default" >Default</button>
                            <button type="button" class="admin__search_sort-option admin__archivated_search_sort-option" data-sort="award_desc">Award: high to low</button>
                            <button type="button" class="admin__search_sort-option admin__archivated_search_sort-option" data-sort="award_asc">Award: low to high</button>
                        </div>
                    </div>

                    <div class="admin__search_categories admin__archivated_search_categories"></div>
                </div>
            </div>

            <div class="admin__containers admin__containers_archive">
                <div class="admin__panel_container admin__archive_container">

                </div>
            </div>

        </div>

        <div class = "admin__make">
            <button type = "button" class = "admin__make_button-trigger">Make a new one!</button>
            <div class="admin__make_panel">
                <div class = "make__panel_top">
                    <button type="button" class="make__panel_close">Close</button>
                    <h1 class="make__panel_title">Making new offer</h1>
                </div>

                <form class = "make__panel_containers" action="make_offer.php" method="post">
                    <select class="make__category make__container" name="category_id">
                        <option value="">Category</option>
                    </select>
                    <input class="make__category_new make__container" name="category_new" type="text" placeholder="Or make a new one...">

                    <input class="make__container" name="deadline" type="text" placeholder="Deadline">
                    <input class="make__container" name="title" type="text" placeholder="Title" required>
                    <textarea class="make__container" name="description" placeholder="Description" required></textarea>

                    <div class="make__containers_money">
                        <input class="make__container" name="award" type="number" min="0" step="0.01" placeholder = "Award amount">
                        <select class="make__currency make__container" name="currency_id">
                            <option value="">Currency</option>
                        </select>
                        <input class="make__container" name="award_desc" type="text" placeholder = "Award description">
                    </div>

                    <div class = "make__example">
                        <!--Позже-->
                    </div>
                    <input type="submit" class = "admin__make_submit" value="Make">
                </form>
            </div>
        </div>  

    </div>
    <link rel="stylesheet" href="./vendor/tom-select/tom-select.css">

    <script src="./vendor/tom-select/tom-select.complete.min.js"></script> <!--npm init -y, npm i tom-select, mkdir -p nothing-to-watch-here/vendor/tom-select && \cp node_modules/tom-select/dist/css/tom-select.css nothing-to-watch-here/vendor/tom-select/ && \cp node_modules/tom-select/dist/js/tom-select.complete.min.js nothing-to-watch-here/vendor/tom-select/ -->

    <script src="./superSecretScript.js"></script>
    <script src = "make.js"></script>
    <script src="./suffering_response.js"></script>  
    <script src="./chats.js"></script>   
    <script src="./offers_done.js"></script>
    <script src="./archive.js"></script>


    <!--<script src="https://cdn.jsdelivr.net/npm/tom-select/dist/js/tom-select.complete.min.js"></script> В ПУБЛИЧНОМ ХОСТИНГЕ РАЗОРХИРОВАТЬ--> 

</body>
</html>