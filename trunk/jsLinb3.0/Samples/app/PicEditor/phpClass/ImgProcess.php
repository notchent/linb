<?php
/*

IMAGEBASEPATH and IMAGEBASEURL are from class.image.config.win.php
*/

class ImgProcess extends Unit
{
    const UPLOAD_PATH='upload';
    const MAX_SIZE=350000;
    
    public function stimulate(&$hash){
        //
        //
        //check paras 1
        //
        //
        LINB::checkArgs($hash, array(
            'string' => array(
                'action' => NULL
            )
        ));
        //handle the process
        $action=$hash->action;
        switch($action) {
            case 'getsession':
                return $this->randString();
            case 'upload':
                LINB::checkArgs($hash, array(
                    'string' => array(
                        'sessionname' => NULL
                    )
                ));
                $relpath = self::UPLOAD_PATH . DIRECTORY_SEPARATOR. $hash->sessionname . DIRECTORY_SEPARATOR; 
                $save_path = IMAGEBASEPATH . DIRECTORY_SEPARATOR . $relpath;
                $urlpath = IMAGEBASEURL . "/" . self::UPLOAD_PATH. "/" .$hash->sessionname . "/";

                $up = new Uploader;
                $up->set_type(array('gif'=>'image/gif','png'=>'image/png','jpeg'=>'image/jpeg','jpg'=>'image/jpeg'));
                $up->set_maxsize(self::MAX_SIZE);
                
                $io=new IO;
                $io->dirMake($save_path);

                $file=$_FILES['file'];

                $ext = $up->get_ext($file);

                $rfn = $this->randString();
                $filename = $rfn.'.'.$ext;

                $up->save($file, $save_path, $filename);
                
            	$objPhoto = new clsImage();
            	$objPhoto->loadfile($relpath.$filename);
            	$objPhoto->resize(50,38);
            	$fn2=$rfn.'.s.'.$ext;
            	$objPhoto->savefile($relpath.$fn2);

                return array('id'=>$rfn, 'ext'=>$ext, 'big'=>$urlpath . $filename, 'image'=>$urlpath . $fn2);
            case 'openweb':
                LINB::checkArgs($hash, array(
                    'string' => array(
                        'sessionname' => NULL,
                        'url' => NULL
                    )
                ));
                
                $relpath = self::UPLOAD_PATH . DIRECTORY_SEPARATOR. $hash->sessionname . DIRECTORY_SEPARATOR; 
                $save_path = IMAGEBASEPATH . DIRECTORY_SEPARATOR . $relpath;
                $urlpath = IMAGEBASEURL . "/" . self::UPLOAD_PATH. "/" .$hash->sessionname . "/";               
                
                $ext=strrchr($hash->url,".");
                $rfn = $this->randString();
                $filename = $rfn.$ext;
                if($ext!=".gif" && $ext!=".jpg"&& $ext!=".png"&& $ext!=".jepg")
                    throw new Exception('Mime type invalid!');
 
                $io=new IO;
                $io->dirMake($save_path);
                copy($hash->url,$save_path.$filename);

  /*
                ob_start();
                readfile($hash->url);
                $img = ob_get_contents();
                ob_end_clean();

                $io=new IO;
                $io->dirMake($save_path);

                $size = strlen($img);
                if($size>self::MAX_SIZE)
                    throw new Exception('file is too large!');

                $fp2=@fopen($save_path.$filename, "a");
                fwrite($fp2,$img);
                fclose($fp2);
*/
            	$objPhoto = new clsImage();
            	$objPhoto->loadfile($relpath.$filename);
            	$objPhoto->resize(50,38);
            	$fn2=$rfn.'.s'.$ext;
            	$objPhoto->savefile($relpath.$fn2);

                return array('id'=>$rfn, 'ext'=>substr($ext,1), 'big'=>$urlpath . $filename, 'image'=>$urlpath . $fn2);
            case 'listphotos':
                LINB::checkArgs($hash, array(
                    'string' => array(
                        'sessionname' => NULL
                    )
                ));
                $io=new IO;
                $save_path = IMAGEBASEPATH.DIRECTORY_SEPARATOR.self::UPLOAD_PATH . DIRECTORY_SEPARATOR. $hash->sessionname . DIRECTORY_SEPARATOR;
                $ret=array();
                if(is_dir($save_path)){
                    $list= $io->search("[-a-zA-Z0-9]+\.s\.(gif|jpg|png|jepg)", $save_path);
                    foreach($list as $v){
                        $a=explode('.', $v['name']);
                        array_push($ret, array('id'=>$a[0],'ext'=>$a[2], 'image'=>IMAGEBASEURL . "/" . self::UPLOAD_PATH. "/" . $hash->sessionname . "/" . $v['name'], 'big'=>IMAGEBASEURL . "/" . self::UPLOAD_PATH. "/" . $hash->sessionname . "/" . str_replace('.s.','.',$v['name'])) );
                    }
                }
                return $ret;
            case 'download':
                LINB::checkArgs($hash, array(
                    'string' => array(
                        'sessionname' => NULL,
                        'filename' => NULL,
                        'fileext' => 'jpg'
                    )
                ));
                $logindate = date("Y-m-d");
        
                //original file name
                if(property_exists($hash, 'origin')){
                    if($hash->origin=='demos')
                        $filename = 'demos' . DIRECTORY_SEPARATOR. $hash->filename . "." . $hash->fileext;
                    else if($hash->origin=='upload')
                        $filename = 'upload' . DIRECTORY_SEPARATOR . $hash->sessionname . DIRECTORY_SEPARATOR . $hash->filename . "." . $hash->fileext;
                }else
                    $filename = $logindate . DIRECTORY_SEPARATOR. $hash->sessionname . DIRECTORY_SEPARATOR. $hash->filename . DIRECTORY_SEPARATOR . $hash->tag . "." . $hash->fileext;

                $filename= IMAGEBASEPATH . DIRECTORY_SEPARATOR . $filename;
                header("Pragma: public");
        		header("Expires: 0");
        		header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        		header("Cache-Control: private",false);
        		Header("Content-type: application/octet-stream");
        		header("Content-Disposition: attachment; filename=\"".basename($filename)."\";" );
        		header("Content-Transfer-Encoding: binary");
        		//header("Content-Length: ".@filesize($filename));
        		set_time_limit(0);
        		@readfile("$filename");
        }
        
        //
        //
        //check paras 2
        //
        //
        LINB::checkArgs($hash, array(
            'string' => array(
                'sessionname' => NULL,
                'filename' => NULL,
                'tag' => '',
                'fileext' => 'jpg'
            )
        ));
        
        $logindate = date("Y-m-d");

        //original file name
        if(property_exists($hash, 'origin')){
            if($hash->origin=='demos')
                $filename = 'demos' . DIRECTORY_SEPARATOR. $hash->filename . "." . $hash->fileext;
            else if($hash->origin=='upload')
                $filename = 'upload' . DIRECTORY_SEPARATOR . $hash->sessionname . DIRECTORY_SEPARATOR . $hash->filename . "." . $hash->fileext;
        }else
            $filename = $logindate . DIRECTORY_SEPARATOR. $hash->sessionname . DIRECTORY_SEPARATOR. $hash->filename . DIRECTORY_SEPARATOR . $hash->tag . "." . $hash->fileext;
 
        //new class and load file        
    	$objPhoto = new clsImage();
    	$objPhoto->loadfile($filename);

        //new file name
        $tag = (string)time();
        $filename = $logindate . DIRECTORY_SEPARATOR. $hash->sessionname . DIRECTORY_SEPARATOR. $hash->filename . DIRECTORY_SEPARATOR . $tag . "." . $hash->fileext;

        //handle the process 2
        $action=$hash->action;
        switch($action) {
            case "get_modern_list":
                return $objPhoto->get_modern_list(false);
            break;
            case "get_avatar_list":
                return $objPhoto->get_avatar_list(false);
            break;
            case "get_font_list":
                return $objPhoto->get_font_list();
            break;



            case "resize":
                LINB::checkArgs($hash, array(
                    'integer' => array(
                        'width' => NULL,
                        'height' => NULL
                    )
                ));
                $objPhoto->$action($hash->width, $hash->height);
                break;
//filter
            case "filter_grayscale":
            case "filter_negate":
            case "filter_edgedetect":
            case "filter_embosses":
            case "filter_gaussian_blur":
            case "filter_selective_blur":
            case "filter_mean_removal":
                $objPhoto->$action();
                break;
            case "filter_smooth":
                $objPhoto->$action(100);
                break;
            case "filter_brightness":
            case "filter_contrast":
                LINB::checkArgs($hash, array(
                    'integer' => array(
                        'value' => 0
                    )
                ));
                $objPhoto->$action($hash->value);
                break;
            case "mirror_v":
                 $objPhoto->mirror(true);
                 break;
            case "mirror_h":
                $objPhoto->mirror(false);
                break;
//one color
            case "onecolor_red":
                $objPhoto->filter_colorize(255,0,0,0);
                break;
            case "onecolor_green":
                $objPhoto->filter_colorize(0,255,0,0);
                break;
            case "onecolor_blue":
                $objPhoto->filter_colorize(0,0,255,0);
                break;
//rotation
            case "rotate_90":
                $objPhoto->rotate(90,0);
                break;
            case "rotate_180":
                $objPhoto->rotate(180,0);
                break;
            case "rotate_270":
                $objPhoto->rotate(270,0);
                break;
            
            case "avatar":
                LINB::checkArgs($hash, array(
                    'string' => array(
                        'value' => 0
                    ),
                    'integer' => array(
                        'x' => 0,
                        'y' => 0,
                        'width' => "",
                        'height' => ""
                    )
                ));
                $objPhoto->$action($hash->value, $hash->x, $hash->y, $hash->width, $hash->height);
                break;
            case "modern_frame":
                LINB::checkArgs($hash, array(
                    'string' => array(
                        'value' => 0
                    )
                ));
                $objPhoto->$action($hash->value,'#'.$hash->background,$hash->x, $hash->y,$hash->width, $hash->height);
                break;
            case "cut":
                LINB::checkArgs($hash, array(
                    'integer' => array(
                        'left' => 0,
                        'top' => 0,
                        'width' => NULL,
                        'height' => NULL
                    )
                ));
                $objPhoto->$action($hash->left, $hash->top, $hash->width, $hash->height);   
                break;
            case "writetext":
                LINB::checkArgs($hash, array(
                    'string' => array(
                        'text' => NULL,
                        'fontcolor' => '0,0,0',
                        'fontfile' => 'Chopin Script'
                    ),
                    'integer' => array(
                        'fontsize' => 16,
                        'x' => 0,
                        'y' => 0
                    )
                ));
                $objPhoto->$action($hash->text, $hash->fontsize, $hash->fontcolor, $hash->fontfile, $hash->x, $hash->y);   
                break;
        }

        //save new file
        $objPhoto->savefile($filename);
        
        $url = IMAGEBASEURL . "/" . $logindate . '/' . $hash->sessionname . '/'. $hash->filename . "/" . $tag . "." . $hash->fileext;
 
        //return results
        return array('tag'=>$tag, 'url'=>$url, 'logindate'=>$logindate);
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
