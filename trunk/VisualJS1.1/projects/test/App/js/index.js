
Class('App', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Block)
            .host(t,"block1")
            .setLeft(57)
            .setTop(18)
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
            
            f(
            (new u.Block)
            .host(t,"block2")
            .setLeft(66)
            .setTop(283)
            .setWidth(473)
            .setHeight(241)
            .setResizable(true)
            .setBorder(true)
            );
            
            t.block2.attach(
            (new u.DatePicker)
            .host(t,"datepicker2")
            .setDock("fill")
            );
            
            return n;
            // ]]code created by designer
        },
        required:["linb.UI.Block","linb.UI.TimeLine","linb.UI.DatePicker"]
    }
});