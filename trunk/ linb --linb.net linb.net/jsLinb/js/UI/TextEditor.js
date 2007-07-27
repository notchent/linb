    /*support
    tab: to 4 space
    enter: add head space
    {enter: add head+4 space
    }:add head-4 space

    linb.xx.xx.: tips
    linb(xx.xx: tips

    var.xx.xx: tips
    */
Class("linb.UI.TextEditor", ["linb.UI.Widget", "linb.UI.iForm"],{
    Instance:{
        activate:function(){
            var profile = this.get(0);
            profile.getSubNode(profile.keys.INPUT).focus();
            return this;
        },
        setCtrlValue:function(value){
            if(_.isNull(value) || !_.exists(value))value='';
            return this.each(function(profile){
                var node=profile.getSubNode(profile.keys.INPUT).get(0);
                if(node.value.replace(/(\r\n|\r)/g, "\n")!=value.replace(/(\r\n|\r)/g, "\n")){
                    var st=node.scrollTop;
                    node.value=value;
                    node.scrollTop=st;
                }
            });
        },
        getCtrlValue:function(value){
            var profile = this.get(0);
            return profile.getSubNode(profile.keys.INPUT).value().replace(/(\r\n|\r)/g, "\n").replace(/( +)(\n)/g, "$2").replace(/\t/g, "    ");
        },
        prepareMaps:function(){
            return this.each(function(profile){
                profile._maps = profile._maps || {};
            })
        },
        setTempMaps:function(h){
            return this.each(function(profile){
                profile._maps2 = h ||{};
            })
        },
        disabled:function(value){
            arguments.callee.upper.call(this,value);
            return this.each(function(o){
                o.getSubNode(o.keys.INPUT).disabled(value);
            })
        },
        readonly:function(value){
            return this.each(function(profile){
                profile.getSubNode(profile.keys.INPUT).readonly(value).background(value?'#F4F4F4':'');
            });
        }
    },
    Initialize:function(){
        //modify default template for shell
        var t = this.getTemplate('default');
        _.merge(t.FRAME.BORDER,{
            BOX:{
                tagName:'div',
                INPUT:{
                    tagName:'textarea',
                    tabindex:'{tabindex}'
                }
            },
            BAK1:{},
            BAK2:{tagName:'div'}
        },'all');
        this.setTemplate('default',t);
    },
    Static:{
        Appearances:{'default':{
            KEY:{
                overflow:'hidden'
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
                'font-family': 'Courier New, Courier, monospace',
                'font-size':'12px',

                position:'relative',
                left:'0',
                top:'0',
                //border: 'solid 1px',
                //'border-color':'#808080 #fff #fff #808080',
                border:'0',
                margin:'0',
                padding:'0',
                overflow:'auto',
                'overflow-y':(linb.browser.gek||linb.browser.ie)?'auto':'',
                'overflow-x':(linb.browser.gek||linb.browser.ie)?'hidden':''
            },
            'BAK1, BAK2':{
                'font-family': 'Courier New, Courier, monospace',
                'font-size':'12px',
                position:'absolute',
                visibility:'hidden',
                left:'-10000px',
                top:'-10000px'
            }
        }},
        Behaviors:{'default':{
            INPUT:{
                onChange:function(profile, e, src){
                    profile.boxing().updateUIValue(src.value);
//                    if(profile.properties.$UIvalue !== src.value){
//                        src.value = profile.properties.$UIvalue;
//                    }
                },
                afterKeydown:function(profile, e, src){
                    if(profile.properties.disabled || profile.properties.readonly)return;
                    if(profile.$change)delete profile.$change;

                    var key = linb.event.getKey(e),
                    k=key[0];
                    switch(k){
                        case 'tab':
                            profile.box.insertAtCaret(profile,'    ');
                            profile.$pos= profile.box.getParas(profile)[0];
                            return false;
                        case 'enter':
                            var paras = profile.box.getParas(profile);
                            str = paras[1];
                            var len = str.length - str.ltrim().length;

                            if(str.charAt(str.length-1)=="{")
                                len +=4;
                            if(len){
                                profile.box.insertAtCaret(profile, ((linb.browser.ie||linb.browser.opr)?'\r\n':'\n')+' '.repeat(len));
                                profile.$enter=true;
                                return false;
                            }
                            break;
                        default:
                            if(profile.tips){
                                profile.tips.destroy();
                                profile.tips=null;
                            }
                    }
                },
                afterKeypress:function(profile, e, src){
                    if(profile.properties.disabled || profile.properties.readonly)return;
                    var key = linb.event.getKey(e), k=key[0];
                    var me=arguments.callee, map=me.map || (me.map='space,enter,backspace,tab,delete'.toHash(true));
                    if(k.length==1 || map[k])
                        profile.$change=true;

                    switch(k){
                        case 'tab':
                            if(linb.browser.opr)
                                _.asyRun(function(){
                                    profile.box.setCaretTo(src, profile.$pos);
                                });
                            return false;
                        case 'enter':
                            if(profile.$enter){
                                delete profile.$enter;
                                return false;
                            }
                        case '}':
                            if(key[2]){
                                var paras = profile.box.getParas(profile);
                                var
                                loc = paras[0],
                                str = paras[1],
                                pos=paras[2],
                                input=paras[3];
                                if(/ {4}$/.test(str)){
                                    var st=linb(src).scrollTop();
                                    input.value =
                                    input.value.substr(0,loc).replace(/ {4}$/,'}') +
                                    input.value.substr(loc, input.value.length);

                                    //fire event manully
                                    linb(input).onChange();

                                    profile.box.setCaretTo(input, loc - 4 + 1, st);

                                    return false;
                                }
                            }
                            break;
                    }
                },
                afterKeyup:function(profile, e, src){
                    var key = linb.event.getKey(e),k=key[0];
                    var me=arguments.callee, map=me.map || (me.map='space,enter,backspace,tab,delete'.toHash(true));
                    if(k.length==1 || map[k])
                        profile.$change=true;

                    if(profile.$change){
                        delete profile.$change;
                        if(profile.onKeyPress)
                            profile.boxing().onKeyPress(profile, e, src);
                    }
                }
            }
        }},
        DataModel:{
            icon:null,
            iconPos:null,
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode(this.keys.INPUT).tabIndex(value);
                }
            },

            left:'0',
            top:'0',
            width:200,
            height:200,
            position:'absolute',
            readonly:{
                ini:false,
                action: function(v){
                    this.boxing().readonly(v);
                }
            }
        },
        EventHandlers:{
            onKeyPress:function(profile, e, src){}
        },
        createdTrigger:function(){
            if(this.properties.readonly)
                this.boxing().readonly(true);
        },
        //
        resize:function(profile,w,h){
            var size = arguments.callee.upper.apply(this,arguments);
            profile.getSubNode(profile.keys.BOX).cssSize(size);
//            size.width-=2;size.height-=2;
            profile.getSubNode(profile.keys.INPUT).cssSize(size);
        },
        //for
        insertAtCaret:function(profile, text) {
            var start,end,input = profile.getSubNode(profile.keys.INPUT),scrollTop;
            scrollTop = input.scrollTop() || null;

            //fire onChange manully
            input.onChange();

            input = input.get(0);

    		if(linb.browser.ie){
    			linb(input).focus();
    			var range = document.selection.createRange();
    			if(range.parentElement() != input)return false;
    			range.text = '';
    			var loc = linb.UI.getCaretPos(input);
                input.value = input.value.substr(0, loc[0])
                + text
                + input.value.substr(loc[0], input.value.length);
                start =  loc[0];
    		}else{
    			start = input.selectionStart;
    			end   = input.selectionEnd;
    			input.value = input.value.substr(0, start)
    				+ text
    				+ input.value.substr(end, input.value.length);
    		}

    		if(start != null) {
    			this.setCaretTo(input, start + text.length, scrollTop);
    		} else {
    			input.value += text;
    		}
    	},
        //set cursor to textarea
        setCaretTo:function(input, pos, scrollTop){
            linb(input).focus();
            var s,c,h,o=linb(input);

            //opera not support scrollTop in textarea
            if(_.isNumb(scrollTop))
                o.scrollTop(scrollTop);

            if(scrollTop===true){
                if(o.tagName().toLowerCase() == 'textarea' && o.scrollHeight() !== o.offsetHeight()){
                    s = o.value().substr(0,pos);
                    c = o.clone().id('').setStyle({visibility:'hidden',position:'absolute',left:5000+'px'}).value(s);
                    linb([document.body],false).addLast(c);
                    h = Math.max((c.scrollHeight() > c.offsetHeight()) ? c.scrollHeight() - 30 : 0,0);
                    o.scrollTop(h);
                    c.remove();
                }
            }

            if(linb.browser.ie){
                //in ie: '/r/n'.lengt =>2, but range.move('character', 1) will pass '/r/n'.
                pos =  input.value.substr(0, pos).replace(/\r\n/g,'\n').length;
                var range = input.createTextRange();
                range.move('character', pos);
                range.select();
            }else
                try{input.setSelectionRange(pos, pos)}catch(e){}
        },
        /*
        return array
        [0] char number before caret
        [1] line number of caret
        [2] absPos of caret
        [3] text before caret
        */
        getParas:function(profile){
            var o = profile.getSubNode(profile.keys.INPUT), me=arguments.callee, reg = me.reg ||(me.reg=/\r\n/g);
            v = o.get(0).value;
            loc = linb.UI.getCaretPos(o.get(0));

            if(loc[0]<0)loc[0]=0;

            //for ie/opera
            var l=0, m = v.substr(0,loc[0]).match(reg);
            if(m)l=m.length;
            v = v.replace(reg,'\n');
            var txt = v.substr(0,loc[0]-l);

            var
            li = txt.lastIndexOf('\n') ,
            line = txt.substr(li+1, loc[0]-li),
            w=o.clientWidth(),
            bak1 = profile.getSubNode(profile.keys.BAK1),
            bak2 = profile.getSubNode(profile.keys.BAK2)
            ;
            if(txt.charAt(txt.length-1)=='\n')txt+='*';

            bak2.width(w);
            var
            x = bak1.html(line.replace(/ /g,'&nbsp;'),false).width(),
            y = bak2.html(txt.replace(/\n/g,'<br />'),false).height() - o.scrollTop();

            if(x>w){
                bak2.html(line,false);
                var lbak = line;
                var bl = bak2.height();
                while(lbak){
                    //delete last words
                    lbak=lbak.replace(/ [^ ]*$/,'');
                    bak2.html(lbak,false);
                    if(bak2.height()!=bl)break;
                }
                lbak = line.substr(lbak.length, line.length-lbak.length);
                x = bak1.html(lbak,true).width();
            }

            bak1.html('',false);
            bak2.html('',false);

            var pos = profile.getSubNode(profile.keys.KEY).absPos();
            pos.left+=x;
            pos.top+=y;
            return [loc[0],line,pos,o.get(0),txt];
        }
    }
});
