Class("linb.UI.Tabs", ["linb.UI", "linb.absList","linb.absValue"],{
    Instance:{
        _setCtrlValue:function(value){
            this.each(function(profile){
                var id=profile.domId,
                    box = profile.boxing(),
                    uiv = box.getUIValue(),
                    properties = profile.properties,
                    itemId = profile.getSubIdByItemId(uiv),
                    temp,t
                    ;
                    if(uiv && profile.getSubIdByItemId(uiv)){
                        profile.getSubNodes(['ITEM','BOX'],itemId).tagClass('-checked',false);

                        if(box.KEY!='linb.UI.Tabs'||properties.hasPanel)
                            // hide pane
                            box.getPanel(uiv).hide();
                    }
                    itemId = profile.getSubIdByItemId(value);
                    if(itemId){
                        profile.getSubNodes(['ITEM','BOX'],itemId).tagClass('-checked');
                        if(box.KEY!='linb.UI.Tabs'||properties.hasPanel){
                            // show pane
                            box.getPanel(value).show('auto',profile.getSubNode('LIST').offsetHeight()+'px');
                            t=profile.getRoot().cssSize();
                            //reset width and height
                            linb.UI.$tryResize(profile, parseInt(t.width)||null, parseInt(t.height)||null, false, value);

                            //dynamic render
                            if(properties.dynRender){
                                var arr=profile.children,a=[];
                                _.arr.each(arr,function(o){
                                    if(o[1]==value && !o[0]['parent:'+profile.$linbid]){
                                        a.push(o[0]);
                                        o[0]['parent:'+profile.$linbid]=1;
                                    }
                                });
                                if(a.length)
                                    box.append(linb.UI.pack(a),value);
                            }
                        }
                    }
            });
        },
        append:function(target,subId){
            var p=this.get(0).properties;
            if(subId=subId||p.$UIvalue||p.value)
                arguments.callee.upper.call(this, target, subId);
            return this;
        },
        getCurPanel:function(){
            var profile = this.get(0);
            return this.getPanel(profile.properties.$UIvalue);
        },
        // get pane in page views
        getPanel:function(subId){
            var profile = this.get(0);
            return profile.getSubNodeByItemId('PANEL', subId);
        },
        ////
        addPanel:function(para, children, item){
            var i={}, 
                id = item&&item.id,
                items = this.getItems(),
                id2=para.id||para.tag;
            if(items.length){
                if(-1!=_.arr.subIndexOf(items,'id',id2))
                    return false;

                if(!id)    
                    id = items[items.length-1].id;
            }

            _.merge(i, {
                caption:para.caption,
                image:para.image,
                closeBtn:para.closeBtn || false,
                landBtn:para.landBtn || false,
                optBtn:para.optBtn || false,
                imagePos:para.imagePos,
                dragKey:para.dragKey,
                dropKeys:para.dropKeys,
                id : para.id || para.tag || _.id()
            });

            this.insertItems([i], id);
            var arr=[];
            _.arr.each(children,function(o){
                arr.push(o[0]);
            });
            this.append(linb.UI.pack(arr,false), i.id);

            return this;
        },
        removePanel:function(domId){
            var self=this,
                item = self.getItemByDom(domId);
            return self.removeItems([item.id]);
        },
        getPanelPara:function(domId){
            var profile=this.get(0),
                pp=profile.properties,
                item = profile.getItemByDom(domId),
                para = _.clone(item);
            if(!para.dragKey)para.dragKey=pp.dragKey;
            if(!para.dropKeys)para.dropKeys=pp.dropKeys;
            return para;
        },
        getPanelChildren:function(domId){
            var profile=this.get(0),
                id = profile.getItemIdByDom(domId),
                arr=[];
            if(id)
                _.arr.each(profile.children,function(o){
                    if(o[1]==id)arr.push(o);
                });
            return arr;
        },

        ////
        fireItemClickEvent:function(subId){
            this.getSubNodeByItemId('ITEM', subId).onMousedown();
            return this;
        },
        /* insert some views to pageView widgets
            arr: hash(view properties) or array of hash
            before: views will insert before it, string
        */
        _afterInsertItems:function(profile, data){
            if(!profile.renderId)return;
            var box=profile.box,obj,v,pp=profile.properties;
            if(pp.hasPanel && (obj=profile.getSubNode(profile.keys.BOX||profile.keys.KEY))){
                obj.append(profile._buildItems('panels', data));

                if(!(v=this.getUIValue()))
                    this.fireItemClickEvent((v=pp.items[0]) && (v=v.id));

                var t=profile.getRootNode().style;

                linb.UI.$tryResize(profile, parseInt(t.width)||null, parseInt(t.height)||null, false,v);
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
                    _.arr.each(arr,function(o){
                        // get ui serial id
                        serialId=profile.getSubIdByItemId(o);
                        if(serialId && !(obj = profile.getSubNode('PANEL', serialId) ).isEmpty() ){
                            // remove ui
                            obj.remove();
                        }
                    });
            });
            arguments.callee.upper.apply(self,arguments);

            self.each(function(profile){                
                if(!profile.boxing().getUIValue()){
                    var i;
                    profile.boxing().fireItemClickEvent((i=profile.properties.items[0]) && i.id);
                }
                if(profile.properties.hasPanel)
                    linb.UI.$tryResize(profile, profile.getRoot().width(), profile.getRoot().height(), false, profile.boxing().getUIValue());
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
        markItemCaption:function(subId, mark, force){
            var profile = this.get(0);
            subId=profile.getItemByItemId(subId);

            if((subId._dirty !=mark) || force){
                var id = subId.id,
                    caption = profile.getItemByItemId(id).caption;
                profile.getSubNodeByItemId('CAPTION', id).html(
                    profile.getItemByItemId(id).caption=mark?('*'+caption):caption.replace(/^\*/,'')
                ).css('fontStyle',mark?'italic':'normal');
                subId._dirty=mark;
            }
            return this;
        }
    },
    Static:{
        Templates:{
            tagName : 'div',
            style:'{_style};',
            LIST:{
                $order:0,
                tagName : 'div',
                ITEMS:{
                    tagName : 'div',
                    text:"{items}",
                    style:'{HAlign}'
                }
            },
            PNAELS:{
                $order:1,
                tagName:'text',
                text:'{panels}'
            },
            $submap:{
                items:{
                    ITEM:{
                        className:'{itemClass} {disabled}',
                        style:'{itemStyle}',
                        ITEMI:{
                            ITEMC:{
                                HANDLE:{
                                    tagName: 'a',
                                    href :"{href}",
                                    tabindex: '{_tabindex}',
                                    IBWRAP:{
                                        tagName:'div',
                                        style:"white-space:nowrap;",
                                        RULER:{},
                                        ICON:{
                                            $order:0,
                                            className:'ui-icon {imageClass}',
                                            style:'{backgroundImage} {backgroundPosition} {imageDisplay}'
                                        },
                                        CAPTION:{
                                            text: '{caption}',
                                            $order:1
                                        },
                                        CMDS:{
                                            $order:2,
                                            OPT:{
                                                $order:1,
                                                className:'uicmd-opt',
                                                style:'{_opt}'
                                            },
                                            LAND:{
                                                className:'uicmd-land',
                                                style:'{landDisplay}',
                                                $order:1
                                            },
                                            CLOSE:{
                                                className:'uicmd-close ',
                                                style:'{closeDisplay}',
                                                $order:2
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                panels:{
                    PANEL:{
                        tagName : 'div',
                        className:'uibg-base',
                        text:linb.UI.$childTag
                    }
                }
            }
        },
        Appearances:{
            KEY:{
                position:'absolute',
                overflow:'hidden'
            },
            LIST:{
                position:'relative'
            },
            ITEMS:{
                padding:'0 4px 2px 0',
                position:'relative',
                background: linb.UI.$bg('line.gif', 'repeat-x center bottom')
            },
            ITEM:{
                $order:0,
                'font-family': '"Verdana", "Helvetica", "sans-serif"',
                cursor:'pointer',
                'padding-right':'6px',
                'vertical-align':'top',
                background: linb.UI.$bg('button.gif', 'no-repeat right -540px', true)
            },
            'ITEM-mouseover':{
                $order:1,
                'background-position' : 'right -690px'
            },
            'ITEM-mousedown, ITEM-checked':{
                $order:2,
                'background-position' : 'right -840px',
                'border-bottom':'solid 1px #FAD600;'
            },
            ITEMI:{
                $order:0,
                'padding-left':'6px',
                //keep this same with ITEM
                'vertical-align':'top',
                background: linb.UI.$bg('button.gif', 'no-repeat left -640px',true)
            },
            'ITEM-mouseover ITEMI':{
                $order:1,
                'background-position' : 'left -790px'
            },
            'ITEM-mousedown ITEMI, ITEM-checked ITEMI':{
                $order:2,
                'background-position' : 'left -940px'
            },
            ITEMC:{
                $order:0,
                padding:'5px 0 3px 0',
                //keep this same with ITEM
                'vertical-align':'top',
                'text-align': 'center',
                background: linb.UI.$bg('button.gif', 'repeat-x left -590px',true)
            },
            'ITEM-mouseover ITEMC':{
                $order:1,
                'background-position' : 'left -740px'
            },
            'ITEM-mousedown ITEMC, ITEM-checked ITEMC':{
                $order:2,
                'background-position' : 'left -890px'
            },
            HANDLE:{
                display:linb.$inlineBlock,
                zoom:linb.browser.ie6?1:null,
                cursor:'pointer',
                'vertical-align':'middle',
                'font-size':'12px'
            },
            RULER:{
                height:'18px',
                width:'1px',
                'vertical-align':'middle'
            },
            PANEL:{
                position:'absolute',
                visibility:'hidden',
                top:'-10000px',
                left:'-10000px',
                width:'100%',
                overflow:'auto'
            },
            CAPTION:{
                'vertical-align':'middle'
            },
            CMDS:{
                'vertical-align':'middle',
                'margin-left':'4px'
            }
        },
        Behaviors:{
            DropableKeys:['PANEL','KEY', 'ITEM'],
            DragableKeys:['ITEM'],
            HoverEffected:{ITEM:'ITEM',OPT:'OPT',CLOSE:'CLOSE',LAND:'LAND'},
            ClickEffected:{ITEM:'ITEM',OPT:'OPT',CLOSE:'CLOSE',LAND:'LAND'},
            onSize:function(profile,e){
                var o = profile.getRootNode().style,w=null,h=null;
                if(e.height)h = parseInt(o.height)||null;
                if(e.width)w = parseInt(o.width)||null;
                linb.UI.$tryResize(profile, w, h);
            },
            OPT:{
                onMousedown:function(){
                    return false;
                },
                onClick:function(profile, e, src){
                    profile.boxing().onShowOptions(profile, profile.getItemByDom(src), e, src);
                    return false;
                }
            },
            CAPTION:{
                onMousedown:function(profile, e, src){
                    if(linb.Event.getBtn(e)!='left')return;
                    var properties = profile.properties,
                        item = profile.getItemByDom(src),
                        box = profile.boxing();

                    if(properties.disabled)return false;
                    if(box.getUIValue() == item.id){
                         if(profile.onCaptionActive)
                            profile.boxing().onCaptionActive(profile, profile.getItemByDom(src), src);
                    }
                }
            },
            ITEM:{
                onClick:function(profile, e, src){
                    return false;
                },
                onMousedown:function(profile, e, src){
                    if(linb.Event.getBtn(e)!='left')return false;
                    if(profile.getKey(linb.Event.getSrc(e).parentNode.id)==profile.keys.CMDS)return false;

                    var properties = profile.properties,
                        itemId = profile.getSubId(src),
                        item = profile.getItemByDom(src),
                        box = profile.boxing();

                    if(properties.disabled)return false;
                    if(box.getUIValue() == item.id)return;

                    //for some input onblur event
                    profile.getSubNode('HANDLE', itemId).focus();

                    box.setUIValue(item.id);

                    //if success
                    if(box.getUIValue() == item.id){
                        box.onItemSelected(profile, item, src);
                        return false;
                    }
                }
            },
            HANDLE:{
                onClick:function(profile, e, src){
                    return !!linb.Event.getKey(e)[2];
                },
                onKeydown:function(profile, e, src){
                    var keys=linb.Event.getKey(e), key = keys[0], shift=keys[2];
                    if(key==' '||key=='enter'){
                        profile.getSubNode('ITEM',profile.getSubId(src)).onMousedown();
                        return false;
                    }

                    var cur = linb(src),
                    target = profile.getSubNode('ITEMS'),
                    first = target.nextFocus(true, true, false),
                    last = target.nextFocus(false, true, false);

                    switch(key){
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
                onMousedown:function(){
                    return false;
                },
                onClick:function(profile, e, src){
                    var properties = profile.properties,
                        item = profile.getItemByDom(src),bak;

                    if(properties.disabled)return;
                    var instance = profile.boxing();

                    if(false===instance.beforePageClose(profile, item, src)) return;

                    bak=_.copy(item);

                    instance.removeItems(item.id);

                    instance.afterPageClose(profile, bak);

                    linb.UI.$tryResize(profile, profile.getRoot().width(), profile.getRoot().height());
                    //for design mode in firefox
                    return false;
                }
            },
            LAND:{
                onMousedown:function(){
                    return false;
                },
                onClick:function(profile, e, src){
                    var properties = profile.properties,
                        item = profile.getItemByDom(src),
                        id=item.id;

                    if(properties.disabled)return;

                    var panel = profile.boxing().getPanel(id),
                        pos = profile.getRoot().offset(),
                        size=profile.getRoot().cssSize(),
                        pro = _.copy(linb.UI.Dialog.$DataStruct);
                    _.merge(pro, item, 'with');
                    _.merge(pro,{
                        dragKey: item.dragkey || properties.dragKey ,
                        dock:'none',
                        tag:item.tag||item.id,
                        width:Math.max(size.width,200),
                        height:Math.max(size.height,100),
                        left:pos.left,
                        top:pos.top
                    },'all');
                    var dialog = new linb.UI.Dialog(pro);
                    linb('body').append(dialog);

                    var arr=[];
                    _.arr.each(profile.children,function(o){
                        if(o[1]==id)
                            arr.push(o[0]);
                    },null,true);

                    if(arr.length)
                        dialog.append(linb.UI.pack(arr,false));

                    profile.boxing().removeItems(id);

                    //for design mode in firefox
                    return false;
                }
            }
        },
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
                listbox:['left','center','right'],
                action:function(value){
                    this.getSubNode('ITEMS').css('textAlign',value);
                }
            },
            dynRender:true,
            dropKeysPanel:'',
            value:{
                ini:''
            },
            //use ilist defualt items
            items:{
                set:function(value){
                    return this.each(function(o){
                        if(o.renderId){
                            var box = o.boxing(),
                                p,
                                temp = linb.$getGhostDiv(),
                                children = _.copy(o.children);
                            o.children.length=0;
                            _.arr.each(children,function(o){
                                //for flush dock
                                delete o[0].$dockParent;
                                //keep it in dom
                                temp.appendChild(o[0].getRootNode());
                            });

                            //bak value
                            var bv = o.properties.value;

                            //clear all
                            box.clearItems();

                            //inset items
                            box.insertItems(value);

                            //restore children
                            _.arr.each(children,function(v){
                                box.append.apply(box,v);
                            });

                            //clear
                            temp.innerHTML='';

                            //set value
                            box.setValue(bv,true);

                            //resize
                            var size = o.getRoot().cssSize();
                            linb.UI.$tryResize(o, size.width, size.height);
                        }else
                            o.properties.items = _.copy(value);
                    });
                }
            }
        },
        EventHandlers:{
            beforePageClose:function(profile, item, src){},
            afterPageClose:function(profile, item){},
            onShowOptions:function(profile,item,e,src){},
            onItemSelected:function(profile, item, src){},
            onCaptionActive:function(profile, item, src){}
        },
        RenderTrigger:function(){
            var self=this,v,i,ins;
            // set default value
            if(v=self.properties.value){
                (ins=self.boxing()).setUIValue(v);
                if(i=self.getItemByItemId(v))
                    ins.onItemSelected(self, i);
            }
        },
        _getChildren:function(profile){
            if(!profile.properties.dynRender)
                return profile.children;
        },
        _prepareData:function(profile){
            var data = arguments.callee.upper.call(this, profile);
            data.panels = data.items;
            data.HAlign = 'text-align:'+data.HAlign+';';
            return data;
        },
        _prepareItem:function(profile, item){
            var dpn = 'display:none';
            item.closeDisplay = item.closeBtn?'':dpn;
            item.landDisplay = item.landBtn?'':dpn;
            item._opt = item.optBtn?'':dpn;
            item.href = item.href || linb.$href;
        },
        getDropKeys:function(profile,node){
            return profile.properties[profile.getKey(linb.use(node).id())==profile.keys.PANEL?'dropKeys':'dropKeysPanel'];
        },
        _showTips:function(profile, node, pos){
            var id=node.id,
                p=profile.properties,
                keys=profile.keys,
                key=profile.getKey(id);
            if(!id)return false;

            if(profile.onShowTips)
                return profile.boxing().onShowTips(profile, node, pos);
            else
                return arguments.callee.upper.apply(this,arguments);
        },
        //for tabs only
        _onresize:function(profile,width,height,force,key){
            var t=profile.properties,
                item = profile.getItemByItemId(key);
            if(!item)
                key=t.$UIvalue;
            item = profile.getItemByItemId(key);
            var o = profile.boxing().getPanel(key),
                l=profile.getSubNode('LIST'),
                forceH=0,
                listH;
            ;
            if(!o || o.isEmpty())return;

            //no height set
            if(!parseInt(profile.getRootNode().style.height))
                height=null;

            var wc=null,hc=null;
            if(force)item._w=item._h=null;
            if(width && item._w!=width){
                height=profile.getRootNode().offsetHeight || profile.getRoot().offsetHeight();
                forceH=1;
            }
            if((height && item._h!=height) || forceH){
                item._h=height;
                listH = l.get(0).offsetHeight ||
                    //for opear 9.0 get height bug, get offsetheight in firefox is slow
                    l.offsetHeight();

                height = height-listH+(linb.browser.ie6?2:1);
                if(height>0)hc=height;
            }
            if(listH)o.top(listH);
            //force to trigger onSze event, whatever width or height was changed.
            if(hc)o.height(hc).onSize();
        }
    }
});