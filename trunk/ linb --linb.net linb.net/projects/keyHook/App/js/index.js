Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Input","linb.UI.Panel","linb.UI.TreeGrid","linb.UI.Button","linb.UI.Div"],
        _input3_onhotkey:function (profile,  key, control, shift, alt, e) {
            this.treegrid2.insertRows([{id:_.id(), cells:[
                e.type, e.keyCode,  e.charCode, key, !!control, !!shift, !!alt
            ]}],'','',true);
        },
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.panel3 = (new linb.UI.Panel)
            .alias("panel3").host(this)
            .setLeft(90).setTop(110).setWidth(638).setHeight(330)
            .setCustomAppearance({KEY:'border:solid 1px'})
            ;
            this.nodes.push(this.panel3.get(0));

            this.treegrid2 = (new linb.UI.TreeGrid)
            .alias("treegrid2").host(this)
            .setColDragable(false).setRowDragable(false).setColSortable(false).setRowResizer(false).setColResizer(false).setEditable(false).setHeader([{"id":"type","caption":"type","type":"label","width":100},{"id":"kcode","caption":"keyCode","type":"label","width":80},{"id":"ccode","caption":"charCode","type":"label","width":80},{"id":"key","caption":"key","type":"label","width":80},{"id":"contrl","caption":"contrl","type":"checkbox","width":80},{"id":"shift","caption":"shift","type":"checkbox","width":80},{"id":"alt","caption":"alt","type":"checkbox","width":80}])
            .setRows([])
            .setRowDragKey("ch").setColDragKey("ch")
            ;
            this.panel3.attach(this.treegrid2);

            this.div9 = (new linb.UI.Div)
            .alias("div9").host(this)
            .setLeft(100).setTop(42).setWidth(162).setHeight(20).setHtml("Type something in the Input:")
            ;
            this.nodes.push(this.div9.get(0));

            this.input3 = (new linb.UI.Input)
            .alias("input3").host(this)
            .setLeft(270).setTop(40)
            .beforeNextFocus("_input3_beforenextfocus").onHotKeydown("_input3_onhotkey").onHotKeypress("_input3_onhotkey").onHotKeyup("_input3_onhotkey")
            ;
            this.nodes.push(this.input3.get(0));

            this.button5 = (new linb.UI.Button)
            .alias("button5").host(this)
            .setLeft(460).setTop(460).setCaption("Clear output")
            .onClick("_button5_onclick")
            ;
            this.nodes.push(this.button5.get(0));

            this.input2 = (new linb.UI.Input)
            .alias("input2").host(this)
            .setLeft(430).setTop(10).setHeight(90).setInputArea("textarea")
            .beforeNextFocus("_input3_beforenextfocus").onHotKeydown("_input3_onhotkey").onHotKeypress("_input3_onhotkey").onHotKeyup("_input3_onhotkey")
            ;
            this.nodes.push(this.input2.get(0));
            return this.nodes;
            // ]]code creted by designer
        },
        _button5_onclick:function (profile, e, value) {
            this.treegrid2.resetContent();
        },
        _input3_beforenextfocus:function (profile, e, src) {
            return false;
        }
    }
});