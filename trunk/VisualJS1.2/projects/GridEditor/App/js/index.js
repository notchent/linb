Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Block","linb.UI.TreeGrid","linb.UI.Div"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Block)
            .host(t,"block1")
            .setLeft(70)
            .setTop(50)
            .setWidth(540)
            .setHeight(270)
            );

            t.block1.attach(
            (new u.TreeGrid)
            .host(t,"tg")
            .setHeader([])
            .setRows([])
            .setTabindex("2")
            .onDblClickRow("_tg_ondblclickrow")
            );

            f(
            (new u.Div)
            .host(t,"div9")
            .setLeft(80)
            .setTop(10)
            .setWidth(270)
            .setHeight(30)
            .setHtml("DblClick row hander to open edit dialog!")
            );

            return n;
            // ]]code created by designer
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
        _tg_ondblclickrow:function (p,row, e, src) {
            this._activeRow = row;
            var self=this;
            linb.ComFactory.newCom('App.Dlg' ,function(){
                this.$parent=self;
                this
                .setProperties({
                    fromRegion:linb([src]).getRegion(true),
                    col1:row.cells[0].value,
                    col2:row.cells[1].value,
                    col3:row.cells[2].value
                })
                .setEvents('onOK', self._changeRow);
                this.show(linb([document.body]));
            });
        },
        events:{
            onReady:'_onready'
        },
        _onready:function(){
            var self=this;
            linb.ajax("data/data.js",'',function(s){
                var hash=_.unserialize(s);
                self.tg.setHeader(hash.header).setRows(hash.rows);
            }).start();
        }
    }
});