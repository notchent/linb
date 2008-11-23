
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        //"linb.Tips","linb.UI.Resizer","linb.UI.Border","linb.UI.Shadow"
        required:["linb.UI.ProgressBar", "linb.UI.Button", "linb.UI.Pane", "linb.UI.Panel"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
          
            
            append((new linb.UI.Panel)
                .host(host,"panel2")
                .setLeft(0)
                .setTop(0)
                .setZIndex(1)
                .setCaption("panel2")
                .setBarHeight("55")
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
                    value=1;
                pb.setValue(value, true);
                if(value==100)
                    linb.Thread.abort(theadid);
            },null,null,true).start();
        }
    }
});