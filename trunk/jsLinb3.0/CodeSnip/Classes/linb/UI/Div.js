 Class('App.linb_UI_Div', 'linb.Com',{
    Instance:{
        base:["linb.UI"], 
        required:["linb.UI.Div", "linb.UI.SButton"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Div)
                .host(host,"div1")
                .setWidth("auto")
                .setHeight(68)
                .setPosition("relative")
                .setHtml("text string")
                .setCustomStyle({"KEY":"border:solid 1px #888"})
            );
            
            append((new linb.UI.Div)
                .host(host,"div2")
                .setWidth("auto")
                .setHeight("auto")
                .setPosition("relative")
                .setHtml("<strong>auto height</strong>")
                .onShowTips("_showtips")
                .setCustomStyle({"KEY":"background:#00ff00;border:solid 1px #888"})
            );
            
            append((new linb.UI.Div)
                .host(host,"div3")
                .setWidth("auto")
                .setHeight(100)
                .setRenderer(function (data, uidata) {
                uidata.html = "[rederer]";
            })
                .setPosition("relative")
                .setCustomStyle({"KEY":"border:solid 1px #888"})
            );
            
            append((new linb.UI.SButton)
                .host(host,"sbutton1")
                .setLeft(40)
                .setTop(30)
                .setCaption("Add content")
                .onClick("_sbutton1_onclick")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _showtips:function(profile, node, pos){
            linb.Tips.show(pos, 'div tips');
            return true;
        }, 
        _sbutton1_onclick:function (profile, e, src, value) {
            var html=this.div2.getHtml();
            this.div2.setHtml(html+"<p>new line</p>")
        }
    }
});