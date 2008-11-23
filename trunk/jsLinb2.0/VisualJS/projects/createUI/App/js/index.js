
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        required:["linb.UI.ComboInput", "linb.UI.Div", "linb.UI.Button", "linb.UI.Pane"], 
        //Com events
        events:{onReady:'_onready'}, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.ComboInput)
                .host(host,"ciMethods")
                .setLeft(140)
                .setTop(110)
                .setWidth(470)
                .setHeight(220)
                .setType("helpinput")
                .setMultiLines(true)
                .setItems([{"id":"item a", "caption":"item a"}, {"id":"item b", "caption":"item b"}, {"id":"item c", "caption":"item c"}, {"id":"item d", "caption":"item d"}])
            );
            
            append((new linb.UI.Pane)
                .host(host,"pane")
                .setLeft(140)
                .setTop(20)
                .setWidth(470)
                .setHeight(68)
                .setCustomStyle({"KEY":"border:solid 1px #ccc"})
            );
            
            append((new linb.UI.Button)
                .host(host,"button5")
                .setLeft(330)
                .setTop(360)
                .setCaption("Create Widget")
                .onClick("_clk")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _onready:function(){
            SPA=this;
            var code1='SPA.pane.removeChildren().append(\n\n    new linb.UI.Button(\n        {caption:"btn1",left:10,top:10},\n        {onClick:function(){alert("btn1")}}\n    ) \n\n);';
            this.ciMethods.setItems([
                {
                    id:code1,
                    caption:'method 1 : new linb.UI.Button(properties,events,host,children,CS,CC,CB,CF)'
                },
                {
                    id:'SPA.pane.removeChildren().append(\n\n    new linb.UI.Button()\n    .setCaption("btn2")\n        .setLeft(10)\n        .setTop(10)\n        .onClick(function(){alert("btn2")}\n    ) \n\n);',
                    caption:'method 2 : new linb.UI.Button().setXXX...'
                },
                {
                    id:'SPA.pane.removeChildren().append(\n\n    linb.create("Button",\n        {caption:"btn3",left:10,top:10},\n        {onClick:function(){alert("btn3")}}\n    ) \n\n);',
                    caption:'method 3 : linb.create()'
                }
            ])
            .setValue(code1);
        }, 
        _clk:function(){
            var str=this.ciMethods.getUIValue();
            try{
                eval(str);
            }catch(e){
                alert('Cant execute your code, check it first!');
                return;
            }
        }
    }
});