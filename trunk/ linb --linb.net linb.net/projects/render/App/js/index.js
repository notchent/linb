Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
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
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.button5 = (new linb.UI.Button)
            .alias("button5").host(this)
            .setLeft(300).setTop(250).setCaption("render")
            .onClick("_button5_onclick")
            ;
            this.nodes.push(this.button5.get(0));
            return this.nodes;
            // ]]code creted by designer
        }
    }
});