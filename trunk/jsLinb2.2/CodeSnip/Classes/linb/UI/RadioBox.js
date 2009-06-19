Class('App.linb_UI_RadioBox', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.RadioBox","linb.UI.Label"],

        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host = this,
                children = [],
                append = function(child){
                    children.push(child.get(0))
                };
            
            append((new linb.UI.Label)
                .host(host,"label1")
                .setLeft(272)
                .setTop(136)
                .setWidth(216)
                .setCaption("")
            );
            
            append((new linb.UI.RadioBox)
                .host(host,"radiobox2")
                .setValue("a")
                .setLeft(128)
                .setTop(40)
                .setItems([{"id":"a","caption":"a"},{"id":"b","caption":"b"},{"id":"c","caption":"c"},{"id":"d","caption":"d"},{"id":"e","caption":"e"},{"id":"f","caption":"f"},{"id":"g","caption":"g"}])
                .setWidth(72)
                .setHeight(256)
                .beforeUIValueSet("_radiobox2_beforevalueupdated")
                .afterUIValueSet("_radiobox2_aftervalueupdated")
            );
            
            append((new linb.UI.RadioBox)
                .host(host,"radiobox3")
                .setLeft(230)
                .setTop(40)
                .setWidth(118)
                .setHeight(208)
                .setItems([{"id":"a","caption":"itema"},{"id":"b","caption":"itemb"},{"id":"c","caption":"itemc"},{"id":"d","caption":"itemd"},{"id":"e","caption":"iteme"}])
                .afterUIValueSet("_radiobox2_aftervalueupdated")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        },
        _radiobox2_beforevalueupdated:function (profile, oldValue, newValue) {
            if(newValue=='b'){
                linb.message("You can't select 'b'");
                return false;
            }
        },
        _radiobox2_aftervalueupdated:function (profile, oldValue, newValue) {
            this.label1.setCaption('"'+ newValue + '" select.');
        }
    }
});