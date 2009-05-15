Class("linb.UI.MenuBar",["linb.UI","linb.absList" ],{
    Instance:{
        updateItem:function(subId,options){
            var self=this,
                profile=self.get(0),
                box=profile.box,
                items=profile.properties.items,
                rst=profile.queryItems(items,function(o){return typeof o=='object'?o.id===subId:o==subId},true,true,true),
                item;
            if(typeof options=='string')options={caption:options};
            if(rst.length){
                rst=rst[0];
                if(typeof rst[0]!='object')
                    item=rst[2][rst[1]]={id:rst[0]};
                else
                    item=rst[0];

                //merge options
                _.merge(item, options, 'all');
                //ensure the original id.
                item.id=subId;

                //the root
                if(items.indexOf(item)!=-1)
                    arguments.callee.upper.apply(this,arguments);
                //try each sub popmenu
                else{
                    _.each(profile.$allPops,function(o){
                        o.updateItem(subId,options);
                    });
                }
            }
        },
        _pop:function(id,src){
            var menu, 
                self=this,
                profile=self.get(0),
                pro=profile.properties,
                all='$allPops';
            //hide first
            if(profile.$curPop)self.hide();

            linb([src]).tagClass('-mousedown');

            profile[all] = profile[all] || {};
            if(!(menu = profile[all][id])){
                var item=profile.getItemByItemId(id),
                    sub = item.sub;
                sub  = sub ||[];

                menu = linb.create('PopMenu',{position:'absolute', items:sub, autoHide:!!pro.autoShowTime});
                profile.getSubNode('POOL').append(menu);

                menu.onHide(function(pro){
                    self.hide(false);
                }).onMenuSelected(function(pro, item, src){
                    return profile.boxing().onMenuSelected(profile, pro, item, src);
                }).onShowSubMenu(function(pro, item, src){
                    return profile.boxing().onShowSubMenu(profile, pro, item, src);
                });
                menu.get(0).$hideMenuPool = profile.getSubNode('POOL');
                menu.get(0)[all] = profile[all];

                profile[all][id] = menu;
            }
            var target = linb(src);
            menu.pop(target, 1, linb(pro.parentID));

            profile.$curPop=id;
            profile.$curElem=src;
        },
        _afterInsertItems:function(){
            this.clearPopCache();
        },
        hide:function(){
            var profile=this.get(0),menu,
            id = profile.$curPop,
            node = profile.$curElem;

            if(menu = profile.$allPops[id]){
                //To avoid trigger recursive call
                if(false!==arguments[0])
                    menu.hide(false);
                // collect
                profile.getSubNode('POOL').append(menu.reBoxing());
                linb([node]).tagClass('-mousedown',false);
            }
            profile.$menuPop=profile.$curPop=profile.$curElem=null;
        },
        clearPopCache:function(){
            var profile=this.get(0);
            profile.getSubNode('POOL').empty();
            profile.$allPops=profile.$curPop=profile.$curElem=null;
        }
    },
    Initialize:function(){
        linb.SC('linb.UI.PopMenu');
    },
    Static:{
        Templates:{
            tagName:'div',
            POOL:{
                tagName:'div'
            },
            BORDER:{
                className:'uibg-bar uiborder-outset',
                tagName:'div',
                LIST:{
                    tagName:'div',
                    HANDLER:{
                        style:'{handler}'
                    },
                    ITEMS:{
                        $order:1,
                        text:"{items}"
                    }
                }
            },
            $dynamic:{
                items:{
                    ITEM:{
                        ITEMI:{
                            ITEMC:{
                                ITEMA:{
                                    tagName:'a',
                                    href :linb.$href,
                                    tabindex: '{_tabindex}',
                                    className:' {typeCls} {disabled}',
                                    ICON:{
                                        $order:1,
                                        className:'ui-icon',
                                        style:'background:url({image}) transparent no-repeat  {imagePos}; {iconDisplay}'
                                    },
                                    CAPTION:{
                                        $order:2,
                                        text : '{caption}',
                                        style:'{captionDisplay}'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        Appearances:{
            KEY:{
                'font-size':0,
                'line-height':0,
                position:'absolute',
                left:0,
                top:0
            },
            POOL:{
                width:0,
                height:0,
                visibility:'hidden',
                position:'absolute',
                left:'-10000px'
            },
            BORDER:{
                left:0,
                top:0,
                'font-size':0,
                'line-height':0
            },
            HANDLER:{
                height:'22px',
                width:'7px',
                background: linb.UI.$bg('handler.gif', ' left top', true),
                cursor:'move',
                'vertical-align':'middle'
            },
            LIST:{
                padding:'2px'
            },
            ITEMS:{
                'vertical-align':'middle'
            },
            'LIST-disabled':{
                'background-color':'#E4E4E4'
            },
            'ITEM-mouseover, ITEM-mouseover ITEMI, ITEM-mouseover ITEMC, ITEM-mousedown, ITEM-mousedown ITEMI, ITEM-mousedown ITEMC':{
                background:linb.UI.$bg('button.gif', 'no-repeat',true)
            },
            ITEM:{
                height:'22px',
                'white-space': 'nowrap',
                'vertical-align':'top',
                overflow:'hidden',
                margin:'0  3px 0 3px',
                'padding-right':'6px',
                'font-size':0,
                'line-height':0
            },
            'ITEM *':{
                cursor:'pointer'
            },
            ITEMI:{
                height:'22px',
                'padding-left':'6px',
                'vertical-align':'top'
            },
            ITEMC:{
                height:'22px',
                'padding-top':'3px',
                'vertical-align':'top'
            },
            ITEMA:{
                display:linb.$inlineBlock
            },
            'ITEM-mouseover':{
                $order:2,
                'background-position':'right -90px'
            },
            'ITEM-mousedown':{
                $order:3,
                'background-position':'right -180px'
            },
            'ITEM-mouseover ITEMI':{
               $order:2,
                'background-position':'left -150px'
            },
            'ITEM-mousedown ITEMI':{
                $order:3,
                'background-position':'left -240px'
            },            
            'ITEM-mouseover ITEMC':{
                $order:2,
                'background-position':'left -120px',
                'background-repeat': 'repeat-x'
            },
            'ITEM-mousedown ITEMC':{
                $order:3,
                'background-position':'left -210px',
                'background-repeat': 'repeat-x'
            },            
            CAPTION:{
                'font-size':'12px',
                'line-height':'14px',
                'vertical-align':'middle'
            }
        },
        Behaviors:{
            ITEM:{
                onMouseover:function(profile, e, src){
                    var p = profile.properties, ns=this;
                    if(p.disabled)return;
                    var item = profile.getItemByDom(src),
                        itemId = item.id;
                    if(item.disabled)return;
                    if(profile.$menuPop){
                        if(profile.$menuPop != itemId){
                            linb([ns]).tagClass('-mousedown');
                            //show current popmenu
                            profile.boxing()._pop(itemId, ns);
                            profile.$menuPop = itemId;
                        }
                    }else{
                        linb([ns]).tagClass('-mouseover');

                        if(p.autoShowTime)
                            _.resetRun(profile.$id+':autoShowTime', function(){
                                profile.boxing()._pop(itemId, ns);
                            },p.autoShowTime);
                    }
                },
                onMouseout:function(profile, e, src){
                    var p = profile.properties;
                    if(p.disabled)return;
                    var item = profile.getItemByDom(src);
                    if(item.disabled)return;

                    linb([this]).tagClass('-mouseover',false);

                    if(p.autoShowTime){
                        var pop = profile.$allPops;
                        if(pop=pop && pop[profile.$curPop]){
                            var node=pop.get(0).root,
                                p1=linb.Event.getPos(e),
                                size=node.cssSize(),
                                add=3,
                                p2=node.offset();

                            if(p1.left>p2.left && p1.top>p2.top-add && p1.left<p2.left+size.width && p1.top<p2.top+size.height){}else
                                pop.hide();
                        }
                        _.resetRun(profile.$id+':autoShowTime', null);
                    }
                },
                onMousedown:function(profile, e, src){
                    var p = profile.properties;
                    if(p.disabled)return;
                    var item = profile.getItemByDom(src),
                        itemId = item.id;
                    if(item.disabled)return;
                    if(profile.$menuPop){
                        profile.$menuPop=null;
                        profile.boxing().hide(itemId);
                     }else{
                        profile.$menuPop=itemId;
                        profile.boxing()._pop(itemId, this);

                        //stop bubble to document.body
                        //popmenu will add blue trigger to document.body.beforeMousedown
                        return false;
                     }
                },
                onKeydown:function(profile, e, src){
                    var keys=linb.Event.getKey(e), key = keys[0], shift=keys[2],
                    cur = linb(src),
                    first = profile.root.nextFocus(true, true, false),
                    last = profile.root.nextFocus(false, true, false);

                    switch(linb.Event.getKey(e)[0]){
                        case 'tab':
                            if(shift){
                                if(src!=first.get(0)){
                                    first.focus();
                                    return false;
                                }
                            }else{
                                if(src!=last.get(0)){
                                    last.focus();
                                    return false;
                                }
                            }
                            break;
                        case 'left':
                        case 'up':
                            var next = cur.nextFocus(false, true, false);
                            if(cur.get(0)==first.get(0))
                                last.focus();
                            else
                                cur.nextFocus(false);
                            return false;
                            break;
                        case 'right':
                        case 'down':
                            var next = cur.nextFocus(true, false, false);
                            if(cur.get(0)==last.get(0))
                                first.focus();
                            else
                                cur.nextFocus();
                            return false;
                            break;
                        case 'enter':
                            linb(src).onMousedown();
                            return false;
                            break;
                    }
                },
                onClick:function(){
                    return false;
                }
            }
        },
        DataModel:{
            listKey:null,

            //can't change height
            height:{
                ini:'auto',
                readonly:true
            },
                
            width:'auto',
            parentID:'',
            $hborder:1,
            $vborder:1,
            left:0,
            top:0,

            autoShowTime:200,

            handler:{
                ini:true,
                action:function(v){
                    this.getSubNode('HANDLER').css('display',v?'':'none');
                }
            },
            position:'absolute',
            dock:{
                ini:'top',
                listbox:['top','bottom']
            }
        },
        EventHandlers:{
            onShowSubMenu:function(profile, popProfile, item, src){},
            onMenuSelected:function(profile, popProfile, item, src){}
        },
        RenderTrigger:function(){
            if(this.properties.disabled)this.boxing().setDisabled(true,true);
        },
        _prepareData:function(profile){
            var data=arguments.callee.upper.call(this, profile);
            data.handler = data.handler?'':'display:none';
            return data;
        }
    }
});

