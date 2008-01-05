
copy ..\linb.js /b + ..\Cookies.js /b + ..\event.js /b + ..\template.js /b + ..\css.js /b + ..\dom.js /b + ..\Dragdrop.js /b + ..\date.js /b + ..\UI.js /b api.js

java -jar  yuicompressor.jar --charset UTF-8 -o api.js api.js

gzip -c  api.js > api.gzjs


pause