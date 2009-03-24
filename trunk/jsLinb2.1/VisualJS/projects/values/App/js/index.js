Class('App', 'linb.Com',{
    Instance:{
        events:{"onReady":"_onready"}, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.TreeBar)
                .host(host,"treebar7")
                .setDataBinder("ads")
                .setItems([{"id":"item a", "sub":["sub a1", "sub a2", "sub a3", "sub a4"], "caption":"item a"}, {"id":"item b", "sub":["sub b1", "sub b2", "sub b3", "sub b4"], "caption":"item b"}])
                .setDock("none")
                .setDockMinH(23)
                .setLeft(50)
                .setTop(40)
                .setHeight(223)
            );
            
            append((new linb.UI.MenuBar)
                .host(host,"menubar8")
                .setItems([{"id":"item a", "sub":["sub a1", "sub a2", "sub a3", "sub a4"], "caption":"item a"}, {"id":"item b", "sub":["sub b1", "sub b2", "sub b3", "sub b4"], "caption":"item b"}])
                .setAutoShowTime(0)
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput6")
                .setLeft(220)
                .setTop(160)
                .setType("none")
                .setItems([{"id":"a", "caption":"item a", "image":"img/demo.gif"}, {"id":"b", "caption":"item b", "image":"img/demo.gif"}, {"id":"c", "caption":"item c", "image":"img/demo.gif"}, {"id":"d", "caption":"item d", "image":"img/demo.gif"}])
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        base:[], 
        required:["linb.UI.TreeBar", "linb.UI.MenuBar", "linb.UI.Input", "linb.UI.ComboInput"]
    }
});