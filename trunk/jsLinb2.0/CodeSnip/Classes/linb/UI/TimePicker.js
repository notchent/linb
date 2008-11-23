 Class('App.linb_UI_TimePicker', 'linb.Com',{
    Instance:{
        base:["linb.UI"],
        required:["linb.UI.Div","linb.UI.TimePicker"],
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host = this,
                children = [],
                append = function(child){
                    children.push(child.get(0))
                };
            
            append((new linb.UI.TimePicker)
                .host(host,"timepicker1")
                .setLeft(100)
                .setTop(100)
                .setCloseBtn(false)
                .afterUIValueSet("_timepicker1_aftervalueupdated")
            );
            
            append((new linb.UI.Div)
                .host(host,"div")
                .setLeft(100)
                .setTop(60)
                .setHeight(30)
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        },
        _timepicker1_aftervalueupdated:function (profile, oldValue, newValue) {
            this.div.setHtml(newValue)
        }
    }
});