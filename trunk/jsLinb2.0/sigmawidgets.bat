Copyright	(copyright +(﹟\(c\)|? +\d{4})( *[-,] *\d{4})*	
HTML Tags	<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)</\1>	
IP Address	\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b	
Date xx/xx/yyyy	\d{1,2}\/\d{1,2}\/\d{4}	
Email Address	[a-z0-9\._-]+@+[a-z0-9\._-]+\.+[a-z]{2,4}	
remove-linb-bar	<style>\s?#linbar(.*?)</a>\s?</div>\s?$	
remove-google2	<script\b(.*?)UA-414967-1(.*?)</script>	
remove-google1	<script\b(.*?)google-analytics(.*?)</script>	


IF EXIST .\sigmawidgets DEL /S/Q .\sigmawidgets
MKDIR .\sigmawidgets\API 
XCOPY .\API .\sigmawidgets\API\ /s/e

MKDIR .\sigmawidgets\CodeSnip 
XCOPY .\CodeSnip .\sigmawidgets\CodeSnip\ /s/e



MKDIR .\sigmawidgets\jsLinb 
XCOPY .\jsLinb .\sigmawidgets\jsLinb\ /s/e

MKDIR .\sigmawidgets\JSONEditor 
XCOPY .\JSONEditor .\sigmawidgets\JSONEditor\ /s/e

MKDIR .\sigmawidgets\phpLinb 
XCOPY .\phpLinb .\sigmawidgets\phpLinb\ /s/e

MKDIR .\sigmawidgets\runtime 
XCOPY .\runtime .\sigmawidgets\runtime\ /s/e

MKDIR .\sigmawidgets\Samples 
XCOPY .\Samples .\sigmawidgets\Samples\ /s/e

MKDIR .\sigmawidgets\VisualJS 
XCOPY .\VisualJS .\sigmawidgets\VisualJS\ /s/e
REN .\sigmawidgets\VisualJS\index.html ProjMan.html
REN .\sigmawidgets\VisualJS\debug.html ProjMan.debug.html
REN .\sigmawidgets\VisualJS\UIBuilder.html index.html
REN .\sigmawidgets\VisualJS\UIBuilder.debug.html index.debug.html

COPY .\readme_en.txt .\sigmawidgets\readme.txt
COPY .\index.html .\sigmawidgets\index.html
COPY .\license.html .\sigmawidgets\license.html
COPY .\change-log.txt .\sigmawidgets\change-log.txt

COPY .\img\logo3.gif .\sigmawidgets\VisualJS\img\logo.gif
COPY .\img\logo3.gif .\sigmawidgets\VisualJS\img\builder.gif


@echo off
echo ************************************************************
echo     please use text crawler
echo ************************************************************
pause
echo on

replace.exe -srcdir .\sigmawidgets -find "linb.net" -replace "sigmawidgets.com" -fname *.html
replace.exe -srcdir .\sigmawidgets -find "linb.net" -replace "sigmawidgets.com" -fname *.htm
replace.exe -srcdir .\sigmawidgets -find "linb.net" -replace "sigmawidgets.com" -fname *.js
replace.exe -srcdir .\sigmawidgets -find "linb.net" -replace "sigmawidgets.com" -fname *.php

COPY /Y D:\wamp\www\www\www\products\sigma_visual\*.swf .\sigmawidgets\
COPY /Y D:\wamp\www\www\www\products\sigma_visual\*.html .\sigmawidgets\
COPY /Y .\sigmawidgets\index.html .\sigmawidgets\sigmavisual.html
COPY /Y D:\wamp\www\www\www\products\sigma_visual\Samples\*.html .\sigmawidgets\Samples\
DEL /Q .\sigmawidgets\Samples\index_cn.html


MKDIR .\sigmawidgets\css  
XCOPY D:\wamp\www\www\www\products\sigma_visual\css .\sigmawidgets\css\ /s
COPY  .\img\builder.png .\sigmawidgets\css\
COPY  D:\wamp\www\www\www\js\menu.js .\sigmawidgets\css\
MKDIR .\sigmawidgets\manual
XCOPY D:\wamp\www\www\www\products\sigma_visual\manual .\sigmawidgets\manual\ /s/e
REN   .\sigmawidgets\manual\manual.htm index.html


@echo off
echo ************************************************************
echo     No Package will be made because of NO difference
echo ************************************************************
pause
exit

echo on


IF EXIST .\sigma_pack DEL /S/Q .\sigma_pack
MKDIR .\sigma_pack
XCOPY .\sigmawidgets .\sigma_pack\ /s/e

pause

