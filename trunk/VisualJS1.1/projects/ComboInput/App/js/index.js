Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.ComboInput","linb.UI.Label"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Label)
            .host(t,"label12")
            .setLeft(360)
            .setTop(80)
            .setWidth(104)
            .setCaption("listbox(disabled)")
            );

            f(
            (new u.Label)
            .host(t,"label6")
            .setLeft(32)
            .setTop(200)
            .setWidth(104)
            .setCaption("ongetshowvalue")
            );

            f(
            (new u.Label)
            .host(t,"label6")
            .setLeft(8)
            .setTop(48)
            .setWidth(136)
            .setCaption("combobox (set items)")
            );

            f(
            (new u.Label)
            .host(t,"label4")
            .setLeft(32)
            .setTop(176)
            .setWidth(104)
            .setCaption("command box")
            );

            f(
            (new u.Label)
            .host(t,"label11")
            .setLeft(8)
            .setTop(96)
            .setWidth(136)
            .setCaption("combobox (textarea)")
            );

            f(
            (new u.Label)
            .host(t,"label3")
            .setLeft(352)
            .setTop(143)
            .setWidth(104)
            .setCaption("getter")
            );

            f(
            (new u.Label)
            .host(t,"label10")
            .setLeft(360)
            .setTop(48)
            .setWidth(104)
            .setCaption("helfinput")
            );

            f(
            (new u.Label)
            .host(t,"label1")
            .setLeft(40)
            .setTop(16)
            .setWidth(104)
            .setCaption("combobox")
            );

            f(
            (new u.Label)
            .host(t,"label9")
            .setLeft(480)
            .setTop(16)
            .setWidth(160)
            .setCaption("listbox(border/resizable)")
            );

            f(
            (new u.Label)
            .host(t,"label5")
            .setLeft(352)
            .setTop(175)
            .setWidth(104)
            .setCaption("pop box")
            );

            f(
            (new u.Label)
            .host(t,"label2")
            .setLeft(8)
            .setTop(144)
            .setWidth(136)
            .setCaption("combobox (integer only)")
            );

            f(
            (new u.ComboInput)
            .host(t,"comboinput14")
            .setLeft(160)
            .setTop(176)
            .setItems([{"id":"itema","caption":"itema","tips":"item a"},{"id":"itemb","caption":"itemb","tips":"item b"},{"id":"itemc","caption":"itemc","tips":"item c"},{"id":"itemd","caption":"itemd","tips":"item d"}])
            .setType("cmdbox")
            .onClickButton("_comboinput14_onClickButton")
            );

            f(
            (new u.ComboInput)
            .host(t,"comboinput5")
            .setLeft(470)
            .setTop(14)
            .setHeight(27)
            .setBorder(true)
            .setReadonly(true)
            .setType("listbox")
            .setResizable(true)
            .setItems([])
            .setListKey("test2")
            .setSaveBtn(true)
            );

            f(
            (new u.ComboInput)
            .host(t,"comboinput12")
            .setLeft(160)
            .setTop(144)
            .setTips("input integer only")
            .setTipsErr("Format error")
            .setValueFormat("^-?\\d\\d*$")
            .setItems([{"id":"1","caption":"1"},{"id":"2","caption":"2"}])
            );

            f(
            (new u.ComboInput)
            .host(t,"comboinput15")
            .setLeft(470)
            .setTop(175)
            .setItems([{"id":"itema","caption":"itema","tips":"item a"},{"id":"itemb","caption":"itemb","tips":"item b"},{"id":"itemc","caption":"itemc","tips":"item c"},{"id":"itemd","caption":"itemd","tips":"item d"}])
            .setType("popbox")
            .setSaveBtn(true)
            .onClickButton("_comboinput14_onClickButton")
            );

            f(
            (new u.ComboInput)
            .host(t,"comboinput6")
            .setLeft(160)
            .setTop(48)
            .setItems([{"id":"a","caption":"a"},{"id":"b","caption":"b"},{"id":"c","caption":"c"}])
            );

            f(
            (new u.ComboInput)
            .host(t,"comboinput8")
            .setLeft(160)
            .setTop(80)
            .setHeight(48)
            .setInputArea("textarea")
            .setItems([])
            .setListKey("test2")
            );

            f(
            (new u.ComboInput)
            .host(t,"comboinput11")
            .setValue("dock:bottom")
            .setDock("bottom")
            .setItems([{"id":"itema","caption":"itema","tips":"item a"},{"id":"itemb","caption":"itemb","tips":"item b"},{"id":"itemc","caption":"itemc","tips":"item c"},{"id":"itemd","caption":"itemd","tips":"item d"}])
            );

            f(
            (new u.ComboInput)
            .host(t,"comboinput13")
            .setLeft(470)
            .setTop(143)
            .setItems([{"id":"itema","caption":"itema","tips":"item a"},{"id":"itemb","caption":"itemb","tips":"item b"},{"id":"itemc","caption":"itemc","tips":"item c"},{"id":"itemd","caption":"itemd","tips":"item d"}])
            .setType("getter")
            .setSaveBtn(true)
            .onClickButton("_comboinput13_onClickButton")
            );

            f(
            (new u.ComboInput)
            .host(t,"comboinput16")
            .setLeft(160)
            .setTop(200)
            .setItems([])
            .setListKey("test2")
            .setCustomFunction({"getShowValue":function (profile, value) {
                value = value || "";
                return "[" + value.replace(/[\[\]]*/g, "") + "]";
            }})
            );

            f(
            (new u.ComboInput)
            .host(t,"comboinput7")
            .setLeft(470)
            .setTop(48)
            .setItems([{"id":"aaaaaa","caption":"a"},{"id":"bbbbbb","caption":"b"},{"id":"cccccc","caption":"c"}])
            .setType("helpinput")
            .setSaveBtn(true)
            );

            f(
            (new u.ComboInput)
            .host(t,"comboinput4")
            .setLeft(160)
            .setTop(16)
            .setItems([])
            .setListKey("test2")
            );

            f(
            (new u.ComboInput)
            .host(t,"comboinput28")
            .setLeft(470)
            .setTop(205)
            .setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setType("none")
            .setSaveBtn(true)
            );

            f(
            (new u.ComboInput)
            .host(t,"comboinput9")
            .setLeft(470)
            .setTop(80)
            .setDisabled(true)
            .setItems([])
            .setListKey("test2")
            );
            f(
            (new u.ComboInput)
            .host(t,"comboinput15")
            .setLeft(160)
            .setTop(240)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setType("timepicker")
            );

            f(
            (new u.ComboInput)
            .host(t,"comboinput35")
            .setLeft(470)
            .setTop(240)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setType("datepicker")
            );
            return n;
            // ]]code created by designer
        },
        _comboinput13_onClickButton:function (profile, pos) {
            profile.boxing().setCtrlValue(_())
        },
        _comboinput14_onClickButton:function (profile, pos) {
            linb.message('clicked');
        }
    }
});