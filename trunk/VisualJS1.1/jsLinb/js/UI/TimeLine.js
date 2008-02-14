/*
*to do: background div
*to do: special div
*
*/

Class('linb.UI.TimeLine', ['linb.UI.iWidget','linb.UI.iList','linb.UI.iSchedule'], {
    Instance:{
        setCtrlValue:function(value){
            if(!value)return;
            if(value.indexOf(':')==-1)return;
            var profile=this.get(0),
                p=profile.properties,
                box=this.constructor,
                a=value.split(':'),
                start=new Date(parseInt(a[0])),
                end=new Date(parseInt(a[1])),
                pxStart=box._getX(profile,start),
                pxEnd=box._getX(profile,end),
                task;
            if(p.items.length===0)
                this.insertItems([{id:'$', caption:p.dftCaption, start:start, end:end}],null,true);
            else
                box._resetItem(profile,{left:pxStart,width:pxEnd-pxStart},profile.getSubNodeByItemId('ITEM',p.items[0].id).get(0));
        },
        disabled:function(value){
            return this.each(function(o){
                o.getSubNode('VIEW').opacity(value?0.5:1);
            });
        },
        visibleTask:function(){
            var profile=this.get(0),
                p=profile.properties,
                date=linb.date,
                items=p.items;
            if(items.length && !p.multiTasks){
                target=new Date(items[0].start);
                if(target<p.dateStart || target>date.add(p.dateStart,'ms',p.width*p._rate))
                    profile.box._rePosition(profile, -date.diff(p.dateStart,target,'ms')/p._rate + p._band_left);
            }
        },
        afterInsertItems:function(profile){
            profile.box._reArrage(profile);
        },
        _cache:function(){
            var profile=this.get(0),
                cls=this.constructor,
                picker=cls._picker;
            if(picker && picker.domNode)
                profile.getSubNode('POOL').addLast(picker.root.display('none'));
        }
    },
    Static:{
        Dropable:['ITEMS'],
        cssNone:false,
        Templates:{'default':{
            tagName:'div',
            style:'{_style}',
            BORDER:{
                tagName:'div',
                style:'height:{_bHeight}px;width:{_bWidth}px;',
                FOCUS:{tagName:'button'},
                POOL:{
                    tagName:'div',
                    style:'position:absolute;left:0;top:0;width:0;height:0;display:none;'
                },
                BAR:{
                    tagName:'div',
                    style:'{_bardisplay};height:{barHeight}px;',
                    CMDS:{
                        tagName:'div',
                        DATE:{$order:0,style:'{dateDisplay}'},
                        PRE:{$order:2},
                        'ZOOMIN':{$order:3,style:'{zoomDisplay}'},
                        'ZOOMOUT':{$order:4,style:'{zoomDisplay}'},
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
                    BIGLABEL:{
                        tagName:'div',
                        style:'height:{bigLabelHeight}px;z-index:3;{_showBigLabel}',
                        text:"{_bigMarks}"
                    },
                    SMALLLABEL:{
                        $order:1,
                        tagName:'div',
                        style:'height:{smallLabelHeight}px;z-index:4;',
                        text:"{_smallMarks}"
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
                                tagName:'div'
                            }
                        },
                        SCROLL:{
                            tagName:'div',
                            SCROLLI:{
                                tagName:'div'
                            }
                        }
                },
                TIPS:{
                    $order:4,
                    style:'z-index:2;{_tipsdisplay};height:{tipsHeight}px',
                    tagName:'div'
                }
            },
            $dynamic : {
                _bigMarks:{
                    LABELT:{
                        id:null,
                        className:null,
                        tagName:'div',
                        style:'width:{width}px;left:{left}px;',
                        text:'{text}'
                    }
                },
                _smallMarks:{
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
                        style:'left:{_left}px;width:{_width}px;{_top};{_height};',
                        MIN:{
                            $order:0,
                            tagName:'div',
                            style:'{_minDisplay}'
                        },
                        NORMAL:{
                            $order:1,
                            tagName:'div',
                            style:'{_normalDisplay};{_height};{_border}',
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
            _hoverEffect:{PRE:'PRE',NEXT:'NEXT',ZOOMIN:'ZOOMIN',ZOOMOUT:'ZOOMOUT',DATE:'DATE',OPT:'OPT',CLOSE:'CLOSE',MIN:'MIN',NORMAL:'NORMAL'},
            _clickEffect:{PRE:'PRE',NEXT:'NEXT',ZOOMIN:'ZOOMIN',ZOOMOUT:'ZOOMOUT',DATE:'DATE',OPT:'OPT',CLOSE:'CLOSE',MIN:'MIN'},
            onRewh:function(profile, e, src){
                var o = profile.domNode.style,f=parseInt, n=null, w=n, h=n;
                if(e.height)h=f(o.height)||n;
                if(e.width)w=f(o.width)||n;
                if(h)profile.box.resize(profile, w, h);
            },
            CLOSE:{
                onClick:function(profile, e, src){
                    if(profile.properties.disabled)return;
                    var instance = profile.boxing();

                    if(false===instance.beforeClose(profile, src)) return;

                    instance.destroy();

                    //for design mode in firefox
                    return false;
                }
            },
            OPT:{
                onClick:function(profile, e, src){
                    if(profile.properties.disabled)return;
                    profile.boxing().onTriggerOption(profile, e, src);
                }
            },
            onClick:function(profile, e){
                profile.box._focus(profile);
            },
            BAND:{
                onMousedown:function(profile, e, src){
                    if(profile.pause)return;
                    var t=profile.properties,
                        r=-t._band_left,
                        date=linb.date,
                        rate=t._rate,
                        ep=linb.event.getPos(e),
                        l=t._band_width-r-t.width;
                    ;
                    if(t._minDate && t._smallLabelStart<t._minDate)
                        r-=date.diff(t._smallLabelStart,t._minDate,'ms')/rate;
                    if(t._maxDate && t._smallLabelEnd>t._maxDate)
                        l-=date.diff(t._maxDate,t._smallLabelEnd,'ms')/rate;
                    if(r<0)r=0;
                    if(l<0)l=0;

                    linb([src]).startDrag(e, {move:false, type:'blank', horizontal:true, target_left:ep.left,target_top:ep.top,offset_left:l, offset_right:r});
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
                    if(linb.dragDrop.working)return;
                    profile.$itemspos = linb([src]).absPos();
                },
                onMousemove:function(profile,e){
                    if(linb.dragDrop.working){
                        //ondrag add here, for performance of 'dont-use-dropable situation'.
                        if(profile.$$ondrag){
                            var d=linb.dragDrop;
                            profile.box._moveActive(profile, profile.$active, d.x-profile.$dd_ox, profile.properties.unitPixs);
                        }
                    }else{
                        var t=profile.properties,
                            date=linb.date,
                            s=t._smallLabelStart,
                            r=t._rate,
                            u=t.timeFormat,
                            p1=linb.event.getPos(e),
                            p2=profile.$itemspos;
                        if(p2 && t.showTips)
                            profile.box._setTips(profile, date.getText(date.add(s, 'ms', (p1.left-p2.left)*r),u));
                    }
                },
                onMouseout:function(profile,e,src){
                    if(linb.dragDrop.working)return;
                    if(profile.properties.showTips)
                        profile.box._setTips(profile, '');
                },
                onMousedown:function(profile, e, src){
                    if(profile.properties.disabled || profile.properties.readonly)return;
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
                    profile.$task_l=profile.$dd_oleft = parseInt(src.style.left)||0;
                    profile.$task_w=0;
                    linb([src,src.parentNode]).cursor('e-resize');
                },
                onDrag:function(profile, e, src){
                    var x=profile.$dd_oleft,
                        ddx=linb.dragDrop.x,
                        w,
                        offset;
                    if((offset =ddx-profile.$dd_ox)>=0){
                        w = offset;
                    }else{
                        x = x+offset; w = -offset;
                    }
                    profile.box._moveActive(profile, src, profile.$task_l=x, profile.$task_w=w);
                },
                onDragend:function(profile, e, src){
                    profile.box._deActive(profile);
                    linb([src,src.parentNode]).cursor('');

                    var box=profile.box,
                        start=box._getTime(profile, profile.$task_l),
                        end=box._getTime(profile, profile.$task_l+profile.$task_w),
                        p=profile.properties,
                        task,t,
                        b=profile.boxing();

                    if(profile.properties.multiTasks){
                        task={id:_.id(),caption:p.dftCaption,start:start,end:end};
                        if(profile.beoferAddTasks && false===b.beoferAddTasks(profile, [task])){}else
                            b.insertItems([task],null,true);
                    }else
                        b.updateUIValue(start+":"+end);

                    profile.$task_l=profile.$task_w=profile.$dd_ox =profile.$dd_oleft=null;
                }
            },
            FOCUS:{
                onFocus:function(profile, e, src){
                    _.resetRun(profile.KEY+':focus',function(){
                        profile.addTagClass('BAR', '-focus');
                    });
                },
                onBlur:function(profile, e, src){
                    _.resetRun(profile.KEY+':focus',function(){
                        profile.removeTagClass('BAR', '-focus');
                    });
                },
                onKeydown:function(profile, e, src){
                    if(profile.pause)return;
                    profile.pause=true;

                    // speed
                    var t=profile.properties,
                        date=linb.date,
                        rate=t._rate,
                        maxOffset = 30,
                        o=profile.box._getMoveNodes(profile),
                        x=o.left(),
                        xx=t._band_left,
                        off=t._scroll_offset
                        ;

                    off = t._scroll_offset = off>maxOffset ? off :off*1.05;

                    switch(linb.event.getKey(e)[0]){
                        case 'left':
                        case 'up':
                            if(t._minDate && date.add(t.dateStart,'ms',(xx-x-off)*rate)<t._minDate)
                                off=date.diff(t._minDate, t.dateStart,'ms')/rate + (xx-x);
                            if(off<0)off=0;
                            o.left(x + off);
                            break;
                        case 'right':
                        case 'down':
                            if(t._maxDate && date.add(t.dateStart,'ms',(xx-x+off+t.width)*rate)>t._maxDate)
                                off=date.diff(t.dateStart,t._maxDate,'ms')/rate - (xx-x+t.width);
                            if(off<0)off=0;
                            o.left(x - off);
                            break;
                    }

                    if((x + maxOffset > 0) || (x + o.width() - t.width - maxOffset < 0))
                        profile.box._rePosition(profile);
                    profile.pause=false;
                    return false;
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

                    var t=profile.properties,
                        date=linb.date,
                        rate=t._rate,
                        o=profile.box._getMoveNodes(profile),
                        x1=t._band_left,
                        x2=0;
                    ;
                    if(t._minDate && t._smallLabelStart<t._minDate)
                        x2-=date.diff(t._smallLabelStart,t._minDate,'ms')/rate;

                    profile.pause=true;
                    o.fx({left:[x1,x2]}, null, function(){
                        profile.box._rePosition(profile);
                        profile.pause=false;
                    },200,Math.max(5,(x2-x1)/100),'inoutsine').start();
                }
            },
            NEXT:{
                onClick:function(profile, e){
                    if(profile.pause)return;
                    var t=profile.properties,
                        date=linb.date,
                        rate=t._rate,
                        o=profile.box._getMoveNodes(profile),
                        x1=t._band_left,
                        x2=t.width-t._band_width;
                    ;
                    if(t._maxDate && t._smallLabelEnd>t._maxDate)
                       x2+=date.diff(t._maxDate,t._smallLabelEnd,'ms')/rate;

                    if(x1>x2){
                        profile.pause=true;
                        o.fx({left:[x1,x2]}, null, function(){
                            profile.box._rePosition(profile);
                            profile.pause=false;
                        },200,Math.max(5,(x1-x2)/100),'inoutsine').start();
                    }
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
                        p.timeSpanKey =  z[index- 1][0];

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
                        p.timeSpanKey = z[index + 1][0];

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
                onClick:function(profile, e, src){
                    if(profile.pause)return;
                    var cls=profile.box,
                        box=profile.boxing(),
                        start=profile.properties.dateStart,
                        o,node;

                    if(cls._picker && cls._picker.domNode){
                       o=cls._picker.boxing();
                    }else{
                        o=linb.create('DatePicker');
                        cls._picker=o.get(0);
                        o.beforeClose(function(){
                            this.boxing()._cache();
                            return false;
                        })
                        .beforeValueUpdated(function(p, ov, v){
                            var profile=this,
                                obj = profile.getSubNodes(['VIEW','BAND']),
                                box=profile.boxing();
                            profile.properties.dateStart=v;
                            //obj.fx( {opacity:[1,0.2]}, null, function(){
                                box.refresh();
                                profile.box._focus(profile);
                            //    profile.pause=false;
                            //},200,5,'insine').start()
                            box._cache();
                        });
                    }
                    o.setValue(start,true).host(profile);
                    node=o.reBoxing();
                    node.popToTop(src);

                    //for on blur disappear
                    node.setBlurTrigger(profile.key+":"+profile.$id, function(){
                        box._cache();
                    });

                    //for esc
                    linb.event.hookKey('esc',0,0,0,function(){
                        box._cache();
                        cls._focus(profile);
                        //unhook
                        linb.event.hookKey('esc',0,0,0,null);
                    });
                }
            },
            ITEM:{
                onMousedown:function(profile, e, src){
                    // prevent timeline's onMousedown
                    return false;
                },
                onDragbegin:function(profile, e, src){
                    var t=profile.getItemByDom(src),
                        type=profile.$dd_type,
                        cursor=type?'e-resize':'move',
                        ac=profile.$active;
                    profile.$dd_ox = linb.dragDrop.x;
                    profile.$dd_oleft = parseInt(src.style.left);
                    profile.$dd_owidth = parseInt(src.style.width);
                    linb([ac]).display('block').cssPos({left :profile.$dd_oleft,  top :null}).width(profile.$dd_owidth-2);
                    linb([ac,ac.parentNode]).cursor(cursor);
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
                            x = ddl + ddw;
                            w = offset - ddw;
                        }
                    }else if(type == "right"){
                        if(-offset < ddw){
                            x = ddl;
                            w = ddw + offset;
                        }else{
                            x = ddl + offset + ddw;
                            w = -offset - ddw;
                        }
                    }else{
                        x = ddl + offset;
                        w = ddw;
                    }
                    profile.box._moveActive(profile, profile.$active, x, w);
                },
                onDragend:function(profile, e, src){
                    var box=profile.box,
                        r = profile.box._deActive(profile),
                        ac=profile.$active;

                    if(profile.properties.multiTasks)
                        box._resetItem(profile,r,src);
                    else{
                        var start=box._getTime(profile, r.left),
                            end=box._getTime(profile, r.left+r.width)
                            ;
                        profile.boxing().updateUIValue(start+":"+end);
                    }

                    profile.$dd_type = null;

                    linb([ac,ac.parentNode]).cursor('');
                }
            },
            HEAD:{
                onMousedown:function(profile, e, src){
                    if(profile.properties.disabled || profile.properties.readonly)return;
                    linb([src]).parent(2).startDrag(e, {
                        defer:1,
                        type:'none'
                    });
                }
            },
            LEFT:{
                onMousedown:function(profile, e, src){
                    if(profile.properties.disabled || profile.properties.readonly)return;
                    profile.$dd_type='left';
                    linb([src]).parent(2).startDrag(e, {
                        defer:1,
                        type:'none'
                    });
                }
            },
            RIGHT:{
                onMousedown:function(profile, e, src){
                    if(profile.properties.disabled || profile.properties.readonly)return;
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
            readonly:false,
            // control width and height
            width : 400,
            height : 200,
            //invisible band count (left,right)
            //if it's zero, leftSpanCount will be visible count(based on widget width)
            leftSpanCount:0,
            rightSpanCount:0,

            dftCaption:'task',

            //time span key
            timeSpanKey : '',
            //timespan of a small label is equal to smallLabelCount*smallLabelUnit
            // how much px to represent a unit
            unitPixs : 28,

            //time span count
            smallLabelCount:2,
            //time span unit
            smallLabelUnit:{
                ini:'h',
                listbox:_.toArr(linb.date.TIMEUNIT,true)
            },
            bigLabelCount:12,
            //time span unit
            bigLabelUnit:{
                ini:'h',
                listbox:_.toArr(linb.date.TIMEUNIT,true)
            },
            //time format
            timeFormat:{
                ini:'ymdhn',
                listbox:_.toArr(linb.date.TEXTFORMAT,true)
            },
            //big label format
            bigLabelFormat:{
                ini:'ymdh',
                listbox:_.toArr(linb.date.TEXTFORMAT,true)
            },
            //small label format
            smallLabelFormat:{
                ini:'h',
                listbox:_.toArr(linb.date.TEXTFORMAT,true)
            },
            //bar
            showBar:true,
            barHeight : 22,
            //tips
            showTips:true,
            tipsHeight : 16,
            //big label
            showBigLabel: true,
            bigLabelHeight : 16,

            smallLabelHeight : 14,
            taskHeight : 16,
            multiTasks:false,

            minDate:{
                ini:'',
                set:function(v){
                    return this.each(function(o){
                        var p=o.properties,
                            k = p._minDate = linb.date.parse(p.minDate=v);
                        if(k>p.dateStart)
                            o.box._rePosition(o, -linb.date.diff(p.dateStart,k,'ms')/p._rate + p._band_left);
                    });
                }
            },
            maxDate:{
                ini:'',
                set:function(v){
                    return this.each(function(o){
                        var p=o.properties,
                            k = p._maxDate = linb.date.parse(p.maxDate=v),
                            t;
                        if(k<(t=linb.date.add(p.dateStart,'ms',p.width*p._rate)))
                            o.box._rePosition(o, -linb.date.diff(t,k,'ms')/p._rate + p._band_left);
                    })
                }
            },
            dateBtn:true,
            closeBtn:false,
            optBtn:false,

            items:{
                ini:[]
            },

            dateStart : new Date,
            scrollRateBase:5
        },
        EventHandlers:{
            beforeClose:function(profile, src){},
            onTriggerOption:function(profile, e, src){},
            onGetTasks:function(profile, start, end, minMs, type){},
            beforeChangeTask:function(profile, item){},
            beoferAddTasks:function(profile, items){},
            beforeDelTasks:function(profile, arr){}
        },
        Appearances:{'default':{
            KEY:{
                'background-color':'#fff'
            },
            BORDER:{
                overflow: 'hidden',
                position: 'relative',
                top: '0',
                border: 'solid 1px #505050'
            },
            BAR:{
                position:'relative',
                'z-index':5,
                background: linb.UI.getCSSImgPara('barvbg.gif', ' repeat-x left top', null, 'linb.UI.Public')
            },
            'BAR-focus':{
                $order:2,
                'background-position' : 'right -22px'
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
            TIPS:{
                position:'absolute',
                left:'0',
                width:'100%',
                bottom:'0',
                'background-color':'#ECE9D8',
                'border-top':'solid 1px #505050'
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
            'BAND, VIEW, BIGLABEL, SMALLLABEL':{
                position:'relative'
            },
            VIEW:{
                width:linb.browser.ie6?'100%':null,
                overflow:'hidden'
            },
            SCROLL:{
                'z-index':500,
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
            'BIGLABEL, SMALLLABEL':{
                'background-color':'#ECE9D8',
                cursor:'move'
            },
            'BIGLABEL,SMALLLABEL':{
                'border-bottom':'solid 1px #505050'
            },
            ITEMS:{
                position:'relative',
                background: linb.UI.getCSSImgPara('bars.gif',' left top')
            },
            'BIGLABEL div, SMALLLABEL div':{
                'border-left':'solid 1px #505050',
                'text-align':'center',
                position:'absolute',
                cursor:'move',
                top:0,
                height:'100%'
            },
            'BIGLABEL div':{
                $order:2,
                'text-align':'left',
                'padding-left':'4px'
            },

            ACTIVE:{
                'z-index':300,
                position:'relative',
                'border-left': '1px dashed',
                'border-right': '1px dashed',
                left:'-100px',
                width:'0',
                background:0,
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
            MIN:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat  -31px -65px', null, 'linb.UI.Public')
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
                overflow:'visible'
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
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -30px -80px', null, 'linb.UI.Public'),
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
            var self=this, t=self.properties,cls=self.box;
            cls._setDropable(self);

            self.$active = self.getSubNode('ACTIVE').get(0);
            cls._ajustHeight(self);
        },
        _setDropable:function(profile){
            var dd=linb.dragDrop,
                nf=function(){return false};
            _.merge(profile,{
                $onDropMarkShow:function(){dd.setDropableIcon('add');return false},
                $onDropMarkClear:function(){dd.setDropableIcon();return false},
                $onDragEnter:function(profile,e,src){
                    var t=profile.properties,
                        ep=linb.event.getPos(e),
                        _left = t.unitPixs/2
                    ;
                    linb(profile.$active).display('block');
                    profile.$dd_ox =linb([src]).absPos().left+_left;

                    profile.$$ondrag=true;
                },
                $onDragLeave:function(profile){
                    profile.$$ondrag=profile.$dd_ox=null;

                    profile.box._deActive(profile);
                },
                $onDrop:function(profile){
                    profile.$$ondrag=profile.$dd_ox=null;

                    var r = profile.box._deActive(profile),
                        task={id:_.id(),caption:profile.properties.dftCaption},
                        box=profile.box,
                        b=profile.boxing();

                    task.start = box._getTime(profile, r.left);
                    task.end = box._getTime(profile, r.left+r.width);

                    if(profile.beoferAddTasks && false===b.beoferAddTasks(profile, [task])){}else
                        b.insertItems([task],null,true);
                }
            },'all');
        },
        prepareData:function(profile){
            var p=profile.properties,
                d=profile.data,
                date=linb.date,
                us=date.TIMEUNIT,
                nodisplay='display:none',
                zoom=profile.box.zoom,
                m=0,u,
                i,t,label,temp,_date,width,rate,
                _unitParas,
                _dateStart,
                _barCount,_leftBarCount,_rightBarCount,_barCountall,

                smallMarks,smallLabelStart,smallLabelEnd,smallLabelUnit,smallLabelCount,smallLabelFormat
                ;

            if(p.minDate)p._minDate=date.parse(p.minDate);
            if(p.maxDate)p._maxDate=date.parse(p.maxDate);

            d.dateDisplay = p.dateBtn?'':nodisplay;
            d.closeDisplay = p.closeBtn?'':nodisplay;
            d.optDisplay = p.optBtn?'':nodisplay;
            d._showBigLabel=p.showBigLabel?'':nodisplay;

            // for quick move
            p._scroll_offset = p.scrollRateBase;

            p._lines=[{}];

            //border
            d._bWidth = p.width - 2*p.$borderW;
            d._bHeight = p.height - 2*p.$borderW;
            //view
            p._viewHeight = d._bHeight - (p.showTips&&p.tipsHeight) - (p.showBigLabel?p.bigLabelHeight:0) - p.smallLabelHeight - (p.showBar&&p.barHeight);
            d._tipsdisplay=p.showTips?'':nodisplay;
            d._bardisplay = p.showBar?'':nodisplay;

            //get unitparas from timespan key
            if(p.timeSpanKey){
                zoom.each(function(o){
                    if(o[0]===p.timeSpanKey){
                        _unitParas=p._unitParas=o;
                        return false;
                    }
                });
                //give a default key
                if(!_unitParas)
                    _unitParas=p._unitParas=zoom[p.timeSpanKey='1 d'];
            }
            //if no timeSpanKey( _unitParas) input,
            d.zoomDisplay = _unitParas?'':nodisplay;

            if(_unitParas){
                p.unitPixs= _unitParas[1];
                p.smallLabelCount = _unitParas[2];
                p.smallLabelUnit = _unitParas[3];
                p.smallLabelFormat = _unitParas[4];
                p.bigLabelCount = _unitParas[5];
                p.bigLabelUnit = _unitParas[6];
                p.bigLabelFormat = _unitParas[7];
                p.timeFormat = _unitParas[8];
            }
            u=p.unitPixs;
            smallLabelCount = p.smallLabelCount;
            smallLabelUnit = p.smallLabelUnit;
            smallLabelFormat = p.smallLabelFormat;

            // get bar count in view
            _barCount = (Math.ceil(p.width / u)||0);
            _leftBarCount = p.leftSpanCount?p.leftSpanCount:_barCount;
            _rightBarCount = p.rightBarCount?p.rightBarCount:_barCount;
            _barCountall =  _barCount + _leftBarCount + _rightBarCount;

            // ms per px
            rate = p._rate = us[smallLabelUnit]*smallLabelCount/u;

            //adjust dateStart
            if(p._maxDate&& date.add(p.dateStart,'ms',p.width*rate) > p._maxDate)
                p.dateStart=date.add(p._maxDate,'ms',-p.width*rate);
            if(p._minDate&& p.dateStart<p._minDate)
                p.dateStart=p._minDate;

            // get the round start from the approximate start
            _dateStart = date.getRoundDown(p.dateStart, smallLabelUnit, smallLabelCount);
            // rel start in band
            smallLabelStart=p._smallLabelStart = date.add(_dateStart, smallLabelUnit, -_leftBarCount*smallLabelCount);
            // rel end in band
            smallLabelEnd = p._smallLabelEnd = date.add(smallLabelStart, smallLabelUnit, _barCountall*smallLabelCount);

            // get band with
            p._band_width = Math.ceil(date.diff(smallLabelStart,smallLabelEnd, 'ms')/rate);

            // set band left
            p._band_left_fix = p._band_left = - Math.ceil(date.diff(smallLabelStart, p.dateStart, 'ms')/rate);

            // build bars
            smallMarks = p._smallMarks = [];

            temp=0;
            label=date.get(smallLabelStart, smallLabelFormat);
            for(i=0; i< _barCountall; i++){
                _date = date.add(smallLabelStart, smallLabelUnit, smallLabelCount*(i+1));
                width = Math.ceil(date.diff(smallLabelStart, _date, 'ms')/rate);
                smallMarks.push({
                    left : temp,
                    width : width - temp,
                    text : label
                });
                temp=width;
                label=date.getText(_date, smallLabelFormat);
            }


            if(p.showBigLabel){
                var _barCount2,off,
                    bigMarks,bigLabelStart,bigLabelEnd,

                    bigLabelCount = p.bigLabelCount,
                    bigLabelUnit = p.bigLabelUnit,
                    bigLabelFormat = p.bigLabelFormat
                    ;

                bigMarks = p._bigMarks = [];
                bigLabelStart=p._bigLabelStart =date.getRoundDown(smallLabelStart, bigLabelUnit, bigLabelCount);
                bigLabelEnd=p._bigLabelEnd = date.getRoundUp(smallLabelEnd, bigLabelUnit, bigLabelCount);
                _barCount2 = date.diff(bigLabelStart, bigLabelEnd, bigLabelUnit)/bigLabelCount;
                off=date.diff(smallLabelStart, bigLabelStart, 'ms')/rate;
                label=date.getText(bigLabelStart, bigLabelFormat);
                temp=0;
                for(i=0; i< _barCount2; i++){
                    _date = date.add(bigLabelStart, bigLabelUnit, bigLabelCount*(i+1));
                    width = date.diff(bigLabelStart, _date, 'ms')/rate;
                    bigMarks.push({
                        left : Math.ceil(temp + off),
                        width : Math.ceil(width - temp),
                        text : label
                    });
                    temp=width;
                    label=date.getText(_date, bigLabelFormat);
                }
            }
            arguments.callee.upper.call(this, profile);
        },
        prepareItem:function(profile, item, oitem, pid){
            var self=this,
            t=profile.properties,
            d=profile.data,
            index;

            item._min=false;
            // caculate left and width
            item._left = self._getX(profile, item.start);
            item._width=Math.max(self._getX(profile, item.end) - item._left, 0);
            if(t.multiTasks){
                if(item._width<=16){
                    item._width=16;
                    item._min=true;
                }
            }
            item._minDisplay=item._min?'':'display:none';
            item._normalDisplay=item._min?'display:none':'';

            // caculate top and set task to lines cache
            index = self._getLinePos(profile, item);


            item._top = t.multiTasks? 'top:' + (t.taskHeight+3) * index + 'px':'';
            item._height = 'height:' + (t.multiTasks?'16px':'100%');
            item._border = t.multiTasks?'':'border-top:0;border-bottom:0';

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
            ['10 ms', 54, 10, 'ms', 'ms', 100, 'ms','hnsms','hnsms'],
            ['100 ms',54,  100, 'ms', 'ms', 1, 's','hns','hnsms'],
            ['1 s',30,  1, 's','s', 10, 's','hns','hnsms'],
            ['10 s', 30, 10, 's', 's',60, 's','hns','hnsms'],
            ['1 n',30,  1, 'n','n', 10, 'n','dhn','hns'],
            ['5 n', 30, 5, 'n','n', 30, 'n','mdhn','hns'],
            ['10 n', 30, 10, 'n','n', 60, 'n','mdhn','hns'],
            ['30 n', 30, 30, 'n','n', 4, 'h','ymdh','mdhn'],
            ['1 h', 30, 1, 'h','h',  6, 'h','ymdh','mdhn'],
            ['2 h', 30, 2, 'h','h', 12, 'h','ymdh','mdhn'],
            ['6 h', 30, 6, 'h','h', 24, 'h','ymd','mdhn'],
            ['1 d', 24, 1, 'd','w', 1, 'ww','ymd','ymdh'],
            ['1 w', 30, 1, 'ww','ww', 4, 'ww','ymd','ymd'],
            ['15 d', 30, 15, 'd','d', 2, 'm','ymd','ymd'],

//Not every unit width is the same value:
            ['1 m',  30,1, 'm','m', 1, 'q','yq','ymd'],
            ['1 q',  30,1, 'q','q', 1, 'y','y','ymd'],
            ['1 y',  48,1, 'y','y', 10, 'y','y','ym'],
            ['1 de',  48, 1, 'de','de', 100, 'y','y','ym'],
            ['1 c',  48, 1, 'c', 'c', 1000, 'y','y','y']

        ],
        _focus:function(profile){
            profile.getSubNode('FOCUS').focus(1);
        },
        _getTips:function(profile){
            var t,s='$dd_tooltip';
            if(t = profile[s] || (profile[s] = profile.getSubNode('TIPS').get(0).childNodes[0]))
                return t.nodeValue;
            else
                return profile.getSubNode('TIPS').get(0).innerHTML;
        },
        _rr:/\<[^>]*\>/g,
        _setTips:function(profile, text){
            var t,s='$dd_tooltip';
            text=text.replace(this._rr,'');
            if(t = profile[s] || (profile[s] = profile.getSubNode('TIPS').get(0).childNodes[0])){
                if(t.nodeValue!=text)t.nodeValue=text;
            }else
                profile.getSubNode('TIPS').get(0).innerHTML=text;
        },
        _getX:function(profile, time){
            var t=profile.properties,d=new Date;
            d.setTime(time);
            return (Math.ceil(linb.date.diff(t._smallLabelStart, d, 'ms')||0) / t._rate);
        },
        _getTime:function(profile, x, flag){
            var t=profile.properties;
            t = linb.date.add(t._smallLabelStart, 'ms', x*t._rate);
            return flag?t:t.getTime();
        },
        _moveActive:function(profile, src, x, w){
            var p=Math.ceil,
                t=profile.properties,
                d=linb.date,
                s=t._smallLabelStart,
                r=t._rate,
                u=t.timeFormat,
                ms='ms',
                y=src.style,
                z='px',
                m,n;
            m = (p(x)||0);
            n = ((p(w)||0)-2);
            if(n>0){
                y.left= m+z;
                y.width= n+z;
                if(t.showTips)
                    profile.box._setTips(profile, d.getText(d.add(s, ms, x*r),u)
                        + " - "
                        + d.getText(d.add(s, ms, (x+w)*r),u)
                    )
            }
        },
        _deActive:function(profile){
            var t=profile.$active.style, x=parseInt(t.left)||0, w=(parseInt(t.width)||0)+2;
            t.left='-1000px';
            if(profile.properties.showTips)
                profile.box._setTips(profile, '');
            return {left :x, width :w};
        },
        _minusLeft:function(profile,marks,node,offsetCount){
            var t=profile.properties;
            while((offsetCount--)>0){
                node.first().remove();
                temp=marks.shift();
            }
        },
        _minusRight:function(profile,marks,node,offsetCount){
            var t=profile.properties;
            while((offsetCount--)>0){
                node.last().remove();
                temp=marks.pop();
            }
        },
        _addLeft:function(profile, tag, node, offsetCount,  offset){
            // get additional bars
            var t=profile.properties,
                date=linb.date,
                chr='_',
                key=chr+tag+'Marks',
                marks=t[key],
                labelStart=t[chr+tag+'LabelStart'],
                labelUnit=t[tag+'LabelUnit'],
                labelCount=t[tag+'LabelCount'],
                labelFormat=t[tag+'LabelFormat'],
                rate=t._rate,
                addLb=[],
                temp,label,_date,i;

            temp=0;
            label=date.getText(labelStart, labelFormat);
            for(i=0; i< offsetCount; i++){
                _date = date.add(labelStart, labelUnit, labelCount*(i+1));
                width = date.diff(labelStart, _date, 'ms')/rate;
                addLb.push({
                    left : Math.ceil(temp + (offset||0)-0.0000000000003),
                    width : Math.ceil(width - temp),
                    text : label
                });
                temp=width;
                label=date.getText(_date, labelFormat);
            }
            addLb.reverse();
            // add to band UI
            node.addFirst(profile.box.subBuild(profile, key, addLb).toDom());
            // add to memory list
            marks.insertAny(addLb.reverse(),0);
        },
        _addRight:function(profile, labelEnd, tag, node, offsetCount,  offset){
            var t=profile.properties,
                date=linb.date,
                chr='_',
                key=chr+tag+'Marks',
                marks=t[key],
                labelStart=t[chr+tag+'LabelStart'],
                labelUnit=t[tag+'LabelUnit'],
                labelCount=t[tag+'LabelCount'],
                labelFormat=t[tag+'LabelFormat'],
                rate=t._rate,
                addLb=[],_d1,
                _date,i;
            _d1=labelEnd;
            for(i=0; i<offsetCount; i++){
                _date = date.add(labelEnd, labelUnit, labelCount*(i+1));
                addLb.push({
                    left : Math.ceil(date.diff(labelStart,_d1,'ms')/rate+ (offset||0)-0.0000000000003),
                    width : Math.ceil(date.diff(_d1, _date, 'ms')/rate),
                    text : date.getText(_d1, labelFormat)
                });
                _d1=_date;
            }
            // build
            // add to band UI
            node.addLast(profile.box.subBuild(profile, key, addLb).toDom());
            // add to memory list
            marks.insertAny(addLb,-1);
        },
        _getMoveNodes:function(profile){
            return profile.$moveban = profile.$moveban || profile.getSubNodes(['BAND','ITEMS']);
        },
        //if left is numb, force to move
        _rePosition:function(profile, left){
            profile.pause=true;
            var self=this,
                date = linb.date,
                t=profile.properties,
                rate=t._rate,
                label,m,n,
                labelsBottom = profile.getSubNode('SMALLLABEL'),
                band = self._getMoveNodes(profile),
                x = left || band.left(),
                //ralated to the fix position
                offset = x - t._band_left_fix;

            // if offset out a bar width
            if(Math.abs(offset)/t.unitPixs >=1 || left){
                var offsetCount = parseInt(offset/t.unitPixs),
                    bak_s = t._smallLabelStart,
                    bak_e = t._smallLabelEnd,
                    _c=-offsetCount*t.smallLabelCount,
                    offsetPxs,
                    _smallLabelStart,
                    _smallLabelEnd;

                _smallLabelStart=t._smallLabelStart = date.add(t._smallLabelStart, t.smallLabelUnit, _c);
                _smallLabelEnd=t._smallLabelEnd = date.add(t._smallLabelEnd, t.smallLabelUnit, _c);
                offsetPxs = Math.ceil(date.diff(_smallLabelStart, bak_s, 'ms')/rate);

                band.left(x - offsetPxs);

                // reset band paras
                t._band_width = Math.ceil(date.diff(_smallLabelStart, _smallLabelEnd, 'ms')/rate);

                //reset tasks position var
                t.items.each(function(o){
                    o._left += offsetPxs;
                    profile.box._trimTask(profile,o);
                });
                labelsBottom.children().each(function(o){
                    o.style.left = (parseFloat(o.style.left)||0) + offsetPxs + "px";
                });
                t._smallMarks.each(function(o){
                    o.left += offsetPxs;
                });

                // delete out, andd add to blank
                if(offsetCount>0){
                    self._minusRight(profile,t._smallMarks, labelsBottom,offsetCount);
                    self._addLeft(profile, 'small', labelsBottom, offsetCount);
                }else{
                    self._minusLeft(profile,t._smallMarks, labelsBottom, -offsetCount);
                    self._addRight(profile, bak_e, 'small', labelsBottom, -offsetCount);
                }

                if(t.multiTasks){
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
                            offsetCount>0 ? _smallLabelStart : bak_e,
                            offsetCount>0 ? bak_s : _smallLabelEnd,
                            t._rate,
                            offsetCount>0 ? 'left' : 'right');


                    //adjust the items
                    self._reArrage(profile);
                }

                if(t.showBigLabel){
                    var labelsTop = profile.getSubNode('BIGLABEL'),
                        bigLabelUnit=t.bigLabelUnit,
                        bigLabelCount=t.bigLabelCount,
                        off,
                        offsetCount2,offsetCount3,
                        bigLabelStart,bigLabelEnd;
                    bak_e=t._bigLabelEnd;

                    labelsTop.children().each(function(o){
                        o.style.left = (parseFloat(o.style.left)||0) + offsetPxs + "px";
                    });
                    t._bigMarks.each(function(o){
                        o.left += offsetPxs;
                    });
                    bigLabelStart=date.getRoundDown(_smallLabelStart, bigLabelUnit, bigLabelCount);

                    offsetCount2 = Math.ceil(date.diff(_smallLabelStart, t._bigLabelStart, bigLabelUnit)/bigLabelCount);
                    offsetCount3 = Math.ceil(date.diff(t._bigLabelEnd, _smallLabelEnd, bigLabelUnit)/bigLabelCount);

                    //reset offset of big and small
                    if(offsetCount2){
                        off = date.diff(_smallLabelStart, bigLabelStart, 'ms')/rate;
                        t._bigLabelStart=bigLabelStart;
                        if(offsetCount2>0)
                            self._addLeft(profile, 'big',labelsTop, offsetCount2, off);
                        else
                            self._minusLeft(profile,t._bigMarks, labelsTop, -offsetCount2);
                    }
                    //reset offset of big and small
                    if(offsetCount3){
                        off = date.diff(_smallLabelStart, bigLabelStart, 'ms')/rate;
                        t._bigLabelEnd=date.add(t._bigLabelEnd, bigLabelUnit, offsetCount3*bigLabelCount);
                        if(offsetCount3<0)
                            self._minusRight(profile,t._bigMarks, labelsTop, -offsetCount3);
                        else
                            self._addRight(profile, bak_e, 'big',labelsTop, offsetCount3, off);
                    }
                }
            }
            // reset date start point
            t._band_left = band.left();
            t.dateStart = self._getTime(profile, -t._band_left, 1);

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
                if(x+w<l)
                    w=0;
                else
                    w = w + x - l;
                x = l;
            }
            if(x>bw+12)x=bw+12;
            this._setItemNode(profile, o,'left',x+'px');
            // if too long, cut right
            if(x + w > bw - l)
                w = bw - l - x;
            if(w>=0)
                this._setItemNode(profile, o,'width',w+'px');
        },
        _setItemNode:function(profile, item, key, value){
            var t=item._node || (item._node = profile.getSubNodeByItemId('ITEM',item.id).get(0));
            t.style[key]=value;
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
                    if(t.multiTasks)
                        self._setItemNode(profile, v,'top',(t.taskHeight+3) * index+'px');
                };
            });

            h = t._linesHeight =  (t._lines.length+1) * 18;

            self._ajustHeight(profile);
        },
        _resetItem:function(profile,o,src){
            var p=profile.properties,
                t=profile.getItemByDom(src),
                bandW=p._band_width + 12,
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
                if(p.multiTasks){
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
                }
                src.style.width=o.width+'px';
                if(linb.browser.ie && !p.multiTasks)
                    linb([src.parentNode]).ieTrigger();
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
        showTips:function(profile, id, pos){
            var t=profile.properties,
                format=t.timeFormat,
                sid=profile.getSubSerialId(id),
                map=profile.SubSerialIdMapItem,
                item=map&&map[sid],
                date=linb.date;

            if(t.disabled)return;
            if(item && item.disabled)return;
            if(item){
                item.tips = '<p style="font-weight:bold">'+item.caption +'</p>'+ date.getText(new Date(item.start),format)+":"+date.getText(new Date(item.end),format);
                linb.UI.Tips.show(pos, item);
                return true;
            }else
                return false;
        },
        resize:function(profile,w,h){
            var p=profile.properties,
                f=function(k){return profile.getSubNode(k)},
                off1=2*p.$borderW,
                off2=3,
                t;
            //for border, view and items
            if(h && h!=p.height && parseInt(profile.domNode.style.height)){
                f('BORDER').height(t=h-off1);
                f('VIEW').height(t=t - (p.showTips&&p.tipsHeight) -off2 - (p.showBigLabel?p.bigLabelHeight:0) - p.smallLabelHeight - (p.showBar&&p.barHeight));
                this._ajustHeight(profile);

                if(p.height!=h)p.height=h;
            }
            if(w && w!=p.width){
                f('BORDER').width(w-off1);
                if(p.width!=w)p.width=w;
            }
        }
    }
});