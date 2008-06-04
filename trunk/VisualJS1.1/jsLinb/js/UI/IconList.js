Class("linb.UI.IconList", "linb.UI.List",{
    Initialize:function(){
        //modify default template fro shell
        var t = this.getTemplate('default');
        t.$dynamic={
            items:{
                ITEM:{
                    style:'padding:{itemPadding}px;margin:{itemMargin}px;',
                    ICON:{
                        style:'background:url({icon}) transparent no-repeat {iconPos};width:{itemWidth}px;height:{itemHeight}px;'
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
                display:linb.browser.gek?['-moz-inline-block', '-moz-inline-box','inline-block']: 'inline-block',
                position:'relative',
                overflow:'hidden',
                'vertical-align':'top'
            },
            ICON:{
                border:'1px solid #CDCDCD'
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
                ini:16,
                action:function(v){
                    this.getSubNode('ICON',true).width(v);
                }
            },
            itemHeight:{
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
            'itemWidth,itemHeight,itemPadding,itemMargin'.toArr().each(function(i){
                item[i] = item[i] || p[i];
            });
            item._tabindex = p.tabindex;
        }
    }
});
