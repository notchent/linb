/*
beforeShow
beforeCreated
onLoadBaseClass
onLoadResource
    loadResource (asy)
beforeIniComponents
    iniComponents (asy)
afterIniComponents
    iniExComs (asy)
onLoadWidgets
onReady
afterCreated
    iniUI (asy)
afterShow
*/

Class('linb.Com',null,{
    Constructor:function(){
        var self=this;
        self._nodes=[];
        self.host=self;
        self.properties = self.properties || {};
        self.events = self.events||{}
    },
    Instance:{
        setHost:function(h){
            this.host=h;
            return this;
        },
        setProperties:function(key,value){
            var self=this;
            if(!key)
                self.properties={};
            else if(typeof key=='string')
                self.properties[key]=value;
            else
                _.merge(self.properties, key, 'all');
            return self;
        },
        setEvents:function(key,value){
            var self=this;
            if(!key)
                self.events={};
            else if(typeof key=='string')
                self.events[key]=value;
            else
                _.merge(self.events, key, 'all');
            return self;
        },

        fireEvent:function(name, args){
            var t, self=this;
            if(t=self.events[name]){
                if(typeof t=='string')t=self.host[t];
                args=args||[];
                args.splice(0,0,self,self.threadid);
                if(typeof t=='function')t.apply(self.host, args);
            }
        },
        innerCall:function(name){
            var self=this;
            _.tryF(self[name],[self.threadid],self);
        },
        show:function(onEnd,parent,showId,threadid){
            var self=this;
            self.threadid=threadid;
            self.fireEvent('beforeShow');
            self.create(function(){
                if(self.customAttach)
                    self.customAttach.call(self, parent,showId,threadid);
                else
                    (parent||linb([document.body])).attach(self.getUIObj(),showId);
                _.tryF(onEnd,[threadid]);
                self.fireEvent('afterShow');
            },threadid);
        },
        create:function(onEnd, threadid){
            //get paras
            var self=this,
                suspend=linb.thread.suspend,
                resume=linb.thread.resume,
                t,funs=[]
                ;
            self.threadid=threadid;

            self.fireEvent('beforeCreated');
            //base classes
            if((t=self.base) && t.length)
                funs.push(function(threadid){
                    suspend(threadid);
                    linb.SC.group(self.base,function(key){
                        self.fireEvent('onLoadBaseClass', [key]);
                    },function(){resume(threadid)});
                });
            //load resource here
            if(self.loadResource)
                funs.push(function(){
                    self.fireEvent('onLoadResource');
                    self.innerCall('loadResource');
                });
            //load required class
            if((t=self.required) && t.length)
                funs.push(function(threadid){
                    suspend(threadid);
                    linb.SC.group(self.required,function(key){
                        self.fireEvent('onLoadWidgets', [key]);
                    },function(){resume(threadid)});
                });
            //build inner components
            if(self.iniComponents)
                funs.push(function(){
                    self.fireEvent('beforeIniComponents');
                    self.innerCall('iniComponents');
                    self.fireEvent('afterIniComponents');
                });
            //build Outer components
            if(self.iniExComs)
                funs.push(function(){
                    self.innerCall('iniExComs');
                });
            //core
            funs.push(function(threadid){
                self.loaded=true;
                //lazy load
                if(self.background)
                    linb.SC.background(self.background);
                self.fireEvent('onReady');
                _.tryF(onEnd,[self, threadid],self.host);
                self.fireEvent('afterCreated');
            });

            //build Outer components
            if(self.iniUI)
                funs.push(function(){
                    self.innerCall('iniUI');
                });

            //use asyUI to insert tasks
            linb.thread.asyUI(threadid, funs);
        },

        //for overwrite
        iniComponents:function(){
            return this._nodes;
        },
        requestData:function(group, threadid, onEnd){
            var thread=linb.thread;
            thread.asyUI(threadid, [function(t){
                //ensure busy/free order
                //if threadid is null, t is the real thread
                thread.suspend(threadid||t);
                linb.io.group(group, null, null, function(){
                    _.tryF(onEnd);
                    thread.resume(threadid||t);
                }).start();
            }]);
        },

        //
        clean:function(){
            this.properties = {};
            this.events = {};
            this.getUIObj().clean();
        },
        /* build thread:
        +-----------+
        |  +-------+|
        |  |  +---+||
        |a |ab|abc|||
        |  |  +---+||
        |  +-------+|
        +-----------+
        1.thread start
        2.build a UI
            build ab UI
                build abc UI
        3.fill a data
            fill ab data
                fill abc data
        4.thread end
        */
        //buid UI
        build:function(threadid, onEnd, flag){
            _.tryF(onEnd);
        },
        //fill data
        fillData:function(threadid, onEnd, flag){
            _.tryF(onEnd);
        },

        getUIObj:function(){
            var nodes = this._nodes.copy();
            nodes.filter(function(o){
                return !!o.box.hasDomRoot;
            });
            return linb.UI.pack(nodes, false);
        },
        detach:function(index){
            if(this._nodes)
                this.getUIObj().detach();
            return this;
        },
        reBoxing:function(){
            return this.getUIObj().reBoxing();
        },
        attachTo:function(obj, key){
            obj.attach(this.getUIObj(), key);
        },
        destroy:function(threadid){
            var self=this;
            self.threadid=threadid;
            self.fireEvent('beforeDestroy');
            linb.UI.pack(self._nodes,false).destroy();
            self._nodes.length=0;
            _.breakO(self);
        }
    },
    Static:{
        EventHandlers:{
            beforeShow:function(){},
            beforeCreated:function(){},
            onLoadBaseClass:function(key){},
            onLoadResource:function(){},
            beforeIniComponents:function(){},
            afterIniComponents:function(){},
            onLoadWidgets:function(key){},
            onReady:function(){},
            afterCreated:function(){},
            afterShow:function(){}
        },
        load:function(cls,onEnd,lang,flag){
            //after dom ready
            linb.main(function(){
                //get app class
                linb.SC(cls,function(){
                    var a=this,f=function(){
                        if(flag!==false)
                            (new a()).show();
                        _.tryF(onEnd);
                    };
                    //get locale info
                    if(lang) linb.reLang(lang, f);
                    else f();
                },true);
            });
        }
    }

});