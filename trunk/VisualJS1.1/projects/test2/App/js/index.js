
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        //"linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"
        required:["linb.UI.TimePicker","linb.UI.Div","linb.UI.ComboInput"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.TimePicker)
            .host(t,"timepicker1")
            .setLeft(82)
            .setTop(61)
            .setHeight(130)
            .setValue("23:45")
            .afterValueUpdated("_timepicker1_aftervalueupdated")
            );
            
            f(
            (new u.Div)
            .host(t,"div9")
            .setLeft(140)
            .setTop(20)
            .setWidth(240)
            .setHeight(32)
            );
            
            f(
            (new u.ComboInput)
            .host(t,"comboinput2")
            .setLeft(450)
            .setTop(210)
            .setType("timepicker")
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            );
            
            return n;
            // ]]code created by designer
        },
        _timepicker1_aftervalueupdated:function (profile, oldValue, newValue, showValue) {
            this.div9.setHtml(newValue)
        }
    }
});