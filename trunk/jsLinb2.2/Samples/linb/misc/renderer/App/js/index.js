
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        required:["linb.UI.Label", "linb.UI.Div", "linb.UI.Button", "linb.UI.CheckBox", "linb.UI.List"], 
        //Com events
        events:{"onReady":"_onready"}, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Label)
                .host(host,"label11")
                .setLeft(210)
                .setTop(40)
                .setWidth(170)
                .setCaption("label11")
                .setRenderer(function(prop){
                return '['+prop.caption+']';
                })
            );
            
            append((new linb.UI.Div)
                .host(host,"div41")
                .setLeft(50)
                .setTop(40)
                .setHeight(160)
                .setRenderer(function (prop) {
                prop.html = "set in renderer";
            })
                .setHtml("set in renderer")
            );
            
            append((new linb.UI.Button)
                .host(host,"button15")
                .setLeft(210)
                .setTop(70)
                .setWidth(170)
                .setRenderer(function (prop) {
                return "[" + prop.caption + "](renderer)";
            })
                .setCaption("button15")
            );
            
            append((new linb.UI.CheckBox)
                .host(host,"checkbox2")
                .setLeft(210)
                .setTop(110)
                .setWidth(210)
                .setHeight(30)
                .setRenderer(function (prop) {
                return "[" + prop.caption + "](renderer)";
            })
                .setCaption("checkbox2")
            );
            
            append((new linb.UI.List)
                .host(host,"list7")
                .setLeft(420)
                .setTop(40)
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _onready:function () {
            var renderer=function(prop){return '<div style="font-size:'+prop.caption+'">'+prop.caption+'</div>'};
            this.list7.setItems([
                {"id":"a", "caption":"8px", renderer:renderer},
                {"id":"b", "caption":"10px", renderer:renderer},
                {"id":"c", "caption":"12px", renderer:renderer},
                {"id":"d", "caption":"14px", renderer:renderer},
                {"id":"e", "caption":"16px", renderer:renderer},
                {"id":"f", "caption":"18px", renderer:renderer},
                {"id":"g", "caption":"20px", renderer:renderer},
                {"id":"h", "caption":"22px", renderer:renderer},
                {"id":"i", "caption":"24px", renderer:renderer}
            ])
        }
    }
});