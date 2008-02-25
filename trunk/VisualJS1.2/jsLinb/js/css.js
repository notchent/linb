/* css
*  dependency: base _ ; Class ; linb ;
*
*
*/
Class("linb.css", null,{
    Static:{
        getHead:function(){
            return this._head || (this._head=document.getElementsByTagName("head")[0]||document.documentElement);
        },
        exists:function(key, value){
            for(var head = this.getHead(),i=0,t=head.childNodes,l;l=t[i++];)
                if(l[key]==value)
                    return l;
            return false;
        },
        add:function(txt, id){
            var e, head = this.getHead();
            if(id && this.exists('id',id))
                return;

            e = document.createElement('style');
            e.type="text/css";
            if(id)e.id=id;
            //for ie
            if(linb.browser.ie)
                e.styleSheet.cssText = txt||'';
            else
                e.appendChild(document.createTextNode(txt||''));
            head.appendChild(e);
            //e.disabled=true;
            //e.disabled=false;
            return e;
        },
        include:function(href){
            var e, head = this.getHead();
            if(href && this.exists('href',href))
                return;
            e = document.createElement('link');
            e.type = 'text/css';
            e.rel = 'stylesheet';
            e.href = href;
            e.media = 'all';
            head.appendChild(e);
            //e.disabled=true;
            //e.disabled=false;
            return e;
        },
        remove:function(key,value){
            var head = this.getHead();
            if(value=this.exists(key,value))
                head.removeChild(value);
        }
        /*,
        phrogz.net/CSS/selector_test.html
        www.howtocreate.co.uk/tutorials/javascript/domstylesheets
        support only:
            .a{}
    `       .b, .c{}
            .a span{}
            .a span ,.b span{}

        //css: null represents delete selector from stylesheet
        setCSSStyle:function(selector, css){
            var target, selectorText, t,_t, cssRules, add=true;
            cssRules = linb.browser.ie?'rules':'cssRules';
            //get styleSheet from the last to the first
            _.toArr(document.styleSheets).each(function(o){
                // get cssRule
                _.toArr(o[cssRules]).each(function(v,i){
                    selectorText =  v.selectorText.replace(/\.(\w+)\[CLASS~="\1"\]/g,'.$1')
                                     .replace(/\[ID"([^"]+)"\]/g,'#$1')
                                     .replace(/\*([.#])/g,'$1')
                                     .replace(/\s+/g,' ')
                                     .replace(/(\s*,\s*)/g,',').toLowerCase();
                    //delete all
                    if(null===css){
                        _t=selectorText.toArr();

                        if(_t.exists(selector)){
                            // for allow ","(no IE)

                            // if older => .class1, .class2, .class3{}
                            //      and selector => .class1
                            //      and css => null
                            // means delete .class1
                            // first
                            //      add => .class2, .class3{}
                            if(_t.length>1){
                                _t=_t.removeFrom(_t.indexOf(selector)).join(',');
                                t=v.cssText.slice(v.cssText.indexOf("{")+1,v.cssText.lastIndexOf("}"));

                                if(o.insertRule)
                                    o.insertRule(_t+"{" + t + "}", o[cssRules].length);
                                else if(o.addRule )
                                    o.addRule(_t, t);

                            }
                            //and delete older => .class1 .class2, .class3{}
                            if(o.deleteRule )
                                o.deleteRule(i);
                            else
                                o.removeRule(i);
                        }

                    //modify the last one
                    }else{
                        if(selectorText == selector){target=v;return false}
                    }
                },null,true);
                //modify css style
                if(target)
                    try{
                        _.each(css,function(o,i){
                            i=i.replace(/-([a-z])/g,function(z,b){return b.toUpperCase();});
                            if(typeof o == 'function')
                                target.style[i]=o(target.style[i]);
                            else
                                target.style[i]=o;
                        })
                    }catch(e){}finally{return ok=false;}

            },true);

            //delete finished
            if(null===css)return;

            //not found, add it to the first stylesheet
            if(add){
                t='';
                _.each(css,function(o,i){
                    t += i.replace(/([A-Z])/g,"-$1").toLowerCase() + ":" + o +";";
                });
                //insert
                target=document.styleSheets[0];
                if(target.insertRule)
                    target.insertRule(selector+"{" + t + "}", target[cssRules].length);
                else if(target.addRule )
                    target.addRule(selector, t);
            }
        }*/
    }
});