Class('App.linb_UI_Layout', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        required:["linb.UI.Block", "linb.UI.Layout", "linb.UI.Pane", "linb.UI.Button", "linb.UI.Link", "linb.UI.Input", "linb.UI.List"], 

        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Block)
                .host(host,"block4")
                .setLeft(30)
                .setTop(10)
                .setWidth(256)
                .setHeight(206)
                .setBorder(true)
                .setResizer(true)
            );
            
            host.block4.append((new linb.UI.Layout)
                .host(host,"layout12")
                .setItems([{"id":"before", "pos":"before", "locked":false, "size":50, "min":50, "max":200, "cmd":true, "hide":false, "caption":"before"}, {"id":"main", "min":10, "hide":false, "caption":"main"}, {"id":"after", "pos":"after", "locked":false, "size":60, "min":50, "max":200, "cmd":true, "height":60, "hide":true, "caption":"after"}])
                .setLeft(0)
                .setTop(0)
            );
            
            host.layout12.append((new linb.UI.Button)
                .host(host,"button3")
                .setLeft(90)
                .setTop(20)
                .setCaption("button3")
            , 'after');
            
            append((new linb.UI.Block)
                .host(host,"block6")
                .setLeft(320)
                .setTop(10)
                .setWidth(338)
                .setHeight(208)
                .setBorder(true)
                .setResizer(true)
            );
            
            host.block6.append((new linb.UI.Layout)
                .host(host,"layout13")
                .setItems([{"id":"before", "pos":"before", "locked":false, "size":52, "min":50, "max":200, "cmd":true, "hide":false, "caption":"before"}, {"id":"main", "min":10, "hide":false, "caption":"main"}, {"id":"after", "pos":"after", "locked":false, "size":123, "min":50, "max":200, "cmd":true, "height":60, "hide":false, "caption":"after"}])
                .setLeft(0)
                .setTop(0)
                .setType("horizontal")
            );
            
            host.layout13.append((new linb.UI.Layout)
                .host(host,"layout8")
                .setItems([{"id":"before", "pos":"before", "locked":false, "size":60, "min":50, "max":200, "hide":false, "cmd":true, "caption":"before"}, {"id":"main", "min":10, "caption":"main"}, {"id":"after", "pos":"after", "locked":false, "size":60, "min":50, "max":200, "hide":false, "cmd":true, "caption":"after"}])
                .setLeft(0)
                .setTop(0)
            , 'main');
            
            host.layout8.append((new linb.UI.Link)
                .host(host,"link1")
                .setLeft(40)
                .setTop(30)
                .setCaption("link1")
            , 'main');
            
            host.layout8.append((new linb.UI.Button)
                .host(host,"button25")
                .setLeft(10)
                .setTop(10)
                .setCaption("button25")
            , 'before');
            
            host.layout8.append((new linb.UI.Input)
                .host(host,"input1")
                .setLeft(10)
                .setTop(20)
            , 'after');
            
            host.layout13.append((new linb.UI.List)
                .host(host,"list3")
                .setItems([{"id":"item a", "caption":"item a"}, {"id":"item b", "caption":"item b"}, {"id":"item c", "caption":"item c"}, {"id":"item d", "caption":"item d"}])
                .setLeft(30)
                .setTop(50)
                .setWidth(70)
                .setHeight(90)
            , 'after');
            
            append((new linb.UI.Block)
                .host(host,"Block3")
                .setLeft(34)
                .setTop(230)
                .setWidth(624)
                .setHeight(300)
                .setBorder(true)
                .setResizer(true)
            );
            
            host.Block3.append((new linb.UI.Layout)
                .host(host,"layout8")
                .setItems([{"id":"before", "pos":"before", "locked":false, "size":50, "min":50, "max":200, "hide":false, "cmd":true, "caption":"before"}, {"id":"main", "min":10, "caption":"main"}, {"id":"after", "pos":"after", "locked":false, "size":79, "min":50, "max":200, "hide":false, "cmd":false, "caption":"after"}])
                .setLeft(0)
                .setTop(0)
            );
            
            host.layout8.append((new linb.UI.Layout)
                .host(host,"layout9")
                .setItems([{"id":"before", "pos":"before", "locked":true, "size":50, "min":50, "max":200, "hide":false, "cmd":true, "caption":"before"}, {"id":"before2", "pos":"before", "locked":false, "size":50, "min":50, "max":200, "hide":false, "cmd":true, "caption":"before2"}, {"id":"main", "min":10, "hide":false, "caption":"main"}, {"id":"after", "pos":"after", "locked":false, "size":63, "min":50, "max":200, "hide":false, "cmd":true, "caption":"after"}])
                .setLeft(0)
                .setTop(0)
                .setType("horizontal")
            , 'main');
            
            return children;
            // ]]code created by jsLinb UI Builder
        }
    }
});