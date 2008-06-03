//sdfdsf
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        //"linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"
        required:["linb.UI.ButtonViews","linb.UI.Block"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Block)
            .host(t,"block5")
            .setLeft(410)
            .setTop(20)
            .setWidth(170)
            .setHeight(152)
            .setBorder(true)
            .setResizable(true)
            );

            t.block5.attach(
            (new u.ButtonViews)
            .host(t,"buttonviews7")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setHandleDock("left")
            );

            f(
            (new u.Block)
            .host(t,"block2")
            .setLeft(220)
            .setTop(20)
            .setWidth(170)
            .setHeight(152)
            .setBorder(true)
            .setResizable(true)
            );

            t.block2.attach(
            (new u.ButtonViews)
            .host(t,"buttonviews4")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setHandleHAlign("right")
            );

            f(
            (new u.Block)
            .host(t,"block6")
            .setLeft(600)
            .setTop(20)
            .setWidth(170)
            .setHeight(152)
            .setBorder(true)
            .setResizable(true)
            );

            t.block6.attach(
            (new u.ButtonViews)
            .host(t,"buttonviews8")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setHandleDock("left")
            .setHandleVAlign("bottom")
            );

            f(
            (new u.Block)
            .host(t,"block9")
            .setLeft(30)
            .setTop(190)
            .setWidth(170)
            .setHeight(152)
            .setBorder(true)
            .setResizable(true)
            );

            t.block9.attach(
            (new u.ButtonViews)
            .host(t,"buttonviews11")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setHandleDock("right")
            );

            f(
            (new u.Block)
            .host(t,"block10")
            .setLeft(220)
            .setTop(190)
            .setWidth(170)
            .setHeight(152)
            .setBorder(true)
            .setResizable(true)
            );

            t.block10.attach(
            (new u.ButtonViews)
            .host(t,"buttonviews12")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setHandleDock("right")
            .setHandleVAlign("bottom")
            );

            f(
            (new u.Block)
            .host(t,"block11")
            .setLeft(410)
            .setTop(190)
            .setWidth(170)
            .setHeight(152)
            .setBorder(true)
            .setResizable(true)
            );

            t.block11.attach(
            (new u.ButtonViews)
            .host(t,"buttonviews13")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setHandleDock("bottom")
            );

            f(
            (new u.Block)
            .host(t,"block1")
            .setLeft(30)
            .setTop(20)
            .setWidth(170)
            .setHeight(152)
            .setResizable(true)
            .setBorder(true)
            );

            t.block1.attach(
            (new u.ButtonViews)
            .host(t,"buttonviews3")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            );

            f(
            (new u.Block)
            .host(t,"block12")
            .setLeft(600)
            .setTop(190)
            .setWidth(170)
            .setHeight(152)
            .setBorder(true)
            .setResizable(true)
            );

            t.block12.attach(
            (new u.ButtonViews)
            .host(t,"buttonviews14")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setHandleDock("bottom")
            .setHandleHAlign("right")
            );

            return n;
            // ]]code created by designer
        }
    }
});