var _img_app=linb.getPath('img/','app.gif');
var _img_widgets=linb.getPath('img/','widgets.gif');
CONF={
    dftLang:'en',

    img_app:_img_app,
    img_widgets:_img_widgets,

    phpPath:linb.ini.appPath + 'request.php',
    prjPath:'projects/',
    requestKey:'VisualJS',
    
    path_link:"http://www.sigmawidgets.com",
    path_video:'http://www.sigmawidgets.com/products/sigma_visual/video.html',
    path_forum:'http://sigmawidgets.com/forum',
    path_download:'http://www.sigmawidgets.com/download.html',
    path_gpllicence:'http://www.gnu.org/licenses/gpl-3.0.txt',
    path_licence:'http://www.sigmawidgets.com/license2.html',
    path_purchase:'http://www.sigmawidgets.com/buy_now2.html',
    path_manual:'http://www.sigmawidgets.com/products/sigma_visual/bin/docs/sigma_visual_manual/manual.htm',
    path_api:'http://www.sigmawidgets.com/products/sigma_visual/bin/docs/sigma_linb_reference/index.html',
        
    mapWidgets:{},
    widgets: [
        {id:'linb.UI.iForm',caption:'Form Elements',group:true, icon:_img_app, iconPos:'-48px -48px',sub:[
            {id:'linb.UI.Tag', caption:'Tag Element', icon:_img_widgets, iconPos:'left top', dragable:true},
            {id:'linb.UI.Div', caption:'Div Element', icon:_img_widgets, iconPos:'-624px top', dragable:true},

            {id:'linb.UI.Label', caption:'Label', icon:_img_widgets, iconPos:'-16px top', dragable:true},
            {id:'linb.UI.Link', caption:'Link', icon:_img_widgets, iconPos:'-32px top', dragable:true},
            {id:'linb.UI.Button', caption:'Button', icon:_img_widgets, iconPos:'-48px top', dragable:true, Appearances:['default','link','block'], Behaviors:['dblclick']},
            {id:'linb.UI.CheckBox', caption:'CheckBox', icon:_img_widgets, iconPos:'-96px top', dragable:true},
            {id:'linb.UI.Input', caption:'Input', icon:_img_widgets, iconPos:'-112px top', dragable:true},
            {id:'linb.UI.TextEditor', caption:'TextEditor', icon:_img_widgets, iconPos:'-128px top', dragable:true},
            {id:'linb.UI.List', caption:'List', icon:_img_widgets, iconPos:'-192px top', dragable:true},
            {id:'linb.UI.ComboInput', caption:'ComboInput', icon:_img_widgets, iconPos:'-144px top', dragable:true},

            {id:'linb.UI.ProgressBar', caption:'ProgressBar', icon:_img_widgets, iconPos:'-608px top', dragable:true},

            {id:'linb.UI.Range', caption:'Range', icon:_img_widgets, iconPos:'left -16px', dragable:true},
            {id:'linb.UI.ComboButton', caption:'ComboButton', icon:_img_widgets, iconPos:'-80px top', dragable:true},
            {id:'linb.UI.TimePicker', caption:'TimePicker', icon:_img_widgets, iconPos:'-240px top', dragable:true},
            {id:'linb.UI.DatePicker', caption:'DatePicker', icon:_img_widgets, iconPos:'-256px top', dragable:true},
            {id:'linb.UI.ColorPicker', caption:'ColorPicker', icon:_img_widgets, iconPos:'-272px top', dragable:true},
            {id:'linb.UI.RadioBox', caption:'RadioBox', icon:_img_widgets, iconPos:'-208px top', dragable:true},
            {id:'linb.UI.Poll', caption:'Poll', icon:_img_widgets, iconPos:'-208px -16px', dragable:true},
            {id:'linb.UI.Group', caption:'Group', icon:_img_widgets, iconPos:'-224px top', dragable:true}
        ]},
        {id:'linb.UI.iContainer',caption:'Containers',group:true, icon:_img_app, iconPos:'-48px -48px',sub:[
            {id:'linb.UI.Panel', caption:'Panel', icon:_img_widgets, iconPos:'-288px top', dragable:true},
            {id:'linb.UI.Fieldset', caption:'Fieldset', icon:_img_widgets, iconPos:'-224px top', dragable:true},
            {id:'linb.UI.PanelBar', caption:'PanelBar', icon:_img_widgets, iconPos:'-672px top', dragable:true},
            {id:'linb.UI.Block', caption:'Block', icon:_img_widgets, iconPos:'-304px top', dragable:true},
            {id:'linb.UI.Layout', caption:'Layout', icon:_img_widgets, iconPos:'-336px top', dragable:true},
            {id:'linb.UI.ColLayout', caption:'ColLayout', icon:_img_widgets, iconPos:'-336px top', dragable:true},

            {id:'linb.UI.Tabs', caption:'Tabs', icon:_img_widgets, iconPos:'-352px top', dragable:true},

            {id:'linb.UI.Stacks', caption:'Stacks', icon:_img_widgets, iconPos:'-368px top', dragable:true},
            {id:'linb.UI.ButtonViews', caption:'ButtonViews', icon:_img_widgets, iconPos:'-384px top', dragable:true},
            {id:'linb.UI.Dialog', caption:'Dialog', icon:_img_widgets, iconPos:'-320px top', dragable:true}
        ]},
        {id:'linb.UI.iNavigator',caption:'Navigators',group:true, icon:_img_app, iconPos:'-48px -48px', sub:[
            {id:'linb.UI.PageBar', caption:'PageBar', icon:_img_widgets, iconPos:'-48px -16px', dragable:true},

            {id:'linb.UI.PopMenu', caption:'PopMenu', icon:_img_widgets, iconPos:'-400px top', dragable:true},
            {id:'linb.UI.MenuBar', caption:'MenuBar', icon:_img_widgets, iconPos:'-416px top', dragable:true},
            {id:'linb.UI.ToolBar', caption:'ToolBar', icon:_img_widgets, iconPos:'-432px top', dragable:true},
            {id:'linb.UI.LinkList', caption:'LinkList', icon:_img_widgets, iconPos:'-16px -16px', dragable:true},
            {id:'linb.UI.FoldingList', caption:'FoldingList', icon:_img_widgets, iconPos:'-32px -16px', dragable:true},
            {id:'linb.UI.Gallery', caption:'Gallery', icon:_img_widgets, iconPos:'-448px top', dragable:true},
            {id:'linb.UI.TreeBar', caption:'TreeBar', icon:_img_widgets, iconPos:'-464px top', dragable:true},
            {id:'linb.UI.TreeGrid', caption:'TreeGrid', icon:_img_widgets, iconPos:'-480px top', dragable:true}
        ]},
        {id:'linb.UI.iSchedule',caption:'Schedules',group:true, icon:_img_app, iconPos:'-48px -48px', sub:[
            {id:'linb.UI.Calendar', caption:'Calendar', icon:_img_widgets, iconPos:'-496px top', dragable:true},
            {id:'linb.UI.TimeLine', caption:'TimeLine', icon:_img_widgets, iconPos:'-528px top', dragable:true}
        ]}/*,
        {id:'linb.UI.iMedia',caption:'Medias',group:true, icon:_img_app, iconPos:'-48px -48px', sub:[
            {id:'linb.UI.IFrame', caption:'IFrame', icon:_img_widgets, iconPos:'-544px top', dragable:true},
            {id:'linb.UI.Flash', caption:'Flash', icon:_img_widgets, iconPos:'-560px top', dragable:true},
            {id:'linb.UI.Sound', caption:'Sound', icon:_img_widgets, iconPos:'-592px top, dragable:true},
            {id:'linb.UI.Vector', caption:'Embed', icon:_img_widgets, iconPos:'-576px top', dragable:true}
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