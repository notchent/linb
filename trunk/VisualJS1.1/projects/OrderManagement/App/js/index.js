
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        //"linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"
        required:["linb.UI.Block","linb.UI.Div","linb.UI.Stacks","linb.UI.Button","linb.UI.PanelBar","linb.UI.Dialog","linb.UI.Label","linb.UI.TextEditor","linb.UI.TreeGrid","linb.UI.CheckBox","linb.UI.PageBar","linb.UI.ComboInput","linb.UI.Input","linb.UI.Group","linb.UI.Tabs","linb.UI.DatePicker"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Block)
            .host(t,"block1")
            .setDock("top")
            .setBorder(true)
            );
            
            t.block1.attach(
            (new u.Div)
            .host(t,"div18")
            .setLeft(10)
            .setTop(10)
            .setHeight(80)
            .setHtml("<img src='img/001.gif'>")
            );
            
            t.block1.attach(
            (new u.Div)
            .host(t,"div19")
            .setLeft(80)
            .setTop(20)
            .setWidth(470)
            .setHeight(70)
            .setHtml("<font size=8>Order Management</font>")
            );
            
            f(
            (new u.Block)
            .host(t,"block3")
            .setDock("left")
            .setBorder(true)
            .setWidth(160)
            );
            
            t.block3.attach(
            (new u.Stacks)
            .host(t,"stacks1")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"Task","tips":"Task - Orders - Customers","icon":"img/module.gif"},{"id":"b","caption":"Set up","tips":"item b","icon":"img/module.gif"},{"id":"c","caption":"About","tips":"item c","icon":"img/module.gif"}])
            );
            
            t.stacks1.attach(
            (new u.Button)
            .host(t,"button13")
            .setLeft(10)
            .setTop(60)
            .setCaption("Customers")
            .setWidth(110)
            .setHeight(30)
            .setIcon("img/customer.gif")
            .setBorder(true)
            .onClick("_button13_onclick")
            , 'a');
            
            t.stacks1.attach(
            (new u.Label)
            .host(t,"label67")
            .setLeft(10)
            .setTop(10)
            .setWidth(110)
            .setCaption("Not implemented")
            .setHAlign("left")
            , 'b');
            
            t.stacks1.attach(
            (new u.Div)
            .host(t,"div22")
            .setLeft(10)
            .setTop(10)
            .setWidth(130)
            .setHtml("<font color=red>All copy right reserved<br>Sigmasoft<br>2005-2008</font>")
            , 'c');
            
            t.stacks1.attach(
            (new u.Button)
            .host(t,"button12")
            .setLeft(10)
            .setTop(20)
            .setCaption("Orders")
            .setWidth(110)
            .setHeight(30)
            .setPosition("relative")
            .setDisplay("block")
            .setIcon("img/order.gif")
            .setBorder(true)
            .setVAlign("middle")
            .onClick("_button12_onclick")
            , 'a');
            
            f(
            (new u.Block)
            .host(t,"block6")
            .setDock("fill")
            .setLeft(450)
            .setTop(310)
            .setBorder(true)
            );
            
            t.block6.attach(
            (new u.PanelBar)
            .host(t,"dialog7")
            .setLeft(0)
            .setTop(0)
            .setCaption("Orders")
            .setIcon("img/order.gif")
            );
            
            t.dialog7.attach(
            (new u.Label)
            .host(t,"label9")
            .setLeft(370)
            .setTop(380)
            .setCaption("Sale Tax:")
            .setHAlign("left")
            .setWidth(100)
            );
            
            t.dialog7.attach(
            (new u.Label)
            .host(t,"label6")
            .setLeft(370)
            .setTop(80)
            .setCaption("PO Number:")
            .setHAlign("left")
            .setWidth(110)
            );
            
            t.dialog7.attach(
            (new u.Label)
            .host(t,"label10")
            .setLeft(370)
            .setTop(50)
            .setCaption("Order Date:")
            .setHAlign("left")
            .setWidth(140)
            );
            
            t.dialog7.attach(
            (new u.Label)
            .host(t,"label37")
            .setLeft(30)
            .setTop(350)
            .setCaption("Sale Tax Rate")
            .setHAlign("left")
            .setWidth(100)
            );
            
            t.dialog7.attach(
            (new u.Label)
            .host(t,"label14")
            .setLeft(370)
            .setTop(320)
            .setCaption("Order Subtotal:")
            .setWidth(110)
            .setHAlign("left")
            );
            
            t.dialog7.attach(
            (new u.Label)
            .host(t,"label4")
            .setLeft(30)
            .setTop(320)
            .setCaption("Ship Date:")
            .setWidth(110)
            .setHAlign("left")
            );
            
            t.dialog7.attach(
            (new u.Label)
            .host(t,"Sales Tax:")
            .setLeft(370)
            .setTop(350)
            .setCaption("Shipping & Handle:")
            .setHAlign("left")
            .setWidth(120)
            );
            
            t.dialog7.attach(
            (new u.Label)
            .host(t,"label38")
            .setLeft(370)
            .setTop(410)
            .setCaption("Order total:")
            .setWidth(110)
            .setHAlign("left")
            );
            
            t.dialog7.attach(
            (new u.Label)
            .host(t,"label11")
            .setLeft(30)
            .setTop(20)
            .setCaption("Customer:")
            .setHAlign("left")
            );
            
            t.dialog7.attach(
            (new u.Label)
            .host(t,"label8")
            .setLeft(30)
            .setTop(50)
            .setCaption("Ship Method:")
            .setHAlign("left")
            .setWidth(110)
            );
            
            t.dialog7.attach(
            (new u.Label)
            .host(t,"label13")
            .setLeft(370)
            .setTop(20)
            .setCaption("Order ID:")
            .setHAlign("left")
            );
            
            t.dialog7.attach(
            (new u.Label)
            .host(t,"label7")
            .setLeft(30)
            .setTop(80)
            .setCaption("Employee:")
            .setHAlign("left")
            .setWidth(120)
            );
            
            t.dialog7.attach(
            (new u.ComboInput)
            .host(t,"cbi_orders_employee")
            .setLeft(130)
            .setTop(80)
            .setWidth(140)
            .setItems([{"id":"a","caption":"Cok,Oliver"},{"id":"b","caption":"Jimi,Larry"},{"id":"c","caption":"Steven, Du"},{"id":"d","caption":"Tracy, Tang"}])
            .setValue(null)
            .setReadonly(true)
            .setType("listbox")
            .setDataBinder('order')
            .setDataField("employee")
            );
            
            t.dialog7.attach(
            (new u.Input)
            .host(t,"ipt_orders_tax_rate")
            .setLeft(130)
            .setTop(350)
            .setWidth(140)
            .setDataBinder('order')
            .setDataField("tax_rate")
            );
            
            t.dialog7.attach(
            (new u.Input)
            .host(t,"ipt_orders_tax")
            .setLeft(480)
            .setTop(380)
            .setWidth(140)
            .setDisabled(true)
            );
            
            t.dialog7.attach(
            (new u.CheckBox)
            .host(t,"cbi_shipment_received")
            .setLeft(30)
            .setTop(380)
            .setCaption("Shipment Received")
            .setWidth(150)
            .setDataBinder('order')
            .setDataField("shipment_received")            
            );
            
            t.dialog7.attach(
            (new u.TreeGrid)
            .host(t,"tgd_orders_details")
            .setDock("none")
            .setLeft(30)
            .setTop(200)
            .setWidth(590)
            .setHeight(110)
            .setHeader([{"id":"col1","caption":"Product","type":"input","width":120},{"id":"col4","caption":"quantity","type":"input","width":100},{"id":"col2","caption":"Unit Price","type":"number","format":"^-?\\d\\d*$","width":100},{"id":"col3","caption":"Discount","type":"number","format":"^-?\\d\\d*$","width":100},{"id":"col5","caption":"Tatal Price","type":"number","format":"^-?\\d\\d*$","width":120}])
            .setRows([{"id":"row1","cells":[{"value":"cell11"},{"value":"cell12"}]},{"id":"row2","cells":[{"value":"cell21","type":"label"},{"value":"cell22"}],"sub":[{"id":"row21","cells":["cell31",{"value":"cell32","type":"number"}]}]}])
            );
            
            t.dialog7.attach(
            (new u.ComboInput)
            .host(t,"dpi_orders_ship_date")
            .setLeft(130)
            .setTop(320)
            .setWidth(140)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setDataBinder('order')
            .setType("datepicker")
            );
            
            t.dialog7.attach(
            (new u.Input)
            .host(t,"ipt_orders_po_number")
            .setLeft(480)
            .setTop(80)
            .setWidth(140)
            .setDataBinder('order')
            .setDataField("po_number")
            );
            
            t.dialog7.attach(
            (new u.Input)
            .host(t,"ipt_orders_subtotal")
            .setLeft(480)
            .setTop(320)
            .setWidth(140)
            .setDisabled(true)
            );
            
            t.dialog7.attach(
            (new u.PageBar)
            .host(t,"pagebar1")
            .setLeft(30)
            .setTop(420)
            .setWidth(190)
            .setHeight(20)
            .setValue("1:1:3")
            .setCaption("<font color=red>Click No To See Orders</font>")
            .onClick("_pagebar1_onclick")
            );
            
            t.dialog7.attach(
            (new u.Input)
            .host(t,"ipt_orders_order_date")
            .setLeft(480)
            .setTop(50)
            .setWidth(140)
            .setDataBinder('order')
            .setDataField("order_date")
            );
            
            t.dialog7.attach(
            (new u.Input)
            .host(t,"ipt_orders_order_id")
            .setLeft(480)
            .setTop(20)
            .setWidth(140)
            .setDataBinder('order')
            .setDataField("order_id")
            );
            
            t.dialog7.attach(
            (new u.ComboInput)
            .host(t,"cbi_orders_customer")
            .setLeft(130)
            .setTop(20)
            .setWidth(140)
            .setItems([{"id":"1","caption":"Mike,Silla"},{"id":"2","caption":"Rose,Kim"},{"id":"3","caption":"Betty,Jin"}])
            .setReadonly(true)
            .setType("listbox")
            .setDataBinder('order')
            .setDataField("customer")
            );
            
            t.dialog7.attach(
            (new u.ComboInput)
            .host(t,"cbi_orders_ship_method")
            .setLeft(130)
            .setTop(50)
            .setWidth(140)
            .setItems([{"id":"1","caption":"Federal Express"},{"id":"2","caption":"UPS Ground"},{"id":"3","caption":"UPS Mail"}])
            .setValue(null)
            .setReadonly(true)
            .setType("listbox")
            .setDataBinder('order')
            .setDataField("shipment")
            );
            
            t.dialog7.attach(
            (new u.Input)
            .host(t,"ipt_orders_total")
            .setLeft(480)
            .setTop(410)
            .setWidth(140)
            .setDisabled(true)
            );
            
            t.dialog7.attach(
            (new u.Input)
            .host(t,"ipt_orders_handle")
            .setLeft(480)
            .setTop(350)
            .setWidth(140)            
            .setDataBinder('order')
            .setDataField("handle")            
            );
            
            t.dialog7.attach(
            (new u.Group)
            .host(t,"group1")
            .setLeft(30)
            .setTop(100)
            .setWidth(590)
            .setHeight(90)
            .setCaption("Notes")
            );
            
            t.group1.attach(
            (new u.TextEditor)
            .host(t,"texteditor8")
            .setDock("fill")
            .setLeft(470)
            .setTop(10)
            .setCaption("texteditor8")
            .setBorder(true)
            );
            
            t.block6.attach(
            (new u.PanelBar)
            .host(t,"dialog14")
            .setLeft(0)
            .setTop(0)
            .setCaption("Customers")
            .setIcon("img/customer.gif")
            );
            
            t.dialog14.attach(
            (new u.Tabs)
            .host(t,"tabs2")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"a","caption":"Customer","tips":"Customer Info"},{"id":"b","caption":"Order Summary & Details","tips":"Order Info"}])
            .setDockMargin({"left":4,"top":4,"right":4,"bottom":4})
            );
            
            t.tabs2.attach(
            (new u.Label)
            .host(t,"label52")
            .setLeft(20)
            .setTop(140)
            .setWidth(110)
            .setCaption("Bill Address:")
            .setHAlign("left")
            , 'a');
            
            t.tabs2.attach(
            (new u.Label)
            .host(t,"label46")
            .setLeft(330)
            .setTop(80)
            .setWidth(110)
            .setCaption("Fax Number:")
            .setHAlign("left")
            , 'a');
            
            t.tabs2.attach(
            (new u.Label)
            .host(t,"label45")
            .setLeft(330)
            .setTop(110)
            .setWidth(110)
            .setCaption("Notes:")
            .setHAlign("left")
            , 'a');
            
            t.tabs2.attach(
            (new u.Label)
            .host(t,"label44")
            .setLeft(20)
            .setTop(20)
            .setWidth(110)
            .setCaption("Company Name:")
            .setHAlign("left")
            , 'a');
            
            t.tabs2.attach(
            (new u.Label)
            .host(t,"label49")
            .setLeft(20)
            .setTop(80)
            .setWidth(110)
            .setCaption("Last Name:")
            .setHAlign("left")
            , 'a');
            
            t.tabs2.attach(
            (new u.Label)
            .host(t,"label50")
            .setLeft(20)
            .setTop(50)
            .setWidth(110)
            .setCaption("First Name:")
            .setHAlign("left")
            , 'a');
            
            t.tabs2.attach(
            (new u.Label)
            .host(t,"label47")
            .setLeft(330)
            .setTop(20)
            .setWidth(110)
            .setCaption("Web Site:")
            .setHAlign("left")
            , 'a');
            
            t.tabs2.attach(
            (new u.Label)
            .host(t,"label51")
            .setLeft(20)
            .setTop(250)
            .setWidth(110)
            .setCaption("Shipments Address:")
            .setHAlign("left")
            , 'a');
            
            t.tabs2.attach(
            (new u.Label)
            .host(t,"label48")
            .setLeft(20)
            .setTop(110)
            .setWidth(110)
            .setCaption("Email:")
            .setHAlign("left")
            , 'a');
            
            t.tabs2.attach(
            (new u.Label)
            .host(t,"label43")
            .setLeft(330)
            .setTop(50)
            .setWidth(110)
            .setCaption("Phone Number")
            .setHAlign("left")
            , 'a');
            
            t.tabs2.attach(
            (new u.Input)
            .host(t,"ipt_customer_company")
            .setLeft(140)
            .setTop(20)
            .setWidth(170)
            , 'a');
            
            t.tabs2.attach(
            (new u.Input)
            .host(t,"ipt_customer_email")
            .setLeft(140)
            .setTop(110)
            .setWidth(170)
            , 'a');
            
            t.tabs2.attach(
            (new u.Group)
            .host(t,"group7")
            .setLeft(10)
            .setTop(10)
            .setWidth(600)
            .setHeight(150)
            .setCaption("Orders - Double Click Row Header To See Details")
            , 'b');
            
            t.group7.attach(
            (new u.TreeGrid)
            .host(t,"treegrid14")
            .setDockMargin({"left":4,"top":4,"right":4,"bottom":4})
            .setHeader([{"id":"col1","caption":"Order ID","type":"input","width":160},{"id":"col4","caption":"Ship Method","type":"input","width":100},{"id":"col2","caption":"Order Date","type":"number","format":"^-?\\d\\d*$","width":100},{"id":"col3","caption":"Employee","type":"number","format":"^-?\\d\\d*$","width":100},{"id":"col5","caption":"PO Name","type":"number","format":"^-?\\d\\d*$","width":120}])
            .setRows([])
            .onDblClickRow("_treegrid14_ondblclickrow")
            );
            
            t.tabs2.attach(
            (new u.Input)
            .host(t,"ipt_customer_last_name")
            .setLeft(140)
            .setTop(80)
            .setWidth(170)
            , 'a');
            
            t.tabs2.attach(
            (new u.Input)
            .host(t,"ipt_customer_phone")
            .setLeft(440)
            .setTop(50)
            .setWidth(170)
            , 'a');
            
            t.tabs2.attach(
            (new u.Input)
            .host(t,"ipt_customer_web")
            .setLeft(440)
            .setTop(20)
            .setWidth(170)
            , 'a');
            
            t.tabs2.attach(
            (new u.Input)
            .host(t,"ipt_customer_fax")
            .setLeft(440)
            .setTop(80)
            .setWidth(170)
            , 'a');
            
            t.tabs2.attach(
            (new u.TextEditor)
            .host(t,"tdt_customer_ship_addr")
            .setLeft(20)
            .setTop(270)
            .setWidth(280)
            .setHeight(70)
            .setCaption("texteditor20")
            .setBorder(true)
            , 'a');
            
            t.tabs2.attach(
            (new u.TextEditor)
            .host(t,"texteditor19")
            .setLeft(330)
            .setTop(140)
            .setWidth(280)
            .setCaption("texteditor19")
            .setBorder(true)
            , 'a');
            
            t.tabs2.attach(
            (new u.TextEditor)
            .host(t,"tdt_customer_bill_addr")
            .setLeft(20)
            .setTop(160)
            .setWidth(280)
            .setHeight(70)
            .setCaption("texteditor20")
            .setBorder(true)
            , 'a');
            
            t.tabs2.attach(
            (new u.Input)
            .host(t,"ipt_customer_first_name")
            .setLeft(140)
            .setTop(50)
            .setWidth(170)
            , 'a');
            
            t.tabs2.attach(
            (new u.Group)
            .host(t,"group8")
            .setLeft(10)
            .setTop(170)
            .setWidth(600)
            .setCaption("Order Details")
            .setHeight(200)
            , 'b');
            
            t.group8.attach(
            (new u.TreeGrid)
            .host(t,"treegrid15")
            .setDockMargin({"left":4,"top":4,"right":4,"bottom":4})
            .setHeader([{"id":"col1","caption":"Product","type":"input","width":160},{"id":"col4","caption":"quantity","type":"input","width":100},{"id":"col2","caption":"Unit Price","type":"number","format":"^-?\\d\\d*$","width":100},{"id":"col3","caption":"Discount","type":"number","format":"^-?\\d\\d*$","width":100},{"id":"col5","caption":"Tatal Price","type":"number","format":"^-?\\d\\d*$","width":120}])
            .setRows([])
            );
            
            t.dialog14.attach(
            (new u.PageBar)
            .host(t,"pagebar11")
            .setValue("1:1:4")
            .setLeft(20)
            .setTop(410)
            .setWidth(110)
            .setCaption("<font color=red>Click No To See Customers</font>")
            .onClick("_pagebar11_onclick")
            );
            
            return n;
            // ]]code created by designer
        },
        _button9_onclick:function (profile, e, value) {
            this.dialog7.setZIndex(2);
            this.dialog14.setZIndex(1);

        },

        _ajax1_onrequestok:function (response, rspType, threadId) {
            //linb.message(SPA);
            var obj = _.unserialize(response);
            SPA.global_data_order = obj;

            var idx = parseInt(SPA.tgd_orders_details.getTag())-1;
            SPA.tgd_orders_details.setRows(obj[idx].order_details);
            
            linb.iDataBinder.getDataBinder('order').resetValue(obj[idx]);
            
            //SPA._calculateTotal(obj[idx]);
        },
        _ajax2_onrequestok:function (response, rspType, threadId) {
            //linb.message(SPA);
            var obj = _.unserialize(response);
            var a = SPA.pagebar11.getValue().split(':');
            var idx = a[1]-1;
            SPA._bindCustomerData(obj[idx]);
            SPA._bindOrdersDataByCustomer(obj[idx].company_name);
        },

        _pagebar1_onclick:function (profile, src) {
            var self = profile.boxing();
            var value = self.getValue();
            var a = value.split(':');
            a[1] = src.href.split('#')[1];
            self.setValue(a.join(':'));
            this.tgd_orders_details.setTag(a[1]);

            //if(SPA.global_data_order){
            //    var idx = parseInt(a[1]);
            //    SPA.tgd_orders_details.setRows(SPA.global_data_order[idx].order_details);
            //    this._bindOrderData(SPA.global_data_order[idx]);
            //    this._calculateTotal(SPA.global_data_order[idx]);
            //}else{
                var ns=this;
                linb.thread.asyUI(null, [function(threadid){
                    linb.ajax('Data/Orders.js','rnd=' + Math.random(),ns._ajax1_onrequestok,null,threadid).start();
                }]);
            //}
        },
        _onReady:function(page, threadid){
            SPA = page;
            SPA.dialog14.setDisplay('none');
        },
        events:{"onReady":"_onReady"},
        _button12_onclick:function (profile, e, value) {
            this.dialog7.setDisplay('');
            this.dialog14.setDisplay('none');
        },
        _button13_onclick:function (profile, e, value) {
            this.dialog7.setDisplay('none');
            this.dialog14.setDisplay('');
        },

        _bindCustomerData:function(obj){
            //alert(this.cbi_orders_customer);
            this.ipt_customer_company.setValue(obj["company_name"]);
            this.ipt_customer_first_name.setValue(obj["first_name"]);
            this.ipt_customer_last_name.setValue(obj["last_name"]);
            this.ipt_customer_email.setValue(obj["email"]);
            this.ipt_customer_web.setValue(obj["web_site"]);
            this.ipt_customer_phone.setValue(obj["phone_number"]);

            this.ipt_customer_fax.setValue(obj["fax_number"]);
            this.tdt_customer_bill_addr.setValue(obj["bill_address"]);
            this.tdt_customer_ship_addr.setValue(obj["shipment_address"]);

        },
        _bindOrdersDataByCustomer:function(custName){
            //alert(SPA.global_data_order.length);
            var ar = new Array();

            for(var i = 0; i < SPA.global_data_order.length;i++){
                //alert(custName + " # " + SPA.global_data_order[i].customer);
                if(custName==SPA.global_data_order[i].customer){

                    ar.push({"id" : SPA.global_data_order[i].order_id,
                    cells:[SPA.global_data_order[i].order_id,
                    SPA.global_data_order[i].shipment,SPA.global_data_order[i].order_date,
                    SPA.global_data_order[i].employee,SPA.global_data_order[i].po_number]});
                }
            }
            SPA.treegrid14.setRows(ar);
            SPA.treegrid15.setRows([]);
        },
        _calculateTotal:function(obj){
            var t = 0.0;
            for(var i = 0;i<obj.order_details.length;i++){
                alert(_.serialize(obj.order_details[i].cells[1]));
                t += obj.order_details[i].cells[1];
            }
            this.ipt_orders_subtotal.setValue(t);
            //ipt_orders_tax
            this.ipt_orders_total.setValue(t + this.ipt_orders_tax.getValue());
        },
        _pagebar11_onclick:function (profile, src) {
            var self = profile.boxing();
            var value = self.getValue();
            var a = value.split(':');
            a[1] = src.href.split('#')[1];
            self.setValue(a.join(':'));

            if(SPA.global_data_customer){
                var idx = parseInt(a[1]);
                SPA.tgd_orders_details.setRows(SPA.global_data_id[idx].order_details);
                
                linb.iDataBinder.getDataBinder('order').resetValue(SPA.global_data_customer[idx]);

                //this._calculateTotal(SPA.global_data_customer[idx]);
            }else{
                var ns=this;
                linb.thread.asyUI(null, [function(threadid){
                    linb.ajax('Data/Customers.js','rnd=' + Math.random(),ns._ajax2_onrequestok,null,threadid).start();
                }]);                
            }
            return false;
        },
        _treegrid14_ondblclickrow:function (profile, row, e, src) {
            for(var i = 0; i < SPA.global_data_order.length;i++){
                //alert(custName + " # " + SPA.global_data_order[i].customer);
                if(row.id==SPA.global_data_order[i].order_id){
                    this.treegrid15.setRows(SPA.global_data_order[i].order_details);
                }
            }
        }
    }
});