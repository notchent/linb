Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.TextEditor"],

        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.TextEditor)
            .host(t,"texteditor1")
            .setLeft(70)
            .setTop(60)
            .setWidth(228)
            .setHeight(206)
            .setBorder(true)
            .setCaption("texteditor1")
            .setValue("//tab:  4 space\n//enter: add header spaces\n//{+enter: add 4 more spaces\n//}:minus 4 spaces\n\nvar function(){\n    var a=2;\n}")
            );

            f(
            (new u.TextEditor)
            .host(t,"texteditor2")
            .setLeft(368)
            .setTop(60)
            .setWidth(228)
            .setHeight(206)
            .setBorder(true)
            .setCaption("texteditor1")
            .setValue("var function(){\n    //readonly\n}")
            .setReadonly(true)
            );

            return n;
            // ]]code created by designer
        }
    }
});