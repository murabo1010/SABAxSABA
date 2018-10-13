// ***************************************************************
//
//                    マップ描写用JS関数ファイル（v2）
//
// ***************************************************************



// 選択したコースを読み込み
var select_get = JSON.parse( localStorage.getItem("selection") );

var map;
var directions;

// 初期化関数
function initialize() {
    if (GBrowserIsCompatible()) {
        map = new GMap2(document.getElementById("map_canvas"));
        map.setCenter(new GLatLng(35.681379, 139.765577), 13);
        directions = new GDirections(map, document.getElementById('route'));
        
        // マップ表示
        dispRoute();
    }
}

// マップ表示関数
function dispRoute() {
    directions.clear();

    console.log(select_get);
    var option = {
        locale: 'ja_JP',
        travelMode: G_TRAVEL_MODE_WALKING
    };
    directions.loadFromWaypoints(select_get.pointArray, option);
}