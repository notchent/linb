Class('MyQikan.Viewer', 'linb.Com',{
    Instance:{
        base:["linb.UI"],
        required:["linb.UI.Pane","linb.UI.TreeBar","linb.UI.Layout","linb.UI.Div","linb.UI.Link", "linb.UI.Panel"],
        events:{"onReady":"_onready"},
        _onready:function () {
            SPA=this;
            //初始化 com factory 数据
            linb.ComFactory.setProfile(CONF.ComFactoryProfile);

            var url=String(location.href).split('#')[1]||'',
                aid=_.urlDecode(url,'id')||'text',
                article=_.urlDecode(url,'type')=='article',
                id,
                sid;
            //如果是article
            if(article){
                sid=aid;
                id=aid.substr(0, aid.lastIndexOf('_'));
            }else{
                id=aid;
            }
            SPA.linkCharge.setDisplay(article?'':'none');
            SPA.panelbarI.setIcon('img/up_on.gif');

            //全球中文期刊树的第一层
            SPA.requestData({api:"MyQikan.Mag.list", id: id},function(obj){
                if(obj.res=="ok"){
                    SPA.panelbarI.setTag(obj.info.pid);
                    SPA.panelbarI.setCaption(obj.info.title||obj.info.name);
                    SPA.treebarI.setItems(SPA.formatTreeArr2(obj.data));
                    //如果有下一级要选定
                    if(sid)
                        SPA.treebarI.selectItem(sid + ':' + '0');
                }
            });
        },
        //从server API得到数据
        requestData:function(obj, onOK, threadid, onFail, sycn){
            var fun=function(threadid){
                //是否从静态服务器取数据
                if(CONF.staticAPIs[obj.api]){
                    obj.id = obj.id || "";
                    obj.$id = CONF.staticIDTag + obj.id;
                    //ie will crash in the second time to load the same script file
                    if(linb.browser.ie)obj._ie=Math.random();
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
                    'no':'left top',
                    cat:'-17px top',
                    mag:'-33px top',
                    year:'-49px top',
                    issue:'-65px top',
                    inner:'-81px top',
                    latest:'-97px top'
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
                        icon:'img/App.gif',
                        iconPos:map[o.type],
                        href : o.type=='inner'?o.link:'#id='+o.id ,
                        caption:o.name + (o.type!='inner'?' (' + wrap('app.unit.all') + o.child + wrap('app.unit.' + o.childtype) + ')':'') + (l>1?tag.replace('#',i+1):''),
                        tips: (o.img?'<img style="float:left;padding:4px;" width="120" height="170" src="'+o.img+'">':'')+'<p style="padding-top:5px;padding-bottom:5px;font-weight:bold;text-align:center">' + (o.title||o.name) + (l>1?tag.replace('#',i+1):'') + "</p> <p>" + o.brief + '...</p>'
                    }
            });
            return a;
        },
        renderArticle:function(value){
            SPA.requestData({api:"MyQikan.Mag.reader", titleid: SPA.articleId, paid:value||""},function(obj){
                if(obj.res=="ok"){
                    SPA.linkCharge.setDisplay(obj.data[0].paid=='1'?'none':'');
                    SPA.divHead.setHtml(SPA.buildTitle(obj.data[0]));
                    SPA.divContent.setHtml(SPA.buildContent(obj.data[0]));
                }
            });
        },
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
        buildTitle:function(obj){
            return new linb.Template(
                null,
                {
                    '':'<div class="article-title">{title_name}</div>' + '<div class="article-author">{author}</div>'  + '<div class="article-ltitle">{journal_name}&nbsp;{year}'+linb.getRes('app.yearInfo')+'&nbsp;{periodnum}'+linb.getRes('app.periodInfo')+'&nbsp;&nbsp;&nbsp;&nbsp;'+linb.getRes('app.lens_info')+' {lens}</div>'
                },
                null,
                obj
            );
        },
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var t=this, n=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Layout)
            .host(t,"layoutI")
            .setItems([{"id":"before","pos":"before","locked":false,"size":300,"min":50,"max":500,"hide":false,"cmd":true},{"id":"main","min":10}])
            .setType("horizontal")
            );

            t.layoutI.append(
            (new u.Panel)
            .host(t,"panelbarI")
            .onClickHandle("_panelbari_onclickhandle")
            ,'before');

            t.panelbarI.append(
            (new u.TreeBar)
            .host(t,"treebarI")
            .setItems([])
            .setDock('none')
            .setWidth('auto')
            .setPosition('relative')
            .setGroup(true)
            .setSingleExpend(true)
            .setDynDestroy(true)
            .onGetContent("_treebarI_onrequestdata")
            .onItemSelected("_treebarI_onitemselected")
            );
            
            t.layoutI.append(
            (new u.Pane)
            .host(t,"panelHead")
            .setHeight(80)
            .setDock("top")
            .setCustomClass({"KEY":"article-header"})
            , 'main');

            t.panelHead.append(
            (new u.Div)
            .host(t,"divHead")
            .setPosition('relative')
            .setWidth('auto')
            .setHeight('auto')
            );            
            t.panelHead.append(
            (new u.Link)
            .host(t,"linkSmall")
            .setLeft('auto')
            .setRight("90")
            .setBottom("50")
            .setDomId('fontSmall')
            .setCaption("$app.fontSmall")
            .onClick("_fontsmall_onclick")
            );
            
            t.panelHead.append(
            (new u.Link)
            .host(t,"linkMiddle")
            .setLeft('auto')
            .setCaption("$app.fontMiddle")
            .setRight("67")
            .setBottom("50")
            .setDomId('fontMiddle')
            .onClick("_fontmiddle_onclick")
            );
            
            t.panelHead.append(
            (new u.Link)
            .host(t,"linkBig")
            .setLeft('auto')
            .setCaption("$app.fontBig")
            .setRight("40")
            .setBottom("50")
            .setDomId('fontBig')
            .onClick("_fontbig_onclick")
            );
            
            t.layoutI.append(
            (new u.Div)
            .host(t,"divContent")
            .setDock("fill")
            , 'main');
            

            t.layoutI.append(
            (new u.Link)
            .host(t,"linkCharge")
            .setDomId("needCharge")
            .setLeft(20)
            .setTop('auto')
            .setBottom(20)
            .setCaption("$app.needCharge")
            .onClick("_linkcharge_onclick")
            , 'main');
            
            return n;
            // ]]code created by jsLinb UI Builder
        },
        _treebarI_onrequestdata:function(profile, item, callback, threadid){
            var id=item.value;
            SPA.requestData({api:"MyQikan.Mag.list", id:id},function(obj){
                if(obj.res=="ok")
                    callback(SPA.formatTreeArr2(obj.data,item.page);
            },threadid);
        },
        _treebarI_onitemselected:function (profile, item, src) {
            var id=item.value,a=id.split('_');
                SPA.articleId=a[a.length-1];
                SPA.curItem=item;
            SPA.renderArticle();
            return false;
        },        
        _linkcharge_onclick:function (profile, e) {
            SPA.renderArticle("1");
            return false;
        },
        _fontsmall_onclick:function (profile, e) {
            SPA.divContent.reBoxing().first().css('fontSize','12px');
            return false;
        },
        _fontmiddle_onclick:function (profile, e) {
            SPA.divContent.reBoxing().first().css('fontSize','14px');
            return false;
        },
        _fontbig_onclick:function (profile, e) {
            SPA.divContent.reBoxing().first().css('fontSize','18px');
            return false;
        },
        _panelbari_onclickhandle:function(p,e){
            var tag=p.properties.tag;
            if(tag=="")return;
            SPA.requestData({api:"MyQikan.Mag.list", id: tag},function(obj){
                if(obj.res=="ok"){
                    SPA.panelbarI.setTag(obj.info.pid);
                    SPA.panelbarI.setCaption(obj.info.title||obj.info.name);
                    SPA.treebarI.setItems(SPA.formatTreeArr2(obj.data));
                    SPA.treebarI.selectItem(p.properties.tag + ':' + '0');
                }
            });
        }
    },
    Initialize: function(){
        CONF.IniDataHander();
    }
});