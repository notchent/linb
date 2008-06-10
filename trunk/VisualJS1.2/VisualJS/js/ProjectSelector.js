
Class('VisualJS.ProjectSelector', 'linb.Com',{
    Instance:{
        customAttach:function(){
            var self=this,
                dlg=self.dialog,
                prop = self.properties;
            dlg.setCaption(prop.caption).setIcon(prop.icon).setIconPos(prop.iconPos);
            self.listName.setUIValue('').setItems([]);
            if(prop.fromRegion)
                dlg.setFromRegion(prop.fromRegion);
            dlg.show(self.parent, true);

            linb.dom.setCover(linb.getRes('VisualJS.ps.getting'));
            linb.request(CONF.phpPath, ({
                    key:CONF.requestKey,
                    para:{
                        action:'open',
                        hashCode:_.id(),
                        path:'projects',
                        deep:'0'
                    }
                }),
                function(txt){
                    var obj = typeof txt=='string'?_.unserialize(txt):txt;
                    if(!arr || arr.error)
                        linb.message(txt);
                    else{
                        arr=arr.data;
                        if(arr && arr.length){
                            self.properties.projectList=[];
                            arr.each(function(i){
                                if(i.type===0){
                                    self.properties.projectList.push({id:i.location,caption:i.name})
                                }
                            });
                        }
                        self.listName.setItems(prop.projectList);
                        linb.dom.setCover(false);
                    }
                },
                function(){
                    linb.dom.setCover(false);
                }
            );
        },
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Dialog)
            .host(t,"dialog")
            .setLeft(100)
            .setTop(100)
            .setWidth(340)
            .setHeight(190)
            .setMinBtn(false)
            .setMaxBtn(false)
            .setResizable(false)
            .setCaption("dialog")
            .onHotKeydown("_dialog_onhotkey")
            .beforeClose("_dialog_beforeclose")
            );

            t.dialog.attach(
            (new u.List)
            .host(t,"listName")
            .setDock("top")
            .setHeight(120)
            .setItems([])
            );

            t.dialog.attach(
            (new u.Button)
            .host(t,"btnCancel")
            .setLeft(140)
            .setTop(130)
            .setWidth(90)
            .setZIndex("1")
            .setCaption("$VisualJS.cancel")
            .setIcon('@CONF.img_app')
            .setIconPos("-16px -16px")
            .onClick("_btncancel_onclick")
            );

            t.dialog.attach(
            (new u.Button)
            .host(t,"btnOK")
            .setLeft(230)
            .setTop(130)
            .setWidth(90)
            .setZIndex("1")
            .setCaption("$VisualJS.ok")
            .setIcon('@CONF.img_app')
            .setIconPos("-64px -16px")
            .onClick("_btnok_onclick")
            );

            return n;
            // ]]code created by designer
        },
        _btncancel_onclick:function(){
            this.dialog.close();
        },
        _btnok_onclick:function(){
            var self=this,
                pm = self.projectName = self.listName.getUIValue();

            if(!self.projectName){
                linb.message(linb.getRes('VisualJS.ps.noselected'));
                return;
            }

            linb.request(CONF.phpPath,({
                key:CONF.requestKey,
                para:{
                    action:'open',
                    hashCode:_.id(),
                    path:this.projectName
                } 
            }),function(txt){
                var obj = typeof txt=='string'?_.unserialize(txt):txt;
                if(!obj || obj.error)
                    linb.message(txt);
                else
                    _.tryF(self.properties.onOK, [pm, obj.data], self.host);
                self.dialog.close();
            });
        },
        _dialog_beforeclose:function(profile){
            this.dialog.hide();
            return false;
        },
        _dialog_onhotkey:function(profile, key, control, shift, alt){
            if(key=='esc')
                profile.boxing().close();
        }
    }
});