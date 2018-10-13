// ***************************************************************
//
//                    変数の初期値設定とかをするためのJSファイル
//
// ***************************************************************

var COURSE_MAKES = 5;   // コース作成数

// ***************************************************************

// 移動時間記録用配列
loadFlag = false;   // マップ読み込みイベント終了フラグ（true＝終了）
idx = 0;            // routeのインデックス
route = [];         // 起点となるスポットごとに分類して格納する配列
for( var i=0; i<=SPOTS.length; i++ )
    route[i] = [];
/*
-- 格納イメージ
※添え字：STARTは0、SPOTSはSPOTSの添え字+1、GOALはlength-1

Array[
    [idx = 0] {
        [0] = xxx
        [1] = xxx
        ...
    }
    [idx = 1] {
        [0] = xxx
        [1] = xxx
        ...
    }
    ...
]
*/

// ***************************************************************



// 観光スポットを格納するコンストラクタ
// > id         : 観光スポットのID
// > address    : 観光スポットの住所
// > duration   : 移動時間のリスト
function SpotDuration( id, address, duration ){
    this.id = id;
    this.address = address;
    this.duration = duration;
}
/*
-- 格納イメージ
spotArray[
    [0] = [
        .id       = xxx
        .address  = xxx
        .duration = [ x, x, x, ... ]
    ]
    ["id"] = [
        .id       = xxx
        .address  = xxx
        .duration = [ x, x, x, ... ]
    ]
    [LAST] = [
        .id       = xxx
        .address  = xxx
        .duration = [ x, x, x, ... ]
    ]
]

courseArray[
    [0] = [
        .id       = xxx
        .address  = xxx
        .duration = x
    ]
    ["id"] = [
        .id       = xxx
        .address  = xxx
        .duration = x
    ]
    [LAST] = [
        .id       = xxx
        .address  = xxx
        .duration = x
    ]
]

courseArray_new[
    [0] = [
        .id       = xxx
        .address  = xxx
        .duration = x
    ]
    ["id"] = [
        .id       = xxx
        .address  = xxx
        .duration = x
    ]
    [LAST] = [
        .id       = xxx
        .address  = xxx
        .duration = x
    ]
]

*/

// ***************************************************************

// SPOTSをIDで管理した配列
var SPOTS_byID = [];    

// 観光スポットをIDで管理するためのコンストラクタ
function SpotData(
        id, name, k1, k2, k3, k4, k5, k6,
        mon_start, mon_end, tue_start, tue_end, wed_start, wed_end,
        thu_start, thu_end, fri_start, fri_end, sat_start, sat_end,
        sun_start, sun_end,
        stay, charge, address, pts
    ){
    this.id = id;
    this.name = name;
    this.keyword = [ k1, k2, k3, k4, k5, k6 ];
    this.mon = new OpenClose( mon_start, mon_end );
    this.tue = new OpenClose( tue_start, tue_end );
    this.wed = new OpenClose( wed_start, wed_end );
    this.thu = new OpenClose( thu_start, thu_end );
    this.fri = new OpenClose( fri_start, fri_end );
    this.sat = new OpenClose( sat_start, sat_end );
    this.sun = new OpenClose( sun_start, sun_end );
    this.stay = parseFloat( stay ) * 60;        // 時→分変換して格納
    this.charge = parseInt( charge );
    this.address = address;
    this.pts = parseInt( pts );
}
// 開店時間と閉店時間を管理するコンストラクタ
// > open   : 開店時間
// > close  : 閉店時間
function OpenClose( open, close ){
    this.open = open;
    this.close = close;
}



// ***************************************************************

// コース選択・地図表示のためにデータをまとめたコンストラクタ
// > nArray : 名前のリスト（到着順）
// > pArray : 住所のリスト（〃）
// > cArray : 代金のリスト（〃）
// > sArray : その他の観光スポット情報のリスト（〃）
function Course( nArray, pArray, cArray, sArray ){
    this.nameArray   = nArray;
    this.pointArray  = pArray;
    this.chargeArray = cArray;
    this.spotArray   = sArray;
}
/*
-- 格納イメージ
course[
    [0] = [
        .nameArray   = [ start, name1, name2, ..., goal ]
        .pointArray  = [ start, adr1, adr2, ..., goal ]
        .chargeArray = [ 0, xxx, xxx, xxx, ..., 0 ]
        .spotArray   = new SpotDuration();
    ]
    ...
]

*/