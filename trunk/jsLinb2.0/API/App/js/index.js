Class('App', 'linb.Com',{
        Initialize:function(){
            var arr=[];

            arr.push('.ccss-item{text-decoration: line-through;}');

            arr.push('h1{margin:10px 2px 2px 10px; padding-bottom:10px; font: bold 24px "Trebuchet MS","Lucida Grande",Verdana,sans-serif; color: #D00000; border-bottom: 1px dashed #aca899;}');
            arr.push('h2{margin:10px 2px 10px 2px; font: bold 18px "Trebuchet MS","Lucida Grande",Verdana,sans-serif;  color:#134275; border-bottom: 1px dashed #aca899;}');
            arr.push('h2.notice{color:#000}');
            arr.push('h2.inherite{color:#D2691E}');
            arr.push('h3{margin:10px 2px 10px 2px; font: bold 16px Bookman Old Style, Helvetica, sans-serif; color: #4C4B43; border-bottom: 1px dashed #aca899;}');
            arr.push('h4{position:relative;padding-left:20px;font: bold 12px "Trebuchet MS","Lucida Grande",Verdana,sans-serif;background:#F9FFE9;}');
            arr.push('.totop{position:absolute;padding-left:3px;padding-right:3px;left:4px;top:4px;}');

            arr.push('.linb-custom-block{margin:2px 2px 2px 18px;display:none;}');
            arr.push('.linb-custom-icon{margin:2px;width:16px;height:16px;background-image:url(img/img.gif);vertical-align: bottom;}');

            arr.push('.inndiv {margin:3px;}');
            arr.push('.inndiv li{padding-left:20px;}');
            
            arr.push('.required{color:red;}');

            arr.push('.linb-custom-block .p{margin:2px;border: 1px solid #E9D3F4;position:relative;}');
            arr.push('.linb-custom-block .con{display:none;padding:8px; font: 12px "Trebuchet MS","Lucida Grande",Verdana,sans-serif;background:#FFF;border-top: 1px solid #E9D3F4;}');

            arr.push('.linb-custom-list{background:#E5ECF9;border:1px solid #3366CC;margin:2px;padding:5px;}');

            arr.push('.linb-custom-list a{text-decoration: underline;}');

            arr.push('.linb-custom-cmd{cursor:pointer;margin:2px;width:16px;height:16px;line-height:0;font-size:0;background-image:url(img/img.gif)}');

            linb.CSS.addStyleSheet(arr.join(''),'',true);
            
            //dont want to show original function code
            _.id.$auto$=1;

        },
        Instance:{
        $CLS_FUN:{'Namespace':1,'Class':1,'_':1,'_.fun':1,'linb':1,'linb.Thread':1,'linb.Ajax':1,'linb.SAjax':1,'linb.IAjax':1,'linb.SC':1},
        $CLS_STATIC:{'_.fun':1,'linb':1,'linb.Thread':1,'linb.Ajax':1,'linb.SAjax':1,'linb.IAjax':1,'linb.SC':1,'linb.Event':1,'linb.DragDrop':1,'linb.CSS':1,'linb.History':1,'linb.Cookies':1,'linb.ComFactory':1,'linb.Debugger':1,'linb.Date':1,'linb.Tips':1,'linb.Coder':1},
        events:{onReady:'_onready'},
        _onready:function(){
            SPA=this;
            linb.UI.Border.$abstract=linb.UI.Shadow.$abstract=linb.UI.Resizer.$abstract=true;
            linb.History.setCallback(function(str){
                str=str.replace('#','');
                var hash=_.urlDecode(str),id;
                if(!hash.a && str){
                    if(str.indexOf('.prototype.')!=1)
                        hash.a=str.split('.prototype.')[0];
                    else
                        hash.a=str.slice(0,str.lastIndexOf('.'));
                }
                if(id=hash.a){
                    if(SPA._curId==id)
                        return;
                    SPA._curId=id;
                    _.resetRun('SPA',function(){
                        SPA.objTree.openToNode(id).setValue(id);
                        var node=SPA.divHead.getRoot(),
                            ics=SPA._iconPosMap,
                            f=SPA._clickForToggle
                            ;
                        SPA.divHead.setHtml( SPA._format( SPA._parse(id) ) );
                        node.query('h2').css('cursor','pointer').onClick(f).first().css('backgroundPosition',ics.close);
                        node.query('h3').css('cursor','pointer').onClick(f).first().css('backgroundPosition',ics.close);
                    },50);
                }
            });            
        },
        showCode:function(e, key){
            var txt = '/*\n * Original code in jsLinb \n * With it, maybe you can understand the function easily \n*/' + 
                      key + ' = ' + 
                      linb.SC(key).toString();
            txt = linb.Coder.formatAll(txt, 'js', ['plain']);
            var node=linb.create("<div style='visibiliy:hidden;left:-10000px;width:600px;background:#fff;border:solid 1px #aaa;overflow:auto;'>"+txt+"</div>");
            //add first
            linb('body').append(node);
            //adjust height
            if(node.first().height()>400)node.height(400);
            //pop
            node.popToTop(linb.Event.getPos(e));

            node.setBlurTrigger(_()+"", function(){
                node.remove();
            });

            return false;
        },
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var t=this, n=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Layout)
            .host(t,"mainLayout")
            .setLeft(null)
            .setTop(null)
            .setItems([{"id":"before","pos":"before","locked":false,"size":240,"min":100,"max":400,"hide":false,"cmd":true},{"id":"main","min":10}])
            .setType("horizontal")
            );

            t.mainLayout.append(
            (new u.Panel)
            .host(t,"panelbar1")
            .setLeft(null)
            .setTop(null)
            .setZIndex(1)
            .setCaption("jsLINB API")
            .setCloseBtn(false)
            .setLandBtn(false)
            , 'before');

            t.panelbar1.append(
            (new u.TreeBar)
            .host(t,"objTree")
            .setLeft(0)
            .setTop(0)
            .setItems([])
            .onRender("_objtree_aftercreated")
            );

            t.mainLayout.append(
            (new u.Div)
            .host(t,"divHead")
            .setLeft(80)
            .setTop(30)
            .setDock("fill")
            .setCustomStyle({KEY:"overflow:auto;"})
            , 'main');

            f(
            (new u.Div)
            .host(t,"div21")
            .setDomId('logo')
            .setCustomStyle({"KEY":"background-image:url(img/logo.gif);position:absolute;left:auto;bottom:auto;top:0px;right:14px;width:120px;height:60px;z-index:100;"})
            );

            return n;
            // ]]code created by jsLinb UI Builder
        },
        _objtree_aftercreated:function (profile) {
            var items=[
                {id:'Namespace', href:'#a=Namespace', caption:'Namespace', icon:'img/img.gif', iconPos:'left -48px'},
                {id:'Class', href:'#a=Class', caption:'Class', icon:'img/img.gif', iconPos:'left -48px'},
                {id:'_', href:'#a=_', caption:'_', icon:'img/img.gif', iconPos:'left -48px', sub:[]},
                {id:'linb', href:'#a=linb', caption:'linb',icon:'img/img.gif', iconPos:'left top', sub:[]}
            ];
            var self=this,
                o=items[2], id=o.id, sub=o.sub,
                getClass=function(o, ref, id){
                    var arr=[],temp,id=id||o.KEY, temp, sub;
                    for(var i in o)
                        if('prototype'!=i && 'constructor' != i&& 'upper' !=i)
                            if(typeof o[i]=='function'&& o[i].$linb$){
                                
                                temp={id:id+'.'+i, href:'#a='+id+'.'+i, caption:id+'.'+i, icon:'img/img.gif',iconPos:ref._iconPosMap['cls']};
                                if(typeof linb.getRes('doc.'+id+'.'+i)!='object')
                                    temp.itemClass='ccss-item';
                                sub=arguments.callee(linb.SC.get(id+'.'+i),ref);
                                if(sub.length) temp.sub=sub;
                                arr.push(temp);
                            }
                    arr.sort(function(x,y){
                        return x.id>y.id?1:-1;
                    });
                    return arr;
                };
            o=linb.SC.get(id);
            for(var i in o){
                for(var j in o[i]){
                     if('prototype'!=j&&'constructor'!=j&&j.charAt(0)!='_'&&j.charAt(0)!='$'){
                        sub.push({id:id+'.'+i, href:'#a='+id+'.'+i, caption:id+'.'+i, icon:'img/img.gif', iconPos:self._iconPosMap[typeof o[i]=='function'?'fun':'hash']});
                        break;
                    }
                }
            }

            o=items[3];
            sub=o.sub; 
            id='linb'; 
            o.sub=getClass(linb, self, id);

            profile.boxing().setItems(items);
        },
        _getFunArgs:function(f,i){
            with (''+(i?f[i]:f)) return (i||'') + ' ( ' + slice(indexOf("(") + 1, indexOf(")")) + ' )';
        },
        _getItem:function(pos, head, key, flag){
            var con = this.getDoc(key),t;
            return '<a name="'+key+'" ></a> <div class="p"> <h4 id="'+_.id()+'">' + 
                    (con?'<span class="linb-custom-icon" style="background-position:' +pos+';"></span>':'') + 
                    head +
                    (flag !==false?((t=linb.SC(key)).$linb$||t.$auto$ ?"":'<a href="javascript:;" onclick="return SPA.showCode(event,\''+key+'\');">&nbsp;&nbsp;&nbsp;&nbsp;[Original Code]</a>'):"") + 
                    '</h4>' + 
                    (con?'<div class="con">'+con+'</div>':"") + 
                    (flag!==false?'<a class="totop" href="#'+key+'."> ^ </a>':'')+
                    '</div>'
                    ;
        },
        _format:function(obj){
            var key=obj.key,
                dot=".",
                pdot='.prototype.',
                ipm=this._iconPosMap;
            var ns=this,arr=[],getItem=function(){return ns._getItem.apply(ns,arguments);}

            arr.push('<h1><img src="img/work.jpg" style="vertical-align: bottom;margin-right:4px;">'+obj.key+'</h1>');
            arr.push('<div>')
            if(obj.parent){
                obj.parent.sort();
                arr.push('<h2 id="'+_.id()+'" class="inherite"><span class="linb-custom-cmd"></span>Direct Super Classes</h2>');
                arr.push('<div class="linb-custom-block">')
                _.arr.each(obj.parent,function(o){
                    arr.push('<div class="p"><a href="#a='+o+'"><div><span class="linb-custom-icon" style="background-position:' +ipm.cls+';"></span>'+ o +'</div></a></div>');
                });
                arr.push('</div>')
            }
            if(obj.children){
                obj.children.sort();
                arr.push('<h2 id="'+_.id()+'" class="inherite"><span class="linb-custom-cmd"></span>Direct Sub Classes</h2>');
                arr.push('<div class="linb-custom-block">')
                _.arr.each(obj.children,function(o){
                    arr.push('<div class="p"><a href="#a='+o+'"><div><span class="linb-custom-icon" style="background-position:' +ipm.cls+';"></span>'+ o +'</div></a></div>');
                });
                arr.push('</div>')
            }
            if(this.$CLS_FUN[key]){
                arr.push('<h2 id="'+_.id()+'" class="notice"><span class="linb-custom-cmd"></span>Global Function</h2>');
                arr.push('<div class="linb-custom-block">');
                arr.push(getItem(ipm.fun, obj.key + ' ' + this._getFunArgs(linb.SC(obj.key)), obj.key));
                arr.push('</div>')
            }

            if(this.$CLS_STATIC[key]){
                arr.push('<h2 id="'+_.id()+'" class="notice">&nbsp;&nbsp;&nbsp;&nbsp;No Constructor, Dont use "new" operation</h2>');
                arr.push('<div class="linb-custom-block"></div>');
            }

            if(obj.con && !this.$CLS_FUN[key] && !this.$CLS_STATIC[key]){
                arr.push('<h2 id="'+_.id()+'" ><span class="linb-custom-cmd"></span>Constructor</h2>');
                arr.push('<div class="linb-custom-block">');
                arr.push(getItem(ipm.con,obj.key + obj.con, obj.key+'.constructor', false));
                arr.push('</div>')
            }
            if(obj.vars){
                obj.vars.sort();
                arr.push('<h2 id="'+_.id()+'" ><span class="linb-custom-cmd"></span>Static Properties</h2>');
                var a1=[],a2=[],tt;
                _.arr.each(obj.vars,function(o){
                    tt=key + dot + o;
                    a1.push(getItem(ipm.mem,o, tt, false));
                    a2.push("<a id='short-abc' href='#"+tt+"' >"+o+"</a> &nbsp;&nbsp;&nbsp;");
                });
                arr.push('<div class="linb-custom-block">'+'<div class="linb-custom-list">'+a2.join('')+'</div>'+a1.join('')+'</div>')
            }
            if(obj.funs){
                arr.push('<h2 id="'+_.id()+'" ><span class="linb-custom-cmd"></span>Static Methods</h2>');
                arr.push('<div class="linb-custom-block">');
                if(obj.funs.self){
                    obj.funs.self.sort();
                    var a1=[],a2=[],tt;
                    _.arr.each(obj.funs.self,function(o){
                        tt=key + dot + o[0];
                        a1.push(getItem(ipm.fun,o[1], tt));
                        a2.push("<a id='short-abc' name='"+tt+".' href='#"+tt+"' >"+o[0]+"</a> &nbsp;&nbsp;&nbsp;");
                    });
                    arr.push('<div class="linb-custom-list">'+a2.join('')+'</div>'+a1.join(''))
                }
                for(var i in obj.funs){
                    if(i!='self'){
                        arr.push('<h3 id="'+_.id()+'"><span class="linb-custom-cmd"></span>Inherite from '+i+'</h3>');
                        obj.funs[i].sort();
                        var a1=[],a2=[],tt;
                        _.arr.each(obj.funs[i],function(o){
                            tt=i + dot + o[0];
                            a1.push(getItem(ipm.fun,o[1], tt));
                            a2.push("<a id='short-abc' name='"+tt+".' href='#"+tt+"' >"+o[0]+"</a> &nbsp;&nbsp;&nbsp;");
                        });
                        arr.push('<div class="linb-custom-block">'+'<div class="linb-custom-list">'+a2.join('')+'</div>'+a1.join('')+'</div>')
                    }
                }
                arr.push('</div>');
            }
            if(obj.provars){
                obj.provars.sort();
                arr.push('<h2 id="'+_.id()+'" ><span class="linb-custom-cmd"></span>Instance Properties</h2>');
                var a1=[],a2=[],tt;
                _.arr.each(obj.provars,function(o){
                    tt=key + pdot + o;
                    a1.push(getItem(ipm.mem,o, tt, false));
                    a2.push("<a id='short-abc' href='#"+tt+"' >"+o+"</a> &nbsp;&nbsp;&nbsp;");
                });
                arr.push('<div class="linb-custom-block">'+'<div class="linb-custom-list">'+a2.join('')+'</div>'+a1.join('')+'</div>')
            }
            if(obj.profuns){
                arr.push('<h2 id="'+_.id()+'" ><span class="linb-custom-cmd"></span>Instance Methods</h2>');
                arr.push('<div class="linb-custom-block">');
                if(obj.profuns.self){
                    obj.profuns.self.sort();
                    var a1=[],a2=[],tt;
                    _.arr.each(obj.profuns.self,function(o){
                        tt=key + pdot + o[0];
                        a1.push(getItem(ipm.fun,o[1], tt));
                        a2.push("<a id='short-abc' name='"+tt+".' href='#"+tt+"' >"+o[0]+"</a> &nbsp;&nbsp;&nbsp;");
                    });
                    arr.push('<div class="linb-custom-list">'+a2.join('')+'</div>'+a1.join(''))
                }
                for(var i in obj.profuns){
                    if(i!='self'){
                        arr.push('<h3 id="'+_.id()+'" ><span class="linb-custom-cmd"></span>Inherite from '+i+'</h3>');
                        obj.profuns[i].sort();
                        var a1=[],a2=[],tt;
                        _.arr.each(obj.profuns[i],function(o){
                            tt=i + pdot + o[0];
                            a1.push(getItem(ipm.fun,o[1], tt));
                            a2.push("<a id='short-abc' name='"+tt+".' href='#"+tt+"' >"+o[0]+"</a> &nbsp;&nbsp;&nbsp;");
                        });
                        arr.push('<div class="linb-custom-block">'+'<div class="linb-custom-list">'+a2.join('')+'</div>'+a1.join('')+'</div>')
                    }
                }
                arr.push('</div>')
            }
            if(obj.events){
                arr.push('<h2 id="'+_.id()+'" ><span class="linb-custom-cmd"></span>Events</h2>');
                arr.push('<div class="linb-custom-block">');
                arr.push('<div>'+SPA.getDoc(obj.key=='linb.Dom'?'linb.Dom.Events':'linb.UI.Events')+'</div>');

                if(obj.events.self){
                    obj.events.self.sort();
                    var a1=[],a2=[],tt;
                    _.arr.each(obj.events.self,function(o){
                        tt=key + pdot + o[0];
                        a1.push(getItem(ipm.event,o[1], tt, false));
                        a2.push("<a id='short-abc' name='"+tt+".' href='#"+tt+"' >"+o[0]+"</a> &nbsp;&nbsp;&nbsp;");
                    });
                    arr.push('<div class="linb-custom-list">'+a2.join('')+'</div>'+a1.join(''))
                }
                for(var i in obj.events){
                    if(i!='self'){
                        obj.events[i].sort();
                        var a1=[],a2=[],tt;
                        arr.push('<h3 id="'+_.id()+'" ><span class="linb-custom-cmd"></span>Inherite from '+i+'</h3>');
                        _.arr.each(obj.events[i],function(o){
                            tt=i + pdot + o[0];
                            a1.push(getItem(ipm.event,o[1], tt, false));
                            a2.push("<a id='short-abc' name='"+tt+".' href='#"+tt+"' >"+o[0]+"</a> &nbsp;&nbsp;&nbsp;");
                        });
                        arr.push('<div class="linb-custom-block">'+'<div class="linb-custom-list">'+a2.join('')+'</div>'+a1.join('')+'</div>')
                    }
                }
                arr.push('</div>');
            }
            arr.push('</div>')

            if(obj.$abstract)
              arr.push('<h3 id="'+_.id()+'"> ==== Abstract Virtual Class or Inner Class ==== </h3>');

            return arr.join('');
        },
        _iconPosMap:{
            cls:'left -16px',
            con:'left -145px',
            fun:'left -48px',
            hash:'left top',
            arr:'left -128px',
            mem:'left -96px',
            event:'left -32px',
            close:'left -160px',
            open: 'left -176px'
        },
        _parse:function(id){
            var o = linb.SC.get(id), cls, key, obj={},filter=function(s,o){
                var me=arguments.callee, h=me.h||(me.h={upper:1,Constructor:1,Before:1,After:1,prototype:1}),
                c=s.charAt(0);
                if(s=='KEY')return false;
                if(c=='_'||c=="$")return false;
                if(/\./.test(s))return false;
                if(h[s])return false;
                if(o && o.$linb$)return false;
                return true;
            };
            if(!o)return '';

            if(typeof o == 'function' && o.$linb$)cls=true;
            obj.key = id;

            if(cls){
                _.arr.each(o.$parent,function(o,i){
                    if(!obj.parent)obj.parent=[];
                    obj.parent.push(o.KEY);
                });
                _.arr.each(o.$children,function(o){
                    if(!obj.children)obj.children=[];
                    obj.children.push(o);
                });
                if(o.$abstract)
                    obj.$abstract=o.$abstract;
                else{

                    obj.con = this._getFunArgs(o);

                    key = o.KEY;
                    for(var i in o){
                        if(filter(i,o[i])){
                            if(typeof o[i]=='function'){
                                if(!obj.funs)obj.funs={};
                                if((!o[i].$original$) || o[i].$original$==key){
                                    if(!obj.funs.self)obj.funs.self=[];
                                    obj.funs.self.push([i, this._getFunArgs(o,i)]);
                                }else{
                                    if(!obj.funs[o[i].$original$])obj.funs[o[i].$original$]=[];
                                    obj.funs[o[i].$original$].push([i,this._getFunArgs(o,i)]);
                                }
                            }else{
                                if(!obj.vars)obj.vars=[];
                                obj.vars.push(i);
                            }
                        }
                    }

                    o=o.prototype;
                    for(var i in o){
                        if(filter(i,o[i])){
                            if(typeof o[i]=='function'){
                                if(o[i].$event$){
                                    if(!obj.events)obj.events={};
                                    if((!o[i].$original$) || o[i].$original$==key){
                                        if(!obj.events.self)obj.events.self=[];
                                        obj.events.self.push([i,this._getFunArgs(o.constructor.$EventHandlers||o,i)]);
                                    }else{
                                        if(!obj.events[o[i].$original$])obj.events[o[i].$original$]=[];
                                        obj.events[o[i].$original$].push([i, this._getFunArgs(o.constructor.$EventHandlers||o,i)]);
                                    }
                                }else{
                                    if(!obj.profuns)obj.profuns={};
                                    if((!o[i].$original$) || o[i].$original$==key){
                                        if(!obj.profuns.self)obj.profuns.self=[];
                                        obj.profuns.self.push([i, this._getFunArgs(o,i)]);
                                    }else{
                                        if(!obj.profuns[o[i].$original$])obj.profuns[o[i].$original$]=[];
                                        obj.profuns[o[i].$original$].push([i, this._getFunArgs(o,i)]);
                                    }
                                }
                            }else{
                                if(!obj.provars)obj.provars=[];
                                obj.provars.push(i);
                            }
                        }
                    }
                }
            }else{
                for(var i in o){
                    if(filter(i,o[i])){
                        if(typeof o[i]=='function'){
                            if(!obj.funs)obj.funs = {self:[]};
                            obj.funs.self.push([i, this._getFunArgs(o,i)]);
                        }else{
                            if(!obj.vars)obj.vars=[];
                            obj.vars.push(i);
                        }
                    }
                }
                if(o.prototype){
                    o=o.prototype;
                    for(var i in o){
                        if(!obj.profuns)obj.profuns = {self:[]};
                        obj.profuns.self.push([i, this._getFunArgs(o,i)]);
                    }
                }
            }
            return  obj ;
        },
        _clickForToggle:function(p,e,s,n){
            var f=SPA._clickForToggle,ff=SPA._clickForLoca, ics=SPA._iconPosMap, ths=linb([this]);
            if(linb.Event.getSrc(e).nodeName=='A')return;
            var a=ths.next(),b,ta,t,id;
            if(s.nodeName=='H4'){
                ta=a.query('textarea');
                if(!ta.isEmpty())
                    ta.each(function(o){
                        if(o.id!='code')return;
                        t=linb([o]);
                        o=_.str.toDom(linb.Coder.formatAll(t.text(), 'js', ['plain','run']));
                        t.replace(o);
                    });
            }
            if(s.nodeName=='H2'){
                if(!s.__set){
                    ths.next().query('h4').css('cursor','pointer').onClick(f).first().css('backgroundPosition',ics.close);
                    ths.next().query('*','id','short-abc').onClick(ff);
                    s.__set=1;
                }
            }
            a.css('display', (b=a.css('display')=='none')?'block':'none' );
            ths.first().css('backgroundPosition', b?ics.open:ics.close);
        },
        _clickForLoca:function(){
            var a=this,
                id = a.href.split('#')[1],
                node = linb([this]).parent(2).query('a','name',id).next().first();
            if(!node.isEmpty()){
                node.animate({opacity:[0,1]}, 0,0, 2000, 20).start();
                if(node.next().css('display')=='none')node.onClick();
            }
        },
        getDoc:function(key){
            if(!key)return '';
            var o = linb.getRes("doc."+key);
            if(typeof o == 'string')
                return o;
            return this.buildDoc(o);
        },
        buildDoc:function(o){
            var arr=[];
            if(o){
                if(o.$desc)
                    arr.push('<div class="inndiv">' + o.$desc + '</div>');
                if(o.$rtn)
                    arr.push('<div class="inndiv">' + '<strong>Return Value: </strong>' + o.$rtn + '</div>');
                if(o.$paras){
                    arr.push('<div class="inndiv">' + '<div><strong>Parameters: </strong></div><ul>');
                    _.arr.each(o.$paras,function(v){
                        v=v.replace(/^([^:\[]*)([^:]*):(.*)$/,"<strong>$1</strong> $2 : $3");
                        arr.push('<li> ' + v + ' </li>');
                    })
                    arr.push("</ul></div>");
                }

                if(o.$snippet){
                    arr.push('<div class="inndiv">' + '<div><strong>Code snippet: </strong></div>');
                    _.arr.each(o.$snippet,function(v){
                        arr.push('<textarea id="code" class="js plain-run">' + v + '</textarea><p>&nbsp;</p>');
                    })
                    arr.push("</div>");
                }
                if(o.$memo)
                    arr.push('<div class="inndiv">' + '<strong>Memo: </strong>' + o.$memo + '</div>');

                if(o.$links){
                    arr.push('<div class="inndiv">' + '<div><strong>See Also: </strong></div><ul>');
                    _.arr.each(o.$links,function(v){
                        arr.push('<li><a target="'+(v[2]||'')+'" href="' +v[1]+ '">' + v[0] + '</a></li>');
                    })
                    arr.push("</ul></div>");
                }
            }
            return arr.join('').replace(/\[Required\]/g,"[<span class='required'>Required</span>]");
        }
    }
});