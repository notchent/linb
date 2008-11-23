rem =====================================
rem base folder
rem =====================================
rem ..\..\..\..\MyQikan\
rem ..\..\..\..\MyQikan\setup.txt
rem ..\..\..\..\MyQikan\index.html
rem ..\..\..\..\MyQikan\jsLinb\js\
rem ..\..\..\..\MyQikan\jsLinb\appearance\*.*
rem ..\..\..\..\MyQikan\release\
rem ..\..\..\..\MyQikan\release\index.html
rem ..\..\..\..\MyQikan\release\jsLinb\
rem ..\..\..\..\MyQikan\release\jsLinb\js\
rem ..\..\..\..\MyQikan\release\jsLinb\appearance\*.*
rem ..\..\..\..\MyQikan\release\MyQikan\
rem ..\..\..\..\MyQikan\release\MyQikan\js
rem =====================================


rem ======================================== source files ========================================
rem excluding: setup.txt
rem excluding: index.html
rem excluding: \jsLinb\appearance
rem ======================================== source files ========================================

rem xcopy ..\..\..\jsLinb\js\History.js       ..\..\..\..\MyQikan\jsLinb\js\ /Y
xcopy ..\..\..\jsLinb\js\Com.js       ..\..\..\..\MyQikan\jsLinb\js\ /Y
xcopy ..\..\..\jsLinb\js\ComFactory.js       ..\..\..\..\MyQikan\jsLinb\js\ /Y
xcopy ..\..\..\jsLinb\js\Cookies.js       ..\..\..\..\MyQikan\jsLinb\js\ /Y
xcopy ..\..\..\jsLinb\js\CSS.js       ..\..\..\..\MyQikan\jsLinb\js\ /Y
xcopy ..\..\..\jsLinb\js\Dom.js       ..\..\..\..\MyQikan\jsLinb\js\ /Y
xcopy ..\..\..\jsLinb\js\DragDrop.js       ..\..\..\..\MyQikan\jsLinb\js\ /Y
xcopy ..\..\..\jsLinb\js\Event.js       ..\..\..\..\MyQikan\jsLinb\js\ /Y
xcopy ..\..\..\jsLinb\js\linb.js       ..\..\..\..\MyQikan\jsLinb\js\ /Y
xcopy ..\..\..\jsLinb\js\Debugger.js       ..\..\..\..\MyQikan\jsLinb\js\ /Y
xcopy ..\..\..\jsLinb\js\Template.js       ..\..\..\..\MyQikan\jsLinb\js\ /Y
rem xcopy ..\..\..\jsLinb\js\Date.js       ..\..\..\..\MyQikan\jsLinb\js\ /Y
xcopy ..\..\..\jsLinb\js\UI.js       ..\..\..\..\MyQikan\jsLinb\js\ /Y

xcopy ..\..\..\jsLinb\js\UI\Tips.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
xcopy ..\..\..\jsLinb\js\UI\Border.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
rem xcopy ..\..\..\jsLinb\js\UI\Resizer.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
xcopy ..\..\..\jsLinb\js\UI\Shadow.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y

xcopy ..\..\..\jsLinb\js\UI\Button.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
xcopy ..\..\..\jsLinb\js\UI\Input.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
xcopy ..\..\..\jsLinb\js\UI\ComboInput.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
rem xcopy ..\..\..\jsLinb\js\UI\DatePicker.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
rem xcopy ..\..\..\jsLinb\js\UI\TimePicker.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
rem xcopy ..\..\..\jsLinb\js\UI\TimeLine.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
xcopy ..\..\..\jsLinb\js\UI\List.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
rem xcopy ..\..\..\jsLinb\js\UI\LinkList.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
rem xcopy ..\..\..\jsLinb\js\UI\Gallery.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
rem xcopy ..\..\..\jsLinb\js\UI\Poll.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
rem xcopy ..\..\..\jsLinb\js\UI\PageBar.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
xcopy ..\..\..\jsLinb\js\UI\Tabs.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
xcopy ..\..\..\jsLinb\js\UI\CheckBox.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
xcopy ..\..\..\jsLinb\js\UI\RadioBox.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
rem xcopy ..\..\..\jsLinb\js\UI\FoldingList.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
rem xcopy ..\..\..\jsLinb\js\UI\Poll.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
xcopy ..\..\..\jsLinb\js\UI\TreeBar.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
xcopy ..\..\..\jsLinb\js\UI\IFrame.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
xcopy ..\..\..\jsLinb\js\UI\Panel.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
xcopy ..\..\..\jsLinb\js\UI\Layout.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
xcopy ..\..\..\jsLinb\js\UI\colLayout.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y
xcopy ..\..\..\jsLinb\js\UI\Fieldset.js       ..\..\..\..\MyQikan\jsLinb\js\UI\ /Y

xcopy ..\build\build.bat                ..\..\..\..\MyQikan\build\ /Y
xcopy ..\build\yuicompressor.jar        ..\..\..\..\MyQikan\build\ /Y


xcopy ..\img\*.*        ..\..\..\..\MyQikan\img\ /E /Y
xcopy ..\Locale\*.*     ..\..\..\..\MyQikan\Locale\ /E /Y
xcopy ..\MyQikan\*.*       ..\..\..\..\MyQikan\MyQikan\ /E /Y
