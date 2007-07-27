Class('VisualJS.ObjectEditor', 'linb.Page',{
    Instance:{
        events:{
            afterCreated:function(page, threadid){
                _.asyCall('VisualJS.PageEditor' ,'show', [page.dialog, '',{
                    checkType:'js'
                },{}, page],
                false, threadid, function(){page.PageEditor=this});
            }
        },
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the VisualJS
        required:[
            "linb.UI.Dialog",
            "linb.UI.Panel",
            "linb.UI.Button",
            "VisualJS.ClassTool"
        ],
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
            var txt = this.PageEditor.getText(false);
            if(txt===false)return false;
            //check dirty
            if(this.properties.text != txt){
                //check first
                if(false === this.check(txt))return false;
                //parse comments and code, check code in the process
                this.properties.result = VisualJS.ClassTool.parseSingleBlock(txt);

                if(false === this.properties.result){
                    linb.message(linb.getStr('VisualJS.classtool.err1'));
                    return false;
                }

                //set back
                this.properties.text = txt;

                this.properties.object = _.unserialize(this.properties.text) || null;

                _.tryF(this.events.onOK,[this],this.host);
            }
            this.dialog.close();
        },

        customAttach:function(){
            var page=this;
            prop = page.properties;
            page.dialog.setCaption(prop.caption).setIcon(prop.icon).setIconPos(prop.iconPos);
            page.PageEditor.setText(prop.text);
            if(prop.fromRegion)
                page.dialog.setFromRegion(prop.fromRegion);

            if(!this.dialog.get(0).root)
                this.dialog.create();
            page.dialog.show(this.parent, true);

            return false;
        },
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];
            //
            // dialog
            //
            //new linb.UI.Dialog
            this.dialog = (new linb.UI.Dialog)
            //set name/host/template/appearance/behavior
            .alias("dialog").host(this)
            //set properties
            .setLeft(216).setTop(80).setWidth(500).setMaxBtn(false).setMinBtn(false)
            .beforeClose(this._dialog_beforeclose)
            ;
            //add dialog to node list
            this.nodes.push(this.dialog.get(0));
            //
            // panelB
            //
            //new linb.UI.Panel
            this.panelB = (new linb.UI.Panel)
            //set name/host/template/appearance/behavior
            .alias("panelB").host(this)
            //set properties
            .setDock("bottom").setHeight(35)
            ;
            //attach panelB to parent
            this.dialog.attach(this.panelB);
            //
            // panelR
            //
            //new linb.UI.Panel
            this.panelR = (new linb.UI.Panel)
            //set name/host/template/appearance/behavior
            .alias("panelR").host(this)
            //set properties
            .setDock("right").setWidth(284)
            ;
            //attach panelR to parent
            this.panelB.attach(this.panelR);
            //
            // btnCancel
            //
            //new linb.UI.Button
            this.btnCancel = (new linb.UI.Button)
            //set name/host/template/appearance/behavior
            .alias("btnCancel").host(this)
            //set properties
            .setLeft(64).setTop(8).setWidth("100").setCaption("Cancel").setIcon("img/App.gif").setIconPos("-16px -16px").onClick(this._btncancel_onclick)
            ;
            //attach btnCancel to parent
            this.panelR.attach(this.btnCancel);
            //
            // btnOK
            //
            //new linb.UI.Button
            this.btnOK = (new linb.UI.Button)
            //set name/host/template/appearance/behavior
            .alias("btnOK").host(this)
            //set properties
            .setLeft(176).setTop(8).setWidth("100").setCaption("OK").setIcon("img/App.gif").setIconPos("-64px -16px").onClick(this._btnok_onclick)
            ;
            //attach btnOK to parent
            this.panelR.attach(this.btnOK);
            //
            //
            return this.nodes;
            // ]]code creted by designer
        }
    }
});