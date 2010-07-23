
rem ======================================== mini files ========================================
rem excluding: index.html
rem excluding: \build
rem ======================================== mini files ========================================

set libPath=..\..\..\..\
set compressTool=%libPath%tools/yuicompressor.jar
set apppath=..\
set releasepath=..\release\
set version=0.2
set rootClass=App
set modulename=app.js

mkdir %releasepath%%version%
mkdir %releasepath%%version%\%rootClass%
mkdir %releasepath%%version%\%rootClass%\js

mkdir %releasepath%%version%\jsLinb
mkdir %releasepath%%version%\jsLinb\Locale
mkdir %releasepath%%version%\jsLinb\js
mkdir %releasepath%%version%\jsLinb\appearance

rem copy files

xcopy %libPath%jsLinb\appearance\*.* %releasepath%%version%\jsLinb\appearance\ /E /Y
xcopy %libPath%jsLinb\Locale\*.* %releasepath%%version%\jsLinb\Locale\ /E /Y
copy %libPath%jsLinb\bg.gif %releasepath%%version%\jsLinb\bg.gif
copy %libPath%jsLinb\ondrag.gif %releasepath%%version%\jsLinb\ondrag.gif
copy %libPath%jsLinb\busy.gif %releasepath%%version%\jsLinb\busy.gif


xcopy %appPath%\css\*.* %releasepath%%version%\css\ /E /Y
xcopy %appPath%\Locale\*.* %releasepath%%version%\Locale\ /E /Y
xcopy %appPath%\Image\*.* %releasepath%%version%\Image\ /E /Y
copy %appPath%%modulename% %releasepath%%version%\%modulename%


rem //all linb UI and ...

copy %libPath%jsLinb\js\linb.js /b + %libPath%jsLinb\js\Event.js /b + %libPath%jsLinb\js\CSS.js /b + %libPath%jsLinb\js\Dom.js /b  + %libPath%jsLinb\js\Com.js /b + %libPath%jsLinb\js\Cookies.js /b + %libPath%jsLinb\js\DragDrop.js /b + %libPath%jsLinb\js\ComFactory.js /b +  %libPath%jsLinb\Locale\en.js /b linb.js


copy %libPath%jsLinb\js\UI.js /b +  %libPath%jsLinb\js\Tips.js /b +  %libPath%jsLinb\js\UI\Border.js /b +  %libPath%jsLinb\js\UI\Shadow.js /b +  %libPath%jsLinb\js\UI\Resizer.js /b + %libPath%jsLinb\js\UI\Button.js /b +%libPath%jsLinb\js\UI\Block.js /b +%libPath%jsLinb\js\UI\PopMenu.js /b + %libPath%jsLinb\js\UI\Input.js /b + %libPath%jsLinb\js\UI\ComboInput.js /b+ %libPath%jsLinb\js\UI\ColorPicker.js /b +  %libPath%jsLinb\js\UI\List.js /b +  %libPath%jsLinb\js\UI\Tabs.js /b + %libPath%jsLinb\js\UI\Stacks.js /b + %libPath%jsLinb\js\UI\Panel.js /b+ %libPath%jsLinb\js\UI\Image.js /b + %libPath%jsLinb\js\UI\IconList.js /b + %libPath%jsLinb\js\UI\Dialog.js /b+ %libPath%jsLinb\js\UI\Range.js /b+ %apppath%%rootClass%\js\conf.js /b +%apppath%%rootClass%\js\index.js /b  + %apppath%Locale\en.js /b + %apppath%%rootClass%\js\Upload.js /b  index.js


java -jar %compressTool% -o ../release/%version%/jsLINB/js/linb.js       linb.js
java -jar %compressTool% -o ../release/%version%/%rootClass%/js/index.js     index.js

del /q linb.js
del /q index.js

pause