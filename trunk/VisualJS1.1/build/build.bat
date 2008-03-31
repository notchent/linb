mkdir ..\jsLINB\js_release
mkdir ..\VisualJS\js_release

copy ..\jsLinb\js\linb.js /b + ..\jsLinb\js\event.js /b + ..\jsLinb\js\template.js /b + ..\jsLinb\js\date.js /b + ..\jsLinb\js\css.js /b + ..\jsLinb\js\dom.js /b + ..\jsLinb\js\Com.js /b + ..\jsLinb\js\Cookies.js /b + ..\jsLinb\js\Dragdrop.js /b + ..\jsLinb\js\BookMark.js /b + ..\jsLinb\js\ComFactory.js /b + ..\jsLinb\js\logger.js /b + ..\jsLinb\js\UI.js /b + ..\jsLinb\js\Block.js /b + ..\jsLinb\js\UI\Edge.js /b + ..\jsLinb\js\UI\Shadow.js /b + ..\jsLinb\js\UI\Resizer.js /b + ..\jsLinb\js\UI\Tips.js /b + ..\jsLinb\js\UI\Label.js /b + ..\jsLinb\js\UI\Button.js /b + ..\jsLinb\js\UI\CheckBox.js /b + ..\jsLinb\js\UI\Input.js /b + ..\jsLinb\js\UI\ComboInput.js /b + ..\jsLinb\js\UI\Group.js /b + ..\jsLinb\js\UI\DatePicker.js /b + ..\jsLinb\js\UI\TimePicker.js /b + ..\jsLinb\js\UI\TimeLine.js /b + ..\jsLinb\js\UI\List.js /b + ..\jsLinb\js\UI\LinkList.js /b + ..\jsLinb\js\UI\Gallery.js /b + ..\jsLinb\js\UI\IconList.js /b + ..\jsLinb\js\UI\Poll.js /b + ..\jsLinb\js\UI\PanelBar.js /b + ..\jsLinb\js\UI\PageBar.js /b + ..\jsLinb\js\UI\Tabs.js /b + ..\jsLinb\js\UI\Stack.js /b + ..\jsLinb\js\UI\ButtonViews.js /b + ..\jsLinb\js\UI\RadioBox.js /b + ..\jsLinb\js\UI\FoldingList.js /b + ..\jsLinb\js\UI\TreeBar.js /b + ..\jsLinb\js\UI\PopMenu.js /b + ..\jsLinb\js\UI\MenuBar.js /b + ..\jsLinb\js\UI\ToolBar.js /b + ..\jsLinb\js\UI\Range.js /b + ..\jsLinb\js\UI\Layout.js /b + ..\jsLinb\js\UI\TreeGrid.js /b + ..\jsLinb\js\UI\Dialog.js /b + ..\jsLinb\js\UI\TextEditor.js /b + ..\jsLinb\js\UI\Calendar.js /b + ..\jsLinb\js\UI\Iframe.js /b  linb.js

copy ..\VisualJS\js\index.js /b + ..\VisualJS\js\PageEditor.js /b + ..\VisualJS\js\ClassTool.js /b + ..\VisualJS\js\ClassEditor.js /b + ..\VisualJS\js\ClassStruct.js /b + ..\VisualJS\js\ObjectEditor.js /b + ..\VisualJS\js\ProjectPro.js /b + ..\VisualJS\js\ProjectSelector.js /b + ..\VisualJS\js\Designer.js /b + ..\VisualJS\js\AddFile.js /b + ..\VisualJS\js\DelFile.js /b + ..\VisualJS\js\About.js /b  index.js

java -jar yuicompressor.jar -o ../jsLINB/js_release/linb.js     --nomunge    linb.js
java -jar yuicompressor.jar -o ../VisualJS/js_release/index.js     --nomunge     index.js

del /q linb.js
del /q index.js

pause