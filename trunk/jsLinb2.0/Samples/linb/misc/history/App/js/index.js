
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        //"linb.Tips","linb.UI.Resizer","linb.UI.Border","linb.UI.Shadow"
        required:["linb.UI.List", "linb.UI.Button", "linb.UI.PageBar", "linb.UI.LinkList", "linb.UI.Link", "linb.UI.TreeBar", "linb.UI.Div"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.PageBar)
                .host(host,"pagebar1")
                .setLeft(330)
                .setTop(90)
                .setValue("1:50:100")
                .onClick("_pagebar1_onclick")
            );
            
            append((new linb.UI.Button)
                .host(host,"button3")
                .setLeft(160)
                .setTop(90)
                .setCaption("button3")
                .setHref("#button3")
            );
            
            append((new linb.UI.LinkList)
                .host(host,"linklist1")
                .setItems([{"id":"a", "caption":"itema", "href":"item a"}, {"id":"b", "caption":"itemb", "href":"item b"}, {"id":"c", "caption":"itemc", "href":"item c"}])
                .setLeft(40)
                .setTop(150)
                .onItemClick("_linklist1_onitemclick")
            );
            
            append((new linb.UI.Div)
                .host(host,"divInfo")
                .setLeft(50)
                .setTop(20)
                .setWidth(430)
                .setHeight(30)
                .setCustomStyle({"KEY":"font-size:16px;font-weight:bold;"})
            );
            
            append((new linb.UI.TreeBar)
                .host(host,"treebar3")
                .setItems([{"id":"a", "caption":"itema", "href":"item a", "sub":[{"id":"aa", "caption":"suba", "href":"suba"}, {"id":"ab", "caption":"subb", "href":"subb"}]}, {"id":"b", "caption":"itemb", "href":"item b"}, {"id":"c", "caption":"itemc", "href":"item c"}])
                .setDock("none")
                .setLeft(420)
                .setTop(150)
                .setWidth(130)
                .setHeight(140)
                .onItemSelected("_treebar3_onitemselected")
            );
            
            append((new linb.UI.Link)
                .host(host,"link1")
                .setLeft(40)
                .setTop(90)
                .setCaption("link1")
                .setHref("#link1")
                .onClick("_link1_onclick")
            );
            
            append((new linb.UI.List)
                .host(host,"list2")
                .setItems([{"id":"a", "caption":"itema", "href":"item a"}, {"id":"b", "caption":"itemb", "href":"item b"}, {"id":"c", "caption":"itemc", "href":"item c"}])
                .setLeft(250)
                .setTop(140)
                .onItemSelected("_list2_onitemselected")
            );
            
            append((new linb.UI.Div)
                .host(host,"div30")
                .setLeft(50)
                .setTop(320)
                .setWidth(480)
                .setHeight(12)
                .setHtml("<a href='#normal_href_element_of_HTML'>normal href element of HTML'</a><a href=www.google.cn>google</a>")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        fakeHreflick:function(str,flag){
            if(false!==linb.History.setFI(str) || flag)
                this.divInfo.setHtml(str);
        }, 
        _onready:function () {
            SPA=this;
            linb.History.setCallback(function(str){
                //set history, for back/forword button in browser
                SPA.divInfo.setHtml(str);
            })
        }, 
        _linklist1_onitemclick:function (profile, item, src) {
            //set history
            SPA.fakeHreflick(item.href);
            return false;
        }, 
        _list2_onitemselected:function (profile, item, src) {
            //set history
            SPA.fakeHreflick(item.href);
            return false;
        }, 
        _treebar3_onitemselected:function (profile, item, src) {
            //set history
            SPA.fakeHreflick(item.href);
            return false;
        }, 
        _pagebar1_onclick:function (profile, src) {
            //change pagebar value
            var self = profile.boxing(),
                value = self.getValue(),
                a = value.split(':');
            a[1] = src.href.split('#')[1];
            self.setValue(a.join(':'));

            //set history
            if(a[1] == '#')return false;
            SPA.fakeHreflick(a[1]);
            return false;
        }, 
        _link1_onclick:function(){
            return true;
        }, 
        events:{"onReady":"_onready"}
    }
});