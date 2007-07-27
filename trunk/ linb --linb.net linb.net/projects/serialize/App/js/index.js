Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.coder","linb.UI.Group","linb.UI.Block","linb.UI.Button","linb.UI.Input","linb.UI.Tabs"],

        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.Group1 = (new linb.UI.Group)
            .alias("Group1").host(this)
            .setLeft(16).setTop(16).setWidth(776).setHeight(184).setCaption("(un)serialize 1")
            ;
            this.nodes.push(this.Group1.get(0));

            this.Block11 = (new linb.UI.Block)
            .alias("Block11").host(this)
            .setLeft(8).setTop(32).setWidth(152).setHeight(96).setBorder(true)
            ;
            this.Group1.attach(this.Block11);

            this.Button1 = (new linb.UI.Button)
            .alias("Button1").host(this)
            .setLeft(16).setTop(32).setCaption("Button")
            ;
            this.Block11.attach(this.Button1);

            this.Block12 = (new linb.UI.Block)
            .alias("Block12").host(this)
            .setLeft(616).setTop(32).setWidth(152).setHeight(96).setBorder(true)
            ;
            this.Group1.attach(this.Block12);

            this.Input1 = (new linb.UI.Input)
            .alias("Input1").host(this)
            .setLeft(290).setTop(8).setWidth(208).setHeight(144).setInputArea("textarea")
            ;
            this.Group1.attach(this.Input1);

            this.Button11 = (new linb.UI.Button)
            .alias("Button11").host(this)
            .setLeft(200).setTop(64).setWidth(48).setCaption(">>")
            .onClick("_button1_onclick")
            ;
            this.Group1.attach(this.Button11);

            this.Button12 = (new linb.UI.Button)
            .alias("Button12").host(this)
            .setLeft(528).setTop(64).setWidth(48).setCaption(">>")
            .onClick("_button12_onclick")
            ;
            this.Group1.attach(this.Button12);

            this.Group2 = (new linb.UI.Group)
            .alias("Group2").host(this)
            .setLeft(16).setTop(216).setWidth(776).setHeight(184).setCaption("(un)serialize 2")
            ;
            this.nodes.push(this.Group2.get(0));

            this.Button21 = (new linb.UI.Button)
            .alias("Button21").host(this)
            .setLeft(192).setTop(64).setWidth(64).setCaption(">>")
            .onClick("_button21_onclick")
            ;
            this.Group2.attach(this.Button21);

            this.Block22 = (new linb.UI.Block)
            .alias("Block22").host(this)
            .setLeft(616).setTop(32).setWidth(152).setHeight(96).setBorder(true)
            ;
            this.Group2.attach(this.Block22);

            this.Block21 = (new linb.UI.Block)
            .alias("Block21").host(this)
            .setLeft(8).setTop(32).setWidth(152).setHeight(96).setBorder(true)
            ;
            this.Group2.attach(this.Block21);

            this.Group7 = (new linb.UI.Group)
            .alias("Group7").host(this)
            .setLeft(0).setTop(0).setWidth(144).setHeight(88).setCaption("Group7")
            ;
            this.Block21.attach(this.Group7);

            this.Button14 = (new linb.UI.Button)
            .alias("Button14").host(this)
            .setLeft(8).setTop(16).setCaption("Button14")
            ;
            this.Group7.attach(this.Button14);

            this.Input2 = (new linb.UI.Input)
            .alias("Input2").host(this)
            .setLeft(288).setTop(8).setWidth(208).setHeight(144).setInputArea("textarea")
            ;
            this.Group2.attach(this.Input2);

            this.Button22 = (new linb.UI.Button)
            .alias("Button22").host(this)
            .setLeft(520).setTop(64).setWidth(64).setCaption(">>")
            .onClick("_button22_onclick")
            ;
            this.Group2.attach(this.Button22);

            this.Group3 = (new linb.UI.Group)
            .alias("Group3").host(this)
            .setLeft(16).setTop(408).setWidth(776).setHeight(184).setCaption("(un)serialize 3")
            ;
            this.nodes.push(this.Group3.get(0));

            this.Button31 = (new linb.UI.Button)
            .alias("Button31").host(this)
            .setLeft(192).setTop(64).setWidth(64).setCaption(">>")
            .onClick("_button31_onclick")
            ;
            this.Group3.attach(this.Button31);

            this.Block32 = (new linb.UI.Block)
            .alias("Block32").host(this)
            .setLeft(616).setTop(32).setWidth(152).setHeight(96).setBorder(true)
            ;
            this.Group3.attach(this.Block32);

            this.Block31 = (new linb.UI.Block)
            .alias("Block31").host(this)
            .setLeft(8).setTop(32).setWidth(152).setHeight(96).setBorder(true)
            ;
            this.Group3.attach(this.Block31);

            this.Tabs1 = (new linb.UI.Tabs)
            .alias("Tabs1").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"}]).setValue("view1")
            ;
            this.Block31.attach(this.Tabs1);

            this.button1 = (new linb.UI.Button)
            .alias("button1").host(this)
            .setLeft(17).setTop(17).setCaption("button1")
            ;
            this.Tabs1.attach(this.button1, 'view1');

            this.button2 = (new linb.UI.Button)
            .alias("button2").host(this)
            .setLeft(17).setTop(17).setCaption("button2")
            ;
            this.Tabs1.attach(this.button2, 'view2');

            this.Input3 = (new linb.UI.Input)
            .alias("Input3").host(this)
            .setLeft(288).setTop(8).setWidth(208).setHeight(144).setInputArea("textarea")
            ;
            this.Group3.attach(this.Input3);

            this.Button32 = (new linb.UI.Button)
            .alias("Button32").host(this)
            .setLeft(520).setTop(64).setWidth(64).setCaption(">>")
            .onClick("_button32_onclick")
            ;
            this.Group3.attach(this.Button32);
            return this.nodes;
            // ]]code creted by designer
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