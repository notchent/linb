
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.MenuBar","linb.UI.ToolBar","linb.UI.Layout","linb.UI.ButtonViews","linb.UI.TextEditor","linb.UI.Stacks","linb.UI.PanelBar","linb.UI.Tabs","linb.UI.Panel","linb.UI.TreeBar","linb.UI.Div","linb.UI.TreeGrid","linb.UI.Label","linb.UI.Button"],
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            
            
	    f((new linb.UI.MenuBar)
            .host(t,"menubar2")
            .setItems([{"id":"menFile","caption":"File   ","tips":"File","sub":[{"id":"menFileNew","caption":"New","sub":[{"id":"menFileNewMailMessage","caption":"Main Message","icon":"img/demo.gif"},{"id":"menFileNewAppointment","caption":"Appointment","icon":"img/demo.gif"}]},{"id":"menFileOpen","caption":"Open"},{"id":"menFileOpen","caption":"Open"},{"id":"menFileDataFile","caption":"Data File Management..."},{"id":"menFileClose","caption":"Close All Items"},{"id":"menFileExport","caption":"Export and import"},{"id":"menFileWorkOffline","caption":"Work Offline"},{"id":"menFileExit","caption":"Exit"}]},{"id":"menEdit","caption":"Edit"},{"id":"menView","caption":"View"}])
            );
            
            f((new linb.UI.Layout)
            .host(t,"layout4")
            .setLeft(90).setTop(170).setItems([{"id":"before","pos":"before","locked":false,"size":250,"min":50,"max":250,"hide":false,"cmd":true},{"id":"main","min":10}])
            .setType("horizontal")
            );
            
            
            this.layout4.attach((new linb.UI.Tabs)
            .host(t,"tabs3")
            .setLeft(0).setTop(0).setItems([{"id":"a","caption":"readme.html","closeBtn":true},{"id":"b","caption":"HelloWorld.java","closeBtn":true}])
            ,'main');
            
            this.tabs3.attach((new linb.UI.ButtonViews)
            .host(t,"buttonviews2")
            .setLeft(0).setTop(0).setItems([{"id":"a","caption":"Source"},{"id":"b","caption":"Preview"}])
            .setHandleDock("bottom").setHandleSize("28")
            , 'a');
            
            this.buttonviews2.attach((new linb.UI.TextEditor)
            .host(t,"texteditor4")
            .setDock("fill").setLeft(121).setTop(41).setCaption("texteditor4")
            , 'a');
            
            this.buttonviews2.attach((new linb.UI.Div)
            .host(t,"div20")
            .setDock("fill").setLeft(240).setTop(110)
            , 'b');
            
            this.layout4.attach((new linb.UI.Panel)
            .host(t,"panel7")
            .setDock("bottom").setHeight(38).setDropKeys("mydropkey")
            .onDrop("_tabs_ondrop2")
            , 'before');
            
            this.layout4.attach((new linb.UI.Panel)
            .host(t,"panel3")
            .setDock("top").setHeight("3")
            , 'main');
            
            this.layout4.attach((new linb.UI.Tabs)
            .host(t,"tabs6")
            .setLeft(0).setTop(0).setItems([{"id":"a","caption":"File","icon":"img/file.gif"},{"id":"b","caption":"Project","icon":"img/proj.gif"},{"id":"c","caption":"Outline","icon":"img/outl.gif"}])
            .setDragKey("mydropkey").setDropKeysPanel("mydropkey")
            .onDrop("_tabs_ondrop")
			, 'before');
            
            this.tabs6.attach((new linb.UI.Button)
            .host(t,"button9")
            .setLeft(11).setTop(11).setCaption("I am in Project")
            , 'b');
            
            this.tabs6.attach((new linb.UI.Button)
            .host(t,"button10")
            .setLeft(11).setTop(11).setCaption("I am in Outline")
            , 'c');
            
            this.layout4.attach((new linb.UI.Tabs)
            .host(t,"tabs28")
            .setDragKey("mydropkey").setDock("bottom").setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setDropKeysPanel("mydropkey")
            .onDrop("_tabs_ondrop")
            , 'main');
            
            f((new linb.UI.ToolBar)
            .host(t,"toolbar8")
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            );
            
            return n;
            // ]]code creted by designer
        },
        _tabs_ondrop:function (profile, e, node, key, data, item) {
            var target = profile.boxing(), source = data.profile.boxing();
            var para = source.getPanelPara(data.domId), children = source.getPanelChildren(data.domId);
            source.removePanel(data.domId);
            target.addPanel(para, children, item);
        },
        _tabs_ondrop2:function (profile, e, node, key, data, item) {
            var target = profile.boxing(), source = data.profile.boxing();
            var para = source.getPanelPara(data.domId), children = source.getPanelChildren(data.domId);
            source.removePanel(data.domId);
            target.addPanel(para, children, item);
        },
        _tabs_aftercreated:function (profile) {
            //profile.boxing().dragable('KEY','o')
        }
    }
});