//singleton
Class("linb.UI.Tips", null,{
    Constructor:function(){return null;},
    Initialize:function(){

        linb([document],false)
        .afterMouseover(function(obj, e, src){
            var node=linb.event.getSrc(e);
            if(/^lang:/.test(node.id))
                node = node.parentNode;
            if(!node)return;

            var id=node.id;
            //check
            if(!id || linb.cache.dom[id])return;
            var from = linb.event._getProfile(id);
            //check
            if(!from || !from.box)return;

            var pos = linb.event.getPos(e);

            //set mark src id
            linb.UI.Tips.srcId = id;
            _.resetRun('$Tips',function(){
                var o=from.box, t, b=false;
                if(!o)return;
                //check if showTips works
                b=(o.showTips && o.showTips(from, id, pos));
                //check if default tips works
                //tips is a base var
                if(!b && (t=from.properties) && (t.tips)){
                    linb.UI.Tips.show(pos, t);
                    b=true;
                }
                //no work hide it
                if(!b)linb.UI.Tips.hide();
                else _.resetRun('$Tips2', linb.UI.Tips.hide,3000,null,linb.UI.Tips);
            },400);

        },'$Tips',-1)
        .afterMouseout(function(obj, e, src){
            var node=linb.event.getSrc(e);
            if(/^lang:/.test(node.id))
                node = node.parentNode;
            if(!node)return;
            var id=node.id;

            //check
            if(!id || !linb.UI.Tips.srcId)return;
            //in timeout
            if(!linb.UI.Tips.flag||id != linb.UI.Tips.srcId){
                _.resetRun('$Tips', null);
            //showed
            }else{
                //set mark src id to null
                this.srcId = null;
                linb.UI.Tips.hide();
            }

        },'$Tips',-1);

        this.Types = {
            'default' : new function(){
                this.show=function(item, pos){
                    if(!this.node){
                        this.node = linb.create('<div style="font-size:0;line-height:0;position:absolute;border:solid gray 1px;background-color:#FFF8DC;overflow:visible;"><div style="font-size:12px;margin:2px;"></div></div>');
                        this.n = this.node.first();
                        this.node.shadow()
                    }
                    //ensure zindex is the top
                    if(document.body.lastChild!=this.node.get(0))
                        linb([document.body],false).addLast(this.node);

                    pos.left+=12;
                    pos.top+=12;
                    var s=item.tips;
                    if(s=s.toString()){
                        s = s.charAt(0)=='$'?linb.UI.getStr(s.slice(1)):s;

                        if(linb.browser.ie)
                            this.node.setStyle({width:'auto',height:'auto'});

                        this.n.html(s);

                        if(linb.browser.ie){
                            var w=this.node.width(), h=this.node.height();
                            w=Math.round(w/2)*2+2;h=Math.round(h/2)*2;
                            this.node.setStyle({width:w+'px',height:h+'px'});
                        }

                        this.node.popToTop(pos,null,3);
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
                        linb([document.body],false).addLast(this.node);
                    }
                    pos.left+=12;
                    pos.top+=12;
                    var s=item.tips;
                    s = s.charAt(0)=='$'?linb.UI.getStr(s.slice(1)):s;
                    this.node.html(s).zIndex(linb.ini.top_zIndex).cssPos(pos);
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
        show:function(pos, item){
            //same item, return
            if(this.item == item)return;

            //hide first
            if(this.curTemplate)this.curTemplate.hide();

            //base check
            if(!item || !item.tips)return;

            //get template
            this.curTemplate = this.Types[item.tipsTemplate] || this.Types['default'];
            this.curTemplate.show(item,pos);

            this.item=item;
            this.flag = true;
        },
        hide:function(flag){
            if(flag || this.flag){
                if(this.curTemplate)this.curTemplate.hide();
                this.curTemplate = this.item = this.flag = null;
            }
        }
    }
});