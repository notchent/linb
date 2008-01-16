Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.List","linb.UI.Label","linb.UI.Gallery"],

        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Label)
            .host(t,"label1")
            .setLeft(208)
            .setTop(16)
            .setWidth(336)
            .setHAlign("left")
            .setCaption("b")
            );

            f(
            (new u.List)
            .host(t,"list2")
            .setLeft(290)
            .setTop(60)
            .setItems([{"id":"item a","caption":"item a","tips":"item a"},{"id":"item b","caption":"item b","tips":"item b"},{"id":"item c","caption":"item c","tips":"item c"}])
            .setDisabled(true)
            .onItemSelected("_list5_onitemselected")
            );

            f(
            (new u.List)
            .host(t,"list5")
            .setLeft(290)
            .setTop(240)
            .setItems([])
            .setListKey("test")
            .onItemSelected("_list5_onitemselected")
            );

            f(
            (new u.List)
            .host(t,"list3")
            .setLeft(140)
            .setTop(240)
            .setItems([{"id":"item a","caption":"<b>long</b> long long item a","tips":"item a"},{"id":"item b","caption":"<span style='color:red'>long</span> long long item b","tips":"item b"},{"id":"item c","caption":"<span style='font-size:20px'>long</span> long long item c","tips":"item c"}])
            .onItemSelected("_list5_onitemselected")
            );

            f(
            (new u.List)
            .host(t,"list1")
            .setDock("left")
            .setItems([{"id":"item a","caption":"item a","icon":"img/demo.gif"},{"id":"item b","caption":"item b","icon":"img/demo.gif"},{"id":"item c","caption":"item c","icon":"img/demo.gif"}])
            .setListKey("test")
            .setSelMode('multi')
            .onItemSelected("_list5_onitemselected")
            );

            f(
            (new u.List)
            .host(t,"list4")
            .setLeft(140)
            .setTop(56)
            .setItems([{"id":"item a","caption":"item a","icon":"img/demo.gif"},{"id":"item b","caption":"item b","icon":"img/demo.gif"},{"id":"item c","caption":"item c","icon":"img/demo.gif"}])
            .setMaxHeight("200")
            .onItemSelected("_list5_onitemselected")
            );

            f(
            (new u.Gallery)
            .host(t,"gallery3")
            .setLeft(470)
            .setTop(120)
            .setWidth(284)
            .setHeight(167)
            .setItems([{"id":"a","caption":"itema","icon":"img/demo.gif","comment":"item a comment"},{"id":"b","caption":"itemb","icon":"img/demo.gif","comment":"item b comment"},{"id":"c","caption":"itemc","icon":"img/demo.gif","comment":"item c comment"},{"id":"d","caption":"itemd","icon":"img/demo.gif","comment":"item d comment"},{"id":"e","caption":"iteme","icon":"img/demo.gif","comment":"item e comment"},{"id":"f","caption":"itemf","icon":"img/demo.gif","comment":"item f comment"}])
            .setItemWidth("64")
            .setItemHeight("64")
            .onItemSelected("_list5_onitemselected")
            );

            return n;
            // ]]code created by designer
        },
        _list5_onitemselected:function (profile, item, src) {
            this.label1.setCaption(profile.boxing().getUIValue());
        }
    }
});