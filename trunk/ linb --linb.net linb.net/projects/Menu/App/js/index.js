Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI", "linb.coder"],
        //requried class for the App
        required:["linb.UI.Button","linb.UI.PopMenu","linb.UI.MenuBar","linb.UI.ToolBar","linb.UI.Block"],

        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.popmenu1 = (new linb.UI.PopMenu)
            .alias("popmenu1").host(this)
            .setItems([{"id":"itema","caption":"itema","tips":"item a"},{"type":"split"},{"id":"itemb","caption":"itemb","tips":"item b"},{"id":"itemc","caption":"itemc","tips":"item c"},{"id":"itemd","caption":"itemd","tips":"item d"}]).setWidth(90).setHeight(102)
            .onMenuSelected("_popmenu1_onmenuselected")
            ;
            this.nodes.push(this.popmenu1.get(0));

            this.popmenu2 = (new linb.UI.PopMenu)
            .alias("popmenu2").host(this)
            .setValue(null).setMaxHeight(240).setItems([{"id":"itema","caption":"itema","tips":"item a"},{"id":"itemb","caption":"itemb","tips":"item b","sub":[{"id":"itema1","caption":"itema","tips":"item a"},{"id":"itemb1","caption":"itemb","tips":"item b","sub":[{"id":"itemc11","caption":"itemc","tips":"item c"},{"id":"itemd11","caption":"itemd","tips":"item d"}]},{"id":"itemc1","caption":"itemc","tips":"item c"},{"id":"itemd1","caption":"itemd","tips":"item d","sub":[{"id":"itemc11","caption":"itemc","tips":"item c"},{"id":"itemd11","caption":"itemd","tips":"item d"}]}]},{"id":"itemc","caption":"itemc","tips":"item c"},{"id":"itemd","caption":"itemd","tips":"item d"},{"id":"iteme","caption":"iteme"},{"id":"itemf","caption":"itemf"},{"id":"itemg","caption":"itemg"},{"id":"itemh","caption":"itemh"},{"id":"itemi","caption":"itemi"},{"id":"itemj","caption":"itemj"},{"id":"itemk","caption":"itemk"},{"id":"iteml","caption":"iteml"},{"id":"itemm","caption":"itemm"},{"id":"itemn","caption":"itemn"},{"id":"itemo","caption":"itemo"},{"id":"itemp","caption":"itemp"}]).setWidth(95).setHeight(240)
            .onMenuSelected("_popmenu2_onmenuselected")
            ;
            this.nodes.push(this.popmenu2.get(0));

            this.button2 = (new linb.UI.Button)
            .alias("button2").host(this)
            .setLeft(222).setTop(30).setCaption("button1")
            .onClick("_button2_onclick")
            ;
            this.nodes.push(this.button2.get(0));

            this.button1 = (new linb.UI.Button)
            .alias("button1").host(this)
            .setLeft(70).setTop(30).setCaption("button1")
            .onClick("_button1_onclick")
            ;
            this.nodes.push(this.button1.get(0));

            this.block1 = (new linb.UI.Block)
            .alias("block1").host(this)
            .setLeft(60).setTop(90).setWidth(520).setHeight(320).setResizable(true).setBorder(true)
            ;
            this.nodes.push(this.block1.get(0));

            this.toolbar2 = (new linb.UI.ToolBar)
            .alias("toolbar2").host(this)
            .setValue(null).setItems([{"id":"align","sub":[{"id":"left","caption":"21","tips":"$app.designer.tool.left"},{"id":"center","caption":"22","tips":"$app.designer.tool.center"},{"id":"right","caption":"23","tips":"$app.designer.tool.right"},{"id":"s1","type":"split"},{"id":"top","caption":"24","tips":"$app.designer.tool.top"},{"id":"middle","caption":"25","tips":"$app.designer.tool.middle"},{"id":"bottom","caption":"26","tips":"$app.designer.tool.bottom"},{"id":"s2","type":"split"},{"id":"w","caption":"27","tips":"$app.designer.tool.width"},{"id":"wh","caption":"28","tips":"$app.designer.tool.wh"},{"id":"h","caption":"29","tips":"$app.designer.tool.height"}]},{"id":"code","sub":[{"id":"format","caption":"11","type":"button","tips":"$app.designer.tool.tocode"},{"id":"json","caption":"12","type":"button","tips":"$app.designer.tool.tojson"}]}]).setDockOrder("2").setHandler(false).setAlign("right")
            .onClick("_toolbar2_onclick")
            ;
            this.block1.attach(this.toolbar2);

            this.menubar1 = (new linb.UI.MenuBar)
            .alias("menubar1").host(this)
            .setItems([{"id":"file","caption":"File","sub":[{"id":"newproject","caption":"New Project","icon":"img/App.gif","iconPos":"-32px top"},{"id":"openproject","caption":"Open Project","add":"Ctrl+Alt+O","icon":"img/App.gif","iconPos":"-48px top"},{"id":"closeproject","caption":"Close Project"},{"type":"split"},{"id":"save","caption":"Save","icon":"img/App.gif","iconPos":"-80px top"},{"id":"saveall","caption":"Save All","add":"Ctrl+Alt+S","icon":"img/App.gif","iconPos":"-96px top"}]},{"id":"tools","caption":"Tools","sub":[{"id":"command","caption":"Command Window","icon":"img/App.gif","iconPos":"-112px top"},{"id":"spy","caption":"Components Spy","icon":"img/App.gif","iconPos":"-128px top"}]},{"id":"build","caption":"Build","sub":[{"id":"debug","caption":"Debug","icon":"img/App.gif","iconPos":"top left","add":"F9"},{"id":"release","caption":"Release","icon":"img/App.gif","iconPos":"-64px top","add":"Ctrl+F9"},{"type":"split"},{"id":"setting","caption":"Build Setting"}]},{"id":"help","caption":"Help","sub":[{"id":"Forum","caption":"forum"},{"type":"split"},{"id":"License","caption":"License"},{"type":"split"},{"id":"about","caption":"About"}]}])
            .onMenuSelected("_menubar1_onmenuselected")
            ;
            this.block1.attach(this.menubar1);

            this.button3 = (new linb.UI.Button)
            .alias("button3").host(this)
            .setLeft(450).setTop(30).setCaption("button3")
            .onClick("_button3_onclick")
            ;
            this.nodes.push(this.button3.get(0));
            return this.nodes;
            // ]]code creted by designer
        },
        _button1_onclick:function (profile, e, value) {
            this.popmenu1.pop(profile.root);
            this.popmenu1.$target = profile;
        },
        _popmenu1_onmenuselected:function (profile, id, src) {
            this.popmenu1.$target.boxing().setCaption(id);
            linb.message(id+' clicked');
        },
        _button2_onclick:function (profile, e, value) {
            this.popmenu1.pop(profile.root,null,true);
            this.popmenu1.$target = profile;
        },
        _button3_onclick:function (profile, e, value) {
            this.popmenu2.pop(profile.root,null,true);
            this.popmenu2.$target = profile;
        },
        _popmenu2_onmenuselected:function (profile, id, src) {
            this.popmenu2.$target.boxing().setCaption(id);
            linb.message(id+' clicked');
        },
        _menubar1_onmenuselected:function (profile, id, src) {
            linb.message(id+' selected.')
        },
        _toolbar2_onclick:function (profile, id, groupid, src) {
            linb.message(groupid +':'+ id+' clicked');
        }
    }
});