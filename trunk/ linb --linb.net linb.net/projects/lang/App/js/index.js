Class('App', 'linb.Page',{
    Instance:{
        langKey:'app',
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Button","linb.UI.RadioBox"],
        _radiobox1_onitemselected:function (profile, item, src) {
            this.reLang(item.id);
            linb.message(linb.getStr('app.message'))
        },
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.button5 = (new linb.UI.Button)
            .alias("button5").host(this)
            .setLeft(250).setTop(30).setCaption("$app.caption").setTips("$app.tips")
            ;
            this.nodes.push(this.button5.get(0));

            this.radiobox1 = (new linb.UI.RadioBox)
            .alias("radiobox1").host(this)
            .setValue("en").setLeft(240).setTop(90).setItems([{"id":"en","caption":"English"},{"id":"cn","caption":"Chniese"}])
            .onItemSelected("_radiobox1_onitemselected")
            ;
            this.nodes.push(this.radiobox1.get(0));
            return this.nodes;
            // ]]code creted by designer
        }
    }
});