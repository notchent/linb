Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Panel","linb.UI.TreeBar","linb.UI.Block"],

        _treebar1_onitemselected:function (profile, item, src) {
            linb.message(profile.boxing().getUIValue() + ' seleted');
        },
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Panel)
            .host(t,"panel1")
            .setLeft(100)
            .setTop(20)
            .setWidth(250)
            .setHeight(140)
            );

            t.panel1.attach(
            (new u.TreeBar)
            .host(t,"treebar1")
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .onItemSelected("_treebar1_onitemselected")
            );

            f(
            (new u.Panel)
            .host(t,"panel2")
            .setLeft(100)
            .setTop(180)
            .setWidth(250)
            .setHeight(140)
            );

            t.panel2.attach(
            (new u.TreeBar)
            .host(t,"treebar3")
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"},{"id":"d","caption":"itemd","tips":"item d","group":true,"iniFold":true,"sub":[{"id":"da","caption":"suba"},{"id":"db","caption":"subb"},{"id":"dc","caption":"subc"}]}])
            .setIniFold(false)
            .setTabindex("5")
            .onItemSelected("_treebar1_onitemselected")
            );

            f(
            (new u.Block)
            .host(t,"block1")
            .setLeft(440)
            .setTop(20)
            .setWidth(250)
            .setHeight(140)
            .setResizable(true)
            .setBorder(true)
            );

            t.block1.attach(
            (new u.TreeBar)
            .host(t,"treebar2")
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setGroup(true)
            .onItemSelected("_treebar1_onitemselected")
            );

            f(
            (new u.Panel)
            .host(t,"panel3")
            .setLeft(100)
            .setTop(370)
            .setWidth(250)
            );

            t.panel3.attach(
            (new u.TreeBar)
            .host(t,"treebar5")
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .onItemSelected("_treebar1_onitemselected")
            );

            f(
            (new u.Block)
            .host(t,"block2")
            .setLeft(440)
            .setTop(180)
            .setWidth(250)
            .setHeight(140)
            .setResizable(true)
            .setBorder(true)
            );

            t.block2.attach(
            (new u.TreeBar)
            .host(t,"treebar4")
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setSelMode("multi")
            .onItemSelected("_treebar1_onitemselected")
            );

            return n;
            // ]]code created by designer
        }
    }
});