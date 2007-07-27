Class("linb.UI.Input", ["linb.UI.Widget", "linb.UI.iForm"],{
    Instance:{
        activate:function(){
            var profile = this.get(0);
            profile.getSubNode(profile.keys.INPUT).activate();
            return this;
        },
        disabled:function(value){
            arguments.callee.upper.call(this,value);
            return this.each(function(o){
                o.getSubNode(o.keys.INPUT).readonly(value);
            })
        },
        setCtrlValue:function(value){
            if(_.isNull(value) || !_.exists(value))value='';
            return this.each(function(profile){
                profile.getSubNode(profile.keys.INPUT).value(value.toString());
            });
        },
        getCtrlValue:function(){
            var profile=this.get(0);
            return profile.getSubNode(profile.keys.INPUT).value();
        },
        setDirtyMark:function(){
            return this.each(function(profile){
                var properties = profile.properties,
                    o=profile.getSubNode(profile.keys.INPUT),
                    flag=properties.value !== properties.$UIvalue;
                //dirty mark
                if(o.beforeDirtyMark && false===o.boxing().beforeDirtyMark(profile,flag)){}
                else{
                    if(flag)
                        o.addClass(linb.UI.$css_tag_dirty);
                    else
                        o.removeClass(linb.UI.$css_tag_dirty);

                }
                //format statux
                if(o.beforeFormatMark && false==o.boxing().beforeFormatMark(profile)){}
                else{
                    //
                    //valid mark
                    //
                    //bg
                    if(profile.inValid)o.addClass(linb.UI.$css_tag_invalid);
                    else o.removeClass(linb.UI.$css_tag_invalid);

                    //show icon
                    profile.getSubNode(profile.keys.ERROR).display(profile.inValid?'block':'none');
                    //tools tip
                    if(profile.inValid){
                        if(!_.exists(profile.tips)){
                            profile.tips = profile.properties.tips;
                            profile.properties.tips = profile.properties.validTips || profile.box.formatErr;
                        }
                    }else{
                        if(_.exists(profile.tips)){
                            profile.properties.tips = profile.tips;
                            delete profile.tips;
                        }
                    }
                }
            });
        },
        readonly:function(value){
            return this.each(function(profile){
                profile.getSubNode(profile.keys.INPUT).readonly(value);
            });
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
        t.FRAME.ERROR = {tagName : 'span'};
        this.setTemplate('default',t)
    },
    Static:{
        formatErr:'format error!',
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
                display:'block',
                position:'absolute',
                width:'100%',
                height:'100%',
                left:'0',
                top:'0',
                overflow:linb.browser.gek?'auto':''
            },
            INPUT:{
               border:'0',
               padding:'0',
               margin:'0',
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
                right:'0',
                top:'0',
                display:'none',
                'font-size':'0',
                background: linb.UI.getCSSImgPara('icon.gif', ' no-repeat left top', null, 'linb.UI.Public'),
                'z-index':'2'
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
                onFocus:function(profile, e, src){
                    if(profile.properties.disabled)return false;
                    profile.addTagClass(profile.getSubNode(profile.keys.BORDER),profile.key,'-focus');
                },
                onBlur:function(profile, e, src){
                    if(profile.properties.disabled)return false;
                    profile.removeTagClass(profile.getSubNode(profile.keys.BORDER),profile.key,'-focus');
                }
            }
        }},
        DataModel:{
            icon:null,
            iconPos:null,
            caption:null,
            validTips:'',
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
                    {caption : 'URL', id:"^(http|https|ftp)\\:\\/\\/[a-z0-9\\-\\.]+\\.[a-z]{2,3}(:[a-z0-9]*)?\\/?([a-z0-9\\-\\._\\?\\,\\'\\/\\\\\\+&amp;%\\$#\\=~])*$"},
                    {caption : 'color',id:"^\\#[0-9A-Fa-f]{6}$"},
                    {caption : "HH-MM-SS", id:"^\(\([0-1][0-9]\)|\([2][0-3])\)\\:\([0-5][0-9]\)\\:\([0-5][0-9]\)$"},
                    {caption : "YYYY-MM-DD",id:"^\([0-9]{4}\)\\-\(\([0][0-9]\)|\([1][0-2]\)\)\\-\([0-3][0-9]\)$"},
                    {caption : "DD/MM/YYYY",id:"^\(\([0-2][0-9]\)|\([3][0-1]\)\)\/\(\([0][0-9]\)|\([1][0-2]\)\)\/\([0-9]{4}\)$"}
                ]
            },
            width:120,
            height:20,
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode(this.keys.INPUT).tabIndex(value);
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
                    this.getSubNode(this.keys.INPUT).attr('type',value);
                }
            },
            inputArea:{
                ini:'input',
                listbox:['input','textarea'],
                action: function(value){
                    var str = this.getSubNode(this.keys.INPUT).outerHTML();
                    str = str.replace(/^(<)[a-zA-Z]+(\s)/i, '$1'+value+'$2');

                    var v = this.boxing().getValue();
                    this.getSubNode(this.keys.INPUT).outerHTML(str);
                    this.boxing().updateUIValue(v);
                }
            },

            $border:1
        },
        EventHandlers:{
            beforeDirtyMark:function(profile, flag){},
            onFormatCheck:function(profile, value){},
            beforeFormatMark:function(profile){}
        },
        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);
            profile.data.cursor = profile.data.readonly?'pointer':'default';
            profile.data.type = profile.data.type || '';
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
        //check valid manually
        checkValid:function(profile, value){
            var p=profile.properties;
            if( (p.valueFormat && typeof p.valueFormat=='string' && !(new RegExp(p.valueFormat)).test(value)) ||
                (profile.onFormatCheck && (profile.boxing().onFormatCheck(profile, value)===false))
            ){
                profile.inValid=true;
                var s=p.validTips || profile.box.formatErr;
                if(s.charAt(0)=='$')s=s.slice(1);
                linb.message( linb.getStr(s));
                return false;
            }{
                delete profile.inValid;
                return true;
            }
        },

        resize:function(profile,w,h){
            var size = arguments.callee.upper.apply(this,arguments);
            var v = linb.dom.pack([],false).add(profile.getSubNode(profile.keys.INPUT)).add(profile.getSubNode(profile.keys.BOX));

            if(!_.isNull(w))
                v.width(size.width);
            if(!_.isNull(h))
                v.height(size.height -(linb.browser.ie6?2:linb.browser.ie?1:linb.browser.kde?1:0));

            return size;
        }
    }
});