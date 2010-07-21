<?php
   define("IMAGEDEBUG","0");	 

   //define("BASEURL","http://www.linb.net/Examples/app/PicEditor/imglib");
   //define("BASEPATH","\\home\\rubydown\\public_html\\linb\\Examples\\app\\PicEditor\\imglib");
   define("BASEURL","http://localhost:8080/jslinbx/Examples/app/PicEditor/imglib");
   define("BASEPATH","D:\\8080\\jsLinbx\\Examples\\app\\PicEditor\imglib");
   
   define("IMAGEBASEURL", BASEURL . "/working");
   define("IMAGEBASEPATH",BASEPATH . DIRECTORY_SEPARATOR . "working");
	 
   define("MODERNPATH", BASEPATH . DIRECTORY_SEPARATOR . "template" . DIRECTORY_SEPARATOR . "modern");
   define("AVATARPATH", BASEPATH . DIRECTORY_SEPARATOR . "template" . DIRECTORY_SEPARATOR . "avatar");


   define("IMAGEFONTDIR", BASEPATH . DIRECTORY_SEPARATOR . "font");
	 
   define("IMAGEINTERLACE","1");
   define("IMAGEJPEGQUALITY","80");	
?>