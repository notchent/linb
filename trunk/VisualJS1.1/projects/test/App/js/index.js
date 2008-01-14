
Class('App', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.ComboInput)
            .host(t,"timeTo")
            .setLeft(336)
            .setTop(30)
            .setWidth(48)
            .setItems([])
            .setValue("00:00")
            .setType("timepicker")
            );
            
            f(
            (new u.ComboInput)
            .host(t,"timeFrom")
            .setLeft(150)
            .setTop(30)
            .setWidth(48)
            .setItems([])
            .setValue("00:00")
            .setType("timepicker")
            );
            
            f(
            (new u.TimeLine)
            .host(t,"timeline1")
            .setLeft(30)
            .setTop(146)
            );
            
            f(
            (new u.ComboInput)
            .host(t,"dateTo")
            .setLeft(228)
            .setTop(30)
            .setItems([])
            .setType("datepicker")
            .setWidth(106)
            );
            
            f(
            (new u.ComboInput)
            .host(t,"dateFrom")
            .setLeft(42)
            .setTop(30)
            .setItems([])
            .setType("datepicker")
            .setWidth(106)
            );
            
            f(
            (new u.Block)
            .host(t,"block1")
            .setLeft(441)
            .setTop(59)
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
            
            f(
            (new u.Button)
            .host(t,"button3")
            .setLeft(563)
            .setTop(36)
            .setCaption("drag me to calendar")
            .afterCreated("_button3_aftercreated")
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