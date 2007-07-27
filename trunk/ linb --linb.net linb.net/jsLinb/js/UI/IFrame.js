Class("linb.UI.IFrame", ["linb.UI.iWidget","linb.UI.iMisc"],{
    Instance:{
        submit:function(action, data, method, enctype, flag){
            data=_.hash(data);
            method=_.str(method,'get').toUpperCase();
            action=_.str(action);
            var _t=[];
            _.each(data,function(o,i){
                _t.push('<textarea name="'+i+'">'+(typeof o=='object'?_.serialize(o):o)+'</textarea>');
            });
            var formStr='<form target="'+this.get(0).domId+'" action="'+action+'" method="'+method  + (enctype?'" enctype="' +enctype:'') +  '">'+_t.join('')+'</form>';

            var form=formStr.toDom(false);

            if(linb.browser.ie6)
                linb.temp.cancelBeforeload=true;
            //show message, not appropriate for download
            if(flag){
                linb.dom.setCover('Getting file...');
                linb.iframeTrigger=function(){
                    linb.dom.setCover(false);
                    delete linb.iframeTrigger;
                };
            }

            form.get(0).submit();
            form.remove();
        }
    },
    Initialize:function(){
    },
    Static:{
        cssNone:true,
        Templates:{'default':{
            style:'{left}{top}{width}{height}{right}{bottom}{zIndex}{position}',
            tagName:'iFrame',
            //for ie
            name:'{name}',
            src:'{src}'
        }},
        Behaviors:{'default':{
            onLoad:function(profile){
                if(profile.onResponse)
                    profile.boxing().onResponse(profile,  profile.box.getBody(profile.domNode).innerHTML);
            }
        }},
        Appearances:{'default':{
        }},
        DataModel:{
            width:100,
            height:100,
            src:{
                ini:'',
                action:function(v){
                    if(this.domNode)
                        this.root.src(v);
                }
            }
        },
        EventHandlers:{
            onLoad:function(profile, response){}
        },
        prepareData:function(profile){
            arguments.callee.upper.apply(this,arguments);
            profile.data.name = profile.key +":" + linb.UI.$ID +":";
        },
        createdTrigger:function(){
        },
        getBody: function(i){
            return (i.contentDocument || i.document).body;
        }
    }
});
