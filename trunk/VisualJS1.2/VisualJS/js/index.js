Class('VisualJS', 'linb.Com',{
    Constructor:function(){
        var self=this,
            o=linb.message;
        arguments.callee.upper.apply(self,arguments);
        SPA=this;
        self.curProject = null;
        self.Message=[];
        linb.message = function(content){
            if(self.Message.length>20)self.Message.pop();

            if(typeof content != 'string')
                content=String(content);

            if(/</.test(content))
                content = content.replace(/</g,'&lt; ');

            self.Message.unshift({id:_.id(), caption: content});

            self.toolbar.updateItem('info', content.left(50));
            o.apply(null,arguments);
        };
    },
    Instance:{
        events:{
            beforeCreated:function(){
                linb.dom.setCover('Created',true);
            },
            onLoadBaseClass:function(com,threadid,key){
                linb.dom.setCover('Load Base Class: '+ key, true);
            },
            onLoadResource:function(){
                linb.dom.setCover('Load Resource', true);
            },
            onCodeLoaded:function(com,threadid,key){
                linb.dom.setCover('Load widgets: '+ com.KEY+ key);
            },
            onReady:function(page){
                linb.ComFactory.setProfile(CONF.ComFactoryProfile);
                this.menubar.setItems([
                    {id:'file', caption:'$VisualJS.menu.file', sub:[
                        {id:'newproject', caption:'$VisualJS.menu.newproject', icon:'img/App.gif', iconPos:'-32px top'},
                        {id:'openproject', caption:'$VisualJS.menu.openproject', add:'Ctrl+Alt+O', icon:'img/App.gif', iconPos:'-48px top'},
                        {id:'closeproject', caption:'$VisualJS.menu.closeproject'},
                        {type:'split'},
                        {id:'saveall', caption:'$VisualJS.menu.saveall', add:'Ctrl+Alt+S', icon:'img/App.gif', iconPos:'-96px top'}
                    ]},
                    {id:'build',caption:'$VisualJS.menu.build', sub:[
                        {id:'debug', caption:'$VisualJS.menu.debug', icon:'img/App.gif', iconPos:'top left',add:'F9'},
                        {id:'release', caption:'$VisualJS.menu.release', icon:'img/App.gif', iconPos:'-64px top',add:'Ctrl+F9'}
                    ]},
                    {id:'help',caption:'$VisualJS.menu.help', sub:[
                        {id:'forum', caption:'$VisualJS.menu.forum'},
                        {id:'download', caption:'$VisualJS.menu.download', icon:'img/App.gif', iconPos:'-144px 0px'},
                        {type:'split'},
                        {id:'license', caption:'$VisualJS.menu.license', sub:[
                            {id:'gpllicense', caption:'$VisualJS.menu.gpllicense'},
                            {id:'clicense', caption:'$VisualJS.menu.clicense'},
                            {id:'purchase', caption:'$VisualJS.menu.purchase'}
                        ]},
                        {type:'split'},
                        {id:'flash', icon:'img/App.gif', iconPos:'-128px -17px', caption:'$VisualJS.tool.flash'},
                        {id:'demo', icon:'img/App.gif', iconPos:'-48px -64px ', caption:'$VisualJS.tool.demo'},
                        {type:'split'},
                        {id:'about', caption:'$VisualJS.menu.about'}
                    ]}
                ]);
                this.toolbar.setItems([{id:'only', sub:[
                    {id:'newproject', icon:'img/App.gif', iconPos:'-32px top', tips:'$VisualJS.tool.newp'},
                    {id:'openproject', icon:'img/App.gif', iconPos:'-48px top', tips:'$VisualJS.tool.open'},
                    {type:'split'},
                    {id:'saveall', icon:'img/App.gif', iconPos:'-96px top', tips:'$VisualJS.tool.saveall'},
                    {type:'split'},
                    {id:'debug', icon:'img/App.gif', iconPos:'top left', tips:'$VisualJS.tool.debug'},
                    {id:'release', icon:'img/App.gif', iconPos:'-64px top', tips:'$VisualJS.tool.release'},
                    {type:'split'},
                    {id:'download', tips:'$VisualJS.menu.download', icon:'img/App.gif', iconPos:'-144px 0px'},
                    {id:'flash', icon:'img/App.gif', iconPos:'-128px -17px', tips:'$VisualJS.tool.flash'},
                    {id:'demo', icon:'img/App.gif', iconPos:'-48px -64px ', tips:'$VisualJS.tool.demo'},
                    {type:'split'},
                    {id:'ec', icon:'img/App.gif', iconPos:'-98px -16px', tips:'$VisualJS.tool.ec'},
                    {type:'split'},
                    {id:'info', icon:'img/App.gif', iconPos:'-286px -64px ', caption:'$VisualJS.noMessage', tips:'$VisualJS.message'}
                ]}]);
            },
            afterShow:function(page){
                var key = 'prj',
                    r ='([&|\?|#]|\\b)('+ key +'=)([^&]*)([&]?)',
                    a = location.href.match(new RegExp(r)),
                    prj = _.isNull(a)?'':decodeURIComponent(a[3]);
                if(prj){
                    prj=CONF.prjPath+prj;
                    linb.request(CONF.phpPath,_.serialize({
                        key:CONF.requestKey,
                        para:{
                            action:'open',
                            hashCode:_.id(),
                            path:prj
                        }
                    }),function(txt){
                        var obj = _.unserialize(txt);
                        if(obj && !obj.error)
                            page._openproject(prj, obj);
                        else linb.message(txt);
                    });
                }

                page.proxy=new linb.UI.IFrame({height:1,left:-10000,top:-10000,src:'javascript:;'});
                linb(document.body).attach(page.proxy);

                /*
                //use appearance
                var appea = linb.UI.List.getAppearance('custom');
                if(!appea){
                    appea = _.clone(linb.UI.List.getAppearance('default'));
                    appea.ITEM['border-bottom']='dashed 1px gray';
                    linb.UI.List.setAppearance('custom', appea);
                }
                page.$infoList = new linb.UI.List({shadow:true, resizable:true, width:400},null,null,null,null,'custom').create();
                */
                //use customApperance
                page.$infoList = new linb.UI.List({shadow:true, resizable:true, width:400}).setCustomAppearance('ITEM', 'border-bottom:dashed 1px gray').create();

                //linb.dom.addHeadNode('js','','',{id:'linb:msg',src:'http://www.linb.net/message?ver='+_.version+'&rnd='+_()});
            }
        },

        base:['linb.UI','linb.date'],
        required:["linb.UI.List","linb.UI.PopMenu","linb.UI.MenuBar","linb.UI.ToolBar","linb.UI.Layout","linb.UI.Tabs","linb.UI.TreeBar","linb.UI.Dialog","linb.UI.PanelBar","linb.UI.IFrame","linb.UI.Tips","linb.UI.Shadow","linb.UI.Resizer","linb.UI.Edge","linb.UI.Div"],
        //back ground lazy load
        background:[

//VisualJS Class
            "VisualJS.ProjectSelector",
            "VisualJS.ProjectPro",

            "VisualJS.PageEditor",
            "VisualJS.ClassTool",
            "VisualJS.ClassEditor",
            "VisualJS.ClassStruct",

            "VisualJS.ObjectEditor",

            "VisualJS.Designer",
            "VisualJS.AddFile",
            "VisualJS.DelFile",
            "VisualJS.About",

//coder
            "linb.coder",

//normal class
            "linb.UI.Label",
            "linb.UI.Button",
            "linb.UI.CheckBox",
            "linb.UI.Input",
            "linb.UI.ComboInput",
            "linb.UI.Group",
            "linb.UI.IconList",
            "linb.UI.RadioBox",
            "linb.UI.Block",
            "linb.UI.Stacks",
            "linb.UI.ButtonViews",

            "linb.UI.TextEditor",
            "linb.UI.TreeGrid"
        ],
        _addfile:function(id, path, name, type){
            var tb = this.treebarPrj,pathadd;
            if(type!='/'){
                name=name+type;
                pathadd=path+'/'+name;
            }else{
                pathadd=path=path+'/'+name;
            }
            linb.request(CONF.phpPath, _.serialize({
                key:CONF.requestKey,
                para:{
                    action:'add',
                    hashCode:_.id(),
                    type:type=='/'?'dir':'file',
                    path:path,
                    filename:name
                }
            }),function(txt){
                var obj = _.unserialize(txt);
                if(obj && obj.OK){
                    var iconPos;
                    if(type=='/')
                        iconPos='-48px top';
                    else{
                        var a = name.split('.');
                        switch(a[1].toLowerCase()){
                            case 'html':
                                iconPos='-112px -48px';
                                break;
                            case 'js':
                                iconPos='-16px -48px';
                                break;
                            default:
                                iconPos='-96px -48px';
                        }
                    }
                    tb.insertItems([{id: pathadd, caption: name , icon:'img/App.gif', iconPos:iconPos, value:pathadd, sub:type=='/'?[]:null}], id)
                }else
                    linb.message(txt);
            });
        },
        _delfile:function(id){
            var tb = this.treebarPrj, tab=this.tabsMain;
            arr = id.split(';'), a=[];
            arr.each(function(o,i){
                a[i]=o;
            });
            linb.request(CONF.phpPath, _.serialize({
                key:CONF.requestKey,
                para:{
                    action:'del',
                    hashCode:_.id(),
                    path:a
                }
            }),function(txt){
                var obj = _.unserialize(txt);
                if(obj && obj.OK){
                    tb.removeItems(arr);
                    var items = tab.getItems(),b=[];
                    items.each(function(o){
                        if(!tb.getSubSerialIdByItemId(o.id))
                            b.push(o.id);
                    },null,true);
                    tab.removeItems(b);
                }else
                    linb.message(txt);
            });
        },
        _projecttool_onclick:function(profile,id, groupid, src){
            var self=this;
            switch(id){
                case 'new':
                    linb.ComFactory.getCom('addFile',null,function(){
                        this.host = self;
                        this.setProperties({
                            icon:'img/App.gif',
                            iconPos:'-0px -16px',
                            caption:'$VisualJS.tool2.new',
                            onOK: self._addfile,
                            fromRegion:linb(src).getRegion(true),
                            items: self.curPrjFiles
                        });
                        this.show(linb([document.body]));
                    });
                    break;
                case 'delete':
                    linb.ComFactory.getCom('delFile',null,function(){
                        this.host = self;
                        this.setProperties({
                            fromRegion:linb(src).getRegion(true),
                            icon:'img/App.gif',
                            iconPos:'-80px -16px',
                            caption:'$VisualJS.tool2.del',
                            items:self.curPrjFiles,
                            onOK: self._delfile
                        });
                        this.show(linb([document.body]));
                    });
                    break;
                case 'refresh':
                    linb.request(CONF.phpPath, _.serialize({
                        key:CONF.requestKey,
                        para:{
                            action:'open',
                            hashCode:_.id(),
                            path:self.curProject
                        }
                    }),function(txt){
                        var obj = _.unserialize(txt);
                        if(!obj || obj.error)
                            linb.message(txt);
                        else{
                            _.tryF(self._openproject, [self.curProject, obj], self);
                            linb.message(linb.getRes('VisualJS.tool2.refreshOK'));
                        }
                    });
                break;
            }
        },
        _closeproject:function(callback){
            var self=this, dirty,tb = this.tabsMain, items = tb.getItems(),tree = this.treebarPrj;
            items.each(function(o){
                if(o._dirty)return !(dirty=true);
            });
            var fun = function(){
                tb.clearItems();
                tree.clearItems();
                self.curProject = null;
                this.curPrjFiles=[];
                self.projecttool.setDisabled(true);
                if(typeof callback=='function')callback();
            };

            if(dirty)
                linb.UI.Dialog.confirm(linb.getRes('VisualJS.notsave'), linb.getRes('VisualJS.notsave2'), fun);
            else
                fun();
        },
        _tabsmain_beforepageclose:function(profile, item, src){
            if(item._dirty){
                linb.UI.Dialog.confirm(linb.getRes('VisualJS.notsave'), linb.getRes('VisualJS.notsave2'), function(){
                    profile.boxing().removeItems(item.id);
                });
                return false;
            }
        },
        _tabsmain_afterpageclose:function(profile, item, src){
            if(item.$obj)item.$obj.destroy();
        },
        _tabsmain_beforeValueUpdated:function(profile, ov, nv){
            var item = this.tabsMain.getItemByItemId(ov);
            if(!item)return;
            if(t=item.$obj){
                if(t.getText()===false)return false;
            }
        },
        _tabmain_onitemselected:function(profile,item,src){
            _.tryF(function(){
                if(item.$obj)item.$obj.activate();
            });
        },
        _treebarprj_onitemselected:function(profile, item, src){
            if(!item.id)return;
            var page=this,
                type=item.caption.split('.')[1];
            if(type!='js' && type!='html'&& type!='php'){
                linb.dom.submit(item.id);
                return;
            }

            var value = item.value,
                arr = value.split('/'),
                filename = arr[arr.length-1],
                filetype = filename.split('.')[1],
                iconPos = filetype=='js'?'-16px -48px':'-128px -48px';

            filetype = filetype=='js'?'class':filetype;

            var tb=page.tabsMain,
                t = linb([src],false).getRegion(true),
            pro = tb.reBoxing().getRegion(true);
            if(tb.getItemByItemId(value)){
                tb.fireItemClickEvent(value);
            }else{
                linb.dom.fxProxy(t, pro
                    ,null,function(){
                        var item = {id:value, tips:value, caption:filename , closeBtn:true, icon:'img/App.gif', iconPos:iconPos},
                            items = tb.getItems()
                        ;
                        tb.insertItems([item], items.length?items[items.length-1].id:null);
                        tb.fireItemClickEvent(value);
                        var fun = function(txt){
                            var itemid=item.id;
                            var callback=function(pagprofile, pro, b){
                                tb.markDirty(pagprofile.properties.keyId, b);
                            };

                            item.newText = item.text = txt;

                            if(filetype != 'class'){
                                linb.ComFactory.newCom('VisualJS.PageEditor',function(){
                                    this.host = page;
                                    this.setProperties({
                                        text:txt,
                                        checkType:filetype,
                                        keyId:itemid
                                    });
                                    this.setEvents('onValueChanged',callback);
                                    this.show(null,tb.getCurPanel());
                                    item.$obj=this;
                                });
                            }else{
                                linb.ComFactory.newCom('VisualJS.ClassEditor',function(){
                                    this.host = page;
                                    this.setProperties({
                                        $design:page.curProject,
                                        checkType:'js',
                                        text:txt,
                                        keyId:itemid
                                    });
                                    this.setEvents('onValueChanged',callback);
                                    this.show(null,tb.getCurPanel());
                                    item.$obj=this;
                                });
                            }
                        } ;
                        if(filetype!='php')
                            linb.request(value,'',fun);
                        else
                            linb.request(CONF.phpPath,_.serialize({
                                key:CONF.requestKey,
                                para:{
                                    action:'getfile',
                                    hashCode:_.id(),
                                    path:value
                                }}),fun);

                },240,8,'inexp').start();
            }
        },
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.ToolBar)
            .host(t,"toolbar")
            .setDockOrder("2")
            .setItems([])
            .onClick("_toolbar_onclick")
            );

            f(
            (new u.MenuBar)
            .host(t,"menubar")
            .setDockOrder("1")
            .setItems([])
            .onMenuSelected("_menubar_onclick")
            );

            f(
            (new u.Div)
            .host(t,"float")
            .afterCreated(function (pro) {
                pro.root.onClick(function () {linb.dom.submit(CONF.path_link);});
            })
            .setCustomAppearance({"KEY":"background-image:url(img/logo.gif);position:absolute;top:0px;right:0px;width:120px;height:60px;z-index:100;cursor:pointer;"})
            );

            f(
            (new u.Layout)
            .host(t,"layout")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"before","pos":"before","locked":false,"size":150,"min":50,"max":300,"cmd":true,"hide":false},{"id":"main","min":10}])
            .setType("horizontal")
            );

            t.layout.attach(
            (new u.PanelBar)
            .host(t,"panelbar2")
            .setCaption("$VisualJS.pm.title")
            .setIcon("img/App.gif")
            .setIconPos("-128px -48px")
            , 'before');

            t.panelbar2.attach(
            (new u.TreeBar)
            .host(t,"treebarPrj")
            .setSelMode("none")
            .setPosition("relative")
            .setDock("none")
            .setItems([])
            .setIniFold(false)
            .setGroup(true)
            .onItemSelected("_treebarprj_onitemselected")
            );

            t.layout.attach(
            (new u.Tabs)
            .host(t,"tabsMain")
            .setLeft(0)
            .setTop(0)
            .setItems([])
            .beforeValueUpdated("_tabsmain_beforeValueUpdated")
            .beforePageClose("_tabsmain_beforepageclose")
            .afterPageClose("_tabsmain_afterpageclose")
            .onItemSelected("_tabmain_onitemselected")
            , 'main');

            t.layout.attach(
            (new u.ToolBar)
            .host(t,"projecttool")
            .setDock("bottom")
            .setHandler(false)
            .setAlign("right")
            .setDisabled(true)
            .setItems([{id:'only', sub:[
                {id:'refresh', icon:'img/App.gif', iconPos:'-113px -16px', tips:'$VisualJS.tool2.refresh'},
                {type:'split'},
                {id:'new', icon:'img/App.gif', iconPos:'-0px -16px', tips:'$VisualJS.tool2.new'},
                {id:'delete', icon:'img/App.gif', iconPos:'-80px -16px', tips:'$VisualJS.tool2.del'}
            ]}])
            .afterCreated(function (profile) {
                profile.getSubNode("ITEMS").setStyle({borderLeftWidth:0, borderRightWidth:0, borderBottomWidth:0});
            })
            .onClick("_projecttool_onclick")
            , 'before');

            return n;
            // ]]code created by designer
        },
        _toolbar_onclick: function(profile,id, groupid, src){
            this._menubar_onclick(this.menubar.get(0), id, null, src);
        },_openproject: function(pm, obj){
            this.curProject = pm;
            var tb = this.treebarPrj;
            //sort to appropriate order
            obj.sort(function(x,y){
                return x.layer<y.layer?1:x.layer==y.layer?(
                    x.type>y.type?1:x.type==y.type?(
                        x.location>y.location?1:-1
                    ):-1
                ):-1;
            });
            //root
            var names=pm.split('/'), name=names[names.length-1], iconPos,
            hash={
                '*':{id:pm, caption: name , icon:'img/App.gif', iconPos:'-128px -48px', value:pm, sub:[]}
            },
            arr=[hash['*']];
            //add sub
            obj.each(function(o){
                if(!o.type)
                    iconPos='-48px top';
                else{
                    var a = o.name.split('.');
                    switch(a[1].toLowerCase()){
                        case 'html':
                            iconPos='-112px -48px';
                            break;
                        case 'js':
                            iconPos='-16px -48px';
                            break;
                        default:
                            iconPos='-96px -48px';
                    }
                }
                hash[o.id] = {id:o.location, caption: o.name , icon:'img/App.gif', iconPos:iconPos, value:o.location};
                if(!o.type)
                    hash[o.id].sub=[];

                hash[o.pid].sub.push(hash[o.id]);
            });
            tb.clearItems();
            tb.insertItems(arr);
            this.curPrjFiles=tb.getItems();
            this.projecttool.setDisabled(false);
        },_menubar_onclick: function(profile,id, item, src){
            var self=this;
            switch(id){
                case 'newproject':
                    var callback=function(){
                        linb.ComFactory.getCom('prjPro',null,function(){
                            this.host = self;
                            this.setProperties({
                                caption:'$VisualJS.dialog.newone',
                                projectName : 'linbApp',
                                jsLINBPath : '',
                                className : 'App',
                                readonly : false,
                                icon:'img/App.gif',
                                iconPos:'-32px top',
                                fromRegion:linb(src).getRegion(true),
                                onOK: self._openproject
                            });
                            this.show(linb([document.body]));
                        });
                    };
                    if(this.curProject)
                        this._closeproject(callback);
                    else
                        callback();
                    break;
                case 'closeproject':
                    if(!this.curProject){
                        linb.message(linb.getRes('VisualJS.ps.noprj'));
                        return;
                    }
                    this._closeproject();
                    break;
                case 'openproject':
                    var callback=function(){
                        linb.ComFactory.getCom('prjSel',null,function(){
                            this.host = self;
                            this.setProperties({
                                caption:linb.getRes('VisualJS.dialog.select'),
                                icon:'img/App.gif',
                                iconPos:'-48px top',
                                fromRegion:linb(src).getRegion(true),
                                onOK: self._openproject
                            });
                            this.show(linb([document.body]));
                        });
                    };
                    if(this.curProject)
                        this._closeproject(callback);
                    else
                        callback();
                    break;
                case 'saveall':
                    if(!this.curProject){
                        linb.message(linb.getRes('VisualJS.ps.noprj'));
                        return;
                    }
                    var tb = this.tabsMain, count=0, err;
                    var items = tb.getItems();
                    items.each(function(o){
                        if(o._dirty){
                            count++;
                            var newText = o.$obj.getText();
                            if(false===newText){
                                err='err';
                                return false;
                            }
                            linb.request(CONF.phpPath, _.serialize({key:CONF.requestKey, para:{
                                action:'save',
                                hashCode:_.id(),
                                path: o.id,
                                content:newText
                                }}), function(txt){
                                    if(_.unserialize(txt).OK){
                                        o.$obj.resetEnv(newText);
                                        tb.markDirty(o,false,true);
                                    }
                                },function(txt){
                                    linb.message(txt);
                                // post
                                },null,{method: 'POST'})
                        }
                    },this);
                    if(!err){
                        if(count)
                            linb.message(linb.getRes('VisualJS.ps.saved', count));
                        else
                            linb.message(linb.getRes('VisualJS.ps.noSaved'));
                    }
                    break;
                case 'ec':
                    linb.reLang(linb.lang=='en'?'cn':'en',function(){
                        self.menubar.reset();
                    });
                    break;
                case 'flash':
                    linb.dom.submit(CONF.path_video);
                    break;
                case 'demo':
                    linb.dom.submit('demo.html');
                    break;
                case 'info':
                    if(!this.Message.length)
                        return;
                    var list=this.$infoList, node=list.reBoxing();
                    list.setItems(this.Message.copy());
                    node.popToTop(src,null,4);
                    var unFun=function(){
                        node.hide();
                        //unhook
                        linb.event.hookKey('esc',0,0,0,null);
                    };
                    //for on blur disappear
                    node.setBlurTrigger(list.get(0).$id, unFun);
                    //for esc
                    linb.event.hookKey('esc',0,0,0,unFun);

                    break;
                case 'debug':
                    if(!this.curProject){
                        linb.message(linb.getRes('VisualJS.ps.noprj'));
                        return;
                    }
                    linb.dom.submit(this.curProject);
                    break;
                case 'release':
                    if(!this.curProject){
                        linb.message(linb.getRes('VisualJS.ps.noprj'));
                        return;
                    }
                    this.proxy.submit(CONF.phpPath, {key:CONF.requestKey, para:{path: this.curProject, action:'release'}}, null, 'POST');
                    //linb.dom.submit(CONF.phpPath, {key:CONF.requestKey, para:{path: this.curProject, action:'release'}}, null, 'POST');
                    //linb.request(CONF.phpPath, _.serialize({key:CONF.requestKey, para:{path: this.curProject, action:'release'}}));
                    break;
                case 'forum':
                    linb.dom.submit(CONF.path_forum);
                    break;
                case 'download':
                    linb.dom.submit(CONF.path_download);
                    break;

                case 'gpllicense':
                    linb.dom.submit(CONF.path_gpllicence);
                    break;
                case 'clicense':
                    linb.dom.submit(CONF.path_licence);
                    break;
                case 'purchase':
                    linb.dom.submit(CONF.path_purchase);
                    break;
                case 'about':
                    linb.ComFactory.getCom('about',null,function(){
                        this.show(linb([document.body]));
                    });
                    break;
                default:
                    linb.message(linb.getRes('VisualJS.soon'));
            }
        }
    },
    Initialize:function(){

        linb.BookMark.hookLinkClick(null);

        window.onbeforeunload = function(e){
            if(linb.browser.ie6 && linb.temp.cancelBeforeload){
                delete linb.temp.cancelBeforeload;
                return;
            }
            return ' ';
        };
    }
});