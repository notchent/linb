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
            return (linb.io.crossDomain(arguments[0])?linb.sajax:linb.ajax).apply(null, arguments).start()
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
            self.queryString = con.buildQS(self.queryString);

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

        buildQS:function(h){
            var a=[],i,o;
            for(i in h){
                o=h[i];
                a.push(encodeURIComponent(i)+'='+encodeURIComponent(o));
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
            var c=this.constructor, k=c.randkey, b=c.callback,nr=(this.rspType!='script'),rand=nr?k + '=' + this.id + '&':'';
            if(typeof obj=='string')
                return (obj && obj + '&') + rand + (nr?b + '=linb.sajax.response':'');
            else{
                if(nr){
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
                if(typeof k[i]=='string'){
                    t=document.createElement('input');
                    t.id=t.name=i;
                    t.value= k[i];
                    form.appendChild(t);
                }else if(k[i] && k[i].nodeName=="INPUT"){
                    k[i].id=k[i].name=i;
                    form.appendChild(k[i]);
                    b=true;
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
        getDummyRes : function(){
            var ns=this,
                arr,o,
                d=document,
                i=linb.ini,
                b=linb.browser,
                h=window.location.href,
                f=ns.crossDomain;
            if(ns.dummy)return ns.dummy;

            if(b.opr)
                return ns.dummy = i.path + i.file_xd;
            if (b.gek) {
                arr=d.getElementsByTagName("link");
                for(var i=0,j=arr.length; i<j; i++){
                    o = arr[i];
                    if (o.rel == "stylesheet" && !f(o.href))
                        return ns.dummy=o.href.split('#')[0];
                }
            }
            //not for 'ex-domain include jslinb' case
            if(!d.getElementById('linb:img:bg')){
                o=d.createElement('img');
                o.id='linb:img:bg';
                o.src=i.path + i.file_bg;
                o.style.display='none';
                d.body.appendChild(o);
            }
            arr=d.getElementsByTagName("img");
            for(var i=0,j=arr.length; i<j; i++){
                o = arr[i];
                if(!f(o.src))
                    return ns.dummy=o.src.split('#')[0];
            }
        },

        tpl:function(){return '<iframe src="'+this.getDummyRes() + '#"></iframe>'},
        customQS:function(obj){
            var c=this.constructor;
            obj[c.type]='ipost';
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
};