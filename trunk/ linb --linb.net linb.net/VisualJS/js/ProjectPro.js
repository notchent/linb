/*
An editor for function
*/
Class('VisualJS.ProjectPro', 'linb.Page',{
    Instance:{
        requestKey:'VisualJS',

        base:['linb.UI'],
        required:[
            'linb.UI.Label',
            'linb.UI.Input',
            'linb.UI.Button',
            'linb.UI.Dialog'
        ],
        _dialog_beforeclose:function(profile){
            this.dialog.hide();
            return false;
        },
        _btncancel_onclick:function(){
            this.dialog.close();
        },
        _btnok_onclick:function(){
            if(this.inputName.checkUIValueValid()===false ||
                this.inputClassName.checkUIValueValid()===false){
                    linb.message(linb.getStr('VisualJS.projectPro.invalid'));
                    return;
            }


            var pm = this.projectName = this.inputName.updateValue().getValue();
            this.className = this.inputClassName.updateValue().getValue();

            var self = this;
            linb.request(VisualJS.config.phpPath,_.serialize({
                key:this.requestKey,
                para:{
                    action:'new',
                    hashCode:_.id(),
                    path:this.projectName,
                    className: this.className
                }
            }),function(txt){
                var obj = _.unserialize(txt);
                if(!obj || obj.error)
                    linb.message(txt);
                else
                    _.tryF(self.events.onOK, ['projects/'+pm, obj], self.host);
                self.dialog.close();
            },function(txt){
                linb.message(txt);
            });
        },
        _inputname_aftervaluechanged:function(profile, oldValue,newValue){
            this._refreshLabel(newValue);
        },
        _refreshLabel:function(prjname, filename){
            filename = filename || 'index';
            this.label7.setCaption(linb.ini.appPath+'projects/'+prjname +'/'+filename+'.html');
            this.label8.setCaption(linb.ini.appPath+'projects/'+prjname +'/VisualJS/js/'+filename+'.js');
        },
        parepareData:function(properties,events){
            properties.caption = properties.caption || 'Project properties';
            properties.projectName = properties.projectName || 'linbApp';
            properties.jsLINBPath = properties.jsLINBPath || '';
            properties.className = properties.className || 'App';
            properties.fromRegion = properties.fromRegion || null;
            properties.readonly = properties.readonly || false;
        },
        customAttach:function(){
            var prop = this.properties;

            this.dialog.setCaption(prop.caption).setIcon(prop.icon).setIconPos(prop.iconPos);
            this.inputName.setValue(prop.projectName, true);
            this.inputClassName.setValue(prop.className, true);
            this._refreshLabel(prop.projectName);

            if(prop.fromRegion){
                this.dialog.setFromRegion(prop.fromRegion);
            }
//todo:form widget
            this.inputName.setDisabled(prop.readonly);
            this.inputClassName.setDisabled(prop.readonly);

            this.dialog.show(this.parent, true);
        },
        iniComponents:function(){
            // [[designer
            this.nodes = [];

            this.dialog = (new linb.UI.Dialog)
            .alias("dialog").host(this)
            .setLeft(100).setTop(100).setWidth(540).setHeight(220).setMinBtn(false).setMaxBtn(false).setResizable(false)
            .onHotKeydown("_dialog_onhotkey")
            .beforeClose('_dialog_beforeclose');

            this.nodes.push(this.dialog.get(0));

            this.btnCancel = new linb.UI.Button();
            this.btnCancel.alias("btnCancel");
            this.btnCancel.host(this).setLeft(262).setTop(152).setWidth(90).setTabindex('0').setPosition("absolute").setCaption("$VisualJS.cancel").setIcon('img/App.gif').setIconPos("-16px -16px");
            this.btnCancel.onClick(this._btncancel_onclick);

            this.dialog.attach(this.btnCancel, null);

            this.label1 = (new linb.UI.Label)
            .alias("label1").host(this)
            .setLeft(14).setTop(18).setWidth(104).setVAlign("top").setCaption('$VisualJS.projectPro.name');

            this.dialog.attach(this.label1, null);

            this.inputName = new linb.UI.Input();
            this.inputName.alias("inputName");
            this.inputName.host(this).setLeft(126).setTop(16).setValidTips('$VisualJS.projectPro.onlyword').setValueFormat("^\\w{3,15}$").afterValueUpdated(this._inputname_aftervaluechanged);

            this.dialog.attach(this.inputName, null);

            this.label5 = new linb.UI.Label();
            this.label5.alias("label5");
            this.label5.host(this).setLeft(38).setTop(50).setWidth(80).setVAlign("top").setCaption('$VisualJS.projectPro.class');

            this.dialog.attach(this.label5, null);

            this.inputClassName = new linb.UI.Input();
            this.inputClassName.alias("inputClassName");
            this.inputClassName.host(this).setLeft(126).setTop(48).setValueFormat("^\\w{3,15}$").setValidTips('$VisualJS.projectPro.onlyword');

            this.dialog.attach(this.inputClassName, null);

            this.label2 = new linb.UI.Label();
            this.label2.alias("label2");
            this.label2.host(this).setLeft(30).setTop(114).setWidth(88).setVAlign("top").setCaption('$VisualJS.projectPro.pagefile');

            this.dialog.attach(this.label2, null);

            this.label3 = new linb.UI.Label();
            this.label3.alias("label3");
            this.label3.host(this).setLeft(30).setTop(82).setWidth(88).setVAlign("top").setCaption('$VisualJS.projectPro.classfile');

            this.dialog.attach(this.label3, null);

            this.label7 = new linb.UI.Label();
            this.label7.alias("label7");
            this.label7.host(this).setLeft(126).setTop(114).setWidth(384).setHAlign("left").setVAlign("top");

            this.dialog.attach(this.label7, null);

            this.label8 = new linb.UI.Label();
            this.label8.alias("label8");
            this.label8.host(this).setLeft(126).setTop(82).setWidth(384).setHAlign("left").setVAlign("top");

            this.dialog.attach(this.label8, null);


            this.btnOK = new linb.UI.Button();
            this.btnOK.alias("btnOK");
            this.btnOK.host(this).setLeft(374).setTop(152).setWidth(90).setPosition("absolute").setCaption("$VisualJS.ok").setIcon('img/App.gif').setIconPos("-64px -16px");
            this.btnOK.onClick(this._btnok_onclick);

            this.dialog.attach(this.btnOK, null);

            return this.nodes;

            // ]]designer
        },
        _dialog_onhotkey:function(profile, key, control, shift, alt){
            if(key=='esc')
                profile.boxing().close();
        }
    }
});