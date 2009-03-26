//add/get/remove border to a dom node(display:block;position:absolute) / or a widget inherite from linb.UI.Widget
Class("linb.UI.Border","linb.UI",{
    Instance:{
        _attachTo:function(target, eventTrigger){
            var self=this, v=self.get(0);
            //add to dom
            target.append(self);
            //save id
            v.$edgeId = linb(target).id();
            v.$tieId = eventTrigger;
            v.$attached=true;
            //add event
            if(v.properties.borderActive){
                var t = v.behavior.TAG, tag='tag',n=v.domNode;
                if(linb.Dom.byId(eventTrigger))
                    linb(eventTrigger).afterMouseover(function(p,e){
                        if(p.properties.disabled)return;
                        _.tryF(t.afterMouseover,[v,e,n],this)
                    },tag).afterMouseout(function(p,e){
                        if(p.properties.disabled)return;
                        _.tryF(t.afterMouseout,[v,e,n],this)
                    },tag).afterMousedown(function(p,e){
                        if(p.properties.disabled)return;
                        _.tryF(t.afterMousedown,[v,e,n],this)
                    },tag).afterMouseup(function(p,e){
                        if(p.properties.disabled)return;
                        _.tryF(t.afterMouseup,[v,e,n],this)
                    },tag);
            }
            return target;
        },
        _detach:function(){
            var self=this, v=self.get(0),n,nl=null,tag='tag';
            delete v.$attached;
            if(n=v.$tieId)
                if(n=linb.Dom.byId(n))
                    linb(n).afterMouseover(nl,tag).afterMouseout(nl,tag).afterMousedown(nl,tag).afterMouseup(nl,tag);
            return self;
        }
    },
    Initialize:function(){
        //for linb.Dom
        _.each({
            addBorder :function(properties){
                var target = linb([this.get(0)]), eventTrigger=arguments[1]||target.id();
                return new linb.UI.Border(properties)._attachTo(target, eventTrigger);
            },
            $getBorder:function(){
                var s = this.id(), b;
                _.arr.each(linb.UI.Border._cache,function(o){
                    if(o.$edgeId==s){b=o;return false;}
                });
                return b && b.boxing();
            },
            removeBorder:function(){
                var s = this.id();
                _.arr.each(linb.UI.Border._cache,function(o){
                    if(o.$edgeId==s)
                        o.boxing()._detach().destroy();
                });
                return this;
            }
        },function(o,i){
            linb.Dom.plugIn(i,o);
        });
        //for linb.UI.Widget
        _.each({
            _border:function(properties){
                return this.each(function(o){
                    var target = o.getSubNode('BORDER');
                    if(target.$getBorder())return;
                    if(!properties)properties={};
                    if(o.properties._customBorder)
                        properties._bkey=o.getClass('KEY');
                    o.$border=target.addBorder(properties);
                    o.clearCache();
                });
            },
            _unBorder:function(){
                return this.each(function(o){
                    var target = o.getSubNode('BORDER');
                    if(!target.$getBorder())return;
                    target.removeBorder()
                    delete o.$border;
                });
            }
        },function(o,i){
            linb.UI.Widget.plugIn(i,o);
        });
        linb.UI.Widget.setDataModel({
            border:{
                ini:false,
                action: function(v){
                    var b=this.boxing();
                    if(v)
                        b._border();
                    else
                        b._unBorder();
                }
            }
        });
    },
    Static:{
        Templates:{
            tagName:'div',
            TAG:{},
            T:{className:'{cls_t}'},
            RT:{className:'{cls_rt}',$order:1},
            R:{className:'{cls_r}'},
            RB:{className:'{cls_rb}',$order:1},
            B:{className:'{cls_b}'},
            LB:{className:'{cls_lb}',$order:1},
            L:{className:'{cls_l}'},
            LT:{className:'{cls_lt}',$order:1}
        },
        Appearances:{
            KEY:{
                //don't use width/height to trigger hasLayout in IE6
                width:0,
                height:0,
                _display:'inline',
                'font-size':0,
                'line-height':0
            },
            'TAG,T, RT, R, RB, B, LB, L, LT':{
                position:'absolute',
                display:'block',
                'font-size':0,
                'line-height':0
            },
            T:{
                width:'100%',
                left:0,
                top:'0px',
                height:'3px',
                background: linb.UI.$bg('vertical.gif', ' repeat-x left top')
            },
            B:{
                width:'100%',
                left:0,
                bottom:'0px',
                height:'3px',
                background: linb.UI.$bg('vertical.gif', ' repeat-x left bottom')
            },
            L:{
                height:'100%',
                top:0,
                left:'0px',
                width:'3px',
                background: linb.UI.$bg('horizontal.gif', ' repeat-y left top')
            },
            R:{
               height:'100%',
               top:0,
               right:'0px',
               width:'3px',
               background: linb.UI.$bg('horizontal.gif', ' repeat-y right top')
            },
            LT:{
                top:'0px',
                left:'0px',
                width:'3px',
                height:'3px',
                background: linb.UI.$bg('corner.gif', ' no-repeat left top')
            },
            RT:{
               top:'0px',
               right:'0px',
               width:'3px',
               height:'3px',
               background: linb.UI.$bg('corner.gif', ' no-repeat right top')
            },
            RB:{
                right:'0px',
                bottom:'0px',
                width:'3px',
                height:'3px',
                background: linb.UI.$bg('corner.gif', ' no-repeat right bottom')
            },
            LB:{
                left:'0px',
                bottom:'0px',
                width:'3px',
                height:'3px',
                background: linb.UI.$bg('corner.gif', ' no-repeat left bottom')
            }/*,
            'KEY-mouseover T, KEY-mouseover B':{
                $order:1,
                'background-image':linb.UI.$bg('vertical_mouseover.gif')
            },
            'KEY-checked T, KEY-checked B, KEY-mousedown T, KEY-mousedown B':{
                $order:2,
                'background-image':linb.UI.$bg('vertical_mousedown.gif')
            },
            'KEY-mouseover L, KEY-mouseover R':{
                $order:1,
                'background-image': linb.UI.$bg('horizontal_mouseover.gif')
            },
            'KEY-checked L, KEY-checked R, KEY-mousedown L, KEY-mousedown R':{
                $order:2,
                'background-image': linb.UI.$bg('horizontal_mousedown.gif')
            },
            'KEY-mouseover LT, KEY-mouseover RT, KEY-mouseover RB, KEY-mouseover LB':{
                $order:1,
                'background-image': linb.UI.$bg('corner_mouseover.gif')
            },
            'KEY-checked LT, KEY-checked RT, KEY-checked RB, KEY-checked LB, KEY-mousedown LT, KEY-mousedown RT, KEY-mousedown RB, KEY-mousedown LB':{
                $order:2,
                'background-image' : linb.UI.$bg('corner_mousedown.gif')
            }*/
        },
        Behaviors:{
            HoverEffected:{TAG:'KEY'},
            ClickEffected:{TAG:'KEY'}
        },
        DataModel:{
            _bkey:"",
            borderActive:false
        },
        _prepareData:function(profile){
            var data = arguments.callee.upper.call(this, profile),
                pk=profile.properties._bkey;

            data.cls_t = pk?pk+"-b-t":"";
            data.cls_rt = pk?pk+"-b-rt":"";
            data.cls_r = pk?pk+"-b-r":"";
            data.cls_rb = pk?pk+"-b-rb":"";
            data.cls_b = pk?pk+"-b-b":"";
            data.cls_lb = pk?pk+"-b-lb":"";
            data.cls_l = pk?pk+"-b-l":"";
            data.cls_lt = pk?pk+"-b-lt":"";

            return data;
        }
    }
});