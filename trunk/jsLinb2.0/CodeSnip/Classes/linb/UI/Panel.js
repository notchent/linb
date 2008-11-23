
Class('App.linb_UI_Panel', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Pane)
                .host(host,"pane4")
                .setLeft(60)
                .setTop(20)
                .setWidth(260)
                .setHeight(340)
            );
            
            host.pane4.append((new linb.UI.Panel)
                .host(host,"panelbar2")
                .setDock("width")
                .setLeft(0)
                .setHeight("auto")
                .setZIndex(1)
                .setPosition("relative")
                .setCaption("relative auto-adjust height 1")
                .setToggleBtn(true)
            );
            
            host.panelbar2.append((new linb.UI.Button)
                .host(host,"button9")
                .setLeft(67)
                .setPosition("relative")
                .setCaption("button9")
            );
            
            host.pane4.append((new linb.UI.Panel)
                .host(host,"panelbar3")
                .setDock("width")
                .setLeft(0)
                .setHeight("auto")
                .setZIndex(1)
                .setPosition("relative")
                .setCaption("relative auto-adjust height 1")
            );
            
            host.panelbar3.append((new linb.UI.Button)
                .host(host,"button11")
                .setLeft(67)
                .setPosition("relative")
                .setCaption("button9")
            );
            
            append((new linb.UI.Pane)
                .host(host,"panel5")
                .setLeft(420)
                .setTop(19)
                .setWidth(260)
                .setHeight(135)
            );
            
            host.panel5.append((new linb.UI.Panel)
                .host(host,"panelbar6")
                .setLeft(0)
                .setTop(0)
                .setZIndex(1)
                .setCaption("in container dock=fill")
                .setToggleBtn(true)
            );
            
            host.panelbar6.append((new linb.UI.Button)
                .host(host,"button15")
                .setLeft(62)
                .setCaption("button15")
            );
            
            append((new linb.UI.Panel)
                .host(host,"panelbar7")
                .setDock("none")
                .setLeft(420)
                .setTop(180)
                .setWidth(280)
                .setHeight(180)
                .setZIndex(1)
                .setCaption("absolute dock=none")
                .setToggle(false)
                .setOptBtn(true)
                .setToggleBtn(true)
                .setCloseBtn(true)
                .setLandBtn(true)
                .onIniPanelView("_panelbar7_oninipanelview")
                .onFold("_panelbar7_onfold")
                .onExpend("_panelbar7_onexpend")
                .onShowOptions("_panelbar7_onshowoptions")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _panelbar7_oninipanelview:function (profile) {
            profile.boxing().append(new linb.UI.Button);
        }, 
        _panelbar7_onfold:function (profile) {
            linb.message('fold');
        }, 
        _panelbar7_onexpend:function (profile) {
            linb.message('expend');
        }, 
        base:[], 
        required:["linb.UI.Pane", "linb.UI.Panel", "linb.UI.Button"], 
        _panelbar7_onshowoptions:function (profile, e, src) {
            linb.message('onShowOptions');
        }
    }
});