
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        //"linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"
        required:["linb.UI.Div","linb.UI.Button"],
        events:{"onReady":"_onready"},
        _onready:function () {
            SPA=this;
            //set com factory profile
            linb.ComFactory.setProfile(CONF.ComFactoryProfile);
        },
        _button9_onclick:function (profile, e, value) {
            var host=this;
            linb.ComFactory.getCom('module1',null,function(){
                var ns=this;
                host.div16.attach(ns.getUIObj(),false);
            });
        },
        _button10_onclick:function (profile, e, value) {
            var host=this;
            linb.ComFactory.getCom('module2',null,function(){
                var ns=this;
                host.div17.attach(ns.panelMain,false);
            });
        },
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Button)
            .host(t,"button9")
            .setLeft(160)
            .setTop(340)
            .setCaption("Load module1")
            .onClick("_button9_onclick")
            );
            
            f(
            (new u.Button)
            .host(t,"button10")
            .setLeft(470)
            .setTop(340)
            .setCaption("Load Module2")
            .onClick("_button10_onclick")
            );
            
            f(
            (new u.Div)
            .host(t,"div21")
            .setLeft(100)
            .setTop(20)
            .setWidth(370)
            .setHeight(30)
            .setHtml("Loading code from outside dynamically!")
            .setCustomAppearance({"KEY":"font-weight:bold;font-size:14px;"})
            );
            
            f(
            (new u.Div)
            .host(t,"div16")
            .setLeft(100)
            .setTop(100)
            .setWidth(268)
            .setHeight(210)
            .setCustomAppearance({"KEY":"border:dashed 1px;"})
            );
            
            f(
            (new u.Div)
            .host(t,"div17")
            .setLeft(390)
            .setTop(100)
            .setWidth(268)
            .setHeight(210)
            .setCustomAppearance({"KEY":"border:dashed 1px;"})
            );
            
            f(
            (new u.Div)
            .host(t,"div20")
            .setLeft(100)
            .setTop(50)
            .setWidth(380)
            .setHeight(40)
            .setHtml("Get Module code from out file on the fly, and attach module UI to the current page")
            );
            
            f(
            (new u.Button)
            .host(t,"button36")
            .setLeft(250)
            .setTop(410)
            .setCaption("Load Module3 manually")
            .setWidth(160)
            .onClick("_button36_onclick")
            );
            
            return n;
            // ]]code created by designer
        },
        _button36_onclick:function (profile, e, value) {
            var host=this;
            linb.ComFactory.newCom('App.Module3' ,function(){
                this.show(linb([document.body]));
            });
        }
    }
});