/* css
*  dependency: base _ ; Class ; linb ;
*
*
*/
Class("linb.css", null,{
    Static:{
        _baseid:'linb:css:base',
        _firstid:'linb:css:first',
        _lastid:'linb:css:last',
        _createCss:function(id, last){
            var ns=this,
                head=this.getHead(),
                fid=ns._firstid,
                lid=ns._lastid,
                fc,
                c;
            fc=document.createElement('style');
            fc.type="text/css";
            fc.id=id;
            if(!last){
                c= document.getElementById(fid) || head.firstChild;
                while((c=c.nextSibling) && !/^(script|link|style)$/i.test(''+c.tagName));
                if(c)
                    head.insertBefore(fc, c);
                else{
                    if(c= document.getElementById(lid))
                        head.insertBefore(fc, c);
                    else
                        head.appendChild(fc);
                }
            }else
                head.appendChild(fc);
            return fc;         
        },
        _getCss:function(id, last){
            return document.getElementById(id) || this._createCss(id, last);      
        },
        _getBase:function(){
            return this._getCss(this._baseid);
        },
        _getFirst:function(){
            return this._getCss(this._firstid);
        },
        _getLast:function(){
            return this._getCss(this._lastid, true);
        },
        getHead:function(){
            return this._head || (this._head=document.getElementsByTagName("head")[0]||document.documentElement);
        },
        exists:function(key, value){
            for(var head = this.getHead(),i=0,t=head.childNodes,l;l=t[i++];)
                if(l[key]==value && l.type=="text/css")
                    return l;
            return false;
        },
        //if last==true, add to head last node
        //else add to the before position of the first link
        add:function(txt, id, last){
            var e, ns=this, head = ns.getHead();
            if(id && ns.exists('id',id))
                return;
            e = document.createElement('style');
            e.type="text/css";
            if(id)e.id=id;
            //for ie
            if(linb.browser.ie)
                e.styleSheet.cssText = txt||'';
            else
                try{e.appendChild(document.createTextNode(txt||''))}catch(p){e.styleSheet.cssText = txt||''}
            head.insertBefore(e, last?ns._getLast():ns._getBase());

            e.disabled=true;
            e.disabled=false;
            return e;
        },
        //if before==true, add to the before postion of the first 'text/css'
        //else add to the last postion
        include:function(href, before, hash){
            var e, ns=this, head = ns.getHead();
            if(href && ns.exists('href',href))
                return;
            e = document.createElement('link');
            e.type = 'text/css';
            e.rel = 'stylesheet';
            e.href = href;
            e.media = 'all';
            _.each(hash,function(o,i){
                e.setAttribute(i,o);
            });
            head.insertBefore(e, before?ns._getBase():ns._getLast());

            e.disabled=true;
            e.disabled=false;
            return e;
        },
        remove:function(key,value){
            var head = this.getHead();
            if(value=this.exists(key,value)){
                value.disabled=true;
                head.removeChild(value);
            }
        },
        swap:function(href, key, v1, v2){
            var ns=this,
                head=ns.getHead(),
                hash={},e,v;
            hash[key]=v2;
            e=ns.include(href,false,hash);
            if(v=ns.exists(key,v1))
                head.replaceChild(e,v);
            e.disabled=true;
            e.disabled=false;
        },
        _build:function(selector, value, flag){
            var t='';
            _.each(value,function(o,i){
                t += i.replace(/([A-Z])/g,"-$1").toLowerCase() + ":" + o +";";
            });
            return flag?t:selector+"{" + t + "}";
        },        
        clearRules:function(s){
            return this.setRules(s);
        },
        //selector: single css exp without ','; not allow '.a, .b{}'
        //  for *** IE *** allow single css exp only
        /*
        *in IE: don't use multi css exp for skin
        */
        //css:  
        //  !!false     =>  remove all related style
        //  hashtable   =>  update style value
        setRules:function(selector, value){
            var ns=this,
                add=true,
                ds=document.styleSheets,
                cssRules = linb.browser.ie?'rules':'cssRules',
                target, target2, selectorText, bak, h, e, t, _t;
            selector = selector.replace(/\s+/g,' ').trim();
            bak=selector.toLowerCase();
            _.toArr(ds).each(function(o){
                _.toArr(o[cssRules]).each(function(v,i){
                    if(!v.selectorText)return;
                    selectorText =  v.selectorText.replace(/\.(\w+)\[CLASS~="\1"\]/g,'.$1')
                                     .replace(/\[ID"([^"]+)"\]/g,'#$1')
                                     .replace(/\*([.#])/g,'$1')
                                     .replace(/\s+/g,' ')
                                     .replace(/\*\|/g,'')
                                     .replace(/(\s*,\s*)/g,',').toLowerCase();
                    /*Notice: in IE, no ',' in any selectorTExt*/
                    _t=selectorText.toArr();
                    //null=>remove
                    if(!value){
                        add=false;
                        if(_t.exists(bak) && _t.length>1){
                            _t=_t.removeFrom(_t.indexOf(bak)).join(',');
                            t=v.cssText.slice(v.cssText.indexOf("{")+1,v.cssText.lastIndexOf("}"));
                            if(o.insertRule)
                                o.insertRule(_t+"{" + t + "}", o[cssRules].length);
                            else if(o.addRule )
                                o.addRule(_t, t);
                            if(o.deleteRule)
                                o.deleteRule(i);
                            else
                                o.removeRule(i);          
                            o.disabled=true;
                            o.disabled=false;                  
                        }else if(selectorText == bak){
                            if(o.deleteRule)
                                o.deleteRule(i);
                            else
                                o.removeRule(i);                            
                            o.disabled=true;
                            o.disabled=false;                  
                        }
                    //modify the last one
                    }else{
                        //for single css exp, (all single css exp in IE)
                        if(selectorText==bak){target=v;return false}
                        //for multi css exps, not in IE
                        if(_t.exists(bak)){target2=v;return false}
                    }
                },null,true);
                if(target){
                    add=false;
                    try{
                        _.each(value,function(o,i){
                            i=i.replace(/(-[a-z])/gi, function(m,a){return a.charAt(1).toUpperCase()});
                            target.style[i]= typeof o=='function'?o(target.style[i]):o;
                        })
                    }catch(e){}
                    o.disabled=true;
                    o.disabled=false;                                      
                    return false;
                //not in IE
                }else if(target2){
                    add=false;
                    o.insertRule(ns._build(selector,value), o[cssRules].length);
                    o.disabled=true;
                    o.disabled=false;                  
                    return false;
                }
            },null,true);
            //need to add
            if(add){
                target=ns._getLast();
                changed=target.sheet || target.styleSheet;
                if(changed.insertRule)
                    changed.insertRule(ns._build(selector,value), changed[cssRules].length);
                else if(changed.addRule )
                    changed.addRule(selector, ns._build(selector,value,true));
                target.disabled=true;
                target.disabled=false;
            }
            return ns;
        }
    }
});