Class('VisualJS.Designer', 'linb.Com',{
    Instance:{
        panelHeight:600,
        panelWidth:800,
        dropPosition:'absolute',
        dropOffset:10,

        events:{
            afterShow:function(page, threadid){

                var tbpath = 'img/designer/toolbar.gif',
                    tbk='$VisualJS.designer.tool.';

                //proxy region
                page.proxy = linb.create('<div style="position:absolute;border:dashed 1px blue;overflow:visible;left:-100px;top:-100px;z-index:1000"></div>');

                //resizer
                page.resizer = linb.create('Resizer',{
                    dragArgs:{
                        grid_width:this.dropOffset,
                        grid_height:this.dropOffset
                    },
                    zIndex:linb.dom.top_zIndex
                });
                page.resizer.host(page)
                .onItemsSelected(function(profile, ids){
                    this.pProfile.setSelectFromResizer.call(this.pProfile,ids);
                })
                .onActive(function(profile){
                    this._focus();
                })
                .onUpdate(function(profile, target, size, cssPos){
                    page._change();

                    var self=this;
                    if(target){
                        var b=false;
                        target.each(function(target){
                            target = linb([target],false);
                            var profile = linb.UIProfile.getFromDomId(target.get(0).id), widget=profile.boxing(),p = profile.properties, m = profile.box.getDataModel();
                            if(size){
                                var w=null,h=null;
                                if(size.width){
                                    if(p && !m.width){
                                        b=true;
                                    }else{
                                        switch(p.dock){
                                            case 'top':
                                            case 'bottom':
                                            case 'fill':
                                            case 'cover':
                                            case 'width':
                                                b=true;
                                                break;
                                            case 'left':
                                            case 'right':
                                            case 'height':
                                                b=true;
                                            default:
                                                target.widthBy(size.width,true);
                                                w = widget.refreshWidth();
                                            }
                                    }
                                }
                                if(size.height){
                                    if(p && !m.height){
                                        b=true;
                                    }else{
                                        switch(p.dock){
                                            case 'left':
                                            case 'right':
                                            case 'fill':
                                            case 'cover':
                                            case 'height':
                                                b=true;
                                                break;
                                            case 'top':
                                            case 'bottom':
                                            case 'width':
                                                b=true;
                                            default:
                                                target.heightBy(size.height,true);
                                                h = widget.refreshHeight();
                                        }
                                    }
                                }

                                self._sizeUpdated(target, { width :w, height :h});
                            }
                            if(cssPos){
                                var x=null,y=null;
                                if(cssPos.left){
                                    if(p && !m.left){
                                        b=true;
                                    }else{
                                        switch(p.dock){
                                        case 'top':
                                        case 'bottom':
                                        case 'left':
                                        case 'right':
                                        case 'fill':
                                        case 'cover':
                                        case 'width':
                                            b=true;
                                            break;
                                        case 'height':
                                            b=true;
                                        default:
                                            target.leftBy(cssPos.left);
                                            x = widget.refreshLeft();
                                        }
                                    }
                                }
                                if(cssPos.top){
                                    if(p && !m.top){
                                        b=true;
                                    }else{
                                        switch(p.dock){
                                        case 'left':
                                        case 'right':
                                        case 'top':
                                        case 'bottom':
                                        case 'fill':
                                        case 'cover':
                                        case 'height':
                                            b=true;
                                            break;
                                        case 'width':
                                            b=true;
                                         default:
                                            target.topBy(cssPos.top);
                                            y = widget.refreshTop();
                                        }
                                    }
                                }

                                self._posUpdated(target, {left :x, top :y});
                            }
                        });
                        if(b)profile.boxing().rePosSize();
                    }
                })
                .onFocusChange(function(profile, index){
                    if(this.tempSelected){
                        this.SelectedFocus=index;
                        _.resetRun('$profilegrid$', this._refreshProfileGrid,0,[this.tempSelected],this);
                    }
                })
                //select children even if parent is selected
                .onRegionClick(function(profile, e){
                    var ep=linb.event.getPos(e),arr,t,m,ret;
                    var fun=function(arr, ep, parent){
                        var me=arguments.callee,
                            m,rt,pos,w,h,
                            //mouse abs pos offset
                            epoff={},
                            //parent abs pos
                            ppos=parent.absPos(),
                            //parent size
                            rgw=parent.offsetWidth(),
                            rgh=parent.offsetHeight()
                            ;
                        epoff.left=ep.left-ppos.left;
                        epoff.top=ep.top-ppos.top;

                        arr.each(function(o){
                            if(m=o[0].root){
                                if(o[0].children.length)
                                    if(rt=me(o[0].children, ep, m))
                                        return false;
                                pos=m.absPos(null,parent);
                                w=m.offsetWidth();
                                h=m.offsetHeight();
                                if(epoff.left>pos.left && epoff.top>pos.top && epoff.left<pos.left+w && epoff.top<pos.top+h &&
                                   epoff.left<rgw&& epoff.top<rgh){
                                    rt=o[0].$id;
                                    return false;
                                }
                            }
                        });
                        return rt;
                    };
                    if(!(arr=this.tempSelected) || !arr.length)return;
                    arr.each(function(o){
                        t=linb.UIProfile.getFromCacheId(o);
                        ret=fun(t.children, ep, t.root);
                        if(ret)return false;
                    });
                    if(ret){
                        this.selectWidget([ret]);
                        return false;
                    }
                });

                //div for hold resizer and proxy
                page.holder = linb.create('<div style="display:none;"></div>');
                //not attach
                page.panelDiv.reBoxing().addLast(page.holder);
                page.holder.addLast(page.resizer);
                page.holder.addLast(page.proxy);

                page.proxy.get(0).zIndexIgnore=true;

                page.toolbar.setItems([{
                    id:'code',
                    sub:[
                    {
                        id : "format",
                        icon : CONF.img_app,
                        iconPos:"-32px -48px",
                        type : "button",
                        tips : tbk+'tocode'
                    },{
                        id : "json",
                        icon : CONF.img_app,
                        iconPos:"-128px -64px",
                        type : "button",
                        tips : tbk+'tojson'
                    }]},
                    {id:'align',
                    sub:[
                        {id:'left',caption:'',icon:tbpath,iconPos:'0 top', tips:tbk+'left'},
                        {id:'center',caption:'',icon:tbpath,iconPos:'-16px top',tips:tbk+'center'},
                        {id:'right',caption:'',icon:tbpath,iconPos:'-32px top',tips:tbk+'right'},
                        {id:'s1',type:'split'},
                        {id:'top',caption:'',icon:tbpath,iconPos:'-48px top',tips:tbk+'top'},
                        {id:'middle',caption:'',icon:tbpath,iconPos:'-64px top',tips:tbk+'middle'},
                        {id:'bottom',caption:'',icon:tbpath,iconPos:'-80px top',tips:tbk+'bottom'},
                        {id:'s2',type:'split'},
                        {id:'w',caption:'',icon:tbpath,iconPos:'-96px top',tips:tbk+'width'},
                        {id:'wh',caption:'',icon:tbpath,iconPos:'-112px top',tips:tbk+'wh'},
                        {id:'h',caption:'',icon:tbpath,iconPos:'-128px top',tips:tbk+'height'}
                    ]},
                    {id:'pos',
                    sub:[
                        {id:'zindex1',caption:'',icon:tbpath,iconPos:'-144px top',tips:tbk+'toplayer'},
                        {id:'zindex2',caption:'',icon:tbpath,iconPos:'-160px top',tips:tbk+'bottomlayer'},
                        {id:'s1',type:'split'},
                        {id:'repos',caption:'',icon:tbpath,iconPos:'-176px top',tips:tbk+'gridxy'},
                        {id:'resize',caption:'',icon:tbpath,iconPos:'-192px top',tips:tbk+'gridwh'},
                        {id:'s2',type:'split'},
                        {id:'clone',caption:'',icon:tbpath,iconPos:'-240px top',tips:tbk+'clone'}
                    ]},
                    {id:'del',
                    sub:[
                        {id:'delete',caption:'',icon:tbpath,iconPos:'-256px top', tips:tbk+'delete'}
                    ]}
                    ]
                );

                page.treebarCom
                .setItems(_.clone(CONF.widgets))
                .setCustomBehavior({
                    BAR:{
                        onMousedown : function(profile, e, src){
                            var id=src.id,
                                itemId = profile.getSubSerialId(id),
                                properties = profile.properties,
                                item = profile.getItemByDom(id),
                                pos=linb.event.getPos(e);

                            if(item.dragable){
                                profile.getSubNode('ICON', itemId).startDrag(e,{drop2:true, icon:linb.ini.path +'onDrag.gif', dragMode:'add', cursor:'pointer', target_left:pos.left+12,target_top:pos.top+12, move:false, key:item.dragKey || profile.properties.dragKey, data:{type:item.id, iconPos:item.iconPos}});
                                profile.removeTagClass('BAR','-mouseover',linb([src]));

                                page._clearSelect();
                                page._setSelected([], true);
                            }
                        }
                    }
                });

                //focus
                page.focusBtn = linb.create('<a href="javascript;" style="position:absolute;left:-10000px;top:-10000px;width:1px;height:1px;">o</a>');
                page.focusBtn.onKeydown(function(pro, e, src){
                    if(!page.resizer)return;

                    var key = linb.event.getKey(e),
                    k=key[0],
                    ctrl=key[1],
                    shift=key[2],
                    step=1,
                    o=page.resizer.reBoxing(),
                    profile = page.resizer.get(0),
                    cssPos=o.cssPos(),
                    cssSize=o.cssSize(),
                    gridh = profile.properties.dragArgs.grid_height,
                    gridw = profile.properties.dragArgs.grid_width
                    ;

                    var t,b=false,size=null,pos=null;

                    switch(k){
                        case 'up':
                            b=true;
                            if(ctrl)
                                step=-1;
                            else{
                                if(shift)
                                    step = (t=(cssPos.top+cssSize.height) % gridh)?-t:-gridh;
                                else
                                    step =(t = cssPos.top % gridh)?-t:-gridh;
                            }
                            if(shift){
                                o.heightBy(step);
                                profile.regions.heightBy(step);
                                size={ width :0, height :step};
                            }else{
                                o.topBy(step);
                                pos={left :0, top :step};
                            }
                            break;
                        case 'down':
                            b=true;
                            if(ctrl)
                                step=1;
                            else{
                                if(shift)
                                    step = (t=(cssPos.top+cssSize.height) % gridh)?gridh-t:gridh;
                                else
                                    step =(t = cssPos.top % gridh)?gridh-t:gridh;
                            }
                            if(shift){
                                o.heightBy(step);
                                profile.regions.heightBy(step);
                                size={ width :0, height :step};
                            }else{
                                o.topBy(step);
                                pos={left :0, top :step};
                            }
                            break;
                        case 'left':
                            b=true;
                            if(ctrl)
                                step=-1;
                            else{
                                if(shift)
                                    step = (t=(cssPos.left+cssSize.width) % gridw)?-t:-gridw;
                                else
                                    step =(t = cssPos.left % gridw)?-t:-gridw;
                            }
                            if(shift){
                                profile.regions.widthBy(step);
                                o.widthBy(step);
                                size={ width :step, height :null};
                            }else{
                                o.leftBy(step);
                                pos={left :step, top :0};
                            }
                            break;
                        case 'right':
                            b=true;
                            if(ctrl)
                                step=1;
                            else{
                                if(shift)
                                    step = (t=(cssPos.left+cssSize.width) % gridw)?gridw-t:gridw;
                                else
                                    step =(t = cssPos.left % gridw)?gridw-t:gridw;
                            }
                            if(shift){
                                o.widthBy(step);
                                profile.regions.widthBy(step);
                                size={ width :step, height :null};
                            }else{
                                o.leftBy(step);
                                pos={left :step, top :0};
                            }
                            break;
                        case 'delete':
                            page._deleteSelected();
                            page._focus();
                            break;
                        case 'esc':
                            page._clearSelect();
                            //reset
                            page._setSelected([], true);
                            break;
                    }
                    if(b){
                        profile.boxing().onUpdate(profile, profile._target, size, pos);
                        return false;
                    }
                }).
                onFocus(function(pro, e, src){
                    clearTimeout(page.timer);
                    page.resizer.active(false);
                }).
                onBlur(function(pro ,e , src){
                    page.timer = _.asyRun(function(){
                        if(page.resizer)page.resizer.inActive();
                    },200);
                });
                page.layoutBase.reBoxing().addFirst(page.focusBtn);


                page._enablePanelDesign(page.canvas.get(0));

                //set to default status
                page.setText(page.properties.text,true,threadid);
            },
            onSelected:function(page, profile, ids){
                var v=null, id = ids && ids[ids.length-1];
                if(id){
                    var o = linb.getObject(id);
                    if(o)
                        v = o;
                }
                page.listObject.setCtrlValue(v?v.alias:'page', true);

                _.resetRun('$profilegrid$', page._refreshProfileGrid,0,[ids],page);
            },
            onReady:function(page){
                //set canvas width, height
                page.canvas.setWidth(page.panelWidth).setHeight(page.panelHeight)
                page.panelBG.setWidth(page.panelWidth).setHeight(page.panelHeight)
            }
        },
        //dettach resizer and proxy from panel
        _detatchResizer:function(){
            var self=this;
            self.holder.addLast(self.resizer);
            self.holder.addLast(self.proxy);
            //clear those cache
            self.pProfile = self.pNode = null;
        },
        //attach resizer and proxy to panel
        _attachResizer:function(profile, node){
            var self=this;
            self.proxy.display('none');
            self.resizer.resetTarget(null,false);
            linb(node)
            .addLast(self.resizer)
            .addLast(self.proxy)
            ;
            //set markable var
            self.pProfile = profile;
            self.pNode = node;
            _.merge(self.resizer.get(0).properties.dragArgs,{
                grid_width:self.dropOffset,
                grid_height:self.dropOffset
            },'all');
        },
        //give focus
        _focus:function(){
            //avoid focus trigger scroll
//            this.focusBtn.top(this.panelDiv.reBoxing().scrollTop())
//            .left(this.panelDiv.reBoxing().scrollLeft());
            this.focusBtn.focus();
        },
        _setSelected:function(ids, flag){
            var self=this,
                tb=self.toolbar,
                t;
            ids=_.arr(ids);
            self.tempSelected = ids;
            self.SelectedFocus = ids.length-1;

            tb.disableGroup('align', ids.length>1?false:true);
            if(ids.length>0 && (t=linb.UIProfile.getFromCacheId(ids[0])))
                tb.disableGroup('pos', !t.box.hasDomRoot);
            else
                tb.disableGroup('pos', true);

            tb.disableGroup('del', ids.length>0?false:true);

            // fire event
            if(flag) self.events.onSelected.apply(self.parent, [self, self.pProfile, ids]);

            self._focus();

            return self;
        },
        _sizeUpdated:function(pro, size){
            var t,self=this;
            if(!(t=self.profileGrid.get(0).$widget))return;
            if(linb.UIProfile.getFromDomId(pro.get(0).id) == t.get(t.length()-1))
                _.asyRun(function(){
                    if(size.width!==null)
                    self.profileGrid.updateCellbyRowCol('properties:width','value',size.width,true)
                    if(size.height!==null)
                    self.profileGrid.updateCellbyRowCol('properties:height','value',size.height,true)
                    ;
                })
        },
        _posUpdated:function(pro, cssPos){
            var t,self=this;
            if(!(t=self.profileGrid.get(0).$widget))return;
            if(linb.UIProfile.getFromDomId(pro.get(0).id) == t.get(t.length()-1))
                _.asyRun(function(){
                    if(cssPos.left!==null)
                    self.profileGrid.updateCellbyRowCol('properties:left','value',cssPos.left,true)
                    if(cssPos.top!==null)
                    self.profileGrid.updateCellbyRowCol('properties:top','value',cssPos.top,true)
                    ;
                })
        },
        parseFun:function(txt){
            var str = txt;
            var reg = new RegExp("^(\\s*\\/\\*[^*@]*\\*+([^\\/][^*]*\\*+)*\\/\\s*)|^(\\s*\\/\\/[^\\n]*\\s*)");
            while(reg.test(str)){
                str = str.replace(reg,'');
            }
            str = str.replace(/\s*/,'');
            if(!str)return {comments:null, code:null};

            if (false === this.check(str.replace(/\s*$/,'')) ) return false;

            return {comments: '\n'+txt.replace(str,''), code:str.replace(/\s*$/,'')};
        },
        _designable : function(profile){
            var me=arguments.callee,
                self=this;
            //change
            self._giveHandler(profile);
            //give design mark
            profile.properties.$design=self.properties.$design;
            if(linb.cache.$dropPool[profile.box.KEY])
                self._enablePanelDesign(profile);
             if(profile.children && profile.children.length){
                profile.children.each(function(o){
                    me.call(self, o[0]);
                });
             }
             //for UI refresh itself
             profile.$addOns=function(profile){
                me.call(self,profile);
            };
        },

        _WidgetsSelected : function(ids){
            var self=this;
            this._setSelected(ids,true);
            this.iconlist.updateUIValue(null);
        },
        _clearSelect : function(profile){
            this.resizer.resetTarget(null,false);
            this._detatchResizer();
            this.iconlist.updateUIValue(null);
        },
        _deleteSelected : function(){
            if(!this.tempSelected || !this.tempSelected.length)return;
            var page = this;
            linb.UI.Dialog.confirm(linb.getRes('VisualJS.designer.confirmdel'),linb.getRes('VisualJS.designer.confirmdel2', this.tempSelected.length),function(){
                var sel = linb.UI.getByCacheId(page.tempSelected);
                if(!sel.isEmpty()){
                    var ids=[];
                    //destroy, and will dettach from parent
                    var ws = linb.UI.getByCacheId(page.tempSelected);
                    ws.each(function(o){
                        if(!o.box.hasDomRoot){
                            page.iconlist.removeItems(o.$id);
                        }
                    });

                    ws.destroy();
                }else{
                    var o = linb.getObject(page.tempSelected[0]);
                    if(o.box['linb.DataSource'])
                        page.iconlist.removeItems(page.tempSelected);
                    o.boxing().destroy();
                }
                //clear resizer
                page._clearSelect(page.pProfile);

                //fire event
                //page.onDeleted(page.pProfile, page.tempSelected);

                page._setSelected(null,true);
            });

        },
        _giveHandler:function(target){
            var prevent = function(){
                return;
            };
            var page=this;
            target.root.beforeClick(prevent).afterClick(prevent).onClick(function(pro, e, src){
                var esrc=linb.event.getSrc(e),
                    id=esrc.id,profile;
                    
                //if lang span, get parent id
                if(id==linb.langId)id=esrc.parentNode.id;

                if(linb.UIProfile.getFromDomId(id) !== (profile=linb.UIProfile.getFromDomId(src.id)))return;
                
                var t,key=linb.event.currentKey;

                if(!profile)return;
                //if change panel, clear the panel selected
                if(page.pProfile && (page.pProfile !=profile.parent))
                    page.pProfile.selected = [];

                if(t=profile.parent){
                    if(key && key[2])
                        t.reSelectObject.call(t,profile, profile.root.parent());
                    else
                        t.selectObject.call(t,profile, profile.root.parent());
                }
                return false;
            });
        },
        _enablePanelDesignFace:function(profile, key){
            //add a class panel
            profile.getSubNode(key,true).addClass('panel')
            .addEventHandler('drop')
            .addEventHandler('mousedown')
            .addEventHandler('click')
            .addEventHandler('drag')
            .addEventHandler('dragstop')
            .addEventHandler('mouseup');
        },
        _enablePanelDesign:function(profile){
            var t,key = profile.box.KEY,pool = linb.cache.$dropPool, page=this,h, k,
            self=this,
            cb={
                //overwrite
                beforeMouseover:function(profile, e, src){
                    var dd = linb.dragDrop, key = dd.dragKey, data = dd.data;

                    //not include the dragkey
                    if(!key
                    || !data
                    || !(new RegExp('\\b'+key+'\\b')).test(profile.box.getDropKeys(profile, this))

                    || data.parentId == profile.$id
                    || (data.data && data.data.exists(profile.$id))

                    || (profile.onDropTest && (false===profile.boxing().onDropTest(profile, key, data)))
                    )return;

                    //for trigger onDrop
                    dd._current=src;
                    //show region
                    _.resetRun('showDDMark', dd.showDDMark, 0, [this], dd);

                    var id = (id=profile.getItemByDom(src)) && id.id;
                    if(profile.onDragEnter)profile.boxing().onDragEnter(profile, e, this, id);
                },
                beforeDrop:function(profile, e, src){
                    self._change();

                    var target,
                        dropx=linb.dragDrop.x,
                        dropy=linb.dragDrop.y,
                        dragKey = linb.dragDrop.dragKey,
                        dragData = linb.dragDrop.dragData,
                        type=dragData.type,
                        iconPos = dragData.iconPos,
                        data=dragData.data,
                        pos=dragData.pos,

                        ids,
                        offset = self.dropOffset,

                        fun=function(){
                            var page=arguments.callee.page;
                            if(!linb.SC(type).hasDomRoot){
                                //give design mark
                                var o = linb.create(type, {$design:self.properties.$design}).get(0);
                                page.iconlist.insertItems([{id:o.$id, icon:'img/widgets.gif', iconPos:iconPos}],null,false);
                                page.iconlist.updateUIValue(o.$id);
                                //
                            }else{
                                //before drop check
                                //if(false===_.tryF(c.beforeAddWidget, [data], profile))return;

                                //check position
                                if(self.dropPosition=='absolute'){
                                    // get Pos
                                    var basePos = linb(src).absPos(),
                                    cssPos = {
                                        left : parseInt((dropx - basePos.left)/offset)*offset,
                                        top : parseInt((dropy - basePos.top)/offset)*offset
                                    };
                                    //give design mark
                                    target = new (linb.SC(linb.iBox.$type[type]))({$design:self.properties.$design});
                                    target.create();

                                    var p=target.get(0).properties;

                                    if(!p.$left)target.setLeft(['top','bottom','width','fill','cover'].exists(p.dock)?0:cssPos.left);
                                    if(!p.$top)target.setTop(['left','right','height','fill','cover'].exists(p.dock)?0:cssPos.top);
                                    if(!p.$position)target.setPosition('absolute');
                                    target.setZIndex(1);
                                }else{
                                    //give design mark
                                    target = new (linb.SC(linb.iBox.$type[type]))({$design:self.properties.$design});
                                    target.create();
                                }
                                var pro = target.get(0);

                                page._designable(pro);

                                pro._host=page;
                                // add default event handlers

                                var t=pro.box.$EventHandlers;
                                for(var i in t)
                                    pro[i]=t[i];

                                ids=[target['linb.iBox'] ? pro.$id : target.$id];

                                // add widgets to panel
                                //if(target['linb.UI'])linb.UI.canvas.prototype.attach.call(profile.boxing(), target);
                                if(target['linb.UI'])profile.boxing().attach(target, profile.getItemIdByDom(src));
                                //_.tryF(page.afterAddWidget, [target, profile.$id], page);

                                profile.setSelectFromPanel.call(profile, src, ids);
                                //refer dom node dir
                                src=null;
                            }
                        };
                        fun.page=page;
                    if(type){
                        if(linb.SC.evalPath(type)){
                            fun();
                        }else{
                            linb.dom.UIAction(function(){
                                linb.dom.setCover(linb.getRes('VisualJS.designer.loading') + type);
                                linb.SC(type, true, fun);
                            });
                        }
                    }else{
                        var basePos = linb(src).absPos(),
                        cssPos = {
                            left : parseInt((dropx - basePos.left)/offset)*offset,
                            top : parseInt((dropy - basePos.top)/offset)*offset
                        };
                        var t;
                        ids=data;
                        target = linb.UI.getByCacheId(ids);

                        var minx,miny;
                        target.each(function(o,i){
                            if(i===0){
                                minx = o.properties.left;
                                miny = o.properties.top;
                            }else{
                                minx = Math.min(o.properties.left,minx);
                                miny = Math.min(o.properties.top,miny);
                            }
                        });
                        target.each(function(o){
                            if(o.properties.dock!='none')o.box.dock(o,true);
                            else{
                                o.boxing()
                                .setLeft(o.properties.left - minx + cssPos.left)
                                .setTop(o.properties.top - miny + cssPos.top);
                            }
                        });

                        // add widgets to panel
                        profile.boxing().attach(target, profile.getItemIdByDom(src));
                        //_.tryF(page.afterMoveWidget, [target, profile.$id], page);

                         profile.setSelectFromPanel.call(profile, src, ids);
                    }
                },
                onMousedown:function(profile, e, src){
                    if(linb.event.getSrc(e) !== src)return;
                    var o =linb(src),
                    pos = linb.event.getPos(e),
                    absPos=o.absPos(),
                    w = o.clientWidth(),
                    h = o.clientHeight();
                    //in the scroll bar
                    if(pos.left-absPos.left>w)return;
                    if(pos.top-absPos.top>h)return;

                    // keep pos
                    profile._offsetPos = absPos;
                    profile._scrollTop = o.scrollTop();
                    profile._scrollLeft = o.scrollLeft();

                    page._attachResizer(profile, src);
                    profile._selregion = {};

                    var pos = linb.event.getPos(e);
                    linb(src).startDrag(e,{move:false,type:'blank',cursor:'crosshair',target_left:pos.left,target_top:pos.top,defer:1});
                    profile.$dragging=false;
                },
                onClick:function(profile, e, src){
                    if(linb.event.getSrc(e) !== src)return;
                    self._clearSelect(profile);
                    profile.setSelectFromPanel.call(profile, this, []);
                },
                beforeDrag:function(profile, e, src){
                    var t, dd =linb.dragDrop, pos = dd.getOffset(),
                    proxy=page.proxy;

                    var region = profile._selregion;
                    if((t=pos.x)<0)pos.x=-t;
                    if((t=pos.y)<0)pos.y=-t;

                    region.left=Math.min(dd.ox,dd.x) - profile._offsetPos.left + profile._scrollLeft;
                    region.top=Math.min(dd.oy,dd.y) - profile._offsetPos.top + profile._scrollTop;
                    region.width=pos.x;
                    region.height=pos.y;

                    proxy.setRegion(region);

                    if(!profile.$dragging){
                        proxy.display('block');
                        profile.$dragging = true;
                    }
                },
                beforeDragstop:function(profile, e, src){
                    //if(!profile._selregion)return;
                    var region = profile._selregion,
                    proxy=page.proxy,

                    selected=[],t,m,o,x1,y1,x2,y2,xx1,yy1,xx2,yy2,
                    self=this
                    ;

                    xx1 = region.left;
                    yy1 = region.top;
                    xx2 = xx1 + region.width;
                    yy2 = yy1 + region.height;
                    if(m=profile.children){
                        m.each(function(v,i){
                            v=v[0];
                            if(v.domNode.parentNode===self && v.domNode.style.display!='none' && v.domNode.style.visibility!='hidden'){
                                o=v.root;
                                x1= o.offsetLeft();
                                y1= o.offsetTop();
                                x2 = x1 + o.width();
                                y2 = y1 + o.height();
                                //in the region
                                if(xx2>x1 && x2>xx1 && yy2>y1 && y2>yy1)selected.push(v.$id);
                            }
                        });
                        //reset/cache proxy
                        profile.setSelectFromPanel.call(profile, this, selected);
                    }
                    //for firefox cursor bug
                    _.asyRun(function(){
                        proxy.display('none');
                    });
                },
                onMouseup:function(profile, e, src){
                    _.asyRun(function(){
                        page.proxy.display('none');
                    });
                }
            };

            //drop key
            var a = profile.properties.dropKeys.split(/[^\w]+/);
            a.filter(function(o){
                return !!o;
            });
            if(a.indexOf('iDesign')==-1)
                a.push('iDesign');
            profile.properties.dropKeys=a.join(':');


            if(t=pool[key]){
                //t.each(function(i){
                var i=t[0];
                    if(profile.keys.KEY == profile.keys[i])
                        h=cb;
                    else{
                        h={};
                        h[i]=cb;
                    }
                    //profile.boxing().setCustomBehavior(h);
                    profile._CB=h;
                    profile.resetCache();

                    page._enablePanelDesignFace(profile, i)
                //});
            }

            _.merge(profile,{
                selectObject:function(obj,node){
                    var profile = this,
                    id=obj.$id;
                    return this.setSelectFromPanel(node, [id]);
                },
                reSelectObject:function(obj, node){
                    var profile = this;
                    id=obj.$id;
                    if(profile.selected && profile.selected.exists(id)){
                        profile.selected.removeValue(id);
                    }else{
                        (profile.selected ||(profile.selected=[])).push(id);
                    }
                    return this.setSelectFromPanel(node, profile.selected);
                },
                setSelectFromResizer:function(ids){
                    var profile = this;
                    profile.selected = ids;
                    return this.resetSelectRel();
                },
                setSelectFromPanel:function(node, ids){
                    var profile = this;
                    //attach resizer
                    if(self.pProfile !== profile ||
                        self.pNode !== node){
                        self._clearSelect(profile);
                        self._attachResizer(profile, node);
                    }

                    profile.selected = ids;
                    self.resizer.resetTarget(linb.UI.getByCacheId(profile.selected).reBoxing(), false);
                    return this.resetSelectRel();
                },
                resetSelectRel:function(){
                    var profile = this;
                    if(profile.selected && profile.selected.length){
                        var t=self.resizer.get(0).properties;
                        t.dragArgs={
                            key:'iDesign',
                            grid_width:self.dropOffset,
                            grid_height:self.dropOffset,
                            data:{
                                parentId:profile.$id,
                                data:profile.selected
                            }
                        };
                    }else{
                        self._clearSelect(profile);
                    }
                    _.tryF(self._WidgetsSelected,[profile.selected],self);

                    self._focus();
                }
            },'all');


        },
        _refreshProfileGrid:function(ids){
            var page=this;
            //delete grid first
            this.profileGrid.resetContent();
            if(!ids || !ids.length){
                var pro = this.canvas.get(0);
                var arr=[];
                var eh = _.get(this.properties.clsObject,['Static','EventHandlers']);
                if(!eh)eh=linb.Com.EventHandlers;
                var em=_.get(this.properties.clsObject,['Instance','events']);
                var getCode=function(o){
                    var code;

                    var em = _.get(o.clsStruct,['sub','Instance', 'sub','events', 'code']);
                    if(em)em=_.unserialize(em);else em={};

                    var funName = em[o.funName] || ('_'+o.funName.toLowerCase());
                    var item = _.get(o.clsStruct, ['sub','Instance', 'sub', funName]);
                    var comments = (item? (item.comments || '') :'');
                    if(comments)comments = comments.replace(/^[\r\n]*/, '');

                    //if em exists
                    if(item&&item.code){
                        code = item&&item.code;
                        o.mapName=em[o.funName];
                    //if em doesn't exist
                    }else{
                        if(!o.ini)return '';

                        code = ' '.repeat(8) + o.ini.toString().replace(/\n/g,'\n'+' '.repeat(8));

                        //new em
                        o.mapName = '_'+o.funName.toLowerCase();
                        //avoid name conflict
                        var pool = _.get(o.clsStruct, ['sub','Instance', 'sub']);
                        if(pool[o.mapName]){
                            var i=1,t;
                            while(pool[t=o.mapName+'_'+(++i)]){}
                            o.mapName=t;
                        }
                    }

                    return comments+code;
                };
                _.each(eh,function(o,i){
                    var $fun = function(profile, cell){
                        var o = cell.$tagVar;
                        var node = profile.getSubNode('CELL', cell._serialId);
                        linb.ComFactory.newCom('VisualJS.ObjectEditor',function(){
                            this.host = page;
                            this.setProperties({
                                icon:CONF.img_app,
                                iconPos:'-32px -32px',
                                text: getCode(o),
                                caption:o.widgetName+" => "+o.funName,
                                fromRegion:node.getRegion(true),
                                tagVar:o,
                                onOK:function(page){
                                    this._change();
                                    var tagVar = page.properties.tagVar;
                                    if(page.properties.result.code!==null){
                                        _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'code'], page.properties.result.code);
                                        _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'comments'], page.properties.result.comments);

                                        profile.box.changeCellValue(profile, cell, tagVar.mapName,true);
                                    }else{
                                        _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'code'], null);
                                        _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'comments'], null);

                                        var em = _.get(tagVar.clsStruct,['sub','Instance', 'sub','events', 'code']);
                                        if(em){
                                            em=_.unserialize(em);
                                            delete em[tagVar.funName];
                                            _.set(tagVar.clsStruct,['sub','Instance', 'sub','events', 'code'], _.serialize(em));
                                        }

                                        profile.box.changeCellValue(profile, cell,'',true);
                                    }
                                    node.focus();
                                }
                            });
                            this.show(linb([document.body]));
                        });

                    },
                    $tagVar = {
                         widgetName: 'page',
                         obj : this.properties.clsObject,
                         clsStruct: this.properties.clsStruct,
                         clsObject: this.properties.clsObject,
                         funName: i,
                         mapName:(em&&em[i])||'',
                         ini:o
                    };
                    arr.push({id:'event:'+i, cells:[
                        {value:i, type:null, $tagVar: null, event:null },
                        {value:(em&&em[i])||'', type:'popbox', $tagVar:$tagVar, event:$fun}]
                    });
                },this);
                var rows=[
                    {id:'alias',           cells:[{value:'alias', type:'label'},{value: "page", type:'label'}] },
                    {id:'domId',           cells:[{value:'domId', type:'label'},{value: "*", type:'label'}] },
                    {id:'properties:width', cells:[{value:'width',type:'label'}, {value: pro.properties.width, type:''}] },
                    {id:'properties:height',cells:[{value:'height', type:'label'}, {value: pro.properties.height, type:''}] },
                    {id:'UIE', cells:[{value:'events',type:'label'}, {value:'', type:'label'}], sub: arr}
                ];
                var list=[];

                this.profileGrid.insertRows(rows);
                this.profileGrid.get(0).$widget=this.canvas;
            }else{
                var t,len,uis = linb.UI.getByCacheId(ids);
                //if exists, give grid info
                if(len = uis.length()){
                    var pro = uis.get(this.SelectedFocus);
                    var cache =[0,0,0,0,0,0,0,0],
                    cache2=0;

                    var $fun = function(profile, cell){
                        var o = cell.$tagVar;
                        var node = profile.getSubNode('CELL', cell._serialId);
                        var obj =o.profile[o.name];
                        linb.ComFactory.newCom('VisualJS.ObjectEditor',function(){
                            this.host = page;
                            this.setProperties({
                                caption:o.widgetName+" => "+o.name,
                                icon:CONF.img_app,
                                iconPos:obj.constructor==Array?'-128px -32px':'-16px -32px',
                                text:linb.coder.decode(
                                    _.serialize(
                                        linb.UI.pickObj( obj )
                                    )
                                ),
                                fromRegion:node.getRegion(true),
                                tagVar:o,
                                onOK:function(page){
                                    this._change();
                                    var tagVar = page.properties.tagVar;
                                    tagVar.profile.boxing()[tagVar.funName](page.properties.object);
                                    node.focus();
                                }
                            });
                            this.show(linb([document.body]));
                        });
                    };

                    var rows=[
                            {id:'key', cells:[{value:'class', type:'label'},{value:'<strong>'+pro.key+'</strong>',type:'label'}] },
                            {id:'alias',cells:[{value:'alias', type:'label'},{value:pro.alias, type:''}] },
                            {id:'domId',cells:[{value:'domId', type:'label'},{value:pro.domId, type:''}] },
                            {id:'template',     cells:[{value:'template', type:''}, {value:pro.template._id, type:'listbox', listKey: pro.box.KEY+':template'}] },
                            {id:'appearance',   cells:[{value:'appearance',type:''},{value:pro.appearance, type: 'listbox', listKey: pro.box.KEY+':appearance'}]},
                            {id:'behavior',     cells:[{value:'behavior', type:''},{value: pro.behavior._id, type:'listbox', listKey:pro.box.KEY+':behavior'}]},
                            {id:'properties',   cells:[{value:'properties',type:'label'},{value:'', type:'label'}], sub:[]},
                            {id:'UIE', cells:[{value:'events',type:'label'}, {value:'', type:'label'}], sub:[]},
                            {id:'CA',cells:[{value:'Custom Appearances', type:'label'},{value:'(Collection)', event:$fun, $tagVar:{
                                name:'CA',
                                funName:'setCustomAppearance',
                                profile:pro
                            }, type:'popbox:readonly'}] },
                            {id:'CC',cells:[{value:'Custom Class', type:'label'},{value:'(Collection)', event:$fun, $tagVar:{
                                name:'CC',
                                funName:'setCustomClass',
                                profile:pro
                            }, type:'popbox:readonly'}] },
                            {id:'CB',cells:[{value:'Custom Behaviors', type:'label'},{value:'(Collection)', event:$fun, $tagVar:{
                                name:'CB',
                                funName:'setCustomBehavior',
                                profile:pro
                            }, type:'popbox:readonly'}] },
                            {id:'CF',cells:[{value:'Custom Functions', type:'label'},{value:'(Collection)', event:$fun, $tagVar:{
                                name:'CF',
                                funName:'setCustomFunction',
                                profile:pro
                            }, type:'popbox:readonly'}] }
                    ];

                    var arr= [],map=CONF.mapWidgets[pro.box.KEY];
                    t = map && map.Templates;//_.toArr(pro.box.$Templates,true);
                    if(!t)t=[];
                    if(!t.exists('default'))t.insertAny('default',0);
                    t.each(function(o){
                         arr.push({id:o,caption:o,value:o});
                    });
                    linb.UI.setCacheList(pro.box.KEY+':template', arr);
                    arr= [];
                    t = map && map.Appearances;//_.toArr(pro.box.$Appearances,true);
                    if(!t)t=[];
                    if(!t.exists('default'))t.insertAny('default',0);
                    t.each(function(o){
                         arr.push({id:o,caption:o,value:o});
                    });
                    linb.UI.setCacheList(pro.box.KEY+':appearance', arr);
                    arr= [];
                    t = map && map.Behaviors;//_.toArr(pro.box.$Behaviors,true);
                    if(!t)t=[];
                    if(!t.exists('default'))t.insertAny('default',0);
                    t.each(function(o){
                         arr.push({id:o,caption:o,value:o});
                    });
                    linb.UI.setCacheList(pro.box.KEY+':behavior', arr);
                    arr= [];

                    //get properties
                    uis.each(function(t,i){
                        if(i===len-1)return;
                        if(!cache[0] && t.key != pro.key){
                            cache[0]=1;
                            cache2++;
                        }
                        if(!cache[1]){
                            rows[1].cells[1].type='label';
                            cache[1]=1;
                            cache2++;
                        }
                        if(!cache[2] && t.template._id != pro.template._id){
                            rows[2].cells[1].type='label';
                            cache[2]=1;
                            cache2++;
                        }
                        if(!cache[3] && t.appearance != pro.appearance){
                            rows[3].cells[1].type='label';
                            cache[3]=1;
                            cache2++;
                        }
                        if(!cache[4] && t.behavior._id != pro.behavior._id){
                            rows[4].cells[1].type='label';
                            cache[4]=1;
                            cache2++;
                        }
                        if(!cache[5]){
                            rows[5].cells[1].type='label';
                            cache[5]=1;
                            cache2++;
                        }
                        //all *ed
                        if(cache2==6)return false;
                    });
                    this.profileGrid.insertRows(rows);

                    //set target
                    this.profileGrid.get(0).$widget=uis;

                }else{
                    uis = linb.Base.getByCacheId(ids[0]);
                    pro = uis.profile;

                    var rows=[
                            {id:'key',  cells:[{value:'class',type:'label'},{value: pro.key, type:'label'}] },
                            {id:'alias', cells:[{value:'alias', type:'label'},{value:pro.alias, type:''}] },
                            {id:'domId', cells:[{value:'domId', type:'label'},{value:pro.domId, type:''}] },
                            {id:'properties', cells:[{value:'properties',type:'label'},{value:'', type:'label'}], sub:[]},
                            {id:'UIE',  cells:[{value:'events',type:'label'},{value:'', type:'label'}], sub:[]}
                    ];
                    this.profileGrid.insertRows(rows);

                    this.profileGrid.get(0).$widget=uis;
                }
            }
        },
        _change:function(){
            this._dirty=true;
            _.tryF(this.events.onValueChanged, [this, null, this._dirty], this.host);
        },

        //avoid to conflict with design code
        $toolbar_onclick:function(profile, id, groupid, src){
            var page = this;
            switch(groupid){
                case 'code':
                    switch(id){
                        case 'format':
                        case 'json':
                            linb.dom.UIAction(function(){
                    	        var dialog = new linb.UI.Dialog();
                    	        dialog.setLeft(100).setTop(100).setWidth(300).setHeight(200).setStatus('max').setMinBtn(false).setMaxBtn(false).setCaption('Formatted code');
                    	        dialog.create();
                    	        var t,nodes;
                    	        if(page.tempSelected && page.tempSelected.length){
                    	            nodes=[];
                    	            page.tempSelected.each(function(i){
                    	                nodes.push(linb.Profile.getFromCacheId(i));
                    	            });
                    	        }else
                    	            nodes = page.getWidgets();

                                var code;
                                switch(id){
                                    case 'format':
                                        code=linb.coder.parse(page.getJSCode(nodes),'js',['plain']);
                                        break;
                                    case 'json':
                                        code=linb.coder.format(page.getJSONCode(nodes),'js',['plain']);
                                        break;
                                }
                    	        dialog.html(code);
                    	        dialog.show(linb(document.body), true);
                    	    });
                    	break;
                    }
                    break;
                case 'align':
                    this._change();
                    var sel = linb.UI.getByCacheId(this.tempSelected);
                    var p = sel.get(this.SelectedFocus),
                        o=p.root,
                        size=o.cssSize(),
                        pos=o.cssPos();
                    sel.each(function(o){
                        if(o.locked)return;
                        var node = o.root;
                        switch(id){
                            case "left":node.left(pos.left);o.boxing().refreshLeft();break;
                            case "center":node.left(pos.left + size.width/2 - node.width()/2);o.boxing().refreshLeft();break;
                            case "right":node.left(pos.left + size.width - node.width());o.boxing().refreshLeft();break;
                            case "top":node.top(pos.top);o.boxing().refreshTop();break;
                            case "middle":node.top(pos.top + size.height/2 - node.height()/2);o.boxing().refreshTop();break;
                            case "bottom":node.top(pos.top + size.height - node.height());o.boxing().refreshTop();break;

                            case 'w':node.width(size.width);o.boxing().refreshWidth();break;
                            case 'wh':node.width(size.width).height(size.height);o.boxing().refreshWidth();o.boxing().refreshHeight();break;
                            case 'h':node.height(size.height);o.boxing().refreshHeight();break;
                        }
                    });
                    this.resizer.rePosSize();
                    this._focus();
                    break;
                case 'pos':
                    this._change();

                    var sel = linb.UI.getByCacheId(this.tempSelected);

                    var page=this;
                    if('clone'==id){
                        var ids=[];
                        var t,ids=[],pid;
                        //get source
                        var src = linb.UI.getByCacheId(this.tempSelected);
                        //clone and added to its' parent
                        var tar = src.clone();

                        src.get(0).parent.boxing().attach(tar);

                        pid=src.get(0).parent.$id;
                        //get ids
                        tar.each(function(o){
                            ids.push(o.$id);
                        });
                        //fire event
                        //_.tryF(this.afterAddWidget, [tar, pid], this);

                        tar.each(function(o){
                            page._designable(o);
                        });

                        //set to resizer
                        this.resizer.resetTarget(linb(tar));

                        linb.message(linb.getRes('VisualJS.designer.colneOK', ids.length));
                        //set selected
                        //this._setSelected(null,true)._setSelected(ids, true);
                        return;
                    }
                    var zIndex=0;
                    sel.each(function(o){
                        var ins = o.boxing();
                        var node=ins.reBoxing();

                        switch(id){
                            case "zindex1":
                                if(o.locked)return;
                                if(!zIndex)
                                    zIndex = node.topZindex();
                                node.zIndex(zIndex+1);
                                ins.refreshZIndex();
                                break;
                            case "zindex2":
                                if(o.locked)return;
                                node.zIndex(0);
                                ins.refreshZIndex();
                                break;
                            case "repos":
                            case "resize":
                                if(o.locked)return;
                                var l=node.left(),
                                    t=node.top(),
                                    offset = page.dropOffset;

                                node.left(parseInt(l/offset)*offset)
                                .top(parseInt(t/offset)*offset);
                                if(id=='resize'){
                                    var w=node.width(),
                                        h=node.height();
                                    node.width((parseInt((w+offset-1)/offset))*offset)
                                    .height((parseInt((h+offset-1)/offset))*offset)
                                }
                                page.resizer.rePosSize();
                                ins.refreshLeft();
                                ins.refreshTop();
                                ins.refreshWidth();
                                ins.refreshHeight();
                                break;
                        }
                    });
                    this._focus();
                    break;
                case 'del':
                    this._change();
                    if('delete'==id)this._deleteSelected();

                break;
            }

        },

        $profilegrid_afterrowactive:function(profile, row){
             profile.box.editCellbyRowCol(profile, row.id, 'value');
             return false;
        },
        $profilegrid_beforevalueupdated: function(profile, cell, ov, nv){
             this._change();
             var page = this;
             try{
                //get properties
                var attr,t,type,funName,property,value,target=profile.$widget;
                value=nv;
                if((attr = cell._row.id.split(':')).length>1){
                    type=attr[0];
                    property=attr[1];
                }else{
                    property=cell._row.id;
                }
                //run
                switch(type){
                    case 'properties':
                        funName = 'set' + property.initial();
                        //for canvas
                        if(target.get(0) == this.canvas.get(0)){
                            this.canvas[funName](value);
                            this.panelBG[funName](value);
                        }else{
                            target.each(function(o){
                                o.boxing()[funName](value);
                            });
                            if(['left','top','width','height','right','bottom','dock','dockOrder'].exists(property))
                                this.resizer.rePosSize();
                        }
                        break;
                    case 'event':
                        if(target.get(0) == this.canvas.get(0)){
                            if(nv){
                                var em = _.get(page.properties.clsStruct,['sub','Instance', 'sub','events', 'code']);
                                if(em)em=_.unserialize(em);else em={};
                                em[property] = nv;
                                _.set(page.properties.clsStruct,['sub','Instance', 'sub','events', 'code'], _.serialize(em));
                                _.set(page.properties.clsStruct,['sub','Instance', 'sub','events', 'comments'],
                                    _.get(page.properties.clsStruct,['sub','Instance', 'sub','events', 'comments'] || '\n'+' '.repeat(8)));

                                _.set(page.properties.clsObject,['Instance','events', property], nv);
                            }

                        }else
                            target.each(function(o){
                                if(nv){
                                    o[property]=nv;
                                    //nv=... from clsStruct
                                    _.set(page.properties.clsObject,['Instance', property], nv);
                                }else
                                    delete o[property];
                            });
                        break;
                    default:
                        if(property=='domId'){
                            //you can modify domId to original one
                            if(target.get(0).$domId!=value && !/^[\w]*$/.test(value)){
                                linb.message(linb.getRes('VisualJS.designer.domIdValid',value));
                                return false;
                            }
                            //if empty, return to original name
                            if(String(value).trim()==''){
                                value=target.get(0).$domId;
                                _.asyRun(function(){
                                    profile.box.changeCellValue(profile, cell,value,true);
                                });
                                return false;
                            }
                            //if set to original name, not check dom again
                            if(target.get(0).$domId!=value && linb.dom.byId(value)){
                                linb.message(linb.getRes('VisualJS.designer.domIdExists',value));
                                return false;
                            }
                            this.listObject.setCtrlValue(value,true);
                            target.setDomId(value);
                        }else{
                            if(property=='alias'){
                                var hash = this.getNames();
                                if(hash[value]){
                                    linb.message(linb.getRes('VisualJS.designer.nameExists',value));
                                    return false;
                                }
                                this.listObject.setCtrlValue(value,true);
                            }
                            target[property](value);
                        }
                }
             }catch(e){
                throw(e);
                return false;
             }
        },
        $profilegrid_onrequestdata: function(profile, item, threadId){
            var cv,arr=[],t,page=this,
                id=item.id,
                deeppage=this,
                uis = profile.$widget, len=uis.length();

            //get the last one first
            var target = uis.get(len-1), dm=target.box.$DataModel, format, listKey, list, $tag,$fun,$tagVar, value;
            //for properties
            if(id=='properties'){
                _.each(target.box.$DataStruct,function(o,i){
                     if(['_','$'].exists(i.charAt(0))) return;
                    if(dm[i].hidden) return;

                    list=null;

                     $tag='';
                     cv='';
                    //filter
                    if(dm[i].readonly){
                        listKey='';
                        type='label';
                    }else if(dm[i].listbox){
                        type='listbox';
                        list=[];
                        listKey = target.key+":"+"properties"+":"+i;
                        if(_.isFun(dm[i].listbox)){
                            var d = dm[i].listbox;
                            list = function(){
                                var a = d.call(target),list=[];
                                a.each(function(o){
                                    list.push({id:o, caption:o, value:o})
                                });
                                return list;
                            };
                        }else if(_.isObj(dm[i].listbox[0]))
                            list = dm[i].listbox.copy();
                        else
                            dm[i].listbox.each(function(o,i){
                                list.push({id:o, caption:o})
                            });
                        linb.UI.setCacheList(listKey, list);
                    }else if(dm[i].combobox){
                        type='combobox';
                        list=[];
                        if(_.isFun(dm[i].combobox)){
                            var d = dm[i].combobox;
                            list = function(){
                                var a = d.call(target),list=[];
                                a.each(function(o){
                                    list.push({id:o, caption:o})
                                });
                                return list;
                            };
                        }else{
                            if(_.isObj(dm[i].combobox[0]))
                                list= dm[i].combobox.copy();
                            else
                                dm[i].combobox.each(function(o,i){
                                    list.push({id:o, caption:o})
                                });
                        }
                        listKey = target.key+":"+"properties"+":"+i;
                        linb.UI.setCacheList(listKey, list);
                    }else if(dm[i].helpinput){
                        listKey = target.key+":"+"properties"+":"+i;
                        type='helpinput';
                        list= dm[i].helpinput.copy();
                        linb.UI.setCacheList(listKey, list);
                    }else if(dm[i].trigger){
                        listKey='';
                        type='getter';
                        value=i;
                        $fun = function(profile, cell, pro){
                            var o = cell.$tagVar;
                            var f = o.profile.boxing()['trigger'+o.name.initial()];
                            _.tryF(f,null,o.profile.boxing());

                            var v='try again';
                            pro.boxing().updateUIValue(v);
                            profile.box.changeCellValue(profile, cell,v,true);
                        };
                        $tagVar = {
                            profile: target,
                             name:i
                        };
                    }else if(_.isBool(o)){
                        listKey='';
                        type='checkbox';
                        $tag = i;
                    }else if(_.isObj(o)){
                        listKey='';
                        type='popbox:readonly';
                        //keep object
                        $tag = null;

                        //for object edit
                        $fun = function(profile, cell){
                            var o = cell.$tagVar;
                            var node = profile.getSubNode('CELL', cell._serialId);
                            var obj =o.profile.boxing()['get'+o.name.initial()]();
                            linb.ComFactory.newCom('VisualJS.ObjectEditor',function(){
                                this.host = page;
                                this.setProperties({
                                        caption:o.widgetName+" => "+o.name,
                                        icon:CONF.img_app,
                                        iconPos:obj.constructor==Array?'-128px -32px':'-16px -32px',
                                        text:linb.coder.decode(
                                            _.serialize(
                                                linb.UI.pickObj( obj )
                                            )
                                        ),
                                        fromRegion:node.getRegion(true),
                                        tagVar:o,
                                        onOK:function(page){
                                            this._change();
                                            var t,tagVar = page.properties.tagVar;
                                            tagVar.profile.boxing()['set'+o.name.initial()](page.properties.object);

                                            if(['dockMargin'].exists(o.name))
                                                deeppage.resizer.rePosSize();

                                            node.focus();

                                            //for new panel
                                            //not consider that multi keys in a widget can have different drop function
                                            if(o.name=='items'){
                                                if(null===page.properties.object)
                                                    tagVar.profile.boxing().setItems([]);

                                                if(t=linb.cache.$dropPool[tagVar.profile.box.KEY]){
                                                    //t.each(function(i){
                                                        var i=t[0];
                                                        deeppage._enablePanelDesignFace(tagVar.profile, i);
                                                    //});
                                                 }
                                            }

                                        }
                                });
                                this.show(linb([document.body]));
                            });
                        };
                        $tagVar = {
                             widgetName:target.alias,
                             profile: target,
                             name:i
                        };
                        cv='(Collection)';
                    }else{
                        listKey='';
                        type='';
                    }
                    cv = cv || target.properties[i];
                    if(_.isStr(cv)){
                        //cv=_.serialize(cv);
                        //for serialized string
                        //cv = cv.replace(/^\"/,'').replace(/\"$/,'');
                    }

                    arr.push({id:'properties:'+i, cells:[
                        {value:i,  type:''     , $tag:'' , event:''   , $tagVar:''      ,  listKey:''},
                        {value:cv, type:type , $tag:$tag,event:$fun , $tagVar:$tagVar,  listKey:listKey}
                    ]});
                });
            }
            arr.sort(function(x,y){
                x=x.cells[0].value;y=y.cells[0].value;
                return x>y?1:x==y?0:-1;
            });
            //for events
            if(id=='UIE'){
                var getCode=function(o){
                    var code;
                    //get from profile:o.profile[o.funName]
                    var funName = typeof o.profile[o.funName] == 'string'? o.profile[o.funName] : ('_'+o.widgetName.toLowerCase()+'_'+o.funName.toLowerCase());
                    var item = _.get(o.clsStruct, ['sub','Instance', 'sub', funName]);
                    var comments = (item? (item.comments || '') :'');
                    if(comments)comments = comments.replace(/^[\r\n]*/, '');

                    //if em exists
                    if(item&&item.code){
                        code = item&&item.code;
                        o.mapName=funName;
                    //if em doesn't exist
                    }else{
                        code = ' '.repeat(8) + o.ini.toString().replace(/\n/g,'\n'+' '.repeat(8));

                        //new em
                        o.mapName = '_'+o.widgetName.toLowerCase()+'_'+o.funName.toLowerCase();
                        //avoid name conflict
                        var pool = _.get(o.clsStruct, ['sub','Instance', 'sub']);
                        if(pool[o.mapName]){
                            var i=1,t;
                            while(pool[t=o.mapName+'_'+(++i)]){}
                            o.mapName=t;
                        }
                    }

                    return comments+code;
                };
                //for object edit
                $fun = function(profile, cell){
                    var o = cell.$tagVar;
                    var node = profile.getSubNode('CELL', cell._serialId);
                    linb.ComFactory.newCom('VisualJS.ObjectEditor',function(){
                        this.host = page;
                        this.setProperties({
                            icon:CONF.img_app,
                            iconPos:'-32px -32px',
                            caption:o.widgetName+" => "+o.funName,
                            text: getCode(o),
                            fromRegion:node.getRegion(true),
                            tagVar:o,
                            onOK:function(page){
                                this._change();
                                var tagVar = page.properties.tagVar;
                                if(page.properties.result.code!==null){
                                    _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'code'], page.properties.result.code);
                                    _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'comments'], page.properties.result.comments);

                                    tagVar.profile[tagVar.funName] = tagVar.mapName;
                                    profile.box.changeCellValue(profile, cell,tagVar.mapName,true);
                                }else{
                                    _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'code'], null);
                                    _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'comments'], null);

                                    tagVar.profile[tagVar.funName] = tagVar.profile.box.$EventHandlers[tagVar.funName];
                                    profile.box.changeCellValue(profile, cell, '',true);
                                }
                                node.focus();
                            }
                        });
                        this.show(linb([document.body]));
                    });

                };

                _.each(target.box.$EventHandlers,function(o,i){
                    $tagVar = {
                         profile: target,
                         clsStruct: page.properties.clsStruct,
                         widgetName: target.alias,
                         funName: i,
                         ini:o
                    };
                    arr.push({id:'event:'+i, cells:[
                        {value:i, type:null, $tagVar:null},
                        {value:typeof target[i]=='string'?target[i]:'', type: 'popbox', $tagVar:$tagVar, event:$fun}
                    ]});
                });
            }
            //check others to disable editable
            uis.each(function(tt,i){
                if(i===(len-1))return;
                if(id=='properties'){
                    var cache=[],cache2=0;
                    arr.each(function(o,i){
                        if(cache2 == arr.length)return false;
                        if(!cache[i] && tt.properties[o.cells[0].value] !== target.properties[o.cells[0].value] ){
                            o.cells[1].type='label';
                            cache[i]=1;
                            cache2++;
                        }
                    });
                }
                //multi event disabled
                if(id=='UIE')
                    arr.length=0;
            });
            linb.thread(threadId).setCache('response',arr);
        },
        $iconlist_aftervalueupdated:function(profile, ov, nv){
            if(nv){
                this.resizer.resetTarget(null,false);
                this._setSelected([nv],true);
            }
        },
        $listobject_onlistshow:function(profile, pos){
            var page=this;
//            linb.dom.UIAction(function(){
                if(!page.objlistBlock){
                    page.objlistBlock=new linb.UI.Block({
                        width:200,
                        height:200,
                        shadow:true
                    });
                    page.frame=linb.create('<div style="z-index:2000;background-color:red;position:absolute;font-size:0;line-height:0;display:none;">').opacity(0.3);
                    linb(document.body).addLast(page.frame);

                    page.treebarObj = new linb.UI.TreeBar({
                        group:false,
                        selMode:'none',
                        caption:null
                    },{
                        onItemSelected:function(profile, item, src){
                            page.selectWidget(item.id);
                            profile.parent.root.display('none');

                            page.frame.display('none');
                            profile.boxing().clearItems();

                            _.asyRun(function(){page._focus()});
                        },
                        beforeHoverEffect:function(profile, item, src, type){
                            if(!item)return;
                            if(item.id==this.canvas.get(0).$id)return;
                            if(type=='mouseover')
                                //for performance in IE
                                _.resetRun('',function(){
                                    var v=linb._object[item.id];
                                    if(v && (v=v.root))
                                        page.frame.setRegion(v.getRegion(true)).display('block');
                                },100);
                            else
                                _.resetRun('',function(){
                                    page.frame.display('none');
                                },100);
                        }
                    },page);
                    page.objlistBlock.attach(page.treebarObj).create();
                }
                //get items
                var items=[];
                var fun = function(profile, items, map){
                    var self=arguments.callee,t,
                        item = {id:profile.$id, caption:profile.alias, icon: (t=map[profile.box.KEY])?t.icon:'', iconPos:(t=map[profile.box.KEY])?t.iconPos:''};
                    items.push(item);
                    if(profile.children && profile.children.length){
                        var sub=[];
                        item.sub = sub;
                        profile.children.each(function(o){
                            self.call(null, o[0], sub, map);
                        });
                    }
                };
                fun(page.canvas.get(0), items, CONF.mapWidgets);
                page.treebarObj.setItems(items).toggleNode(page.canvas.get(0).$id,true);
                var node = page.objlistBlock.reBoxing();
                node.popToTop(profile.root);
                var unFun=function(){
                    node.display('none');
                    page.treebarObj.clearItems();
                    page.frame.display('none');
                    //unhook
                    linb.event.hookKey('esc',0,0,0,null);
                };
                //for on blur disappear
                node.setBlurTrigger('design:pop:objecttree', unFun);
                //for esc
                linb.event.hookKey('esc',0,0,0,unFun);

//            });
        },

//for outter call
        getWidgets:function(flag){
            if(!flag)
                this._clearSelect(this.canvas.get(0));
            var arr=[], c = this.canvas.get(0).children;
            c.each(function(o){
                arr.push(o[0]);
            });

            var items = this.iconlist.getItems();
            if(items && items.length)
                items.each(function(o,i){
                    arr.push(linb.Profile.getFromCacheId(o.id));
                });
            arr.clean();

            return arr;
        },
        getJSONCode:function(nodes){
            //sort by tabindex
            nodes.sort(function(x,y){
                x=parseInt(x.properties.tabindex)||0;y=parseInt(y.properties.tabindex)||0;
                return x>y?1:x==y?0:-1;
            });

            return 'return this._nodes = linb.create(' + _.serialize(nodes) + ').get();'
        },
        getJSCode:function(nodes){
            //sort by tabindex
            nodes.sort(function(x,y){
                x=parseInt(x.properties.tabindex)||0;y=parseInt(y.properties.tabindex)||0;
                return x>y?1:x==y?0:-1;
            });

            var page = this,t,arr=[];
            arr.push('// [[code created by designer, don\'t change it manually\n');
            arr.push('var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};');
            fun = function(v, pName, argsStr, arr){
                var self=arguments.callee, ui=v.box['linb.UI'], o=v.beforeSerialized(), name=o.alias, b;

                delete o.id;

                if(o.properties && o.properties.dropKeys){
                    o.properties.dropKeys = o.properties.dropKeys.replace(/\biDesign\b/,'').replace(/[^\w]+/g,':').replace(/^[^\w]+/,'').replace(/[^\w]+$/,'');
                    if(o.properties.dropKeys == v.box.$DataStruct.dropKeys)
                        delete o.properties.dropKeys;
                }

                if(_.isEmpty(o.properties))delete o.properties;
                if(_.isEmpty(o.events))delete o.events;
                if(_.isEmpty(o.CA))delete o.CA;
                if(_.isEmpty(o.CC))delete o.CC;
                if(_.isEmpty(o.CB))delete o.CB;
                if(_.isEmpty(o.CF))delete o.CF;

                arr.push('\n\n');

                if(pName)
                    arr.push(pName+'.attach(');
                else
                    arr.push('f(');
                arr.push('\n(new ' + o.key.replace('linb.UI','u') + ')');
                arr.push('\n.host(t,"'+name+'")');
                if(o.domId!=o.$domId)
                    arr.push('\n.setDomId("'+o.domId+'")');
                if(o.template)
                    arr.push('\n.template("' + o.template + '")');
                if(o.behavior)
                    arr.push('\n.behavior("' + o.behavior + '")');
                if(o.appearance)
                    arr.push('\n.appearance("' + o.appearance + '")');
                if(o.properties){
                    _.each(o.properties,function(o,i){
                        //serialize is very important
                        arr.push('\n.set' + i.initial() + '(' + _.serialize(o) +')');
                    });
                }

                if(o.events){
                    _.each(o.events,function(o,i){
                        arr.push('\n.' + i + '('+ _.serialize(o) +')');
                    });
                }
                if(o.CA)
                    arr.push('\n.setCustomAppearance('+ _.serialize(o.CA) +')');
                if(o.CC)
                    arr.push('\n.setCustomClass('+ _.serialize(o.CC) +')');
                if(o.CB)
                    arr.push('\n.setCustomBehavior('+ _.serialize(o.CB) +')');
                if(o.CF)
                    arr.push('\n.setCustomFunction('+ _.serialize(o.CF) +')');

                if(pName)
                    arr.push('\n'+(argsStr?(', '+argsStr):'')+');');
                else
                    arr.push('\n);');

                if(v.children && v.children.length){
                    v.children.each(function(o){
                        var j = o[0],sa=[],s;
                        for(var i=1;i<o.length;i++){
                            switch(typeof o[i]){
                                case 'number':
                                    sa.push(o[i]);
                                    break;
                                case 'string':
                                    sa.push("'"+o[i]+"'");
                                    break;
                            }
                        }
                        if(sa.length)
                            s = sa.join(',');
                        else
                            s = null;
                        self.call(this, j, 't.'+name, s,  arr);
                    },this);
                }
            };
            nodes.each(function(v){
                fun(v, null, null, arr);
            });
            arr.push('\n\n');
            arr.push('return n;\n');
            arr.push('// ]]code created by designer');
            return arr.join('');
        },
        getClassList:function(nodes){
            var page = this,t,hash={};
            var fun = function(target){
                var self=arguments.callee;
                hash[target.box.KEY]=1;
                if(target.children && target.children.length){
                    target.children.each(function(o){
                        self.call(null, o[0]);
                    });
                }
            };
            nodes.each(function(o){
                fun(o);
            });
            return _.toArr(hash,true);
        },
        getNames:function(){
            var nodes = this.getWidgets(true);
            var page = this,t,hash={};
            var fun = function(target){
                var self=arguments.callee;
                hash[target.alias]=1;
                if(target.children && target.children.length){
                    target.children.each(function(o){
                        self.call(null, o[0]);
                    });
                }
            };
            nodes.each(function(o){
                fun(o);
            });
            return hash;
        },
        selectWidget:function(id){
            var profile = linb.UIProfile.getFromCacheId(id);
            var p = profile.parent;
            if(p.setSelectFromPanel){
                p.setSelectFromPanel.call(p, profile.root.parent(), id);
                this._setSelected([id],true);
            }else{
                this._clearSelect();
                this._setSelected(null,true);
            }
        },
        activate:function(){
        },
        resetEnv:function(text){
            this._dirty=false;
            this.properties.text = text||this.getText();

            this._clearSelect();
            //reset
            this._setSelected([], true);
        },
        setText:function(txt, flag, threadid){
            txt=txt.replace(/\r\n/g,'\n');
            if(flag || this.properties.text != txt){
                this.properties.text = txt;

                var clsStruct = this.properties.clsStruct;
                var clsObject = this.properties.clsObject;

                var comCode = _.get(clsStruct,['sub','Instance','sub','iniComponents','code']);
                if(comCode == this.properties.comCode)return this;

                var page = this;
//linb.log('rebuild ui')

                linb.thread.asyUI(threadid,[
                    function(){
                        linb.dom.setCover(linb.getRes('VisualJS.designer.emptyContent'));
                    },
                    function(){
                        page.canvas.reBoxing().empty().gc();
                        linb.dom.setCover(linb.getRes('VisualJS.designer.prepare'));
                    },
                    function(threadid){
                        linb.thread.suspend(threadid);
                        //load required class and build Coms
                        linb.SC.group(clsObject.Instance.required,function(key){
                            linb.dom.setCover(linb.getRes('VisualJS.designer.loading')+' ' + key+'...');
                        },function(){
                            linb.dom.setCover(linb.getRes('VisualJS.designer.createContent'));
                            linb.thread.resume(threadid);
                        });
                    },
                    function(){
                        try{
                            //var nodes = clsObject.Instance.iniComponents();
                            //avoid call event in desinger
                            var nodes = clsObject.Instance.iniComponents.call(null);

                            page.iconlist.clearItems();

                            var n2 = [];
                            nodes.filter(function(target){
                                if(!target.box.hasDomRoot){
                                    n2.push(target);
                                    return false;
                                }
                            });
                            page.canvas.attach(linb.UI.pack(nodes, false));
                            nodes.each(function(o){
                                page._designable(o);
                            });
                            n2.each(function(target){
                                //give design mark
                                target.properties.$design=page.properties.$design;
                                page.iconlist.insertItems([{id:target.$id, icon:'img/widgets.gif', iconPos:CONF.mapWidgets[target.box.KEY].iconPos}],null,false);
                            });

                            if(page.layoutBase.reBoxing().display()=='none'){
                                page.layoutBase.reBoxing().display('block');
                                page.layoutBase.reBoxing().parent().background('');
                            }

                        }catch(e){
                            page.iconlist.clearItems();
                            page.canvas.reBoxing().empty().gc();
                            //page.properties.text = '';
                            page.layoutBase.reBoxing().display('none');
                            page.layoutBase.reBoxing().parent().background('url(img/error.gif)');

                            linb.message(linb.getRes('VisualJS.designer.comCodeErr'));
                            linb.message(_.Error(e));
                        }
                    }
                ]);
            }
            //reset
            this.resetEnv(txt);
            return this;
        },
        getText:function(){
            if(this._dirty){
                var nodes = this.getWidgets(), ins = this.properties.clsStruct.sub.Instance;
                //get iniComponents code
                if(!nodes.length){
                    if(_.get(ins,['sub','iniComponents', 'comments']))
                        _.set(ins,['sub','iniComponents','comments'],null);
                }else{
                    if(!_.get(ins,['sub','iniComponents', 'comments']))
                        _.set(ins,['sub','iniComponents','comments'],'\n'+' '.repeat(8));
                    ins.sub.iniComponents.code =
                        ('function(){\n' +
                        this.getJSCode(nodes)
                        ).replace(/\n/g, '\n'+' '.repeat(12))+
                        '\n'+' '.repeat(8)+ '}';
                }

                //get required class list
                var arr = this.properties.clsObject.Instance.required || [];
                arr.merge(this.getClassList(nodes));

                var base=this.properties.clsObject.Instance.base || [];
                arr.each(function(o){
                    o=linb.SC(o);
                    if(o.Dependency)
                        base.merge(o.Dependency);
                });
                _.set(ins,['sub','base','code'],_.serialize(base));
                if(!_.get(ins,['sub','base','comments']))
                    _.set(ins,['sub','base','comments'],'\n'+' '.repeat(8));

                _.set(ins,['sub','required','code'],_.serialize(arr));
                if(!_.get(ins,['sub','required','comments']))
                    _.set(ins,['sub','required','comments'],'\n'+' '.repeat(8));

                //get all code
                return VisualJS.ClassTool.getCodeFromStruct(this.properties.clsStruct);
            }
            //todo: get text from struct
            return this.properties.text;
        },
        iniComponents:function(){
           // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Layout)
            .host(t,"layoutBase")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"main","min":10},{"id":"after","pos":"after","locked":false,"cmd":false,"size":270,"min":100,"max":300,"hide":false}])
            .setType("horizontal")
            );

            t.layoutBase.attach(
            (new u.IconList)
            .host(t,"iconlist")
            .setDock("bottom")
            .setHeight(20)
            .setItemWidth(16)
            .setItemHeight(16)
            .setItemPadding(1)
            .setZIndex(10)
            .setItems([])
            .setCustomAppearance({KEY:'background:#FFFACD',"ITEMS":"padding:2px"})
            .afterValueUpdated("$iconlist_aftervalueupdated")
            , 'main');

            t.layoutBase.attach(
            (new u.ToolBar)
            .host(t,"toolbar")
            .onClick("$toolbar_onclick")
            , 'main');

            t.layoutBase.attach(
            (new u.Layout)
            .host(t,"layoutLeft")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"main","min":10},{"id":"after","pos":"after","locked":false,"size":300,"min":100,"max":500,"cmd":true,"hide":false}])
            , 'after');

            t.layoutLeft.attach(
            (new u.ComboInput)
            .host(t,"listObject")
            .setDock("top")
            .setType("popbox")
            .setReadonly(true)
            .setItems([])
            .onClickButton("$listobject_onlistshow")
            , 'after');

            t.layoutLeft.attach(
            (new u.TreeGrid)
            .host(t,"profileGrid")
            .setHeader([{"id":"name","caption":"$VisualJS.designer.gridcol1","width":80,"type":"label"},{"id":"value","caption":"$VisualJS.designer.gridcol2","width":130,"type":"input"}])
            .setRows([])
            .setRowHandlerWidth(30)
            .setAltRowsBg(false)
            .setRowDragable(false)
            .setColSortable(false)
            .beforeValueUpdated("$profilegrid_beforevalueupdated")
            .onRequestData("$profilegrid_onrequestdata")
            .afterRowActive("$profilegrid_afterrowactive")
            , 'after');

            t.layoutLeft.attach(
            (new u.TreeBar)
            .host(t,"treebarCom")
            .setLeft(0)
            .setTop(0)
            .setItems([])
            .setGroup(true)
            .setSelMode("none")
            .setDragKey("iDesign")
            , 'main');

            t.layoutBase.attach(
            (new u.Div)
            .host(t,"panelDiv")
            .setDock("fill")
            .afterCreated(function (pro) {
                pro.root.addClass("linbdesign");
            })
            .setCustomAppearance({"KEY":"overflow:auto;"})
            , 'main');

            t.panelDiv.attach(
            (new u.Div)
            .host(t,"panelBG")
            .setTop(5)
            .setLeft(5)
            .setCustomAppearance({"KEY":"background-color:#FFFEF6;"})
            );

            t.panelBG.attach(
            (new u.Div)
            .host(t,"panelBGl")
            .setCustomAppearance({"KEY":"font-size:0;line-height:0;position:absolute;left:0;top:0;width:10px;height:100%;background:url(img/designer/left.gif) left top"})
            );

            t.panelBG.attach(
            (new u.Div)
            .host(t,"panelBGb")
            .setCustomAppearance({"KEY":"font-size:0;line-height:0;position:absolute;left:0;bottom:0;height:10px;width:100%;background:url(img/designer/top.gif) left bottom"})
            );

            t.panelBG.attach(
            (new u.Div)
            .host(t,"panelBGt")
            .setCustomAppearance({"KEY":"font-size:0;line-height:0;position:absolute;left:0;top:0;height:10px;width:100%;background:url(img/designer/top.gif) left top"})
            );

            t.panelBG.attach(
            (new u.Div)
            .host(t,"panelBGr")
            .setCustomAppearance({"KEY":"font-size:0;line-height:0;position:absolute;right:0;top:0;width:10px;height:100%;background:url(img/designer/left.gif) top right"})
            );

            t.panelDiv.attach(
            (new u.Panel)
            .host(t,"canvas")
            .setTop(5)
            .setLeft(5)
            .setZIndex(10)
            .setCustomAppearance({"KEY":"overflow:hidden"})
            );

            return n;
            // ]]code created by designer
        }
    },
    Static:{
        destroy:function(){
            this.objlistBlock.destroy();
            arguments.callee.upper.apply(this,arguments);
        }
    },
    Initialize:function(){
        linb.css.add(linb.UI.buildCSSText({
            '.linbdesign .panel':{
                'background-image' : 'url(img/designer/bg.gif)',
                'background-position' : 'left top'
            }
        }),'linb.UI.design');
    }
});