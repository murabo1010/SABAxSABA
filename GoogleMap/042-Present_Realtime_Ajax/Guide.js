$(function () {
    var count = 1;
    var currentWindow = null;
    var marker;
    var geoOptions = {
        enableHighAccuracy: true, //精度を高める
        timeout: 6000, //タイムアウトは6秒
        maximumAge: 0 //キャッシュはさせない
    }

    //現在位置の取得
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition( //watchPositionとすることで定期的に現在地を取得
            function (pos) {
                //取得状況
                $('#n').html((count++) + "回目");
                $('#x').html(pos.coords.latitude);
                $('#y').html(pos.coords.longitude);
                var mapData = {
                    'x': pos.coords.latitude,
                    'y': pos.coords.longitude,
                    'balloon': '現在位置'
                };
                latlng = new google.maps.LatLng(mapData.x, mapData.y);

                //現在地マーカーが設置されている場合は消去
                if (marker) {
                    marker.setMap(null);
                }
                makeMarker(mapData); //現在地マーカーを設置
                if ( viewFlag ) {
                    map.panTo(latlng); // マーカーの位置をマップの中心に設定
                }
            },
            function (error) {
                var msg;
                switch (error.code) {
                    case 1:
                        msg = "位置情報の利用が許可されていません";
                        break;
                    case 2:
                        msg = "位置が判定できません";
                        break;
                    case 3:
                        msg = "タイムアウトしました";
                        break;
                }
                alert(msg);
            });
    } else {
        alert("本ブラウザではGeolocationが使えません");
    }

    //マーカー作成
    function makeMarker(mapData) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(mapData.x, mapData.y),
            map: map,
            icon: 'position.png'
        });

        var infoWindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', function () {
            if (currentWindow) {
                currentWindow.close();
            }
            infoWindow.setContent(mapData.balloon);
            infoWindow.open(map, marker);
            currentWindow = infoWindow;
        });
    }
});