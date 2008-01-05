    //iDataBinder
    Class("linb.iDataBinder","linb.Base",{
        Constructor:function(){
            arguments.callee.upper.apply(this,arguments);
            //for box
            this._nodes=[];
        },
        Instance:{
            each:function(fun){
                var self=this;
                self._nodes.each(function(o,i){
                    return fun.call(self, o, i);
                });
                return self;
            },
            getDataBinder:function(){
                var profile=this.get(0);
                return linb.iDataBinder.getDataBinder(profile.properties.dataField);
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
            },
            updateDataFromDs:function(v, flag){
                return this.each(function(profile){
                    var t, box=profile.boxing();
                    if(typeof (t=v.getField(profile.properties.dataField))!='undefined'){
                        if(flag)
                            box.updateUIValue(t);
                        else
                            box.setValue(t, true);
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
            getDataSource:function(){
                var profile=this.get(0);
                return linb.DataSource.getFromDataBinderName(profile.properties.dataBinder);
            }
        },
        Static:{
            _pool:{},
            clear:function(){
                this._pool={};
            },
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
                            var p=profile.properties, box=profile.boxing();
                            p.dataBinder=v;
                            var b=false;
                            if(v){
                                linb.iDataBinder.link(v, profile);
                                if(ds=linb.DataSource.getDataSource(v))
                                    if(r=ds.getField(p.dataField)){
                                        b=true;
                                        box.updateUIValue(r);
                                    }
                            }
                            if(!b)
                                box.updateUIValue('');
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
                            var p=profile.properties, box=profile.boxing(), t;
                            p.dataField=v;
                            var b=false;
                            if(v){
                                if(t=p.dataBinder)
                                    if(ds=linb.DataSource.getDataSource(t))
                                        if(r=ds.getField(v)){
                                            b=true;
                                            box.updateUIValue(r);
                                        }
                            }
                            if(!b)
                                box.updateUIValue('');
                        });
                    }
                }
            },
            createdTrigger:function(){
                var self=this, box=self.boxing();
                if(self.dataBinder)box.setDataBinder(self.dataBinder);
                if(self.dataField)box.setDataField(self.dataField);
            }
        }
    });