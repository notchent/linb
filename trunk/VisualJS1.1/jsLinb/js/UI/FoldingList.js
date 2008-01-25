Class("linb.UI.FoldingList", ["linb.UI.List"],{
    Instance:{
        fillDetail:function(item, obj){
            var profile=this.get(0);
            profile.getSubNodeByItemId('BODYI',item.id).html('',false).attach(item._obj = obj);
        }
    },
    Initialize:function(){
        //modify default template fro shell
        var t = this.getTemplate('default');
        t.$dynamic={
            items:{
                ITEM:{
                    tagName : 'div',
                    className:'{_checked} {_precheked}',
                    HEAD:{
                        tagName : 'div',
                        HL:{tagName : 'div'},
                        HR:{tagName : 'div'},
                        TITLE:{
                            tagName : 'a',
                            href:'javascript:;',
                            TLEFT:{
                                $order:0,
                                tagName:'div',
                                MARK:{$order:0},
                                CAP1:{
                                    $order:1,
                                    text:'{title}'
                                }
                            },
                            TRIGHT:{
                                $order:1,
                                tagName:'div',
                                CAP2:{
                                    $order:0,
                                    text:'{caption}'
                                },
                                OPT:{
                                    $order:1,
                                    style:'{_opt}'
                                }
                            },
                            TCLEAR:{
                                $order:2,
                                tagName:'div'
                            }
                        }
                    },
                    BODY:{
                        $order:1,
                        tagName : 'div',
                        BODYI:{
                            $order:0,
                            tagName : 'div',
                            text:'{_body}'
                        },
                        CMDS:{
                            $order:1,
                            tagName : 'div',
                            text:"{cmds}"
                        }
                    },
                    TAIL:{
                        $order:4,
                        tagName : 'div',
                        TL:{tagName : 'div'},
                        TR:{tagName : 'div'}
                    }
                }
            },
            'items.cmds':{
                $order:2,
                CMD:{
                    //tagName:'button',
                    tagName:'a',
                    href:'javascript:;',
                    text:'{caption}'
                }
            }
        };
        this.setTemplate('default',t);
    },
    Static:{
        Appearances:{'default':{
            KEY:{
                padding:'2px'
            },
            ITEMS:{
                border:0,
                'padding-top':'8px',
                position:'relative',
                //for ie6 1px bug,  HR/TR(position:absolute;right:0;)
                'margin-right':linb.browser.ie6?'expression((this.parentNode.offsetWidth-(parseInt(this.parentNode.style.paddingLeft)||0)-(parseInt(this.parentNode.style.paddingRight)||0) )%2+"px")':null
            },
            'ITEM-mouseover':{},
            ITEM:{
                border:0,
                //for ie6 bug
                zoom:linb.browser.ie?1:null,
                'margin-top':'-9px',
                padding:0,
                background:'#FFF',
                'font-family': '"Verdana", "Helvetica", "sans-serif"',
                position:'relative'
            },
            'HEAD, BODY, BODYI, TAIL':{
                position:'relative'
            },
            MARK:{
                position:'relative',
                margin:'0 2px 3px 0',
                width:'15px',
                height:'15px',
                'vertical-align': 'middle',
                cursor:'default',
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -161px top', null, 'linb.UI.Public')
            },
            'ITEM-mouseover MARK':{
                $order:2,
                'background-position': '-161px -15px'
            },
            'ITEM-mousedown MARK':{
                $order:3,
                'background-position': '-161px -30px'
            },
            'ITEM-checked MARK':{
                $order:4,
                'background-position': '-176px top'
            },
            'ITEM-checked-mouseover MARK':{
                $order:5,
                'background-position': '-176px -15px'
            },
            'ITEM-checked-mousedown MARK':{
                $order:6,
                'background-position': '-176px -30px'
            },

            CMDS:{
                padding:'2px 8px 4px 14px',
                'font-size':'81%',
                'font-weight':'bold',
                position:'relative',
                background: linb.UI.getCSSImgPara('l.gif', 'repeat-y left top #EEE')
            },
            CMD:{
                margin:'2px 4px 2px 4px'
            },
            BODY:{
                display:'none',
                'border-right': 'solid 1px #CCC',
                zoom:linb.browser.ie?1:null,
                position:'relative',
                background: linb.UI.getCSSImgPara('l.gif', 'repeat-y left top')
            },
            BODYI:{
                padding:'2px 8px 0 8px',
                background: linb.UI.getCSSImgPara('l.gif', 'repeat-y left top'),
                position:'relative'
            },
            'ITEM-checked':{
                $order:2,
                'margin-bottom':'12px'
             },
            'ITEM-checked BODY':{
                $order:2,
                display:'block'
            },
            'HL, HR, TL, TR':{
                position:'absolute',
                '_font-size':0,
                '_line-height':0,
                width:'8px'
            },
            'HL, HR':{
                height:'30px'
            },
            'ITEM-prechecked HL':{
                'background-position': 'left top'
            },
            'ITEM-prechecked HR':{
                'background-position': 'right top'
            },
            'TL, TR':{
                height:'20px'
            },
            HL:{
                top:0,
                left:0,
                background: linb.UI.getCSSImgPara('corner.gif', ' no-repeat left -37px')
            },
            HR:{
                top:0,
                right:0,
                background: linb.UI.getCSSImgPara('corner.gif', ' no-repeat right -37px')
            },
            TL:{
                bottom:0,
                left:0,
                background: linb.UI.getCSSImgPara('corner.gif', ' no-repeat left bottom')
            },
            TR:{
                bottom:0,
                right:0,
                background: linb.UI.getCSSImgPara('corner.gif', ' no-repeat right bottom')
            },
            HEAD:{
                position:'relative',
                zoom:linb.browser.ie?1:null,
                background: linb.UI.getCSSImgPara('t.gif', 'repeat-x left top')
            },
            'TITLE':{
                $order:1,
                display:'block',
                position:'relative',
                padding:'4px 0 0 6px'
            },
            TAIL:{
                '_font-size':0,
                '_line-height':0,
                position:'relative',
                height:'5px',
                background: linb.UI.getCSSImgPara('b.gif', ' repeat-x left bottom #EEE')
            },
            'CAP1, CAP2':{
                padding:'3px'
            },
            CAP1:{
                color:'#666',
                'white-space':'nowrap',
            	font: 'bold 12px arial,sans-serif;',
            	color: '#00681C'
            },
            'ITEM-checked CAP1':{
                $order:2,
                'font-weight':'normal'
            },
            TLEFT:{
                position:linb.browser.ie6?'relative':null,
                'float':'left'
            },
            TRIGHT:{
                position:linb.browser.ie6?'relative':null,
                'float':'right'
            },
            OPT:{
                margin:'0 3px 3px 2px',
                width:'15px',
                height:'15px',
                'vertical-align': 'middle',
                cursor:'default',
                background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -240px top', null, 'linb.UI.Public')
            },
            'OPT-mouseover':{
                $order:2,
                'background-position': '-240px -16px'
            },
            'OPT-mousedown':{
                $order:3,
                'background-position': '-240px -32px'
            },
            TCLEAR:{
                clear:'both'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{ITEM:'ITEM',OPT:'OPT'},
            ITEMS:{},
            ITEM:{},
            HEAD:{
                onClick:function(profile, e, src){
                    return profile.box.cancelLink(e);
                },
                onMousedown:function(profile, e, src){
                    var properties = profile.properties,
                        items=properties.items,
                        item = profile.getItemByDom(src),
                        itemId = profile.getSubSerialId(src.id),
                        node = profile.getSubNode('ITEM',itemId),
                        nodenext = node.next()
                        ;
                    if(item._show){
                        if(properties.activeLast && items.length){
                            if(items[items.length-1].id==item.id)
                                return false;
                        }

                        profile.removeTagClass('ITEM', '-checked', node);
                        if(nodenext)
                            profile.removeTagClass('ITEM', '-prechecked',nodenext);
                    }else{
                        profile.addTagClass('ITEM', '-checked', node);
                        if(nodenext)
                            profile.addTagClass('ITEM', '-prechecked',nodenext);
                    }

                    //fill value
                    if(!item._fill){
                        item._fill=true;
                        item._body = profile.onBuildBody ? profile.boxing().onBuildBody(profile, item) : profile.box.buildBody(profile, item);
                        if(item._body)
                            profile.getSubNode('BODYI',itemId).html(item._body, false);
                    }

                    item._show=!item._show;

                    //prevent href default action
                    //return false;
                }
            },
            CMD:{
                onClick:function(profile,e,src){
                    if(profile.onCommand)
                        profile.boxing().onCommand(profile,profile.getItemByDom(src),src.id.split('_')[1],src);

                    return false;
                }
            },
            OPT:{
                onMousedown:function(profile, e, src){
                    if(profile.onOptions)
                        profile.boxing().onOptions(profile,profile.getItemByDom(src),src);
                    return false;
                }
            }
        }},
        DataModel:({
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode('HEAD',true).tabIndex(value);
                }
            },
            cmds:{
                ini:[]
            },
            optBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('OPT').display(v?'':'none');
                }
            },
            activeLast:false
        }),
        EventHandlers:{
            onBuildBody:function(profile,item){},
            onCommand:function(profile,item,cmdkey,src){},
            onOptions:function(profile,item,src){}
        },
        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);
        },
        prepareItems:function(profile, arr, pid){
            if(arr.length){
                arr[0]._precheked = profile.getClass('ITEM','-prechecked');
                if(profile.properties.activeLast){
                    //for properties.data
                    var item = arr[arr.length-1];
                    item._show = true;
                    item._fill = true;
                    item._body = profile.onBuildBody?profile.boxing().onBuildBody(profile,item) : profile.box.buildBody(profile, item);
                }
            }
            return arguments.callee.upper.apply(this, arguments);
        },
        prepareItem:function(profile, item){
            var p = profile.properties,o;
            item._tabindex = p.tabindex;
            item.caption = (item.caption||"").replace(/</g,"&lt;");
            item._opt = p.optBt?'':'display:none';
            item._body= item._body || 'Loading...'

            if(item._show)
                item._checked = profile.getClass('ITEM','-checked');
            var cmds = item.cmds || p.cmds;
            if(cmds && cmds.length){
                var sid=linb.UI.subSerialIdTag,a;
                a=item.cmds=[];
                for(var i=0,t=cmds,l=t.length;i<l;i++){
                    o=linb.UI.copyItem(t[i]);
                    a.push(o);
                    o[sid]=item[sid] + '_' + o.id;
                }
            }
        },
        buildBody:function(profile,item){
            return item.text?'<pre>'+item.text.replace(/</g,"&lt;")+'</pre>':'';
        }
    }
});
