Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried  class for the App
        required:["linb.UI.Tabs","linb.UI.Button","linb.UI.Label","linb.UI.ButtonViews","linb.UI.Stacks","linb.UI.Layout"],

        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.Tabs1 = (new linb.UI.Tabs)
            .alias("Tabs1").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3","closeBtn":true},{"id":"view4","caption":"view4","closeBtn":true},{"id":"view5","caption":"view5","closeBtn":true},{"id":"view6","caption":"view6","closeBtn":true},{"id":"view7","caption":"view7","closeBtn":true},{"id":"view8","caption":"view8","closeBtn":true},{"id":"view9","caption":"view9","closeBtn":true},{"id":"view10","caption":"view10","closeBtn":true},{"id":"view11","caption":"view11","closeBtn":true}]).setValue("view1")
            ;
            this.nodes.push(this.Tabs1.get(0));

            this.ButtonViews1 = (new linb.UI.ButtonViews)
            .alias("ButtonViews1").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3"},{"id":"view4","caption":"view4","closeBtn":"true"}]).setHandleHAlign("right").setHandleSize("26").setValue("view1")
            ;
            this.Tabs1.attach(this.ButtonViews1, 'view1');

            this.ButtonViews2 = (new linb.UI.ButtonViews)
            .alias("ButtonViews2").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3","closeBtn":"true"},{"id":"view4","caption":"view4","closeBtn":"true"}]).setHandleDock("left").setValue("view1").setHandleSize("60")
            ;
            this.ButtonViews1.attach(this.ButtonViews2, 'view1');

            this.ButtonViews3 = (new linb.UI.ButtonViews)
            .alias("ButtonViews3").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3"},{"id":"view4","caption":"view4"}]).setHandleDock("right").setValue("view1")
            ;
            this.ButtonViews2.attach(this.ButtonViews3, 'view1');

            this.ButtonViews4 = (new linb.UI.ButtonViews)
            .alias("ButtonViews4").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3"},{"id":"view4","caption":"view4"}]).setHandleDock("bottom").setHandleSize("26").setValue("view1")
            ;
            this.ButtonViews3.attach(this.ButtonViews4, 'view1');

            this.button4 = (new linb.UI.Button)
            .alias("button4").host(this)
            .setLeft(200).setTop(160).setCaption("button4")
            ;
            this.ButtonViews4.attach(this.button4, 'view1');

            this.Stacks1 = (new linb.UI.Stacks)
            .alias("Stacks1").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3","closeBtn":true}]).setValue("view2")
            ;
            this.Tabs1.attach(this.Stacks1, 'view2');

            this.Button1 = (new linb.UI.Button)
            .alias("Button1").host(this)
            .setLeft(240).setTop(16).setCaption("Button1")
            ;
            this.Stacks1.attach(this.Button1, 'view1');

            this.tabs6 = (new linb.UI.Tabs)
            .alias("tabs6").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            ;
            this.Stacks1.attach(this.tabs6, 'view2');

            this.stacks3 = (new linb.UI.Stacks)
            .alias("stacks3").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            ;
            this.tabs6.attach(this.stacks3, 'a');

            this.tabs7 = (new linb.UI.Tabs)
            .alias("tabs7").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            ;
            this.stacks3.attach(this.tabs7, 'a');
            return this.nodes;
            // ]]code creted by designer
        }
    }
});