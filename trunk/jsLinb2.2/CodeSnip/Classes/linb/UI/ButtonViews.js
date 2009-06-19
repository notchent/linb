Class('App.linb_UI_ButtonViews', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried  class for the App
        required:["linb.UI.Tabs", "linb.UI.Button", "linb.UI.Label", "linb.UI.ButtonViews", "linb.UI.Stacks", "linb.UI.Layout"], 

        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.ButtonViews)
                .host(host,"ButtonViews1")
                .setItems([{"id":"view1", "caption":"view1"}, {"id":"view2", "caption":"view2"}, {"id":"view3", "caption":"view3"}, {"id":"view4", "caption":"view4", "closeBtn":"true"}])
                .setBarHAlign("right")
                .setBarSize(30)
                .setValue("view1")
            );
            
            host.ButtonViews1.append((new linb.UI.ButtonViews)
                .host(host,"ButtonViews2")
                .setItems([{"id":"view1", "caption":"view1"}, {"id":"view2", "caption":"view2"}, {"id":"view3", "caption":"view3", "closeBtn":"true"}, {"id":"view4", "caption":"view4", "closeBtn":"true"}])
                .setBarLocation("left")
                .setBarSize(90)
                .setValue("view1")
            , 'view1');
            
            host.ButtonViews2.append((new linb.UI.ButtonViews)
                .host(host,"ButtonViews3")
                .setItems([{"id":"view1", "caption":"view1"}, {"id":"view2", "caption":"view2"}, {"id":"view3", "caption":"view3"}, {"id":"view4", "caption":"view4"}])
                .setBarLocation("right")
                .setBarSize(80)
                .setValue("view1")
            , 'view1');
            
            host.ButtonViews3.append((new linb.UI.ButtonViews)
                .host(host,"ButtonViews4")
                .setItems([{"id":"view1", "caption":"view1"}, {"id":"view2", "caption":"view2"}, {"id":"view3", "caption":"view3"}, {"id":"view4", "caption":"view4"}])
                .setBarLocation("bottom")
                .setBarSize(30)
                .setValue("view1")
            , 'view1');
            
            host.ButtonViews4.append((new linb.UI.Button)
                .host(host,"button4")
                .setLeft(200)
                .setTop(160)
                .setCaption("button4")
            , 'view1');
            
            return children;
            // ]]code created by jsLinb UI Builder
        }
    }
});