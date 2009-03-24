Class('App.Form_factor', 'linb.Com',{
    Instance:{
        customAppend:function(){
            var self=this,
                data=self.$data;

            if(!self.dialog.get(0).root)
                self.dialog.render();

            self.iCode.resetValue(data[1].value);
            self.iFactor.resetValue(data[2].value);
            self.iDesc.resetValue(data[3].value);
            self.iCat.resetValue(data[4].value);
            self.iOrder.resetValue(data[5].value);

            //asy
            self.dialog.show(self.parent, true);


var sql=" SELECT t2.outlet, t2.wave, t2.sign , t1.field, t1.`TL-Q1a` " +
" FROM tbl_view_oresultx t1, tbl_factorlink t2 " +
" WHERE t1.field = t2.q_code " +
" AND t1.`X1-outletno` = t2.outlet " +
" AND t1.wave = t2.wave " +
" AND t2.factor_code = '"+
data[1].value +
"' ";
            self.tg.removeAllRows();
            self.tg.busy();
            linb.request(CONF.service, {key:'DBProcess',para:{action:'db_query_any',query: sql}}, function(rsp){
                var obj;
                if(typeof rsp=='string')
                    obj=_.unserialize(rsp);
                else obj=rsp;
                if(obj){
                    if(!obj.error){
                        var rows=[{id:'s',group:true,sub:[]},{id:'d',group:true,sub:[]},{id:'e',group:true,sub:[]}], c0=0,c1=0,c2=0;
                        _.arr.each(obj.data,function(o){
                            if(o[2]=='s'){
                                rows[0].sub.push(o);
                                c0++;
                            }else if(o[2]=='d'){
                                rows[1].sub.push(o);
                                c1++;
                            }else if(o[2]=='e'){
                                rows[2].sub.push(o);
                                c2++;
                            }
                        });

                        rows[0].caption='Satisfied : '+c0;
                        rows[1].caption='Dissatisfied : '+c1;
                        rows[2].caption='Expect : '+c2;

                        self.tg.setRows(rows);
                    }else
                        SPA.popMsg(_.serialize(obj.error));
                }else
                    SPA.popMsg(_.serialize(rsp));

                self.tg.free();
            },function(rsp){
                SPA.popMsg(_.serialize(rsp));
                self.tg.free();
            });
        }, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Dialog)
                .host(host,"dialog")
                .setLeft(130)
                .setTop(60)
                .setWidth(610)
                .setHeight(510)
                .setResizer(false)
                .setCaption("Attribute Mining Form")
                .setMinBtn(false)
                .setMaxBtn(false)
                .onHotKeydown("_dialog_onhotkey")
                .beforeClose("_dialog_beforeclose")
            );
            
            host.dialog.append((new linb.UI.Label)
                .host(host,"label5")
                .setLeft(21)
                .setTop(12)
                .setWidth(100)
                .setCaption("Code")
            );
            
            host.dialog.append((new linb.UI.Label)
                .host(host,"label6")
                .setLeft(21)
                .setTop(90)
                .setWidth(100)
                .setCaption("Description")
            );
            
            host.dialog.append((new linb.UI.Button)
                .host(host,"btnCancel")
                .setLeft(441)
                .setTop(450)
                .setTabindex("10001")
                .setCaption("Close")
                .onClick("_btncancel_onclick")
            );
            
            host.dialog.append((new linb.UI.Input)
                .host(host,"iCode")
                .setLeft(131)
                .setTop(12)
                .setTabindex("10002")
                .setReadonly(true)
            );
            
            host.dialog.append((new linb.UI.ComboInput)
                .host(host,"iCat")
                .setLeft(341)
                .setTop(12)
                .setTabindex("10002")
                .setItems([{"id":"caring", "caption":"caring"}, {"id":"professional", "caption":"professional"}, {"id":"trustworthy", "caption":"trustworthy"}, {"id":"non-salesperson", "caption":"non-salesperson"}])
                .setValue(null)
            );
            
            host.dialog.append((new linb.UI.Input)
                .host(host,"iDesc")
                .setLeft(131)
                .setTop(90)
                .setWidth(450)
                .setHeight(40)
                .setTabindex("10004")
                .setMultiLines(true)
            );
            
            host.dialog.append((new linb.UI.Button)
                .host(host,"btnOK")
                .setLeft(441)
                .setTop(140)
                .setTabindex("10005")
                .setCaption("Update")
                .onClick("_btnok_onclick")
            );
            
            host.dialog.append((new linb.UI.Label)
                .host(host,"label9")
                .setLeft(261)
                .setTop(12)
                .setWidth(70)
                .setCaption("Category")
            );
            
            host.dialog.append((new linb.UI.Block)
                .host(host,"block6")
                .setLeft(21)
                .setTop(180)
                .setWidth(570)
                .setHeight(260)
                .setBorderType("ridge")
            );
            
            host.block6.append((new linb.UI.TreeGrid)
                .host(host,"tg")
                .setDirtyMark(false)
                .setRowResizer(false)
                .setHeader([{"id":"outlet", "caption":"outlet", "width":50, "type":"label"}, {"id":"wave", "caption":"wave", "width":30, "type":"label"}, {"id":"sign", "caption":"sign", "width":30, "type":"label"}, {"id":"field", "caption":"qcode", "width":50, "type":"label"}, {"id":"TL-Q1a", "caption":"answer", "width":320, "type":"label"}])
                .onDblClickRow("_tg_ondblclickrow")
            );
            
            host.dialog.append((new linb.UI.Input)
                .host(host,"iOrder")
                .setLeft(531)
                .setTop(10)
                .setWidth(50)
                .setTabindex("10003")
                .setValueFormat("^-?(\\d\\d*\\.\\d*$)|(^-?\\d\\d*$)|(^-?\\.\\d\\d*$)")
                .setValue("0")
            );
            
            host.dialog.append((new linb.UI.Label)
                .host(host,"label8")
                .setLeft(471)
                .setTop(12)
                .setWidth(50)
                .setCaption("Order")
            );
            
            host.dialog.append((new linb.UI.Label)
                .host(host,"label26")
                .setLeft(21)
                .setTop(40)
                .setWidth(100)
                .setCaption("Factor")
            );
            
            host.dialog.append((new linb.UI.Input)
                .host(host,"iFactor")
                .setLeft(131)
                .setTop(40)
                .setWidth(450)
                .setHeight(40)
                .setTabindex("10004")
                .setMultiLines(true)
            );
            
            host.dialog.append((new linb.UI.Label)
                .host(host,"label49")
                .setLeft(231)
                .setTop(160)
                .setCaption("Items Linked")
                .setFontWeight("bold")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _btnok_onclick:function (profile, e, value) {
            var code=this.iCode.getUIValue(),
                desc=this.iDesc.getUIValue(),
                factor=this.iFactor.getUIValue(),
                cat=this.iCat.getUIValue(),
                order=parseFloat(this.iOrder.getUIValue())
                arr=[];

            var data=this.$data;
            if(data[1].value!=code)arr.push([data[1],code]);
            if(data[2].value!=factor)arr.push([data[2],factor]);
            if(data[3].value!=desc)arr.push([data[3],desc]);
            if(data[4].value!=cat)arr.push([data[4],cat]);
            if(data[5].value!=order)arr.push([data[5],order]);

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
        }, 
        base:[], 
        required:["linb.UI.Dialog", "linb.UI.Label", "linb.UI.Button", "linb.UI.Input", "linb.UI.ComboInput", "linb.UI.Group", "linb.UI.TreeGrid", "linb.UI.Block"], 
        _tg_ondblclickrow:function (profile, row, e, src) {
            var self=this,
                cells=row.cells,
                wave=cells[1].value,
                outlet=cells[0].value,
                qcode=cells[3].value;

            linb.Dom.busy();
            linb.request(CONF.service, {key:'DBProcess',para:{action:'db_select_any',key:"view_oresult",fields:SPA._getFields("view_oresult"),where:("`wave`='"+wave+"' and `X1-outletno`='"+outlet+"'")}}, function(rsp){
                var obj;
                if(typeof rsp=='string')
                    obj=_.unserialize(rsp);
                else obj=rsp;
                if(obj){
                    if(!obj.error){
                        var cells=obj.data[0];
                        linb.ComFactory.getCom("view_oresult" ,function(){
                            this.$data=cells;
                            this.$dflValue=qcode;
                            this.show(self.dialog);
                        });
                    }else
                        SPA.popMsg(_.serialize(obj.error));
                }else
                    SPA.popMsg(_.serialize(rsp));

                linb.Dom.free();
            },function(rsp){
                SPA.popMsg(_.serialize(rsp));
                linb.Dom.free();
            });
        }
    }
});