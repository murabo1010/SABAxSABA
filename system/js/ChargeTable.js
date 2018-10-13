// ***************************************************************
//
//                    料金画面用のテストサンプル
//
// ***************************************************************

var select_get = JSON.parse( localStorage.getItem("selection") );

// 人数
var people = JSON.parse( localStorage.getItem("people") );

// 表の動的作成
// > tableID    : 表を表示する要素のID
makeTable("table");
function makeTable( tableId ) {
    
    // 表の作成開始
    var rows = [];
    var table = document.createElement("table");

    // カラムヘッダの描写
    var columnHeader = ["場所", "料金(人数分)", "料金(一人分)"];
    var COL = 3;    // 列数（名前、料金(人数分) 、料金(一人分)
    rows.push(table.insertRow(-1)); // 行の追加
    for (j = 0; j < COL; j++) {
        cell = rows[0].insertCell(-1);
        cell.appendChild(document.createTextNode( columnHeader[j] ));
        // 背景色の設定
        cell.style.backgroundColor = "#bbb"; // ヘッダ行
    }
    
    // 表に2次元配列の要素を格納
    var ROW = select_get.nameArray.length;  // 行数
    for (i = 0; i < ROW; i++) {
        rows.push(table.insertRow(-1)); // 行の追加
        for (j = 0; j < COL; j++) {
            cell = rows[i+1].insertCell(-1);
            
            var value;
            switch(j){
                case 0: value = select_get.nameArray[i];             break;
                case 1: value = select_get.chargeArray[i] * people;  break;
                case 2: value = select_get.chargeArray[i];           break;
            }
            cell.appendChild(document.createTextNode( value ));
            // 背景色の設定
            cell.style.backgroundColor = "#ffffff"; // ヘッダ行以外
        }
    }
    
    var x=0;
    for (i = 0; i < ROW; i++) {
        x += select_get.chargeArray[i];
    }
    
    var sum = ["金額合計", x * people, x];
    rows.push(table.insertRow(-1)); // 行の追加
    for (j = 0; j < COL; j++) {
        cell = rows[ROW+1].insertCell(-1);
        cell.appendChild(document.createTextNode( sum[j] ));
        // 背景色の設定
        cell.style.backgroundColor = "#ffffff"; // ヘッダ行
    }
    // 指定したdiv要素に表を加える
    document.getElementById(tableId).appendChild(table);
}
