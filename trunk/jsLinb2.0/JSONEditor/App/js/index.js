Class('App', 'linb.Com',{
    Instance:{
        events:{"beforeCreated":"_beforeCreated", "afterIniComponents":"_afterinicomponents"},

        sampleCode:'{"name":"JSON Editor","powered by":"jsLinb","version":"1.0","test data":{"int":23,"float":23.23,"string":"This\'s a string.","html":"<div>a<span>c</span>b</div>","hash":{"a":1,"b":"2"},"array":[1,"2",3],"regexp":/^{[w]*}$/gim,"NULL":null,"Date":new Date(1998,10,20,4,23,14,120),"function":function (a,b,c){return a+b+c;}}}',
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};

            append((new linb.UI.Image)
                .host(host,"image2")
                .setTop("2")
                .setRight("18")
                .setZIndex("100")
                .setSrc("img/logo.gif")
            );

            append((new linb.UI.ToolBar)
                .host(host,"toolbar")
                .setItems([{"id":"group1", "sub":[{"id":"sample", "caption":"Insert Sample Code"}, {"id":"format", "caption":"Format Code"}, {"id":"compress", "caption":"Compress Code"}, {"id":"totreegrid", "caption":"goto TreeView"}], "caption":"group1"}, {"id":"group2", visible:false, "sub":[{"id":"tocode", "caption":"goto CodeView"}], "caption":"group1"}])
                .onClick("_toolbar_onclick")
            );

            return children;
            // ]]code created by jsLinb UI Builder
        },
        _beforeCreated:function () {
            SPA=this;
        },
        _onrender:function(){
        },
        toCodeView:function(){
            var n2=SPA.$cv.getRoot(),
                n1=SPA.$tv.getRoot(),
                region=n1.cssRegion(),
                region2=_.copy(region),
                w=region.width;
            region2.left=w;
            n2.css('display','').cssRegion(region2);
            n1.animate({move:function(rate){
                    n1.left(-rate*w);
                    n2.left((1-rate)*w);
                }},_.fun(),function(){
                n2.cssRegion(region);
                n1.css('display','none');

                SPA.toolbar.showGroup('group2',false);
                SPA.toolbar.showGroup('group1',true);
                
                SPA.$cvhost.setCode(linb.Coder.formatText(SPA.$tvhost.getCode()));
                
            },200,20,'outexp').start();
        },
        getType:function(o){
            return o===null?null:
                    _.isStr(o)?'string':
                    _.isNumb(o)?'number':
                    _.isHash(o)?'hash':
                    _.isArr(o)?'array':
                    _.isBool(o)?'boolean':
                    _.isDate(o)?'date':
                    _.isReg(o)?'regexp':
                    _.isFun(o)?'function':
                    'undefined';
        },
        toTreeView:function(){
            var str=SPA.$cvhost.getCode();
            if(!SPA.eval2(str))return;

            var n1=SPA.$cv.getRoot(),
                n2=SPA.$tv.getRoot(),
                region=n1.cssRegion(),
                region2=_.copy(region),
                w=region.width;
            region2.left=-w;
            n2.css('display','').cssRegion(region2);
            n1.animate({move:function(rate){
                    n1.left(rate*w);
                    n2.left((rate-1)*w);
                }},_.fun(),function(){
                n2.cssRegion(region);
                n1.css('display','none');

                SPA.toolbar.showGroup('group1',false);
                SPA.toolbar.showGroup('group2',true);

                SPA.$tvhost.setCode(linb.Coder.formatText(str));

            },200,20,'outexp').start();

        },
        _afterinicomponents:function () {
            var cf=linb.ComFactory;
            cf.setProfile({
                codeview:{
                    cls:'App.CodeView'
                },
                treeview:{
                    cls:'App.TreeView'
                }
            });
            cf.getCom('codeview',function(){
                if(!SPA.$cv){
                    SPA.$cvhost=this;
                    SPA.$cv=this.getUIComponents();
                    SPA.$cv.setZIndex(2);
                    linb(document.body).append(SPA.$cv);
                }
            });
            cf.getCom('treeview',function(){
                if(!SPA.$tv){
                    SPA.$tvhost=this;
                    SPA.$tv=this.getUIComponents();
                    SPA.$tv.setZIndex(1);
                    linb(document.body).append(SPA.$tv);
                }
            });
        },
        _toolbar_onclick:function (profile, item, group, e, src) {
            if(group.id=='group1'){
                var str=SPA.$cvhost.getCode();
                switch(item.id){
                    case 'sample':
                        SPA.$cvhost.setCode(SPA.sampleCode,true);
                        break;
                    case 'format':
                        if(SPA.eval2(str)){
                            SPA.$cvhost.setCode(linb.Coder.formatText(str),true);
                        }
                        break;
                    case 'compress':
                        if(SPA.eval2(str)){
                            SPA.$cvhost.setCode(linb.Coder.formatText(str,'js',true),true);
                        }
                        break;
                    case 'totreegrid':
                        SPA.toTreeView();
                        break;
                }
            }else{
                switch(item.id){
                    case 'tocode':
                    SPA.toCodeView();
                    break;
                }
            }
            
        },
        eval2:function(txt){
            if(typeof txt!='string' || !txt){
                alert('No conent!');
                return false;
            }
            var r=true,
                iframe = document.createElement("iframe");
            iframe.style.display = "none";
            document.body.appendChild(iframe);
            frames[frames.length - 1].document.write(
                "<script>"+
                "var MSIE/*@cc_on =1@*/;"+
                "parent.sandbox=MSIE?this:{eval:function(s){return eval(s)}}"+
                "<\/script>"
            );
            txt=_.str.trim(txt);
            try{
                try{
                    sandbox.eval(txt);
                }catch(a){
                    sandbox.eval('('+txt+')');
                }
            }catch(e){
                var line=e.line||e.lineNumber;
                alert((e.name?e.name+' : ':'') + (e.description||e.message||'') + (line?'\n line : '+line:'') );
                r=false;
            }finally{
                document.body.removeChild(iframe);
            }
            return r;
        },
        onCmdClick:function(btn){
            SPA.$tvhost.onCmdClick(btn);
        }
    }
});