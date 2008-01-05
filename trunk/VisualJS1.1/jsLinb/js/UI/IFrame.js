Class("linb.UI.IFrame", ["linb.UI.iWidget","linb.UI.iMisc"],{
    Instance:{
        _start:false,
        submit:function(action, data, fdata, method, enctype){
            var self=this,
            fun=function(){
                self.get(0)._start=true;

                data=_.hash(data);
                method=_.str(method,'get').toUpperCase();
                action=_.str(action);

                var prof=self.get(0),_t=[];

                _.each(data,function(o,i){
                    _t.push('<textarea id="'+i+'" name="'+i+'">'+(typeof o=='object'?_.serialize(o):o)+'</textarea>');
                });

                var formStr='<form target="'+self.get(0).domId+'" action="'+action+'" method="'+method  +  '">'+_t.join('')+'</form>';

                var form= prof._form = formStr.toDom(false);
                linb.dom.getMatix().addLast(form);
                _.each(fdata,function(o,i){
                    /*var v=o.clone();
                    v.get(0).id=i;
                    v.get(0).name=i;
                    form.addLast(v);*/
                    o.get(0).id=i;
                    o.get(0).name=i;
                    form.addLast(o);
                });
                var formdom = form.get(0);
                if(enctype){
                    if(formdom.encoding)
                        formdom.encoding = 'multipart/form-data';
                    formdom.enctype = 'multipart/form-data';
                }

                if(linb.browser.ie6)
                    linb.temp.cancelBeforeload=true;

                formdom.submit();

                prof._time=_.asyRun(function(){
                    self.clear();
                    self.onTimeout(prof);
                }, prof.properties.timeout);
            };
            if(linb.browser.opr)
                _.asyRun(fun,10);
            else
                fun();
        },
        clear:function(){
            var prof=this.get(0);
            prof._start=false;
            if(prof._form)prof._form.remove();
            clearTimeout(prof._time);
        }
    },
    Initialize:function(){
    },
    Static:{
        cssNone:true,
        Templates:{'default':{
            style:'{_style}',
            tagName:'iFrame',
            //for ie
            name:'{name}',
            src:'{src}'
        }},
        Behaviors:{'default':{
            onLoad:function(prof){
                if(!prof._start)return;

                var s=prof.box.getBody(prof.domNode).innerHTML;
                prof.boxing().clear();
                if(prof.onResponse){

                    if(linb.browser.opr)s=s.replace(/&quot;/g, '"');
                    prof.boxing().onResponse(prof, s);
                }
            }
        }},
        Appearances:{'default':{
        }},
        DataModel:{
            timeout:30000,
            width:100,
            height:100,
            src:{
                ini:'javascript:;',
                action:function(v){
                    if(this.domNode)
                        this.root.src(v);
                }
            }
        },
        EventHandlers:{
            onResponse:function(profile, response){},
            onTimeout:function(profile){}
        },
        prepareData:function(profile){
            arguments.callee.upper.apply(this,arguments);
            var data=profile.data;
            data.name = profile.key +":" + linb.UI.$ID +":";
            data.src = data.src || 'javascript:false';
        },
        getBody: function(i){
            return (i.contentWindow || i).document.body;
        }
    }
});
