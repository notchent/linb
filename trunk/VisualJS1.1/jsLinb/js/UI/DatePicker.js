Class('linb.UI.DatePicker', 'linb.UI.iWidget', {
    Instance:{
        setCtrlValue:function(value){
            return this.each(function(profile){
                if(!profile.domNode)return;

                var instance = profile.boxing(),
                    cls = profile.box,
                    p = profile.properties,
                    uiv = p.$UIvalue,
                    date=linb.date,
                    keys=profile.keys,
                    realstart=profile.$realstart,
                    md=date.get(value,'m')+'-'+date.get(value,'d'),
                    index=-1,
                    node,temp
                    ;
                var _realstart = date.getRoundDown(date.getRoundDown(value,'m'),'ww'),
                m=date.get(value,'m');

                //set bg values
                if(_realstart.getTime()!=(realstart&&realstart.getTime())){
                    cls._setBGV(profile, _realstart, m);
                    profile.$realstart=_realstart;
                }
                //remove checked css class
                if(profile.$selnode)
                    profile.removeTagClass('TD', '-checked',profile.$selnode);

                profile.$daymap.each(function(o,i){
                    if(date.get(o,'m')+'-'+date.get(o,'d')==md){
                        index=i;
                        return false;
                    }
                });
                if(index!=-1){
                //add checked css class
                    node=cls._getTDNodes(profile).get()[index];
                    profile.addTagClass('TD', '-checked', profile.$selnode=linb([node]));

                    if(keys.CAPTION)
                        profile.getSubNode('CAPTION').html(date.getText(value,'ymd'),false);
                    if(keys.YEAR){
                        temp=date.get(value,'y');
                        if(profile.$year!=temp){
                            profile.$year=temp;
                            profile.getSubNode('YEAR').html(temp,false);
                        }
                    }
                    if(keys.MONTH){
                        temp=date.get(value,'m')+1;
                        if(profile.$month!=temp){
                            profile.$month=temp;
                            profile.getSubNode('MONTH').html(temp,false);
                        }
                    }
                }
            });
        }
    },
    Initialize:function(){
        var self=this,
            e=linb.event.eventhandler,
            id=linb.UI.$ID,
            cls=linb.UI.$CLS,
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
            td2='<td id="'+key+'-TD:'+id+':@" class="'+cls+'-td #TD_CC#"  unselectable="on" onmouseover="'+e+'" onmouseout="'+e+'" onclick="'+e+'" >'+
                '</td>',
            body,i,j,k,l,a=[],b=[];
        for(i=0;i<7;i++)
            b[b.length]= th.replace(/@/g,i);

        k=l=0;
        for(i=0;i<48;i++){
            j=i%8;
            a[a.length]= (j==0?tr1:'') + (j==0?td1:td2).replace(/@/g,j==0?l:k) + (j===7?tr2:'');
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
                    style:'height:{barHeight}px;',
                    tagName:'div',
                    CMDS:{
                        tagName:'div',
                        PRE2:{$order:0},
                        PRE:{$order:1},
                        YEAR:{$order:2,unselectable:'on'},
                        MONTH:{$order:3,unselectable:'on'},
                        NEXT:{$order:4},
                        NEXT2:{$order:5}
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
                TAIL:{
                    $order:2,
                    style:'height:{capHeight}px;',
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
            'BAR,BODY,TAIL':{
                position:'relative'
            },
            BAR:{
                'white-space':'nowrap',
                background: linb.UI.getCSSImgPara('barvbg.gif', ' repeat-x left top', null, 'linb.UI.Public'),
                'border-right': 'solid 1px #C1C1C1'
            },
            TAIL:{
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
                margin:'2px 4px 2px 0',
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
                margin:'2px 4px 2px 0',
                height:'15px',
                border:'1px solid #7F9DB9',
                background:'#FFF',
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
                'text-align':'right',
                'background-color': '#FFFACD',
                'padding':'0 1px 0 1px'
            },
            'TD-mouseover':{
                $order:3,
                'background-color': '#d9e8fb'
            },
            'TD-checked':{
                $order:3,
                'background-color': '#D6DEEC'
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
            _hoverEffect:{CLOSE:'CLOSE',TD:'TD',PRE:'PRE',PRE2:'PRE2',NEXT:'NEXT',NEXT2:'NEXT2'},
            _clickEffect:{CLOSE:'CLOSE',TD:'TD',PRE:'PRE',PRE2:'PRE2',NEXT:'NEXT',NEXT2:'NEXT2'},
            TD:{
                onClick:function(profile, e, src){
                    var p=profile.properties,
                        id=profile.getSubSerialId(src.id),
                        map=profile.$daymap,
                        v=map[id];
                    if(p.disabled)return false;
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
                    var properties = profile.properties;
                    if(properties.disabled)return;
                    var instance = profile.boxing();
                    instance.updateUIValue(linb.date.add(properties.$UIvalue,'m',-1))
                }
            },
            NEXT:{
                onClick:function(profile, e, src){
                    var properties = profile.properties;
                    if(properties.disabled)return;
                    var instance = profile.boxing();
                    instance.updateUIValue(linb.date.add(properties.$UIvalue,'m',1))
                }
            },
            PRE2:{
                onClick:function(profile, e, src){
                    var properties = profile.properties;
                    if(properties.disabled)return;
                    var instance = profile.boxing();
                    instance.updateUIValue(linb.date.add(properties.$UIvalue,'y',-1))
                }
            },
            NEXT2:{
                onClick:function(profile, e, src){
                    var properties = profile.properties;
                    if(properties.disabled)return;
                    var instance = profile.boxing();
                    instance.updateUIValue(linb.date.add(properties.$UIvalue,'y',1))
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
                onDragend:function(profile, e, src){
                    if(profile.$temp2){
                        var v = linb.date.add(profile.properties.$UIvalue,'y',profile.$temp2);
                        profile.boxing().updateUIValue(v);
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
                onDragend:function(profile, e, src){
                    if(profile.$temp2){
                        var v = linb.date.add(profile.properties.$UIvalue,'m',profile.$temp2);
                        profile.boxing().updateUIValue(v);
                    }
                    profile.$temp=profile.$temp2=0;
                }
            }
        }},
        DataModel:{
            height:152,
            width:180,
            value:new Date,
            barHeight : 22,
            capHeight : 16,
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
            var self=this, p=self.properties, o=self.boxing(), b=self.box;
            p.$UIvalue = p.value;
            b._setWeekLabel(self);
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
            var o=linb.date.getText.map.cn.WEEKS,f=profile.getSubSerialId;
            profile.box._getHeaderNodes(profile).each(function(node,i){
                node.innerHTML=o[f(node.id)]
            });
        },
        _setBGV:function(profile, v, m){
            var date=linb.date,
                daymap=profile.$daymap||(profile.$daymap=[]),
                t,n;
            profile.box._getDayNodes(profile).each(function(node,i){
                n=date.add(v,'d',i);
                daymap[i]=n;
                t=date.get(n,'m')==m?'#':'<p class="exday">#</p>';
                n=date.get(n,'d');
                node.innerHTML = t.replace('#',n);
            });
            v=date.add(v,'d',6);
            profile.box._getWeekNodes(profile).each(function(node,i){
                node.innerHTML=date.get(date.add(v,'ww',i),'ww');
            });
        }
    }
});