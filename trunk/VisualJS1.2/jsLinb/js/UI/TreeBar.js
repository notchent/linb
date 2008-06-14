Class("linb.UI.TreeBar",["linb.UI.iList", "linb.UI.iWidget","linb.UI.iNavigator"],{
    Instance:{
        setCtrlValue:function(value, flag){
            return this.each(function(profile){
                if(!profile.domNode)return;

                var box = profile.boxing(),
                    uiv = box.getUIValue(),
                    properties = profile.properties
                    ;
                if(properties.selMode=='single'){
                    var itemId = profile.getSubSerialIdByItemId(uiv);
                    if(uiv && itemId){
                        profile.removeTagClass( 'BAR','-checked',profile.getSubNode('BAR',itemId));
                        profile.removeTagClass( 'MARK2','-checked',profile.getSubNode('MARK2',itemId));
                    }
                    itemId = profile.getSubSerialIdByItemId(value);
                    if(itemId){
                        profile.addTagClass('BAR','-checked',profile.getSubNode('BAR',itemId));
                        profile.addTagClass('MARK2','-checked',profile.getSubNode('MARK2',itemId));
                    }
                }else if(properties.selMode=='multi'){
                    uiv = uiv?uiv.split(';'):[];
                    value = value?value.split(';'):[];
                    if(flag){
                        _.arr.each(value,function(o){
                            profile.addTagClass('BAR','-checked', profile.getSubNodeByItemId('BAR', o));
                            profile.addTagClass('MARK2','-checked', profile.getSubNodeByItemId('MARK2', o));
                        });
                    }else{
                        //check all
                        _.arr.each(uiv,function(o){
                            if(_.arr.indexOf(value,o)==-1){
                                profile.removeTagClass('BAR','-checked',profile.getSubNodeByItemId('BAR',  o));
                                profile.removeTagClass('MARK2','-checked',profile.getSubNodeByItemId('MARK2',  o));
                            }
                        });
                        _.arr.each(value,function(o){
                            if(_.arr.indexOf(uiv,o)==-1){
                                profile.addTagClass('BAR','-checked', profile.getSubNodeByItemId('BAR', o));
                                profile.addTagClass('MARK2','-checked', profile.getSubNodeByItemId('MARK2', o));
                            }
                        });
                    }
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
                    _.arr.insertAny(tar,arr, before?0:-1);
                else{
                    var index = _.arr.subIndexOf(tar,id, base);
                    _.arr.insertAny(tar,arr, before?index:(index+1));
                }
                if(profile.domNode){
                    if(!base){
                        if(!pid)
                            node=profile.getSubNode('ITEMS');
                        else{
                            k=profile.getItemByItemId(pid);
                            if(k._created)
                                node=profile.getSubNodeByItemId('SUB', pid);
                        }
                        if(node){
                            r=_.str.toDom(self.subBuild(profile, 'items', profile.box.prepareItems(profile, arr, pid)));
                            if(before)
                                node.addFirst(r);
                            else
                                node.addLast(r);
                        }
                    }else{
                        k=profile.getItemByItemId(pid);
                        if(k._created){
                            r=_.str.toDom(self.subBuild(profile, 'items', profile.box.prepareItems(profile, arr, pid)));
                            node=profile.getSubNodeByItemId('ITEM', base);
                            if(before)
                                node.addPre(r);
                            else
                                node.addNext(r);
                        }
                    }
                }
                var obj;
                if(pid)
                    if((obj=profile.getSubNodeByItemId('MARK1', pid)).display()=='none')
                        obj.inlineBlock();

                if(!profile.properties.iniFold)
                    if(!pid || profile.getItemByItemId(pid)._created)
                        profile.boxing().toggleNodes(arr, true);
            });
        },

        updateItem:function(id, name, value){
            var profile=this.get(0),
            item = profile.getItemByItemId(id);

            if(!item)return;
            item[name]=value;

            switch(name){
                case 'caption':
                    profile.getSubNodeByItemId('CAPTION', id).html(value,false);
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
                domP=profile.getSubNode('SUB',domPid);

                if((t=profile.getSubNode('MARK1', domPid)).visibility()=='none')
                    t.inlineBlock();

            }else{
                var pItemSub=profile.properties.items,
                domP=profile.root;
            }

            _.arr.each(ids,function(id){
                var domId = profile.getSubSerialIdByItemId(id),
                iItem = profile.getItemByItemId(id);

                var sub;
                if(iItem._pid)
                    sub = profile.getItemByItemId(iItem._pid).sub;
                else
                    sub = profile.properties.items;

                var index = _.arr.subIndexOf(sub,'id', id);

                sub[index]._pid = toPid;
                //move parent link
                _.arr.insertAny(pItemSub,sub[index]);
                sub.remove(index);
                //move
                domP.addLast(profile.getSubNode('ITEM',domId));
            });
        },
        toggleNodes:function(items, flag, recursive){
            if(items && items.length)
                _.arr.each(items,function(o){
                    if(o.sub && o.sub.length && ((flag&&!o._checked)||(!flag&&o._checked)))
                        this.toggleNode(o.id, flag);
                },this);
        },
        /*
        *flag:true->open false->close
        *recursive:true open recursively
        */
        toggleNode:function(id, flag, recursive){
            var profile = this.get(0),
            o = profile.getItemByItemId(id);
            if(o && ((flag&&!o._checked)||(!flag&&o._checked)))
                profile.box.setSub(profile, o, flag, recursive);
        },
        /*
        *open to deep node
        */
        openToNode:function(id){
            return this.each(function(profile){
                var res=false, a=[],
                    fun=function(arr, catId, layer){
                        layer = layer || 0;
                        var me=arguments.callee;
                        _.arr.each(arr,function(o){
                            if(o.id==catId){
                                a.push(o);
                                ref = o.sub;
                                res=true;
                                return false;
                            }
                            if(o.sub){
                                res = me.call(me, o.sub, catId, ++layer)
                                if(res){
                                    a.push(o);
                                    return false;
                                }
                            }
                        });
                        return res;
                    }
                fun(profile.properties.items, id);
                if(res){
                    a.reverse();
                    a.pop();
                    _.arr.each(a,function(o){
                        if(!o._checked)
                            profile.box.setSub(profile, o, true);
                    });
                }
            });
        },
        selectItem:function(id){
            var profile = this.get(0);
            //fire dom event
            var node =profile.getSubNodeByItemId('BAR', id);
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
        $recursive:true,
        cssNone:false,
        Templates:{'default':{
            tagName : 'div',
            style:'{_style}',
            BORDER:{
                tagName : 'div',
                BOX:{
                    tagName : 'div',
                    onselectstart:'return false',
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
                        onselectstart:'return false',
                        unselectable:'on',
                        BAR:{
                            $order:0,
                            tagName : 'div',
                            className:'{cls_group} ',
                            onselectstart:'return false',
                            unselectable:'on',
                            CMD:{
                                tagName: 'a',
                                href :"{href}",
                                tabindex: '{_tabindex}',
                                MARK1:{
                                    $order:0,
                                    style:'{mark}'
                                },
                                MARK2:{
                                    $order:1,
                                    style:'{mark2Display}'
                                },
                                ITEMICON:{
                                    style:'background:url({icon}) transparent  no-repeat   {iconPos}; {iconDisplay}',
                                    $order:2
                                },
                                ITEMCAPTION:{
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
                'border':0
            },
            BOX:{
                left:0,
                overflow: 'auto',
                'overflow-x':(linb.browser.ie ||linb.browser.gek)?'hidden':''
            },
            ITEMS:{
                overflow: 'hidden',
                'border-bottom': '1px solid #e5e5e5',
                'border-right': '1px solid #e5e5e5'
            },
            BORDER:{
                'background-color':'#fff'
            },
            ITEM:{
                'border-left': '1px solid #e5e5e5',
                'white-space': 'nowrap',
                overflow:'hidden'
            },
            BAR:{
                overflow: 'hidden',
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
                $order:2,
                background: linb.UI.getCSSImgPara('group.gif',' repeat-x left top'),
                padding:'1px'
            },
            'BAR-GROUP-mouseover':{
                $order:3,
                'background-position': 'left -30px'
            },
            'BAR-GROUP-checked':{
                $order:4,
                'background-position': 'left -60px'
            },
            CMD:{
               cursor:'pointer',
               'vertical-align':'middle',
               display:'block',
               overflow: 'hidden',
               'font-size':'12px'
            },
            SUB:{
                display:'none',
                overflow:'hidden',
                'margin-left':'12px'
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
            onRewh:function(profile, e, src){
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

                    profile.box.setSub(profile, item, !item._checked);

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
                        profile.removeTagClass('BAR','-mouseover', linb([src]));
                    }
                },
                onClick:function(profile, e, src){
                    var properties = profile.properties,
                        item = profile.getItemByDom(src),
                        itemId =profile.getSubSerialId(src.id),
                        box = profile.boxing(),
                        rt;

                    if(properties.disabled|| item.disabled)return false;
                    //group not fire event
                    if(item.sub && (item.group!==undefined?item.group:properties.group)){
                        profile.getSubNode('MARK1', itemId).onClick();
                        return false;
                    }

                    switch(properties.selMode){
                    case 'none':
                        rt=box.onItemSelected(profile, item, src);
                        break;
                    case 'multi':
                        var value = box.getUIValue(),
                            arr = value?value.split(';'):[];

                        if(_.arr.indexOf(arr,item.id)!=-1)
                            _.arr.removeValue(arr,item.id);
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

                    profile.getSubNode('CMD', itemId).focus();
                    return rt;
                }
            },
            BOX:{
                onScroll:function(profile, e, src){
                    //for ie 'href focus' will scroll view
                    if(linb([src]).scrollLeft()!==0)
                        linb([src]).scrollLeft(0);
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
                            profile.getSubNode('MARK1',profile.getSubSerialId(src.id)).onClick();
                            return false;
                        case 'enter':
                        case ' ':
                            profile.getSubNode('BAR',profile.getSubSerialId(src.id)).onClick();
                            return false;

                    }
                },
                onClick:function(e){
                    //linb.event.stopDefault(e);
                }
            }
        }},
        EventHandlers:{
            onRequestData:function(profile, item, threadid){},
            onItemSelected:function(profile, item, src){}
        },
        DataModel:{
            listKey:null,
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode('CMD', true).tabIndex(value);
                }
            },
            iniFold:true,
            fx:false,
            dragKey:'treeBar',
            dock:'fill',
            group:{
                ini:false,
                action:function(v){
                    var self = this,
                        items = this.properties.items,
                        results = this.itemsSearch(items, function(o){return o.sub && o.group===undefined }),
                        nodes=linb([]);
                    _.arr.each(results,function(o){
                        nodes.add( self.getSubNodeByItemId('BAR', o.id) );
                    });
                    var cls1=this.getClass('BAR'), cls2 = this.getClass('BAR', '-group');
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
                    var n=this.getSubNode('MARK2',true);
                    if(ov=='none')
                        n.inlineBlock();
                    if(v=='none')
                        n.display('none');
                }
            },
            singleOpen:false,
            dynBuild:false,
            position:'absolute'

        },
        createdTrigger:function(){
            if(linb.browser.ie)this.root.addEvent('ondrag',function(){return false}).addEvent('onselectstart',function(){return false});
            if(!this.properties.iniFold)
                this.boxing().toggleNodes(this.properties.items, true);
        },
        prepareItem:function(profile, item, oitem, pid){
            var p=profile.properties;

            if(pid)oitem._pid=pid;
            // set 'visible' will show when parent call .height()
            item.mark = item.sub?'':'display:none';
            item.disabled = item.disabled?profile.getClass('KEY', '-disabled'):'';
            item.mark2Display = (p.selMode=='none')?'display:none':'';
            item._tabindex = p.tabindex;
            item.href = item.href || 'javascript:;';
            //change css class
            if(item.sub && (item.group!==undefined?item.group:p.group)){
                item.cls_group = profile.getClass('BAR', '-group');
                item.mark2Display = 'display:none';
            }
        },
        setSub:function(profile, item, flag, recursive){
            var id=profile.domId,
                itemId = profile.getSubSerialIdByItemId(item.id),
                properties = profile.properties,
                barNode = profile.getSubNode('BAR', itemId),
                markNode = profile.getSubNode('MARK1', itemId),
                subNs = profile.getSubNode('SUB', itemId);
                ;

            if(linb.thread.exists(profile.key+profile.id))
                return;
            //close
            if(item._checked){
                if(!flag){
                    var h = subNs.height();
                    if(properties.fx)
                        subNs.fx({'height':[h,0]},function(){subNs.height(h)},function(){subNs.display('none').height('auto')}, 200, 8, 'inexp', profile.key+profile.id).start();
                    else
                        subNs.display('none').height('auto');

                    profile.removeTagClass('MARK1', '-checked', markNode);
                    if(item.group || properties.group)
                        profile.removeTagClass('BAR', '-checked', barNode);
                    item._checked = false;
                    if(properties.dynBuild){
                        var s=item.sub, arr=[];
                        for(var i=0,l=s.length;i<l;i++)
                            arr.push(s[i].id);
                        profile.boxing().removeItems(arr);
                        delete item._created;
                    }
                }
            }else{
                //open
                if(flag){
                    var openSub = function(profile, item, id, markNode, subNs, barNode, sub, recursive){
                        var b=profile.boxing(),
                            p=profile.properties;

                        //created
                        if(!item._created){
                            delete item.sub;
                            //before insertRows
                            item._created=true;
                            subNs.display('none');
                            b.insertItems(sub, item.id);

                            //set checked items
                            b.setCtrlValue(b.getUIValue(), true);
                        }

                        if(p.singleOpen)
                            b.toggleNodes(item._pid?profile.getItemByItemId(item._pid).sub:p.items, false)

                        if(!recursive){
                            var h = subNs.height(true);
                            if(p.fx)
                                subNs.fx({'height':[0,h]},function(){subNs.height('0').display('block')},function(){subNs.height('auto')}, 200, 8, 'outexp', profile.key+profile.id).start();
                            else
                                subNs.display('block').height('auto');
                        }else
                            subNs.display('block');

                        profile.addTagClass('MARK1', '-checked',markNode);
                        if(item.group || properties.group)
                            profile.addTagClass('BAR', '-checked', barNode);

                        item._checked = true;
                    };

                    var sub = item.sub;
                    if(sub && sub.length){
                        openSub(profile, item, id, markNode, subNs, barNode, sub, recursive);
                        if(recursive){
                            _.arr.each(sub,function(o){
                                if(o.sub && o.sub.length && !o._checked)
                                    profile.box.setSub(profile, o, true, recursive);
                            });
                        }
                    }else{
                        linb.thread(null,[
                            //request sub
                            function(threadId){
                                if(profile.onRequestData)
                                    profile.boxing().onRequestData(profile, item, threadId);
                                 else
                                    linb.thread(threadId).abort();
                            },
                            //handle response
                            function(threadId){
                                //get sub from thread
                                sub = linb.thread(threadId).getCache('response');
                                if(sub){
                                    openSub(profile, item, id, markNode, subNs, barNode, sub, recursive);
                                    openSub=null;
                                }
                            }
                        ],null,null,
                        //set busy status to UI
                        function(threadId){profile.addTagClass('MARK1', '-busy',markNode); linb(id).busy(false)},
                        //set free status to UI
                        function(){profile.removeTagClass('MARK1', '-busy',markNode); linb(id).free()}
                        ).start();
                    }
                }
            }
        },
        resize:function(profile,w,h){
            profile.getSubNode('BORDER').cssSize({ width :w?w:null, height :h?h:null});
            profile.getSubNode('BOX').cssSize({ width :w?w:null, height : h?h:null});
        }
    }
});
