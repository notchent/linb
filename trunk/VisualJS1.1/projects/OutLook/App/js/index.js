
Class('App', 'linb.Com',{
        Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.MenuBar","linb.UI.ToolBar","linb.UI.Layout","linb.UI.ButtonViews","linb.UI.Stacks","linb.UI.Button","linb.UI.PanelBar","linb.UI.TreeBar","linb.UI.TreeGrid","linb.UI.Block","linb.UI.Panel","linb.UI.ComboInput","linb.UI.Label","linb.UI.Input","linb.UI.PopMenu","linb.UI.Gallery","linb.UI.Group","linb.UI.RadioBox"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.PopMenu)
            .host(t,"popmenu5")
            .setWidth(91)
            .setHeight(73)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            );
            
            f(
            (new u.ToolBar)
            .host(t,"toolbar7")
            .setItems([{"id":"toolSection1","sub":[{"id":"toolNewMail","caption":"New Mail","tips":"New Mail Message","icon":"img/demo.gif"}]},{"id":"toolSection2","sub":[{"id":"toolPrint","tips":"print","icon":"img/demo.gif"},{"id":"toolMove","tips":"Move to folder","icon":"img/demo.gif"},{"id":"toolDelete","tips":"Delete","icon":"img/demo.gif"}]}])
            .setDockOrder("3")
            );
            
            f(
            (new u.MenuBar)
            .host(t,"menubar2")
            .setItems([{"id":"menFile","caption":"File","tips":"File","sub":[{"id":"menFileNew","caption":"New","sub":[{"id":"menFileNewMailMessage","caption":"Main Message","icon":"img/demo.gif"},{"id":"menFileNewAppointment","caption":"Appointment","icon":"img/demo.gif"}]},{"id":"menFileOpen","caption":"Open"},{"id":"menFileOpen","caption":"Open"},{"id":"menFileDataFile","caption":"Data File Management..."},{"id":"menFileClose","caption":"Close All Items"},{"id":"menFileExport","caption":"Export and import"},{"id":"menFileWorkOffline","caption":"Work Offline"},{"id":"menFileExit","caption":"Exit"}]},{"id":"menEdit","caption":"Edit"},{"id":"menView","caption":"View"}])
            );
            
            f(
            (new u.Layout)
            .host(t,"layout4")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"before","pos":"before","locked":false,"size":200,"min":50,"max":200,"hide":false,"cmd":true},{"id":"main","min":10}])
            .setType("horizontal")
            );
            
            t.layout4.attach(
            (new u.Panel)
            .host(t,"panel13")
            .setDock("top")
            .setHeight(30)
            , 'main');
            
            t.panel13.attach(
            (new u.Input)
            .host(t,"input6")
            .setLeft(310)
            .setTop(8)
            );
            
            t.panel13.attach(
            (new u.Label)
            .host(t,"label4")
            .setLeft(10)
            .setTop(10)
            .setCaption("<b>Look for:</b>")
            );
            
            t.panel13.attach(
            (new u.Button)
            .host(t,"button11")
            .setLeft(450)
            .setTop(7)
            .setWidth(50)
            .setCaption("option")
            .onClick("_button11_onclick")
            );
            
            t.panel13.attach(
            (new u.Label)
            .host(t,"button11")
            .setLeft(230)
            .setTop(10)
            .setCaption("<b>Search in:</b>")
            .setWidth(70)
            );
            
            t.panel13.attach(
            (new u.ComboInput)
            .host(t,"comboinput14")
            .setLeft(80)
            .setTop(8)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            );
            
            t.layout4.attach(
            (new u.PanelBar)
            .host(t,"pnlNote")
            .setLeft(230)
            .setTop(140)
            .setZIndex("2")
            .setCaption("Note Panel")
            , 'main');
            
            t.pnlNote.attach(
            (new u.Gallery)
            .host(t,"gallery5")
            .setDock("fill")
            .setLeft(210)
            .setTop(130)
            .setItems([{"id":"a","caption":"Meeting..","tips":"Meeting with Mr. Lincon","icon":"img/notice.gif"},{"id":"b","caption":"1:1 talk","tips":"1:1 talk with Mr. Terry","icon":"img/notice.gif"},{"id":"c","caption":"Interview","tips":"Interview with BCC","icon":"img/notice.gif"}])
            .setItemWidth("64")
            .setItemHeight("64")
            .setIconWidth("48")
            .setIconHeight("48")
            );
            
            t.layout4.attach(
            (new u.PanelBar)
            .host(t,"pnlEmail")
            .setLeft(110)
            .setTop(120)
            .setZIndex(1)
            .setCaption("Emails")
            , 'main');
            
            t.pnlEmail.attach(
            (new u.Layout)
            .host(t,"layout5")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"before","pos":"before","locked":false,"size":200,"min":50,"max":200,"hide":false,"cmd":true},{"id":"main","min":10}])
            );
            
            t.layout5.attach(
            (new u.TreeGrid)
            .host(t,"treegrid2")
            .setHeader([{"id":"col1","caption":"From","type":"input","width":80},{"id":"col2","caption":"Subject","type":"input","width":340},{"id":"col3","caption":"Received","type":"input","width":80},{"id":"col4","caption":"size","type":"input","width":80}])
            .setRows([])
            .setEditable(false)
            .afterRowActive("_treegrid2_afterrowactive")
            , 'before');
            
            t.layout5.attach(
            (new u.Block)
            .host(t,"block2")
            .setDock("fill")
            .setDockMargin({"left":10,"top":10,"right":10,"bottom":10})
            .setLeft(160)
            .setTop(100)
            .setShadow(true)
            .setBorder(true)
            , 'main');
            
            t.layout4.attach(
            (new u.ButtonViews)
            .host(t,"buttonviews4")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"email","icon":"img/email.gif","tips":"Email"},{"id":"note","icon":"img/note.gif","tips":"Note"},{"id":"contact","icon":"img/contact.gif","tips":"Contact"},{"id":"calendar","icon":"img/calendar.gif","tips":"Calendar"}])
            .setHandleDock("bottom")
            .setHandleHAlign("right")
            .setHandleSize("28")
            .onItemSelected("_buttonviews4_onitemselected")
            , 'before');
            
            t.buttonviews4.attach(
            (new u.PanelBar)
            .host(t,"panelbar4")
            .setLeft(0)
            .setTop(0)
            .setZIndex(1)
            .setCaption("Email")
            , 'email');
            
            t.panelbar4.attach(
            (new u.TreeBar)
            .host(t,"treebar5")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"Personal Folder","icon":"img/personal.gif","tips":"Personal Only","sub":[{"id":"aa","caption":"Inbox","icon":"img/inbox.gif"},{"id":"ab","caption":"Sent Items","icon":"img/sent.gif"},{"id":"ac","caption":"Deleted Items","icon":"img/deleted.gif"}]},{"id":"b","caption":"<font color=red><b>Inbox(6)</b></font>","tips":"incoming messages go here","icon":"img/inbox.gif"},{"id":"c","caption":"Outbox","tips":"Sent items go here","icon":"img/outbox.gif"}])
            .onItemSelected("_treebar5_onitemselected")
            );
            
            t.buttonviews4.attach(
            (new u.PanelBar)
            .host(t,"panelbar12")
            .setLeft(0)
            .setTop(0)
            .setZIndex(1)
            .setCaption("Note")
            , 'note');
            
            t.panelbar12.attach(
            (new u.Group)
            .host(t,"group1")
            .setDock("top")
            .setHeight(170)
            .setCaption("Current View")
            );
            
            t.group1.attach(
            (new u.RadioBox)
            .host(t,"radiobox2")
            .setDock("fill")
            .setLeft(30)
            .setTop(20)
            .setItems([{"id":"a","caption":"Show note icons","tips":"Show note icons"},{"id":"b","caption":"Notes List","tips":"Show notes within a list"},{"id":"c","caption":"Other","tips":"Other"}])
            );
            
            t.layout4.attach(
            (new u.PanelBar)
            .host(t,"pnlContact")
            .setLeft(0)
            .setTop(0)
            .setZIndex("3")
            .setCaption("Bussiness & Contact ")
            , 'main');
            
            t.pnlContact.attach(
            (new u.Group)
            .host(t,"group3")
            .setLeft(20)
            .setTop(30)
            .setWidth(560)
            .setHeight(150)
            .setCaption("All Contact")
            );
            
            t.group3.attach(
            (new u.PanelBar)
            .host(t,"panelbar16")
            .setDragKey("contactkey")
            .setDock("none")
            .setLeft(20)
            .setTop(10)
            .setWidth(150)
            .setHeight(70)
            .setZIndex(1)
            .setHtml("<b>Balara</b><br>01-4567-890<br>kenny@sigmawidgets.com")
            .setTitleHeight("20")
            .setCaption("Balara, Kenny")
            );
            
            t.group3.attach(
            (new u.PanelBar)
            .host(t,"panelbar17")
            .setDock("none")
            .setLeft(190)
            .setTop(10)
            .setWidth(150)
            .setZIndex(1)
            .setHtml("<b>Linda</b><br>01-3238-727<br>linda@abc.com")
            .setTitleHeight("20")
            .setCaption("Linda, Wen")
            .setDragKey("contactkey")
            .setHeight(70)
            );
            
            t.group3.attach(
            (new u.PanelBar)
            .host(t,"panelbar18")
            .setDock("none")
            .setLeft(360)
            .setTop(10)
            .setWidth(150)
            .setZIndex(1)
            .setHtml("<b>Jim</b><br>01-6543-321<br>Jim@blabla.com")
            .setTitleHeight("20")
            .setCaption("Jim, Stephen")
            .setHeight(70)
            .setDragKey("contactkey")
            );
            
            t.pnlContact.attach(
            (new u.Group)
            .host(t,"group4")
            .setLeft(20)
            .setTop(200)
            .setWidth(560)
            .setHeight(130)
            .setCaption("Drag customers to this box")
            );
            
            t.group4.attach(
            (new u.Panel)
            .host(t,"panel16")
            .setLeft(20)
            .setTop(10)
            .setWidth(150)
            .setHeight(80)
            .setDropKeys("contactkey")
            .setHtml("Drag bussiness card over me")
            .onDrop("_panel16_ondrop")
            );
            
            t.group4.attach(
            (new u.Panel)
            .host(t,"panel17")
            .setLeft(190)
            .setTop(10)
            .setWidth(150)
            .setHeight(80)
            .setDropKeys("contactkey")
            .setHtml("Drag bussiness card over me")
            .onDrop("_panel16_ondrop")
            );
            
            t.pnlContact.attach(
            (new u.Group)
            .host(t,"group5")
            .setLeft(20)
            .setTop(360)
            .setWidth(560)
            .setHeight(130)
            .setCaption("Drag venders here")
            );
            
            t.group5.attach(
            (new u.Panel)
            .host(t,"panel18")
            .setLeft(20)
            .setTop(10)
            .setWidth(150)
            .setHeight(80)
            .setDropKeys("contactkey")
            .setHtml("Drag bussiness card over me")
            .onDrop("_panel16_ondrop")
            );
            
            t.group5.attach(
            (new u.Panel)
            .host(t,"panel19")
            .setLeft(200)
            .setTop(10)
            .setWidth(150)
            .setHeight(80)
            .setDropKeys("contactkey")
            .setHtml("Drag bussiness card over me")
            .onDrop("_panel16_ondrop")
            );
            
            return n;
            // ]]code created by designer
        },
        events:{
            "onReady":"_onReady"
        },
        _onReady:function(page, threadid){
            SPA=page;
        },
        _treebar5_onitemselected:function (profile, item, src) {
            this.pnlEmail.setCaption("Emails in " + item.caption);
            if(item.id=="b"){
                //this.ajax1.request();
                linb.ajax('Data/inbox.js','a=1&b=2',this._ajax1_onrequestok).start();

            }else{
                linb.message("You seleted " + item.caption);
                this.treegrid2.setRows([]);
            }
        },
        _ajax1_onrequestok:function (response, rspType, threadId) {
            var obj = _.unserialize(response);
            SPA.treegrid2.setHeader(obj.header).setRows(obj.rows);
        },
        _treegrid2_afterrowactive:function (profile, row) {
             this.block2.setHtml(row.cells[1].value);
        },
        _buttonviews4_onitemselected:function (profile, item, src) {
            this.pnlEmail.setZIndex(1);
            this.pnlNote.setZIndex(1);
            this.pnlContact.setZIndex(1);

            if(item.id=="email"){
                this.pnlEmail.setZIndex(2);
            }else if(item.id=="note"){
                this.pnlNote.setZIndex(2);
            }else if(item.id="contact"){
                this.pnlContact.setZIndex(2);
            }else{

            }

        },
        _button11_onclick:function (profile, e, value) {
            this.popmenu5.pop(profile.root);
            this.popmenu5.$target = profile;
        },
        _panel16_ondrop:function (profile, e, node, key, data, item) {
            var target = profile.boxing(), source = data.profile.boxing();
            var para = source.getPanelPara(data.domId), children = source.getPanelChildren(data.domId);
            source.removePanel(data.domId);
            target.addPanel(para, children, item);
        }
    }
});