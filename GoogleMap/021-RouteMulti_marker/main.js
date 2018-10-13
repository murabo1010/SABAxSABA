/* Google Maps APIサンプル */

var map;
var directions;

function initialize() {
    if (GBrowserIsCompatible()) {
        map = new GMap2(document.getElementById("map_canvas"));
        map.setCenter(new GLatLng(35.937206, 136.170792), 13);

        directions = new GDirections(map, document.getElementById('route'));
    }
}

function dispRoute() {
    var from = document.getElementById("from").value;
    var step = document.getElementById("step").value;
    var to = document.getElementById("to").value;

    directions.clear();

    var pointArray = [from, step, to];
    directions.loadFromWaypoints(pointArray, {
        locale: 'ja_JP'
    });
    
    PointMarker();
}

function PointMarker() {
    // 座標
    var latlng = new GLatLng(35.937206, 136.170792);
    // マーカー追加
    var marker = new GMarker(latlng);
    map.addOverlay(marker);
}