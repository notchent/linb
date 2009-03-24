Class("linb.UI.Stacks", "linb.UI.Tabs",{
    Static:{
        Appearances:{
            KEY:{
                overflow:'visible',
                border:'solid 1px #648CB4',
                'border-top':'none'
            },
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
                background: linb.UI.$bg('bar_vertical.gif', ' repeat-x left -30px', true),
                width:'100%',
                left:0
            },
            ITEMI:{
                display:'block'
            },
            'ITEM-mouseover':{
                $order:1,
                'background-position' : 'right -120px'
            },
            'ITEM-mousedown':{
                $order:1,
                'background-position' : 'right -120px'
            },
            'ITEM-checked':{
                $order:1,
                'background-position' : 'right -120px'
            },
            HANDLE:{
                cursor:'pointer',
                display:'block',
                'font-size':'12px',
                height:'100%',
                height:'18px',
                'padding':'5px 0 5px 8px',
                'white-space':'nowrap'
            },
            PANEL:{
                position:'absolute',
                visibility:'hidden',
                top:'-10000px',
                left:'-10000px',
                overflow:'auto'
            },
            CMDS:{
                position:'absolute',
                top:'6px',
                right:'2px',
                'text-align':'right',
                'vertical-align': 'middle'
            }
        },
        _onresize:function(profile,width,height,key){
            var t=profile.properties, temp,t1,t2,obj,top,
                wc=null,hc=null,
                o = profile.boxing().getPanel(key);
            if(!o || o.isEmpty())return;

            // change value
            if(height){
                t2=t1=0;
                _.arr.each(t.items,function(o){
                    obj = profile.getSubNodeByItemId('ITEM', o.id);
                    obj.cssRegion({bottom:'auto',top:t1});

                    // offsetHeight maybe not set here
                    t1 += obj.height();
                    if(o.id == key)return false;
                });
                _.arr.each(t.items,function(o){
                    if(o.id == key)return false;
                    obj = profile.getSubNodeByItemId('ITEM', o.id);
                    obj.cssRegion({top:'auto',bottom:t2});
                    t2+= obj.height();
                },null,true);

                temp = height - t1 - t2;
                if(temp>0){
                    top=t1;
                    hc=temp;
                }
            }
            if(width)wc=width;

            o.cssRegion({width:wc?wc:null,height:hc?hc:null,top:top,left:0},true);
            if(wc)profile.getSubNode('LIST').width(wc);
        }
    }
});
