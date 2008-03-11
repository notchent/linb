Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Block","linb.UI.Layout","linb.UI.Panel","linb.UI.Button"],

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
            (new u.Layout)
            .host(t,"layout12")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"before","pos":"before","locked":false,"size":50,"min":50,"max":200,"cmd":true,"hide":false},{"id":"main","min":10,"hide":false},{"id":"after","pos":"after","locked":false,"size":60,"min":50,"max":200,"cmd":true,"height":60,"hide":true}])
            );

            t.layout12.attach(
            (new u.Button)
            .host(t,"button3")
            .setLeft(90)
            .setTop(20)
            .setCaption("button3")
            , 'after');

            f(
            (new u.Block)
            .host(t,"block6")
            .setLeft(350)
            .setTop(40)
            .setWidth(338)
            .setHeight(208)
            .setBorder(true)
            .setResizable(true)
            );

            t.block6.attach(
            (new u.Layout)
            .host(t,"layout13")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"before","pos":"before","locked":false,"size":52,"min":50,"max":200,"cmd":true,"hide":false},{"id":"main","min":10,"hide":false},{"id":"after","pos":"after","locked":false,"size":123,"min":50,"max":200,"cmd":true,"height":60,"hide":false}])
            .setType("horizontal")
            );

            t.layout13.attach(
            (new u.Layout)
            .host(t,"layout8")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"before","pos":"before","locked":false,"size":60,"min":50,"max":200,"hide":false,"cmd":true},{"id":"main","min":10},{"id":"after","pos":"after","locked":false,"size":60,"min":50,"max":200,"hide":false,"cmd":true}])
            , 'main');

            f(
            (new u.Block)
            .host(t,"Block3")
            .setLeft(64)
            .setTop(260)
            .setWidth(624)
            .setHeight(300)
            .setResizable(true)
            .setBorder(true)
            );

            t.Block3.attach(
            (new u.Layout)
            .host(t,"layout8")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"before","pos":"before","locked":false,"size":50,"min":50,"max":200,"hide":false,"cmd":true},{"id":"main","min":10},{"id":"after","pos":"after","locked":false,"size":79,"min":50,"max":200,"hide":false,"cmd":false}])
            );

            t.layout8.attach(
            (new u.Layout)
            .host(t,"layout9")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"before","pos":"before","locked":true,"size":50,"min":50,"max":200,"hide":false,"cmd":true},{"id":"before2","pos":"before","locked":false,"size":50,"min":50,"max":200,"hide":false,"cmd":true},{"id":"main","min":10,"hide":false},{"id":"after","pos":"after","locked":false,"size":63,"min":50,"max":200,"hide":false,"cmd":true}])
            .setType("horizontal")
            , 'main');

            return n;
            // ]]code created by designer
        }
    }
});