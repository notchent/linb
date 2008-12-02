Class('App.linb_UI_Button', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Button", "linb.UI.Div"],
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};

            append((new linb.UI.Button)
                .host(host,"button22")
                .setLeft(20)
                .setTop(120)
                .setWidth(180)
                .setHeight("22")
                .setCaption("align:left")
                .setHAlign("left")
            );

            append((new linb.UI.Button)
                .host(host,"button20")
                .setDisabled(true)
                .setLeft(20)
                .setTop(50)
                .setWidth(180)
                .setHeight("22")
                .setCaption("disabled")
                .setType("status")
                .onChecked("_button28_ontoggle")
            );

            append((new linb.UI.Button)
                .host(host,"button28")
                .setLeft(230)
                .setTop(20)
                .setWidth(270)
                .setHeight("22")
                .setCaption("toggle button")
                .setType("status")
                .onChecked("_button28_ontoggle")
            );

            append((new linb.UI.Button)
                .host(host,"button29")
                .setLeft(20)
                .setTop(80)
                .setWidth(190)
                .setHeight("30")
                .setShadow(true)
                .setCaption("shadow")
            );

            append((new linb.UI.Button)
                .host(host,"button22")
                .setLeft(20)
                .setTop(150)
                .setWidth(180)
                .setHeight("22")
                .setCaption("align:right")
                .setHAlign("right")
            );

            append((new linb.UI.Button)
                .host(host,"button30")
                .setLeft(20)
                .setTop(20)
                .setWidth(180)
                .setHeight("22")
                .setCaption("with image")
                .setImage("img/demo.gif")
            );

            append((new linb.UI.Button)
                .host(host,"button34")
                .setLeft(230)
                .setTop(80)
                .setWidth(280)
                .setHeight(110)
                .setBorder(true)
                .setShadow(true)
                .setResizer(true)
                .setCaption("custom button with border, shadow, resizer")
                .setHAlign("left")
                .setVAlign("bottom")
                .setType("custom")
            );

            append((new linb.UI.Button)
                .host(host,"button12")
                .setLeft(230)
                .setTop(50)
                .setWidth(270)
                .setHeight("22")
                .setCaption("drop button with image")
                .setImage("img/demo.gif")
                .setType("drop")
                .onClick("_button12_onclick")
                .onClickDrop("_button12_onclickdrop")
            );

            append((new linb.UI.Button)
                .host(host,'button13')
                .setLeft(30)
                .setTop(210)
                .setWidth(90)
                .setHeight(60)
                .setRenderer(function(){return '<img src=img/demo.gif /><br />renderer'})
                .setBorder(true)
                .setType('custom')
            );

            return children;
            // ]]code created by jsLinb UI Builder
        },
        _button25_onclick:function (profile, e, value) {
            linb.message('clicked');
        },
        _button24_onclick:function (profile, e, value) {
            linb.message('dbl clicked');
        },
        _button28_ontoggle:function (profile, e, value) {
            linb.message(value?'checked':'unchecked');
        },
        _button19_beforehovereffect:function (profile, item, src, type) {
            linb.message(type);
            return false;
        },
        _button18_beforeclickeffect:function (profile, item, src, type) {
            linb.message(type);
            return false;
        },
        _div9_aftercreated:function (profile) {
            profile.root.css('backgroundImage','url(img/app.gif)')
        },
        _button12_onclick:function (profile, e, src, value) {
            linb.message('you clicked button')
        },
        _button12_onclickdrop:function (profile, e, src) {
            linb.message('you clicked drop button')
        }
    }
});