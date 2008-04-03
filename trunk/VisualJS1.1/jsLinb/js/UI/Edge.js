//Edge for add border to a dom node(display:block;position:absolute) / or a widget inherite from linb.UI.Widget
Class("linb.UI.Edge","linb.UI.iWidget",{
    Instance:{
        _attachTo:function(target, parent, tieId){
            var self=this, v=self.get(0);
            //add to dom
            parent.attach(self);
            //save id
            v.$edgeId = linb(target).id();
            //observer
            if(v.properties.borderActive){
                var t = v.behavior.TAG,
                    s = linb(tieId),
                    k='afterMouse',
                    m
                ;
                if(s)s
                .addObserver(m=k+'over', 'tag', -1, t[m], [v])
                .addObserver(m=k+'out', 'tag', -1, t[m], [v])
                .addObserver(m=k+'down', 'tag', -1, t[m], [v])
                .addObserver(m=k+'up', 'tag', -1, t[m], [v]);
            }
            return target;
        }
    },
    Initialize:function(){
        _.each({
            // add Edge to linb.dom plugin
            edge :function(properties, target, tieId){
                return new linb.UI.Edge(properties)._attachTo(target||this, this, tieId);
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
            unEdge:function(){
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
        //for linb.UI.Widget
        _.each({
            _border:function(key, args){
                return this.each(function(o){
                    var target = o.getSubNode('BORDER');
                    if(target.isEdged())return;

                    var v = o.boxing(),
                        d = o.properties,
                        n = v.reBoxing(),
                        w = n.width(),
                        h = n.height(),
                        bs=d._borderSize
                        ;
                    d.$paddingLeft+=bs;
                    d.$paddingTop+=bs;
                    d.$paddingBottom+=bs;
                    d.$paddingRight+=bs;
                    args = args || {};
                    _.merge(args,{
                        offset:bs/2,
                        enlarge:bs/2
                    },'without');

                    o.$border = target.edge(args, target, o.makeRootId());

                    if(d.$fix)
                        v.setWidth(w+bs).setHeight(h+bs);
                    else
                        o.box.resize(o,w,h);

                    o.resetCache();

                    if(target.isShadow && target.isShadow()){
                        var o= target.getShadow();
                        o.setOffset(o.getOffset()+bs/2+1);
                    }
                });
            },
            _unBorder:function(){
                return this.each(function(o){
                    var target = o.getSubNode('BORDER');
                    if(!target.isEdged())return;

                    var v = o.boxing(),
                        d = o.properties,
                        n = v.reBoxing(),
                        w = n.width(),
                        h = n.height(),
                        bs=d._borderSize
                        ;
                    d.$paddingLeft-=bs;
                    d.$paddingTop-=bs;
                    d.$paddingBottom-=bs;
                    d.$paddingRight-=bs;
                    target.unEdge();
                    o.box.resize(o,w,h);

                    if(target.isShadow()){
                        var o= target.getShadow();
                        o.setOffset(o.getOffset()-bs/2-1);
                    }
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
                        b._border(v);
                    else
                        b._unBorder();
                }
            },
            _borderSize:4
        });
    },
    Static:{
        Templates:{'default':{
            tagName:'div',
            TAG:{},
            T:{style:'width:100%;left:0;top:-{edge}px;height:{hSize}px;'},
            RT:{style:'top:-{edge}px;right:-{edge}px;width:{hSize}px;height:{hSize}px;'},
            R:{style:'height:100%;top:0;right:-{edge}px;width:{hSize}px;' },
            RB:{style:'right:-{edge}px;bottom:-{edge}px;width:{hSize}px;height:{hSize}px;'},
            B:{style:'width:100%;left:0;bottom:-{edge}px;height:{hSize}px;'},
            LB:{style:'left:-{edge}px;bottom:-{edge}px;width:{hSize}px;height:{hSize}px;'},
            L:{style:'height:100%;top:0;left:-{edge}px;width:{hSize}px;' },
            LT:{style:'top:-{edge}px;left:-{edge}px;width:{hSize}px;height:{hSize}px;'}
        }},
        Appearances:{'default':{
            KEY:{
                position:'static',
                display:'inline',

                //don't use width/height to trigger hasLayout in IE6
                //width:0,
                //height:0,

                '_font-size':0,
                '_line-height':0,
                visibility: 'hidden',
                /*for get top Index, when it's static*/
                'z-index':'50'
            },
            TAG:{
                '_font-size':0,
                '_line-height':0
            },
            'T, RT, R, RB, B, LB, L, LT':{
                $order:1,
                position:'absolute',
                display:'block',
                border:0,
                'z-index':30,
                visibility: 'visible',
                '_font-size':0,
                '_line-height':0
            },
            'RT, RB, LB, LT':{
                'z-index':40
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
            }
        }},
        Behaviors:{'default':{
            _hoverEffect:{TAG:'KEY'},
            _clickEffect:{TAG:'KEY'}
        }},
        DataModel:{
            offset:2,
            enlarge:2,
            borderActive:false
        },
        prepareData:function(profile){
            var t = profile.properties,s=parseInt(t.offset);
            // handlerSize
            t.hSize = s*2;
            // reset offset value
            t.edge = s+parseInt(t.enlarge);
            arguments.callee.upper.call(this, profile);
        }
    }
});