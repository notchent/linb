Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Layout","linb.UI.Stacks","linb.UI.Button","linb.UI.Dialog","linb.UI.Block","linb.UI.Div","linb.UI.Tabs","linb.UI.Group","linb.UI.Label","linb.UI.Gallery","linb.UI.TreeGrid","linb.UI.ComboInput","linb.UI.TextEditor","linb.UI.Input","linb.UI.ToolBar","linb.DataSource.Ajax","linb.DataSource.Memory"],
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            
            
            //this.ajax1 = (new linb.DataSource.Ajax)
            //."ajax1"host(t,)
            //.setUrl("App/js/Data/Orders.js")
            //.onRequestOK("_ajax1_onrequestok")
            //;
            //this.nodes.push(this.ajax1.get(0));
            
            return n;
            // ]]code creted by designer
        },
        _gallery3_onitemselected:function (profile, item, src) {

            if(item.id == "a"){

                this._hideAllButOne(this.formOrders);
                this.ajax1.request();

            }else if(item.id == "b"){
                linb.message("b");
                this._hideAllButOne(this.formCustomers);
            }else{
                linb.message("else");
                this._hideAllButOne(this.formPayments);
            }
        },
        _ajax1_onrequestok:function (profile, hash, flag) {

            this.ajax1.bind('ds').responseToBinder();
        },_hideAllButOne:function(form){
                this.formOrders.hide();
                this.formProducts.hide();
                this.formShipments.hide();
                this.formCustomers.hide();
                this.formPayments.hide();

                form.show(this.layout1.getPanel ("main"));
                form.setStatus("max");
        }
    }
});