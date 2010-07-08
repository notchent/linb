Class("linb.UI.RichEditor", ["linb.UI","linb.absValue"],{
    Initialize:function(){
        this.addTemplateKeys(['TOOLBARBTN']);
    },
    Instance:{
        _setCtrlValue:function(value){
            if(_.isNull(value) || !_.isDefined(value))value='';
            return this.each(function(profile){
                var doc=profile.$doc, body=doc && (doc.body||doc.documentElement);
                if(body)
                    body.innerHTML=value;
            });
        },
        _getCtrlValue:function(){
            var profile=this.get(0),
                doc=profile.$doc,
                body=doc && (doc.body||doc.documentElement);
             if(body)
                return body.innerHTML;
             return '';
        }
    },
    Static:{
        Templates:{
            tagName:'div',
            style:'{_style}',
            EDITOR:{
                tagName:'div'
            },
            POOL:{}
        },
        DataModel:{
            value:'',
            width:400,
            height:300,
            cmdList:{
                ini:'font1;font2;align;list;font4;font3;insert;clear;html',
                action:function(v){
                    var ns=this;
                    if(!ns.properties.disabled)
                        ns.box._iniToolBar(ns);
                }
            },
            disabled:{
                ini:false,
                action: function(v){
                    if(this.properties.disabled!=v)
                        this.boxing().refresh();
                }
            }
        },
        Appearances:{
            POOL:{
                position:'absolute',
                display:'none'
            },
            TOOLBARBTN:{
                background:linb.UI.$bg('toolbar.gif', 'no-repeat')
            },
            EDITOR:{
                position:'absolute',
                display:'block',
                left:0,
                top:0,
                width:'100%',
                height:'100%',
                padding:0,
                margin:0,
                border:'1px solid #648CB4',
                'background-color':'#fff',
                'z-index':'0'
            }
        },
        Behaviors:{
            onSize:linb.UI.$onSize
        },
        $cmds:{
            //font style
            font1:[
                 {id:'bold',command:'Bold',statusButton:true,imagePos:"-36px 0"},
                 {id:'italic',command:'Italic',statusButton:true,imagePos:"-108px 0"},
                 {id:'underline',command:'Underline',statusButton:true,imagePos:"-324px 0"},
                 {id:'strikethrough',command:'strikeThrough',statusButton:true,imagePos:"-252px 0"}
            ],
            font2:[
                {id:'subscript',command : 'subscript',statusButton:true,imagePos:"-270px 0"},
                {id:'superscript',command : 'superscript',statusButton:true,imagePos:"-288px 0"}
            ],
            font3:[
                {id:'forecolor',command:'custom',imagePos:"0 0"},
                {id:'bgcolor',command:'custom',imagePos:"-18px 0"}
            ],
            font4:[
                {id:'fontsize',command:'custom',caption:'$editor.fontsize',dropButton:true},
                {id:'fontname',command:'custom',caption:'$editor.fontname',dropButton:true},
                {id:'formatblock',command:'custom',caption:'$editor.formatblock',dropButton:true}
            ],
            align:[
                {id:'left',command:'justifyleft',imagePos:"-144px 0"},
                {id:'center',command:'justifycenter',imagePos:"-54px 0"},
                {id:'right',command:'justifyright',imagePos:"-216px 0"},
                {id :'justify', command : 'justifyfull',imagePos:"-126px 0"}
            ],
            list:[
                {id:'indent', command:'indent',imagePos:"-90px 0"},
                {id:'outdent',command:'outdent',imagePos:"-180px 0"},
                {id:'ol',command:'insertorderedlist',imagePos:"-162px 0"},
                {id:'ul',command:'insertunorderedlist',imagePos:"-306px 0"}
            ],
            insert:[
                {id:'hr',command:'insertHorizontalRule',imagePos:"-72px 0"},
                {id:'insertimage',command:'custom',imagePos:"-342px 0"},
                {id:'createlink',command:'custom',imagePos:"-360px 0"},
                {id:'unlink',command:'unlink',imagePos:"-378px 0"}
            ],
            clear:[
                {id:'removeformat',command:'removeformat',imagePos:"-198px 0"}
            ],
            html:[
                {id:'html',command:'custom', imagePos:"-234px 0"}
            ]
        },
        _updateToolbar:function(domId, clear){
            var profile=linb.$cache.profileMap[domId],toolbar;
            if(profile.properties.disabled || profile.properties.readonly)return;

            if(profile && (toolbar=profile.$toolbar)){
                var doc=profile.$doc,
                    bold=clear?false:doc.queryCommandState('bold'),
                    italic=clear?false:doc.queryCommandState('italic'),
                    underline=clear?false:doc.queryCommandState('underline'),
                    strikethrough=clear?false:doc.queryCommandState('strikethrough'),
                    subscript=clear?false:doc.queryCommandState('subscript'),
                    superscript=clear?false:doc.queryCommandState('superscript'),

                    tb=toolbar.boxing();

                tb.updateItem('bold',{value:bold})
                tb.updateItem('italic', {value:italic})
                tb.updateItem('underline', {value:underline})
                tb.updateItem('strikethrough', {value:strikethrough})
                tb.updateItem('subscript', {value:subscript})
                tb.updateItem('superscript', {value:superscript})

                doc=null;
            }
        },
        RenderTrigger:function(){
            var self=this;

            if(!self.properties.disabled)
                self.box._iniToolBar(self);

            if(!self.$inDesign){
                var div=self.getSubNode('EDITOR').get(0),
                    domId=self.$domId,
                    id=div.id,
                    iframe=document.createElement("iframe"),
                    //_updateToolbar event
                    event=self._event=function(e){
                        if(this._pro && this._pro.properties.disabled)return;

                        _.resetRun('RichEditor:'+domId, function(){
                            linb.UI.RichEditor._updateToolbar(domId)
                        },100);

                        //for BlurTrigger
                        if(e.type=='mousedown')
                            linb.doc.onMousedown(true);
                    },
                    gekfix=self._gekfix=function(e){
                        // to fix firefox appendChid's bug: refresh iframe's document
                        if(this._pro)
                            this._pro.boxing().refresh();
                    },
                    doc,win,
                    checkF = function(){
                        if(!frames[id])return false;
                        if(frames[id].document!=doc || doc.readyState=='complete'){
                            win=self.$win=frames[id];

                            self.$doc=doc=frames[id].document;

                            doc.open();
                            doc.write('<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><style type="text/css">body{border:0;margin:0;padding:0;margin:0;cursor:text;background:#fff;color:#000;padding:3px;}p{margin:0;padding:0;} div{margin:0;padding:0;}</style></head><body>'+self.properties.value+'</body></html>');
                            doc.close();

                            try{doc.execCommand("styleWithCSS", 0, false)}catch(e){
                                try {doc.execCommand("useCSS", 0, true)}catch(e){}
                            }

                            var disabled=self.properties.disabled;

                            if (doc.body.contentEditable != undefined && linb.browser.ie)
                               doc.body.contentEditable = disabled?"false":"true";
                            else
                               doc.designMode=disabled?"off":"on";

                            doc._pro=win._pro=self;

                            if(linb.browser.ie){
                                doc.attachEvent("unload",gekfix);
                                
                                if(!disabled){
                                    doc.attachEvent("onmousedown",event);
                                    doc.attachEvent("ondblclick",event);
                                    doc.attachEvent("onclick",event);
                                    doc.attachEvent("onkeyup",event);
                                    doc.attachEvent("onkeydown",event);
                                    self.$beforeDestroy=function(){
                                        var win=this.$win,
                                            doc=this.$doc,
                                            event=this._event;
                                            
                                        doc._pro=win._pro=undefined;

                                        doc.detachEvent("unload",gekfix);

                                        if(!this.properties.disabled){
                                            doc.detachEvent("onmousedown",event);
                                            doc.detachEvent("ondblclick",event);
                                            doc.detachEvent("onclick",event);
                                            doc.detachEvent("onkeyup",event);
                                            doc.detachEvent("onkeydown",event);
                                        }
                                        win=doc=event=null;
                                    }
                                }
                            }else{
                                win.addEventListener("unload",gekfix,false);

                                if(!disabled){
                                    doc.addEventListener("mousedown",event,false);
                                    doc.addEventListener("dblclick",event,false);
                                    doc.addEventListener("click",event,false);
                                    doc.addEventListener("keyup",event,false);
                                    if(linb.browser.gek)
                                        doc.addEventListener("keypress",event,false);
                                    else
                                        doc.addEventListener("keydown",event,false);
                                }

                                //don't ues $ondestory, opera will set doc to null
                                self.$beforeDestroy=function(){
                                    var win=this.$win,
                                        doc=this.$doc,
                                        event=this._event,
                                        gekfix=this._gekfix;

                                    doc._pro=win._pro=undefined;

                                    //for firefox
                                    if(linb.browser.gek)
                                        delete frames[this.$frameId];

                                    win.removeEventListener("unload",gekfix,false);

                                    if(!this.properties.disabled){
                                        doc.removeEventListener("mousedown",event,false);
                                        doc.removeEventListener("dblclick",event,false);
                                        doc.removeEventListener("click",event,false);
                                        doc.removeEventListener("keyup",event,false);
                                        if(linb.browser.gek)
                                            doc.removeEventListener("keypress",event,false);
                                        else
                                            doc.removeEventListener("keydown",event,false);
                                    }
                                    gekfix=event=win=doc=null;
                                }
                            }

                            iframe.style.visibility='';

                            event=self=checkF=doc=null;

                            return false;
                        }
                    };
                self.$frameId=id;
                iframe.id=iframe.name=id;
                iframe.className=div.className;
                iframe.src="javascript:false;";
                iframe.frameBorder=0;
                iframe.border=0;
                iframe.marginWidth=0;
                iframe.marginHeight=0;
                iframe.tabIndex=-1;
                iframe.allowTransparency="allowtransparency";
                iframe.style.visibility='hidden';

                //replace the original one
                linb.$cache.domPurgeData[iframe.$linbid=div.$linbid].element=iframe;
                div.parentNode.replaceChild(iframe,div);

                doc=frames[frames.length-1].document;

                linb.Thread.repeat(checkF,50);
                div=null;
            }
        },
        _clearPool:function(profile){
            profile.getSubNode('POOL').empty();
            profile.$colorPicker=profile.$fontsizeList=profile.$fontnameList=profile.$formatblockList=profile.$htmlEditor=null;
        },
        _iniToolBar:function(profile){
            var self=profile,
                pro=self.properties;
            if(self.$toolbar)
                self.$toolbar.boxing().destroy();

            var t,v,o,items=[],
                imageClass=self.getClass('TOOLBARBTN'),
                arr=pro.cmdList.split(';'),
                h={};
            _.arr.each(arr,function(i){
                //filter
                if((o=self.box.$cmds[i]) && !h[i]){
                    h[i]=1;
                    items.push({id:i,sub:o});
                    _.arr.each(o,function(v){
                        if(v.imagePos)
                            v.imageClass=imageClass;
                        v.tips=linb.wrapRes('editor.'+v.id);
                    });
                }
            });

            //compose
            self.getRoot().prepend(
                t=new linb.UI.ToolBar({handler:false,items:items,disabled:pro.disabled})
            );
            t.render(true);
            t = self._$tb = t.get(0);

            t.onClick=self.box._toolbarclick;
            v=self._$composed={};
            v[t.$linbid]=t;
            self.$toolbar=t;
            t.$hostage=self;

            linb.UI.$tryResize(profile, pro.width, pro.height,true);
        },
        _toolbarclick:function(profile,item,group,e,src){
            var editor=profile.$hostage;
            if(!editor.$doc)return;

            var pro=editor.properties;
            editor.$win.focus();

            if(item.command=='custom'){
                var cmd=item.id,
                    o,_clear,node,
                    items, items2;

                //get the pop control
                switch(cmd){
                    case 'forecolor':
                    case 'bgcolor':
                        if(!editor.$colorPicker)
                            editor.$colorPicker=(new linb.UI.ColorPicker({barDisplay:false})).render(true);
                        o=editor.$colorPicker;
                        break;
                    case 'fontsize':
                    case 'fontname':
                    case 'formatblock':
                        //if lang was changed, clear the pool first
                        if(editor.$lang!=linb.getLang())
                            editor.box._clearPool(editor);
                        editor.$lang=linb.getLang();

                        //font size
                        if(cmd=='fontsize'){
                            if(!editor.$fontsizeList){
                                items = linb.getRes('editor.fontsizeList');
                                items = items.split(';');
                                items2=[];
                                var t;
                                _.arr.each(items,function(o){
                                    o=o.split(',');
                                    t=o[0]=='...'?'1':o[0];
                                    items2.push({id:o[0], caption:'<font size="'+o[0]+'" '+linb.IEUNSELECTABLE+'>'+o[1]+'</font>'});
                                });
                                editor.$fontsizeList=(new linb.UI.List({height:'auto',items:items2,width:150})).render(true);
                            }
                            o=editor.$fontsizeList;
                        //font family
                        }else if(cmd=='fontname'){
                            if(!editor.$fontnameList){
                                items = linb.getRes('editor.fontnameList');
                                items = items.split(';');
                                items2=[];
                                var t;
                                _.arr.each(items,function(o){
                                    t=o=='...'?'':o;
                                    items2.push({id:o, caption:'<span style="font-family:'+o+'" '+linb.IEUNSELECTABLE+'>'+o+'</span>'});
                                });
                                editor.$fontnameList=(new linb.UI.List({height:'auto',items:items2})).render(true);
                            }
                            o=editor.$fontnameList;
                        //font format
                        }else if(cmd=='formatblock'){
                            if(!editor.$formatblockList){
                                items = linb.getRes('editor.formatblockList');
                                items = items.split(';');
                                items2=[];
                                var t;
                                _.arr.each(items,function(o){
                                    o=o.split(',');
                                    t=o[0]=='...'?'span':o[0];
                                    items2.push({id:o[0], caption:'<'+t+' style="display:inline;padding:0;margin:0" '+linb.IEUNSELECTABLE+'>'+o[1]+'</'+t+'>'});
                                });

                                editor.$formatblockList=(new linb.UI.List({height:'auto',items:items2})).render(true);
                            }
                            o=editor.$formatblockList;
                        }
                        break;
                    case 'html':
                        if(!editor.$htmlEditor){
                            editor.$htmlEditor=new linb.UI.Input({multiLines:true,width:400,height:300,resizer:true});
                        }
                        o=editor.$htmlEditor;
                        break;
                }
                //pop the control and set clear funciton
                if(o){
                    _clear=function(){
                        o.beforeUIValueSet(null);
                        editor.getSubNode('POOL').append(o.getRoot());
                        node.setBlurTrigger(editor.$linbid);
                        linb.Event.keyboardHook('esc');
                        _.asyRun(function(){
                            editor.$win.focus()
                        });
                    };

                    o.setValue('',true);
                    node=o.reBoxing();
                    node.popToTop(src);
                    _.tryF(o.activate,[],o);

                    //for on blur disappear
                    node.setBlurTrigger(editor.$linbid, function(){
                        //force to trigger beforeUIValueSet event
                        if(o==editor.$htmlEditor)
                            o.setUIValue(o._getCtrlValue());

                         _clear();
                    });
                    //for esc
                    linb.Event.keyboardHook('esc',0,0,0,function(){
                        _clear();
                    });
                }
                //set beforeUIValueSet function
                switch(cmd){
                    case 'forecolor':
                    case 'bgcolor':
                        o.beforeUIValueSet(function(p,o,v){
                            _clear();
                            var doc=editor.$doc;
                            if(cmd=='bgcolor' && linb.browser.gek){
                                doc.execCommand('useCSS',0,false);
                                doc.execCommand('hilitecolor',false, '#'+v);
                                doc.execCommand('useCSS',0,true);
                            }else{
                                if(cmd=='bgcolor')
                                    cmd=linb.browser.opr?'hilitecolor':'backcolor';
                                doc.execCommand(cmd,false, linb.browser.kde?('#'+v):v)  ;
                            }
                            doc=null;
                            return false;
                        });
                        break;
                    case 'fontsize':
                    case 'fontname':
                    case 'formatblock':
                        o.beforeUIValueSet(function(p,o,v){
                            _clear();
                            //store range for IE
                            if(linb.browser.ie && (v=='...' ||cmd=='formatblock' )){
                                var selection=editor.$doc.selection,
                                    range=selection?selection.createRange():null;
                                if(range && range.parentElement().ownerDocument!=editor.$doc)
                                    range=selection=null;
                            }
                            var f=function(cmd,v){
                                    var doc=editor.$doc;

                                    //for formatblock in IE
                                    //reset range for IE
                                    if(range){
                                        editor.$win.focus();
                                        if(cmd=='formatblock' && v){
                                            var p=range.parentElement(),html;
                                            if(p.ownerDocument==doc){
                                                if(/^\s*</.test(range.htmlText)){
                                                    //affect the first block only
                                                    range.collapse(true);
                                                    p=range.parentElement();
                                                    if(p.tagName=='BODY'){
                                                        html=p.innerHTML;
                                                        p.innerHTML = "<"+v+">"+html+"</"+v+">"
                                                    }else{
                                                        html=p.outerHTML;
                                                        html=html.replace(/\<[\w]+/,'<'+v).replace(/[\w]+\>$/,v+'>');
                                                        p.outerHTML=html;
                                                    }
                                                }else{
                                                    range.pasteHTML("<"+v+">"+range.htmlText+"</"+v+">")
                                                }
                                            }
                                            p=null;
                                        }
                                        range.select();
                                        selection=range=null;
                                    }

                                    doc.execCommand(cmd,false,v);
                                    doc=null;
                                };
                            if(v=='...'){
                                var str=linb.getRes('editor.'+cmd);
                                linb.UI.Dialog.prompt(str,str,"",function(v){
                                    if(v){
                                        f(cmd,v);
                                    }
                                },function(){
                                    //reset range for IE
                                    if(linb.browser.ie){
                                        if(range){
                                            editor.$win.focus();
                                            range.select();
                                        }
                                        selection=range=null
                                    }
                                });
                            }else
                                f(cmd,v);
                        });
                        break;
                    case 'insertimage':
                    case 'createlink':
                        var str=linb.getRes('editor.'+cmd),
                            str2=linb.getRes('editor.'+cmd+'2');
                        //store range for IE
                        if(linb.browser.ie){
                            var selection=editor.$doc.selection,
                                range=selection?selection.createRange():null;
                                if(range && range.parentElement().ownerDocument!=editor.$doc)
                                    range=selection=null;
                        }
                        linb.UI.Dialog.prompt(str,str2,"http:/"+'/',function(v){
                            //reset range for IE
                            if(linb.browser.ie){
                                if(range){
                                    editor.$win.focus();
                                    range.select();
                                }
                                selection=range=null
                            }
                            if(v){
                                var doc=editor.$doc;
                                doc.execCommand(cmd,false,v);
                                doc=null;
                            }
                        },function(){
                            //reset range for IE
                            if(linb.browser.ie){
                                if(range){
                                    editor.$win.focus();
                                    range.select();
                                }
                                selection=range=null
                            }
                        });
                        break;
                     case 'html':
                         o.setValue(editor.boxing().getUIValue(),true);
                         o.beforeUIValueSet(function(p,o,v){
                            _clear();
                            editor.boxing().setUIValue(v);
                        });
                        break;
                }
            }else{
                editor.$doc.execCommand(item.command,false,item.commandArgs);

                if(item.id=='removeformat')
                    linb.UI.RichEditor._updateToolbar(editor.$domId,true)
            }
        },
        _ensureValue:function(profile, value){
            var p=linb.$getGhostDiv();
            p.innerHTML=value;
            v=p.innerHTML;
            p=null;
            return v;
        },
        _onresize:function(profile,width,height){
            var size={};
            if(width)
                size.width=width-2;
            if(size.width<0)
                size.width=0;

            if(width || height){
                var itb=profile._$tb,
                    _top=(itb?(itb.getRoot().offsetHeight()-1):0);
                if(!height)
                    height=profile.properties.height;
                size.height=height-_top-1;
                if(size.height<0)
                    size.height=0;
            }
            profile.getSubNode('EDITOR').top(_top).cssSize(size,true);
        }
    }
});

