Class('VisualJS.ObjectEditor', 'linb.Com',{
    Instance:{
        iniExComs:function(threadid){
            var self=this;
            linb.ComFactory.newCom('VisualJS.PageEditor',function(){
                var inn=this;
                inn.host = self;
                inn.setProperties({
                    checkType:'js'
                });
                inn.show(null,self.dialog,null,threadid);

                self.PageEditor=inn;
            },threadid);
        },
        check:function(txt){
            return this.PageEditor.check(txt);
        },
        _dialog_beforeclose:function(profile){
            this.dialog.hide();
            return false;
        },
        _btncancel_onclick:function(){
            this.dialog.close();
        },
        _btnok_onclick:function(){
            var self=this,
                prop=self.properties,
                txt = self.PageEditor.getText(false);
            if(txt===false)return false;
            //check dirty
            if(prop.text != txt){
                //check first
                if(false === self.check(txt))return false;
                //parse comments and code, check code in the process
                prop.result = VisualJS.ClassTool.parseSingleBlock(txt);

                if(false === prop.result){
                    linb.message(linb.getRes('VisualJS.classtool.err1'));
                    return false;
                }

                //set back
                prop.text = txt;

                prop.object = _.unserialize(prop.text) || null;

                _.tryF(prop.onOK,[self],self.host);
            }
            self.dialog.close();
        },

        customAttach:function(parent){
            var page=this,
                prop = page.properties,
                dlg=page.dialog;
            dlg.setCaption(prop.caption).setIcon(prop.icon).setIconPos(prop.iconPos);
            page.PageEditor.setText(prop.text);
            if(prop.fromRegion)
                dlg.setFromRegion(prop.fromRegion);

            if(!dlg.get(0).root)
                dlg.create();
            dlg.show(parent, true);

            return false;
        },
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Dialog)
            .host(t,"dialog")
            .setLeft(216)
            .setTop(80)
            .setWidth(500)
            .setMaxBtn(false)
            .setMinBtn(false)
            .setCaption("dialog")
            .beforeClose("_dialog_beforeclose")
            );

            t.dialog.attach(
            (new u.Panel)
            .host(t,"panelB")
            .setDock("bottom")
            .setHeight(35)
            );

            t.panelB.attach(
            (new u.Panel)
            .host(t,"panelR")
            .setDock("right")
            .setWidth(284)
            );

            t.panelR.attach(
            (new u.Button)
            .host(t,"btnCancel")
            .setLeft(64)
            .setTop(8)
            .setWidth("100")
            .setCaption("Cancel")
            .setIcon("img/App.gif")
            .setIconPos("-16px -16px")
            .onClick("_btncancel_onclick")
            );

            t.panelR.attach(
            (new u.Button)
            .host(t,"btnOK")
            .setLeft(176)
            .setTop(8)
            .setWidth("100")
            .setCaption("OK")
            .setIcon("img/App.gif")
            .setIconPos("-64px -16px")
            .onClick("_btnok_onclick")
            );

            return n;
            // ]]code created by designer
        }
    }
});