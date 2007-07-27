Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Button","linb.UI.Block","linb.UI.TreeGrid","linb.UI.Div"],

        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.div9 = (new linb.UI.Div)
            .alias("div9").host(this)
            .setLeft(80).setTop(20).setWidth(560).setHtml("Use \"tab/left/right/up/down\" to navigate TreeGrid/Cells").setHeight(20)
            ;
            this.nodes.push(this.div9.get(0));

            this.block1 = (new linb.UI.Block)
            .alias("block1").host(this)
            .setLeft(80).setTop(62).setWidth(260).setHeight(128).setBorder(true).setDropKeys("iAny").setResizable(true)
            ;
            this.nodes.push(this.block1.get(0));

            this.treegrid3 = (new linb.UI.TreeGrid)
            .alias("treegrid3").host(this)
            .setHeader([{"id":"col1","caption":"col1","type":"input","width":50},{"id":"col2","caption":"col2","type":"input","width":80}]).setRows([{"id":"row1","cells":[{"value":"cell11"},{"value":"cell12"}],"tabindex":1},{"id":"row2","cells":[{"value":"cell21","type":"label"},{"value":"cell22"}],"sub":[{"id":"row21","cells":[{"value":"cell31"},{"value":"cell32","type":"number"}]}],"tabindex":1}]).setRowDragKey("ca").setColDragKey("ca")
            ;
            this.block1.attach(this.treegrid3);

            this.block3 = (new linb.UI.Block)
            .alias("block3").host(this)
            .setLeft(386).setTop(60).setWidth(260).setHeight(128).setBorder(true).setDropKeys("iAny").setResizable(true)
            ;
            this.nodes.push(this.block3.get(0));

            this.treegrid4 = (new linb.UI.TreeGrid)
            .alias("treegrid4").host(this)
            .setActiveMode("cell").setHeader([{"id":"col1","caption":"col1","type":"input","width":50,"format":"^[\\w]{6}$","validTips":"6 chars only"},{"id":"col2","caption":"col2","type":"input","width":80}]).setRows([{"id":"row1","cells":[{"value":"cell11"},{"value":"cell12"}],"tabindex":1},{"id":"row2","cells":[{"value":"cell21","type":"label"},{"value":"cell22"}],"sub":[{"id":"row21","cells":[{"value":true,"type":"checkbox"},{"value":"23","type":"number","format":function(p,v){v=parseFloat(v);return v>=0 && v<=100},"render":function(v){return '%'+v;},"validTips":"0-100"}]}],"tabindex":1}]).setRowDragKey("cc").setColDragKey("cc")
            ;
            this.block3.attach(this.treegrid4);
            return this.nodes;
            // ]]code creted by designer
        },
        _button6_aftercreated:function (profile) {
            profile.root.onMousedown(function(pro,e,src){
                linb([src],false).startDrag(e, {
                    drop2:true,
                    key:'iAny',
                    data:pro.$id,
                    icon:linb.ini.path+'ondrag.gif',
                    dragMode:'move',
                    cursor:'pointer',
                    move:false,
                    defer:1
                });
            },'',-1);
        }
    }
});