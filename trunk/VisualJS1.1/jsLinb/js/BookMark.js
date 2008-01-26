Class("linb.BookMark",null,{
    Static:{
        fid:'linb:bookmark',
        /* set ajax callback function
        callback: function(hashStr<"string after #">)
        */
    	iniBookMark: function(callback ){
    	    var self=this;
    		self.callback = callback;
    		var hash = location.hash;

    		self.lastHash = hash;
    		if(linb.browser.ie) {
    			if(self.lastHash=='')self.lastHash = '#';

                var n=document.createElement("div");
                n.style.display = "none";
                document.body.appendChild(n);
    			n.innerHTML = '<iframe id="'+this.fid+'" style="display: none;"></iframe>';
    			var ihistory = document.getElementById(this.fid), iframe = ihistory.contentWindow.document;
    			iframe.open();
    			iframe.close();
    			iframe.location.hash = hash;
    		}else if(linb.browser.kde) {
    			// etablish back/forward stacks
    			self.backStack = [];
    			self.backStack.length = history.length;
    			self.forwardStack = [];
    			self.isFirst = true;
    		}
    		self.callback(hash.replace(/^#/, ''));
            setInterval(self.threadCheck,100);
    		//linb.thread('$bookmark',[this.threadCheck],100, null, null, null, true).start();
    		return self;
    	},

        //check location.hash change periodically
    	threadCheck: function(){
    	    var self=linb.BookMark;
    		if(linb.browser.ie) {
    		    var ihistory = document.getElementById(self.fid), iframe = ihistory.contentWindow.document;
    			hash = iframe.location.hash;
    			if(hash != self.lastHash) {
    				self.lastHash = location.hash = hash;
    				self.callback(hash.replace(/^#/, ''));
    			}
    		}else if(linb.browser.kde) {
    			if(!self.dontCheck) {
    				var historyDelta = history.length - self.backStack.length;
    				if (historyDelta) { // back or forward button has been pushed
    					self.isFirst = false;
    					if(historyDelta < 0) { // back button has been pushed
    						// move items to forward stack
    						for (var i = 0; i < Math.abs(historyDelta); i++) self.forwardStack.unshift(self.backStack.pop());
    					} else { // forward button has been pushed
    						// move items to back stack
    						for (var i = 0; i < historyDelta; i++) self.backStack.push(self.forwardStack.shift());
    					}
    					var cachedHash = self.backStack[self.backStack.length - 1];
    					if (cachedHash != undefined) {
    						self.lastHash = location.hash;
    						self.callback(cachedHash);
    					}
    				} else if (self.backStack[self.backStack.length - 1] == undefined && !self.isFirst) {
    					// back button has been pushed to beginning and URL already pointed to hash (e.g. a bookmark)
    					// document.URL doesn't change in Safari
    					if (document.URL.indexOf('#') >= 0) {
    						self.callback(document.URL.split('#')[1]);
    					} else {
    						var current_hash = location.hash;
    						self.callback('');
    					}
    					self.isFirst = true;
    				}
    			}
    		}else{
    			// otherwise, check for location.hash
    			var hash = location.hash;
    			if(hash != self.lastHash) {
    				self.lastHash = hash;
    				self.callback(hash.replace(/^#/, ''));
    			}
    		}
    	},
        /* change string after '#'
        * flag: true => change location hash only, don't call callback function
        */
    	setBookMark: function(hash, flag){
    	    var self=this;
            if(self.lastHash == '#' + hash)return false;

    		if(linb.browser.ie) {
    			var ihistory = document.getElementById(self.fid), iframe = ihistory.contentWindow.document;
                iframe.open();
    			iframe.close();
    			iframe.location.hash = location.hash = self.lastHash = '#' + hash;
    		}else if(linb.browser.kde) {

    			self.dontCheck = true;
        		self.backStack.push(hash);
        		self.forwardStack.length = 0;
        		self.isFirst = true;

    			var t=self;
    			_.asyRun(function(){t.dontCheck=false;t=null;},300);

    			location.hash = self.lastHash = hash;
    		}else
    		    location.hash = self.lastHash = '#' + hash;

            //use manual action
    		if(flag)
    		    self.lastHash = location.hash;
    		//use callback action
    		else
    		    self.callback(hash);
    	},
        //hook link(<a ...>xxx</a>) click action
    	hookLinkClick:function(fun, target){
            linb([document]).onClick(function(p,e,src){
                var s = location.href.split('#')[0],
                    t=linb.event,
                    o = t.getSrc(e),b,i=0,
                    b
                ;
                do{
                    if(o.tagName == 'A'){
                        b=true;
                        break;
                    }
                    if(++i>8)break;
                }while(o=o.parentNode)
                if(b && !t.getKey(e)[2] && t.getBtn(e)=='left'){
                    if(o.href.indexOf(s+'#')!=-1)
                        _.tryF(fun, [o.href.replace(s,'')], target);
                    return false;
                }
            },'hookA',0);
            return this;
    	}
    }
});