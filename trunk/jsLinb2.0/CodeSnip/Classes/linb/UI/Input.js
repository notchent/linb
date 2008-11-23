Class('App.linb_UI_Input', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Input","linb.UI.Label","linb.UI.Div","linb.UI.Group"],
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host = this,
                children = [],
                append = function(child){
                    children.push(child.get(0))
                };
            
            append((new linb.UI.Label)
                .host(host,"label13")
                .setLeft(58)
                .setTop(340)
                .setWidth(296)
                .setCaption("Input 'allow' only, using 'beforeFormatCheck' event")
            );
            
            append((new linb.UI.Label)
                .host(host,"label2")
                .setLeft(346)
                .setTop(10)
                .setWidth(104)
                .setCaption("password")
            );
            
            append((new linb.UI.Label)
                .host(host,"label10")
                .setLeft(346)
                .setTop(274)
                .setWidth(104)
                .setCaption("integer")
            );
            
            append((new linb.UI.Label)
                .host(host,"label4")
                .setLeft(26)
                .setTop(106)
                .setWidth(104)
                .setCaption("readonly")
            );
            
            append((new linb.UI.Label)
                .host(host,"label1")
                .setLeft(26)
                .setTop(10)
                .setWidth(104)
                .setCaption("normal")
            );
            
            append((new linb.UI.Label)
                .host(host,"label7")
                .setLeft(26)
                .setTop(242)
                .setWidth(104)
                .setCaption("email")
            );
            
            append((new linb.UI.Label)
                .host(host,"label12")
                .setLeft(346)
                .setTop(306)
                .setWidth(104)
                .setCaption("MM/DD/YYYY")
            );
            
            append((new linb.UI.Label)
                .host(host,"label3")
                .setLeft(26)
                .setTop(42)
                .setWidth(104)
                .setCaption("textarea")
            );
            
            append((new linb.UI.Label)
                .host(host,"label9")
                .setLeft(26)
                .setTop(274)
                .setWidth(104)
                .setCaption("alpha")
            );
            
            append((new linb.UI.Label)
                .host(host,"label8")
                .setLeft(346)
                .setTop(242)
                .setWidth(104)
                .setCaption("letter")
            );
            
            append((new linb.UI.Label)
                .host(host,"label5")
                .setLeft(346)
                .setTop(106)
                .setWidth(104)
                .setCaption("disabled")
            );
            
            append((new linb.UI.Label)
                .host(host,"label6")
                .setLeft(10)
                .setTop(178)
                .setWidth(168)
                .setCaption("border/resizer/shadow")
            );
            
            append((new linb.UI.Label)
                .host(host,"label11")
                .setLeft(26)
                .setTop(306)
                .setWidth(104)
                .setCaption("number")
            );
            
            append((new linb.UI.Div)
                .host(host,"div10")
                .setLeft(366)
                .setTop(423)
                .setWidth(260)
                .setHeight(30)
            );
            
            append((new linb.UI.Div)
                .host(host,"div9")
                .setLeft(366)
                .setTop(383)
                .setWidth(260)
                .setHeight(30)
            );
            
            append((new linb.UI.Div)
                .host(host,"div11")
                .setLeft(74)
                .setTop(380)
                .setWidth(80)
                .setHeight(26)
                .setHtml("Input valid")
            );
            
            append((new linb.UI.Input)
                .host(host,"input4")
                .setLeft(138)
                .setTop(10)
                .setValue("normal")
            );
            
            append((new linb.UI.Div)
                .host(host,"div12")
                .setLeft(14)
                .setTop(420)
                .setHeight(26)
                .setHtml("Input valid (real time)")
                .setWidth(140)
            );
            
            append((new linb.UI.Group)
                .host(host,"group1")
                .setLeft(74)
                .setTop(460)
                .setWidth(500)
                .setCaption("mask input")
            );
            
            host.group1.append((new linb.UI.Div)
                .host(host,"div14")
                .setLeft(233)
                .setTop(19)
                .setWidth(90)
                .setHeight(20)
                .setHtml("(111) 111-1111")
            );
            
            host.group1.append((new linb.UI.Div)
                .host(host,"div13")
                .setLeft(20)
                .setTop(19)
                .setWidth(80)
                .setHeight(20)
                .setHtml("11/11/1111")
            );
            
            host.group1.append((new linb.UI.Div)
                .host(host,"div16")
                .setLeft(250)
                .setTop(50)
                .setWidth(80)
                .setHeight(20)
                .setHtml("(111) a-a *$*")
            );
            
            host.group1.append((new linb.UI.Div)
                .host(host,"div15")
                .setLeft(20)
                .setTop(50)
                .setWidth(80)
                .setHeight(20)
                .setHtml("~1.11")
            );
            
            host.group1.append((new linb.UI.Input)
                .host(host,"iMask")
                .setLeft(100)
                .setTop(19)
                .setMask("11/11/1111")
                .setTabindex("17")
            );
            
            host.group1.append((new linb.UI.Input)
                .host(host,"input18")
                .setLeft(330)
                .setTop(19)
                .setMask("(111) 111-1111")
                .setTabindex("18")
            );
            
            host.group1.append((new linb.UI.Input)
                .host(host,"input19")
                .setLeft(100)
                .setTop(50)
                .setMask("~1.11")
                .setTabindex("19")
            );
            
            host.group1.append((new linb.UI.Input)
                .host(host,"input20")
                .setLeft(330)
                .setTop(50)
                .setMask("(111) a-a *$*")
                .setTabindex("20")
            );
            
            append((new linb.UI.Input)
                .host(host,"input2")
                .setLeft(458)
                .setTop(10)
                .setValue("password")
                .setType("password")
                .setTabindex("2")
            );
            
            append((new linb.UI.Input)
                .host(host,"input3")
                .setLeft(138)
                .setTop(42)
                .setValue("textarea")
                .setWidth(440)
                .setHeight(48)
                .setMultiLines(true)
                .setTabindex("3")
            );
            
            append((new linb.UI.Input)
                .host(host,"input6")
                .setLeft(138)
                .setTop(106)
                .setValue("readonly")
                .setReadonly(true)
                .setTabindex("4")
            );
            
            append((new linb.UI.Input)
                .host(host,"input1")
                .setLeft(458)
                .setTop(100)
                .setValue("disabled")
                .setDisabled(true)
                .setTabindex("5")
            );
            
            append((new linb.UI.Input)
                .host(host,"input7")
                .setLeft(186)
                .setTop(162)
                .setWidth(240)
                .setHeight(56)
                .setBorder(true)
                .setShadow(true)
                .setResizer(true)
                .setTips("border/resizer/shadow")
                .setTabindex("6")
            );
            
            append((new linb.UI.Input)
                .host(host,"input8")
                .setLeft(138)
                .setTop(242)
                .setValueFormat("^[\\w\\.=-]+@[\\w\\.-]+\\.[\\w\\.-]{2,4}$")
                .setTabindex("7")
            );
            
            append((new linb.UI.Input)
                .host(host,"input10")
                .setLeft(138)
                .setTop(274)
                .setValueFormat("^\\w*$")
                .setTabindex("8")
            );
            
            append((new linb.UI.Input)
                .host(host,"input12")
                .setLeft(138)
                .setTop(306)
                .setValueFormat("^-?(\\d\\d*\\.\\d*$)|(^-?\\d\\d*$)|(^-?\\.\\d\\d*$)")
                .setTabindex("9")
            );
            
            append((new linb.UI.Input)
                .host(host,"input9")
                .setLeft(458)
                .setTop(242)
                .setValueFormat("^[a-zA-Z]*$")
                .setTabindex("10")
            );
            
            append((new linb.UI.Input)
                .host(host,"input11")
                .setLeft(458)
                .setTop(274)
                .setValueFormat("^-?\\d\\d*$")
                .setTabindex("12")
            );
            
            append((new linb.UI.Input)
                .host(host,"input13")
                .setLeft(458)
                .setTop(306)
                .setValueFormat("^([0-1][0-9])/([0-3][0-9])/([0-9]{4})$")
                .setTabindex("13")
            );
            
            append((new linb.UI.Input)
                .host(host,"input5")
                .setLeft(364)
                .setTop(340)
                .setWidth(210)
                .setTabindex("14")
                .beforeFormatCheck("_input5_beforeFormatCheck")
            );
            
            append((new linb.UI.Input)
                .host(host,"input29")
                .setLeft(154)
                .setTop(380)
                .setWidth(210)
                .setTabindex("15")
                .setTips("input number")
                .setTipsErr("tipsErr : number only")
                .setTipsOK("Yeah")
                .setValueFormat("^-?(\\d\\d*\\.\\d*$)|(^-?\\d\\d*$)|(^-?\\.\\d\\d*$)")
                .setTipsBinder("div9")
            );
            
            append((new linb.UI.Input)
                .host(host,"input15")
                .setLeft(154)
                .setTop(420)
                .setWidth(210)
                .setTabindex("16")
                .setTips("input number")
                .setTipsErr("tipsErr : number only")
                .setTipsOK("Yeah")
                .setValueFormat("^-?(\\d\\d*\\.\\d*$)|(^-?\\d\\d*$)|(^-?\\.\\d\\d*$)")
                .setTipsBinder("div10")
                .setDynCheck(true)
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        },
        _input5_beforeFormatCheck:function (profile, value) {
            return value=='allow';
        }
    }
});