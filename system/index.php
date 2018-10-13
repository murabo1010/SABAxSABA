<?php

// Twitterログイン
require_once('./php/twitteroauth/GetTweet.php');
$cbFlag = false;    // ログイン済みかを判定するフラグ（true=ログイン済み）
$tweets = "";
$cbFlag = GetTweet( $tweets );

?>

<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <title>観光日程入力</title>
    
    <!-- formのactionのリンク先を追加 -->
    <script type="text/javascript">
        function goMirusaba() {
            document.getElementById('form').action = "Mirusaba.php";
        }
        function goKikusaba() {
            document.getElementById('form').action = "Kikusaba.php";
        }
        function goIusaba() {
            document.getElementById('form').action = "Iusaba.php";
        }
    </script>
</head>

<body align="center">
    
    <!-- マイコースボタン -->
    <p>マイコース：<input type="submit" value="マイコース" onclick="location.href='MyCourse.html'"></p>
    
    <!-- 観光日程入力フォーム -->
    <form id="form" action="Iusaba.php" method="post" enctype="multipart/form-data">
       
        <!-- 観光日時と人数 -->
        <select name="year">
            <option value="2018">2018</option>
        </select>
        /
        <select name="month">
            <option value="9">9</option>
        </select>
        /
        <select name="day">
            <option value="18">18</option>
        </select>
        
        |人数：
        <select name="people">
            <option value="2">2</option>
        </select>
        
        <br>
        
        <!-- 出発地点と出発時刻 -->
        <input type="text" name="start" size="20" maxlength="28" value="鯖江駅" /><br>
        <select name="stTimeH">
            <option value="10">10</option>
        </select>
        :
        <select name="stTimeM">
            <option value="0">0</option>
        </select>
        
        <br>▼<br>
        
        <!-- 到着地点と到着時刻 -->
        <input type="text" name="goal" size="20" maxlength="28" value="西鯖江駅" /><br>
        <select name="glTimeH">
            <option value="17">17</option>
        </select>
        :
        <select name="glTimeM">
            <option value="0">0</option>
        </select>
        
        <br>▼<br>
        
        <!-- 検索ボタン -->
        <input type="file"   name="pictures[]" value="ミルサバ" onclick="goMirusaba()" accept="image/*" multiple onChange=submit()>
        <input type="file"   name="songs[]"    value="キクサバ" onclick="goKikusaba()" accept="audio/*" multiple onChange=submit()>
        <input type="submit" name="saba"       value="イウサバ" onclick="goIusaba()">
    </form>
</body>

</html>
