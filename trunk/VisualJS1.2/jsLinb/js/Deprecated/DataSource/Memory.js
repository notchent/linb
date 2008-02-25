Class("linb.DataSource.Memory","linb.DataSource",{
    Instance:{
        request:function(flag){
            var pro=this.profile, prop = pro.properties, memory = prop.memory;
            if(memory){
                if(flag)
                    linb.message(prop.test='Memory reqeust OK');
                prop.value=_.clone(memory);

                this.responseToBinder(flag);
                if(pro.onDataChanged)
                    this.onDataChanged(pro, prop.value);

                this.onRequestOK(pro, prop.value, flag);
            }else{
                if(flag)
                    linb.message(prop.test = 'err');
                this.onRequestFail(pro,'No memory data exists!');
            }
        },
        response:function(){
            var self=this.profile;
            self.properties.memory = self.properties.value;
        }
    },
    Static:{
        DataModel:{
            memory:{ini:{}}
        }
    }
});
