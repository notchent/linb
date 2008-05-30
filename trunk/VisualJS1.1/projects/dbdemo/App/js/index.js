Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        //"linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"
        required:["linb.UI.Button","linb.UI.Group","linb.UI.Div","linb.UI.Input","linb.UI.List"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Group)
            .host(t,"group")
            .setLeft(260)
            .setTop(70)
            .setWidth(340)
            .setHeight(270)
            .setCaption("record")
            .setDisplay('none')
            
            );
            
            t.group.attach(
            (new u.Input)
            .host(t,"inPhone")
            .setLeft(140)
            .setTop(100)
            .setWidth(160)
            .setDataBinder("dataBinder1")
            .setDataField("phone")
            );
            
            t.group.attach(
            (new u.Div)
            .host(t,"div14")
            .setLeft(20)
            .setTop(40)
            .setHeight(20)
            .setHtml("Company")
            .setCustomAppearance({"KEY":"text-align:right;"})
            );
            
            t.group.attach(
            (new u.Div)
            .host(t,"div13")
            .setLeft(20)
            .setTop(10)
            .setHeight(20)
            .setHtml("Name")
            .setCustomAppearance({"KEY":"text-align:right;"})
            );
            
            t.group.attach(
            (new u.Div)
            .host(t,"div15")
            .setLeft(20)
            .setTop(70)
            .setHeight(20)
            .setHtml("Title")
            .setCustomAppearance({"KEY":"text-align:right;"})
            );
            
            t.group.attach(
            (new u.Div)
            .host(t,"div16")
            .setLeft(20)
            .setTop(100)
            .setHeight(20)
            .setHtml("Phone Number")
            .setCustomAppearance({"KEY":"text-align:right;"})
            );
            
            t.group.attach(
            (new u.Div)
            .host(t,"div17")
            .setLeft(20)
            .setTop(130)
            .setHeight(20)
            .setHtml("Memo")
            .setCustomAppearance({"KEY":"text-align:right;"})
            );
            
            t.group.attach(
            (new u.Input)
            .host(t,"inName")
            .setLeft(140)
            .setTop(10)
            .setWidth(160)
            .setValueFormat("[^.*]")
            .setDataBinder("dataBinder1")
            .setDataField("name")
            );
            
            t.group.attach(
            (new u.Input)
            .host(t,"inCompany")
            .setLeft(140)
            .setTop(40)
            .setWidth(160)
            .setDataBinder("dataBinder1")
            .setDataField("company")
            );
            
            t.group.attach(
            (new u.Input)
            .host(t,"inTitle")
            .setLeft(140)
            .setTop(70)
            .setWidth(160)
            .setDataBinder("dataBinder1")
            .setDataField("title")
            );
            
            t.group.attach(
            (new u.Input)
            .host(t,"inMemo")
            .setLeft(140)
            .setTop(130)
            .setWidth(160)
            .setHeight(110)
            .setInputArea("textarea")
            .setDataBinder("dataBinder1")
            .setDataField("memo")
            );
            
            f(
            (new u.Button)
            .host(t,"btnNew")
            .setLeft(60)
            .setTop(360)
            .setWidth(70)
            .setCaption("New")
            .onClick("_btnnew_onclick")
            );
            
            f(
            (new u.Button)
            .host(t,"btnUpdate")
            .setLeft(380)
            .setTop(360)
            .setWidth(70)
            .setCaption("Update")
            .setDisplay('none')
            .onClick("_btnupdate_onclick")
            );
            
            f(
            (new u.List)
            .host(t,"list")
            .setLeft(60)
            .setTop(70)
            .setWidth(180)
            .setHeight(270)
            .setItems([])
            .onItemSelected("_list_onitemselected")
            );
            
            f(
            (new u.Button)
            .host(t,"btnDel")
            .setLeft(150)
            .setTop(360)
            .setWidth(70)
            .setCaption("Remove")
            .setDisplay('none')
            .onClick("_btndel_onclick")
            );
            
            f(
            (new u.Div)
            .host(t,"div23")
            .setLeft(250)
            .setTop(20)
            .setWidth(130)
            .setHeight(30)
            .setHtml("Contact Book")
            .setCustomAppearance({"KEY":"font-weight:bold;font-size:14px;color:blue;"})
            );
            
            return n;
            // ]]code created by designer
        },
        _onready:function (ns,threadid) {
            //set shortcut var
            window.SPA=ns;

            //get list
            linb.thread.asyUI(threadid,[function(threadid){
                linb.sajax(CONF.service,{
                    api:'list'
                },function(response){
                    linb.log(this);
                    var arr=[];
                    response.data.each(function(o){
                        arr.push({id:o.id, caption:o.name, _obj:o});
                    });
                    ns.list.setItems(arr,true);
                },function(msg){
                    alert('request raise err in "'+this.uri+'" with "'+this.queryString+'": "' + msg +'"');
                },threadid).start();
            }]);
        },
        _btnnew_onclick:function (profile, e, value) {
            
            SPA.editStatus='new';
            
            var db=linb.iDataBinder.getDataBinder('dataBinder1');
            db.resetValue();

            SPA.btnDel.setDisplay('none');
            SPA.btnUpdate.setDisplay('').setCaption('Create');
            SPA.group.setDisplay('').setCaption('Create new one');
            
            SPA.list.resetValue();
            delete SPA.$selItem;
        },
        _btndel_onclick:function (profile, e, value) {
            if(!SPA.$selItem || !SPA.$selItem.id)
                return;
            //del
            linb.thread.asyUI(null,[function(threadid){
                linb.sajax(CONF.service,{
                    api:'del',
                    id:SPA.$selItem.id
                },function(response){
                    linb.log(this);
                    SPA.list.removeItems([SPA.$selItem.id]);
                    
                    var db= linb.iDataBinder.getDataBinder('dataBinder1');
                    db.resetValue();

                    SPA.group.setDisplay('none');
                    SPA.btnUpdate.setDisplay('none');
                    SPA.btnDel.setDisplay('none');
                },function(msg){
                    alert('request raise err in "'+this.uri+'" with "'+this.queryString+'": "' + msg +'"');
                },threadid).start();
            }]);
        },
        _btnupdate_onclick:function (profile, e, value) {
            if(SPA.editStatus=='new'){
                
                if(!SPA.inName.getUIValue()){
                    alert('Specify name please');
                    SPA.inName.activate();
                    return;
                }
                var db=linb.iDataBinder.getDataBinder('dataBinder1'),
                    hash=db.getValue();

                hash.api='add';
                linb.thread.asyUI(null,[function(threadid){
                    linb.sajax(CONF.service,hash,function(response){
                        linb.log(this);
                        
                        hash.id=String(response.data[0]);
                        delete hash.api;
                        var h={id:hash.id, caption:hash.name, _obj:hash};
                        SPA.list.insertItems([h],null,false);
                        SPA.list.setValue(hash.id,true);

                        SPA.editStatus='udapte';
                        SPA._list_onitemselected(SPA.list.get(0), h);
                    },function(msg){
                        alert('request raise err in "'+this.uri+'" with "'+this.queryString+'": "' + msg +'"');
                    },threadid).start();
                }]);
            }else{
                var db=linb.iDataBinder.getDataBinder('dataBinder1'),
                    hash=db.getValue();

                hash.api='update';
                hash.id=SPA.$selItem.id;

                linb.thread.asyUI(null,[function(threadid){
                    linb.sajax(CONF.service,hash,function(response){
                        linb.log(this);
                        if(hash.name){
                            var profile=SPA.list.get(0),
                            item = profile.getItemByItemId(hash.id);
                            item.name=item._obj.name=hash.name;

                            profile.getSubNodeByItemId('ITEM',hash.id).html(hash.name, false);
                        }
                    },function(msg){
                        alert('request raise err in "'+this.uri+'" with "'+this.queryString+'": "' + msg +'"');
                    },threadid).start();
                }]);
            }
        },
        _list_onitemselected:function (profile, item, src) {
            SPA.$selItem = item;
            
            var db=linb.iDataBinder.getDataBinder('dataBinder1');
            db.resetValue(item._obj);
            
            SPA.group.setDisplay('');
            SPA.btnUpdate.setDisplay('');
            
            SPA.btnUpdate.setCaption('Update');
            SPA.group.setCaption('Record');
            SPA.btnDel.setDisplay('');
        },events:{"onReady":"_onready"}
    },
    Initialize: function(){
        window.CONF={
            service:"http://www.sigmawidgets.com/sigma_linb_crud_php_u/Controller.php"
        };
    }
});