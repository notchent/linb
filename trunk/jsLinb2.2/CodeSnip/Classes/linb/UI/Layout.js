Class('App.linb_UI_Layout', 'linb.Com',{
    Instance:{
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
                .setItems([{id:"b1", pos:"before", size:50, cmd:true}, {id:"a1", pos:"after", size:60, cmd:true, height:60, hide:true}])
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
                .setItems([{id:"b1", pos:"before",size:50,cmd:true}, {id:"a1", pos:"after", size:120, cmd:true}])
                .setType("horizontal")
            );
            
            host.layout13.append((new linb.UI.Layout)
                .host(host,"layout8")
                .setItems([{id:"b1", pos:"before", size:60, cmd:true}, {id:"after", pos:"after", size:60,cmd:true}])
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
                .setItems(["item a","item b","item c","item d"])
                .setLeft(30)
                .setTop(50)
                .setWidth(70)
                .setHeight(90)
            , 'a1');
            
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
                .setItems([{id:"before", pos:"before", size:50, cmd:true}, {id:"after", pos:"after", size:79}])
            );
            
            host.layout8.append((new linb.UI.Layout)
                .host(host,"layout9")
                .setItems([{id:"before", pos:"before", locked:true, size:50, cmd:true}, {id:"before2", pos:"before", size:50, cmd:true}, {id:"after", pos:"after", locked:false, size:63, cmd:true}])
                .setType("horizontal")
            , 'main');
            
            return children;
            // ]]code created by jsLinb UI Builder
        }
    }
});