Class('App.linb_UI_Label', 'linb.Com',{
    Instance:{
        base:["linb.UI"], 
        required:["linb.UI.Label"], 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Label)
                .host(host,"label6")
                .setLeft(64)
                .setTop(250)
                .setWidth(232)
                .setHeight(64)
                .setBorder(true)
                .setCaption("<strong>label</strong> (left/bottom)")
                .setHAlign("left")
                .setVAlign("bottom")
            );
            
            append((new linb.UI.Label)
                .host(host,"label2")
                .setLeft(64)
                .setTop(56)
                .setWidth(224)
                .setHeight(32)
                .setBorder(true)
                .setCaption("label with border")
            );
            
            append((new linb.UI.Label)
                .host(host,"label7")
                .setLeft(632)
                .setTop(128)
                .setWidth(136)
                .setHeight(80)
                .setBorder(true)
                .setResizer(true)
                .setCaption("resizable label")
                .setHAlign("center")
            );
            
            append((new linb.UI.Label)
                .host(host,"label9")
                .setLeft(336)
                .setTop(56)
                .setWidth(224)
                .setHeight(32)
                .setBorder(true)
                .setCaption("label (exStyle:'cursor:pointer')")
                .setCustomStyle({"KEY":"cursor:pointer"})
            );
            
            append((new linb.UI.Label)
                .host(host,"label10")
                .setLeft(336)
                .setTop(110)
                .setWidth(224)
                .setHeight(32)
                .setBorder(true)
                .setCaption("label with image")
                .setImage("img/demo.gif")
            );
            
            append((new linb.UI.Label)
                .host(host,"label11")
                .setLeft(280)
                .setTop(198)
                .setWidth(280)
                .setHeight(72)
                .setZIndex("2")
                .setBorder(true)
                .setCaption("label (zIndex:2)")
            );
            
            append((new linb.UI.Label)
                .host(host,"label1")
                .setLeft(65)
                .setTop(16)
                .setWidth(224)
                .setHeight(32)
                .setCaption("normal label")
            );
            
            append((new linb.UI.Label)
                .host(host,"label3")
                .setLeft(64)
                .setTop(158)
                .setWidth(224)
                .setHeight(32)
                .setCaption("label with shadow text")
                .setShadowText(true)
                .setFontSize("16px")
                .setFontWeight("bold")
            );
            
            append((new linb.UI.Label)
                .host(host,"label4")
                .setLeft(64)
                .setTop(206)
                .setWidth(232)
                .setHeight(32)
                .setBorder(true)
                .setCaption("<strong>label</strong> (center/middle)")
                .setHAlign("center")
            );
            
            append((new linb.UI.Label)
                .host(host,"label5")
                .setLeft(64)
                .setTop(110)
                .setWidth(224)
                .setHeight(32)
                .setBorder(true)
                .setShadow(true)
                .setCaption("label with border&shadow")
            );
            
            append((new linb.UI.Label)
                .host(host,"label12")
                .setLeft(280)
                .setTop(298)
                .setWidth(280)
                .setHeight(64)
                .setZIndex("2")
                .setBorder(true)
                .setCaption("label (set background in onRender event)")
                .onRender("_label12_aftercreated")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _label12_aftercreated:function (profile) {
             profile.getSubNode('BORDER').css('background','#fff');
        }
    }
});