
Class('App.linb_UI_ProgressBar', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        //"linb.Tips","linb.UI.Resizer","linb.UI.Border","linb.UI.Shadow"
        required:["linb.UI.ProgressBar", "linb.UI.Button"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.ProgressBar)
                .host(host,"progressbar1")
                .setLeft(50)
                .setTop(70)
                .setCaptionTpl('{value}% finished')
            );
            
            append((new linb.UI.ProgressBar)
                .host(host,"progressbar2")
                .setLeft(50)
                .setTop(110)
                .setHeight(31)
                .setShadow(true)
                .setValue(60)
            );
            
            append((new linb.UI.ProgressBar)
                .host(host,"progressbar3")
                .setLeft(50)
                .setTop(160)
                .setBorder(true)
                .setResizer(true)
                .setFillBG("red")
                .setValue(30)
            );
            
            append((new linb.UI.Button)
                .host(host,"button21")
                .setLeft(370)
                .setTop(70)
                .setCaption("start")
                .onClick("_button21_onclick")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _button21_onclick:function (profile, e, src, value) {
            var ns=this;
            linb.Thread(null,[_.fun()],300,function(threadid){
                var pb=ns.progressbar1,
                    value=pb.getValue();
                value+=10;
                if(value>=100)
                    value=100;
                pb.setValue(value, true);
                if(value==100)
                    linb.Thread.abort(threadid);
            },function(){
                ns.progressbar1.setValue(0,true);
            },null,true).start();
        }
    }
});