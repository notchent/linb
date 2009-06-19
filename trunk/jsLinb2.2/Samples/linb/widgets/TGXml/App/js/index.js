Class('App', 'linb.Com',{
    Instance:{
        events:{"onReady":"_onready"}, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Panel)
                .host(host,"panel4")
                .setDock("none")
                .setLeft(40)
                .setTop(20)
                .setWidth(700)
                .setHeight(400)
                .setCaption("Build Grid from xml")
            );
            
            host.panel4.append((new linb.UI.TreeGrid)
                .host(host,"treegrid")
                .setRowHandler(false)
                .setRowResizer(false)
                .setColHidable(true)
                .setColMovable(true)
            );
            
            append((new linb.UI.SButton)
                .host(host,"sbutton1")
                .setLeft(280)
                .setTop(430)
                .setWidth(160)
                .setCaption("Make Grid Editable")
                .onClick("_sbutton1_onclick")
            );
            
            append((new linb.UI.Div)
                .host(host,"div8")
                .setLeft(160)
                .setTop(460)
                .setWidth(450)
                .setHeight(180)
                .setHtml("<b>Try keyboard</b>: <br /><b>up</b> : to upper cell;<br /><b>down</b> : to below cell; <br /><b>(alt+)left</b>: to left cell; <br /><b>(alt+)right</b> : to right cell;<br /><b>tab</b> : direct to the last cell; <br /><b>enter</b> : equal to down(in edit mode); <br /><b>alt+enter</b> : input 'enter' in textarea(in edit mode); <br /><b>ctrl+enter</b>: show pop wnd(in edit mode); ")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _onready:function (com, threadid) {
            var ns=this;
            if(!ns._data)alert("no data");
            if(ns._data.data.header){
                ns.treegrid.setHeader(ns._data.data.header);
            }
            if(ns._data.data.rows)
                ns.treegrid.setRows(ns._data.data.rows);
        }, 
        iniResource:function (com, threadid) {
            linb.Ajax("xml/data.xml","",function(rsp){
                com._data=_.unserialize(linb.XML.xml2json(linb.XML.parseXML(rsp)));
            },function(){},threadid).start();
        }, 
        _sbutton1_onclick:function (profile, e, src, value) {
            this.treegrid.setEditable(true)
        }, 
        base:[], 
        required:["linb.UI.Panel", "linb.UI.TreeGrid", "linb.UI.SButton", "linb.UI.Div"]
    }
});