
Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Button","linb.UI.CheckBox","linb.UI.Group","linb.UI.Block"],
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];
            
            this.group2 = (new linb.UI.Group)
            .alias("group2").host(this)
            .setLeft(390).setTop(50).setWidth(310).setHeight(230).setCaption("group2")
            ;
            this.nodes.push(this.group2.get(0));
            
            this.button10 = (new linb.UI.Button)
            .alias("button10").host(this)
            .setLeft(140).setTop(70).setWidth(156).setHeight(23).setCaption("button10")
            .onClick("_button10_onclick")
            ;
            this.group2.attach(this.button10);
            
            this.checkbox1 = (new linb.UI.CheckBox)
            .alias("checkbox1").host(this)
            .setLeft(140).setTop(130).setWidth(156).setHeight(23).setCaption("checkbox1")
            ;
            this.group2.attach(this.checkbox1);
            
            this.block2 = (new linb.UI.Block)
            .alias("block2").host(this)
            .setLeft(40).setTop(60).setWidth(290).setHeight(140).setBorder(true)
            ;
            this.nodes.push(this.block2.get(0));
            
            this.button18 = (new linb.UI.Button)
            .alias("button18").host(this)
            .setLeft(70).setTop(30).setWidth(156).setHeight(23).setCaption("button10")
            .onClick("_button10_onclick")
            ;
            this.block2.attach(this.button18);
            
            this.checkbox6 = (new linb.UI.CheckBox)
            .alias("checkbox6").host(this)
            .setLeft(70).setTop(90).setWidth(156).setHeight(23).setCaption("checkbox1")
            ;
            this.block2.attach(this.checkbox6);
            
            return this.nodes;
            // ]]code creted by designer
        },
        _button10_onclick:function (profile, e, value) {
            linb.message('clicked');
        }
    }
});