
Class('App.OrderForm', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        //"linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"
        required:["linb.UI.PanelBar"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.PanelBar)
            .host(t,"panelbar4")
            .setLeft(0)
            .setTop(0)
            .setZIndex(1)
            .setCaption("panelbar4")
            );

            return n;
            // ]]code created by designer
        }
    }
});