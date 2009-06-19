 Class('App.linb_UI_LinkList', 'linb.Com',{
    Instance:{
        base:["linb.UI"],
        required:["linb.UI.LinkList"],
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host = this,
                children = [],
                append = function(child){
                    children.push(child.get(0))
                };
            
            append((new linb.UI.LinkList)
                .host(host,"linklist1")
                .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
                .setLeft(40)
                .setTop(40)
                .setWidth(250)
                .setHeight(50)
            );
            
            append((new linb.UI.LinkList)
                .host(host,"linklist2")
                .setItems([{"id":"a","caption":"itema","tips":"item a"},{"id":"b","caption":"itemb","tips":"item b"},{"id":"c","caption":"itemc","tips":"item c"}])
                .setLeft(40)
                .setTop(90)
                .setWidth(250)
                .setHeight(50)
                .onItemClick("_linklist2_onitemclick")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        },
        _linklist2_onitemclick:function (profile, item, src) {
            linb.message(item.id);
        }
    }
});