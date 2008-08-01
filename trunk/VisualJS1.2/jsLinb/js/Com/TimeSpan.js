Class('linb.Com.TimeSpan', 'linb.Com',{
    Instance:{
        //target time span
        iniFrom: '',//'2008-01-16T08:00Z',
        iniTo: '',//'2008-01-16T10:00Z',

        //target timezone '+0830'
        timezone:'',

        txtOK:'OK',
        txtCancel:'Cancel',

        //task caption
        taskTitle:'',//'task title',
        
        showCommandPanel:true,

        //text information
        txtInfo:'',//'info',
        txtFrom:'',//'from',
        txtTo:'',//'to',
        txtTZ:'',//'timezone',

        //small time range
        timeMinUnit:'h',
        timeMinCount:0,//2,
        timeMaxUnit:'ww',
        timeMaxCount:0,//4,

        //big time range
        timeStart:'',//"2008-01-16T00:00Z",
        timeEnd:'',//"2008-01-18T00:00Z",
        
        //getUIvalue actually
        getValue:function(){
            var ns=this,
                date=linb.date,
                v=ns.timeline.getUIValue(),
                tz=ns._timezone,
                uv=v.split(":");
            return [date.unpackTimeZone(new Date(parseInt(uv[0])),tz), date.unpackTimeZone(new Date(parseInt(uv[1])),tz)];
        },
        setValue:function(iniFrom, iniTo, force){
            var ns=this,
                timeline=ns.timeline,
                tz=ns._timezone,
                date=linb.date,
                aj,
                key = force===false?'updateUIValue':'setValue';
            //set min/max time range first
            if(ns.timeEnd)
                ns._timeEnd = date.packTimeZone(date.parse(ns.timeEnd), tz);
            if(ns.timeStart)
                ns._timeStart = date.packTimeZone(date.parse(ns.timeStart), tz);
            //adjust time here
            aj = ns._adjustTime(iniFrom, iniTo);
            iniFrom=aj[1];
            iniTo=aj[2];

            var a=date.packTimeZone(iniFrom, tz),
                b=date.packTimeZone(iniTo, tz)
            ;
                if(a && b && !self.$lock){
                    self.$lock=1;
                    timeline[key](a.getTime()+":"+b.getTime(),true);

                    if(ns._timeEnd)
                        timeline.setMaxDate(date.getText(ns._timeEnd,'utciso'));
                    if(ns._timeStart)
                        timeline.setMinDate(date.getText(ns._timeStart,'utciso'));

                    ns.dateFrom[key](date.getRoundDown(a,'d').getTime(),true);
                    ns.dateTo[key](date.getRoundDown(b,'d').getTime(),true);
                    ns.timeFrom[key](date.get(a,'h')+':'+date.get(a,'n'), true);
                    ns.timeTo[key](date.get(b,'h')+':'+date.get(b,'n'), true);
                    _.asyRun(function(){
                        timeline.visibleTask();
                    });
                    self.$lock=0;
                }
        },
        setTimezone:function(tz){
            var ns=this,
                date=linb.date,
                uv=ns.timeline.getUIValue(),
                a,b,
                old=ns._timezone;
            ns._timezone=ns._getTimezone(ns.timezone=tz);
            if(uv){
                uv=uv.split(':');
                ns.setValue(date.unpackTimeZone(new Date(parseInt(uv[0])),old), date.unpackTimeZone(new Date(parseInt(uv[1])),old), false);
            }
        },
        required:["linb.UI.TimeLine","linb.UI.ComboInput","linb.UI.Button","linb.UI.Panel","linb.UI.PopMenu"],
        events:{
            onReady:"_on",
            afterIniComponents:'_ai'
        },
        refreshUI:function(){
            this._ai();
            this._on();
        },
        _ai:function(){
            _.tryF(this.onIniTimeLine,[this.timeline],this);
        },
        _on:function(){
            var ns=this,
                date=linb.date,t,a,b,reg=/\./g,
                wrap=function(s){return linb.wrapRes('date.TIMEZONE.'+s)};
            ns.divFrom.setHtml(ns.txtFrom);
            ns.divTo.setHtml(ns.txtTo);
            if(!ns.showCommandPanel)
                ns.panelCmd.setDisplay('none');
            if(ns.txtInfo)
                ns.divInfo.setDisplay('').setHtml(ns.txtInfo);
            ns.divTZ.setHtml(ns.txtTZ);

            ns.timeline.setDftCaption(ns.taskTitle);
            ns.cmdOK.setCaption(ns.txtOK);
            ns.cmdCancel.setCaption(ns.txtCancel);

            ns.cbiTZ.setValue(ns.timezone,true);
            //ini timezone
            ns._timezone=ns._getTimezone(ns.timezone);

            if(ns.iniFrom && ns.iniTo)
                ns.setValue(date.parse(ns.iniFrom), date.parse(ns.iniTo));

            t=[];
            _.arr.each(date.TIMEZONE,function(o,i){
                a=null;
                if(o.sub){
                    a=[];
                    _.arr.each(o.sub,function(v,j){
                        a[a.length]={id:j, value:v.v, caption: (v.v?v.v+' -- ':'') + wrap(v.id.replace(reg,'_'))};
                    })
                }
                t[t.length]={id:i, caption: wrap(o.id),sub:a};
            });
            ns.tzpop.setItems(t);
            if(!ns.timezone)
                ns.timezone=(function(){
                    var d=((new Date).getTimezoneOffset()/60),
                        i=parseInt(d),
                        v=Math.abs(i)!==i,
                        j=(d-i)*60;
                    i=Math.abs(i);
                    return (v?'+':'-') + (i<=9?'0'+i:i) + (j<9?'0'+j:j);
                })();
        },
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], attach=function(child){children.push(child.get(0))};
            
            attach((new linb.UI.PopMenu)
                .host(host,"tzpop")
                .setItems([])
                .setMaxHeight(300)
                .onMenuSelected("_pop")
            );
            
            attach((new linb.UI.Panel)
                .host(host,"panelMain")
                .setWidth(410)
                .setHeight('auto')
                .setCustomAppearance({"KEY":"padding-top:5px;"})
            );
            
            host.panelMain.attach((new linb.UI.Div)
                .host(host,"divInfo")
                .setWidth(390)
                .setHeight(30)
                .setDisplay('none')
                .setPosition("relative")
            );
            
            host.panelMain.attach((new linb.UI.TimeLine)
                .host(host,"timeline")
                .setHeight(129)
                .setWidth(390)
                .setItems([])
                .setPosition("relative")
                .setTabindex("2")
                .setLeft("10")
                .beforeValueUpdated("_5")
            );
            
            host.panelMain.attach((new linb.UI.Panel)
                .host(host,"panel61")
                .setWidth(400)
                .setHeight(61)
                .setTabindex("4")
                .setPosition("relative")
            );
            
            host.panel61.attach((new linb.UI.ComboInput)
                .host(host,"cbiTZ")
                .setItems([])
                .setType("popbox")
                .setReadonly(true)
                .setLeft(60)
                .setTop(30)
                .setWidth(340)
                .onClickButton("_clc")
            );
            
            host.panel61.attach((new linb.UI.ComboInput)
                .host(host,"timeFrom")
                .setLeft(166)
                .setTop(4)
                .setWidth(48)
                .setItems([])
                .setType("timepicker")
                .beforeValueUpdated("_3")
            );
            
            host.panel61.attach((new linb.UI.ComboInput)
                .host(host,"dateFrom")
                .setLeft(61)
                .setTop(4)
                .setItems([])
                .setType("datepicker")
                .setWidth(104)
                .beforeValueUpdated("_4")
            );
            
            host.panel61.attach((new linb.UI.Div)
                .host(host,"divFrom")
                .setLeft(4)
                .setTop(7)
                .setWidth(53)
                .setHeight(16)
                .setCustomAppearance({"KEY":"text-align:right"})
            );
            
            host.panel61.attach((new linb.UI.ComboInput)
                .host(host,"timeTo")
                .setLeft(352)
                .setTop(4)
                .setWidth(48)
                .setItems([])
                .setType("timepicker")
                .beforeValueUpdated("_1")
            );
            
            host.panel61.attach((new linb.UI.ComboInput)
                .host(host,"dateTo")
                .setLeft(247)
                .setTop(4)
                .setItems([])
                .setType("datepicker")
                .setWidth(104)
                .beforeValueUpdated("_2")
            );
            
            host.panel61.attach((new linb.UI.Div)
                .host(host,"divTo")
                .setLeft(217)
                .setTop(7)
                .setWidth(28)
                .setHeight(16)
                .setCustomAppearance({"KEY":"text-align:right"})
            );
            
            host.panel61.attach((new linb.UI.Div)
                .host(host,"divTZ")
                .setLeft(4)
                .setTop(34)
                .setWidth(53)
                .setHeight(16)
                .setCustomAppearance({"KEY":"text-align:right"})
            );
            
            host.panelMain.attach((new linb.UI.Panel)
                .host(host,"panelCmd")
                .setWidth(400)
                .setHeight(30)
                .setTabindex("5")
                .setPosition("relative")
            );
            
            host.panelCmd.attach((new linb.UI.Button)
                .host(host,"cmdCancel")
                .setLeft(50)
                .setTop(5)
                .setCaption("cmdCancel")
                .onClick("_cancel")
            );
            
            host.panelCmd.attach((new linb.UI.Button)
                .host(host,"cmdOK")
                .setLeft(250)
                .setTop(5)
                .setCaption("cmdOK")
                .onClick("_ok")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _getTimezone:function(s) {
           var sign,hh,mm;
           sign = s.substr(0,1)=='-'?-1:1;
           hh = Math.floor(s.substr(1,2));
           mm = Math.floor(s.substr(3,2));
           return sign*(hh+mm/60);
        },
        _update1:function(dateFrom, dateTo){
            var self=this;
            var date=linb.date,
                rd = date.getRoundDown(dateFrom,'d'),
                h = date.get(dateFrom,'h'),
                n = date.get(dateFrom,'n');
            self.dateFrom.updateUIValue(String(rd.getTime()), true);
            self.timeFrom.updateUIValue(h+':'+n, true);

            rd = date.getRoundDown(dateTo,'d');
            h = date.get(dateTo,'h');
            n = date.get(dateTo,'n');
            self.dateTo.updateUIValue(String(rd.getTime()), true);
            self.timeTo.updateUIValue(h+':'+n, true);
        },
        _update2:function(dateFrom, dateTo){
            var self=this;
            var df=dateFrom.getTime(),
                dt=dateTo.getTime();
            self.timeline.updateUIValue(df+":"+dt);
        },
        _adjustTime:function(dateFrom,dateTo){
            var self=this,
                date=linb.date,
                adjust,
                fixEnd,
                t
                ;
            if(self.timeStart && dateFrom>self._timeEnd)
                dateTo=dateFrom
            if(self.timeEnd && dateTo<self._timeStart)
                dateFrom=dateTo;

            if(self.timeStart && dateFrom<self._timeStart){
                adjust=1;
                dateFrom=self._timeStart;
            }
            if(self.timeEnd && dateTo>self._timeEnd){
                fixEnd=adjust=1;
                dateTo=self._timeEnd;
            }
            if(self.timeMinCount && (t=date.add(dateFrom, self.timeMinUnit, self.timeMinCount))>dateTo){
                adjust=1;
                if(fixEnd)
                    dateFrom = date.add(dateTo, self.timeMinUnit, -self.timeMinCount);
                else
                    dateTo = t;
            }
            if(self.timeMaxCount && (t=date.add(dateFrom, self.timeMaxUnit, self.timeMaxCount))<dateTo){
                adjust=1;
                dateTo = t;
            }
            return [adjust,dateFrom,dateTo];
        },
        _change1:function(newValue){
            var self=this,
                date=linb.date,
                a=newValue.split(':'),
                dateFrom=new Date(parseInt(a[0])),
                dateTo=new Date(parseInt(a[1])),
                df,dt,
                r,
                arr = self._adjustTime(dateFrom,dateTo);

                if(arr[0]){
                    self._update2(arr[1],arr[2]);
                    r=false;
                }
                self._update1(arr[1], arr[2]);
                return r;

        },
        _change2:function(dateFrom,dateTo,timeFrom,timeTo){
            var self=this,r;
            if(!dateFrom)dateFrom=new Date(parseInt(self.dateFrom.getUIValue()));
            if(!dateTo)dateTo=new Date(parseInt(self.dateTo.getUIValue()));
            if(!timeFrom)timeFrom=self.timeFrom.getUIValue().split(':');
            if(!timeTo)timeTo=self.timeTo.getUIValue().split(':');
            //if set manully, all need
            if(!dateFrom || !dateTo || timeFrom.length<2 || timeTo.length<2)return;

            dateFrom.setHours(timeFrom[0]||0);
            dateFrom.setMinutes(timeFrom[1]||0);
            dateTo.setHours(timeTo[0]||0);
            dateTo.setMinutes(timeTo[1]||0);
            var arr=self._adjustTime(dateFrom, dateTo);
            if(arr[0]){
                self._update1(arr[1],arr[2]);
                r=false;
            }
            self._update2(arr[1],arr[2]);
            self.timeline.visibleTask();
            return r;
        },
        _ok:function(){
            _.tryF(this.onOK,[],this);
        },
        _cancel:function(){
            _.tryF(this.onCancel,[],this);
        },
        _5:function (profile, oldValue, newValue, showValue) {
            var self=this,r
            if(!self.$lock){
                self.$lock=1;
                r=self._change1(newValue);
                self.$lock=0;
                return r;
            }
        },
        _4:function (profile, oldValue, newValue, showValue) {
            var self=this,r;
            if(!self.$lock){
                self.$lock=1;
                r=self._change2(new Date(parseInt(newValue)));
                self.$lock=0;
                return r;
            }
        },
        _3:function (profile, oldValue, newValue, showValue) {
            var self=this,r;
            if(!self.$lock){
                self.$lock=1;
                r=self._change2(null,null,newValue.split(':'),null);
                self.$lock=0;
                return r;
            }
        },
        _2:function (profile, oldValue, newValue, showValue) {
            var self=this,r;
            if(!self.$lock){
                self.$lock=1;
                r=self._change2(null,new Date(parseInt(newValue)));
                self.$lock=0;
                return r;
            }
        },
        _1:function (profile, oldValue, newValue, showValue) {
            var self=this,r;
            if(!self.$lock){
                self.$lock=1;
                r=self._change2(null,null,null,newValue.split(':'));
                self.$lock=0;
                return r;
            }
        },
        _pop:function (profile, id, item, src) {
            this.setTimezone(item.value);
            this.cbiTZ.setValue(item.caption.replace(/\<[^>]*\>/g,''),true);
        },
        _clc:function(profile, pos, src){
            this.tzpop.pop(profile.getSubNode('BTN'), this.panelMain.root);
        }
    }
});