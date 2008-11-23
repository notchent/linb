 Class('App.linb_UI_Div', 'linb.Com',{
    Instance:{
        base:["linb.UI"], 
        required:["linb.UI.Div"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Div)
                .host(host,"div1")
                .setLeft(60)
                .setTop(40)
                .setHtml("text string")
            );
            
            append((new linb.UI.Div)
                .host(host,"div2")
                .setLeft(190)
                .setTop(40)
                .setHtml("<strong>html string</strong>")
                .onShowTips("_showtips")
                .setCustomStyle({"KEY":"background:#00ff00;border:solid 1px #888"})
            );
            
            append((new linb.UI.Div)
                .host(host,"div3")
                .setLeft(320)
                .setTop(40)
                .setRenderer(function(data, uidata){
                    uidata.html='[rederer]';
                })
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        },
        _showtips:function(profile, node, pos){
            linb.Tips.show(pos, 'div tips');
            return true;
        }
    }
});