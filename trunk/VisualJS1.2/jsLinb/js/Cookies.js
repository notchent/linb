
Class("linb.Cookies", null,{
    Static:{
        set:function(key,value,days){
            key=encodeURIComponent(key);
            value=encodeURIComponent(value);

            var ep,date;
        	if(typeof days == 'number' && isFinite(days)){
        		date = new Date();
        		date.setTime(date.getTime()+(days*24*60*60*1000));
        		ep = "; expires="+date.toGMTString();
        	}else{
        	    ep = "";
        	}
        	document.cookie = key+"="+value+ep+"; path=/";
        	return this;
        },
        get:function(key){
            key=encodeURIComponent(key);
        	var nEQ = key + "=",
        	    ca = document.cookie.split(';'),
        	    i,c;
        	for(i=0;i < ca.length;i++){
        		c = ca[i];
        		while(c.charAt(0)==' ')
        		    c = c.substring(1,c.length);
        		if (c.indexOf(nEQ) === 0)
        		    return decodeURIComponent(c.substring(nEQ.length,c.length));
        	}
        	return '';
        },
        remove:function(key){
        	return this.set(key,"",-1);
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