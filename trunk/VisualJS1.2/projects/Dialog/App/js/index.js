Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Layout","linb.UI.Stacks","linb.UI.Button","linb.UI.Dialog","linb.UI.Block","linb.UI.Div","linb.UI.Tabs","linb.UI.Group"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Block)
            .host(t,"Block2")
            .setDock("top")
            .setHeight(32)
            .setBorder(true)
            );

            t.Block2.attach(
            (new u.Div)
            .host(t,"Div3")
            .setLeft(16)
            .setTop(5)
            .setWidth(96)
            .setHeight(24)
            .setHtml("<b>Dialog demo</b>")
            );

            f(
            (new u.Layout)
            .host(t,"layout1")
            .setLeft("0")
            .setTop("0")
            .setItems([{"id":"before","pos":"before","locked":false,"size":200,"min":50,"max":400,"cmd":true,"hide":false},{"id":"main","min":10}])
            .setType("horizontal")
            );

            t.layout1.attach(
            (new u.Dialog)
            .host(t,"Dialog1")
            .setLeft(88)
            .setTop(70)
            .setWidth(408)
            .setHeight(264)
            .setCaption("Dialog")
            , 'main');

            t.Dialog1.attach(
            (new u.Tabs)
            .host(t,"Tabs1")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3"},{"id":"view4","caption":"view4"}])
            .setValue("view2")
            );

            t.Tabs1.attach(
            (new u.Group)
            .host(t,"Group1")
            .setLeft(33)
            .setTop(25)
            .setWidth(336)
            .setHeight(160)
            .setCaption("Group1")
            , 'view1');

            t.Group1.attach(
            (new u.Button)
            .host(t,"Button16")
            .setLeft(96)
            .setTop(56)
            .setCaption("Close me")
            .onClick("_button16_onclick")
            );

            t.layout1.attach(
            (new u.Stacks)
            .host(t,"Stacks1")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"view1","caption":"alert"},{"id":"view2","caption":"MDI"},{"id":"view3","caption":"others"}])
            .setValue("view1")
            , 'before');

            t.Stacks1.attach(
            (new u.Button)
            .host(t,"Button3")
            .setLeft(40)
            .setTop(56)
            .setCaption("Modal")
            .onClick("_button3_onclick")
            , 'view2');

            t.Stacks1.attach(
            (new u.Button)
            .host(t,"Button2")
            .setLeft(24)
            .setTop(56)
            .setCaption("confirm")
            .onClick("_button2_onclick")
            , 'view1');

            t.Stacks1.attach(
            (new u.Button)
            .host(t,"Button4")
            .setLeft(40)
            .setTop(16)
            .setCaption("min")
            .onClick("_button4_onclick")
            , 'view3');

            t.Stacks1.attach(
            (new u.Button)
            .host(t,"Button5")
            .setLeft(40)
            .setTop(56)
            .setCaption("max")
            .onClick("_button5_onclick")
            , 'view3');

            t.Stacks1.attach(
            (new u.Button)
            .host(t,"Button6")
            .setLeft(40)
            .setTop(96)
            .setCaption("no max button")
            .onClick("_button6_onclick")
            , 'view3');

            t.Stacks1.attach(
            (new u.Button)
            .host(t,"Button9")
            .setLeft(40)
            .setTop(136)
            .setCaption("no min button")
            .onClick("_button9_onclick")
            , 'view3');

            t.Stacks1.attach(
            (new u.Button)
            .host(t,"Button10")
            .setLeft(40)
            .setTop(176)
            .setCaption("no pin button")
            .onClick("_button10_onclick")
            , 'view3');

            t.Stacks1.attach(
            (new u.Button)
            .host(t,"Button11")
            .setLeft(40)
            .setTop(216)
            .setCaption("can't move")
            .onClick("_button11_onclick")
            , 'view3');

            t.Stacks1.attach(
            (new u.Button)
            .host(t,"Button12")
            .setLeft(40)
            .setTop(256)
            .setCaption("can't resize")
            .onClick("_button12_onclick")
            , 'view3');

            t.Stacks1.attach(
            (new u.Button)
            .host(t,"Button1")
            .setLeft(24)
            .setTop(16)
            .setCaption("alert")
            .onClick("_button1_onclick")
            , 'view1');

            t.Stacks1.attach(
            (new u.Button)
            .host(t,"Button7")
            .setLeft(24)
            .setTop(96)
            .setCaption("pop")
            .onClick("_button7_onclick")
            , 'view1');

            t.Stacks1.attach(
            (new u.Button)
            .host(t,"Button8")
            .setLeft(40)
            .setTop(16)
            .setCaption("New window")
            .onClick("_button8_onclick")
            , 'view2');

            t.Stacks1.attach(
            (new u.Button)
            .host(t,"Button13")
            .setLeft(40)
            .setTop(296)
            .setCaption("No shadow")
            .onClick("_button13_onclick")
            , 'view3');

            return n;
            // ]]code created by designer
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