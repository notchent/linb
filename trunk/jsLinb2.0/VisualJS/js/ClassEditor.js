/*
An editor for js jsLinb class
*/
Class('VisualJS.ClassEditor', 'linb.Com',{
    Instance:{
        $pageviewType:'linb.UI.ButtonViews',
        $firstView:"normal",

        views:{},
        base:['linb.UI'],
        required:[
            'linb.UI.Tabs',
            'linb.UI.ButtonViews',
            'VisualJS.ClassTool'
        ],
        events:{
            onReady:function(com, threadid){
                com._loadSubBlock(com.$firstView,threadid)
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
        onDestroy:function(){
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
        _onrender:function(profile){
            profile.getSubNode('PANEL',true).css({borderBottom:'0',borderLeft:'0',borderRight:'0'});
        },
        _beforeValueUpdated:function(profile, ov, nv){
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
                            linb.message(linb.getRes('VisualJS.classEditor.codeerr',String(e)));
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
        _onitemselected:function(profile, item){
            this._loadSubBlock(item.id);
        },
        _loadSubBlock:function(subId,threadid){
            var self=this,
                p=self.properties,
                t;
            if(!self.views) return;

            //set text to after editor view
            if(!(t=self.views[subId])){
                if(subId=='normal'){
                    linb.ComFactory.newCom('VisualJS.PageEditor',function(threadid){
                        var inn=this;
                        inn.host = self;
                        inn.setProperties({
                            text:p.text,
                            checkType:'js'
                        })
                        .setEvents('onValueChanged',function(ipage, profile, b, r){
                             _.tryF(self.events.onValueChanged, [self, ipage, b], self.host);
                        });
     
                        inn.create(function(o,threadid){
                            self.buttonview.append(inn.getUIComponents(),'normal');
                        },threadid);
                        
                        self.views['normal']=inn
                    },threadid);
                }else if(subId=='struct'){
                    linb.ComFactory.newCom('VisualJS.ClassStruct',function(threadid){
alert(p.text);
                        var inn=this;
                        inn.host = self;
                        inn.setProperties({
                            text:p.text,
                            clsStruct:p.clsStruct,
                            clsObject:p.clsObject
                        })
                        .setEvents('onValueChanged',function(ipage, profile, b, r){
                             _.tryF(self.events.onValueChanged, [self, ipage, (p.textO != p.text) || b], self.host);
                        });
                        inn.create(function(o,threadid){
                            self.buttonview.append(inn.getUIComponents(),'struct');
                        },threadid);
                        self.views['struct']=inn;
                    })
                }else if(subId=='design'){
                    linb.ComFactory.newCom('VisualJS.Designer',function(){
                        var inn=this;
                        inn.host = self;
                        ini.setProperties({
                            $design:p.$design,
                            text:p.text,
                            clsStruct:p.clsStruct,
                            clsObject:p.clsObject
                        })
                        .setEvents('onValueChanged',function(ipage, profile, b, r){
                             _.tryF(self.events.onValueChanged, [self, ipage, (p.textO != p.text) || b], self.host);
                        });
                        inn.create(function(o,threadid){
                            self.buttonview.append(inn.getUIComponents(),'struct');
                        },threadid);
                        self.views['design']=this;
                    });
                }
            }else{
                _.observableRun(function(threadid){
                    if(t.created){
                        if(subId=='struct' || subId=='design'){
                            t.properties.clsStruct=p.clsStruct;
                            t.properties.clsObject=p.clsObject;
                        }
                        t.setText(p.text, false, threadid).activate();
                    }
                });
            }
        },

        parepareData:function(properties){
            properties.textO = properties.text;
        },
        iniExComs:function(){
            // [[code created by jsLinb UI Builder
            var host = this,
                children = host._nodes,
                pageview = (new (linb.SC.get(host.$pageviewType)))
                    .host(host,"buttonview")
                    .setItems([{"id":"normal","caption":"$VisualJS.classEditor.nv","icon":'@CONF.img_app',"iconPos":"-80px -48px","tips":"$VisualJS.classEditor.nvtips"},{"id":"struct","caption":"$VisualJS.classEditor.sv","icon":'@CONF.img_app',"iconPos":"-32px -48px","tips":"$VisualJS.classEditor.svtips"},{"id":"design","caption":"$VisualJS.classEditor.dv","icon":'@CONF.img_app',"iconPos":"-192px -48px","tips":"$VisualJS.classEditor.dvtips"}])
                    .beforeUIValueSet("_beforeValueUpdated")
                    .onRender("_onrender")
                    .onItemSelected("_onitemselected")
                    .setValue(host.$firstView)

            if(host.$pageviewType=='linb.UI.ButtonViews')
                pageview.setBarSize(28);

            children.push(pageview.get(0));
        }
    }
});
