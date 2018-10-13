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
// 現在地更新タイマー
var timer;
// 現在地を格納するための変数
var latlng;
// ルート全体表示（false）か現在地表示（true）かを切り替えるフラグ
var viewFlag = false;


function SwitchViewFlag(flag) {
    if (flag) {
        map.panTo(latlng); // マーカーの位置をマップの中心に設定
    } else {
        initMap(); // ルート全体が見える座標をマップの中心に設定
    }
}



// マップ初期化関数（APIのcallbackに指定されている）
function initMap() {

    // マップ作成
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