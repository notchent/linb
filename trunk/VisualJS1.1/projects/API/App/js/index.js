Class('App', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Layout)
            .host(t,"mainLayout")
            .setLeft(null)
            .setTop(null)
            .setItems([{"id":"before","pos":"before","locked":false,"size":240,"min":100,"max":400,"hide":false,"cmd":true},{"id":"main","min":10}])
            .setType("horizontal")
            );

            t.mainLayout.attach(
            (new u.PanelBar)
            .host(t,"panelbar1")
            .setLeft(null)
            .setTop(null)
            .setZIndex(1)
            .setCaption("LINB Object Tree")
            .setCloseBtn(false)
            .setLandBtn(false)
            , 'before');

            t.panelbar1.attach(
            (new u.TreeBar)
            .host(t,"objTree")
            .setLeft(0)
            .setTop(0)
            .setItems([])
            .afterCreated("_objtree_aftercreated")
            .onRequestData("_objtree_onrequestdata")
            .onItemSelected("_objtree_onitemselected")
            );

            t.mainLayout.attach(
            (new u.Div)
            .host(t,"divHead")
            .setLeft(80)
            .setTop(30)
            .setDock("fill")
            , 'main');

            f(
            (new u.Div)
            .host(t,"div21")
            .afterCreated(function (pro) {
                pro.root.onClick(function () {linb.dom.submit("http://www.sigmawidgets.com");});
            })
            .setCustomAppearance({"KEY":"background-image:url(img/logo.gif);position:absolute;top:0px;right:0px;width:120px;height:60px;z-index:100;cursor:pointer;"})
            );

            return n;
            // ]]code created by designer
        },
        _objtree_aftercreated:function (profile) {
            profile.boxing().setItems([
                {id:'String', caption:'String', icon:'img/img.gif', iconPos:'left top'},
                {id:'Array', caption:'Array', icon:'img/img.gif', iconPos:'left top'},
                {id:'_', caption:'_', icon:'img/img.gif', iconPos:'left top'},
                {id:'Class', caption:'Class', icon:'img/img.gif', iconPos:'left -48px'},
                {id:'linb', caption:'linb',icon:'img/img.gif', iconPos:'left top', sub:[]}
            ]);
        },

        _getFunArgs:function(f,i){
            with (String(i?f[i]:f)) return (i||'') + ' ( ' + slice(indexOf("(") + 1, indexOf(")")) + ' )';
        },

        _format:function(obj){
            var arr=[];
            arr.push('<h1><img src="img/work.jpg" style="vertical-align: bottom;margin-right:4px;">'+obj.key+'</h1>');
            arr.push('<div>')
            if(obj.parent){
                obj.parent.sort();
                arr.push('<h2><span class="linb-custom-cmd"></span>Direct Super Classes</h2>');
                arr.push('<div class="linb-custom-block">')
                obj.parent.each(function(o){
                    arr.push('<p><span class="linb-custom-icon" style="background-position:' +this._iconPosMap.cls+';"></span>'+o+'</p>');
                },this);
                arr.push('</div>')
            }
            if(obj.children){
                obj.children.sort();
                arr.push('<h2 ><span class="linb-custom-cmd"></span>Direct Sub Classes</h2>');
                arr.push('<div class="linb-custom-block">')
                obj.children.each(function(o){
                    arr.push('<p><span class="linb-custom-icon" style="background-position:' +this._iconPosMap.cls+';"></span>'+ o +'</p>');
                },this);
                arr.push('</div>')
            }
            if(obj.con){
                arr.push('<h2 ><span class="linb-custom-cmd"></span>Constructor</h2>');
                arr.push('<div class="linb-custom-block">')
                arr.push('<p><span class="linb-custom-icon" style="background-position:' +this._iconPosMap.con+';"></span>' + obj.key + obj.con + '</p>');
                arr.push('</div>')
            }
            if(obj.vars){
                obj.vars.sort();
                arr.push('<h2 ><span class="linb-custom-cmd"></span>Static Properties</h2>');
                arr.push('<div class="linb-custom-block">')
                obj.vars.each(function(o){
                    arr.push('<p><span class="linb-custom-icon" style="background-position:' +this._iconPosMap.mem+';"></span>'+ o +'</p>');
                },this);
                arr.push('</div>')
            }
            if(obj.funs){
                arr.push('<h2 ><span class="linb-custom-cmd"></span>Static Methods</h2>');
                arr.push('<div class="linb-custom-block">')
                if(obj.funs.self){
                    obj.funs.self.sort();
                    obj.funs.self.each(function(o){
                        arr.push('<p><span class="linb-custom-icon" style="background-position:' +this._iconPosMap.fun+';"></span>'+ o +'</p>');
                    },this);
                }
                for(var i in obj.funs){
                    if(i!='self'){
                        arr.push('<h3 ><span class="linb-custom-cmd"></span>Inherite from '+i+'</h3>');
                        arr.push('<div class="linb-custom-block">')
                        obj.funs[i].sort();
                        obj.funs[i].each(function(o){
                            arr.push('<p><span class="linb-custom-icon" style="background-position:' +this._iconPosMap.fun+';"></span>'+ o +'</p>');
                        },this);
                        arr.push('</div>')
                    }
                }
                arr.push('</div>')
            }
            if(obj.provars){
                obj.provars.sort();
                arr.push('<h2 ><span class="linb-custom-cmd"></span>Instance Properties</h2>');
                arr.push('<div class="linb-custom-block">')
                obj.provars.each(function(o){
                    arr.push('<p><span class="linb-custom-icon" style="background-position:' +this._iconPosMap.mem+';"></span>'+ o +'</p>');
                },this);
                arr.push('</div>')
            }
            if(obj.profuns){
                arr.push('<h2 ><span class="linb-custom-cmd"></span>Instance Methods</h2>');
                if(obj.profuns.self){
                    obj.profuns.self.sort();
                    arr.push('<div class="linb-custom-block">')
                    obj.profuns.self.each(function(o){
                        arr.push('<p><span class="linb-custom-icon" style="background-position:' +this._iconPosMap.fun+';"></span>'+ o +'</p>');
                    },this);
                }
                for(var i in obj.profuns){
                    if(i!='self'){
                        obj.profuns[i].sort();
                        arr.push('<h3 ><span class="linb-custom-cmd"></span>Inherite from '+i+'</h3>');
                        arr.push('<div class="linb-custom-block">')
                        obj.profuns[i].each(function(o){
                            arr.push('<p><span class="linb-custom-icon" style="background-position:' +this._iconPosMap.fun+';"></span>'+ o +'</p>');
                        },this);
                        arr.push('</div>')
                    }
                }
                arr.push('</div>')
            }
            if(obj.events){
                obj.events.sort();
                arr.push('<h2 ><span class="linb-custom-cmd"></span>Events</h2>');
                arr.push('<div class="linb-custom-block">')
                obj.events.each(function(o){
                    arr.push('<p><span class="linb-custom-icon" style="background-position:' +this._iconPosMap.event+';"></span>'+ o +'</p>');
                },this);
                arr.push('</div>')
            }
            arr.push('</div>')

            if(obj.$i)
              arr.push('<h3> ==== Interface or abstract virtual class ==== </h3>');

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
            open: 'left -178px'
        },
        _parse:function(id){
            var o = linb.SC.evalPath(id), cls, key, obj={},filter=function(s,o){
                var me=arguments.callee, h=me.h||(me.h={upper:1,Constructor:1,Before:1,After:1,prototype:1}),
                c=s.charAt(0);
                if(c=='_'||c=="$")return false;
                if(/\./.test(s))return false;
                if(h[s])return false;
                if(o && o.$linb$)return false;
                return true;
            };

            if(typeof o == 'function' && o.$linb$)cls=true;
            obj.key = id;

            if(cls){

                o.$parent.each(function(o,i){
                    if(!obj.parent)obj.parent=[];
                    obj.parent.push(o.KEY);
                });
                o.$children.each(function(o){
                    if(!obj.children)obj.children=[];
                    obj.children.push(o);
                });
                if(o.$i)
                    obj.$i=o.$i;
                else{

                    obj.con = this._getFunArgs(o);

                    key = o.KEY;
                    for(var i in o){
                        if(filter(i,o[i])){
                            if(typeof o[i]=='function'){
                                if(!obj.funs)obj.funs={};
                                if((!o[i].$original$) || o[i].$original$==key){
                                    if(!obj.funs.self)obj.funs.self=[];
                                    obj.funs.self.push(this._getFunArgs(o,i));
                                }else{
                                    if(!obj.funs[o[i].$original$])obj.funs[o[i].$original$]=[];
                                    obj.funs[o[i].$original$].push(this._getFunArgs(o,i));
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
                                    if(!obj.events)obj.events=[];
                                    obj.events.push(this._getFunArgs(o,i));
                                }else if((!o[i].$original$) || o[i].$original$==key){
                                    if(!obj.profuns)obj.profuns={};
                                    if(!obj.profuns.self)obj.profuns.self=[];
                                    obj.profuns.self.push(this._getFunArgs(o,i));
                                }else{
                                    if(!obj.profuns)obj.profuns={};
                                    if(!obj.profuns[o[i].$original$])obj.profuns[o[i].$original$]=[];
                                    obj.profuns[o[i].$original$].push(this._getFunArgs(o,i));
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
                            obj.funs.self.push(this._getFunArgs(o,i));
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
                        obj.profuns.self.push(this._getFunArgs(o,i));
                    }
                }
            }
            return  obj ;
        },
        _objtree_onrequestdata:function (profile, item, threadid) {
            var id=item.id, o=linb.SC.evalPath(id), arr=[],sub=[],temp;

            for(var i in o){
                if(i!='upper' && typeof o[i] == 'function' && o[i].$linb$){
                    temp={id:id+'.'+i, caption:i, icon:'img/img.gif'};

                    for(var j in o[i])
                        if(j!='upper' && typeof o[i][j] == 'function' && o[i][j].$linb$){
                            temp.sub=[];
                            break;
                        }

                    temp.caption = id+'.'+i;
                    temp.iconPos=this._iconPosMap.cls;

                    arr.push(temp);
                }
            }

            linb.thread(threadid).setCache('response',arr);
        },
        _objtree_onitemselected:function (profile, item, src) {
            var node = this.divHead.reBoxing();
            node.dig('h2').onClick(null);
            node.dig('h3').onClick(null);

            this.divHead.setHtml( this._format( this._parse(item.id) ) );
            var self=this;
            var f=function(){
                var a=linb(this).next(),b;
                a.display( (b=a.display()=='none')?'block':'none' );
                linb(this).first().setStyle('backgroundPosition', b?self._iconPosMap.open:self._iconPosMap.close);
            };
            node.dig('h2').cursor('pointer').onClick(f).first().setStyle('backgroundPosition',this._iconPosMap.close);
            node.dig('h3').cursor('pointer').onClick(f).first().setStyle('backgroundPosition',this._iconPosMap.close);
        },
        _aftercreated:function (page, threadid) {
            var arr=[];

            arr.push('h1{margin:10px 2px 2px 10px; padding-bottom:10px; font: bold 24px "Trebuchet MS","Lucida Grande",Verdana,sans-serif; color: #D00000; border-bottom: 1px dashed #aca899;}');
            arr.push('h2{margin:10px 2px 10px 2px; font: bold 18px "Trebuchet MS","Lucida Grande",Verdana,sans-serif;  color:#134275; border-bottom: 1px dashed #aca899;}');
            arr.push('h3{margin:10px 2px 10px 2px; font: bold 16px Bookman Old Style, Helvetica, sans-serif; color: #4C4B43; border-bottom: 1px dashed #aca899;}');

            arr.push('.linb-custom-block{margin:2px 2px 2px 18px;display:none;}');
            arr.push('.linb-custom-icon{margin:2px;width:16px;height:16px;background-image:url(img/img.gif);vertical-align: bottom;}');
            arr.push('.linb-custom-block p{margin:2px;font: bold 12px "Trebuchet MS","Lucida Grande",Verdana,sans-serif;background:#F9FFE9;border: 1px dotted #E9D3F4;}');

            arr.push('.linb-custom-cmd{cursor:pointer;margin:2px;width:16px;height:16px;background-image:url(img/img.gif)}');

            linb.css.add(arr.join(''));
        },events:{"afterCreated":"_aftercreated"}
    }
});