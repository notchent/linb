//DataSource.Ajax
Class("linb.DataSource.Ajax","linb.DataSource",{
    Instance:{
        request:function(flag){
            var o, self=this, pro=this.profile, prop=pro.properties;
            linb.request((prop.$design?prop.$design+'/':'')+prop.url+'?'+_(), prop.queryString,function(str){
                o=_.unserialize(str);
                if(o===false){
                    var msg= 'Not valid JSON format!';
                    linb.message(msg);
                    if(flag)
                        prop.test = msg;
                }else{
                    if(flag)
                        linb.message(prop.test='Ajax reqeust OK');
                    prop.value=o;

                    self.responseToBinder(flag);
                    if(pro.onDataChanged)
                        self.onDataChanged(pro, prop.value);

                    pro.boxing().onRequestOK(pro, prop.value, flag);
                }
            },function(str){
                if(flag)
                    linb.message(prop.test = str);
                pro.boxing().onRequestFail(pro, str);
            },prop.threadid,_.clone(prop.args));
        },
        response:function(){
            var self=this.profile;
            //todo:
        }
    },
    Static:{
        DataModel:{
            url:{
                ini:''
            },
            queryString:'',
            asy:true,
            method:{
                ini:'GET',
                listbox:['GET','POST']
            },
            args:{ini:{}}
        }
    }
});
