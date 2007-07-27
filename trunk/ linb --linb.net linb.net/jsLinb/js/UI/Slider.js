Class("linb.UI.Slider", "linb.UI.Field",{
    Instance:{
        beforeBuild:function(profile){
            var t=profile.data;
            t.size = t.max.toString().blen()+3;
            t.len = t.max-t.min;
        },
        afterBuild:function(profile){
            profile.addTrigger(function(){
                this.box.setWidth(this, this.data.width);
            });
        }
    },
    Initialize:function(){
        this.setTemplate('',{
            _tagName : 'span',
            width : '{width}px',
            FOCUS:{
                _tagName:'button'
            },
            BOX:{
                _order:1,
                _tagName : 'div',
                MIN:{
                    _order:0,
                    _tagName : 'div'
                },
                MOVE:{
                    _order:1,
                    _tagName : 'div'
                },
                MAX:{
                    _order:2,
                    _tagName : 'div'
                }
            }
        })
        .setBehavior('',{
            _hoverEffect:{MIN:'MIN',MAX:'MAX',MOVE:'MOVE'},
            _clickEffect:{MIN:'MIN',MAX:'MAX'},
            onMouseup:function(profile, e){
                profile.getSubNode(profile.keys.FOCUS).focus();
            },
            FOCUS:{
                onKeydown:function(profile, e, src){
                    switch(linb.event.getKey(e)[0]){
                        case 'down':
                        case 'left':
                            profile.getSubNode(profile.keys.MIN).onMousedown();
                            break;
                        case 'up':
                        case 'right':
                            profile.getSubNode(profile.keys.MAX).onMousedown();
                            break;
                    }
                }
            },
            BOX:{
                onMousedown:function(profile, e, src){
                    var p1 = linb.event.getPos(e), p2 = linb([src],false).absPos();
                    profile.box.setValue(profile, ((p1.left-p2.left)-profile._L-profile._M/2)/profile._W);
                }
            },
            MIN:{
                onMousedown:function(profile, e, src){
                    profile.box.setValue(profile, profile._value - 0.05);
                    return false;
                }
            },
            MOVE:{
                onMousedown:function(profile, e, src){
                    if(!profile.data.disabled){
                        var value=profile._value, l=profile._W*value, r=profile._W - l;
                        linb([src],false).startDrag(e, {horizontal:true, type:'move', offset_left:l, offset_right:r});
                    }
                },
                onDrag:function(profile, e, src){
                    profile.box.setValue(profile, (linb([src],false).left()-profile._L)/profile._W, true);
                },
                onDragend:function(profile, e, src){
                    profile.box.setValue(profile, (linb([src],false).left()-profile._L)/profile._W);
                }
            },
            MAX:{
                onMousedown:function(profile, e, src){
                    profile.box.setValue(profile, profile._value + 0.05);
                    return false;
                }
            }
        })
        .setDataModel({
            min:0,
            max:100,
            value:{
                ini:0,
                set: function(value){
                    this.each(function(p){
                        var t=p.data;
                        value=_.parseFloat(value);
                        value = (value - t.min) / (t.max-t.min);
                        p.box.setValue(p, value);
                    });
                }
            },
            width:{
                ini:300,
                set: function(value){
                    this.box.setWidth(value);
                }
            }
        })
        .setEventHandlers({'onUpdate':[]});
    },
    Static:{
        setValue:function(pro, value, flag){
            if(value<0)value=0;
            if(value>1)value=1;
            pro._value=value;
            if(!flag)
                pro.getSubNode(pro.keys.MOVE).left(parseInt(pro._W*value) + pro._L);

            var t=pro.data;
            t.value = t.min + (t.max-t.min)*pro._value;
            t.value = _.parseInt(t.value*100)/100;

            if(pro.onUpdate)pro.onUpdate(t.value, pro);
            return this;
        },
        setWidth:function(pro, value){
            var box=pro.getSubNode(pro.keys.BOX); min=pro.getSubNode(pro.keys.MIN),max=pro.getSubNode(pro.keys.MAX),move = pro.getSubNode(pro.keys.MOVE);
            box.width(value);
            pro._W = box.clientWidth() - (pro._L=min.width()) - max.width() - (pro._M = move.width());

            return pro.boxing().setValue(pro.data.value);
        }
    }
});