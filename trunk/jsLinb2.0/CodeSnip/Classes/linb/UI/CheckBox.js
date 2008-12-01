Class('App.linb_UI_CheckBox', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        required:["linb.UI.CheckBox"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.CheckBox)
                .host(host,"checkbox5")
                .setLeft(50)
                .setTop(110)
                .setWidth(190)
                .setHeight(30)
                .setCaption("with image")
                .setImage("img/demo.gif")
            );
            
            append((new linb.UI.CheckBox)
                .host(host,"checkbox4")
                .setLeft(50)
                .setTop(160)
                .setWidth(190)
                .setHeight(30)
                .setShadow(true)
                .setResizer(true)
                .setCaption("with shadow")
            );
            
            append((new linb.UI.CheckBox)
                .host(host,"checkbox6")
                .setLeft(50)
                .setTop(210)
                .setWidth(190)
                .setHeight(30)
                .setCaption("Check me to check all")
                .afterUIValueSet("_checkbox_aftervalueupdated")
            );
            
            append((new linb.UI.CheckBox)
                .host(host,"checkbox1")
                .setLeft(270)
                .setTop(70)
                .setWidth(190)
                .setCaption("Cant check me")
                .beforeUIValueSet("_checkbox1_beforeuivalueset")
            );
            
            append((new linb.UI.CheckBox)
                .host(host,"checkbox3")
                .setLeft(50)
                .setTop(260)
                .setWidth(190)
                .setHeight(27)
                .setBorder(true)
                .setResizer(true)
                .setCaption("Right Alignment")
                .setHAlign("right")
            );
            
            append((new linb.UI.CheckBox)
                .host(host,"checkbox2")
                .setLeft(50)
                .setTop(70)
                .setWidth(190)
                .setHeight(27)
                .setBorder(true)
                .setCaption("with border")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, _checkbox_aftervalueupdated:function (profile, oldValue, newValue) {
            linb.UI.CheckBox.getAll().setUIValue(newValue);
        }, 
        _checkbox1_beforeuivalueset:function (profile, oldValue, newValue) {
            return false;
        }
    }
});