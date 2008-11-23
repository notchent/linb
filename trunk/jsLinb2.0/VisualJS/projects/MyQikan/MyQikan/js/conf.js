 CONF={

     //默认为中文
     dftLang:'cn',

     //静态json数据server路径
     staticServer : 'http://rss.qikan.com/js/',
     //staticServer : 'http://my.qikan.com/my/js/',
     //静态json数据randkey的前缀，加id构成randkey
     cacheServer : 'http://rss.qikan.com/js/cache/',
     staticIDTag : '-',
     //静态server文件夹下的默认下级列表数据文件名
     staticDftName : 'list.js',
     //静态缓存的API
     staticAPIs : {
         "MyQikan.Mag.list":1
     },

     feedbackPath:'http://my.qikan.com/api/sendemail.aspx',

     path_how2tz:'http://my.qikan.com/how2tz.html',
     path_demo:'http://my.qikan.com/demo.html',

     maxListCount:200,
     maxTopics:10,
     maxModules:30,

     //api server 的服务地址
     apiServer : 'http://my.qikan.com/api/portal.aspx',

     //rss/atom server 的服务地址
     //apiProxy : 'http://my.qikan.com/api/proxy.aspx',
     //api版本号
     //apiVer : '1.0',

    //数据请求的过期时间
    rqtTimeout:30000,
    //数据请求的重试次数
    rqtRetryTime:0,

    module_page_count:8,

    //host服务器设置的cookie过期时间
    cookieExpired: 365,

    //组件定义
    ComFactoryProfile:{
        _iniMethod:'create'
    },

    IniDataHander:function(){
        var t=CONF.rqtRetryTime,
            tt=CONF.rqtTimeout,
            events={
                beforeStart : function(){
                    var self=this,v;
                    linb.log('request data from server', self);
                    //linb.Dom.setCover(linb.getRes('app.requestMessage'));
                },
                beforeSuccess : function(response){
                    var self=this, map={
                        '010':1,
                        '011':1,
                        '012':1,
                        '013':1,
                        '014':1,
                        '015':1
                    };
                    if(self.rspType=='script')return;
                    linb.log('server response' , response);
                    if(response.res!='ok'){
                        var s= linb.getRes('app.err.'+response.errorid,response.msg);
                        //to no login status
                        if(map[response.errorid]){
                            SPA.clearCookies();
                            SPA.refreshUI();
                        }

                        if(self.showErr)
                            self.showErr(s);
                        else
                            SPA.Alert(s);
                    }
                },
                beforeFail : function(msg, threadid){
                    linb.log('request data fail', msg, this);
                    linb.message(linb.getRes('app.serverErr'))
                }
            };
        Class('MyQikan.sajax', 'linb.SAjax',{
            Static:{
                retry : t,
                timeout : tt,
                customQS : function(obj){
                    var c=this.constructor, k=c.randkey, b=c.callback;
                    //for script file
                    if(this.rspType=='script'){
                        //from static file
                        if(typeof obj=='string')
                            return null;
                        else{
                            if(obj.$id){
                                this.id=obj.$id;
                                delete obj.$id;
                            }
                            return obj;
                        }
                    }else{
                        if(typeof obj=='string')
                            //get from static file or service
                            return obj.$id?null:(obj && obj + '&') + k + '=' + this.id + '&' + b + '=MyQikan.sajax.response' + SPA.getAuthStr();
                        else{
                            //get from static file
                            if(obj.$id){
                                this.id=obj.$id;
                                delete obj.$id;
                                return null;
                            }else{
                                obj[b]="MyQikan.sajax.response";
                                obj[k]=this.id;
                                obj.qk_token=SPA.getCookie('qk_token');
                                obj.qk_email=SPA.getCookie('qk_email');
                                return obj;
                            }
                        }
                    }
                },
                events : events
            }
        });
        //仅仅用在登陆
        Class('MyQikan.iajax', 'linb.IAjax',{
            Static:{
                retry : t,
                timeout : tt,
                customQS : function(obj){
                    var c=this.constructor;
                    this.uri= this.uri.split('?')[0]+"?api="+obj.api+"&randkey="+this.id+"&tpl="+c.getDummyRes();
                    obj.method='ipost';
                    return obj;
                },
                events : events
            }
        });
    }
 };