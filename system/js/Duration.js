// ***************************************************************
//
//                    移動時間取得用JS関数ファイル
//
// ***************************************************************


/*
-- 取得方法
・起点となる地点Aを決めて、その例外のスポットB,C,D,...について次のように経由地を設定する
        A->B->A->C->A->D->A->...
・移動時間を取得した時、0,2,4,...番目の値を移動時間として記録する
・この「起点となる地点A」を出発地点,A,B,C,D,...,到着地点という感じに変更していき、
　出発地点、到着地点を含めた全スポット間の移動時間を記録する
*/

// Google Maps API用配列
var map;
var directions;



// 初期化関数
function initialize() {
    if (GBrowserIsCompatible()) {
        map = new GMap2(document.getElementById("map_canvas"));
        map.setCenter(new GLatLng(34.696602,135.519447), 13); 
        directions = new GDirections(map, document.getElementById("route"));
        GEvent.addListener(directions, "load", onGDirectionsLoad);
        
        return true;
    }
    return false;
}



// ルート表示関数
// > pointArray : 経由地リスト
function dispRoute( pointArray ) {
    directions.clear();
    var option = {locale: 'ja_JP', travelMode: G_TRAVEL_MODE_WALKING};
    directions.loadFromWaypoints(pointArray, option);
}



// 描写関数
function onGDirectionsLoad(){
    
    // ルート全体の移動距離・時間を取得
    var od = directions.getDistance();  // 移動距離
    var ot = directions.getDuration();  // 移動時間
    var routeNum = directions.getNumRoutes();   // ルート数取得
    
    //var html = "ルート全体 " + od.html + " " + ot.html + "<br />";
    
    // 各観光スポット間の移動時間を取得
    var cnt = 0;
    for (var i = 0 ; i < routeNum ; i++){
        
        // スポット間の移動距離・時間を取得
        var r = directions.getRoute(i);
        var ord = r.getDistance();
        var ort = r.getDuration();
        
        // 偶数番目の移動時間＝行きの移動時間を記録
        if(  i%2 == 0 )
            route[idx][cnt++] = ort.seconds;
        
        //html += "Route[" + i + "] " + ord.html + " " + ort.html + "<br />";
    }
    
    //document.getElementById("route").innerHTML = html;
    
    // ロードイベント終了フラグtrue
    loadFlag = true;
}