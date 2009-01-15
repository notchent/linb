Class('App.linb_UI_Calendar', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host = this,
                children = [],
                append = function(child){
                    children.push(child.get(0))
                };

            append((new linb.UI.Block)
                .host(host,"block1")
                .setLeft(50)
                .setTop(80)
                .setWidth(340)
                .setHeight(304)
                .setResizer(true)
                .setBorder(true)
            );

            host.block1.append((new linb.UI.Calendar)
                .host(host,"calendar1")
                .setLeft(10)
                .setTop(40)
                .setDropKeys("iEvent")
                .onDrop("_calendar1_ondrop")
            );

            append((new linb.UI.Button)
                .host(host,"button3")
                .setLeft(170)
                .setTop(30)
                .setCaption("drag me to calendar")
                .onRender("_button3_aftercreated")
            );

            append((new linb.UI.Button)
                .host(host,"button5")
                .setLeft(150)
                .setTop(410)
                .setCaption("linb.setLang('cn')")
                .onClick("_button5_onclick")
            );

            return children;
            // ]]code created by jsLinb UI Builder
        },
        required:["linb.UI.Block","linb.UI.Calendar","linb.UI.Button"],
        _button3_aftercreated:function (profile) {
            profile.boxing().dragable('iEvent','data');
        },
        _calendar1_ondrop:function (profile, e, node, key, data, item) {
            linb.message('drop key="'+key+'" date="'+data+'" at '+profile.getSubId(node.id))
        },
        _button5_onclick:function (profile, e, value) {
            linb.setLang('cn');
        }
    }
});