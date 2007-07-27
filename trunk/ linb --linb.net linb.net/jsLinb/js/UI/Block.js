Class("linb.UI.Block", ["linb.UI.Widget","linb.UI.iContainer"],{
    Initialize:function(){
        //get default template
        var t = this.getTemplate('default');
        //modify
        _.merge(t.FRAME.BORDER,{
            PANEL:{
                tagName:'div',
                text:'{html}'+linb.UI.$childTag
            }
        },'all');
        //set back
        this.setTemplate('default',t);

        //get default Appearance
        t = this.getAppearance('default') || {};
        //modify
        _.merge(t,{
            PANEL:{
                position:'absolute',
                left:'0',
                top:'0',
                overflow:'auto',
                'background-color':'#fff'
            }
        });
        //set back
        this.setAppearance('default',t);
    },
    Static:{
        Dropable:['PANEL'],
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
                    this.getSubNode(this.keys.PANEL).html(v);
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
            profile.getSubNode(profile.keys.PANEL).cssSize(size,true);
        }
    }
});

