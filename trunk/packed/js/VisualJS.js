Class('VisualJS', 'linb.Page',{
    Constructor:function(){
        arguments.callee.upper.apply(this,arguments);
        this.curProject = null;

    	var self=this;
    	self.Message=[];

    	var o=linb.message;
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
            afterShow:function(page){
            	var key = 'prj',
                	r ='([&|\?|#]|\\b)('+ key +'=)([^&]*)([&]?)',
                    a = location.href.match(new RegExp(r)),
                    prj = _.isNull(a)?'':decodeURIComponent(a[3]);
                if(prj){
                    prj='projects/'+prj;
                    linb.request(VisualJS.config.phpPath,_.serialize({
                        key:page.requestKey,
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

                page.proxy=new linb.UI.IFrame({height:1,left:-10000,top:-10000});
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

                //linb.dom.addHeadNode('js','','',{id:'linb:msg',src:'http://www.linb.net/message?ver='+_.version+'&rnd='+_.timeStamp()});
            }
        },
        requestKey:'VisualJS',
        langKey:'VisualJS',
        base:['linb.UI'],
        required:[
            'linb.UI.List',
            'linb.UI.PopMenu',
            'linb.UI.MenuBar',
            'linb.UI.ToolBar',
            'linb.UI.Layout',
            'linb.UI.Tabs',
            'linb.UI.TreeBar',
            'linb.UI.Dialog',
            'linb.UI.PanelBar',
            'linb.UI.IFrame',

            'linb.UI.Tips',
            'linb.UI.Shadow',
            'linb.UI.Resizer',
            'linb.UI.Edge'
        ],
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
            "linb.UI.Gallery",
            "linb.UI.RadioBox",
            "linb.UI.Block",
            "linb.UI.Stacks",
            "linb.UI.ButtonViews",

            "linb.UI.TextEditor",
            "linb.UI.TreeGrid",

            "linb.DataSource.Ajax",
            "linb.DataSource.Memory"
        ],
        _addfile:function(id, path, name, type){
            var tb = this.treebarPrj,pathadd;
            if(type!='/'){
                name=name+type;
                pathadd=path+'/'+name;
            }else{
                pathadd=path=path+'/'+name;
            }
            linb.request(VisualJS.config.phpPath, _.serialize({
                key:this.requestKey,
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
            linb.request(VisualJS.config.phpPath, _.serialize({
                key:this.requestKey,
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
                    _.asyCall('VisualJS.AddFile' ,'show', [linb(document.body),'',
                        {
                            fromRegion:linb(src).getRegion(true),
                            icon:'img/App.gif',
                            iconPos:'-0px -16px',
                            caption:'$VisualJS.tool2.new',
                            items:self.curPrjFiles
                        },{
                            onOK: self._addfile
                        }, self],
                    true);
                    break;
                case 'delete':
                    _.asyCall('VisualJS.DelFile' ,'show', [linb(document.body),'',
                        {
                            fromRegion:linb(src).getRegion(true),
                            icon:'img/App.gif',
                            iconPos:'-80px -16px',
                            caption:'$VisualJS.tool2.del',
                            items:self.curPrjFiles
                        },{
                            onOK: self._delfile
                        }, self],
                    true);
                    break;
                case 'refresh':
                    linb.request(VisualJS.config.phpPath, _.serialize({
                        key:this.requestKey,
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
                            linb.message(linb.getStr('VisualJS.tool2.refreshOK'));
                        }
                    });
                break;
            }
        },
        _toolbar_onclick : function(profile,id, groupid, src){
            this._menubar_onclick(this.menubar.get(0), id, src);
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
                linb.UI.Dialog.confirm(linb.getStr('VisualJS.notsave'), linb.getStr('VisualJS.notsave2'), fun);
            else
                fun();
        },
        _openproject : function(pm, obj){
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
        },
        _menubar_onclick : function(profile,id, src){
            switch(id){
                case 'newproject':
                    var self=this, callback=function(){
                        _.asyCall('VisualJS.ProjectPro' ,'show', [linb(document.body), '', {
                            caption:'$VisualJS.dialog.newone',
                            icon:'img/App.gif',
                            iconPos:'-32px top',
                            fromRegion:linb(src).getRegion(true)
                        },{
                            onOK: self._openproject
                        }, self],
                     true);
                    };
                    if(this.curProject)
                        this._closeproject(callback);
                    else
                        callback();
                    break;
                case 'closeproject':
                    if(!this.curProject){
                        linb.message(linb.getStr('VisualJS.ps.noprj'));
                        return;
                    }
                    this._closeproject();
                    break;
                case 'openproject':
                    var self=this, callback=function(){
                        _.asyCall('VisualJS.ProjectSelector' ,'show', [linb(document.body),'',
                            {
                                caption:linb.getStr('VisualJS.dialog.select'),
                                icon:'img/App.gif',
                                iconPos:'-48px top',
                                fromRegion:linb(src).getRegion(true)
                            },{
                                onOK: self._openproject
                            }, self]
                        ,true);
                    };
                    if(this.curProject)
                        this._closeproject(callback);
                    else
                        callback();
                    break;
                case 'saveall':
                    if(!this.curProject){
                        linb.message(linb.getStr('VisualJS.ps.noprj'));
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
                            linb.request(VisualJS.config.phpPath, _.serialize({key:this.requestKey, para:{
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
                                },true, 'POST')
                        }
                    },this);
                    if(!err){
                        if(count)
                            linb.message(linb.getStr('VisualJS.ps.saved', count));
                        else
                            linb.message(linb.getStr('VisualJS.ps.noSaved'));
                    }
                    break;
                case 'ec':
                    this.reLang(linb.lang=='en'?'cn':'en');
                    this.menubar.reset();
                    break;
                case 'flash':
                    linb.dom.submit('http://linb.googlecode.com/files/video.html');
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
                        linb.message(linb.getStr('VisualJS.ps.noprj'));
                        return;
                    }
                    linb.dom.submit(this.curProject);
                    break;
                case 'release':
                    if(!this.curProject){
                        linb.message(linb.getStr('VisualJS.ps.noprj'));
                        return;
                    }
                    this.proxy.submit(VisualJS.config.phpPath, {key:this.requestKey, para:{path: this.curProject, action:'release'}}, 'POST');
                    //linb.dom.submit(VisualJS.config.phpPath, {key:this.requestKey, para:{path: this.curProject, action:'release'}}, 'POST');
                    //linb.request(VisualJS.config.phpPath, _.serialize({key:this.requestKey, para:{path: this.curProject, action:'release'}}));
                    break;
                case 'forum':
                    linb.dom.submit('http://groups.google.com/group/linb');
                    break;
                case 'download':
                    linb.dom.submit('http://code.google.com/p/linb/downloads/list');
                    break;

                case 'gpllicense':
                    linb.dom.submit('http://www.gnu.org/licenses/gpl-3.0.txt');
                    break;
                case 'clicense':
                    linb.dom.submit('license.txt');
                    break;
                case 'purchase':
                    linb.dom.submit('http://linb.googlecode.com/files/purchase.html');
                    break;
                case 'about':
                    _.asyCall('VisualJS.About' ,'show', '', [], null, null, true);
                    break;
                default:
                    linb.message(linb.getStr('VisualJS.soon'));
            }
        },
        _tabsmain_beforepageclose:function(profile, item, src){
            if(item._dirty){
                linb.UI.Dialog.confirm(linb.getStr('VisualJS.notsave'), linb.getStr('VisualJS.notsave2'), function(){
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
            var page=this;
            var type=item.caption.split('.')[1];
            if(type!='js' && type!='html'&& type!='php'){
                linb.dom.submit(item.id);
                return;
            }

            var value = item.value;
            var arr = value.split('/'),
                filename = arr[arr.length-1],
                filetype = filename.split('.')[1],
                iconPos = filetype=='js'?'-16px -48px':'-128px -48px';
            filetype = filetype=='js'?'class':filetype;

            var tb=this.tabsMain;
            var t = linb([src],false).getRegion(true),
            pro = tb.reBoxing().getRegion(true);
            if(tb.getItemByItemId(value)){
                tb.selectPage(value);
            }else{
                linb.dom.fxProxy(t, pro
                    ,null,function(){
                        var item = {id:value, tips:value, caption:filename , closeBtn:true, icon:'img/App.gif', iconPos:iconPos};
                        tb.insertItems([item]);
                        tb.selectPage(value);
                        var fun = function(txt){
                            var itemid=item.id;
                            var callback=function(pagprofile, pro, b){
                                tb.markDirty(pagprofile.properties.keyId, b);
                            };

                            item.newText = item.text = txt;

                            if(filetype != 'class'){
                                _.asyCall('VisualJS.PageEditor' ,'show', [tb.getCurPanel(),'',{
                                    text:txt,
                                    checkType:filetype,
                                    keyId:itemid
                                },{
                                    onValueChanged:callback
                                },null/*, use asyCall threadid*/
                                ], false, null, function(){item.$obj=this});
                            }else{
                                _.asyCall('VisualJS.ClassEditor' ,'show', [tb.getCurPanel(),'',{
                                    $design:page.curProject,
                                    checkType:'js',
                                    text:txt,
                                    keyId:itemid
                                },{
                                    onValueChanged:callback
                                },null
                                ], false, null, function(){item.$obj=this});
                            }
                        } ;
                        if(filetype!='php')
                            linb.request(value,'',fun);
                        else
                            linb.request(VisualJS.config.phpPath,_.serialize({
                                key:page.requestKey,
                                para:{
                                    action:'getfile',
                                    hashCode:_.id(),
                                    path:value
                                }}),fun);

                },240,8,'inexp').start();
            }
        },
        iniComponents:function(){
            // [[designer
            // don't change the design code manually
            // nodes arrray
            this.nodes = [];
            this.float = new linb.UI.Div;
            this.float.alias('float');
            this.float.host(this)
            .setCustomAppearance({KEY:'background-image:url(img/logo.gif);position:absolute;top:0px;right:0px;width:120px;height:60px;z-index:100;cursor:pointer;'});

            this.float.afterCreated(function(pro){
                pro.root.onClick(function(){linb.dom.submit('http://www.linb.net')});
            });
            this.nodes.push(this.float.get(0));
            //
            // menubar
            //
            //new linb.UI.MenuBar
            this.menubar = new linb.UI.MenuBar();
            //set name to menubar
            this.menubar.alias("menubar");
            //set properties
            this.menubar.host(this).setDockOrder("1").setItems([
                {id:'file', caption:'$VisualJS.menu.file', sub:[
                    {id:'newproject', caption:'$VisualJS.menu.newproject', icon:'img/App.gif', iconPos:'-32px top'},
                    {id:'openproject', caption:'$VisualJS.menu.openproject', add:'Ctrl+Alt+O', icon:'img/App.gif', iconPos:'-48px top'},
                    {id:'closeproject', caption:'$VisualJS.menu.closeproject'},
                    {type:'split'},
//                    {id:'save', caption:'$VisualJS.menu.save',   icon:'img/App.gif', iconPos:'-80px top'},
                    {id:'saveall', caption:'$VisualJS.menu.saveall', add:'Ctrl+Alt+S', icon:'img/App.gif', iconPos:'-96px top'}
                ]},
/*                {id:'tools',caption:'$VisualJS.menu.tools', sub:[
                    {id:'command', caption:'$VisualJS.menu.command', icon:'img/App.gif', iconPos:'-112px top'},
                    {id:'spy', caption:'$VisualJS.menu.spy', icon:'img/App.gif', iconPos:'-128px top'}
                ]},
*/
                {id:'build',caption:'$VisualJS.menu.build', sub:[
                    {id:'debug', caption:'$VisualJS.menu.debug', icon:'img/App.gif', iconPos:'top left',add:'F9'},
                    {id:'release', caption:'$VisualJS.menu.release', icon:'img/App.gif', iconPos:'-64px top',add:'Ctrl+F9'}
//                    {type:'split'},
//                    {id:'setting', caption:'$VisualJS.menu.setting'}
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
            ]).onMenuSelected(this._menubar_onclick);;
            //
            //add menubar to base nodes list
            this.nodes.push(this.menubar.get(0));
            //
            // toolbar
            //
            //new linb.UI.ToolBar
            this.toolbar = new linb.UI.ToolBar();
            //set name to toolbar
            this.toolbar.alias("toolbar");
            //set properties
            this.toolbar.host(this).setDockOrder("2").setItems([{id:'only', sub:[
                {id:'newproject', icon:'img/App.gif', iconPos:'-32px top', tips:'$VisualJS.tool.newp'},
                {id:'openproject', icon:'img/App.gif', iconPos:'-48px top', tips:'$VisualJS.tool.open'},
                {type:'split'},
//                {id:'save', icon:'img/App.gif', iconPos:'-80px top', tips:'$VisualJS.tool.save'},
                {id:'saveall', icon:'img/App.gif', iconPos:'-96px top', tips:'$VisualJS.tool.saveall'},
//                {type:'split'},
//                {id:'command', icon:'img/App.gif', iconPos:'-112px top', tips:'$VisualJS.tool.command'},
//                {id:'spy', icon:'img/App.gif', iconPos:'-128px top', tips:'$VisualJS.tool.spy'},
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
            ]}]).onClick(this._toolbar_onclick);
            //
            //add toolbar to base nodes list
            this.nodes.push(this.toolbar.get(0));
            //
            // layout
            //
            //new linb.UI.Layout
            this.layout = new linb.UI.Layout();
            //set name to layout
            this.layout.alias("layout");
            //set properties
            this.layout.host(this).setLeft(0).setTop(0).setItems([{
                "id" : "before",
                "pos" : "before",
                "locked" : false,
                "size" : 150,
                "min" : 50,
                "max" : 300,
                "cmd" : true
            }])
            .setType("horizontal");
            //
            //add layout to base nodes list
            this.nodes.push(this.layout.get(0));


            this.treebarPB = new linb.UI.PanelBar();
            this.treebarPB.setCaption('$VisualJS.pm.title').setIcon('img/App.gif').setIconPos('-128px -48px').setCloseBtn(false).setLandBtn(false)
            this.layout.attach(this.treebarPB, 'before');

            //
            // treebarPrj
            //
            //new linb.UI.TreeBar
            this.treebarPrj = new linb.UI.TreeBar();
            //set name to treebarPrj
            this.treebarPrj.alias("treebarPrj");
            //set properties
            this.treebarPrj.host(this).setSelMode('none').setLeft(0).setTop(0).setItems([]).setIniFold(false).setGroup(true)
            .onItemSelected(this._treebarprj_onitemselected);
            //
            //add treebarPrj to parent node
            this.treebarPB.attach(this.treebarPrj);

            //
            // tabsMain
            //
            //new linb.UI.Tabs
            this.tabsMain = new linb.UI.Tabs();
            //set name to tabsMain
            this.tabsMain.alias("tabsMain");
            //set properties
            this.tabsMain.host(this).setLeft(0).setTop(0).setItems([])
            .beforePageClose('_tabsmain_beforepageclose')
            .afterPageClose('_tabsmain_afterpageclose')
            .beforeValueUpdated('_tabsmain_beforeValueUpdated')
            .onItemSelected('_tabmain_onitemselected')
            ;
            //
            //add tabsMain to parent node
            this.layout.attach(this.tabsMain, 'main');


            //
            // projecttool
            //
            //new linb.UI.ToolBar
            this.projecttool = new linb.UI.ToolBar();
            //set name to projecttool
            this.projecttool.alias("projecttool");
            //set properties
            this.projecttool.host(this).setDock('bottom').setHandler(false).setAlign('right').setDisabled(true)
            .setItems([{id:'only', sub:[
                {id:'refresh', icon:'img/App.gif', iconPos:'-113px -16px', tips:'$VisualJS.tool2.refresh'},
                {type:'split'},
                {id:'new', icon:'img/App.gif', iconPos:'-0px -16px', tips:'$VisualJS.tool2.new'},
                {id:'delete', icon:'img/App.gif', iconPos:'-80px -16px', tips:'$VisualJS.tool2.del'}
            ]}])
            .afterCreated(function(profile){
                profile.getSubNode(profile.keys.ITEMS).setStyle({borderLeftWidth:0,borderRightWidth:0,borderBottomWidth:0});
            })
            .onClick(this._projecttool_onclick);
            //
            //add treebarPrj to parent node
            this.layout.attach(this.projecttool, 'before');


            //return nodes array
            return this.nodes;

            // ]]designer
        }
    },
    Initialize:function(){
        VisualJS.config = {
            phpPath:'request.php'
        };
    	window.onbeforeunload = function(e){
    	    if(linb.browser.ie6 && linb.temp.cancelBeforeload){
    	        delete linb.temp.cancelBeforeload;
    	        return;
    	    }
    	        return ' ';
    	};
    }
});

/*
An editor for html
*/
Class('VisualJS.PageEditor', 'linb.Page',{
    Instance:{
        base:['linb.UI'],
        required:[
            'linb.UI.Panel',
            'linb.UI.List',
            'linb.UI.Dialog',
            'linb.UI.TextEditor',
            'linb.UI.ToolBar',
            'linb.coder'
        ],
        eval2:function(txt){
            var r=true;
            var iframe = document.createElement("iframe");
            iframe.style.display = "none";
            document.body.appendChild(iframe);
            frames[frames.length - 1].document.write(
            	"<script>"+
            	"var Class=function(a,b,c){}, _={}, linb={};"+
            	"var MSIE/*@cc_on =1@*/;"+
            	"parent.sandbox=MSIE?this:{eval:function(s){return eval(s)}}"+
            	"<\/script>"
            );
            txt=txt.trim();
            try{
                try{
                    sandbox.eval(txt);
                }catch(a){
                    sandbox.eval('('+txt+')');
                }
            }catch(e){
                linb.message( _.Error(e));
                r=false;
            }finally{
                document.body.removeChild(iframe);
            }
            return r;
        },
        check:function(txt){
            switch(this.properties.checkType){
                case 'js':
                    return this.eval2(txt);
                break;
            }
            return true;
        },
        //flag=false, not check
        getText:function(flag){
            var txt = this.texteditor.getUIValue().replace(/\r\n/g,'\n');
            if(this.properties.text != txt){
                if(false!==flag)
                    if(this.check(txt)===false)return false;
                return txt;
            }else
                return this.properties.text;
        },
        activate:function(){
            if(this.texteditor){
                var self=this;
                _.asyRun(function(){
                    self.texteditor.activate();self=null;
                });
            }
        },
        setReadonly:function(b){
            this.texteditor.setReadonly(b);
        },
        setText:function(txt, flag){
            txt = txt||'';
            this.properties.text = txt.replace(/\r\n/g,'\n');
            //this.texteditor.updateUIValue(txt);
            this.texteditor.setValue(txt,true);

            //reset
            this._dirty=false;
            return this;
        },
        resetEnv:function(text){
            this._dirty=false;
            this.properties.text = text||txt.replace(/\r\n/g,'\n');
        },
        _texteditor_onKeyPress:function(profile, e, src){
            var ov = this._dirty,a,b,r=src.value.replace(/\r\n/g,'\n');

            this._dirty = this.properties.text !== r;
            if(ov!=this._dirty)
                _.tryF(this.events.onValueChanged, [this, profile, this._dirty, r], this.host);
        },
        _toolbar_onclick : function(profile, id){
            var self=this;
            linb.dom.UIAction(function(){
                switch(id){
                    case 'format':
                        var code=linb.coder.parse(self.texteditor.getUIValue(), self.properties.checkType,['plain']);
        		        var dialog = new linb.UI.Dialog();
        		        dialog.setLeft(100).setTop(100).setWidth(300).setHeight(200).setStatus('max').setMinBtn(false).setMaxBtn(false).setCaption('$VisualJS.pageEditor.formatted')
        		        .create();
        		        dialog.html(code);
        		        dialog.show(linb(document.body),true);
        		        break;
                    case 'check':
                        var txt = self.getText();
                        if(txt!==false)
                            linb.message(linb.getStr('VisualJS.checkOK'));
                        break;
                }
            });
        },
        /*
        */
        parepareData:function(properties,events){
            events.afterShow=function(page){
                if(page.properties.checkType!='js')
                    page.toolbar.hideItem('check');
                page.setText(page.properties.text);
            };
        },
        iniComponents:function(){
            this.nodes = [];
            var self=this;
            // [[designer
            //

            //
            // panel
            //
            //new linb.UI.Panel
            this.panel = new linb.UI.Panel();
            //set name to panel
            this.panel.alias("panel");
            //set properties
            this.panel.setDock('fill');
            //
            //add dialogMain to parent node
            this.nodes.push(this.panel.get(0));
            //
            // toolbar
            //
            //new linb.UI.ToolBar
            this.toolbar = new linb.UI.ToolBar();
            //set name to toolbar
            this.toolbar.alias("toolbar");
            //set properties
            this.toolbar.host(this).setItems([{id:'only', sub:[{
                "id" : "format",
                "caption" : "$VisualJS.pageEditor.format",
                "icon" : "img/App.gif",
                "iconPos":"-32px -48px",
                "type" : "button",
                "tips" : "$VisualJS.pageEditor.formattips"
            },{
                "id" : "check",
                "caption" : "$VisualJS.pageEditor.check",
                "icon" : "img/App.gif",
                "iconPos":"0 -48px",
                "type" : "button",
                "tips" : "$VisualJS.pageEditor.checktips"
            }]}]).onClick('_toolbar_onclick');
            //
            this.panel.attach(this.toolbar);
            //
            //
            // texteditor
            //
            //new linb.UI.TextEditor
            this.texteditor = new linb.UI.TextEditor();
            //set name to texteditor
            this.texteditor.host(this).alias("texteditor").onKeyPress('_texteditor_onKeyPress');
            //set properties
            this.texteditor.setDock("fill");
            //
            //add dialogMain to parent node
            this.panel.attach(this.texteditor);//

            // ]]designer

            return this.nodes;
        }
    }
});


Class('VisualJS.ClassTool',null,{
    Static:{
        isClassText:function(str){
            var reg = new RegExp("^(\\s*\\/\\*[^*@]*\\*+([^\\/][^*]*\\*+)*\\/\\s*)|^(\\s*\\/\\/[^\\n]*\\s*)");
            while(reg.test(str))
                str = str.replace(reg,'');
            return /^\s*Class\(/.test(str);
        },
        //get class object from a Class declare, include comments words
        getClassObject : function(str){
//set try out
//            try{
            str = str.slice(str.indexOf('{')+1, str.lastIndexOf('}'));
            return eval('({'+str+'})');
//            }catch(e){linb.message(linb.getStr('VisualJS.classtool.err1'))+":"+_.Error(e);return false}
        },
        getCodeFromStruct:function(o){
            try{
                var self = arguments.callee, arr=[];
                if(o){
                    if(o.sub){
                        if(o.frame){
                            _.each(o.sub,function(o,i){
                                if(!_.isNull(o.comments))
                                    arr.push((o.comments ||'') + i + ':' + (o.code?o.code:o.sub?self.call(this,o):''));
                            },this);
                            return o.frame.replace('*1', o.name||'').replace('*2', o.pname||'').replace('*3', arr.join(',').replace(/\$/g,'$$$'));
                        }else return '';
                    }else
                        return (o.code ||'').replace(/^[\r\n]*/, '');
                }else return '';
            }catch(e){linb.message(linb.getStr('VisualJS.classtool.err2'))+":"+_.Error(e);return false}
        },
        parseSingleBlock:function(txt){
            try{
                var reg1 = new RegExp("^(\\s*\\/\\*[^*@]*\\*+([^\\/][^*]*\\*+)*\\/\\s*)|^(\\s*\\/\\/[^\\n]*\\s*)");
                var reg2 = new RegExp("(\\s*\\/\\*[^*@]*\\*+([^\\/][^*]*\\*+)*\\/\\s*)|^(\\s*\\/\\/[^\\n]*\\s*)$");
                while(reg2.test(txt))
                    txt = txt.replace(reg2,'');

                var str = txt;

                while(reg1.test(str))
                    str = str.replace(reg1,'');

                str = str.replace(/\s*/,'');
                if(!str)return {comments:null, code:null};

                var comments = '\n'+txt.replace(str,'');
                var code = str.replace(/\s*$/,'');

                //comments/reg
                str = linb.coder.replace(str, [
                    ["(^|\\n)\\s*\\/\\*[^*@]*\\*+([^\\/][^*]*\\*+)*\\/\\s*", ''],
                    ["\\n\\s*\\/\\/[^\\n]*\\s*", ''],
                    [/\s+(\/[^\/\n\r\*][^\/\n\r]*\/m?g?i?)\s*[:,;\r\n]/,''],
                    [/[^\w\x24\/'"*)\]\?:]\/[^\/\n\r\*][^\/\n\r]*\/m?g?i?\s*[:,;\r\n]/,'']
                ]);

                code = code.replace(/([}\]])[^}\]]*$/,'$1');

                //check it's a single block
                //in '' or ""
                str = linb.coder.replace(code, [
            		["'(\\\\.|[^'\\\\])*'", ''],
            		['"(\\\\.|[^"\\\\])*"', '']
                ]);

                while(/(\{([^\{\}]*)\})|(\[([^\[\]]*)\])/.test(str)){
                    str = str.replace(/\s*(((function\s*([\w$]+\s*)?\(\s*([\w$\s,]*)\s*\)\s*)?(\{([^\{\}]*)\}))|(\[([^\[\]]*)\]))/g, '');
                }
                if (str.trim()!='') return false;

                return {comments: comments, code:code};
            }catch(e){linb.message(linb.getStr('VisualJS.classtool.err3')+":"+_.Error(e));return false}
        },
        //get class struct from a Class declare, include comments words
        getClassStruct : function(str){
//set try out
//            try{
                str = str.replace(/(\r\n|\r)/g, "\n").replace(/( +)(\n)/g, "$2").replace(/\t/g, "    ");

                //clear mash
                var t,index=1,index1=1,cache={},cache1={}, result, result2,
                code = function(str,i) {
            		var ret = "#" + (index++) +"#";
            		cache[ret] = str[0];
            		return ret;
            	},
                code1 = function(str) {
            		var ret = "`" + (index1++);
            		cache1[ret] = str[0];
            		return ret;
            	},
            	restore = function(str){
                	return str.replace(/#(\d+)#/g, function(m){
                		return cache[m];
                	});
                },
            	restore1 = function(str){
                	return str.replace(/`(\d+)/g, function(m){
                		return cache1[m];
                	});
                };

                str = linb.coder.replace(str, [
                    ["(^|\\n)\\s*\\/\\*[^*@]*\\*+([^\\/][^*]*\\*+)*\\/[^\\n]*", code],
                    ["(^|\\n)\\s*\\/\\/[^\\n]*", code],
                    [/\s+(\/[^\/\n\r\*][^\/\n\r]*\/m?g?i?)\s*[:,;\r\n]/,code],
                    [/[^\w\x24\/'"*)\]\?:]\/[^\/\n\r\*][^\/\n\r]*\/m?g?i?\s*[:,;\r\n]/,code]
                ]);

                str = linb.coder.replace(str, [
            		["'(\\\\.|[^'\\\\])*'", code1],
            		['"(\\\\.|[^"\\\\])*"', code1]
                ]);

                var frame = str.replace(/(^[^{]*\{)\s*((.|[\r\n])*)([^\s])(\s*}[^}]*$)/,'$1*3$5').replace(/(#\d+#)+/g,'');

                var o = {sub:{}};
                if(t=str.match(/^((#\d+#)+)/))
                    o.comments = restore(t[0]);
                else o.comments = '';

                t =  str.split(',');
                o.name = restore1(cache1['`1'].replace(/[\'\" ]*/g,''));
                o.pname =  restore(restore1(t[1]).replace(/[\'\" ]*/g,''));
                o.frame = restore1(frame.replace(o.name,'*1').replace(o.pname,'*2'));

                str = str.slice(str.indexOf('{')+1, str.lastIndexOf('}'));

                result = o.sub;

                //get {}
                var index2=1, cache2={},
                code2 = function(str) {
            		var ret = "'~" + index2++ +"'";
            		cache2[ret] = str;
            		return ret;
            	},
                code3 = function(a,b,str) {
                    if(a.indexOf('~')!=-1)return a;

            		var ret = "'~" + index2++ +"'";
            		cache2[ret] = str;
            		return b + ret;
            	},
            	restore2 = function(str){
                    if(str.indexOf('~')==-1)return str;

                    str = cache2["'"+str+"'"];
                    while(/'~\d+'/.test(str))
                        str = str.replace(/'~\d+'/g, function(m){
                		    return cache2[m];
                	    });
                	return str;
                };

                while(/(\{([^\{\}]*)\})|(\[([^\[\]]*)\])/.test(str)){
                    str = str.replace(/\s*(((function\s*([\w$]+\s*)?\(\s*([\w$\s,]*)\s*\)\s*)?(\{([^\{\}\[\]]*)\}))|(\[([^\[\]\{\}]*)\]))/g, code2);
                }

                // handler any \s for comments
                str = linb.coder.replace(str, ['\\s+', code]);

                //get comments first , 'Constructor', 'Initialize', 'Before', 'After', 'Instance', 'Static'
                str = str.replace(/((#\d+#)+)([\w]+):/g, function(z,a,b,c){
                    result[c] = {comments: restore(a)};
                    return c+':';
                });
                str = str.replace(/(#\d+#)/g, '');

                var obj = eval('({' + str + '})');
                //get code of those
                ['Constructor', 'Initialize', 'Before', 'After'].each(function(i){
                    if(obj[i]){
                        result[i] = result[i] || {};
                        result[i].code = restore(restore1(restore2(obj[i])));
                    }else
                        result[i] = {};
                    'code,comments'.toArr().each(function(j){
                        result[i][j] = _.exists(result[i][j])?result[i][j]:null;
                    });
                });

                var obj2;
                ['Instance', 'Static'].each(function(i){
                    if(obj[i]){
                        //for not function/{}/[] vars
                        var temp = cache2["'"+obj[i]+"'"];
                        var frame = temp.replace(/(^[^{]*\{)\s*((.|[\r\n])*)([^\s])(\s*}[^}]*$)/,'$1*3$5');
                        //delete the last comment
                        temp = temp.replace(/(#\d+#)*\s*(\})$/g, '$2');

                        temp = '(' + temp + ')';

                        // handler any \s for comments
                        temp = linb.coder.replace(temp, ['\\s+', code]);

                        result[i] = result[i] || {};
                        result2 = result[i].sub = {};
                        result[i].frame = frame;


                        temp = temp.replace(/(:)([^,\}]+)/g, code3);
                        temp = restore1(temp);

                        //get comments first
                        temp = temp.replace(/((#\d+#)+)([\w]+):/g, function(z,a,b,c){
                            result2[c] = {comments: restore(a)};
                            return c+':';
                        });
                        //for multi comments
                        temp = temp.replace(/(#\d+#)/g, '');

                        obj2 = eval(temp);
                        _.each(obj2,function(o,j){
                            result2[j] = result2[j] || {};
                            result2[j].code = restore(restore1(restore2(o)));
                        });
                    }else
                        result[i] = {};
                    'code,comments,sub,frame'.toArr().each(function(j){
                        result[i][j] = _.exists(result[i][j])?result[i][j]:null;
                    });
                });

                return o;
//            }catch(e){linb.message(linb.getStr('VisualJS.classtool.err4'))+":"+_.Error(e);return false}
        }
    }
});

/*
An editor for js class
*/
Class('VisualJS.ClassEditor', 'linb.Page',{
    Instance:{
        views:null,
        events:{
            afterCreated:function(page, threadid){
                var self=page;
                page.views={};
                _.asyCall('VisualJS.PageEditor' ,'show', [page.buttonview, 'normal',{
                    text:page.properties.text,
                    checkType:'js'
                },{
                    onValueChanged:function(ipage, profile, b, r){
                         _.tryF(page.events.onValueChanged, [page, ipage, self.properties.textO != r], page.host);
                    }
                }, page],
                false, threadid, function(){page.views['normal']=this});
            }
        },
        activate:function(){
            var t;
            if(!this.views) return;
            var view = this.buttonview.getUIValue();
            if(t=this.views[view])
                if(t.loaded)
                    t.activate();
        },
        beforeDestroy:function(){
             _.each(this.views,function(o){
                o.destroy();
            });
        },
        getText:function(){
            var view = this.buttonview.getUIValue();
            return this.views[view].getText();
        },
        setText:function(txt, flag){
            txt=txt.replace(/\r\n/g,'\n');
            //ini is page editor, no, don't get clsStruct/clsObject here
            this.properties.textO = this.properties.text=txt;
            this.properties.clsStruct=this.properties.clsObject=null;

            var view = this.buttonview.getUIValue();
            this.views[view].setText(txt, flag);

            return this;
        },
        resetEnv:function(text){
            if(!text)text=this.getText();
            this.properties.clsStruct=this.properties.clsObject=null;
            this.properties.textO = this.properties.text = text;
            var view = this.buttonview.getUIValue();
            this.views[view].resetEnv(text);
        },
        _buttonview_aftercreated:function(profile){
            profile.getSubNode(profile.keys.PANEL,true).setStyle({borderBottom:'0',borderLeft:'0',borderRight:'0'});
        },
        _buttonview_beforeValueUpdated:function(profile, ov, nv){
            var t;
            if(!this.views) return;

            if((t=this.views[ov]) && t.loaded){
                var r = t.getText();
                if(false===r)
                    return false;
                else{
                    if(ov=='normal'){
                        //not a class
                        if(!VisualJS.ClassTool.isClassText(r)){
                            this.properties.clsStruct=this.properties.clsObject=null;
                            linb.message(linb.getStr('VisualJS.classtool.noClass'));
                            return false;
                        }
                    }
                    if(this.properties.text != r || !this.properties.clsStruct || !this.properties.clsObject){
                        //try to get class struct
                        try{
                            this.properties.clsStruct = VisualJS.ClassTool.getClassStruct(r);
                            this.properties.clsObject = VisualJS.ClassTool.getClassObject(r);
                        }catch(e){
                            this.properties.clsStruct = this.properties.clsObject = null;
                            linb.message(linb.getStr('VisualJS.classEditor.codeerr',_.Error(e)));
                            return false;
                        }
                        this.properties.text = r;
                    }
                    if(ov!='normal'){
                        //refresh old text and ..
                        t.properties.text=r;
                        t.properties.clsStruct = this.properties.clsStruct;
                        t.properties.clsObject = this.properties.clsObject;
                    }
                }
            }
        },
        _buttonview_onitemselected:function(profile, item, src){
            var t;
            if(!this.views) return;

            //set text to after editor view
            if(!(t=this.views[item.id])){
                var self=this;
                if(item.id=='struct')
                    _.asyCall('VisualJS.ClassStruct' ,'show', [this.buttonview, 'struct',{
                        text:this.properties.text,
                        clsStruct:this.properties.clsStruct,
                        clsObject:this.properties.clsObject
                    },{
                        onValueChanged:function(ipage, profile, b){
                            //need double check
                            _.tryF(self.events.onValueChanged, [this, ipage, (self.properties.textO != self.properties.text) || b], self.host);
                        }
                    }, self],
                    false, null, function(){self.views['struct']=this});
                else if(item.id=='design')
                    _.asyCall('VisualJS.Designer' ,'show', [this.buttonview, 'design',{
                        $design:this.properties.$design,
                        text:this.properties.text,
                        clsStruct:this.properties.clsStruct,
                        clsObject:this.properties.clsObject
                    },{
                        onValueChanged:function(ipage, profile, b){
                            //need double check
                            _.tryF(self.events.onValueChanged, [this, ipage,  (self.properties.textO != self.properties.text) || b], self.host);
                        }
                    }, self],
                    false, null, function(){self.views['design']=this});
            }else{
                var self=this;
                linb([src],false).UIAction(function(threadid){
                    if(t.loaded){
                        if(item.id=='struct' || item.id=='design'){
                            t.properties.clsStruct=self.properties.clsStruct;
                            t.properties.clsObject=self.properties.clsObject;
                        }
                        t.setText(self.properties.text, false, threadid).activate();
                    }
                });
            }
        },
        base:['linb.UI'],
        required:[
            'linb.UI.Tabs',
            'linb.UI.ButtonViews',
            'VisualJS.ClassTool'
        ],
        parepareData:function(properties){
            properties.textO = properties.text;
        },
        iniComponents:function(){
            this.nodes = [];
            var self=this;
            // [[designer
            //

            //
            // buttonview
            //
            //new linb.UI.ButtonViews
            this.buttonview = new linb.UI.ButtonViews();
            //set name to buttonview
            this.buttonview.alias("buttonview");
            //set properties
            this.buttonview.host(this).setLeft(0).setTop(0).setItems([{
                    "id" : "normal",
                    caption : '$VisualJS.classEditor.nv',
                    'icon': 'img/App.gif',
                    "iconPos":"-80px -48px",
                    "tips":"$VisualJS.classEditor.nvtips"
                },
                {
                    "id" : "struct",
                    caption : '$VisualJS.classEditor.sv',
                    'icon': 'img/App.gif',
                    "iconPos":"-32px -48px",
                    "tips":"$VisualJS.classEditor.svtips"
                },
                {
                    "id" : "design",
                    caption : '$VisualJS.classEditor.dv',
                    'icon': 'img/App.gif',
                    "iconPos":"-192px -48px",
                    "tips":"$VisualJS.classEditor.dvtips"
                }
            ])
            .setValue('normal').setHandleSize("28")
            .beforeValueUpdated(this._buttonview_beforeValueUpdated)
            .onItemSelected(this._buttonview_onitemselected)
            .afterCreated(this._buttonview_aftercreated);
            //
            //add buttonview to parent node
            this.nodes.push(this.buttonview.get(0));

            // ]]designer

            return this.nodes;
        }
    }
});

Class('VisualJS.ClassStruct', 'linb.Page',{
    Instance:{
        events:{
            afterCreated:function(page, threadid){
                _.asyCall('VisualJS.PageEditor' ,'show', [page.layoutFill, 'main',{
                    checkType:'js'
                },{
                    onValueChanged:function(ipagprofile, e, b){
                        //always true
                        _.tryF(page.events.onValueChanged, [ipagprofile, e, page.$dirty || b], page.host);
                    }
                }, page],
                false, threadid, function(){page.PageEditor=this});
            }
        },
        activate:function(){
            this.PageEditor.activate();
        },
        check:function(txt){
            return this.PageEditor.check(txt);
        },
        getText:function(){
            //get frm pageeditor
            var txt = this.PageEditor.getText(false);
            if(txt===false)return false;
            //check dirty
            if(this.$dirty || this.properties.temptext != txt){
                if(this.refer){
                    if(false === this.check(txt))return false;
                    //parse comments and code, check code in the process
                    var result = VisualJS.ClassTool.parseSingleBlock(txt);
                    if(false === result){
                        linb.message(linb.getStr('VisualJS.classtool.err1'));
                        return false;
                    }
                    //set back
                    this.properties.temptext = txt;

                    //set back and get new class text
                    this.refer.comments = result.comments;
                    this.refer.code = result.code;

                    txt = VisualJS.ClassTool.getCodeFromStruct(this.properties.clsStruct);
                    return this.properties.clsStruct.comments.replace(/^[\r\n]*/, '') + txt;
                }
            }
            return this.properties.text;
        },
        setText:function(txt, flag){
            txt=txt.replace(/\r\n/g,'\n');
            if(flag || this.properties.text != txt){
                this.properties.text = txt;
                var clsStruct = this.properties.clsStruct;
                var clsObject = this.properties.clsObject;
//linb.log('rebuild struct')
                var value=this.treebarClass.getUIValue();
                this.treebarClass.setValue(null,true);
                var items=[
                    {id:'Class',caption:'Class', caption:clsStruct.name, icon:'img/App.gif', iconPos:'-16px -48px', group:true, sub:[
                        {id:'Constructor',caption:'Constructor', icon:'img/App.gif', iconPos:'-32px -32px'},
                        {id:'Instance',caption:'Instance', icon:'img/App.gif', iconPos:'-16px -32px', sub:[]},
                        {id:'Static',caption:'Static',  icon:'img/App.gif', iconPos:'-16px -32px', sub:[]},
                        {id:'Initialize',caption:'Initialize', icon:'img/App.gif', iconPos:'-32px -32px'},
                        {id:'Before',caption:'Before', icon:'img/App.gif', iconPos:'-32px -32px'},
                        {id:'After',caption:'After', icon:'img/App.gif', iconPos:'-32px -32px'}
                ]}];

                var t,m,icon,j=items[0].sub;
                t=this.properties.clsStruct.sub;
                if(t){
                    m=t.Instance;
                    if(m && (m = m.sub)){
                        _.each(m,function(o,i){
                            icon = 'img/App.gif';
                            iconPos = (typeof clsObject.Instance[i] == 'function')?'-32px -32px':'0 -32px';
                            if(_.isHash(clsObject.Instance[i]))icon = 'block.gif';
                            j[1].sub.push({id:'Instance.'+i, caption:i, icon:icon, iconPos:iconPos});
                        });
                    }
                    m=t.Static;
                    if(m && (m = m.sub)){
                        _.each(m,function(o,i){
                            icon = (typeof clsObject.Static[i] == 'function')?'function.gif':'property.gif';
                            if(_.isHash(clsObject.Static[i]))icon = 'block.gif';
                            j[2].sub.push({id:'Static.'+i, caption:i,  icon:'img/'+icon});
                        });
                    }
                }

                //reset
                delete this.refer;

                this.treebarClass.setItems(items);
                if(value)
                    if(this.treebarClass.selectItem(value))
                        return this;
                 this.PageEditor.setText('').setReadonly(true);
            }
            this.resetEnv(txt);
            //this.PageEditor.setText(this.PageEditor.getText(),true)

            return this;
        },
        resetEnv:function(text){
            if(!text)text=this.getText();
            this.$dirty=false;
            this.properties.text = text;
            this.PageEditor.resetEnv(text);
        },
        _treebarclass_beforevalueupdated:function(profile, ov, nv){
            if(!this.refer)return;

            //get frm pageeditor
            var txt = this.PageEditor.getText();
            if(txt===false)return false;
            //check dirty
            if(this.properties.temptext != txt){
                if(false === this.check(txt))return false;
                //parse comments and code, check code in the process
                var result = VisualJS.ClassTool.parseSingleBlock(txt);
                if(false === result){
                    linb.message(linb.getStr('VisualJS.classtool.err1'));
                    return false;
                }

                //set back and get new class text
                this.refer.comments = result.comments;
                this.refer.code = result.code;

                //set dirty
                this.$dirty = true;
            }
        },
        _treebarclass_onitemselected:function(profile, item, node){
                if(!item.id)return;
                var value = item.id;
                var self=this;
                linb([node],false).UIAction(function(threadid){
                    var o=self.properties.clsStruct,t,m,arr;
                    var comments, code;
                    switch(value){
                        case 'Class':
                            code = VisualJS.ClassTool.getCodeFromStruct(o);
                            break;
                        case 'Static':
                        case 'Instance':
                        case 'Constructor':
                        case 'Initialize':
                        case 'Before':
                        case 'After':
                            o=o.sub;
                            if(o=o[value]){
                                if(o.sub)code = VisualJS.ClassTool.getCodeFromStruct(o);
                            }
                            break;
                        default:
                            o=o.sub;
                            arr = value.split('.');
                            o=o[arr[0]];
                            o=o.sub;
                            o=o[arr[1]];
                    }
                    comments = (o? (o.comments || '') :'');
                    //delete the first \n first
                    if(comments)comments = comments.replace(/^[\r\n]*/, '');
                    code = code || (o&&o.code) || '';

                    linb.thread.suspend(threadid);
                    var t = linb([node],false).getRegion(true),
                    pro = self.PageEditor.texteditor.reBoxing().getRegion(true);

                    linb.dom.fxProxy(t, pro
                        ,null,function(){
                            //keep old value
                            self.PageEditor.setText(self.properties.temptext = comments+code).activate();
                            self.PageEditor.setReadonly(value=='Class' || value=='Instance' || value=='Static')

                        },240,8,'inexp').start();
                    self.refer=o;
                    linb.thread.resume(threadid);
                });
        },
        base:['linb.UI'],
        required:[
            'linb.UI.Layout',
            'linb.UI.TreeBar',
            'linb.coder',
            'VisualJS.ClassTool',
            'VisualJS.PageEditor'
        ],
        parepareData:function(properties,events){
            events.afterShow=function(page){
                page.setText(page.properties.text, true);
            };
        },
        iniComponents:function(){
            this.nodes = [];
            var self=this;
            // [[designer
            //
            // layoutFill
            //
            //new linb.UI.Layout
            this.layoutFill = new linb.UI.Layout();
            //set name to layoutFill
            this.layoutFill.alias("layoutFill");
            //set properties
            this.layoutFill.host(this).setLeft(0).setTop(0).setItems([
            {
                "id" : "before",
                "pos" : "before",
                "locked" : false,
                "size" : 150,
                "min" : 50,
                "max" : 200,
                "cmd" : false
            }])
            .setType("horizontal");
            //
            //add layoutFill to parent node
            this.nodes.push(this.layoutFill.get(0));
            //
            // treebarClass
            //
            //new linb.UI.TreeBar
            this.treebarClass = new linb.UI.TreeBar();
            //set name to treebarClass
            this.treebarClass.alias("treebarClass");
            //set properties
            this.treebarClass.host(this).setLeft(0).setTop(0).setGroup(false).setItems([]).setIniFold(false);

            this.treebarClass.onItemSelected(this._treebarclass_onitemselected).beforeValueUpdated(this._treebarclass_beforevalueupdated);
            //
            //add treebarClass to parent node
            this.layoutFill.attach(this.treebarClass, 'before');


            // ]]designer
        }
    }
});

Class('VisualJS.ObjectEditor', 'linb.Page',{
    Instance:{
        events:{
            afterCreated:function(page, threadid){
                _.asyCall('VisualJS.PageEditor' ,'show', [page.dialog, '',{
                    checkType:'js'
                },{}, page],
                false, threadid, function(){page.PageEditor=this});
            }
        },
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the VisualJS
        required:[
            "linb.UI.Dialog",
            "linb.UI.Panel",
            "linb.UI.Button",
            "VisualJS.ClassTool"
        ],
        check:function(txt){
            return this.PageEditor.check(txt);
        },
        _dialog_beforeclose:function(profile){
            this.dialog.hide();
            return false;
        },
        _btncancel_onclick:function(){
            this.dialog.close();
        },
        _btnok_onclick:function(){
            var txt = this.PageEditor.getText(false);
            if(txt===false)return false;
            //check dirty
            if(this.properties.text != txt){
                //check first
                if(false === this.check(txt))return false;
                //parse comments and code, check code in the process
                this.properties.result = VisualJS.ClassTool.parseSingleBlock(txt);

                if(false === this.properties.result){
                    linb.message(linb.getStr('VisualJS.classtool.err1'));
                    return false;
                }

                //set back
                this.properties.text = txt;

                this.properties.object = _.unserialize(this.properties.text) || null;

                _.tryF(this.events.onOK,[this],this.host);
            }
            this.dialog.close();
        },

        customAttach:function(){
            var page=this;
            prop = page.properties;
            page.dialog.setCaption(prop.caption).setIcon(prop.icon).setIconPos(prop.iconPos);
            page.PageEditor.setText(prop.text);
            if(prop.fromRegion)
                page.dialog.setFromRegion(prop.fromRegion);

            if(!this.dialog.get(0).root)
                this.dialog.create();
            page.dialog.show(this.parent, true);

            return false;
        },
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];
            //
            // dialog
            //
            //new linb.UI.Dialog
            this.dialog = (new linb.UI.Dialog)
            //set name/host/template/appearance/behavior
            .alias("dialog").host(this)
            //set properties
            .setLeft(216).setTop(80).setWidth(500).setMaxBtn(false).setMinBtn(false)
            .beforeClose(this._dialog_beforeclose)
            ;
            //add dialog to node list
            this.nodes.push(this.dialog.get(0));
            //
            // panelB
            //
            //new linb.UI.Panel
            this.panelB = (new linb.UI.Panel)
            //set name/host/template/appearance/behavior
            .alias("panelB").host(this)
            //set properties
            .setDock("bottom").setHeight(35)
            ;
            //attach panelB to parent
            this.dialog.attach(this.panelB);
            //
            // panelR
            //
            //new linb.UI.Panel
            this.panelR = (new linb.UI.Panel)
            //set name/host/template/appearance/behavior
            .alias("panelR").host(this)
            //set properties
            .setDock("right").setWidth(284)
            ;
            //attach panelR to parent
            this.panelB.attach(this.panelR);
            //
            // btnCancel
            //
            //new linb.UI.Button
            this.btnCancel = (new linb.UI.Button)
            //set name/host/template/appearance/behavior
            .alias("btnCancel").host(this)
            //set properties
            .setLeft(64).setTop(8).setWidth("100").setCaption("Cancel").setIcon("img/App.gif").setIconPos("-16px -16px").onClick(this._btncancel_onclick)
            ;
            //attach btnCancel to parent
            this.panelR.attach(this.btnCancel);
            //
            // btnOK
            //
            //new linb.UI.Button
            this.btnOK = (new linb.UI.Button)
            //set name/host/template/appearance/behavior
            .alias("btnOK").host(this)
            //set properties
            .setLeft(176).setTop(8).setWidth("100").setCaption("OK").setIcon("img/App.gif").setIconPos("-64px -16px").onClick(this._btnok_onclick)
            ;
            //attach btnOK to parent
            this.panelR.attach(this.btnOK);
            //
            //
            return this.nodes;
            // ]]code creted by designer
        }
    }
});

/*
An editor for function
*/
Class('VisualJS.ProjectPro', 'linb.Page',{
    Instance:{
        requestKey:'VisualJS',

        base:['linb.UI'],
        required:[
            'linb.UI.Label',
            'linb.UI.Input',
            'linb.UI.Button',
            'linb.UI.Dialog'
        ],
        _dialog_beforeclose:function(profile){
            this.dialog.hide();
            return false;
        },
        _btncancel_onclick:function(){
            this.dialog.close();
        },
        _btnok_onclick:function(){
            if(this.inputName.checkUIValueValid()===false ||
                this.inputClassName.checkUIValueValid()===false){
                    linb.message(linb.getStr('VisualJS.projectPro.invalid'));
                    return;
            }


            var pm = this.projectName = this.inputName.updateValue().getValue();
            this.className = this.inputClassName.updateValue().getValue();

            var self = this;
            linb.request(VisualJS.config.phpPath,_.serialize({
                key:this.requestKey,
                para:{
                    action:'new',
                    hashCode:_.id(),
                    path:this.projectName,
                    className: this.className
                }
            }),function(txt){
                var obj = _.unserialize(txt);
                if(!obj || obj.error)
                    linb.message(txt);
                else
                    _.tryF(self.events.onOK, ['projects/'+pm, obj], self.host);
                self.dialog.close();
            },function(txt){
                linb.message(txt);
            });
        },
        _inputname_aftervaluechanged:function(profile, oldValue,newValue){
            this._refreshLabel(newValue);
        },
        _refreshLabel:function(prjname, filename){
            filename = filename || 'index';
            this.label7.setCaption(linb.ini.appPath+'projects/'+prjname +'/'+filename+'.html');
            this.label8.setCaption(linb.ini.appPath+'projects/'+prjname +'/VisualJS/js/'+filename+'.js');
        },
        parepareData:function(properties,events){
            properties.caption = properties.caption || 'Project properties';
            properties.projectName = properties.projectName || 'linbApp';
            properties.jsLINBPath = properties.jsLINBPath || '';
            properties.className = properties.className || 'App';
            properties.fromRegion = properties.fromRegion || null;
            properties.readonly = properties.readonly || false;
        },
        customAttach:function(){
            var prop = this.properties;

            this.dialog.setCaption(prop.caption).setIcon(prop.icon).setIconPos(prop.iconPos);
            this.inputName.setValue(prop.projectName, true);
            this.inputClassName.setValue(prop.className, true);
            this._refreshLabel(prop.projectName);

            if(prop.fromRegion){
                this.dialog.setFromRegion(prop.fromRegion);
            }
//todo:form widget
            this.inputName.setDisabled(prop.readonly);
            this.inputClassName.setDisabled(prop.readonly);

            this.dialog.show(this.parent, true);
        },
        iniComponents:function(){
            // [[designer
            this.nodes = [];

            this.dialog = (new linb.UI.Dialog)
            .alias("dialog").host(this)
            .setLeft(100).setTop(100).setWidth(540).setHeight(220).setMinBtn(false).setMaxBtn(false).setResizable(false)
            .onHotKeydown("_dialog_onhotkey")
            .beforeClose('_dialog_beforeclose');

            this.nodes.push(this.dialog.get(0));

            this.btnCancel = new linb.UI.Button();
            this.btnCancel.alias("btnCancel");
            this.btnCancel.host(this).setLeft(262).setTop(152).setWidth(90).setTabindex('0').setPosition("absolute").setCaption("$VisualJS.cancel").setIcon('img/App.gif').setIconPos("-16px -16px");
            this.btnCancel.onClick(this._btncancel_onclick);

            this.dialog.attach(this.btnCancel, null);

            this.label1 = (new linb.UI.Label)
            .alias("label1").host(this)
            .setLeft(14).setTop(18).setWidth(104).setVAlign("top").setCaption('$VisualJS.projectPro.name');

            this.dialog.attach(this.label1, null);

            this.inputName = new linb.UI.Input();
            this.inputName.alias("inputName");
            this.inputName.host(this).setLeft(126).setTop(16).setValidTips('$VisualJS.projectPro.onlyword').setValueFormat("^\\w{3,15}$").afterValueUpdated(this._inputname_aftervaluechanged);

            this.dialog.attach(this.inputName, null);

            this.label5 = new linb.UI.Label();
            this.label5.alias("label5");
            this.label5.host(this).setLeft(38).setTop(50).setWidth(80).setVAlign("top").setCaption('$VisualJS.projectPro.class');

            this.dialog.attach(this.label5, null);

            this.inputClassName = new linb.UI.Input();
            this.inputClassName.alias("inputClassName");
            this.inputClassName.host(this).setLeft(126).setTop(48).setValueFormat("^\\w{3,15}$").setValidTips('$VisualJS.projectPro.onlyword');

            this.dialog.attach(this.inputClassName, null);

            this.label2 = new linb.UI.Label();
            this.label2.alias("label2");
            this.label2.host(this).setLeft(30).setTop(114).setWidth(88).setVAlign("top").setCaption('$VisualJS.projectPro.pagefile');

            this.dialog.attach(this.label2, null);

            this.label3 = new linb.UI.Label();
            this.label3.alias("label3");
            this.label3.host(this).setLeft(30).setTop(82).setWidth(88).setVAlign("top").setCaption('$VisualJS.projectPro.classfile');

            this.dialog.attach(this.label3, null);

            this.label7 = new linb.UI.Label();
            this.label7.alias("label7");
            this.label7.host(this).setLeft(126).setTop(114).setWidth(384).setHAlign("left").setVAlign("top");

            this.dialog.attach(this.label7, null);

            this.label8 = new linb.UI.Label();
            this.label8.alias("label8");
            this.label8.host(this).setLeft(126).setTop(82).setWidth(384).setHAlign("left").setVAlign("top");

            this.dialog.attach(this.label8, null);


            this.btnOK = new linb.UI.Button();
            this.btnOK.alias("btnOK");
            this.btnOK.host(this).setLeft(374).setTop(152).setWidth(90).setPosition("absolute").setCaption("$VisualJS.ok").setIcon('img/App.gif').setIconPos("-64px -16px");
            this.btnOK.onClick(this._btnok_onclick);

            this.dialog.attach(this.btnOK, null);

            return this.nodes;

            // ]]designer
        },
        _dialog_onhotkey:function(profile, key, control, shift, alt){
            if(key=='esc')
                profile.boxing().close();
        }
    }
});

/*
An editor for function
*/
Class('VisualJS.ProjectSelector', 'linb.Page',{
    Instance:{
        requestKey:'VisualJS',

        base:['linb.UI'],
        required:[
            'linb.UI.List',
            'linb.UI.Button',
            'linb.UI.Dialog'
        ],
        _btncancel_onclick:function(){
            this.dialog.close();
        },
        _btnok_onclick:function(){
            var pm = this.projectName = this.listName.getUIValue();

            if(!this.projectName){
                linb.message(linb.getStr('VisualJS.ps.noselected'));
                return;
            }

            var self = this;
            linb.request(VisualJS.config.phpPath,_.serialize({
                key:this.requestKey,
                para:{
                    action:'open',
                    hashCode:_.id(),
                    path:this.projectName
                }
            }),function(txt){
                var obj = _.unserialize(txt);
                if(!obj || obj.error)
                    linb.message(txt);
                else
                    _.tryF(self.events.onOK, [pm, obj], self.host);
                self.dialog.close();
            });
        },
        _dialog_beforeclose:function(profile){
            this.dialog.hide();
            return false;
        },
        parepareData:function(properties,events){
            properties.caption = properties.caption || 'Select a project to open';
            properties.fromRegion = properties.fromRegion || null;
        },
        customAttach:function(){
            var self=this;
            var prop = self.properties;
            self.dialog.setCaption(prop.caption).setIcon(prop.icon).setIconPos(prop.iconPos);
            self.listName.setUIValue('').setItems([]);
            if(prop.fromRegion)
                self.dialog.setFromRegion(prop.fromRegion);
            self.dialog.show(self.parent, true);

            linb.dom.setCover(linb.getStr('VisualJS.ps.getting'));
            linb.request(VisualJS.config.phpPath, _.serialize({
                    key:this.requestKey,
                    para:{
                        action:'open',
                        hashCode:_.id(),
                        path:'projects',
                        deep:'0'
                    }
                }),
                function(txt){
                    var arr = _.unserialize(txt);
                    if(!arr || arr.error)
                        linb.message(txt);
                    else{
                        if(arr && arr.length){
                            self.properties.projectList=[];
                            arr.each(function(i){
                                if(i.type===0){
                                    self.properties.projectList.push({id:i.location,caption:i.name})
                                }
                            });
                        }
                        self.listName.setItems(prop.projectList);
                        linb.dom.setCover(false);
                    }
                },
                function(){
                    linb.dom.setCover(false);
                }
            );
        },
        iniComponents:function(){
            // [[designer
            this.nodes = [];

            this.dialog = new linb.UI.Dialog();
            this.dialog.alias("dialog");
            this.dialog.host(this).setLeft(100).setTop(100).setWidth(340).setHeight(190).setMinBtn(false).setMaxBtn(false).setResizable(false)
            .onHotKeydown("_dialog_onhotkey")
            .beforeClose('_dialog_beforeclose');
            ;

            this.nodes.push(this.dialog.get(0));

            this.listName = new linb.UI.List();
            this.listName.alias("listName");
            this.listName.host(this).setLeft(0).setTop(0).setDock('top').setHeight(120).setItems([]).setListKey('');

            this.dialog.attach(this.listName, null);

            this.btnCancel = new linb.UI.Button();
            this.btnCancel.alias("btnCancel");
            this.btnCancel.host(this).setLeft(140).setTop(130).setWidth(90).setZIndex("1").setPosition("absolute").setCaption("$VisualJS.cancel").setIcon('img/App.gif').setIconPos("-16px -16px");
            this.btnCancel.onClick(this._btncancel_onclick);

            this.dialog.attach(this.btnCancel, null);

            this.btnOK = new linb.UI.Button();
            this.btnOK.alias("btnOK");
            this.btnOK.host(this).setLeft(230).setTop(130).setWidth(90).setZIndex("1").setPosition("absolute").setCaption("$VisualJS.ok").setIcon('img/App.gif').setIconPos("-64px -16px");
            this.btnOK.onClick(this._btnok_onclick);

            this.dialog.attach(this.btnOK, null);

            return this.nodes;

            // ]]designer
        },
        _dialog_onhotkey:function(profile, key, control, shift, alt){
            if(key=='esc')
                profile.boxing().close();
        }
    }
});

Class('VisualJS.Designer', 'linb.Page',{
    Instance:{
        panelHeight:600,
        panelWidth:800,
        dropPosition:'absolute',
        dropOffset:10,

        base:['linb.UI'],
        required:[
            'linb.UI.Layout',
            'linb.UI.Input',
            'linb.UI.List',
            'linb.UI.Button',
            'linb.UI.ComboInput',
            'linb.UI.TreeBar',
            'linb.UI.TreeGrid',
            'linb.UI.Dialog',
            'linb.UI.Panel',
            'linb.UI.Block',
            'linb.UI.ToolBar',
            'linb.UI.Gallery',
            'VisualJS.ClassTool'
        ],
        getResource:function(threadid){
            linb.thread.suspend(threadid);
            linb.dom.setCover(linb.getStr('VisualJS.designer.getting'));
            var self=this;
            var ajax1 = linb.ajax('VisualJS/js/WidgetsConfig.js', null , function(txt){
                    self.clsItems = _.unserialize(txt);
                    var fun=function(items,hash){
                        var self=arguments.callee;
                        items.each(function(o){
                            hash[o.id]=o;
                            if(o.sub && o.sub.length)
                            self(o.sub, hash);
                        });
                    };
                    self.mapWidgets = {};
                    fun(self.clsItems, self.mapWidgets);
                },
                function(txt){linb.log(txt)}
            );
            linb.ajax.group({'ajax1':ajax1},null,null,function(){
                linb.thread.resume(threadid);
            }).start();
        },
        events:{
            afterShow:function(page, threadid){
                page.treebarCom.setCustomBehavior({
                    BAR:{
                        onMousedown : function(profile, e, src){
                            var id=src.id,
                                itemId = profile.getSubSerialId(id),
                                properties = profile.properties,
                                item = profile.getItemByDom(id),
                                pos=linb.event.getPos(e);

                            if(item.dragable){
                                profile.getSubNode(profile.keys.ICON, itemId).startDrag(e,{drop2:true, icon:linb.ini.path +'onDrag.gif', dragMode:'add', cursor:'pointer', target_left:pos.left+12,target_top:pos.top+12, move:false, key:item.dragKey || profile.properties.dragKey, data:{type:item.id, iconPos:item.iconPos}});
                                profile.removeTagClass(linb(src),profile.keys.BAR,'-mouseover');
                            }
                        }
                    }
                });

                //focus
                page.focusBtn = linb.create('<a href="javascript;" style="position:absolute;left:-10000px;top:-10000px;width:1px;height:1px;">o</a>');
                page.focusBtn.onKeydown(function(pro, e, src){
                    if(!page.resizer)return;

                    var key = linb.event.getKey(e),
                    k=key[0],
                    ctrl=key[1],
                    shift=key[2],
                    step=1,
                    o=page.resizer.reBoxing(),
                    profile = page.resizer.get(0),
                    cssPos=o.cssPos(),
                    cssSize=o.cssSize(),
                    gridh = profile.properties.dragArgs.grid_height,
                    gridw = profile.properties.dragArgs.grid_width
                    ;

                    var t,b=false,size=null,pos=null;

                    switch(k){
                        case 'up':
                            b=true;
                            if(ctrl)
                                step=-1;
                            else{
                                if(shift)
                                    step = (t=(cssPos.top+cssSize.height) % gridh)?-t:-gridh;
                                else
                                    step =(t = cssPos.top % gridh)?-t:-gridh;
                            }
                            if(shift){
                                o.heightBy(step);
                                profile.regions.heightBy(step);
                                size={ width :0, height :step};
                            }else{
                                o.topBy(step);
                                pos={left :0, top :step};
                            }
                            break;
                        case 'down':
                            b=true;
                            if(ctrl)
                                step=1;
                            else{
                                if(shift)
                                    step = (t=(cssPos.top+cssSize.height) % gridh)?gridh-t:gridh;
                                else
                                    step =(t = cssPos.top % gridh)?gridh-t:gridh;
                            }
                            if(shift){
                                o.heightBy(step);
                                profile.regions.heightBy(step);
                                size={ width :0, height :step};
                            }else{
                                o.topBy(step);
                                pos={left :0, top :step};
                            }
                            break;
                        case 'left':
                            b=true;
                            if(ctrl)
                                step=-1;
                            else{
                                if(shift)
                                    step = (t=(cssPos.left+cssSize.width) % gridw)?-t:-gridw;
                                else
                                    step =(t = cssPos.left % gridw)?-t:-gridw;
                            }
                            if(shift){
                                profile.regions.widthBy(step);
                                o.widthBy(step);
                                size={ width :step, height :null};
                            }else{
                                o.leftBy(step);
                                pos={left :step, top :0};
                            }
                            break;
                        case 'right':
                            b=true;
                            if(ctrl)
                                step=1;
                            else{
                                if(shift)
                                    step = (t=(cssPos.left+cssSize.width) % gridw)?gridw-t:gridw;
                                else
                                    step =(t = cssPos.left % gridw)?gridw-t:gridw;
                            }
                            if(shift){
                                o.widthBy(step);
                                profile.regions.widthBy(step);
                                size={ width :step, height :null};
                            }else{
                                o.leftBy(step);
                                pos={left :step, top :0};
                            }
                            break;
                        case 'delete':
                            page._deleteSelected();
                            page._focus();
                            break;
                        case 'esc':
                            page._clearSelect();
                            //reset
                            page._setSelected([], true);
                            break;
                    }
                    if(b){
                        profile.boxing().onUpdate(profile, profile._target, size, pos);
                        return false;
                    }
                }).
                onFocus(function(pro, e, src){
                    clearTimeout(page.timer);
                    page.resizer.active(false);
                }).
                onBlur(function(pro ,e , src){
                    page.timer = _.asyRun(function(){
                        if(page.resizer)page.resizer.inActive();
                    },200);
                });
                page.layoutBase.reBoxing().addFirst(page.focusBtn);

                //proxy region
                page.proxy = linb.create('<div style="position:absolute;border:dashed 1px blue;overflow:visible;left:-100px;top:-100px;z-index:1000"></div>');

                //resizer
                page.resizer = linb.create('Resizer',{
                    dragArgs:{
                        grid_width:this.dropOffset,
                        grid_height:this.dropOffset
                    },
                    zIndex:linb.ini.top_zIndex
                });
                page.resizer.host(page)
                .onItemsSelected(function(profile, ids){
                    this.pProfile.setSelectFromResizer.call(this.pProfile,ids);
                })
                .onActive(function(profile){
                    this._focus();
                })
                .onUpdate(function(profile, target, size, cssPos){
                    page._change();

                    var self=this;
                    if(target){
                        var b=false;
                        target.each(function(target){
                            target = linb([target],false);
                            var profile = linb.UIProfile.getFromDom(target), widget=profile.boxing(),p = profile.properties, m = profile.box.getDataModel();
                            if(size){
                                var w=null,h=null;
                                if(size.width){
                                    if(p && !m.width){
                                        b=true;
                                    }else{
                                        switch(p.dock){
                                            case 'top':
                                            case 'bottom':
                                            case 'fill':
                                            case 'cover':
                                            case 'width':
                                                b=true;
                                                break;
                                            case 'left':
                                            case 'right':
                                            case 'height':
                                                b=true;
                                            default:
                                                target.widthBy(size.width,true);
                                                w = widget.refreshWidth();
                                            }
                                    }
                                }
                                if(size.height){
                                    if(p && !m.height){
                                        b=true;
                                    }else{
                                        switch(p.dock){
                                            case 'left':
                                            case 'right':
                                            case 'fill':
                                            case 'cover':
                                            case 'height':
                                                b=true;
                                                break;
                                            case 'top':
                                            case 'bottom':
                                            case 'width':
                                                b=true;
                                            default:
                                                target.heightBy(size.height,true);
                                                h = widget.refreshHeight();
                                        }
                                    }
                                }

                                self._sizeUpdated(target, { width :w, height :h});
                            }
                            if(cssPos){
                                var x=null,y=null;
                                if(cssPos.left){
                                    if(p && !m.left){
                                        b=true;
                                    }else{
                                        switch(p.dock){
                                        case 'top':
                                        case 'bottom':
                                        case 'left':
                                        case 'right':
                                        case 'fill':
                                        case 'cover':
                                        case 'width':
                                            b=true;
                                            break;
                                        case 'height':
                                            b=true;
                                        default:
                                            target.leftBy(cssPos.left);
                                            x = widget.refreshLeft();
                                        }
                                    }
                                }
                                if(cssPos.top){
                                    if(p && !m.top){
                                        b=true;
                                    }else{
                                        switch(p.dock){
                                        case 'left':
                                        case 'right':
                                        case 'top':
                                        case 'bottom':
                                        case 'fill':
                                        case 'cover':
                                        case 'height':
                                            b=true;
                                            break;
                                        case 'width':
                                            b=true;
                                         default:
                                            target.topBy(cssPos.top);
                                            y = widget.refreshTop();
                                        }
                                    }
                                }

                                self._posUpdated(target, {left :x, top :y});
                            }
                        });
                        if(b)profile.boxing().rePosSize();
                    }
                })
                .onFocusChange(function(profile, index){
                    if(this.tempSelected){
                        this.SelectedFocus=index;
                        _.resetRun('$profilegrid$', this._refreshProfileGrid,0,[this.tempSelected],this);
                    }
                });
                //div for hold resizer and proxy
                page.holder = linb.create('<div style="display:none;"></div>');
                //not attach
                page.panelDiv.reBoxing().addLast(page.holder);
                page.holder.attach(page.resizer);
                page.holder.addLast(page.proxy);

                page.proxy.get(0).zIndexIgnore=true;

                page._enablePanelDesign(page.canvas.get(0));

                //set to default status
                page.setText(page.properties.text,true,threadid);
            },
            onSelected:function(page, profile, ids){
                var v=null, id = ids && ids[ids.length-1];
                if(id){
                    var o = linb.getObject(id);
                    if(o)
                        v = o;
                }
                page.listObject.setCtrlValue(v?v.alias:'page', true);

                _.resetRun('$profilegrid$', page._refreshProfileGrid,0,[ids],page);
            }
        },
        //dettach resizer and proxy from panel
        _detatchResizer:function(){
            this.holder.addLast(this.resizer);
            this.holder.addLast(this.proxy);
            //clear those cache
            this.pProfile = this.pNode = null;
        },
        //attach resizer and proxy to panel
        _attachResizer:function(profile, node){
            this.proxy.display('none');
            this.resizer.resetTarget(null,false);
            linb(node)
            .addLast(this.resizer)
            .addLast(this.proxy)
            ;
            //set markable var
            this.pProfile = profile;
            this.pNode = node;
            _.merge(this.resizer.get(0).properties.dragArgs,{
                grid_width:this.dropOffset,
                grid_height:this.dropOffset
            },'all');
        },
        //give focus
        _focus:function(){
            //avoid focus trigger scroll
//            this.focusBtn.top(this.panelDiv.reBoxing().scrollTop())
//            .left(this.panelDiv.reBoxing().scrollLeft());
            this.focusBtn.focus();
        },
        _setSelected:function(ids, flag){
            var t;
            ids=_.arr(ids);
            this.tempSelected = ids;
            this.SelectedFocus = ids.length-1;

            this.toolbar.disableGroup('align', ids.length>1?false:true);
            if(ids.length>0 && (t=linb.UIProfile.getFromCacheId(ids[0])))
                this.toolbar.disableGroup('pos', !t.box.hasDomRoot);
            else
                this.toolbar.disableGroup('pos', true);

            this.toolbar.disableGroup('del', ids.length>0?false:true);

            // fire event
            if(flag) this.events.onSelected.apply(this.parent, [this, this.pProfile, ids]);

            this._focus();

            return this;
        },
        _sizeUpdated:function(pro, size){
            var t,self=this;
            if(!(t=self.profileGrid.get(0).$widget))return;
            if(linb.UIProfile.getFromDom(pro) == t.get(t.length()-1))
                _.asyRun(function(){
                    if(size.width!==null)
                    self.profileGrid.updateCellbyRowCol('properties:width','value',size.width,true)
                    if(size.height!==null)
                    self.profileGrid.updateCellbyRowCol('properties:height','value',size.height,true)
                    ;
                })
        },
        _posUpdated:function(pro, cssPos){
            var t,self=this;
            if(!(t=self.profileGrid.get(0).$widget))return;
            if(linb.UIProfile.getFromDom(pro) == t.get(t.length()-1))
                _.asyRun(function(){
                    if(cssPos.left!==null)
                    self.profileGrid.updateCellbyRowCol('properties:left','value',cssPos.left,true)
                    if(cssPos.top!==null)
                    self.profileGrid.updateCellbyRowCol('properties:top','value',cssPos.top,true)
                    ;
                })
        },
        parseFun:function(txt){
            var str = txt;
            var reg = new RegExp("^(\\s*\\/\\*[^*@]*\\*+([^\\/][^*]*\\*+)*\\/\\s*)|^(\\s*\\/\\/[^\\n]*\\s*)");
            while(reg.test(str)){
                str = str.replace(reg,'');
            }
            str = str.replace(/\s*/,'');
            if(!str)return {comments:null, code:null};

            if (false === this.check(str.replace(/\s*$/,'')) ) return false;

            return {comments: '\n'+txt.replace(str,''), code:str.replace(/\s*$/,'')};
        },

        _WidgetsSelected : function(ids){
            var self=this;
            this._setSelected(ids,true);
            this.gallery.updateUIValue(null);
        },
        _clearSelect : function(profile){
            this.resizer.resetTarget(null,false);
            this._detatchResizer();
            this.gallery.updateUIValue(null);
        },
        _deleteSelected : function(){
            if(!this.tempSelected || !this.tempSelected.length)return;
            var page = this;
            linb.UI.Dialog.confirm(linb.getStr('VisualJS.designer.confirmdel'),linb.getStr('VisualJS.designer.confirmdel2', this.tempSelected.length),function(){
                var sel = linb.UI.getByCacheId(page.tempSelected);
                if(!sel.isEmpty()){
                    var ids=[];
                    //destroy, and will dettach from parent
                    var ws = linb.UI.getByCacheId(page.tempSelected);
                    ws.each(function(o){
                        if(!o.box.hasDomRoot){
                            page.gallery.removeItems(o.$id);
                        }
                    });

                    ws.destroy();
                }else{
                    var o = linb.getObject(page.tempSelected[0]);
                    if(o.box['linb.DataSource'])
                        page.gallery.removeItems(page.tempSelected);
                    o.boxing().destroy();
                }
                //clear resizer
                page._clearSelect(page.pProfile);

                //fire event
                //page.onDeleted(page.pProfile, page.tempSelected);

                page._setSelected(null,true);
            });

        },
        _giveHandler:function(target){
            var getRootId = function(id){
                var arr = id.split(':');
                return arr[0].split('-')[0]+':'+arr[1]+':';
            },prevent = function(){
                return;
            };
            var page=this;
            target.root.beforeClick(prevent).afterClick(prevent).onClick(function(pro, e, src){
                var id;
                if(getRootId(linb.event.getSrc(e).id)!= (id=getRootId(src.id)))return;
                var t,key=linb.event.currentKey,profile=linb.UIProfile.getFromDomId(id);
                if(!profile)return;
                //if change panel, clear the panel selected
                if(page.pProfile && (page.pProfile !=profile.parent))
                    page.pProfile.selected = [];

                if(t=profile.parent){
                    if(key && key[2])
                        t.reSelectObject.call(t,profile, profile.root.parent());
                    else
                        t.selectObject.call(t,profile, profile.root.parent());
                }
                return false;
            });
        },
        _enablePanelDesignFace:function(profile, key){
            //add a class panel
            profile.getSubNode(profile.keys[key],true).addClass('panel')
            .addEventHandler('drop')
            .addEventHandler('mousedown')
            .addEventHandler('click')
            .addEventHandler('drag')
            .addEventHandler('dragend')
            .addEventHandler('mouseup');
        },
        _enablePanelDesign:function(profile){
            var t,key = profile.box.KEY,pool = linb.cache.$dropPool, page=this,h, k,
            self=this,
            cb={
                //overwrite
                beforeMouseover:function(profile, e, src){
                    var dd = linb.dragDrop, key = dd.dragKey, data = dd.data;

                    //not include the dragkey
                    if(!key
                    || !data
                    || !(new RegExp('\\b'+key+'\\b')).test(profile.box.getDropKeys(profile, this))

                    || data.parentId == profile.$id
                    || (data.data && data.data.exists(profile.$id))

                    || (profile.onDropTest && (false==profile.boxing().onDropTest(profile, key, data)))
                    )return;

                    //for trigger onDrop
                    dd._current=src;
                    //show region
                    _.resetRun('showDDMark', dd.showDDMark, 0, [this], dd);

                    var id = (id=profile.getItemByDom(src)) && id.id;
                    if(profile.onDragEnter)profile.boxing().onDragEnter(profile, e, this, id);
                },
                beforeDrop:function(profile, e, src){
                    self._change();

                    var target,
                        dropx=linb.dragDrop.left,
                        dropy=linb.dragDrop.top,
                        dragKey = linb.dragDrop.dragKey,
                        dragData = linb.dragDrop.dragData,
                        type=dragData.type,
                        iconPos = dragData.iconPos,
                        data=dragData.data,
                        pos=dragData.pos
                        ;
                    var ids;
                    var offset = self.dropOffset;

                    var fun=function(){
                        if(!linb.SC(type).hasDomRoot){
                            //give design mark
                            var o = linb.create(type, {$design:self.properties.$design}).get(0);
                            page.gallery.insertItems([{id:o.$id, icon:'img/widgets.gif', iconPos:iconPos}]);
                            page.gallery.updateUIValue(o.$id);
                            //
                        }else{
                            //before drop check
                            //if(false===_.tryF(c.beforeAddWidget, [data], profile))return;

                            //check position
                            if(self.dropPosition=='absolute'){
                                // get Pos
                                var basePos = linb(src).absPos(),
                                cssPos = {
                                    left : parseInt((dropx - basePos.left)/offset)*offset,
                                    top : parseInt((dropy - basePos.top)/offset)*offset
                                };
                                //give design mark
                                target = new (linb.SC(linb.iBox.$type[type]))({$design:self.properties.$design});
                                target.create();

                                var p=target.get(0).properties;

                                if(!p.$left)target.setLeft(['top','bottom','width','fill','cover'].exists(p.dock)?0:cssPos.left);
                                if(!p.$top)target.setTop(['left','right','height','fill','cover'].exists(p.dock)?0:cssPos.top);
                                if(!p.$position)target.setPosition('absolute');
                                target.setZIndex(1);
                            }else{
                                //give design mark
                                target = new (linb.SC(linb.iBox.$type[type]))({$design:self.properties.$design});
                                target.create();
                            }
                            var pro = target.get(0);

                            page._giveHandler(pro);
                            if(linb.cache.$dropPool[type])
                                page._enablePanelDesign(pro);

                            pro._host=page;
                            // add default event handlers

                            var t=pro.box.$EventHandlers;
                            for(var i in t)
                                pro[i]=t[i];

                            ids=[target['linb.iBox'] ? pro.$id : target.$id];

                            // add widgets to panel
                            //if(target['linb.UI'])linb.UI.canvas.prototype.attach.call(profile.boxing(), target);
                            if(target['linb.UI'])profile.boxing().attach(target, profile.getItemIdByDom(src));
                            //_.tryF(page.afterAddWidget, [target, profile.$id], page);

                            profile.setSelectFromPanel.call(profile, src, ids);
                            //refer dom node dir
                            src=null;
                        }
                    };
                    if(type){
                        if(linb.SC.evalPath(type)){
                            fun();
                        }else{
                            linb.dom.UIAction(function(){
                                linb.dom.setCover(linb.getStr('VisualJS.designer.loading') + type);
                                linb.SC(type, true, fun);
                            });
                        }
                    }else{
                        var basePos = linb(src).absPos(),
                        cssPos = {
                            left : parseInt((dropx - basePos.left)/offset)*offset,
                            top : parseInt((dropy - basePos.top)/offset)*offset
                        };
                        var t;
                        ids=data;
                        target = linb.UI.getByCacheId(ids);

                        var minx,miny;
                        target.each(function(o,i){
                            if(i===0){
                                minx = o.properties.left;
                                miny = o.properties.top;
                            }else{
                                minx = Math.min(o.properties.left,minx);
                                miny = Math.min(o.properties.top,miny);
                            }
                        });
                        target.each(function(o){
                            if(o.properties.dock!='none')o.box.dock(o,true);
                            else{
                                o.boxing()
                                .setLeft(o.properties.left - minx + cssPos.left)
                                .setTop(o.properties.top - miny + cssPos.top);
                            }
                        });

                        // add widgets to panel
                        profile.boxing().attach(target, profile.getItemIdByDom(src));
                        //_.tryF(page.afterMoveWidget, [target, profile.$id], page);

                         profile.setSelectFromPanel.call(profile, src, ids);
                    }
                },
                onMousedown:function(profile, e, src){
                    if(linb.event.getSrc(e) !== src)return;
                    var o =linb(src),
                    pos = linb.event.getPos(e),
                    absPos=o.absPos(),
                    w = o.clientWidth(),
                    h = o.clientHeight();
                    //in the scroll bar
                    if(pos.left-absPos.left>w)return;
                    if(pos.top-absPos.top>h)return;

                    // keep pos
                    profile._offsetPos = absPos;
                    profile._scrollTop = o.scrollTop();
                    profile._scrollLeft = o.scrollLeft();

                    page._attachResizer(profile, src);
                    profile._selregion = {};

                    var pos = linb.event.getPos(e);
                    linb(src).startDrag(e,{move:false,type:'blank',cursor:true,target_left:pos.left,target_top:pos.top,defer:1});
                    profile.$dragging=false;
                },
                onClick:function(profile, e, src){
                    if(linb.event.getSrc(e) !== src)return;
                    self._clearSelect(profile);
                    profile.setSelectFromPanel.call(profile, this, []);
                },
                beforeDrag:function(profile, e, src){
                    var t, dd =linb.dragDrop, size = dd.getOffset(),
                    proxy=page.proxy;

                    var region = profile._selregion;
                    if((t=size.width)<0)size.width=-t;
                    if((t=size.height)<0)size.height=-t;

                    region.left=Math.min(dd.origin_x,dd.left) - profile._offsetPos.left + profile._scrollLeft;
                    region.top=Math.min(dd.origin_y,dd.top) - profile._offsetPos.top + profile._scrollTop;
                    region.width=size.width;
                    region.height=size.height;

                    proxy.setRegion(region);

                    if(!profile.$dragging){
                        proxy.display('block');
                        profile.$dragging = true;
                    }
                },
                beforeDragend:function(profile, e, src){
                    if(!profile._selregion)return;
                    var region = profile._selregion,
                    proxy=page.proxy,

                    selected=[],t,m,o,x1,y1,x2,y2,xx1,yy1,xx2,yy2,
                    self=this
                    ;

                    xx1 = region.left;
                    yy1 = region.top;
                    xx2 = xx1 + region.width;
                    yy2 = yy1 + region.height;
                    if(m=profile.children){
                        m.each(function(v,i){
                            v=v[0];
                            if(v.domNode.parentNode===self){
                                o=v.root;
                                x1= o.offsetLeft();
                                y1= o.offsetTop();
                                x2 = x1 + o.width();
                                y2 = y1 + o.height();
                                //in the region
                                if(xx2>x1 && x2>xx1 && yy2>y1 && y2>yy1)selected.push(v.$id);
                            }
                        });
                        //reset/cache proxy
                        profile.setSelectFromPanel.call(profile, this, selected);
                    }
                    proxy.display('none');
                },
                onMouseup:function(profile, e, src){
                    page.proxy.display('none');
                    profile._selregion=null;
                }
            };

            //drop key
            var a = profile.properties.dropKeys.split(/[^\w]+/);
            a.filter(function(o){
                return !!o;
            });
            if(a.indexOf('iDesign')==-1)
                a.push('iDesign');
            profile.properties.dropKeys=a.join(':');


            if(t=pool[key]){
                //t.each(function(i){
                var i=t[0];
                    if(profile.keys.KEY == profile.keys[i])
                        h=cb;
                    else{
                        h={};
                        h[i]=cb;
                    }
                    //profile.boxing().setCustomBehavior(h);
                    profile._CB=h;
                    profile.resetCache();

                    page._enablePanelDesignFace(profile, i)
                //});
            }

            _.merge(profile,{
                selectObject:function(obj,node){
                    var profile = this,
                    id=obj.$id;
                    return this.setSelectFromPanel(node, [id]);
                },
                reSelectObject:function(obj, node){
                    var profile = this;
                    id=obj.$id;
                    if(profile.selected && profile.selected.exists(id)){
                        profile.selected.removeValue(id);
                    }else{
                        (profile.selected ||(profile.selected=[])).push(id);
                    }
                    return this.setSelectFromPanel(node, profile.selected);
                },
                setSelectFromResizer:function(ids){
                    var profile = this;
                    profile.selected = ids;
                    return this.resetSelectRel();
                },
                setSelectFromPanel:function(node, ids){
                    var profile = this;
                    //attach resizer
                    if(self.pProfile !== profile ||
                        self.pNode !== node){
                        self._clearSelect(profile);
                        self._attachResizer(profile, node);
                    }

                    profile.selected = ids;
                    self.resizer.resetTarget(linb.UI.getByCacheId(profile.selected).reBoxing(), false);
                    return this.resetSelectRel();
                },
                resetSelectRel:function(){
                    var profile = this;
                    if(profile.selected && profile.selected.length){
                        var t=self.resizer.get(0).properties;
                        t.dragArgs={
                            key:'iDesign',
                            grid_width:self.dropOffset,
                            grid_height:self.dropOffset,
                            data:{
                                parentId:profile.$id,
                                data:profile.selected
                            }
                        };
                    }else{
                        self._clearSelect(profile);
                    }
                    _.tryF(self._WidgetsSelected,[profile.selected],self);

                    self._focus();
                }
            },'all');


        },
        _refreshProfileGrid:function(ids){
            var page=this;
            //delete grid first
            this.profileGrid.resetContent();
            if(!ids || !ids.length){
                var pro = this.canvas.get(0);
                var arr=[];
                var eh = _.get(this.properties.clsObject,['Static','EventHandlers']);
                if(!eh)eh=linb.Page.EventHandlers;
                var em=_.get(this.properties.clsObject,['Instance','events']);
                var getCode=function(o){
                    var code;

                    var em = _.get(o.clsStruct,['sub','Instance', 'sub','events', 'code']);
                    if(em)em=_.unserialize(em);else em={};

                    var funName = em[o.funName] || ('_'+o.funName.toLowerCase());
                    var item = _.get(o.clsStruct, ['sub','Instance', 'sub', funName]);
                    var comments = (item? (item.comments || '') :'');
                    if(comments)comments = comments.replace(/^[\r\n]*/, '');

                    //if em exists
                    if(item&&item.code){
                        code = item&&item.code;
                        o.mapName=em[o.funName];
                    //if em doesn't exist
                    }else{
                        if(!o.ini)return '';

                        code = ' '.repeat(8) + o.ini.toString().replace(/\n/g,'\n'+' '.repeat(8));

                        //new em
                        o.mapName = '_'+o.funName.toLowerCase();
                        //avoid name conflict
                        var pool = _.get(o.clsStruct, ['sub','Instance', 'sub']);
                        if(pool[o.mapName]){
                            var i=1,t;
                            while(pool[t=o.mapName+'_'+(++i)]){}
                            o.mapName=t;
                        }
                    }

                    return comments+code;
                };
                _.each(eh,function(o,i){
                    var $fun = function(profile, cell){
                        var o = cell.$tagVar;
                        var node = profile.getSubNode(profile.keys.CELL, cell._serialId);
                        _.asyCall('VisualJS.ObjectEditor' ,'show', [linb(document.body),'',{
                                icon:'img/App.gif',
                                iconPos:'-32px -32px',
                                text: getCode(o),
                                caption:o.widgetName+" => "+o.funName,
                                fromRegion:node.getRegion(true),
                                tagVar:o
                            },{
                                onOK:function(page){
                                    this._change();
                                    var tagVar = page.properties.tagVar;
                                    if(page.properties.result.code!==null){
                                        _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'code'], page.properties.result.code);
                                        _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'comments'], page.properties.result.comments);

                                        profile.box.changeCellValue(profile, cell, tagVar.mapName,true);
                                    }else{
                                        _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'code'], null);
                                        _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'comments'], null);

                                        var em = _.get(tagVar.clsStruct,['sub','Instance', 'sub','events', 'code']);
                                        if(em){
                                            em=_.unserialize(em);
                                            delete em[tagVar.funName];
                                            _.set(tagVar.clsStruct,['sub','Instance', 'sub','events', 'code'], _.serialize(em));
                                        }

                                        profile.box.changeCellValue(profile, cell,'',true);
                                    }
                                    node.focus();
                                }
                            },page/*, use asyCall threadid*/
                            ], true, null, function(){});
                    },
                    $tagVar = {
                         widgetName: 'page',
                         obj : this.properties.clsObject,
                         clsStruct: this.properties.clsStruct,
                         clsObject: this.properties.clsObject,
                         funName: i,
                         mapName:(em&&em[i])||'',
                         ini:o
                    };
                    arr.push({id:'event:'+i, cells:[
                        {value:i, type:null, $tagVar: null, event:null },
                        {value:(em&&em[i])||'', type:'popbox', $tagVar:$tagVar, event:$fun}]
                    });
                },this);
                var rows=[
                    {id:'alias',           cells:[{value:'alias', type:'label'},{value: "page", type:'label'}] },
                    {id:'properties:width', cells:[{value:'width',type:'label'}, {value: pro.properties.width, type:''}] },
                    {id:'properties:height',cells:[{value:'height', type:'label'}, {value: pro.properties.height, type:''}] },
                    {id:'UIE', cells:[{value:'events',type:'label'}, {value:'', type:'label'}], sub: arr}
                ];
                var list=[];

                this.profileGrid.insertRows(rows);
                this.profileGrid.get(0).$widget=this.canvas;
            }else{
                var t,len,uis = linb.UI.getByCacheId(ids);
                //if exists, give grid info
                if(len = uis.length()){
                    var pro = uis.get(this.SelectedFocus);
                    var cache =[0,0,0,0,0,0,0,0],
                    cache2=0;

                    var $fun = function(profile, cell){
                        var o = cell.$tagVar;
                        var node = profile.getSubNode(profile.keys.CELL, cell._serialId);
                        var obj =o.profile[o.name];
                        _.asyCall('VisualJS.ObjectEditor' ,'show', [linb(document.body),'',{
                                caption:o.widgetName+" => "+o.name,
                                icon:'img/App.gif',
                                iconPos:obj.constructor==Array?'-128px -32px':'-16px -32px',
                                text:linb.coder.decode(
                                    _.serialize(
                                        linb.UI.pickObj( obj )
                                    )
                                ),
                                fromRegion:node.getRegion(true),
                                tagVar:o
                            },{
                                onOK:function(page){
                                    this._change();
                                    var tagVar = page.properties.tagVar;
                                    tagVar.profile.boxing()[tagVar.funName](page.properties.object);
                                    node.focus();
                                }
                            },page/*, use asyCall threadid*/
                            ], true, null, function(){});
                    };

                    var rows=[
                            {id:'key', cells:[{value:'class', type:'label'},{value:'<strong>'+pro.key+'</strong>',type:'label'}] },
                            {id:'alias',cells:[{value:'alias', type:'label'},{value:pro.alias, type:''}] },
                            {id:'template',     cells:[{value:'template', type:''}, {value:pro.template._id, type:'listbox', listKey: pro.box.KEY+':template'}] },
                            {id:'appearance',   cells:[{value:'appearance',type:''},{value:pro.appearance, type: 'listbox', listKey: pro.box.KEY+':appearance'}]},
                            {id:'behavior',     cells:[{value:'behavior', type:''},{value: pro.behavior._id, type:'listbox', listKey:pro.box.KEY+':behavior'}]},
                            {id:'properties',   cells:[{value:'properties',type:'label'},{value:'', type:'label'}], sub:[]},
                            {id:'UIE', cells:[{value:'events',type:'label'}, {value:'', type:'label'}], sub:[]},
                            {id:'CA',cells:[{value:'Custom Appearances', type:'label'},{value:'(Collection)', event:$fun, $tagVar:{
                                name:'CA',
                                funName:'setCustomAppearance',
                                profile:pro
                            }, type:'popbox:readonly'}] },
                            {id:'CB',cells:[{value:'Custom Behaviors', type:'label'},{value:'(Collection)', event:$fun, $tagVar:{
                                name:'CB',
                                funName:'setCustomBehavior',
                                profile:pro
                            }, type:'popbox:readonly'}] }
                    ];

                    var arr= [];
                    t = this.mapWidgets[pro.box.KEY].Templates;//_.toArr(pro.box.$Templates,true);
                    if(!t)t=[];
                    if(!t.exists('default'))t.insert('default',0);
                    t.each(function(o){
                         arr.push({id:o,caption:o,value:o});
                    });
                    linb.UI.setCacheList(pro.box.KEY+':template', arr);
                    arr= [];
                    t = this.mapWidgets[pro.box.KEY].Appearances;//_.toArr(pro.box.$Appearances,true);
                    if(!t)t=[];
                    if(!t.exists('default'))t.insert('default',0);
                    t.each(function(o){
                         arr.push({id:o,caption:o,value:o});
                    });
                    linb.UI.setCacheList(pro.box.KEY+':appearance', arr);
                    arr= [];
                    t = this.mapWidgets[pro.box.KEY].Behaviors;//_.toArr(pro.box.$Behaviors,true);
                    if(!t)t=[];
                    if(!t.exists('default'))t.insert('default',0);
                    t.each(function(o){
                         arr.push({id:o,caption:o,value:o});
                    });
                    linb.UI.setCacheList(pro.box.KEY+':behavior', arr);
                    arr= [];

                    //get properties
                    uis.each(function(t,i){
                        if(i===len-1)return;
                        if(!cache[0] && t.key != pro.key){
                            cache[0]=1;
                            cache2++;
                        }
                        if(!cache[1]){
                            rows[1].cells[1].type='label';
                            cache[1]=1;
                            cache2++;
                        }
                        if(!cache[2] && t.template._id != pro.template._id){
                            rows[2].cells[1].type='label';
                            cache[2]=1;
                            cache2++;
                        }
                        if(!cache[3] && t.appearance != pro.appearance){
                            rows[3].cells[1].type='label';
                            cache[3]=1;
                            cache2++;
                        }
                        if(!cache[4] && t.behavior._id != pro.behavior._id){
                            rows[4].cells[1].type='label';
                            cache[4]=1;
                            cache2++;
                        }
                        if(!cache[5]){
                            rows[5].cells[1].type='label';
                            cache[5]=1;
                            cache2++;
                        }
                        //all *ed
                        if(cache2==6)return false;
                    });
                    this.profileGrid.insertRows(rows);

                    //set target
                    this.profileGrid.get(0).$widget=uis;

                }else{
                    uis = linb.Base.getByCacheId(ids[0]);
                    pro = uis.profile;

                    var rows=[
                            {id:'key',  cells:[{value:'class',type:'label'},{value: pro.key, type:'label'}] },
                            {id:'alias', cells:[{value:'alias', type:'label'},{value:pro.alias, type:''}] },
                            {id:'properties', cells:[{value:'properties',type:'label'},{value:'', type:'label'}], sub:[]},
                            {id:'UIE',  cells:[{value:'events',type:'label'},{value:'', type:'label'}], sub:[]}
                    ];
                    this.profileGrid.insertRows(rows);

                    this.profileGrid.get(0).$widget=uis;
                }
            }
        },
        _change:function(){
            this._dirty=true;
            _.tryF(this.events.onValueChanged, [this, null, this._dirty], this.host);
        },

        //avoid to conflict with design code
        $toolbar_onclick:function(profile, id, groupid, src){
            var page = this;
            switch(groupid){
                case 'code':
                    switch(id){
                        case 'format':
                        case 'json':
                            linb.dom.UIAction(function(){
                    	        var dialog = new linb.UI.Dialog();
                    	        dialog.setLeft(100).setTop(100).setWidth(300).setHeight(200).setStatus('max').setMinBtn(false).setMaxBtn(false).setCaption('Formatted code');
                    	        dialog.create();
                    	        var t,nodes;
                    	        if(page.tempSelected && page.tempSelected.length){
                    	            nodes=[];
                    	            page.tempSelected.each(function(i){
                    	                nodes.push(linb.Profile.getFromCacheId(i));
                    	            });
                    	        }else
                    	            nodes = page.getWidgets();

                                var code;
                                switch(id){
                                    case 'format':
                                        code=linb.coder.parse(page.getJSCode(nodes),'js',['plain']);
                                        break;
                                    case 'json':
                                        code=linb.coder.format(page.getJSONCode(nodes),'js',['plain']);
                                        break;
                                }
                    	        dialog.html(code);
                    	        dialog.show(linb(document.body), true);
                    	    });
                    	break;
                    }
                    break;
                case 'align':
                    this._change();
                    var sel = linb.UI.getByCacheId(this.tempSelected);
                    var p = sel.get(this.SelectedFocus),
                        o=p.getSubNode(p.keys.KEY),
                        size=o.cssSize(),
                        pos=o.cssPos();
                    sel.each(function(o){
                        if(o.locked)return;
                        var node = o.getSubNode(o.keys.KEY);
                        switch(id){
                            case "left":node.left(pos.left);o.boxing().refreshLeft();break;
                            case "center":node.left(pos.left + size.width/2 - node.width()/2);o.boxing().refreshLeft();break;
                            case "right":node.left(pos.left + size.width - node.width());o.boxing().refreshLeft();break;
                            case "top":node.top(pos.top);o.boxing().refreshTop();break;
                            case "middle":node.top(pos.top + size.height/2 - node.height()/2);o.boxing().refreshTop();break;
                            case "bottom":node.top(pos.top + size.height - node.height());o.boxing().refreshTop();break;

                            case 'w':node.width(size.width);o.boxing().refreshWidth();break;
                            case 'wh':node.width(size.width).height(size.height);o.boxing().refreshWidth();o.boxing().refreshHeight();break;
                            case 'h':node.height(size.height);o.boxing().refreshHeight();break;
                        }
                    });
                    this.resizer.rePosSize();
                    this._focus();
                    break;
                case 'pos':
                    this._change();

                    var sel = linb.UI.getByCacheId(this.tempSelected);

                    var page=this;
                    if('clone'==id){
                        var ids=[];
                        var t,ids=[],pid;
                        //get source
                        var src = linb.UI.getByCacheId(this.tempSelected);
                        //clone and added to its' parent
                        var tar = src.clone();

                        src.get(0).parent.boxing().attach(tar);

                        pid=src.get(0).parent.$id;
                        //get ids
                        tar.each(function(o){
                            ids.push(o.$id);
                        });
                        //fire event
                        //_.tryF(this.afterAddWidget, [tar, pid], this);

                        //add multi layers
                        var fun = function(o){
                            var self=arguments.callee;
                            //give select handler
                            page._giveHandler(o);
                            //give panel function
                            if(linb.cache.$dropPool[o.box.KEY])
                                page._enablePanelDesign(o);
                            //give design mark
                            o.properties.$design=page.properties.$design;
                            if(o.children.length)
                                o.children.each(function(v){
                                    self(v[0]);
                                });
                        };

                        tar.each(function(o){
                            fun(o);
                        });

                        //set to resizer
                        this.resizer.resetTarget(linb(tar));

                        linb.message(linb.getStr('VisualJS.designer.colneOK', ids.length));
                        //set selected
                        //this._setSelected(null,true)._setSelected(ids, true);
                        return;
                    }
                    var zIndex=0;
                    sel.each(function(o){
                        var ins = o.boxing();
                        var node=ins.reBoxing();

                        switch(id){
                            case "zindex1":
                                if(o.locked)return;
                                if(!zIndex)
                                    zIndex = node.topZindex();
                                node.zIndex(zIndex+1);
                                ins.refreshZIndex();
                                break;
                            case "zindex2":
                                if(o.locked)return;
                                node.zIndex(0);
                                ins.refreshZIndex();
                                break;
                            case "repos":
                            case "resize":
                                if(o.locked)return;
                                var l=node.left(),
                                    t=node.top(),
                                    offset = page.dropOffset;

                                node.left(parseInt(l/offset)*offset)
                                .top(parseInt(t/offset)*offset);
                                if(id=='resize'){
                                    var w=node.width(),
                                        h=node.height();
                                    node.width((parseInt((w+offset-1)/offset))*offset)
                                    .height((parseInt((h+offset-1)/offset))*offset)
                                }
                                page.resizer.rePosSize();
                                ins.refreshLeft();
                                ins.refreshTop();
                                ins.refreshWidth();
                                ins.refreshHeight();
                                break;
                        }
                    });
                    this._focus();
                    break;
                case 'del':
                    this._change();
                    if('delete'==id)this._deleteSelected();

                break;
            }

        },

        $profilegrid_afterrowactive:function(profile, row){
             profile.box.editCellbyRowCol(profile, row.id, 'value');
             return false;
        },
        $profilegrid_beforevalueupdated: function(profile, cell, ov, nv){
             this._change();
             var page = this;
             try{
                //get properties
                var attr,t,type,funName,property,value,target=profile.$widget;
                value=nv;
                if((attr = cell._row.id.split(':')).length>1){
                    type=attr[0];
                    property=attr[1];
                }else{
                    property=cell._row.id;
                }
                //run
                switch(type){
                    case 'properties':
                        funName = 'set' + property.initial();
                        //for canvas
                        if(target.get(0) == this.canvas.get(0)){
                            this.canvas[funName](value);
                            this.panelBG[funName](value);
                        }else{
                            target.each(function(o){
                                o.boxing()[funName](value);
                            });
                            if(['left','top','width','height','right','bottom','dock','dockOrder'].exists(property))
                                this.resizer.rePosSize();
                        }
                        break;
                    case 'event':
                        if(target.get(0) == this.canvas.get(0)){
                            if(nv){
                                var em = _.get(page.properties.clsStruct,['sub','Instance', 'sub','events', 'code']);
                                if(em)em=_.unserialize(em);else em={};
                                em[property] = nv;
                                _.set(page.properties.clsStruct,['sub','Instance', 'sub','events', 'code'], _.serialize(em));
                                _.set(page.properties.clsStruct,['sub','Instance', 'sub','events', 'comments'],
                                    _.get(page.properties.clsStruct,['sub','Instance', 'sub','events', 'comments'] || '\n'+' '.repeat(8)));

                                _.set(page.properties.clsObject,['Instance','events', property], nv);
                            }

                        }/*else
                            target.each(function(o){
                                if(nv){
                                    o[property]=nv;
                                    //nv=... from clsStruct
                                    //_.set(page.properties.clsObject,['Instance','events', property], nv);
                                }
                            });*/
                        break;
                    default:
                        if(property=='behavior' || property=='template'){
                            page._giveHandler(profile);
                            if(linb.cache.$dropPool[profile.box.KEY])
                                page._enablePanelDesign(profile);

                        }else if(property=='alias'){
                            var hash = this.getNames();
                            if(hash[value]){
                                linb.message(linb.getStr('VisualJS.designer.nameExists',value));
                                return false;
                            }

                            this.listObject.setCtrlValue(value,true);
                        }
                        target[property](value);

                }
             }catch(e){
                throw(e);
                return false;
             }
        },
        $profilegrid_onrequestdata: function(profile, id, threadId){
            var cv,arr=[],t,page=this;
            var deeppage=this;
            var uis = profile.$widget, len=uis.length();

            //get the last one first
            var target = uis.get(len-1), dm=target.box.$DataModel, format, listKey, list, $tag,$fun,$tagVar, value;
            //for properties
            if(id=='properties'){
                _.each(target.box.$DataStruct,function(o,i){
                     if(['_','$'].exists(i.charAt(0))) return;
                    if(dm[i].hidden) return;

                    list=null;

                     $tag='';
                     cv='';
                    //filter
                    if(dm[i].readonly){
                        listKey='';
                        type='label';
                    }else if(dm[i].listbox){
                        type='listbox';
                        list=[];
                        listKey = target.key+":"+"properties"+":"+i;
                        if(_.isFun(dm[i].listbox)){
                            var d = dm[i].listbox;
                            list = function(){
                                var a = d.call(target),list=[];
                                a.each(function(o){
                                    list.push({id:o, caption:o, value:o})
                                });
                                return list;
                            };
                        }else if(_.isObj(dm[i].listbox[0]))
                            list = dm[i].listbox.copy();
                        else
                            dm[i].listbox.each(function(o,i){
                                list.push({id:o, caption:o})
                            });
                        linb.UI.setCacheList(listKey, list);
                    }else if(dm[i].combobox){
                        type='combobox';
                        list=[];
                        if(_.isFun(dm[i].combobox)){
                            var d = dm[i].combobox;
                            list = function(){
                                var a = d.call(target),list=[];
                                a.each(function(o){
                                    list.push({id:o, caption:o})
                                });
                                return list;
                            };
                        }else{
                            if(_.isObj(dm[i].combobox[0]))
                                list= dm[i].combobox.copy();
                            else
                                dm[i].listbox.each(function(o,i){
                                    list.push({id:o, caption:o})
                                });
                        }
                        listKey = target.key+":"+"properties"+":"+i;
                        linb.UI.setCacheList(listKey, list);
                    }else if(dm[i].helpinput){
                        listKey = target.key+":"+"properties"+":"+i;
                        type='helpinput';
                        list= dm[i].helpinput.copy();
                        linb.UI.setCacheList(listKey, list);
                    }else if(dm[i].trigger){
                        listKey='';
                        type='getter';
                        value=i;
                        $fun = function(profile, cell, pro){
                            var o = cell.$tagVar;
                            var f = o.profile.boxing()['trigger'+o.name.initial()];
                            _.tryF(f,null,o.profile.boxing());

                            var v='try again';
                            pro.boxing().updateUIValue(v);
                            profile.box.changeCellValue(profile, cell,v,true);
                        };
                        $tagVar = {
                            profile: target,
                             name:i
                        };
                    }else if(_.isBool(o)){
                        listKey='';
                        type='checkbox';
                        $tag = i;
                    }else if(_.isObj(o)){
                        listKey='';
                        type='popbox:readonly';
                        //keep object
                        $tag = null;

                        //for object edit
                        $fun = function(profile, cell){
                            var o = cell.$tagVar;
                            var node = profile.getSubNode(profile.keys.CELL, cell._serialId);
                            var obj =o.profile.boxing()['get'+o.name.initial()]();
                            _.asyCall('VisualJS.ObjectEditor' ,'show', [linb(document.body),'',{
                                    caption:o.widgetName+" => "+o.name,
                                    icon:'img/App.gif',
                                    iconPos:obj.constructor==Array?'-128px -32px':'-16px -32px',
                                    text:linb.coder.decode(
                                        _.serialize(
                                            linb.UI.pickObj( obj )
                                        )
                                    ),
                                    fromRegion:node.getRegion(true),
                                    tagVar:o
                                },{
                                    onOK:function(page){
                                        this._change();
                                        var t,tagVar = page.properties.tagVar;
                                        tagVar.profile.boxing()['set'+o.name.initial()](page.properties.object);

                                        if(['dockMargin'].exists(o.name))
                                            deeppage.resizer.rePosSize();

                                        node.focus();

                                        //for new panel
                                        //not consider that multi keys in a widget can have different drop function
                                        if(o.name=='items'){
                                            if(null===page.properties.object)
                                                tagVar.profile.boxing().setItems([]);

                                            if(t=linb.cache.$dropPool[tagVar.profile.box.KEY]){
                                                //t.each(function(i){
                                                    var i=t[0];
                                                    deeppage._enablePanelDesignFace(tagVar.profile, i);
                                                //});
                                             }
                                        }

                                    }
                                },page/*, use asyCall threadid*/
                                ], true, null, function(){});
                        };
                        $tagVar = {
                             widgetName:target.alias,
                             profile: target,
                             name:i
                        };
                        cv='(Collection)';
                    }else{
                        listKey='';
                        type='';
                    }
                    cv = cv || target.properties[i];
                    if(_.isStr(cv)){
                        //cv=_.serialize(cv);
                        //for serialized string
                        //cv = cv.replace(/^\"/,'').replace(/\"$/,'');
                    }

                    arr.push({id:'properties:'+i, cells:[
                        {value:i,  type:''     , $tag:'' , event:''   , $tagVar:''      ,  listKey:''},
                        {value:cv, type:type , $tag:$tag,event:$fun , $tagVar:$tagVar,  listKey:listKey}
                    ]});
                });
            }
            arr.sort(function(x,y){
                x=x.cells[0].value;y=y.cells[0].value;
                return x>y?1:x==y?0:-1;
            });
            //for events
            if(id=='UIE'){
                var getCode=function(o){
                    var code;
                    //get from profile:o.profile[o.funName]
                    var funName = typeof o.profile[o.funName] == 'string'? o.profile[o.funName] : ('_'+o.widgetName.toLowerCase()+'_'+o.funName.toLowerCase());
                    var item = _.get(o.clsStruct, ['sub','Instance', 'sub', funName]);
                    var comments = (item? (item.comments || '') :'');
                    if(comments)comments = comments.replace(/^[\r\n]*/, '');

                    //if em exists
                    if(item&&item.code){
                        code = item&&item.code;
                        o.mapName=funName;
                    //if em doesn't exist
                    }else{
                        code = ' '.repeat(8) + o.ini.toString().replace(/\n/g,'\n'+' '.repeat(8));

                        //new em
                        o.mapName = '_'+o.widgetName.toLowerCase()+'_'+o.funName.toLowerCase();
                        //avoid name conflict
                        var pool = _.get(o.clsStruct, ['sub','Instance', 'sub']);
                        if(pool[o.mapName]){
                            var i=1,t;
                            while(pool[t=o.mapName+'_'+(++i)]){}
                            o.mapName=t;
                        }
                    }

                    return comments+code;
                };
                //for object edit
                $fun = function(profile, cell){
                    var o = cell.$tagVar;
                    var node = profile.getSubNode(profile.keys.CELL, cell._serialId);
                    _.asyCall('VisualJS.ObjectEditor' ,'show', [linb(document.body),'',{
                            icon:'img/App.gif',
                            iconPos:'-32px -32px',
                            caption:o.widgetName+" => "+o.funName,
                            text: getCode(o),
                            fromRegion:node.getRegion(true),
                            tagVar:o
                        },{
                            onOK:function(page){
                                this._change();
                                var tagVar = page.properties.tagVar;
                                if(page.properties.result.code!==null){
                                    _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'code'], page.properties.result.code);
                                    _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'comments'], page.properties.result.comments);

                                    tagVar.profile[tagVar.funName] = tagVar.mapName;
                                    profile.box.changeCellValue(profile, cell,tagVar.mapName,true);
                                }else{
                                    _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'code'], null);
                                    _.set(tagVar.clsStruct, ['sub','Instance', 'sub', tagVar.mapName, 'comments'], null);

                                    tagVar.profile[tagVar.funName] = tagVar.profile.box.$EventHandlers[tagVar.funName];
                                    profile.box.changeCellValue(profile, cell, '',true);
                                }
                                node.focus();
                            }
                        },page/*, use asyCall threadid*/
                        ], true, null, function(){});
                };

                _.each(target.box.$EventHandlers,function(o,i){
                    $tagVar = {
                         profile: target,
                         clsStruct: page.properties.clsStruct,
                         widgetName: target.alias,
                         funName: i,
                         ini:o
                    };
                    arr.push({id:'event:'+i, cells:[
                        {value:i, type:null, $tagVar:null},
                        {value:typeof target[i]=='string'?target[i]:'', type: 'popbox', $tagVar:$tagVar, event:$fun}
                    ]});
                });
            }
            //check others to disable editable
            uis.each(function(tt,i){
                if(i===(len-1))return;
                if(id=='properties'){
                    var cache=[],cache2=0;
                    arr.each(function(o,i){
                        if(cache2 == arr.length)return false;
                        if(!cache[i] && tt.properties[o.cells[0].value] !== target.properties[o.cells[0].value] ){
                            o.cells[1].type='label';
                            cache[i]=1;
                            cache2++;
                        }
                    });
                }
                //multi event disabled
                if(id=='UIE')
                    arr.length=0;
            });
            linb.thread(threadId).setCache('response',arr);
        },
        $gallery_aftervalueupdated:function(profile, ov, nv){
            if(nv){
                this.resizer.resetTarget(null,false);
                this._setSelected([nv],true);
            }
        },
        $listobject_onlistshow:function(profile, pos){
            var page=this;
//            linb.dom.UIAction(function(){
                if(!page.objlistBlock){
                    page.objlistBlock=new linb.UI.Block({
                        width:200,
                        height:200,
                        shadow:true
                    });
                    page.frame=linb.create('<div style="z-index:2000;background-color:red;position:absolute;font-size:0;line-height:0;display:none;">').opacity(0.3);
                    linb(document.body).addLast(page.frame);

                    page.treebarObj = new linb.UI.TreeBar({
                        group:false,
                        selMode:'none',
                        caption:null
                    },{
                        onItemSelected:function(profile, item, src){
                            page.selectWidget(item.id);
                            profile.parent.root.display('none');

                            page.frame.display('none');
                            profile.boxing().clearItems();

                            _.asyRun(function(){page._focus()});
                        },
                        beforeHoverEffect:function(profile, item, src, type){
                            if(!item)return;
                            if(item.id==this.canvas.get(0).$id)return;
                            if(type=='mouseover')
                                //for performance in IE
                                _.resetRun('',function(){
                                    var v=linb._object[item.id];
                                    if(v && (v=v.root))
                                        page.frame.setRegion(v.getRegion(true)).display('block');
                                },100);
                            else
                                _.resetRun('',function(){
                                    page.frame.display('none');
                                },100);
                        }
                    },page);
                    page.objlistBlock.attach(page.treebarObj).create();
                }
                //get items
                var items=[];
                var fun = function(profile, items, map){
                    var self=arguments.callee;
                    var item = {id:profile.$id, caption:profile.alias, icon: map[profile.box.KEY].icon, iconPos:map[profile.box.KEY].iconPos};
                    items.push(item);
                    if(profile.children && profile.children.length){
                        var sub=[];
                        item.sub = sub;
                        profile.children.each(function(o){
                            self.call(null, o[0], sub, map);
                        });
                    }
                };
                fun(page.canvas.get(0), items, page.mapWidgets);
                page.treebarObj.setItems(items).openNode(page.canvas.get(0).$id);
                var node = page.objlistBlock.reBoxing();
                node.popToTop(profile.root);
                var unFun=function(){
                    node.display('none');
                    page.treebarObj.clearItems();
                    page.frame.display('none');
                    //unhook
                    linb.event.hookKey('esc',0,0,0,null);
                };
                //for on blur disappear
                node.setBlurTrigger('design:pop:objecttree', unFun);
                //for esc
                linb.event.hookKey('esc',0,0,0,unFun);

//            });
        },

//for outter call
        getWidgets:function(flag){
            if(!flag)
                this._clearSelect(this.canvas.get(0));
            var arr=[], c = this.canvas.get(0).children;
            c.each(function(o){
                arr.push(o[0]);
            });

            var items = this.gallery.getItems();
            if(items && items.length)
                items.each(function(o,i){
                    arr.push(linb.Profile.getFromCacheId(o.id));
                });
            arr.clean();

            return arr;
        },
        getJSONCode:function(nodes){
            //sort by tabindex
            nodes.sort(function(x,y){
                x=parseInt(x.properties.tabindex)||0;y=parseInt(y.properties.tabindex)||0;
                return x>y?1:x==y?0:-1;
            });

            return 'return this.nodes = linb.create(' + _.serialize(nodes) + ').get();'
        },
        getJSCode:function(nodes){
            //sort by tabindex
            nodes.sort(function(x,y){
                x=parseInt(x.properties.tabindex)||0;y=parseInt(y.properties.tabindex)||0;
                return x>y?1:x==y?0:-1;
            });

            var page = this,t,arr=[];
            arr.push('// [[code creted by designer, don\'t change it manually\n');
            arr.push('this.nodes = [];');
            fun = function(v, pName, argsStr, arr){
                var self=arguments.callee, ui=v.box['linb.UI'], o = v.beforeSerialized(),name=o.alias, b;

                delete o.id;

                if(o.properties && o.properties.dropKeys){
                    o.properties.dropKeys = o.properties.dropKeys.replace(/\biDesign\b/,'').replace(/[^\w]+/g,':').replace(/^[^\w]+/,'').replace(/[^\w]+$/,'');
                    if(o.properties.dropKeys == v.box.$DataStruct.dropKeys)
                        delete o.properties.dropKeys;
                }

                if(_.isEmpty(o.properties))delete o.properties;
                if(_.isEmpty(o.events))delete o.events;
                if(_.isEmpty(o.CA))delete o.CA;
                if(_.isEmpty(o.CB))delete o.CB;

                arr.push('\n\n');
                arr.push('this.' + name + ' = (new ' + o.key + ')\n');
                arr.push('.alias("' + name + '")', '.host(this)');
                if(o.template)
                    arr.push('.template("' + o.template + '")');
                if(o.behavior)
                    arr.push('.behavior("' + o.behavior + '")');
                if(o.appearance)
                    arr.push('.appearance("' + o.appearance + '")');
                if(o.properties){
                    arr.push('\n');
                    _.each(o.properties,function(o,i){
                        if(b)arr.push('\n');
                        b=false;
                        //serialize is very important
                        arr.push('.set' + i.initial() + '(' + _.serialize(o) +')');
                        if(!!o && typeof o=='object')
                            b=true;
                    });
                }

                if(o.events){
                    arr.push('\n');
                    _.each(o.events,function(o,i){
                        arr.push('.' + i + '('+ _.serialize(o) +')');
                    });
                }
                if(o.CA){
                    arr.push('\n');
                    arr.push('.setCustomAppearance('+ _.serialize(o.CA) +')');
                }
                if(o.CB){
                    arr.push('\n');
                    arr.push('.setCustomBehavior('+ _.serialize(o.CB) +')');
                }
                arr.push(';\n');

                if(pName)
                    arr.push(pName+'.attach(this.'+name+ (argsStr?(', '+argsStr):'')+');');
                else
                    arr.push('this.nodes.push(this.'+name+'.get(0));');


                if(v.children && v.children.length){
                    v.children.each(function(o){
                        var j = o[0],sa=[],s;
                        for(var i=1;i<o.length;i++){
                            switch(typeof o[i]){
                                case 'number':
                                    sa.push(o[i]);
                                    break;
                                case 'string':
                                    sa.push("'"+o[i]+"'");
                                    break;
                            }
                        }
                        if(sa.length)
                            s = sa.join(',');
                        else
                            s = null;
                        self.call(this, j, 'this.'+name, s,  arr);
                    },this);
                }
            };
            nodes.each(function(v){
                fun(v, null, null, arr);
            });
            arr.push('\n\n');
            arr.push('return this.nodes;\n');
            arr.push('// ]]code creted by designer');
            return arr.join('');
        },
        getClassList:function(nodes){
            var page = this,t,hash={};
            var fun = function(target){
                var self=arguments.callee;
                hash[target.box.KEY]=1;
                if(target.children && target.children.length){
                    target.children.each(function(o){
                        self.call(null, o[0]);
                    });
                }
            };
            nodes.each(function(o){
                fun(o);
            });
            return _.toArr(hash,true);
        },
        getNames:function(){
            var nodes = this.getWidgets(true);
            var page = this,t,hash={};
            var fun = function(target){
                var self=arguments.callee;
                hash[target.alias]=1;
                if(target.children && target.children.length){
                    target.children.each(function(o){
                        self.call(null, o[0]);
                    });
                }
            };
            nodes.each(function(o){
                fun(o);
            });
            return hash;
        },
        selectWidget:function(id){
            var profile = linb.UIProfile.getFromCacheId(id);
            var p = profile.parent;
            if(p.setSelectFromPanel){
                p.setSelectFromPanel.call(p, profile.root.parent(), id);
                this._setSelected([id],true);
            }else{
                this._clearSelect();
                this._setSelected(null,true);
            }
        },
        activate:function(){
        },
        resetEnv:function(text){
            this._dirty=false;
            this.properties.text = text||this.getText();

            this._clearSelect();
            //reset
            this._setSelected([], true);
        },
        setText:function(txt, flag, threadid){
            txt=txt.replace(/\r\n/g,'\n');
            if(flag || this.properties.text != txt){
                this.properties.text = txt;

                var clsStruct = this.properties.clsStruct;
                var clsObject = this.properties.clsObject;

                var comCode = _.get(clsStruct,['sub','Instance','sub','iniComponents','code']);
                if(comCode == this.properties.comCode)return this;

                var page = this;
//linb.log('rebuild ui')

                linb.thread.asyUI(threadid,[
                    function(){
                        linb.dom.setCover(linb.getStr('VisualJS.designer.emptyContent'));
                    },
                    function(){
                        page.canvas.reBoxing().empty().gc();
                        linb.dom.setCover(linb.getStr('VisualJS.designer.prepare'));
                    },
                    function(threadid){
                        linb.thread.suspend(threadid);
                        //load required class and build Coms
                        linb.SC.group(clsObject.Instance.required,function(key){
                            linb.dom.setCover(linb.getStr('VisualJS.designer.loading')+' ' + key+'...');
                        },function(){
                            linb.dom.setCover(linb.getStr('VisualJS.designer.createContent'));
                            linb.thread.resume(threadid);
                        });
                    },
                    function(){
                        try{
                            //var nodes = clsObject.Instance.iniComponents();
                            //avoid call event in desinger
                            var nodes = clsObject.Instance.iniComponents.call(null);
                            var fun = function(target){
                                var self=arguments.callee;
                                //change
                                page._giveHandler(target);
                                //give design mark
                                target.properties.$design=page.properties.$design;
                                if(linb.cache.$dropPool[target.box.KEY])
                                    page._enablePanelDesign(target);
                                 if(target.children && target.children.length){
                                    target.children.each(function(o){
                                        self(o[0]);
                                    });
                                 }
                            };
                            page.gallery.clearItems();

                            var n2 = [];
                            nodes.filter(function(target){
                                if(!target.box['linb.UI']){
                                    n2.push(target);
                                    return false;
                                }
                            });
                            page.canvas.attach(linb.UI.pack(nodes, false));
                            nodes.each(function(target){
                                fun(target);
                            });
                            n2.each(function(target){
                                //give design mark
                                target.properties.$design=page.properties.$design;
                                page.gallery.insertItems([{id:target.$id, icon:'img/widgets.gif', iconPos:page.mapWidgets[target.box.KEY].iconPos}]);
                            });

                            if(page.layoutBase.reBoxing().display()=='none'){
                                page.layoutBase.reBoxing().display('block');
                                page.layoutBase.reBoxing().parent().background('');
                            }

                        }catch(e){
                            page.gallery.clearItems();
                            page.canvas.reBoxing().empty().gc();
                            //page.properties.text = '';
                            page.layoutBase.reBoxing().display('none');
                            page.layoutBase.reBoxing().parent().background('url(img/error.gif)');

                            linb.message(linb.getStr('VisualJS.designer.comCodeErr'));
                            linb.message(_.Error(e));
                        }
                    }
                ]);
            }
            //reset
            this.resetEnv(txt);
            return this;
        },
        getText:function(){
            if(this._dirty){
                var nodes = this.getWidgets(), ins = this.properties.clsStruct.sub.Instance;
                //get iniComponents code
                if(!nodes.length){
                    if(_.get(ins,['sub','iniComponents', 'comments']))
                        _.set(ins,['sub','iniComponents','comments'],null);
                }else{
                    if(!_.get(ins,['sub','iniComponents', 'comments']))
                        _.set(ins,['sub','iniComponents','comments'],'\n'+' '.repeat(8));
                    ins.sub.iniComponents.code =
                        ('function(){\n' +
                        this.getJSCode(nodes)
                        ).replace(/\n/g, '\n'+' '.repeat(12))+
                        '\n'+' '.repeat(8)+ '}';
                }

                //get required class list
                var arr = this.properties.clsObject.Instance.required || [];
                arr.merge(this.getClassList(nodes));
                _.set(ins,['sub','required','code'],_.serialize(arr));
                if(!_.get(ins,['sub','required','comments']))
                    _.set(ins,['sub','required','comments'],'\n'+' '.repeat(8));

                //get all code
                return VisualJS.ClassTool.getCodeFromStruct(this.properties.clsStruct);
            }
            //todo: get text from struct
            return this.properties.text;
        },


        iniComponents:function(){
            // [[designer
            this.nodes = [];

            //
            // layoutBase
            //
            //new linb.UI.Layout
            this.layoutBase = new linb.UI.Layout();
            //set name to layoutBase
            this.layoutBase.alias("layoutBase").host(this);
            //set properties
            this.layoutBase.setLeft(0).setTop(0).setItems([
            {
                "id" : "after",
                "pos" : "after",
                "locked" : false,
                "cmd" : false,
                "size" : 270,
                "min" : 100,
                "max" : 300
            }])
            .setType("horizontal");
            //
            //add layoutBase to parent node
            this.nodes.push(this.layoutBase.get(0));
            //
            // layoutLeft
            //
            //new linb.UI.Layout
            this.layoutLeft = new linb.UI.Layout();
            //set name to layoutLeft
            this.layoutLeft.alias("layoutLeft").host(this);
            //set properties
            this.layoutLeft.setLeft(0).setTop(0).setItems([
            {
                "id" : "after",
                "pos" : "after",
                "locked" : false,
                "size" : 300,
                "min" : 100,
                "max" : 500,
                "cmd" : true
            }]);
            //
            //add layoutLeft to parent node
            this.layoutBase.attach(this.layoutLeft, 'after');
            //
            // listObject
            //
            //new linb.UI.ComboInput
            this.listObject = new linb.UI.ComboInput();
            //set name to listObject
            this.listObject.alias("listObject").host(this);
            //set properties
            this.listObject.setDock("top").onCustomPop(this.$listobject_onlistshow).setType('popbox').setReadonly(true);
            //
            //add listObject to parent node
            this.layoutLeft.attach(this.listObject, 'after');

//TODO:
//.setCaption('$VisualJS.designer.weditor').setIcon('img/App.gif').setIconPos('-224px -64px')
            //
            // profileGrid
            //
            this.profileGrid = new linb.UI.TreeGrid;
            this.profileGrid.alias("profileGrid").host(this);
            this.profileGrid.setHeader([
                    {id:'name', caption:'$VisualJS.designer.gridcol1', width:80, type:'label'},
                    {id:'value', caption:'$VisualJS.designer.gridcol2', width:130, type:'input' }
            ]).setRows([]).setRowHandlerWidth(30).setAltRowsBg(false).setRowDragable(false).setColSortable(false)
            .afterRowActive(this.$profilegrid_afterrowactive)
            .beforeValueUpdated(this.$profilegrid_beforevalueupdated)
            .onRequestData(this.$profilegrid_onrequestdata)
            ;
            //
            //add profileGrid to parent node
            this.layoutLeft.attach(this.profileGrid, 'after');
//TODO:
//.setCaption('$VisualJS.designer.wlist').setIcon('img/App.gif').setIconPos('-48px -48px')
            //
            // treebarCom
            //
            //new linb.UI.TreeBar
            this.treebarCom = new linb.UI.TreeBar();
            //set name to treebarCom
            this.treebarCom.alias("treebarCom").host(this);
            //set properties
            this.treebarCom.setLeft(0).setTop(0).setItems(this.clsItems)
            .setGroup(true).setSelMode('none').setDragKey('iDesign');

            //
            //add treebarCom to parent node
            this.layoutLeft.attach(this.treebarCom, 'main');

            // toolbar
            //
            //new linb.UI.ToolBar
            this.toolbar = new linb.UI.ToolBar();
            //set name to toolbar
            this.toolbar.alias("toolbar").host(this);
            //set properties
            this.toolbar.host(this).setItems([ {
            id:'code',
            sub:[
            {
                "id" : "format",
                "icon" : "img/App.gif",
                "iconPos":"-32px -48px",
                "type" : "button",
                "tips" : '$VisualJS.designer.tool.tocode'
            },{
                "id" : "json",
                "icon" : "img/App.gif",
                "iconPos":"-128px -64px",
                "type" : "button",
                "tips" : '$VisualJS.designer.tool.tojson'
            }]},
            {id:'align',
            sub:[
                {id:'left',caption:'',icon:'img/designer/toolbar.gif',iconPos:'0 top', tips:'$VisualJS.designer.tool.left'},
                {id:'center',caption:'',icon:'img/designer/toolbar.gif',iconPos:'-16px top',tips:'$VisualJS.designer.tool.center'},
                {id:'right',caption:'',icon:'img/designer/toolbar.gif',iconPos:'-32px top',tips:'$VisualJS.designer.tool.right'},
                {id:'s1',type:'split'},
                {id:'top',caption:'',icon:'img/designer/toolbar.gif',iconPos:'-48px top',tips:'$VisualJS.designer.tool.top'},
                {id:'middle',caption:'',icon:'img/designer/toolbar.gif',iconPos:'-64px top',tips:'$VisualJS.designer.tool.middle'},
                {id:'bottom',caption:'',icon:'img/designer/toolbar.gif',iconPos:'-80px top',tips:'$VisualJS.designer.tool.bottom'},
                {id:'s2',type:'split'},
                {id:'w',caption:'',icon:'img/designer/toolbar.gif',iconPos:'-96px top',tips:'$VisualJS.designer.tool.width'},
                {id:'wh',caption:'',icon:'img/designer/toolbar.gif',iconPos:'-112px top',tips:'$VisualJS.designer.tool.wh'},
                {id:'h',caption:'',icon:'img/designer/toolbar.gif',iconPos:'-128px top',tips:'$VisualJS.designer.tool.height'}
            ]},
            {id:'pos',
            sub:[
                {id:'zindex1',caption:'',icon:'img/designer/toolbar.gif',iconPos:'-144px top',tips:'$VisualJS.designer.tool.toplayer'},
                {id:'zindex2',caption:'',icon:'img/designer/toolbar.gif',iconPos:'-160px top',tips:'$VisualJS.designer.tool.bottomlayer'},
                {id:'s1',type:'split'},
                {id:'repos',caption:'',icon:'img/designer/toolbar.gif',iconPos:'-176px top',tips:'$VisualJS.designer.tool.gridxy'},
                {id:'resize',caption:'',icon:'img/designer/toolbar.gif',iconPos:'-192px top',tips:'$VisualJS.designer.tool.gridwh'},
                {id:'s2',type:'split'},
                {id:'clone',caption:'',icon:'img/designer/toolbar.gif',iconPos:'-240px top',tips:'$VisualJS.designer.tool.clone'}
            ]},
            {id:'del',
            sub:[
                {id:'delete',caption:'',icon:'img/designer/toolbar.gif',iconPos:'-256px top', tips:'$VisualJS.designer.tool.delete'}
            ]}
            ]).onClick(this.$toolbar_onclick);
            //
            this.layoutBase.attach(this.toolbar);

            //
            // gallery
            //
            //new linb.UI.Gallery
            this.gallery = new linb.UI.Gallery();
            // set name
            this.gallery.alias('gallery').host(this);
            this.gallery.setDock('bottom').setHeight(25).setItemWidth(18).setItemHeight(18).setItemPadding(1).setZIndex(10).setItems([])
            .afterValueUpdated(this.$gallery_aftervalueupdated);
            //
            //add layoutLeft to parent node
            this.layoutBase.attach(this.gallery);

            //
            // panelDiv
            //
            //new linb.UI.Div
            this.panelDiv = new linb.UI.Div();
            // set name to panelDiv
            this.panelDiv.alias('panelDiv').host(this);
            this.panelDiv.setDock('fill')
            .setCustomAppearance({KEY:'overflow:auto;'})
            .afterCreated(function(pro){
                pro.root.addClass('linbdesign');
            });
            //
            //add layoutLeft to parent node
            this.layoutBase.attach(this.panelDiv);


            this.panelBG = new linb.UI.Div();
            this.panelBG.alias('panelBG').host(this);
            this.panelBG.setWidth(this.panelWidth).setHeight(this.panelHeight).setTop(5).setLeft(5).setZIndex(1)
            .setCustomAppearance({KEY:'background-color:#FFFEF6;'})
            this.panelDiv.attach(this.panelBG);

            this.panelBGt = new linb.UI.Div();
            this.panelBGt.alias('panelBGt').host(this);
            this.panelBGt
            .setCustomAppearance({KEY:'font-size:0;line-height:0;position:absolute;left:0;top:0;height:10px;width:100%;background:url(img/designer/top.gif) left top'})
            this.panelBG.attach(this.panelBGt);
            this.panelBGb = new linb.UI.Div();
            this.panelBGb.alias('panelBGb').host(this);
            this.panelBGb
            .setCustomAppearance({KEY:'font-size:0;line-height:0;position:absolute;left:0;bottom:0;height:10px;width:100%;background:url(img/designer/top.gif) left bottom'})
            this.panelBG.attach(this.panelBGb);
            this.panelBGl = new linb.UI.Div();
            this.panelBGl.alias('panelBGl').host(this);
            this.panelBGl
            .setCustomAppearance({KEY:'font-size:0;line-height:0;position:absolute;left:0;top:0;width:10px;height:100%;background:url(img/designer/left.gif) left top'})
            this.panelBG.attach(this.panelBGl);
            this.panelBGr = new linb.UI.Div();
            this.panelBGr.alias('panelBGr').host(this);
            this.panelBGr
            .setCustomAppearance({KEY:'font-size:0;line-height:0;position:absolute;right:0;top:0;width:10px;height:100%;background:url(img/designer/left.gif) top right'})
            this.panelBG.attach(this.panelBGr);

            this.canvas = new linb.UI.Panel();
            this.canvas.alias('canvas').host(this);
            this.canvas.setWidth(this.panelWidth).setHeight(this.panelHeight).setTop(5).setLeft(5).setZIndex(10)
            .setCustomAppearance({KEY:'overflow:hidden'});
            this.panelDiv.attach(this.canvas);

            return this.nodes;
            // ]]designer
        }
    },
    destroy:function(){
        this.objlistBlock.destroy();
        arguments.callee.upper.apply(this,arguments);
    },
    Initialize:function(){
        linb.dom.addHeadNode('style', linb.UI.buildCSSText({
            '.linbdesign .panel':{
                'background-image' : 'url(img/designer/bg.gif)',
                'background-position' : 'left top'
            }
        }),'linb.UI.design');
    }
});

Class('VisualJS.AddFile', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the VisualJS
        required:["linb.UI.Dialog","linb.UI.TreeBar","linb.UI.PanelBar","linb.UI.Label","linb.UI.Input","linb.UI.Button","linb.UI.ComboInput"],

        customAttach:function(){
            var prop = this.properties;
            if(prop.fromRegion)
                this.dialog.setFromRegion(prop.fromRegion);
            this.dialog.setCaption(prop.caption).setIcon(prop.icon).setIconPos(prop.iconPos);

            if(!this.dialog.get(0).root)
                this.dialog.create();

            this.treebar.resetValue();
            this.input.resetValue();
            this.inputTarget.resetValue();
            this.comboinput.setValue('.js',true);

            //asy
            this.dialog.show(this.parent, true);

            var  arr = linb.UI.pickObj(prop.items||[]),f=function(o){
                var self=arguments.callee;
                o.filter(function(o,i){
                    var k=o.sub;
                    if(k)
                       self(o.sub);
                    if(k && !k.length)
                        delete o.sub;
                    return !!k;
                });
            };
            f(arr);
            this.treebar.clearItems().insertItems(arr);
        },
        _dialog_beforeclose:function(profile){
            this.dialog.hide();
            return false;
        },
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.dialog = (new linb.UI.Dialog)
            .alias("dialog").host(this)
            .onHotKeydown("_dialog_onhotkey")
            .setLeft(240).setTop(80).setWidth(430).setHeight(270).setResizable(false).setMinBtn(false).setMaxBtn(false).setPinBtn(false)
            .beforeClose("_dialog_beforeclose")
            ;
            this.nodes.push(this.dialog.get(0));

            this.btnCancel = (new linb.UI.Button)
            .alias("btnCancel").host(this)
            .setLeft(80).setTop(210).setWidth(90).setCaption("$VisualJS.cancel").setIcon("img/App.gif").setIconPos("-16px -16px")
            .onClick("_btncancel_onclick")
            ;
            this.dialog.attach(this.btnCancel);

            this.panelbar2 = (new linb.UI.PanelBar)
            .alias("panelbar2").host(this)
            .setDock("top").setHeight(140).setZIndex(1).setCaption("$VisualJS.addfile.sel").setCloseBtn(false).setLandBtn(false)
            ;
            this.dialog.attach(this.panelbar2);

            this.treebar = (new linb.UI.TreeBar)
            .alias("treebar").host(this)
            .setLeft(0).setTop(0).setItems([])
            .setIniFold(false)
            .onItemSelected("_treebar_onitemselected")
            ;
            this.panelbar2.attach(this.treebar);

            this.label4 = (new linb.UI.Label)
            .alias("label4").host(this)
            .setLeft(10).setTop(180).setWidth(70).setCaption("$VisualJS.addfile.target")
            ;
            this.dialog.attach(this.label4);

            this.label3 = (new linb.UI.Label)
            .alias("label3").host(this)
            .setLeft(230).setTop(150).setWidth(70).setCaption("$VisualJS.addfile.filetype")
            ;
            this.dialog.attach(this.label3);

            this.label1 = (new linb.UI.Label)
            .alias("label1").host(this)
            .setLeft(10).setTop(150).setWidth(70).setCaption("$VisualJS.addfile.filename")
            ;
            this.dialog.attach(this.label1);

            this.input = (new linb.UI.Input)
            .alias("input").host(this)
            .setLeft(80).setTop(150).setWidth(140).setValueFormat("^[\\w_]{2,9}$").setValidTips('$VisualJS.addfile.filenameformat')
            .afterValueUpdated("_input_aftervalueupdated")
            ;
            this.dialog.attach(this.input);

            this.comboinput = (new linb.UI.ComboInput)
            .alias("comboinput").host(this)
            .setValue(".js").setLeft(300).setTop(150).setWidth(110).setReadonly(true).setType("listbox").setItems([{"id":"/","caption":"$VisualJS.addfile.iDir"},{"id":".html","caption":"$VisualJS.addfile.iHtml"},{"id":".js","caption":"$VisualJS.addfile.iJs"},{"id":".php","caption":"$VisualJS.addfile.iPhp"}])

            .afterValueUpdated("_comboinput_aftervalueupdated")
            ;
            this.dialog.attach(this.comboinput);


            this.btnOK = (new linb.UI.Button)
            .alias("btnOK").host(this)
            .setLeft(250).setTop(210).setWidth(90).setCaption("$VisualJS.ok").setIcon("img/App.gif").setIconPos("-64px -16px")
            .onClick("_btnok_onclick")
            ;
            this.dialog.attach(this.btnOK);

            this.inputTarget = (new linb.UI.Input)
            .alias("inputTarget").host(this)
            .setLeft(80).setTop(180).setWidth(330).setReadonly(true)
            ;
            this.dialog.attach(this.inputTarget);
            return this.nodes;
            // ]]code creted by designer
        },
        _btncancel_onclick:function (profile, e, value) {
            this.dialog.close();
        },
        _result:function(){
            var s1=this.treebar.getUIValue(),
            s2=this.input.getUIValue(),
            s3=this.comboinput.getUIValue();
            if(s1&&s2&&s3)
                this.inputTarget.setValue(s1+'/'+s2+s3, true);
        },
        _comboinput_aftervalueupdated:function (profile, oldValue, newValue, showValue) {
            this._result();
        },
        _input_aftervalueupdated:function (profile, oldValue, newValue, showValue) {
            this._result();
        },
        _treebar_onitemselected:function (profile, item, src) {
            this._result();
        },
        _btnok_onclick:function (profile, e, value) {
            var s = this.inputTarget.getValue();
            if(!s){
                linb.message(linb.getStr('VisualJS.addfile.notarget'));
            }else{
                _.tryF(this.events.onOK, [this.treebar.getUIValue(), this.treebar.getUIValue(), this.input.getUIValue(), this.comboinput.getUIValue()], this.host);
                this.dialog.close();
            }
        },
        _dialog_onhotkey:function(profile, key, control, shift, alt){
            if(key=='esc')
                profile.boxing().close();
        }
    }
});

 Class('VisualJS.DelFile', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the VisualJS
        required:["linb.UI.Dialog","linb.UI.TreeBar","linb.UI.PanelBar","linb.UI.Button"],
        //show widgets to parent node
        parepareData:function(properties,events){
            properties.items = properties.items||[];
        },
        customAttach:function(){
            var prop = this.properties;
            if(prop.fromRegion)
                this.dialog.setFromRegion(prop.fromRegion);
            this.dialog.setCaption(prop.caption).setIcon(prop.icon).setIconPos(prop.iconPos);

            if(!this.dialog.get(0).root)
                this.dialog.create();

            this.treebar.resetValue();

            //asy
            this.dialog.show(this.parent, true);

            var  arr = linb.UI.pickObj(prop.items),f=function(o){
                var self=arguments.callee;
                o.filter(function(o,i){
                    delete o.group;
                    if(o.sub && o.sub.length)
                       self(o.sub);
                });
            };
            f(arr);
            this.treebar.clearItems().insertItems(arr);
        },
        _dialog_beforeclose:function(profile){
            this.dialog.hide();
            return false;
        },
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.dialog = (new linb.UI.Dialog)
            .alias("dialog").host(this)
            .onHotKeydown("_dialog_onhotkey")
            .setLeft(247).setTop(120).setWidth(433).setHeight(210).setResizable(false).setMinBtn(false).setMaxBtn(false).setPinBtn(false)
            .beforeClose("_dialog_beforeclose")
            ;
            this.nodes.push(this.dialog.get(0));

            this.btnCancel = (new linb.UI.Button)
            .alias("btnCancel").host(this)
            .setLeft(80).setTop(150).setWidth(90).setCaption("$VisualJS.cancel").setIcon("img/App.gif").setIconPos("-16px -16px")
            .onClick("_btncancel_onclick")
            ;
            this.dialog.attach(this.btnCancel);

            this.btnOK = (new linb.UI.Button)
            .alias("btnOK").host(this)
            .setLeft(250).setTop(150).setWidth(90).setCaption("$VisualJS.ok").setIcon("img/App.gif").setIconPos("-64px -16px")
            .onClick("_btnok_onclick")
            ;
            this.dialog.attach(this.btnOK);

            this.panelbar2 = (new linb.UI.PanelBar)
            .alias("panelbar2").host(this)
            .setDock("top").setHeight(140).setZIndex(1).setCaption("$VisualJS.delfile.sel").setCloseBtn(false).setLandBtn(false)
            ;
            this.dialog.attach(this.panelbar2);

            this.treebar = (new linb.UI.TreeBar)
            .alias("treebar").host(this)
            .setLeft(0).setTop(0).setItems([])
            .setIniFold(false).setSelMode("multi")
            .beforeValueUpdated("_treebar_beforevalueupdated").onItemSelected("_treebar_onitemselected")
            ;
            this.panelbar2.attach(this.treebar);
            return this.nodes;
            // ]]code creted by designer
        },
        _btncancel_onclick:function (profile, e, value) {
            this.dialog.close();
        },
        _btnok_onclick:function (profile, e, value) {
            var s = this.treebar.getUIValue(), self=this;;
            if(!s){
                linb.message(linb.getStr('VisualJS.delfile.notarget'));
            }else{
                linb.UI.Dialog.confirm(linb.getStr('VisualJS.delfile.confirmdel'), linb.getStr('VisualJS.delfile.confirmdel2', s.split(';').length), function(){
                    _.tryF(self.events.onOK, [s], self.host);
                    self.dialog.close();
                });
            }
        },
        _treebar_beforevalueupdated:function (profile, oldValue, newValue, showValue) {
            var arr = newValue.split(';');
            arr.sort();
            arr.filter(function(o,j){
                for(var i=0,l=this.length;i<l;i++){
                    if(i==j)break;
                    if(this[j].startWith(this[i]))
                        return false;
                }
            });
            return arr.join(';');
        },
        _dialog_onhotkey:function(profile, key, control, shift, alt){
            if(key=='esc')
                profile.boxing().close();
        }
    }
});

Class('VisualJS.About', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the VisualJS
        required:["linb.UI.Dialog","linb.UI.Div","linb.UI.Button"],
        //prepare data
        parepareData:function(properties,events){
        },
        _div9_aftercreated:function (profile) {
            profile.root.onClick(function(){
                linb.dom.submit('http://www.linb.net/VisualJS/');
            });
        },
        customAttach:function(){
            var prop = this.properties;
            if(!this.dialog.get(0).root)
                this.dialog.create();
            //asy
            this.dialog.show(this.parent, true);
        },
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.dialog = (new linb.UI.Dialog)
            .alias("dialog").host(this)
            .setLeft(250).setTop(150).setHeight(170).setCaption("$VisualJS.menu.about").setResizable(false).setMinBtn(false).setMaxBtn(false).setPinBtn(false)
            .onHotKeydown("_dialog_onhotkey")
            .beforeClose("_dialog2_beforeclose")
            ;
            this.nodes.push(this.dialog.get(0));

            this.div12 = (new linb.UI.Div)
            .alias("div12").host(this)
            .setLeft(10).setTop(10).setWidth(260).setHeight(80).setHtml('Visual Js 1.0 <br /> Powered by jsLinb and phpLINB <br />&copy;2006-2007 All rights reserved by <a href="mailto:&#108;&#105;&#110;&#98;&#46;&#110;&#101;&#116;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;">Yingbo Li</a>')
            ;
            this.dialog.attach(this.div12);

            this.button3 = (new linb.UI.Button)
            .alias("button3").host(this)
            .setLeft(120).setTop(100).setCaption("O K").setWidth(50).setZIndex("10")
            .onClick("_button3_onclick")
            ;
            this.dialog.attach(this.button3);

            this.div9 = (new linb.UI.Div)
            .alias("div9").host(this)
            .setLeft(90).setTop(65).setWidth("120").setHeight("60").setZIndex("8")
            .setCustomAppearance({KEY:'background:url(img/logo.gif);cursor:pointer;'})
            .afterCreated("_div9_aftercreated")
            ;
            this.dialog.attach(this.div9);

            return this.nodes;
            // ]]code creted by designer
        },
        _dialog2_beforeclose:function (profile) {
            profile.boxing().hide();
            return false;
        },
        _dialog_onhotkey:function(profile, key, control, shift, alt){
            if(key=='esc')
                profile.boxing().close();
        },
        _button3_onclick:function (profile, e, value) {
            this.dialog.close();
        }
    }
});