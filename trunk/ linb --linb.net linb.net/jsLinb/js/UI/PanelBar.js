Class("linb.UI.PanelBar", ["linb.UI.Div","linb.UI.iContainer"],{
    Instance:{
        removePanel:function(){
            this.destroy();
        },
        getPanelPara:function(){
            return this.get(0).properties;
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
            style:'{left}{top}{width}{height}{right}{bottom}{zIndex}{position}',
            BORDER:{
                tagName : 'div',
                HANDLE:{
                    tagName: 'a',
                    href :"javascript:;",
                    tabindex: '{tabindex}',
                    style:'{handleDisplay};height:{handleHeight}px',
                    ICON:{
                        tagName : 'span',
                        style:'background:url({icon}) transparent  no-repeat {iconPos}; {iconDisplay}',
                        $order:0
                    },
                    CAPTION:{
                        tagName : 'span',
                        text : '{caption}',
                        className:"{disabled}",
                        $order:1
                    },
                    CMDS:{
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
                },
                PANEL:{
                    $order:1,
                    tagName : 'div',
                    text:'{html}'+linb.UI.$childTag
                }
            }
        }},
        Appearances:{'default':{
            PANEL:{
                position:'absolute',
                left:'0',
                top:'0',
                overflow:'auto',
                'background-color':'#fff'
            },
            HANDLE:{
                display:'block',
                cursor:'pointer',
                'white-space':'nowrap',
                background: linb.UI.getCSSImgPara('barvbg.gif', ' repeat-x left top', null, 'linb.UI.Public'),
                height:'22px',
                'padding-left':'3px',
                left:'0'
            },
            'HANDLE-mouseover':{
                $order:1,
                'background-position' : 'right -22px'
            },
            ICON:{
                width:'16px',
                height:'16px',
                margin:'2px'
            },
            CMDS:{
                position:'absolute',
                top:'0',
                right:'0',
                'text-align':'right',
                'vertical-align': 'middle',
                height:'100%',
                cursor:'default'
            },
            'CLOSE, LAND':{
                position:'relative',
                margin:'5px 4px 2px 0',
                width:'15px',
                height:'15px',
                'vertical-align': 'middle',
                cursor:'default'
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
                margin: '2px',
                'font-size':'12px'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{HANDLE:'HANDLE',CLOSE:'CLOSE',LAND:'LAND'},
            _clickEffect:{CLOSE:'CLOSE',LAND:'LAND'},
            onResize:function(profile, e, src){
                var o = profile.root,w=null,h=null;
                if(e.height)h=o.height();
                if(e.width)w=o.width();
                profile.box.resize(profile, w, h);
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
        EventHandlers:{
            beforeClose:function(profile, src){}
        },
        DataModel:{
            position:'absolute',
            zIndex:0,
            dock:'fill',
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode(this.keys.HANDLE).tabIndex(value);
                }
            },
            dragKey:'',
            html:{
                ini:'',
                action:function(v){
                    this.getSubNode(this.keys.PANEL).html(v);
                }
            },
            titleHeight:{
                ini:22,
                action:function(v){
                    this.getSubNode(this.keys.HANDLE).display(v?'':'none');
                }
            },
            caption:linb.UI.Widget.getDataModel('caption'),
            icon:linb.UI.Widget.getDataModel('icon'),
            iconPos:linb.UI.Widget.getDataModel('iconPos'),
            closeBtn:{
                ini:true,
                action:function(v){
                    this.getSubNode(this.keys.CLOSE).display(v?'':'none');
                }
            },
            landBtn:{
                ini:true,
                action:function(v){
                    this.getSubNode(this.keys.LAND).display(v?'':'none');
                }
            }
        },
        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);
            var data=profile.data;
            data.closeDisplay = data.closeBtn?'':'display:none';
            data.landDisplay = data.landBtn?'':'display:none';
            data.handleDisplay = data.titleHeight?'':'display:none';
            data.handleHeight = data.titleHeight;
        },
        resize:function(profile,w,h){
            profile.getSubNode(profile.keys.BORDER).cssSize({ width :w?w:null, height :h?h:null});
            var off = profile.properties.titleHeight;
            profile.getSubNode(profile.keys.PANEL).setRegion({top:off, width :w?w:null, height : h? (h-off) : null}, true);
        }
    }
});
