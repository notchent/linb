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
                onKeyup:function(profile, e, src){
                    var p=profile.properties;
                    if(p.dynCheck){
                        if(p.$UIvalue!=src.value)
                            profile.box.checkValid(profile, src.value);
                        profile.boxing().setDirtyMark();
                    }
                },
                onFocus:function(profile, e, src){
                    var p=profile.properties;
                    if(p.disabled)return false;
                    if(profile.beforeFocus && false===profile.boxing().beforeFocus(profile)){}else
                    profile.addTagClass(profile.key,'-focus',profile.getSubNode('BORDER'));

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
                    {caption : "DD/MM/YYYY",id:"^\(\([0-2][0-9]\)|\([3][0-1]\)\)\/\(\([0][0-9]\)|\([1][0-2]\)\)\/\([0-9]{4}\)$"},
                ]
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
            var self=this;
            _.asyRun(function(){
                self.boxing()._setTB(1);
            });
        },
        //check valid manually
        checkValid:function(profile, value){
            var p=profile.properties,
                vf = p.valueFormat || profile.$valueFormat;
            if( (profile.onFormatCheck && (profile.boxing().onFormatCheck(profile, value)===false)) ||
                (vf && typeof vf=='string' && !(new RegExp(vf)).test(value||''))
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