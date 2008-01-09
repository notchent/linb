//singleton
Class("linb.UI.Tips", null,{
    Constructor:function(){return null},
    Initialize:function(){
        //for: span(display:-moz-inline-box) cant wrap in firefox
        linb.css.add(
            ".linb-ui-tips{font-size:0;line-height:0;position:absolute;border:solid gray 1px;background-color:#FFF8DC;overflow:visible;} "+
            ".linb-ui-tips-i{font-size:12px;margin:1px 2px 2px 2px;}"+
            ".linb-ui-tips-i span{display:inline;}"
        , linb.getPath(this.KEY,'/css.css','appearance'));

        linb([document])
        .afterMousemove(function(obj, e, src){
            var event=linb.event,
                tips=linb.UI.Tips,p,n;

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
                rt=event.rtFalse,
                node=event.getSrc(e),
                tips=linb.UI.Tips,
                id,from,
                tempid,pass
            ;
            //check node
            if(!node || !(id=node.id))
                return rt;
            if(node.id=='linb:lang'){
                node = node.parentNode;
                if(!node || !(id=node.id))
                    return rt;
            }
            //check id
            tempid=id.replace(event._reg,'$1$3$4');
            if(tips.markId && tempid==tips.markId)
                return rt;

            if((from=event._getProfile(id)) && from.box){
                //set mark src id
                tips.markId = tempid;
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
            var tips=linb.UI.Tips;
            if(tips.markId){
                var event=linb.event,
                    id,
                    clear,
                    node = e.toElement||e.relatedTarget;

                //for firefox wearing anynomous div in input/textarea
                try{
                    if(!node || !(id=node.id))
                        clear=1
                }catch(e){clear=1}
                if(!clear){
                    if(node.id=='linb:lang'){
                        node = node.parentNode;
                        if(!node || !(id=node.id))
                            clear=1;
                    }
                }
                if(!clear)
                    clear=id.replace(event._reg,'$1$3$4') !== tips.markId;

                if(clear){
                    if(tips.showed)tips.hide();
                    else tips.asyHide();
                }
                return event.rtFalse;
            }
        },'$Tips',-1);

        this.Types = {
            'default' : new function(){
                this._r=/(\$)([\w\.]+)/g;
                this.show=function(item, pos){
                    var self=this,node,s,w,h;
                    if(!(node=self.node)){
                        node = self.node = linb.create('<div class="linb-ui-tips"><div class="linb-ui-tips-i"></div></div>');
                        self.n = node.first();
                        if(linb.dom.support('shadow'))node.shadow();
                    }
                    //ensure zindex is the top
                    if(document.body.lastChild!=node.get(0))
                        linb([document.body]).addLast(node);

                    s=item.tips;
                    if(s=s.toString()){
                        //get string
                        s=s.replace(self._r, function(a,b,c){
                            return linb.wrapRes(c);
                        });
                        //set to auto
                        var style=node.get(0).style;
                        style.width=style.height='auto';
                        self.n.get(0).innerHTML=s;
                        //get width
                        w=Math.min(linb.UI.Tips.maxWidth, node.width());
                        //set width
                        if(linb.browser.ie6){
                            style.width=Math.round(w/2)*2+2+'px';
                            h=self.n.height();
                            style.height=Math.round(h/2)*2+'px';
                        }else
                            style.width=w+'px';
                        //pop
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
                id,
                o,t,b=false;

            self.from=self.enode=null;

            if(!node || !from || !(o=from.box))return;

            //keep older
            self._pos=pos=self.pos;

            //check if showTips works
            b=(o.showTips && o.showTips(from, node.id, pos));

            //check if default tips works
            //tips is a base var
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
        show:function(pos, item){
            var self=this,t;
            //same item, return
            if(self.item == item)return;
            //hide first
            if(self.curTemplate)self.curTemplate.hide();

            //base check
            if(!item || !item.tips)return;

            //get template
            t = self.curTemplate = self.Types[item.tipsTemplate] || self.Types['default'];
            t.show(item,pos);

            self.Node=t.node.get(0);

            self.item=item;
            self.showed = true;
        },
        hide:function(flag){
            var self=this;
            if(flag || self.showed){
                if(self.curTemplate)self.curTemplate.hide();
                self.markId = self.from=self.curTemplate = self.item = self.showed = null;
            }
        },
        asyHide:function(){
            var self=this;
            _.resetRun('$Tips', null);
            _.resetRun('$Tips3', null);
            self.markId = self.from=self.curTemplate = self.item = self.showed = null;
        }
    }
});