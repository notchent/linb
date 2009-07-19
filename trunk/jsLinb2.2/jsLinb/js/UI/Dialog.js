Class("linb.UI.Dialog","linb.UI.Widget",{
    Instance:{
        show:function(parent, modal, left, top){
            parent = parent || linb('body');
            return this.each(function(profile){
                var t,
                    pro=profile.properties,
                    instance = profile.boxing(),
                    fun = function(){
                        var ins=profile.boxing();
                        if(left||left===0)
                            ins.setLeft(left);
                        if(top||top===0)
                            ins.setTop(top);

                        parent.append(ins);

                        var box=profile.box,
                            root=profile.getRoot();

                        root.show(left?(parseInt(left)||0)+'px':null, top?(parseInt(top)||0)+'px':null);

                        if(modal && !profile.$inModal)
                            box._modal(profile);

                        ins.activate();

                        if(profile.onShow)profile.boxing().onShow(profile);
                        if(profile.properties.status=='normal')
                            box._refreshRegion(profile);

                        delete profile.inShowing;
                    };

                if(profile.inShowing)return;
                profile.inShowing=1;
                if(t=pro.fromRegion)
                    linb.Dom.animate({border:'dashed 1px #ff0000'},{left:[t.left,pro.left],top:[t.top,pro.top],width:[t.width,pro.width],height:[t.height,pro.height]}, null,fun,360,12,'expoIn').start();
                else
                    fun();
            });
        },
        hide:function(){
            this.each(function(profile){
                var pro=profile.properties,
                    box=profile.box,
                    root=profile.getRoot();

                if(profile.inHiding)return;
                profile.inHiding=1;

                if(profile.$inModal)
                    box._unModal(profile);
                //max has dock prop
                if(pro.status=='max' || pro.status=='min')
                    box._restore(profile);

                root.hide();

                var t=pro.fromRegion, fun=function(){
                    delete profile.inHiding;
                };
                if(t)
                    linb.Dom.animate({border:'dashed 1px #ff0000'},{left:[pro.left,t.left],top:[pro.top,t.top],width:[pro.width,t.width],height:[pro.height,t.height]},  null, fun,360,12,'expoOut').start();
                else
                    fun();
            });
            return this;
        },
        close:function(){
            return this.each(function(profile){
                if(profile.beforeClose && false === profile.boxing().beforeClose(profile))
                    return;
                if(profile.inClosing)return;
                profile.inClosing=1;
                var pro=profile.properties, t=pro.fromRegion, fun=function(){
                    profile.boxing().destroy();
                    delete profile.inClosing;
                };

                if(t)
                    linb.Dom.animate({border:'dashed 1px #ff0000'},{left:[pro.left,t.left],top:[pro.top,t.top],width:[pro.width,t.width],height:[pro.height,t.height]}, null,fun,360,12,'expoOut').start();
                else
                    fun();
            });
        },
        activate:function(flag){
            var profile=this.get(0);
            profile.box._active(profile,flag);
            if(flag!==false){
                //set default focus, the min tabzindex
                _.resetRun("dlg_focus:"+profile.$linbid,function(){profile.getRoot().nextFocus()});
            }
        }
    },
    Initialize:function(){
        var ns=this, t=ns.getTemplate();
        _.merge(t.FRAME.BORDER,{
            TBAR:{
                tagName:'div',
                className:'uibar-top',
                TBART:{
                    cellpadding:"0",
                    cellspacing:"0",
                    width:'100%',
                    border:'0',
                    tagName:'table',
                    className:'uibar-t',
                    TBARTR:{
                        tagName:'tr',
                        TBARTDL:{
                            tagName:'td',
                            className:'uibar-tdl'
                        },
                        TBARTDM:{
                            $order:1,
                            width:'100%',
                            tagName:'td',
                            className:'uibar-tdm'
                        },
                        TBARTDR:{
                            $order:2,
                            tagName:'td',
                            className:'uibar-tdr'
                        }
                    }
                },
                BARCMDL:{
                    tagName: 'div',
                    className:'uibar-cmdl',
                    ICON:{
                        $order:0,
                        className:'ui-icon {imageClass}',
                        style:'{backgroundImage} {backgroundPosition} {imageDisplay}'
                    },
                    CAPTION:{
                        $order:1,
                        text:'{caption}'
                    }
                },
                BARCMDR:{
                    tagName: 'div',
                    className:'uibar-cmdr',
                    onselectstart:'return false',
                    unselectable:'on',
                    OPT:{
                        className:'uicmd-opt',
                        style:'{optDisplay}',
                        $order:1
                    },
                    PIN:{
                        $order:2,
                        className:'uicmd-pin',
                        style:'{pinDisplay}'
                    },
                    LAND:{
                        $order:3,
                        className:'uicmd-land',
                        style:'{landDisplay}'
                    },
                    
                    MIN:{
                        $order:4,
                        className:'uicmd-min',
                        style:'{minDisplay}'
                    },
                    RESTORE:{
                        $order:5,
                        className:'uicmd-restore',
                        style:'display:none;'
                    },
                    MAX:{
                        $order:6,
                        className:'uicmd-max',
                        style:'{maxDisplay}'
                    },
                    CLOSE:{
                        $order:7,
                        className:'uicmd-close ',
                        style:'{closeDisplay}'
                    }
                }
            },
            MAIN:{
                $order:2,
                tagName:'div',
                className:'uicon-main',
                MAINI:{
                    tagName:'div',
                    className:'uicon-maini',
                    PANEL:{
                        tagName:'div',
                        text:'{html}'+linb.UI.$childTag
                    }
                }
            },
            BBAR:{
                $order:3,
                tagName:'div',
                className:'uibar-bottom',
                BBART:{
                    cellpadding:"0",
                    cellspacing:"0",
                    width:'100%',
                    border:'0',
                    tagName:'table',
                    className:'uibar-t',
                    BBARTR:{
                        tagName:'tr',
                        BBARTDL:{
                            tagName:'td',
                            className:'uibar-tdl'
                        },
                        BBARTDM:{
                            $order:1,
                            width:'100%',
                            tagName:'td',
                            className:'uibar-tdm'
                        },
                        BBARTDR:{
                            $order:2,
                            tagName:'td',
                            className:'uibar-tdr'
                        }
                    }
                }
            }
        },'all');
        ns.setTemplate(t);
        
        linb.alert=ns.alert;
        linb.confirm=ns.confirm;
        linb.pop=ns.pop;
        linb.prompt=ns.prompt;
    },
    Static:{
        Appearances:{
            KEY:{
                overflow:'visible'
            },
            PANEL:{
                position:'relative',
                overflow:'auto',
                'font-size':'12px',
                'line-height':'14px'
            },
            CAPTION:{
                'font-size':'12px',
                display:'inline',
                'vertical-align':'middle'
            },
            BORDER:{
                position:'relative',
                'font-size':0,
                'line-height':0
            }
        },
        Behaviors:{
            DropableKeys:['PANEL'],
            DragableKeys:['LAND'],
            HoverEffected:{OPT:'OPT', PIN:'PIN',MIN:'MIN',MAX:'MAX',RESTORE:'RESTORE',CLOSE:'CLOSE',LAND:'LAND'},
            ClickEffected:{OPT:'OPT', PIN:'PIN',MIN:'MIN',MAX:'MAX',RESTORE:'RESTORE',CLOSE:'CLOSE',LAND:'LAND'},
            onMousedown:function(profile, e){
                profile.box._active(profile);
            },

            onDragstop:function(profile){
                var pos = profile.getRoot().cssPos(),p=profile.properties;
                p.left = pos.left;
                p.top = pos.top;
            },
            TBAR:{
                onMousedown:function(profile, e, src){
                    if(profile.getKey(linb.Event.getSrc(e).parentNode.id)==profile.keys.BARCMDR)return;

                    if(profile.properties.movable && !profile._locked){
                        profile.box._active(profile);
                        profile.getRoot().startDrag(e, {
                            dragDefer:1,
                            maxTopOffset:profile.getRoot().top(),
                            maxLeftOffset:profile.getRoot().left(),
                            targetOffsetParent:profile.getRoot().parent()
                        });
                    }
                },
                onDblclick:function(profile, e, src){
                    if(profile.getKey(linb.Event.getSrc(e).parentNode.id)==profile.keys.BARCMDR)return;
                    if(!profile.properties.maxBtn)return;
                    if(profile.properties.status=='max')
                        profile.box._restore(profile);
                    else
                        profile.box._max(profile);
                }
            },
            PIN:{
                onClick:function(profile, e, src){
                    var key=profile.keys.PIN, t=profile.properties;
                    //set pinned status
                    t.pinned = !t.pinned;
                    //set appea
                    profile.getSubNode('PIN').tagClass('-checked', t.pinned);
                    //set lock flag for not movable
                    profile._locked = t.pinned;

                    // add/remove resize
                    if(t.resizer){
                        if(!t.pinned){
                            // if not in min mode
                            if(t.status != 'min' && profile.$resizer)
                                profile.$resizer.show();
                        }else
                            if(profile.$resizer)
                                //profile.boxing().setResizer(false);
                                profile.$resizer.hide();
                    }
                }
            },
            MIN:{
                onClick:function(profile, e, src){
                    profile.box._min(profile);
                }
            },
            MAX:{
                onClick:function(profile, e, src){
                    profile.box._max(profile);
                }
            },
            RESTORE:{
                onClick:function(profile, e, src){
                    profile.box._restore(profile);
                }
            },
            OPT:{
                onClick:function(profile, e, src){
                    profile.boxing().onShowOptions(profile, e, src);
                }
            },
            CLOSE:{
                onClick:function(profile, e, src){
                    profile.boxing().close();
                }
            }
        },
        DataModel:{
            tips:null,
            border:null,
            disabled:null,
            dock:{
                hidden:true
            },
            html:{
                action:function(v){
                    this.getSubNode('PANEL').html(v);
                }
            },
            // setCaption and getCaption
            caption:{
                ini:undefined,
                // ui update function when setCaption
                action: function(value){
                    this.getSubNode('CAPTION').get(0).innerHTML = value;
                }
            },
            image:{
                action: function(value){
                    this.getSubNode('ICON')
                        .css('display',value?'':'none')
                        .css('backgroundImage','url('+(value||'')+')');
                }
            },
            imagePos:{
                action: function(value){
                    this.getSubNode('ICON')
                        .css('backgroundPosition', value);
                }
            },
            // setCaption and getCaption
            shadow: true,
            resizer:true,
            movable: true ,

            minBtn:{
                ini:true,
                action:function(v){
                    var o = this.getSubNode('MIN');
                    if(v)
                        o.setInlineBlock();
                    else
                        o.css('display','none');
                }
            },
            maxBtn:{
                ini:true,
                action:function(v){
                    var o = this.getSubNode('MAX');
                    if(v)
                        o.setInlineBlock();
                    else
                        o.css('display','none');
                }
            },
            optBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('OPT').css('display',v?'':'none');
                }
            },
            closeBtn:{
                ini:true,
                action:function(v){
                    var o = this.getSubNode('CLOSE');
                    if(v)
                        o.setInlineBlock();
                    else
                        o.css('display','none');
                }
            },
            pinBtn:{
                ini:true,
                action:function(v){
                    var o = this.getSubNode('PIN');
                    if(v)
                        o.setInlineBlock();
                    else
                        o.css('display','none');
                }
            },
            landBtn:{
                ini:false,
                action:function(v){
                    var o = this.getSubNode('LAND');
                    if(v)
                        o.setInlineBlock();
                    else
                        o.css('display','none');
                }
            },
            width:300,
            height:300,
            minWidth : 200,
            minHeight : 100,

            position:'absolute',
            fromRegion:{
                hidden:true,
                ini:null
            },
            status:{
                ini:'normal',
                listbox:['normal','min','max'],
                action:function(v,o){
                    var self=this, b=self.box;
                    if(v=='min')b._min(self,o);
                    else if(v=='max')b._max(self,o);
                    else b._restore(self,o);
                }
            }
        },
        EventHandlers:{
            onShow:function(profile){},
            beforeClose:function(profile){},
            onShowOptions:function(profile, e, src){}
        },
        RenderTrigger:function(){
            this.destroyTrigger = function(){
                var s=this;
                if(s.$inModal)s.box._unModal(s);
            };
        },
        LayoutTrigger:function(){
            var self=this, t=self.properties, b=self.box;
            if(t.status=='min')
                b._min(self);
            else if(t.status=='max')
                b._max(self);
            else
                linb.UI.$tryResize(self, t.width, t.height);
        },
        _prepareData:function(profile){
            var data = arguments.callee.upper.call(this, profile),
                nodisplay='display:none';
            data.minDisplay = data.minBtn?'':nodisplay;
            data.maxDisplay = data.maxBtn?'':nodisplay;
            data.optDisplay = data.optBtn?'':nodisplay;
            data.closeDisplay = data.closeBtn?'':nodisplay;
            data.pinDisplay = data.pinBtn?'':nodisplay;
            data.landDisplay = data.landBtn?'':nodisplay;
            data.statusDisplay = data.statusDisplay?'':nodisplay;
            data.statusHeight = 'height:'+data.statusHeight+'px';
            var status=profile.properties.status;
            if(status=='min'||status=='max')
                profile.$noR=profile.$noS=1;
            return data;
        },

        //ov from design mode
        _min:function(profile,status){
            var o=profile.getRoot(),
                box=profile.box,
                p=o.parent(),
                t=profile.properties;
            if(!status)status=t.status;
            // unMax
            if(status=='max')
                box._unMax(profile);
            // keep restore values
            else
                box._refreshRegion(profile);

            // hide those
            profile.getSubNodes(['PANEL','STATUS']).css('display','none');

            if(t.minBtn){
                // show restore button
                profile.getSubNode('RESTORE').setInlineBlock();
                // hide min button
                profile.getSubNode('MIN').css('display','none');
            }

            // lockResize function
            if(t.resizer && profile.$resizer)
                profile.$resizer.hide();


            if(t.shadow)
                profile.boxing()._unShadow(false);

            //set it before resize
            t.status='min';

            var h1=o.height(),
                h2=profile.getSubNode('BORDER').height(),
                h=profile.getSubNode('TBAR').height();
            // resize
            o.cssSize({ width :t.minWidth, height :h+h1-h2},true);
        },
        _max:function(profile,status){
            var o=profile.getRoot(),
                box=profile.box,
                ins=profile.boxing(),
                p=o.parent(),
                t=profile.properties;
            if(!status)status=t.status;
            // if from normal status
            if(status=='min')
                //unset min
                box._unMin(profile);
            else
                box._refreshRegion(profile);

            // hide pin button
            if(t.pinBtn)
                profile.getSubNode('PIN').css('display','none');
            if(t.maxBtn){
                // hide max button
                profile.getSubNode('MAX').css('display','none');
                // show restore button
                profile.getSubNode('RESTORE').setInlineBlock();
            }

            // set not movable
            profile.old_m = t.movable;
            t.movable=false;

            if(t.resizer && profile.$resizer)
                profile.$resizer.hide();

            if(t.shadow)
                //ins.setShadow(false);
                ins._unShadow(false);

            t.status='max';

            ins.setDock('fill');
        },
        _restore:function(profile,status){
            var o=profile.getRoot(),
                box=profile.box,
                t=profile.properties;
            if(!status)status=t.status;
            // if from max
            if(status=='max')box._unMax(profile);
            if(status=='min')box._unMin(profile);

            // hide restore button
            profile.getSubNode('RESTORE').css('display','none');

            t.status='normal';
        },
        _unMax:function(profile){
            var t=profile.properties,
                ins=profile.boxing();
            profile.getSubNode('MAX').setInlineBlock();
            if(t.pinBtn)
                profile.getSubNode('PIN').setInlineBlock();

            t.movable=profile.old_m;

            if(t.shadow)
                ins._shadow();

            if(t.resizer && !t.pinned){
                if(profile.$resizer)
                    profile.$resizer.show();
                else
                    ins._resizer();
            }

            ins.setDock('none');

            // resize
            linb.UI.$tryResize(profile, t.width, t.height,true);
        },
        _unMin:function(profile){
            var t=profile.properties,
            ins=profile.boxing();
            profile.getSubNodes(['PANEL','STATUS']).css('display','block');
            profile.getSubNode('MIN').setInlineBlock();

            if(t.shadow)
                ins._shadow();

            if(t.resizer && !t.pinned){
                if(profile.$resizer)
                    profile.$resizer.show();
                else
                    ins._resizer();
            }

            profile.getRoot().cssSize({width:t.width, height:t.height});
            // resize
            linb.UI.$tryResize(profile, t.width, t.height,true);
        },
        _active:function(profile,flag){
            var self=this;
            if(flag!==false && self.activeWndId==profile.$linbid)return;

            self._deActive();
            if(flag!==false){
                var o=linb(profile.domId),
                    //in ie, .children can't get the same thread added node(modal div,  here)
                    t1=o.topZindex(),
                    t2=o.css('zIndex');
                o.css('zIndex',t1>t2?t1:t2);
    
                profile.getSubNode('TBAR').tagClass('-focus');
                self.activeWndId = profile.$linbid;
            }
        },
        _deActive:function(){
            var profile;
            if(profile=linb.UI._cache['$'+this.activeWndId])
                profile.getSubNode('TBAR').tagClass('-focus',false);
            delete this.activeWndId;
        },
        _modal:function(profile){
            var s=profile.getRoot(),temp,p=s.parent(),cover;
            if(!p.isEmpty()){
                if(!profile.$inModal){
                    if(!profile.$modalDiv)
                        profile.$modalDiv=new linb.UI.Div({
                            position:'absolute'
                        }).setCustomStyle({
                            KEY:'overflow:hidden;display:block;z-index:0;cursor:wait;background-image:url('+linb.ini.path+'bg.gif)'
                        });

                    cover = profile.$modalDiv;
                    p.append(cover);
                    cover.setDock('cover',true);
                    cover=cover.reBoxing();
                    cover.css('display','block').onMousedown(function(){return false}).topZindex(true);
                    s.css('zIndex',(parseInt(cover.css('zIndex'))||0)+1);

                    /*
                    //bak dlg tabzindnex
                    var hash={},a=profile.getRoot().query('*',function(o){return o.tabIndex>0}).get();
                    for(var i=0,o;o=a[i++];){
                        (hash[o.tabIndex] = hash[o.tabIndex]||[]).push(o);
                        o.tabIndex=-1;
                    }
                    //save others tabzindex
                    var h = profile.$focusHash={}, b=linb('body').query('*',function(o){return o.tabIndex>0}).get();
                    for(var i=0,o;o=b[i++];){
                        (h[o.tabIndex] = h[o.tabIndex]||[]).push(o);
                        o.tabIndex=-1;
                    }
                    //restore dlg tabzindnex
                    for(var i in hash){
                        h=hash[i];
                        for(var j in h)
                            h[j].tabIndex=i;
                    }
                    */
                    linb.Event.pushTabOutTrigger(profile.renderId, function(){linb([profile.renderId]).nextFocus()});

                    profile.$inModal=true;
                }
            }
        },
        _unModal:function(profile){
            if(profile.$inModal){
                profile.$modalDiv.setDock('none');
                profile.getRoot().css('zIndex',0);
                profile.getSubNode('BORDER').append(profile.$modalDiv.reBoxing().css('display','none'));

                profile.$inModal=false;
                /*
                var hash=profile.$focusHash,h;
                for(var i in hash){
                    h=hash[i];
                    for(var j in h)
                        h[j].tabIndex=i;
                }
                _.breakO(profile.$focusHash,2);
                */
                linb.Event.popTabOutTrigger();
            }
        },
        _refreshRegion:function(profile){
            if(!profile.renderId) return;
            var pro=profile.properties;
            return _.merge(pro, profile.getRoot().cssRegion(), function(o,i){return pro[i]!='auto'});
        },

        _adjust:function(dialog,caption, content){
            caption = caption ||'';
            if(!content){
                content = caption;
                caption = "";
            }

            var node = dialog.$div.reBoxing(),
            ID='linb:temp:dialog',
            me=arguments.callee,
            w,h;

            if(!linb.Dom.byId(ID)){
                n2 = me._cache=node.clone(false);
                linb('body').append(n2);
                n2.css({width:'auto',height:'auto',overflow:'visible',position:'absolute',visibility:'visible',left:linb.Dom.HIDE_VALUE})
                .id(ID,true);
            }
            var n2 = me._cache;
            n2.html(content,false);
            var size = n2.cssSize();

            node.html(content);

            if(size.width>500){
                size.width=500;
                n2.width(500);
                size.height = n2.offsetHeight() + 10;
                n2.width('auto');
            }
            if(size.height>400)size.height=400;
            if(size.width<150)size.width=150;
            if(size.height<30)size.height=30;

            node.cssSize(size).css('overflow','auto').show();

            w=size.width + 30;
            h=size.height+90;
            dialog.setCaption(caption).setWidth(w).setHeight(h);
            dialog.$cmd.reBoxing().left((size.width + 30 - dialog.$cmd.reBoxing().width())/2);
            
            linb.UI.$doResize(dialog.get(0), w, h);
        },
        alert:function(title, content, onOK){
            var me=arguments.callee, dialog;
            if(!(dialog=me.dialog)){
                dialog = me.dialog = new linb.UI.Dialog({
                    minBtn:false,
                    maxBtn:false,
                    pinBtn:false,
                    resizer:false,
                    left:200,
                    top:200
                },{
                    beforeClose:function(){
                        dialog.hide();
                        _.tryF(me.onOK);
                        me.onOK=null;
                        return false;
                    }
                });

                var cmd = dialog.$cmd = new linb.UI.Div({
                    bottom:10,
                    width:60,
                    height:24
                }),

                btn = dialog.$btn = new linb.UI.SButton({
                    caption:'$inline.ok',
                    width: 60,
                    tabindex:1
                },
                {
                    onClick:function(){
                        dialog.hide();
                        _.tryF(onOK);
                    }
                });
                cmd.append(btn);

                var div = dialog.$div = new linb.UI.Div({
                    left:10,
                    top:10
                });
                dialog.append(cmd).append(div).render();
            }
            me.onOK=onOK;
            linb.UI.Dialog._adjust(dialog,title, content);
            dialog.show(linb('body'),true);
            _.resetRun("dlg_focus:"+dialog.get(0).$linbid,function(){
                dialog.$btn.activate();
            });
            return dialog;
        },
        confirm:function(title, caption, onYes, onNo){
            var me=arguments.callee, dialog;

            if(!(dialog=me.dialog)){
                dialog = me.dialog = new linb.UI.Dialog({
                    minBtn:false,
                    maxBtn:false,
                    pinBtn:false,
                    resizer:false,
                    left:200,
                    top:200
                },{
                    beforeClose:function(){
                        dialog.hide();
                        _.tryF(me.onNo);
                        me.onYest=me.onNo=null;
                        return false;
                    }
                });

                var cmd = dialog.$cmd=new linb.UI.Div({
                    bottom:10,
                    width:140,
                    height:24
                }),
                btn = new linb.UI.SButton({
                    caption:'$inline.yes',
                    width: 60,
                    tabindex:1,
                    left:0
                },
                {
                    onClick:function(){
                        dialog.hide();
                        _.tryF(me.onYes);
                        me.onYest=me.onNo=null;
                    }
                });
                cmd.append(btn);

                btn = dialog.$btn=new linb.UI.SButton({
                    caption:'$inline.no',
                    tabindex:1,
                    width: 60,
                    left:80
                },
                {
                    onClick:function(){
                        dialog.hide();
                        _.tryF(me.onNo);
                        me.onYest=me.onNo=null;
                    }
                });
                cmd.append(btn);

                var div = dialog.$div=new linb.UI.Div({
                    left:10,
                    top:10
                });
                dialog.append(cmd).append(div).render();
            }
            me.onYes=onYes;
            me.onNo=onNo;
            linb.UI.Dialog._adjust(dialog, title, caption);
            dialog.show(linb('body'), true);
            _.resetRun("dlg_focus:"+dialog.get(0).$linbid,function(){
                dialog.$btn.activate();
            });
            return dialog;
        },
        pop:function(title, content, cmdStr, left, top){
            var dialog = new linb.UI.Dialog({
                minBtn:false,
                maxBtn:false,
                pinBtn:false,
                resizer:false,
                left:200 || left,
                top:200 || top
            }),

            cmd = dialog.$cmd = new linb.UI.Div({
                bottom:10,
                width:60,
                height:24
            })
            .append( dialog.$btn = new linb.UI.SButton({
                caption: cmdStr || '$inline.ok',
                tabindex:1,
                width: 60
            },
            {
                onClick:function(){
                    dialog.destroy();
                }
            })),

            div = dialog.$div = new linb.UI.Div({
                left:10,
                top:10
            }).setCustomStyle({
                KEY:'overflow:visible'
            });

            dialog.append(cmd).append(div).render();;

            linb.UI.Dialog._adjust(dialog, title, content);
            dialog.show(linb('body'),false,left, top);

            _.resetRun("dlg_focus:"+dialog.get(0).$linbid,function(){
                dialog.$btn.activate();
            });
            return dialog;
        },
        prompt:function(title, caption, content, onYes, onNo){
            var dialog,
                me=arguments.callee;
            if(!(dialog=me.dialog)){
                var close=function(){
                    me.$inp.setValue('');
                    me.onYes=me.onNo=null;
                    me.dialog.hide();
                    return false;
                };
                dialog = me.dialog = new linb.UI.Dialog({
                    minBtn:false,
                    maxBtn:false,
                    pinBtn:false,
                    resizer:false,
                    left:200,
                    top:200,
                    width:300,
                    height:130
                },{
                    beforeClose:function(){
                        _.tryF(me.onNo);
                        return close();
                    }
                });
                var con = me.$con = new linb.UI.Div({
                    top:4,
                    left:10,
                    width:270,
                    height:18
                }),
                cmd = new linb.UI.Div({
                    top:65,
                    width:270,
                    height:24
                })
                .setCustomStyle('KEY',"text-align:center;")
                .append(new linb.UI.SButton({
                    caption:'$inline.ok',
                    width: 60,
                    left:70,
                    tabindex:1
                },
                {
                    onClick:function(){
                        _.tryF(me.onYes,[me.$inp.getUIValue()]);
                        return close();
                    }
                }));

                cmd.append(new linb.UI.SButton({
                    caption:'$inline.cancel',
                    tabindex:1,
                    left:140,
                    width: 60
                },
                {
                    onClick:function(){
                        _.tryF(me.onNo);
                        return close();
                    }
                }));
                var inp=me.$inp=new linb.UI.Input({
                    left:10,
                    top:22,
                    width:270,
                    height:36,
                    multiLines:true
                })
                dialog.append(con).append(cmd).append(inp).render();
            }
            dialog.setCaption(title||'Prompt');
            me.$con.setHtml(caption||"");
            me.$inp.setValue(content||"",true);
            me.onYes=onYes;
            me.onNo=onNo;

            dialog.show(linb('body'), true);
            _.resetRun("dlg_focus:"+dialog.get(0).$linbid,function(){
                me.$inp.activate();
            });
            return dialog;
        },
        //
        _onresize:function(profile,width,height,force){
            var size = arguments.callee.upper.apply(this,arguments),
                isize={},
                v1=profile.getSubNode('TBAR'),
                v2=profile.getSubNode('PANEL'),
                v4=profile.getSubNode('BBAR'),
                v5=profile.getSubNode('MAIN'),
                v6=profile.getSubNode('MAINI'),
                h1,h4,t;
            if(height){
                if(height=='auto'){
                    isize.height=height;
                }else{
                    h1=v1.height(), h4=v4.height();
                    if((t=size.height-h1-h4)>0)
                        isize.height=t;
                }
            }

            if(width)
                isize.width=size.width-(parseInt(v6.css('paddingRight'))||0)-(parseInt(v5.css('paddingLeft'))||0);
            v2.cssSize(isize, true);
        }
    }
});
