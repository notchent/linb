
Class('App.Upload', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        required:["linb.UI.Div", "linb.UI.ComboInput", "linb.UI.Input", "linb.UI.Block", "linb.UI.Button"], 
        //Com events
        events:{}, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Block)
                .setHost(host,"block1")
                .setWidth(520)
                .setHeight(80)
                .setShadow(true)
            );
            
            host.block1.append((new linb.UI.Div)
                .setHost(host,"vUpload")
                .setLeft(10)
                .setTop(10)
                .setWidth(100)
                .setHeight(20)
                .setHtml("$app.upload.txtUp")
                .setCustomClass({"KEY":"app-label"})
            );
            
            host.block1.append((new linb.UI.Div)
                .setHost(host,"vFromWeb")
                .setLeft(10)
                .setTop(40)
                .setWidth(100)
                .setHeight(20)
                .setHtml("$app.upload.txtWeb")
                .setCustomClass({"KEY":"app-label"})
            );
            
            host.block1.append((new linb.UI.ComboInput)
                .setHost(host,"iUploader")
                .setLeft(120)
                .setTop(9)
                .setWidth(230)
                .setType("upload")
            );
            
            host.block1.append((new linb.UI.Input)
                .setHost(host,"iWeb")
                .setLeft(120)
                .setTop(40)
                .setWidth(230)
                .setValueFormat("^(http|https|ftp)\\:\\/\\/[\\w\\-\\_\\.]+[\\w\\-\\_](:[\\w]*)?\\/?([\\w\\-\\._\\?\\,\\'\\/\\\\\\+&amp;%\\$#\\=~])*$")
            );
            
            host.block1.append((new linb.UI.Button)
                .setHost(host,"btnUp")
                .setLeft(358)
                .setTop(8)
                .setWidth(142)
                .setCaption("$app.caption.upload")
                .setVAlign("middle")
                .onClick("_up_click")
            );
            
            host.block1.append((new linb.UI.Button)
                .setHost(host,"btnWeb")
                .setLeft(358)
                .setTop(39)
                .setWidth(142)
                .setCaption("$app.caption.openweb")
                .setVAlign("middle")
                .onClick("_btnweb_onclick")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _up_click:function(profile){
            if(this.iUploader.getUIValue()){
                 var file=this.iUploader.getUploadObj();
                _.tryF(this.onUpload,[file]);
                this.iUploader.resetValue();
            }
        }, 
        _btnweb_onclick:function(profile){
            var o=this.iWeb;
            if(o.checkValid()){
                _.tryF(this.onOpenWeb,[o.getUIValue()]);
                o.resetValue();
            }
        }
    }
});