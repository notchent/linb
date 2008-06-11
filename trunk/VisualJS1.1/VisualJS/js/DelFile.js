 Class('VisualJS.DelFile', 'linb.Com',{
    Instance:{
        customAttach:function(parent){
            var self=this,
                prop = self.properties,
                dlg=self.dialog;
            if(prop.fromRegion)
                dlg.setFromRegion(prop.fromRegion);
            dlg.setCaption(prop.caption).setIcon(prop.icon).setIconPos(prop.iconPos);

            if(!dlg.get(0).root)
                dlg.create();

            self.treebar.resetValue();

            //asy
            dlg.show(parent, true);

            var arr = linb.UI.pickObj(prop.items),
                f=function(o){
                    var self=arguments.callee;
                    o.filter(function(o,i){
                        delete o.group;
                        if(o.sub && o.sub.length)
                           self(o.sub);
                    });
                };
            f(arr);
            self.treebar.clearItems().insertItems(arr);
        },
        _dialog_beforeclose:function(profile){
            this.dialog.hide();
            return false;
        },
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Dialog)
            .host(t,"dialog")
            .setLeft(247)
            .setTop(120)
            .setWidth(433)
            .setHeight(210)
            .setResizable(false)
            .setMinBtn(false)
            .setMaxBtn(false)
            .setPinBtn(false)
            .setCaption("dialog")
            .onHotKeydown("_dialog_onhotkey")
            .beforeClose("_dialog_beforeclose")
            );

            t.dialog.attach(
            (new u.Button)
            .host(t,"btnCancel")
            .setLeft(80)
            .setTop(150)
            .setWidth(90)
            .setCaption("$VisualJS.cancel")
            .setIcon('@CONF.img_app')
            .setIconPos("-16px -16px")
            .onClick("_btncancel_onclick")
            );

            t.dialog.attach(
            (new u.Button)
            .host(t,"btnOK")
            .setLeft(250)
            .setTop(150)
            .setWidth(90)
            .setCaption("$VisualJS.ok")
            .setIcon('@CONF.img_app')
            .setIconPos("-64px -16px")
            .onClick("_btnok_onclick")
            );

            t.dialog.attach(
            (new u.PanelBar)
            .host(t,"panelbar2")
            .setDock("top")
            .setHeight(140)
            .setZIndex(1)
            .setCaption("$VisualJS.delfile.sel")
            .setCloseBtn(false)
            .setLandBtn(false)
            );

            t.panelbar2.attach(
            (new u.TreeBar)
            .host(t,"treebar")
            .setDock('none')
            .setPosition('relative')
            .setItems([])
            .setIniFold(false)
            .setSelMode("multi")
            .beforeValueUpdated("_treebar_beforevalueupdated")
            .onItemSelected("_treebar_onitemselected")
            );

            return n;
            // ]]code created by designer
        },
        _btncancel_onclick:function (profile, e, value) {
            this.dialog.close();
        },
        _btnok_onclick:function (profile, e, value) {
            var s = this.treebar.getUIValue(), self=this;;
            if(!s){
                linb.message(linb.getRes('VisualJS.delfile.notarget'));
            }else{
                linb.UI.Dialog.confirm(linb.getRes('VisualJS.delfile.confirmdel'), linb.getRes('VisualJS.delfile.confirmdel2', s.split(';').length), function(){
                    _.tryF(self.properties.onOK, [s], self.host);
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