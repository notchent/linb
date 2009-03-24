
Class('App', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.ColorPicker)
                .host(host,"colorpicker1")
                .setLeft(330)
                .setTop(320)
            );
            
            append((new linb.UI.DatePicker)
                .host(host,"datepicker1")
                .setLeft(390)
                .setTop(110)
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }
    }
});