Class('VisualJS.AddFile', 'linb.Com',{
    Instance:{
        customAppend:function(parent){
            var self=this,
                dlg=self.dialog,
                prop = self.properties,
                pp = prop.parent;

            if(prop.fromRegion)
                dlg.setFromRegion(prop.fromRegion);
            
            if(!dlg.get(0).renderId)
                dlg.render();
            
            self.treebar.resetValue();
            self.input.resetValue();
            self.inputTarget.resetValue();
            self.comboinput.setValue('.js',true);
            
            //asy
            dlg.show(parent, true);
            
            linb.request(CONF.phpPath,  {
                key:CONF.requestKey,
                para:{
                    action:'open',
                    hashCode:_.id(),
                    type:'0',
                    path:pp.curProject
                }
            } ,function(txt){
                var obj = typeof txt=='string'?_.unserialize(txt):txt;
                if(!obj || obj.error)
                    linb.message(_.get(obj,['error','message'])||'on response!');
                else{
                    var root=pp.buildFileItems(pp.curProject, obj.data);
                    self.treebar.setItems([root]).openToNode(root.id);
                }
            });
        },
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append(
                (new linb.UI.Dialog)
                .setHost(host,"dialog")
                .setLeft(240)
                .setTop(80)
                .setWidth(430)
                .setHeight(280)
                .setResizer(false)
                .setCaption("$VisualJS.tool2.new")
                .setImage("@CONF.img_app")
                .setImagePos("-0px -16px")
                .setMinBtn(false)
                .setMaxBtn(false)
                .onHotKeydown("_dialog_onhotkey")
                .beforeClose("_dialog_beforeclose")
            );
            
            host.dialog.append(
                (new linb.UI.Button)
                .setHost(host,"btnCancel")
                .setLeft(80)
                .setTop(210)
                .setWidth(90)
                .setCaption("$VisualJS.cancel")
                .setImage("@CONF.img_app")
                .setImagePos("-16px -16px")
                .onClick("_btncancel_onclick")
            );
            
            host.dialog.append(
                (new linb.UI.Label)
                .setHost(host,"label4")
                .setLeft(10)
                .setTop(180)
                .setWidth(70)
                .setCaption("$VisualJS.addfile.target")
            );
            
            host.dialog.append(
                (new linb.UI.ComboInput)
                .setHost(host,"comboinput")
                .setLeft(300)
                .setTop(150)
                .setWidth(110)
                .setType("listbox")
                .setItems([{"id":"/", "caption":"$VisualJS.addfile.iDir"}, {"id":".html", "caption":"$VisualJS.addfile.iHtml"}, {"id":".css", "caption":"$VisualJS.addfile.iCSS"}, {"id":".js", "caption":"$VisualJS.addfile.iJs"}, {"id":".php", "caption":"$VisualJS.addfile.iPhp"}])
                .setValue(".js")
                .afterUIValueSet("_refresh")
            );
            
            host.dialog.append(
                (new linb.UI.Group)
                .setHost(host,"panelbar2")
                .setDock("top")
                .setHeight(140)
                .setCaption("$VisualJS.addfile.sel")
                .setToggleBtn(false)
                .setCustomStyle({"PANEL":"overflow:auto"})
            );
            
            host.panelbar2.append(
                (new linb.UI.TreeBar)
                .setHost(host,"treebar")
                .setDock("none")
                .setWidth("auto")
                .setHeight("auto")
                .setPosition("relative")
                .onGetContent("_treebar_ongetcontent")
                .onItemSelected("_refresh")
            );
            
            host.dialog.append(
                (new linb.UI.Label)
                .setHost(host,"label1")
                .setLeft(10)
                .setTop(150)
                .setWidth(70)
                .setCaption("$VisualJS.addfile.filename")
            );
            
            host.dialog.append(
                (new linb.UI.Button)
                .setHost(host,"btnOK")
                .setLeft(250)
                .setTop(210)
                .setWidth(90)
                .setCaption("$VisualJS.ok")
                .setImage("@CONF.img_app")
                .setImagePos("-64px -16px")
                .onClick("_btnok_onclick")
            );
            
            host.dialog.append(
                (new linb.UI.Label)
                .setHost(host,"label3")
                .setLeft(230)
                .setTop(150)
                .setWidth(70)
                .setCaption("$VisualJS.addfile.filetype")
            );
            
            host.dialog.append(
                (new linb.UI.Input)
                .setHost(host,"input")
                .setLeft(80)
                .setTop(150)
                .setWidth(140)
                .setTipsErr("$VisualJS.addfile.filenameformat")
                .setValueFormat("^[\\w_]{2,18}$")
                .afterUIValueSet("_refresh")
            );
            
            host.dialog.append(
                (new linb.UI.Input)
                .setHost(host,"inputTarget")
                .setReadonly(true)
                .setLeft(80)
                .setTop(180)
                .setWidth(330)
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        },
        _dialog_beforeclose:function(profile){
            this.dialog.hide();
            return false;
        },
        _btncancel_onclick:function (profile, e, value) {
            this.dialog.close();
        },
        _refresh:function(){
            var self=this,
                s1=self.treebar.getUIValue(),
                s2=self.input.getUIValue(),
                s3=self.comboinput.getUIValue()
                ;
            if(s1&&s2&&s3)
                self.inputTarget.setValue(s1+'/'+s2+s3, true);
            return false;
        },
        _btnok_onclick:function (profile, e, value) {
            var self=this,
                s = self.inputTarget.getValue();
            if(!s){
                linb.message(linb.getRes('VisualJS.addfile.notarget'));
            }else{
                _.tryF(self.properties.onOK, [self.treebar.getUIValue(), self.treebar.getUIValue(), self.input.getUIValue(), self.comboinput.getUIValue()], self.host);
                self.dialog.close();
            }
        },
        _dialog_onhotkey:function(profile, key){
            if(key.key=='esc')
                profile.boxing().close();
        },
        _treebar_ongetcontent : function (profile, item, callback) {
            var ns=this;
            linb.request(CONF.phpPath,({
                key:CONF.requestKey,
                para:{
                    action:'open',
                    type:'0',
                    hashCode:_.id(),
                    path:item.id
                }
            }),function(txt){
                var obj = typeof txt=='string'?_.unserialize(txt):txt;
                if(obj && !obj.error){
                    var root = ns.properties.parent.buildFileItems(item.id, obj.data);
                    callback(root.sub);
                }else linb.message(obj.error.message);
            });
        }
    }
});