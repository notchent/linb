
Class('App', 'linb.Com',{
    Instance:{
        //Com events
        events:{}, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Tabs)
                .host(host,"tabs2")
                .setItems([{"id":"1", "caption":"page 1", "image":"img/demo.gif", "landBtn":true, "closeBtn":true}, {"id":"2", "caption":"page 2", "image":"img/demo.gif", "landBtn":true, "closeBtn":true}, {"id":"3", "caption":"page 3", "closeBtn":true}, {"id":"5", "caption":"page 4"}])
                .setLeft(0)
                .setTop(0)
                .setValue("1")
            );
            
            host.tabs2.append((new linb.UI.Dialog)
                .host(host,"dialog16")
                .setLeft(262)
                .setTop(153)
                .setZIndex("10")
                .setCaption("dialog16")
                .setImage("img/demo.gif")
                .setOptBtn(true)
                .setLandBtn(true)
            , '2');
            
            host.dialog16.append((new linb.UI.Input)
                .host(host,"input2")
                .setLeft(50)
                .setTop(50)
            );
            
            host.dialog16.append((new linb.UI.Button)
                .host(host,"button18")
                .setLeft(50)
                .setTop(80)
                .setCaption("button18")
            );
            
            host.dialog16.append((new linb.UI.List)
                .host(host,"list7")
                .setItems([{"id":"item a", "caption":"item a"}, {"id":"item b", "caption":"item b"}, {"id":"item c", "caption":"item c"}, {"id":"item d", "caption":"item d"}])
                .setLeft(51)
                .setTop(110)
                .setHeight(70)
            );
            
            host.tabs2.append((new linb.UI.PageBar)
                .host(host,"pagebar1")
                .setLeft(50)
                .setTop(80)
                .setValue("1:100:200")
            , '3');
            
            host.tabs2.append((new linb.UI.Gallery)
                .host(host,"gallery1")
                .setItems([{"id":"a", "caption":"item a", "image":"img/demo.gif"}, {"id":"b", "caption":"item b", "image":"img/demo.gif"}, {"id":"c", "caption":"item c", "image":"img/demo.gif"}])
                .setLeft(400)
                .setTop(390)
                .setHeight(70)
            , '3');
            
            host.tabs2.append((new linb.UI.TreeBar)
                .host(host,"treebar3")
                .setItems([{"id":"a", "caption":"tree item a", "image":"img/demo.gif"}, {"id":"b", "caption":"tree item b", "image":"img/demo.gif"}, {"id":"c", "caption":"tree item c", "image":"img/demo.gif"}, {"id":"d", "caption":"tree d", "sub":["sub d a", "sub d b", "sub d c"]}, {"id":"e", "group":true, "caption":"tree group e", "sub":["sub e 1", "sub e 2"]}, {"id":"f", "group":true, "caption":"tree group f", "sub":["sub f 1", "sub f 2"]}])
                .setDock("none")
                .setLeft(400)
                .setTop(150)
                .setWidth(230)
                .setHeight(200)
            , '3');
            
            host.tabs2.append((new linb.UI.MenuBar)
                .host(host,"menubar2")
                .setItems([{"id":"file", "sub":["a", "b", "c"], "caption":"file"}, {"id":"tools", "sub":["aa", "bb"], "caption":"tools"}])
            , '3');
            
            host.tabs2.append((new linb.UI.ToolBar)
                .host(host,"toolbar20")
                .setItems([{"id":"file", "sub":[{"id":"a", "caption":"a", "image":"img/demo.gif"}, {"id":"b", "caption":"b", "image":"img/demo.gif"}], "caption":"file"}, {"id":"tools", "sub":[{"id":"aa", "caption":"aa"}, {"id":"b b", "caption":"b b"}], "caption":"tools"}])
            , '3');
            
            host.tabs2.append((new linb.UI.LinkList)
                .host(host,"linklist1")
                .setItems([{"id":"a", "caption":"link list a"}, {"id":"b", "caption":"link list v"}, {"id":"c", "caption":"link list c"}])
                .setLeft(370)
                .setTop(80)
                .setWidth(350)
                .setHeight(30)
            , '3');
            
            host.tabs2.append((new linb.UI.FoldingList)
                .host(host,"foldinglist1")
                .setItems([{"id":"a", "caption":"caption a", "title":"title a"}, {"id":"b", "caption":"caption b", "title":"title b"}, {"id":"c", "caption":"caption c", "title":"title c"}])
                .setLeft(30)
                .setTop(130)
                .setWidth(226)
                .setHeight(106)
                .setCmds([])
            , '3');
            
            host.tabs2.append((new linb.UI.Pane)
                .host(host,"pane18")
                .setLeft(20)
                .setTop(20)
                .setWidth(60)
                .setHtml("Panel")
            , '2');
            
            host.tabs2.append((new linb.UI.Panel)
                .host(host,"panel2")
                .setDock("none")
                .setLeft(120)
                .setTop(20)
                .setWidth(140)
                .setZIndex(1)
                .setCaption("panel sample")
                .setOptBtn(true)
                .setToggleBtn(true)
                .setCloseBtn(true)
                .setLandBtn(true)
            , '2');
            
            host.panel2.append((new linb.UI.Link)
                .host(host,"link3")
                .setLeft(10)
                .setTop(30)
                .setWidth(120)
                .setHeight(19)
                .setCaption("link in the panel")
            );
            
            host.tabs2.append((new linb.UI.Block)
                .host(host,"block1")
                .setLeft(260)
                .setTop(20)
            , '2');
            
            host.tabs2.append((new linb.UI.Layout)
                .host(host,"layout4")
                .setItems([{"id":"a", "min":10, "pos":"before", "size":40, "locked":false, "hide":false, "cmd":true, "caption":"a"}, {"id":"main", "min":10, "caption":"main", "size":40}, {"id":"b", "pos":"after", "min":10, "size":37, "locked":false, "hide":false, "cmd":false, "caption":"b"}])
                .setDock("none")
                .setLeft(280)
                .setTop(20)
                .setWidth(170)
                .setHeight(140)
            , '2');
            
            host.layout4.append((new linb.UI.Label)
                .host(host,"label3")
                .setLeft(20)
                .setTop(10)
                .setCaption("label3")
            , 'a');
            
            host.layout4.append((new linb.UI.Link)
                .host(host,"link4")
                .setLeft(40)
                .setTop(20)
                .setCaption("link4")
            , 'main');
            
            host.layout4.append((new linb.UI.Link)
                .host(host,"link5")
                .setLeft(50)
                .setTop(10)
                .setCaption("link5")
            , 'b');
            
            host.tabs2.append((new linb.UI.Calendar)
                .host(host,"calendar1")
                .setDock("none")
                .setLeft(60)
                .setTop(50)
                .setWidth(320)
                .setHeight(160)
            , '5');
            
            host.tabs2.append((new linb.UI.Stacks)
                .host(host,"stacks1")
                .setItems([{"id":"a", "caption":"stack a", "landBtn":true, "closeBtn":true, "image":"img/demo.gif"}, {"id":"b", "caption":"stack b", "landBtn":true, "closeBtn":true, "image":"img/demo.gif"}, {"id":"c", "caption":"stack c"}])
                .setDock("none")
                .setLeft(520)
                .setTop(10)
                .setValue("a")
            , '2');
            
            host.tabs2.append((new linb.UI.ButtonViews)
                .host(host,"buttonviews2")
                .setItems([{"id":"a", "caption":"buttonview a", "image":"img/demo.gif", "closeBtn":true, "landBtn":true}, {"id":"b", "caption":"buttonview b", "image":"img/demo.gif", "closeBtn":true, "landBtn":true}, {"id":"c", "caption":"buttonview c"}])
                .setDock("none")
                .setLeft(20)
                .setTop(190)
                .setWidth(380)
                .setHeight(80)
                .setBarSize("30")
                .setValue("a")
            , '2');
            
            host.tabs2.append((new linb.UI.TimeLine)
                .host(host,"timeline1")
                .setItems([{"id":"$", "caption":"task", "from":1227243600000, "to":1228089600000}])
                .setLeft(30)
                .setTop(260)
                .setCloseBtn(true)
                .setOptBtn(true)
            , '5');
            
            host.tabs2.append((new linb.UI.IconList)
                .host(host,"iconlist2")
                .setItems([{"id":"a", "caption":"a", "image":"img/demo.gif"}, {"id":"b", "caption":"b", "image":"img/demo.gif"}, {"id":"c", "caption":"c", "image":"img/demo.gif"}])
                .setLeft(30)
                .setTop(310)
                .setHeight(80)
            , '2');
            
            host.tabs2.append((new linb.UI.TreeGrid)
                .host(host,"treegrid2")
                .setDock("none")
                .setLeft(40)
                .setTop(290)
                .setWidth(320)
                .setHeader([{"id":"col1", "width":80, "type":"label", "caption":"col1"}, {"id":"col2", "width":80, "type":"label", "caption":"col2"}, {"id":"col3", "width":80, "type":"label", "caption":"col3"}, {"id":"col4", "width":80, "type":"label", "caption":"col4"}])
                .setRows([{"cells":[{"value":"row1 col1"}, {"value":"row1 col2"}, {"value":"row1 col3"}, {"value":"row1 col4"}], "id":"a"}, {"cells":[{"value":"row2 col1"}, {"value":"row2 col2"}, {"value":"row2 col3"}, {"value":"row2 col4"}], "id":"b"}, {"cells":[{"value":"row3 col1"}, {"value":"row3 col2"}, {"value":"row3 col3"}, {"value":"row3 col4"}], "sub":[["sub1", "sub2", "sub3", "sub4"]], "id":"c"}])
            , '3');
            
            host.tabs2.append((new linb.UI.Label)
                .host(host,"label10")
                .setLeft(80)
                .setTop(20)
                .setWidth(70)
                .setCaption("label")
                .setImage("img/demo.gif")
            , '1');
            
            host.tabs2.append((new linb.UI.TextEditor)
                .host(host,"texteditor4")
                .setLeft(20)
                .setTop(50)
                .setWidth(110)
                .setHeight(100)
                .setValue("textEditor")
            , '1');
            
            host.tabs2.append((new linb.UI.RadioBox)
                .host(host,"radiobox1")
                .setItems([{"id":"1", "image":"img/demo.gif", "caption":"radio 1"}, {"id":"2", "image":"img/demo.gif", "caption":"radio 2"}, {"id":"3", "caption":"radio 3"}, {"id":"4", "caption":"radio 4"}, {"id":"5", "caption":"radio 5"}])
                .setLeft(30)
                .setTop(370)
            , '1');
            
            host.tabs2.append((new linb.UI.Poll)
                .host(host,"poll1")
                .setItems([{"id":"1", "caption":"option 1", "percent":0.2}, {"id":"2", "caption":"option 2", "toggle":true, "percent":0.5}, {"id":"3", "caption":"option 3", "toggle":true, "percent":0.8}, {"id":"4", "caption":"option 4", "percent":0.4}, {"id":"5", "caption":"option 5", "percent":0.9}])
                .setLeft(170)
                .setTop(370)
                .setWidth(310)
            , '1');
            
            host.tabs2.append((new linb.UI.Div)
                .host(host,"div11")
                .setLeft(20)
                .setTop(10)
                .setWidth(40)
                .setHeight(40)
                .setHtml("div")
            , '1');
            
            host.tabs2.append((new linb.UI.Group)
                .host(host,"group1")
                .setLeft(510)
                .setTop(440)
                .setWidth(200)
                .setCaption("group")
            , '1');
            
            host.group1.append((new linb.UI.Link)
                .host(host,"link2")
                .setLeft(40)
                .setTop(30)
                .setCaption("link2")
            );
            
            host.group1.append((new linb.UI.Button)
                .host(host,"button11")
                .setLeft(90)
                .setTop(30)
                .setWidth(90)
                .setCaption("button11")
            );
            
            host.tabs2.append((new linb.UI.CheckBox)
                .host(host,"checkbox1")
                .setLeft(430)
                .setTop(20)
                .setCaption("checkbox")
                .setImage("img/demo.gif")
            , '1');
            
            host.tabs2.append((new linb.UI.Input)
                .host(host,"input3")
                .setLeft(580)
                .setTop(20)
                .setWidth(140)
                .setValue("input")
            , '1');
            
            host.tabs2.append((new linb.UI.Button)
                .host(host,"button7")
                .setLeft(270)
                .setTop(20)
                .setCaption("button")
                .setImage("img/demo.gif")
            , '1');
            
            host.tabs2.append((new linb.UI.ProgressBar)
                .host(host,"progressbar1")
                .setLeft(430)
                .setTop(60)
                .setValue(80)
            , '1');
            
            host.tabs2.append((new linb.UI.Range)
                .host(host,"range1")
                .setLeft(430)
                .setTop(110)
            , '1');
            
            host.tabs2.append((new linb.UI.TimePicker)
                .host(host,"timepicker1")
                .setLeft(30)
                .setTop(200)
            , '1');
            
            host.tabs2.append((new linb.UI.DatePicker)
                .host(host,"datepicker1")
                .setLeft(280)
                .setTop(200)
            , '1');
            
            host.tabs2.append((new linb.UI.ColorPicker)
                .host(host,"colorpicker1")
                .setLeft(520)
                .setTop(200)
            , '1');
            
            host.tabs2.append((new linb.UI.List)
                .host(host,"list2")
                .setItems([{"id":"1", "image":"img/demo.gif", "caption":"1"}, {"id":"2", "image":"img/demo.gif", "caption":"2"}, {"id":"3", "caption":"List"}])
                .setLeft(170)
                .setTop(60)
                .setHeight(100)
            , '1');
            
            host.tabs2.append((new linb.UI.ComboInput)
                .host(host,"comboinput5")
                .setLeft(300)
                .setTop(60)
                .setValue("ComboInput")
            , '1');
            
            host.tabs2.append((new linb.UI.ComboInput)
                .host(host,"comboinput6")
                .setLeft(300)
                .setTop(90)
                .setHeight(70)
                .setType("colorpicker")
                .setValue("#00FF00")
            , '1');
            
            host.tabs2.append((new linb.UI.Link)
                .host(host,"link1")
                .setLeft(190)
                .setTop(20)
                .setCaption("link")
            , '1');
            
            append((new linb.UI.Pane)
                .host(host,"pane4")
                .setDock("top")
                .setHeight(50)
            );
            
            host.pane4.append((new linb.UI.Button)
                .host(host,"btnDefault")
                .setLeft(320)
                .setTop(17)
                .setCaption("default")
                .onClick("btndefault_clk")
            );
            
            host.pane4.append((new linb.UI.Button)
                .host(host,"btnAqua")
                .setLeft(460)
                .setTop(17)
                .setCaption("aqua")
                .onClick("_btnaqua_clk")
            );
            
            host.pane4.append((new linb.UI.Button)
                .host(host,"btnVista")
                .setLeft(600)
                .setTop(17)
                .setCaption("vista")
                .onClick("_btnvista_clk")
            );
            
            host.pane4.append((new linb.UI.Label)
                .host(host,"label6")
                .setLeft(23)
                .setTop(17)
                .setWidth(280)
                .setHeight(30)
                .setCaption("Click here to change the theme =>")
                .setShadowText(true)
                .setFontSize("14px")
                .setFontWeight("bold")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        btndefault_clk:function(){
            linb.UI.setTheme('default');
        }, 
        _btnaqua_clk:function(){
            linb.UI.setTheme('aqua');
        }, 
        _btnvista_clk:function(){
            linb.UI.setTheme('vista');
        }
    }
});