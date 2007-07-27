Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Input","linb.UI.Label"],
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.label8 = (new linb.UI.Label)
            .alias("label8").host(this)
            .setLeft(352).setTop(272).setWidth(104).setCaption("letter")
            ;
            this.nodes.push(this.label8.get(0));

            this.label7 = (new linb.UI.Label)
            .alias("label7").host(this)
            .setLeft(32).setTop(272).setWidth(104).setCaption("email")
            ;
            this.nodes.push(this.label7.get(0));

            this.label3 = (new linb.UI.Label)
            .alias("label3").host(this)
            .setLeft(32).setTop(72).setWidth(104).setCaption("textarea")
            ;
            this.nodes.push(this.label3.get(0));

            this.label12 = (new linb.UI.Label)
            .alias("label12").host(this)
            .setLeft(352).setTop(336).setWidth(104).setCaption("MM/DD/YYYY")
            ;
            this.nodes.push(this.label12.get(0));

            this.label10 = (new linb.UI.Label)
            .alias("label10").host(this)
            .setLeft(352).setTop(304).setWidth(104).setCaption("integer")
            ;
            this.nodes.push(this.label10.get(0));

            this.label5 = (new linb.UI.Label)
            .alias("label5").host(this)
            .setLeft(352).setTop(136).setWidth(104).setCaption("disabled")
            ;
            this.nodes.push(this.label5.get(0));

            this.label13 = (new linb.UI.Label)
            .alias("label13").host(this)
            .setLeft(64).setTop(424).setWidth(296).setCaption("Input 'allow' only, using 'onFormatCheck' event")
            ;
            this.nodes.push(this.label13.get(0));

            this.label9 = (new linb.UI.Label)
            .alias("label9").host(this)
            .setLeft(32).setTop(304).setWidth(104).setCaption("alpha")
            ;
            this.nodes.push(this.label9.get(0));

            this.label1 = (new linb.UI.Label)
            .alias("label1").host(this)
            .setLeft(32).setTop(40).setWidth(104).setCaption("normal")
            ;
            this.nodes.push(this.label1.get(0));

            this.label6 = (new linb.UI.Label)
            .alias("label6").host(this)
            .setLeft(16).setTop(208).setWidth(168).setCaption("border/resizable/shadow")
            ;
            this.nodes.push(this.label6.get(0));

            this.label2 = (new linb.UI.Label)
            .alias("label2").host(this)
            .setLeft(352).setTop(40).setWidth(104).setCaption("password")
            ;
            this.nodes.push(this.label2.get(0));

            this.label11 = (new linb.UI.Label)
            .alias("label11").host(this)
            .setLeft(32).setTop(336).setWidth(104).setCaption("number")
            ;
            this.nodes.push(this.label11.get(0));

            this.label4 = (new linb.UI.Label)
            .alias("label4").host(this)
            .setLeft(32).setTop(136).setWidth(104).setCaption("readonly")
            ;
            this.nodes.push(this.label4.get(0));

            this.input1 = (new linb.UI.Input)
            .alias("input1").host(this)
            .setLeft(464).setTop(136).setValue("disabled").setDisabled(true)
            ;
            this.nodes.push(this.input1.get(0));

            this.input4 = (new linb.UI.Input)
            .alias("input4").host(this)
            .setLeft(144).setTop(40).setValue("normal")
            ;
            this.nodes.push(this.input4.get(0));

            this.input2 = (new linb.UI.Input)
            .alias("input2").host(this)
            .setLeft(464).setTop(40).setValue("password").setType("password").setTabindex("2")
            ;
            this.nodes.push(this.input2.get(0));

            this.input3 = (new linb.UI.Input)
            .alias("input3").host(this)
            .setLeft(144).setTop(72).setValue("textarea").setWidth(440).setHeight(48).setInputArea("textarea").setTabindex("3")
            ;
            this.nodes.push(this.input3.get(0));

            this.input6 = (new linb.UI.Input)
            .alias("input6").host(this)
            .setLeft(144).setTop(136).setValue("readonly").setReadonly(true).setTabindex("4")
            ;
            this.nodes.push(this.input6.get(0));

            this.input7 = (new linb.UI.Input)
            .alias("input7").host(this)
            .setLeft(192).setTop(192).setWidth(240).setHeight(56).setBorder(true).setShadow(true).setResizable(true).setTips("border/resizable/shadow").setTabindex("5")
            ;
            this.nodes.push(this.input7.get(0));

            this.input8 = (new linb.UI.Input)
            .alias("input8").host(this)
            .setLeft(144).setTop(272).setValueFormat("^[\\w\\.=-]+@[\\w\\.-]+\\.[\\w\\.-]{2,4}$").setTabindex("6")
            ;
            this.nodes.push(this.input8.get(0));

            this.input10 = (new linb.UI.Input)
            .alias("input10").host(this)
            .setLeft(144).setTop(304).setValueFormat("^\\w*$").setTabindex("7")
            ;
            this.nodes.push(this.input10.get(0));

            this.input12 = (new linb.UI.Input)
            .alias("input12").host(this)
            .setLeft(144).setTop(336).setValueFormat("^-?(\\d\\d*\\.\\d*$)|(^-?\\d\\d*$)|(^-?\\.\\d\\d*$)").setTabindex("8")
            ;
            this.nodes.push(this.input12.get(0));

            this.input9 = (new linb.UI.Input)
            .alias("input9").host(this)
            .setLeft(464).setTop(272).setValueFormat("^[a-zA-Z]*$").setTabindex("9")
            ;
            this.nodes.push(this.input9.get(0));

            this.input11 = (new linb.UI.Input)
            .alias("input11").host(this)
            .setLeft(464).setTop(304).setValueFormat("^-?\\d\\d*$").setTabindex("10")
            ;
            this.nodes.push(this.input11.get(0));

            this.input13 = (new linb.UI.Input)
            .alias("input13").host(this)
            .setLeft(464).setTop(336).setValueFormat("^([0-1][0-9])/([0-3][0-9])/([0-9]{4})$").setTabindex("11")
            ;
            this.nodes.push(this.input13.get(0));

            this.input5 = (new linb.UI.Input)
            .alias("input5").host(this)
            .setLeft(370).setTop(424).setWidth(210).setTabindex("12")
            .onFormatCheck("_input5_onformatcheck")
            ;
            this.nodes.push(this.input5.get(0));
            return this.nodes;
            // ]]code creted by designer
        },
        _input5_onformatcheck:function (profile, value) {
            return value=='allow';
        }
    }
});