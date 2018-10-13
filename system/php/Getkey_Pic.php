<?php
// ******************************************************************* //
//
//                      写真からキーワードを抽出する関数
//
// ******************************************************************* //

// -- 引数
// > $file_path     : 画像のパス

// -- 返り値
// > $array         : 好みのキーワードリスト

function Mirusaba( $file_path ){
    
    require_once('./php/Debug.php');
    
    /*--------------------------------------------- 
                Google Cloud Vision API
    ----------------------------------------------*/
    $array = array();       // キーワードを格納する配列
    for($i=0; $i<count($file_path); $i++){
        //echo "『".$file_path[$i]."』<br>";

        // APIキー
        $api_key = 'AIzaSyAdMW7I11n8XkWf_TOyhII1de0-MzZ-srI';

        // 画像へのパス
        $image_path = $file_path[$i];
        
        // Feature Type
        $feature = "LABEL_DETECTION";

        // パラメータ設定
        $param1 = array("requests" => array());
        $item["image"] = array("content" => base64_encode(file_get_contents($image_path)));
        $item["features"] = array(array("type" => $feature, "maxResults" => 10));
        $param1["requests"][] = $item;

        // リクエスト用のJSONを作成
        $json1 = json_encode($param1);

        // リクエストを実行
        $curl = curl_init() ;
        curl_setopt($curl, CURLOPT_URL, "https://vision.googleapis.com/v1/images:annotate?key=" . $api_key);
        curl_setopt($curl, CURLOPT_HEADER, true);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, 15);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $json1);
        $res1 = curl_exec($curl);
        $res2 = curl_getinfo($curl);
        curl_close($curl);

        // 取得したデータ
        $json1 = substr($res1, $res2["header_size"]);
        $array_json1 = json_decode($json1, true);

        //$array_json["responses"][0]["labelAnnotations"][9]["description"]="statue";
        //print_r($array_json1);
        //echo "<br>";
        

        $param2 = array();
        //echo "「json responses1」<br>";
        for($j = 0; $j<count($array_json1["responses"][0]["labelAnnotations"]); $j++){
            $param2["q"][$j] = $array_json1["responses"][0]["labelAnnotations"][$j]["description"];
            //echo $array_json["responses"][0]["labelAnnotations"][$i]["description"]."<br>";
        }
        //echo "<br>";
        //echo "<br>";



    /*-------------------------------------------
            Google Cloud Translation API 
    -------------------------------------------*/
        // パラメータ設定
        $param2["target"] = "ja";
        $param2["format"] = "text";

        // リクエスト用のJSONを作成
        $json2 = json_encode($param2);
        //echo $json1;
        //echo "<br>";
        //echo "<br>";

        // リクエストを実行
        $curl = curl_init() ;
        curl_setopt($curl, CURLOPT_URL, "https://translation.googleapis.com/language/translate/v2/?key=" . $api_key);
        curl_setopt($curl, CURLOPT_HEADER, true);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, 15);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $json2);
        $res3 = curl_exec($curl);
        $res4 = curl_getinfo($curl);
        curl_close($curl);

        // 取得したデータ
        $json2 = substr($res3, $res4["header_size"]);
        $array_json2 = json_decode($json2, true);

        //print_r($array_json2);
        //echo "<br>";
        //echo "<br>";


        //echo "「json responses2」<br>";
        for($j = 0; $j<count($array_json2["data"]["translations"]); $j++){
            //echo $array_json2["data"]["translations"][$j]["translatedText"]."<br>";
            if (array_key_exists($array_json2["data"]["translations"][$j]["translatedText"], $array)) {
                $array[$array_json2["data"]["translations"][$j]["translatedText"]]++;
            }else{
                $array[$array_json2["data"]["translations"][$j]["translatedText"]]=1;
            }
        }
        echo "<br>";    
    }
    //PrintArray( "array", $array );
    return $array;
}

?>