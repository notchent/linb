/*
An editor for js class
*/
Class('VisualJS.ClassEditor', 'linb.Com',{
    Instance:{
        views:null,
        events:{
            afterCreated:function(page, threadid){
                var self=page;
                page.views={};
                linb.ComFactory.newCom('VisualJS.PageEditor',function(){
                    var inn=this;
                    inn.host = page;
                    inn.setProperties({
                        text:page.properties.text,
                        checkType:'js'
                    });
                    inn.setEvents('onValueChanged',function(ipage, profile, b, r){
                         _.tryF(page.events.onValueChanged, [page, ipage, self.properties.textO != r], page.host);
                    });
                    inn.show(null,page.buttonview,'normal');

                    page.views['normal']=inn
                },threadid);
            }
        },
        activate:function(){
            var self=this,t;
            if(!self.views) return;
            var view = self.buttonview.getUIValue();
            if(t=self.views[view])
                if(t.created)
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
            var self=this,
                p=self.properties;
            txt=txt.replace(/\r\n/g,'\n');

            //ini is page editor, no, don't get clsStruct/clsObject here
            p.textO = p.text=txt;
            p.clsStruct=p.clsObject=null;

            self.views[self.buttonview.getUIValue()].setText(txt, flag);

            return self;
        },
        resetEnv:function(text){
            var self=this,
                p=self.properties;
            if(!text)text=self.getText();
            p.clsStruct=p.clsObject=null;
            p.textO = p.text = text;

            self.views[self.buttonview.getUIValue()].resetEnv(text);
        },
        _buttonview_aftercreated:function(profile){
            profile.getSubNode('PANEL',true).setStyle({borderBottom:'0',borderLeft:'0',borderRight:'0'});
        },
        _buttonview_beforeValueUpdated:function(profile, ov, nv){
            var self=this,
                p=self.properties,
                t;
            if(!self.views) return;

            if((t=self.views[ov]) && t.created){
                var r = t.getText();
                if(false===r)
                    return false;
                else{
                    if(ov=='normal'){
                        //not a class
                        if(!VisualJS.ClassTool.isClassText(r)){
                            p.clsStruct=p.clsObject=null;
                            linb.message(linb.getRes('VisualJS.classtool.noClass'));
                            return false;
                        }
                    }
                    if(p.text != r || !p.clsStruct || !p.clsObject){
                        //try to get class struct
                        try{
                            p.clsStruct = VisualJS.ClassTool.getClassStruct(r);
                            p.clsObject = VisualJS.ClassTool.getClassObject(r);
                        }catch(e){
                            p.clsStruct = p.clsObject = null;
                            linb.message(linb.getRes('VisualJS.classEditor.codeerr',_.Error(e)));
                            return false;
                        }
                        p.text = r;
                    }
                    if(ov!='normal'){
                        //refresh old text and ..
                        var pp=t.properties;
                        pp.text=r;
                        pp.clsStruct = p.clsStruct;
                        pp.clsObject = p.clsObject;
                    }
                }
            }else
                return false;
        },
        _buttonview_onitemselected:function(profile, item, src){
            var self=this,
                p=self.properties,
                t;
            if(!self.views) return;

            //set text to after editor view
            if(!(t=self.views[item.id])){
                if(item.id=='struct')
                    linb.ComFactory.newCom('VisualJS.ClassStruct',function(){
                        this
                        .setHost(self)
                        .setProperties({
                            text:p.text,
                            clsStruct:p.clsStruct,
                            clsObject:p.clsObject
                        })
                        .setEvents({
                            onValueChanged:function(ipage, profile, b){
                                //need double check
                                _.tryF(self.events.onValueChanged, [this, ipage, (p.textO != p.text) || b], self.host);
                            }
                        });

                        this.show(null,self.buttonview,'struct');
                        self.views['struct']=this;
                    })
                else if(item.id=='design')
                    linb.ComFactory.newCom('VisualJS.Designer',function(){
                        this
                        .setHost(self)
                        .setProperties({
                            $design:p.$design,
                            text:p.text,
                            clsStruct:p.clsStruct,
                            clsObject:p.clsObject
                        })
                        .setEvents({
                            onValueChanged:function(ipage, profile, b){
                                //need double check
                                _.tryF(self.events.onValueChanged, [this, ipage,  (p.textO != p.text) || b], self.host);
                            }
                        });

                        this.show(null,self.buttonview,'design');
                        self.views['design']=this;
                    });
            }else{
                linb([src],false).UIAction(function(threadid){
                    if(t.created){
                        if(item.id=='struct' || item.id=='design'){
                            t.properties.clsStruct=p.clsStruct;
                            t.properties.clsObject=p.clsObject;
                        }
                        t.setText(p.text, false, threadid).activate();
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
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.ButtonViews)
            .host(t,"buttonview")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"normal","caption":"$VisualJS.classEditor.nv","icon":"img/App.gif","iconPos":"-80px -48px","tips":"$VisualJS.classEditor.nvtips"},{"id":"struct","caption":"$VisualJS.classEditor.sv","icon":"img/App.gif","iconPos":"-32px -48px","tips":"$VisualJS.classEditor.svtips"},{"id":"design","caption":"$VisualJS.classEditor.dv","icon":"img/App.gif","iconPos":"-192px -48px","tips":"$VisualJS.classEditor.dvtips"}])
            .setValue("normal")
            .setHandleSize("28")
            .beforeValueUpdated("_buttonview_beforeValueUpdated")
            .afterCreated("_buttonview_aftercreated")
            .onItemSelected("_buttonview_onitemselected")
            );

            return n;
            // ]]code created by designer
        }
    }
});