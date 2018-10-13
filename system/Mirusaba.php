<?php
// **************************************************************************** //
//
//                              ミルサバ
//
// **************************************************************************** //

    // *************************************************************** //
    //
    //                      ユーザ入力の取得
    //
    // *************************************************************** //
    
    // ユーザ入力の取得
    $y   = (int)$_POST["year"];
    $m   = (int)$_POST["month"];
    $d   = (int)$_POST["day"];
    $pp  = (int)$_POST["people"];
    $stt = htmlspecialchars( $_POST["start"] );
    $sth = (int)$_POST["stTimeH"];
    $stm = (int)$_POST["stTimeM"];
    $gol = htmlspecialchars( $_POST["goal"] );
    $gth = (int)$_POST["glTimeH"];
    $gtm = (int)$_POST["glTimeM"];
    
    // ************************************************************************* //
    //
    //                              キーワード抽出
    //
    // ************************************************************************* //
    
    // 画像のパス取得
    //require_once('./php/Debug.php');
    //PrintArray("ファイルパス", $_FILES );
    $file_path = $_FILES['pictures']['tmp_name'];

    // キーワード抽出
    require_once('./php/Getkey_Pic.php');
    $result = array();
    $result = Mirusaba( $file_path );
    
    //　キーワード表示
    //require_once('./php/Debug.php');
    //PrintArray("ミルサバ結果", $result );
        
    // ************************************************************************* //
    //
    //                              スポット選定
    //
    // ************************************************************************* //

    // スポット選定
    require('./php/ChSpot.php');
    $result = ChoiceSpot( $y, $m, $d, $sth, $stm, $gth, $gtm, $result );

    // スポットを10個に絞る
    $newResult = array();
    for( $i=0; $i<10 && $result[$i] != null; $i++ ){
        $newResult[$i] = $result[$i];
    }
    
    // スポットを表示
    //require_once('./php/Debug.php');
    //PrintArray("スポット選定結果", $result );
    //foreach( $result as $k1 => $a ){
    //    echo $a["name"] . " / ";
    //}
    //echo "<br>";

    // ************************************************************************* //
    //
    //                              コース提案
    //
    // ************************************************************************* //

    // JSに渡せるようJSON形式に変換
    $php_json = json_encode( $newResult );
    
?>



<!DOCTYPE html "-//W3C//DTD XHTML 1.0 Strict//EN" 
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    
    <!-- Google Maps APIのURL -->
    <script src="https://maps.google.com/maps?file=api&v=2&key=AIzaSyCTAlQypqj_6v9CDkn5PQRgGS7WtMY0mA4&sensor=false" type="text/javascript" charset="utf-8"></script>
    <!-- ユーザ入力と選定したスポットをJavaScript変数に格納するJavaScriptファイル -->
    <script type="text/javascript">
        // 時刻格納用コンストラクタ
        function Edpoint( pt, h, m ){
            this.point = pt;
            this.hour  = h;
            this.min   = m;
        }
        // PHPに格納されている情報をJSに渡す
        var cbFlag = true;     // Twitterログインフラグ。ミルサバ・キクサバでは関係ないのでtrue
        var PEOPLE = <?php echo $pp ?>;         // 人数
        var START = new Edpoint( "<?php echo $stt; ?>", <?php echo $sth; ?>, <?php echo $stm; ?> );     // 出発時刻・地点
        var GOAL  = new Edpoint( "<?php echo $gol; ?>", <?php echo $gth; ?>, <?php echo $gtm; ?> );     // 到着時刻・地点
        var SPOTS = JSON.parse('<?php echo $php_json; ?>');     // 選定した観光スポット
    </script>
    <!-- 初期設定用JavaScriptファイル -->
    <script src="./js/Init.js"s type="text/javascript"></script>
    <!-- 位置情報取得用JavaScriptファイル -->
    <script src="./js/Duration.js" type="text/javascript"></script>
    <!-- コース作成用JavaScriptファイル -->
    <script src="./js/MakeCourse.js"s type="text/javascript"></script>
</head>

<body>
    <!-- 移動時間取得用のマップ、経路情報エリア -->
    <div id="map_canvas" style="width: 45vh; height: 30vh"></div>
    <div id="route" style="width: 45vh; height: 30vh;overflow: scroll"></div>
    
    <!-- コース作成のメイン処理JavaScriptファイル -->
    <script src="./js/Main.js" type="text/javascript"></script>
</body>

</html>