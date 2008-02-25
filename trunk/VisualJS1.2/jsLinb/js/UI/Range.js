/*
300: ruler width
30: ruler height
15: ruler shadow height

15: indicator width => 8: indicator offset
14: indicator height
*/
Class("linb.UI.Range", ["linb.UI.iWidget"],{
    Instance:{
        setCtrlValue:function(value){
            return this.each(function(profile){
                var p=profile.properties,
                    tpl=p.titleTpl,
                    fun=function(k){return profile.getSubNode(k)},
                    fun1=function(a,i){a.cssPos({left:profile[i], top: box.x2y(profile[i])}) },
                    fun2=function(o,v){o.get(0).style.width = v +'px'},
                    title = fun('CAPTION'),
                    a=fun('IND1'),
                    b=fun('IND2'),
                    r1 = fun('RULER1'),
                    r3 = fun('RULER3'),
                    box = profile.box,
                    arr = box._ensureV(value);

                profile._rate= 300/(p.max-p.min);
                //use Math.round
                profile._v1= Math.round((arr[0]-p.min) /  (p.max-p.min) *300) - 8 ;
                profile._v2= Math.round((1-(p.max - arr[1]) /  (p.max-p.min)) *300) -8;

                //text value
                title.html(box._buildTpl(p.single,tpl, arr,p.unit),false);
                //indicator position
                fun1(a, '_v1');
                fun1(b,'_v2');
                //background div width
                fun2(r1, profile._v1 + 8);
                fun2(r3, 300 - profile._v2 - 8);
            });
        },
        setValue:function(value,flag){
            var upper = arguments.callee.upper;
            return this.each(function(profile){
                var p = profile.properties,
                    arr = profile.box._ensureV(value),
                    min=p.min,
                    max=p.max,
                    a=[];
                a[0] = arr[0];
                a[1] = arr[1];
                a[0] = a[0]<min?min:a[0];

                a[1] = a[1]>max?max:a[1];
                value = a.join(':');
                upper.apply(profile.boxing(),[value, flag]);
            });
        },
        setDirtyMark:function(){
            return this.each(function(profile){
                if(!profile.domNode)return;
                var properties = profile.properties,
                    o=profile.getSubNode('CAPTION'),
                    flag=properties.value !== properties.$UIvalue,
                    cls=linb.UI.$css_tag_dirty;

                if(o.beforeDirtyMark && false===o.boxing().beforeDirtyMark(profile,flag))
                    return;

                if(flag)
                    o.addClass(cls);
                else
                    o.removeClass(cls);
            });
        }
    },
    Static:{
        Templates:{'default':{
            style:'{_style}',
            BOX:{
                tagName:'div',
                RULER:{
                    tagName:'div',
                    IND1:{
                        style:'{_single}'
                    },
                    IND2:{},
                    RULER1:{
                        style:'{_single}'
                    },
                    RULER3:{}
                },
                TAIL:{
                    tagName:'div',
                    CAPTION:{
                        tagName:'div'
                    },
                    MIN:{
                        text:'{min}'
                    },
                    MAX:{
                        text:'{max}'
                    }
                }
            }
        }},
        Appearances:{'default':{
            KEY:{
                background:'#fff'
            },
            'KEY, RULER, IND1, IND1':{
                'font-size':0,
                'line-height':0,
                position:'relative'
            },
            BOX:{
                position:'absolute',
                left:0,
                top:0,
                width:'300px'
            },
            'CAPTION, IND1, TAIL, MIN':{
                'font-size':'12px',
                'line-height':'12px'
            },
            RULER:{
                $order:1,
                position:'relative',
                height:'30px',
                overflow:'visible',
                'margin-bottom':'3px',
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat left -241px', null, 'linb.UI.Public')
            },
            'RULER1, RULER3':{
                position:'absolute',
                top:0,
                height:'30px',
                width:'300px'
            },
            RULER1:{
                left:0,
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat left -271px', null, 'linb.UI.Public')
            },
            RULER3:{
                right:0,
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat right -271px', null, 'linb.UI.Public')
            },
            'IND1,IND2':{
                'z-index':'2',
                width:'15px',
                height:'14px',
                position:'absolute'
            },
            IND1:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat left -226px', null, 'linb.UI.Public'),
                left:'-8px',
                top:'11px'
            },
            IND2:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -15px -226px', null, 'linb.UI.Public'),
                left:'268px',
                top:'1px'
            },
            TAIL:{
                $order:2,
                width:'300px',
                position:'relative'
            },
            CAPTION:{
                position:'relative',
                'text-align':'center'
            },
            MIN:{
                position:'absolute',
                left:0,
                top:0
            },
            MAX:{
                position:'absolute',
                right:0,
                top:0
            }
        }},
        Behaviors:{'default':{
            IND1:{
                onMousedown:function(profile, e, src){
                    var p=profile.properties,
                        box=profile.box,
                        arr = box._ensureV(p.$UIvalue);

                    linb([src]).startDrag(e,{
                        type:'move',
                        move:true,
                        horizontal:true,
                        offset_left: Math.floor(profile._v1 + 8),
                        offset_right: Math.floor(profile._v2-profile._v1),
                        cursor:'default'
                    });
                    linb([src]).zIndex(10);
                    profile.getSubNode('IND2').zIndex(5);
                },
                onDrag:function(profile, e, src){
                    profile.box._ondrag.apply(profile.box,[profile,e,src,0]);
                },
                onDragstop:function(profile, e, src){
                    var p=profile.properties,
                        box=profile.boxing(),
                        rate = profile._rate,
                        d=linb.dragDrop,f,
                        arr = p.$UIvalue.split(':');
                    profile._v1=d.proxyPos.left;
                    arr[0]= (profile._v1+8)/rate + p.min;

                    if(f=profile.onValueFormat)
                        arr[0]=f.call(profile.host,profile,arr[0]);
                    else
                        arr[0]=Math.floor(arr[0]);

                    box.updateUIValue(arr.join(':'));

                    if(profile._v1==profile._v2){
                        linb([src]).zIndex(10);
                        profile.getSubNode('IND2').zIndex(5);
                    }
                }
            },
            IND2:{
                onMousedown:function(profile, e, src){
                    var p=profile.properties,
                        box=profile.box,
                        arr = box._ensureV(p.$UIvalue);

                    linb([src]).startDrag(e,{
                        type:'move',
                        move:true,
                        horizontal:true,
                        offset_left: Math.floor(profile._v2-profile._v1),
                        offset_right: Math.floor(300 - profile._v2 - 8),
                        cursor:'default'
                    });
                    linb([src]).zIndex(10);
                    profile.getSubNode('IND1').zIndex(5);
                },
                onDrag:function(profile, e, src){
                    profile.box._ondrag.apply(profile.box,[profile,e,src,1]);
                },
                onDragstop:function(profile, e, src){
                    var p=profile.properties,
                        box=profile.boxing(),
                        rate = profile._rate,
                        d=linb.dragDrop,f,
                        arr = p.$UIvalue.split(':');
                    profile._v2=d.proxyPos.left;
                    arr[1]= (profile._v2+8)/rate + p.min;

                   if(f=profile.onValueFormat)
                        arr[1]=f.call(profile.host,profile,arr[1]);
                    else
                        arr[1]=Math.floor(arr[1]);

                    box.updateUIValue(arr.join(':'));
                }
            }
        }},
        DataModel:{
            position:'absolute',
            width:300,
            height:56,
            min:{
                ini:0,
                action:function(){
                    this.boxing().refresh();
                }
            },
            max:{
                ini:100,
                action:function(){
                    this.boxing().refresh();
                }
            },
            unit:'',
            titleTpl:'{1}{u} - {2}{u}',
            value:'0:100',
            single:{
                ini:false,
                action:function(v){
                    this.boxing().refresh();
                }
            }
        },
        EventHandlers:{
            onValueFormat:function(profile, value){return Math.floor(value)}
        },
        createdTrigger:function(){
            var prop = this.properties;
            prop.$UIvalue = prop.value;
            if(prop.value)
                this.boxing().setCtrlValue(prop.value);
        },

        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);
            var d=profile.data,p=profile.properties,
                arr=profile.box._ensureV(p.value);
            d._single = p.single?'display:none':'';

            p.min=parseFloat(p.min);
            p.max=parseFloat(p.max);

            d.min = d.min + p.unit;
            d.max = d.max + p.unit;

        },
        _ensureV:function(v){
            var a = v.split(':'),
                b=[],
                fun=function(a){return parseFloat(a)};
            b[0]= fun(a[0]);
            b[1]=fun(a[1]);
            return b;
        },
        _buildTpl:function(single,tpl,arr,unit){
            return single?
              arr[1] + unit
            : tpl.replace(/\{1\}/g,arr[0]).replace(/\{2\}/g,arr[1]).replace(/\{u\}/g,unit);
        },
        x2y:function(x){
            return Math.floor(15 + 1 - (x+8) * (15/300));
        },
        _ondrag:function(profile, e, src, tag){
            var p=profile.properties,
                d=linb.dragDrop,
                box=profile.box,
                fun=function(k){return profile.getSubNode(k)},
                fun2=function(o,v){o.get(0).style.width = v +'px'},
                cap = fun('CAPTION'),
                r1 = fun('RULER1'),
                r3 = fun('RULER3'),
                t,f,
                arr=this._ensureV(p.$UIvalue);

             //adjust top
            src.style.top = this.x2y(d.proxyPos.left) + 'px';

            t = (d.proxyPos.left+8)/profile._rate + p.min;

            if(f=profile.onValueFormat)
                t=f.call(profile.host,profile,t);
            else
                t=Math.floor(t);

            if(tag){
                arr[1] = t;
                fun2(r3, 300 - d.proxyPos.left - 8);
            }else{
                arr[0] = t;
                fun2(r1, d.proxyPos.left + 8);
            }
             cap.html(box._buildTpl(p.single, p.titleTpl, arr,p.unit),false);
        }
    }
});