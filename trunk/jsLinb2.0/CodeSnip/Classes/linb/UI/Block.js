Class('App.linb_UI_Block', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        required:["linb.UI.Block", "linb.UI.Button"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Block)
                .host(host,"block3")
                .setLeft(320)
                .setTop(60)
                .setBorder(true)
                .setShadow(true)
                .setHtml("shadow")
                .setCustomStyle({"PANEL":"background:#ccc"})
            );
            
            append((new linb.UI.Block)
                .host(host,"block2")
                .setLeft(170)
                .setTop(60)
                .setBorder(true)
                .setHtml("border")
                .setCustomStyle({"PANEL":"background:#ccc"})
            );
            
            append((new linb.UI.Block)
                .host(host,"block1")
                .setLeft(50)
                .setTop(60)
                .setCustomStyle({"PANEL":"background:#ccc"})
            );
            
            host.block1.append((new linb.UI.Button)
                .host(host,"button21")
                .setLeft(10)
                .setTop(30)
                .setWidth(80)
                .setCaption("button21")
            );
            
            append((new linb.UI.Block)
                .host(host,"block4")
                .setLeft(170)
                .setTop(190)
                .setBorder(true)
                .setResizer(true)
                .setHtml("resizer")
                .setCustomStyle({"PANEL":"background:#ccc"})
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }
    }
});