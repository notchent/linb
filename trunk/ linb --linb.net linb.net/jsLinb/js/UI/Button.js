Class("linb.UI.Button", ["linb.UI.Widget", "linb.UI.iForm"],{
    Instance:{
        _border:function(key, args){
            args = args || {};
            args.borderActive=true;
            return arguments.callee.upper.call(this, key, args);
        },
        activate:function(){
            var profile = this.get(0);
            profile.getSubNode(profile.keys.FOCUS).focus();
            return this;
        },
        setCtrlValue:function(value){
            if(_.isNull(value) || !_.exists(value))value=false;
            return this.each(function(profile){
                if(!profile.properties.toggleKey)return;
                var key=profile.keys.BORDER;
                if(value)
                    profile.addTagClass(profile.getSubNode(key), key, '-checked');
                else
                    profile.removeTagClass(profile.getSubNode(key), key, '-checked');

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
                href :"javascript:;",
                tabindex: '{tabindex}',
                BOX:{
                    tagName:'span',
                    ICON:{
                        $order:1,
                        tagName : 'span',
                        style:'background:url({icon}) transparent no-repeat  {iconPos};{iconDisplay}'
                    },
                    CAPTION:{
                        $order:2,
                        tagName : 'span',
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
                left:'0',
                top:'0',
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
                profile.getSubNode(profile.keys.FOCUS).focus();

                if(p.toggleKey){
                    profile.boxing().updateUIValue(!p.$UIvalue);
                    if(profile.onToggle)
                        profile.boxing().onToggle(profile, e, profile.properties.$UIvalue, p.toggleKey);
                }

                //onClick event
                if(profile.onClick)
                    profile.boxing().onClick(profile, e, profile.properties.$UIvalue);

                return false;
            }
        }},
        DataModel:{
            hAlign:{
                ini:'center',
                listbox:['left','center','right'],
                action: function(v){
                    var c=this.getSubNode(this.keys.BOX), t=this.properties;
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
                    var c=this.getSubNode(this.keys.BOX), t=this.properties;
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
                    if(this.domNode)
                        this.getSubNode(this.keys.FOCUS).tabIndex(value);
                }
            },
            value:false,
            toggleKey:'',
            width:120,
            height:20,
            $border:1
        },
        createdTrigger:function(){
            var properties = this.properties, o=this.boxing();
            if(properties.hAlign!='left')o.setHAlign(properties.hAlign,true);
            if(properties.vAlign!='top')o.setVAlign(properties.vAlign,true);
            //set value later
            if(properties.toggleKey && properties.value)
                o.setValue(true, true);
        },
        EventHandlers:{
            onClick:function(profile, e, value){},
            onToggle:function(profile, e, value, toggleKey){}
        }
    }
});