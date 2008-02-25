Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.CheckBox"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.CheckBox)
            .host(t,"checkbox3")
            .setLeft(40)
            .setTop(260)
            .setCaption("Right Alignment")
            .setWidth(190)
            .setHeight(27)
            .setBorder(true)
            .setHAlign("right")
            .setResizable(true)
            );
            
            f(
            (new u.CheckBox)
            .host(t,"checkbox4")
            .setLeft(40)
            .setTop(160)
            .setCaption("Shadow")
            .setWidth(190)
            .setHeight(30)
            .setShadow(true)
            .setResizable(true)
            );
            
            f(
            (new u.CheckBox)
            .host(t,"checkbox5")
            .setLeft(40)
            .setTop(110)
            .setCaption("Check box with icon")
            .setIcon("img/demo.gif")
            .setWidth(190)
            .setHeight(30)
            );
            
            f(
            (new u.CheckBox)
            .host(t,"checkbox6")
            .setLeft(40)
            .setTop(210)
            .setCaption("Check me to fire an event")
            .setWidth(190)
            .setHeight(30)
            .afterValueUpdated("_checkbox_aftervalueupdated")
            );
            
            f(
            (new u.CheckBox)
            .host(t,"checkbox1")
            .setLeft(40)
            .setTop(40)
            .setCaption("checkbox1")
            .setWidth(190)
            );
            
            f(
            (new u.CheckBox)
            .host(t,"checkbox2")
            .setLeft(40)
            .setTop(70)
            .setCaption("Check box with border")
            .setWidth(190)
            .setHeight(27)
            .setBorder(true)
            );
            
            return n;
            // ]]code created by designer
        },_checkbox_aftervalueupdated:function (profile, oldValue, newValue) {
            linb.UI.CheckBox.getAll().updateUIValue(newValue);
        }
    }
});