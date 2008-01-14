Class('linb.date',null,{
    Initialize:function(){
        var self=this;
        self._mapKeys(self.FACTOR);
        var a=self._key1,b=self._key2,u=self.UNIT={};
        for(var i=0,l=a.length;i<l;i++)u[a[i]]=1;
        for(var i=0,l=b.length;i<l;i++)u[b[i]]=1;
        u.w=1;
    },
    Static:{
        _key1:'MILLISECOND,SECOND,MINUTE,HOUR,DAY,WEEK,MONTH,QUARTER,YEAR,DECADE,CENTURY'.split(','),
        _key2:'ms,s,n,h,d,ww,m,q,y,de,c'.split(','),
        //map like: MILLISECOND <=> ms
        _mapKeys:function(obj){
            var self=this, t=self._key2, m=self._key1;
            for(var i=0,l=m.length;i<l;i++)
                obj[t[i]]=obj[m[i]];
        },
        //get valid unit
        _validUnit:function(unit){
            return this.UNIT[unit]?unit:'d';
        },
        _isDate:function(target)  {return !!target && target.constructor == Date},
        _date:function(value,df){return this._isDate(value)?value:this._isDate(df)?df:new Date},
        _isNumb:function(target)  {return typeof target == 'number' && isFinite(target)},
        _numb:function(value,df){return this._isNumb(value)?value:this._isNumb(df)?df:0},
        //time Zone like: -8
        _timeZone:((new Date).getTimezoneOffset()/60),
        //sun
        firstDayOfWeek:0,
        // Conversion factors
        FACTOR : {
            MILLISECOND : 1,
            SECOND      : 1000,           //SECONDS
            MINUTE      : 60000,          //MINUTES 60 * 1000
            HOUR        : 3600000,        //HOURS 60 * 60 * 1000
            DAY         : 86400000,       //DAYS 24 * 60 * 60 * 1000
            WEEK        : 604800000,      //WEEKS 7 * 24 * 60 * 60 * 1000
            MONTH       : 2592000000,     //MONTHS 30 * 24 * 60 * 60 * 1000  (approx = 1 month)
            QUARTER     : 7776000000,     //QUARTERS 90 * 24 * 60 * 60 * 1000  (approx = 3 months)
            YEAR        : 31557600000,    //YEARS 365 * 24 * 60 * 60 * 1000 (approx = 1 year)
            DECADE      : 315576000000,   //DECADES 10 * 365 * 24 * 60 * 60 * 1000 (approx = 1 decade)
            CENTURY     : 3155760000000   //CENTURIES 100 * 365 * 24 * 60 * 60 * 1000 (approx = 1 century)
        },
        /*get specific date unit
        *
        */
        get:function(date, unit, timeZone, firstDayOfWeek){
            var self=this;

            date = self._date(date);
            timeZone=self._numb(timeZone, self._timeZone);
            unit = self._validUnit(unit);
            firstDayOfWeek = self._numb(firstDayOfWeek ,self.firstDayOfWeek );

            var timeShift = timeZone * self.FACTOR.h,
                date2 = new Date(date.getTime() - timeShift),
                map = arguments.callee.map || ( arguments.callee.map = {
                    ms:function(d){return d.getUTCMilliseconds()},
                    s:function(d){return d.getUTCSeconds()},
                    n:function(d){return d.getUTCMinutes()},
                    h :function(d){return d.getUTCHours()},
                    d:function(d){return d.getUTCDate()},
                    ww:function(d,firstDayOfWeek){return linb.date.getWeek(d, 0, firstDayOfWeek)},
                    w :function(d){return d.getUTCDay()},
                    m:function(d){return d.getUTCMonth()},
                    q:function(d){return parseInt((d.getUTCMonth()+3)/3-1)},
                    y :function(d){return d.getUTCFullYear()},
                    de:function(d){return parseInt(d.getUTCFullYear()/10)},
                    c:function(d){return parseInt(d.getUTCFullYear()/100)}
                });
            return map[unit](date2,firstDayOfWeek);
        },
        /*
        * fix(1,3,'0') => '100'
        */
        fix:function(s,l,c){
            l=l||2;
            c=c||'0';
            s=String(s);
            if(s.length<l)
                for(var i=s.length;i<l;i++)
                    s=c+s;
            return s;
        },
        /*add specific unit to date
        *
        */
        add : function(date, unit, count, timeZone ){
            var self=this;

            date = self._date(date);
            timeZone=self._numb(timeZone, self._timeZone);
            unit = self._validUnit(unit);

            var timeShift = timeZone * self.FACTOR.h,
                date2 = new Date(date.getTime() - timeShift),
                map;

            if(!(map=arguments.callee.map)){
                map=arguments.callee.map = {
                    MILLISECOND:function(date,count){date.setTime(date.getTime() + count*self.FACTOR.ms)},
                    SECOND:function(date,count){date.setTime(date.getTime() + count*self.FACTOR.s)},
                    MINUTE:function(date,count){date.setTime(date.getTime() + count*self.FACTOR.n)},
                    HOUR:function(date,count){date.setTime(date.getTime() + count*self.FACTOR.h)},
                    DAY:function(date,count){date.setTime(date.getTime() + count*self.FACTOR.d)},
                    WEEK:function(date,count){date.setTime(date.getTime() + count*self.FACTOR.ww)},
                    MONTH:function(date,count){
                        var a=date.getUTCDate(),b;
                        count = date.getUTCMonth() + count;
                        this.YEAR(date, Math.floor(count/12));
                        date.setUTCMonth((count%12+12)%12);
                        if((b=date.getUTCDate())!=a)
                            this.DAY(date, -b)
                    },
                    QUARTER:function(date,count){this.MONTH(date,count*3)},
                    YEAR:function(date,count){
                        var a=date.getUTCDate(),b;
                        date.setUTCFullYear(date.getUTCFullYear() + count)
                        if((b=date.getUTCDate())!=a)
                            this.DAY(date, -b)
                    },
                    DECADE:function(date,count){this.YEAR(date,10*count)},
                    CENTURY:function(date,count){this.YEAR(date,100*count)}
                };
                self._mapKeys(map);
            }
            map[unit](date2, count);
            date2.setTime(date2.getTime() + timeShift);
            return date2;
        },
        /*get specific unit diff between d1 and d2
        *
        */
        diff:function(d1, d2, unit, timeZone, firstDayOfWeek) {
            var self=this;

            d1 = self._date(d1);
            d2 = self._date(d2);
            timeZone=self._numb(timeZone, self._timeZone);
            unit = self._validUnit(unit);
            firstDayOfWeek = self._numb(firstDayOfWeek ,self.firstDayOfWeek );

            var timeShift = timeZone * self.FACTOR.h,
                date1 = new Date(d1.getTime() - timeShift),
                date2 = new Date(d2.getTime() - timeShift),
                map;

            if(!(map=arguments.callee.map)){
                map = arguments.callee.map = {
                    MILLISECOND:function(date1,date2){return date2.getTime()-date1.getTime()},
                    SECOND:function(date1,date2){
                        var d1 = self.getRoundDown(date1,'s'),
                            d2 = self.getRoundDown(date2,'s'),
                            t=d2.getTime()-d1.getTime();
                        return t/self.FACTOR.s;
                    },
                    MINUTE:function(date1,date2){
                        var d1 = self.getRoundDown(date1,'n'),
                            d2 = self.getRoundDown(date2,'n'),
                            t=d2.getTime()-d1.getTime();
                        return t/self.FACTOR.n;
                    },
                    HOUR:function(date1,date2){
                        var d1 = self.getRoundDown(date1,'h'),
                            d2 = self.getRoundDown(date2,'h'),
                            t=d2.getTime()-d1.getTime();
                        return t/self.FACTOR.h;
                    },
                    DAY:function(date1,date2,timeZone){
                        var d1 = self.getRoundDown(date1,'d',1,timeZone),
                            d2 = self.getRoundDown(date2,'d',1,timeZone),
                            t=d2.getTime()-d1.getTime();
                        return t/self.FACTOR.d;
                    },
                    WEEK:function(date1,date2,timeZone,firstDayOfWeek){
                        var d1 = self.getRoundDown(date1,'ww',1,timeZone,firstDayOfWeek),
                            d2 = self.getRoundDown(date2,'ww',1,timeZone,firstDayOfWeek),
                            t=d2.getTime()-d1.getTime();
                        return t/self.FACTOR.ww;
                    },
                    MONTH:function(date1,date2){return (date2.getUTCFullYear()-date1.getUTCFullYear())*12 + (date2.getUTCMonth()-date1.getUTCMonth())},
                    QUARTER:function(date1,date2){return (date2.getUTCFullYear()-date1.getUTCFullYear())*4 + parseInt((date2.getUTCMonth()-date1.getUTCMonth())/3)},
                    YEAR:function(date1,date2){return parseInt((date2.getUTCFullYear()-date1.getUTCFullYear()))},
                    DECADE:function(date1,date2){return parseInt((date2.getUTCFullYear()-date1.getUTCFullYear())/10)},
                    CENTURY:function(date1,date2){return parseInt((date2.getUTCFullYear()-date1.getUTCFullYear())/100)}
                };
                self._mapKeys(map);
            }
            return map[unit](date1,date2,timeZone,firstDayOfWeek);
        },
        /*get the first unit begin of certain unit
        *
        */
        getRoundDown : function(date, unit,  count, timeZone, firstDayOfWeek) {
            var self=this;

            date = self._date(date);
            timeZone=self._numb(timeZone, self._timeZone);
            unit = self._validUnit(unit);
            firstDayOfWeek = self._numb(firstDayOfWeek ,self.firstDayOfWeek );

            count=self._numb(count,1);

            var timeShift = timeZone * self.FACTOR.h,
                date2 = new Date(date.getTime() - timeShift),
                map;

            if(!(map=arguments.callee.map)){
                var clearInDay = function(d) {
                        d.setUTCMilliseconds(0);
                        d.setUTCSeconds(0);
                        d.setUTCMinutes(0);
                        d.setUTCHours(0);
                    },
                    clearInYear = function(d) {
                        clearInDay(d);
                        d.setUTCDate(1);
                        d.setUTCMonth(0);
                    };

                map = arguments.callee.map = {
                    MILLISECOND:function(date,count){
                        var x = date.getUTCMilliseconds();
                        date.setUTCMilliseconds(x - (x % count));
                    },
                    SECOND:function(date,count){
                        date.setUTCMilliseconds(0);
                        var x = date.getUTCSeconds();
                        date.setUTCSeconds(x - (x % count));
                    },
                    MINUTE:function(date,count){
                        date.setUTCMilliseconds(0);
                        date.setUTCSeconds(0);
                        var x = date.getUTCMinutes();
                        date.setTime(date.getTime() - (x % count) * self.FACTOR.n);
                    },
                    HOUR:function(date,count){
                        date.setUTCMilliseconds(0);
                        date.setUTCSeconds(0);
                        date.setUTCMinutes(0);

                        var x = date.getUTCHours();
                        date.setUTCHours(x - (x % count));
                    },
                    DAY:function(date){
                        clearInDay(date);
                    },
                    WEEK:function(date,count){
                        clearInDay(date);
                        var d = (date.getUTCDay() + 7 - firstDayOfWeek) % 7;
                        date.setTime(date.getTime() - d * self.FACTOR.d);
                    },
                    MONTH:function(date,count){
                        clearInDay(date);
                        date.setUTCDate(1);
                        var x = date.getUTCMonth();
                        date.setUTCMonth(x - (x % count));
                    },
                    QUARTER:function(date,count){
                        count=self._numb(count,1);
                        return this.MONTH(date, count*3);
                    },
                    YEAR:function(date,count){
                        clearInYear(date);
                        var x = date.getUTCFullYear();
                        date.setUTCFullYear(x - (x % count));
                    },
                    DECADE:function(date,count){
                        clearInYear(date);
                        date.setUTCFullYear(Math.floor(date.getUTCFullYear() / 10) * 10);
                    },
                    CENTURY:function(date,count){
                        clearInYear(date);
                        date.setUTCFullYear(Math.floor(date.getUTCFullYear() / 100) * 100);
                    }
                };
                self._mapKeys(map);
            }
            map[unit](date2,count);
            date2.setTime(date2.getTime() + timeShift);
            return date2;
        },
        /*get the last unit begin of certain unit
        *
        */
        getRoundUp : function(date, unit, count, timeZone,firstDayOfWeek) {
            var self=this;

            date = self._date(date);
            timeZone=self._numb(timeZone, self._timeZone);
            unit = self._validUnit(unit);
            firstDayOfWeek = self._numb(firstDayOfWeek ,self.firstDayOfWeek );

            count=self._numb(count,1);

            var originalTime = date.getTime(),
                date2 = self.getRoundDown(date, unit, count, timeZone, firstDayOfWeek);
            if (date2.getTime() < originalTime)
                date2=self.add(date2, unit, count, timeZone);
            return date2;
        },
        /*get specific timezone(fake) date from local date format
        *flag==true, unpack
        */
        _pack:function(date, timeZone, flag){
            var self=this;
            date=self._date(date);
            return new Date(date.getTime() + (flag?1:-1)*(timeZone - self._timeZone)*self.FACTOR.h);
        },
        /*fake date for a certain timezone (based on the current timezone of "Date object")
        */
        packTimeZone:function(date, timeZone){
            return this._pack(date,timeZone);
        },
        /*return to real date from packTimezone
        */
        unpackTimeZone:function(date, timeZone){
            return this._pack(date,timeZone,true);
        },
        /*get week
        *
        */
        getWeek:function(date, timeZone, firstDayOfWeek){
            var self=this;
            date=self._date(date);
            timeZone = self._numb(timeZone, self._timeZone);
            firstDayOfWeek = self._numb(firstDayOfWeek ,self.firstDayOfWeek );

            var date2 = self.getRoundDown(date, 'y', 1, timeZone);
            if(self.get(date2,'w') != firstDayOfWeek)
                date2 = self.getRoundUp(date2, 'ww', 1, timeZone);
            return self.diff(date2, date, 'ww')+2;
        },
        getDayInYear:function(date, timeZone){
            var self=this;
            date=self._date(date);
            timeZone = self._numb(timeZone, self._timeZone);
            var date2 = self.getRoundDown(date, 'y', 1, timeZone);
            return self.diff(date2, date, 'd');
        },
        parse:function(s){
            s=String(s);
            var self=this,
                me=arguments.callee,
                dp=me.dp||(me.dp={
                  FullYear: 2,
                  Month: 4,
                  Date: 6,
                  Hours: 8,
                  Minutes: 10,
                  Seconds: 12,
                  Milliseconds: 14
                }),
                match = s.match(me.iso||(me.iso=/^((-\d+|\d{4,})(-(\d{2})(-(\d{2}))?)?)?T((\d{2})(:(\d{2})(:(\d{2})(\.(\d{1,3})(\d)?\d*)?)?)?)?(([+-])(\d{2})(:(\d{2}))?|Z)?$/)),
                date = new Date(0)
                ;
            if(match){
                //month
                if(match[4])match[4]--;
                //ms to 3 digits
                if (match[15]>=5)match[14]++;
                utc = match[16]||match[18]?"UTC":"";
                for (var i in dp) {
                    var v = match[dp[i]];
                    if(!v)continue;
                    date["set" + utc + i](v);
                    if (date["get" + utc + i]() != match[dp[i]])
                        return null;
                }
                if(match[18]){
                    var h = Number(match[17] + match[18]),
                        m = Number(match[17] + (match[20] || 0));
                    date.setUTCMinutes(date.getUTCMinutes() + (h * 60) + m);
                }
                return date;
            }else{
                var r=Date.parse(s);
                return r?date.setTime(r) && date:null;
            }
        },
        getText:function(date, unit, timeZone, firstDayOfWeek, lang){
            var self=this,
                lang= lang || linb.lang || 'cn',
                f=self.fix,
                me =arguments.callee;
            date = self._date(date);
            timeZone=self._numb(timeZone, self._timeZone);
            firstDayOfWeek = self._numb(firstDayOfWeek ,self.firstDayOfWeek );
            unit=unit||'';

            if(!me.map){
                var m = me.map = {
                    WEEKS:['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'WK'],
                    ms:function(d,t){return f(self.get(d,'ms',t),3)},
                    s:function(d,t){return f(self.get(d,'s',t))},
                    n:function(d,t){return f(self.get(d,'n',t))},
                    h:function(d,t){return f(self.get(d,'h',t))},
                    d:function(d,t){return self.get(d,'d',t)},
                    ww:function(d,t,firstDayOfWeek){return (self.get(d,'ww',t,firstDayOfWeek)+1)+'W'},
                    w:function(d,t,firstDayOfWeek){return this.WEEKS[(self.get(d,'w',t) - firstDayOfWeek +7)%7 ]},
                    m:function(d,t){return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][self.get(d,'m',t)]},
                    q:function(d,t){return (self.get(d,'q',t) + 1) + 'Q'},
                    y:function(d,t){return self.get(d,'y',t)},
                    de:function(d,t){return self.get(d,'de',t)},
                    c:function(d,t){return self.get(d,'c',t)},

                    hn:function(d,t,o){o=m.en;return [o.h(d,t),o.n(d,t)].join(':')},
                    dhn:function(d,t,o){o=m.en;return o.d(d,t) + " " + [o.h(d,t),o.n(d,t)].join(':')},
                    mdhn:function(d,t,o){o=m.en;return [o.m(d,t),o.d(d,t)].join(' ') +" "+ [o.h(d,t),o.n(d,t)].join(':')},
                    hns:function(d,t,o){o=m.en;return [o.h(d,t),o.n(d,t),o.s(d,t)].join(':')},
                    hnsms:function(d,t,o){o=m.en;return [o.h(d,t),o.n(d,t),o.s(d,t)].join(':')+" "+o.ms(d,t)},

                    yq:function(d,t,o){o=m.en;return [o.y(d,t),o.q(d,t)].join(' ')},

                    ym :   function(d,t,o){o=m.en;return [o.y(d,t),o.m(d,t)].join(' ')},
                    ymd :  function(d,t,o){o=m.en;return [o.m(d,t),o.d(d,t),o.y(d,t)].join(' ')},
                    ymdh:  function(d,t,o){o=m.en;return [o.m(d,t),o.d(d,t),o.y(d,t),o.h(d,t)].join(' ')},
                    ymdhn: function(d,t,o){o=m.en;return [o.m(d,t),o.d(d,t),o.y(d,t),o.h(d,t)].join(' ')+":" + o.n(d,t)},
                    ymdhns:function(d,t,o){o=m.en;return [o.m(d,t),o.d(d,t),o.y(d,t),o.h(d,t)].join(' ')+":" + o.n(d,t)+":" + o.s(d,t)},
                    iso:function(d,t,o){o=m.en;return o.y(d,t)+'-'+f(self.get(d,'m',t)+1)+'-'+f(o.d(d,t))+'T'+f(o.h(d,t))+':'+f(o.n(d,t))+':'+f(o.s(d,t))+'.'+f(o.ms(d,t),3)},
                    '' :  function(d,t,o){o=m.en;return [o.m(d,t),o.d(d,t),o.y(d,t),o.h(d,t)].join(' ')+":" + o.n(d,t)+":" + o.s(d,t)+" "+o.ms(d,t)}
                };
                m.en=m;

                m.cn={};
                for(var i in m)m.cn[i]=m[i];
                _.merge(m.cn,{
                    WEEKS:['\u65e5', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d', '\u5468'],
                    s:function(d,t){return f(self.get(d,'s',t))+"\u79d2"},
                    n:function(d,t){return f(self.get(d,'n',t))+"\u5206"},
                    h :function(d,t){return f(self.get(d,'h',t))+"\u65f6"},
                    d:function(d,t){return self.get(d,'d',t)+"\u65e5"},
                    w : function(d,t,firstDayOfWeek){return this.WEEKS[(self.get(d,'w',t) - firstDayOfWeek +7)%7 ]},
                    ww : function(d,t,firstDayOfWeek){return '\u7b2c'+(self.get(d,'ww',t,firstDayOfWeek)+1) + "\u5468"},
                    m : function(d,t){return (self.get(d,'m',t)+1) + "\u6708"},
                    q : function(d,t){return "\u7b2c"+(self.get(d,'q',t) + 1) + '\u5b63'},
                    y :function(d,t){var r=self.get(d,'y',t);return (r?r:'?') + "\u5e74"},
                    de:function(d,t){return self.get(d,'de',t) + "\u5341\u5e74"},
                    c:function(d,t){return self.get(d,'c',t) + "\u4e16\u7eaa"},

                    hn:function(d,t,o){o=m.cn;return o.h(d,t)+o.n(d,t)},
                    dhn:function(d,t,o){o=m.cn;return o.d(d,t)+' '+o.h(d,t)+o.n(d,t)},
                    mdhn:function(d,t,o){o=m.cn;return o.m(d,t)+o.d(d,t)+' '+o.h(d,t)+o.n(d,t)},
                    hns:function(d,t,o){o=m.cn;return o.h(d,t)+o.n(d,t)+o.s(d,t)},
                    hnsms:function(d,t,o){o=m.cn;return o.h(d,t)+o.n(d,t)+o.s(d,t)+o.ms(d,t)},

                    yq:function(d,t,o){o=m.cn;return o.y(d,t)+' '+o.q(d,t)},

                    ym :   function(d,t,o){o=m.cn;return o.y(d,t)+o.m(d,t)},
                    ymd :  function(d,t,o){o=m.cn;return o.y(d,t)+o.m(d,t)+o.d(d,t)},
                    ymdh:  function(d,t,o){o=m.cn;return o.y(d,t)+o.m(d,t)+o.d(d,t)+' '+o.h(d,t)},
                    ymdhn: function(d,t,o){o=m.cn;return o.y(d,t)+o.m(d,t)+o.d(d,t)+' '+o.h(d,t)+o.n(d,t)},
                    ymdhns:function(d,t,o){o=m.cn;return o.y(d,t)+o.m(d,t)+o.d(d,t)+' '+o.h(d,t)+o.n(d,t)+o.s(d,t)},
                    '' :  function(d,t,o){o=m.cn;return o.y(d,t)+o.m(d,t)+o.d(d,t)+' '+o.h(d,t)+o.n(d,t)+o.s(d,t)+o.ms(d,t)}
                 },'all');
            }
            return me.map[lang][unit](date,timeZone,firstDayOfWeek);
        }
    }
});