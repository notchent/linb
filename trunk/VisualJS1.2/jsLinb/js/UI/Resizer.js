//resizer class, add a plug in to linb.dom
Class("linb.UI.Resizer","linb.UI.iWidget",{
    Instance:{
        //get Region for one/multi target
        getRegion:function(){
            var profile=this.get(0),
            target = profile._target,
            l,t,b,r,
            ll,tt,ww,hh,
            c=[];

            if(target){
                target._nodes.sort(function(x,y){
                    x=parseInt(x.style.zIndex)||0;
                    y=parseInt(y.style.zIndex)||0;
                    return x>y?1:x==y?0:-1;
                });

                target.each(function(o,i){
                    var o=linb([o]);
                    if(i===0){
                        l=o.offsetLeft();
                        t=o.offsetTop();
                        r=l+(ww=o.offsetWidth());
                        b=t+(hh=o.offsetHeight());
                        c.push([{left :l, top :t},{ width :ww, height :hh},o.id()]);
                    }else{
                        l=Math.min(l,ll=o.offsetLeft());
                        t=Math.min(t,tt=o.offsetTop());
                        r=Math.max(r,ll+(ww=o.offsetWidth()));
                        b=Math.max(b,tt+(hh=o.offsetHeight()));
                        c.push([{left :ll, top :tt},{ width :ww, height :hh},o.id()]);
                    }
                });
            }
            profile.regionBlocks = c;
            //ajust border
            _.arr.each(c,function(o){
                o[0].left -=l;//+1;
                o[0].top -=t;//+1;
                o[1].width-=2;
                o[1].height-=2;
            });
            return {l:l, t:t, b:b, r:r};
        },
        // reset position and size
        rePosSize:function(){
            var self=this;
            self.each(function(o){
                var t,
                    t1=o.root,
                    t2=o._target;
                if(!t2 || t2.isEmpty())return;
                if(!o.properties.child){
                    t = o.region=o.boxing().getRegion();
                    t1
                    .cssPos({left :t.l, top :t.t})
                    .offsetWidth(t.r-t.l)
                    .offsetHeight(t.b-t.t);
                }
                if(!o.regPool)o.regPool=linb([]);
                if(t=o.regions){
                    o.regPool.add(t);
                    t.display('none');
                }
                o.regions=linb([]);

                if(o.regionBlocks){
                    var t,fun=function(p,e){
                        var b = o.boxing(),
                            t = b.getTarget(),
                            key = linb.event.currentKey;
                        if(o.onRegionClick && false!==b.onRegionClick(o,e))
                            if(t.length()>1){
                                if(key && key[2]){
                                    t.minus(linb(this.tid));
                                    b.resetTarget(t);
                                }else
                                    b.focus(this.tid);
                            }
                    };
                    _.arr.each(o.regionBlocks,function(v){
                        if(o.regPool.length()){
                            t=o.regPool.pop();
                            linb(t).cssPos(v[0]).cssSize(v[1]);
                        }else{
                            t = _.str.toDom('<div style="position:absolute;border:dashed 1px blue;left:{l}px;top:{t}px;width:{w}px;height:{h}px;"></div>'
                            .replace('{l}',v[0].left)
                            .replace('{t}',v[0].top)
                            .replace('{w}',v[1].width)
                            .replace('{h}',v[1].height)
                            );
                            t.onClick(fun);
                            t=t.get(0)
                        }
                        o.regions.push(t);
                        t.tid=v[2];
                    });
                    o.root.addLast(o.regions.display('block'));
                }
            });
            self.focus();
            return self;
        },
        // get target
        getTarget:function(){
            return this.get(0)._target;
        },
        // reset target and refresh
        resetTarget:function(target,flag){
            var self=this,
                profile = self.get(0),
                rb = self.reBoxing(),
                ids;
            if(profile.properties.child)return;
            delete profile.$focus;

            if(target && !target.isEmpty()){
                profile._target = target;
                self.rePosSize();
                rb.zIndex(linb.dom.top_zIndex).display('block');
            }else{
                profile._target = linb([]);
                rb.zIndex(0).display('none');
            }
            if(target && !target.isEmpty()){
                ids=[];
                target.reBoxing('UI').each(function(o,i){
                    ids.push(o.$id);
                });
            }else
                ids=null;
            if(flag!==false)
                profile.boxing().onItemsSelected(profile, ids, profile.$id);

            return self;
        },
        attachTo:function(target, parent){
            var self=this, v=self.get(0);

            //set target first
            v._target= linb(target);
            v._parent= parent || linb(document.body);

            //add to dom
            v._parent.attach(self);

            self.resetTarget(v._target);

            v.$resizeId = linb(target).id();

            return self;
        },
        focus:function(id){
           var profile=this.get(0), index=-1;

           if(!profile.regions)return;
           profile.regions.border('dashed 1px blue');

           var arr = profile._target.get();

           if(id)index = _.arr.subIndexOf(arr,'id',id);
           if(index==-1 && profile.$focus !== undefined)index=profile.$focus;
           if(index==-1 && arr.length>1)index = arr.length-1;

           if(index!=-1){
                profile.regions.border('dashed 1px blue');
                linb([profile.regions.get(index)]).border('solid 1px red');

                profile.$focus=index;
                if(profile.onFocusChange)profile.boxing().onFocusChange(profile,index);
            }

           return this;
        },
        getFocus:function(){
            return this.get(0).$focus;
        },
        active:function(flag){
            return this.each(function(profile){
                profile.getSubNode('MOVE').setStyle('backgroundPosition','-17px top');
                profile.getSubNodes(['LT','T','RT','R','RB','B','LB','L'])
                .background(linb.browser.ie ? 'url('+linb.ini.path+'bg.gif)' : 'transparent');
                if(flag!==false)profile.boxing().onActive(profile);
            });
        },
        inActive:function(){
            return this.each(function(profile){
                if(profile.$onDrag)return;
                profile.getSubNode('MOVE').setStyle('backgroundPosition','-17px -17px');
                profile.getSubNodes(['LT','T','RT','R','RB','B','LB','L']).background('#808080');
            });
        },
        show:function(){
            this.each(function(o){
                o.root.display(o.$display||'block');
            });
            if(linb.browser.ie)
                this.reBoxing().ieTrigger();
            return this;
        },
        hide:function(){
            this.each(function(o){
                o.$display = o.root.display();
            });
            this.reBoxing().display('none');
            return this;
        }
    },
    Initialize:function(){
        this.mapKeys(['HANDLER','HIDDEN']);
        _.each({
            // add resizer to linb.dom plugin
            resizable:function(properties, target, onUpdate){
                properties=_.hash(properties);
                var o=this.get(0),
                    r = new linb.UI.Resizer(properties).attachTo(target, linb([o]));
                //set event
                if(onUpdate) r.onUpdate(onUpdate);
                return r;
            },
            unResizable:function(){
                var s = this.id();
                // for dom Node, destroy resizers
                _.arr.each(linb.UI.Resizer._cache,function(o){
                    if(o.$resizeId==s)
                        o.boxing().destroy();
                });
                return this;
            },
            isResizable:function(){
                // for dom
                var s = this.id(), b=false;
                // for dom Node, destroy shadows
                _.arr.each(linb.UI.Resizer._cache,function(o){
                    if(o.$resizeId==s){b=true;return false;}
                });
                return b;
            },
            getResizer:function(){
                // for dom
                var s = this.id(), b=null;
                // for dom Node, destroy shadows
                _.arr.each(linb.UI.Resizer._cache,function(o){
                    if(o.$resizeId==s){b=o;return false;}
                });
                return b.boxing();
            }
        },function(o,i){
            linb.dom.plugIn(i,o);
        });

        //for linb.UI.Widget
        _.each({
            _resize:function(key, args){
                return this.each(function(o){
                    var target = o.getSubNode('BORDER'),
                        d = o.properties;
                    if(target.isResizable())return;
                    args = args || {};
                    _.merge(args,{
                        child:true,
                        cover:true,
                        parent:target
                    },'without');

                    var update = function(pro, target, size, cssPos){
                        var profile=arguments.callee.profile,
                            node=profile.root,
                            prop=profile.properties,
                            t
                        ;
                        if(size){
                            var w=null,h=null;
                            if(t=size.width){
                                node.widthBy(t);
                                prop.width = w = node.width();
                            }
                            if(t=size.height){
                                node.heightBy(t);
                                prop.height = h = node.height();
                            }
                            profile.box.resize(profile,w,h);
                        }
                        if(cssPos){
                            if(t=cssPos.left){
                                node.leftBy(t);
                                prop.left= node.left();
                            }
                            if(t=cssPos.top){
                                node.topBy(t);
                                prop.top = node.top();
                            }
                        }
                    };
                    update.profile = o;

                    o.$resizer = target.resizable(args, target, update);
                });
            },
            _unResize:function(){
                return this.each(function(o){
                    var target = o.getSubNode('BORDER');
                    if(!target.isResizable())return;
                    target.unResizable();
                    delete o.$resizer;
                });
            }
        },function(o,i){
            linb.UI.Widget.plugIn(i,o);
        });
        linb.UI.Widget.setDataModel({
            resizable:{
                ini:false,
                action: function(v){
                    var b=this.boxing();
                    if(v){
                        var t = this.properties,
                            arg={};
                        _.merge(arg,t,'all',['minHeight', 'minWidth', 'maxHeight', 'maxWidth']);
                        b._resize(v,arg);
                    }else
                        b._unResize();
                }
            }
        });

    },
    Static:{
        Templates:{'default':{
            tagName:'div',
            style:'{_style}'
        }},
        Appearances:{'default':{
            KEY:{
                position:'absolute',
                margin:'0 -1px -1px 0',
                visibility: 'visible',
                '_font-size':0,
                '_line-height':0,

                //for ie
                '*background': 'url('+linb.ini.path+'bg.gif)',
                /*for get top Index, when it's static*/
                'z-index':60,
                cursor:'move'
            },
            MOVE:{
                position:'absolute',
                display:'block',
                'z-index':100,
                visibility: 'visible',
                background: linb.UI.getCSSImgPara('icon.gif', ' no-repeat -17px top', null, 'linb.UI.Public'),
                '_font-size':0,
                '_line-height':0
            },
            HANDLER:{
                $order:0,
                position:'absolute',
                display:'block',
                border:'solid 1px',
                //'background-color':'#fff',
                'z-index':100,
                visibility: 'visible',
                '_font-size':0,
                '_line-height':0
            },
            T:{
               $order:1,
               left:'50%',
               cursor: 'n-resize'
            },
            RT:{
               $order:1,
               cursor: 'ne-resize',
               'z-index': 110
            },
            R:{
               $order:1,
               top:'50%',
               cursor: 'e-resize'
            },
            RB:{
               $order:1,
                cursor: 'se-resize',
                'z-index': 110
            },
            B:{
               $order:1,
                left:'50%',
                cursor: 's-resize'
            },
            LB:{
               $order:1,
                cursor: 'sw-resize',
                'z-index': 110
            },
            L:{
               $order:1,
                top:'50%',
                cursor: 'w-resize'
            },
            LT:{
               $order:1,
                cursor: 'nw-resize',
                'z-index': 110
            },
            //must after HANDLER
            HIDDEN:{
                $order:10,
                'border-width': 0
            }
        }},
        Behaviors:{'default':{
            onClick:function(p){
                p.boxing().active();
            },
            onMousedown:function(profile, e, src){
                profile.box.onMousedown(profile, e, src, {move:true});
            },
            onDragbegin:function(profile, e, src){
                profile.box.onDragbegin(profile, e, src);
            },
            onDrag:function(profile, e, src){
                profile.box.onDrag(profile, e, src, {move:true});
            },
            onDragstop:function(profile, e, src){
                profile.box.onDragstop(profile, e, src, {move:true} );
            },
            LT:{
                onMousedown:function(profile, e, src){
                    profile.box.onMousedown(profile, e, src, {left:true, top:true});
                },
                onDragbegin:function(profile, e, src){
                    profile.box.onDragbegin(profile, e, src);
                },
                onDrag:function(profile, e, src){
                    profile.box.onDrag(profile, e, src, {left:true, top:true});
                },
                onDragstop:function(profile, e, src){
                    profile.box.onDragstop(profile, e, src, {left:true, top:true});
                }
            },
            RT:{
                onMousedown:function(profile, e, src){
                    profile.box.onMousedown(profile, e, src, {right:true, top:true});
                },
                onDragbegin:function(profile, e, src){
                    profile.box.onDragbegin(profile, e, src);
                },
                onDrag:function(profile, e, src){
                    profile.box.onDrag(profile, e, src, {right:true, top:true});
                },
                onDragstop:function(profile, e, src){
                    profile.box.onDragstop(profile, e, src, {right:true, top:true});
                }
            },
            LB:{
                onMousedown:function(profile, e, src){
                    profile.box.onMousedown(profile, e, src, {left:true, bottom:true});
                },
                onDragbegin:function(profile, e, src){
                    profile.box.onDragbegin(profile, e, src);
                },
                onDrag:function(profile, e, src){
                    profile.box.onDrag(profile, e, src, {left:true, bottom:true});
                },
                onDragstop:function(profile, e, src){
                    profile.box.onDragstop(profile, e, src, {left:true, bottom:true});
                }
            },
            RB:{
                onMousedown:function(profile, e, src){
                    profile.box.onMousedown(profile, e, src, {right:true, bottom:true});
                },
                onDragbegin:function(profile, e, src){
                    profile.box.onDragbegin(profile, e, src);
                },
                onDrag:function(profile, e, src){
                    profile.box.onDrag(profile, e, src, {right:true, bottom:true});
                },
                onDragstop:function(profile, e, src){
                    profile.box.onDragstop(profile, e, src, {right:true, bottom:true});
                }
            },
            L:{
                onMousedown:function(profile, e, src){
                    profile.box.onMousedown(profile, e, src, {left:true});
                },
                onDragbegin:function(profile, e, src){
                    profile.box.onDragbegin(profile, e, src);
                },
                onDrag:function(profile, e, src){
                    profile.box.onDrag(profile, e, src, {left:true});
                },
                onDragstop:function(profile, e, src){
                    profile.box.onDragstop(profile, e, src, {left:true});
                }
            },
            T:{
                onMousedown:function(profile, e, src){
                    profile.box.onMousedown(profile, e, src, {top:true});
                },
                onDragbegin:function(profile, e, src){
                    profile.box.onDragbegin(profile, e, src);
                },
                onDrag:function(profile, e, src){
                    profile.box.onDrag(profile, e, src, {top:true});
                },
                onDragstop:function(profile, e, src){
                    profile.box.onDragstop(profile, e, src, {top:true});
                }
            },
            R:{
                onMousedown:function(profile, e, src){
                    profile.box.onMousedown(profile, e, src, {right:true});
                },
                onDragbegin:function(profile, e, src){
                    profile.box.onDragbegin(profile, e, src);
                },
                onDrag:function(profile, e, src){
                    profile.box.onDrag(profile, e, src, {right:true});
                },
                onDragstop:function(profile, e, src){
                    profile.box.onDragstop(profile, e, src, {right:true});
                }
            },
            B:{
                onMousedown:function(profile, e, src){
                    profile.box.onMousedown(profile, e, src, {bottom:true});
                },
                onDragbegin:function(profile, e, src){
                    profile.box.onDragbegin(profile, e, src);
                },
                onDrag:function(profile, e, src){
                    profile.box.onDrag(profile, e, src, {bottom:true});
                },
                onDragstop:function(profile, e, src){
                    profile.box.onDragstop(profile, e, src, {bottom:true});
                }
            }
        }},
        DataModel:{
            // change by proxy
            proxy:true,
            // is children of target
            child:false,
            // visible
            visible:true,
            // cover for length edget
            cover:false,
            Static:false,
            // change width
            reHeight :true,
            // chang height
            reWidth :true,
            //can drag to resize or move
            changable:true,
            // movable
            move:true,

            left: 100,
            top: 100,
            height: 100,
            width: 100,
            position:'absolute',
            display:'block',
            visibility:'visible',

            minHeight: 12,
            minWidth: 12,
            maxHeight: 5000,
            maxWidth: 5000,
            offset:2,
            enlarge:0,
            dragArgs:{}
        },
        EventHandlers:{
            onUpdate:function(profile, target, size, cssPos){},
            onActive:function(profile){},
            onFocusChange:function(profile, index){},
            onItemsSelected:function(profile,ids){},
            onRegionClick:function(profile,e){}
        },
        dynamicTemplate:function(profile){
            var pro = profile.properties,size,pos,temp,
                hash = profile._exhash =
                    "$" +
                    'child:' + pro.child + ';' +
                    'visible:' + pro.visible + ';' +
                    'cover:' + pro.cover + ';' +
                    'Static:' + pro.Static + ';' +
                    'reheight:' + pro.reHeight + ';' +
                    'rewidth:' + pro.reWidth + ';' +
                    'move:' + pro.move + ';'
            ;

            var map= arguments.callee.map || (arguments.callee.map={
                //move icon size 13*13
                MOVE:{tagName:'div', style:'top:50%;left:50%;margin-left:-6px;margin-top:-6px;width:13px;height:13px;'},
                T:{tagName:'div', style:'top:-{edge}px;margin-left:-{edge}px;width:{hSize}px;height:{hSize}px;'},
                RT:{tagName:'div', style:'top:-{edge}px;right:-{edge}px;width:{hSize}px;height:{hSize}px;'},
                R:{tagName:'div', style:'right:-{edge}px;margin-top:-{edge}px;width:{hSize}px;height:{hSize}px;'},
                RB:{tagName:'div', style:'bottom:-{edge}px;right:-{edge}px;width:{hSize}px;height:{hSize}px;'},
                B:{tagName:'div', style:'bottom:-{edge}px;margin-left:-{edge}px;width:{hSize}px;height:{hSize}px;'},
                LB:{tagName:'div',style:'bottom:-{edge}px;left:-{edge}px;width:{hSize}px;height:{hSize}px;'},
                L:{tagName:'div', style:'left:-{edge}px;margin-top:-{edge}px;width:{hSize}px;height:{hSize}px;'},
                LT:{tagName:'div', style:'left:-{edge}px;top:-{edge}px;width:{hSize}px;height:{hSize}px;'},
                cover:{
                    T:{tagName:'div', style:'width:100%;left:0;top:-{edge}px;height:{hSize}px;'},
                    RT:{tagName:'div', style:'top:-{edge}px;right:-{edge}px;width:{hSize}px;height:{hSize}px;'},
                    R:{tagName:'div', style:'height:100%;top:0;right:-{edge}px;width:{hSize}px;' },
                    RB:{tagName:'div', style:'right:-{edge}px;bottom:-{edge}px;width:{hSize}px;height:{hSize}px;'},
                    B:{tagName:'div', style:'width:100%;left:0;bottom:-{edge}px;height:{hSize}px;'},
                    LB:{tagName:'div', style:'left:-{edge}px;bottom:-{edge}px;width:{hSize}px;height:{hSize}px;'},
                    L:{tagName:'div', style:'height:100%;top:0;left:-{edge}px;width:{hSize}px;' },
                    LT:{tagName:'div', style:'top:-{edge}px;left:-{edge}px;width:{hSize}px;height:{hSize}px;'}
                }
            });

            /* dynamic template set here
                template._id is main id, which can input by create arg
                template._did is sub id, which must be built on fly, and cached
            */
            var tid=profile.template._id,
            template = profile.box.getTemplate(tid, hash);
            // set template dynamic
            if(!template){
                var t,n;
                template = _.clone(profile.box.getTemplate(tid));

                // cover or not?
                t = pro.cover?map.cover:map;
                // can move?
                if(pro.move)template.MOVE = t.MOVE;

                // change height only
                if(pro.reHeight){
                    if(!pro.Static)
                        template.T = t.T;
                    template.B = t.B;
                }
                // change width only
                if(pro.reWidth){
                    if(!pro.Static)
                        template.L = t.L;
                    template.R = t.R;
                    // change height and width
                    if(pro.reHeight){
                        if(!pro.Static){
                            template.LB = t.LB;
                            template.RT = t.RT;
                            template.LT = t.LT;
                        }
                        template.RB = t.RB;
                    }
                }

                n = profile.getClass('KEY', '-handler') + " ";
                if(t=template.T)t.className = n;
                if(t=template.RT)t.className = n;
                if(t=template.R)t.className = n;
                if(t=template.RB)t.className = n;
                if(t=template.B)t.className = n;
                if(t=template.LB)t.className = n;
                if(t=template.L)t.className = n;
                if(t=template.LT)t.className = n;

                // if hidden
                if(!pro.visible){
                    n = profile.getClass('KEY', '-hidden') + " ";
                    if(t=template.T)t.className += n;
                    if(t=template.RT)t.className += n;
                    if(t=template.R)t.className += n;
                    if(t=template.RB)t.className += n;
                    if(t=template.B)t.className += n;
                    if(t=template.LB)t.className += n;
                    if(t=template.L)t.className += n;
                    if(t=template.LT)t.className += n;

                }
                // set template
                profile.box.setTemplate(tid, template, hash);
            }
            profile.template = template;
        },
        prepareData:function(profile){
            var t = profile.properties;

            // handlerSize
            t.hSize = parseInt(t.offset)*2;
            // reset offset value
            t.edge = t.offset + t.enlarge;

            // for child type
            if(t.child){
                t.offset=0;
                t.visible=false;
                t.cover=true;

                t.position = 'static';
                t.display = 'inline';
                t.left = t.top = t.width = t.height = 0;
            }
            if(!t.visible)
                t.visibility='hidden';

            arguments.callee.upper.call(this, profile);
        },
        renderedTrigger:function(){
            this.boxing().rePosSize();
        },
        createdTrigger:function(){
            this.domNode.zIndexIgnore=true;
            // set ini update function
            if(!this.onUpdate)
                this.onUpdate = function(profile, target, size, cssPos){
                    if(target){
                        if(size)target.widthBy(size.width,true).heightBy(size.height,true);
                        if(cssPos)target.leftBy(cssPos.left).topBy(cssPos.top);
                    }
                };
        },
        //
        onMousedown:function(profile, e, src, ddparas){
            //not resizable or drag
            if(!profile.properties.changable)return;
            var ck=linb.event.currentKey;
             // begin drag use blank
            if(ck && (ck[1] || (linb.browser.kde&&ck[0]==' '))){
                profile.boxing().resetTarget(null);
                var pos=linb.event.getPos(e);

                var hash = {defer:1, drop2:true, icon:linb.ini.path+'ondrag.gif', dragMode:'move',target_left:pos.left+12,target_top:pos.top+12, cursor:'pointer', move:false};
                // set other args for drag
                _.merge(hash,profile.properties.dragArgs,'all');
                hash.grid_width=hash.grid_height=0;
                hash.data.pos = profile.boxing().reBoxing().cssPos();

                linb([]).startDrag(e,hash);
            }else{
                var hash,o,absPos,pos,posbak,size;
                if(profile.properties.child){
                    pos=linb.event.getPos(e);
                    linb([src]).startDrag(e,{defer:1,move:false, type:'blank',cursor:true,target_left:pos.left, target_top:pos.top});
                }else{
                    o = profile.root;
                    var absPos = o.absPos();
                    pos=o.cssPos();
                    posbak=_.copy(pos);
                    size=o.cssSize();
                    if(ddparas.move){
                        var absPos=linb.event.getPos(e),
                        posbak=_.copy(pos);
                    }else{
                        var absPos = o.absPos();
                        pos=o.cssPos();
                        posbak=_.copy(pos);
                        size=o.cssSize();

                        if(ddparas.left){
                            if(ddparas.top){
                            }else if(ddparas.bottom){
                                pos.top = pos.top + size.height;
                            }else{
                                pos.top = pos.top + size.height/2;
                            }
                        }
                        if(ddparas.right){
                            pos.left = pos.left + size.width;
                            if(ddparas.top){
                            }else if(ddparas.bottom){
                                pos.top = pos.top + size.height;
                            }else{
                                pos.top = pos.top + size.height/2;
                            }
                        }
                        if(ddparas.top && !ddparas.left && !ddparas.right){
                            pos.left = pos.left + size.width/2;
                        }
                        if(ddparas.bottom && !ddparas.left && !ddparas.right){
                            pos.left = pos.left + size.width/2;
                            pos.top = pos.top + size.height;
                        }
                    }

                    if((t=profile.properties.dragArgs) && (t=t.grid_width)){
                        var offx = linb.dragDrop._size % t;
                        if(ddparas.left){
                            pos.left += offx;
                        }else if(ddparas.right){
                            pos.left += offx;// + 2;
                        }else if(ddparas.move){
                            pos.left += offx;
                        }
                    }
                    if((t=profile.properties.dragArgs) && (t=t.grid_height)){
                        var offy = linb.dragDrop._size % t;
                        if(ddparas.top){
                            pos.top += offy;
                        }else if(ddparas.bottom){
                            pos.top += offy;// + 2;
                        }else if(ddparas.move){
                            pos.top += offy;
                        }
                    }

                    //give offset
                    pos.left += parseInt((absPos.left-posbak.left)/t)*t;
                    pos.top += parseInt((absPos.top-posbak.top)/t)*t;

                    var hash = {defer:1,move:false, type:'blank', cursor:true, target_left:pos.left, target_top:pos.top};
                    _.merge(hash,profile.properties.dragArgs,'all');
                    hash.target_parent=profile._parent;
                    hash.key=null;

                    linb([src]).startDrag(e,hash);
                }
            }
        },
        onDragbegin:function(profile, e){
            if(profile.properties.child){
                //set target to specific target
                var o=profile._target,
                pos =o.absPos(),
                w = o.offsetWidth(),
                h = o.offsetHeight()
                ;

                //custom proxy
                profile.proxy = linb.dom.getMatix();
                profile.proxy
                .html(' ',false)
                .setStyle({border:'1px dashed',visibility:'visible'})
                .absPos(pos)
                .offsetWidth(w)
                .offsetHeight(h)
                .zIndex(linb.dom.top_zIndex+20);
            }else{
                //set target to resizer
                var o  = linb([profile.domNode]);
                //set proxy to itself
                profile.proxy = o;
            }
            //get pos for target and proxy
            profile.o_pos = profile.proxy.cssPos();
            //get current w h from target
            profile.o_w2 =profile.o_w = o.width();
            profile.o_h2 =profile.o_h = o.height();

            profile.$onDrag = true;
        },
        onDrag:function(profile, e,src, ddparas){
            var o=ddparas;
            //get dragdop off set
            profile.oos = profile.oos ||{};
            var os = linb.dragDrop.getOffset();
            if(os.x == profile.oos.width && os.y == profile.oos.height)return;
            profile.oos=os;

            var x,y,w,h,t=profile.properties;

            if(o.left){
                // width of proxy
                w = profile.o_w - os.x;
                // left of proxy
                x = profile.o_pos.left + os.x;
                if(w<t.minWidth){
                    w=t.minWidth;
                    x = profile.o_w+profile.o_pos.left - w;
                }else if(w>t.maxWidth){
                    w=t.maxWidth;
                    x= profile.o_w+profile.o_pos.left - w;
                }
                profile.proxy.width(w).left(x);
            }else if(o.right){
                w = profile.o_w + os.x;
                if(w<t.minWidth)w=t.minWidth;
                else if(w>t.maxWidth)w=t.maxWidth;
                profile.proxy.width(w);
            }
            if(o.left || o.right){
                //resize inner region block
                var byw = w-profile.o_w2;
                if(profile.regions && byw!==0){
                    profile.regions.widthBy(byw);
                    profile.o_w2=w;
                }
            }

            if(o.top){
                h = profile.o_h - os.y;
                y = profile.o_pos.top + os.y;
                if(h<t.minHeight){
                    h=t.minHeight;
                    y=profile.o_h+profile.o_pos.top - h;
                }else if(h>t.maxHeight){
                    h=t.maxHeight;
                    y=profile.o_h+profile.o_pos.top - h;
                }
                profile.proxy.height(h).top(y);
            }else if(o.bottom){
                h= profile.o_h + os.y;
                if(h<t.minHeight)h=t.minHeight;
                else if(h>t.maxHeight)h=t.maxHeight;
                profile.proxy.height(h);
            }
            if(o.top || o.bottom){
                //resize inner region block
                var byh = h-profile.o_h2;
                if(profile.regions && byh!==0){
                    profile.regions.heightBy(byh);
                    profile.o_h2=h;
                }
            }

            if(o.move){
                x = profile.o_pos.left + os.x;
                y = profile.o_pos.top + os.y;
                profile.proxy.top(y).left(x);
            }
        },
        onDragstop:function(profile, e, src, args){
            var cssPos,size,pos;
            var o = profile.proxy;

            if(!args.move)
                size = { width :o.width()-profile.o_w, height :o.height()-profile.o_h};

            //absPos = o.absPos();
            if(args.left || args.top || args.move){
                cssPos = o.cssPos();
                pos = {left :cssPos.left-profile.o_pos.left,  top :cssPos.top-profile.o_pos.top};
            }
            profile.boxing().onUpdate(profile, profile._target, size, pos);

            if(profile.properties.child){
                if(linb.browser.ie6)profile._target.ieTrigger();
                profile.proxy.html('',false).setStyle({visibility:'hidden',zIndex:'0',width:'0',height:'0'});
            }
            profile.boxing().active();
            profile.$onDrag = false;
        }
    }
});