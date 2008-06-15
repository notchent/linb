
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"],
        //requried class for the App
        //"linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"
        required:["linb.UI.PageBar","linb.UI.Panel"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Panel)
            .host(t,"panel9")
            .setLeft(90)
            .setTop(60)
            .setWidth(460)
            .setHeight(330)
            );
            
            t.panel9.attach(
            (new u.PageBar)
            .host(t,"pagebar1")
            .setValue("1:3:32383")
            .setLeft(24)
            .setTop(15)
            .setWidth(330)
            .setHeight(23)
            .setTabindex("5")
            .setUriTpl("#*")
            .onClick("_pagebar1_onclick")
            );
            
            t.panel9.attach(
            (new u.PageBar)
            .host(t,"pagebar3")
            .setValue("1:6:20")
            .setLeft(24)
            .setTop(90)
            .setWidth(330)
            .setHeight(23)
            .setTabindex("5")
            .setUriTpl("#*")
            .setTextTpl("p *")
            .onClick("_pagebar1_onclick")
            );
            
            t.panel9.attach(
            (new u.PageBar)
            .host(t,"pagebar4")
            .setValue("1:300:300")
            .setLeft(24)
            .setTop(170)
            .setWidth(330)
            .setHeight(23)
            .setTabindex("5")
            .setUriTpl("#*")
            .setCaption("To : ")
            .setTextTpl("[*]")
            .onClick("_pagebar1_onclick")
            );
            
            t.panel9.attach(
            (new u.PageBar)
            .host(t,"pagebar5")
            .setValue("1:300:600")
            .setLeft(24)
            .setTop(250)
            .setWidth(330)
            .setHeight(23)
            .setTabindex("5")
            .setUriTpl("#*")
            .setPre("previous")
            .setNext("next")
            .onClick("_pagebar1_onclick")
            );
            
            return n;
            // ]]code created by designer
        },
        _pagebar1_onclick:function (profile, src) {
            var self = profile.boxing();
            var value = self.getValue();
            var a = value.split(':');
            a[1] = src.href.split('#')[1];

            self.setValue(a.join(':'));
        }
    }
});