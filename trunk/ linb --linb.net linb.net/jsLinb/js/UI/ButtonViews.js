Class("linb.UI.ButtonViews", "linb.UI.Tabs",{
    Initialize:function(){
        this.mapKeys(['LEFT','TOP','RIGHT','BOTTOM']);
    },
    Static:{
        Appearances:{'default':{
            LIST:{
                'z-index':'2',
                position:'absolute',
                'background-color': '#F3F3F3'
            },
            ITEMS:{
                'z-index':'2',
                position:'absolute',
                left:'0',
                top:'0'
            },
            ITEM:{
                margin:'2px',
                position:'relative'
            },
            'ITEM-checked':{
                //clear tabs
            },
            LEFT:{
                'border-right': '1px solid #A7A6AA'
            },
            RIGHT:{
                'border-left': '1px solid #A7A6AA'
            },
            TOP:{
                'border-bottom': '1px solid #A7A6AA'
            },
            BOTTOM:{
                'border-top': '1px solid #A7A6AA'
            },
            BOX:{
                $order:0,
                border:'solid 1px #F3F3F3',
                'vertical-align':'top'
            },
            'BOX-mouseover':{
                $order:1,
                border:'solid 1px #A7A6AA',
                'background-color':'#FFFFE0'
            },
            'BOX-mousedown, BOX-checked':{
                $order:1,
                border:'solid 1px #A7A6AA',
                'background-color':'#fff'
            },
            HANDLE:{
                cursor:'pointer',
                'vertical-align':'middle',
                display:linb.browser.gek?['-moz-inline-block', '-moz-inline-box']: 'inline-block',
                'vertical-align':'middle',
                'font-size':'12px',
                margin:'1px'
            },
            ICON:{
                cursor:'pointer',
                width:'16px',
                height:'16px',
                margin:'1px'
            }
        }},
        DataModel:{
            dock:'fill',
            handleDock:{
                ini:'top',
                listbox:['top','bottom','left','right'],
                action:function(v){
                    var hs = this.getSubNode(this.keys.LIST),
                        h = this.getSubNode(this.keys.ITEM,true),
                        b = this.getSubNode(this.keys.BOX,true);
                    switch(v){
                        case 'left':
                        case 'top':
                            hs.setRegion({left:0,top:0,right:'auto',bottom:'auto'});
                        break;
                        case 'right':
                        case 'bottom':
                            hs.setRegion({left:'auto',top:'auto',right:0,bottom:0});
                       break;
                    }
                    switch(v){
                        case 'left':
                        case 'right':
                            h.display('block');
                            b.display('block');
                            break;
                        case 'top':
                        case 'bottom':
                            h.inlineBlock();
                            b.inlineBlock();
                            hs.height('auto');
                            break;
                    }
                    this.boxing().setHandleSize(this.properties.handleSize,true);
                }
            },
            handleHAlign:{
                ini:'left',
                listbox:['left','right'],
                action:function(v){
                    var hl = this.getSubNode(this.keys.ITEMS);
                    hl.setStyle('textAlign',v);
                }
            },
            handleVAlign:{
                ini:'top',
                listbox:['top','bottom'],
                action:function(v){
                    var hl = this.getSubNode(this.keys.ITEMS);
                    if(v=='top'){
                        hl.top(0).bottom('auto');
                    }else{
                        hl.bottom(0).top('auto');
                    }
                }
            },
            handleSize:{
                ini:50,
                action:function(v){
                    var t=this.properties,
                        hs = this.getSubNode(this.keys.LIST),
                        hl = this.getSubNode(this.keys.ITEMS);
                    if(['left','right'].exists(t.handleDock)){
                        hs.add(hl).width(v);
                    }else{
                        hs.height(v);
                    }
                    this.box.resize(this,this.properties.$UIvalue ,this.root.width(), this.root.height());
                }
            }
        },
        createdTrigger:function(){
            var pro = this.properties;
            this.boxing().setHandleDock(pro.handleDock,true)
            .setHandleHAlign(pro.handleHAlign,true)
            .setHandleVAlign(pro.handleVAlign,true);
        },
        resize:function(profile,key,w,h){
            var o = profile.boxing().getPanel(key);
            if(!o || o.isEmpty())return;

            var t=profile.properties,  top, left,
                hs = profile.getSubNode(profile.keys.LIST),
                hl = profile.getSubNode(profile.keys.ITEMS)
                ;
            var wc=null,hc=null;

            if(['top','bottom'].exists(t.handleDock)){
                if(w){
                    hs.width(w);
                    hl.width(w);
                    left = 0;
                    wc=w;
                }
                if(h-t.handleSize>0)hc=h-t.handleSize;
                top = t.handleDock=='top'?t.handleSize:0;
            }else{
                if(h){
                    hs.height(h);
                    top=0;
                    hc=h;
                }
                if(w){
                    left = t.handleDock=='left'?t.handleSize:0;
                    wc=w-t.handleSize;
                }
            }
            if(!o.isEmpty())o.setRegion({width:wc?wc-2:null,height:hc?hc-2:null,left:left,top:top},true);
        }
    }
});