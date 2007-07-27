
Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        //"linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"
        required:["linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow","linb.UI.Input"],
        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];
            
            this.input3 = (new linb.UI.Input)
            .alias("input3").host(this)
            .setLeft(260).setTop(120).setWidth(230).setHeight(90).setBorder(true);
            this.nodes.push(this.input3.get(0));
            
            return this.nodes;
            // ]]code creted by designer
        }
    }
});