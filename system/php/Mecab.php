<?php

// ******************************************************************* //
//
//                          MeCab形態素解析関数
//
// ******************************************************************* //

// -- 引数
// > $str   : Twitterに投稿した文章（1行）

// -- 返り値
// > $words : 名詞が出現頻度順が格納された配列

function GetWords( $str ) {
    
    // 文章を単語で区切る
    $mecab = new \MeCab\Tagger();
    
    // 文を解析
    $node = $mecab->parseToNode( $str );
    
    // 単語ごとに処理
    $result = array();
    while($node){
        
        // 始点(BOS)・終点(EOS)以外を処理
        if($node->getStat() != 2 && $node->getStat() != 3){
            
            // 文の要点を分解
            $feat_list = explode(",", $node->getFeature());

            // 名詞のみを抽出
            if(count($feat_list) > 0 && $feat_list[0] === "名詞"){
                $result[] = $node->getSurface();
            }
        }
        // 次の語句へ
        $node = $node->getNext();
    }
    
    // 結果を表示
    //echo "<pre>";
    //print_r( $result );
    //echo "</pre>";
    
    // 出現回数をカウント
    $words = array();
    foreach ( $result as $value ) {
        $words[ $value ]++;
    }
    unset( $value );    // 参照解除

    // 出現回数順に降順ソート
    arsort( $words );

    // 結果を表示
    //echo $str, "<br>";
    //echo "<pre>";
    //print_r( $words );
    //echo "</pre>";
    
    return $words;
}

?>