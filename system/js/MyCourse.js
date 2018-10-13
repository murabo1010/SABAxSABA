// ***************************************************************
//
//                    マイコース画面用JS関数ファイル
//
// ***************************************************************


// 保存したコースをローカルストレージから読み込み
var saved_get = JSON.parse( localStorage.getItem("saved") );
console.log( saved_get );

// 道案内画面へ遷移する関数
function drawMap(){
    // 選択したコースをローカルストレージへ保存
    var select = saved_get;
    localStorage.setItem("selection", JSON.stringify(select) );
    // 道案内画面へ遷移
    location.href = "Directions.html";
}
