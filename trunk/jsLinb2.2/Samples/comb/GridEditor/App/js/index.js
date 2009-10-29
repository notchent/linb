Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        required:["linb.UI.Block", "linb.UI.TreeGrid", "linb.UI.Div"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Block)
                .host(host,"block1")
                .setLeft(70)
                .setTop(50)
                .setWidth(540)
                .setHeight(270)
            );
            
            host.block1.append((new linb.UI.TreeGrid)
                .host(host,"tg")
                .setTabindex("2")
                .setHeader([])
                .setRows([])
                .onDblclickRow("_tg_ondblclickrow")
            );
            
            append((new linb.UI.Div)
                .host(host,"div9")
                .setLeft(70)
                .setTop(10)
                .setWidth(270)
                .setHeight(30)
                .setHtml("DblClick row  to open edit dialog!")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _changeRow:function(v1,v2,v3){
            var cells=this._activeRow.cells;
            if(cells[0]!=v1)
                this.tg.updateCell(cells[0],{value:v1});
            if(cells[1]!=v2)
                this.tg.updateCell(cells[1],{value:v2});
            if(cells[2]!=v3){
                this.tg.updateCell(cells[2],{value:v3});
            }
        }, 
        _tg_ondblclickrow:function (p,row, e, src) {
            this._activeRow = row;
            var self=this;
            linb.ComFactory.newCom('App.Dlg' ,function(){
                this.$parent=self;
                this
                .setProperties({
                    fromRegion:linb.use(src).cssRegion(true),
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
            linb.Ajax("data/data.js",'',function(s){
                var hash=_.unserialize(s);
                self.tg.setHeader(hash.header).setRows(hash.rows);
            }).start();
        }
    }
});