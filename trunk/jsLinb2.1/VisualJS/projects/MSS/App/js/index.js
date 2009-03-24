
Class('App', 'linb.Com',{
    Instance:{
        //base Class for this com
        base:["linb.UI"], 
        //requried class for this com
        required:["linb.UI.Button", "linb.UI.Layout", "linb.UI.Stacks", "linb.UI.TreeGrid", "linb.UI.TreeBar", "linb.UI.ToolBar", "linb.UI.Block"], 

        properties:{}, 
        events:{"onReady":"_onready"}, 
        iniResource:function(com, threadid){
        }, 
        iniExComs:function(com, hreadid){
        }, 
        _onready:function (com, threadid) {
            SPA=this;
            linb.ComFactory.setProfile(CONF.ComFactoryProfile);
            SPA._iniTg();
        }, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Layout)
                .host(host,"layout6")
                .setItems([{"id":"before", "pos":"before", "min":10, "size":200, "locked":false, "hide":false, "cmd":false, "caption":"before"}, {"id":"main", "min":10, "caption":"main"}])
                .setType("horizontal")
            );
            
            host.layout6.append((new linb.UI.Stacks)
                .host(host,"stacks1")
                .setItems([{"id":"base", "caption":"Setting"}, {"id":"function", "caption":"Working"}])
                .setValue("base")
                .setCustomStyle({"PANEL":"overflow:hidden"})
            , 'before');
            
            host.stacks1.append((new linb.UI.TreeBar)
                .host(host,"funTreebar")
                .setItems([{"id":"view_oresult", "caption":"Results"}])
                .setSelMode("none")
                .onItemSelected("_basetreebar_onitemselected")
            , 'function');
            
            host.stacks1.append((new linb.UI.TreeBar)
                .host(host,"baseTreebar")
                .setItems([{"id":"questionare", "caption":"Questionnaire"}, {"id":"view_xfactor", "caption":"Attributes Setting"}])
                .setSelMode("none")
                .onItemSelected("_basetreebar_onitemselected")
            , 'base');
            
            host.layout6.append((new linb.UI.TreeGrid)
                .host(host,"tgList")
                .setRowHandler(false)
                .beforeRowActive("_tglist_beforerowactive")
                .onDblClickRow("_tglist_ondblclickrow")
            , 'main');
            
            host.layout6.append((new linb.UI.ToolBar)
                .host(host,"toolbarTg")
                .setItems([{"sub":["toolbar"]}])
                .setDockOrder("2")
                .onClick("_toolbartg_onclick")
            , 'main');
            
            host.layout6.append((new linb.UI.Block)
                .host(host,"blockTitle")
                .setDock("top")
                .setHeight(30)
                .setCustomStyle({"PANEL":"text-align:center;font-size:18px;color:blue;"})
            , 'main');
            
            append((new linb.UI.Block)
                .host(host,"block5")
                .setDock("top")
                .setHeight(30)
                .setHtml("<div style=\"text-align:center;font-size:18px\">BTST MSS Online Tools</div>")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _getFields:function(key){
           var columns=CONF.columns[key], fields=[];
           _.arr.each(columns,function(o,i){
               fields.push('`'+o.id+'`');
           });
           return fields.join(',');
        }, 
        _basetreebar_onitemselected:function (profile, item, src) {
            var columns=CONF.columns[item.id],
                paras=CONF.paras[item.id],
                dftParas={action:'db_select_any',key:item.id,fields:SPA._getFields(item.id)};

            if(!columns){
                SPA.popMsg('Define "'+item.id+'" in CONF.columns first!');
                return;
            }
            if(!paras){
                paras=dftParas;
            }

            SPA._iniTg();

            SPA.request(paras,function(rsp){
                SPA.blockTitle.setHtml('Current Working Table : '+item.caption);
                SPA.tgList.setHeader(columns).setRows(rsp.data);
                SPA.$cur_key=item.id;
            },function(){
                SPA.tgList.busy();
            },function(){
                SPA.tgList.free();
            });
        }, 
        _tglist_ondblclickrow:function (profile, row, e, src) {
            SPA._showForm(row);
        }, 
        _tglist_beforerowactive:function (profile, row) {
            SPA.toolbarTg.updateItem('edit',{disabled:false});
            SPA.toolbarTg.updateItem('remove',{disabled:false});

            SPA.$active_row=row;
        }, 
        _toolbartg_onclick:function (profile, item, group, e, src) {
            if(!SPA.$active_row)return;
            if(item.id=='edit')
                SPA._showForm(SPA.$active_row);
        }, 

/*
* functions
*/
        //to show message
        popMsg:function(msg){
            linb.UI.Dialog.pop(msg);
        }, 

        //to interact with server
        request:function(hash, callback, onStart, onEnd, file){
            _.tryF(onStart);
            linb.Thread.observableRun(function(threadid){
                var data={key:'DBProcess',para:hash}, options;
                if(file){
                    data.file=file;
                    options={method:'post'};
                }
                linb.request(CONF.service, data, function(rsp){
                    var obj;
                    if(typeof rsp=='string')
                        obj=_.unserialize(rsp);
                    else obj=rsp;
                    if(obj){
                        if(!obj.error)
                            _.tryF(callback,[obj]);
                        else
                            SPA.popMsg(_.serialize(obj.error));
                    }else
                        SPA.popMsg(_.serialize(rsp));
                    _.tryF(onEnd);
                },function(rsp){
                    SPA.popMsg(_.serialize(rsp));
                    _.tryF(onEnd);
                }, threadid,options)
            });
        }, 

        //to ini treegrid and toolbars
        _iniTg:function(){
            SPA.toolbarTg.setItems([{"id":"group1", "sub":[{"id":"new", "caption":"new", "disabled":true}, {"id":"edit", "caption":"edit", "disabled":true}, {"id":"remove", "caption":"remove", "disabled":true}], "caption":"group1"}])
            SPA.blockTitle.setHtml('');
            SPA.tgList.setRows([]).setHeader([]);
        }, 

        //to show form
        _showForm:function(row){
            linb.ComFactory.getCom(SPA.$cur_key ,function(){
                this.$parent=SPA;
                this.$data=row.cells;
                this.setEvents('onUpdate', SPA._updateRow);
                this.show(linb([document.body]));
            });
        }, 

        //to update Row
        _updateRow:function(data){
            if(!data.length)return;

            var mainTableKey=CONF.mainTableKey;

             var uid= data[0][0]._row.cells[0].value,
                fields={};
            _.arr.each(data,function(o,i){
                fields[o[0]._col.id] = o[1];
            });
            SPA.request({action:'db_update_any', key:mainTableKey[SPA.$cur_key]||SPA.$cur_key,fields:fields, uid:uid}, function(rsp){
                if(rsp.data==1)
                    _.arr.each(data,function(o){
                        SPA.tgList.updateCell(o[0],{value:o[1]},false);
                    });
            });
        }
    }
});