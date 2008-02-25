
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        //"linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"
        required:["linb.UI.List","linb.UI.Button","linb.UI.PageBar","linb.UI.LinkList","linb.UI.Link","linb.UI.TreeBar","linb.UI.Div"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.List)
            .host(t,"list2")
            .setLeft(310)
            .setTop(130)
            .setItems([{"id":"a","caption":"itema","href":"item a"},{"id":"b","caption":"itemb","href":"item b"},{"id":"c","caption":"itemc","href":"item c"}])
            .onItemSelected("_list2_onitemselected")
            );

            f(
            (new u.Button)
            .host(t,"button3")
            .setLeft(160)
            .setTop(80)
            .setCaption("button3")
            .setHref("#button3")
            );

            f(
            (new u.PageBar)
            .host(t,"pagebar1")
            .setValue("1:50:100")
            .setLeft(320)
            .setTop(80)
            .onClick("_pagebar1_onclick")
            );

            f(
            (new u.LinkList)
            .host(t,"linklist1")
            .setLeft(100)
            .setTop(140)
            .setItems([{"id":"a","caption":"itema","href":"item a"},{"id":"b","caption":"itemb","href":"item b"},{"id":"c","caption":"itemc","href":"item c"}])
            .onItemClick("_linklist1_onitemclick")
            );

            f(
            (new u.Div)
            .host(t,"divInfo")
            .setLeft(100)
            .setTop(20)
            .setWidth(430)
            .setHeight(30)
            .setCustomAppearance({"KEY":"font-size:16px;font-weight:bold;"})
            );

            f(
            (new u.TreeBar)
            .host(t,"treebar3")
            .setDock("none")
            .setLeft(480)
            .setTop(140)
            .setWidth(200)
            .setHeight(170)
            .setItems([{"id":"a","caption":"itema","href":"item a","sub":[{"id":"aa","caption":"suba","href":"suba"},{"id":"ab","caption":"subb","href":"subb"}]},{"id":"b","caption":"itemb","href":"item b"},{"id":"c","caption":"itemc","href":"item c"}])
            .onItemSelected("_treebar3_onitemselected")
            );

            f(
            (new u.Link)
            .host(t,"link1")
            .setLeft(100)
            .setTop(80)
            .setCaption("link1")
            .setHref("#link1")
            );

            f(
            (new u.Div)
            .host(t,"div30")
            .setLeft(90)
            .setTop(210)
            .setWidth(170)
            .setHtml("<a href='#normal_href_element_of_HTML'>normal href element of HTML'</a>")
            );

            return n;
            // ]]code created by designer
        },
        fakeHreflick:function(str,flag){
            if(false!==linb.BookMark.setBookMark(str) || flag)
                this.divInfo.setHtml(str);
        },
        _onready:function () {
            SPA=this;
            linb.BookMark.iniBookMark(function(str){
                //set bookmark, for back/forword button in browser
                SPA.divInfo.setHtml(str);
            })
            .hookLinkClick(function(str){
                //set bookmark, for <a href=''>normal href</a>
                var a=str.split('#');
                SPA.fakeHreflick(a[a.length-1]);
            });
        },
        _linklist1_onitemclick:function (profile, item, src) {
            //set bookmark
            SPA.fakeHreflick(item.href);
        },
        _list2_onitemselected:function (profile, item, src) {
            //set bookmark
            SPA.fakeHreflick(item.href);
        },
        _treebar3_onitemselected:function (profile, item, src) {
            //set bookmark
            SPA.fakeHreflick(item.href);
        },
        _pagebar1_onclick:function (profile, src) {
            //change pagebar value
            var self = profile.boxing(),
                value = self.getValue(),
                a = value.split(':');
            a[1] = src.href.split('#')[1];
            self.setValue(a.join(':'));

            //set bookmark
            if(a[1] == '#')return false;
            SPA.fakeHreflick(a[1]);
        },events:{"onReady":"_onready"}
    }
});