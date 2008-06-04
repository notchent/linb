Class('VisualJS.ClassStruct', 'linb.Com',{
    Instance:{
        events:{
            afterShow:function(page){
                page.setText(page.properties.text, true);
            }
        },
        iniExComs:function(threadid){
            var self=this;
            linb.ComFactory.newCom('VisualJS.PageEditor',function(){
                var inn=this;
                inn.host = self;
                inn.setProperties({
                    checkType:'js'
                });
                inn.setEvents('onValueChanged',function(ipagprofile, e, b){
                    //always true
                    _.tryF(self.events.onValueChanged, [ipagprofile, e, self.$dirty || b], self.host);
                });
                inn.show(null,self.layoutFill,'main',threadid);

                self.PageEditor=inn;
            },threadid);
        },
        activate:function(){
            this.PageEditor.activate();
        },
        check:function(txt){
            return this.PageEditor.check(txt);
        },
        getText:function(){
            var self=this,
                p=self.properties,
                r=self.refer,
                //get frm pageeditor
                txt = self.PageEditor.getText(false);
            if(txt===false)return false;
            //check dirty
            if(self.$dirty || p.temptext != txt){
                if(r){
                    if(false === self.check(txt))return false;
                    //parse comments and code, check code in the process
                    var result = VisualJS.ClassTool.parseSingleBlock(txt);
                    if(false === result){
                        linb.message(linb.getRes('VisualJS.classtool.err1'));
                        return false;
                    }
                    //set back
                    p.temptext = txt;

                    //set back and get new class text
                    r.comments = result.comments;
                    r.code = result.code;

                    txt = VisualJS.ClassTool.getCodeFromStruct(p.clsStruct);
                    return p.clsStruct.comments.replace(/^[\r\n]*/, '') + txt;
                }
            }
            return p.text;
        },
        setText:function(txt, flag){
            var self=this,
                p=self.properties;

            txt=txt.replace(/\r\n/g,'\n');
            if(flag || p.text != txt){
                p.text = txt;
                var clsStruct = p.clsStruct,
                    clsObject = p.clsObject;
//linb.log('rebuild struct')
                    value=self.treebarClass.getUIValue()
                ;
                self.treebarClass.setValue(null,true);
                var items=[
                    {id:'Class',caption:'Class', caption:clsStruct.name, icon:'img/App.gif', iconPos:'-16px -48px', group:true, sub:[
                        {id:'Constructor',caption:'Constructor', icon:'img/App.gif', iconPos:'-32px -32px'},
                        {id:'Instance',caption:'Instance', icon:'img/App.gif', iconPos:'-16px -32px', sub:[]},
                        {id:'Static',caption:'Static',  icon:'img/App.gif', iconPos:'-16px -32px', sub:[]},
                        {id:'Initialize',caption:'Initialize', icon:'img/App.gif', iconPos:'-32px -32px'},
                        {id:'Before',caption:'Before', icon:'img/App.gif', iconPos:'-32px -32px'},
                        {id:'After',caption:'After', icon:'img/App.gif', iconPos:'-32px -32px'}
                ]}];

                var t,m,icon,j=items[0].sub;
                t=p.clsStruct.sub;
                if(t){
                    m=t.Instance;
                    if(m && (m = m.sub)){
                        _.each(m,function(o,i){
                            icon = 'img/App.gif';
                            iconPos = (typeof clsObject.Instance[i] == 'function')?'-32px -32px':'0 -32px';
                            if(_.isHash(clsObject.Instance[i]))icon = 'block.gif';
                            j[1].sub.push({id:'Instance.'+i, caption:i, icon:icon, iconPos:iconPos});
                        });
                    }
                    m=t.Static;
                    if(m && (m = m.sub)){
                        _.each(m,function(o,i){
                            icon = (typeof clsObject.Static[i] == 'function')?'function.gif':'property.gif';
                            if(_.isHash(clsObject.Static[i]))icon = 'block.gif';
                            j[2].sub.push({id:'Static.'+i, caption:i,  icon:'img/'+icon});
                        });
                    }
                }

                //reset
                delete self.refer;

                self.treebarClass.setItems(items);
                if(value)
                    if(self.treebarClass.selectItem(value))
                        return self;
                 self.PageEditor.setText(txt||'').setReadonly(true);
            }
            self.resetEnv(txt);
            //self.PageEditor.setText(self.PageEditor.getText(),true)

            return self;
        },
        resetEnv:function(text){
            var self=this;
            if(!text)text=self.getText();
            self.$dirty=false;
            self.properties.text = text;
            self.PageEditor.resetEnv(text);
        },
        _treebarclass_beforevalueupdated:function(profile, ov, nv){
            var self=this,
                p=self.PageEditor;
            if(!self.refer)return;

            //get frm pageeditor
            var txt = p.getText();
            if(txt===false)return false;
            //check dirty
            if(self.properties.temptext != txt){
                if(false === self.check(txt))return false;
                //parse comments and code, check code in the process
                var result = VisualJS.ClassTool.parseSingleBlock(txt);
                if(false === result){
                    linb.message(linb.getRes('VisualJS.classtool.err1'));
                    return false;
                }

                //set back and get new class text
                self.refer.comments = result.comments;
                self.refer.code = result.code;

                //set dirty
                self.$dirty = true;
            }
        },
        _treebarclass_onitemselected:function(profile, item, node){
                if(!item.id)return;
                var self=this,
                    p=self.PageEditor,
                    value = item.id;
                linb([node],false).UIAction(function(threadid){
                    var o=self.properties.clsStruct,t,m,arr;
                    var comments, code;
                    switch(value){
                        case 'Class':
                            code = VisualJS.ClassTool.getCodeFromStruct(o);
                            break;
                        case 'Static':
                        case 'Instance':
                        case 'Constructor':
                        case 'Initialize':
                        case 'Before':
                        case 'After':
                            o=o.sub;
                            if(o=o[value]){
                                if(o.sub)code = VisualJS.ClassTool.getCodeFromStruct(o);
                            }
                            break;
                        default:
                            o=o.sub;
                            arr = value.split('.');
                            o=o[arr[0]];
                            o=o.sub;
                            o=o[arr[1]];
                    }
                    comments = (o? (o.comments || '') :'');
                    //delete the first \n first
                    if(comments)comments = comments.replace(/^[\r\n]*/, '');
                    code = code || (o&&o.code) || '';

                    linb.thread.suspend(threadid);
                    var t = linb([node],false).getRegion(true),
                    pro = p.texteditor.reBoxing().getRegion(true);

                    linb.dom.fxProxy(t, pro
                        ,null,function(){
                            //keep old value
                            p.setText(self.properties.temptext = comments+code).activate();
                            p.setReadonly(value=='Class' || value=='Instance' || value=='Static')

                        },240,8,'inexp').start();
                    self.refer=o;
                    linb.thread.resume(threadid);
                });
        },
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Layout)
            .host(t,"layoutFill")
            .setLeft(0)
            .setTop(0)
            .setItems([
            {
                "id" : "before",
                "pos" : "before",
                "locked" : false,
                "size" : 150,
                "min" : 50,
                "max" : 200,
                "cmd" : false
            }])
            .setType("horizontal")
            );

            t.layoutFill.attach(
            (new u.TreeBar)
            .host(t,"treebarClass")
            .setLeft(0)
            .setTop(0)
            .setGroup(false)
            .setItems([])
            .setIniFold(false)
            .onItemSelected("_treebarclass_onitemselected")
            .beforeValueUpdated("_treebarclass_beforevalueupdated")
            ,'before');
            return n;
            // ]]code created by designer
        }
    }
});

