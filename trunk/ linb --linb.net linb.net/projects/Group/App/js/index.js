Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Group","linb.UI.Button","linb.UI.Input"],
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.group2 = (new linb.UI.Group)
            .alias("group2").host(this)
            .setLeft(160).setTop(30).setWidth(174).setHeight(132).setResizable(true).setCaption("group2").setIcon("img/demo.gif").setTips("this is group2")
            ;
            this.nodes.push(this.group2.get(0));

            this.input2 = (new linb.UI.Input)
            .alias("input2").host(this)
            .setLeft(24).setTop(64)
            ;
            this.group2.attach(this.input2);

            this.button1 = (new linb.UI.Button)
            .alias("button1").host(this)
            .setLeft(24).setTop(24).setCaption("button1")
            ;
            this.group2.attach(this.button1);

            this.group3 = (new linb.UI.Group)
            .alias("group3").host(this)
            .setLeft(368).setTop(30).setWidth(320).setHeight(216).setCaption("group3")
            ;
            this.nodes.push(this.group3.get(0));

            this.group5 = (new linb.UI.Group)
            .alias("group5").host(this)
            .setLeft(200).setTop(32).setCaption("group5")
            ;
            this.group3.attach(this.group5);

            this.group4 = (new linb.UI.Group)
            .alias("group4").host(this)
            .setLeft(40).setTop(32).setCaption("group4")
            ;
            this.group3.attach(this.group4);

            this.group1 = (new linb.UI.Group)
            .alias("group1").host(this)
            .setLeft(160).setTop(240).setCaption("group1").setWidth(170).setHeight(108).setResizable(true).setBorder(true).setIcon("img/demo.gif")
            ;
            this.nodes.push(this.group1.get(0));

            this.input6 = (new linb.UI.Input)
            .alias("input6").host(this)
            .setLeft(30).setTop(50)
            ;
            this.group1.attach(this.input6);

            this.button16 = (new linb.UI.Button)
            .alias("button16").host(this)
            .setLeft(30).setTop(10).setCaption("button1")
            ;
            this.group1.attach(this.button16);
            return this.nodes;
            // ]]code creted by designer
        }
    }
});