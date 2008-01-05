Class("linb.UI.Dialog",["linb.UI.Widget","linb.UI.iContainer"],{
    Instance:{
        html:function(html){
            this.get(0).getSubNode('PANEL').html(html);
        },
        show:function(parent, modal){
            parent = parent || linb(document.body);
            return this.each(function(profile){
                if(profile.$show)return;

                var t, pro=profile.properties,
                instance = profile.boxing(),
                fun = function(){
                    profile.$show=true;
                    parent.attach(profile.boxing());

                    //in ie, .children can't get the same thread added node(modal div,  here)
                    var t1=profile.root.topZindex(), t2=profile.root.zIndex();
                    profile.root.zIndex(t1>t2?t1:t2).show();
                    if(modal && !profile.$inModal)profile.box.modal(profile);

                    profile.box.active(profile);

                    profile.root.nextFocus();
                };

                if(t=pro.fromRegion)
                    linb.dom.fxProxy(t, pro ,null,fun,240,8,'inexp').start();
                else
                    fun();
            });
        },
        hide:function(){
            this.each(function(profile){
                delete profile.$show;

                if(profile.$inModal)
                    profile.box.unModal(profile);
                //max has dock prop
                if(profile.properties.status=='max' || profile.properties.status=='min')
                    profile.box.restore(profile);

                profile.root.hide();

                var t=profile.properties.fromRegion;
                if(t)
                    linb.dom.fxProxy(profile.properties, t, null, null,240,8,'outexp').start();
            });
            return this;
        },
        close:function(){
            return this.each(function(profile){
                if(profile.beforeClose && false === profile.boxing().beforeClose(profile))
                    return;
                var t=profile.properties.fromRegion, fun=function(){
                    profile.boxing().destroy();
                };
                if(t)
                    linb.dom.fxProxy(profile.properties ,t, null,fun,240,8,'outexp').start();
                else
                    fun();
            });
        },


        ////
        removePanel:function(){
            this.destroy();
        },
        getPanelPara:function(){
            return _.copy(this.get(0).properties);
        },
        getPanelChildren:function(){
            return this.get(0).children;
        }
    },
    Initialize:function(){
        //modify default template fro shell
        var t = this.getTemplate('default');
        _.merge(t.FRAME.BORDER,{
            TITLE:{
                tagName:'div',
                style:'height:{_titleHeight}px;',
                ICON:{
                    $order:0
                   // style:'background:url({icon}) transparent no-repeat  {iconPos};{iconDisplay}'
                },
                CAPTION:{
                    $order:1,
                    text:'{caption}'
                },
                CMDS:{
                    $order:2,
                    OPT:{
                        style:'{optDisplay}',
                        $order:0
                    },
                    MIN:{
                        $order:1,
                        style:'{minDisplay}'
                    },
                    RESTORE:{
                        $order:2,
                        style:'display:none;'
                    },
                    MAX:{
                        $order:3,
                        style:'{maxDisplay}'
                    },
                    CLOSE:{
                        $order:4,
                        style:'{closeDisplay}'
                    },
                    PIN:{
                        $order:5,
                        style:'{pinDisplay}'
                    },
                    LAND:{
                        $order:6,
                        style:'{landDisplay}'
                    }
                }
            },
            PANEL:{
                tagName:'div',
                $order:2,
                text:linb.UI.$childTag
            },
            STATUS:{
                tagName:'div',
                $order:3
            }
        },'all');
        this.setTemplate('default',t)
    },
    Static:{
        Dropable:['PANEL'],
        Dragable:['LAND'],
        Appearances:{'default':{
            BORDER:{
                'border-left':'solid 1px #fff',
                'border-top':0,
                'border-right':'solid 1px #BBB',
                'border-bottom':'solid 1px #BBB',
                'background-color': '#F3F3F3'
            },
            PANEL:{
                position:'absolute',
                left:0,
                overflow:'auto'
            },
            STATUS:{
                position:'absolute',
                left:0,
                bottom:0,
                height:0,

                '*font-size':0,
                '*line-height':0
            },
            TITLE:{
                position:'absolute',
                left:0,
                top:0,
                height:0,

                background: linb.UI.getCSSImgPara('barvbg.gif', ' repeat-x left top', null, 'linb.UI.Public'),
                '*font-size':0,
                '*line-height':0
            },
            'TITLE-focus':{
                $order:1,
                'background-position' : 'right -22px'
            },
            ICON:{
                height:'16px',
                width:'16px',
                margin:'4px 0 0 4px'
            },
            CAPTION:{
                margin:'4px 0 0 4px',
                color:'#555',
                'font-weight':'bold',
                'font-size':'12px'
            },
            CMDS:{
                position:'absolute',
                top:0,
                right:0,
                'text-align':'right',
                'vertical-align': 'middle',
                background: linb.UI.getCSSImgPara('barvbg.gif', ' repeat-x left top', null, 'linb.UI.Public'),
                height:'100%',
                //width:'100px',
                cursor:'default'
            },
            'CMDS-focus':{
                $order:1,
                'background-position' : 'right -22px'
            },
            'CMDS span':{
                position:'relative',
                margin:'4px 4px 2px 0',
                width:'15px',
                height:'15px',
                'vertical-align': 'middle',
                cursor:'default'
            },
            OPT:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -240px top', null, 'linb.UI.Public')
            },
            'OPT-mouseover':{
                $order:2,
                'background-position': '-240px -16px'
            },
            'OPT-mousedown':{
                $order:3,
                'background-position': '-240px -32px'
            },
            MIN:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' -16px 0', null, 'linb.UI.Public'),
                $order:0
            },
            'MIN-mouseover':{
                $order:1,
               'background-position': ' -16px -16px'
            },
            'MIN-mousedown':{
                $order:2,
               'background-position':  '-16px -32px'
            },
            RESTORE:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' -32px 0', null, 'linb.UI.Public')
            },
            'RESTORE-mouseover':{
                $order:1,
               'background-position':  '-32px -16px'
            },
            'RESTORE-mousedown':{
                $order:2,
               'background-position':  '-32px -32px'
            },
            MAX:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' -48px 0', null, 'linb.UI.Public')
            },
            'MAX-mouseover':{
                $order:1,
               'background-position':  '-48px -16px'
            },
            'MAX-mousedown':{
                $order:2,
               'background-position':  '-48px -32px'
            },
            PIN:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' 0 0', null, 'linb.UI.Public')
            },
            'PIN-mouseover':{
                $order:1,
                'background-position': '0 -16px'
            },
            'PIN-mousedown':{
                $order:2,
                'background-position': ' 0 -32px'
            },
            'PIN-checked, PIN-checked-mouseover':{
                $order:2,
                'background-position':  '0 -32px'
            },
            CLOSE:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat  -64px 0', null, 'linb.UI.Public')
            },
            'CLOSE-mouseover':{
                $order:1,
                'background-position': '-64px -16px'
            },
            'CLOSE-mousedown':{
                $order:2,
                'background-position': '-64px -32px'
            },
            LAND:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat  -80px 0', null, 'linb.UI.Public')
            },
            'LAND-mouseover':{
                $order:1,
                'background-position': '-80px -16px'
            },
            'LAND-mousedown':{
                $order:2,
                'background-position': '-80px -32px'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{OPT:'OPT', PIN:'PIN',MIN:'MIN',MAX:'MAX',RESTORE:'RESTORE',CLOSE:'CLOSE',LAND:'LAND'},
            _clickEffect:{OPT:'OPT', PIN:'PIN',MIN:'MIN',MAX:'MAX',RESTORE:'RESTORE',CLOSE:'CLOSE',LAND:'LAND'},
            onMousedown:function(profile, e){
                profile.box.active(profile);
            },

            onDragend:function(profile){
                var pos = profile.root.cssPos(),p=profile.properties;
                p.left = pos.left;
                p.top = pos.top;
            },
            TITLE:{
                onMousedown:function(profile, e, src){
                    if(profile.getKey(linb.event.getSrc(e).parentNode.id)==profile.keys.CMDS)return;

                    if(profile.properties.movable && !profile._locked){
                        profile.box.active(profile);
                        var hash={defer:1, target_parent:profile.root.parent()};
                        if(profile.properties.dragKey)
                            hash.data={
                                data:[profile.$id],
                                domId:src.id
                            };
                        profile.root.startDrag(e, hash);
                    }
                },
                onDblclick:function(profile, e, src){
                    if(profile.getKey(linb.event.getSrc(e).parentNode.id)==profile.keys.CMDS)return;
                    if(!profile.properties.maxBtn)return;
                    if(profile.properties.status=='max')
                        profile.box.restore(profile);
                    else
                        profile.box.max(profile);
                }
            },
            PIN:{
                onClick:function(profile, e, src){
                    var key=profile.keys.PIN, t=profile.properties;
                    //set pinned status
                    t.pinned = !t.pinned;
                    //set appea
                    if(t.pinned)
                        profile.addTagClass('PIN', '-checked', null, true);
                    else
                        profile.removeTagClass('PIN','-checked');
                    //set lock flag for not movable
                    profile._locked = t.pinned;

                    // add/remove resize
                    if(t.resizable){
                        if(!t.pinned){
                            // if not in min mode
                            if(t.status != 'min' && profile.$resizer)
                                profile.$resizer.show();
                        }else
                            if(profile.$resizer)
                                //profile.boxing().setResizable(false);
                                profile.$resizer.hide();
                    }
                }
            },
            MIN:{
                onClick:function(profile, e, src){
                    profile.box.min(profile);
                }
            },
            MAX:{
                onClick:function(profile, e, src){
                    profile.box.max(profile);
                }
            },
            RESTORE:{
                onClick:function(profile, e, src){
                    profile.box.restore(profile);
                }
            },
            OPT:{
                onClick:function(profile, e, src){
                    profile.boxing().onTriggerOption(profile, e, src);
                }
            },
            CLOSE:{
                onClick:function(profile, e, src){
                    profile.boxing().close();
                }
            }
        }},
        DataModel:{
            //$fix:true,
            $border:1,
            value:null,
            tips:null,
            dataField:null,
            dataBinder:null,
            border:null,
            disabled:null,
            dock:{
                hidden:true
            },

            // setCaption and getCaption
            shadow: true,
            resizable:true,
            movable: true ,

            minBtn:{
                ini:true,
                action:function(v){
                    var o = this.getSubNode('MIN');
                    if(v)
                        o.inlineBlock();
                    else
                        o.display('none');
                }
            },
            maxBtn:{
                ini:true,
                action:function(v){
                    var o = this.getSubNode('MAX');
                    if(v)
                        o.inlineBlock();
                    else
                        o.display('none');
                }
            },
            optBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('OPT').display(v?'':'none');
                }
            },
            closeBtn:{
                ini:true,
                action:function(v){
                    var o = this.getSubNode('CLOSE');
                    if(v)
                        o.inlineBlock();
                    else
                        o.display('none');
                }
            },
            pinBtn:{
                ini:true,
                action:function(v){
                    var o = this.getSubNode('PIN');
                    if(v)
                        o.inlineBlock();
                    else
                        o.display('none');
                }
            },
            landBtn:{
                ini:false,
                action:function(v){
                    var o = this.getSubNode('LAND');
                    if(v)
                        o.inlineBlock();
                    else
                        o.display('none');
                }
            },
            width:300,
            height:300,
            minWidth : 200,
            minHeight : 100,
            _titleHeight: 22,

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
                    if(v=='min')b.min(self,o);
                    else if(v=='max')b.max(self,o);
                    else b.restore(self,o);
                }
            }
        },
        EventHandlers:{
            beforeValueSet:null,
            afterValueSet:null,
            beforeValueUpdated:null,
            afterValueUpdated:null,
            beforeHoverEffect:null,
            beforeClickEffect:null,
            beforeNextFocus:null,

            beforeClose:function(profile){},
            onTriggerOption:function(profile, e, src){}
        },
        createdTrigger:function(){
            this.destroyTrigger = function(){
                var s=this;
                if(s.$inModal)s.box.unModal(s);
            };
        },
        renderedTrigger:function(){
            var self=this, t=self.properties, b=self.box;
            if(t.status=='min') b.min(self);
            else if(t.status=='max') b.max(self);
            else b.resize(self, t.width, t.height);
        },
        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);

            var data = profile.data, nodisplay='display:none';
            data.minDisplay = data.minBtn?'':nodisplay;
            data.maxDisplay = data.maxBtn?'':nodisplay;
            data.optDisplay = data.optBtn?'':nodisplay;
            data.closeDisplay = data.closeBtn?'':nodisplay;
            data.pinDisplay = data.pinBtn?'':nodisplay;
            data.landDisplay = data.landBtn?'':nodisplay;

            data.iconDisplay = data.icon?'':nodisplay;

            var status=profile.properties.status;
            if(status=='min'||status=='max')
                profile.$noR=profile.$noS=1;
        },

        //ov from design mode
        min:function(profile, ov){
            var o = profile.boxing().reBoxing(),
                box = profile.box,
                p=o.parent(),
                t=profile.properties;

            // unMax
            if((ov||t.status)=='max')
                box.unMax(profile);
            // keep restore values
            else
                box.refreshRegion(profile);

            // hide those
            profile.getSubNodes(['PANEL','STATUS']).display('none');

            if(t.minBtn){
                // show restore button
                profile.getSubNode('RESTORE').inlineBlock();
                // hide min button
                profile.getSubNode('MIN').display('none');
            }

            // lockResize function
            if(t.resizable && profile.$resizer)
                profile.$resizer.hide();


            if(t.shadow)
                //profile.boxing().setShadow(false);
                profile.boxing()._unShadow(false);

            //set it before resize
            t.status='min';

            var h1=o.height(),
                h2=profile.getSubNode('BORDER').height(),
                h=profile.getSubNode('TITLE').height();
            // resize
            o.cssSize({ width :t.minWidth, height :h+h1-h2},true);
        },
        max:function(profile, ov){
            var o = profile.boxing().reBoxing(),
                p=o.parent(),
                t=profile.properties;
            // if from normal status
            if((ov||t.status)=='min')
                //unset min
                profile.box.unMin(profile);
            else
                profile.box.refreshRegion(profile);

            // hide pin button
            if(t.pinBtn)
                profile.getSubNode('PIN').display('none');
            if(t.maxBtn){
                // hide max button
                profile.getSubNode('MAX').display('none');
                // show restore button
                profile.getSubNode('RESTORE').inlineBlock();
            }

            // set not movable
            profile.old_m = t.movable;
            t.movable=false;

            if(t.resizable && profile.$resizer)
                profile.$resizer.hide();

            if(t.shadow)
                //profile.boxing().setShadow(false);
                profile.boxing()._unShadow(false);

            t.status='max';

            profile.boxing().setDock('fill');
        },
        restore:function(profile, ov){
            var o = profile.boxing().reBoxing();
            var t=profile.properties;
            // if from max
            if((ov || t.status) =='max')profile.box.unMax(profile);
            if((ov || t.status) =='min')profile.box.unMin(profile);

            // hide restore button
            profile.getSubNode('RESTORE').display('none');

            t.status='normal';
        },
        unMax:function(profile){
            var t=profile.properties;
            profile.getSubNode('MAX').inlineBlock();
            if(t.pinBtn)
                profile.getSubNode('PIN').inlineBlock();

            t.movable=profile.old_m;

            if(t.shadow)
                profile.boxing()._shadow();

            if(t.resizable && !t.pinned && profile.$resizer)
                profile.$resizer.show();

            profile.boxing().setDock('none');

            // resize
            profile.box.resize(profile, t.width, t.height);
        },
        unMin:function(profile){
            var t=profile.properties;
            profile.getSubNodes(['PANEL','STATUS']).display('block');
            profile.getSubNode('MIN').inlineBlock();

            if(t.shadow)
                profile.boxing()._shadow();

            if(t.resizable && !t.pinned &&profile.$resizer)
                    profile.$resizer.show();

            profile.root.cssSize({width:t.width, height:t.height});
            // resize
            profile.box.resize(profile, t.width, t.height);
        },
        active:function(profile){
            var self=this;
            if(self.activeWndId == profile.$id)return;

            self.deActive();

            var o=linb(self.activeWndId = profile.domId),
                //in ie, .children can't get the same thread added node(modal div,  here)
                t1=o.topZindex(),
                t2=o.zIndex();
            o.zIndex(t1>t2?t1:t2);

            profile.addTagClass('TITLE','-focus');
            profile.addTagClass('CMDS','-focus');
            self.activeWndId = profile.$id;
        },
        deActive:function(profile){
            var profile;
            if(profile=linb.UI._cache[this.activeWndId]){
                profile.removeTagClass('TITLE','-focus');
                profile.removeTagClass('CMDS','-focus');
            }
            delete this.activeWndId;
        },
        modal:function(profile){
            var s=profile.root,temp,p=s.parent(),cover;
            if(!p.isEmpty()){
                if(!profile.$inModal){
                    if(!profile.$modalDiv)
                        profile.$modalDiv=new linb.UI.Div({
                            position:'absolute'
                        }).setCustomAppearance({
                            KEY:'overflow:hidden;display:block;z-index:0;cursor:wait;background-image:url('+linb.ini.path+'bg.gif)'
                        });

                    cover = profile.$modalDiv;
                    p.attach(cover);
                    cover.setDock('cover',true);
                    cover=cover.reBoxing();
                    cover.display('block').onMousedown(function(){return false}).topZindex(true);
                    s.zIndex((parseInt(cover.zIndex())||0)+1);

                    //bak dlg tabzindnex
                    var hash={},a=profile.root.dig('*',function(o){return o.tabIndex>0}).get();
                    for(var i=0,o;o=a[i++];){
                        (hash[o.tabIndex] = hash[o.tabIndex]||[]).push(o);
                        o.tabIndex=-1;
                    }
                    //save others tabzindex
                    var h = profile.$focusHash={}, b=linb([document.body],false).dig('*',function(o){return o.tabIndex>0}).get();
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
                    linb.event.focusHook.push([profile.domNode, function(){linb([profile.domNode]).nextFocus()}]);

                    profile.$inModal=true;
                }
            }
        },
        unModal:function(profile){
            if(profile.$inModal){
                profile.$modalDiv.setDock('none');
                profile.getSubNode('BORDER').addLast(profile.$modalDiv.reBoxing().display('none'));

                profile.$inModal=false;

                var hash=profile.$focusHash,h;
                for(var i in hash){
                    h=hash[i];
                    for(var j in h)
                        h[j].tabIndex=i;
                }
                _.breakO(profile.$focusHash,2);
                linb.event.focusHook.pop();
            }
        },
        refreshRegion:function(profile){
            if(!profile.root) return;
            return _.merge(profile.properties, profile.root.getRegion(), 'all');
        },

        _adjust:function(dialog,caption, content){
            caption = caption ||'';
            if(!content){
                content = caption;
                caption = "";
            }

            var node = dialog.$div.reBoxing(),
            ID='linb:temp:dialog',
            me=arguments.callee;

            if(!linb.dom.byId(ID)){
                n2 = me._cache=node.clone(false);
                linb([document.body]).addLast(n2);
                n2.setStyle({width:'auto',height:'auto',overflow:'visible',position:'absolute',visibility:'visible',left:linb.dom.hide_value})
                .id(ID,true);
            }
            var n2 = me._cache;
            n2.html(content,false);
            var size = n2.cssSize();

            node.html(content);

            if(size.width>500){
                size.width=500;
                node.width(500);
                size.height = node.offsetHeight() + 10;
            }
            if(size.height>400)size.height=400;
            if(size.width<50)size.width=50;
            if(size.height<20)size.height=20;

            node.cssSize(size).overflow('auto').show();

            dialog.setCaption(caption).setWidth(size.width + 30).setHeight(size.height+80);
            dialog.$cmd.reBoxing().left((size.width + 30 - dialog.$cmd.reBoxing().width())/2);
        },
        alert:function(caption, content, onOK){
            var me=arguments.callee, dialog = me.dialog;
            //for reset
            me.onOK=onOK;
            if(!dialog){
                dialog = me.dialog = new linb.UI.Dialog({
                    caption:caption||'Alert',
                    minBtn:false,
                    maxBtn:false,
                    pinBtn:false,
                    resizable:false,
                    left:200,
                    top:200
                },{
                    beforeClose:function(){
                        dialog.$div.reBoxing().html('',false);
                        dialog.hide();
                        _.tryF(me.onOK);
                        me.onOK=null;
                        return false;
                    }
                });
                linb.SC('linb.UI.Button');
                var cmd = new linb.UI.Div({
                    bottom:10,
                    width:60,
                    height:24,
                    CA:{KEY:'overflow:visible'}
                });
                dialog.$cmd=cmd;

                var btn = new linb.UI.Button({
                    caption:'OK',
                    width: 60,
                    tabindex:1
                },
                {
                    onClick:function(){
                        dialog.$div.reBoxing().html('',false);
                        dialog.hide();
                        _.tryF(onOK);
                    }
                });
                cmd.attach(btn);
                dialog.$btn=btn;

                var div = new linb.UI.Div({
                    left:10,
                    top:10,
                    CA:{KEY:'overflow:visible'}
                });
                dialog.$div=div;
                dialog.attach(cmd).attach(div).create();
            }
            this._adjust(dialog,caption, content);
            dialog.show(linb([document.body],false),true);
            _.asyRun(function(){
                dialog.$btn.activate();
            });
        },
        confirm:function(caption, content, onYes, onNo){
            var me=arguments.callee, dialog = me.dialog;
            me.onYes=onYes, me.onNo=onNo;
            if(!dialog){
                dialog = me.dialog = new linb.UI.Dialog({
                    caption:caption||'Alert',
                    minBtn:false,
                    maxBtn:false,
                    pinBtn:false,
                    resizable:false,
                    left:200,
                    top:200
                },{
                    beforeClose:function(){
                        dialog.$div.reBoxing().html('',false);
                        dialog.hide();
                        _.tryF(me.onNo);
                        me.onNo=null;
                        return false;
                    }
                });
                linb.SC('linb.UI.Button');
                var cmd = new linb.UI.Div({
                    bottom:10,
                    width:140,
                    height:24
                });
                dialog.$cmd=cmd;

                var btn = new linb.UI.Button({
                    caption:'Yes',
                    width: 60,
                    tabindex:1,
                    left:0
                },
                {
                    onClick:function(){
                        dialog.$div.reBoxing().html('',false);
                        _.tryF(me.onYes);
                        me.onYes=null;
                        dialog.hide();
                    }
                });
                cmd.attach(btn);

                btn = new linb.UI.Button({
                    caption:'No',
                    tabindex:1,
                    width: 60,
                    left:80
                },
                {
                    onClick:function(){
                        dialog.$div.reBoxing().html('',false);
                        _.tryF(me.onNo);
                        me.onNo=null;
                        dialog.hide();
                    }
                });
                cmd.attach(btn);
                dialog.$btn=btn;

                var div = new linb.UI.Div({
                    left:10,
                    top:10
                }).setCustomAppearance({
                    KEY:'overflow:visible'
                });
                dialog.$div=div;
                dialog.attach(cmd).attach(div).create();
            }
            this._adjust(dialog, caption, content);
            dialog.show(linb([document.body],false), true);
            _.asyRun(function(){
                dialog.$btn.activate();
            });
        },
        pop:function(caption, content){
            var me=arguments.callee, dialog = me.dialog;
            if(!dialog){
                    dialog = new linb.UI.Dialog({
                    caption:caption||'Alert',
                    minBtn:false,
                    maxBtn:false,
                    pinBtn:false,
                    resizable:false,
                    left:200,
                    top:200
                });
                linb.SC('linb.UI.Button');
                var cmd = new linb.UI.Div({
                    bottom:10,
                    width:60,
                    height:24
                });
                dialog.$cmd=cmd;

                var btn = new linb.UI.Button({
                    caption:'OK',
                    tabindex:1,
                    width: 60
                },
                {
                    onClick:function(){
                        dialog.destroy();
                    }
                });
                cmd.attach(btn);
                dialog.$btn=btn;
                var div = new linb.UI.Div({
                    left:10,
                    top:10
                }).setCustomAppearance({
                    KEY:'overflow:visible'
                });
                dialog.$div=div;
                dialog.attach(cmd).attach(div).create();;
            }

            this._adjust(dialog, caption, content);
            dialog.show(linb([document.body],false));
            _.asyRun(function(){
                dialog.$btn.activate();
            });
        },
        //todo:
        prompt:function(caption){
        },
        //
        resize:function(profile,w,h){
            var size = arguments.callee.upper.apply(this,arguments),
                region={},
                v1=profile.getSubNode('TITLE'),
                v2=profile.getSubNode('PANEL'),
                v3=profile.getSubNode('STATUS'),
                bh,bw;
            if(h){
                bh = size.height,
                h1=v1.height(), h3=v3.height();
                region.top=h1;
                if(bh-h1-h3>0)
                    region.height = bh-h1-h3;
            }
            if(w){
                bw = size.width;
                region.width=bw;
            }
            v2.setRegion(region, true);

            if(bw)
                v1.add(v3).width(bw);
        }
    }
});
