Class("linb.UI.Group",["linb.UI.Widget", "linb.UI.iForm"],{
    Instance:{
        activate:function(){
            var profile = this.get(0);
            profile.getSubNode(profile.keys.LEGEND).focus();
            return this;
        }
    },
    Initialize:function(){
        var t = this.getTemplate('default');
        _.merge(t.FRAME.BORDER,{
            FIELDSET:{
                tagName : 'fieldset',
                style:'{width}{height}',
                LEGEND:{
                    tagName : 'legend',
                    ICON:{
                        tagName : 'span',
                        style:'background:url({icon}) transparent  no-repeat {iconPos};{iconDisplay}',
                        $order:0
                    },
                    CAPTION : {
                        tagName : 'a',
                        href :"javascript:;",
                        tabindex: '{tabindex}',
                        text:   '{caption}',
                        $order:1
                    }
                }
            },
            PANEL:{
                $order:1,
                tagName:'div',
                text:linb.UI.$childTag
            }
        },'all');
        this.setTemplate('default',t);
    },
    Static:{
        Dropable:['PANEL'],
        Appearances:{'default':{
            FIELDSET:{
                border:'1px solid #CCCCCC',
                'background-color':'#fff',
                position:'relative'
            },
            PANEL:{
                position:'absolute',
                top:'0',
                left:'0',
                width:'100%',
                height:'100%',
                overflow:'auto'
            },
            LEGEND:{
                'margin-left':'3px'
            },
            CAPTION:{
                'font-family': '"Verdana", "Helvetica", "sans-serif"',
                'font-size':'12px',
                'line-height':'18px'
            },
            ICON:{
                width:'16px',
                height:'16px',
                'vertical-align':'middle',
                margin:'0 4px 0 0'
            }
        }},
        EventHandlers:{
            beforeValueSet:null,
            afterValueSet:null,
            beforeValueUpdated:null,
            afterValueUpdated:null,
            beforeHoverEffect:null,
            beforeClickEffect:null,
            beforeNextFocus:null
        },
        DataModel:{
            width:100,
            height:100,
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode(this.keys.CAPTION).tabIndex(value);
                }
            },
            $border:1
        },
        Behaviors:{'default':{
            _focusHook:{CAPTION:1}
        }},
        resize:function(profile,w,h){
            var size = arguments.callee.upper.apply(this,arguments);
            var t,
                v = profile.getSubNode(profile.keys.FIELDSET),
                p = profile.getSubNode(profile.keys.PANEL);
            if(!_.isNull(w)){
                v.width(t=(size.width-2));
                p.width(t);
            }
            if(!_.isNull(h)){
                v.height(t=(size.height - 2));
                p.top(20).height(t-20);
            }
        }
    }
});