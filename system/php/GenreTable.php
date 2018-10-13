<?php
// ******************************************************************* //
//
//                          ジャンルからキーワードを返す関数
//
// ******************************************************************* //

// -- 引数
// > $genre : ジャンル

// -- 返り値
// return = キーワード（1次元配列）

function GetWordByGenre( $genre ){
    
    // キーワード変換のキーとなるジャンル（定数）
    define("CLASSIC", "クラシック");
    define("ROCK"   , "ロック");
    define("POP"    , "ポップス");
    define("JAZZ"   , "ジャズ");  
    //echo CLASSIC . "<BR>";
    //echo ROCK . "<BR>";
    //echo POP . "<BR>";
    //echo JAZZ . "<BR>";
    
    // 近いジャンルはここに追加してく
    $TABLE_GENRE = array(
        CLASSIC => array( CLASSIC, 'クラシック・クロスオーバー', 'サウンドトラック', 'インストゥルメンタル', '管弦楽' ),
        ROCK    => array( ROCK, 'ハードロック', 'メタル', 'パンク' ),
        POP     => array( POP, 'J-Pop', 'ポップ', '歌謡曲', 'シンガーソングライター' ),
        JAZZ    => array( JAZZ, 'カントリー', 'ワールド' )
    );
    //PrintArray( $TABLE_GENRE );
    
    
    // キーワードはここに追加していく
    $TABLE_KEYWORD = array(
        CLASSIC => array( '料理','イタリア','パスタ','ピザ','チーズ','ジャーマンポテト','カフェ','ワッフル','ステーキ','洋食','洋菓子' ),
        ROCK    => array( '料理','インド','カレー','うどん' ),
        POP     => array( '料理','中国','中華','ラーメン','餃子','屋台','五目中華' ),
        JAZZ    => array( '料理','タイ','寿司','魚','海鮮料理','刺し身','かに','日本','うどん','そば','定食','たこ焼き','屋台','オムライス','お好み焼き','かき揚げ' ),
        "その他" => array( '料理','小料理','ランチ','メニュー','雰囲気' )
    );
    //PrintArray( $TABLE_KEYWORD );
    
    
    // 引数をキーとなるジャンルに分類
    $genre = ClassifyGenre( $TABLE_GENRE, $genre );

    // ジャンルに対応するキーワードを返す
    return $TABLE_KEYWORD[$genre];
}



// ジャンルに分類関数
// > $TABLE_GENRE   : ジャンル分類テーブル
// > $genre         : 入力したジャンル
// return = 分類したジャンル
function ClassifyGenre( $TABLE_GENRE, $genre ){
     foreach( $TABLE_GENRE as $k => $v ){
        foreach( $v as $i => $g ){
            //echo $genre ." ". $g ."<BR>";
            if( strcmp( $genre, $g ) == 0 ){
                $genre = $k;
                return $genre;
            }
        }
        unset( $i, $g );
    }
    unset( $k, $v );
    return "その他";
}



// 配列表示用関数（デバッグ用)
function PrintArray( $array ){
    echo "<PRE>";
    print_r( $array );
    echo "</PRE>";
}

?>