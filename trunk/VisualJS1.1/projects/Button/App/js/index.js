Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Button"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Button)
            .host(t,"button25")
            .setLeft(90)
            .setTop(390)
            .setWidth(270)
            .setCaption("behavior : default")
            .onClick("_button25_onclick")
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
            .host(t,"button28")
            .setLeft(480)
            .setTop(340)
            .setCaption("toggle button")
            .setToggleKey("toggleButton")
            .onToggle("_button28_ontoggle")
            );
            
            f(
            (new u.Button)
            .host(t,"button29")
            .setLeft(98)
            .setTop(149)
            .setCaption("shadow")
            .setWidth(82)
            .setHeight(60)
            .setShadow(true)
            .setResizable(true)
            );
            
            f(
            (new u.Button)
            .host(t,"button10")
            .setDock("top")
            .setCaption("dock top")
            );
            
            f(
            (new u.Button)
            .host(t,"button30")
            .setLeft(550)
            .setTop(100)
            .setCaption("with icon")
            .setIcon("img/demo.gif")
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
            .setLeft(480)
            .setTop(380)
            .setCaption("disabled")
            .setToggleKey("toggleButton")
            .setDisabled(true)
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
            .setLeft(100)
            .setTop(282)
            .setCaption("left,top")
            .setWidth(100)
            .setHeight(55)
            .setHAlign("left")
            .setDock("middle")
            );
            
            f(
            (new u.Button)
            .host(t,"button18")
            .setLeft(230)
            .setTop(282)
            .setCaption("middle,center")
            .setWidth(100)
            .setHeight(55)
            .setVAlign("middle")
            .setDock("origin")
            .beforeClickEffect("_button18_beforeclickeffect")
            );
            
            f(
            (new u.Button)
            .host(t,"button19")
            .setLeft(589)
            .setTop(100)
            .setCaption("right,bottom")
            .setWidth(100)
            .setHeight(90)
            .setHAlign("right")
            .setVAlign("bottom")
            .setDock("center")
            .beforeHoverEffect("_button19_beforehovereffect")
            );
            
            f(
            (new u.Button)
            .host(t,"button20")
            .setLeft(100)
            .setTop(80)
            .setCaption("border")
            .setWidth(70)
            .setHeight(60)
            .setBorder(true)
            );
            
            f(
            (new u.Button)
            .host(t,"button21")
            .setLeft(190)
            .setTop(80)
            .setCaption("border,resizable")
            .setWidth(130)
            .setHeight(50)
            .setBorder(true)
            .setResizable(true)
            );
            
            f(
            (new u.Button)
            .host(t,"button22")
            .appearance("link")
            .setLeft(90)
            .setTop(430)
            .setWidth(270)
            .setCaption("appearance : link")
            );
            
            f(
            (new u.Button)
            .host(t,"button23")
            .appearance("block")
            .setLeft(90)
            .setTop(460)
            .setWidth(270)
            .setCaption("appearance : block")
            );
            
            f(
            (new u.Button)
            .host(t,"button24")
            .behavior("dblclick")
            .setLeft(90)
            .setTop(360)
            .setWidth(270)
            .setCaption("behavior : dblclick")
            .onClick("_button24_onclick")
            );
            
            f(
            (new u.Div)
            .host(t,"div9")
            .setLeft(460)
            .setTop(80)
            .afterCreated("_div9_aftercreated")
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