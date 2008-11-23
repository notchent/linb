<?php
class MYSQL{
    // server host
    var $host;
    // log in user
    var $user;
    // password
    var $pass;
    // target db name
    var $dbname;

    //connect id
    var $link_id = 0;
    //is in a transaction process
    var in_transaction=0;

   /**
   * connect and select database
   */
   function connect($host, $user, $pass, $dbname) {
        $this->link_id=@mysql_connect($host,$user,$pass);
        //open failed
        if (!$this->link_id)
         throw new LINB_E('Cant connect to server: $host.');
        //cant find the database
        if(!@mysql_select_db($dbname, $this->link_id))
            throw new LINB_E("Cant open database: $dbname'</b>");
       $this->host = $host;
       $this->user = $user;
       $this->pass = $pass;
       $this->dbname = $dbname;
   }

   /**
   * close the connection
   */
    function close() {
        //open failed
        if(!mysql_close())
            throw new LINB_E('Connection close failed.');
    }
    
   /**
   * query any string
   * return array [{},{},...]
   */
   public function query($any) {
        $i = $this->_query($any);
        $r = $this->_fetch_all($i);
        $this->_release($i);
        return $r;
   }
    
   /**
   * select
   * return array [{},{},...]
   */
   public function select($table, $fields, $where='', $all=false) {
        $q="SELECT ".$fields.' FROM '.$table.' WHERE '.$where;
        $i = $this->_query($q);
        if($all)
            $r = $this->_fetch_all($i);
        else
            $r = $this->_fetch_first($i);
        $this->_release($i);
        return $r;
   }
   /**
   * update
   * return affected rows
   */
   public function update($table, $fields, $where='') {
        $q="UPDATE ".$table." SET ";
        foreach($fields as $key=>$val) {
            if(strtolower($val)=='null')
                $q.= "`$key` = NULL, ";
            elseif(strtolower($val)=='now()')
                $q.= "`$key` = NOW(), ";
            else
                $q.= "`$key`='".mysql_real_escape_string($val)."', ";
        }
        $i = rtrim($q, ', ').' WHERE '.$where.';';
        $r = @mssql_num_rows($i);
        $this->_release($i);
        return $r;
   }

   /**
   * insert
   * return inserted id
   */
    public function insert($table, $fields) {
        $q="INSERT INTO ".$table." ";
        $v=''; $n='';
        foreach($fields as $key=>$val) {
            $n.="`$key`, ";
            if(strtolower($val)=='null')
                $v.="NULL, ";
            elseif(strtolower($val)=='now()')
                $v.="NOW(), ";
            else 
                $v.= "'".mysql_real_escape_string($val)."', ";
        }
        $q .= "(". rtrim($n, ', ') .") VALUES (". rtrim($v, ', ') .");";
        $i = $this->_query($q);
        $r = mysql_insert_id();
        $this->_release($i);
        return $r;
    }

   /**
   * delete
   * return affected rows
   */
    public function delete($table, $where = null) {
        $q = "DELETE FROM ".$table.' WHERE '.$where.';';
        $i = $this->_query($q);
        $r = @mssql_num_rows($i);
        $this->_release($i);
        return $r;
    }


    /**
     * starts a transaction
     */
    public function TransactionBegin() {
        if (! $this->in_transaction) {
            if (! mysql_query("START TRANSACTION", $this->link_id))
                throw new LINB_E('Cant start TRANSACTION in this server: $this->host.');
            else
                $this->in_transaction = 1;
        }else
            throw new LINB_E('Already in transaction: $this->in_transaction.');
    }
    /**
     * ends the current transaction and commits
     */
    public function TransactionEnd() {
        if ($this->in_transaction) {
            if (! mysql_query("COMMIT", $this->link_id))
                throw new LINB_E('Cant commit a transaction: $this->in_transaction.');
            else
                $this->in_transaction = 0;
        }else
            throw new LINB_E('Not in a transaction');
    }

    /**
     * rolls the current transaction back
     */
    public function TransactionRollback() {
        if(! mysql_query("ROLLBACK", $this->link_id))
            throw new LINB_E('Could not rollback transaction: $this->in_transaction.');
        else
            $this->in_transaction = 0;
    }
    
    /*
    *====================================================
    *====================================================
    */

   /**
   * executes SQL query
   * @param
   *    $query_string :  SQL query string to execute
   * @return query_id for the further
   */
    function _query($query_string) {
        $query_id = @mysql_query($query_string,$this->link_id);
        if (!$query_id)
            throw new LINB_E('Query fail: $query_string');
        return $query_id;
    }

   /**
   * fetch one line result from the current query
   */
    function _fetch($query_id) {
        if (!isset($query_id) )
            throw new LINB_E('Invalid query_id $query_id.');
        $record = @mysql_fetch_array($query_id);
        if($record)
            foreach($record as $key=>$val)
                $record[$key]=stripslashes($val);
        return $record;
    }

   /**
   * query the first line only
   */
    function _fetch_first($query_id) {
        $arr = $this->_fetch($query_id);
        return $arr;
    }

    /**
   * fetch all results as array from the current query
   */
    function _fetch_all($query_id) {
        $arr = array();
        while ($row = $this->_fetch($query_id))
            $arr[] = $row;
        return $arr;
    }

   /**
   * relocation the pointer in the result
   */
   function _seek($query_id, $pos) {
        if($pos<=0) return;
        if(eregi("[0-9]",$pos))
            mssql_data_seek($query_id,$pos);
¡¡¡¡}

   /**
   * free result
   */
    function _release($query_id) {
        if(!@mysql_free_result($query_id))
            throw new LINB_E('Result set ID $this->query_id not freed.');
    }
    
}
?>