Class('linb.UI.TimeLine', ['linb.UI.iWidget','linb.UI.iList','linb.UI.iSchedule'], {
    Instance:{
        afterInsertItems:function(profile){
            profile.box._reArrage(profile);
        }
    },
    Static:{
        cssNone:false,
        Templates:{'default':{
            tagName:'div',
            style:'{_style}',
            BORDER:{
                tagName:'div',
                style:'height:{_bHeight}px;width:{_bWidth}px;',
                FOCUS:{tagName:'button'},
                BAR:{
                    tagName:'div',
                    style:'height:{barHeight}px;',
                    CMDS:{
                        tagName:'div',
                        DATE:{$order:0},
                        TASK:{$order:1},
                        PRE:{$order:2},
                        'ZOOMIN':{$order:3},
                        'ZOOMOUT':{$order:4},
                        NEXT:{$order:5}
                    },
                    CMDS2:{
                        tagName:'div',
                        OPT:{
                            style:'{optDisplay}',
                            $order:0
                        },
                        CLOSE:{
                            $order:4,
                            style:'{closeDisplay}'
                        }
                    }
                },
                BAND:{
                    $order:2,
                    tagName:'div',
                    style:'left:{_band_left}px;width:{_band_width}px;',
                    LABELST:{
                        tagName:'div',
                        style:'height:{mark1Height}px;z-index:3;',
                        text:"{_mark1}"
                    },
                    LABELSB:{
                        $order:1,
                        tagName:'div',
                        style:'height:{mark2Height}px;z-index:4;',
                        text:"{_mark2}"
                    }
                },
                VIEW:{
                    $order:3,
                        tagName:'div',
                        style:'height:{_viewHeight}px;',
                        ITEMS:{
                            tagName:'div',
                            style:'left:{_band_left}px;width:{_band_width}px;',
                            text:'{items}',
                            ACTIVE:{
                                $order:3,
                                tagName:'div',
                                style:'z-index:300;opacity:0.5;'
                            }
                        },
                        SCROLL:{
                            tagName:'div',
                            SCROLLI:{
                                tagName:'div'
                            }
                        }
                },
                INFO:{
                    $order:4,
                    style:'z-index:2;height:{tipsHeight}px',
                    tagName:'div'
                }
            },
            $dynamic : {
                _mark1:{
                    LABELT:{
                        id:null,
                        className:null,
                        tagName:'div',
                        style:'width:{width}px;left:{left}px;',
                        text:'{text}'
                    }
                },
                _mark2:{
                    LABELB:{
                        id:null,
                        className:null,
                        tagName:'div',
                        style:'width:{width}px;left:{left}px;',
                        text:'{text}'
                    }
                },
                items:{
                    ITEM:{
                        tagName:'div',
                        style:'left:{_left}px;top:{_top}px;width:{_width}px;',
                        MIN:{
                            $order:0,
                            tagName:'div',
                            style:'{_minDisplay}'
                        },
                        NORMAL:{
                            $order:1,
                            tagName:'div',
                            style:'{_normalDisplay}',
                            LEFT:{
                                $order:1,
                                tagName:'div'
                            },
                            HEAD:{
                                $order:2,
                                tagName:'div'
                            },
                            CON:{
                                $order:3,
                                tagName:'div',
                                text:'{caption}'
                            },
                            RIGHT:{
                                $order:4,
                                tagName:'div'
                            }
                        }
                    }
                }
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{PRE:'PRE',NEXT:'NEXT',ZOOMIN:'ZOOMIN',ZOOMOUT:'ZOOMOUT',DATE:'DATE',TASK:'TASK',OPT:'OPT',CLOSE:'CLOSE',MIN:'MIN',NORMAL:'NORMAL'},
            _clickEffect:{PRE:'PRE',NEXT:'NEXT',ZOOMIN:'ZOOMIN',ZOOMOUT:'ZOOMOUT',DATE:'DATE',TASK:'TASK',OPT:'OPT',CLOSE:'CLOSE',MIN:'MIN'},
            onRewh:function(profile, e, src){
                var o = profile.domNode.style,f=parseInt, n=null, w=n, h=n;
                if(e.height)h=f(o.height)||n;
                if(h)profile.box.resize(profile, h);
                if(e.width)w=f(o.width)||n;
                if(w)
                    if(profile.onResize)profile.boxing().onResizeWidth(profile, w);
            },
            onClick:function(profile, e){
                profile.box._focus(profile);
            },
            BAND:{
                onMousedown:function(profile, e, src){
                    if(profile.pause)return;
                    var p=profile.properties,
                        r=-p._band_left,
                        l=p._band_width-r-p.width;
                    ;
                    linb(src).startDrag(e, {move:false, type:'blank', horizontal:true, offset_left:l, offset_right:r});
                },
                onDragend:function(profile, e, src){
                    profile.box._rePosition(profile);
                    profile.box._focus(profile);
                },
                onDrag:function(profile, e, src){
                    var ns=profile.box._getMoveNodes(profile),
                        dd=linb.dragDrop;
                    ns.left(profile.properties._band_left +  dd.getOffset().x);
                }
            },
            SCROLL:{
                onMousedown:function(profile, e, src){
                    return false;
                },
                onScroll:function(profile, e, src){
                    profile.getSubNode('ITEMS').top(-linb([src]).scrollTop() );
                }
            },
            ITEMS:{
                onMouseover:function(profile,e,src){
                    profile.$dd_otp = profile.box._getTips(profile);
                    profile.$itemspos = linb([src]).absPos();
                },
                onMousemove:function(profile,e){
                    if(linb.dragDrop.working)return;
                    var p=parseInt,
                        t=profile.properties,
                        d=linb.date,
                        s=t._dateRealStart,
                        r=t._rate,
                        u=t._unitFormat,
                        p1=linb.event.getPos(e),
                        p2=profile.$itemspos;
                    profile.box._setTips(profile, d.getText(d.add(s, 'ms', (p1.left-p2.left)*r),u));
                },
                onMouseout:function(profile,e,src){
                    profile.box._setTips(profile, profile.$dd_otp);
                },
                onMousedown:function(profile, e, src){
                    if(profile.pause)return;

                    var o = profile.getSubNode('ACTIVE'),
                        x = linb.event.getPos(e).left;
                    o.setStyle({
                        display:'block',
                        width:'0'
                    })
                    .absPos({left :x,  top :null});
                    o.startDrag(e, {type:'none'});
                },
                onMouseup:function(profile, e, src){
                    profile.box._focus(profile);
                }
            },
            ACTIVE:{
                onDragbegin:function(profile, e, src){
                    profile.$dd_ox = linb.dragDrop.x;
                    profile.$dd_oleft = linb(src).left();
                    profile.$dd_otp = profile.box._getTips(profile);
                },
                onDrag:function(profile, e, src){
                    var x=profile.$dd_oleft,
                        w,
                        offset =linb.dragDrop.x-profile.$dd_ox;
                    if(offset>=0){
                        w = offset>1?(offset-1):0;
                    }else{
                        x += offset; w = -offset>1?(-offset - 1):0;
                    }
                    profile.box._moveActive(profile, src, x, w);
                },
                onDragend:function(profile, e, src){
                    profile.box._deActive(profile);
                }
            },
            FOCUS:{
                onKeydown:function(profile, e, src){
                    if(profile.pause)return;
                    profile.pause=true;

                    // speed
                    var p=profile.properties,
                        maxOffset = 30,
                        o=profile.box._getMoveNodes(profile),
                        x=o.left(),
                        off=p._scroll_offset
                        ;

                    off = p._scroll_offset = off>maxOffset ? off :off*1.05;

                    switch(linb.event.getKey(e)[0]){
                        case 'left':
                        case 'up':
                            o.left(x + off);
                            break;
                        case 'right':
                        case 'down':
                            o.left(x - off);
                            break;
                    }

                    if((x + maxOffset > 0) || (x + o.width() - profile.properties.width - maxOffset < 0)){
                        profile.box._rePosition(profile);
                    }

                    profile.pause=false;
                },
                onKeyup:function(profile, e){
                    var p=profile.properties;
                    p._scroll_offset = p.scrollRateBase;
                    profile.box._rePosition(profile);
                }
            },
            PRE:{
                onClick:function(profile, e){
                    if(profile.pause)return;
                    profile.pause=true;

                    var o=profile.box._getMoveNodes(profile),
                        x=o.left(),
                        w=o.width();

                    o.fx({left:[x,x+profile.properties.width]}, null, function(){
                        profile.box._rePosition(profile);
                        profile.pause=false;
                    },200,w/100,'inoutsine').start();
                }
            },
            NEXT:{
                onClick:function(profile, e){
                    if(profile.pause)return;
                    profile.pause=true;

                    var o = profile.box._getMoveNodes(profile),
                        x=o.left(),
                        w=o.width();

                    o.fx({left:[x,x-profile.properties.width]}, null, function(){
                        profile.box._rePosition(profile);
                        profile.pause=false;
                    },200,w/100,'inoutsine').start();
                }
            },
            ZOOMIN:{
                onClick:function(profile, e){
                    if(profile.pause)return;
                    var p=profile.properties,
                        box=profile.box,
                        z=box.zoom,
                        index = z.indexOf(p._unitParas),
                        o;
                    if(index > 0){
                        profile.pause=true;
                        p.unit =  z[index- 1][0];

                        o = profile.getSubNodes(['VIEW','BAND']);
                        o.fx( {opacity:[1,0.2]}, null, function(){
                            profile.boxing().refresh();
                            profile.box._focus(profile);
                            profile.pause=false;
                        },200,5,'insine').start();
                    }
                }
            },
            ZOOMOUT:{
                onClick:function(profile, e){
                    if(profile.pause)return;
                    var p=profile.properties,
                        box=profile.box,
                        z=box.zoom,
                        index = z.indexOf(p._unitParas),
                        o;
                    if(index < z.length -1){
                        profile.pause=true;
                        p.unit = z[index + 1][0];

                        o = profile.getSubNodes(['VIEW','BAND']);
                        o.fx( {opacity:[1,0.2]}, null, function(){
                            profile.boxing().refresh();
                            profile.box._focus(profile);
                            profile.pause=false;
                        },200,5,'insine').start();
                    }
                }
            },
            DATE:{
                onClick:function(profile, e){
                    if(profile.pause)return;
                    profile.properties.dateStart = new Date();

                    var o = profile.getSubNodes(['VIEW','BAND']);
                    o.fx( {opacity:[1,0.2]}, null, function(){
                        profile.boxing().refresh();
                        profile.box._focus(profile);
                        profile.pause=false;
                    },200,5,'insine').start();
                }
            },
            TASK:{
                //onMousedown be taken by click effction
                onMousedown:function(profile, e, src){
                    if(profile.pause)return;

                    var t=profile.properties,
                        ep=linb.event.getPos(e),
                        _left = t.unitPixs/2
                    ;
                    linb(src).startDrag(e, {
                        defer:1,
                        type:'none'
                    });
                    profile.$offset_x = _left;
                    profile.$taskdd_w = t.unitPixs;
                    profile.$dd_ox = ep.left -_left;
                },
                onDragbegin:function(profile, e, src){
                    linb(profile.$active).display('block').absPos({left :profile.$dd_ox,  top :null}).width(profile.$taskdd_w-2);
                    profile.$dd_ox =linb(profile.$active).left();
                    profile.$dd_otp = profile.box._getTips(profile);
                },
                onDrag:function(profile, e, src){
                    var d=linb.dragDrop;
                    profile.box._moveActive(profile, profile.$active, profile.$dd_ox + d.x-d.ox, profile.$taskdd_w-2);
                },
                onDragend:function(profile, e, src){
                    var r = profile.box._deActive(profile),
                        task={id:_.id(),caption:'new'},
                        box=profile.box,
                        b=profile.boxing();

                    task.start = box._getTime(profile, r.left);
                    task.end = box._getTime(profile, r.left+r.width);

                    if(profile.beoferAddTasks && false==b.beoferAddTasks(profile, [task])){}else
                        b.insertItems([task],null,true);
                }
            },
            ITEM:{
                onMousedown:function(profile, e, src){
                    // prevent timeline's onMousedown
                    return false;
                },
                onDragbegin:function(profile, e, src){
                    var t=profile.getItemByDom(src);
                    profile.$dd_otp = profile.box._getTips(profile),
                    profile.$dd_ox = linb.dragDrop.x;
                    profile.$dd_oleft = t._left;
                    profile.$dd_owidth = t._width-2;
                    linb(profile.$active).display('block').cssPos({left :profile.$dd_oleft,  top :null}).width(profile.$dd_owidth);
                },
                onDrag:function(profile, e, src){
                    var x,w,
                        offset =linb.dragDrop.x-profile.$dd_ox,
                        ddl=profile.$dd_oleft,
                        ddw=profile.$dd_owidth,
                        type=profile.$dd_type;
                    if(type=="left"){
                        if(offset < ddw){
                            x = ddl + offset;
                            w = ddl + ddw - x;
                        }else{
                            x = ddl + ddw +1;
                            w = offset - ddw;
                        }
                    }else if(type == "right"){
                        if(-offset < ddw){
                            x = ddl;
                            w = ddw + offset;
                        }else{
                            x = ddl + offset + ddw -1;
                            w = -offset - ddw;
                        }
                    }else{
                        x = ddl + offset;
                        w = ddw;
                    }
                    profile.box._moveActive(profile, profile.$active, x, w);
                },
                onDragend:function(profile, e, src){
                    var r = profile.box._deActive(profile);
                    profile.box._resetItem(profile,r,src);
                    profile.$dd_type = null;
                }
            },
            HEAD:{
                onMousedown:function(profile, e, src){
                    linb([src]).parent(2).startDrag(e, {
                        defer:1,
                        type:'none'
                    });
                }
            },
            LEFT:{
                onMousedown:function(profile, e, src){
                    profile.$dd_type='left';
                    linb([src]).parent(2).startDrag(e, {
                        defer:1,
                        type:'none'
                    });
                }
            },
            RIGHT:{
                onMousedown:function(profile, e, src){
                    profile.$dd_type='right';
                    linb([src]).parent(2).startDrag(e, {
                        defer:1,
                        type:'none'
                    });
                }
            }
        }},
        DataModel:{
            $borderW : 1,
            // control width and height
            width : 400,
            height : 200,
            unit : '1 d',
            // how much px to represent a unit
            unitPixs : 50,

            barHeight : 22,
            mark1Height : 20,
            mark2Height : 16,
            itemHeight : 16,
            tipsHeight : 16,

            items:{
                ini:[]
            },
            dateStart : new Date,
            // timezone
            timeZone : linb.date.timeZone,
            scrollRateBase:5
        },
        EventHandlers:{
            onGetTasks:function(profile, start, end, minMs, type){},
            beforeChangeTask:function(profile, item){},
            beoferAddTasks:function(profile, items){},
            beforeDelTasks:function(profile, arr){},
            onResizeWidth:function(profile, width){}
        },
        Appearances:{'default':{
            KEY:{
                'background-color':'#fff'
            },
            BORDER:{
                overflow: 'hidden',
                position: 'relative',
                top: '0',
                border: 'solid 1px #808080'
            },
            BAR:{
                position:'relative',
                'z-index':5,
                background: linb.UI.getCSSImgPara('barvbg.gif', ' repeat-x left top', null, 'linb.UI.Public')
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
            'CMDS span, CMDS2 span':{
                $order:0,
                position:'relative',
                margin:'4px 4px 2px 0',
                width:'15px',
                height:'15px',
                'vertical-align': 'middle',
                cursor:'default'
            },
            INFO:{
                position:'absolute',
                left:'0',
                width:'100%',
                bottom:'0',
                'background-color':'#ECE9D8',
                'border-top':'solid 1px #97BF29'
            },
            FOCUS:{
                position:'absolute',
                'font-size':'0',
                width:'1px',
                height:'1px',
                left:'0',
                top:'0',
                'line-height':'0',
                border:'0'
            },
            'BAND, VIEW, LABELST, LABELSB':{
                position:'relative'
            },
            VIEW:{
                width:linb.browser.ie6?'100%':null,
                overflow:'hidden'
            },
            SCROLL:{
                'z-index':30,
                position:'absolute',
                'font-size':'0',
                'line-height':'0',
                right:0,
                top:0,
                height:'100%',
                width:'18px',
                overflow:'auto',
                'overflow-x':linb.browser.opr?null:'hidden'
            },
            SCROLLI:{
                height:'1000px',
                width:'1px'
            },
            'LABELST, LABELSB':{
                'background-color':'#ECE9D8'
            },
            'LABELSB':{
                'background-image': linb.UI.getCSSImgPara('label.gif'),
                'background-position': 'left bottom'
            },
            ITEMS:{
                position:'relative',
                background: linb.UI.getCSSImgPara('bars.gif',' left top')
            },
            'LABELST div, LABELSB div':{
                'padding-left':'4px',
                position:'absolute',
                cursor:'move',
                top:0,
                height:'100%'
            },
            'LABELST div':{
                background: linb.UI.getCSSImgPara('label.gif',' left top no-repeat'),
                'font-weight':'bold'
            },
            'LABELSB div':{
                'margin-top':'-3px'
            },

            ACTIVE:{
                position:'relative',
                'border-left': '1px dashed',
                'border-right': '1px dashed',
                display:'none',
                'background-color':'#FFFFCC',
                left:'0',
                height:'100%'
            },

            ZOOMIN:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat  -271px top', null, 'linb.UI.Public')
            },
            'ZOOMIN-mouseover':{
                $order:2,
                'background-position': '-271px -16px'
            },
            'ZOOMIN-mousedown':{
                $order:3,
                'background-position': '-271px -31px'
            },
            ZOOMOUT:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat  -256px top', null, 'linb.UI.Public')
            },
            'ZOOMOUT-mouseover':{
                $order:2,
                'background-position': '-256px -16px'
            },
            'ZOOMOUT-mousedown':{
                $order:3,
                'background-position': '-256px -31px'
            },
            DATE:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat  -46px -65px', null, 'linb.UI.Public')
            },
            'DATE-mouseover':{
                $order:2,
                'background-position':' -46px -80px'
            },
            'DATE-mousedown':{
                $order:3,
                'background-position':' -46px -95px'
            },
            'MIN, TASK':{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat  -31px -65px', null, 'linb.UI.Public')
            },
            'TASK-mouseover':{
                $order:2,
                'background-position': '-31px -80px'
            },
            'TASK-mousedown':{
                $order:3,
                'background-position': '-31px -95px'
            },
            PRE:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat  0 -65px', null, 'linb.UI.Public'),
                top:'0'
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
                position:'absolute',
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat  -16px -65px', null, 'linb.UI.Public'),
                top:'0'
            },
            'NEXT-mouseover':{
                $order:2,
                'background-position': '-16px -80px'
            },
            'NEXT-mousedown':{
                $order:3,
                'background-position': '-16px -95px'
            },
            CLOSE:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat  -64px 0', null, 'linb.UI.Public')
            },
            'CLOSE-mouseover':{
                $order:1,
                'background-position': '-64px -16px'
            },
            'CLOSE-mousedown':{
                $order:2,
                'background-position': '-64px -32px'
            },
            OPT:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -240px top', null, 'linb.UI.Public')
            },
            'OPT-mouseover':{
                $order:2,
                'background-position': '-240px -16px'
            },
            'OPT-mousedown':{
                $order:3,
                'background-position': '-240px -32px'
            },
            ITEM:{
                position:'absolute',
                overflow:'visible',
                height:'18px'
            },
            'MIN, NORMAL':{
                //position:'absolute',
                //top:0,
                //left:0,
                position:'relative',
                height:'16px',
                overflow:'hidden',
                'z-index':'1'
            },
            'MIN':{
                width:'16px',
                background: linb.UI.getCSSImgPara('button.gif',' -60px top'),
                cursor:'pointer'
            },
            'MIN-mouseover':{
                'background-position': '60px -15px'
            },
            'MIN-mousedown':{
                'background-position': '-60px -30px'
            },
            NORMAL:{
                cursor:'pointer',
                'background-color': '#C6D6F7',
                border:'solid 1px #203A83'
            },
            'NORMAL-mouseover':{
                'border-color': 'red'
            },
            'NORMAL div':{
                position:'absolute',
                top:0,
                height:'100%'
            },
            HEAD:{
                background: linb.UI.getCSSImgPara('handler.gif', ' left top', null, 'linb.UI.Public'),
                width:'6px',
                left:'3px',
                cursor:'move'
            },
            'LEFT, RIGHT':{
                width:'2px',
                'z-index':10
            },
            'LEFT':{
                cursor:'e-resize',
                left:0
            },
            'RIGHT':{
                cursor:'w-resize',
                //for ie6
                'background-color': '#C6D6F7',
                right:0
            },
            'CON':{
                'padding-left':'2px',
                left:'9px',
                'z-index':1
            }
        }},
        createdTrigger:function(){
            var self=this, t=self.properties;
            self.$active = self.getSubNode('ACTIVE').get(0);
            //udpate current time info to log bar
            self.box._showStartTip(self);
        },
        prepareData:function(profile){
            var p=profile.properties,
                d=profile.data,
                date=linb.date,
                m=0,
                u=p.unitPixs,
                i,t,mark1,mark2,label,
                _unitParas,_unitCount
                ;

            // for quick move
            p._scroll_offset = p.scrollRateBase;

            p._lines=[{}];

            //border
            d._bWidth = p.width - 2*p.$borderW;
            d._bHeight = p.height - 2*p.$borderW;
            //view
            p._viewHeight = d._bHeight - p.tipsHeight - p.mark1Height - p.mark2Height - p.barHeight;

            // for example: n is minutes
            profile.box.zoom.each(function(o){
                if(o[0]===p.unit){
                    _unitParas=p._unitParas=o;
                    return false;
                }
            });

            // for example: 10 minutes
            _unitCount=p._unitCount = _unitParas[1];
            p._unit = _unitParas[2];
            p._unitFormat = _unitParas[6];

            // get the round start from the approximate start
            var _dateStart2 = date.getRoundDown(p.dateStart, p._unit, _unitCount),
            // get bar count in view
                _barCount = (parseInt(p.width / u)||0) + 2;

            // get band with
            p._band_width = _barCount * u * 3;

            // rel start in band
            p._dateRealStart = date.add(_dateStart2, p._unit, -(_barCount+2)*_unitCount);
            // rel end in band
            p._dateRealEnd = date.add(_dateStart2, p._unit, (2*_barCount-2)*_unitCount);
            // ms per px
            p._rate = date.diff(p._dateRealStart,p._dateRealEnd,'ms') / p._band_width;

            // set band left
            p._band_left_keep = p._band_left = - date.diff(p._dateRealStart, p.dateStart, 'ms')/p._rate;

            // build bars
            mark1 = p._mark1 = [];
            mark2 = p._mark2 = [];

            p._mark1Width=0;
            for(i=0; i< _barCount*3; i++){
                label = profile.box._getBarLabel(p._dateRealStart, _unitParas, i);
                mark2.push({
                    left: u * i,
                    width: u,
                    text:label[0]
                });
                if(label[1]){
                    if((t=mark1.length)===0)
                        m = u * i;
                    else if(t===1)
                        p._mark1Width = mark1[0].width = u * i - m;

                    mark1.push({
                        left: u * i,
                        width: p._mark1Width,
                        text: label[1]
                    });
                }
            }
            arguments.callee.upper.call(this, profile);
        },
        prepareItem:function(profile, item, oitem, pid){
            var self=this,
            t=profile.properties, d=profile.data;

            item._min=false;
            // caculate left and width
            item._left = self._getX(profile, item.start);
            item._width=Math.max(self._getX(profile, item.end) - item._left, 0);
            if(item._width<=16){
                item._width=16;
                item._min=true;
            }
            item._minDisplay=item._min?'':'display:none';
            item._normalDisplay=item._min?'display:none':'';

            // caculate top and set task to lines cache
            index = self._getLinePos(profile, item);
            item._top = (t.itemHeight+3) * index;

            t._lines = t._lines || [{}];

            //set double link
            t._lines[index][item.id]=item;
            item._line = index;

            oitem._left=item._left;
            oitem._width=item._width;
            oitem._min=item._min;
            oitem._line=item._line;
        },
        zoom:[
            /*
            *[
            *  id,
            *  small span unit count,
            *  small span unit,
            *  small span to big span function,
            *  small span lable format,
            *  big span lable format,
            *  value format
            *]
            */
            ['10 ms', 10, 'ms', function(d){return linb.date.get(d,'ms')%100===0}, 'ms','hnsms',''],
            ['100 ms', 100, 'ms', function(d){return linb.date.get(d,'ms')%1000===0}, 'ms','hns',''],
            ['1 s', 1, 's', function(d){return linb.date.get(d,'s')%10===0}, 's','hns',''],
            ['10 s', 10, 's', function(d){return linb.date.get(d,'s')%60===0}, 's','hns',''],
            ['1 n', 1, 'n', function(d){return linb.date.get(d,'n')%10===0}, 'n','dhn','ymdhn'],
            ['5 n', 5, 'n', function(d){return linb.date.get(d,'n')%30===0}, 'n','mdhn','ymdhn'],
            ['10 n', 10, 'n', function(d){return linb.date.get(d,'n')%60===0}, 'n','mdhn','ymdhn'],
            ['30 n', 30, 'n', function(d){return linb.date.get(d,'h')%2===0 && linb.date.get(d,'n')%60===0}, 'n','ymdh','ymdh'],
            ['1 h', 1, 'h',  function(d){return linb.date.get(d,'h')%6===0}, 'h','ymdh','ymdh'],
            ['2 h', 2, 'h', function(d){return linb.date.get(d,'h')%12===0}, 'h','ymd','ymdh'],
            ['6 h', 6, 'h', function(d){return linb.date.get(d,'h')%24===0}, 'h','ymd','ymd'],
            ['12 h', 12, 'h', function(d){return linb.date.get(d,'h')%24===0}, 'h','ymd','ymd'],
            ['1 d', 1, 'd', function(d){return linb.date.get(d,'w')%7===0}, 'w','ymd','ymd'],
            ['2 d', 2, 'd', function(d){var r=linb.date.get(d,'w')%7; return r===0||r===1}, 'd','ymd','ymd'],
            ['1 w', 1, 'ww', function(d){var r=linb.date.get(d,'ww');return (r%4===0 && r<50)?true:false}, 'ww','ymd','ymd'],
            ['1 m', 1, 'm', function(d){return linb.date.get(d,'m')%3===0}, 'm','yq','ymd'],
            ['1 q', 1, 'q', function(d){return linb.date.get(d,'q')%4===0}, 'q','y','ymd'],
            ['1 y', 1, 'y', function(d){return linb.date.get(d,'y')%10===0}, 'y','y','ymd'],
            ['1 de', 1, 'de', function(d){return linb.date.get(d,'de')%10===0}, 'y','y','ym'],
            ['1 c', 1, 'c', function(d){return linb.date.get(d,'c')%10===0}, 'y','y','y']
        ],
        _focus:function(profile){
            profile.getSubNode('FOCUS').focus(1);
        },
        _getTips:function(profile){
            var t,s='$dd_tooltip';
            if(t = profile[s] || (profile[s] = profile.getSubNode('INFO').get(0).childNodes[0]))
                return t.nodeValue;
            else
                return profile.getSubNode('INFO').get(0).innerHTML;
        },
        _setTips:function(profile, text){
            var t,s='$dd_tooltip';
            if(t = profile[s] || (profile[s] = profile.getSubNode('INFO').get(0).childNodes[0]))
                t.nodeValue=text;
            else
                profile.getSubNode('INFO').get(0).innerHTML=text;
        },
        _getBarLabel:function(target, unitParas, count){
            var r=['','',''],
                self=this,
                date=linb.date,
                //get next point
                date2 = date.add(target, unitParas[2], unitParas[1]*count);
            //get main number
            r[0] = date.getText(date2, unitParas[4]);
            //get up number
            if(unitParas[3](date2))
                r[1]=date.getText(date2, unitParas[5]);
            //r[2] = (linb.browser.ie?"'":"") + date.getText(date2, unitParas[6]) + (linb.browser.ie?"'":"");
            return r;
        },
        _getX:function(profile, time){
            var t=profile.properties,d=new Date;
            d.setTime(time);
            return (parseInt(linb.date.diff(t._dateRealStart, d, 'ms')||0) / t._rate);
        },
        _getTime:function(profile, x, flag){
            var t=profile.properties;
            t = linb.date.add(t._dateRealStart, 'ms', x*t._rate);
            return flag?t:t.getTime();
        },
        _moveActive:function(profile, src, x, w){
            var p=parseInt,
                t=profile.properties,
                d=linb.date,
                s=t._dateRealStart,
                r=t._rate,
                u=t._unitFormat,
                ms='ms',
                y=src.style,
                z='px';

            y.left = (p(x)||0)+z;
            y.width = (p(w)||0)+z;
            profile.box._setTips(profile, d.getText(d.add(s, ms, x*r),u)
                + " : "
                + d.getText(d.add(s, ms, (x+w+1)*r),u)
            );
        },
        _deActive:function(profile){
            var t=linb(profile.$active),x=t.left(),w=t.width()+2;
            t.setStyle({width:'0',display:'none'});
            profile.box._setTips(profile, profile.$dd_otp);
            return {left :x, width :w};
        },
        _minusLeft:function(profile,labelsBottom,labelsTop,offsetCount){
            var t=profile.properties;
            while(offsetCount++){
                labelsBottom.first().remove();
                temp=t._mark2.shift();
            }
            while((temp.left+temp.width) >= (t._mark1[0].left+t._mark1[0].width)){
                labelsTop.first().remove();
                t._mark1.shift();
            }
        },
        _minusRight:function(profile,labelsBottom,labelsTop,offsetCount){
            var t=profile.properties;
            while(offsetCount--){
                labelsBottom.last().remove();
                temp=t._mark2.pop();
            }
            while(temp.left <= t._mark1[t._mark1.length-1].left){
                labelsTop.last().remove();
                t._mark1.pop();
            }
        },
        _addLeft:function(profile, band, x, w, labelsBottom, labelsTop, offsetCount){
            // get additional bars
            var t=profile.properties,
                addLb2=[],addLb1=[],i;
            for(i=0; i < offsetCount; i++){
                label = profile.box._getBarLabel(t._dateRealStart, t._unitParas,-i-1);
                addLb2.push({
                    left: t.unitPixs * (offsetCount-i-1),
                    width: t.unitPixs,
                    text: label[0]
                });
                if(label[1]){
                    temp = t.unitPixs * (offsetCount-i-1);
                    t._mark1.each(function(o){
                        if(o.left == temp)return temp=false;
                    });
                    if(temp!==false)
                        addLb1.push({
                            left: temp,
                            width: t._mark1Width,
                            text: label[1]
                        });
                }
            }
            // add to band UI
            labelsBottom.addFirst(profile.box.subBuild(profile, '_mark2', addLb2).toDom());
            // add to memory list
            t._mark2.insert(addLb2.reverse(),0);
            if(addLb1.length){
                labelsTop.addFirst(profile.box.subBuild(profile, '_mark1', addLb1).toDom());
                t._mark1.insert(addLb1.reverse(),0);
            }
        },
        _addRight:function(profile, band, x, w, labelsBottom, labelsTop, offsetCount){
            // get additional bars
            var t=profile.properties,
                addLb2=[],addLb1=[],
                m=Math.abs(offsetCount);
            for(var i=0;i<m;i++){
                label = profile.box._getBarLabel(t._dateRealEnd, t._unitParas, i);
                addLb2.push({
                    left: w -t.unitPixs * (m-i),
                    width: t.unitPixs,
                    text: label[0]
                });
                if(label[1]){
                    temp=w -t.unitPixs * (m-i);
                    t._mark1.each(function(o){
                        if(o.left == temp)return temp=false;
                    });
                    if(temp!==false)
                        addLb1.push({
                            left: temp,
                            width: t._mark1Width,
                            text: label[1]
                        });
                }
            }
            // build
            // add to band UI
            labelsBottom.addLast(profile.box.subBuild(profile, '_mark2', addLb2).toDom());
            // add to memory list
            t._mark2.insert(addLb2,-1);

            if(addLb1.length){
                labelsTop.addLast(profile.box.subBuild(profile, '_mark1', addLb1).toDom());
                t._mark1.insert(addLb1,-1);
            }
        },
        _getMoveNodes:function(profile){
            return profile.$moveban = profile.$moveban || profile.getSubNodes(['BAND','ITEMS']);
        },
        _rePosition:function(profile){
            profile.pause=true;
            var self=this,
                t=profile.properties,
                label,m,n,temp,
                labelsBottom = profile.getSubNode('LABELSB'),
                labelsTop = profile.getSubNode('LABELST'),

                band = self._getMoveNodes(profile),
                x = band.left(),
                w = band.width(),

                offset = x - t._band_left_keep;

            // if offset out a bar width
            if(Math.abs(offset)/t.unitPixs >=1){
                var offsetCount = parseInt(offset/t.unitPixs),
                    offsetPxs = offsetCount*t.unitPixs;

                band.left(x - offsetPxs);
                //reset sub controls dom position
                [labelsBottom, labelsTop].each(function(v){
                    linb(v).children().each(function(o){
                        o.style.left = (parseInt(o.style.left)||0) + offsetPxs + "px";
                    })
                });

                //reset tasks position var
                t.items.each(function(o){
                    o._left += offsetPxs;
                    profile.box._trimTask(profile,o);
                });
                t._mark2.each(function(o){
                    o.left += offsetPxs;
                });
                t._mark1.each(function(o){
                    o.left += offsetPxs;
                });
                // delete out, andd add to blank
                if(offsetCount>0){
                    self._minusRight(profile,labelsBottom,labelsTop,offsetCount);
                    self._addLeft(profile, band, x, w, labelsBottom, labelsTop, offsetCount);
                }else{
                    self._minusLeft(profile,labelsBottom,labelsTop,offsetCount);
                    self._addRight(profile, band, x, w, labelsBottom, labelsTop, offsetCount);
                }

                // reset band paras
                t._band_left = band.left();
                t._band_width = band.width();

                var bak_s = t._dateRealStart,
                    bak_e = t._dateRealEnd,
                    date = linb.date,
                    _c=-offsetCount*t._unitCount;

                t._dateRealStart = date.add(t._dateRealStart, t._unit, _c);
                t._dateRealEnd = date.add(t._dateRealEnd, t._unit, _c);
                t._rate = date.diff(t._dateRealStart,t._dateRealEnd,'ms') / t._band_width;
                // reset date start point
                t.dateStart = self._getTime(profile, -t._band_left, 1);

                var arr=[];
                // remove tasks
                t.items.each(function(o){
                    if(o._left >= t._band_width ||  (o._left+o._width) <= 0){
                        //delete from lines
                        delete t._lines[o._line][o.id];
                        arr.push(o.id);
                    }
                });
                profile.boxing().removeItems(arr);

                //use insertItems in onGetTasks
                if(profile.onGetTasks)
                    profile.boxing().onGetTasks(profile,
                        offsetCount>0 ? t._dateRealStart : bak_e,
                        offsetCount>0 ? bak_s : t._dateRealEnd,
                        t._rate,
                        offsetCount>0 ? 'left' : 'right');


                //adjust the items
                self._reArrage(profile);
            }
            self._showStartTip(profile);
            profile.pause = false;
        },
        _trimTask:function(profile, o){
            //****
            // if too long, cut left
            var l=-12,
                x=o._left,
                w=o._width,
                bw=profile.properties._band_width;
            if(x < l){
                w = w + x - l;
                x = l;
            }
            this._setItemNode(profile, o,'left',x+'px');
            // if too long, cut right
            if(x + w > bw - l)
                w = bw - l - x;
            if(w>0)
                this._setItemNode(profile, o,'width',w+'px');
        },
        _setItemNode:function(profile, item, key, value){
            var t=item._node || (item._node = profile.getSubNodeByItemId('ITEM',item.id).get(0));
            t.style[key]=value;
        },
        _showStartTip:function(profile){
            var band = profile.getSubNode('BAND'),
                x = band.left(),
                d = this._getTime(profile, -x, 1);
                profile.box._setTips(profile, linb.date.getText(d, profile.properties._unitFormat));
        },
        _getLinePos:function(profile,o){
            if(o._min)return 0;

            var t=profile.properties,
                b=false,
                index=0;
            t._lines.each(function(v,i){
                if(i===0)return;
                b=true;
                _.each(v,function(v){
                    if(o!==v)
                        if(((o._left + o._width)>=v._left) && ((v._left + v._width)>=o._left))
                            return b=false;
                });
                if(b){index=i;return false;}
            });
            if(!b)
                index = t._lines.push({})-1;
            return index;
        },
        // _reArrage tasks for top position
        _reArrage:function(profile){
            var self=this, o, h,
                t=profile.properties;
            t._lines.length = 1;
            //re caculate from current line
            t.items.each(function(v){
                if(v._line===0)return;

                //get pos from current line
                index = self._getLinePos(profile, v);
                t._lines[index][v.id]=v;
                // if has space, reset position
                if(v._line !== index){
                    // reset double link
                    v._line = index;
                    // set top
                    self._setItemNode(profile, v,'top',(t.itemHeight+3) * index+'px');
                };
            });

            h = t._linesHeight =  (t._lines.length+1) * 18;

            self._ajustHeight(profile);
        },
        _resetItem:function(profile,o,src){
            var t=profile.getItemByDom(src),
                bandW=profile.properties._band_width + 12,
                f=function(k,i){return profile.getSubNodeByItemId(k,i)},
                timeline=profile.box,
                max=Math.max;

            if(o.left){
                t._left=o.left;
                t.start = timeline._getTime(profile,o.left);
                src.style.left=o.left+'px';
            }
            if(o.width){
                t._width=max(o.width, 0);
                t.end = timeline._getTime(profile,o.left+o.width);
                // if too small, show min
                if(t._width<=16){
                    t._width=o.width=16;
                    if(!t._min){
                        t._min=true;
                        f('NORMAL',t.id).display('none');
                        f('MIN',t.id).display('block');
                    }
                // else show normal
                }else{
                    if(t._min){
                        t._min=false;
                        f('NORMAL',t.id).display('block');
                        f('MIN',t.id).display('none');
                    }
                    // if too long ,cut right
                    if(o.left + o.width > bandW)
                        o.width = bandW - o.left;
                }
                src.style.width=o.width+'px';
            }
            // _reArrage top position
            timeline._reArrage(profile);
        },
        _ajustHeight:function(profile){
            var p=profile.properties,
                f=function(p){return profile.getSubNode(p)},
                view = f('VIEW'),
                items = f('ITEMS'),
                scroll = f('SCROLL'),
                scrolli= f('SCROLLI'),
                h,b,
                ih=p._linesHeight||0,
                vh=view.height();

            h=Math.max(ih,vh);
            items.height(h);
            scrolli.height(h);
            b=ih>vh;
            scroll.display(b?'block':'none');
            items.top(b?-scroll.scrollTop():0);
        },

        resize:function(profile,h){
            var p=profile.properties,
                f=function(k){return profile.getSubNode(k)},
                off=2*p.$borderW,
                t;
            //for border, view and items
            if(h && h!=p.height && parseInt(profile.domNode.style.height)){
                f('BORDER').height(t=h-off);
                f('VIEW').height(t=t - p.tipsHeight - p.mark1Height - p.mark2Height - p.barHeight);
                this._ajustHeight(profile);
            }
        }
    }
});