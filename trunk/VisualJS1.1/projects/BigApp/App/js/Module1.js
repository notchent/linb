Class('App.Module1', 'linb.Com',{
    Instance:{
        base:["linb.UI"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Panel)
            .host(t,"panelMain")
            .setLeft(0)
            .setTop(0)
            .setWidth(250)
            .setHeight(180)
            );
            
            t.panelMain.attach(
            (new u.Div)
            .host(t,"div37")
            .setLeft(20)
            .setTop(10)
            .setHeight(20)
            .setHtml("UI in Module1")
            );
            
            t.panelMain.attach(
            (new u.Tag)
            .host(t,"tag2")
            .setLeft(20)
            .setTop(70)
            .setWidth(218)
            .setHeight(98)
            .setTagKey("tag_SubModule1")
            );
            
            t.panelMain.attach(
            (new u.Button)
            .host(t,"button22")
            .setLeft(20)
            .setTop(40)
            .setWidth(170)
            .setCaption("button in Module1")
            .onClick("_button22_onclick")
            );
            
            return n;
            // ]]code created by designer
        },
        required:["linb.UI.Panel","linb.UI.Div","linb.UI.Tag","linb.UI.Button"],
        _button22_onclick:function (profile, e, value) {
            alert("I'm in Module1");
        }
    }
});