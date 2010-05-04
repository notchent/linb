Class("linb.UI.ComboInput", "linb.UI.Input",{
    /*Instance*/
    Instance:{
        getValue:function(){
            var n=this.get(0),
                p=n.properties,
                v = arguments.callee.upper.apply(this,arguments);
            if(n.$isNumber)
                v = _.isNumb(parseFloat(v))?parseFloat(v):null;
            else if(p.type=='datepicker')
                v = v?new Date(parseInt(v)):null;
            return v;
        },
        getUIValue:function(){
            var n=this.get(0),
                p=n.properties,
                v = arguments.callee.upper.apply(this,arguments);
            if(n.$isNumber)
                v = _.isNumb(parseFloat(v))?parseFloat(v):null;
            else if(p.type=='datepicker')
                v = v?new Date(parseInt(v)):null;
            return v;
        },
        _getCtrlValue:function(){
            return this.get(0).properties.$UIvalue;
            //return this._fromEditor(this.getSubNode('INPUT').attr('value'));
        },
        _setCtrlValue:function(value, flag){
            var me=arguments.callee, r1=me._r1||(me._r1=/\</),r2=me._r2||(me._r2=/\<\/?[^>]+\>/g);
            return this.each(function(profile){
                if(!profile.$typeOK)
                    profile.box._iniType(profile);

                var o=profile.getSubNode('INPUT'), type=profile.properties.type;
                value=flag?value:profile.boxing().getShowValue(value);
                if(type!=='none'&& !profile.properties.multiLines && typeof value=='string' && r1.test(value))value=value.replace(r2,'');
                o.attr('value',value||'');
                if(type=='colorpicker')
                    o.css({backgroundColor:value, color:linb.UI.ColorPicker.getTextColor(value)});
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

            // try to give default caption
            if(t = profile.CF.getShowValue||profile.$getShowValue)
                v = t(profile, value);
            else{
                //get from items
                if('listbox'==pro.type){
                    var list = (pro.listKey)?linb.UI.getCachedData(pro.listKey):pro.items;
                    if( list && (t=_.arr.subIndexOf(list,'id',value))!=-1){
                      v=list[t].caption;
                      if(v.length>0)
                        v=v.charAt(0)=='$'?linb.getRes(v.slice(1)):v;
                    }else
                        v=null;
                }else
                    v=profile.$showValue;
            }
            if(!_.isSet(v) && (profile.$inputReadonly || pro.inputReadonly))
                v=_.isSet(pro.caption)?pro.caption:null;
            return ""+( _.isSet(v) ? v : _.isSet(value) ? value : "");
        },
        _toEditor:function(value){
            var profile=this.get(0),
                pro=profile.properties,t;

                if(t= profile.CF.toEditor||profile.$toEditor)
                    return t(profile, value);
            return value;
        },
        _fromEditor:function(value){
            var profile=this.get(0),
                pro=profile.properties,t;

                if(t= profile.CF.fromEditor||profile.$fromEditor)
                    return t(profile, value);
            return value;
        },
        _cache:function(){
            var profile=this.get(0), drop=profile.$drop, cached=profile.properties.cachePopWnd;
            if(drop){
                if(!cached){
                    drop.boxing().destroy();
                    delete profile.$drop;
                }else{
                    if(linb.browser.opr)
                        drop.getRoot().css('display','none');
                    _.asyRun(function(){
                        profile.getSubNode('POOL').append(drop.getRoot())
                    });
                }
            }
            delete profile.$poplink;
            return cached;
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
                var o = profile.getSubNode('FILE').get(0)
                if(!o.value)
                    return null;

                var c=o.cloneNode(false);
                //inner replace
                linb.setNodeData(c.$linbid=o.$linbid,'element',c);
                c.onclick=o.onclick;
                c.onchange=o.onchange;

                //remove those
                if(linb.browser.ie)
                    o.removeAttribute('$linbid');
                else
                    delete o.$linbid;
                o.id=o.onclick=o.onchange=null;

                //a special node, must delete if from cache here:
                delete profile.$_domid[profile.keys['FILE']];
                linb([o]).addPrev(c).remove(false);
                c=null;

                this.setUIValue(this.getValue());

                return o;
            }
        },
        resetValue:function(value){
            this.each(function(p){
                if(p.properties.type=='upload')
                    p.getSubNode('FILE').attr('value','');
            });
            return arguments.callee.upper.apply(this,arguments);
        },
        _drop:function(e,src){
            return this.each(function(profile){
                var pro = profile.properties, type=pro.type, cacheDrop=pro.cachePopWnd;
                if(pro.disabled||pro.readonly)return;

                if(type=='upload'||type=='none'||type=='spin'||type=='currency'||type=='number')return;
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
                if((profile.beforeComboPop && false===box.beforeComboPop(profile, pos, e, src))||type=='getter'||type=='cmdbox'||type=='popbox')
                    return;

                //get cache key
                var cachekey;
                if(cacheDrop){
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
                                    cachekey = "!"+pro.listKey;
                            else
                                cachekey = "$"+profile.$linbid;
                    }
                    //get from global cache
                    if(cachekey){
                        //filter first
                        _.filter(profile.box.$drop,function(o){
                            return !!o.renderId;
                        });
                        profile.$drop = profile.box.$drop[cachekey];
                    }
                }

                //cache pop
                if(!profile.$drop){
                    switch(type){
                        case 'combobox':
                        case 'listbox':
                        case 'helpinput':
                            o = linb.create('List').render();
                            o.host(profile).setDirtyMark(false).setItems(_.copy(pro.items)).setListKey(pro.listKey||'');
                            if(pro.dropListHeight)
                                o.setHeight(pro.dropListHeight);
                            else
                                o.adjustSize();
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
                                .activate();

                                //cache pop
                                return b2._cache();
                            });
                            break;
                        case 'timepicker':
                            o = linb.create('TimePicker').render();
                            o.host(profile);
                            o.beforeClose(function(){this.boxing().activate()._cache();return false});
                            o.beforeUIValueSet(function(p, o, v){
                                var b2=this.boxing();
                                //update value
                                b2.setUIValue(v).activate();
                                return b2._cache();
                            });
                            break;
                        case 'datepicker':
                            o = linb.create('DatePicker').render();
                            o.host(profile);
                            o.beforeClose(function(){this.boxing().activate()._cache();return false});
                            o.beforeUIValueSet(function(p, o, v){
                                var b2=this.boxing();
                                //update value
                                b2.setUIValue(String(v.getTime())).activate();
                                return b2._cache();
                            });

                            break;

                        case 'colorpicker':
                            o = linb.create('ColorPicker').render();
                            o.host(profile);
                            o.beforeClose(function(){this.boxing().activate()._cache();return false});
                            o.beforeUIValueSet(function(p, o, v){
                                var b2=this.boxing();
                                //update value
                                b2.setUIValue('#'+v).activate();
                                return b2._cache();
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
                        o.setWidth(profile.properties.dropListWidth || profile.getRoot().width());
                    case 'timepicker':
                        o.setValue(profile.properties.$UIvalue, true);
                        break;
                    case 'datepicker':
                        var t = profile.$drop.properties;
                        t.WEEK_FIRST=pro.WEEK_FIRST;
                        if(t=profile.properties.$UIvalue)
                            o.setValue(new Date( parseInt(t) ), true);
                        break;
                    case 'colorpicker':
                        o.setValue(profile.properties.$UIvalue.replace('#',''), true);
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
                    box.activate();
                    //unhook
                    linb.Event.keyboardHook('esc');
                    box._cache();
                });
            });
        },
        expand:function(){
            var profile=this.get(0);
            if(profile.renderId)
                profile.boxing()._drop();
        },
        collapse:function(){
            var profile=this.get(0);
            if(profile.renderId && profile.$poplink)
                profile.boxing()._cache();
        }
    },
    /*Initialize*/
    Initialize:function(){
        this.addTemplateKeys(['FILE','BTN','TOP','MID','RBTN','R1','R1T','R1B','R2','R2T','R2B']);
        //modify default template for shell
        var t = this.getTemplate();
        _.merge(t.FRAME.BORDER,{
            SBTN:{
                $order:10,
                style:"{_saveDisplay}",
                STOP:{},
                SMID:{
                    className:"{_commandCls}"
                }
            }
        },'all');
        t.FRAME.POOL={};
        t.className +=' {typecls}';

        this.setTemplate(t);

        this._adjustItems=linb.absList._adjustItems;
    },
    Static:{
        _beforeResetValue:function(profile){
            profile.properties.caption=undefined;
        },
        _iniType:function(profile){
            var pro=profile.properties, value=pro.type, c=profile.box;
            delete profile.$beforeKeypress;
            delete profile.$inputReadonly;
            delete profile.$isNumber;
            delete profile.$compareValue;
            delete profile.$getShowValue;
            delete profile.$toEditor;
            delete profile.$fromEditor;
            delete profile.$typeOK;

            if(value=='listbox'||value=='upload'||value=='cmdbox')
                profile.$inputReadonly=true;

            if(value!='listbox' && value!='combobox' && value!='helpinput')
                pro.items=[];

            if(value=='timepicker'){
                _.merge(profile,{
                    $beforeKeypress : function(profile,c,k){
                        return k.length!=1 || /[0-9:]/.test(k);
                    },
                    $getShowValue : function(profile,value){
                        return value?linb.UI.TimePicker._ensureValue(profile,value):'';
                    },
                    $fromEditor : function(profile,v){
                        if(v){
                            v = linb.UI.TimePicker._ensureValue(profile,v);
                            if(v=='00:00')v=profile.properties.$UIvalue;
                        }
                        return v;
                    }
                },'all');
            }else if(value=='datepicker'){
                var date=linb.Date;
                _.merge(profile,{
                    $beforeKeypress : function(profile,c,k){
                        return k.length!=1 || /[0-9/\-_ ]/.test(k);
                    },
                    $compareValue : function(p,a,b){
                        return (!a&&!b) || (String(a)==String(b))
                    },
                    $getShowValue : function(profile,value){
                        return value?date.getText(new Date(parseInt(value)), 'ymd'):'';
                    },
                    $toEditor : function(profile,value){
                        var v=new Date(parseInt(value));
                        return value?(date.get(v,'y')+'-'+(date.get(v,'m')+1)+'-'+date.get(v,'d')):'';
                    },
                    $fromEditor : function(profile,v){
                        //parse from local text yyyy-m-d
                        if(v){
                            v=linb.Date.parse(v);
                            if(!v)v=profile.properties.$UIvalue;
                            v=linb.Date.getTimSpanStart(v,'d',1);
                            // min/max year
                            if(v.getTime()<profile.properties.min)
                                v.setTime(profile.properties.min);
                            if(v.getTime()>profile.properties.max)
                                v.setTime(profile.properties.max);
                        }
                        return v?String(v.getTime()):'';
                    }
                },'all');
            }else if(value=='currency'){
                profile.$isNumber=1;
                _.merge(profile,{
                    $beforeKeypress : function(profile,c,k){
                        return k.length!=1 || /[0-9,.]/.test(k);
                    },
                    $compareValue : function(p,a,b){
                        return ((a===''&&b!=='')||(b===''&&a!==''))?false:p.box._currency(profile, a)==p.box._currency(profile, b)
                    },
                    $getShowValue : function(p,v){
                        return (_.isSet(v)&&v!=="")?p.box._currency(profile, v):"";
                    },
                    $fromEditor : function(p,v){
                        return (_.isSet(v)&&v!=="")?p.box._currency(profile, v).replace(/,/g,''):"";
                    }
                },'all');
            }else if(value=='number' || value=='spin'){
                profile.$isNumber=1;
                _.merge(profile,{
                    $beforeKeypress : function(profile,c,k){
                        return k.length!=1 || /[-0-9.]/.test(k);
                    },
                    $compareValue : function(p,a,b){
                        return ((a===''&&b!=='')||(b===''&&a!==''))?false:p.box._number(profile, a)==p.box._number(profile, b)
                    },
                    $getShowValue : function(p,v){
                        return (_.isSet(v)&&v!=="")?p.box._number(profile, v):"";
                    },
                    $fromEditor : function(p,v){
                        return (_.isSet(v)&&v!=="")?p.box._number(profile, v):"";
                    }
                },'all');
            }

            if(pro.value)
                pro.$UIvalue=pro.value=c._ensureValue(profile,pro.value);

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
            FILE:{
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
            'KEY-number INPUT, KEY-spin INPUT, KEY-currency INPUT':{
                $order:4,
                'text-align':'right'
            },
            'KEY-upload INPUT, KEY-cmdbox INPUT, KEY-listbox INPUT':{
                $order:4,
                cursor:'pointer',
                'text-align':'left',
                overflow:'hidden'
            },
            'KEY-upload BORDER, KEY-cmdbox BORDER, KEY-listbox BORDER':{
                $order:1,
                background:linb.UI.$bg('inputbgb.gif', '#fff left bottom repeat-x',"Input")
            },
            'KEY-upload BOX, KEY-cmdbox BOX, KEY-listbox BOX':{
                $order:4,
                background:'none'
            },
            'RBTN,SBTN,BTN':{
                display:'block',
                'z-index':'1',
                cursor:'pointer',
                width:'16px',
                height:'20px',
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
            'SBTN, BTN':{
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
                height:'16px'
            },
            'SMID':{
                $order:3,
                'background-position':'-16px -16px'
            },
            'SMID-save':{
                $order:8,
                'background-position': '-32px 0'
            },
            'SMID-delete':{
                $order:8,
                'background-position': '-32px -16px'
            },
            'SMID-add':{
                $order:8,
                'background-position': '-32px -32px'
            },
            'SMID-remove':{
                $order:8,
                'background-position': '-32px -48px'
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
            FILE:{
                onClick : function(profile, e, src){
                    var prop=profile.properties;
                    if(prop.disabled || prop.readonly)return;
                    if(profile.onFileDlgOpen)profile.boxing().onFileDlgOpen(profile,src);
                },
                onChange:function(profile, e, src){
                    profile.boxing().setUIValue(linb.use(src).get(0).value+'');
                }
            },
            BTN:{
                onClick : function(profile, e, src){
                    var prop=profile.properties;
                    if(prop.disabled || prop.readonly)return;
                    profile.boxing()._drop(e, src);
                }
            },
            SBTN:{
                onClick : function(profile, e, src){
                    var prop=profile.properties;
                    if(prop.disabled || prop.readonly)return;
                    if(profile.onCommand)profile.boxing().onCommand(profile,src);
                }
            },
            INPUT:{
                onChange:function(profile, e, src){
                    if(profile.$_onedit||profile.$_inner)return;

                    var o=profile.inValid,
                        b=profile.box,
                        instance=profile.boxing(),
                        v = instance._fromEditor(linb.use(src).get(0).value),
                        uiv=profile.properties.$UIvalue;
                    if(!instance._compareValue(uiv,v)){
                        profile.$_inner=1;
                        delete profile.$_inner;

                        //give a invalid value in edit mode
                        if(v===null)
                            instance._setCtrlValue(uiv);
                        else{
                            // trigger events
                            instance.setUIValue(v);
                            // input/textarea is special, ctrl value will be set before the $UIvalue
                            profile.properties.$UIvalue=v;
                            if(o!==profile.inValid) if(profile.renderId)instance._setDirtyMark();
                        }
                    }
                    b._asyCheck(profile);
                },
                onKeyup:function(profile, e, src){
                    var p=profile.properties,b=profile.box;
                    if(p.dynCheck){
                        var value=linb.use(src).get(0).value;
                        profile.box._checkValid(profile, value);
                        profile.boxing()._setDirtyMark();
                    }
                    b._asyCheck(profile);

                    var key=linb.Event.getKey(e);
                    if(key[0]=='down'|| key[0]=='up'){
                        if(p.type=='spin'){
                            linb.Thread.abort(profile.$linbid+':spin');
                            return false;
                        }
                    }
                },
                onFocus:function(profile, e, src){
                    var p=profile.properties,b=profile.box;
                    if(p.disabled || p.readonly)return false;
                    if(profile.onFocus)profile.boxing().onFocus(profile);
                    if(profile.$inputReadonly || p.inputReadonly)return;
                    profile.getSubNode('BORDER').tagClass('-focus');
                    
                    var instance=profile.boxing(),
                        uiv=p.$UIvalue,
                        v=instance._toEditor(uiv);
                    //string compare
                    if(v!==uiv){
                        //here, dont use $valueFormat, valueFormat or onValueFormat
                        //use $getShowValue, $toEditor, $fromEditor related functions
                        profile.$_onedit=true;
                        linb.use(src).get(0).value=v;
                        delete profile.$_onedit;
                    }

                    //if no value, add mask
                    if(p.mask){
                        var value=linb.use(src).get(0).value;
                        if(!value)
                            _.asyRun(function(){
                                profile.boxing().setUIValue(value=profile.$Mask);
                                b._setCaret(profile,linb.use(src).get(0))
                            });
                    }
                    //show tips color
                    profile.boxing()._setTB(3);                
                },
                onBlur:function(profile, e, src){
                    var p=profile.properties;
                    if(p.disabled || p.readonly)return false;
                    if(profile.onBlur)profile.boxing().onBlur(profile);
                    if(profile.$inputReadonly || p.inputReadonly)return;

                    var b=profile.box,
                        instance=profile.boxing(),
                        uiv=p.$UIvalue,
                        v = instance._fromEditor(linb.use(src).get(0).value);

                    profile.getSubNode('BORDER').tagClass('-focus',false);

                    //onblur check it
                    if(instance._compareValue(p.$UIvalue,v)){
                        profile.box._checkValid(profile, v);
                        instance._setCtrlValue(uiv);
                    }
                    instance._setDirtyMark();
                    b._asyCheck(profile);
                },
                onKeydown : function(profile, e, src){
                   var  p=profile.properties,
                    b=profile.box,
                        m=p.multiLines,
                        evt=linb.Event,
                        k=evt.getKey(e);
                    if(p.disabled || p.readonly)return;

                    //fire onchange first
                    if(k[0]=='enter' && (!m||k[3]) && !p.inputReadonly && !profile.$inputReadonly)
                        linb.use(src).onChange();

                    if(k[0].length>1)
                        profile.$keyD=k[0];

                    b._asyCheck(profile);

                    if(p.mask){
                        if(k[0].length>1)profile.$ignore=true;
                        else delete profile.$ignore;
                        switch(k[0]){
                            case 'backspace':
                                b._changeMask(profile,linb.use(src).get(0),'',false);
                                return false;
                            case 'delete':
                                b._changeMask(profile,linb.use(src).get(0),'');
                                return false;
                        }
                    }

                    if(k[0]=='down'|| k[0]=='up'){
                        if(p.type=='spin'){
                            profile.box._spin(profile, k[0]=='up');
                            return false;
                        }if(k[1] && p.type){
                            profile.boxing()._drop(e,src);
                            return false;
                        }
                    }
                },
                onClick : function(profile, e, src){
                    var prop=profile.properties;
                    if(prop.type=='cmdbox'){
                        if(profile.onClick)
                            profile.boxing().onClick(profile, e, src, prop.$UIvalue);
                    //DOM node's readOnly
                    }else if(prop.inputReadonly || profile.$inputReadonly){
                        if(prop.disabled || prop.readonly)return;
                        profile.boxing()._drop(e, src);
                    }
                }
            },
            R1:{
                onMousedown:function(profile){
                    var prop=profile.properties;
                    if(prop.disabled || prop.readonly)return;
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
                    var prop=profile.properties;
                    if(prop.disabled || prop.readonly)return;
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
            onCommand:function(profile, node){},
            beforeComboPop:function(profile, pos, e, src){},
            onClick:function(profile, e, src, value){}
        },
        _posMap:{
            none:'',
            currency:'',
            'number':'',
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
            cachePopWnd:true,
            listKey:{
                set:function(value){
                    var t = linb.UI.getCachedData(value),
                        o=this;
                    o.boxing().setItems(t?t:o.properties.items);
                    o.properties.listKey = value;
                }
            },
            dropListWidth:0,
            dropListHeight:0,
            items:{
                ini:[],
                set:function(value){
                    var o=this;
                    value = o.properties.items = o.box._adjustItems(value);
                    if(o.renderId){
                        //clear those
                        o.SubSerialIdMapItem={};
                        o.ItemIdMapSubSerialId={};
                        o.box._prepareItems(o, value);

                        // if popped
                        if(o.$poplink)
                            o.$poplink.boxing().setItems(value).adjustSize();
                        else
                            o.boxing().clearPopCache();
                    }
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
            type:{
                ini:'combobox',
                listbox:_.toArr('none,combobox,listbox,upload,getter,helpinput,cmdbox,popbox,timepicker,datepicker,colorpicker,spin,currency,number'),
                set:function(value){
                    var pro=this;
                    pro.properties.type=value;
                    if(pro.renderId)
                        pro.boxing().refresh();
                }
            },
            precision:2,
            increment:0.01,
            min:-Math.pow(10,15),
            // big number for date
            max:Math.pow(10,15),
            commandBtn:{
                ini:"none",
                listbox:_.toArr("none,save,delete,add,remove,custom"),
                action:function(v){
                    this.boxing().refresh();
                }
            },
            inputReadonly:{
                ini:false,
                action: function(v){
                    var n=this.getSubNode('INPUT'),
                        cls=this.getClass('KEY','-inputreadonly');
                    if(v)this.getRoot().addClass(cls);
                    else this.getRoot().removeClass(cls);

                    if(!v && (this.properties.readonly||this.$inputReadonly))
                        v=true;
                    n.attr('readonly',v).css('cursor',v?'pointer':'');
                }
            },
            readonly:{
                ini:false,
                action: function(v){
                    var n=this.getSubNode('INPUT'),
                        cls=this.getClass('KEY','-readonly');                    
                    if(v)this.getRoot().addClass(cls);
                    else this.getRoot().removeClass(cls);

                    if(!v && (this.properties.inputReadonly||this.$inputReadonly))
                        v=true;
                    n.attr('readonly',v).css('cursor',v?'pointer':'');
                        
                }
            },
            // caption is for readonly comboinput(listbox/cmdbox are readonly)
            caption:{
                ini:null,
                set:function(v,force){
                    var p=this.properties;
                    p.caption=v;
                    if(_.isSet(p.caption) && this.renderId){
                        if(this.$inputReadonly || p.inputReadonly){
                            this.getSubNode('INPUT').attr("value",this.boxing().getShowValue());
                        }
                    }
                },
                get:function(){
                    return this.boxing().getShowValue();
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
            else if(p.inputReadonly)
                instance.setInputReadonly(true,true);
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
                case 'none':
                case 'currency':
                case 'number':
                break;
                case 'spin':
                    t.RBTN={
                        $order:20,
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
                case 'upload':
                    t.FILE={
                        $order:20,
                        tagName:'input',
                        type:'file',
                        hidefocus:linb.browser.ie?"hidefocus":null,
                        size:'1'
                    };
                case 'listbox':
                case 'cmdbox':
                    t.BOX.WRAP.INPUT.tagName='input';
                    t.BOX.WRAP.INPUT.type='button';
                default:
                    t.BTN={
                        $order:20,
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

            data._type="text";

            data._saveDisplay = data.commandBtn!='none'?'':'display:none';
            data._commandCls = profile.getClass("SMID","-"+data.commandBtn);

            data._popbtnDisplay = data.type!='none'?'':'display:none';
            data.typecls=profile.getClass('KEY','-'+data.type);
            return data;
        },
        _ensureValue:function(profile, value){
            var me=arguments.callee, reg=me._reg||(me._reg=/^#[\w]{6}$/),prop=profile.properties;
            //if value is empty
            if(!_.isSet(value) || value==='')return '';

            switch(profile.properties.type){                
                case 'datepicker':
                    var d;
                    if(value){
                        if(_.isDate(value))
                            d=value;
                        else if(isFinite(value))
                            d=new Date(parseInt(value));
                    }
                    return d?String(linb.Date.getTimSpanStart(d,'d',1).getTime()):"";;
                case 'colorpicker':
                    return '#'+linb.UI.ColorPicker._ensureValue(null,value);
                case 'timepicker':
                    return linb.UI.TimePicker._ensureValue(null,value);
                case 'currency':
                    return this._currency(profile, value);
                case 'number':
                case 'spin':
                    return this._number(profile, value);                
                default:
                    return typeof value=='string'?value:(value||value===0)?String(value):'';
            }
        },
        _number:function(profile, value){
            var prop=profile.properties;
            value=parseFloat(value+"")||0;
            value=value>prop.max?prop.max:value<prop.min?prop.min:value;
            return value.toFixed(prop.precision);
            //var n=Math.pow(10,Math.max(parseInt(prop.precision)||0,0));
            //value=(+value||0);
            //value=Math.ceil((value-0.0000000000003)*n)/n;
        },
        _currency:function(profile, value){
            var prop=profile.properties,min=Math.max(prop.min,0);
            value=parseFloat((value+"").replace(/,/g,''))||0;
            value=value>prop.max?prop.max:value<min?min:value
            value=value.toFixed(prop.precision);
            value= value.split(".");
            value[0] = value[0].split("").reverse().join("").replace(/(\d{3})(?=\d)/g, "$1,").split("").reverse().join("");
            return value.join(".");
        },
        _onresize:function(profile,width,height){
            var $hborder=1, $vborder=1,
                toff=linb.UI.$getCSSValue('linb-comboinput-input','paddingTop'),
                loff=linb.UI.$getCSSValue('linb-comboinput-input','paddingLeft');

            var t = profile.properties,
                o = profile.getSubNode('BOX'),
                px='px',
                f=function(k){return k?profile.getSubNode(k).get(0):null},
                v1=f('INPUT'),
                save=f(t.commandBtn!='none'?'SBTN':null),
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

            if(null!==ww && ww-loff>0)
                v1.style.width=(ww-loff)+px;

            if(null!==hh && hh-toff>0)
                v1.style.height=(hh-toff)+px;
            if(height-2>0){
                if(btn)btn.style.height=(height-2)+px;
                if(save)save.style.height=(height-2)+px;
            }
            if(t.type=='spin'){
                if(height/2-2>0){
                    height=(height/2-2)+px;
                    f('R1').style.height=height;
                    f('R2').style.height=height;
                }
            }

            o.cssRegion({left:left,top:top,width:ww,height:hh});

            /*for ie6 bug*/
            if((profile.$border||profile.$shadow||profile.$resizer) && linb.browser.ie){
                o.ieRemedy();
            }

        }
    }
});
