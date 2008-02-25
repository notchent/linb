Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried  class for the App
        required:["linb.UI.Tabs","linb.UI.Button","linb.UI.Label","linb.UI.ButtonViews","linb.UI.Stacks","linb.UI.Layout"],

        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Tabs)
            .host(t,"Tabs1")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3","closeBtn":true},{"id":"view4","caption":"view4","closeBtn":true},{"id":"view5","caption":"view5","closeBtn":true},{"id":"view6","caption":"view6","closeBtn":true},{"id":"view7","caption":"view7","closeBtn":true},{"id":"view8","caption":"view8","closeBtn":true},{"id":"view9","caption":"view9","closeBtn":true},{"id":"view10","caption":"view10","closeBtn":true},{"id":"view11","caption":"view11","closeBtn":true}])
            .setValue("view1")
            );
            
            t.Tabs1.attach(
            (new u.ButtonViews)
            .host(t,"ButtonViews1")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3"},{"id":"view4","caption":"view4","closeBtn":"true"}])
            .setHandleHAlign("right")
            .setHandleSize("26")
            .setValue("view1")
            , 'view1');
            
            t.ButtonViews1.attach(
            (new u.ButtonViews)
            .host(t,"ButtonViews2")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3","closeBtn":"true"},{"id":"view4","caption":"view4","closeBtn":"true"}])
            .setHandleDock("left")
            .setValue("view1")
            .setHandleSize("60")
            , 'view1');
            
            t.ButtonViews2.attach(
            (new u.ButtonViews)
            .host(t,"ButtonViews3")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3"},{"id":"view4","caption":"view4"}])
            .setHandleDock("right")
            .setValue("view1")
            , 'view1');
            
            t.ButtonViews3.attach(
            (new u.ButtonViews)
            .host(t,"ButtonViews4")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3"},{"id":"view4","caption":"view4"}])
            .setHandleDock("bottom")
            .setHandleSize("26")
            .setValue("view1")
            , 'view1');
            
            t.ButtonViews4.attach(
            (new u.Button)
            .host(t,"button4")
            .setLeft(200)
            .setTop(160)
            .setCaption("button4")
            , 'view1');
            
            t.Tabs1.attach(
            (new u.Stacks)
            .host(t,"Stacks1")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3","closeBtn":true}])
            .setValue("view2")
            , 'view2');
            
            t.Stacks1.attach(
            (new u.Button)
            .host(t,"Button1")
            .setLeft(240)
            .setTop(16)
            .setCaption("Button1")
            , 'view1');
            
            t.Stacks1.attach(
            (new u.Tabs)
            .host(t,"tabs6")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            , 'view2');
            
            t.tabs6.attach(
            (new u.Stacks)
            .host(t,"stacks3")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            , 'a');
            
            t.stacks3.attach(
            (new u.Tabs)
            .host(t,"tabs7")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            , 'a');
            
            return n;
            // ]]code created by designer
        }
    }
});