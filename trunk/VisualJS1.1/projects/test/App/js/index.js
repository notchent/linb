
Class('App', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Block)
            .host(t,"block1")
            .setLeft(110)
            .setTop(60)
            .setWidth(487)
            .setHeight(259)
            .setResizable(true)
            .setBorder(true)
            );
            
            t.block1.attach(
            (new u.TimeLine)
            .host(t,"timeline1")
            .setDock("fill")
            );
            
            return n;
            // ]]code created by designer
        }
    }
});