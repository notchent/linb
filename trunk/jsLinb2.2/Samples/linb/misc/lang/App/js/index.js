Class('App', 'linb.Com',{
    Instance:{
        langKey:'app', 
        _radiobox1_onitemselected:function (profile, item, src) {
            linb.setLang(item.id, function(){
                linb.message(linb.getRes('app.message'))
            });
        }, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Button)
                .host(host,"button5")
                .setTips("$app.tips")
                .setLeft(60)
                .setTop(20)
                .setCaption("$app.caption")
            );
            
            append((new linb.UI.RadioBox)
                .host(host,"radiobox1")
                .setItems([{"id":"en", "caption":"English"}, {"id":"cn", "caption":"Chniese"}])
                .setLeft(290)
                .setTop(420)
                .setHeight(60)
                .setValue("en")
                .onItemSelected("_radiobox1_onitemselected")
            );
            
            append((new linb.UI.List)
                .host(host,"list4")
                .setItems([{"id":"a", "caption":"$app.list.a"}, {"id":"b", "caption":"$app.list.b"}, {"id":"c", "caption":"$app.list.c"}, {"id":"e", "caption":"$app.list.d"}])
                .setLeft(60)
                .setTop(50)
                .setHeight(80)
            );
            
            append((new linb.UI.DatePicker)
                .host(host,"datepicker1")
                .setLeft(500)
                .setTop(230)
            );
            
            append((new linb.UI.TimePicker)
                .host(host,"timepicker1")
                .setLeft(260)
                .setTop(230)
            );
            
            append((new linb.UI.ColorPicker)
                .host(host,"colorpicker1")
                .setLeft(40)
                .setTop(140)
                .setValue("A0532D")
            );
            
            append((new linb.UI.TimeLine)
                .host(host,"timeline1")
                .setLeft(260)
                .setTop(10)
                .setWidth(440)
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }
    }
});