
Class('new_room', 'linb.Com',{
    Instance:{
        //base Class for this com
        base:["linb.UI"], 
        //requried class for this com
        required:["linb.UI.Dialog", "linb.UI.Panel", "linb.UI.ComboInput", "linb.UI.Label", "linb.UI.Button", "linb.UI.Input", "linb.UI.TextEditor"], 

        properties:{}, 
        events:{"onIniResource":"_oniniresource"}, 
        iniResource:function(com, threadid){
        }, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Dialog)
                .host(host,"dialog4")
                .setLeft(63)
                .setTop(93)
                .setWidth(597)
                .setCaption("新开房间")
            );
            
            host.dialog4.append((new linb.UI.Button)
                .host(host,"button7")
                .setLeft(300)
                .setTop(220)
                .setCaption("确认")
            );
            
            host.dialog4.append((new linb.UI.Input)
                .host(host,"input1")
                .setLeft(100)
                .setTop(10)
                .setWidth(170)
            );
            
            host.dialog4.append((new linb.UI.ComboInput)
                .host(host,"comboinput9")
                .setLeft(380)
                .setTop(40)
                .setWidth(170)
                .setItems([{"id":"a", "caption":"item a", "image":"img/demo.gif"}, {"id":"b", "caption":"item b", "image":"img/demo.gif"}, {"id":"c", "caption":"item c", "image":"img/demo.gif"}, {"id":"d", "caption":"item d", "image":"img/demo.gif"}])
                .setValue("a")
            );
            
            host.dialog4.append((new linb.UI.Button)
                .host(host,"button8")
                .setLeft(430)
                .setTop(220)
                .setCaption("取消")
            );
            
            host.dialog4.append((new linb.UI.TextEditor)
                .host(host,"texteditor4")
                .setLeft(40)
                .setTop(130)
                .setWidth(510)
                .setHeight(80)
            );
            
            host.dialog4.append((new linb.UI.Input)
                .host(host,"input2")
                .setLeft(100)
                .setTop(40)
                .setWidth(170)
            );
            
            host.dialog4.append((new linb.UI.Input)
                .host(host,"input4")
                .setLeft(380)
                .setTop(10)
                .setWidth(170)
            );
            
            host.dialog4.append((new linb.UI.ComboInput)
                .host(host,"comboinput8")
                .setLeft(100)
                .setTop(70)
                .setWidth(170)
                .setItems([{"id":"a", "caption":"item a", "image":"img/demo.gif"}, {"id":"b", "caption":"item b", "image":"img/demo.gif"}, {"id":"c", "caption":"item c", "image":"img/demo.gif"}, {"id":"d", "caption":"item d", "image":"img/demo.gif"}])
                .setValue("a")
            );
            
            host.dialog4.append((new linb.UI.Label)
                .host(host,"label5")
                .setLeft(290)
                .setTop(44)
                .setWidth(80)
                .setCaption("客人姓名")
            );
            
            host.dialog4.append((new linb.UI.Label)
                .host(host,"label4")
                .setLeft(290)
                .setTop(14)
                .setWidth(80)
                .setCaption("预缴金额")
            );
            
            host.dialog4.append((new linb.UI.Label)
                .host(host,"label1")
                .setLeft(10)
                .setTop(14)
                .setWidth(80)
                .setCaption("客人姓名")
            );
            
            host.dialog4.append((new linb.UI.Label)
                .host(host,"label3")
                .setLeft(10)
                .setTop(74)
                .setWidth(80)
                .setCaption("房间号码")
            );
            
            host.dialog4.append((new linb.UI.Label)
                .host(host,"label2")
                .setLeft(10)
                .setTop(44)
                .setWidth(80)
                .setCaption("身份证号")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        iniExComs:function(com, hreadid){
        }, 
        _oniniresource:function(com,threadid){
        //to do something     
        
        }
    }
});