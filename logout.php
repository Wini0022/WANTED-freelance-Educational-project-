<?php
require_once './auth_bootstep.php';

$_SESSION = [];
session_destroy();

header('Location: index.php');
exit;