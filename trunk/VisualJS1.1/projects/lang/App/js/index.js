Class('App', 'linb.Com',{
    Instance:{
        langKey:'app',
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Button","linb.UI.RadioBox"],
        _radiobox1_onitemselected:function (profile, item, src) {
            linb.reLang(item.id);
            linb.message(linb.getRes('app.message'))
        },
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Button)
            .host(t,"button5")
            .setLeft(250)
            .setTop(30)
            .setCaption("$app.caption")
            .setTips("$app.tips")
            );
            
            f(
            (new u.RadioBox)
            .host(t,"radiobox1")
            .setValue("en")
            .setLeft(240)
            .setTop(90)
            .setItems([{"id":"en","caption":"English"},{"id":"cn","caption":"Chniese"}])
            .setHeight(60)
            .onItemSelected("_radiobox1_onitemselected")
            );
            
            return n;
            // ]]code created by designer
        }
    }
});