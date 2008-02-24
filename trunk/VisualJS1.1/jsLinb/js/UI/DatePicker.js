Class('linb.UI.DatePicker', 'linb.UI.iWidget', {
    Instance:{
        setCtrlValue:function(value){
            return this.each(function(profile){
                if(!profile.domNode)return;
                var cls = profile.box,
                    p = profile.properties,
                    date=linb.date,
                    mfirst=date.getRoundDown(value,'m');
                cls._to(profile,mfirst,value);
                if(profile.keys.CAPTION)
                    profile.getSubNode('CAPTION').html(date.getText(value,'ymd',p.firstDayOfWeek),false);
            });
        }
    },
    Initialize:function(){
        var self=this,
            e=linb.event.eventhandler,
            id=linb.UI.$ID,
            cls=linb.UI.$CLS,
            cls2=linb.UI.$CLS+'-td-free',
            key=self.KEY;

        self.mapKeys(['H', 'W','TD']);
        var colgroup = '<colgroup><col width="2%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/></colgroup>',
            thead1='<thead><tr height="1%"><th id="'+key+'-H:'+id+':7" class="'+cls+'-h #H_CC#"></th>',
            thead2='</tr></thead>',
            th='<th id="'+key+'-H:'+id+':@" class="'+cls+'-h #H_CC#">@</th>',
            tbody1 = '<tbody>',
            tbody2 = '</tbody>',
            tr1='<tr>',
            tr2='</tr>',
            td1='<th id="'+key+'-W:'+id+':@"  class="'+cls+'-w #W_CC#">@</th>',
            td2='<td id="'+key+'-TD:'+id+':@" class="'+cls+'-td ! #TD_CC#"  unselectable="on" onmouseover="'+e+'" onmouseout="'+e+'" onclick="'+e+'" >'+
                '</td>',
            body,i,j,k,l,a=[],b=[];
        for(i=0;i<7;i++)
            b[b.length]= th.replace(/@/g,i);

        k=l=0;
        for(i=0;i<48;i++){
            j=i%8;
            a[a.length]= (j==0?tr1:'') + (j==0?td1:td2).replace(/@/g,j==0?l:k).replace('!',(j==1||j==7)?cls2:'') + (j==7?tr2:'');
            if(j!==0)k++;
            else l++;
        }

        body=colgroup+thead1+b.join('')+thead2+tbody1+a.join('')+tbody2;

        self.setTemplate('default',{
            tagName : 'div',
            style:'{_style}',
            onselectstart:'return false',
            BORDER:{
                tagName : 'div',
                BAR:{
                    $order:0,
                    style:'height:{handleHeight}px;',
                    tagName:'div',
                    CMDS:{
                        tagName:'div',
                        PRE2:{$order:0},
                        PRE:{$order:1},
                        YEAR:{$order:2,unselectable:'on'},
                        YTXT:{$order:3,style:'display:inline'},
                        MONTH:{$order:4,unselectable:'on'},
                        MTXT:{$order:5,style:'display:inline'},
                        NEXT:{$order:6},
                        NEXT2:{$order:7}
                    },
                    CMDS2:{
                        CLOSE:{
                            style:'{closeDisplay}'
                        }
                    }
                },
                BODY:{
                    $order:1,
                    tagName:'table',
                    cellpadding:"0",
                    cellspacing:"0",
                    width:'100%',
                    text:body
                },
                TIPS:{
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
        Appearances:{'default':{
            KEY:{
                overflow:'visible',
                background:'#FFF',
                '-moz-user-select': linb.browser.gek?'none':null
            },
            BORDER:{
                overflow: 'visible',
                position: 'relative',
                'border-top': 'solid 1px #C1C1C1',
                'border-left': 'solid 1px #C1C1C1'
            },
            'BAR,BODY,TIPS':{
                position:'relative'
            },
            BAR:{
                'white-space':'nowrap',
                background: linb.UI.getCSSImgPara('barvbg.gif', ' repeat-x left top', null, 'linb.UI.Public'),
                'border-right': 'solid 1px #C1C1C1'
            },
            TIPS:{
                'white-space':'nowrap',
                'text-align':'center',
                border: 'solid #C1C1C1',
                'border-width': '0 1px 1px 0'
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
            'PRE,PRE2,NEXT,NEXT2,CLOSE':{
                $order:0,
                position:'relative',
                margin:'2px',
                width:'15px',
                height:'15px',
                'vertical-align': 'middle',
                cursor:'default'
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
            PRE2:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat  -61px -65px', null, 'linb.UI.Public')
            },
            'PRE2-mouseover':{
                $order:2,
                'background-position': '-61px -80px'
            },
            'PRE2-mousedown':{
                $order:3,
                'background-position': '-61px -95px'
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
            NEXT2:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat  -76px -65px', null, 'linb.UI.Public')
            },
            'NEXT2-mouseover':{
                $order:2,
                'background-position': '-76px -80px'
            },
            'NEXT2-mousedown':{
                $order:3,
                'background-position': '-76px -95px'
            },
            'YEAR,MONTH':{
                $order:4,
                margin:'2px',
                height:'15px',
                'font-weight':'bold',
                border:'1px solid #7F9DB9',
                'background-color':'#FFFACD',
                'padding-left':'2px',
                cursor:'e-resize'
            },
            YEAR:{
                width:'32px'
            },
            MONTH:{
                width:'16px'
            },
            CAPTION:{
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
                $order:1,
                border:0,
                'border-right':'solid 1px #C1C1C1',
                'border-bottom':'solid 1px #C1C1C1'
            },
            'TD .exday':{
                color:'#C1C1C1'
            },
            TD:{
                'text-align':'center',
                'background-color': '#FFFACD'
            },
            'TD-free':{
                $order:1,
                'text-align':'center',
                'background-color': '#FFF'
            },
            'TD-mouseover':{
                $order:3,
                'background-color': '#d9e8fb'
            },
            'TD-checked':{
                $order:4,
                'background-color':'#316AC5',
                'font-weight':'bold',
                color:'#fff'
            },
            'W,H':{
                $order:3,
                'color':'#333333',
                'background-color':'#E8EEF7',
                'vertical-align':'middle',
                'text-align':'center'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{CLOSE:'CLOSE',TD:'TD',PRE:'PRE',PRE2:'PRE2',NEXT:'NEXT',NEXT2:'NEXT2'},
            _clickEffect:{CLOSE:'CLOSE',TD:'TD',PRE:'PRE',PRE2:'PRE2',NEXT:'NEXT',NEXT2:'NEXT2'},
            TD:{
                onClick:function(profile, e, src){
                    var p=profile.properties,
                        id=profile.getSubSerialId(src.id),
                        map=profile.$daymap,
                        v=map[id];
                    if(p.disabled)return false;

                    linb([src]).onMouseout(true,{$force:true});
                    //onClick event
                    profile.boxing().updateUIValue(v);
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
            },
            PRE:{
                onClick:function(profile, e, src){
                    var p = profile.properties;
                    if(p.disabled)return;
                    profile.box._to(profile, linb.date.add(profile.$mfirst,'m',-1,p.firstDayOfWeek));
                }
            },
            NEXT:{
                onClick:function(profile, e, src){
                    var p = profile.properties;
                    if(p.disabled)return;
                    profile.box._to(profile, linb.date.add(profile.$mfirst,'m',1,p.firstDayOfWeek));
                }
            },
            PRE2:{
                onClick:function(profile, e, src){
                    var p = profile.properties;
                    if(p.disabled)return;
                    profile.box._to(profile, linb.date.add(profile.$mfirst,'y',-1,p.firstDayOfWeek));
                }
            },
            NEXT2:{
                onClick:function(profile, e, src){
                    var p = profile.properties;
                    if(p.disabled)return;
                    profile.box._to(profile, linb.date.add(profile.$mfirst,'y',1,p.firstDayOfWeek));
                }
            },
            YEAR:{
                onMousedown:function(profile, e, src){
                    linb(src).startDrag(e, {
                        type:'blank',
                        move:false,
                        grid_width:20,
                        cursor:true
                    });
                    profile.$temp=profile.$temp2=0;
                },
                onDrag:function(profile, e, src){
                    var count,off = linb.dragDrop.getOffset();
                    count=parseInt(profile.$year)+(profile.$temp2=parseInt(off.x/20));
                    if(profile.$temp!=count){
                        profile.$temp=count;
                        profile.getSubNode('YEAR').html(count,false);
                    }
                },
                onDragstop:function(profile, e, src){
                    if(profile.$temp2){
                        var p=profile.properties,
                            v = linb.date.add(profile.$mfirst,'y',profile.$temp2,p.firstDayOfWeek);
                        profile.box._to(profile,linb.date.getRoundDown(v,'m'));
                    }
                    profile.$temp=profile.$temp2=0;
                }
            },
            MONTH:{
                onMousedown:function(profile, e, src){
                    linb(src).startDrag(e, {
                        type:'blank',
                        move:false,
                        grid_width:20,
                        cursor:true
                    });
                    profile.$temp=profile.$temp2=0;
                },
                onDrag:function(profile, e, src){
                    var count,off = linb.dragDrop.getOffset();
                    count=parseInt(profile.$month)+(parseInt(off.x/20)%12);
                    count=(count%12+12)%12;
                    if(profile.$temp!=count){
                        profile.$temp=count;
                        profile.$temp2=count-profile.$month+1;
                        profile.getSubNode('MONTH').html(count+1,false);
                    }
                },
                onDragstop:function(profile, e, src){
                    if(profile.$temp2){
                        var p=profile.properties,
                            v = linb.date.add(profile.$mfirst,'m',profile.$temp2,p.firstDayOfWeek);
                        profile.box._to(profile,linb.date.getRoundDown(v,'m'));
                    }
                    profile.$temp=profile.$temp2=0;
                }
            }
        }},
        DataModel:{
            height:152,
            width:200,
            value:new Date,
            handleHeight : 22,
            tipsHeight : 16,
            headHeight:20,
            closeBtn:{
                ini:true,
                action:function(v){
                    this.getSubNode('CLOSE').display(v?'':'none');
                }
            },
            firstDayOfWeek:0,
            $borderW:1
        },
        EventHandlers:{
            beforeClose:function(profile, src){},
            onSelect:function(profile, src){}
        },
        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);
            var data=profile.data, nodisplay='display:none';
            data.closeDisplay = data.closeBtn?'':nodisplay;
        },
        createdTrigger:function(){
            var self=this, p=self.properties, o=self.boxing(), b=self.box;
            p.$UIvalue = p.value;
            b._setWeekLabel(self);
            self.getSubNode('YTXT').html(linb.wrapRes('date.Y'),false);
            self.getSubNode('MTXT').html(linb.wrapRes('date.M'),false);
        },
        _getWeekNodes:function(profile){
            return profile.$week || (profile.$week=profile.getSubNode('W',true));
        },
        _getTDNodes:function(profile){
            return profile.$tds || (profile.$tds=profile.getSubNode('TD',true));
        },
        _getDayNodes:function(profile){
            return profile.$day || (profile.$day=profile.getSubNode('TD',true));
        },
        _getHeaderNodes:function(profile){
            return profile.$header || (profile.$header=profile.getSubNode('H',true));
        },
        _setWeekLabel:function(profile){
            var o=linb.date,f=profile.getSubSerialId;
            profile.box._getHeaderNodes(profile).each(function(node,i){
                node.innerHTML=linb.wrapRes('date.WEEKS.'+f(node.id))
            });
        },
        _setBGV:function(profile, v, m){
            var date=linb.date,
                p=profile.properties,
                daymap=profile.$daymap||(profile.$daymap=[]),
                t,n,
                fd=p.firstDayOfWeek;
            profile.box._getDayNodes(profile).each(function(node,i){
                n=date.add(v,'d',i,fd);
                daymap[i]=n;
                t=date.get(n,'m',fd)==m?'#':'<p class="exday">#</p>';
                n=date.get(n,'d',fd);
                node.innerHTML = t.replace('#',n);
            });
            profile.box._getWeekNodes(profile).each(function(node,i){
                node.innerHTML=date.get(date.add(v,'ww',i,fd),'ww',fd);
            });
        },
        _to:function(profile, mfirst, value){
            var p = profile.properties,
                fd=p.firstDayOfWeek,
                date=linb.date,
                keys=profile.keys,
                uiv=value||p.$UIvalue,
                md=date.get(uiv,'m',fd)+'-'+date.get(uiv,'d',fd),
                ym1=date.get(uiv,'y',fd)+'-'+date.get(uiv,'m',fd),
                ym2=date.get(mfirst,'y',fd)+'-'+date.get(mfirst,'m',fd),
                index=-1,
                node,
                temp,
                _realstart = date.getRoundDown(date.getRoundDown(mfirst,'m'),'ww',1,fd),
                m=date.get(mfirst,'m',fd);

            profile.$mfirst=mfirst;
            this._setBGV(profile, _realstart, m);


            //remove checked css class
            if(profile.$selnode)
                profile.removeTagClass('TD', '-checked',profile.$selnode);
            if(ym1==ym2){
                profile.$daymap.each(function(o,i){
                    if(date.get(o,'m',fd)+'-'+date.get(o,'d',fd)==md){
                        index=i;
                        return false;
                    }
                });
                node=this._getTDNodes(profile).get()[index];
                profile.addTagClass('TD', '-checked', profile.$selnode=linb([node]));
            }

            if(keys.YEAR){
                temp=date.get(mfirst,'y',fd);
                if(profile.$year!=temp){
                    profile.$year=temp;
                    profile.getSubNode('YEAR').html(temp,false);
                }
            }
            if(keys.MONTH){
                temp=date.get(mfirst,'m',fd)+1;
                if(profile.$month!=temp){
                    profile.$month=temp;
                    profile.getSubNode('MONTH').html(temp,false);
                }
            }
        }
    }
});