Class('linb.UI.Calendar', 'linb.UI.DatePicker', {
    Instance:{
        setDayInfo:function(key,index,value){
            var node=this.getSubNode(key, ""+index);
            if(node.get(0)){
                node.get(0).innerHTML=value;
            }
        },
        addContents : function(index,node){
            this.getSubNode('DC',""+index).append(node);
        },
        clearContents : function(index){
            this.getSubNode('DC',""+index).empty();
        }
    },
    Initialize:function(){
        var self=this,
            id=linb.UI.$ID,
            cls=linb.UI.$CLS,
            cls2=cls+'-td-free',
            key=self.KEY;

        self.addTemplateKeys(['H', 'W','DH','DAY','DC','TBODY', 'TD','DF1','DF2','DF3']);
        var colgroup = '<colgroup><col width="2%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/></colgroup>',
            thead1='<thead><tr height="1%"><th id="'+key+'-H:'+id+':7" class="'+cls+'-h #H_CC#"></th>',
            thead2='</tr></thead>',
            th='<th id="'+key+'-H:'+id+':@" class="'+cls+'-h #H_CC#">@</th>',
            tbody1 = '<tbody id="'+key+'-TBODY:'+id +':" >',
            tbody2 = '</tbody>',
            tr1='<tr>',
            tr2='</tr>',
            td1='<th id="'+key+'-W:'+id+':@"  class="'+cls+'-w #W_CC#" style="#W_CS#">@</th>',
            td2='<td id="'+key+'-TD:'+id+':@" class="'+cls+'-td ! #TD_CC#"  style="#TD_CS#" unselectable="on"  >'+
                '<div id="'+key+'-DAY:'+id+':@" class="'+cls+'-day #DAY_CC#"  style="#DAY_CS#" unselectable="on" >'+
                    '<div id="'+key+'-DH:'+id+':@" class="'+cls+'-dh #DH_CC#"  style="#DH_CS#"></div>'+
                    '<div id="'+key+'-DF1:'+id+':@" class="'+cls+'-df1 #DF1_CC#" style="#DF1_CS#"></div>'+
                    '<div id="'+key+'-DF2:'+id+':@" class="'+cls+'-df2 #DF2_CC#" style="#DF2_CS#"></div>'+
                    '<div id="'+key+'-DF3:'+id+':@" class="'+cls+'-df3 #DF3_CC#" style="#DF3_CS#"></div>'+
                    '<div id="'+key+'-DF4:'+id+':@" class="'+cls+'-df4 #DF4_CC#"  style="#DF4_CS#"></div>'+
                    '<div id="'+key+'-DC:'+id+':@" class="'+cls+'-dc #DC_CC#"  style="#DC_CS#"></div>'+
                '</div>'+
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

        self.setTemplate({
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
        delete self.$Keys.YEAR;
        delete self.$Keys.MONTH;
    },
    Static:{
        Behaviors:{        
            DropableKeys:['DAY'],
            HoverEffected:{},
            ClickEffected:{},
            onSize:linb.UI.$onSize,
            TD:{onClick:null,
                onDblclick:function(profile, e, src){
                    var p=profile.properties,
                        index=profile.getSubId(src);
                    if(p.disabled)return false;
                    profile.boxing().onDblclick(profile, index, src);
                }
            }
        },
        DataModel:{
            handleHeight : null,
            tipsHeight :null,
            closeBtn:null,
            dataBinder:null,
            dateField:null,

            dock:'fill',
            width:200,
            height:200
        },
        EventHandlers:{
            onDblclick:function(profile, item, src){}
        },
        _getLabelNodes:function(profile){
            return profile.$day1 || (profile.$day1=profile.getSubNode('DF1',true));
        },
        _getDayNodes:function(profile){
            return profile.$day2 || (profile.$day2=profile.getSubNode('DAY',true));
        },
        Appearances:{
            'DAY, DC':{
                position:'relative'
            },
            'DF1, DF2, DF3, DF4':{
                position:'absolute',
                'white-space':'nowrap'
            },
            DF1:{
                left:'2px',
                top:'2px'
            },
            DF2:{
                right:'2px',
                top:'2px'
            },
            DF3:{
                left:'2px',
                bottom:'2px'
            },
            DF4:{
                right:'2px',
                bottom:'2px'
            },
            DAY:{
                overflow:'hidden'
            },
            DC:{
                'text-align':'left'
            },
            TD:{
                "background-color":"#F9F7D1"
            },
            'TD-checked':{
                $order:1,
                "background-color":"#F9F7D1"
            },
            'TD-free':{
                $order:1,
                "background-color":"#FFF"
            }
        },
        _onresize:function(profile,width,height){
            var p=profile.properties,
                f=function(k){return profile.getSubNode(k)},
                t;
            //for border, view and items
            if(height){
                f('BORDER').height(t=height);
                f('BODY').height(t);
                t=(t-16)/6-1;
                profile.box._getDayNodes(profile).height(t);
            }
        }
    }
});