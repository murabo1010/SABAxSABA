/* 縦スクロールを禁止する(iOS対応) スマホ独自のtouchmoveイベントを無効にする */
document.addEventListener('touchmove', function(e) {e.preventDefault();}, {passive: false});
/*addEventListener: イベントの読み込み*/
/*passive: 動き*/

$(function(){
    $(".accordion li a").on("click", function() {
        $(this).next().slideToggle();	
        // activeが存在する場合
        if ($(this).children(".accordion_icon").hasClass('active')) {			
            // activeを削除
            $(this).children(".accordion_icon").removeClass('active');				
        }
        else {
            // activeを追加
            $(this).children(".accordion_icon").addClass('active');			
        }			
    });
});