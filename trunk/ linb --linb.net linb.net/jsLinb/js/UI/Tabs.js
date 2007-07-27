Class("linb.UI.Tabs", ["linb.UI.iWidget", "linb.UI.iList", "linb.UI.iContainer"],{
    Instance:{
        setCtrlValue:function(value){
            this.each(function(profile){
                var id=profile.domId,
                    box = profile.boxing(),
                    uiv = box.getUIValue(),
                    key1 = profile.keys.ITEM,
                    key2 = profile.keys.BOX,
                    properties = profile.properties,
                    itemId = profile.getSubSerialIdByItemId(uiv),
                    temp,t
                    ;
                    if(uiv && profile.getSubSerialIdByItemId(uiv)){
                        profile.removeTagClass(profile.getSubNode(key1,itemId), key1,'-checked');
                        profile.removeTagClass(profile.getSubNode(key2,itemId), key2,'-checked');
                        // hide pane
                        box.getPanel(uiv).hide();
                    }
                    itemId = profile.getSubSerialIdByItemId(value);
                    if(itemId){
                        profile.addTagClass(profile.getSubNode(key1,itemId), key1,'-checked');
                        profile.addTagClass(profile.getSubNode(key2,itemId), key2,'-checked');
                        // show pane
                        t=box.getPanel(value).show();

                        //reset width and height
                        profile.box.resize(profile, value, profile.root.width(), profile.root.height());
                    }

            });
        },
        attach:function(ui,id){
            var profile=this.get(0);
            //first
            this.appendChild(ui, id);

            if(profile.domNode){
                if(!profile.getSubSerialIdByItemId(id))
                    id=profile.properties.$UIvalue;
                this.getPanel(id).attach(ui);
            }

            return this;
        },
        getCurPanel:function(){
            var profile = this.get(0);
            return this.getPanel(profile.properties.$UIvalue);
        },
        // get pane in page views
        getPanel:function(id){
            var profile = this.get(0);
            return profile.getSubNode(profile.keys.PANEL, profile.getSubSerialIdByItemId(id));
        },
        ////
        addPanel:function(para, children, item){
            id = item&&item.id;
            var i={};
            _.merge(i, {
                caption:para.caption,
                icon:para.icon,
                closeBtn:para.closeBtn || false,
                landBtn:para.landBtn || false,
                iconPos:para.iconPos,
                dragKey:para.dragKey,
                dropKeys:para.dropKeys,
                id : para.id || para.tag || _.id()
            });

            this.insertItems([i], id);
            children.each(function(o){
                this.attach(o[0], i.id);
            },this);
        },
        removePanel:function(id){
            var profile=this.get(0),
                item = profile.getItemByDom(id);
            this.removeItems(item.id);
            this.box
        },
        getPanelPara:function(id){
            var profile=this.get(0),
                item = profile.getItemByDom(id);
            var para = _.clone(item);
            if(!para.dragKey)para.dragKey=profile.properties.dragKey;
            if(!para.dropKeys)para.dropKeys=profile.properties.dropKeys;
            return para;
        },
        getPanelChildren:function(id){
            var profile=this.get(0),
                item = profile.getItemByDom(id);

            id = item.id;
            var arr=[];
            if(id){
                this.get(0).children.each(function(o){
                    if(o[1]==id)arr.push(o);
                });
            }
            return arr;
        },

        ////
        selectPage:function(id){
            var profile = this.get(0);
            //fire dom event
            var node =profile.getSubNode(profile.keys.ITEM, profile.getSubSerialIdByItemId(id));

            //no this one, set to null
            if(node.isEmpty()){
                profile.boxing().updateUIValue(null);
            }else
                node.onClick();
            return this;
        },
        /* insert some views to pageView widgets
            arr: hash(view properties) or array of hash
            before: views will insert before it, string
        */
        insertItemsEx:function(data, base, before){
            var profile=this.get(0),box=profile.box,obj,v;
            if(obj=profile.root){
                obj.addLast(box.subBuild(profile, 'panels', data).toDom());

                if(!(v=this.getUIValue()))
                    this.selectPage((v=profile.properties.items[0]) && (v=v.id));

                box.resize(profile, v, obj.width(), obj.height());
            }
        },
        /*  remove some views from pageView
            arr: array for id
        */
        removeItems:function(arr){
            var obj;
            if(!_.isArr(arr))arr=[arr];
            var serialId;
            this.each(function(profile){
                arr.each(function(o){
                    // get ui serial id
                    serialId=profile.getSubSerialIdByItemId(o);
                    if(serialId && !(obj = profile.getSubNode(profile.keys.PANEL, serialId) ).isEmpty() ){
                        // remove ui
                        obj.remove();
                    }
                });
            });
            arguments.callee.upper.apply(this,arguments);
            this.each(function(profile){
                if(arr.exists(profile.boxing().getUIValue())){
                    var i;
                    profile.boxing().selectPage((i=profile.properties.items[0]) && i.id);
                }
                profile.box.resize(profile, profile.boxing().getUIValue(), profile.root.width(), profile.root.height());
            });

            return this;
        },
        clearItems:function(){
            this.each(function(profile){
                profile.getSubNode(profile.keys.PANEL,true).remove();
            });
            this.setValue(null,true);
            arguments.callee.upper.apply(this,arguments);
            return this;
        },
        markDirty:function(item, b, flag){
            var profile = this.get(0);
            if(typeof item == 'string')
                item=profile.getItemByItemId(item);

            if((item._dirty !=b) || flag){
                var id = item.id;

                var caption = profile.getItemByItemId(id).caption;
                if(!b){
                    profile.getSubNode(profile.keys.CAPTION, profile.getSubSerialIdByItemId(id)).html(
                        profile.getItemByItemId(id).caption=caption.replace(/^\*/,'')
                    ).setStyle('fontStyle','normal');
                }else{
                    profile.getSubNode(profile.keys.CAPTION, profile.getSubSerialIdByItemId(id)).html(
                        profile.getItemByItemId(id).caption='*'+caption
                    ).setStyle('fontStyle','italic');
                }
                item._dirty=b;
            }
            return this;
        }
    },
    Static:{
        cssNone:false,
        Dropable:['PANEL','KEY', 'ITEM'],
        Dragable:['ITEM'],
        Templates:{'default':{
            tagName : 'div',
            style:'{left}{top}{width}{height}{right}{bottom}{zIndex}{position}',
            LIST:{
                $order:0,
                tagName : 'div',
                ITEMS:{
                    tagName : 'div',
                    text:"{items}"
                }
            },
            PNAELS:{
                $order:1,
                tagName:'text',
                text:'{panels}'
            },
            $dynamic:{
                items:{
                    ITEM:{
                        tagName : 'span',
                        BOX:{
                            tagName : 'span',
                            HANDLE:{
                                tagName: 'a',
                                href :"javascript:;",
                                tabindex: '{_tabindex}',
                                RULER:{},
                                ICON:{
                                    tagName : 'span',
                                    style:'background:url({icon}) transparent  no-repeat {iconPos};{iconDisplay}',
                                    $order:0
                                },
                                CAPTION:{
                                    tagName : 'span',
                                    text: '{caption}',
                                    className:"{disabled}",
                                    $order:1
                                },
                                CMDS:{
                                    $order:2,
                                    LAND:{
                                        tagName : 'span',
                                        style:'{landDisplay}',
                                        $order:1
                                    },
                                    CLOSE:{
                                        tagName : 'span',
                                        style:'{closeDisplay}',
                                        $order:2
                                    }
                                }
                            }
                        }
                    }
                },
                panels:{
                    PANEL:{
                        tagName : 'div',
                        text:linb.UI.$childTag
                    }
                }
            }
        }},
        Appearances:{'default':{
            KEY:{
                position:'absolute',
                overflow:'hidden'
            },
            LIST:{
                'z-index':'2',
                position:'absolute',
                'padding-left':'2px',
                left:'0',
                top:'0',
                width:'100%'
            },
            ITEM:{
                $order:0,
                'font-family': '"Verdana", "Helvetica", "sans-serif"',
                cursor:'pointer',
                'padding-right':'6px',
                'vertical-align':'top',
                'border-bottom':'1px solid #91A7B4',
                background: linb.UI.getCSSImgPara('top.gif', ' no-repeat right top'),
                'margin-bottom':linb.browser.ie6?'1px':''
            },
            'ITEM-mouseover':{
                $order:1,
                'background-position' : 'right -100px'
            },
            'ITEM-mousedown':{
                $order:2,
                'background-position' : 'right -200px',
                'border-bottom':'1px solid #fff'
            },
            'ITEM-checked':{
                $order:3,
                'background-position' : 'right -200px',
                'border-bottom':'1px solid #fff'
            },
            BOX:{
                $order:0,
                padding:'6px 0 2px 6px',
                border:'0',
                //keep this same with ITEM
                'vertical-align':'top',
                'text-align': 'center',
                background: linb.UI.getCSSImgPara('top.gif', ' no-repeat left -50px')
            },
            'BOX-mouseover':{
                $order:1,
                'background-position' : 'left -150px'
            },
            'BOX-mousedown':{
                $order:2,
                'background-position' : 'left -250px'
            },
            'BOX-checked':{
                $order:3,
                'background-position' : 'left -250px'
            },
            HANDLE:{
                cursor:'pointer',
                'vertical-align':'middle',
                display:linb.browser.gek?['-moz-inline-block', '-moz-inline-box']: 'inline-block',
                'font-size':'12px'
            },
            RULER:{
                height:'16px',
                width:'1px'
            },
            ICON:{
                cursor:'pointer',
                width:'16px',
                height:'16px',
                'vertical-align':'middle',
                margin:'0 4px 0 0'
            },
            'CLOSE, LAND':{
                cursor:'pointer',
                width:'15px',
                height:'15px',
                'vertical-align':'middle'
            },
            CLOSE:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -64px 0', null, 'linb.UI.Public')
            },
            'CLOSE-mouseover':{
                $order:1,
                'background-position' : '-64px -16px'
            },
            'CLOSE-mousedown':{
                $order:2,
                'background-position' : '-64px -32px'
            },
            LAND:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -220px 0', null, 'linb.UI.Public')
            },
            'LAND-mouseover':{
                $order:1,
                'background-position' : '-220px -16px'
            },
            'LAND-mousedown':{
                $order:2,
                'background-position' : '-220px -32px'
            },
            PANEL:{
                position:'absolute',
                visibility:'hidden',
                top:'-10000px',
                left:'-10000px',
                overflow:'auto',
                'background-color':'#fff',
                border:'1px solid #91A7B4'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{ITEM:['ITEM','BOX'],CLOSE:'CLOSE',LAND:'LAND'},
            _clickEffect:{ITEM:['ITEM','BOX'],CLOSE:'CLOSE',LAND:'LAND'},
            onResize:function(profile, e, src){
                var o = profile.root,w=null,h=null;
                if(e.height)h=o.height();
                if(e.width)w=o.width();
                profile.box.resize(profile, profile.properties.$UIvalue, w, h);
            },
            ITEM:{
                onClick:function(profile, e, src){
                    var properties = profile.properties,
                        itemId = profile.getSubSerialId(src.id),
                        item = profile.getItemByDom(src),
                        box = profile.boxing();

                    if(properties.disabled)return false;
                    if(box.getUIValue() == item.id)return false;

                    box.updateUIValue(item.id);

                    //if success
                    if(box.getUIValue() == item.id){
                        box.onItemSelected(profile, item, src);
                        profile.getSubNode(profile.keys.HANDLE, itemId).focus();
                    }

                    //for design mode in firefox
                    return false;
                }
            },
            HANDLE:{
                onKeydown:function(profile, e, src){
                    var keys=linb.event.getKey(e), key = keys[0], shift=keys[2],
                    cur = linb([src],false),
                    target = profile.getSubNode(profile.keys.ITEMS),
                    first = target.nextFocus(true, true, false),
                    last = target.nextFocus(false, true, false);

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
                            profile.getSubNode(profile.keys.ITEM,profile.getSubSerialId(src.id)).onClick();
                            return false;
                            break;
                    }
                }
            },
            CLOSE:{
                onClick:function(profile, e, src){
                    var properties = profile.properties,
                        item = profile.getItemByDom(src);

                    if(properties.disabled)return;
                    var instance = profile.boxing();

                    if(false===instance.beforePageClose(profile, item, src)) return;

                    instance.removeItems(item.id);

                    instance.afterPageClose(profile, item, src);

                    profile.box.resize(profile, profile.properties.$UIvalue, profile.root.width(), profile.root.height());
                    //for design mode in firefox
                    return false;
                }
            },
            LAND:{
                onClick:function(profile, e, src){
                    var properties = profile.properties,
                        item = profile.getItemByDom(src),
                        id=item.id;

                    if(properties.disabled)return;

                    var panel = profile.boxing().getPanel(id);
                    var pos = profile.root.absPos(), size=profile.root.cssSize();
                    var pro = linb.UI.Dialog.getDefaultProp();
                    _.merge(pro, item, 'with');
                    _.merge(pro,{
                        dragKey: item.dragkey || properties.dragKey ,
                        dock:'none',
                        tag:item.tag||item.id,
                        width:size.width,
                        height:size.height,
                        left:pos.left,
                        top:pos.top
                    },'all');
                    var dialog = new linb.UI.Dialog(pro);
                    linb(document.body).attach(dialog);

                    profile.children.each(function(o){
                        if(o[1]==id)
                            dialog.attach(o[0]);
                    },null,true);
                    profile.boxing().removeItems(id);

                    //for design mode in firefox
                    return false;
                }
            }
        }},
        DataModel:{
            dataBinder:null,
            dataField:null,

            dock:'fill',

            width:200,
            height:200,
            position:'absolute',
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode(this.keys.HANDLE,true).tabIndex(value);
                }
            },

            dragKey:'',
            dropKeysPanel:'',
            value:{
                ini:'a'
            },
            //use ilist defualt items
            items:{
                set:function(v){
                    return this.each(function(o){
                        if(o.domNode){
                            var box = o.boxing();

                            //keep children
                            var p, temp = linb.dom.getTemp();
                            var children = o.children.copy();
                            o.children.length=0;
                            children.each(function(o){
                                //for flush dock
                                delete o[0].$dockParent;
                                //keep it in dom
                                temp.addLast(o[0].root);
                            });

                            //bak value
                            var value = o.properties.value;

                            //clear all
                            box.clearItems();
                            //call gc to clear onresize setting
                            linb.dom.$gc();

                            //inset items
                            box.insertItems(v);

                            //restore children
                            children.each(function(v){
                                box.attach.apply(box,v);
                            });

                            //clear
                            temp.empty();

                            //set value
                            box.setValue(value,true);

                            //resize
                            var size = o.root.cssSize();
                            o.box.resize(o, o.properties.$UIvalue, size.width, size.height);
                        }else
                            o.properties.items = v;
                    });
                }
            }
        },
        EventHandlers:{
            beforeNextFocus:null,
            beforePageClose:function(profile, item, src){},
            afterPageClose:function(profile, item, src){},
            onItemSelected:function(profile, item, src){}
        },
        createdTrigger:function(){
            // set default value
            if(this.properties.value){
                this.boxing().updateUIValue(this.properties.value);
            }
        },
        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);
            profile.data.panels = profile.data.items;
        },
        prepareItem:function(profile, item){
            item.closeDisplay = item.closeBtn?'':'display:none';
            item.landDisplay = item.landBtn?'':'display:none';
        },
        getDropKeys:function(profile,node){
            var key=profile.getKey(node.id);
            if(key==profile.keys.PANEL)
                return profile.properties.dropKeys;
            else
                return profile.properties.dropKeysPanel;
        },
        //for tabs only
        resize:function(profile,key,w,h){
            var t=profile.properties, temp, top;
            var o = profile.boxing().getPanel(key);
            var l=profile.getSubNode(profile.keys.LIST),lc=false;
            if(!o || o.isEmpty())return;
            var wc=null,hc=null;

            if(w){
                wc=w;
                if(l.width!=w){
                    l.width(w-2);
                    lc=true;
                }
            }
            if(h || lc){
                //temp = l.height();
                //for opear 9.0 get height bug
                temp = l.offsetHeight();
                //get top pos
                if(t.mode == 'bottom') top=0;
                else top = temp-(linb.browser.ie6?2:1);

                h = h-temp+(linb.browser.ie6?2:1);
                if(h>0)hc=h;
            }

            o.setRegion({width:wc?wc-2:null, height:hc?hc-2:null, top:top, left:0},true);
        }
    }
});