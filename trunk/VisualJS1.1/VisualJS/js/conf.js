CONF={
    dftLang:'en',

    phpPath:'request.php',
    prjPath:'projects/',
    requestKey:'VisualJS',
    
    path_link:"http://www.linb.net",
    path_video:'http://linb.googlecode.com/files/video.html',
    path_forum:'http://groups.google.com/group/linb',
    path_download:'http://code.google.com/p/linb/downloads/list',
    path_gpllicence:'http://www.gnu.org/licenses/gpl-3.0.txt',
    path_licence:'license.txt',
    path_purchase:'http://linb.googlecode.com/files/purchase.html',
    
    mapWidgets:{},
    widgets: [
        {id:'linb.UI.iForm',caption:'Form Elements',group:true, icon:'img/App.gif', iconPos:'-48px -48px',sub:[
            {id:'linb.UI.Tag', caption:'Tag Element', icon:'img/widgets.gif', iconPos:'left top', dragable:true},
            {id:'linb.UI.Div', caption:'Div Element', icon:'img/widgets.gif', iconPos:'-624px top', dragable:true},

            {id:'linb.UI.Label', caption:'Label', icon:'img/widgets.gif', iconPos:'-16px top', dragable:true},
            {id:'linb.UI.Link', caption:'Link', icon:'img/widgets.gif', iconPos:'-32px top', dragable:true},
            {id:'linb.UI.Button', caption:'Button', icon:'img/widgets.gif', iconPos:'-48px top', dragable:true, Appearances:['default','link','block'], Behaviors:['dblclick']},
            {id:'linb.UI.CheckBox', caption:'CheckBox', icon:'img/widgets.gif', iconPos:'-96px top', dragable:true},
            {id:'linb.UI.Input', caption:'Input', icon:'img/widgets.gif', iconPos:'-112px top', dragable:true},
            {id:'linb.UI.TextEditor', caption:'TextEditor', icon:'img/widgets.gif', iconPos:'-128px top', dragable:true},
            {id:'linb.UI.List', caption:'List', icon:'img/widgets.gif', iconPos:'-192px top', dragable:true},
            {id:'linb.UI.ComboInput', caption:'ComboInput', icon:'img/widgets.gif', iconPos:'-144px top', dragable:true},

            {id:'linb.UI.Range', caption:'Range', icon:'img/widgets.gif', iconPos:'left -16px', dragable:true},
            {id:'linb.UI.ComboButton', caption:'ComboButton', icon:'img/widgets.gif', iconPos:'-80px top', dragable:true},
    //        {id:'linb.UI.Spin', caption:'Spin', icon:'img/widgets.gif', iconPos:'-160px top', dragable:true},
    //        {id:'linb.UI.Slider', caption:'Slider', icon:'img/widgets.gif', iconPos:'-176px top', dragable:true},
            {id:'linb.UI.TimePicker', caption:'TimePicker', icon:'img/widgets.gif', iconPos:'-240px top', dragable:true},
            {id:'linb.UI.DatePicker', caption:'DatePicker', icon:'img/widgets.gif', iconPos:'-256px top', dragable:true},
    //        {id:'linb.UI.ColorPicker', caption:'ColorPicker', icon:'img/widgets.gif', iconPos:'-272px top', dragable:true}
            {id:'linb.UI.RadioBox', caption:'RadioBox', icon:'img/widgets.gif', iconPos:'-208px top', dragable:true},
            {id:'linb.UI.Poll', caption:'Poll', icon:'img/widgets.gif', iconPos:'-208px -16px', dragable:true},
            {id:'linb.UI.Group', caption:'Group', icon:'img/widgets.gif', iconPos:'-224px top', dragable:true}
        ]},
        {id:'linb.UI.iContainer',caption:'Containers',group:true, icon:'img/App.gif', iconPos:'-48px -48px',sub:[
            {id:'linb.UI.Panel', caption:'Panel', icon:'img/widgets.gif', iconPos:'-288px top', dragable:true},
            {id:'linb.UI.PanelBar', caption:'PanelBar', icon:'img/widgets.gif', iconPos:'-672px top', dragable:true},
            {id:'linb.UI.Block', caption:'Block', icon:'img/widgets.gif', iconPos:'-304px top', dragable:true},
            {id:'linb.UI.Layout', caption:'Layout', icon:'img/widgets.gif', iconPos:'-336px top', dragable:true},
            {id:'linb.UI.ColLayout', caption:'ColLayout', icon:'img/widgets.gif', iconPos:'-336px top', dragable:true},

            {id:'linb.UI.Tabs', caption:'Tabs', icon:'img/widgets.gif', iconPos:'-352px top', dragable:true},

            {id:'linb.UI.Stacks', caption:'Stacks', icon:'img/widgets.gif', iconPos:'-368px top', dragable:true},
            {id:'linb.UI.ButtonViews', caption:'ButtonViews', icon:'img/widgets.gif', iconPos:'-384px top', dragable:true},
            {id:'linb.UI.Dialog', caption:'Dialog', icon:'img/widgets.gif', iconPos:'-320px top', dragable:true}
        ]},
        {id:'linb.UI.iNavigator',caption:'Navigators',group:true, icon:'img/App.gif', iconPos:'-48px -48px', sub:[
            {id:'linb.UI.PageBar', caption:'PageBar', icon:'img/widgets.gif', iconPos:'-48px -16px', dragable:true},

            {id:'linb.UI.PopMenu', caption:'PopMenu', icon:'img/widgets.gif', iconPos:'-400px top', dragable:true},
            {id:'linb.UI.MenuBar', caption:'MenuBar', icon:'img/widgets.gif', iconPos:'-416px top', dragable:true},
            {id:'linb.UI.ToolBar', caption:'ToolBar', icon:'img/widgets.gif', iconPos:'-432px top', dragable:true},
            {id:'linb.UI.LinkList', caption:'LinkList', icon:'img/widgets.gif', iconPos:'-16px -16px', dragable:true},
            {id:'linb.UI.FoldingList', caption:'FoldingList', icon:'img/widgets.gif', iconPos:'-32px -16px', dragable:true},
            {id:'linb.UI.Gallery', caption:'Gallery', icon:'img/widgets.gif', iconPos:'-448px top', dragable:true},
            {id:'linb.UI.TreeBar', caption:'TreeBar', icon:'img/widgets.gif', iconPos:'-464px top', dragable:true},
            {id:'linb.UI.TreeGrid', caption:'TreeGrid', icon:'img/widgets.gif', iconPos:'-480px top', dragable:true}
        ]},
        {id:'linb.UI.iSchedule',caption:'Schedules',group:true, icon:'img/App.gif', iconPos:'-48px -48px', sub:[
            {id:'linb.UI.Calendar', caption:'Calendar', icon:'img/widgets.gif', iconPos:'-496px top', dragable:true},
//            {id:'linb.UI.TaskList', caption:'TaskList', icon:'img/widgets.gif', iconPos:'-512px top', dragable:true},
            {id:'linb.UI.TimeLine', caption:'TimeLine', icon:'img/widgets.gif', iconPos:'-528px top', dragable:true}
        ]}/*,
        {id:'linb.UI.iMedia',caption:'Medias',group:true, icon:'img/App.gif', iconPos:'-48px -48px', sub:[
            {id:'linb.UI.IFrame', caption:'IFrame', icon:'img/widgets.gif', iconPos:'-544px top', dragable:true},
            {id:'linb.UI.Flash', caption:'Flash', icon:'img/widgets.gif', iconPos:'-560px top', dragable:true},
            {id:'linb.UI.Sound', caption:'Sound', icon:'img/widgets.gif', iconPos:'-592px top, dragable:true},
            {id:'linb.UI.Vector', caption:'Embed', icon:'img/widgets.gif', iconPos:'-576px top', dragable:true}
        ]},
        {id:'linb.UI.iMisc',caption:'Miscellaneous',group:true, icon:'img/App.gif', iconPos:'-48px -48px', sub:[
            {id:'linb.UI.ProgressBar', caption:'ProgressBar', icon:'img/widgets.gif', iconPos:'-608px top'},
        ]}*/
    ],
    ComFactoryProfile:{
        _iniMethod:'create',

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
        }
    }
};
new function(){
    var fun=function(items,hash){
        var self=arguments.callee;
        items.each(function(o){
            hash[o.id]=o;
            if(o.sub && o.sub.length)
            self(o.sub, hash);
        });
    };
    CONF.mapWidgets = {};
    fun(CONF.widgets, CONF.mapWidgets);
};