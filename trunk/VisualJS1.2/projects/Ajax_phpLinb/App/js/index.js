Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        events:{"onReady":"_onready"},
        required:["linb.UI.Div","linb.UI.Input","linb.UI.Button"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Button)
            .host(t,"btnAjaxPost")
            .setLeft(270)
            .setTop(350)
            .setCaption("ajax post")
            .onClick("_btnajaxpost_onclick")
            );
            
            f(
            (new u.Input)
            .host(t,"request")
            .setValue("{\n    key:'test',\n    para:{\n        p1:'client_set'\n    }\n}")
            .setLeft(140)
            .setTop(230)
            .setWidth(400)
            .setHeight(110)
            .setInputArea("textarea")
            );
            
            f(
            (new u.Button)
            .host(t,"btnSAjax")
            .setLeft(140)
            .setTop(390)
            .setCaption("sajax")
            .onClick("_btnsajax_onclick")
            );
            
            f(
            (new u.Button)
            .host(t,"btnIAjaxGet")
            .setLeft(140)
            .setTop(420)
            .setCaption("iajax get")
            .onClick("_btniajaxget_onclick")
            );
            
            f(
            (new u.Div)
            .host(t,"divTable")
            .setLeft(40)
            .setTop(20)
            .setWidth(580)
            .setHeight(180)
            );
            
            f(
            (new u.Div)
            .host(t,"div20")
            .setLeft(40)
            .setTop(270)
            .setWidth(90)
            .setHeight(20)
            .setHtml("Request data : ")
            );
            
            f(
            (new u.Input)
            .host(t,"response")
            .setLeft(140)
            .setTop(450)
            .setWidth(400)
            .setHeight(90)
            .setInputArea("textarea")
            .setReadonly(true)
            );
            
            f(
            (new u.Div)
            .host(t,"div35")
            .setLeft(40)
            .setTop(490)
            .setWidth(90)
            .setHeight(20)
            .setHtml("Response data : ")
            );
            
            f(
            (new u.Button)
            .host(t,"btnIAjaxPost")
            .setLeft(270)
            .setTop(420)
            .setCaption("iajax post")
            .onClick("_btniajaxpost_onclick")
            );
            
            f(
            (new u.Button)
            .host(t,"btnAjaxGet")
            .setLeft(140)
            .setTop(350)
            .setCaption("ajax get")
            .onClick("_btnajaxget_onclick")
            );
            
            f(
            (new u.Div)
            .host(t,"div86")
            .setLeft(50)
            .setTop(200)
            .setWidth(460)
            .setHeight(20)
            .setHtml("Use firebug or fiddler to monitor the request/response data please!")
            );
            
            return n;
            // ]]code created by designer
        },
        _onready:function () {
            this.divTable.setHtml('<iframe src="table.html" frameborder=0 style="width:100%;height:100%"></iframe>');
        },
        getRequest:function(){
            var value=this.request.updateValue().getValue(),
                hash=_.unserialize(value);
            return hash;
        },
        setResponse:function(value){
            this.response.setValue(_.serialize(value.data[0]));
        },
        _btnajaxget_onclick:function (profile, e, value) {
            var ns=this, hash=ns.getRequest();
            if(!hash)return;

            //for show busy cursor
            linb.thread.asyUI(null,[function(threadid){
                linb.ajax('request.php',hash, function(response){
                        linb.log(this);
                        //set to respose input
                        ns.setResponse(_.unserialize(response));
                    }, function(msg){
                        alert('request raise err in "'+this.uri+'" with "'+this.queryString+'": "' + msg +'"');
                    },
                threadid).start();
            }]);
        },
        _btnajaxpost_onclick:function (profile, e, value) {
            var ns=this, hash=ns.getRequest();
            if(!hash)return;

            //for show busy cursor
            linb.thread.asyUI(null,[function(threadid){
                linb.ajax('request.php',hash, function(response){
                        linb.log(this);
                        //set to respose input
                        ns.setResponse(_.unserialize(response));
                    }, function(msg){
                        alert('request raise err in "'+this.uri+'" with "'+this.queryString+'": "' + msg +'"');
                    },
                threadid,{method:'POST'}).start();
            }]);
        },
        _btnsajax_onclick:function (profile, e, value) {
            var ns=this, hash=ns.getRequest();
            if(!hash)return;

            //for show busy cursor
            linb.thread.asyUI(null,[function(threadid){
                linb.sajax('request.php',hash, function(response){
                        linb.log(this);
                        //set to respose input
                        ns.setResponse(response);
                    }, function(msg){
                        alert('request raise err in "'+this.uri+'" with "'+this.queryString+'": "' + msg +'"');
                    },
                threadid).start();
            }]);
        },
        _btniajaxget_onclick:function (profile, e, value) {
            var ns=this, hash=ns.getRequest();
            if(!hash)return;

            //for show busy cursor
            linb.thread.asyUI(null,[function(threadid){
                linb.iajax('request.php',hash, function(response){
                        linb.log(this);
                        //set to respose input
                        ns.setResponse(_.unserialize(response));
                    }, function(msg){
                        alert('request raise err in "'+this.uri+'" with "'+this.queryString+'": "' + msg +'"');
                    },
                threadid).start();
            }]);
        },
        _btniajaxpost_onclick:function (profile, e, value) {
            var ns=this, hash=ns.getRequest();
            if(!hash)return;

            //for show busy cursor
            linb.thread.asyUI(null,[function(threadid){
                linb.iajax('request.php',hash, function(response){
                        linb.log(this);
                        //set to respose input
                        ns.setResponse(_.unserialize(response));
                    }, function(msg){
                        alert('request raise err in "'+this.uri+'" with "'+this.queryString+'": "' + msg +'"');
                    },
                threadid,{method:'POST'}).start();
            }]);
        }
    }
});