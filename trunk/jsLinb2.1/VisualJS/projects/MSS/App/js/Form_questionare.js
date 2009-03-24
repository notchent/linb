Class('App.Form_questionare', 'linb.Com',{
    Instance:{
        base:[], 
        required:["linb.UI.Dialog", "linb.UI.Button", "linb.UI.Label", "linb.UI.Input", "linb.UI.Group", "linb.UI.CheckBox", "linb.UI.ComboInput"], 

        customAppend:function(){
            var self=this,
                data=self.$data;

            if(!self.dialog.get(0).root)
                self.dialog.render();

            self.iId.resetValue(data[1].value);
            self.iDesc.resetValue(data[2].value);
            self.cbMS.resetValue(data[3].value=='y');
            self.iType.resetValue(data[4].value);
            self.iCat1.resetValue(data[5].value);
            self.iW1.resetValue(data[6].value);
            self.iCat2.resetValue(data[7].value);
            self.iW2.resetValue(data[8].value);
            self.cbKey.resetValue(data[9].value=='y');

            //asy
            self.dialog.show(self.parent, true);
        }, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Dialog)
                .host(host,"dialog")
                .setLeft(170)
                .setTop(160)
                .setWidth(550)
                .setHeight(320)
                .setResizer(false)
                .setCaption("Questionnaire Form")
                .setMinBtn(false)
                .setMaxBtn(false)
                .onHotKeydown("_dialog_onhotkey")
                .beforeClose("_dialog_beforeclose")
            );
            
            host.dialog.append((new linb.UI.Label)
                .host(host,"label5")
                .setLeft(11)
                .setTop(10)
                .setCaption("Question ID")
            );
            
            host.dialog.append((new linb.UI.Label)
                .host(host,"label6")
                .setLeft(11)
                .setTop(40)
                .setCaption("Question Description")
            );
            
            host.dialog.append((new linb.UI.Label)
                .host(host,"label7")
                .setLeft(271)
                .setTop(10)
                .setCaption("Question Type")
            );
            
            host.dialog.append((new linb.UI.Group)
                .host(host,"group1")
                .setLeft(19)
                .setTop(130)
                .setWidth(500)
                .setHeight(50)
                .setCaption("Category 1")
                .setToggleBtn(false)
            );
            
            host.group1.append((new linb.UI.Label)
                .host(host,"label4")
                .setLeft(10)
                .setTop(7)
                .setWidth(100)
                .setCaption("Category")
            );
            
            host.group1.append((new linb.UI.Label)
                .host(host,"label8")
                .setLeft(260)
                .setTop(7)
                .setWidth(110)
                .setCaption("Weight")
            );
            
            host.group1.append((new linb.UI.ComboInput)
                .host(host,"iCat1")
                .setLeft(120)
                .setTop(5)
                .setTabindex("10002")
                .setItems([{"id":"telephone", "caption":"telephone"}, {"id":"welcome", "caption":"welcome"}, {"id":"salesperson", "caption":"salesperson"}, {"id":"need_analysis", "caption":"need_analysis"}, {"id":"vehicle_intro", "caption":"vehicle_intro"}, {"id":"testdrive", "caption":"testdrive"}, {"id":"negotiation", "caption":"negotiation"}, {"id":"facilities", "caption":"facilities"}])
                .setValue(null)
            );
            
            host.group1.append((new linb.UI.Input)
                .host(host,"iW1")
                .setLeft(380)
                .setTop(5)
                .setWidth(110)
                .setTabindex("10003")
                .setValueFormat("^-?(\\d\\d*\\.\\d*$)|(^-?\\d\\d*$)|(^-?\\.\\d\\d*$)")
            );
            
            host.dialog.append((new linb.UI.Group)
                .host(host,"group2")
                .setLeft(19)
                .setTop(190)
                .setWidth(500)
                .setHeight(50)
                .setCaption("Category 2")
                .setToggleBtn(false)
            );
            
            host.group2.append((new linb.UI.Label)
                .host(host,"label9")
                .setLeft(10)
                .setTop(7)
                .setWidth(100)
                .setCaption("Category")
            );
            
            host.group2.append((new linb.UI.Label)
                .host(host,"label10")
                .setLeft(260)
                .setTop(7)
                .setWidth(110)
                .setCaption("Weight")
            );
            
            host.group2.append((new linb.UI.ComboInput)
                .host(host,"iCat2")
                .setLeft(120)
                .setTop(5)
                .setTabindex("10002")
                .setItems([{"id":"caring", "caption":"caring"}, {"id":"professional", "caption":"professional"}, {"id":"trustworthy", "caption":"trustworthy"}, {"id":"non-salesperson", "caption":"non-salesperson"}])
                .setValue(null)
            );
            
            host.group2.append((new linb.UI.Input)
                .host(host,"iW2")
                .setDisabled(true)
                .setLeft(380)
                .setTop(5)
                .setWidth(110)
                .setTabindex("10003")
                .setValueFormat("^-?(\\d\\d*\\.\\d*$)|(^-?\\d\\d*$)|(^-?\\.\\d\\d*$)")
            );
            
            host.dialog.append((new linb.UI.CheckBox)
                .host(host,"cbKey")
                .setLeft(391)
                .setTop(100)
                .setCaption("Key Area")
            );
            
            host.dialog.append((new linb.UI.CheckBox)
                .host(host,"cbMS")
                .setLeft(141)
                .setTop(100)
                .setCaption("MS answer")
            );
            
            host.dialog.append((new linb.UI.Button)
                .host(host,"btnCancel")
                .setLeft(351)
                .setTop(260)
                .setTabindex("10001")
                .setCaption("Cancel")
                .onClick("_btncancel_onclick")
            );
            
            host.dialog.append((new linb.UI.Input)
                .host(host,"iId")
                .setLeft(141)
                .setTop(10)
                .setTabindex("10002")
            );
            
            host.dialog.append((new linb.UI.Input)
                .host(host,"iType")
                .setLeft(401)
                .setTop(10)
                .setWidth(110)
                .setTabindex("10003")
            );
            
            host.dialog.append((new linb.UI.Input)
                .host(host,"iDesc")
                .setLeft(141)
                .setTop(40)
                .setWidth(370)
                .setHeight(50)
                .setTabindex("10004")
                .setMultiLines(true)
            );
            
            host.dialog.append((new linb.UI.Button)
                .host(host,"btnOK")
                .setLeft(141)
                .setTop(260)
                .setTabindex("10005")
                .setCaption("Update")
                .onClick("_btnok_onclick")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _btnok_onclick:function (profile, e, value) {
            var id=this.iId.getUIValue(),
                desc=this.iDesc.getUIValue(),
                ms=this.cbMS.getUIValue(),
                type=this.iType.getUIValue(),
                c1=this.iCat1.getUIValue(),
                w1=parseFloat(this.iW1.getUIValue()),
                c2=this.iCat2.getUIValue(),
                check=this.cbKey.getUIValue(),
                arr=[];
            ms=ms?'y':'n';
            check=check?'y':'n';

            var data=this.$data;
            if(data[1].value!=id)arr.push([data[1],id]);
            if(data[2].value!=desc)arr.push([data[2],desc]);
            if(data[3].value!=ms)arr.push([data[3],ms]);
            if(data[4].value!=type)arr.push([data[4],type]);
            if(data[5].value!=c1)arr.push([data[5],c1]);
            if(data[6].value!=w1)arr.push([data[6],w1]);
            if(data[7].value!=c2)arr.push([data[7],c2]);
            if(data[9].value!=check)arr.push([data[9],check]);

            if(arr.length)
                _.tryF(this.events.onUpdate, [arr], this.$parent);
            this.dialog.close();
        }, 
        _dialog_beforeclose:function (profile) {

            delete profile.$data;
            delete profile.$parent;

            profile.boxing().hide();
            return false;
        }, 
        _dialog_onhotkey:function(profile, key, control, shift, alt){
            if(key=='esc')
                profile.boxing().close();
        }, 
        _btncancel_onclick:function (profile, e, src, value) {
            this.dialog.close();
        }
    }
});