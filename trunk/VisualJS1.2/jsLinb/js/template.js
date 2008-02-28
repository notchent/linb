Class('linb.template','linb.iProfile',{
    Constructor:function(parent,template,events,properties){
        var self=this;
        self.domId = self.KEY + ':' + (self.serialId=self.pickSerialId()) + ':',
        self._links={};
        self.template={'':[['<div></div>'],[]]};
        self.properties={};
        self.events={};
        self.$id=_.id();
        self.links(self.constructor._cache,'self').links(linb._object,'linb');
        self.box=self.constructor;
        linb.cache.dom[self.domId]=this;

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
            //$gc in linb.dom can't destory template, use destroy manully
            //template has no memory leak, ignore it when window.unload
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
});