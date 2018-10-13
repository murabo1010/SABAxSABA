// *************************************************************** //
//
//                              コース作成関数ファイル
//
// *************************************************************** //

// 出発から到着までの時間を計算する関数
// return = 出発から到着までの時間[分]
function GetTravelTime(){
    var travelTime = GOAL.hour * 60 + GOAL.min - START.hour * 60 + START.min;
    if( travelTime < 0 )
        travelTime += 24 * 60;
    return travelTime;
}



// routeの移動時間を分単位に直す&同じ場所だった場合をnullにする関数
function ConvertRouteToMin(){
    for( var i=0; i<route.length; i++ ){
        for( var j=0; j<route[i].length; j++ ){
            if( i == j )
                route[i][j] = null;
            else
                route[i][j] = Math.round( route[i][j] / 60 );
        }
    }
}



// ************************************************************************** //
// コース作成関数
// > idx    : キーワード一致率が大きいスポットのインデックス
// > pts    : コース中の経由地リスト（1次元配列）
// > sArray : IDと紐づけた移動時間のリスト
function ChoosePoints(idx, pts, sArray) {

    idx++; // sArrayで0は出発地点。1からが選定スポットのインデックスなので++
    var spotLine = []; // コース中のスポットの並びをインデックスで格納する配列

    // コース中の経由地決定
    //      spotLineに経由地のインデックスを、通る順に格納していく
    //Shuffle( spotLine );      // ランダム版
    for (var i = 1; i < SPOTS.length; i++) { // 0は出発地点なので1スタート

        // インデックス格納
        spotLine[i] = idx;
        
        // 移動時間が最短のものを次のスポットを選定
        //	ただし既に格納したスポットは除外
        var skip = [null];      // 重複除外のためのインデックスのリスト
                                // CheckExistence()を使いまわしたいので先頭にnull
        var brc = 0;        // 無限ループ防止用
        var OF = 10000;     // 　　〃
        while (1 && brc++ < OF) {
            
            // 移動時間が最短のスポットのインデックスを取得
            var new_idx = GetMin(sArray[idx].duration, skip);
            //console.log( i, spotLine, idx, new_idx, sArray[idx].duration, skip );
            
            if (!CheckExistence(spotLine, new_idx)) {
                // spotLineにnew_idxの値が格納されていなければ、新たに格納する
                idx = new_idx;
                break;
            } else {
                // 　　　〃　　　、new_idxを除外対象としてskipに追加（追加済の場合は追加しない）
                if (!CheckExistence(skip, new_idx))
                    skip.push(new_idx);
            }
        }
        if( brc >= OF ) alert("OVER FLOW");
    }

    // 添え字と経由地を対応づけ
    pts[0] = sArray[0];
    var j;
    for (j = 1; j < SPOTS.length; j++)
        pts[j] = sArray[spotLine[j]];
    pts[j] = sArray[sArray.length - 1];
}

// 配列中の最小値のインデックスを返す関数
// > array	: 対象の配列
// > skip	: 除外するインデックスのリスト
function GetMin(array, skip) {

    var idx;
    // 適切な検索開始位置を取得する（null、skip格納済のインデックスは使えない）
    for (idx = 1; idx < array.length - 1; idx++) // 先頭は出発地点なので1スタートで除外
        // 最後尾も到着地点のなので-1で除外
        if (!CheckExistence(skip, idx) && array[idx] != null)
            break

    if (array[idx] == null) idx = 2; // 開始時の値がnullの場合、その次から開始
    var min = array[idx];
    for (var i = idx; i < array.length - 1; i++) { // 最後尾も到着地点のなので-1で除外
        if (array[i] < min && array[i] != null) {
            if (!CheckExistence(skip, i)) {
                idx = i;
                min = array[i];
            }
        }
    }
    return idx;
}

// 配列中にその値が既にあるかどうかを調べる関数
// > array	: 対象の配列（1次元）
// > v		: 調べたい値
function CheckExistence(array, v) {

    for (var i = 1; i < array.length; i++) // 0は出発地点なので1スタート
        if (v == array[i])
            return true;
    return false;
}



// 配列の並びをシャッフルする関数
// > rArray : ランダムにした並び順を格納する配列
function Shuffle( rArray ){
    
	// 配列に値を格納
	for( var i=0; i<SPOTS.length; i++ )
		rArray[i] = i + 1;		// 1スタートにしたいので+1
	
	// 何回ループするか乱数で決定
	var loop = Random( 100, 1000 );
	
	for( var i=0; i<loop; i++ ){
		var n = i % SPOTS.length;
		var m = (i + i) % SPOTS.length;
		var tmp = rArray[n];
		rArray[n] = rArray[m];
		rArray[m] = tmp;
	}
}

// 指定範囲内の乱数を返す関数
function Random( min, max ){
    return Math.floor( Math.random() * ( max - min ) + min );
}



// ************************************************************************** //

// 移動時間を次に向かうスポットのもののみに添削する関数
// > cArray   : コースの情報（1次元配列）
// > pts      : 経由地の情報（1次元配列）
function MakeCourseArray( cArray, pts ){
    
    for( var j=0; j<pts.length - 1; j++ ){  // 到着地点に移動時間は無いので-1
        
        // 次に向かうスポットの添え字を取得
        var k;
        for( k=0; k<SPOTS.length; k++ )
            if( SPOTS[k]["id"] == pts[j + 1].id )
                break;
        
        // 添え字から移動時間を判定して添削
        cArray[j] = new SpotDuration( pts[j].id, pts[j].address, pts[j].duration[k+1] );
    }
    // 到着地点は移動時間が無いので別処理
    cArray[pts.length - 1] = new SpotDuration( pts[pts.length - 1].id, pts[pts.length - 1].address, null );
}



// ************************************************************************** //

// 到着時刻までに回れるようスポット数を調整する関数
// > travelTime : 出発時刻から到着時刻までの時間
// > cArray     : コースの情報（1次元配列）
// > pts        : 経由地の情報（1次元配列）
// > cArray_new : スポット数を調整したコース情報（1次元配列）
function ModulateCourseInTime( travelTime, cArray, pts, cArray_new ){
    
    // 出発地点からの移動時間を最初に格納
    cArray_new[0] = new SpotDuration( cArray[0].id, cArray[0].address, cArray[0].duration );
    var time = cArray[0].duration;
    
    var i;
    for( i=1; i<cArray.length - 1; i++ ){
        
        // 移動時間と滞在時間を加算
        ///console.log("SPOTS_byID[", cArray[i].id, "]=", SPOTS_byID[ cArray[i].id ] );
        time += SPOTS_byID[ cArray[i].id ].stay;
        
        if( time + pts[i].duration[ pts[i].duration.length-1 ] < travelTime ){
            // 到着時刻までに到着地点に来れる場合、次のスポットまでの移動時間を加算
            cArray_new[i] = new SpotDuration( cArray[i].id, cArray[i].address, cArray[i].duration );
            time += cArray[i].duration;
        }else{
            // 到着時刻までに到着地点に来れる場合、到着地点へ直行
            cArray_new[i-1].duration = pts[i].duration[ pts[i].duration.length-1 ];
            break;
        }
    }
    cArray_new[i] = new SpotDuration( cArray[ cArray.length-1 ].id,
                                      cArray[ cArray.length-1 ].address, 
                                      cArray[ cArray.length-1 ].duration );
}



// ************************************************************************** //

// コース選択・地図表示のためにデータをコンストラクタにまとめる関数
// > cArray_new : courseArray_new[i]
function StraightenCourse( cArray_new ){
    
    // コンストラクタの引数用配列
    var nameArray = [];
    var pointArray = [];
    var chargeArray = [];
    var spotArray = [];
    
    // 出発地点をまとめる
    nameArray[0]   = cArray_new[0].address;
    pointArray[0]  = cArray_new[0].address;
    chargeArray[0] = 0;
    spotArray[0]   = null;
    
    // 経由地をまとめる
    for( var j=1; j<cArray_new.length - 1; j++ ){
        nameArray[j]   = SPOTS_byID[ cArray_new[j].id ].name;
        pointArray[j]  = cArray_new[j].address;
        chargeArray[j] = SPOTS_byID[ cArray_new[j].id ].charge;
        spotArray[j] = new SpotData(
            cArray_new[j].id,
            SPOTS_byID[ cArray_new[j].id ].name,
            SPOTS_byID[ cArray_new[j].id ].keyword[0],
            SPOTS_byID[ cArray_new[j].id ].keyword[1],
            SPOTS_byID[ cArray_new[j].id ].keyword[2],
            SPOTS_byID[ cArray_new[j].id ].keyword[3],
            SPOTS_byID[ cArray_new[j].id ].keyword[4],
            SPOTS_byID[ cArray_new[j].id ].keyword[5],
            SPOTS_byID[ cArray_new[j].id ].mon.open,
            SPOTS_byID[ cArray_new[j].id ].mon.close,
            SPOTS_byID[ cArray_new[j].id ].tue.open,
            SPOTS_byID[ cArray_new[j].id ].tue.close,
            SPOTS_byID[ cArray_new[j].id ].wed.open,
            SPOTS_byID[ cArray_new[j].id ].wed.close,
            SPOTS_byID[ cArray_new[j].id ].thu.open,
            SPOTS_byID[ cArray_new[j].id ].thu.close,
            SPOTS_byID[ cArray_new[j].id ].fri.open,
            SPOTS_byID[ cArray_new[j].id ].fri.close,
            SPOTS_byID[ cArray_new[j].id ].sat.open,
            SPOTS_byID[ cArray_new[j].id ].sat.close,
            SPOTS_byID[ cArray_new[j].id ].sun.open,
            SPOTS_byID[ cArray_new[j].id ].sun.close,
            SPOTS_byID[ cArray_new[j].id ].stay,
            SPOTS_byID[ cArray_new[j].id ].charge,
            SPOTS_byID[ cArray_new[j].id ].address,
            SPOTS_byID[ cArray_new[j].id ].pts
        );
    }
    var end = cArray_new.length - 1;
    nameArray[end]   = cArray_new[end].address;
    pointArray[end]  = cArray_new[end].address;
    chargeArray[end] = 0;
    spotArray[end] = null;
    
    // まとめたコースを格納
    crs = new Course( nameArray, pointArray, chargeArray, spotArray );
    return crs;
}