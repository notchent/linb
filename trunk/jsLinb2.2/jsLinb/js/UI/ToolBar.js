Class("linb.UI.ToolBar",["linb.UI","linb.absList"],{
    Instance:{
        updateItem:function(subId,options){
            if(options.type){
                return arguments.callee.upper.apply(this,[subId,options,'items.sub']);
            }else{
                var self=this,
                    profile=self.get(0),
                    box=profile.box,
                    items=profile.properties.items,
                    rst=profile.queryItems(items,function(o){return typeof o=='object'?o.id===subId:o==subId},true,true,true),
                    item,n1,n2,t;
                if(_.isStr(options))options={caption:options};
                //ensure the original id
                delete options.id;
                delete options._pid;
                if(rst.length){
                    rst=rst[0];
                    if(item=rst[0]){
                        //in dom already?
                        n1=profile.getSubNodeByItemId('ICON',subId);
                        n2=profile.getSubNodeByItemId('CAPTION',subId);
    
                        if('value' in options && options.value!=item.value)
                            profile.getSubNodeByItemId('BTN',subId).tagClass('-checked', !!options.value);
                        if('caption' in options&& options.caption!=item.caption)
                            n2.html(options.caption);
                        if('image' in options&& options.image!=item.image)
                            n1.css('background-image',options.image);
                        if('imagePos' in options&& options.imagePos!=item.imagePos)
                            n1.css('background-position',options.imagePos);
                        if('imageClass' in options&& options.imageClass!=item.imageClass){
                            if(item.imageClass)
                                n1.removeClass(item.imageClass);
                            if(options.imageClass)
                                n1.addClass(options.imageClass);
                        }
    
                        //merge options
                        _.merge(item, options, 'all');
                    }
                }
                return self;
            }
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
                linb.UI.$dock(profile,true,true);
            });
        }
    },
    Static:{
        _ITEMKEY:'GROUP',
        Templates:{
            tagName:'div',
            ITEMS:{
                className:'uibg-bar uiborder-outset',
                tagName:'div',
                style:'{mode}',
                text:'{items}'
            },
            $submap:{
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
                                    BTNC:{
                                        className:'ui-btnc',
                                        BOX:{ 
                                            tagName:'a',
                                            href:linb.$href,
                                            tabindex: '{_tabindex}',
                                            BOXWRAP:{
                                                tagName:'div',
                                                ICON:{
                                                    $order:1,
                                                    className:'ui-icon {imageClass}',
                                                    style:'{backgroundImage} {backgroundPosition} {imageDisplay}'
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
            ICON:{
                margin:0,
                'vertical-align':'top'
            },
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
                'vertical-align':'middle'
            },
            ITEM:{
                'vertical-align':'middle',
                padding:'1px'
            },
            'BTNC a':{
                padding:0
            },
            'SPLIT':{
                $order:1,
                width:'6px',
                height:'19px',
                'vertical-align':'middle',
                background: linb.UI.$bg('split_vertical.gif', 'repeat-y left top', true)
            },
            BTN:{
                'padding-right':'3px'
            },
            BTNI:{
                'padding-left':'3px'
            },
            DROP:{
                width:'14px',
                height:'16px',
                'vertical-align':'top',
                background: linb.UI.$bg('drop.gif', 'no-repeat left center', 'Button')
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
                    var id2=linb.use(src).parent(3).id(),
                        item2 = profile.getItemByDom(id2);
                    if(item2.disabled)return;

                    var item = profile.getItemByDom(src);
                    if(item.disabled)return;

                    linb.use(src).focus();
                    if(item.statusButton)
                        linb.use(src).tagClass('-checked',item.value=!item.value);

                    profile.boxing().onClick(profile, item, item2, e, src);
                    return false;
                }
            }
        },
        DataModel:{
            listKey:null,
            height:{
                ini:'auto',
                readonly:true
            },
            width:'auto',

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
        _adjustItems:function(arr){
            if(!arr)arr=[_()+''];
            if(_.isStr(arr))arr=[arr];

            var a=_.copy(arr),m;
            _.arr.each(a,function(o,i){
                if(typeof o== 'object'){
                    //copy group
                    a[i]=_.copy(o);
                    a[i].sub=[];
                    //copy sub(tool item)
                    if(o.sub)
                        _.arr.each(o.sub,function(v){
                            a[i].sub.push(_.copy(v));
                        });
                }
            });
            return a;
        },
        _prepareData:function(profile){
            var d=arguments.callee.upper.call(this, profile);
            var p = profile.properties;

            d.mode = p.hAlign=='right'?'text-align:right;':'';

            return d;
        },
        _prepareItem:function(profile, oitem, sitem, pid,  mapCache, serialId){
            var dn='display:none', 
                fun=function(profile, dataItem, item, pid, mapCache,serialId){
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
                        item.$linbid=t.$linbid;
                        t.$item=item;
                        t.$holder=profile;
                        if(!profile.$attached)profile.$attached=[];
                        profile.$attached.push(t);
                    }else{
                        if(item.type=='split')item.split=true;
                        linb.UI.adjustData(profile,item, dataItem);
    
                        if(!item.caption)item.caption="";

                        dataItem.splitDisplay=dataItem.split?'':dn;
                        dataItem.labelDisplay=dataItem.label?'':dn;
                        dataItem.captionDisplay=dataItem.caption?'':dn;
                        dataItem.dropDisplay=item.dropButton?'':dn;
                        dataItem.boxDisplay= (!dataItem.split && (dataItem.caption || dataItem.image || dataItem.imageClass))?'':dn;
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
