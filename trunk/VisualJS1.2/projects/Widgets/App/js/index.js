Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Range","linb.UI.Edge","linb.UI.Shadow","linb.UI.MenuBar","linb.UI.ToolBar","linb.UI.Tabs","linb.UI.Panel","linb.UI.PanelBar","linb.UI.Stacks","linb.UI.Group","linb.UI.Input","linb.UI.Label","linb.UI.Button","linb.UI.ComboInput","linb.UI.RadioBox","linb.UI.CheckBox","linb.UI.List","linb.UI.Layout","linb.UI.TreeBar","linb.UI.TreeGrid","linb.UI.Gallery","linb.UI.ButtonViews","linb.UI.TextEditor","linb.UI.Dialog","linb.UI.Block","linb.UI.Div"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.MenuBar)
            .host(t,"menubar2")
            .setItems([{"id":"file","caption":"File","sub":[{"id":"newproject","caption":"New Project","icon":"img/app.gif","iconPos":"-32px top"},{"id":"openproject","caption":"Open Project","add":"Ctrl+Alt+O","icon":"img/App.gif","iconPos":"-48px top"},{"id":"closeproject","caption":"Close Project"},{"type":"split"},{"id":"save","caption":"Save","icon":"img/App.gif","iconPos":"-80px top"},{"id":"saveall","caption":"Save All","add":"Ctrl+Alt+S","icon":"img/App.gif","iconPos":"-96px top"}]},{"id":"tools","caption":"Tools","sub":[{"id":"command","caption":"Command Window","icon":"img/App.gif","iconPos":"-112px top"},{"id":"spy","caption":"Components Spy","icon":"img/App.gif","iconPos":"-128px top"}]},{"id":"build","caption":"Build","sub":[{"id":"debug","caption":"Debug","icon":"img/App.gif","iconPos":"top left","add":"F9"},{"id":"release","caption":"Release","icon":"img/App.gif","iconPos":"-64px top","add":"Ctrl+F9"},{"type":"split"},{"id":"setting","caption":"Build Setting"}]},{"id":"help","caption":"Help","sub":[{"id":"Forum","caption":"forum"},{"type":"split"},{"id":"License","caption":"License","sub":[{"id":"gpllicense","caption":"gpllicense"},{"id":"clicense","caption":"clicense"},{"id":"purchase","caption":"purchase"}]},{"type":"split"},{"id":"about","caption":"About"}]}])
            );
            
            f(
            (new u.ToolBar)
            .host(t,"toolbar8")
            .setDockOrder("2")
            .setItems([{"id":"only","sub":[{"id":"newproject","icon":"img/app.gif","iconPos":"-32px top","tips":"newp"},{"id":"openproject","icon":"img/app.gif","iconPos":"-48px top","tips":"open"},{"type":"split"},{"id":"saveall","icon":"img/app.gif","iconPos":"-96px top","tips":"saveall"},{"type":"split"},{"id":"debug","icon":"img/app.gif","iconPos":"top left","tips":"debug"},{"id":"release","icon":"img/app.gif","iconPos":"-64px top","tips":"release"},{"type":"split"},{"id":"download","tips":"$app.menu.download","icon":"img/app.gif","iconPos":"-144px 0px"},{"id":"flash","icon":"img/app.gif","iconPos":"-128px -17px","tips":"flash"},{"id":"demo","icon":"img/app.gif","iconPos":"-48px -64px ","tips":"demo"},{"type":"split"},{"id":"ec","icon":"img/app.gif","iconPos":"-98px -16px","tips":"ec"}]}])
            );
            
            f(
            (new u.Tabs)
            .host(t,"tabs2")
            .setLeft(null)
            .setTop(null)
            .setItems([{"id":"a","caption":"itema","icon":"img/app.gif","iconPos":"left top"},{"id":"b","caption":"itemb","icon":"img/app.gif","iconPos":"left -16px"},{"id":"c","caption":"itemc","icon":"img/app.gif","iconPos":"left -32px"}])
            .setValue("a")
            );
            
            t.tabs2.attach(
            (new u.Panel)
            .host(t,"panel9")
            .setLeft(571)
            .setTop(31)
            .setWidth(180)
            .setHeight(280)
            , 'b');
            
            t.panel9.attach(
            (new u.PanelBar)
            .host(t,"panelbar3")
            .setLeft(0)
            .setTop(0)
            .setZIndex(1)
            .setCaption("panelbar3")
            );
            
            t.panelbar3.attach(
            (new u.Stacks)
            .host(t,"stacks1")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setValue("b")
            );
            
            t.stacks1.attach(
            (new u.TreeGrid)
            .host(t,"treegrid3")
            .setHeader([{"id":"col1","caption":"col1","type":"input","width":50},{"id":"col2","caption":"col2","type":"input","width":80}])
            .setRows([{"id":"row1","cells":[{"value":"cell11"},{"value":"cell12"}]},{"id":"row2","cells":[{"value":"cell21","type":"label"},{"value":"cell22"}],"sub":[{"id":"row21","cells":["cell31",{"value":"cell32","type":"number"}]}]}])
            , 'c');
            
            t.stacks1.attach(
            (new u.List)
            .host(t,"list5")
            .setLeft(80)
            .setTop(60)
            .setItems([{"id":"a","caption":"itema","icon":"img/app.gif","iconPos":"left top"},{"id":"b","caption":"itemb","icon":"img/app.gif","iconPos":"left -16px"},{"id":"c","caption":"itemc","icon":"img/app.gif","iconPos":"left -32px"},{"id":"d","caption":"itemd","icon":"img/app.gif","iconPos":"-16px top"},{"id":"e","caption":"iteme","icon":"img/app.gif","iconPos":"-16px -16px"},{"id":"f","caption":"itemf","icon":"img/app.gif","iconPos":"-16px -32px"}])
            .setDock("fill")
            , 'a');
            
            t.stacks1.attach(
            (new u.RadioBox)
            .host(t,"radiobox1")
            .setLeft(70)
            .setTop(60)
            .setItems([{"id":"a","caption":"itema","icon":"img/app.gif","iconPos":"left top"},{"id":"b","caption":"itemb","icon":"img/app.gif","iconPos":"left -16px"},{"id":"c","caption":"itemc","icon":"img/app.gif","iconPos":"left -32px"},{"id":"d","caption":"itemd","icon":"img/app.gif","iconPos":"-16px top"},{"id":"e","caption":"iteme","icon":"img/app.gif","iconPos":"-16px -16px"},{"id":"f","caption":"itemf","icon":"img/app.gif","iconPos":"-16px -32px"}])
            .setDock("fill")
            , 'b');
            
            t.tabs2.attach(
            (new u.Group)
            .host(t,"group1")
            .setLeft(81)
            .setTop(null)
            .setWidth(440)
            .setHeight(391)
            .setCaption("group1")
            .setIcon("img/app.gif")
            , 'b');
            
            t.group1.attach(
            (new u.Input)
            .host(t,"input4")
            .setLeft(30)
            .setTop(50)
            );
            
            t.group1.attach(
            (new u.Label)
            .host(t,"label18")
            .setLeft(230)
            .setTop(10)
            .setCaption("label18")
            .setWidth(130)
            .setIcon("img/app.gif")
            .setIconPos("-32px -32px")
            );
            
            t.group1.attach(
            (new u.CheckBox)
            .host(t,"checkbox1")
            .setLeft(230)
            .setTop(100)
            .setCaption("checkbox1")
            .setIcon("img/app.gif")
            );
            
            t.group1.attach(
            (new u.ComboInput)
            .host(t,"comboinput15")
            .setLeft(230)
            .setTop(330)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setType("popbox")
            );
            
            t.group1.attach(
            (new u.Input)
            .host(t,"input7")
            .setLeft(30)
            .setTop(100)
            .setValue("password")
            .setType("password")
            );
            
            t.group1.attach(
            (new u.ComboInput)
            .host(t,"comboinput11")
            .setLeft(230)
            .setTop(170)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setReadonly(true)
            .setType("listbox")
            );
            
            t.group1.attach(
            (new u.ComboInput)
            .host(t,"comboinput12")
            .setLeft(230)
            .setTop(210)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setType("getter")
            );
            
            t.group1.attach(
            (new u.ComboInput)
            .host(t,"comboinput13")
            .setLeft(230)
            .setTop(250)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setType("helpinput")
            );
            
            t.group1.attach(
            (new u.ComboInput)
            .host(t,"comboinput17")
            .setLeft(230)
            .setTop(130)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            );
            
            t.group1.attach(
            (new u.Button)
            .host(t,"button11")
            .setLeft(230)
            .setTop(40)
            .setCaption("button")
            .setIcon("img/app.gif")
            );
            
            t.group1.attach(
            (new u.Div)
            .host(t,"div25")
            .setLeft(30)
            .setTop(270)
            .setWidth(90)
            .setHeight(null)
            .setHtml("textArea")
            );
            
            t.group1.attach(
            (new u.Div)
            .host(t,"div26")
            .setLeft(30)
            .setTop(30)
            .setWidth(null)
            .setHeight(20)
            .setHtml("normal")
            );
            
            t.group1.attach(
            (new u.Div)
            .host(t,"div27")
            .setLeft(30)
            .setTop(80)
            .setWidth(null)
            .setHeight(20)
            .setHtml("password")
            );
            
            t.group1.attach(
            (new u.Div)
            .host(t,"div28")
            .setLeft(30)
            .setTop(130)
            .setWidth(80)
            .setHeight("20")
            .setHtml("number only")
            );
            
            t.group1.attach(
            (new u.Div)
            .host(t,"div29")
            .setLeft(30)
            .setTop(180)
            .setWidth(null)
            .setHeight(20)
            .setHtml("URL only")
            );
            
            t.group1.attach(
            (new u.Div)
            .host(t,"div30")
            .setLeft(30)
            .setTop(220)
            .setWidth(null)
            .setHeight(20)
            .setHtml("char only")
            );
            
            t.group1.attach(
            (new u.Input)
            .host(t,"input8")
            .setLeft(30)
            .setTop(150)
            .setValueFormat("^-?(\\d\\d*\\.\\d*$)|(^-?\\d\\d*$)|(^-?\\.\\d\\d*$)")
            );
            
            t.group1.attach(
            (new u.Input)
            .host(t,"input9")
            .setLeft(30)
            .setTop(200)
            .setValueFormat("^(http|https|ftp)\\:\\/\\/[a-z0-9\\-\\.]+\\.[a-z]{2,3}(:[a-z0-9]*)?\\/?([a-z0-9\\-\\._\\?\\,\\'\\/\\\\\\+&amp;%\\$#\\=~])*$")
            );
            
            t.group1.attach(
            (new u.Input)
            .host(t,"input6")
            .setLeft(30)
            .setTop(290)
            .setHeight(60)
            .setInputArea("textarea")
            );
            
            t.group1.attach(
            (new u.ComboInput)
            .host(t,"comboinput14")
            .setLeft(230)
            .setTop(290)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setType("cmdbox")
            );
            
            t.group1.attach(
            (new u.Input)
            .host(t,"input10")
            .setLeft(30)
            .setTop(240)
            .setValueFormat("^[a-zA-Z]*$")
            );
            
            t.group1.attach(
            (new u.Button)
            .host(t,"button10")
            .setLeft(230)
            .setTop(70)
            .setCaption("toggle")
            .setIcon("img/app.gif")
            .setToggleKey("toggle")
            );
            
            t.tabs2.attach(
            (new u.ButtonViews)
            .host(t,"buttonviews3")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"}])
            .setHandleDock("left")
            .setValue("a")
            .setCustomAppearance({"PANEL":"border-top:0;border-right:0;border-bottom:0"})
            , 'c');
            
            t.buttonviews3.attach(
            (new u.Block)
            .host(t,"block2")
            .setLeft(221)
            .setTop(61)
            .setWidth(401)
            .setHeight(241)
            .setBorder(true)
            , 'a');
            
            t.block2.attach(
            (new u.List)
            .host(t,"list7")
            .setLeft(30)
            .setTop(30)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setValue("b")
            );
            
            t.buttonviews3.attach(
            (new u.Group)
            .host(t,"group3")
            .setLeft(140)
            .setTop(70)
            .setWidth(291)
            .setHeight(161)
            .setCaption("group3")
            , 'b');
            
            t.group3.attach(
            (new u.RadioBox)
            .host(t,"radiobox3")
            .setLeft(30)
            .setTop(30)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setValue("c")
            );
            
            t.tabs2.attach(
            (new u.Layout)
            .host(t,"layout6")
            .setLeft(null)
            .setTop(null)
            .setItems([{"id":"before","pos":"before","locked":false,"size":200,"min":50,"max":400,"hide":false,"cmd":true},{"id":"main","min":10}])
            .setType("horizontal")
            , 'a');
            
            t.layout6.attach(
            (new u.TreeBar)
            .host(t,"treebar5")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"itema","tips":"item a","icon":"img/app.gif","iconPos":"left  top","sub":[{"id":"aa","caption":"suba","icon":"img/app.gif","iconPos":"left  -16px"},{"id":"ab","caption":"subb","icon":"img/app.gif","iconPos":"left  -32px"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","icon":"img/app.gif","iconPos":"-16px  -16px"},{"id":"d","caption":"itemd","tips":"item d","group":true,"iniFold":false,"icon":"img/app.gif","iconPos":"-32px  -48px","sub":[{"id":"da","caption":"suba","icon":"img/app.gif","iconPos":"-48px  -48px"},{"id":"db","caption":"subb","icon":"img/app.gif","iconPos":"-64px  -48px"},{"id":"dc","caption":"subc"}]}])
            .setCustomAppearance({"ITEMS":"border:0"})
            , 'before');
            
            t.layout6.attach(
            (new u.TreeGrid)
            .host(t,"treegrid3")
            .setHeader([{"id":"col1","caption":"col1","type":"input","width":50},{"id":"col2","caption":"col2","type":"number","format":"^-?\\d\\d*$","width":80},{"id":"col3","caption":"col3","type":"checkbox","width":40}])
            .setRows([{"id":"row1","cells":[{"value":"cell11"},{"value":1},{"value":false}]},{"id":"row2","cells":[{"value":"cell21"},{"value":2},{"value":false}]},{"id":"row3","cells":[{"value":"cell31"},{"value":3},{"value":false}]},{"id":"row4","cells":[{"value":"cell41"},{"value":4},{"value":false}]},{"id":"row5","cells":[{"value":"cell51"},{"value":5},{"value":false}],"sub":[{"id":"row6","cells":["in61",6,false]},{"id":"row7","cells":["in71",7,false]},{"id":"row8","cells":["in81",8,false]},{"id":"row9","cells":["in91",9,false]}]}])
            , 'main');
            
            t.tabs2.attach(
            (new u.Range)
            .host(t,"range1")
            .setValue("10:80")
            .setLeft(78)
            .setTop(409)
            , 'b');
            
            f(
            (new u.Dialog)
            .host(t,"dialog")
            .setLeft(280)
            .setTop(200)
            .setWidth(350)
            .setHeight(240)
            .setCaption("dialog6")
            .setIcon("img/app.gif")
            );
            
            t.dialog.attach(
            (new u.Gallery)
            .host(t,"gallery3")
            .setDock("fill")
            .setLeft(null)
            .setTop(null)
            .setItems([{"id":"a","caption":"itema","icon":"img/app.gif","iconPos":"left top"},{"id":"b","caption":"itemb","icon":"img/app.gif","iconPos":"left -16px"},{"id":"c","caption":"itemc","icon":"img/app.gif","iconPos":"left -32px"},{"id":"d","caption":"itemd","icon":"img/app.gif","iconPos":"-16px top"},{"id":"e","caption":"iteme","icon":"img/app.gif","iconPos":"-16px -16px"},{"id":"f","caption":"itemf","icon":"img/app.gif","iconPos":"-16px -32px"}])
            .setItemWidth("48")
            .setItemHeight("48")
            .setCustomAppearance({"BORDER":"border-color:#fff #fff #ACA899 #ACA899;","ITEMS":"background:#fff"})
            );
            
            return n;
            // ]]code created by designer
        }
    }
});