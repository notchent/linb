/*
An editor for js jsLinb class
*/
Class('VisualJS.ClassEditor', 'linb.Com',{
    Instance:{
        $pageviewType:'linb.UI.ButtonViews',

        views:{},
        base:['linb.UI'],
        required:[
            'linb.UI.Tabs',
            'linb.UI.ButtonViews',
            'VisualJS.ClassTool'
        ],
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
            var self=this;
            txt=txt.replace(/\r\n/g,'\n');

            self.$data={
                textO:txt,
                text:txt,
                clsStruct:null,
                clsObject:null
            };

            return self;
        },
        showPage:function(key){
            this.buttonview.setUIValue(key,true);
        },
        resetEnv:function(text){
            var self=this,
                p=self.properties;
            if(!text)text=self.getText();
            p.clsStruct=p.clsObject=null;
            p.textO = p.text = text;

            self.views[self.buttonview.getUIValue()].resetEnv(text);
        },
        _beforeValueUpdated:function(profile, ov, nv){
            var self=this,
                t,str=self.$data.text;
console.log(nv,  self.views[nv])
            if(t=self.views[ov]){
                if(ov=='normal'){
                    //not a class
                    if(!VisualJS.ClassTool.isClassText(r)){
                        p.clsStruct=p.clsObject=null;
                        linb.message(linb.getRes('VisualJS.classtool.noClass'));
                        return false;
                    }
                }

                var r = t.getText();
                if(false===r)
                    return false;
                else{
                    if(false==self._adjustData(str=r))
                        return false;
                }
            }
            self.views[nv].setText(str);
        },
        _adjustData:function(str){
            var self=this,
                data=self.$data;
            try{
                data.clsStruct = VisualJS.ClassTool.getClassStruct(str);
                data.clsObject = VisualJS.ClassTool.getClassObject(str);
                data.text = str;
            }catch(e){
                data.clsStruct = data.clsObject = null;
                linb.message(linb.getRes('VisualJS.classEditor.codeerr',String(e)));
                return false;
            }
        },
        iniExComs:function(threadid){
            // [[code created by jsLinb UI Builder
            var self = this,
                data=self.$data;
                children = self._nodes,
                pageview = (new (linb.SC.get(self.$pageviewType)))
                    .host(self,"buttonview")
                    .setItems([{"id":"normal","caption":"$VisualJS.classEditor.nv","icon":'@CONF.img_app',"iconPos":"-80px -48px","tips":"$VisualJS.classEditor.nvtips"},{"id":"struct","caption":"$VisualJS.classEditor.sv","icon":'@CONF.img_app',"iconPos":"-32px -48px","tips":"$VisualJS.classEditor.svtips"},{"id":"design","caption":"$VisualJS.classEditor.dv","icon":'@CONF.img_app',"iconPos":"-192px -48px","tips":"$VisualJS.classEditor.dvtips"}])
                    .beforeUIValueSet("_beforeValueUpdated")

            if(self.$pageviewType=='linb.UI.ButtonViews')
                pageview.setBarSize(28);

            children.push(pageview.get(0));

            linb.ComFactory.newCom('VisualJS.PageEditor',function(threadid){
                var inn=this;
                inn.host = self;
                inn.$data=data;
                inn.setEvents('onValueChanged',function(ipage, profile, b, r){
                     _.tryF(self.events.onValueChanged, [self, ipage, b], self.host);
                });
                inn.create(function(o,threadid){
                    self.buttonview.append(inn.getUIComponents(),'normal');
console.log('normal page created')
                },threadid);
                self.views['normal']=inn
            },threadid);
            linb.ComFactory.newCom('VisualJS.ClassStruct',function(threadid){
                var inn=this;
                inn.host = self;
                inn.$data=data;
                inn.setEvents('onValueChanged',function(ipage, profile, b, r){
                     _.tryF(self.events.onValueChanged, [self, ipage, (data.textO != data.text) || b], self.host);
                });
                inn.create(function(o,threadid){
                    self.buttonview.append(inn.getUIComponents(),'struct');
console.log('struct page created')
                },threadid);
                self.views['struct']=inn;
            },threadid);
            linb.ComFactory.newCom('VisualJS.Designer',function(){
                var inn=this;
                inn.host = self;
                inn.$data=data;
                inn.setEvents('onValueChanged',function(ipage, profile, b, r){
                     _.tryF(self.events.onValueChanged, [self, ipage, (data.textO != datap.text) || b], self.host);
                });
                inn.create(function(o,threadid){
                    self.buttonview.append(inn.getUIComponents(),'struct');
console.log('desinger page created')
                },threadid);
                self.views['design']=this;
            },threadid);

        }
    }
});
