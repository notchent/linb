
Class("linb.Cookies", null,{
    Static:{
        set:function(key,value,days,path,domain,isSecure){
	        if(key){
    	        document.cookie = escape(key) + "=" + escape(value) +
    		        (days?";expires="+(new Date((new Date()).getTime()+(24*60*60*1000*days))).toGMTString():"")+
    		        (path?";path="+path:"")+
    		        (domain?";domain="+domain:"")+ 
    		        (isSecure?";secure":"");
    		}
    		return this;
        },
        get:function(key){
        	var i,a,ca = document.cookie.split( "; " );
        	for(i=0;i<ca.length;i++){
        		a=ca[i].split("=");
        		if(a[0]==escape(key))
        		    return a[1]?unescape(a[1]):'';
        	}
        	return null;
        },
        remove:function(key){
        	return this.set(key,"",-1).set(key,"/",-1);
        },
        //get uri para from string
        getURIParas:function(str,key){
            if(!str)
                return key?'':{};
            var arr,hash={},a=str.split('&'),o;
            for(var i=0,l=a.length;i<l;i++){
                o=a[i];
                arr=o.split('=');
                hash[decodeURIComponent(arr[0])]=decodeURIComponent(arr[1]);
            }
            return key?hash[key]:hash;
        }
    }
});