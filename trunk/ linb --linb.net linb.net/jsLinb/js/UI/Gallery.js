Class("linb.UI.Gallery", ["linb.UI.List"],{
    Initialize:function(){
        //modify default template fro shell
        var t = this.getTemplate('default');
        t.$dynamic={
            items:{
                ITEM:{
                    tagName : 'a',
                    href :"javascript:;",
                    tabindex: '{_tabindex}',
                    style:'padding:{itemPadding}px;',
                    ITEMFRAME:{
                        tagName:'span',
                        style:'width:{itemWidth}px;height:{itemHeight}px;',
                        CAPTION:{
                            tagName : 'div',
                            text: '{caption}',
                            $order:0
                        },
                        CONTENT:{
                                tagName : 'div',
                                $order:1,
                                ICON:{
                                    tagName : 'span',
                                    style:'background:url({icon}) transparent  no-repeat {iconPos};width:{iconWidth}px;height:{iconHeight}px;'
                                }
                        },
                        COMMENT:{
                            tagName : 'div',
                            text: '{comment}',
                            $order:2
                        }
                    }
                }
            }
        };
        this.setTemplate('default',t);
    },
    Static:{
        Appearances:{'default':{
            ITEMS:{
                position:'absolute',
                top:'0',
                left:'0',
                overflow:'auto',
                'overflow-x': (linb.browser.ie || linb.browser.gek)?'hidden':''
            },
            ITEM:{
                display:linb.browser.gek?['-moz-inline-block', '-moz-inline-box']: 'inline-block',
                position:'relative',
                overflow:'hidden',
                'vertical-align':'top',
                /*opera must be 0 not 'none'*/
                border:'0',
                padding:'0',
                margin:'0'
            },
            ITEMFRAME:{
                display:linb.browser.ie?'inline-block':'block',
                position:'relative',
                overflow:'hidden',
                border:'0',
                padding:'0',
                margin:'0',
                width:'100%',
                height:'100%',
                '-moz-box-flex':'1',
                border:'1px solid #A7A6AA'
            },
            'ITEM-mouseover ITEMFRAME':{
                $order:1,
                border:'1px solid blue'
            },
            'ITEM-checked ITEMFRAME':{
                $order:2,
                border:'1px solid blue',
                'background-color':'#316AC5',
                color:'#fff'
            },
            CONTENT:{
            	'text-align': 'center'
            },
            CAPTION:{
                'font-weight':'bold',
                'text-align': 'center'
            },
            ICON:{
            	'vertical-align': 'middle'
            }
        }},
        DataModel:({
            itemPadding:{
                ini:6,
                action:function(v){
                    if(typeof v!='object')
                        this.getSubNode(this.keys.ITEM,true).setPxStyle('padding',v);
                    else
                        this.getSubNode(this.keys.ITEM,true).setStyle(v);
                }
            },
            itemWidth:{
                ini:32,
                action:function(v){
                    this.getSubNode(this.keys.ITEMFRAME,true).width(v);
                }
            },
            itemHeight:{
                ini:32,
                action:function(v){
                    this.getSubNode(this.keys.ITEMFRAME,true).height(v);
                }
            },
            iconWidth:{
                ini:16,
                action:function(v){
                    this.getSubNode(this.keys.ICON,true).width(v);
                }
            },
            iconHeight:{
                ini:16,
                action:function(v){
                    this.getSubNode(this.keys.ICON,true).height(v);
                }
            },
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode(this.keys.ITEM,true).tabIndex(value);
                }
            },
            width:200,
            height:200
        }),
        prepareItem:function(profile, item){
            var p = profile.properties;
            item.itemWidth=item.itemWidth ||p.itemWidth;
            item.itemHeight=item.itemHeight||p.itemHeight;
            item.iconWidth=item.iconWidth||p.iconWidth;
            item.iconHeight=item.iconHeight||p.iconHeight;
            item.itemPadding=item.itemPadding||p.itemPadding;

            item.capition = item.capition || '';
            item.comment = item.comment || '';
            item._tabindex = p.tabindex;
        }
    }
});
