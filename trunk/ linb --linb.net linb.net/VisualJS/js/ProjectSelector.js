/*
An editor for function
*/
Class('VisualJS.ProjectSelector', 'linb.Page',{
    Instance:{
        requestKey:'VisualJS',

        base:['linb.UI'],
        required:[
            'linb.UI.List',
            'linb.UI.Button',
            'linb.UI.Dialog'
        ],
        _btncancel_onclick:function(){
            this.dialog.close();
        },
        _btnok_onclick:function(){
            var pm = this.projectName = this.listName.getUIValue();

            if(!this.projectName){
                linb.message(linb.getStr('VisualJS.ps.noselected'));
                return;
            }

            var self = this;
            linb.request(VisualJS.config.phpPath,_.serialize({
                key:this.requestKey,
                para:{
                    action:'open',
                    hashCode:_.id(),
                    path:this.projectName
                }
            }),function(txt){
                var obj = _.unserialize(txt);
                if(!obj || obj.error)
                    linb.message(txt);
                else
                    _.tryF(self.events.onOK, [pm, obj], self.host);
                self.dialog.close();
            });
        },
        _dialog_beforeclose:function(profile){
            this.dialog.hide();
            return false;
        },
        parepareData:function(properties,events){
            properties.caption = properties.caption || 'Select a project to open';
            properties.fromRegion = properties.fromRegion || null;
        },
        customAttach:function(){
            var self=this;
            var prop = self.properties;
            self.dialog.setCaption(prop.caption).setIcon(prop.icon).setIconPos(prop.iconPos);
            self.listName.setUIValue('').setItems([]);
            if(prop.fromRegion)
                self.dialog.setFromRegion(prop.fromRegion);
            self.dialog.show(self.parent, true);

            linb.dom.setCover(linb.getStr('VisualJS.ps.getting'));
            linb.request(VisualJS.config.phpPath, _.serialize({
                    key:this.requestKey,
                    para:{
                        action:'open',
                        hashCode:_.id(),
                        path:'projects',
                        deep:'0'
                    }
                }),
                function(txt){
                    var arr = _.unserialize(txt);
                    if(!arr || arr.error)
                        linb.message(txt);
                    else{
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
            // [[designer
            this.nodes = [];

            this.dialog = new linb.UI.Dialog();
            this.dialog.alias("dialog");
            this.dialog.host(this).setLeft(100).setTop(100).setWidth(340).setHeight(190).setMinBtn(false).setMaxBtn(false).setResizable(false)
            .onHotKeydown("_dialog_onhotkey")
            .beforeClose('_dialog_beforeclose');
            ;

            this.nodes.push(this.dialog.get(0));

            this.listName = new linb.UI.List();
            this.listName.alias("listName");
            this.listName.host(this).setLeft(0).setTop(0).setDock('top').setHeight(120).setItems([]).setListKey('');

            this.dialog.attach(this.listName, null);

            this.btnCancel = new linb.UI.Button();
            this.btnCancel.alias("btnCancel");
            this.btnCancel.host(this).setLeft(140).setTop(130).setWidth(90).setZIndex("1").setPosition("absolute").setCaption("$VisualJS.cancel").setIcon('img/App.gif').setIconPos("-16px -16px");
            this.btnCancel.onClick(this._btncancel_onclick);

            this.dialog.attach(this.btnCancel, null);

            this.btnOK = new linb.UI.Button();
            this.btnOK.alias("btnOK");
            this.btnOK.host(this).setLeft(230).setTop(130).setWidth(90).setZIndex("1").setPosition("absolute").setCaption("$VisualJS.ok").setIcon('img/App.gif').setIconPos("-64px -16px");
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