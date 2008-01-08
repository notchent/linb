/*
*in developing
*/
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
                    realstart=profile.$realstart,
                    ymd=date.get(value,'ymd'),
                    index=-1,
                    node
                    ;
                var _realstart = date.getRoundDown(date.getRoundDown(value,'m'),'ww'),
                m=date.get(value,'m');

                //set bg values
                if(_realstart!=realstart)
                    cls._setBGV(profile, _realstart, m);
                //remove checked css class
                if(profile.$selnode)
                    profile.removeTagClass('TD', '-checked',profile.$selnode);

                profile.$daymap.each(function(o,i){
                    if(date.get(o,'ymd')==ymd){
                        index=i;
                        return false;
                    }
                });
                if(index!=-1){
                //add checked css class
                    node=cls._getDayNodes(profile).get()[index];
                    profile.addTagClass('TD', '-checked', profile.$selnode=linb([node.parentNode]));

                    profile.getSubNode('CAPTION').html(date.getText(value,'ymd'),false);
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

        self.mapKeys(['H', 'W','D','TD']);

        var colgroup = '<colgroup><col width="2%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/></colgroup>',
            thead1='<thead><tr height="1%"><th class="'+cls+'-h #H_CC#">wk</th>',
            thead2='</tr></thead>',
            th='<th id="'+key+'-H:'+id+':@" class="'+cls+'-h #H_CC#">@</th>',
            tbody1 = '<tbody>',
            tbody2 = '</tbody>',
            tr1='<tr>',
            tr2='</tr>',
            td1='<th id="'+key+'-W:'+id+':@"  class="'+cls+'-w #W_CC#">@</th>',
            td2='<td id="'+key+'-TD:'+id+':@" class="'+cls+'-td #TD_CC#" onmouseover="'+e+'" onmouseout="'+e+'" onclick="'+e+'" >'+
                '<div id="'+key+'-D:'+id+':@" class="'+cls+'-d #D_CC#">a</div>'+
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
                $order:1,
                border:0,
                'border-right':'solid 1px #C1C1C1',
                'border-bottom':'solid 1px #C1C1C1'
            },
            D:{
                $order:2,
                position:'relative',
                'text-align':'right',
                'padding':'0 1px 0 1px'
            },
            'D .exday':{
                color:'#C1C1C1'
            },
            TD:{
                'background-color': '#FFFACD'
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
            _hoverEffect:{CLOSE:'CLOSE',TD:'TD'},
            _clickEffect:{CLOSE:'CLOSE',TD:'TD'},
            onRewh:function(profile, e, src){
                if(!profile.properties.calendar)return;

                var o = profile.domNode.style,f=parseInt, n=null, w=n, h=n;
                if(e.height)h=f(o.height)||n;
                if(e.width)w=f(o.width)||n;
                if(h || w)profile.box.resize(profile, w, h);
            },
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
            }
        }},
        DataModel:{
            height:140,
            width:150,
            value:new Date,
            barHeight : 22,
            headHeight:20,
            closeBtn:{
                ini:true,
                action:function(v){
                    this.getSubNode('CLOSE').display(v?'':'none');
                }
            },
            //calendar:resize
            calendar:false,
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

            self.box._setWeekLabel(self);
        },
        _getWeekNodes:function(profile){
            return profile.$week || (profile.$week=profile.getSubNode('W',true));
        },
        _getDayNodes:function(profile){
            return profile.$day || (profile.$day=profile.getSubNode('D',true));
        },
        _getHeaderNodes:function(profile){
            return profile.$header || (profile.$header=profile.getSubNode('H',true));
        },
        _setWeekLabel:function(profile){
            var o=linb.date.getText.map.WEEKS;
            profile.box._getHeaderNodes(profile).each(function(node,i){
                node.innerHTML=o[i]
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
                profile.box._getDayNodes(profile).height(t/6);
            }
        }
    }
});