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
                .setCaption("Build Grid from JSON!")
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
            ns.treegrid.setHeader(ns._data.header).setRows(ns._data.rows);
        }, 
        iniResource:function (com, threadid) {
            linb.Ajax("App/js/data.js","",function(rsp){
                com._data=_.unserialize(rsp);
                console.log(linb.XML.json2xml(com._data));
            },function(){},threadid).start();
        }, 
        _sbutton1_onclick:function (profile, e, src, value) {
            this.treegrid.setEditable(true);
        }
    }
});