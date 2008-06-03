Class('App.SubModule1', 'linb.Com',{
    Instance:{
        base:["linb.UI"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Panel)
            .host(t,"panelMain")
            .setLeft(60)
            .setTop(50)
            .setWidth(160)
            .setHeight(70)
            );
            
            t.panelMain.attach(
            (new u.Div)
            .host(t,"div37")
            .setLeft(10)
            .setTop(10)
            .setHeight(20)
            .setHtml("UI in SubModule1")
            );
            
            t.panelMain.attach(
            (new u.Button)
            .host(t,"button22")
            .setLeft(10)
            .setTop(40)
            .setWidth(140)
            .setCaption("button in SubModule1")
            .onClick("_button22_onclick")
            );
            
            return n;
            // ]]code created by designer
        },
        required:["linb.UI.Panel","linb.UI.Div","linb.UI.Tag","linb.UI.Button"],
        _button22_onclick:function (profile, e, value) {
            alert("I'm in SubModule1");
        }
    }
});