set verno=1.10
set new_path=sigma_linb_110_1_release
mkdir %new_path%

xcopy ..\docs\sigma_linb_reference %new_path%\docs\sigma_linb_reference /E/I/F
xcopy ..\img %new_path%\img /E/I/F
xcopy ..\jsLinb %new_path%\jsLinb /E/I/F
xcopy ..\Locale %new_path%\Locale /E/I/F
xcopy ..\projects %new_path%\projects /E/I/F


copy  ..\demo.html %new_path%\demo.html
copy  ..\readme_linb.txt %new_path%\readme.txt
copy  ..\license_linb_gnu.txt %new_path%\license.txt



pause