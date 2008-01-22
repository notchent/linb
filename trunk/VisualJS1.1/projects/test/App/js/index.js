
Class('App', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Button)
            .host(t,"button3")
            .setLeft(380)
            .setTop(260)
            .setCaption("drag me to calendar")
            .afterCreated("_button3_aftercreated")
            );

            f(
            (new u.ComboInput)
            .host(t,"timeFrom")
            .setLeft(150)
            .setTop(30)
            .setWidth(48)
            .setValue("00:00")
            .setType("timepicker")
            );

            f(
            (new u.TimeLine)
            .host(t,"timeline2")
            .setLeft(40)
            .setTop(60)
            .setHeight(160)
            .setWidth(330)
            .setMinDate("2008-01-18T")
            .setMaxDate("2008-01-22T")
            .setMultiTasks(false)
            );

            f(
            (new u.ComboInput)
            .host(t,"timeTo")
            .setLeft(382)
            .setTop(30)
            .setWidth(48)
            .setValue("00:00")
            .setType("timepicker")
            );

            f(
            (new u.ComboInput)
            .host(t,"dateTo")
            .setLeft(274)
            .setTop(30)
            .setValue("2008-01-17T16:00:00Z")
            .setType("datepicker")
            .setWidth(106)
            );

            f(
            (new u.Block)
            .host(t,"block2")
            .setLeft(10)
            .setTop(290)
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
            );

            f(
            (new u.ComboInput)
            .host(t,"dateFrom")
            .setLeft(42)
            .setTop(30)
            .setValue("2008-01-17T16:00:00Z")
            .setType("datepicker")
            .setWidth(106)
            );

            f(
            (new u.Block)
            .host(t,"block1")
            .setLeft(440)
            .setTop(290)
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
            (new u.TimeLine)
            .host(t,"timeline3")
            .setLeft(490)
            .setTop(120)
            .setHeight(150)
            .setTimeSpanKey("1 m")
            .setSmallLabelCount(1)
            .setSmallLabelUnit("m")
            .setBigLabelCount(1)
            .setBigLabelUnit("q")
            .setTimeFormat("ymd")
            .setBigLabelFormat("yq")
            .setSmallLabelFormat("m")
            .setMultiTasks(true)
            .setCustomAppearance({"BORDER":"overflow:visible","VIEW":"overflow:visible"})
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