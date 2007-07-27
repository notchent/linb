Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Layout","linb.UI.Stacks","linb.UI.Button","linb.UI.Dialog","linb.UI.Block","linb.UI.Div","linb.UI.Tabs","linb.UI.Group"],
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];
            
            this.Block2 = (new linb.UI.Block)
            .alias("Block2").host(this)
            .setDock("top").setHeight(32).setBorder(true)
            ;
            this.nodes.push(this.Block2.get(0));
            
            this.Div3 = (new linb.UI.Div)
            .alias("Div3").host(this)
            .setLeft(16).setTop(5).setWidth(96).setHeight(24).setHtml("<b>Dialog demo</b>")
            ;
            this.Block2.attach(this.Div3);
            
            this.layout1 = (new linb.UI.Layout)
            .alias("layout1").host(this)
            .setLeft("0").setTop("0").setItems([{"id":"before","pos":"before","locked":false,"size":200,"min":50,"max":400,"cmd":true,"hide":false},{"id":"main","min":10}])
            .setType("horizontal")
            ;
            this.nodes.push(this.layout1.get(0));
            
            this.Dialog1 = (new linb.UI.Dialog)
            .alias("Dialog1").host(this)
            .setLeft(88).setTop(70).setWidth(408).setHeight(264).setCaption("Dialog")
            ;
            this.layout1.attach(this.Dialog1, 'main');
            
            this.Tabs1 = (new linb.UI.Tabs)
            .alias("Tabs1").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3"},{"id":"view4","caption":"view4"}])
            .setValue("view2")
            ;
            this.Dialog1.attach(this.Tabs1);
            
            this.Group1 = (new linb.UI.Group)
            .alias("Group1").host(this)
            .setLeft(33).setTop(25).setWidth(336).setHeight(160).setCaption("Group1")
            ;
            this.Tabs1.attach(this.Group1, 'view1');
            
            this.Button16 = (new linb.UI.Button)
            .alias("Button16").host(this)
            .setLeft(96).setTop(56).setCaption("Close me")
            .onClick("_button16_onclick")
            ;
            this.Group1.attach(this.Button16);
            
            this.Stacks1 = (new linb.UI.Stacks)
            .alias("Stacks1").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"view1","caption":"alert"},{"id":"view2","caption":"MDI"},{"id":"view3","caption":"others"}])
            .setValue("view1")
            ;
            this.layout1.attach(this.Stacks1, 'before');
            
            this.Button8 = (new linb.UI.Button)
            .alias("Button8").host(this)
            .setLeft(40).setTop(16).setCaption("New window")
            .onClick("_button8_onclick")
            ;
            this.Stacks1.attach(this.Button8, 'view2');
            
            this.Button2 = (new linb.UI.Button)
            .alias("Button2").host(this)
            .setLeft(24).setTop(56).setCaption("confirm")
            .onClick("_button2_onclick")
            ;
            this.Stacks1.attach(this.Button2, 'view1');
            
            this.Button3 = (new linb.UI.Button)
            .alias("Button3").host(this)
            .setLeft(40).setTop(56).setCaption("Modal")
            .onClick("_button3_onclick")
            ;
            this.Stacks1.attach(this.Button3, 'view2');
            
            this.Button4 = (new linb.UI.Button)
            .alias("Button4").host(this)
            .setLeft(40).setTop(16).setCaption("min")
            .onClick("_button4_onclick")
            ;
            this.Stacks1.attach(this.Button4, 'view3');
            
            this.Button5 = (new linb.UI.Button)
            .alias("Button5").host(this)
            .setLeft(40).setTop(56).setCaption("max")
            .onClick("_button5_onclick")
            ;
            this.Stacks1.attach(this.Button5, 'view3');
            
            this.Button6 = (new linb.UI.Button)
            .alias("Button6").host(this)
            .setLeft(40).setTop(96).setCaption("no max button")
            .onClick("_button6_onclick")
            ;
            this.Stacks1.attach(this.Button6, 'view3');
            
            this.Button9 = (new linb.UI.Button)
            .alias("Button9").host(this)
            .setLeft(40).setTop(136).setCaption("no min button")
            .onClick("_button9_onclick")
            ;
            this.Stacks1.attach(this.Button9, 'view3');
            
            this.Button10 = (new linb.UI.Button)
            .alias("Button10").host(this)
            .setLeft(40).setTop(176).setCaption("no pin button")
            .onClick("_button10_onclick")
            ;
            this.Stacks1.attach(this.Button10, 'view3');
            
            this.Button11 = (new linb.UI.Button)
            .alias("Button11").host(this)
            .setLeft(40).setTop(216).setCaption("can't move")
            .onClick("_button11_onclick")
            ;
            this.Stacks1.attach(this.Button11, 'view3');
            
            this.Button12 = (new linb.UI.Button)
            .alias("Button12").host(this)
            .setLeft(40).setTop(256).setCaption("can't resize")
            .onClick("_button12_onclick")
            ;
            this.Stacks1.attach(this.Button12, 'view3');
            
            this.Button1 = (new linb.UI.Button)
            .alias("Button1").host(this)
            .setLeft(24).setTop(16).setCaption("alert")
            .onClick("_button1_onclick")
            ;
            this.Stacks1.attach(this.Button1, 'view1');
            
            this.Button7 = (new linb.UI.Button)
            .alias("Button7").host(this)
            .setLeft(24).setTop(96).setCaption("pop")
            .onClick("_button7_onclick")
            ;
            this.Stacks1.attach(this.Button7, 'view1');
            
            this.Button13 = (new linb.UI.Button)
            .alias("Button13").host(this)
            .setLeft(40).setTop(296).setCaption("No shadow")
            .onClick("_button13_onclick")
            ;
            this.Stacks1.attach(this.Button13, 'view3');
            
            return this.nodes;
            // ]]code creted by designer
        },
        _button1_onclick:function (profile, e, value) {
            linb.UI.Dialog.alert('alert','this is an alert message!');
        },
        _button2_onclick:function (profile, e, value) {
            linb.UI.Dialog.confirm('confirm','this is an confirm message!');
        },
        _button7_onclick:function (profile, e, value) {
            linb.UI.Dialog.pop('pop','this is an pop message!');
        },
        _button8_onclick:function (profile, e, value) {
            var rnd = 100 + Math.random()*200, parent=this.layout1.getPanel('main');
            new linb.UI.Dialog({caption:'dialog demo', width:rnd, height:rnd, left:rnd, top:rnd ,
                fromRegion:profile.root.getRegion(true)})
            .show()
        },
        _button3_onclick:function (profile, e, value) {
            var rnd = 100 + Math.random()*200;
            new linb.UI.Dialog({caption:'Modal',left:rnd, top:rnd, width:200, height:300}).show(linb(document.body),true)
        },
        _button4_onclick:function (profile, e, value) {
            new linb.UI.Dialog({status:'min'}).show(this.layout1.getPanel('main'))
        },
        _button5_onclick:function (profile, e, value) {
            new linb.UI.Dialog({status:'max'}).show(this.layout1.getPanel('main'))
        },
        _button6_onclick:function (profile, e, value) {
            new linb.UI.Dialog({maxBtn:false}).show(this.layout1.getPanel('main'))
        },
        _button9_onclick:function (profile, e, value) {
            new linb.UI.Dialog({minBtn:false}).show(this.layout1.getPanel('main'))
        },
        _button10_onclick:function (profile, e, value) {
            new linb.UI.Dialog({pinBtn:false}).show(this.layout1.getPanel('main'))
        },
        _button11_onclick:function (profile, e, value) {
            new linb.UI.Dialog({movable:false}).show(this.layout1.getPanel('main'))
        },
        _button12_onclick:function (profile, e, value) {
            new linb.UI.Dialog({resizable:false}).show(this.layout1.getPanel('main'))
        },
        _button13_onclick:function (profile, e, value) {
            new linb.UI.Dialog({shadow:false}).show(this.layout1.getPanel('main'))
        },
        _button16_onclick:function (profile, e, value) {
            this.Dialog1.destroy();
        }
    }
});