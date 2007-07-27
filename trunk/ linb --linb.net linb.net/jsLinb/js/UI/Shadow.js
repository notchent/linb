//shadow class, add a plugin to linb.dom
Class("linb.UI.Shadow","linb.UI",{
    Instance:{
        getTarget:function(){
            return this.get(0)._target;
        },
        attachTo:function(o){
            //to linb.dom
            o=o.reBoxing();
            //set target first
            this.get(0)._target=o.get(0);
            // add dom for dom node
            o.attach(this);
            return this;
        }
    },
    Initialize:function(){
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
               width:'0',
               height:'0',
               _display:'inline'
            },
            'B, RB, R':{
                position:'absolute',
                display:'block',
                '*font-size':'0',
                '*line-height':'0'
            },
            B:{
                left:'0',
                width:'100%',
                background: linb.browser.ie6 ? '' : linb.UI.getCSSImgPara('B.png', 'repeat-x left bottom'),
                _filter: linb.UI.getImgPath2('B.png', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="{*}",sizingMethod="crop")')
            },
            RB:{
                background: linb.browser.ie6?'':linb.UI.getCSSImgPara('RB.png', 'left top'),
                _filter: linb.UI.getImgPath2('RB.png', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="{*}",sizingMethod="crop")')
            },
            R:{
                top:'0',
                height:'100%',
                background: linb.browser.ie6?'': linb.UI.getCSSImgPara('R.png', 'repeat-y right top'),
                _filter: linb.UI.getImgPath2('R.png', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="{*}",sizingMethod="crop")')
            }
        }},
        DataModel:{
            size:{
                ini:8,
                action: function(value){
                    var offset =this.properties.offset;
                    this.getSubNode(this.keys.R).width(value).top(offset).right(-value-offset);
                    this.getSubNode(this.keys.RB).width(value).height(value).right(-value-offset).bottom(-value-offset);
                    this.getSubNode(this.keys.B).height(value).left(offset).bottom(-value-offset);
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
        Behaviors:{'default':{}},
        createdTrigger:function(){
            // refresh height for IE6
            if(linb.browser.ie) this.root.ieTrigger()
        },
        hide:function(profile,value){
            linb([profile.domNode],false).children().display(value?'none':'block');
        }
    }
});