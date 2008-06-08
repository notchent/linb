Class("linb.UI.Input", ["linb.UI.Widget", "linb.UI.iForm"],{
    Instance:{  
        _setTB:function(type){
            var profile=this.get(0), p=profile.properties, o, t;
            if(!profile.host|| !p.tipsBinder)return;

            t = profile.tips = profile.tips||p.tips||'';
            o = profile.host[p.tipsBinder];
            if(o && o.KEY=='linb.UI.Div'){
                //use innerHTML, not setHtml
                o.get(0).domNode.innerHTML =  t.charAt(0)=='$'?linb.wrapRes(t):t;
                o.reBoxing().setStyle('color', type==1?'gray':type==2?'red':'#000');
            }
        },
        activate:function(){
            var profile = this.get(0);
            if(profile.domNode)
                profile.getSubNode('INPUT').activate();
            return this;
        },
        disabled:function(value){
            arguments.callee.upper.call(this,value);
            return this.each(function(o){
                o.getSubNode('INPUT').readonly(value);
            })
        },
        setCtrlValue:function(value){
            if(_.isNull(value) || !_.exists(value))value='';
            return this.each(function(profile){
                profile.getSubNode('INPUT').value(value.toString());
            });
        },
        getCtrlValue:function(){
            var profile=this.get(0);
            return profile.getSubNode('INPUT').value();
        },
        setDirtyMark:function(){
            return this.each(function(profile){
                var properties = profile.properties,
                    o=profile.getSubNode('INPUT'),
                    cls=profile.box,
                    box=profile.boxing(),
                    d=linb.UI.$css_tag_dirty,
                    v=linb.UI.$css_tag_invalid,
                    flag=properties.value !== properties.$UIvalue;
                //dirty mark
                if(profile.beforeDirtyMark && false===box.beforeDirtyMark(profile,flag)){}
                else{
                    if(flag)
                        o.addClass(d);
                    else
                        o.removeClass(d);
                }
                //format statux
                if(profile.beforeFormatMark && false===box.beforeFormatMark(profile)){}
                else{
                    //
                    //valid mark
                    //
                    //bg
                    var err = profile.getSubNode('ERROR'),p=profile.properties;

                    if(profile.inValid==2){
                        //bg to input
                        o.addClass(v);
                        //display icon
                        err.display('block');

                        //display tips
                        profile.tips = p.tipsErr || p.tips;
                        
                        if(properties.mask)
                            _.asyRun(function(){
                                box.updateUIValue(o.get(0).value=profile.$Mask)
                            });
                    }else{
                        o.removeClass(v);
                        err.display('none');

                        if(profile.inValid==1)
                            profile.tips = p.tips;
                        else{
                            profile.tips = p.tipsOK || p.tips;
                        }
                    }
                    box._setTB(profile.inValid);
                }
            });
        },
        readonly:function(value){
            return this.each(function(profile){
                profile.getSubNode('INPUT').readonly(value);
            });
        },
        fireChangeEvent:function(){
            var profile=this.get(0);
            profile.getSubNode('INPUT').onChange();
        }
    },
    Initialize:function(){
        //modify default template fro shell
        var t = this.getTemplate('default');
        _.merge(t.FRAME.BORDER,{
            BOX:{
                tagName : 'div',
                INPUT:{
                    tagName : 'input',
                    type : '{type}',
                    value:'{value}',
                    tabindex:'{tabindex}',
                    cursor:'{cursor}'
                }
            }
        },'all');
        t.FRAME.ERROR = {};
        this.setTemplate('default',t)
    },
    Static:{
        _maskMap:{
            '~':'[+-]',
    		'1':'[0-9]',
    		'a':'[A-Za-z]',
    		'*':'[A-Za-z0-9]'            
        },
        _maskSpace:'_',              
        Appearances:{'default':{
            KEY:{
                'font-family': '"Verdana", "Helvetica", "sans-serif"',
                cursor:'pointer',
                overflow:'hidden'
            },
            BORDER:{
                'line-height':'0px',
                'font-size':'0px',
                'background-color':'#fff',
                border: '1px solid #7F9DB9'
            },
            'BORDER-focus, BORDER-mouseover':{
                $order:1,
                border: '1px solid #FFD700'
            },
            BOX:{
                //for firefox bug: cursor not show
                position:'absolute',
               'z-index':'10',
                left:0,
                top:0,
                overflow:linb.browser.gek?'auto':''
            },
            INPUT:{
               border:0,
               padding:0,
               margin:0,
               'font-size':'12px',
               position:'relative',
               overflow:'auto',
               'overflow-y':(linb.browser.gek||linb.browser.ie)?'auto':'',
               'overflow-x':(linb.browser.gek||linb.browser.ie)?'hidden':''
            },
            ERROR:{
                width:'16px',
                height:'16px',
                position:'absolute',
                right:0,
                top:0,
                display:'none',
                'font-size':0,
                background: linb.UI.getCSSImgPara('icon.gif', ' no-repeat left top', null, 'linb.UI.Public'),
                'z-index':'50'
            }
        }},
        Behaviors:{'default':{
            _focusEffect:{INPUT:1},
            _hoverEffect:{KEY:['BORDER']},
            _focusHook:{INPUT:1},
            INPUT:{
                onChange:function(profile, e, src){
                    var o=profile.inValid;
                    profile.boxing().updateUIValue(src.value);
                    //input/textarea is special
                    profile.properties.$UIvalue=src.value;
                    if(o!==profile.inValid) if(profile.domNode)profile.boxing().setDirtyMark();
                },
                //if properties.mask exists, onHotKeyxxx wont be tigger any more
                onKeydown:function(profile, e, src){
                    var p=profile.properties;
                    if(p.mask){
                        var evt=linb.event,
                            k=evt.getKey(e);
                        if(k[0].length>1)profile.$ignore=true;
                        else delete profile.$ignore;
                        switch(k[0]){
                            case 'backspace':
                                profile.box.changeMask(profile,src,'',false);
                                return false;
                            case 'delete':
                                profile.box.changeMask(profile,src,'');
                                return false;
                        }
                    }
                },
                onKeypress:function(profile, e, src){
                    var p=profile.properties,cls=profile.box,map=cls._maskMap;
                    if(p.mask){
                        if(profile.$ignore){
                            delete profile.$ignore;
                            return true;
                        }
                        var evt=linb.event,
                            k=evt.getKey(e);
                        if(k[1]||k[3])return true;

                        profile.box.changeMask(profile,src,k[0],true);
                        return false;
                    }
                },
                onKeyup:function(profile, e, src){
                    var p=profile.properties;
                    if(p.dynCheck){
                        if(p.$UIvalue!=src.value)
                            profile.box.checkValid(profile, src.value);
                        profile.boxing().setDirtyMark();
                    }
                },
                onFocus:function(profile, e, src){
                    var p=profile.properties,b=profile.box;
                    if(p.disabled)return false;
                    if(profile.beforeFocus && false===profile.boxing().beforeFocus(profile)){}else
                    profile.addTagClass(profile.key,'-focus',profile.getSubNode('BORDER'));
                    //if no value, add mask
                    if(p.mask){
                        if(!src.value)
                            _.asyRun(function(){
                                profile.boxing().updateUIValue(src.value=profile.$Mask);
                                b.setCaret(profile,src)
                            });
                    }
                    //show tips color
                    profile.boxing()._setTB(3);
                },
                onBlur:function(profile, e, src){
                    var p=profile.properties;
                    if(p.disabled)return false;
                    if(profile.beforeBlur && false===profile.boxing().beforeBlur(profile)){}else
                    profile.removeTagClass('KEY','-focus',profile.getSubNode('BORDER'));
                    //onblur check it
                    if(p.$UIvalue==src.value)
                        profile.box.checkValid(profile, src.value);
                    profile.boxing().setDirtyMark();
                }
            }
        }},
        DataModel:{
            icon:null,
            iconPos:null,
            caption:null,

            tipsErr:'',
            tipsOK:'',

            dynCheck:false,

            valueFormat:{
                ini:'',
                helpinput:[
                    {caption : 'required', id: "[^.*]"},
                    {caption : 'email',id:"^[\\w\\.=-]+@[\\w\\.-]+\\.[\\w\\.-]{2,4}$"},
                    {caption : 'charOnly',id:"^[a-zA-Z]*$"},
                    {caption : 'words',id:"^[\\w ]*$"},
                    {caption : 'integer',id:"^-?\\d\\d*$"},
                    {caption : 'positiveInteger',id:"^\\d\\d*$"},
                    {caption : 'number',id:"^-?(\\d\\d*\\.\\d*$)|(^-?\\d\\d*$)|(^-?\\.\\d\\d*$)"},
                    {caption : 'filepath',id:"([\\/]?[\\w_]+)+\\.\\w{1,9}$"},
                    {caption : 'URL', id:"^(http|https|ftp)\\:\\/\\/[\\w\\-\\.]+\\.[a-zA-Z]{2,3}(:[\\w]*)?\\/?([\\w\\-\\._\\?\\,\\'\\/\\\\\\+&amp;%\\$#\\=~])*$"},
                    {caption : 'color',id:"^\\#[0-9A-Fa-f]{6}$"},
                    {caption : "HH:MM", id:"^\(\([0-1][0-9]\)|\([2][0-3])\)\:\([0-5][0-9]\)$"},
                    {caption : "HH:MM:SS", id:"^\(\([0-1][0-9]\)|\([2][0-3])\)\:\([0-5][0-9]\)\\:\([0-5][0-9]\)$"},
                    {caption : "YYYY-MM-DD",id:"^\([0-9]{4}\)\\-\(\([0][0-9]\)|\([1][0-2]\)\)\\-\([0-3][0-9]\)$"},
                    {caption : "DD/MM/YYYY",id:"^\(\([0-2][0-9]\)|\([3][0-1]\)\)\/\(\([0][0-9]\)|\([1][0-2]\)\)\/\([0-9]{4}\)$"}
                ]
            },
            mask:{
                ini:'',
                action:function(value){
                    var ns=this,
                        b=ns.box;
                    if(value){
                        ns.$MaskFormat=function(ns, v){
                            var m=ns._maskMap,a=[],r=/[A-Za-z0-9]/;
                            v.split('').each(function(o,i){
                                a.push(m[o]||(r.test(o)?"":"\\")+o)
                            });	
                            return '^'+a.join('')+'$';	
                        }(b, value);                    
                        ns.$Mask = function(ns, v){
                            var m=ns._maskMap,a=[],s=ns._maskSpace;
                            v.split('').each(function(o,i){
                                a.push(m[o]?s:o);
                            });	
                            return  a.join('');
                        }(b,value);
    
                        //add event for cut/paste text
                        if(ns.domNode){
                            var ie=linb.browser.ie,
                                src=ns.getSubNode('INPUT').get(0),
                                f=function(o){
                                    //only for value in IE
                                    if(ie && o.propertyName!='value')return true;
    
                                    var src=ie?o.srcElement:this;
                                    if(src.value.length != ns.$Mask.length)
                                        ns.box.changeMask(ns,src,'',true);
                                };
                            if(ie){
                                src.attachEvent("onpropertychange",f);
                                ns.$ondestory=function(){
                                    src.detachEvent("onpropertychange",f);
                                }
                            }else{
                                src.addEventListener("input",f,false);
                                ns.$ondestory=function(){
                                    src.removeEventListener("onpropertychange",f,false);
                                }
                            }
                        }            
                   }else{
                        delete ns.$MaskFormat;
                        delete ns.$Mask;
                        if(ns.domNode)
                            _.tryF(ns.$ondestory);
                   }
                }
            },
            value:'',
            width:120,
            height:20,
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode('INPUT').tabIndex(value);
                }
            },
            readonly:{
                ini:false,
                action: function(v){
                    v = String(v).toLowerCase()!='false';
                    this.boxing().readonly(v);
                    this.root.cursor(v?'pointer':'');
                }
            },
            type:{
                ini:'text',
                listbox:['text','password'],
                action: function(value){
                    this.getSubNode('INPUT').attr('type',value);
                }
            },
            inputArea:{
                ini:'input',
                listbox:['input','textarea'],
                action: function(value){
                    var str = this.getSubNode('INPUT').outerHTML();
                    str = str.replace(/^(<)[a-zA-Z]+(\s)/i, '$1'+value+'$2');

                    var v = this.boxing().getValue();
                    this.getSubNode('INPUT').outerHTML(str);
                    this.boxing().updateUIValue(v);
                }
            },
            tipsBinder:'',

            $border:1
        },
        EventHandlers:{
            beforeFocus:function(profile){},
            beforeBlur:function(profile){},
            beforeDirtyMark:function(profile, flag){},
            onFormatCheck:function(profile, value){},
            beforeFormatMark:function(profile){}
        },
        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);
            var d=profile.data;
            d.cursor = d.readonly?'pointer':'default';
            d.type = d.type || '';
        },
        dynamicTemplate:function(profile){
            var properties = profile.properties;
            var hash = profile._exhash = "$" +
                'inputArea:'+properties.inputArea+';'+
                'readonly:'+properties.readonly+';',
                tid=profile.template._id,
                template = profile.box.getTemplate(tid, hash)
            ;

            properties.$UIvalue = properties.value;

            // set template dynamic
            if(!template){
                template = _.clone(profile.box.getTemplate(tid));
                if(properties.inputArea!='input'){
                    template.FRAME.BORDER.BOX.INPUT.tagName=properties.inputArea;
                    delete template.FRAME.BORDER.BOX.INPUT.type;
                }
                if(properties.readonly)
                    template.FRAME.BORDER.BOX.INPUT.readonly='readonly';

                // set template
                profile.box.setTemplate(tid, template, hash);
            }
            profile.template = template;
        },
        createdTrigger:function(){
            var self=this,p=self.properties;
            _.asyRun(function(){
                self.boxing()._setTB(1);
            });
        },
        renderedTrigger:function(){
            var p = this.properties;
            if(p.mask)this.boxing().setMask(p.mask,true);
        },        
    //v=value.substr(0,caret);
    //i=v.lastIndexOf(ms);
        
        changeMask:function(profile,src,v,dir){
            var ns=this,
                p=profile.properties,
                map=ns._maskMap,
                ms=ns._maskSpace,           
                maskTxt=p.mask,
                maskStr = profile.$Mask,
                input = linb([src]),
                caret = input.caret();
            //for backspace
            if(dir===false && caret[0]==caret[1] && caret[0]>0)
                input.caret(caret[0]-1,caret[0]);

            //for delete
            if(dir===undefined && caret[0]==caret[1])
                input.caret(caret[0],caret[0]+1);

            //for caret is from a fix char, nav to the next 'input allow' char
            if(dir===true){
                if(maskStr.charAt(caret[0])!=ms){
                    var from = caret[0] + maskStr.substr(caret[0],maskStr.length).indexOf(ms);
                    input.caret(from,Math.max(caret[1],from))
                }
            }
 
            var caret = input.caret(),
                value=src.value,
                reg = ns._maskMap[p.mask.charAt(caret[0])],
                i,t;
            if(reg && new RegExp('^'+reg+'$').test(v) || v==''){
                t=value;
                //if select some text
                if(caret[0]!=caret[1])
                    t=t.substr(0,caret[0]) + maskStr.substr(caret[0],caret[1]-caret[0]) + t.substr(caret[1],t.length-caret[1]);
                //if any char input
                if(v)
                    t=t.substr(0,caret[0])+v+t.substr(caret[0]+1,t.length-caret[0]-1);
                
                //get corret string according to maskTxt
                var a=[];
                maskTxt.split('').each(function(o,i){
                    a.push( (new RegExp('^'+(map[o]?map[o]:'\\'+o)+'$').test(t.charAt(i))) ? t.charAt(i) : maskStr.charAt(i))
                });
                
                //if input visible char
                if(dir===true){
                    v=maskStr.substr(caret[0]+1,value.length-caret[0]-1);
                    i=v.indexOf(ms);
                    i=caret[0] + (i==-1?0:i) + 1;      
                }else
                    i=caret[0];
                //in opera, delete/backspace cant be stopbubbled
                //add a dummy maskSpace
                if(linb.browser.opr){
                    //delete
                    if(dir===undefined)
                        a.insertAny(ms,i);
                    //backspace
                    if(dir===false)
                        a.insertAny(ms,i++);
                }                        
                profile.boxing().updateUIValue(src.value=a.join(''));
                ns.setCaret(profile,src,i);
            }

        },
        setCaret:function(profile, src, pos){
            if(profile.properties.mask){
                if(typeof pos !='number')
                    pos=src.value.indexOf(this._maskSpace);
                linb([src]).caret(pos,pos);
            }            
        },
        //check valid manually
        checkValid:function(profile, value){
            var p=profile.properties,
                vf1 = (p.mask&&profile.$MaskFormat) ,
                vf2 = p.valueFormat || profile.$valueFormat;
            if( (profile.onFormatCheck && (profile.boxing().onFormatCheck(profile, value)===false)) ||
                (vf1 && typeof vf1=='string' && !(new RegExp(vf1)).test(value||'')) ||
                (vf2 && typeof vf2=='string' && !(new RegExp(vf2)).test(value||''))
            ){
                profile.inValid=2;
                return false;
            }{
                profile.inValid=3;
                return true;
            }
        },
        resize:function(profile,w,h){
            var size = arguments.callee.upper.apply(this,arguments);
            var v = linb.dom.pack([],false).add(profile.getSubNode('INPUT')).add(profile.getSubNode('BOX'));

            if(!_.isNull(w))
                v.width(size.width);
            if(!_.isNull(h))
                v.height(size.height -(linb.browser.ie6?2:linb.browser.ie?1:linb.browser.kde?1:0));

            return size;
        }
    }
});