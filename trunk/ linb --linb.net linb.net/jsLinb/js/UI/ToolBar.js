Class("linb.UI.ToolBar",["linb.UI.iList","linb.UI.iNavigator"],{
    Instance:{
//        insertWidgets:function(arr){
//            return this;
//        },
/*        attach:function(ui){
            //this.reBoxing('UI').attach(ui,[],false);
            this.each(function(v){
                var c=v.getSubNode(v.keys.GROUP);
                c.attach(ui);
            });
            return this;
        },*/
        updateItem:function(id, txt){
            var pro=this.get(0),
            id = pro.getSubSerialIdByItemId(id);
            pro.getSubNode(pro.keys.CAPTION, id).html(txt,false);
        },
        hideItem:function(id){
            var pro=this.get(0),
            id = pro.getSubSerialIdByItemId(id);
            pro.getSubNode(pro.keys.ITEM, id).display('none');
        },
        disableGroup:function(id, value){
            return this.each(function(profile){
                profile.getSubNode(profile.keys.GROUP, profile.getSubSerialIdByItemId(id)).opacity(value?0.5:1);
                var item = profile.boxing().getItemByItemId(id);
                item.disabled=value;
            });
        }
    },
    Static:{
        cssNone:false,
        Templates:{'default':{
            tagName:'div',
            ITEMS:{
                tagName:'div',
                style:'{mode}',
                text:'{items}'
            },
            $dynamic:{
                items:{
                    GROUP:{
                        HANDLER:{
                            style:'{mode2}'
                        },
                        LIST:{
                            $order:1,
                            tagName:'text',
                            text:'{sub}'
                        }
                    }
                },
                'items.sub':function(profile,template,v,tag,result){
                    tag = tag+'.'+v.type;
                    if(template[tag])
                        linb.UI.$doTemplate(profile,template,v,tag,result)
                 },
                'items.sub.split':{
                    ITEMSPLIT:{}
                },
                'items.sub.button':{
                    ITEM:{
                        $order:1,
                        tagName:'a',
                        href :"javascript:;",
                        tabindex: '{_tabindex}',
                        className:' {typeCls} ',
                        ICON:{
                            $order:1,
                            tagName : 'span',
                            style:'background:url({icon}) transparent no-repeat  {iconPos}; {iconDisplay}'
                        },
                        CAPTION:{
                            $order:2,
                            tagName : 'span',
                            text : '{caption}',
                            className:" {disabled}",
                            style:'{captionDisplay}'
                        }
                    }
                }
            }
        }},
        Appearances:{'default':{
            KEY:{
                'font-size':'0',
                'line-height':'0',
                position:'absolute',
                left:'0',
                top:'0'
            },
            ITEMS:{
                display:'block',
                border: 'solid 1px',
                'background-color':'#f4f4f4',
                'border-color':'#fff #A7A6AA #A7A6AA #fff',
                'font-size':'0',
                'line-height':'0'
            },
            HANDLER:{
                height:'22px',
                width:'6px',
                background: linb.UI.getCSSImgPara('handler.gif', ' left top #f4f4f4 ', null, 'linb.UI.Public'),
                cursor:'move'
            },
            GROUP:{
                'font-size':'0',
                'line-height':'0',
                'padding':'1px 4px 1px 2px'
            },/*
            'GROUP-DISABLED':{
                'background-color':'#d4d4d4'
            },*/
            ITEM:{
                display:linb.browser.gek?['-moz-inline-block', '-moz-inline-box']: 'inline-block',
                /*must specify this, or static will take more v space*/
                'vertical-align':'top',
                //height:'16px',
                margin:'1px',
                padding:'1px'
            },
            ICON:{
                width:'16px',
                height:'16px',
                'margin-right':'1px'
            },
            'ITEM-BUTTON':{
                $order:1,
                border:'solid 1px #f4f4f4'
            },
            'ITEM-BUTTON-mouseover':{
                $order:2,
                border:'solid 1px #A7A6AA'
            },
            'ITEM-BUTTON-mousedown':{
                $order:2,
                border:'solid 1px #A7A6AA',
                'background-color':'#FFFFE0'
            },
            'ITEMSPLIT':{
                $order:1,
                width:'6px',
                height:'16px',
                background: linb.UI.getCSSImgPara('vsplit.gif', ' repeat-y left top', null, 'linb.UI.Public')
            },
            CAPTION:{
                height:'16px',
                'margin-left':'1px',
                'margin-right':'3px',
                'font-size':'12px',
                'line-height':'12px'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{ITEM:['ITEM']},
            _clickEffect:{ITEM:['ITEM']},
            onMousedown:function(profile, e, src){
                //darg
            },
            ITEM:{
                onClick:function(profile, e, src){
                    if(profile.properties.disabled)return;
                    var id2=src.parentNode.id,
                        itemId2 = profile.getSubSerialId(id2),
                        item2 = profile.getItemBySubSerialId(itemId2);
                    if(item2.disabled)return;

                    var id=src.id,
                        itemId = profile.getSubSerialId(id),
                        item = profile.getItemBySubSerialId(itemId);
                    if(item.disabled)return;

                    linb(src).focus();
                    profile.boxing().onClick(profile, item.id, item2.id, src);
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
                            linb(src).onClick();
                            return false;
                            break;
                    }
                }
            }
        }},
        DataModel:{
            value:null,

            dataField:null,
            dataBinder:null,
            zIndex:null,
            listKey:null,
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode(this.keys.ITEM,false).tabIndex(value);
                }
            },

            height:null,

            left:0,
            top:0,

            handler:{
                ini:true,
                action:function(v){
                    this.getSubNode(this.keys.HANDLER,true).display(v?'':'none');
                }
            },
            position:'absolute',
            align:{
                ini:'left',
                listbox:['left','right'],
                action:function(v){
                    this.getSubNode(this.keys.ITEMS, true).setStyle('textAlign', v);
                }
            },
            dock:{
                ini:'top',
                listbox:['top','bottom']
            }
        },
        EventHandlers:{
            onClick:function(profile, id, groupid, src){},
            onValueChanged:function(profile, id, ov, v){}
        },
        createdTrigger:function(){
            //this.boxing().insertWidgets(this.properties.items);
            if(this.properties.disabled)this.boxing().setDisabled(true,true);
        },
        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);

            var d = profile.data,p = profile.properties;

            d.mode = p.align=='right'?'text-align:right;':'';

            d.items.filter(function(o){
                return !o.$del;
            });
        },
        prepareItem:function(profile, item, sitem){
            item.mode2 = profile.properties.handler ? '' : 'display:none;';

            var arr=[],t,id;

            //don't change original data
            var a = sitem.sub ||[];
            a.each(function(item){
                t={id: item.id};

                id=profile.pickSubId('items');

                //give item subid
                t[linb.UI.subSerialIdTag] = profile.ItemIdMapSubSerialId[item.id] = id;
                profile.SubSerialIdMapItem[id] = item;

                //others
                linb.UI.copyItem(item, t);

                //prepare inner type only: split/label/button
                t.type = t.type || 'button';
                if(t.type.exists('.')){
                    t.$del=true;
                    return;
                }
                t.captionDisplay=t.caption?'':'display:none';
                t.typeCls = profile.getClass(profile.keys.ITEM, '-'+t.type);

                arr.push(t);
            });
            item.sub = arr;
        }
    }
});
