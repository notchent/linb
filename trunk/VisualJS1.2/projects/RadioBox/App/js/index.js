Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.RadioBox","linb.UI.Label"],

        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Label)
            .host(t,"label1")
            .setLeft(272)
            .setTop(136)
            .setWidth(216)
            .setCaption("")
            );

            f(
            (new u.RadioBox)
            .host(t,"radiobox2")
            .setValue("a")
            .setLeft(128)
            .setTop(40)
            .setItems([{"id":"a","caption":"a"},{"id":"b","caption":"b"},{"id":"c","caption":"c"},{"id":"d","caption":"d"},{"id":"e","caption":"e"},{"id":"f","caption":"f"},{"id":"g","caption":"g"}])
            .setWidth(72)
            .setHeight(256)
            .beforeValueUpdated("_radiobox2_beforevalueupdated")
            .afterValueUpdated("_radiobox2_aftervalueupdated")
            );

            f(
            (new u.RadioBox)
            .host(t,"radiobox1")
            .setValue("itema")
            .setLeft(232)
            .setTop(40)
            .setItems([])
            .setListKey("test")
            .setWidth(228)
            .setHeight(40)
            .afterValueUpdated("_radiobox2_aftervalueupdated")
            );

            f(
            (new u.RadioBox)
            .host(t,"radiobox3")
            .setLeft(530)
            .setTop(40)
            .setWidth(118)
            .setHeight(208)
            .setItems([{"id":"a","caption":"itema"},{"id":"b","caption":"itemb"},{"id":"c","caption":"itemc"},{"id":"d","caption":"itemd"},{"id":"e","caption":"iteme"}])
            .afterValueUpdated("_radiobox2_aftervalueupdated")
            );

            return n;
            // ]]code created by designer
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