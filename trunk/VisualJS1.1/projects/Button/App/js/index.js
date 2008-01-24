Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Button","linb.UI.Div"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Button)
            .host(t,"button10")
            .setDock("top")
            .setCaption("dock top")
            );
            
            f(
            (new u.Button)
            .host(t,"button11")
            .setCaption("dock top2")
            .setDock("top")
            .setDockOrder("2")
            );
            
            f(
            (new u.Button)
            .host(t,"button30")
            .setLeft(530)
            .setTop(80)
            .setCaption("with icon")
            .setIcon("img/demo.gif")
            .setWidth(180)
            );
            
            f(
            (new u.Button)
            .host(t,"button12")
            .setCaption("dock left")
            .setDock("left")
            .setWidth(70)
            );
            
            f(
            (new u.Button)
            .host(t,"button20")
            .setLeft(530)
            .setTop(160)
            .setCaption("disabled")
            .setToggleKey("toggleButton")
            .setDisabled(true)
            .setWidth(180)
            .onToggle("_button28_ontoggle")
            );
            
            f(
            (new u.Button)
            .host(t,"button13")
            .setCaption("dock right")
            .setDock("right")
            .setWidth(80)
            );
            
            f(
            (new u.Button)
            .host(t,"button14")
            .setCaption("dock bottom")
            .setDock("bottom")
            );
            
            f(
            (new u.Button)
            .host(t,"button15")
            .setLeft(110)
            .setTop(249)
            .setCaption("Vertically Middle")
            .setWidth(130)
            .setHeight(78)
            .setDock("middle")
            .setVAlign("middle")
            );
            
            f(
            (new u.Button)
            .host(t,"button18")
            .setLeft(230)
            .setTop(282)
            .setCaption("I am always in the center")
            .setWidth(210)
            .setHeight(88)
            .setVAlign("middle")
            .setDock("center")
            .beforeClickEffect("_button18_beforeclickeffect")
            );
            
            f(
            (new u.Button)
            .host(t,"button20")
            .setLeft(100)
            .setTop(80)
            .setCaption("border")
            .setWidth(190)
            .setHeight(30)
            .setBorder(true)
            );
            
            f(
            (new u.Button)
            .host(t,"button21")
            .setLeft(100)
            .setTop(160)
            .setCaption("border,resizable")
            .setWidth(190)
            .setHeight(50)
            .setBorder(true)
            .setResizable(true)
            );
            
            f(
            (new u.Button)
            .host(t,"button22")
            .appearance("link")
            .setLeft(110)
            .setTop(500)
            .setWidth(270)
            .setCaption("appearance : link")
            );
            
            f(
            (new u.Button)
            .host(t,"button23")
            .appearance("block")
            .setLeft(110)
            .setTop(530)
            .setWidth(270)
            .setCaption("appearance : block")
            );
            
            f(
            (new u.Button)
            .host(t,"button24")
            .behavior("dblclick")
            .setLeft(110)
            .setTop(430)
            .setWidth(270)
            .setCaption("behavior : dblclick")
            .onClick("_button24_onclick")
            );
            
            f(
            (new u.Button)
            .host(t,"button25")
            .setLeft(110)
            .setTop(460)
            .setWidth(270)
            .setCaption("behavior : default")
            .onClick("_button25_onclick")
            );
            
            f(
            (new u.Button)
            .host(t,"button22")
            .setLeft(490)
            .setTop(430)
            .setCaption("left,top")
            .setWidth(180)
            .setHeight(70)
            .setHAlign("left")
            );
            
            f(
            (new u.Button)
            .host(t,"button28")
            .setLeft(530)
            .setTop(120)
            .setCaption("toggle button")
            .setToggleKey("toggleButton")
            .setWidth(180)
            .onToggle("_button28_ontoggle")
            );
            
            f(
            (new u.Button)
            .host(t,"button29")
            .setLeft(100)
            .setTop(120)
            .setCaption("shadow")
            .setWidth(190)
            .setHeight(30)
            .setShadow(true)
            .setResizable(true)
            );
            
            f(
            (new u.Div)
            .host(t,"div25")
            .setLeft(80)
            .setTop(50)
            .setWidth(330)
            .setHeight(20)
            .setHtml("<font color=red>Change browser size to see button's new position</font>")
            );
            
            return n;
            // ]]code created by designer
        },
        _button25_onclick:function (profile, e, value) {
            linb.message('clicked');
        },
        _button24_onclick:function (profile, e, value) {
            linb.message('dbl clicked');
        },
        _button28_ontoggle:function (profile, e, value, toggleKey) {
            linb.message(toggleKey + ' toggle to ' + value);
        },
        _button19_beforehovereffect:function (profile, item, src, type) {
            linb.message(type);
            return false;
        },
        _button18_beforeclickeffect:function (profile, item, src, type) {
            linb.message(type);
            return false;
        },
        _div9_aftercreated:function (profile) {
profile.root.setStyle('backgroundImage','url(img/app.gif)')
        }
    }
});