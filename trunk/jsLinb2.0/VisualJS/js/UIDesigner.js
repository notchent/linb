Class('UIDesigner', 'linb.Com',{
    Instance:{
        $classEditor:null,
        $pageviewType:'linb.UI.Tabs',
        $firstView:"design",
        $dftCodePath:'template/index.js',
        
        $fetchedCode:'',
        $iniCode:'',

        onDestroy:function(){
            this.$classEditor.destroy();
        },
        events:{
            onReady:function(){
                SPA=this;
                linb.ComFactory.setProfile(CONF.ComFactoryProfile);
            },
            onRender:function(com, threadid){
                com.setValue(com.$fetchedCode||com.$iniCode);
                com.$classEditor.showPage(com.$firstView);
            },
            afterIniComponents:function(){
                var self=this;
                self.toolbar.setItems([{"id":"grp1",sub:[
                    {id:'open', object: new linb.UI.Button(
                        {caption:'Open Class File', image:CONF.img_app, imagePos:'-48px top'},
                        {onClick:function(){
                            if(self.$openFile){
                                self.$openFile.dlg.show(null,true,100,100);
                            }else{
                                //open file
                                linb.ComFactory.newCom('VisualJS.OpenFile',function(threadid){
                                    self.$openFile=this;
                                    //event handler for openFile Com
                                    this.onOpenFile=function(url){
                                        linb.Thread.observableRun(null,[function(threadid){
                                            linb.Ajax(CONF.phpPath,{
                                                key:CONF.requestKey,
                                                para:{
                                                    action:'fetchwebfile',
                                                    path:url
                                                }
                                            },function(txt){
                                                var obj=_.unserialize(txt);
                                                if(!obj.error)
                                                    self.setValue(obj.data);
                                                else
                                                    linb.message(obj.error.message);
                                                self.$openFile.dlg.hide();
                                            },function(){
                                                alert(url + " doesn't exist!");
                                            },threadid).start();
                                        }]);
                                    };
                                    this.create(function(){
                                        this.dlg.show(null,true,100,100);
                                    });
                                });
                            }
                        }})
                    },
                    {id:'save', object: new linb.UI.Button(
                        {caption:'Save JS file',width:130, image:CONF.img_app, imagePos:'-80px top'},
                        {onClick:function(){
                            var id='ifr_for_download',
                                content=self.getValue();
                            if(false===content)return;
                            if(!linb.Dom.byId(id))
                                linb('body').append(linb.create('<iframe id="'+id+'" name="'+id+'" style="display:none;"/>'));
                
                            var hash={
                                key:CONF.requestKey,
                                para:{
                                    action:'downloadjs',
                                    content:content
                                }
                            };
                            linb.Dom.submit(CONF.phpPath, hash, 'post', id);
                        }})
                    }
                ]},{id:'grp2',sub:[
                    {id:'theme',object: self.$btnTheme=new linb.UI.Button({
                        type:'drop',
                        caption:'Default Theme',
                    },{
                        onClick:function(profile,e,src){
                            self.popMenu.pop(src);
                        },
                        onClickDrop:function(profile,e,src){
                            self.popMenu.pop(src);
                        }
                    })}
                ]}]);
            }
        },
        iniResources:function(threadid){
            //Load default code(insert to the current thread)
            var com=this,
                url=_.urlDecode(location.href.split('#')[1],'url'),
                hash={};
            hash.ajax1=linb.Ajax(com.$dftCodePath,'',function(code){
                com.$iniCode=code.replace('{className}','App');
            },function(){
                alert(com.$dftCodePath + " doesn't exist!");
            },threadid);
            
            if(url){
                hash.ajax2=linb.Ajax(CONF.phpPath,{
                    key:CONF.requestKey,
                    para:{
                        action:'fetchwebfile',
                        path:url
                    }
                },function(txt){
                    var obj=_.unserialize(txt);
                    if(!obj.error)
                        com.$fetchedCode=obj.data;
                    else
                        linb.message(obj.error.message);
                },function(){
                    alert(url + " doesn't exist!");
                },threadid);
            }

            linb.Ajax.group(hash,null,null,null,threadid).start();
        },
        iniExComs:function(threadid){
            var com=this;
            //New an instance of VisualJS.ClassEditor
            linb.ComFactory.newCom('VisualJS.ClassEditor',function(threadid){
                var inn=this;
                inn.host = com;
                inn.$pageviewType=com.$pageviewType;
                inn.setEvents('onValueChanged',function(ipage, profile, b, nV){
                     _.tryF(com.events.onValueChanged, [com, ipage, b, nV], com.host);
                });

                //Create it first
                inn.create(function(o,threadid){
                    //Replace the Tag one
                    linb.UI.Tag.replace(com.container.get(0), inn.buttonview.get(0), com);
                },threadid);

                com.$classEditor=inn;
            },threadid);
        },
        getValue:function(){
            return this.$classEditor.getValue();
        },
        setValue:function(str){
            this.$classEditor.setValue(str);
        },
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};

            append((new linb.UI.PopMenu)
                .host(host,"popMenu")
                .setItems([{id:'default',caption:'Default Theme'},{id:'aqua',caption:'Aqua Theme'},{id:'vista',caption:'Vista Theme'}])
                .onMenuSelected('_onmenusel')
            );
            
            append((new linb.UI.ToolBar)
                .host(host,"toolbar")
            );
            
            append((new linb.UI.Tag)
                .host(host,"container")
                .setDock("fill")
            );
            return children;
            // ]]code created by jsLinb UI Builder
        },
        _onmenusel:function(profile,item){
            var id=item.id;
            if((SPA.$curTheme||'default')==id)return;
            linb.UI.setTheme(SPA.$curTheme=id);
            SPA.$btnTheme.setCaption(item.caption);
        }
    }
});