//Base
new function(){
    //Profile
    Class('linb.Profile','linb.iProfile',{
        Instance:{
            /*
            box:null,
            $id:null,
            alias:null,
            properties:null,
            */
            /*handle memory links
            o:hash or array
            id:link id
            target: link object
            */
            //set/get events
            setEvents:function(events){
                _.merge(this,events,'all');
                return this;
            },
            getEvents:function(){
                var self=this, t,hash={};
                _.each(self.box.$EventHandlers,function(o,i){
                    if(self[i])hash[i]=self[i];
                });
                return hash;
            },
            //run something after set
            _applySetAction:function(fun, value){
                return fun.call(this,value);
            },
            //garbage collection
            $gc:function(){
                this.antiAllLinks().resetCache();
                _.breakO(this);
            },
            resetCache:_.fun(),
            destroy:_.fun(),
            //default no _nodes
            boxing:function(){return this;},

            beforeSerialized:function(){
                var t,
                    self = this,
                    o = (t=self.box.beforeSerialized)?t(self):self,
                    r={
                        alias:o.alias,
                        key:o.key
                    };
                //hose
                if(o.host)r.host='$this$';
                //appearance behavior and template
                if(o.appearance && o.appearance!='default')r.appearance = o.appearance;
                if(o.behavior && o.behavior._id!='default')r.behavior = o.behavior._id;
                if(o.template && o.template._id!='default')r.template = o.template._id;

                //properties
                var c={}, p=o.box.$DataStruct, map=linb.Base.$specialChars;
                _.merge(c,o.properties, function(o,i){return (i in p) &&  p[i]!==o && !map[i.charAt(0)]});
                if(!_.isEmpty(c))r.properties=c;

                //events
                if(!_.isEmpty(t=this.getEvents()))r.events=t;
                var eh = o.box.$EventHandlers;
                _.filter(r.events, function(o,i){
                    return o!=eh[i];
                });
                if(_.isEmpty(r.events))delete r.events;

                if(!_.isEmpty(o.CA)) r.CA=_.copy(o.CA);
                if(!_.isEmpty(o.CB)) r.CB=_.copy(o.CB);
                if(!_.isEmpty(o.CC)) r.CC=_.copy(o.CC);
                if(!_.isEmpty(o.CF)) r.CF=_.copy(o.CF);

                //children
                if(o.children && o.children.length){
                    r.children=o.children;
                    r.children.sort(function(x,y){
                        x=parseInt(x[0].properties.tabindex);y=parseInt(y[0].properties.tabindex);
                        return x>y?1:x==y?0:-1;
                    });
                }
                return r;
            },
            //copy
            copy:function(){
                var o = new this.constructor;
                _.merge(o, this, 'all');
                return o;
            },
            clone:function(flag){
                var c = _.unserialize(_.serialize(this));
                //if !flag, delete all alias
                if(!flag){
                    var f=function(c, host){
                        var self = arguments.callee;
                        delete c.alias;
                        if(host)c.host=host;
                        if(c.children){
                            c.children.each(function(a){
                                self(a[0], host);
                            });
                        }
                    };
                    f(c, this.host);
                }
                return c;
            }
        }
    });

    //Base
    Class("linb.Base","linb.iBox",{
        Constructor:function(alias, properties, events){
            var self=this, c=self.constructor, profile;

            if(typeof alias=='object'){
                events=alias.events;
                properties=alias.properties;
                alias=alias.alias;
            }

            profile = new linb.Profile;

            //for base elements
            _.merge(profile,{
                properties : properties || {},
                alias : alias || c.pickAlias(),
                $id : _.id(),
                _links : [],
                box : c,
                key : c.KEY,
                'object' : self
            },'all');

            c._namePool[profile.alias]=1;
            profile.setEvents(events);
            //give default values
            //_.merge(profile.properties, c.$DataStruct);
            profile.links(c._cache, 'self')
            .links(linb.Base._cache, 'base')
            .links(linb._object, 'linb');

            profile.boxing=function(){return self};

            self._nodes=[profile];
        },
        Instance:{
            ini:function(properties, events, host){
                var profile=this.get(0);

                _.merge(profile.properties, properties, 'all');

                //for event handlers:
                profile.setEvents(events || profile.events || {});
                //for avoid conflict with dom events
                delete profile.events;

                profile.host=host;

                return this;
            },
            $gc:function(){
                delete this.box._namePool[this.alias];
            },
            alias:function(str){
                var self=this;
                if(str){
                    delete self.constructor._namePool[self.get(0).alias];
                    self.get(0).alias=str;
                    self.constructor._namePool[str];
                }else
                    return self.get(0).alias;
                return self;
            },
            host:function(value, alias){
                var self=this;
                if(value){
                    self.get(0).host=value;
                    if(alias){
                        self.alias(alias);
                        value[alias]=self;
                    }
                    return self;
                }else
                    return self.get(0).host;
            }
        },
        After:function(){
            var self=this, me=arguments.callee,
                temp,t,k,u,m,i,j,v;
            self._nameId=0;
            self._namePool={};
            self._nameTag=(t=self.KEY.split('.'))[t.length-1].toLowerCase();
            self._cache=[];

            if(self === linb.Base)return;

            m=me.a1 || (me.a1='$Keys,$DataModel,$DataStruct,$EventHandlers'.toArr());
            for(j=0;v=m[j++];){
                if(t=self.$parent){
                    k={};
                    for(i=0;u=t[i++];)
                        _.merge(k,u[v]);
                    self[v]=_.clone(k);
                }else
                    self[v]={};
            }

            /*change keys*/
            u=self.$Keys;
            for(i in u)
                if((t=u[i].split('-')).length)
                    u[i]=self.KEY+"-"+t[t.length-1];
            u.KEY = u.$key = self.KEY;

            self.setDataModel(self.DataModel);
            delete self.DataModel;

            self.setEventHandlers(self.EventHandlers);
            delete self.EventHandlers;

            m=me.a5 || (me.a5='createdTrigger,renderedTrigger'.toArr());
            for(j=0;v=m[j++];){
                temp=[];
                if(t=self.$parent)
                    for(i=0;u=t[i];i++){
                        if(u=u['$'+v])
                            temp.push.apply(temp,u);
                    }
                if(self[v])
                    temp.push(self[v]);
                self['$'+v] = temp;
                delete self[v];
            }
        },
        Static:{
            $i:true,
            $specialChars:{_:1,$:1},
            $gc:function(){
                var self=this, k=self.$key;
                //clear templates memory in linb.cache
                _.breakO([self.$DataModel, self.$DataStruct, self.$EventHandlers, self],2);
                // add for base class
                Class.$gc(k);
            },
            getDefaultProp:function(){
                return _.copy(this.$DataStruct);
            },
            /*
            _cache:{},
            //properties struct
            $DataStruct:{},
            //properties model
            $DataModel:{},
            //event handlers
            $EventHandlers:{},
            */
            setDataModel:function(hash){
                var self=this, t,o,n,m,r,sc=linb.Base.$specialChars;
                var ds = self.$DataStruct, properties=self.$DataModel;

                //merge default value and properties
                for(var i in hash){
                    if(!properties[i])properties[i]={};
                    if(_.isHash(o=hash[i])){
                        //merge properties set
                        t = properties[i];
                        _.merge(t,o,'all');
                        //merge default value
                        ds[i] = typeof o.ini!='undefined'?o.ini:typeof ds[i] !='undefined'?ds[i]:undefined;
                    }else{
                        if(null===o){
                            r=i.initial();
                            delete ds[i];
                            delete properties[i]
                            delete self.prototype['get'+r];
                            delete self.prototype['set'+r];
                        }else{
                            ds[i]=o;
                            if(typeof o != 'function')
                                properties[i].ini=o;
                        }
                    }
                }

                _.each(hash,function(o,i){
                    if(o===null || sc[i.charAt(0)] || typeof o == 'function')return;
                    r=i.initial();
                    //readonly properties
                    if(!(o && o.readonly)){
                        //custom set
                        t = o.set;
                        n = 'set'+r;
                        m = self.prototype[n];
                        self.prototype[n] = typeof t=='function' ? Class._fun(t,n,self.KEY) : typeof m=='function' ? m : Class._fun(function(value,flag){
                            return this.each(function(v){
                                //if same return
                                if(v.properties[i] === value && !flag)return;
                                var ovalue = v.properties[i],
                                    m = _.get(v.box.$DataModel, [i, 'action']);
                                v.properties[i] = value;
                                if(typeof m == 'function' && v._applySetAction(m, value, ovalue) === false)
                                    v.properties[i] = ovalue;
                            });
                        },n,self.KEY);
                    }

                    // get custom getter
                    t = o.get;
                    n = 'get'+r;
                    m = self.prototype[n];

                    self.prototype[n] = typeof t=='function' ? Class._fun(t,n,self.KEY) : typeof m=='function' ? m : Class._fun(function(){
                        return this.get(0).properties[i];
                    },n,self.KEY);
                });
                return self;
            },

            getDataModel:function(key){
                var o=this.$DataModel;
                return key?o[key]:o;
            },
            setEventHandlers: function(o){
                _.each(o,function(o,i){
                    if(null===o){
                        delete this.$EventHandlers[i];
                        delete this.prototype[i];
                    }else{
                        this.$EventHandlers[i]=o;
                        var f=function(fun){
                            var args = arguments, type=typeof fun;
                            if(args.length ==1 && (type == 'function' || type == 'string'))
                                return this.each(function(v){
                                    if(v.domNode)
                                        v.resetCache();
                                    v[i] =fun;
                                });
                            else if(args.length ==1 && null===fun)
                                return this.each(function(v){
                                    v.resetCache();
                                    delete v[i];
                                });
                            else{
                                //need to return event result
                                var v = this.get(0), t=v[i], k=v.host || v;
//                                if(this.get(0).properties.$design)return;
                                if(typeof t=='string')t=k[t];
                                if(typeof t=='function')return _.tryF(t, args, k);
                            }
                        };
                        f.$event$=1;
                        return this.plugIn(i,f);
                    }
                },this);
            },
            getEventHandlers:function(){
                return this.$EventHandlers;
            },
            getByCacheId:function(id){
                var o;
                if(o=this._cache[id]){
                    return o.object;
                }
            },
            pickAlias:function(){
                var t,p=this._namePool,a=this._nameTag;
                while(p[t=(a+(++this._nameId))]){}
                return  t;
            },
            unserialize:function(str){
                var o = _.unserialize(str);
                return new this(o);
            }
        }
    });

    //iDataBinder
    Class("linb.iDataBinder","linb.Base",{
        Constructor:function(){
            this._nodes=[];
        },
        Instance:{
            getDataBinder:function(){
                var profile=this.get(0);
                return linb.iDataBinder.getDataBinder(profile.properties.dataBinder);
            },
            resetValue:function(hash){
                this.each(function(profile){
                    profile.boxing().resetValue((hash && hash[profile.properties.dataField]) || profile.value);
                });
                return this;
            },
            checkValid:function(){
                return linb.UI.iWidget.pack(this._nodes).checkUIValueValid();
            },
            getValue:function(){
                if( this.checkValid() ){
                    var hash={};
                    this.each(function(profile){
                        var p=profile.properties, b = profile.boxing(),v;
                        if(profile.domNode)b.updateValue();
                        v = b.getValue();
                        hash[p.dataField]=v;
                    });
                    return hash;
                }else return null;
            }
        },
        Static:{
            $i:true,
            _pool:{},
            clear:function(){
                this._pool={};
            },
            link:function(name, pro){
                var o = this._pool[name];
                if(!o)
                    o = this._pool[name] = new linb.iDataBinder();
                if(pro && !o._nodes.exists(pro))o._nodes.push(pro);
            },
            unlink:function(name, pro){
                var o = this._pool[name];
                if(o)
                    o._nodes.removeValue(pro);
            },
            getDataBinder:function(name){
                return this._pool[name];
            },
            DataModel:{
                dataBinder:{
                    ini:'',
                    set:function(v){
                        var ds,r;
                        return this.each(function(profile,flag){
                            var p=profile.properties,
                                old = p.dataBinder;
                            if(old==v && !flag)return;
                            if(old)
                                linb.iDataBinder.unlink(old, profile);
                            p.dataBinder=v;
                            linb.iDataBinder.link(v, profile);
                        });
                    }
                },
                dataField:''
            },
            createdTrigger:function(){
                var self=this, b=self.boxing(),t;
                if(t=self.dataBinder)b.setDataBinder(t);
                if(t=self.dataField)b.setDataField(t);
            }
        }
    });
};

//linb.UI Class
new function(){
    //linb.UIProfile Class
    Class('linb.UIProfile','linb.Profile', {
        Instance:{
            $gc:function(){
                var self=this, t;
                //gc already
                if(!self.serialId)return;
                //clear cache things
                self.resetCache();

                //clear dom link
                if(self.addition && (t=self.domNode))
                    for(var i in self.addition)
                        t[i]=null;

                //for refresh function
                if(!self.$exID){
                    //restore dom id
                    t=linb.cache.domId;
                    (t[self.key] || (t[self.key]=[])).push(self.serialId);
                }else delete self.$exID

                //clear cache point
                delete linb.cache.dom[self.domId];
                delete self.box._namePool[self.alias];

                //clear anti links
                self.antiAllLinks();

                _.breakO(self);
            },
            _linkParent:function(id,parent){
                var profile=this;
                //set parent
                profile.parent = parent;
                profile.childrenId = id;
                //antiLink first
                profile.antiLinks('$parent');
                //and, link
                profile.links(parent.children, '$parent', [profile, id]);
            },
            //use remove, not $gc
            destroy:function(){
                var self=this;
                if(self.root)self.root.remove();
                else self.$gc();
            },
            resetCache:function(key){
                //for getEvents
                _.breakO(this.$cache_egetter,2);
                _.breakO(this.$cache_domid);
            },
            //get events function from profile
            getEV:function(id, name){
                var self=this,
                    $k = id+"+"+name,
                    g = self.$cache_egetter ||(self.$cache_egetter={});
                if(g[$k])return g[$k];

                var dom=linb.cache.dom,
                    funs=[],
                    t,key
                    ;
                //for event attached on dom node
                if( (t=dom[id]) && (t=t.events) && (t=t[name]) )
                    for(var i=0,l=t.length;i<l;i++)
                        if(typeof t[t[i]]=='function')
                            funs[funs.length]=t[t[i]];

                //for event attached on linb widgets
                //get event function path of cache
                key = id.split(":")[0].split("-")[1];

                //for design mode
                if(typeof (((t=self._CB) && (key?(t=t[key]):1)) && (t=t[name]))=='function')
                    funs[funs.length]=t;
                //get event function from customBehavior first
                else if(typeof (((t=self.CB) && (key?(t=t[key]):1)) && (t=t[name]))=='function')
                    funs[funs.length]=t;
                else{
                    //get event function from public behavior
                    if(typeof (((t=self.behavior) && (key?(t=t[key]):1)) && (t=t[name]))=='function')
                        funs[funs.length]=t;
                }
                return g[$k] = funs;
            },
            //
            toString:function(flag){
                var self=this, i, o, m, a, c, self, children, h={},id, me=arguments.callee, reg = me.reg || ( me.reg = /<!--([^>^\s]*)-->/g);
                if(!self.string || flag){
                    c = self.box;
                    _.merge(self.properties, c.$DataStruct);
                    self.data = {};
                    c.prepareData(self,true);
                    if(c.dynamicTemplate)c.dynamicTemplate(self);
                    self.string = c.build(self);
                    delete self.data;

                    // for children linb.UI/dom node
                    if(m=self.children)
                        for(i=0; o=m[i++]; ){
                            if(!o[0]['linb.UIProfile']){
                                a = new (linb.SC(o[0].key));
                                a.ini.call(a, o[0]);
                                o[0]=a.get(0);
                            }
                        }
                }
                if(m=self.children)
                    for(i=0; o=m[i++]; ){
                        id = o[1]||'';
                        a = h[id] || (h[id]=[]);
                        a[a.length] = o[0].toString();
                    }

                return self.string.replace(reg, function(a,b){
                    return h[b]?h[b].join(''):'';
                });
            },
            //boxing to linb.UI.xx
            boxing:function(){
                //cache boxing
                var self=this, t;
                if(!((t=self.object) && t._nodes[0]==self && t._nodes.length==1))
                    t = self.object = self.box.pack([self],false);
                return t;
            },
            _applySetAction:function(fun, value, ovalue){
                if(this.domNode)
                    return fun.call(this, value, ovalue);
            },
            makeRootId:function(key){
                return (key || this.key) + ":" + this.serialId + ":";
            },
            getKey:function(id){
                return id.split(":")[0];
            },
            getSubSerialId:function(id){
                return id.split(":")[2];
            },
            getSerialId:function(id){
                return id.split(":")[1];
            },
            getNodeId:function(key, serialId, subSerialId){
                return key+":"+serialId+":"+subSerialId;
            },

            pickSubId:function(key){
                var self=this, r,o = self.cache_subid || (self.cache_subid={});
                if((o[key] || (o[key]=[]))[0])return o[key].shift();
                o = self.subId || (self.subId={});
                r=(o[key] || (o[key]=new _.id)).next();
                return r;
            },
            cacheSubId:function(id, key){
                var o = this.cache_subid || (this.cache_subid={});
                (o[key] || (o[key]=[])).push(id);
            },
            /*
            *('KEY','-mouseover',false);
            */
            getClass:function(key, tag, flag){
                var self=this;
                key = self.keys[key] || key;
                var  me=arguments.callee, map=me.map||(me.map={}), reg=me.reg||(me.reg=/\./g), hash=self.appearance+":"+key+":"+tag+':'+flag;
                if(map[hash])return map[hash];

                //give a change to replace class base string
                if(self.classKey)key=key.replace(self.key,self.classKey);
                var str = (((!flag && self.appearance!='default')?self.appearance + "--" : "") + key).replace(reg,'-').toLowerCase();
                str = str + (tag||'');
                return map[hash]=str;
            },

            addTagClass:function(key, tag, nodes, flag){
                var self=this;
                key=self.keys[key] || key;
                if(!nodes)nodes=self.getSubNode(key);

                var c = self.box.$clscache || (self.box.$clscache={}),
                k=key+":"+tag,
                cls='[^\\s]*'+self.getClass(key,'',true),
                reg = c[k] || (c[k] = new RegExp(cls + '[-\\w]*' + tag + '[-\\w]*')),
                r2= c[cls+"*2"] ||(c[cls+"*2"]=new RegExp("("+cls + "[-\\w]*)",'g')),
                r3= c[cls+"*3"] ||(c[cls+"*3"]=new RegExp("("+cls + ")"))
                ;
                nodes.removeClass(reg);
                //add multi based on all
                if(!flag)
                    nodes.reClass(r2, '$1 $1' + tag);
                //add a new based on root
                else
                    nodes.reClass(r3, '$1 $1' + tag);

                return self;
            },
            removeTagClass:function(key, tag, nodes){
                var self=this;
                key=self.keys[key] || key;
                if(!nodes)nodes=self.getSubNode(key);

                var c = self.box.$clscache || (self.box.$clscache={}),
                k=key+":"+tag,
                reg = c[k] || (c[k] = new RegExp(self.getClass(key,'',true)+'[-\\w]*'+tag+'[-\\w]*'))
                ;
                nodes.removeClass(reg);

                return self;
            },

            getSubNodeId:function(key, itemId){
                var arr = this.domId.split(':');
                arr[0]=key;
                arr[2]=itemId||'';
                return arr.join(':');
            },

            //flag : remove from cache
            getSubNode:function(key, itemId, flag){
                var self=this;
                key=self.keys[key] || key;
                var r,t,s,h=self._domNode||(self._domNode={});

                // by key only
                if(itemId===true)
                    r =linb([self.domNode]).dig('*', 'id', new RegExp('^'+key+':'+self.serialId));
                else{
                    if(flag)delete h[key];
                    if(!itemId && h[key] && h[key]._nodes.length==1)return h[key];
                    r = (t=linb.dom.byId(s=self.getSubNodeId(key, itemId))) ? linb([t]) : linb([self.domNode]).dig('*', 'id', s);
                    if(!itemId && !flag)h[key]=r;
                }
                return r;
            },
            getSubNodes:function(arr,itemId){
                var i=0,a=[],o;
                for(;o=arr[i++];)
                    a.push(this.getSubNode(o,itemId).get(0));
                return linb(a);
            },
            getSubNodeByItemId:function(key, id){
                return (id=this.getSubSerialIdByItemId(id)) ? this.getSubNode(key, id) : linb([]);
            },
            getItemByItemId:function(id){
                var t;
                if((t=this.ItemIdMapSubSerialId) && (t=t[id]))
                    return this.SubSerialIdMapItem[t];
            },
            getItemByDom:function(src){
                return this.SubSerialIdMapItem && this.SubSerialIdMapItem[this.getSubSerialId(src.id || src)];
            },
            getItemIdByDom:function(src){
                var t;
                return (t=this.getItemByDom(src)) && t.id;
            },
            getSubSerialIdByItemId:function(id){
                var t;
                return (t=this.ItemIdMapSubSerialId) && t[id];
            },
/*
            getItemBySubSerialId:function(id){
                return this.SubSerialIdMapItem && this.SubSerialIdMapItem[id];
            },
            getItemIdBySubSerailId:function(subId){
                var t;
                if(t=this.ItemIdMapSubSerialId)
                    for(var i in t)
                        if(t[i]==subId)
                            return i;
            },
*/
            itemsSearch:function(items, fun, deep, single){
                deep = deep || false;
                single = single || false;
                var r = [];
                var f = arguments.callee.f || (arguments.callee.f = function(items, fun, deep, single, r){
                    var me = arguments.callee;
                    items.each(function(o){
                        if(fun===true || fun.call(null, o)){
                            r.push(o);
                            if(single)return false;
                        }
                        if(deep && o.sub && o.sub.length)me(o.sub, fun, deep, single, r);
                    });
                });
                f(items, fun, deep, single, r);
                return r;
            }
        }/*,
        Static:{
            getFromDomId:function(id){
                return linb.cache.dom[id];
            },
            getFromDomNode:function(node){
                return linb.cache.dom[linb.event.getId(node)];
            },
            getFromDom:function(dom){
                return linb.cache.dom[dom.get(0).id];
            }
        }*/
    });

    //linb.UI Class
    Class("linb.UI", "linb.Base",{
        //properties, events, host, template, behavior, appearance, children
        Constructor:function(){
            if(arguments[0]!==false)
                return this.ini.apply(this,arguments);
        },
        Before:function(key, parent_key, o){
            linb.iBox.$type[key.replace("linb.UI.","").replace("linb.","")]=linb.iBox.$type[key]=key;
            return true;
        },
        After:function(){
            linb.Base.After.apply(this,arguments);
            var self=this,me=arguments.callee,
                temp,t,k,u,b,c,m,i,j,e,w,v;

            self._ctrlId = new _.id();
            self._idCache=[];

            /*for examples:
            linb.UI.xxx.$Templates[''].$={
                tagName:...
                UPPER:...
            }
            */

            m=me.a2 || (me.a2='$Templates,$Behaviors,$Appearances'.toArr());
            for(j=0;v=m[j++];){
                k={};
                if(t=self.$parent){
                    for(e=0;b=t[e++];)
                        for(i in b[v]){
                            t=b[v][i];
                            u=k[i]||(k[i]={});
                            for(c in t){
                                w=t[c];
                                u[c]=u[c]||{};
                                _.merge(u[c],w);
                            }
                        }
                    self[v]=_.clone(k);
                }else
                    self[v]={};
            }

            m=me.a3 || (me.a3='Templates,Behaviors,Appearances'.toArr());
            w=me.a4 || (me.a4='setTemplate,setBehavior,setAppearance'.toArr());
            for(j=0;v=m[j];j++){
                u=self[v];
                for(i in u)
                    self[w[j]](i,u[i]);
                delete self[v];
            }

            if(self.PublicAppearance){
                linb.css.add(self.buildCSSText(self.PublicAppearance,linb.getPath(self.KEY,'/css.css','appearance')));
                delete self.PublicAppearance;
            }
            if(self.Dropable && self.Dropable.length){
                self.Dropable.each(function(o){
                    self.dropable(o)
                });
                delete self.Dropable;
            }
            if(self.Dragable&& self.Dragable.length){
                self.Dragable.each(function(o){
                    self.dragable(o)
                });
                delete self.Dragable;
            }
        },
        Instance:{
            getSubNode:function(){
                var p=this.get(0);
                return p.getSubNode.apply(p,arguments);
            },
            toString:function(){
                return this._nodes.join('');
            },
            toDomNodes:function(){
                var t, arr=[];
                this._nodes.each(function(o){
                    if(t=o.domNode)arr.push(t);
                });
                return arr;
            },
            ini:function(properties, events, host, template, behavior, appearance, children, CA, CB, CC, CF){
                var self=this, profile, c = self.constructor, t='default';
                //from keep UIProfile object point ( linb.UI.refresh )
                if(properties && properties['linb.UIProfile'])
                    self._nodes = [ profile = properties];
                else
                    self._nodes = [ profile = new linb.UIProfile];

                profile.box = c;
                profile.key = self.$key;
                profile.$id = _.id();
                /*set keys handler*/
                profile.keys = c.$Keys;

                // from serialized object
                if(properties && properties.key && linb.iBox.$type[properties.key]){
                    _.merge(profile,properties);
                    //for id set
                    properties=null;
                }

                // from normal
                profile.properties =  properties || profile.properties || {};
                profile.host = host || profile.host || null;
                profile.appearance = appearance || profile.appearance || t;
                profile.behavior = c.getBehavior(behavior || profile.behavior || t);
                // custom
                profile.CA =  CA || profile.CA || {};
                profile.CB =  CB || profile.CB || {};
                profile.CC =  CC || profile.CC || {};
                profile.CF =  CF || profile.CF || {};

                if(c.iniProfile)c.iniProfile.call(profile);

                profile.template = c.getTemplate(template || profile.template || t);

                //for event handlers:
                profile.setEvents(events || profile.events || {});
                //for avoid conflict with dom events
                delete profile.events;

                if(!profile.serialId)profile.serialId=c.pickSerialId();
                profile.domId = profile.makeRootId();

                //new alias always
                profile.alias = profile.alias || c.pickAlias();
                c._namePool[profile.alias]=1;

                profile.createdTrigger=c.$createdTrigger.copy();
                profile.renderedTrigger=c.$renderedTrigger.copy();

                //not register subcontrols id / dom cache
                //attribute in innerHTML won't cause memory leak in IE.
                profile.addition = profile.behavior?profile.behavior.$eventhandler:null;

                //set default value
                profile._links={};
                //set anti-links
                profile.links(linb.UI._cache,'UI').links(c._cache,'self').links(linb._object,'linb');

                children = children || profile.children || [];
                profile.children=[];
                for(var i=0,v;v=children[i++];){
                    //from serialize
                    if(!v[0]['linb.UIProfile'])
                        v[0]=new (linb.SC(v[0].key))(v[0]).get(0);
                    v[0]._linkParent(v[1],profile);
                }
                return self;
            },
            _set:function(o,flag){
                var self=arguments.callee,t;

                //link dom
                o.root = linb([o.domNode = linb.dom.byId(o.domId)]);
                linb.cache.dom[o.domId] = o;

                //createdTrigger
                if(t=o.createdTrigger){
                    for(var i=0,l=t.length;i<l;i++)
                        t[i].call(o);
                    delete o.createdTrigger;
                }
                if(flag && (t=o.renderedTrigger))
                    for(var i=0,l=t.length;i<l;i++)
                        t[i].call(o);
                if(o.children)
                    for(var i=0,v;v=o.children[i++];)
                        self(v[0],true);
            },
            //flag:true, try to trigger renderedTrigger
            create:function(flag){
                var arr=[],i,o,n=this._nodes,me=arguments.callee,set=this._set;
                for(i=0;o=n[i++];)
                    if(!o.domNode)
                        arr[arr.length]=o;
                if(arr.length){
                    linb.dom.getMatix().html(arr.join(''),false);
                    for(i=0;o=arr[i++];)
                        set(o,flag);
                }
                return this;
            },
            render:function(){
                var i,o,n=this._nodes,node,me=arguments.callee,set=this._set,
                    para=me.para||(me.para=function(node){
                        var r = node.getRegion();
                        r.tabindex=node.tabIndex();
                        r.zIndex=node.zIndex();
                        r.position=node.position();
                        return r;
                    });
                for(i=0;o=n[i++];)
                    if(!(node = linb(o.alias)).isEmpty()){
                        _.merge(o.properties, para(node));
                        node.outerHTML(o.toString());
                        window[o.alias]=o.boxing();
                        set(o,true);
                    }
                return this;
            },

            hide:function(){
                return this.each(function(o){
                    if(o.domNode){
                        o.root.hide();
                        o.properties.exDock=true;
                    }
                });
            },
            show:function(l,t){
                return this.each(function(o){
                    if(o.domNode){
                        o.properties.exDock=false;
                        o.root.show(l,t);
                    }
                });
            },
            display:function(value){
                return this.each(function(o){
                    if(o.domNode)
                        o.root.display(value?'':'none');
                });
            },

            destroy:function(){
                this.each(function(o){
                    if(o.beforeDestroy && o.boxing().beforeDestroy(o)===false)return;
                    if(o.destroyTrigger)o.destroyTrigger();
                    if(o.root)o.root.remove();
                    else o.$gc();
                });
            },
            clean:function(){return this},
            activate:function(){return this},
            clone:function(flag){
                var arr=[];
                this.each(function(o){
                    arr.insertAny(linb.create(o.clone(flag)).get());
                });
                return this.constructor.pack(arr,false);
            },
            refresh:function(){
                var para,b,p,s,sid,fun,host,box,children;
                return this.each(function(o){
                    if(!o.domNode)return;
                    //keep parent
                    if(b=!!o.parent){
                        p=o.parent.boxing();
                        para=o.childrenId;
                    }else
                        p=o.root.parent();

                    //replace
                    var replace = linb.create('span');
                    o.root.replace(replace,true);

                    //keep children
                    children = o.children.copy();
                    o.children.length=0;
                    children.each(function(o){
                        //for flush dock
                        delete o[0].$dockParent;

                        //keep it in dom
                        replace.addLast(o[0].root);
                    });

                    //destroy and re create
                    box=o.box;
                    //keep serialId and host
                    sid=o.serialId;
                    host=o.host;
                    s = o.beforeSerialized();
                    fun = o.$addOns;

                    o.$exID=1;
                    o.boxing().destroy();
                    //call gc to clear
                    linb.dom.$gc();

                    s.host=host;
                    //use the old profile handle
                    _.merge(o,s,'all');
                    o=new box(o).create();

                    //for functions like: UI refresh itself
                    if(fun){
                        fun.call(fun.target,o.get(0));
                        delete fun.target;
                    }

                    //replace back
                    replace.empty(false);
                    replace.replace(o.get(0).root);
                    replace.remove();

                    //restore to parent
                    if(b){
                        p.attach(o,para);
                    }else
                        p.attach(o);

                    //restore children
                    children.each(function(v){
                        o.attach.apply(o,v);
                    });
                });
            },
            //set template id to object
            template:function(str){
                var self=this, o,t;
                if(typeof str=='string'){
                    self.each(function(o){
                        if(o.domNode){
                            if(!o.template || o.template._id != _.str(str)){
                                t=o.box.getTemplate(_.str(str));
                                if(!t)return;
                                o.template = t;
                                return self.refresh();
                            }
                        }else
                            o.template = str;
                    });
                    return self;
                }else
                    return self.get(0).template;
            },
            behavior:function(str){
                var v,t,m;
                if(typeof str=='string'){
                    this.each(function(o){
                        if(o.behavior._id != _.str(str)){
                            //remove eventhandler first
                            if(o.domNode){
                                t = o.behavior;
                                if(v=t.$eventhandler)
                                    for(var j in v)
                                        o.root.removeEventHandler(j.slice(2));

                                for(var i in o.keys){
                                    if(t[i] && (v=t[i].$eventhandler))
                                        for(var j in v)
                                            o.getSubNode(i,true).removeEventHandler(j.slice(2));

                                }
                            }
                            //reset behavior
                            t = o.box.getBehavior(_.str(str));
                            if(!t)return;
                            o.behavior = t;
                            //add eventhandler
                            if(o.domNode){
                                if(v=t.$eventhandler)
                                    for(var j in v)
                                        o.root.addEventHandler(j.slice(2));

                                for(var i in o.keys){
                                    if(t[i] && (v=t[i].$eventhandler))
                                        for(var j in v)
                                            o.getSubNode(i,true).addEventHandler(j.slice(2));

                                }
                            }
                        }
                    });
                    return this;
                }else
                    return this.get(0).behavior;
            },
            appearance:function(str){
                var v,t;
                if(typeof str=='string')
                    return this.each(function(o){
                        if(o.appearance != str){
                            t=o.getClass('KEY');
                            o.appearance = str;
                            if(!o.box.cssNone)
                                o.box.setCSSFile(o.box.cssPathKey || o.key, o.appearance);

                            if(o.domNode)
                                o.root
                                .dig('*', 'id', new RegExp('^'+o.key+'(-[\w]+)?:'+o.serialId))
                                .reClass(new RegExp('([\\w]+\\-\\-)?' + t,'g'),o.getClass('KEY'));
                        }
                    });
                else
                    return this.get(0).appearance;
            },
            attach:function(ui, id){
                if(id!==false)
                    this.appendChild(ui, id);
                var pro=this.get(0);
                if(pro.domNode)
                    pro.getSubNode(pro.keys.PANEL||'KEY').attach(ui);
                return this;
            },
            appendChild:function(target, id){
                //for input profile
                if(target['linb.UIProfile'])target=target.boxing();
                //
                if(_.isArr(target))target=linb.UI.pack(target, false);
                //domNode
                if(!target['linb.UI'])target=target.reBoxing('UI');

                return this.each(function(v){
                    //first
                    target.each(function(profile){
                        profile._linkParent(id,v);
                    });
                });
            },
            detach:function(){
                return this.each(function(profile){
                    //antiLink first
                    profile.antiLinks('$parent');
                    delete profile.parent;
                    delete profile.childrenId;
                });
            },

            addPanel:function(para, children, item){
                var pro = linb.UI.PanelBar.getDefaultProp();
                _.merge(pro, para, 'with');
                _.merge(pro,{
                    left:0,
                    top:0,
                    dock:'fill',
                    tag:para.tag||para.id
                },'all');

                var pb = new linb.UI.PanelBar(pro);
                this.attach(pb, item&&item.id);
                children.each(function(o){
                    pb.attach(o[0]);
                });
            },
            dragable:function(dragKey, dragData, key){
                return this.each(function(o){
                    o.getSubNode(o.keys[key] || 'KEY', true)
                    .beforeMousedown(function(pro,e,src){
                        linb([src]).startDrag(e, {
                            drop2:true,
                            key:dragKey,
                            data:typeof dragData == 'function'?dragData():dragData,
                            icon:linb.ini.path+'ondrag.gif',
                            dragMode:'move',
                            cursor:'pointer',
                            move:false,
                            defer:1
                        });
                    },'',-1)
                    .beforeDragbegin(function(profile, e, src){
                        linb([src]).onMouseout(true,{$force:true}).onMouseup(true);
                    },'',-1);
                });
            },
            unDragable:function(key){
                return this.each(function(o){
                    o.getSubNode(o.keys[key] || 'KEY', true)
                    .beforeMousedown(null,'')
                    .beforeDragbegin(null,'');
                    o.resetCache();
                });
            },
            setCustomFunction:function(key, value){
                return this.each(function(o){
                    if(typeof key=='string'){
                        if(typeof value=='function') o.CF[key]=value;
                        else delete o.CF[key];
                    }else
                        o.CF=key||{};
                });
            },
            setCustomClass:function(key, value){
                var me=arguments.callee;
                var fun=(me.fun||(me.fun=function(pro,i, h, flag){
                    var node=pro.getSubNode(i,true),b;
                    if(!node.isEmpty())
                        h[i].split(/\s+/).each(function(o){
                            if(!flag)
                                node.addClass(o);
                            else
                                node.removeClass(o);
                        });
                }));
                return this.each(function(o){
                    var bak = _.copy(o.CC);

                    //set key and value
                    if(typeof key=='string'){
                        if(o.domNode)
                            if(key in bak)
                                fun(o, key, bak, true);

                        if(!value)
                            delete o.CC[key];
                        else{
                            o.CC[key]=value;
                            if(o.domNode)
                                fun(o, key, bak);
                        }
                    //set hash dir
                    }else if(!!key && typeof key=='object'){
                        if(o.domNode){
                            for(var i in bak)
                                fun(o, i, bak, true);
                            for(var i in key)
                                fun(o, i, key);
                        }
                        o.CC=key;
                    //clear all
                    }else{
                        if(o.domNode)
                            for(var i in bak)
                                fun(o, i, bak, true);
                        o.CC={};
                    }
                });
            },
            setCustomAppearance:function(key,value){
                var me=arguments.callee;
                var fun=(me.fun||(me.fun=function(pro,i,h, flag){
                    var node=pro.getSubNode(i,true),b;
                    if(!node.isEmpty())
                        h[i].split(';').each(function(o,i){
                            if((b=o.split(':')).length==2){
                                b[0]=b[0].replace(/\-(\w)/g,function(a,b){return b.toUpperCase()});
                                try{node.setStyle(b[0], flag?'':b[1])}catch(e){}
                            }
                        });
                }));
                return this.each(function(o){
                    var bak = _.copy(o.CA);

                    //set key and value
                    if(typeof key=='string'){
                        if(o.domNode)
                            if(key in bak)
                                fun(o, key, bak, true);

                        if(!value)
                            delete o.CA[key];
                        else{
                            o.CA[key]=value;
                            if(o.domNode)
                                fun(o, key, bak);
                        }
                    //set hash dir
                    }else if(!!key && typeof key=='object'){
                        if(o.domNode){
                            for(var i in bak)
                                fun(o, i, bak, true);
                            for(var i in key)
                                fun(o, i, key);
                        }
                        o.CA=key;
                    //clear all
                    }else{
                        if(o.domNode)
                            for(var i in bak)
                                fun(o, i, bak, true);
                        o.CA={};
                    }
                });
            },
            setCustomBehavior:function(key, value){
                return this.each(function(o){
                    if(typeof key=='string'){
                        if(o.keys[key])
                            o.CB[key]=value||{};
                    }else
                        o.CB=key||{};
                    o.resetCache();
                });
            }
        },
        Initialize:function(){
            //add some CSS for linb.UI
            linb.css.add(linb.UI.buildCSSText({
                body:{
                    $order:0,
                    font:['13px arial,helvetica,clean,sans-serif',linb.browser.ie?'x-small':''],
                    'font-size':linb.browser.ie6?'100.01%':linb.browser.ie?'small':'',
                    margin:0,
                    padding:0,
                    cursor:'default'
                },
                'div,span,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,form,fieldset,input,button,p,blockquote,th,td':{
                    $order:1,
                    margin:0,
                    padding:0
                },
                table:{
                    $order:2,
                    'font-size':'inherit',
                    font:linb.browser.ie?'100%':'',
                    'border-collapse':'collapse',
                    'border-spacing':0,
                    'empty-cells':'show'
                },
                'div,span,fieldset,img,abbr,acronym':{
                    $order:3,
                    border:0
                },
                'address,caption,cite,dfn,em,strong,th,var':{
                    $order:4,
                    'font-style':'normal',
                    'font-weight':'normal'
                },
                'pre, code ':{
                    $order:5,
                    //font:'115% monospace',
                    'font-size':linb.browser.ie?'100%':'',
                    'font-style':'normal',
                    'font-weight':'normal',
                    margin:0,
                    padding:0
                },
                'ol,ul ':{
                    $order:6,
                    'list-style':'none'
                },
                'caption,th': {
                    $order:7,
                    'text-align':'left'
                },
                'h1,h2,h3,h4,h5,h6':{
                    $order:8,
                    'font-size':'100%'
                },
                a:{
                    $order:10,
                    'text-decoration': 'none',
                    cursor:'pointer',
                    '-moz-user-select': linb.browser.gek?'none':''
                },
                'a:hover':{
                    $order:11,
                    'color':'red'
                },
                'a:focus':{
                    $order:11,
                    '-moz-outline-offset': linb.browser.gek?'-1px ! important':''
                },
                'button':{
                    $order:11,
                    cursor:'pointer',
                    'border-width':'1px'
                },
                'select, input, textarea': {
                    $order:12,
                    font:'99% arial,helvetica,clean,sans-serif'
                },

                strong:{
                    $order:14,
                    'font-weight':'bold'
                },
                em:{
                    $order:15,
                    'font-style': 'italic'
                },
                div:{
                    $order:15,
                    'vertical-align':linb.browser.id?'auto':null,
                    'font-size':'12px'
                },
                span:{
                    $order:16,
                    display:linb.browser.gek?['-moz-inline-block', '-moz-inline-box']: 'inline-block',
                    /*must specify this, or static will take more v space*/
                    'vertical-align':'middle'
                 },
                'body *': {
                    $order:17,
                    'line-height':'1.22em'
                },
                '.ui-dirty, .ui-dirty *':{
                    $order:18,
                    color:'#f00'
                },
                '.ui-invalid, .ui-invalid *':{
                    $order:19,
                    'background-color': 'Aqua'
                },
                '#linb_lang':{
                    $order:20,
                    'vertical-align':'text-top'
                }
            }), 'linb.UI');
            //enable drop for a KEY in cls
            linb.cache.$dropPool={};
        },
        Static:{
            $i:true,
            $cache_csspath:{},
            $css_tag_dirty: "ui-dirty",
            $css_tag_invalid: "ui-invalid",
            $tag_left:"{",
            $tag_right:"}",
            $tag_special:'#',
            $ID:"#id#",
            $CLS:"#cls#",
            subSerialIdTag:"_serialId",
            $childTag:"<!--{id}-->",
            hasDomRoot:true,


            /*for check specific whether css file added to head?
            key is path string
            */
            unserialize:function(str,flag){
                var a=_.unserialize(str),f=function(o){
                    delete o.serialId;
                    o.children.each(f);
                };
                a.each(function(o){
                    if(!flag)f(o);
                });
                return linb.create(a);
            },
            clean:function(e){
                if(e && e._nodes && e._nodes[0] &&e._nodes[0]['linb.UIProfile'])
                    return e._nodes;
                else{
                    var r = this._dom2ui(linb.dom.pack(e)._nodes);
                    r.filter(function(o){
                        return o.box['linb.UI'];
                    });
                    return r;
                }
            },
            _dom2ui:function(arr){
                var i=0,a=[],t,key=this.KEY;
                arr.each(function(o){
                    if((t=linb.cache.dom[o.id]) && t.key)
                        a[i++] = t;
                });
                return a;
            },

            $gc:function(){
                var k=this.$key;

                //clear templates memory in linb.cache
                _.breakO([linb.cache.template[k], linb.cache.domId[k] ], 2);
                _.breakO([this._cache, this._idCache, this.$DataModel, this.$Templates, this.$Behaviors, this],2);

                delete linb.iBox.$type[k.replace("linb.UI.","")];
                this.$gc=null;
                // add for base class
                Class.$gc(k);
            },
            getAll:function(){
              return this.pack(this._cache);
            },
            getByCacheId:function(ids){
                var arr=[],t,n=this._cache;
                ids = ids instanceof Array?ids:[ids];
                ids.each(function(id){
                    if(t=n[id])arr[arr.length]=t;
                });
                return linb.UI.pack(arr,false);
            },
            pickSerialId:function(){
                //get id from cache or id
                var arr = linb.cache.domId[this.$key];
                if(arr && arr[0])return arr.pop();
                return this._ctrlId.next();
            },
            getCSSImgPara:function(path, para, appearance, key){
                return function(k){
                    var p = linb.getPath(key||k,null,'appearance') + (appearance?appearance:'default') +'/'+ path;
                    //pre load image
                    //new Image().src=p;
                    return 'url(' + p +') '+ (para||'');
                }
            },
            getImgPath2:function(path, para, appearance){
                return function(key){
                    var s = linb.getPath(key, '/'+ (appearance?appearance:'default') +'/' + path,'appearance');
                    return para.replace('{*}',s);
                }
            },
           /* deep template function
              template: string
              properties: hash

              $doTemplate("{a}{b}{c}{a}{b}{/c}", {a:'*',b:'#',c:[{a:'1',b:'.'},{a:'2',b:'.'},{a:'3',b:'.'},{a:'4',b:'.'}]})
                  will return "*#1.2.3.4."
              doTemplate("{a}{b}{c}{}{/c}", {a:'*',b:'#',c:['1','2','3','4']})
                  will return "*#1234"

              flag: default flase => no clear not mactched symbols
            */
            $doTemplate:function(profile, template, properties, tag, result){
                var self=arguments.callee,s,t,n,isA = properties.constructor == Array;
                var temp = template[tag||''], r = !result;
                var result= result || [];
                if(isA){
                    if(typeof temp != 'function')temp = self;
                    for(var i=0;t=properties[i++];)
                        temp(profile, template, t, tag, result);
                }else{
                    if(typeof temp == 'function')
                        temp(profile, template, properties, tag, result);
                    else{
                        tag = tag?tag+'.':'';
                        var a0=temp[0], a1=temp[1];
                        for(var i=0,l=a0.length;i<l;i++){
                            if(n=a1[i]){
                                if(n in properties){
                                    t=properties[n];
                                    //if sub template exists
                                    if(template[s=tag+n] && t)
                                        self(profile, template, t, s, result);
                                    else
                                        result[result.length]=t;
                                }
                            }else
                                result[result.length]=a0[i];
                        }
                    }
                }
                if(r)return result.join('');
            },
            /*
            set properties default map and set properties handler
            It's a merge function, not replace

            this.$DataStruct: {a:,b:,c}
            this.$DataModel: from hash, for example:
            hash:{
                key1:{
                    ini:xx,
                    set:fun..,
                    get:fun..,
                    action: fun
                },
                key2:null,
                key3:'abc,
            }
            */
            $buildTemplate:function(profile, template, key, obj, arr){
                if(template && String(template.tagName).toLowerCase()=='text'){
                    arr[arr.length] = template.text;
                    return;
                }
                var self =arguments.callee, t, o , bak,
                    behavior = profile.behavior?key?profile.behavior[key]:profile.behavior:null,
                    map1 = self.map1 ||(self.map1={tagName:1,text:1}),
                    map2 = self.map2 ||(self.map2={image:1,input:1}),
                    r2=self.r2||(self.r2=/[a-z]/),
                    r3=self.r3 || (self.r3=/^(on|before|after)/),
                    r7=self.r7 || (self.r7=/([^{}]*)\{([\w]+)\}([^{}]*)/g)
                    ;
                var lkey, first=false,u=linb.UI;

                if(!template)template=profile.template;
                lkey = key?profile.keys[key]:profile.key;

                //tagName
                if(!template.tagName)template.tagName="span";

                if(template.id!==null)
                    //id
                    template.id = lkey + ":" + u.$ID + ":" + u.$tag_left + u.subSerialIdTag + u.$tag_right;
                else
                    delete template.id;

                if(template.className!==null){
                    //className
                    t = u.$CLS + (key?'-'+key.toLowerCase():'');
                    //save bak
                    bak = template.className || '';

                    template['class'] =
                        //default class first
                        t+' '+
                        //solid class
                        bak+' '+
                        //custom class
                        u.$tag_special + (key||'KEY') + '_CC'+u.$tag_special
                        ;
                }
                delete template.className;

                template.style = (template.style||'')+';'+ u.$tag_special + (key||'KEY') + '_CA'+u.$tag_special;

                var a=[], b={}, tagName=template.tagName, text= template.text, sc=linb.Base.$specialChars;
                for(var i in template){
                    if(!sc[i.charAt(0)] && !map1[i]){
                        o=template[i];
                        if(!r2.test(i)){
                            // collect sub node
                            if(typeof o == 'object'){
                                if(!o.$order)o.$order=0;
                                o.$key=i;
                                a[a.length]=o;
                            }
                        }else
                            b[i]=o;
                    }
                }
                // sort sub node
                a.sort(function(x,y){
                    x=x.$order;y=y.$order;
                    return x>y?1:x==y?0:-1;
                });

                //first
                if(!arr){
                    first=true;
                    arr=[];
                }
                //<span id="" style="">
                arr[arr.length]='<'+tagName+' ';
                for(var i in b)
                    arr[arr.length]=i+'="'+b[i]+'" ';

                //set className bak for tempalte clean
                if(template.className!==null)
                    template.className = bak;

                delete template['class'];

                // add event handler
                if(behavior && (t=behavior.$eventhandler))
                    for(var i in t)
                        if(t[i])
                            arr[arr.length]=i+'="'+t[i]+'" ';

                arr[arr.length]='{attributes}>';

                if(!map2[tagName] && text)
                    arr[arr.length]=text;

                // add sub node
                for(var i=0,l=a.length;i<l;){
                    o=a[i++];
                    self(profile, o, o.$key, obj, arr)
                }

                if(!map2[tagName])
                    arr[arr.length]='</'+tagName+'>';

                if(first){
                    var a0=obj[0],a1=obj[1];
                    arr.join('').replace(r7,function(a,b,c,d){
                        if(b)a0[a0.length]=b;
                        a1[a0.length]=a0[a0.length]=c;
                        if(d)a0[a0.length]=d;
                        return '';
                    });
                }
            },
            _rpt:function(profile,temp){
                var u=linb.UI,
                    me=arguments.callee, key=this.KEY,
                    tag = u.$tag_special,
                    r1=me.r1||(me.r1=new RegExp(u.$ID,'img')),
                    r2=me.r2||(me.r2=new RegExp(tag +'([A-Z0-9]+)_CA'+ tag, 'g')),
                    r3=me.r3||(me.r3=new RegExp(tag +'([A-Z0-9]+)_CC'+ tag, 'g')),
                    r4=me.r4||(me.r4=new RegExp(u.$CLS,'img')),
                    n,t
                ;

                temp = temp.replace(r1, profile.serialId).replace(r4,profile.getClass('KEY'));
                if(n=profile.CA)
                    temp = temp.replace(r2, function(a,b){
                        return (t=n[b])?t:'';
                    });
                else
                    temp = temp.replace(r2, '');

                if(n=profile.CC)
                    temp = temp.replace(r3, function(a,b){
                        return (t=n[b])?t:'';
                    });
                else
                    temp = temp.replace(r3, '');
                return temp;
            },
            build:function(profile, flag){
                var template, t, m,
                    u=linb.UI,
                    temp=[[],[]],
                    self=this,
                    key=self.KEY,
                    cache=linb.cache.template,
                    hash = profile._hash =
                        'a:' + (profile.template._id||'') + ';' +
                        'b:' + (profile.template._did||'') + ';' +
                        'c:' + (profile.behavior._id||'') + ';' +
                        'd:' + (profile.behavior._did||'') + ';' +
                        '!' + (profile._exhash||'');

                //get template
                if(!(template = _.get(cache,[key, hash]))){
                    //setCSSFile
                    if(!self.cssNone)
                        //_.asyRun(function(){
                            self.setCSSFile(self.cssPathKey || key, profile.appearance);
                        //});
                    //get main template
                    u.$buildTemplate(profile,null,null,temp);
                    //split sub template from main template

                    //set main template
                    _.set(cache, [key, hash, ''], temp);
                    //set sub template
                    if(t=profile.template.$dynamic)
                        for(var i in t){
                            if(typeof (m=t[i])!='function'){
                                var temp=[[],[]];
                                for(var j in m)
                                    if(typeof m[j] == 'object')
                                        u.$buildTemplate(profile, m[j], j, temp);
                                m=temp;
                            }
                            _.set(cache, [key,hash,i], m);
                        }

                    template = _.get(cache,[key, hash]);
                }
                if(!template || flag)return '';

                //replace main template
                return self._rpt(profile, u.$doTemplate(profile, template, profile.data));
            },
            subBuild:function(profile, key, arr){
                return this._rpt(profile, linb.UI.$doTemplate(profile, _.get(linb.cache.template,[this.KEY, profile._hash]), arr, key));
            },
            /*
            allow function input, for some css bug
            */
            _setDefaultBehavior:function(hash){
                var f = function(arr, type, mode){
                    var fun = function(profile, e, src){
                        var t,
                            id=src.id,item,
                            cid = profile.getSubSerialId(id),
                            prop = profile.properties,nodes,funs,box;
                        if(prop.disabled)return;
                        item = profile.SubSerialIdMapItem && profile.SubSerialIdMapItem[cid];
                        if(item && item.disabled)return;
                        switch(typeof arr){
                            case 'string':
                                nodes=profile.getSubNode(arr,cid).get();
                                break;
                            case 'function':
                                funs=[arr];
                                break;
                            case 'object':
                                nodes=[];funs=[];
                                for(var o,i=0,l=arr.length;i<l;i++){
                                    o=arr[i];
                                    if(typeof o=='string')
                                        nodes.insertAny(profile.getSubNode(o,cid).get());
                                    else
                                        funs.push(o);
                                }
                        }

                        if(nodes&&nodes.length){
                            nodes=linb(nodes);
                            box=profile.boxing();
                            if(arguments.callee.mode==1){
                                if(type=='mouseover' && profile.beforeHoverEffect)
                                    if(false == box.beforeHoverEffect(profile, item, src, 'mouseover'))
                                        return;
                                if(type=='mousedown' && profile.beforeClickEffect)
                                    if(false == box.beforeClickEffect(profile, item, src, 'mousedown'))
                                        return;

                                //default action
                                profile.addTagClass('KEY', '-'+type, nodes);
                            }else{
                                if(type=='mouseup'){
                                    if(profile.beforeClickEffect && false == box.beforeClickEffect(profile, item, src, 'mouseup'))
                                        return;
                                    profile.removeTagClass('KEY', '-mousedown', nodes);
                                }else{
                                    if(profile.beforeHoverEffect && false == box.beforeHoverEffect(profile, item, src, 'mouseout'))
                                        return;
                                    profile.removeTagClass('KEY', '(-mouseover|-mousedown)', nodes);
                                    //profile.removeTagClass('KEY', '-mousedown', nodes);
                                }
                            }
                            nodes.length=0;
                        }
                        if(funs&&funs.length){
                            funs.each(function(o){
                                _.tryF(o,[profile],profile)
                            });
                            funs.length=0;
                        }
                    };
                    fun.mode=mode;
                    return fun;
                },t;
                if(hash._hoverEffect)
                    _.each(hash._hoverEffect,function(o,i){
                        t=['','KEY','$key'].exists(i)?hash:(hash[i]||(hash[i]={}));
                        if(!o)
                            t.afterMouseover = t.afterMouseout = null;
                        else{
                            t.afterMouseover = f(o,'mouseover', 1);
                            t.afterMouseout = f(o,'mouseout', 2);
                        }
                    });

                if(hash._clickEffect)
                    _.each(hash._clickEffect,function(o,i){
                        t=['','KEY','$key'].exists(i)?hash:(hash[i]||(hash[i]={}));
                        if(!o)
                            t.afterMousedown = t.afterMouseup = null;
                        else{
                            t.afterMousedown = f(o,'mousedown', 1);
                            t.afterMouseup = f(o,'mouseup', 2);
                        }
                    });

                //for onHotKey
                if(hash._keyHook)
                    _.merge(hash,{
                        afterKeydown:function(profile, e, src){
                            if(profile.onHotKeydown){
                                var key = linb.event.getKey(e);
                                return false !== profile.boxing().onHotKeydown(profile,key[0], !!key[1], !!key[2], !!key[3], e, src);
                            }
                        },
                        afterKeypress:function(profile, e, src){
                            if(profile.onHotKeypress){
                                var key = linb.event.getKey(e);
                                return false !== profile.boxing().onHotKeypress(profile,key[0], !!key[1], !!key[2], !!key[3], e, src);
                            }
                        },
                        afterKeyup: function(profile, e, src){
                            if(profile.onHotKeyup){
                                var key = linb.event.getKey(e);
                                return false !== profile.boxing().onHotKeyup(profile,key[0], !!key[1], !!key[2], !!key[3], e, src);
                            }
                        }
                    },'all');

                //for focus action
                if(hash._focusHook)
                    _.each(hash._focusHook,function(o,i){
                        var map=arguments.callee, k, m1=map.m1||(map.m1={KEY:1,$key:1});
                        if(m1[i])return;
                        var m2=map.m2||(map.m2={input:1,textarea:1}),
                        m3=map.m3||(map.m3={tab:1,enter:1,up:1,down:1,left:1,right:1}),
                        m4=map.m4||(map.m4={tab:1,up:1,down:1,left:1,right:1}),
                        t=hash[i]||(hash[i]={});

                        if(null===o)
                            t.afterKeydown = null;
                        else{
                            t.afterKeydown = function(profile, e, src){
                                var k=linb.event.getKey(e), key = k[0], shift=k[2], b=false;
                                if(m2[k=src.tagName.toLowerCase()]){
                                    if(m3[key]){
                                        var reg = linb.UI.getCaretPos(src),txt=src.value;

                                        switch(key){
                                            case 'up':
                                                if(!/[\n\r]/.test(txt.substr(0,reg[0]))) b=true;
                                                break;
                                            case 'left':
                                                if(reg[0]===0 && (reg[1]!==txt.length || reg[1]===0)) b=true;
                                                break;
                                            case 'down':
                                                if(!/[\n\r]/.test(txt.substr(reg[1],txt.length))) b=true;
                                                break;
                                            case 'right':
                                                if(reg[1]===txt.length && (reg[0]!==0 || reg[1]===0)) b=true;
                                                break;
                                            default:
                                                if(k=='input')b=true;
                                        }
                                    }
                                }else
                                    if(m4[key])
                                        b=true;
                                //hanlder focus
                                if(b){
                                    //export event
                                    if(profile.beforeNextFocus && false === profile.boxing().beforeNextFocus(profile,key,shift,e))return false;

                                    if(key!='tab')
                                        linb(src).nextFocus(('up'==key || 'left'==key)?false:true);
                                }
                            }
                        }
                    });
            },

            mapKeys:function(v){
                var self=this;
                v.each(function(i){
                    self.$Keys[i] = self.KEY+ "-" + i;
                })
            },

            setAppearance:function(i,o){
                var t;
                if(t=this.$Appearances[i]){
                    _.merge(t,o,'all');
                }else
                    this.$Appearances[i] = o;
                return this;
            },
            getAppearance:function(key){
                if(typeof key=='string'){
                    return this.$Appearances[key];
                }else
                    return this.$Appearances;
            },
            /*replace mode*/
            setTemplate:function(key, hash, did){
                var self=this, me=arguments.callee,t;
                var build = me.build || (me.build=function(template){
                    var o,s =arguments.callee, r2=s.r2||(s.r2=/[a-z]/) ;
                    for(var i in template){
                        if(!linb.Base.$specialChars[i.charAt(0)])
                            if(!r2.test(i)){
                                /*set keys*/
                                this.$Keys[i] = this.$key+ "-" + i;
                                o=template[i];
                                if(typeof o == 'object')
                                    s.call(this, o)
                            }
                    };
                });
                build.call(self, hash);

                t = self.$Templates;
                t[key] = _.hash(t[key]);

                // for sub template,
                hash._id = key;
                if(typeof did=='string'){
                    hash._did = did;
                    t[key][did]=hash;
                }else
                    t[key]['$']=hash;

                //set sub
                if(t=hash.$dynamic)
                    for(var i in t)
                        for(var j in t[i])
                            me.call(self, key, t[i], j);

                return this;
            },
            getTemplate:function(key,did){
                var self=this;
                if(typeof key=='string'){
                    var r = self.$Templates[key];
                    if(!r){
                        linb.request(linb.getPath(self.KEY, '/'+ key+'.js','template'),'',function(str){
                            self.setTemplate(key, _.unserialize(str), did);
                        },null,null,{asy:false});
                        r = this.$Templates[key];
                    }
                    return r?typeof did=='string'?r[did]:r.$:null;
                }else
                    return self.$Templates;
            },
            /*replace mode*/
            setBehavior:function(key, hash, did){
                //set shortcut first
                this._setDefaultBehavior(hash);

                /*get from Behavior, if not exists, hash it*/
                var check=linb.Base.$specialChars,
                    handler = linb.event.eventhandler,
                    m,n,i,j,o,v, type,
                    t= this.$Behaviors;

                var eventType=linb.event._getEventType,
                    me=arguments.callee, r2=me.r2||(me.r2=/[a-z]/);

                // for sub behavior,
                t[key] = t[key] || {};
                if(typeof did=='string'){
                    t[key][did] = t[key][did] || {};
                    n=t[key][did];
                    n._did = did;
                }else{
                    t[key].$ = t[key].$ || {};
                    n=t[key].$;
                }
                n._id = key;

                if(hash.KEY){
                    _.merge(hash, hash.KEY, 'all');
                    delete hash.KEY;
                }
                /*attach event handler*/
                for(i in hash){
                    o=hash[i];
                    if(!check[i.charAt(0)]){
                        //only two layer
                        if(!r2.test(i)){
                            m=n[i]=_.hash(t[i]);
                            for(j in o){
                                v=o[j];
                                if(!check[j.charAt(0)]){
                                    type = eventType(j);
                                    if(v){
                                        /*set to behavior*/
                                        m[j]=v;
                                        /*add handler*/
                                        (m.$eventhandler || (m.$eventhandler={}))['on'+type]=handler;
                                    }else{
                                        delete m[j];
                                        if(n.$eventhandler)delete n.$eventhandler['on'+type];
                                    }
                                }
                            }
                        }else{
                            type = eventType(i);
                            if(o){
                                /*set to behavior*/
                                n[i]=o;
                                /*add handler*/
                                (n.$eventhandler || (n.$eventhandler={}))['on'+type]=handler;
                            }else{
                                delete n[i];
                                if(n.$eventhandler)delete n.$eventhandler['on'+type];
                            }
                        }
                    }
                }
                return this;
            },
            getBehavior:function(key,did){
                var self=this;
                if(typeof key=='string'){
                    var r = self.$Behaviors[key];
                    if(!r && key!='default'){
                        linb.request(linb.getPath(self.KEY, '/'+ key+'.js','behavior'),'',function(str){
                            self.setBehavior(key, _.unserialize(str), did);
                        },null,null,{asy:false});
                        r = self.$Behaviors[key];
                    }
                    return r?typeof did=='string'?r[did]:r.$:null;
                }else
                    return self.$Behaviors;
            },

            cancelLink:function(e){
                if(!linb.event.getKey(e)[2])
                    return false;
            },
            getCaretPos:function(input){
                input.focus();
                //ie
                if(linb.browser.ie){
                    if(input.tagName=='INPUT'){
                        var i,r = document.selection.createRange().duplicate(),
            			    dr = input.createTextRange();
            			    r.move("character", 0);
            			    dr.move("character", 0);
                			try{
                				dr.setEndPoint("EndToEnd", r);
                				i=String(dr.text).replace(/\r/g, "").length;
                			}catch(e){i=0;}
            			    return [i, i];
            	    }else{
                         var c= "\x01",
                         sel= document.selection.createRange(),
                         txt=sel.text,
                         l=txt.length,
                         dul=sel.duplicate()
                         ;
                         try{dul.moveToElementText(input)}catch(e){}

                         sel.text=txt+c;
                         len=(dul.text.indexOf(c));
                         sel.moveStart('character',-1);
                         sel.text="";
                         if(len==-1)len=input.value.length;
                         return [len,len];
            	    }
                //firefox opera safari
                }else
                    return [input.selectionStart, input.selectionEnd];
            },
            /*
            add css file to head, by key and appearance key
            key: linb.dom.Button-box
            appearance: xp
            */
            setCSSFile:function(key, appearance, flag){
                var self=this,
                    path = linb.getPath(self.KEY, '/'+ appearance+'/css.css','appearance'),t;
                if(!linb.UI.$cache_csspath[path]){
                    /*if no flag, load file
                    */
                    if(t=self.$Appearances[appearance])
                        linb.css.add(self.buildCSSText(t, appearance=='default'?'':appearance),path);
                    else{
                        if(!flag)
                            linb.css.include(path);
                    }
                    linb.UI.$cache_csspath[path]=true;
                }
                return self;
            },
            buildCSSText:function(hash, appearance){
                var self=this, t,v,o,reg,replace,ks;
                var debug=linb.debug,
                    enter = debug?'\n':'',
                    me=arguments.callee,
                    r1=me.r1||(me.r1=/(^|\s|,)([0-9A-Z_]+)/g),
                    r2=me.r2||(me.r2=/\./g),
                    h=[], r=[],
                    browser=linb.browser,
                    ie6=browser.ie6,
                    ie=browser.ie,
                    gek=browser.gek;
                //create css keys
                if(!self.$cssKeys){
                    o=self.$cssKeys={};
                    t=self.$Keys;
                    for(var i in t)
                        o[i]=t[i].replace(r2,'-');
                }
                ks=self.$cssKeys;

                if(appearance){
                    t=ks.KEY.toLowerCase();
                    reg=new RegExp('([\\w]+\\-\\-)?' + t,'g');
                    replace = appearance +'--' + t;
                }
                for(var i in hash){
                    o=hash[i];
                    t=i.replace(r1,function(a,b,c){return  b + '.' + (ks[c]||c)}).toLowerCase();
                    if(appearance)t=t.replace(reg, replace);
                    o.$order=parseInt(o.$order)||0;
                    o.$=t;
                    h[h.length]=o;
                };
                h.sort(function(x,y){
                    x=x.$order;y=y.$order;
                    return x>y?1:x==y?0:-1;
                });

                for(var i=0,l=h.length;i<l;){
                    o=h[i++];
                    r[r.length]=o.$+"{"+enter;
                    //in a {}, add $before<text only> first
                    if(t=o.$before)r[r.length]=enter+t+enter;
                    //in a {}, add $text<text only> next
                    if(t=o.$text)r[r.length]=enter+t+enter;
                    //and, add other hash items
                    for(var j in o){
                        switch(j.charAt(0)){
                            case '$':continue;break;
                            case '_':if(!ie6)continue;break;
                            case '*':if(!ie)continue;break;
                            case '-':if(!gek)continue;break;
                        }
                        //neglect '' or null
                        if((v=o[j])||o[j]===0){
                            if(debug)j = '    ' + j;
                            //put string dir
                            switch(typeof v){
                            case 'string':
                            case 'number':
                                r[r.length]=j+":"+v+";"+enter;break;
                            case 'function':
                                r[r.length]=j+":"+v(self.KEY)+";"+enter;break;
                            //arrray
                            default:
                                v.each(function(k){
                                    //neglect '' or null
                                    if(k)r[r.length]=j+":"+k+";"+enter;
                                });
                            }
                        }
                    }
                    if(v=o.$after)
                        r[r.length]=enter+v+enter;
                    r[r.length]="}"+enter;
                };
                return r.join('');
            },
            pickObj:function(o){
                return _.clone(o, function(i){return i.charAt(0)!='_'});
            },
            dropable:function(key, getDropKeys){
                var self=this,
                    h2=linb.event.eventhandler2;

                if(!getDropKeys)getDropKeys=self.getDropKeys;
                //keep refrence
                (linb.cache.$dropPool[self.KEY] = linb.cache.$dropPool[self.KEY] || []).push(key);
                self.$dropKey = self.$Keys[key];

                //drop base behaviors
                var behaviors = {
                    beforeMouseover:function(profile, e, src){
                        var self=this,
                            dd = linb.dragDrop,
                            key = dd.dragKey,
                            data = dd.data,
                            item,box,t,
                            args
                            ;

                        //not include the dragkey
                        if(!key
                        || !data
                        || !(new RegExp('\\b'+key+'\\b')).test(getDropKeys(profile, self))
                        )return;

                        box=profile.boxing();
                        if(box.getItemByDom)
                            item=box.getItemByDom(src);
                        args = [profile, e, self, key, data, item];
                        if(profile.onDropTest && (false===box.onDropTest.apply(box,args)))
                            return;
                        if((t=profile.$onDropTest) && (false===t.apply(profile,args)))
                            return;
                        //for trigger onDrop
                        dd._current=src;
                        if(profile.onDropMarkShow && (false===box.onDropMarkShow.apply(box,args))){}
                        else if((t=profile.$onDropMarkShow) && (false===t.apply(profile,args))){}
                        else
                            //show region
                            _.resetRun('showDDMark', dd.showDDMark, 0, [self], dd);

                        if(t=profile.$onDragEnter)t.apply(profile,args);
                        if(profile.onDragEnter)box.onDragEnter.apply(box,args);

                        return false;
                    },
                    beforeMouseout:function(profile, e, src){
                        var self=this,
                            dd = linb.dragDrop, key = dd.dragKey, data = dd.data,
                            item, box,
                            args;
                        //not include the dragkey
                        if(dd._current==src){
                            box=profile.boxing();
                            args = [profile, e, self, key, data, item];
                            if(box.getItemByDom)
                                item=box.getItemByDom(src);

                            if(profile.onDropMarkClear && (false===box.onDropMarkClear.apply(box,args))){}
                            else if((t=profile.$onDropMarkClear) && (false===t.apply(profile,args))){}
                            else _.resetRun('showDDMark', dd.showDDMark, 0, [null], linb.dragDrop);

                            if(t=profile.$onDragLeave)t.apply(profile,args);
                            if(profile.onDragLeave)box.onDragLeave.apply(box,args);
                            dd._current=null;
                        }
                        return false;
                    },
                    beforeDrop:function(profile, e, src){
                        var self=this,
                            dd = linb.dragDrop,
                            key = dd.dragKey,
                            data = dd.data,
                            item,
                            box=profile.boxing(),
                            args;
                        if(box.getItemByDom)
                            item=box.getItemByDom(src);
                        args= [profile, e, self, key, data, item];

                        if(profile.onDropMarkClear && (false===box.onDropMarkClear.apply(box,args))){}
                        else if((t=profile.$onDropMarkClear) && (false===t.apply(profile,args))){}
                        //else _.resetRun('showDDMark', dd.showDDMark, 0, [null], linb.dragDrop);

                        if(t=profile.$onDrop)t.apply(profile,args);
                        if(profile.onDrop)box.onDrop.apply(box,args);
                    }
                };
                //attach Behaviors
                _.each(self.$Behaviors,function(o,i){
                    var v;
                    if(key=='KEY'){
                        v=o.$;
                    }else{
                        if(!o.$[key])o.$[key]={};
                        v=o.$[key];
                    }
                    _.merge(v, behaviors, 'all');
                    if(!v.$eventhandler)v.$eventhandler={};
                    _.merge(v.$eventhandler,{
                        onmouseover:h2,
                        onmouseout:h2,
                        ondrop:h2
                    });
                });

                if(!self.prototype.empty)
                self.prototype.empty=function(){
                    return this.each(function(o){
                        o.getSubNode(key).empty();
                    });
                };
                //attach EventHandlers
                self.setEventHandlers({
                    onDragEnter:function(profile, e, node, key, data, item){},
                    onDragLeave:function(profile, e, node, key, data, item){},
                    onDrop:function(profile, e, node, key, data, item){},
                    onDropTest:function(profile, e, node, key, data, item){},
                    onDropMarkShow:function(profile, e, node, key, data, item){},
                    onDropMarkClear:function(profile, e, node, key, data, item){}
                });
                //attach DataModel
                if(!self.$DataModel.dropKeys)
                    self.setDataModel({dropKeys:''});
                return self;
            },
            dragable:function(key, getDragKey, getDragData){
                var self=this,
                    h2=linb.event.eventhandler2;
                if(!getDragKey)getDragKey=self.getDragKey;
                if(!getDragData)getDragData=self.getDragData;
                _.each(self.$Behaviors,function(o,i){
                    var v;
                    if(key=='KEY'){
                        v=o.$;
                    }else{
                        if(!o.$[key])o.$[key]={};
                        v=o.$[key];
                    }
                    _.merge(v, {
                        beforeMousedown:function(profile, e, src){
                            //not resizable or drag
                            if(!profile.properties.dragKey)return;
                            var pos=linb.event.getPos(e);
                            linb([src]).startDrag(e, {
                                drop2:true,
                                icon:linb.ini.path+'ondrag.gif',
                                dragMode:'move',
                                target_left:pos.left+12,
                                target_top:pos.top+12,
                                cursor:'pointer',
                                defer:1,
                                move:false,
                                key: getDragKey(profile, this),
                                data: getDragData(profile, this)
                            });
                        },
                        beforeDragbegin:function(profile, e, src){
                            linb(src).onMouseout(true,{$force:true}).onMouseup(true);
                        }
                    }, 'all');
                    if(!v.$eventhandler)v.$eventhandler={};
                    _.merge(v.$eventhandler,{
                        onmousedown:h2,
                        ondragbegin:h2
                    });
                });
                return self;
            },
            /*copy item to hash, use 'without'
            exception: key start with $
            value(start with $) get a change to get value from lang setting
            */
            copyItem:function(item, hash){
                if(!hash)hash={};
                var i,o,w=linb.wrapRes;
                for(i in item){
                    if(i.charAt(0)=='$')continue;
                    if(!(i in hash))
                        hash[i] = (typeof (o=item[i])=='string' && o.charAt(0)=='$')?w(o.slice(1)):o;
                }
                //todo: change it
                hash.iconDisplay = item.icon?'':'display:none';
                return hash;
            },

            setCacheList:function(listKey, list){
                _.set(linb.cache,['list', 'List', listKey], list);
                return this;
            },
            getCacheListType:function(listKey){
                return typeof _.get(linb.cache,['list', 'List', listKey]);
            },
            getCacheList:function(listKey){
                var r = _.get(linb.cache,['list', 'List', listKey]);
                if(typeof r == 'function')r=r();
                return _.clone(r);
            }
        }
    });
};

//base widget cls
new function(){
    var u='linb.UI.';
    //iWidget cls
    Class(u+"iWidget", ["linb.UI", "linb.iDataBinder"],{
        Instance:{
/*
 setValue:          set value, set $UIvalue, and setCtrlValue       beforeValueSet/afterValueSet
 updateUIValue:     set $UIvalue,and setCtrlValue                   beforeValueUpdated/afterValueUpdated
 updateValue:       set $UIvalue to value

 setCtrlValue:      change control appearance           *nedd custom

 getValue:          return value
 getUIValue:        return $UIvalue
 getCtrlValue:      get value from control              *nedd custom

 setDirtyMark: mark UI ctrl when value!==UIvalue

 resetValue: reset value,UIvalue,Ctrlvalue not trigger event
*/
            getValue:function(){return this.get(0).properties.value},
            getUIValue:function(){return this.get(0).properties.$UIvalue},
            //return ui value for default
            getCtrlValue:function(){return this.get(0).properties.$UIvalue},

            setUIValue:function(value){this.get(0).properties.$UIvalue=value; return this;},
            setCtrlValue:function(value){return this},
            setDirtyMark:function(){return this},
            resetValue:function(value){
                var self=this;
                self.setCtrlValue(value||'');
                self.each(function(profile){
                    profile.properties.$UIvalue = profile.properties.value = value||'';
                    profile.inValid=1;
                });
                self.setDirtyMark();
                return self;
            },

            updateUIValue:function(value, force){
                var self=this;
                this.each(function(profile){
                    var prop=profile.properties, r,
                        ovalue = prop.$UIvalue,
                        box = profile.boxing();
                    if(ovalue !== value || force){
                        if(
                            false===profile.box.checkValid(profile, value) ||
                            (profile.beforeValueUpdated && false===(r=box.beforeValueUpdated(profile, ovalue, value)))
                          )
                            return;
                        if(typeof r!='undefined')value=r;
                        if(profile.domNode)box.setCtrlValue(value);
                        prop.$UIvalue = value;
                        if(profile.domNode)box.setDirtyMark();
                        if(profile.afterValueUpdated)box.afterValueUpdated(profile, ovalue, value);
                    }
                });
                return this;
            },
            updateValue:function(){
                this.each(function(profile){
                    var prop = profile.properties;
                    prop.value = prop.$UIvalue;
                });
                return this.setDirtyMark();
            },
            isDirtied:function(){
                var p = this.get(0).properties;
                return p.value !== p.$UIvalue;
            },
            checkUIValueValid:function(){
                var r=true;
                this.each(function(profile){
                    var prop=profile.properties;
                    //r must be at the end
                    r = profile.box.checkValid(profile, prop.$UIvalue) && r;
                    if(profile.domNode)
                        profile.boxing().setDirtyMark();
                });
                return r;
            },
            disabled:function(value){
                return this.each(function(o){
                    o.root.opacity(value?0.5:1);
                });
            }
        },
        Static:{
            $i:true,
            DataModel:{
                $UIvalue:'',
                tag:'',
                tagVar:{
                    ini:{}
                },
                dragKey:'',
                // setValue and getValue
                value:{
                    ini:null,
                    set:function(value, flag){
                        this.each(function(profile){
                            var p=profile.properties,r,
                                ovalue = p.value,
                                box=profile.boxing();
                            //check value
                            if(ovalue!==value || flag){
                                //check format
                                if(profile.box.checkValid(profile, value)===false)return;
                                //if return false in beforeValueSet, not set
                                if(profile.beforeValueSet && false=== (r=box.beforeValueSet(profile, ovalue, value)))return;

                                if(typeof r!='undefined')value=r;
                                //set to UI/ctrl
                                if(profile.domNode)box.setCtrlValue(value);

                                p.value = p.$UIvalue = value;

                                profile.inValid=1;
                                if(profile.domNode)box.setDirtyMark();
                                if(profile.afterValueSet)box.afterValueSet(profile, ovalue, value);
                            }
                        });
                        return this;
                    }
                },
                disabled:{
                    ini:false,
                    action: function(v){
                        this.boxing().disabled(v);
                    }
                },
                dock:{
                    ini:'none',
                    listbox:['none','top','bottom','left','right','center','middle','origin','width','height','fill','cover'],
                    action:function(v){
                        var self=this;
                        if(self.domNode)
                            self.box.dock(self,true);
                    }
                },
                exDock:{
                    ini:false,
                    action:function(v){
                        var self=this;
                        if(!v && self.domNode && self.properties.dock!='none')
                                self.box.dock(self,true,true);
                    }
                },
                dockOrder:{
                    ini: 1,
                    action:function(v){
                        var self=this;
                        if(self.domNode && self.properties.dock!='none')
                            self.box.dock(self,true,true);
                    }
                },
                dockMargin:{
                    ini:{left:0,top:0,right:0,bottom:0},
                    action:function(v){
                        var self=this;
                        if(self.domNode && self.properties.dock!='none')
                            self.box.dock(self,true,true);
                    }
                },
                dockFloat:{
                    ini:false,
                    action:function(v){
                        var self=this;
                        if(self.domNode && self.properties.dock!='none')
                            self.box.dock(self,true,true);
                    }
                },
                dockMinW:0,
                dockMinH:0,
                tips:''
            },
            Behaviors:{'default':{}},
            EventHandlers:{
                beforeValueSet:function(profile, oldValue, newValue, showValue){},
                afterValueSet:function(profile, oldValue, newValue, showValue){},
                beforeValueUpdated:function(profile, oldValue, newValue, showValue){},
                afterValueUpdated:function(profile, oldValue, newValue, showValue){},

                //for appearance when mouseover/mouseout
                beforeHoverEffect:function(profile, item, src, type){},
                //for appearance when mousedown/mouseup
                beforeClickEffect:function(profile, item, src, type){},

                beforeNextFocus:function(profile, e, src){},

                afterCreated:function(profile){},
                afterRendered:function(profile){},
                beforeDestroy:function(profile){},

                onHotKeydown:function(profile, key, control, shift, alt, e, src){},
                onHotKeypress:function(profile, key, control, shift, alt, e, src){},
                onHotKeyup:function(profile, key, control, shift, alt, e, src){}
            },
            createdTrigger:function(){
                var self=this, b=self.boxing(),p=self.properties;

                if(typeof p.value !='undefined')
                    b.setCtrlValue(p.value);

                if(p.disabled)
                    b.disabled(true);

                self.inValid=1;
                self.created=true;
                if(self.afterCreated)
                    b.afterCreated(self);
            },
            renderedTrigger:function(){
                var me=arguments.callee, self=this, b=self.boxing(),p=self.properties,s=self.box;

                //resize first
                if(s.resize){
                    var wc=me.wc||(me.wc={top:1,bottom:1,width:1,fill:1,cover:1}),
                    hc=me.hc||(me.hc={left:1,right:1,height:1,fill:1,cover:1});
                    wc=wc[p.dock]?null:p.width;
                    hc=hc[p.dock]?null:p.height;
                    if(wc!==null || hc!==null)
                        s.resize(self, wc, hc);
                }
                if(p.dock && p.dock != 'none')
                    s.dock(this,true);

                if(self.afterRendered)
                    b.afterRendered(self);
            },
            dock:function(profile, flag, force){
                var prop = profile.properties,
                    margin=prop.dockMargin,
                    node = profile.root,
                    value = prop.dock || 'none',
                    p= node.parent(),
                    auto = 'auto',
                    pid=p.id(),
                    order=function(x,y){
                        x=parseInt(x.properties.dockOrder)||0;y=parseInt(y.properties.dockOrder)||0;
                        return x>y?1:x==y?0:-1;
                    },
                    win=false,
                    region,
                    inMatix='$inMatix',
                    f,t,
                    //for ie6 1px bug
                    _adjust=function(v){return linb.browser.ie6?v-v%2:v}


                //attached to matix
                if(linb.dom.isMatix(pid))
                    return;

                if(profile.$dockParent!=pid || profile.$dockType != value || force){
                    profile.$dockParent=pid;
                    profile.$dockType = value;

                    //unlink first
                    profile.antiLinks('$dock');
                    profile.antiLinks('$dock1');
                    profile.antiLinks('$dock2');

                    //set the fix value first
                    switch(value){
                        case 'middle':
                            region={right:auto, bottom:auto,left:prop.left||'',width:prop.width||'',height:prop.height||''};
                            break;
                        case 'center':
                            region={right:auto, bottom:auto,top:prop.top||'',width:prop.width||'',height:prop.height||''};
                            break;
                        case 'origin':
                            region={right:auto, bottom:auto,width:prop.width||'',height:prop.height||''};
                            break;
                        case 'top':
                            region={left:margin.left, right:margin.right, bottom:auto, height:prop.height||''};
                            //width top
                            break;
                        case 'bottom':
                            region={left:margin.left, right:margin.right, top:auto, height:prop.height||''};
                            //width bottom
                            break;
                        case 'left':
                            region={right:auto,width:prop.width||''};
                            //height top left
                            break;
                        case 'right':
                            region={left:auto,width:prop.width||''};
                            //height top right
                            break;
                        case 'width':
                            region={bottom:auto,height:prop.height||'',top:prop.top||''};
                            //width left
                            break;
                        case 'height':
                            region={right:auto,width:prop.width||'',left:prop.left||''};
                            //height top
                            break;
                        case 'fill':
                        case 'cover':
                            region={right:auto,bottom:auto};
                            break;
                        case 'none':
                            region={left:prop.left, top:prop.top, width:prop.width||'',height:prop.height||''};
                            break;
                    }
                    node.setRegion(region,true);
                    //if in body, set to window
                    if(p.get(0)===document.body){
                        p=linb([window]);
                        win=true;
                        if(win && !linb.cache._resizeTime)linb.cache._resizeTime=1;
                    }
                    //set dynamic part
                    if(value != 'none'){
//                        if(!win)p.setStyle('overflow','hidden');

                        f = p.getEvent('onRewh','dock');
                        if(!f){
                            f=function(p,arg){
                                //get self vars
                                var me=arguments.callee,
                                    map=me.map ||(me.map={middle:1,center:1}),
                                    arr = me.arr,
                                    rePos=me.rePos,
                                    node=me.node,
                                    style=node.get(0).style,
                                    win=me.win,
                                    obj,i,k,o,key,target
                                ;
                                //window resize: check time span, for window resize in firefox
                                //force call when input $dockid
                                //any node resize
                                if( arg.$dockid || !win || (_() - linb.cache._resizeTime > 100)){
                                    //recruit call, give a short change
                                    obj = {left:0,top:0,right:0,bottom:0,width:parseInt(style&&style.width)||node.width(),height:parseInt(style&&style.height)||node.height()};

                                    for(k=0;key=arr[k++];){
                                        target = me[key];
                                        if(target.length){
                                            if(!map[key])arg.width=arg.height=1;
                                            for(i=0;o=target[i++];)
                                                if(!o.properties.exDock)
                                                    rePos(o, obj, key, arg.$dockid, win||arg.width, win||arg.height);

                                        }
                                    }
                                    if(obj.later){
                                        _.each(obj.later, function(o){
                                            //for safari
                                            try{
                                                o.node.setRegion(o, true, true);
                                            }catch(e){
                                                _.asyRun(function(){
                                                    o.width+=1;o.height+=1;
                                                    o.node.setRegion(o, true, true);
                                                })
                                            }
                                        });
                                    }

                                    //if window resize, keep the timestamp
                                    if(win)
                                        linb.cache._resizeTime = _();
                                }
                            };
                            //self refrence
                            f.node=p;
                            f.arr=['top','bottom','left','right','center','middle','width','height'];
                            f.arr.each(function(key){
                                f[key]=[];
                            });
                            //is window resizer
                            f.win = win;
                            f.rePos=function(profile, obj, value, id, w, h){
                                //if $dockid input, and not the specific node, return
                                var flag=false;
                                if(id && profile.$id!=id)flag=true;
                                var prop = profile.properties,
                                    flt=prop.dockFloat,
                                    margin = prop.dockMargin,
                                    node = profile.root,
                                    style = profile.domNode.style,
                                    left, top, right, bottom,temp, other,
                                    x = parseInt(prop._dockBorderWidth) || 0,
                                    y = parseInt(prop._dockBorderHeight) || 0,
                                    region={}
                                    ;
                                //top/bottom/left/right must be set by order first
                                switch(value){
                                    case 'middle':
                                        //use height() is ok
                                        node.top((obj.height - node.height())/2);
                                        break;
                                    case 'center':
                                        node.left((obj.width - node.width())/2);
                                        break;
                                    case 'top':
                                        if(!flag){
                                            left=margin.left;
                                            right=margin.right;
                                            top=(flt?0:obj.top)+margin.top;
                                            if(parseFloat(style.top)!=top)region.top=top;
                                            temp=obj.width - left - right - x;
                                            if(parseFloat(style.width)!=temp)region.width=_adjust(temp);
                                            if(!_.isEmpty(region))node.setRegion(region,true);
                                        }
                                        if(!flt)
                                            obj.top += (node.offsetHeight() + margin.top + margin.bottom);
                                        break;
                                    case 'bottom':
                                        if(!flag){
                                            left=margin.left;
                                            right=margin.right;
                                            bottom=(flt?0:obj.bottom)+margin.bottom;
                                            if(parseFloat(style.bottom)!=bottom)region.bottom=bottom;
                                            temp=obj.width - left - right - x;
                                            if(parseFloat(style.width)!=temp)region.width=_adjust(temp);
                                            if(!_.isEmpty(region))node.setRegion(region,true);
                                        }
                                        if(!flt)
                                            obj.bottom += (node.offsetHeight() + margin.top + margin.bottom);
                                        break;
                                    case 'left':
                                        if(!flag){
                                            left=(flt?0:obj.left)+margin.left;
                                            top=(flt?0:obj.top)+margin.top;
                                            bottom=(flt?0:obj.bottom)+margin.bottom;
                                            if(parseFloat(style.left)!=left)region.left=left;
                                            if(parseFloat(style.top)!=top)region.top=top;
                                            temp=obj.height - top - bottom - y;
                                            if(parseFloat(style.height)!=temp)region.height=_adjust(temp);
                                            if(!_.isEmpty(region))node.setRegion(region,true);
                                        }
                                        if(!flt)
                                            obj.left += (node.offsetWidth() + margin.left + margin.right);
                                        break;
                                    case 'right':
                                        //if no top/bottom and change w only
                                        if(!flag){
                                            right=(flt?0:obj.right)+margin.right;
                                            top=(flt?0:obj.top)+margin.top;
                                            bottom=(flt?0:obj.bottom)+margin.bottom;
                                            if(parseFloat(style.right)!=right)region.right=right;
                                            if(parseFloat(style.top)!=top)region.top=top;
                                            temp=obj.height - top - bottom - y;
                                            if(parseFloat(style.height)!=temp)region.height=_adjust(temp);
                                            if(!_.isEmpty(region))node.setRegion(region,true);
                                        }
                                        if(!flt)
                                            obj.right += (node.offsetWidth() + margin.left + margin.right);
                                        break;
                                    case 'width':
                                        //if no top/bottom/left/right and change h only
                                        if(!w)return;
                                        left = (prop.dock=='cover'?0:(flt?0:obj.left)) + margin.left;
                                        right = (prop.dock=='cover'?0:(flt?0:obj.right))  + margin.right;
                                        top = prop.dock=='width'?(parseInt(prop.top) || 0):( (prop.dock=='cover'?0:(flt?0:obj.top)) + margin.top);
                                        //later call for w/h change once
                                        temp=obj.width - left - right - x;
                                        obj.later=obj.later||{};
                                        obj.later[profile.$id] = obj.later[profile.$id] || {};
                                        _.merge(obj.later[profile.$id],{
                                            node:node,
                                            width: _adjust(prop.dockMinW?Math.max(prop.dockMinW,temp):temp),
                                            left:left,
                                            top:top
                                        },'all');
                                        break;
                                    case 'height':
                                        //if no top/bottom/left/right and change w only
                                        if(!h)return;
                                        top = (prop.dock=='cover'?0:(flt?0:obj.top)) + margin.top;
                                        bottom = (prop.dock=='cover'?0:(flt?0:obj.bottom))  + margin.bottom;
                                        left = prop.dock=='height'?(parseInt(prop.left) || 0):((prop.dock=='cover'?0:(flt?0:obj.left))+ margin.left);
                                        //later call for w/h change once
                                        temp=obj.height - top - bottom - y;
                                        obj.later=obj.later||{};
                                        obj.later[profile.$id] = obj.later[profile.$id] || {};
                                        _.merge(obj.later[profile.$id],{
                                            node:node,
                                            height: _adjust(prop.dockMinH?Math.max(prop.dockMinH,temp):temp),
                                            left:left,
                                            top:top
                                        },'all');

                                        break;
                                }
                            };

                            //add handler to window or node
                            p.onRewh(f,'dock');
                        }
                        //set link to node
                        if(value=='fill' || value=='cover'){
                            profile.links(f.height, '$dock1');
                            profile.links(f.width, '$dock2');
                            f.height.sort(order);
                            f.width.sort(order);
                        }else if(value=='origin'){
                            profile.links(f.center, '$dock1');
                            profile.links(f.middle, '$dock2');
                        }else{
                            profile.links(f[value], '$dock');
                            f[value].sort(order);
                        }

                        //
                        linb.cache._resizeTime=1;

                        //set shortuct
                        profile.$dock=f;
                    }//else{
                        //delete overflow form style
//                        if(!win)p.setStyle('overflow', '');
                    //}
                }
                //run once now
                if(value != 'none' && flag)
                    profile.$dock(profile, {width:1, height:1, $dockid:['width','height','fill','cover'].exists(value)?profile.$id:null, $type: value});
            },
            checkValid:function(profile, value){
                return true;
            },
            beforeSerialized:function(profile){
                var r=profile.boxing(),b,
                o = profile.copy(),
                p = o.properties = _.copy(profile.properties);

                switch(p.dock){
                    case 'top':
                    case 'bottom':
                        delete p.width;delete p.left;delete p.top;delete p.right;delete p.bottom;
                        break;
                    case 'left':
                    case 'right':
                        delete p.height;delete p.left;delete p.top;delete p.right;delete p.bottom;
                        break;
                    case 'width':
                        delete p.width;
                        break;
                    case 'height':
                        delete p.height;
                        break;
                    case 'fill':
                    case 'cover':
                        delete p.width;delete p.height;
                        break;
                }

                if(p.items && p.items.length){
                    t=linb.Base.$specialChars;
                    p.items = _.clone(p.items,function(i){return !t[i.charAt(0)]});
                }

                if(p.listKey && !p.$first)p.items.length=0;

                return o;
            },
            getDropKeys:function(profile,node){
                return profile.properties.dropKeys;
            },
            getDragKey:function(profile,node){
                return profile.properties.dragKey;
            },
            getDragData:function(profile,node){
                return {
                    profile:profile,
                    domId:node.id
                };
            },
            prepareData:function(profile,flag){
                var prop = profile.properties,
                    data = profile.data,
                    dm = this.getDataModel(),
                    me = arguments.callee,
                    map = me.map || (me.map='left,top,bottom,right,width,height'.toArr()),
                    a=[''],
                    t
                    ;

                //can't input id in properties
                if(prop.id)delete prop.id;

                //give default caption
                if('caption' in dm && prop.caption!==null)
                    prop.caption = prop.caption==undefined ? profile.alias : prop.caption;

                //give border width
                if('$border' in dm){
                    data.bWidth=prop.width - (t=(prop.$border||0)*2);
                    data.bHeight=prop.height - t;
                }
                //set left,top,bottom,right,width,height,position,z-index,visibility,display
                for(var j=0,i;i=map[j];j++){
                    if(prop[i] || prop[i]===0){
                        if(String(parseFloat(prop[i]))==String(prop[i]))
                            a[a.length]=i+':'+(parseInt(prop[i])||0)+'px';
                        else if(prop[i]!='auto' && prop[i])
                            a[a.length]=i+':'+prop[i];
                    }
                }
                if(prop.position)a[a.length] = 'position:'+prop.position;
                if(prop.visibility)a[a.length]= 'visibility:'+prop.visibility;
                if(prop.zIndex)a[a.length]= 'z-index:'+prop.zIndex;
                if(prop.display)a[a.length]= 'display:'+ (prop.display=='inline-block'? linb.browser.gek?'-moz-inline-block;display:-moz-inline-box':'inline-block' :prop.display)
                a[a.length]= '';
                data._style = a.join(';');

                if('href' in dm)data.href = prop.href || 'javascript:;';
                if('tabindex' in dm)data.tabindex = prop.tabindex || '-1';
                if('items' in dm){
                    profile.ItemIdMapSubSerialId = {};
                    profile.SubSerialIdMapItem = {};

                    //if items is [], give a new one
                    if((t=prop.items) && t.constructor == Array && t.length===0){
                        t=prop.items=[];
                    }
                    //if items is {}, give some text data
                    if(!t || t.constructor != Array)
                        t=prop.items = linb.UI.getCacheList(prop.listKey||(this.$recursive?'test1':'test2'));
                    //ensure format
                    if(!t || t.constructor != Array)
                        t=prop.items=[];

                    data.items = this.prepareItems(profile, t);
                }

                //default prepare
                data =  linb.UI.copyItem(prop, data);

                profile.prepared=true;
                return data;
            },
            prepareItems:function(profile, items, pid){
                var result=[],
                    item,dataItem,
                    SubID=linb.UI.subSerialIdTag,id ,
                    tabindex = profile.properties.tabindex;
                //set map
                for(var i=0,l=items.length;i<l;i++){
                    item=items[i];

                    dataItem={id: item.id, _tabindex:tabindex};
                    if(pid)dataItem._parent = pid;

                    id=profile.pickSubId('items');
                    //give item subid
                    dataItem[SubID] = profile.ItemIdMapSubSerialId[item.id] = id;
                    profile.SubSerialIdMapItem[id] = item;

                    //others
                    linb.UI.copyItem(item, dataItem);

                    if(this.prepareItem)
                        this.prepareItem(profile, dataItem, item, pid);
                    result.push(dataItem);
                }

                return result;
            }
        },
        Initialize:function(){
            var self=this, hash={};
            'left,top,width,height,right,bottom'.toArr().each(function(o){
                hash[o] = {
                    ini:'auto',
                    action:function(value){
                        var self=this,
                            p=self.properties,b=false,
                            args={$type:p.dock};
                        if(self.domNode){
                            switch(p.dock){
                                case 'top':
                                    if(o!='height'&&o!='top')return;
                                    args.width=args.height=1;
                                    break;
                                case 'bottom':
                                    if(o!='height'&&o!='bottom')return;
                                    args.width=args.height=1;
                                    break;
                                case 'left':
                                    if(o!='width'&&o!='left')return;
                                    args.width=args.height=1;
                                    break;
                                case 'right':
                                    if(o!='width'&&o!='right')return;
                                    args.width=args.height=1;
                                    break;
                                case 'width':
                                    if('width'==o)return;
                                    args.width=1;
                                    break;
                                case 'height':
                                    if('height'==o)return;
                                    args.height=1;
                                    break;
                                case 'fill':
                                case 'cover':
                                    if(o=='width'&&o=='height')return;
                                    args.width=args.height=1;
                                    break;
                            }
                            self.root[o](value);
                            if(p.dock!='none')_.tryF(self.$dock,[self, args],self);
                        }
                    }
                }
            });
            _.merge(hash,{
                //invalid after dom domNode
                zIndex:{
                    ini:1,
                    action:function(value){
                        if(this.domNode)
                            this.root.zIndex(value);
                    }
                },
                tabindex:{
                    ini:1
                },
                position:{
                    ini : 'absolute',
                    listbox:['relative','absolute'],
                    action:function(value){
                        if(this.domNode)
                            this.root.position(value);
                    }
                },
                visibility:{
                    ini:'',
                    combobox:['','visible','hidden'],
                    action:function(value){
                        if(this.domNode)
                            this.root.visibility(value);
                    }
                },
                display:{
                    ini:'',
                    combobox:['','none','block','inline','inline-block'],
                    action:function(value){
                        if(this.domNode){
                            if(value=='inline-block')
                                this.root.inlineBlock(true);
                            else
                                this.root.display(value);
                        }
                    }
                }
            });

            self.setDataModel(hash);
            'left,top,width,height,right,bottom,zIndex,position,visibility'.toArr().each(function(key){
                var n='refresh'+key.initial();
                self.prototype[n] = Class._fun(function(){
                    var self=this;
                    self.each(function(profile){
                        var t = (profile.domNode)?profile.root[key]():profile.properties[key];
                        self['set'+key.initial()](t);
                    });
                    return self['get'+key.initial()]();
                },n,self.KEY);;
            });
        }
    });

    //Widget cls
    Class(u+"Widget", u+"iWidget",{
        Static:{
            $i:true,
            cssNone:false,
            Templates:{'default':{
                className:'linb-uishell ',
                style:'{_style}',
                FRAME:{
                    className:'linb-uiframe ',
                    BORDER:{
                        style:'width:{bWidth}px;height:{bHeight}px;',
                        className:'linb-uiborder '
                    }
                }
            }},
            PublicAppearance:{
                '.linb-uishell':{
                    display:linb.browser.gek?['-moz-inline-block', '-moz-inline-box']: 'inline-block',
                    overflow:'hidden',
                    /*opera must be 0 not 'none'*/
                    border:0,
                    padding:0,
                    margin:0
                },
                /*span*/
                '.linb-uiframe':{
                    $order:1,
                    display:'block',
                    position:'relative',
                    overflow:'hidden',
                    border:0,
                    padding:0,
                    margin:0,
                    width:'100%',
                    height:'100%',
                    '-moz-box-flex':'1'
                },
                /*span*/
                '.linb-uiborder':{
                    $order:2,
                    display:'block',
                    position:'absolute',
                    border:0,
                    padding:0,
                    margin:0,
                    left:0,
                    top:0,
                    width:'100%',
                    height:'100%'
                }
            },
            Behaviors:{'default':{
                _keyHook:true,
                onRewh:function(profile, e, src){
                    //if fire onresize ,w/h must be set to style
                    var style = profile.domNode.style ,w=null,h=null;
                    if(e.width)
                        w=parseInt(style.width)||0;
                    if(e.height)
                        h=parseInt(style.height)||0;
                    profile.box.resize(profile, w, h);
                }
            }},
            DataModel:{
                // setCaption and getCaption
                caption:{
                    // ui update function when setCaption
                    action: function(value){
                        this.getSubNode('CAPTION').html(value);
                    }
                },
                // setIcon and getIcon
                icon:{
                    ini:'',
                    action: function(value){
                        this.getSubNode('ICON')
                            .display(value?'':'none')
                            .setStyle('backgroundImage','url('+(value||'')+')');
                    }
                },
                iconPos:{
                    ini:'',
                    action: function(value){
                        this.getSubNode('ICON')
                            .setStyle('backgroundPosition', value);
                    }
                },
                //hide props
                $paddingTop:0,
                $paddingLeft:0,
                $paddingBottom:0,
                $paddingRight:0,
                $border:0
            },

            createdTrigger:function(){
                var self=this, p=self.properties, o=self.boxing();

                p.$UIvalue = p.value;
                if(p.disabled)o.disabled(true);

                //for performance
                _.asyRun(function(){
                    if((!self.$noB) && p.border && o._border)o._border(p.border);
                    if((!self.$noR) && p.resizable && o.setResizable)o.setResizable(p.resizable,true);
                    if((!self.$noS) && p.shadow && o._shadow)o._shadow(p.shadow);
                });

            },
            resize:function(profile,w,h){
                var o = profile.getSubNode('BORDER'), t = profile.properties,
                    left=null,top=null,width=null,height=null;
                if(null!==w){
                    w -= (t.$border*2 + t.$paddingLeft + t.$paddingRight);
                    /*for ie6 bug*/
                    /*for example, if single number, 100% width will add 1*/
                    /*for example, if single number, attached shadow will overlap*/
                    if(linb.browser.ie6)w=(parseInt(w/2))*2;
                    left=t.$paddingLeft;
                    width=w;
                }
                if(null!==h){
                    h -= (t.$border*2 + t.$paddingTop + t.$paddingBottom);
                    if(linb.browser.ie6)h=(parseInt(h/2))*2;
                    top = t.$paddingTop;
                    height=h;

                    /*for ie6 bug*/
                    if(linb.browser.ie6&&null===w)o.ieTrigger();
                }
                o.setRegion({left:left,top:top,width:width,height:height});
                return { width :width, height :height};
            }
        }
    });

    //iXX cls
    //iList cls
    Class(u+"iList", "linb.UI",{
        Instance:{
            activate:function(){
                var profile = this.get(0),
                    items = profile.getSubNode('ITEM',true);
                if(!items.isEmpty())
                    items.focus();
                return this;
            },
            /*
            [x] ,valid id   ,true  => insert [x] before node
            [x] ,valid id   ,false => insert [x ]after node
            [x] ,invalid id ,true  => insert [x ] to head
            [x] ,invalid id ,false => insert [x ] to tail
            [x] => html([x ])
            */
            insertItems:function(arr, base, before){
                if(!arr || !arr.length)return;
                var self = this.constructor,
                    node,
                    items, index, r,
                    data,box,
                    b=this.afterInsertItems;
                return this.each(function(profile){
                    box=profile.box;
                    items = profile.properties.items;
                    index = items.subIndexOf('id',base);
                    if(index==-1){
                        items.insertAny(arr);
                    }else
                        items.insertAny(arr, before?index:index+1);

                    // prepare properties format
                    data = box.prepareItems(profile, arr, base);
                    //if in dom, create it now
                    if(profile.domNode){
                        var ss=self.subBuild(profile, 'items', data);
                        if(index==-1){
                            //if no base specified, use innerHtml dir
                            node = profile.getSubNode(box.ITEMSKEY || profile.keys.ITEMS || profile.keys.KEY);

                            if(typeof before=="boolean"){
                                r=ss.toDom();
                                //items.length==1 for that one have fake item(for example: editable poll)
                                if(before||items.length==1)
                                    node.addFirst(r);
                                else
                                    node.addLast(r);
                            }else
                                node.html(ss);
                        }else{
                            r = ss.toDom();
                            node=profile.getSubNodeByItemId(box.ITEMKEY || 'ITEM', base);
                            if(before===true)
                                node.addPre(r);
                            else
                                node.addNext(r);
                        }
                    }
                    if(b)profile.boxing().afterInsertItems(profile, data, base, before);
                });
            },
            removeItems:function(arr){
                if(!(arr instanceof Array))arr=[arr];
                var obj,v,
                    b=this.beforeRemoveItems;
                    remove=function(profile, arr, target, ns, force){
                        var self=arguments.callee;
                        if(!ns)ns=linb([]);
                        arr.filter(function(o){
                            var serialId,b;
                            if(force || (b=target.exists(o.id))){
                                if(serialId=profile.ItemIdMapSubSerialId[o.id]){
                                    // clear maps
                                    delete profile.SubSerialIdMapItem[serialId];
                                    delete profile.ItemIdMapSubSerialId[o.id];
                                    profile.cacheSubId(serialId, 'items');

                                    //parent node is deleted
                                    if(!force)
                                        if(!(obj = profile.getSubNode('ITEM', serialId) ).isEmpty() )
                                            ns.add(obj);
                                }
                            }
                            //check sub
                            if(o.sub)self(profile, o.sub, target, ns, force || b);
                            //filter it
                            if(b){
                                for(var i in o)o[i]=null;
                                return false;
                            }
                        },null,true);
                        ns.remove();
                    };
                if(b)profile.boxing().beforeRemoveItems(profile, arr);
                return this.each(function(profile){
                    // clear properties
                    remove(profile, profile.properties.items, arr);

                    // clear value
                    if(v=profile.properties.value){
                        if((v=v.split(';')).length>1){
                            v.filter(function(o){
                                return !arr.exists(o);
                            });
                            profile.properties.value=v.join(';');
                        }else{
                            if(arr.exists(profile.properties.value))
                                profile.properties.value=null;
                        }
                    }
                });
            },
            clearItems:function(key){
                return this.each(function(profile){
                    if(!profile.SubSerialIdMapItem)return;
                    //empty dom
                    profile.getSubNode(profile.keys[key] || profile.keys.ITEMS || 'KEY', true).empty();
                    //save subid
                    _.each(profile.SubSerialIdMapItem, function(o,serialId){
                        profile.cacheSubId(serialId, 'items');
                    });
                    //delete items
                    if(profile.properties.items)profile.properties.items.length=0;
                    //clear cache
                    profile.SubSerialIdMapItem={};
                    profile.ItemIdMapSubSerialId={};

                    //set value
                    profile.properties.value=null;
                });
            }
        },
        Initialize:function(){
            var
            a1={id:'a',caption:'itema',tips:'item a'},
            a2={id:'b',caption:'itemb',tips:'item b'},
            a3={id:'c',caption:'itemc',tips:'item c'},
            a0={id:'a',caption:'itema',tips:'item a', sub:[
                {id:'aa',caption:'suba'},
                {id:'ab',caption:'subb'}
            ]};
            this
            .setCacheList('test1', [a0,a2,a3])
            .setCacheList('test2', [a1,a2,a3]);

            'getItemByItemId,getItemByDom,getIdBySubId,getSubSerialIdByItemId'.toArr().each(function(s){
                this[s]=function(){
                    var t=this.get(0);
                    return t[s].apply(t,arguments);
                };
            },this.prototype);
        },
        Static:{
            $i:true,
            cssNone:true,
            DataModel:{
                listKey:{
                    ini:'',
                    set:function(v, flag){
                        return this.each(function(o){
                            if(o.properties.listKey != v || flag){
                                var t = linb.UI.getCacheList(v);
                                if(t)
                                    o.boxing().setItems(t);
                                else
                                    o.boxing().setItems(o.properties.items);
                                o.properties.listKey = v;
                            }
                        });
                    }
                },
                items:{
                    //for default merge
                    ini:{},
                    set:function(v){
                        return this.each(function(o){
                            if(o.domNode)o.boxing().clearItems().insertItems(v);
                            o.properties.items = v;
                        });
                    }
                }
            },
            //
            showTips:function(profile, node, pos){
                var t=profile.properties,
                    id=node.id,
                    sid=profile.getSubSerialId(id),
                    map=profile.SubSerialIdMapItem,
                    item=map&&map[sid];

                if(t.disabled)return;
                if(item && item.disabled)return;
                if(item && item.tips){
                    linb.UI.Tips.show(pos, item);
                    return true;
                }else
                    return false;
            }
        }
    });

    'iContainer,iForm,iMisc,iNavigator,iSchedule'.toArr().each(function(i){
        Class(u+i,null,{
            Static:{
                $i:true
            }
        });
    });

    Class(u+"Link", u+"iWidget",{
        Static:{
            cssNone:true,
            Templates:{'default':{
                tagName:'a',
                style: 'text-decoration:underline;{_style}',
                href :"{href}",
                tabindex: '{tabindex}',
                text:'{caption}'
            }},
            Behaviors:{'default':{
                onClick:function(profile, e, src){
                    if(profile.onClick)
                        return profile.boxing().onClick(profile, e, src);
                    //return profile.box.cancelLink(e);
                }
            }},
            DataModel:{
                dataBinder:null,
                dataField:null,
                caption:{
                    action:function(v){
                        this.root.text(v);
                    }
                },
                href:{
                    ini:'javascript:;',
                    action:function(v){
                        if(this.domNode)
                            this.root.href(v);
                    }
                }
            }
            ,
            EventHandlers:{
                onClick:function(profile, e){}
            }
        }
    });
    Class(u+"Div", u+"iWidget",{
        Static:{
            cssNone:true,
            Templates:{'default':{
                tagName:'div',
                style:(linb.browser.gek?'overflow:auto;outline:none;':'')+'{_style}',
                //for firefox div focus bug: outline:none; tabindex:'-1'
                tabindex:'-1',
                text:'{html}'+linb.UI.$childTag
            }},
            DataModel:{
                dataBinder:null,
                dataField:null,
                value:null,
                disabled:null,
                width:'100',
                height:'100',
                html:{
                    ini:'',
                    action:function(v){
                        //dont use .html() here
                        this.domNode.innerHTML = v;
                    }
                }
            },
            prepareData:function(profile){
                arguments.callee.upper.call(this, profile);
            },
            EventHandlers:{
                beforeValueSet:null,
                afterValueSet:null,
                beforeValueUpdated:null,
                afterValueUpdated:null,
                beforeHoverEffect:null,
                beforeNextFocus:null,
                beforeClickEffect:null
            }
        }
    });
    Class(u+"Tag", u+"Div",{
        Static:{
            Templates:{'default':{
                tagName:'div',
                style:'overflow:auto;border:dashed blue 1px;text-align:center;background:#FAF0E6;{_style}',
                text:'{tagKey}'+linb.UI.$childTag
            }},
            DataModel:{
                html:null,
                tagKey:{
                    ini:'',
                    action:function(v){
                        this.root.html(v);
                    }
                }
            },
            _l:'left,top,bottom,right,width,height,zIndex,tabindex,position,dock,dockFloat,dockMinW,dockMinH,dockOrder,dockMargin'.toArr(),
            //replace tag profile with other UI profile
            replace:function(tagProfile, profile){
                //reset properties
                this._l.each(function(s){
                    if(s in tagProfile.properties)profile.properties[s]=tagProfile.properties[s];
                });
                _.merge(profile.CA,tagProfile.CA,'all');
                _.merge(profile.CC,tagProfile.CC,'all');
                //if parent exist, replace
                if(tagProfile.parent){
                    //get tag links
                    var clink = tagProfile.parent.children,
                        linkObj = clink[tagProfile.$id],
                        index = clink.indexOf(linkObj);
                    tagProfile.parent.boxing().attach(profile, linkObj[1]);
                    // set to tag index
                    clink[index] = clink.pop();

                    //detach tag from parent
                    tagProfile.antiLinks('$parent');
                    delete tagProfile.parent;
                }
            }
        }
    });
    Class(u+"Panel", [u+"Div",u+"iContainer"],{
        Static:{
            Dropable:['KEY']
        }
    });
};