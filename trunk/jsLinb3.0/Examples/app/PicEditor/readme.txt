You need to redefine "BASEURL" and "BASEPATH" in [img.ib/core/class.image.config.unix.php] or [img.ib/core/class.image.config.win.php].

---------------------
                    // your url
   define("BASEURL","http://www.linb.net/Samples/app/PicEditor/imglib");
                    // your disk dir
   define("BASEPATH","/home/rubydown/public_html/linb/Samples/app/PicEditor/imglib");
---------------------

And, to run build/build.bat for release version.