
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        //"linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"
        required:["linb.UI.Block","linb.UI.Div","linb.UI.Stacks","linb.UI.Button","linb.UI.PanelBar","linb.UI.Dialog","linb.UI.Label","linb.UI.TextEditor","linb.UI.TreeGrid","linb.UI.CheckBox","linb.UI.PageBar","linb.UI.ComboInput","linb.UI.Input","linb.UI.Group","linb.UI.Tabs"],
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
            .setLeft(130)
            .setTop(10)
            .setWidth(470)
            .setHeight(70)
            .setHtml("<font size=8>Order Management</font>")
            );

            t.block1.attach(
            (new u.Button)
            .host(t,"button9")
            .setLeft(610)
            .setTop(20)
            .setCaption("button9")
            .onClick("_button9_onclick")
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
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            );

            t.stacks1.attach(
            (new u.Button)
            .host(t,"button12")
            .setLeft(10)
            .setTop(10)
            .setCaption("button12")
            , 'a');

            t.stacks1.attach(
            (new u.Button)
            .host(t,"button13")
            .setLeft(10)
            .setTop(40)
            .setCaption("button13")
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
            .setZIndex("2")
            );

            t.dialog7.attach(
            (new u.Label)
            .host(t,"label9")
            .setLeft(370)
            .setTop(370)
            .setCaption("Sale Tax:")
            .setHAlign("left")
            .setWidth(100)
            );

            t.dialog7.attach(
            (new u.Label)
            .host(t,"label14")
            .setLeft(370)
            .setTop(310)
            .setCaption("Order Subtotal:")
            .setWidth(110)
            .setHAlign("left")
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
            .setTop(340)
            .setCaption("Sale Tax Rate")
            .setHAlign("left")
            .setWidth(100)
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
            .host(t,"label4")
            .setLeft(30)
            .setTop(310)
            .setCaption("Ship Date:")
            .setWidth(110)
            .setHAlign("left")
            );

            t.dialog7.attach(
            (new u.Label)
            .host(t,"Sales Tax:")
            .setLeft(370)
            .setTop(340)
            .setCaption("Shipping & Handle:")
            .setHAlign("left")
            .setWidth(120)
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
            .host(t,"label38")
            .setLeft(370)
            .setTop(400)
            .setCaption("Order total:")
            .setWidth(110)
            .setHAlign("left")
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
            .setDataField("employee")
            );

            t.dialog7.attach(
            (new u.Input)
            .host(t,"input8")
            .setLeft(130)
            .setTop(340)
            .setWidth(140)
            );

            t.dialog7.attach(
            (new u.Input)
            .host(t,"input10")
            .setLeft(480)
            .setTop(370)
            .setWidth(140)
            );

            t.dialog7.attach(
            (new u.CheckBox)
            .host(t,"checkbox2")
            .setLeft(30)
            .setTop(370)
            .setCaption("checkbox2")
            );

            t.dialog7.attach(
            (new u.TreeGrid)
            .host(t,"tgd_orders_details")
            .setDock("none")
            .setLeft(30)
            .setTop(200)
            .setWidth(590)
            .setHeight(110)
            .setHeader([{"id":"col1","caption":"Product","type":"input","width":100},{"id":"col4","caption":"quantity","type":"input","width":80},{"id":"col2","caption":"Unit Price","type":"number","format":"^-?\\d\\d*$","width":80},{"id":"col3","caption":"Discount","type":"number","format":"^-?\\d\\d*$","width":60},{"id":"col5","caption":"Tatal Price","type":"checkbox","format":"^-?\\d\\d*$","width":100}])
            .setRows([{"id":"row1","cells":[{"value":"cell11"},{"value":"cell12"}]},{"id":"row2","cells":[{"value":"cell21","type":"label"},{"value":"cell22"}],"sub":[{"id":"row21","cells":["cell31",{"value":"cell32","type":"number"}]}]}])
            );

            t.dialog7.attach(
            (new u.ComboInput)
            .host(t,"comboinput11")
            .setLeft(130)
            .setTop(310)
            .setWidth(140)
            .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
            .setType("datepicker")
            );

            t.dialog7.attach(
            (new u.Input)
            .host(t,"ipt_orders_po_number")
            .setLeft(480)
            .setTop(80)
            .setWidth(140)
            .setDataField("po_number")
            );

            t.dialog7.attach(
            (new u.Input)
            .host(t,"input12")
            .setLeft(480)
            .setTop(310)
            .setWidth(140)
            );

            t.dialog7.attach(
            (new u.PageBar)
            .host(t,"pagebar1")
            .setLeft(30)
            .setTop(420)
            .setWidth(190)
            .setHeight(20)
            .setValue("1:3:5")
            .onClick("_pagebar1_onclick")
            );

            t.dialog7.attach(
            (new u.Input)
            .host(t,"ipt_orders_order_date")
            .setLeft(480)
            .setTop(50)
            .setWidth(140)
            .setDataField("order_date")
            );

            t.dialog7.attach(
            (new u.Input)
            .host(t,"ipt_orders_order_id")
            .setLeft(480)
            .setTop(20)
            .setWidth(140)
            .setDataField("order_id")
            );

            t.dialog7.attach(
            (new u.ComboInput)
            .host(t,"cbi_orders_customer")
            .setLeft(130)
            .setTop(20)
            .setWidth(140)
            .setItems([{"id":"1","caption":"Mike,Silla"},{"id":"2","caption":"Rose,Kim"},{"id":"3","caption":"Betty,Jin"}])
            .setValue(null)
            .setReadonly(true)
            .setType("listbox")
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
            .setDataField("ship_method")
            );

            t.dialog7.attach(
            (new u.Input)
            .host(t,"input11")
            .setLeft(480)
            .setTop(400)
            .setWidth(140)
            );

            t.dialog7.attach(
            (new u.Input)
            .host(t,"input9")
            .setLeft(480)
            .setTop(340)
            .setWidth(140)
            );

            t.dialog7.attach(
            (new u.Group)
            .host(t,"group1")
            .setLeft(30)
            .setTop(110)
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
            .setCaption("dialog14")
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
            .host(t,"label45")
            .setLeft(330)
            .setTop(110)
            .setWidth(110)
            .setCaption("Notes:")
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
            .host(t,"label44")
            .setLeft(20)
            .setTop(20)
            .setWidth(110)
            .setCaption("Company Name:")
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
            (new u.Label)
            .host(t,"label51")
            .setLeft(20)
            .setTop(250)
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
            .host(t,"label47")
            .setLeft(330)
            .setTop(20)
            .setWidth(110)
            .setCaption("Web Site:")
            .setHAlign("left")
            , 'a');

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
            (new u.Input)
            .host(t,"input47")
            .setLeft(140)
            .setTop(20)
            .setWidth(170)
            , 'a');

            t.tabs2.attach(
            (new u.Input)
            .host(t,"input49")
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
            .setCaption("Orders")
            , 'b');

            t.group7.attach(
            (new u.TreeGrid)
            .host(t,"treegrid14")
            .setDockMargin({"left":4,"top":4,"right":4,"bottom":4})
            .setHeader([{"id":"col1","caption":"col1","type":"input","width":50},{"id":"col2","caption":"col2","type":"input","width":80}])
            .setRows([{"id":"row1","cells":[{"value":"cell11"},{"value":"cell12"}]},{"id":"row2","cells":[{"value":"cell21","type":"label"},{"value":"cell22"}],"sub":[{"id":"row21","cells":["cell31",{"value":"cell32","type":"number"}]}]}])
            );

            t.tabs2.attach(
            (new u.Input)
            .host(t,"input50")
            .setLeft(140)
            .setTop(80)
            .setWidth(170)
            , 'a');

            t.tabs2.attach(
            (new u.Input)
            .host(t,"input48")
            .setLeft(440)
            .setTop(50)
            .setWidth(170)
            , 'a');

            t.tabs2.attach(
            (new u.Input)
            .host(t,"input52")
            .setLeft(440)
            .setTop(20)
            .setWidth(170)
            , 'a');

            t.tabs2.attach(
            (new u.Input)
            .host(t,"input53")
            .setLeft(440)
            .setTop(80)
            .setWidth(170)
            , 'a');

            t.tabs2.attach(
            (new u.TextEditor)
            .host(t,"texteditor21")
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
            .host(t,"texteditor20")
            .setLeft(20)
            .setTop(160)
            .setWidth(280)
            .setHeight(70)
            .setCaption("texteditor20")
            .setBorder(true)
            , 'a');

            t.tabs2.attach(
            (new u.Input)
            .host(t,"input51")
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
            .setHeight(220)
            , 'b');

            t.group8.attach(
            (new u.TreeGrid)
            .host(t,"treegrid15")
            .setDockMargin({"left":4,"top":4,"right":4,"bottom":4})
            .setHeader([{"id":"col1","caption":"col1","type":"input","width":50},{"id":"col2","caption":"col2","type":"input","width":80}])
            .setRows([{"id":"row1","cells":[{"value":"cell11"},{"value":"cell12"}]},{"id":"row2","cells":[{"value":"cell21","type":"label"},{"value":"cell22"}],"sub":[{"id":"row21","cells":["cell31",{"value":"cell32","type":"number"}]}]}])
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
            //var idx = SPA.tgd_orders_details.getTag() + 0;

            SPA.tgd_orders_details.setRows(obj[0].order_details);
        },
        _pagebar1_onclick:function (profile, src) {
            var self = profile.boxing();
            var value = self.getValue();
            var a = value.split(':');
            a[1] = src.href.split('#')[1];
            self.setValue(a.join(':'));

            this.tgd_orders_details.setTag(a[1]);
            linb.ajax('Data/Orders.js','a=1&b=2',this._ajax1_onrequestok).start();
        },
        _onReady:function(page, threadid){
            linb.message("sdfghjk");
            SPA = page;
        },
        events:{"onReady":"_onReady"}
    }
});