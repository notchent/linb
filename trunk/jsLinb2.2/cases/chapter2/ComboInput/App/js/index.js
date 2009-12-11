Class('App', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Label)
                .host(host,"label6")
                .setLeft(32)
                .setTop(200)
                .setWidth(104)
                .setCaption("ongetshowvalue")
            );
            
            append((new linb.UI.Label)
                .host(host,"label11")
                .setLeft(8)
                .setTop(96)
                .setWidth(136)
                .setCaption("combobox (textarea)")
            );
            
            append((new linb.UI.Label)
                .host(host,"label3")
                .setLeft(320)
                .setTop(110)
                .setWidth(104)
                .setCaption("getter")
            );
            
            append((new linb.UI.Label)
                .host(host,"label2")
                .setLeft(8)
                .setTop(144)
                .setWidth(136)
                .setCaption("combobox (integer only)")
            );
            
            append((new linb.UI.Label)
                .host(host,"label12")
                .setLeft(320)
                .setTop(80)
                .setWidth(104)
                .setCaption("listbox(disabled)")
            );
            
            append((new linb.UI.Label)
                .host(host,"label5")
                .setLeft(320)
                .setTop(140)
                .setWidth(104)
                .setCaption("pop box")
            );
            
            append((new linb.UI.Label)
                .host(host,"label1")
                .setLeft(40)
                .setTop(16)
                .setWidth(104)
                .setCaption("combobox")
            );
            
            append((new linb.UI.Label)
                .host(host,"label10")
                .setLeft(320)
                .setTop(48)
                .setWidth(104)
                .setCaption("helfinput")
            );
            
            append((new linb.UI.Label)
                .host(host,"label9")
                .setLeft(304)
                .setTop(19)
                .setCaption("listbox(shadow/resizer)")
            );
            
            append((new linb.UI.Label)
                .host(host,"label6")
                .setLeft(8)
                .setTop(48)
                .setWidth(136)
                .setCaption("combobox (set items)")
            );
            
            append((new linb.UI.Label)
                .host(host,"label4")
                .setLeft(32)
                .setTop(170)
                .setWidth(104)
                .setCaption("command box")
            );
            
            append((new linb.UI.Label)
                .host(host,"label44")
                .setLeft(32)
                .setTop(230)
                .setWidth(104)
                .setCaption("time picker")
            );
            
            append((new linb.UI.Label)
                .host(host,"label45")
                .setLeft(32)
                .setTop(260)
                .setWidth(104)
                .setCaption("color picker")
            );
            
            append((new linb.UI.Label)
                .host(host,"label46")
                .setLeft(320)
                .setTop(200)
                .setWidth(104)
                .setCaption("date picker")
            );
            
            append((new linb.UI.Label)
                .host(host,"label47")
                .setLeft(320)
                .setTop(260)
                .setWidth(104)
                .setCaption("uploader")
            );
            
            append((new linb.UI.Label)
                .host(host,"label48")
                .setLeft(320)
                .setTop(170)
                .setWidth(104)
                .setCaption("with save button")
            );
            
            append((new linb.UI.Label)
                .host(host,"label21")
                .setLeft(320)
                .setTop(230)
                .setWidth(104)
                .setCaption("spin")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput4")
                .setLeft(160)
                .setTop(16)
                .setBorder(false)
                .setListKey("test2")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput11")
                .setDock("bottom")
                .setItems([{"id":"itema", "caption":"itema", "tips":"item a"}, {"id":"itemb", "caption":"itemb", "tips":"item b"}, {"id":"itemc", "caption":"itemc", "tips":"item c"}, {"id":"itemd", "caption":"itemd", "tips":"item d"}])
                .setValue("dock:bottom")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput9")
                .setDisabled(true)
                .setLeft(470)
                .setTop(80)
                .setListKey("test2")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput6")
                .setLeft(160)
                .setTop(50)
                .setTabindex("2")
                .setBorder(false)
                .setItems([{"id":"a", "caption":"a"}, {"id":"b", "caption":"b"}, {"id":"c", "caption":"c"}])
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput8")
                .setLeft(160)
                .setTop(80)
                .setHeight(48)
                .setTabindex("3")
                .setBorder(false)
                .setMultiLines(true)
                .setListKey("test2")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput12")
                .setTips("input integer only")
                .setLeft(160)
                .setTop(140)
                .setTabindex("4")
                .setBorder(false)
                .setTipsErr("Format error")
                .setValueFormat("^-?\\d\\d*$")
                .setItems([{"id":"1", "caption":"1"}, {"id":"2", "caption":"2"}])
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput14")
                .setLeft(160)
                .setTop(170)
                .setTabindex("5")
                .setBorder(false)
                .setType("cmdbox")
                .beoforeComboPop("_comboinput14_beoforeComboPop")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput16")
                .setLeft(160)
                .setTop(200)
                .setTabindex("6")
                .setBorder(false)
                .setListKey("test2")
                .setCustomFunction({"getShowValue":function (profile, value) {
                value = value || "";
                return "[" + value.replace(/[\[\]]*/g, "") + "]";
            }})
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput15")
                .setLeft(160)
                .setTop(230)
                .setTabindex("7")
                .setBorder(false)
                .setType("timepicker")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput17")
                .setLeft(160)
                .setTop(260)
                .setTabindex("8")
                .setBorder(false)
                .setType("colorpicker")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput5")
                .setLeft(470)
                .setTop(14)
                .setHeight(27)
                .setTabindex("9")
                .setShadow(true)
                .setResizer(true)
                .setType("listbox")
                .setListKey("test2")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput7")
                .setLeft(470)
                .setTop(48)
                .setTabindex("10")
                .setType("helpinput")
                .setItems([{"id":"id a", "caption":"caption a"}, {"id":"id b", "caption":"caption b"}, {"id":"id c", "caption":"caption c"}])
                .setCommandBtn('save')
                .onCommand("_comboinput28_onsave")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput13")
                .setLeft(470)
                .setTop(110)
                .setTabindex("11")
                .setType("getter")
                .setCommandBtn('save')
                .onCommand("_comboinput28_onsave")
                .beoforeComboPop("_comboinput13_beoforeComboPop")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput15")
                .setLeft(470)
                .setTop(140)
                .setTabindex("12")
                .setType("popbox")
                .setCommandBtn('save')
                .onCommand("_comboinput28_onsave")
                .beoforeComboPop("_comboinput14_beoforeComboPop")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput28")
                .setLeft(470)
                .setTop(170)
                .setTabindex("13")
                .setType("none")
                .setCommandBtn('save')
                .onCommand("_comboinput28_onsave")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput35")
                .setLeft(470)
                .setTop(200)
                .setTabindex("14")
                .setType("datepicker")
                .setValue("-28800000")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput26")
                .setLeft(470)
                .setTop(230)
                .setTabindex("15")
                .setType("spin")
                .setValue("0")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput41")
                .setLeft(470)
                .setTop(260)
                .setWidth(240)
                .setTabindex("16")
                .setType("upload")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _comboinput13_beoforeComboPop:function (profile, pos) {
            profile.boxing().setUIValue(_());
            return false;
        }, 
        _comboinput14_beoforeComboPop:function (profile, pos) {
            linb.message('clicked');
            return false;
        }, 
        _comboinput28_onsave:function (profile, node) {
            linb.message('onSave event')
        }, 
        _onready:function () {
            linb.UI.cacheData('test2',['t1', 't2','t3'])
        }, 
        events:{"onReady":"_onready"}
    }
});