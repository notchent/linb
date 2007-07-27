Class("linb.UI.TreeBar",["linb.UI.iList","linb.UI.iNavigator"],{
    Instance:{
        setCtrlValue:function(value, flag){
            return this.each(function(profile){
                if(!profile.domNode)return;

                var box = profile.boxing(),
                    uiv = box.getUIValue(),
                    properties = profile.properties,
                    key1 = profile.keys.BAR,
                    key2 = profile.keys.MARK2
                    ;
                if(properties.selMode=='single'){
                    var itemId = profile.getSubSerialIdByItemId(uiv);
                    if(uiv && itemId){
                        profile.removeTagClass(profile.getSubNode(key1,itemId), key1,'-checked');
                        profile.removeTagClass(profile.getSubNode(key2,itemId), key2,'-checked');
                    }
                    itemId = profile.getSubSerialIdByItemId(value);
                    if(itemId){
                        profile.addTagClass(profile.getSubNode(key1,itemId), key1,'-checked');
                        profile.addTagClass(profile.getSubNode(key2,itemId), key2,'-checked');
                    }
                }else if(properties.selMode=='multi'){
                    uiv = uiv?uiv.split(';'):[];
                    value = value?value.split(';'):[];
                    if(flag){
                        value.each(function(o){
                            profile.addTagClass(profile.getSubNode(key1, profile.getSubSerialIdByItemId(o)), key1,'-checked');
                            profile.addTagClass(profile.getSubNode(key2, profile.getSubSerialIdByItemId(o)), key2,'-checked');
                        });
                    }else{
                        //check all
                        uiv.each(function(o){
                            if(!value.exists(o)){
                                profile.removeTagClass(profile.getSubNode(key1,  profile.getSubSerialIdByItemId(o)), key1,'-checked');
                                profile.removeTagClass(profile.getSubNode(key2,  profile.getSubSerialIdByItemId(o)), key2,'-checked');
                            }
                        });
                        value.each(function(o){
                            if(!uiv.exists(o)){
                                profile.addTagClass(profile.getSubNode(key1, profile.getSubSerialIdByItemId(o)), key1,'-checked');
                                profile.addTagClass(profile.getSubNode(key2, profile.getSubSerialIdByItemId(o)), key2,'-checked');
                            }
                        });
                    }
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

        insertItems:function(arr, pid, base ,before){
            var node,self = this.constructor;
            return this.each(function(profile){
                // prepare properties format
                var tar,r,k;

                if(!pid){
                    k=profile.properties;
                    tar = k.items ||(k.items=[])
                }else{
                    k=profile.getItemByItemId(pid);
                    tar = k.sub || (k.sub= []);
                }
                if(!base)
                    tar.insert(arr, before?0:-1);
                else{
                    var index = tar.subIndexOf(id, base);
                    tar.insert(arr, before?index:(index+1));
                }
                if(profile.domNode){
                    if(!base){
                        if(!pid)
                            node=profile.getSubNode(profile.keys.ITEMS);
                        else{
                            k=profile.getItemByItemId(pid);
                            if(k._created)
                                node=profile.getSubNode(profile.keys.SUB, profile.getSubSerialIdByItemId(pid));
                        }
                        if(node){
                            r=self.subBuild(profile, 'items', profile.box.prepareItems(profile, arr, pid)).toDom();
                            if(before)
                                node.addFirst(r);
                            else
                                node.addLast(r);
                        }
                    }else{
                        k=profile.getItemByItemId(pid);
                        if(k._created){
                            r=self.subBuild(profile, 'items', profile.box.prepareItems(profile, arr, pid)).toDom();
                            node=profile.getSubNode(profile.keys.ITEM, profile.getSubSerialIdByItemId(base));
                            if(before)
                                node.addPre(r);
                            else
                                node.addNext(r);
                        }
                    }
                }
                var obj;
                if(pid)
                    if((obj=profile.getSubNode(profile.keys.MARK1, profile.getSubSerialIdByItemId(pid))).display()=='none')
                        obj.inlineBlock();

                if(!profile.properties.iniFold)
                    if(!pid || profile.getItemByItemId(pid)._created)
                        profile.boxing().openNodes(arr, true);
            });
        },

        updateItem:function(id, name, value){
            var profile=this.get(0),
            item = profile.getItemByItemId(id);

            if(!item)return;
            item[name]=value;

            switch(name){
                case 'caption':
                    profile.getSubNode(profile.keys.CAPTION, profile.getSubSerialIdByItemId(id)).html(value,false);
                break;
            }
        },
        moveItems:function(ids, toPid){
            var profile = this.get(0),
            t;

            if(toPid){
                var domPid = profile.getSubSerialIdByItemId(toPid),
                pItem = profile.getItemByItemId(toPid),
                pItemSub = pItem.sub || (pItem.sub=[]),
                domP=profile.getSubNode(profile.keys.SUB,domPid);

                if((t=profile.getSubNode(profile.keys.MARK1, domPid)).visibility()=='none')
                    t.inlineBlock();

            }else{
                var pItemSub=profile.properties.items,
                domP=profile.getSubNode(profile.keys.KEY);
            }

            ids.each(function(id){
                var domId = profile.getSubSerialIdByItemId(id),
                iItem = profile.getItemByItemId(id);

                var sub;
                if(iItem.pid)
                    sub = profile.getItemByItemId(iItem.pid).sub;
                else
                    sub = profile.properties.items;

                var index = sub.subIndexOf('id', id);

                sub[index].pid = toPid;
                //move parent link
                pItemSub.insert(sub[index]);
                sub.remove(index);
                //move
                domP.addLast(profile.getSubNode(profile.keys.ITEM,domId));
            });
        },
        openNodes:function(items, flag){
            if(items && items.length)
                items.each(function(o){
                    if(o.sub && o.sub.length && !o.iniFold && !o._checked)
                        this.openNode(o.id, flag);
                },this);
        },
        openNode:function(id, flag){
            var profile = this.get(0),
            item = profile.getItemByItemId(id);
            if(item && !item._checked)
                profile.box.setSub(profile, item, flag);
        },
        selectItem:function(id){
            var profile = this.get(0);
            //fire dom event
            var node =profile.getSubNode(profile.keys.BAR, profile.getSubSerialIdByItemId(id));
            //no this one, set to null
            if(!node.isEmpty()){
                node.onClick();
                return this;
            }else return false;
        }
    },
    Initialize:function(){
        this.mapKeys(['DISABLED']);
    },
    Static:{
        cssNone:false,
        Templates:{'default':{
            tagName : 'div',
            style:'{left}{top}{width}{height}{right}{bottom}{zIndex}{position}',
            BORDER:{
                tagName : 'div',
                BOX:{
                    tagName : 'div',
                    ITEMS:{
                        tagName : 'div',
                        text:"{items}"
                    }
                }
            },
            $dynamic:{
                items:{
                    ITEM:{
                        tagName : 'div',
                        BAR:{
                            $order:0,
                            tagName : 'div',
                            className:'{cls_group} ',
                            CMD:{
                                tagName: 'a',
                                href :"javascript:;",
                                tabindex: '{_tabindex}',
                                MARK1:{
                                    tagName : 'span',
                                    $order:0,
                                    style:'{mark}'
                                },
                                MARK2:{
                                    tagName : 'span',
                                    $order:1,
                                    style:'{mark2Display}'
                                },
                                ITEMICON:{
                                    tagName : 'span',
                                    style:'background:url({icon}) transparent  no-repeat   {iconPos}; {iconDisplay}',
                                    $order:2
                                },
                                ITEMCAPTION:{
                                    tagName : 'span',
                                    text : '&nbsp;{caption}',
                                    className:"{disabled} ",
                                    $order:3
                                }
                            }
                        },
                        SUB:{
                            $order:1,
                            tagName : 'div',
                            text:linb.UI.$childTag
                        }
                    }
                }
            }
        }},
        Appearances:{'default':{
            KEY: {
                'font-family': 'Verdana, Helvetica, sans-serif',
                'border':'0'
            },
            BOX:{
                overflow: 'auto',
                'overflow-x':(linb.browser.ie ||linb.browser.gek)?'hidden':''
            },
            ITEMS:{
                'border-bottom': '1px solid #e5e5e5',
                'border-right': '1px solid #e5e5e5'
            },
            BORDER:{
                'cursor': 'pointer',
                'background-color':'#fff'
            },
            ITEM:{
                'border-left': '1px solid #e5e5e5',
                'white-space': 'nowrap',
                overflow:'hidden'
            },
            BAR:{
                'border-top': '1px solid #e5e5e5',
                padding:'1px'
            },
            DISABLED:{
                color:'#808080'
            },
            'BAR-mouseover':{
                $order:1,
               'background-color': '#d9e8fb'
            },
            'BAR-checked':{
                $order:2,
               'background-color': '#f6f6f6'
            },
            'BAR-GROUP':{
                background: linb.UI.getCSSImgPara('group.gif',' repeat-x left top'),
                padding:'1px'
            },
            'BAR-GROUP-mouseover':{
                $order:1,
                'background-position': 'left -30px'
            },
            'BAR-GROUP-checked':{
                $order:2,
                'background-position': 'left -60px'
            },
            CMD:{
               cursor:'pointer',
               'vertical-align':'middle',
               display:'block',
               'font-size':'12px'
            },
            SUB:{
                display:'none',
                overflow:'hidden',
                'margin-left':'20px'
            },
            MARK1:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -161px top', null, 'linb.UI.Public'),
                cursor:'pointer',
                width:'16px',
                height:'16px',
                margin:'0 4px 0 0'
            },
            'MARK1-mouseover':{
                $order:2,
                'background-position': '-161px -15px'
            },
            'MARK1-mousedown':{
                $order:3,
                'background-position': '-161px -30px'
            },
            'MARK1-checked':{
                $order:4,
                'background-position': '-176px top'
            },
            'MARK1-checked-mouseover':{
                $order:5,
                'background-position': '-176px -15px'
            },
            'MARK1-checked-mousedown':{
                $order:6,
                'background-position': '-176px -30px'
            },
            'MARK1-BUSY':{
                $order:7,
                background: linb.UI.getCSSImgPara('busy.gif', ' no-repeat center center', null, 'linb.UI.Public')
            },
            MARK2:{
                cursor:'pointer',
                width:'16px',
                height:'16px',
                margin:'0 4px 0 0'
            },
            'MARK2-checked':{
                $order:2,
                background: linb.UI.getCSSImgPara('icon.gif', ' no-repeat -50px 0', null, 'linb.UI.Public')
            },
            'ITEMICON, ICON':{
                cursor:'pointer',
                width:'16px',
                height:'16px'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{MARK1:'MARK1', BAR:'BAR'},
            _clickEffect:{MARK1:'MARK1', BAR:'BAR'},
            onResize:function(profile, e, src){
                var o = profile.root,w=null,h=null;
                if(e.height)h=o.height();
                if(e.width)w=o.width();
                profile.box.resize(profile, w, h);
            },
            MARK1:{
                onClick:function(profile, e, src){
                    var properties = profile.properties,
                        item = profile.getItemByDom(src);

                    if(properties.disabled || item.disabled)return false;
                    if(!item.sub)return false;

                    profile.box.setSub(profile, item);

                    // not to fire BAR's onclick event;
                    return false;
                }
            },
            BAR:{
                onMousedown:function(profile, e, src){
                    var properties = profile.properties,
                        item = profile.getItemByDom(src);

                    if(item.dragable){
                        linb([src],false).startDrag(e,{type:'copy', move:false, key:item.dragKey || profile.properties.dragKey, data:item.id});
                        profile.removeTagClass(linb(src),profile.keys.BAR,'-mouseover');
                    }
                },
                onClick:function(profile, e, src){
                    var properties = profile.properties,
                        item = profile.getItemByDom(src),
                        itemId =profile.getSubSerialId(src.id),
                        box = profile.boxing();

                    if(properties.disabled|| item.disabled)return false;
                    //group not fire event
                    if(item.sub && (item.group!=undefined?item.group:properties.group)){
                        profile.getSubNode(profile.keys.MARK1, itemId).onClick();
                        return false;
                    }

                    switch(properties.selMode){
                    case 'none':
                        box.onItemSelected(profile, item, src);
                        break;
                    case 'multi':
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
                        break;
                    case 'single':
                        if(box.getUIValue() != item.id){
                            box.updateUIValue(item.id);
                            if(box.getUIValue() == item.id)
                                box.onItemSelected(profile, item, src);
                        }
                        break;
                    }

                    profile.getSubNode(profile.keys.CMD, itemId).focus();

                    //prevent href default action
                    return false;
                }
            },
            CMD:{
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
                        case 'up':
                            var next = cur.nextFocus(false, true, false);
                            if(cur.get(0)==first.get(0))
                                last.focus();
                            else
                                cur.nextFocus(false);
                             return false;
                             break;
                        case 'down':
                            var next = cur.nextFocus(true, false, false);
                             if(cur.get(0)==last.get(0))
                                first.focus();
                             else
                                cur.nextFocus();
                             return false;
                             break;
                        case 'right':
                        case 'left':
                            profile.getSubNode(profile.keys.MARK1,profile.getSubSerialId(src.id)).onClick();
                            return false;
                        case 'enter':
                        case 'space':
                            profile.getSubNode(profile.keys.BAR,profile.getSubSerialId(src.id)).onClick();
                            return false;

                    }
                },
                onClick:function(e){
                    //linb.event.stopDefault(e);
                }
            }
        }},
        EventHandlers:{
            onRequestData:function(profile, id, threadid){},
            onItemSelected:function(profile, item, src){}
        },
        DataModel:{
            listKey:null,
            zIndex:null,
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode(this.keys.CMD, true).tabIndex(value);
                }
            },

            iniFold:true,

            dragKey:'treeBar',
            dock:'fill',
            group:{
                ini:false,
                action:function(v){
                    var self = this,
                        items = this.properties.items,
                        results = this.itemsSearch(items, function(o){return o.sub && o.group==undefined }),
                        nodes=linb([]);
                    results.each(function(o){
                        nodes.add( self.getSubNode(self.keys.BAR, self.getSubSerialIdByItemId(o.id)) );
                    });
                    var cls1=this.getClass(self.keys.BAR), cls2 = this.getClass(self.keys.BAR, '-group');
                    if(v)
                       nodes.reClass(new RegExp('(\\b)' + cls1 + '([^b]*\\b)','g'), '$1'+cls2+'$2');
                    else
                       nodes.reClass(new RegExp('(\\b)' + cls2 + '([^b]*\\b)','g'), '$1'+cls1+'$2');
                }
            },
            selMode:{
                ini:'single',
                listbox:['single','none','multi'],
                action:function(v,ov){
                    if(ov=='none')
                        this.getSubNode(this.keys.MARK2,true).inlineBlock();
                    if(v=='none')
                        this.getSubNode(this.keys.MARK2,true).display('none');
                }
            },
            position:'absolute'

        },
        createdTrigger:function(){
            if(linb.browser.ie)this.root.addEvent('ondrag',function(){return false}).addEvent('onselectstart',function(){return false});
            if(!this.properties.iniFold)
                this.boxing().openNodes(this.properties.items, true);
        },
        prepareItem:function(profile, item, oitem){
            var p=profile.properties;
            // set 'visible' will show when parent call .height()
            item.mark = item.sub?'':'display:none';
            item.disabled = item.disabled?profile.getClass(profile.keys.KEY, '-disabled'):'';

            item.mark2Display = (p.selMode=='none')?'display:none':'';

            item._tabindex = p.tabindex;

            //change css class
            if(item.sub && (item.group!=undefined?item.group:p.group)){
                item.cls_group = profile.getClass(profile.keys.BAR, '-group');
                item.mark2Display = 'display:none';
            }
        },
        setSub:function(profile, item, flag){
            var id=profile.domId,
                itemId = profile.getSubSerialIdByItemId(item.id),
                key1 = profile.keys.MARK1,
                key2 = profile.keys.SUB,
                key3 = profile.keys.BAR,
                properties = profile.properties,

                barNode = profile.getSubNode(key3, itemId),
                markNode = profile.getSubNode(key1, itemId),
                subNode = profile.getSubNode(key2, itemId);
                ;

            if(linb.thread.exists(profile.key+profile.id))
                return;

            if(item._checked){
                var h = subNode.height();

                subNode.fx({'height':[h,0]},function(){subNode.height(h)},function(){subNode.display('none').height('auto')}, 200, 8, 'inexp', profile.key+profile.id).start();

                profile.removeTagClass(markNode, key1, '-checked');
                if(item.group || properties.group)
                    profile.removeTagClass(barNode, key3, '-checked');
                item._checked = false;
            }else{
                var openSub = function(profile, item, id, markNode, subNode, barNode, sub, flag){
                    //created
                    if(!item._created){
                        delete item.sub;
                        //before insertRows
                        item._created=true;
                        subNode.display('none');
                        profile.boxing().insertItems(sub, item.id);

                        //set checked items
                        profile.boxing().setCtrlValue(profile.boxing().getUIValue(), true);
                    }

                    if(!flag){
                        var h = subNode.height(true);
                        subNode.fx({'height':[0,h]},function(){subNode.height('0').display('block')},function(){subNode.height('auto')}, 200, 8, 'outexp', profile.key+profile.id).start();
                    }else
                        subNode.display('block');

                    profile.addTagClass(markNode, key1, '-checked');
                    if(item.group || properties.group)
                        profile.addTagClass(barNode, key3, '-checked');

                    item._checked = true;
                };

                var sub = profile.getItemBySubSerialId(itemId).sub;
                if(sub && sub.length){
                    openSub(profile, item, id, markNode, subNode, barNode, sub, flag);
                    if(flag){
                        sub.each(function(o){
                            if(o.sub && o.sub.length && !o.iniFold && !o._checked)
                                profile.box.setSub(profile, o, true);
                        });
                    }
                }else{
                    linb.thread(null,[
                        //request sub
                        function(threadId){
                            if(profile.onRequestData)
                                profile.boxing().onRequestData(profile, item.id, threadId);
                             else
                                linb.thread(threadId).abort();
                        },
                        //handle response
                        function(threadId){
                            //get sub from thread
                            sub = linb.thread(threadId).getCache('response');
                            if(sub){
                                openSub(profile, item, id, markNode, subNode, barNode, sub, flag);
                                openSub=null;
                            }
                        }
                    ],null,null,
                    //set busy status to UI
                    function(threadId){profile.addTagClass(markNode, key1, '-busy'); linb(id).busy(false)},
                    //set free status to UI
                    function(){profile.removeTagClass(markNode, key1, '-busy'); linb(id).free()}
                    ).start();
                }
            }
        },
        resize:function(profile,w,h){
            profile.getSubNode(profile.keys.BORDER).cssSize({ width :w?w:null, height :h?h:null});
            profile.getSubNode(profile.keys.BOX).cssSize({ width :w?w:null, height : h?h:null});
        }
    }
});
