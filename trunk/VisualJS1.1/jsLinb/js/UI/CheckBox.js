Class("linb.UI.CheckBox", "linb.UI.Button",{
    Instance:{
        activate:function(){
            var p = this.get(0);
            p.getSubNode('FOCUS').focus();
            return this;
        },
        setCtrlValue:function(value){
            if(_.isNull(value) || !_.exists(value))value=false;

            return this.each(function(profile){
                if(value)
                    profile.addTagClass('MARK', '-checked');
                else
                    profile.removeTagClass('MARK', '-checked');
            });
        },
        //update UI face
        setDirtyMark:function(){
            return this.each(function(profile){
                if(!profile.domNode)return;
                var properties = profile.properties,
                    o=profile.getSubNode('CAPTION'),
                    flag=properties.value !== properties.$UIvalue,
                    d = linb.UI.$css_tag_dirty;

                if(o.beforeDirtyMark && false===o.boxing().beforeDirtyMark(profile,flag))
                    return;

                if(flag)
                    o.addClass(d);
                else
                    o.removeClass(d);
            });
        }
    },
    Initialize:function(){
        //modify default template for shell
        var t = this.getTemplate('default');
        _.merge(t.FRAME.BORDER.FOCUS.BOX,{
            MARK:{
                $order:0
            }
        },'all');
        this.setTemplate('default',t);
    },
    Static:{
        Appearances:{'default':{
            KEY:{
                'font-family': '"Verdana", "Helvetica", "sans-serif"',
                'font-size':'12px',
                border:0,
                cursor:'pointer',
                'background-color':'#fff'
            },
            BORDER:{},
            /*a*/
            FOCUS:{
                overflow:'hidden',
                display:'block',
                position:'absolute',
                left:0,
                top:0,
                'z-index':'200',
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
                position:'absolute',
                'white-space':'nowrap'
            },
            MARK:{
               cursor:'pointer',
               width:'16px',
               height:'16px',
               background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -112px top', null, 'linb.UI.Public')
            },
            'MARK-mouseover':{
                $order:1,
                'background-position': '-112px -17px'
            },
            'MARK-mousedown':{
                $order:2,
                'background-position': '-112px -34px'
            },
            'MARK-checked':{
                $order:3,
                'background-position': '-96px top'
            },
            'MARK-checked-mouseover':{
                $order:4,
                'background-position': '-96px -17px'
            },
            'MARK-checked-mousedown':{
                $order:5,
                'background-position': '-96px -34px'
            },
            ICON:{
            /**/
                cursor:'pointer',
                width:'16px',
                height:'16px',
                margin:'0 4px 0 0'
            },

            CAPTION:{
                'vertical-align':'top'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{KEY:'MARK'},
            _clickEffect:{KEY:'MARK'},
            _focusHook:{FOCUS:1},
            onClick:function(profile, e, src){
                var p=profile.properties,b=profile.boxing();
                if(p.disabled)return false;
                //onClick event
                b.updateUIValue(!p.$UIvalue);

                if(profile.onChecked)b.onChecked(profile, p.$UIvalue);
                profile.getSubNode('FOCUS').focus();
            },
            FOCUS:{
                onKeydown:function(profile, e, src){
                    var key = linb.event.getKey(e)[0];
                    if(key =='space' || key=='enter'){
                        profile.getSubNode('KEY').onClick(true);
                        return false;
                    }
                }
            }
        }},
        DataModel:{
            value:false,
            hAlign:'left',
            toggleKey:null
        },
        EventHandlers:{
            beforeDirtyMark:function(profile, flag){},
            onClick:null,
            onToggle:null,
            onChecked:function(profile, value){}
        }
    }
});
