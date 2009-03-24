 Class('App.linb_UI_Link', 'linb.Com',{
    Instance:{
        base:["linb.UI"], 
        required:["linb.UI.Link"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Link)
                .host(host,"link1")
                .setLeft(70)
                .setTop(50)
                .setCaption("link1")
            );
            
            append((new linb.UI.Link)
                .host(host,"link2")
                .setLeft(170)
                .setTop(50)
                .setCaption("click me")
                .onShowTips("_shotips")
                .onClick("_link2_onclick")
            );
            
            append((new linb.UI.Link)
                .host(host,"link3")
                .setDisabled(true)
                .setLeft(290)
                .setTop(50)
                .setCaption("disabled")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _link2_onclick:function (profile, e) {
            linb.message(profile.boxing().getCaption() + ' clicked')
        },
        _shotips:function(profile,node, pos){
            linb.Tips.show(pos, 'link tips');
            return true;
        }
    }
});