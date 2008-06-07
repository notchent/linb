Class("linb.UI.List", ["linb.UI.iWidget", "linb.UI.iForm","linb.UI.iList"],{
    Instance:{
        setCtrlValue:function(value){
            return this.each(function(profile){
                if(!profile.domNode)return;

                var box = profile.boxing(),
                    uiv = box.getUIValue(),
                    p = profile.properties,
                    k = 'ITEM',
                    rm = function(i,j,k){return profile.removeTagClass(i,j,k)},
                    add = function(i,j,k){return profile.addTagClass(i,j,k)},
                    getN = function(k,i){return profile.getSubNode(k,i)},
                    getI = function(i){return profile.getSubSerialIdByItemId(i)}
                    ;
                if(p.selMode=='single'){
                    var itemId = getI(uiv);
                    if(uiv && itemId)
                        rm('ITEM','-checked',getN(k,itemId));

                    itemId = getI(value);
                    if(itemId)
                        add('ITEM','-checked',getN(k,itemId));

                    //scroll
                    if(itemId){
                        var o = getN(k,itemId);
                        if(o){
                            var top = o.offsetTop(),
                            items = getN('ITEMS'),
                            sh=items.scrollHeight(),
                            st=items.scrollTop(),
                            hh=items.height()
                            ;
                            if(sh > hh)
                                if(top<st || top>st+hh)
                                    items.scrollTop(top);

                        }
                    }
                }else if(p.selMode=='multi'){
                    uiv = uiv?uiv.split(';'):[];
                    value = value?value.split(';'):[];
                    //check all
                    uiv.each(function(o){
                        if(!value.exists(o))
                            rm('ITEM','-checked',getN(k, getI(o)))
                    });
                    value.each(function(o){
                        if(!uiv.exists(o))
                            add('ITEM','-checked',getN(k, getI(o)))
                    });
                }
            });
        },
        setValue:function(value, flag){
            var upper = arguments.callee.upper;
            return this.each(function(profile){
                if(profile.properties.selMode=='multi'){
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
                items = profile.getSubNode('ITEMS'),
                pool = profile.getSubNode('POOL')
                ;

                items.height('auto');

                var h = Math.min(profile.properties.maxHeight, items.offsetHeight());
                profile.properties.height=h;
                root.height(h);
            });
        },
        activate:function(){
            return linb.UI.iList.prototype.activate.call(this);
        },
        setDirtyMark:function(){
            return this.each(function(profile){
                var id=profile.domId,
                    p=profile.properties,
                    flag=p.value !== p.$UIvalue,
                    d=linb.UI.$css_tag_dirty;

                //dirty mark
                if(profile.beforeDirtyMark && false===profile.boxing().beforeDirtyMark(profile,flag)){}
                else{
                    var o = profile.getSubNode('ITEMS');
                    if(flag)
                        o.addClass(d);
                    else
                        o.removeClass(d);
                }
            });
        }
    },
    Static:{
        cssNone:false,

        Templates:{'default':{
            tagName : 'div',
            style:'{_style}',
            ITEMS:{
               $order:10,
               tagName:'div',
               text:"{items}"
            },
            $dynamic:{
                items:{
                    ITEM:{
                        tagName : 'a',
                        href :"javascript:;",
                        tabindex:'{_tabindex}',
                        ICON:{
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
            }
        }},
        Appearances:{'default':{
            KEY:{
                'font-size':'12px'
            },
            ITEMS:{
                'background-color':'#fff',
                position:'relative',
                border:'1px solid #91A7B4',
//                width:'100%',
  //              top:0,
    //            left:0,
                overflow:'auto',
                'overflow-x': (linb.browser.ie || linb.browser.gek)?'hidden':''
            },
            ITEM:{
                display:'block',
                'font-family': '"Verdana", "Helvetica", "sans-serif"',
                border:0,
                cursor:'pointer',
                padding:'0 2px 0 2px',
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
            _clickEffect:{ITEM:'ITEM'},
            onRewh:function(profile, e, src){
                var o = profile.domNode.style,w=null,h=null;
                if(e.height)h = parseInt(o.height)||null;
                if(e.width)w = parseInt(o.width)||null;
                profile.box.resize(profile, w, h);
            },
            ITEM:{
                onClick:function(profile, e, src){
                    var properties = profile.properties,
                        item = profile.getItemByDom(src),
                        itemId =profile.getSubSerialId(src.id),
                        box = profile.boxing(),
                        rt;

                    if(properties.disabled|| item.disabled)return false;

                    switch(properties.selMode){
                    case 'none':
                        rt=box.onItemSelected(profile, item, src);
                        break;
                    case 'multi':
                        var value = box.getUIValue(),
                            arr = value?value.split(';'):[];

                        if(arr.exists(item.id))
                            arr.removeValue(item.id);
                        else
                            arr.push(item.id);
                        arr.sort();
                        value = arr.join(';');

                        //update string value only for setCtrlValue
                        if(box.getUIValue() == value)
                            rt=false;
                        else{
                            box.updateUIValue(value);
                            if(box.getUIValue() == value)
                                rt=box.onItemSelected(profile, item, src);
                        }
                        break;
                    case 'single':
                        if(box.getUIValue() == item.id)
                            rt=false;
                        else{
                            box.updateUIValue(item.id);
                            if(box.getUIValue() == item.id)
                                rt=box.onItemSelected(profile, item, src);
                        }
                        break;
                    }
                    linb(src).focus();
                    return rt;
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
                                profile.getSubNodeByItemId('ITEM', o.id).focus();
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
                        this.getSubNode('ITEM',true).tabIndex(value);
                }
            },
            selMode:{
                ini:'single',
                listbox:['single','none','multi']
            },
            width:120,
            height:150,
            maxHeight:300
        }),
        EventHandlers:{
            beforeDirtyMark:function(profile, flag){},
            onItemSelected:function(profile, item, src){}
        },
        //for tabs only
        resize:function(profile,w,h){
            var t=profile.properties,
                temp,
                l=profile.getSubNode('ITEMS')
            ;
            //no height set
            if(!parseInt(profile.domNode.style.height))
                return;
            l.height(h);
        }
    }
});
