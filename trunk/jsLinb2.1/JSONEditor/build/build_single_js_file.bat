set relPath=..\..\
set appPath=..\App\
set compressTool=%relPath%tools/yuicompressor.jar

copy %relPath%jsLinb\js\linb.js /b +  %relPath%jsLinb\Locale\en.js /b + %relPath%jsLinb\js\Event.js /b  + %relPath%jsLinb\js\CSS.js /b + %relPath%jsLinb\js\Dom.js /b + %relPath%jsLinb\js\DragDrop.js /b + %relPath%jsLinb\js\Com.js /b + %relPath%jsLinb\js\ComFactory.js /b  + %relPath%jsLinb\js\UI.js /b + %relPath%jsLinb\js\UI\Border.js /b + %relPath%jsLinb\js\UI\Image.js /b + %relPath%jsLinb\js\UI\Button.js /b + %relPath%jsLinb\js\UI\Input.js /b + %relPath%jsLinb\js\UI\ComboInput.js /b + %relPath%jsLinb\js\UI\ToolBar.js /b + %relPath%jsLinb\js\UI\Layout.js /b + %relPath%jsLinb\js\UI\TreeGrid.js /b + %relPath%jsLinb\js\UI\TextEditor.js /b + %relPath%jsLinb\js\Coder.js /b + %appPath%js\index.js /b + %appPath%js\CodeView.js /b + %appPath%js\TreeView.js /b linb.js

java -jar %compressTool% -o linb.js linb.js

pause