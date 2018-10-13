<?php
 session_start();
 session_destroy();
 $_SESSION[''] = array();
 header("Location: ../../index.php?authorizeBoolean=2");   // ここもMain.phpに変更
?>