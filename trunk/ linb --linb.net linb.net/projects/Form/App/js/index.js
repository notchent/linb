Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI", "linb.coder"],
        //requried class for the App
        required:["linb.UI.Group","linb.UI.Button","linb.UI.List","linb.UI.Input","linb.UI.ComboInput","linb.UI.CheckBox","linb.UI.Label","linb.DataSource.Memory"],
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.button1 = (new linb.UI.Button)
            .alias("button1").host(this)
            .setLeft(48).setTop(224).setCaption("Bind Datasource1").setWidth(208)
            .onClick("_button1_onclick")
            ;
            this.nodes.push(this.button1.get(0));

            this.group2 = (new linb.UI.Group)
            .alias("group2").host(this)
            .setLeft(40).setTop(248).setWidth(728).setHeight(160).setCaption("Form example")
            ;
            this.nodes.push(this.group2.get(0));

            this.label1 = (new linb.UI.Label)
            .alias("label1").host(this)
            .setLeft(216).setTop(88).setCaption("URL")
            ;
            this.group2.attach(this.label1);

            this.input2 = (new linb.UI.Input)
            .alias("input2").host(this)
            .setLeft(240).setTop(16).setDataBinder("ds").setDataField("edit").setValueFormat("[^.*]").setTips("require field").setWidth(168)
            ;
            this.group2.attach(this.input2);

            this.comboinput2 = (new linb.UI.ComboInput)
            .alias("comboinput2").host(this)
            .setLeft(456).setTop(48).setItems([]).setListKey("custom").setDataBinder("ds").setDataField("combo2").setWidth(184)
            ;
            this.group2.attach(this.comboinput2);

            this.comboinput1 = (new linb.UI.ComboInput)
            .alias("comboinput1").host(this)
            .setLeft(456).setTop(16).setItems([]).setListKey("custom").setReadonly(true).setType("listbox").setDataBinder("ds").setDataField("combo1").setWidth(184)
            ;
            this.group2.attach(this.comboinput1);

            this.checkbox1 = (new linb.UI.CheckBox)
            .alias("checkbox1").host(this)
            .setLeft(240).setTop(48).setCaption("Visual JS").setDataBinder("ds").setDataField("bool")
            ;
            this.group2.attach(this.checkbox1);

            this.comboinput4 = (new linb.UI.ComboInput)
            .alias("comboinput4").host(this)
            .setDataBinder("ds").setDataField("url").setLeft(288).setTop(88).setWidth(352).setValueFormat("^(http|https|ftp)\\:\\/\\/[a-z0-9\\-\\.]+\\.[a-z]{2,3}(:[a-z0-9]*)?\\/?([a-z0-9\\-\\._\\?\\,\\'\\/\\\\\\+&amp;%\\$#\\=~])*$").setType("popbox").setTips("URL must be spcified").setItems([{"id":"a","caption":"itema","tips":"item a","sub":[{"id":"aa","caption":"suba"},{"id":"ab","caption":"subb"}]},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .onCustomPop("_comboinput4_oncustompop")
            ;
            this.group2.attach(this.comboinput4);

            this.list1 = (new linb.UI.List)
            .alias("list1").host(this)
            .setLeft(16).setTop(16).setWidth(176).setHeight(112).setItems([]).setListKey("custom").setDataBinder("ds").setDataField("list")
            ;
            this.group2.attach(this.list1);

            this.button5 = (new linb.UI.Button)
            .alias("button5").host(this)
            .setLeft(304).setTop(224).setCaption("Bind Datasource2").setWidth(200)
            .onClick("_button5_onclick")
            ;
            this.nodes.push(this.button5.get(0));

            this.group3 = (new linb.UI.Group)
            .alias("group3").host(this)
            .setLeft(288).setTop(24).setWidth(232).setHeight(188).setCaption("Datasource2")
            ;
            this.nodes.push(this.group3.get(0));

            this.button2 = (new linb.UI.Button)
            .alias("button2").host(this)
            .setLeft(270).setTop(424).setCaption("Update  Datasorce binded").setWidth(208)
            .onClick("_button2_onclick")
            ;
            this.nodes.push(this.button2.get(0));

            this.group1 = (new linb.UI.Group)
            .alias("group1").host(this)
            .setLeft(40).setTop(24).setWidth(232).setHeight(188).setCaption("Datasource1")
            ;
            this.nodes.push(this.group1.get(0));

            this.group4 = (new linb.UI.Group)
            .alias("group4").host(this)
            .setLeft(536).setTop(24).setWidth(232).setHeight(188).setCaption("Datasource3")
            ;
            this.nodes.push(this.group4.get(0));

            this.button6 = (new linb.UI.Button)
            .alias("button6").host(this)
            .setLeft(552).setTop(224).setCaption("Bind Datasource3").setWidth(208)
            .onClick("_button6_onclick")
            ;
            this.nodes.push(this.button6.get(0));

            this.memory1 = (new linb.DataSource.Memory)
            .alias("memory1").host(this)
            .setMemory({"list":"linb","edit":"POWER","combo1":"ajax","combo2":"ria","bool":true,"url":"http://www.linb.net"})
            .onDataChanged("_memory1_ondatachanged")
            ;
            this.nodes.push(this.memory1.get(0));

            this.memory3 = (new linb.DataSource.Memory)
            .alias("memory3").host(this)
            .setMemory({"list":"new","edit":"Hello","combo1":"app","combo2":"web","bool":true,"url":"http://linb.net"})
            .onDataChanged("_memory3_ondatachanged")
            ;
            this.nodes.push(this.memory3.get(0));

            this.memory2 = (new linb.DataSource.Memory)
            .alias("memory2").host(this)
            .setMemory({"list":"ria","edit":"LINB","combo1":"linb","combo2":"era","bool":true,"url":"http://www.linb.net/"})
            .onDataChanged("_memory2_ondatachanged")
            ;
            this.nodes.push(this.memory2.get(0));
            return this.nodes;
            // ]]code creted by designer
        },
        events:{"beforeIniComponents":"_beforeinicomponents","afterShow":"_aftershow"},
        _beforeinicomponents:function (page, threadid) {
            linb.UI.setCacheList('custom',[
                {id:'ria',caption:'RIA'},
                {id:'ajax',caption:'AJAX'},
                {id:'linb',caption:'LINB'},
                {id:'web',caption:'WEB'},
                {id:'app',caption:'APP'},
                {id:'new',caption:'NEW'},
                {id:'era',caption:'ERA'}
            ]);
        },
        _comboinput4_oncustompop:function (profile, pos) {
            linb.dom.submit(profile.boxing().getUIValue());
        },
        _button1_onclick:function (profile, e, value) {
            this.memory1.bind('ds').responseToBinder();
        },
        _button2_onclick:function (profile, e, value) {
            this.memory1.requestFromBinder('ds');
            this.memory2.requestFromBinder('ds');
            this.memory3.requestFromBinder('ds');
        },
        _button5_onclick:function (profile, e, value) {
            this.memory2.bind('ds').responseToBinder();
        },
        _button6_onclick:function (profile, e, value) {
            this.memory3.bind('ds').responseToBinder();
        },
        _memory1_ondatachanged:function (profile, hash) {
            this.group1.getSubNode('PANEL').
            html(linb.coder.format(_.serialize(hash)));
        },
        _memory2_ondatachanged:function (profile, hash) {
            this.group3.getSubNode('PANEL').
            html(linb.coder.format(_.serialize(hash)));

        },
        _memory3_ondatachanged:function (profile, hash) {
            this.group4.getSubNode('PANEL').
            html(linb.coder.format(_.serialize(hash)));
        },
        _aftershow:function (page, threadid) {
            page.memory1.request();
            page.memory2.request();
            page.memory3.request();
       }
    }
});