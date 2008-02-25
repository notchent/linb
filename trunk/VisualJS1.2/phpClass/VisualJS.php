<?php
class VisualJS extends Unit
{
    const INDEX = "index";

    const FILE_HTML = ".html";
    const FILE_JS = ".js";

    const PROJECTS_PATH = "projects";
    const IMG_PATH = "img";
    const JS_PATH = "js";
    const LOCATE_PATH = "Locale";
    const EN_PATH = "en.js";

    const TEMPLATE_HTML = "template/index.html";
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

            if($hash->type == 'file')
                $io->setString($io->absPath($file), ' ');

            return array('OK'=>true);
            break;
        case 'save':
            $io->setString($hash->path, $hash->content);
            return array('OK'=>true);
            break;
        case 'getfile':
            echo $io->getString($hash->path);
            return;
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

            //img path
            $io->dirMake($path.DIRECTORY_SEPARATOR.self::IMG_PATH, true);
            //base class path
            $path = $path.DIRECTORY_SEPARATOR.$r['className'];
            $io->dirMake($path, true);
            //js path
            $path = $path.DIRECTORY_SEPARATOR.self::JS_PATH;
            $io->dirMake($path, true);

            $template = $io->getString(self::TEMPLATE_JS);
            // js class file
            file_put_contents($path.DIRECTORY_SEPARATOR.self::INDEX.self::FILE_JS, LINB::parseTemplate($template, $r));

            $path=$path.DIRECTORY_SEPARATOR.self::LOCATE_PATH;
            //lang path
            $io->dirMake($path, true);
            $io->setString($path.DIRECTORY_SEPARATOR.self::EN_PATH, '{}');
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
