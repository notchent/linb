Class("linb.UI.ProgressBar", ["linb.UI.Widget","linb.UI.iForm"],{
    Instance:{
        setCtrlValue:function(value){
            return this.each(function(profile){
                profile.getSubNode('FILL').width(value+"%");
                profile.getSubNode('CAP').text(value +"%");
            });
        }        
    },
    Initialize:function(){
        var self=this,
            d  = 'default',
            t = self.getTemplate(d);
        //modify
        _.merge(t.FRAME.BORDER,{
            FILL:{
                tagName:'div',
                style:'width:{value}%;background:{background};',
                text:'{html}'+linb.UI.$childTag
            },
            INN:{
                tagName:'div',
                CAP:{
                    $order:2,
                    tagName:'div',
                    text:'{value}%'
                }
            }            
        },'all');
        //set back
        self.setTemplate(d,t);

        //get default Appearance
        t = self.getAppearance(d) || {};
        //modify
        _.merge(t,{
            BORDER:{
                border:'solid 1px'
            },
            INN:{
                display:'table',
                position:'absolute',
                left:0,
                top:0,
                width:'100%',
                height:'100%'
            },
            CAP:{
                display:'table-cell',
                'text-align':'center',
                'vertical-align':'middle'
            },
            FILL:{
                position:'absolute',
                left:0,
                top:0,
                height:'100%',
                width:'0%'
            }
        });
        //set back
        self.setAppearance(d,t);
    },
    Static:{
        DataModel:{
            //delete those properties
            icon:null,
            iconPos:null,
            value:0,
            width:300,
            height:24,
            background:{
                ini:'#336699',
                action:function(v){
                    this.getSubNode('FILL').setStyle('background',v);
                }
            },
            $border:1
        },
        EventHandlers:{
            onFinish:function(profile){}
        }
    }
});

