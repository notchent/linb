Class('App', 'linb.Page',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.List","linb.UI.Label","linb.UI.Gallery"],

        iniComponents:function(){
            // [[code creted by designer, don't change it manually
            this.nodes = [];
            
            this.list1 = (new linb.UI.List)
            .alias("list1").host(this)
            .setDock("left").setItems([])
            .setListKey("test").setMultiSel(true)
            .onItemSelected("_list5_onitemselected")
            ;
            this.nodes.push(this.list1.get(0));
            
            this.list2 = (new linb.UI.List)
            .alias("list2").host(this)
            .setLeft(300).setTop(60).setItems([{"id":"item a","caption":"item a","tips":"item a"},{"id":"item b","caption":"item b","tips":"item b"},{"id":"item c","caption":"item c","tips":"item c"}])
            .setDisabled(true).setTips("disabled")
            .onItemSelected("_list5_onitemselected")
            ;
            this.nodes.push(this.list2.get(0));
            
            this.list4 = (new linb.UI.List)
            .alias("list4").host(this)
            .setLeft(150).setTop(56).setItems([{"id":"item a","caption":"item a","icon":"img/demo.gif"},{"id":"item b","caption":"item b","icon":"img/demo.gif"},{"id":"item c","caption":"item c","icon":"img/demo.gif"}])
            .setValue(null)
            .setResizable(true).setBorder(true).setMaxHeight("200")
            .onItemSelected("_list5_onitemselected")
            ;
            this.nodes.push(this.list4.get(0));
            
            this.label1 = (new linb.UI.Label)
            .alias("label1").host(this)
            .setLeft(208).setTop(16).setWidth(336).setHAlign("left").setCaption("b")
            ;
            this.nodes.push(this.label1.get(0));
            
            this.list5 = (new linb.UI.List)
            .alias("list5").host(this)
            .setLeft(300).setTop(240).setItems([])
            .setValue(null)
            .setTips("disabled").setListKey("test")
            .onItemSelected("_list5_onitemselected")
            ;
            this.nodes.push(this.list5.get(0));
            
            this.list3 = (new linb.UI.List)
            .alias("list3").host(this)
            .setLeft(150).setTop(240).setItems([{"id":"item a","caption":"<b>long</b> long long item a","tips":"item a"},{"id":"item b","caption":"<span style='color:red'>long</span> long long item b","tips":"item b"},{"id":"item c","caption":"<span style='font-size:20px'>long</span> long long item c","tips":"item c"}])
            .setValue(null)
            
            .onItemSelected("_list5_onitemselected")
            ;
            this.nodes.push(this.list3.get(0));
            
            this.gallery3 = (new linb.UI.Gallery)
            .alias("gallery3").host(this)
            .setLeft(470).setTop(120).setWidth(270).setHeight(230).setItems([{"id":"a","caption":"itema","icon":"img/demo.gif","comment":"item a comment"},{"id":"b","caption":"itemb","icon":"img/demo.gif","comment":"item b comment"},{"id":"c","caption":"itemc","icon":"img/demo.gif","comment":"item c comment"},{"id":"d","caption":"itemd","icon":"img/demo.gif","comment":"item d comment"},{"id":"e","caption":"iteme","icon":"img/demo.gif","comment":"item e comment"},{"id":"f","caption":"itemf","icon":"img/demo.gif","comment":"item f comment"}])
            .setValue(null)
            .setResizable(true).setBorder(true).setItemWidth("64").setItemHeight("64").setShadow(true)
            .onItemSelected("_list5_onitemselected")
            ;
            this.nodes.push(this.gallery3.get(0));
            
            return this.nodes;
            // ]]code creted by designer
        },
        _list5_onitemselected:function (profile, item, src) {
            this.label1.setCaption(profile.boxing().getUIValue());
        }
    }
});