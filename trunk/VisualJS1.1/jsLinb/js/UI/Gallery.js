Class("linb.UI.Gallery", "linb.UI.List",{
    Initialize:function(){
        //modify default template fro shell
        var t = this.getTemplate('default');
        t.$dynamic={
            items:{
                ITEM:{
                    style:'padding:{itemPadding}px;margin:{itemMargin}px;',
                    ITEMFRAME:{
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
                                    tagName : 'a',
                                    href:'{href}',
                                    style:'background:url({icon}) transparent center  no-repeat {iconPos};width:{iconWidth}px;height:{iconHeight}px;'
                                }
                        },
                        COMMENT:{
                            tagName : 'a',
                            href:'{href}',
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
                position:'relative',
                top:0,
                left:0,
                overflow:'auto',
                'overflow-x': (linb.browser.ie || linb.browser.gek)?'hidden':''
            },
            ITEM:{
                display:linb.browser.gek?['-moz-inline-block', '-moz-inline-box']: 'inline-block',
                position:'relative',
                overflow:'hidden',
                'vertical-align':'top',
                /*opera must be 0 not 'none'*/
                border:0,
                padding:0,
                margin:0
            },
            ITEMFRAME:{
                display:linb.browser.ie?'inline-block':'block',
                position:'relative',
                overflow:'hidden',
                border:0,
                padding:0,
                margin:0,
                width:'100%',
                height:'100%',
                '-moz-box-flex':'1',
                border:'1px solid #A7A6AA'
            },
            'ITEM-mouseover':{
            },
            'ITEM-checked':{
            },
            'ITEM-mouseover CAPTION':{
                $order:1 ,
                'background-color': '#d9e8fb'
            },
            'ITEM-checked CAPTION':{
                $order:2,
                'background-color':'#316AC5',
                color:'#fff'
            },
            'CONTENT, CAPTION':{
            	'text-align': 'center'
            },
            CAPTION:{
                'font-weight':'bold',
                'border-bottom':'1px solid #A7A6AA'
            },
            ICON:{
                display:linb.browser.gek?['-moz-inline-block', '-moz-inline-box']: 'inline-block',
            	'vertical-align': 'middle'
            },
            'COMMENT':{
                display:'block',
                margin:'0 2px 0 2px'
            }
        }},
        DataModel:({
            itemMargin:{
                ini:6,
                action:function(v){
                    if(typeof v!='object')
                        this.getSubNode('ITEM',true).setPxStyle('margin',v);
                    else
                        this.getSubNode('ITEM',true).setStyle(v);
                }
            },
            itemPadding:{
                ini:2,
                action:function(v){
                    if(typeof v!='object')
                        this.getSubNode('ITEM',true).setPxStyle('padding',v);
                    else
                        this.getSubNode('ITEM',true).setStyle(v);
                }
            },
            itemWidth:{
                ini:32,
                action:function(v){
                    this.getSubNode('ITEMFRAME',true).width(v);
                }
            },
            itemHeight:{
                ini:32,
                action:function(v){
                    this.getSubNode('ITEMFRAME',true).height(v);
                }
            },
            iconWidth:{
                ini:16,
                action:function(v){
                    this.getSubNode('ICON',true).width(v);
                }
            },
            iconHeight:{
                ini:16,
                action:function(v){
                    this.getSubNode('ICON',true).height(v);
                }
            },
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode('ITEM',true).tabIndex(value);
                }
            },
            width:200,
            height:200
        }),
        prepareItem:function(profile, item){
            var p = profile.properties;

            'itemWidth,itemHeight,iconWidth,iconHeight,itemPadding,itemMargin'.toArr().each(function(i){
                item[i] = item[i] || p[i];
            });

            item.capition = item.capition || '';
            item.comment = item.comment || '';
            item._tabindex = p.tabindex;
        }
    }
});
