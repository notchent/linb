Class('linb.UI.Calendar', 'linb.UI.DatePicker', {
    Instance:{
    },
    Initialize:function(){
        var self=this,
            e=linb.event.eventhandler,
            e2=linb.event.eventhandler2,
            id=linb.UI.$ID,
            cls=linb.UI.$CLS,
            key=self.KEY;

        self.mapKeys(['H', 'W','D','TD']);
        var colgroup = '<colgroup><col width="2%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/></colgroup>',
            thead1='<thead><tr height="1%"><th id="'+key+'-H:'+id+':7" class="'+cls+'-h #H_CC#"></th>',
            thead2='</tr></thead>',
            th='<th id="'+key+'-H:'+id+':@" class="'+cls+'-h #H_CC#">@</th>',
            tbody1 = '<tbody>',
            tbody2 = '</tbody>',
            tr1='<tr>',
            tr2='</tr>',
            td1='<th id="'+key+'-W:'+id+':@"  class="'+cls+'-w #W_CC#">@</th>',
            td2='<td id="'+key+'-TD:'+id+':@" class="'+cls+'-td #TD_CC#"  unselectable="on" onclick="'+e+'" >'+
                '<div id="'+key+'-D:'+id+':@" class="'+cls+'-d #D_CC#" unselectable="on" onmouseover="'+e2+'" onmouseout="'+e2+'" ondrop="'+e2+'" ></div>'+
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
                BODY:{
                    $order:1,
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
        Dropable:['D'],
        Behaviors:{'default':{
            _hoverEffect:{},
            _clickEffect:{},
            onRewh:function(profile, e, src){
                var o = profile.domNode.style,f=parseInt, n=null, w=n, h=n;
                if(e.height)h=f(o.height)||n;
                if(e.width)w=f(o.width)||n;
                if(h || w)profile.box.resize(profile, w, h);
            }
        }},
        DataModel:{
            handleHeight : null,
            tipsHeight :null,
            closeBtn:null,
            dock:'fill',
            dropKeys:'iEvent',
            $borderW:1
        },
        _getDayNodes:function(profile){
            return profile.$day || (profile.$day=profile.getSubNode('D',true));
        },
        Appearances:{'default':{
            D:{
                position:'relative'
            }
        }},
        EventHandlers:{
        },
        prepareData:function(profile){
            linb.UI.iWidget.prepareData.call(this, profile);
        },
        resize:function(profile,w,h){
            var p=profile.properties,
                f=function(k){return profile.getSubNode(k)},
                off=2*p.$borderW,
                t;
            //for border, view and items
            if(h && h!=p.height){
                f('BORDER').height(t=h-off);
                f('BODY').height(t);
                t=t - p.headHeight-6;
                profile.box._getDayNodes(profile).height(t/6);
            }
        }
    }
});