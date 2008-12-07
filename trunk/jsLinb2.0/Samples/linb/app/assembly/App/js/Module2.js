Class('App.Module2', 'linb.Com',{
    Instance:{
        base:["linb.UI"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Pane)
                .host(host,"panelMain")
                .setLeft(0)
                .setTop(0)
                .setWidth(220)
                .setHeight(80)
            );
            
            host.panelMain.append((new linb.UI.Div)
                .host(host,"div37")
                .setLeft(30)
                .setTop(10)
                .setHeight(20)
                .setHtml("UI in Module2")
            );
            
            host.panelMain.append((new linb.UI.Button)
                .host(host,"button22")
                .setLeft(20)
                .setTop(40)
                .setWidth(180)
                .setCaption("button in Module2")
                .onClick("_button22_onclick")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        required:["linb.UI.Pane", "linb.UI.Div", "linb.UI.Tag", "linb.UI.Button"], 
        _button22_onclick:function (profile, e, value) {
            alert("I'm in Module2");
        }, 
        _beforecreated:function (com, threadid) {
            linb.log(threadid,'Module2.js is loaded');
            linb.Thread(threadid).insert(1000);
        }, 
        events:{"onCreated":"_beforecreated", "onReady":"_onready"}, 
        _onready:function (com, threadid) {
            linb.log(threadid,'Module2.js is ready');
            linb.Thread(threadid).insert(1000);
        }
    }
});