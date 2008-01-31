Class("linb.UI.ColLayout",["linb.UI.iWidget", "linb.UI.iList", "linb.UI.iContainer"],{
    Instance:{
        getPanel:function(id){
            return this.get(0).getSubNodeByItemId('PANEL', id);
        },
        attach:function(ui,id){
            var self=this, profile=self.get(0),p=profile.properties,node;
            if(!id)
                id=p.$UIvalue||p.value;

            if(id){
                //first
                self.appendChild(ui, id);
                if(profile.domNode){
                    node=self.getPanel(id);
                    if(!node.isEmpty())
                        node.attach(ui);
                }
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
                        style:'width:{width}',
                        MOVE:{
                            tagName:'div',
                            style:'{_display}'
                        },
                        PANEL:{
                            tagName:'div',
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
                zoom:linb.browser.ie6?1:null
            },
            MOVE:{
                $order:0,
                position:'relative',
                'float':'right',
                width:'4px',
                height:'100px',
                cursor:'e-resize',
                'background-color':'#f4f4f4',
                'font-size':linb.browser.ie?0:'',
                'line-height':linb.browser.ie?0:''
            },
            'MOVE-mouseover':{
                $order:1,
                'background-color': '#f0f0f0'
            },
            ITEM:{
                position:'relative',
                'float':'left',
                overflow:'hidden',
                'background-color':'red',//'#fff',
                'border-width':linb.browser.opr?'0px':'',
                'font-size':linb.browser.ie?0:'',
                'line-height':linb.browser.ie?0:''
            },
            PANEL:{
                position:'relative',
                overflow:'hidden',
                'margin-right':'4px',
                /*for opera, opera defalut set border to 3 ;( */
                'border-width':linb.browser.opr?'0px':'',
                'font-size':linb.browser.ie?0:'',
                'line-height':linb.browser.ie?0:''
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{MOVE:'MOVE'},
            MOVE:{
                onMousedown:function(profile, e, src){
                    var pro=profile.properties,
                        min=pro.minWidth,
                        pre=profile._pre=linb([src.parentNode]),
                        preW=profile._preW=pre.offsetWidth(),
                        next=profile._next=pre.next(),
                        nextW=profile._nextW=next.offsetWidth(),
                        offset1 = preW-min,
                        offset2 = nextW-min;
                        if(offset1<0)offset1=0;
                        if(offset2<0)offset2=0;

                    linb([src]).startDrag(e,{
                        type:'copy',
                        move:false,
                        target_clone:false,
                        target_style:{background:"0"},
                        horizontal:true,
                        offset_left:offset1,
                        offset_right:offset2,
                        cursor:true
                    });
                },
                onDrag:function(profile, e, src){
                    var t=profile.properties,
                        d=linb.dragDrop,
                        off=d.getOffset().x,
                        b=0;
                    if(d.x<=d.limit_left || d.x>=d.limit_right)b=true;

                    if(b){
                        if(!profile._limited){
                            profile._bg=src.style.backgroundColor;
                            src.style.backgroundColor ='#ff6600';
                            profile._limited=true;
                        }
                        return;
                    }else{
                        if(profile._limited){
                            src.style.backgroundColor = profile._bg;
                            profile._limited=0;
                        }
                    }
                    profile._pre.width(profile._preW+off);
                    profile._next.width(profile._nextW-off);
                },
                onDragend:function(profile, e, src){
                    var d=linb.dragDrop,
                    off=d.getOffset().x;

                    if(profile._limited){
                        src.style.backgroundColor = profile._bg;
                        profile._limited=0;
                    }
                    var total = linb([src.parentNode.parentNode]).offsetWidth(),
                        style=profile._pre.get(0).style,
                        w1=profile._preW+off,
                        w2=profile._nextW-off,
                        w=((w1+w2)/total)*100;
alert(w1)
alert((w-w1)+'%')
                    w1=(w1/total)*100;
                    profile._pre.get(0).style.width=w1+'%';
                    profile._next.get(0).style.width=(w-w1)+'%';


alert(profile._pre.get(0).style.width)
alert(profile._next.get(0).style.width)

                }
            }
        }},
        DataModel:{
            dataBinder:null,
            dataField:null,
            value:null,
            disabled:null,
            position:'absolute',
            dock:'fill',
            listKey:null,
            width:200,
            height:200,
            minWidth:100,
            items:{
                ini:[],
                set:function(v){
                    return this.each(function(o){
                        if(o.domNode){
                            var box = o.boxing(),
                                temp = linb.dom.getMatix(),
                                //keep children
                                children = o.children.copy(),
                                p
                            ;
                            o.children.length=0;
                            children.each(function(o){
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
                            children.each(function(v){
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
        prepareData:function(profile){
            var i=profile.properties.items;
            if(!i || i.constructor != Array || !i.length)
                i = profile.properties.items = _.clone([
                    {id:'1',width:'30%'},
                    {id:'2',width:'30%'},
                    {id:'2',width:'39.6%'}
                ]);
            i[i.length-1]._display = 'display:none';
            arguments.callee.upper.call(this, profile);
        },
        createdTrigger:function(){
        }
    }
});
