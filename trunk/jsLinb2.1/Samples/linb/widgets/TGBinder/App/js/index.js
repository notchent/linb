
Class('App', 'linb.Com',{
    Instance:{
        tg2page:0, 

        events:{"onReady":"_onready"}, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Panel)
                .host(host,"panel4")
                .setDock("none")
                .setLeft(20)
                .setTop(10)
                .setWidth(770)
                .setHeight(630)
                .setZIndex(1)
                .setCaption("panel4")
            );
            
            host.panel4.append((new linb.UI.Layout)
                .host(host,"layout4")
                .setItems([{"id":"before", "pos":"before", "locked":false, "size":260, "min":50, "max":500, "hide":false, "cmd":false, "caption":"before"}, {"id":"main", "min":10, "caption":"main"}])
            );
            
            host.layout4.append((new linb.UI.TreeGrid)
                .host(host,"tg2")
                .afterRowActive("_tg2_afterRowActive")
                .setCustomStyle({"CELL":"border-right:none;padding-right:1px;", "CELL-GROUP":"border-right:none;padding-right:1px;", "PREVIEW":"border-right:none;padding-right:1px;", "SUMMARY":"border-right:none;padding-right:1px;"})
            , 'before');
            
            host.layout4.append((new linb.UI.Panel)
                .host(host,"FormBuilder")
                .setCaption("Form Builder")
            , 'main');
            
            host.layout4.append((new linb.UI.Button)
                .host(host,"button19")
                .setLeft(520)
                .setTop(50)
                .setWidth(130)
                .setZIndex(10)
                .setCaption("Update")
                .onClick("_button19_onclick")
            , 'main');
            
            host.layout4.append((new linb.UI.Block)
                .host(host,"block2")
                .setDock("bottom")
                .setHeight(30)
                .setCustomStyle({"BORDER":"border:solid 1px #CDCDCD;", "PANEL":"background-color:#F4F4F4;"})
            , 'before');
            
            host.block2.append((new linb.UI.PageBar)
                .host(host,"pagebar3")
                .setLeft(20)
                .setTop(3)
                .setValue("1:1:5")
                .onClick("_pagebar3_onclick")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _pagebar3_onclick:function (profile, page) {
            profile.boxing().setPage(page);

            SPA.tg2page=(page-1)||0;

            SPA.tg2.setRows(SPA.tg2data.slice(SPA.tg2page*5, (SPA.tg2page+1)*5));

            if(SPA.$dbBinder){
                SPA.$dbBinder.resetValue().getUI().setDisabled(true)
            }
            SPA.$curRow=null;

            return false;
        }, 
        _button19_onclick:function (profile, e, src, value) {
            if(SPA.$dbBinder && SPA.$curRow){
                if(SPA.$dbBinder.checkValid()){
                    var hash=SPA.$dbBinder.getValue();
                    _.arr.each(SPA.$curRow.cells,function(cell){
                        SPA.tg2.updateCellByRowCol(cell._row.id,cell._col.id, {value:hash[cell._col.id]});
                    });
                    SPA.tg2.resetRowValue(SPA.$curRow.id);
                    linb.message('data updated!');
                }
                else
                    linb.message('please correct input first!');
            }
        }, 
        _tg2_afterRowActive:function(profile, row){
            if(!SPA.$dbBinder){
                SPA.$dbBinder = new linb.DataBinder();
                SPA.$dbBinder.setName('tr2');

                var cells=profile.properties.header,t,
                    ns=[],
                    name,widget,type,t;

                _.arr.each(cells,function(o){
                    type=o.type;
                    ns.push(t=[o.caption]);

                    if(type=='checkbox')
                        widget=widget=new linb.UI.CheckBox();
                    else if(!type || type=='label')
                        widget=new linb.UI.Label({caption:o.caption});
                    else if(!type || type=='button')
                        widget=new linb.UI.Button();
                    else
                        widget=new linb.UI.ComboInput();

                    if(widget.setDataBinder)
                        widget.setDataBinder('tr2').setDataField(o.id);

                    t[1]=widget.get(0);

                    switch(type){
                        case 'number':
                            widget.setType('none').setCustomStyle('INPUT',"text-align:right;");
                            break;
                        case 'progress':
                            widget.setType('none').setValueFormat("^(0([\\.]\\d*[0-9]+)|0|1)$").setCustomStyle('INPUT',"text-align:right;");
                            break;
                        case 'input':
                            widget.setType('none');
                            break;
                        case 'textarea':
                            widget.setType('none').setMultiLines(true).setWidth(200).setHeight(100);
                            break;
                        case 'listbox':
                        case 'combobox':
                        case 'helpinput':
                            widget.setType(type);
                            if(t=o.editorListKey)
                                widget.setListKey(t);
                            else if(t=o.editorListItems)
                                widget.setItems(t);
                            break;
                        case 'timepicker':
                        case 'datepicker':
                        case 'colorpicker':
                            widget.setType(type);
                            break;
                        case 'getter':
                        case 'popbox':
                        case 'cmdbox':
                            widget.setType(type);
                            break;
                    }


                    var editorFormat = o.editorFormat,
                        editorReadonly = o.editorReadonly;

                    if(widget.setReadonly)widget.setReadonly(!!editorReadonly);
                    if(editorFormat){
                        if(typeof editorFormat == 'function'){
                            if(widget.beforeFormatCheck)widget.beforeFormatCheck(editorFormat);
                        }else{
                            if(widget.setValueFormat)widget.setValueFormat(editorFormat);
                        }
                    }
                });

                var str='', nodes=[];

                _.arr.each(ns,function(arr){
                    nodes.push(arr[1]);
                })
                nodes=linb.UI.pack(nodes,false);
                nodes.setPosition('relative');

                for(var i=0;i<ns.length;i+=2){
                    str += '<tr><td align="right" style="text-decoration:underline;">'+ ns[i][0] +"</td><td>"+ ns[i][1].toHtml() +'</td>';
                    if(ns[i+1])
                        str +='<td align="right"  style="text-decoration:underline;">'+ ns[i+1][0] +"</td><td>"+ ns[i+1][1].toHtml() +'</td>';
                    str +='</tr>';
                }

                SPA.FormBuilder.setHtml('<table cellspacing="4" style="border-spacing:10px;border-collapse:separate;">'+str+'</table>',false);
                nodes.render(true);
            }
            var hash={};
            SPA.$curRow=row;
            _.arr.each(row.cells,function(o){
                hash[o._col.id]=o.value;
            });
            SPA.$dbBinder.resetValue(hash).getUI().setDisabled(false)
        }, 
        iniResource:function (com, threadid) {
            linb.Ajax('App/js/grid2.js',"",function(rsp){
                com._data=_.unserialize(rsp);
            },function(){},threadid).start();
        }, 
        _onready:function (com, threadid) {
            linb.UI.cacheData('demo',[{id:'a',caption:'cap a',image:'img/img.gif'},{id:'b',caption:'cap b',image:'img/img.gif',imagePos:'left -16px'},{id:'c',caption:'cap c',image:'img/img.gif',imagePos:'left -32px'}]);

            SPA=this;
            var hash=com._data;
            SPA.tg2data=hash.rows;
            SPA.tg2.setHeader(hash.header)
               .setRows(SPA.tg2data.slice(SPA.tg2page*5, (SPA.tg2page+1)*5));
        }
    }
});