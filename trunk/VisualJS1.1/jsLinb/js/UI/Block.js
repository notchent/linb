Class("linb.UI.Block", ["linb.UI.Widget","linb.UI.iContainer"],{
    Initialize:function(){
        var self=this,
            d  = 'default',
            t = self.getTemplate(d);
        //modify
        _.merge(t.FRAME.BORDER,{
            PANEL:{
                tagName:'div',
                text:'{html}'+linb.UI.$childTag
            }
        },'all');
        //set back
        self.setTemplate(d,t);

        //get default Appearance
        t = self.getAppearance(d) || {};
        //modify
        _.merge(t,{
            PANEL:{
                position:'absolute',
                left:0,
                top:0,
                overflow:'auto',
                'background-color':'#fff'
            }
        });
        //set back
        self.setAppearance(d,t);
    },
    Static:{
      //  Dropable:['PANEL'],
        DataModel:{
            //delete those properties
            dataBinder:null,
            dataField:null,
            value:null,
            disabled:null,
            caption:null,
            icon:null,
            iconPos:null,
            tips:null,
            html:{
                ini:'',
                action:function(v){
                    this.getSubNode('PANEL').html(v);
                }
            },

            width:100,
            height:100
        },
        EventHandlers:{
            beforeValueSet:null,
            afterValueSet:null,
            beforeValueUpdated:null,
            afterValueUpdated:null,
            beforeHoverEffect:null,
            beforeClickEffect:null,
            beforeNextFocus:null
        },
        resize:function(profile,w,h){
            var size = arguments.callee.upper.apply(this,arguments);
            profile.getSubNode('PANEL').cssSize(size,true);
        }
    }
});

