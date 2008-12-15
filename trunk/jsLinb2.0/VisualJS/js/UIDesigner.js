Class('UIDesigner', 'linb.Com',{
    Instance:{
        $classEditor:null,
        $pageviewType:'linb.UI.Tabs',
        $firstView:"design",
        $dftCodePath:'template/index.js',
        
        $fetchedCode:'',
        $iniCode:'',
        
        $url:'',
        
        $dirty:false,

        onDestroy:function(){
            this.$classEditor.destroy();
        },
        events:{
            onReady:function(){
                SPA=this;
                linb.ComFactory.setProfile(CONF.ComFactoryProfile);
            },
            onRender:function(com, threadid){
                com.setValue(com.$fetchedCode||com.$iniCode, com.$fetchedurl);
                com.$classEditor.showPage(com.$firstView);
            },
            afterIniComponents:function(){
                var self=this;
                linb('body')
                .append( new linb.UI.Button(
                    {caption:'Open', 
                        tips:'Open jsLinb class file (URL).',
                        zIndex:100, left:'auto', top:4, right:10, width:75, height:58, type:'custom', border:true, renderer:function(item){return '<img src=img/open.gif /><br />' + item.caption;}},
                    {onClick:function(){
                        if(self.$dirty){
                            if(false===confirm('You are about to close a file without saving it. Do you want to continue?'))
                                return;
                        }
                        if(self.$openFile){
                            self.$openFile.dlg.show(null,true,100,100);
                        }else{
                            //open file
                            linb.ComFactory.newCom('VisualJS.OpenFile',function(threadid){
                                self.$openFile=this;
                                //event handler for openFile Com
                                this.onOpenFile=function(url){
                                    linb.Thread.observableRun(function(threadid){
                                        linb.Ajax(CONF.phpPath,{
                                            key:CONF.requestKey,
                                            para:{
                                                action:'fetchwebfile',
                                                path:url
                                            }
                                        },function(txt){
                                            var obj=_.unserialize(txt);
                                            if(!obj.error)
                                                self.setValue(obj.data, url);
                                            else
                                                linb.message(obj.error.message);
                                            self.$openFile.dlg.hide();
                                        },function(){
                                            alert(url + " doesn't exist!");
                                        },threadid).start();
                                    });
                                };
                                this.create(function(){
                                    this.dlg.show(null,true,100,100);
                                });
                            });
                        }
                    }})
                )
                .append( new linb.UI.Button(
                    {caption:'Download', 
                        tips:'Download file and save it to locale disk.',
                        zIndex:100, left:'auto', top:4, right:90,  width:75, height:58, type:'custom', border:true, renderer:function(item){return '<img src=img/download.gif /><br />' + item.caption;}},
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
                )
                .append( self.$save2server = new linb.UI.Button(
                    {caption:'Save', 
                        tips:'Save original file (in server).',
                        display:'none',
                        zIndex:100, left:'auto', top:4, right:170, width:75, height:58, type:'custom', border:true, renderer:function(item){return '<img src=img/save.gif /><br />' + item.caption;}},
                    {onClick:function(){
                        var content=self.getValue();
                        if(false===content)return;
                        var path=self.$url;
                        if(/^(http|https)\:\/\//.test(self.$url)){
                            //change the url to relative path format
                            var s1=self.$url.replace(/^.+\:\/\/[^/]+\//,''),
                                s2=linb.ini.appPath.replace(/^.+\:\/\/[^/]+\//,'').replace(/\/$/,''),
                                a1=s1.split('/'),
                                a2=s2.split('/'),
                                count=0,
                                as='';
                            _.arr.each(a2,function(o,i){
                                if(a1[i]!=o)
                                    return false;
                                else count++;
                            });
                            as +=_.str.repeat('../',(a2.length-count));
                            path = as + a1.slice(count,a1.length).join('/');
                        }

                        linb.IAjax(CONF.phpPath, {
                            key:CONF.requestKey, para:{
                                action:'savetoserver',
                                hashCode:_(),
                                path: path,
                                content:content
                            }}, function(txt){
                                var obj = typeof txt=='string'?_.unserialize(txt):txt;
                                if(obj && !obj.error && obj.data && obj.data.OK){
                                    linb.message('Saved to server!');
                                    self.imgEdit.setDisplay('none');
                                    self.$dirty=false;
                                }else
                                    linb.message(obj.error.message);
                            },function(txt){
                                linb.message(txt);
                            }).start();
                    }})
                );

                self.$btnTheme=new linb.UI.Button({
                    type:'drop',
                    caption:'Default Theme',
                    tips:'To switch theme',
                    position:'absolute',
                    top:40,
                    right:250,
                    left:'auto',
                    width:110,
                    zIndex:100
                },{
                    onClick:function(profile,e,src){
                        self.popMenu.pop(src);
                    },
                    onClickDrop:function(profile,e,src){
                        self.popMenu.pop(src);
                    }
                });
                linb('body').append(self.$btnTheme);
            }
        },
        iniResource:function(com, threadid){
            //Load default code(insert to the current thread)
            var com=this,
                url=_.urlDecode(location.href.split('#')[1],'url'),
                hash={};

            hash.ajax1=linb.Ajax(com.$dftCodePath,'',function(code){
                com.$iniCode=code.replace('{className}','App');
            },function(){
                alert(com.$dftCodePath + " doesn't exist!");
            });
            
            if(url){
                com.$url=url;
                hash.ajax2=linb.Ajax(CONF.phpPath,{
                    key:CONF.requestKey,
                    para:{
                        action:'fetchwebfile',
                        path:url
                    }
                },function(txt){
                    var obj=_.unserialize(txt);
                    if(!obj.error){
                        com.$fetchedCode=obj.data;
                        com.$fetchedurl=url;
                    }else
                        linb.message(obj.error.message);
                },function(){
                    alert(url + " doesn't exist!");
                });
            }
            linb.absIO.groupCall(hash,null,null,null,threadid);
        },
        iniExComs:function(com, threadid){
            var com=this;
            //New an instance of VisualJS.ClassEditor
            linb.ComFactory.newCom('VisualJS.ClassEditor',function(threadid){
                var inn=this;
                inn.host = com;
                inn.$pageviewType=com.$pageviewType;
                inn.setEvents('onValueChanged',function(ipage, profile, b, nV){
                    com.imgEdit.setDisplay(b?'':'none');
                    com.$dirty=b;
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
        setValue:function(str,url){
            var self=this;
            if(str)
                self.$classEditor.setValue(str);
            if(url)
                self.$url=url;
            var dis=self.$url?!linb.absIO.isCrossDomain(self.$url)?'':'none':'none';
            self.$save2server.setDisplay(dis);
            self.paneTop.setDisplay(dis);

            if(self.$url)
                self.urlLink.setHref(self.$url).setCaption(self.$url);
            self.imgEdit.setDisplay('none');
            self.$dirty=false;
        },
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.PopMenu)
                .host(host,"popMenu")
                .setItems([{"id":"default", "caption":"Default Theme"}, {"id":"aqua", "caption":"Aqua Theme"}, {"id":"vista", "caption":"Vista Theme"}])
                .onMenuSelected("_onmenusel")
            );
            
            append((new linb.UI.Image)
                .host(host,"image1")
                .setDock("center")
                .setTop(6)
                .setSrc("img/builder.gif")
            );
            
            append((new linb.UI.Tag)
                .host(host,"container")
                .setDock("fill")
                .setDockMargin({"left":0, "top":40, "right":0, "bottom":0})
            );
            
            append((new linb.UI.Pane)
                .host(host,"paneTop")
                .setTop(10)
                .setWidth("auto")
                .setHeight(20)
                .setDisplay('none')
                .setPosition("relative")
            );
            
            host.paneTop.append((new linb.UI.Image)
                .host(host,"imgEdit")
                .setLeft(20)
                .setTop(0)
                .setSrc('img/inedit.gif')
                .setDisplay('none')
            );
            host.paneTop.append((new linb.UI.Div)
                .host(host,"div18")
                .setLeft(40)
                .setTop(0)
                .setWidth(90)
                .setHeight(20)
                .setHtml("Target File: ")
            );
            
            host.paneTop.append((new linb.UI.Link)
                .host(host,"urlLink")
                .setLeft(106)
                .setTop(1)
                .setTarget("_blank")
                .setCaption("")
                .onClick(function(){return true})
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