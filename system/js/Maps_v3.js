// ***************************************************************
//
//                    マップ描写用JS関数ファイル（v3）
//
// ***************************************************************



// 選択したコースを読み込み
var select_get = JSON.parse( localStorage.getItem("selection") );


// マップ
var map;
// 現在地更新タイマー
var timer;
// 現在地を格納するための変数
var latlng;
// ルート全体表示（false）か現在地表示（true）かを切り替えるフラグ
var viewFlag = false;


// マップの中心座標を切り替える関数
// > flag   : true=現在地/false=ルート全体が見える座標を中心にする
function SwitchViewFlag(flag) {
    if (flag) {
        map.panTo(latlng); // 現在地をマップの中心に設定
    } else {
        initMap(); // ルート全体が見える座標をマップの中心に設定
    }
    viewFlag = flag;
}



// マップ初期化関数（APIのcallbackに指定されている）
function initMap() {

    // マップ作成
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map_canvas'), {
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