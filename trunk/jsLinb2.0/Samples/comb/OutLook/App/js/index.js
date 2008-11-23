
Class('App', 'linb.Com',{
        Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        required:["linb.UI.MenuBar", "linb.UI.ToolBar", "linb.UI.Layout", "linb.UI.ButtonViews", "linb.UI.Stacks", "linb.UI.Button", "linb.UI.Panel", "linb.UI.TreeBar", "linb.UI.TreeGrid", "linb.UI.Block", "linb.UI.Pane", "linb.UI.ComboInput", "linb.UI.Label", "linb.UI.Input", "linb.UI.PopMenu", "linb.UI.Gallery", "linb.UI.Group", "linb.UI.RadioBox"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.PopMenu)
                .host(host,"popmenu5")
                .setItems([{"id":"a", "caption":"itema", "tips":"item a", "sub":[{"id":"aa", "caption":"suba"}, {"id":"ab", "caption":"subb"}]}, {"id":"b", "caption":"itemb", "tips":"item b"}, {"id":"c", "caption":"itemc", "tips":"item c"}])
                .setWidth(91)
                .setHeight(73)
            );
            
            append((new linb.UI.Layout)
                .host(host,"layout4")
                .setItems([{"id":"before", "pos":"before", "locked":false, "size":200, "min":50, "max":200, "hide":false, "cmd":true, "caption":"before"}, {"id":"main", "min":10, "caption":"main"}])
                .setLeft(0)
                .setTop(0)
                .setType("horizontal")
            );
            
            host.layout4.append((new linb.UI.Pane)
                .host(host,"panel13")
                .setDock("top")
                .setHeight(30)
            , 'main');
            
            host.panel13.append((new linb.UI.Button)
                .host(host,"button11")
                .setLeft(480)
                .setTop(7)
                .setWidth(50)
                .setCaption("option")
                .onClick("_button11_onclick")
            );
            
            host.panel13.append((new linb.UI.Label)
                .host(host,"label4")
                .setLeft(10)
                .setTop(10)
                .setCaption("<b>Look for:</b>")
            );
            
            host.panel13.append((new linb.UI.Input)
                .host(host,"input6")
                .setLeft(340)
                .setTop(8)
            );
            
            host.panel13.append((new linb.UI.Label)
                .host(host,"button11")
                .setLeft(260)
                .setTop(10)
                .setWidth(70)
                .setCaption("<b>Search in:</b>")
            );
            
            host.panel13.append((new linb.UI.ComboInput)
                .host(host,"comboinput14")
                .setLeft(130)
                .setTop(8)
                .setItems([{"id":"a", "caption":"itema", "tips":"item a", "sub":[{"id":"aa", "caption":"suba"}, {"id":"ab", "caption":"subb"}]}, {"id":"b", "caption":"itemb", "tips":"item b"}, {"id":"c", "caption":"itemc", "tips":"item c"}])
            );
            
            host.layout4.append((new linb.UI.Panel)
                .host(host,"pnlNote")
                .setCaption("Note Pane")
            , 'main');
            
            host.pnlNote.append((new linb.UI.Gallery)
                .host(host,"gallery5")
                .setItems([{"id":"a", "caption":"Meeting..", "tips":"Meeting with Mr. Lincon", "icon":"img/notice.gif"}, {"id":"b", "caption":"1:1 talk", "tips":"1:1 talk with Mr. Terry", "icon":"img/notice.gif"}, {"id":"c", "caption":"Interview", "tips":"Interview with BCC", "icon":"img/notice.gif"}])
                .setDock("fill")
                .setLeft(210)
                .setTop(130)
                .setItemPadding("4")
                .setItemWidth("64")
                .setItemHeight("64")
                .setImgWidth("48")
                .setImgHeight("48")
            );
            
            host.layout4.append((new linb.UI.Panel)
                .host(host,"pnlEmail")
                .setCaption("Emails")
            , 'main');
            
            host.pnlEmail.append((new linb.UI.Layout)
                .host(host,"layout5")
                .setItems([{"id":"before", "pos":"before", "locked":false, "size":200, "min":50, "max":200, "hide":false, "cmd":true, "caption":"before"}, {"id":"main", "min":10, "caption":"main"}])
                .setLeft(0)
                .setTop(0)
            );
            
            host.layout5.append((new linb.UI.TreeGrid)
                .host(host,"treegrid2")
                .setDockMargin({"left":0, "top":0, "right":0, "bottom":0})
                .setHeader([{"id":"col1", "caption":"From", "type":"input", "width":80}, {"id":"col2", "caption":"Subject", "type":"input", "width":340}, {"id":"col3", "caption":"Received", "type":"input", "width":80}, {"id":"col4", "caption":"size", "type":"input", "width":80}])
                .setRows([])
                .afterRowActive("_treegrid2_afterrowactive")
            , 'before');
            
            host.layout5.append((new linb.UI.Block)
                .host(host,"block2")
                .setDock("fill")
                .setDockMargin({"left":10, "top":10, "right":10, "bottom":10})
                .setLeft(160)
                .setTop(100)
                .setBorder(true)
                .setShadow(true)
            , 'main');
            
            host.layout4.append((new linb.UI.ButtonViews)
                .host(host,"buttonviews4")
                .setItems([{"id":"email", "icon":"img/allinone.gif", "iconPos":"-80px top", "tips":"Email", "caption":"email"}, {"id":"note", "icon":"img/allinone.gif", "iconPos":"-96px top", "tips":"Note", "caption":"note"}, {"id":"contact", "icon":"img/allinone.gif", "iconPos":"-48px top", "tips":"Contact", "caption":"contact"}])
                .setLeft(0)
                .setTop(0)
                .setBarHAlign("right")
                .setBarSize("28")
                .onItemSelected("_buttonviews4_onitemselected")
            , 'before');
            
            host.buttonviews4.append((new linb.UI.Panel)
                .host(host,"panelbar4")
                .setLeft(0)
                .setTop(0)
                .setZIndex(1)
                .setCaption("Email")
            , 'email');
            
            host.panelbar4.append((new linb.UI.TreeBar)
                .host(host,"treebar5")
                .setItems([{"id":"a", "caption":"Personal Folder", "icon":"img/allinone.gif", "iconPos":"-128px top", "tips":"Personal Only", "sub":[{"id":"aa", "caption":"Inbox", "icon":"img/allinone.gif", "iconPos":"-16px top"}, {"id":"ab", "caption":"Sent Items", "icon":"img/allinone.gif", "iconPos":"-208px top"}, {"id":"ac", "caption":"Deleted Items", "icon":"img/allinone.gif", "iconPos":"-240px top"}]}, {"id":"b", "caption":"<font color=red><b>Inbox(6)</b></font>", "tips":"incoming messages go here", "icon":"img/allinone.gif", "iconPos":"-16px top"}, {"id":"c", "caption":"Outbox", "tips":"Sent items go here", "icon":"img/allinone.gif", "iconPos":"-112px top"}])
                .setLeft(0)
                .setTop(0)
                .setValue("")
                .onItemSelected("_treebar5_onitemselected")
            );
            
            host.buttonviews4.append((new linb.UI.Panel)
                .host(host,"panelbar12")
                .setLeft(0)
                .setTop(0)
                .setZIndex(1)
                .setCaption("Note")
            , 'note');
            
            host.panelbar12.append((new linb.UI.Group)
                .host(host,"group1")
                .setDock("top")
                .setHeight(170)
                .setCaption("Current View")
            );
            
            host.group1.append((new linb.UI.RadioBox)
                .host(host,"radiobox2")
                .setItems([{"id":"a", "caption":"Show note icons", "tips":"Show note icons"}, {"id":"b", "caption":"Notes List", "tips":"Show notes within a list"}, {"id":"c", "caption":"Other", "tips":"Other"}])
                .setDock("fill")
                .setLeft(30)
                .setTop(20)
            );
            
            host.layout4.append((new linb.UI.Panel)
                .host(host,"pnlContact")
                .setCaption("Bussiness & Contact ")
            , 'main');
            
            host.pnlContact.append((new linb.UI.Group)
                .host(host,"group3")
                .setLeft(20)
                .setTop(30)
                .setWidth(560)
                .setHeight(150)
                .setCaption("All Contact")
            );
            
            host.group3.append((new linb.UI.Panel)
                .host(host,"panelbar16")
                .setDock("none")
                .setLeft(20)
                .setTop(10)
                .setWidth(150)
                .setHeight(70)
                .setZIndex(1)
                .setHtml("<b>Balara</b><br>01-4567-890<br>kenny@sigmawidgets.com")
                .setCaption("Balara, Kenny")
                .setDragKey("contactkey")
            );
            
            host.group3.append((new linb.UI.Panel)
                .host(host,"panelbar17")
                .setDock("none")
                .setLeft(190)
                .setTop(10)
                .setWidth(150)
                .setHeight(70)
                .setZIndex(1)
                .setHtml("<b>Linda</b><br>01-3238-727<br>linda@abc.com")
                .setCaption("Linda, Wen")
                .setDragKey("contactkey")
            );
            
            host.group3.append((new linb.UI.Panel)
                .host(host,"panelbar18")
                .setDock("none")
                .setLeft(360)
                .setTop(10)
                .setWidth(150)
                .setHeight(70)
                .setZIndex(1)
                .setHtml("<b>Jim</b><br>01-6543-321<br>Jim@blabla.com")
                .setCaption("Jim, Stephen")
                .setDragKey("contactkey")
            );
            
            host.pnlContact.append((new linb.UI.Group)
                .host(host,"group4")
                .setLeft(20)
                .setTop(200)
                .setWidth(560)
                .setHeight(130)
                .setCaption("Drag customers to this box")
            );
            
            host.group4.append((new linb.UI.Pane)
                .host(host,"panel16")
                .setLeft(20)
                .setTop(10)
                .setWidth(150)
                .setHeight(80)
                .setHtml("Drag bussiness card over me")
                .setDropKeys("contactkey")
                .onDrop("_panel16_ondrop")
            );
            
            host.group4.append((new linb.UI.Pane)
                .host(host,"panel17")
                .setLeft(190)
                .setTop(10)
                .setWidth(150)
                .setHeight(80)
                .setHtml("Drag bussiness card over me")
                .setDropKeys("contactkey")
                .onDrop("_panel16_ondrop")
            );
            
            host.pnlContact.append((new linb.UI.Group)
                .host(host,"group5")
                .setLeft(20)
                .setTop(360)
                .setWidth(560)
                .setHeight(130)
                .setCaption("Drag venders here")
            );
            
            host.group5.append((new linb.UI.Pane)
                .host(host,"panel18")
                .setLeft(20)
                .setTop(10)
                .setWidth(150)
                .setHeight(80)
                .setHtml("Drag bussiness card over me")
                .setDropKeys("contactkey")
                .onDrop("_panel16_ondrop")
            );
            
            host.group5.append((new linb.UI.Pane)
                .host(host,"panel19")
                .setLeft(200)
                .setTop(10)
                .setWidth(150)
                .setHeight(80)
                .setHtml("Drag bussiness card over me")
                .setDropKeys("contactkey")
                .onDrop("_panel16_ondrop")
            );
            
            append((new linb.UI.ToolBar)
                .host(host,"toolbar7")
                .setItems([{"id":"toolSection1", "sub":[{"id":"toolNewMail", "caption":"New Mail", "tips":"New Mail Message", "icon":"img/allinone.gif", "iconPos":"-80px top"}], "caption":"toolSection1"}, {"id":"toolSection2", "sub":[{"id":"toolPrint", "tips":"print", "icon":"img/allinone.gif", "iconPos":"top left"}, {"id":"toolMove", "tips":"Move to folder", "icon":"img/allinone.gif", "iconPos":"-64px top"}, {"id":"toolDelete", "tips":"Delete", "icon":"img/allinone.gif", "iconPos":"-224px top"}], "caption":"toolSection2"}, {"id":"toolSection3", "sub":[{"id":"toolReply", "tips":"reply", "caption":"Reply", "icon":"img/allinone.gif", "iconPos":"-160px top"}, {"id":"toolReplyAll", "tips":"Reply to all", "caption":"Reply to All", "icon":"img/allinone.gif", "iconPos":"-176px top"}, {"id":"toolForward", "tips":"Forward", "caption":"Forward", "icon":"img/allinone.gif", "iconPos":"-112px top"}, {"id":"toolRendReceive", "tips":"Rend / Receive", "caption":"Rend/Receive", "icon":"img/allinone.gif", "iconPos":"-192px top"}], "caption":"toolSection3"}])
                .setDockOrder("3")
                .onClick("_toolbar7_onclick")
            );
            
            append((new linb.UI.MenuBar)
                .host(host,"menubar2")
                .setItems([{"id":"menFile", "caption":"File", "tips":"File", "sub":[{"id":"menFileNew", "caption":"New", "sub":[{"id":"menFileNewMailMessage", "caption":"Main Message", "icon":"img/allinone.gif", "iconPos":"-80px top"}, {"id":"menFileNewAppointment", "caption":"Appointment", "icon":"img/allinone.gif", "iconPos":"-256px top"}]}, {"id":"menFileOpen", "caption":"Open"}, {"id":"menFileOpen", "caption":"Open"}, {"id":"menFileDataFile", "caption":"Data File Management..."}, {"id":"menFileClose", "caption":"Close All Items"}, {"id":"menFileExport", "caption":"Export and import"}, {"id":"menFileWorkOffline", "caption":"Work Offline"}, {"id":"menPrint", "caption":"Print ...", "icon":"img/allinone.gif", "iconPos":"top left"}, {"id":"menFileExit", "caption":"Exit"}]}, {"id":"menEdit", "caption":"Edit", "sub":[{"id":"idNotImplented", "caption":"Not Implemented"}]}, {"id":"menView", "caption":"View", "sub":[{"id":"idNotImplented", "caption":"Not Implemented"}]}])
                .setHandler(false)
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        events:{
            "onReady":"_onReady"
        }, 
        _onReady:function(page, threadid){
            SPA=page;
            //select email button
            SPA.pnlNote.setDisplay("none");
            SPA.pnlContact.setDisplay("none");
            SPA.buttonviews4.setValue('email',true);
            SPA.treebar5.fireItemClickEvent('b');
        }, 
        _treebar5_onitemselected:function (profile, item, src) {
            this.pnlEmail.setCaption("Emails in " + item.caption);
            if(item.id=="b"){
                //this.ajax1.request();
                linb.Ajax('Data/inbox.js','a=1&b=2',this._ajax1_onrequestok).start();
            }else{
                linb.message("You selected " + item.caption);
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
            var id=item.id;
            this.pnlEmail.setDisplay(id=="email"?"":"none");
            this.pnlNote.setDisplay(id=="note"?"":"none");
            this.pnlContact.setDisplay(id=="contact"?"":"none");
        }, 
        _button11_onclick:function (profile, e, value) {
            this.popmenu5.pop(profile.root);
            this.popmenu5.$target = profile;
        }, 
        _panel16_ondrop:function (profile, e, node, key, data, item) {
            var target = profile.boxing(),
                source = data.profile.boxing(),
                para = source.getPanelPara(data.domId),
                children = source.getPanelChildren(data.domId)

            source.removePanel(data.domId);
            target.addPanel(para, children, item);

        }, 
        _toolbar7_onclick:function (profile, id, groupid, src) {
            if(id == "toolNewMail"){
                this.popmenu5.pop(profile.root);
                this.popmenu5.$target = profile;
            }
        }
    }
});