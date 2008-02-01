Class("linb.UI.TreeGrid","linb.UI.iWidget",{
    Instance:{
        /*insert rows to dom
        arr is formatted properties
        pid,base are item id
        before: insert before?
        */
        _insertRowsToDom:function(profile, arr, pid, base, before){
            //if parent not open, return
            if(pid){
                var parent = profile.row_SerialIdMapItem[pid];
                if(parent && !parent._created)return;
            }

            var obj,hw,self=arguments.callee;

            //get column width
            var ws=[], hw=profile.getSubNode('HCELL0').width();
            profile.properties.header.each(function(v){
                ws.push(profile.getSubNode('HCELL', profile.header_ItemIdMapSerialId[v.id]).width());
            });

            //give width at here
            arr.each(function(o){
                o.rowHandlerWidth = hw-o._layer*profile.properties.$subMargin;
                o.cells.each(function(v,i){
                    v.width=ws[i];
                })
            });

            //build dom
            var nodes = profile.box.subBuild(profile, 'rows', arr).toDom();
            //get base dom
            if(!base){
                //no base add to parent
                if(pid){
                    obj = profile.getSubNode('SUB', pid);
                }else{
                    obj = profile.getSubNode('BODY');
                }
                if(before)
                    obj.addFirst(nodes);
                else
                    obj.addLast(nodes);
            }else{
                //
                obj = profile.getSubNode('CELLS', base);
                if(before)
                    obj.addPre(nodes);
                else{
                    nodes.get().reverse();
                    obj.addNext(nodes);
                }
            }

            //add sub
            arr.each(function(o){
                //not open sub
                o.open=false;
                ////the following code need to handle treemark icon from + to -
                //if(o.sub && o.open)self.call(this,profile, o.sub, o._serialId);
            },this);

            //clear rows cache
            delete profile.$allrowscache;
        },
        refreshHeader:function(header){
            var profile=this.get(0);
            profile.properties.header = header;

            var rows = profile.properties.rows.copy();
            this.removeAllRows();

            var arr = profile.box.prepareHeader(profile, header);
            var nodes = profile.box.subBuild(profile, 'header', arr).toDom();
            profile.getSubNode('HCELL', true).remove();
            profile.getSubNode('HCELLS').addLast(nodes);

            this.insertRows(rows);
        },
        //insert rows like
        /*
            linb.create('TreeGrid',{
                header:[
                    {id:'name', type:'label', caption:'name', width:80},
                    {id:'value', type:'any', caption:'value', width:120}
                ],
                rows:[
                    {id:'1',cells:[{value:'name', type:''}]},
                    {id:'2',cells:[{value:'template', type:''}]},
                    {id:'3',cells:[{value:'appearance', type:'label'}]},
                    {id:'4',cells:[{value:'behavior', type:''}]},
                    {id:'5',cells:[{value:'properties',type:''}],sub:[
                         {id:'6',cells:[{value:'shadow',type:''}]},
                         {id:'7',cells:[{value:'border',type:'listbox'}]}
                    ]}
                ]
            });

            linb.UI.TreeGrid.getAll().insertRows([
                {id:'11',cells:['name', '']},
                {id:'12',cells:['template', '']},
                {id:'13',cells:['appearance', '']},
                {id:'14',cells:['behavior', '']},
                {id:'15',cells:['properties',''],sub:[
                     {id:'26',cells:['shadow',null]},
                     {id:'27',cells:['border',null]}
                ]}
            ],
            '5', '6', true)
        */
        //pid,base are id
        insertRows:function(arr, pid, base ,before){
            var c=this.constructor, profile=this.get(0), pro=profile.properties;

            //get item id
            pid = profile.row_ItemIdMapSerialId[pid];
            base = profile.row_ItemIdMapSerialId[base];

            //prepareData(add links)
            var rows = c.prepareItems(profile, arr, pid);

            var tar,b=profile.row_SerialIdMapItem;
            if(!pid)
                tar = (pro.rows || (pro.rows=[]));
            else
                tar = (b[pid].sub || (b[pid].sub=[]));
            if(!base)
                tar.insertAny(arr, before?0:-1);
            else{
                var index = tar.subIndexOf('_serialId', base);
                tar.insertAny(arr, before?index:(index+1));
            }

            //insert
            this._insertRowsToDom(profile, rows, pid, base, before);

            if(!profile.properties.iniFold)
                profile.boxing().openRows(rows, true);

            return this;
        },
        //delete row according to id
        /*
            linb.UI.TreeGrid.getAll().removeRows(['2','5'])
        */
        removeRows:function(ids){
            var profile=this.get(0), cell = profile.cells_SerialIdMapItem,
                nodes=[];

            //get array
            ids = _.isArr(ids)?ids:[ids];
            ids.each(function(id){
                //get item id
                if(!(id=profile.row_ItemIdMapSerialId[id]))return;

                //get row
                var row;
                if(row = profile.row_SerialIdMapItem[id]){
                    var tdids = row._cells,
                        rowid = row.id,
                        temp;

                    ////delete and clear links
                    _.each(tdids,function(o){
                        //clear header_SerialIdMapItem/properties.header
                        delete cell[o].header._cells[rowid];
                        //clear cells_SerialIdMapItem
                        delete cell[o];

                        profile.cacheSubId(o._serialId, 'cell');
                    });

                    //clear properties.row array
                    if(temp= row._pid?(temp=profile.row_SerialIdMapItem[row._pid])?temp.sub:null:profile.properties.row)
                        temp.filter(function(o){
                            return o._serialId != id;
                        });

                    //clear profile.row_ItemIdMapSerialId
                    delete profile.row_ItemIdMapSerialId[rowid];
                    //clear row_SerialIdMapItem
                    delete profile.row_SerialIdMapItem[id];

                    profile.cacheSubId(serialId, 'row');

                    nodes.push(profile.getSubNode('CELLS', id));
                    //for sub delete
                    if(row.sub){
                        var arr=[];
                        row.sub.each(function(o){
                            arr.push(o.id)
                        });
                        this.removeRows(arr);
                    }
                }
            },this);

            linb(nodes,false).remove();
            return this;
        },
        removeAllRows:function(){
            var profile=this.get(0);
            for(var i in profile.cells_SerialIdMapItem)
                profile.cacheSubId(i, 'cell');
            for(var i in profile.row_SerialIdMapItem)
                profile.cacheSubId(i, 'row');
            _.each(profile.header_SerialIdMapItem,function(o){
                o._cells={};
            });

            profile.row_SerialIdMapItem={};
            profile.cells_SerialIdMapItem={};
            profile.row_ItemIdMapSerialId={};

            profile.properties.rows.length=0;

            profile.getSubNode('BODY').empty();
            profile.getSubNode('SCROLL').scrollTop(0).scrollLeft(0);

            return this;
        },
        /*
        reset grid
        hash: rows:1,all:true
        */
        resetContent:function(){
            var profile=this.get(0);
            _.each(profile.$cache_editor,function(o,i){
                o.reBoxing().hide();
            });
            this.removeAllRows();
            return this;
        },
        //reset all cells's value of a column
        updateColumn:function(colId, hashValue){
            var pro=this.get(0),
            col = pro.header_SerialIdMapItem[pro.header_ItemIdMapSerialId[colId]];
            if(!col)return;
            var cells = col._cells;

            _.each(hashValue,function(o,i){
                pro.cells_SerialIdMapItem[cells[i]].value=o;
                pro.getSubNode('CELLA', cells[i]).html(o, false);
            });

        },
        updateCellbyRowCol:function(rowId, colId, value){
            var t;
            if(t=this.constructor.getCellId(this.get(0), rowId, colId))
                this.constructor.changeCellValue(this.get(0), t, value);
            return this;
        },
        updateCell:function(cellId, value){
            this.constructor.changeCellValue(this.get(0),cellId,value);
            return this;
        },
        openRows:function(rows, flag){
            if(rows && rows.length)
                rows.each(function(o){
                    if(o.sub && o.sub.length && !o.iniFold && !o._checked)
                        this.openRow(o.id, flag);
                },this);
        },
        openRow:function(id, flag){
            var profile = this.get(0),
            row = profile.row_SerialIdMapItem[profile.row_ItemIdMapSerialId[id]];
            if(row && !row._checked)
                profile.box.setSub(profile, row, flag);
        },
        scrollTo:function(pos){
            var profile=this.get(0), scroll=profile.getSubNode('SCROLL');
            pos = pos=='top'?0:pos=='bottom'?scroll.scrollHeight():pos;
            scroll.scrollTop(pos);
        }
    },
    Initialize:function(){
        this.mapKeys(['ALT']);

        var b = this.getBehavior('default');
        b.HCELLA={};b.HCELL0A={};
        b.CELLA.onKeydown = b.CELL0A.onKeydown = b.HCELLA.onKeydown = b.HCELL0A.onKeydown =function(profile, e, src){
            var keys=linb.event.getKey(e), key = keys[0], shift=keys[2],
            cur = linb([src],false),
            first = profile.root.nextFocus(true, true, false),
            last = profile.root.nextFocus(false, true, false);

            switch(key){
            //tab to next/pre
            case 'tab':
                if(shift){
                    if(src!=first.get(0)){
                        first.focus();
                        return false;
                    }
                }else{
                    if(src!=last.get(0)){
                        last.focus();
                        return false;
                    }
                }
                break;
            case 'left':
                var next = cur.nextFocus(false, true, false);
                if(cur.get(0)==first.get(0))
                    last.focus();
                else
                    cur.nextFocus(false);
                return false;
                break;
            case 'right':
                var next = cur.nextFocus(true, false, false);
                if(cur.get(0)==last.get(0))
                    first.focus();
                else
                    cur.nextFocus();
                return false;
                break;
            case 'up':
            case 'down':
                //get no.
                var count=1, temp = cur.parent().get(0);
                var max=temp.parentNode.childNodes.length;
                while(temp=temp.previousSibling)count++;

                //get row
                temp=cur.parent(2).get(0);

                //get all rows(include header)
                if(!profile.$allrowscache){
                    var all=[];
                    all.push(profile.getSubNode('HCELLS').get(0));
                    all.insertAny(profile.getSubNode('CELLS',true).get(),-1);
                    //filter dispaly==none
                    all.filter(function(o){
                        return !!o.offsetWidth;
                    });
                    profile.$allrowscache = all;
                }

                //get index
                var index = profile.$allrowscache.indexOf(temp);
                var rowLen = profile.$allrowscache.length;

                //adjust index
                if(key=='up'){
                    index--;
                    if(index==-1){
                        index = rowLen-1;
                        count--;
                        if(count==0)count=max;
                    }
                }else{
                    index++;
                    if(index==rowLen){
                        index=0;
                        count++;
                        if(count==max+1)count=1;
                    }
                }

                //get node
                node = linb(profile.$allrowscache[index]).first().next(count-1).first();
                if(!node.isEmpty())
                    node.focus();
                return false;
                break;
            }
        };
        this.setBehavior('default',b);
    },
    Static:{
        $recursive:true,
        Templates:{'default':{
            tagName : 'div',
            style:'{_style}',
            BORDER:{
                tagName : 'div',
                BOX:{
                    tagName:'div',
                    HEADER:{
                        $order:0,
                        tagName:'div',
                        HCELLS:{
                            tagName:'div',
                            style:'height:{headerHeight}px;',
                            /*the first col (row handler) in table header*/
                            HCELL0:{
                                $order:0,
                                style:'{tdfDisplay};width:{rowHandlerWidth}px;',
                                HCELL0A:{
                                    tagName:'a',
                                    href :"javascript:;",
                                    tabindex: '{tabindex}',
                                    HCELLHANDLER:{
                                        tagName:'div',
                                        style:'{thhandlerDisplay}'
                                    },
                                    ROWHANDLER:{
                                        tagName:'div',
                                        style:'{tdfhandlerDisplay}'
                                    }
                                }
                            },
                            OTHERHCELLS:{
                                $order:1,
                                tagName:'text',
                                text:'{header}'
                            }
                        }
                    },
                    SCROLL:{
                        $order:1,
                        tagName:'div',
                        BODY:{
                            tagName:'div',
                            text:'{rows}'
                        }
                    },
                    FOOTER:{
                        $order:2
                    }
                }
            },
            $dynamic : {
                /*the other header in table header*/
                header:{
                    HCELL:{
                        style:"width:{width}px",
                        HCELLA:{
                            tagName:'a',
                            href :"javascript:;",
                            tabindex: '{_tabindex}',
                            text:"{caption}",
                            SORT:{
                                style:'{sortDisplay}'
                            },
                            HCELLHANDLER : {
                                $order:2,
                                tagName:'div',
                                style:'{thhandlerDisplay}'
                            }
                        }
                    }
                },
                rows:{
                    ROW:{
                        tagName:'div',
                        className:'{cls}',
                        CELLS:{
                            tagName:'div',
                            style:'height:{rowHeight}px;',
                            CELL0:{
                                $order:0,
                                style:'{tdfDisplay};width:{rowHandlerWidth}px;',
                                CELL0A:{
                                    tagName:'a',
                                    href :"javascript:;",
                                    tabindex: '{_tabindex}',
                                    MARK:{
                                        style:'{display}'
                                    },
                                    ROWHANDLER:{
                                        tagName:'div',
                                        style:'{tdfhandlerDisplay}'
                                    }
                                }
                            },
                            OTHERCELLS:{
                                tagName:'text',
                                $order: 1,
                                text:'{cells}'
                            }
                        },
                        SUB:{
                            $order:1,
                            tagName:'div'
                        }
                    }
                },
                'rows.cells':function(profile,template,v,tag,result){
                    if(v.type=='checkbox')
                        var t=tag+'.'+'checkbox';
                    else
                        var t=tag+'.'+'input';//(v.type||'input');

                    linb.UI.$doTemplate(profile,template,v,t,result)
                 },
                'rows.cells.input':{
                    CELL:{
                        style:'width:{width}px;',
                        className:'{cellCls}',
                        CELLA:{
                            tagName:'a',
                            href :"javascript:;",
                            tabindex: '{_tabindex}',
                            text:"{caption}"
                        }
                    }
                },
                'rows.cells.checkbox':{
                    CELL:{
                        style:'width:{width}px;',
                        className:'{cellCls}',
                        CELLA:{
                            tagName:'a',
                            href :"javascript:;",
                            tabindex: '{_tabindex}',
                            CHECKBOX:{
                                className:'{checkboxCls}'
                            }
                        }
                    }
                },
                MARK:{}
            }
        }},
        Appearances:{'default':{
            KEY:{
                //in firefox, a can focused with display:block
                display:'block',
                position:'absolute'
            },
            BOX:{
                display:'block',
                position:'relative',
                overflow:'hidden'
            },
            HEADER:{
                //here, absolute in firefox will disapear
                position:'absolute',
                left:0,
                top:0
            },
            SCROLL:{
                position:'absolute',
                left:0,
                overflow:'auto'
            },
            BODY:{
                position:'absolute',
                display:'block',
                left:0,
                top:0,
                overflow:'visible'
            },
            'SORT, SORT-checked':{
                width:'15px',
                height:'15px',
                position:'absolute',
                right:'0px',
                bottom:'0px'
            },
            SORT:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -191px top', null, 'linb.UI.Public')
            },
            'HCELL-mouseover SORT':{
                $order:1,
                'background-position': '-191px -15px'
            },
            'HCELL-mousedown SORT':{
                $order:2,
                'background-position': '-191px -30px'
            },
            'SORT-checked':{
                $order:3,
                'background-position': '-206px top'
            },
            'HCELL-mouseover SORT-checked':{
                $order:4,
                'background-position': '-206px -15px'
            },
            'HCELL-mousedown SORT-checked':{
                $order:5,
                'background-position': '-206px -30px'
            },
            HCELLHANDLER:{
                position:'absolute',
                //if set z-index, disappearing in opera
                //'z-index':'10',
                width:'4px',
                top:'0px',
                height:'100%',
                right:'0px',
                cursor:'e-resize',
            	'font-size':0,
            	'line-height':0,
            	background: linb.UI.getCSSImgPara('handler.v.gif')

            },
            'HCELLS, CELLS':{
                //for ie6 height change trigger
                'overflow-y': linb.browser.ie6 ?'hidden':'',
                //ie6 need it to show correctly, opr need it to get offsetTop correctly
                position:linb.browser.ie6||linb.browser.opr?'relative':null,

                'white-space': 'nowrap',
                'padding-bottom':'2px',
                'font-size':0,
                'line-height':0,
                display:'block'
            },
           'CELLS-mouseover CELL':{
                $order:4,
                'background-color':'#d9e8fb'
            },
            'CELLS-active CELL, CELL-active':{
                 $order:5,
                'background-color':'#316AC5'
            },
            'CELLS-active CELLA, CELL-active CELLA':{
                 $order:5,
                color:'white'
            },
            'HCELL0, CELL0':{
               'background-color': '#d4d0c8',
               height:'100%',
               border:'1px solid',
               'border-color':  '#fff #ACA899 #ACA899 #fff',
               padding:0
            },
            'HCELL0A, CELL0A':{
                '-moz-box-flex':linb.browser.gek?'1':'',
                display:'block',
                position:'relative',
                overflow:'hidden',
                height:'100%',
                'font-weight':'bold',
                'font-size':'12px',
                'line-height':'20px'
            },
            CELL0A:{
                'text-align': 'left'
            },
            ' TDFCAPTION':{
                'font-weight':'bold'
            },
            ROWHANDLER:{
                position:'absolute',
                'height':'4px',
                left:'0px',
                width:'100%',
                bottom:'0px',
                cursor:'n-resize',
            	background: linb.UI.getCSSImgPara('handler.h.gif'),
            	'font-size':0,
            	'line-height':0
            },
            HCELL:{
               'background-color':' #d4d0c8',
               height:'100%',
               border:'1px solid',
               'border-color':  '#fff #ACA899 #ACA899 #fff',
               padding:0

               //for firefox
               //overflow:linb.browser.gek?'hidden':''
            },
            ROW:{
                '_position':'relative',

                'font-size':0,
                'line-height':0,
                'background-color':' #fff'
            },
            CELL:{
                //firefox:height:100% without overflow:hidden
                'padding-top':'1px',
                'padding-left':'1px',
                'border-bottom':'1px solid #ACA899',
                'border-right':'1px solid #ACA899',
                height:'100%',
                overflow:linb.browser.ie6?'hidden':''
            },
            'ALT > CELLS':{
                'background-color':'#f1f1f1'
            },
            //
            'CELL-label':{
                'background-color': '#F3F3F3'
            },
            'CELL-input':{
            },
            'CELL-number':{
                'text-align':'right'
            },
            'CELL-checkbox':{
                'text-align':'center'
            },
            HCELLA:{
                position:'relative'
            },
            'HCELLA, CELLA':{
                display:'block',
                overflow:'hidden',
                '-moz-box-flex':linb.browser.gek?'1':'',
                height:'100%',
                //ie need this
                width:linb.browser.ie?'100%':'',

                'font-size':'12px',
                'line-height':'20px'
            },
            'HCELLA, HCELL0A':{
                'text-align': 'center',
                'font-weight': 'bold'
            },
            'CHECKBOX':{
               cursor:'pointer',
               width:'16px',
               height:'16px',
               background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -112px top', null, 'linb.UI.Public')
            },
            'CELL-mouseover CHECKBOX':{
                $order:1,
                'background-position': '-112px -17px'
            },
            'CELL-mousedown CHECKBOX':{
                $order:2,
                'background-position': '-112px -34px'
            },
            'CHECKBOX-checked':{
                $order:3,
                'background-position': '-96px top'
            },
            'CELL-mouseover CHECKBOX-checked':{
                $order:4,
                'background-position': '-96px -17px'
            },
            'CELL-mousedown CHECKBOX-checked':{
                $order:5,
                'background-position': '-96px -34px'
            },
            SUB:{
                //for ie bug: relative , height='auto' will disppear
                '_zoom':'1',
                '_position':'relative',

                'margin-left':'16px',
                'font-size':'12px',
                'line-height':'20px',
                overflow:'hidden',
                display:'none'
            },
            //tree mark
            MARK:{
                width:'16px',
                height:'16px',
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -161px top', null, 'linb.UI.Public')
            },
            'CELL0-mouseover MARK':{
                $order:1,
                'background-position': '-161px -15px'
            },
            'CELL0-mousedown MARK':{
                $order:2,
                'background-position': '-161px -30px'
            },
            'MARK-checked':{
                $order:3,
                width:'16px',
                height:'16px',
                'background-position': '-176px top'
            },
            'CELL0-mouseover MARK-checked':{
                $order:4,
                'background-position': '-176px -15px'
            },
            'CELL0-mousedown MARK-checked':{
                $order:5,
                'background-position': '-176px -30px'
            },
            //DARG
            'CELLS-dragover':{
               'border-top': 'solid 2px #ff6600'
            },
            'HCELL-dragover':{
                $order:3,
               'border-left': 'solid 2px #ff6600'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{CELLS:'CELLS', CELL:'CELL', CELL0:'CELL0', HCELL:'HCELL'},
            _clickEffect:{CELL:'CELL', CELL0:'CELL0', HCELL:'HCELL'},
            onRewh:function(profile, e, src){
                var o = profile.root;
                profile.box.resize(profile, e.width?o.width():null, o.height?o.height():null);
            },
            //key navigator
            SCROLL:{
                onScroll:function(profile, e, src){
                    var pos = linb(src).scrollLeft();
                    if(profile.oldPos!=pos){
                        profile.getSubNode('HEADER').left(-pos);
                        profile.oldPos=pos;
                    }
                }
            },
            //colomn resizer
            HCELLHANDLER:{
                onMousedown:function(profile, e, src){
                    var p=profile.properties,
                    o=linb(src),
                    minW =o.parent(2).width()-p.minColW,
                    scroll = profile.getSubNode('SCROLL'),
                    maxW = scroll.absPos().left + scroll.width() - linb.event.getPos(e).left - 4,
                    id = profile.getSubSerialId(src.id),
                    col = profile.header_SerialIdMapItem[id];

                    if(p.disabled)return false;
                    if(col && col.disabled)return false;

                    o.startDrag(e, {horizontal:true, type:'blank', offset_left:minW, offset_right:maxW, move:false});
                },
                onDragbegin:function(profile, e, src){
                    linb.dragDrop.proxyIn
                    .setStyle({
                        height:profile.getSubNode('KEY').height()+'px',
                        width:'4px',
                        backgroundColor:'#ddd',
                        cursor:'e-resize'
                    });
                },
                onDrag:function(profile, e, src){
                    var d=linb.dragDrop,b=0;
                    if(d.x<=d.limit_left || d.x>=d.limit_right)b=true;
                    if(b){
                        if(!profile._limited){
                            linb.dragDrop.proxyIn.setStyle('backgroundColor','#ff6600');
                            profile._limited=true;
                        }
                    }else{
                        if(profile._limited){
                            linb.dragDrop.proxyIn.setStyle('backgroundColor','#ddd');
                            profile._limited=0;
                        }
                    }
                },
                onDragend:function(profile, e, src){
                    var o=linb(src).parent(2),w=o.width()+linb.dragDrop.getOffset().x;
                    o.width(w);

                    //collect cell id
                    var ids=[],ws=[];
                    if(src.parentNode.id.startWith(profile.keys.HCELL0A)){
                        var map = profile.row_SerialIdMapItem,
                        p=profile.properties;
                        _.each(profile.row_ItemIdMapSerialId,function(v){
                            ids.push(profile.getSubNodeId(profile.keys.CELL0,v));
                            ws.push(w-map[v]._layer*p.$subMargin);
                        });
                        ids.each(function(o,i){
                            linb(o).width(ws[i]);
                        });
                    }else{
                        var cells = profile.header_SerialIdMapItem[profile.getSubSerialId(src.id)]._cells;
                        _.each(cells,function(o){
                            ids.push(profile.getSubNodeId(profile.keys.CELL,o))
                        });
                        linb(ids).width(w);
                    }

                    profile.getSubNode('SCROLL').onScroll();
                    profile._limited=0;
                }
            },
            //row resizer
            ROWHANDLER:{
                onMousedown:function(profile, e, src){
                    var p=profile.properties,
                    row = profile.row_SerialIdMapItem[profile.getSubSerialId(src.id)],
                    o=linb(src),
                    minH =o.parent(3).height()-p.minRowH,
                    scroll = profile.getSubNode('SCROLL'),
                    maxH = scroll.absPos().top + scroll.height() - linb.event.getPos(e).top - 4;

                    if(p.disabled || (row&&row.disabled))return false;
                    o.startDrag(e, {vertical:true, type:'blank', offset_top:minH, offset_bottom:maxH , move:false});
                },
                onDragbegin:function(profile, e, src){
                    linb.dragDrop.proxyIn
                    .setStyle({
                        width:profile.getSubNode('KEY').width()+'px',
                        height:'4px',
                        backgroundColor:'#ddd',
                        cursor:'n-resize'
                    });
                },
                onDrag:function(profile, e, src){
                    var d=linb.dragDrop,b=0;
                    if(d.y<=d.limit_top || d.y>=d.limit_bottom)b=true;
                    if(b){
                        if(!profile._limited){
                            linb.dragDrop.proxyIn.setStyle('backgroundColor','#ff6600');
                            profile._limited=true;
                        }
                    }else{
                        if(profile._limited){
                            linb.dragDrop.proxyIn.setStyle('backgroundColor','#ddd');
                            profile._limited=0;
                        }
                    }
                },
                onDragend:function(profile, e, src){
                    var o=linb(src).parent(3),h=o.height()+linb.dragDrop.getOffset().y;
                    //for ie's strange bug
                    if(linb.browser.ie && h%2==1)h+=1;
                    o.height(h);
                    if(src.parentNode.id.startWith(profile.keys.HCELL0A)){
                        profile.box.resize(profile,null,profile.getSubNode('KEY').height());
                    }
                    profile._limited=0;
                }
            },
            //mark click for tree build
            MARK:{
                onClick:function(profile, e, src){
                    var
                    p = profile.properties,
                    row = profile.row_SerialIdMapItem[profile.getSubSerialId(src.id)]
                    ;
                    if(p.disabled || row.disabled)return false;
                    if(!row.sub)return false;

                    profile.box.setSub(profile, row);

                    return false;
                }
            },
            HCELL0:{
                onClick:function(profile, e, src){
                    linb(src).first().focus();
                    return false;
                }
            },
            //HCELL handler dragdrop
            HCELL:{
                onClick:function(profile, e, src){
                    var p=profile.properties,
                    id = profile.getSubSerialId(src.id),
                    col = profile.header_SerialIdMapItem[id];
                    linb(src).first().focus();
                    if(!p.colSortable || false===col.colSortable)return false;
                    if(p.disabled || col.disabled)return false;

                    var order = col._order || false,
                    type = col.type || 'input',
                    index = p.header.indexOf(col),
                    me=arguments.callee,
                    fun = me.fun||(me.fun = function(profile, root, index, type, order){
                        var rows,parent,self=arguments.callee;
                        if(root){
                            rows = root.sub;
                            parent = profile.getSubNode('SUB', root._serialId).get(0);
                        }else{
                            root={_created:true};
                            rows = profile.properties.rows;
                            parent = profile.getSubNode('BODY').get(0);
                        }
                        //sor sub first
                        var a1=[], a2=[], a3=[] ,a4=[];
                        rows.each(function(row){
                            if(row.sub && row.sub.length>1)
                                self(profile, row, index, type, order);

                             a1[a1.length]=row.cells[index].value;
                             a2[a2.length]=a2.length;
                        });

                        switch(type){
                            case 'number':
                                a2.sort( !order?
                                    function(x,y){
                                       x=parseFloat(a1[x])||0; y=parseFloat(a1[y])||0;
                                       return x>y?1:x==y?0:-1;
                                    }:
                                    function(x,y){
                                       x=parseFloat(a1[x])||0; y=parseFloat(a1[y])||0;
                                       return x<y?1:x==y?0:-1;
                                    }
                                );
                                break;
                            case 'date':
                                a2.sort( !order?
                                    function(x,y){
                                       x=Date.parse(new Date(a1[x])); y=Date.parse(new Date(a1[y]));
                                       return x>y?1:x==y?0:-1;
                                    }:
                                    function(x,y){
                                       x=Date.parse(new Date(a1[x])); y=Date.parse(new Date(a1[y]));
                                       return x<y?1:x==y?0:-1;
                                    }
                                );
                                break;
                            default:
                                a2.sort( !order?
                                    function(x,y){
                                       x=a1[x];y=a1[y];
                                       return x>y?1:x==y?0:-1;
                                    }:
                                    function(x,y){
                                       x=a1[x];y=a1[y];
                                       return x<y?1:x==y?0:-1;
                                    }
                                );
                        }
                        //sort memory array
                        //sort domnode
                        var b = root._created, bak=_.copy(rows), c;
                        if(b)
                            a1=parent.childNodes;
                        a2.each(function(o,i){
                            rows[i]=bak[o];
                            if(b)a3[i]=a1[o];
                        });
                        if(b){
                            a3.each(function(o,i){
                                parent.appendChild(o);
                                if(i%2)
                                    a4[a4.length]=o;
                            });

                            if(profile.properties.altRowsBg){
                                var altCls = profile.getClass('ALT');
                                linb(a3,false).removeClass(altCls);
                                linb(a4,false).addClass(altCls);
                            }
                        }

                    });

                    fun(profile, '', index, type, order);

                    //show sort mark
                    profile.getSubNode('SORT', true).display('none');
                    var node = profile.getSubNode('SORT', col._serialId).display('block');
                    if(col._order = !col._order)
                        profile.addTagClass('SORT', '-checked', node);
                    else
                        profile.removeTagClass('SORT', '-checked', node);


                    //clear rows cache
                    delete profile.$allrowscache;
                    return false;
                },
                onMousedown:function(profile, e, src){
                    if(!profile.properties.colDragable || false === profile.header_SerialIdMapItem[profile.getSubSerialId(src.id)].colDragable)return;

                    //fire before event
                    if(false === profile.boxing().beforeColumnDrag(profile, profile.getSubSerialId(src.id)))return;

                    var pos=linb.event.getPos(e),
                        o = linb([src],false),
                        itemId = profile.getSubSerialId(src.id);

                    o.startDrag(e,{
                        drop2:true,
                        type:'copy',
                        cursor:'pointer',
                        target_clone:true,
                        target_left:pos.left+12,
                        target_top:pos.top+12,
                        move:false,
                        defer: 1,

                        key: (profile.properties.colDragKey || profile.$id) + ":col",
                        data:o.id()
                    });
                },
                onDragbegin:function(profile, e, src){
                    linb(src).onMouseout(true,{$force:true}).onMouseup(true);
                },
                beforeMouseover:function(profile, e, src){
                    if(false===profile.box._colDragCheck(profile,src))return;

                    linb.dragDrop._current=this;
                    profile.addTagClass('HCELL', '-dragover', linb([src]));
                },
                beforeMouseout:function(profile, e, src){
                    if(false===profile.box._colDragCheck(profile,src))return;

                    linb.dragDrop._current=null;
                    profile.removeTagClass('HCELL', '-dragover', linb(src));
                },
                onDrop:function(profile, e, src){
                    if(false===profile.box._colDragCheck(profile,src))return;

                    //check dragData
                    var p=profile.properties,
                    fromId = linb.dragDrop.data && profile.getSubSerialId(linb.dragDrop.data),
                    toId = profile.getSubSerialId(src.id);

                    //fire before event
                    if(false === profile.boxing().beforeColumnMoved(profile, fromId, toId))return;

                    //remove dragover appearance
                    profile.removeTagClass('HCELL', '-dragover', linb(src));

                    //get index in HCELL array
                    var fromIndex = p.header.subIndexOf('_serialId',fromId),
                    toIndex = p.header.subIndexOf('_serialId',toId)
                    ;
                    //if same or same position, return
                    if(fromIndex===toIndex|| fromIndex===toIndex-1)return;

                    //get properties
                    var
                    map=profile.header_SerialIdMapItem,
                    fromTh=map[fromId],
                    toTh=map[toId]
                    ;

                    //reposition header dom node
                    profile.getSubNode('HCELL', toId).addPre(linb.dragDrop.data);
                    //reposition cell dom nodes
                    _.each(toTh._cells, function(o,i){
                        profile.getSubNode('CELL',o).addPre(profile.getSubNode('CELL',fromTh._cells[i]));
                    });

                    //update memory
                    //HCELL position
                    //keep refrence, and remove
                    var temp=p.header[fromIndex];
                    p.header.removeFrom(fromIndex);
                    //insert to right pos
                    p.header.insertAny(temp,toIndex);
                    //cell position row_SerialIdMapItem
                    var allitems = profile.itemsSearch(p.rows, true, true);
                    allitems.each(function(o){
                        temp=o.cells[fromIndex];
                        o.cells.removeFrom(fromIndex);
                        o.cells.insertAny(temp,toIndex);
                    });

                    //fire after event
                    profile.boxing().afterColumnMoved(profile, fromId, toId);

                    //clear rows cache
                    delete profile.$allrowscache;
                }
            },
            //cell handler dragdrop
            CELL0:{
                onClick:function(profile, e, src){
                   var p = profile.properties,
                   serialId=profile.getSubSerialId(src.id),
                   row = profile.row_SerialIdMapItem[serialId];
                   if(p.disabled || row.disabled)return false;
                   if(row.sub)
                        profile.getSubNode('MARK', serialId).onClick(true);
                   linb(src).first().focus();
                   return false;
                },
                onMousedown:function(profile, e, src){
                    var p = profile.properties,
                    fromId = profile.getSubSerialId(src.id),
                    row = profile.row_SerialIdMapItem[fromId],
                    _layer = row._layer;

                    if(p.disabled || row.disabled)return false;

                    if(!p.rowDragable || row.rowDragable===false)
                        return;

                    //fire before event
                    if(false === profile.boxing().beforeRowDrag(profile, row))return;

                    var
                    pos=linb.event.getPos(e),
                    o = linb([src],false).parent(2)
                    ;

                    linb([src],false).startDrag(e,{
                        drop2:true,
                        type:'copy',
                        cursor:'pointer',
                        target_clone:true,
                        target_left:pos.left+12,
                        target_top:pos.top+12,
                        move:false,
                        defer: 1,

                        key:(p.rowDragKey || profile.$id)+ ":row" + (p.rowDragToAny?'':(':'+_layer)),
                        data:o.id()
                    });
                },
                onDragbegin:function(profile, e, src){
                    linb(src).onMouseout(true,{$force:true}).onMouseup(true);
                },
                beforeMouseover:function(profile, e, src){
                    if(false===profile.box._rowDragCheck(profile,src))return;

                    linb.dragDrop._current=this;
                    linb.dragDrop.showDDMark(src);
                },
                beforeMouseout:function(profile, e, src){
                    if(false===profile.box._rowDragCheck(profile,src))return;

                    linb.dragDrop._current=null;
                    linb.dragDrop.showDDMark(null);
                },
                onDrop:function(profile, e, src){
                    if(false===profile.box._rowDragCheck(profile,src))return;
                    linb.dragDrop.showDDMark(null);
                    profile.box._rowDrop(profile, src, true);
                    return false;
                }
            },
            CELL0A:{
                onFocus:function(profile, e, src){
                    if(profile.properties.activeMode=='row'){
                        var src = profile.getSubNode('CELLS', profile.getSubSerialId(src.id)).get(0);
                        if(profile.$activeRow == src.id)return true;
                        profile.box.activeRow(profile, src.id);
                    }
                }
            },
            CELLS:{
                beforeMouseover:function(profile, e, src){
                    if(false===profile.box._rowDragCheck(profile,src))return;
                    linb.dragDrop._current=this;
                    profile.addTagClass('CELLS', '-dragover', linb([src]));
                },
                beforeMouseout:function(profile, e, src){
                    if(false===profile.box._rowDragCheck(profile,src))return;

                    linb.dragDrop._current=null;
                    profile.removeTagClass('CELLS', '-dragover', linb(src));
                },
                onDrop:function(profile, e, src){
                    if(false===profile.box._rowDragCheck(profile,src))return;
                    profile.removeTagClass('CELLS', '-dragover', linb(src));
                    profile.box._rowDrop(profile, src);
                    return false;
                },
                onClick:function(profile, e, src){
                    var p = profile.properties,
                    serialId=profile.getSubSerialId(src.id),
                    row = profile.row_SerialIdMapItem[serialId];
                    if(p.disabled || row.disabled)return false;
                    profile.box.activeRow(profile, src.id);
                    return false;
                },
                onDblclick:function(profile, e, src){
                    var p = profile.properties,
                    serialId=profile.getSubSerialId(src.id),
                    row = profile.row_SerialIdMapItem[serialId];
                    if(p.disabled || row.disabled)return false;

                    if(profile.onDblClickRow)profile.boxing().onDblClickRow(profile, row,e,src);
                    return false;
                }
            },
            CELL:{
                onClick:function(profile, e, src){
                    var cell = profile.cells_SerialIdMapItem[profile.getSubSerialId(src.id)],
                    box=profile.box;
                    linb(src).first().focus();

                    if(box.getCellPro(profile, cell, 'disabled'))
                        return false;

                    if(box.getCellPro(profile, cell, 'editable'))
                        if(box.getCellPro(profile, cell, 'type')=='checkbox')
                            box.changeCellValue(profile, cell, !cell.value);
                    return false;
                }
            },
            CELLA:{
                onFocus:function(profile, e, src){
                    var p = profile.properties,
                    box=profile.box,
                    cell = profile.cells_SerialIdMapItem[profile.getSubSerialId(src.id)],
                    mode = p.activeMode, id;
                    if(mode=='cell'){
                        if(box.getCellPro(profile, cell, 'disabled'))
                            return false;
                        id = linb(src).parent().id();
                        box.activeCell(profile, id);
                    }else if(mode=='row'){
                        if(p.disabled || cell._row.disabled)
                            return false;
                        id = linb(src).parent(2).id();
                        box.activeRow(profile, id);
                    }
                    if(box.getCellPro(profile, cell, 'editable'))
                        box.editCell(profile, cell._serialId);
                }
            }
        }},
        DataModel:{
            listKey:null,
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.root.dig('A').tabIndex(value);
                }
            },

            dock:'fill',

            rowDragKey:'',
            rowDragToAny:true,
            colDragKey:'',

            altRowsBg: {
                ini:true,
                action:function(value){
                    if(this.domNode){
                        //todo:
                    }
                }
            },
            editable:true,

            $subMargin:16,

            iniFold:true,

            left:0,
            top:0,
            position:'absolute',
            width:300,
            height:200,

            minColW:5,
            minRowH:20,
            rowHandlerWidth: 20,
            headerHeight:{
                ini:20,
                action:function(v){
                    this.getSubNode('HCELLS').height(v);
                    this.box.resize(this, this.root.width(), this.root.height());
                }
            },
            rowHeight:{
                ini:20,
                action:function(v){
                    this.getSubNode('CELLS', true).height(v);
                }
            },
            cellDfWidth: 80,

            colResizer:{
                ini:true,
                action:function(value){
                    this.getSubNode('HCELLHANDLER',true).display(value?'':'none');
                }
            },
            rowHandler:{
                ini:true,
                action:function(value){
                    this.getSubNode('HCELL0').display(value?'':'none');
                    this.getSubNode('CELL0',true).display(value?'':'none');
                }
            },
            rowResizer:{
                ini:true,
                action:function(value){
                    this.getSubNode('ROWHANDLER',true).display(value?'':'none');
                }
            },
            colSortable:{
                ini:true,
                action:function(value){
                    this.getSubNode('SORT',true).display('none');
                }
            },

            header:{
                ini:{},
                set:function(v){
                    return this.each(function(o){
                        if(o.domNode){
                            o.boxing().refreshHeader(v);
                        }else
                            o.properties.header = v;
                    });
                }
            },
            rows:{
                //for default merge
                ini:{},
                set:function(v){
                    return this.each(function(o){
                        if(o.domNode)
                            o.boxing().removeAllRows().insertRows(v);
                        else
                            o.properties.rows = v;
                    });
                }
            },
            colDragable:true,
            rowDragable:true,

            activeMode:{
                ini:'row',
                listbox:['row','cell' /*,'multi-row','multi-cell'*/],
                action:function(value){
                    if(this.domNode){
                        var profile=this;
                        if(profile.$activeCell)
                            profile.removeTagClass('CELL', '-active', linb(profile.$activeCell));
                        if(profile.$activeRow)
                            profile.removeTagClass('CELLS', '-active', linb(profile.$activeRow));
                    }
                }
            }
        },
        EventHandlers:{
            onRequestData:function(profile, item, threadid){},

            beforeColumnSort:function(profile, id, order){},
            afterColumnSort:function(profile, id, order){},

            //events for row drag
            beforeRowDrag:function(profile,id){},
            beforeRowMoved:function(profile, fromId, toId){},
            afterRowMoved:function(profile, fromId, toId){},

            //events for column drag
            beforeColumnDrag:function(profile,id){},
            beforeColumnMoved:function(profile, fromId, toId){},
            afterColumnMoved:function(profile, fromId, toId){},

            beforeRowActive:function(profile, row){},
            afterRowActive:function(profile, row){},
            beforeCellActive:function(profile, cell){},
            afterCellActive:function(profile, cell){},

            onDblClickRow:function(profile, row,e,src){}
        },
        createdTrigger:function(){
            if(!this.properties.iniFold)
                this.boxing().openRows(this.properties.rows, true);
        },
        iniProfile:function(){
            this.$cache_editor = {};
        },
        beforeSerialized:function(profile){
            var t,o = profile.copy();
            o.properties = _.copy(profile.properties);
            o.properties.header = linb.UI.pickObj(profile.properties.header);
            o.properties.rows = linb.UI.pickObj(profile.properties.rows);
            return o;
        },
        _clsCache:{},
        _resetRowHandler : function(profile, row, baseW, subMargin, _layer){
            var self= arguments.callee, w=baseW - _layer*subMargin;
            //reset _layer
            row._layer = _layer;
            //reset row hander's width
            profile.getSubNode('CELL0', row._serialId).width(w);
            if(row.sub){
                ++_layer;
                _.each(row.sub,function(r){
                    self(profile, r, baseW, subMargin, _layer);
                })
            }
        },
        _colDragCheck:function(profile, src){
            var dd = linb.dragDrop, key = dd.dragKey, data = dd.data;
            if(!key || !data)
                return false;
            var dkey = (profile.properties.colDragKey || profile.$id) + ":col";
            if(key!=dkey)
                return false;

            if(profile.getKey(data)!=profile.keys.HCELL)
                return false;

            //check dragData
            var
            fromId = linb.dragDrop.data && profile.getSubSerialId(data),
            toId = profile.getSubSerialId(src.id);
            //if same return
            if(fromId == toId)return;


        },
        _rowDragCheck:function(profile, src){
            var dd = linb.dragDrop, key = dd.dragKey, data = dd.data;
            if(!key || !data)
                return false;

            var dkey = (profile.properties.rowDragKey || profile.$id) + ":row" + (profile.properties.rowDragToAny?'':(':'+_layer));
            if(key!=dkey)
                return false;

            if(profile.getKey(data)!=profile.keys.ROW)
                return false;

            var
            fromId = linb.dragDrop.data && profile.getSubSerialId(data),
            toId = profile.getSubSerialId(src.id),
            toRow = profile.row_SerialIdMapItem[toId],
            _layer = toRow._layer;

            if(fromId == toId)
                return false;

            var node=src,target=linb.dom.byId(data);
            do{
                if(node==target)return false;
            }while((node && (node=node.parentNode) && node!=profile.domNode))
        },
        _rowDrop:function(profile, src, flag){
            var map = profile.row_SerialIdMapItem,
                fromId = linb.dragDrop.data && profile.getSubSerialId(linb.dragDrop.data),
                fromRow = map[fromId],
                toId = profile.getSubSerialId(src.id),
                toRow = map[toId],
                _layer = flag ? toRow._layer+1 : toRow._layer;
                ;

            //fire before event
            if(false === profile.boxing().beforeRowMoved(profile, fromId, toId, flag))return;

            //get parent
            var toParentId, toParent, toIndex,
            fromParentId = fromRow._pid,
            fromParent = fromParentId?map[fromParentId].sub:profile.properties.rows,
            fromIndex = fromParent.subIndexOf('_serialId',fromId);

            if(flag){
                toParentId = toRow._serialId, toParent;
                if(toRow.sub)
                    toParent = toRow.sub;
                else{
                    toParent = toRow.sub = [];
                    profile.getSubNode('MARK', toRow._serialId).display('block');
                }
                toIndex = -1;
            }else{
                toParentId = toRow._pid;
                toParent = toParentId?map[toParentId].sub:profile.properties.rows;
                toIndex = toParent.subIndexOf('_serialId',toId);
            }
            //if same or same position, return;
            if(toParentId==fromParentId && (toIndex==fromIndex || toIndex== fromIndex+1))return;

            if(flag && !toRow._created){
                profile.box.setSub(profile, toRow, true);
                toRow._created=true;
            }

            if(profile.properties.rowHandler){
                //if parent changed, udpate parent, and reset row handler's width
                if(toParentId!==fromParentId){
                    fromRow._pid=toParentId;
                    profile.box._resetRowHandler(profile, fromRow, profile.getSubNode('HCELL0').width(), profile.properties.$subMargin, _layer||0);
                }
            }

            //remove first
            fromParent.removeFrom(fromIndex);
            //insert according to index
            toParent.insertAny(fromRow,toIndex);

            if(flag)
                profile.getSubNode('SUB', toId).addLast(linb.dragDrop.data);
            else
                //move dom node
                profile.getSubNode('ROW', toId).addPre(linb.dragDrop.data);

            //fire after event
            profile.boxing().afterRowMoved(profile, fromId, toId, flag);

            //clear rows cache
            delete profile.$allrowscache;
        },
        prepareData:function(profile){
            profile.row_ItemIdMapSerialId = {};
            profile.row_SerialIdMapItem = {};
            profile.cells_SerialIdMapItem = {};

            var data = profile.data, pro=profile.properties;

            data.thhandlerDisplay=pro.colResizer?'':'display:none';
            data.tdfhandlerDisplay=pro.rowResizer?'':'display:none';
            data.tdfDisplay=pro.rowHandler?'':'display:none';

            if(pro.header && pro.header.constructor != Array)
                pro.header = _.clone([
                    {id:'col1',caption:'col1',type:'input',width:50},
                    {id:'col2',caption:'col2',type:'input',width:80}
                ]);
            if(pro.rows && pro.rows.constructor != Array)
                pro.rows = _.clone([
                    {id:'row1',cells:['cell11', 'cell12']},
                    {id:'row2',cells:[{value:'cell21',type:'label'}, 'cell22'],sub:[
                         {id:'row21',cells:['cell31', {value:'cell32',type:'number'}]}
                    ]}
                ]);

            data.header=this.prepareHeader(profile, pro.header);

            arguments.callee.upper.call(this, profile);

            data.rows = this.prepareItems(profile, pro.rows);
        },
        prepareHeader:function(profile, arr){
            var a = profile.header_ItemIdMapSerialId = {},
                b = profile.header_SerialIdMapItem = {},
                SubID=linb.UI.subSerialIdTag,
                pro=profile.properties,
                header=[], temp, t;
            arr.each(function(o,i){
                temp=profile.pickSubId('header');
                //#
                o._cells={};
                o[SubID]=temp;
                b[temp]=o;

                t={
                    width : o.width || pro.cellDfWidth,
                    sortDisplay : 'display:none',
                    tdfDisplay : pro.rowHandler?'':'display:none'
                };

                t[SubID]=temp;
                t._tabindex=pro.tabindex;

                t.thhandlerDisplay = pro.colResizer?'':'display:none';

                linb.UI.copyItem(o, t);

                // id to dom item id
                a[o.id]=temp;
                // dom item id to properties item
                header.push(t);
            });
            return header;
        },
        prepareItems:function(profile, arr, pid){
            var pro=profile.properties,
                a = profile.row_ItemIdMapSerialId,
                b = profile.row_SerialIdMapItem,
                d = profile.cells_SerialIdMapItem,
                _layer=pid?b[pid]?(b[pid]._layer+1):0:0,
                SubID=linb.UI.subSerialIdTag,
                getPro=profile.box.getCellPro,
                self=arguments.callee,
                rows=[],
                altCls = profile.getClass('ALT'),
                temp,cells,t,row,listKey,headCell,n,render;

            for(var i=0,l=arr.length;i<l;i++){
                temp=profile.pickSubId('row');

                row = arr[i];
                //#
                row._pid = pid;
                row._cells={};
                row._layer=_layer;
                row[SubID]=temp;
                row._tabindex=pro.tabindex;

                b[temp]=row;

                t={id: row.id};
                t.rowHeight=pro.rowHeight;
                t.rowHandlerWidth=pro.rowHandlerWidth;

                t.tdfDisplay=pro.rowHandler?'':'display:none';
                t.tdfhandlerDisplay=pro.rowResizer?'':'display:none';

                if(pro.altRowsBg)
                    t.cls = i%2?altCls:'';

                cells = t.cells = [];

                t[SubID]=temp;
                t.display = row.sub?'':'display:none';

                // id to dom item id
                a[row.id]=temp;

                // for cells
                row.cells.each(function(g,j){
                    headCell=pro.header[j];

                    n={
                        width : headCell.width
                    };
                    //check input
                    if(typeof g == 'object')
                        linb.UI.copyItem(g, n);
                    else{
                        n.value=g;
                        g = row.cells[j] = {value:g};
                    }
                    //cell/cell link to row
                    g._row = row;
                    //cell/cell link to header
                    g._header=headCell;

                    n.type = getPro(profile, g,'type') || 'input';
                    render = getPro(profile, g,'render');
                    n.caption = render?render(n.value):n.value;

                    //cellCls
                    g[SubID]=n[SubID]=profile.pickSubId('cell');
                    n.cellCls =  this._clsCache[n.type] || (this._clsCache[n.type]=profile.getClass('CELL', '-' + n.type));

                    switch(n.type){
                        case 'checkbox':
                            n.checkboxCls = this._clsCache[n.type+':'+n.value] || (this._clsCache[n.type+':'+n.value]=profile.getClass('CHECKBOX', n.value?'-checked':''));
                            break;
                    }
                    n._tabindex=pro.tabindex;
                    cells.push(n);

                    // cell only link its' dom item id to properties item
                    d[n[SubID]]=g;

                    // row link to cell/cell
                    row._cells[headCell.id]=n[SubID];
                    // header link to cell/cell
                    headCell._cells[row.id]=n[SubID];
                },this);

                linb.UI.copyItem(row, t);

                rows.push(t);
            }
            return rows;
        },
        setSub:function(profile, item, flag){
            var id=profile.domId,
                key1 = profile.keys.MARK,
                key2 = profile.keys.SUB,
                serialId = profile.row_ItemIdMapSerialId[item.id],
                markNode = profile.getSubNode('MARK', serialId),
                getSubNode = profile.getSubNode('SUB', serialId)
                ;

            if(linb.thread.exists(profile.key+profile.id))
                return;

            if(item._checked){
                var h = getSubNode.height();

                getSubNode.fx({'height':[h,0]},function(){getSubNode.height(h)},function(){getSubNode.display('none').height('auto')}, 200, 8, 'inexp', profile.key+profile.id).start();

                profile.removeTagClass('MARK', '-checked', markNode);

                item._checked = false;
            }else{
                var openSub = function(profile, item, id, markNode, getSubNode, sub, flag){
                    var p = profile.properties;
                    //created
                    if(!item._created){
                        delete item.sub;
                        //before insertRows
                        item._created=true;
                        getSubNode.display('none');
                        profile.boxing().insertRows(sub, item.id);
                    }

                    if(!flag){
                        var h = getSubNode.height(true);
                        getSubNode.fx({'height':[0,h]},function(){
                            getSubNode.setStyle({height:'0px',display:'block'});
                        },function(){getSubNode.setStyle({height:'auto'})}, 200, 8, 'outexp', profile.key+profile.id).start();
                    }else
                        getSubNode.display('block');

                    if(p.rowHandler){
                        var w1 = profile.getSubNode('HCELL0').width(),
                        w2 = (item._layer+2)*p.$subMargin;
                        if(w1<w2){
                            profile.getSubNode('HCELL0').width(w2);
                            profile.getSubNode('CELL0',true).widthBy(w2-w1);

                            //profile.getSubNode('HCELL0').width(w2);
                            //p.rows.each(function(row){
                            //    profile.box._resetRowHandler(profile, row,w2,p.$subMargin,0);
                            //});
                        }
                    }

                    profile.addTagClass('MARK', '-checked', markNode).addTagClass('MARK', '-mouseover', markNode);

                    item._checked = true;
                };

                var sub = item.sub;
                if(sub && sub.length){
                    openSub(profile, item, id, markNode, getSubNode, sub, flag);
                    if(flag){
                        sub.each(function(o){
                            if(o.sub && o.sub.length && !o.iniFold && !o._checked)
                                profile.box.setSub(profile, o, true);
                        });
                    }
                }else{
                    linb.thread(null,[
                        //request sub
                        function(threadId){
                            if(profile.onRequestData)
                                profile.boxing().onRequestData(profile, item, threadId);
                             else
                                linb.thread(threadId).abort();
                        },
                        //handle response
                        function(threadId){
                            //get sub from thread
                            sub = linb.thread(threadId).getCache('response');
                            if(sub){
                                openSub(profile, item, id, markNode, getSubNode, sub, flag);
                                openSub=null;
                            }
                        }
                    ],null,null,
                    //set busy status to UI
                    function(threadId){profile.addTagClass('MARK', '-busy', markNode); linb(id).busy(false)},
                    //set free status to UI
                    function(){profile.removeTagClass('MARK', '-busy', markNode); linb(id).free()}
                    ).start();
                }
            }
            //clear rows cache
            delete profile.$allrowscache;
        },
        getCellId:function(profile, rowId, colId){
            var rowItemId = profile.row_ItemIdMapSerialId[rowId],
            row = profile.row_SerialIdMapItem[rowItemId];
            return row && row._cells && row._cells[colId];
        },
        changeCellValue:function(profile, cellId, value){
            var cell;
            if(typeof cellId == 'string')
                cell = profile.cells_SerialIdMapItem[cellId];
            else{
                cell = cellId;
                cellId = cell._serialId;
            }
            if(!cell)return;

            var type = profile.box.getCellPro(profile, cell,'type') || 'input',
                render = profile.box.getCellPro(profile, cell,'render');

            if(cell.value!=value){
                if(false === profile.boxing().beforeValueUpdated(profile, cell, cell.value, value))
                    return;

                switch(type){
                    case 'checkbox':
                        if(value)
                            profile.addTagClass('CHECKBOX', '-checked', profile.getSubNode('CHECKBOX', cellId));
                        else
                            profile.removeTagClass('CHECKBOX', '-checked', profile.getSubNode('CHECKBOX', cellId));
                        break;
                    case 'number':
                        value = parseFloat(value);
                    case 'listbox':
                    case 'timepicker':
                    case 'datepicker':
                    case 'colorpicker':
                    default:
                        profile.getSubNode('CELLA', cellId).text(render?render(value):value);
                }

                cell.value=value;

                profile.boxing().afterValueUpdated(profile,cell, cell.value, value);
            }
        },
        activeCell:function(profile, id){
            if(profile.properties.activeMode!='cell')return;

            var
            targetId = profile.getSubSerialId(id),
            map = profile.cells_SerialIdMapItem,
            targetCell=map[targetId];

            if(false === profile.boxing().beforeCellActive(profile, targetCell))return;

            if(profile.$activeCell)
                profile.removeTagClass('CELL', '-active', linb(profile.$activeCell));
            profile.addTagClass('CELL', '-active', linb(id));

            profile.$activeCell=id;

            profile.boxing().afterCellActive(profile, targetCell);
        },
        activeRow:function(profile, id){
            if(profile.properties.activeMode!='row')return;

            var
            targetId = profile.getSubSerialId(id),
            map = profile.row_SerialIdMapItem,
            targetRow=map[targetId];

            //before event
            if(false === profile.boxing().beforeRowActive(profile, targetRow))return;

            if(profile.$activeRow)
                profile.removeTagClass('CELLS', '-active', linb(profile.$activeRow));
            profile.addTagClass('CELLS', '-active', linb(id));

            profile.$activeRow = id;
            //after event
            profile.boxing().afterRowActive(profile, targetRow);

        },
        getCellPro:function(profile, cell, key){
            return cell[key] || cell._row[key] || cell._header[key] || profile.properties[key];
        },
        editCellbyRowCol:function(profile, rowId, colId){
            return this.editCell(profile, this.getCellId(profile, rowId, colId));
        },
        editCell:function(profile, cellId){
            var cell = typeof cellId == 'string' ?  profile.cells_SerialIdMapItem[cellId] : cellId;
            if(!cell)return;
            var grid = this;

            //get cell node and pos/size
            var cellNode = profile.getSubNode('CELL', cellId),
                baseNode = profile.getSubNode('SCROLL'),
                absPos=cellNode.absPos(null, baseNode),
                size = cellNode.cssSize(),
                type = profile.box.getCellPro(profile, cell,'type') || 'input',
                format = profile.box.getCellPro(profile, cell,'format'),
                widget,t
            ;
            if(type=='checkbox'){
                cellNode.first().focus();
                return;
            }

            //get from cache
            if(profile.$cache_editor[type]){
                widget=profile.$cache_editor[type];
            }else{
                switch(type.split(':')[0]){
                    case 'label':
                        return;
                        break;
                    case 'number':
                    case 'input':
                    case 'textarea':
                        linb.SC('linb.UI.Input');
                        break;
                    case 'checkbox':
//                        linb.SC('linb.UI.CheckBox');
                        break;
                    case 'listbox':
                    case 'combobox':
                    case 'popbox':
                    case 'getter':
                    case 'helpinput':
                    case 'cmdbox':
                    case 'popbox':
                    case 'timepicker':
                    case 'datepicker':
                    case 'colorpicker':
                        linb.SC('linb.UI.ComboInput');
                        break;
                    case 'button':
                        linb.SC('linb.UI.Button');
                        break;
                    default:
                }
                switch(type.split(':')[0]){
                    case 'label':
                        return;
                        break;
                    case 'number':
                    case 'input':
                        widget =  linb.create('Input');
                        break;
                    case 'textarea':
                        widget =  linb.create('Input',{inputArea:'textarea'});
                        break;
                    case 'listbox':
                    case 'combobox':
                    case 'helpinput':
                    case 'timepicker':
                    case 'datepicker':
                    case 'colorpicker':
                        widget =  new linb.UI.ComboInput;
                        widget.setType(type);
                        widget.create();
                        break;
                    case 'getter':
                    case 'popbox':
                    case 'cmdbox':
                    case 'popbox':
                        widget =  new linb.UI.ComboInput;
                        widget.setType(type).onClickButton(function(pro){
                            var cell=pro.$cell;
                            //event
                            if(typeof cell.event == 'function')cell.event.call(profile._host||profile, profile, cell, pro);
                        });
                        widget.create();
                        break;
                    case 'checkbox':
//                        widget =  linb.create('CheckBox');
                        break;
                    case 'button':
                        widget =  linb.create('Button',{caption:'...'},{
                            onClick:function(pro){
                                var cell=pro.$cell;
                                if(typeof cell.event == 'function')cell.event.call(profile._host||profile, profile, cell, pro);
                            }
                        });
                        break;
                    default:
                }
                //for dimension, if no postion, can't get dimension paras
                widget.reBoxing().setStyle({position:'absolute',display:'none'});
                baseNode.attach(widget);
                profile.$cache_editor[type] = widget;
            }
            widget.get(0).$cell = cell;

            //set properties
            //first
            if(cell.items)
                widget.setItems(cell.items);
            //next
            if(t=profile.box.getCellPro(profile, cell,'listKey'))
                widget.setListKey(t);

             widget.setValue(cell.value, true);

            //$tag
            if(cell.$tag){
                if(widget.setCaption)widget.setCaption(cell.$tag);
                else if(widget.setValue)widget.setValue(cell.$tag);
            }

            var undo = function(){
                if(widget){
                    widget.updateUIValue(widget.getCtrlValue());
                    widget.beforeValueUpdated(null).beforeNextFocus(null);
                    if(widget.onFormatCheck)widget.onFormatCheck(null);
                    if(widget.setValueFormat)widget.setValueFormat('');
                    widget.setValue('',true);
                    //don't use disply:none, firfox has many bugs about Caret or render
                    widget.reBoxing().hide();
                    widget = null;
                }
            };

            //widget change value, update cell value
            widget
            .beforeValueUpdated(function(pro,oV,nV){
                grid.changeCellValue(profile, cellId, nV);
            })
            .beforeNextFocus(function(pro, key, shift, e){
                undo();
                var hash=linb.event.getEventPara(e);
                if(hash.keyCode=='enter')hash.keyCode='down';

                profile.getSubNode('CELLA', cell._serialId).onKeydown(true,hash);
                //prevent
                return false;
            });

            if(format){
                if(typeof format == 'function'){
                    if(widget.onFormatCheck)widget.onFormatCheck(format);
                }else{
                    if(widget.setValueFormat)widget.setValueFormat(format);
                }
                t = profile.box.getCellPro(profile, cell,'tipsErr');
                if(t && widget.setTipsErr)widget.setTipsErr(t);
            }

            widget.reBoxing().setBlurTrigger(widget.get(0).$id, function(){
                undo();
                return false;
            });

            //show widget
            if(type=='textarea'){
                widget.reBoxing().width(200).height(100).popToTop(cellNode, baseNode, 4);
            }else{
                widget.reBoxing().width(size.width+3).height(size.height+3)
                .setStyle({display:'block'});
                widget.reBoxing().show((absPos.left-1) + 'px',(absPos.top-1) + 'px');
            }
            _.asyRun(function(){
                if(widget)widget.activate();
            });
        },
        showTips:function(profile, id, pos){
            if(profile.properties.disabled)return;

            if(profile.getKey(id)!=profile.keys.CELLA)return;

            var item = profile.cells_SerialIdMapItem[profile.getSubSerialId(id)];
            if(item && item.value){
                linb.UI.Tips.show(pos, {tips:item.value});
                return true;
            }else
                return false;
        },
        resize:function(profile,w,h){
            profile.getSubNode('BORDER').cssSize({ width :w, height :h});
            var rh;
            if(h)
                rh = profile.getSubNode('HEADER').realHeight();
            profile.getSubNode('BOX').cssSize({width: w?w:null, height:h?h:null});
            profile.getSubNode('SCROLL').setRegion({top:rh?rh:null, width:w?w:null, height: h?(h-rh):null}).onScroll();
        }
   }
});