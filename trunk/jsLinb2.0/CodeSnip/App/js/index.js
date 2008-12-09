Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        //"linb.Tips","linb.UI.Resizer","linb.UI.Border","linb.UI.Shadow"
        required:["linb.UI.Layout", "linb.UI.Panel", "linb.UI.TreeBar", "linb.UI.Block", "linb.UI.Tabs", "linb.UI.Div", "linb.UI.Link"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Layout)
                .host(host,"layout")
                .setDomId("ce_layout")
                .setItems([{"id":"before", "pos":"before", "locked":false, "size":200, "min":50, "max":400, "hide":false, "cmd":true, "caption":"before"}, {"id":"main", "min":10, "caption":"main"}])
                .setDockMargin({"left":10, "top":10, "right":10, "bottom":10})
                .setLeft(0)
                .setTop(0)
                .setType("horizontal")
                .setCustomStyle({"ITEM":"background:#fff;", "MOVE":"background:#fff;border:0"})
            );
            
            host.layout.append((new linb.UI.Layout)
                .host(host,"layout_r")
                .setDomId("ce_layout_r")
                .setItems([{"id":"main", "min":10, "caption":"main"}, {"id":"after", "pos":"after", "locked":false, "size":300, "min":50, "max":600, "hide":false, "cmd":true, "caption":"after"}])
                .setLeft(0)
                .setTop(0)
                .setCustomStyle({"ITEM":"background:#fff", "MOVE":"background:#fff;border:0"})
            , 'main');
            
            host.layout_r.append((new linb.UI.Block)
                .host(host,"stage")
                .setDomId("ce_stage")
                .setDock("fill")
                .setDockMargin({"left":4, "top":4, "right":0, "bottom":0})
                .setLeft(30)
                .setTop(50)
                .setBorder(true)
                .setShadow(true)
            , 'main');
            
            host.stage.append((new linb.UI.Div)
                .host(host,"div17")
                .setLeft(150)
                .setTop(50)
                .setWidth(220)
                .setHeight(30)
            );
            
            host.layout_r.append((new linb.UI.Link)
                .host(host,"openinbuild")
                .setTop(10)
                .setRight(50)
                .setVisibility('hidden')
                .setTarget('_blank')
                .setCaption("Open it in UI builder")
                .onClick("_openinbuild_onclick")
                .setCustomStyle({"KEY":"font-weight:bold;text-decoration:underline;"})
            , 'main');
            
            host.layout_r.append((new linb.UI.Block)
                .host(host,"blockCode")
                .setDomId("ce_blockCode")
                .setDock("fill")
                .setDockMargin({"left":4, "top":4, "right":4, "bottom":4})
                .setLeft(120)
                .setTop(80)
                .setCustomStyle({"PANEL":"background:#F4F4F4"})
            , 'after');
            
            host.layout.append((new linb.UI.Block)
                .host(host,"blockL")
                .setDomId("ce_blockL")
                .setDock("fill")
                .setDockMargin({"left":4, "top":4, "right":0, "bottom":0})
                .setLeft(20)
                .setTop(100)
                .setBorder(true)
                .setShadow(true)
            , 'before');
            
            host.blockL.append((new linb.UI.Panel)
                .host(host,"comtreebar")
                .setDomId("ce_comtreebar")
                .setLeft(0)
                .setTop(0)
                .setZIndex(1)
                .setCaption("jsLinb Code Snippets")
            );
            
            host.comtreebar.append((new linb.UI.TreeBar)
                .host(host,"treebar")
                .setDomId("ce_treebar")
                .setLeft(0)
                .setTop(0)
                .setAnimCollapse(true)
                .onItemSelected("_treebar_onitemselected")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _onready:function () {
            Class("Component");
            var ns=this;
            ns.treebar.setItems(CONF.widgets);
            linb.History.setCallback(function(str){
                if(str){
                    ns.treebar.setValue(str, true);
                    //fire event
                    ns.treebar.onItemSelected(ns.treebar.get(0), {id: str} );
                }
            })
        }, 
        _treebar_onitemselected:function (profile, item, src) {
            var host=this,
                id = 'Classes.'+item.id,
                clsName = 'App.'+item.id.replace(/\./g,'_'),
                path = linb.getPath(id,'.js'),
                message = 'Getting file from <strong>"' + path + '"</strong>...',
                fail = function(msg){
                    if(!msg)
                        msg = 'Related file <strong>"' + path + '"</strong> doesn\'t exists, or has invalid format!';
                    host.stage.setHtml(msg);
                    host.blockCode.setHtml(msg);
                    host.openinbuild.setVisibility('hidden');
                    
                };

            //destroy the instance
            if(host._instance){
                host._instance.destroy();
                delete host._instance;
            }
            //destroy the Class
            if(host._class){
                Class.__gc(host._class.KEY);
                delete host._class;
            }

            //set loading... message
            host.stage.setHtml(message);
            host.blockCode.setHtml(message);

            linb.History.setFI(item.id, false)

            linb.Thread.observableRun(function(threadid){
                //get com
                linb.Ajax(path,"",function(txt){
                    try{
                        //set code
                        host.blockCode.setHtml(linb.Coder.formatHTML(txt,'js',['plain']));
                        //get instance
                        _.exec(txt);
                        var obj=linb.SC.get(clsName);
                        if(obj){
                            host._class=obj;
                            var o = host._instance = new obj();
                            o.create(function(){
                                //show UI
                                host.stage.getSubNode('PANEL').html('');
                                host.stage.append(this.getUIComponents(),false);
                            });
                            host.openinbuild.setVisibility('visible');
                            
                            var a=linb.ini.path.split('/').slice(0,-3),b=a.join('/')+'/VisualJS/UIBuilder.html';
                            host.openinbuild.setHref(b + "#url=" + encodeURIComponent(path))
                            
                            host.$path=path;
                        }else
                            fail();
                    }catch(e){
                        fail(String(e));
                    }
                },function(msg){
                    fail()
                },threadid).start();
            });
        }, 
        events:{"onReady":"_onready"}, 
        _openinbuild_onclick:function (profile, e) {
            return true;
        }
    }
});