
Class('App', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.RichEditor)
                .host(host,"richeditor1")
                .setDisabled(true)
                .setLeft(50)
                .setTop(30)
            );
            
            append((new linb.UI.RichEditor)
                .host(host,"richeditor2")
                .setLeft(470)
                .setTop(30)
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        events:{}, 
        iniResource:function(com, threadid){
        }, 
        iniExComs:function(com, hreadid){
        }
    }
});