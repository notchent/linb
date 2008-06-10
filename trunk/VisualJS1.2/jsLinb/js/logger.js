Class('linb.logger', null, {
    Static:{
        err:function(sMsg,sUrl,sLine){
            if(linb.browser.gek && sMsg=='Error loading script')
                return true;

            var self=linb.logger;
            try{
                self.log( 'An error raised!', ' >> Location: '+ sUrl + ' ( line ' + sLine + ' )', ' >> Message: '+sMsg);
                //older onError
                if(self._oe)
                    self._oe(sMsg,sUrl,sLine);
            }catch(e){
                return false;
            }
            return true;
        },
        trace:function(o,fun,arr,flag){
            var fun=fun||arguments.callee.caller,arr=arr||[];
            if(fun){
                arr.push('function "' + (fun.$name$||'') + '" in Class "' + (fun.$original$||'') +'"');
                if(fun.caller){
                    try{
                        arguments.callee(null,fun.caller,arr,1);
                    }catch(e){}
                }
            }
            if(!flag){
                var a=[];
                a.push(' >> Error Info:');
                if(typeof o == 'object')
                    for(var i in o)
                        a.push(' -- ' + i + " : " + o[i]);
                else
                    a.push(o);
                a.push(' >> Error Path: ' + arr.join(' < '));
                linb.logger.log.apply(linb.logger,a);
            }
        },
        log:function(){
            var win,doc,div,str,self=this,arr=arguments;
            if(!(win=self._win) || self._win.closed) {
                win = self._win = window.open("", "_blank", "width=520,height=300,scrollbars=1,resizable=1,status=0,location=0,menubar=0,toolbar=0");
                if(!win)return;
                win.moveTo(0,0);
                doc = win.document;
                doc.write("<html><head><title>Debug Log of LINB</title></head><body style='font-size:12px'></body></html>");
                doc.close();
            }
            win.focus();
            doc = win.document;
            div = doc.createElement("div");
            div.style.border='solid 1px #CDCDCD';
            div.appendChild(doc.createTextNode('At '+ new Date ));
            doc.body.appendChild(div);
            for(var i=0,l=arr.length;i<l;i++){
                str=arr[i];
                div = doc.createElement("div");
                div.appendChild(doc.createTextNode(str));
                doc.body.appendChild(div);
            }
        }
    },
    Initialize:function(){
       //window.onerror=this.err;

        if(linb.browser.gek && window.console){
            linb.log =function(){
                if(window.console)
                    console.log.call(console, [_.toArr(arguments), (_() - linb.log.time )+"ms"]);
                linb.log.time = _();
            }
        }

        linb.message = function(content, caption, type, width, time){
           width = width || 200;
           if(linb.browser.ie)width=width+(width%2);
           var div, h, me=arguments.callee,
           stack=me.stack||(me.stack=[]),
           t=linb(window), left = t.scrollLeft() + t.width()/2 - width/2, height=t.height(), st=t.scrollTop();

           if(!(div=stack.pop())){
               div =
               '<div style="font-size:0;line-height:0;border:solid 1px #cdcdcd;position:absolute;overflow:visible;top:-50px;z-index:'+linb.dom.top_zIndex+'; background:#fefefe">' +
               '<div style="font-size:14px;overflow:hidden;font-weight:bold;padding:2px;"></div>'+
               '<div style="padding:5px;overflow:hidden;"></div>'+
               '</div>';
               div = linb.create(div);
               if(div.edge)div.edge();
               linb(document.body).addLast(div);
            }
            div.setStyle({left:left+'px', width:width+'px', visibility:'visible'})
            .first().html(caption||'')
            .next().html(content||'');

            if(me.last && div!=me.last){
                var l=me.last.left();
                me.last.fx({left:[l,l+(me.last.width+width)/2+20]}).start();
            }
            me.last = div;
            me.last.width = width;

            //height() is ok
            h = div.height();

            if(linb.browser.ie6){
                div.width(width+10)
                .last().width(width);
            }

            div.fx({top:[st-h-20,st+20]}).start();
            _.asyRun(function(){
                div.fx({top:[st+20, height+20]},null,function(){stack.push(div); div.hide()}).start();
            }, time||5000);
        };

    }
});