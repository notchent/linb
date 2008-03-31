Class('linb.UI.ColorPicker', 'linb.UI.iWidget', {
    Instance:{
        setCtrlValue:function(value){
            return this.each(function(profile){
                if(!profile.domNode)return;
                var cls = profile.box,
                    p = profile.properties,
                    v=cls.ensureV(value),
                    hex = cls._to3(v),
                    rgb = cls.hex2rgb(v),
                    hsv = cls.rgb2hsv(rgb),
                    f=function(s,v){profile.getSubNode(s).get(0).firstChild.nodeValue=String(v)},
                    ff=function(v){return Math.round(v*100)};

                f('R',rgb[0]);
                f('G',rgb[1]);
                f('B',rgb[2]);
                f('HH',hsv[0]);
                f('S',ff(hsv[1]));
                f('V',ff(hsv[2]));
                f('H',hex[0]);
                f('E',hex[1]);
                f('X',hex[2]);
                cls._reExamShow(profile);
           });
        }
    },
    Initialize:function(){
        var ns=this,
            e=linb.event.eventhandler,
            id=linb.UI.$ID,
            cls=linb.UI.$CLS,
            key=ns.KEY,
            list=ns._slist,
            l=list.length,
            i,data,
            arr=[],
            evs=' unselectable="on" onmousedown="'+e+'" ondrag="'+e+'" ondragstop="'+e+'" ';

        ns.mapKeys(['TXT', 'DD1', 'DD2', 'DD3','R','G','B','HH','S','V','H','E','X']);

        //simple list
        for(i=0;i<l;i++)
            arr.push('<a  '+'id="'+key+'-SC:'+id+':'+list[i]+'" href="javascript:;" onmouseover="'+e+'"  onkeydown="'+e+'" onclick="'+e+'" style="background-color:#'+list[i]+'">'+list[i]+'</a>');

        //data
        data = '<div><span class="'+cls+'-txt">R: </span><span '+'id="'+key+'-R:'+id+':" class="'+cls+'-dd2 #DD2_CC#" '+evs+'>R</span><span style="width:8px;height:8px"  unselectable="on" ></span><span class="'+cls+'-txt">H: </span><span '+'id="'+key+'-HH:'+id+':" class="'+cls+'-dd2 #DD2_CC#" '+evs+'>H</span><span>\xB0</span></div>' +
               '<div><span class="'+cls+'-txt">G: </span><span '+'id="'+key+'-G:'+id+':" class="'+cls+'-dd2 #DD2_CC#" '+evs+'>G</span><span style="width:8px;height:8px"  unselectable="on" ></span><span class="'+cls+'-txt">S: </span><span '+'id="'+key+'-S:'+id+':" class="'+cls+'-dd2 #DD2_CC#"  '+evs+'>S</span><span>%</span></div>' +
               '<div><span class="'+cls+'-txt">B: </span><span '+'id="'+key+'-B:'+id+':" class="'+cls+'-dd2 #DD2_CC#" '+evs+'>B</span><span style="width:8px;height:8px"  unselectable="on" ></span><span class="'+cls+'-txt">V: </span><span '+'id="'+key+'-V:'+id+':" class="'+cls+'-dd2 #DD2_CC#" '+evs+'>V</span><span>%</span></div>' +
               '<div><span style="width:38px">HEX: #</span><span '+'id="'+key+'-H:'+id+':" class="'+cls+'-dd3 #DD3_CC#" '+evs+'>H</span><span '+'id="'+key+'-E:'+id+':" class="'+cls+'-dd3 #DD3_CC#" '+evs+'>E</span><span '+'id="'+key+'-X:'+id+':" class="'+cls+'-dd1 #DD1_CC#" '+evs+'>X</span></div>'
        ns.setTemplate('default',{
            style:'{_style}',
            tagName : 'div',
            TOP:{
                $order:0,
                tagName:'div',
                DATA:{
                    $order:0,
                    tagName:'div',
                    onselectstart:'return false',
                    text:data
                },
                EXAM:{
                    $order:1,
                    tagName:'div'
                }
            },
            SIMPLE:{
               $order:1,
               tagName:'div',
               text: arr.join('')
            }
        });
    },
    Static:{
        cssNone:false,
        DataModel:{
            value:"FFFFFF",
            //color name, if exists
            colorName:'#FFFFFF',
            handleHeight : 22,
            tipsHeight : 16,
            headHeight:20,
            closeBtn:{
                ini:true,
                action:function(v){
                    this.getSubNode('CLOSE').display(v?'':'none');
                }
            },
            $borderW:1
        },
        Appearances:{'default':{
            KEY:{
                background:'#FFF',
                '-moz-user-select': linb.browser.gek?'none':null
            },
            DATA:{
                'float':'left',
                width:'112px',
                height:'86px'
            },
            'DATA span':{
                'float':'left'
            },
            'DATA div':{
                'padding-top':'3px',
                'clear':'both'
            },
            TXT:{
                width:'16px'
            },
            EXAM:{
                'float':'left',
                height:'80px',
                width:'80px',
                background:'red',
                'padding-top':'2px',
                'white-space':'wrap',
                'text-align':'center'
            },
            'DD1, DD2, DD3':{
                display:'block',
                height:'16px',
                border:'1px solid #7F9DB9',
                'padding-right':'2px',
                cursor:'e-resize',
                'text-align':'right',
                background:'#FFFACD'
            },
            DD1:{
                width:'16px',
                border:'1px solid #7F9DB9'
            },
            DD2:{
                width:'24px',
                border:'1px solid #7F9DB9'
            },
            DD3:{
                $order:2,
                width:'16px',
                'border-right':'none'
            },
            SIMPLE :{
                width:'192px',
                overflow:'hidden',
                padding:'4px 0 0 5px',
                'line-height':linb.browser.ie6?'0':null,
                'clear':'both'
            },
            'SIMPLE a':{
                height: '9px',
                width: '9px',
                'font-size':linb.browser.ie6?'0':null,
                'float': 'left',
                display: 'block',
                overflow: 'hidden',
                'text-indent': '100px',
                margin: '0',
                cursor: 'pointer',
                border: '1px solid #F6F7EE'
            },
            'SIMPLE a:hover':{
                border: '1px solid black'
            }
        }},
        Behaviors:{'default':{
            SC:{
                onMouseover:function(p,e,s){
                    p.box._setTempUI(p,p.getSubSerialId(s.id));
                },
                onClick:function(p,e,s){
                    var sid=p.getSubSerialId(s.id);
                    p.box._updateUIValue(p,sid);
                    return false;
                }/*,
                onKeydown:function(profile, e, src){
                    var keys=linb.event.getKey(e), key = keys[0], shift=keys[2],
                    cur = linb([src],false),
                    first = profile.root.nextFocus(true, true, false),
                    last = profile.root.nextFocus(false, true, false);

                    switch(linb.event.getKey(e)[0]){
                        case 'tab':
                            if(shift){
                                if(src!=first.get(0)){
                                    first.focus();
                                    return false;
                                }
                            }else{
                                if(src!=last.get(0)){
                                    last.focus();
                                    return false;
                                }
                            }
                            break;
                        case 'left':
                        case 'up':
                            var next = cur.nextFocus(false, true, false);
                            if(cur.get(0)==first.get(0))
                                last.focus();
                            else
                                cur.nextFocus(false);
                            return false;
                            break;
                        case 'right':
                        case 'down':
                            var next = cur.nextFocus(true, false, false);
                            if(cur.get(0)==last.get(0))
                                first.focus();
                            else
                                cur.nextFocus();
                            return false;
                            break;
                        case 'space':
                        case 'enter':
                            linb(src.id).onClick();
                            return false;
                            break;
                    }
                }*/
            },
            SIMPLE:{
                onMouseout:function(p,e,s){
                    p.box._reExamShow(p);
                }
            },
            R:{
                onMousedown:function(p, e, src){
                    p.box._rgbdd1(p,e,src);
                },
                onDrag:function(p, e, src){
                    p.box._rgbdd2(p,e,src,0);
                },
                onDragstop:function(p, e, src){
                    p.box._rgbdd3(p,e,src,0);
                }
            },
            G:{
                onMousedown:function(p, e, src){
                    p.box._rgbdd1(p,e,src);
                },
                onDrag:function(p, e, src){
                    p.box._rgbdd2(p,e,src,1);
                },
                onDragstop:function(p, e, src){
                    p.box._rgbdd3(p,e,src,1);
                }
            },
            B:{
                onMousedown:function(p, e, src){
                    p.box._rgbdd1(p,e,src);
                },
                onDrag:function(p, e, src){
                    p.box._rgbdd2(p,e,src,2);
                },
                onDragstop:function(p, e, src){
                    p.box._rgbdd3(p,e,src,2);
                }
            },
            H:{
            },
            S:{
            },
            V:{
            },
            H:{
            },
            'E':{
            },
            X:{
            }
        }},
        prepareData:function(profile){
            var ns=this;
            arguments.callee.upper.call(ns, profile);
        },

        _slist:"FFFFFF,FFFFF0,FFFFE0,FFFF00,FFFAFA,FFFAF0,FFFACD,FFF8DC,FFF5EE,FFF0F5,FFEFD5,FFEBCD,FFE4E1,FFE4C4,FFE4B5,FFDEAD,FFDAB9,FFD700,FFC0CB,FFB6C1,FFA500,FFA07A,FF8C00,FF7F50,FF69B4,FF6347,FF4500,FF1493,FF00FF,FF00FF,FF0000,FDF5E6,FAFAD2,FAF0E6,FAEBD7,FA8072,F8F8FF,F5FFFA,F5F5F5,F5DEB3,F4A460,F0FFFF,F0FFF0,F0F8FF,F0E68C,F08080,EEE8AA,EE82EE,E9967A,E6E6FA,E1FFFF,DEB887,DDA0DD,DCDCDC,DC143C,DB7093,DAA520,DA70D6,D8BFD8,D3D3D3,D2B48C,D2691E,CD853F,CD5C5C,C71585,C0C0C0,BDB76B,BC8F8F,BA55D3,B22222,B0E0E6,B0C4DE,AFEEEE,ADFF2F,ADD8E6,A9A9A9,A52A2A,A0522D,9932CC,98FB98,9400D3,9370DB,90EE90,8FBC8F,8B4513,8B008B,8B0000,8A2BE2,87CEFA,87CEEB,808080,808000,800080,800000,7FFFAA,7FFF00,7CFC00,7B68EE,778899,708090,6B8E23,6A5ACD,696969,6495ED,5F9EA0,556B2F,4B0082,48D1CC,483D8B,4682B4,4169E1,40E0D0,3CB371,32CD32,2F4F4F,2E8B57,228B22,20B2AA,1E90FF,191970,00FFFF,00FFFF,00FF7F,00FF00,00FA9A,00CED1,00BFFF,008B8B,008080,008000,006400,0000FF,0000CD,00008B,000080,000000".split(','),
        C16:"0123456789ABCDEF",
        //for drag rgb span
        _rgbdd1:function(profile, e, src){
            var p=profile.properties,
                cls=profile.box,
                f=function(){return cls.hex2rgb(p.$UIvalue)}
            linb([src]).setStyle('background','red').startDrag(e, {
                type:'blank',
                move:false,
                grid_width:2,
                cursor:true
            });
            profile.$temp=0;
            profile.$start = f();
            profile.$temp2 = f();
        },
        _rgbdd2:function(profile, e, src, i){
            var count,
                off = linb.dragDrop.getOffset(),
                p=profile.properties,
                old=profile.$temp2,
                cls=profile.box,v;

            count=parseInt(profile.$start[i])+parseInt(off.x/2);
 
            count=(count%256+256)%256;
            if(profile.$temp!=count){
                old[i]=profile.$temp=count;
                linb([src]).text(count);
                v=cls.rgb2hex(old);
                cls._setTempUI(profile,v);
            }
        },
        _rgbdd3:function(profile, e, src, i){                   
            if(profile.$start[i] !== profile.$temp){
                var p=profile.properties,
                    cls=profile.box,
                    old=profile.$start,
                    v;
                old[i]=profile.$temp;
                v=cls.rgb2hex(old);
                cls._updateUIValue(profile,v);

                //resetExam
                cls._reExamShow(profile);
            }
            linb([src]).setStyle('background','');
            profile.$temp=profile.$start=0;
        },
        //set temp UI
        _setTempUI:function(p,v){
            var cls=this,
                rgb=cls.hex2rgb(v),
                b=p.boxing(),
                ex=b.getSubNode('EXAM'),
                hsv=cls.rgb2hsv(rgb),
                vv=linb.getRes('color.SIMPLE.'+v);
            ex.setStyle({backgroundColor:'#'+v, color:hsv[2]>0.6?'#000':'#FFF'});
            ex.text(vv==v?'#'+v:vv);
        },
        //update uivalue
        _updateUIValue:function(profile, v){
            var p=profile.properties,
                cls=this,
                b=profile.boxing(),
                vv=linb.getRes('color.SIMPLE.'+v);
            //set UIvalue
            b.updateUIValue(v,true);
            p.colorName = vv==v?'#'+v:vv;
        },
        //reset example block
        _reExamShow:function(p){
            var cls=p.box,
                ex=p.boxing().getSubNode('EXAM'),
                pro=p.properties,
                sid=pro.$UIvalue,
                rgb=cls.hex2rgb(sid),
                hsv=cls.rgb2hsv(rgb);

            ex.setStyle({backgroundColor:'#'+sid, color:hsv[2]>0.6?'#000':'#FFF'});
            ex.text(pro.colorName);
        },
        _to3:function(s){
            if(!s)s="FFFFFF";
            return [s.substr(0, 2), s.substr(2, 2), s.substr(4, 2)];
        },
        //0...255 to 00...FF
        _toFF: function(n) {
            var C16=this.C16;
            n = parseInt(n)||0;
            n = (n>255||n<0)?0:n;
            return C16.charAt((n-n%16)/16) + C16.charAt(n%16);
        },
        // 00...FF to 0...255
        _to255: function(str) {
            var C16=this.C16, s=str.split('');
            return C16.indexOf(s[0].toUpperCase())*16 + C16.indexOf(s[1].toUpperCase());
        },
        _webSafe:function(r, g, b){
            //safe divisor is 51, smart divisor is 17
            var me=arguments.callee,f=me.f||(me.f=function(n){
                return Math.round(n/51)*51;
            });
            if(typeof r=='object'){
                g=r[1];b=r[2];r=r[0];
            }
            return [f(r),f(g),f(b)];
        },
        ensureV:function(v){
            var ns=this,me=arguments.callee,map=me.map||(me.map=(function(){
                var h={};
                ns.C16.split('').each(function(o,i){
                    h[o]=1;
                });
                return h;
            }()));
            if(!v || typeof v !='string')return 'FFFFFF';
            if(v.charAt(0)=='#')v=v.substr(1,v.length);
            var a='',k;
            for(var i=0;i<6;i++){
                k=v.charAt(i).toUpperCase();
                a += (map[k]?k:'F');
            }
           return a;
        },
        //HSV (h[0-360], s[0-1]), v[0-1] to RGB [255,255,255]
        hsv2rgb: function(h, s, v) {
            var me=arguments.callee, f = me.f ||
                //0-1 to 0-255
                (me.f=function(n) {
                    return Math.min(255, Math.round(n*256));
                }),
                r, g, b, i, k, p, q, t;
            if(typeof r=='object'){
                s=h[1];v=h[2];h=h[0];
            }

            i = Math.floor((h/60)%6);
            k = (h/60)-i;
            p = v*(1-s);
            q = v*(1-k*s);
            t = v*(1-(1-k)*s);
            switch(i) {
                case 0: r=v; g=t; b=p; break;
                case 1: r=q; g=v; b=p; break;
                case 2: r=p; g=v; b=t; break;
                case 3: r=p; g=q; b=v; break;
                case 4: r=t; g=p; b=v; break;
                case 5: r=v; g=p; b=q; break;
            }
            return [f(r), f(g), f(b)];
        },
        // RGB [255,255,255] to HSV (h[0-360], s[0-1]), v[0-1]
        rgb2hsv: function(r, g, b) {
            if(typeof r=='object'){
                g=r[1];b=r[2];r=r[0];
            }
            r=r/255;
            g=g/255;
            b=b/255;
            var min,max,delta,h,s,v;
            min = Math.min(Math.min(r,g),b);
            max = Math.max(Math.max(r,g),b);
            delta = max-min;
            switch (max) {
                case min: h=0; break;
                case r:   h=60*(g-b)/delta;
                          if (g<b)
                              h+=360;
                          break;
                case g:   h=(60*(b-r)/delta)+120; break;
                case b:   h=(60*(r-g)/delta)+240; break;
            }
            s = (max === 0) ? 0 : 1-(min/max);
            return [Math.round(h), s, max];
        },
        //rgb values into a hex string; 255,255,255 -> FFFFFF
        rgb2hex: function(r, g, b) {
            var ns=this;
            if(typeof r=='object'){
                g=r[1];b=r[2];r=r[0];
            }
            return ns._toFF(r) + ns._toFF(g) + ns._toFF(b);
        },
        // Converts a hex string to rgb
        hex2rgb: function(s) {
            var ns=this;
            if(!s)s="FFFFFF";
            return [ns._to255(s.substr(0, 2)), ns._to255(s.substr(2, 2)), ns._to255(s.substr(4, 2))];
        }
    }
})