Class('linb.UI.TimeLine', ['linb.UI.iWidget','linb.UI.iSchedule'], {
    Instance:{
        beforeBuild:function(profile){
            linb.SC('linb.date');

            // for quick move
            profile.scroll_offset = 5;

            var t=profile.properties;

            t.tasks={};
            t.lines=[{}];

            t.boderWidth = 1;

            // control width and height
            t.width = _.numb(parseInt(t.width), 300);
            t.height = _.numb(parseInt(t.height), 200);


            t.cmdsHeight=18;
            t.cmdHeight=15;
            t.cmdWidth=15;
            t.labelsTopHeight=20;
            t.labelsBottomHeight=16;
            t.tooltipHeight=16;
            t.barHeight=16;

            t.labelBotttomTop=t.labelsTopHeight;
            t.bandTop = t.cmdsHeight;
            t.bandHeight = t.height - t.bandTop - t.tooltipHeight;
            t.barsTop = t.labelsTopHeight + t.labelsBottomHeight;
            t.barsHeight = t.bandHeight - t.barsTop;
            t.tooltipTop = t.height - t.tooltipHeight;

            //for border
            t.viewWidth = t.width - 2*t.boderWidth;
            t.viewHeight = t.height - 2*t.boderWidth;

            //scroll bar
            t.scrollbarWidth = 18;
            t.scrollbarTop = t.barsTop + t.bandTop;
            t.scrollbarLeft = t.viewWidth - t.scrollbarWidth;

            t.cmdsHeight -= 2*t.boderWidth;
            t.labelTopHeight = t.labelsTopHeight;//- 2*t.boderWidth;
            t.labelBottomHeight = t.labelsBottomHeight;// - 2*t.boderWidth;

            t.nextLeft = t.viewWidth - t.cmdWidth - 2*t.boderWidth;;

            t.bg_active = '#FFFFCC';

            // for example: n is minutes
            profile.box.zoom.each(function(o){
                if(o[0]===t.unit){
                    t.unitParas=o;
                    return false;
                }
            });
            if(!t.unitParas)
                //1d
                t.unitParas=profile.box.zoom[9];

            // for example: 10 minutes
            t.unitCount = t.unitParas[1];
            t.unit = t.unitParas[2];
            t.unitFormat = t.unitParas[6];

            // how much px to represent a unit
            t.unitPixels = _.numb(t.unitPixels, 50);
            // timezone
            t.timeZone = _.numb(t.timeZone, ((new Date).getTimezoneOffset()/60));

            t.dateStart = _.date(t.dateStart);
            // get the round start from the approximate start
            t.dateStart2 = linb.date.getRoundDown(t.dateStart, t.unit, t.unitCount);


            // get bar count in view
            t.barCount = (parseInt(t.width / t.unitPixels)||0) + 2 ;

            // get band with
            t.band_width = t.barCount * t.unitPixels * 3;

            // rel start in band
            t.dateRealStart = linb.date.add(t.dateStart2, t.unit, -(t.barCount+2)*t.unitCount);
            // rel end in band
            t.dateRealEnd = linb.date.add(t.dateStart2, t.unit, (2*t.barCount-2)*t.unitCount);
            // ms per px
            t.rate = linb.date.diff(profile.properties.dateRealStart,profile.properties.dateRealEnd,'ms') / t.band_width;

            // set band left
            t.band_left_keep = t.band_left = - linb.date.diff(t.dateRealStart, t.dateStart, 'ms')/t.rate;

            // build bars
            t.bars=[];t.labelsTop=[];t.labelsBottom=[];

            var m=0;
            t.labelTopWidth=0;
            for(var i=0; i< t.barCount*3; i++){
                var label = profile.box.getBarLabel(t.dateRealStart, t.unitParas, i);
                t.labelsBottom.push({
                    left: t.unitPixels * i,
                    width: t.unitPixels,// - 2*t.boderWidth,
                    height:t.labelBottomHeight,
                    text:label[0]
                });
                if(label[1]){
                    if(t.labelsTop.length===0)
                        m = t.unitPixels * i;
                    else if (t.labelsTop.length===1)
                        t.labelTopWidth = t.labelsTop[0].width = t.unitPixels * i - m;

                   t.labelsTop.push({
                        left: t.unitPixels * i,
                        width: t.labelTopWidth,
                        height:t.labelTopHeight,
                        text: label[1]
                    });
                }
            }

            //set tooltips
            this.constructor.tooltips(profile.properties);
        }
    },
    Initialize :function(){
    },
    Static:{
        Templates:{'default':{
            _tagName:'div',

            style:'{left}{top}{width}{height}{right}{bottom}{zIndex}{position}',
            VIEW:{
                _tagName:'div',
                style:'height:{viewHeight}px;width:{viewWidth}px;',
                FOCUS:{
                    _tagName:'button'
                },
                CMD:{
                    _tagName:'div',
                    style:'height:{cmdsHeight}px;z-index:3;top:0;',
                    _order:0,
                    PRE:{
                        _order:0,
                        style:'left:0;width:{cmdWidth}px;height:{cmdHeight}px;',
                        title:'{tooltipPre}'
                    },
                    'ZOOMIN':{
                        _order:1,
                        style:'width:{cmdWidth}px;height:{cmdHeight}px;',
                        title:'{tooltipZoomIn}'
                    },
                    'ZOOMOUT':{
                        _order:2,
                        style:'width:{cmdWidth}px;height:{cmdHeight}px;',
                        title:'{tooltipZoomOut}'
                    },
                    TODAY:{
                        _order:3,
                        style:'width:{cmdWidth}px;height:{cmdHeight}px;',
                        title:'{tooltipToday}'
                    },
                    TASK:{
                        _order:4,
                        style:'width:{cmdWidth}px;height:{cmdHeight}px;',
                        title:'{tooltipTask}'
                    },
                    NEXT:{
                        _order:8,
                        style:'left:{nextLeft}px;width:{cmdWidth}px;height:{cmdHeight}px;',
                        title:'{tooltipNext}'
                    }
                },
                BAND:{
                    _order:2,
                    _tagName:'div',
                    style:'top:{bandTop}px;left:{band_left}px;width:{band_width}px;height:{bandHeight}px;z-index:1;',
                    LABELST:{
                        _order:0,
                        _tagName:'div',
                        style:'height:{labelsTopHeight}px;z-index:3;',
                        LABELT:{
                            _listKey:'labelsTop',
                            _tagName:'div',
                            style:'height:{height}px;width:{width}px;left:{left}px;',
                            text:'{text}'
                        }
                    },
                    LABELSB:{
                        _order:1,
                        _tagName:'div',
                        style:'top:{labelBotttomTop}px;height:{labelsBottomHeight}px;z-index:4;',
                        LABELB:{
                            _listKey:'labelsBottom',
                            _tagName:'div',
                            style:'width:{width}px;height:{height}px;left:{left}px;',
                            text:'{text}'
                        }
                    },
                    BARS:{
                        _order:2,
                        _tagName:'div',
                        style:'top:{barsTop}px;z-index:1;height:{barsHeight}px;',
                        BAR:{
                            _listKey:'bars',
                            _tagName:'div',
                            style:'width:{width}px;left:{left}px;'
                        },
                        ACTIVE:{
                            _order:3,
                            _tagName:'div',
                            style:'z-index:300;opacity:0.5;'
                        }
                    }
                },
                SCROLLBAR:{
                    _order:3,
                    _tagName:'div',
                    style:'top:{scrollbarTop}px;height:{barsHeight}px;left:{scrollbarLeft}px;width:{scrollbarWidth}px;z-index:2;',
                    SCROLLIN:{
                        _tagName:'div'
                    }
                },
                TOOLTIP:{
                    _order:4,
                    style:'z-index:2;top:{tooltipTop}px;height:{tooltipHeight}px'
                    _tagName:'div'
                }
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{PRE:'PRE',NEXT:'NEXT',ZOOMIN:'ZOOMIN',ZOOMOUT:'ZOOMOUT',TODAY:'TODAY',TASK:'TASK'},
            _clickEffect:{PRE:'PRE',NEXT:'NEXT',ZOOMIN:'ZOOMIN',ZOOMOUT:'ZOOMOUT',TODAY:'TODAY',TASK:'TASK'},

            onClick:function(profile, e){
                profile.getSubNode(profile.box.FOCUS).focus();
            },
            BAR:{
            },
            LABELST:{
                onMousedown:function(profile, e, src){
                    profile.box.startDrag(profile, e);
                }
            },
            LABELSB:{
                onMousedown:function(profile, e, src){
                    profile.box.startDrag(profile, e);
                }
            },
            BAND:{
                onDragend:function(profile, e, src){
                    profile.box.rePosition(profile,src);
                    profile.getSubNode(profile.box.FOCUS).focus();
                }
            },
            BARS:{
                onMousedown:function(profile, e, src){
                    if(profile.pause)return;

                    var o = profile.getSubNode(profile.box.ACTIVE),
                    x = linb.event.getPos(e).left;
                    o.display('block').absPos({left :x,  top :null});
                    o.startDrag(e, {type:'none'});
                },
                onMouseup:function(profile, e, src){
                    profile.getSubNode(profile.box.FOCUS).focus();
                }
            },
            SCROLLBAR:{
                onScroll:function(profile, e, src){
                    profile.getSubNode(profile.box.BARS).top( profile.properties.barsTop - linb(src).scrollTop() );
                }
            },
            ACTIVE:{
                onDragstart:function(profile, e, src){
                    profile.$active=src;
                    profile.$dd_ox = linb.dragDrop.left;
                    profile.$dd_oleft = linb(src).left();
                    profile.$dd_tooltip = profile.getSubNode(profile.box.TOOLTIP).get(0);
                    profile.$tooltip='';
                    profile.$dd_otp = profile.$dd_tooltip.innerHTML;
                    linb(src).backgroundColor(profile.properties.bg_active);
                },
                onDrag:function(profile, e, src){
                    var x,w,offset =linb.dragDrop.left-profile.$dd_ox;
                    if(offset>=0){
                        x = profile.$dd_oleft; w = offset>1?(offset-1):0;
                    }else{
                        x = profile.$dd_oleft + offset; w = -offset>1?(-offset - 1):0;
                    }
                    profile.box.moveActive(profile, src, x, w);
                },
                onDragend:function(profile, e, src){
                    var r = profile.box.deActive(profile);
                    profile.properties.dateStart = profile.box.getTime(profile, r.left);
                    profile.getSubNode(profile.box.ZOOMIN).onClick();
                }

            },
            FOCUS:{
                onKeydown:function(profile, e, src){
                    if(profile.pause)return;
                    profile.pause=true;

                    // speed
                    var maxOffset = 30;

                    profile.scroll_offset = profile.scroll_offset>maxOffset ? profile.scroll_offset :profile.scroll_offset*1.05;

                    var o = profile.getSubNode(profile.box.BAND);
                    var x=o.left();

                    switch(linb.event.getKey(e)[0]){
                        case 'left':
                        case 'up':
                            o.left(x + profile.scroll_offset);
                            break;
                        case 'right':
                        case 'down':
                            o.left(x - profile.scroll_offset);
                            break;
                    }

                    if((x + maxOffset > 0) || (x + o.width() - profile.properties.width - maxOffset < 0)){
                        profile.box.rePosition(profile,o);
                    }

                    profile.pause=false;
                },
                onKeyup:function(profile, e){
                    profile.scroll_offset = 5;
                    var o = profile.getSubNode(profile.box.BAND);
                    profile.box.rePosition(profile,o);
                }
            },
            PRE:{
                onClick:function(profile, e){
                    if(profile.pause)return;
                    profile.pause=true;

                    var o = profile.getSubNode(profile.box.BAND);
                    var x=o.left(),w=o.width();

                    o.fx({left:[x,x+profile.properties.width]}, null, function(){
                        profile.box.rePosition(profile,o);
                        profile.pause=false;
                    },
                    200,w/100,'inoutsine'
                    ).start();
                }
            },
            NEXT:{
                onClick:function(profile, e){
                    if(profile.pause)return;
                    profile.pause=true;

                    var o = profile.getSubNode(profile.box.BAND);
                    var x=o.left(),w=o.width();

                    o.fx({left:[x,x-profile.properties.width]}, null, function(){
                        profile.box.rePosition(profile,o);
                        profile.pause=false;
                    },
                    200,w/100,'inoutsine'
                    ).start();
                }
            },
            ZOOMIN:{
                onClick:function(profile, e){
                    if(profile.pause)return;

                    var index = profile.box.zoom.indexOf(profile.properties.unitParas);
                    if(index > 0){
                        profile.pause=true;
                        profile.properties.unitParas = profile.box.zoom[index- 1];

                        var o = profile.getSubNode(profile.box.BARS);
                        o.fx( {opacity:[1,0.2]}, null, function(){
                            profile.boxing().refresh();
                            profile.getSubNode(profile.box.FOCUS).focus();
                            profile.pause=false;
                        },200,5,'insine').start();
                    }
                }
            },
            ZOOMOUT:{
                onClick:function(profile, e){
                    if(profile.pause)return;

                    var index = profile.box.zoom.indexOf(profile.properties.unitParas);
                    if(index < profile.box.zoom.length -1){
                        profile.pause=true;
                        profile.properties.unitParas = profile.box.zoom[index + 1];

                        var o = profile.getSubNode(profile.box.BARS);
                        o.fx( {opacity:[1,0.2]}, null, function(){
                            profile.boxing().refresh();
                            profile.getSubNode(profile.box.FOCUS).focus();
                            profile.pause=false;
                        },200,5,'insine').start();
                    }
                }
            },
            TODAY:{
                onClick:function(profile, e){
                    if(profile.pause)return;
                    profile.properties.dateStart = new Date();

                    var o = profile.getSubNode(profile.box.BARS);
                    o.fx( {opacity:[1,0.2]}, null, function(){
                        profile.boxing().refresh();
                        profile.getSubNode(profile.box.FOCUS).focus();
                        profile.pause=false;
                    },200,5,'insine').start();
                }
            },
            TASK:{
                //onMousedown be taken by click effction
                onMousedown:function(profile, e, src){
                    if(profile.pause)return;

                    var t=profile.properties,x=(parseInt(t.unitPixels/2)||0),y=(parseInt(t.barHeight/2)||0),
                    o=profile.getSubNode(profile.box.VIEW),
                    ep=linb.event.getPos(e),
                    pos=o.absPos(),
                    size=o.cssSize(),
                    _left = parseInt(t.unitPixels/2)||0,
                    _top = parseInt(t.barHeight/2)||0
                    ;
                    linb(src).startDrag(e, {
                        defer:1,
                        move:false,
                        type:'shape',
                        target_left:ep.left  - _left,
                        target_top:ep.top - _top,
                        target_width:t.unitPixels,
                        target_height:t.barHeight,
                        offset_left:ep.left-pos.left - _left,
                        offset_right:size.width + pos.left - ep.left -t.unitPixels + _left,
                        offset_top:ep.top-pos.top - _top,
                        offset_bottom: size.height+ pos.top-ep.top -t.barHeight + _top
                    });
                    profile.$offset_x = _left;
                    profile.$taskdd_w = t.unitPixels;
                    profile.$active = profile.getSubNode(profile.box.ACTIVE).get(0);
                    profile.$dd_tooltip = profile.getSubNode(profile.box.TOOLTIP).get(0);
                    profile.$dd_ox = ep.left -_left;
                },
                onDragstart:function(profile, e, src){
                    linb(profile.$active).display('block').absPos({left :profile.$dd_ox,  top :null}).width(profile.$taskdd_w-2).backgroundColor('transparent');
                    profile.$dd_ox =linb(profile.$active).left();
                    profile.$dd_otp = profile.$dd_tooltip.innerHTML;
                },
                onDrag:function(profile, e, src){
                    profile.box.moveActive(profile, profile.$activprofile, e.$dd_ox + linb.dragDrop.current_x-linb.dragDrop.origin_x+profile.$offset_x, profile.$taskdd_w-2);
                },
                onDragend:function(profile, e, src){
                    var r = profile.box.deActive(profile);
                    var task={id:_.id(),title:'new'};
                    task.start = profile.box.getTime(profile, r.left);
                    task.end = profile.box.getTime(profile, r.left+r.width);
                    var tasks={};
                    tasks[task.id]=task;
                    if(profile.onAddTasks){
                        tasks = profile.onAddTasks(tasks);
                    }
                    profile.box.addTasks(profile, tasks);
                }
            }
        }},
        EventHandlers:{
            onGetTasks:function(){},
            onChangeTasks:function(){},
            onAddTasks:function(){},
            onDelTasks:function(){}
        },
        Appearances:{'default':{
            KEY:{
                'background-color':'#fff'
            },
            VIEW:{
                overflow: 'hidden',
                position: 'relative',
                top: '0',
                border: 'solid 1px #808080'
            },
            CMD:{
                position:'absolute',
                left:'0',
                width:'100%',
                'background-color':'#ECE9D8',
                border:'solid 1px',
                'border-color':'#ffffff #808080 #808080 #ffffff'
            },
            TOOLTIP:{
                position:'absolute',
                left:'0',
                width:'100%',
                'background-color':'#ECE9D8',
                'border-top':'solid 1px #97BF29'
            },
            FOCUS:{
                position:'absolute',
                'font-size':'0',
                width:'0',
                height:'0',
                left:'0',
                top:'0',
                'line-height':'0',
                border:'0'
            },
            BAND:{
                position:'absolute',
                top:'0'
            },
            'LABELST, LABELSB, BARS':{
                position:'absolute',
                left:'0',
                width:'100%'
            },
            BARS:{
                background: linb.UI.getCSSImgPara('bars.gif',' left top')
            },
            'LABELST, LABELSB':{
                'background-color':'#ECE9D8',
                cursor:'move'
            },
            'LABELSB':{
                'background-image': linb.UI.getCSSImgPara('label.gif'),
                'background-position': 'left bottom'
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
            'LABELT, LABELB':{
                'padding-left':'4px',
                position:'absolute',
                top:'0',
                cursor:'move'
            },
            LABELT:{
                background: linb.UI.getCSSImgPara('label.gif',' left top no-repeat'),
                'font-weight':'bold'
            },
            LABELB:{
                'margin-top':'-3px'
            },
            SCROLLBAR:{
                position:'absolute',
                display:'none',
            	'background-color': 'transparent',
            	overflow:'auto',
            	'overflow-x': (linb.browser.ie || linb.browser.gek)?'hidden':''
            },
            SCROLLIN:{
            	'background-color': 'transparent',
            	width:'1px'
            },
            ZOOMIN:{
                background:linb.UI.getCSSImgPara('button.gif',' -30px top no-repeat'),
                'margin-left':'14px',
                cursor:'pointer'
            },
            'ZOOMIN-mouseover':{
                'background-position': '-30px -15px'
            },
            'ZOOMIN-mousedown':{
                'background-position': '-30px -30px'
            },
            ZOOMOUT:{
                background: linb.UI.getCSSImgPara('button.gif',' -15px top no-repeat'),
                'margin-left':'4px',
                cursor:'pointer'
            },
            'ZOOMOUT-mouseover':{
                'background-position': '-15px -15px'
            },
            'ZOOMOUT-mousedown':{
                'background-position': '-15px -30px'
            },
            TODAY:{
                background: linb.UI.getCSSImgPara('button.gif',' -45px top no-repeat'),
                'margin-left':'4px',
                cursor:'pointer'
            },
            'TODAY-mouseover':{
                'background-position': '-45px -15px'
            },
            'TODAY-mousedown':{
                'background-position': '-45px -30px'
            },
            TASK:{
                background: linb.UI.getCSSImgPara('button.gif',' -60px top no-repeat'),
                'margin-left':'4px',
                cursor:'pointer'
            },
            'TASK-mouseover':{
                'background-position': '-60px -15px'
            },
            'TASK-mousedown':{
                'background-position': '-60px -30px'
            },
            PRE:{
                background: linb.UI.getCSSImgPara('button.gif','left top no-repeat'),
                top:'0',
                cursor:'pointer'
            },
            'PRE-mouseover':{
                'background-position': 'left -15px'
            },
            'PRE-mousedown':{
                'background-position': 'left -30px'
            },
            NEXT:{
                position:'absolute',
                background: linb.UI.getCSSImgPara('button.gif',' -75px top no-repeat'),
                top:'0',
                cursor:'pointer'
            },
            'NEXT-mouseover':{
                'background-position': '-75px -15px'
            },
            'NEXT-mousedown':{
                'background-position': '-75px -30px'
            }
        }},
        beforeTrigger:function(){
            var t=this.properties;
            //udpate current time info to log bar
            this.box.updateStartTimeTxt(this);
            //load tasks
            this.box.getTasks(this,t.dateRealStart, t.dateRealEnd, t.rate, 'ini');
        },
        zoom:[
            ['1ms', 1, 'ms', function(d){return linb.date.get(d,'ms')%10===0}, 'ms','hnsms','all'],
            ['10ms', 10, 'ms', function(d){return linb.date.get(d,'ms')%100===0}, 'ms','hnsms','all'],
            ['100ms', 100, 'ms', function(d){return linb.date.get(d,'ms')%1000===0}, 'ms','hns','all'],
            ['1s', 1, 's', function(d){return linb.date.get(d,'s')%10===0}, 's','hns','all'],
            ['10s', 10, 's', function(d){return linb.date.get(d,'s')%60===0}, 's','hns','all'],
            ['1n', 1, 'n', function(d){return linb.date.get(d,'n')%10===0}, 'n','dhn','ymdhns'],
            ['10n', 10, 'n', function(d){return linb.date.get(d,'n')%60===0}, 'n','mdhn','ymdhns'],
            ['1h', 1, 'h',  function(d){return linb.date.get(d,'h')%6===0}, 'h','ymdhn','ymdhns'],
            ['6h', 6, 'h', function(d){return linb.date.get(d,'h')%24===0}, 'h','ymd','ymdhn'],
            ['1d', 1, 'w', function(d){return linb.date.get(d,'d')%7===0}, 'w','ymd','ymdhn'],
            ['1w', 1, 'ww', function(d){var r=linb.date.get(d,'ww');return (r%4===0 && r<50)?true:false}, 'ww','ymd','ymdh'],
            ['1m', 1, 'm', function(d){return linb.date.get(d,'m')%3===0}, 'm','yq','ymdh'],
            ['1q', 1, 'q', function(d){return linb.date.get(d,'q')%4===0}, 'q','y','ymd'],
            ['1y', 1, 'y', function(d){return linb.date.get(d,'y')%10===0}, 'y','y','ymd'],
            ['1de', 1, 'de', function(d){return linb.date.get(d,'de')%10===0}, 'y','y','ym'],
            ['1c', 1, 'c', function(d){return linb.date.get(d,'c')%10===0}, 'y','y','y']
        ],
        getBarLabel:function(date, unitParas, count){
            var y,q,m,w,d,h,n,s,ms,r=['','',''],self=this;
            //get next point
            var date2 = linb.date.add(date, unitParas[2], unitParas[1]*count);
            //get main number
            r[0] = linb.date.getText(date2, unitParas[4]);
            //get up number
            if(unitParas[3](date2))
                r[1]=linb.date.getText(date2, unitParas[5]);
            //r[2] = (linb.browser.ie?"'":"") + linb.date.getText(date2, unitParas[6]) + (linb.browser.ie?"'":"");
            return r;
        },
        getX:function(profile, time){
            var t=profile.properties;
            return (parseInt(linb.date.diff(t.dateRealStart, time, 'ms')||0) / t.rate);
        },
        getTime:function(profile, x){
            var t=profile.properties;
            return linb.date.add(t.dateRealStart, 'ms', x*t.rate)
        },
        startDrag:function(profile, e){
            if(profile.pause)return;
            var view = profile.getSubNode(profile.box.VIEW),
                x = linb.event.getPos(e).left,
                x1 = view.absPos().left,
                x2 = x1 + view.width()
            ;
            profile.getSubNode(profile.box.BAND).startDrag(e, {type:'move', horizontal:true, offset_left:x-x1, offset_right:x2-x});

        },
        moveActive:function(profile, src, x, w){
            if(profile.$timeout_tt)clearTimeout(profile.$timeout_tt);
            if(!profile.$getCur){
                var t=profile.properties;

                profile.$getCur=function(x){
                    return linb.date.getText(
                        linb.date.add(t.dateRealStart, 'ms', x*t.rate)
                    ,t.unitFormat);
                };
            }

            src.style.left = (parseInt(x)||0)+"px";
            src.style.width = (parseInt(w)||0)+"px";
            //for performance
            profile.$timeout_tt = _.asyRun(function(){
                var tooltipstr = profile.$getCur(x) + " -> " + profile.$getCur(x+w+1);
                if(profile.$tooltip!=tooltipstr){
                    profile.$dd_tooltip.innerHTML = tooltipstr;
                    profile.$tooltip=tooltipstr;
                }
                profile.$timeout_tt=0;
            },5);
        },
        deActive:function(profile){
            var t=linb(profile.$active),x=t.left(),w=t.width();
            linb(profile.$active).width('0').display('none');
            if(profile.$timeout_tt)clearTimeout(profile.$timeout_tt);
            profile.$dd_tooltip.innerHTML = profile.$dd_otp;
            profile.$active=profile.$dd_tooltip=profile.$getCur=null;
            return {left :x, width :w};
        },
        minusLeft:function(profile,labelsBottom,labelsTop,offsetCount){
            var t=profile.properties;
            while(offsetCount++){
                labelsBottom.first().remove();
                temp=t.labelsBottom.shift();
            }
            while((temp.left+temp.width) >= (t.labelsTop[0].left+t.labelsTop[0].width)){
                labelsTop.first().remove();
                t.labelsTop.shift();
            }
        },
        minusRight:function(profile,labelsBottom,labelsTop,offsetCount){
            var t=profile.properties;
            while(offsetCount--){
                labelsBottom.last().remove();
                temp=t.labelsBottom.pop();
            }
            while(temp.left <= t.labelsTop[t.labelsTop.length-1].left){
                labelsTop.last().remove();
                t.labelsTop.pop();
            }
        },
        addLeft:function(profile, band, x, w, labelsBottom, labelsTop, offsetCount){
            // get additional bars
            var t=profile.properties, addLb2=[],addLb1=[];
            for(var i=0; i < offsetCount; i++){
                label = profile.box.getBarLabel(t.dateRealStart, t.unitParas,-i-1);
                addLb2.push({
                    left: t.unitPixels * (offsetCount-i-1),
                    width: t.unitPixels, // - 2*t.boderWidth,
                    height:t.labelBottomHeight,
                    text: label[0]
                });
                if(label[1]){
                    temp = t.unitPixels * (offsetCount-i-1);
                    t.labelsTop.each(function(o){
                        if(o.left == temp)return temp=false;
                    });
                    if(temp!==false)
                        addLb1.push({
                            left: temp,
                            width: t.labelTopWidth,
                            height:t.labelTopHeight,
                            text: label[1]
                        });
                }
            }
            // add to band UI
            labelsBottom.addFirst(profile.box.subBuild(profile, 'labelsBottom', addLb2).toDom());
            // add to memory list
            t.labelsBottom.insert(addLb2.reverse(),0);
            if(addLb1.length){
                labelsTop.addFirst(profile.box.subBuild(profile, 'labelsTop', addLb1).toDom());
                t.labelsTop.insert(addLb1.reverse(),0);
            }
        },
        addRight:function(profile, band, x, w, labelsBottom, labelsTop, offsetCount){
            // get additional bars
            var t=profile.properties, addLb2=[],addLb1=[];
            m=Math.abs(offsetCount);
            for(var i=0;i<m;i++){
                label = profile.box.getBarLabel(t.dateRealEnd, t.unitParas, i);
                addLb2.push({
                    left: w -t.unitPixels * (m-i),
                    width: t.unitPixels, //  - 2*t.boderWidth,
                    height:t.labelBottomHeight,
                    text: label[0]
                });
                if(label[1]){
                    temp=w -t.unitPixels * (m-i);
                    t.labelsTop.each(function(o){
                        if(o.left == temp)return temp=false;
                    });
                    if(temp!==false)
                        addLb1.push({
                            left: temp,
                            width: t.labelTopWidth,
                            height:t.labelTopHeight,
                            text: label[1]
                        });
                }
            }
            // build
            // add to band UI
            labelsBottom.addLast(profile.box.subBuild(profile, 'labelsBottom', addLb2).toDom());
            // add to memory list
            t.labelsBottom.insert(addLb2,-1);

            if(addLb1.length){
                labelsTop.addLast(profile.box.subBuild(profile, 'labelsTop', addLb1).toDom());
                t.labelsTop.insert(addLb1,-1);
            }
        },
        rePosition:function(profile,src){
            profile.pause=true;

            var label,m,n,temp,t=profile.properties,
                band = linb(src),
                labelsBottom = profile.getSubNode(profile.box.LABELSB),
                labelsTop = profile.getSubNode(profile.box.LABELST),
                bars= profile.getSubNode(profile.box.BARS),
                x = band.left(),
                w = band.width(),
                offset = x - t.band_left_keep;

            // if offset out a bar width
            if(Math.abs(offset)/t.unitPixels >=1){
                var offsetCount = parseInt(offset/t.unitPixels),
                    offsetPxs = offsetCount*t.unitPixels;

                band.left(x - offsetPxs);
                //reset sub controls dom position
                [labelsBottom, labelsTop].each(function(v){
                    linb(v).children().each(function(o){
                        o.style.left = (parseInt(o.style.left)||0) + offsetPxs + "px";
                    })
                });

                //reset tasks position var
                _.each(t.tasks,function(o){
                    o.left = o.left + offsetPxs;
                    profile.box.trimTask(profile,o);
                });
                t.labelsBottom.each(function(o){
                    o.left += offsetPxs;
                });
                t.labelsTop.each(function(o){
                    o.left += offsetPxs;
                });
                // delete out, andd add to blank
                if(offsetCount>0){
                    this.minusRight(profile,labelsBottom,labelsTop,offsetCount);
                    this.addLeft(profile, band, x, w, labelsBottom, labelsTop, offsetCount);
                }else{
                    this.minusLeft(profile,labelsBottom,labelsTop,offsetCount);
                    this.addRight(profile, band, x, w, labelsBottom, labelsTop, offsetCount);
                }

                // reset band paras
                t.band_left = band.left();
                t.band_width = band.width();

                var bak_s = t.dateRealStart, bak_e = t.dateRealEnd;
                t.dateRealStart = linb.date.add(t.dateRealStart, t.unit, -offsetCount*t.unitCount);
                t.dateRealEnd = linb.date.add(t.dateRealEnd, t.unit, -offsetCount*t.unitCount);
                t.rate = linb.date.diff(profile.properties.dateRealStart,profile.properties.dateRealEnd,'ms') / t.band_width;
                // reset date start point
                t.dateStart = this.getTime(profile, -t.band_left);

                // remove tasks
                _.filter(t.tasks,function(o){
                    if(o.left >= t.band_width ||  (o.left+o.width) <= 0){
                        //delete from lines
                        delete t.lines[o.line][o.id];
                        //destroy widgets
                        if(o.object)
                            o.object.boxing().destroy();
                        o=o.object=null;
                        //delete from tasks
                        return false;
                    }
                });

                //add tasks
                if(offsetCount>0){
                    this.getTasks(profile, t.dateRealStart, bak_s, t.rate, 'left');
                }else{
                    this.getTasks(profile, bak_e, t.dateRealEnd, t.rate, 'right');
                }

                //adjust the scrollbars
                this.reArrage(profile);
            }
            this.updateStartTimeTxt(profile);
            profile.pause = false;
        },
        trimTask:function(profile,o){
            //****
            // if too long, cut left
            var x = o.left, w=o.width, dom1=o.object.getDomNode(),dom2=o.object.getSubNode(o.object.box.NORMAL).get(0);
            if(x < -12){
                w = w - (-x - 12);
                x = -12;
            }
            dom1.style.left = String(x) + "px";

            // if too long, cut right
            if(x + w > profile.properties.band_width + 12)
                w = profile.properties.band_width + 12 - x;
            if(w>0)
                dom2.style.width = w + "px";
        },
        updateStartTimeTxt:function(profile){
            var band = profile.getSubNode(profile.box.BAND),
                x = band.left(),
                d = this.getTime(profile, -x);

            var str = linb.date.getText(d, profile.properties.unitFormat);
            profile.getSubNode(profile.box.TOOLTIP).text(str);
        },
        addTasks:function(profile, tasks){
            if(!tasks)return;
            var t=profile.properties, self=this,index,tt=t.tasks,
                bars = profile.getSubNode(profile.box.BARS);

            _.each(tasks, function(o,i){
                o.min=false;
                // caculate left and width
                o.left = self.getX(profile, o.start);
                o.width = self.getX(profile, o.end) - o.left;
                o.width=Math.max(o.width, 0);
                if(o.width<=16){
                    o.width=16;
                    o.min=true;
                }

                // caculate top and set task to lines cache
                index = self.getLinePos(profile, o);
                o.top = (t.barHeight+3) * index;

                //create dom, set double link
                var v = new linb.UI.TimeLine.Item();

                v = v.create(null,o);
                v = v.get(0);
                o.object=v;
                //if too large trim
                profile.box.trimTask(profile,o);
                bars.addLast(v);
                v.parent = profile;

                //set double link
                t.lines[index][i]=v;
                o.line = index;
            });
//opera 9 dead in here: why?
            // add task to timeline
            _.merge(tt, tasks, 'without');

            //adjust the scrollbars
            this.ajdustScroll(profile);
        },
        getLinePos:function(profile,o){
            if(o.min)return 0;

            var t=profile.properties;
            var b=false,index=0;
            t.lines.each(function(v,i){
                if(i===0)return;
                b=true;
                _.each(v,function(v){
                    v=v.properties;
                    if(o!==v)
                        if(((o.left + o.width)>=v.left) && ((v.left + v.width)>=o.left))
                            return b=false;
                });
                if(b){index=i;return false;}
            });
            if(!b)
                index = t.lines.push({})-1;
            return index;
        },
        // rearrage tasks for top position
        reArrage:function(profile){
            var t=profile.properties;
            t.lines.length = 1;
            //re caculate from current line
            _.each(t.tasks,function(v){
                if(!(v=v.object))return;
                if(v.properties.line===0)return;

                //get pos from current line
                index = this.getLinePos(profile, v.properties);
                t.lines[index][v.properties.id]=v;
                // if has space, reset position
                if(v.line !== index){
                    // reset double link
                    v.properties.line = index;
                    // set top
                    linb(v).top((t.barHeight+3) * index);
                };
            },this);
            //adjust the scrollbars
            this.ajdustScroll(profile);
        },
        //adjust the scrollbars
        ajdustScroll:function(profile){
            //adjust the scrollbars
            var t=profile.properties;
            var h = (t.lines.length + 1) * (t.barHeight + 2);
            var bar = profile.getSubNode(profile.box.SCROLLBAR);
            if( h > t.barsHeight){
                profile.getSubNode(profile.box.SCROLLIN).height(h);
                profile.getSubNode(profile.box.BARS).height(h);
                bar.display('block');
            }else{
                if(bar.display() !='none'){
                    h = t.barsHeight;
                    profile.getSubNode(profile.box.SCROLLIN).height(h);
                    profile.getSubNode(profile.box.BARS).height(h).top(t.barsTop);
                    bar.display('none');
                }
            }
        },
        //get tasks from control application
        getTasks:function(profile, start, end, minMs, type){
            if(profile.onGetTasks){
                var tasks = profile.onGetTasks(start, end, minMs, type);
                this.addTasks(profile, tasks);
            }
        }
    }
});


Class('linb.UI.TimeLine.Item','linb.UI.iWidget',{
    Instance:{
        parent:null,
        beforeBuild:function(profile){
            var t=profile.properties;
            if(t.min){
                t.min_display='block';
                t.normal_display='none';
            }else{
                t.min_display='none';
                t.normal_display='block';
            }
            t.head_left = 3;
            t.con_left = 9;
            t.right_left = t.width-2;
            t.con_width = t.width-12;
            t.con_width = Math.max(t.con_width, 0);
        }
    },
    Static:{
        Templates:{'default': {
            _tagName:'div',
            top:'{top}px',
            left:'{left}px',
            MIN:{
                _order:0,
                _tagName:'div',
                display:'{min_display}'
            },
            NORMAL:{
                _order:1,
                _tagName:'div',
                width:'{width}px',
                display:'{normal_display}',
                LEFT:{
                    _order:1,
                    _tagName:'div'
                },
                HEAD:{
                    _order:2,
                    _tagName:'div',
                    left:'{head_left}px'
                },
                CON:{
                    _order:3,
                    _tagName:'div',
                    left:'{con_left}px',
                    width:'{con_width}px',
                    text:'{title}'
                },
                RIGHT:{
                    _order:4,
                    _tagName:'div',
                    left:'{right_left}px'
                }
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{MIN:'MIN'},
            _clickEffect:{MIN:'MIN'},
            onMousedown:function(profile, e, src){
                // prevent timeline's onMousedown
                return false;
            },
            NORMAL:{
                onDragstart:function(profile, e, src){
                    var p = profile.parent;

                    p.$active = p.getSubNode(p.box.ACTIVE).get(0);
                    p.$dd_tooltip = p.getSubNode(p.box.TOOLTIP).get(0);
                    p.$dd_otp = p.$dd_tooltip.innerHTML;

                    profile.$dd_ox = linb.dragDrop.left;
                    profile.$dd_oleft = profile.properties.left;
                    profile.$dd_owidth = profile.properties.width;
                    linb(p.$active).display('block').cssPos({left :profile.$dd_oleft,  top :null}).width(profile.$dd_owidth).backgroundColor('transparent');
                },
                onDrag:function(profile, e, src){
                    var x,w,offset =linb.dragDrop.left-profile.$dd_ox,
                    t=profile.properties, p=profile.parent;
                    if(profile.$dd_type == "left"){
                        if(offset < profile.$dd_owidth){
                            x = profile.$dd_oleft + offset;
                            w = profile.$dd_oleft + profile.$dd_owidth - x;
                        }else{
                            x = profile.$dd_oleft + profile.$dd_owidth +1;
                            w = offset - profile.$dd_owidth;
                        }
                    }else if(profile.$dd_type == "right"){
                        if(-offset < profile.$dd_owidth){
                            x = profile.$dd_oleft;
                            w = profile.$dd_owidth + offset;
                        }else{
                            x = profile.$dd_oleft + offset + profile.$dd_owidth -1;
                            w = -offset - profile.$dd_owidth;
                        }
                    }else{
                        x = profile.$dd_oleft + offset;
                        w = profile.$dd_owidth;
                    }

                    p.box.moveActive(p, p.$active, x, w);
                },
                onDragend:function(profile, e, src){
                    var p = profile.parent;
                    var r = p.box.deActive(p);

                    profile.box.reset(profile,r);
                    profile.$dd_type = null;
                }
            },
            HEAD:{
                onMousedown:function(profile, e, src){
                    var p=profile.parent;
                    profile.getSubNode(profile.box.NORMAL).startDrag(e, {
                        move:false,
                        type:'shape',
                        horizontal:true,
                        target_parent:p.getSubNode(p.box.BARS)
                    });
                }
            },
            LEFT:{
                onMousedown:function(profile, e, src){
                    var p=profile.parent;
                    profile.$dd_type='left';
                    profile.getSubNode(profile.box.NORMAL).startDrag(e, {
                        type:'none'
                    });
                }
            },
            RIGHT:{
                onMousedown:function(profile, e, src){
                    var p=profile.parent;
                    profile.$dd_type='right';
                    profile.getSubNode(profile.box.NORMAL).startDrag(e, {
                        type:'none'
                    });
                }
            }
        }},
        Appearances:{'default':{
            KEY:{
                position:'absolute',
                overflow:'visible',
                height:'18px'
            },
            'MIN, NORMAL':{
                position:'absolute',
                left:'0',
                top:'0',
                height:'16px',
                overflow:'hidden',
                'z-index':'1'
            },
            'MIN':{
                display:'none',
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
            'NORMAL':{
                'background-color': '#C6D6F7',
                border:'solid 1px #203A83'
            },
            'NORMAL-mouseover':{
                'border-color': 'red'
            },
            'HEAD':{
                position:'absolute',
                background: linb.UI.getCSSImgPara('handler.gif'),
                top:'0',
                width:'6px',
                height:'100%',
                cursor:'move'
            },
            'LEFT, RIGHT':{
                position:'absolute',
                top:'0',
                width:'2px',
                height:'100%'
            },
            'LEFT':{
                cursor:'e-resize',
                left:'0'
            },
            'RIGHT':{
                cursor:'w-resize'
            },
            'CON':{
                position:'absolute',
                'padding-left':'2px',
                height:'100%',
                top:'0',
                left:'8px',
                cursor:'pointer'
            }
        }},

        reset:function(profile,o){
            var p=profile.parent, t=profile.properties;
            if(o.left){
                t.left=o.left;
                t.start = p.box.getTime(p,o.left);

                linb(profile.getDomNode()).left(o.left);
            }
            if(o.width){
                t.width=o.width;

                // keep +
                t.width=Math.max(t.width, 0);
                t.end = p.box.getTime(p,o.left+o.width);
                // if too small, show min
                if(t.width<=16){
                    t.width=o.width=16;
                    if(!profile.properties.min){
                        t.min=true;
                        t.width=16;
                        profile.getSubNode(profile.box.NORMAL).display('none');
                        profile.getSubNode(profile.box.MIN).display('block');
                    }
                // else show normal
                }else{
                    if(profile.properties.min){
                        profile.properties.min=false;
                        profile.getSubNode(profile.box.NORMAL).display('block');
                        profile.getSubNode(profile.box.MIN).display('none');
                    }
                    //****
                    // if too long ,cut right
                    if(o.left + o.width > p.properties.band_width + 12){
                        o.width = p.properties.band_width + 12 - o.left;
                    }

                    t.con_width = o.width -12;
                    // keep +
                    t.con_width = Math.max(t.con_width, 0);
                    t.right_left = o.width-2;
                    profile.getSubNode(profile.box.CON).width(t.con_width);
                    profile.getSubNode(profile.box.RIGHT).left(t.right_left);

                    profile.getSubNode(profile.box.NORMAL).width(o.width);
                }
            }
            // rearrage top position
            p.box.reArrage(p);
        }
    }
});

linb.UI.TimeLine.tooltips = function(data){
    var lang = linb.UI.$lang;
    switch(lang){
        case 'cn':
            _.merge(data, {
                tooltipPre : "previous",
                tooltipNext : "next",
                tooltipZoomIn : "zoom in",
                tooltipZoomOut : "zoom out",
                tooltipTask : "drag to add a task",
                tooltipToday : "to now"
            },'all');
            break;
        default:
            _.merge(data, {
                tooltipPre : "previous",
                tooltipNext : "next",
                tooltipZoomIn : "zoom in",
                tooltipZoomOut : "zoom out",
                tooltipTask : "drag to add a task",
                tooltipToday : "to now"
            },'all');
    }

};
