/* jsLinb 1.0(linb.net)
Revision: 2163
Date: 2007-07-01
Copyright (c) 2006-2007 Yingbo Li (linb.net[at]gmail.com), All Rights Reserved.
Open Source(GPL) and Commercial License. more info on licensing: http://www.linb.net
*/

/*/ declare _ (global)
*/
new function(){
    _={
        // version and copyright
        version:'1.1',
        copyright:'all rights reserved by Yingbo Li',

        /*merge hash from source to target
          target:hash
          source:hash
          type: 'all', 'with', 'without', or function <return true will trigger merge>, default is 'without'
          return:  target
        */
        merge:function(target, source, type){
            var i,f;
            if(typeof type == "function"){
                f=type;
                type='fun';
            }
            switch(type){
                case 'fun':
                    for(i in source)if(true===f(source[i],i))target[i]=source[i];
                    break;
                case 'all':
                    for(i in source)target[i]=source[i];
                    break;
                case 'with':
                    for(i in source)if(i in target)target[i]=source[i];
                    break;
                default:
                    for(i in source)if(!(i in target))target[i]=source[i];
            }
            return target;
        }
    };
    /* environment object
    */
    _.merge(_,{
        // get time stamp
        timeStamp:function(){return new Date().getTime()},

        // type detection
        exists:function(target)  {return target !== undefined},
        isNull:function(target)  {return (typeof target == 'object') && !target },
        isEmpty:function(hash)   {for(var i in hash)return false; return true},
        isObj:function(target)   {return !!target  && (typeof target == 'object' || typeof target == 'function')},
        isBool:function(target)  {return typeof target == 'boolean'},
        isNumb:function(target)  {return typeof target == 'number' && isFinite(target)},
        isDate:function(target)  {return !!target && target.constructor == Date},
        isFun:function(target)   {return typeof target == "function"},
        isArr:function(target)   {return !!target && target.constructor == Array},
        isHash:function(target)  {return !!target && typeof target == 'object' && target.constructor == Object},
        isReg:function(target)   {return !!target && target.constructor == RegExp},
        isStr:function(target)   {return typeof target == "string"},

        /*force type
        value : any
        df : default value to set
        return : target type
        */
        arr:function(value,df){return _.isArr(value)?value:_.isArr(df)?df:[]},
        bool:function(value,df){return _.isBool(value)?value:_.isBool(df)?df:false},
        date:function(value,df){return _.isDate(value)?value:_.isDate(df)?df:new Date},
        fun:function(value,df){return _.isFun(value)?value:_.isFun(df)?df:function(){}},
        hash:function(value,df){return _.isHash(value)?value:_.isHash(df)?df:{}},
        numb:function(value,df){return _.isNumb(value)?value:_.isNumb(df)?df:0},
        str:function(value,df){return _.isStr(value)?value:_.isStr(df)?df:''},

        /*break object memory link
        target: target object
        n: depth, default 1
        */
        breakO:function(target){
            var n=arguments[1]||1, l=1+(arguments[2]||0), self=arguments.callee, _t='_$gc_',_o=self.o||(self.o={}), i, b, p;
            if(target && (typeof target=='object' || typeof target=='function') && target!==window&&target!==Object&&target!==Date&&target!==Array&&target!==document){
                if(_t in target)return; else try{target[_t]=1;}catch(e){return}
                p=(p=target.constructor)?p.prototype:_o;
                for(i in target)
                    if(i!=_t){
                        if(l<n && target[i] && (typeof target[i]=='object' || typeof target[i]=='function'))self(target[i],n,l);
                        if(!(p && p[i]) && i!="prototype" && i!="constructor")try{delete target[i]}catch(e){}
                    }
                delete target[_t];
                if(target.constructor==Array)target.length=0;
            }
        },
        /*
        fun:function to run;
        args:arguments for fun;
        target:target object for 'this' of fun;
        df:default return vale, if f is not a valid function;
        */
        tryF:function(fun, args, target, df){
            return (fun && typeof fun=='function') ? fun.apply(target||null, args||[]) : df
        },
        /*
        clsPath: class namespace
        fun: function name to stimulate
        args: arguments for fun
        flag: is cahce?
        */
        asyCall: function(clsPath, fun, args, flag, threadid, onEnd){
            var o,id,r;
            if(!args)args=[];
            //get cache id
            if(flag)id = clsPath +':' + fun;
            //from cache
            if(o=linb.cache.block[id]){
                //must give this para
                args.push(threadid||null);
                if(o[fun])r = o[fun].apply(o,args);
                _.tryF(onEnd,[r,threadid],o);
                onEnd=args=null;
            }else{
                var cls = linb.SC.evalPath(clsPath),
                //task for running
                task=function(cls,threadid){
                    var o = new cls();
                    if(flag)linb.cache.block[id]=o;
                    //must give this para
                    args.push(threadid||null);
                    if(fun)r=o[fun].apply(o,args);
                    _.tryF(onEnd,[r, threadid],o);
                    onEnd=args=null;
                };
                if(cls)task(cls,threadid);
                else{
                    linb.thread.asyUI(threadid, [function(threadid){
                            var f=function(a,b,threadid){
                                var cls;
                                if(cls=linb.SC.evalPath(clsPath)){
                                    // ... -> ajax -> task
                                    linb.thread(threadid).insert({
                                        task:task,
                                        args:[cls, threadid]
                                    });
                                }
                            };
                            if(cls=linb.SC(clsPath, true, f,{threadid:threadid}))f(0,0,threadid);
                        }]
                    );
                }
            }
        },
        /*
        get/set something from deep hash
        hash:target hash
        arr:path array, ['a','b','c'] => {a:{b:{c:...}}}
        example:
        _.get({a:{b:{c:1}}},['a','b']) => {c:1};
            _.get({a:{b:{c:1}}},['a','b','c']) => 1;
            _.get({a:{b:{c:1}}},['a','b','c','d']) => undefined;
        */
        get:function(hash,arr){
            for(var i=0,l=arr.length;i<l;)
                if(!hash || typeof (hash=hash[arr[i++]])=='undefined' )return;
            return hash;
        },
        /*
        set/unset a value to deep hash
        example:
            _.set({a:{b:{c:1}}},['a','b','c'],2) => {a:{b:{c:2}}}
            _.set({a:{b:{c:1}}},['a','b','c'],null) => {a:{b:{}}}
        */
        set:function(hash,arr,value){
            var v,i,l,key = arr.pop();
            if(typeof value!='undefined'){
                for(i=0,l=arr.length;i<l;){
                    v=arr[i++];
                    if(hash[v]&&(typeof hash[v]=='object' ||typeof hash[v]=='function')) hash=hash[v];
                    else hash=hash[v]={};
                }
                return hash[key]=value;
            }else
                if(hash=_.get(hash,arr))
                    delete hash[key];
        },

        /*each function for hash
        fun: fun to exec, if return false, stop the $iterator
        target:target object for 'this';
        */
        each:function(hash,fun,target){
            target = target||hash;
            for(var i in hash)
                if(false===fun.call(target, hash[i], i, hash))
                    break;
            return hash;
        },
        /*shadow copy for hash
        */
        copy:function(hash){
            var i,h={};
            for(i in hash)
                h[i]=hash[i];
            return h;
        },
        /*deep copy for hash
        be careful for dead lock
        */
        clone:function(hash,fun){
            if(!!hash && typeof hash=='object'){
                var i, v, h=hash.constructor==Array?[]:{}, me=arguments.callee;
                for(i in hash)if(fun?fun(i):true)h[i]=((v=hash[i])&&typeof v=='object')?me(v,fun):v;
                return h;
            }else return hash;
        },
        /*filter hash
        fun: filter function(will delete "return false")
        */
        filter:function(hash, fun, target){
            var i, bak={};
            for(i in hash)
                if(false===fun.call(target, hash[i], i, hash))
                    bak[i]=1;
            for(i in bak)
                delete hash[i];
        },
        /*asynchronous run function
        fun:target function
        defer: setTimeout defer time
        args: arguments for fun
        target: 'this' for fun
        */
        asyRun:function(fun, defer, args, target){
            //defer must set in opera
            return setTimeout(typeof fun=='string' ? fun : function(){fun.apply(target,args||[]);fun=args=null;}, defer||0);
        },
        /*
        this will always run newer function
        key: for identify
        fun: to run
        defer: setTimeout defer time
        args: arguments for fun
        target: 'this' for fun
        */
        resetRun:function(key, fun, defer ,args, target){
            var me=arguments.callee, cache = me.cache || (me.cache = {});
            if(cache[key]){clearTimeout(cache[key]);}
            if(_.isFun(fun))
                cache[key] = setTimeout(function(){fun.apply(target||null,args||[]);delete cache[key]},defer||0);
        },
        /*convert iterator to Array
        value: something can be iteratorred
        _.toArr({a:1},true) => [a];
        _.toArr({a:1},false) => [1];
        */
        toArr:function(value, flag){
            if(!value)return [];
            if(value.constructor==Array)return value;
            if(value.toArray)return value.toArray();
            var i,arr=[];
            //hash
            if(flag!==undefined)
                for(i in value)
                    arr.push(flag?i:value[i]);
            //other like arguments
            else{
                for(i=0; i<value.length; ++i)
                    arr[i]=value[i];
            }
            return arr;
        },
       /* output error message
       */
        Error:function(e){
            return e ? (e.message || e.description || e.toString()) :''
        }
    });

    /*serialize json like
    */
    var m ={
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
    },
    n={'$window$':'window','$this$':'this'},
    s ={
        'boolean': function(x){
            return String(x)
        },
        number: function(x){
            return isFinite(x) ? String(x) : 'null'
        },
        string: function (x) {
            //for special
            if(n[x])return n[x];

            if (/[\"\\\x00-\x1f]/.test(x))
                x = x.replace(/([\x00-\x1f\\\"])/g, function(a, b) {
                    var c = m[b];
                    if(c){return c;}
                    c = b.charCodeAt();
                    return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                });
            else if (/[^\x00-\xff]/.test(x))
                x = x.replace(/([^\x00-\xff])/g, function(a, b) {
                    c = b.charCodeAt();
                    return '\\u' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                });
            return '"' + x + '"';
        },
        object: function (x){
            var map = arguments.callee.map || (arguments.callee.map={prototype:1,constructor:1,toString:1,valueOf:1});
            if (x){
                var a = [], b, f, i, l, v;
                //for ie alien
                if((typeof x=='object' || typeof x=='function') && typeof x.constructor != 'function')
                    return "$alien";
                else if (x.constructor==Array){
                    a[0] = '[';
                    l = x.length;
                    for(i = 0; i < l; ++i){
                        v = x[i];
                        if(f = s[typeof v]){
                            v = f(v);
                            if(typeof v=='string'){
                                if (b)
                                    a.push(',');
                                a.push(v);
                                b = true;
                            }
                        }
                    }
                    a.push(']');
                }else{
                    if(typeof x.beforeSerialized == 'function')
                        x = x.beforeSerialized();
                    a[0] = '{';
                    for(i in x){
                        if(map[i])continue;
                        v = x[i];
                        if (f = s[typeof v]){
                            v = f(v);
                            if (typeof v=='string'){
                                if (b)
                                    a.push(',');
                                a.push(s.string(i), ':', v);
                                b = true;
                            }
                        }
                    }
                    a.push('}');
                }
                b=a.join('');
                a.length=0;a=null;
                return b;
            }
            return 'null';
        },
        'function':function(x){
            return x.$path?x.$path:String(x);
        }
    };
    /*serialize object to string
    bool/string/number/array/hash/simple function
    */
    _.serialize = function (obj, flag){
        var f = s[flag?'object':typeof obj];
        if(f && typeof(obj = f(obj))=='string')
            return obj;
        return null;
    };

    /*unserialize string to object
    */
    _.unserialize = function (str){
        try{
            if( str.trim().charAt(0) =='{')str = '(' + str + ')';
            return eval(str);
        }catch(e){
            return false;
        }
    };

    /*26 based id, replace 36based one, for: some number id can crash opera9
    */
    _.id=function(){
        var self=arguments.callee;
        if(this.constructor!==self || this.a)
            return (self._ || (self._= new self)).next();
        this.a=[-1];
        this.b=[''];
        this.value='';
    };
    _.id.prototype = {
        constructor:_.id,
        _chars  :"abcdefghijklmnopqrstuvwxyz".split(''),
        next : function(i){
            with(this){
                var m,k,l,i = _.numb(i ,b.length-1);
                if((m=a[i]) >= 25){
                    m=0;
                    if(i===0){
                        a.splice(0,0,1);
                        b.splice(0,0,'a');
                        l=a.length;
                        for(k=1;k<l;++k){
                            a[k]=0;
                            b[k]='0';
                        }
                        ++i;
                    }else
                      next(i-1);
                }else ++m;
                a[i]=m;
                b[i]=_chars[m];
                return value = b.join('');
            }
        }
    };
};
/*declare linb (global)
*/
new function(){
    /* declare linb
       set shortcut to linb.dom
       nodes:array
       flag:false, don't clean
    */
    linb=function(nodes,flag){return linb.dom.pack(nodes, flag)};
    _.merge(linb,{
        temp:{},
        debug:true,
        Locale:{},
        reLang:function(s){if(s && linb.lang!=s){linb.SC('linb.Locale.'+s);linb.lang=s}},
        getStr:function(a,b,c){b=Array.prototype.slice.call(arguments,1);return (c=_.get(linb.Locale[linb.lang], a.split('.'))) ? c.replace(/\x24\d+/g,function(){return b.length?b.shift() : ''}):a},
        /*
        set application main function, multi set will create a function array
        those functions will run after document loaded and before madie loaded
        example:
            linb.main(function(){
                ...
            });
        */
        main:function(fun){linb.dom.onload(fun)},
        /* set shortcut to linb.iBox.create
        */
        create:function(){return linb.iBox.create.apply(linb.iBox, arguments)},
        /* set shortcut for ajax
        */
        request:function(){return linb.ajax.apply(null, arguments).start()},
        /* object cache
        */
        _object:[],
        getObject:function(id){return linb._object[id]}
    });
};

/*Power function, array , and string
*/
new function(){
/*
   _.merge(Function.prototype,{
        body:function(){
            with (String(this))return slice(indexOf("{") + 1, lastIndexOf("}"));
        },
        args:function(){
            with (String(this)) return slice(indexOf("(") + 1, indexOf(")")).split(',');
        },
        clone:function(){
            return new Function(this.args(),this.body());
        }
    });
*/
    /*for string
    */
    _.merge(String.prototype,{
        //string to array according to input
        toArr:function(c){
            return this.split(c||',');
        },
        //string to hash
        //flag: true, get value; false, get key
        toHash:function(flag,c){
            var i,l,hash={},t,arr = this.toArr(c);
            for(i=0,l=arr.length; i<l; i++){
                if(flag)
                    hash[arr[i]]=1;
                else
                    if(t){
                        hash[t]=arr[i];t=0;
                    }else
                        t=arr[i];
            }
            arr.length=0;
            return hash;
        },
        left:function(len){
            return this.slice(0,len);
        },
        right:function(len){
            with(this) return slice(length-len,length);
        },
        exists:function(str){
            return this.indexOf(str)>-1;
        },
        startWith:function(str){
            return this.indexOf(str) === 0;
        },
        endWith:function (str) {
            var l = this.length - str.length;
            return l >= 0 && this.lastIndexOf(str) === l;
        },
        repeat:function(time){
            var arr=new Array(time+1);
            return arr.join(this);
        },
        initial:function(){
            return this.charAt(0).toUpperCase() + this.substring(1);
        },
        trim:function(){
            return this.ltrim().rtrim();
        },
        ltrim:function(){
            var s=arguments.callee;
            return this.replace(s.r||(s.r=/^ */),"");
        },
        rtrim:function(){
            var s=arguments.callee;
            return this.replace(s.r||(s.r=/ *$/),"");
        },
/*        blen : function(){
            var s=arguments.callee,
            _t=this.match(s.r||(s.r=/[^\x00-\xff]/ig));
            return this.length+(null===_t?0:_t.length);
        },
*/
        toDom:function(flag){
            var p=linb.dom.getTemp().html(this, false).get(0),t,r=[],i;
            //get nodes
            for(var i=0,t=p.childNodes,l=t.length;i<l;i++)r[r.length]=t[i];
            //clear
            if(flag!==false){
                if(linb.browser.ie)
                    while(t=p.firstChild)p.removeChild(t);
                else
                    p.innerHTML='';
            }
            return linb(r,false);
        }
    });
    /*for array*/
    _.merge(Array.prototype,{
        /*
        fun: fun to apply
        order: true - max to min , or min to max
        atarget: for this
        */
        each:function(fun,target,order){
            var i,l=this.length;
            target = target||this;
            if(!order){
                for(i=0; i<l; i++)
                    if(fun.call(target, this[i], i, this)===false)
                        break;
            }else
                for(i=l-1; i>=0; i--)
                    if(fun.call(target, this[i], i, this)===false)
                        break;
            return this;
        },
        indexOf:function(value) {
            for(var i=0, l=this.length; i<l; i++)
                if(this[i] === value)
                    return i;
            return -1;
        },
        subIndexOf:function(sub,value){
            for(var i=0, l=this.length; i<l; i++)
                if(this[i][sub] === value)
                    return i;
            return -1;
        },
        exists:function(value){
            return this.indexOf(value)>-1;
        },
        /*
         insert something to array
         arr: any
         index:default is length-1
         flag: is add array

         For example:
         [1,2].insert(3)
            will return [1,2,3]
         [1,2].insert(3,0)
            will return [3,1,2]
         [1,2].insert([3,4])
            will return [1,2,3,4]
         [1,2].insert([3,4],3,true)
            will return [1,2,[3,4]]
        */
        insert:function (arr, index, flag) {
            var a,l=this.length;
            index = index===0?0:(index||l);
            if(index<0 || index>l)index=l;
            a=this.splice(index,l-index);
            if(arr.constructor!=Array || flag)
                this[this.length]=arr;
            else
                this.push.apply(this, arr);

            this.push.apply(this, a);
            return index;
        },
        copy:function () {
            var i,l,arr=[];
            for(i=0, l=this.length; i<l; i++)arr[arr.length]=this[i];
            return arr;
        },
        /*each according to 'value'
        merge array
        arr: target to merge

        For example:
        [1,2].merge([2,3,4])
            will return [1,2,3,4]
        [1,2].merge([2,3,4],false)
            will return [1]
        */
        merge:function(arr,flag){
            var i,l;
            if(flag!==false){
                var copy=[];
                for(i=0, l=this.length; i<l; i++)copy[copy.length]=this[i];
                for(i=0, l=arr.length; i<l; i++)
                    if(copy.indexOf(arr[i])==-1)
                        this[this.length]=arr[i];
                copy.length=0;
            }else{
                for(i=0, l=this.length; i<l; i++)
                    if(arr.indexOf(this[i])>-1)
                        this.splice(i, 1);
            }
            return this;
        },
        swap:function(a,b){
            var t = this[a];
            this[a] = this[b];
            this[b] =t;
            return this;
        },
        remove:function(index,length){
            this.splice(index, length || 1);
            return this;
        },
        clean:function(){
            var i,l,a=this.copy();this.length=0;
            for(i=0, l=a.length; i<l; i++)
                if(this.indexOf(a[i])==-1)
                    this[this.length]=a[i];
           return this;
        },
        removeValue:function(value){
            for(var l=this.length,i=l-1; i>=0; i--)
                if(this[i]===value)
                    this.splice(i,1);
            return this;
        },
        /*
        filter array
        fun: return false will be delete
        */
        filter:function(fun,target){
            /*
            for(var l=this.length,i=l-1; i>=0; i--)
                if(fun.call(target||this,this[i],i,this)!==false)
                    this.splice(i,1);
            return this;
            */
            var i,l,arr=[],o;
            for(i=0, l=this.length; i<l; i++)arr[arr.length]=this[i];
            this.length=0;
            for(i=0, l=arr.length; i<l; i++)
                if(fun.call(target||arr,arr[i],i,arr)!==false)
                    this[this.length]=arr[i];
            return this;
        }
    },'all');
    Array.prototype.boxing = Array.prototype.reBoxing = function(key,flag){
        var t=linb.iBox.$type[key];
        if(t)return new (linb.SC(t))(this, flag);
    };
};

/*ini setting
linb.ini
*/
new function(){
    /*
    default is current path

    linb.ini():set path to current path
    linb.ini(p):set path to p
    */
    /*
    1.default is current path
    2.set window['$path']
    3.path parameter
    */
    linb.ini = function(path){linb.ini.path=path};
    _.merge(linb.ini,{
        //window id in cache
        id_window : "___window",
        //document id in cache
        id_document : "___document",
        //dom ele max index
        top_zIndex:10000,
        appPath:location.href.toArr('?')[0].replace(/[^\\\/]+$/,'')
    },'all');
  	var i, s, arr = document.getElementsByTagName('script'), reg = /js\/linb\.js$/;
	for(i=0; s=arr[i]; i++)
		if(s.src.match(reg)){
			linb.ini.path = s.src.replace(reg,'');
			break;
		}
    /*
    key: linb.UI.xxx
    tag: file tag
    add: appearance or bahavior
    example:
        linb.getPath('linb.UI.Button','','appearance') => linb.ini.path + /appearance/UI/Button/
        linb.getPath('linb.UI.Button','.gif','appearance') => linb.ini.path + /appearance/UI/Button.gif
        linb.getPath('a.b','','appearance') => linb.ini.appPath + /a/appearance/b/"
        linb.getPath('a.b','.gif','appearance') => linb.ini.appPath + /a/appearance/b.gif"
    */
    linb.getPath=function(key, tag, add){
        key=key.split('.');
        if(add)key.insert(add,1);

        var pre;
        if(key[0]=='linb'){
            pre=linb.ini.path;
            key.shift();
            if(key.length==(add?1:0))key.push('linb');
        }else{
            pre=linb.ini.appPath;
            if(key.length==((add?1:0)+1))key.push('index');
        }
        return pre + key.join('\/') + (tag||'\/');
    };
};

/*cache manager -- dynamic cache
*/
new function(){
    linb.cache={};
    'dom,domId,time,template,hookKey,event,thread,SC,text,block'.toArr().each(function(i){
        linb.cache[i]={};
    });
    _.merge(linb.cache,{
        //for time out set
        setTime : function(key, value, time){
            this.time[key]=value;
            _.asyRun('delete linb.cache.time["'+key+'"];', time || 60000);
        },
        getTime : function(key){
            return this.time[key] || null;
        }
    });
};


/*Class of LINB
*/
new function(){
    Class=function(key, parent_key, o){
        var temp,_Static={}, _Instance={}, _this, _parent=[], env=Class._fun, reg=Class._reg;
        o=o||{};

        /*multi parents
        */
        (parent_key = ( !parent_key?[]:typeof parent_key=='string'?[parent_key]:parent_key)).each(function(o,i){
            if(!(_parent[i]=(_.get(window, o.split('.')) || linb.SC(o))))
                throw new Error(linb.getStr('Class',o));
        });
        /* collect items
        */
        if(o.Static){
            _.filter(o.Static,function(o,i){
                return !reg[i];
            });
            _Static = o.Static;
        }

        //before and after will pass to children
        _Static.Before = o.Before || (_parent[0]&&_parent[0].Before);
        _Static.After = o.After || (_parent[0]&&_parent[0].After);
        _Static.$gc = o.$gc || _Static.$gc || function(){Class.$gc(this.$key);};

        if(o.Instance)_Instance = o.Instance;

        /*set constructor first and create _this
        upper is the first parent Class
        */
        if(typeof o.Constructor == 'function'){
            _this = env(o.Constructor, key, _.fun(_parent[0]));
            _this.Constructor = String(o.Constructor);
        }else{
            if(_parent[0]){
                // Constructor is for opera, in opear fun.toString can't get arguments sometime
                var f=_.fun(),str = _parent[0].Constructor;
                if(str)f=new Function(str.slice(str.indexOf("(") + 1, str.indexOf(")")).split(','), str.slice(str.indexOf("{") + 1, str.lastIndexOf("}")));
                _this = env(f, key, _parent[0].upper);
                _this.Constructor = str;
            }else
                _this = _.fun();
        }
        _this.KEY = _this.$key = _this.prototype.KEY = _this.prototype.$key = key;

         /*envelop current functions
         will cover the preview
         */
        //for Static
        Class._ob(_parent,_this, _Static);
        //for Instance
        Class._ob(_parent,_this.prototype, _Instance, false, true);

        /*inherit
        keep the last one
        */
        if(_parent.length)
            _parent.each(function(o,i){
                //keep upper
                temp=_this.upper;
                Class._ob(_parent, _this, o, true);
                _this.upper=temp;

                Class._ob(_parent, _this.prototype, o.prototype, true, true);
            });



        /*run before first
        */
        if(_.tryF(_this.Before, arguments, _this, true)===false)
            return false;


        /*multi parents
        */
        _parent.each(function(o,i){
            //push key is important in IE, for IE array refrence bug
            o=(o.$children || (o.$children=[]));
            if(!o.exists(key))o.push(key);
        });

        /*set symbol to _this
        */
        _this.$linb$ = true;
        _this.$children = [];
        _this.$parent = _parent;

        _this.prototype.constructor = _this;
        _this[key] = _this.prototype[key] = true;

        /*attached to global
        */
        _.set(window, _this.KEY.split('.'), _this);

        /*run after function
        */
        _.tryF(_this.After, [], _this);
        _.tryF(o.Initialize, [], _this);

        _parent.lenght=0;
        _Static=_Instance=_parent=o=null;
        /*return Class
        */
        return _this;
    };
    _.merge(Class,{
        _reg:'$key,$parent,$children,KEY,Static,Instance,Constructor,Initialize'.toHash(true),
        _reg2:"constructor,prototype,toString,valueOf".toHash(true),
        /*envelop a function by some keys
        */
        _fun:function(fun, original, upper){
            fun.$original$=original;
            if(upper)fun.upper = upper;
            return fun;
        },
        /*get parent item
        */
        _upper:function (o,i,flag){
            for(var r,v,j=0;v=o[j++];)
                if(typeof(r=(flag?v.prototype[i]:v[i])) == 'function')break;
            return r;
        },
        _other:["toString", "valueOf"],
        /*envelop object's item from an object
        target: target object
        src: from object
         i: key in hash
        limit: envelop values in a hash
        */
        _o:{},
        _ob:function (parent,target, src, inherit, instance){
            var i,j,o;
            for(i in src){
                //doesn't inherit $
                if(
                    (i in target)||
                    (i.charAt(0)=='$' && inherit) ||
                    this._reg2[i] ||
                    (!instance && this._reg[i])
                )continue;
                o=src[i];
                if(o && o.$linb$)continue;
                o = target[i] = (inherit || typeof o != 'function' || o.$ignore$) ? o : this._fun(o, target.KEY, this._upper(parent, i, instance) );
            }
            for(j=0;i=this._other[j++];){
                o=src[i];
                if(o && (o == this._o[i]))continue;

                o = target[i] = (inherit || typeof o != 'function' || o.$ignore$) ? o : this._fun(o, target.KEY, this._upper(parent, i, instance) );
            }
        },
        $gc:function(key){
            var t = _.get(window, key.split('.'));
            if(t){
                /*remove from SC cache
                */
                //linb.SC.remove(key);

                /*destroy children
                */
                if(t.$children)
                    t.$children.each(function(o){
                        o=_.get(window,o.split('.'));
                        o.$gc();
                    });

                t.$parent.length=t.$children.length=0;
                _.breakO(t);
                _.set(window, key.split('.'), null);
            }
        }
    });
};


/* linb.thread
don't use new linb.thread

parameters:
id: id of this thread, if input null, thread will create a new id
tasks: [task,task,task ...] or [{},{},{} ...]
    task: function
    or
    {
      task,      //function
      args,      //args array for task
      target,    //this object for task
      delay ,    //ms number
      callback   //function for callback
   }
delay:default delay time;
callback:default calback function;
onStart: on start function
onEnd: on end function
cycle: is the thread circular
*/
Class('linb.thread',null,{
    Constructor:function(id, tasks, delay, callback, onStart, onEnd, cycle){
        //for api call directly
        var self=arguments.callee;
        // linb.thread() => this.constructor!==self
        // in an inner method => !!this.id is true
        if(this.constructor!==self || !!this.id)
            return new self(id, tasks, delay, callback, onStart, onEnd, cycle);

        //in cache, saved profile
        var t=linb.cache.thread;
        if(typeof id!='string')id=_.id();
        this.id=id;
        //thread profile
        this.profile = t[id] || (t[id] = {
            id:id,
            start_flag:false,
            time:0,
            time_new:0,
            time_left:0,
            time_flag:-1,
            sleep_flag:-1,
            index:0,

            tasks:tasks||[],
            delay: delay || 0,
            callback:_.fun(callback),
            onStart:_.fun(onStart),
            onEnd:_.fun(onEnd),
            cache:{},
            status:"run",
            cycle:_.bool(cycle,false)
        });
    },
    Instance:{
        $gc:function(){
            var t=linb.cache.thread[this.id];
            if(t){
                _.breakO([t.tasks,t],2);
                delete linb.cache.thread[this.id];
            }
        },
        _task:function(){
            var p=this.profile;
            p.time_flag=-1;
            //ini task
            var t={args:[]},
            value=p.tasks[p.index];
            //get args
            if(typeof value == 'function') t.task=value;
            else _.merge(t, value , 'all');
            //maybe abort
            if(!t.task)return;
            //give default delay or callback
            _.merge(t,{
                    delay:p.delay,
                    callback:p.callback
            });
            //last arg is threadid
            t.args.push(p.id);
            //to next pointer
            p.index++;
            p.time=_.timeStamp();
            var r = _.tryF(t.task, t.args, t.target, null);
            //stop
            if(!p || p.status!=="run")return;
            //cache return value
            p.cache[t.id] = r;
            // call back function
            // if callback return false, stop.
            if(t.callback)
                if(false===_.tryF(t.callback, [p.id], null, true)){
                  p.status="stop";
                  return;
                }

            // if set Sleep at t.task or t.callback , stop continue running
            if(!p || p.status!=="run")return;
            _.tryF(this.start, [], this);
        },
        start:function(time){
            var p = this.profile;
            if(p.start_flag===false){
                p.start_flag=true;
                //call onstart
                if(false===_.tryF(p.onStart,[],this))this.abort();
            }
            if(!p.tasks.length)return this.abort();
            if(p.index>=p.tasks.length)
                if(p.cycle===true)
                    this.resetTo(0);
                else
                    return this.abort();

            var delay = p.tasks[p.index].delay;
            if(delay===undefined)delay=p.delay;
            p.time_left= (time || time===0)?time:delay;

            if(p.time_flag!=-1)clearTimeout(p.time_flag);
            p.time_flag = _.asyRun(this._task, p.time_left, [], this);
            p.time=_.timeStamp();
            return this;
        },
        suspend:function(){
            var n,p=this.profile;
            if(p.status=="pause")return;
            p.status="pause";
            if(p.time_flag!==-1){
                clearTimeout(p.time_flag);
                if(p.index>0)p.index--;
            }
            n=p.time_left-(_.timeStamp() - p.time);

            p.time_left=(n>=0?n:0);
            return this;
        },
        sleep:function(time){
            this.suspend();
            if(time || time===0){
                var self=this;
                if(self.profile.sleep_flag!=-1)
                    clearTimeout(self.profile.sleep_flag);
                else
                    self.profile.index++;
                self.profile.sleep_flag = _.asyRun(function(){self.resume();self.profile.sleep_flag=-1;self=null;},time);
            }
        },
        /*time
        number:set timeout to number
        true:set timeout to default
        false:set timeout to 0
        undefined: timetou to left
        */
        resume:function(time){
            if(this.profile.status=="run"){return;}

            time = typeof time=='undefined' ?
                    this.profile.time_left :
                        (time || time===0) ?
                        (time>=0)? time : 0 :
                        (time===true) ? this.profile.delay : 0
            ;

            this.profile.status="run";
            this.start(time);
            return this;
        },
        abort:function(){
            var _t=this.profile;
            clearTimeout(_t.time_flag);
            _.tryF(_t.onEnd, [_t.id]);
            this.$gc();
            return;
        },
        getStatus:function(){
            return this.profile.status;
        },
        isAlive:function(){
            return this.getStatus()=="run";
        },
/*
        merge:function(id){
            if(typeof id == 'string')
                id=linb.thread(id);

            var tasks = id.profile.tasks;
            this.insert(tasks,-1);
            id.abort();
            return this;
        },
*/
        insert:function(arr, index){
            if(arr.constructor!=Array)arr=[arr];
            index= index || this.profile.index;
            this.profile.tasks.insert(arr,index);
            var self=this;
            return this;
        },
        remove:function(index,len){
            index= index || this.profile.index;
            len=len ||1;
            this.profile.tasks.splice(index, len);
            return this;
        },
        getCache:function(key){
            return this.profile.cache[key];
        },
        setCache:function(key,value){
            this.profile.cache[key] = value;
            return this;
        },
        resetTo:function(index){
            this.profile.index =index||0;
            return this;
        }
    },
    After:function(){
        /*
        give shortcut to some functions
        */
        'start,suspend,resume,sleep,abort'.toArr().each(function(i){
            this[i]=function(id){
                var t;
                if(linb.cache.thread[id])
                    (t=linb.thread(id))[i].apply(t,Array.prototype.slice.call(arguments,1));
            };
        },this);
    },
    Static:{
        $gc : function(){
            linb.cache.thread={};
        },
        exists:function(threadid){
            return !!linb.cache.thread[threadid];
        },
        asyUI:function(threadid,tasks){
            //if thread exists, just inset task to the next positiong
            if(linb.cache.thread[threadid]){
                linb.thread(threadid).insert(tasks);
            //if does not exist, create a new thread
            }else{
                linb.thread(null, tasks,
                    0,null,
                    //set busy status to UI
                    function(){linb.dom.busy()},
                    //set free status to UI
                    function(){linb.dom.free()}
                ).start();
            }
        },
        /*group thread run once
        group: hash include thread or threadid
        callback: call after a thread finish
        onStart:before all threads start
        onEnd:after all threads end
        */
        group:function(id, group, callback,onStart,onEnd){
            var arr = _.toArr(group, true);
            return linb.thread(id, [function(threadid){
                linb.thread.suspend(threadid);
                _.each(group,function(o,i){
                    if(typeof o == 'string')o=linb.thread(o);
                    if(o){
                        var f = function(){
                            _.tryF(arguments.callee.onEnd,arguments,this);
                            arguments.callee.onEnd=null;
                            arr.removeValue(i);
                            //call callback here
                            _.tryF(callback,[i, threadid],this);
                            if(!arr.length)linb.thread.resume(threadid);
                        };
                        f.onEnd = o.profile.onEnd;
                        o.profile.onEnd = f;
                        o.start();
                    }
                });
            }],0,null,onStart,onEnd);
        }
    }
});

/*ajax
//linb.ajax
//args:

//cache: true or false
//cache_id: string
//cache_time: time

//threadid: thread id

*/
Class('linb.ajax',null,{
    Constructor:function(uri, queryString, onSuccess, onFail, asy, method, threadid, args){
        //get properties
        if(_.isObj(uri))
          args=uri;
        else{
          args=_.hash(args);
          _.merge(args, {
            uri:uri,
            queryString:queryString,
            onSuccess:onSuccess,
            onFail:onFail,
            asy:asy,
            method:method,
            threadid:threadid
          });
        }
        if((this.constructor !== arguments.callee) || this.id)
            return new arguments.callee(args);

        //give defalut value to those members
        _.merge(args,{
            id : args.id || _.id(),
            uri : _.str(args.uri),
            queryString  : encodeURIComponent((args.queryString||_.timeStamp()).toString()),
            asy : _.bool(args.asy, true),
            method : ['GET','POST'].exists(args.method)?args.method:'GET'
        },'all');

        //for cache
        if(args.cache){
            var t;
            args.cache_id = _.str(args.cache_id , (args.uri+"|"+args.queryString));
            args.cache_time=args.cache_time || 60000;
            //get from cache
            if(!args.cache_refresh)
                if(_.exists(t=linb.cache.getTime(args.cache_id)))
                    return _.tryF(args.onSuccess,[t]);
        }
        _.merge(this, args, 'all');
        _.merge(this, this.constructor._events,'without');

        return this;
    },
    Instance:{
        retry_time:2,
        request_timeout:10000,
        cache: false,
        start:function() {
            var self=this;
            try {
                with(this){
                    //must this.XMLHTTP, else opera will not set the new one
                   this._XMLHTTP = new XMLHttpRequest();
                   if(asy)
                       _XMLHTTP.onreadystatechange = function(){
                           if(self && self._XMLHTTP && self._XMLHTTP.readyState==4) {
                               self._complete.apply(self);
                               //must clear here, else memory leak
                               self._clear();
                           }
                       };

                    if (!_retryNo) {
                        _fireEvent("Start");
                        if(method != "POST"){
                            uri = uri.split("?")[0] + "?" + queryString;
                            queryString=null;
                        }
                    }

                    if(_XMLHTTP.overrideMimeType)
                          _XMLHTTP.overrideMimeType('text/xml');

                    _XMLHTTP.open(method, uri, asy);
                    if(method != "POST")
                        _XMLHTTP.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    _XMLHTTP.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            		if(_XMLHTTP.overrideMimeType )
            			_XMLHTTP.setRequestHeader("Connection", "close");
            	    //for firefox syc GET bug
                    try{_XMLHTTP.send(queryString);}catch(e){}

                    if(asy){
                      if(_XMLHTTP){
                          if(request_timeout > 0)
                              _timeout_id = _.asyRun(function(){if(self && !self._end){self._timeout()}}, request_timeout);
                      }
                    }else
                        _complete();
                }
            }catch(e){
                this._fireEvent("Error", e);
            }
            return this;
        },
        abort:function(){
            if(this._XMLHTTP){
                this._XMLHTTP.onreadystatechange=this._fun;
                this._XMLHTTP.abort();
                this._XMLHTTP=null;
            }
            this.$gc();
            return false;
        },
        _fun:function(){},
        _XMLHTTP:null,
        _timeout_id:0,
        _responseText:null,
        _responseXML:null,
        _end:false,
        _retryNo:0,
        _clear:function(){
            if(this._XMLHTTP){
                this._XMLHTTP.onreadystatechange=this._fun;
                this._XMLHTTP=null;
            }
        },
        $gc:function(){
            this._clear();
            _.breakO(this);
        },
        _message:function(s){
            linb.message(s);
        },
        _complete:function() {
            with(this){
                _responseText = _XMLHTTP.responseText;
                _responseXML = _XMLHTTP.responseXML;
                var status = _XMLHTTP.status;
                _fireEvent("Complete");
                if ([undefined ,0, 304].exists(status) || (status >= 200 && status < 300 ))
                    _fireEvent("Response");
                else
                    _fireEvent("Error", new Error(linb.getStr('XMLHTTP',status)));
            }
        },
        _timeout:function() {
            with(this){
                abort();
                _fireEvent("Timeout");
                if (_retryNo < retry_time) {
                    _retryNo++;
                    _fireEvent("Retry", _retryNo);
                    start();
                }else
                    _fireEvent("Error", new Error(linb.getStr("timout")));
            }
        },
        _fireEvent:function(n, o) {
            _.tryF(this["on" + n], [o], this);

            with(this){
                if(n=="Response" || n=="Error"){
                    _end=true;
                    if(_timeout_id>0){
                        clearTimeout(_timeout_id);
                        _timeout_id=0
                    }
                    _fireEvent("End");
                    $gc();
                }
            }
        }
    },
    Static:{
        _events:{
            onRetry:function(retry){
                this._message('retry:'+retry);
            },
            onTimeout:function(){
                this._message('timeout');
            },
            onStart:function(){
                linb.thread.suspend(this.threadid);
            },
            onEnd:function(){
                linb.thread.resume(this.threadid);
            },
            onResponse:function(){
                if(this.cache===true)
                    linb.cache.setTime(this.cache_id, this._responseText, this.cache_time);
                _.tryF(this.onSuccess,[this._responseText, this._responseXML, this.threadid], this);
            },
            onError:function(e){
                _.tryF(this.onFail,[_.Error(e)],this);
                this._message(_.Error(e));
            }
        },
        /*
        get multi ajax results once
        */
        group: function(group, callback, onStart, onEnd){
            _.each(group, function(o,i){
                group[i]=linb.thread(null,[function(threadid){
                    o.threadid=threadid;
                    o.start();
                }]);
            });
            return linb.thread.group(null, group, callback, onStart, onEnd);
        },
        /*
        get ajax multi results one by one on the background
        */
        background:function(arr, callback, onStart, onEnd, threadid){
            var i=0, fun=function(threadid){
                var o = arr[i++];
                o.threadid=threadid;
                linb.ajax(o).start();
                if(arr.length<=i)
                    return linb.thread(threadid).abort();
            };
            linb.thread(threadid||null, [fun], 100, callback, onStart, onEnd, true).start();
        }
    }
});


/*linb.SC : for straight call
path: linb.dom.Tabs
asy: true ,false, default false
threadid: fro asy===true
*/
Class('linb.SC',null,{
    Constructor:function(path, flag, onEnd, args){
        var p = linb.cache.SC;
        if(flag){
            args=_.hash(args);
            args.$type=1;
            args.$cb=onEnd;
        }
        return p[path]?
                p[path]:
                    (p[path]=_.get(window,path.split('.')))?
                        p[path]:
                            (p[path] = linb.SC._call(_.str(path), args, flag));
    },
    Static:{
        $gc:function(k){
            for(var i in linb.cache.SC)
                if(i.indexOf('.')==-1)
                    window[i]=undefined;
            linb.cache.SC={};
        },

        //get object from obj string
        evalPath : function (path, obj){
            var i,l,o = obj || window,
            arr = path.toArr('.');
            if(path=='')return o;
            for(i=0,l=arr.length; i<l; ++i)
                if (o[arr[i]]==undefined){
                    return null;
                }else
                    o = o[arr[i]];
            return o;
        },
        // function for "Straight Call"
        _call : function (s, args, flag){
            flag = !!flag;
            var i,t,r,o,funs=[],
            f= function(text,n,threadid){
                //prepare only
                if(this.$type==2){
                    (this.$cache || linb.cache.text)[this.$name]=text;
                    _.tryF(this.$cb,[this.$name,text,threadid]);
                }else{
                    // straight call
                    //linb.dom.addHeadNode(this.$tag,text,'js');
                    try{eval(text)}catch(e){throw new Error(linb.getStr('SC',_.Error(e) + this.$tag))}
                    //
                    // asy straight call
                    if(this.$type==1)_.tryF(this.$cb,[this.$name,text,threadid]);
                }
            },fe=function(text){
                //for prepare resume with error too
                if(this.$type==2)_.tryF(this.$cb,[this.$name,text,this.threadid]);
            };
            //get from object first
            if(!(r=linb.SC.evalPath(s))){
                //get text cache text
                if(t=linb.cache.text[s]){
                    f.call({$type:0},t);
                    //delete it
                    delete linb.cache.text[s];
                }
                //get from object second
                if(!(r=linb.SC.evalPath(s))){
                     //load from sy ajax
                     o=linb.getPath(s,'.js','js');
                     args = args ||{};
                     args.$tag = s;
                    //get text from sy ajax
                    linb.ajax(o, null, f, fe, flag, 'GET', null, args).start();
                    //for asy once only
                    if(flag)return false;
                    //get from object again and again
                    if(!(r=linb.SC.evalPath(s)))return false;
                }
            }
            return r;
        },
        /*
        arr: key array, ['linb.UI.Button','linb.UI.Input']
        callback: fire this function after all js loaded
        */
        prepare:function(arr,cache,callback,onEnd, id){
            var a=arr.copy(),args = {$type:2,$cache:cache};
            if(callback||onEnd){
                args.$cb=function(key,str){
                    //give callback call
                    _.tryF(callback,[key,str]);
                    a.removeValue(key);
                    if(!a.length&&!a.ok){_.tryF(onEnd,[id]);a.ok=1;onEnd=null;}
                };
            }
            arr.each(function(s){
                var h = _.copy(args);
                h.$name=s;
                if(this._call(s, h, true)){
                    //if load already
                    a.removeValue(s);
                }
            },this);
            //if all loaded already
            if(!a.length&&!a.ok){_.tryF(onEnd,[id]);a.ok=1;onEnd=null;}
        },
        background:function(arr, callback, onStart, onEnd, id){
            var i=0, fun=function(threadid){
                linb.SC._call(arr[i++], {threadid:threadid},true);
                if(arr.length<=i){
                    linb.thread(threadid).abort();
                    return false;
                }
            };
            linb.thread(id||null, [fun], 1000, callback, onStart, onEnd, true).start();
        },
        clearPrepare:function(){
            _.each(linb.cache.text,function(o,i){
                try{eval(o)}catch(e){linb.getStr('SC',_.Error(e))}
            });
            linb.cache.text={};
        },
        //asy load multi js file, whatever dependency
        /*
        *1.busy UI
        *3.linb.SC.group some js/class
        *4.resume thread
        *5.linb.SC.prepare other js/class
        *6.execute other ..
        *7.free UI
        */
        group:function(arr, callback, onEnd, id){
            //clear first
            var self=this;
            this.clearPrepare();
            this.prepare(arr, linb.cache.text, callback, function(){
                self.clearPrepare();
                _.tryF(onEnd,[id]);
                onEnd=null;
            },id);
        }
    }
});


/* for firefox only
*/

;;;new function(){
;;;    linb.log=function(){
;;;        if(linb.browser.gek && window.console){
;;;            console.log.call(console, [_.toArr(arguments), (_.timeStamp() - linb.log.time )+"ms"]);
;;;            linb.log.time = _.timeStamp();
;;;        }
;;;    };
;;;};


/* linb.event: for event handler
*/
Class('linb.event',null,{
    Constructor:function(e,o){
        var src, type, id, self = linb.event, dd=0, pre, obj;
        //get event object , and src of event
        if(!(e=e||window.event) || !(src=o))return false;

        type = e.type;
        o=self.getSrc(e);
        //use ===
        id = linb.dom.getId(src) || '';

        //for focusHook
        if((obj=self.focusHook).length)
            if(self._kb[type] && false === self._handleFocusHook(src, obj=obj[obj.length-1])){
                linb([obj],false).nextFocus();
                return;
            }

        //for correct mouse hover problemrue;
        if('mouseover'==type || 'mouseout'==type){
            dd=linb.dragDrop.drop2?1:2;

            //don't return flase, here, opera will stop the system event hander => cursor not change
            if(!self._handleMouseHover(e, src, o, dd==1))
                return;

            if(dd==1)
                pre=linb.dragDrop._current;
        //for innerHTML fire onresize in IE, ignore window.onresize
        }else if(linb.browser.ie && 'resize'==type && o && !e.width && !e.height)
            return false;

        //get profile from dom cache
        if(obj = self._getProfile(id)){
            var j, f, name, r=true, funs=[];
            //order by: before, on, after
            for(j=0; j<=2; ++j){
                //if in dd, get before Mouse.. only
                if(dd==1 && j!==0 && !e.$force)break;
                //if not in dd, get on/after Mouse.. only
                if(dd==2 && j===0)continue;
                //get event name from event type
                name = self._typeCache[type+j] || ( self._typeCache[type+j] = linb.dom._getEventName(type, linb.dom._eventtag[j]));
                /*
                e.$e : called by fireEvent
                e.$all : fire all events of the type: before/on/after
                e.$name : fire one group of event of the type.
                */
                if(!e.$e || e.$all || (name==e.$name))Array.prototype.push.apply(funs, obj.getEV(id, name));
            }

            /*call function by order
             widget before -> dom before -> widget on -> dom on -> widget after -> dom after
            */
            f=function(){
                var i, v, o = arguments.callee.funs;
                for(i=0;v=o[i++];)
                    //if any fun return false, stop event bubble
                    if(false === v.call(src, obj, e, src, o, type, name))
                        return false;
                return true;
            };
            f.funs=funs;
            r = f();

            //shortcut for onDrag('mousemove')
            if(type=='drag')
                linb.dragDrop._onDrag=f;
            else if(type=='dragover')
                linb.dragDrop._onDragover=f;

            if(dd==1){
                //if from parent dd, fire parent dd mouseout
                if('mouseover'==type && linb.dragDrop._current==src && pre && pre!=src){
                    linb(pre).beforeMouseout();
                    linb.dragDrop._current=src;
                }
                //if dd out, fire next event manually
                if('mouseout'==type && !linb.dragDrop._current && pre && pre==src){
                    self._ddtemp=id;
                    _.asyRun(function(){delete linb.event._ddtemp});
                }

                //if fire dd, prevent to fire parent dd
                if(src==linb.dragDrop._current)
                    r=false;
            }
            if(r===false)self.stopBubble(e);
            return r;
        }
    },
    Static:{
        _typeCache:{},
        _kb:'keydown,keypress,keyup'.toHash(true),
        focusHook:[],
        _reg:/([\.\w]+)(-[\.\w]+)?(:[\w]+:)([\w]+)?/,
        _getProfile:function(id){
            return linb.cache.dom[id.replace(this._reg,'$1$3')];
        },
        _handleFocusHook:function(src, target){
            if(src==document)return true;
            var node=src;
            do{
                if(node==target)return true;
            }while((node && (node=node.parentNode)))
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
        getSrc:function(e){
            var a = e.target || e.srcElement || null;
            // defeat Safari bug
            if(linb.browser.kde && a) a = (a.nodeType == 3)?a.parentNode:a;
            return a;
        },
        // only for mousedown and mouseup
        // return 1 : left button, else not left button
        getBtn:function(e){
            return e.which || e.button || 0;
        },
        getPos:function(e){
            e = e || window.event;
            if(e.pageX !== undefined)
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
                        t = arguments.callee.map =
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
                        ).toHash();
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
            var p = linb.cache.hookKey, k = _.str(key).toLowerCase() + ":"  + (ctrl?'1':'') + ":"  +(shift?'1':'')+ ":" + (alt?'1':'');
            if(fun===null)delete p[k];
            else p[k]=[fun,args,target];
            return this;
        }
    }
});

//linb.iBox
Class('linb.iBox',null, {
    Before:function(key, parent_key, o){
        if(linb.iBox)linb.iBox.$type[key.replace("linb.","")]=linb.iBox.$type[key]=key;
    },
    Instance:{
        ini:function(){return this},
        get:function(index){
            return  this._nodes[index]||this._nodes;
        },
        set:function(value,index){
            if(_.isNumb(index))
                this._nodes[index] = value;
            else
                this._nodes = value;
            return this;
        },
        create:function(){
            return this;
        },
        length:function(){
            return this._nodes.length;
        },
        each:function(fun){
            for(var i=0,j=this._nodes,l=j.length;i<l;i++)
                if(false===fun.call(this,j[i],i))
                    break;
            return this;
        },
        push:function(o){
            return this._nodes.push(o);
        },
        pop:function(){
            return this._nodes.pop();
        },
        exists:function(node){
            return this._nodes.exists(node);
        },
        isEmpty:function(){
            return !this._nodes.length;
        },

/*
        mark:function(key){
          (this._mark || (this._mark ={}))[key] = this._nodes.copy();
          return this;
        },
        toMark:function(key){
          this._nodes = this._mark[key];
          return this;
        },
*/
        //flag is ture => minus
        add:function(e, flag){
            var arr = this.constructor.clean(e);
            this._nodes.merge(arr, flag);
            return this;
        },
        minus:function(e){
            return this.add(e, false);
        },
        unBoxing:function(){
            return this.get();
        },
        //flag: true => clean input array
        reBoxing:function(key,flag){
            var t=linb.iBox.$type[key||'dom'];
            if(t==this.KEY)return this;
            if(t=linb.SC(t))return t.pack(this._nodes, flag);
        }
    },
    Static:{
        $type:{},
        pack:function(e, flag){
            var o = new this(false);
            o._nodes = e ? flag===false ? e : this.clean(e) : null;
            return o;
        },
        clean:function(e){
            return e;
        },
        plugIn:function(key, fun){
            this.prototype[key]=fun;
            return this;
        },
        support:function(key){
            return typeof this.prototype[key]=='function';
        },
        //create:function(tag, properties, events, host, template, behavior, appearance, children){
        create:function(tag, id){
            var arr,o, t,self=arguments.callee,r1=self.r1||(self.r1=/^\s*<((\n|\r|.)*?)>\s*$/);
            if(tag.constructor==Array){
                arr=[];
                tag.each(function(v,i){
                    arr.insert(self.apply(null,v instanceof Array?v:[v])._nodes,-1);
                });
                return arr;
            }
            if(typeof tag == 'string'){
                // text node
                if(id===true)
                    o = linb([document.createTextNode(tag)],false);
                // linb widgets
                else if(t=linb.iBox.$type[tag]){
                    arr=[];
                    //shift will crash in opera
                    for(var i=1,l=arguments.length;i<l;i++)
                        arr[i-1]=arguments[i];
                    o =new (linb.SC(t))(false);
                    o.ini.apply(o, arr).create();
                }else if(r1.test(tag))
                    o = tag.toDom();
                //normal
                else{
                    o=document.createElement(tag);
                    o.id = typeof id=='string'?id:_.id();
                    o=linb(o);
                }
            // linb widgets
            }else
                o =new (linb.SC(tag.key))(tag).create();

            return o;
        }
    }
});

Class('linb.iProfile');
Class('linb.DomProfile', 'linb.iProfile', {
    Instance:{
        $gc:function(){
            var t;
            if(this.addition&&(t=this.domNode))
                _.each(this.addition,function(o,i){
                    t[i]=null;
                },this);
            t=linb.cache.dom[this.id]=null;
        },
        getEV:function(id, name){
            var funs=[],t;
            if(t=_.get(linb.cache.dom,[id, 'events',name]))
                for(var i=0,l=t.length;i<l;i++)
                    if(typeof t[t[i]]=='function')
                        funs[funs.length]=t[t[i]];
            return funs;
        }
    }
});

new function(){
    //browser sniffer
    var u = navigator.userAgent, dom = linb.dom, b=linb.browser={
        kde:u.indexOf('AppleWebKit/') > -1,
        opr:!!window.opera,
        ie:!!(window.attachEvent && !window.opera),
        gek:u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1
    };
    if(b.ie){
        if(u.indexOf(' 7')!=-1)
            b.ie7 = true;
        else
            b.ie6 = true;
    }
    b.contentBox = function(){
		if((linb.browser.ie)||(linb.browser.opr)){
			return (["BackCompat","QuirksMode"].exists(document["compatMode"]))? false : true;
		}else{
		    var node = document.documentElement;
			return (node = node.style["-moz-box-sizing"] || node.style["box-sizing"] || null) ? (node==="content-box") : true;
		}
	}();
};
/*linb.dom
*/
/*
using those cross browser functions in dom only
//create:
createElement()
//attr:
nodeName:className:id:style
nodeType(1[Element nodes],other[Attribute nodes],3[Text nodes],9[Document node])

// get
getElementById():getElementsByTagName():item()
//notice document.getElementsByTagName('*') doesn't work in Explorer 5 Windows.

//change
x.innerHTML = ''; x.innerHTML = text
//notice:set '' first

//modify
insertBefore():removeChild():replaceChild():appendChild()
//notice: IE 5 Windows crashes when you append an option  to a select.
cloneNode()
//notice: Explorer 5 Mac doesn't clone the event handlers of the element.

//list
hasChildNodes():childNodes[](all nodes):parentNode:firstChild:lastChild:nextSibling:previousSibling
===============
*/
/*
    linb(window)
    linb(document)
    linb("id")
    linb(["id1","id2","id3"...])
    linb(linb(...))
    linb(node)
    linb([node,node,node,...])
    linb(fun):fun will reutun dom node array
    linb(selector express): must conclude "[]"
        "[]": all
        "div[]": all div
        "div[id='id1'] input[]": all input in id1
        "div[class~='a'],div[class~='b']": all class a or b
        "div[id='div4'] input[class~='c'][class~='a'], div[id='div5'] input[class~='ac']"
            in 'div4', select class includes 'c' and 'a'
            in 'div5', select class includes 'ac'
            and return those all
        ...
*/
Class('linb.dom','linb.iBox',{
    Instance:{
        //keep id cache in linb.cache.dom
        //if widgets, value is serial id.
        id:function(value,flag){
            var t,f=arguments.callee.f||(arguments.callee.f=function(o, value,flag){
                if(!flag)
                    if(t = linb.cache.dom[o.id]){
                        linb.cache.dom[value] = t;
                        delete linb.cache.dom[o.id];
                    }
                o.id = value;
            });
            if(typeof value == 'string')
                return this.each(function(o){
                    f(o, value, flag);
                });
            else
                return this.get(0).id;
        },

        //dom collection:
        /*dom cellect wrap function
        selector: selector expression
        flag: true => not select just filter
        fun: fun to run
        args: arguments for fun
        */
        $sum:function(fun, args){
            var arr=[],r;
            this.each(function(o){
                r=fun.apply(o, args||[]);
                if(r)arr.insert(r);
            });
            return linb(arr,false);
        },
        /*get all dir children
        */
        children:function(){
            return this.$sum(function(){
                return _.toArr(this.childNodes)
            });
        },
        /* clone
         deep for cloneNode
        */
        clone:function(flag){
            return this.$sum(function(flag){
                return this.cloneNode(flag?true:false);
            },arguments);
        },
        /* iterator
        // type: left : x-axis,  top :y-axis, xy: x-axis and y-axis
        // dir : true => left to right; top to buttom, false => right to left ; bottom to top
        // inn: does start consider children
         fun : number or function => number is iterator index; function is "return true ->stop"
        */
        $iterator:function(type, dir, inn, fun, top){
            return this.$sum(function(type, dir, inn, fun, top){
                var self=arguments.callee;
                if(typeof fun != 'function'){
                    var count=fun||0;
                    fun = function(n,index){return index==count;}
                }
                var index=0,m,n=this,flag=0,t;
                while(n){
                    if(n.nodeType==1)
                        if(fun(n, index++)===true)break;

                    //x-axis true: right ;false: left
                    if(type=='x')
                        n= dir?n.nextSibling:n.previousSibling;
                    //y-axis true: down ;false: up
                    else if(type=='y')
                        n= dir ? self.call(dir===1?n.lastChild:n.firstChild, 'x',(dir!==1), true, 0, top) : n.parentNode;
                    else{
                        inn=_.bool(inn, true);
                        m=null;
                        n= dir ?
                                 (t = inn && n.firstChild ) ? t
                                              : (t = n.nextSibling ) ? t
                                                              :(m=n.parentNode)
                               : (t = inn && n.lastChild) ? t
                                              : (t = n.previousSibling ) ? t
                                                              :(m=n.parentNode);
                        if(m){
                            while(!( m = dir ? n.nextSibling: n.previousSibling)){
                                n=n.parentNode;
                                //to the top node
                                if(!n)
                                    if(flag)
                                        return null;
                                    else{
                                        flag=true;
                                        m = dir ? document.body.firstChild : document.body.lastChild;
                                        break;
                                    }
                            }
                            n=m;
                        }
                        inn=true;
                    }
                }
                return n;
            },arguments);
        },
        /*
        dig('div');
        dig('div','class');
        dig('div','class','cls');
        dig('div','class',/^cls/);
        */
        dig:function(tag, attr, exp){
            tag = tag||'*';
            var me=arguments.callee,f1=me.f1||(me.f1=function(tag, attr, exp){
                var all = this.getElementsByTagName(tag), arr=[];
                if(exp.test(this[attr]))
                    arr[arr.length]=this;
                for(var o,i=0; o=all[i]; i++)
                    if(exp.test(o[attr]))
                        arr[arr.length]=o;
                return arr;
            }),f2=me.f2||(me.f2=function(tag, attr, exp){
                var all = this.getElementsByTagName(tag), arr=[];
                if(this[attr]==exp)
                    arr[arr.length]=this;
                for(var o,i=0; o=all[i]; i++)
                    if(o[attr]==exp)
                        arr[arr.length]=o;
                return arr;
            }),f3=me.f3||(me.f3=function(tag, attr, exp){
                var all = this.getElementsByTagName(tag), arr=[];
                if(this[attr])
                    arr[arr.length]=this;
                for(var o,i=0; o=all[i]; i++)
                    if(o[attr])
                        arr[arr.length]=o;
                return arr;
            }),f4=me.f4||(me.f4=function(tag){
                return _.toArr(this.getElementsByTagName(tag));
            }),f5=me.f5||(me.f5=function(tag, attr){
                var all = this.getElementsByTagName(tag), arr=[];
                if(attr(this))
                    arr[arr.length]=this;
                for(var o,i=0; o=all[i]; i++)
                    if(attr(o))
                        arr[arr.length]=o;
                return arr;
            });
            return this.$sum(attr?typeof attr=='function'?f5:exp?exp.constructor == RegExp?f1:f2:f3:f4, [tag, attr, exp]);
        },
        /*
        No need selector in linb
        select:function(){
        },
        */
//add
        /*
        dom add implementation
        for addPre addFirst addNext addLast

        fun :for wrap
        o: to added target
        flag: false for add one only, not clone
        */
        $add:function(fun,target){
            target=linb(target);
            var v=this.get(0);
            target.each(function(target){
                fun.call(v,target);
            });
            return this;
        },
        addPre:function(target){
            return this.$add(function(target){
                if(this.previousSibling!=target)
                    this.parentNode.insertBefore(target,this);
            },target);
        },
        addFirst:function(target){
            return this.$add(function(target){
                if(this.firstChild!=target){
                    if(this.firstChild)
                        this.insertBefore(target, this.firstChild);
                    else
                        this.appendChild(target);
                }
            },target);
        },
        addLast:function(target){
            return this.$add(function(target){
                if(this.lastChild!=target)
                    this.appendChild(target);
            },target);
        },
        //add to last, and trigger Triggers
        attach:function(target){
            var o=this.get(0), ui, t;
            if(target['linb.Profile'])target=target.boxing();
            if(_.isArr(target))target=linb.iBox.pack(target, false);
            if(!target['linb.iBox'])target=target.boxing();

            //ensure to dom first
            ui = target.create();

            //add dom node
            target.each(function(v){
                if((v.domNode || v).parentNode !=o)
                    o.appendChild(v.domNode || v);
                if(t=v.envTrigger)
                    for(var i=0,l=t.length;i<l;i++)
                        t[i].call(v);
            });
            return this;
        },
        addNext:function(target){
            var t;
            return this.$add(function(target){
                if((t=this.nextSibling)!=target){
                    if(t)
                        this.parentNode.insertBefore(target, t);
                    else
                        this.parentNode.appendChild(target);
                }
            },target);
        },
        addToPre:function(target){
            linb(target).addPre(this);
            return this;
        },
        addToFirst:function(target){
            linb(target).addFirst(this);
            return this;
        },
        addToNext:function(target){
            linb(target).addNext(this);
            return this;
        },
        addToLast:function(target){
            linb(target).addLast(this);
            return this;
        },

//change
        //flag: false => no remove this from momery(IE)
        replace:function(target, flag){
            var r,v;
            target=linb(target);
            if(v=target.get(0)){
                this.get(0).parentNode.replaceChild(v,this.get(0));
                //for memory $gc
                this.remove(flag);
                r=linb([v],false);
                if(target instanceof Array)
                    for(var i=1,l=target.length; i<l; i++)
                        r.addNext(target[i]);

            }
            return r;
        },
        swap:function(target){
            target=linb(target);
            var t = linb.dom.getTemp().html('*',false);
            this.replace(t,false);
            target.replace(this,false);
            t.replace(target,false);
            linb([document.body],false).addFirst(t.empty(false));
            return this;
        },
        //str must include "{*}"
        wrap:function(str){
            var s;
            return this.each(function(o,i){
                o=linb([o],false);
                o.outerHTML(str.replace('{*}', o.outerHTML()));
            });
        },
        //flag : true => remove from dom tree, not free memory
        remove:function(flag){
            if(flag===false)
                this.each(function(o,i){
                    if(o.parentNode)o.parentNode.removeChild(o);
                });
            else
                linb.dom.getTemp().addLast(this).empty();
        },
        //set innerHTML empty
        //flag = true: no gc
        empty:function(flag){
            return this.each(function(o){
                linb([o],false).html('',flag);
            });
        },
        //call $gc dir
        gc:function(){
            linb.dom.$gc();
            return this;
        },
        //flag = false: no gc
        html:function(str,flag){
            var s='',t,bak,o=this.get(0);flag=typeof flag=='undefined'?true:flag;
            if(typeof str!='undefined'){
                if(o.nodeType==3)
                    o.nodeValue=str;
                else{
                     if(!(bak=o.firstChild) && str=="")return this;
                     // innerHTML='' in IE, will clear it's childNodes innerHTML
                     if(!flag && linb.browser.ie)while(t=o.firstChild)o.removeChild(t);
                     //clear first
                     if(flag)o.innerHTML='';

                     o.innerHTML=str;
                     // set flag->true will not gc
                     // no original innerHTML will not gc
                     // use resetRun for performance
                     if(flag && bak)
                        _.resetRun('dom.$gc', linb.dom.$gc, 300);
                }
                return this;
            }else
                return (o.nodeType==3)?o.nodeValue:o.innerHTML;
        },
        outerHTML:function(str,flag){
            var t,s='',o=this.get(0),id=o.id;
            if(!linb.browser.gek)
                if(typeof str!='undefined'){
                    // some memory leak
                    this.html('');
                    if(!flag && (t=linb.cache.dom[id]))t.$gc();
                    o.outerHTML=str;
                }else
                    return o.outerHTML;
            else{
                if(typeof str!='undefined')
                    this.replace(str.toDom(),flag);
                else{
                    var self=this.get(0), m = linb.dom.getTemp(), n = linb.dom.getTemp(2), np=n.parent(), p;
                    //has parentNode, need keep node in this way
                    if(p=self.parentNode)this.replace(n, false);
                    //set to box
                    m.addLast(self);
                    //get string
                    s = m.html();
                    //set back
                    if(p)n.replace(self, false);
                    m.empty();
                    np.addFirst(n);
                    return s;
                }
            }
            return this;
        },
        text:function(str){
            var s='';
            if(typeof str!='undefined')
                return this.each(function(o){
                    var b=false,m,n=o;
                    while(m=n.childNodes[0]){
                         if(m.nodeType!=1){
                            m.nodeValue = str;
                            b=true;break;
                         }
                         n=m;
                    }
                    if(!b)n.innerHTML = str;
                });
            else{
               var f=function(o){
                  var i,a=o.childNodes,l=a.length,str='';
                  for(i=0;i<l;i++)
                    if(a[i].nodeType!= 8)
                      str += (a[i].nodeType!=1) ? a[i].nodeValue : f(a[i]);

                  return str;
                };
                this.each(function(o){
                    s+=f(o);
                });
                return s;
            }
        },

//chang profile
        /*
        attr('width','0'): set width = 0
        attr('width'): get width
        attr('width',null): try to remove width
        attr({width:3,height:4})
        */
        attr:function(key, value){
            //set one time only
            var t, me = arguments.callee, map = me.map || (me.map = {
                'class':'className',
                className:'className',
                'for':'htmlFor',
                value: "value",
                disabled: "disabled",
                checked: "checked",
                selected:'selected',
                readonly: "readOnly"
            });
            if(( t = (typeof key != 'string') )|| value !==undefined ){
                if(!t){
                     t={};t[key]=value;key=t;
                }
                _.each(key,function(value,key){
                  if(value===null)
                      this.each(function(o){
                          if(map[key])
                            o[map[key]]=null;
                          else if(o.removeAttribute)
                             o.removeAttribute(key);
                          else
                            o[key]=null;
                      });
                  else
                    this.each(function(o){
                        if(map[key])
                            o[map[key]]=value;
                        else{
                            if(o.setAttribute)o.setAttribute(key,value);
                            //try{
                            o[key]=value
                            //}catch(e){}
                        }
                    });

                },this);
                return this;
            }else{
                var o=this.get(0);
                return map[key] ? o[map[key]] : ((o.getAttribute?o.getAttribute(key):0) || o[key]);
            }
        },
        setPxStyle:function(key, value){
            var f=linb.dom.setPxStyle;
            return this.each(function(o){
                f(o,key,value)
            });
        },
        /*
        format: 'xxxYxx', not 'xxx-yyy'
        not for opacity
        left/top/width/height like, must specify 'px'
        not fire onResize onlocation event
        */
        setStyle:function(key, value){
            return key=='opacity'?this.opacity(value):this.each(function(o){
                if(o.nodeType!=1)return;
                if(typeof key == 'string')
                    o.style[key]=value;
                else
                    for(var i in key){
                        if(i=='opacity')
                            linb([o],false).opacity(key[i]);
                        else
                            o.style[i]=key[i];
                    }
            });
        },
        /*
        flag:false or not set for get from <style
        flag:ture for get from css class or other
        return 1px like
        */
        getStyle:function(key, flag){
            var o = this.get(0);
            return o.nodeType!==1?'':key=='opacity'?this.opacity():linb.dom.getStyle(o, key, flag);
        },
        opacity:function(value){
            if(value !==undefined ){
                var key;
                value=parseFloat(value)||0;
                value= value >0.9999 ? '' : linb.browser.ie ? "alpha(opacity="+ 100*value +")" : value;
                return this.each(function(o){
                    if(o.nodeType != 1)return;
                    style=o.style;
                    if(linb.browser.ie){
                        key='filter';
                        value = style.filter.replace(/alpha\([^\)]*\)/ig, "") + value;
                    }else
                        key='opacity';
                    style[key]=value;
                });
            }else{
                var node=this._nodes[0];
                if(!node || node.nodeType != 1)return 1;

                var style=node.style;
                if(linb.browser.ie) {
                    value = style.filter?(parseFloat(style.filter.match(/alpha\(opacity=(.*)\)/)[1] )||0)/100:1;
                }else
                    value = style.opacity;
                return value;
            }
        },
        show:function(left,top){
            var style,t;
            return this.each(function(o){
                if(o.nodeType != 1)return;
                style=o.style;
                if(t = top || o._top)style.top = t;
                if(t = left|| o._left)style.left = t;
                style.visibility='visible';
                //ie6 bug
                if(linb.browser.ie6){
                    style.wordWrap='break-word';
                    style.wordWrap='normal';
                }
            });
        },
        hide:function(){
            var style,t;
            return this.each(function(o){
                if(o.nodeType != 1)return;
                style=o.style;t=linb([o],false);
                o._top = t.getStyle('top'); o._left = t.getStyle('left');
                style.visibility='hidden';
                style.top = style.left = '-10000px';
            });
        },
        setRegion:function(hash,flag,force) {
            var i,t,m, node=this._nodes[0],f=linb.dom.setPxStyle,me=arguments.callee;
            if(!me.b){
                m=me.b={};
                for(i=0;t=linb.dom.boxArr[i++];)m[t]=0;
            }else m=me.b;
            for(var j=0,c=linb.dom.boxArr;i=c[j++];)
                m[i] = ((i in hash) && hash[i]!==null)?f(node,i,hash[i]):false;

            if(flag){
                if(force)m.width=m.height=m.left=m.top=true;
                if(linb.dom.hasHandler(node,'onresize') && (m.width||m.height))this.onResize(true, {width:m.width,height:m.height});
                if((linb.dom.hasHandler(node,'onlocation') && m.left||m.top))this.onLocation(true, {left:m.left,top:m.top});
            }
            return this;
        },
        //for quick size
        cssSize:function(size,flag) {
            var node=this._nodes[0],f=linb.dom.setPxStyle,b1,b2;
           if(size){
                var t;
                b1 = size.width!==null?f(node,'width',size.width):false;
                b2 = size.height!==null?f(node,'height',size.height):false;
                if(flag && (b1||b2) && linb.dom.hasHandler(node,'onresize'))this.onResize(true, {width:b1,height:b2});
                return this;
            }else
                return { width :this.W(node,1)||0,  height :this.H(node,1)};
        },
        //for quick move
        cssPos:function(pos, flag){
            var node=this._nodes[0],f=linb.dom.setPxStyle,b1,b2;
            if(pos){
                var t;
                b1 = pos.left!=null?f(node,'left',pos.left):false;
                b2 = pos.top!==null?f(node,'top',pos.top):false;
                if(flag && (b1||b2) && linb.dom.hasHandler(node,'onlocation'))this.onLocation(true, {left:b1,top:b2});
                return this;
            }else{
                f=linb.dom.getStyle;
                return {left :parseInt(f(node, 'left'))||0,  top :parseInt(f(node, 'top'))||0};
            }
        },

        getRegion:function(flag, parent){
            var pos = flag?this.absPos(parent):this.cssPos(),size = this.cssSize();
            return {
                left:pos.left,
                top:pos.top,
                width:size.width,
                height:size.height
            };
        },
/*        toAbsolute:function(){
            var t,pos;
            return this.each(function(o){
                if((t=linb([o],false)) &&t.position() != 'absolute'){
                    pos = t.absPos();
                    t
                    .position('absolute')
                    .absPos(pos);
                }
            });
        },
*/
/*
+--------------------------+
|margin                    |
| #----------------------+ |
| |border                | |
| | +------------------+ | |
| | |padding           | | |
| | | +--------------+ | | |
| | | |   content    | | | |

# is the absPos position in jsLinb
*/
        absPos:function (pos,target){
            var r,t,
            node = this.get(0),
            getStyle=linb.dom.getStyle,
            me=arguments.callee,
            type = me.type ||(me.type = {body:1,html:1}),
            posDiff=me.posDiff ||(me.posDiff=function(o,target){
                var cssPos = o.cssPos(),absPos = o.absPos(null,target);
                return {left :absPos.left-cssPos.left, top :absPos.top-cssPos.top};
            });

            target=target?linb(target).get(0):document;

            if(pos){
                //all null, return dir
                if(pos.left===null&&pos.top===null)return this;
                var d = posDiff(this,target);
                this.cssPos({left :pos.left===null?null:(pos.left - d.left),  top :pos.top===null?null:(pos.top - d.top)});
                r=this;
            }else{
              pos = {left :0, top :0};
              var bak=node,bak2,m;
              do{
                   if(type[String(node.tagName).toLowerCase()])
                        //remedy kde and ie
                       if((linb.browser.kde || linb.browser.ie) && node.style.position != 'absolute'){
            				pos.left -= (parseInt(getStyle(node,'marginLeft'))||0);
            				pos.top -= (parseInt(getStyle(node,'marginTop'))||0);
                			break;
                       }

                   pos.left += (parseInt(node.offsetLeft)||0);
                   pos.top += (parseInt(node.offsetTop)||0);

                   me.border = me.border || function(node, pos){
                        pos.left += (parseInt(getStyle(node,'borderLeftWidth'))||0);
                        pos.top += (parseInt(getStyle(node,'borderTopWidth'))||0);
                   };
                   //ie,add each offsetParent 's border
                   if( bak!=(bak2=node))
                       if(linb.browser.ie || linb.browser.gek)
                            me.border(node, pos);

                    //firefox add each parentNode's border
                    if(linb.browser.gek)// && linb(node).position()!='absolute')
                        do{
                            if(bak!=bak2)
                                me.border(bak2, pos)
                        }while((bak2=bak2.parentNode)!=node.offsetParent)

                    //offset
                    bak2=node;
                    do{
                        if(bak!=bak2){
                           if('BODY'==bak2.tagName && linb.browser.opr)continue;
                           //maybe opera bug
                           if(bak2.scrollWidth!=bak2.offsetWidth)
                             pos.left -= (parseInt(bak2.scrollLeft)||0);
                           pos.top -= (parseInt(bak2.scrollTop)||0);
                        }
                    }while((bak2=bak2.parentNode)!=node.offsetParent)

              }while((node= node.offsetParent) && node!=target);
              r=pos;
            }
            return r;
        },

//class and src
        hasClass:function(str){
            var arr = this.get(0).className.split(/\s+/);
            return arr.exists(str);
        },
        addClass:function(str){
            return this.each(function(o){
                var arr = o.className.split(/\s+/);
                if(!arr.exists(str))
                    o.className += " " +str;
            });
        },
        removeClass:function(str){
            var arr, l, me=arguments.callee,reg=(me.reg||(me.reg=/\s+/));
            return this.each(function(o){
                arr = o.className;
                arr = arr.split(reg);
                l=arr.length;
                arr.filter(function(o){
                    return typeof str=='string' ? o!=str : !str.test(o)
                });
                if(l!=arr.length)o.className=arr.join(' ');
            });
        },
        reClass:function(reg,replace){
            var n,r;
            return this.each(function(o){
                r = (n=o.className).replace(reg, replace);
                if(n!=r)o.className=r;
            });
        },
        /*
        value :key word
            if null, clear all tag

        examples:
            icon.gif
            toggleSrc('over')
                icon.over.gif
            toggleSrc('over')
                icon.gif

            icon.over.down.gif
            toggleSrc(null)
                icon.gif

        toggleSrc:function(value,flag){
            return this.each(function(o){
                o=linb([o],false);
                var t=o.src(), reg = new RegExp("(\\."+value+")(\\.[\\w]+$)");
                if(flag)t=t.replace(/([\w]+)[\w\.]*(\.[\w]+)$/, "$1$2");
                o.src(value===null
                        ?t.replace(/([\w]+)[\w\.]*(\.[\w]+)$/, "$1$2")
                        :reg.test(t)
                            ?t.replace(reg,'$2')
                            :t.replace(/(\.[\w]+)$/, "."+value+'$1')
                     );
            });
        },
 */
//events:
        /*
        addEvent('onClick',fun,'idforthisclick';)
        addEvent([['onClick',fun,'idforthisclick'],[...]...])

        will
            add onclick to dom
            add onclick to dom attribute
            append fun to linb.cache.dom.id.events.onClick array
            append 'onclick' to linb.cache.dom.id.add array
        */
        addEventHandler:function(name, flag){
            var id,c,type='on'+linb.dom._getEventType(name),f=linb.dom._eventhander,fs=linb.dom.eventhander,fi=linb.dom.getId;
            return this.each(function(o){
                id=fi(o);
                if(!id)id=o.id=_.id();
                if(flag===false){
                    //for before innerHTML
                    if(o.setAttribute)o.setAttribute(type, fs);
                }else{
                    //if exists
                    if(o[type])return;
                    o[type]=f;
                }
                if(!(c = linb.cache.dom[id])){
                    c = linb.cache.dom[id] = new linb.DomProfile();
                    c.domNode=o;
                    c.domId=id;
                }
                (c.addition || (c.addition={}))[type]=1;
            });
        },
        removeEventHandler:function(name){
            var type='on'+linb.dom._getEventType(name);
            return this.each(function(o){
               if(o[type])o[type]=null;
               if(o.getAttribute && o.getAttribute(type))o.removeAttribute(type);
            });
        },
        clearEventHandler:function(){
            return this.each(function(o){
                linb.dom._events.each(function(s){
                   if(o[s="on"+s])o[s]=null;
                   if(o.getAttribute && o.getAttribute(s))o.removeAttribute(s);
                });
            });
        },
        addEvent:function(name, fun, event_id, index, tagVar){
            var c,t,id,type,fi=linb.dom.getId;
            if(!(name  instanceof Array))
                name=[[name,fun,event_id]];

            name.each(function(o,i){
                name=o[0];fun=o[1];event_id='$'+o[2];
                type=linb.dom._getEventType(name);
                if(typeof event_id!='string')
                    event_id="$"+_.id();

                this.addEventHandler(name);
                this.each(function(o){
                    id=fi(o);
                    if(!id)id=o.id=_.id();

                    c = linb.cache.dom[id];

                    t = c.events || (c.events = {});
                    c = t[name] || (t[name]=[]);

                    //if no event_id input, clear all, and add a single
                    if(typeof event_id =='undefined'){
                        c.length=0;c=t[name]=[];
                        index=-1;
                    }
                    if(tagVar)c.$tagVar=tagVar;
                    c[event_id]=fun;
                    c.removeValue(event_id);
                    c.insert(event_id, index);
                });
            },this);
            return this;
        },
        /*
        removeEvent('onClick','idforthisclick')
        removeEvent('onClick')
            will remove all onClick in linb.cache.dom.id.events.
        removeEvent('onClick',null,true)
            will remove all onClick/beforeClick/afterClick in linb.cache.dom.id.events.
        */
        removeEvent:function(name, event_id, flag){
            var c,t,k,id,i,type,fi=linb.dom.getId;
            if(!(name instanceof Array))
                name=[[name,event_id]];

            name.each(function(o,i){
                name=o[0];event_id='$'+o[1];
                type=linb.dom._getEventType(name);
                this.each(function(o){
                    if(!(id=fi(o)))return;

                    if(!(c=linb.cache.dom[id]))return;
                    if(!(t=c.events))return;
                    if(flag)
                        linb.dom._getEventName(type).each(function(o){
                            delete t[o];
                        });
                    else{
                        if(typeof event_id == 'string'){
                            if(k=t[name]){
                                if(k.exists(event_id))
                                    k.removeValue(event_id);
                                delete k[event_id];
                            }
                        }else
                            delete t[name];
                    }
// for keep widgets events handler
//                    if(_.isEmpty(t) || flag){
//                        o["on"+type]=null;
//                        delete c.addition["on"+type];
//                    }
                });
            },this);
            return this;
        },
        getEvent:function(name, event_id){
            var id;
            if(!(id=linb.dom.getId(this.get(0))))return;

            if(event_id)
                return _.get(linb.cache.dom,[id,'events',name,'$' + event_id]);
            else{
                var r=[],arr = _.get(linb.cache.dom,[id,'events',name]);
                arr.each(function(o,i){
                    r.push([o,arr[o]]);
                });
                return r;
            }
        },

        //clearEvent binded to the current
        clearEvent:function(){
            this.clearEventHandler();
            return this.each(function(o){
                var id,c,t;
                if(!(id=linb.dom.getId(o)))return;

                if(!(c=linb.cache.dom[id]))return;
                _.filter(c.addition, function(i,v){
                    if(v.startWith("on"))return false;
                });
                _.breakO(c.events,2);
                delete c.events;
            });
        },
        /*
        for example:
        name: onResize
        event_id: 'abc'
        fun: resize tigger
        ..
        */
        addObserver:function(name, event_id, index, fun, args, target){
            return this.addEvent(name,
                function(){
                    var para = [];
                    for(var i=0, l=arguments.length,n; n=arguments[i];i++)
                        para[para.length]=(args&&args[i])||n;
                    return _.tryF(fun,para, target||this);
                }
            ,event_id, index);
        },
        removeObserver:function(name,event_id){
            return this.removeEvent(name, event_id);
        },
        /*
        can carry parameters into args
        */
        fireEvent:function(name, args, from){
            var type=linb.dom._getEventType(name),
            t,s='on'+type,
            me=arguments.callee,
            f=linb.dom._eventhander,
            f1=me.f1||(me.f1=function(){this.returnValue=false}),
            f2=me.f2||(me.f2=function(){this.cancelBubble=true});

            args= args || {};
            return this.each(function(o){
                from=from||o;
                //for no standard events, like onDrag
                if(typeof from[s]!='function'){
                    if(!from[s] && !(from.getAttribute && from.getAttribute(s)))
                        return;
                     from[s] = f;
                }

                _.merge(args,{
                    type: type,
                    target: from,
                    $e:true,
                    $name:name,
                    preventDefault:f1,
                    stopPropagation:f2
                },'all');

                if('blur'==type || 'focus'==type)
                    //try{
                        return from[type].call(from,args);
                    //}catch(e){}
                else
                   return from[s].call(from,args);
            });
        },

//functions
        canFocus:function(){
            var map = arguments.callee.map || (arguments.callee.map="a,input,select,textarea,button".toHash(true)), node;
            return !!(
                (node = this._nodes[0]) &&
                node.focus &&
                map[node.tagName.toLowerCase()] &&
                linb.dom.getStyle(node,'display')!='none' &&
                linb.dom.getStyle(node,'visibility')!='hidden' &&
                node.offsetWidth>0 &&
                node.offsetHeight>0
            );
        },
        activate:function(){
            if(this.canFocus()){
                var node= this.get(0);
                node.focus();
                if(node.select)node.select();
            }
            /*var o=this.get(0);
            if(!this.length() || !o.focus || o.offsetWidth<0 || o.offsetHeight<0)return this;
            try{
                o.focus();if(o.select)o.select()
            }catch(e){}finally{return this}
            */
        },
        focus:function(){
            if(this.canFocus())
                this.get(0).focus();
            /*
            var o=this.get(0);
            if(!this.length() || !o.focus || o.offsetWidth<=0 || o.offsetHeight<=0)return this;
            try{o.focus()}catch(e){}finally{return this}
            */
        },
        blur:function(){
            if(!this.length())return this;
            try{this.get(0).blur()}catch(e){}finally{return this}
        },
        enable:function(value){
            if(typeof value!='undefined')
                this.disabled(!value);
            else
                return !this.disabled();
            return this;
        },
        inlineBlock:function(){
            if(linb.browser.gek)
                return this.display('-moz-inline-block').display('-moz-inline-box');
            else
                return this.display('inline-block');
        },
        topZindex:function(flag){
            //<1000 for css settting
            var i=1000, j=0, k, node = this.get(0), p = node.offsetParent, t, o;
            if(node.nodeType !=1 || !p)return 1;

            t=p.childNodes;
            for(k=0;o=t[k];k++){
                if(o==node || o.nodeType !=1 || o.style.display=='none' || o.style.visibility=='hidden' || o.zIndexIgnore)continue;
                j = parseInt(o.style && o.style.zIndex) || 0 ;
                i=i>j?i:j;
            }
            i++;
            if(i>=linb.ini.top_zIndex)
                linb.ini.top_zIndex =i+1000;

            if(flag)
                 node.style.zIndex = i;
            else{
                j = parseInt(node.style.zIndex) || 0;
                return i>j?i:j;
            }
            return this;
        },
        busy:function(flag){
          if(linb.dom._busy)return;
          var id=this.id();
          if(typeof linb.dom._cursor[id] =='undefined'){
              linb.dom._cursor[id] = _.str(this.cursor());
              //if(!linb.dom.opr)
              this.cursor('wait');
              linb.dom.busy(flag);
          }
          return this;
        },
        free:function(){
          if(!linb.dom._busy)return;
          var id=this.id();
          if(typeof linb.dom._cursor[id] !='undefined'){
              cursor=_.str(linb.dom._cursor[id], 'default');
              //if(!linb.dom.opr)
              this.cursor(cursor);
              delete linb.dom._cursor[id];
          }
          linb.dom.free();
          return this;
        },
        UIAction:function(fun){
          var self = this;
          linb.thread(null,
            [
              function(){self.busy()},
              fun,
              function(){self.free();self=null;}
            ]
          ).start();
        },
        /*
        dir:true for next, false for pre
        inn:true for include the inner node
        set:true for give focus
        */
        nextFocus:function(dir, inn, set){
            dir=_.bool(dir,true);
            var self=this.get(0),node = this.$iterator('',dir,inn,function(node){return node!==self && linb([node],false).canFocus()});
            if(!node.isEmpty() && set!==false)node.focus();
            return node;
        },
        startDrag:function(e, profile, key, data){
              return linb.dragDrop.drag(e, this.get(0), profile, key||'', data||null);
        },
        dragable:function(flag, profile, key, data){
            if(typeof flag=='undefined')
                flag=true;
            else
                if(typeof flag=='object')
                    {profile=flag;flag=true;}
            if(flag===true)
                this.addEvent('onMousedown',function(e){
                    if(linb.event.getSrc(e)!=this)return true;
                    linb([this],false).startDrag(e, profile, key, data)
                },'dd',-1);
            else
                this.removeEvent('onMousedown','dd');

            return this;
        },
        dropable:function(flag, key/*, flag*/){
            key=_.str(key,'default');
            if(flag)
                return this.each(function(o){
                    linb.dragDrop.register(o,key/*, flag*/);
                });
            else
                return this;
        },
        /*
        args:{
            with:[0,100],
            height:[0,100],
            opacity:[0,1],
            left:[..]
            top:[..]
            backgroundColor:[..]
            scrollTop:[..]
            scrollLeft:[..]
            font-size:[..]
        }
        */
        fx: function(args, onStart, onEnd, time, step, type, id){
            var me=arguments.callee,
            hash = me.lib ||  (me.lib = {
                line:function(x){return x},
                inexp:function(x){return (x==0) ? 0 : Math.pow(2, 10 * (x - 1))},
                outexp:function(x){return (x==1) ? 1 : -Math.pow(2, -10 * x) + 1},
                insine: function(x) { return -1 * Math.cos(x * (Math.PI/2)) + 1; },
	            outsine: function(x) { return Math.sin(x * (Math.PI/2)); },
	            inoutsine: function(x) { return -1/2 * (Math.cos(Math.PI*x) - 1); }
            }),
            color = me.color || (me.color = function(type, args, step, j){
                var f,fun,value = 0 + (100-0)*hash[type](j/step), from = args[0], to = args[1];

                if(typeof from !='string' || typeof to != 'string')return '#fff';
                if(value<0)
                    return from;
                else if(value>100)
                    return to;

                f=function(str){
                    return (str.charAt(0)!='#')?('#'+str):str;
                };
                from=f(from);to=f(to);

                f=function(str, i, j){
                    return parseInt(str.slice(i,j),16)||0;
                };
                fun=function(o){
                    return {red:f(o,1,3),green:f(o,3,5),blue:f(o,5,7)}
                };
                from = fun(from);to = fun(to);

                f=function(from, to, value,c){
                    var r= from[c]+Math.round((value/100)*(to[c]-from[c]));
                    return (r < 16 ? '0' : '') + r.toString(16)
                };

                return '#' + f(from,to, value, 'red') + f(from,to, value, 'green') + f(from,to, value, 'blue');
            });

            time = time||200;
            step = step||5;
            type = typeof hash[type]!='undefined'?type:'line';

            var threadid=id||_.id(), self=this, delay = time/step, i,j=0, value,
            funs=[function(threadid){
                //try{
                   // if(++j > step)throw new Error;
                    if(++j > step){
                        linb.thread(threadid).abort();
                        return false;
                    }
                    _.each(args,function(o,i){
                        if(typeof o == 'function') o(j, step);
                        else{
                            value = String((i.toLowerCase().endWith('color')) ? color(type, o, step, j) : (o[0] + (o[1]-o[0])*hash[type](j/step)));
                            (self[i]) ? (self[i](value)) :(self.setStyle(i, value));
                        }
                    });
                //}catch(e){
                //    linb.thread(threadid).abort();
                //    color=hash=null;
               // }
            }];
            return linb.thread(threadid, funs, delay, null, onStart, onEnd ,true);
        },
        /*
        pos: {left:,top:} or domNode
        parent:parent node
        type:true/false, true for left/right position base
        */
        popToTop : function(pos, parent, type){
            var region, target = this;
            type = (type || 1).toString();
            parent = linb(parent || document.body);

            //prepare
            target.setStyle({position:'absolute',left:'0', top:'0',visibility:'hidden',display:'block', zIndex:linb.ini.top_zIndex});

            //add to body, avoid parent is display:none.
            parent.attach(target);

            if(pos['linb.dom'] || pos.nodeType){
                var node=linb(pos);
                //base region
                var abspos = node.absPos(null, parent);
                region = {
                    left:abspos.left,
                    top:abspos.top,
                    width:node.offsetWidth(),
                    height:node.offsetHeight()
                };
             }else{
                region = {
                    left:pos.left-8,
                    top:pos.top-8,
                    width:16,
                    height:16
                };
            }
            pos={left :0, top :0};

            //window edge
            var t=linb(window), box = {};
            box.left=t.scrollLeft();
            box.top=t.scrollTop();
            box.width =t.width()+box.left;
            box.height =t.height()+box.top;
/*
type:1
    +------------------+ +------------------+
    |        3         | |        4         |
    +--------------+---+ +---+--------------+
    |              |         |              |
    |              |         |              |
    +--------------+---+ +---+--------------+
    |        1         | |        2         |
    +------------------+ +------------------+
type:2
                         +---+              +---+
                         |   |              |   |
+---+--------------+---+ |   +--------------+   |
|   |              |   | | 3 |              | 4 |
| 2 |              | 1 | |   |              |   |
|   +--------------+   | +---+--------------+---+
|   |              |   |
+---+              +---+
type:3
                         +---+              +---+
                         | 3 |              | 4 |
    +--------------+     +---+--------------+---+
    |              |         |              |
    |              |         |              |
+---+--------------+---+     +--------------+
| 2 |              | 1 |
+---+              +---+
type:4
                     +------------------+
                     | 3                |
+--------------+---+ |   +--------------+ +----+--------------+ +--------------+----+
|              |   | |   |              | |    |              | |              |    |
|              |   | |   |              | |    |              | |              |    |
+--------------+   | +---+--------------+ |    +--------------+ +--------------+    |
|                1 |                      |  2                | |               4   |
+------------------+                      +-------------------- +-------------------+
*/

            //target size
            var w = target.offsetWidth(), h = target.offsetHeight();
            var hi,wi;
            switch(type){
                case '1':
                    hi=false;wi=true;
                break;
                case '2':
                    hi=true;wi=false;
                break;
                case '3':
                    hi=false;wi=false;
                break;
                case '4':
                    hi=wi=true;
                break;
            }
            if(hi){
                if(region.top + h < box.height)
                    pos.top=region.top;
                else
                    pos.top=region.top+region.height-h;
            }else{
                if(region.top + region.height + h < box.height)
                    pos.top=region.top + region.height;
                else
                    pos.top=region.top - h;
            }
            if(wi){
                if(region.left + w < box.width)
                    pos.left=region.left;
                else
                    pos.left=region.left+region.width-w;
            }else{
                if(region.left + region.width + w < box.width)
                    pos.left=region.left + region.width;
                else
                    pos.left=region.left - w;
            }

            //over right
            if(pos.left + w>  box.width)pos.left = box.width - w;
            //over left
            if(pos.left < box.left)pos.left = box.left;
            //over bottom
            if(pos.top + h>  box.height)pos.top = box.height - h;
            //over top
            if(pos.top < box.top)pos.top = box.top;
            //show
            target.cssPos(pos).setStyle({visibility:'visible',display:'block'});
        },

        //for destroy obj when blur
        setBlurTrigger : function(id, trigger, group, upper){
            //remove this trigger
            if(!trigger){
                linb([document],false).beforeMousedown(null, id);
                return;
            }
            var target = group?group:linb(this.get());

            //prevent upper trigger
            var fun;
            if(upper && (fun = linb([document],false).getEvent('beforeMousedown', upper)))
                fun.target.add(target);

            var f=function(p,e){
                var pos, size, b=true, me=arguments.callee, p=linb.event.getPos(e);
                me.target.each(function(o){
                    if(o.parentNode){
                        o=linb([o],false);
                        pos = o.absPos();
                        size = o.cssSize();
                        if(p.left>=pos.left && p.top>=pos.top && p.left<=(pos.left+size.width) && p.top<=(pos.top+size.height))
                            return b=false;
                    }
                });
                if(b){
                    //remove event
                    linb([document],false).beforeMousedown(null, id);
                    _.tryF(me.trigger);

                    //de prevent upper trigger
                    if(fun){
                        fun.target.minus(arguments.callee.target);
                        fun=null;
                    }
                    delete me.trigger; delete me.target;
                    return;
                }
                return true;
            };
            f.target = target;
            f.trigger = trigger;
            //attach event
            linb([document],false).beforeMousedown(f, id, 0);
            return this;
        },
        //IE not trigger dimension change, when change height only in overflow=visible.
        ieTrigger : function(flat){
            var s=this;
            _.asyRun(function(){s.setStyle('wordWrap','break-word')});
            _.asyRun(function(){s.setStyle('wordWrap','normal');s=null;});
            return this;
        }
    },
    Static:{
        _eventhander:function(){return linb.event(arguments[0],this)},
        eventhander:"return linb.event(arguments[0],this)",
        boxArr:'left,top,right,bottom,width,height'.toArr(),
        _eventtag:'before,on,after'.toArr(),
        //collection
        _events : ("mouseover,mouseout,mousedown,mouseup,mousemove,click,dblclick," +
                "keydown,keypress,keyup,"+
                "resize,scroll," +
                "blur,focus,contextmenu,"+
                "load,unload,"+
                "change,reset,select,submit,"+
                "abort,error,ready,"+
                //"request,"+
                "location,"+ //and resize for custom
                //dragstart dragdrop dragout will not work in IE, when set string to attr
                "dragbegin,drag,dragend,dragleave,dragenter,dragover,drop").toArr(),
        _cursor:{},
        setPxStyle:function(node, key, value){
              var style=node.style;
              if(value || value===0){
                value = (String(parseFloat(value))==String(value)) ? (parseInt(value)||0) + "px" : value;
                if((key=='width'||key=='height') && value.charAt(0)=='-')value='0';
                if(style[key]!=value){
                    style[key]=value;
                    return true;
                }
            }return false;
        },

        $gc:function(){
            var i,o,w,bak=[];
            for(i in linb.cache.dom){
                 o=linb.cache.dom[i];
                 if((!o) || (window == o.domNode) || (document == o.domNode))continue;
                 if(!document.getElementById(o.domId)){
                     o.$gc();
                     bak[bak.length]=i;
                 }
             }
             for(i=0;i<bak.length;)
                 delete linb.cache.dom[bak[i++]];
             if(linb.browser.ie6)CollectGarbage();
        },
        clean:function(e){
            var t,i,a,
            //can't be e, or opera will crash
            arr = window===e ? [window] :
                    document===e ? [e] :
                    e.constructor == Array ? e :
                    e['linb.dom'] ? e._nodes :
                    e.toDomNodes?e.toDomNodes():
                    typeof e == 'function' ? e.apply(arguments[2],arguments[1]) :
                    typeof e!='string' ? [e] :
                    e.charAt(0)=='{' ? linb.SC(e.slice(1,e.length-1)).getAll().reBoxing()._nodes :
                    [e]
            ;
            //for performance
            //Can't input mix value
            if(arr[0] && !arr[0].nodeType){
                a=[];
                //can't be e, or opera will crash
                for(i=0;i<arr.length;i++)
                    if(t=(typeof (t=arr[i])=='string' ? document.getElementById(t) : (t&&t.domNode) ? t.domNode : t ) || null)
                        a[a.length]=t;
            }else
                a=arr;
            return a;
        },

/*        getElemsByXPath : function(exp, p) {
            var r=[];
            var str = document.evaluate(expression, p || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for(var i=0, length=query.snapshotLength; i < length; i++) r.push(query.snapshotItem(i));
            return r;
        },
*/
        getStyle:function(node, key, flag){
            /*
            key1: backgroud-color
            key2: backgroudColor
            */
            if(!node.style)return '';

            var value = node.style[key];
            if(!value || flag){
                var me = arguments.callee,t,
                map = me.map || (me.map = 'float,cssFloat,styleFloat'.toHash(true)),
                cache = me.cache || (me.cache={}),
                key = cache[key] || (cache[key] = key.replace(/\-(\w)/g, function(a,b){return b.toUpperCase()}))
                ;
                if(map[key])
                    key = linb.browser.ie?"styleFloat":"cssFloat";
                //document.defaultView first, for opera 9.0
                value = ((t=document.defaultView) && t.getComputedStyle)?(t=t.getComputedStyle(node,null))?t[key]:'':node.currentStyle[key];
/*
                if(linb.browser.opr){
                    var map2 = me.map2 || (me.map2='left,top,right,bottom'.toHash(true));
                    if(map2[key] && (linb.dom.getStyle(node,'position')=='static'))
                        value = 'auto';
                }
*/
            }
            return value||'';
        },
        /*
        index:
            2: get the second empty temp div
        */
        _matixid:"linb.matix::",
        isMatix:function(id){return id.startWith(this._matixid)},
        getTemp:function(index){
            var i=1,id,o,count=0,me=arguments.callee,m=me.m;
            index=index || 1;
            while(1){
                id = this._matixid + i;
                //don't remove this {
                if(o=linb.dom.byId(id)){
                    /*use firstChild for performance*/
                    if(!o.firstChild && ++count == index)
                        return linb([o],false);
                }else{
                    if(!m){
                        //no use linb.create,here
                        m = document.createElement('div');
                        m.style.position='absolute';
                        m.style.visibility='hidden';
                        m.style.width=m.style.height='0';
                        m.style.left=m.style.top='-10000px';
                        me.m=m;
                    }
                    o=m.cloneNode(false);
                    o.id=id;

                    document.body.insertBefore(o, document.body.firstChild);
                    return linb([o],false);
                }
                i++;
            }
        },
        iniBox:function(){
            var i,o,hash={};
            for(i=0;o=this.boxArr[i++];)
                hash[i]=null;
            return hash;
        },
        //for overwrite
        setCover:function(){
            // get or create first
            var me=arguments.callee,arg1=arguments[0],arg2=arguments[1],id="linb.temp:cover:", id2="linb.temp:message:",o1,o2,body=linb([document.body],false);
            if((o1=linb(id)).isEmpty()){
                body
                .addFirst(o1=linb.create('<div id="'+ id +'" style="position:absolute;display:none;left:0;top:0;z-index:0;background-image:url('+linb.ini.path+'bg.gif)">'))
                .addFirst(linb.create('<div id="'+id2+'" style="position:absolute;display:none;"><img src="'+linb.ini.path + 'loading.gif" border="0"/><div style="font-size:12px;"></div></div>'))
                ;
            }

            o2=linb(id2);
            //clear
            if(arg1 === false){
                if(me.show){
                    o1.setStyle({display:'none',zIndex:'0'});
                    body.cursor("");
                    o2.display('none').last().empty();
                    me.show=false;
                }
            }else{
                if(!me.show){
                    var t = linb([window],false), w=t.scrollWidth(), h=t.scrollHeight();
                    o1.cssSize({ width :w, height :h}).setStyle({display:'block',zIndex:(linb.ini.top_zIndex+200),cursor:'wait'});
                    body.cursor("wait");
                    var x = t.scrollLeft()+t.width()/2, y = t.scrollTop()+t.height()/2;
                    o2.left(x).top(y).display('block').zIndex(linb.ini.top_zIndex+300);

                    me.show=true;
                }
                if(typeof arg1=='string')
                    o2.last().get(0).innerHTML = (arg2?o2.html():'') + arg1;
            }
        },
        getId:function(o){
            return (window===o)?linb.ini.id_window:(document===o)?linb.ini.id_document:o?o.id:'';
        },
        byId:function(e){
            return  document.getElementById(e);
        },
        _getEventName:function(s,pos){
            var me=arguments.callee, map = me.map || (me.map={});
            return map[s+pos] || (map[s+pos] = pos?((this._eventtag.exists(pos)?pos:'on') + s.initial()):this._eventtag.copy().each(function(o,i){this[i]=o+s.initial()}));
        },
        _getEventType:function(name){
            var me=arguments.callee, map = me.map || (me.map={});
            return map[name] || (map[name] = name.replace(/^(on|before|after)/,'').toLowerCase())
        },
        //safari not trigger onresize/onposition
        hasHandler:function(node, name){
            return !!(node[name] || (node.getAttribute && node.getAttribute(name)));
        },
        /*
        css: expression for selector attribute selector, must include '[]'
        context: dom nodes array
        flag: true: not select, just filter

        Example:
        "div[id='div4'] input[class~='c'][class~='a'], div[id='div5'] input[class~='ac']"
            in 'div4', select class includes 'c' and 'a'
            in 'div5', select class includes 'ac'
            and return those all


        selector:function(css, context, flag){
            var me=arguments.callee;

            css=_.str(css);
            css = css.indexOf('[')==-1?(css+'[]'):css;
            if(css == '[]' && flag )return context;
            context = context || [document];

            var match,
            r0=me.r0 || (me.r0=/("[^"\n\r]*")|(\'[^\'\n\r]*\')|( )/g),
            f1=me.f1 || (me.f1=function(o,a,b,c){return c?'\x01':o}),
            r1=me.r1 || (me.r1=/\[(\w*)([=!~\|\^\$\*]?)=?['"]?([^\]'"]*)['"]?\]/g),
            r2=me.r2 || (me.r2=/\[(\w*)([=!~\|\^\$\*]?)=?['"]?([^\]'"]*)['"]?\]/),
            r3=me.r3 || (me.r3=/\[(\w*)\((\w*)\)([=!~\|\^\$\*]?)=?['"]?([^\]'"]*)['"]?\]/g),
            r4=me.r4 || (me.r4=/\[(\w*)\((\w*)\)([=!~\|\^\$\*]?)=?['"]?([^\]'"]*)['"]?\]/),
            select = flag
            ?me.s1 || (me.s1=function(context,tag){
              return tag
              ?context.filter(function(o){
                  return o.nodeName.toLowerCase() == tag.toLowerCase();
              })
              :context;
            })
            :me.s2 || (me.s2=function(context,tag) {
              var arr = [];
              if(!tag)tag="*";
              context.each(function(o){
                if(tag=="*" || (o.nodeName.toLowerCase() == tag.toLowerCase()))
                    arr.insert(o);

                if(!(o.nodeType==1 || o.nodeType==9))return;
                arr.insert(_.toArr((tag=='*')?o.all?o.all:o.getElementsByTagName("*"):o.getElementsByTagName(tag)));
            });
              return arr;
            }),
            selector= me.selector || (me.selector = {
                '=':  function(m,n){return m==n},
                '!':  function(m,n){return m!=n},
                '~':  function(m,n){return m && (new RegExp('(^|\\s)'+n+'(\\s|$)')).test(m)},
                '|':  function(m,n){return m && (new RegExp('^'+n+'-?')).test(m)},
                '^':  function(m,n){return m && m.startWith(n)},
                '$':  function(m,n){return m && m.endWith(n)},
                '*':  function(m,n){return m && m.exists(n)},
                '':   function(m,n){return !!m}
            }),
            bak, tag, exp1, exp2, temp, arr=[],  b, t;

            css.split(",").each(function(o){
                bak=context;
                //protect space in string
                o=o.trim().replace(r0,f1);

                o.split("\x01").each(function(v){
                    exp1 = []; exp2 = []; temp = [];
                    tag = v.slice(0,v.indexOf('['));
                    v = v.slice(v.indexOf('['),v.length);

                    if(match = v.match(r1))
                        match.each(function(o){
                            if(o.match(r2))
                                exp1.push([RegExp.$2, RegExp.$1, RegExp.$3]);
                        });

                    if(match = v.match(r3))
                        match.each(function(o){
                            if(o.match(r4))
                                exp2.push([RegExp.$3, RegExp.$1, RegExp.$2, RegExp.$4]);
                        });


                    //no expression found, throw error
                    if(exp1.length===0 && exp2.length===0)throw new Error(linb.getStr('selector', me[0]));

                    t=linb();
                    select(bak,tag).each(function(n){
                        if(n.nodeType==1 || n.nodeType==9){
                            b=true;
                            // test attr first
                            exp1.each(function(o,i){
                                // '[]' will match[["","",""]]
                                if(o[1]!=""){
                                    t.set([n]);
                                    if((!selector[o[0]](t.attr(o[1]), o[2])))
                                        return b=false;
                                }
                            });
                            if(b){
                                //then, test linb.dom functions
                                exp2.each(function(o,i){
                                    t.set([n]);
                                    if((!t[o[1]]) || (!selector[o[0]](String(t[o[1]](o[2]?o[2]:undefined)), o[3])))
                                        return b=false;
                                });
                            }

                            if(b)temp.push(n);
                        }
                    });
                    bak=temp;
                    if(!temp.length)return false;
                });
                arr.insert(temp);
            });
            return arr;
        },

*/
        //import css
        includeCSSFile:function(path){
            var me=arguments.callee,
            r1=me.r1 ||(me.r1=/(url\()\s*([\t\s\w()\/.\\'"-:#=&?]+)\s*(\))/g),
            r2=me.r2 ||(me.r2=/(AlphaImageLoader\(src\=['"])([\t\s\w()\/.\\'"-:#=&?~]*)(['"])/g),
            r3=me.r3 ||(me.r3=/^(file||https?||ftps?):\/\//)
            ;

            linb.request(path,'',function(str){
                //fix url path
                str = str.replace(r1, function(s,a,b,c){
                    return a+ (r3.test(b) ? b : (path+b)) + c
                });
                if(linb.browser.ie)
                    str = str.replace(r2, function(s,a,b,c){
                        return a+ (r3.test(b) ? b : (path+b)) + c
                    });
                linb.dom.addHeadNode('style', str, path);
            },function(str){},false,'GET');

            return path;
        },
        addHeadNode:function(type, txt, title, args){
            var i, t, e, me=arguments.callee, head = me.head || (me.head=document.getElementsByTagName("head")[0]);
            //exists?
            //for(var i=0,t=head.childNodes,l;l=t[i++];)
            //    if((linb.browser.kde?l.id:l.title)==title)return;

            type = (t=(type=='js')) ? 'script': 'style';
        	e = document.createElement(type);
        	e.setAttribute("type", "text/" + (t?"javascript":"css") );
        	if(args)
        	    for(i in args)
        	        e.setAttribute(i, args[i]);

        	//if(title && linb.debug)
        	//    e.setAttribute(linb.browser.kde?"id":"title", title);

        	 if(txt)
                //for ie
            	if(linb.browser.ie){
            	    if(t) e.text=txt;
            	    else e.styleSheet.cssText = txt;
            	}else
            		e.appendChild(document.createTextNode(txt));

        	head.appendChild(e);
        	e.disabled=true;
        	e.disabled=false;
        	return e;
        },
/*        maxTabindex:function(){
            var l=0, arr=linb([document.body],false).dig('*',function(o){return o.tabIndex>0}).get();
            for(var i=0,o;o=arr[i++];)
                l=l>o.tabIndex?l:o.tabIndex;
            return ++l;
        },
*/
        // phrogz.net/CSS/selector_test.html
        // www.howtocreate.co.uk/tutorials/javascript/domstylesheets
        /*
        support only:
            .a{}
    `       .b, .c{}
            .a span{}
            .a span ,.b span{}
        */
        /*
        css: null represents delete selector from stylesheet
        setHeadStyle:function(selector, css){
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
                                _t=_t.remove(_t.indexOf(selector)).join(',');
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
        },
        */

        onload:function(fun){
            arguments.callee.funs.push(fun);
        },
        /*
        action: uri
        data:hash{key:value}
        method:'post'(default) or 'get'
        target: uri target: _blank etc.
        */
        submit:function(action, data, method, target, enctype){
            data=_.hash(data);method=_.str(method,'get');action=_.str(action);target=_.str('_blank');
            var _t=[];
            _.each(data,function(o,i){
                _t.push('<textarea name="'+i+'">'+(typeof o=='object'?_.serialize(o):o)+'</textarea>');
            });
            var d=('<form target="'+target+'" action="'+action+'" method="'+method  + (enctype?'" enctype="' +enctype:'') +  '">'+_t.join('')+'<input type="hidden" name="rnd" value="'+_.timeStamp()+'"></form>').toDom();
            linb.dom.getTemp().addLast(d);
            d.get(0).submit();
            d.remove();
        },
        busy:function(flag){
            if(linb.dom._busy)return;
            if(flag!==false)
                linb.dom.setCover(true);
            linb.dom._busy=true;
        },
        free:function(cursor){
           if(!linb.dom._busy)return;
           linb.dom.setCover(false);
           linb.dom._busy=false;
        },
        UIAction:function(fun){
          linb.thread(null,
            [
              function(){linb.dom.busy()},
              fun,
              function(){linb.dom.free()}
            ]
          ).start();
        },
        fxProxy:function(from, to, onStart, onEnd, time, step, type, id){
            var args = {}, me=arguments.callee, arr = me.arr || (me.arr=arr='left,top,width,height'.toArr()),
                node = me.node = (me.node=linb.create("<div style='border:dashed 1px blue;position:absolute;left:-10000px;'></div>"));
            arr.each(function(i){
                args[i]=[from[i],to[i]];
            });
            linb(document.body).addLast(node);
            node.zIndex(linb.ini.top_zIndex+10);
            return node.fx(args, onStart, function(){
                node.cssSize({ width :0, height :0}).remove(false);
                _.tryF(onEnd);
            }, time, step, type, id);
        }
    },
    After:function(d){
        //onload for fireevent after dom loaded, but img and other media not
        new function(){
            var self = linb.dom.onload, doc = d || document;
            self.funs=[];
            self.fun=function(){
                var self = linb.dom.onload;
                if(!self.ok){
                    self.ok=true;
                    self.funs.each(function(o){
                        _.tryF(o);
                    });
                }else{
                    self.fun=null;
                    self.funs.length=0;
                }
            };
            var f = function(){
                var t;
                _.tryF(linb.dom.onload.fun);
                if(doc.removeEventListener)doc.removeEventListener("DOMContentLoaded",arguments.callee,false);
                if(t=linb.dom.byId("linb:onload:", doc)){
                    t.onreadystatechange=null;
                    linb(t).remove();
                }
                if(linb.dom.onload.timer)clearInterval(linb.dom.onload.timer);
            };

            if(self.timer) clearInterval(self.timer);
            /* for Mozilla/Opera9 */
            if (doc.addEventListener && !linb.browser.kde)
                doc.addEventListener("DOMContentLoaded", f, false);
            //for ie
            else if (linb.browser.ie){
                doc.write("<sc"+"ript id='linb:onload:' defer src='//:'><\/sc"+"ript>");
                linb.dom.byId("linb:onload:", doc).onreadystatechange = function(){
                    if (this.readyState == "complete")f();
                };
            }
            //kde, opera <9 and other
            else{
                self.timer = setInterval(function() {
                    if(/loaded|complete/.test(doc.readyState))f();
                }, 1);
            }
        };
    }
});

new function(){
    //browser sniffer
    var dom = linb.dom;

   //getter
    _.each({ parent:['y',false], pre:['x',false], next:['x',true], first:['y',true], last:['y',1]},function(o,i){
        this.plugIn(i, function(index){
            if(typeof index=='string'){css=index;index=0;}
            if(index===0)
                return this;
            else
                return this.$iterator(o[0], o[1], true, index || 1)
        });
    },dom);

    //readonly profile
    'nodeName,nodeType,tagName,offsetLeft,offsetTop,offsetParent,scrollWidth,scrollHeight'.toArr().each(function(o){
        this.plugIn(o,function(value){
            var _t=this.get(0);
            if([window,document].exists(_t)){
                if("scrollWidth"==o)return (linb.browser.contentBox && document.documentElement.scrollWidth) || document.body.scrollWidth;
                if("scrollHeight"==o)return (linb.browser.contentBox && document.documentElement.scrollHeight) || document.body.scrollHeight;
            }
            _t=_t[o];
            return typeof _t == 'string'?_t.toLowerCase():_t;
        })
    },dom);

    //dimesion
    [   ['paddingH','paddingTop','paddingBottom'],
        ['paddingW','paddingLeft','paddingRight'],
        ['borderH','borderTopWidth','borderBottomWidth'],
        ['borderW','borderLeftWidth','borderRightWidth'],
        ['marginW','marginLeft','marginRight'],
        ['marginH','marginTop','marginBottom']
    ].each(function(o){
        //use get Style dir
        var node,fun=linb.dom.getStyle;
        this.plugIn(o[0],function(){
            node = this.get(0);
            return (parseInt(fun(node, o[1])) + parseInt(fun(node, o[2]))) || 0;
        })
    },dom);
    /*
    get W/H for

    1:width
    2:clientWidth
    3:offsetWidth
    4:realWidth

    content-box
    +--------------------------+
    |margin                    |
    | +----------------------+ |
    | |border                | |
    | | +------------------+ | |
    | | |padding           | | |
    | | | +--------------+ | | |
    | | | |   content    | | | |
    |-|-|-|--------------|-|-|-|
    | | | |<-css width ->| | | |
    | | |<-  clientWidth ->| | |
    | |<--  offsetWidth   -->| |
    |<--    realWidth       -->|

    border-box
    +--------------------------+
    |margin                    |
    | +----------------------+ |
    | |border                | |
    | | +------------------+ | |
    | | |padding           | | |
    | | | +--------------+ | | |
    | | | |   content    | | | |
    |-|-|-|--------------|-|-|-|
    | | |<-   css width  ->| | |
    | | |<-  clientWidth ->| | |
    | |<--  offsetWidth   -->| |
    |<--    realWidth       -->|
    */

    [['W','width', 'paddingW', 'borderW', 'marginW', 'clientWidth', 'offsetWidth'],
    ['H','height', 'paddingH', 'borderH', 'marginH', 'clientHeight', 'offsetHeight']].each(function(o){
        this.plugIn(o[0],function(node,index,value){
            var n,r,t,style=node.style,me=arguments.callee,
            r1=me.r1 || (me.r1=/%$/),
            getStyle=linb.dom.getStyle,
            f=linb.dom.setPxStyle,type=typeof value;
            if(type=='undefined' || type=='boolean'){
                if(value===true){
                    n=(getStyle(node,'display')=='none');
                    if(n){
                        var temp = linb.dom.getTemp().html('*',false);
                        linb([node],false).swap(temp);
                        var b,p,d;
                        b = style.visibility,p = style.position,d = style.display; p=p||'';b=b||'';d=d||'';
                        style.visibility = 'hidden'; style.position ='absolute';style.display = 'block';
                    }
                }
                switch(index){
                    case 1:
                        r=getStyle(node,o[1]);
                        if(isNaN(parseInt(r)) || r1.test(r))
                            r = me(node,2) - (linb.browser.contentBox?linb([node],false)[o[2]]():0);
                        r=parseInt(r)||0;
                        break;
                    case 2:
                        r=node[o[5]];
                        //for ie
                        if(!r)
                            r=node[o[6]]-linb([node],false)[o[3]]();
                        break;
                    case 3:
                        r=node[o[6]];
                        if(!r)
                            //get from css setting before css applied
                            r=me(node,1)+(linb.browser.contentBox?(t=linb([node],false))[o[2]]():0)+t[o[3]]();
                        break;
                    case 4:
                        r=me(node,3);
                        r+=linb([node],false)[o[4]]();
                        break;
                }
                if(n){
                    style.display = d; style.position = p;style.visibility = b;
                    linb([node],false).swap(temp);
                    temp.empty(false);
                }
                return parseInt(r)||0;
            }else{
                switch(index){
                    case 1:
                        if(f(node, o[1], value))
                            if(linb.dom.hasHandler(node,'onresize')){
                                var args={};args[o[1]]=1;
                                linb([node],false).onResize(true, args);
                            }
                        break;
                    case 2:
                        me(node, 1, value - (linb.browser.contentBox?linb([node],false)[o[2]]():0));
                        break;
                    case 3:
                        me(node, 1, value - (t=linb([node],false))[o[3]]() - (linb.browser.contentBox?t[o[2]]():0));
                        break;
                    case 4:
                        me(node, 1, value - (t=linb([node],false))[o[4]]() - t[o[3]]() - (linb.browser.contentBox?t[o[2]]():0));
                        break;
                }
            }
        })
    },dom);
    //clientWidth():get
    //clientWidth(true):force get (when display=='none')
    //clientWidth(number):set
    [/*['width','W',1],*/['clientWidth','W',2],['offsetWidth','W',3],['realWidth','W',4],
     /*['height','H',1],*/['clientHeight','H',2],['offsetHeight','H',3],['realHeight','H',4]].each(function(o){
        this.plugIn(o[0],function(value){
            var type=typeof value;
            if(type=='undefined' || type=='boolean')
                return this[o[1]](this.get(0), o[2]);
            else
                return this.each(function(v){
                    this[o[1]](v, o[2],value);
                });
        })
    },dom);

    [['leftBy','left', 'offsetLeft'],['topBy','top','offsetTop'],['widthBy','width','offsetWidth'],['heightBy','height','offsetHeight']].each(function(o){
        this.plugIn(o[0],function(value,flag){
            if(value===0)return this;
            var t,m,v,args,k=o[1];
            return this.each(function(node){
                t=node.style;m=t[k];
                if(m=='auto')m=this[o[2]](node);
                v = (parseInt(m) || 0) + value;
                if(k=='width'||k=='height')v=v>0?v:0;
                t[k] =  v + 'px';
                if(flag){
                    args={};args[k]=1;
                    if((k=='left' || k=='top')&& linb.dom.hasHandler(node,'onlocation'))
                        linb([node],false).onLocation(true, args);
                    if((k=='width' || k=='height')&& linb.dom.hasHandler(node,'onresize')){
                        linb([node],false).onResize(true, args);
                    }
                }
            },this)
        });
    },dom);

    dom.addCustomEvent=function(o){
        if(!(o instanceof Array))o=[o];
        var f;
        o.each(function(o){
            f=function(fun, event_id, flag, tagVar){
                if(typeof fun  == 'function')
                    return this.addEvent(o, fun, event_id, flag, tagVar);
                else if(fun===null)
                    return this.removeEvent(o, event_id, flag);
                var args = arguments[1] || {};
                args.$all = (arguments[0]===true);
                return this.fireEvent(o, args)
            };
            f.$event$=1;
            this.plugIn(o, f)
        },this);
        return this;
    };
    //changable profile
    'disabled,readonly,checked,className,value,title,name,href,src'.toArr().each(function(o){
        this.plugIn(o,function(value){
            return this.attr(o,value);
        })
    },dom);
    'scrollLeft,scrollTop,tabIndex'.toArr().each(function(o){
        this.plugIn(o,function(value,flag){
            if(typeof value !='undefined')
                return this.each(function(v){
                    v[o]=value;
                });
            else{
                var v=this.get(0);
                if(v===window || v===document){
                    if("scrollTop"==o)return window.pageYOffset || (linb.browser.contentBox && document.documentElement.scrollTop) || document.body.scrollTop;
                    if("scrollLeft"==o)return window.pageXOffset || (linb.browser.contentBox && document.documentElement.scrollLeft) || document.body.scrollLeft;
                }
                return v[o];
            }
        })
    },dom);
    //css shortcut
    'cursor,backgroundColor,display,overflow,color,background,position,zIndex,visibility,border'.toArr().each(function(o){
        this.plugIn(o,function(value){
            if(value===undefined){
                var node=this._nodes[0];
                if(!node || node.nodeType!=1)return;
                var r= linb.dom.getStyle(node, o);
            if('zIndex'==o)r=parseInt(r)||0;
                return r;
            }else
                return this.setStyle(o, value);
        });
    },dom);
    linb.dom.boxArr.each(function(o){
        this.plugIn(o,function(value){
            var node=this._nodes[0],type=typeof value;
            if(!node || node.nodeType==3)return;
            if(type=='undefined'||type=='boolean'){
                if(o==='width'){
                    if(document===node)return Math.max( document.body.scrollWidth, document.body.offsetWidth );
                    if(window===node)return window.innerWidth || (linb.browser.contentBox && document.documentElement.clientWidth) ||document.body.clientWidth;
                }
                if(o==='height'){
                    if(document===node)return Math.max( document.body.scrollHeight, document.body.offsetHeight );
                    if(window===node)return window.innerHeight || (linb.browser.contentBox && document.documentElement.clientHeight) || document.body.clientHeight;
                }
                if(o=='width')value=this.W(node,1,value);
                else if(o=='height')value=this.H(node,1,value);
                else
                    value = linb.dom.getStyle(node, o);
                return value=='auto'?value:(parseInt(value)||0);
            }else{
                var f=linb.dom.setPxStyle,t,a;
                return this.each(function(v){
                    if(v.nodeType!=1)return;
                    switch(o){
                        case 'right':
                        case 'bottom':
                            f(v, o, value);
                            break;
                        default:
                            if(v.style[o]!==value){
                                if(o=='width')this.W(v,1,value);
                                else if(o=='height')this.H(v,1,value);
                                else{
                                    if(f(v, o, value))
                                        if((o=='top' || o=='left') && linb.dom.hasHandler(node,'onlocation')){
                                            a={};a[o]=1;
                                            linb([v],false).onLocation(true, a);
                                        }
                                }
                            }
                    }
                },this);
            }
        });
    },dom);

    // for linb.dom event
    dom._events.each(function(o){
        this._getEventName(o).each(function(o){
            this.addCustomEvent(o);
        },this)
    },dom);
};

/* for drag && drop
You can give a profile for a linb.dragdrop:

var profile = {
    move: true,
    type: <"copy" "move" "shape" "icon">,

    defer :drag defer, drag will be triggerred by mousemove

    docking_offset: <int>,
    docking_x: <array of int>,
    docking_y: <array of int>,

    grid_width: <int>,
    grid_height: <int>,

    horizontal: <int>,
    vertical: <int>,

    offset_bottom: <int>,
    offset_left: <int>,
    offset_right: <int>,
    offset_top: <int>,

    opacity: <bool>,

    //ini pos and size
    target_left
    target_top
    target_width
    target_height

    topZindex
    cursor
}

type:
There are four type in DD,
"move": move target object directly when mousemove
"copy": move a copy of target object when mousemove
"shape":just move a shape of target object when mousemove
"icon":just move a icon that represents target object when mousemove

You can set position and size when drag start:
              target_left
              |
              |
target_top---**************** |
              **************** |
              **************** |
              **************** |target_height
              **************** |
              **************** |
             |<--target_width->+

    +------------------------------+
    |       |                      |
    |       |offset_top            |
    |<----->****************<----->|
    | offset**************** offset|
    | _left **************** _right|
    |       ****************       |
    |       ****************       |
    |       ****************       |
    |       |offset_bottom         |
    |       |                      |
    +------------------------------+

You can limite dragging in one dimension.

horizontal
------------------------------------------
            ****************
            ****************
            ****************
            ****************
            ****************
            ****************
------------------------------------------

vertical
           |                |
           |                |
           |****************|
           |****************|
           |****************|
           |****************|
           |****************|
           |****************|
           |                |
           |                |


docking:

docking_y 1                      2                     3
          |                      |                     |       docking_x
      ----+----------------------+---------------------+-------1
          |                      |                     |
          |                      |                     |
          |                      |                     |
          |                      |                     |
      ----+----------------------+---------------------+-------2
          |                      |                     |
          |                      |                     |
          |                      |                     |
      ----+----------------------+---------------------+-------3
          |                      |                     |
          |                      |                     |

docking_offset
                      **|**
                      **|**
                      **|**
                      **|**
         ***************|*************
         ***************|*************
         ---------------+-------------
         ***************|*************
         ***************|*************
                      **|**
                      **|**
                      **|**


grid:

                   grid_width
               <-------------------->
              |                      |                     |
          ----+----------------------+---------------------+-------
              |                      |                     |
   grid_height|                      |                     |
              |                      |                     |
              |                      |                     |
          ----+----------------------+---------------------+-------
              |                      |                     |
              |                      |                     |
              |                      |                     |
              |                      |                     |
          ----+----------------------+---------------------+-------
              |                      |                     |
              |                      |                     |


other commands:
opacity:opacity effect when dragging

in callback function, you can get the following values from linb.dragdrop:
left :current X value of mouse;
 top :current Y value of mouse;
origin_x:origin X when drag start;
origin_y:origin Y when drag start;
cssPos_offset_x:origin offset between origin_x and css left value of target object;
cssPos_offset_y:origin offset between origin_y and css top value of target object;
absPos_offset_x:origin offset between origin_x and absolute value of target object;
absPos_offset_y:origin offset between origin_x and absolute value of target object;
*/
Class('linb.dragDrop',null,{
    Static:{
        _proxy_id:"linb.dd:proxy:",
        _proxy_idi:"linb.dd:td:",
        _proxy_size:50,
        _proxy_type:'blank,move,shape,copy,icon,none'.toHash(true),
        _dragMode:{move:'-16px',ref:'-32px',add:'-48px'},
//        _locktime:(linb.browser.opr || linb.browser.ie) ? 10 : 40,
//        _lock:false,

        //drop key collection
        $:{},

        //get left for cssPos
        _left:function(value){
            with(this){
                if(docking_offset>0 && docking_x && docking_x.length){
                    var l=docking_x.length;
                    while(l--)
                        if(Math.abs(value - docking_x[l])<=docking_offset)
                            return docking_x[l];
                }
                if(grid_width>1)
                   return Math.floor(value/grid_width)*grid_width;
                return value;
            }
        },
        //get top for cssPos
        _top:function(value){
            with(this){
                if(docking_offset>0 && docking_y && docking_y.length){
                    var l=docking_y.length;
                    while(l--)
                        if(Math.abs(value - docking_y[l])<=docking_offset)
                            return docking_y[l];
                }
                if(grid_height>1)
                    return Math.floor(value/grid_height)*grid_height;
                return value;
            }
        },

        _ini:function(o){
            with(this){
                var _t=linb(window);
                _box = { width :_t.width()+_t.scrollLeft(),  height :_t.height()+_t.scrollTop()};

                origin_x = left;
                origin_y = top;

                if(proxy = o){
                    proxystyle=o.get(0).style;
                    _size = proxy.cssSize();
                    _absPos= proxy.absPos(null,target_parent);
                    _cssPos= proxy.cssPos();
                    // according to corner

                    cssPos_offset_x = left - _cssPos.left;
                    cssPos_offset_y = top - _cssPos.top;
                    absPos_offset_x = left - _absPos.left;
                    absPos_offset_y = top - _absPos.top;

                    limit_left =  left - offset_left;
                    limit_right =  left + offset_right;
                    limit_top =  top - offset_top;
                    limit_bottom =  top + offset_bottom;

                    //here
                    current.left = pre.left = _cssPos.left;
                    current.top = pre.top = _cssPos.top;

                    if("move" !== type){
                        _zIndex = proxy.zIndex();
                        proxy.zIndex(linb.ini.top_zIndex+100);
                    }

                    if(opacity)
                        proxy.opacity(0.8);
                }
            }
        },
        _reset:function(){
            var d=this;
            d.start=null;
            d.showDDMark(null);
            d.resetProxy();

            d._defer=d.defer=0;
            d.type = 'shape';
            d.cursor='move';
            d._cursor='';
            d.move = true;

            d.proxystyle=d._onDrag=d._onDragover=null;
            d.key=d.data=d.dragKey=d.dragData=null;
            d._begin= _.timeStamp();

            //must here
            d.mousemove = d.mouseup = d.onselectstart = d.ondragstart = '*';

            d._zIndex = d._button = 0;
            d.pre = {left :0, top :0};
            d.current = {left :0, top :0};
            d.left = d.top = d.origin_x = d.absPos_offset_y =d.absPos_offset_x= d.cssPos_offset_x = d.origin_y = d.cssPos_offset_y = d.limit_left = d.limit_right = d.limit_top = d.limit_bottom = 0;
            d.offset_bottom = d.offset_left = d.offset_right = d.offset_top = d.drop2=false;

            d._current_bak = d._current = d._source = d._data = d.proxy = d.proxyIn = d._size = d._absPos= d._cssPos = d._box = null;

            d._timer = d.docking_offset = -1;
            d.docking_x = d.docking_y = [];

            d.working=false;

            d._stop=false;
            //custom pack/unpack function
            d.pack=d.unpack=null;

            d.grid_width = d.grid_height = 1;
            d.opacity = d._flag = d.horizontal = d.vertical = d.topZindex = d._flag=false;

            //for pack parameters
            d.target_left =  d.target_top =  d.target_width = d.target_height = null;
            d.target_parent=null;
            return this;
        },
        abort:function(){
            this._stop=true;
        },
        _end:function(){
            with(this){
                if(proxy){
                    unpack?unpack():_unpack();
                    if(opacity) proxy.opacity(1)
                }

                //must here
                //if bak, restore
                if(onselectstart!='*')document.body.onselectstart = onselectstart;
                if(ondragstart!='*')document.ondragstart=ondragstart;
                //if bak, restore
                if(mousemove!='*')document.onmousemove=mousemove;
                if(mouseup!='*')document.onmouseup=mouseup;
            }
            return  this;
        },
        drag:function(e, node, profile, key, data){
            with(this){
                //clear
                _end()._reset();

                e = e || window.event;
                // not left button
                if(linb.event.getBtn(e) >= 2)
                   return true;

                _source = node = linb(node);
                _cursor = _source.cursor();

                if(!node.id())node.id(_.id(),true);

                //must set here
                _defer = defer = _.numb(profile && profile.defer, defer);
                if(profile){
                    if(true===profile.cursor)profile.cursor=_cursor;
                    type=typeof profile.icon == 'string'?"icon":_proxy_type[type]?type:'shape';
                }

                profile=_.hash(profile);

                var _pos = linb.event.getPos(e);
                profile.left = _pos.left;
                profile.top = _pos.top;
                profile._button = linb.event.getBtn(e);

                dragKey= key || (profile && profile.key);
                dragData= data || (profile && profile.data);

                this.start=function(e){
//ie6: mousemove - mousedown =>78 ms
//delay is related to window size, weird
                //                  try{
                    var t;
                    //call event, you can call abort(set _stoop)
                    _source.beforeDragbegin();

                    if(_flag || _stop){_end()._reset();return false;}

                    //set profile
                    _.merge(this, profile, "all");
                    _ini(pack?pack():(type=='none')?null:_pack(_pos, node));
                    // on scrollbar
                    if(profile.left >= _box.width  || profile.top >= _box.height ){_end()._reset();return true;}

                    //set flag
                    _flag = true;

                    _source.onDragbegin();

                    //set back first
                    if(defer<=0){
                        mousemove = document.onmousemove;
                        mouseup = document.onmouseup;
                    }

                    //back up
                    document.onmousemove = $onDrag;
                    document.onmouseup = $onDrop;
                    working = true;
                    //for events
                    _source.afterDragbegin();
                    //for delay, call ondrag now
                    if(defer>0)$onDrag.call(this, e);
                //                  }catch(e){this._end()._reset();}
                };
                if(linb.browser.ie){
                    ondragstart=document.ondragstart;
                    onselectstart=document.body.onselectstart;
                    document.ondragstart = document.body.onselectstart = null;
                    if(document.selection)_.tryF(document.selection.empty);
                }

                //avoid select
                linb.event.stopBubble(e);

                //fire document onmousedown event
                if(node.get(0)!==document)
                    linb(document).onMousedown(true, linb.event.getEventPara(e));

                if(defer<=0){
                    _.tryF(this.start,[e],this);
                    return false;
                }else{
                    //for mouseup before drag
                    mouseup = document.onmouseup;
                    document.onmouseup = function(e){
                        linb.dragDrop._end()._reset();
                        return _.tryF(document.onmouseup,[e],null,true);
                    };
                    //for mousemove before drag
                    mousemove = document.onmousemove;
                    document.onmousemove = function(e){
                        if(--_defer<=0)linb.dragDrop.start(e);
                        return false;
                    };
                }
//ie6: mousemove - mousedown =>78 ms
            }
        },
        $onDrag:function(e){
            with(linb.dragDrop){
//                if(_lock)return false;
//                _lock=true;
//                _.asyRun('linb.dragDrop._lock=false',_locktime);

               //try{
                    e = e || window.event;
                    //set _stop or in IE, show alert
                    if((!_flag) || _stop || (linb.browser.ie && (!e.button) )){
                        $onDrop(e);
                        return true;
                    }

                    var _pos=linb.event.getPos(e);
                    left=_pos.left;top=_pos.top;

                    if(!_flag)return false;

                    if(proxy){
                        current.left=vertical? _cssPos.left: _left(
                            ((offset_left!==false||offset_right!==false)?
                                ((left<=limit_left)?limit_left:(left>=limit_right)?limit_right:left):
                                left)
                            - cssPos_offset_x
                        );
                        current.top=horizontal? _cssPos.top: _top(
                            ((offset_top!==false||offset_bottom!==false)?
                                ((top<=limit_top)?limit_top:(top>=limit_bottom)?limit_bottom:top):
                                top)
                            - cssPos_offset_y
                        );
                        //for performance
                        //use quick set
                        if(current.left-pre.left)proxystyle.left=current.left+'px';
                        if(current.top-pre.top)proxystyle.top=current.top+'px';
                        pre.left=current.left;pre.top=current.top;
                        if(_onDrag)_onDrag(e);else _source.onDrag(true);
                    }else{
                        //fireEvent
                        //_source.onDrag(true); //shortcut for mousemove
                        if(_onDrag)_onDrag(e);
                        else _source.onDrag(true);
                    }
/*
                    //for test drop in "region" mode
                    if(dragKey && $[dragKey]){
                        _test(dragKey);
                        var t;
                        if(t=_current){
                            if(t === _current_bak){
                                //shortcut for mousemove
                                if(_onDragover)
                                    _onDragover(e);
                                else
                                    linb(t.id).onDragover(true);
                            }else{
                                _onDragover=null;
                                linb(t.id).onDragenter(true);
                                if(t=_current_bak)
                                    linb(t.id).onDragleave(true);
                            }
                        }else
                            if(t=_current_bak){
                                _onDragover=null;
                                 linb(t.id).onDragleave(true);
                            }
                        _current_bak=_current;
                    }
*/
                //}catch(e){linb.dragDrop._end()._reset();}finally{
                   return false;
                //}
            }
        },
        $onDrop:function(e){
            with(linb.dragDrop){
//                try{
                    e = e || window.event;

                    // opera 9 down with
                    // if(!_flag){linb.event.stopBubble(e);return false;}
                    _end();
                    if(_flag){
                        var r = _source.onDragend(true);
                        if(_current)
                            linb(_current.id).onDrop(true);
                    }
//                }catch(a){}finally{
                    _reset();
                    linb.event.stopBubble(e);
                    _.tryF(document.onmouseup,[e]);
                    return !!r;
//                }
            }
        },
        getOffset:function(){
            with(this)return proxy
            ?
            { width : current.left-origin_x+cssPos_offset_x,  height : current.top-origin_y+cssPos_offset_y}
            :
            { width : left-origin_x,  height : top-origin_y}
            ;
        },
        showDDMark:function(o){
            if(this._Region && this._Region.parent())
                this._Region.remove(false);
            if(this._R){
                this._R.setStyle('backgroundColor', this._RB);
                delete this._R;delete this._RB;
            }

            if(o){
                if(!this._Region)
                    this._Region=linb.create('<div style="font-size:0;line-height:0;border-top:dashed 1px blue;left:0;top:0;width:100%;height:0;z-index:'+linb.ini.top_zIndex+';position:absolute"></div><div style="font-size:0;line-height:0;border-right:dashed 1px blue;right:0;top:0;height:100%;width:0;z-index:'+linb.ini.top_zIndex+';position:absolute"></div><div style="font-size:0;line-height:0;border-bottom:dashed 1px blue;height:0;z-index:'+linb.ini.top_zIndex+';bottom:0;left:0;width:100%;position:absolute"></div><div style="font-size:0;line-height:0;border-left:dashed 1px blue;width:0;z-index:'+linb.ini.top_zIndex+';left:0;top:0;height:100%;position:absolute"></div>');
                o=linb(o);

                if(o.display()=='block')
                    o.addLast(this._Region);
                else{
                    this._RB = o.getStyle('backgroundColor');
                    this._R=o;
                    o.setStyle('backgroundColor', '#FA8072');
                }

                if(this.proxyIn && this.type=='icon')
                    this.proxyIn.setStyle('backgroundPosition', 'left '+this._dragMode[this.dragMode]);
            }else{
                if(this.proxyIn && this.type=='icon')
                    this.proxyIn.setStyle('backgroundPosition','left top');
            }
        },
        setProxy:function(child, pos){
            var t;
            if(!linb.dom.byId(this._proxy_id))
                linb(document.body).addFirst(
                    linb.dom.create('<table id="' + this._proxy_id + '" cellspacing="'+this._proxy_size+'" cellpadding="0" style="left:0;top:0;border:0; border-spacing:'+this._proxy_size+'px; border-collapse: separate; position: absolute;"><tbody><tr><td id="' +this._proxy_idi+ '"></td></tr></tbody></table>')
                );
            t=linb(this._proxy_id);
            if(this.drop2){
                t.attr('cellSpacing',0).setStyle('borderSpacing',0);
            }else{
                pos.left -=  this._proxy_size; pos.top -= this._proxy_size;
            }
            if(this.target_parent)
                linb(this.target_parent).addLast(t);


            if(child){
                linb(this._proxy_idi).addLast(child);
                this.proxyIn = child;
            }else
                this.proxyIn = linb(this._proxy_idi);
            t.setStyle({cursor:this.cursor,display:'',zIndex:linb.ini.top_zIndex+100}).absPos(pos, this.target_parent);

            return t;
        },
        resetProxy:function(){
            if(linb.dom.byId(this._proxy_id)){
                var t,k,o=linb(this._proxy_idi),t=linb(this._proxy_id);
                o.empty();
                if(linb.browser.ie){
                    for(var i in (k=o.get(0).style))
                        if(typeof k[i]!='function')
                            try{k[i]=''}catch(e){}
                }else
                    o.get(0).setAttribute('style','');

                linb(document.body).addFirst(
                    t
                    .attr('cellSpacing',this._proxy_size)
                    .setStyle({
                        zIndex:0,
                        cursor:'',
                        display:'none',
                        borderSpacing:this._proxy_size+'px'
                    })
                );
                this.proxyIn=null;
                this.proxystyle=null;
            }
        },
        getProxyPos:function(){
            var pos = linb(this._proxy_id).absPos();
            pos.left +=  this._proxy_size; pos.top += this._proxy_size;
            return pos;
        },
        _pack:function(mPos,node){
            var target, pos={}, size={}, d=this, t;
            // get abs pos (border corner)
            if(d.target_left===null || null===d.target_top)
                t=node.absPos(null, d.target_parent);
            pos.left = null!==d.target_left?d.target_left: t.left;
            pos.top = null!==d.target_top?d.target_top: t.top;

            switch(d.type){
                case 'copy':
                   var t;
                    size.width = _.numb(d.target_width, node.cssSize().width);
                    size.height = _.numb(d.target_height, node.cssSize().height);
                    var n=node.clone(_.bool(d.target_clone,true)).id('', true).setStyle({position:'static',cursor:d.cursor,margin:0}).opacity(0.5).cssSize(size);
                    n.dig().id('',true);
                    target = d.setProxy(n,pos);
                    break;
                case 'shape':
                    // get size
                    size.width = null!==d.target_width?d.target_width:node.offsetWidth();
                    size.height = null!==d.target_height?d.target_height:node.offsetHeight();
                    size.width-=2;size.height-=2;
                    target = d.setProxy(
                        linb.dom.create('div').setStyle({border:'dashed 1px',fontSize:'0',lineHeight:'0'}).cssSize(size)
                        ,pos);
                    break;
                case 'blank':
                    target = d.setProxy(null,pos);
                    break;
                    break;
                case 'icon':
                    //reset pos and size
                    size.width = _.numb(d.target_width, 16);
                    size.height = _.numb(d.target_height, 16);
                    pos.left=_.numb(d.target_left, mPos.left - linb(window).scrollLeft() + size.width);
                    pos.top=_.numb(d.target_top, mPos.top - linb(window).scrollTop() + size.height);
                    target = d.setProxy(
                        linb.dom.create('<div style="font-size:0;line-height:0;background:url('+d.icon+') no-repeat left '+(d.icon_top?d.icon_top:'top')+'" />').cssSize(size)
                        ,pos);
                    break;
                case 'move':
                    target=node;
                    if(target.position() != 'absolute')
                        target.position('absolute').absPos(pos);
                    target.cursor(d.cursor);
            }

            return target;
        },
        _unpack:function(){
            var d=this, t,f;
            if(d.move && ("move" != d.type)){
                if((t=linb(d._source)))
                    if(!t.isEmpty()){
                        if(t.position()!= 'absolute') t.position('absolute');
                        t.absPos(this.getProxyPos());
                        if(d.topZindex) t.topZindex(true);
                    }
            }
            if("move" == d.type)
                d._source.cursor(d._cursor);
        },
        ignore:function(){
            this._current=null;
        },
        register:function(id, key/*, flag*/){
            //register to mouse mode, that use onmouseover/onmouseout to check
            //if(flag){
                var o=linb(id);
                o.beforeMouseover(function(){
                    var t=linb.dragDrop;
                    if(t.dragKey && this._dropKeys[t.dragKey]){
                        t._current=this;
                        linb([this],false).onDragenter(true);
                        if(t._current)_.resetRun('showDDMark', t.showDDMark, 0, [this], t);
                    }
                },'dd');
                o.beforeMouseout(function(){
                    var t=linb.dragDrop;
                     if(t.dragKey && this._dropKeys[t.dragKey]){
                        linb([this],false).onDragleave(true);
                        t._current=null;
                        _.resetRun('showDDMark', t.showDDMark, 0, [null], t);
                    }
                },'dd');
                o.each(function(o){
                    //gcable
                    var c = linb.cache.dom[o.id];
                    (c.addition || (c.addition={}))["_dropKeys"]=null;
                    (o._dropKeys || (o._dropKeys={}))[key]=true;
                });
/*
                // no clean
            //register to mode, which use region
            //register to region mode, that use onmousemove to check region
            }else
                key.each(function(v){
                    var t = this.$[v]=this.$[v]||[];
                    t.push({id:id});
                    // self clean
                    t.filter(function(o){
                        return linb.dom.byId(o.id);
                    });
                },this);
*/
            return this;
        }/*,
        _test:function(key){
            var a,i,pos,size,temp,l,t,r,b,o,d=this;
            if(a=d.$[key]){
                if(o=d._current)
                    if(d.left>=o.__l && d.left<=o.__r && d.top>=o.__t && d.top<=o.__b)
                        return;

                i=a.length;
                while(i--){
                    if((o=a[i]).__id == d._begin){
                        l=o.__l;r=o.__r;b=o.__b;t=o.__t;
                    }else{
                        pos = (temp=linb(o.id)).absPos(null, d.target_parent);
                        size={ width :temp.realWidth(),  height :temp.realHeight()};
                        o.__l=l=pos.left;
                        o.__t=t=pos.top;
                        o.__r=r=l+size.width;
                        o.__b=b=t+size.height;
                        o.__id=d._begin;
                    }
                    if(d.left>=l && d.left<=r && d.top>=t && d.top<=b){
                        d._current=o;
                        return;
                    }
                }
                d._current=null;
            }
        }*/
    },
    After:function(){
        this._reset();
    }
});
/*
1   load base class
2   load resource files
3   load required class
4   build Components
5   afterCreated
6   afterShow
7   end
    begin to load background class
*/
Class('linb.Page',null,{
    Constructor:function(){
        this.properties = this.properties||{};
        _.merge((this.events = this.events||{}), this.constructor.EventHandlers);
    },
    Instance:{
        //for set lang
        langKey:'',
        loaded:false,
        domNode:false,
        reLang:function(lang){
            if(lang){
                //linb.SC('linb.lang.'+(s?(linb.lang=s):linb.lang));
                //set linb base lang
                linb.reLang(lang);
                var key = this.langKey;
                if(!linb.Locale[linb.lang][key]){
                    //set app lang
                    linb.request(linb.getPath(this.KEY.split('.')[0]+'.Locale.' + lang, '.js', 'js'),'',function(txt){
                        linb.Locale[linb.lang][key] = _.unserialize(txt);
                    },null,false);
                }

                //set app lang
                if(this.domNode){
                    var t,v,m=String(linb.UI.$langID),n=String(linb.UI.$langID+1);
                    while(t=linb.dom.byId('lang:'+m)){
                        if(v=linb.getStr(t.className))
                            t.innerHTML=v;
                        t.id='lang:'+n;
                    }
                    linb.UI.$langID++;
                }
            }
        },
        _fireevent:function(name, args){
            var t;
            if(t=this.events[name]){
                if(typeof t=='string')t=this[t];
                if(typeof t=='function')_.tryF(t, args, this.host||this);
            }
        },
        //private
        //base,required,iniComponents
        _show : function(threadid){
            if(this.parent && this.nodes ){
                this.nodes.filter(function(o){
                    return !!o.box.hasDomRoot;
                });
                if(this.customAttach)
                    this.customAttach();
                else
                    this.parent.attach(linb.UI.pack(this.nodes, false), this.showID);

                this._fireevent('afterShow', [this, threadid], this.host);
            }
            this.loaded=true;
        },
        //public
        create:function(properties, events, host, threadid, flag){
            //create already
            if(this.nodes)return false;
            var self=this;
            linb.thread.asyUI(threadid, [
                function(threadid){
                    linb.dom.setCover(linb.getStr('Page.base'));
                },
                //load base class
                function(threadid){
                    var t;
                    if((t=self.base) && t.length){
                        linb.thread.suspend(threadid);
                        linb.SC.group(t,
                            function(key){
                                linb.dom.setCover(linb.getStr('Page.base',key));
                            },
                            function(){
                                linb.thread.resume(threadid);
                            },function(){
                                linb.thread.resume(threadid);
                            }
                        );
                    }
                },
                function(threadid){
                    if(self.getResource)
                        self.getResource.call(self, threadid);
                },
                //load UI widgets
                function(threadid){
                    if(self.langKey)self.reLang(linb.lang);

                    //Including Components
                    linb.dom.setCover(linb.getStr('Page.com', self.KEY));
                    var t;
                    if((t=self.required) && t.length){
                        linb.thread.suspend(threadid);
                        linb.SC.group(t,
                            function(key){
                                linb.dom.setCover(linb.getStr('Page.required', self.KEY, key));
                            },function(){
                                linb.thread.resume(threadid);
                            },function(){
                                linb.thread.resume(threadid);
                            }
                         );
                    }
                },
                function(threadid){
                    //Building Components
                    linb.dom.setCover(linb.getStr('Page.build', self.KEY));
                    self._fireevent('beforeIniComponents', [self, threadid]);
                    //new thread
                    _.tryF(self.iniComponents,null,self);

                    self.domNode=true;
                },
                function(threadid){
                    self._fireevent('afterCreated', [self, threadid]);
                },
                function(threadid){
                    //show ui dir
                    if(flag)
                        self._show(threadid);
                    //lazy load
                    if(self.background)
                        linb.SC.background(self.background);
                }
            ]);
        },
        iniComponents:function(){
            return this.nodes=[];
        },
        /*parent, showID, properties, events, host, threadid
        the last one is threadid always
        */
        show:function(){
            //get paras
            var parent, showID, properties, events, host, threadid;
            var arr=_.toArr(arguments);
            threadid=arr.pop();
            if(arr[0])parent=arr[0];
            if(arr[1])showID=arr[1];
            if(arr[2])properties=arr[2];
            if(arr[3])events=arr[3];
            if(arr[4])host=arr[4];

            this.parent = parent||linb(document.body);
            this.showID = showID;
            _.merge(this.properties , properties ,'all');
            _.merge(this.events , events ,'all');
            this.host = host || null;
            if(this.parepareData)this.parepareData(this.properties, this.events);

            //for cache,first time give _show to thread, next time, call _show manually
            if(false === this.create.apply(this, [properties, events, host, threadid, true]))
                this._show.call(this, threadid);
        },
        destroy:function(){
            if(this.beforeDestroy)this.beforeDestroy();
            if(this.nodes){
                this.nodes.each(function(o){o.destroy()});
                this.nodes.length=0;
            }
            _.breakO([this.properties, this], 2);
            if(this.afterDestroy)this.afterDestroy();
        }
    },
    Static:{
        EventHandlers:{
            afterShow:function(page, threadid){},
            afterCreated:function(page, threadid){},
            beforeIniComponents:function(page, threadid){}
        }
    }
});

//run something
new function(){
    linb.message = function(content, caption, type, width, time){
       width = width||200;
       var div, h, me=arguments.callee,
       stack=me.stack||(me.stack=[]),
       t=linb(window), left = t.scrollLeft() + t.width()/2 - width/2, height=t.height();

       var div;
       if(!(div=stack.pop())){
           div =
           '<div style="font-size:0;line-height:0;border:solid 1px;border-color:#fff #cdcdcd #cdcdcd #fff;position:absolute;overflow:visible;top:-50px;z-index:'+linb.ini.top_zIndex+'; background:#fefefe">' +
           '<div style="font-size:14px;overflow:hidden;font-weight:bold;padding:2px;"></div>'+
           '<div style="padding:5px;"></div>'+
           '</div>';
           div = linb.create(div);
           if(div.edged)div.edged();
           linb(document.body).addLast(div);
        }
        div.setStyle({left:left+'px', width:width+'px', visibility:'visible'})
        .first().html(caption||'')
        .next().html(content||'');

        if(me.last && div!=me.last){
            var l=me.last.left();
            me.last.fx({left:[l,l+(me.last.width+width)/2+20]}).start();
        }
        me.last = div;
        me.last.width = width;

        h = div.offsetHeight();

        if(linb.browser.ie6)div.cssSize({ height :h, width :width+1});

        div.fx({top:[-h-20,20]}).start();
        _.asyRun(function(){
            div.fx({top:[20, height+20]},null,function(){stack.push(div); div.hide()}).start();
        }, time||2000);
    };

    //for hot keys
    linb(document).onKeydown(function(p,e){
        linb.event.currentKey=linb.event.getKey(e);
        if(linb.event.currentKey){
            var set = linb.cache.hookKey[linb.event.currentKey.join(":")];
            //if hot function return false, stop bubble
            if(set && (_.tryF(set[0],set[1],set[2])===false)){
                linb.event.stopBubble(e);
                return false;
            }
        }
        return true;
    },"document")
    .onKeyup(function(p,e){
        linb.event.currentKey=null;
    },"document");
    //for clear memory
    linb(window).afterUnload(function(){
        //unlink link 'App'
        linb.SC.$gc();
        linb.thread.$gc();
        linb([window, document]).clearEvent();
        linb(document.body).empty();
        linb.dom.$gc();
        _.breakO([linb,Class,_],3);
        window.Class=window.linb=window._=window.$=undefined;
    },"window",-1);
    if(!linb.debug)
        window.onerror = function(msg, fileName, line){
            linb.message(msg + ": " + fileName + " (" + line + ")");
        };
    //for ie6
    if(linb.browser.ie6){
        window.XMLHttpRequest = function(){return new ActiveXObject("Msxml2.XMLHTTP")};
        try {document.execCommand('BackgroundImageCache', false, true);}catch(e){}
    }
    linb.Locale.en={
        Class:"parent class '$0' not exists!",
        SC:"eval error '$0' in SC.",
        selector: 'Invalid selector expression: "$0"!',
        XMLHTTP:'XMLHTTP return $0',
        timeout:'timeout',
        inValid:'Invalid data exists!',
        Page:{
            base:'Loading base Class "$0" ...',
            required:'Loading "$0" Class: "$1" ...',
            com: 'Loading "$0" Components...',
            build: 'Building "$0" Components...'
        }
    };
    linb.reLang('en');
};