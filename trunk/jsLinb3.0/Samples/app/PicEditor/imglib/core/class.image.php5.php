<?php
/**************************************************************************
 * CLASS clsImage [PHP5] v1.0 09.12.2004      
 *
 * http://www.zutz.nl/phpclasses
 *
 * this is an image manipulation class for PHP5 with the Zend engine
 * based on the GD Library. supported imagetypes: [ jpg | gif | png ]
 * 
 * LICENSE
 * Public domain
 *
 * MODERATOR
 * Ronald Zötsch - ZUTZ Automatisering
 **************************************************************************/
if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
    include_once ("class.image.config.win.php");
else 
    include_once ("class.image.config.unix.php");
include ("class.image.interface.php");

class clsImage implements interfaceImage {
/* constants */
  const IMAGEBASEURL = IMAGEBASEURL;
  const IMAGEBASEPATH = IMAGEBASEPATH;
  const IMAGEFONTDIR = IMAGEFONTDIR;
	const IMAGEINTERLACE = IMAGEINTERLACE;
	const IMAGEJPEGQUALITY = IMAGEJPEGQUALITY;
	const IMAGEDEBUG = IMAGEDEBUG;
	
/* properties */
  private $ImageStream;
  private $aProperties;
	protected $sFileLocation;
  protected $sImageURL;
  protected $IMAGEBASEURL;
  protected $IMAGEBASEPATH;
		
	public $interlace;
	public $jpegquality;	

/* default methods */
  function __construct($path="", $url="") {
	/* constructor */
	  $this->aProperties = array();
		$this->jpegquality = clsImage::IMAGEJPEGQUALITY;
		
		/* set interlace boolean */
		if (clsImage::IMAGEINTERLACE != 0) {
		  $this->interlace = true;
		}
		else {
		  $this->interlace = false;		
		}
		$this->IMAGEBASEURL = ($url=="")?clsImage::IMAGEBASEURL:$url;
    $this->IMAGEBASEPATH = ($path=="")?clsImage::IMAGEBASEPATH:$path;
	}
	
  function __destruct() {
	/* destructor */
    unset($this->ImageStream);
    unset($this->aProperties);
	}
	
  public function __get($sPropertyName) {
	/* get properties */
		if (isset($this->aProperties[$sPropertyName])) {
		  $sPropertyValue = $this->aProperties[$sPropertyName];
		}
		else {	
      $sPropertyValue = NULL;
		}
		
    return($sPropertyValue);
  }
	
  public function __set($sPropertyName, $sPropertyValue) {
	/* set properties */
		if (!isset($this->aProperties)) {
		  $this->aProperties = array();
		}

    $this->aProperties[$sPropertyName] = $sPropertyValue;			
  }		
	
/* private methods */
	private function printError($sMessage, $sMethod = __METHOD__, $sLine = __LINE__) {
	/* echo errormessage to client and terminate script run */
	  if(clsImage::IMAGEDEBUG == 1) {
		  echo $sMethod . "(" . $sLine . ") " . $sMessage;
    }

	  if(clsImage::IMAGEDEBUG == 2) {
			header("Location: class.image.debug.code.php?line={$sLine}#{$sLine}");
    }

		exit;	
	}
	
  private function loadImage() {
	/* load a image from file */
	  switch($this->type) {
		  case 1: 
			  $this->ImageStream = @imagecreatefromgif($this->sFileLocation);
			  break;
			case 2:
			  $this->ImageStream = @imagecreatefromjpeg($this->sFileLocation);			
			  break;
			case 3: 
			  $this->ImageStream = @imagecreatefrompng($this->sFileLocation);			
			  break;
			default: 
			  $this->printError('invalid imagetype',__METHOD__,__LINE__); 
		}	
		
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    }		
	}
	
  private function saveImage() {
	/* store a memoryimage to file */
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    }

    /*ensure the dir*/
	$i = explode(DIRECTORY_SEPARATOR, $this->sFileLocation);
	$path = array_shift($i);
	for ($j=0,$k=count($i);$j<$k-1;$j++) {
		$path .= DIRECTORY_SEPARATOR.$i[$j];
		if (!is_dir($path)) {
			if (!@mkdir($path)){
			    $this->printError("Can\'t make dir --$path",__METHOD__,__LINE__); 
			}
		}
	}


	  switch($this->type) {
		  case 1: 
			  /* store a interlaced gif image */
			  if ($this->interlace === true) {
   			  imageinterlace($this->ImageStream, 1);
				}
				
			  imagegif($this->ImageStream,$this->sFileLocation);
			  break;
			case 2:
			  /* store a progressive jpeg image (with default quality value)*/
			  if ($this->interlace === true) {
   			  imageinterlace($this->ImageStream, 1);
				}
				
			  imagejpeg($this->ImageStream,$this->sFileLocation,$this->jpegquality);							
			  break;
			case 3: 
			  /* store a png image */
			  imagepng($this->ImageStream,$this->sFileLocation);			
			  break;
			default: 
			  $this->printError('invalid imagetype',__METHOD__,__LINE__); 
				
			if (!file_exists($this->sFileLocation)) {
				$this->printError('file not stored',__METHOD__,__LINE__); 		
			}				
		}			
	}	
	
  private function showImage() {
	/* show a memoryimage to screen */
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    }
		
	  switch($this->type) {
		  case 1: 
			  imagegif($this->ImageStream);
			  break;
			case 2:
			  imagejpeg($this->ImageStream);			
			  break;
			case 3: 
			  imagepng($this->ImageStream);			
			  break;
			default: 
			  $this->printError('invalid imagetype',__METHOD__,__LINE__); 				
		}			
	}	
	
  private function setFilenameExtension() {
	/* set the imahe type and mimetype */
	  $sOldFilenameExtension = substr($this->filename,strlen($this->filename) - 4, 4);
		if (($sOldFilenameExtension != '.gif') &&
		    ($sOldFilenameExtension != '.jpg') &&
			  ($sOldFilenameExtension != '.png')) {
			$this->printError('invalid filename extension',__METHOD__,__LINE__);
		}
		
	  switch($this->type) {
		  case 1: 
			  $this->filename = substr($this->filename,0,strlen($this->filename) - 4) . '.gif';
			  break;
			case 2:
			  $this->filename = substr($this->filename,0,strlen($this->filename) - 4) . '.jpg';			
			  break;
			case 3: 
			  $this->filename = substr($this->filename,0,strlen($this->filename) - 4) . '.png';			
			  break;
			default: 
			  $this->printError('invalid imagetype',__METHOD__,__LINE__); 
		}			
	} 

  private function setImageType($iType) {
	/* set the imahe type and mimetype */
	  switch($iType) {
		  case 1: 
			  $this->type = $iType;
			  $this->mimetype = 'image/gif';
				$this->setFilenameExtension();
			  break;
			case 2:
			  $this->type = $iType;
			  $this->mimetype = 'image/jpeg';
				$this->setFilenameExtension();							
			  break;
			case 3: 
			  $this->type = $iType;
			  $this->mimetype = 'image/png';
				$this->setFilenameExtension();							
			  break;
			default: 
			  $this->printError('invalid imagetype',__METHOD__,__LINE__); 
		}			
	}

	private function setLocations($sFileName) {
  /* set the photo url */
	  $this->filename = $sFileName;
    $this->sFileLocation = $this->IMAGEBASEPATH . DIRECTORY_SEPARATOR . $this->filename;
    $this->sImageURL = $this->IMAGEBASEURL . '/' . $this->filename;		
	}
	
	public function setPathAndURL($path="",$url=""){
    $this->IMAGEBASEPATH = ($path=="")?$this->IMAGEBASEPATH:$path;
    $this->IMAGEBASEURL = ($url=="")?$this->IMAGEBASEURL:$url;
  } 
	
	private function initializeImageProperties() {
	/* get imagesize from file and set imagesize array */
	  list($this->width, $this->height, $iType, $this->htmlattributes) = getimagesize($this->sFileLocation);

		if (($this->width < 1) || ($this->height < 1)) {
		  $this->printError('invalid imagesize',__METHOD__,__LINE__); 
		}			 
		
		$this->setImageOrientation();
		$this->setImageType($iType);
	}

	private function setImageOrientation() {
	/* get image-orientation based on imagesize
	   options: [ portrait | landscape | square ] */
		 
		if ($this->width < $this->height) {
		  $this->orientation = 'portrait';
		}
		
		if ($this->width > $this->height) {
		  $this->orientation = 'landscape';
		}
		
		if ($this->width == $this->height) {
		  $this->orientation = 'square';
		}							
	}	
		
/* public methods */
	public function loadfile($sFileName) {
	/* load an image from file into memory */
	  $this->setLocations($sFileName);
		
		if (file_exists($this->sFileLocation)) { 		
		  $this->initializeImageProperties();
      $this->loadImage();
		}
		else {
		  $this->printError('file not found',__METHOD__,__LINE__); 
		}

	}
	
	public function savefile($sFileName = NULL) {
  /* store memory image to file */
	  if ((isset($sFileName)) && ($sFileName != '')) {
      $this->setLocations($sFileName);
		}	
	 
    $this->saveImage();
	}	
	
	public function preview() {
  /* print memory image to screen */
		header("Content-type: {$this->mimetype}");
    $this->showImage();	
	}	

	public function showhtml($sAltText = NULL, $sClassName = NULL) {
  /* print image as htmltag */
		if (file_exists($this->sFileLocation)) {
		  /* set html alt attribute */
		  if ((isset($sAltText)) && ($sAltText != '')) {
			  $htmlAlt = " alt=\"".$sAltText."\"";
			}
			else {
			  $htmlAlt = "";
			}
			
		  /* set html class attribute */
		  if ((isset($sClassName)) && ($sClassName != '')) {
			  $htmlClass = " class=\"".$sClassName."\"";
			}
			else {
			  $htmlClass = " border=\"0\"";
			}			
			
	    $sHTMLOutput = '<img src="'.$this->sImageURL.'"'.$htmlClass.' width="'.$this->width.'" height="'.$this->height.'"'.$htmlAlt.'>';	
			print $sHTMLOutput;
		}
		else {
		  $this->printError('file not found',__METHOD__,__LINE__); 
		}	
	}
	
	public function resize($iNewWidth, $iNewHeight) {
	/* resize the memoryimage do not keep ratio */
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    }    
			
		if(function_exists("imagecopyresampled")){
			$ResizedImageStream = imagecreatetruecolor($iNewWidth, $iNewHeight);
			imagecopyresampled($ResizedImageStream, $this->ImageStream, 0, 0, 0, 0, $iNewWidth, $iNewHeight, $this->width, $this->height);
		}
		else{
			$ResizedImageStream = imagecreate($iNewWidth, $iNewHeight);
				imagecopyresized($ResizedImageStream, $this->ImageStream, 0, 0, 0, 0, $iNewWidth, $iNewHeight, $this->width, $this->height);
		}		
		
		$this->ImageStream = $ResizedImageStream;
		$this->width = $iNewWidth;
		$this->height = $iNewHeight;
		$this->setImageOrientation();		
	}	
	
	public function cut($x, $y, $iNewWidth=-1, $iNewHeight=-1) {
	/* resize the memoryimage do not keep ratio */
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    }    
		if($x>$this->width||$y>$this->height){
      return;
    }
    
		if($iNewWidth<0){
      $iNewWidth = $this->width - $x;
    }else{
      $iNewWidth = max(0,min($this->width - $x,$iNewWidth));
    }
		if($iNewHeight<0){
      $iNewHeight = $this->height - $y;
    }else{
      $iNewHeight = max(0,min($this->height - $y,$iNewHeight));
    }
		
		if(function_exists("imagecopyresampled")){
			$ResizedImageStream = imagecreatetruecolor($iNewWidth, $iNewHeight);
			imagecopyresampled($ResizedImageStream, $this->ImageStream, 0, 0, $x, $y, $iNewWidth, $iNewHeight, $iNewWidth, $iNewHeight);
		}
		else{
			$ResizedImageStream = imagecreate($iNewWidth, $iNewHeight);
			imagecopyresized($ResizedImageStream, $this->ImageStream, 0, 0, $x, $y, $iNewWidth, $iNewHeight, $iNewWidth, $iNewHeight);
		}		
		
		$this->ImageStream = $ResizedImageStream;
		$this->width = $iNewWidth;
		$this->height = $iNewHeight;
		$this->setImageOrientation();		
	}	
	
	public function resizetowidth($iNewWidth) {
  /* resize image to given width (keep ratio) */
		$iNewHeight = ($iNewWidth / $this->width) * $this->height;
		$this->resize($iNewWidth,$iNewHeight); 		
	}	
	
	public function resizetoheight($iNewHeight) {
  /* resize image to given height (keep ratio) */
		$iNewWidth = ($iNewHeight / $this->height) * $this->width;
		$this->resize($iNewWidth,$iNewHeight); 		
	}	
	
	public function resizetopercentage($iPercentage) {
  /* resize image to given percentage (keep ratio) */
		$iPercentageMultiplier = $iPercentage / 100;
		$iNewWidth = $this->width * $iPercentageMultiplier;
		$iNewHeight = $this->height * $iPercentageMultiplier;		
		
    $this->resize($iNewWidth,$iNewHeight);		
	}	
	
	public function crop($iNewWidth, $iNewHeight, $iResize = 0) {
  /* crop image (first resize with keep ratio) */
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    }   
		
		/* resize imageobject in memory if resize percentage is set */
		if ($iResize > 0) {
		  $this->resizetopercentage($iResize);
		}		 
		
		/* constrain width and height values */
    if (($iNewWidth > $this->width) || ($iNewWidth < 0)) {
		  $this->printError('width out of range',__METHOD__,__LINE__); 
    } 
    if (($iNewHeight > $this->height) || ($iNewHeight < 0)) {
		  $this->printError('height out of range',__METHOD__,__LINE__); 
    }	
	  
		/* create blank image with new sizes */
		$CroppedImageStream = ImageCreateTrueColor($iNewWidth,$iNewHeight);
		
		/* calculate size-ratio */
		$iWidthRatio = $this->width / $iNewWidth;
		$iHeightRatio = $this->height / $iNewHeight;
		$iHalfNewHeight = $iNewHeight / 2;
		$iHalfNewWidth = $iNewWidth / 2;
		
		/* if the image orientation is landscape */
		if($this->orientation == 'landscape') {
		  /* calculate resize width parameters */
			$iResizeWidth = $this->width / $iHeightRatio;
			$iHalfWidth = $iResizeWidth / 2;
			$iDiffWidth = $iHalfWidth - $iHalfNewWidth;
			
			if(function_exists("imagecopyresampled")){
				imagecopyresampled($CroppedImageStream,$this->ImageStream,-$iDiffWidth,0,0,0,$iResizeWidth,$iNewHeight,$this->width,$this->height);
			}
			else {
				imagecopyresized($CroppedImageStream,$this->ImageStream,-$iDiffWidth,0,0,0,$iResizeWidth,$iNewHeight,$this->width,$this->height);
			}		
		}
		/* if the image orientation is portrait or square */
		elseif(($this->orientation == 'portrait') || ($this->orientation == 'square')) {
		  /* calculate resize height parameters */		
			$iResizeHeight = $this->height / $iWidthRatio;
			$iHalfHeight = $iResizeHeight / 2;
			$iDiffHeight = $iHalfHeight - $iHalfNewHeight;
			
			if(function_exists("imagecopyresampled")){
				imagecopyresampled($CroppedImageStream,$this->ImageStream,0,-$iDiffHeight,0,0,$iNewWidth,$iResizeHeight,$this->width,$this->height);
			}
			else {
				imagecopyresized($CroppedImageStream,$this->ImageStream,0,-$iDiffHeight,0,0,$iNewWidth,$iResizeHeight,$this->width,$this->height);
			}	
		}
		else { 
			if(function_exists("imagecopyresampled")){
				imagecopyresampled($CroppedImageStream,$this->ImageStream,0,0,0,0,$iNewWidth,$iNewHeight,$this->width,$this->height);
			}
			else {
				imagecopyresized($CroppedImageStream,$this->ImageStream,0,0,0,0,$iNewWidth,$iNewHeight,$this->width,$this->height);
			}	
		}		

		$this->ImageStream = $CroppedImageStream;
		$this->width = $iNewWidth;
		$this->height = $iNewHeight;
		$this->setImageOrientation();											
	}				
	
	public function get_font_list(){
    $dict = Array(
      "Aldos Nova" => Array("fontfile"=>"aldos_nova.ttf","preview"=>"aldos_nova.gif"),
      "Beware" => Array("fontfile"=>"beware.ttf","preview"=>"beware.gif"),
      "Chopin Script" => Array("fontfile"=>"chopin_script.ttf","preview"=>"chopin_script.gif"),
      "Early Tickertape" => Array("fontfile"=>"early_tickertape.ttf","preview"=>"early_tickertape.gif"),
      "English Gothic" => Array("fontfile"=>"english_gothic.ttf","preview"=>"english_gothic.gif"),
      "Flores" => Array("fontfile"=>"flores.ttf","preview"=>"flores.gif"),
      "Fortunadot" => Array("fontfile"=>"fortunadot.ttf","preview"=>"fortunadot.gif"),
      "Funkin Frat" => Array("fontfile"=>"funkin_frat.ttf","preview"=>"funkin_frat.gif"),
      "Laurehead" => Array("fontfile"=>"laurehead.ttf","preview"=>"laurehead.gif"),
      "Plasmadrip" => Array("fontfile"=>"plasmadrip.ttf","preview"=>"plasmadrip.gif"),
      "Plump" => Array("fontfile"=>"pleasantly_plump.ttf","preview"=>"pleasantly_plump.gif")
      
    );
    return $dict;
  }
	
	public function writetext($sText, $iFontSize = 10, $sTextColor = '0,0,0', $sFontFilename = 'arial', $iXPos = 5, $iYPos = 15, $iTextAngle = 0) {
  /* write text on image */
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
		
    if (($iXPos > $this->width) || ($iXPos < 0)) {
		  $this->printError('x-pos out of range',__METHOD__,__LINE__); 
    } 
		
    if (($iYPos > $this->height) || ($iYPos < 0)) {
		  $this->printError('y-pos out of range',__METHOD__,__LINE__); 
    } 				
    
    $dict = $this->get_font_list();
    $sFontFilename = $dict[$sFontFilename]["fontfile"];
		
		$sFont = clsImage::IMAGEFONTDIR . DIRECTORY_SEPARATOR . $sFontFilename;
	  $aTextColor = explode(',',$sTextColor,3);
	  $ImageColor = imagecolorallocate($this->ImageStream,$aTextColor[0],$aTextColor[1],$aTextColor[2]);
		$iLineWidth = imagettfbbox($iFontSize, $iTextAngle, $sFont, $sText);
		imagettftext($this->ImageStream, $iFontSize, $iTextAngle, $iXPos, $iYPos, $ImageColor, $sFont, $sText);			
	}
  
  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  //// IMG_FILTER_GRAYSCALE: Converts the image into grayscale. 
  public function filter_grayscale(){
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
    imagefilter($this->ImageStream, IMG_FILTER_GRAYSCALE);
  }
   
  //// IMG_FILTER_NEGATE: Reverses all colors of the image. 
  public function filter_negate(){
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
    imagefilter($this->ImageStream, IMG_FILTER_NEGATE);
  }  
  
  //// IMG_FILTER_BRIGHTNESS: Changes the brightness of the image. 
  ////Use $level to set the level of brightness. 
  public function filter_brightness($level){
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
    imagefilter($this->ImageStream, IMG_FILTER_BRIGHTNESS, $level);
  }  
  
  //// IMG_FILTER_CONTRAST: Changes the contrast of the image. 
  ///  Use $level to set the level of contrast. 
  public function filter_contrast($level){
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
    imagefilter($this->ImageStream, IMG_FILTER_CONTRAST, $level);
  }
  
  //// IMG_FILTER_COLORIZE: Like IMG_FILTER_GRAYSCALE, except you can specify the color. 
  //// Use  $red , $blue , $green and $alpha for the alpha channel. The range for each color is 0 to 255. 
  public function filter_colorize($red , $blue , $green, $alpha){
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
    imagefilter($this->ImageStream, IMG_FILTER_COLORIZE, $red , $blue , $green, $alpha);
  }
  
  //// IMG_FILTER_EDGEDETECT: Uses edge detection to highlight the edges in the image.
  public function filter_edgedetect(){
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
    imagefilter($this->ImageStream, IMG_FILTER_EDGEDETECT);
  }
  
  //// IMG_FILTER_EMBOSS: Embosses the image. 
  public function filter_embosses(){
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
    imagefilter($this->ImageStream, IMG_FILTER_EMBOSS);
  }
    //// IMG_FILTER_GAUSSIAN_BLUR: Blurs the image using the Gaussian method. 
  public function filter_gaussian_blur(){
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
    imagefilter($this->ImageStream, IMG_FILTER_GAUSSIAN_BLUR);
  }
    //// IMG_FILTER_SELECTIVE_BLUR: Blurs the image. 
  public function filter_selective_blur(){
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
    imagefilter($this->ImageStream, IMG_FILTER_SELECTIVE_BLUR);
  }
  
    //// IMG_FILTER_MEAN_REMOVAL: Uses mean removal to achieve a "sketchy" effect. 
  public function filter_mean_removal(){
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
    imagefilter($this->ImageStream, IMG_FILTER_MEAN_REMOVAL);
  }
    //// IMG_FILTER_SMOOTH: Makes the image smoother. Use arg1 to set the level of smoothness. 
  public function filter_smooth($level){
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
    imagefilter($this->ImageStream, IMG_FILTER_SMOOTH,$level);
  }
  
  
  
  public function watermark_frame($frameFile){
  
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
    $frame = imagecreatefromjpeg($frameFile);
    $frame2 = imagecreatetruecolor($this->width,$this->height); 
    imagecopyresampled($frame2, $frame, 0,0,0,0, $this->width,$this->height, $this->width,$this->height);
    //IMG_EFFECT_REPLACE - Use pixel replacement (equivalent of passing TRUE to imagealphablending()) 
    //IMG_EFFECT_ALPHABLEND - Use normal pixel blending (equivalent of passing FALSE to imagealphablending()) 
    //IMG_EFFECT_NORMAL -Same as IMG_EFFECT_ALPHABLEND. 
    //IMG_EFFECT_OVERLAY - Overlay has the effect that black background pixels will remain black, white background pixels will remain white, but grey background pixels will take the colour of the foreground pixel.  
    // Apply the overlay alpha blending flag
    //imagelayereffect($this->ImageStream, IMG_EFFECT_NORMAL);
    $black = imagecolorallocate($frame, 255, 255, 255);
    // Make the background transparent
    imagecolortransparent($frame, $black);

    for ($i=0;$i<$this->height;$i++) {
      for ($j=0;$j<$this->width;$j++){
        $rgb = imagecolorat($this->ImageStream,$i,$j);
        $r = ($rgb >> 16) & 0xFF;
        $g = ($rgb >> 8) & 0xFF;
        $b = $rgb & 0xFF;
        
        $rgb2 = imagecolorat($frame2,$i,$j);
        $r2 = ($rgb2 >> 16) & 0xFF;
        $g2 = ($rgb2 >> 8) & 0xFF;
        $b2 = $rgb2 & 0xFF;

        //This is where we actually use yiq to modify our rbg values, and then convert them to our grayscale palette
        $r = $r & $r2;
        $g = $g & $g2;
        $b = $b & $b2;
        imagesetpixel($this->ImageStream,$i,$j, ($r << 16) + ($g << 8) + $b);
      }
    } 

    //imagecopymergegray($this->ImageStream , $frame , 0 , 0 , 0 , 0 ,$this->width, $this->height,100);
    //imagelayereffect($this->ImageStream, IMG_EFFECT_NORMAL);
  }
  
  public function get_modern_list(){
    $dict = Array(
      "bikini" => Array("filename"=>"bikini.png","x"=>35, "y"=>36, "width"=>383, "height"=>342),
      "colorpen" => Array("filename"=>"colorpen.png","x"=>36, "y"=>36, "width"=>397, "height"=>557),
      "03" => Array("filename"=>"03.png","x"=>18, "y"=>15, "width"=>405, "height"=>305),
      "02" => Array("filename"=>"02.png","x"=>36, "y"=>40, "width"=>406, "height"=>303),
      "01" => Array("filename"=>"01.png","x"=>0, "y"=>0, "width"=>400, "height"=>300),
      "08" => Array("filename"=>"08.png","x"=>15, "y"=>15, "width"=>358, "height"=>296),
      "07" => Array("filename"=>"07.png","x"=>17, "y"=>147, "width"=>248, "height"=>174),
      "06" => Array("filename"=>"06.png","x"=>12, "y"=>8, "width"=>308, "height"=>291),
      "05" => Array("filename"=>"05.png","x"=>13, "y"=>15, "width"=>404, "height"=>302),
      "04" => Array("filename"=>"04.png","x"=>163, "y"=>14, "width"=>343, "height"=>307)
      
    );
    return $dict;
  }
	
	public function modern_frame($frameFile,$bgcolor="", $x="", $y="", $owidth="", $oheight=""){
	  if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    }
    
    $dict = $this->get_modern_list(false);
    if($x==""){
      $x = $dict[$frameFile]["x"];
      $y = $dict[$frameFile]["y"];
    }
    if($owidth==""){
      $owidth = $dict[$frameFile]["width"];
      $oheight = $dict[$frameFile]["height"];
    }
    $frameFile = MODERNPATH . DIRECTORY_SEPARATOR . $dict[$frameFile]["filename"];
    $frame = imagecreatefrompng($frameFile);
    //getting the width and height of that image
    list($fwidth, $fheight) = getimagesize($frameFile);
    
    //the background canvas, it will be the same width and height
    $background = imagecreatetruecolor($fwidth, $fheight);
    if(substr_count($bgcolor, "#")>0){
	    //converting the 16 digit hex value to the standard 10 digit value
	    $int = hexdec(str_replace("#", "", $bgcolor));
	    //getting rgb color
	    $background_color = imagecolorallocate ($background, 0xFF & ($int >> 0x10), 0xFF & ($int >> 0x8), 0xFF & $int);
	    //filling the background image with that color 
	    imagefill($background, 0,0,$background_color); 
    }
    
    //This function copies and resizes the  image onto the background canvas
    imagecopyresampled($background ,$this->ImageStream, $x, $y, 0, 0, $owidth, $oheight, $this->width, $this->height);

    //making sure that alpha blending is enabled
    imageAlphaBlending($frame, true);
    //making sure to preserve the alpha info
    imageSaveAlpha($frame, true);
    //This function copies and resizes the  image onto the background canvas
    imagecopyresampled($background ,$frame, 0,0,0,0,$fwidth, $fheight, $fwidth, $fheight); 
    
    imagedestroy($this->ImageStream);
    $this->ImageStream = $background;
    
    $this->width = $fwidth;
		$this->height = $fheight;
		$this->setImageOrientation();	
  }
  
  
  public function get_avatar_list(){
    $dict = Array(
      "hellokitty" => Array("filename"=>"hellokitty.png"),
      "fistplace" => Array("filename"=>"fistplace.png"),
      "mirror" => Array("filename"=>"mirror.png"),
      "snowman1" => Array("filename"=>"snowman1.png"),
      "snowman2" => Array("filename"=>"snowman2.png"),
      "rowpaul" => Array("filename"=>"rowpaul.png"),
      "lip" => Array("filename"=>"lip.png"),
      "sale1" => Array("filename"=>"sale1.png")
    );
    return $dict;
  }
  
  public function avatar($faceFile, $x, $y, $width="", $height=""){
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    }
    
    $dict = $this->get_avatar_list(false);
    $faceFile = AVATARPATH . DIRECTORY_SEPARATOR . $dict[$faceFile]["filename"];
    $face = imagecreatefrompng($faceFile);
    list($bg_w, $bg_h) = getimagesize($faceFile); 
    $x = $x?$x:0;
    $y = $y?$y:0;
    $width = $width?$width:$bg_w;
    $height = $height?$height:$bg_h;
    //making sure that alpha blending is enabled
	  imageAlphaBlending($face, true);
	  //making sure to preserve the alpha info
	  imageSaveAlpha($face, true);
	  imagecopyresampled($this->ImageStream, $face, $x,$y,0,0, $width, $height, $bg_w, $bg_h);
    
  }
	
	
	
	///////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
  
  
  public function rotate($degrees, $bgd_color, $ignore_transparent=0){
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
    $background_color = imagecolorallocate ($this->ImageStream, 0, 0, 0);
    // Rotate
    $this->ImageStream = imagerotate($this->ImageStream, $degrees, $bgd_color, $ignore_transparent);
    
    $degrees = $degrees * 3.1415926 * 2 / 360;
    //print sin($degrees) ." " .  cos($degrees). "<br>";
    $newWidth = abs(sin($degrees))*$this->height + abs(cos($degrees))*$this->width;
    $newHeight = abs(sin($degrees))*$this->width + abs(cos($degrees))*$this->height;
    
    $this->width = $newWidth;
    $this->height = $newHeight;
    $this->setImageOrientation();
    
  }
  
  public function mirror($vertical=true){
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
    $temp = imagecreatetruecolor($this->width, $this->height);
    if($vertical){
      //vertical
      imagecopyresampled($temp, $this->ImageStream, 0, 0, 0, ($this->height-1), $this->width, $this->height, $this->width, 0-$this->height);
    }else{
      imagecopyresampled($temp, $this->ImageStream, 0, 0, ($this->width-1), 0, $this->width, $this->height, 0-$this->width, $this->height);
    }
    imagedestroy($this->ImageStream);
    $this->ImageStream = $temp;
  }
  	
	
	public function convert($sTargetType) {
  /* convert image to given type [ jpg | gif | png ] */
    if (!$this->ImageStream) {
		  $this->printError('image not loaded',__METHOD__,__LINE__); 
    } 
		
		switch($sTargetType) {
		  case 'gif': 
			  $this->setImageType(1);
			  break;
			case 'jpg': 
			  $this->setImageType(2);
			  break;
			case 'png': 
			  $this->setImageType(3);
			  break;
		  default: $this->printError('invalid imagetype',__METHOD__,__LINE__); 
		}	  
	}			
}
?>
