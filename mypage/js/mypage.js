/* 縦スクロールを禁止する(iOS対応) スマホ独自のtouchmoveイベントを無効にする */
document.addEventListener('touchmove', function(e) {e.preventDefault();}, {passive: false});
/*addEventListener: イベントの読み込み*/
/*passive: 動き*/

$(function(){
    var setFileInput = $('.imgInput'),
        setFileImg = $('.imgView');

    setFileInput.each(function(){
        var selfFile = $(this),
            selfInput = $(this).find('input[type=file]'),
            prevElm = selfFile.find(setFileImg),
            orgPass = prevElm.attr('src');

        selfInput.change(function(){
            var file = $(this).prop('files')[0],
                fileRdr = new FileReader();

            if (!this.files.length){
                prevElm.attr('src', orgPass);
                return;
            } else {
                if (!file.type.match('image.*')){
                    prevElm.attr('src', orgPass);
                    return;
                } else {
                    fileRdr.onload = function() {
                        prevElm.attr('src', fileRdr.result);
                    }
                    fileRdr.readAsDataURL(file);
                }
            }
        });
    });
});

jQuery('select-age#select-age-id').on('change', function(){
    var $this = jQuery(this)
    var $option = $this.find('option:selected');
    jQuery('#display-age').text($option.text());
    // onchange後にフォーカスしてるのが嫌な場合
    $this.blur();
});

function changeItem(obj){ 
    if( obj.value == 0 ){ 
        obj.style.color = ''; 
    }else{ 
        obj.style.color = '#3f3f3f'; 
    } 
} 

//各種ボタン要素を取得しておく
var dialog = document.getElementById('dialog');
var btn = document.getElementById('yes');
var cancel = document.getElementById('cancel');


//「退会」がクリックされたら
yes.addEventListener('click', function(){ console.log('yes') });

//「キャンセル」がクリックされたら
cancel.addEventListener('click', function(){ location.reload(); });