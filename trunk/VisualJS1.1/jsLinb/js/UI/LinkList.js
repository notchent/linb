Class("linb.UI.LinkList", ["linb.UI.List"],{
    Initialize:function(){
        //modify default template fro shell
        var t = this.getTemplate('default');
        t.$dynamic={
            items:{
                ITEM:{
                    style:'{_style};margin:{itemMargin}px',
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
        this.setTemplate('default',t);
    },
    Static:{
        Appearances:{'default':{
            ITEMS:{
                position:'relative',
                overflow:'auto',
                'overflow-x': (linb.browser.ie || linb.browser.gek)?'hidden':''
            },
            ITEM:{
                'vertical-align':'middle',
                position:'relative',
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat left -202px', null, 'linb.UI.Public'),
                'border-right':'solid 1px #C2C1C1',
                height:'16px',
                'white-space':'nowrap'
            },
            'ITEM-mouseover':{},
            'ITEM-checked':{},
            LINK:{
                display:linb.browser.gek?['-moz-inline-block', '-moz-inline-box','inline-block']: 'inline-block',
                'vertical-align':'middle',
                padding:'1pt 4px 1pt 12px'
            }
        }},
        DataModel:({
            itemMargin:0,
            tabindex:{
                action:function(value){
                    var self=this,
                        keys = self.keys,
                        fun = function(l,v){self.getSubNode(l,true).tabIndex(v)}
                    if(self.domNode)
                        fun('LINK', value);
                }
            }
        }),
        Behaviors:{'default':{
            ITEM:{},
            LINK:{
                onClick:function(profile, e){return profile.box.cancelLink(e)},
                onMousedown:function(profile, e, src){
                    if(linb.event.getBtn(e)!='left')return;
                    var properties = profile.properties,
                        item = profile.getItemByDom(src),
                        box = profile.boxing();
                    if(properties.disabled|| item.disabled)return false;
                        box.onItemClick(profile, item, src);
                }
            }
        }},
        EventHandlers:{
            onItemSelected:null,
            onItemClick:function(profile, item, src){}
        },
        prepareItem:function(profile, item){
            var p = profile.properties;
            item._tabindex = p.tabindex;
            item.itemMargin = p.itemMargin;
        }
    }
});
