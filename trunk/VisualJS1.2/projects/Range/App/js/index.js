Class('App', 'linb.Com',{
    Instance:{
        required:["linb.UI.Range"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Range)
            .host(t,"range2")
            .setLeft(110)
            .setTop(158)
            .setUnit("%")
            .setSingle(true)
            .setValue("0:70")
            );

            f(
            (new u.Range)
            .host(t,"range1")
            .setLeft(110)
            .setTop(54)
            .setValue("1000:2000")
            .setMin(1000)
            .setMax(3000)
            .setUnit("$")
            );

            return n;
            // ]]code created by designer
        }
    }
});