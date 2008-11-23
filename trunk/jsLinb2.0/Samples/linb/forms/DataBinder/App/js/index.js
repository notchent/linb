Class('App', 'linb.Com',{
    Instance:{
        //Com events
        events:{"onReady":"_onready"}, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.DataBinder)
                .host(host,"databinder")
                .setName("databinder")
            );
            
            append((new linb.UI.Input)
                .host(host,"input13")
                .setLeft(40)
                .setTop(140)
                .setWidth(220)
                .setHeight(100)
                .setMultiLines(true)
                .setValue("{email:'a@a.com',web:'string'}")
            );
            
            append((new linb.UI.Button)
                .host(host,"button29")
                .setLeft(270)
                .setTop(220)
                .setCaption("setValue")
                .onClick("_button29_onclick")
            );
            
            append((new linb.UI.Button)
                .host(host,"button22")
                .setLeft(270)
                .setTop(100)
                .setCaption("getValue")
                .onClick("_button22_onclick")
            );
            
            append((new linb.UI.Group)
                .host(host,"group1")
                .setLeft(40)
                .setTop(20)
                .setWidth(220)
                .setHeight(100)
                .setCaption("group1")
            );
            
            host.group1.append((new linb.UI.Input)
                .host(host,"input2")
                .setDataBinder("databinder")
                .setDataField("email")
                .setLeft(80)
                .setTop(20)
                .setValueFormat("^[\\w\\.=-]+@[\\w\\.-]+\\.[\\w\\.-]{2,4}$")
                .setValue("a@a.com")
            );
            
            host.group1.append((new linb.UI.Div)
                .host(host,"div39")
                .setLeft(20)
                .setTop(20)
                .setWidth(50)
                .setHeight(20)
                .setHtml("Email:")
            );
            
            host.group1.append((new linb.UI.Div)
                .host(host,"div40")
                .setLeft(10)
                .setTop(50)
                .setWidth(60)
                .setHeight(20)
                .setHtml("Any string:")
            );
            
            host.group1.append((new linb.UI.Input)
                .host(host,"input6")
                .setDataBinder("databinder")
                .setDataField("web")
                .setLeft(80)
                .setTop(50)
                .setValueFormat("^\\w+$")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _button22_onclick:function (profile, e, value) {
            var data=SPA.databinder.getValue();
            if(!data)
                alert('Ensure all the fields are valid first!');
            else
                SPA.input13.setValue(_.serialize(data),true);
        }, 
        _onready:function () {
            SPA=this;
        }, 
        _button29_onclick:function (profile, e, value) {
            SPA.databinder.resetValue( _.unserialize(SPA.input13.getUIValue()) );
        }, 
        base:[], 
        required:["linb.DataBinder", "linb.UI.Input", "linb.UI.Button", "linb.UI.Group", "linb.UI.Div"]
    }
});