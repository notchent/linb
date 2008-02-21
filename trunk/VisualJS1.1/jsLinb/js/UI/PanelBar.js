Class("linb.UI.PanelBar", ["linb.UI.Div","linb.UI.iContainer"],{
    Instance:{
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
    Static:{
        cssNone:false,
        Dropable:['PANEL'],
        Dragable:['HANDLE'],
        Templates:{'default':{
            tagName : 'div',
            style:'{_style}',
            BORDER:{
                tagName : 'div',
                HANDLE:{
                    tagName: 'a',
                    href :"javascript:;",
                    tabindex: '{tabindex}',
                    style:'{handleDisplay};height:{handleHeight}px',
                    TOGGLE:{
                        className: ' {toggleCls}',
                        style:'{toggleDisplay}',
                        $order:0
                    },
                    ICON:{
                        style:'background:url({icon}) transparent  no-repeat {iconPos}; {iconDisplay}',
                        $order:0
                    },
                    CAPTION:{
                        text : '{caption}',
                        className:"{disabled}",
                        $order:1
                    },
                    CMDS:{
                        OPT:{
                            style:'{optDisplay}',
                            $order:1
                        },
                        LAND:{
                            style:'{landDisplay}',
                            $order:1
                        },
                        CLOSE:{
                            style:'{closeDisplay}',
                            $order:2
                        }
                    }
                },
                PANEL:{
                    $order:1,
                    tagName : 'div',
                    style:'{panelDisplay}',
                    text:'{html}'+linb.UI.$childTag
                }
            }
        }},
        Appearances:{'default':{
            PANEL:{
                position:'relative',
                left:0,
                top:0,
                overflow:'auto',
                'background-color':'#fff'
            },
            HANDLE:{
                display:'block',
                'white-space':'nowrap',
                background: linb.UI.getCSSImgPara('barvbg.gif', ' repeat-x left top', null, 'linb.UI.Public'),
                height:'22px',
                position:'relative',
                left:0
            },
            'HANDLE-mouseover':{
                $order:1,
                'background-position' : 'right -22px'
            },
            'TOGGLE, ICON':{
                width:'16px',
                height:'16px',
                margin:'2px'
            },
            CMDS:{
                position:'absolute',
                top:0,
                right:0,
                'text-align':'right',
                'vertical-align': 'middle',
                height:'100%',
                cursor:'default'
            },
            'CMDS   span':{
                position:'relative',
                margin:'5px 4px 2px 0',
                width:'15px',
                height:'15px',
                'vertical-align': 'middle',
                cursor:'default'
            },
            TOGGLE:{
                cursor:'default',
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -176px top', null, 'linb.UI.Public')
            },
            'TOGGLE-mouseover':{
                $order:2,
                'background-position': '-176px -15px'
            },
            'TOGGLE-mousedown':{
                $order:3,
                'background-position': '-176px -30px'
            },
            'TOGGLE-checked':{
                $order:4,
                'background-position': '-161px top'
            },
            'TOGGLE-checked-mouseover':{
                $order:5,
                'background-position': '-161px -15px'
            },
            'TOGGLE-checked-mousedown':{
                $order:6,
                'background-position': '-161px -30px'
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
            CAPTION:{
                margin: '2px 0 2px 5px',
                'font-size':'12px'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{HANDLE:'HANDLE', OPT:'OPT', CLOSE:'CLOSE',LAND:'LAND', TOGGLE:'TOGGLE'},
            _clickEffect:{CLOSE:'CLOSE', OPT:'OPT', LAND:'LAND', TOGGLE:'TOGGLE'},
            onRewh:function(profile, e, src){
                var o = profile.root,w=null,h=null;
                if(e.height)h=o.height();
                if(e.width)w=o.width();
                profile.box.resize(profile, w, h);
            },
            OPT:{
                onClick:function(profile, e, src){
                    profile.boxing().onTriggerOption(profile, e, src);
                }
            },
            TOGGLE:{
                onClick:function(profile, e, src){
                    profile.box._toggle(profile, !profile.properties.toggle);
                }
            },
            CLOSE:{
                onClick:function(profile, e, src){
                    var properties = profile.properties;
                    if(properties.disabled)return;
                    var instance = profile.boxing();

                    if(false===instance.beforeClose(profile, src)) return;

                    instance.destroy();

                    //for design mode in firefox
                    return false;
                }
            },
            LAND:{
                onClick:function(profile, e, src){
                    var properties=profile.properties;
                    if(properties.disabled)return;
                    var pos = profile.root.absPos(), size=profile.root.cssSize();

                    var pro = linb.UI.Dialog.getDefaultProp();
                    _.merge(pro, properties, 'with');
                    _.merge(pro,{
                        dock:'none',
                        width:size.width,
                        height:size.height,
                        left:pos.left,
                        top:pos.top
                    },'all');
                    var dialog = new linb.UI.Dialog(pro);
                    linb(document.body).attach(dialog);

                    profile.children.each(function(o){
                        dialog.attach(o[0]);
                    });
                    profile.boxing().destroy();

                    //for design mode in firefox
                    return false;
                }
            }
        }},
        DataModel:{
            position:'absolute',
            zIndex:0,
            dock:'fill',
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode('HANDLE').tabIndex(value);
                }
            },
            dragKey:'',
            html:{
                ini:'',
                action:function(v){
                    this.getSubNode('PANEL').html(v);
                }
            },
            handleHeight:{
                ini:22,
                action:function(v){
                    this.getSubNode('HANDLE').display(v?'':'none');
                }
            },
            caption:linb.UI.Widget.getDataModel('caption'),
            icon:linb.UI.Widget.getDataModel('icon'),
            iconPos:linb.UI.Widget.getDataModel('iconPos'),
            toggle:{
                ini:true,
                action:function(v){
                    this.box._toggle(this, v);
                }
            },
            optBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('OPT').display(v?'':'none');
                }
            },
            toggleBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('TOGGLE').display(v?'':'none');
                }
            },
            closeBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('CLOSE').display(v?'':'none');
                }
            },
            landBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('LAND').display(v?'':'none');
                }
            }
        },
        EventHandlers:{
            beforeClose:function(profile, src){},
            onIniPanelView:function(profile){},
            onFold:function(profile){},
            onOpen:function(profile){},
            onTriggerOption:function(profile, e, src){}
        },
        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);
            var data=profile.data, nodisplay='display:none';

            data.panelDisplay = data.toggle?'':nodisplay;
            data.toggleCls = data.toggle?'':profile.getClass('TOGGLE','-checked');

            data.toggleDisplay = data.toggleBtn?'':nodisplay;
            data.optDisplay = data.optBtn?'':nodisplay;
            data.closeDisplay = data.closeBtn?'':nodisplay;
            data.landDisplay = data.landBtn?'':nodisplay;
            data.handleDisplay = data.handleHeight?'':nodisplay;
        },
        resize:function(profile,w,h){
            if(h && parseInt(profile.domNode.style.height)){
                profile.getSubNode('BORDER').height(h);
                profile.getSubNode('PANEL').height(h-profile.properties.handleHeight);
            }
            //for performance
            if(w && parseInt(profile.domNode.style.width))
                profile.getSubNode('PANEL').width(w);
        },

        _toggle:function(profile, value){
            var p=profile.properties, b=profile.boxing();
            //set toggle mark
            p.toggle = value;

            //event
            if(value &&!profile.$ini){
                if(b.onIniPanelView)b.onIniPanelView(profile);
                profile.$ini=true;
            }
            if(value)
                b.onOpen(profile);
            else
                b.onFold(profile);

            //show/hide/panel
            profile.getSubNode('PANEL').display(value?'':'none');
            //chang toggle button
            if(p.toggleBtn){
                if(value)
                    profile.removeTagClass('TOGGLE','-checked');
                else
                    profile.addTagClass('TOGGLE','-checked');
            }
        }
    }
});
