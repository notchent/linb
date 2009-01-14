<?php
class DBProcess extends Unit
{
    const DB_HOST='localhost';
    const DB_USER='root';
    const DB_PASS='';
    const DB_DBNAME='testDB';

    public function stimulate(&$hash){
        //check action here
        LINB::checkArgs($hash, array(
            'string' => array(
                'action' => NULL
            )
        ));
        
        //handle the process
        switch($hash->action) {
            case 'getlist':
                $db = new MYSQL;
                $db->connect(self::DB_HOST, self::DB_USER, self::DB_PASS, self::DB_DBNAME);
                @mysql_query("SET NAMES 'UTF8'");
                $rtn=$db->query("select `key`,`value` from `tbl_test`");
                $db->close();

                return $rtn;
            case 'update':
                LINB::checkArgs($hash, array(
                    'string' => array(
                        'key' => NULL,
                        'value' => NULL
                    )
                ));

                $db = new MYSQL;
                $db->connect(self::DB_HOST, self::DB_USER, self::DB_PASS, self::DB_DBNAME);
                $rtn=$db->update("tbl_test",array("key"=>$hash->key, "value"=>$hash->value), "`key`='".$hash->key."'");
                $db->close();
                
                return 'ok';            
            case 'delete':
                LINB::checkArgs($hash, array(
                    'string' => array(
                        'key' => NULL
                    )
                ));
                $db = new MYSQL;
                $db->connect(self::DB_HOST, self::DB_USER, self::DB_PASS, self::DB_DBNAME);
                $rtn=$db->delete("tbl_test", "`key`='".$hash->key."'");
                $db->close();
                
                return 'ok';            
            case 'create':
                LINB::checkArgs($hash, array(
                    'string' => array(
                        'key' => NULL,
                        'value' => NULL
                    )
                ));
        
                $db = new MYSQL;
                $db->connect(self::DB_HOST, self::DB_USER, self::DB_PASS, self::DB_DBNAME);
                $rtn=$db->insert("tbl_test", array("key"=>$hash->key, "value"=>$hash->value));
                $db->close();
                
                return 'ok';
        }
    }
}
?>
