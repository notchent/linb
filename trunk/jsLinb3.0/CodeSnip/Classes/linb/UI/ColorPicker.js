Class('App.linb_UI_ColorPicker', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        //"linb.Tips","linb.UI.Resizer","linb.UI.Border","linb.UI.Shadow"
        required:["linb.UI.Div", "linb.UI.ComboInput", "linb.UI.ColorPicker"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput3")
                .setLeft(30)
                .setTop(40)
                .setWidth(170)
                .setType("colorpicker")
                .setItems([{"id":"a", "caption":"itema", "tips":"item a"}, {"id":"b", "caption":"itemb", "tips":"item b"}, {"id":"c", "caption":"itemc", "tips":"item c"}])
                .afterUIValueSet("_comboinput3_aftervalueupdated")
            );
            
            append((new linb.UI.Div)
                .host(host,"div10")
                .setLeft(270)
                .setTop(90)
                .setWidth(160)
                .setHeight(140)
            );
            
            append((new linb.UI.ColorPicker)
                .host(host,"colorpicker3")
                .setLeft(440)
                .setTop(30)
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _comboinput3_aftervalueupdated:function (profile, oldValue, newValue) {
            this.div10.getRoot().css('background', newValue);
        }
    }
});