Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        //"linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"
        required:["linb.UI.TimePicker","linb.UI.Div","linb.UI.ComboInput","linb.UI.Panel","linb.UI.Label","linb.UI.PopMenu","linb.UI.ButtonViews"],
        _timepicker1_aftervalueupdated:function (profile, oldValue, newValue, showValue) {
            this.div9.setHtml(newValue)
        }
    }
});