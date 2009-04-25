
Class('App', 'linb.Com',{
    Instance:{
        //base Class for this com
        base:["linb.UI"], 
        required:["linb.UI.Block", "linb.UI.TreeGrid", "linb.UI.Group", "linb.UI.Input", "linb.UI.Button", "linb.UI.Label", "linb.UI.Div", "linb.UI.Dialog"], 
        properties:{}, 
        events:{"onReady":"_onready", "onRender":"_onrender"}, 
        iniResource:function(com, threadid){
        }, 
        iniExComs:function(com, hreadid){
        }, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Dialog)
                .host(host,"dialog2")
                .setLeft(30)
                .setTop(10)
                .setWidth(620)
                .setHeight(400)
                .setResizer(false)
                .setCaption("Local storage( database app without server ) Sample")
            );
            
            host.dialog2.append((new linb.UI.Block)
                .host(host,"block3")
                .setLeft(20)
                .setTop(50)
                .setWidth(260)
                .setHeight(290)
                .setBorder(true)
            );
            
            host.block3.append((new linb.UI.TreeGrid)
                .host(host,"treegrid")
                .setRowHandler(false)
                .setHeader([{"id":"key", "caption":"key", "width":80, "type":"label"}, {"id":"value", "caption":"value", "width":160, "type":"label"}])
                .afterRowActive("_treegrid_afterrowactive")
            );
            
            host.dialog2.append((new linb.UI.Group)
                .host(host,"group1")
                .setLeft(330)
                .setTop(80)
                .setWidth(260)
                .setHeight(120)
                .setCaption("update")
                .setToggleBtn(false)
            );
            
            host.group1.append((new linb.UI.Input)
                .host(host,"iKey")
                .setDisabled(true)
                .setLeft(70)
                .setTop(10)
                .setWidth(180)
            );
            
            host.group1.append((new linb.UI.Input)
                .host(host,"iValue")
                .setLeft(70)
                .setTop(40)
                .setWidth(180)
            );
            
            host.group1.append((new linb.UI.Button)
                .host(host,"btnU")
                .setDisabled(true)
                .setLeft(70)
                .setTop(70)
                .setWidth(180)
                .setCaption("Update")
                .onClick("_btnu_onclick")
            );
            
            host.group1.append((new linb.UI.Label)
                .host(host,"label23")
                .setLeft(10)
                .setTop(10)
                .setWidth(50)
                .setCaption("key")
            );
            
            host.group1.append((new linb.UI.Label)
                .host(host,"label24")
                .setLeft(10)
                .setTop(40)
                .setWidth(50)
                .setCaption("value")
            );
            
            host.dialog2.append((new linb.UI.Group)
                .host(host,"group2")
                .setLeft(330)
                .setTop(220)
                .setWidth(260)
                .setHeight(120)
                .setCaption("create")
                .setToggleBtn(false)
            );
            
            host.group2.append((new linb.UI.Input)
                .host(host,"iKey2")
                .setLeft(70)
                .setTop(10)
                .setWidth(180)
            );
            
            host.group2.append((new linb.UI.Input)
                .host(host,"iValue2")
                .setLeft(70)
                .setTop(40)
                .setWidth(180)
            );
            
            host.group2.append((new linb.UI.Button)
                .host(host,"btnC")
                .setLeft(70)
                .setTop(70)
                .setWidth(180)
                .setCaption("Add a Row")
                .onClick("_btnc_onclick")
            );
            
            host.group2.append((new linb.UI.Label)
                .host(host,"label3")
                .setLeft(10)
                .setTop(10)
                .setWidth(50)
                .setCaption("key")
            );
            
            host.group2.append((new linb.UI.Label)
                .host(host,"label4")
                .setLeft(10)
                .setTop(40)
                .setWidth(50)
                .setCaption("value")
            );
            
            host.dialog2.append((new linb.UI.Button)
                .host(host,"btnD")
                .setDisabled(true)
                .setLeft(330)
                .setTop(50)
                .setWidth(260)
                .setCaption("Delete")
                .onClick("_btnd_onclick")
            );
            
            host.dialog2.append((new linb.UI.Block)
                .host(host,"divInfo")
                .setLeft(40)
                .setTop(20)
                .setWidth(220)
                .setHeight(20)
                .setBorderType("groove")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 


        _onready:function (com, threadid) {
            SPA = this;
            STORE = new Persist.Store('LocalApp');
            STORE.get('grid',function(ok,v){
                if(ok && !v)
                    STORE.set('grid',_.serialize([['k1','v1'],['k2','v2']]));
            });

            SPA.divInfo.setHtml('Persist is "' + Persist.type + '"');
        }, 
        //to show message
        popMsg:function(msg){
            linb.UI.Dialog.pop(msg);
        }, 
        _onrender:function (com, threadid) {
            SPA._refreshList();
        }, 
        _treegrid_afterrowactive:function (profile, row) {
            SPA.$row=row;

            SPA.iKey.resetValue(row.cells[0].value);
            SPA.iValue.resetValue(row.cells[1].value);

            SPA.btnD.setDisabled(false);
            SPA.btnU.setDisabled(false);
        }, 
        _btnc_onclick:function (profile, e, src, value) {
            var key=SPA.iKey2.getUIValue(),
                value=SPA.iValue2.getUIValue();
            if(!key || !value){
                alert('Specify key and value please!');
                return;
            }
            SPA.iKey2.resetValue();
            SPA.iValue2.resetValue();

            SPA.treegrid.insertRows([[key,value]]);

            var v=SPA.treegrid.getRows();
            STORE.set('grid',_.serialize(v,null,true),function(ok){
                SPA._refreshList();
            });
        }, 
        _btnd_onclick:function (profile, e, src, value) {
            if(!SPA.$row)return;

            SPA.treegrid.removeRows([SPA.$row.id]);
            var v=SPA.treegrid.getRows();
            STORE.set('grid',_.serialize(v,null,true));
            delete SPA.$row;
            SPA.btnD.setDisabled(true);
            SPA.btnU.setDisabled(true);
        }, 
        _btnu_onclick:function (profile, e, src, value) {
            if(!SPA.$row)return;
            var cells=SPA.$row.cells;

            var key=cells[0].value,
                value=SPA.iValue.getUIValue();
            if(value==cells[1].value){
                alert('Modify the value first!');
                return;
            }

            SPA.treegrid.updateCell(cells[1],value,false);
            var v=SPA.treegrid.getRows();
            STORE.set('grid',_.serialize(v,null,true));
        }, 
        _refreshList:function(rowId){
            STORE.get('grid',function(ok,v){
                if(ok && (v=(v&&v.value)))
                    SPA.treegrid.setRows(_.unserialize(v));
            });
        }
    }
});