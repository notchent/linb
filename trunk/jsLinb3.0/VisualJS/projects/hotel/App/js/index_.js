
Class('App', 'linb.Com',{
    Instance:{
        //base Class for this com
        base:["linb.UI"], 
        //requried class for this com
        required:["linb.UI.Pane", "linb.UI.Layout", "linb.UI.Panel", "linb.UI.Stacks", "linb.UI.TreeBar", "linb.UI.ToolBar", "linb.UI.TreeGrid", "linb.UI.Block"], 

        properties:{}, 
        events:{"onReady":"_onready"}, 
        iniResource:function(com, threadid){
        }, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Layout)
                .host(host,"layout6")
                .setItems([{"id":"before", "pos":"before", "min":10, "size":200, "locked":false, "folded":false, "cmd":true, "caption":"before"}, {"id":"main", "min":10, "caption":"main"}, {"id":"after", "pos":"after", "min":10, "size":150, "locked":false, "folded":false, "cmd":true, "caption":"after"}])
                .setType("horizontal")
            );
            
            host.layout6.append((new linb.UI.Panel)
                .host(host,"panel8")
                .setZIndex(1)
                .setCaption("酒店开房详细信息")
            , 'main');
            
            host.panel8.append((new linb.UI.ToolBar)
                .host(host,"toolbar10")
                .setItems([{"id":"item a", "sub":["sub a1", "sub a2", "sub a3", "sub a4"], "caption":"item a"}])
            );
            
            host.panel8.append((new linb.UI.TreeGrid)
                .host(host,"treegrid3")
                .setHeader([{"id":"col1", "width":80, "type":"label", "caption":"房间号"}, {"id":"col2", "width":80, "type":"label", "caption":"房间类型"}, {"id":"col3", "width":120, "type":"label", "caption":"开房时间"}, {"id":"col4", "width":80, "type":"label", "caption":"预缴金额"}, {"id":"col5", "width":80, "type":"label", "caption":"身份证"}, {"id":"col6", "width":80, "type":"label", "caption":"姓名"}, {"id":"col7", "width":80, "type":"label", "caption":"备注"}])
                .setRows([{"cells":[{"value":"row1 col1"}, {"value":"row1 col2"}, {"value":"row1 col3"}, {"value":"row1 col4"}], "id":"a"}, {"cells":[{"value":"row2 col1"}, {"value":"row2 col2"}, {"value":"row2 col3"}, {"value":"row2 col4"}], "id":"b"}, {"cells":[{"value":"row3 col1"}, {"value":"row3 col2"}, {"value":"row3 col3"}, {"value":"row3 col4"}], "sub":[["sub1", "sub2", "sub3", "sub4"]], "id":"c"}])
            );
            
            host.layout6.append((new linb.UI.Panel)
                .host(host,"panel9")
                .setZIndex(1)
                .setCaption("今日房价")
            , 'after');
            
            host.panel9.append((new linb.UI.TreeGrid)
                .host(host,"treegrid5")
                .setHeader([{"id":"col1", "width":80, "type":"label", "caption":"房间类型"}, {"id":"col2", "width":80, "type":"label", "caption":"房间价格"}])
            );
            
            host.layout6.append((new linb.UI.Stacks)
                .host(host,"stacks1")
                .setItems([{"id":"a", "caption":"酒店日常管理", "image":"img/demo.gif"}, {"id":"b", "caption":"信息中心", "image":"img/demo.gif"}])
                .setValue("a")
            , 'before');
            
            host.stacks1.append((new linb.UI.TreeBar)
                .host(host,"treebar6")
                .setItems([{"id":"common", "sub":[{"id":"sub a1", "caption":"sub a1"}, {"id":"sub a2", "caption":"sub a2"}], "caption":"普通功能", "image":"Images/user3.gif"}, {"id":"advanced", "sub":["sub b1", "sub b2", "sub b3", "sub b4"], "caption":"高级功能", "image":"Images/user3.gif"}])
            , 'a');
            
            append((new linb.UI.Block)
                .host(host,"block2")
                .setDock("top")
                .setHeight(70)
            );
            
            host.block2.append((new linb.UI.Pane)
                .host(host,"pane8")
                .setDock("left")
                .setWidth(220)
                .setHtml("<h1>龙博酒店管理系统</h1>")
            );
            
            host.block2.append((new linb.UI.Pane)
                .host(host,"pane9")
                .setLeft(573)
                .setTop(1)
                .setWidth(190)
                .setHeight(60)
                .setHtml("<img src=\"img/builder.gif\">")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        iniExComs:function(com, hreadid){
        }, 
        _onready:function(com,threadid){
            me = this;
            linb.request(
              "/HotelUI/Json/MainGrid.aspx",
              null,
              function(rep){
                var obj = _.unserialize(rep);
                var rows = new Array();
                if(obj.success){
                    var rows = jsonToArray(obj.data, 'Number',
                    ['OpenRoomId','TypeName','OpenTime','GuestMoney','GuestNumber','GuestName','Remark']);
                    me.treegrid3.setRows(rows);
                }else{
                    linb.message("房间数据加载错误!");
                }

              }
            );
            linb.request(
              "/HotelUI/Json/PriceGrid.aspx",
              null,
              function(rep){
                var obj = _.unserialize(rep);
                var rows = new Array();
                if(obj.success){
                    var rows = jsonToArray(obj.data, null,
                    ['TypeName','TypePrice']);
                    me.treegrid5.setRows(rows);
                }else{
                    linb.message("价格数据加载错误!");
                }

              }
            );

        }
    }
});
