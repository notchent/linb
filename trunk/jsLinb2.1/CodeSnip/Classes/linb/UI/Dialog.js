Class('App.linb_UI_Dialog', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Layout","linb.UI.Stacks","linb.UI.Button","linb.UI.Dialog","linb.UI.Block","linb.UI.Div","linb.UI.Tabs","linb.UI.Group"],
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host = this,
                children = [],
                append = function(child){
                    children.push(child.get(0))
                };
            
            append((new linb.UI.Block)
                .host(host,"Block2")
                .setDock("top")
                .setHeight(32)
                .setBorder(true)
            );
            
            host.Block2.append((new linb.UI.Div)
                .host(host,"Div3")
                .setLeft(16)
                .setTop(5)
                .setWidth(96)
                .setHeight(24)
                .setHtml("<b>Dialog demo</b>")
            );
            
            append((new linb.UI.Layout)
                .host(host,"layout1")
                .setLeft("0")
                .setTop("0")
                .setItems([{"id":"before","pos":"before","locked":false,"size":200,"min":50,"max":400,"cmd":true,"hide":false},{"id":"main","min":10}])
                .setType("horizontal")
            );
            
            host.layout1.append((new linb.UI.Dialog)
                .host(host,"Dialog1")
                .setLeft(80)
                .setTop(70)
                .setWidth(408)
                .setHeight(264)
                .setCaption("Dialog")
            , 'main');
            
            host.Dialog1.append((new linb.UI.Tabs)
                .host(host,"Tabs1")
                .setLeft(0)
                .setTop(0)
                .setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3"},{"id":"view4","caption":"view4"}])
                .setValue("view2")
            );
            
            host.Tabs1.append((new linb.UI.Group)
                .host(host,"Group1")
                .setLeft(33)
                .setTop(25)
                .setWidth(336)
                .setHeight(160)
                .setCaption("Group1")
            , 'view1');
            
            host.Group1.append((new linb.UI.Button)
                .host(host,"Button16")
                .setLeft(96)
                .setTop(56)
                .setCaption("Close me")
                .onClick("_button16_onclick")
            );
            
            host.layout1.append((new linb.UI.Stacks)
                .host(host,"Stacks1")
                .setLeft(0)
                .setTop(0)
                .setItems([{"id":"view1","caption":"alert"},{"id":"view2","caption":"MDI"},{"id":"view3","caption":"others"}])
                .setValue("view1")
            , 'before');
            
            host.Stacks1.append((new linb.UI.Button)
                .host(host,"Button4")
                .setLeft(40)
                .setTop(16)
                .setCaption("min")
                .onClick("_button4_onclick")
            , 'view3');
            
            host.Stacks1.append((new linb.UI.Button)
                .host(host,"Button2")
                .setLeft(24)
                .setTop(56)
                .setCaption("confirm")
                .onClick("_button2_onclick")
            , 'view1');
            
            host.Stacks1.append((new linb.UI.Button)
                .host(host,"Button5")
                .setLeft(40)
                .setTop(56)
                .setCaption("max")
                .onClick("_button5_onclick")
            , 'view3');
            
            host.Stacks1.append((new linb.UI.Button)
                .host(host,"Button6")
                .setLeft(40)
                .setTop(96)
                .setCaption("no max button")
                .onClick("_button6_onclick")
            , 'view3');
            
            host.Stacks1.append((new linb.UI.Button)
                .host(host,"Button9")
                .setLeft(40)
                .setTop(136)
                .setCaption("no min button")
                .onClick("_button9_onclick")
            , 'view3');
            
            host.Stacks1.append((new linb.UI.Button)
                .host(host,"Button10")
                .setLeft(40)
                .setTop(176)
                .setCaption("no pin button")
                .onClick("_button10_onclick")
            , 'view3');
            
            host.Stacks1.append((new linb.UI.Button)
                .host(host,"Button11")
                .setLeft(40)
                .setTop(216)
                .setCaption("can't move")
                .onClick("_button11_onclick")
            , 'view3');
            
            host.Stacks1.append((new linb.UI.Button)
                .host(host,"Button12")
                .setLeft(40)
                .setTop(256)
                .setCaption("can't resize")
                .onClick("_button12_onclick")
            , 'view3');
            
            host.Stacks1.append((new linb.UI.Button)
                .host(host,"Button1")
                .setLeft(24)
                .setTop(16)
                .setCaption("alert")
                .onClick("_button1_onclick")
            , 'view1');
            
            host.Stacks1.append((new linb.UI.Button)
                .host(host,"Button7")
                .setLeft(24)
                .setTop(96)
                .setCaption("pop")
                .onClick("_button7_onclick")
            , 'view1');
            
            host.Stacks1.append((new linb.UI.Button)
                .host(host,"Button8")
                .setLeft(40)
                .setTop(16)
                .setCaption("New window")
                .onClick("_button8_onclick")
            , 'view2');
            
            host.Stacks1.append((new linb.UI.Button)
                .host(host,"Button3")
                .setLeft(40)
                .setTop(56)
                .setCaption("Modal")
                .onClick("_button3_onclick")
            , 'view2');
            
            host.Stacks1.append((new linb.UI.Button)
                .host(host,"Button13")
                .setLeft(40)
                .setTop(296)
                .setCaption("No shadow")
                .onClick("_button13_onclick")
            , 'view3');
            
            return children;
            // ]]code created by jsLinb UI Builder
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
                fromRegion:profile.root.cssRegion(true)})
            .show()
        },
        _button3_onclick:function (profile, e, value) {
            var rnd = 100 + Math.random()*200;
            new linb.UI.Dialog({caption:'Modal',left:rnd, top:rnd, width:200, height:300}).show(linb('body'),true)
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
            new linb.UI.Dialog({resizer:false}).show(this.layout1.getPanel('main'))
        },
        _button13_onclick:function (profile, e, value) {
            new linb.UI.Dialog({shadow:false}).show(this.layout1.getPanel('main'))
        },
        _button16_onclick:function (profile, e, value) {
            this.Dialog1.destroy();
        }
    }
});