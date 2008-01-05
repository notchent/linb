Class('VisualJS.About', 'linb.Com',{
    Instance:{
        customAttach:function(parent){
            var self=this,
                dlg=self.dialog,
                prop = self.properties;
            if(!dlg.get(0).root)
                dlg.create();
            //asy
            dlg.show(parent, true);
        },
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Dialog)
            .host(t,"dialog")
            .setLeft(250)
            .setTop(150)
            .setHeight(170)
            .setCaption("$VisualJS.menu.about")
            .setResizable(false)
            .setMinBtn(false)
            .setMaxBtn(false)
            .setPinBtn(false)
            .onHotKeydown("_dialog_onhotkey")
            .beforeClose("_dialog2_beforeclose")
            );

            t.dialog.attach(
            (new u.Div)
            .host(t,"div12")
            .setLeft(10)
            .setTop(10)
            .setWidth(260)
            .setHeight(80)
            .setHtml("Visual Js 1.0 <br /> Powered by jsLinb and phpLINB <br />&copy;2006-2007 All rights reserved by <a href=\"mailto:&#108;&#105;&#110;&#98;&#46;&#110;&#101;&#116;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;\">Yingbo Li</a>")
            );

            t.dialog.attach(
            (new u.Button)
            .host(t,"button3")
            .setLeft(120)
            .setTop(100)
            .setCaption("O K")
            .setWidth(50)
            .setZIndex("10")
            .onClick("_button3_onclick")
            );

            t.dialog.attach(
            (new u.Div)
            .host(t,"div9")
            .setLeft(90)
            .setTop(65)
            .setWidth("120")
            .setHeight("60")
            .setZIndex("8")
            .afterCreated("_div9_aftercreated")
            .setCustomAppearance({"KEY":"background:url(img/logo.gif);cursor:pointer;"})
            );

            return n;
            // ]]code created by designer
        },
        _div9_aftercreated:function (profile) {
            profile.root.onClick(function(){
                linb.dom.submit('http://www.linb.net/VisualJS/');
            });
        },
        _dialog2_beforeclose:function (profile) {
            profile.boxing().hide();
            return false;
        },
        _dialog_onhotkey:function(profile, key, control, shift, alt){
            if(key=='esc')
                profile.boxing().close();
        },
        _button3_onclick:function (profile, e, value) {
            this.dialog.close();
        }
    }
});