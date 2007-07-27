Class('VisualJS.About', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the VisualJS
        required:["linb.UI.Dialog","linb.UI.Div","linb.UI.Button"],
        //prepare data
        parepareData:function(properties,events){
        },
        _div9_aftercreated:function (profile) {
            profile.root.onClick(function(){
                linb.dom.submit('http://www.linb.net/VisualJS/');
            });
        },
        customAttach:function(){
            var prop = this.properties;
            if(!this.dialog.get(0).root)
                this.dialog.create();
            //asy
            this.dialog.show(this.parent, true);
        },
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.dialog = (new linb.UI.Dialog)
            .alias("dialog").host(this)
            .setLeft(250).setTop(150).setHeight(170).setCaption("$VisualJS.menu.about").setResizable(false).setMinBtn(false).setMaxBtn(false).setPinBtn(false)
            .onHotKeydown("_dialog_onhotkey")
            .beforeClose("_dialog2_beforeclose")
            ;
            this.nodes.push(this.dialog.get(0));

            this.div12 = (new linb.UI.Div)
            .alias("div12").host(this)
            .setLeft(10).setTop(10).setWidth(260).setHeight(80).setHtml('Visual Js 1.0 <br /> Powered by jsLinb and phpLINB <br />&copy;2006-2007 All rights reserved by <a href="mailto:&#108;&#105;&#110;&#98;&#46;&#110;&#101;&#116;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;">Yingbo Li</a>')
            ;
            this.dialog.attach(this.div12);

            this.button3 = (new linb.UI.Button)
            .alias("button3").host(this)
            .setLeft(120).setTop(100).setCaption("O K").setWidth(50).setZIndex("10")
            .onClick("_button3_onclick")
            ;
            this.dialog.attach(this.button3);

            this.div9 = (new linb.UI.Div)
            .alias("div9").host(this)
            .setLeft(90).setTop(65).setWidth("120").setHeight("60").setZIndex("8")
            .setCustomAppearance({KEY:'background:url(img/logo.gif);cursor:pointer;'})
            .afterCreated("_div9_aftercreated")
            ;
            this.dialog.attach(this.div9);

            return this.nodes;
            // ]]code creted by designer
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