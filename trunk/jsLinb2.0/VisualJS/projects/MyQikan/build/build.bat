
rem ======================================== mini files ========================================
rem excluding: index.html
rem excluding: \build
rem ======================================== mini files ========================================


set version=version\0.1004
 

mkdir ..\release\%version%
mkdir ..\release\%version%\MyQikan
mkdir ..\release\%version%\MyQikan\js
mkdir ..\release\%version%\jsLinb
mkdir ..\release\%version%\jsLinb\js
mkdir ..\release\%version%\jsLinb\appearance

rem copy files
xcopy ..\MyQikan\css\*.* ..\release\%version%\MyQikan\css\ /E /Y
xcopy ..\jsLinb\appearance\*.* ..\release\%version%\jsLinb\appearance\ /E /Y

copy ..\jsLinb\bg.gif ..\release\%version%\jsLinb\bg.gif
copy ..\jsLinb\xd.html ..\release\%version%\jsLinb\xd.html

rem //all linb UI and ...
copy ..\jsLinb\js\linb.js /b + ..\jsLinb\js\com.js /b + ..\jsLinb\js\Cookies.js + ..\jsLinb\js\Template.js /b+ ..\jsLinb\js\Debugger.js /b linb.js
copy ..\jsLinb\Locale\cn.js /b + ..\jsLinb\js\Event.js /b + ..\jsLinb\js\CSS.js /b + ..\jsLinb\js\Dom.js /b + ..\jsLinb\js\DragDrop.js /b  + ..\jsLinb\js\ComFactory.js /b + ..\jsLinb\js\UI.js /b +  ..\jsLinb\js\Tips.js /b + ..\jsLinb\js\UI\Button.js /b + ..\jsLinb\js\UI\Input.js /b + ..\jsLinb\js\UI\ComboInput.js /b+  ..\jsLinb\js\UI\List.js /b +  ..\jsLinb\js\UI\Tabs.js /b + ..\jsLinb\js\UI\TreeBar.js /b + ..\jsLinb\js\UI\Panel.js /b + ..\jsLinb\js\UI\Layout.js /b + ..\jsLinb\js\UI\colLayout.js /b + ..\jsLinb\js\UI\Fieldset.js /b + ..\MyQikan\js\conf.js /b +..\MyQikan\js\index.js /b  + ..\Locale\cn.js /b + ..\MyQikan\js\Module1.js /b  index.js


java -jar yuicompressor.jar -o ../release/%version%/jsLINB/js/linb.js       linb.js
java -jar yuicompressor.jar --charset UTF-8 -o ../release/%version%/MyQikan/js/index.js     index.js

del /q linb.js
del /q index.js

pause