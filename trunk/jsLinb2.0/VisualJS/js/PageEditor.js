
Class('VisualJS.PageEditor', 'linb.Com',{
    Instance:{
        events:{
            onReady:function(page){
                if(page.properties.checkType!='js')
                    page.toolbar.showItem('check',false);
                page.setText(page.properties.text);
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
                "var Class=parent._.fun.clone(parent.Class,null,10), _=parent._.clone(parent._,null,10), linb=parent._.clone(parent.linb,null,10);"+
                "var MSIE/*@cc_on =1@*/;"+
                "parent.sandbox=MSIE?this:{eval:function(s){return eval(s)}}"+
                "<\/script>"
            );
            txt=_.str.trim(txt);
            if((txt.charAt(0)=='{' || txt.slice(0,8)=='function') && txt.charAt(txt.length-1)=='}')
                txt='('+txt+')';
            try{
                sandbox.eval(txt);
            }catch(e){
                var line=e.line||e.lineNumber;
                alert((e.name?e.name+' : ':'') + (e.description||e.message||'') + (line?'\n line : '+line:'') );

                if(_.isNumb(line=parseInt(line))=='number'){
                    var inp=this.texteditor.getSubNode('INPUT').get(0),
                    str=inp.value,
                    l=str.length,
                    count=0,
                    from=0,
                    to=l;
                	for(var i=0;i<l;i++){
                		if(str.charAt(i)=='\n')
                		    count++;
                		if(count==line-1){
                		    count++;
                		    from=i;
                		}
                		if(count==line+1){
                		    to=i;
                		    break;
                		}
                	}
                	_.asyRun(function(){
                	    linb([inp]).caret(from+1,to);
                	    inp.scrollTop = from*14-inp.offsetHeight;
                    });
                }
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
            //self.texteditor.setUIValue(txt);
            self.texteditor.setValue(txt,true);

            //reset
            self._dirty=false;
            return self;
        },
        resetEnv:function(text){
            this._dirty=false;
            this.properties.text = text||txt.replace(/\r\n/g,'\n');
        },
        _texteditor_onKeyPress:function(profile, oV, nV){
            var self=this,
                ov = self._dirty,a,b,r=nV.replace(/\r\n/g,'\n');
            self._dirty = self.properties.text !== r;

            if(ov!=self._dirty)
                _.tryF(self.events.onValueChanged, [self, profile, self._dirty, r], self.host);
        },
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var t=this, n=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Pane)
            .host(t,"panel")
            .setDock("fill")
            );

            t.panel.append(
            (new u.ToolBar)
            .host(t,"toolbar")
            .setItems([{"id":"only","sub":[{"id":"format","caption":"$VisualJS.pageEditor.format","icon":'@CONF.img_app',"iconPos":"-32px -48px","type":"button","tips":"$VisualJS.pageEditor.formattips"},{"id":"check","caption":"$VisualJS.pageEditor.check","icon":'@CONF.img_app',"iconPos":"0 -48px","type":"button","tips":"$VisualJS.pageEditor.checktips"}]}])
            .onClick("_toolbar_onclick")
            );

            t.panel.append(
            (new u.TextEditor)
            .host(t,"texteditor")
            .setDock("fill")
            .onChange("_texteditor_onKeyPress")
            );

            return n;
            // ]]code created by jsLinb UI Builder
        }
        ,_toolbar_onclick: function(profile, item){
            var self=this;
            _.observableRun(function(){
                switch(item.id){
                    case 'format':
                        var code=linb.Coder.formatHTML(self.texteditor.getUIValue(), self.properties.checkType,['plain']);
                        var dialog = new linb.UI.Dialog();
                        dialog.setLeft(100).setTop(100).setWidth(300).setHeight(200).setStatus('max').setMinBtn(false).setMaxBtn(false).setCaption('$VisualJS.pageEditor.formatted')
                        .render();
                        dialog.setHtml(code);
                        dialog.show(linb('body'),true);
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