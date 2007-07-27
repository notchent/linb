Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Block","linb.UI.Layout","linb.UI.Panel","linb.UI.Button"],

        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.block4 = (new linb.UI.Block)
            .alias("block4").host(this)
            .setLeft(60).setTop(40).setWidth(258).setHeight(208).setResizable(true).setBorder(true)
            ;
            this.nodes.push(this.block4.get(0));

            this.layout12 = (new linb.UI.Layout)
            .alias("layout12").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"before","pos":"before","locked":false,"size":50,"min":50,"max":200,"cmd":true,"hide":false},{"id":"main","min":10,"hide":false},{"id":"after","pos":"after","locked":false,"size":60,"min":50,"max":200,"cmd":true,"height":60,"hide":true}])
            ;
            this.block4.attach(this.layout12);

            this.button3 = (new linb.UI.Button)
            .alias("button3").host(this)
            .setLeft(90).setTop(20).setCaption("button3")
            ;
            this.layout12.attach(this.button3, 'after');

            this.block6 = (new linb.UI.Block)
            .alias("block6").host(this)
            .setLeft(350).setTop(40).setWidth(338).setHeight(208).setBorder(true).setResizable(true)
            ;
            this.nodes.push(this.block6.get(0));

            this.layout13 = (new linb.UI.Layout)
            .alias("layout13").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"before","pos":"before","locked":false,"size":60,"min":50,"max":200,"cmd":true,"hide":false},{"id":"main","min":10,"hide":false},{"id":"after","pos":"after","locked":false,"size":60,"min":50,"max":200,"cmd":true,"height":60,"hide":false}]).setType("horizontal")
            ;
            this.block6.attach(this.layout13);

            this.Block3 = (new linb.UI.Block)
            .alias("Block3").host(this)
            .setLeft(64).setTop(260).setWidth(624).setHeight(300).setResizable(true).setBorder(true)
            ;
            this.nodes.push(this.Block3.get(0));

            this.layout8 = (new linb.UI.Layout)
            .alias("layout8").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"before","pos":"before","locked":false,"size":60,"min":50,"max":200,"hide":false,"cmd":true},{"id":"main","min":10},{"id":"after","pos":"after","locked":false,"size":82,"min":50,"max":200,"hide":false,"cmd":false}])
            ;
            this.Block3.attach(this.layout8);

            this.layout9 = (new linb.UI.Layout)
            .alias("layout9").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"before","pos":"before","locked":true,"size":50,"min":50,"max":200,"hide":false,"cmd":true},{"id":"before2","pos":"before","locked":false,"size":50,"min":50,"max":200,"hide":false,"cmd":true},{"id":"main","min":10,"hide":false},{"id":"after","pos":"after","locked":false,"size":63,"min":50,"max":200,"hide":false,"cmd":true}]).setType("horizontal")
            ;
            this.layout8.attach(this.layout9, 'main');
            return this.nodes;
            // ]]code creted by designer
        }
    }
});