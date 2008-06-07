Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Group","linb.UI.Button","linb.UI.Input","linb.UI.Fieldset","linb.UI.Panel"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Group)
            .host(t,"group1")
            .setLeft(160)
            .setTop(230)
            .setCaption("group1")
            .setWidth(170)
            .setHeight(108)
            .setResizable(true)
            .setBorder(true)
            .setIcon("img/demo.gif")
            );
            
            t.group1.attach(
            (new u.Input)
            .host(t,"input6")
            .setLeft(30)
            .setTop(50)
            );
            
            t.group1.attach(
            (new u.Button)
            .host(t,"button16")
            .setLeft(30)
            .setTop(10)
            .setCaption("button1")
            );
            
            f(
            (new u.Group)
            .host(t,"group3")
            .setLeft(368)
            .setTop(30)
            .setWidth(320)
            .setHeight(216)
            .setCaption("group3")
            );
            
            t.group3.attach(
            (new u.Group)
            .host(t,"group5")
            .setLeft(200)
            .setTop(32)
            .setCaption("group5")
            );
            
            t.group3.attach(
            (new u.Group)
            .host(t,"group4")
            .setLeft(40)
            .setTop(32)
            .setCaption("group4")
            );
            
            f(
            (new u.Group)
            .host(t,"group2")
            .setLeft(160)
            .setTop(30)
            .setWidth(174)
            .setHeight(132)
            .setResizable(true)
            .setCaption("group2")
            .setIcon("img/demo.gif")
            .setTips("this is group2")
            );
            
            t.group2.attach(
            (new u.Input)
            .host(t,"input2")
            .setLeft(24)
            .setTop(64)
            );
            
            t.group2.attach(
            (new u.Button)
            .host(t,"button1")
            .setLeft(24)
            .setTop(24)
            .setCaption("button1")
            );
            
            f(
            (new u.Panel)
            .host(t,"panel3")
            .setLeft(100)
            .setTop(360)
            .setWidth(260)
            .setHeight(160)
            );
            
            t.panel3.attach(
            (new u.Fieldset)
            .host(t,"fieldset1")
            .setWidth("auto")
            .setHeight("auto")
            .setZIndex(1)
            .setPosition("relative")
            .setCaption("fieldset1")
            );
            
            t.fieldset1.attach(
            (new u.Panel)
            .host(t,"panel12")
            .setLeft(10)
            .setWidth(230)
            .setHeight(90)
            .setPosition("relative")
            );
            
            t.panel12.attach(
            (new u.Button)
            .host(t,"button14")
            .setLeft(30)
            .setTop(30)
            .setCaption("button14")
            );
            
            return n;
            // ]]code created by designer
        }
    }
});