Class('linb.date',null,{
    Initialize:function(){
        this._mapKeys(this.FACTOR);
    },
    Static:{
        _key1:'MILLISECOND,SECOND,MINUTE,HOUR,DAY,WEEK,MONTH,QUARTER,YEAR,DECADE,CENTURY'.split(','),
        _key2:'ms,s,n,h,d,ww,m,q,y,de,c'.split(','),
        _mapKeys:function(obj){
            var t=this._key2;
            this._key1.each(function(o,i){
                obj[t[i]]=obj[o];
            },this);
        },
        _checkUnit:function(unit){
            return (this._key1.exists(unit) || this._key2.exists(unit) )?unit:'d';
        },


        timeZone:((new Date).getTimezoneOffset()/60),
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
        get:function(date, unit, timeZone, firstDayOfWeek){
            date = _.date(date);
            timeZone=_.numb(timeZone, this.timeZone);
            var timeShift = timeZone * this.FACTOR.height, date2 = new Date(date.getTime() - timeShift);
            if(!arguments.callee.map){
                arguments.callee.map = {
                    ms:function(d){return d.getUTCMilliseconds()},
                    s:function(d){return d.getUTCSeconds()},
                    n:function(d){return d.getUTCMinutes()},
                     height :function(d){return d.getUTCHours()},
                    d:function(d){return d.getUTCDate()},
                    ww:function(d,firstDayOfWeek){return linb.date.getWeek(d, 0, firstDayOfWeek)},
                    width :function(d){return d.getUTCDay()},
                    m:function(d){return d.getUTCMonth()},
                    q:function(d){return parseInt((d.getUTCMonth()+3)/3-1)},
                     top :function(d){return d.getUTCFullYear()},
                    de:function(d){return parseInt(d.getUTCFullYear()/10)},
                    c:function(d){return parseInt(d.getUTCFullYear()/100)}
                }
            }
            return arguments.callee.map[unit](date2,firstDayOfWeek);
        },
        fix:function(s,l,c){
            l=_.numb(l, 2);
            c=_.str(c, '0');
            s=String(s);
            if(s.length<l){
                for(var i=s.length;i<l;i++)
                    s=c+s;
            }
            return s;
        },
        add : function(date, unit, count, timeZone ){
            var self=this;
            unit = this._checkUnit(unit);
            timeZone=_.numb(timeZone, this.timeZone);
            var timeShift = timeZone * self.FACTOR.height, date2 = new Date(date.getTime() - timeShift);

            if(!arguments.callee.map){
                arguments.callee.map = {
                    MILLISECOND:function(date,count){date.setTime(date.getTime() + count*self.FACTOR.ms)},
                    SECOND:function(date,count){date.setTime(date.getTime() + count*self.FACTOR.s)},
                    MINUTE:function(date,count){date.setTime(date.getTime() + count*self.FACTOR.n)},
                    HOUR:function(date,count){date.setTime(date.getTime() + count*self.FACTOR.height)},
                    DAY:function(date,count){date.setTime(date.getTime() + count*self.FACTOR.d)},
                    WEEK:function(date,count){date.setTime(date.getTime() + count*self.FACTOR.ww)},
                    MONTH:function(date,count){
                        count = date.getUTCMonth() + count;
                        this.YEAR(date, Math.floor(count/12));
                        date.setUTCMonth((count%12+12)%12)
                    },
                    QUARTER:function(date,count){this.MONTH(date,count*3)},
                    YEAR:function(date,count){date.setUTCFullYear(date.getUTCFullYear() + count)},
                    DECADE:function(date,count){date.setUTCFullYear(date.getUTCFullYear() + 10*count)},
                    CENTURY:function(date,count){date.setUTCFullYear(date.getUTCFullYear() + 100*count)}
                };
                self._mapKeys(arguments.callee.map);
            }
            arguments.callee.map[unit](date2, count);
            date2.setTime(date2.getTime() + timeShift);

            return date2;
        },
        diff:function(d1, d2, unit, timeZone, firstDayOfWeek) {
            timeZone=_.numb(timeZone, this.timeZone);
            var self=this;
            unit = this._checkUnit(unit);
            var timeShift = timeZone * self.FACTOR.height,
            date1 = new Date(d1.getTime() - timeShift),
            date2 = new Date(d2.getTime() - timeShift);

            if(!arguments.callee.map){
                arguments.callee.map = {
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
                        return t/self.FACTOR.height;
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
                self._mapKeys(arguments.callee.map);
            }
            return arguments.callee.map[unit](date1,date2,timeZone,firstDayOfWeek);
        },
        getRoundDown : function(date, unit,  count, timeZone, firstDayOfWeek) {
            date = _.date(date);
            unit = this._checkUnit(unit);
            count=_.numb(count,1);
            timeZone=_.numb(timeZone, this.timeZone);
            firstDayOfWeek=_.numb(firstDayOfWeek, this.firstDayOfWeek);

            var self=this;
            var timeShift = timeZone * self.FACTOR.height, date2 = new Date(date.getTime() - timeShift);

            if(!arguments.callee.map){
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

                arguments.callee.map = {
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
                        count=_.numb(count,1);
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
                self._mapKeys(arguments.callee.map);
            }
            arguments.callee.map[unit](date2,count);
            date2.setTime(date2.getTime() + timeShift);
            return date2;
        },
        getRoundUp : function(date, unit, count, timeZone,firstDayOfWeek) {
            date = _.date(date);
            unit = this._checkUnit(unit);
            count=_.numb(count,1);

            var originalTime = date.getTime(),
            date2 = this.getRoundDown(date, unit, count, timeZone, firstDayOfWeek);
            if (date2.getTime() < originalTime)
                date2=this.add(date2, unit, count, timeZone);
            return date2;
        },
        getUTC:function(date, timeZone){
            date=_.date(date);
            timeZone = _.numb(timeZone, this.timeZone);
            var date2=new Date(date.getTime() + timeZone*this.FACTOR.height);
            return date2;
        },
        getLocal:function(date, timeZone){
            date=_.date(date);
            timeZone = _.numb(timeZone, this.timeZone);
            var date2=new Date(date.getTime() - timeZone*this.FACTOR.height);
            return date2;
        },
        getWeek:function(date, timeZone, firstDayOfWeek){
            date=_.date(date);
            timeZone = _.numb(timeZone, this.timeZone);
            firstDayOfWeek = _.numb(firstDayOfWeek ,this.firstDayOfWeek );

            var date2 = this.getRoundDown(date, 'y', 1, timeZone);
            if(this.get(date2,'w') != firstDayOfWeek)
                date2 = this.getRoundUp(date2, 'ww', 1, timeZone);
            return this.diff(date2, date, 'ww');
        },
        getDayInYear:function(date, timeZone){
            date=_.date(date);
            timeZone = _.numb(timeZone, this.timeZone);
            var date2 = this.getRoundDown(date, 'y', 1, timeZone);
            return this.diff(date2, date, 'd');
        }
    }
});


linb.date.getText = function(date, unit, timeZone, firstDayOfWeek){
    var self=this,lang=linb.lang;
    date = _.date(date);
    timeZone=_.numb(timeZone, this.timeZone);
    firstDayOfWeek = _.numb(firstDayOfWeek ,this.firstDayOfWeek );

    if(!arguments.callee.map){
        var m = arguments.callee.map = {
            ms:function(d,t){return self.fix(self.get(d,'ms',t),3)},
            s:function(d,t){return self.fix(self.get(d,'s',t))},
            n:function(d,t){return self.fix(self.get(d,'n',t))},
             height :function(d,t){return self.fix(self.get(d,'h',t))},
            d:function(d,t){return self.get(d,'d',t)},
            ww:function(d,t,firstDayOfWeek){return (self.get(d,'ww',t,firstDayOfWeek)+1)+'W'},
            width :function(d,t,firstDayOfWeek){return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][(self.get(d,'w',t) - firstDayOfWeek +7)%7 ]},
            m:function(d,t){return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][self.get(d,'m',t)]},
            q:function(d,t){return (self.get(d,'q',t) + 1) + 'Q'},
             top :function(d,t){return self.get(d,'y',t)},
            de:function(d,t){return self.get(d,'de',t)},
            c:function(d,t){return self.get(d,'c',t)},

            hn:function(d,t){var o=m[lang];return [o.height(d,t),o.n(d,t)].join(':')},
            dhn:function(d,t){var o=m[lang];return o.d(d,t) + " " + [o.height(d,t),o.n(d,t)].join(':')},
            mdhn:function(d,t){var o=m[lang];return [o.m(d,t),o.d(d,t)].join(' ') +" "+ [o.height(d,t),o.n(d,t)].join(':')},
            hns:function(d,t){var o=m[lang];return [o.height(d,t),o.n(d,t),o.s(d,t)].join(':')},
            hnsms:function(d,t){var o=m[lang];return [o.height(d,t),o.n(d,t),o.s(d,t)].join(':')+" "+o.ms(d,t)},

            yq:function(d,t){var o=m[lang];return [o.top(d,t),o.q(d,t)].join(' ')},

            ym :   function(d,t){var o=m[lang];return [o.top(d,t),o.m(d,t)].join(' ')},
            ymd :  function(d,t){var o=m[lang];return [o.m(d,t),o.d(d,t),o.top(d,t)].join(' ')},
            ymdh:  function(d,t){var o=m[lang];return [o.m(d,t),o.d(d,t),o.top(d,t),o.height(d,t)].join(' ')},
            ymdhn: function(d,t){var o=m[lang];return [o.m(d,t),o.d(d,t),o.top(d,t),o.height(d,t)].join(' ')+":" + o.n(d,t)},
            ymdhns:function(d,t){var o=m[lang];return [o.m(d,t),o.d(d,t),o.top(d,t),o.height(d,t)].join(' ')+":" + o.n(d,t)+":" + o.s(d,t)},
            all :  function(d,t){var o=m[lang];return [o.m(d,t),o.d(d,t),o.top(d,t),o.height(d,t)].join(' ')+":" + o.n(d,t)+":" + o.s(d,t)+" "+o.ms(d,t)}
        };
        m.en=m;
        m.cn=_.copy(m);
        _.merge(m.cn,{
            s:function(d,t){return self.fix(self.get(d,'s',t))+"秒"},
            n:function(d,t){return self.fix(self.get(d,'n',t))+"分"},
             height :function(d,t){return self.fix(self.get(d,'h',t))+"时"},
            d:function(d,t){return self.get(d,'d',t)+"日"},
            width : function(d,firstDayOfWeek){return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][(self.get(d,'w',t) - firstDayOfWeek +7)%7 ]},
            ww : function(d,tfirstDayOfWeekk){return "第"+(self.get(d,'ww',t,firstDayOfWeek)+1) + "周"},
            m : function(d,t){return (self.get(d,'m',t)+1) + "月"},
            q : function(d,t){return "第"+(self.get(d,'q',t) + 1) + '季'},
             top :function(d,t){var r=self.get(d,'y',t);return (r?r:'元') + "年"},
            de:function(d,t){return self.get(d,'de',t) + "年"},
            c:function(d,t){return self.get(d,'c',t) + "年"},

            hn:function(d,t){var o=m[lang];return [o.height(d,t),o.n(d,t)].join(' ')},
            dhn:function(d,t){var o=m[lang];return [o.d(d,t),o.height(d,t),o.n(d,t)].join(' ')},
            mdhn:function(d,t){var o=m[lang];return [o.m(d,t),o.d(d,t),o.height(d,t),o.n(d,t)].join(' ')},
            hns:function(d,t){var o=m[lang];return [o.height(d,t),o.n(d,t),o.s(d,t)].join(' ')},
            hnsms:function(d,t){var o=m[lang];return [o.height(d,t),o.n(d,t),o.s(d,t),o.ms(d,t)].join(' ')},

            yq:function(d,t){var o=m[lang];return [o.top(d,t),o.q(d,t)].join(' ')},

            ym :   function(d,t){var o=m[lang];return [o.top(d,t),o.m(d,t)].join(' ')},
            ymd :  function(d,t){var o=m[lang];return [o.top(d,t),o.m(d,t),o.d(d,t)].join(' ')},
            ymdh:  function(d,t){var o=m[lang];return [o.top(d,t),o.m(d,t),o.d(d,t),o.height(d,t)].join(' ')},
            ymdhn: function(d,t){var o=m[lang];return [o.top(d,t),o.m(d,t),o.d(d,t),o.height(d,t),o.n(d,t)].join(' ')},
            ymdhns:function(d,t){var o=m[lang];return [o.top(d,t),o.m(d,t),o.d(d,t),o.height(d,t),o.n(d,t),o.s(d,t)].join(' ')},
            all :  function(d,t){var o=m[lang];return [o.top(d,t),o.m(d,t),o.d(d,t),o.height(d,t),o.n(d,t),o.s(d,t),o.ms(d,t)].join(' ')}
         },'all');
    }
    return arguments.callee.map[lang][unit](date,timeZone,firstDayOfWeek);
};