
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Gallery","linb.UI.LinkList","linb.UI.FoldingList","linb.UI.RadioBox"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.FoldingList)
            .host(t,"FoldingList1")
            .setLeft(74)
            .setTop(85)
            .setWidth(280)
            .setHeight(110)
            .setItems([{"id":"a","caption":"itema","title":"item a","text":"text1"},{"id":"b","caption":"itemb","title":"item b","text":"text2"},{"id":"c","caption":"itemc","title":"item c","text":"text3"}])
            );

            f(
            (new u.LinkList)
            .host(t,"linklist1")
            .setLeft(430)
            .setTop(40)
            .setWidth(321)
            .setHeight(30)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .onItemClick("_linklist1_onitemclick")
            );

            f(
            (new u.RadioBox)
            .host(t,"radiobox1")
            .setLeft(70)
            .setTop(40)
            .setWidth(280)
            .setHeight(27)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            );

            f(
            (new u.Gallery)
            .host(t,"gallery2")
            .setLeft(434)
            .setTop(95)
            .setWidth(270)
            .setHeight(270)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setItemWidth("120")
            .setItemHeight("80")
            );

            return n;
            // ]]code created by designer
        },
        _linklist1_onitemclick:function (profile, item, src) {
            alert('"' + item.id + '" clicked')
        }
    }
});