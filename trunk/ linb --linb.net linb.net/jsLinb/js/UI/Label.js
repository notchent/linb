Class("linb.UI.Label", ["linb.UI.Widget", "linb.UI.iForm"],{
    Instance:{
        _shadowText:function(key){
            return this.each(function(o){
                o.getSubNode(o.keys.SHADOW).display('block');
            });
        },
        _unShadowText:function(key){
            return this.each(function(o){
                o.getSubNode(o.keys.SHADOW).display('none');
            });
        }
    },
    Initialize:function(){
        //modify default template from parent
        var t = this.getTemplate('default');
        _.merge(t.FRAME.BORDER,{
            SHADOW:{
                $order:1,
                style:'display:none;',
                SICON:{
                    style:'background:url({icon}) transparent no-repeat {iconPos};{iconDisplay}',
                    $order:0
                },
                SCAPTION:{
                    text : '{caption}',
                    style:'color:#cdcdcd;',
                    $order:1
                }
            },
            BOX:{
                $order:2,
                ICON:{
                    style:'background:url({icon}) transparent no-repeat {iconPos};{iconDisplay}',
                    $order:0
                },
                CAPTION:{
                    text : '{caption}',
                    $order:1
                }
            }
        },'all');
        this.setTemplate('default',t);
    },
    Static:{
        Appearances:{'default':{
            KEY:{
                'font-size':'12px',
                'line-height':'12px'
            },
            BOX:{
                position:'absolute'
            },
            SHADOW:{
                position:'absolute'
            },
            ICON:{
                width:'16px',
                height:'16px',
                margin:'0 4px 0 0'
            },
            SICON:{
                width:'16px',
                height:'16px',
                margin:'0 4px 0 0'
            }
        }},
        DataModel:{
            tabindex:null,
            // setCaption and getCaption
            caption:{
                // ui update function when setCaption
                action: function(value){
                    this.getSubNode(this.keys.CAPTION).add(this.getSubNode(this.keys.SCAPTION)).html(value,false);
                    if(this.properties.hAlign!='left')this.boxing().setHAlign(this.properties.hAlign,true);
                    if(this.properties.vAlign!='top')this.boxing().setVAlign(this.properties.vAlign,true);
                }
            },
            // setIcon and getIcon
            icon:{
                ini:'',
                action: function(value){
                    this.getSubNode(this.keys.ICON)
                    .add(this.getSubNode(this.keys.SICON))
                        .display(value?'':'none')
                        .setStyle('backgroundImage','url('+(value||'')+')');
                }
            },
            iconPos:{
                ini:'',
                action: function(value){
                    this.getSubNode(this.keys.ICON)
                    .add(this.getSubNode(this.keys.SICON))
                        .setStyle(backgroundPosition, value);
                }
            },
            shadowText:{
                ini:false,
                action: function(v){
                    //for string input
                    v = String(v).toLowerCase()!='false';
                    if(v)
                        this.boxing()._shadowText(v);
                    else
                        this.boxing()._unShadowText();
                }
            },
            hAlign:{
                ini:'right',
                listbox:['left','center','right'],
                action: function(v){
                    var c=this.getSubNode(this.keys.BOX),
                    d=this.getSubNode(this.keys.SHADOW),
                    t=this.properties;
                    switch(v){
                        case 'left':
                            c.setStyle({left:0,right:'auto','marginLeft':'auto'});
                            d.setStyle({left:t._textSshadowSize+'px',right:'auto','marginLeft':'auto'});
                            break;
                        case 'right':
                            c.setStyle({left:'auto',right:t._textSshadowSize+'px','marginLeft':'auto'});
                            d.setStyle({left:'auto',right:0,'marginLeft':'auto'});
                            break;
                        case 'center':
                            c.setStyle({left:'50%',right:'auto','marginLeft':-1*c.get(0).offsetWidth/2+'px'});
                            d.setStyle({left:'50%',right:'auto','marginLeft':-1*c.get(0).offsetWidth/2 + t._textSshadowSize+'px'});
                            break;
                    }
                }
            },
            vAlign:{
                ini:'top',
                listbox:['top','middle','bottom'],
                action: function(v){
                    var c=this.getSubNode(this.keys.BOX),
                    d=this.getSubNode(this.keys.SHADOW),
                    t=this.properties;
                    switch(v){
                        case 'top':
                            c.setStyle({top:0,bottom:'auto','marginTop':'auto'});
                            d.setStyle({top:t._textSshadowSize+'px',bottom:'auto','marginTop':'auto'});
                            break;
                        case 'bottom':
                            c.setStyle({top:'auto',bottom:t._textSshadowSize+'px','marginTop':'auto'});
                            d.setStyle({top:'auto',bottom:0,'marginTop':'auto'});
                            break;
                        case 'middle':
                            c.setStyle({top:'50%',bottom:'auto','marginTop':-1*c.get(0).offsetHeight/2+'px'});
                            d.setStyle({top:'50%',bottom:'auto','marginTop':-1*c.get(0).offsetHeight/2+ t._textSshadowSize+'px'});
                            break;
                    }
                }
            },
            'fontSize':{
                ini:'',
                action: function(value){
                    this.getSubNode(this.keys.CAPTION)
                    .add(this.getSubNode(this.keys.SCAPTION))
                    .setStyle('fontSize', value);
                }
            },
            'fontWeight':{
                ini:'',
                action: function(value){
                    this.getSubNode(this.keys.CAPTION)
                    .add(this.getSubNode(this.keys.SCAPTION))
                    .setStyle('fontWeight', value);
                }
            },
            width:60,
            height:20,

            _textSshadowSize:4
        },
        createdTrigger:function(){
            var properties = this.properties, o=this.boxing();
            if(properties.hAlign!='left' || properties.shadowText)o.setHAlign(properties.hAlign,true);
            if(properties.vAlign!='top'|| properties.shadowText)o.setVAlign(properties.vAlign,true);

            if(properties.fontSize)o.setFontSize(properties.fontSize,true);
            if(properties.fontWeight)o.setFontWeight(properties.fontWeight,true);
            if(properties.shadowText)o.setShadowText(true,true);
        },
        EventHandlers:{
            //hide those events from parent
            beforeValueUpdated:null,
            afterValueUpdated:null,
            beforeValueSet:null,
            afterValueSet:null,
            beforeNextFocus:null
        }
    }
});