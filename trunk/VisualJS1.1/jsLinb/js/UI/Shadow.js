//shadow class, add a plugin to linb.dom
Class("linb.UI.Shadow","linb.UI.iWidget",{
    Instance:{
        getTarget:function(){
            return this.get(0)._target;
        },
        attachTo:function(o){
            //to linb.dom
            o=o.reBoxing();
            var self=this;
            //set target first
            self.get(0)._target=o.get(0);
            // add dom for dom node
            o.attach(self);
            return o;
        }
    },
    Initialize:function(){
        //for linb.dom
        _.each({
            // add shadow to linb.dom plugin
            shadow :function(properties){
                var o=this.get(0);
                return new linb.UI.Shadow(properties).attachTo(linb([o],false));
            },
            isShadow :function(){
                // for dom
                var s = this.get(0),b=false;
                // for dom Node, destroy shadows
                linb.UI.Shadow._cache.each(function(o){
                    if(o._target==s){b=true;return false;}
                });
                return b;
            },
            getShadow:function(){
                // for dom
                var s = this.get(0),b=null;
                // for dom Node, destroy shadows
                linb.UI.Shadow._cache.each(function(o){
                    if(o._target==s){b=o;return false;}
                });
                return b.boxing();
            },
            unShadow:function(){
                // for dom
                var s = this.get();
                // for dom Node, destroy shadows
                linb.UI.Shadow._cache.each(function(o){
                    if(s.exists(linb(o._target).get(0)))
                        o.boxing().destroy();
                });
                return this;
            }
        },function(o,i){
            linb.dom.plugIn(i,o);
        });
        //for linb.UI.Widget
        _.each({
            _shadow:function(key){
                return this.each(function(o){
                    var target = o.getSubNode('BORDER');
                    if(target.isShadow())return;

                    var v = o.boxing(),
                        d = o.properties,
                        n = v.reBoxing(),
                        w = n.width(),
                        h = n.height()
                        ;
                    o.$shadow=target.shadow({size:d._shadowSize, offset:d.$paddingBottom||d.$border});

                    d.$paddingBottom +=d._shadowSize;
                    d.$paddingRight +=d._shadowSize;

                    if(d.$fix)
                        v.setWidth(w+d._shadowSize).setHeight(h+d._shadowSize);
                    else
                        o.box.resize(o,w,h);

                });
            },
            _unShadow:function(){
                return this.each(function(o){
                    var target = o.getSubNode('BORDER');
                    if(!target.isShadow())return;
                    target.unShadow();

                    var v = o.boxing(),
                        d = o.properties,
                        n = v.reBoxing(),
                        w = n.width(),
                        h = n.height()
                        ;
                    d.$paddingBottom -=d._shadowSize;
                    d.$paddingRight -=d._shadowSize;
                    o.box.resize(o,w,h);
                    delete o.$shadow
                });
            }
        },function(o,i){
            linb.UI.Widget.plugIn(i,o);
        });
        linb.UI.Widget.setDataModel({
            shadow:{
                ini:false,
                action: function(v){
                    var b=this.boxing();
                    if(v)b._shadow(v);
                    else b._unShadow();
                }
            },
            _shadowSize:8
        });
    },
    Static:{
        Templates:{'default':{
            tagName:'div',
            R:{
                tagName: 'div',
                style:'top:{offset}px;width:{size}px;right:-{pos}px;'
            },
            RB:{
                tagName: 'div',
                style:'height:{size}px;width:{size}px;right:-{rbpos}px;bottom:-{rbpos}px;'
            },
            B:{
                tagName: 'div',
                style: 'left:{offset}px;height:{size}px;bottom:-{pos}px;'
            }
        }},
        Appearances:{'default':{
            KEY:{
               width:0,
               height:0,
               _display:'inline'
            },
            'B, RB, R':{
                position:'absolute',
                display:'block',
                '*font-size':0,
                '*line-height':0
            },
            B:{
                left:0,
                width:'100%',
                background: linb.browser.ie6 ? '' : linb.UI.getCSSImgPara('B.png', 'repeat-x left bottom'),
                _filter: linb.UI.getImgPath2('B.png', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="{*}",sizingMethod="crop")')
            },
            RB:{
                background: linb.browser.ie6?'':linb.UI.getCSSImgPara('RB.png', 'left top'),
                _filter: linb.UI.getImgPath2('RB.png', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="{*}",sizingMethod="crop")')
            },
            R:{
                top:0,
                height:'100%',
                background: linb.browser.ie6?'': linb.UI.getCSSImgPara('R.png', 'repeat-y right top'),
                _filter: linb.UI.getImgPath2('R.png', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="{*}",sizingMethod="crop")')
            }
        }},
        DataModel:{
            size:{
                ini:8,
                action: function(value){
                    var self=this,
                    offset =self.properties.offset;
                    self.getSubNode('R').width(value).top(offset).right(-value-offset);
                    self.getSubNode('RB').width(value).height(value).right(-value-offset).bottom(-value-offset);
                    self.getSubNode('B').height(value).left(offset).bottom(-value-offset);
                }
            },
            offset:{
                ini:0,
                action: function(value){
                    this.boxing().setSize(this.properties.size, true);
                }
            }
        },
        prepareData:function(profile){
            arguments.callee.upper.call(this, profile);
            var t = profile.data;
            t.pos = (parseInt(t.size)||0) + (parseInt(t.offset)||0);
            t.rbpos = t.pos-1;
        },
        renderedTrigger:function(){
            // refresh height for IE6
            if(linb.browser.ie) this.root.ieTrigger()
        },
        hide:function(profile,value){
            linb([profile.domNode]).children().display(value?'none':'block');
        }
    }
});