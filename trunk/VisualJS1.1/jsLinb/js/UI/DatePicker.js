/*
*in developing
*/
Class('linb.UI.DatePicker', 'linb.UI.iWidget', {
    Instance:{
        setCtrlValue:function(value){
/*            return this.each(function(profile){
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
*/
        },
        setValue:function(value,flag){
            var upper = arguments.callee.upper;
            return this.each(function(profile){
                var box=profile.box;
                upper.apply(profile.boxing(),[box._ensureV(value).join(':'), flag]);
            });
        }
    },
    Initialize:function(){
        var self=this,
            id=linb.UI.$ID,
            cls=linb.UI.$CLS,
            key=self.KEY;

        self.mapKeys(['H', 'W','D']);

        var colgroup = '<colgroup><col width="2%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/></colgroup>',
            thead1='<thead><tr height="1%"><th class="'+cls+'-h #H_CC#"/>',
            thead2='</tr></thead>',
            th='<th id="'+key+'-H:'+id+':@" class="'+cls+'-h #H_CC#">@</th>',
            tbody1 = '<tbody>',
            tbody2 = '</tbody>',
            tr1='<tr>',
            tr2='</tr>',
            td1='<th id="'+key+'-W:'+id+':@"  class="'+cls+'-w #W_CC#">@</th>',
            td2='<td><div id="'+key+'-D:'+id+':@" class="'+cls+'-d #D_CC#">a</div></td>',
            body,i,j,a=[],b=[];
        for(i=0;i<7;i++)
            b[b.length]= th.replace(/@/g,i);

        for(i=0;i<48;i++){
            j=i%8;
            a[a.length]= (j==0?tr1:'') + (j==0?td1:td2).replace(/@/g,i) + (j===7?tr2:'');
        }

        body=colgroup+thead1+b.join('')+thead2+tbody1+a.join('')+tbody2;

        self.setTemplate('default',{
            tagName : 'div',
            style:'{_style}',
            BORDER:{
                tagName : 'div',
                BAR:{
                    $order:0,
                    style:'height:{barHeight}px;',
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
                BODY:{
                    $order:2,
                    tagName:'table',
                    cellpadding:"0",
                    cellspacing:"0",
                    width:'100%',
                    text:body
                }
            }
        });
    },
    Static:{
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
                overflow:'visible'
            },
            BORDER:{
                overflow: 'visible',
                position: 'relative',
                'border-top': 'solid 1px #C1C1C1',
                'border-left': 'solid 1px #C1C1C1'
            },
            'BAR,BODY':{
                position:'relative'
            },
            BAR:{
                'white-space':'nowrap',
                background: linb.UI.getCSSImgPara('barvbg.gif', ' repeat-x left top', null, 'linb.UI.Public'),
                'text-align':'center',
                'border-right': 'solid 1px #C1C1C1'
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
            'BODY':{
                overflow: 'visible'
            },
            'BODY td,BODY th':{
                'vertical-align':'top',
                border:0,
                'border-right':'solid 1px #C1C1C1',
                'border-bottom':'solid 1px #C1C1C1'
            },
            D:{
                $order:3,
                position:'relative',
                'text-align':'right',
                'padding':'0 1px 0 1px'
            },
            'W,H':{
                $order:3,
                'color':'#333333',
                'background-color':'#F6F6F6',
                'vertical-align':'middle',
                'text-align':'center'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{CLOSE:'CLOSE'},
            _clickEffect:{CLOSE:'CLOSE'},
            onRewh:function(profile, e, src){
                var o = profile.domNode.style,f=parseInt, n=null, w=n, h=n;
                if(e.height)h=f(o.height)||n;
                if(e.width)w=f(o.width)||n;
                if(h || w)profile.box.resize(profile, w, h);
            },
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
            barHeight : 22,
            headHeight:20,
            closeBtn:{
                ini:true,
                action:function(v){
                    this.getSubNode('CLOSE').display(v?'':'none');
                }
            },
            $borderW:1
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

            self.$header=self.getSubNode('H',true);
            self.$week=self.getSubNode('W',true);
            self.$day=self.getSubNode('D',true);
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
        },

        resize:function(profile,w,h){
            var p=profile.properties,
                f=function(k){return profile.getSubNode(k)},
                off=2*p.$borderW,
                t;
            //for border, view and items
            if(h && h!=p.height && parseInt(profile.domNode.style.height)){
                f('BORDER').height(t=h-off);
                f('BODY').height(t=t - p.barHeight);
                t=t - p.headHeight-6;
                profile.$day.height(t/6);
            }
        }
    }
});