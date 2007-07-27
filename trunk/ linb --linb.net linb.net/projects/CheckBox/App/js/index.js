Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.CheckBox","linb.UI.Label","linb.UI.PanelBar","linb.UI.Button","linb.UI.Group"],
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];
            
            this.checkbox5 = (new linb.UI.CheckBox)
            .alias("checkbox5").host(this)
            .setLeft(190).setTop(100).setCaption("checkbox1").setIcon("img/demo.gif")
            ;
            this.nodes.push(this.checkbox5.get(0));
            
            this.checkbox4 = (new linb.UI.CheckBox)
            .alias("checkbox4").host(this)
            .setLeft(40).setTop(100).setCaption("checkbox1").setWidth(130).setHeight(30).setShadow(true).setResizable(true)
            ;
            this.nodes.push(this.checkbox4.get(0));
            
            this.checkbox6 = (new linb.UI.CheckBox)
            .alias("checkbox6").host(this)
            .setLeft(40).setTop(220).setCaption("event")
            .afterValueUpdated("_checkbox_aftervalueupdated")
            ;
            this.nodes.push(this.checkbox6.get(0));
            
            this.checkbox1 = (new linb.UI.CheckBox)
            .alias("checkbox1").host(this)
            .setLeft(40).setTop(40).setCaption("checkbox1")
            ;
            this.nodes.push(this.checkbox1.get(0));
            
            this.checkbox3 = (new linb.UI.CheckBox)
            .alias("checkbox3").host(this)
            .setLeft(440).setTop(120).setCaption("checkbox2").setWidth(190).setHeight(27).setBorder(true).setHAlign("right")
            ;
            this.nodes.push(this.checkbox3.get(0));
            
            this.checkbox2 = (new linb.UI.CheckBox)
            .alias("checkbox2").host(this)
            .setLeft(190).setTop(40).setCaption("checkbox2").setWidth(190).setHeight(27).setBorder(true)
            ;
            this.nodes.push(this.checkbox2.get(0));
            
            return this.nodes;
            // ]]code creted by designer
        },_checkbox_aftervalueupdated:function (profile, oldValue, newValue) {
            linb.UI.CheckBox.getAll().updateUIValue(newValue);
        }
    }
});