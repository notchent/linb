
Class('App', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Block)
            .host(t,"block2")
            .setLeft(10)
            .setTop(80)
            .setWidth(420)
            .setHeight(304)
            .setResizable(true)
            .setBorder(true)
            );
            
            t.block2.attach(
            (new u.TimeLine)
            .host(t,"timeline1")
            .setLeft(70)
            .setTop(120)
            .setTimeSpanKey("2 h")
            .setDock("fill")
            .setDropKeys("iEvent")
            .setTimeFormat("mdhn")
            .setMultiTasks(true)
            .setItems([])
            );
            
            f(
            (new u.Button)
            .host(t,"button3")
            .setLeft(310)
            .setTop(30)
            .setCaption("drag me to calendar")
            .afterCreated("_button3_aftercreated")
            );
            
            f(
            (new u.Block)
            .host(t,"block1")
            .setLeft(440)
            .setTop(80)
            .setWidth(340)
            .setHeight(304)
            .setResizable(true)
            .setBorder(true)
            );
            
            t.block1.attach(
            (new u.Calendar)
            .host(t,"calendar1")
            .setLeft(10)
            .setTop(40)
            );
            
            return n;
            // ]]code created by designer
        },
        required:["linb.UI.Block","linb.UI.TimeLine","linb.UI.DatePicker","linb.UI.ComboInput","linb.UI.Calendar","linb.UI.Dialog","linb.UI.Button"],
        _button3_aftercreated:function (profile) {
            profile.boxing().dragable('iEvent','data');
        }
    }
});