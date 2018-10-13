<?php

// Twitterログイン
require_once('./php/twitteroauth/GetTweet.php');
$cbFlag = false;    // ログイン済みかを判定するフラグ（true=ログイン済み）
$tweets = "";
$cbFlag = GetTweet( $tweets );

?>