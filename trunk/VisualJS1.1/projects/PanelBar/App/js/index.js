Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Block","linb.UI.Tabs","linb.UI.ButtonViews","linb.UI.Stacks","linb.UI.PanelBar","linb.UI.Layout","linb.UI.Group","linb.UI.Button","linb.UI.Dialog"],

        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Panel)
            .host(t,"panel5")
            .setLeft(30)
            .setTop(140)
            .setWidth(420)
            .setHeight(128)
            );
            
            t.panel5.attach(
            (new u.Tabs)
            .host(t,"tabs2")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"aa","caption":"itema","tips":"item a"},{"id":"ab","caption":"itemb","tips":"item b"},{"id":"ac","caption":"itemc","tips":"item c","closeBtn":"true","landBtnBtn":true}])
            .setValue("ab")
            .setDragKey("panel")
            .setDropKeysPanel("panel")
            .onDrop("_block1_ondrop")
            , '');
            
            t.tabs2.attach(
            (new u.Button)
            .host(t,"button7")
            .setLeft(90)
            .setTop(40)
            .setCaption("button7")
            , 'aa');
            
            t.tabs2.attach(
            (new u.Button)
            .host(t,"button8")
            .setLeft(110)
            .setTop(40)
            .setCaption("button8")
            , 'ac');
            
            t.tabs2.attach(
            (new u.Button)
            .host(t,"button6")
            .setLeft(80)
            .setTop(40)
            .setCaption("button6")
            .afterCreated("_button6_aftercreated")
            , 'ab');
            
            f(
            (new u.Panel)
            .host(t,"panel6")
            .setLeft(490)
            .setTop(140)
            .setWidth(260)
            .setHeight(128)
            .setCustomAppearance({"KEY":"border:solid 1px;"})
            );
            
            t.panel6.attach(
            (new u.Stacks)
            .host(t,"stacks1")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"ca","caption":"itema","tips":"item a"},{"id":"cb","caption":"itemb","tips":"item b"},{"id":"cc","caption":"itemc","tips":"item c","closeBtn":"true","landBtn":true}])
            .setValue("cc")
            .setDragKey("panel")
            .setDropKeysPanel("panel")
            .onDrop("_block1_ondrop")
            , '');
            
            t.stacks1.attach(
            (new u.Button)
            .host(t,"button10")
            .setLeft(60)
            .setTop(50)
            .setCaption("button10")
            , 'cb');
            
            t.stacks1.attach(
            (new u.Button)
            .host(t,"button11")
            .setLeft(60)
            .setTop(20)
            .setCaption("button11")
            , 'cc');
            
            t.stacks1.attach(
            (new u.Button)
            .host(t,"button9")
            .setLeft(100)
            .setTop(10)
            .setCaption("button9")
            , 'ca');
            
            f(
            (new u.Panel)
            .host(t,"panel3")
            .setLeft(30)
            .setTop(10)
            .setWidth(420)
            .setHeight(108)
            .setCustomAppearance({"KEY":"border:solid 1px;"})
            );
            
            t.panel3.attach(
            (new u.Layout)
            .host(t,"layout4")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"before","pos":"before","locked":false,"size":129,"min":50,"max":200,"hide":false,"cmd":true},{"id":"main","min":10},{"id":"after","pos":"after","locked":false,"size":118,"min":50,"max":200,"hide":false,"cmd":true}])
            .setType("horizontal")
            .setDropKeys("panel")
            .onDrop("_block1_ondrop")
            , '');
            
            t.layout4.attach(
            (new u.PanelBar)
            .host(t,"panelbar1")
            .setLeft(0)
            .setTop(0)
            .setZIndex(1)
            .setCaption("panelbar1")
            .setTag("pb1")
            .setDragKey("panel")
            , 'main');
            
            t.panelbar1.attach(
            (new u.Button)
            .host(t,"button3")
            .setLeft(20)
            .setTop(40)
            .setCaption("button3")
            );
            
            t.layout4.attach(
            (new u.PanelBar)
            .host(t,"panelbar2")
            .setLeft(0)
            .setTop(0)
            .setZIndex(1)
            .setCaption("panelbar2")
            .setTag("pb2")
            .setDragKey("panel")
            , 'before');
            
            t.panelbar2.attach(
            (new u.Button)
            .host(t,"button4")
            .setLeft(20)
            .setTop(20)
            .setCaption("button4")
            .setWidth(80)
            );
            
            f(
            (new u.Group)
            .host(t,"group1")
            .setLeft(500)
            .setTop(300)
            .setWidth(250)
            .setHeight(130)
            .setCaption("group1")
            .setDropKeys("panel")
            .onDrop("_block1_ondrop")
            );
            
            f(
            (new u.Dialog)
            .host(t,"dialog2")
            .setLeft(260)
            .setTop(130)
            .setWidth(190)
            .setHeight(120)
            .setCaption("dialog2")
            .setTag("pb3")
            .setTagVar("")
            .setDragKey("panel")
            .setLandBtn(true)
            );
            
            t.dialog2.attach(
            (new u.Button)
            .host(t,"button5")
            .setLeft(30)
            .setTop(20)
            .setCaption("button5")
            );
            
            f(
            (new u.Panel)
            .host(t,"panel4")
            .setLeft(490)
            .setTop(10)
            .setWidth(260)
            .setHeight(108)
            );
            
            t.panel4.attach(
            (new u.ButtonViews)
            .host(t,"buttonviews2")
            .setLeft(0)
            .setTop(0)
            .setItems([{"id":"ba","caption":"itema","tips":"item a"},{"id":"bb","caption":"itemb","tips":"item b"},{"id":"bc","caption":"itemc","tips":"item c","closeBtn":"true","landBtn":true}])
            .setHandleSize("26")
            .setValue("ba")
            .setDragKey("panel")
            .setDropKeysPanel("panel")
            .onDrop("_block1_ondrop")
            , '');
            
            t.buttonviews2.attach(
            (new u.Button)
            .host(t,"button13")
            .setLeft(90)
            .setTop(40)
            .setCaption("button13")
            , 'bb');
            
            t.buttonviews2.attach(
            (new u.Button)
            .host(t,"button14")
            .setLeft(90)
            .setTop(30)
            .setCaption("button14")
            , 'bc');
            
            t.buttonviews2.attach(
            (new u.Button)
            .host(t,"button12")
            .setLeft(40)
            .setTop(50)
            .setCaption("button12")
            , 'ba');
            
            f(
            (new u.Block)
            .host(t,"block1")
            .setLeft(50)
            .setTop(300)
            .setWidth(400)
            .setHeight(130)
            .setBorder(true)
            .setDropKeys("panel")
            .setResizable(true)
            .onDrop("_block1_ondrop")
            );
            
            return n;
            // ]]code created by designer
        },
        _block1_ondrop:function (profile, e, node, key, data, item) {
            var target = profile.boxing(), 
                source = data.profile.boxing(),
                para = source.getPanelPara(data.domId), 
                children = source.getPanelChildren(data.domId);

            source.removePanel(data.domId);
            target.addPanel(para, children, item);
        },
        _button6_aftercreated:function (profile) {
            profile.boxing().dragable('KEY','o')
        }
    }
});