Class('App.Dlg', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Dialog","linb.UI.CheckBox","linb.UI.Input","linb.UI.Button","linb.UI.Div"],
        //prepare data
        customAttach:function(){
            var self=this,
                prop = this.properties;
            if(prop.fromRegion)
                self.dialog.setFromRegion(prop.fromRegion);

            if(!self.dialog.get(0).root)
                self.dialog.create();

            self.col1.resetValue(prop.col1);
            self.col2.resetValue(prop.col2);
            self.col3.resetValue(prop.col3);

            //asy
            self.dialog.show(self.parent, true);
        },
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Dialog)
            .host(t,"dialog")
            .setLeft(240)
            .setTop(80)
            .setHeight(170)
            .setCaption("dialog")
            .setWidth(350)
            .onHotKeydown("_dialog_onhotkey")
            .beforeClose("_dialog_beforeclose")
            );

            t.dialog.attach(
            (new u.Div)
            .host(t,"div13")
            .setLeft(20)
            .setTop(100)
            .setWidth(300)
            .setHeight(30)
            .setHtml("Try to use 'Tab' to leave this dialog!")
            .setCustomAppearance({"KEY":"overflow:visible; "})
            );

            t.dialog.attach(
            (new u.Button)
            .host(t,"btnOK")
            .setLeft(110)
            .setTop(70)
            .setCaption("OK")
            .setTabindex("1")
            .onClick("_btnok_onclick")
            );

            t.dialog.attach(
            (new u.Input)
            .host(t,"col1")
            .setLeft(20)
            .setTop(10)
            .setTabindex("2")
            );

            t.dialog.attach(
            (new u.Input)
            .host(t,"col2")
            .setLeft(160)
            .setTop(10)
            .setValueFormat("^-?\\d\\d*$")
            .setTabindex("3")
            .setZIndex("3")
            );

            t.dialog.attach(
            (new u.CheckBox)
            .host(t,"col3")
            .setLeft(20)
            .setTop(40)
            .setCaption("col3")
            .setTabindex("4")
            );

            return n;
            // ]]code created by designer
        },
        _btnok_onclick:function (profile, e, value) {
            _.tryF(this.events.onOK, [this.col1.getUIValue(), this.col2.getUIValue(), this.col3.getUIValue()], this.$parent);
            this.dialog.close();
        },
        _dialog_beforeclose:function (profile) {
            profile.boxing().hide();
            return false;
        },
        _dialog_onhotkey:function(profile, key, control, shift, alt){
            if(key=='esc')
                profile.boxing().close();
        }
    }
});