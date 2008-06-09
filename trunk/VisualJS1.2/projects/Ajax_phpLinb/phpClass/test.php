<?php
class test extends Unit
{
    public function stimulate(&$hash){
        //if request obj doesnt inlucde p1, server will return  'server_set1'
        LINB::checkArgs($hash, array(
            'string' => array(
                'p1' => 'server_set',
                'p2' => 'server_set'
            )
        ));
        $hash->time=date("Y-m-d H:i:s", time()) ;
        return array($hash);
    }
}
?>
