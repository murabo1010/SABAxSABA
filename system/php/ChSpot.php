<?php
// ******************************************************************* //
//
//                          観光スポット選定関数
//
// ******************************************************************* //

// -- 引数
// > $y     : 年
// > $m     : 月
// > $d     : 日
// > $stt_h : 出発時刻（時）
// > $stt_i : 出発時刻（分）
// > $gol_h : 到着時刻（時）
// > $gol_i : 到着時刻（分）
// > $result: キーワード（配列）

// -- 返り値
// > $spot_a: 選定したスポットがポイント順に格納された配列

function ChoiceSpot( $y, $m, $d, $stt_h, $stt_i, $gol_h, $gol_i, $result ){
    
    try {

        // *********************************************************** //
        //
        //                      ユーザ定義関数
        //
        // *********************************************************** //

        // ユーザ入力を格納する関数
        function SetInput( &$array, $y, $m, $d, $h, $i ){
            // ユーザ入力をセット
            $array = array(
                "year"  => $y,
                "month" => $m,
                "day"   => $d,
                "week"  => NULL,
                "hour"  => $h,
                "min"   => $i,
                "time"  => NULL     // 時刻を秒単位に直したもの
            );
            // 曜日をセット
            $array["week"] = date("l", mktime(  $array["hour"],
                                                $array["min"],
                                                0,
                                                $array["month"],
                                                $array["day"],
                                                $array["year"]
                                             )
                                 );
            // 時刻を秒単位にしてセット
            $array["time"] = $array["hour"] * 3600 + $array["min"] * 60 + 0;
        }
        

        
        // データベースからデータを取得する関数
        function GetData( &$pdo, &$value, &$spot_a, &$key, $sql ){
            // データベースからデータを取得
            $prepare = $pdo->prepare( $sql );
            $prepare->bindValue(1,(string)$value,PDO::PARAM_STR);
            $prepare->execute();
            $rslt = $prepare->fetchAll();
            // データが存在する場合のみ格納
            if( $rslt != false ){
                $spot_a[ $key ] = $rslt;
                $key++;
            }
        }

        // *********************************************************** //
        //
        //                      データベース接続
        //
        // *********************************************************** //

        /* リクエストから得たスーパーグローバル変数をチェックするなどの処理 */

        // データベースに接続
        $pdo = new PDO(
            'mysql:dbname=**************************;host=**************************;charset=utf8mb4',
                // dbname:データベース名、host:ホスト名、charset:文字セット
            '**************************',   // ユーザ名
            '**************************',     // パスワード
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,        // SQL実行でエラーが起こった場合 => 例外をスロー
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,   // フェッチスタイル => カラム名をキーとする連想配列で取得
            ]
        );

        /* データベースから値を取ってきたり， データを挿入したりする処理 */

        // *********************************************************** //
        //
        //                      入力のセット処理
        //
        // *********************************************************** //

        // 入力値を格納
        $start = array();
        SetInput( $start, $y, $m, $d, $stt_h, $stt_i );
        $goal  = array();
        SetInput( $goal , $y, $m, $d, $gol_h, $gol_i );

        // イウサバ結果を格納
        /*
        $result = array(
            mb_convert_encoding("お土産", "EUC-JP"),
            mb_convert_encoding("農産物", "EUC-JP"),
            mb_convert_encoding("星空", "EUC-JP"),
        );
        */

        // *********************************************************** //
        //
        //                      スポット選定処理
        //
        // *********************************************************** //

        // キーワードを格納
        $keyword = array();
        $key = 0;
        foreach( $result as $k => $v ){
            $keyword[$key++] = $k;
        }
        unset( $k, $v );

        // スポット格納用配列
        $spot_a = array();
        $spot_b = array();

        // キーワードからスポットを選定
        $key = 0;
        foreach( $keyword as $value ){
            GetData( $pdo, $value, $spot_a, $key, 'SELECT * FROM spots WHERE keyword1 = ?' );
            GetData( $pdo, $value, $spot_a, $key, 'SELECT * FROM spots WHERE keyword2 = ?' );
            GetData( $pdo, $value, $spot_a, $key, 'SELECT * FROM spots WHERE keyword3 = ?' );
            GetData( $pdo, $value, $spot_a, $key, 'SELECT * FROM spots WHERE keyword4 = ?' );
            GetData( $pdo, $value, $spot_a, $key, 'SELECT * FROM spots WHERE keyword5 = ?' );
            GetData( $pdo, $value, $spot_a, $key, 'SELECT * FROM spots WHERE keyword6 = ?' );

        }
        unset( $value );    // 参照解除

        // ポイント集計
        foreach( $spot_a as $arr1 ){

            foreach( $arr1 as $arr2 ){

                // スポットが既出かどうか調べる
                $exi = array_key_exists( $arr2['id'], $spot_b );
                if( !$exi ){
                    // 既出でない場合、追加
                    $spot_b[ $arr2['id'] ] = array();
                    foreach( $arr2 as $k => $v ){
                        $spot_b[ $arr2['id'] ][ $k ] = $v;
                    }
                    $spot_b[ $arr2['id'] ]["pts"] = 1;
                    unset( $k, $v );
                }
                else{
                    // 既出の場合、ポイント加算
                    $spot_b[ $arr2['id'] ]["pts"]++;
                }
            }
            unset( $arr2 );
        }
        unset( $arr1 );

        // *********************************************************** //
        //
        //                      営業日・時間のチェック
        //
        // *********************************************************** //

        // 曜日でチェック
        $spot_a = array();
        switch( $start["week"] ){
            case "Monday"   : $w_stt = "mon_start";   $w_end = "mon_end";   break;
            case "Tuesday"  : $w_stt = "tue_start";   $w_end = "tue_end";   break;
            case "Wednesday": $w_stt = "wed_start";   $w_end = "wed_end";   break;
            case "Thursday" : $w_stt = "thu_start";   $w_end = "thu_end";   break;
            case "Friday"   : $w_stt = "fri_start";   $w_end = "fri_end";   break;
            case "Saturday" : $w_stt = "sat_start";   $w_end = "sat_end";   break;
            case "Sunday"   : $w_stt = "sun_start";   $w_end = "sun_end";   break;
        }

        // 時間でチェック
        foreach( $spot_b as $id ){

            // スポットの営業時間を取得
            $s = date("H", $id[$w_stt] );
            $m = date("i", $id[$w_stt] );
            $h = date("s", $id[$w_stt] );
            $st = $h * 3600 + $m * 60 + $s;    // 秒単位に変換
            $s = date("H", $id[$w_end] );
            $m = date("i", $id[$w_end] );
            $h = date("s", $id[$w_end] );
            $ed = $h * 3600 + $m * 60 + $s;    // 秒単位に変換

            // 観光日時を満たすスポットのみ格納
            if( $st <= $start["time"] && $goal["time"] <= $ed ) {
                $spot_a[ $id['id'] ] = array();
                foreach( $id as $k => $v ){
                    $spot_a[ $id['id'] ][ $k ] = $v;
                }
                unset( $k, $v );
            }
        }
        unset( $id );

        // ポイント順にソート
        $sort = array();
        foreach( $spot_a as $k => $v ){
            $sort[$k] = $v["pts"];
        }
        array_multisort( $sort, SORT_DESC, $spot_a );

    } catch (PDOException $e) {

        // エラーが発生した場合は「500 Internal Server Error」でテキストとして表示して終了する
        // - もし手抜きしたくない場合は普通にHTMLの表示を継続する
        // - ここではエラー内容を表示しているが， 実際の商用環境ではログファイルに記録して， Webブラウザには出さないほうが望ましい
        header('Content-Type: text/plain; charset=UTF-8', true, 500);
        exit($e->getMessage()); 

    }

    // Webブラウザにこれから表示するものがUTF-8で書かれたHTMLであることを伝える
    // (これか <meta charset="utf-8"> の最低限どちらか1つがあればいい． 両方あっても良い．)
    //（echo等の命令はこのheader()より後ろにしか書けない）
    //header('Content-Type: text/html; charset=utf-8');

    // *************************************************************** //
    //
    //                      選定したスポットの出力処理
    //
    // *************************************************************** //

    //echo "Hello", "<br>";

    // ユーザの入力
    /*
    require_once('Debug.php');
    PrintArray("ユーザ入力（出発）", $start );
    PrintArray("ユーザ入力（到着）", $goal );
    */
    
    // キーワード（引数）
    /*
    require_once('Debug.php');
    PrintArray("キーワード（引数）", $result );
    */
    
    // キーワード検索結果
    /*
    require_once('Debug.php');
    PrintArray("キーワード検索結果", $spot_a );
    */
    
    // キーワード検索結果（ポイント集計済）
    /*
    require_once('Debug.php');
    PrintArray("キーワード検索結果（ポイント集計済）", $spot_b );
    */
    
    // 出発日時でのフィルタ結果（ソート済）
    /*
    require_once('Debug.php');
    PrintArray("出発日時でのフィルタ結果（ソート済）", $spot_a );
    */
    
    return $spot_a;
}

?>

