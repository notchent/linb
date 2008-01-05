Class("linb.UI.MenuBar",["linb.UI.iWidget","linb.UI.iList","linb.UI.iNavigator"],{
    Instance:{
        /*attach:function(ui){
            //this.reBoxing('UI').attach(ui,[],false);
            this.each(function(v){
                var c=v.getSubNode('LIST');
                c.attach(ui);
            });
            return this;
        },*/
        pop:function(id,src,flag){
            var menu, profile=this.get(0);
            //hide first
            if(profile.$currentmenu)this.hide();

            profile.addTagClass('ITEM', '-mousedown',linb([src],false));

            profile.$allRelatedPopMenus = profile.$allRelatedPopMenus || {};
            if(flag || !(menu = profile.$allRelatedPopMenus[id])){
                var sub = profile.getItemByItemId(id).sub;
                sub  = sub ||[];

                //TODO: create menu
                menu = linb.create('PopMenu',{position:'absolute', items:sub});

                profile.getSubNode('POOL').attach(menu);

                var self=this;
                menu.onHide(function(pro){
                    self.hide(false);
                    self.get(0).properties.$menuPop=null;
                }).onMenuSelected(function(pro, id, src){
                    profile.boxing().onMenuSelected(profile, id, src);
                });
                menu.get(0).$hideMenuPool = profile.getSubNode('POOL');
                menu.get(0).$allRelatedPopMenus = profile.$allRelatedPopMenus;

                if(!flag)profile.$allRelatedPopMenus[id] = menu;
            }
            var target = linb([src],false);
            menu.pop(target);

            profile.$currentmenu=id;
            profile.$currentNode=src;
        },
        hide:function(flag){
            var profile=this.get(0),menu,
            id = profile.$currentmenu,
            node = profile.$currentNode;

            if(menu = profile.$allRelatedPopMenus[id]){

                if(false!==flag)menu.hide(false);

                // collect
                profile.getSubNode('POOL').addLast(menu.reBoxing());
                menu=profile.$currentmenu=profile.$currentNode=null;

                profile.removeTagClass('ITEM', '-mousedown', linb([node],false));
            }
        },
        reset:function(){
            var profile=this.get(0);
            profile.getSubNode('POOL').empty();
            profile.$allRelatedPopMenus=profile.$currentmenu=profile.$currentNode=null;
        }
    },
    Initialize:function(){
        linb.SC('linb.UI.PopMenu');
    },
    Static:{
        $recursive:true,
        cssNone:false,
        Templates:{'default':{
            tagName:'div',
            POOL:{
                tagName:'div'
            },
            BORDER:{
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
                        tagName:'a',
                        href :"javascript:;",
                        tabindex: '{_tabindex}',
                        className:' {typeCls} ',
                        ICON:{
                            $order:1,
                            style:'background:url({icon}) transparent no-repeat  {iconPos}; {iconDisplay}'
                        },
                        CAPTION:{
                            $order:2,
                            text : '{caption}',
                            style:'{captionDisplay}'
                        }
                    }
                }
            }
        }},
        Appearances:{'default':{
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
                border: 'solid 1px',
                'background-color':'#f4f4f4',
                'border-color':'#fff #A7A6AA #A7A6AA #fff',
                'font-size':0,
                'line-height':0
            },
            HANDLER:{
                height:'22px',
                width:'6px',
                background: linb.UI.getCSSImgPara('handler.gif', ' left top #f4f4f4 ', null, 'linb.UI.Public'),
                cursor:'move'
            },
            LIST:{
                'padding':'1px 4px 1px 2px'
            },
            'LIST-disabled':{
                'background-color':'#E4E4E4'
            },
            ITEM:{
                display:linb.browser.gek?['-moz-inline-block', '-moz-inline-box']: 'inline-block',
                /*must specify this, or static will take more v space*/
                'vertical-align':'middle',
//                height:'18px',
                padding:'1px 4px 1px 4px',
                border:'solid 1px #f4f4f4'
            },
            'ITEM-mouseover':{
                $order:2,
                'border-color':'#fff #cdcdcd #cdcdcd #fff'
            },
            'ITEM-mousedown':{
                $order:2,
                'border-color':'#cdcdcd #fff #fff #cdcdcd',
                'background-color':'#fff'
            },
            ICON:{
                width:'16px',
                height:'16px',
                'margin-right':'1px',
                'vertical-align':'middle'
            },
            CAPTION:{
                height:'16px',
                'margin-left':'1px',
                'font-size':'12px',
                'line-height':'12px',
                'vertical-align':'middle'
            }
        }},
        Behaviors:{'default':{
            onMousedown:function(profile, e, src){
                //darg
            },
            ITEM:{
                onMouseover:function(profile, e, src){
                    var p = profile.properties;
                    if(p.disabled)return;
                    var item = profile.getItemByDom(src),
                        itemId = item.id;
                    if(p.$menuPop){
                        if(p.$menuPop != itemId){
                            profile.addTagClass('ITEM', '-mousedown', linb([this],false));
                            //show current popmenu
                            profile.boxing().pop(itemId, this);
                            p.$menuPop = itemId;
                        }
                    }else{
                        profile.addTagClass('ITEM', '-mouseover',linb([this],false));
                    }
                },
                onMouseout:function(profile, e, src){
                    var p = profile.properties;
                    if(p.disabled)return;
                    profile.removeTagClass('ITEM', '-mouseover', linb([this],false));
                },
                onMousedown:function(profile, e, src){
                    var p = profile.properties;
                    if(p.disabled)return;
                    var item = profile.getItemByDom(src),
                        itemId = item.id;
                     if(p.$menuPop){
                        if(false===_.tryF(profile.onPopMenu, [itemId], profile))return;
                        p.$menuPop=null;

                        //hide current pop menu
                        profile.boxing().hide(itemId);
                     }else{
                        if(false===_.tryF(profile.onHideMenu, [itemId], profile))return;
                        p.$menuPop=itemId;

                        //show current menu
                        profile.boxing().pop(itemId, this);

                        //stop bubble to document.body
                        //popmenu will add blue trigger to document.body.beforeMousedown
                        return false;
                     }
                },
                onKeydown:function(profile, e, src){
                    var keys=linb.event.getKey(e), key = keys[0], shift=keys[2],
                    cur = linb([src],false),
                    first = profile.root.nextFocus(true, true, false),
                    last = profile.root.nextFocus(false, true, false);

                    switch(linb.event.getKey(e)[0]){
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
                        case 'space':
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
        }},
        DataModel:{
            value:null,

            dataField:null,
            dataBinder:null,
            listKey:null,

            //can't change height
            height:null,
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode('ITEM', true).tabIndex(value);
                }
            },

            $menuPop:null,
            $border:1,
            left:0,
            top:0,

            handler:{
                ini:true,
                action:function(v){
                    this.getSubNode('HANDLER').display(v?'':'none');
                }
            },
            position:'absolute',
            dock:{
                ini:'top',
                listbox:['top','bottom']
            }
        },
        EventHandlers:{
            beforeValueUpdated:null,
            afterValueUpdated:null,
            beforeValueSet:null,
            afterValueSet:null,

            onMenuSelected:function(profile, id, src){}
        },
        createdTrigger:function(){
            if(this.properties.disabled)this.boxing().setDisabled(true,true);
        },

        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);
            profile.data.handler = profile.data.handler?'':'display:none';
        }

    }
});

