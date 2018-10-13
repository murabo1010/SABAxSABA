// ***************************************************************
//
//                    コース選択画面用JS関数ファイル
//
// ***************************************************************



// 作成したコースの配列
var course_get   = JSON.parse( localStorage.getItem("couseArray") );
console.log( course_get );

// マップ描写画面へ遷移する関数
// > c  : どこのコースを選んだか
function drawMap( c ){
    // 選択したコースをローカルストレージへ書き出し
    var select = course_get[c];
    localStorage.setItem("selection", JSON.stringify(select) );
    // マップ描写画面へ遷移
    location.href = "../course/course.html";
}


// 選択したコースを保存する関数
// > c  : どこのコースを選んだか
function saveMap( c ){
    // 選択したコースをローカルストレージへ書き出し
    var select = course_get[c];
    localStorage.setItem("saved", JSON.stringify(select) );
    //alert("SAVED!!");
}