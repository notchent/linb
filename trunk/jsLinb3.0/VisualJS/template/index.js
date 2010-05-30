/*
* The default code is a com class (inherited from linb.Com)
*/
Class('{className}', 'linb.Com',{
    Instance:{
        // To determine whether or not  the com will be destroyed, when the first UI control be destroyed
        autoDestroy:true,

        // If you're not a skilled, dont modify this function manually 
        iniComponents:function(com, threadid){
            // [[code created by jsLinb UI Builder
            // ]]code created by jsLinb UI Builder
        },
        
        // This com's properties
        properties:{},

        // This com's events
        events:{},

        // Give a chance to determine which controls will be appended to parent container
        customAppend:function(parent,subId,left,top){
            // "return false" will cause all the internal UI controls will be added to the parent panel
            return false;
        }

        /*,
        // Give a chance to load data from server
        iniResource:function(com, threadid){
        },
        // Give a chance to load other com
        iniExComs:function(com, hreadid){
        },
        // All necessary base Classes will be loaded dynamically 
        base:["linb.UI"],
        // All necessary requried Classes will be loaded dynamically
        required:["linb.UI.Input","linb.UI.ComboInput",]
        */
    }
});