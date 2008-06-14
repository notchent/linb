Class("linb.UI.Layout",["linb.UI.iList", "linb.UI.iWidget", "linb.UI.iContainer"],{
    Instance:{
        getPanel:function(id){
            return this.get(0).getSubNodeByItemId('PANEL', id);
        },
        attach:function(ui, id){
            var self=this, profile=self.get(0);
            //memory link
            self.appendChild(ui, id||'main');

            if(profile.domNode){
                //default to main
                if(!profile.getSubSerialIdByItemId(id))
                    id='main';
                self.getPanel(id).attach(ui);
            }
            return self;
        }
    },
    Static:{
        cssNone:false,
        Dropable:['PANEL'],
        Templates:{'default':{
            tagName:'div',
            style:'{_style}',
            text:"{items}",
            $dynamic:{
                items:{
                    ITEM:{
                        tagName:'div',
                        className:'{cls1} ',
                        style:'{size}',
                        MOVE:{
                            $order:0,
                            tagName:'div',
                            className:'{cls2} ',
                            style:'{display}'
                        },
                        CMD:{
                            $order:1,
                            tagName:'div',
                            style:'{cmdDisplay}',
                            className:'{cls3} '
                        },
                        PANEL:{
                            tagName:'div',
                            style:'position:absolute;left:0;top:0;',
                            text:linb.UI.$childTag
                        }
                    }
                }
            }
        }},
        Appearances:{'default':{
            KEY:{
                position:'absolute',
                overflow:'hidden',
                left:0,
                top:0,
                'font-size':linb.browser.ie?0:'',
                'line-height':linb.browser.ie?0:''
            },
            MOVE:{
                $order:0,
                position:'absolute',
                'background-color':'#f4f4f4',
                'z-index':'10',
                'font-size':linb.browser.ie?0:'',
                'line-height':linb.browser.ie?0:''
            },
            'MOVE-mouseover':{
                $order:1,
                'background-color':'#f8f8f8'
            },
            CMD:{
                position:'absolute',
                border:'solid 1px #cdcdcd',
                cursor:'pointer',
                'z-index':'20',
                'font-size':linb.browser.ie?0:'',
                'line-height':linb.browser.ie?0:''
            },
            ITEM:{
                position:'absolute',
                overflow:'hidden',
                'background-color':'#fff',
                'border-width':linb.browser.opr?'0px':'',
                'font-size':linb.browser.ie?0:'',
                'line-height':linb.browser.ie?0:''
            },
            PANEL:{
                position:'absolute',
                overflow:'hidden',
                /*for opera, opera defalut set border to 3 ;( */
                'border-width':linb.browser.opr?'0px':'',
                'font-size':linb.browser.ie?0:'',
                'line-height':linb.browser.ie?0:''
            },
            'ITEM-MAIN':{
                left:0,
                right:0,
                top:0,
                bottom:0
            },
            'ITEM-TOP, ITEM-BOTTOM':{
                left:0,
                right:0
            },
            'ITEM-LEFT, ITEM-RIGHT':{
                top:0,
                bottom:0
            },
            'MOVE-TOP':{
                'border-top':'solid 1px #cdcdcd',
                'border-bottom':'solid 1px #cdcdcd',
                width:'100%',
                bottom:0,
                height:'4px',
                cursor:'n-resize'
            },
            'MOVE-BOTTOM':{
                'border-top':'solid 1px #cdcdcd',
                'border-bottom':'solid 1px #cdcdcd',
                width:'100%',
                top:0,
                height:'4px',
                cursor:'n-resize'
            },
            'MOVE-LEFT':{
                'border-left':'solid 1px #cdcdcd',
                'border-right':'solid 1px #cdcdcd',
                height:'100%',
                right:0,
                width:'4px',
                cursor:'w-resize'
            },
            'MOVE-RIGHT':{
                'border-left':'solid 1px #cdcdcd',
                'border-right':'solid 1px #cdcdcd',
                height:'100%',
                left:0,
                width:'4px',
                cursor:'w-resize'
            },
            'MOVE-TOP-checked, MOVE-BOTTOM-checked, MOVE-LEFT-checked, MOVE-RIGHT-checked':{
                $order:1,
                'background-color':'#cdcdcd'
            },
            'CMD-TOP':{
                $order:0,
                left:'50%',
                'margin-left':'-15px',
                bottom:0,
                width:'30px',
                height:'4px',
                background: linb.UI.getCSSImgPara('icon.gif', ' no-repeat left -52px', null, 'linb.UI.Public')
            },
            'CMD-TOP-mouseover, CMD-BOTTOM-mouseover, CMD-LEFT-mouseover, CMD-RIGHT-mouseover':{
                $order:1,
                'background-color':'#ffff00'
            },
            'CMD-TOP-mouseover, CMD-BOTTOM-mouseover, CMD-LEFT-mouseover, CMD-RIGHT-mouseover':{
                $order:2,
                'background-color':'#ffff00'
            },
            'CMD-BOTTOM':{
                $order:0,
                left:'50%',
                'margin-left':'-15px',
                top:0,
                width:'30px',
                height:'4px',
                background: linb.UI.getCSSImgPara('icon.gif', ' no-repeat left -60px', null, 'linb.UI.Public')
            },
            'CMD-LEFT':{
                $order:0,
                top:'50%',
                'margin-top':'-15px',
                right:0,
                height:'30px',
                width:'4px',
                background: linb.UI.getCSSImgPara('icon.gif', ' no-repeat -84px 0px', null, 'linb.UI.Public')

            },
            'CMD-RIGHT':{
                $order:0,
                top:'50%',
                'margin-top':'-15px',
                left:0,
                height:'30px',
                width:'4px',
                background: linb.UI.getCSSImgPara('icon.gif', ' no-repeat -92px -0px', null, 'linb.UI.Public')

            },
            'MOVE-MAIN':{
                $order:5,
                display:'none'
            },
            'CMD-MAIN':{
                $order:5,
                display:'none'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{MOVE:'MOVE',CMD:'CMD'},
            onRewh:function(profile, e, src){
                var o=profile.root;
                profile.box.resize(profile, e.width?o.width():null, e.height?o.height():null);
            },
            MOVE:{
                onMousedown:function(profile, e, src){
                    var id=src.id,
                        itemId = profile.getSubSerialId(id),
                        item = profile.getItemByDom(src);
                    if(item.hide)return;

                    var main = profile.getItemByItemId('main'),
                        o=profile.getSubNode('ITEM', itemId),
                        m=profile.getSubNodeByItemId('ITEM', 'main'),
                        cursor=linb([src]).cursor(),
                        t=profile.properties,
                        h,w,mh,mw,offset1,offset2;

                    profile.pos=item.pos;

                    if(t.type=='vertical'){
                        h = profile._cur = o.height();
                        mh = m.height();
                        if(item.pos=='before'){
                            offset1 = h - item.min;
                            offset2 = item.max?Math.min(parseInt(item.max)-h, (mh-main.min)):(mh-main.min);
                        }else{
                            offset1 = item.max?Math.min(parseInt(item.max)-h, (mh-main.min)):(mh-main.min);
                            offset2 = h - item.min;
                        }

                        linb([src]).startDrag(e,{
                            type:'copy',
                            move:false,
                            target_clone:false,
                            vertical:true,
                            offset_top:offset1,
                            offset_bottom:offset2,
                            cursor:cursor
                        });
                    }else{
                        w = profile._cur = o.width();
                        mw = m.width();
                        if(item.pos=='before'){
                            offset1 = w - item.min;
                            offset2 = item.max?Math.min(parseInt(item.max)-w, (mw-main.min)):(mw-main.min);
                        }else{
                            offset1 = item.max?Math.min(parseInt(item.max)-w, (mw-main.min)):(mw-main.min);
                            offset2 = w - item.min;
                        }

                        linb([src]).startDrag(e,{
                            type:'copy',
                            move:false,
                            target_clone:false,
                            horizontal:true,
                            offset_left:offset1,
                            offset_right:offset2,
                            cursor:cursor
                        });
                    }

                    profile._limited=0;
                },
                onDrag:function(profile, e, src){
                    var t=profile.properties,
                        d=linb.dragDrop,
                        b=0;
                    if(t.type=='vertical'){
                        if((d.y<=d.limit_top) || (d.y>=d.limit_bottom))b=true;
                    }else{
                        if(d.x<=d.limit_left || d.x>=d.limit_right)b=true;
                    }

                    if(b){
                        if(!profile._limited){
                            profile._bg=d.proxyIn.getStyle('backgroundColor');
                            d.proxyIn.setStyle('backgroundColor','#ff6600');
                            profile._limited=true;
                        }
                    }else{
                        if(profile._limited){
                            d.proxyIn.setStyle('backgroundColor',profile._bg);
                            profile._limited=0;
                        }
                    }

                },
                onDragstop:function(profile, e, src){
                    var t=profile.properties,
                        o=linb([src]).parent(),
                        r=profile.root,
                        item = profile.getItemByDom(src);

                    //add offset and refresh
                    if(t.type=='vertical'){
                        //use size to ignore onresize event once
                        o.height(item.size =  profile._cur + (profile.pos=='before'?1:-1)*linb.dragDrop.getOffset().y);
                        profile.box.resize(profile,null,r.height());
                    }else{
                        o.width(item.size = profile._cur + (profile.pos=='before'?1:-1)*linb.dragDrop.getOffset().x);
                        //use size to ignore onresize event once
                        profile.box.resize(profile,r.width(),null);
                    }
                    profile._limited=0;
                }
            },
            CMD:{
                onMousedown:function(profile, e, src){
                    var t=profile.properties,
                        id=src.id,
                        self=linb([src]),
                        itemId = profile.getSubSerialId(id),
                        item = profile.getItemByDom(src),
                        r=profile.root,
                        main = profile.getItemByItemId('main'),
                        m=profile.getSubNodeByItemId('ITEM', 'main'),
                        o = profile.getSubNode('ITEM',itemId),
                        panel = profile.getSubNode('PANEL',itemId),
                        move = profile.getSubNode('MOVE',itemId);

                    if(t.type=='vertical'){
                        // restore resize mode
                        if(item.hide){
                            if(item.size <= m.height() - main.min + t._handlerSize){
                                //restore h
                                o.height(item.size);
                                panel.show();

                                item.hide=false;
                                //set appearance
                                if(item.pos=='before')
                                    self.reClass(/bottom/g,'top');
                                else
                                    self.reClass(/top/g,'bottom');

                                //hidden 'move'
                                if(!item.locked)move.cursor('n-resize');
                                profile.removeTagClass('MOVE','-checked');
                            }else
                                linb.message('no enough space!');
                        // to min and fix mode
                        }else{
                            o.height(t._handlerSize);
                            panel.hide();

                            item.hide=true;
                            if(item.pos=='before')
                                self.reClass(/top/g,'bottom');
                            else
                                self.reClass(/bottom/g,'top');

                            if(!item.locked)
                                move.cursor('default');
                            profile.addTagClass('MOVE','-checked');
                        }
                        profile.box.resize(profile,null,r.height());
                    }else{
                        if(item.hide){
                            if(item.size <= m.width()-main.min + t._handlerSize){
                                o.width(item.size);
                                panel.show();
                                item.hide=false;
                                if(item.pos=='before')
                                    self.reClass(/right/g,'left');
                                else
                                    self.reClass(/left/g,'right');

                                if(!item.locked)move.cursor('w-resize');
                                profile.removeTagClass('MOVE','-checked');
                            }else
                                linb.message('no enough space!');
                        }else{
                            o.width(t._handlerSize);
                            panel.hide();
                            item.hide=true;
                            if(item.pos=='before')
                                self.reClass(/left/g,'right');
                            else
                                self.reClass(/right/g,'left');


                            if(!item.locked)
                                move.cursor('default');
                            profile.addTagClass('MOVE','-checked');
                        }
                        profile.box.resize(profile,r.width(),null);
                    }

                    return false;
                }
            }
        }},
        DataModel:{
            dataBinder:null,
            dataField:null,
            value:null,
            disabled:null,
            position:'absolute',
            type:{
                listbox:['vertical', 'horizontal'],
                ini:'vertical',
                action:function(value, ovalue){
                    if(value != ovalue){
                        var self=this,
                        nodes2 = self.getSubNode('ITEM',true),
                        nodes1 = self.getSubNode('MOVE',true),
                        nodes3 = self.getSubNode('CMD',true);
                        nodes1.add(nodes2).add(nodes3);

                        if(value=='vertical'){
                            nodes1.reClass(/(-left)(\b)/ig,'-top$2');
                            nodes1.reClass(/(-right)(\b)/ig,'-bottom$2');
                            nodes2.each(function(o){
                                linb(o).height(linb(o).width());
                            })
                            .left(0)
                            .right('auto')
                            .top('auto')
                            .bottom('auto')
                            ;
                        }else{
                            nodes1.reClass(/(-top)(\b)/ig,'-left$2');
                            nodes1.reClass(/(-bottom)(\b)/ig,'-right$2');
                            nodes2.each(function(o){
                                linb(o).width(linb(o).height());
                            })
                            .top(0)
                            .bottom('auto')
                            .left('auto')
                            .right('auto')
                            ;

                        }

                        var size = self.root.cssSize();
                        self.box.resize(self, size.width, size.height);
                    }
                }
            },
            dock:'fill',
            listKey:null,
            width:200,
            height:200,
            _handlerSize:6,

            items:{
                ini:{},
                set:function(v){
                    return this.each(function(o){
                        if(o.domNode){
                            var box = o.boxing(),
                                temp = linb.dom.getMatix(),
                                //keep children
                                children = _.copy(o.children),
                                p
                            ;
                            o.children.length=0;
                            _.arr.each(children,function(o){
                                //for flush dock
                                delete o[0].$dockParent;
                                //keep it in dom
                                temp.addLast(o[0].root);
                            });

                            //bak value

                            //clear all
                            box.clearItems();
                            //call gc to clear onresize setting
                            linb.dom.$gc();

                            //set items
                            //for adjust 'main'
                            v = o.box.prepareDefaultValue(o, v);
                            //inset items
                            box.insertItems(v);

                            //restore children
                            _.arr.each(children,function(v){
                                box.attach.apply(box,v);
                            });

                            //clear
                            temp.empty();
                            //set value

                            //resize
                            var size = o.root.cssSize();
                            o.box.resize(o, size.width, size.height);
                        }else
                            o.properties.items = v;
                    });
                }
            }
        },
        EventHandlers:{
            beforeValueSet:null,
            afterValueSet:null,
            beforeValueUpdated:null,
            afterValueUpdated:null,
            beforeHoverEffect:null,
            beforeClickEffect:null,
            beforeNextFocus:null
        },
        prepareDefaultValue:function(profile, items){
            var main, before=[], after=[];
            //arrage items
            _.arr.each(items,function(o){
                if(o.id=='main'){
                    main=o
                }else{
                    if(o.pos=='before')
                        before.push(o);
                    else
                        after.push(o);
                }
            });

            main = main || {};
            main.id = 'main';
            main.min = main.min || 10;

            //reset items
            items.length = 0;
            _.arr.insertAny(items, before,0);
            _.arr.insertAny(items, main);
            _.arr.insertAny(items, after);

            //set the items to default value
            _.arr.each(items,function(o){
                o.id = _.isStr(o.id)?o.id:profile.$id+':'+_.id();
                o.min = o.min || 10;
                if(o.id!='main'){
                    o.size = parseInt(o.size) || 20;
                    o.locked=_.bool(o.locked,false);
                    o.hide=_.bool(o.hide,false);
                    o.cmd = _.bool(o.cmd, true);
                }
            });
            return items;
        },
        prepareData:function(profile){
            var prop=profile.properties;
            if(!prop.items || prop.items.constructor != Array)
            prop.items = _.clone([
                {id:'before', pos:'before', locked:false, size:60, min: 50, max:200},
                {id:'after',pos:'after', locked:false, size:60, min: 50, max:200}
            ]);

            profile.properties.items = this.prepareDefaultValue(profile, profile.properties.items);
            arguments.callee.upper.call(this, profile);
        },
        prepareItem:function(profile, item){
            if(item.id=='main'){
                item.cls1=profile.getClass('ITEM', '-main');
                item.cls2  = profile.getClass('MOVE', '-main');
                item.cls3  = profile.getClass('CMD', '-main' );
                return;
            }

            if(profile.properties.type=='vertical')
                item.size = 'height:'+item.size+'px';
            else
                item.size = 'width:'+item.size+'px';

            var pos;
            if(profile.properties.type=='vertical'){
                if(item.pos=='before')
                    pos='top';
                else
                    pos='bottom';
            }else{
                if(item.pos=='before')
                    pos='left';
                else
                    pos='right';
            }

            item.cls1  = profile.getClass('ITEM', '-' + pos );
            item.cls2  = profile.getClass('MOVE', '-' + pos );
            item.cls3  = profile.getClass('CMD', '-' + pos );
            item.display = item.locked?'display:none':'';
            item.cmdDisplay = item.cmd?'':'display:none';
        },
        createdTrigger:function(){
            var t, profile=this;
            _.arr.each(profile.properties.items,function(item){
                if(item.id!='main'){
                    if(item.hide && (t=profile.getSubSerialIdByItemId(item.id))){
                            item.hide=false;
                            profile.getSubNode('CMD',t).onMousedown();
                        }
                }
            });
        },
        resize:function(profile,w,h){
            var _t,t=profile.properties, m,n, itemId, temp1,temp2,temp, key=profile.keys.ITEM, panel=profile.keys.PANEL;

            var obj={}, obj2={};
            _.arr.each(t.items,function(o){
                itemId = profile.getSubSerialIdByItemId(o.id);
                obj[itemId] = {};
                obj2[itemId] = {};
            });
            if(t.type!='vertical'){
                if(!_.isNull(w)){
                    //get left
                    temp=temp1=temp2=0;
                    _.arr.each(t.items,function(o){
                        if(o.id=='main')return;
                        itemId = profile.getSubSerialIdByItemId(o.id);
                        if(o.pos=='before'){
                            n=profile.getSubNode('ITEM', itemId);
                            m= n.width();//offsetWidth();

                            obj2[itemId].left=temp1;
                            temp1 +=m;
                            obj2[itemId].right='auto';
                            obj[itemId].right='auto';
                            obj[itemId].left=0;
                            obj[itemId].width = m - (o.locked?0:t._handlerSize);
                        }
                    });
                    _.arr.each(t.items,function(o){
                        if(o.id=='main')return;
                        itemId = profile.getSubSerialIdByItemId(o.id);
                        if(o.pos=='after'){
                            n =profile.getSubNode('ITEM', itemId);
                            m= n.width();//offsetWidth();

                            obj2[itemId].right=temp2;
                            temp2 +=m;
                            obj2[itemId].left='auto';
                            obj[itemId].right=0;
                            obj[itemId].left='auto';
                            obj[itemId].width = m-(o.locked?0:t._handlerSize);
                        }
                    },null,true);
                    temp = temp1+temp2;

                    //set main
                    //specify widht/height first,
                    if(w-temp>=0){
                        _t=profile.getSubSerialIdByItemId('main');
                        obj[_t].width=w-temp;
                        obj2[_t].width=w-temp;
                        obj2[_t].left=temp1;
                    }
                }
                if(!_.isNull(h)){
                    _.each(obj,function(o,id){
                        o.height=h;
                        obj2[id].height=h;
                    });
                }
            }else{
                if(!_.isNull(h)){
                    //get top
                    temp=temp1=temp2=0;
                    _.arr.each(t.items,function(o){
                        if(o.id=='main')return;
                        itemId=profile.getSubSerialIdByItemId(o.id);
                        if(o.pos=='before'){
                            n=profile.getSubNode('ITEM', itemId);
                            m = n.height();//offsetHeight();

                            obj2[itemId].top=temp1;
                            temp1 += m;
                            obj2[itemId].bottom='auto';
                            obj[itemId].top=0;
                            obj[itemId].bottom='auto';
                            obj[itemId].height=m-(o.locked?0:t._handlerSize);
                        }
                    });
                    _.arr.each(t.items,function(o){
                        if(o.id=='main')return;
                        itemId=profile.getSubSerialIdByItemId(o.id);
                        if(o.pos=='after'){
                            n=profile.getSubNode('ITEM', itemId);
                            m=n.height();//offsetHeight();

                            obj2[itemId].bottom=temp2;
                            temp2 += m;
                            obj2[itemId].top='auto';
                            obj[itemId].bottom=0;
                            obj[itemId].top='auto';
                            obj[itemId].height=m-(o.locked?0:t._handlerSize);
                        }
                    },null,true);

                    temp =temp1+temp2;
                    //set main
                    if(h-temp>=0){
                        _t=profile.getSubSerialIdByItemId('main');

                        obj[_t].height=h-temp;
                        obj2[_t].height=h-temp;
                        obj2[_t].top=temp1;
                    }
                }
                if(!_.isNull(w)){
                    _.each(obj,function(o, id){
                        o.width=w;
                        obj2[id].width=w;
                    });
                }
            }
            //collect width/height in size
            _.each(obj, function(o, id){
                profile.getSubNode('PANEL', id).setRegion(o, true);
            });
            _.each(obj2, function(o, id){
                profile.getSubNode('ITEM', id).setRegion(o);
            });
        }
    }
});
