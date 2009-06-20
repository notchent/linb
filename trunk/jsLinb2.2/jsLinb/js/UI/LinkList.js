Class("linb.UI.LinkList", ["linb.UI.List"],{
    Initialize:function(){
        //modify default template fro shell
        var t = this.getTemplate();
        t.$submap={
            items:{
                ITEM:{
                    className:'{itemClass} {disabled}',
                    style:'margin:{itemMargin}px;{itemStyle}',
                    LINK:{
                        $order:1,
                        tagName : 'a',
                        href :"{href1}",
                        tabindex: '{_tabindex}',
                        text:'{caption}'
                    }
                }
            }
        };
        this.setTemplate(t);
    },
    Static:{
        Appearances:{
            ITEMS:{
                position:'relative',
                overflow:'auto',
                'overflow-x': (linb.browser.ie || linb.browser.gek)?'hidden':''
            },
            ITEM:{
                'vertical-align':'middle',
                position:'relative',
                background: linb.UI.$bg('icons.gif', 'no-repeat left -130px', true),
                'border-right':'solid 1px #7C9CBC',
                height:'16px',
                padding:'3px',
                'font-size':0,
                'line-height':0,
                'white-space':'nowrap'
            },
            'ITEM-mouseover, ITEM-mousedown, ITEM-checked':{
            },
            'ITEM-mouseover':{
                $order:1,
                'background-position': 'left -153px'
            },
            'ITEM-mousedown':{
                $order:2,
                'background-position': 'left -176px'
            },
            'ITEM-checked':{
                $order:2,
                'background-position': 'left -176px'
            },
            LINK:{
                display:linb.$inlineBlock,
                zoom:linb.browser.ie6?1:null,
                'vertical-align':'middle',
                padding:'1pt 4px 1pt 12px',
                'font-size':'12px',
                'line-height':'14px'
            }
        },
        DataModel:({
            itemMargin:{
                ini:0,
                action:function(value){
                    this.getSubNode('ITEM',true).css('margin',value+'px');
                }
            }
        }),
        Behaviors:{
            ITEM:{onClick:null,onKeydown:null},
            LINK:{
                onClick:function(profile, e){return !!linb.Event.getKey(e)[2]},
                onMousedown:function(profile, e, src){
                    if(linb.Event.getBtn(e)!='left')return;
                    var properties = profile.properties,
                        item = profile.getItemByDom(src),
                        box = profile.boxing();
                    if(properties.disabled|| item.disabled)return false;
                        box.onItemClick(profile, item, src);
                }
            }
        },
        EventHandlers:{
            onItemSelected:null,
            onItemClick:function(profile, item, src){}
        },
        _prepareItem:function(profile, item){
            var p = profile.properties;
            item._tabindex = p.tabindex;
            item.itemMargin = p.itemMargin;
        }
    }
});
