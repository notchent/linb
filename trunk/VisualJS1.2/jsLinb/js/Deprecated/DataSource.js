    Class("linb.UI.iDataSource");
    //DataSource
    Class("linb.DataSource","linb.Base",{
        Constructor:function(){
            arguments.callee.upper.apply(this,arguments);
            var c = this.constructor,
                profile = this._nodes[0];

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
                var self=this, c=self.constructor,t;
                if(!(t=c._map[self.profile.alias]))return false;
                if(t = linb.iDataBinder.getDataBinder(t))
                    t.updateDataFromDs(self, flag);

                return self;
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
                var self=this,t,p,c=self.constructor;
                if(!(t=c._map[self.profile.alias]))return false;

                if(t=linb.iDataBinder.getDataBinder(t)){
                    if( linb.UI.iWidget.pack(t._nodes).checkUIValueValid() ){
                        t.updateDataToDs();
                        if((p=self.profile).onDataChanged)
                            self.onDataChanged(p, p.properties.value);

                        return true;
                    }else{
                        linb.log('inValid data');
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
                _.arr.each(this._cache,function(o){
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
                var r, index = _.arr.subIndexOf(this._cache,'alias',name);
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