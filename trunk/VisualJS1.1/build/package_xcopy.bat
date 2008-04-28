set verno=1.10
set new_path=sigma_package_110_1_release
mkdir %new_path%

xcopy ..\docs %new_path%\docs /E/I/F
xcopy ..\img %new_path%\img /E/I/F
xcopy ..\jsLinb %new_path%\jsLinb /E/I/F
xcopy ..\Locale %new_path%\Locale /E/I/F
xcopy ..\phpClass %new_path%\phpClass /E/I/F
xcopy ..\phpLinb %new_path%\phpLinb /E/I/F
xcopy ..\projects %new_path%\projects /E/I/F
xcopy ..\template %new_path%\template /E/I/F
xcopy ..\VisualJS %new_path%\VisualJS /E/I/F

copy  ..\debug.html %new_path%\debug.html
copy  ..\demo.html %new_path%\demo.html
copy  ..\index.html %new_path%\index.html
copy  ..\readme_package.txt %new_path%\readme.txt
copy  ..\license_package_gnu.txt %new_path%\license.txt
copy  ..\request.php %new_path%\request.php


pause