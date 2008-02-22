Class("linb.UI.Label", ["linb.UI.Widget", "linb.UI.iForm"],{
    Instance:{
        _shadowText:function(key){
            return this.each(function(o){
                o.getSubNode('SHADOW').display('block');
            });
        },
        _unShadowText:function(key){
            return this.each(function(o){
                o.getSubNode('SHADOW').display('none');
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
                    var self=this,p=self.properties,b=self.boxing(),k=self.keys;
                    self.getSubNodes(['CAPTION','SCAPTION']).html(value,false);
                    if(p.hAlign!='left')b.setHAlign(p.hAlign,true);
                    if(p.vAlign!='top')b.setVAlign(p.vAlign,true);
                }
            },
            // setIcon and getIcon
            icon:{
                ini:'',
                action: function(value){
                    var self=this,k=self.keys;
                    self.getSubNodes(['ICON','SICON'])
                        .display(value?'':'none')
                        .setStyle('backgroundImage','url('+(value||'')+')');
                }
            },
            iconPos:{
                ini:'',
                action: function(value){
                    var self=this,k=self.keys;
                    self.getSubNodes(['ICON','SICON'])
                        .setStyle(backgroundPosition, value);
                }
            },
            shadowText:{
                ini:false,
                action: function(v){
                    var b=this.boxing();
                    //for string input
                    v = String(v).toLowerCase()!='false';
                    if(v)
                        b._shadowText(v);
                    else
                        b._unShadowText();
                }
            },
            hAlign:{
                ini:'right',
                listbox:['left','center','right'],
                action: function(v){
                    var self=this,c=self.getSubNode('BOX'),
                        d=self.getSubNode('SHADOW'),
                        t=self.properties;
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
                    var self=this,c=self.getSubNode('BOX'),
                        d=self.getSubNode('SHADOW'),
                        t=self.properties;
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
                    var self=this;
                    self.getSubNodes(['CAPTION','SCAPTION'])
                        .setStyle('fontSize', value);
                }
            },
            'fontWeight':{
                ini:'',
                action: function(value){
                    var self=this;
                    self.getSubNodes(['CAPTION','SCAPTION'])
                        .setStyle('fontWeight', value);
                }
            },
            width:60,
            height:20,

            _textSshadowSize:4
        },
        createdTrigger:function(){
            var p = this.properties, o=this.boxing();
            if(p.fontSize)o.setFontSize(p.fontSize,true);
            if(p.fontWeight)o.setFontWeight(p.fontWeight,true);
            if(p.shadowText)o.setShadowText(true,true);
        },
        renderedTrigger:function(){
            var p = this.properties, o=this.boxing(),s=p.shadowText;
            if(p.hAlign!='left' || s)o.setHAlign(p.hAlign,true);
            if(p.vAlign!='top'|| s)o.setVAlign(p.vAlign,true);
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