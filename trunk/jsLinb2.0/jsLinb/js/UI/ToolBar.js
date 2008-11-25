Class("linb.UI.ToolBar",["linb.UI","linb.absList"],{
    Instance:{
        updateItem:function(itemId, caption){
            return this.each(function(profile){
                profile.getSubNodeByItemId('CAPTION', itemId).html(caption,false);
            });
        },
        showItem:function(itemId, value){
            return this.each(function(profile){
                profile.getSubNodeByItemId('ITEM', itemId).css('display',value===false?'none':'');
            });
        },
        showGroup:function(grpId, value){
            return this.each(function(profile){
                profile.getSubNodeByItemId('GROUP', grpId).css('display',value===false?'none':'');
            });
        }
    },
    Static:{
        Templates:{
            tagName:'div',
            ITEMS:{
                tagName:'div',
                style:'{mode}',
                text:'{items}'
            },
            $dynamic:{
                items:{
                    GROUP:{
                        className:'{groupClass}',
                        style:'{grpStyle}{gruopStyle}',
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
                'items.sub':{
                    ITEM:{
                    //for firefox2 image in -moz-inline-box cant change height bug
                        IBWRAP:{
                            tagName:'div',
                            SPLIT:{
                                style:'{splitDisplay}'
                            },
                            LABEL:{
                                className:" {disabled}",
                                style:'{labelDisplay}',
                                text:'{label}'
                            },
                            BOX:{
                                tagName:'a',
                                href :linb.$href,
                                tabindex: '{_tabindex}',
                                className:'{itemClass}',
                                style:'{itemStyle} {boxDisplay}',
                                ICON:{
                                    $order:1,
                                    className:'ui-icon',
                                    style:'background:url({icon}) transparent no-repeat  {iconPos}; {iconDisplay}'
                                },
                                CAPTION:{
                                    $order:2,
                                    text : '{caption}',
                                    className:" {disabled}",
                                    style:'{captionDisplay}'
                                },
                                DROP:{
                                    $order:3,
                                    style:'{dropDisplay}'
                                }
                            }
                        }
                    }
                }
            }
        },
        Appearances:{
            KEY:{
                'font-size':0,
                'line-height':0,
                position:'absolute',
                'background-color':'#EBEADB',
                left:0,
                top:0
            },
            ITEMS:{
                display:'block',
                border: 'solid 1px',
                'padding-bottom':'1px',
                'border-color':'#fff #A7A6AA #A7A6AA #fff',
                'font-size':0,
                'line-height':0
            },
            HANDLER:{
                height:'20px',
                width:'6px',
                background: linb.UI.$bg('handler.gif', ' left top #EBEADB ', true),
                position:'absolute',
                left:'2px',
                top:'2px',
                cursor:'move'
            },
            GROUP:{
                'font-size':0,
                'line-height':0,
                position:'relative',
                padding:'2px 4px 0px 9px'
            },
            ITEM:{
                'vertical-align':'middle'
            },
            BOX:{
                display:linb.$inlineBlock,
                zoom:linb.browser.ie6?1:null,
                'vertical-align':'middle',
                cursor:'default',
                margin:'0 2px 1px 2px',
                padding:'1px',
                height:'16px',
                'font-size':'12px',
                'line-height':'14px',
                 border:'solid 1px #cdcdcd',
                 'white-space':'nowrap'
            },
            'BOX-mouseover':{
                $order:2,
                'background-color':'#FFFFE0'
            },
            'BOX-mousedown, BOX-checked':{
                $order:2,
                'border-color':'#A7A6AA #FFF #FFF #A7A6AA',
                'background-color':'#C4C4C4'
            },
            'SPLIT':{
                $order:1,
                width:'6px',
                height:'19px',
                'vertical-align':'middle',
                background: linb.UI.$bg('vsplit.gif', ' repeat-y left top', true)
            },
            DROP:{
                width:'7px',
                'vertical-align':'middle',
                background: linb.UI.$bg('icon.gif', ' no-repeat left bottom', true)
            },
            'LABEL, CAPTION':{
                height:'16px',
                'vertical-align':'middle',
                'margin-left':'2px',
                'margin-right':'2px',
                 cursor:'default',
                 'font-size':'12px'
            },
            LABEL:{
                'padding-top':'3px'
            }
        },
        Behaviors:{
            HoverEffected:{BOX:['BOX']},
            ClickEffected:{BOX:['BOX']},
            BOX:{
                onClick:function(profile, e, src){
                    if(profile.properties.disabled)return;
                    var id2=src.parentNode.id,
                        item2 = profile.getItemByDom(id2);
                    if(item2.disabled)return;

                    var id=src.id,
                        item = profile.getItemByDom(id);
                    if(item.disabled)return;

                    linb(src).focus();
                    if(item.statusButton)
                        linb(src).tagClass('-checked',item.value=!item.value);

                    profile.boxing().onClick(profile, item, item2, e, src);
                    return false;
                }
            }
        },
        DataModel:{
            listKey:null,
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode('ITEM',false).attr('tabIndex',value);
                }
            },

            height:null,

            left:0,
            top:0,

            handler:{
                ini:true,
                action:function(v){
                    this.getSubNode('HANDLER',true).css('display',v?'':'none');
                }
            },
            position:'absolute',
            hAlign:{
                ini:'left',
                listbox:['left','center','right'],
                action:function(v){
                    this.getSubNode('ITEMS', true).css('textAlign', v);
                }
            },
            dock:{
                ini:'top',
                listbox:['top','bottom']
            }
        },
        EventHandlers:{
            onClick:function(profile, item, group, e, src){}
        },
        _prepareData:function(profile){
            var d=arguments.callee.upper.call(this, profile);
            var p = profile.properties;

            d.mode = p.hAlign=='right'?'text-align:right;':'';

            return d;
        },
        _prepareItem:function(profile, oitem, sitem){
            var dn='display:none';
            oitem.mode2 = profile.properties.handler ? '' : dn;
            oitem.grpStyle=sitem.visible===false?dn:'';

            var arr=[],
                a = sitem.sub ||[],
                dataItem,id,t;
            _.arr.each(a,function(item){
                dataItem={id: item.id};

                id=profile.pickSubId('items');

                //give item subid
                dataItem[linb.UI.$tag_subId] = profile.ItemIdMapSubSerialId[item.id] = id;
                profile.SubSerialIdMapItem[id] = item;

                if(t=item.object){
                    t=dataItem.object=item.object=t['linb.absBox']?t.get(0):t;
                    //relative it.
                    if(t['linb.UIProfile']){
                        t.properties.position='relative';
                        if(!t.CS.KEY)t.CS.KEY={};
                        t.CS.KEY +=';vertical-align:middle;';
                    }
                    item.$id=t.$id;
                    t.$item=item;
                    t.$holder=profile;
                    if(!profile.$attached)profile.$attached=[];
                    profile.$attached.push(t);
                }else{
                    if(item.type=='split')item.split=true;
                    linb.UI.adjustData(profile,item, dataItem);

                    dataItem.splitDisplay=dataItem.split?'':dn;
                    dataItem.labelDisplay=dataItem.label?'':dn;
                    dataItem.captionDisplay=dataItem.caption?'':dn;
                    dataItem.dropDisplay=item.dropButton?'':dn;
                    dataItem.boxDisplay= (!dataItem.split && (dataItem.caption || dataItem.icon))?'':dn;
                }

                arr.push(dataItem);
            });
            oitem.sub = arr;
        }
    }
});
