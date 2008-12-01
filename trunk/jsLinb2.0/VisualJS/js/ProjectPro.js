Class('VisualJS.ProjectPro', 'linb.Com',{
    Instance:{
        customAppend:function(){
            var self=this,
                prop = self.properties;

            self.dialog.setCaption(prop.caption).setImage(prop.image).setImagePos(prop.imagePos);
            self.inputName.setValue(prop.projectName, true);
            self.inputClassName.setValue(prop.className, true);
            self._refreshLabel(prop.projectName);

            if(prop.fromRegion){
                self.dialog.setFromRegion(prop.fromRegion);
            }

            self.inputName.setDisabled(prop.readonly);
            self.inputClassName.setDisabled(prop.readonly);

            self.dialog.show(self.parent, true);
        },
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var t=this, n=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Dialog)
            .host(t,"dialog")
            .setLeft(100)
            .setTop(100)
            .setWidth(540)
            .setHeight(220)
            .setMinBtn(false)
            .setMaxBtn(false)
            .setResizer(false)
            .setCaption("dialog")
            .onHotKeydown("_dialog_onhotkey")
            .beforeClose("_dialog_beforeclose")
            );

            t.dialog.append(
            (new u.Input)
            .host(t,"inputName")
            .setLeft(126)
            .setTop(16)
            .setTipsErr("$VisualJS.projectPro.onlyword")
            .setValueFormat("^\\w{3,15}$")
            .afterUIValueSet("_inputname_aftervalueupdated")
            );

            t.dialog.append(
            (new u.Label)
            .host(t,"label1")
            .setLeft(14)
            .setTop(18)
            .setWidth(104)
            .setCaption("$VisualJS.projectPro.name")
            );

            t.dialog.append(
            (new u.Label)
            .host(t,"label3")
            .setLeft(30)
            .setTop(82)
            .setWidth(88)
            .setCaption("$VisualJS.projectPro.classfile")
            );

            t.dialog.append(
            (new u.Label)
            .host(t,"label5")
            .setLeft(38)
            .setTop(50)
            .setWidth(80)
            .setCaption("$VisualJS.projectPro.class")
            );

            t.dialog.append(
            (new u.Button)
            .host(t,"btnCancel")
            .setLeft(262)
            .setTop(152)
            .setWidth(90)
            .setTabindex("0")
            .setCaption("$VisualJS.cancel")
            .setImage('@CONF.img_app')
            .setImagePos("-16px -16px")
            .onClick("_btncancel_onclick")
            );

            t.dialog.append(
            (new u.Input)
            .host(t,"inputClassName")
            .setLeft(126)
            .setTop(48)
            .setValueFormat("^\\w{3,15}$")
            .setTipsErr("$VisualJS.projectPro.onlyword")
            );

            t.dialog.append(
            (new u.Label)
            .host(t,"label7")
            .setLeft(126)
            .setTop(114)
            .setWidth(384)
            .setHAlign("left")
            .setCaption("label7")
            );

            t.dialog.append(
            (new u.Label)
            .host(t,"label2")
            .setLeft(30)
            .setTop(114)
            .setWidth(88)
            .setCaption("$VisualJS.projectPro.pagefile")
            );

            t.dialog.append(
            (new u.Label)
            .host(t,"label8")
            .setLeft(126)
            .setTop(82)
            .setWidth(384)
            .setHAlign("left")
            .setCaption("label8")
            );

            t.dialog.append(
            (new u.Button)
            .host(t,"btnOK")
            .setLeft(374)
            .setTop(152)
            .setWidth(90)
            .setCaption("$VisualJS.ok")
            .setImage('@CONF.img_app')
            .setImagePos("-64px -16px")
            .onClick("_btnok_onclick")
            );

            return n;
            // ]]code created by jsLinb UI Builder
        },
        _dialog_beforeclose:function(profile){
            this.dialog.hide();
            return false;
        },
        _btncancel_onclick:function(){
            this.dialog.close();
        },
        _btnok_onclick:function(){
            var self=this;
            if(self.inputName.checkValid()===false ||
                self.inputClassName.checkValid()===false){
                    linb.message(linb.getRes('VisualJS.projectPro.invalid'));
                    return;
            }

            var pm = self.projectName = self.inputName.updateValue().getValue();
            self.className = self.inputClassName.updateValue().getValue();

            linb.request(CONF.phpPath,({
                key:CONF.requestKey,
                para:{
                    action:'new',
                    hashCode:_.id(),
                    path:this.projectName,
                    className: this.className
                }
            }),function(txt){
                var obj = typeof txt=='string'?_.unserialize(txt):txt;
                if(obj.error)
                    linb.message(obj.error.message);
                else
                    _.tryF(self.properties.onOK, ['projects/'+pm, obj.data], self.host);
                self.dialog.close();
            },function(txt){
                linb.message(txt);
            });
        },
        _inputname_aftervalueupdated:function(profile, oldValue,newValue){
            this._refreshLabel(newValue);
        },
        _refreshLabel:function(prjname, filename){
            var self=this;
            filename = filename || 'index';
            self.label7.setCaption(linb.ini.appPath+'projects/'+prjname +'/'+filename+'.html');
            self.label8.setCaption(linb.ini.appPath+'projects/'+prjname +'/VisualJS/js/'+filename+'.js');
        },
        _dialog_onhotkey:function(profile, key, control, shift, alt){
            if(key=='esc')
                profile.boxing().close();
        }
    }
});