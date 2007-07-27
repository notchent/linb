/*
An editor for js class
*/
Class('VisualJS.ClassEditor', 'linb.Page',{
    Instance:{
        views:null,
        events:{
            afterCreated:function(page, threadid){
                var self=page;
                page.views={};
                _.asyCall('VisualJS.PageEditor' ,'show', [page.buttonview, 'normal',{
                    text:page.properties.text,
                    checkType:'js'
                },{
                    onValueChanged:function(ipage, profile, b, r){
                         _.tryF(page.events.onValueChanged, [page, ipage, self.properties.textO != r], page.host);
                    }
                }, page],
                false, threadid, function(){page.views['normal']=this});
            }
        },
        activate:function(){
            var t;
            if(!this.views) return;
            var view = this.buttonview.getUIValue();
            if(t=this.views[view])
                if(t.loaded)
                    t.activate();
        },
        beforeDestroy:function(){
             _.each(this.views,function(o){
                o.destroy();
            });
        },
        getText:function(){
            var view = this.buttonview.getUIValue();
            return this.views[view].getText();
        },
        setText:function(txt, flag){
            txt=txt.replace(/\r\n/g,'\n');
            //ini is page editor, no, don't get clsStruct/clsObject here
            this.properties.textO = this.properties.text=txt;
            this.properties.clsStruct=this.properties.clsObject=null;

            var view = this.buttonview.getUIValue();
            this.views[view].setText(txt, flag);

            return this;
        },
        resetEnv:function(text){
            if(!text)text=this.getText();
            this.properties.clsStruct=this.properties.clsObject=null;
            this.properties.textO = this.properties.text = text;
            var view = this.buttonview.getUIValue();
            this.views[view].resetEnv(text);
        },
        _buttonview_aftercreated:function(profile){
            profile.getSubNode(profile.keys.PANEL,true).setStyle({borderBottom:'0',borderLeft:'0',borderRight:'0'});
        },
        _buttonview_beforeValueUpdated:function(profile, ov, nv){
            var t;
            if(!this.views) return;

            if((t=this.views[ov]) && t.loaded){
                var r = t.getText();
                if(false===r)
                    return false;
                else{
                    if(ov=='normal'){
                        //not a class
                        if(!VisualJS.ClassTool.isClassText(r)){
                            this.properties.clsStruct=this.properties.clsObject=null;
                            linb.message(linb.getStr('VisualJS.classtool.noClass'));
                            return false;
                        }
                    }
                    if(this.properties.text != r || !this.properties.clsStruct || !this.properties.clsObject){
                        //try to get class struct
                        try{
                            this.properties.clsStruct = VisualJS.ClassTool.getClassStruct(r);
                            this.properties.clsObject = VisualJS.ClassTool.getClassObject(r);
                        }catch(e){
                            this.properties.clsStruct = this.properties.clsObject = null;
                            linb.message(linb.getStr('VisualJS.classEditor.codeerr',_.Error(e)));
                            return false;
                        }
                        this.properties.text = r;
                    }
                    if(ov!='normal'){
                        //refresh old text and ..
                        t.properties.text=r;
                        t.properties.clsStruct = this.properties.clsStruct;
                        t.properties.clsObject = this.properties.clsObject;
                    }
                }
            }
        },
        _buttonview_onitemselected:function(profile, item, src){
            var t;
            if(!this.views) return;

            //set text to after editor view
            if(!(t=this.views[item.id])){
                var self=this;
                if(item.id=='struct')
                    _.asyCall('VisualJS.ClassStruct' ,'show', [this.buttonview, 'struct',{
                        text:this.properties.text,
                        clsStruct:this.properties.clsStruct,
                        clsObject:this.properties.clsObject
                    },{
                        onValueChanged:function(ipage, profile, b){
                            //need double check
                            _.tryF(self.events.onValueChanged, [this, ipage, (self.properties.textO != self.properties.text) || b], self.host);
                        }
                    }, self],
                    false, null, function(){self.views['struct']=this});
                else if(item.id=='design')
                    _.asyCall('VisualJS.Designer' ,'show', [this.buttonview, 'design',{
                        $design:this.properties.$design,
                        text:this.properties.text,
                        clsStruct:this.properties.clsStruct,
                        clsObject:this.properties.clsObject
                    },{
                        onValueChanged:function(ipage, profile, b){
                            //need double check
                            _.tryF(self.events.onValueChanged, [this, ipage,  (self.properties.textO != self.properties.text) || b], self.host);
                        }
                    }, self],
                    false, null, function(){self.views['design']=this});
            }else{
                var self=this;
                linb([src],false).UIAction(function(threadid){
                    if(t.loaded){
                        if(item.id=='struct' || item.id=='design'){
                            t.properties.clsStruct=self.properties.clsStruct;
                            t.properties.clsObject=self.properties.clsObject;
                        }
                        t.setText(self.properties.text, false, threadid).activate();
                    }
                });
            }
        },
        base:['linb.UI'],
        required:[
            'linb.UI.Tabs',
            'linb.UI.ButtonViews',
            'VisualJS.ClassTool'
        ],
        parepareData:function(properties){
            properties.textO = properties.text;
        },
        iniComponents:function(){
            this.nodes = [];
            var self=this;
            // [[designer
            //

            //
            // buttonview
            //
            //new linb.UI.ButtonViews
            this.buttonview = new linb.UI.ButtonViews();
            //set name to buttonview
            this.buttonview.alias("buttonview");
            //set properties
            this.buttonview.host(this).setLeft(0).setTop(0).setItems([{
                    "id" : "normal",
                    caption : '$VisualJS.classEditor.nv',
                    'icon': 'img/App.gif',
                    "iconPos":"-80px -48px",
                    "tips":"$VisualJS.classEditor.nvtips"
                },
                {
                    "id" : "struct",
                    caption : '$VisualJS.classEditor.sv',
                    'icon': 'img/App.gif',
                    "iconPos":"-32px -48px",
                    "tips":"$VisualJS.classEditor.svtips"
                },
                {
                    "id" : "design",
                    caption : '$VisualJS.classEditor.dv',
                    'icon': 'img/App.gif',
                    "iconPos":"-192px -48px",
                    "tips":"$VisualJS.classEditor.dvtips"
                }
            ])
            .setValue('normal').setHandleSize("28")
            .beforeValueUpdated(this._buttonview_beforeValueUpdated)
            .onItemSelected(this._buttonview_onitemselected)
            .afterCreated(this._buttonview_aftercreated);
            //
            //add buttonview to parent node
            this.nodes.push(this.buttonview.get(0));

            // ]]designer

            return this.nodes;
        }
    }
});