<?php
    require_once('../system/php/twitteroauth/GetTweet.php');
    GetTweet( $tweets );
    header("Location: login.html");
?>
