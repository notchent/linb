
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        required:["linb.UI.MenuBar", "linb.UI.ToolBar", "linb.UI.Layout", "linb.UI.ButtonViews", "linb.UI.TextEditor", "linb.UI.Stacks", "linb.UI.Panel", "linb.UI.Tabs", "linb.UI.Pane", "linb.UI.TreeBar", "linb.UI.Div", "linb.UI.TreeGrid", "linb.UI.Label", "linb.UI.Button"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.MenuBar)
                .host(host,"menubar2")
                .setItems([{"id":"menFile", "caption":"File   ", "tips":"File", "sub":[{"id":"menFileNew", "caption":"New", "sub":[{"id":"menFileNewMailMessage", "caption":"Main Message", "image":"img/demo.gif"}, {"id":"menFileNewAppointment", "caption":"Appointment", "image":"img/demo.gif"}]}, {"id":"menFileOpen", "caption":"Open"}, {"id":"menFileOpen", "caption":"Open"}, {"id":"menFileDataFile", "caption":"Data File Management..."}, {"id":"menFileClose", "caption":"Close All Items"}, {"id":"menFileExport", "caption":"Export and import"}, {"id":"menFileWorkOffline", "caption":"Work Offline"}, {"id":"menFileExit", "caption":"Exit"}]}, {"id":"menEdit", "caption":"Edit"}, {"id":"menView", "caption":"View"}])
            );
            
            append((new linb.UI.Layout)
                .host(host,"layout4")
                .setItems([{"id":"before", "pos":"before", "locked":false, "size":250, "min":50, "max":250, "hide":false, "cmd":true, "caption":"before"}, {"id":"main", "min":10, "caption":"main"}])
                .setLeft(90)
                .setTop(170)
                .setType("horizontal")
            );
            
            host.layout4.append((new linb.UI.Pane)
                .host(host,"panel3")
                .setDock("top")
                .setHeight("3")
            , 'main');
            
            host.layout4.append((new linb.UI.Pane)
                .host(host,"panel7")
                .setDock("bottom")
                .setHeight(38)
                .setDropKeys("mydropkey")
                .onDrop("_tabs_ondrop")
            , 'before');
            
            host.layout4.append((new linb.UI.Tabs)
                .host(host,"tabs6")
                .setItems([{"id":"a", "caption":"File", "image":"img/file.gif"}, {"id":"b", "caption":"Project", "image":"img/proj.gif"}, {"id":"c", "caption":"Outline", "image":"img/outl.gif"}])
                .setLeft(0)
                .setTop(0)
                .setDropKeysPanel("mydropkey")
                .setDragKey("mydropkey")
                .setValue("a")
                .onDrop("_tabs_ondrop")
            , 'before');
            
            host.tabs6.append((new linb.UI.Button)
                .host(host,"button9")
                .setLeft(10)
                .setTop(11)
                .setCaption("I am in Project")
            , 'b');
            
            host.tabs6.append((new linb.UI.Button)
                .host(host,"button10")
                .setLeft(11)
                .setTop(11)
                .setCaption("I am in Outline")
            , 'c');
            
            host.layout4.append((new linb.UI.Tabs)
                .host(host,"tabs3")
                .setItems([{"id":"a", "caption":"readme.html", "closeBtn":true}, {"id":"b", "caption":"HelloWorld.java", "closeBtn":true}])
                .setLeft(0)
                .setTop(0)
                .setValue("a")
            , 'main');
            
            host.tabs3.append((new linb.UI.ButtonViews)
                .host(host,"buttonviews2")
                .setItems([{"id":"a", "caption":"Source"}, {"id":"b", "caption":"Preview"}])
                .setLeft(0)
                .setTop(0)
                .setBarLocation("bottom")
                .setBarSize("28")
                .setValue("a")
                .onItemSelected("_buttonviews2_onitemselected")
            , 'a');
            
            host.buttonviews2.append((new linb.UI.TextEditor)
                .host(host,"texteditor4")
                .setDock("fill")
                .setLeft(121)
                .setTop(41)
            , 'a');
            
            host.buttonviews2.append((new linb.UI.Div)
                .host(host,"div20")
                .setDock("fill")
                .setLeft(240)
                .setTop(110)
            , 'b');
            
            host.layout4.append((new linb.UI.Tabs)
                .host(host,"tabs28")
                .setItems([{"id":"a", "caption":"itema", "tips":"item a", "sub":[{"id":"aa", "caption":"suba"}, {"id":"ab", "caption":"subb"}]}, {"id":"b", "caption":"itemb", "tips":"item b"}, {"id":"c", "caption":"itemc", "tips":"item c"}])
                .setDock("bottom")
                .setDropKeysPanel("mydropkey")
                .setDragKey("mydropkey")
                .setValue("a")
                .onDrop("_tabs_ondrop")
            , 'main');
            
            append((new linb.UI.ToolBar)
                .host(host,"toolbar8")
                .setItems([{"id":"a", "caption":"itema", "tips":"item a", "sub":[{"id":"aa", "caption":"suba"}, {"id":"ab", "caption":"subb"}]}, {"id":"b", "caption":"itemb", "tips":"item b"}, {"id":"c", "caption":"itemc", "tips":"item c"}])
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _tabs_ondrop:function (profile, e, node, key, data, item) {
            var target = profile.boxing(),
                source = data.profile.boxing(),
                para = source.getPanelPara(data.domId),
                children = source.getPanelChildren(data.domId)

            source.removePanel(data.domId);
            target.addPanel(para, children, item);

        }, 
        _onready:function () {
            SPA=this;
            linb.Ajax('App/js/index.js','',function(str){
                SPA.texteditor4.setValue(str,true);
            }).start();
        }, 
        events:{"onReady":"_onready"}, 
        _buttonviews2_onitemselected:function (profile, item, src) {
            if(item.id=='b'){
                SPA.div20.setHtml(linb.Coder.formatHTML(SPA.texteditor4.getUIValue()));
            }
        }
    }
});