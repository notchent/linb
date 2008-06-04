Class("linb.UI.ColLayout",["linb.UI.iList", "linb.UI.iWidget", "linb.UI.iContainer"],{
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
        },
        //prepare pos/size data for dragDrop
        prepareDD:function(){
            var self=this,
                profile=self.get(0),
                p=profile.properties,
                root=profile.root,
                node=profile.getSubNode('PANEL',true),
                bpos=root.absPos(),
                size=root.cssSize(),
                cache=linb.cache.dom,
                w=0,h=0,ns,i,t,
                arr=[],
                a=[];
            profile._ddup=profile._ddid=profile._ddincol=profile._ddi==null;
            node.each(function(o){
                w=w+linb([o]).offsetWidth();
                arr.push([w,o.id]);
                //get panel's children
                ns=o.childNodes;
                h=0;
                a.push([]);
                for(i=0;t=ns[i];i++){
                    //ignore node without id/textNode/
                    if(!t.id || !cache[t.id] || !t.style || t.style.display=='none' || t.style.visibility=='hidden')continue;
                    h=h+t.offsetHeight;
                    a[a.length-1].push([h,t.id]);
                }
            });
            profile._possize = {pos:bpos, size:size, cols:arr, rows:a};
        },
        //check the current mouse position
        _checkpos:function(profile,pos,force,para){
            var o=profile._possize,
                change;
            //if(pos.left<o.pos.left || pos.top<o.pos.top || pos.left>o.pos.left+o.size.width || pos.top>o.pos.top+o.size.height){
            if(pos.left<o.pos.left || pos.top<o.pos.top || pos.left>o.pos.left+o.size.width){
                if(profile._ddid!==null || profile._ddincol!==null)
                    change=true;
                profile._ddup=profile._ddid=profile._ddincol=profile._ddi=null;
                if(change || force)
                    return [null];
                else
                    return;
            }
            var col,
                left = pos.left-o.pos.left,
                top = pos.top-o.pos.top,
                i=0,temp,
                t,to=0,
                arr;
            arr=o.cols;
            while(t=arr[i++]){
                if(left<t[0]){
                    if(profile._ddincol===t[1])
                        break;
                    change=true;
                    profile._ddi=i-1;
                    profile._ddincol=t[1];
                    //if col changed, clear row vars
                    profile._ddid=profile._ddup=null;
                    break;
                }
            }
            if(profile._ddi!==null){
                col=profile._ddincol;
                arr=o.rows[profile._ddi];
                i=0;
                while(t=arr[i++]){
                    if(top<t[0]){
                        //if raw changed, clear pos
                        if(profile._ddid!==t[1])
                            profile._ddup=null;
                        j=(top < (to+(t[0]-to)/2));
                        if(profile._ddid===t[1] && profile._ddup===j)
                            break;
                        profile._ddid=t[1];
                        profile._ddup=j;
                        change=true;
                        break;
                    }
                    to=t[0];
                }
                if(change|| force)
                    return [col,profile._ddid,profile._ddup];
            }else{
                if(change || force)
                    return [null];
                else
                    return;                
            }
        },
        _showProxy:function(profile,type,node,height){
             var self=this,
                 proxy= profile._proxy || (profile._proxy=linb.create('<div style="border:1px dashed #FF0000;">'));
             proxy.height(height||20);
             if(node.isEmpty())return;
             if(type===1)
                node.addLast(proxy);
             else if(type===2)
                node.addPre(proxy);
             else
                node.addNext(proxy);
        },
        _hideProxy:function(profile){
            if(profile._proxy){
                profile._proxy.remove();
                delete profile._proxy;
            }
        },
        //
        doDrag:function(pos,height){
            var self=this,
                profile=self.get(0),
                rst=self._checkpos(profile,pos),
                col,row;
            if(rst){
                col=rst[0];
                row=rst[1];
                rowup=rst[2];
                if(col){
                    if(row)
                        self._showProxy(profile, rowup?2:3, linb(row),height );
                    else
                        self._showProxy(profile, 1, self.getSubNode('PANEL',profile.getSubSerialId(col)),height );
                }else
                    self._hideProxy(profile);
            }
        },
        doDrop:function(pos, data){
            var self=this,
                profile=self.get(0),
                rst=self._checkpos(profile,pos,true);
            self._hideProxy(profile);
            if(rst && rst[0]){
                self.onDropItem(profile, rst, data);
                return true;
            }return false;
        }
    },
    Static:{
        Dropable:['KEY'],
        cssNone:false,
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
                'border-width':linb.browser.opr?'0':null,
                zoom:linb.browser.ie6?1:null
            },
            MOVE:{
                $order:0,
                position:'relative',
                'float':'right',
                width:'4px',
                height:'200px',
                cursor:'e-resize',
                'background-color':'#f4f4f4',
                'border-width':linb.browser.opr?'0':null,
                'font-size':linb.browser.ie?0:'',
                'line-height':linb.browser.ie?0:''
            },
            'MOVE-mouseover':{
                $order:1,
                'background-color': '#f0f0f0'
            },
            ITEM:{
                position:'static',
                'float':'left',
                overflow:'hidden',
                'background-color':'#fff',
                'border-width':'0',
                'font-size':linb.browser.ie?0:'',
                'line-height':linb.browser.ie?0:''
            },
            PANEL:{
                position:'static',
                overflow:'hidden',
                zoom:linb.browser.ie6?1:null,
                /*for opera, opera defalut set border to 3 ;( */
                'border-width':linb.browser.opr?'0':null,
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
                    if(off<0){
                        profile._pre.width(profile._preW+off);
                        profile._next.width(profile._nextW-off);
                    }else{
                        profile._next.width(profile._nextW-off);
                        profile._pre.width(profile._preW+off);
                    }
                },
                onDragstop:function(profile, e, src){
                    if(profile._limited){
                        src.style.backgroundColor = profile._bg;
                        profile._limited=0;
                    }
                    var arr=profile.getSubNode('ITEM',true).get(),
                        a=[],t,l=0,k;
                    
                    arr.each(function(o,i){
                        if(i==arr.length-1)k=l;
                        l = l + (a[i]=linb([o]).offsetWidth());
                    });
                    if(linb.browser.ie||linb.browser.gek)
                        l=src.parentNode.parentNode.offsetWidth;
                    a[arr.length-1]=l-k-2;

                    arr.each(function(o,i){
                        o.style.width = parseInt(a[i]/l*100000)/1000 + '%';
                    });
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
            minWidth:150,
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
            beforeNextFocus:null,
            onDropItem:function(profile, rst){}
        },
        prepareData:function(profile){
            var i=profile.properties.items;
            if(!i || i.constructor != Array || !i.length)
                i = profile.properties.items = _.clone([
                    {id:'1',width:'30.3%'},
                    {id:'2',width:'30.3%'},
                    {id:'3',width:'39.2%'}
                ]);
            i[i.length-1]._display = 'display:none';
            arguments.callee.upper.call(this, profile);
        },
        createdTrigger:function(){
        }
    }
});
