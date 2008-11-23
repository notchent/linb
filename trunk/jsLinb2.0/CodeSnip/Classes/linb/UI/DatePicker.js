 Class('App.linb_UI_DatePicker', 'linb.Com',{
    Instance:{
        base:["linb.UI"],
        required:["linb.UI.Div","linb.UI.DatePicker"],
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host = this,
                children = [],
                append = function(child){
                    children.push(child.get(0))
                };
            
            append((new linb.UI.DatePicker)
                .host(host,"datepicker1")
                .setLeft(100)
                .setTop(100)
                .setCloseBtn(false)
                .afterUIValueSet("_datepicker1_aftervalueupdated")
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
        _datepicker1_aftervalueupdated:function (profile, oldValue, newValue) {
            this.div.setHtml(newValue)
        }
    }
});