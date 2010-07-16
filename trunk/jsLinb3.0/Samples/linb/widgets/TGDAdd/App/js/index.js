Class('App', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append(
                (new linb.UI.Panel)
                .setHost(host,"ctl_panel3")
                .setDock("none")
                .setLeft(110)
                .setTop(50)
                .setWidth(410)
                .setHeight(290)
                .setZIndex(1)
                .setCaption("Using up/down keyboard to add rows")
            );
            
            host.ctl_panel3.append(
                (new linb.UI.TreeGrid)
                .setHost(host,"treegrid")
                .setRowNumbered(true)
                .setEditable(true)
                .setHeader([{"id":"label", "type":"label", "width":80, "caption":"label"}, {"id":"input", "type":"input", "width":80, "caption":"input"}, {"id":"number", "type":"number", "width":80, "caption":"number"}, {"id":"currency", "type":"currency", "width":80, "caption":"currency"}])
                .setRows([{"cells":[{"value":"label1", "id":"c_a"}, {"value":"input1", "id":"c_b"}, {"value":100, "id":"c_c"}, {"value":100, "id":"c_d"}], "id":"a"}, {"cells":[{"value":"label2", "id":"c_e"}, {"value":"input2", "id":"c_f"}, {"value":200, "id":"c_g"}, {"value":200, "id":"c_h"}], "id":"b"}, {"cells":[{"value":"label3", "id":"c_i"}, {"value":"input3", "id":"c_j"}, {"value":300, "id":"c_k"}, {"value":300, "id":"c_l"}], "id":"c"}])
                .afterCellFocused("_tg_cellfocus")
                .onNewLineTriggerred("_tg_onnewline")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        },
        // check new row
        checkValid:function(row){
            var cells=row.cells;
            return cells[3].value>0;
        },
        _tg_onnewline:function (profile,cell,row) {
            var ns=this,
                aid=profile._addedid_;
            if(!cell)return false;
            
            // if it's the active row
            if(aid && row.id==aid){
                // if valid
                if(ns.checkValid(row)){
                    delete profile._addedid_;
                    aid=null;
                    linb.message("Added!");
                }
                // if invalid
                else{
                    // keep in editing mode
                    profile.boxing().focusCell(cell);
                    linb.message("Cancelled! The 4th cell must be greater than 0");
                    // dont focus to next cell
                    return false;
                }
            }
            // add a row
            if(!aid && row.id!=aid){
                aid=profile._addedid_='_r_'+_();
                profile.boxing().insertRows([{id:aid,cells:['label','input',0,0]}]);
                // focus to next cell
                profile.boxing().focusCellbyRowCol(aid, cell._col.id);

                // dont focus to next cel
                return false;
            }
        },
        _tg_cellfocus:function(profile,cell,row){
            var ns=this,
                aid=profile._addedid_;
            // if a new row is acitve, and focus isnt in this row
            if(aid && row.id!=aid){
                // if valid, added
                delete profile._addedid_;
                // if invalid, removed
                if(!ns.checkValid(profile.boxing().getRowbyRowId(aid))){
                    profile.boxing().removeRows([aid]);
                    linb.message("Cancelled! The 4th cell must be greater than 0");
                }else{
                    linb.message("Added!");
                }
            }
        }
    }
});