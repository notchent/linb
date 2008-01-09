Class("linb.UI.Poll", "linb.UI.List",{
    Instance:{
        setOptCap:function(item, v){
            return this.each(function(pro){
                var items = pro.properties.items,
                i = pro.itemsSearch(pro.properties.items, function(o){
                    return o.id==item.id;
                },false,true);
                if(i && (i=i[0])){
                    i.caption=v;
                    if(pro.domNode)
                        pro.getSubNodeByItemId('CAPTION',i.id).html(v);
                }
            });
        },
        getBindEditor:function(){
            return this.get(0)._bind;
        },
        insertOpt:function(opt,index){
            if(!opt.id)opt.id=_.id();
            var item,items=this.get(0).properties.items,t;
            if(!_.isNumb(index)){
                if(t=items.length)
                    item=items[t-1];
            }else
                item=items[index];

            this.insertItems([opt],item && item.id, false);
            return this;
        },
        removeOpt:function(id){
            this.removeItems([id]);
            return this;
        }
    },
    Initialize:function(){
        var self=this;
        self.mapKeys(['MARK2','EDIT']);
        //modify default template fro shell
        var t = self.getTemplate('default');
        t.TITLE={
            $order:'0',
            tagName : 'DIV',
            text : '{title}',
            className:"{disabled} {_cls}"
        };
        t.TAIL={
            $order:'20',
            tagName : 'DIV',
            className:"{disabled} ",
            text:"{cmds}"
        };
        t.$dynamic={
            items:{
                ITEM:{
                    tagName: 'a',
                    href :"javascript:;",
                    tabindex: '{_tabindex}',
                    OPTION:{
                        $order:0,
                        tagName : 'DIV',
                        MARK:{}
                    },
                    CAPTION:{
                        $order:1,
                        tagName : 'DIV',
                        text : '{caption}',
                        className:"{disabled} {_itemcls}"
                    },
                    CHART:{
                        $order:2,
                        tagName : 'DIV',
                        style:'{_display}',
                        CAST:{
                            $order:0,
                            text:'{message}'
                        },
                        BAR:{
                            $order:1,
                            style:'background-position: -{_per}px -190px;',
                            BARI:{}
                        },
                        DEL:{
                            $order:2,
                            tagName : 'BUTTON',
                            style:'{_del}',
                            text:'{delText}'
                        }
                    },
                    CLEAR:{
                        $order:3,
                        tagName : 'DIV'
                    }
                }
            },
            cmds:{
                CMD:{
                    tagName: 'button',
                    tabindex: '{_tabindex}',
                    text:'{caption}'
                }
            }
        };
        self.setTemplate('default',t);

        //for modify
        var inlineEdit=function(profile,node,flag,value,item){
            var o = profile._bind,prop=profile.properties;
            if(!o){
                profile._bind=o=linb.create(prop.inlineEditor, {type:prop.type,saveBtn:true,left:-10000,top:-10000});
                o.onHotKeydown(function(p,key){
                    if(key=='enter'){
                        p.boxing().onSave(p);
                        return false;
                    }else if(key=='esc')
                        o.hide();
                })
                profile.root.attach(o);
            }

            var r=node.getRegion(true,profile.root);
            if(r.height>o.getHeight())
                o.setHeight(r.height);
            else
                r.top-=3;
            if(r.top<0)r.top=0;

            o.setValue(value||'',true)
            .setWidth(r.width + node.paddingW())
            .show(r.left+'px',r.top+'px')
            .onSave(function(p){
                var v=p.properties.$UIvalue, ov=p.properties.value, b=profile.boxing();
                if(v!=ov)
                    switch(flag){
                        //edit option
                        case '1':
                            if(profile.beforeItemChanged && b.beforeItemChanged(profile, item, v)===false ){}
                            else
                                b.setOptCap(item,v);
                        break;
                        //new option
                        case '2':
                            if(profile.beforeItemAdded && b.beforeItemAdded(profile, v)===false ){}
                            else
                                b.insertOpt({caption:v});
                        break;
                        //edit title
                        default:
                            if(profile.beforeTitleChanged && b.beforeTitleChanged(profile, v)===false){}
                            else
                                b.setTitle(v);
                    }
                _.asyRun(function(){
                    o.hide();
                });
            })
            .reBoxing().setBlurTrigger(o.KEY+":"+o.$id, function(){
                o.hide();
            }, null, o.$id);
            _.asyRun(function(){
                o.activate()
            });
        };

        t = self.getBehavior('default');
        var old=t.ITEM.onClick;
        t.ITEM.onClick = function(profile, e, src){
            var p = profile.properties,
                item = profile.getItemByDom(src);
            if(p.disabled)return;

            if(p.editable)
                inlineEdit(profile, profile.getSubNodeByItemId('CAPTION',item.id), item.editable?'2':'1', item.editable?'':item.caption, item);
            else{
                old.apply(this, arguments);
                if(String(p.$UIvalue||'').split(';').exists(item.id) && item.editable)
                    inlineEdit(profile, profile.getSubNodeByItemId('CAPTION',item.id), '2');
            }
        };
        t.TITLE={
            onClick : function(profile, e, src){
                var p = profile.properties,
                    item = profile.getItemByDom(src);
                if(p.disabled)return;

                if(p.editable)
                    inlineEdit(profile, profile.getSubNode('TITLE'), '3', p.title);
            }
        };
        t.DEL={
            onClick : function(profile, e, src){
                var p = profile.properties,
                    b = profile.boxing(),
                    item = profile.getItemByDom(src);
                if(p.disabled)return;

                if(p.editable){
                    if(profile.beforeItemRemoved && b.beforeItemRemoved(profile, item)===false ){}
                    else
                        b.removeOpt(item.id);
                    return false;
                }
            }
        }
        t.CMD={
            onClick : function(profile, e, src){
                var p = profile.properties,
                    key = profile.getSubSerialId(src.id);
                if(p.disabled)return;
                profile.boxing().onCommand(profile, key, src);
            }
        };

        self.setBehavior('default',t);
    },
    Static:{
        Appearances:{'default':{
            KEY:{
                'font-size':'12px',
                zoom:linb.browser.ie?1:null,
                background:'#fff'
            },
            'TITLE, ITEMS, TAIL':{
                position:'relative',
                overflow:'auto',
                'line-height':'12px',
                background:'#fff'
            },
            TAIL:{
                zoom:linb.browser.ie?1:null,
                'padding':'5px 0 5px 40px'
            },
            CMD:{
                margin:'3px'
            },
            TITLE:{
                'font-weight':'bold',
                padding:'4px',
                'border-bottom':'1px solid #CDCDCD'
            },
            ITEMS:{
                'overflow-x': (linb.browser.ie || linb.browser.gek)?'hidden':'',
                zoom:linb.browser.ie?1:null,
                margin:'4px 4px 4px 20px'
            },
            ITEM:{
                display:'block',
                position:'relative',
                zoom:linb.browser.ie?1:null,
                padding:'4px 2px 4px 2px',
                'border-bottom':'1px dashed #CDCDCD'
            },
            'ITEM-checked':{},
            OPTION:{
                position:'absolute',
                left:'2px',
                top:'4px'
            },
            CAPTION:{
                'float':'left',
                zoom:linb.browser.ie?1:null,
                'margin-left':'24px',
                //{*1*}for: ie6 double margin bug
                display:linb.browser.ie6?'inline':null
            },
            'EDIT':{
                $order:2,
                'float':'none',
                'background-color':'#f4f4f4',
                cursor:'pointer',
                //{*1*}for: ie6 double margin bug
                display:linb.browser.ie6?'block':null
            },

            CHART:{
                'float':'right'
            },
            CLEAR:{
                clear:'both',
                'text-align':'right'
            },
            'BAR, BARI':{
                width:'150px',
                height:'12px',
                border:0,
                'line-height':0,
                'font-size':0
            },
            BAR:{
                'margin-left':'2px',
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -130px -190px', null, 'linb.UI.Public')
            },
            BARI:{
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -150px -225px ', null, 'linb.UI.Public')
            },
            'MARK, MARK2' : {
               cursor:'pointer',
               width:'16px',
               height:'16px',
               'margin-right':'6px'
            },
            MARK:{
               background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -144px top', null, 'linb.UI.Public')
            },
           'ITEM-mouseover MARK':{
                $order:1,
                'background-position':' -144px -17px'
           },
           'ITEM-mousedown MARK':{
                $order:2,
                'background-position':' -144px -34px'
           },
           'ITEM-checked MARK':{
                $order:3,
                'background-position':' -128px top'
           },
           'ITEM-checked-mouseover MARK':{
                $order:4,
                'background-position':' -128px -17px'
           },
           'ITEM-checked-mousedown MARK':{
                $order:5,
                'background-position':' -128px -34px'
            },
            MARK2:{
               background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -112px top', null, 'linb.UI.Public')
            },
           'ITEM-mouseover MARK2':{
                $order:1,
                'background-position':' -112px -17px'
           },
           'ITEM-mousedown MARK2':{
                $order:2,
                'background-position':' -112px -34px'
           },
           'ITEM-checked MARK2':{
                $order:3,
                'background-position':' -96px top'
           },
           'ITEM-checked-mouseover MARK2':{
                $order:4,
                'background-position':' -96px -17px'
           },
           'ITEM-checked-mousedown MARK2':{
                $order:5,
                'background-position':' -96px -34px'
            },
            DEL:{
                margin:'0 0 0 4px'
            }
        }},
        DataModel:{
            title:{
                ini:'',
                action:function(v){
                    this.getSubNode('TITLE').html(v);
                }
            },
            multiSel:{
                ini:false,
                action:function(){
                    this.boxing().refresh();
                }
            },
            cmds:{
                ini:null
            },
            delText:'remove',
            editable:false,
            newOption:'',
            inlineEditor:'ComboInput',
            type:'none'
        },
        EventHandlers:{
            beforeDirtyMark:function(profile, flag){},
            onItemSelected:function(profile, item, src){},
            beforeTitleChanged:function(profile, v){},
            beforeItemAdded:function(profile, v){},
            beforeItemRemoved:function(profile, item){},
            beforeItemChanged:function(profile, item, v){},
            onCommand:function(profile, key, src){}
        },
        dynamicTemplate:function(profile){
            var properties = profile.properties;
            var hash = profile._exhash = "$" +
                'multiSel:'+properties.multiSel+';',
                tid=profile.template._id,
                template = profile.box.getTemplate(tid, hash)
            ;
            properties.$UIvalue = properties.value;

            // set template dynamic
            if(!template){
                template = _.clone(profile.box.getTemplate(tid));
                if(properties.multiSel){
                    template.$dynamic.items.ITEM.OPTION.MARK2={};
                    delete template.$dynamic.items.ITEM.OPTION.MARK;
                }
                // set template
                profile.box.setTemplate(tid, template, hash);
            }
            profile.template = template;
        },
        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);
            var p=profile.properties;
            if(p.editable)
                profile.data._cls = profile.getClass('EDIT');

            var cmds = p.cmds, o;
            if(cmds && cmds.length){
                var sid=linb.UI.subSerialIdTag,a;
                a=profile.data.cmds=[];
                for(var i=0,t=cmds,l=t.length;i<l;i++){
                    o=linb.UI.copyItem(t[i]);
                    a.push(o);
                    o._tabindex=p.tabindex;
                    o[sid]=o.id;
                }
            }
        },
        prepareItems:function(profile, arr, pid){
            var a=arr,b=profile.properties.newOption;
            if(!profile.prepared){
                if(profile.properties.editable || b){
                    a=arr.copy();
                    a.push({
                        id:'$custom',
                        editable:true,
                        caption:b||'new'
                    })
                }
            }
            return arguments.callee.upper.apply(this, [profile, a, pid]);
        },
        prepareItem:function(profile, item){
            var p = profile.properties, f=profile.CF;
            item._tabindex = p.tabindex;

            if(typeof f.formatCaption == 'function')
                item.caption = f.formatCaption(item.caption);

            if(item.id!='$custom'){
                item._display='';
                item.percent = parseFloat(item.percent)||0;
                if(item.percent<0)item.percent=0;
                if(item.percent>1)item.percent=1;
                item._per = 150*(1-item.percent);
            }else{
                item._display='display:none;';
                item._per = 0;
            }
            if(p.editable || item.editable)
                item._itemcls=profile.getClass('EDIT');

            if(p.editable)
                item.delText=p.delText;

            item._del = (p.editable && !item.editable)?'':'display:none;';
        }
    }
});
