//Edge for add border to a dom node
Class("linb.UI.Edge","linb.UI.Resizer",{
    Instance:{
        attachTo:function(target, parent, tieId){
            var v=this.get(0);

            //set target first
            v._target= linb(target);
            v._parent= parent || linb(document.body);

            //add to dom
            v._parent.attach(this);

            this.resetTarget(v._target);
//<<
            v.$edgeId = linb(target).id();
            if(v.properties.borderActive){
                var t = v.behavior.TAG;
                var s = linb(tieId);
                if(s)s
                .addObserver('afterMouseover', 'tag', -1, t.afterMouseover, [v])
                .addObserver('afterMouseout', 'tag', -1, t.afterMouseout, [v])
                .addObserver('afterMouseover', 'tag', -1, t.afterMouseover, [v])
                .addObserver('afterMouseout', 'tag', -1, t.afterMouseout, [v]);
            }
//>>
            return this;
        },
        setChecked:function(v){
            return this.each(function(profile){
                if(v)
                    profile.addTagClass(profile.root, profile.keys.KEY, '-checked');
                else
                    profile.removeTagClass(profile.root, profile.keys.KEY, '-checked');
            });
        }
    },
    Initialize:function(){
        _.each({
            // add Edge to linb.dom plugin
            edged :function(properties, target, onUpdate, tieId){
                var o=this.get(0);
                properties=_.hash(properties);
                var r = new linb.UI.Edge(properties).attachTo(target||o, linb([o],false), tieId);
                //r.rePosSize();

                //set event
                if(onUpdate)
                    r.onUpdate(onUpdate);
                return r;
            },
            isEdged:function(){
                // for dom
                var s = this.id(), b=false;
                // for dom Node, destroy shadows
                linb.UI.Edge._cache.each(function(o){
                    if(o.$edgeId==s){b=true;return false;}
                });
                return b;
            },
            getEdge:function(){
                // for dom
                var s = this.id(), b=null;
                // for dom Node, destroy shadows
                linb.UI.Edge._cache.each(function(o){
                    if(o.$edgeId==s){b=o;return false;}
                });
                return b && b.boxing();
            },
            unEdged:function(){
                var s = this.id();
                // for dom Node, destroy resizers
                linb.UI.Edge._cache.each(function(o){
                    if(o.$edgeId==s)
                        o.boxing().destroy();
                });
                return this;
            }
        },function(o,i){
            linb.dom.plugIn(i,o);
        });
    },
    Static:{
        Appearances:{'default':{
            KEY:{
                position:'static',
                width:'0',
                height:'0',
                '_font-size':'0px',
                '_line-height':'0px',
                visibility: 'hidden',
                /*for get top Index, when it's static*/
                'z-index':'50'
            },
            'T, RT, R, RB, B, LB, L, LT':{
                $order:1,
                position:'absolute',
                display:'block',
                border:'solid 1px',
                //'background-color': '#fff',
                'z-index':'30',
                visibility: 'visible',
                '_font-size':'0px',
                '_line-height':'0px'
            },
            'RT, RB, LB, LT':{
                'z-index':'40',
                '_font-size':'0px',
                '_line-height':'0px'
            },
            T:{
               background: linb.UI.getCSSImgPara('v.gif', ' repeat-x left top')
            },
            B:{
                background: linb.UI.getCSSImgPara('v.gif', ' repeat-x left bottom')
            },
            'KEY-mouseover T, KEY-mouseover B':{
                $order:1,
                'background-image':linb.UI.getCSSImgPara('v_mouseover.gif')
            },
            'KEY-checked T, KEY-checked B, KEY-mousedown T, KEY-mousedown B':{
                $order:2,
                'background-image':linb.UI.getCSSImgPara('v_mousedown.gif')
            },
            L:{
                background: linb.UI.getCSSImgPara('h.gif', ' repeat-y left top')
            },
            R:{
               background: linb.UI.getCSSImgPara('h.gif', ' repeat-y right top')
            },
            'KEY-mouseover L, KEY-mouseover R':{
                $order:1,
                'background-image': linb.UI.getCSSImgPara('h_mouseover.gif')
            },
            'KEY-checked L, KEY-checked R, KEY-mousedown L, KEY-mousedown R':{
                $order:2,
                'background-image': linb.UI.getCSSImgPara('h_mousedown.gif')
            },
            LT:{
                background: linb.UI.getCSSImgPara('corner.gif', ' no-repeat left top')
            },
            RT:{
               background: linb.UI.getCSSImgPara('corner.gif', ' no-repeat right top')
            },
            RB:{
                background: linb.UI.getCSSImgPara('corner.gif', ' no-repeat right bottom')
            },
            LB:{
                background: linb.UI.getCSSImgPara('corner.gif', ' no-repeat left bottom')
            },
            'KEY-mouseover LT, KEY-mouseover RT, KEY-mouseover RB, KEY-mouseover LB':{
                $order:1,
                'background-image': linb.UI.getCSSImgPara('corner_mouseover.gif')
            },
            'KEY-checked LT, KEY-checked RT, KEY-checked RB, KEY-checked LB, KEY-mousedown LT, KEY-mousedown RT, KEY-mousedown RB, KEY-mousedown LB':{
                $order:2,
                'background-image' : linb.UI.getCSSImgPara('corner_mousedown.gif')
            },
            HIDDEN:{
                $order:20,
                'border-width': '0'
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{TAG:'KEY'},
            _clickEffect:{TAG:'KEY'}
        }},
        DataModel:{
            child:true,
            borderActive:false,
            changable:false
        }
    }
});