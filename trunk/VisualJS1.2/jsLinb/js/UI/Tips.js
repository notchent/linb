//singleton
Class("linb.UI.Tips", null,{
    Constructor:function(){return null},
    Initialize:function(){
        var dd=linb.dragDrop,
            tips=this;
        dd.$reset=function(){
            tips.pos={left:dd.x,top:dd.y}
        };

        //for: span(display:-moz-inline-box) cant wrap in firefox
        linb.css.add(
            ".linb-ui-tips{font-size:0;line-height:0;position:absolute;border:solid gray 1px;background-color:#FFF8DC;overflow:visible;} "+
            ".linb-ui-tips-i{font-size:12px;margin:1px 2px 2px 2px;}"+
            ".linb-ui-tips-i span{display:inline;}"
        , linb.getPath(this.KEY,'/css.css','appearance'));

        linb([document])
        .afterMousedown(function(){
            if(tips.markId){
                if(tips.showed)
                    tips.hide();
                else
                    tips.cancel();
            }
        },'$Tips',-1)
        .afterMousemove(function(obj, e, src){
            if(dd.working)return;
            var event=linb.event,
                p,n;

            //if ready to show in settimeout(resetRun)
            if((p=_.resetRun.cache) && p['$Tips'])
                tips.pos=event.getPos(e);

            //it's first show
            if(tips.from){
                _.resetRun('$Tips3', null);
                tips._showF();
            //after show, before hide
            }else if(tips.showed && tips.move){
                p=event.getPos(e);
                n=tips.Node.style;
                n.left = (parseInt(n.left)||0) + (p.left-tips._pos.left) +'px';
                n.top = (parseInt(n.top)||0) + (p.top-tips._pos.top) +'px';
                tips._pos=p;
            }
        },'$Tips',-1)
        .afterMouseover(function(obj, e, src){
            var event=linb.event,
                rt=event.rtnFalse,
                node=event.getSrc(e),
                id,
                //for linb.template
                tid=node._tid,
                rn = e.fromElement||e.relatedTarget,
                from,
                tempid,evid,
                pass
            ;

            //check node
            if(node && node.id==linb.langId)
                node = node.parentNode;
            if(!node || (!tid && !(id=node.id) || (tid && !(evid=node.getAttribute('evid')))))
                return rt;

            //check id
            id=tid?tid:id;
            if((from=event._getProfile(id)) && from.box){
                //if onShowTips exists, use custom tips id region, or use item region
                tempid=tid?tid+evid:from.onShowTips?id:id.replace(event._reg,'$1$3$4');
                if(tips.markId && tempid==tips.markId)
                    return rt;

                //set mark src id
                tips.markId = tempid;
                tips.pos=event.getPos(e);
                _.resetRun('$Tips', function(){
                    tips.from=from;
                    tips.enode=node;
                    _.resetRun('$Tips3', function(){
                        if(tips.from)
                            tips._showF();
                    },100);
                }, tips.delayTime);
            }
            return rt;
        },'$Tips',-1)
        .afterMouseout(function(obj, e, src){
            if(tips.markId){
                var event=linb.event,
                    id,
                    tempid,
                    evid,
                    //for linb.template
                    tid=event.getSrc(e)._tid,
                    from=tips.from,
                    clear,
                    node = e.toElement||e.relatedTarget;

                //for firefox wearing anynomous div in input/textarea
                try{
                    if(node && node.id==linb.langId)
                        node = node.parentNode;
                    if(!node || (!tid && !(id=node.id) || (tid && node.id)))
                        clear=1;
                }catch(e){clear=1}

                if(!clear){
                    //if onShowTips exists, use custom tips id region, or use item region
                    tempid=tid?tid+node.getAttribute('evid'):(from && from.onShowTips)?id:id.replace(event._reg,'$1$3$4');
                    clear=tempid !== tips.markId;
                }

                if(clear){
                    if(tips.showed)tips.hide();
                    else tips.cancel();
                }
                return event.rtnFalse;
            }
        },'$Tips',-1);

        this.Types = {
            'default' : new function(){
                this._r=/(\$)([\w\.]+)/g;
                this.show=function(item, pos, key){
                    //if trigger onmouseover before onmousemove, pos will be undefined
                    if(!pos)return;

                    var self=this,node,_ruler,s,w,h;
                    if(!(node=self.node)){
                        node = self.node = linb.create('<div class="linb-ui-tips"><div class="linb-ui-tips-i"></div></div>');
                        _ruler = self._ruler = linb.create('<div class="linb-ui-tips" style="position:absolute;visibility:hidden;left:-10000px;"><div class="linb-ui-tips-i" style="position:relative;"></div></div>');
                        self.n = node.first();
                        self._n = _ruler.first();
                        if(linb.dom.support('shadow')){
                            node.shadow();
                            _ruler.shadow();
                        }
                        linb([document.body]).addLast(_ruler);
                    }
                    _ruler = self._ruler;
                    //ensure zindex is the top
                    if(document.body.lastChild!=node.get(0))
                        linb([document.body]).addLast(node);

                    s = typeof item=='object'? item[key||'tips'] :item ;

                    if(s=s.toString()){
                        //get string
                        s=s.replace(self._r, function(a,b,c){
                            return linb.wrapRes(c);
                        });
                        //set to this one
                        self._n.get(0).innerHTML=s;
                        //get width
                        w=Math.min(tips.maxWidth, _ruler.get(0).offsetWidth);

                        //set content, AND dimension
                        var style=node.get(0).style;
                        //hide first
                        style.visibility='hidden';
                        //set content
                        self.n.get(0).innerHTML=s;
                        //set dimension
                        if(linb.browser.ie){
                            style.width=w+(w%2)+'px';
                            h=self.n.get(0).offsetHeight;
                            style.height=h+(h%2)+'px';
                        }else
                            style.width=w+'px';

                        //pop(visible too)
                        node.popToTop({left:pos.left,top:pos.top,region:{
                            left:pos.left,
                            top:pos.top-12,
                            width:24,height:32
                        }},null,1);
                    }
                };
                this.hide = function(){
                    this.node.zIndex(0).hide();
                };
            }/*,
            'fx' : new function(){
                this.threadid='$tips:1$';
                this.show=function(item, pos){
                    if(!this.node){
                        this.node = linb.create('<div style="position:absolute;border:solid gray 1px;background-color:#FFFACD;font-size:12px;padding:3px;overflow:hidden;"></div>');
                        linb([document.body]).addLast(this.node);
                    }
                    pos.left+=12;
                    pos.top+=12;
                    var s=item.tips;
                    s = s.charAt(0)=='$'?linb.wrapRes(s.slice(1)):s;
                    this.node.html(s).zIndex(linb.dom.top_zIndex).cssPos(pos);
                    var w=this.node.width(),h=this.node.height();
                    this.node.cssSize({ width :0, height :0}).display('block').fx({width:[0,w],height:[0,h]},0,0,240,8,'outexp',this.threadid).start();
                };
                this.hide = function(){
                    linb.thread.abort(this.threadid);
                    this.node.height('auto').width('auto').display('none').zIndex(0);
                };
            }*/
        };
    },
    Static:{
        maxWidth:300,
        move:true,
        delayTime:200,
        autoHideTime:5000,

        _showF:function(){
            var self=this,
                from=self.from,
                node=self.enode,
                pos=self.pos,
                id,
                o,t,b=false;

            self.from=self.enode=null;

            if(!node || !from || !pos || !(o=from.box))return;

            //keep older
            self._pos=pos;
            //1.CF
            b=((t=from.CF) && (t=t.showTips) && t(from, node, pos));
            //2.showTips / onShowTips
            //check if showTips works
            if(!b)b=(o.showTips && o.showTips(from, node, pos));

            //default tips var
            if(!b && (t=from.properties) && (t.tips)){
                self.show(pos, t);
                b=true;
            }
            //no work hide it
            if(!b)self.hide();
            else {
                if(!self.move)
                    _.resetRun('$Tips2', self.hide,self.autoHideTime,null,self);
            }
        },
        show:function(pos, item, key){
            var self=this,t;
            //same item, return
            if(self.item == item)return;

            //hide first
            //if(self.curTemplate)self.curTemplate.hide();

            //base check
            if(typeof item =='string' || item.tips){
                //get template
                t = self.curTemplate = self.Types[item.tipsTemplate] || self.Types['default'];
                t.show(item,pos,key);
                self.Node=t.node.get(0);
                self.item=item;
                self.showed = true;
            }
        },
        hide:function(flag){
            var self=this;
            if(flag || self.showed){
                if(self.curTemplate)self.curTemplate.hide();
                self._c();
            }
        },
        cancel:function(){
            var self=this;
            _.resetRun('$Tips', null);
            _.resetRun('$Tips3', null);
            self._c();
        },
        _c:function(){
            var self=this;
            self.markId = self.from=self.curTemplate = self.item = self.showed = null;
        }
    }
});