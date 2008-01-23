
Class('linb.Com.TimeSpan', 'linb.Com',{
    Instance:{
        timezone:-8,
        txtInfo:'limited selection',
        txtFrom:'from',
        txtTo:'to',
        txtTZ:'timezone',
        timeMax:"2008-01-22T",
        timeMin:"2008-01-18T",
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
            (new u.TimeLine)
            .host(t,"timeline")
            .setLeft(10)
            .setTop(53)
            .setHeight(129)
            .setWidth(390)
            .setItems([])
            .beforeValueUpdated("_timeline_beforevalueupdated")
            );

            t.panel11.attach(
            (new u.ComboInput)
            .host(t,"timeFrom")
            .setLeft(152)
            .setTop(30)
            .setWidth(48)
            .setItems([])
            .setValue("00:00")
            .setType("timepicker")
            .beforeValueUpdated("_timefrom_beforevalueupdated")
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
            .host(t,"dateFrom")
            .setLeft(44)
            .setTop(30)
            .setItems([])
            .setValue("2008-01-21T16:00:00Z")
            .setType("datepicker")
            .setWidth(106)
            .afterValueUpdated("_datefrom_aftervalueupdated")
            );

            t.panel11.attach(
            (new u.Div)
            .host(t,"divTZ")
            .setLeft(10)
            .setTop(189)
            .setWidth(50)
            .setHeight(16)
            );

            t.panel11.attach(
            (new u.Div)
            .host(t,"divFrom")
            .setLeft(10)
            .setTop(33)
            .setWidth(30)
            .setHeight(16)
            );

            t.panel11.attach(
            (new u.ComboInput)
            .host(t,"timeTo")
            .setLeft(351)
            .setTop(30)
            .setWidth(48)
            .setItems([])
            .setValue("00:00")
            .setType("timepicker")
            .beforeValueUpdated("_timeto_beforevalueupdated")
            );

            t.panel11.attach(
            (new u.ComboInput)
            .host(t,"dateTo")
            .setLeft(244)
            .setTop(30)
            .setItems([])
            .setValue("2008-01-21T16:00:00Z")
            .setType("datepicker")
            .setWidth(106)
            .afterValueUpdated("_dateto_aftervalueupdated")
            );

            t.panel11.attach(
            (new u.Div)
            .host(t,"divTo")
            .setLeft(210)
            .setTop(33)
            .setWidth(30)
            .setHeight(16)
            );

            t.panel11.attach(
            (new u.ComboInput)
            .host(t,"cbiTZ")
            .setLeft(64)
            .setTop(186)
            .setWidth(336)
            .setItems([])
            );

            return n;
            // ]]code created by designer
        },
        events:{"onReady":"_onready"},
        _onready:function () {
            var self=this,
                date=linb.date;

            self._timeMax = date.parse(self.timeMax);
            self._timeMin = date.parse(self.timeMin);

            self.timeline.setMaxDate(self._timeMax)
            .setMinDate(self._timeMin);

            self.divFrom.setHtml(self.txtFrom);
            self.divTo.setHtml(self.txtTo);
            self.divInfo.setHtml(self.txtInfo);
            self.divTZ.setHtml(self.txtTZ);
        },
        required:["linb.UI.TimeLine","linb.UI.ComboInput","linb.UI.Div","linb.UI.Panel"],

        _update1:function(dateFrom, dateTo){
            var self=this,
                date=linb.date,
                rd = date.getRoundDown(dateFrom,'d'),
                h = date.get(dateFrom,'h'),
                n = date.get(dateFrom,'n');
            self.dateFrom.updateUIValue(rd);
            self.timeFrom.updateUIValue(h+':'+n);

            rd = date.getRoundDown(dateTo,'d');
            h = date.get(dateTo,'h');
            n = date.get(dateTo,'n');
            self.dateTo.updateUIValue(rd);
            self.timeTo.updateUIValue(h+':'+n);
        },
        _update2:function(dateFrom, dateTo){
        },
        _timeline_beforevalueupdated:function (profile, oldValue, newValue, showValue) {
            var self=this,
                a=newValue.split(':'),
                dateFrom=new Date(parseInt(a[0])),
                dateTo=new Date(parseInt(a[1])),
                df,dt,
                b,r
                ;
            if(dateFrom<self._timeMin){
                b=1;
                dateFrom=self._timeMin;
            }
            if(dateTo>self._timeMax){
                b=1;
                dateTo=self._timeMax;
            }
            if(b){
                df=dateFrom.getTime();
                dt=dateTo.getTime();
                if(dt<df)
                    r=false;
                else{
                    self._update1(dateFrom, dateTo);
                    r=df+":"+df;
                }
            }
            if(r!==false)
                self._update1(dateFrom, dateTo);
            return r;
        },
        _datefrom_aftervalueupdated:function (profile, oldValue, newValue, showValue) {
            var self=this,
                dateFrom, dateEnd;
        },
        _timefrom_beforevalueupdated:function (profile, oldValue, newValue, showValue) {
            var self=this,
                dateFrom, dateEnd;
        },
        _dateto_aftervalueupdated:function (profile, oldValue, newValue, showValue) {
            var self=this,
                dateFrom, dateEnd;
        },
        _timeto_beforevalueupdated:function (profile, oldValue, newValue, showValue) {
            var self=this,
                dateFrom, dateEnd;
        }
    }
});