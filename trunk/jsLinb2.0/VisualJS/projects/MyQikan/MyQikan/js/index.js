Class('MyQikan', 'linb.Com',{
    Instance:{
        base:["linb.UI"],
        required:["linb.UI.Pane","linb.UI.Panel","linb.UI.TreeBar","linb.UI.Tabs","linb.UI.Layout","linb.UI.ColLayout","linb.UI.Button","linb.UI.Link","linb.UI.Div","linb.UI.Input"],
        events:{"onReady":"_onready","afterIniComponents":"_afterIniComponents"},
        _afterIniComponents:function(){
            var ns=this,display='none';
            //默认隐藏的控件
            ns.panelFeedback.setDisplay(display);
            ns.panelMain.setDisplay(display);
            ns.panelLeft.setDisplay(display);
            ns.btnLogin.setDisplay(display);
            ns.btnLogout.setDisplay(display);

            ns.btnShowLeft.setDisplay(display);
            ns.panelTreeInfo.setDisplay(display);
            ns.treebar.setDisplay(display);

            //ns.tabs.setDisplay(display);
            //ns.layout.setDisplay(display);
            ns.panelReader.setDisplay(display);

            ns.divContent.setCustomStyle(linb.browser.ie?{KEY:'overflow-y:auto;'}:{KEY:'overflow:auto;'});
            if(linb.browser.ie){
                var o={PANEL:'overflow-x:hidden;'};
                ns.panelLeft.setCustomStyle(o);
                ns.panelbarI.setCustomStyle(o);
            }
        },
        _onready:function(ns,threadid){
            SPA=this;

            SPA.urlHash = _.urlDecode(location.href.split('#')[1]);
            //页面是否可以定制化
            if(SPA._viewtype=SPA.urlHash.v)
                SPA.readonly=true;

            //默认皮肤
            SPA.skinKey='default';

            //初始化 com factory 数据
            linb.ComFactory.setProfile(CONF.ComFactoryProfile);
            //刷新界面
            SPA.refreshUI(threadid);

            //解决opera有默认焦点的bug
            if(linb.browser.opr)
                linb([document.body]).append(  linb.create("<button style='left:-10000px;top:-10000px;position:absolute;'></button>") )
        },
        //改变皮肤
        ChangeSkin:function(skin){
            skin = skin || 'default';

            //设置皮肤
            if(skin){
                if(SPA.skinKey)
                    linb.CSS.remove('title', SPA.skinKey);
                SPA.skinKey = skin;
                linb.CSS.includeLink(linb.getPath('MyQikan','main.css','css/'+skin+'/'),skin,false);
            }
        },
        AddReturnCustomBtn:function(){
            this.panelTopBar.append(
            (new linb.UI.Link)
            .host(this,"returnCustomBtn")
            .setDomId("returnCustomBtn")
            .setLeft(10)
            .setTop(2)
            .setHref(location.href.split('#')[0])
            .setCaption("<span class='linb-tag'></span>$app.returnCustomBtn")
            .setTips("$app.returnCustomBtnTips")
            .onClick("_returnCustomBtn_onclick")
            );            
        },
        refreshUI:function(threadid){
            //先清空
            delete SPA._defaultProfile;
            delete SPA._getprofiledone;
                        
            var nn=linb('linb:loading:'),
                onEnd=function(data){

                if(!nn.isEmpty())nn.remove();

                //设置皮肤
                SPA.ChangeSkin(data.page.themeurl);

                //是否有写API功能
                SPA.auth = !!SPA.getAuthStr();

                //设置控件可见否
                var d1=SPA.auth?'none':'',
                    d2=SPA.auth?'':'none'
                    ;
                //版权信息
                SPA.panelBottom.setHtml(linb.getRes("app.bottomInfo"));

                SPA.divNologinInfo.setHtml(SPA.auth?(linb.getRes('app.welcome')+' ' + (SPA.getCookie('qk_username')||SPA.getCookie('qk_loginname'))):linb.getRes(SPA.readonly?'app.notloginInfo':'app.notloginInfo2'))
                SPA.btnLogin.setDisplay(d1);
                SPA.panelLogin.setDisplay(d1);
                SPA.btnLogout.setDisplay(d2);

                //如果不是只读状态
                if(!SPA.readonly){
                    SPA.btnShowLeft.setDisplay('');
                    //显示定制信息
                    SPA.panelTreeInfo.setDisplay('');
                    SPA.treebar.setDisplay('');

                    //设置treebar可以拖拽
                    var dragbegin=function(){
                        //prepare layout drop size/pos
                        SPA.layout.prepareDD();
                    },
                    drag=function(p,e,src){
                        var ps=SPA._layoutPS;
                        SPA.layout.doDrag(linb.Event.getPos(e));
                    },
                    endDrag=function(p,e,src){
                        SPA.layout.doDrop(linb.Event.getPos(e), linb.DragDrop.getProfile().dragData);
                        linb([src]).onDragbegin(null,null,true).onDrag(null,null,true).onDragstop(null,null,true);
                    };
                    SPA.treebar.setCustomBehavior({
                        BAR:{
                            onMousedown:function(profile, e, src){
                                var properties = profile.properties,
                                    item = profile.getItemByDom(src),
                                    node = linb([src]);
                                if(item.dragable){
                                    node.startDrag(e,{
                                        dragType:'deep_copy', 
                                        dragDefer:1, 
                                        targetReposition:false, 
                                        dragCursor:'move', 
                                        dragKey:'iFeed', 
                                        dragData:{
                                            id:item.value+'_latest',
                                            type:'inner',
                                            mode:'new',
                                            item:item,
                                            _obj:item._obj
                                         }
                                   });
                                    linb([src]).tagClass('-mouseover', false);
                                    //set dom drag function
                                    node.onDragbegin(dragbegin).onDrag(drag).onDragstop(endDrag);
                                }
                            }
                        }
                    });
                }

                _.asyRun(function(){
                    if(!SPA.getCookie('feedbackflag')){
                        SPA.panelFeedback.setDisplay('');
                        SPA.panelFeedback.reBoxing().ieRemedy();
                    }
                },1000);

                SPA.panelMain.setDisplay('');
                SPA.setProfile(data);
            };
            if(!nn.isEmpty())
                nn.html(linb.getRes('app.trytoLogin'),false);

            //显示
            switch(SPA._viewtype){
                case 'cat':
                    var id=SPA.urlHash.i;
                    SPA.requestData({api:"MyQikan.Mag.list", id: id},function(obj){
                        if(obj.res=="ok"){
                            var data={
                                auth:{},
                                views:[],
                                modules:[],
                                page:{
                                    title: linb.getRes('app.view_cat_tilte', obj.info.name)
                                }
                            };
                            obj.data.each(function(o,i){
                                if(o.type=="seccat")
                                    data.views.push({
                                        id:o.id,
                                        title:o.name
                                    })
                            });
                            onEnd(data);
                        }
                    });
                    SPA.AddReturnCustomBtn();
                    break;
                case 'mag':
                    var id=SPA.urlHash.i;
                    SPA.requestData({api:"MyQikan.Mag.list", id: id},function(obj){
                        if(obj.res=="ok"){
                            var data={
                                auth:{},
                                views:[],
                                modules:[],
                                page:{
                                    title: linb.getRes('app.view_mag_tilte', (obj.info && obj.info.name) || "")
                                }
                            };
                            obj.data.each(function(o,i){
                                if(o.type=='year')
                                    data.views.push({
                                        id:o.id,
                                        title:o.name
                                    })
                            });
                            onEnd(data);
                        }
                    });
                    SPA.AddReturnCustomBtn();
                    break;
                default:
                    //如果有删除这个按钮
                    if(SPA.returnCustomBtn)
                        SPA.returnCustomBtn.destroy();

                    //如果没有默认的profile object
                    SPA.requestCacheData({id:'profile_default'},function(obj){
                        if(obj.res=="ok"){
                            //设置变量
                            SPA._defaultProfile = obj.data[0];
                            //如果已经设置了flag，显示
                            if(SPA._getprofiledone)
                                onEnd(SPA._defaultProfile);
                        }
                    },null);     

                    if(SPA.getCookie('qk_token')  && SPA.getCookie('qk_email'))
                        //得到自己的或默认的profile数据
                        SPA.requestData({api:"MyQikan.My.profile.get"},function(obj){
                            if(obj.res=="ok"){
                                var data=obj.data[0];
                                //自动登录
                                if(data.auth && data.auth['qk_email'])
                                    SPA.setCookies(data.auth, CONF.cookieExpired);
                
                                //如果当前token/email没有自动登陆，自动清空cookie
                                if(data['nocustomdata']){
                                    SPA.clearCookies();
                                    //设置flag
                                    SPA._getprofiledone=true;
                                    //如果已经得到default profile数据，显示
                                    if(SPA._defaultProfile)
                                        onEnd(SPA._defaultProfile);                                
                                }else
                                    onEnd(data);
                            }
                        },threadid);
                    else{
                        //设置flag
                        SPA._getprofiledone=true;
                        //如果已经得到default profile数据，显示
                        if(SPA._defaultProfile)
                            onEnd(SPA._defaultProfile);
                    }
            }
        },
        //设置profile到UI
        setProfile:function(p){
            var ns=this,
                views=p.views,
                page=p.page,
                hash,t,
                tips=linb.getRes("app.tabCloseBtnTips"),
                items=[]
            ;

            //如果以前有，清空
            if(ns.profile){
                if(t=ns.profile.modules){
                    t.each(function(o){
                        if(o=o._obj)
                            o.destroy();
                    });
                }
            }
            //保存变量到SPA
            ns.profile=p;
            ns.profileId=p.page.id;

            //build tabs according to cols
            views.each(function(o,i){
                hash={id:o.id, caption:o.title};
                if(i!==0)
                    hash.closeBtn = SPA.readonly?false:true;
                items.push(hash);
            });
            //设置到tabs
            ns.tabs
            .setItems(items)
            .onShowTips(function(profile,node,pos){
                var id=node.id,
                    keys=profile.keys,
                    key=profile.getKey(id);
                if(key==keys.CLOSE){
                    linb.Tips.show(pos, tips);
                    return true;
                }
            });
            if(items[0])
                ns.tabs.fireItemClickEvent(items[0].id);

            //如果不是只读，加一个“新建主题”按钮
            if(!SPA.readonly){
                ns.tabs.getSubNode('ITEMS').append(
                    ns.addTab = new linb.UI.Link({
                        position:'relative',
                        caption:'<span class="linb-tag"></span>$app.newTopic',
                        tips:"$app.newTopicTips"
                    })
                    .setDomId('cmdAddTab')
                );
                ns.addTab.onClick(function(profile){
                    if(ns.panelReader.getDisplay()!='none'){
                        ns.panelReader.setDisplay('none');
                        ns.layout.setDisplay('');
                    }
                    var node=profile.root,
                        pos=node.offset(),
                        pp={type:'none',
                            saveBtn:true,
                            left:pos.left,
                            top:pos.top
                        },
                        editor = linb.create('linb.UI.Input', pp);
                        editor
                        .setValue(linb.getRes('app.newTopic'))
                        .onHotKeydown(function(p,key){
                            if(key=='enter'){
                                if(SPA.tabs.getItems().length>=CONF.maxTopics){
                                    linb.message(linb.getRes('app.maxTopics'));
                                    editor.destroy();
                                    return false;
                                }

                                //opera dont trigger onchange here
                                if(linb.browser.opr)
                                    p.boxing().setUIValue(p.boxing()._getCtrlValue());

                                var v=p.properties.$UIvalue, callback=function(id){
                                    var caption=v;
                                    SPA.tabs.insertItems([{id:id,caption:caption,closeBtn:true}],null,false)
                                    //一定要fireevent
                                    .fireItemClickEvent(id);

                                    //move add command to the last
                                    node.parent().append(node);
                                };
                                //UI得到新的viewid
                                var viewid;
                                for(var i=1;i<1000;i++){
                                    if(!SPA.tabs.getItemByItemId(String(i))){
                                        viewid=String(i);
                                        break;
                                    }
                                }
                                //先调用
                                callback(viewid);
                                //如果登陆，调用server
                                if(!SPA.readonly && SPA.auth)
                                    SPA.requestData({api:"MyQikan.My.view.add", type:'default', profileId: SPA.profileId, id:viewid, Title:v}, function(obj){
                                        if(obj.res=="ok"){
                                            //同步内存变量object
                                            SPA.profile.views.push(obj.data[0]);
                                        }
                                    });


                                _.asyRun(function(){
                                    editor.destroy();
                                });
                                return false;
                            }else if(key=='esc')
                                editor.destroy();
                        })
                        .reBoxing().setBlurTrigger(editor.KEY+":"+editor.$id, function(){
                            editor.destroy();
                        });

                    linb([document.body]).append(editor);
                    _.asyRun(function(){
                        editor.activate()
                    });
                });
            }

            //设置页面的定制化标题
            ns.linkTitle.setCaption(page.title || "$app.dftCaption");
        },
        requestCacheData:function(obj, onOK, threadid, onFail, sycn){
            obj.$id = CONF.staticIDTag + obj.id;
            MyQikan.sajax(CONF.cacheServer + obj.id.replace(/_/g,'/') + '.js', obj, onOK, onFail, threadid).start();
        },
        //从server API得到数据
        requestData:function(obj, onOK, threadid, onFail, sycn){
            var fun=function(threadid){
                //是否从静态服务器取数据
                if(CONF.staticAPIs[obj.api]){
                    obj.id = obj.id || "";
                    obj.$id = CONF.staticIDTag + obj.id;
                    MyQikan.sajax(CONF.staticServer + (obj.id? obj.id.replace(/_/g,'/') + '/':'') + CONF.staticDftName , obj, onOK, onFail, threadid).start();
                }else
                    MyQikan.sajax(CONF.apiServer,obj,onOK,onFail,threadid).start();
            };
            if(sycn)
                fun();
            else
                linb.Thread.observableRun(threadid, [fun]);
        },
        //得到认证信息，email作为id
        getAuthStr:function(){
            var a=this.getCookie('qk_token'), b=this.getCookie('qk_email');
            return  (a&&b) ? '&qk_token='+a+'&qk_email='+b : '';
        },
        //得到某个cookie
        getCookie:function(key){
            return linb.Cookies.get(key);
        },
        //设置cookies(API返回的4个）
        setCookies:function(o, days){
            for(var i in o)
                linb.Cookies.set(i, decodeURIComponent(o[i]), days);
        },
        //清空4个cookies
        clearCookies:function(){
            linb.Cookies.remove('qk_token').remove('qk_username').remove('qk_email').remove('qk_loginname');
        },
        //自定义错误消息
        Alert:function(s){
            linb.message(s);
        },
        //把数组转换成treebar的格式
        formatTreeArr:function(arr,page){
            page=parseInt(page)||0;
            var a=[],mag,
                max=CONF.maxListCount,
                itemFrom=max*page,
                itemTo=itemFrom+max,
                t,l,i,
                tag=linb.getRes('app.words.page'),
                wrap=linb.wrapRes,
                map={
                    root:'left -101px',
                    cat:'-17px -101px',
                    seccat:'-17px -101px',
                    mag:'-33px -101px',
                    year:'-49px -101px',
                    issue:'-65px -101px',
                    inner:'-81px -101px',
                    latest:'-97px -101px'
                }
            ;
            arr.each(function(o,j){
                if(j<itemFrom || j>=itemTo)
                    return;
                o.child = parseInt(o.child) || 0;
                o.childtype = o.childtype || 'no';
                l=Math.ceil(o.child /max) || 1;
                mag=o.type=="mag";
                for(i=0;i<l;i++)
                    a[a.length]={
                        _obj:o,
                        id: o.id + ':' + i,
                        value:o.id,
                        type:o.type,
                        sub:(!mag && o.child)?[]:null,
                        //group:(o.child && o.type!='cat'),
                        dragable:mag,
                        page:i,
                        href:'#v='+o.type+'&i='+o.id,
                        caption:'<span class="linb-tag" style="background-position:'+map[mag?'latest':o.type]+'"></span>'+  o.name + (mag?'':'(' + o.child + wrap('app.unit.' + o.childtype) + ')' +(l>1?tag.replace('#',i+1):'')),
                        tips: (o.img?
                                '<img style="float:left;padding:4px;" width="90" height="115" alt="..." src="'+o.img+'">':
                              '') +
                              '<div class="mag-tips">' + o.brief + '...</div>'
                    }
            });
            return a;
        },
        //把数组转换成treebar的格式 for treebarI
        formatTreeArr2:function(arr,page){
            page=parseInt(page)||0;
            var a=[],
                max=CONF.maxListCount,
                itemFrom=max*page,
                itemTo=itemFrom+max,
                t,l,i,
                tag=linb.getRes('app.words.page'),
                wrap=linb.wrapRes,
                map={
                    root:'left -101px',
                    cat:'-17px -101px',
                    seccat:'-17px -101px',
                    mag:'-33px -101px',
                    year:'-49px -101px',
                    issue:'-65px -101px',
                    inner:'-81px -101px',
                    latest:'-97px -101px'
                }
            ;
            arr.each(function(o,j){
                if(j<itemFrom || j>=itemTo)
                    return;
                o.child = parseInt(o.child) || 0;
                o.childtype = o.childtype || 'no';
                l=Math.ceil(o.child /max) || 1;
                for(i=0;i<l;i++)
                    a[a.length]={
                        id: o.id + ':' + i,
                        value:o.id,
                        type:o.type,
                        sub:o.child?[]:null,
                        page:i,
                        href : o.type=='inner'?o.link:'#id='+o.id ,
                        caption: '<span class="linb-tag" style="background-position:'+map[o.type]+'"></span>'+  o.name + (o.type!='inner'?' (' + o.child + wrap('app.unit.' + o.childtype) + ')':'') + (l>1?tag.replace('#',i+1):''),
                        tips: (o.img?
                                '<img style="float:left;padding:4px;" width="90" height="115" alt="..." src="'+o.img+'">':
                              '') +
                              '<div class="mag-tips">' + o.brief + '...</div>'
                    }
            });
            return a;
        },
        //render文章
        renderArticle:function(value){
            //google trace
            /*
            if(window["readTracker"]){
                _.asyRun(function(){
                    if(!value)
                        readTracker._trackEvent('preView');
                    else
                        readTracker._trackEvent('chargeView', SPA.getCookie('qk_email'));
                })
            };*/
            if(window["pageTracker"]){
                _.asyRun(function(){
                    if(!value)
                        pageTracker._trackPageview("/view_free_article");
                    else
                        pageTracker._trackPageview("/view_whole_article");
                })
            };

            SPA.clearArticle();
            SPA.divHead.setHtml('<p  class="loadingBlock"><span></span>'+linb.getRes('app.loading')+'</p>');

            SPA.requestData({api:"MyQikan.Mag.reader", titleid: SPA.articleId, paid:value||""},function(obj){
                if(obj.res=="ok"){
                    if(value && window["pageTracker"]){
                        _.asyRun(function(){
                            pageTracker._trackPageview("/charge_1_jiao");
                        })
                    }

                    var d=obj.data[0];
                    //第一页
                    if(d.pages && !SPA.articlePageCount)
                        SPA.articlePageCount=1;
                    //其他页
                    if(SPA.articlePageCount)
                        d.cur_page='<span class="title-page">' + linb.getRes('app.title_page',SPA.articlePageCount) + "</span>";
                    
                    SPA.divHead.setHtml(SPA.buildTitle(d));
                    if(!value)
                        d.content += " ... <a id='needCharge'href='javascript:;' onclick='SPA._linkcharge_onclick();return false;'>"+linb.getRes("app.needCharge")+"</a>";
                    SPA.divContent.setHtml(SPA.buildContent(d));
                    if(value && d.pdf){
                        SPA.divContent.reBoxing().append(
                            linb.create('<p class="multipages-list">'+linb.getRes('app.pdfText')+'</p>')
                        ).append(
                            linb.create('<p  class="multipages-list"><a href="'+d.pdf+'" target="_blank">'+linb.getRes('app.pdfLink')+'</a></p>')
                        );
                    }
                    if(d.pages){
                        var item = [], a=d.pages.split(',');
                        a.each(function(o,i){
                            item.push({id:o, title: linb.getRes('app.title_page',i+1), cls:o==SPA.articleId?"currentPage":"" });
                        });
                        SPA.divContent.reBoxing().append(
                            linb.create(
                                (new linb.Template(
                                    null,
                                    {
                                        '':'<p class="multipages-list" >'+linb.getRes('app.multiPages')+'{item}</p><p>&nbsp;</p>',
                                        'item':'&nbsp;&nbsp;<a href="javascript:;" class="{cls}" evkey="item" evid="{id}" onclick="[$e]">{title}</a>&nbsp;&nbsp;'
                                    },
                                    {
                                        item:{
                                            onClick:function(p,e,s){
                                                var id = s.getAttribute('evid');
                                                SPA._clickMultiPage(id);
                                                return false;
                                            }
                                        }
                                    },
                                    {item:item}
                                )).toString()
                            )
                        );

                    }
                }else{
                    SPA.clearArticle();
                    if(obj.errorid=='016')
                        SPA.divHead.setHtml('<p style="text-align:center;">'+linb.getRes("app.needAddMoney")+'</p>');
                }
            });
        },
        clearArticle:function(){
            SPA.divHead.setHtml("");
            SPA.divContent.setHtml("");
        },
        //内容
        buildContent:function(obj){
            return new linb.Template(
                null,
                {
                    '':'<div class="article-content">{content}</div>'
                },
                null,
                obj
            );
        },
        //标题部分
        buildTitle:function(obj){
            return new linb.Template(
                null,
                {
                    '':'<div class="article-title">{title_name}{cur_page}</div>' + '<div class="article-author">{author}</div>'  + '<div class="article-ltitle">{journal_name}&nbsp;{year}'+linb.getRes('app.yearInfo')+'&nbsp;{periodnum}'+linb.getRes('app.periodInfo')+'&nbsp;&nbsp;&nbsp;&nbsp;'+linb.getRes('app.lens_info')+' {lens}</div>'
                },
                null,
                obj
            );
        },
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var t=this, n=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Panel)
            .host(t,"panelLeft")
            .setDomId("panelLeft")
            .setDock("none")
            .setLeft("0")
            .setTop("0")
            .setWidth("220")
            .setCloseBtn(true)
            .setZIndex(50)
            .setCaption("$app.panelLeft")
            .beforeClose("_panelLeft_beforeclose")
            .setCustomClass({PANEL:'panelLeft-panel'})
            .onShowTips('_panelleft_onshowtips')
            .onLayout('_panelleft_afterRendered')
            );

            t.panelLeft.append(
            (new u.Pane)
            .host(t,"panelLogin")
            .setDomId("panelLogin")
            .setPosition("static")
            .setWidth("auto")
            .setHeight(110)
            );

            t.panelLogin.append(
            (new u.Input)
            .host(t,"inputUsr")
            .setDomId("inputUsr")
            .setLeft(70)
            .setTop(30)
            .setZIndex(50)
            .onHotKeydown("_inputusr_onhotkeypress")
            );

            t.panelLogin.append(
            (new u.Div)
            .host(t,"divLoginInfo")
            .setDomId("divLoginInfo")
            .setPosition("relative")
            .setWidth("auto")
            .setHeight(20)
            .setHtml("$app.loginInfo")
            );

            t.panelLogin.append(
            (new u.Input)
            .host(t,"inputPwd")
            .setDomId("inputPwd")
            .setType("password")
            .setLeft(70)
            .setTop(55)
            .setZIndex(50)
            .onHotKeydown("_inputusr_onhotkeypress")
            );

            t.panelLogin.append(
            (new u.Div)
            .host(t,"divPwd")
            .setDomId("divPwd")
            .setHtml("$app.txtPwd")
            .setLeft(10)
            .setTop(55)
            .setWidth(50)
            .setHeight(20)
            );

            t.panelLogin.append(
            (new u.Div)
            .host(t,"divUsr")
            .setDomId("divUsr")
            .setHtml("$app.txtUsr")
            .setLeft(10)
            .setTop(30)
            .setWidth(50)
            .setHeight(20)
            );

            t.panelLogin.append(
            (new u.Button)
            .host(t,"btnLogIn")
            .setDomId("btnLogIn")
            .setLeft(70)
            .setTop(84)
            .setCaption("$app.login")
            .setTips("$app.loginTips")
            .onClick("_login_onclick")
            );

            t.panelLeft.append(
            (new u.Pane)
            .host(t,"panelTreeInfo")
            .setDomId("panelTreeInfo")
            .setPosition("relative")
            .setWidth("auto")
            .setHeight(22)
            );

            t.panelTreeInfo.append(
            (new u.Link)
            .host(t,"btnHow2dd")
            .setDomId("btnHow2dd")
            .setPosition("static")
            .setCaption("<span class='linb-tag'></span>$app.browserMags")
            .onClick("_btnhow2dd_onclick")
            );

            t.panelLeft.append(
            (new u.TreeBar)
            .host(t,"treebar")
            .setDomId("treebar")
            .setItems([])
            .setGroup(true)
            .setSingleExpend(true)
            .setDynDestroy(true)
            .setPosition("relative")
            .setValue("")
            .setDock("none")
            .setSelMode("none")
            .onGetContent("_treebar_onrequestdata")
            .onItemSelected("_treebar_onitemselected")
            .setCustomClass({BAR:'treebar-bar'})
            );

            f(
            (new u.Pane)
            .host(t,"panelMain")
            .setDomId("panelMain")
            .setWidth("auto")
            .setHeight("auto")
            .setPosition("relative")
            );

            t.panelMain.append(
            (new u.Pane)
            .host(t,"panelTop")
            .setDomId("panelTop")
            .setPosition("relative")
            .setWidth("auto")
            .setHeight("auto")
            );

            t.panelTop.append(
            (new u.Pane)
            .host(t,"panelTopBar")
            .setDomId("panelTopBar")
            .setPosition("relative")
            .setWidth("auto")
            .setHeight(20)
            );

            t.panelTopBar.append(
            (new u.Div)
            .host(t,"divNologinInfo")
            .setDomId("divNologinInfo")
            .setDomId("divNotlogin")
            .setPosition("static")
            .setWidth("auto")
            .setHeight("auto")
            .setZIndex(10)
            );

            t.panelTopBar.append(
            (new u.Link)
            .host(t,"btnLogin")
            .setDomId("cmdLogin")
            .setPosition("static")
            .setCaption("<span class='linb-tag'></span>$app.login")
            .setTips("$app.loginTips")
            .setZIndex(20)
            .onClick("_btnlogin_onclick")
            );

            t.panelTopBar.append(
            (new u.Link)
            .host(t,"btnLogout")
            .setDomId("cmdLogout")
            .setPosition("static")
            .setCaption("<span class='linb-tag'></span>$app.logout")
            .setTips("$app.logoutTips")
            .setZIndex(30)
            .onClick("_btnlogout_onclick")
            );

            t.panelTopBar.append(
            (new u.Link)
            .host(t,"btnShowLeft")
            .setDomId("cmdAddmodule")
            .setLeft(10)
            .setTop(2)
            .setCaption("<span class='linb-tag'></span>$app.addModule")
            .setTips("$app.addModuleTips")
            .onClick("_btnshowleft_onclick")
            );

            t.panelTop.append(
            (new u.Pane)
            .host(t,"panelTitle")
            .setDomId("panelTitle")
            .setWidth("auto")
            .setHeight(30)
            .setPosition("relative")
            .setTabindex("10")
            );

            t.panelTitle.append(
            (new u.Link)
            .host(t,"linkTitle")
            .setDomId("linkTitle")
            .setHeight(30)
            .setCaption("")
            .setPosition("relative")
            .setTips('$app.titleTips')
            .onClick("_linkTitle_onclick")
            .setCustomClass({"KEY":"div-title"})
            );

            t.panelTop.append(
            (new u.Tabs)
            .host(t,"tabs")
            .setDomId("tabs")
            .setPosition("relative")
            .setWidth("auto")
            .setHeight("auto")
            .setItems([])
            .setHasPanel(false)
            .setDock("none")
            .setTabindex("20")
            .setValue("")
            .beforePageClose("_tabs_beforepageclose")
            .afterPageClose("_tabs_afterpageclose")
            .onItemSelected("_tabs_onitemselected")
            .beforeUIValueSet('_tabs_beforevu')
            .onCaptionActive("_tabs_onitemactive")
            );

            t.panelTop.append(
            (new u.Link)
            .host(t,"linkDemo")
            .setDomId("linkDemo")
            .setLeft('auto')
            .setTop(40)
            .setRight(5)
            .setTips('$app.linkDemoTips')
            .setCaption('<span class="linb-tag"></span>$app.linkDemo')
            .onClick('_linkDemo_onclick')
            );

            t.panelTop.append(
            (new u.Link)
            .host(t,"linkEmail")
            .setDomId("linkEmail")
            .setLeft('auto')
            .setTop(40)
            .setRight(100)
            .setTips('$app.linkEmailTips')
            .setCaption('<span class="linb-tag"></span>$app.linkEmail')
            .onClick('_linkEmail_onclick')
            );

            t.panelMain.append(
            (new u.ColLayout)
            .host(t,"layout")
            .setDomId("layout")
            .setDock("none")
            .setLeft(0)
            .setWidth("auto")
            .setHeight("auto")
            .setTabindex("30")
            .setPosition("static")
            .setDropKeys("iFeed")
            .setItems([{"id":"1","width":"30.3%"},{"id":"2","width":"30.3%"},{"id":"3","width":"39.2%"}])
            .onDropItem("_layout_ondropitem")
            .setCustomClass({ITEM:'layout-item', MOVE:'layout-move'})
            );

            t.panelMain.append(
            (new u.Pane)
            .host(t,"panelBottom")
            .setDomId("divBottom")
            .setWidth("auto")
            .setHeight(80)
            .setTabindex("50")
            .setPosition("relative")
            );

            f(
            (new u.Pane)
            .host(t,"panelReader")
            .setDock('fill')
            .setDomId("panelReader")
            .setDockMargin({left:1,right:0,top:60,bottom:0})
            .setCustomStyle('KEY','overflow:hidden;')
            );

            t.panelReader.append(
            (new u.Pane)
            .host(t,"panelReaderBar")
            .setDomId("panelReaderBar")
            .setDock('top')
            .setHeight(26)
            );

            t.panelReaderBar.append(
            (new u.Div)
            .host(t,"divReaderTitle")
            .setDomId("divReaderTitle")
            .setWidth('auto')
            .setHeight('auto')
            .setPosition('static')
            .setHtml('$app.articleWnd')
            );

            t.panelReaderBar.append(
            (new u.Link)
            .host(t,"linkReaderClose")
            .setDomId("linkReaderClose")
            .setLeft('auto')
            .setTop(4)
            .setRight(4)
            .setTips('$app.readerCloseTips')
            .setCaption('$app.readerClose<span class="linb-tag"></span>')
            .onClick('_linkReaderClose_click')
            );


            t.panelReader.append(
            (new u.Layout)
            .host(t,"layoutI")
            .setDomId("layoutI")
            .setItems([{"id":"before","pos":"before","locked":false,"size":300,"min":50,"max":500,"hide":false,"cmd":true},{"id":"main","min":10}])
            .setType("horizontal")
            );

            t.layoutI.append(
            (new u.Panel)
            .host(t,"panelbarI")
            .setDomId("panelbarI")
            .setCloseBtn(true)
            .setCaption("")
            .setCloseBtn(false)
            .onClickHandle("_panelbari_onclickhandle")
            .setCustomClass({ICON:'panelbarI-icon'})
            .onLayout('_panelleft_afterRendered')
            ,'before');

            t.panelbarI.append(
            (new u.TreeBar)
            .host(t,"treebarI")
            .setDomId("treebarI")
            .setItems([])
            .setDock('none')
            .setWidth('auto')
            .setPosition('relative')
            .setGroup(true)
            .setSingleExpend(true)
            .setDynDestroy(true)
            .onGetContent("_treebarI_onrequestdata")
            .onItemSelected("_treebarI_onitemselected")
            .setCustomClass({BAR:'treebari-bar'})
            );

            t.layoutI.append(
            (new u.Pane)
            .host(t,"panelArticle")
            .setDomId("panelArticle")
            .setDock('fill')
            ,'main');

            t.panelArticle.append(
            (new u.Pane)
            .host(t,"panelHead")
            .setDomId("panelHead")
            .setHeight(100)
            .setDock("top")
            .setCustomClass({"KEY":"article-header"})
            );

            t.panelHead.append(
            (new u.Div)
            .host(t,"divHead")
            .setDomId("divHead")
            .setPosition('relative')
            .setWidth('auto')
            .setHeight('auto')
            );
            t.panelHead.append(
            (new u.Link)
            .host(t,"linkSmall")
            .setDomId("linkSamll")
            .setLeft('auto')
            .setRight("90")
            .setBottom("70")
            .setDomId('fontSmall')
            .setCaption("$app.fontSmall")
            .onClick("_fontsmall_onclick")
            );

            t.panelHead.append(
            (new u.Link)
            .host(t,"linkMiddle")
            .setDomId("linkMiddle")
            .setLeft('auto')
            .setCaption("$app.fontMiddle")
            .setRight("67")
            .setBottom("70")
            .setDomId('fontMiddle')
            .onClick("_fontmiddle_onclick")
            );

            t.panelHead.append(
            (new u.Link)
            .host(t,"linkBig")
            .setDomId("linkBig")
            .setLeft('auto')
            .setCaption("$app.fontBig")
            .setRight("40")
            .setBottom("70")
            .setDomId('fontBig')
            .onClick("_fontbig_onclick")
            );

            t.panelArticle.append(
            (new u.Div)
            .host(t,"divContent")
            .setDomId("divContent")
            .setDock("fill")
            .setCustomClass({KEY:'middle-font'})
            );

            f(
            (new u.Pane)
            .host(t,"panelFeedback")
            .setDomId("panelFeedback")
            .setWidth(300)
            .setHeight(180)
            .setLeft('auto')
            .setTop('auto')
            .setRight(0)
            .setBottom(0)
            .setZIndex(100)
            );

            t.panelFeedback.append(
            (new u.Link)
            .host(t,"btnFbClose")
            .setDomId("btnFbClose")
            .setLeft('auto')
            .setTop(5)
            .setRight(5)
            .setCaption('')
            .onClick("_btnFbClose_onclick")
            );

            t.panelFeedback.append(
            (new u.Div)
            .host(t,"divFbTxt")
            .setDomId("divFbTxt")
            .setTop(8)
            .setLeft(10)
            .setWidth(120)
            .setHeight(20)
            .setHtml('$app.feedbackText')
            );

            t.panelFeedback.append(
            (new u.Input)
            .host(t,"btnFbContent")
            .setDomId("btnFbContent")
            .setMultiLines(true)
            .setTop(26)
            .setLeft(10)
            .setWidth(280)
            .setHeight(100)
            );

            t.panelFeedback.append(
            (new u.Button)
            .host(t,"btnFbSubmit")
            .setDomId("btnFbSubmit")
            .setTop(140)
            .setLeft(10)
            .setWidth(50)
            .setCaption('$app.feedbackSubmit')
            .onClick("_btnFbSubmit_onclick")
            );

            return n;
            // ]]code created by jsLinb UI Builder
        },
        //toggle左侧panel
        toggleLeft:function(flag){
            var page=this;
            if(flag===true)
                page.$treebar_show=false;
            if(flag===false)
                page.$treebar_show=true;

            if(!page.$treebar_show){
                if(!page.readonly)
                    page.btnShowLeft.setDisplay('none');
                page.panelMain.reBoxing().css('marginLeft','222px');
                page.panelLeft.setDisplay('block').setDock("left").getSubNode('PANEL').scrollTop(0);

            }else{
                if(!page.readonly)
                    page.btnShowLeft.setDisplay('');
                page.panelMain.reBoxing().css('marginLeft','0');

                page.panelLeft.setDisplay('none').setDock('none',true);
                page.panelReader.setDock(page.panelReader.getDock(),true);
            }
            page.$treebar_show = !page.$treebar_show;

            if(!page.readonly && !page.$treeShowed){
                //全球中文期刊树的第一层
                SPA.requestData({api:"MyQikan.Mag.list", id: _.urlDecode(String(location.href).split('#')[1]||'','id')},function(obj){
                    if(obj.res=="ok")
                        SPA.treebar.setItems(SPA.formatTreeArr(obj.data));
                });
                page.$treeShowed=true;
            }
        },
        //add new module to dom node
        addNewModule:function(hash, node, tag){
            var module = new MyQikan.Module1();
            module.uid = hash.id||'';

            module.readonly=SPA.readonly;
            module.status = hash.status;
            module.beforeClose = function(){
                var callback=function(){
                    //同步内存变量object
                    var i = SPA.profile.modules.subIndexOf('id', module.uid);
                    SPA.profile.modules.removeFrom(i);
                    module.destroy();
                };
                //先调用
                callback();
                //如果登陆，调用server
                if(!SPA.readonly && SPA.auth)
                    SPA.requestData({
                        api:"MyQikan.My.module.del",
                        id: hash.id,
                        profileId:SPA.profileId
                    }, function(obj){
                        if(obj.res=="ok"){}
                    });

                return false;
            };
            module.onToggle = function(status){
                //如果登陆，调用server
                if(!SPA.readonly && SPA.auth)
                    if(hash.status!=String(status))
                        SPA.requestData({
                            api:"MyQikan.My.module.toggle",
                            id: hash.id,
                            profileId:SPA.profileId,
                            val:status
                        }, function(obj){},null, null,true);
                //如果没有初始化，需要刷新数据
                if(status===0 && !module.$ini && !module.$ingetting)
                    SPA.refreshModule(module, hash);
            };

            module.onClickArticle = function(sid){
                SPA.panelReader.setDisplay('');
                SPA.layout.setDisplay('none');
                SPA.clearArticle();
                var sid,id=sid.substr(0, sid.lastIndexOf('_'));
                SPA.requestData({api:"MyQikan.Mag.list", id: id},function(obj){
                    if(obj.res=="ok"){
                        SPA.panelbarI.setTag(obj.info.pid);
                        SPA.panelbarI.setCaption((obj.info.title||obj.info.name)+"<span class='linb-tag'></span>");

                        //选定下一级
                        var o=SPA.treebarI, id=sid + ':' + '0';
                        o.setItems(SPA.formatTreeArr2(obj.data));
                        SPA.treebarI.setValue('').selectItem(id);

                        if(!o.getItemByItemId(id))
                            SPA.clearArticle();

                    }
                });

            };

            module.create(function(com){
                var obj=com.panelBar;
                obj.setTagVar(com.uid);
                linb.Dom.getEmptyDiv().append(obj);
                var n=obj.reBoxing();
                //obj.getSubNode('BORDER').addBorder();//.addShadow();
                if(tag===0)
                    node.append(n);
                else if(tag===1)
                    node.addPrev(n);
                else
                    node.addNext(n);
            });
            module.$magid = hash.uri;
            module.$viewtype = SPA._viewtype;

            //需要先设置这些
            if(hash.title)
                module.setCaption(hash.title /*+":"+hash.row*/);

            hash._obj = module;
            if(parseInt(module.status)!=1)
                SPA.refreshModule(module, hash);
        },
        //刷新module
        refreshModule:function(module, hash){
            module.setCaption(linb.getRes('app.loading'));
            module.$ingetting=true;
            SPA.requestData({api:"MyQikan.Mag.list", id:hash.uri},function(obj){
                var v=obj.info;

                //重新设置mag id
                if(v.tag)
                    module.$magid=v.tag;

                module.setPicture(v.img);
                module.setContent({item:obj.data});
                module.setCaption(obj.info.title);
                if(hash.picShow)
                    module.setPicToggle(true);

                module.$ini=true;
                delete module.$ingetting;
            },function(){
                module.setCaption(linb.getRes('app.loadFail'));
            },null,true);
        },
        //左侧treebar laod 数据
        _treebar_onrequestdata:function(profile, item, callback, threadid){
            var id=item.value;
            SPA.requestData({api:"MyQikan.Mag.list", id:id},function(obj){
                if(obj.res=="ok")
                    callback(SPA.formatTreeArr(obj.data,item.page));
            },threadid);
        },
        _treebar_onitemselected:function (profile, item, src) {
            profile.getSubNodeByItemId('CMD',item.id).attr('target','_blank');
        },
        //左侧panel
        _panelLeft_beforeclose:function(profile){
            this.toggleLeft();
            return false;
        },
        //文章窗口
        _linkReaderClose_click:function(profile){
            SPA.panelReader.setDisplay('none');
            SPA.layout.setDisplay('');
        },
        //点击showleft按钮
        _btnshowleft_onclick:function (profile, e, value) {
            this.toggleLeft();
        },
        _returnCustomBtn_onclick:function (profile, e, value) {
            return true;
        },
        //点击login按钮
        _btnlogin_onclick:function (profile, e, value) {
            this.toggleLeft(true);
            return false;
        },
        //根据dom id得到块
        _getModule:function(n){
            var ms=SPA.profile.modules,
                t=linb(n).reBoxing('linb.UI.Panel').getTagVar(),
                i=ms.subIndexOf('id',t);
            if(i!=-1)
                return ms[i];
        },
        //加入块
        _layout_ondropitem:function (profile, rst, data){
            var ns=this,
                id=data.id,
                type=data.type,
                mode=data.mode;
            if(id){
                var colId=rst[0],
                    rowId=rst[1],
                    pos=rst[2],
                    Col=profile.getItemIdByDom(colId),
                    Row=1000
                    ;

                //add new module to layout, based on id and type
                linb.log(id,type,rst);
                linb.log(data);

                var n, tag=0,i,m1,m2,t;
                if(rowId){
                    n=linb(rowId);
                    if(pos){
                        tag=1;
                        m2=SPA._getModule(n);
                        t=n.get(0);
                        while(t=t.previousSibling){
                            if(t.style.display!='none'){
                                m1=SPA._getModule(t);
                                break;
                            }
                        }
                    }else{
                        tag=2;
                        m1=SPA._getModule(n);
                        t=n.get(0);
                        while(t=t.nextSibling){
                            if(t.style.display!='none'){
                                m2=SPA._getModule(t);
                                break;
                            }
                        }
                    }
                }else{
                    n=linb(colId);
                    var nnn=n.children();
                    nnn._nodes.reverse();
                    nnn.each(function(o){
                        if(o.style.display!='none'){
                            m1=SPA._getModule(o);
                            return false;
                        }
                    },null,true);
                }

                if(m1){
                    //有前有后[中间]
                    if(m2){
                        if((parseInt(m2.row)||0) == (parseInt(m1.row)||0))
                            Row=0;
                        else
                            Row = ((parseInt(m2.row)||0) - (parseInt(m1.row)||0)) / 2 + (parseInt(m1.row)||0);
                    //有前无后[最后一个]
                    }else{
                        Row = Math.ceil(((parseInt(m1.row)||0)+1024) / 1024 )* 1024
                    }
                }else{
                    //无前有后[第一个]
                    if(m2){
                        Row = (parseInt(m2.row)||0) / 2;
                    //前后都没有[col里面还没有]
                    }else{
                        Row=1024;
                    }
                }

                if(mode=='new'){
                    var allModules = SPA.profile.modules, mCount=0;
                    allModules.each(function(o){
                        if(String(o.col)==String(Col))
                            mCount++
                    });
                    if(mCount>CONF.maxModules){
                        linb.message(linb.getRes('app.maxModules'))
                        return
                    }

                    var rqtObj={
                        api:"MyQikan.My.module.add",
                        profileId:SPA.profileId,
                        id:_.id()+"-"+_()+"-"+parseInt(Math.random()*10000),
                        Type: "inner",
                        //最新一期
                        Title: data.item.caption + '[' + linb.getRes('app.words.latestIssue') + ']',
                        ViewId: ns.tabs.getUIValue(),
                        Col:Col,
                        Row:parseInt(Row),
                        URI:id
                    },callback=function(obj){
                        SPA.addNewModule(obj, n, tag);
                        //同步内存变量object
                        SPA.profile.modules.push(obj);
                    };
                    //如果登陆，调用server
                    if(!SPA.readonly && SPA.auth)
                        SPA.requestData(rqtObj, function(obj,a,threadid){
                            if(obj.res=="ok")
                                callback(obj.data[0]);
                        })
                    //在未登陆的状态下模拟
                    else{
                        var obj={id:'$'+"-"+_()+"-"+parseInt(Math.random()*10000)};
                        _.each(rqtObj,function(o,i){
                            obj[i.toLowerCase()]=o;
                        });
                        callback(obj);
                    };
                }else{
                    var moduleNode=linb(id),
                        curM=SPA._getModule(moduleNode),
                        callback=function(){
                            //同步内存变量object
                            curM.row=Row;
                            curM.col=Col;
                            SPA.MoveModule(n, moduleNode, tag, Col, Row);
                        };

                    //如果登陆，调用server
                    if(!SPA.readonly && SPA.auth)
                        SPA.requestData({
                            api:"MyQikan.My.module.set",
                            profileId:SPA.profileId,
                            Col:Col,
                            Row:parseInt(Row),
                            id:curM.id
                        }, function(obj,a,threadid){
                            if(obj.res=="ok"){}
                        });
                    //后调用，涉及到setorders
                    callback();
                }
            }
        },
        //移动块
        MoveModule:function(node, n, tag, Col, Row){
            if(tag===0)
                node.append(n);
            else if(tag===1)
                node.addPrev(n);
            else
                node.addNext(n);
            n.reBoxing('linb.UI.Panel').setDisplay('');
            //Row is zero, or not an integer
            if(!Row || String(Math.abs(parseInt(Row)))!=String(Row)){
                var viewId=SPA.tabs.getUIValue(),
                arr=[],hash={};
                SPA.profile.modules.each(function(o){
                    if(o.viewid==viewId && o.col==Col)
                       arr.push(o);
                });
                if(arr.length){
                    arr.sort(function(x,y){
                        x=parseInt(x.row)||0;y=parseInt(y.row)||0;
                        return x>y?1:x==y?0:-1;
                    });
                    arr.each(function(o,i){
                        hash[o.id] = o.row = (i+1)*1024;
                    });
                    //如果登陆，调用server
                    if(!SPA.readonly && SPA.auth)
                        SPA.requestData({
                            api:"MyQikan.My.module.setorders",
                            profileId:SPA.profileId,
                            orders:_.serialize(hash)
                        }, function(obj,a,threadid){
                            if(obj.res=="ok"){
                            }
                        });
                }
            }
        },
        //编辑页面标题文字
        _linkTitle_onclick:function (profile, e) {
            if(SPA.readonly)return;

            var node=profile.root,
                pos=node.offset(),
                h=node.offsetHeight(),
                w=node.offsetWidth(),
                ww=(w+2)<200?200:(w+2);
                var pp={type:'none',
                    saveBtn:true,
                    left:pos.left - (ww-w)/2,
                    top:pos.top,
                    width:ww,
                    height:h + 4
                },
                editor = linb.create('linb.UI.Input', pp);

                editor
                .setCustomClass({'INPUT':'div-title'})
                .setValue(profile.root.text())

                .onHotKeydown(function(p,key,e){
                    if(key=='enter'){
                        //opera dont trigger onchange here
                        if(linb.browser.opr)
                            p.boxing().setUIValue(p.boxing()._getCtrlValue());

                        var v=p.properties.$UIvalue,
                            callback=function(){
                                profile.boxing().setCaption(v);
                                profile.root.width(profile.root.offsetWidth());
                            };
                        //先调用
                        callback();
                        //如果登陆，调用server
                        if(!SPA.readonly && SPA.auth)
                            SPA.requestData({api:"MyQikan.My.profile.set", id: SPA.profileId, Title:v}, function(obj){
                                if(obj.res=="ok"){}
                            });
                       _.asyRun(function(){
                            editor.destroy();
                            profile.root.width('auto');
                        });
                        return false;
                    }else if(key=='esc')
                        editor.destroy();
                })
                .reBoxing().setBlurTrigger(editor.KEY+":"+editor.$id, function(){
                    editor.destroy();
                });
                linb([document.body]).append(editor);
                _.asyRun(function(){
                    editor.activate()
                });
        },
        //编辑tab的标题文字
        _tabs_onitemactive:function(profile, item, src) {
            if(SPA.panelReader.getDisplay()!='none'){
                SPA.panelReader.setDisplay('none');
                SPA.layout.setDisplay('');
            }
            if(SPA.readonly)return;

            var tabs=profile.boxing();
            if(tabs.getUIValue()==item.id){
                var node=profile.getSubNodeByItemId('CAPTION',item.id),
                    pos=node.offset(),
                    h=node.offsetHeight(),
                    w=node.offsetWidth(),
                    pp={
                        left:pos.left,
                        top:pos.top,
                        width:w + 2
                    },
                    editor = linb.create('linb.UI.Input', pp);

                    editor
                    .setCustomStyle('INPUT','overflow:hidden;')
                    .setValue(item.caption)
                    .onHotKeydown(function(p,key){
                        if(key=='enter'){
                            //opera dont trigger onchange here
                            if(linb.browser.opr)
                                p.boxing().setUIValue(p.boxing()._getCtrlValue());

                            var v=p.properties.$UIvalue,
                                callback=function(){
                                    profile.getSubNodeByItemId('CAPTION',item.id).html(item.caption=v,false);
                                };
                            //先调用
                            callback();
                            //如果登陆，调用server
                            if(!SPA.readonly && SPA.auth)
                                SPA.requestData({api:"MyQikan.My.view.set", profileId:SPA.profileId, id: item.id, Title:v}, function(obj){
                                    if(obj.res=="ok"){}
                                });

                            _.asyRun(function(){
                                editor.destroy();
                            });
                            return false;
                        }else if(key=='esc')
                            editor.destroy();
                    })
                    .reBoxing().setBlurTrigger(editor.KEY+":"+editor.$id, function(){
                        editor.destroy();
                    });

                    linb([document.body]).append(editor);
                    _.asyRun(function(){
                        editor.activate()
                    });
            }
        },
        //关闭前提醒
        _tabs_beforepageclose: function(profile, item, src) {
            return window.confirm(linb.getRes('app.delTopic')+'"'+item.caption+'"?');
        },
        //关闭一个tab
        _tabs_afterpageclose: function(profile, item, src) {
            //如果登陆，调用server
            if(!SPA.readonly && SPA.auth)
                SPA.requestData({api:"MyQikan.My.view.del", profileId:SPA.profileId, id: item.id}, function(obj){
                    if(obj.res=="ok"){
                        var vs=SPA.profile.views,
                        i=vs.subIndexOf('id',item.id);
                        //同步内存变量object
                        if(i!=-1)
                            vs.removeFrom(i);
                    }
                });

            var i;
            profile.boxing().fireItemClickEvent((i=profile.properties.items[0]) && i.id);
        },
        _tabs_beforevu:function(){
            if(SPA.lockTabs)return false;
        },
        //改变tab
        _tabs_onitemselected:function(profile, item, src){
            var ns=this,
                id = item.id,
                p = SPA.profile,
                views=p.views,
                modules = p.modules,
                arrAdd=[],
                arrShow=[],
                arrHide=[],
                onEnd = function(){
                    //收集需要生成、隐藏和显示的块
                    modules.each(function(o){
                        if(o.viewid==id){
                            if(o._obj){
                                arrShow.push(o._obj.panelBar.getRootNode());
                            }else{
                                arrAdd.push(o);
                            }
                        }else{
                            if(o._obj)
                                arrHide.push(o._obj.panelBar.getRootNode());
                        }
                    });

                    //需要生成的块
                    if(arrAdd.length){
                        //order first
                        arrAdd.sort(function(x,y){
                            x=parseInt(x.row)||0;y=parseInt(y.row)||0;
                            return x>y?1:x==y?0:-1;
                        });
                        
                        linb.Thread(null, [function(threadid){
                            var j=arrAdd.splice(0,3);
                            if(j.length)
                                j.each(function(o,i){
                                    SPA.addNewModule(o, ns.layout.getPanel(o.col), 0);
                                });
                            if(!arrAdd.length){
                                linb.Thread.abort(threadid);
                                return;
                            }
                        }], 0, null, function(){
                            SPA.lockTabs=true;
                        }, function(){
                            SPA.lockTabs=false;
                        }, true).start();

                    }
                    //需要显示的块
                    if(arrShow.length)
                        linb(arrShow).css('display','');
                    //需要隐藏的块
                    if(arrHide.length)
                        linb(arrHide).css('display','none');
                }
            ;

            switch(SPA._viewtype){
                case 'cat':
                    if(!item._loaded){
                        item._loaded=1;
                        SPA.requestData({api:"MyQikan.Mag.list", id: item.id},function(obj){
                            if(obj.res=="ok"){
                                var cols=3;
                                
                                if(obj.data.length>CONF.maxModules){
                                    obj.data = obj.data.splice(0, CONF.maxModules);
                                    linb.message(linb.getRes('app.module.toomuch',CONF.maxModules));
                                }
                                                                
                                obj.data.each(function(o,i){
                                    modules.push({
                                        id:o.id +'_latest',
                                        col:i%cols+1,
                                        row:parseInt(i/cols + 1)*1024,
                                        status: parseInt(i/cols)==0?'0':'1',
                                        title:o.name + '[' + linb.getRes('app.words.latestIssue') + ']',
                                        type:'inner',
                                        uri:o.id +'_latest',
                                        viewid:item.id,
                                        picShow:parseInt(i/cols)==0?true:false
                                    });
                                });
                            }
                            onEnd();
                        });
                    }else
                        onEnd();
                case 'mag':
                    if(!item._loaded){
                        item._loaded=1;
                        SPA.requestData({api:"MyQikan.Mag.list", id: item.id},function(obj){
                            if(obj.res=="ok"){
                                var cols=3,arr=obj.data;
                                arr.sort(function(x,y){
                                    x=parseInt(x.id.substr(x.id.lastIndexOf('_')+1,x.id.length))||0;
                                    y=parseInt(y.id.substr(y.id.lastIndexOf('_')+1,y.id.length))||0;
                                    return x<y?1:x==y?0:-1;
                                });
                                obj.data.each(function(o,i){
                                    modules.push({
                                        id:o.id,
                                        col:i%cols+1,
                                        row:parseInt(i/cols + 1)*1024,
                                        status: parseInt(i/cols)==0?'0':'1',
                                        title:item.caption + ' ' + o.name,
                                        type:'inner',
                                        uri:o.id,
                                        viewid:item.id,
                                        picShow:parseInt(i/cols)==0?true:false
                                    });
                                });
                            }
                            onEnd();
                        });
                    }else
                        onEnd();
                    break;
                default:
                    onEnd();
            }
        },
        //登陆
        _login_onclick:function(){
            var ns=this,
                user = ns.inputUsr.getUIValue(),
                pwd = ns.inputPwd.getUIValue();
            if(!user){
                linb.message(linb.getRes('app.needUsr'));
                ns.inputUsr.activate();
                return;
            }
            if(!pwd){
                linb.message(linb.getRes('app.needPwd'));
                ns.inputPwd.activate();
                return;
            }
            linb.Thread.observableRun(null, [function(threadid){
                MyQikan.iajax(CONF.apiServer, {api:"MyQikan.Auth.login", username:user, password:pwd},function(obj){
                    if(obj.res=="ok"){
                        SPA.setCookies(obj.data[0], CONF.cookieExpired);

                        SPA.toggleLeft(false);
                        SPA.refreshUI();
                    }
                },null,threadid).start();
            }]);
            return false;
        },
        //退出登陆
        _btnlogout_onclick:function (profile, e, value) {
            linb.Thread.observableRun(null, [function(threadid){
                MyQikan.iajax(CONF.apiServer, {api:"MyQikan.Auth.logout", qk_token:SPA.getCookie('qk_token')}, function(obj){
                    if(obj.res=="ok"){
                        SPA.clearCookies();
                        SPA.toggleLeft(false);

                        //如果在阅读文章状态，退出出
                        SPA.panelReader.setDisplay('none');
                        SPA.layout.setDisplay('');

                        SPA.refreshUI();
                    }
                },null,threadid).start();
            }]);
            return false;
        },
        _inputusr_onhotkeypress:function (profile, key, control, shift, alt, e, src) {
            if(key=='enter'){
                this.btnLogIn.reBoxing().onClick(true);
                return false;
            }
        },
        _treebarI_onrequestdata:function(profile, item, callback, threadid){
            var id=item.value;
            SPA.requestData({api:"MyQikan.Mag.list", id:id},function(obj){
                if(obj.res=="ok")
                    callback(SPA.formatTreeArr2(obj.data,item.page));
            },threadid);
        },
        _treebarI_onitemselected:function (profile, item, src) {
            var id=item.value,a=id.split('_');
                SPA.articleId=a[a.length-1];

                SPA.curItem=item;
            //需要先清除这个变量
            delete SPA.articlePageCount;
            SPA.renderArticle();
            return false;
        },
        _clickMultiPage:function(id){
            SPA.articleId=id;
            var a=id.split('-'),
                b=a[a.length-1],
                b=parseInt(b)+1;
            SPA.articlePageCount=b;
            SPA.renderArticle();
        },
        _linkcharge_onclick:function (profile, e) {
            if(SPA.auth)
                SPA.renderArticle("1");
            else{
                linb.message(linb.getRes('app.needLogin2readArticle'));
                SPA.toggleLeft(true);
            }
            return false;
        },
        _fontsmall_onclick:function (profile, e) {
            SPA.divContent.reBoxing().replaceClass(/[\w]*-font/ig,'small-font');
            return false;
        },
        _fontmiddle_onclick:function (profile, e) {
            SPA.divContent.reBoxing().replaceClass(/[\w]*-font/ig,'middle-font');
            return false;
        },
        _fontbig_onclick:function (profile, e) {
            SPA.divContent.reBoxing().replaceClass(/[\w]*-font/ig,'big-font');
            return false;
        },
        _btnhow2dd_onclick:function (profile, e) {
            linb.Dom.submit(CONF.path_how2tz);
            return false;
        },
        _linkDemo_onclick:function (profile, e) {
            linb.Dom.submit(CONF.path_demo);
            return false;
        },
        _linkEmail_onclick:function (profile, e) {
            SPA.panelFeedback.setDisplay('');
            SPA.btnFbContent.activate();
            return false;
        },
        _btnFbClose_onclick:function (profile, e) {
            SPA.panelFeedback.setDisplay('none');
            return false;
        },
        _btnFbSubmit_onclick:function (profile, e) {
            var txt=SPA.btnFbContent.getUIValue();
            if(!txt){
                SPA.btnFbContent.activate();
                return;
            }

            //不需要返回任何值
            MyQikan.iajax(CONF.feedbackPath,{content:txt},null,null,null,{beforeFail:function(){}}).start();

            SPA.btnFbContent.resetValue();
            linb.message(linb.getRes('app.feedbackOK'));

            SPA.panelFeedback.setDisplay('none');
            linb.Cookies.set('feedbackflag',1);

            return false;
        },
        _panelbari_onclickhandle:function(p,e){
            var tag=p.properties.tag;
            if(tag=="")return;
            SPA.requestData({api:"MyQikan.Mag.list", id: tag},function(obj){
                if(obj.res=="ok"){
                    SPA.panelbarI.setTag(obj.info.pid);

                    SPA.panelbarI.setCaption((obj.info.title||obj.info.name)+(obj.info.pid?"<span class='linb-tag'></span>":""));

                    var o=SPA.treebarI, id=p.properties.tag + ':' + '0';
                    o.setItems(SPA.formatTreeArr2(obj.data));

                    SPA.treebarI.setValue('').selectItem(id);
                    if(!o.getItemByItemId(id))
                        SPA.clearArticle();
                }
            });
        },
        _panelleft_onshowtips:function(profile,node,pos){
            var id=node.id,
                keys=profile.keys,
                key=profile.getKey(id),
                t2=linb.getRes('app.leftPanelCloseTips');
            if(key==keys.CLOSE){
                linb.Tips.show(pos, t2);
                return true;
            }
        },
        //解决IE的bug
        _panelleft_afterRendered:function(profile){
            profile.getSubNode('PANEL').onScroll(function(profile, e, src){
                //for ie 'href focus' will scroll view
                if(linb([src]).scrollLeft()!==0)
                    linb([src]).scrollLeft(0);
            });
        }
    },
    Initialize: function(){
        CONF.IniDataHander();
        linb([window]).afterUnload(function(){
            _.breakO([window.SPA,window.CONF,window.MyQikan],3);
        },"app",0);
    }
});