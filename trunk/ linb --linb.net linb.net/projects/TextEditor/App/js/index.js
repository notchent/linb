Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.TextEditor"],

        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.texteditor1 = (new linb.UI.TextEditor)
            .alias("texteditor1").host(this)
            .setLeft(70).setTop(56).setWidth(228).setHeight(206).setBorder(true).setCaption("texteditor1").setValue("//tab:  4 space\n//enter: add header spaces\n//{+enter: add 4 more spaces\n//}:minus 4 spaces\n\nvar function(){\n    var a=2;\n}")
            ;
            this.nodes.push(this.texteditor1.get(0));

            this.texteditor2 = (new linb.UI.TextEditor)
            .alias("texteditor2").host(this)
            .setLeft(368).setTop(56).setWidth(228).setHeight(206).setBorder(true).setCaption("texteditor1").setValue("var function(){\n    //readonly\n}").setReadonly(true)
            ;
            this.nodes.push(this.texteditor2.get(0));
            return this.nodes;
            // ]]code creted by designer
        }
    }
});