/*
* The default code is a com class (inherited from linb.Com)
*/
Class('{className}', 'linb.Com',{
    Instance:{
        //base Class for this com
        base:["linb.UI"],
        //requried class for this com
        required:[],

        properties:{},
        events:{},
        iniResources:function(threadid){
        },
        iniComponents:function(threadid){
        },
        iniExComs:function(threadid){
        }
    }
});