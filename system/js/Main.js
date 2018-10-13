// ***************************************************************
//
//                    メインの処理を行うJSファイル
//
// ***************************************************************



console.log( cbFlag );
console.log( PEOPLE );
console.log( START );
console.log( GOAL );
console.log( SPOTS );

// メイン関数
main();
function main(){
    
    if (initialize()) {
        
        // 出発地点、到着地点、選定した観光スポットを1つの配列にまとめる
        var stops = [];
        stops[0] = START.point;
        for (var i = 0; i < SPOTS.length; i++)
            stops[i + 1] = SPOTS[i]["address"];
        stops[stops.length] = GOAL.point;
        console.log(stops);

        // 移動時間の記録
        var passFlag = false;   // dispRoute()実行フラグ（true=実行中）
        var brTimer = 0;        // 無限ループ防止用
        var timerID;            // イベント待ち用タイマー
        timerID = setInterval(function () {

            // pointArrayの作成
            var pointArray = [];
            MakePointArray(idx, stops, pointArray);
            //console.log( pointArray );

            // 移動時間の取得
            if( !passFlag ){
                //console.log( pointArray );
                dispRoute(pointArray);
                passFlag = true;
            }

            // 移動時間取得後の処理
            if (loadFlag || brTimer++ > 1000) {
                // 各種フラグ初期化
                loadFlag = false;
                passFlag = false;
                idx++;      // インデックス+1
            }
            
            // タイマー停止処理（＝次の処理）
            if (idx >= stops.length - 1) {
                clearInterval(timerID);
                timerID = null;
                main2();
            }
        }, 100);
    }
}

// pointArray作成関数
// > s          : 起点となるスポットのインデックス
// > stops      : 出発・到着地点を含めた全スポットのリスト
// > pointArray : pointArray
function MakePointArray(s, stops, pointArray) {
    var stt = stops[s];
    for (var j = 0; j < stops.length; j++) {
        pointArray[j * 2] = stt;
        pointArray[j * 2 + 1] = stops[j];
    }
}



// setInterval後のメイン関数
function main2(){
    
    // SPOTSをIDで管理した配列を作る
    for( var i=0; i<SPOTS.length; i++ ){
        SPOTS_byID[ SPOTS[i]["id"] ] = new SpotData(
            SPOTS[i]["id"],
            SPOTS[i]["name"],
            SPOTS[i]["keyword1"],
            SPOTS[i]["keyword2"],
            SPOTS[i]["keyword3"],
            SPOTS[i]["keyword4"],
            SPOTS[i]["keyword5"],
            SPOTS[i]["keyword6"],
            SPOTS[i]["mon_start"],
            SPOTS[i]["mon_end"],
            SPOTS[i]["tue_start"],
            SPOTS[i]["tue_end"],
            SPOTS[i]["wed_start"],
            SPOTS[i]["wed_end"],
            SPOTS[i]["thu_start"],
            SPOTS[i]["thu_end"],
            SPOTS[i]["fri_start"],
            SPOTS[i]["fri_end"],
            SPOTS[i]["sat_start"],
            SPOTS[i]["sat_end"],
            SPOTS[i]["sun_start"],
            SPOTS[i]["sun_end"],
            SPOTS[i]["stay"],
            SPOTS[i]["charge"],
            SPOTS[i]["address"],
            SPOTS[i]["pts"]
        );
    }
    console.log( SPOTS_byID );
    
    // 出発時刻から到着時刻までの時間を取得する
    var travelTime = GetTravelTime();
    
    // routeを扱いやすいよう変換
    ConvertRouteToMin();    // 移動時間の秒→分変換
    console.log("route=", route );
    
    
    
    // 出発・到着地点含む観光スポットのリストと移動時間を紐づけ
    //      routeの添え字+1が対応するSPOTの添え字
    var spotArray = [];     // 移動時間→観光スポットのIDで紐づけたリスト
    spotArray[0] = new SpotDuration( 0, START.point, route[0] );
    for( var i=0; i<SPOTS.length; i++ ){
        spotArray[i+1] = new SpotDuration( SPOTS[i]["id"],
                                           SPOTS[i]["address"], route[i+1] );
    }
    spotArray[spotArray.length] = new SpotDuration( spotArray.length,
                                                    GOAL.point, null );
    console.log("spotArray=", spotArray );
    
    
    
    // コース中の経由地決定
    var points = [];    // コース中の経由地リスト
    for( var i=0; i<COURSE_MAKES && i<SPOTS.length; i++ ){
        points[i] = [];
        ChoosePoints( i, points[i], spotArray );
    }
    console.log("points=", points );
    
    
    
    // 移動時間の情報を添削
    var courseArray = [];   // 移動時間を添削したpoints
    for( var i=0; i<COURSE_MAKES && i<SPOTS.length; i++ ){
        courseArray[i] = [];
        MakeCourseArray( courseArray[i], points[i] );
    }
    console.log("courseArray=", courseArray );
    
    
    
    // 滞在時間内に回れるようスポット数を調整
    var courseArray_new = [];   // 時間内に回れるよう調整したcourseArray
    for( var i=0; i<COURSE_MAKES && i<SPOTS.length; i++ ){
        courseArray_new[i] = [];
        ModulateCourseInTime( travelTime, courseArray[i], 
                              points[i], courseArray_new[i] );
    }
    console.log("courseArray_new=", courseArray_new );
    
    
    
    // コース選択・地図表示のためにデータをコンストラクタにまとめる
    var course = [];
    for( var i=0; i<COURSE_MAKES && i<SPOTS.length; i++ ){
        course[i] = StraightenCourse( courseArray_new[i] );
    }
    console.log("course=", course );
    
    
    
    // データを書き出し
    var tmpData = course;
    localStorage.setItem("couseArray", JSON.stringify(tmpData) );      // コース情報
    localStorage.setItem("people", JSON.stringify(PEOPLE) );    // 人数
    
    // ページ遷移
    location.href = "../choice/choice.html";
}
