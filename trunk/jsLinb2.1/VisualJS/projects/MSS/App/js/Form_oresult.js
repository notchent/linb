
Class('App.Form_oresult', 'linb.Com',{
    Instance:{
        properties:{}, 
        events:{"onReady":"_onready"}, 
        iniResource:function(com, threadid){
            var group={
                getXFactor : new linb.SAjax(CONF.service, {key:'DBProcess',para:{action:'db_select_any',key:'xfactor',where:('1 order by `order`')}}, function(rsp){
                    var obj;
                    if(typeof rsp=='string')
                        obj=_.unserialize(rsp);
                    else obj=rsp;
                    if(obj){
                        if(!obj.error){
                            com.$xfactor=obj.data;
                            com.$xfactormap={};
                            _.arr.each(obj.data,function(o){
                                com.$xfactormap[o[1]]=o[3];
                            });
                    }else
                            SPA.popMsg(_.serialize(obj.error));
                    }else
                        SPA.popMsg(_.serialize(rsp));
                },function(rsp){
                    SPA.popMsg(_.serialize(rsp));
                }),
                getQAssoc: new linb.SAjax(CONF.service, {key:'DBProcess',para:{action:'db_select_any',key:'questionare',fields:'`code`,`q_desc`'}}, function(rsp){
                    var obj=rsp;
                    if(obj){
                        if(!obj.error){
                            var a=com.$qassoc={};
                            _.arr.each(obj.data,function(o){
                                a[o[0]]=o[1];
                            });
                        }else
                            SPA.popMsg(_.serialize(obj.error));
                    }else
                        SPA.popMsg(_.serialize(rsp));
                },function(rsp){
                    SPA.popMsg(_.serialize(rsp));
                })
            };
            linb.absIO.groupCall(group,null,null,null,threadid);
        }, 
        iniExComs:function(com, hreadid){
        }, 
        customAppend:function(p,sId,threadid){
            var self=this,
                data=self.$data;

            if(!self.dialog.get(0).root)
                self.dialog.render();

            //asy
            self.dialog.show(self.parent, true);

            self.iA.setValue('');
            self.divQ.setHtml('Need to select one from the "MS Said" area!');
            self.tbLeft.setValue(null,true);
            self.divInfo.setHtml((data[0].value||data[0]) + ' (wave ' +(data[1].value||data[1]) + ') '  + ' [Checked ' +(data[6].value||data[6]) + ' times]')
            self.listS.clearItems();
            self.listD.clearItems();
            self.listE.clearItems();


            linb.Thread.suspend(threadid);
            self.dialog.busy();
            self.$wave=data[1].value||data[1];
            self.$outletno=data[2].value||data[2];
            linb.request(CONF.service, {key:'DBProcess',para:{action:'db_select_any',key:'oresult', assoc:true, fields:'*',where:"`wave`='"+self.$wave+"' and `X1-outletno`='"+self.$outletno+"'"}}, function(rsp){
                var obj;
                if(typeof rsp=='string')
                    obj=_.unserialize(rsp);
                else obj=rsp;
                if(obj){
                    if(!obj.error){
                        self.$record=obj.data[0];
                        if(self.$dflValue)
                            self.tbLeft.fireItemClickEvent(self.$dflValue);
console.log(self.$dflValue);
                    }else
                        SPA.popMsg(_.serialize(obj.error));
                }else
                    SPA.popMsg(_.serialize(rsp));
                linb.Thread.resume(threadid);
                self.dialog.free();
            },function(rsp){
                SPA.popMsg(_.serialize(rsp));
                linb.Thread.resume(threadid);
                self.dialog.free();
            }, threadid);
        }, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Dialog)
                .host(host,"dialog")
                .setLeft(110)
                .setTop(80)
                .setWidth(800)
                .setHeight(490)
                .setResizer(false)
                .setCaption("Attributes Extraction Form")
                .setMinBtn(false)
                .setMaxBtn(false)
                .onHotKeydown("_dialog_onhotkey")
                .beforeClose("_dialog_beforeclose")
            );
            
            host.dialog.append((new linb.UI.Layout)
                .host(host,"layout8")
                .setItems([{"id":"before", "pos":"before", "min":10, "size":120, "locked":false, "hide":false, "cmd":false, "caption":"before"}, {"id":"main", "min":10, "caption":"main"}, {"id":"after", "pos":"after", "min":10, "size":220, "locked":false, "hide":false, "cmd":false, "caption":"after"}])
                .setType("horizontal")
            );
            
            host.layout8.append((new linb.UI.Panel)
                .host(host,"panel15")
                .setZIndex(1)
                .setCaption("MS Said")
            , 'before');
            
            host.panel15.append((new linb.UI.TreeBar)
                .host(host,"tbLeft")
                .setIniFold(false)
                .onItemSelected("_tbleft_onitemselected")
            );
            
            host.layout8.append((new linb.UI.Panel)
                .host(host,"panel16")
                .setZIndex(1)
                .setCaption("Attributes")
            , 'after');
            
            host.panel16.append((new linb.UI.TreeBar)
                .host(host,"tbRight")
                .setIniFold(false)
                .setSelMode("none")
                .setDragKey("factor")
                .onStartDrag("_tbright_onstartdrag")
            );
            
            host.layout8.append((new linb.UI.Pane)
                .host(host,"paneForm")
                .setLeft(10)
                .setTop(10)
                .setWidth(440)
                .setHeight(380)
            , 'main');
            
            host.paneForm.append((new linb.UI.Group)
                .host(host,"group9")
                .setLeft(0)
                .setTop(100)
                .setWidth(360)
                .setHeight(87)
                .setCaption("Satisfied Factors")
                .setToggleBtn(false)
            );
            
            host.group9.append((new linb.UI.List)
                .host(host,"listS")
                .setDirtyMark(false)
                .setTag("s")
                .setLeft(10)
                .setTop(5)
                .setWidth(340)
                .setHeight(55)
                .setDropKeys("factor")
                .setValue("a")
                .onDrop("_lists_ondrop")
            );
            
            host.paneForm.append((new linb.UI.Group)
                .host(host,"group10")
                .setLeft(0)
                .setTop(190)
                .setWidth(360)
                .setHeight(87)
                .setCaption("Dissatisfied Factors")
                .setToggleBtn(false)
            );
            
            host.group10.append((new linb.UI.List)
                .host(host,"listD")
                .setDirtyMark(false)
                .setTag("d")
                .setLeft(10)
                .setTop(6)
                .setWidth(340)
                .setHeight(54)
                .setDropKeys("factor")
                .setValue("a")
                .onDrop("_lists_ondrop")
            );
            
            host.paneForm.append((new linb.UI.Group)
                .host(host,"group18")
                .setLeft(0)
                .setTop(280)
                .setWidth(360)
                .setHeight(87)
                .setCaption("Expect Factors")
                .setToggleBtn(false)
            );
            
            host.group18.append((new linb.UI.List)
                .host(host,"listE")
                .setDirtyMark(false)
                .setTag("e")
                .setLeft(10)
                .setTop(5)
                .setWidth(340)
                .setHeight(55)
                .setDropKeys("factor")
                .setValue("a")
                .onDrop("_lists_ondrop")
            );
            
            host.paneForm.append((new linb.UI.Div)
                .host(host,"divQ")
                .setLeft(0)
                .setTop(10)
                .setWidth(420)
                .setHeight(30)
                .setHtml("Q : ")
            );
            
            host.paneForm.append((new linb.UI.Input)
                .host(host,"iA")
                .setLeft(0)
                .setTop(42)
                .setWidth(360)
                .setHeight(58)
                .setReadonly(true)
                .setMultiLines(true)
                .setCustomStyle({"INPUT":"background-color:#f3f3f3"})
            );
            
            host.paneForm.append((new linb.UI.Button)
                .host(host,"btnS")
                .setLeft(370)
                .setTop(140)
                .setWidth(60)
                .setCaption("Detach")
                .onClick("_btns_onclick")
            );
            
            host.paneForm.append((new linb.UI.Button)
                .host(host,"btnD")
                .setLeft(370)
                .setTop(230)
                .setWidth(60)
                .setCaption("Detach")
                .onClick("_btnd_onclick")
            );
            
            host.paneForm.append((new linb.UI.Button)
                .host(host,"btnE")
                .setLeft(370)
                .setTop(320)
                .setWidth(60)
                .setCaption("Detach")
                .onClick("_btne_onclick")
            );
            
            host.paneForm.append((new linb.UI.Button)
                .host(host,"button11")
                .setLeft(370)
                .setTop(60)
                .setWidth(60)
                .setCaption("Mark It")
                .onClick("_button11_onclick")
            );
            
            host.dialog.append((new linb.UI.Block)
                .host(host,"block2")
                .setDock("top")
                .setHeight(30)
                .setBorderType("ridge")
            );
            
            host.block2.append((new linb.UI.Div)
                .host(host,"divInfo")
                .setLeft(11)
                .setTop(4)
                .setWidth(670)
                .setHeight(22)
            );
            
            host.dialog.append((new linb.UI.Block)
                .host(host,"block3")
                .setDock("bottom")
                .setHeight(38)
                .setBorderType("groove")
            );
            
            host.block3.append((new linb.UI.Button)
                .host(host,"btnClose")
                .setLeft(611)
                .setTop(7)
                .setCaption("Close")
                .onClick("_btnclose_onclick")
            );
            
            host.block3.append((new linb.UI.Button)
                .host(host,"btnChecked")
                .setTips("Click me only after you checked all the questions!")
                .setLeft(21)
                .setTop(7)
                .setWidth(110)
                .setCaption("Done")
                .onClick("_btnChecked_onclick")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _onready:function (com, threadid) {
            this.tbLeft.setItems(CONF.XQuestions);
            var hash={}, items=[];
            _.arr.each(com.$xfactor,function(o){
                var cat=o[4];
                if(!hash[cat])hash[cat]=[];
                hash[cat].push({id:o[1],caption:o[3],tips:o[2],disabled:cat=='trustworthy'});
            });
            _.each(hash,function(o,i){
                items.push({id:i,group:true,sub:o});
            });
            this.tbRight.setItems(items);
        }, 
        _dialog_beforeclose:function (profile) {
            var self=this;

            self.$dflValue=self.$data=self.$parent=self.$wave=self.$outletno=self.$qcode=null;

            profile.boxing().hide();
            return false;
        }, 
        _dialog_onhotkey:function(profile, key, control, shift, alt){
            if(key=='esc')
                profile.boxing().close();
        }, 
        _btnclose_onclick:function (profile, e, src, value) {
             this.dialog.close();
        }, 
        _tbleft_onitemselected:function (profile, item, src) {
            var id=item.id, self=this;
            var callback=function(data){
                self.$qcode=id;
                self.iA.setValue(self.$record[id],true);
                self.divQ.setHtml(id +" : " + self.$qassoc[id]);

                var map=self.$xfactormap, listS=[], listD=[], listE=[], item;
                _.arr.each(data.data,function(o){
                    item={id:o[4],caption:map[o[4]],uid:o[0]};
                    if(o[5]=='s')listS.push(item);
                    if(o[5]=='d')listD.push(item);
                    if(o[5]=='e')listE.push(item);
                })
                self.listS.setItems(listS);
                self.listD.setItems(listD);
                self.listE.setItems(listE);
            }

            self.$qcode=null;
            self.listS.clearItems();
            self.listD.clearItems();
            self.listE.clearItems();

            SPA.request({action:'db_select_any',key:'factorlink',where:"`outlet`='"+self.$outletno+"' and `wave`='"+self.$wave+"' and `q_code`='"+id+"'"},callback,function(){
                self.paneForm.busy()
            },function(){
                self.paneForm.free()
            });
        }, 
        _lists_ondrop:function (profile, e, src, key, data) {
            var self=this;
            if(!self.$wave || !self.$outletno || !self.$qcode)return false;

            var p=data.profile,
            item=p.boxing().getItemByDom(data.domId),
            list=profile.boxing(),
            exist=list.getItemByItemId(item.id);

            if(list.getItems().length>=5){
                SPA.popMsg("The max count is 5!");
            }else{
                if(!exist){
                    var callback=function(data){
                        list.insertItems([{id:item.id, caption:item.caption, uid:data.data }],null,false);
                    };
                    SPA.request({action:'db_insert_any',key:'factorlink',fields:{
                        wave:self.$wave,
                        outlet:self.$outletno,
                        q_code:self.$qcode,
                        factor_code:item.id,
                        sign:profile.boxing().getTag()
                    }},callback,function(){
                        self.paneForm.busy()
                    },function(){
                        self.paneForm.free()
                    });
                }
            }
            return false;
        }, 
        __detach:function(ctrl){
            var self=this,
                v=ctrl.getUIValue(),
                item=ctrl.getItemByItemId(v),
                uid=item.uid;
            if(!v)return;

            SPA.request({action:'db_delete_any',key:'factorlink',uidname:'id',uid:uid},function(data){
                ctrl.removeItems([v]);
            },function(){
                self.paneForm.busy()
            },function(){
                self.paneForm.free()
            });
        }, 
        _btns_onclick:function (profile, e, src, value) {
            this.__detach(this.listS);
        }, 
        _btnd_onclick:function (profile, e, src, value) {
            this.__detach(this.listD);
        }, 
        _btne_onclick:function (profile, e, src, value) {
            this.__detach(this.listE);
        }, 
        _btnChecked_onclick:function (profile, e, src, value) {
            var self=this;

            SPA.request({action:'db_insert_any',key:'workinghistory',fields:{
                user:'user',
                outlet:self.$outletno,
                wave:self.$wave
            }},function(data){
                self.dialog.close();
            },function(){
                self.dialog.busy()
            },function(){
                self.dialog.free()
            });
        }, 
        _tbright_onstartdrag:function (profile, e, src) {
            var item=profile.boxing().getItemByDom(src.id);
            if((!this.$qcode)||item.disabled||item.group)return false;
        }, 
        _button11_onclick:function (profile, e, src, value) {
            var self=this;
            if(!self.$wave || !self.$outletno || !self.$qcode)return false;

            SPA.request({action:'db_insert_any',key:'specialmark',fields:{
                outlet:self.$outletno,
                wave:self.$wave,
                q_code:self.$qcode
            }},function(data){
            },function(){
                self.dialog.busy()
            },function(){
                self.dialog.free()
            });
        }, 
        base:[], 
        required:["linb.UI.Dialog", "linb.UI.Layout", "linb.UI.Panel", "linb.UI.TreeBar", "linb.UI.Pane", "linb.UI.Group", "linb.UI.List", "linb.UI.Div", "linb.UI.Input", "linb.UI.Button", "linb.UI.Block"]
    }
});