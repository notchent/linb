
Class('App', 'linb.Com',{
    Instance:{
        base:["linb.UI"],
        required:["linb.UI.Button", "linb.UI.PanelBar", "linb.UI.Dialog"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Panel)
            .host(t,"panel4")
            .setLeft(40)
            .setTop(19)
            .setWidth(260)
            .setHeight(530)
            );
            
            t.panel4.attach(
            (new u.PanelBar)
            .host(t,"panelbar2")
            .setDock("width")
            .setLeft(0)
            .setHeight("auto")
            .setZIndex(1)
            .setPosition("relative")
            .setCaption("relative auto-adjust height 1")
            .setToggleBtn(true)
            );
            
            t.panelbar2.attach(
            (new u.Button)
            .host(t,"button9")
            .setLeft(67)
            .setCaption("button9")
            .setPosition("relative")
            );
            
            t.panel4.attach(
            (new u.PanelBar)
            .host(t,"panelbar3")
            .setDock("width")
            .setLeft(0)
            .setHeight("auto")
            .setZIndex(1)
            .setPosition("relative")
            .setCaption("relative auto-adjust height 1")
            );
            
            t.panelbar3.attach(
            (new u.Button)
            .host(t,"button11")
            .setLeft(67)
            .setCaption("button9")
            .setPosition("relative")
            );
            
            f(
            (new u.Panel)
            .host(t,"panel5")
            .setLeft(450)
            .setTop(19)
            .setWidth(260)
            .setHeight(135)
            );
            
            t.panel5.attach(
            (new u.PanelBar)
            .host(t,"panelbar6")
            .setLeft(0)
            .setTop(0)
            .setZIndex(1)
            .setCaption("in container dock=fill")
            .setToggleBtn(true)
            );
            
            t.panelbar6.attach(
            (new u.Button)
            .host(t,"button15")
            .setLeft(62)
            .setCaption("button15")
            );
            
            f(
            (new u.PanelBar)
            .host(t,"panelbar7")
            .setDock("none")
            .setLeft(450)
            .setTop(180)
            .setWidth(280)
            .setHeight(180)
            .setZIndex(1)
            .setCaption("absolute dock=none")
            .setToggle(false)
            .setToggleBtn(true)
            .setCloseBtn(true)
            .setLandBtn(true)
            .setOptBtn(true)
            );
            
            t.panelbar7.attach(
            (new u.Button)
            .host(t,"button14")
            .setLeft(8)
            .setTop(136)
            .setWidth(270)
            .setCaption("button14")
            );
            
            return n;
            // ]]code created by designer
        }
    }
});