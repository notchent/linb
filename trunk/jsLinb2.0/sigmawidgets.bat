IF EXIST .\sigmawidgets DEL /S/Q .\sigmawidgets
MKDIR .\sigmawidgets\API 
XCOPY .\API .\sigmawidgets\API\ /s/e

MKDIR .\sigmawidgets\CodeSnip 
XCOPY .\CodeSnip .\sigmawidgets\CodeSnip\ /s/e

MKDIR .\sigmawidgets\img 
XCOPY .\img .\sigmawidgets\img\ /s/e

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


COPY .\readme.txt .\sigmawidgets\
COPY .\index.html .\sigmawidgets\index.html

REN .\sigmawidgets\VisualJS\index.html index2.html
REN .\sigmawidgets\VisualJS\UIBuilder.html index.html

COPY .\sigmawidgets\img\logo3.gif .\sigmawidgets\VisualJS\img\logo.gif
COPY .\sigmawidgets\img\logo3.gif .\sigmawidgets\VisualJS\img\builder.gif
MOVE /Y .\sigmawidgets\img\logo3.gif .\sigmawidgets\img\logo.gif
MOVE /Y .\sigmawidgets\img\sign2.gif .\sigmawidgets\img\sign.gif


replace.exe -srcdir .\sigmawidgets -find "code.google.com/p/linb/downloads/list" -replace "www.sigmawidgets.com/download.html" -fname *.html

replace.exe -srcdir .\sigmawidgets -find "<a href='http://linb.googlecode.com/svn/trunk/jsLinb2.0/'>SVN</a>" -replace " " -fname *.html
replace.exe -srcdir .\sigmawidgets -find "http://linb.googlecode.com/svn/trunk/jsLinb2.0/" -replace " " -fname *.html


replace.exe -srcdir .\sigmawidgets -find "groups.google.com/group/linb" -replace "www.sigmawidgets.com/forum" -fname *.html
replace.exe -srcdir .\sigmawidgets -find "www.linb.net/API" -replace "www.sigmawidgets.com/products/sigma_visual/API" -fname *.html
replace.exe -srcdir .\sigmawidgets -find "www.linb.net/CodeSnip" -replace "www.sigmawidgets.com/products/sigma_visual/CodeSnip" -fname *.html
replace.exe -srcdir .\sigmawidgets -find "www.linb.net/Samples" -replace "www.sigmawidgets.com/products/sigma_visual/Samples" -fname *.html
replace.exe -srcdir .\sigmawidgets -find "www.linb.net/VisualJS/UIBuilder.html" -replace "www.sigmawidgets.com/products/sigma_visual/VisualJS/index.html" -fname *.html

replace.exe -srcdir .\sigmawidgets -find "<a href='http://www.sigmawidgets.com/'>Commercial Support</a>" -replace " " -fname *.html
replace.exe -srcdir .\sigmawidgets -find "Commercial Support" -replace " " -fname *.html


replace.exe -srcdir .\sigmawidgets -find "linb.net" -replace "sigmawidgets.com" -fname *.html
replace.exe -srcdir .\sigmawidgets -find "linb.net" -replace "sigmawidgets.com" -fname *.htm
replace.exe -srcdir .\sigmawidgets -find "linb.net" -replace "sigmawidgets.com" -fname *.js
replace.exe -srcdir .\sigmawidgets -find "linb.net" -replace "sigmawidgets.com" -fname *.php

COPY /Y D:\wamp\www\www\www\products\sigma_visual\*.swf .\sigmawidgets\
COPY /Y D:\wamp\www\www\www\products\sigma_visual\*.html .\sigmawidgets\
COPY /Y .\sigmawidgets\index.html .\sigmawidgets\sigmavisual.html
COPY /Y D:\wamp\www\www\www\products\sigma_visual\Samples\*.html .\sigmawidgets\Samples\
XCOPY D:\wamp\www\www\www\products\sigma_visual\css .\sigmawidgets\
XCOPY D:\wamp\www\www\www\products\sigma_visual\manual ..\sigmawidgets\

@echo off
echo "***********************************\n"
echo "please use text crawler\n"
echo "***********************************\n"
pause

echo on


XCOPY .\sigmawidgets .\sigma_pack /s/e

