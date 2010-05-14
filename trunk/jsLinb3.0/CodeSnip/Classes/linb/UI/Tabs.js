Class('App.linb_UI_Tabs', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried  class for the App
        required:["linb.UI.Tabs", "linb.UI.Button", "linb.UI.Label", "linb.UI.ButtonViews", "linb.UI.Stacks", "linb.UI.Layout", "linb.UI.Link"], 

        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Tabs)
                .host(host,"Tabs1")
                .setItems([{"id":"view1", "caption":"view1", "image":"img/demo.gif"}, {"id":"view2", "caption":"view2"}, {"id":"view3", "caption":"view3", "closeBtn":true}, {"id":"view4", "caption":"view4", "closeBtn":true, "popBtn":true, "optBtn":true}, {"id":"view5", "caption":"view5", "closeBtn":true, "landBtn":true, "optBtn":true}, {"id":"view6", "caption":"view6", "closeBtn":true}, {"id":"view7", "caption":"view7", "closeBtn":true, "landBtn":true, "optBtn":true}, {"id":"view8", "caption":"view8", "closeBtn":true}, {"id":"view9", "caption":"view9", "closeBtn":true}, {"id":"view10", "caption":"view10", "closeBtn":true}, {"id":"view11", "caption":"view11", "closeBtn":true}])
                .setLeft(0)
                .setTop(0)
                .setValue("view1")
                .beforePageClose("_tabs1_beforepageclose")
                .onShowOptions("_tabs1_onshowoptions")
            );
            
            host.Tabs1.append((new linb.UI.Tabs)
                .host(host,"tabTest1")
                .setItems([{"id":"a", "caption":"itema", "tips":"item a"}, {"id":"b", "caption":"itemb", "tips":"item b"}, {"id":"c", "caption":"itemc", "tips":"item c"}])
                .setDock("none")
                .setLeft(30)
                .setTop(20)
                .setWidth(410)
                .setHeight(170)
                .setHAlign("right")
                .setValue("b")
            , 'view1');
            
            host.tabTest1.append((new linb.UI.Link)
                .host(host,"link3")
                .setLeft(60)
                .setTop(40)
                .setCaption("link3")
            , 'a');
            
            host.tabTest1.append((new linb.UI.Link)
                .host(host,"link4")
                .setLeft(150)
                .setTop(90)
                .setCaption("link4")
            , 'c');
            
            host.tabTest1.append((new linb.UI.Link)
                .host(host,"link2")
                .setLeft(170)
                .setTop(30)
                .setCaption("link2")
            , 'b');
            
            host.Tabs1.append((new linb.UI.Button)
                .host(host,"button34")
                .setLeft(240)
                .setTop(220)
                .setCaption("select the first tab")
                .onClick("_button34_onclick")
            , 'view1');
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _tabs1_beforepageclose:function (profile, item, src) {
            if(item.id=='view9'){
                linb.message('You cant close me!');
                return false;
            }
        }, 
        _button34_onclick:function (profile, e, src, value) {
            this.tabTest1.setValue('a',true);
        }, 
        _tabs1_onshowoptions:function (profile, item, e, src) {
            linb.message('onShowOptions : ' +item.id);
        }
    }
});