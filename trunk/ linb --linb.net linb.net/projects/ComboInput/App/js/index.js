Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.ComboInput","linb.UI.Label"],
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.label2 = (new linb.UI.Label)
            .alias("label2").host(this)
            .setLeft(8).setTop(144).setWidth(136).setCaption("combobox (integer only)")
            ;
            this.nodes.push(this.label2.get(0));

            this.label6 = (new linb.UI.Label)
            .alias("label6").host(this)
            .setLeft(32).setTop(208).setWidth(104).setCaption("ongetshowvalue")
            ;
            this.nodes.push(this.label6.get(0));

            this.comboinput15 = (new linb.UI.ComboInput)
            .alias("comboinput15").host(this)
            .setLeft(472).setTop(175).setType("popbox").setItems([{"id":"itema","caption":"itema","tips":"item a"},{"id":"itemb","caption":"itemb","tips":"item b"},{"id":"itemc","caption":"itemc","tips":"item c"},{"id":"itemd","caption":"itemd","tips":"item d"}])
            .onCustomPop("_comboinput14_oncustompop")
            ;
            this.nodes.push(this.comboinput15.get(0));

            this.label4 = (new linb.UI.Label)
            .alias("label4").host(this)
            .setLeft(32).setTop(176).setWidth(104).setCaption("command box")
            ;
            this.nodes.push(this.label4.get(0));

            this.label11 = (new linb.UI.Label)
            .alias("label11").host(this)
            .setLeft(8).setTop(96).setWidth(136).setCaption("combobox (textarea)")
            ;
            this.nodes.push(this.label11.get(0));

            this.label6 = (new linb.UI.Label)
            .alias("label6").host(this)
            .setLeft(8).setTop(48).setWidth(136).setCaption("combobox (set items)")
            ;
            this.nodes.push(this.label6.get(0));

            this.label9 = (new linb.UI.Label)
            .alias("label9").host(this)
            .setLeft(304).setTop(16).setWidth(160).setCaption("listbox(border/resizable)")
            ;
            this.nodes.push(this.label9.get(0));

            this.label1 = (new linb.UI.Label)
            .alias("label1").host(this)
            .setLeft(40).setTop(16).setWidth(104).setCaption("combobox")
            ;
            this.nodes.push(this.label1.get(0));

            this.label5 = (new linb.UI.Label)
            .alias("label5").host(this)
            .setLeft(352).setTop(175).setWidth(104).setCaption("pop box")
            ;
            this.nodes.push(this.label5.get(0));

            this.label3 = (new linb.UI.Label)
            .alias("label3").host(this)
            .setLeft(352).setTop(143).setWidth(104).setCaption("getter")
            ;
            this.nodes.push(this.label3.get(0));

            this.label10 = (new linb.UI.Label)
            .alias("label10").host(this)
            .setLeft(360).setTop(48).setWidth(104).setCaption("helfinput")
            ;
            this.nodes.push(this.label10.get(0));

            this.comboinput14 = (new linb.UI.ComboInput)
            .alias("comboinput14").host(this)
            .setLeft(160).setTop(176).setType("cmdbox").setItems([{"id":"itema","caption":"itema","tips":"item a"},{"id":"itemb","caption":"itemb","tips":"item b"},{"id":"itemc","caption":"itemc","tips":"item c"},{"id":"itemd","caption":"itemd","tips":"item d"}])
            .onCustomPop("_comboinput14_oncustompop")
            ;
            this.nodes.push(this.comboinput14.get(0));

            this.comboinput5 = (new linb.UI.ComboInput)
            .alias("comboinput5").host(this)
            .setLeft(472).setTop(14).setHeight(27).setBorder(true).setReadonly(true).setType("listbox").setResizable(true).setItems([]).setListKey("test")
            ;
            this.nodes.push(this.comboinput5.get(0));

            this.comboinput12 = (new linb.UI.ComboInput)
            .alias("comboinput12").host(this)
            .setLeft(160).setTop(144).setTips("input integer only").setValidTips("Format error").setValueFormat("^-?\\d\\d*$").setItems([{"id":"1","caption":"1"},{"id":"2","caption":"2"}])
            ;
            this.nodes.push(this.comboinput12.get(0));

            this.comboinput4 = (new linb.UI.ComboInput)
            .alias("comboinput4").host(this)
            .setLeft(160).setTop(16).setItems([]).setListKey("test")
            ;
            this.nodes.push(this.comboinput4.get(0));

            this.comboinput16 = (new linb.UI.ComboInput)
            .alias("comboinput16").host(this)
            .setLeft(160).setTop(208).setItems([]).setListKey("test")
            .onGetShowValue("_comboinput16_ongetshowvalue")
            ;
            this.nodes.push(this.comboinput16.get(0));

            this.comboinput7 = (new linb.UI.ComboInput)
            .alias("comboinput7").host(this)
            .setLeft(472).setTop(48).setItems([{"id":"aaaaaa","caption":"a"},{"id":"bbbbbb","caption":"b"},{"id":"cccccc","caption":"c"}]).setType("helpinput")
            ;
            this.nodes.push(this.comboinput7.get(0));

            this.comboinput11 = (new linb.UI.ComboInput)
            .alias("comboinput11").host(this)
            .setValue("dock:bottom").setDock("bottom").setItems([{"id":"itema","caption":"itema","tips":"item a"},{"id":"itemb","caption":"itemb","tips":"item b"},{"id":"itemc","caption":"itemc","tips":"item c"},{"id":"itemd","caption":"itemd","tips":"item d"}])
            ;
            this.nodes.push(this.comboinput11.get(0));

            this.comboinput13 = (new linb.UI.ComboInput)
            .alias("comboinput13").host(this)
            .setLeft(472).setTop(143).setType("getter").setItems([{"id":"itema","caption":"itema","tips":"item a"},{"id":"itemb","caption":"itemb","tips":"item b"},{"id":"itemc","caption":"itemc","tips":"item c"},{"id":"itemd","caption":"itemd","tips":"item d"}])
            .onCustomPop("_comboinput13_oncustompop")
            ;
            this.nodes.push(this.comboinput13.get(0));

            this.comboinput6 = (new linb.UI.ComboInput)
            .alias("comboinput6").host(this)
            .setLeft(160).setTop(48).setItems([{"id":"a","caption":"a"},{"id":"b","caption":"b"},{"id":"c","caption":"c"}])
            ;
            this.nodes.push(this.comboinput6.get(0));

            this.comboinput8 = (new linb.UI.ComboInput)
            .alias("comboinput8").host(this)
            .setLeft(160).setTop(80).setHeight(48).setInputArea("textarea").setItems([]).setListKey("test")
            ;
            this.nodes.push(this.comboinput8.get(0));

            this.comboinput9 = (new linb.UI.ComboInput)
            .alias("comboinput9").host(this)
            .setLeft(472).setTop(80).setDisabled(true).setItems([]).setListKey("test")
            ;
            this.nodes.push(this.comboinput9.get(0));

            this.label12 = (new linb.UI.Label)
            .alias("label12").host(this)
            .setLeft(360).setTop(80).setWidth(104).setCaption("listbox(disabled)")
            ;
            this.nodes.push(this.label12.get(0));
            return this.nodes;
            // ]]code creted by designer
        },
        _comboinput16_ongetshowvalue:function (profile, value) {
            return '['+value.replace(/[\[\]]*/g,'')+']';
        },
        _comboinput13_oncustompop:function (profile, pos) {
            profile.boxing().setCtrlValue(_.timeStamp())
        },
        _comboinput14_oncustompop:function (profile, pos) {
            linb.message('clicked');
        }
    }
});