/*
jsLinb 1.2
Copyright(c) 2008 Yingbo Li(linb.net, linb.net[at]gmail.com).
GPL3 (http://www.opensource.org/licenses/gpl-3.0.html) licenses.
*/
undefined;
/* base _
*
*declare _ (global)
*
*/
/*
*load linb.logger to redefine window.error
*/
//window.error=function(){return true};
//time stamp
_=function(){return +new Date()};

/*merge hash from source to target
  target:hash
  source:hash
  type: 'all', 'with', 'without', or function <return true will trigger merge>, default is 'without'
  return:  merged target
*/
_.merge=function(target, source, type){
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
};
_.merge(_,{
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
            if(!hash || (hash=hash[arr[i++]])===undefined )return;
        return hash;
    },
    /*
    set/unset a value to deep hash
    example:
        _.set({a:{b:{c:1}}},['a','b','c'],2) => {a:{b:{c:2}}}
        _.set({a:{b:{c:1}}},['a','b','c']) => {a:{b:{}}}
    */
    set:function(hash,arr,value){
        var v,i,m,last=arr.length-1,key = arr[last];
        for(i=0;i<last;){
            v=arr[i++];
            if(hash[v]&&((m=typeof hash[v])=='object' || m=='function')) hash=hash[v];
            else hash=hash[v]={};
        }
        if(value===undefined)
            delete hash[key];
        else
            return hash[key]=value;
    },
    /*
    new function shortcut
    */
    fun:function(){return function(){}},
    /*
    fun:function to run;
    args:arguments for fun;
    target:target object for 'this' of fun;
    df:default return vale, if f is not a valid function;
    */
    tryF:function(fun, args, target, df){
        return (fun && typeof fun=='function') ? fun.apply(target||null, args||[]) : df
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
    isEmpty:function(hash){for(var i in hash)return false; return true},

    /*
    this will always run newer function
    key: for identify
    fun: to run
    defer: setTimeout defer time
    args: arguments for fun
    target: 'this' for fun
    */
    resetRun:function(key, fun, defer ,args, target){
        var me=arguments.callee, k=key, cache = me.cache || (me.cache = {});
        if(cache[k]){clearTimeout(cache[k])}
        if(typeof fun=='function')
            cache[k] = setTimeout(function(){delete cache[k];fun.apply(target||null,args||[])},defer||0);
        else delete cache[k];
    }
});

/* declare Class
*  dependency: base _
*
*Class
*
*/
Class=function(key, parent_key, o){
    var _Static, _Instance, _parent=[], self=Class, env=self._fun, reg=self._reg, parent0, temp, _this,i,t;
    o=o||{};

    if(t=_.get(window, key.split('.')))return t;

    /*multi parents
    */
    parent_key = ( !parent_key?[]:typeof parent_key=='string'?[parent_key]:parent_key);
    for(i=0; t=parent_key[i]; i++)
        if(!(_parent[i]=(_.get(window, t.split('.')) || (linb&&linb.SC&&linb.SC(t)))))
            throw new Error('No parent class :'+ t);
    
    if(o.Dependency)
        for(i=0; t=o.Dependency[i]; i++)
            if(!(_.get(window, t.split('.')) || (linb&&linb.SC&&linb.SC(t))))
                throw new Error('No dependency class :'+ t);
    parent0=_parent[0];

    /* collect items
    */
    _Static=o.Static||{};
    t={};
    for(i in _Static)
        if(reg[i])t[i]=1;
    for(i in t)
        delete _Static[i];
    //before and after will pass to children
    _Static.Before = o.Before || (parent0&&parent0.Before);
    _Static.After = o.After || (parent0&&parent0.After);
    _Static.$gc = o.$gc || _Static.$gc || function(){Class.$gc(this.$key);};

    _Instance = o.Instance||{};

    /*set constructor first and create _this
    upper is the first parent Class
    */
    if(typeof o.Constructor == 'function'){
        _this = env(o.Constructor, 'Constructor', key, parent0||_.fun());
        _this.Constructor = String(o.Constructor);
    }else{
        if(parent0){
            // Constructor is for opera, in opear fun.toString can't get arguments sometime
            var f=_.fun(),str = parent0.Constructor;
            if(str)f=new Function(str.slice(str.indexOf("(") + 1, str.indexOf(")")).split(','), str.slice(str.indexOf("{") + 1, str.lastIndexOf("}")));
            _this = env(f, 'Constructor', key, parent0.upper);
            _this.Constructor = str;
        }else
            _this = _.fun();
    }
    _this.KEY = _this.$key = _this.prototype.KEY = _this.prototype.$key = key;

     /*envelop current functions
     will cover the preview
     */
    //for Static
    self._ob(_parent,_this, _Static);
    //for Instance
    self._ob(_parent,_this.prototype, _Instance, false, true);

    /*inherit
    keep the last one
    */
    for(i=0; t=_parent[i]; i++){
        //keep upper
        temp=_this.upper;
        self._ob(_parent, _this, t, true);
        _this.upper=temp;

        self._ob(_parent, _this.prototype, t.prototype, true, true);
    }

    /*run before first
    */
    if(_.tryF(_this.Before, arguments, _this, true)===false)
        return false;

    /*multi parents
    */
    for(i=0; t=_parent[i]; i++){
        //push key is important in IE, for IE array refrence bug
        t=(t.$children || (t.$children=[]));
        for(var j=0,k=t.length,b;j<k;j++)
            if(t[k]==key){
                b=true;
                break;
            }
        if(!b)t[t.length]=key;
    }

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
_.merge(Class, {
    _reg:{$key:1,$parent:1,$children:1,KEY:1,Static:1,Instance:1,Constructor:1,Initialize:1},
    _reg2:{'constructor':1,'prototype':1,'toString':1,'valueOf':1},
    /*envelop a function by some keys
    */
    _fun:function(fun, name, original, upper){
        fun.$name$=name;
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
        var self=this, i,j,o;
        for(i in src){
            //doesn't inherit $
            if(
                (i in target)||
                (i.charAt(0)=='$' && inherit) ||
                self._reg2[i] ||
                (!instance && self._reg[i])
            )continue;
            o=src[i];
            if(o && o.$linb$)continue;
            target[i] = (inherit || typeof o != 'function' || o.$ignore$) ? o : self._fun(o, i,target.KEY, self._upper(parent, i, instance) );
        }
        for(j=0;i=self._other[j++];){
            o=src[i];
            if(o && (o == self._o[i]))continue;

            target[i] = (inherit || typeof o != 'function' || o.$ignore$) ? o : self._fun(o, i,target.KEY, self._upper(parent, i, instance) );
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
            for(var i=0,o; t=t.$children[i];i++){
                o=_.get(window,o.split('.'));
                o.$gc();
            }

            t.$parent.length=t.$children.length=0;
            _.set(window, key.split('.'));
        }
    }
});

/*declare linb
*dependency: base _
*
*linb
*
*/
linb=function(nodes,flag){return linb.dom.pack(nodes, flag)};
_.merge(linb,{
    cache:{dom:{},domId:{},time:{},template:{},hookKey:{},event:{},thread:{},SC:{},text:{},block:{}},
    /*
    default is current path
    linb.ini():set path to current path
    linb.ini(p):set path to p
    */
    ini : function(path){linb.ini.path=path},
    Locale:{en:{}},
    lang:'en',
    langId:'linb_lang',
    /*
    * you need to import jsLinb/Locale/en.js manully, if you don't want to use reLang
    */
    reLang:function(s,cb){
        var l=linb.Locale,g=linb.getRes,t,v,i,j,f,m,z,a=[];
        linb.lang=s;
        v = linb.browser.ie ? document.all.tags('span') : document.getElementsByTagName('span');
        for(i=0;t=v[i];i++)if(t.id==linb.langId)a[a.length]=t;
        f=function(){
            setTimeout(function(){
                j=a.splice(0,100);
                for(i=0;t=j[i];i++)
                    if(typeof(v=g(t.className))=='string')
                        t.innerHTML=v;
                if(a.length)
                    setTimeout(arguments.callee,0);
                _.tryF(cb);
            },0)
        },
        z = 'linb.Locale.' + s,
        m=function(){
            linb.include(z+'.'+linb.ini.appLangKey,linb.getPath('Locale.' + s, '.js'),f,f);
        };
        linb.include(z,linb.getPath(z, '.js'),m,m);
    },
    _r:/\x24(\d+)/g,
    getRes:function(a){
        var d,
            b= a.indexOf('-')!=-1?((d=a.split('-'))&&(a=d[0])&&d):arguments ,
            c=_.get(linb.Locale[linb.lang], a.split('.'));
        return (d=typeof c)=='string'
               ? c.replace(linb._r,function(z,a){return b[parseInt(a)+1]||z})
               : d=='function'
               ? c.apply(null,b) :
               c ? String(c) : a.substr(a.lastIndexOf('.')+1)
    },
    wrapRes:function(){
        var id=arguments[0], s,r;
        if(id.charAt(0)=='$')arguments[0]=id.substr(1,id.length-1);
        s=arguments[0];
        r= linb.getRes.apply(null,arguments);
        if(s==r)r=id;
        return '<span id="'+linb.langId+'" class="'+s+'">'+r+'</span>';
    },
    /* set shortcut for ajax
    */
    request:function(){
        if(!arguments[1])
            arguments[1]=String(_());
            return (linb.io.crossDomain(arguments[0])?(arguments[5]&&arguments[5].method.toLowerCase()=='post')?linb.iajax:linb.sajax:linb.ajax).apply(null, arguments).start()
    },
    include:function(k,s,f,g){if(k&&linb.SC.evalPath(k))_.tryF(f); else linb.sajax(s,'',f,g,0,{rspType:'script'}).start()},
    /*
    set application main function, only single function can be set
    example:
        linb.main(function(){
            ...
        });
    */
    _m:[],
    main:function(f){linb._m.push(f)},
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
    getPath : function(key, tag, add){
        key=key.split('.');
        if(add){
            var a=[key[0],add];
            for(var i=1,l=key.length;i<l;i++)
                a.push(key[i]);
            key.length=0;
            key=a;
        }

        var pre,ini=linb.ini;
        if(key[0]=='linb'){
            pre=ini.path;
            key.shift();
            if(key.length==(add?1:0))key.push('linb');
        }else{
            pre=ini.appPath;
            if(key.length==((add?1:0)+1) && tag=='.js')key.push('index');
            if(ini.verPath) pre += ini.verPath + '/';
            if(ini.ver) pre += ini.ver + '/';
        }
        return pre + key.join('\/') + (tag||'\/');
    },
    temp:{},
    log:_.fun(),
    message:_.fun(),
    /* object cache
    */
    _object:[],
    getObject:function(id){return linb._object[id]}
});
new function(){
      //special var
    if(window.linb_ini)
        _.merge(linb.ini,window.linb_ini);

    _.merge(linb.ini,{
        appPath:location.href.split('?')[0].replace(/[^\\\/]+$/,''),
        appLangKey:'app',
        file_bg:'bg.gif',
        file_xd:'xd.html'
    });
    if(!linb.ini.path){
        var i,s,arr = document.getElementsByTagName('script'), reg = /js\/linb\.js$/;
        for(i=0; s=arr[i]; i++)
            if(s.src.match(reg)){
                linb.ini.path = s.src.replace(reg,'');
                break;
            }
    }
    /*
    *
    *browser sniffer
    *
    */
    var w=window, u = navigator.userAgent.toLowerCase(), d=document, b=linb.browser={
        ver:(u.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
        kde:/webkit/.test(u),
        opr:/opera/.test(u),
        ie:/msie/.test(u) && !/opera/.test(u),
        gek:/mozilla/.test(u) && !/(compatible|webkit)/.test(u)
    };
    if(b.ie){
        if(u.indexOf(' 7')!=-1)
            b.ie7 = true;
        else{
            b.ie6 = true;
            //ex funs for ie6
            try {document.execCommand('BackgroundImageCache', false, true)}catch(e){}
            w.XMLHttpRequest = function(){return new ActiveXObject("Msxml2.XMLHTTP")};
        }
    }
    b.contentBox = function(n){
        return (b.ie||b.opr) ?
                !/BackCompat|QuirksMode/.test(d.compatMode) :
                (n = (n=n||d.documentElement).style["-moz-box-sizing"] || n.style["box-sizing"]) ? (n=="content-box") : true;
    }();

    /*
    *
    *for dom ready
    *
    */
    var f = function(){
        if(d.addEventListener && !b.kde)
            d.removeEventListener("DOMContentLoaded",arguments.callee,false);
        try{
            for(var i=0,l=linb._m.length;i<l;i++)
                _.tryF(linb._m[i])
            linb._m.length=0;
        }catch(e){
            _.asyRun(function(){throw e})
        }
    };

    /* for Mozilla/Opera9 */
    if (d.addEventListener && !b.kde)
        d.addEventListener("DOMContentLoaded", f, false);
    //for ie
    else if (b.ie)
        (function(){try{
            //for ie7 iframe(doScroll is always ok)
            d.activeElement.id;
            d.documentElement.doScroll('left');f()}catch(e){setTimeout(arguments.callee,1)}})();
    //kde
    else
        (function(){/loaded|complete/.test(d.readyState)?f():setTimeout(arguments.callee,1)})()
};

/*linb.thread
*  dependency: base _ ; Class ; linb
*
*linb.thread
*
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
        var self=this,me=arguments.callee,t=linb.cache.thread;
        // linb.thread() => self.constructor!==me
        // in an inner method => !!self.id is true
        if(self.constructor!==me || !!self.id)
            return new me(id, tasks, delay, callback, onStart, onEnd, cycle);

        if(typeof id!='string')id='$' + (self.constructor.id++);
        self.id=id;
        //thread profile
        self.profile = t[id] || (t[id] = {
            id:id,
            _start:false,
            time:0,
            _left:0,
            _asy:-1,
            //sleep_flag:-1,
            index:0,

            tasks:tasks||[],
            delay: delay || 0,
            callback:callback||_.fun(),
            onStart:onStart||_.fun(),
            onEnd:onEnd||_.fun(),
            cache:{},
            status:"run",
            cycle:!!cycle
        });
    },
    Instance:{
        $gc:function(){
            var m=linb.cache.thread,t=m[this.id];
            if(t){
                delete m[this.id];
                t.tasks.length=0;
                for(var i in t)t[i]=null;
            }
        },
        _task:function(){
            var self=this,p=self.profile,t={args:[]}, value=p.tasks[p.index],r;
            p._asy=-1;

            //get args
            if(typeof value == 'function')
                t.task=value;
            else
                _.merge(t, value , 'all');

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
            p.time=_();
            //if error raise in the process, abort the thread
            try{
                r = _.tryF(t.task, t.args, t.target, null);
                //stop
                if(p.status!=="run")return;
                //cache return value
                if(t.id)p.cache[t.id] = r;
                // call back function
                // if callback return false, stop.
                if(t.callback)
                    if(false===_.tryF(t.callback, [p.id], null, true)){
                      p.status="stop";
                      return;
                    }
            }catch(e){
                self.abort();
                linb.logger && linb.logger.trace(e);
            }
            // if set Sleep at t.task or t.callback , stop continue running
            if(!p || p.status!=="run")return;
            self.start();
        },
        start:function(time){
            var self=this, p = self.profile, delay;
            if(p._start===false){
                p._start=true;
                //call onstart
                if(false===_.tryF(p.onStart,[p.id],self))self.abort();
            }
            if(!p.tasks.length)return self.abort();
            if(p.index>=p.tasks.length)
                if(p.cycle===true)
                    self.profile.index = 0;
                else
                    return self.abort();

            delay = p.tasks[p.index].delay;
            if(delay===undefined)delay=p.delay;
            p._left= (time || time===0)?time:delay;

            if(p._asy!=-1)clearTimeout(p._asy);
            p._asy = _.asyRun(self._task, p._left, [], self);
            p.time=_();
            return self;
        },
        suspend:function(){
            var n,p=this.profile;
            if(p.status=="pause")return;
            p.status="pause";
            if(p._asy!==-1){
                clearTimeout(p._asy);
                if(p.index>0)p.index--;
            }
            n=p._left-(_() - p.time);

            p._left=(n>=0?n:0);
            return this;
        },
        /*time
        number:set timeout to number
        true:set timeout to default
        false:set timeout to 0
        undefined: timetou to left
        */
        resume:function(time){
            var self=this;
            if(self.profile.status=="run")return;

            time = time===undefined ?
                    self.profile._left :
                        (time || time===0) ?
                        (time>=0)? time : 0 :
                        (time===true) ? self.profile.delay : 0
            ;

            self.profile.status="run";
            self.start(time);
            return self;
        },
        abort:function(){
            var t=this.profile;
            clearTimeout(t._asy);
            _.tryF(t.onEnd, [t.id]);
            this.$gc();
            return;
        },
        insert:function(arr, index){
            var self=this,o=self.profile.tasks,l=o.length,a;
            if(arr.constructor!=Array)arr=[arr];
            index= index || self.profile.index;
            if(index<0 || index>l)index=l;
            a=o.splice(index,l-index);
            o.push.apply(o, arr);
            o.push.apply(o, a);
            return self;
        },
        getCache:function(key){
            return this.profile.cache[key];
        },
        setCache:function(key,value){
            this.profile.cache[key] = value;
            return this;
        }
    },
    After:function(){
        /*
        give shortcut to some functions
        */
        var self=this, f=function(i){
            self[i]=function(id){
                var t;
                if(linb.cache.thread[id])
                    (t=linb.thread(id))[i].apply(t,Array.prototype.slice.call(arguments,1));
            }
        },
        a = 'start,suspend,resume,abort'.split(',');
        for(var i=0,l=a.length;i<l;i++)f(a[i]);
    },
    Static:{
        id:1,
        $gc : function(){
            linb.cache.thread={};
        },
        exists:function(threadid){
            return !!linb.cache.thread[threadid];
        },
        asyUI:function(threadid,tasks,onEnd){
            var thread=linb.thread, dom=linb.dom;
            //if thread exists, just inset task to the next positiong
            if(linb.cache.thread[threadid]){
                if(typeof onEnd=='function')
                    tasks.push(onEnd);
                thread(threadid).insert(tasks);
            //if does not exist, create a new thread
            }else{
                thread(null, tasks,
                    0,null,
                    //set busy status to UI
                    function(threadid){
                        if(dom)dom.busy(true,threadid)
                    },
                    //set free status to UI
                    function(threadid){
                        _.tryF(onEnd);
                        if(dom)dom.free(threadid)
                    }
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
            var bak={},
                thread=linb.thread,
                f=function(o,i,threadid){
                    if(typeof o == 'string')o=thread(o);
                    if(o){
                        var f = function(){
                            var me=arguments.callee;
                            _.tryF(me.onEnd,arguments,this);
                            me.onEnd=null;
                            delete bak[i];
                            //call callback here
                            _.tryF(callback,[i, threadid],this);
                            if(_.isEmpty(bak))
                                thread.resume(threadid);
                        };
                        f.onEnd = o.profile.onEnd;
                        o.profile.onEnd = f;
                        o.start();
                    }
                };
            for(var i in group)bak[i]=1;
            return thread(id, [function(threadid){
                if(!_.isEmpty(group)){
                    thread.suspend(threadid);
                    for(var i in group)f(group[i],i, threadid);
                }
            }],0,null,onStart,onEnd);
        }
    }
});


/*linb.io/ajax
*  dependency: base _ ; Class ; linb ; linb.thread
*
*linb.io/ajax/sajax/iajax
*
*/
/*
        get     post    get(cross domain)   post(corss domain)  post file   return big data(corss domain)
ajax    +       +       -                   -                   -           -
sajax   +       -       +                   -                   -           *
iajax   +       +       +                   *                   *           -
*/
/*
in IE/firefox/safari, image/css url is enough
in opear, use xd.html
   if return multi iframes, randkey will be added in each Fragment Identifiers
*/
Class('linb.io',null,{
    Constructor:function(uri, queryString, onSuccess, onFail, threadid, args){
        //get properties
        if(typeof uri=='object')
            args=uri;
        else{
            args=args||{};
            _.merge(args, {
                uri:uri,
                queryString:queryString,
                onSuccess:onSuccess,
                onFail:onFail,
                threadid:threadid
            });
        }
        //for cache
        var self=this,  me=arguments.callee,con=self.constructor;
        if((con !== me) || self.id)
            return new me(args);

        //give defalut value to those members
        _.merge(args,{
            id : args.id || (_()+ '' +(con.id++)),
            uri : args.uri||'',
            queryString : args.queryString||'',
            asy : args.asy!==false,
            method : 'POST'==(args.method||con.method).toUpperCase()?'POST':'GET'
        },'all');
        var a='retry,timeout,rspType,customQS'.split(',');
        for(var i=0,l=a.length;i<l;i++)
            args[a[i]] = (a[i] in args)?args[a[i]]:con[a[i]];

        _.merge(self, args, 'all');
        if(con.events)
            _.merge(self, con.events,'without');
        _.merge(self, con._ev,'without');


        if(self.customQS)
            self.queryString = self.customQS(self.queryString);

        if(!self._useForm && typeof self.queryString!='string')
            self.queryString = con.buildQS(self.queryString, self._single);

        return self;
    },
    Instance:{
        _fun:_.fun(),
        _flag:0,
        _response:'',
        _retryNo:0,
        _end:false,

        _message:function(){},
        _time:function() {
            var self=this,c=self.constructor;
            self._clear();
            if (self._retryNo < self.retry) {
                self._retryNo++;
                self._e("Retry", self._retryNo);
                self.start();
            }else{
                self._e("Timeout");
                self._e("Error", new Error("timout"));
            }
        },
        _e:function(n, o) {
            var self=this,r;
            try{
                r=_.tryF(self["on" + n], [o], self);
            }catch(e){
                linb.logger && linb.logger.trace(e);
            }
            if(n=="Response" || n=="Error" || n=="Abort"){
                self._end=true;
                if(self._flag>0){
                    clearTimeout(self._flag);
                    self._flag=0
                }
                self._e("End");
                self._clear();
            }
        },
        abort:function(){
            this._e("Abort");
        }
    },
    Static:{
        $i:true,
        id:1,
        method:'GET',
        retry:2,
        timeout:10000,
        rspType:'text',

        //paras in request object
        type:'type',
        randkey:'id',
        callback:'callback',

        buildQS:function(h, flag){
            if(flag)
                return _.serialize(h);
            var a=[],i,o;
            for(i in h){
                o=h[i];
                a.push(encodeURIComponent(i)+'='+encodeURIComponent(typeof o=='string'?o:_.serialize(o)));
            }
            return a.join('&');
        },
        _ev:{
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
                var self=this;
                if(false===_.tryF(self.beforeSuccess,[self._response, self.rspType, self.threadid], self))
                    return;
                _.tryF(self.onSuccess,[self._response, self.rspType, self.threadid], self);
            },
            onError:function(e){
                var self=this;
                _.tryF(self.beforeFail,[e, self.threadid],self);
                _.tryF(self.onFail,[self._response, self.rspType, self.threadid], self);
            }
        },
        response:function(txt,r,i,l) {
            var self = this, obj, o;
            try{
                //multi return from xd.html
                if(r){
                    i=parseFloat(i);
                    l=parseFloat(l);
                    if(o=self.pool[r]){
                        o=o.__||(o.__=[]);
                        o[i]=txt;
                        while(l--)if(o[i]===undefined)return;
                        if(obj=_.unserialize(o.join(''))){
                            o._response=obj;
                            o._e("Response");
                        }
                    }
                }else{
                    obj = typeof txt=='string' ? _.unserialize(txt) : txt;
                    if(obj && (o = self.pool[obj[self.randkey]])){
                        for(i=0;i<o.length;i++){
                            o[i]._response=obj;
                            o[i]._e("Response");
                        }
                    }
                }
            }catch(e){
                linb.logger && linb.logger.trace(e);
            }
        },
        createif:function(doc,content,id,src,onLoad){
            var n = doc.createElement(linb.browser.ie?"<iframe name='"+id+"'>":"iframe"),w,d;
            if(id)n.id=n.name=id;
            if(src)n.src=src;
            if(onLoad)n.onload=onLoad;
            n.style.display = "none";
            doc.body.appendChild(n);
            w=frames[frames.length - 1];
            d=w.document;
            d.open();
            d.write(content||'');
            d.close();
            return [n,w,d];
        },
        crossDomain:function(uri){
            var me=arguments.callee,
                r=me.r || (me.r=/(http(s)?\:\/\/)?([\w\.]+(:[\d]+)?)(.*)/),t;
            if((t=uri.indexOf(':'))==-1||t>uri.indexOf('/'))return false;
            if(uri.indexOf('file:')===0)return !!location.host;
            return  location.host != uri.replace(r,'$3')
        },
        /*
        get multi ajax results once
        */
        group: function(group, callback, onStart, onEnd){
            var i,f=function(o,i,group){
                group[i]=linb.thread(null,[function(threadid){
                    o.threadid=threadid;
                    o.start();
                }]);
            };
            for(i in group)f(group[i],i,group);
            return linb.thread.group(null, group, callback, onStart, onEnd);
        },
        /*
        get ajax multi results one by one on the background
        */
        background:function(arr, callback, onStart, onEnd, threadid){
            var i=0, fun=function(threadid){
                var o = arr[i++];
                o.threadid=threadid;
                this(o).start();
                if(arr.length<=i)
                    return linb.thread(threadid).abort();
            };
            linb.thread(threadid||null, [fun], 100, callback, onStart, onEnd, true).start();
        }
    }
});
Class('linb.ajax','linb.io',{
    Instance:{
        _single:true,
        _XML:null,
        start:function() {
            var self=this,t;
            if(t=_.tryF(self.beforeStart,[],self))
                return _.tryF(self.onSuccess,[t, self.rspType, self.threadid], self);
            if (!self._retryNo)
                self._e("Start");
            try {
                with(self){
                    //must this.XMLHTTP, else opera will not set the new one
                   var x = _XML = new XMLHttpRequest();
                   if(asy)
                       x.onreadystatechange = function(){
                           if(self && x && x.readyState==4) {
                               self._complete.apply(self);
                               //must clear here, else memory leak
                               self._clear();
                           }
                       };

                    if (!_retryNo && method != "POST"){
                        if(queryString)
                            uri = uri.split("?")[0] + "?" + queryString;
                        queryString=null;
                    }

                    if(x.overrideMimeType)
                          x.overrideMimeType('text/xml');

                    x.open(method, uri, asy);
                    if(method != "POST")
                        x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                        if(x.overrideMimeType )
                    x.setRequestHeader("Connection", "close");

                    //for firefox syc GET bug
                    try{x.send(queryString);}catch(e){}

                    if(asy){
                      if(x&&timeout > 0)
                        _flag = _.asyRun(function(){if(self && !self._end){self._time()}}, self.timeout);
                    }else
                        _complete();
                }
            }catch(e){
                self._e("Error", e);
            }
            return self;
        },
        abort:function(){
            var self=this, x = self._XML;
            if(x){
                x.onreadystatechange=self._fun;
                x.abort();
                self._XML=null;
            }
            arguments.callee.upper.call(self);
        },
        _clear:function(){
            var self=this,x = self._XML;
            if(x){
                x.onreadystatechange=self._fun;
                self._XML=null;
            }
        },
        _complete:function() {
            with(this){
                var x=_XML,status = x.status;
                _response = rspType=='text'?x.responseText:x.responseXML;
                if(status===undefined || status===0 || status==304 || (status >= 200 && status < 300 ))
                    _e("Response");
                else
                    _e("Error", new Error('XMLHTTP return ' +status));
            }
        }
    }
});
Class('linb.sajax','linb.io',{
    Instance:{
        start:function(){
            var self=this,id,c=self.constructor, t, n, ok=false;
            if(t=_.tryF(self.beforeStart,[],self))
                return _.tryF(self.onSuccess,[t, self.rspType, self.threadid], self);
            if (!self._retryNo)
                self._e("Start");

            //first
            id=self.id;
            if(c.pool[id])
                c.pool[id].push(self);
            else 
                c.pool[id]=[self];

            var w=c._n=document;
			n = self.node = w.createElement("script");
			n.src = self.uri + (self.queryString?'?'+self.queryString:'');
			n.type= 'text/javascript';
			n.charset='utf-8';
			n.id='linb:script:'+self.id;
            n.onload = n.onreadystatechange = function(){
                var t=this.readyState;
                if(!ok && (!t || t == "loaded" || t == "complete") ) {
                    ok=true;
                    if(self.rspType=='script')
                        self._e("Response");
                    else self._loaded();
                }
            };
            n.onerror=function(){
                self._loaded();
            };

            //w.getElementsByTagName("head")[0].appendChild(n);
			w.body.appendChild(n);

            //set timeout
            if(self.timeout > 0)
                self._flag = _.asyRun(function(){if(self && !self._end){self._time()}}, self.timeout);
        },
        _clear:function(){
            var self=this, n=self.node, c=self.constructor, div=c.div||(c.div=c._n.createElement('div')),pool=self.constructor.pool;
            pool.length=0;
            delete pool[self.id];
            if(n){
                self.node=n.id=n.onload=n.onreadystatechange=n.onerror=null;

                if(self.rspType!='script'){
                    //in ie + add script with url(remove script immediately) + add the same script(remove script immediately) => crash
                    //so, always clear it later
                    div.appendChild(n.parentNode&&n.parentNode.removeChild(n)||n);
                    if(linb.browser.ie)
                        _.asyRun(function(){div.innerHTML='';n.removeNode()});
                    else
                        div.innerHTML='';
                }
            }
        },
        _loaded:function(){
            var self=this;
            _.asyRun(function(){
                if(self.id && self.constructor.pool[self.id])
                    self._e("Error", new Error("script error"));
            },200);
        }
    },
    Static : {
        pool:{},
        customQS:function(obj){
            var c=this.constructor, t=c.type, k=c.randkey, b=c.callback,nr=(this.rspType!='script'),rand=nr?k + '=' + this.id + '&type=script&':'';
            if(typeof obj=='string')
                return (obj && obj + '&') + rand + (nr?b + '=linb.sajax.response':'');
            else{
                if(nr){
                    obj[t]='script';
                    obj[k]=this.id;
                    obj[b]="linb.sajax.response";
                }
                return obj;
            }
        }
    }
});
Class('linb.iajax','linb.io',{
    Instance:{
        _useForm:true,
        start:function(){
            var self=this,c=self.constructor, i, id, t, n, k, o, b, form, ok=false;
            if(t=_.tryF(self.beforeStart,[],self))
                return _.tryF(self.onSuccess,[t, self.rspType, self.threadid], self);
            if (!self._retryNo)
                self._e("Start");

            //first
            id=self.id;
            if(c.pool[id])
                c.pool[id].push(self);
            else 
                c.pool[id]=[self];

            //create iframe
            var a=c.createif(document,null,(id='linb:if:'+self.id) );
            self.node=a[0];
            self.frm=a[1];
            //create form
            form = self.form = document.createElement('form');
            form.style.display='none';
            form.action=self.uri;
            form.method=self.method;
            form.target=id;

            k=self.queryString||{};
            for(i in k){
                if(k[i] && k[i].nodeName=="INPUT"){
                    k[i].id=k[i].name=i;
                    form.appendChild(k[i]);
                    b=true;
                }else{
                    t=document.createElement('input');
                    t.id=t.name=i;
                    t.value= typeof k[i]=='string'?k[i]:_.serialize(k[i]);
                    form.appendChild(t);
                } 
            }
            if(self.method=='POST' && b){
                form.enctype = 'multipart/form-data';
                if(form.encoding)
                    form.encoding = form.enctype;
            }
            document.body.appendChild(form);
            //submit
            form.submit();

            if(!linb.browser.opr)
                (function(){
                    if(self._c())
                        self._tf = setTimeout(arguments.callee,50);
                })();

            //set timeout
            if(self.timeout > 0)
                self._flag = _.asyRun(function(){if(self && !self._end){self._time()}}, self.timeout);
        },
        _c:function(){
            var self=this;
            if(!self._end){
                var frms=self.frm.frames,s,i,l,t;
                if(l=frms.length){
                    try{
                        if(frms[0].location.href.split('#')[0]!=self.constructor.dummy)
                            return true;
                        s=[];
                        for(i=0;i<l;i++){
                            t=(frms[i].location.href).split('#')[1];
                            //for complicated return <if return multi Fragment Identifiers for opera, data string will be put after "s=">
                            if(t.indexOf('s=')!=-1){
                                t=t.split('s=')[1];
                                t=t.split('&')[0];
                            }
                            s.push(t||'');
                        }
                    }catch(e){
                        return true
                    }
                    self.constructor.response(decodeURIComponent(s.join('').replace(/\+/g,' ')));
                    return false;
                }
            }
            return true;
        },
        _clear:function(){
            var self=this, n=self.node,f=self.form, c=self.constructor, div=c.div||(c.div=document.createElement('div'));
            self.form=self.node=self.frm=null;
            clearTimeout(self._tf);
            if(n)div.appendChild(n.parentNode.removeChild(n));
            if(f)div.appendChild(f.parentNode.removeChild(f));
            div.innerHTML='';
        }
    },
    Static : {
        method:'POST',
        retry:0,
        pool:{},
        getDummyRes : function(win){
            win=win||window;
            var ns=this,
                arr,o,
                d=win.document,
                ini=linb.ini,
                b=linb.browser,
                f=ns.crossDomain;
            if(ns.dummy)return ns.dummy;
            //can get from linb.ini;
            if(ini.dummy)return ns.dummy=ini.dummy;
            if(b.opr)
                return ns.dummy = ini.path + ini.file_xd;
            if (b.gek) {
                arr=d.getElementsByTagName("link");
                for(var i=0,j=arr.length; i<j; i++){
                    o = arr[i];
                    if (o.rel == "stylesheet" && !f(o.href))
                        return ns.dummy=o.href.split('#')[0];
                }
            }

            if(!f(ini.path)){
                //not for 'ex-domain include jslinb' case
                if(!d.getElementById('linb:img:bg')){
                    o=d.createElement('img');
                    o.id='linb:img:bg';
                    o.src=ini.path + ini.file_bg;
                    o.style.display='none';
                    d.body.appendChild(o);
                }
            }
            arr=d.getElementsByTagName("img");
            for(var i=0,j=arr.length; i<j; i++){
                o = arr[i];
                if(!f(o.src))
                    return ns.dummy=o.src.split('#')[0];
            }
            //get from parent, not for opera in this case
            try{
                win=win.parent;
                alert(win.document.location);
                if(win && !f(''+win.document.location.href))
                    return ns.getDummyRes(win);
            }catch(e){}
        },

        tpl:function(){return '<iframe src="'+this.getDummyRes() + '#"></iframe>'},
        customQS:function(obj){
            var c=this.constructor;
            obj[c.type]='frame';
            obj[c.callback]=c.tpl();
            obj[c.randkey]=this.id;
            return obj;
        }
    }
});

/*linb.SC
*  dependency: base _ ; Class ; linb ; linb.thread ; linb.io/ajax
*inb.SC : for straight call
*path: linb.dom.Tabs
*asy: true ,false, default false
*threadid: fro asy===true
*
*   asy     prepare use
*   true    true    ajax asy=true
*   true    false   sajax
*   false   ture    ajax asy=false
*   false   false   ajax asy=false
*/
Class('linb.SC',null,{
    Constructor:function(path, onEnd, flag, args){
        var p = linb.cache.SC,r;
        if(r=p[path]||(p[path]=_.get(window,path.split('.'))))
            _.tryF(onEnd,[],r);
        else{
            args=args||{};
            args.$cb=onEnd;
            r=p[path]=linb.SC._call(path||'', args, flag);
        }
        return r;
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
            arr = path.split('.');
            if(path=='')return o;
            for(i=0,l=arr.length; i<l; ++i)
                if (o[arr[i]]===undefined){
                    return null;
                }else
                    o = o[arr[i]];
            return o;
        },
        // function for "Straight Call"
        _call : function (s, args, flag){
            flag = !!flag;
            var i,t,r,o,funs=[],ep=linb.SC.evalPath,ct=linb.cache.text,
            f= function(text,n,threadid){
                var self=this;
                if(text){
                    //test again when asy end.
                    if(!ep(s)){
                        //prepare only
                        if(self.$p)
                            (self.$cache || ct)[self.$name]=text;
                        else
                            //for sy xmlhttp ajax
                            try{eval(text)}catch(e){throw new Error('eval error "'+e + self.$tag+'" in SC')}
                    }
                }
                _.tryF(self.$cb,[self.$name,text,threadid],ep(s));
            },fe=function(text){
                var self=this;
                //for prepare resume with error too
                _.tryF(self.$cb,[self.$name,text,self.threadid],ep(s));
            };
            //get from object first
            if(!(r=ep(s))){
                //if script in cache
                if(t=ct[s]){
                    flag=false;
                    f.call({$cb: args.$cb},t);
                    //delete it
                    delete ct[s];
                }
                //get from object second
                if(!(r=ep(s))){
                     //load from sy ajax
                     o=linb.getPath(s,'.js','js');
                     args = args ||{};
                     args.$tag = s;
                     var ajax;
                     //asy and not for prepare
                     if(flag && !args.$p){
                        args.rspType="script";
                        ajax=linb.sajax;
                     }else{
                        args.asy=flag;
                        ajax=linb.ajax;
                    }
                    //get text from sy ajax
                    ajax(o, "", f, fe, null, args).start();
                    //for asy once only
                    if(!flag)
                        r=ep(s);
                }
            }else
                if(args.$cb)
                    f.call(args);
            return r;
        },
        /*
        arr: key array, ['linb.UI.Button','linb.UI.Input']
        callback: fire this function after all js loaded
        */
        prepare:function(arr,cache,callback,onEnd, id){
            var bak={}, args={$p:1,$cache:cache};
            for(var i=0,l=arr.length;i<l;i++)
                bak[arr[i]]=1;

            if(callback||onEnd){
                args.$cb=function(key,str){
                    //give callback call
                    _.tryF(callback,[key,str]);
                    delete bak[key];
                    if(_.isEmpty(bak)){_.tryF(onEnd,[id]);onEnd=null;}
                };
            }
            for(var i=0,s; s=arr[i++];)
                this._call(s, _.merge({$name:s},args), true);
        },
        background:function(arr, callback, onStart, onEnd, id){
            var i=0,j,self=this,fun=function(threadid){
                while(self.evalPath(j=arr[i++]) && arr.length>i);
                if(arr.length<=i)
                    linb.thread(threadid).abort();
                else
                    self._call(j, {threadid:threadid},true);
            };
            linb.thread(id||null, [fun], 1000, callback, onStart, onEnd, true).start();
        },
        clearPrepare:function(){
            var i,h=linb.cache.text;
            for(i in h)
                try{eval(h[i])}catch(e){throw new Error('eval error "'+e+'" in SC')}
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
            if(arr){
                //clear first
                var self=this;
                self.clearPrepare();
                self.prepare(arr, linb.cache.text, callback, function(){
                    self.clearPrepare();
                    _.tryF(onEnd,[id]);
                    onEnd=null;
                },id);
            }else
                _.tryF(onEnd,[id]);
        }
    }
});

/*serialize/unserialize
*/
new function(){
    /*serialize
    */
    var M ={
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    },
    H={'$window$':'window','$this$':'this'},
    A=/[\x00-\x1f\x7f-\x9f\\\"]/g,
    B=/[^\x00-\xff]/g,
    C=/^\s*\x7b/, // /^\s*\{/
    R=function(n){return n<10?'0'+n:n},
    F='function',
    N='number',
    L='boolean',
    S='string',
    O='object',
    T={}
    ;
    T[L]=function(x){return String(x)};
    T[N]=function(x){return isFinite(x) ? String(x) : 'null'};
    T[S]=function(x){
        return H[x] ||
            '"' +
            (
            A.test(x)
            ?
            x.replace(A, function(a,b) {
                if(b=M[a])return b;
                b=a.charCodeAt();
                return '\\u00' + Math.floor(b / 16).toString(16) + (b % 16).toString(16);
            })
            :
            B.test(x)
            ?
            x.replace(B, function(a,b) {
                if(b=M[a])return b;
                b=a.charCodeAt();
                return '\\u' + Math.floor(b / 16).toString(16) + (b % 16).toString(16);
            })
            :
            x
            )
            + '"'
    };
    T[O]=function(x){
        var me=arguments.callee, map = me.map || (me.map={prototype:1,constructor:1,toString:1,valueOf:1});
        if (x){
            var a=[], b=[], c=x.constructor, f, i, l, v;
            //for ie alien
            if((typeof x==O || typeof x==F) && typeof c != F)
                return "$alien";
            else if(c==Array){
                a[0] = '[';
                l = x.length;
                for(i=0;i<l;++i)
                    if(f=T[typeof (v=x[i])])
                        if(typeof (v=f(v))==S)
                            b[b.length]=v;

                a[2]=']';
            }else if(c==Date){
                return '"'+ x.getUTCFullYear() + '-' +
                    R(x.getUTCMonth() + 1) + '-' +
                     R(x.getUTCDate()) + 'T' +
                     R(x.getUTCHours()) + ':' +
                     R(x.getUTCMinutes()) + ':' +
                     R(x.getUTCSeconds()) + 'Z"';
            }else{
                if(typeof x.beforeSerialized == F)
                    x = x.beforeSerialized();
                a[0] = '{';
                for(i in x)
                    if(!map[i])
                        if (f=T[typeof (v=x[i])])
                            if (typeof (v=f(v))==S)
                                b[b.length] = T.string(i) + ':' + v;
                a[2]='}';
            }
            a[1]=b.join(',');
            return a[0]+a[1]+a[2];
        }
        return 'null'
    };
    T[F]=function(x){return x.$path?x.$path:String(x)};

    /*serialize object to string
    bool/string/number/array/hash/simple function
    */
    _.serialize = function (o, b, f){
        return ((f=T[b?O:typeof o]) && f(o))||'';
    };
    /*unserialize string to object
    */
    _.unserialize = function(t){
        try{
            return eval(C.test(t) ? '('+t+')' : t);
        }catch(e){
            return false;
        }
    };
};

Class('linb.iProfile',null,{
    Instance:{
        links:function(o,id,target,lid){
            var self=this;
            target = target||self;
            //double link
            o[lid||self.$id]=target;
            if(o instanceof Array)o.push(target);
            //keep antilink
            self._links[id]=o;
            return self;
        },
        antiLinks:function(id){
            var self=this,o;
            if(!self._links)return;
            if(!(o=self._links[id]))return;
            //remove from target
            if(o instanceof Array)o.removeValue(o[self.$id]);
            delete o[self.$id];
            //remove from self
            delete self._links[id];
            return self;
        },
        antiAllLinks:function(){
            var self=this, id=self.$id,l=self._links,o,i;
            for(i in l){
                o=l[i];
                if(o instanceof Array)o.removeValue(o[id]);
                delete o[id];
            }
            return self;
        }
    },
    Static:{
        $i:true,
        getFromCacheId:function(id){
            return linb._object[id];
        }
    }
});
/*26 based id, replace 36based one, for: some number id can crash opera9
*/
_.id=function(){
    var self=this, me=arguments.callee;
    if(self.constructor!==me || self.a)
        return (me._ || (me._= new me)).next();
    self.a=[-1];
    self.b=[''];
    self.value='';
};
_.id.prototype = {
    constructor:_.id,
    _chars  :"abcdefghijklmnopqrstuvwxyz".split(''),
    next : function(i){
        with(this){
            var m,k,l,i = (i||i===0)?i:b.length-1;
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
};/* event
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
        if(tid)src._tid=tid;

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
            false === self._handleFocusHook(self.getSrc(e), obj=obj[obj.length-1]))
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
        _reg:/([\.\w]+)(-[\.\w]+)?(:[\.\w]+:)([\.\w]*)/,
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
            if(src===document)return true;
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
});Class('linb.template','linb.iProfile',{
    Constructor:function(parent,template,events,properties,domId){
        var self=this;
        self.$domId = self.KEY + ':' + (self.serialId=self.pickSerialId()) + ':';
        self.domId = typeof domId == 'string'?domId:self.$domId;
        self._links={};
        self.template={'':[['<div></div>'],[]]};
        self.properties={};
        self.events={};
        self.$id=_.id();
        self.links(self.constructor._cache,'self').links(linb._object,'linb');
        self.box=self.constructor;
        linb.cache.dom[self.domId]=linb.cache.dom[self.$domId]=this;

        if(template)self.setTemplate(template);
        if(events)self.setEvents(events);
        if(properties)self.setProperties(properties);
        if(parent)self.renderTo(parent);
        return self;
    },
    Instance : {
        $gc:function(){
            //no detach event here. so, don't add event using addEventlis...
            //use innerHTML way only
            //template has no memory leak, ignore it when window.unload
            this.destroy();
        },
        setDomId:function(id){
            var t=this,c=linb.cache.dom,e;
            if(t.domId!=t.$domId)
                delete c[t.domId];
            if(e=document.getElementById(t.domId))
                e.id=id;
            c[t.domId=id]=t;
            return t;
        },
        getDomId:function(){
            return this.domId;
        },
        destroy:function(){
            var self=this,
                t=linb.cache.domId;
            if(self.root){
                var me=this.constructor, c=me.c||(me.c=document.createElement('div'));
                c.appendChild(self.root);
                self.root=null;
                c.innerHTML='';
            }

            (t[self.KEY] || (t[self.KEY]=[])).push(self.serialId);
            delete linb.cache.dom[self.domId];
            delete linb.cache.dom[self.$domId];
            self.antiAllLinks();
            self.template=self.properties=self.events=null;
        },
        empty:function(){
            this.root.innerHTML='';
        },
        getDomNode:function(){
            return this.root || (this.root=document.getElementById(this.domId));
        },
        setEvents:function(key,value){
            var self=this;
            if(typeof key == 'object')
                self.events=key;
            else
                self.events[key]=value;
            return self;
        },
        toString:function(){
            return this.build(this.properties);
        },
        _buildTpl:function(str){
            if(typeof str=='string'){
                var me=arguments.callee,
                reg = me.reg || (me.reg=/([^{}]*)\{([\w]+)\}([^{}]*)/g),
                obj=[[],[]],
                a0=obj[0],
                a1=obj[1]
                ;
                str.replace(reg,function(a,b,c,d){
                    if(b)a0[a0.length]=b;
                    a1[a0.length]=a0[a0.length]=c;
                    if(d)a0[a0.length]=d;
                    return '';
                });
                return obj;
            }else
                return str;
        },
        setTemplate:function(key,value){
            var self=this, t=self.template,f=self._buildTpl,h;
            if(typeof key == 'object'){
                h={};
                for(var i in key)
                    h[i]=f(key[i]);
                self.template=h;
            }else if(typeof value == 'string')
                t[key]=f(value);
            else
                t['']=f(key);
            return self;
        },
        setProperties:function(properties){
            this.properties=properties;
            return this;
        },
        pickSerialId:function(){
            //get id from cache or id
            var arr = linb.cache.domId[this.KEY];
            if(arr && arr[0])return arr.shift();
            return this.constructor._ctrlId.next();
        },
        render:function(){
            var self=this,
                str = self.toString(),
                o;
            if(o=self.getDomNode()){
                var b,r = (b=o.previousSibling)?o.previousSibling:o.parentNode;
                if(linb.browser.gek){
                    o.id='';
                    var range = o.ownerDocument.createRange();
                    range.setStartBefore(o);
                    o.parentNode.replaceChild(range.createContextualFragment(str), o);
                }else
                    o.outerHTML=str;
                if(r)
                    self.root = b?r.nextSibling:r.firstChild;
            }else{
                var me=this.constructor, c=me.c||(me.c=document.createElement('div'));
                c.innerHTML = str;
                self.root = c.removeChild(c.firstChild);
            }
            return self.root;
        },
        renderTo:function(node){
            if(typeof node=='string')node=document.getElementById(node);
            node.appendChild(this.render());
        },
        getEV:function(id, name, src){
            var evs = this.events,
                evkey = src.getAttribute('evkey'),
                evg = evkey&&evs&&evs[evkey]||evs,
                ev = evg&&evg[name];
            return typeof ev=='function'?[ev]:[];
        },
        build:function(properties, tag, result){
            if(!properties)return '';

            var self=this, me=arguments.callee,s,t,n,isA = properties.constructor == Array,
            r1=me.r1||(me.r1=/\[\$e\]/g),
            r2=me.r2||(me.r2=/(^\s*<\w+)(\s|>)(.*)/),
            template = self.template,
            temp = template[tag||''],
            r = !result;

            result= result || [];
            if(isA){
                if(typeof temp != 'function')temp = me;
                for(var i=0;t=properties[i++];){
                    //add hash link,
                    properties[t.id]=t;
                    temp.call(self, t, tag, result);
                }
            }else{
                if(typeof temp == 'function')
                    temp.call(self, properties, tag, result);
                else{
                    tag = tag?tag+'.':'';
                    var a0=temp[0], a1=temp[1];
                    for(var i=0,l=a0.length;i<l;i++){
                        if(n=a1[i]){
                            if(n in properties){
                                t=properties[n];
                                //if sub template exists
                                if(template[s=tag+n])
                                    me.call(self, t, s, result);
                                else
                                    result[result.length]=t;
                            }
                        }else
                            result[result.length]=a0[i];
                    }
                }
            }
            if(r){
                return result.join('')
                    .replace(r1,  'return linb.event(arguments[0],this,0,\'' + self.domId +'\')')
                    .replace(r2, '$1 id="'+self.domId+'" $2$3');
            }
        }
    },
    Static : {
        showTips:function(pro,node,pos){
            var id=node.getAttribute('evid'),
                key=node.getAttribute('evkey');
            if(!id)return false;
            var p=pro.properties,
                h=key?p[key]:p,
                item=h[id];
            linb.UI.Tips.show(pos, item);
            return true;
        },
        _cache:[],
        _ctrlId : new _.id()
    }
});Class('linb.date',null,{
    Initialize:function(){
        var self=this;
        self._mapKeys(self.TIMEUNIT);
        var a=self._key1,b=self._key2,u=self.UNIT={};
        for(var i=0,l=a.length;i<l;i++)u[a[i]]=1;
        for(var i=0,l=b.length;i<l;i++)u[b[i]]=1;
        u.w=1;
    },
    Static:{
        _key1:'MILLISECOND,SECOND,MINUTE,HOUR,DAY,WEEK,MONTH,QUARTER,YEAR,DECADE,CENTURY'.split(','),
        _key2:'ms,s,n,h,d,ww,m,q,y,de,c'.split(','),

        // Conversion factors
        TIMEUNIT : {
            MILLISECOND : 1,
            SECOND      : 1000,           //SECONDS
            MINUTE      : 60000,          //MINUTES 60 * 1000
            HOUR        : 3600000,        //HOURS 60 * 60 * 1000
            DAY         : 86400000,       //DAYS 24 * 60 * 60 * 1000
            WEEK        : 604800000,      //WEEKS 7 * 24 * 60 * 60 * 1000
            MONTH       : 2592000000,     //MONTHS 30 * 24 * 60 * 60 * 1000  (approx = 1 month)
            QUARTER     : 7776000000,     //QUARTERS 90 * 24 * 60 * 60 * 1000  (approx = 3 months)
            YEAR        : 31557600000,    //YEARS 365 * 24 * 60 * 60 * 1000 (approx = 1 year)
            DECADE      : 315576000000,   //DECADES 10 * 365 * 24 * 60 * 60 * 1000 (approx = 1 decade)
            CENTURY     : 3155760000000   //CENTURIES 100 * 365 * 24 * 60 * 60 * 1000 (approx = 1 century)
        },
        TEXTFORMAT:{
            utciso:function(d,f){f=linb.date.fix; return d.getUTCFullYear() + '-' +f(d.getUTCMonth() + 1) + '-' +f(d.getUTCDate()) + 'T' +f(d.getUTCHours()) + ':' +f(d.getUTCMinutes()) + ':' +f(d.getUTCSeconds()) + 'Z'},
            iso:function(d,f){f=linb.date.fix; return d.getFullYear() + '-' +f(d.getMonth() + 1) + '-' +f(d.getDate()) + 'T' +f(d.getHours()) + ':' +f(d.getMinutes()) + ':' +f(d.getSeconds())},
            ms:function(d){return linb.date.fix(d.getMinutes(),3)+ linb.wrapRes('date.MS')},
            s:function(d){return linb.date.fix(d.getSeconds())+ linb.wrapRes('date.S')},
            n:function(d){return linb.date.fix(d.getMinutes())+ linb.wrapRes('date.N')},
            h :function(d){return linb.date.fix(d.getHours())+ linb.wrapRes('date.H')},
            d:function(d){return d.getDate()+ linb.wrapRes('date.D')},
            w : function(d,firstDayOfWeek){return linb.wrapRes('date.WEEKS.'+(d.getDay() - firstDayOfWeek +7)%7 )},
            ww : function(d,firstDayOfWeek){return linb.date.getWeek(d, firstDayOfWeek) + linb.wrapRes('date.W')},
            m:function(d){return (d.getMonth()+1) + linb.wrapRes('date.M')},
            q : function(d){return (parseInt((d.getMonth()+3)/3-1) + 1) + linb.wrapRes('date.Q')},
            y :function(d){return d.getFullYear() + linb.wrapRes('date.Y')},
            de:function(d){return parseInt(d.getFullYear()/10) + linb.wrapRes('date.DE')},
            c:function(d){return parseInt(d.getFullYear()/100) + linb.wrapRes('date.C')},

            hn:function(d){return linb.wrapRes('date.HN-'+d.getHours()+"-"+d.getMinutes())},
            dhn:function(d){return linb.wrapRes('date.DHN-'+d.getDate()+"-"+d.getHours()+"-"+d.getMinutes())},
            mdhn:function(d){return linb.wrapRes('date.MDHN-'+(d.getMonth()+1)+"-"+d.getDate()+"-"+d.getHours()+"-"+d.getMinutes())},
            hns:function(d){return linb.wrapRes('date.HNS-'+d.getHours()+"-"+d.getMinutes()+"-"+d.getSeconds())},
            hnsms:function(d){return linb.wrapRes('date.HNSMS-'+d.getHours()+"-"+d.getMinutes()+"-"+d.getSeconds()+"-"+d.getMinutes())},

            yq:function(d){return linb.wrapRes('date.YQ-'+d.getFullYear()+"-"+(parseInt((d.getMonth()+3)/3-1)+1))},

            ym :   function(d){return linb.wrapRes('date.YM-'+d.getFullYear()+"-"+(d.getMonth()+1))},
            md :  function(d){return linb.wrapRes('date.MD-'+(d.getMonth()+1)+"-"+d.getDate())},
            ymd :  function(d){return linb.wrapRes('date.YMD-'+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate())},
            ymdh:  function(d){return linb.wrapRes('date.YMDH-'+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+"-"+d.getHours())},
            ymdhn: function(d){return linb.wrapRes('date.YMDHN-'+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+"-"+d.getHours()+"-"+d.getMinutes())},
            ymdhns:function(d){return linb.wrapRes('date.YMDHNS-'+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+"-"+d.getHours()+"-"+d.getMinutes()+"-"+d.getSeconds())},
            'all' :  function(d){return linb.wrapRes('date.ALL-'+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+"-"+d.getHours()+"-"+d.getMinutes()+"-"+d.getSeconds()+"-"+d.getMilliseconds())}
        },
        TIMEZONE:[{
            id:"Asia(East,North)",
            sub:[{
                    id:"Brunei",
                    v:"+0800"
                },{
                    id:"Burma",
                    v:"+0630"
                },{
                    id:"Cambodia",
                    v:"+0700"
                },{
                    id:"China",
                    v:"+0800"
                },{
                    id:"China(HK,Macau)",
                    v:"+0800"
                },{
                    id:"China(TaiWan)",
                    v:"+0800"
                },{
                    id:"China(Urumchi)",
                    v:"+0700"
                },{
                    id:"East Timor",
                    v:"+0800"
                },{
                    id:"Indonesia",
                    v:"+0700"
                },{
                    id:"Japan",
                    v:"+0900"
                },{
                    id:"Kazakhstan(Aqtau)",
                    v:"+0400"
                },{
                    id:"Kazakhstan(Aqtobe)",
                    v:"+0500"
                },{
                    id:"Kazakhstan(Astana)",
                    v:"+0600"
                },{
                    id:"Kirghizia",
                    v:"+0500"
                },{
                    id:"Korea",
                    v:"+0900"
                },{
                    id:"Laos",
                    v:"+0700"
                },{
                    id:"Malaysia",
                    v:"+0800"
                },{
                    id:"Mongolia",
                    v:"+0800",
                    tag:"03L03|09L03"
                },{
                    id:"Philippines",
                    v:"+0800"
                },{
                    id:"Russia(Anadyr)",
                    v:"+1300",
                    tag:"03L03|10L03"
                },{
                    id:"Russia(Kamchatka)",
                    v:"+1200",
                    tag:"03L03|10L03"
                },{
                    id:"Russia(Magadan)",
                    v:"+1100",
                    tag:"03L03|10L03"
                },{
                    id:"Russia(Vladivostok)",
                    v:"+1000",
                    tag:"03L03|10L03"
                },{
                    id:"Russia(Yakutsk)",
                    v:"+0900",
                    tag:"03L03|10L03"
                },{
                    id:"Singapore",
                    v:"+0800"
                },{
                    id:"Thailand",
                    v:"+0700"
                },{
                    id:"Vietnam",
                    v:"+0700"
                }]
            },{
                id:"Asia(South,West)",
                sub:[{
                    id:"Afghanistan",
                    v:"+0430"
                },{
                    id:"Arab Emirates",
                    v:"+0400"
                },{
                    id:"Bahrain",
                    v:"+0300"
                },{
                    id:"Bangladesh",
                    v:"+0600"
                },{
                    id:"Bhutan",
                    v:"+0600"
                },{
                    id:"Cyprus",
                    v:"+0200"
                },{
                    id:"Georgia",
                    v:"+0500"
                },{
                    id:"India",
                    v:"+0530"
                },{
                    id:"Iran",
                    v:"+0330",
                    tag:"04 13|10 13"
                },{
                    id:"Iraq",
                    v:"+0300",
                    tag:"04 13|10 13"
                },{
                    id:"Israel",
                    v:"+0200",
                    tag:"04F53|09F53"
                },{
                    id:"Jordan",
                    v:"+0200"
                },{
                    id:"Kuwait",
                    v:"+0300"
                },{
                    id:"Lebanon",
                    v:"+0200",
                    tag:"03L03|10L03"
                },{
                    id:"Maldives",
                    v:"+0500"
                },{
                    id:"Nepal",
                    v:"+0545"
                },{
                    id:"Oman",
                    v:"+0400"
                },{
                    id:"Pakistan",
                    v:"+0500"
                },{
                    id:"Palestine",
                    v:"+0200"
                },{
                    id:"Qatar",
                    v:"+0300"
                },{
                    id:"Saudi Arabia",
                    v:"+0300"
                },{
                    id:"Sri Lanka",
                    v:"+0600"
                },{
                    id:"Syria",
                    v:"+0200",
                    tag:"04 13|10 13"
                },{
                    id:"Tajikistan",
                    v:"+0500"
                },{
                    id:"Turkey",
                    v:"+0200"
                },{
                    id:"Turkmenistan",
                    v:"+0500"
                },{
                    id:"Uzbekistan",
                    v:"+0500"
                },{
                    id:"Yemen",
                    v:"+0300"
                }]
            },{
                id:"North Europe",
                sub:[{
                    id:"Denmark",
                    v:"+0100",
                    tag:"04F03|10L03"
                },{
                    id:"Faroe Is.(DK)",
                    v:"+0100"
                },{
                    id:"Finland",
                    v:"+0200",
                    tag:"03L01|10L01"
                },{
                    id:"Iceland",
                    v:"+0000"
                },{
                    id:"Jan Mayen(Norway)",
                    v:"-0100"
                },{
                    id:"Norwegian",
                    v:"+0100"
                },{
                    id:"Svalbard(NORWAY)",
                    v:"+0100"
                },{
                    id:"Sweden",
                    v:"+0100",
                    tag:"03L01|10L01"
                }]
            },{
                id:"Eastern Europe",
                sub:[{
                    id:"Armenia",
                    v:"+0400"
                },{
                    id:"Austria",
                    v:"+0100",
                    tag:"03L01|10L01"
                },{
                    id:"Azerbaijan",
                    v:"+0400"
                },{
                    id:"Belarus",
                    v:"+0200",
                    tag:"03L03|10L03"
                },{
                    id:"Czech",
                    v:"+0100"
                },{
                    id:"Estonia",
                    v:"+0200"
                },{
                    id:"Georgia",
                    v:"+0500"
                },{
                    id:"Germany",
                    v:"+0100",
                    tag:"03L01|10L01"
                },{
                    id:"Hungarian",
                    v:"+0100"
                },{
                    id:"Latvia",
                    v:"+0200"
                },{
                    id:"Liechtenstein",
                    v:"+0100"
                },{
                    id:"Lithuania",
                    v:"+0200"
                },{
                    id:"Moldova",
                    v:"+0200"
                },{
                    id:"Poland",
                    v:"+0100"
                },{
                    id:"Rumania",
                    v:"+0200"
                },{
                    id:"Russia(Moscow)",
                    v:"+0300",
                    tag:"03L03|10L03"
                },{
                    id:"Slovakia",
                    v:"+0100"
                },{
                    id:"Switzerland",
                    v:"+0100",
                    tag:"03L01|10L01"
                },{
                    id:"Ukraine",
                    v:"+0200"
                },{
                    id:"Ukraine(Simferopol)",
                    v:"+0300"
                }]
            },{
                id:"Western Europe",
                sub:[{
                    id:"Andorra",
                    v:"+0100",
                    tag:"03L01|10L01"
                },{
                    id:"Belgium",
                    v:"+0100",
                    tag:"03L01|10L01"
                },{
                    id:"Channel Is.(UK)",
                    v:"+0000",
                    tag:"03L01|10L01"
                },{
                    id:"France",
                    v:"+0100",
                    tag:"03L01|10L01"
                },{
                    id:"Gibraltar(UK)",
                    v:"+0100",
                    tag:"03L01|10L01"
                },{
                    id:"Ireland",
                    v:"+0000",
                    tag:"03L01|10L01"
                },{
                    id:"Isle of Man(UK)",
                    v:"+0000",
                    tag:"03L01|10L01"
                },{
                    id:"Luxembourg",
                    v:"+0100",
                    tag:"03L01|10L01"
                },{
                    id:"Monaco",
                    v:"+0100"
                },{
                    id:"Netherlands",
                    v:"+0100",
                    tag:"03L01|10L01"
                },{
                    id:"United Kingdom",
                    v:"+0000",
                    tag:"03L01|10L01"
                }]
            },{
                id:"South Europe",
                sub:[{
                    id:"Albania",
                    v:"+0100"
                },{
                    id:"Bosnia",
                    v:"+0100"
                },{
                    id:"Bulgaria",
                    v:"+0200"
                },{
                    id:"Croatia",
                    v:"+0100"
                },{
                    id:"Greece",
                    v:"+0200",
                    tag:"03L01|10L01"
                },{
                    id:"Holy See",
                    v:"+0100"
                },{
                    id:"Italy",
                    v:"+0100",
                    tag:"03L01|10L01"
                },{
                    id:"Macedonia",
                    v:"+0100"
                },{
                    id:"Malta",
                    v:"+0100"
                },{
                    id:"Montenegro",
                    v:"+0100"
                },{
                    id:"Portugal",
                    v:"+0000",
                    tag:"03L01|10L01"
                },{
                    id:"San Marino",
                    v:"+0100"
                },{
                    id:"Serbia",
                    v:"+0100"
                },{
                    id:"Slovenia",
                    v:"+0100"
                },{
                    id:"Span",
                    v:"+0100",
                    tag:"03L01|10L01"
                }]
            },{
                id:"North America",
                sub:[{
                    id:"Canada(AST)",
                    v:"-0400",
                    tag:"04F02|10L02"
                },{
                    id:"Canada(CST)",
                    v:"-0600",
                    tag:"04F02|10L02"
                },{
                    id:"Canada(EST)",
                    v:"-0500",
                    tag:"04F02|10L02"
                },{
                    id:"Canada(MST)",
                    v:"-0700",
                    tag:"04F02|10L02"
                },{
                    id:"Canada(NST)",
                    v:"-0330",
                    tag:"04F02|10L02"
                },{
                    id:"Canada(PST)",
                    v:"-0800",
                    tag:"04F02|10L02"
                },{
                    id:"Greenland(DK)",
                    v:"-0300"
                },{
                    id:"US(Central)",
                    v:"-0600",
                    tag:"03S02|11F02"
                },{
                    id:"US(Eastern)",
                    v:"-0500",
                    tag:"03S02|11F02"
                },{
                    id:"US(Mountain)",
                    v:"-0700",
                    tag:"03S02|11F02"
                },{
                    id:"US(Pacific)",
                    v:"-0800",
                    tag:"03S02|11F02"
                },{
                    id:"US(Alaska)",
                    v:"-0900"
                },{
                    id:"US(Arizona)",
                    v:"-0700"
                }]
            },{
                id:"South America",
                sub:[{
                    id:"Anguilla(UK)",
                    v:"-0400"
                },{
                    id:"Antigua&amp;Barbuda",
                    v:"-0400"
                },{
                    id:"Antilles(NL)",
                    v:"-0400"
                },{
                    id:"Argentina",
                    v:"-0300"
                },{
                    id:"Aruba(NL)",
                    v:"-0400"
                },{
                    id:"Bahamas",
                    v:"-0500"
                },{
                    id:"Barbados",
                    v:"-0400"
                },{
                    id:"Belize",
                    v:"-0600"
                },{
                    id:"Bolivia",
                    v:"-0400"
                },{
                    id:"Brazil(AST)",
                    v:"-0500",
                    tag:"10F03|02L03"
                },{
                    id:"Brazil(EST)",
                    v:"-0300",
                    tag:"10F03|02L03"
                },{
                    id:"Brazil(FST)",
                    v:"-0200",
                    tag:"10F03|02L03"
                },{
                    id:"Brazil(WST)",
                    v:"-0400",
                    tag:"10F03|02L03"
                },{
                    id:"British Virgin Is.(UK)",
                    v:"-0400"
                },{
                    id:"Cayman Is.(UK)",
                    v:"-0500"
                },{
                    id:"Chilean",
                    v:"-0300",
                    tag:"10F03|03F03"
                },{
                    id:"Chilean(Hanga Roa)",
                    v:"-0500",
                    tag:"10F03|03F03"
                },{
                    id:"Colombia",
                    v:"-0500"
                },{
                    id:"Costa Rica",
                    v:"-0600"
                },{
                    id:"Cuba",
                    v:"-0500",
                    tag:"04 13|10L03"
                },{
                    id:"Dominican",
                    v:"-0400"
                },{
                    id:"Ecuador",
                    v:"-0500"
                },{
                    id:"El Salvador",
                    v:"-0600"
                },{
                    id:"Falklands",
                    v:"-0300",
                    tag:"09F03|04F03"
                },{
                    id:"Grenada",
                    v:"-0400"
                },{
                    id:"Guadeloupe(FR)",
                    v:"-0400"
                },{
                    id:"Guatemala",
                    v:"-0600"
                },{
                    id:"Guiana(FR)",
                    v:"-0300"
                },{
                    id:"Guyana",
                    v:"-0400"
                },{
                    id:"Haiti",
                    v:"-0500"
                },{
                    id:"Honduras",
                    v:"-0600"
                },{
                    id:"Jamaica",
                    v:"-0500"
                },{
                    id:"Martinique(FR)",
                    v:"-0400"
                },{
                    id:"Mexico(Mazatlan)",
                    v:"-0700"
                },{
                    id:"Mexico(Tijuana)",
                    v:"-0800"
                },{
                    id:"Mexico(Mexico)",
                    v:"-0600"
                },{
                    id:"Montserrat(UK)",
                    v:"-0400"
                },{
                    id:"Nicaragua",
                    v:"-0500"
                },{
                    id:"Panama",
                    v:"-0500"
                },{
                    id:"Paraguay",
                    v:"-0400",
                    tag:"10F03|02L03"
                },{
                    id:"Peru",
                    v:"-0500"
                },{
                    id:"Puerto Rico(US)",
                    v:"-0400"
                },{
                    id:"So. Georgia&amp;So. Sandwich Is.(UK)",
                    v:"-0200"
                },{
                    id:"St. Kitts&amp;Nevis",
                    v:"-0400"
                },{
                    id:"St. Lucia",
                    v:"-0400"
                },{
                    id:"St. Vincent&amp;Grenadines",
                    v:"-0400"
                },{
                    id:"Suriname",
                    v:"-0300"
                },{
                    id:"Trinidad&amp;Tobago",
                    v:"-0400"
                },{
                    id:"Turks&amp;Caicos Is.(UK)",
                    v:"-0500"
                },{
                    id:"Uruguay",
                    v:"-0300"
                },{
                    id:"Venezuela",
                    v:"-0400"
                },{
                    id:"Virgin Is.(US)",
                    v:"-0400"
                }]
            },{
                id:"Africa(North)",
                sub:[{
                    id:"Algeria",
                    v:"+0100"
                },{
                    id:"Egypt",
                    v:"+0200",
                    tag:"04L53|09L43"
                },{
                    id:"Libyan",
                    v:"+0200"
                },{
                    id:"Morocco",
                    v:"+0000"
                },{
                    id:"Sudan",
                    v:"+0200"
                },{
                    id:"Tunisia",
                    v:"+0100"
                }]
            },{
                id:"Africa(Western)",
                sub:[{
                    id:"Benin",
                    v:"+0100"
                },{
                    id:"Burkina Faso",
                    v:"+0000"
                },{
                    id:"Canary Is.(SP)",
                    v:"-0100"
                },{
                    id:"Cape Verde",
                    v:"-0100"
                },{
                    id:"Chad",
                    v:"+0100"
                },{
                    id:"Gambia",
                    v:"+0000"
                },{
                    id:"Ghana",
                    v:"+0000"
                },{
                    id:"Guinea",
                    v:"+0000"
                },{
                    id:"Guinea-Bissau",
                    v:"+0000"
                },{
                    id:"Ivory Coast",
                    v:"+0000"
                },{
                    id:"Liberia",
                    v:"+0000"
                },{
                    id:"Mali",
                    v:"+0000"
                },{
                    id:"Mauritania",
                    v:"+0000"
                },{
                    id:"Niger",
                    v:"+0100"
                },{
                    id:"Nigeria",
                    v:"+0100"
                },{
                    id:"Senegal",
                    v:"+0000"
                },{
                    id:"Sierra Leone",
                    v:"+0000"
                },{
                    id:"Togo",
                    v:"+0000"
                },{
                    id:"Western Sahara",
                    v:"+0000"
                }]
            },{
                id:"Africa(Central)",
                sub:[{
                    id:"Cameroon",
                    v:"+0100"
                },{
                    id:"Cen.African Rep.",
                    v:"+0100"
                },{
                    id:"Congo,Democratic",
                    v:"+0100"
                },{
                    id:"Congo,Republic",
                    v:"+0100"
                },{
                    id:"Equatorial Guinea",
                    v:"+0100"
                },{
                    id:"Gabon",
                    v:"+0100"
                },{
                    id:"Sao Tome&amp;Principe",
                    v:"+0000"
                }]
            },{
                id:"Africa(East)",
                sub:[{
                    id:"Burundi",
                    v:"+0200"
                },{
                    id:"Comoros",
                    v:"+0300"
                },{
                    id:"Djibouti",
                    v:"+0300"
                },{
                    id:"Eritrea",
                    v:"+0300"
                },{
                    id:"Ethiopia",
                    v:"+0300"
                },{
                    id:"Kenya",
                    v:"+0300"
                },{
                    id:"Madagascar",
                    v:"+0300"
                },{
                    id:"Malawi",
                    v:"+0200"
                },{
                    id:"Mauritius",
                    v:"+0400"
                },{
                    id:"Mayotte(FR)",
                    v:"+0300"
                },{
                    id:"Mozambique",
                    v:"+0200"
                },{
                    id:"Reunion(FR)",
                    v:"+0400"
                },{
                    id:"Rwanda",
                    v:"+0200"
                },{
                    id:"Seychelles",
                    v:"+0300"
                },{
                    id:"Somalia",
                    v:"+0300"
                },{
                    id:"Tanzania",
                    v:"+0300"
                },{
                    id:"Uganda",
                    v:"+0300"
                }]
            },{
                id:"Africa(South)",
                sub:[{
                    id:"Angola",
                    v:"+0100"
                },{
                    id:"Botswana",
                    v:"+0200"
                },{
                    id:"Lesotho",
                    v:"+0200"
                },{
                    id:"Namibia",
                    v:"+0200",
                    tag:"09F03|04F03"
                },{
                    id:"Saint Helena(UK)",
                    v:"-0100"
                },{
                    id:"South Africa",
                    v:"+0200"
                },{
                    id:"Swaziland",
                    v:"+0200"
                },{
                    id:"Zambia",
                    v:"+0200"
                },{
                    id:"Zimbabwe",
                    v:"+0200"
                }]
            },{
                id:"Oceania",
                sub:[{
                    id:"American Samoa(US)",
                    v:"-1100"
                },{
                    id:"Australia(Adelaide)",
                    v:"+0930",
                    sub:"10L03|03L03"
                },{
                    id:"Australia(Brisbane)",
                    v:"+1000"
                },{
                    id:"Australia(Darwin)",
                    v:"+0930"
                },{
                    id:"Australia(Hobart)",
                    v:"+1000",
                    sub:"10L03|03L03"
                },{
                    id:"Australia(Perth)",
                    v:"+0800"
                },{
                    id:"Australia(Sydney)",
                    v:"+1000",
                    sub:"10L03|03L03"
                },{
                    id:"Cook Islands(NZ)",
                    v:"-1000"
                },{
                    id:"Eniwetok",
                    v:"-1200"
                },{
                    id:"Fiji",
                    v:"+1200",
                    sub:"11F03|02L03"
                },{
                    id:"Guam",
                    v:"+1000"
                },{
                    id:"Hawaii(US)",
                    v:"-1000"
                },{
                    id:"Kiribati",
                    v:"+1100"
                },{
                    id:"Marshall Is.",
                    v:"+1200"
                },{
                    id:"Micronesia",
                    v:"+1000"
                },{
                    id:"Midway Is.(US)",
                    v:"-1100"
                },{
                    id:"Nauru Rep.",
                    v:"+1200"
                },{
                    id:"New Calednia(FR)",
                    v:"+1100"
                },{
                    id:"New Zealand",
                    v:"+1200",
                    sub:"10F03|04F63"
                },{
                    id:"New Zealand(CHADT)",
                    v:"+1245",
                    sub:"10F03|04F63"
                },{
                    id:"Niue(NZ)",
                    v:"-1100"
                },{
                    id:"Nor. Mariana Is.",
                    v:"+1000"
                },{
                    id:"Palau",
                    v:"+0900"
                },{
                    id:"Papua New Guinea",
                    v:"+1000"
                },{
                    id:"Pitcairn Is.(UK)",
                    v:"-0830"
                },{
                    id:"Polynesia(FR)",
                    v:"-1000"
                },{
                    id:"Solomon Is.",
                    v:"+1100"
                },{
                    id:"Tahiti",
                    v:"-1000"
                },{
                    id:"Tokelau(NZ)",
                    v:"-1100"
                },{
                    id:"Tonga",
                    v:"+1300",
                    tag:"10F63|04F63"
                },{
                    id:"Tuvalu",
                    v:"+1200"
                },{
                    id:"Vanuatu",
                    v:"+1100"
                },{
                    id:"Western Samoa",
                    v:"-1100"
                },{
                    id:"Data Line",
                    v:"-1200"
                }]
            }
        ],
        //map like: MILLISECOND <=> ms
        _mapKeys:function(obj){
            var self=this, t=self._key2, m=self._key1;
            for(var i=0,l=m.length;i<l;i++)
                obj[t[i]]=obj[m[i]];
        },
        //get valid unit
        _validUnit:function(unit){
            return this.UNIT[unit]?unit:'d';
        },
        _isDate:function(target)  {return !!target && target.constructor == Date},
        _date:function(value,df){return this._isDate(value)?value:this._isDate(df)?df:new Date},
        _isNumb:function(target)  {return typeof target == 'number' && isFinite(target)},
        _numb:function(value,df){return this._isNumb(value)?value:this._isNumb(df)?df:0},
        //time Zone like: -8
        _timeZone:-((new Date).getTimezoneOffset()/60),
        //sun
        firstDayOfWeek:0,

        /*get specific date unit
        *
        */
        get:function(date, unit, firstDayOfWeek){
            var self=this;
            date = self._date(date);
            unit = self._validUnit(unit);
            firstDayOfWeek = self._numb(firstDayOfWeek ,self.firstDayOfWeek );

            var map = arguments.callee.map || ( arguments.callee.map = {
                    ms:function(d){return d.getMilliseconds()},
                    s:function(d){return d.getSeconds()},
                    n:function(d){return d.getMinutes()},
                    h :function(d){return d.getHours()},
                    d:function(d){return d.getDate()},
                    ww:function(d,fd){return linb.date.getWeek(d, fd)},
                    w :function(d,fd){return (7+d.getDay()-fd)%7},
                    m:function(d){return d.getMonth()},
                    q:function(d){return parseInt((d.getMonth()+3)/3-1)},
                    y :function(d){return d.getFullYear()},
                    de:function(d){return parseInt(d.getFullYear()/10)},
                    c:function(d){return parseInt(d.getFullYear()/100)}
                });
            return map[unit](date,firstDayOfWeek);
        },
        /*
        * fix(1,3,'0') => '100'
        */
        fix:function(s,l,c){
            l=l||2;
            c=c||'0';
            s=String(s);
            if(s.length<l)
                for(var i=s.length;i<l;i++)
                    s=c+s;
            return s;
        },
        /*add specific unit to date
        *
        */
        add: function(date, unit, count ){
            var self=this,
                tu=self.TIMEUNIT,
                map,
                date2;
            date = self._date(date);
            unit = self._validUnit(unit);


            if(!(map=arguments.callee.map)){
                map=arguments.callee.map = {
                    MILLISECOND:function(date,count){date.setTime(date.getTime() + count*tu.ms)},
                    SECOND:function(date,count){date.setTime(date.getTime() + count*tu.s)},
                    MINUTE:function(date,count){date.setTime(date.getTime() + count*tu.n)},
                    HOUR:function(date,count){date.setTime(date.getTime() + count*tu.h)},
                    DAY:function(date,count){date.setTime(date.getTime() + count*tu.d)},
                    WEEK:function(date,count){date.setTime(date.getTime() + count*tu.ww)},
                    MONTH:function(date,count){
                        var a=date.getDate(),b;
                        count = date.getMonth() + count;
                        this.YEAR(date, Math.floor(count/12));
                        date.setMonth((count%12+12)%12);
                        if((b=date.getDate())!=a)
                            this.DAY(date, -b)
                    },
                    QUARTER:function(date,count){this.MONTH(date,count*3)},
                    YEAR:function(date,count){
                        var a=date.getDate(),b;
                        date.setFullYear(date.getFullYear() + count)
                        if((b=date.getDate())!=a)
                            this.DAY(date, -b)
                    },
                    DECADE:function(date,count){this.YEAR(date,10*count)},
                    CENTURY:function(date,count){this.YEAR(date,100*count)}
                };
                self._mapKeys(map);
            }
            map[unit](date2=new Date(date), count);
            return date2;
        },
        /*get specific unit diff between d1 and d2
        *
        */
        diff:function(d1, d2, unit, firstDayOfWeek) {
            var self=this;
            d1 = self._date(d1);
            d2 = self._date(d2);
            unit = self._validUnit(unit);
            firstDayOfWeek = self._numb(firstDayOfWeek ,self.firstDayOfWeek );

            var tu=self.TIMEUNIT,
                map;

            if(!(map=arguments.callee.map)){
                map = arguments.callee.map = {
                    MILLISECOND:function(date1,date2){return date2.getTime()-date1.getTime()},
                    SECOND:function(date1,date2){
                        var d1 = self.getRoundDown(date1,'s'),
                            d2 = self.getRoundDown(date2,'s'),
                            t=d2.getTime()-d1.getTime();
                        return t/tu.s;
                    },
                    MINUTE:function(date1,date2){
                        var d1 = self.getRoundDown(date1,'n'),
                            d2 = self.getRoundDown(date2,'n'),
                            t=d2.getTime()-d1.getTime();
                        return t/tu.n;
                    },
                    HOUR:function(date1,date2){
                        var d1 = self.getRoundDown(date1,'h'),
                            d2 = self.getRoundDown(date2,'h'),
                            t=d2.getTime()-d1.getTime();
                        return t/tu.h;
                    },
                    DAY:function(date1,date2){
                        var d1 = self.getRoundDown(date1,'d',1),
                            d2 = self.getRoundDown(date2,'d',1),
                            t=d2.getTime()-d1.getTime();
                        return t/tu.d;
                    },
                    WEEK:function(date1,date2,firstDayOfWeek){
                        var d1 = self.getRoundDown(date1,'ww',1,firstDayOfWeek),
                            d2 = self.getRoundDown(date2,'ww',1,firstDayOfWeek),
                            t=d2.getTime()-d1.getTime();
                        return t/tu.ww;
                    },
                    MONTH:function(date1,date2){return (date2.getFullYear()-date1.getFullYear())*12 + (date2.getMonth()-date1.getMonth())},
                    QUARTER:function(date1,date2){return (date2.getFullYear()-date1.getFullYear())*4 + parseInt((date2.getMonth()-date1.getMonth())/3)},
                    YEAR:function(date1,date2){return parseInt((date2.getFullYear()-date1.getFullYear()))},
                    DECADE:function(date1,date2){return parseInt((date2.getFullYear()-date1.getFullYear())/10)},
                    CENTURY:function(date1,date2){return parseInt((date2.getFullYear()-date1.getFullYear())/100)}
                };
                self._mapKeys(map);
            }
            return map[unit](new Date(d1),new Date(d2),firstDayOfWeek);
        },
        /*get the first unit begin of certain unit
        *
        */
        getRoundDown: function(date, unit, count, firstDayOfWeek) {
            var self=this,
                tu=self.TIMEUNIT,
                map,date2;
            date = self._date(date);
            unit = self._validUnit(unit);
            firstDayOfWeek = self._numb(firstDayOfWeek ,self.firstDayOfWeek );
            count=self._numb(count,1);
            if(!(map=arguments.callee.map)){
                var clearInDay = function(d) {
                        d.setMilliseconds(0);
                        d.setSeconds(0);
                        d.setMinutes(0);
                        d.setHours(0);
                    },
                    clearInYear = function(d) {
                        clearInDay(d);
                        d.setDate(1);
                        d.setMonth(0);
                    };

                map = arguments.callee.map = {
                    MILLISECOND:function(date,count){
                        var x = date.getMilliseconds();
                        date.setMilliseconds(x - (x % count));
                    },
                    SECOND:function(date,count){
                        date.setMilliseconds(0);
                        var x = date.getSeconds();
                        date.setSeconds(x - (x % count));
                    },
                    MINUTE:function(date,count){
                        date.setMilliseconds(0);
                        date.setSeconds(0);
                        var x = date.getMinutes();
                        date.setTime(date.getTime() - (x % count) * tu.n);
                    },
                    HOUR:function(date,count){
                        date.setMilliseconds(0);
                        date.setSeconds(0);
                        date.setMinutes(0);

                        var x = date.getHours();
                        date.setHours(x - (x % count));
                    },
                    DAY:function(date,count){
                        clearInDay(date);
                        var x=date.getDate();
                        date.setDate(x - (x % count));
                    },
                    WEEK:function(date,count,firstDayOfWeek){
                        clearInDay(date);

                        var d = (date.getDay() + 7 - firstDayOfWeek) % 7,d2,x
                            a=new Date();
                        date.setTime(date.getTime() - d * tu.d);
                        clearInYear(a);
                        a.setFullYear(date.getFullYear());
                        d2 = (a.getDay() + 7 - firstDayOfWeek) % 7;
                        a.setTime(a.getTime() - d2 * tu.d);

                        x= (date.getTime()-a.getTime())/tu.d/7;

                        date.setTime(date.getTime() - (x % count) * tu.ww);
                    },
                    MONTH:function(date,count){
                        clearInDay(date);
                        date.setDate(1);
                        var x = date.getMonth();
                        date.setMonth(x - (x % count));
                    },
                    QUARTER:function(date,count){
                        count=self._numb(count,1);
                        return this.MONTH(date, count*3);
                    },
                    YEAR:function(date,count){
                        clearInYear(date);
                        var x = date.getFullYear();
                        date.setFullYear(x - (x % count));
                    },
                    DECADE:function(date,count){
                        clearInYear(date);
                        date.setFullYear(Math.floor(date.getFullYear() / 10) * 10);
                    },
                    CENTURY:function(date,count){
                        clearInYear(date);
                        date.setFullYear(Math.floor(date.getFullYear() / 100) * 100);
                    }
                };
                self._mapKeys(map);

            }
            map[unit](date2=new Date(date),count, firstDayOfWeek);
            return date2;
        },
        /*get the last unit begin of certain unit
        *
        */
        getRoundUp : function(date, unit, count,firstDayOfWeek) {
            var self=this;

            date = self._date(date);
            unit = self._validUnit(unit);
            firstDayOfWeek = self._numb(firstDayOfWeek ,self.firstDayOfWeek );

            count=self._numb(count,1);

            var originalTime = date.getTime(),
                date2 = self.getRoundDown(date, unit, count, firstDayOfWeek);
            if (date2.getTime() < originalTime)
                date2=self.add(date2, unit, count);
            return date2;
        },
        /*get specific timezone(fake) date from local date format
        *flag==true, unpack
        */
        _pack:function(date, timeZone, flag){
            var self=this;
            date=self._date(date);
            return new Date(date.getTime() + (flag?-1:1)*(timeZone - self._timeZone)*self.TIMEUNIT.h);
        },
        /*fake date for a certain timezone (based on the current timezone of "Date object")
        */
        packTimeZone:function(date, timeZone){
            return this._pack(date, timeZone);
        },
        /*return to real date from packTimezone
        */
        unpackTimeZone:function(date, timeZone){
            return this._pack(date,timeZone,true);
        },
        /*get week
        *
        */
        getWeek:function(date, firstDayOfWeek){
            var self=this, date2;
            date=self._date(date);
            firstDayOfWeek = self._numb(firstDayOfWeek ,self.firstDayOfWeek ),
            y=date.getFullYear();

            date = self.add(self.getRoundDown(date, 'ww', 1, firstDayOfWeek),'d',6);

            if(date.getFullYear()!=y)return 1;

            date2 = self.getRoundDown(date, 'y', 1);
            date2 = self.add(self.getRoundDown(date2, 'ww', 1, firstDayOfWeek),'d',6);

            return self.diff(date2, date, 'ww')+1;
        },
        getDayInYear:function(date){
            var self=this;
            date=self._date(date);
            var date2 = self.getRoundDown(date, 'y', 1);
            return self.diff(date2, date, 'd')+1;
        },
        parse:function(s){
            s=String(s);
            var self=this,utc,
                me=arguments.callee,
                dp=me.dp||(me.dp={
                  FullYear: 2,
                  Month: 4,
                  Date: 6,
                  Hours: 8,
                  Minutes: 10,
                  Seconds: 12,
                  Milliseconds: 14
                }),
                match = s.match(me.iso||(me.iso=/^((-\d+|\d{4,})(-(\d{2})(-(\d{2}))?)?)?T((\d{2})(:(\d{2})(:(\d{2})(\.(\d{1,3})(\d)?\d*)?)?)?)?(([+-])(\d{2})(:(\d{2}))?|Z)?$/)),
                date = new Date(0)
                ;
            if(match){
                //month
                if(match[4])match[4]--;
                //ms to 3 digits
                if (match[15]>=5)match[14]++;
                utc = match[16]||match[18]?"UTC":"";
                for (var i in dp) {
                    var v = match[dp[i]];
                    if(!v)continue;
                    date["set" + utc + i](v);
                    if (date["get" + utc + i]() != match[dp[i]])
                        return null;
                }
                if(match[18]){
                    var h = Number(match[17] + match[18]),
                        m = Number(match[17] + (match[20] || 0));
                    date.setUTCMinutes(date.getUTCMinutes() + (h * 60) + m);
                }
                return date;
            }else{
                var r=Date.parse(s);
                return r?date.setTime(r) && date:null;
            }
        },
        getText:function(date, unit, firstDayOfWeek){
            var self=this;
            date = self._date(date);
            firstDayOfWeek = self._numb(firstDayOfWeek ,self.firstDayOfWeek );
            unit=unit||'';
            return self.TEXTFORMAT[unit](date, firstDayOfWeek);
        }
    }
});/* css
*  dependency: base _ ; Class ; linb ;
*
*
*/
Class("linb.css", null,{
    Static:{
        _r:linb.browser.ie?'rules':'cssRules',
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
            if(id && (id=id.replace(/[^\w-$:]/g,'_')) && (e=ns.exists('id',id)))
                return e;
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
        include:function(href, id, before, hash){
            var e, ns=this, head = ns.getHead();
            if(href && (e=ns.exists('href',href)))
                return e;
            e = document.createElement('link');
            e.type = 'text/css';
            e.rel = 'stylesheet';
            e.href = href;
            if(id)
                e.id=id;
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
            e=ns.include(href,null,false,hash);
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
            return this.updateRules(s);
        },
        //selector: single css exp without ','; not allow '.a, .b{}'
        //  for *** IE *** allow single css exp only
        /*
        *in IE: don't use multi css exp for skin
        */
        //css:  
        //  !!false     =>  remove all related style
        //  hashtable   =>  update style value
        updateRules:function(selector, value, force){
            var ns=this,
                add=true,
                ds=document.styleSheets,
                target, target2, selectorText, bak, h, e, t, _t;
            selector = selector.replace(/\s+/g,' ').trim();
            bak=selector.toLowerCase();
            _.toArr(ds).each(function(o){
                _.toArr(o[ns._r]).each(function(v,i){
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
                                o.insertRule(_t+"{" + t + "}", o[ns._r].length);
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
                    o.insertRule(ns._build(selector,value), o[ns._r].length);
                    o.disabled=true;
                    o.disabled=false;                  
                    return false;
                }
            },null,true);
            //need to add
            if(force && add)
                ns.addRules(selector,value);
            return ns;
        },
        addRules:function(selector,value){
            var ns=this,
                target=ns._getLast(),
                changed=target.sheet || target.styleSheet;
            if(changed.insertRule)
                changed.insertRule(ns._build(selector,value), changed[ns._r].length);
            else if(changed.addRule )
                changed.addRule(selector, ns._build(selector,value,true));
            target.disabled=true;
            target.disabled=false;
            return ns;
        }
    }
});new function(){
    /* power _
    */
    _.merge(_,{
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
        /*convert iterator to Array
        value: something can be iteratorred
        _.toArr({a:1},true) => [a];
        _.toArr({a:1},false) => [1];
        */
        toArr:function(value, flag){
            if(!value)return [];
            var arr=[];
            //hash
            if(flag!==undefined)
                for(var i in value)
                    arr[arr.length]=flag?i:value[i];
            //other like arguments
            else{
                for(var i=0,l=value.length; i<l; ++i)
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
    /* environment object
    */
    _.merge(_,{
        // type detection
        exists:function(target)  {return target!==undefined},
        isNull:function(target)  {return (typeof target == 'object') && !target },
        isObj:function(target)   {return !!target  && (typeof target == 'object' || typeof target == 'function')},
        isBool:function(target)  {return typeof target == 'boolean'},
        isNumb:function(target)  {return typeof target == 'number' && isFinite(target)},
        isDate:function(target)  {return !!target && target.constructor == Date},
        isFun:function(target)   {return typeof target == "function" && target.constructor != RegExp},
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
        str:function(value,df){return _.isStr(value)?value:_.isStr(df)?df:''}
    },'all');

    /*
    *
    *Power function, array , and string
    *
    */
    /*
    * for function
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
            var p=linb.dom.getMatix().html(this, false).get(0),t,r=[],i;
            //get nodes
            for(var i=0,t=p.childNodes,l=t.length;i<l;i++)r[r.length]=t[i];
            //clear
            if(flag!==false){
                if(linb.browser.ie)
                    while(t=p.firstChild)p.removeChild(t);
                else
                    p.innerHTML='';
            }
            return linb(r);
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
            var self=this, i, l=self.length;
            target = target||self;
            if(!order){
                for(i=0; i<l; i++)
                    if(fun.call(target, self[i], i, self)===false)
                        break;
            }else
                for(i=l-1; i>=0; i--)
                    if(fun.call(target, self[i], i, self)===false)
                        break;
            return self;
        },
        indexOf:function(value) {
            for(var i=0, l=this.length; i<l; i++)
                if(this[i] === value)
                    return i;
            return -1;
        },
        subIndexOf:function(sub,value){
            if(value===undefined)return -1;
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
         [1,2].insertAny(3)
            will return [1,2,3]
         [1,2].insertAny(3,0)
            will return [3,1,2]
         [1,2].insertAny([3,4])
            will return [1,2,3,4]
         [1,2].insertAny([3,4],3,true)
            will return [1,2,[3,4]]
        */
        insertAny:function (arr, index, flag) {
            var self=this,a,l=self.length;
            index = index===0?0:(index||l);
            if(index<0 || index>l)index=l;
            a=self.splice(index,l-index);
            if(arr.constructor!=Array || flag)
                self[self.length]=arr;
            else
                self.push.apply(self, arr);

            self.push.apply(self, a);
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
            var self=this,i,l;
            if(flag!==false){
                var copy=[];
                for(i=0, l=self.length; i<l; i++)copy[copy.length]=self[i];
                for(i=0, l=arr.length; i<l; i++)
                    if(copy.indexOf(arr[i])==-1)
                        self[self.length]=arr[i];
                copy.length=0;
            }else{
                for(i=0, l=self.length; i<l; i++)
                    if(arr.indexOf(self[i])>-1)
                        self.splice(i, 1);
            }
            return self;
        },
    /*        swap:function(a,b){
            var self=this, t = self[a];
            self[a] = self[b];
            self[b] =t;
            return self;
        },
    */
        removeFrom:function(index,length){
            this.splice(index, length || 1);
            return this;
        },
        clean:function(){
            var self=this,i,l,a=self.copy();self.length=0;
            for(i=0, l=a.length; i<l; i++)
                if(self.indexOf(a[i])==-1)
                    self[self.length]=a[i];
           return self;
        },
        removeValue:function(value){
            var self=this;
            for(var l=self.length,i=l-1; i>=0; i--)
                if(self[i]===value)
                    self.splice(i,1);
            return self;
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
            var self=this,i,l,arr=[],o;
            for(i=0, l=self.length; i<l; i++)arr[arr.length]=self[i];
            self.length=0;
            for(i=0, l=arr.length; i<l; i++)
                if(fun.call(target||arr,arr[i],i,arr)!==false)
                    self[self.length]=arr[i];
            return self;
        }
    },'all');
    Array.prototype.boxing = Array.prototype.reBoxing = function(key,flag){
        var t=linb.iBox.$type[key];
        if(t)return new (linb.SC(t))(this, flag);
    };
};

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
/***
        set:function(value,index){
            var self=this;
            if(_.isNumb(index))
                self._nodes[index] = value;
            else
                self._nodes = value;
            return self;
        },
***/
        create:function(){
            return this;
        },
        length:function(){
            return this._nodes.length;
        },
        each:function(fun){
            var self=this;
            for(var i=0,j=self._nodes,l=j.length;i<l;i++)
                if(false===fun.call(self,j[i],i))
                    break;
            return self;
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
        //flag is ture => minus
        add:function(e, flag){
            var self=this, arr = self.constructor.clean(e);
            self._nodes.merge(arr, flag);
            return self;
        },
        minus:function(e){
            return this.add(e, false);
        },
        unBoxing:function(){
            return this.get();
        },
        //flag: true => clean input array
        reBoxing:function(key,flag){
            var self=this, t=linb.iBox.$type[key||'dom'];
            if(t==self.KEY)return self;
            if(t=linb.SC(t))return t.pack(self._nodes, flag);
        }
    },
    Static:{
        $i:true,
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
            var arr,o, t,me=arguments.callee,r1=me.r1||(me.r1=/^\s*<((\n|\r|.)*?)>\s*$/);
            if(tag.constructor==Array){
                arr=[];
                tag.each(function(v,i){
                    arr.insertAny(me.apply(null,v instanceof Array?v:[v])._nodes,-1);
                });
                return arr;
            }
            if(typeof tag == 'string'){
                // text node
                if(id===true)
                    o = linb([document.createTextNode(tag)]);
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
    },
    Initialize:function(){
        /*
        * power linb
        */
        /* set shortcut to linb.iBox.create
        */
        linb.create=function(){return linb.iBox.create.apply(linb.iBox, arguments)};
    }
});


Class('linb.DomProfile', 'linb.iProfile', {
    Instance:{
        $gc:function(){
            var self=this,t;
            if(self.addition&&(t=self.domNode))
                _.each(self.addition,function(o,i){
                    t[i]=null;
                });
            linb.cache.dom[self.id]=null;
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

/*linb.dom
    linb(window)
    linb(document)
    linb("id")
    linb(["id1","id2","id3"...])
    linb(linb(...))
    linb(node)
    linb([node,node,node,...])
    linb(fun):fun will reutun dom node array
*/
Class('linb.dom','linb.iBox',{
    Instance:{
        //keep id cache in linb.cache.dom
        //if widgets, value is serial id.
        id:function(value,flag){
            var t,me=arguments.callee,cache=linb.cache.dom,f=me.f||(me.f=function(o, value,flag){
                if(!flag)
                    if(t = cache[o.id]){
                        cache[value] = t;
                        delete cache[o.id];
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
                if(r)arr.insertAny(r);
            });
            return linb(arr);
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
        dig('div','id');
        dig('div','id','a');
        dig('div','id',/^a/);
        */
        dig:function(tag, attr, exp){
            tag = tag||'*';
            var f='getElementsByTagName',
                me=arguments.callee, f1=me.f1||(me.f1=function(tag, attr, exp){
                var all = this[f](tag), arr=[];
                if(exp.test(this[attr]))
                    arr[arr.length]=this;
                for(var o,i=0; o=all[i]; i++)
                    if(exp.test(o[attr]))
                        arr[arr.length]=o;
                return arr;
            }),f2=me.f2||(me.f2=function(tag, attr, exp){
                var all = this[f](tag), arr=[];
                if(this[attr]==exp)
                    arr[arr.length]=this;
                for(var o,i=0; o=all[i]; i++)
                    if(o[attr]==exp)
                        arr[arr.length]=o;
                return arr;
            }),f3=me.f3||(me.f3=function(tag, attr, exp){
                var all = this[f](tag), arr=[];
                if(this[attr])
                    arr[arr.length]=this;
                for(var o,i=0; o=all[i]; i++)
                    if(o[attr])
                        arr[arr.length]=o;
                return arr;
            }),f4=me.f4||(me.f4=function(tag){
                return _.toArr(this[f](tag));
            }),f5=me.f5||(me.f5=function(tag, attr){
                var all = this[f](tag), arr=[];
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
        addFirst:function(target){
            return this.$add(function(target){
                var self=this;
                if(self.firstChild!=target){
                    if(self.firstChild)
                        self.insertBefore(target, self.firstChild);
                    else
                        self.appendChild(target);
                }
            },target);
        },
        addLast:function(target){
            return this.$add(function(target){
                if(this.lastChild!=target)
                    this.appendChild(target);
            },target);
        },
        addPre:function(target){
            return this.$add(function(target){
                if(this.previousSibling!=target)
                    this.parentNode.insertBefore(target,this);
            },target);
        },
        addNext:function(target){
            var t;
            return this.$add(function(target){
                var self=this;
                if((t=self.nextSibling)!=target){
                    if(t)
                        self.parentNode.insertBefore(target, t);
                    else
                        self.parentNode.appendChild(target);
                }
            },target);
        },
/***
        addToFirst:function(target){
            linb(target).addFirst(this);
            return this;
        },
        addToLast:function(target){
            linb(target).addLast(this);
            return this;
        },
        addToPre:function(target){
            linb(target).addPre(this);
            return this;
        },
        addToNext:function(target){
            linb(target).addNext(this);
            return this;
        },
        //str must include "{*}"
        wrap:function(str){
            var s;
            return this.each(function(o,i){
                o=linb([o]);
                o.outerHTML(str.replace('{*}', o.outerHTML()),false);
            });
        },
***/
        //add to last, and trigger Triggers
        attach:function(target, force){
            var o=this.get(0), ui, t, d, b, k;
            if(target['linb.Profile'])target=target.boxing();
            if(_.isArr(target))target=linb.iBox.pack(target, false);
            if(!target['linb.iBox'])target=target.boxing();

            //ensure to dom first
            ui = target.create();

            //add dom node
            target.each(function(v){
                d=v.domNode || v;
                if(d.style.visibility!='hidden'){
                    b=true;
                    k=d.style.visibility;
                    d.style.visibility='hidden';
                }
                //always add to last
                if(force || d.parentNode!=o)
                    o.appendChild(d);

                if(t=v.renderedTrigger)
                    for(var i=0,l=t.length;i<l;i++)
                        t[i].call(v);
                if(b)
                    d.style.visibility=k;
            });
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
                r=linb([v]);
                if(target instanceof Array)
                    for(var i=1,l=target.length; i<l; i++)
                        r.addNext(target[i]);

            }
            return r;
        },
        swap:function(target){
            var self=this;
            target=linb(target);
            var t = linb.dom.getMatix().html('*',false);
            self.replace(t,false);
            target.replace(self,false);
            t.replace(target,false);
            linb([document.body]).addFirst(t.empty(false));
            return self;
        },
        //flag : false => remove from dom tree, not free memory
        remove:function(flag){
            var me=arguments.callee,c=me.c||(me.c=document.createElement('div'));
            if(flag===false)
                this.each(function(o,i){
                    if(o.parentNode)o.parentNode.removeChild(o);
                });
            else{
                this.each(function(o){
                    c.appendChild(o);
                });
                c.innerHTML='';
                _.resetRun('dom.$gc', linb.dom.$gc, 300);
            }
            return this;
        },
        //set innerHTML empty
        //flag = false: no gc
        empty:function(flag){
            return this.each(function(o){
                linb([o]).html('',flag);
            });
        },
        //call $gc dir
        gc:function(){
            linb.dom.$gc();
            return this;
        },
        //flag = false: no gc
        html:function(str,flag){
            var s='',t,bak,o=this.get(0);flag=flag!==false;
            if(str!==undefined){
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
        outerHTML:function(str){
            var self=this, t,s='', o=self.get(0),id=o.id;
            if(str!==undefined){
                //clear ehandler
                if(o.addition&&(t=o.domNode))
                    _.each(o.addition,function(o,i){
                        t[i]=null;
                    });


                if(linb.browser.gek){
                    var n=self.replace(str.toDom(),false);
                    self._nodes[0]=n.get(0);
                }else{
                    var b,r = (b=o.previousSibling)?o.previousSibling:o.parentNode;
                    o.outerHTML=str;
                    if(r)
                        self._nodes[0] = b?r.nextSibling:r.firstChild;
                }

                //avoid inner nodes memory leak
                linb([o]).remove();
                return self;
            }else{
                if(linb.browser.gek){
                    var dom=linb.dom, m = dom.getMatix(), n = dom.getMatix(2), np=n.parent(), p;
                    //has parentNode, need keep node in this way
                    if(p=o.parentNode)self.replace(n, false);
                    //set to box
                    m.addLast(o);
                    //get string
                    s = m.html();
                    //set back
                    if(p)n.replace(o, false);
                    m.empty();
                    np.addFirst(n);
                    return s;
                }else
                    return o.outerHTML;
            }
        },
        text:function(str){
            var s='';
            if(str!==undefined)
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
            var self=this, t, me = arguments.callee, map = me.map || (me.map = {
                'class':'className',
                className:'className',
                'for':'htmlFor',
                value: "value",
                disabled: "disabled",
                checked: "checked",
                selected:'selected',
                readonly: "readOnly"
            });
            if(( t = (typeof key != 'string') )|| value !==undefined){
                if(!t){
                     t={};t[key]=value;key=t;
                }
                _.each(key,function(value,key){
                  if(value===null)
                      self.each(function(o){
                          if(map[key])
                            o[map[key]]=null;
                          else if(o.removeAttribute)
                             o.removeAttribute(key);
                          else
                            o[key]=null;
                      });
                  else
                    self.each(function(o){
                        if(map[key])
                            o[map[key]]=value;
                        else{
                            if(o.setAttribute)o.setAttribute(key,value);
                            //try{
                            o[key]=value
                            //}catch(e){}
                        }
                    });

                });
                return self;
            }else{
                var o=self.get(0);
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
                            linb([o]).opacity(key[i]);
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
            if(value !==undefined){
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
        //left,top format: "23px"
        show:function(left,top){
            var style,t,auto='auto',v=linb.dom.hide_value;
            return this.each(function(o){
                if(o.nodeType != 1)return;
                style=o.style;
                if( t = (top || (style.top==v && (o._top || auto))))style.top = t;
                if( t = (left || (style.left==v && (o._left || auto))))style.left = t;
                if(t=o._position)if(style.position!=t)style.position=t;
                if(style.visibility!='visible')style.visibility='visible';
                //ie6 bug
                if(linb.browser.ie6){
                    t=style.wordWrap=='normal';
                    _.asyRun(function(){
                        style.wordWrap=t?'break-word':'normal'
                    })
                }
            });
        },
        hide:function(){
            var style,t;
            return this.each(function(o){
                if(o.nodeType != 1)return;
                style=o.style;t=linb([o]);
                o._position = style.position;
                o._top = style.top;
                o._left = style.left;
                if(style.position!='absolute')style.position = 'absolute';
                style.top = style.left = linb.dom.hide_value;
            });
        },
        setRegion:function(hash,flag,force) {
            var self=this, i,t,m,  node=self._nodes[0], dom=linb.dom, f=dom.setPxStyle,
                m={};

            for(var j=0,c=dom.boxArr;i=c[j++];)
                m[i] = ((i in hash) && hash[i]!==null)?f(node,i,hash[i]):false;

            if(flag){
                if(force)m.width=m.height=m.left=m.top=true;
                if(dom.hasHandler(node,'onrewh') && (m.width||m.height))self.onRewh(true, {width:m.width,height:m.height});
                if((dom.hasHandler(node,'onlocation') && m.left||m.top))self.onLocation(true, {left:m.left,top:m.top});
            }
            return self;
        },
        //for quick size
        cssSize:function(size,flag) {
            var self=this, node=self._nodes[0],dom=linb.dom,f=dom.setPxStyle,b1,b2;
           if(size){
                var t;
                b1 = size.width!==null?f(node,'width',size.width):false;
                b2 = size.height!==null?f(node,'height',size.height):false;
                if(flag && (b1||b2) && dom.hasHandler(node,'onrewh'))self.onRewh(true, {width:b1,height:b2});
                return self;
            }else
                return { width :self.W(node,1)||0,  height :self.H(node,1)};
        },
        //for quick move
        cssPos:function(pos, flag){
            var node=this._nodes[0],dom=linb.dom,f=dom.setPxStyle,b1,b2;
            if(pos){
                var t;
                b1 = pos.left!=null?f(node,'left',pos.left):false;
                b2 = pos.top!==null?f(node,'top',pos.top):false;
                if(flag && (b1||b2) && dom.hasHandler(node,'onlocation'))this.onLocation(true, {left:b1,top:b2});
                return this;
            }else{
                f=dom.getStyle;
                return {left :parseInt(f(node, 'left'))||0,  top :parseInt(f(node, 'top'))||0};
            }
        },

        getRegion:function(flag, parent){
            var self=this, pos = flag?self.absPos(null,parent):self.cssPos(),size = self.cssSize();
            return {
                left:pos.left,
                top:pos.top,
                width:size.width,
                height:size.height
            };
        },
/***
        toAbsolute:function(){
            var t,pos;
            return this.each(function(o){
                if((t=linb([o])) &&t.position() != 'absolute'){
                    pos = t.absPos();
                    t
                    .position('absolute')
                    .absPos(pos);
                }
            });
        },
***/
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
            browser = linb.browser,
            ns=this,
            node = ns.get(0),
            keepNode=node,
            parent =node.parentNode,
            op=node.offsetParent,
            doc=node.ownerDocument,
            dd=doc.documentElement,
            db=doc.body,
            _d=/^inline|table.*$/i,
            getStyle=linb.dom.getStyle,
            fixed = getStyle(node, "position") == "fixed",

            me=arguments.callee,
            add= me.add || (me.add=function(pos, l, t){
                pos.left += parseInt(l,10)||0;
                pos.top += parseInt(t,10)||0;
            }),
            border=me.border || ( me.border = function(node, pos){
                add(pos, getStyle(node,'borderLeftWidth'), getStyle(node,'borderTopWidth'));
            }),
            TTAG=me.TTAG||(me.TTAG={TABLE:1,TD:1,TH:1}),
            HTAG = me.HTAG ||(me.HTAG={BODY:1,HTML:1}),
            posDiff=me.posDiff ||(me.posDiff=function(o,target){
                var cssPos = o.cssPos(),absPos = o.absPos(null,target);
                return {left :absPos.left-cssPos.left, top :absPos.top-cssPos.top};
            });

            target=target?linb(target).get(0):doc;

            if(pos){
                //all null, return dir
                if(pos.left===null&&pos.top===null)return ns;
                var d = posDiff(ns,target);
                ns.cssPos({left :pos.left===null?null:(pos.left - d.left),  top :pos.top===null?null:(pos.top - d.top)});
                r=ns;
            }else{
                //for IE, firefox3(except document.body)
                if(!(linb.browser.gek && node==document.body) && node.getBoundingClientRect){
                    t = node.getBoundingClientRect();
                    pos = {left :t.left, top :t.top};
                    if(target.nodeType==1)
                        add(pos, -(t=target.getBoundingClientRect()).left+target.scrollLeft, -t.top+target.scrollTop);
                    else
                        add(pos, Math.max(dd.scrollLeft, db.scrollLeft)-dd.clientLeft, Math.max(dd.scrollTop,  db.scrollTop)-dd.clientTop);
                }else{
                    pos = {left :0, top :0};
                    add(pos, node.offsetLeft, node.offsetTop );
                    //get offset, stop by target or target.offsetParent
                    while(op && op!=target && op!=target.offsetParent){
                        add(pos, op.offsetLeft, op.offsetTop);
                        if(browser.kde || (browser.gek && !TTAG[op.tagName]))
                            border(op, pos);
                        if ( !fixed && getStyle(op,"position")== "fixed")
                            fixed = true;
                        if(op.tagName!='BODY')
                            keepNode=op.tagName=='BODY'?keepNode:op;
                        op = op.offsetParent;
                    }

                    //get scroll offset, stop by target
                    while (parent && parent.tagName && parent!=target && !HTAG[parent.tagName]){
                        if(!_d.test(getStyle(parent, "display")) )
                            add(pos, -parent.scrollLeft, -parent.scrollTop );
                        if(browser.gek && getStyle(parent,"overflow")!= "visible" )
                            border(parent,pos);
                        parent = parent.parentNode;
                    }
                    if((browser.gek && getStyle(keepNode,"position")!="absolute"))
                        add(pos, -db.offsetLeft, -db.offsetTop);
                    if(fixed)
                        add(pos, Math.max(dd.scrollLeft, db.scrollLeft), Math.max(dd.scrollTop,  db.scrollTop));
                }
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
            var arr, t, me=arguments.callee,reg=(me.reg||(me.reg=/\s+/));
            return this.each(function(o){
                arr = (t=o.className).split(reg);
                if(!arr.exists(str))
                    o.className = t + " " +str;
            });
        },
        removeClass:function(str){
            var arr, i,l,a, t, bs=typeof str=='string', me=arguments.callee,reg=(me.reg||(me.reg=/\s+/));
            return this.each(function(o){
                arr = o.className.split(reg);
                l=arr.length;
                a=[];
                for(i=0;t=arr[i];i++)
                    if(bs?(t!=str):(!str.test(String(t))))
                        a[a.length]=t;
                if(l!=a.length)o.className=a.join(' ');
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
                o=linb([o]);
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
            var id,
                c,
                event=linb.event,
                type='on'+event._getEventType(name),
                f=event._eventhandler,
                fs=event.eventhandler,
                fi=event.getId,
                dom=linb.cache.dom;

            return this.each(function(o){
                if((window===o||document===o) && type=="onrewh")
                    type='onresize';
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
                if(!(c = dom[id])){
                    c = dom[id] = new linb.DomProfile();
                    c.domNode=o;
                    c.domId=id;
                }
                (c.addition || (c.addition={}))[type]=1;
            });
        },
        removeEventHandler:function(name){
            var type='on'+linb.event._getEventType(name);
            return this.each(function(o){
               if(o[type])o[type]=null;
               if(o.getAttribute && o.getAttribute(type))o.removeAttribute(type);
            });
        },
        clearEventHandler:function(){
            return this.each(function(o){
                linb.event._events.each(function(s){
                   if(o[s="on"+s])o[s]=null;
                   if(o.getAttribute && o.getAttribute(s))o.removeAttribute(s);
                });
            });
        },
        addEvent:function(name, fun, event_id, index, tagVar){
            var self=this,c,t,id,type,fi=linb.event.getId,dom=linb.cache.dom,event=linb.event;
            if(!(name  instanceof Array))
                name=[[name,fun,event_id]];

            name.each(function(o,i){
                name=o[0];fun=o[1];event_id='$'+o[2];
                type=event._getEventType(name);
                if(typeof event_id!='string')
                    event_id="$"+_.id();

                self.addEventHandler(name).each(function(o){
                    id=fi(o);
                    if(!id)id=o.id=_.id();

                    c = dom[id];

                    t = c.events || (c.events = {});
                    c = t[name] || (t[name]=[]);

                    //if no event_id input, clear all, and add a single
                    if(event_id ===undefined){
                        c.length=0;c=t[name]=[];
                        index=-1;
                    }
                    if(tagVar)c.$tagVar=tagVar;
                    c[event_id]=fun;
                    c.removeValue(event_id);
                    c.insertAny(event_id, index);
                });
            });
            return self;
        },
        /*
        removeEvent('onClick','idforthisclick')
        removeEvent('onClick')
            will remove all onClick in linb.cache.dom.id.events.
        removeEvent('onClick',null,true)
            will remove all onClick/beforeClick/afterClick in linb.cache.dom.id.events.
        */
        removeEvent:function(name, event_id, flag){
            var self=this,c,t,k,id,i,type,fi=linb.event.getId,dom=linb.cache.dom,event=linb.event;
            if(!(name instanceof Array))
                name=[[name,event_id]];

            name.each(function(o,i){
                name=o[0];event_id='$'+o[1];
                type=event._getEventType(name);
                self.each(function(o){
                    if(!(id=fi(o)))return;

                    if(!(c=dom[id]))return;
                    if(!(t=c.events))return;
                    if(flag)
                        event._getEventName(type).each(function(o){
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
            });
            return self;
        },
        getEvent:function(name, event_id){
            var id;
            if(!(id=linb.event.getId(this.get(0))))return;

            if(event_id)
                return _.get(linb.cache.dom,[id,'events',name,'$' + event_id]);
            else{
                var r=[],arr = _.get(linb.cache.dom,[id,'events',name]);
                arr.each(function(o,i){
                    r[r.length]=[o,arr[o]];
                });
                return r;
            }
        },

        //clearEvent binded to the current
        clearEvent:function(){
            this.clearEventHandler();
            return this.each(function(o){
                var id,c,t;
                if(!(id=linb.event.getId(o)))return;

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
                    for(var para = [], i=0, l=arguments.length,n; n=arguments[i];i++)
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
        fireEvent:function(name, args){
            var type=linb.event._getEventType(name),
            t,s='on'+type,
            me=arguments.callee,
            f=linb.event._eventhandler,
            f1=me.f1||(me.f1=function(){this.returnValue=false}),
            f2=me.f2||(me.f2=function(){this.cancelBubble=true});

            args= args || {};
            return this.each(function(o){
                //for no standard events, like onDrag
                if(typeof o[s]!='function'){
                    if(!o[s] && !(o.getAttribute && o.getAttribute(s)))
                        return;
                     o[s] = f;
                }

                _.merge(args,{
                    type: type,
                    target: o,
                    button : 1,
                    $e:true,
                    $name:name,
                    preventDefault:f1,
                    stopPropagation:f2
                },'all');

                if('blur'==type || 'focus'==type)
                    //try{
                        o[type].call(o,args);
                    //}catch(e){}
                else
                   o[s].call(o,args);
            });
        },

//functions
        canFocus:function(){
            var me=arguments.callee, map = me.map || (me.map={a:1,input:1,select:1,textarea:1,button:1}),
            node;
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
        selectable:function(v){
            var me=arguments.callee, f = me.f || (me.f=function(){return false});
             return this.each(function(o){
                if(linb.browser.gek)
                    o.style.MozUserSelect=v?"all":"none"
                else{
                    o.unselectable=v?"off":"on";
                    o.onselectstart=v?null:f;
                }                
            })
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
        focus:function(flag){
            if(flag || this.canFocus())
                this.get(0).focus();
            /*
            var o=this.get(0);
            if(!this.length() || !o.focus || o.offsetWidth<=0 || o.offsetHeight<=0)return this;
            try{o.focus()}catch(e){}finally{return this}
            */
        },
        blur:function(){
            if(this.canFocus())
                this.get(0).blur();
        },
        enable:function(value){
            if(value!==undefined)
                this.disabled(!value);
            else
                return !this.disabled();
            return this;
        },
        inlineBlock:function(flag){
            if(flag){
                if(linb.browser.gek)
                    this.display('-moz-inline-block').display('-moz-inline-box').display('inline-block');
                else
                    this.display('inline-block');
            }else
                this.display('');
            return this;
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
            if(i>=linb.dom.top_zIndex)
                linb.dom.top_zIndex =i+1000;

            if(flag)
                 node.style.zIndex = i;
            else{
                j = parseInt(node.style.zIndex) || 0;
                return i>j?i:j;
            }
            return this;
        },
        busy:function(flag){
          var self=this, dom=linb.dom;
          if(dom._busy)return;
          var id=self.id();
          if(dom._cursor[id] ===undefined){
              dom._cursor[id] = _.str(self.cursor());
              //if(!dom.opr)
              self.cursor('wait');
              dom.busy(flag);
          }
          return self;
        },
        free:function(){
          var self=this, dom=linb.dom;
          if(!dom._busy)return;
          var id=self.id();
          if(dom._cursor[id] !==undefined){
              cursor=_.str(dom._cursor[id], 'default');
              //if(!dom.opr)
              self.cursor(cursor);
              delete dom._cursor[id];
          }
          dom.free();
          return self;
        },
        UIAction:function(fun){
          var self = this;
          linb.thread(null,
            [
              function(){self.busy()},
              fun,
              function(){self.free();}
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
            var self=this.get(0),node = this.$iterator('',dir,inn,function(node){return node!==self && linb([node]).canFocus()});
            if(!node.isEmpty() && set!==false)node.focus();
            return node;
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
            type = hash[type]!==undefined?type:'line';

            var self=this, threadid=id||_.id(), delay = time/step, i,j=0, value,
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
        type:1,2,3,4
        */
        popToTop : function(pos, parent, type){
            var region, target = this;
            type = (type || 1).toString();
            parent = linb(parent || document.body);

            //prepare
            target.setStyle({position:'absolute',left:'0', top:'0',visibility:'hidden',display:'block', zIndex:linb.dom.top_zIndex});

            //add to body, avoid parent is display:none.
            parent.attach(target, true);

            if(pos['linb.dom'] || pos.nodeType){
                var node=linb(pos),
                    //base region
                    abspos = node.absPos(null, parent);
                region = {
                    left:abspos.left,
                    top:abspos.top,
                    width:node.offsetWidth(),
                    height:node.offsetHeight()
                };
             }else{
                region = pos.region || {
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
            var w = target.offsetWidth(), h = target.offsetHeight(),
                hi,wi;
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
            return this;
        },
        //for destroy obj when blur
        setBlurTrigger : function(id, trigger, group){
            var ns=this,
                doc=document,
                sid='$blur_triggers$',
                target = group?group:linb(ns.get()),
                fun=linb.dom._blurTrigger||(linb.dom._blurTrigger=function(p,e){
                    var me=arguments.callee,
                        p=linb.event.getPos(e),
                        arr=me.arr,
                        a=arr.copy(),
                        b, pos, w, h;
                    //filter first
                    a.each(function(i){
                        b=true;
                        if(!(v=arr[i].target))b=false;
                        else
                            v.each(function(o){
                                if(!linb.dom.byId(o.id))
                                    return b=false;
                            });
                        if(!b){
                            arr.removeValue(i);
                            delete arr[i];
                        };
                    });
                    a=arr.copy();
                    a.each(function(i){
                        v=arr[i];
                        b=true;
                        v.target.each(function(o){
                            if(o.parentNode && (w=o.offsetWidth) && (h=o.offsetHeight)){
                                pos=linb([o]).absPos();
                                if(p.left>=pos.left && p.top>=pos.top && p.left<=(pos.left+w) && p.top<=(pos.top+h))
                                    return b=false;
                            }
                        });
                        if(b){
                            _.tryF(v.trigger,[],v.target);
                            arr.removeValue(i);
                            delete arr[i];
                        }else
                            //if the top layer popwnd cant be triggerred, prevent the other layer popwnd trigger
                            return false;
                    },null,true);
                    a.length=0;
                }),
                arr=fun.arr||(fun.arr=[]);
            if(!doc.onmousedown)doc.onmousedown=linb.event._eventhandler;

            //remove this trigger
            if(!trigger){
                arr.removeValue(id);
                delete arr[id];
            //double link
            }else
                if(!arr[id]){
                    arr[id]={
                        trigger:trigger,
                        target:target
                    };
                    arr.push(id);
                }
            return this;
        },
        //IE not trigger dimension change, when change height only in overflow=visible.
        ieTrigger : function(flat){
            var self=this;
            _.asyRun(function(){self.setStyle('wordWrap','break-word')});
            _.asyRun(function(){self.setStyle('wordWrap','normal');});
            return this;
        }
    },
    Static:{
        hide_value : '-10000px',
        top_zIndex:10000,

        boxArr:'width,height,left,top,right,bottom'.toArr(),
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
            var i,o,w,cache=linb.cache.dom,bak=[];
            for(i in cache){
                 o=cache[i];
                 if((!o) || (window===o.domNode) || (document===o.domNode))continue;
                 if(!document.getElementById(o.domId)){
                     o.$gc();
                     //clear the cache
                     bak[bak.length]=i;
                     //clear the cache shadow
                     if(o.$domId && o.$domId!=o.domId)
                        bak[bak.length]=o.$domId;
                 }
             }
             for(i=0;i<bak.length;)
                 delete cache[bak[i++]];
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

/***        getElemsByXPath : function(exp, p) {
            var r=[];
            var str = document.evaluate(expression, p || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for(var i=0, length=query.snapshotLength; i < length; i++) r.push(query.snapshotItem(i));
            return r;
        },
***/
        getStyle:function(node, key, flag){
            if(!node.style)return '';

            var value = node.style[key];
            if(!value || flag){
                var me = arguments.callee,t,
                map = me.map || (me.map = {'float':1,'cssFloat':1,'styleFloat':1}),
                cache = me.cache || (me.cache={}),
                key = cache[key] || (cache[key] = key.replace(/\-(\w)/g, function(a,b){return b.toUpperCase()}))
                ;
                if(map[key])
                    key = linb.browser.ie?"styleFloat":"cssFloat";
                //document.defaultView first, for opera 9.0
                value = ((t=document.defaultView) && t.getComputedStyle)?(t=t.getComputedStyle(node,null))?t[key]:'':(node.currentStyle&&node.currentStyle[key]);
/*
                if(linb.browser.opr){
                    var map2 = me.map2 || (me.map2={left:1,top:1,right:1,bottom:1});
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
        isMatix:function(id){return id && id.startWith(this._matixid)},
        getMatix:function(index){
            var i=1,id,o,count=0,me=arguments.callee,m=me.m,doc=document;
            index=index || 1;
            while(1){
                id = this._matixid + i;
                //don't remove this {
                if(o=linb.dom.byId(id)){
                    /*use firstChild for performance*/
                    if(!o.firstChild && ++count == index)
                        return linb([o]);
                }else{
                    if(!m){
                        //no use linb.create,here
                        me.m=m=doc.createElement('div');
                        //m.style.display='none';
                        var style=m.style;
                        style.position='absolute';
                        style.visibility='hidden';
                        style.left=style.top=linb.dom.hide_value;
                    }
                    o=m.cloneNode(false);
                    o.id=id;

                    doc.body.insertBefore(o, doc.body.firstChild);
                    return linb([o]);
                }
                i++;
            }
        },
        //for overwrite
        /*
        arg1:true for show cover, false for hide cover
        arg2:true for show loading img, and this time, if arg1 is string, it will show text under the img
        arg3:true for pre text is kept
        arg4:key for setcover
        */
        setCover:function(arg1,arg2,arg3,arg4){
            // get or create first
            var me=arguments.callee,
            id="linb.temp:cover:",
            id2="linb.temp:message:",
            o1,o2,
            body=linb([document.body]),
            ini=linb.ini;

            if((o1=linb(id)).isEmpty())
                body.addFirst(o1=linb.create('<div id="'+ id +'" style="position:absolute;display:none;left:0;top:0;z-index:0;background-image:url('+ini.path+'bg.gif)">'));
            if((o2=linb(id2)).isEmpty() && arg2)
                body.addFirst(o2=linb.create('<div id="'+id2+'" style="position:absolute;display:none;"><img src="'+ini.path + 'loading.gif" border="0"/><div style="font-size:12px;"></div></div>'));

            //clear
            if(arg1 === false){
                if(typeof arg4=='string')
                    if(typeof me._key =='string' && me._key!=arg4)
                        return;
                if(me.show){
                        o1.setStyle({display:'none',zIndex:'0'});
                        body.cursor("");
                    o2.display('none').last().empty();
                    me.show=false;
                }
            }else{
                if(typeof arg4=='string')me._key=arg4;
                var t = linb([window],false), w=t.scrollWidth(), h=t.scrollHeight();
                if(!me.show){
                    o1.setStyle({ width : w +'px', height : h+'px', display:'block',zIndex:(linb.dom.top_zIndex+200),cursor:'wait'});
                    body.cursor("wait");
                    me.show=true;
                }
                //image and text showed
                if(arg2){
                    var x = t.scrollLeft()+t.width()/2, y = t.scrollTop()+t.height()/2;
                    o2.left(x).top(y).display('block').zIndex(linb.dom.top_zIndex+300);
                    if(typeof arg1=='string')
                        o2.last().get(0).innerHTML = (arg3?o2.html():'') + arg1;
                }
            }
        },

        byId:function(e){
            return  document.getElementById(e);
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
                    arr.insertAny(o);

                if(!(o.nodeType==1 || o.nodeType==9))return;
                arr.insertAny(_.toArr((tag=='*')?o.all?o.all:o.getElementsByTagName("*"):o.getElementsByTagName(tag)));
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
                    if(exp1.length===0 && exp2.length===0)throw new Error(linb.getRes('selector', me[0]));

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
                arr.insertAny(temp);
            });
            return arr;
        },

*/
/*
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
                linb.css.add(str, path)
            },null,null,{asy:false});

            return path;
        },
        maxTabindex:function(){
            var l=0, arr=linb([document.body]).dig('*',function(o){return o.tabIndex>0}).get();
            for(var i=0,o;o=arr[i++];)
                l=l>o.tabIndex?l:o.tabIndex;
            return ++l;
        },
*/

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
            if(!_.isEmpty(data))_t.push('<input type="hidden" name="rnd" value="'+_()+'">');
            var d=('<form target="'+target+'" action="'+action+'" method="'+method  + (enctype?'" enctype="' +enctype:'') +  '">'+_t.join('')+'</form>').toDom();
            linb.dom.getMatix().addLast(d);
            d.get(0).submit();
            d.remove();
        },
        busy:function(flag,key){
            var dom=linb.dom;
            if(flag!==false)
                dom.setCover(true,0,0,key);
            dom._busy=true;
        },
        free:function(key){
           var dom=linb.dom;
           dom.setCover(false,0,0,key);
           dom._busy=false;
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
            node.zIndex(linb.dom.top_zIndex+10);
            return node.fx(args, onStart, function(){
                node.cssSize({ width :0, height :0}).remove(false);
                _.tryF(onEnd);
            }, time, step, type, id);
        }
    },
    After:function(d){
        var self=this;
       //getter
        _.each({ parent:['y',false], pre:['x',false], next:['x',true], first:['y',true], last:['y',1]},function(o,i){
            self.plugIn(i, function(index){
                if(typeof index=='string'){css=index;index=0;}
                if(index===0)
                    return this;
                else
                    return this.$iterator(o[0], o[1], true, index || 1)
            });
        });

        //readonly profile
        'nodeName,nodeType,tagName,offsetLeft,offsetTop,offsetParent,scrollWidth,scrollHeight'.toArr().each(function(o){
            self.plugIn(o,function(value){
                var t=this.get(0),w=window,d=document;
                if(t==w||t==d){
                    if("scrollWidth"==o||"scrollHeight"==o){
                        var a=d.documentElement,b=d.body;
                        return Math.max(a[o], b[o]);
                    }else
                        t = linb.browser.contentBox ? d.documentElement : d.body;
                }
                return t[o];
            })
        });

        var p='padding',m='margin',b='border',c='client',o='offset',r='real',w='width',h='height',W='Width',H='Height',T='Top',L='Left',t='top',l='left',R='Right',B='Bottom';
        //dimesion
        [   [p+'H',p+T,p+B],
            [p+'W',p+L,p+R],
            [b+'H',b+T+W,b+B+W],
            [b+'W',b+L+W,b+R+W],
            [m+'W',m+L,m+R],
            [m+'H',m+T,m+B]
        ].each(function(o){
            //use get Style dir
            var node,fun=linb.dom.getStyle;
            self.plugIn(o[0],function(){
                node = this.get(0);
                return (parseInt(fun(node, o[1])) + parseInt(fun(node, o[2]))) || 0;
            })
        });
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

        [['W',w, p+'W', b+'W', m+'W', c+W, o+W],
        ['H',h, p+'H', b+'H', m+'H', c+H, o+H]].each(function(o){
            self.plugIn(o[0],function(node,index,value){
                var n,r,t,style=node.style,me=arguments.callee,contentBox=linb.browser.contentBox,
                r1=me.r1 || (me.r1=/%$/),
                getStyle=linb.dom.getStyle,
                f=linb.dom.setPxStyle,type=typeof value,t1;
                if(type=='undefined' || type=='boolean'){
                    if(value===true){
                        n=(getStyle(node,'display')=='none');
                        if(n){
                            var temp = linb.dom.getMatix().html('*',false);
                            linb([node]).swap(temp);
                            var b,p,d;
                            b = style.visibility,p = style.position,d = style.display; p=p||'';b=b||'';d=d||'';
                            style.visibility = 'hidden'; style.position ='absolute';style.display = 'block';
                        }
                    }
                    switch(index){
                        case 1:
                            r=getStyle(node,o[1]);
                            if(isNaN(parseInt(r)) || r1.test(r))
                                r = me(node,2) - (contentBox?linb([node])[o[2]]():0);
                            r=parseInt(r)||0;
                            break;
                        case 2:
                            r=node[o[5]];
                            //for ie
                            if(!r)
                                r=node[o[6]]-linb([node])[o[3]]();
                            break;
                        case 3:
                            //for in firefox, offsetHeight/Width's bad performance
                            //if(node._bp)
                            //    r=node['_'+o[6]];
                            //else{
                            //    t1=_();
                                r=node[o[6]];
                            //    if(_()-t1>60){
                            //        node['_'+o[6]]=r;
                            //        node._bp=1;
                            //    }
                            //}
                            if(!r)
                                //get from css setting before css applied
                                r=me(node,1)+(contentBox?(t=linb([node]))[o[2]]():0)+t[o[3]]();
                            break;
                        case 4:
                            r=me(node,3);
                            r+=linb([node])[o[4]]();
                            break;
                    }
                    if(n){
                        style.display = d; style.position = p;style.visibility = b;
                        linb([node]).swap(temp);
                        temp.empty(false);
                    }
                    return parseInt(r)||0;
                }else{
                    switch(index){
                        case 1:
                            if(f(node, o[1], value))
                                if(linb.dom.hasHandler(node,'onrewh')){
                                    var args={};args[o[1]]=1;
                                    linb([node]).onRewh(true, args);
                                }
                            break;
                        case 2:
                            me(node, 1, value - (contentBox?linb([node])[o[2]]():0));
                            break;
                        case 3:
                            //back value for offsetHeight/offsetWidth slowly
                            me(node, 1, value - (t=linb([node]))[o[3]]() - (contentBox?t[o[2]]():0));
                            break;
                        case 4:
                            me(node, 1, value - (t=linb([node]))[o[4]]() - t[o[3]]() - (contentBox?t[o[2]]():0));
                            break;
                    }
                    //if(node._bp)
                    //    node['_'+o[6]]=null;
                }
            })
        });
        [[c+W,'W',2],[o+W,'W',3],[r+W,'W',4],
         [c+H,'H',2],[o+H,'H',3],[r+H,'H',4]].each(function(o){
            self.plugIn(o[0],function(value){
                var type=typeof value;
                if(type=='undefined' || type=='boolean')
                    return this[o[1]](this.get(0), o[2]);
                else
                    return this.each(function(v){
                        this[o[1]](v, o[2],value);
                    });
            })
        });
        [[l+'By',l, o+L],[t+'By',t,o+T],[w+'By',w,o+W],[h+'By',h,o+H]].each(function(o){
            self.plugIn(o[0],function(value,flag){
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
                            linb([node]).onLocation(true, args);
                        if((k=='width' || k=='height')&& linb.dom.hasHandler(node,'onrewh')){
                            linb([node]).onRewh(true, args);
                        }
                    }
                },this)
            });
        });

        self.addCustomEvent=function(o){
            if(!(o instanceof Array))o=[o];
            var self=this,f;
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
                self.plugIn(o, f)
            });
            return self;
        };
        //changable profile
        'disabled,readonly,checked,className,value,title,name,href,src'.toArr().each(function(o){
            self.plugIn(o,function(value){
                return this.attr(o,value);
            })
        });
        'scrollLeft,scrollTop,tabIndex'.toArr().each(function(o){
            self.plugIn(o,function(value,flag){
                if(value !==undefined)
                    return this.each(function(v){
                        v[o]=value;
                    });
                else{
                    var v=this.get(0);
                    if(v===window || v===document){
                        var a=document.documentElement,b=document.body;
                        if("scrollTop"==o)return window.pageYOffset || Math.max(a[o], b[o]);
                        if("scrollLeft"==o)return window.pageXOffset || Math.max(a[o], b[o]);
                    }
                    return v[o];
                }
            })
        });
        //css shortcut
        'cursor,backgroundColor,display,overflow,color,background,position,zIndex,visibility,border'.toArr().each(function(o){
            self.plugIn(o,function(value){
                if(value===undefined){
                    var node=this._nodes[0];
                    if(!node || node.nodeType!=1)return;
                    var r= linb.dom.getStyle(node, o);
                if('zIndex'==o)r=parseInt(r)||0;
                    return r;
                }else
                    return this.setStyle(o, value);
            });
        });
        self.boxArr.each(function(o){
            self.plugIn(o,function(value){
                var self=this, node=self._nodes[0],b=linb.browser,type=typeof value,doc=document,t;
                if(!node || node.nodeType==3)return;
                if(type=='undefined'||type=='boolean'){
                    if((o=='width' && (t='Width'))||(o=='height' && (t='Height'))){
                        if(doc===node)return Math.max( doc.body['scroll'+t], doc.body['offset'+t], doc.documentElement['scroll'+t], doc.documentElement['offset'+t]);
                        if(window===node)return b.opr?doc.body['client'+t]:b.kde?window['inner'+t]:(linb.browser.contentBox && doc.documentElement['client'+t]) ||doc.body['client'+t];
                    }
                    //give shortcut
                    if(o=='width')value=parseInt(node.style.width)||self.W(node,1,value);
                    else if(o=='height')value=parseInt(node.style.height)||self.H(node,1,value);
                    else
                        value = linb.dom.getStyle(node, o);
                    return value=='auto'?value:(parseInt(value)||0);
                }else{
                    var f=linb.dom.setPxStyle,t,a;
                    return self.each(function(v){
                        if(v.nodeType!=1)return;
                        switch(o){
                            case 'right':
                            case 'bottom':
                                f(v, o, value);
                                break;
                            default:
                                if(v.style[o]!==value){
                                    if(o=='width')self.W(v,1,value);
                                    else if(o=='height')self.H(v,1,value);
                                    else{
                                        if(f(v, o, value))
                                            if((o=='top' || o=='left') && linb.dom.hasHandler(node,'onlocation')){
                                                a={};a[o]=1;
                                                linb([v]).onLocation(true, a);
                                            }
                                    }
                                }
                        }
                    });
                }
            });
        });
        // for linb.dom event
        linb.event._events.each(function(o){
            linb.event._getEventName(o).each(function(o){
                self.addCustomEvent(o);
            })
        });
    },
    Initialize:function(){
        //for hot keys
        linb([document]).onKeydown(function(p,e){
            var event=linb.event,set;
            event.currentKey=event.getKey(e);
            if(event.currentKey){
                set = linb.cache.hookKey[event.currentKey.join(":")];
                //if hot function return false, stop bubble
                if(set && (_.tryF(set[0],set[1],set[2])===false)){
                    event.stopBubble(e);
                    return false;
                }
            }
            return true;
        },"document")
        .onKeyup(function(p,e){
            linb.event.currentKey=null;
        },"document");

        //for clear memory
        linb([window]).afterUnload(function(){
            //unlink link 'App'
            linb.SC.$gc();
            linb.thread.$gc();
            linb([window, document]).clearEvent();
            linb([document.body]).empty();
            linb.dom.$gc();
            _.breakO([linb,Class,_],3);
            window.Class=window.linb=window._=undefined;
        },"window",-1);
    }
});/*
beforeShow
beforeCreated
onLoadBaseClass
onLoadResource
    loadResource (asy)
beforeIniComponents
    iniComponents (asy)
afterIniComponents
    iniExComs (asy)
onCodeLoaded
onReady
afterCreated
    iniUI (asy)
afterShow
*/

Class('linb.Com',null,{
    Constructor:function(){
        var self=this;
        self._nodes=[];
        self.host=self;
        self.properties = self.properties || {};
        self.events = self.events||{}
    },
    Instance:{
        setHost:function(h){
            this.host=h;
            return this;
        },
        setProperties:function(key,value){
            var self=this;
            if(!key)
                self.properties={};
            else if(typeof key=='string')
                self.properties[key]=value;
            else
                _.merge(self.properties, key, 'all');
            return self;
        },
        setEvents:function(key,value){
            var self=this;
            if(!key)
                self.events={};
            else if(typeof key=='string')
                self.events[key]=value;
            else
                _.merge(self.events, key, 'all');
            return self;
        },

        fireEvent:function(name, args){
            var t, self=this;
            if(t=self.events[name]){
                if(typeof t=='string')t=self.host[t];
                args=args||[];
                args.splice(0,0,self,self.threadid);
                if(typeof t=='function')t.apply(self.host, args);
            }
        },
        innerCall:function(name){
            var self=this;
            _.tryF(self[name],[self.threadid],self);
        },
        show:function(onEnd,parent,showId,threadid){
            var self=this,f=function(){
                if(self.customAttach)
                    self.customAttach.call(self, parent,showId,threadid);
                else
                    (parent||linb([document.body])).attach(self.getUIObj(),showId);
                _.tryF(onEnd,[self, threadid],self.host);
                self.fireEvent('afterShow');
            };
            self.threadid=threadid;
            self.fireEvent('beforeShow');
            if(self.created)
                f();
            else
                self.create(f,threadid);
        },
        create:function(onEnd, threadid){
            //get paras
            var self=this,
                suspend=linb.thread.suspend,
                resume=linb.thread.resume,
                t,funs=[]
                ;
            self.threadid=threadid;

            self.fireEvent('beforeCreated');
            //if no threadid or threadid doesnt exist, reset threadid to self
            funs.push(function(threadid){
                self.threadid=threadid;
            });
            //base classes
            if((t=self.base) && t.length)
                funs.push(function(threadid){
                    suspend(threadid);
                    linb.SC.group(self.base,function(key){
                        self.fireEvent('onLoadBaseClass', [key]);
                    },function(){resume(threadid)});
                });
            //load resource here
            if(self.loadResource)
                funs.push(function(){
                    self.fireEvent('onLoadResource');
                    self.innerCall('loadResource');
                });
            //load required class
            if((t=self.required) && t.length)
                funs.push(function(threadid){
                    suspend(threadid);
                    linb.SC.group(self.required,function(key){
                        self.fireEvent('onCodeLoaded', [key]);
                    },function(){resume(threadid)});
                });
            //build inner components
            if(self.iniComponents)
                funs.push(function(){
                    self.fireEvent('beforeIniComponents');
                    self.innerCall('iniComponents');
                    self.fireEvent('afterIniComponents');
                });
            //build Outer components
            if(self.iniExComs)
                funs.push(function(){
                    self.innerCall('iniExComs');
                });
            //core
            funs.push(function(threadid){
                self.loaded=true;
                //lazy load
                if(self.background)
                    linb.SC.background(self.background);
                self.fireEvent('onReady');
                _.tryF(onEnd,[self, threadid],self.host);
                self.fireEvent('afterCreated');
            });

            //build Outer components
            if(self.iniUI)
                funs.push(function(){
                    self.innerCall('iniUI');
                });

            //use asyUI to insert tasks
            linb.thread.asyUI(threadid, funs, function(){
                self.created=true;
            });
        },

        //for overwrite
        iniComponents:function(){
            return this._nodes;
        },
        requestData:function(group, threadid, onEnd){
            var thread=linb.thread;
            thread.asyUI(threadid, [function(t){
                //ensure busy/free order
                //if threadid is null, t is the real thread
                thread.suspend(threadid||t);
                linb.io.group(group, null, null, function(){
                    _.tryF(onEnd);
                    thread.resume(threadid||t);
                }).start();
            }]);
        },

        //
        clean:function(){
            this.properties = {};
            this.events = {};
            this.getUIObj().clean();
        },
        /* build thread:
        +-----------+
        |  +-------+|
        |  |  +---+||
        |a |ab|abc|||
        |  |  +---+||
        |  +-------+|
        +-----------+
        1.thread start
        2.build a UI
            build ab UI
                build abc UI
        3.fill a data
            fill ab data
                fill abc data
        4.thread end
        */
        //buid UI
        build:function(threadid, onEnd, flag){
            _.tryF(onEnd);
        },
        //fill data
        fillData:function(threadid, onEnd, flag){
            _.tryF(onEnd);
        },

        getUIObj:function(){
            var nodes = this._nodes.copy();
            nodes.filter(function(o){
                return !!o.box.hasDomRoot;
            });
            return linb.UI.pack(nodes, false);
        },
        detach:function(index){
            if(this._nodes)
                this.getUIObj().detach();
            return this;
        },
        reBoxing:function(key){
            return this.getUIObj().reBoxing(key);
        },
        attachTo:function(obj, key){
            obj.attach(this.getUIObj(), key);
        },
        destroy:function(threadid){
            var self=this;
            self.threadid=threadid;
            self.fireEvent('beforeDestroy');
            linb.UI.pack(self._nodes,false).destroy();
            self._nodes.length=0;
            _.breakO(self);
        }
    },
    Static:{
        EventHandlers:{
            beforeShow:function(){},
            beforeCreated:function(){},
            onLoadBaseClass:function(key){},
            onLoadResource:function(){},
            beforeIniComponents:function(){},
            afterIniComponents:function(){},
            onLoadWidgets:function(key){},
            onReady:function(){},
            afterCreated:function(){},
            afterShow:function(){}
        },
        load:function(cls,onEnd,lang,flag,paras){
            //after dom ready
            linb.main(function(){
                //get app class
                linb.SC(cls,function(){
                    var a=this,f=function(){
                        if(flag!==false)
                            (new a(paras)).show();
                        _.tryF(onEnd,[a,paras],a);
                    };
                    //get locale info
                    if(lang) linb.reLang(lang, f);
                    else f();
                },true);
            });
        }
    }

});
Class("linb.Cookies", null,{
    Static:{
        set:function(key,value,days,path,domain,isSecure){
	        if(key){
    	        document.cookie = escape(key) + "=" + escape(value) +
    		        (days?";expires="+(new Date((new Date()).getTime()+(24*60*60*1000*days))).toGMTString():"")+
    		        (path?";path="+path:"")+
    		        (domain?";domain="+domain:"")+ 
    		        (isSecure?";secure":"");
    		}
    		return this;
        },
        get:function(key){
        	var i,a,ca = document.cookie.split( "; " );
        	for(i=0;i<ca.length;i++){
        		a=ca[i].split("=");
        		if(a[0]==escape(key))
        		    return a[1]?unescape(a[1]):'';
        	}
        	return null;
        },
        remove:function(key){
        	return this.set(key,"",-1).set(key,"/",-1);
        },
        //get uri para from string
        getURIParas:function(str,key){
            if(!str)
                return key?'':{};
            var arr,hash={},a=str.split('&'),o;
            for(var i=0,l=a.length;i<l;i++){
                o=a[i];
                arr=o.split('=');
                hash[decodeURIComponent(arr[0])]=decodeURIComponent(arr[1]);
            }
            return key?hash[key]:hash;
        }
    }
});/* for drag && drop
var profile = {
    move: true,
    type: <"copy" "move" "shape" "icon">,
    defer :drag defer count, drag will be triggerred by mousemove
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
    target_style
    topZindex
    cursor

    pack:function
    unpack:function
}

type:
There are six type in DD,
"blank":blank in proxy node
"move": move target object directly when mousemove
"copy": move a copy of target object when mousemove
"shape":just move a shape of target object when mousemove
"icon":just move a icon that represents target object when mousemove
"none": move mouseonly

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

x :current X value of mouse;
y  :current Y value of mouse;
ox: mouse original X when drag start;
oy: mouse original Y when drag start;
proxyPos:{left:xx,top:xx}: css pos of proxy node in current step;
getOffset(): return {x:,y}: offset from now to origin

*/
Class('linb.dragDrop',null,{
    Static:{
        _eh:"_dd",
        _id:"linb.dd:proxy:",
        _idi:"linb.dd:td:",
        _size:50,
        _type:{blank:1,move:1,shape:1,copy:1,icon:1,none:1},
        _Icons:{none:'top', move:'-16px',ref:'-32px',add:'-48px'},

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

                ox = x;
                oy = y;

                if(proxy = o){
                    proxystyle=o.get(0).style;
                    _absPos= proxy.absPos(null,target_parent);
                    _cssPos= proxy.cssPos();
                    // according to corner

                    cssPos_offset_x = x - _cssPos.left;
                    cssPos_offset_y = y - _cssPos.top;
                    absPos_offset_x = x - _absPos.left;
                    absPos_offset_y = y - _absPos.top;

                    limit_left =  x - offset_left;
                    limit_right =  x + offset_right;
                    limit_top =  y - offset_top;
                    limit_bottom =  y + offset_bottom;

                    //here
                    proxyPos.left = pre.left = _cssPos.left;
                    proxyPos.top = pre.top = _cssPos.top;

                    if("move" !== type){
                        _zIndex = proxy.zIndex();
                        proxy.zIndex(linb.dom.top_zIndex*10);
                    }

                    if(opacity)
                        proxy.opacity(0.8);
                }
            }
        },
        _reset:function(){
            var d=this;
            d.$reset && d.$reset();
            d.start=null;
            d.showDDMark(0);
            d.resetProxy();

            d.type = 'shape';
            d.cursor='move';
            d._cursor=d._button='';
            d.move=true;

            d._begin= _();

            d.mousemove=d.mouseup=d.onselectstart=d.ondragstart='*';

            d.pre={left :0, top :0};
            d.proxyPos={left :0, top :0};
            d.docking_x=d.docking_y=[];
            d.target_clone=true;
            d.grid_width=d.grid_height=1;
            d._timer=d.docking_offset=-1;
            d._defer=d.defer=d._zIndex=d.x=d.y=d.ox=d.absPos_offset_y=d.absPos_offset_x=d.cssPos_offset_x=d.oy=d.cssPos_offset_y=d.limit_left=d.limit_right=d.limit_top=d.limit_bottom=0;
            d.working=d.offset_bottom=d.offset_left=d.offset_right=d.offset_top=d.drop2=d._stop=d.opacity=d.horizontal=d.vertical=d.topZindex=false;
            d.target_style=d.proxystyle=d._onDrag=d._onDragover=d.key=d.data=d.dragKey=d.dragData=d._current_bak=d._current=d._source=d._data=d.proxy=d.proxyIn=d._absPos= d._cssPos=d._box=d.pack=d.unpack=d.target_left= d.target_top= d.target_width=d.target_height=d.target_parent=null;

            return d;
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
                var d=document;
                //must here
                //if bak, restore
                if(onselectstart!='*')d.body.onselectstart=onselectstart;
                if(ondragstart!='*')d.ondragstart=ondragstart;
                //if bak, restore
                if(mousemove!='*')d.onmousemove=mousemove;
                if(mouseup!='*')d.onmouseup=mouseup;
            }
            return  this;
        },
        drag:function(e, node, profile, key, data){
            var self=this;
            with(self){
                //clear
                _end()._reset();

                e = e || window.event;
                // not left button
                if(linb.event.getBtn(e) !== 'left')
                   return true;

                _source = node = linb(node);
                _cursor = _source.cursor();

                if(!node.id())node.id(_.id(),true);

                //must set here
                _defer = defer = _.numb(profile && profile.defer, defer);
                if(profile){
                    if(true===profile.cursor)profile.cursor=_cursor;
                    type=typeof profile.icon == 'string'?"icon":_type[type]?type:'shape';
                }

                profile=_.hash(profile);

                var d=document,
                    _pos = linb.event.getPos(e);
                profile.x = _pos.left;
                profile.y = _pos.top;
                profile._button = linb.event.getBtn(e);

                dragKey= key || (profile && profile.key);
                dragData= data || (profile && profile.data);

                self.start=function(e){
//ie6: mousemove - mousedown =>78 ms
//delay is related to window size, weird
                //                  try{
                    var t;
                    //call event, you can call abort(set _stoop)
                    _source.beforeDragbegin();

                    if(working || _stop){_end()._reset();return false;}

                    //set profile
                    _.merge(self, profile, "all");
                    _ini(pack?pack():(type=='none')?null:_pack(_pos, node));
                    // on scrollbar
                    if(profile.x >= _box.width  || profile.y >= _box.height ){_end()._reset();return true;}

                    //set working flag
                    working = true;

                    _source.onDragbegin();

                    //set back first
                    if(defer<=0){
                        mousemove = d.onmousemove;
                        mouseup = d.onmouseup;
                    }

                    //back up
                    d.onmousemove = $onDrag;
                    d.onmouseup = $onDrop;
                    //for events
                    _source.afterDragbegin();
                    //for delay, call ondrag now
                    if(defer>0)$onDrag.call(self, e);
                //                  }catch(e){self._end()._reset();}
                };
                if(linb.browser.ie){
                    ondragstart=d.ondragstart;
                    onselectstart=d.body.onselectstart;
                    d.ondragstart = d.body.onselectstart = null;
                    if(d.selection)_.tryF(d.selection.empty);
                }

                //avoid select
                linb.event.stopBubble(e);

                //fire document onmousedown event
                if(node.get(0)!==d)
                    linb(d).onMousedown(true, linb.event.getEventPara(e));

                if(defer<=0){
                    _.tryF(self.start,[e],self);
                    return false;
                }else{
                    //for mouseup before drag
                    mouseup = d.onmouseup;
                    d.onmouseup = function(e){
                        linb.dragDrop._end()._reset();
                        return _.tryF(document.onmouseup,[e],null,true);
                    };
                    //for mousemove before drag
                    mousemove = d.onmousemove;
                    d.onmousemove = function(e){
                        if(--_defer<=0)linb.dragDrop.start(e);
                        return false;
                    };
                }
//ie6: mousemove - mousedown =>78 ms
            }
        },
        $onDrag:function(e){
            with(linb.dragDrop){
               //try{
                    e = e || window.event;
                    //set _stop or in IE, show alert
                    if((!working) || _stop || (linb.browser.ie && (!e.button) )){
                        $onDrop(e);
                        return true;
                    }

                    var _pos=linb.event.getPos(e);
                    x=_pos.left;y=_pos.top;

                    if(!working)return false;

                    if(proxy){
                        if(!vertical){
                            proxyPos.left=Math.floor(_left(
                                ((offset_left!==false||offset_right!==false)?
                                    ((x<=limit_left)?limit_left:(x>=limit_right)?limit_right:x):
                                    x)
                                - cssPos_offset_x)
                            );
                            if(proxyPos.left-pre.left)
                                proxystyle.left=proxyPos.left+'px';
                            pre.left=proxyPos.left;
                        }
                        if(!horizontal){
                            proxyPos.top=Math.floor(_top(
                                ((offset_top!==false||offset_bottom!==false)?
                                    ((y<=limit_top)?limit_top:(y>=limit_bottom)?limit_bottom:y):
                                    y)
                                - cssPos_offset_y)
                            );
                            if(proxyPos.top-pre.top)
                                proxystyle.top=proxyPos.top+'px';
                            pre.top=proxyPos.top;
                        }
                    }else{
                        //style='none', no dd.current dd.pre provided
                        //fireEvent
                        //_source.onDrag(true); //shortcut for mousemove
                    }
                    if(_onDrag!=1){
                        if(_onDrag)_onDrag(e);
                        else{
                            //ensure to run once only
                            _onDrag=1;
                            //if any ondrag event exists, this function will set _onDrag
                            _source.onDrag(true,linb.event.getEventPara(e));
                        }
                    }
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
                    // if(!working){linb.event.stopBubble(e);return false;}
                    _end();
                    if(working){
                        var r = _source.onDragstop(true,linb.event.getEventPara(e));
                        if(_current)
                            linb(_current.id).onDrop(true,linb.event.getEventPara(e));
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
            { x : proxyPos.left-ox+cssPos_offset_x,  y : proxyPos.top-oy+cssPos_offset_y}
            :
            { x : x-ox,  y : y-oy}
            ;
        },
        showDDMark:function(o,mode){
            var self=this,
                s1='<div style="position:absolute;z-index:'+linb.dom.top_zIndex+';font-size:0;line-height:0;border-',
                s2=":dashed 1px blue;",
                region=self._Region,
                bg='backgroundColor';
            if(region && region.parent())
                region.remove(false);
            if(self._R){
                self._R.setStyle(bg, self._RB);
                delete self._R;
                delete self._RB;
            }

            if(o){
                if(!region)
                    region=self._Region=linb.create(s1+'top'+s2+'left:0;top:0;width:100%;height:0;"></div>'+s1+'right'+s2+'right:0;top:0;height:100%;width:0;"></div>'+s1+'bottom'+s2+'bottom:0;left:0;width:100%;height:0;"></div>'+s1+'left'+s2+'width:0;left:0;top:0;height:100%;"></div>');
                o=linb(o);
                if(o.display()=='block')
                    o.addLast(region);
                else{
                    self._RB = o.getStyle(bg);
                    self._R=o;
                    o.setStyle(bg, '#FA8072');
                }

                self.setDropableIcon(mode||'move');
            }else
                self.setDropableIcon('none');
        },
        setDropableIcon:function(mode){
            //avoid other dropable node's showDDMark disturbing.
            _.resetRun('showDDMark', null);
            var self=this,i=self.proxyIn,ic=self._Icons;
            if(i && self.type=='icon')
                i.setStyle('backgroundPosition', 'left ' + (ic[mode]||ic.none));
        },
        setProxy:function(child, pos){
            var t,temp,self=this,dom=linb.dom;
            if(!dom.byId(self._id))
                linb([document.body]).addFirst(
                    //&nbsp; for IE6
                    dom.create('<div id="' + self._id + '" style="left:0;top:0;border:0; padding:'+self._size+'px; position: absolute;"><div id="' +self._idi+ '">'+(linb.browser.ie6?'&nbsp;':'')+'</div></div>')
                );
            t=linb(self._id);
            if(self.drop2){
                t.setStyle('padding',0);
            }else{
                pos.left -=  self._size;
                pos.top -= self._size;
                if(!self.target_parent){
                    dom.setCover(true);
                    //reset cursor for "move mode"
                    linb([document.body]).cursor(self.cursor);
                }
            }
            if(temp=self.target_parent)
                linb(temp).addLast(t);

            if(child){
                linb(self._idi).empty(false).addLast(child);
                self.proxyIn = child;
            }else
                self.proxyIn = linb(self._idi);
            t.setStyle({display:'',zIndex:dom.top_zIndex*10,cursor:self.cursor}).absPos(pos, temp);

            return t;
        },
        resetProxy:function(){
            var self=this,
                dom=linb.dom,
                id1=self._id,
                id2=self._idi;
            if(dom.byId(id1)){
                var t,k,o=linb(id2),t=linb(id1);
                //&nbsp; for IE6
                if(linb.browser.ie6)
                    o.html('&nbsp;');
                else o.empty();
                o=o.get(0);
                k=o.style;
                if(linb.browser.ie){
                    for(var i in k)
                        if(typeof k[i]!='function')
                            try{k[i]=''}catch(e){}
                }else
                    o.setAttribute('style','');

                linb([document.body]).addFirst(
                    t
                    .setStyle({
                        zIndex:0,
                        cursor:'',
                        display:'none',
                        padding:self._size+'px'
                    })
                );
                self.proxyIn=self.proxystyle=null;
                dom.setCover(false);
            }
        },
        getProxyPos:function(){
            var self=this,
                pos = linb(self._id).absPos();
            pos.left +=  self._size;
            pos.top += self._size;
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
                    var n=node.clone(d.target_clone).id('', true).setStyle({position:'relative',cursor:d.cursor,margin:0,'cssFloat':'none'}).cssSize(size);
                    if(d.opacity)
                        n.opacity(0.5);
                    if(d.target_style)
                        n.setStyle(d.target_style);
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
                        //for ie bug
                        if(linb.browser.ie)
                            t.setRegion({right:'auto',bottom:'auto'});

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
        unRegister:function(id, key){
            var o=linb(id), eh=this._eh;
            o.removeEvent('beforeMouseover', eh)
              .removeEvent('beforeMouseout', eh)
              .removeEvent('beforeMousemove', eh)
            ;
            o.each(function(o){
                var c = linb.cache.dom[o.id];
                if(c=c.addition)delete c._dropKeys;
                o._dropKeys=null;
            });
        },
        register:function(id, key){
            var o=linb(id),eh=this._eh;
            o.beforeMouseover(function(){
                var t=linb.dragDrop,self=this;
                if(t.dragKey && self._dropKeys[t.dragKey]){
                    t._current=self;
                    t._onDragover=null;
                    linb([self]).onDragenter(true);
                    if(t._current)_.resetRun('showDDMark', t.showDDMark, 0, [self], t);
                }
            }, eh);
            o.beforeMouseout(function(){
                var t=linb.dragDrop,self=this;
                 if(t.dragKey && self._dropKeys[t.dragKey]){
                    linb([self]).onDragleave(true);
                    t._current=t._onDragover=null;
                    _.resetRun('showDDMark', t.showDDMark, 0, [null], t);
                }
            }, eh)
            .beforeMousemove(function(a,e){
                var t=linb.dragDrop, h=t._onDragover, self=this;
                //no dragover event
                if(h==1)return;
                if(t._current==self && t.dragKey && self._dropKeys[t.dragKey]){
                    if(h)h(e);
                    else{
                        //ensure to run once only
                        t._onDragover=1;
                        //if any dragover event exists, this function will set _onDragover
                        linb([self]).onDragover(true,linb.event.getEventPara(e));
                    }
                }
            }, eh);
            o.each(function(o){
                //gcable
                var c = linb.cache.dom[o.id];
                (c.addition || (c.addition={}))["_dropKeys"]=null;
                (o._dropKeys || (o._dropKeys={}))[key]=true;
            });
            return this;
        }
    },
    After:function(){
        this._reset();
        //add dom dd functions
        _.each({
            startDrag:function(e, profile, key, data){
                linb.dragDrop.drag(e, this.get(0), profile, key||'', data||null);
                return this;
            },
            dragable:function(flag, profile, key, data){
                var self=this, dd=linb.dragDrop;
                if(flag===undefined)
                    flag=true;
                else if(typeof flag=='object'){
                    profile=flag;
                    flag=true;
                }
                if(flag===true)
                    self.addEvent('onMousedown',function(p,e){
                        if(linb.event.getSrc(e)!=this)return true;
                        linb([this]).startDrag(e, profile, key, data)
                    }, dd._eh, -1);
                else
                    self.removeEvent('onMousedown', dd._eh);

                return self;
            },
            dropable:function(flag, key){
                key = key || 'default';
                var d=linb.dragDrop;
                return this.each(function(o){
                    if(flag)
                        d.register(o, key);
                    else
                        d.unRegister(o, key);
                });
            }
        },function(o,i){
            linb.dom.plugIn(i,o);
        });
    }
});Class("linb.BookMark",null,{
    Static:{
        fid:'linb:bookmark',
        /* set ajax callback function
        callback: function(hashStr<"string after #">)
        */
    	iniBookMark: function(callback ){
    	    var self=this;
    		self.callback = callback;
    		var hash = location.hash;

    		self.lastHash = hash;
    		if(linb.browser.ie) {
    			if(self.lastHash=='')self.lastHash = '#';

                var n=document.createElement("div");
                n.style.display = "none";
                document.body.appendChild(n);
    			n.innerHTML = '<iframe id="'+this.fid+'" style="display: none;"></iframe>';
    			var ihistory = document.getElementById(this.fid), iframe = ihistory.contentWindow.document;
    			iframe.open();
    			iframe.close();
    			iframe.location.hash = hash;
    		}else if(linb.browser.kde) {
    			// etablish back/forward stacks
    			self.backStack = [];
    			self.backStack.length = history.length;
    			self.forwardStack = [];
    			self.isFirst = true;
    		}
    		self.callback(hash.replace(/^#/, ''));
            setInterval(self.threadCheck,100);
    		//linb.thread('$bookmark',[this.threadCheck],100, null, null, null, true).start();
    		return self;
    	},

        //check location.hash change periodically
    	threadCheck: function(){
    	    var self=linb.BookMark;
    		if(linb.browser.ie) {
    		    var ihistory = document.getElementById(self.fid), iframe = ihistory.contentWindow.document;
    			hash = iframe.location.hash;
    			if(hash != self.lastHash) {
    				self.lastHash = location.hash = hash;
    				self.callback(hash.replace(/^#/, ''));
    			}
    		}else if(linb.browser.kde) {
    			if(!self.dontCheck) {
    				var historyDelta = history.length - self.backStack.length;
    				if (historyDelta) { // back or forward button has been pushed
    					self.isFirst = false;
    					if(historyDelta < 0) { // back button has been pushed
    						// move items to forward stack
    						for (var i = 0; i < Math.abs(historyDelta); i++) self.forwardStack.unshift(self.backStack.pop());
    					} else { // forward button has been pushed
    						// move items to back stack
    						for (var i = 0; i < historyDelta; i++) self.backStack.push(self.forwardStack.shift());
    					}
    					var cachedHash = self.backStack[self.backStack.length - 1];
    					if (cachedHash !== undefined) {
    						self.lastHash = location.hash;
    						self.callback(cachedHash);
    					}
    				} else if (self.backStack[self.backStack.length - 1] === undefined && !self.isFirst) {
    					// back button has been pushed to beginning and URL already pointed to hash (e.g. a bookmark)
    					// document.URL doesn't change in Safari
    					if (document.URL.indexOf('#') >= 0) {
    						self.callback(document.URL.split('#')[1]);
    					} else {
    						var current_hash = location.hash;
    						self.callback('');
    					}
    					self.isFirst = true;
    				}
    			}
    		}else{
    			// otherwise, check for location.hash
    			var hash = location.hash;
    			if(hash != self.lastHash) {
    				self.lastHash = hash;
    				self.callback(hash.replace(/^#/, ''));
    			}
    		}
    	},
        /* change string after '#'
        * flag: true => change location hash only, don't call callback function
        */
    	setBookMark: function(hash, flag){
    	    var self=this;
    	    if(hash)hash=hash.replace(/^#+/,'');
            if(self.lastHash == '#' + hash)return false;

    		if(linb.browser.ie) {
    			var ihistory = document.getElementById(self.fid), iframe = ihistory.contentWindow.document;
                iframe.open();
    			iframe.close();
    			iframe.location.hash = location.hash = self.lastHash = '#' + hash;
    		}else if(linb.browser.kde) {

    			self.dontCheck = true;
        		self.backStack.push(hash);
        		self.forwardStack.length = 0;
        		self.isFirst = true;

    			var t=self;
    			_.asyRun(function(){t.dontCheck=false;t=null;},300);

    			location.hash = self.lastHash = hash;
    		}else
    		    location.hash = self.lastHash = '#' + hash;

            //use manual action
    		if(flag)
    		    self.lastHash = location.hash;
    		//use callback action
    		else
    		    self.callback(hash);
    	},
        //hook link(<a ...>xxx</a>) click action
    	hookLinkClick:function(fun, target){
            linb([document]).onClick(function(p,e,src){
                var s = location.href.split('#')[0],
                    t=linb.event,
                    o = t.getSrc(e),b,i=0,
                    b
                ;
                do{
                    if(o.tagName == 'A'){
                        b=true;
                        break;
                    }
                    if(++i>8)break;
                }while(o=o.parentNode)
                if(b && !t.getKey(e)[2] && t.getBtn(e)=='left'){
                    if(o.href.indexOf(s+'#')!=-1)
                        _.tryF(fun, [o.href.replace(s,'')], target);
                    return false;
                }
            },'hookA',0);
            return this;
    	}
    }
});Class('linb.ComFactory',null,{
    Static:{
        _pro:{},
        _cache:{},
        _domId:'linb:ComFactory:',
        getProfile:function(key){
            return key?this._pro[key]:this._pro;
        },
        setProfile:function(key, value){
            if(typeof key=='string')
                this._pro[key]=value;
            else
                this._pro=key;
        },
        clear:function(){
            _.each(this._cache,function(o){
                o.destroy();
            });
            this._cache={};
        },
        setCom:function(id, obj){
            this._cache[id]=obj;
            obj.comRefId=id;
        },
        getComFromCache:function(id){
            return this._cache[id];
        },
        broadcast:function(hash){
            var i,j,o,p,c=this._cache;
            for(j in hash){
                p=hash[j];
                for(i in c){
                    o=c[i];
                    if(typeof p=='function')
                        p.call(o,i);
                }
            }
        },
        getCom:function(id, threadid, onEnd){
            var c=this._cache,p=this._pro,ini=p._iniMethod;
            if(c[id]){
                _.tryF(onEnd, [threadid], c[id]);
                return c[id];
            }else{
                if(!(p=p[id]))return null;
                var self=arguments.callee, me=this, children=p.children;
                //ensure array
                var iniMethod = p.iniMethod || ini || 'create',
                    clsPath = p.cls,
                    props = p.props,
                    cls,
                    task=function(cls,props,threadid){
                        var o = new cls();
                        if(props)
                            _.merge(o,props,'all');
                        linb.ComFactory.setCom(id, o);

                        var args = [function(com){
                            var arr = com.getUIObj().get(),
                                fun=function(arr,firstlayer){
                                    var self1 = arguments.callee;
                                    arr.each(function(v,i){
                                        //if tag exists, replace tag with com from linb.ComFactory
                                        if(v.key=='linb.UI.Tag'){
                                            var tag=v, cid=tag.properties.tagKey;
                                            if(cid && children && children[cid])
                                                self.apply(me, [children[cid], threadid, function(){
                                                    //set link to parent com(linb.Com)
                                                    com[cid]=this;
                                                    //set com parent
                                                    this.parent=com;

                                                    //replace tag with this
                                                    var ui = this.getUIObj(), root;
                                                    // no UI in this com
                                                    if(!(root=ui.get(0)))return;

                                                    linb.UI.Tag.replace(tag,root);

                                                    //if the first layer, and in com's _nodes array
                                                    if(firstlayer && com._nodes[i]==tag)
                                                        com._nodes[i]=root;
                                                }]);
                                        }
                                        if(v.children){
                                            var a=[];
                                            v.children.each(function(o){
                                                a[a.length]=o[0];
                                            });
                                            self1(a);
                                        }
                                    });
                                };
                            //handle tag sub from com
                            fun(arr,1);
                        }];
                        args.push(threadid||null);

                        //insert first
                        if(onEnd)
                            linb.thread(threadid).insert({
                                task:onEnd,
                                args:[threadid],
                                target:o
                            });

                        //composed event here
                        linb.thread(threadid).insert({
                            task:function(threadid){
                                this.fireEvent('afterComposed');
                            },
                            args:[threadid],
                            target:o
                        });

                        //latter
                        _.tryF(o[iniMethod], args, o);
                    };
                linb.thread.asyUI(threadid,
                    [function(threadid){
                        var f=function(a,b,threadid){
                            var cls;
                            if(cls=linb.SC.evalPath(clsPath)){
                                linb.thread(threadid).insert({
                                    task:task,
                                    args:[cls, props, threadid]
                                });
                            }
                        };
                        linb.SC(clsPath, function(){
                            f(0,0,threadid);
                        }, true,{threadid:threadid});

                    }]
                );
            }
        },
        newCom:function(cls,onEnd,threadid){
            var o;
            if(o=linb.SC.evalPath(cls))
                _.tryF(onEnd,[threadid],new o);
            else
                linb.thread.asyUI(threadid,
                    [function(threadid){
                        linb.SC(cls, function(){
                            var o=new (linb.SC.evalPath(cls))();
                            _.tryF(onEnd,[threadid],o);
                        }, true,{threadid:threadid});
                    }]
                );
        },
/*        //for don't-need-return
        straightCall:function(id, method, args, threadid, onEnd){
            var r,t,c=this._cache,p=this._pro;
            //if com exists
            if(t=c[id]){
                //add threadid to args
                args.push(threadid||null);
                r=t[method].apply(t, args);
                _.tryF(onEnd,[r],t);
            }
            //create com first
            this.getCom(id, threadid, function(threadid){
                //add threadid to args
                args.push(threadid||null);
                r=this[method].apply(this, args);
                _.tryF(onEnd,[r],this);
            });
        },
*/
        store:function(id){
            var m,t,c=this._cache,domId=this._domId;
            if(t=c[id]){
                if(!(m=linb.dom.byId(domId)))
                    //using display:none here for performance, when appendchild, it'll not trigger layout etc.
                    linb(document.body).addFirst(linb.create('<div id="'+domId+'" style="display:none;"></div>'));
                m=linb(domId);
                //detach
                t.detach();
                //move to hide
                m.addLast(t.reBoxing());
            }
        },

        //prepare widget (build css string and add css to head, build template)
        prepareWidgets:function(){
            //prepare UI Ctrl
            var self=this,
                fun=function(threadid){
                    var r=false;
                    _.each(linb.UI, function(o){
                        if(o.$linb$ && o['linb.UI'] && o.$Appearances['default'] && !o.cssNone){
                            var path = linb.getPath(o.KEY, '/default/css.css','appearance');
                            if(!linb.UI.$cache_csspath[path]){
                                o=(new o).get(0);
                                o.toString();
                                o.destroy();
                                r=true;
                                return false;
                            }
                        }
                    });
                    if(!r)linb.thread(threadid).abort()
                };
            linb.thread(null,[fun],100,null,null,null,true).start();
        },
        prepareComs:function(arr){
            var self=this,funs=[];
            arr.each(function(i){
                funs.push(function(){
                    self.getCom();
                });
            });
            linb.thread(null, funs, 500).start();
        }
    }
});(linb.Locale.en||(linb.Locale.en={})).date={
    WEEKS:{
        '0':'Su',
        '1':'Mo',
        '2':'Tu',
        '3':'We',
        '4':'Th',
        '5':'Fr',
        '6':'Sa',
        '7':'WK'
    },
    VIEWS:{
        '10 ms':'10 millisecond',
        '100 ms':'100 milliseconds',
        '1 s':'1 second',
        '10 s':'10 seconds',
        '1 n':'1 minute',
        '5 n':'5 minutes',
        '10 n':'10 minutes',
        '30 n':'30 minutes',
        '1 h':'1 hour',
        '2 h':'2 hours',
        '6 h':'6 hours',
        '1 d':'1 day',
        '1 w':'1 week',
        '15 d':'15 days',
        '1 m':'1 month',
        '1 q':'1 quarter',
        '1 y':'1 year',
        '1 de':'10 years',
        '1 c':'1 century'
    },
    MONTHS:{
        '1':'Jan.',
        '2':'Feb.',
        '3':'Mar.',
        '4':'Apr.',
        '5':'May.',
        '6':'Jun.',
        '7':'Jul.',
        '8':'Aug.',
        '9':'Sep.',
        '10':'Oct.',
        '11':'Nov.',
        '12':'Dec.'
    },
    MS:'ms',
    S:'s',
    N:'n',
    H:'h',
    D:'d',
    W:'w',
    M:'m',
    Q:'q',
    Y:'y',
    DE:'de',
    C:'c',
    HN:function(n,a,b){return a+":"+b},
    DHN:function(n,a,b,c){return a +'d '+ b + ":" +c },
    MDHN:function(n,a,b,c,d){return a +'m ' + b+ 'd ' + c + ":" + d},
    HNS:function(n,a,b,c){return a+":"+b+":"+c},
    HNSMS:function(n,a,b,c,d){return a+":"+b+":"+c + ' ' +d},
    YM:function(n,a,b){return linb.getRes('date.MONTHS.'+b)+' '+a},
    YQ:function(n,a,b){return a+'y '+b+'q'},
    YMD:function(n,a,b,c){return b+'/'+c+'/'+a},
    MD:function(n,a,b){return linb.getRes('date.MONTHS.'+a) + b},
    YMDH:function(n,a,b,c,d){return c+'/'+b+'/'+a + ' ' +d+'h'},
    YMDHN:function(n,a,b,c,d,e){return b+'/'+c+'/'+a + ' ' +d+":"+e},
    YMDHNS:function(n,a,b,c,d,e,f){return b+'/'+c+'/'+a + ' ' +d+":"+e+":"+f},
    ALL:function(n,a,b,c,d,e,f,g){return b+'/'+c+'/'+a + ' ' +d+":"+e+":"+f +" " +g}
};

linb.Locale.en.color={
  LIST:{
    "FFFFFF":"White",
    "FFFFF0":"Ivory",
    "FFFFE0":"Light Yellow",
    "FFFF00":"Yellow",
    "FFFAFA":"Snow",
    "FFFAF0":"Floral White",
    "FFFACD":"Lemon Chiffon",
    "FFF8DC":"Cornislk",
    "FFF5EE":"Sea Shell",
    "FFF0F5":"Lavender Blush",
    "FFEFD5":"Papaya Whip",
    "FFEBCD":"Blanched Almond",
    "FFE4E1":"Misty Rose",
    "FFE4C4":"Bisque",
    "FFE4B5":"Moccasin",
    "FFDEAD":"Navajo White",
    "FFDAB9":"Peach Puff",
    "FFD700":"Gold",
    "FFC0CB":"Pink",
    "FFB6C1 ":"Light Pink",
    "FFA500":"Orange",
    "FFA07A":"Light Salmon",
    "FF8C00":"Dark Orange",
    "FF7F50":"Coral",
    "FF69B4":"Hot Pink",
    "FF6347":"Tomato",
    "FF4500":"Orange Red",
    "FF1493":"Deep Pink",
    "FF00FF":"Magenta",
    "FF00FF":"Fuchsia",
    "FF0000":"Red",
    "FDF5E6":"Old Lace",
    "FAFAD2":"Light Goldenrod Yellow",
    "FAF0E6":"Linen",
    "FAEBD7":"Antique White",
    "FA8072":"Salmon",
    "F8F8FF":"Ghost White",
    "F5FFFA":"Medium Spring Green",
    "F5F5F5":"White Smoke",
    "F5DEB3":"Wheat",
    "F4A460":"Sandy Brown",
    "F0FFFF":"Azure",
    "F0FFF0":"Honeydew",
    "F0F8FF":"Alice Blue",
    "F0E68C":"Khaki",
    "F08080":"Light Coral",
    "EEE8AA":"Pale Godenrod",
    "EE82EE":"Violet",
    "E9967A":"Dark Salmon",
    "E6E6FA":"Lavender",
    "E1FFFF":"Light Cyan",
    "DEB887":"Bruly Wood",
    "DDA0DD":"plum",
    "DCDCDC":"Gainsboro",
    "DC143C":"Crimson",
    "DB7093":"Pale Violet Red",
    "DAA520":"Gold Enrod",
    "DA70D6":"Orchid",
    "D8BFD8":"Thistle",
    "D3D3D3":"Light Grey",
    "D2B48C":"Tan",
    "D2691E":"Chocolate",
    "CD853F":"Peru",
    "CD5C5C":"Indian Red",
    "C71585":"Medium Violet Red",
    "C0C0C0":"Silver",
    "BDB76B":"Dark Khaki",
    "BC8F8F":"Rosy Brown",
    "BA55D3":"Medium Orchid",
    "B22222":"Fire Brick",
    "B0E0E6":"Pow Der Blue",
    "B0C4DE":"Light Steel Blue",
    "AFEEEE":"Pale Turquoise",
    "ADFF2F":"Green Yellow",
    "ADD8E6":"Light BLue",
    "A9A9A9":"Dark Gray",
    "A52A2A":"Brown",
    "A0522D":"Sienna",
    "9932CC":"Dark Orchid",
    "98FB98":"Pale Green",
    "9400D3":"Dark Voilet",
    "9370DB":"Medium Purple",
    "90EE90":"Light Green",
    "8FBC8F":"Dark Sea Green",
    "8B4513":"Saddle Brown",
    "8B008B":"Dark Magenta",
    "8B0000":"Dark Red",
    "8A2BE2":"Blue Violet",
    "87CEFA":"Light Sky Blue",
    "87CEEB":"Sky Blue",
    "808080":"Gray",
    "808000":"Olive",
    "800080":"Purple",
    "800000":"Maroon",
    "7FFFAA":"Auqamarin",
    "7FFF00":"Chartreuse",
    "7CFC00":"Lawn Green",
    "7B68EE":"Medium Slate Blue",
    "778899":"Light Slate Gray",
    "708090":"Slate Gray",
    "6B8E23":"Beige",
    "6A5ACD":"Slate Blue",
    "696969":"Dim Gray",
    "6495ED":"Cornflower Blue",
    "5F9EA0":"Cadet Blue",
    "556B2F":"Olive Drab",
    "4B0082":"Indigo",
    "48D1CC":"Medium Turquoise",
    "483D8B":"Dark Slate Blue",
    "4682B4":"Steel Blue",
    "4169E1":"Royal Blue",
    "40E0D0":"Turquoise",
    "3CB371":"Spring Green",
    "32CD32":"Lime Green",
    "2F4F4F":"Dark Slate Gray",
    "2E8B57":"Sea Green",
    "228B22":"Forest Green",
    "20B2AA":"Light Sea Green",
    "1E90FF":"Doder Blue",
    "191970":"Midnight Blue",
    "00FFFF":"Cyan",
    "00FFFF":"Aqua",
    "00FF7F":"Mint Cream",
    "00FF00":"Lime",
    "00FA9A":"Medium Aquamarine",
    "00CED1":"Dark Turquoise",
    "00BFFF":"Deep Sky Blue",
    "008B8B":"Dark Cyan",
    "008080":"Teal",
    "008000":"Green",
    "006400":"Dark Green",
    "0000FF":"Blue",
    "0000CD":"Medium Blue",
    "00008B":"Dark Blue",
    "000080":"Navy",
    "000000":"Black"
  }
};Class('linb.logger', null, {
    Static:{
        err:function(sMsg,sUrl,sLine){
            if(linb.browser.gek && sMsg=='Error loading script')
                return true;

            var self=linb.logger;
            try{
                self.log( 'An error raised!', ' >> Location: '+ sUrl + ' ( line ' + sLine + ' )', ' >> Message: '+sMsg);
                //older onError
                if(self._oe)
                    self._oe(sMsg,sUrl,sLine);
            }catch(e){
                return false;
            }
            return true;
        },
        trace:function(o,fun,arr,flag){
            var fun=fun||arguments.callee.caller,arr=arr||[];
            if(fun){
                arr.push('function "' + (fun.$name$||'') + '" in Class "' + (fun.$original$||'') +'"');
                if(fun.caller){
                    try{
                        arguments.callee(null,fun.caller,arr,1);
                    }catch(e){}
                }
            }
            if(!flag){
                var a=[];
                a.push(' >> Error Info:');
                if(typeof o == 'object')
                    for(var i in o)
                        a.push(' -- ' + i + " : " + o[i]);
                else
                    a.push(o);
                a.push(' >> Error Path: ' + arr.join(' < '));
                linb.logger.log.apply(linb.logger,a);
            }
        },
        log:function(){
            var win,doc,div,str,self=this,arr=arguments;
            if(!(win=self._win) || self._win.closed) {
                win = self._win = window.open("", "_blank", "width=520,height=300,scrollbars=1,resizable=1,status=0,location=0,menubar=0,toolbar=0");
                if(!win)return;
                win.moveTo(0,0);
                doc = win.document;
                doc.write("<html><head><title>Debug Log of LINB</title></head><body style='font-size:12px'></body></html>");
                doc.close();
            }
            win.focus();
            doc = win.document;
            div = doc.createElement("div");
            div.style.border='solid 1px #CDCDCD';
            div.appendChild(doc.createTextNode('At '+ new Date ));
            doc.body.appendChild(div);
            for(var i=0,l=arr.length;i<l;i++){
                str=arr[i];
                div = doc.createElement("div");
                div.appendChild(doc.createTextNode(str));
                doc.body.appendChild(div);
            }
        }
    },
    Initialize:function(){
       //window.onerror=this.err;

        if(linb.browser.gek && window.console){
            linb.log =function(){
                if(window.console)
                    console.log.call(console, [_.toArr(arguments), (_() - linb.log.time )+"ms"]);
                linb.log.time = _();
            }
        }

        linb.message = function(content, caption, type, width, time){
           width = width||200;
           var div, h, me=arguments.callee,
           stack=me.stack||(me.stack=[]),
           t=linb(window), left = t.scrollLeft() + t.width()/2 - width/2, height=t.height(), st=t.scrollTop();

           if(!(div=stack.pop())){
               div =
               '<div style="font-size:0;line-height:0;border:solid 1px #cdcdcd;position:absolute;overflow:visible;top:-50px;z-index:'+linb.dom.top_zIndex+'; background:#fefefe">' +
               '<div style="font-size:14px;overflow:hidden;font-weight:bold;padding:2px;"></div>'+
               '<div style="padding:5px;"></div>'+
               '</div>';
               div = linb.create(div);
               if(div.edge)div.edge();
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

            //height() is ok
            h = div.height();

            if(linb.browser.ie6)div.cssSize({ height :h, width :width+1});

            div.fx({top:[st-h-20,st+20]}).start();
            _.asyRun(function(){
                div.fx({top:[st+20, height+20]},null,function(){stack.push(div); div.hide()}).start();
            }, time||5000);
        };

    }
});