new function(){
    var _img_app=linb.getPath('img/','App.gif');
    var _img_widgets=linb.getPath('img/','widgets.gif');
    window.CONF={
        dftLang:'en',
        localeItems:[{"id":"en", "caption":"$VisualJS.en"}, {"id":"cn", "caption":"$VisualJS.cn"}, {"id":"ja", "caption":"$VisualJS.ja"}],

        img_app:_img_app,
        img_widgets:_img_widgets,

        phpPath:linb.ini.appPath + 'request.php',
        testphpPath:linb.ini.appPath + 'debug.php',

        prjPath:'projects/',
        requestKey:'VisualJS',

        path_link:"http://www.linb.net",
        //path_video:'http://linb.googlecode.com/files/video.html',
        path_forum:'http://groups.google.com/group/linb',
        path_download:'http://code.google.com/p/linb/downloads/list',
        path_gpllicence:'http://www.gnu.org/licenses/lgpl-3.0-standalone.html',
        path_licence:'http://www.sigmawidgets.com/license.html',
        path_purchase:'http://www.sigmawidgets.com/buy_now2.html',

        mapWidgets:{},
        widgets: [
            {id:'linb.Data',caption:'Data', group:true, image:'img/App.gif', imagePos:'-48px -48px', sub:[
                {id:'linb.DataBinder', caption:'DataBinder', image:'img/widgets.gif', imagePos:'-640px top', dragable:true}
            ]},
            {id:'linb.UI.absForm1',caption:'Simple Elements',group:true, image:_img_app, imagePos:'-48px -48px',sub:[
                {id:'linb.UI.SLabel', caption:'Simple Label', image:_img_widgets, imagePos:'-16px top', dragable:true},
                {id:'linb.UI.SButton', caption:'Simple Button', image:_img_widgets, imagePos:'-48px top', dragable:true/*, Appearances:['default','link','block']*/},
                {id:'linb.UI.SCheckBox', caption:'Simple CheckBox', image:_img_widgets, imagePos:'-96px top', dragable:true}
            ]},
            {id:'linb.UI.absForm',caption:'Form Elements',group:true, image:_img_app, imagePos:'-48px -48px',sub:[
                {id:'linb.UI.Tag', caption:'Tag Element', image:_img_widgets, imagePos:'left top', dragable:true},
                {id:'linb.UI.Div', caption:'Div Element', image:_img_widgets, imagePos:'-624px top', dragable:true},

                {id:'linb.UI.Label', caption:'Label', image:_img_widgets, imagePos:'-16px top', dragable:true},
                {id:'linb.UI.Link', caption:'Link', image:_img_widgets, imagePos:'-32px top', dragable:true},
                {id:'linb.UI.Button', caption:'Button', image:_img_widgets, imagePos:'-48px top', dragable:true/*, Appearances:['default','link','block']*/},
                {id:'linb.UI.CheckBox', caption:'CheckBox', image:_img_widgets, imagePos:'-96px top', dragable:true},
                {id:'linb.UI.Input', caption:'Input', image:_img_widgets, imagePos:'-112px top', dragable:true},
                {id:'linb.UI.TextEditor', caption:'TextEditor', image:_img_widgets, imagePos:'-128px top', dragable:true},
                {id:'linb.UI.List', caption:'List', image:_img_widgets, imagePos:'-192px top', dragable:true},
                {id:'linb.UI.ComboInput', caption:'ComboInput', image:_img_widgets, imagePos:'-144px top', dragable:true},

                {id:'linb.UI.ProgressBar', caption:'ProgressBar', image:_img_widgets, imagePos:'-608px top', dragable:true},

                {id:'linb.UI.Slider', caption:'Slider', image:_img_widgets, imagePos:'-63px -16px', dragable:true},
                {id:'linb.UI.Range', caption:'Range', image:_img_widgets, imagePos:'left -16px', dragable:true},
                //{id:'linb.UI.ComboButton', caption:'ComboButton', image:_img_widgets, imagePos:'-80px top', dragable:true},
                {id:'linb.UI.TimePicker', caption:'TimePicker', image:_img_widgets, imagePos:'-240px top', dragable:true},
                {id:'linb.UI.DatePicker', caption:'DatePicker', image:_img_widgets, imagePos:'-256px top', dragable:true},
                {id:'linb.UI.ColorPicker', caption:'ColorPicker', image:_img_widgets, imagePos:'-272px top', dragable:true},
                {id:'linb.UI.RadioBox', caption:'RadioBox', image:_img_widgets, imagePos:'-208px top', dragable:true},
                {id:'linb.UI.Poll', caption:'Poll', image:_img_widgets, imagePos:'-208px -16px', dragable:true},
                {id:'linb.UI.Group', caption:'Group', image:_img_widgets, imagePos:'-224px top', dragable:true}
            ]},
            {id:'linb.UI.absContainer',caption:'Containers',group:true, image:_img_app, imagePos:'-48px -48px',sub:[
                {id:'linb.UI.Pane', caption:'Pane', image:_img_widgets, imagePos:'-288px top', dragable:true},
                {id:'linb.UI.Panel', caption:'Panel', image:_img_widgets, imagePos:'-672px top', dragable:true},
                {id:'linb.UI.Block', caption:'Block', image:_img_widgets, imagePos:'-304px top', dragable:true},
                {id:'linb.UI.Layout', caption:'Layout', image:_img_widgets, imagePos:'-336px top', dragable:true},

                {id:'linb.UI.Tabs', caption:'Tabs', image:_img_widgets, imagePos:'-352px top', dragable:true},

                {id:'linb.UI.Stacks', caption:'Stacks', image:_img_widgets, imagePos:'-368px top', dragable:true},
                {id:'linb.UI.ButtonViews', caption:'ButtonViews', image:_img_widgets, imagePos:'-384px top', dragable:true},
                {id:'linb.UI.IconList', caption:'IconList', image:_img_widgets, imagePos:'-384px top', dragable:true},
                {id:'linb.UI.Dialog', caption:'Dialog', image:_img_widgets, imagePos:'-320px top', dragable:true}
            ]},
            {id:'linb.UI.absNavigator',caption:'Navigators',group:true, image:_img_app, imagePos:'-48px -48px', sub:[
                {id:'linb.UI.PageBar', caption:'PageBar', image:_img_widgets, imagePos:'-48px -16px', dragable:true},

                {id:'linb.UI.PopMenu', caption:'PopMenu', image:_img_widgets, imagePos:'-400px top', dragable:true},
                {id:'linb.UI.MenuBar', caption:'MenuBar', image:_img_widgets, imagePos:'-416px top', dragable:true},
                {id:'linb.UI.ToolBar', caption:'ToolBar', image:_img_widgets, imagePos:'-432px top', dragable:true},
                {id:'linb.UI.LinkList', caption:'LinkList', image:_img_widgets, imagePos:'-16px -16px', dragable:true},
                {id:'linb.UI.FoldingList', caption:'FoldingList', image:_img_widgets, imagePos:'-32px -16px', dragable:true},
                {id:'linb.UI.Gallery', caption:'Gallery', image:_img_widgets, imagePos:'-448px top', dragable:true},
                {id:'linb.UI.TreeBar', caption:'TreeBar', image:_img_widgets, imagePos:'-464px top', dragable:true},
                {id:'linb.UI.TreeGrid', caption:'TreeGrid', image:_img_widgets, imagePos:'-480px top', dragable:true}
            ]},
            {id:'linb.UI.absSchedule',caption:'Schedules',group:true, image:_img_app, imagePos:'-48px -48px', sub:[
                {id:'linb.UI.Calendar', caption:'Calendar', image:_img_widgets, imagePos:'-496px top', dragable:true},
                {id:'linb.UI.TimeLine', caption:'TimeLine', image:_img_widgets, imagePos:'-528px top', dragable:true}
            ]},
            {id:'linb.UI.absMisc',caption:'Medias',group:true, image:_img_app, imagePos:'-48px -48px', sub:[
                {id:'linb.UI.Image', caption:'Image Element', image:_img_widgets, imagePos:'-624px top', dragable:true}

/*
                {id:'linb.UI.Media', caption:'Media', image:_img_widgets, imagePos:'-576px top', dragable:true},
                {id:'linb.UI.Shape', caption:'Shape', image:_img_widgets, imagePos:'-544px top', dragable:true},
                {id:'linb.UI.Chart', caption:'Chart', image:_img_widgets, imagePos:'-560px top', dragable:true}
*/
            ]}
        ],
        widgets_xprops:{
            'linb.UI.Div':['html'],
            'linb.UI.Pane':['html'],
            'linb.UI.Block':['html'],
            'linb.UI.Tag':['tagKey'],
            'linb.UI.SLabel':['caption'],
            'linb.UI.Label':['caption'],
            'linb.UI.Link':['caption','onClick'],
            'linb.UI.SButton':['caption','onClick'],
            'linb.UI.Button':['caption','onClick'],
            'linb.UI.SCheckBox':['caption','onChecked'],
            'linb.UI.CheckBox':['caption','onChecked'],
            'linb.UI.Input':['value'],
            'linb.UI.TextEditor':['value'],
            'linb.UI.List':['items','value','onItemSelected'],
            'linb.UI.ComboInput':['type','value'],
            'linb.UI.ProgressBar':['value'],
            'linb.UI.Range':['value'],
            'linb.UI.RadioBox':['items','value','onItemSelected'],
            'linb.UI.Poll':['Items','onGetContent'],
            'linb.UI.Group':['caption'],
            'linb.UI.Panel':['caption'],
            'linb.UI.Layout':['type','items'],
            'linb.UI.Tabs':['items','value','onItemSelected'],
            'linb.UI.Stacks':['items','value','onItemSelected'],
            'linb.UI.ButtonViews':['items','value','onItemSelected'],
            'linb.UI.LinkList':['items','value','onItemClick'],
            'linb.UI.FoldingList':['items','onGetContent'],
            'linb.UI.IconList':['items','value','onItemSelected'],
            'linb.UI.Dialog':['caption'],
            'linb.UI.Gallery':['items','value','onItemSelected'],
            'linb.UI.PageBar':['value','onClick'],
            'linb.UI.PopMenu':['items','onMenuSelected'],
            'linb.UI.MenuBar':['items','onMenuSelected'],
            'linb.UI.ToolBar':['items','onClick'],
            'linb.UI.TreeBar':['items','value','onItemSelected','onGetContent'],
            'linb.UI.TreeGrid':['header','rows','value','onClickCell','beoforeComboPop','onRowSelected','onGetContent'],
            'linb.UI.Image':['src'],
            'linb.UI.TimeLine':['onGetContent']
        },
        ComFactoryProfile:{
            about:{
                cls:'VisualJS.About'
            },
            addFile:{
                cls:'VisualJS.AddFile'
            },
            delFile:{
                cls:'VisualJS.DelFile'
            },
            prjPro:{
                cls:'VisualJS.ProjectPro'
            },
            prjSel:{
                cls:'VisualJS.ProjectSelector'
            },
            
            objEditor:{
                cls:'VisualJS.ObjectEditor'
            }
        }
    };
    var fun=function(items,hash){
        var self=arguments.callee;
        _.arr.each(items,function(o){
            hash[o.id]=o;
            if(o.sub && o.sub.length){
                self(o.sub, hash);
                o.tips='$VisualJS.designer.openwidgets';
            }else
                o.tips='$VisualJS.designer.dragwidget';
        });
    };
    CONF.mapWidgets = {};
    fun(CONF.widgets, CONF.mapWidgets);
    linb.setAppLangKey("VisualJS");
};