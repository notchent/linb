Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        required:["linb.UI.Button", "linb.UI.Tabs", "linb.UI.Layout"], 

        _button5_onclick:function (profile, e, value) {
            var dlg=new linb.UI.Dialog;
            dlg.append( new linb.UI.ColorPicker);
            dlg.renderOnto('dialog');
            
            linb('datepicker').append(new linb.UI.DatePicker);
            
            profile.boxing().destroy();
        }, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Button)
                .host(host,"button5")
                .setLeft(290)
                .setTop(250)
                .setCaption("render")
                .onClick("_button5_onclick")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }
    }
});