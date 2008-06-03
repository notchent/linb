Class('App.Module3', 'linb.Com',{
    Instance:{
        base:["linb.UI"],
        customAttach:function(){
            this.dialog.show();
        },        
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Dialog)
            .host(t,"dialog")
            .setLeft(130)
            .setTop(160)
            .setHeight(200)
            .setCaption("dialog in Module3")
            );
            
            t.dialog.attach(
            (new u.Panel)
            .host(t,"panelMain")
            .setLeft(20)
            .setTop(30)
            .setWidth(220)
            .setHeight(80)
            );
            
            t.panelMain.attach(
            (new u.Div)
            .host(t,"div37")
            .setLeft(30)
            .setTop(10)
            .setHeight(20)
            .setHtml("UI in Module3")
            );
            
            t.panelMain.attach(
            (new u.Button)
            .host(t,"button22")
            .setLeft(20)
            .setTop(40)
            .setWidth(180)
            .setCaption("button in Module3")
            .onClick("_button22_onclick")
            );
            
            return n;
            // ]]code created by designer
        },
        required:["linb.UI.Panel","linb.UI.Div","linb.UI.Tag","linb.UI.Button","linb.UI.Dialog"],
        _button22_onclick:function (profile, e, value) {
            alert("I'm in Module3");
        }
    }
});