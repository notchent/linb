
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        //"linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"
        required:["linb.UI.ProgressBar"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.ProgressBar)
            .host(t,"progressbar1")
            .setValue("30")
            .setLeft(140)
            .setTop(110)
            );
            
            f(
            (new u.ProgressBar)
            .host(t,"progressbar2")
            .setValue("60")
            .setLeft(140)
            .setTop(150)
            .setHeight(34)
            .setShadow(true)
            );
            
            f(
            (new u.ProgressBar)
            .host(t,"progressbar3")
            .setValue("30")
            .setLeft(140)
            .setTop(210)
            .setResizable(true)
            .setBorder(true)
            .setBackground("red")
            );
            
            return n;
            // ]]code created by designer
        }
    }
});