Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Div","linb.UI.Panel","linb.UI.Button","linb.UI.Label","linb.UI.Group","linb.UI.Block","linb.UI.Stacks","linb.UI.Tabs","linb.UI.Layout"],

        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Div)
            .host(t,"Div8")
            .setLeft(24)
            .setTop(136)
            .setWidth(168)
            .setHeight(24)
            .setHtml("Group")
            );
            
            f(
            (new u.Panel)
            .host(t,"panel2")
            .setLeft(312)
            .setTop(40)
            .setWidth(256)
            .setHeight(78)
            .setDropKeys("iAny")
            .onDrop("_panel2_ondrop")
            .setCustomAppearance({"KEY":"border:solid 1px;background-color:#fff;"})
            );
            
            f(
            (new u.Div)
            .host(t,"Div9")
            .setLeft(24)
            .setTop(272)
            .setWidth(168)
            .setHeight(24)
            .setHtml("Stacks")
            );
            
            f(
            (new u.Div)
            .host(t,"div7")
            .setLeft(24)
            .setTop(16)
            .setWidth(168)
            .setHeight(24)
            .setHtml("Panel1")
            );
            
            f(
            (new u.Div)
            .host(t,"div8")
            .setLeft(312)
            .setTop(16)
            .setWidth(168)
            .setHeight(24)
            .setHtml("Panel2")
            );
            
            f(
            (new u.Panel)
            .host(t,"panel1")
            .setLeft(24)
            .setTop(40)
            .setWidth(256)
            .setHeight(78)
            .setDropKeys("iAny")
            .onDrop("_panel2_ondrop")
            .setCustomAppearance({"KEY":"border:solid 1px;background-color:#fff;"})
            );
            
            t.panel1.attach(
            (new u.Button)
            .host(t,"label6")
            .setLeft(11)
            .setTop(11)
            .setWidth(121)
            .setBorder(true)
            .setCaption("drag me")
            .setHeight(25)
            .afterCreated("_label6_aftercreated")
            );
            
            f(
            (new u.Div)
            .host(t,"Div10")
            .setLeft(312)
            .setTop(272)
            .setWidth(168)
            .setHeight(24)
            .setHtml("Tabs")
            );
            
            f(
            (new u.Panel)
            .host(t,"Panel1")
            .setLeft(624)
            .setTop(40)
            .setWidth(152)
            .setHeight(464)
            .setDropKeys("iAny")
            .setCustomAppearance({"KEY":"border:solid 1px;background-color:#fff;"})
            );
            
            t.Panel1.attach(
            (new u.Layout)
            .host(t,"Layout2")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"before","pos":"before","locked":false,"size":60,"min":50,"max":200,"cmd":true,"hide":false},{"id":"main","min":10},{"id":"after","pos":"after","locked":false,"size":60,"min":50,"max":200,"cmd":true,"hide":false}])
            .setDropKeys("iAny")
            .onDrop("_panel2_ondrop")
            );
            
            f(
            (new u.Div)
            .host(t,"Div6")
            .setLeft(616)
            .setTop(8)
            .setWidth(168)
            .setHeight(24)
            .setHtml("Layout")
            );
            
            f(
            (new u.Group)
            .host(t,"Group1")
            .setLeft(24)
            .setTop(160)
            .setWidth(256)
            .setCaption("Group1")
            .setDropKeys("iAny")
            .onDrop("_panel2_ondrop")
            );
            
            f(
            (new u.Tabs)
            .host(t,"Tabs1")
            .setDock("none")
            .setLeft(312)
            .setTop(296)
            .setWidth(256)
            .setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3"},{"id":"view4","caption":"view4"}])
            .setDropKeys("iAny")
            .setValue("view1")
            .onDrop("_panel2_ondrop")
            );
            
            f(
            (new u.Stacks)
            .host(t,"Stacks1")
            .setDock("none")
            .setLeft(24)
            .setTop(296)
            .setWidth(256)
            .setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3"},{"id":"view4","caption":"view4"}])
            .setDropKeys("iAny")
            .setValue("view2")
            .onDrop("_panel2_ondrop")
            );
            
            f(
            (new u.Div)
            .host(t,"Div7")
            .setLeft(312)
            .setTop(144)
            .setWidth(168)
            .setHeight(24)
            .setHtml("Block")
            );
            
            f(
            (new u.Block)
            .host(t,"Block1")
            .setLeft(312)
            .setTop(170)
            .setWidth(256)
            .setHeight(88)
            .setBorder(true)
            .setDropKeys("iAny")
            .onDrop("_panel2_ondrop")
            .setCustomAppearance({"KEY":"background-color:#fff;"})
            );
            
            return n;
            // ]]code created by designer
        },
        _panel2_ondrop:function (profile, e, node, key, data, item) {
            var dd = linb.dragDrop, data = dd.data;
            if(data){
                var label=linb.UI.getByCacheId([data]);
                profile.boxing().attach(label, item?item.id:'');
            }
        },
        _label6_aftercreated:function (profile) {
            profile.boxing().dragable('KEY','iAny',profile.$id);
        }
    }
});