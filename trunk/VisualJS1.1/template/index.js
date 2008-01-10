//App class, inherit from linb.Page
Class('{className}', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        //"linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"
        required:[]
        /*,
        //custom attach to parent dom node
        customAttach:function(){}
        */
    }
});