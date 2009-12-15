Class("linb.UI.Panel", "linb.UI.Div",{
    Instance:{
        activate:function(flag){
            var profile, cls=this.constructor;
            if(profile=linb.UI._cache['$'+cls.activeWndId])
                profile.getSubNode('TBAR').tagClass('-focus',false);
            delete cls.activeWndId;

            if(flag!==false){
                profile=this.get(0);
                profile.getSubNode('TBAR').tagClass('-focus');
                profile.getSubNode('CAPTION').focus();
                cls.activeWndId=profile.$linbid;
            }
        },
        resetPanelView:function(destroyChildren){
            if(!_.isSet(destroyChildren))destroyChildren=true;
            var ins;
            return this.each(function(profile){
                if(profile.renderId){
                    delete profile.$ini;
                    ins=profile.boxing();
                    ins.removeChildren(true,destroyChildren)
                    if(profile.properties.toggle)
                        ins.setToggle(false);
                }
            });
        }
    },
    Static:{
        Templates:{
            tagName : 'div',
            style:'{_style}',
            BORDER:{
                tagName:'div',
                TBAR:{
                    tagName:'div',
                    className:'uibar-top',
                    BART:{
                        cellpadding:"0",
                        cellspacing:"0",
                        width:'100%',
                        height:'100%',
                        border:'0',
                        tagName:'table',
                        className:'uibar-t',
                        BARTR:{
                            tagName:'tr',
                            BARTDL:{
                                tagName:'td',
                                className:'uibar-tdl'
                            },
                            BARTDM:{
                                $order:1,
                                width:'100%',
                                tagName:'td',
                                className:'uibar-tdm'
                            },
                            BARTDR:{
                                $order:2,
                                tagName:'td',
                                className:'uibar-tdr'
                            }
                        }
                    },
                    BARCMDL:{
                        tagName: 'div',
                        className:'uibar-cmdl',
                        TOGGLE:{
                            className: 'uicmd-toggle {toggleCls}',
                            style:'{toggleDisplay}',
                            $order:0
                        },
                        ICON:{
                            $order:0,
                            className:'ui-icon {imageClass}',
                            style:'{backgroundImage} {backgroundPosition} {backgroundRepeat} {imageDisplay}'
                        },
                        CAPTION:{
                            tagName: 'a',
                            href :"{href}",
                            tabindex: '{tabindex}',
                            text : '{caption}',
                            $order:1
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
                            className:'uiborder-inset',
                            style:'{panelDisplay}',
                            text:'{html}'+linb.UI.$childTag
                        }
                    }
                },
                BBAR:{
                    $order:3,
                    tagName:'div',
                    className:'uibar-bottom-s',
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
            }
        },
        Appearances:{
            KEY:{
                overflow:'hidden',
                background:'transparent'
            },
            'KEY BORDER':{
                zoom:linb.browser.ie6?1:null
            },
            PANEL:{
                position:'relative',
                left:0,
                top:0,
                overflow:'hidden',
                zoom:linb.browser.ie6?1:null
            },

            CAPTION:{
                'font-size':'12px',
                display:'inline',
                'vertical-align':'middle'
            }
        },
        Behaviors:{
            DropableKeys:['PANEL'],
            DragableKeys:['TBAR'],
            HoverEffected:{OPT:'OPT', CLOSE:'CLOSE',LAND:'LAND', TOGGLE:'TOGGLE'},
            ClickEffected:{CLOSE:'CLOSE', OPT:'OPT', LAND:'LAND', TOGGLE:'TOGGLE'},
            onSize:linb.UI.$onSize,
            OPT:{
                onClick:function(profile, e, src){
                    profile.boxing().onShowOptions(profile, e, src);
                }
            },
            TOGGLE:{
                onClick:function(profile, e, src){
                    profile.box._toggle(profile, !profile.properties.toggle);
                    return false;
                }
            },
            CAPTION:{
                onClick:function(profile, e, src){
                    if(!profile.onClickBar || false===profile.boxing().onClickBar(profile,src))
                        return !!linb.Event.getKey(e)[2];
                }
            },
            CLOSE:{
                onClick:function(profile, e, src){
                    var properties = profile.properties;
                    if(properties.disabled)return;
                    var instance = profile.boxing();

                    if(false===instance.beforeClose(profile)) return;

                    instance.destroy();

                    //for design mode in firefox
                    return false;
                }
            },
            LAND:{
                onClick:function(profile, e, src){
                    var properties=profile.properties;
                    if(properties.disabled)return;
                    var pos = profile.getRoot().offset(), size=profile.getRoot().cssSize();

                    var pro = _.copy(linb.UI.Dialog.$DataStruct);
                    _.merge(pro, properties, 'with');
                    _.merge(pro,{
                        dock:'none',
                        width:Math.max(size.width,200),
                        height:Math.max(size.height,100),
                        left:pos.left,
                        top:pos.top
                    },'all');
                    var dialog = new linb.UI.Dialog(pro),arr=[];
                    linb('body').append(dialog);

                    _.arr.each(profile.children,function(o){
                        arr.push(o[0]);
                    });
                    dialog.append(linb.UI.pack(arr,false));

                    profile.boxing().destroy();

                    //for design mode in firefox
                    return false;
                }
            }
        },
        DataModel:{
            position:'absolute',
            zIndex:0,
            dock:'fill',
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
            href:{
                ini:linb.$href,
                action:function(v){
                    this.getSubNode('CAPTION').attr('href',v);
                }
            },
            html:{
                action:function(v){
                    this.getSubNode('PANEL').html(v);
                }
            },
            toggle:{
                ini:true,
                action:function(v){
                    this.box._toggle(this, v);
                }
            },
            optBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('OPT').css('display',v?'':'none');
                }
            },
            toggleBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('TOGGLE').css('display',v?'':'none');
                }
            },
            closeBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('CLOSE').css('display',v?'':'none');
                }
            },
            landBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('LAND').css('display',v?'':'none');
                }
            }
        },
        EventHandlers:{
            beforeClose:function(profile, src){},
            onIniPanelView:function(profile){},
            onFold:function(profile){},
            onExpend:function(profile){},
            onShowOptions:function(profile, e, src){},
            onClickBar:function(profile, src){}
        },
        LayoutTrigger:function(){
            var self=this, t=self.properties, b=self.box;
            if(t.toggle)
                b._toggle(self,t.toggle);
        },
        _prepareData:function(profile){
            var data=arguments.callee.upper.call(this, profile);
            var nodisplay='display:none';

            data.panelDisplay = data.toggle?'':nodisplay;
            data.toggleCls = data.toggle?'uicmd-toggle-checked':'';

            data.toggleDisplay = data.toggleBtn?'':nodisplay;
            data.optDisplay = data.optBtn?'':nodisplay;
            data.closeDisplay = data.closeBtn?'':nodisplay;
            data.landDisplay = data.landBtn?'':nodisplay;
            return data;
        },
        _onresize:function(profile,width,height){
            var isize={},
                v1=profile.getSubNode('TBAR'),
                v2=profile.getSubNode('PANEL'),
                v4=profile.getSubNode('BBAR'),
                v5=profile.getSubNode('MAIN'),
                v6=profile.getSubNode('MAINI'),
                h1,h4,t;
            if(height){
                if(height=='auto')
                    isize.height=height;
                else{
                    h1=v1.height(), h4=v4.height();
                    if((t=height-h1-h4)>0)
                        isize.height=t-2;
                }
            }
            if(width)
                isize.width=width-(parseInt(v6.css('paddingRight'))||0)-(parseInt(v5.css('paddingLeft'))||0);
            v2.cssSize(isize, true);
        },

        _toggle:function(profile, value){
            var p=profile.properties, b=profile.boxing();
            //set toggle mark
            p.toggle = value;

            //event
            if(value &&!profile.$ini)
                if(b.onIniPanelView)
                    if(b.onIniPanelView(profile)!==false)
                        profile.$ini=true;

            if(value){
                if(false===b.onExpend(profile))return;
            }else{
                if(false===b.onFold(profile))return;
            }

            //show/hide/panel
            profile.getSubNode('PANEL').css('display',value?'':'none');
            //chang toggle button
            if(p.toggleBtn)
                profile.getSubNode('TOGGLE').tagClass('-checked', !!value);
        }
    }
});
