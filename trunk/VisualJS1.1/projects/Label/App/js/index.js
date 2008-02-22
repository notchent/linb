Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Label"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Label)
            .host(t,"label5")
            .setLeft(64)
            .setTop(96)
            .setWidth(224)
            .setHeight(32)
            .setShadow(true)
            .setBorder(true)
            .setCaption("label with border&shadow")
            );

            f(
            (new u.Label)
            .host(t,"label2")
            .setLeft(64)
            .setTop(56)
            .setWidth(224)
            .setHeight(32)
            .setBorder(true)
            .setCaption("label with border")
            );

            f(
            (new u.Label)
            .host(t,"label6")
            .setLeft(64)
            .setTop(232)
            .setWidth(232)
            .setHeight(64)
            .setCaption("<strong>label</strong> (left/bottom)")
            .setBorder(true)
            .setHAlign("left")
            .setVAlign("bottom")
            );

            f(
            (new u.Label)
            .host(t,"label7")
            .setLeft(632)
            .setTop(128)
            .setWidth(136)
            .setHeight(80)
            .setCaption("resizable label")
            .setBorder(true)
            .setHAlign("center")
            .setResizable(true)
            );

            f(
            (new u.Label)
            .host(t,"label9")
            .setLeft(336)
            .setTop(56)
            .setWidth(224)
            .setHeight(32)
            .setBorder(true)
            .setCaption("label (exStyle:'cursor:pointer')")
            .setCustomAppearance({"KEY":"cursor:pointer"})
            );

            f(
            (new u.Label)
            .host(t,"label10")
            .setLeft(336)
            .setTop(96)
            .setWidth(224)
            .setHeight(32)
            .setBorder(true)
            .setCaption("label with icon")
            .setIcon("img/demo.gif")
            );

            f(
            (new u.Label)
            .host(t,"label11")
            .setLeft(280)
            .setTop(184)
            .setWidth(280)
            .setHeight(72)
            .setBorder(true)
            .setCaption("label (zIndex:2)")
            .setZIndex("2")
            );

            f(
            (new u.Label)
            .host(t,"label1")
            .setLeft(64)
            .setTop(16)
            .setWidth(224)
            .setHeight(32)
            .setCaption("normal label")
            );

            f(
            (new u.Label)
            .host(t,"label3")
            .setLeft(64)
            .setTop(144)
            .setWidth(224)
            .setHeight(32)
            .setCaption("label with shadow text")
            .setShadowText(true)
            .setFontSize("16px")
            .setFontWeight("bold")
            );

            f(
            (new u.Label)
            .host(t,"label4")
            .setLeft(64)
            .setTop(192)
            .setWidth(232)
            .setHeight(32)
            .setCaption("<strong>label</strong> (center/middle)")
            .setBorder(true)
            .setHAlign("center")
            );

            f(
            (new u.Label)
            .host(t,"label12")
            .setLeft(280)
            .setTop(280)
            .setWidth(280)
            .setHeight(64)
            .setBorder(true)
            .setCaption("label (set background in afterCreated event)")
            .setZIndex("2")
            .afterCreated("_label12_aftercreated")
            );

            return n;
            // ]]code created by designer
        },
        _label12_aftercreated:function (profile) {
             profile.getSubNode('BORDER').background('#fff');
        }
    }
});