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
            "linb.coder",

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