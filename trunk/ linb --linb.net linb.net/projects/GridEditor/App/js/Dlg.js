Class('App.Dlg', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Dialog","linb.UI.CheckBox","linb.UI.Input","linb.UI.Button","linb.UI.Div"],
        //prepare data
        parepareData:function(properties,events){
        },
        customAttach:function(){
            var prop = this.properties;
            if(prop.fromRegion)
                this.dialog.setFromRegion(prop.fromRegion);

            if(!this.dialog.get(0).root)
                this.dialog.create();

            this.col1.resetValue(prop.col1);
            this.col2.resetValue(prop.col2);
            this.col3.resetValue(prop.col3);

            //asy
            this.dialog.show(this.parent, true);
        },
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];
            
            this.dialog = (new linb.UI.Dialog)
            .alias("dialog").host(this)
            .setLeft(240).setTop(70).setHeight(170).setCaption("dialog").setWidth(350)
            .onHotKeydown("_dialog_onhotkey").beforeClose("_dialog_beforeclose")
            ;
            this.nodes.push(this.dialog.get(0));
            
            this.div13 = (new linb.UI.Div)
            .alias("div13").host(this)
            .setLeft(20).setTop(100).setWidth(300).setHeight(30).setHtml("Try to use 'Tab' to leave this dialog!")
            .setCustomAppearance({"KEY":"overflow:visible; "})
            ;
            this.dialog.attach(this.div13);
            
            this.btnOK = (new linb.UI.Button)
            .alias("btnOK").host(this)
            .setLeft(110).setTop(70).setCaption("OK").setTabindex("1")
            .onClick("_btnok_onclick")
            ;
            this.dialog.attach(this.btnOK);
            
            this.col1 = (new linb.UI.Input)
            .alias("col1").host(this)
            .setLeft(20).setTop(10).setTabindex("2")
            ;
            this.dialog.attach(this.col1);
            
            this.col2 = (new linb.UI.Input)
            .alias("col2").host(this)
            .setLeft(160).setTop(10).setValueFormat("^-?\\d\\d*$").setTabindex("3").setZIndex("3")
            ;
            this.dialog.attach(this.col2);
            
            this.col3 = (new linb.UI.CheckBox)
            .alias("col3").host(this)
            .setLeft(20).setTop(40).setCaption("col3").setTabindex("4")
            ;
            this.dialog.attach(this.col3);
            
            return this.nodes;
            // ]]code creted by designer
        },
        _btnok_onclick:function (profile, e, value) {
            _.tryF(this.events.onOK, [this.col1.getUIValue(), this.col2.getUIValue(), this.col3.getUIValue()], this.host);
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