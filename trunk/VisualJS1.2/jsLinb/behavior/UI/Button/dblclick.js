{
    _hoverEffect:{KEY:['BORDER']},
    _clickEffect:{KEY:['BORDER']},
    _focusHook:{FOCUS:1},
    onClick:function(profile, e, src){
        return false;
    },
    onDblclick:function(profile, e, src){
        if(profile.properties.disabled)return false;
        //onClick event
        profile.boxing().onClick(profile, e, profile.properties.$UIvalue);
    },
    onRewh:function(profile, e, src){
        var o = linb([profile.domNode],false),w=null,h=null;
        if(e.width)
            w=o.width();
        if(e.height)
            h=o.height();
        profile.box.resize(profile, w, h);
    }
}