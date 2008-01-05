Class("linb.UI.ComboInput", "linb.UI.Input",{
    /*Instance*/
    Instance:{
        setCtrlValue:function(value, flag){
            return this.each(function(profile){
                profile.getSubNode('INPUT').value(flag?value:profile.boxing().getShowValue(value));
            })
        },
        getShowValue:function(value){
            var profile=this.get(0),
                pro=profile.properties,v;
            //use setCtrlValue(value, true) dir
            if(profile.onClickButton)
                v=value;
            else{
                //get from onGetShowValue
                if(profile.onGetShowValue)
                    v = profile.boxing().onGetShowValue(profile, value);
                else{
                    //get from items
                    if('listbox'==pro.type || 'combobox' == pro.type){
                        if( (v=pro.items.subIndexOf('id',value))!=-1){
                            v=pro.items[v].caption;
                            v=v.charAt(0)=='$'?linb.getRes(v.slice(1)):v;
                        }else
                            v='';
                    }else
                        v = profile.$showValue || value;
                }
                //for lang
                if(v)v=v.replace(/\<\/?[^>]+\>/g,'');
            }
            return v||value||'';
        },
        _cache:function(){
            var profile=this.get(0);
            if(profile.$drop)
                //profile.$drop.root.display('none') for opera bug
                profile.getSubNode('POOL').addLast(profile.$drop.root.display('none'));
            delete profile.$poplink;
        },
        refreshCache:function(){
            var profile=this.get(0);
            if(profile.domNode)
                profile.getSubNode('POOL').empty();
            return this;
        },
        //for upload ,special must get the original node
        getUploadObj:function(){
            var profile=this.get(0);
            if(profile.domNode){
                var o = profile.getSubNode('UPLOAD',null,true);
                o.addPre(o.clone());
                return o.remove(false);
            }
        },
        _drop:function(){
            return this.each(function(profile){
                var pro = profile.properties;
                if(pro.disabled)return;
                if(pro.type=='upload')return;
                //open already
                if(profile.$poplink)return;

                var o,v,
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
                        box.onClickButton(profile, pos);
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
                            o.host(profile).setItems(pro.items.copy()).adjustSize();
                            o.beforeValueUpdated(function(pro, ovalue, value, showValue){
                                //give showValue
                                pro.$showValue = showValue;
                                var b2=this.boxing();
                                //update value
                                b2.updateUIValue(value);
                                //cache pop
                                b2._cache();
                                //set activate
                                b2.activate();
                                return false;
                            });
                            break;
                        case 'timepicker':
                            linb.SC('linb.UI.TimePicker');
                            o = linb.create('TimePicker');
                            o.host(profile);
                            o.beforeClose(function(){this.boxing()._cache();return false});
                            o.beforeValueUpdated(function(pro, ovalue, value, showValue){
                                //give showValue
                                pro.$showValue = showValue;
                                var b2=this.boxing();
                                //update value
                                b2.updateUIValue(value);
                            });
                            break;
                        case 'datepicker':
                            linb.SC('linb.UI.Calender');
                            o = linb.create('Calender');
                            o.host(profile);
                            o.beforeClose(function(){this.boxing()._cache();return false});
                            o.beforeValueUpdated(function(pro, ovalue, value, showValue){
                                //give showValue
                                pro.$showValue = showValue;
                                var b2=this.boxing();
                                //update value
                                b2.updateUIValue(value);
                            });
                            break;                         /*
                        case 'colorpicker':
                            linb.SC('linb.UI.ColorPicker');
                            o = linb.create('ColorPicker');
                            break;
                            */
                    }

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
                    case 'timepicker':
                    case 'datepicker':
                    case 'colorpicker':
                        o.host(profile).setValue(box.getUIValue());
                        break;
                }

                profile.$poplink = o.get(0);

                //pop
                var node=o.reBoxing();
                node.popToTop(profile.root);

                o.activate();

                //for on blur disappear
                node.setBlurTrigger(profile.key+":"+profile.$id, function(){
                    box._cache();
                }, null, profile.$id);

                //for esc
                linb.event.hookKey('esc',0,0,0,function(){
                    box._cache();
                    box.activate();
                    //unhook
                    linb.event.hookKey('esc',0,0,0,null);
                });
            });
        }
    },
    /*Initialize*/
    Initialize:function(){
        this.mapKeys(['UPLOAD']);
        //modify default template for shell
        var t = this.getTemplate('default');
        _.merge(t.FRAME.BORDER,{
            BTN:{
                $order:4,
                style:"{popbtnDisplay}",
                TOP:{},
                MID:{
                    style:'{typePos}'
                }
            },
            SBTN:{
                $order:3,
                style:"{saveDisplay}",
                STOP:{},
                SMID:{}
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
            'SBTN,BTN':{
                'z-index':'1',

                cursor:'pointer',
                width:'13px',
                'font-size':0,
                'line-height':0,
                position:'relative',
                'float':'right',
                background: linb.UI.getCSSImgPara('cmd.gif', ' left bottom no-repeat')
            },
            'BTN-mouseover, SBTN-mouseover':{
                $order:1,
                'background-position': '-14px bottom'
            },
            'BTN-mousedown, SBTN-mousedown':{
                $order:2,
                'background-position': '-27px bottom'
            },
            'STOP, TOP':{
                cursor:'pointer',
                width:'13px',
                'font-size':0,
                'line-height':0,
                position:'absolute',
                top:0,
                left:0,
                height:'4px',
                background: linb.UI.getCSSImgPara('cmd.gif', ' left -104px no-repeat')
            },
            'BTN-mouseover TOP,SBTN-mouseover STOP':{
                $order:1,
                'background-position': '-14px -104px'
            },
            'BTN-mousedown TOP,SBTN-mousedown STOP':{
                $order:2,
                'background-position': '-27px -104px'
            },
            'SMID,MID':{
                cursor:'pointer',
                width:'13px',
                'font-size':0,
                'line-height':0,
                position:'absolute',
                bottom:'3px',
                left:0,
                height:'13px',
                background: linb.UI.getCSSImgPara('cmd.gif', ' left top no-repeat')
            },
            SMID:{
                'background-position': '-14px -14px'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{KEY:'BORDER',BTN:'BTN',SBTN:'SBTN'},
            _clickEffect:{BTN:'BTN',SBTN:'SBTN'},
            _focusHook:{INPUT:1},
            UPLOAD:{
                onChange:function(profile, e, src){
                    profile.getSubNode('INPUT').value(src.value).onChange();
                }
            },
            BTN:{
                onClick : function(profile, e, src){
                    profile.boxing()._drop();
                }
            },
            SBTN:{
                onClick : function(profile, e, src){
                    if(profile.onSave)profile.boxing().onSave(profile,src);
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
                    profile.addTagClass(profile.key,'-focus',profile.getSubNode('BORDER'));
                },
                onBlur:function(profile, e, src){
                    if(profile.properties.disabled)return false;
                    profile.removeTagClass(profile.key,'-focus',profile.getSubNode('BORDER'));
                },
                onKeydown : function(profile, e, src){
                    var p=profile.properties.type;
                    if(p == 'getter' || p == 'cmdbox' || p == 'popbox')return;

                    var key=linb.event.getKey(e);
                    if((key[0]=='down'|| key[0]=='up') && key[1]){
                        profile.boxing()._drop();
                        return false;
                    }else if(key=='enter')
                        profile.getSubNode('INPUT').onChange();

                },
                onClick : function(profile, e, src){
                    if(profile.properties.readonly)
                        profile.boxing()._drop();
                }
            }
        }},
        EventHandlers:{
            onSave:function(profile, src){},
            onClickButton:function(profile, pos){},
            onGetShowValue:function(profile, value){}
        },
        posMap:{
            none:'',
            combobox:'left top',
            listbox:'left top',
            upload:'-16px top',
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
                        o.boxing().setItems(t?t:o.properties.items);
                        o.properties.listKey = v;
                    });
                }
            },
            items:{
                //for default merge
                ini:{},
                action:function(v){
                    var self=this;
                    self.boxing().setValue(null,true);
                    self.SubSerialIdMapItem={};
                    self.ItemIdMapSubSerialId={};
                    //for memory map
                    self.box.prepareItems(self, v);

                    if(v.domNode)
                        self.boxing().refreshCache();
                }
            },
            readonly:{
                ini:false,
                action:function(v){
                    this.getSubNode('INPUT').cursor(v?'pointer':'default');
                }
            },
            type:{
                ini:'combobox',
                listbox:'none,combobox,listbox,upload,getter,helpinput,cmdbox,popbox,timepicker,datepicker,colorpicker'.toArr(),
                set:function(v){
                    if(v.exists(':')){
                        var arr=v.split(':');
                        if(arr[1]=='readonly')
                            this.setReadonly(true);
                        v=arr[0];
                    }
                    if(v=='listbox' || v=='upload')
                        this.setReadonly(true);
                    return this.each(function(pro){
                        pro.properties.type=v;
                        if(pro.domNode)
                            pro.getSubNode('MID').setStyle('backgroundPosition', pro.box.posMap[v] || 'left top');
                    });
                }
            },
            saveBtn:{
                ini:false,
                action:function(v){
                    this.boxing().refresh();
                }
            },
            $border:1
        },
        createdTrigger:function(){
            var self=this;
            if(self.properties.readonly)
                self.getSubNode('INPUT').cursor('pointer');
        },
        dynamicTemplate:function(profile){
            var properties = profile.properties,
                hash = profile._exhash = "$" +
                    'inputArea:'+properties.inputArea+';'+
                    'readonly:'+properties.readonly+';'+
                    'type:'+properties.type+';',
                tid=profile.template._id,
                template = profile.box.getTemplate(tid, hash);

            properties.$UIvalue = properties.value;

            // set template dynamic
            if(!template){
                template = _.clone(profile.box.getTemplate(tid));
                var t=template.FRAME.BORDER;
                if(properties.inputArea!='input'){
                    t.BOX.INPUT.tagName=properties.inputArea;
                    delete t.BOX.INPUT.type;
                }
                if(properties.readonly)
                    t.BOX.INPUT.readonly='readonly';
                if(properties.type=='upload')
                    t.UPLOAD={
                        $order:2,
                        tagName:'input',
                        type:'file',
                        size:'1'
                    };

                // set template
                profile.box.setTemplate(tid, template, hash);
            }
            profile.template = template;
        },
        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);
            var data=profile.data;
            if(data.type!='none')
                data.typePos = 'background-position:'+profile.box.posMap[profile.data.type];
            data.saveDisplay = data.saveBtn?'':'display:none';
            data.popbtnDisplay = data.type!='none'?'':'display:none';
        },
        resize:function(profile,w,h){
            var size=linb.UI.Widget.resize.apply(this,arguments),
                t,
                v=profile.getSubNode('INPUT'),
                c=profile.getSubNode('BTN'),
                prop=profile.properties,
                save=prop.saveBtn,
                s=save?profile.getSubNode('SBTN'):null;

            if(!_.isNull(w))v.width(size.width - (prop.type=='none'?0:c.width()) - (save?s.width():0) );
            if(!_.isNull(h)){
                v.height(size.height -(linb.browser.ie6?2:linb.browser.ie?1:linb.browser.kde?1:0));
                c.height(size.height);
                if(s)s.height(size.height);
            }
        }
    }
});
