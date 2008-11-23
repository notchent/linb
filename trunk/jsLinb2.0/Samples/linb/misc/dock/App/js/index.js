Class('App', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};

            append((new linb.UI.Block)
                .host(host,"Block13")
                .setDock("right")
                .setWidth(80)
                .setBorder(true)
                .setHtml("dock : right")
            );

            append((new linb.UI.Block)
                .host(host,"Block11")
                .setDock("top")
                .setDockOrder("2")
                .setDockMargin({"left":20, "top":20, "right":20, "bottom":20})
                .setBorder(true)
                .setHtml("dock : top ; dockOder : 2 ; dockMaring : {left:20,top:20,bottom:20,right:20}")
            );

            append((new linb.UI.Block)
                .host(host,"Block14")
                .setDock("bottom")
                .setHeight(60)
                .setBorder(true)
                .setHtml("dock : bottom")
            );

            append((new linb.UI.Block)
                .host(host,"Block15")
                .setDock("middle")
                .setLeft(110)
                .setTop(249)
                .setWidth(130)
                .setHeight(78)
                .setBorder(true)
                .setHtml("dock : middle")
            );

            append((new linb.UI.Block)
                .host(host,"Block18")
                .setDock("origin")
                .setLeft(230)
                .setTop(282)
                .setWidth(210)
                .setHeight(88)
                .setBorder(true)
                .setHtml("dock : origin(both center and middle)")
            );

            append((new linb.UI.Block)
                .host(host,"Block20")
                .setDock("center")
                .setLeft(350)
                .setTop(150)
                .setWidth(140)
                .setHeight(60)
                .setZIndex("20")
                .setBorder(true)
                .setHtml("dock : center")
            );

            append((new linb.UI.Block)
                .host(host,"Block22")
                .setLeft(110)
                .setTop(420)
                .setWidth(180)
                .setHeight(70)
                .setBorder(true)
                .setHtml("dock : none")
            );

            append((new linb.UI.Block)
                .host(host,"Block29")
                .setLeft(100)
                .setTop(120)
                .setWidth(190)
                .setHeight(30)
                .setBorder(true)
            );

            append((new linb.UI.Block)
                .host(host,"Block10")
                .setDock("top")
                .setHeight(30)
                .setBorder(true)
                .setHtml("dock : top")
            );

            append((new linb.UI.Block)
                .host(host,"Block30")
                .setDock("width")
                .setLeft(530)
                .setTop(100)
                .setHeight(80)
                .setBorder(true)
                .setHtml("dock : width")
            );

            append((new linb.UI.Block)
                .host(host,"Block3")
                .setDock("height")
                .setDockMinH("500")
                .setLeft(530)
                .setTop(160)
                .setWidth(180)
                .setZIndex("30")
                .setBorder(true)
                .setHtml("dock : height ; dockMinH : 500")
            );

            append((new linb.UI.Block)
                .host(host,"Block12")
                .setDock("left")
                .setWidth(70)
                .setBorder(true)
                .setHtml("dock : left")
            );

            return children;
            // ]]code created by jsLinb UI Builder
        },
        base:[],
        required:["linb.UI.Block"]
    }
});