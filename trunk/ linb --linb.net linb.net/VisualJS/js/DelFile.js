 Class('VisualJS.DelFile', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the VisualJS
        required:["linb.UI.Dialog","linb.UI.TreeBar","linb.UI.PanelBar","linb.UI.Button"],
        //show widgets to parent node
        parepareData:function(properties,events){
            properties.items = properties.items||[];
        },
        customAttach:function(){
            var prop = this.properties;
            if(prop.fromRegion)
                this.dialog.setFromRegion(prop.fromRegion);
            this.dialog.setCaption(prop.caption).setIcon(prop.icon).setIconPos(prop.iconPos);

            if(!this.dialog.get(0).root)
                this.dialog.create();

            this.treebar.resetValue();

            //asy
            this.dialog.show(this.parent, true);

            var  arr = linb.UI.pickObj(prop.items),f=function(o){
                var self=arguments.callee;
                o.filter(function(o,i){
                    delete o.group;
                    if(o.sub && o.sub.length)
                       self(o.sub);
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
            .setLeft(247).setTop(120).setWidth(433).setHeight(210).setResizable(false).setMinBtn(false).setMaxBtn(false).setPinBtn(false)
            .beforeClose("_dialog_beforeclose")
            ;
            this.nodes.push(this.dialog.get(0));

            this.btnCancel = (new linb.UI.Button)
            .alias("btnCancel").host(this)
            .setLeft(80).setTop(150).setWidth(90).setCaption("$VisualJS.cancel").setIcon("img/App.gif").setIconPos("-16px -16px")
            .onClick("_btncancel_onclick")
            ;
            this.dialog.attach(this.btnCancel);

            this.btnOK = (new linb.UI.Button)
            .alias("btnOK").host(this)
            .setLeft(250).setTop(150).setWidth(90).setCaption("$VisualJS.ok").setIcon("img/App.gif").setIconPos("-64px -16px")
            .onClick("_btnok_onclick")
            ;
            this.dialog.attach(this.btnOK);

            this.panelbar2 = (new linb.UI.PanelBar)
            .alias("panelbar2").host(this)
            .setDock("top").setHeight(140).setZIndex(1).setCaption("$VisualJS.delfile.sel").setCloseBtn(false).setLandBtn(false)
            ;
            this.dialog.attach(this.panelbar2);

            this.treebar = (new linb.UI.TreeBar)
            .alias("treebar").host(this)
            .setLeft(0).setTop(0).setItems([])
            .setIniFold(false).setSelMode("multi")
            .beforeValueUpdated("_treebar_beforevalueupdated").onItemSelected("_treebar_onitemselected")
            ;
            this.panelbar2.attach(this.treebar);
            return this.nodes;
            // ]]code creted by designer
        },
        _btncancel_onclick:function (profile, e, value) {
            this.dialog.close();
        },
        _btnok_onclick:function (profile, e, value) {
            var s = this.treebar.getUIValue(), self=this;;
            if(!s){
                linb.message(linb.getStr('VisualJS.delfile.notarget'));
            }else{
                linb.UI.Dialog.confirm(linb.getStr('VisualJS.delfile.confirmdel'), linb.getStr('VisualJS.delfile.confirmdel2', s.split(';').length), function(){
                    _.tryF(self.events.onOK, [s], self.host);
                    self.dialog.close();
                });
            }
        },
        _treebar_beforevalueupdated:function (profile, oldValue, newValue, showValue) {
            var arr = newValue.split(';');
            arr.sort();
            arr.filter(function(o,j){
                for(var i=0,l=this.length;i<l;i++){
                    if(i==j)break;
                    if(this[j].startWith(this[i]))
                        return false;
                }
            });
            return arr.join(';');
        },
        _dialog_onhotkey:function(profile, key, control, shift, alt){
            if(key=='esc')
                profile.boxing().close();
        }
    }
});