Class("linb.UI.FusionChart", "linb.UI",{
    Instance:{
        initialize:function(){
            console.log(9);
        },
        refreshChart:function(){
            var html='', cls=this.constructor;
            return this.each(function(profile){
                // clear first
                cls._clearMemory(profile);

                // build and set html
                html = cls._buildHTML(profile);
                profile.getRoot().html(html, false);
            });
        }
    },
    Static:{
        Appearances:{
            KEY:{
                outline:linb.browser.gek?'none':null,
                zoom:linb.browser.ie6?'1':null
            }
        },
        Templates:{
            tagName:'div',
            style:'{_style}',
            className:'{_className}',
            //for firefox div focus bug: outline:none; tabindex:'-1'
            tabindex:'-1'
        },
        DataModel:{
            width:200,
            height:200,
            chartType:{
                ini:"Column2D",
                action:function(v){
                    this.boxing().refreshChart();
                }
            },

            swfPath:"http://www.fusioncharts.com/Gallery/Charts/",
            optionsForFCF:{
                ini:{
                    bgcolor: "transparent",
                    quality: "high",
                    allowScriptAccess: "always",
                    debugMode: false,
                    registerWithJS:1,
                    scaleMode:'noScale',
                    chartWidth : "100%",
                    chartHeight : "100%"
                }
            },
            labelsForFCF:{
                ini:{
                    PBarLoadingText:"Loading Chart. Please Wait",
                    XMLLoadingText:"Retrieving Data. Please Wait",
                    ParsingDataText:"Reading Data. Please Wait",
                    ChartNoDataText:"No data to display"
                }
            },
            datasetForFCF:{
                ini:{}
            },
            categoriesForFCF:{
                ini:{}
            },
            trendlinesForFCF:{
                ini:{}
            }
        },
        RenderTrigger:function(){
            this.$beforeDestroy=function(){
                if(this.box)
                    this.box._clearMemory(this);
            }
            // add swf
            this.boxing().refreshChart();
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
console.log('destroy swf');
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
            var ver = this.getFlashVersion();
            if(ver.split(',')[0]<8)
                linb.alert(linb.getRes("App.Com.FusionChart.alertmessage"));

             var prop=profile.properties,
                path=prop.swfPath,
                file= this._chartMap[prop.chartType][0],
                labels=_.urlEncode(prop.labelsForFCF);

            // swf file
            path +=file;

            var options = _.copy(prop.optionsForFCF);
            options.DOMId = profile.box._idtag + profile.serialId;
            options.dataXML=this._encodeDataXML('<chart yAxisName="Sales Figure" caption="Top 5 Sales Person" numberPrefix="$" showBorder="1" imageSave="1" imageSaveURL="http://www.fusioncharts.com/ExportHandlers/PHP/_FCExporter.php"><set label="Alex" value="25000"/><set label="Mark" value="35000"/><set label="David" value="42300"/><set label="Graham" value="35300"/><set label="John" value="31300"/></chart>');

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
alert(html);
            return html;
        },

        _idtag:"linb_UI_FusionChart_", 

        _chartMap:{
            Column2D:["Column2D.swf",2],
            Column3D:["FCF_Column3D.swf",2],
            Pie2D:["FCF_Pie2D.swf",2],
            Pie3D:["FCF_Pie3D.swf",2],
            Line:["FCF_Line.swf",2],
            Bar2D:["FCF_Bar2D.swf",2],
            Area2D:["FCF_Area2D.swf",2],
            Doughnut2D:["FCF_Doughnut2D.swf",2],

            MSColumn2D:["FCF_MSColumn2D.swf",3],
            MSColumn3D:["FCF_MSColumn3D.swf",3],
            MSLine:["FCF_MSLine.swf",3],
            MSArea2D:["FCF_MSArea2D.swf",3],
            MSBar2D:["FCF_MSBar2D.swf",3],

            StackedArea2D:["FCF_StackedArea2D.swf",3],
            StackedBar2D:["FCF_StackedBar2D.swf",3],
            StackedColumn2D:["FCF_StackedColumn2D.swf",3],
            StackedColumn3D:["FCF_StackedColumn3D.swf",3],

            MSColumn2DLineDY:["FCF_MSColumn2DLineDY.swf",3],
            MSColumn3DLineDY:["FCF_MSColumn3DLineDY.swf",3],

            Candlestick:["FCF_Candlestick.swf",2],
            
            Funnel:["FCF_Funnel.swf",1],
            
            Gantt:["FCF_Gantt.swf",4]
        }
    }
});