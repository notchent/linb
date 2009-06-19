Class('App.CodeView', 'linb.Com',{
    Instance:{
        events:{onReady:'_onready'},
        _onready:function(){
            this.texteditor.setValue(linb.Coder.formatText(SPA.sampleCode),true);
        },
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};

            append((new linb.UI.Layout)
                .host(host,"layout6")
                .setItems([{"id":"main", "min":10, "caption":"main"}, {"id":"after", "pos":"after", "size":30, "locked":true, "min":10, "hide":false, "cmd":false, "caption":"after"}])
                .setLeft(0)
                .setTop(0)
                .setType("horizontal")
            );

            host.layout6.append((new linb.UI.TextEditor)
                .host(host,"texteditor")
                .setDock("fill")
                .setLeft(380)
                .setTop(190)
            , 'main');

            host.layout6.append((new linb.UI.Button)
                .host(host,"button25")
                .setDock("fill")
                .setLeft(20)
                .setTop(110)
                .setCaption(">")
                .setVAlign("middle")
                .onClick("_button25_onclick")
                .setCustomStyle({KEY:'background:#eee;'})
            , 'after');

            return children;
            // ]]code created by jsLinb UI Builder
        },
        _button25_onclick:function (profile, e, src, value) {
            SPA.toTreeView()
        },
        setCode:function(str){
            var ns=this;
            ns.$code=str;
            ns.texteditor.setValue(str,true);
        },
        getCode:function(){
            return this.texteditor.getUIValue();
        }
    }
});