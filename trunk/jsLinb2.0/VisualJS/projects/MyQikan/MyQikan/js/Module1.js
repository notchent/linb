//内部期刊块的类
Class('MyQikan.Module1', 'linb.Com',{
    Instance:{
        //目前页
        _page:0,
        //一共有多少页
        _allPage:0,
        //当前块是否只读
        readonly:false,
        events:{"onReady":"_onready","afterIniComponents":"_afterIniComponents"},
        _afterIniComponents:function(){
            var ns=this;
            //设置开/关状态
            ns.panelBar.setToggle(parseInt(ns.status)!=1);
        },
        _onready:function(){
            var ns=this;
            //如果不是只读
            if(!ns.readonly){
                //设置动作
                ns.panelBar.setCustomBehavior({
                    HANDLE : {
                        onMousedown : function (profile, e, src) {
                            var subKey = profile.getKey(linb.Event.getSrc(e).id || ""),
                                keys = profile.keys;
                            if (subKey != keys.HANDLE)
                                return;
                            var properties = profile.properties,
                                node = profile.root,
                                dragbegin = function () {
                                    profile.boxing().setDisplay("none");
                                    SPA.layout.prepareDD();
                                },
                                drag = function (p, e, src) {
                                    var ps = SPA._layoutPS;
                                    SPA.layout.doDrag(linb.Event.getPos(e), (t = linb.DragDrop.getProfile()) && (t = t.dragData) && t.height || 20);
                                },
                                endDrag = function (p, e, src) {
                                    var r=SPA.layout.doDrop(linb.Event.getPos(e),linb.DragDrop.getProfile().dragData);
                                    if(!r){
                                        profile.boxing().setDisplay("");
                                    }
                                    linb([src]).onDragbegin(null, null, true).onDrag(null, null, true).onDragstop(null, null, true);
                                };
                            node.startDrag(e, {
                                dragType:"copy", 
                                dragDefer:1, 
                                targetReposition:false, 
                                dragCursor:"move", 
                                dragKey:"iFeed", 
                                dragData:{id:node.id(), 
                                    type:"inner", 
                                    height:node.offsetHeight()
                                }
                            });
                            node.onDragbegin(dragbegin).onDrag(drag).onDragstop(endDrag);
                        }
                    }
                })
                //加关闭按钮
                .setCloseBtn(true);
            }
            //设置title
            if(ns.txtTitle)
                ns.setCaption(ns.txtTitle); 

        },
        setPicToggle:function(v){
            var ns=this;
            ns.picToggle=v;
            if(ns.fsPic)
                ns.fsPic.setToggle(v);
        },
        setCaption:function(v){
            var ns=this;
            ns.txtTitle=v;
            if(ns.panelBar)
                ns.panelBar.setCaption(ns.txtTitle);
        },
        setContent:function(v){
            var ns=this;
            ns._content=v;
            ns._allPage = Math.ceil(v.item.length/CONF.module_page_count);
            if(ns.divCon)
                ns.buildConent(0);
        },
        setPicture:function(v){
            this.pic=v;
        },
        setHref:function(v){
            var ns=this;
            ns.titleHref=v;
            if(ns.panelBar)
                ns.panelBar.setHref(ns.titleHref);
        },

        //build块内的内容
        buildConent:function(page){
            var ns=this,
                vv=ns._content,
                page=page||ns._page;
            if(!vv)return;
            //上一页、下一页
            ns.linkPre.setDisplay(page===0?'none':'');
            ns.linkNext.setDisplay(page===ns._allPage-1?'none':'');

            var c=ns.constructor,
                pc=CONF.module_page_count,
                i=page*pc,
                l=(page+1)*pc,
                a=[],
                v=_.copy(vv),
                item=v.item;
            //href和tips
            for(;i<l;i++)
                if(item[i]){
                    item[i].link='Viewer.html#id='+item[i].id+'&type=article';
                    item[i].tips=item[i].brief;
                    a.push(item[i]);
                }
            v.item=a;
            //加入模板
            if(a.length)
                ns.divCon.setHtml(new linb.Template(
                    null,
                    {
                        '':'<ul class="module-list">{item}</ul>',
                        'item':'<li><a '+(linb.browser.ie?'style="zoom:100%;"':'')+' href="{link}" target="_blank" evkey="item" evid="{id}" onmouseover="[$e]" onmouseout="[$e]" onmousemove="[$e]" onclick="[$e]">{title}</a></>'
                    },
                    {
                        item:{
                            onClick:function(p,e,s){
                                var id = s.getAttribute('evid');
                                _.tryF(ns.onClickArticle,[id],this);
                                return false;
                            }
                        }
                    },
                    v
                ));
        },
        required:["linb.UI.Panel","linb.UI.Pane","linb.UI.Div","linb.UI.Link","linb.UI.Group"],
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var t=this, n=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Panel)
            .host(t,"panelBar")
            .setDock("none")
            .setWidth("auto")
            .setHeight("auto")
            .setPosition("static")
            .setToggle(false)
            .setToggleBtn(true)
            .setCloseBtn(false)
            .setLeft(0)
            .setTop(0)
            .setHandleHeight(22)
            .setCaption("Loading...")
            .beforeClose('_panelbar_beforeclose')
            .onFold('_panelbar_onfold')
            .onExpend('_panelbar_onopen')
            .onClickHandle('_panelbar_onclickhandle')
            .setCustomClass({"KEY":"module-inn","BORDER":"module-inn-border","PANEL":"module-inn-panel","HANDLE":t.readonly?"module-handler-ro":"module-handler","CAPTION":'module-cap'})
            .setCustomStyle({PANEL:'overflow:visible;'})
            .onShowTips('_panelbar_onshowtips')
            .onIniPanelView('_panelbar_onIniPanelView')
            );

            return n;
            // ]]code created by jsLinb UI Builder
        },
        //到上一页
        _linkpre_onclick:function (profile, e) {
            var ns=this;
            if(ns._page>0)ns._page--;
            ns.buildConent();
            return false;
        },
        //到下一页
        _linknext_onclick:function (profile, e) {
            var ns=this;
            if(ns._page<ns._allPage)ns._page++;
            ns.buildConent();
            return false;
        },
        _oldcmd_onclick:function (profile, e) {
            if(this.$magid){
                var id=this.$magid,
                    a=id.split('_');
                    a.pop();
                return _.tryF(this.onClickArticle,[a.join('_')],this)
            }
        },
        _boundcmd_onclick:function(){
            return true;
        },
        //关闭事件
        _panelbar_beforeclose:function(profile,src){
            return _.tryF(this.beforeClose,[this.panelBar],this);
        },
        _panelbar_onIniPanelView:function(profile){
            var t=this, u=linb.UI, f=function(c){n.push(c.get(0))};

            t.panelBar.append(
            (new u.Pane)
            .host(t,"panelCmds")
            .setWidth("auto")
            .setHeight("auto")
            .setPosition("static")
            .setCustomStyle({KEY:'overflow:visible;'})
            .setCustomClass({"KEY":"module-cmdlist"})
            );
            
            if(!t.$viewtype || t.$viewtype=='default'){
                t.panelCmds.append(
                (new u.Link)
                .host(t, 'oldCmd')
                .setPosition("static")
                .setTips("$app.module.oldMagsTips")
                .setCaption("<span class='linb-tag'></span>$app.module.oldMags")
                .onClick("_oldcmd_onclick")
                .setCustomClass({"KEY":"module-oldmag"})
                );
 
                t.panelCmds.append(
                (new u.Link)
                .host(t, 'boundCmd')
                .setPosition("static")
                .setHref(location.href.split('#')+'#v=mag&i='+t.$magid.split("_").slice(0,4).join('_'))
                .setTarget('_blank')
                .setTips("$app.module.boundMagsTips")
                .setCaption("<span class='linb-tag'></span>$app.module.boundMags")
                .onClick("_boundcmd_onclick")
                .setCustomClass({"KEY":"module-boundmag"})
                );
            }

            t.panelBar.append(
            (new u.Group)
            .host(t,"fsPic")
            .setWidth("auto")
            .setHeight("auto")
            .setToggle(false)
            .setPosition("static")
            .setTips("$app.coverpageTips")
            .setCaption("$app.coverpage")
            .setCustomClass({"KEY":"module-pic"})
            .onExpend('_fspic_onopen')
            .onIniPanelView('_fspic_onIniPanelView')
            );

            t.panelBar.append(
            (new u.Div)
            .host(t,"divCon")
            .setWidth("auto")
            .setHeight("auto")
            .setTabindex("2")
            .setCustomStyle({KEY:'overflow:visible;'})
            .setPosition("static")
            );

            t.panelBar.append(
            (new u.Pane)
            .host(t,"panelB")
            .setWidth("auto")
            .setPosition("static")
            .setHeight("16")
            .setTabindex("3")
            .setCustomStyle({KEY:'overflow:visible;'})
            );

            t.panelB.append(
            (new u.Link)
            .host(t,"linkPre")
            .setValue("")
            .setPosition('static')
            .setTips("$app.module.nextTips")
            .setCaption("<span class='linb-tag'></span>$app.module.pre")
            .onClick("_linkpre_onclick")
            .setCustomClass('KEY','cmd-pre')
            );

            t.panelB.append(
            (new u.Link)
            .host(t,"linkNext")
            .setPosition('static')
            .setValue("")
            .setTips("$app.module.nextTips")
            .setCaption("$app.module.next<span class='linb-tag'></span>")
            .onClick("_linknext_onclick")
            .setCustomClass('KEY','cmd-next')
            );
            
            //设置href
            if(t.titleHref)
                t.setHref(t.titleHref);
            //设置内容
            if(t._content)
                t.setContent(t._content);        
            
            //设置显示图片
            if(t.picToggle)
                t.setPicToggle(t.picToggle);            
        },
        //折叠事件
        _panelbar_onfold:function(profile){
            return _.tryF(this.onToggle,[1],this);
        },
        //展开事件
        _panelbar_onopen:function(profile){
            return _.tryF(this.onToggle,[0],this);
        },
        //点击
        _panelbar_onclickhandle:function(profile,src){
            if(this.$magid){
                //if(!src.target)src.target='_blank';
                _.tryF(this.onClickArticle,[this.$magid+"_"],this);
            }
            return false;
        },
        _panelbar_onshowtips:function(profile,node,pos){
            var id=node.id,
                keys=profile.keys,
                key=profile.getKey(id),
                t1=linb.getRes('app.module.toggleTips'),
                t3=linb.getRes('app.module.openMagTips'),
                t2=linb.getRes('app.module.closeTips'),
                tips=key==keys.TOGGLE?t1:key==keys.CLOSE?t2:key==keys.CAPTION?t3:'';
            if(tips){
                linb.Tips.show(pos, tips);
                return true;
            }
        },
        _fspic_onopen:function(profile){
            if(!this.pic)return false;
        },
        _fspic_onIniPanelView:function(profile){
            var ns=this;
            if(ns.pic)
                _.asyRun(function(){
                    //don't set img width here, it will trigger the third col wrap
                    ns.fsPic.setHtml('<div style="text-align:center"><img height="340" src="'+ns.pic+'" style="padding:3px;"></div>')
                    .reBoxing().ieRemedy();
                });
            else
                return false;
        }
    }
});