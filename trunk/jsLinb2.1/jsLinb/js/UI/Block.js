Class("linb.UI.Block", "linb.UI.Widget",{
    Initialize:function(){
        var self=this,
            t = self.getTemplate();
        //modify
        _.merge(t.FRAME.BORDER,{
            className:'uiw-border uibg-bar {clsBorderType1}',
            PANEL:{
                tagName:'div',
                className:'{clsBorderType2}',
                style:'{background}',
                text:'{html}'+linb.UI.$childTag
            }
        },'all');
        //set back
        self.setTemplate(t);

        //get default Appearance
        t = self.getAppearance();
        //modify
        _.merge(t,{
            PANEL:{
                position:'relative',
                overflow:'auto'
            }
        });
        //set back
        self.setAppearance(t);
    },
    Static:{
        Behaviors:{
            DropableKeys:['PANEL']
        },
        DataModel:{
            //delete those properties
            disabled:null,
            tips:null,
            html:{
                action:function(v){
                    this.getSubNode('PANEL').html(v);
                }
            },
            borderType:{
                ini:'outset',
                listbox:['none','inset','outset','groove','ridge'],
                action:function(v){
                    var me=this,
                        p=me.properties,
                        n1=me.getSubNode('BORDER'), n2=me.getSubNode('PANEL'),
                        reg=/^uiborder-/,
                        ins='uiborder-inset',
                        outs='uiborder-outset',
                        root=me.root;
                    n1.removeClass(reg);
                    n2.removeClass(reg);
                    switch(v){
                        case 'inset':
                        n1.addClass(ins);
                        break;
                        case 'outset':
                        n1.addClass(outs);
                        break;
                        case 'groove':
                        n1.addClass(ins);
                        n2.addClass(outs);
                        break;
                        case 'ridge':
                        n1.addClass(outs);
                        n2.addClass(ins);
                        break;
                    }

                    //force to resize
                    me.box._setB(me);
                    linb.UI.$tryResize(me,root.width(),root.height());
                }
            },
            background:{
                ini:'',
                action:function(v){
                    this.getSubNode('PANEL').css('background',v);
                }
            },
            width:100,
            height:100
        },
        _setB:function(profile){
            var p=profile.properties,type=p.borderType;
            p.$hborder=p.$vborder=p.$iborder=0;
            if(type=='inset'||type=='outset'){p.$hborder=p.$vborder=1;p.$iborder=0;}
            else if(type=='groove'||type=='ridge'){p.$hborder=p.$vborder=p.$iborder=1;}
        },
        LayoutTrigger:function(){
            var v=this.properties.borderType;
            if(v!='none')this.boxing().setBorderType(v,true);
        },
        _prepareData:function(profile){
            var data=arguments.callee.upper.call(this, profile);
            data.background= data.background?'background:'+data.background:'';
            return data;
        },        
        _onresize:function(profile,width,height){
            var size = arguments.callee.upper.apply(this,arguments),
                p=profile.properties,
                b=(p.$iborder||0)*2;
            if(size.width)size.width-=b;
            if(size.height)size.height-=b;
            profile.getSubNode('PANEL').cssSize(size,true);
        }
    }
});

