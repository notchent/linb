/* event
*  dependency: base _ ; Class ; linb ;
*
*
*/
Class('linb.event',null,{
    Constructor:function(e,o,fordrag,tid){
        var self = linb.event,
            dd=0,id,
            dragdrop=linb.dragDrop,
            src, type,  pre, obj;

        //get event object , and src of event
        if(!(e=e||window.event) || !(src=o))return false;
        //type
        type = e.type;
        //template id
        if(tid)e._tid=tid;

        //for correct mouse hover problems;
        if('mouseover'==type || 'mouseout'==type){

            dd=(dragdrop&&dragdrop.drop2)?1:2;
            //for dropable
            if(dd!=1 && fordrag)return self.rtnFalse;

            //don't return flase, here, opera will stop the system event hander => cursor not change
            if(!self._handleMouseHover(e, src, self.getSrc(e), dd==1))
                return self.rtnFalse;
            if(dd==1)
                pre=dragdrop&&dragdrop._current;
        }

        //for tab focusHook
        if((obj=self.focusHook).length &&
            self._kb[type] &&
            (e.$key || e.keyCode || e.charCode)==9 &&
            false === self._handleFocusHook(src, obj=obj[obj.length-1]))
                return;

        id = self.getId(src) || tid;
        //get profile from dom cache
        if(obj = self._getProfile(id)){
            //for setBlurTrigger
            if(type=='mousedown')
                _.tryF(linb.dom._blurTrigger,[obj,e,src],src);
            //for resize
            if(type=="resize"){
                type='rewh';
                //for IE, always fire window onresize event after any innerHTML action
                if(linb.browser.ie && window===src){
                    var w=linb.browser.contentBox && document.documentElement.clientWidth || document.body.clientWidth,
                        h=linb.browser.contentBox && document.documentElement.clientHeight || document.body.clientHeight;
                    if(obj._w==w&&obj._h==h)
                        return;
                    obj._w=w;obj._h=h;
                }
            }

            var j, f, name, r=true, funs=[];
            //order by: before, on, after
            for(j=0; j<=2; ++j){
                //if in dd, get before Mouse.. only
                if(dd==1 && j!==0 && !e.$force)break;
                //if not in dd, get on/after Mouse.. only
                if(dd==2 && j===0)continue;
                //get event name from event type
                name = self._type[type+j] || ( self._type[type+j] = self._getEventName(type, self._eventtag[j]));
                /*
                e.$e : called by fireEvent
                e.$all : fire all events of the type: before/on/after
                e.$name : fire one group of event of the type.
                */
                if(!e.$e || e.$all || (name==e.$name))Array.prototype.push.apply(funs, obj.getEV(id, name, src));
            }

            /*call function by order
             widget before -> dom before -> widget on -> dom on -> widget after -> dom after
            */
            f=function(a){
                var i, v, k = arguments.callee.funs;
                for(i=0;v=k[i++];)
                    //if any fun return false, stop event bubble
                    if(false === v.call(src, obj, a||e, src, o))
                        return false;
                return true;
            };
            f.funs=funs;
            r = f();

            if(dragdrop){
                //shortcut for onDrag('mousemove')
                if(type=='drag')
                    dragdrop._onDrag=f;
                else if(type=='dragover')
                    dragdrop._onDragover=f;
            }

            if(dd==1){
                //if from parent dd, fire parent dd mouseout
                if('mouseover'==type && dragdrop._current==src && pre && pre!=src){
                    self({
                        type: 'mouseout',
                        target: pre,
                        $e:true,
                        $name:'beforeMouseout',
                        preventDefault:function(){this.returnValue=false},
                        stopPropagation:function(){this.cancelBubble=true}
                        },pre);
                    dragdrop._current=src;
                }
                //if dd out, fire next event manually
                if('mouseout'==type && !dragdrop._current && pre && pre==src){
                    self._ddtemp=id;
                    _.asyRun(function(){delete linb.event._ddtemp});
                }

                //if fire dd, prevent to fire parent dd
                if(src==dragdrop._current)
                    r=false;
            }
            if(r===false)self.stopBubble(e);
            return r;
        }
    },
    Static:{
        rtnFalse:linb.browser.opr?undefined:false,
        _type:{},
        _kb:{keydown:1,keypress:1,keyup:1},
        _reg:/([\.\w]+)(-[\.\w]+)?(:[\w]+:)(.*)/,
        _eventhandler:function(){return linb.event(arguments[0],this)},
        _eventhandler2:function(){return linb.event(arguments[0],this,1)},
        _eventtag:'before,on,after'.split(','),
        //collection
        _events : ("mouseover,mouseout,mousedown,mouseup,mousemove,click,dblclick," +
                "keydown,keypress,keyup,"+
                //location and rewh for custom handler, dont use resize in IE
                "location,rewh,scroll," +
                "blur,focus,contextmenu,"+
                "load,unload,"+
                "change,reset,select,submit,"+
                "abort,error,ready,"+
                //dragstart dragdrop dragout will not work in IE, when set string to attr
                "dragbegin,drag,dragstop,dragleave,dragenter,dragover,drop")
                .split(','),
        _getEventName:function(s,pos){
            var me=arguments.callee, map = me.map || (me.map={});
            return map[s+pos] || (s=s.charAt(0).toUpperCase()+s.substring(1))  &&
                (map[s+pos] = pos ?
                    (pos+s.charAt(0).toUpperCase()+s.substring(1)):
                    function(s){
                        var i,j,a=[];
                        for(i=0; j=linb.event._eventtag[i]; i++)a[i]=j+s;
                        return a;
                    }(s)
                );
        },
        _getEventType:function(name){
            var me=arguments.callee, map = me.map || (me.map={});
            return map[name] || (map[name] = name.replace(/^(on|before|after)/,'').toLowerCase())
        },

        _getProfile:function(id){
            return id && linb.cache.dom[id.replace(this._reg,'$1$3')];
        },
        _handleFocusHook:function(src, target){
            if(src==document)return true;
            var node=src;

            do{
                if(node==target[0])return true;
            }while((node && (node=node.parentNode)))

            _.tryF(target[1]);
            return false;
        },
        _handleMouseHover:function(e,target,src,dd){
            if(target==document)return true;
            //for firefox wearing anynomous div in input/textarea
            //mouseover INPUT/TEXTAREA always return true;
            if(linb.browser.gek && (src.tagName=='INPUT' || src.tagName=='TEXTAREA'))return true;
            var node = (e.type=='mouseover'?e.fromElement:e.toElement)||e.relatedTarget;

            if(dd && e.type=='mouseover' &&this._ddtemp)
                do{
                    if(node && node.id && node.id==this._ddtemp){return true}
                }while(node && (node=node.parentNode) && node!==document && node!==window)

            //for firefox wearing anynomous div in input/textarea
            //related to 'div.anonymous-div' always return true
            try{
                do{
                    if(node==target)return false;
                }while(node && (node=node.parentNode))
            }catch(a){}
            return true;
        },

        focusHook:[],
        eventhandler:"return linb.event(arguments[0],this)",
        eventhandler2:"return linb.event(arguments[0],this,1)",
        getSrc:function(e,a){
            return ((a=e.target||e.srcElement||null) && linb.browser.kde && a.nodeType == 3)?a.parentNode:a
        },
        getId:function(o){
            return (window===o)?"___window":(document===o)?"___document":o?o.id:'';
        },
        // only for mousedown and mouseup
        // return 1 : left button, else not left button
        getBtn:function(e){
	        return linb.browser.ie ?
	                e.button==4 ?
	                    'middle' :
	                        e.button==2 ?
	                            'right' :
	                                'left' :
	                e.which==2 ?
	                    'middle':
	                        e.which==3 ?
	                            'right':
	                                'left';
        },
        getPos:function(e){
            e = e || window.event;
            if(typeof e.pageX == 'number')
                return {left:e.pageX, top:e.pageY};
            else{
                var m = linb.browser.contentBox?document.documentElement:document.body;
                return {left:e.clientX + m.scrollLeft, top:e.clientY + m.scrollTop};
            }
        },
        /*return array(key, control, shift, alt)
        ['k','1','',''] : 'k' pressed, 'control' pressed, 'shift' and 'alt' not pressed
        */
        /*
        opear in window:
            ' = right (39)
            - = insert (45)
            . = del (46)
        */
        getKey:function(e){
            e=e||window.event;
            // use keyCode first for newer safari
            var res=[],t, k= e.$key || e.keyCode || e.charCode || 0;
            //from linb event
            if(typeof k == 'string')
                res[0]=k;
            else{
                var key= String.fromCharCode(k),
                    type=e.type;
                if(
                 //visible char
                 (type=='keypress' && k>=33 && k<=128)
                 //0-9, A-Z
                 ||((k>=48&&k<=57) || (k>=65&&k<=90))
                 )res[0]=key;
                else{
                    if(!(t=arguments.callee.map)){
                        t = arguments.callee.map ={};
                        var k,arr =
                        ("3,enter,8,backspace,9,tab,12,numlock,13,enter,19,pause,20,capslock," +
                        "27,esc,32,space,33,pageup,34,pagedown,35,end,36,home,37,left,38,up,39,right,40,down,44,printscreen," +
                        "45,insert,46,delete,50,down,52,left,54,right,56,up," +
                        "91,win,92,win,93,apps," +
                        "96,0,97,1,98,2,99,3,100,4,101,5,102,6,103,7,104,8,105,9," +
                        "106,*,107,+,109,-,110,.,111,/," +
                        "112,f1,113,f2,114,f3,115,f4,116,f5,117,f6,118,f7,119,f8,120,f9,121,f10,122,f11,123,f12," +
                        "144,numlock,145,scroll," +
                        "186,;,187,=,189,-,190,.,191,/,192,`,"+
                        "219,[,220,\\,221,],222,'," +
                        "224,meta,"+ //Apple Meta and Windows key
                        //safari
                        "63289,numlock,63276,pageup,63277,pagedown,63275,end,63273,home,63234,left,63232,up,63235,right,63233,down,63272,delete,63302,insert,63236,f1,63237,f2,63238,f3,63239,f4,63240,f5,63241,f6,63242,f7,63243,f8,63244,f9,63245,f10,63246,f11,63247,f12,63248,print"
                        ).split(',')
                        for(var i=1,l=arr.length; i<l; i=i+2)
                            t[arr[i-1]]=arr[i]
                        arr.length=0;
                        //add
                        t[188]=',';
                    }
                    res[0]= t[k] || key;
                }
            }

            //control
            if((e.modifiers)?(e.modifiers&Event.CONTROL_MASK):(e.ctrlKey||e.ctrlLeft||k==17||k==57391)){
                if(k==17||k==57391)
                    res[0]='';
                res.push('1');
            }else
                res.push('');

            //shift
            if((e.modifiers)?(e.modifiers&Event.SHIFT_MASK):(e.shiftKey||e.shiftLeft||k==16||k==57390)){
                if(k==16||k==57390)
                    res[0]='';
                res.push('1');
            }else
                res.push('');

            //alt
            if((e.modifiers)?false:(e.altKey||e.altLeft||k==18||k==57388)){
                if(k==18||k==57388)
                    res[0]='';
                res.push('1');
            }else
                res.push('');

            return res;
        },
        getEventPara:function(e){
            var pos=this.getPos(e), keys = this.getKey(e), h={
                pageX:pos.left,
                pageY:pos.top,
                keyCode:keys[0],
                ctrlKey:keys[1],
                shiftKey:keys[2],
                altKey:keys[3]
            };
            for(var i in e)if(i.charAt(0)=='$')h[i]=e[i];
            return h;
        },
        stopBubble:function(e){
            e=e||window.event;
            if(e.stopPropagation)e.stopPropagation();
            e.cancelBubble = true;
            this.stopDefault(e);
        },
        stopDefault:function(e){
            e=e||window.event;
            if(e.preventDefault)e.preventDefault();
            e.returnValue = false;
        },
        //key:control:shift:alt
        hookKey:function(key, ctrl, shift, alt, fun,args,target){
            var p = linb.cache.hookKey, k = (key||'').toLowerCase() + ":"  + (ctrl?'1':'') + ":"  +(shift?'1':'')+ ":" + (alt?'1':'');
            if(fun===null)delete p[k];
            else p[k]=[fun,args,target];
            return this;
        }
    }
});