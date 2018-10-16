<?php
// ******************************************************************* //
//
//                      音楽からキーワードを抽出する関数
//
// ******************************************************************* //

// -- 引数
// > $file_path    : 画像のパス

// -- 返り値
// > $array         : 好みのキーワードリスト

function Kikusaba( $file_path ){
    header("Content-type: text/html; charset=utf-8");
    require_once("GenreTable.php");

    $array = array();
    //print_r($_FILES);
    //echo "<br>";
    //echo "<br>";
    //echo count($file_path)."<br>";

    /*
    for($i=0; $i<count($file_path); $i++){
        echo $file_path[$i]."<br>";
    }
    echo "<br>";
    */

    /*--------------------------------------------- 
                itunes API
    ----------------------------------------------*/
    for($i=0; $i<count($file_path); $i++){

        //ファイル名編集
        $path_parts = pathinfo($file_path[$i]);
        $pattern=array("/^[0-9]-[0-9][0-9][ 　]/","/^[0-9][0-9][ 　]/","/ /","/　/");
        $string  = preg_replace($pattern, "", $path_parts['filename'] );
        //echo "『".$string."』";
        //echo "<br>";
        //echo "<br>";

        //検索キーワード
        $term = $string;

        // リクエストを実行
        $curl = curl_init() ;
        curl_setopt($curl, CURLOPT_URL, 'https://itunes.apple.com/search?term='.$term.'&lang=ja_jp&entity=song&media=music&country=JP&attribute=songTerm&limit=10');
        curl_setopt($curl, CURLOPT_HEADER, true);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "GET");
        curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, 15);
        //curl_setopt($curl, CURLOPT_POSTFIELDS, $json);
        $res1 = curl_exec($curl);
        $res2 = curl_getinfo($curl);
        curl_close($curl);

        // 取得したデータ
        $json = substr($res1, $res2["header_size"]);
        $array_json = json_decode($json, true);

        //$arrayへ格納
        for($j=0; $j<$array_json["resultCount"]; $j++){
            echo $array_json["results"][$j]["artistName"].":";
            echo $array_json["results"][$j]["primaryGenreName"]."<br>";
            $genre = $array_json["results"][$j]["primaryGenreName"];
            $keyword = GetWordByGenre( $genre );
            foreach( $keyword as $a => $b){
                if (array_key_exists($b, $array)) {
                    $array[$b]++;
                }else{
                    $array[$b]=1;
                }
            }
            unset( $a, $b );
            //echo $genre . "のキーワード↓". "<BR>";
            //PrintArray( $keyword );
            //echo "<br>";
        }
        echo "<br>";
    }

    //PrintArray( $array );
    return $array;
}
?>