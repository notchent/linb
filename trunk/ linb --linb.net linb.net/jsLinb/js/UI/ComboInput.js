Class("linb.UI.ComboInput", "linb.UI.Input",{
    /*Instance*/
    Instance:{
        setCtrlValue:function(value, flag){
            return this.each(function(profile){
                profile.getSubNode(profile.keys.INPUT).value(flag?value:profile.boxing().getShowValue(value));
            })
        },
        getShowValue:function(value){
            var profile=this.get(0),pro=profile.properties,v;
            //use setCtrlValue(value, true) dir
            if(profile.onCustomPop)
                v=value;
            else{
                //get from onGetShowValue
                if(profile.onGetShowValue)
                    v = profile.boxing().onGetShowValue(profile, value);
                else{
                    //get from items
                    if('listbox'==pro.type || 'combobox' == pro.type){

                        if( (v=profile.properties.items.subIndexOf('id',value))!=-1){
                            v=profile.properties.items[v].caption;
                            v=v.charAt(0)=='$'?linb.getStr(v.slice(1)):v;
                        }else
                            v='';
                    }else
                        v = profile.$showValue || value;
                }
            }
            return v||value||'';
        },
        _cache:function(){
            var profile=this.get(0);
            if(profile.$drop)
                //profile.$drop.root.display('none') for opera bug
                profile.getSubNode(profile.keys.POOL).addLast(profile.$drop.root.display('none'));
            delete profile.$poplink;
        },
        refreshCache:function(){
            var profile=this.get(0);
            if(profile.domNode)
                profile.getSubNode(profile.keys.POOL).Empty();
        },
        _drop:function(){
            return this.each(function(profile){
                if(profile.properties.disabled)return;
                //open already
                if(profile.$poplink)return;

                var o,v,
                pro = profile.properties,
                box = profile.boxing(),
                main = box.reBoxing(),
                pos = main.absPos(),
                size = main.cssSize()
                ;
                size.width += 2;
                pos.top += main.offsetHeight();

                //get list
                //not normal pop
                switch(pro.type){
                    case 'getter':
                    case 'cmdbox':
                    case 'popbox':
                        profile.boxing().onCustomPop(profile, pos);
                        return;
                }

                //get cache key
                var cachekey;
                switch(pro.type){
                    case 'combobox':
                    case 'listbox':
                    case 'helpinput':
                        if(pro.listKey)
                            //function no cache
                            if(linb.UI.getCacheListType(pro.listKey)=='function')
                                profile.$drop = null;
                            else
                                cachekey = profile.$drop;
                        else
                            cachekey = profile.$id;
                        break;
                    default:
                        cachekey=pro.type;
                }
                //get from global cache
                if(cachekey){
                    //filter first
                    _.filter(profile.box.$drop,function(o){
                        return !!o.domNode;
                    });
                    profile.$drop = profile.box.$drop[cachekey];
                }

                //cache pop
                if(!profile.$drop){
                    switch(pro.type){
                        case 'combobox':
                        case 'listbox':
                        case 'helpinput':
                            linb.SC('linb.UI.List');
                            o = linb.create('List');
                            break;
                            /*
                        case 'timepicker':
                            linb.SC('linb.UI.TimePicker');
                            o = linb.create('TimePicker');
                            break;
                        case 'datepicker':
                            linb.SC('linb.UI.DatePicker');
                            o = linb.create('DatePicker');
                            break;
                        case 'colorpicker':
                            linb.SC('linb.UI.ColorPicker');
                            o = linb.create('ColorPicker');
                            break;
                            */
                    }
                    o.host(profile).setItems(pro.items.copy()).adjustSize();
                    o.beforeValueUpdated(function(pro, ovalue, value, showValue){
                        var box = pro.boxing();
                        //give showValue
                        pro.$showValue = showValue;
                        //update value
                        this.boxing().updateUIValue(value);
                        //cache pop
                        this.boxing()._cache();
                        //set activate
                        this.boxing().activate();

                        return false;
                    });

                    profile.$drop = o.get(0);

                    //set to global cache
                    if(cachekey)
                        profile.$drop.links(profile.box.$drop, cachekey,null, cachekey);
                }
                o=profile.$drop.boxing();

                //set pop
                switch(pro.type){
                    case 'combobox':
                    case 'listbox':
                    case 'helpinput':
                        o.host(profile).setWidth(profile.root.width()).setValue(box.getUIValue());
                        break;
                        /*
                    case 'timepicker':
                    case 'datepicker':
                    case 'colorpicker':
                        o.setValue(box.getUIValue());
                        break;
                        */
                }

                profile.$poplink = o.get(0);

                //pop
                var node=o.reBoxing();
                node.popToTop(profile.root);

                o.activate();

                //for on blur disappear
                node.setBlurTrigger(profile.key+":"+profile.$id, function(){
                    profile.boxing()._cache();
                }, null, profile.$id);

                //for esc
                linb.event.hookKey('esc',0,0,0,function(){
                    profile.boxing()._cache();
                    profile.boxing().activate();
                    //unhook
                    linb.event.hookKey('esc',0,0,0,null);
                });
            });
        }
    },
    /*Initialize*/
    Initialize:function(){
        //modify default template for shell
        var t = this.getTemplate('default');
        _.merge(t.FRAME.BORDER,{
            BTN:{
                $order:2,
                TOP:{},
                MIDDLE:{
                    style:'background-position:{typePos}'
                }
            }
        },'all');
        t.FRAME.POOL={};
        this.setTemplate('default',t);
    },
    Static:{
        $drop:{},
        Appearances:{'default':{
            POOL:{
                position:'absolute',
                left:0,
                top:0,
                width:0,
                height:0,
                display:'none',
                visibility:'hidden'
            },
            BTN:{
                cursor:'pointer',
                width:'13px',
                'font-size':'0',
                'line-height':'0',
                position:'absolute',
                top:'0',
                right:'0',
                background: linb.UI.getCSSImgPara('cmd.gif', ' left bottom no-repeat')
            },
            'BTN-mouseover':{
                $order:1,
                'background-position': '-14px bottom'
            },
            'BTN-mousedown':{
                $order:2,
                'background-position': '-27px bottom'
            },
            TOP:{
                cursor:'pointer',
                width:'13px',
                'font-size':'0',
                'line-height':'0',
                position:'absolute',
                top:'0',
                left:'0',
                height:'4px',
                background: linb.UI.getCSSImgPara('cmd.gif', ' left -104px no-repeat')
            },
            'BTN-mouseover TOP':{
                $order:1,
                'background-position': '-14px -104px'
            },
            'BTN-mousedown TOP':{
                $order:2,
                'background-position': '-27px -104px'
            },
            MIDDLE:{
                cursor:'pointer',
                width:'13px',
                'font-size':'0',
                'line-height':'0',
                position:'absolute',
                bottom:'3px',
                left:'0',
                height:'13px',
                background: linb.UI.getCSSImgPara('cmd.gif', ' left top no-repeat')
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{KEY:'BORDER',BTN:['BTN']},
            _clickEffect:{BTN:['BTN']},
            _focusHook:{INPUT:1},
            BTN:{
                onClick : function(profile, e, src){
                    profile.boxing()._drop();
                }
            },
            INPUT:{
                onChange:function(profile, e, src){
                    var o=profile.inValid;
                    profile.boxing().updateUIValue(src.value);
                    //input/textarea is special
                    profile.properties.$UIvalue=src.value;
                    if(o!==profile.inValid) if(profile.domNode)profile.boxing().setDirtyMark();
                },
                onFocus:function(profile, e, src){
                    if(profile.properties.disabled)return false;
                    profile.addTagClass(profile.getSubNode(profile.keys.BORDER),profile.key,'-focus');
                },
                onBlur:function(profile, e, src){
                    if(profile.properties.disabled)return false;
                    profile.removeTagClass(profile.getSubNode(profile.keys.BORDER),profile.key,'-focus');
                },
                onKeydown : function(profile, e, src){
                    var p=profile.properties.type;
                    if(p == 'getter' || p == 'cmdbox' || p == 'popbox')return;

                    var key=linb.event.getKey(e);
                    if((key[0]=='down'|| key[0]=='up') && key[1]){
                        profile.boxing()._drop();
                        return false;
                    }else if(key=='enter')
                        profile.getSubNode(profile.keys.INPUT).onChange();

                },
                onClick : function(profile, e, src){
                    if(profile.properties.readonly)
                        profile.boxing()._drop();
                }
            }
        }},
        EventHandlers:{
            onCustomPop:function(profile, pos){},
            onGetShowValue:function(profile, value){}
        },
        posMap:{
            combobox:'left top',
            listbox:'left top',
            getter:'left -27px',
            helpinput:'left -91px',
            cmdbox:'left -14px',
            popbox:'left -40px',
            timepicker:'left -53px',
            datepicker:'left -66px',
            colorpicker:'left -79px'
        },
        DataModel:{
            icon:null,
            iconPos:null,
            caption:null,

            listKey:{
                ini:'',
                set:function(v){
                    var t = linb.UI.getCacheList(v);
                    return this.each(function(o){
                        if(t)
                            o.boxing().setItems(t);
                        else
                            o.boxing().setItems(o.properties.items);
                        o.properties.listKey = v;
                    });
                }
            },
            items:{
                //for default merge
                ini:{}
            },
            readonly:{
                ini:false,
                action:function(v){
                    this.getSubNode(this.keys.INPUT).cursor(v?'pointer':'default');
                }
            },
            type:{
                ini:'combobox',
                listbox:'combobox,listbox,getter,helpinput,cmdbox,popbox,timepicker,datepicker,colorpicker'.toArr(),
                set:function(v){
                    if(v.exists(':')){
                        var arr=v.split(':');
                        if(arr[1]=='readonly')
                            this.setReadonly(true);
                        v=arr[0];
                    }
                    if(v=='listbox')
                        this.setReadonly(true);
                    return this.each(function(pro){
                        pro.properties.type=v;
                        if(pro.domNode)
                            pro.getSubNode(pro.keys.MIDDLE).setStyle('backgroundPosition', pro.box.posMap[v] || 'left top');
                    });
                }
            },
            $border:1
        },
        createdTrigger:function(){
            if(this.properties.readonly)
                this.getSubNode(this.keys.INPUT).cursor('pointer');
        },

        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);
            profile.data.typePos = profile.box.posMap[profile.data.type];
        },

        resize:function(profile,w,h){
            var size=linb.UI.Widget.resize.apply(this,arguments);
            var t,
            v=profile.getSubNode(profile.keys.INPUT),
            c=profile.getSubNode(profile.keys.BTN);
            if(!_.isNull(w))v.width(size.width-c.width());
            if(!_.isNull(h)){
                v.height(size.height -(linb.browser.ie6?2:linb.browser.ie?1:linb.browser.kde?1:0));
                c.height(size.height);
            }
        }
    }
});
