Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        //"linb.Tips","linb.UI.Resizer","linb.UI.Border","linb.UI.Shadow"
        required:["linb.UI.Button", "linb.UI.Group", "linb.UI.Div", "linb.UI.Input", "linb.UI.List"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Button)
                .host(host,"btnUpdate")
                .setLeft(380)
                .setTop(360)
                .setWidth(70)
                .setDisplay("none")
                .setCaption("Update")
                .onClick("_btnupdate_onclick")
            );
            
            append((new linb.UI.Button)
                .host(host,"btnNew")
                .setLeft(60)
                .setTop(360)
                .setWidth(70)
                .setCaption("New")
                .onClick("_btnnew_onclick")
            );
            
            append((new linb.UI.List)
                .host(host,"list")
                .setItems([])
                .setLeft(60)
                .setTop(70)
                .setWidth(180)
                .setHeight(270)
                .onItemSelected("_list_onitemselected")
            );
            
            append((new linb.UI.Button)
                .host(host,"btnDel")
                .setLeft(150)
                .setTop(360)
                .setWidth(70)
                .setDisplay("none")
                .setCaption("Remove")
                .onClick("_btndel_onclick")
            );
            
            append((new linb.UI.Group)
                .host(host,"group")
                .setLeft(260)
                .setTop(70)
                .setWidth(340)
                .setHeight(270)
                .setDisplay("none")
                .setCaption("record")
            );
            
            host.group.append((new linb.UI.Div)
                .host(host,"div13")
                .setLeft(20)
                .setTop(10)
                .setHeight(20)
                .setHtml("Name")
                .setCustomStyle({"KEY":"text-align:right;"})
            );
            
            host.group.append((new linb.UI.Div)
                .host(host,"div14")
                .setLeft(20)
                .setTop(40)
                .setHeight(20)
                .setHtml("Company")
                .setCustomStyle({"KEY":"text-align:right;"})
            );
            
            host.group.append((new linb.UI.Div)
                .host(host,"div15")
                .setLeft(20)
                .setTop(70)
                .setHeight(20)
                .setHtml("Title")
                .setCustomStyle({"KEY":"text-align:right;"})
            );
            
            host.group.append((new linb.UI.Div)
                .host(host,"div16")
                .setLeft(20)
                .setTop(100)
                .setHeight(20)
                .setHtml("Phone Number")
                .setCustomStyle({"KEY":"text-align:right;"})
            );
            
            host.group.append((new linb.UI.Div)
                .host(host,"div17")
                .setLeft(20)
                .setTop(130)
                .setHeight(20)
                .setHtml("Memo")
                .setCustomStyle({"KEY":"text-align:right;"})
            );
            
            host.group.append((new linb.UI.Input)
                .host(host,"inName")
                .setDataBinder("dataBinder1")
                .setDataField("name")
                .setLeft(140)
                .setTop(10)
                .setWidth(160)
                .setValueFormat("[^.*]")
            );
            
            host.group.append((new linb.UI.Input)
                .host(host,"inCompany")
                .setDataBinder("dataBinder1")
                .setDataField("company")
                .setLeft(140)
                .setTop(40)
                .setWidth(160)
            );
            
            host.group.append((new linb.UI.Input)
                .host(host,"inTitle")
                .setDataBinder("dataBinder1")
                .setDataField("title")
                .setLeft(140)
                .setTop(70)
                .setWidth(160)
            );
            
            host.group.append((new linb.UI.Input)
                .host(host,"inPhone")
                .setDataBinder("dataBinder1")
                .setDataField("phone")
                .setLeft(140)
                .setTop(100)
                .setWidth(160)
            );
            
            host.group.append((new linb.UI.Input)
                .host(host,"inMemo")
                .setDataBinder("dataBinder1")
                .setDataField("memo")
                .setLeft(140)
                .setTop(130)
                .setWidth(160)
                .setHeight(110)
                .setMultiLines(true)
            );
            
            append((new linb.UI.Div)
                .host(host,"div23")
                .setLeft(250)
                .setTop(20)
                .setWidth(130)
                .setHeight(30)
                .setHtml("Contact Book")
                .setCustomStyle({"KEY":"font-weight:bold;font-size:14px;color:blue;"})
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _onready:function (ns,threadid) {
            //set shortcut var
            window.SPA=ns;

            //get list
            linb.Thread.observableRun(threadid,[function(threadid){
                linb.SAjax(CONF.service,{
                    api:'list'
                },function(response){
                    linb.log(this);
                    var arr=[];
                    _.arr.each(response.data,function(o){
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

            var db=linb.DataBinder.getFromName('dataBinder1');
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
            linb.Thread.observableRun(null,[function(threadid){
                linb.SAjax(CONF.service,{
                    api:'del',
                    id:SPA.$selItem.id
                },function(response){
                    linb.log(this);
                    SPA.list.removeItems([SPA.$selItem.id]);

                    var db= linb.DataBinder.getFromName('dataBinder1');
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
                var db=linb.DataBinder.getFromName('dataBinder1'),
                    hash=db.getValue();

                hash.api='add';
                linb.Thread.observableRun(null,[function(threadid){
                    linb.SAjax(CONF.service,hash,function(response){
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
                var db=linb.DataBinder.getFromName('dataBinder1'),
                    hash=db.getValue();

                hash.api='update';
                hash.id=SPA.$selItem.id;

                linb.Thread.observableRun(null,[function(threadid){
                    linb.SAjax(CONF.service,hash,function(response){
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

            var db=linb.DataBinder.getFromName('dataBinder1');
            db.resetValue(item._obj);

            SPA.group.setDisplay('');
            SPA.btnUpdate.setDisplay('');

            SPA.btnUpdate.setCaption('Update');
            SPA.group.setCaption('Record');
            SPA.btnDel.setDisplay('');
        }, events:{"onReady":"_onready"}
    }, 
    Initialize: function(){
        window.CONF={
            service:"http://www.sigmawidgets.com/sigma_linb_crud_php_u/Controller.php"
        };
    }
});