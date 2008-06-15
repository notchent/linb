Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Input","linb.UI.Panel","linb.UI.TreeGrid","linb.UI.Button"],
        _input3_onhotkey:function (profile,  key, control, shift, alt, e) {
            this.treegrid2.insertRows([{id:_.id(), cells:[
                e.type, e.keyCode,  e.charCode, key, !!control, !!shift, !!alt
            ]}],'','',true);
        },
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Input)
            .host(t,"input3")
            .setLeft(270)
            .setTop(40)
            .beforeNextFocus("_input3_beforenextfocus")
            .onHotKeydown("_input3_onhotkey")
            .onHotKeypress("_input3_onhotkey")
            .onHotKeyup("_input3_onhotkey")
            );

            f(
            (new u.Div)
            .host(t,"div9")
            .setLeft(100)
            .setTop(42)
            .setWidth(162)
            .setHeight(20)
            .setHtml("Type something in the Input:")
            );

            f(
            (new u.Button)
            .host(t,"button5")
            .setLeft(460)
            .setTop(460)
            .setCaption("Clear output")
            .onClick("_button5_onclick")
            );

            f(
            (new u.Panel)
            .host(t,"panel3")
            .setLeft(90)
            .setTop(110)
            .setWidth(638)
            .setHeight(330)
            .setCustomAppearance({"KEY":"border:solid 1px"})
            );

            t.panel3.attach(
            (new u.TreeGrid)
            .host(t,"treegrid2")
            .setColDragable(false)
            .setRowDragable(false)
            .setColSortable(false)
            .setRowResizer(false)
            .setColResizer(false)
            .setEditable(false)
            .setHeader([{"id":"type","caption":"type","type":"label","width":100},{"id":"kcode","caption":"keyCode","type":"label","width":80},{"id":"ccode","caption":"charCode","type":"label","width":80},{"id":"key","caption":"key","type":"label","width":80},{"id":"contrl","caption":"contrl","type":"checkbox","width":80},{"id":"shift","caption":"shift","type":"checkbox","width":80},{"id":"alt","caption":"alt","type":"checkbox","width":80}])
            .setRows([])
            .setRowDragKey("ch")
            .setColDragKey("ch")
            );

            f(
            (new u.Input)
            .host(t,"input2")
            .setLeft(430)
            .setTop(10)
            .setHeight(90)
            .setInputArea("textarea")
            .beforeNextFocus("_input3_beforenextfocus")
            .onHotKeydown("_input3_onhotkey")
            .onHotKeypress("_input3_onhotkey")
            .onHotKeyup("_input3_onhotkey")
            );

            return n;
            // ]]code created by designer
        },
        _button5_onclick:function (profile, e, value) {
            this.treegrid2.resetContent();
        },
        _input3_beforenextfocus:function (profile, e, src) {
            return false;
        }
    }
});