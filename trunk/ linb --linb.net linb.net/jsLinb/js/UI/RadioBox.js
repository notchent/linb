Class("linb.UI.RadioBox", ["linb.UI.Widget", "linb.UI.iForm", "linb.UI.iList"],{
    Instance:{
        setCtrlValue:function(value){
            return this.each(function(profile){
                var id=profile.domId,
                    key = profile.keys.MARK,
                    properties = profile.properties,
                    itemId = profile.getSubSerialIdByItemId(value)
                    ;
                if(properties.$UIvalue){
                    var o = profile.getSubNode(key, true);
                    if(itemId)profile.removeTagClass(o, key,'-checked');
                }

                var o = profile.getSubNode(key, itemId);
                if(itemId)profile.addTagClass(o, key,'-checked');
            });
        },
        setDirtyMark:function(){
            return this.each(function(profile){
                var id=profile.domId,
                    key = profile.keys.CAPTION,
                    properties = profile.properties,
                    itemId = profile.getSubSerialIdByItemId(properties.$UIvalue),
                    flag=properties.value !== properties.$UIvalue;

                //dirty mark
                if(profile.beforeDirtyMark && false===profile.boxing().beforeDirtyMark(profile,flag)){}
                else{
                    var o = profile.getSubNode(key,itemId);
                    if(properties.$UIvalue){
                        profile.getSubNode(key, true).removeClass(linb.UI.$css_tag_dirty);
                    }

                    if(properties.value !== properties.$UIvalue)
                        o.addClass(linb.UI.$css_tag_dirty);
                    else
                        o.removeClass(linb.UI.$css_tag_dirty);
                }
            });
        },
        activate:function(){
            var profile = this.get(0),
            items = profile.getSubNode(profile.keys.ITEM,true);
            if(!items.isEmpty())
                items.focus();
            return this;
        }
    },
    Initialize:function(){
        //modify default template for shell
        var t = this.getTemplate('default');
        _.merge(t.FRAME.BORDER,{
            ITEMS:{
                tagName : 'DIV',
                text:"{items}"
            }
        },'all');
        t.$dynamic={
            items:{
                ITEM:{
                    tagName: 'a',
                    href :"javascript:;",
                    tabindex: '{_tabindex}',
                    MARK:{
                        tagName : 'span',
                        $order:0
                    },
                    ICON:{
                        tagName : 'span',
                        style:'background:url({icon}) transparent  no-repeat {iconPos};{iconDisplay}',
                        $order:1
                    },
                    CAPTION:{
                        tagName : 'span',
                        text : '{caption}',
                        className:"{disabled}",
                        $order:2
                    }
                }
            }
        };
        this.setTemplate('default',t);

    },
    Static:{
        Appearances:{'default':{
            ITEM:{
               'font-family':' "Verdana", "Helvetica", "sans-serif"',
               border:'0',
               margin:'2px',
               padding:'0 0 0 4px',
               cursor:'pointer',
               'vertical-align':'middle',
               display:linb.browser.gek?['-moz-inline-block', '-moz-inline-box']: 'inline-block',
               'vertical-align':'middle',
               'font-size':'12px'
            },
            MARK:{
               cursor:'pointer',
               width:'16px',
               height:'16px',
               background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -144px top', null, 'linb.UI.Public')
           },
           'MARK-mouseover':{
                $order:1,
                'background-position':' -144px -17px'
           },
           'MARK-mousedown':{
                $order:2,
                'background-position':' -144px -34px'
           },
           'MARK-checked':{
                $order:3,
                'background-position':' -128px top'
           },
           'MARK-checked-mouseover':{
                $order:4,
                'background-position':' -128px -17px'
           },
           'MARK-checked-mousedown':{
                $order:5,
                'background-position':' -128px -34px'
            },
            ICON:{
                cursor:'pointer',
                width:'16px',
                height:'16px',
                margin:'0 4px 0 0'
            },
            ITEMS:{
                overflow:'auto',
                'line-height':'12px',
                background:'#fff'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{ITEM:'MARK'},
            _clickEffect:{ITEM:'MARK'},
            ITEM:{
                onClick:function(profile, e, src){
                    var properties = profile.properties,
                        item = profile.getItemByDom(src),
                        box=profile.boxing();

                    if(properties.disabled)return false;
                    box.updateUIValue(item.id);

                    if(box.getUIValue() == item.id){
                        box.onItemSelected(profile, item, src);
                        linb(src).focus();
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
                            linb(src).onClick();
                            return false;
                            break;
                    }
                }
            }
        }},
        DataModel:{
            icon:null,
            iconPos:null,
            caption:null,
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode(this.keys.ITEM,true).tabIndex(value);
                }
            },

            width:160,
            height:80
        },
        EventHandlers:{
            beforeDirtyMark:function(profile, flag){},
            onItemSelected:function(profile, item, src){}
        },
        resize:function(profile,w,h){
            var size = arguments.callee.upper.apply(this,arguments);
            profile.getSubNode(profile.keys.ITEMS).cssSize(size);
        }
    }
});
