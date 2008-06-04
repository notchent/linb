Class("linb.UI.Fieldset", ["linb.UI.Div","linb.UI.iContainer"],{
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
            FIELDSET:{
                tagName : 'fieldset',
                className: ' {toggleCls}',
                LEGEND:{
                    tagName : 'legend',
                    HANDLE:{
                        tagName: 'a',
                        href :"javascript:;",
                        tabindex: '{tabindex}',
                        TOGGLE:{},
                        CAPTION : {
                            text:   '{caption}',
                            $order:1
                        }
                    }
                },
                PANEL:{
                    $order:1,
                    tagName:'div',
                    style:'{panelDisplay}',
                    text:'{html}'+linb.UI.$childTag
                }
            }
        }},
        Appearances:{'default':{
            KEY:{
                zoom:linb.browser.ie6?"1":null
            },
            FIELDSET:{
                border:'1px solid #CCCCCC',
                'background-color':'#fff',
                position:'relative',
                overflow:'hidden',
                zoom:linb.browser.ie6?"1":null
            },
            'FIELDSET-checked':{
                $order:2,
                'padding-left':'2px',
                'border-left':'0',
                'border-right':'0',
                'border-bottom':'0'
            },
            LEGEND:{
                'margin-left':'3px'
            },
            PANEL:{
                position:'relative',
                overflow:'auto',
                width:linb.browser.ie6?"100%":null,
                'background-color':'#fff'
            },
            'FIELDSET-checked PANEL':{
                $order:4,
                display:'none'
            },
            TOGGLE:{
                width:'16px',
                height:'16px',
                background: linb.UI.getCSSImgPara('icon.gif', ' no-repeat left -28px', null, 'linb.UI.Public')
            },
            'FIELDSET-checked TOGGLE':{
                $order:4,
                'background-position': ' left -16px'
            }
        }},
        Behaviors:{'default':{
            onRewh:function(profile, e, src){
                var o = profile.root,w=null,h=null;
                if(e.height)h=o.height();
                if(e.width)w=o.width();
                profile.box.resize(profile, w, h);
            },
            HANDLE:{
                onClick:function(profile, e, src){
                    profile.box._toggle(profile, !profile.properties.toggle);
                    return false;
                }
            }
        }},
        DataModel:{
            position:'absolute',
            zIndex:0,
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
            caption:linb.UI.Widget.getDataModel('caption'),
            toggle:{
                ini:true,
                action:function(v){
                    this.box._toggle(this, v);
                }
            }
        },
        renderedTrigger:function(){
            var self=this, t=self.properties, b=self.box;
            if(t.toggle)
                b._toggle(self,t.toggle);
        },        
        EventHandlers:{
            onIniPanelView:function(profile){},
            onFold:function(profile){},
            onOpen:function(profile){}
        },
        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);
            var data=profile.data, nodisplay='display:none';

            data.panelDisplay = data.toggle?'':nodisplay;
            data.toggleCls = data.toggle?'':profile.getClass('FIELDSET','-checked');
        },
        resize:function(profile,w,h){
            if(h && parseInt(profile.domNode.style.height)){
                profile.getSubNode('FIELDSET').height(h);
                profile.getSubNode('PANEL').height(h-profile.getSubNode('LEGEND').height());
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
            if(value &&!profile.$ini)
                if(b.onIniPanelView)
                    if(b.onIniPanelView(profile)!==false)
                        profile.$ini=true;

            if(value){
                if(false===b.onOpen(profile))return;
            }else{
                if(false===b.onFold(profile))return;
            }

            //show/hide/panel
            profile.getSubNode('PANEL').display(value?'':'none');
            //chang toggle button
            if(value)
                profile.removeTagClass('FIELDSET','-checked');
            else
                profile.addTagClass('FIELDSET','-checked');
        }
    }
});
