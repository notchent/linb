Class('App', 'linb.Com',{
    Instance:{
        events:{"onReady":"_onready"}, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Panel)
                .host(host,"panel4")
                .setDock("none")
                .setLeft(80)
                .setTop(50)
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
                .setLeft(320)
                .setTop(460)
                .setWidth(160)
                .setCaption("Make Grid Editable")
                .onClick("_sbutton1_onclick")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _onready:function (com, threadid) {
            var ns=this;
            if(!ns._data)alert("no data");
            if(ns._data.data.header)
                ns.treegrid.setHeader(ns._data.data.header);
            if(ns._data.data.rows)
                ns.treegrid.setRows(ns._data.data.rows);
        }, 
        iniResource:function (com, threadid) {
            linb.Ajax("xml/data.xml","",function(rsp){
                //console.log(rsp,linb.XML.parseXML(rsp),linb.XML.xml2json(linb.XML.parseXML(rsp)));
                com._data=_.unserialize(linb.XML.xml2json(linb.XML.parseXML(rsp)));
            },function(){},threadid).start();
        }, 
        _sbutton1_onclick:function (profile, e, src, value) {
            this.treegrid.setEditable(true)
        }, 
        base:[], 
        required:["linb.UI.Panel", "linb.UI.TreeGrid", "linb.UI.SButton"]
    }
});