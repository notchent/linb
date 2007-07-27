Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Panel","linb.UI.TreeBar","linb.UI.Block"],

        _treebar1_onitemselected:function (profile, item, src) {
            linb.message(profile.boxing().getUIValue() + ' seleted');
        },
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.panel3 = (new linb.UI.Panel)
            .alias("panel3").host(this)
            .setLeft(100).setTop(370).setWidth(250)
            ;
            this.nodes.push(this.panel3.get(0));

            this.treebar5 = (new linb.UI.TreeBar)
            .alias("treebar5").host(this)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .onItemSelected("_treebar1_onitemselected")
            ;
            this.panel3.attach(this.treebar5);

            this.panel2 = (new linb.UI.Panel)
            .alias("panel2").host(this)
            .setLeft(100).setTop(180).setWidth(250).setHeight(140)
            ;
            this.nodes.push(this.panel2.get(0));

            this.treebar3 = (new linb.UI.TreeBar)
            .alias("treebar3").host(this)
            .setValue(null).setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"},{"id":"d","caption":"itemd","tips":"item d","group":true,"iniFold":true,"sub":[{"id":"da","caption":"suba"},{"id":"db","caption":"subb"},{"id":"dc","caption":"subc"}]}]).setIniFold(false).setTabindex("5")
            .onItemSelected("_treebar1_onitemselected")
            ;
            this.panel2.attach(this.treebar3);

            this.panel1 = (new linb.UI.Panel)
            .alias("panel1").host(this)
            .setLeft(100).setTop(20).setWidth(250).setHeight(140)
            ;
            this.nodes.push(this.panel1.get(0));

            this.treebar1 = (new linb.UI.TreeBar)
            .alias("treebar1").host(this)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .onItemSelected("_treebar1_onitemselected")
            ;
            this.panel1.attach(this.treebar1);

            this.block1 = (new linb.UI.Block)
            .alias("block1").host(this)
            .setLeft(440).setTop(20).setWidth(250).setHeight(140).setResizable(true).setBorder(true)
            ;
            this.nodes.push(this.block1.get(0));

            this.treebar2 = (new linb.UI.TreeBar)
            .alias("treebar2").host(this)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}]).setGroup(true)
            .onItemSelected("_treebar1_onitemselected")
            ;
            this.block1.attach(this.treebar2);

            this.block2 = (new linb.UI.Block)
            .alias("block2").host(this)
            .setLeft(440).setTop(180).setWidth(250).setHeight(140).setResizable(true).setBorder(true)
            ;
            this.nodes.push(this.block2.get(0));

            this.treebar4 = (new linb.UI.TreeBar)
            .alias("treebar4").host(this)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}]).setSelMode("multi")
            .onItemSelected("_treebar1_onitemselected")
            ;
            this.block2.attach(this.treebar4);
            return this.nodes;
            // ]]code creted by designer
        }
    }
});