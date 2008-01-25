Class('App', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Block)
            .host(t,"block1")
            .setLeft(90)
            .setTop(20)
            .setWidth(553)
            .setHeight(600)
            .setBorder(true)
            .setResizable(true)
            );

            t.block1.attach(
            (new u.Poll)
            .host(t,"poll01")
            .setLeft(null)
            .setTop(null)
            .setWidth("auto")
            .setHeight("auto")
            .setTitle("1. single select ")
            .setItems([{"id":"a","caption":"option 1","message":"1","percent":"0.1"},{"id":"b","caption":"option 2","message":"9","percent":"0.9"}])
            .setValue("")
            .setToggle(true)
            .setPosition("relative")
            .setCustomFunction({"formatCaption":function (s) {
                return s + "-";
            }})
            );

            t.block1.attach(
            (new u.Poll)
            .host(t,"poll02")
            .setLeft(null)
            .setTop(null)
            .setWidth("auto")
            .setHeight("auto")
            .setSelMode('multi')
            .setTitle("2. multi select ")
            .setItems([{"id":"a","caption":"option 1","message":"2","percent":"0.2"},{"id":"b","caption":"option 2","message":"8","percent":"0.8"}])
            .setValue("")
            .setPosition("relative")
            );

            t.block1.attach(
            (new u.Poll)
            .host(t,"poll05")
            .setLeft(null)
            .setTop(null)
            .setWidth("auto")
            .setHeight("auto")
            .setTitle("5. single select (disabled)")
            .setItems([{"id":"a","caption":"option 1","message":"1","percent":"0.1"},{"id":"b","caption":"option 2","message":"9","percent":"0.9"}])
            .setValue("")
            .setPosition("relative")
            .setDisabled(true)
            );

            t.block1.attach(
            (new u.Poll)
            .host(t,"poll06")
            .setWidth("auto")
            .setHeight("auto")
            .setTitle("6. Editable ")
            .setItems([{"id":"a","caption":"option 1","message":"4","percent":"0.4"},{"id":"b","caption":"option 2","message":"6","percent":"0.6"}])
            .setValue("")
            .setPosition("relative")
            .setLeft(null)
            .setTop(null)
            .setEditable(true)
            );

            t.block1.attach(
            (new u.Poll)
            .host(t,"poll03")
            .setLeft(null)
            .setTop(null)
            .setWidth("auto")
            .setHeight("auto")
            .setTitle("3. single select + new option")
            .setNewOption("new option")
            .setItems([{"id":"a","caption":"option 1","message":"1","percent":"0.1"},{"id":"b","caption":"option 2","message":"9","percent":"0.9"}])
            .setValue("")
            .setPosition("relative")
            );

            t.block1.attach(
            (new u.Poll)
            .host(t,"poll04")
            .setLeft(null)
            .setTop(null)
            .setWidth("auto")
            .setHeight("auto")
            .setSelMode('multi')
            .setNewOption("new option")
            .setTitle("4. multi select + new option")
            .setItems([{"id":"a","caption":"option 1","message":"2","percent":"0.2"},{"id":"b","caption":"option 2","message":"8","percent":"0.8"}])
            .setValue("")
            .setPosition("relative")
            .setTabindex(3)
            .setCmds([{"id":"new","caption":"new"},{"id":"edit","caption":"edit"}])
            );

            return n;
            // ]]code created by designer
        }
    }
});