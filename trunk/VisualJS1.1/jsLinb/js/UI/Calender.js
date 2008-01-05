Class('linb.UI.Calender', 'linb.UI.iWidget', {
    Instance:{
        setCtrlValue:function(value){
            return this.each(function(profile){
                if(!profile.domNode)return;

                var instance = profile.boxing(),
                    cls = profile.box,
                    p = profile.properties,
                    uiv = p.$UIvalue,
                    arr1=cls._ensureV(uiv),
                    arr2=cls._ensureV(value),
                    id=profile.serialId,
                    keys=profile.keys
                    ;

                if(arr1[0])
                    cls._uncheck(linb.dom.byId(profile.getNodeId(keys.HI, id, arr1[0])));
                cls._check(linb.dom.byId(profile.getNodeId(keys.HI, id, arr2[0])));

                if(arr1[1])
                    cls._uncheck(linb.dom.byId(profile.getNodeId(keys.MI, id, arr1[1])));
                cls._check(linb.dom.byId(profile.getNodeId(keys.MI, id, arr2[1])));

                profile.getSubNode('CAPTION').html(cls._showV(profile,arr2),false);
            });
        },
        setValue:function(value,flag){
            var upper = arguments.callee.upper;
            return this.each(function(profile){
                var box=profile.box;
                upper.apply(profile.boxing(),[box._ensureV(value).join(':'), flag]);
            });
        },
    },
    Initialize:function(){
        this.mapKeys(['MI','HI']);

        var a=[],
            cls=this._excls,
            id=linb.UI.$ID,
            e=linb.event.eventhandler,
            t1='<span id="'+this.KEY+'-HI:'+id+':@" class="'+cls+'" onmouseover="'+e+'" onmouseout="'+e+'" onclick="'+e+'"   onselectstart="return false" >@</span>',
            t2='<span id="'+this.KEY+'-MI:'+id+':@" class="'+cls+'" onmouseover="'+e+'" onmouseout="'+e+'" onclick="'+e+'"   onselectstart="return false" >@</span>',
            i,h,m;

        for(i=0;i<24;i++)
            a[a.length]=t1.replace(/@/g,i<10?'0'+i:i);
        h=a.join('');
        a.length=0;

        for(i=0;i<60;i++)
            a[a.length]=t2.replace(/@/g,i<10?'0'+i:i);
        m=a.join('');
        a.length=0;

        this.setTemplate('default',{
            tagName : 'div',
            style:'{_style}',
            BORDER:{
                tagName : 'div',
                BAR:{
                    $order:0,
                    tagName:'div',
                    CAPTION:{
                        text : '{caption}',
                        $order:1
                    },
                    CMDS:{
                        CLOSE:{
                            style:'{closeDisplay}'
                        }
                    }
                },
                CON:{
                    $order:1,
                    tagName:'div',
                    H:{
                        $order:0,
                        tagName:'div',
                        text:h
                    },
                    M:{
                        $order:1,
                        tagName:'div',
                        text:m
                    }
                }
            }
        });
    },
    Static:{
        _excls:'linbex-timepicker',
        _excls_mo:'linbex-timepicker-mouseover',
        _excls_c:'linbex-timepicker-checked',
        _mover:function(src){
            var b=this,cn=src.className;
            if(cn.indexOf(b._excls_mo)==-1)
                src.className=cn + ' ' + b._excls_mo;
        },
        _mout:function(src){
            var b=this,cn=src.className;
            if(cn.indexOf(b._excls_mo)!=-1)
                src.className=cn.replace(b._excls_mo,'');
        },
        _check:function(src){
            var b=this,cn=src.className;
            if(cn.indexOf(b._excls_c)==-1)
                src.className=cn + ' ' + b._excls_c;
            b._mout(src);
        },
        _uncheck:function(src){
            var b=this,cn=src.className;
            if(cn.indexOf(b._excls_c)!=-1)
                src.className=cn.replace(b._excls_c,'');
        },
        Appearances:{'default':{
            'BAR,CON':{
                position:'relative'
            },
            BAR:{
                'white-space':'nowrap',
                background: linb.UI.getCSSImgPara('barvbg.gif', ' repeat-x left top', null, 'linb.UI.Public'),
                height:'22px',
                'text-align':'center'
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
            CAPTION:{
                'margin-top':'2px',
                'font-weight':'bold'
            },
            'CMDS span':{
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
            CON:{
                height:'103px',
                padding:'2px',
                border:'1px solid #91A7B4'
            },
            'H,M':{
                position:'relative',
                'float':'left',
                'border-left':'1px solid #91A7B4',
                'border-top':'1px solid #91A7B4'
            },
            H:{
                'background-color':'#FFFACD',
                width:'88px'
            },
            M:{
                'margin-left':'8px',
                width:'220px'
            },
            '.linbex-timepicker':{
                'font-size':"12px",
                'padding-left':'3px',
                width:'18px',
                height:'16px',
                'border-right':'1px solid #91A7B4',
                'border-bottom':'1px solid #91A7B4'
            },
            '.linbex-timepicker-mouseover':{
                $order:1,
                'background-color': '#d9e8fb'
            },
            '.linbex-timepicker-checked':{
                $order:2,
                'background-color':'#316AC5',
                color:'#fff'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{CLOSE:'CLOSE'},
            _clickEffect:{CLOSE:'CLOSE'},

            HI:{
                onMouseover:function(profile, e, src){
                    profile.box._mover(src);
                },
                onMouseout:function(profile, e, src){
                    profile.box._mout(src);
                },
                onClick:function(profile, e, src){
                    var uiV=profile.properties.$UIvalue,
                        a=uiV.split(':');
                    if(!a[1])a[1]='00';
                    a[0]=profile.getSubSerialId(src.id)
                    profile.boxing().updateUIValue(a.join(':'));
                }
            },
            MI:{
                onMouseover:function(profile, e, src){
                    profile.box._mover(src);
                },
                onMouseout:function(profile, e, src){
                    profile.box._mout(src);
                },
                onClick:function(profile, e, src){
                    var uiV=profile.properties.$UIvalue,
                        a=uiV.split(':');
                    if(!a[0])a[0]='00';
                    a[1]=profile.getSubSerialId(src.id);
                    profile.boxing().updateUIValue(a.join(':'));
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
            }
        }},
        DataModel:{
            value:'00:00',
            closeBtn:{
                ini:true,
                action:function(v){
                    this.getSubNode('CLOSE').display(v?'':'none');
                }
            }
        },
        EventHandlers:{
            beforeClose:function(profile, src){}
        },
        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);
            var data=profile.data, nodisplay='display:none';
            data.closeDisplay = data.closeBtn?'':nodisplay;
        },
        createdTrigger:function(){
            var self=this, p=self.properties, o=self.boxing();
            p.$UIvalue = p.value;
        },
        _ensureV:function(v){
            var a = v.split(':'),
                b=[];
            b[0]= parseFloat(a[0])||0;
            b[1]=parseFloat(a[1])||0;
            if(b[0]<0)b[0]=0;
            if(b[0]>23)b[0]=23;
            if(b[1]<0)b[1]=0;
            if(b[1]>59)b[1]=59;

            b[0]=(b[0]<=9?'0':'')+b[0];
            b[1]=(b[1]<=9?'0':'')+b[1];

            return b;
        },
        _showV:function(profile, a){
            var f=profile.CF;
            if(typeof f.formatCaption == 'function')
                return f.formatCaption(a);
            else
                return a.join(':');
        }
    }
});