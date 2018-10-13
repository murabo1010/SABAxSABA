/* 縦スクロールを禁止する(iOS対応) スマホ独自のtouchmoveイベントを無効にする */
document.addEventListener('touchmove', function(e) {e.preventDefault();}, {passive: false});
/*addEventListener: イベントの読み込み*/
/*passive: 動き*/