Class('VisualJS.AddFile', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the VisualJS
        required:["linb.UI.Dialog","linb.UI.TreeBar","linb.UI.PanelBar","linb.UI.Label","linb.UI.Input","linb.UI.Button","linb.UI.ComboInput"],

        customAttach:function(){
            var prop = this.properties;
            if(prop.fromRegion)
                this.dialog.setFromRegion(prop.fromRegion);
            this.dialog.setCaption(prop.caption).setIcon(prop.icon).setIconPos(prop.iconPos);

            if(!this.dialog.get(0).root)
                this.dialog.create();

            this.treebar.resetValue();
            this.input.resetValue();
            this.inputTarget.resetValue();
            this.comboinput.setValue('.js',true);

            //asy
            this.dialog.show(this.parent, true);

            var  arr = linb.UI.pickObj(prop.items||[]),f=function(o){
                var self=arguments.callee;
                o.filter(function(o,i){
                    var k=o.sub;
                    if(k)
                       self(o.sub);
                    if(k && !k.length)
                        delete o.sub;
                    return !!k;
                });
            };
            f(arr);
            this.treebar.clearItems().insertItems(arr);
        },
        _dialog_beforeclose:function(profile){
            this.dialog.hide();
            return false;
        },
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.dialog = (new linb.UI.Dialog)
            .alias("dialog").host(this)
            .onHotKeydown("_dialog_onhotkey")
            .setLeft(240).setTop(80).setWidth(430).setHeight(270).setResizable(false).setMinBtn(false).setMaxBtn(false).setPinBtn(false)
            .beforeClose("_dialog_beforeclose")
            ;
            this.nodes.push(this.dialog.get(0));

            this.btnCancel = (new linb.UI.Button)
            .alias("btnCancel").host(this)
            .setLeft(80).setTop(210).setWidth(90).setCaption("$VisualJS.cancel").setIcon("img/App.gif").setIconPos("-16px -16px")
            .onClick("_btncancel_onclick")
            ;
            this.dialog.attach(this.btnCancel);

            this.panelbar2 = (new linb.UI.PanelBar)
            .alias("panelbar2").host(this)
            .setDock("top").setHeight(140).setZIndex(1).setCaption("$VisualJS.addfile.sel").setCloseBtn(false).setLandBtn(false)
            ;
            this.dialog.attach(this.panelbar2);

            this.treebar = (new linb.UI.TreeBar)
            .alias("treebar").host(this)
            .setLeft(0).setTop(0).setItems([])
            .setIniFold(false)
            .onItemSelected("_treebar_onitemselected")
            ;
            this.panelbar2.attach(this.treebar);

            this.label4 = (new linb.UI.Label)
            .alias("label4").host(this)
            .setLeft(10).setTop(180).setWidth(70).setCaption("$VisualJS.addfile.target")
            ;
            this.dialog.attach(this.label4);

            this.label3 = (new linb.UI.Label)
            .alias("label3").host(this)
            .setLeft(230).setTop(150).setWidth(70).setCaption("$VisualJS.addfile.filetype")
            ;
            this.dialog.attach(this.label3);

            this.label1 = (new linb.UI.Label)
            .alias("label1").host(this)
            .setLeft(10).setTop(150).setWidth(70).setCaption("$VisualJS.addfile.filename")
            ;
            this.dialog.attach(this.label1);

            this.input = (new linb.UI.Input)
            .alias("input").host(this)
            .setLeft(80).setTop(150).setWidth(140).setValueFormat("^[\\w_]{2,9}$").setValidTips('$VisualJS.addfile.filenameformat')
            .afterValueUpdated("_input_aftervalueupdated")
            ;
            this.dialog.attach(this.input);

            this.comboinput = (new linb.UI.ComboInput)
            .alias("comboinput").host(this)
            .setValue(".js").setLeft(300).setTop(150).setWidth(110).setReadonly(true).setType("listbox").setItems([{"id":"/","caption":"$VisualJS.addfile.iDir"},{"id":".html","caption":"$VisualJS.addfile.iHtml"},{"id":".js","caption":"$VisualJS.addfile.iJs"},{"id":".php","caption":"$VisualJS.addfile.iPhp"}])

            .afterValueUpdated("_comboinput_aftervalueupdated")
            ;
            this.dialog.attach(this.comboinput);


            this.btnOK = (new linb.UI.Button)
            .alias("btnOK").host(this)
            .setLeft(250).setTop(210).setWidth(90).setCaption("$VisualJS.ok").setIcon("img/App.gif").setIconPos("-64px -16px")
            .onClick("_btnok_onclick")
            ;
            this.dialog.attach(this.btnOK);

            this.inputTarget = (new linb.UI.Input)
            .alias("inputTarget").host(this)
            .setLeft(80).setTop(180).setWidth(330).setReadonly(true)
            ;
            this.dialog.attach(this.inputTarget);
            return this.nodes;
            // ]]code creted by designer
        },
        _btncancel_onclick:function (profile, e, value) {
            this.dialog.close();
        },
        _result:function(){
            var s1=this.treebar.getUIValue(),
            s2=this.input.getUIValue(),
            s3=this.comboinput.getUIValue();
            if(s1&&s2&&s3)
                this.inputTarget.setValue(s1+'/'+s2+s3, true);
        },
        _comboinput_aftervalueupdated:function (profile, oldValue, newValue, showValue) {
            this._result();
        },
        _input_aftervalueupdated:function (profile, oldValue, newValue, showValue) {
            this._result();
        },
        _treebar_onitemselected:function (profile, item, src) {
            this._result();
        },
        _btnok_onclick:function (profile, e, value) {
            var s = this.inputTarget.getValue();
            if(!s){
                linb.message(linb.getStr('VisualJS.addfile.notarget'));
            }else{
                _.tryF(this.events.onOK, [this.treebar.getUIValue(), this.treebar.getUIValue(), this.input.getUIValue(), this.comboinput.getUIValue()], this.host);
                this.dialog.close();
            }
        },
        _dialog_onhotkey:function(profile, key, control, shift, alt){
            if(key=='esc')
                profile.boxing().close();
        }
    }
});