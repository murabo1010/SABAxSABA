<?php

// ******************************************************************* //
//
//                          ツイート取得関数
//
// ******************************************************************* //

// -- 引数
// > $tweets : ツイートを格納するための変数

function GetTweet( &$tweets ){

    //SESSION開始
    session_start();
    //インクルード
    require_once('twitteroauth.php');    // カレントディレクトリは/SABAxSABAなので
    //Consumer keyの値をTwitterAPI開発者ページでご確認下さい。
    $sConsumerKey = "qrO5kdSpboIB4QVgJAU1GNrjh";
    //Consumer secretの値を格納
    $sConsumerSecret = "sL0LEdNHDZve8EzURcSjoFB0IpEGkhKYI3qfnMwXL7pY0D5IcZ";
    //callbakurl
    // > ドメイン：murabo1010.sakura.ne.jpの場合
    $sCallBackUrl = 'http://murabo1010.sakura.ne.jp/App_sbsb/system/php/twitteroauth/GetTweet_callback.php';
    // > ドメイン：murabo.orgの場合
    //$sCallBackUrl = 'https://murabo.org/App_sbsb/system/php/twitteroauth/GetTweet_callback.php';

    //セッションのアクセストークンのチェック
    if((isset($_SESSION['oauthToken']) && $_SESSION['oauthToken'] !== NULL) && (isset($_SESSION['oauthTokenSecret']) && $_SESSION['oauthTokenSecret'] !== NULL)){

        // ユーザ情報の格納
        $sUserId = 			$_SESSION['userId'];
        $sScreenName = 		$_SESSION['screenName'];
        // アクセストークンの格納
        $sAccessToken =       $_SESSION['oauthToken'];
        $sAccessTokenSecret = $_SESSION['oauthTokenSecret'];

        // ログイン成功メッセージ
        //echo "ログインに成功しました。<br/>";
        //echo "こんにちは！ ", $sScreenName, " さん<br/>";
        //echo "ユーザーID ", $sUserId, "<br/>";
        //echo "<br/>";
        //echo '<a href="GetTweet_logout.php">ログアウトする</a></p>';

        // *************************************************************** //
        //
        //                      タイムライン取得処理
        //
        // *************************************************************** //

        //OAuthオブジェクトを生成する
        $twObj = new TwitterOAuth($sConsumerKey,$sConsumerSecret,$sAccessToken,$sAccessTokenSecret);
        //user_timelineを取得するAPIを利用。Twitterからjson形式でデータが返ってくる
        $vRequest = $twObj->OAuthRequest("https://api.twitter.com/1.1/statuses/user_timeline.json","GET",array("count"=>"10"));
        //Jsonデータをオブジェクトに変更
        $oObj = json_decode($vRequest);

        //オブジェクトを展開
        if(isset($oObj->{'errors'}) && $oObj->{'errors'} != ''){
            echo "取得に失敗しました。<br/>";
            echo "エラー内容：<br/>";
            echo "<pre>";
            echo var_dump($oObj);
            echo "</pre>";
        }else{
            //オブジェクトを展開
            $iCount = sizeof($oObj);;
            for($iTweet = 0; $iTweet<$iCount; $iTweet++){
                $iTweetId =                 $oObj[$iTweet]->{'id'};
                $sIdStr =                   (string)$oObj[$iTweet]->{'id_str'};
                $sText=                     $oObj[$iTweet]->{'text'};
                $sName=                     $oObj[$iTweet]->{'user'}->{'name'};
                $sScreenName=               $oObj[$iTweet]->{'user'}->{'screen_name'};
                $sProfileImageUrl =         $oObj[$iTweet]->{'user'}->{'profile_image_url'};
                $sCreatedAt =               $oObj[$iTweet]->{'created_at'};
                $sStrtotime=                strtotime($sCreatedAt);
                $sCreatedAt =               date('Y-m-d H:i:s', $sStrtotime);

                //echo $sText, "<br>";
                $tweets .= $sText;
            }
        }

        return TRUE;

    }else{

        //OAuthオブジェクト生成
        $oOauth = new TwitterOAuth($sConsumerKey,$sConsumerSecret);

        //callback url を指定して request tokenを取得
        $oOauthToken = $oOauth->getRequestToken($sCallBackUrl);

        //セッション格納
        $_SESSION['requestToken'] = 			$sToken = $oOauthToken['oauth_token'];
        $_SESSION['requestTokenSecret'] = 		$oOauthToken['oauth_token_secret'];

        //認証URLの引数 falseの場合はtwitter側で認証確認表示
        if(isset($_GET['authorizeBoolean']) && $_GET['authorizeBoolean'] != '')
            $bAuthorizeBoolean = false;
        else
            $bAuthorizeBoolean = true;

        //Authorize url を取得
        $sUrl = $oOauth->getAuthorizeURL($sToken, $bAuthorizeBoolean);
        //echo "<a href=", $sUrl, ">ログイン</a><br>";
        $filelink = file_get_contents( $sUrl );
        echo $filelink."<br>";

        return FALSE;
    }
}
?>
