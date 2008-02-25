//tools
Class("linb.tools", null,{
    Static:{
        evalScripts:function(nodes){
             nodes
             .dig('script')
             .each(function(o){
                 eval( o.text || o.textContent || o.innerHTML || "");
             });
        },
        filterCode:function(str){
            with (str) return slice(indexOf("<!--linb:code:begin-->") + 22, lastIndexOf("<!--linb:code:end-->"));
        },

        hashCode:function(str){
            var $={
                // bits per input character. 8 - ASCII; 16 - Unicode
                size   : 8,
                //Calculate the SHA-1 of an array of big-endian words, and a bit length
                get: function(x, len){
                  //append padding
                  x[len >> 5] |= 0x80 << (24 - len % 32);
                  x[((len + 64 >> 9) << 4) + 15] = len;

                  var i,j,t,
                  w = Array(80),
                  a =  1732584193,
                  b = -271733879,
                  c = -1732584194,
                  d =  271733878,
                  e = -1009589776
                  ;

                  for(i = 0; i < x.length; i += 16){
                    var oa = a,
                    ob = b,
                    oc = c,
                    od = d,
                    oe = e;

                    for(j = 0; j < 80; j++){
                      if(j < 16) w[j] = x[i + j];
                      else w[j] = this.rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
                      t = this._add(this._add(this.rol(a, 5), this._ft(j, b, c, d)),
                                       this._add(this._add(e, w[j]), this._kt(j)));
                      e = d;
                      d = c;
                      c = this.rol(b, 30);
                      b = a;
                      a = t;
                    }

                    a = this._add(a, oa);
                    b = this._add(b, ob);
                    c = this._add(c, oc);
                    d = this._add(d, od);
                    e = this._add(e, oe);
                  }
                  return Array(a, b, c, d, e);
                },
                // Perform the appropriate triplet combination function for the current
                _ft : function(t, b, c, d){
                  if(t < 20) return (b & c) | ((~b) & d);
                  if(t < 40) return b ^ c ^ d;
                  if(t < 60) return (b & c) | (b & d) | (c & d);
                  return b ^ c ^ d;
                },
                //Determine the appropriate additive constant for the current iteration
                _kt: function(t){
                  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
                         (t < 60) ? -1894007588 : -899497514;
                },
                //Add integers, wrapping at 2^32. This uses 16-bit operations internally
                //to work around bugs in some JS interpreters.
                _add:function(x, y){
                  var l = (x & 0xFFFF) + (y & 0xFFFF), i = (x >> 16) + (y >> 16) + (l >> 16);
                  return (i << 16) | (l & 0xFFFF);
                },
                //Bitwise rotate a 32-bit number to the left.
                rol:function(i, j){
                  return (i << j) | (i >>> (32 - j));
                },
                //Convert an 8-bit or 16-bit string to an array of big-endian words
                //In 8-bit function, characters >255 have their hi-byte silently ignored.
                str_arr:function(str){
                  var b = Array(),
                  m = (1 << this.size) - 1;
                  for(var i = 0; i < str.length * this.size; i += this.size){
                    b[i>>5] |= (str.charCodeAt(i / this.size) & m) << (32 - this.size - i%32);
                  }
                  return b;
                },
                //Convert an array of big-endian words to a hex string.
                arr_str:function(b){
                  var limit = "0123456789abcdef",
                  str = "";
                  for(var i = 0; i < b.length * 4; i++){
                    str += limit.charAt((b[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
                           limit.charAt((b[i>>2] >> ((3 - i%4)*8  )) & 0xF);
                  }
                  return str;
                }
            };
            return $.arr_str($.get($.str_arr(str),str.length * $.size));
        },

        URIv:function(str, key, value){
            var r ='([&|\?|#]|\\b)('+ key +'=)([^&]*)([&]?)';
            if(_.isStr(value)){
                if(new RegExp(r).test(str)){
                    return str.replace(new RegExp(r),'$1$2'+encodeURIComponent(value)+'$4');
                }else{
                    return ((str=="")?"":(str=="#")?"#":(str=="?")?"?" :(str+'&')) + key + '=' + encodeURIComponent(value);
                }
            }else{
                var a = str.match(new RegExp(r));
                return _.isNull(a)?'':decodeURIComponent(a[3]);
            }
        }/*,
        parseUrls : function(str){
            return str.replace(/(http:\/\/+[\w\/\-%&#=.,?+$]+)/g, "<a href='$1' target='_blank'>$1</a>").replace(/([\w.-]+@[\w.-]+\.\w+)/g, "<a href='mailto:$1'>$1</a>");
        },
        parseText : function(str) {
            var lp = /(\n[&nbsp;]*) /g;
            while(lp.test(str)) {
                str = str.replace(lp, "$1&nbsp;");
            }
            str = str.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
            // to window platform way
            str = str.replace(/\r/g, "\n");
            return str;
        },
        parse :function(str){
            str=linb.dom.escapeHTML(str);
            return this.parseUrls(this.parseText(str));
        }*/
    }
});