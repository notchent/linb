Class("linb.coder", null,{
    Constructor:function(){
        return _.tryF(this.constructor.parse,arguments,this.constructor);
    },
    Initialize:function(){
        linb.css.add(
            '.sh {font-family: "Courier New" , Courier, mono;font-size: 12px;border: 1px solid #92D1E4;}'+
            '.sh .con{padding-bottom:3px;background-color: #fff;}'+
            '.sh .cmd{margin-left: 45px; padding: 3px 8px 3px 10px;font: 9px Verdana, Geneva, Arial, Helvetica, sans-serif;color: silver;border-bottom: 1px solid #EBEADB;}'+
            '.sh .cmd a{font-size: 12px;color: blue;text-decoration: none;margin-right: 10px;}'+
            '.sh .cmd a:hover{color: red;text-decoration: underline;}'+
            '.sh ol{color: #FF97A9; margin: 0px 0px 0px 45px; padding: 0; border-bottom: 1px solid #EBEADB; }'+
            '.sh ol li{border-left: 3px solid #6CE26C;padding-left: 10px;line-height: 14px;list-style: decimal none;margin:0;border-bottom: 1px dashed #E2E2E2;}'+
            '.sh ol li span{color: #000157;}'+
            '.sh .js .comment, .sh .php .comment{ color: green; }'+
            '.sh .js .string, .sh .php .string{ color: #ff1493; }'+
            '.sh .js .reg, .sh .php .reg{ color: #ff1493; }'+
            '.sh .js .number,.sh .php .number { color: darkred; }'+
            '.sh .js .keyword, .sh .php .keyword{ color: blue; }'+
            '.sh .js .keyword2, .sh .php .keyword2 { font-weight: bold; color: red; }'+
            '.sh .js .special, .sh .php .special{ font-weight: bold; color: navy; }'+
            '.sh .php .vars{color:#079BFA}'+
            '.sh .css .comment { color: green; }'+
            '.sh .css .string { color: red; }'+
            '.sh .css .colors { color: darkred; }'+
            '.sh .css .vars { color: #d00; }'+
            '.sh .css .number { color: blue; }'+
            '.sh .css .keyword {color:teal;}'+
            '.sh .css .selector {font-weight: bold; color: navy;}'+
            '.sh .html .comment { color: green; }'+
            '.sh .html .string{ color: #ff1493; }'+
            '.sh .html .script{ color: #ff1493; }'+
            '.sh .html .attr { color: blue; }'+
            '.sh .html .speical{color:#079BFA}'+
            '.sh .html .tag { font-weight: bold; color: navy; }'
        ,linb.getPath(this.KEY,'/css.css','appearance'));

        this.setProfile('js',{
            multicomment:this.$COM_REG.BLOCK_COMMENT,
    		comment: this.$COM_REG.LINE_COMMENT,
    		reg1: this.$COM_REG.REG1,
    		reg2 : this.$COM_REG.REG2,
    		string1: this.$COM_REG.DQ_STRING,
    		string2: this.$COM_REG.SQ_STRING,
    		number: this.$COM_REG.NUMBER,
    		keyword: "try|throw|catch|finally|arguments|break|case|continue|default|delete|do|else|false|" +
                     "for|function|if|in|instanceof|new|null|return|switch|this|true|typeof|var|void|while|with|" +
                     "toString|valueOf|window|prototype|document|" +
                     "escape|unescape|parseInt|parseFloat|setTimeout|clearTimeout|setInterval|clearInterval|" +
                     "NaN|isNaN|Infinity|Error",
    		keyword2: 'exists|isNull|isObj|isEmpty|isArr|isBool|isDate|isFun|isHash|isNumb|isStr|_.arr|_.bool|_.cls|_.date|_.fun|_.hash|_.numb|_.str|_.id|_|'+
                     'alias|host|attach|toArr|breakO|tryF|each|copy|clone|filter|asyRun|resetRun|merge|each|swap|removeFrom|filter|indexOf|clean|insertAny|serialize|unserialize|'+
                     'Class|Instance|Initialize|Before|After|Static|Constructor|'+
                     'reBoxing|copy|clone|left|top|right|bottom|startWith|endWith|initial|trim|ltrim|rtrim|blen|toDom|create',
    		special: /linb[\w\.]*|(\bon|before|after|set|get)[A-Z]\w*/
        }).setProfile('css',{
            multicomment:this.$COM_REG.BLOCK_COMMENT,
    		string: [this.$COM_REG.DQ_STRING, this.$COM_REG.SQ_STRING],
    		IGNORE: /\([^'")]*\)/,
    		keyword: [/@\w[\w.\s]*/,/attr|rect|rgb|url/],
    		selector: /[\w-:\[.#][^{};]*\{/,
    		colors: /\#[a-zA-Z0-9]{3,6}/,
    		number: [/(\d*\.?\d+|\d+\.?\d*)(cm|em|ex|pt|px|%|\:)?/],
	        vars :[/(-[\w-]+)\s*[ ]*:/, /([\w-]+)\s*[ ]*:/]
        }).setProfile('php',{
    		multicomment:this.$COM_REG.BLOCK_COMMENT,
    		comment: this.$COM_REG.LINE_COMMENT,
    		reg: this.$COM_REG.REG,
    		string: [this.$COM_REG.DQ_STRING, this.$COM_REG.SQ_STRING],
    		number: this.$COM_REG.NUMBER,
    		keyword: 'abs|acos|acosh|addcslashes|addslashes|' +
					'array_change_key_case|array_chunk|array_combine|array_count_values|array_diff|'+
					'array_diff_assoc|array_diff_key|array_diff_uassoc|array_diff_ukey|array_fill|'+
					'array_filter|array_flip|array_intersect|array_intersect_assoc|array_intersect_key|'+
					'array_intersect_uassoc|array_intersect_ukey|array_key_exists|array_keys|array_map|'+
					'array_merge|array_merge_recursive|array_multisort|array_pad|array_pop|array_product|'+
					'array_push|array_rand|array_reduce|array_reverse|array_search|array_shift|'+
					'array_slice|array_splice|array_sum|array_udiff|array_udiff_assoc|'+
					'array_udiff_uassoc|array_uintersect|array_uintersect_assoc|'+
					'array_uintersect_uassoc|array_unique|array_unshift|array_values|array_walk|'+
					'array_walk_recursive|atan|atan2|atanh|base64_decode|base64_encode|base_convert|'+
					'basename|bcadd|bccomp|bcdiv|bcmod|bcmul|bindec|bindtextdomain|bzclose|bzcompress|'+
					'bzdecompress|bzerrno|bzerror|bzerrstr|bzflush|bzopen|bzread|bzwrite|ceil|chdir|'+
					'checkdate|checkdnsrr|chgrp|chmod|chop|chown|chr|chroot|chunk_split|class_exists|'+
					'closedir|closelog|copy|cos|cosh|count|count_chars|date|decbin|dechex|decoct|'+
					'deg2rad|delete|ebcdic2ascii|echo|empty|end|ereg|ereg_replace|eregi|eregi_replace|error_log|'+
					'error_reporting|escapeshellarg|escapeshellcmd|eval|exec|exit|exp|explode|extension_loaded|'+
					'feof|fflush|fgetc|fgetcsv|fgets|fgetss|file_exists|file_get_contents|file_put_contents|'+
					'fileatime|filectime|filegroup|fileinode|filemtime|fileowner|fileperms|filesize|filetype|'+
					'floatval|flock|floor|flush|fmod|fnmatch|fopen|fpassthru|fprintf|fputcsv|fputs|fread|fscanf|'+
					'fseek|fsockopen|fstat|ftell|ftok|getallheaders|getcwd|getdate|getenv|gethostbyaddr|gethostbyname|'+
					'gethostbynamel|getimagesize|getlastmod|getmxrr|getmygid|getmyinode|getmypid|getmyuid|getopt|'+
					'getprotobyname|getprotobynumber|getrandmax|getrusage|getservbyname|getservbyport|gettext|'+
					'gettimeofday|gettype|glob|gmdate|gmmktime|ini_alter|ini_get|ini_get_all|ini_restore|ini_set|'+
					'interface_exists|intval|ip2long|is_a|is_array|is_bool|is_callable|is_dir|is_double|'+
					'is_executable|is_file|is_finite|is_float|is_infinite|is_int|is_integer|is_link|is_long|'+
					'is_nan|is_null|is_numeric|is_object|is_readable|is_real|is_resource|is_scalar|is_soap_fault|'+
					'is_string|is_subclass_of|is_uploaded_file|is_writable|is_writeable|mkdir|mktime|nl2br|'+
					'parse_ini_file|parse_str|parse_url|passthru|pathinfo|readlink|realpath|rewind|rewinddir|rmdir|'+
					'round|str_ireplace|str_pad|str_repeat|str_replace|str_rot13|str_shuffle|str_split|'+
					'str_word_count|strcasecmp|strchr|strcmp|strcoll|strcspn|strftime|strip_tags|stripcslashes|'+
					'stripos|stripslashes|stristr|strlen|strnatcasecmp|strnatcmp|strncasecmp|strncmp|strpbrk|'+
					'strpos|strptime|strrchr|strrev|strripos|strrpos|strspn|strstr|strtok|strtolower|strtotime|'+
					'strtoupper|strtr|strval|substr|substr_compare',
	        keyword2 :'and|or|xor|__FILE__|__LINE__|array|as|break|case|' +
					'cfunction|class|const|continue|declare|default|die|do|else|' +
					'elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|' +
					'extends|for|foreach|function|include|include_once|global|if|' +
					'new|old_function|return|static|switch|use|require|require_once|' +
					'var|while|__FUNCTION__|__CLASS__|' +
					'__METHOD__|abstract|interface|public|implements|extends|private|protected|throw',
            vars  : /\$\w+/
        }).setProfile('html',{
            multicomment: this.$COM_REG.HTML_COMMENT,
            tag:/\x02\/?\w+/,
            attr:/\w+=/,
            script: /(>([^<][^\/]*<+)*\/)(script|style)>/,
            special:/<!DOCTYPE[^>]+>/,
            string: [this.$COM_REG.DQ_STRING, this.$COM_REG.SQ_STRING]
        });
    },
    Static:{
        $COM_REG : {
            HTML_COMMENT: /<!\s*(--([^-]|[\r\n]|-[^-])*--\s*)>/,
            BLOCK_COMMENT2 : /(^|\n)\s*\/\*[^*@]*\*+([^\/][^*]*\*+)*\//,
            LINE_COMMENT2 : /(^|\n)\s*\/\/[^\n]*/,
            BLOCK_COMMENT : /\/\*[^*@]*\*+([^\/][^*]*\*+)*\//,
            LINE_COMMENT : /\/\/[^\n]*/,
            REG1 : /\s+(\/[^\/\n\r\*][^\/\n\r]*\/m?g?i?)\s*[:,;\r\n]/,
            REG2 : /[^\w\x24\/'"*)\]\?:]\/[^\/\n\r\*][^\/\n\r]*\/m?g?i?\s*[:,;\r\n]/,
            DQ_STRING : /"(\\.|[^"\\])*"/,
            SQ_STRING : /'(\\.|[^'\\])*'/,
            NUMBER : /-?(\d*\.?\d+|\d+\.?\d*)([eE][+-]?\d+|%)?\b/
        },

      /*
       A wrapper for lots regExp string.replace to only once iterator replace
       You can use it, when
       1.replace >10
       2.need protect some regexp
       3.every long string to replac

       str: will be replace
       reg, array: [string, string] or [regex, string] or [[],[]]
       target: to replace
       ignore_case: bool, for regexp symble 'i'
       return : replaced string

       For example:
       _.replace("aAa","a","*",true)
                will return "*A*"
       _.replace("aAa","a","*",false)
                will return "***"
       _.replace("aAa","a","*")
       _.replace("aAa",/a/,"*")         : "/a/" is OK, but not "/a/g"
       _.replace("aAa",["a","*"])
       _.replace("aAa",[["a","*"]])
                will return "***"
       _.replace("aAa",[["a","*"],[/A/,"-"]])
                will return "*-*"
      Notice: there is a '$0' symbol here, for protect
        _.replace("aba",[["ab","$0"],["a","*"]])
                will return "ab*"
      here, "ab" will be first matched and be protected to replace by express "a"
      */
        replace:function(str, reg, target, ignore_case){
            var i, len,_t, m,n, flag, a1 = [], a2 = [];
            var me=arguments.callee,
                reg1=me.reg1 || (me.reg1=/\\./g),
                reg2=me.reg2 || (me.reg2=/\(/g),
                reg3=me.reg3 || (me.reg3=/\$\d/),
                reg4=me.reg4 || (me.reg4=/^\$\d+$/),
                reg5=me.reg5 || (me.reg5=/'/),
                reg6=me.reg6 || (me.reg6=/\\./g),
                reg11=me.reg11 || (me.reg11=/(['"])\1\+(.*)\+\1\1$/)
            ;

            if(!_.isArr(reg)){reg=[reg,target]}else{ignore_case=target}
            if(!_.isArr(reg[0])){reg=[reg]};
            reg.each(function(o){
                m= (_.isStr(o[0])?o[0]:_.isReg(o[0])?String(o[0]).slice(1, -1):"");
                n= _.isFun(o[1])?o[1]:_.str(o[1]);
                len = ((m).replace(reg1, "").match(reg2) || "").length;
                if(!_.isFun(n)){
                    if (reg3.test(n)) {
                        //if only one para and valid
                        if (reg4.test(n)) {
                            _t = parseInt(n.slice(1));
                            if(_t<=len)n=_t;
                        }else{
                            flag = reg5.test(n.replace(reg6, "")) ? '"' : "'";
                            i = len;
                            while(i + 1)
                                n = n.split("$" + i).join(flag + "+a[o+"+ i-- +"]+" + flag);

                            n = new Function("a,o", "return" + flag + n.replace(reg11, "$1") + flag);
                        }
                    }
                }
                a1.push(m || "^$");
                a2.push([n, len, typeof n]);
            });

            var i,j,p,t;
            return str.replace(new RegExp("("+a1.join(")|(")+")", ignore_case ? "ig" : "g"), function(){
                if (!arguments[0]) return "";
                i=1;j=0;
                while (p = a2[j++]) {
                    if (t = arguments[i]) {
                        switch(p[2]) {
                            case 'function':
                                return p[0](arguments, i);
                            case 'number':
                                return arguments[p[0] + i];
                            default:
                                return p[0];
                        }
                    }else{i += p[1]+1;}
                }
            });
        },
        /*decode code
        str: source code
        key: js/php/css
        */
        decode:function(str, key){
            var reg, pre_arr, add_arr, arr=[];
            var deep=0,i,l=20,
                sf=function(i){var r=''; while(i--){r+=' ';} return r;},
                space=[''];

            for(i=1;i<l;i++)
                space.push(sf(i*4));


            if(key == 'html'){
                //for clear space before/after tag
                arr.push([/[\s]*(<[\w]+[^>]+>)[\s]*/, '$1']);
                arr.push([/[\s]*(<\/[\w]+>)[\s]*/, '$1']);
                str = this.replace(str, arr);

                arr.length=0;

                arr.push([this.$COM_REG.HTML_COMMENT,'$0\\n']);

                //ignore input and img
                arr.push([/<input[^>]+>/, function(a,i){return space[deep]+a[i]+'\n'}]);
                arr.push([/<img[^>]+>/, function(a,i){return space[deep]+a[i]+'\n'}]);
                arr.push([/<[\w]+[^>]*\/>/, function(a,i){return space[deep]+a[i]+'\n'}]);
                //for *
                arr.push([/[^<]+/, function(a,i){return space[deep]+a[i]+'\n'}]);

                //for <a>
                arr.push([/<[\w]+[^>]*>/, function(a,i){return space[deep++]+a[i]+'\n';}]);
                //for </a>
                arr.push([/<\/[\w]+>/, function(a,i){return space[--deep] + a[i] + '\n'}]);

                str = this.replace(str, arr, true);
            }else{
                reg = this.$COM_REG;
                var t,index1=1,index2=1,cache1={},cache2={}, result, result2,
                code1 = function(str,i) {
            		var ret = "#" + index1++ +";";
            		cache1[ret] = str[i];
            		return ret;
            	},
                code2 = function(str,i) {
            		var ret = "`" + index2++ +";";
            		cache2[ret] = str[i];
            		return ret;
            	},
            	//for multi line comment
            	restore1 = function(str){
                	return str.replace(/( *)(#\d+;)/g, function(a,n,m){
                	    n=n||'';
                		return n + cache1[m].replace(/^\s*/,'').replace(/\s*$/,'').replace(/(\n)( *)/g,'$1'+n);
                	});
                },
            	restore2 = function(str){
                	return str.replace(/`(\d+);/g, function(m){
                		return cache2[m].replace(/^\s*/,'').replace(/\s*$/,'');
                	});
                };
                str = linb.coder.replace(str, [
                    [reg.BLOCK_COMMENT2, code1],
                    [reg.LINE_COMMENT2, code2]
                ]);

                // pass reg
                pre_arr =[ [reg.REG1, '$0'], [reg.REG2, '$0'], [reg.DQ_STRING, '$0'], [reg.SQ_STRING, '$0']];
                // to no \n ,all space
                add_arr =[ [/(\b|\x24)\s+(\b|\x24)/, "$1 $2"], [/([+\-])\s+([+\-])/, "$1 $2"], [/\s+/, ""] ];
                if(key=='css'){
                    add_arr.insertAny([/\s+(\.)/, " $1"],2,true);
                    add_arr.insertAny([/(\d*\.?\d+|\d+\.?\d*)(cm|em|ex|pt|px|%|\:)?/, " $0 "],-1,true);
                }
                arr.length=0;
                arr.insertAny(pre_arr);
                arr.insertAny(add_arr);
                str = this.replace(str, arr);

                // format 1
                pre_arr[0][1]=pre_arr[1][1]=function(a,i){return a[i]+space[deep]};
                add_arr =[
                    [/\{/, function(a,i){return a[i]+'\n'+space[++deep]}],
                    [/(;?)(\}[;,\)\]]*)/, function(a,i){return a[i+1]+'\n'+space[--deep]+a[i+2]+'\n'+space[deep]}],
                    //insert a
                    [/;(#|`)?/, function(a,i){return ";\n"+space[deep] + (a[i+1]||'')}],
                    [/(#|`)/, function(a,i){return "\n"+space[deep]+a[i]}],
                    //insert b
                    [/,/, ', ']
                ];
                if(key!='css'){
                    //insert a
                    add_arr.insertAny([/for\s*\([\w ]+\sin\s/, "$0"],2,true);
                    add_arr.insertAny([/for\s*\(([^;]*);([^;]*);([^)]*)\)/, "for($1; $2; $3)"],3,true);
                    //insert b
                    // '=>' is for php
                    add_arr.insertAny([/(,)(("[^"\n\r]*"|'[^'\n\r]*'|\w+)?(:|=>))/, function(a,i){return a[i+1]+"\n"+space[deep]+a[i+2]}],4,true);
                    add_arr.insertAny([/\b(case|default)\b[^:]+:/, function(a,i){return a[i]+"\n"+space[deep]}],-1,true);
                }
                arr.length=0;
                arr.insertAny(pre_arr);
                arr.insertAny(add_arr)
                str = this.replace(str, arr);

                // format 2
                pre_arr[0][1]=pre_arr[1][1]='$0';
                add_arr =[
                    [/\n +\n/,'\n']
                ];
                if(key=='css'){
                    add_arr.push([/:/,' : ']);
                }else{
                    //-> => for php
                    add_arr.push(
                        [/{\s+}/,'{}'],
                        [/\}\n *\(\)\)/, '}())'],
                        [/\}\n *(else|catch|finnally)/, '}$1'],
                        [reg.NUMBER, '$0'],
                        [/(->|=>)|(\+\+|\-\-|\&\&|\|\||!!)|([=!]==)|((<<|>>>|>>)=?)|([+\-*/%&|^<>!=~]=?)|([?:])/,' $0 ']
                    );
                };
                arr.length=0;
                arr.insertAny(pre_arr);
                arr.insertAny(add_arr)

                str = this.replace(str, arr);
                str = restore2(restore1(str));

            }
            return str;
        },
        /*parse code
        str:source code
        key:js/css/php
        paras:command paras,['plain',]
        height:control height
        id:specify id
        */
        parse:function(str, key, paras, height, id){
            id=_.str(id);if(id==''){id=_.id()};
            var _key = this.$key;

            var _str=str,_this=this;
            var _encode=function(str){
                return str.replace(/\x02/g,"&lt;").replace(/\x03/,"&amp;");
            },
            _decode=function(str){
                return str.replace(/</g,"\x02").replace(/&/g,"\x03");
            };
            //clear begin and end
            str = str.replace(/^\s*/,'').replace(/\s*$/,'');
            str = _decode(str);

            var a,_t;
            //get pro to a
            if(!this._profiles[key])
                key='js';

            a=_.copy(this._profiles[key]);
            //for platform
            str = str.replace(/(\r\n|\r)/g, "\n").replace(/( +)(\n)/g, "$2").replace(/\t/g, "    ").replace(/ /g,'&nbsp;');

            var arr=[]; //[[/<[^>]+>[^<]*<\/[^>]+>/,'$0']];
            var f = function(o,s,r){
                if(typeof o =='string')
                    o="\\b(" + o + ")\\b";
                arr.push([o, r?r:"<span class='"+s+"'>$0<\/span>"]);
            };
            //ignore
            if(_t=a['multicomment']){
                f(_t, 'multicomment', function(a,i){
                    return "<span class='comment'>"+a[i].split('\n').join("</span>\n<span class='comment'>")+"</span>";
                });
                delete a['multicomment'];
            }
            if(_t=a['comment']){
                f(_t, 'comment', function(a,i){
                    return "<span class='comment'>"+a[i].replace('\n','')+"</span>";
                });
                delete a['comment'];
            }
            if(_t=a['IGNORE']){
                f(_t, 'IGNORE', "$0");
                delete a['IGNORE'];
            }
            //custom
            _.each(this.custom, function(o,s){
                if(a[s]){
                    f(a[s], s, o);
                    delete a[s];
                }
            });

            //sort items
            ["reg1", "reg2", "string1", "string2", "number"].each(function(s){
                if(a[s]){
                    f(a[s],s);
                    delete a[s];
                }
            });

            //others
            _.each(a,function(o,i){
                f(o,i);
            });

            str = this.replace(str,arr);

            str = _encode(str);
            var strR='';
            var alist = str.split('\n');
            if(alist[0]==""){alist.shift();}
            if(alist[alist.length-1]==""){alist.pop();}

            var aa=[];
            aa.push("<div id='"+_key+":"+id+"'class='sh'>");
            if(paras && paras[0]){
                aa.push("<div id='"+_key+"-"+'cmd'+":"+id+"' class='cmd'>");

                paras.each(function(s){
                     aa.push("<a id='"+_key+"-"+s+":"+id+"' href='javascript:;' onclick='linb.coder.action(this,\""+s+"\");return false;'>"+s+"</a>");
                });

                aa.push("<span>"+key+" source code viewer, powered by <a href='http://www.sigmawidgets.com' target='_blank' style='font-size:9px;color:#000157;'>LINB</a></span>");
                aa.push("</div>");
            }
            aa.push("<pre style='display:none'>");
            aa.push(_str.replace(/<(\w)/g,"&lt;$1"));
            aa.push("</pre>");
            aa.push("<div id='"+_key+"-"+'con'+":"+id+"'class='con' "+(height?"style='overflow:auto;height:"+height+"px;'":"")+"><ol id='"+_key+"-"+'ol'+":"+id+"' start='1' class='"+key+"'><li><span>");
            aa.push(alist.join('&nbsp;</span></li><li><span>'));
            aa.push("</span></li></ol></div>");
            aa.push("</div>");
            _encode=_decode=null;

            if(!linb.browser.ie)
                _.asyRun(function(){linb.coder.remedy(id)});

            return aa.join('');
        },
        format:function(){
            var arr = _.toArr(arguments);
            arr[0] = this.decode.apply(this,arguments);
            return this.parse.apply(this, arr);
        },
        remedy:function(id){
            var _t=this.$key+":"+id;
            if(!(_t=linb(_t)).isEmpty()){
                var w=_t.parent().scrollWidth(), w2 = _t.parent().width();
                _t.realWidth(Math.max(w,w2));
            }
        },
        apply :function(id){
            var i=0, self=this,
            fun=function(threadid){
                if(linb.dom.byId(id)){
                    var _t,o,cls;
                    i++;
                    _t=linb(id)
                    cls = _.str(_t.className()).split(' ');
                    o=linb.coder.parse(_t.text(), cls[0], cls[1]?cls[1].split('-'):undefined, null, String(i)).toDom();
                    _t.replace(o.id(id+':'+i));
                }else{
                    linb.thread(threadid).abort();
                }
            };
            linb.thread(null, [fun], null, null, null, null, true).start();
        },
        _profiles:{},
        custom:{},
        setProfile:function(key,value){
            this._profiles[key]=value;
            return this;
        },
        getProfile:function(key){
            return this._profiles[key];
        },
        $action:{
            run:function(o){
                eval(linb(o).parent().next().text());
            },
            plain:function(o){
                var code = linb(o).parent().next().text();
                var code = code.replace(/</g, '&lt;');
		        var wnd = window.open('', '_blank', 'width=750, height=400, location=0, resizable=1, menubar=0, scrollbars=1');
		        wnd.document.write('<pre style="width:100%;height:100%;border:none;">' + code + '</pre>');
		        wnd.document.close();
		        wnd=null;
            }
        },
        action:function(o,key){
            if(this.$action[key]){
                this.$action[key](o);
            }
        }
    }
});