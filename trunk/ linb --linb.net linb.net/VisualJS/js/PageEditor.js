/*
An editor for html
*/
Class('VisualJS.PageEditor', 'linb.Page',{
    Instance:{
        base:['linb.UI'],
        required:[
            'linb.UI.Panel',
            'linb.UI.List',
            'linb.UI.Dialog',
            'linb.UI.TextEditor',
            'linb.UI.ToolBar',
            'linb.coder'
        ],
        eval2:function(txt){
            var r=true;
            var iframe = document.createElement("iframe");
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
            var txt = this.texteditor.getUIValue().replace(/\r\n/g,'\n');
            if(this.properties.text != txt){
                if(false!==flag)
                    if(this.check(txt)===false)return false;
                return txt;
            }else
                return this.properties.text;
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
            txt = txt||'';
            this.properties.text = txt.replace(/\r\n/g,'\n');
            //this.texteditor.updateUIValue(txt);
            this.texteditor.setValue(txt,true);

            //reset
            this._dirty=false;
            return this;
        },
        resetEnv:function(text){
            this._dirty=false;
            this.properties.text = text||txt.replace(/\r\n/g,'\n');
        },
        _texteditor_onKeyPress:function(profile, e, src){
            var ov = this._dirty,a,b,r=src.value.replace(/\r\n/g,'\n');

            this._dirty = this.properties.text !== r;
            if(ov!=this._dirty)
                _.tryF(this.events.onValueChanged, [this, profile, this._dirty, r], this.host);
        },
        _toolbar_onclick : function(profile, id){
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
                            linb.message(linb.getStr('VisualJS.checkOK'));
                        break;
                }
            });
        },
        /*
        */
        parepareData:function(properties,events){
            events.afterShow=function(page){
                if(page.properties.checkType!='js')
                    page.toolbar.hideItem('check');
                page.setText(page.properties.text);
            };
        },
        iniComponents:function(){
            this.nodes = [];
            var self=this;
            // [[designer
            //

            //
            // panel
            //
            //new linb.UI.Panel
            this.panel = new linb.UI.Panel();
            //set name to panel
            this.panel.alias("panel");
            //set properties
            this.panel.setDock('fill');
            //
            //add dialogMain to parent node
            this.nodes.push(this.panel.get(0));
            //
            // toolbar
            //
            //new linb.UI.ToolBar
            this.toolbar = new linb.UI.ToolBar();
            //set name to toolbar
            this.toolbar.alias("toolbar");
            //set properties
            this.toolbar.host(this).setItems([{id:'only', sub:[{
                "id" : "format",
                "caption" : "$VisualJS.pageEditor.format",
                "icon" : "img/App.gif",
                "iconPos":"-32px -48px",
                "type" : "button",
                "tips" : "$VisualJS.pageEditor.formattips"
            },{
                "id" : "check",
                "caption" : "$VisualJS.pageEditor.check",
                "icon" : "img/App.gif",
                "iconPos":"0 -48px",
                "type" : "button",
                "tips" : "$VisualJS.pageEditor.checktips"
            }]}]).onClick('_toolbar_onclick');
            //
            this.panel.attach(this.toolbar);
            //
            //
            // texteditor
            //
            //new linb.UI.TextEditor
            this.texteditor = new linb.UI.TextEditor();
            //set name to texteditor
            this.texteditor.host(this).alias("texteditor").onKeyPress('_texteditor_onKeyPress');
            //set properties
            this.texteditor.setDock("fill");
            //
            //add dialogMain to parent node
            this.panel.attach(this.texteditor);//

            // ]]designer

            return this.nodes;
        }
    }
});