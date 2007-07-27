Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Panel","linb.UI.Block","linb.UI.Tabs","linb.UI.ButtonViews","linb.UI.Stacks","linb.UI.PanelBar","linb.UI.Layout","linb.UI.Group","linb.UI.Button","linb.UI.Dialog"],

        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.panel4 = (new linb.UI.Panel)
            .alias("panel4").host(this)
            .setLeft(490).setTop(10).setWidth(260).setHeight(108)
            ;
            this.nodes.push(this.panel4.get(0));

            this.buttonviews2 = (new linb.UI.ButtonViews)
            .alias("buttonviews2").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"ba","caption":"itema","tips":"item a"},{"id":"bb","caption":"itemb","tips":"item b"},{"id":"bc","caption":"itemc","tips":"item c","closeBtn":"true","landBtn":true}]).setHandleSize("26").setValue("ba").setDragKey("panel").setDropKeysPanel("panel")
            .onDrop("_block1_ondrop")
            ;
            this.panel4.attach(this.buttonviews2, '');

            this.button13 = (new linb.UI.Button)
            .alias("button13").host(this)
            .setLeft(90).setTop(40).setCaption("button13")
            ;
            this.buttonviews2.attach(this.button13, 'bb');

            this.button14 = (new linb.UI.Button)
            .alias("button14").host(this)
            .setLeft(90).setTop(30).setCaption("button14")
            ;
            this.buttonviews2.attach(this.button14, 'bc');

            this.button12 = (new linb.UI.Button)
            .alias("button12").host(this)
            .setLeft(40).setTop(50).setCaption("button12")
            ;
            this.buttonviews2.attach(this.button12, 'ba');

            this.panel6 = (new linb.UI.Panel)
            .alias("panel6").host(this)
            .setLeft(490).setTop(140).setWidth(260).setHeight(128)
            .setCustomAppearance({KEY:'border:solid 1px;'})
            ;
            this.nodes.push(this.panel6.get(0));

            this.stacks1 = (new linb.UI.Stacks)
            .alias("stacks1").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"ca","caption":"itema","tips":"item a"},{"id":"cb","caption":"itemb","tips":"item b"},{"id":"cc","caption":"itemc","tips":"item c","closeBtn":"true","landBtn":true}]).setValue("cc").setDragKey("panel").setDropKeysPanel("panel")
            .onDrop("_block1_ondrop")
            ;
            this.panel6.attach(this.stacks1, '');

            this.button10 = (new linb.UI.Button)
            .alias("button10").host(this)
            .setLeft(60).setTop(50).setCaption("button10")
            ;
            this.stacks1.attach(this.button10, 'cb');

            this.button11 = (new linb.UI.Button)
            .alias("button11").host(this)
            .setLeft(60).setTop(20).setCaption("button11")
            ;
            this.stacks1.attach(this.button11, 'cc');

            this.button9 = (new linb.UI.Button)
            .alias("button9").host(this)
            .setLeft(100).setTop(10).setCaption("button9")
            ;
            this.stacks1.attach(this.button9, 'ca');

            this.panel5 = (new linb.UI.Panel)
            .alias("panel5").host(this)
            .setLeft(30).setTop(140).setWidth(420).setHeight(128)
            ;
            this.nodes.push(this.panel5.get(0));

            this.tabs2 = (new linb.UI.Tabs)
            .alias("tabs2").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"aa","caption":"itema","tips":"item a"},{"id":"ab","caption":"itemb","tips":"item b"},{"id":"ac","caption":"itemc","tips":"item c","closeBtn":"true","landBtnBtn":true}]).setValue("ab").setDragKey("panel").setDropKeysPanel("panel")
            .onDrop("_block1_ondrop")
            ;
            this.panel5.attach(this.tabs2, '');

            this.button7 = (new linb.UI.Button)
            .alias("button7").host(this)
            .setLeft(90).setTop(40).setCaption("button7")
            ;
            this.tabs2.attach(this.button7, 'aa');

            this.button8 = (new linb.UI.Button)
            .alias("button8").host(this)
            .setLeft(110).setTop(40).setCaption("button8")
            ;
            this.tabs2.attach(this.button8, 'ac');

            this.button6 = (new linb.UI.Button)
            .alias("button6").host(this)
            .setLeft(80).setTop(40).setCaption("button6")
            .afterCreated("_button6_aftercreated")
            ;
            this.tabs2.attach(this.button6, 'ab');

            this.panel3 = (new linb.UI.Panel)
            .alias("panel3").host(this)
            .setLeft(30).setTop(10).setWidth(420).setHeight(108)
            .setCustomAppearance({KEY:'border:solid 1px;'})
            ;
            this.nodes.push(this.panel3.get(0));

            this.layout4 = (new linb.UI.Layout)
            .alias("layout4").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"before","pos":"before","locked":false,"size":129,"min":50,"max":200,"hide":false,"cmd":true},{"id":"main","min":10},{"id":"after","pos":"after","locked":false,"size":118,"min":50,"max":200,"hide":false,"cmd":true}]).setType("horizontal").setDropKeys("panel")
            .onDrop("_block1_ondrop")
            ;
            this.panel3.attach(this.layout4, '');

            this.panelbar1 = (new linb.UI.PanelBar)
            .alias("panelbar1").host(this)
            .setLeft(0).setTop(0).setZIndex(1).setCaption("panelbar1").setTag("pb1").setDragKey("panel")
            ;
            this.layout4.attach(this.panelbar1, 'main');

            this.button3 = (new linb.UI.Button)
            .alias("button3").host(this)
            .setLeft(20).setTop(40).setCaption("button3")
            ;
            this.panelbar1.attach(this.button3);

            this.panelbar2 = (new linb.UI.PanelBar)
            .alias("panelbar2").host(this)
            .setLeft(0).setTop(0).setZIndex(1).setCaption("panelbar2").setTag("pb2").setDragKey("panel")
            ;
            this.layout4.attach(this.panelbar2, 'before');

            this.button4 = (new linb.UI.Button)
            .alias("button4").host(this)
            .setLeft(20).setTop(20).setCaption("button4").setWidth(80)
            ;
            this.panelbar2.attach(this.button4);

            this.group1 = (new linb.UI.Group)
            .alias("group1").host(this)
            .setLeft(500).setTop(300).setWidth(250).setHeight(130).setCaption("group1").setDropKeys("panel")
            .onDrop("_block1_ondrop")
            ;
            this.nodes.push(this.group1.get(0));

            this.dialog2 = (new linb.UI.Dialog)
            .alias("dialog2").host(this)
            .setLeft(260).setTop(130).setWidth(190).setHeight(120).setCaption("dialog2").setTag("pb3").setTagVar("").setDragKey("panel").setLandBtn(true)
            ;
            this.nodes.push(this.dialog2.get(0));

            this.button5 = (new linb.UI.Button)
            .alias("button5").host(this)
            .setLeft(30).setTop(20).setCaption("button5")
            ;
            this.dialog2.attach(this.button5);

            this.block1 = (new linb.UI.Block)
            .alias("block1").host(this)
            .setLeft(50).setTop(300).setWidth(400).setHeight(130).setBorder(true).setDropKeys("panel").setResizable(true)
            .onDrop("_block1_ondrop")
            ;
            this.nodes.push(this.block1.get(0));
            return this.nodes;
            // ]]code creted by designer
        },
        _block1_ondrop:function (profile, e, node, key, data, item) {
            var target = profile.boxing(), source = data.profile.boxing();
            var para = source.getPanelPara(data.domId), children = source.getPanelChildren(data.domId);
            source.removePanel(data.domId);
            target.addPanel(para, children, item);
        },
        _button6_aftercreated:function (profile) {
            profile.boxing().dragable('KEY','o')
        }
    }
});