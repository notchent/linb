
Class('App', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.TimeLine)
            .host(t,"timeline1")
            .setLeft(30)
            .setTop(146)
            .setItems([{"id":"an","caption":"new","start":1200224448000,"end":1200583872000}])
            );
            
            f(
            (new u.ComboInput)
            .host(t,"comboinput4")
            .setLeft(142)
            .setTop(36)
            .setWidth(67)
            .setType("timepicker")
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            );
            
            f(
            (new u.ComboInput)
            .host(t,"comboinput5")
            .setLeft(228)
            .setTop(36)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setType("datepicker")
            .setWidth(98)
            );
            
            f(
            (new u.DatePicker)
            .host(t,"datepicker1")
            .setLeft(520)
            .setTop(27)
            );
            
            f(
            (new u.ComboInput)
            .host(t,"comboinput2")
            .setLeft(42)
            .setTop(36)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setType("datepicker")
            .setWidth(98)
            );
            
            f(
            (new u.Block)
            .host(t,"block1")
            .setLeft(520)
            .setTop(220)
            .setWidth(211)
            .setHeight(202)
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
            (new u.ComboInput)
            .host(t,"comboinput6")
            .setLeft(328)
            .setTop(36)
            .setWidth(67)
            .setType("timepicker")
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            );
            
            f(
            (new u.Button)
            .host(t,"button3")
            .setLeft(180)
            .setTop(90)
            .setCaption("drag me to calendar")
            .afterCreated("_button3_aftercreated")
            );
            
            return n;
            // ]]code created by designer
        },
        required:["linb.UI.Block","linb.UI.TimeLine","linb.UI.DatePicker","linb.UI.ComboInput","linb.UI.Calendar","linb.UI.Dialog","linb.UI.Button"],
        _button3_aftercreated:function (profile) {
            profile.boxing().dragable('KEY','iEvent','data');
        }
    }
});