Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Block","linb.UI.ColLayout"],

        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Block)
            .host(t,"block4")
            .setLeft(60)
            .setTop(40)
            .setWidth(256)
            .setHeight(206)
            .setResizable(true)
            .setBorder(true)
            );
            
            t.block4.attach(
            (new u.ColLayout)
            .host(t,"collayout")
            .setLeft(0)
            .setTop(0)
            );

            return n;
            // ]]code created by designer
        }
    }
});