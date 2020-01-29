<?php
require __DIR__.'/vendor/autoload.php';
use GDText\Box;
use GDText\Color;

$str = file_get_contents('../web-scrapper/startse.json');

$array = json_decode( $str, true );

$id=0;
foreach($array as $new){	


	$id++;

	$new['image']=str_replace(basename($new['image']),urlencode(basename($new['image'])), $new['image']);
	$src =imagecreatefromjpeg($new['image']); 

	


	$text = $new['title'];


	

	
	$srcx = imagesx($src);
	$srcy = imagesy($src);
	
	
	$destx = 1080;
	$desty = 1080;
	$dest = imagecreatetruecolor($destx, $desty);
	
	$ratio = $srcx/$srcy; // width/height
	if( $ratio > 1) {
		$width = $destx;
		$height = $destx/$ratio;
	}
	else {
		$width = $destx*$ratio;
		$height = $destx;
	}

	if($height<700){
		if( $ratio > 1) {
			$width = 1300;
			$height = 1300/$ratio;
		}
		else {
			$width = 1300*$ratio;
			$height = 1300;
		}
	}
	
	
	imagecopyresampled($dest, $src, 0, 0, 0, 0, $width,$height, $srcx, $srcy);
	
	
	$insert = imagecreatefrompng("overlay.png"); 
	imagealphablending($insert, false);
	imagesavealpha($insert, true);
	
	// Select the first pixel of the overlay image (at 0,0) and use
	// it's color to define the transparent color
	
	
	imagecolortransparent($insert,imagecolorat($insert,0,0));
	
	
	// Get overlay image width and hight for later use
	
	$insert_x = imagesx($insert); 
	$insert_y = imagesy($insert); 
	
	// Combine the images into a single output image. Some people
	// prefer to use the imagecopy() function, but more often than 
	// not, it sometimes does not work. (could be a bug)
	
	imagecopy($dest,$insert,0,0,0,0,$insert_x,$insert_y); 
	
	$initialfontsize=35;
	$txtchars = strlen($text);
	$fontsize = $desty/$txtchars;
	$fontsize = $fontsize + $initialfontsize;
	$padding=200;
	$altura=300;
	
	$box = new Box($dest);
	$box->setFontFace('C:\Windows\Fonts\montserrat-bold_0.ttf'); 
	$box->setFontSize($fontsize);
	$box->setFontColor(new Color(255, 255, 255));
	$box->setBox($padding/2,$desty-$altura-50,  $destx-$padding,$altura);
	$box->setTextAlign('center', 'center');
	$box->draw($text);
	
	
	header("Content-type: image/png");
	//imagepng($dest);
	imagepng($dest,'images/new-'.$id.'.png');
	//die();
}




?>