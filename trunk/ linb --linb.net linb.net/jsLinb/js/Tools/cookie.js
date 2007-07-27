
Class("linb.tools.cookie", null,{
    Static:{
        set:function(key,value,days){
            key=encodeURIComponent(key);
            value=encodeURIComponent(value);

            var ep;
        	if(_.isNumb(days)){
        		var date = new Date();
        		date.setTime(date.getTime()+(days*24*60*60*1000));
        		ep = "; expires="+date.toGMTString();
        	}else{
        	    ep = "";
        	}
        	document.cookie = key+"="+value+ep+"; path=/";
        },
        get:function(key){
            key=encodeURIComponent(key);

        	var nEQ = key + "=";
        	var ca = document.cookie.split(';');
        	for(var i=0;i < ca.length;i++){
        		var c = ca[i];
        		while(c.charAt(0)==' '){
        		    c = c.substring(1,c.length);
        		}
        		if (c.indexOf(nEQ) === 0){
        		    return decodeURIComponent(c.substring(nEQ.length,c.length));
        		}
        	}
        	return '';
        },
        remove:function(key){
        	this.set(key,"",-1);
        }
    }
});