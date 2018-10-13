<?php

// 配列標準出力関数
//      > $title    : タイトル
//      > $array    : 配列
function PrintArray( $title, $array ){
    echo "========= " . $title . " =========";
    echo "<pre>";
    print_r( $array );
    echo "</pre>";
}

?>