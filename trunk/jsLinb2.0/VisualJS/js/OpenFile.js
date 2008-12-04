Class('VisualJS.OpenFile', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Dialog)
                .host(host,"dlg")
                .setWidth(690)
                .setHeight(140)
                .setResizer(false)
                .setCaption("Open jsLinb Class File")
                .setMinBtn(false)
                .setMaxBtn(false)
                .setPinBtn(false)
                .beforeClose("_beforeClose")
            );
            
            host.dlg.append((new linb.UI.Pane)
                .host(host,"pane6")
                .setWidth("auto")
                .setHeight("40")
                .setPosition("relative")
            );
            
            host.pane6.append((new linb.UI.ComboInput)
                .host(host,"combo")
                .setLeft(20)
                .setTop(10)
                .setWidth(640)
                .setValueFormat("^(http|https)\\:\\/\\/[\\w\\-\\_\\.]+[\\w\\-\\_](:[\\w]*)?\\/?([\\w\\-\\._\\?\\,\\'\\/\\\\\\+&amp;%\\$#\\=~])*$")
                .setType("none")
            );
            
            host.dlg.append((new linb.UI.Pane)
                .host(host,"pane7")
                .setWidth("auto")
                .setHeight("auto")
                .setPosition("relative")
            );
            
            host.pane7.append((new linb.UI.Group)
                .host(host,"group1")
                .setLeft("20")
                .setWidth(640)
                .setHeight("auto")
                .setPosition("relative")
                .setCaption("Open from samples")
                .setToggle(false)
                .onExpend('_grp_onexpend')
                .onFold('_grp_onfold')
                .onIniPanelView('_grp_iniview')
            );
            
            host.group1.append((new linb.UI.TreeBar)
                .host(host,"treebar")
                .setDock('none')
                .setPosition('relative')
                .setLeft(10)
                .setWidth(620)
                .setHeight(140)
                .setSelMode('none')
                .onItemSelected('_tb_onsel')
            );
            
            host.dlg.append((new linb.UI.Pane)
                .host(host,"pane8")
                .setWidth("auto")
                .setHeight(40)
                .setPosition("relative")
            );
            
            host.pane8.append((new linb.UI.Button)
                .host(host,"btn")
                .setLeft(280)
                .setTop(10)
                .setWidth(90)
                .setCaption("Open it")
                .onClick("_open")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _open:function (profile, item, group, e, src) {
            if(!this.combo.checkValid())return false;
            var url=this.combo.getUIValue();
            if(!/\.js/.test(url)){
                linb.message('Not a js file.');
                return;
            }
            _.tryF(this.onOpenFile,[url],this);
        }, 
        _beforeClose:function(profile){
            profile.boxing().hide();
            return false;
        }, 
        _grp_onexpend:function(profile){
            this.dlg.setHeight(280);
        },
        _grp_onfold:function(profile){
            this.dlg.setHeight(140);
        },
        _grp_iniview:function(profile){
            var ins=profile.boxing(),
            self=this;
            ins.busy('PANEL');
            linb.Thread.observableRun(null,[function(threadid){
                linb.Ajax('js/ClsSamples.js','',function(txt){
                    var items = _.unserialize(txt);
                    if(false===items){
                        linb.message('Data source format error!');
                    }else
                        self.treebar.setItems(items);
                    ins.free();
                },function(msg){
                    linb.message(msg);
                    ins.free();
                },threadid).start();
            }]);
        },
        _tb_onsel:function(profile, item){
            linb.message(item.value);
        }
    }
});