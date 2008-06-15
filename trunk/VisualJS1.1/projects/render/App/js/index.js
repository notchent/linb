Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Button","linb.UI.Tabs","linb.UI.Layout"],

        _button5_onclick:function (profile, e, value) {
            //alias must be equal to target id
            (new linb.UI.Tabs({dock:'none'})).alias('tab').render();
            (new linb.UI.Layout({dock:'none'})).alias('layout').render();
            profile.boxing().setDisabled(true);
        },
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Button)
            .host(t,"button5")
            .setLeft(290)
            .setTop(250)
            .setCaption("render")
            .onClick("_button5_onclick")
            );
            
            return n;
            // ]]code created by designer
        }
    }
});