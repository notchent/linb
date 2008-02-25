
Class('VisualJS.PageEditor', 'linb.Com',{
    Instance:{
        iniUI:function(){
            var self=this;
            if(self.properties.checkType!='js')
                self.toolbar.hideItem('check');
            self.setText(self.properties.text);
        },
        eval2:function(txt){
            var r=true,
                iframe = document.createElement("iframe");
            iframe.style.display = "none";
            document.body.appendChild(iframe);
            frames[frames.length - 1].document.write(
                "<script>"+
                "var Class=function(a,b,c){}, _={}, linb={};"+
                "var MSIE/*@cc_on =1@*/;"+
                "parent.sandbox=MSIE?this:{eval:function(s){return eval(s)}}"+
                "<\/script>"
            );
            txt=txt.trim();
            try{
                try{
                    sandbox.eval(txt);
                }catch(a){
                    sandbox.eval('('+txt+')');
                }
            }catch(e){
                linb.message( _.Error(e));
                r=false;
            }finally{
                document.body.removeChild(iframe);
            }
            return r;
        },
        check:function(txt){
            switch(this.properties.checkType){
                case 'js':
                    return this.eval2(txt);
                break;
            }
            return true;
        },
        //flag=false, not check
        getText:function(flag){
            var self=this,
                txt = self.texteditor.getUIValue().replace(/\r\n/g,'\n');
            if(self.properties.text != txt){
                if(false!==flag)
                    if(self.check(txt)===false)return false;
                return txt;
            }else
                return self.properties.text;
        },
        activate:function(){
            if(this.texteditor){
                var self=this;
                _.asyRun(function(){
                    self.texteditor.activate();self=null;
                });
            }
        },
        setReadonly:function(b){
            this.texteditor.setReadonly(b);
        },
        setText:function(txt, flag){
            var self=this;
            txt = txt||'';
            self.properties.text = txt.replace(/\r\n/g,'\n');
            //self.texteditor.updateUIValue(txt);
            self.texteditor.setValue(txt,true);

            //reset
            self._dirty=false;
            return self;
        },
        resetEnv:function(text){
            this._dirty=false;
            this.properties.text = text||txt.replace(/\r\n/g,'\n');
        },
        _texteditor_onKeyPress:function(profile, e, src){
            var self=this,
                ov = self._dirty,a,b,r=src.value.replace(/\r\n/g,'\n');

            self._dirty = self.properties.text !== r;
            if(ov!=self._dirty)
                _.tryF(self.events.onValueChanged, [self, profile, self._dirty, r], self.host);
        },
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Panel)
            .host(t,"panel")
            .setDock("fill")
            );

            t.panel.attach(
            (new u.ToolBar)
            .host(t,"toolbar")
            .setItems([{"id":"only","sub":[{"id":"format","caption":"$VisualJS.pageEditor.format","icon":"img/App.gif","iconPos":"-32px -48px","type":"button","tips":"$VisualJS.pageEditor.formattips"},{"id":"check","caption":"$VisualJS.pageEditor.check","icon":"img/App.gif","iconPos":"0 -48px","type":"button","tips":"$VisualJS.pageEditor.checktips"}]}])
            .onClick("_toolbar_onclick")
            );

            t.panel.attach(
            (new u.TextEditor)
            .host(t,"texteditor")
            .setDock("fill")
            .setCaption("texteditor")
            .onKeyPress("_texteditor_onKeyPress")
            );

            return n;
            // ]]code created by designer
        }
        ,_toolbar_onclick: function(profile, id){
            var self=this;
            linb.dom.UIAction(function(){
                switch(id){
                    case 'format':
                        var code=linb.coder.parse(self.texteditor.getUIValue(), self.properties.checkType,['plain']);
                        var dialog = new linb.UI.Dialog();
                        dialog.setLeft(100).setTop(100).setWidth(300).setHeight(200).setStatus('max').setMinBtn(false).setMaxBtn(false).setCaption('$VisualJS.pageEditor.formatted')
                        .create();
                        dialog.html(code);
                        dialog.show(linb(document.body),true);
                        break;
                    case 'check':
                        var txt = self.getText();
                        if(txt!==false)
                            linb.message(linb.getRes('VisualJS.checkOK'));
                        break;
                }
            });
        }
    }
});