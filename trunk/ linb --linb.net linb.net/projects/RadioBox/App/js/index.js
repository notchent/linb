Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.RadioBox","linb.UI.Label"],

        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.label1 = (new linb.UI.Label)
            .alias("label1").host(this)
            .setLeft(272).setTop(136).setWidth(216).setCaption("")
            ;
            this.nodes.push(this.label1.get(0));

            this.radiobox2 = (new linb.UI.RadioBox)
            .alias("radiobox2").host(this)
            .setValue("a").setLeft(128).setTop(40).setItems([{"id":"a","caption":"a"},{"id":"b","caption":"b"},{"id":"c","caption":"c"},{"id":"d","caption":"d"},{"id":"e","caption":"e"},{"id":"f","caption":"f"},{"id":"g","caption":"g"}]).setResizable(true).setBorder(true).setWidth(72).setHeight(256)
            .beforeValueUpdated("_radiobox2_beforevalueupdated").afterValueUpdated("_radiobox2_aftervalueupdated")
            ;
            this.nodes.push(this.radiobox2.get(0));

            this.radiobox1 = (new linb.UI.RadioBox)
            .alias("radiobox1").host(this)
            .setValue("itema").setLeft(232).setTop(40).setItems([]).setListKey("test").setTips("radio box examples").setWidth(228).setHeight(40)
            .afterValueUpdated("_radiobox2_aftervalueupdated")
            ;
            this.nodes.push(this.radiobox1.get(0));

            this.radiobox3 = (new linb.UI.RadioBox)
            .alias("radiobox3").host(this)
            .setValue(null).setLeft(530).setTop(40).setWidth(118).setHeight(208).setItems([{"id":"a","caption":"itema"},{"id":"b","caption":"itemb"},{"id":"c","caption":"itemc"},{"id":"d","caption":"itemd"},{"id":"e","caption":"iteme"}])
            .afterValueUpdated("_radiobox2_aftervalueupdated")
            ;
            this.nodes.push(this.radiobox3.get(0));
            return this.nodes;
            // ]]code creted by designer
        },
        _radiobox2_beforevalueupdated:function (profile, oldValue, newValue, showValue) {
            if(newValue=='b'){
                linb.message("You can't select 'b'");
                return false;
            }
        },
        _radiobox2_aftervalueupdated:function (profile, oldValue, newValue, showValue) {
            this.label1.setCaption('"'+ newValue + '" seleted.');
        }
    }
});