set relPath=..\

set outPath=js\
set miniPath=\linb-mini.js
set allPath=\linb-all.js
set rawPath=\linb-raw.js

mkdir %outPath%
mkdir %outPath%jsLinb
mkdir %outPath%jsLinb\js
mkdir %outPath%jsLinb\Locale
mkdir %outPath%jsLinb\appearance
mkdir %outPath%jsLinb\js

rem ==================
rem for jsLinb source code
rem ==================
xcopy %relPath%jsLinb\js\*.* %outPath%jsLinb\js\ /E /Y
xcopy %relPath%jsLinb\appearance\*.* %outPath%jsLinb\appearance\ /E /Y
xcopy %relPath%jsLinb\Locale\*.* %outPath%jsLinb\Locale\ /E /Y
copy  %relPath%jsLinb\ondrag.gif %outPath%jsLinb\ondrag.gif
copy  %relPath%jsLinb\bg.gif %outPath%jsLinb\bg.gif
copy  %relPath%jsLinb\loading.gif %outPath%jsLinb\loading.gif
copy  %relPath%jsLinb\xd.html %outPath%jsLinb\xd.html

rem ==================
rem for mini jsLinb code
rem ==================
copy %relPath%jsLinb\js\linb.js /b + %relPath%jsLinb\js\event.js /b + %relPath%jsLinb\js\css.js /b + %relPath%jsLinb\js\dom.js /b  + %relPath%jsLinb\js\template.js /b + %relPath%jsLinb\js\dragDrop.js /b  linb.js

java -jar yuicompressor.jar -o %outPath%%miniPath% linb.js
 
del /q linb.js

rem ==================
rem for all jsLinb code
rem ==================
copy %relPath%jsLinb\js\linb.js /b + %relPath%jsLinb\js\event.js /b + %relPath%jsLinb\js\template.js /b + %relPath%jsLinb\js\date.js /b + %relPath%jsLinb\js\css.js /b + %relPath%jsLinb\js\dom.js /b + %relPath%jsLinb\js\Com.js /b + %relPath%jsLinb\js\Cookies.js /b + %relPath%jsLinb\js\Dragdrop.js /b + %relPath%jsLinb\js\BookMark.js /b + %relPath%jsLinb\js\ComFactory.js /b +  %relPath%jsLinb\Locale\en.js /b + %relPath%jsLinb\js\logger.js /b + %relPath%jsLinb\js\UI.js /b + %relPath%jsLinb\js\UI\Tips.js /b + %relPath%jsLinb\js\UI\Edge.js /b + %relPath%jsLinb\js\UI\Shadow.js /b + %relPath%jsLinb\js\UI\Resizer.js /b + %relPath%jsLinb\js\UI\Block.js /b + %relPath%jsLinb\js\UI\Label.js /b + %relPath%jsLinb\js\UI\ProgressBar.js /b + %relPath%jsLinb\js\UI\Button.js /b + %relPath%jsLinb\js\UI\CheckBox.js /b + %relPath%jsLinb\js\UI\Input.js /b + %relPath%jsLinb\js\UI\ComboInput.js /b + %relPath%jsLinb\js\UI\Group.js /b + %relPath%jsLinb\js\UI\Fieldset.js /b + %relPath%jsLinb\js\UI\ColorPicker.js /b + %relPath%jsLinb\js\UI\DatePicker.js /b + %relPath%jsLinb\js\UI\TimePicker.js /b + %relPath%jsLinb\js\UI\TimeLine.js /b + %relPath%jsLinb\js\UI\List.js /b + %relPath%jsLinb\js\UI\LinkList.js /b + %relPath%jsLinb\js\UI\Gallery.js /b + %relPath%jsLinb\js\UI\IconList.js /b + %relPath%jsLinb\js\UI\Poll.js /b + %relPath%jsLinb\js\UI\PanelBar.js /b + %relPath%jsLinb\js\UI\PageBar.js /b + %relPath%jsLinb\js\UI\Tabs.js /b + %relPath%jsLinb\js\UI\Stacks.js /b + %relPath%jsLinb\js\UI\ButtonViews.js /b + %relPath%jsLinb\js\UI\RadioBox.js /b + %relPath%jsLinb\js\UI\FoldingList.js /b + %relPath%jsLinb\js\UI\TreeBar.js /b + %relPath%jsLinb\js\UI\PopMenu.js /b + %relPath%jsLinb\js\UI\MenuBar.js /b + %relPath%jsLinb\js\UI\ToolBar.js /b + %relPath%jsLinb\js\UI\Range.js /b + %relPath%jsLinb\js\UI\Layout.js /b + %relPath%jsLinb\js\UI\TreeGrid.js /b + %relPath%jsLinb\js\UI\Dialog.js /b + %relPath%jsLinb\js\UI\TextEditor.js /b + %relPath%jsLinb\js\UI\Calendar.js /b  linb.js

java -jar yuicompressor.jar -o %outPath%%allPath% linb.js

java -jar yuicompressor.jar -o %outPath%%rawPath%   --nomunge  linb.js

del /q linb.js

rem ==================
rem for coder.js
rem ==================
java -jar yuicompressor.jar -o %outPath%coder.js %relPath%jsLinb\js\coder.js

pause