
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        //"linb.Tips","linb.UI.Resizer","linb.UI.Border","linb.UI.Shadow"
        required:["linb.UI.ButtonViews", "linb.UI.Block"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Block)
                .host(host,"block6")
                .setLeft(590)
                .setTop(20)
                .setWidth(170)
                .setHeight(152)
                .setBorder(true)
                .setResizer(true)
            );
            
            host.block6.append((new linb.UI.ButtonViews)
                .host(host,"buttonviews8")
                .setItems([{"id":"a", "caption":"itema", "tips":"item a"}, {"id":"b", "caption":"itemb", "tips":"item b"}, {"id":"c", "caption":"itemc", "tips":"item c"}])
                .setLeft(0)
                .setTop(0)
                .setBarLocation("left")
                .setBarVAlign("bottom")
            );
            
            append((new linb.UI.Block)
                .host(host,"block2")
                .setLeft(210)
                .setTop(20)
                .setWidth(170)
                .setHeight(152)
                .setBorder(true)
                .setResizer(true)
            );
            
            host.block2.append((new linb.UI.ButtonViews)
                .host(host,"buttonviews4")
                .setItems([{"id":"a", "caption":"itema", "tips":"item a"}, {"id":"b", "caption":"itemb", "tips":"item b"}, {"id":"c", "caption":"itemc", "tips":"item c"}])
                .setLeft(0)
                .setTop(0)
                .setBarHAlign("right")
                .setBarSize("30")
            );
            
            append((new linb.UI.Block)
                .host(host,"block9")
                .setLeft(20)
                .setTop(190)
                .setWidth(170)
                .setHeight(152)
                .setBorder(true)
                .setResizer(true)
            );
            
            host.block9.append((new linb.UI.ButtonViews)
                .host(host,"buttonviews11")
                .setItems([{"id":"a", "caption":"itema", "tips":"item a"}, {"id":"b", "caption":"itemb", "tips":"item b"}, {"id":"c", "caption":"itemc", "tips":"item c"}])
                .setLeft(0)
                .setTop(0)
                .setBarLocation("right")
            );
            
            append((new linb.UI.Block)
                .host(host,"block10")
                .setLeft(210)
                .setTop(190)
                .setWidth(170)
                .setHeight(152)
                .setBorder(true)
                .setResizer(true)
            );
            
            host.block10.append((new linb.UI.ButtonViews)
                .host(host,"buttonviews12")
                .setItems([{"id":"a", "caption":"itema", "tips":"item a"}, {"id":"b", "caption":"itemb", "tips":"item b"}, {"id":"c", "caption":"itemc", "tips":"item c"}])
                .setLeft(0)
                .setTop(0)
                .setBarLocation("right")
                .setBarVAlign("bottom")
            );
            
            append((new linb.UI.Block)
                .host(host,"block11")
                .setLeft(400)
                .setTop(190)
                .setWidth(170)
                .setHeight(152)
                .setBorder(true)
                .setResizer(true)
            );
            
            host.block11.append((new linb.UI.ButtonViews)
                .host(host,"buttonviews13")
                .setItems([{"id":"a", "caption":"itema", "tips":"item a"}, {"id":"b", "caption":"itemb", "tips":"item b"}, {"id":"c", "caption":"itemc", "tips":"item c"}])
                .setLeft(0)
                .setTop(0)
                .setBarLocation("bottom")
                .setBarSize("30")
            );
            
            append((new linb.UI.Block)
                .host(host,"block1")
                .setLeft(20)
                .setTop(20)
                .setWidth(170)
                .setHeight(152)
                .setBorder(true)
                .setResizer(true)
            );
            
            host.block1.append((new linb.UI.ButtonViews)
                .host(host,"buttonviews3")
                .setItems([{"id":"a", "caption":"itema", "tips":"item a"}, {"id":"b", "caption":"itemb", "tips":"item b"}, {"id":"c", "caption":"itemc", "tips":"item c"}])
                .setLeft(0)
                .setTop(0)
                .setBarSize("30")
            );
            
            append((new linb.UI.Block)
                .host(host,"block5")
                .setLeft(400)
                .setTop(20)
                .setWidth(170)
                .setHeight(152)
                .setBorder(true)
                .setResizer(true)
            );
            
            host.block5.append((new linb.UI.ButtonViews)
                .host(host,"buttonviews7")
                .setItems([{"id":"a", "caption":"itema", "tips":"item a"}, {"id":"b", "caption":"itemb", "tips":"item b"}, {"id":"c", "caption":"itemc", "tips":"item c"}])
                .setLeft(0)
                .setTop(0)
                .setBarLocation("left")
            );
            
            append((new linb.UI.Block)
                .host(host,"block12")
                .setLeft(590)
                .setTop(190)
                .setWidth(170)
                .setHeight(152)
                .setBorder(true)
                .setResizer(true)
            );
            
            host.block12.append((new linb.UI.ButtonViews)
                .host(host,"buttonviews14")
                .setItems([{"id":"a", "caption":"itema", "tips":"item a"}, {"id":"b", "caption":"itemb", "tips":"item b"}, {"id":"c", "caption":"itemc", "tips":"item c"}])
                .setLeft(0)
                .setTop(0)
                .setBarLocation("bottom")
                .setBarHAlign("right")
                .setBarSize("30")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }
    }
});