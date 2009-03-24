
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"], 
        //requried class for the App
        required:["linb.UI.TimeLine", "linb.UI.Div", "linb.UI.ToolBar", "linb.UI.Pane", "linb.UI.Button", "linb.UI.ComboInput"], 
        //Com events
        events:{"onReady":"_onready"}, 
        _timeline1_ongettasks:function (profile, from, to, minMs, type, callback, threadId) {
            /*
            from=from.getTime();
            to=to.getTime();
            var tasks=[];
            if(type=='ini'){
                _.arr.each(SPA.data_cache,function(o){
                    if(o.to >= from && o.from < to && (o.to - o.from > minMs))
                        tasks.push(o);
                });
            }else if(type=='left'){
                _.arr.each(SPA.data_cache,function(o){
                    if(o.to >= from && o.to < to && (o.to - o.from > minMs))
                        tasks.push(o);
                });
            }else{
                _.arr.each(SPA.data_cache,function(o){
                    if(o.from >= from && o.from < to && (o.to - o.from > minMs))
                        tasks.push(o);
                });
            }
            var arr = _.clone(tasks);
            profile.boxing().addTasks(arr);
            */
            linb.Thread.suspend(threadId);
            _google_getTasksByTimeSpan(from, to, function(data){
                var a = SPA._formatData(data);
                _.filter(a,function(o,i){
                    if(o.to - o.from <= minMs)return false;
                    if(type=='ini'){
                        if(o.to == from)
                            return false;
                    }else if(type=='left'){
                        if(o.to > to)
                            return false;
                    }else if(type=='right'){
                        if(o.from <= from)
                            return false;
                    }
                });
                callback(a);
                linb.Thread.resume(threadId);
            });
        }, 
        _timeline1_beforenewtasks:function (profile, items) {
            //_.arr.insertAny(SPA.data_cache, _.clone(items,function(i){return (i.charAt(0)!="_"&&i.charAt(0)!="$")}));
            var host=this;
            linb.ComFactory.getCom('event',function(){
                var self=this, dlg=self.dlgEvent,
                    data = items[0];

                //dlg.setFromRegion(null);
                self.refreshUIFromData(data, 'new', 'Create a new event',host.timeline1.getTimeSpanKey());
                self.onTaskAdded = function(data){
                    var a = host._formatData([data]);
                    host.timeline1.addTasks(a);
                };
                dlg.show(null, true);
            });
            return false;
        }, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Pane)
                .host(host,"panel23")
                .setDock("center")
                .setLeft(37)
                .setTop(1)
                .setWidth("780")
                .setHeight(579)
                .setPosition("relative")
                .setCustomStyle({"KEY":"overflow:visible;"})
            );
            
            host.panel23.append((new linb.UI.TimeLine)
                .host(host,"timeline1")
                .setItems([])
                .setDock("fill")
                .setLeft(390)
                .setTop(170)
                .setTimeSpanKey("2 h")
                .setUnitPixs(30)
                .setMultiTasks(true)
                .setWidth(780)
                .setZoomable(true)
                .onGetContent("_timeline1_ongettasks")
                .beforeTaskUpdated("_timeline1_beforechangetask")
                .beforeNewTasks("_timeline1_beforenewtasks")
                .onClickTask("_timeline1_onclicktask")
            );
            
            host.panel23.append((new linb.UI.Div)
                .host(host,"panelTop")
                .setDock("top")
                .setHeight(34)
                .setCustomStyle({"KEY":"padding:3px;"})
            );
            
            host.panelTop.append((new linb.UI.Button)
                .host(host,"btnRefresh")
                .setLeft(50)
                .setTop(10)
                .setWidth(70)
                .setCaption("Refresh")
                .onClick("_btnrefresh_onclick")
            );
            
            host.panelTop.append((new linb.UI.Button)
                .host(host,"btnLogout")
                .setLeft(680)
                .setTop(10)
                .setWidth(70)
                .setCaption("Logout")
                .onClick("_btnlogout_onclick")
            );
            
            host.panel23.append((new linb.UI.Div)
                .host(host,"divTitle")
                .setLeft(170)
                .setTop(10)
                .setWidth(470)
                .setHeight(20)
                .setHtml("LINB Google Canlendar UI")
                .setCustomStyle({"KEY":"font-size:16px; font-weight:bold; text-align:center;"})
            );
            
            host.panel23.append((new linb.UI.ComboInput)
                .host(host,"comboinput7")
                .setTips("Language")
                .setLeft(696)
                .setTop(43)
                .setWidth(80)
                .setHeight(18)
                .setReadonly(true)
                .setType("listbox")
                .setItems([{"id":"en", "caption":"English"}, {"id":"cn", "caption":"Chinese"}])
                .setValue("en")
                .beforeUIValueSet("_comboinput7_beforevalueupdated")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _formatData:function(data){
            var a=[],b,c,d;
            for(var i=0,l=data.length,o;i<l;i++){
                o=data[i];
                if(!o.gd$recurrence)
                    a.push(b={
                        id:o.id.$t,
                        caption:o.title.$t||"",
                        from:google.gdata.DateTime.fromIso8601(o.gd$when[0].startTime).getDate().getTime(),
                        to:google.gdata.DateTime.fromIso8601(o.gd$when[0].endTime).getDate().getTime(),
                        where:o.gd$where && o.gd$where[0].valueString,
                        content:o.content && o.content.$t,
                        _entry:o
                    });
                    if(c=o.gd$extendedProperty)
                        if(c.length)
                            if((d=_.arr.subIndexOf(c,'name','bgColor'))!=-1)
                                b.background = c[d].value;
            }
            return a;
        }, 
        _onready:function () {
            SPA=this;
            SPA.data_cache=[];
            //set com factory profile
            linb.ComFactory.setProfile(CONF.ComFactoryProfile);
        }, 
        _timeline1_onclicktask:function (profile, task, event, src) {
            var host=this;
            linb.ComFactory.getCom('event',function(){
                var self=this, dlg=self.dlgEvent;

                //dlg.setFromRegion(linb([src]).cssRegion(true));
                self.refreshUIFromData(task,null,null,host.timeline1.getTimeSpanKey());
                self.onTaskModified = function(task){
                    var a = host._formatData([task]);
                    host.timeline1.updateItem(a[0].id, a[0]);
                };
                self.onTaskDeleted = function(id){
                    host.timeline1.removeTasks([id]);
                };
                dlg.show(null, true);
            });
        }, 
        _timeline1_beforechangetask:function (profile, item, from, to) {
            _.asyRun(function(){
                SPA.timeline1.busy('Modifing...');
                _google_modifyTask(item._entry, {from:new Date(from), to:new Date(to)}, function(entry){
                    //refresh entry only
                    item._entry=entry;
                    SPA.timeline1.free();
                });
            });
        }, 
        _btnlogout_onclick:function (profile, e, value) {
            _google_logout();
        }, 
        _btnrefresh_onclick:function (profile, e, value) {
            this.timeline1.clearItems().refresh();
        }, 
        _comboinput7_beforevalueupdated:function (profile, oldValue, newValue) {
            linb.setLang(newValue)
        }
    }
});