<?php

// ******************************************************************* //
//
//                          MeCab�����ǲ��ϴؿ�
//
// ******************************************************************* //

// -- ����
// > $str   : Twitter����Ƥ���ʸ�ϡ�1�ԡ�

// -- �֤���
// > $words : ̾�줬�и����ٽ礬��Ǽ���줿����

function GetWords( $str ) {
    
    // ʸ�Ϥ�ñ��Ƕ��ڤ�
    $mecab = new \MeCab\Tagger();
    
    // ʸ�����
    $node = $mecab->parseToNode( $str );
    
    // ñ�줴�Ȥ˽���
    $result = array();
    while($node){
        
        // ����(BOS)������(EOS)�ʳ������
        if($node->getStat() != 2 && $node->getStat() != 3){
            
            // ʸ��������ʬ��
            $feat_list = explode(",", $node->getFeature());

            // ̾��Τߤ����
            if(count($feat_list) > 0 && $feat_list[0] === "̾��"){
                $result[] = $node->getSurface();
            }
        }
        // ���θ���
        $node = $node->getNext();
    }
    
    // ��̤�ɽ��
    //echo "<pre>";
    //print_r( $result );
    //echo "</pre>";
    
    // �и�����򥫥����
    $words = array();
    foreach ( $result as $value ) {
        $words[ $value ]++;
    }
    unset( $value );    // ���Ȳ��

    // �и������˹߽祽����
    arsort( $words );

    // ��̤�ɽ��
    //echo $str, "<br>";
    //echo "<pre>";
    //print_r( $words );
    //echo "</pre>";
    
    return $words;
}

?>