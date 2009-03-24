Class('App.TreeView', 'linb.Com',{
    Instance:{
        events:{"onReady":"_onready"},
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};

            append((new linb.UI.Layout)
                .host(host,"layout7")
                .setItems([{"id":"before", "pos":"before", "size":30, "locked":true, "min":10, "hide":false, "cmd":false, "caption":"after"}, {"id":"main", "min":10, "caption":"main"}])
                .setType("horizontal")
            );

            host.layout7.append((new linb.UI.TreeGrid)
                .host(host,"tg")
                .setEditable(true)
                .setColSortable(false)
                .setColMovable(false)
                .setHeader([{"id":"key", "width":100, "type":"input", "caption":"key"}, {"id":"value", "width":400, "type":"textarea", "caption":"value"}, {"id":"action", "width":90, "type":"label", "cellRenderer":
                    function (o) {
                        o.tips = "";
                        return "<button onclick='javascript:SPA.onCmdClick(this)' class=\"c-cmd1\"></button><button onclick='javascript:SPA.onCmdClick(this)' class=\"c-cmd2\"></button><button onclick='javascript:SPA.onCmdClick(this)' class=\"c-cmd3\"></button>";
                    },
                "caption":"action"}])
                .beforeIniEditor('_tg_beforeIniEditor')
                .beforeCellUpdated("_tg_beforecellupdated")
            , 'main');

            host.layout7.append((new linb.UI.Button)
                .host(host,"button26")
                .setDock("fill")
                .setLeft(20)
                .setTop(110)
                .setCaption("<")
                .setVAlign("middle")
                .onClick("_button26_onclick")
                .setCustomStyle({KEY:'background:#eee;'})
            , 'before');

            return children;
            // ]]code created by jsLinb UI Builder
        },
        _button26_onclick:function (profile, e, src, value) {
            SPA.toCodeView()
        },
        _onready:function () {
            linb.CSS.addStyleSheet('.c-cmd1{border:0;width:36px;height:18px;background:url(img/pre.gif) center;}' +
            '.c-cmd2{border:0;width:36px;height:18px;background:url(img/next.gif) center;}'+
            '.c-cmd3{border:0;width:18px;height:18px;background:url(img/del.gif) center;}')
        },
        onCmdClick:function(btn){
            var id=btn.parentNode.id,
                profile=linb.UIProfile.getFromDomId(id),
                cell=profile.cellMap[profile.getSubId(id)],
                cls=btn.className,
                row=cell._row,
                type;

            if(cls=='c-cmd1'){
                var nid=_();
                if(row._pid)
                    type=_.get(profile.rowMap, [profile.rowMap2[row._pid],'_type']);

                profile.boxing().insertRows([{id:nid, cells:[{value:type=='array'?'[index]':'new',disabled:type=='array'},'null','']}],null,row.id,true);
                _.asyRun(function(){
                    profile.getSubNode('FIRSTCELL',profile.rowMap2[nid]).onClick();
                });
            }else if(cls=='c-cmd2'){
                var nid=_();
                if(row._pid)
                    type=_.get(profile.rowMap, [profile.rowMap2[row._pid],'_type']);

                profile.boxing().insertRows([{id:nid, cells:[{value:type=='array'?'[index]':'new',disabled:type=='array'},'null','']}],null,row.id,false);
                _.asyRun(function(){
                    profile.getSubNode('FIRSTCELL',profile.rowMap2[nid]).onClick();
                });
            }else if(cls=='c-cmd3'){
                if(confirm('Do you want to delete this row?'))
                    profile.boxing().removeRows([row.id]);
            }
        },
        getCellValue:function(n){
            try{
                var v=_.str.trim(n);
                //special string
                if(/^"(\\.|[^"\\\n])*"$/.test(v) || /^'(\\.|[^'\\\n])*'$/.test(v))
                    v=['string', _.unserialize(v)]
                else{
                    v=v.replace(/^\s*/,'').replace(/\s*$/,'');
                    v= v=='null'? ['null','null'] :
                      //number
                        parseFloat(String(parseFloat(v)))==parseFloat(v) ? ['number',v]  :
                      //reg
                        /^\/(\\[\/\\]|[^*\/])(\\.|[^\/\n\\])*\/[gim]*$/.test(v) ? ['regexp', v]  :
                      //bool
                        /^(true|false)$/.test(v) ? ['boolean',v.toLowerCase()] :
                      //date
                        /^new Date\([0-9 \,]*\)$/i.test(v) ? ['date', _.serialize(_.unserialize(v))] :
                      //function
                        /^((function\s*([\w$]+\s*)?\(\s*([\w$\s,]*)\s*\)\s*)(\{([^\{\}]*)\}))$/i.test(v) ? ['function',v] :
                      //hash
                        /^\{[\s\S]*\}$/.test(v) ? ['hash',_.serialize(_.unserialize(v))] :
                      //array
                        /^\[[\s\S]*\]$/.test(v) ? ['array', _.serialize(_.unserialize(v))] :
                      ['string', n];
                  }
              }catch(e){
                  v=null;
              }
              if(v[0]=='string'){
                if(v[1]===false)
                    return null
                v[1]=_.serialize(v[1]);
            }
              return v;
        },
        _json2rows:function(obj,array,rows){
            var me=arguments.callee;
            if(!rows)rows=[];
            _.each(obj,function(o,i){
                var row={},type=SPA.getType(o);
                i={value:array?'[index]':i,disabled:array};

                if(type=='hash'){
                    row.sub=[];
                    row.cells=[i,{value:'{...}'},''];
                    me(o,false,row.sub);
                }else if(type=='array'){
                    row.sub=[];
                    row.cells=[i,{value:'[...]'},''];
                    me(o,true,row.sub);
                }else{
                    SPA.getType(o);
                    row.cells=[i,_.serialize(o),''];
                }
                row._type=type;
                rows.push(row);
            });
            return rows;
        },
        setCode:function(str){
            var ns=this;

            ns.$code=str;

            ns.tg.removeAllRows().busy();
            _.asyRun(function(){
                var obj=_.unserialize(str),
                    rows=ns._json2rows(obj);
                ns.tg.insertRows(rows).free();
            });
        },
        _rows2json:function(arr,array){
            var me=arguments.callee,
                a=[], key,value;
            _.arr.each(arr, function(o){
                key=((typeof o.cells[0]=='object')?o.cells[0].value:o.cells[0]);
                if(o._type=='hash')
                    value=me(o.sub);
                else if(o._type=='array')
                    value=me(o.sub, true);
                else
                    value=(typeof o.cells[1]=='object')?o.cells[1].value:o.cells[1];
                if(array)
                    a.push(value);
                else
                    a.push('"'+key + '":' + value);
            });
            return array ? '['+a.join(',')+']' : '{'+a.join(',')+'}';
        },
        getCode:function(){
            var rows=this.tg.getRows();
            return this._rows2json(rows);
        },
        _tg_beforeIniEditor:function(profile, cell){
            if(cell._col.id!='value')return;
            var type=cell._row._type;
            if(type=='hash'||type=='array')
                cell.$editorValue = linb.Coder.formatText(this._rows2json(cell._row.sub, type=='array'));
        },
        _tg_beforecellupdated:function (profile, cell, options) {
            var map={'hash':1,'array':2},
                row=cell._row;
            if(cell._col.id=='value'){
                var type=row._type,
                    va=this.getCellValue(options.value);
                if(!va){
                    alert('Text format is not valid!');
                    return false;
                }else{
                    if(map[type]){
                        var a=[];
                        _.arr.each(row.sub,function(o){
                            a.push(o.id);
                        });
                        this.tg.removeRows(a);
                        this.tg.toggleRow(row.id, false);
                        delete row.sub;
                    }
                    if(map[va[0]]){
                        var sub=this._json2rows(_.unserialize(va[1]),va[0]=='array');

                        this.tg.insertRows(sub,row.id);
                        this.tg.toggleRow(row.id, true);
                        options.caption=va[0]=='hash'?'{...}':'[...]';
                    }
                    if(map[type]!=map[va[0]])
                        profile.getSubNode('TOGGLE',row._serialId).css('display',map[va[0]]?'':'none');

                    row._type=va[0];
                    options.value=va[1];
                }
            }else{
                if(!/^"(\\.|[^"\\])*"$/.test('"'+options.value+'"')){
                    alert('Text format is not valid!');
                    return false;
                }
            }
        }
    }
});