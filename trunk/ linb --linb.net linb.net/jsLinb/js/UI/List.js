Class("linb.UI.List", ["linb.UI.Widget", "linb.UI.iForm","linb.UI.iList"],{
    Instance:{
        setCtrlValue:function(value){
            return this.each(function(profile){
                if(!profile.domNode)return;

                var key = profile.keys.ITEM,
                    box = profile.boxing(),
                    uiv = box.getUIValue(),
                    properties = profile.properties
                    ;
                if(!properties.multiSel){
                    var itemId = profile.getSubSerialIdByItemId(uiv);
                    if(uiv && itemId){
                        profile.removeTagClass(profile.getSubNode(key,itemId), key,'-checked');
                    }
                    itemId = profile.getSubSerialIdByItemId(value);
                    if(itemId){
                        profile.addTagClass(profile.getSubNode(key,itemId), key,'-checked');
                    }

                    //scroll
                    if(itemId){
                        var o = profile.getSubNode(key,itemId);
                        if(o){
                            var top = o.offsetTop(),
                            items = profile.getSubNode(profile.keys.ITEMS),
                            sh=items.scrollHeight(),
                            st=items.scrollTop(),
                            hh=items.height()
                            ;

                            if(sh > hh){
                                if(top<st || top>st+hh)
                                    items.scrollTop(top);
                            }
                        }
                    }
                }else{
                    uiv = uiv?uiv.split(';'):[];
                    value = value?value.split(';'):[];
                    //check all
                    uiv.each(function(o){
                        if(!value.exists(o)){
                            profile.removeTagClass(profile.getSubNode(key, profile.getSubSerialIdByItemId(o)), key,'-checked');
                        }
                    });
                    value.each(function(o){
                        if(!uiv.exists(o)){
                            profile.addTagClass(profile.getSubNode(key, profile.getSubSerialIdByItemId(o)), key,'-checked');
                        }
                    });
                }
            });
        },
        setValue:function(value, flag){
            var upper = arguments.callee.upper;
            return this.each(function(profile){
                if(profile.properties.multiSel){
                    var arr = value.split(';');
                    arr.sort();
                    value = arr.join(';');
                }
                upper.apply(profile.boxing(),[value, flag]);
            });
        },
        adjustSize:function(){
            return this.each(function(profile){
                var
                root = profile.root,
                border = profile.getSubNode(profile.keys.BORDER),
                items = profile.getSubNode(profile.keys.ITEMS),
                pool = profile.getSubNode(profile.keys.POOL),
                size1 = root.cssSize(),
                size2 = border.cssSize();

                items.height('auto');

                var h = Math.min(profile.properties.maxHeight, items.offsetHeight() + size1.height - size2.height + 2);
                profile.properties.height=h;
                root.height(h);
            });
        },
        activate:function(){
            return linb.UI.iList.prototype.activate.call(this);
        }
    },
    Initialize:function(){
        //modify default template fro shell
        var t = this.getTemplate('default');
        _.merge(t.FRAME.BORDER,{
             tagName:'div',
             ITEMS:{
                tagName:'div',
                text:"{items}"
             }
        },'all');
        t.$dynamic={
            items:{
                ITEM:{
                    tagName : 'a',
                    href :"javascript:;",
                    tabindex:'{_tabindex}',
                    ICON:{
                        tagName : 'span',
                        style:'background:url({icon}) transparent  no-repeat {iconPos};{iconDisplay}',
                        $order:0
                    },
                    CAPTION:{
                        tagName : 'text',
                        text : '{caption}',
                        $order:1
                    }
                }
            }
        };
        this.setTemplate('default',t);
    },
    Static:{
        Appearances:{'default':{
            KEY:{
                'font-size':'12px'
            },
            BORDER:{
                border:'1px solid #91A7B4'
            },
            ITEMS:{
                'background-color':'#fff',
                position:'absolute',
                width:'100%',
                top:'0',
                left:'0',
                overflow:'auto',
                'overflow-x': (linb.browser.ie || linb.browser.gek)?'hidden':''
            },
            ITEM:{
                display:'block',
                'font-family': '"Verdana", "Helvetica", "sans-serif"',
                border:'0',
                cursor:'pointer',
                padding:'2px',
                position:'relative'
            },
            'ITEM-mouseover':{
                $order:1,
                'background-color': '#d9e8fb'
            },
            'ITEM-checked':{
                $order:2,
                'background-color':'#316AC5',
                color:'#fff'
            },
            ICON:{
                cursor:'pointer',
                width:'16px',
                height:'16px',
                margin:'0 4px 0 0'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{ITEM:'ITEM'},
            ITEM:{
                onClick:function(profile, e, src){
                    var properties = profile.properties,
                        item = profile.getItemByDom(src),
                        box = profile.boxing();

                    if(properties.disabled|| item.disabled)return false;

                    if(properties.multiSel){
                        var value = box.getUIValue();

                        var arr = value?value.split(';'):[];
                        if(arr.exists(item.id))
                            arr.removeValue(item.id);
                        else
                            arr.push(item.id);
                        arr.sort();
                        value = arr.join(';');

                        //update string value only for setCtrlValue
                        box.updateUIValue(value);
                        if(box.getUIValue() == value)
                            box.onItemSelected(profile, item, src);
                    }else{
                        box.updateUIValue(item.id);
                        if(box.getUIValue() == item.id)
                            box.onItemSelected(profile, item, src);
                    }

                    linb(src).focus();

                    //prevent href default action
                    return false;
                },
                onKeydown:function(profile, e, src){
                    var keys=linb.event.getKey(e), key = keys[0], shift=keys[2],
                    cur = linb([src],false),
                    first = profile.root.nextFocus(true, true, false),
                    last = profile.root.nextFocus(false, true, false);

                    switch(linb.event.getKey(e)[0]){
                        case 'tab':
                            if(shift){
                                if(src!=first.get(0)){
                                    first.focus();
                                    return false;
                                }
                            }else{
                                if(src!=last.get(0)){
                                    last.focus();
                                    return false;
                                }
                            }
                            break;
                        case 'left':
                        case 'up':
                            var next = cur.nextFocus(false, true, false);
                            if(cur.get(0)==first.get(0))
                                last.focus();
                            else
                                cur.nextFocus(false);
                            return false;
                            break;
                        case 'right':
                        case 'down':
                            var next = cur.nextFocus(true, false, false);
                            if(cur.get(0)==last.get(0))
                                first.focus();
                            else
                                cur.nextFocus();
                            return false;
                            break;
                        case 'space':
                        case 'enter':
                            linb(src.id).onClick();
                            return false;
                            break;
                    }
                }
            },
            ITEMS:{
                beforeKeypress:function(profile, e){
                    var key=linb.event.getKey(e)[0];
                    if(key=='tab' || key=='enter')
                        return true;
                    else if(/^\w$/.test(key)){
                        profile._wordcache = profile._wordcache ||'';
                        profile._wordcache += key.toLowerCase();
                        clearTimeout(profile._wordcachetimeout);

                        var arr = profile.properties.items;
                        arr.each(function(o,i){
                            if(o.caption.toLowerCase().startWith(profile._wordcache)){
                                profile.getSubNode(profile.keys.ITEM, profile.getSubSerialIdByItemId(o.id)).focus();
                                return false;
                            }
                        });

                        profile._wordcachetimeout = _.asyRun(function(){profile._wordcache=''},300);
                    }
                }
            }
        }},
        DataModel:({
            icon:null,
            iconPos:null,
            caption:null,
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode(this.keys.ITEM,true).tabIndex(value);
                }
            },

            multiSel:false,

            width:120,
            height:150,
            maxHeight:500,
            $border:1
        }),
        EventHandlers:{
            onItemSelected:function(profile, item, src){}
        },
        resize:function(profile,w,h){
            var size = arguments.callee.upper.apply(this,arguments);
            profile.getSubNode(profile.keys.ITEMS).cssSize(size);
        }/*,
        getItemValue:function(profile,id,name){
            var items = profile.properties.items,index,item;
            if(items && items.length)index = items.subIndexOf('id',id);
            if(index != -1)item=items[index];
            return item[name];
        }*/
    }
});
