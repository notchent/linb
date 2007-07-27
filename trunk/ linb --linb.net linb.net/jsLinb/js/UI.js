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
            links:function(o,id,target,lid){
                target = target||this;
                //double link
                o[lid||this.$id]=target;
                if(o instanceof Array)o.push(target);
                //keep antilink
                this._links[id]=o;
                return this;
            },
            antiLinks:function(id){
                if(!this._links)return;
                var o=this._links[id];
                if(!o)return;
                //remove from target
                if(o instanceof Array)o.removeValue(o[this.$id]);
                delete o[this.$id];
                //remove from self
                delete this._links[id];
                return this;
            },
            antiAllLinks:function(){
                var id=this.$id,l=this._links,o;
                for(var i in l){
                    o=l[i];
                    if(o instanceof Array)o.removeValue(o[id]);
                    delete o[id];
                }
                return this;
            },

            resetCache:function(){},
            //set/get events
            setEvents:function(events){
                if(events)_.merge(this,events,'all');
                return this;
            },
            getEvents:function(){
                var t,hash={};
                _.each(this.box.$EventHandlers,function(o,i){
                    if(this[i])hash[i]=this[i];
                },this);
                return hash;
            },
            //run something after set
            _applySetAction:function(fun, value){
                fun.call(this,value);
            },
            //garbage collection
            $gc:function(){
                //clear cache things
                this.resetCache();
                //clear anti links
                this.antiAllLinks();
                _.breakO(this);
            },
            destroy:function(){},
            //default no _nodes
            boxing:function(){return this;},
            beforeSerialized:function(){
                var t,o = this.box.beforeSerialized?this.box.beforeSerialized(this):this,
                r={
                    //name
                    alias:o.alias,
                    //key
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
        },
        Static:{
            getFromCacheId:function(id){
                return linb._object[id];
            }
        }
    });
    //Base
    Class("linb.Base","linb.iBox",{
        Constructor:function(alias, properties, events){
            var c=this.constructor;

            if(typeof alias=='object'){
                events=alias.events;
                properties=alias.properties;
                alias=alias.alias;
            }

            var profile = new linb.Profile;

            //for base elements
            _.merge(profile,{
                properties : properties || {},
                alias : alias || c.pickAlias(),
                $id : _.id(),
                _links : [],
                box : c,
                key : c.KEY,
                'object' : this
            },'all');

            c._namePool[profile.alias]=1;
            profile.setEvents(events);
            //give default values
            //_.merge(profile.properties, c.$DataStruct);
            profile.links(c._cache, 'self')
            .links(linb.Base._cache, 'base')
            .links(linb._object, 'linb');

            var self=this;
            profile.boxing=function(){return self};

            this._nodes=[profile];
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
                if(str){
                    delete this.constructor._namePool[this.get(0).alias];
                    this.get(0).alias=str;
                    this.constructor._namePool[str];
                }else
                    return this.get(0).alias;
                return this;
            },
            host:function(value){
                if(value)
                    return this.each(function(o){
                        o.host=value;
                    });
                else
                    return this.get(0).host;
            }
        },
        After:function(){
            var temp,me=arguments.callee;
            this._nameId=0;
            this._namePool={};
            this._nameTag=(t=this.KEY.split('.'))[t.length-1].toLowerCase();
            this._cache=[];

            if(this === linb.Base)return;

            var t,k,u,m,i,j,v;
            m=me.a1 || (me.a1='$Keys,$DataModel,$DataStruct,$EventHandlers'.toArr());
            for(j=0;v=m[j++];){
                if(t=this.$parent){
                    k={};
                    for(i=0;u=t[i++];)
                        _.merge(k,u[v]);
                    this[v]=_.clone(k);
                }else
                    this[v]={};
            }

            /*change keys*/
            u=this.$Keys;
            for(i in u)
                if((t=u[i].split('-')).length)
                    u[i]=this.KEY+"-"+t[t.length-1];
            u.KEY = u.$key = this.KEY;

            this.setDataModel(this.DataModel);
            delete this.DataModel;

            this.setEventHandlers(this.EventHandlers);
            delete this.EventHandlers;

            m=me.a5 || (me.a5='createdTrigger,envTrigger'.toArr());
            for(j=0;v=m[j++];){
                temp=[];
                if(t=this.$parent)
                    for(i=0;u=t[i];i++){
                        if(u=u['$'+v])
                            temp.push.apply(temp,u);
                    }
                if(this[v])
                    temp.push(this[v]);
                this['$'+v] = temp;
                delete this[v];
            }
        },
        Static:{
            $specialChars:'_,$'.toHash(true),
            $gc:function(){
                var k=this.$key;
                //clear templates memory in linb.cache
                _.breakO([this.$DataModel, this.$DataStruct, this.$EventHandlers, this],2);
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
                var t,o,n,m,r,sc=linb.Base.$specialChars;
                var ds = this.$DataStruct, properties=this.$DataModel;

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
                            delete ds[i];
                            delete properties[i]
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
                        m = this.prototype[n];
                        this.prototype[n] = typeof t=='function' ? t : typeof m=='function' ? m : function(value,flag){
                            return this.each(function(v){
                                //if same return
                                if(v.properties[i] === value && !flag)return;
                                var m,ovalue = v.properties[i];
                                v.properties[i] = value;
                                //custom ui
                                m = _.get(v.box.$DataModel, [i, 'action']);
                                if(typeof m == 'function')v._applySetAction(m, value, ovalue);
                            });
                        };
                        this.prototype[n].$ignore$=1;
                    }

                    // get custom getter
                    t = o.get;
                    n = 'get'+r;
                    m = this.prototype[n];
                    this.prototype[n] = typeof t=='function' ? t : typeof m=='function' ? m : function(){
                        return this.get(0).properties[i];
                    };
                    this.prototype[n].$ignore$=1;
                },this);
                return this;
            },

            getDataModel:function(key){
                var o=this.$DataModel;
                return key?o[key]:o;
            },
/*
            isProperty:function(v){
                return !!this.$DataModel[v];
            },
            isItemProperty:function(v){
                var t=this.$DataModel.items, b=false;
                if(t) b= (t=t.Struct) && (t[v] != undefined);
                return b;
            },
*/
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
                        f.$ignore$=1;
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
            arguments.callee.upper.apply(this,arguments);
            //for box
            this._nodes=[];
        },
        Instance:{
            each:function(fun){
                this._nodes.each(function(o,i){
                    return fun.call(this, o, i);
                },this);
                return this;
            },
            updateDataFromDs:function(v, flag){
                return this.each(function(profile){
                    var t;
                    if(typeof (t=v.getField(profile.properties.dataField))!='undefined'){
                        if(flag)
                            profile.boxing().updateUIValue(t);
                        else
                            profile.boxing().setValue(t, true);
                    }
                });
            },
            updateDataToDs:function(){
                return this.each(function(profile){
                    var p=profile.properties,
                        ds = linb.DataSource.getFromDataBinderName(p.dataBinder),
                        v = profile.boxing().updateValue().getValue();
                    if(ds)ds.setField(p.dataField, v);
                });
            },
            getDataBinder:function(){
                var profile=this.get(0);
                return linb.iDataBinder.getDataBinder(profile.properties.dataField);
            },
            getDataSource:function(){
                var profile=this.get(0);
                return linb.DataSource.getFromDataBinderName(profile.properties.dataBinder);
            }
        },
        Static:{
            _pool:{},
            link:function(name, pro){
                var o = this._pool[name];
                if(!o)
                    o = this._pool[name] = new linb.iDataBinder();

                linb.DataSource.bind(name, name);

                if(pro && !o._nodes.exists(pro))o._nodes.push(pro);
            },
            getDataBinder:function(name){
                return this._pool[name];
            },
            DataModel:{
                dataBinder:{
                    ini:'',
                    combobox:function(){
                        ds = linb.DataSource.getAll();
                        return _.toArr(ds,true);
                    },
                    set:function(v){
                        var ds,r;
                        return this.each(function(profile){
                            profile.properties.dataBinder=v;
                            var b=false;
                            if(v){
                                linb.iDataBinder.link(v, profile);
                                if(ds=linb.DataSource.getDataSource(v))
                                    if(r=ds.getField(profile.properties.dataField)){
                                        b=true;
                                        profile.boxing().updateUIValue(r);
                                    }
                            }
                            if(!b)
                                profile.boxing().updateUIValue('');
                        });
                    }
                },
                dataField:{
                    ini:'',
                    combobox:function(){
                        var ds,r=[];
                        if(ds=linb.DataSource.getDataSource(this.properties.dataBinder)){
                            r=ds.getAll();
                            r=_.toArr(r,true);
                        }
                        return r;
                    },
                    set:function(v){
                        var ds;
                        return this.each(function(profile){
                            var t;
                            profile.properties.dataField=v;
                            var b=false;
                            if(v){
                                if(t=profile.properties.dataBinder)
                                    if(ds=linb.DataSource.getDataSource(t))
                                        if(r=ds.getField(v)){
                                            b=true;
                                            profile.boxing().updateUIValue(r);
                                        }
                            }
                            if(!b)
                                profile.boxing().updateUIValue('');
                        });
                    }
                }
            },
            createdTrigger:function(){
                if(this.dataBinder)this.boxing().setDataBinder(this.dataBinder);
                if(this.dataField)this.boxing().setDataField(this.dataField);
            }
        }
    });
    //DataSource
    Class("linb.DataSource","linb.Base",{
        Constructor:function(){
            arguments.callee.upper.apply(this,arguments);
            var c = this.constructor;
            var profile = this._nodes[0];

            profile.properties.value={};
            profile._fields={};
            profile.binder={};

            _.merge(profile, c.$EventHandlers, 'without');

            //keep root refrence
            profile.links(linb.DataSource._cache, 'DataSource');

            this.profile = profile;
        },
        Instance:{
            destroy:function(){
                this.profile.antiAllLinks();
            },
            request:function(){},
            response:function(){},
            getField:function(field){
                var t;
                if((t=this.profile.properties.value) && (field in t))return t[field];
            },
            setField:function(field, value){
                var t;
                if(t=this.profile.properties.value)
                    t[field]=value;

                return this;
            },
            responseToBinder:function(flag){
                var c=this.constructor,t;
                if(!(t=c._map[this.profile.alias]))return false;
                if(t = linb.iDataBinder.getDataBinder(t))
                    t.updateDataFromDs(this, flag);

                return this;
            },
            bind:function(name){
                this.constructor.bind(this.profile.alias,name);
                return this;
            },
            unBind:function(){
                this.constructor.unBind(this.profile.alias);
                return this;
            },
            getAll:function(){
                return this.profile.properties.value;
            },
            requestFromBinder:function(){
                var t,p,c=this.constructor;
                if(!(t=c._map[this.profile.alias]))return false;

                if(t=linb.iDataBinder.getDataBinder(t)){
                    if( linb.UI.iWidget.pack(t._nodes).checkUIValueValid() ){
                        t.updateDataToDs();
                        if((p=this.profile).onDataChanged)
                            this.onDataChanged(p, p.properties.value);

                        return true;
                    }else{
                        linb.message(linb.getStr('inValid'));
                        return false;
                    }
                }
                return false;
            },
            triggerTest:function(){
                this.request(true);
            }
        },
        Static:{
            _map:{},
            // lazy bind (name map only)
            // 1 to 1 only
            bind:function(name, binder){
                _.filter(this._map,function(o,i){
                    return o!=binder
                });
                this._map[name]=binder;
            },
            unBind:function(name){
                delete this._map[name];
            },
            EventHandlers:{
                onRequestOK:function(profile, hash, flag){},
                onRequestFail:function(profile, msg){},
                onDataChanged:function(profile, hash){}
            },
            DataModel:{
                value:{ini:{}},
                'test':{
                    ini:'not yet',
                    trigger:true
                }
            },

            getAll:function(){
                var r={};
                this._cache.each(function(o){
                    r[o.alias]=o;
                });
                return r;
            },
            getFromDataBinderName:function(name){
                var dsname;
                for(var i in this._map)
                    if(this._map[i]==name){
                        dsname=i;
                        break;
                    }
                if(dsname)return this.getDataSource(dsname);
            },
            getDataSource:function(name){
                var r, index = this._cache.subIndexOf('alias',name);
                if(index!=-1)r=this._cache[index];
                if(r) return r.object;
            },
            beforeSerialized:function(profile){
                var o = profile.copy();
                o.properties = _.copy(profile.properties);
                delete o.properties.value;
                var ds = this.$DataModel;
                _.filter(o.properties,function(o,i){
                    return !(i in ds) || !ds[i].trigger;
                });
                return o;
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
                var t;
                //gc already
                if(!this.serialId)return;
                //clear cache things
                this.resetCache();

                //clear dom link
                if(this.addition && (t=this.domNode))
                    for(var i in this.addition)
                        t[i]=null;

                //restore dom id
                var t=linb.cache.domId;
                (t[this.key] || (t[this.key]=[])).push(this.serialId);

                //clear cache point
                delete linb.cache.dom[this.domId];
                delete this.box._namePool[this.alias];

                //clear anti links
                this.antiAllLinks();

                _.breakO(this);
            },
            resetCache:function(key){
                //for getEvents
                _.breakO(this.$cache_egetter,2);
                _.breakO(this.$cache_domid);
            },
            //get events function from profile
            getEV:function(id, name){
                var
                $k = id+"+"+name,
                g = this.$cache_egetter ||(this.$cache_egetter={});
                if(g[$k])return g[$k];

                var funs=[],t,key, ar = ['_CB', name], arr = ['CB', name];
                //for event attached on dom node
                if(t=_.get(linb.cache.dom,[id, 'events',name]))
                    for(var i=0,l=t.length;i<l;i++)
                        if(typeof t[t[i]]=='function')
                            funs[funs.length]=t[t[i]];

                //for event attached on linb widgets
                //get event function path of cache
                if(key = _.str(id.split(":")[0].split("-")[1])){
                    ar.insert((t=key.split(".")),1);
                    arr.insert(t,1);
                }

                //for design mode
                if(typeof (t=_.get(this, ar))=='function')
                    funs[funs.length]=t;
                //get event function from customBehavior first
                else if(typeof (t=_.get(this, arr))=='function')
                    funs[funs.length]=t;
                else{
                    //get event function from public behavior
                    arr[0]='behavior';
                    if(typeof (t=_.get(this, arr))=='function')
                        funs[funs.length]=t;
                }

                arr.length=0;
                return g[$k] = funs;
            },
            //
            toString:function(flag){
                var i, o, m, a, c, self, children, h={},id, me=arguments.callee, reg = me.reg || ( me.reg = /<!--([^>^\s]*)-->/g);

                if(!this.string || flag){
                    c = this.box;
                    _.merge(this.properties, c.$DataStruct);
                    this.data = {};
                    c.prepareData(this);
                    if(c.dynamicTemplate)c.dynamicTemplate(this);
                    this.string = c.build(this);
                    delete this.data;

                    // for children linb.UI/dom node
                    if(m=this.children)
                        for(i=0; o=m[i++]; ){
                            if(!o[0]['linb.UIProfile']){
                                a = new (linb.SC(o[0].key));
                                a.ini.call(a, o[0]);
                                o[0]=a.get(0);
                            }
                        }
                }
                if(m=this.children)
                    for(i=0; o=m[i++]; ){
                        id = o[1]||'';
                        a = h[id] || (h[id]=[]);
                        a[a.length] = o[0].toString();
                    }

                return this.string.replace(reg, function(a,b){
                    return h[b]?h[b].join(''):'';
                });
            },
            //boxing to linb.UI.xx
            boxing:function(){
                //cache boxing
                var t;
                if(!((t=this.object) && t._nodes[0]==this && t._nodes.length==1))
                    t = this.object = this.box.pack([this],false);
                return t;
            },
            _applySetAction:function(fun, value, ovalue){
                if(this.domNode)
                    fun.call(this, value, ovalue);
            },
            makeRootId:function(key){
                return (key || this.key) + ":" + this.serialId + ":";
            },
            getKey:function(id){
                return id.split(":")[0];
            },
            getSerialId:function(id){
                return id.split(":")[1];
            },
            getSubSerialId:function(id){
                return id.split(":")[2];
            },
/*
            makeDomId:function(key, serialId, itemId){
                return key+":"+serialId+":"+itemId;
            },
*/

            getSubNodeId:function(key, itemId){
                var arr = this.domId.split(':');
                arr[0]=key;
                arr[2]=itemId||'';
                return arr.join(':');
            },
            getSubNode:function(key, itemId){
                var r,t,s,h=this._domNode||(this._domNode={});
                // by key only
                if(itemId===true)
                    r =linb([this.domNode],false).dig('*', 'id', new RegExp('^'+key+':'+this.serialId));
                else{
                    if(!itemId && h[key] && h[key]._nodes.length==1)return h[key];
                    r = (t=linb.dom.byId(s=this.getSubNodeId(key, itemId))) ? linb([t],false) : linb([this.domNode],false).dig('*', 'id', s);
                    if(!itemId)h[key]=r;
                }
                return r;
            },


            pickSubId:function(key){
                var r,o = this.cache_subid || (this.cache_subid={});
                if((o[key] || (o[key]=[]))[0])return o[key].shift();
                o = this.subId || (this.subId={});
                r=(o[key] || (o[key]=new _.id)).next();
                return r;
            },
            cacheSubId:function(id, key){
                var o = this.cache_subid || (this.cache_subid={});
                (o[key] || (o[key]=[])).push(id);
            },

            getClass:function(key, tag, flag){
                var me=arguments.callee, map=me.map||(me.map={}), reg=me.reg||(me.reg=/\./g), hash=this.appearance+":"+key+":"+tag+':'+flag;
                if(map[hash])return map[hash];

                //give a change to replace class base string
                if(this.classKey)key=key.replace(this.key,this.classKey);
                var str = (((!flag && this.appearance!='default')?this.appearance + "--" : "") + key).replace(reg,'-').toLowerCase();
                str = str + (tag||'');
                return map[hash]=str;
            },

            addTagClass:function(nodes, key, tag, flag){
                var c = this.box.$clscache || (this.box.$clscache={}),
                k=key+":"+tag,
                cls='[^\\s]*'+this.getClass(key,'',true),
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

                return this;
            },
            removeTagClass:function(nodes, key, tag){
                var c = this.box.$clscache || (this.box.$clscache={}),
                k=key+":"+tag,
                reg = c[k] || (c[k] = new RegExp('[^\\s]*'+this.getClass(key,'',true) + '[-\\w]*' + tag + '[-\\w]*'))
                ;
                nodes.removeClass(reg);
                return this;
            },

            getNodeByItemId:function(key, id){
                if(id=this.getSubSerialIdByItemId(id))
                    return this.getSubNode(key, id);
            },
            getItemByItemId:function(id){
                var t;
                if((t=this.ItemIdMapSubSerialId) && (t=t[id]))
                    return this.SubSerialIdMapItem[t];
            },
            getItemBySubSerialId:function(id){
                return this.SubSerialIdMapItem && this.SubSerialIdMapItem[id];
            },
            getItemByDom:function(src){
                return this.SubSerialIdMapItem && this.SubSerialIdMapItem[this.getSubSerialId(src.id || src)];
            },
            getItemIdByDom:function(src){
                var t;
                return (t=this.getItemByDom(src)) && t.id;
            },
            getItemIdBySerailId:function(subId){
                var t;
                if(t=this.ItemIdMapSubSerialId)
                    for(var i in t)
                        if(t[i]==subId)
                            return i;
            },
            getSubSerialIdByItemId:function(id){
                var t;
                return (t=this.ItemIdMapSubSerialId) && t[id];
            },
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
//
        },
        Static:{
            getFromDomId:function(id){
                return linb.cache.dom[id];
            },
            getFromDomNode:function(node){
                return linb.cache.dom[node===window?linb.ini.id_window:node===document?linb.ini.id_document:node.id];
            },
            getFromDom:function(dom){
                return linb.cache.dom[dom.get(0).id];
            }
        }
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
            var temp,me=arguments.callee;
            this._nameId=0;
            this._namePool={};
            this._nameTag=(t=this.KEY.split('.'))[t.length-1].toLowerCase();
            this._cache=[];

            this._ctrlId = new _.id();
            this._idCache=[];

            /*get from the first parent first*/
            var t,k,u,b,c,m,i,j,e,w,v;

            m=me.a1 || (me.a1='$Keys,$DataModel,$DataStruct,$EventHandlers'.toArr());
            for(j=0;v=m[j++];){
                if(t=this.$parent){
                    k={};
                    for(i=0;u=t[i++];)
                        _.merge(k,u[v]);
                    this[v]=_.clone(k);
                }else
                    this[v]={};
            }
            /*for examples:
            linb.UI.xxx.$Templates[''].$={
                tagName:...
                UPPER:...
            }
            */

            m=me.a2 || (me.a2='$Templates,$Behaviors,$Appearances'.toArr());
            for(j=0;v=m[j++];){
                k={};
                if(t=this.$parent){
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
                    this[v]=_.clone(k);
                }else
                    this[v]={};
            }

            /*change keys*/
            u=this.$Keys;
            for(i in u)
                if((t=u[i].split('-')).length)
                    u[i]=this.KEY+"-"+t[t.length-1];
            u.KEY = u.$key = this.KEY;

            m=me.a3 || (me.a3='Templates,Behaviors,Appearances'.toArr());
            w=me.a4 || (me.a4='setTemplate,setBehavior,setAppearance'.toArr());
            for(j=0;v=m[j];j++){
                u=this[v];
                for(i in u)
                    this[w[j]](i,u[i]);
                delete this[v];
            }

            this.setDataModel(this.DataModel);
            delete this.DataModel;

            this.setEventHandlers(this.EventHandlers);
            delete this.EventHandlers;

            m=me.a5 || (me.a5='createdTrigger,envTrigger'.toArr());
            for(j=0;v=m[j++];){
                temp=[];
                if(t=this.$parent)
                    for(i=0;u=t[i];i++){
                        if(u=u['$'+v])
                            temp.push.apply(temp,u);
                    }
                if(this[v])
                    temp.push(this[v]);
                this['$'+v] = temp;
                delete this[v];
            }
            if(this.PublicAppearance){
                linb.dom.addHeadNode('style', this.buildCSSText(this.PublicAppearance,linb.getPath(this.KEY,'/css.css','appearance')));
                delete this.PublicAppearance;
            }
            if(this.Dropable && this.Dropable.length){
                this.Dropable.each(function(o){
                    this.dropable(o)
                },this);
                delete this.Dropable;
            }
            if(this.Dragable&& this.Dragable.length){
                this.Dragable.each(function(o){
                    this.dragable(o)
                },this);
                delete this.Dragable;
            }

        },
        Instance:{
            getSubNode:function(key,id){
                return this.get(0).getSubNode(this.constructor.$Keys[key],id);
            },
            toDomNodes:function(){
                var t, arr=[];
                this._nodes.each(function(o){
                    if(t=o.domNode)arr.push(t);
                });
                return arr;
            },
            ini:function(properties, events, host, template, behavior, appearance, children, CA, CB){
                var profile, c = this.constructor, t='default';
                //from UIProfile object
                if(properties && properties['linb.UIProfile'])
                    this._nodes = [ profile = properties];
                else{
                    this._nodes = [ profile = new linb.UIProfile];

                    if(c.iniProfile)c.iniProfile.call(profile);

                    profile.box = c;
                    profile.key = this.$key;
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
                    profile.CB =  CB || CB || {};

                    profile.template = c.getTemplate(template || profile.template || t);

                    //for event handlers:
                    profile.setEvents(events || profile.events || {});
                    //for avoid conflict with dom events
                    delete profile.events;

                    profile.children = children || profile.children || [];

                    if(!profile.serialId)profile.serialId=c.pickSerialId();
                    profile.domId = profile.makeRootId();

                    //new alias always
                    profile.alias = profile.alias || c.pickAlias();
                    c._namePool[profile.alias]=1;

                    profile.createdTrigger=c.$createdTrigger.copy();
                    profile.envTrigger=c.$envTrigger.copy();

                    //not register subcontrols id / dom cache
                    //attribute in innerHTML won't cause memory leak in IE.
                    profile.addition = profile.behavior?profile.behavior.$eventhandler:null;

                    //set default value
                    profile._links=[];
                    //set anti-links
                    profile.links(linb.UI._cache,'UI').links(c._cache,'self').links(linb._object,'linb');

                }
                return this;
            },
            create:function(){
                var arr=[],i,o,n=this._nodes,me=arguments.callee,set=me.set||(me.set=function(o,flag){
                    var t,self=arguments.callee;

                    //link dom
                    o.root = linb([o.domNode = linb.dom.byId(o.domId)],false);
                    linb.cache.dom[o.domId] = o;

                    //createdTrigger
                    if(t=o.createdTrigger){
                        for(var i=0,l=t.length;i<l;i++)
                            t[i].call(o);
                        delete o.createdTrigger;
                    }
                    if(flag && (t=o.envTrigger))
                        for(var i=0,l=t.length;i<l;i++)
                            t[i].call(o);
                    if(o.children)
                        for(var i=0,n=o.children,v;v=n[i++];){
                            self(v[0],true);
                            //for created by serialized way
                            v[0].parent=o;
                        }
                });
                for(i=0;o=n[i++];)
                    if(!o.domNode)
                        arr[arr.length]=o;
                if(arr.length){
                    linb.dom.getTemp().html(arr.join(''),false);
                    for(i=0;o=arr[i++];)
                        set(o);
                }
                return this;
            },
            render:function(){
                var i,o,n=this._nodes,node,me=arguments.callee,set=me.set||(me.set=function(o){
                    var t,self=arguments.callee;
                    o.root = linb([o.domNode = linb.dom.byId(o.domId)],false);
                    linb.cache.dom[o.domId] = o;
                    //createdTrigger
                    if(t=o.createdTrigger){
                        for(var i=0,l=t.length;i<l;i++)
                            t[i].call(o);
                        delete o.createdTrigger;
                    }
                    if(t=o.envTrigger)
                        for(var i=0,l=t.length;i<l;i++)
                            t[i].call(o);
                    if(o.children)
                        for(var i=0,n=o.children,v;v=n[i++];){
                            self(v[0],true);
                            //for created by serialized way
                            v[0].parent=o;
                        }
                }),para=me.para||(me.para=function(node){
                    var r = node.getRegion();
                    r.tabindex=node.tabIndex();
                    r.zIndex=node.zIndex();
                    r.position=node.position();
                    return r;
                });
                for(i=0;o=n[i++];)
                    if(!(node = linb(o.alias)).isEmpty()){
                        _.merge(o.properties, para(node));
                        node.outerHTML(o.toString(),false);
                        window[o.alias]=o.boxing();
                        set(o);
                    }
                return this;
            },
            destroy:function(){
                this.each(function(o){
                    if(o.beforeDestroy && o.boxing().beforeDestroy(o)===false)return;
                    if(o.destroyTrigger)o.destroyTrigger();
                    o.root.remove();
                });
            },

            activate:function(){return this},
            clone:function(flag){
                var arr=[];
                this.each(function(o){
                    arr.insert(linb.create(o.clone(flag)).get());
                });
                return this.constructor.pack(arr,false);
            },

            refresh:function(){
                var b,p,para,s,sid,host,box,children;
                return this.each(function(o){
                    if(!o.domNode)return;
                    //keep parent
                    if(b=!!o.parent){
                        p=o.parent.boxing();
                        //para=o.getLink('$parent')[o.$id][1];
                        para=o._links.$parent[o.$id][1];
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
                    s = _.serialize(o);
                    o.boxing().destroy();
                    //call gc to clear
                    linb.dom.$gc();
                    s=_.unserialize(s);
                    s.serialId=sid;
                    s.host=host;
                    o=new box(s).create();

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
                return this;
            },
            //set template id to object
            template:function(str){
                var o,t;
                if(typeof str=='string'){
                    this.each(function(o){
                        if(o.domNode){
                            if(!o.template || o.template._id != _.str(str)){
                                t=o.box.getTemplate(_.str(str));
                                if(!t)return;
                                o.template = t;
                                return this.refresh();
                            }
                        }else
                            o.template = str;
                    });
                    return this;
                }else
                    return this.get(0).template;
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
                                    m=o.keys[i];
                                    if(t[i] && (v=t[i].$eventhandler))
                                        for(var j in v)
                                            o.getSubNode(m,true).removeEventHandler(j.slice(2));

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
                                    m=o.keys[i];
                                    if(t[i] && (v=t[i].$eventhandler))
                                        for(var j in v)
                                            o.getSubNode(m,true).addEventHandler(j.slice(2));

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
                            t=o.getClass(o.key);
                            o.appearance = str;
                            if(!o.box.cssNone)
                                o.box.setCSSFile(o.box.cssPathKey || o.key, o.appearance);

                            if(o.domNode)
                                o.root.dig().reClass(new RegExp('([\\w]+\\-\\-)?' + t,'g'),o.getClass(o.key));
                        }
                    });
                else
                    return this.get(0).appearance;
            },

            attach:function(ui, id){
                this.appendChild(ui, id);
                var pro=this.get(0);
                if(pro.domNode)
                    pro.getSubNode(pro.keys.PANEL||pro.keys.KEY).attach(ui);
                return this;
            },
            show:function(ui, id){
                ui.attach(this, id);
                return this;
            },
            dettach:function(target,flag){
                return this.each(function(v){
                    var r=target.reBoxing('UI');
                    r.each(function(profile){
                        //antiLink first
                        profile.antiLinks('$parent');
                        delete profile.parent;
                    });
                    if(flag)r.destroy();
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
            //attach UI
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
                        //set parent
                        profile.parent = v;
                        //antiLink first
                        profile.antiLinks('$parent');
                        //and, link
                        profile.links(v.children, '$parent', [profile, id]);

                    });
                });
            },
            getChildren:function(){
                var t,o=this.get(0),arr;
                for(var i=0,v;v=o.children[i++];)
                    arr.push(v[0]);
                return arr;
            },

            dragable:function(key, dragKey, dragData){
                return this.each(function(o){
                    o.getSubNode(o.keys[key||'KEY'], true)
                    .onMousedown(function(pro,e,src){
                        linb([src],false).startDrag(e, {
                            drop2:true,
                            key:dragKey,
                            data:dragData,
                            icon:linb.ini.path+'ondrag.gif',
                            dragMode:'move',
                            cursor:'pointer',
                            move:false,
                            defer:1
                        });
                    },'',-1)
                    .onDragbegin(function(profile, e, src){
                        linb([src],false).onMouseout(true,{$force:true}).onMouseup(true);
                    },'',-1);
                });
            },

            setCustomAppearance:function(key,value){
                var me=arguments.callee, style=(me.style||(me.style=function(pro,i,h, flag){
                    var b,node=pro.getSubNode(pro.keys[i],true);
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
                    var hash,node,b,force;

                    //set key and value
                    if(typeof key=='string'){
                        if(o.domNode)
                            if(key in bak)
                                style(o, key, bak, true);

                        if(!value)
                            delete o.CA[key];
                        else{
                            o.CA[key]=value;
                            if(o.domNode)
                                style(o, key, bak);
                        }
                    //set hash dir
                    }else if(!!key && typeof key=='object'){
                        if(o.domNode){
                            for(var i in bak)
                                style(o, i, bak, true);
                            for(var i in key)
                                style(o, i, key);
                        }
                        o.CA=key;
                    //clear all
                    }else{
                        if(o.domNode)
                            for(var i in bak)
                                style(o, i, bak, true);
                        o.CA={};
                    }
                });
            },

            hasBehavior:function(type, key){
                var profile=this.get(0);
                if(!key)
                    return !!profile.behavior.type;
                else
                    return !!_.get(profile.behavior,[key,type]);
            },
            hasCustomBehavior:function(type, key){
                var profile=this.get(0);
                if(!key)
                    return !!_.get(profile,['CB',type]);
                else
                    return !!_.get(profile,['CB',key,type]);
            },
            clearCustomBehavior:function(key){
                return this.each(function(o){
                    if(key){
                        if(o.keys[key])
                            _.set(o,['CB',key],undefined);
                    }else
                        delete o.CB;
                    o.resetCache();
                });
            },
            //no event handler added
            addCustomBehavior:function(type, fun, key){
                return this.each(function(o){
                    if(key){
                        if(o.keys[key])
                            _.set(o,['CB',key, type],fun);
                    }else
                        _.set(o,['CB',type],fun);
                    o.resetCache();
                });
            },
            removeCustomBehavior:function(type, key){
                return this.each(function(o){
                    if(key){
                        if(o.keys[key])
                            _.set(o,['CB',key, type],undefined);
                    }else
                        _.set(o,['CB',type],undefined);
                    o.resetCache();
                });
            },
            //no event handler added
            //set mixed data
            setCustomBehavior:function(hash){
                return this.each(function(o){
                    o.CB=hash;
                    o.resetCache();
                });
            }
        },
        Initialize:function(){
            //add some CSS for linb.UI
            linb.dom.addHeadNode('style', linb.UI.buildCSSText({
                body:{
                    $order:0,
                    font:['13px arial,helvetica,clean,sans-serif',linb.browser.ie?'x-small':''],
                    'font-size':linb.browser.ie6?'100.01%':linb.browser.ie?'small':'',
                    margin:'0',
                    padding:'0',
                    cursor:'default'
                },
                'div,span,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,form,fieldset,input,button,p,blockquote,th,td':{
                    $order:1,
                    margin:'0',
                    padding:'0'
                },
                table:{
                    $order:2,
                    'font-size':'inherit',
                    font:linb.browser.ie?'100%':'',
                    'border-collapse':'collapse',
                    'border-spacing':'0',
                    'empty-cells':'show'
                },
                'div,span,fieldset,img,abbr,acronym':{
                    $order:3,
                    border:'0'
                },
                'address,caption,cite,dfn,em,strong,th,var':{
                    $order:4,
                    'font-style':'normal',
                    'font-weight':'normal'
                },
                'pre, code ':{
                    $order:5,
                    font:'115% monospace',
                    'font-size':linb.browser.ie?'100%':'',
                    'font-style':'normal',
                    'font-weight':'normal',
                    margin:'0',
                    padding:'0'
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
                'q:before,q:after':{
                    $order:9,
                    content: '""'
                },
                a:{
                    $order:10,
                    'text-decoration': 'none',
                    cursor:'pointer',
                    '-moz-user-select': linb.browser.gek?'none':''
                },
                'a:focus':{
                    $order:11,
                    '-moz-outline-offset': linb.browser.gek?'-1px ! important':''
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
                'div, span':{
                    $order:15,
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
                '.ui-dirty':{
                    $order:18,
                    color:'#f00'
                },
                '.ui-invalid':{
                    $order:19,
                    'background-color': 'Aqua'
                }
            }), 'linb.UI');
            //enable drop for a KEY in cls
            linb.cache.$dropPool={};

        },
        Static:{
            $cache_csspath:{},
            $css_tag_dirty: "ui-dirty",
            $css_tag_invalid: "ui-invalid",
            $tag_left:"{",
            $tag_right:"}",
            $tag_special:'#',
            $ID:"#id#",
            subSerialIdTag:"_serialId",
            $childTag:"<!--{id}-->",
            hasDomRoot:true,
            $langID:1,
            getStr:function(){
                var id=arguments[0], s,r;
                if(id.charAt(0)=='$')arguments[0]=id.slice(1);
                s=arguments[0];
                r= linb.getStr.apply(null,arguments);
                if(s==r)r=id;
                return '<span id="lang:'+linb.UI.$langID+'" class="'+s+'">'+r+'</span>';
            },
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
              return this.pack(_.toArr(this._cache,false));
            },
            getByCacheId:function(ids){
                var t,n=this._cache,arr=[];
                ids = ids instanceof Array?ids:[ids];
                ids.each(function(id){
                    if(t=n[id])arr[arr.length]=t;
                });
                return linb.UI.pack(arr,false);
            },
            pickSerialId:function(){
                //get id from cache or id
                var arr = linb.cache.domId[this.$key];
                if(arr && arr[0])return arr.shift();
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
                var s,t,n,
                isA = properties.constructor == Array,
                self=arguments.callee,
                temp = template[tag||''],
                r = !result,
                result= result || []
                ;
                if(isA){
                    if(typeof temp != 'function')temp = self;
                    for(var i=0;t=properties[i++];)
                        temp(profile, template, t, tag, result);
                }else{
                    if(typeof temp == 'function')
                        temp(profile, template, t, tag, result);
                    else{
                        tag = tag?tag+'.':'';
                        var a0=temp[0], a1=temp[1];
                        for(var i=0,l=a0.length;i<l;i++){
                            if(n=a1[i]){
                                if(n in properties){
                                    t=properties[n];
                                    //if sub template exists
                                    if(template[s=tag+n])
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
/*            $doTemplate:function(profile, template, properties, funs, tag){
                var i,s,t,flag,
                isA = properties.constructor == Array, self=arguments.callee,
                reg = self.reg || ( self.reg = new RegExp(linb.UI.$tag_left +'(\\w*)'+ linb.UI.$tag_right, 'g')),
                str = template[tag||''];

                if(isA){
                    var arr=[];
                    for(i=0;t=properties[i++];){
                        flag=false;
                        if(funs&&funs[tag]) flag=funs[tag](profile,t);
                        arr[arr.length]= flag!==false?flag:self(profile, template, t, funs, tag);
                    }
                    return arr.join('');
                }else{
                    tag = tag?tag+'.':'';
                    return str.replace(reg, function(a,b){
                        t=properties[b];
                        return (template[s=tag+b] ? self(profile, template, t, funs, s) : ((funs&&funs[s])?funs[s](profile,t):t)) || '';
                    });
                }
            },
*/
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
                if(template && template.tagName=='text'){
                    arr[arr.length] = template.text;
                    return;
                }
                var lkey, first=false,
                    behavior = profile.behavior?key?profile.behavior[key]:profile.behavior:null,
                    self =arguments.callee, t, o , bak,
                    map1 = self.map1 ||(self.map1={tagName:1,text:1}),
                    map2 = self.map2 ||(self.map2={image:1,input:1}),
                    r2=self.r2||(self.r2=/[a-z]/),
                    r3=self.r3 || (self.r3=/^(on|before|after)/),
                    r7=self.r7 || (self.r7=/([^{}]*)\{([\w]+)\}([^{}]*)/g)
                    ;

                if(!template)template=profile.template;
                lkey = key?profile.keys[key]:profile.key;

                //tagName
                if(!template.tagName)template.tagName="span";

                //id
                template.id = lkey + ":" + linb.UI.$ID + ":" + linb.UI.$tag_left + linb.UI.subSerialIdTag + linb.UI.$tag_right;

                //className
                t = profile.getClass(lkey);
                //save bak
                bak = template.className || '';

                template['class'] =
                    //default class first
                    t+' '+
                    //solid class
                    bak+' '+
                    //class from properties input
                    linb.UI.$tag_left+'className'+linb.UI.$tag_right;
                delete template.className;

                template.style = (template.style||'')+ linb.UI.$tag_special + (key||'KEY') + '_CA'+linb.UI.$tag_special;

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
                template.className = bak;
                delete template['class'];

                // add event handler
                if(behavior && (t=behavior.$eventhandler))
                    for(var i in t)
                        arr[arr.length]=i+'="'+linb.dom.eventhander+'" ';

                arr[arr.length]='>';

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

            build:function(profile, flag){
                var t, p=profile, temp=[[],[]], template, m, t, self=arguments.callee, key=this.KEY,
                r1=self.r1||(self.r1=new RegExp(linb.UI.$ID,'img')),
                r2=self.r2||(self.r2=new RegExp(linb.UI.$tag_special +'([A-Z0-9]+)_CA'+ linb.UI.$tag_special, 'g')),
                hash = profile._hash =
                'a:' + (p.template._id||'') + ';' +
                'b:' + (p.template._did||'') + ';' +
                'c:' + (p.appearance||'') + ';' +
                'd:' + (p.behavior._id||'') + ';' +
                'e:' + (p.behavior._did||'') + ';' +
                '!' + (profile._exhash||'');

                //get template
                if(!(template = _.get(linb.cache.template,[key, hash]))){
                    //setCSSFile
                    if(!this.cssNone) this.setCSSFile(this.cssPathKey || key, profile.appearance);
                    //get main template
                    linb.UI.$buildTemplate(profile,null,null,temp);
                    //split sub template from main template

                    //set main template
                    _.set(linb.cache.template, [key, hash, ''], temp);
                    //set sub template
                    if(t=p.template.$dynamic)
                        for(var i in t){
                            if(typeof (m=t[i])!='function'){
                                var temp=[[],[]];
                                for(var j in m)
                                    if(typeof m[j] == 'object')
                                        linb.UI.$buildTemplate(profile, m[j], j, temp);
                                m=temp;
                            }
                            _.set(linb.cache.template, [key, hash, i], m);
                        }

                    template = _.get(linb.cache.template,[key, hash]);
                }
                if(!template || flag)return '';

                //replace main template
                temp =  linb.UI.$doTemplate(profile, template, profile.data).replace(r1, profile.serialId);

                if(p=p.CA)
                    temp = temp.replace(r2, function(a,b){
                        return (t=p[b])?t:'';
                    });
                else
                    temp = temp.replace(r2, '');

                return temp;
            },
            subBuild:function(profile, key, arr){
                var temp,t,p=profile, hash = p._hash,
                k=this.KEY,
                r1=this.build.r1,
                r2=this.build.r2,
                template = _.get(linb.cache.template,[k, hash]);

                temp = linb.UI.$doTemplate(profile, template, arr, key).replace(r1, profile.serialId);

                if(p=p.CA)
                    temp = temp.replace(r2, function(a,b){
                        return (t=p[b])?t:'';
                    });
                else
                    temp = temp.replace(r2, '');

                return temp;
            },
            /*
            allow function input, for some css bug
            */
            _setDefaultBehavior:function(hash){
                var f = function(arr, type, mode){
                    var fun = function(profile, e, src){
                        var t,id=src.id,item,
                            key = profile.keys.KEY,
                            cid = profile.getSubSerialId(id),
                            prop = profile.properties,nodes,funs,box;
                        if(prop.disabled)return;
                        item = profile.SubSerialIdMapItem && profile.SubSerialIdMapItem[cid];
                        if(item && item.disabled)return;
                        switch(typeof arr){
                            case 'string':
                                nodes=profile.getSubNode(profile.keys[arr],cid).get();
                                break;
                            case 'function':
                                funs=[arr];
                                break;
                            case 'object':
                                nodes=[];funs=[];
                                for(var o,i=0,l=arr.length;i<l;i++){
                                    o=arr[i];
                                    if(typeof o=='string')
                                        nodes.insert(profile.getSubNode(profile.keys[o],cid).get());
                                    else
                                        funs.push(o);
                                }
                        }

                        if(nodes&&nodes.length){
                            nodes=linb(nodes,false);
                            box=profile.boxing();
                            if(arguments.callee.mode==1){
                                if(type=='mouseover' && profile.beforeHoverEffect)
                                    if(false == box.beforeHoverEffect(profile, item, src, 'mouseover'))
                                        return;
                                if(type=='mousedown' && profile.beforeClickEffect)
                                    if(false == box.beforeClickEffect(profile, item, src, 'mousedown'))
                                        return;

                                //default action
                                profile.addTagClass(nodes, key, '-'+type);
                            }else{
                                if(type=='mouseup'){
                                    if(profile.beforeClickEffect && false == box.beforeClickEffect(profile, item, src, 'mouseup'))
                                        return;
                                    profile.removeTagClass(nodes, key, '-mousedown');
                                }else{
                                    if(profile.beforeHoverEffect && false == box.beforeHoverEffect(profile, item, src, 'mouseout'))
                                        return;
                                    profile.removeTagClass(nodes, key, '-mouseover');
                                    profile.removeTagClass(nodes, key, '-mousedown');
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
                        if(null===o)
                            t.afterMouseover = t.afterMouseout = null;
                        else{
                            t.afterMouseover = f(o,'mouseover', 1);
                            t.afterMouseout = f(o,'mouseout', 2);
                        }
                    });

                if(hash._clickEffect)
                    _.each(hash._clickEffect,function(o,i){
                        t=['','KEY','$key'].exists(i)?hash:(hash[i]||(hash[i]={}));
                        if(null===o)
                            t.afterMousedown = t.afterMouseup = null;
                        else{
                            t.afterMousedown = f(o,'mousedown', 1);
                            t.afterMouseup = f(o,'mouseup', 2);
                        }
                    });

                //for onHotKey
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
                        var k,map=arguments.callee, m1=map.m1||(map.m1="KEY,$key".toHash(true));
                        if(m1[i])return;
                        var m2=map.m2||(map.m2="input,textarea".toHash(true)),
                        m3=map.m3||(map.m3="tab,enter,up,down,left,right".toHash(true)),
                        m4=map.m4||(map.m4="tab,up,down,left,right".toHash(true)),
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
            /*It's a replace model*/
            setBehavior:function(key, hash, did){
                //set shortcut first
                this._setDefaultBehavior(hash);

                /*get from Behavior, if not exists, hash it*/
                var m,n,i,j,o,v, type,
                    t= this.$Behaviors,
                    check=linb.Base.$specialChars,
                    eventType=linb.dom._getEventType,
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
                                    /*set to behavior*/
                                    m[j]=v;
                                    /*add handler*/
                                    type = eventType(j);
                                    (m.$eventhandler || (m.$eventhandler={}))['on'+type]=1;
                                }
                            }
                        }else{
                            /*set to behavior*/
                            n[i]=o;
                            /*add handler*/
                            type = eventType(i);
                            (n.$eventhandler || (n.$eventhandler={}))['on'+type]=1;
                        }
                    }
                }
                return this;
            },
            getBehavior:function(key,did){
                if(typeof key=='string'){
                    var r = this.$Behaviors[key];
                    if(!r && key!='default'){
                        var self=this;
                        linb.request(linb.getPath(this.KEY, '/'+ key+'.js','behavior'),_.id(),function(str){
                            self.setBehavior(key, _.unserialize(str), did);
                        },function(str){},false,'GET');
                        r = this.$Behaviors[key];
                    }
                    return r?typeof did=='string'?r[did]:r.$:null;
                }else
                    return this.$Behaviors;
            },
            mapKeys:function(v){
                v.each(function(i){
                    this.$Keys[i] = this.$key+ "-" + i;
                },this)
            },

            /*replace mode*/
            setTemplate:function(key, hash, did){
                var t,self=arguments.callee,
                build = self.build || (self.build=function(template){
                    var o,s =arguments.callee,
                    r2=s.r2||(s.r2=/[a-z]/)
                    ;
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
                build.call(this, hash);

                t = this.$Templates;
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
                            self.call(this, key, t[i], j);

                return this;
            },
            getTemplate:function(key,did){
                if(typeof key=='string'){
                    var r = this.$Templates[key];
                    if(!r){
                        var self=this;
                        linb.request(linb.getPath(this.KEY, '/'+ key+'.js','template'),_.id(),function(str){
                            self.setTemplate(key, _.unserialize(str), did);
                        },function(str){},false,'GET');
                        r = this.$Templates[key];
                    }
                    return r?typeof did=='string'?r[did]:r.$:null;
                }else
                    return this.$Templates;
            },
            /*
            applyCustomProps:function(profile){
                if(_.isEmpty(profile.custom))return;
                var f = arguments.callee.f || (arguments.callee.f=function(profile, node, hash){
                    var self=arguments.callee;
                    _.each(hash,function(o,i){
                        //for sub nodes
                        if(!/[a-z]/.test(i))
                            self.apply(this, [profile, profile.getSubNode(profile.keys[i],true), o]);
                        // for dom event
                        if(/^(on|before|after)/.test(i))
                            node[i](o,'custom');
                        // for css and attr
                        else{
                            if(typeof o == 'function')
                                o();
                            else if(node[i])
                                node[i](o);
                            else if(i.exists(":")){
                                var t=i.split(':');
                                node[t[0]](t[1], o);
                            }else
                               node.attr(i,o);
                        }
                    });
                });
                f.apply(this,[profile, linb([profile.domNode],false), profile.custom]);
            },*/
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
                var  t,path = linb.getPath(this.KEY, '/'+ appearance+'/css.css','appearance');
                if(!linb.UI.$cache_csspath[path]){
                    /*if no flag, load file
                    */
                    if(t=this.$Appearances[appearance])
                        linb.dom.addHeadNode('style', this.buildCSSText(t, appearance=='default'?'':appearance),path);
                    else{
                        if(!flag)
                            linb.dom.includeCSSFile(path);
                    }
                    linb.UI.$cache_csspath[path]=true;
                }
                return this;
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

            buildCSSText:function(hash, appearance){
                var t,v,o,reg,replace,ks,
                    enter = linb.debug?'\n':'',
                    me=arguments.callee,
                    r1=me.r1||(me.r1=/(^|\s|,)([0-9A-Z_]+)/g),
                    r2=me.r2||(me.r2=/\./g),
                    h=[], r=[];
                //create css keys
                if(!this.$cssKeys){
                    o=this.$cssKeys={};
                    t=this.$Keys;
                    for(var i in t)
                        o[i]=t[i].replace(r2,'-');
                }
                ks=this.$cssKeys;

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
                            case '_':if(!linb.browser.ie6)continue;break;
                            case '*':if(!linb.browser.ie)continue;break;
                            case '-':if(!linb.browser.gek)continue;break;
                        }
                        //neglect '' or null
                        if((v=o[j])||o[j]===0){
                            if(linb.debug)j = '    ' + j;
                            //put string dir
                            switch(typeof v){
                            case 'string':
                            case 'number':
                                r[r.length]=j+":"+v+";"+enter;break;
                            case 'function':
                                r[r.length]=j+":"+v(this.KEY)+";"+enter;break;
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
            /*copy item to hash, use 'without'
            exception: key start with $
            value(start with $) get a change to get value from lang setting
            */
            copyItem:function(item, hash){
                if(!hash)hash={};
                var i,o;
                for(i in item){
                    if(i.charAt(0)=='$')continue;
                    if(!(i in hash))
                        hash[i] = (typeof (o=item[i])=='string' && o.charAt(0)=='$')?linb.UI.getStr(o.slice(1)):o;
                }
                //todo: change it
                hash.iconDisplay = item.icon?'':'display:none';
                return hash;
            },
            prepareData:function(profile){
                var
                    prop = profile.properties,
                    data = profile.data,
                    dm = this.getDataModel(),
                    map = arguments.callee.map || (arguments.callee.map='left,top,bottom,right,width,height'.toArr());

                //can't input id in properties
                if(prop.id)delete prop.id;

                //give default caption
                if('caption' in dm && prop.caption!==null)
                    prop.caption = prop.caption==undefined ? profile.alias : prop.caption;
                //give border width
                if('$border' in dm){
                    data.bWidth=prop.width - (prop.$border||0)*2;
                    data.bHeight=prop.height - (prop.$border||0)*2;
                }
                for(var j=0,i;i=map[j];j++){
                    if(prop[i] || prop[i]===0){
                        if(String(parseFloat(prop[i]))==String(prop[i]))
                            data[i]=i+':'+(parseInt(prop[i])||0)+'px;';
                        else if(prop[i]!='auto' && prop[i])
                            data[i]=i+':'+prop[i]+';';
                        else data[i]='';
                    }
                }
                if('position' in dm)data.position = 'position:'+prop.position+';';
                if('tabindex' in dm)data.tabindex = prop.tabindex || '-1';
                if('zIndex' in dm)data.zIndex = 'z-index:'+prop.zIndex+';';
                if('items' in dm){
                    profile.ItemIdMapSubSerialId = {};
                    profile.SubSerialIdMapItem = {};

                    if(!prop.items || prop.items.constructor != Array)
                        prop.items = linb.UI.getCacheList(prop.listKey||'test');

                    //ensure format
                    if(!prop.items || prop.items.constructor != Array)
                        prop.items=[];

                    data.items = this.prepareItems(profile, prop.items);
                }

                //default prepare
                return linb.UI.copyItem(prop, data);
            },
            prepareItems:function(profile, items, pid){
                var result=[], item,   dataItem, id, SubID=linb.UI.subSerialIdTag,
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
                        this.prepareItem(profile, dataItem, item);
                    result.push(dataItem);
                }

                return result;
            },
            dropable : function(key, getDropKeys){
                if(!getDropKeys)getDropKeys=this.getDropKeys;
                //keep refrence
                (linb.cache.$dropPool[this.KEY] = linb.cache.$dropPool[this.KEY] || []).push(key);
                this.$dropKey = this.$Keys[key];

                //drop base behaviors
                var behaviors = {
                    beforeMouseover:function(profile, e, src){
                        var dd = linb.dragDrop, key = dd.dragKey, data = dd.data;

                        //not include the dragkey
                        if(!key
                        || !data
                        || !(new RegExp('\\b'+key+'\\b')).test(getDropKeys(profile, this))
                        )return;

                        var item;
                        if(profile.boxing().getItemByDom)item=profile.boxing().getItemByDom(src);

                        if(profile.onDropTest && (false==profile.boxing().onDropTest(profile, e, this, key, data, item)))
                        return;
                        //for trigger onDrop
                        dd._current=src;

                        if(profile.onDropMarkShow && (false==profile.boxing().onDropMarkShow(profile, e, this, key, data, item))){}
                        else
                            //show region
                            _.resetRun('showDDMark', dd.showDDMark, 0, [this], dd);

                        if(profile.onDragEnter)profile.boxing().onDragEnter(profile, e, this, key, data, item);
                    },
                    beforeMouseout:function(profile, e, src){
                        var dd = linb.dragDrop, key = dd.dragKey, data = dd.data;
                        //not include the dragkey
                        if(dd._current==src){
                            var item;
                            if(profile.boxing().getItemByDom)item=profile.boxing().getItemByDom(src);

                            if(profile.onDropMarkClear && (false==profile.boxing().onDropMarkClear(profile, e, this, key, data, item))){}
                            else
                                _.resetRun('showDDMark', dd.showDDMark, 0, [null], linb.dragDrop);

                            if(profile.onDragLeave)profile.boxing().onDragLeave(profile, e, this, key, data, item);
                            dd._current=null;
                        }
                    },
                    beforeDrop:function(profile, e, src){
                        var dd = linb.dragDrop, key = dd.dragKey, data = dd.data;
                        var item;
                        if(profile.boxing().getItemByDom)item=profile.boxing().getItemByDom(src);

                        if(profile.onDropMarkClear && (false==profile.boxing().onDropMarkClear(profile, e, this, key, data, item))){}
                        //else
                        //    _.resetRun('showDDMark', dd.showDDMark, 0, [null], linb.dragDrop);
                        //dd._current=null;
                        if(profile.onDrop)profile.boxing().onDrop(profile, e, this, key, data, item);
                    }
                };

                //attach Behaviors
                _.each(this.$Behaviors,function(o,i){
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
                        onmouseover:1,
                        onmouseout:1,
                        ondrop:1
                    });
                });

                if(!this.prototype.empty)
                this.prototype.empty=function(){
                    return this.each(function(o){
                        o.getSubNode(o.keys[key]).empty();
                    });
                };

                //attach EventHandlers
                this.setEventHandlers({
                    onDragEnter:function(profile, e, node, key, data, item){},
                    onDragLeave:function(profile, e, node, key, data, item){},
                    onDrop:function(profile, e, node, key, data, item){},
                    onDropTest:function(profile, e, node, key, data, item){},
                    onDropMarkShow:function(profile, e, node, key, data, item){},
                    onDropMarkClear:function(profile, e, node, key, data, item){}
                });

                //attach DataModel
                if(!this.$DataModel.dropKeys)
                    this.setDataModel({dropKeys:''});
                return this;
            },
            dragable : function(key, getDragKey, getDragData){
                if(!getDragKey)getDragKey=this.getDragKey;
                if(!getDragData)getDragData=this.getDragData;
                _.each(this.$Behaviors,function(o,i){
                    var v;
                    if(key=='KEY'){
                        v=o.$;
                    }else{
                        if(!o.$[key])o.$[key]={};
                        v=o.$[key];
                    }
                    _.merge(v, {
                        onMousedown:function(profile, e, src){
                            //not resizable or drag
                            if(!profile.properties.dragKey)return;
                            var pos=linb.event.getPos(e);
                            linb([src],false).startDrag(e, {
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
                        onDragbegin:function(profile, e, src){
                            linb(src).onMouseout(true,{$force:true}).onMouseup(true);
                        }
                    }, 'all');
                    if(!v.$eventhandler)v.$eventhandler={};
                    _.merge(v.$eventhandler,{
                        onmousedown:1,
                        ondragbegin:1
                    });
                });
                return this;
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
    //iWidget cls
    Class("linb.UI.iWidget", ["linb.UI", "linb.iDataBinder"],{
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
                this.each(function(profile){
                    profile.properties.$UIvalue = profile.properties.value = value||'';
                    delete profile.inValid;
                });
                this.setCtrlValue(value||'');
                this.setDirtyMark();
                return this;
            },

            updateUIValue:function(value){
                var self=this;
                this.each(function(profile){
                    var r,prop=profile.properties, ovalue = prop.$UIvalue, box = profile.boxing();
                    if(ovalue !== value){
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
            getDirtied:function(){
                var arr;
                this.each(function(profile){
                    var prop = profile.properties;
                    if(prop.value !== prop.$UIvalue)
                        arr.push(profile);
                });
                return linb.UI.pack(arr);
            },

            checkUIValueValid:function(){
                var r=true,prop;
                this.each(function(profile){
                    prop=profile.properties;
                    if(!profile.box.checkValid(profile, prop.$UIvalue)){
                        if(profile.domNode)profile.boxing().setDirtyMark();
                        r=false;
                    }
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
                            var r,p=profile.properties, ovalue = p.value, box=profile.boxing(), oui;
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

                                delete profile.inValid;
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
                        v = String(v).toLowerCase()!='false';
                        this.boxing().disabled(v);
                    }
                },
                dock:{
                    ini:'none',
                    listbox:['none','top','bottom','left','right','width','height','fill','cover'],
                    action:function(v){
                        if(this.domNode)
                            this.box.dock(this,true);
                    }
                },
                dockOrder:{
                    ini: 1,
                    action:function(v){
                        if(this.domNode && this.properties.dock!='none')
                            this.box.dock(this,true,true);
                    }
                },
                dockMargin:{
                    ini:{left:0,top:0,right:0,bottom:0},
                    action:function(v){
                        if(this.domNode && this.properties.dock!='none')
                            this.box.dock(this,true,true);
                    }
                },
                dockFloat:{
                    ini:false,
                    action:function(v){
                        if(this.domNode && this.properties.dock!='none')
                            this.box.dock(this,true,true);
                    }
                }
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
                beforeDestroy:function(profile){},

                onHotKeydown:function(profile, key, control, shift, alt, e, src){},
                onHotKeypress:function(profile, key, control, shift, alt, e, src){},
                onHotKeyup:function(profile, key, control, shift, alt, e, src){}
            },
            createdTrigger:function(){
                var p=this.properties,box=this.boxing();
                this.created=true;
                if(this.afterCreated)
                    box.afterCreated(this);

                //not trigger onresize, just set
                if(p.dock && p.dock != 'none')
                    this.box.dock(this);

                if(typeof p.value !='undefined')
                    box.setCtrlValue(p.value);

                if(p.disabled)
                    box.disabled(true);
                if(this.box.resize){
                    var me=arguments.callee,
                    wc=me.wc||(me.wc='top,bottom,width,fill,cover'.toHash(true)),
                    hc=me.hc||(me.hc='left,right,height,fill,cover'.toHash(true));
                    this.box.resize(this, wc[p.dock]?null:p.width, hc[p.dock]?null:p.height);
                }
            },
            envTrigger:function(){
                var p=this.properties;
                if(p.dock && p.dock != 'none')
                    this.box.dock(this,true);
            },
            dock:function(profile, flag, force){
                var prop = profile.properties, margin=prop.dockMargin, node = profile.root, value = prop.dock || 'none', p= node.parent(), pid=p.id(), region;
                //matix
                if(linb.dom.isMatix(pid))return;
                if(profile.$dockParent!=pid || profile.$dockType != value || force){
                    profile.$dockParent=pid;
                    profile.$dockType = value;

                    //unlink first
                    profile.antiLinks('$dock');
                    profile.antiLinks('$dock1');
                    profile.antiLinks('$dock2');

                    //set the fix value first
                    switch(value){
                        case 'top':
                            region={left:margin.left, right:margin.right, bottom:'auto',height:prop.height?prop.height:''};
                            //width top
                            break;
                        case 'bottom':
                            region={left:margin.left, right:margin.right, top:'auto',height:prop.height?prop.height:''};
                            //width bottom
                            break;
                        case 'left':
                            region={right:'auto',width:prop.width?prop.width:''};
                            //height top left
                            break;
                        case 'right':
                            region={left:'auto',width:prop.width?prop.width:''};
                            //height top right
                            break;
                        case 'width':
                            region={bottom:'auto',height:prop.height?prop.height:'',top:prop.top?prop.top:''};
                            //width left top
                            break;
                        case 'height':
                            region={right:'auto',width:prop.width?prop.width:'',left:prop.left?prop.left:''};
                            //height left top
                            break;
                        case 'fill':
                        case 'cover':
                            region={right:'auto',bottom:'auto'};
                            break;
                        case 'none':
                            region={left:prop.left,top:prop.top,width:prop.width?prop.width:'',height:prop.height?prop.height:''};
                            break;
                    }
                    node.setRegion(region,true);

                    var f, win=false;
                    //if in body, set to window
                    if(p.get(0)===document.body){
                        p=linb([window],false);
                        win=true;
                        if(win && !linb.cache._resizeTime)linb.cache._resizeTime=1;
                    }
                    //set dynamic part
                    if(value != 'none'){
                        if(!win)p.setStyle('overflow','hidden');

                        f = p.getEvent('onResize','dock');
                        if(!f){
                            f=function(p,arg){
                                //get self vars
                                var me=arguments.callee,
                                    map=me.map ||(me.map='top,bottom,left,bottom'.toHash(true)),
                                    arr = me.arr,
                                    rePos=me.rePos,
                                    node=me.node,
                                    win=me.win,
                                    obj,i,k,o,key,target
                                ;
                                //window resize: check time span, for window resize in firefox
                                //force call when input $dockid
                                //any node resize
                                if( arg.$dockid || !win || (_.timeStamp() - linb.cache._resizeTime > 100)){
                                    obj = {left:0,top:0,right:0,bottom:0,width:node.width(),height:node.height()};

                                    for(k=0;key=arr[k++];){
                                        target = me[key];
                                        if(target.length){
                                            if(map[key])arg.width=arg.height=1;
                                            for(i=0;o=target[i++];)
                                                rePos(o, obj, key, arg.$dockid, win||arg.width, win||arg.height);
                                        }
                                    }
                                    if(obj.later){
                                        //for safari
/*                                        if(linb.browser.kde){
                                            _.asyRun(function(){
                                               _.each(obj.later, function(o){
                                                    o.node.setRegion(o, true, true);
                                                });
                                            });
                                        }else
                                            _.each(obj.later, function(o){
                                                o.node.setRegion(o, true, true);
                                            });
*/
                                        _.each(obj.later, function(o){
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
                                        linb.cache._resizeTime = _.timeStamp();
                                }
                            };
                            //self refrence
                            f.node=p;
                            f.arr=['top','bottom','left','right','width','height'];
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
                                    case 'top':
                                        if(!flag){
                                            left=margin.left;
                                            right=margin.right;
                                            top=obj.top+margin.top;
                                            if(parseFloat(style.top)!=top)region.top=top;
                                            temp=obj.width - left - right - x;
                                            if(parseFloat(style.width)!=temp)region.width=temp;
                                            if(!_.isEmpty(region))node.setRegion(region,true);
                                        }
                                        obj.top += (node.offsetHeight() + margin.top + margin.bottom);
                                        break;
                                    case 'bottom':
                                        if(!flag){
                                            left=margin.left;
                                            right=margin.right;
                                            bottom=obj.bottom+margin.bottom;
                                            if(parseFloat(style.bottom)!=bottom)region.bottom=bottom;
                                            temp=obj.width - left - right - x;
                                            if(parseFloat(style.width)!=temp)region.width=temp;
                                            if(!_.isEmpty(region))node.setRegion(region,true);
                                        }
                                        obj.bottom += (node.offsetHeight() + margin.top + margin.bottom);
                                        break;
                                    case 'left':
                                        if(!flag){
                                            left=obj.left+margin.left;
                                            top=obj.top+margin.top;
                                            bottom=obj.bottom+margin.bottom;
                                            if(parseFloat(style.left)!=left)region.left=left;
                                            if(parseFloat(style.top)!=top)region.top=top;
                                            temp=obj.height - top - bottom - y;
                                            if(parseFloat(style.height)!=temp)region.height=temp;
                                            if(!_.isEmpty(region))node.setRegion(region,true);
                                        }
                                        obj.left += (node.offsetWidth() + margin.left + margin.right);
                                        break;
                                    case 'right':
                                        //if no top/bottom and change w only
                                        if(!flag){
                                            right=obj.right+margin.right;
                                            top=obj.top+margin.top;
                                            bottom=obj.bottom+margin.bottom;
                                            if(parseFloat(style.right)!=right)region.right=right;
                                            if(parseFloat(style.top)!=top)region.top=top;
                                            temp=obj.height - top - bottom - y;
                                            if(parseFloat(style.height)!=temp)region.height=temp;
                                            if(!_.isEmpty(region))node.setRegion(region,true);
                                        }
                                        obj.right += (node.offsetWidth() + margin.left + margin.right);
                                        break;
                                    case 'width':
                                        //if no top/bottom/left/right and change h only
                                        if(!w)return;
                                        left = (prop.dock=='cover'?0:obj.left) + margin.left;
                                        right = (prop.dock=='cover'?0:obj.right)  + margin.right;
                                        top = prop.dock=='width'?(parseInt(prop.top) || 0):( (prop.dock=='cover'?0:obj.top) + margin.top);
                                        //later call for w/h change once
                                        temp=obj.width - left - right - x;
                                        obj.later=obj.later||{};
                                        obj.later[profile.$id] = obj.later[profile.$id] || linb.dom.iniBox();
                                        _.merge(obj.later[profile.$id],{
                                            node:node,
                                            width:temp,
                                            left:left,
                                            top:top
                                        },'all');
                                        break;
                                    case 'height':
                                        //if no top/bottom/left/right and change w only
                                        if(!h)return;
                                        top = (prop.dock=='cover'?0:obj.top) + margin.top;
                                        bottom = (prop.dock=='cover'?0:obj.bottom)  + margin.bottom;
                                        left = prop.dock=='height'?(parseInt(prop.left) || 0):((prop.dock=='cover'?0:obj.left)+ margin.left);
                                        //later call for w/h change once
                                        temp=obj.height - top - bottom - y;
                                        obj.later=obj.later||{};
                                        obj.later[profile.$id] = obj.later[profile.$id] || linb.dom.iniBox();
                                        _.merge(obj.later[profile.$id],{
                                            node:node,
                                            height:temp,
                                            left:left,
                                            top:top
                                        },'all');

                                        break;
                                }
                            };

                            //add handler to window or node
                            p.onResize(f,'dock');
                        }
                        var order=function(x,y){
                            x=parseInt(x.properties.dockOrder)||0;y=parseInt(y.properties.dockOrder)||0;
                            return x>y?1:x==y?0:-1;
                        };
                        //set link to node
                        if(value=='fill' || value=='cover'){
                            profile.links(f.height, '$dock1');
                            profile.links(f.width, '$dock2');
                            f.height.sort(order);
                            f.width.sort(order);
                        }else{
                            profile.links(f[value], '$dock');
                            f[value].sort(order);
                        }

                        //
                        linb.cache._resizeTime=1;

                        //set shortuct
                        profile.$dock=f;
                    }else{
                        //delete overflow form style
                        if(!win)p.setStyle('overflow', '');
                    }
                }
                //run once now
                if(value != 'none' && flag)
                    profile.$dock(profile, {width:1, height:1, $dockid:['width','height','fill','cover'].exists(value)?profile.$id:null, $type: value});
            },
            checkValid:function(profile, value){
                return true;
            },
            beforeSerialized:function(profile){
                var r=profile.boxing(),b=false,
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
                    p.items = _.clone(p.items);
                    p.items.each(function(o){
                        _.filter(o,function(o,i){
                            return !linb.Base.$specialChars[i.charAt(0)];
                        })
                    });
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
            }
        },
        Initialize:function(){
            var hash={};
            'left,top,width,height,right,bottom'.toArr().each(function(o){
                hash[o] = {
                    ini:'auto',
                    action:function(value){
                        var p=this.properties,b=false,args={$type:p.dock};
                        if(this.domNode){
                            switch(p.dock){
                                case 'top':
                                    if(!['height', 'top'].exists(o))return;
                                    args.width=args.height=1;
                                    break;
                                case 'bottom':
                                    if(!['height', 'bottom'].exists(o))return;
                                    args.width=args.height=1;
                                    break;
                                case 'left':
                                    if(!['width', 'left'].exists(o))return;
                                    args.width=args.height=1;
                                    break;
                                case 'right':
                                    if(!['width', 'right'].exists(o))return;
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
                                    if(['width', 'height'].exists(o))return;
                                    args.width=args.height=1;
                                    break;
                            }
                            this.root[o](value);
                            if(p.dock!='none')_.tryF(this.$dock,[this, args],this);
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
                    ini:0
                },
                position:{
                    ini : 'absolute',
                    hidden:true,
                    listbox:['relative','absolute'],
                    action:function(value){
                        if(this.domNode)
                            this.root.position(value);
                    }
                }
            });

            this.setDataModel(hash);
            'left,top,width,height,right,bottom,zIndex,position'.toArr().each(function(key){
                this.prototype['refresh'+key.initial()] = function(){
                    this.each(function(profile){
                        var t = (profile.domNode)?profile.root[key]():profile.properties[key];
                        this['set'+key.initial()](t);
                    },this);
                    return this['get'+key.initial()]();
                };
            },this);

        }
    });
    //iList cls
    Class("linb.UI.iList", "linb.UI.iWidget",{
        Instance:{
            activate:function(){
                var profile = this.get(0),
                items = profile.getSubNode(profile.keys.ITEM,true);
                if(!items.isEmpty())
                    items.focus();
                return this;
            },
            insertItems:function(arr, base, before){
                if(!arr || !arr.length)return;
                var self = this.constructor, node, items, r,data,b=this.insertItemsEx;
                return this.each(function(profile){
                    items = profile.properties.items;
                    index = items.subIndexOf('id',base);
                    if(index==-1){
                        items.insert(arr, before?0:-1);
                    }else
                        items.insert(arr, before?index:index+1);

                    // prepare properties format
                    data = profile.box.prepareItems(profile, arr);
                    //if in dom, create it now
                    if(profile.domNode){
                        r = self.subBuild(profile, 'items', data).toDom();
                        if(index==-1){
                            node = profile.getSubNode(profile.keys.ITEMS|| profile.keys.KEY);
                            if(before)
                                node.addFirst(r);
                            else
                                node.addLast(r);
                        }else{
                            node=profile.getSubNode(profile.keys.ITEM, profile.getSubSerialIdByItemId(base));
                            if(before)
                                node.addPre(r);
                            else
                                node.addNext(r);
                        }
                    }
                    if(b)profile.boxing().insertItemsEx(data, base, before);
                });
            },
            removeItems:function(arr){
                var obj,v;
                if(!(arr instanceof Array))arr=[arr];
                var serialId, self = this.constructor, remove=function(profile, arr, target, force){
                    var self=arguments.callee;
                    arr.filter(function(o){
                        var b;
                        if(force || (b=target.exists(o.id))){
                            if(serialId=profile.ItemIdMapSubSerialId[o.id]){
                                // clear maps
                                delete profile.SubSerialIdMapItem[serialId];
                                delete profile.ItemIdMapSubSerialId[o.id];
                                profile.cacheSubId(serialId, 'items');

                                //parent node is deleted
                                if(!force)
                                    if(!(obj = profile.getSubNode(profile.keys.ITEM, serialId) ).isEmpty() )
                                        obj.remove();
                            }
                        }
                        //check sub
                        if(o.sub)self(profile, o.sub, target, force || b);
                        //filter it
                        if(b)return false;
                    },null,true);
                };
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
                    profile.getSubNode(key || profile.keys.ITEMS || profile.keys.KEY, true).empty();
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
            this.setCacheList('test', [{id:'a',caption:'itema',tips:'item a', sub:[{id:'aa',caption:'suba'},{id:'ab',caption:'subb'}]},{id:'b',caption:'itemb',tips:'item b'},{id:'c',caption:'itemc',tips:'item c'}]);

            'getItemByItemId,getItemByDom,getIdBySubId,getSubSerialIdByItemId'.toArr().each(function(s){
                this[s]=function(){
                    var t=this.get(0);
                    return t[s].apply(t,arguments);
                };
            },this.prototype);
        },
        Static:{
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
            showTips:function(profile, id, pos){
                if(profile.properties.disabled)return;
                if(profile.SubSerialIdMapItem && _.get(profile.SubSerialIdMapItem,[id,'disabled']))return;

                var item = profile.getItemByDom(id);
                if(item && item.tips){
                    linb.UI.Tips.show(pos, item);
                    return true;
                }else
                    return false;
            }
        }
    });
    //Widget cls
    Class("linb.UI.Widget", "linb.UI.iWidget",{
        Instance:{
            _shadow:function(key){
                if(!linb.dom.support('shadow'))return this;
                return this.each(function(o){
                    var target = o.getSubNode(o.keys.BORDER);
                    if(target.isShadow())return;

                    var v = o.boxing(),
                        d = o.properties,
                        n = v.reBoxing(),
                        w = n.width(),
                        h = n.height()
                        ;

                    o.$shadow=target.shadow({size:d._shadowSize, offset:d.$paddingBottom||d.$border});

                    d.$paddingBottom +=d._shadowSize;
                    d.$paddingRight +=d._shadowSize;
                    o.box.resize(o,w,h);

                });
            },
            _unShadow:function(){
                if(!linb.dom.support('shadow'))return this;
                return this.each(function(o){
                    var target = o.getSubNode(o.keys.BORDER);
                    if(!target.isShadow())return;
                    target.unShadow();

                    var v = o.boxing(),
                        d = o.properties,
                        n = v.reBoxing(),
                        w = n.width(),
                        h = n.height()
                        ;
                    d.$paddingBottom -=d._shadowSize;
                    d.$paddingRight -=d._shadowSize;
                    o.box.resize(o,w,h);
                    delete o.$shadow
                });
            },
            _resize:function(key, args){
                if(!linb.dom.support('resizable'))return this;
                return this.each(function(o){
                    var target = o.getSubNode(o.keys.BORDER),
                    d = o.properties;
                    if(target.isResizable())return;
                    args = args || {};
                    _.merge(args,{
                        child:true,
                        cover:true,
                        parent:o.getSubNode(o.keys.BORDER)
                    },'without');

                    var update = function(pro, target, size, cssPos){
                        var profile=arguments.callee.profile,node=profile.root,prop=profile.properties;
                        if(cssPos){
                            if(cssPos.left){
                                node.leftBy(cssPos.left);
                                prop.left= node.left();
                            }
                            if(cssPos.top){
                                node.topBy(cssPos.top);
                                prop.top = node.top();
                            }
                        }
                        if(size){
                            var w=null,h=null;
                            if(size.width){
                                node.widthBy(size.width);
                                prop.width = w = node.width();
                            }
                            if(size.height){
                                node.heightBy(size.height);
                                prop.height = h = node.height();
                            }
                            profile.box.resize(profile,w,h);
                        }
                    };
                    update.profile = o;

                    o.$resizer = target.resizable(args, target, update);
                });
            },
            _unResize:function(){
                if(!linb.dom.support('resizable'))return this;
                return this.each(function(o){
                    var target = o.getSubNode(o.keys.BORDER);
                    if(!target.isResizable())return;
                    target.unResizable();
                    delete o.$resizer;
                });
            },
            _border:function(key, args){
                if(!linb.dom.support('edged'))return this;
                return this.each(function(o){
                    var target = o.getSubNode(o.keys.BORDER);
                    if(target.isEdged())return;

                    var v = o.boxing(),
                        d = o.properties,
                        n = v.reBoxing(),
                        w = v.reBoxing().width(),
                        h = v.reBoxing().height()
                        ;
                    d.$paddingLeft+=d._borderSize;
                    d.$paddingTop+=d._borderSize;
                    d.$paddingBottom+=d._borderSize;
                    d.$paddingRight+=d._borderSize;
                    args = args || {};
                    _.merge(args,{
                        offset:d._borderSize/2,
                        enlarge:d._borderSize/2,
                        cover:true,
                        parent:o.getSubNode(o.keys.BORDER)
                    },'without');

                    var update = function(target, size, cssPos){
                        var profile=arguments.callee.profile,node=profile.root;
                        if(cssPos){
                            if(cssPos.left)node.leftBy(cssPos.left);
                            if(cssPos.top)node.topBy(cssPos.top);
                        }
                        if(size){
                            var w=null,h=null;
                            if(size.width){
                                node.widthBy(size.width);
                                w=node.width();
                            }
                            if(size.height){
                                node.heightBy(size.height);
                                h=node.height();
                            }
                            profile.box.resize(profile,w,h);
                        }
                    };
                    update.profile = o;

                    o.$border = target.edged(args, target, update, o.makeRootId());
                    o.box.resize(o,w,h);

                    o.resetCache();

                    if(target.isShadow()){
                        var o= target.getShadow();
                        o.setOffset(o.getOffset()+d._borderSize/2+1);
                    }
                });
            },
            _unBorder:function(){
                if(!linb.dom.support('edged'))return this;
                return this.each(function(o){
                    var target = o.getSubNode(o.keys.BORDER);
                    if(!target.isEdged())return;

                    var v = o.boxing(),
                        d = o.properties,
                        n = v.reBoxing(),
                        w = v.reBoxing().width(),
                        h = v.reBoxing().height()
                        ;
                    d.$paddingLeft-=d._borderSize;
                    d.$paddingTop-=d._borderSize;
                    d.$paddingBottom-=d._borderSize;
                    d.$paddingRight-=d._borderSize;
                    target.unEdged();
                    o.box.resize(o,w,h);

                    if(target.isShadow()){
                        var o= target.getShadow();
                        o.setOffset(o.getOffset()-d._borderSize/2-1);
                    }
                    delete o.$border;
                });
            }
        },
        Static:{
            cssNone:false,
            Templates:{'default':{
                tagName:'span',
                className:'linb-uishell ',
                style:'{left}{top}{width}{height}{right}{bottom}{zIndex}{position}',
                FRAME:{
                    tagName:'span',
                    className:'linb-uiframe ',
                    BORDER:{
                        tagName:'span',
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
                    border:'0',
                    padding:'0',
                    margin:'0'
                },
                /*span*/
                '.linb-uiframe':{
                    $order:1,
                    display:'block',
                    position:'relative',
                    overflow:'hidden',
                    border:'0',
                    padding:'0',
                    margin:'0',
                    width:'100%',
                    height:'100%',
                    '-moz-box-flex':'1'
                },
                /*span*/
                '.linb-uiborder':{
                    $order:2,
                    display:'block',
                    position:'absolute',
                    border:'0',
                    padding:'0',
                    margin:'0',
                    left:'0',
                    top:'0',
                    width:'100%',
                    height:'100%'
                }
            },
            Behaviors:{'default':{
                onResize:function(profile, e, src){
                    var o = linb([profile.domNode],false),w=null,h=null;
                    if(e.width)
                        w=o.width();
                    if(e.height)
                        h=o.height();
                    profile.box.resize(profile, w, h);
                }
            }},

            DataModel:{
                shadow:{
                    ini:false,
                    action: function(v){
                        //for string input
                        v = String(v).toLowerCase()!='false';
                        if(v)
                            this.boxing()._shadow(v);
                        else
                            this.boxing()._unShadow();
                    }
                },
                resizable:{
                    ini:false,
                    action: function(v){
                        //for string input
                        v = String(v).toLowerCase()!='false';
                        if(v){
                            var t = this.properties,arg={};
                            _.merge(arg,t,'all',['minHeight', 'minWidth', 'maxHeight', 'maxWidth']);
                            this.boxing()._resize(v,arg);
                        }else
                            this.boxing()._unResize();
                    }
                },
                border:{
                    ini:false,
                    action: function(v){
                        //for string input
                        v = String(v).toLowerCase()!='false';
                        if(v)
                            this.boxing()._border(v);
                        else
                            this.boxing()._unBorder();
                    }
                },
                // setCaption and getCaption
                caption:{
                    // ui update function when setCaption
                    action: function(value){
                        this.getSubNode(this.keys.CAPTION).html(value);
                        var p = this.properties;
                        if(p.hAlign && p.hAlign!='left')this.boxing().setHAlign(p.hAlign,true);
                        if(p.vAlign && p.vAlign!='top')this.boxing().setVAlign(p.vAlign,true);
                    }
                },
                // setIcon and getIcon
                icon:{
                    ini:'',
                    action: function(value){
                        this.getSubNode(this.keys.ICON)
                            .display(value?'':'none')
                            .setStyle('backgroundImage','url('+(value||'')+')');
                    }
                },
                iconPos:{
                    ini:'',
                    action: function(value){
                        this.getSubNode(this.keys.ICON)
                            .setStyle('backgroundPosition', value);
                    }
                },
                tips:'',

                //hide props
                $paddingTop:0,
                $paddingLeft:0,
                $paddingBottom:0,
                $paddingRight:0,
                $border:0,

                _shadowSize:8,
                _borderSize:4
            },
            createdTrigger:function(){
                var prop = this.properties, o=this.boxing();

                prop.$UIvalue = prop.value;
                //in firefox a inner input will break input's 'enter' key.
                if(prop.border)o._border(prop.border);
                if(prop.resizable)o.setResizable(prop.resizable,true);
                if(prop.shadow)o._shadow(prop.shadow);

                if(prop.disabled)o.disabled(true);
            },
            resize:function(profile,w,h){
                var o = profile.getSubNode(profile.keys.BORDER), t = profile.properties,
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
    Class("linb.UI.iDataSource");
    Class("linb.UI.iContainer");
    Class("linb.UI.iForm");
    Class("linb.UI.iMisc");
    Class("linb.UI.iNavigator");
    Class('linb.UI.iSchedule');
    Class("linb.UI.Div", "linb.UI.iWidget",{
        Static:{
            cssNone:true,
            Templates:{'default':{
                tagName:'div',
                style:'overflow:auto;{left}{top}{width}{height}{right}{bottom}{zIndex}{position}',
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
                        this.root.html(v);
                    }
                }
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
    Class("linb.UI.Panel", ["linb.UI.Div","linb.UI.iContainer"],{
        Static:{
            Dropable:['KEY']
        }
    });
};
