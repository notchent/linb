<?php
class VisualJS extends Unit
{
    const INDEX = "index";
    const DEBUG = "debug";

    const FILE_HTML = ".html";
    const FILE_JS = ".js";

    const PROJECTS_PATH = "projects";
    const IMG_PATH = "img";
    const JS_PATH = "js";
    const LOCATE_PATH = "Locale";
    const EN_PATH = "en.js";

    const TEMPLATE_HTML = "template/index.html";
    const TEMPLATE_DEBUG = "template/debug.html";
    const TEMPLATE_JS = "template/index.js";
    

    public function stimulate(&$hash){
        LINB::checkArgs($hash, array(
            'string' => array(
                'action' => 'open',
                'path' => 'linbApp',
                'className' => 'App',
                'content' => ''
            )
        ));
        $io = LINB::SC('IO');
        //only input relative path, and not ./ or ../ allowed
        switch($hash->action){
        case 'fetchwebfile':
            $content=file_get_contents($hash->path);
            if ($content!==false) {
               return $content;
            }else{
               throw new LINB_E("Error: Can\'t get ".$hash->path);            
            }
            break;
        case 'downloadjs':
    		header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
    		header("Cache-Control: private",false);
            header("Content-Description: File Transfer");
    		header("Content-Type: application/force-download");
            header("Accept-Ranges: bytes");
            header("Content-Disposition: attachment; filename=\"jsLinb.Class.js\";");
    		header("Content-Transfer-Encoding: binary");
    		header("Content-Length: ".strlen($hash->content));
    		header("Pragma: public");
    		header("Expires: 0");
            echo $hash->content;
            
            return;
            break;
        
        
        case 'del':
            foreach( $hash->path as $v)
                $io->delete($v);

            return array('OK'=>true);
            break;
        case 'add':
            $file = $hash->path;
            if($hash->type == 'file')
                $file = $hash->path.'/'.$hash->filename;

            if($io->exists($io->absPath($file)))
                throw new LINB_E("'$file' exists!");

            if(!$io->exists($hash->path))
                $io->dirMake($hash->path, true);

            if($hash->type == 'file'){
                $template = " ";
                if(substr($file,-3,3)==self::FILE_JS){
                    $template = $io->getString(self::TEMPLATE_JS);
                    $template = LINB::parseTemplate($template, array("className" => "Specify_Class_Name_Here"));
                }
                $io->setString($io->absPath($file), $template);
            }

            return array('OK'=>true);
            break;
        case 'save':
            $io->setString($hash->path, $hash->content);
            return array('OK'=>true);
            break;
        case 'getfile':
            return array('file'=> $io->getString($hash->path));
            break;
        case 'open':
            $prjpath=$hash->path;
            if($prjpath{0}=='.')
                throw new LINB_E("Error: Can\'t handle parent path!");
            break;
        case 'release':
            $arr = explode('/', $hash->path);
            $name = array_pop($arr);
            $io->zipDir4Download($hash->path ,$name.'.zip');
            return;

            break;
        case 'new':
            $r = array();
            $r['path'] = $hash->path;
            $r['className'] = $hash->className;

            $prjpath = self::PROJECTS_PATH.DIRECTORY_SEPARATOR.$r['path'];

            //replace exists project file
            $path = $prjpath;
            if($io->exists($path)){
                throw new LINB_E("$path exists!");
            }
            //$io->delete($path);
            $io->dirMake($path, true);

            $template = $io->getString(self::TEMPLATE_HTML);
            //html page file
            file_put_contents($path.DIRECTORY_SEPARATOR.self::INDEX.self::FILE_HTML, LINB::parseTemplate($template, $r));

            $template = $io->getString(self::TEMPLATE_DEBUG);
            //html page file
            file_put_contents($path.DIRECTORY_SEPARATOR.self::DEBUG.self::FILE_HTML, LINB::parseTemplate($template, $r));

            //img path
            $io->dirMake($path.DIRECTORY_SEPARATOR.self::IMG_PATH, true);
            
            $rpath=$path;
            //base class path
            $path = $rpath.DIRECTORY_SEPARATOR.$r['className'];
            $io->dirMake($path, true);
            //js path
            $path = $path.DIRECTORY_SEPARATOR.self::JS_PATH;
            $io->dirMake($path, true);

            $template = $io->getString(self::TEMPLATE_JS);
            // js class file
            file_put_contents($path.DIRECTORY_SEPARATOR.self::INDEX.self::FILE_JS, LINB::parseTemplate($template, $r));

            $path=$rpath.DIRECTORY_SEPARATOR.self::LOCATE_PATH;
            //lang path
            $io->dirMake($path, true);
            $io->setString($path.DIRECTORY_SEPARATOR.self::EN_PATH, '{}');
            break;
        case 'upload_img':
            $uploader = LINB::SC('Uploader');
            $uploader->set_type('image');
            $r = array();
            foreach($_FILES as $file)
                if(!empty($file['name']))
                    $r[] = $uploader->save($_FILES['file'],$save_path);
            unset($uploader);
            return $r;
            break;
        }
        $prjpath = str_replace("/", "\\", $prjpath);
        //$b = $io->dirList($prjpath);
        $b = $io->search("[a-zA-Z0-9].*", $prjpath, -1, isset($hash->deep)?$hash->deep:5);
        $root=str_replace("\\", "/", realpath('.')).'/';
        //ensure to return relative url format: '/'
        foreach($b as &$v){
            $v['location'] = str_replace("\\", "/", $v['location']);
            $v['location'] = str_replace($root, "", $v['location']);
        }
        unset($io);
        return $b;
    }
}

?>
