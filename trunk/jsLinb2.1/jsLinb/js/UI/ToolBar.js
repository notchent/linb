Class("linb.UI.ToolBar",["linb.UI","linb.absList"],{
    Instance:{
        updateItem:function(subId,options){
            return arguments.callee.upper.apply(this,[subId,options,'items.sub']);
        },
        showItem:function(itemId, value){
            return this.each(function(profile){
                profile.getItemByItemId(itemId).visible=value!==false;
                profile.getSubNodeByItemId('ITEM', itemId).css('display',value===false?'none':'');
            });
        },
        showGroup:function(grpId, value){
            return this.each(function(profile){
                _.arr.each(profile.properties.items,function(o){
                    if(o.id==grpId){
                        o.visible=value!==false;
                        return false;
                    }
                });
                profile.getSubNodeByItemId('GROUP', grpId).css('display',value===false?'none':'');
            });
        }
    },
    Static:{
        Templates:{
            tagName:'div',
            ITEMS:{
                className:'uibg-bar uiborder-outset',
                tagName:'div',
                style:'{mode}',
                text:'{items}'
            },
            $dynamic:{
                items:{
                    GROUP:{
                        className:'{groupClass}',
                        style:'{grpDisplay} {groupStyle}',
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
                        style:'{itemDisplay}',
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
                            BTN:{
                                className:'ui-btn {itemClass}',
                                style:'{itemStyle} {boxDisplay}',
                                BTNI:{
                                    className:'ui-btni',
                                    BOX:{ 
                                        tagName:'a',
                                        href:linb.$href,
                                        tabindex: '{_tabindex}',
                                        ICON:{
                                            $order:1,
                                            className:'ui-icon',
                                            style:'background:url({image}) transparent no-repeat  {imagePos}; {iconDisplay}'
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
                }
            }
        },
        Appearances:{
            KEY:{
                'font-size':0,
                'line-height':0,
                position:'absolute',
                left:0,
                top:0
            },
            ICON:{margin:0},
            ITEMS:{
                display:'block',
                'padding-bottom':'1px',
                'font-size':0,
                'line-height':0
            },
            HANDLER:{
                height:'22px',
                width:'7px',
                background: linb.UI.$bg('handler.gif', ' left top', true),
                cursor:'move',
                'vertical-align':'middle'
            },
            GROUP:{
                'font-size':0,
                'line-height':0,
                position:'relative',
                padding:'2px 4px 0px 2px',
                'vertical-align':'baseline'
            },
            ITEM:{
                'vertical-align':'middle',
                padding:'1px'
            },
            'SPLIT':{
                $order:1,
                width:'6px',
                height:'19px',
                'vertical-align':'middle',
                background: linb.UI.$bg('split_vertical.gif', ' repeat-y left top', true)
            },
            BTN:{
                'padding-right':'3px'
            },
            BTNI:{
                'padding-left':'3px'
            },
            DROP:{
                width:'11px',
                height:'16px',
                'vertical-align':'middle',
                background: linb.UI.$bg('drop.gif', ' no-repeat left center', 'Button')
            },
            'BTN-mouseover DROP':{
                $order:2,
                'background-position':'-16px center'
            },
            'BTN-mousedown DROP, BTN-checked DROP':{
                $order:2,
                'background-position':'-32px center'
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
            HoverEffected:{BTN:['BTN']},
            ClickEffected:{BTN:['BTN']},
            BTN:{
                onClick:function(profile, e, src){
                    if(profile.properties.disabled)return;
                    var id2=src.parentNode.parentNode.parentNode.id,
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
        _prepareItem:function(profile, oitem, sitem, pid,  mapCache, serialId){
            var dn='display:none', fun=function(profile, dataItem, item, pid, mapCache,serialId){
                var id=dataItem[linb.UI.$tag_subId]=typeof serialId=='string'?serialId:('a_'+profile.pickSubId('aitem')), t;
                if(typeof item=='string')
                    item={caption:item};

                if(false!==mapCache){
                    profile.ItemIdMapSubSerialId[item.id] = id;
                    profile.SubSerialIdMapItem[id] = item;
                }

                if(t=item.object){
                    t=dataItem.object=t['linb.absBox']?t.get(0):t;
                    //relative it.
                    if(t['linb.UIProfile']){
                        t.properties.position='relative';
                        if(!t.CS.KEY)t.CS.KEY='';
                        t.CS.KEY ='vertical-align:middle;margin-left:4px;' + t.CS.KEY;
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
                    dataItem.boxDisplay= (!dataItem.split && (dataItem.caption || dataItem.image))?'':dn;
                }
                dataItem.itemDisplay=item.visible===false?dn:'';
                item._pid=pid;
            };

            if(pid){
                fun(profile,oitem,sitem,pid,mapCache,serialId);
            }else{
                var arr=[],
                dataItem,
                a=sitem.sub||[];

                pid=sitem.id;
                oitem.mode2 = profile.properties.handler ? '' : dn;
                oitem.grpDisplay=sitem.visible===false?dn:'';
                oitem.sub = arr;
                _.arr.each(a,function(item){
                    dataItem={id: item.id};
                    fun(profile,dataItem,item,pid,mapCache,serialId);
                    arr.push(dataItem);
                });
            }
        }
    }
});