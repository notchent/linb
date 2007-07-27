Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Div","linb.UI.Panel","linb.UI.Button","linb.UI.Label","linb.UI.Group","linb.UI.Block","linb.UI.Stacks","linb.UI.Tabs","linb.UI.Layout"],

        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];

            this.Div7 = (new linb.UI.Div)
            .alias("Div7").host(this)
            .setLeft(312).setTop(144).setWidth(168).setHeight(24).setHtml("Block")
            ;
            this.nodes.push(this.Div7.get(0));

            this.panel2 = (new linb.UI.Panel)
            .alias("panel2").host(this)
            .setLeft(312).setTop(40).setWidth(256).setHeight(78).setDropKeys("iAny")
            .setCustomAppearance({KEY:'border:solid 1px;background-color:#fff;'})
            .onDrop("_panel2_ondrop")
            ;
            this.nodes.push(this.panel2.get(0));

            this.Div8 = (new linb.UI.Div)
            .alias("Div8").host(this)
            .setLeft(24).setTop(136).setWidth(168).setHeight(24).setHtml("Group")
            ;
            this.nodes.push(this.Div8.get(0));

            this.Div9 = (new linb.UI.Div)
            .alias("Div9").host(this)
            .setLeft(24).setTop(272).setWidth(168).setHeight(24).setHtml("Stacks")
            ;
            this.nodes.push(this.Div9.get(0));

            this.div7 = (new linb.UI.Div)
            .alias("div7").host(this)
            .setLeft(24).setTop(16).setWidth(168).setHeight(24).setHtml("Panel1")
            ;
            this.nodes.push(this.div7.get(0));

            this.div8 = (new linb.UI.Div)
            .alias("div8").host(this)
            .setLeft(312).setTop(16).setWidth(168).setHeight(24).setHtml("Panel2")
            ;
            this.nodes.push(this.div8.get(0));

            this.panel1 = (new linb.UI.Panel)
            .alias("panel1").host(this)
            .setLeft(24).setTop(40).setWidth(256).setHeight(78).setDropKeys("iAny")
            .setCustomAppearance({KEY:'border:solid 1px;background-color:#fff;'})
            .onDrop("_panel2_ondrop")
            ;
            this.nodes.push(this.panel1.get(0));

            this.label6 = (new linb.UI.Button)
            .alias("label6").host(this)
            .setLeft(9).setTop(9).setWidth(121).setBorder(true).setCaption("drag me").setHeight(25)
            .afterCreated("_label6_aftercreated")
            ;
            this.panel1.attach(this.label6);

            this.Div10 = (new linb.UI.Div)
            .alias("Div10").host(this)
            .setLeft(312).setTop(272).setWidth(168).setHeight(24).setHtml("Tabs")
            ;
            this.nodes.push(this.Div10.get(0));

            this.Panel1 = (new linb.UI.Panel)
            .alias("Panel1").host(this)
            .setLeft(624).setTop(40).setWidth(152).setHeight(464).setDropKeys("iAny")
            .setCustomAppearance({KEY:'border:solid 1px;background-color:#fff;'})
            ;
            this.nodes.push(this.Panel1.get(0));

            this.Layout2 = (new linb.UI.Layout)
            .alias("Layout2").host(this)
            .setLeft(0).setTop(0).setItems([{"id":"before","pos":"before","locked":false,"size":60,"min":50,"max":200,"cmd":true,"hide":false},{"id":"main","min":10},{"id":"after","pos":"after","locked":false,"size":60,"min":50,"max":200,"cmd":true,"hide":false}]).setDropKeys("iAny")
            .onDrop("_panel2_ondrop")
            ;
            this.Panel1.attach(this.Layout2);

            this.Div6 = (new linb.UI.Div)
            .alias("Div6").host(this)
            .setLeft(616).setTop(8).setWidth(168).setHeight(24).setHtml("Layout")
            ;
            this.nodes.push(this.Div6.get(0));

            this.Group1 = (new linb.UI.Group)
            .alias("Group1").host(this)
            .setLeft(24).setTop(160).setWidth(256).setCaption("Group1").setDropKeys("iAny")
            .onDrop("_panel2_ondrop")
            ;
            this.nodes.push(this.Group1.get(0));

            this.Tabs1 = (new linb.UI.Tabs)
            .alias("Tabs1").host(this)
            .setDock("none").setLeft(312).setTop(296).setWidth(256).setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3"},{"id":"view4","caption":"view4"}]).setDropKeys("iAny").setValue("view1")
            .onDrop("_panel2_ondrop")
            ;
            this.nodes.push(this.Tabs1.get(0));

            this.Stacks1 = (new linb.UI.Stacks)
            .alias("Stacks1").host(this)
            .setDock("none").setLeft(24).setTop(296).setWidth(256).setItems([{"id":"view1","caption":"view1"},{"id":"view2","caption":"view2"},{"id":"view3","caption":"view3"},{"id":"view4","caption":"view4"}]).setDropKeys("iAny").setValue("view2")
            .onDrop("_panel2_ondrop")
            ;
            this.nodes.push(this.Stacks1.get(0));

            this.Block1 = (new linb.UI.Block)
            .alias("Block1").host(this)
            .setLeft(312).setTop(170).setWidth(256).setHeight(88).setBorder(true).setDropKeys("iAny")
            .setCustomAppearance({KEY:'background-color:#fff;'})
            .onDrop("_panel2_ondrop")
            ;
            this.nodes.push(this.Block1.get(0));
            return this.nodes;
            // ]]code creted by designer
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