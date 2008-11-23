
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        required:["linb.UI.Pane", "linb.UI.ToolBar"], 
        //Com events
        events:{}, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.PopMenu)
                .host(host,"pop")
                .setItems(['item 1', 'item 2', 'item 3'])
            );
            
            append((new linb.UI.Pane)
                .host(host,"pane3")
                .setLeft(40)
                .setTop(50)
                .setWidth(610)
                .setHeight(160)
            );
            
            host.pane3.append((new linb.UI.ToolBar)
                .host(host,"toolbar5")
                .setItems([{"id":"grp1", "sub":[{"id":"a", "label":"normal button:", "caption":"button"},{"id":"b", "label":"image button:", "caption":"button",icon:'img/demo.gif'},  {"id":"c", label:"image only:",icon:'img/demo.gif' }]},{"id":"grp2", "sub":[{"id":"d", label:'status button:',"caption":"status", "statusButton":true}, {"id":"e", label:'drop button:',"caption":"drop", "dropButton":true},{"split":true}, {id:'clr',object: new linb.UI.ComboInput({type:'colorpicker'})},{id:'date',object: new linb.UI.ComboInput({type:'datepicker'})}]}])
                .onClick("_toolbar5_onclick")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _toolbar5_onclick:function (profile, item, group, e, src) {
            switch(item.id){
                case 'd':
                    linb.message(item.caption + " was clicked!" + " value was changed to " + item.value);
                break;
                case 'e':
                    this.pop.pop(src);
                break;
                default:
                    linb.message(item.caption + " was clicked!");
            }
        }
    }
});