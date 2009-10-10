Class("linb.UI.TreeBar",["linb.UI","linb.absList","linb.absValue"],{
    Instance:{
        _setCtrlValue:function(value, flag){
            return this.each(function(profile){
                if(!profile.renderId)return;

                var box = profile.boxing(),
                    uiv = box.getUIValue(),
                    properties = profile.properties,
                    fun=function(key,o,b){
                        profile.getSubNodeByItemId(key, o).tagClass('-checked', b);
                    },
                    selmode=properties.selMode
                    ;
                if(selmode=='single'){
                    var itemId = profile.getSubIdByItemId(uiv);
                    if(uiv && itemId)
                        profile.getSubNode('BAR',itemId).tagClass('-checked',false);

                    itemId = profile.getSubIdByItemId(value);
                    if(itemId)
                        profile.getSubNode('BAR',itemId).tagClass('-checked')
                }else if(selmode=='multi'){
                    uiv = uiv?uiv.split(';'):[];
                    value = value?value.split(';'):[];
                    if(flag){
                        _.arr.each(value,function(o){
                            fun('BAR', o);
                        });
                    }else{
                        //check all
                        _.arr.each(uiv,function(o){
                            if(_.arr.indexOf(value,o)==-1){
                                fun('BAR', o, false);
                            }
                        });
                        _.arr.each(value,function(o){
                            if(_.arr.indexOf(uiv,o)==-1){
                                fun('BAR', o);
                            }
                        });
                    }
                }
            });
        },
        insertItems:function(arr, pid, base ,before){
            var node,arr2;
            return this.each(function(profile){
                // prepare properties format
                var tar,r,k;

                arr2=profile.box._adjustItems(arr);

                if(!pid){
                    k=profile.properties;
                    tar = k.items ||(k.items=[])
                }else{
                    k=profile.getItemByItemId(pid);
                    tar = _.isArr(k.sub)?k.sub:(k.sub= []);
                }
                if(profile.renderId){
                    if(!base){
                        if(!pid)
                            node=profile.getSubNode('ITEMS');
                        else if(pid && k._created)
                            node=profile.getSubNodeByItemId('SUB', pid);
                        if(node){
                            r=profile._buildItems('items', profile.box._prepareItems(profile, arr2, pid));
                            if(before)
                                node.prepend(r);
                            else
                                node.append(r);
                        }
                    }else{
                        node=profile.getSubNodeByItemId('ITEM', base);
                        if(node){
                            r=profile._buildItems('items', profile.box._prepareItems(profile, arr2, pid));
                            if(before)
                                node.addPrev(r);
                            else
                                node.addNext(r);
                        }
                    }
                }
                //must be here
                if(!base)
                    _.arr.insertAny(tar,arr2, before?0:-1);
                else{
                    var index = _.arr.subIndexOf(tar, 'id', base);
                    _.arr.insertAny(tar,arr2, before?index:(index+1));
                }

                var obj;
                if(pid)
                    if((obj=profile.getSubNodeByItemId('TOGGLE', pid)).css('display')=='none')
                        obj.setInlineBlock();

                //open parent node
                if(!(('iniFold' in k)?k.iniFold:profile.properties.iniFold))
                    if(!pid || profile.getItemByItemId(pid)._created)
                        profile.boxing()._toggleNodes(arr2, true);

            });
        },
        _toggleNodes:function(items, expend, recursive){
            var self=this;
            _.arr.each(items,function(o){
                self.toggleNode(o.id, expend, recursive)
            });
            return self;
        },
        /*
        *expend:true->expend false->fold
        *recursive:true open recursively
        */
        toggleNode:function(id, expend, recursive){
            var profile=this.get(0),
                o=profile.getItemByItemId(id);
            if(o && o.sub)
                profile.box._setSub(profile, o, typeof expend=="boolean"?expend:!o._checked, recursive);
            return self;
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
                    _.arr.each(a,function(o){
                        if(o.sub){
                            profile.boxing().toggleNode(o.id,true);
                        }else
                            profile.boxing().fireItemClickEvent(o.id);
                    });
                }
            });
        },
        fireItemClickEvent:function(subId){
            this.getSubNodeByItemId('BAR', subId).onClick();
            return this;
        }
    },
    Initialize:function(){
        this.addTemplateKeys(['DISABLED']);
    },
    Static:{
        Templates:{
            tagName : 'div',
            style:'{_style}',
            ondrag:'return false',
            onselectstart:'return false',
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
            $submap:{
                items:{
                    ITEM:{
                        className:'{itemClass} {disabled}',
                        style:'{itemStyle}',
                        tagName : 'div',
                        onselectstart:'return false',
                        unselectable:'on',
                        BAR:{
                            $order:0,
                            tagName: 'a',
                            href :"{href}",
                            tabindex: '{_tabindex}',
                            className:'{cls_group} ',
                            onselectstart:'return false',
                            unselectable:'on',
                            MARK2:{
                                $order:0,
                                style:'{mark2Display}'
                            },
                            TOGGLE:{
                                $order:1,
                                className:'uicmd-toggle',
                                style:'{mark}'
                            },
                            ITEMICON:{
                                $order:2,
                                className:'ui-icon {imageClass}',
                                style:'{backgroundImage} {backgroundPosition} {backgroundRepeat} {imageDisplay}'
                            },
                            ITEMCAPTION:{
                                text : '&nbsp;{caption}',
                                className:"{disabled} ",
                                $order:3
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
        },
        Appearances:{
            KEY: {
                'font-family': 'Verdana, Helvetica, sans-serif',
                'border':0
            },
            BOX:{
                left:0,
                overflow: 'auto',
                'overflow-x':(linb.browser.ie ||linb.browser.gek)?'hidden':'',
                position:'relative'
            },
            ITEMS:{
                overflow: 'hidden'
            },
            ITEM:{
                'white-space': 'nowrap',
                position:'relative',
                overflow:'hidden'
            },
            BAR:{
               cursor:'pointer',
               zoom:linb.browser.ie?1:null,
               position:'relative',
               display:'block',
               overflow: 'hidden',
               'font-size':'12px',
               padding:'2px 4px',
               border: '1px solid',
               'border-color':'#EDF4FC #698AB3 #698AB3 #698AB3',
               'background-color':'#CCE4FC'
            },
            DISABLED:{
                color:'#808080'
            },
            'BAR-mouseover':{
                $order:1,
               'background-color': '#fffa9f'
            },
            'BAR-checked':{
                $order:2,
               'background-color': '#fffa9f'
            },
            'BAR-GROUP':{
                $order:2,
                'border-top': 'none',
                'border-bottom': 'none',
                padding:'5px 4px',
                height:'18px',
                background: linb.UI.$bg('bar_vertical.gif','repeat-x left -380px', true)
            },
            'BAR-GROUP-mouseover':{
                $order:3,
                'background-position': 'left -410px'
            },
            'BAR-GROUP-checked':{
                $order:4,
                'background-position': 'left -440px'
            },
            SUB:{
                overflow:'hidden',
                '*zoom':1,
                height:0,
                'font-size':'1px',
                //1px for ie8
                'line-height':'1px',
                position:'relative',
                'margin-left':'12px'
            },

            MARK2:{
               cursor:'pointer',
               width:'16px',
               height:'16px',
               'vertical-align':'middle',
               background: linb.UI.$bg('icons.gif', 'no-repeat -20px -70px', true)
            },
            'BAR-checked MARK2':{
                $order:3,
                'background-position': '0 -70px'
            },
            ITEMCAPTION:{
                'vertical-align':'middle',
                padding:'2px'
            }
        },
        Behaviors:{
            HoverEffected:{TOGGLE:'TOGGLE', BAR:'BAR'},
            ClickEffected:{TOGGLE:'TOGGLE', BAR:'BAR'},
            DragableKeys:["BAR"],
            DropableKeys:["BAR","TOGGLE","BOX"],
            onSize:linb.UI.$onSize,
            TOGGLE:{
                onClick:function(profile, e, src){
                    var properties = profile.properties,
                        domId=linb.use(src).id(),
                        item = profile.getItemByDom(domId);

                    if(properties.disabled || item.disabled)return false;
                    if(!('sub' in item))return false;
                    profile.box._setSub(profile, item, !item._checked);

                    // not to fire BAR's onclick event;
                    return false;
                }
            },
            MARK2:{
                onClick:function(profile, e, src){
                   // linb.use(src).parent().onClick();
                }
            },
            BAR:{
                onClick:function(profile, e, src){
                    var properties = profile.properties,
                        domId=linb.use(src).id(),
                        item = profile.getItemByDom(domId),
                        itemId =profile.getSubId(domId),
                        box = profile.boxing(),
                        ks=linb.Event.getKey(e),
                        rt,rt2;

                    if(properties.disabled|| item.disabled)return false;
                    //group not fire event
                    if(item.sub && (item.hasOwnProperty('group')?item.group:properties.group)){
                        profile.getSubNode('TOGGLE', itemId).onClick();
                        return false;
                    }

                    linb.use(src).focus();

                    switch(properties.selMode){
                    case 'none':
                        rt=box.onItemSelected(profile, item, src);
                        break;
                    case 'multi':
                        if(profile.getKey(linb.Event.getSrc(e).id)!=profile.keys.MARK2)return;

                        var value = box.getUIValue(),
                            arr = value?value.split(';'):[];
                        if(arr.length&&(ks[1]||ks[2]||properties.noCtrlKey)){
                            //for select
                            rt2=false;
                            if(ks[2]){
                                if(profile.$firstV._pid!=item._pid)return false;
                                var items=properties.items;
                                if(item._pid){
                                    var pitem=profile.getItemByItemId(item._pid);
                                    if(pitem)items=pitem.sub;
                                }
                                var i1=_.arr.subIndexOf(items,'id',profile.$firstV.id),
                                    i2=_.arr.subIndexOf(items,'id',item.id),
                                    i;
                                arr.length=0;
                                for(i=Math.min(i1,i2);i<=Math.max(i1,i2);i++)
                                    arr.push(items[i].id);
                            }else{
                                if(_.arr.indexOf(arr,item.id)!=-1)
                                    _.arr.removeValue(arr,item.id);
                                else
                                    arr.push(item.id);
                            }
                            arr.sort();
                            value = arr.join(';');

                            //update string value only for _setCtrlValue
                            if(box.getUIValue() == value)
                                rt=false;
                            else{
                                box.setUIValue(value);
                                if(box.get(0) && box.getUIValue() == value)
                                    rt=box.onItemSelected(profile, item, src)||rt2;
                            }
                            break;
                        }
                    case 'single':
                        if(box.getUIValue() == item.id)
                            rt=false;
                        else{
                            profile.$firstV=item;
                            box.setUIValue(item.id);
                            if(box.get(0) && box.getUIValue() == item.id)
                                rt=box.onItemSelected(profile, item, src);
                        }
                        break;
                    }
                    return rt;
                },
                onKeydown:function(profile, e, src){
                    var keys=linb.Event.getKey(e), key = keys[0], shift=keys[2],
                        cur = linb(src),
                        root = profile.getRoot(),
                        first = root.nextFocus(true, true, false),
                        last = root.nextFocus(false, true, false);

                    switch(linb.Event.getKey(e)[0]){
                        case 'tab':
                            if(shift){
                                if(cur.get(0)!=first.get(0)){
                                    first.focus();
                                    return false;
                                }
                            }else{
                                if(cur.get(0)!=last.get(0)){
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
                            profile.getSubNode('TOGGLE',profile.getSubId(src)).onClick();
                            return false;
                    }
                }
            },
            BOX:{
                onScroll:function(profile, e, src){
                    //for ie 'href focus' will scroll view
                    if((e=linb.use(src)).scrollLeft()!==0)
                        e.scrollLeft(0);
                }
            }
        },
        EventHandlers:{
            onGetContent:function(profile, item, callback){},
            onItemSelected:function(profile, item, src){}
        },
        DataModel:{
            listKey:null,
            width:200,
            height:200,
            iniFold:true,
            animCollapse:false,
            dock:'fill',
            group:{
                ini:false,
                action:function(v){
                    var self = this,
                        items = self.properties.items,
                        results = self.queryItems(items, function(o){return o.sub && o.group===undefined }),
                        nodes=linb();
                    _.arr.each(results,function(o){
                        nodes.merge( self.getSubNodeByItemId('BAR', o.id) );
                    });
                    var cls1=self.getClass('BAR'), cls2 = self.getClass('BAR', '-group');
                    if(v)
                       nodes.replaceClass(new RegExp('(\\b)' + cls1 + '([^b]*\\b)','g'), '$1'+cls2+'$2');
                    else
                       nodes.replaceClass(new RegExp('(\\b)' + cls2 + '([^b]*\\b)','g'), '$1'+cls1+'$2');
                }
            },
            selMode:{
                ini:'single',
                listbox:['single','none','multi'],
                action:function(value){
                    var ns=this,p=this.properties,sels=[];
                    _.each(this.SubSerialIdMapItem,function(o){
                        if(!(o.sub && (o.hasOwnProperty('group')?o.group:p.group)))
                            sels.push(ns.getSubNodeByItemId('MARK2',o.id).get(0));
                    });
                    linb(sels).css('display',value=='multi'?'':'none');
                }
            },
            noCtrlKey:true,
            singleOpen:false,
            dynDestory:false,
            position:'absolute'

        },
        RenderTrigger:function(){
            var self=this, pro=self.properties;
            if(!pro.iniFold)
                self.boxing()._toggleNodes(pro.items, true);
        },
        _onStartDrag:function(profile, e, src, pos){
            var pos=linb.Event.getPos(e);
            linb.use(src).startDrag(e, {
                dragType:'icon',
                shadowFrom:src,
                targetLeft:pos.left+12,
                targetTop:pos.top+12,
                dragCursor:'pointer',
                dragDefer:1,
                dragKey: profile.box.getDragKey(profile, src),
                dragData: profile.box.getDragData(profile, e, src)
            });
            return false;
        },
        _onDropTest:function(profile, e, src, key, data, item){
            var fid=data&&data.domId, tid=linb.use(src).id();
            if(fid){
                if(fid==tid)return false;
                if(_.get(linb.use(src).get(0),['parentNode','previousSibling','firstChild','id'])==fid)return false;
            }
        },
        _onDrop:function(profile, e, src, key, data, item){
            linb.DragDrop.setDragIcon('none');

            var k=profile.getKey(linb.use(src).id()),
                po=data.profile,
                ps=data.domId,
                oitem,
                ks=profile.keys,
                t=linb.absObj.$specialChars,
                b=profile.boxing();
            //remove
            oitem=_.clone(po.getItemByDom(ps),function(o,i){return !t[(i+'').charAt(0)]});
            po.boxing().removeItems([oitem.id]);

            //add
            if(k==ks.BOX)
                b.insertItems([oitem], null, null, false);
            else if(k==ks.BAR)
                b.insertItems([oitem], item._pid, item.id, true);
            else if(k==ks.TOGGLE)
                b.insertItems([oitem], item.id, null, false);

            return false;
        },
        _ensureValue:function(profile,value){
            if(profile.properties.selMode=='multi'){
                var arr = (value||"").split(';');
                arr.sort();
                return arr.join(';');
            }else
                return value;
        },
        _prepareItem:function(profile, item, oitem, pid){
            var p=profile.properties;

            if(pid)oitem._pid=pid;
            // set 'visible' will show when parent call .height()
            item.mark = item.sub?'':'display:none';
            item.disabled = item.disabled?profile.getClass('KEY', '-disabled'):'';
            item.mark2Display = (p.selMode=='multi')?'':'display:none';
            item._tabindex = p.tabindex;
            item.href = item.href || linb.$href;
            //change css class
            if(item.sub && (item.hasOwnProperty('group')?item.group:p.group)){
                item.cls_group = profile.getClass('BAR', '-group');
                item.mark2Display = 'display:none';
            }
        },
        _setSub:function(profile, item, flag, recursive){
            var id=profile.domId,
                itemId = profile.getSubIdByItemId(item.id),
                properties = profile.properties,
                barNode = profile.getSubNode('BAR', itemId),
                markNode = profile.getSubNode('TOGGLE', itemId),
                subNs = profile.getSubNode('SUB', itemId);
                ;

            if(linb.Thread.isAlive(profile.key+profile.id)) return;
            //close
            if(item._checked){
                if(!flag){
                    var h=subNs.height()

                    if(properties.animCollapse)
                        subNs.animate({'height':[h,0]},null,null, 100, 5, 'expoIn', profile.key+profile.id).start();
                    else
                        subNs.height(0);

                    markNode.tagClass('-checked', false);
                    item._checked = false;

                    if(item.group || properties.group)
                        barNode.tagClass('-checked', false);
                    if(properties.dynDestory){
                        var s=item.sub, arr=[];
                        for(var i=0,l=s.length;i<l;i++)
                            arr.push(s[i].id);
                        profile.boxing().removeItems(arr);
                        item.sub=true;
                        delete item._created;
                    }
                }
                if(recursive && item.sub && !properties.dynDestory){
                    _.arr.each(item.sub,function(o){
                        if(o.sub && o.sub.length)
                            profile.box._setSub(profile, o, false, true);
                    });
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
                                //subNs.css('display','none');
                                if(typeof sub=='string')
                                    subNs.html(item.sub=sub,false);
                                else if(_.isArr(sub))
                                    b.insertItems(sub, item.id);
                                else if(sub['linb.Template']||sub['linb.UI'])
                                    subNs.append(item.sub=sub.render(true));

                                //set checked items
                                b._setCtrlValue(b.getUIValue(), true);
                            }

                            if(p.singleOpen)
                                b._toggleNodes(item._pid?profile.getItemByItemId(item._pid).sub:p.items, false)

                            if(!recursive){
                                var h = subNs.height(true);
                                if(p.animCollapse)
                                    subNs.animate({'height':[0,h]},null,function(){subNs.height('auto')}, 100, 5, 'expoOut', profile.key+profile.id).start();
                                else
                                    subNs.height('auto');
                            }else
                                subNs.height('auto');

                            markNode.tagClass('-checked');
                            if(item.group || properties.group)
                                barNode.tagClass('-checked');

                            item._checked = true;
                        },
                        sub=item.sub,
                        callback=function(sub){
                            openSub(profile, item, id, markNode, subNs, barNode, sub, recursive)
                        },
                        t;
                    if((t=typeof sub)=='string'||t=='object')
                        callback(sub);
                    else if(profile.onGetContent){
                        var r=profile.boxing().onGetContent(profile, item, callback);
                        if(r){
                            //return true: continue UI changing
                            if(r===true)
                                item._created=true;
                            callback(r);
                        }                                                              }
                }
                if(recursive && item.sub){
                    _.arr.each(item.sub,function(o){
                        if(o.sub && o.sub.length && !o._checked)
                            profile.box._setSub(profile, o, true, true);
                    });
                }
            }
        },
        _onresize:function(profile,width,height){
            profile.getSubNode('BORDER').cssSize({ width :width?width:null, height :height?height:null});
            profile.getSubNode('BOX').cssSize({ width :width?width:null, height : height?height:null});
        }
    }
});
