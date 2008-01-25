Class('linb.UI.TimePicker', 'linb.UI.iWidget', {
    Instance:{
        setCtrlValue:function(value){
            return this.each(function(profile){
                if(!profile.domNode)return;

                var instance = profile.boxing(),
                    cls = profile.box,
                    p = profile.properties,
                    uiv = p.$UIvalue,
                    arr1=cls.ensureV(uiv),
                    arr2=cls.ensureV(value),
                    id=profile.serialId,
                    keys=profile.keys,
                    byId=linb.dom.byId
                    ;
                profile.$hour=arr2[0];
                if(arr1[1])
                    cls._uncheck(byId(profile.getNodeId(keys.MI, id, arr1[1])));
                cls._check(byId(profile.getNodeId(keys.MI, id, arr2[1])));

                profile.getSubNode('HOUR').html(arr2[0],false);
                profile.getSubNode('CAPTION').html(profile.box._showV(profile,profile.box.ensureV(arr2)),false);
            });
        },
        setValue:function(value,flag){
            var upper = arguments.callee.upper;
            return this.each(function(profile){
                var box=profile.box;
                upper.apply(profile.boxing(),[box.formatValue(value), flag]);
            });
        }
    },
    Initialize:function(){
        this.mapKeys(['MI']);

        var a=[],
            cls=this._excls,
            cls2=this._excls2,
            id=linb.UI.$ID,
            e=linb.event.eventhandler,
            t='<span id="'+this.KEY+'-MI:'+id+':@" class="'+cls+' !" onmouseover="'+e+'" onmouseout="'+e+'" onclick="'+e+'"   unselectable="on" >@</span>',
            i,m;

        for(i=0;i<60;i++)
            a[a.length]=t.replace(/@/g,i<10?'0'+i:i).replace('!',(i%5===0)?cls2:'');
        m=a.join('');
        a.length=0;

        this.setTemplate('default',{
            tagName : 'div',
            onselectstart:'return false',
            style:'{_style}',
            BORDER:{
                tagName : 'div',
                BAR:{
                    $order:0,
                    tagName:'div',
                    CMDS:{
                        tagName:'div',
                        PRE:{$order:0},
                        HOUR:{$order:1,unselectable:'on'},
                        HOURTXT:{$order:2,style:'display:inline'},
                        NEXT:{$order:3}
                    },
                    CMDS2:{
                        CLOSE:{
                            style:'{closeDisplay}'
                        }
                    }
                },
                M:{
                    $order:1,
                    tagName:'div',
                    text:m
                },
                TAIL:{
                    $order:2,
                    style:'height:{tipsHeight}px;',
                    tagName:'div',
                    CAPTION:{
                        text : '{caption}',
                        $order:1
                    }
                }
            }
        });
    },
    Static:{
        _excls:'linbex-timepicker',
        _excls2:'linbex-timepicker2',
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
            KEY:{
                background:'#FFF',
                '-moz-user-select': linb.browser.gek?'none':null
            },
            'BAR,CON':{
                position:'relative'
            },
            BAR:{
                'white-space':'nowrap',
                background: linb.UI.getCSSImgPara('barvbg.gif', ' repeat-x left top', null, 'linb.UI.Public'),
                height:'22px',
                'text-align':'center',
                border: 'solid #C1C1C1',
               'border-width': '1px 1px 0 1px'

            },
            'CMDS, CMDS2':{
                position:'relative',
                height:'100%',
                'vertical-align': 'middle'
            },
            CMDS:{
                'float':'left',
                'padding-left':'4px'
            },
            CMDS2:{
                'float':'right'
            },
            PRE:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat  0 -65px', null, 'linb.UI.Public')
            },
            'PRE-mouseover':{
                $order:2,
                'background-position': '0 -80px'
            },
            'PRE-mousedown':{
                $order:3,
                'background-position': '0 -95px'
            },
            NEXT:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat  -16px -65px', null, 'linb.UI.Public')
            },
            'NEXT-mouseover':{
                $order:2,
                'background-position': '-16px -80px'
            },
            'NEXT-mousedown':{
                $order:3,
                'background-position': '-16px -95px'
            },
            HOUR:{
                $order:3,
                margin:'2px',
                height:'15px',
                width:'16px',
                'font-weight':'bold',
                border:'1px solid #7F9DB9',
                'background-color':'#FFFACD',
                cursor:'e-resize',
                'padding-left':'2px'
            },
            'PRE, NEXT, CLOSE':{
                $order:0,
                position:'relative',
                margin:'2px',
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
            M: {
                position:'relative',
                'border-left':'1px solid #91A7B4',
                'border-top':'1px solid #91A7B4',
                width:'220px'
            },
            TAIL:{
                'white-space':'nowrap',
                'text-align':'center',
                border: 'solid #C1C1C1',
                'border-width': '0 1px 1px 1px'
            },
            '.linbex-timepicker2':{
                'background-color':'#FFFACD'
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
            _hoverEffect:{CLOSE:'CLOSE',PRE:'PRE',NEXT:'NEXT'},
            _clickEffect:{CLOSE:'CLOSE',PRE:'PRE',NEXT:'NEXT'},
            HOUR:{
                onMousedown:function(profile, e, src){
                    linb(src).startDrag(e, {
                        type:'blank',
                        move:false,
                        grid_width:5,
                        cursor:true
                    });
                    profile.$temp2=0;
                },
                onDrag:function(profile, e, src){
                    var count,off = linb.dragDrop.getOffset(),v=profile.properties.$UIvalue,a=v.split(':');
                    a[0]=(parseFloat(a[0])||0)+parseInt(off.x/10);
                    a[0]=(a[0]%24+24)%24;
                    profile.$temp2=(a[0]<=9?'0':'')+a[0];

                    if(v[0]!=profile.$temp2)
                        profile.getSubNode('HOUR').html(profile.$temp2,false);
                },
                onDragend:function(profile, e, src){
                    if(profile.$temp2)
                        profile.$hour=profile.$temp2;
                    profile.$temp2=0;
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
                    var a=[];
                    a[0]=profile.$hour;
                    a[1]=profile.getSubSerialId(src.id);
                    profile.boxing().updateUIValue(a.join(':'),true);
                }
            },
            PRE:{
                onClick:function(profile, e, src){
                    var p = profile.properties;
                    if(p.disabled)return;
                    var v=profile.$hour;
                    v=(parseFloat(v)||0)-1;
                    v=(v%24+24)%24;
                    profile.$hour=v=(v<=9?'0':'')+v;
                    profile.getSubNode('HOUR').html(v,false);
                }
            },
            NEXT:{
                onClick:function(profile, e, src){
                    var p = profile.properties;
                    if(p.disabled)return;
                    var v=profile.$hour;
                    v=(parseFloat(v)||0)+1;
                    v=(v%24+24)%24;
                    profile.$hour=v=(v<=9?'0':'')+v;
                    profile.getSubNode('HOUR').html(v,false);
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
            width:221,
            value:'00:00',
            tipsHeight : 16,
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
            self.getSubNode('HOURTXT').html(linb.wrapRes('date.H'),false);
        },
        formatValue:function(v){
            return this.ensureV(v).join(':');
        },
        ensureV:function(v){
            var a,b=[];
            if(v&& typeof v == 'string')
                a=v.split(':')
            else if(v && typeof v=='object' && v.constructor==Array)
                a=v;
            else a=[];

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