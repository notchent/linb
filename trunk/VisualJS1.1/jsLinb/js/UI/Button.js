Class("linb.UI.Button", ["linb.UI.Widget", "linb.UI.iForm"],{
    Instance:{
        _border:function(key, args){
            args = args || {};
            args.borderActive=true;
            return arguments.callee.upper.call(this, key, args);
        },
        activate:function(){
            var profile = this.get(0);
            profile.getSubNode('FOCUS').focus();
            return this;
        },
        setCtrlValue:function(value){
            if(_.isNull(value) || !_.exists(value))value=false;
            return this.each(function(profile){
                if(!profile.properties.toggleKey)return;
                if(value)
                    profile.addTagClass('BORDER', '-checked');
                else
                    profile.removeTagClass('BORDER','-checked');

                if(profile.properties.border){
                    var b = profile.boxing().getBorder();
                    if(b)b.setChecked(value);
                }
            });
        }
    },
    Initialize:function(){
        //modify default template for shell
        var t = this.getTemplate('default');
        _.merge(t.FRAME.BORDER,{
            FOCUS:{
                tagName:'a',
                href :"{href}",
                tabindex: '{tabindex}',
                BOX:{
                    ICON:{
                        $order:1,
                        style:'background:url({icon}) transparent no-repeat  {iconPos};{iconDisplay}'
                    },
                    CAPTION:{
                        $order:2,
                        text: '{caption}',
                        className:"{disabled}"
                    }
                }
            }
        },'all');
        this.setTemplate('default',t);

        t = this.getAppearance('default');
        var n = _.copy(t);
        _.merge(n, {
                'BORDER':{
                    $order:0,
                    'text-decoration':'underline',
                    'cursor':'pointer'
                },
                'BORDER-mouseover':{
                    $order:1,
                    'font-weight': 'bold'
                },
                'BORDER-mousedown':{
                    $order:1,
                    'font-style': 'italic'
                }
        }, 'all');
        this.setAppearance('link',n);
    },
    Static:{
        Appearances:{'default':{
            KEY:{
                'font-size':'12px',
                'line-height':'12px'
            },
            BORDER:{
                border:'solid 1px #eee',
                'background-color':'#f4f4f4'
            },
            'BORDER-mouseover':{
                $order:1,
                'border-color':'#fff #cdcdcd #cdcdcd #fff'
            },
            'BORDER-mousedown, BORDER-checked':{
                $order:2,
                'border-color':'#cdcdcd #fff #fff #cdcdcd',
                'background-color':'#fff'
            },
            ICON:{
                width:'16px',
                height:'16px',
                margin:'0 4px 0 0'
            },


            /*a*/
            FOCUS:{
                overflow:'hidden',
                display:'block',
                position:'absolute',
                left:0,
                top:0,
                'z-index':'20',
                width:'100%',
                height:'100%',
                '-moz-outline-offset':'-1px !important'
            },
            /*span*/
            BOX:{
                display:linb.browser.gek?['-moz-inline-block', '-moz-inline-box']: 'inline-block',
                'font-size':'12px',
                'line-height':'14px',
                overflow:'hidden',
                'white-space':'nowrap',
                position:'absolute'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{KEY:['BORDER']},
            _clickEffect:{KEY:['BORDER']},
            _focusHook:{FOCUS:1},
            onClick:function(profile, e, src){
                var p=profile.properties;
                if(p.disabled)return false;

                //before event
                profile.getSubNode('FOCUS').focus();

                var b=profile.boxing();

                if(p.toggleKey){
                    b.updateUIValue(!p.$UIvalue);
                    if(profile.onToggle)
                        b.onToggle(profile, e, p.$UIvalue, p.toggleKey);
                }

                //onClick event
                if(profile.onClick)
                    b.onClick(profile, e, p.$UIvalue);

            }
        }},
        DataModel:{
            hAlign:{
                ini:'center',
                listbox:['left','center','right'],
                action: function(v){
                    var self=this, c=self.getSubNode('BOX'), t=self.properties;
                    switch(v){
                        case 'left':
                            c.setStyle({left:0,right:'auto','marginLeft':'auto'});
                            break;
                        case 'right':
                            c.setStyle({left:'auto',right:0,'marginLeft':'auto'});
                            break;
                        case 'center':
                            //for performance, not call getStyle here, widget with must be set in <style>
                            c.setStyle({left:'50%',right:'auto','marginLeft':-1*c.get(0).offsetWidth/2+'px'});
                            break;
                    }
                }
            },
            vAlign:{
                ini:'top',
                listbox:['top','middle','bottom'],
                action: function(v){
                    var self=this, c=self.getSubNode('BOX'), t=self.properties;
                    switch(v){
                        case 'top':
                            c.setStyle({top:0,bottom:'auto','marginTop':'auto'});
                            break;
                        case 'bottom':
                            c.setStyle({top:'auto',bottom:0,'marginTop':'auto'});
                            break;
                        case 'middle':
                            //for performance, not call getStyle here, widget with must be set in <style>
                            c.setStyle({top:'50%',bottom:'auto','marginTop':-1*c.get(0).offsetHeight/2+'px'});
                            break;
                    }
                }
            },
            tabindex:{
                action:function(value){
                    var self=this;
                    if(self.domNode)
                        self.getSubNode('FOCUS').tabIndex(value);
                }
            },
            href:'javascript:;',
            value:false,
            toggleKey:'',
            width:120,
            height:20,
            $border:1
        },
        createdTrigger:function(){
            var p = this.properties, o=this.boxing();
            //set value later
            if(p.toggleKey && p.value)
                o.setValue(true, true);
        },
        renderedTrigger:function(){
            var p = this.properties, o=this.boxing();
            if(p.hAlign!='left')o.setHAlign(p.hAlign,true);
            if(p.vAlign!='top')o.setVAlign(p.vAlign,true);
        },
        EventHandlers:{
            onClick:function(profile, e, value){},
            onToggle:function(profile, e, value, toggleKey){}
        }
    }
});