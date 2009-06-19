Class("linb.UI.ComboInput", "linb.UI.Input",{
    /*Instance*/
    Instance:{
        _setCtrlValue:function(value, flag){
            var me=arguments.callee, r1=me._r1||(me._r1=/\</),r2=me._r2||(me._r2=/\<\/?[^>]+\>/g);
            return this.each(function(profile){
                if(!profile.$typeOK)
                    profile.box._iniType(profile);

                var o=profile.getSubNode('INPUT'), type=profile.properties.type;
                value=flag?value:profile.boxing().getShowValue(value);
                if(type!=='none'&& !profile.properties.multiLines && typeof value=='string' && r1.test(value))value=value.replace(r2,'');
                o.attr('value',value||'');
                if(type=='colorpicker'){
                    profile.getSubNode('BOX').css('backgroundColor',value);
                    o.css('color',linb.UI.ColorPicker.getTextColor(value));
                }
            })
        },
        _compareValue:function(v1,v2){
            var profile=this.get(0),t;
            if(t= profile.CF.compareValue||profile.$compareValue)
                return t(profile, v1, v2);

            return v1===v2;
        },
        getShowValue:function(value){
            var profile=this.get(0),
                pro=profile.properties,v,t;
            if(!_.isDefined(value))
                value=pro.$UIvalue;
            if(t= profile.CF.getShowValue||profile.$getShowValue)
                v = t(profile, value);
            else{
                //get from items
                if('listbox'==pro.type){
                    if( (v=_.arr.subIndexOf(pro.items,'id',value))!=-1){
                        v=pro.items[v].caption;
                        v=v.charAt(0)=='$'?linb.getRes(v.slice(1)):v;
                    }else
                        v='';
                }else
                    v = profile.$showValue;
            }
            v = v || ((value||value===0)?String(value):'');

            if(v!==value)profile.$caption=v;
            else delete profile.$caption;
            return v;
        },
        _getEditValue:function(value){
            var profile=this.get(0),
                pro=profile.properties,t;

                if(t= profile.CF.getEditValue||profile.$getEditValue)
                    return t(profile, value);
            return value;
        },
        _fromEditValue:function(value){
            var profile=this.get(0),
                pro=profile.properties,t;

                if(t= profile.CF.fromEditValue||profile.$fromEditValue)
                    return t(profile, value);
            return value;
        },
        _cache:function(){
            var profile=this.get(0),drop=profile.$drop;
            if(drop){
                if(linb.browser.opr)
                    drop.getRoot().css('display','none');
                _.asyRun(function(){
                    profile.getSubNode('POOL').append(drop.getRoot())
                });
            }
            delete profile.$poplink;
        },
        clearPopCache:function(){
            var profile=this.get(0);
            if(profile.renderId)
                profile.getSubNode('POOL').empty();
            delete profile.$drop;
            return this;
        },
        //for upload ,special must get the original node
        getUploadObj:function(){
            var profile=this.get(0);
            if(profile.renderId && profile.properties.type=='upload'){
                var o = profile.getSubNode('UPLOAD'),c=o.clone();

                //a special node, must delete if from cache here:
                delete profile.$_domid[profile.keys['UPLOAD']];
                o.addPrev(c).remove(false);
                this.setValue('',true);

                return o.get(0);
            }
        },
        resetValue:function(value){
            this.each(function(p){
                if(p.properties.type=='upload')
                    p.getSubNode('UPLOAD').attr('value','');
            });
            return arguments.callee.upper.apply(this,arguments);
        },
        _drop:function(e,src){
            return this.each(function(profile){
                var pro = profile.properties, type=pro.type;
                if(pro.disabled)return;
                if(type=='upload'||type=='none'||type=='spin')return;
                //open already
                if(profile.$poplink)return;

                var o,v,
                box = profile.boxing(),
                main = profile.getRoot(),
                pos = main.offset(),
                size = main.cssSize()
                ;
                size.width += 2;
                pos.top += main.offsetHeight();


                //special cmd type: getter, 'cmdbox' and 'popbox'
                if((profile.beoforeComboPop && false===box.beoforeComboPop(profile, pos, e, src))||type=='getter'||type=='cmdbox'||type=='popbox')
                    return;

                //get cache key
                var cachekey;
                switch(type){
                    case 'timepicker':
                    case 'datepicker':
                    case 'colorpicker':
                        cachekey=type;
                        break;
                    default:
                        if(pro.listKey)
                            //function no cache
                            if(typeof _.get(linb.$cache,['UIDATA', pro.listKey])=='function')
                                profile.$drop = cachekey = null;
                            else
                                cachekey = pro.listKey;
                        else
                            cachekey = profile.$linbid;
                }
                //get from global cache
                if(cachekey){
                    //filter first
                    _.filter(profile.box.$drop,function(o){
                        return !!o.renderId;
                    });
                    profile.$drop = profile.box.$drop[cachekey];
                }

                //cache pop
                if(!profile.$drop){
                    switch(type){
                        case 'combobox':
                        case 'listbox':
                        case 'helpinput':
                            linb.SC('linb.UI.List');
                            o = linb.create('List').render();
                            o.host(profile).setItems(_.copy(pro.items)).setListKey(pro.listKey||'').adjustSize();
                            o.beforeUIValueSet(function(p, ovalue, value){
                                var b2=this.boxing();
                                if(type=='combobox'){
                                    var item=p.queryItems(p.properties.items,function(o){return o.id==value},false,true);
                                    if(item.length)
                                        value = item[0].caption;
                                }
                                //update value
                                b2.setUIValue(value)
                                //set activate
                                .activate()
                                //cache pop
                                ._cache();
                            });
                            break;
                        case 'timepicker':
                            linb.SC('linb.UI.TimePicker');
                            o = linb.create('TimePicker').render();
                            o.host(profile);
                            o.beforeClose(function(){this.boxing().activate()._cache();return false});
                            o.beforeUIValueSet(function(p, o, v){
                                //update value
                                this.boxing().setUIValue(v).activate()._cache();
                            });
                            break;
                        case 'datepicker':
                            linb.SC('linb.UI.DatePicker');
                            o = linb.create('DatePicker').render();
                            o.host(profile);
                            o.beforeClose(function(){this.boxing().activate()._cache();return false});
                            o.beforeUIValueSet(function(p, o, v){
                                //update value
                                this.boxing().setUIValue(String(v.getTime())).activate()._cache();
                            });

                            break;

                        case 'colorpicker':
                            linb.SC('linb.UI.ColorPicker');
                            o = linb.create('ColorPicker').render();
                            o.host(profile);
                            o.beforeClose(function(){this.boxing().activate()._cache();return false});
                            o.beforeUIValueSet(function(p, o, v){
                                //update value
                                this.boxing().setUIValue('#'+v).activate()._cache();
                            });
                            break;
                    }

                    profile.$drop = o.get(0);

                    //set to global cache
                    if(cachekey)
                        profile.box.$drop[cachekey]=profile.$drop;
                }

                o=profile.$drop.boxing();
                o.host(profile);

                //set pop
                switch(type){
                    case 'combobox':
                    case 'listbox':
                    case 'helpinput':
                        o.setWidth(profile.getRoot().width());
                    case 'timepicker':
                        o.setValue(box.getUIValue(), true);
                        break;
                    case 'datepicker':
                        var t = profile.$drop.properties;
                        t.WEEK_FIRST=pro.WEEK_FIRST;
                        if(t=box.getUIValue())
                            o.setValue(new Date( parseInt(t) ), true);
                        break;
                    case 'colorpicker':
                        o.setValue(box.getUIValue().replace('#',''), true);
                        break;
                }

                profile.$poplink = o.get(0);

                //pop
                var node=o.reBoxing();
                node.popToTop(profile.getRoot());

                _.tryF(o.activate,[],o);

                //for on blur disappear
                node.setBlurTrigger(profile.key+":"+profile.$linbid, function(){
                    box._cache();
                }, null, profile.$linbid);

                //for esc
                linb.Event.keyboardHook('esc',0,0,0,function(){
                    box._cache();
                    box.activate();
                    //unhook
                    linb.Event.keyboardHook('esc');
                });
            });
        }
    },
    /*Initialize*/
    Initialize:function(){
        this.addTemplateKeys(['UPLOAD','BTN','TOP','MID','RBTN','R1','R1T','R1B','R2','R2T','R2B']);
        //modify default template for shell
        var t = this.getTemplate();
        _.merge(t.FRAME.BORDER,{
            SBTN:{
                $order:5,
                style:"{_saveDisplay}",
                STOP:{},
                SMID:{}
            }
        },'all');
        t.FRAME.POOL={};
        this.setTemplate(t);
        
        this._adjustItems=linb.absList._adjustItems;
    },
    Static:{
        _iniType:function(profile){
            var pro=profile.properties, value=pro.type;
            if(value=='listbox'||value=='upload')
                profile.boxing().setReadonly(true);

            if(value!='listbox' && value!='combobox' && value!='helpinput')
                pro.items=[];

            if(value=='timepicker'){
                var  o=linb.SC('linb.UI.TimePicker');
                _.merge(profile,{
                    $compareValue : null,
                    $getShowValue : function(profile,value){
                        return value?o._ensureValue(profile,value):'';
                    },
                    $getEditValue : null,
                    $fromEditValue : function(profile,value){
                        return o._ensureValue(profile,value);
                    }
                },'all');
                if(pro.value)
                    pro.$UIvalue=pro.value=o._ensureValue(profile,pro.value);
            }else if(value=='datepicker'){
                var date=linb.Date;
                _.merge(profile,{
                    $compareValue : function(p,a,b){
                        return String(a)==String(b)
                    },
                    $getShowValue : function(profile,value){
                        return value?date.getText(new Date(parseInt(value)), 'ymd'):'';
                    },
                    $getEditValue : function(profile,value){
                        var v=new Date(parseInt(value));
                        return value?(date.get(v,'m')+1)+'/'+date.get(v,'d')+'/'+date.get(v,'y'):'';
                    },
                    $fromEditValue : function(profile,value){
                        //parse from local text mm/dd/yyyy
                        var v=linb.Date.parse(value);
                        if(v)v=linb.Date.getTimSpanStart(v,'d',1);
                        return v?String(v.getTime()):'0';
                    }
                },'all');

                var d=new Date(parseInt(pro.value)||0);
                pro.$UIvalue=pro.value=String(date.getTimSpanStart(d,'d',1).getTime());
            }else{
                delete profile.$compareValue;
                delete profile.$getShowValue;
                delete profile.$getEditValue;
                delete profile.$fromEditValue;
                if(_.isDate(pro.value))
                    pro.$UIvalue=pro.value=String(pro.value);
            }
            profile.$typeOK=true;
        },
        $drop:{},
        Appearances:{
            POOL:{
                position:'absolute',
                left:0,
                top:0,
                width:0,
                height:0,
                display:'none',
                visibility:'hidden'
            },
            UPLOAD:{
                opacity:0,
                '*filter':'alpha(opacity=0)',
                'z-index':'3',
                border:0,
                height:'100%',
                position:'absolute',
                top:0,
                right:0,
                cursor:'pointer',
                'font-size':'12px',
                overflow:'hidden'
            },
            'RBTN,SBTN,BTN':{
                display:'block',
                'z-index':'1',
                cursor:'pointer',
                width:'16px',
                'font-size':0,
                'line-height':0,
                position:'relative',
                'float':'right'
            },
            'SBTN,BTN,R1,R2':{
                'margin-top':'2px'
            },
            'R1, R2, BTN, SBTN, STOP, TOP, R1T, R2T, R1B, R2B, SMID,MID':{
                background: linb.UI.$bg('bg.gif')
            },
            'SBTN,BTN':{
                $order:1,
                'background-position':'left bottom'
            },
            'R1,R2':{
                $order:1,
                display:'block',
                'font-size':0,
                'line-height':0,
                cursor:'pointer',
                width:'16px',
                position:'absolute',
                height:'50%',
                'background-position':'left bottom',
                'margin-top':'2px'
            },
            R1:{
                top:0
            },
            R2:{
                bottom:'-2px'
            },

            'BTN-mouseover, SBTN-mouseover, R1-mouseover, R2-mouseover':{
                $order:2,
                'background-position': '-16px bottom'
            },
            'BTN-mousedown, SBTN-mousedown, R1-mousedown, R2-mousedown':{
                $order:3,
                'background-position': '-32px bottom'
            },
            'STOP, TOP, R1T, R2T':{
                $order:1,
                cursor:'pointer',
                width:'16px',
                'font-size':0,
                'line-height':0,
                position:'absolute',
                top:'-2px',
                left:0,
                height:'4px',
                'background-position':'left -104px'
            },
            'BTN-mouseover TOP,SBTN-mouseover STOP, R1-mouseover R1T, R2-mouseover R2T':{
                $order:2,
                'background-position': '-16px -104px'
            },
            'BTN-mousedown TOP,SBTN-mousedown STOP, R1-mousedown R1T, R2-mousedown R2T':{
                $order:3,
                'background-position': '-32px -104px'
            },
            'R1B,R2B':{
                cursor:'pointer',
                width:'16px',
                'font-size':0,
                'line-height':0,
                position:'absolute',
                left:0,
                top:'50%',
                'margin-top':'-4px',
                height:'6px',
                'z-index':2
            },
            R1B:{
                $order:1,
                'background-position':'-14px -36px'
            },
            R2B:{
                $order:1,
                'background-position':'left -5px'
            },
            'SMID,MID':{
                $order:2,
                cursor:'pointer',
                width:'16px',
                'font-size':0,
                'line-height':0,
                position:'absolute',
                bottom:'0',
                left:0,
                height:'16px',
                'background-position':'0 0'
            },
            SMID:{
                $order:3,
                'background-position': '-14px -16px'
            },
            '.setting-linb-comboinput':{
                'border-style':'solid',
                'border-top-width':'1px',
                'border-bottom-width':'1px',
                'border-left-width':'1px',
                'border-right-width':'1px'
            }
        },
        Behaviors:{
            HoverEffected:{BOX:'BOX',BTN:'BTN',SBTN:'SBTN',R1:'R1',R2:'R2'},
            ClickEffected:{BTN:'BTN',SBTN:'SBTN',R1:'R1',R2:'R2'},
            UPLOAD:{
                onClick : function(profile, e, src){
                    if(profile.onFileDlgOpen)profile.boxing().onFileDlgOpen(profile,src);
                },
                onChange:function(profile, e, src){
                    profile.getSubNode('INPUT').attr('value',linb.use(src).get(0).value).onChange();
                }
            },
            BTN:{
                onClick : function(profile, e, src){
                    profile.boxing()._drop(e,src);
                }
            },
            SBTN:{
                onClick : function(profile, e, src){
                    if(profile.onSave)profile.boxing().onSave(profile,src);
                }
            },
            INPUT:{
                onChange:function(profile, e, src){
                    if(profile.$_onedit||profile.$_inner)return;

                    var o=profile.inValid,
                        instance=profile.boxing(),
                        v = instance._fromEditValue(linb.use(src).get(0).value),
                        uiv=profile.properties.$UIvalue;
                    if(!instance._compareValue(uiv,v)){
                        profile.$_inner=1;
                        delete profile.$_inner;

                        //give a invalid value in edit mode
                        if(v===null)
                            instance._setCtrlValue(uiv);
                        else{
                            instance.setUIValue(v);
                            //input/textarea is special, ctrl value will be set before the $UIvalue
                            profile.properties.$UIvalue=v;
                            if(o!==profile.inValid) if(profile.renderId)instance._setDirtyMark();
                        }
                    }
                },
                onKeyup:function(profile, e, src){
                    var p=profile.properties;
                    if(p.dynCheck){
                        var value=linb.use(src).get(0).value;
                        if(p.$UIvalue!=value)
                            profile.box._checkValid(profile, value);
                        profile.boxing()._setDirtyMark();
                    }
                },
                onFocus:function(profile, e, src){
                    var p=profile.properties, uiv=p.$UIvalue;
                    if(p.disabled)return false;

                    var instance=profile.boxing(),
                        v = instance._getEditValue(uiv);
                    //string compare
                    if(v!==uiv){
                        //here, dont use $valueFormat, valueFormat or onValueFormat
                        //use $getShowValue, $getEditValue, $fromEditValue related functions
                        profile.$_onedit=true;
                        linb.use(src).get(0).value=v;
                        delete profile.$_onedit;
                    }

                    //set css class
                    if(profile.onFocus)profile.boxing().onFocus(profile);
                    profile.getSubNode('BORDER').tagClass('-focus');
                    //show tips color
                    profile.boxing()._setTB(3);
                },
                onBlur:function(profile, e, src){
                    var p=profile.properties,
                        instance=profile.boxing(),
                        uiv=p.$UIvalue,
                        v = instance._fromEditValue(linb.use(src).get(0).value)
                        ;
                    if(p.disabled)return false;
                    if(profile.onFocus)instance.onFocus(profile);
                    profile.getSubNode('BORDER').tagClass('-focus',false);

                    //onblur check it
                    if(instance._compareValue(p.$UIvalue,v)){
                        profile.box._checkValid(profile, v);
                        instance._setCtrlValue(uiv);
                    }
                    instance._setDirtyMark();
                },
                onKeydown : function(profile, e, src){
                    var prop=profile.properties,
                        m=prop.multiLines,
                        key=linb.Event.getKey(e);
                    //fire onchange first
                    if(key[0]=='enter'&& (!m||key[3]))
                        linb.use(src).onChange();
                    if(key[0]=='down'|| key[0]=='up'){
                        if(prop.type=='spin'){
                            profile.box._spin(profile, key[0]=='up');
                            return false;
                        }if(key[1] && prop.type){
                            profile.boxing()._drop(e,src);
                            return false;
                        }
                    }
                },
                onKeyup : function(profile, e, src){
                    var prop=profile.properties,
                        key=linb.Event.getKey(e);
                    if(key[0]=='down'|| key[0]=='up'){
                        if(prop.type=='spin'){
                            linb.Thread.abort(profile.$linbid+':spin');
                            return false;
                        }
                    }
                },
                onClick : function(profile, e, src){
                    if(src.readOnly)
                        profile.boxing()._drop(e, src);
                }
            },
            R1:{
                onMousedown:function(profile){
                    profile.box._spin(profile, true);
                },
                onMouseout:function(profile){
                    linb.Thread.abort(profile.$linbid+':spin');
                },
                onMouseup:function(profile){
                    linb.Thread.abort(profile.$linbid+':spin');
                }
            },
            R2:{
                onMousedown:function(profile){
                    profile.box._spin(profile, false);
                },
                onMouseout:function(profile){
                    linb.Thread.abort(profile.$linbid+':spin');
                },
                onMouseup:function(profile){
                    linb.Thread.abort(profile.$linbid+':spin');
                }
            }
        },
        EventHandlers:{
            onFileDlgOpen:function(profile, node){},
            onSave:function(profile, node){},
            beoforeComboPop:function(profile, pos, e, src){}
        },
        _posMap:{
            none:'',
            combobox:'left top',
            listbox:'left top',
            upload:'-16px top',
            getter:'left -31px',
            helpinput:'-16px -46px',
            cmdbox:'left -16px',
            popbox:'left -46px',
            timepicker:'left -60px',
            datepicker:'left -75px',
            colorpicker:'-16px -60px'
        },
        DataModel:{
            listKey:{
                set:function(v){
                    var t = this.constructor.getCachedData(v);
                    return this.each(function(o){
                        o.boxing().setItems(t?t:o.properties.items);
                        o.properties.listKey = v;
                    });
                }
            },
            items:{
                ini:[],
                action:function(v){
                    var self=this;
                    self.boxing().setValue(null,true);
                    self.SubSerialIdMapItem={};
                    self.ItemIdMapSubSerialId={};
                    //for memory map
                    v=self.box._adjustItems(v);
                    self.box._prepareItems(self, v);
                    self.boxing().clearPopCache();
                },
                set:function(value){
                    return this.each(function(o){
                        o.properties.items = _.copy(value);
                    });
                }
            },
            image:{
                action: function(value){
                    this.getSubNode('MID')
                        .css('backgroundImage','url('+(value||'')+')');
                }
            },
            imagePos:{
                action: function(value){
                    this.getSubNode('MID')
                        .css('backgroundPosition', value);
                }
            },
            readonly:{
                ini:false,
                action:function(v){
                    if(!v && this.properties.type=='listbox')return;
                    this.getSubNode('INPUT').css('cursor',v?'pointer':'default').attr('readonly',v);
                }
            },
            type:{
                ini:'combobox',
                listbox:_.toArr('none,combobox,listbox,upload,getter,helpinput,cmdbox,popbox,timepicker,datepicker,colorpicker,spin'),
                set:function(value, force){
                    return this.each(function(pro){
                        if(pro.properties.type!=value||force){
                            pro.properties.type=value;
                            pro.box._iniType(pro);
                            if(pro.renderId)
                                pro.boxing().refresh();
                        }
                    });
                }
            },
            scale:2,
            increment:0.01,
            min:0,
            max:1,
            saveBtn:{
                ini:false,
                action:function(v){
                    this.boxing().refresh();
                }
            }
        },
        RenderTrigger:function(){
            var self=this,
                instance=self.boxing(),
                p=self.properties;
            self.box._iniType(self);
            if(p.readonly)
                instance.setReadonly(true,true);
        },
        _spin:function(profile, flag){
            var id=profile.$linbid+':spin';
            if(linb.Thread.isAlive(id))return;
            var prop=profile.properties,
                off=prop.increment*(flag?1:-1),
                task={delay:300},
                fun=function(){
                    profile.boxing().setUIValue(String((+prop.$UIvalue||0)+off));
                    task.delay *=0.9;
                };
            task.task=fun;
            linb.Thread(id,[task],500,null,fun,null,true).start();
        },
        _dynamicTemplate:function(profile){
            var properties = profile.properties,
                hash = profile._exhash = "$" +
                    'multiLines:'+properties.multiLines+';'+
                    'type:'+properties.type+';',
                template = profile.box.getTemplate(hash);

            properties.$UIvalue = properties.value;

            // set template dynamic
            if(!template){
                template = _.clone(profile.box.getTemplate());
                var t=template.FRAME.BORDER;

                if(properties.multiLines){
                    t.BOX.WRAP.INPUT.tagName='textarea';
                    delete t.BOX.WRAP.INPUT.type;
                }

                switch(properties.type){
                case 'spin':
                    t.RBTN={
                        $order:5,
                        style:"{rDisplay}",
                        R1:{
                            R1T:{},
                            R1B:{}
                        },
                        R2:{
                            R2T:{},
                            R2B:{}
                        }
                    };
                break;
                case 'none':
                break;
                case 'upload':
                    t.UPLOAD={
                        $order:2,
                        tagName:'input',
                        type:'file',
                        size:'1'
                    };
                default:
                    t.BTN={
                        $order:4,
                        style:"{_popbtnDisplay}",
                        TOP:{},
                        MID:{
                            style:'{_btnStyle}'
                        }
                    };
                }

                // set template
                profile.box.setTemplate(template, hash);
            }
            profile.template = template;
        },
        _prepareData:function(profile){
            var data=arguments.callee.upper.call(this, profile),
                map=profile.box._posMap;
            if(map[data.type])
                data._btnStyle = data.image? ('background: url('+data.image+')' + (data.imagePos||'')) :('background-position:'+map[data.type]);

            data._saveDisplay = data.saveBtn?'':'display:none';
            data._popbtnDisplay = data.type!='none'?'':'display:none';
            return data;
        },
        _ensureValue:function(profile, value){
            var me=arguments.callee, reg=me._reg||(me._reg=/^#[\w]{6}$/),prop=profile.properties;
            switch(profile.properties.type){
                case 'datepicker':
                    return (value.constructor==Date?value.getTime():value) + "";
                case 'colorpicker':
                    return '#'+linb.UI.ColorPicker._ensureValue(null,value);
                case 'timepicker':
                    return linb.UI.TimePicker._ensureValue(null,value);
                case 'spin':
                    var n=Math.pow(10,prop.scale);
                    value=+value||0;
                    value=Math.ceil((value-0.0000000000003)*n)/n;
                    return String(value>prop.max?prop.max:value<prop.min?prop.min:value);
                default:
                    return typeof value!=='string'?value:(value||value===0)?String(value):'';
            }
        },
        _onresize:function(profile,width,height){
            var $hborder=1, $vborder=1,
                toff=linb.UI.$getCSSValue('linb-comboinput-input','paddingTop');

            var t = profile.properties,
                o = profile.getSubNode('BOX'),
                o2 = profile.getSubNode('BORDER'),
                px='px',
                f=function(k){return k?profile.getSubNode(k).get(0):null},
                v1=f('INPUT'),
                save=f(t.saveBtn?'SBTN':null),
                btn=f(t.type=='spin'?'RBTN':t.type=='none'?null:'BTN'),
                ww=width,
                hh=height,
                left=Math.max(0, (t.$b_lw||0)-$hborder),
                top=Math.max(0, (t.$b_tw||0)-$vborder);
            if(null!==ww){
                ww -= Math.max($hborder*2, (t.$b_lw||0)+(t.$b_rw||0));
                ww -= ((save?save.offsetWidth:0)+(btn?btn.offsetWidth:0));
                /*for ie6 bug*/
                /*for example, if single number, 100% width will add 1*/
                /*for example, if single number, attached shadow will overlap*/
                if(linb.browser.ie6)ww=(parseInt(ww/2))*2;
            }
            if(null!==hh){
                hh -=Math.max($vborder*2, (t.$b_lw||0) + (t.$b_rw||0));

                if(linb.browser.ie6)hh=(parseInt(hh/2))*2;
                /*for ie6 bug*/
                if(linb.browser.ie6&&null===width)o.ieRemedy();
            }   

            if(null!==ww)
                v1.style.width=ww+px;

            if(null!==hh)
                v1.style.height=(hh-toff)+px;
            if(height-2>0){
                if(save)save.style.height=(height-2)+px;
                if(btn)btn.style.height=(height-2)+px;
            }
            if(t.type=='spin'){
                if(height/2-2>0){
                    height=(height/2-2)+px;
                    f('R1').style.height=height;
                    f('R2').style.height=height;
                }
            }

            o.cssRegion({left:left,top:top,width:ww,height:hh});
            o2.cssRegion({width:width,height:height});

            /*for ie6 bug*/
            if((profile.$border||profile.$shadow||profile.$resizer) && linb.browser.ie){
                o.ieRemedy();
                o2.ieRemedy();
            }

        }
    }
});
