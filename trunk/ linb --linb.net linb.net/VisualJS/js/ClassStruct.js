Class('VisualJS.ClassStruct', 'linb.Page',{
    Instance:{
        events:{
            afterCreated:function(page, threadid){
                _.asyCall('VisualJS.PageEditor' ,'show', [page.layoutFill, 'main',{
                    checkType:'js'
                },{
                    onValueChanged:function(ipagprofile, e, b){
                        //always true
                        _.tryF(page.events.onValueChanged, [ipagprofile, e, page.$dirty || b], page.host);
                    }
                }, page],
                false, threadid, function(){page.PageEditor=this});
            }
        },
        activate:function(){
            this.PageEditor.activate();
        },
        check:function(txt){
            return this.PageEditor.check(txt);
        },
        getText:function(){
            //get frm pageeditor
            var txt = this.PageEditor.getText(false);
            if(txt===false)return false;
            //check dirty
            if(this.$dirty || this.properties.temptext != txt){
                if(this.refer){
                    if(false === this.check(txt))return false;
                    //parse comments and code, check code in the process
                    var result = VisualJS.ClassTool.parseSingleBlock(txt);
                    if(false === result){
                        linb.message(linb.getStr('VisualJS.classtool.err1'));
                        return false;
                    }
                    //set back
                    this.properties.temptext = txt;

                    //set back and get new class text
                    this.refer.comments = result.comments;
                    this.refer.code = result.code;

                    txt = VisualJS.ClassTool.getCodeFromStruct(this.properties.clsStruct);
                    return this.properties.clsStruct.comments.replace(/^[\r\n]*/, '') + txt;
                }
            }
            return this.properties.text;
        },
        setText:function(txt, flag){
            txt=txt.replace(/\r\n/g,'\n');
            if(flag || this.properties.text != txt){
                this.properties.text = txt;
                var clsStruct = this.properties.clsStruct;
                var clsObject = this.properties.clsObject;
//linb.log('rebuild struct')
                var value=this.treebarClass.getUIValue();
                this.treebarClass.setValue(null,true);
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
                t=this.properties.clsStruct.sub;
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
                delete this.refer;

                this.treebarClass.setItems(items);
                if(value)
                    if(this.treebarClass.selectItem(value))
                        return this;
                 this.PageEditor.setText('').setReadonly(true);
            }
            this.resetEnv(txt);
            //this.PageEditor.setText(this.PageEditor.getText(),true)

            return this;
        },
        resetEnv:function(text){
            if(!text)text=this.getText();
            this.$dirty=false;
            this.properties.text = text;
            this.PageEditor.resetEnv(text);
        },
        _treebarclass_beforevalueupdated:function(profile, ov, nv){
            if(!this.refer)return;

            //get frm pageeditor
            var txt = this.PageEditor.getText();
            if(txt===false)return false;
            //check dirty
            if(this.properties.temptext != txt){
                if(false === this.check(txt))return false;
                //parse comments and code, check code in the process
                var result = VisualJS.ClassTool.parseSingleBlock(txt);
                if(false === result){
                    linb.message(linb.getStr('VisualJS.classtool.err1'));
                    return false;
                }

                //set back and get new class text
                this.refer.comments = result.comments;
                this.refer.code = result.code;

                //set dirty
                this.$dirty = true;
            }
        },
        _treebarclass_onitemselected:function(profile, item, node){
                if(!item.id)return;
                var value = item.id;
                var self=this;
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
                    pro = self.PageEditor.texteditor.reBoxing().getRegion(true);

                    linb.dom.fxProxy(t, pro
                        ,null,function(){
                            //keep old value
                            self.PageEditor.setText(self.properties.temptext = comments+code).activate();
                            self.PageEditor.setReadonly(value=='Class' || value=='Instance' || value=='Static')

                        },240,8,'inexp').start();
                    self.refer=o;
                    linb.thread.resume(threadid);
                });
        },
        base:['linb.UI'],
        required:[
            'linb.UI.Layout',
            'linb.UI.TreeBar',
            'linb.coder',
            'VisualJS.ClassTool',
            'VisualJS.PageEditor'
        ],
        parepareData:function(properties,events){
            events.afterShow=function(page){
                page.setText(page.properties.text, true);
            };
        },
        iniComponents:function(){
            this.nodes = [];
            var self=this;
            // [[designer
            //
            // layoutFill
            //
            //new linb.UI.Layout
            this.layoutFill = new linb.UI.Layout();
            //set name to layoutFill
            this.layoutFill.alias("layoutFill");
            //set properties
            this.layoutFill.host(this).setLeft(0).setTop(0).setItems([
            {
                "id" : "before",
                "pos" : "before",
                "locked" : false,
                "size" : 150,
                "min" : 50,
                "max" : 200,
                "cmd" : false
            }])
            .setType("horizontal");
            //
            //add layoutFill to parent node
            this.nodes.push(this.layoutFill.get(0));
            //
            // treebarClass
            //
            //new linb.UI.TreeBar
            this.treebarClass = new linb.UI.TreeBar();
            //set name to treebarClass
            this.treebarClass.alias("treebarClass");
            //set properties
            this.treebarClass.host(this).setLeft(0).setTop(0).setGroup(false).setItems([]).setIniFold(false);

            this.treebarClass.onItemSelected(this._treebarclass_onitemselected).beforeValueUpdated(this._treebarclass_beforevalueupdated);
            //
            //add treebarClass to parent node
            this.layoutFill.attach(this.treebarClass, 'before');


            // ]]designer
        }
    }
});

