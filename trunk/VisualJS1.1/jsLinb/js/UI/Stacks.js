Class("linb.UI.Stacks", "linb.UI.Tabs",{
    Static:{
        Appearances:{'default':{
            LIST:{
                position:'static'
            },
            ITEMS:{
                position:'static'
            },
            ITEM:{
                $order:0,
                display:'block',
                position:'absolute',
                cursor:'pointer',

                background: linb.UI.getCSSImgPara('barvbg.gif', ' repeat-x left top', null, 'linb.UI.Public'),
                height:'22px',
                width:'100%',
                left:0
            },
            BOX:{
                display:'block'
            },
            'ITEM-mouseover':{
                $order:1,
                'background-position' : 'right -22px'
            },
            'ITEM-mousedown':{
                $order:1,
                'background-position' : 'right -44px'
            },
            'ITEM-checked':{
                $order:1,
                'background-position' : 'right -44px'
            },
            HANDLE:{
                cursor:'pointer',
                display:'block',
                'font-size':'12px',
                height:'100%',
                'padding-left':'6px'
            },
            ICON:{
                cursor:'pointer',
                width:'16px',
                height:'16px',
                margin: '3px 4px 0 0'
            },
            CAPTION:{
                margin: '2px'
            },
            PANEL:{
                position:'absolute',
                visibility:'hidden',
                top:'-10000px',
                left:'-10000px',
                overflow:'auto',
                'background-color':'#fff'
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
            'CMDS  span':{
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
            LAND:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -220px 0', null, 'linb.UI.Public')
            },
            'LAND-mouseover':{
                $order:1,
                'background-position' : '-220px -16px'
            },
            'LAND-mousedown':{
                $order:2,
                'background-position' : '-220px -32px'
            }
        }},
        resize:function(profile,key,w,h){
            var t=profile.properties, temp,t1,t2,obj,top,
                wc=null,hc=null,
                o = profile.boxing().getPanel(key);
            if(!o || o.isEmpty())return;

            // change value
            if(h){
                t2=t1=0;
                t.items.each(function(o){
                    obj = profile.getSubNodeByItemId('ITEM', o.id);
                    obj.bottom('auto').top(t1);

                    // offsetHeight maybe not set here
                    t1 += obj.height();
                    if(o.id == key)return false;
                });
                t.items.each(function(o){
                    if(o.id == key)return false;
                    obj = profile.getSubNodeByItemId('ITEM', o.id);
                    obj.top('auto').bottom(t2);
                    t2+= obj.height();
                },null,true);

                temp = h - t1 - t2;
                if(temp>0){
                    top=t1;
                    hc=temp;
                }
            }
            if(w)wc=w;

            o.setRegion({width:wc?wc:null,height:hc?hc:null,top:top,left:0},true);
            if(wc)profile.getSubNode('LIST').width(wc);
        }
    }
});
