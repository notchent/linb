//set "linb.UI.Widget" at the first parent class
Class("linb.UI.PopMenu",["linb.UI.Widget","linb.UI.iList","linb.UI.iNavigator"],{
    Instance:{
        activate:function(){
            return linb.UI.iList.prototype.activate.call(this);
        },
        adjustSize:function(){
            return this.each(function(profile){
                var
                root = profile.root,
                items = profile.getSubNode('ITEMS'),
                border = profile.getSubNode('BORDER'),
                size1 = root.cssSize(),
                size2 = border.cssSize(),
                h = Math.min(profile.properties.maxHeight, items.height() + size1.height - size2.height + 2),
                w = Math.min(profile.properties.maxWidth, items.width() + size1.width - size2.width + 2)
                ;

                profile.properties.width=w;
                profile.properties.height=h;

                root.cssSize({ width :w, height :h},true);

                profile.boxing().setScrollButtons();
            });
        },
        setScrollButtons:function(){
            return this.each(function(profile){
                var
                o=profile.getSubNode('ITEMS'),
                t=o.offsetTop(),
                h=o.offsetHeight(),
                b = profile.getSubNode('BORDER'),
                hh=b.offsetHeight();


                profile.getSubNode('TOP').display(t===0?'none':'block');
                profile.getSubNode('BOTTOM').display((hh>h+t)?'none':'block');
            })
        },
        scrollToBottom:function(){
            return this.each(function(profile){
                var o = profile.getSubNode('ITEMS'),
                border = profile.getSubNode('BORDER'),
                y = o.offsetTop(),
                offset,
                h = o.offsetHeight(),
                b=false,
                bh = border.height();
                if(bh<h+y){
                    if(!profile.$scrollStep)profile.$scrollStep=1;

                    if(profile.$scrollStep<30)
                        profile.$scrollStep = profile.$scrollStep*1.1;

                    y -= profile.$scrollStep;
                    if(bh>h+y){
                        y=bh-h;
                        b=true;
                    }
                    o.top(y);
                    if(b){
                        profile.getSubNode('BOTTOM').display('none');
                        profile.$scrollTobottom=false;
                        profile.$scrollStep=null;
                    }else{
                        profile.getSubNode('TOP').display('block');
                        if(profile.$scrollTobottom)
                            _.asyRun(arguments.callee, 0, [profile], this);
                    }
                }
            });
        },
        scrollToTop:function(){
            return this.each(function(profile){
                var o = profile.getSubNode('ITEMS'),
                y = o.offsetTop(),
                b=false;

                if(y<0){
                    if(!profile.$scrollStep)profile.$scrollStep=1;

                    if(profile.$scrollStep<10)
                        profile.$scrollStep = profile.$scrollStep*1.03;

                    y += profile.$scrollStep;
                    if(y>=-1){
                        y=0;
                        b=true;
                    }
                    o.top(y);
                    if(b){
                        profile.getSubNode('TOP').display('none');
                        profile.$scrollToTop=false;
                        profile.$scrollStep=null;
                    }else{
                        profile.getSubNode('BOTTOM').display('block');
                        if(profile.$scrollToTop)
                            _.asyRun(arguments.callee, 0, [profile], this);
                    }
                }
            });
        },
        pop:function(obj, parent, type){
            var profile=this.get(0);
            //ensure created
            if(!profile.created)
                profile.boxing().create(true);

            //clear highLight first
            if(profile.$highLight)
                profile.removeTagClass('ITEM', '-mouseover', linb([profile.$highLight],false));

            profile.root.popToTop(obj, parent, type);

            var f=function(){
                var p=arguments.callee.profile;
                p.boxing().hide();
                p.$groupPopMenu.length=0;
            };
            f.profile=profile;


            if(!profile.$groupPopMenu || !profile.$groupPopMenu.length){
                profile.$groupPopMenu = [profile.root.get(0)];
                //group blur trigger
                profile.root.setBlurTrigger(profile.$id, null);
                profile.root.setBlurTrigger(profile.$id, f, profile.$groupPopMenu);
            }
/*
            var t = profile.properties.items;
            if(t && t.length){
                var node = profile.getSubNodeByItemId('ITEM', t[0].id).get(0);

                profile.$highLight = node;
                node.focus();
                profile.$highLight = null;
            }
*/
        },
        hide:function(flag){
            var t,profile=this.get(0);

            //remove trigger
            profile.root.setBlurTrigger(profile.$id,null);

            if(profile.$hideMenuPool)
                profile.$hideMenuPool.addLast(profile.root);
            else
                profile.root.display('none');

            //hide all parent pop
            var p=profile.$childPopMenu,q;
            while(p){
                p.boxing().hide();
                p=(q=p).$childPopMenu;
                q.$childPopMenu = q.$subPopMenuShowed = null;
            }
            profile.$childPopMenu=profile.$subPopMenuShowed=null;

            if(t=profile.$parentPopMenu)t.$subPopMenuShowed=null;

            profile.$groupPopMenu.removeValue(profile.root.get(0));

            if(false!==flag)profile.boxing().onHide(profile);
        }
    },
    Initialize:function(){
        //modify default template fro shell
        var t = this.getTemplate('default');
        _.merge(t.FRAME.BORDER,{
             TOP:{},
             BOTTOM:{},
             BOX:{
                tagName:'div',
                 ITEMS:{
                    tagName:'div',
                    text:"{items}"
                 }
             },
             POOL:{
                tagName : 'div',
                style:'display:none;'
             }
        },'all');
        t.$dynamic = {
            'items':function(profile,template,v,tag,result){
                tag = tag+'.'+v.type;
                if(template[tag])
                    linb.UI.$doTemplate(profile,template,v,tag,result)
             },
            'items.split':{
                ITEMSPLIT:{
                    tagName:'div',
                    //span is for ie6;
                    ITEMIN:{
                        style:"width:2px;height:2px;font-size:0;line-height:0;"
                    }
                }
            },
            'items.button':{
                ITEM:{
                    tagName : 'a',
                    href :"javascript:;",
                    tabindex: 0,
                    className: '{cls}',
                    ICON:{
                        style:'background:url({icon}) transparent  no-repeat {iconPos};',
                        $order:0
                    },
                    CAPTION:{
                        text : '{caption}',
                        $order:1
                    },
                    RULER:{
                        style:'{displayAdd}',
                        $order:2
                    },
                    ADD:{
                        tagName : 'div',
                        style:'{displayAdd}',
                        text : '{add}',
                        $order:2
                    },
                    SUB:{style:'{tagClass}'}
                }
            }
        };
        this.setTemplate('default',t);
    },
    Static:{
        hasDomRoot:false,
        Appearances:{'default':{
            KEY:{
                'font-size':'12px',
                visibility:'hidden'
            },
            BORDER:{
                border:'1px solid',
                'border-color':'#fff #cdcdcd #cdcdcd #fff'
            },
            BOX:{
                'background-color':'#F9F8F7',
                overflow:'hidden',
                position:'absolute',
                left:0,
                top:0,
                'z-index':'3'
            },
            ITEMS:{
                position:'absolute',
                top:0,
                left:0,
                overflow:'visible',
                background: linb.UI.getCSSImgPara('bg.gif', ' repeat-y left top')
            },
            ITEM:{
                display:'block',
                position:'relative',
                overflow:'visible',
                'white-space': 'nowrap',

                color:'#000',
                'font-family': '"Verdana", "Helvetica", "sans-serif"',
                cursor:'pointer',
                padding:'2px 20px 2px 2px'
            },
            ITEMSPLIT:{
                display:'block',
                position:'relative',
                overflow:'hidden',

                'font-size':0,
                'line-height':0,
               // height:'6px',
                margin:'2px 2px 2px 26px',
                background: linb.UI.getCSSImgPara('hsplit.gif', ' repeat-x left top', null, 'linb.UI.Public')
            },
            'ITEM-mouseover':{
                $order:1,
                'background-color':'#B6BDD2'
            },
            'ITEM-checked':{
                $order:2,
                'background-color':'#B6BDD2'
            },
            TOP:{
                cursor:'pointer',
                display:'none',
                position:'absolute',
                'margin-left':'-8px',
                right:0,
                height:'16px',
                width:'16px',
                'z-index':'10',
                top:0,
                background: linb.UI.getCSSImgPara('icon.gif', ' no-repeat -33px 0', null, 'linb.UI.Public')
            },
            BOTTOM:{
                cursor:'pointer',
                display:'none',
                position:'absolute',
                'margin-left':'-8px',
                right:0,
                height:'16px',
                width:'16px',
                'z-index':'10',
                bottom:0,
                background: linb.UI.getCSSImgPara('icon.gif', ' no-repeat -33px -17px', null, 'linb.UI.Public')
            },
            ICON:{
                cursor:'pointer',
                width:'16px',
                height:'16px',
                margin:'0 4px 0 0'
            },
            CAPTION:{
                'vertical-align':'bottom',
                'padding-left':'2px'
            },
            RULER:{
                width:'100px',
                'font-size':0,
                'line-height':0
            },
            ADD:{
                'font-family': '"Verdana", "Helvetica", "sans-serif"',
                'font-size':'11px',
                position:'absolute',
                top:'2px',
                right:0,
                width:'80px',
                padding:'2px 20px 2px 2px',
                'text-align':'right',
                'z-index':'10'
            },
            SUB:{
                position:'absolute',
                top:'4px',
                right:0,
                width:'8px',
                height:'16px',
                background: linb.UI.getCSSImgPara('icon.gif', ' no-repeat left -16px', null, 'linb.UI.Public')
            }
        }},
        Behaviors:{'default':{
            ITEM:{
                onMouseover:function(profile, e, src){
                    //for stop second trigger by focus event
                    if(profile.$highLight == src)return;

                    var properties = profile.properties,
                        item = profile.getItemByDom(src),
                        itemId = item.id;
                    var Cancel = false;
                    //if sub pop
                    if(profile.$subPopMenuShowed){
                        //if itself sub
                        if(profile.$subPopMenuShowed == profile.$allRelatedPopMenus[itemId])
                            Cancel=true;
                        //if others sub
                        else{
                            profile.$subPopMenuShowed.hide();
                            profile.$subPopMenuShowed = null;
                        }
                    }
                    if(!Cancel){
                        if(profile.$highLight)
                            profile.removeTagClass('ITEM', '-mouseover', linb([profile.$highLight],false));
                        profile.$highLight = src;
                        profile.addTagClass('ITEM', '-mouseover', linb([profile.$highLight],false));
                        //don't fire events here
                        src.focus();
                    }

                    if(!Cancel && item.sub){
                        var pop;
                        profile.$allRelatedPopMenus = profile.$allRelatedPopMenus || {};

                        //no create
                        if(!(pop = profile.$allRelatedPopMenus[itemId])){
                            pop = (new linb.UI.PopMenu({position:'absolute', items:item.sub, hoverActive:profile.properties.hoverActive})).create(true);
                            pop.onMenuSelected(function(pro, id, item, src){
                                profile.boxing().onMenuSelected(profile, id, item, src);
                            });
                            //set pool to parent
                            pop.get(0).$hideMenuPool = profile.$hideMenuPool || profile.getSubNode('POOL');

                            profile.$allRelatedPopMenus[itemId] = pop;

                            //collect
                            profile.$showpops = profile.$showpops || [profile];
                            pop.get(0).$showpops = profile.$showpops;
                            profile.$showpops.push(pop.get(0));
                        }
                        //input a copy of root for group trigger
                        profile.$groupPopMenu.push(pop.get(0).root.get(0));
                        pop.get(0).$groupPopMenu = profile.$groupPopMenu;


                        //set parent pop
                        pop.get(0).$parentPopMenu = profile;
                        profile.$childPopMenu = pop.get(0);

                        pop.pop(src, null, 2);
                        profile.$subPopMenuShowed = pop;
                    }
                },
                onMouseout:function(profile, e, src){
                    var properties = profile.properties,
                        item = profile.getItemByDom(src),
                        itemId = item.id;
                    var action = true;
                    //if cursor move to submenu, keep the hover face
                    if(profile.$subPopMenuShowed){
                        var node = e.toElement||e.relatedTarget;
                        var target = profile.$subPopMenuShowed.get(0).root.get(0);
                        try{
                            do{
                                if(node==target)
                                    return;
                            }while((node && (node=node.parentNode)))
                        }catch(a){}
                    }
                    profile.removeTagClass('ITEM', '-mouseover', linb([src],false));
                    profile.$highLight = null;
                },
                onClick:function(profile, e, src){
                    var properties = profile.properties,
                        item = profile.getItemByDom(src),
                        itemId = item.id;

                    if(item.sub){
                    }else{
                        profile.boxing().onMenuSelected(profile, item.id, item, src);
                        profile.removeTagClass('ITEM','-mouseover',linb(this));

                        //hide all parent pop
                        var p=profile,q;
                        while(p){
                            p.boxing().hide();
                            p=(q=p).$parentPopMenu;
                            q.$parentPopMenu = q.$subPopMenuShowed = null;
                        }

                        //reset
                        profile.$subPopMenuShowed = null;
                        profile.$groupPopMenu.length=0;
                    }
                    return false;
                },
                onFocus:function(profile, e, src){
                    var box = profile.getSubNode('BOX'),
                    top=box.scrollTop(), h=box.scrollHeight(),
                    n = linb(src).offsetTop();

                    if(n<top || n>top+h)
                        linb(src).offsetTop(top);

                    linb(src).onMouseover();
                },
                onKeydown : function(profile, e, src){
                    var item = profile.getItemByDom(src),
                        items = profile.properties.items,
                        itemId = item.id,flag,r,tid,node;

                    var t,key = linb.event.getKey(e)[0];
                    switch(key){
                        case 'up':
                            r=true;
                            flag=false;
                            items.each(function(o,i){
                                if(o.type == 'split')return;
                                if(flag){
                                    tid=o.id;
                                    return r=false;
                                }
                                if(o.id == itemId)flag=true;
                            },null,true);
                            //last
                            if(r)tid=items[items.length-1].id;
                            node = profile.getSubNodeByItemId('ITEM', tid).get(0);
                            if(node)node.focus();
                            break;
                        case 'down':
                            r=true;
                            flag=false;
                            items.each(function(o,i){
                                if(o.type == 'split')return;
                                if(flag){
                                    tid=o.id;
                                    return r=false;
                                }
                                if(o.id == itemId)flag=true;
                            });
                            //first
                            if(r)tid=items[0].id;
                            node = profile.getSubNodeByItemId('ITEM', tid).get(0);
                            if(node)node.focus();
                            break;
                        case 'left':
                            if(t=profile.$parentPopMenu){
                                if(t=profile.$parentPopMenu.$highLight)
                                    node = t;
                            }
                            if(node)node.focus();
                            break;
                        case 'right':
                            if((t=profile.$subPopMenuShowed) && t == profile.$allRelatedPopMenus[itemId])
                                t.activate();
                            break;
                    }

                }
            },
            TOP:{
                onMouseover:function(profile, e, src){
                    profile.$scrollToTop=true;
                    profile.boxing().scrollToTop();
                },
                onMouseout:function(profile, e, src){
                    profile.$scrollToTop=false;
                    profile.$scrollStep=null;
                },
                onClick:function(profile, e, src){
                    profile.$scrollStep=1000;
                }
            },
            BOTTOM:{
                onMouseover:function(profile, e, src){
                    profile.$scrollTobottom=true;
                    profile.boxing().scrollToBottom();
                },
                onMouseout:function(profile, e, src){
                    profile.$scrollTobottom=false;
                    profile.$scrollStep=null;
                },
                onClick:function(profile, e, src){
                    profile.$scrollStep=1000;
                }
            },
            ITEMS:{
                beforeKeydown:function(profile, e){
                    var key=linb.event.getKey(e)[0];
                    if(key=='tab' || key=='enter')
                        return true;
                    else if(/^\w$/.test(key)){
                        profile._wordcache = profile._wordcache ||'';
                        profile._wordcache += key;
                        clearTimeout(profile._wordcachetimeout);

                        var arr = profile.properties.items;
                        arr.each(function(o,i){
                            if(o.caption.toLowerCase().startWith(profile._wordcache)){
                                profile.getSubNodeByItemId('ITEM', o.id).focus();
                                return false;
                            }
                        });

                        profile._wordcachetimeout = _.asyRun(function(){profile._wordcache=''},300);
                    }else if(key=='esc'){
                        profile.boxing().onCancelled(profile);
                        //top
                        do{
                            profile.boxing().hide();
                        }while(profile = profile.$parentPopMenu)

                        return false;
                    }else return false;
                }
            },
            BORDER:{
                onMouseout:function(profile, e, src){
                    if(profile.properties.hoverActive){
                        var p1=linb.event.getPos(e),
                            size, p2, b;
                        profile.$groupPopMenu.each(function(o){
                            o=linb([o]);
                            p2=o.absPos();
                            size=o.cssSize();
                            if(p1.left>p2.left && p1.top>p2.top && p1.left<p2.left+size.width && p1.top<p2.top+size.height)
                                return b=1;
                        });
                        if(!b){
                            while(b=profile.$parentPopMenu)profile=b;
                            profile.boxing().hide();
                            profile.$groupPopMenu.length=0;
                        }
                    }
                }
            },
        }},
        DataModel:({
            dataField:null,
            dataBinder:null,
            dock:null,
            tabindex:null,
            tips:null,
            icon:null,
            iconPos:null,
            caption:null,
            border:null,

            $fix:true,
            shadow:true,
            resizable:false,
            maxHeight:500,
            maxWidth:300,
            height:100,
            left:-10000,

            hoverActive:false,

            //opera needs more space for initialize
            width:300,
            position:'absolute',
            $border:1
        }),
        EventHandlers:{
            beforeNextFocus:null,

            onCancelled:function(profile){},
            onMenuSelected:function(profile, id, item, src){},
            onHide:function(profile){}
        },
        renderedTrigger:function(){
            this.boxing().adjustSize();
        },

        prepareItem:function(profile, item){
            item.add = item.add || '';
            item.displayAdd = item.add?'':'display:none';
            item.tagClass = item.sub?'':'display:none';

            item.type=item.type||'button';
        },

        resize:function(profile,w,h){
            var size = arguments.callee.upper.apply(this,arguments);
            profile.getSubNode('BOX').cssSize(size);
            /*
            var v=profile.getSubNode('BOX'),
            o = profile.getSubNode('BORDER');
            if(!_.isNull(w)){
                v.width(o.width());
            }
            if(!_.isNull(h)){
                v.height(o.height());
            }*/
        }

    }
});
