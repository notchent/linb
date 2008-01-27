Class('linb.ComFactory',null,{
    Static:{
        _pro:{},
        _cache:{},
        _domId:'linb:ComFactory:',
        getProfile:function(key){
            return key?this._pro[key]:this._pro;
        },
        setProfile:function(key, value){
            if(typeof key=='string')
                this._pro[key]=value;
            else
                this._pro=key;
        },
        clear:function(){
            _.each(this._cache,function(o){
                o.destroy();
            });
            this._cache={};
        },
        setCom:function(id, obj){
            this._cache[id]=obj;
            obj.comRefId=id;
        },
        getComFromCache:function(id){
            return this._cache[id];
        },
        getCom:function(id, threadid, onEnd){
            var c=this._cache,p=this._pro,ini=p._iniMethod;
            if(c[id]){
                _.tryF(onEnd, [threadid], c[id]);
                return c[id];
            }else{
                if(!(p=p[id]))return null;
                var self=arguments.callee, me=this, children=p.children;
                //ensure array
                var iniMethod = p.iniMethod || ini || 'create',
                    clsPath = p.cls,
                    props = p.props,
                    cls,
                    task=function(cls,props,threadid){
                        var o = new cls();
                        if(props)
                            _.merge(o,props,'all');
                        linb.ComFactory.setCom(id, o);

                        var args = [function(com){
                            var arr = com.getUIObj().get(),
                                fun=function(arr,firstlayer){
                                    var self1 = arguments.callee;
                                    arr.each(function(v,i){
                                        //if tag exists, replace tag with com from linb.ComFactory
                                        if(v.key=='linb.UI.Tag'){
                                            var tag=v, cid=tag.properties.tagKey;
                                            if(cid && children && children[cid])
                                                self.apply(me, [children[cid], threadid, function(){
                                                    //set link to parent com(linb.Com)
                                                    com[cid]=this;
                                                    //set com parent
                                                    this.parent=com;

                                                    //replace tag with this
                                                    var ui = this.getUIObj(), root;
                                                    // no UI in this com
                                                    if(!(root=ui.get(0)))return;

                                                    linb.UI.Tag.replace(tag,root);

                                                    //if the first layer, and in com's _nodes array
                                                    if(firstlayer && com._nodes[i]==tag)
                                                        com._nodes[i]=root;
                                                }]);
                                        }
                                        if(v.children){
                                            var a=[];
                                            v.children.each(function(o){
                                                a[a.length]=o[0];
                                            });
                                            self1(a);
                                        }
                                    });
                                };
                            //handle tag sub from com
                            fun(arr,1);
                        }];
                        args.push(threadid||null);

                        //insert first
                        if(onEnd)
                            linb.thread(threadid).insert({
                                task:onEnd,
                                args:[threadid],
                                target:o
                            });

                        //composed event here
                        linb.thread(threadid).insert({
                            task:function(threadid){
                                this.fireEvent('afterComposed');
                            },
                            args:[threadid],
                            target:o
                        });

                        //latter
                        _.tryF(o[iniMethod], args, o);
                    };
                linb.thread.asyUI(threadid,
                    [function(threadid){
                        var f=function(a,b,threadid){
                            var cls;
                            if(cls=linb.SC.evalPath(clsPath)){
                                linb.thread(threadid).insert({
                                    task:task,
                                    args:[cls, props, threadid]
                                });
                            }
                        };
                        linb.SC(clsPath, function(){
                            f(0,0,threadid);
                        }, true,{threadid:threadid});

                    }]
                );
            }
        },
        newCom:function(cls,onEnd,threadid){
            var o;
            if(o=linb.SC.evalPath(cls))
                _.tryF(onEnd,[threadid],new o);
            else
                linb.thread.asyUI(threadid,
                    [function(threadid){
                        linb.SC(cls, function(){
                            var o=new (linb.SC.evalPath(cls))();
                            _.tryF(onEnd,[threadid],o);
                        }, true,{threadid:threadid});
                    }]
                );
        },
/*        //for don't-need-return
        straightCall:function(id, method, args, threadid, onEnd){
            var r,t,c=this._cache,p=this._pro;
            //if com exists
            if(t=c[id]){
                //add threadid to args
                args.push(threadid||null);
                r=t[method].apply(t, args);
                _.tryF(onEnd,[r],t);
            }
            //create com first
            this.getCom(id, threadid, function(threadid){
                //add threadid to args
                args.push(threadid||null);
                r=this[method].apply(this, args);
                _.tryF(onEnd,[r],this);
            });
        },
*/
        store:function(id){
            var m,t,c=this._cache,domId=this._domId;
            if(t=c[id]){
                if(!(m=linb.dom.byId(domId)))
                    //using display:none here for performance, when appendchild, it'll not trigger layout etc.
                    linb(document.body).addFirst(linb.create('<div id="'+domId+'" style="display:none;"></div>'));
                m=linb(domId);
                //detach
                t.detach();
                //move to hide
                m.addLast(t.reBoxing());
            }
        },

        //prepare widget (build css string and add css to head, build template)
        prepareWidgets:function(){
            //prepare UI Ctrl
            var self=this,
                fun=function(threadid){
                    var r=false;
                    _.each(linb.UI, function(o){
                        if(o.$linb$ && o['linb.UI'] && o.$Appearances['default'] && !o.cssNone){
                            var path = linb.getPath(o.KEY, '/default/css.css','appearance');
                            if(!linb.UI.$cache_csspath[path]){
                                (new o).get(0).toString();
                                r=true;
                                return false;
                            }
                        }
                    });
                    if(!r)linb.thread(threadid).abort()
                };
            linb.thread(null,[fun],100,null,null,null,true).start();
        },
        prepareComs:function(arr){
            var self=this,funs=[];
            arr.each(function(i){
                funs.push(function(){
                    self.getCom();
                });
            });
            linb.thread(null, funs, 500).start();
        }
    }
});