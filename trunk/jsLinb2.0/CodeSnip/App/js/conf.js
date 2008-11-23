 new function(){
    var _img_app=linb.getPath('img/','App.gif');
    var _img_widgets=linb.getPath('img/','widgets.gif');
    window.CONF={
        dftLang:'en',
    
        img_app:_img_app,
        img_widgets:_img_widgets,
    
        widgets: [
            {id:'linb.UI',caption:'UI Components',group:true, icon:_img_app, iconPos:'-64px -48px', sub:[
                {id:'linb.UI.absForm',caption:'Form Elements',group:true, icon:_img_app, iconPos:'-48px -48px',sub:[
                    //{id:'linb.UI.Tag', caption:'Tag Element', icon:_img_widgets, iconPos:'left top'},
                    {id:'linb.UI.Div', caption:'Div Element', icon:_img_widgets, iconPos:'-624px top'},
        
                    {id:'linb.UI.Label', caption:'Label', icon:_img_widgets, iconPos:'-16px top'},
                    {id:'linb.UI.Link', caption:'Link', icon:_img_widgets, iconPos:'-32px top'},
                    {id:'linb.UI.Button', caption:'Button', icon:_img_widgets, iconPos:'-48px top'},
                    {id:'linb.UI.CheckBox', caption:'CheckBox', icon:_img_widgets, iconPos:'-96px top'},
                    {id:'linb.UI.Input', caption:'Input', icon:_img_widgets, iconPos:'-112px top'},
                    {id:'linb.UI.TextEditor', caption:'TextEditor', icon:_img_widgets, iconPos:'-128px top'},
                    {id:'linb.UI.List', caption:'List', icon:_img_widgets, iconPos:'-192px top'},
                    {id:'linb.UI.ComboInput', caption:'ComboInput', icon:_img_widgets, iconPos:'-144px top'},
        
                    {id:'linb.UI.ProgressBar', caption:'ProgressBar', icon:_img_widgets, iconPos:'-608px top'},
        
                    {id:'linb.UI.Range', caption:'Range', icon:_img_widgets, iconPos:'left -16px'},
                    //{id:'linb.UI.ComboButton', caption:'ComboButton', icon:_img_widgets, iconPos:'-80px top'},
                    {id:'linb.UI.TimePicker', caption:'TimePicker', icon:_img_widgets, iconPos:'-240px top'},
                    {id:'linb.UI.DatePicker', caption:'DatePicker', icon:_img_widgets, iconPos:'-256px top'},
                    {id:'linb.UI.ColorPicker', caption:'ColorPicker', icon:_img_widgets, iconPos:'-272px top'},
                    {id:'linb.UI.RadioBox', caption:'RadioBox', icon:_img_widgets, iconPos:'-208px top'},
                    {id:'linb.UI.Poll', caption:'Poll', icon:_img_widgets, iconPos:'-208px -16px'},
                    {id:'linb.UI.Group', caption:'Group', icon:_img_widgets, iconPos:'-224px top'}
                ]},
                {id:'linb.UI.absContainer',caption:'Containers',group:true, icon:_img_app, iconPos:'-48px -48px',sub:[
                    {id:'linb.UI.Pane', caption:'Pane', icon:_img_widgets, iconPos:'-288px top'},
                    {id:'linb.UI.Panel', caption:'Panel', icon:_img_widgets, iconPos:'-672px top'},
                    {id:'linb.UI.Block', caption:'Block', icon:_img_widgets, iconPos:'-304px top'},
                    {id:'linb.UI.Layout', caption:'Layout', icon:_img_widgets, iconPos:'-336px top'},
                    //{id:'linb.UI.ColLayout', caption:'ColLayout', icon:_img_widgets, iconPos:'-336px top'},
        
                    {id:'linb.UI.Tabs', caption:'Tabs', icon:_img_widgets, iconPos:'-352px top'},
        
                    {id:'linb.UI.Stacks', caption:'Stacks', icon:_img_widgets, iconPos:'-368px top'},
                    {id:'linb.UI.ButtonViews', caption:'ButtonViews', icon:_img_widgets, iconPos:'-384px top'},
                    {id:'linb.UI.Dialog', caption:'Dialog', icon:_img_widgets, iconPos:'-320px top'}
                ]},
                {id:'linb.UI.absNavigator',caption:'Navigators',group:true, icon:_img_app, iconPos:'-48px -48px', sub:[
                    {id:'linb.UI.PageBar', caption:'PageBar', icon:_img_widgets, iconPos:'-48px -16px'},
        
                    {id:'linb.UI.PopMenu', caption:'PopMenu', icon:_img_widgets, iconPos:'-400px top'},
                    {id:'linb.UI.MenuBar', caption:'MenuBar', icon:_img_widgets, iconPos:'-416px top'},
                    {id:'linb.UI.ToolBar', caption:'ToolBar', icon:_img_widgets, iconPos:'-432px top'},
                    {id:'linb.UI.LinkList', caption:'LinkList', icon:_img_widgets, iconPos:'-16px -16px'},
                    {id:'linb.UI.FoldingList', caption:'FoldingList', icon:_img_widgets, iconPos:'-32px -16px'},
                    {id:'linb.UI.Gallery', caption:'Gallery', icon:_img_widgets, iconPos:'-448px top'},
                    {id:'linb.UI.TreeBar', caption:'TreeBar', icon:_img_widgets, iconPos:'-464px top'},
                    {id:'linb.UI.TreeGrid', caption:'TreeGrid', icon:_img_widgets, iconPos:'-480px top'}
                ]},
                {id:'linb.UI.absSchedule',caption:'Schedules',group:true, icon:_img_app, iconPos:'-48px -48px', sub:[
                    {id:'linb.UI.Calendar', caption:'Calendar', icon:_img_widgets, iconPos:'-496px top'},
                    {id:'linb.UI.TimeLine', caption:'TimeLine', icon:_img_widgets, iconPos:'-528px top'}
                ]}/*,
                {id:'linb.UI.absMisc',caption:'Medias',group:true, icon:_img_app, iconPos:'-48px -48px', sub:[
                    {id:'linb.UI.Media', caption:'Media', icon:_img_widgets, iconPos:'-576px top'},
                    {id:'linb.UI.Shape', caption:'Shape', icon:_img_widgets, iconPos:'-544px top'},
                    {id:'linb.UI.Chart', caption:'Chart', icon:_img_widgets, iconPos:'-560px top'}
                ]}*/
            ]},
            {id:'tech.UI', caption:'UI Related', group:true, icon:_img_app, iconPos:'-64px -48px', sub:[
                {id:'tech.UI.createUI',caption:'to create widget',icon:_img_app, iconPos:'-48px -64px'},
                {id:'tech.UI.showUI',caption:'to show widget',icon:_img_app, iconPos:'-48px -64px'},
                {id:'tech.UI.event',caption:'Events',icon:_img_app, iconPos:'0 -32px'},
                {id:'tech.UI.ca',caption:'Custom Appearances',icon:_img_app, iconPos:'-48px -64px'},
                {id:'tech.UI.cb',caption:'Custom Behaviors',icon:_img_app, iconPos:'-48px -64px'},
                {id:'tech.UI.cc',caption:'Custom Class',icon:_img_app, iconPos:'-48px -64px'},
                {id:'tech.UI.cf',caption:'Custom Functions',icon:_img_app, iconPos:'-48px -64px'}
            ]},
            {id:'tech.form', caption:'Form Related', group:true, icon:_img_app, iconPos:'-64px -48px', sub:[
                {id:'tech.form.v', caption:'Validators', group:true, icon:_img_app, iconPos:'-48px -48px', sub:[
                    {id:'tech.form.v1',caption:'Base',icon:_img_app, iconPos:'-48px -64px'},
                    {id:'tech.form.v2',caption:'Tips Binder',icon:_img_app, iconPos:'-48px -64px'},
                    {id:'tech.form.v3',caption:'Dynamic',icon:_img_app, iconPos:'-48px -64px'}
                 ]},
                {id:'tech.form.f', caption:'formatters', group:true, icon:_img_app, iconPos:'-48px -48px', sub:[
                    {id:'tech.form.f1',caption:'formater 1',icon:_img_app, iconPos:'-48px -64px'},
                    {id:'tech.form.f2',caption:'formater 2',icon:_img_app, iconPos:'-48px -64px'}
                 ]}
            ]},
            {id:'snip', caption:'Common Funcions', group:true, icon:_img_app, iconPos:'-64px -48px', sub:[
                {id:'snip.tooltips',caption:'ToolTips',icon:_img_app, iconPos:'-48px -64px'},
                {id:'snip.serialize',caption:'(un)serialize',icon:_img_app, iconPos:'-48px -64px'},
                {id:'snip.panelRel',caption:'Pane Related',icon:_img_app, iconPos:'-48px -64px'},
                {id:'snip.panelBarRel',caption:'Panel Related',icon:_img_app, iconPos:'-48px -64px'}
            ]}/*,    
            {id:'app', caption:'Application Related', group:true, icon:_img_app, iconPos:'-64px -48px', sub:[
                {id:'app.2',caption:'Skinable',icon:_img_app, iconPos:'-48px -64px'},
                {id:'app.3',caption:'Locale',icon:_img_app, iconPos:'-48px -64px'},
                {id:'app.5',caption:'Data Exchange',icon:_img_app, iconPos:'-48px -64px'}
            ]},
            {id:'demo.app', caption:'Demos', group:true, icon:_img_app, iconPos:'-64px -48px', sub:[
                {id:'demo.app.1',caption:'1',icon:_img_app, iconPos:'-48px -64px'},
                {id:'demo.app.2',caption:'2',icon:_img_app, iconPos:'-48px -64px'}
            ]}*/
        ]
    };
};