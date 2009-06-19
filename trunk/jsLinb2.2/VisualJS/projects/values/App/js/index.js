Class('App', 'linb.Com',{
    Instance:{
        events:{"onReady":"_onready"}, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Button)
                .host(host,"button3")
                .setLeft(250)
                .setTop(150)
                .setCaption("button3")
                .onClick("_button3_onclick")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput2")
                .setLeft(320)
                .setTop(80)
                .setItems([{"id":"a", "caption":"item a", "image":"img/demo.gif"}, {"id":"b", "caption":"item b", "image":"img/demo.gif"}, {"id":"c", "caption":"item c", "image":"img/demo.gif"}, {"id":"d", "caption":"item d", "image":"img/demo.gif"}])
                .setValue("a")
            );
            
            append((new linb.UI.Button)
                .host(host,"button4")
                .setLeft(250)
                .setTop(190) 
                .setCaption("button3")
                .onClick("_button4_onclick")
            );
            
            append((new linb.UI.Button)
                .host(host,"button5")
                .setLeft(250)
                .setTop(230)
                .setCaption("button5")
                .onClick("_button5_onclick")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _button3_onclick:function (profile, e, src, value) {
            this.comboinput2.setValue('b',true);
        }, 
        _button4_onclick:function (profile, e, src, value) {
            this.comboinput2.setItems(['1','2','3']).setValue('1');
        }, 
        _button5_onclick:function (profile, e, src, value) {
            this.comboinput2.setValue('3');
        }
    }
});