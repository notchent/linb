Class("linb.UI.FusionChartFree", "linb.UI",{
    Instance:{
        refreshChart:function(){
            var html='', cls=this.constructor;
            return this.each(function(profile){
                _.resetRun(profile.domId,function(){
                    // clear first
                    cls._clearMemory(profile);
    
                    // build and set html
                    html = cls._buildHTML(profile);
                    profile.getSubNode('BOX').html(html, false);
                });
            });
        }
    },
    Static:{
        FC_LINKTAG:'JavaScript:',
        FC_SWFFILEPRETAG:"FCF_",
        Appearances:{
            KEY:{
                'font-size':linb.browser.ie?0:null,
                'line-height':linb.browser.ie?0:null,
                overflow:'hidden'
            },
            BOX:{
                position:'absolute',
                left:0,
                top:0,
                'z-index':1
            },
            COVER:{
                position:'absolute',
                left:'-1px',
                top:'-1px',
                width:0,
                height:0,
                'z-index':4
            }
        },
        Templates:{
            tagName:'div',
            className:'{_className}',
            style:'{_style}',
            BOX:{
                tagName:'div'
            },
            COVER:{
                tagName:'div'
            }
        },
        DataModel:{
            width:500,
            height:300,
            chartType:{
                combobox:"Column2D,Column3D,Pie2D,Pie3D,Line,Bar2D,Area2D,Doughnut2D,MSColumn2D,MSColumn3D,MSLine,MSArea2D,MSBar2D,StackedColumn2D,StackedColumn3D,StackedArea2D,StackedBar2D,Candlestick,Funnel,Gantt".split(','),
                ini:"Column2D",
                action:function(v){
                    var ns=this;
                    // from outside
                    if(ns.properties.demoDataPath){
                        linb.Ajax(ns.properties.demoDataPath + v +".xml", {rnd:_()},function(rsp){
                            ns.properties.dataForFC=linb.XML.xml2json(linb.XML.parseXML(rsp),null,function(s){
                                return ns.box.replaceSpecialChars(x);
                            });
                        },null,null,{asy:false}).start();
                    }
 
                    this.boxing().refreshChart();
                }
            },

            swfPath:"FusionChartsFree/Charts/",
            demoDataPath:"FusionChartsFree/Data/",
            optionsForFC:{
                ini:{
                    bgcolor: "transparent",
                    quality: "high",
                    allowScriptAccess: "always",
                    debugMode: "false",
                    registerWithJS:"1",
                    scaleMode:'noScale'
                }
            },
            labelsForFC:{
                ini:{
                    PBarLoadingText:"Loading Chart. Please Wait",
                    XMLLoadingText:"Retrieving Data. Please Wait",
                    ParsingDataText:"Reading Data. Please Wait",
                    ChartNoDataText:"No data to display",

                    RenderingChartText:"Rendering Chart. Please Wait",
                    LoadDataErrorText:"Error in loading data",
                    InvalidXMLText:"Invalid XML data"
                }
            },
            dataForFC:{
                ini:{}
            }
        },
        RenderTrigger:function(){
            this.$beforeDestroy=function(){
                if(this.box)
                    this.box._clearMemory(this);
            }
            
            // add swf
            this.boxing().setChartType(this.properties.chartType,true)
            .refreshChart();
        },
        EventHandlers:{
            onClick:function(profile, args){},
            beforeRenderData:function(profile, data, callback){}
        },
        getFlashVersion:function(){
          if(linb.browser.ie){
            try {
              var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
              try{axo.AllowScriptAccess='always'}catch(e){return '6,0,0'}
            }catch(e){}finally{
                try{
                    return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
                }catch(e){}
            }
          }else{
            try {
              if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
                return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
              }
            }catch(e){}
          }
          return '0,0,0';
        },
        _getChart:function(id){
            return (linb.browser.ie ? window[id] : ((document.embeds && document.embeds[id])||window.document[id])) || document.getElementById(id);
        }, 
        _clearMemory:function(profile){
            var id=this._idtag + profile.serialId;
            var _e=_.fun(), chart = profile.box._getChart(id);
            if(chart){
                chart.style.display = 'none';
                if(linb.browser.ie){
                    for(var x in chart )
                        if(typeof chart[x]=='function')
                            chart[x]=_e;                        
                    if(window[id])
                        window[id]=undefined;
                }else{
                    if(document.embeds && document.embeds[id])
                        document.embeds[id]=undefined;
                    if(window.document[id])
                        window.document[id]=undefined;
                }
               chart=_e=null;
            }
        }, 
        replaceSpecialChars:function(str){
            return (""+str).replace(/\%/g, '%25')
            .replace(/\&/g, '%26')
            .replace(/\</g, '&lt;')
            .replace(/\>/g, '&gt;')
            .replace(/\'/g, '&apos;');
        },
        _encodeDataXML:function(strDataXML){
            var regExpReservedCharacters=["\\$","\\+"];
			var arrDQAtt=strDataXML.match(/=\s*\".*?\"/g);
			if (arrDQAtt){
				for(var i=0;i<arrDQAtt.length;i++){
					var repStr=arrDQAtt[i].replace(/^=\s*\"|\"$/g,"");
					repStr=repStr.replace(/\'/g,"%26apos;");
					var strTo=strDataXML.indexOf(arrDQAtt[i]);
					var repStrr="='"+repStr+"'";
					var strStart=strDataXML.substring(0,strTo);
					var strEnd=strDataXML.substring(strTo+arrDQAtt[i].length);
					var strDataXML=strStart+repStrr+strEnd;
				}
			}
			
			strDataXML=strDataXML.replace(/\"/g,"%26quot;");
			strDataXML=strDataXML.replace(/%(?![\da-f]{2}|[\da-f]{4})/ig,"%25");
			strDataXML=strDataXML.replace(/\&/g,"%26");

			return strDataXML;
        },
        _buildHTML:function(profile){
            var ns=this,
                ver = ns.getFlashVersion();
            if(ver.split(',')[0]<8)
                linb.alert(linb.getRes("App.Com.FusionChart.alertmessage"));

             var prop=profile.properties,
                serialId=profile.serialId,
                path=prop.swfPath,
                linktag=ns.FC_LINKTAG,
                file= ns.FC_SWFFILEPRETAG + prop.chartType + ".swf",
                labels=_.urlEncode(prop.labelsForFC);

            // swf file
            path +=file;

            var options = _.copy(prop.optionsForFC);
            options.DOMId = profile.box._idtag + profile.serialId;
            options.chartWidth=prop.width;
            options.chartHeight=prop.height;

            var data = _.clone(prop.dataForFC), idata;
            var callback=function(data){
                options.dataXML=ns._encodeDataXML(linb.XML.json2xml(data));
            };
            if(profile.beforeRenderData && false === profile.boxing().beforeRenderData(profile, data, callback)){}
            else{
                // chart or graph
                if(idata=(data.chart||data.graph)){
                    if(idata.set){
                        _.arr.each(idata.set,function(o){
                            if(o)
                                o['@link']=encodeURIComponent(linktag+ns.KEY+'._e("'+serialId+'","'+(o['@label']||o['@name']||"")+'","'+(o['@value']||'')+'")');
                        });
                    }
                    _.arr.each(["lineSet","dataset","dataSet"],function(dskey){
                        if(idata[dskey]){
                            var arr=[];
                            if(idata.categories && idata.categories.category){
                                _.arr.each(idata.categories.category,function(o){
                                    arr.push(o['@label']||o['@name']||"");
                                });
                            }
                            
                            var ds=idata[dskey];
                            if(!_.isArr(ds))
                                ds=[ds];
                            _.arr.each(ds,function(v, i){
                                if(v){
                                    _.arr.each(["lineSet","dataset","dataSet"],function(dskey2){
                                        _.arr.each(v[dskey2],function(k){
                                            if(k && k.set){
                                                var sn=k['@seriesName']||k['@seriesname']||'';
                                                _.arr.each(k.set,function(o,j){
                                                    if(o)
                                                        o['@link']=encodeURIComponent(linktag+ns.KEY+'._e("'+serialId+'","'+(arr[j]||"")+'","'+sn+'","'+(o['@value']||o['@label']||o['@name']||'')+'")');
                                                });
                                            }
                                        });
                                    });
                                    if(v.set){
                                        var sn=v['@seriesName']||v['@seriesname']||'';
                                        _.arr.each(v.set,function(o,j){
                                            if(o)
                                                o['@link']=encodeURIComponent(linktag+ns.KEY+'._e("'+serialId+'","'+(arr[j]||"")+'","'+sn+'","'+(o['@value']||o['@label']||o['@name']||'')+'")');
                                        });
                                    }
                                }
                            });
                        }
                    });
                    callback(data);
                }else
                    callback("");
            }

            var html="";
            if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){
                html += '<embed type="application/x-shockwave-flash" src="'+ path +'?'+labels+'" ';
                html += 'width="100%" height="100%" ';
                html += 'id="'+ options.DOMId +'" name="'+ options.DOMId +'" ';
                html += 'wmode="opaque" ';
                html += 'flashvars="'+ _.urlEncode(options) +'" ';
                html +=  '/>';
            }else{
                html += '<object id="'+ options.DOMId +'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" '
                html += 'width="100%" height="100%">';
                html += '<param name="movie" value="'+ path +'?'+labels+'" />';
                html += '<param name="wmode" value="opaque" />';
                html += '<param name="flashvars" value="'+ _.urlEncode(options) +'" />';
                html += '</object>';
            }

            return html;
        },

        _idtag:"linb_UI_FusionChart_", 
        __events:{},
        _e:function(){
            var instance=this.getFromDom(this.KEY+":"+arguments[0]+":"),
                prf=instance && instance.get(0);
            if(prf && !prf.properties.disable && prf.onClick){
                var args=_.toArr(arguments);
                args=args.slice(1);
                instance.onClick(prf, args);
            }
        },
        _onresize:function(profile,width,height){
            var size = profile.getSubNode('BOX').cssSize();
            if( (width && size.width!=width) || (height && size.height!=height) ){
                size={width:width,height:height};
                profile.getSubNode('BOX').cssSize(size,true);
                if(profile.$inDesign){
                    profile.getSubNode('COVER').cssSize(size,true);
                }
                profile.boxing().refreshChart();
            }
        }
    }
});