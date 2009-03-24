<?php
class DBProcess extends Unit
{
    const DB_HOST='localhost';
    const DB_USER='root';
    const DB_PASS='';
    const DB_DBNAME='mss';

    public function stimulate(&$hash){
        //must have a string parameter 'action'
        LINB::checkArgs($hash, array(
            'string' => array(
                'action' => NULL
            )
        ));
        
        $action=$hash->action;
        //handle the process
        switch($action) {
            case 'getsession':
                return $this->randString();
            default:
                return $this->$action($hash);
        }
    }

    private function db_open(){
        $db = new MYSQL;
        $db->connect(self::DB_HOST, self::DB_USER, self::DB_PASS, self::DB_DBNAME);
        @mysql_query("SET NAMES 'UTF8'");
        return $db;
    }
    
    private function db_insert_any($hash){
        LINB::checkArgs($hash, array(
            'string' => array(
                'key' => NULL
            ),
            'object' => array(
                'fields' => NULL
            )
        ));
        $rtn=$this->db_open()->insert('tbl_'.$hash->key, $hash->fields);
        return $rtn;
    }

    private function db_select_any($hash){
        LINB::checkArgs($hash, array(
            'string' => array(
                'key' => NULL,
                'fields' => '*',
                'where' => '1',
                'assoc' => false
            )
        ));
        $rtn=$this->db_open()->select('tbl_'.$hash->key, $hash->fields, $hash->where, true ,$hash->assoc);
        return $rtn;
    }
    
    private function db_query_any($hash){
        LINB::checkArgs($hash, array(
            'string' => array(
                'query' => '',
                'assoc' => false
            )
        ));
        $rtn=$this->db_open()->query($hash->query,$hash->assoc);
        return $rtn;
    }
    
    private function db_update_any($hash){
        LINB::checkArgs($hash, array(
            'string' => array(
                'key' => NULL,
                'uidname' => '`id`',
                'uid' => NULL
            ),
            'object' => array(
                'fields' => NULL
            )
        ));
        $rtn=$this->db_open()->update('tbl_'.$hash->key, $hash->fields, $hash->uidname."="."'".$hash->uid."'");
        return $rtn;
    }

    private function db_delete_any($hash){
        LINB::checkArgs($hash, array(
            'string' => array(
                'key' => NULL,
                'uidname' => '`id`',
                'uid' => NULL
            )
        ));
        $rtn=$this->db_open()->delete('tbl_'.$hash->key, $hash->uidname."="."'".$hash->uid."'");
        return $rtn;
    }

    private function randString() {
        $chars = "abcdefghijkmnopqrstuvwxyz023456789";
        srand((double)microtime()*1000000);
        $i = 0;
        $pass = date('h-i-s') ;
    
        while ($i <= 16) {
            $num = rand() % 33;
            $tmp = substr($chars, $num, 1);
            $pass = $pass . $tmp;
            $i++;
        }
        return $pass;
    }
}
?>
