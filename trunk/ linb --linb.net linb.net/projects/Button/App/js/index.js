Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Button","linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"],
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.button13 = (new linb.UI.Button)
            .alias("button13").host(this)
            .setCaption("dock right").setDock("right").setWidth(80)
            ;
            this.nodes.push(this.button13.get(0));

            this.button11 = (new linb.UI.Button)
            .alias("button11").host(this)
            .setCaption("dock top2").setDock("top").setDockOrder("2")
            ;
            this.nodes.push(this.button11.get(0));

            this.button14 = (new linb.UI.Button)
            .alias("button14").host(this)
            .setCaption("dock bottom").setDock("bottom")
            ;
            this.nodes.push(this.button14.get(0));

            this.button15 = (new linb.UI.Button)
            .alias("button15").host(this)
            .setLeft(100).setTop(70).setCaption("left,top").setWidth(100).setHeight(90).setHAlign("left")
            ;
            this.nodes.push(this.button15.get(0));

            this.button18 = (new linb.UI.Button)
            .alias("button18").host(this)
            .setLeft(230).setTop(70).setCaption("middle,center").setWidth(100).setHeight(90).setVAlign("middle")
            .beforeClickEffect("_button18_beforeclickeffect")
            ;
            this.nodes.push(this.button18.get(0));

            this.button19 = (new linb.UI.Button)
            .alias("button19").host(this)
            .setLeft(360).setTop(70).setCaption("right,bottom").setWidth(100).setHeight(90).setHAlign("right").setVAlign("bottom")
            .beforeHoverEffect("_button19_beforehovereffect")
            ;
            this.nodes.push(this.button19.get(0));

            this.button20 = (new linb.UI.Button)
            .alias("button20").host(this)
            .setLeft(100).setTop(190).setCaption("border").setWidth(100).setHeight(90).setBorder(true)
            ;
            this.nodes.push(this.button20.get(0));

            this.button21 = (new linb.UI.Button)
            .alias("button21").host(this)
            .setLeft(230).setTop(190).setCaption("border,resizable").setWidth(170).setHeight(120).setBorder(true).setResizable(true)
            ;
            this.nodes.push(this.button21.get(0));

            this.button22 = (new linb.UI.Button)
            .alias("button22").host(this).appearance("link")
            .setLeft(90).setTop(340).setWidth(270).setCaption("appearance : link")
            ;
            this.nodes.push(this.button22.get(0));

            this.button23 = (new linb.UI.Button)
            .alias("button23").host(this).appearance("block")
            .setLeft(90).setTop(370).setWidth(270).setCaption("appearance : block")
            ;
            this.nodes.push(this.button23.get(0));

            this.button24 = (new linb.UI.Button)
            .alias("button24").host(this).behavior("dblclick")
            .setLeft(90).setTop(400).setWidth(270).setCaption("behavior : dblclick")
            .onClick("_button24_onclick")
            ;
            this.nodes.push(this.button24.get(0));

            this.button25 = (new linb.UI.Button)
            .alias("button25").host(this)
            .setLeft(90).setTop(430).setWidth(270).setCaption("behavior : default")
            .onClick("_button25_onclick")
            ;
            this.nodes.push(this.button25.get(0));

            this.button28 = (new linb.UI.Button)
            .alias("button28").host(this)
            .setLeft(480).setTop(340).setCaption("toggle button").setToggleKey("toggleButton")
            .onToggle("_button28_ontoggle")
            ;
            this.nodes.push(this.button28.get(0));

            this.button29 = (new linb.UI.Button)
            .alias("button29").host(this)
            .setLeft(440).setTop(190).setCaption("shadow").setWidth(100).setHeight(90).setShadow(true)
            ;
            this.nodes.push(this.button29.get(0));

            this.button10 = (new linb.UI.Button)
            .alias("button10").host(this)
            .setDock("top").setCaption("dock top")
            ;
            this.nodes.push(this.button10.get(0));

            this.button30 = (new linb.UI.Button)
            .alias("button30").host(this)
            .setLeft(550).setTop(100).setCaption("with icon").setIcon("img/demo.gif")
            ;
            this.nodes.push(this.button30.get(0));

            this.button12 = (new linb.UI.Button)
            .alias("button12").host(this)
            .setCaption("dock left").setDock("left").setWidth(70)
            ;
            this.nodes.push(this.button12.get(0));

            this.button20 = (new linb.UI.Button)
            .alias("button20").host(this)
            .setLeft(480).setTop(380).setCaption("disabled").setToggleKey("toggleButton").setDisabled(true)
            .onToggle("_button28_ontoggle")
            ;
            this.nodes.push(this.button20.get(0));

            return this.nodes;
            // ]]code creted by designer
        },
        _button25_onclick:function (profile, e, value) {
            linb.message('clicked');
        },
        _button24_onclick:function (profile, e, value) {
            linb.message('dbl clicked');
        },
        _button28_ontoggle:function (profile, e, value, toggleKey) {
            linb.message(toggleKey + ' toggle to ' + value);
        },
        _button19_beforehovereffect:function (profile, item, src, type) {
            linb.message(type);
            return false;
        },
        _button18_beforeclickeffect:function (profile, item, src, type) {
            linb.message(type);
            return false;
        }
    }
});