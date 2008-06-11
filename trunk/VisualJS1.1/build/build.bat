set relPath=..\
set version=1.2\
set appname=VisualJS\
set releasePath=release\
set apiName=visualjs.js

mkdir %relPath%%releasePath%%version%
mkdir %relPath%%releasePath%%version%%appname%
mkdir %relPath%%releasePath%%version%%appname%js
mkdir %relPath%%releasePath%%version%jsLinb
mkdir %relPath%%releasePath%%version%jsLinb\js
mkdir %relPath%%releasePath%%version%jsLinb\appearance

xcopy %relPath%jsLinb\appearance\*.* %relPath%%releasePath%%version%jsLinb\appearance\ /E /Y
copy  %relPath%jsLinb\ondrag.gif %relPath%%releasePath%%version%jsLinb\ondrag.gif
copy  %relPath%jsLinb\bg.gif %relPath%%releasePath%%version%jsLinb\bg.gif
copy  %relPath%jsLinb\loading.gif %relPath%%releasePath%%version%jsLinb\loading.gif
copy  %relPath%jsLinb\xd.html %relPath%%releasePath%%version%jsLinb\xd.html

rem xcopy %relPath%%appname%css\*.* %relPath%%releasePath%%version%%appname%css\ /E /Y
xcopy %relPath%Locale\*.* %relPath%%releasePath%%version%Locale\ /E /Y
rem xcopy %relPath%%appname%img\*.* %relPath%%releasePath%%version%%appname%img\ /E /Y

xcopy %relPath%img\*.* %relPath%%releasePath%%version%img\ /E /Y

copy %relPath%%apiName% %relPath%%releasePath%%version%%apiName%

copy %relPath%jsLinb\js\linb.js /b + %relPath%jsLinb\js\event.js /b + %relPath%jsLinb\js\template.js /b + %relPath%jsLinb\js\date.js /b + %relPath%jsLinb\js\css.js /b + %relPath%jsLinb\js\dom.js /b + %relPath%jsLinb\js\Com.js /b + %relPath%jsLinb\js\Cookies.js /b + %relPath%jsLinb\js\Dragdrop.js /b + %relPath%jsLinb\js\BookMark.js /b + %relPath%jsLinb\js\ComFactory.js /b +  %relPath%jsLinb\Locale\en.js /b + %relPath%jsLinb\js\logger.js /b linb.js

copy %relPath%jsLinb\js\UI.js /b + %relPath%jsLinb\js\coder.js /b + %relPath%jsLinb\js\UI\Tips.js /b + %relPath%jsLinb\js\UI\Edge.js /b + %relPath%jsLinb\js\UI\Shadow.js /b + %relPath%jsLinb\js\UI\Resizer.js /b + %relPath%jsLinb\js\UI\Block.js /b + %relPath%jsLinb\js\UI\Label.js /b + %relPath%jsLinb\js\UI\ProgressBar.js /b + %relPath%jsLinb\js\UI\Button.js /b + %relPath%jsLinb\js\UI\CheckBox.js /b + %relPath%jsLinb\js\UI\Input.js /b + %relPath%jsLinb\js\UI\ComboInput.js /b + %relPath%jsLinb\js\UI\Group.js /b + %relPath%jsLinb\js\UI\Fieldset.js /b + %relPath%jsLinb\js\UI\ColorPicker.js /b + %relPath%jsLinb\js\UI\DatePicker.js /b + %relPath%jsLinb\js\UI\TimePicker.js /b + %relPath%jsLinb\js\UI\TimeLine.js /b + %relPath%jsLinb\js\UI\List.js /b + %relPath%jsLinb\js\UI\LinkList.js /b + %relPath%jsLinb\js\UI\Gallery.js /b + %relPath%jsLinb\js\UI\IconList.js /b + %relPath%jsLinb\js\UI\Poll.js /b + %relPath%jsLinb\js\UI\PanelBar.js /b + %relPath%jsLinb\js\UI\PageBar.js /b + %relPath%jsLinb\js\UI\Tabs.js /b + %relPath%jsLinb\js\UI\Stacks.js /b + %relPath%jsLinb\js\UI\ButtonViews.js /b + %relPath%jsLinb\js\UI\RadioBox.js /b + %relPath%jsLinb\js\UI\FoldingList.js /b + %relPath%jsLinb\js\UI\TreeBar.js /b + %relPath%jsLinb\js\UI\PopMenu.js /b + %relPath%jsLinb\js\UI\MenuBar.js /b + %relPath%jsLinb\js\UI\ToolBar.js /b + %relPath%jsLinb\js\UI\Range.js /b + %relPath%jsLinb\js\UI\Layout.js /b + %relPath%jsLinb\js\UI\TreeGrid.js /b + %relPath%jsLinb\js\UI\Dialog.js /b + %relPath%jsLinb\js\UI\TextEditor.js /b + %relPath%jsLinb\js\UI\Calendar.js /b + %relPath%jsLinb\js\UI\Iframe.js /b + %relPath%%appname%js\conf.js /b + %relPath%Locale\en.js /b + %relPath%%appname%js\index.js /b + %relPath%%appname%js\PageEditor.js /b + %relPath%%appname%js\ClassTool.js /b + %relPath%%appname%js\ClassEditor.js /b + %relPath%%appname%js\ClassStruct.js /b + %relPath%%appname%js\ObjectEditor.js /b + %relPath%%appname%js\ProjectPro.js /b + %relPath%%appname%js\ProjectSelector.js /b + %relPath%%appname%js\Designer.js /b + %relPath%%appname%js\AddFile.js /b + %relPath%%appname%js\DelFile.js /b + %relPath%%appname%js\About.js /b  index.js

java -jar yuicompressor.jar -o %relPath%%releasePath%%version%jsLinb/js/linb.js      --nomunge      linb.js
java -jar yuicompressor.jar -o %relPath%%releasePath%%version%%appname%js/index.js      --nomunge   index.js


del /q linb.js
del /q index.js

pause
