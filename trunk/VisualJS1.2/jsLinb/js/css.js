/* css
*  dependency: base _ ; Class ; linb ;
*
*
*/
Class("linb.css", null,{
    Static:{
        _id:'linb:css:basecsspoint',
        _tagrule:'linb:css:tag',
        _getBasePoint:function(){
            var ns=this,
                head=this.getHead(),
                fc=document.getElementById(ns._id),
                c;
            if(!fc){
                fc=document.createElement('style');
                fc.type="text/css";
                fc.id=ns._id;   
                //first css file or declare block in head
                for(var i=0,t=head.childNodes,l=t.length;i<l;i++)
                    if(t[i].type=='text/css'){
                        c=t[i];
                        break;
                    }
                if(c)
                    head.insertBefore(fc, c);
                else
                    head.appendChild(fc);
            }
            return fc;         
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
                try{e.appendChild(document.createTextNode(txt||''))}catch(p){e.styleSheet.cssText = txt||''}
            if(!last)
                head.insertBefore(e, this._getBasePoint());
            else
                head.appendChild(e);
            //e.disabled=true;
            //e.disabled=false;
            return e;
        },
        //if before==true, add to the before postion of the first 'text/css'
        //else add to the last postion
        include:function(href, title, before){
            var e, head = this.getHead();
            if(href && this.exists('href',href))
                return;
            e = document.createElement('link');
            e.type = 'text/css';
            e.rel = 'stylesheet';
            e.title = title||'';
            e.href = href;
            e.media = 'all';
            if(before)
                head.insertBefore(e, this._getBasePoint());
            else
                head.appendChild(e);
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
        //selector: a single css exp without ','
        //css:  
        //  !!false     =>  remove all related style
        //  hashtable   =>  update style value
        setRules:function(selector, value){
            var ns=this,
                add=true,
                ds=document.styleSheets,
                cssRules = linb.browser.ie?'rules':'cssRules',
                target, selectorText, t, _t, cssRules;
            selector = selector.replace(/\s+/g,' ').trim();
            _.toArr(ds).each(function(o){
                _.toArr(o[cssRules]).each(function(v,i){
                    if(!v.selectorText)return;
                    selectorText =  v.selectorText.replace(/\.(\w+)\[CLASS~="\1"\]/g,'.$1')
                                     .replace(/\[ID"([^"]+)"\]/g,'#$1')
                                     .replace(/\*([.#])/g,'$1')
                                     .replace(/\s+/g,' ')
                                     .replace(/(\s*,\s*)/g,',').toLowerCase();
                    //null=>remove
                    if(!value){
                        add=false;
                        _t=selectorText.toArr();
                        if(_t.exists(selector)){
                            if(_t.length>1){
                                _t=_t.removeFrom(_t.indexOf(selector)).join(',');
                                t=v.cssText.slice(v.cssText.indexOf("{")+1,v.cssText.lastIndexOf("}"));
                                if(o.insertRule)
                                    o.insertRule(_t+"{" + t + "}", o[cssRules].length);
                                else if(o.addRule )
                                    o.addRule(_t, t);
                            }
                            if(o.deleteRule)
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
                        _.each(value,function(o,i){
                            i=i.replace(/(-[a-z])/gi, function(m,a){return a.charAt(1).toUpperCase()});
                            target.style[i]= typeof o=='function'?o(target.style[i]):o;
                        })
                    }catch(e){}finally{return add=false;}
            },null,true);

            if(add){
                t='';
                _.each(value,function(o,i){
                    t += i.replace(/([A-Z])/g,"-$1").toLowerCase() + ":" + o +";";
                });
                _t=selector+"{" + t + "}";
                if(!(target=document.getElementById(ns._tagrule)))
                    ns.add(_t,ns._tagrule,true);
                else{
                    target=target.sheet || target.styleSheet;
                    if(target.insertRule)
                        target.insertRule(_t, target[cssRules].length);
                    else if(target.addRule )
                        target.addRule(selector, t);
                    target.disabled=true;
                    target.disabled=false;
                }
            }
            return ns;
        }
    }
});