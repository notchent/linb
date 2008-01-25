Class('TimeSpan', 'linb.Com',{
    Instance:{
        //target time span
        iniFrom: '2008-01-16T08:00Z',
        iniTo: '2008-01-16T10:00Z',

        //target timezone
        timezone:-10,

        //task caption
        taskTitle:'task title',

        //text information
        txtInfo:'info',
        txtFrom:'from',
        txtTo:'to',
        txtTZ:'timezone',

        //small time range
        timeMinUnit:'h',
        timeMinCount:2,
        timeMaxUnit:'ww',
        timeMaxCount:4,

        //big time range
        timeStart:"2008-01-16T00:00Z",
        timeEnd:"2008-01-18T00:00Z",

        getValue:function(){
            var ns=this,
                date=linb.date,
                v=ns.timeline.getUIValue(),
                tz=ns.timezone,
                uv=v.split(":");
            return [date.unpackTimeZone(new Date(parseInt(uv[0])),tz), date.unpackTimeZone(new Date(parseInt(uv[1])),tz)];
        },
        setValue:function(iniFrom, iniTo){
            var ns=this,
                timeline=ns.timeline,
                tz=ns.timezone,
                date=linb.date,
                a=date.packTimeZone(iniFrom, tz),
                b=date.packTimeZone(iniTo, tz)
            ;
            linb.log(a,b);
                if(a && b){
                    timeline.setValue(a.getTime()+":"+b.getTime(),true);

                    ns._timeEnd = date.packTimeZone(date.parse(ns.timeEnd), tz);
                    ns._timeStart = date.packTimeZone(date.parse(ns.timeStart), tz);

                    if(ns._timeEnd)
                        timeline.setMaxDate(date.getText(ns._timeEnd,'utciso'));
                    if(ns._timeStart)
                        timeline.setMinDate(date.getText(ns._timeStart,'utciso'));

                    ns.dateFrom.setValue(date.getRoundDown(a,'d').getTime(),true);
                    ns.dateTo.setValue(date.getRoundDown(b,'d').getTime(),true);
                    ns.timeFrom.setValue(date.get(a,'h')+':'+date.get(a,'n'), true);
                    ns.timeTo.setValue(date.get(b,'h')+':'+date.get(b,'n'), true);
                    _.asyRun(function(){
                        timeline.visibleTask();
                    });
                }
        },
        setTimezone:function(tz){
            var ns=this,
                date=linb.date,
                uv=ns.timeline.getUIValue(),
                a,b,
                old=ns.timezone;
            ns.timezone=tz;
            if(uv){
                uv=uv.split(':');
                ns.setValue(date.unpackTimeZone(new Date(parseInt(uv[0])),old), date.unpackTimeZone(new Date(parseInt(uv[1])),old));
            }
        },
        required:["linb.UI.TimeLine","linb.UI.ComboInput","linb.UI.Div","linb.UI.Panel"],
        events:{
            onReady:"_on"
        },
        _on:function(){
            var self=this,
                date=linb.date;
test=this;

            self.divFrom.setHtml(self.txtFrom);
            self.divTo.setHtml(self.txtTo);
            self.divInfo.setHtml(self.txtInfo);
            self.divTZ.setHtml(self.txtTZ);

            var a=self._timeStart,
                b=date.add(a,self.timeMinUnit,self.timeMinCount);

            self.timeline.setDftCaption(self.taskTitle);

            if(self.iniFrom && self.iniTo)
                self.setValue(date.parse(self.iniFrom), date.parse(self.iniTo));
        },
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};

            f(
            (new u.Panel)
            .host(t,"panel11")
            .setLeft(290)
            .setTop(20)
            .setWidth(420)
            .setHeight(210)
            );

            t.panel11.attach(
            (new u.ComboInput)
            .host(t,"dateFrom")
            .setLeft(67)
            .setTop(160)
            .setItems([])
            .setType("datepicker")
            .setValue('')
            .setWidth(104)
            .beforeValueUpdated("_4")
            );

            t.panel11.attach(
            (new u.ComboInput)
            .host(t,"timeFrom")
            .setLeft(172)
            .setTop(160)
            .setWidth(48)
            .setItems([])
            .setType("timepicker")
            .setValue('')
            .beforeValueUpdated("_3")
            );

            t.panel11.attach(
            (new u.Div)
            .host(t,"divTZ")
            .setLeft(10)
            .setTop(189)
            .setWidth(53)
            .setHeight(16)
            );

            t.panel11.attach(
            (new u.Div)
            .host(t,"divFrom")
            .setLeft(10)
            .setTop(163)
            .setWidth(53)
            .setHeight(16)
            );

            t.panel11.attach(
            (new u.ComboInput)
            .host(t,"timeTo")
            .setLeft(351)
            .setTop(160)
            .setWidth(48)
            .setItems([])
            .setType("timepicker")
            .setValue('')
            .beforeValueUpdated("_1")
            );

            t.panel11.attach(
            (new u.ComboInput)
            .host(t,"dateTo")
            .setLeft(246)
            .setTop(160)
            .setItems([])
            .setType("datepicker")
            .setValue('')
            .setWidth(104)
            .beforeValueUpdated("_2")
            );

            t.panel11.attach(
            (new u.Div)
            .host(t,"divTo")
            .setLeft(224)
            .setTop(163)
            .setWidth(20)
            .setHeight(16)
            );

            t.panel11.attach(
            (new u.TimeLine)
            .host(t,"timeline")
            .setLeft(10)
            .setTop(26)
            .setHeight(129)
            .setWidth(390)
            .setItems([])
            .beforeValueUpdated("_5")
            );

            t.panel11.attach(
            (new u.Div)
            .host(t,"divInfo")
            .setLeft(10)
            .setTop(4)
            .setWidth(390)
            .setHeight(20)
            );

            t.panel11.attach(
            (new u.ComboInput)
            .host(t,"cbiTZ")
            .setLeft(66)
            .setTop(186)
            .setWidth(334)
            .setItems([])
            );

            return n;
            // ]]code created by designer
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
        }
    }
});