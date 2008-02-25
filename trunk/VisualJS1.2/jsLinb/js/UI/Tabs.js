Class("linb.UI.Tabs", ["linb.UI.iWidget", "linb.UI.iList", "linb.UI.iContainer"],{
    Instance:{
        setCtrlValue:function(value){
            this.each(function(profile){
                var id=profile.domId,
                    box = profile.boxing(),
                    uiv = box.getUIValue(),
                    properties = profile.properties,
                    itemId = profile.getSubSerialIdByItemId(uiv),
                    temp,t
                    ;
                    if(uiv && profile.getSubSerialIdByItemId(uiv)){
                        profile.removeTagClass('ITEM','-checked',profile.getSubNode('ITEM',itemId));
                        profile.removeTagClass('BOX','-checked',profile.getSubNode('BOX',itemId));
                        if(properties.hasPanel)
                            // hide pane
                            box.getPanel(uiv).hide();
                    }
                    itemId = profile.getSubSerialIdByItemId(value);
                    if(itemId){
                        profile.addTagClass('ITEM','-checked', profile.getSubNode('ITEM',itemId));
                        profile.addTagClass('BOX','-checked', profile.getSubNode('BOX',itemId));
                        if(properties.hasPanel){
                            // show pane
                            box.getPanel(value).position('relative').show('auto','auto');

                            t=profile.domNode.style;
                            //reset width and height
                            profile.box.resize(profile, value, parseInt(t.width)||null, parseInt(t.height)||null);
                        }
                    }

            });
        },
        attach:function(ui,id){
            var self=this, profile=self.get(0),p=profile.properties,node;
            if(!id)
                id=p.$UIvalue||p.value;

            if(id){
                //first
                self.appendChild(ui, id);
                if(profile.domNode){
                    node=self.getPanel(id);
                    if(!node.isEmpty())
                        node.attach(ui);
                }
            }
            return self;
        },
        getCurPanel:function(){
            var profile = this.get(0);
            return this.getPanel(profile.properties.$UIvalue);
        },
        // get pane in page views
        getPanel:function(id){
            var profile = this.get(0);
            return profile.getSubNodeByItemId('PANEL', id);
        },
        ////
        addPanel:function(para, children, item){
            var i={}, id = item&&item.id;
            if(!id){
                var items = this.getItems();
                if(items.length)
                    id = items[items.length-1].id;
            }

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
            var self=this,
                profile=self.get(0),
                item = profile.getItemByDom(id);
            self.removeItems(item.id);
            return self;
        },
        getPanelPara:function(domId){
            var profile=this.get(0),
                item = profile.getItemByDom(domId),
                para = _.clone(item);
            if(!para.dragKey)para.dragKey=profile.properties.dragKey;
            if(!para.dropKeys)para.dropKeys=profile.properties.dropKeys;
            return para;
        },
        getPanelChildren:function(domId){
            var profile=this.get(0),
                id = profile.getItemIdByDom(domId),
                arr=[];
            if(id)
                profile.children.each(function(o){
                    if(o[1]==id)arr.push(o);
                });
            return arr;
        },

        ////
        fireItemClickEvent:function(id){
            var profile = this.get(0),
            //fire dom event
                node =profile.getSubNodeByItemId('ITEM', id);

            //no this one, set to null
            if(node.isEmpty()){
                profile.boxing().updateUIValue(null);
            }else
                node.onMousedown();
            return this;
        },
        /* insert some views to pageView widgets
            arr: hash(view properties) or array of hash
            before: views will insert before it, string
        */
        afterInsertItems:function(profile, data, base, before){
            var box=profile.box,obj,v;
            if(profile.properties.hasPanel && (obj=profile.root)){
                obj.addLast(box.subBuild(profile, 'panels', data).toDom());

                if(!(v=this.getUIValue()))
                    this.fireItemClickEvent((v=profile.properties.items[0]) && (v=v.id));

                var t=profile.domNode.style;

                box.resize(profile, v, parseInt(t.width)||null, parseInt(t.height)||null);
            }
        },
        /*  remove some views from pageView
            arr: array for id
        */
        removeItems:function(arr){
            var self=this,
                obj,serialId;
            if(!_.isArr(arr))arr=[arr];

            self.each(function(profile){
                if(profile.properties.hasPanel)
                    arr.each(function(o){
                        // get ui serial id
                        serialId=profile.getSubSerialIdByItemId(o);
                        if(serialId && !(obj = profile.getSubNode('PANEL', serialId) ).isEmpty() ){
                            // remove ui
                            obj.remove();
                        }
                    });
            });
            arguments.callee.upper.apply(self,arguments);

            self.each(function(profile){
                if(profile.properties.hasPanel){
                    if(arr.exists(profile.boxing().getUIValue())){
                        var i;
                        profile.boxing().fireItemClickEvent((i=profile.properties.items[0]) && i.id);
                    }
                    profile.box.resize(profile, profile.boxing().getUIValue(), profile.root.width(), profile.root.height());
                }
            });

            return self;
        },
        clearItems:function(){
            var self=this;
            self.each(function(profile){
                if(profile.properties.hasPanel)
                    profile.getSubNode('PANEL',true).remove();
            });
            self.setValue(null,true);
            arguments.callee.upper.apply(self,arguments);
            return self;
        },
        markDirty:function(item, b, flag){
            var profile = this.get(0);
            if(typeof item == 'string')
                item=profile.getItemByItemId(item);

            if((item._dirty !=b) || flag){
                var id = item.id,
                    caption = profile.getItemByItemId(id).caption;
                profile.getSubNodeByItemId('CAPTION', id).html(
                    profile.getItemByItemId(id).caption=b?('*'+caption):caption.replace(/^\*/,'')
                ).setStyle('fontStyle',b?'italic':'normal');
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
            style:'{_style}',
            LIST:{
                $order:0,
                tagName : 'div',
                style:'{HAlign}',
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
                        BOX:{
                                HANDLE:{
                                tagName: 'a',
                                href :"{href}",
                                tabindex: '{_tabindex}',
                                RULER:{},
                                ICON:{
                                                style:'background:url({icon}) transparent  no-repeat {iconPos};{iconDisplay}',
                                    $order:0
                                },
                                CAPTION:{
                                    text: '{caption}',
                                    className:"{disabled}",
                                    $order:1
                                },
                                CMDS:{
                                    $order:2,
                                    LAND:{
                                        style:'{landDisplay}',
                                        $order:1
                                    },
                                    CLOSE:{
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
                position:'relative'
            },
            ITEMS:{
                'padding-left':'4px',
                'padding-right':'4px',
                position:'relative',
                background: linb.UI.getCSSImgPara('dot.gif', ' repeat-x center bottom', null, 'linb.UI.Public')
            },
            ITEM:{
                $order:0,
                'font-family': '"Verdana", "Helvetica", "sans-serif"',
                cursor:'pointer',
                'padding-right':'6px',
                'vertical-align':'top',
                'border-bottom':'1px solid #91A7B4',
                background: linb.UI.getCSSImgPara('top.gif', ' no-repeat right top')
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
                border:0,
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
                'background-color':'#fff'//,
                //border:'1px solid #91A7B4'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{ITEM:['ITEM','BOX'],CLOSE:'CLOSE',LAND:'LAND'},
            _clickEffect:{ITEM:['ITEM','BOX'],CLOSE:'CLOSE',LAND:'LAND'},
            onRewh:function(profile, e, src){
                var o = profile.domNode.style,w=null,h=null;
                if(e.height)h = parseInt(o.height)||null;
                if(e.width)w = parseInt(o.width)||null;
                profile.box.resize(profile, profile.properties.$UIvalue, w, h);
            },
            ITEM:{
                onClick:function(profile, e, src){return false;},
                onMousedown:function(profile, e, src){
                    if(linb.event.getBtn(e)!='left')return;
                    var properties = profile.properties,
                        itemId = profile.getSubSerialId(src.id),
                        item = profile.getItemByDom(src),
                        box = profile.boxing();

                    if(properties.disabled)return false;
                    if(box.getUIValue() == item.id)return false;

                    //for some input onblur event
                    profile.getSubNode('HANDLE', itemId).focus();

                    box.updateUIValue(item.id);

                    //if success
                    if(box.getUIValue() == item.id){
                        box.onItemSelected(profile, item, src);
                    }
                }
            },
            HANDLE:{
                onClick:function(profile, e){return profile.box.cancelLink(e)},
                onKeydown:function(profile, e, src){
                    var keys=linb.event.getKey(e), key = keys[0], shift=keys[2];
                    if(key=='space'||key=='enter'){
                        profile.getSubNode('ITEM',profile.getSubSerialId(src.id)).onMousedown();
                        return false;
                    }

                    var cur = linb([src]),
                    target = profile.getSubNode('ITEMS'),
                    first = target.nextFocus(true, true, false),
                    last = target.nextFocus(false, true, false);

                    switch(key){
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

                    var panel = profile.boxing().getPanel(id),
                        pos = profile.root.absPos(),
                        size=profile.root.cssSize(),
                        pro = linb.UI.Dialog.getDefaultProp();
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
            hasPanel:true,
            width:200,
            height:200,
            position:'absolute',
            HAlign:{
                ini:'left',
                listbox:['left','right'],
                action:function(value){
                    if(this.domNode)
                        this.getSubNode('LIST').setStyle('textAlign',value);
                }
            },
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode('HANDLE',true).tabIndex(value);
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
                            var box = o.boxing(),
                                p,
                                temp = linb.dom.getMatix(),
                                children = o.children.copy();
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
            var data = profile.data;
            data.panels = data.items;
            data.HAlign = data.HAlign=='right'?'text-align:right;':'';
        },
        prepareItem:function(profile, item){
            item.closeDisplay = item.closeBtn?'':'display:none';
            item.landDisplay = item.landBtn?'':'display:none';
            item.href = item.href || "javascript:;";
        },
        getDropKeys:function(profile,node){
            var key=profile.getKey(node.id);
            if(key==profile.keys.PANEL)
                return profile.properties.dropKeys;
            else
                return profile.properties.dropKeysPanel;
        },
        showTips:function(profile, node, pos){
            var id=node.id;
            if(!id)return false;
            //dont show tips when mouse over PANEL
            if(profile.getKey(id)==profile.keys.PANEL)return true;
            return arguments.callee.upper.apply(this,arguments);
        },
        //for tabs only
        resize:function(profile,key,w,h){
            var t=profile.properties,
                temp,
                o = profile.boxing().getPanel(key),
                item = profile.getItemByItemId(key),
                l=profile.getSubNode('LIST'),
                lc=false
            ;
            if(!o || o.isEmpty())return;

            //no height set
            if(!parseInt(profile.domNode.style.height))
                h=null;

            var wc=null,hc=null;
            if(w && item._w!=w){
                wc=item._w=w;
                lc=true;
            }
            if(lc)
                //for opear 9.0 get height bug, get offsetheight in firefox is slow
                t._listH = l.get(0).offsetHeight || l.offsetHeight();
            temp=t._listH;

            if((h && item._h!=h) || lc){
                item._h=h;
                h = h-temp+(linb.browser.ie6?2:1);
                if(h>0)hc=h;
            }
            if(wc || hc)
                o.setRegion({width:wc?wc-2:null, height:hc?hc-2:null},true);
        }
    }
});