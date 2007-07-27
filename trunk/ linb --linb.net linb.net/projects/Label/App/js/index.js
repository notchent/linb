Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Button","linb.UI.Label"],
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.label4 = (new linb.UI.Label)
            .alias("label4").host(this)
            .setLeft(64).setTop(192).setWidth(232).setHeight(32).setCaption("<strong>label</strong> (center/middle)").setBorder(true).setHAlign("center")
            ;
            this.nodes.push(this.label4.get(0));

            this.label2 = (new linb.UI.Label)
            .alias("label2").host(this)
            .setLeft(64).setTop(56).setWidth(224).setHeight(32).setBorder(true).setCaption("label with border")
            ;
            this.nodes.push(this.label2.get(0));

            this.label5 = (new linb.UI.Label)
            .alias("label5").host(this)
            .setLeft(64).setTop(96).setWidth(224).setHeight(32).setShadow(true).setBorder(true).setCaption("label with border&shadow")
            ;
            this.nodes.push(this.label5.get(0));

            this.label6 = (new linb.UI.Label)
            .alias("label6").host(this)
            .setLeft(64).setTop(232).setWidth(232).setHeight(64).setCaption("<strong>label</strong> (left/bottom)").setBorder(true).setHAlign("left").setVAlign("bottom")
            ;
            this.nodes.push(this.label6.get(0));

            this.label7 = (new linb.UI.Label)
            .alias("label7").host(this)
            .setLeft(632).setTop(128).setWidth(136).setHeight(80).setCaption("resizable label").setBorder(true).setHAlign("center").setResizable(true)
            ;
            this.nodes.push(this.label7.get(0));

            this.label9 = (new linb.UI.Label)
            .alias("label9").host(this)
            .setLeft(336).setTop(56).setWidth(224).setHeight(32).setBorder(true).setCaption("label (exStyle:'cursor:pointer')")
            .setCustomAppearance({KEY:'cursor:pointer'})
            ;
            this.nodes.push(this.label9.get(0));

            this.label10 = (new linb.UI.Label)
            .alias("label10").host(this)
            .setLeft(336).setTop(96).setWidth(224).setHeight(32).setBorder(true).setCaption("label with icon").setIcon("img/demo.gif")
            ;
            this.nodes.push(this.label10.get(0));

            this.label11 = (new linb.UI.Label)
            .alias("label11").host(this)
            .setLeft(280).setTop(184).setWidth(280).setHeight(72).setBorder(true).setCaption("label (zIndex:2)").setZIndex("2")
            ;
            this.nodes.push(this.label11.get(0));

            this.label1 = (new linb.UI.Label)
            .alias("label1").host(this)
            .setLeft(64).setTop(16).setWidth(224).setHeight(32).setCaption("normal label")
            ;
            this.nodes.push(this.label1.get(0));

            this.label3 = (new linb.UI.Label)
            .alias("label3").host(this)
            .setLeft(64).setTop(144).setWidth(224).setHeight(32).setCaption("label with shadow text").setShadowText(true).setFontSize("16px").setFontWeight("bold")
            ;
            this.nodes.push(this.label3.get(0));

            this.label12 = (new linb.UI.Label)
            .alias("label12").host(this)
            .setLeft(280).setTop(272).setWidth(280).setHeight(64).setBorder(true).setCaption("label (set background in afterCreated event)").setZIndex("2")
            .afterCreated("_label12_aftercreated")
            ;
            this.nodes.push(this.label12.get(0));
            return this.nodes;
            // ]]code creted by designer
        },
        _label12_aftercreated:function (profile) {
             profile.getSubNode(profile.keys.BORDER).background('#fff');
        }
    }
});