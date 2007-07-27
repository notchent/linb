Class("linb.bookmark",null,{
    Static:{
        current_query:'',
        timeFlag:-1,
        id_history_iframe: "history_proxy",
        setCmdByKey:function(k,v,bAll){
            var s=String(window.location.hash).replace('#','');
            this.setCommand(linb.tools.URIv(s,k,v), bAll);
        },
        setCommand:function(s, bAll){
            var _t=window.location;

            if(linb.browser.ie){
                _t.href = _t.pathname + "#" + s ;
                var o=window.frames[this.id_history_iframe];
                if(o){
                    _t.href = _t.pathname + "#"+s ;
                    if(o.location.hash!==s){
                        o.location.href=o.location.pathname+"?"+s+"#"+s;
                    }
                }
            }else{
                //document.location.href = _t.pathname + "#" + s ;
                _t.hash="#"+s;
            }
            if(bAll===true){
                this.current_query= "#"+s;
            }
        },
        action:function(){
            var _t=window.location.hash;

            if(_t!==this.current_query && _t!=='' && _t!=='#' && _.isFun(linb.cache.pageaction)){
                //page action
                this.current_query=_t;
                linb.cache.pageaction(_t.replace('#',''));
            }
        },
        clear:function(){
            this.current_query="";
        }
    },
    Initialize:function(){
        linb.thread('thread_history',[this.action],400, null, null, null, true).start();
        if(linb.browser.ie){
            var _n=this.id_history_iframe;
            document.write("<iframe style='border:0px; width:0px; height:1px; position:absolute; left:-100px; top:-100px; visibility:visible;' name='"+_n+"' id='"+_n+"' src='"+_n+".html'></iframe>");
        }
    }
});