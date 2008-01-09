Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.coder","linb.UI.Group","linb.UI.Block","linb.UI.Button","linb.UI.Input","linb.UI.Tabs"],

        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Group)
            .host(t,"Group1")
            .setLeft(16)
            .setTop(16)
            .setWidth(776)
            .setHeight(184)
            .setCaption("(un)serialize 1")
            );

            t.Group1.attach(
            (new u.Input)
            .host(t,"Input1")
            .setLeft(290)
            .setTop(8)
            .setWidth(208)
            .setHeight(144)
            .setInputArea("textarea")
            );

            t.Group1.attach(
            (new u.Block)
            .host(t,"Block12")
            .setLeft(616)
            .setTop(32)
            .setWidth(152)
            .setHeight(96)
            .setBorder(true)
            );

            t.Group1.attach(
            (new u.Button)
            .host(t,"Button11")
            .setLeft(200)
            .setTop(60)
            .setWidth(48)
            .setCaption(">>")
            .onClick("_button1_onclick")
            );

            t.Group1.attach(
            (new u.Block)
            .host(t,"Block11")
            .setLeft(8)
            .setTop(32)
            .setWidth(152)
            .setHeight(96)
            .setBorder(true)
            );

            t.Block11.attach(
            (new u.Button)
            .host(t,"Button1")
            .setLeft(16)
            .setTop(32)
            .setCaption("Button")
            );

            t.Group1.attach(
            (new u.Button)
            .host(t,"Button12")
            .setLeft(528)
            .setTop(64)
            .setWidth(48)
            .setCaption(">>")
            .onClick("_button12_onclick")
            );

            f(
            (new u.Group)
            .host(t,"Group2")
            .setLeft(16)
            .setTop(216)
            .setWidth(776)
            .setHeight(184)
            .setCaption("(un)serialize 2")
            );

            t.Group2.attach(
            (new u.Block)
            .host(t,"Block21")
            .setLeft(8)
            .setTop(32)
            .setWidth(152)
            .setHeight(96)
            .setBorder(true)
            );

            t.Block21.attach(
            (new u.Group)
            .host(t,"Group7")
            .setLeft(0)
            .setTop(0)
            .setWidth(144)
            .setHeight(88)
            .setCaption("Group7")
            );

            t.Group7.attach(
            (new u.Button)
            .host(t,"Button14")
            .setLeft(8)
            .setTop(16)
            .setCaption("Button14")
            );

            t.Group2.attach(
            (new u.Block)
            .host(t,"Block22")
            .setLeft(616)
            .setTop(32)
            .setWidth(152)
            .setHeight(96)
            .setBorder(true)
            );

            t.Group2.attach(
            (new u.Input)
            .host(t,"Input2")
            .setLeft(288)
            .setTop(8)
            .setWidth(208)
            .setHeight(144)
            .setInputArea("textarea")
            );

            t.Group2.attach(
            (new u.Button)
            .host(t,"Button21")
            .setLeft(192)
            .setTop(64)
            .setWidth(64)
            .setCaption(">>")
            .onClick("_button21_onclick")
            );

            t.Group2.attach(
            (new u.Button)
            .host(t,"Button22")
            .setLeft(520)
            .setTop(64)
            .setWidth(64)
            .setCaption(">>")
            .onClick("_button22_onclick")
            );

            f(
            (new u.Group)
            .host(t,"Group3")
            .setLeft(16)
            .setTop(408)
            .setWidth(776)
            .setHeight(184)
            .setCaption("(un)serialize 3")
            );

            t.Group3.attach(
            (new u.Block)
            .host(t,"Block31")
            .setLeft(8)
            .setTop(32)
            .setWidth(152)
            .setHeight(96)
            .setBorder(true)
            );

            t.Block31.attach(
            (new u.Tabs)
            .host(t,"Tabs1")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"}])
            .setValue("view1")
            );

            t.Tabs1.attach(
            (new u.Button)
            .host(t,"button1")
            .setLeft(17)
            .setTop(17)
            .setCaption("button1")
            , 'view1');

            t.Tabs1.attach(
            (new u.Button)
            .host(t,"button2")
            .setLeft(17)
            .setTop(17)
            .setCaption("button2")
            , 'view2');

            t.Group3.attach(
            (new u.Block)
            .host(t,"Block32")
            .setLeft(616)
            .setTop(32)
            .setWidth(152)
            .setHeight(96)
            .setBorder(true)
            );

            t.Group3.attach(
            (new u.Input)
            .host(t,"Input3")
            .setLeft(288)
            .setTop(8)
            .setWidth(208)
            .setHeight(144)
            .setInputArea("textarea")
            );

            t.Group3.attach(
            (new u.Button)
            .host(t,"Button31")
            .setLeft(192)
            .setTop(64)
            .setWidth(64)
            .setCaption(">>")
            .onClick("_button31_onclick")
            );

            t.Group3.attach(
            (new u.Button)
            .host(t,"Button32")
            .setLeft(520)
            .setTop(64)
            .setWidth(64)
            .setCaption(">>")
            .onClick("_button32_onclick")
            );

            return n;
            // ]]code created by designer
        },
        _button1_onclick:function (profile, e, value) {
            this.Input1.setValue(linb.coder.decode(_.serialize(this.Button1.get(0))),true)
        },
        _button12_onclick:function (profile, e, value) {
            this.Block12.empty();
            this.Block12.attach(linb.create(
                _.unserialize(this.Input1.getUIValue())
            ));
        },
        _button21_onclick:function (profile, e, value) {
            this.Input2.setValue(linb.coder.decode(_.serialize(this.Block21.get(0).children)),true)
        },
        _button31_onclick:function (profile, e, value) {
            this.Input3.setValue(linb.coder.decode(_.serialize(this.Block31.get(0).children)),true)
        },
        _button22_onclick:function (profile, e, value) {
            this.Block22.empty();
            this.Block22.attach(linb.create(
                _.unserialize(this.Input2.getUIValue())
            ));
        },
        _button32_onclick:function (profile, e, value) {
            this.Block32.empty();
            this.Block32.attach(linb.create(
                _.unserialize(this.Input3.getUIValue())
            ));
        }
    }
});