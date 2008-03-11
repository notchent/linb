Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Button","linb.UI.Block","linb.UI.TreeGrid","linb.UI.Div"],

        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Div)
            .host(t,"div9")
            .setLeft(80)
            .setTop(20)
            .setWidth(560)
            .setHtml("Use \"tab/left/right/up/down\" to navigate TreeGrid/Cells")
            .setHeight(20)
            );

            f(
            (new u.Block)
            .host(t,"block1")
            .setLeft(80)
            .setTop(62)
            .setWidth(260)
            .setHeight(128)
            .setBorder(true)
            .setDropKeys("iAny")
            .setResizable(true)
            );

            t.block1.attach(
            (new u.TreeGrid)
            .host(t,"treegrid3")
            .setHeader([{"id":"col1","caption":"col1","type":"input","width":50},{"id":"col2","caption":"col2","type":"input","width":80}])
            .setRows([{"id":"row1","cells":[{"value":"cell11"},{"value":"cell12"}],"tabindex":1},{"id":"row2","cells":[{"value":"cell21","type":"label"},{"value":"cell22"}],"sub":[{"id":"row21","cells":[{"value":"cell31"},{"value":"cell32","type":"number"}]}],"tabindex":1}])
            .setRowDragKey("ca")
            .setColDragKey("ca")
            );

            f(
            (new u.Block)
            .host(t,"block3")
            .setLeft(386)
            .setTop(60)
            .setWidth(260)
            .setHeight(128)
            .setBorder(true)
            .setDropKeys("iAny")
            .setResizable(true)
            );

            t.block3.attach(
            (new u.TreeGrid)
            .host(t,"treegrid4")
            .setActiveMode("cell")
            .setHeader([{"id":"col1","caption":"col1","type":"input","width":50,"format":"^[\\w]{6}$","tipsErr":"6 chars only"},{"id":"col2","caption":"col2","type":"input","width":80}])
            .setRows([{"id":"row1","cells":[{"value":"cell11"},{"value":"cell12"}],"tabindex":1},{"id":"row2","cells":[{"value":"cell21","type":"label"},{"value":"cell22"}],"sub":[{"id":"row21","cells":[{"value":true,"type":"checkbox"},{"value":"23","type":"number","format":function (p, v) {
                v = parseFloat(v);
                return v >= 0 && v <= 100;
            },"render":function (v) {
                return "%" + v;
            },"tipsErr":"0-100"}]}],"tabindex":1}])
            .setRowDragKey("cc")
            .setColDragKey("cc")
            );

            return n;
            // ]]code created by designer
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