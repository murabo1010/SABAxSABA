// コース選択用コンストラクタ
function Course(nArray, pArray, cArray, sArray) {
    this.nameArray = nArray;
    this.pointArray = pArray;
    this.chargeArray = cArray;
    this.spotArray = sArray;
}
// 選択したコースの情報
var select_get = new Course(
    [0, 0, 0, 1000, 0, 1000, 0], ["鯖江駅", "〒916-0027 福井県鯖江市桜町３丁目３−８−９", "〒916-0027 福井県鯖江市桜町３丁目９５０", "〒916-0027 福井県鯖江市桜町３丁目９５０", "35.94967, 136.173096", "〒916-0023 福井県鯖江市西山町６１３", "西鯖江駅"], ["鯖江駅", "西山公園", "道の駅西山公園", "道の駅西山公園", "日野川河川敷公園", "琥八", "西鯖江駅"],
    null
);



// マップ
var map;



// マップ初期化関数（APIのcallbackに指定されている）
function initMap() {

    // マップ作製
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {
            lat: 35.937085,
            lng: 136.170813
        }
    });
    directionsDisplay.setMap(map);

    // ルート表示
    calculateAndDisplayRoute(directionsService, directionsDisplay);
}



// コース表示関数
function calculateAndDisplayRoute(directionsService, directionsDisplay) {

    // 経由地の設定
    var waypts = [];
    for (var i = 1; i < select_get.pointArray.length - 1; i++) {
        // i=0,末尾は出発地点,到着地点なので除く

        waypts.push({
            location: select_get.pointArray[i],
            stopover: true
        });
    }

    // ルート作成
    directionsService.route({
        origin: select_get.pointArray[0],
        destination: select_get.pointArray[select_get.pointArray.length - 1],
        waypoints: waypts,
        travelMode: 'WALKING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}



// 現在地取得処理
function GetPresent() {

    // Geolocation APIに対応している
    if (navigator.geolocation) {
        // 現在地を取得
        navigator.geolocation.getCurrentPosition(

            // 取得成功した場合
            function (position) {
                // 緯度・経度を変数に格納
                var mapLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                //　マップにマーカーを表示する
                var marker = new google.maps.Marker({
                    map: map, // 対象の地図オブジェクト
                    position: mapLatLng // 緯度・経度
                });
                // マーカーの位置をマップの中心に設定
                map.panTo(mapLatLng);
            },
            // 取得失敗した場合
            function (error) {
                // エラーメッセージを表示
                switch (error.code) {
                    case 1: // PERMISSION_DENIED
                        alert("位置情報の利用が許可されていません");
                        break;
                    case 2: // POSITION_UNAVAILABLE
                        alert("現在位置が取得できませんでした");
                        break;
                    case 3: // TIMEOUT
                        alert("タイムアウトになりました");
                        break;
                    default:
                        alert("その他のエラー(エラーコード:" + error.code + ")");
                        break;
                }
            }
        );
        // Geolocation APIに対応していない
    } else {
        alert("この端末では位置情報が取得できません");
    }
}