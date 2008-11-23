/*
beforeCreated
onLoadBaseClass
onLoadResource
    loadResource (asy)
beforeIniComponents
    iniComponents (asy)
afterIniComponents
    iniExComs (asy)
onLoadReqiredClass
onReady
onRender
*/

Class('linb.Com',null,{
    Constructor:function(properties, events, host){
        var self=this;
        self._nodes=[];
        self.host=host||self;

        self.properties = properties || {};
        //copy those from class setting
        self.events = _.copy(self.events) || {};
        if(events)
            _.merge(self.events, events, 'all');
    },
    Instance:{
        setHost:function(value, alias){
            this.host=value;
            return value[alias]=this;
        },
        getHost:function(){
            return this.host;
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
        getProperties:function(key){
            return key?this.properties[key]:this.properties;
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
        getEvents:function(key){
            return key?this.events[key]:this.events;
        },

        _fireEvent:function(name, args){
            var t, self=this;
            if(t=self.events[name]){
                if(typeof t=='string')t=self.host[t];
                args=args||[];
                args.splice(0,0,self,self.threadid);
                self.$lastEvent=name;
                if(typeof t=='function')
                    return t.apply(self.host, args);
            }
        },
        _innerCall:function(name){
            var self=this;
            return _.tryF(self[name],[self.threadid],self);
        },
        show:function(onEnd,parent,subId,threadid){
            var self=this,f=function(){
                if(self.customAppend)
                    self.customAppend.call(self, parent,subId,threadid);
                else
                    (parent||linb('body')).append(self.getUIComponents(),subId);
                self._fireEvent('onRender');
                _.tryF(onEnd,[self, threadid],self.host);
            };
            self.threadid=threadid;
            
            if(self.created)
                f();
            else
                self.create(f,threadid);
        },
        create:function(onEnd, threadid){
            //get paras
            var self=this,
                suspend=linb.Thread.suspend,
                resume=linb.Thread.resume,
                t,funs=[]
                ;
            self.threadid=threadid;

            if(false===self._fireEvent('beforeCreated'))return;
            //if no threadid or threadid doesnt exist, reset threadid to self
            funs.push(function(threadid){
                self.threadid=threadid;
            });
            //base classes
            if((t=self.base) && t.length)
                funs.push(function(threadid){
                    suspend(threadid);
                    linb.SC.group(self.base,function(key){
                        self._fireEvent('onLoadBaseClass', [key]);
                    },function(){resume(threadid)});
                });
            //load resource here
            if(self.loadResource)
                funs.push(function(){
                    self._fireEvent('onLoadResource');
                    self._innerCall('loadResource');
                });
            //load required class
            if((t=self.required) && t.length)
                funs.push(function(threadid){
                    suspend(threadid);
                    linb.SC.group(self.required,function(key){
                        self._fireEvent('onLoadReqiredClass', [key]);
                    },function(){resume(threadid)});
                });
            //inner components
            if(self.iniComponents)
                funs.push(function(){
                    if(false===self._fireEvent('beforeIniComponents'))return;
                    Array.prototype.push.apply(self._nodes, self._innerCall('iniComponents')||[]);
                    self._fireEvent('afterIniComponents');
                });
            //Outer components
            if(self.iniExComs)
                funs.push(function(){
                    self._innerCall('iniExComs');
                });
            //core
            funs.push(function(threadid){
                self.loaded=true;
                //lazy load
                if(self.background)
                    linb.SC.background(self.background);
                self._fireEvent('onReady');
                _.tryF(onEnd,[self, threadid],self.host);
            });
            //use asyUI to insert tasks
            linb.Thread.observableRun(threadid, funs, function(){
                self.created=true;
            });
        },

        iniComponents:function(){},

//<<<todo:

        requestData:function(group, threadid, onEnd){
            var thread=linb.Thread;
            thread.observableRun(threadid, [function(t){
                //ensure busy/free order
                //if threadid is null, t is the real thread
                thread.suspend(threadid||t);
                linb.absIO.group(group, null, null, function(){
                    _.tryF(onEnd);
                    thread.resume(threadid||t);
                }).start();
            }]);
        },
        /* build order:
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
        composeUI:function(threadid, onEnd, flag){
            _.tryF(onEnd);
        },
        //fill data
        fillUI:function(threadid, onEnd, flag){
            _.tryF(onEnd);
        },
//>>>todo end



        getUIComponents:function(){
            var nodes = _.copy(this._nodes),t,k='linb.UI';
            _.filter(nodes,function(o){
                return !!(o.box[k] && !o.box.$noDomRoot);
            });
            return linb.UI.pack(nodes, false);
        },
        getComponents:function(){
            return linb.absObj.pack(_.copy(this._nodes),false);
        },
        setComponents:function(obj){
            var self=this,t;
            _.arr.each(self._nodes,function(o){
                if((t=self[o.alias]) &&t.get(0)==o)
                    delete self[o.alias];
            });
            _.arr.each(self._nodes=obj.get(),function(o){
                self[o.alias]=o.boxing();
            });
            return self;
        },
        destroy:function(threadid){
            var self=this;
            self.threadid=threadid;
            self._fireEvent('onDestroy');
            _.arr.each(self._nodes, function(o){
                if(o.box)
                    o.boxing().destroy();
            });
            self._nodes.length=0;
            _.breakO(self);
        }
    },
    Static:{
        load:function(cls, onEnd, lang, showUI){
            var fun=function(){
                //get app class
                linb.SC(cls,function(path){
                    //if successes
                    if(path){
                        var a=this,f=function(){
                            var o=new a();
                            if(showUI!==false)o.show(onEnd);
                            else _.tryF(onEnd,[o],o);
                        };
                        //get locale info
                        if(lang) linb.reLang(lang, f);
                        else f();
                    }else
                        throw new Error(cls+' doesnt exists!');
                },true);
            };
            if(linb.isDomReady)
                fun();
            else
                linb.main(fun);
        }
    }
});