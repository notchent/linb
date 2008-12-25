IF EXIST .\longboo DEL /S/Q .\longboo
MKDIR .\longboo\API 
XCOPY .\API .\longboo\API\ /s/e

MKDIR .\longboo\CodeSnip 
XCOPY .\CodeSnip .\longboo\CodeSnip\ /s/e

MKDIR .\longboo\img 
XCOPY .\img .\longboo\img\ /s/e

MKDIR .\longboo\jsLinb 
XCOPY .\jsLinb .\longboo\jsLinb\ /s/e

MKDIR .\longboo\JSONEditor 
XCOPY .\JSONEditor .\longboo\JSONEditor\ /s/e

MKDIR .\longboo\phpLinb 
XCOPY .\phpLinb .\longboo\phpLinb\ /s/e

MKDIR .\longboo\runtime 
XCOPY .\runtime .\longboo\runtime\ /s/e

MKDIR .\longboo\Samples 
XCOPY .\Samples .\longboo\Samples\ /s/e
MOVE /Y .\longboo\Samples\index_cn.html .\longboo\Sample\index.html

MKDIR .\longboo\VisualJS 
XCOPY .\VisualJS .\longboo\VisualJS\ /s/e


COPY .\download.html .\longboo\download.html
COPY .\longboo\img\logo2.gif .\longboo\VisualJS\img\logo.gif
MOVE /Y .\longboo\img\logo2.gif .\longboo\img\logo.gif
MOVE /Y .\longboo\img\sign2.gif .\longboo\img\sign.gif


replace.exe -srcdir .\longboo -find "<a href='http://www.linb.net'><strong> Home</strong></a>" -replace "<a href='http://www.longboo.com'><strong>首页</strong></a>" -fname *.html
replace.exe -srcdir .\longboo -find "<a href='http://code.google.com/p/linb/downloads/list'>Download</a>" -replace "<a href='http://www.longboo.com/download.html'>下载</a>" -fname *.html
replace.exe -srcdir .\longboo -find "<a href='http://linb.googlecode.com/svn/trunk/jsLinb2.0/'>SVN</a>" -replace " " -fname *.html
replace.exe -srcdir .\longboo -find "<a href='http://groups.google.com/group/linb'>forum</a>" -replace "<a href='http://www.longboo.com/forum'>论坛</a>" -fname *.html
replace.exe -srcdir .\longboo -find "<a href='http://www.linb.net/API'>API</a>" -replace "<a href='http://www.longboo.com/API'>接口文档</a>" -fname *.html
replace.exe -srcdir .\longboo -find "<a href='http://www.linb.net/CodeSnip'>CodeSnip</a>" -replace "<a href='http://www.longboo.com/CodeSnip'>代码片段</a>" -fname *.html
replace.exe -srcdir .\longboo -find "<a href='http://www.linb.net/VisualJS/UIBuilder.html'>UI Builder</a>" -replace "<a href='http://www.longboo.com/VisualJS/UIBuilder.html'>可视化编辑器</a>" -fname *.html
replace.exe -srcdir .\longboo -find "<a href='http://www.sigmawidgets.com/'>Commercial Support</a>" -replace " " -fname *.html
replace.exe -srcdir .\longboo -find ">Samples</a><small style=" -replace ">示例</a><small style=" -fname *.html

replace.exe -srcdir .\longboo -find "linb.net" -replace "longboo.com" -fname *.html
replace.exe -srcdir .\longboo -find "linb.net" -replace "longboo.com" -fname *.htm
replace.exe -srcdir .\longboo -find "linb.net" -replace "longboo.com" -fname *.js
replace.exe -srcdir .\longboo -find "linb.net" -replace "longboo.com" -fname *.php

COPY .\readme.txt .\longboo\
COPY .\index_cn.html .\longboo\index.html

FOR /F "tokens=*" %%A IN ('date /t') DO SET TODAY=%%A
replace.exe -srcdir .\longboo -find "<!--build-date-->" -replace %TODAY% -fname *.html
