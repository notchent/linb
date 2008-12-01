Class('VisualJS.OpenFile', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Dialog)
                .host(host,"dlg")
                .setWidth(460)
                .setHeight(90)
                .setResizer(false)
                .setCaption("Open jsLinb Class File")
                .setMinBtn(false)
                .setMaxBtn(false)
                .setPinBtn(false)
                .beforeClose("_beforeClose")
            );
            
            host.dlg.append((new linb.UI.Button)
                .host(host,"btn")
                .setLeft(351)
                .setTop(20)
                .setWidth(80)
                .setCaption("Open")
                .onClick("_open")
            );
            
            host.dlg.append((new linb.UI.ComboInput)
                .host(host,"combo")
                .setLeft(21)
                .setTop(20)
                .setWidth(320)
                .setValueFormat("^(http|https)\\:\\/\\/[\\w\\-\\_\\.]+[\\w\\-\\_](:[\\w]*)?\\/?([\\w\\-\\._\\?\\,\\'\\/\\\\\\+&amp;%\\$#\\=~])*$")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _open:function (profile, item, group, e, src) {
            if(!this.combo.checkValid())return false;
            var url=this.combo.getUIValue();
            _.tryF(this.onOpenFile,[url],this);
        },
        _beforeClose:function(profile){
            profile.boxing().hide();
            return false;
        }
    }
});