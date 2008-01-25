/* for drag && drop
var profile = {
    move: true,
    type: <"copy" "move" "shape" "icon">,
    defer :drag defer count, drag will be triggerred by mousemove
    docking_offset: <int>,
    docking_x: <array of int>,
    docking_y: <array of int>,
    grid_width: <int>,
    grid_height: <int>,
    horizontal: <int>,
    vertical: <int>,
    offset_bottom: <int>,
    offset_left: <int>,
    offset_right: <int>,
    offset_top: <int>,
    opacity: <bool>,
    //ini pos and size
    target_left
    target_top
    target_width
    target_height
    topZindex
    cursor

    pack:function
    unpack:function
}

type:
There are six type in DD,
"blank":blank in proxy node
"move": move target object directly when mousemove
"copy": move a copy of target object when mousemove
"shape":just move a shape of target object when mousemove
"icon":just move a icon that represents target object when mousemove
"none": move mouseonly

You can set position and size when drag start:
              target_left
              |
              |
target_top---**************** |
              **************** |
              **************** |
              **************** |target_height
              **************** |
              **************** |
             |<--target_width->+

    +------------------------------+
    |       |                      |
    |       |offset_top            |
    |<----->****************<----->|
    | offset**************** offset|
    | _left **************** _right|
    |       ****************       |
    |       ****************       |
    |       ****************       |
    |       |offset_bottom         |
    |       |                      |
    +------------------------------+

You can limite dragging in one dimension.

horizontal
------------------------------------------
            ****************
            ****************
            ****************
            ****************
            ****************
            ****************
------------------------------------------

vertical
           |                |
           |                |
           |****************|
           |****************|
           |****************|
           |****************|
           |****************|
           |****************|
           |                |
           |                |


docking:

docking_y 1                      2                     3
          |                      |                     |       docking_x
      ----+----------------------+---------------------+-------1
          |                      |                     |
          |                      |                     |
          |                      |                     |
          |                      |                     |
      ----+----------------------+---------------------+-------2
          |                      |                     |
          |                      |                     |
          |                      |                     |
      ----+----------------------+---------------------+-------3
          |                      |                     |
          |                      |                     |

docking_offset
                      **|**
                      **|**
                      **|**
                      **|**
         ***************|*************
         ***************|*************
         ---------------+-------------
         ***************|*************
         ***************|*************
                      **|**
                      **|**
                      **|**


grid:

                   grid_width
               <-------------------->
              |                      |                     |
          ----+----------------------+---------------------+-------
              |                      |                     |
   grid_height|                      |                     |
              |                      |                     |
              |                      |                     |
          ----+----------------------+---------------------+-------
              |                      |                     |
              |                      |                     |
              |                      |                     |
              |                      |                     |
          ----+----------------------+---------------------+-------
              |                      |                     |
              |                      |                     |


other commands:
opacity:opacity effect when dragging

in callback function, you can get the following values from linb.dragdrop:

x :current X value of mouse;
y  :current Y value of mouse;
ox: mouse original X when drag start;
oy: mouse original Y when drag start;
proxyPos:{left:xx,top:xx}: css pos of proxy node in current step;
getOffset(): return {x:,y}: offset from now to origin

*/
Class('linb.dragDrop',null,{
    Static:{
        _eh:"_dd",
        _id:"linb.dd:proxy:",
        _idi:"linb.dd:td:",
        _size:50,
        _type:{blank:1,move:1,shape:1,copy:1,icon:1,none:1},
        _Icons:{none:'top', move:'-16px',ref:'-32px',add:'-48px'},

        //drop key collection
        $:{},

        //get left for cssPos
        _left:function(value){
            with(this){
                if(docking_offset>0 && docking_x && docking_x.length){
                    var l=docking_x.length;
                    while(l--)
                        if(Math.abs(value - docking_x[l])<=docking_offset)
                            return docking_x[l];
                }
                if(grid_width>1)
                   return Math.floor(value/grid_width)*grid_width;
                return value;
            }
        },
        //get top for cssPos
        _top:function(value){
            with(this){
                if(docking_offset>0 && docking_y && docking_y.length){
                    var l=docking_y.length;
                    while(l--)
                        if(Math.abs(value - docking_y[l])<=docking_offset)
                            return docking_y[l];
                }
                if(grid_height>1)
                    return Math.floor(value/grid_height)*grid_height;
                return value;
            }
        },

        _ini:function(o){
            with(this){
                var _t=linb(window);
                _box = { width :_t.width()+_t.scrollLeft(),  height :_t.height()+_t.scrollTop()};

                ox = x;
                oy = y;

                if(proxy = o){
                    proxystyle=o.get(0).style;
                    _absPos= proxy.absPos(null,target_parent);
                    _cssPos= proxy.cssPos();
                    // according to corner

                    cssPos_offset_x = x - _cssPos.left;
                    cssPos_offset_y = y - _cssPos.top;
                    absPos_offset_x = x - _absPos.left;
                    absPos_offset_y = y - _absPos.top;

                    limit_left =  x - offset_left;
                    limit_right =  x + offset_right;
                    limit_top =  y - offset_top;
                    limit_bottom =  y + offset_bottom;

                    //here
                    proxyPos.left = pre.left = _cssPos.left;
                    proxyPos.top = pre.top = _cssPos.top;

                    if("move" !== type){
                        _zIndex = proxy.zIndex();
                        proxy.zIndex(linb.dom.top_zIndex*10);
                    }

                    if(opacity)
                        proxy.opacity(0.8);
                }
            }
        },
        _reset:function(){
            var d=this;
            d.$reset && d.$reset();
            d.start=null;
            d.showDDMark(0);
            d.resetProxy();

            d.type = 'shape';
            d.cursor='move';
            d._cursor=d._button='';
            d.move=true;

            d._begin= _();

            d.mousemove=d.mouseup=d.onselectstart=d.ondragstart='*';

            d.pre={left :0, top :0};
            d.proxyPos={left :0, top :0};
            d.docking_x=d.docking_y=[];

            d.grid_width=d.grid_height=1;
            d._timer=d.docking_offset=-1;
            d._defer=d.defer=d._zIndex=d.x=d.y=d.ox=d.absPos_offset_y=d.absPos_offset_x=d.cssPos_offset_x=d.oy=d.cssPos_offset_y=d.limit_left=d.limit_right=d.limit_top=d.limit_bottom=0;
            d.working=d.offset_bottom=d.offset_left=d.offset_right=d.offset_top=d.drop2=d._stop=d.opacity=d.horizontal=d.vertical=d.topZindex=false;
            d.proxystyle=d._onDrag=d._onDragover=d.key=d.data=d.dragKey=d.dragData=d._current_bak=d._current=d._source=d._data=d.proxy=d.proxyIn=d._absPos= d._cssPos=d._box=d.pack=d.unpack=d.target_left= d.target_top= d.target_width=d.target_height=d.target_parent=null;

            return d;
        },
        abort:function(){
            this._stop=true;
        },
        _end:function(){
            with(this){
                if(proxy){
                    unpack?unpack():_unpack();
                    if(opacity) proxy.opacity(1)
                }
                var d=document;
                //must here
                //if bak, restore
                if(onselectstart!='*')d.body.onselectstart=onselectstart;
                if(ondragstart!='*')d.ondragstart=ondragstart;
                //if bak, restore
                if(mousemove!='*')d.onmousemove=mousemove;
                if(mouseup!='*')d.onmouseup=mouseup;
            }
            return  this;
        },
        drag:function(e, node, profile, key, data){
            var self=this;
            with(self){
                //clear
                _end()._reset();

                e = e || window.event;
                // not left button
                if(linb.event.getBtn(e) !== 'left')
                   return true;

                _source = node = linb(node);
                _cursor = _source.cursor();

                if(!node.id())node.id(_.id(),true);

                //must set here
                _defer = defer = _.numb(profile && profile.defer, defer);
                if(profile){
                    if(true===profile.cursor)profile.cursor=_cursor;
                    type=typeof profile.icon == 'string'?"icon":_type[type]?type:'shape';
                }

                profile=_.hash(profile);

                var d=document,
                    _pos = linb.event.getPos(e);
                profile.x = _pos.left;
                profile.y = _pos.top;
                profile._button = linb.event.getBtn(e);

                dragKey= key || (profile && profile.key);
                dragData= data || (profile && profile.data);

                self.start=function(e){
//ie6: mousemove - mousedown =>78 ms
//delay is related to window size, weird
                //                  try{
                    var t;
                    //call event, you can call abort(set _stoop)
                    _source.beforeDragbegin();

                    if(working || _stop){_end()._reset();return false;}

                    //set profile
                    _.merge(self, profile, "all");
                    _ini(pack?pack():(type=='none')?null:_pack(_pos, node));
                    // on scrollbar
                    if(profile.x >= _box.width  || profile.y >= _box.height ){_end()._reset();return true;}

                    //set working flag
                    working = true;

                    _source.onDragbegin();

                    //set back first
                    if(defer<=0){
                        mousemove = d.onmousemove;
                        mouseup = d.onmouseup;
                    }

                    //back up
                    d.onmousemove = $onDrag;
                    d.onmouseup = $onDrop;
                    //for events
                    _source.afterDragbegin();
                    //for delay, call ondrag now
                    if(defer>0)$onDrag.call(self, e);
                //                  }catch(e){self._end()._reset();}
                };
                if(linb.browser.ie){
                    ondragstart=d.ondragstart;
                    onselectstart=d.body.onselectstart;
                    d.ondragstart = d.body.onselectstart = null;
                    if(d.selection)_.tryF(d.selection.empty);
                }

                //avoid select
                linb.event.stopBubble(e);

                //fire document onmousedown event
                if(node.get(0)!==d)
                    linb(d).onMousedown(true, linb.event.getEventPara(e));

                if(defer<=0){
                    _.tryF(self.start,[e],self);
                    return false;
                }else{
                    //for mouseup before drag
                    mouseup = d.onmouseup;
                    d.onmouseup = function(e){
                        linb.dragDrop._end()._reset();
                        return _.tryF(document.onmouseup,[e],null,true);
                    };
                    //for mousemove before drag
                    mousemove = d.onmousemove;
                    d.onmousemove = function(e){
                        if(--_defer<=0)linb.dragDrop.start(e);
                        return false;
                    };
                }
//ie6: mousemove - mousedown =>78 ms
            }
        },
        $onDrag:function(e){
            with(linb.dragDrop){
               //try{
                    e = e || window.event;
                    //set _stop or in IE, show alert
                    if((!working) || _stop || (linb.browser.ie && (!e.button) )){
                        $onDrop(e);
                        return true;
                    }

                    var _pos=linb.event.getPos(e);
                    x=_pos.left;y=_pos.top;

                    if(!working)return false;

                    if(proxy){
                        if(!vertical){
                            proxyPos.left=Math.floor(_left(
                                ((offset_left!==false||offset_right!==false)?
                                    ((x<=limit_left)?limit_left:(x>=limit_right)?limit_right:x):
                                    x)
                                - cssPos_offset_x)
                            );
                            if(proxyPos.left-pre.left)
                                proxystyle.left=proxyPos.left+'px';
                            pre.left=proxyPos.left;
                        }
                        if(!horizontal){
                            proxyPos.top=Math.floor(_top(
                                ((offset_top!==false||offset_bottom!==false)?
                                    ((y<=limit_top)?limit_top:(y>=limit_bottom)?limit_bottom:y):
                                    y)
                                - cssPos_offset_y)
                            );
                            if(proxyPos.top-pre.top)
                                proxystyle.top=proxyPos.top+'px';
                            pre.top=proxyPos.top;
                        }
                    }else{
                        //style='none', no dd.current dd.pre provided
                        //fireEvent
                        //_source.onDrag(true); //shortcut for mousemove
                    }
                    if(_onDrag!=1){
                        if(_onDrag)_onDrag(e);
                        else{
                            //ensure to run once only
                            _onDrag=1;
                            //if any ondrag event exists, this function will set _onDrag
                            _source.onDrag(true);
                        }
                    }
                //}catch(e){linb.dragDrop._end()._reset();}finally{
                   return false;
                //}
            }
        },
        $onDrop:function(e){
            with(linb.dragDrop){
//                try{
                    e = e || window.event;

                    // opera 9 down with
                    // if(!working){linb.event.stopBubble(e);return false;}
                    _end();
                    if(working){
                        var r = _source.onDragend(true);
                        if(_current)
                            linb(_current.id).onDrop(true);
                    }
//                }catch(a){}finally{
                    _reset();
                    linb.event.stopBubble(e);
                    _.tryF(document.onmouseup,[e]);
                    return !!r;
//                }
            }
        },
        getOffset:function(){
            with(this)return proxy
            ?
            { x : proxyPos.left-ox+cssPos_offset_x,  y : proxyPos.top-oy+cssPos_offset_y}
            :
            { x : x-ox,  y : y-oy}
            ;
        },
        showDDMark:function(o,mode){
            var self=this,
                s1='<div style="position:absolute;z-index:'+linb.dom.top_zIndex+';font-size:0;line-height:0;border-',
                s2=":dashed 1px blue;",
                region=self._Region,
                bg='backgroundColor';
            if(region && region.parent())
                region.remove(false);
            if(self._R){
                self._R.setStyle(bg, self._RB);
                delete self._R;
                delete self._RB;
            }

            if(o){
                if(!region)
                    region=self._Region=linb.create(s1+'top'+s2+'left:0;top:0;width:100%;height:0;"></div>'+s1+'right'+s2+'right:0;top:0;height:100%;width:0;"></div>'+s1+'bottom'+s2+'bottom:0;left:0;width:100%;height:0;"></div>'+s1+'left'+s2+'width:0;left:0;top:0;height:100%;"></div>');
                o=linb(o);
                if(o.display()=='block')
                    o.addLast(region);
                else{
                    self._RB = o.getStyle(bg);
                    self._R=o;
                    o.setStyle(bg, '#FA8072');
                }

                self.setDropableIcon(mode||'move');
            }else
                self.setDropableIcon('none');
        },
        setDropableIcon:function(mode){
            //avoid other dropable node's showDDMark disturbing.
            _.resetRun('showDDMark', null);
            var self=this,i=self.proxyIn,ic=self._Icons;
            if(i && self.type=='icon')
                i.setStyle('backgroundPosition', 'left ' + (ic[mode]||ic.none));
        },
        setProxy:function(child, pos){
            var t,temp,self=this,dom=linb.dom;
            if(!dom.byId(self._id))
                linb([document.body]).addFirst(
                    dom.create('<table id="' + self._id + '" cellspacing="'+self._size+'" cellpadding="0" style="left:0;top:0;border:0; border-spacing:'+self._size+'px; border-collapse: separate; position: absolute;"><tbody><tr><td id="' +self._idi+ '"></td></tr></tbody></table>')
                );
            t=linb(self._id);
            if(self.drop2){
                t.attr('cellSpacing',0).setStyle('borderSpacing',0);
            }else{
                pos.left -=  self._size;
                pos.top -= self._size;
                if(!self.target_parent)
                    dom.setCover(true);
            }
            if(temp=self.target_parent)
                linb(temp).addLast(t);

            if(child){
                linb(self._idi).addLast(child);
                self.proxyIn = child;
            }else
                self.proxyIn = linb(self._idi);
            t.setStyle({cursor:self.cursor,display:'',zIndex:dom.top_zIndex*10}).absPos(pos, temp);

            return t;
        },
        resetProxy:function(){
            var self=this,
                dom=linb.dom,
                id1=self._id,
                id2=self._idi;
            if(dom.byId(id1)){
                var t,k,o=linb(id2),t=linb(id1);
                o.empty();
                o=o.get(0);
                k=o.style;
                if(linb.browser.ie){
                    for(var i in k)
                        if(typeof k[i]!='function')
                            try{k[i]=''}catch(e){}
                }else
                    o.setAttribute('style','');

                linb([document.body]).addFirst(
                    t
                    .attr('cellSpacing',self._size)
                    .setStyle({
                        zIndex:0,
                        cursor:'',
                        display:'none',
                        borderSpacing:self._size+'px'
                    })
                );
                self.proxyIn=self.proxystyle=null;
                dom.setCover(false);
            }
        },
        getProxyPos:function(){
            var self=this,
                pos = linb(self._id).absPos();
            pos.left +=  self._size;
            pos.top += self._size;
            return pos;
        },
        _pack:function(mPos,node){
            var target, pos={}, size={}, d=this, t;
            // get abs pos (border corner)
            if(d.target_left===null || null===d.target_top)
                t=node.absPos(null, d.target_parent);
            pos.left = null!==d.target_left?d.target_left: t.left;
            pos.top = null!==d.target_top?d.target_top: t.top;

            switch(d.type){
                case 'copy':
                   var t;
                    size.width = _.numb(d.target_width, node.cssSize().width);
                    size.height = _.numb(d.target_height, node.cssSize().height);
                    var n=node.clone(_.bool(d.target_clone,true)).id('', true).setStyle({position:'static',cursor:d.cursor,margin:0}).opacity(0.5).cssSize(size);
                    n.dig().id('',true);
                    target = d.setProxy(n,pos);
                    break;
                case 'shape':
                    // get size
                    size.width = null!==d.target_width?d.target_width:node.offsetWidth();
                    size.height = null!==d.target_height?d.target_height:node.offsetHeight();
                    size.width-=2;size.height-=2;
                    target = d.setProxy(
                        linb.dom.create('div').setStyle({border:'dashed 1px',fontSize:'0',lineHeight:'0'}).cssSize(size)
                        ,pos);
                    break;
                case 'blank':
                    target = d.setProxy(null,pos);
                    break;
                case 'icon':
                    //reset pos and size
                    size.width = _.numb(d.target_width, 16);
                    size.height = _.numb(d.target_height, 16);
                    pos.left=_.numb(d.target_left, mPos.left - linb(window).scrollLeft() + size.width);
                    pos.top=_.numb(d.target_top, mPos.top - linb(window).scrollTop() + size.height);
                    target = d.setProxy(
                        linb.dom.create('<div style="font-size:0;line-height:0;background:url('+d.icon+') no-repeat left '+(d.icon_top?d.icon_top:'top')+'" />').cssSize(size)
                        ,pos);
                    break;
                case 'move':
                    target=node;
                    if(target.position() != 'absolute')
                        target.position('absolute').absPos(pos);
                    target.cursor(d.cursor);
            }

            return target;
        },
        _unpack:function(){
            var d=this, t,f;
            if(d.move && ("move" != d.type)){
                if((t=linb(d._source)))
                    if(!t.isEmpty()){
                        if(t.position()!= 'absolute') t.position('absolute');
                        t.absPos(this.getProxyPos());
                        if(d.topZindex) t.topZindex(true);
                    }
            }
            if("move" == d.type)
                d._source.cursor(d._cursor);
        },
        ignore:function(){
            this._current=null;
        },
        unRegister:function(id, key){
            var o=linb(id), eh=this._eh;
            o.removeEvent('beforeMouseover', eh)
              .removeEvent('beforeMouseout', eh)
              .removeEvent('beforeMousemove', eh)
            ;
            o.each(function(o){
                var c = linb.cache.dom[o.id];
                if(c=c.addition)delete c._dropKeys;
                o._dropKeys=null;
            });
        },
        register:function(id, key){
            var o=linb(id),eh=this._eh;
            o.beforeMouseover(function(){
                var t=linb.dragDrop,self=this;
                if(t.dragKey && self._dropKeys[t.dragKey]){
                    t._current=self;
                    t._onDragover=null;
                    linb([self]).onDragenter(true);
                    if(t._current)_.resetRun('showDDMark', t.showDDMark, 0, [self], t);
                }
            }, eh);
            o.beforeMouseout(function(){
                var t=linb.dragDrop,self=this;
                 if(t.dragKey && self._dropKeys[t.dragKey]){
                    linb([self]).onDragleave(true);
                    t._current=t._onDragover=null;
                    _.resetRun('showDDMark', t.showDDMark, 0, [null], t);
                }
            }, eh)
            .beforeMousemove(function(a,e){
                var t=linb.dragDrop, h=t._onDragover, self=this;
                //no dragover event
                if(h==1)return;
                if(t._current==self && t.dragKey && self._dropKeys[t.dragKey]){
                    if(h)h(e);
                    else{
                        //ensure to run once only
                        t._onDragover=1;
                        //if any dragover event exists, this function will set _onDragover
                        linb([self]).onDragover(true);
                    }
                }
            }, eh);
            o.each(function(o){
                //gcable
                var c = linb.cache.dom[o.id];
                (c.addition || (c.addition={}))["_dropKeys"]=null;
                (o._dropKeys || (o._dropKeys={}))[key]=true;
            });
            return this;
        }
    },
    After:function(){
        this._reset();
        //add dom dd functions
        _.each({
            startDrag:function(e, profile, key, data){
                return linb.dragDrop.drag(e, this.get(0), profile, key||'', data||null);
            },
            dragable:function(flag, profile, key, data){
                var self=this, dd=linb.dragDrop;
                if(typeof flag=='undefined')
                    flag=true;
                else if(typeof flag=='object'){
                    profile=flag;
                    flag=true;
                }
                if(flag===true)
                    self.addEvent('onMousedown',function(p,e){
                        if(linb.event.getSrc(e)!=this)return true;
                        linb([this]).startDrag(e, profile, key, data)
                    }, dd._eh, -1);
                else
                    self.removeEvent('onMousedown', dd._eh);

                return self;
            },
            dropable:function(flag, key){
                key = key || 'default';
                var d=linb.dragDrop;
                return this.each(function(o){
                    if(flag)
                        d.register(o, key);
                    else
                        d.unRegister(o, key);
                });
            }
        },function(o,i){
            linb.dom.plugIn(i,o);
        });
    }
});