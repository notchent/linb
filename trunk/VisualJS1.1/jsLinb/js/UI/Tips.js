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
            if((p=_.resetRun.cache) && p['$Tips']){
                tips.enode=event.getSrc(e);
                tips.pos=event.getPos(e);
            }

            //first show
            if(tips.from){
                _.resetRun('$Tips3', null);
                tips._showF();
            //after show, before hide
            }else if(tips.move && tips.flag){
                p=event.getPos(e);
                n=tips.Node.style;
                n.left = (parseInt(n.left)||0) + (p.left-tips._pos.left) +'px';
                n.top = (parseInt(n.top)||0) + (p.top-tips._pos.top) +'px';
                tips._pos=p;
            }
        },'$Tips',-1)
        .afterMouseover(function(obj, e, src){
            var event=linb.event,
                node=event.getSrc(e),
                tips=linb.UI.Tips,
                id,from,pos,sid
            ;
            //clear previous first
            delete tips.from;

            if(node && node.id=='linb:lang')node = node.parentNode;
            if(node && (id=node.id) && !linb.cache.dom[id] && (from=event._getProfile(id)) && from.box){
                if(sid=from.getSubSerialId(id)){
                    while((node=node.parentNode) && node!==document && node!==window && node.id && sid==from.getSubSerialId(node.id))
                        id=node.id;
                }else{
                    sid=from.getSerialId(id)
                    while((node=node.parentNode) && node!==document && node!==window && node.id && sid==from.getSerialId(node.id))
                        id=node.id;
                }

                //set mark src id
                tips.srcId = id;
                _.resetRun('$Tips', function(){
                    tips.from=from;
                    _.resetRun('$Tips3', function(){
                        if(tips.from)
                            tips._showF();
                    },100);
                }, tips.delayTime);
            }else
                tips.hide();
        },'$Tips',-1)
        .afterMouseout(function(obj, e, src){
            var event=linb.event,
                tips=linb.UI.Tips,
                id,sid
                ;
            var node = (e.type=='mouseover'?e.fromElement:e.toElement)||e.relatedTarget;

            //for firefox wearing anynomous div in input/textarea
            try{node && node.id}catch(e){
                node=null;
            }

            if(node && node.id=='linb:lang')node = node.parentNode;
            if(node && (id=node.id) && tips.srcId && (from=event._getProfile(id)) && from.box){
                if(sid=from.getSubSerialId(id)){
                    while((node=node.parentNode) && node!==document && node!==window && node.id && sid==from.getSubSerialId(node.id))
                        id=node.id;
                }else{
                    sid=from.getSerialId(id)
                    while((node=node.parentNode) && node!==document && node!==window && node.id && sid==from.getSerialId(node.id))
                        id=node.id;
                }

                //in timeout
                if(!tips.flag||id === tips.srcId)
                    _.resetRun('$Tips', null);
                //showed
                else{
                    //set mark src id to null
                    tips.srcId = null;
                    tips.hide();

                }
            }
        },'$Tips',-1);

        this.Types = {
            'default' : new function(){
                this.show=function(item, pos){
                    var self=this,node;
                    if(!(node=self.node)){
                        node = self.node = linb.create('<div class="linb-ui-tips"><div class="linb-ui-tips-i"></div></div>');
                        self.n = node.first();
                        if(linb.dom.support('shadow'))node.shadow();
                    }
                    //ensure zindex is the top
                    if(document.body.lastChild!=node.get(0))
                        linb([document.body]).addLast(node);

                    var s=item.tips;
                    if(s=s.toString()){
                        s = s.charAt(0)=='$'?linb.wrapRes(s.slice(1)):s;

                        node.setStyle({width:'auto',height:'auto'});

                        self.n.html(s,false);

                        var w=Math.min(linb.UI.Tips.maxWidth,node.width()),  h=node.height();
                        if(linb.browser.ie6)
                            w=Math.round(w/2)*2+2;h=Math.round(h/2)*2;
                        node.setStyle({width:w+'px',height:h+'px'});

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
                o,t,id,b=false;
            delete self.from;
            delete self.enode;
            if(!node)return;
            if(!from || !(o=from.box))return;

            if(node.id=='linb:lang')node = node.parentNode;
            if(node && (id=node.id) && !linb.cache.dom[id] && linb.event._getProfile(id)==from){
                //keep older
                self._pos=pos=self.pos;

                //check if showTips works
                b=(o.showTips && o.showTips(from, self.srcId, pos));

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
            self.flag = true;
        },
        hide:function(flag){
            var self=this;
            if(flag || self.flag){
                if(self.curTemplate)self.curTemplate.hide();
                self.from=self.curTemplate = self.item = self.flag = null;
            }
        }
    }
});