Class('linb.UI.Clock', 'linb.UI.iWidget', {
    Static:{
        drawHours : function(x,y,r,clr){
            var i,t,arr=[];
            for(i=0;i<12;i++){
                t=(360/12)*i/180*Math.PI;
                arr[arr.length]=this.drawLine('', x, y, x+Math.sin(t)*r, y-Math.cos(t)*r, 2, clr);
            }
            return arr.join('');
        },
        drawMinutes: function(x,y,r,clr){
            var i,t,arr=[];
            for(i=0;i<60;i++){
                t=(360/60)*i/180*Math.PI;
                arr[arr.length]=this.drawLine('', x, y, x + Math.sin(t)*r, y-Math.cos(t)*r, 1, clr);
            }
            return arr.join('');
        },
        drawLine : function(id, x1, y1, x2, y2, sz, clr){
            var tpl = function(x,y,w,h,clr){
                    return '<div style="position:absolute;'+
                    'left:' + x + 'px;'+
                    'top:' + y + 'px;'+
                    'width:' + w + 'px;'+
                    'height:' + h + 'px;'+
                    'clip:rect(0,'+w+'px,'+h+'px,0);'+
                    'background-color:' + clr +
                    ';overflow:hidden;">' +
                    '<\/div>'
                },
                _x2, _y2, dx, dy, x, y, yIncr, _s, ad, pr, pru, p, ox,
                arr=[];
            sz = sz||1;
            clr = clr||'#000';

            if(x1 > x2){
                _x2 = x2;
                _y2 = y2;
                x2 = x1;
                y2 = y1;
                x1 = _x2;
                y1 = _y2;
            }
            dx = x2-x1;
            dy = Math.abs(y2-y1);
            x = x1;
            y = y1;
            yIncr = (y1 > y2)? -1 : 1;

            if(dx >= dy){
                if(dx > 0 && sz-3 > 0){
                    _s = (sz*dx*Math.sqrt(1+dy*dy/(dx*dx))-dx-(sz>>1)*dy) / dx;
                    _s = (!(sz-4)? Math.ceil(_s) : Math.round(_s)) + 1;
                }
                else
                    _s = sz;
                ad = Math.ceil(sz/2);
                pr = dy<<1;
                pru = pr - (dx<<1);
                p = pr-dx;
                ox = x;
                while(dx > 0){
                    --dx;
                    ++x;
                    if(p > 0){
                        arr[arr.length]=tpl(ox, y, x-ox+ad, _s, clr);
                        y += yIncr;
                        p += pru;
                        ox = x;
                    }
                    else p += pr;
                }
                arr[arr.length]=tpl(ox, y, x2-ox+ad+1, _s, clr);
            }else{
                if(sz-3 > 0){
                    _s = (sz*dy*Math.sqrt(1+dx*dx/(dy*dy))-(sz>>1)*dx-dy) / dy;
                    _s = (!(sz-4)? Math.ceil(_s) : Math.round(_s)) + 1;
                }
                else
                    _s = sz;
                ad = Math.round(sz/2);
                pr = dx<<1;
                pru = pr - (dy<<1);
                p = pr-dy;
                oy = y;
                if(y2 <= y1){
                    ++ad;
                    while(dy > 0){
                        --dy;
                        if(p > 0){
                            arr[arr.length]=tpl(x++, y, _s, oy-y+ad, clr);
                            y += yIncr;
                            p += pru;
                            oy = y;
                        }else{
                            y += yIncr;
                            p += pr;
                        }
                    }
                    arr[arr.length]=tpl(x2, y2, _s, oy-y2+ad, clr);
                }else{
                    while(dy > 0){
                        --dy;
                        y += yIncr;
                        if(p > 0){
                            arr[arr.length]=tpl(x++, oy, _s, y-oy+ad, clr);
                            p += pru;
                            oy = y;
                        }else
                            p += pr;
                    }
                    arr[arr.length]=tpl(x2, oy, _s, y2-oy+ad+1, clr);
                }
            }
//display:none;
            return '<div id="' +
                    id + '" ' +
                    'style="overflow:visible;width:0;height:0;">' +
                    arr.join('') +
                    '<\/div>'
        }
    }
});