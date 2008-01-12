
Class('App', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.ComboInput)
            .host(t,"comboinput5")
            .setLeft(348)
            .setTop(120)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setType("datepicker")
            .setWidth(98)
            );
            
            f(
            (new u.ComboInput)
            .host(t,"comboinput4")
            .setLeft(262)
            .setTop(120)
            .setWidth(67)
            .setType("timepicker")
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            );
            
            f(
            (new u.ComboInput)
            .host(t,"comboinput2")
            .setLeft(162)
            .setTop(120)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setType("datepicker")
            .setWidth(98)
            );
            
            f(
            (new u.ComboInput)
            .host(t,"comboinput6")
            .setLeft(448)
            .setTop(120)
            .setWidth(67)
            .setType("timepicker")
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            );
            
            f(
            (new u.TimeLine)
            .host(t,"timeline1")
            .setLeft(150)
            .setTop(230)
            .setItems([{"id":"an","caption":"new","start":1200224448000,"end":1200583872000}])
            );
            
            return n;
            // ]]code created by designer
        },
        required:["linb.UI.Block","linb.UI.TimeLine","linb.UI.DatePicker","linb.UI.ComboInput"]
    }
});