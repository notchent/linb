Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.DataSource.Ajax","linb.UI.Block","linb.UI.TreeGrid","linb.UI.Div"],
        //prepare data
        parepareData:function(properties,events){
        },
        _aftercreated:function (page, threadid) {
            page.ajax1.request();
        },
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];
            
            this.block1 = (new linb.UI.Block)
            .alias("block1").host(this)
            .setLeft(70).setTop(50).setWidth(540).setHeight(270)
            ;
            this.nodes.push(this.block1.get(0));
            
            this.tg = (new linb.UI.TreeGrid)
            .alias("tg").host(this)
            .setHeader([])
            .setRows([])
            .setTabindex("2")
            .onDblClickRow("_tg_ondblclickrow")
            ;
            this.block1.attach(this.tg);
            
            this.div9 = (new linb.UI.Div)
            .alias("div9").host(this)
            .setLeft(80).setTop(10).setWidth(270).setHeight(30).setHtml("DblClick row hander to open edit dialog!")
            ;
            this.nodes.push(this.div9.get(0));
            
            this.ajax1 = (new linb.DataSource.Ajax)
            .alias("ajax1").host(this)
            .setUrl("data/data.js").setAsy(false)
            .onRequestOK("_ajax1_onrequestok")
            ;
            this.nodes.push(this.ajax1.get(0));
            
            return this.nodes;
            // ]]code creted by designer
        },
        _ajax1_onrequestok:function (profile, hash, flag) {
            this.tg.setRows(hash.rows).setHeader(hash.header);
        },
        _changeRow:function(v1,v2,v3){
            var cells=this._activeRow.cells;
            if(cells[0]!=v1)
                this.tg.updateCell(cells[0],v1);
            if(cells[1]!=v2)
                this.tg.updateCell(cells[1],v2);
            if(cells[2]!=v3)
                this.tg.updateCell(cells[2],v3);
        },
        _tg_ondblclickrow:function (row, e, src) {
            this._activeRow = row;
            var self=this;
            _.asyCall('App.Dlg' ,'show', [linb(document.body),'',
                {
                    fromRegion:linb(src).getRegion(true),
                    col1:row.cells[0].value,
                    col2:row.cells[1].value,
                    col3:row.cells[2].value
                },{
                    onOK: self._changeRow
                }, self],
            true);
        },events:{"afterCreated":"_aftercreated"}
    }
});