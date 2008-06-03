
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        //"linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"
        required:["linb.UI.Div","linb.UI.ComboInput","linb.UI.ColorPicker"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.ComboInput)
            .host(t,"comboinput3")
            .setLeft(280)
            .setTop(250)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setType("colorpicker")
            .setWidth(170)
            .afterValueUpdated("_comboinput3_aftervalueupdated")
            );
            
            f(
            (new u.Div)
            .host(t,"div10")
            .setLeft(280)
            .setTop(90)
            .setWidth(160)
            .setHeight(140)
            );
            
            return n;
            // ]]code created by designer
        },
        _comboinput3_aftervalueupdated:function (profile, oldValue, newValue, showValue) {
            this.div10.reBoxing().setStyle('background', newValue);
        }
    }
});