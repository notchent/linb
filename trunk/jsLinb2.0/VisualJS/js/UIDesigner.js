Class('UIDesigner', 'linb.Com',{
    Instance:{
        $classEditor:null,
        $pageviewType:'linb.UI.Tabs',
        $firstView:"normal",
        $dftCodePath:'template/index.js',
        $code:'',

        events:{
            onRender:function(com, threadid){
                com.$classEditor.setText(com.$code);
                com.$classEditor.showPage(com.$firstView);
            }
        },
        iniResources:function(threadid){
            //Load default code
            var com=this;
            linb.Ajax(com.$dftCodePath,'',function(code){
                com.$code=code.replace('{className}','App');
            },function(){
                alert(com.$dftCodePath + " doesn't exist!");
            },threadid).start();
        },
        iniExComs:function(threadid){
            var com=this;
            //New an instance of VisualJS.ClassEditor
            linb.ComFactory.newCom('VisualJS.ClassEditor',function(threadid){
                var inn=this;
                inn.host = com;
                inn.$pageviewType=com.$pageviewType;
                inn.setEvents('onValueChanged',function(ipage, profile, b, r){
                     _.tryF(com.events.onValueChanged, [com, ipage, b], com.host);
                });
                inn.$data={
                    textO:com.$code,
                    text:com.$code,
                    clsStruct:null,
                    clsObject:null
                };
console.log('o')
                //Create it first
                inn.create(function(o,threadid){
console.log(4)
                    //Replace the Tag one
                    linb.UI.Tag.replace(com.container.get(0), inn.buttonview.get(0), com);
                },threadid);

                com.$classEditor=inn;
            },threadid);
        },
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};

            append((new linb.UI.ToolBar)
                .host(host,"toolbar5")
                .setItems([{"id":"grp1",sub:[{id:'open',caption:'Open'},{id:'save', caption:'Save JS file'},{id:'savezip',caption:'Save zipped package'}]}])
            );

            append((new linb.UI.Tag)
                .host(host,"container")
                .setDock("fill")
            );

            return children;
            // ]]code created by jsLinb UI Builder
        }
    }
});