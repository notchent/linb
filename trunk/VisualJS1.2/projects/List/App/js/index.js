Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.List","linb.UI.Label","linb.UI.Gallery","linb.UI.Div"],

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
            .setLeft(370)
            .setTop(80)
            .setItems([{"id":"item a","caption":"item a","tips":"item a"},{"id":"item b1","caption":"item b1","tips":"item b1"},{"id":"item b2","caption":"item b2","tips":"item b2"},{"id":"item b3","caption":"item b3","tips":"item b3"},{"id":"item b4","caption":"item b4","tips":"item b4"},{"id":"item b5","caption":"item b5","tips":"item b5"},{"id":"item b6","caption":"item b6","tips":"item b6"},{"id":"item b7","caption":"item b7","tips":"item b7"},{"id":"item b8","caption":"item b8","tips":"item b8"},{"id":"item b9","caption":"item b9","tips":"item b9"},{"id":"item b0","caption":"item b0","tips":"item b0"},{"id":"item ba","caption":"item ba","tips":"item ba"},{"id":"item bb","caption":"item bb","tips":"item bb"},{"id":"item bc","caption":"item bc","tips":"item bc"},{"id":"item bd","caption":"item bd","tips":"item bd"},{"id":"item be","caption":"item be","tips":"item be"},{"id":"item bf","caption":"item bf","tips":"item bf"},{"id":"item bg","caption":"item bg","tips":"item bg"},{"id":"item bh","caption":"item bh","tips":"item bh"},{"id":"item c","caption":"item c","tips":"item c"}])
            .setDisabled(true)
            .setHeight(190)
            .onItemSelected("_list5_onitemselected")
            );
            
            f(
            (new u.List)
            .host(t,"list4")
            .setLeft(30) 
            .setTop(80)
            .setItems([{"id":"item a","caption":"item a","icon":"img/demo.gif"},{"id":"item b","caption":"item b","icon":"img/demo.gif"},{"id":"item c","caption":"item c","icon":"img/demo.gif"}])
            .setMaxHeight("200")
            .setHeight(190)
            .onItemSelected("_list5_onitemselected")
            );
            
            f(
            (new u.Gallery)
            .host(t,"gallery3")
            .setLeft(180)
            .setTop(310)
            .setWidth(284)
            .setHeight(167)
            .setItems([{"id":"a","caption":"itema","icon":"img/demo.gif","comment":"item a comment"},{"id":"b","caption":"itemb","icon":"img/demo.gif","comment":"item b comment"},{"id":"c","caption":"itemc","icon":"img/demo.gif","comment":"item c comment"},{"id":"d","caption":"itemd","icon":"img/demo.gif","comment":"item d comment"},{"id":"e","caption":"iteme","icon":"img/demo.gif","comment":"item e comment"},{"id":"f","caption":"itemf","icon":"img/demo.gif","comment":"item f comment"}])
            .setItemWidth("64")
            .setItemHeight("64")
            .onItemSelected("_list5_onitemselected")
            );
            
            f(
            (new u.Div)
            .host(t,"div36")
            .setLeft(40)
            .setTop(50)
            .setWidth(100)
            .setHeight(20)
            .setHtml("single select")
            );
            
            f(
            (new u.Div)
            .host(t,"div37")
            .setLeft(190)
            .setTop(50)
            .setWidth(100)
            .setHeight(20)
            .setHtml("multi select")
            );
            
            f(
            (new u.Div)
            .host(t,"div38")
            .setLeft(380)
            .setTop(50)
            .setWidth(100)
            .setHeight(20)
            .setHtml("disabled")
            );
            
            f(
            (new u.List)
            .host(t,"list3")
            .setLeft(530)
            .setTop(80)
            .setItems([{"id":"item a","caption":"<b>long</b> long long item a","tips":"item a"},{"id":"item b","caption":"<span style='color:red'>long</span> long long item b","tips":"item b"},{"id":"item c","caption":"<span style='font-size:20px'>long</span> long long item c","tips":"item c"}])
            .setHeight(190)
            .onItemSelected("_list5_onitemselected")
            );
            
            f(
            (new u.List)
            .host(t,"list1")
            .setItems([])
            .setListKey("test2")
            .setSelMode("multi")
            .setLeft(180)
            .setTop(80)
            
            .setHeight(190)
            .onItemSelected("_list5_onitemselected")
            );
            
            f(
            (new u.Div)
            .host(t,"div39")
            .setLeft(530)
            .setTop(50)
            .setWidth(100)
            .setHeight(20)
            .setHtml("custom item")
            );
            
            return n;
            // ]]code created by designer
        },
        _list5_onitemselected:function (profile, item, src) {
            this.label1.setCaption(profile.boxing().getUIValue());
            return false;
        }
    }
});