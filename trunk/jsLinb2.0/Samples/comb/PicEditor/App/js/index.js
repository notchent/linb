Class('App', 'linb.Com',{
    Instance:{
        events:{"onReady":"_onready","onRender":"_onRender"},
        paras:{
            sessionname : '',

            filename : "",
            tag : '',
            fileext : "jpg"
        },
        getPath:function(paras){
            return CONF.basePath +   CONF.workingPath + (paras.origin=='demos'?'demos':paras.origin=='upload'?('upload'+'/'+paras.sessionname):(paras.logindate +'/'+paras.sessionname)) + '/' +paras.filename+(paras.origin?'':('/'+paras.tag))+'.'+paras.fileext;
        },
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};

            append((new linb.UI.Pane)
                .host(host,"paneTop")
                .setDomId("paneTop")
                .setWidth("auto")
                .setHeight(36)
                .setPosition("relative")
            );

            host.paneTop.append((new linb.UI.Pane)
                .host(host,"paneTopRight")
                .setDomId("paneTopRight")
                .setTop(6)
                .setWidth("auto")
                .setHeight(20)
                .setRight(10)
            );

            host.paneTopRight.append((new linb.UI.Link)
                .host(host,"linkLangEn")
                .setLeft(15)
                .setTop(0)
                .setWidth(66)
                .setPosition("relative")
                .setCaption("English")
                .onClick("_linklangen_onclick")
                .setCustomClass({"KEY":"btn-lang"})
            );

            host.paneTopRight.append((new linb.UI.Link)
                .host(host,"linkLangCn")
                .setLeft(10)
                .setTop(0)
                .setPosition("relative")
                .setCaption("\u4e2d\u6587")
                .onClick("_linklangcn_onclick")
                .setCustomClass({"KEY":"btn-lang"})
            );

            host.paneTop.append((new linb.UI.Div)
                .host(host,"vLogo")
                .setDomId("vLogo")
                .setLeft(8)
                .setTop(4)
                .setWidth(32)
                .setHeight(32)
            );

            host.paneTop.append((new linb.UI.Pane)
                .host(host,"panelTopLeft")
                .setDomId("panelTopLeft")
                .setLeft(50)
                .setTop(10)
                .setWidth(300)
                .setHeight(20)
                .setHtml("$app.caption.logo")
            );

            append((new linb.UI.Pane)
                .host(host,"paneMain")
                .setDomId("paneMain")
                .setWidth("auto")
                .setHeight("auto")
                .setPosition("relative")
                .setCustomStyle({"KEY":"margin-left:100px;"})
            );

            host.paneMain.append((new linb.UI.Tabs)
                .host(host,"tabsCmds")
                .setDomId("tabsCmds")
                .setItems([{"id":"basic", "caption":"$app.tasks.basic", "tips":"$app.tasks.basicTips"}, {"id":"crop", "caption":"$app.tasks.crop", "tips":"$app.tasks.cropTips"}, {"id":"frm", "caption":"$app.tasks.frm", "tips":"$app.tasks.frmTips"}, {"id":"frm2", "caption":"$app.tasks.frm2", "tips":"$app.tasks.frm2Tips"}, {"id":"text", "caption":"$app.tasks.text", "tips":"$app.tasks.textTips"}, {"id":"resize", "caption":"$app.tasks.resize", "tips":"$app.tasks.resizeTips"}])
                .setDock("none")
                .setWidth("auto")
                .setHeight(95)
                .setPosition("relative")
                .setHAlign("center")
                .onItemSelected("_tb_onitemseltected")
                .setCustomStyle({"PANEL":"border-left:solid 1px #91A7B4;border-right:solid 1px #91A7B4;", "KEY":"border-bottom:solid 1px #91A7B4;"})
            );

            host.tabsCmds.append((new linb.UI.Button)
                .host(host,"btnRot")
                .setLeft(661)
                .setTop(6)
                .setWidth(110)
                .setCaption("$app.basic.rot")
                .beforeHoverEffect("_btnrot_beforehovereffect")
            , 'basic');

            host.tabsCmds.append((new linb.UI.Button)
                .host(host,"btnMir")
                .setLeft(781)
                .setTop(6)
                .setWidth(110)
                .setCaption("$app.basic.mir")
                .beforeHoverEffect("_btnmir_beforehovereffect")
            , 'basic');

            host.tabsCmds.append((new linb.UI.Button)
                .host(host,"btnOne")
                .setLeft(661)
                .setTop(36)
                .setWidth(110)
                .setCaption("$app.basic.one")
                .beforeHoverEffect("_btnone_beforehovereffect")
            , 'basic');

            host.tabsCmds.append((new linb.UI.Button)
                .host(host,"btnFilter")
                .setLeft(781)
                .setTop(36)
                .setWidth(110)
                .setCaption("$app.basic.filter")
                .beforeHoverEffect("_btnfilter_beforehovereffect")
            , 'basic');

            host.tabsCmds.append((new linb.UI.Button)
                .host(host,"btnApply")
                .setLeft(11)
                .setTop(36)
                .setCaption("$app.caption.applyCrop")
                .onClick("_crop_onclick")
            , 'crop');

            host.tabsCmds.append((new linb.UI.Button)
                .host(host,"btnResizeApply")
                .setLeft(10)
                .setTop(36)
                .setCaption("$app.caption.applyResize")
                .onClick("_resize_onclick")
            , 'resize');

            host.tabsCmds.append((new linb.UI.Div)
                .host(host,"vFont")
                .setLeft(351)
                .setTop(21)
                .setHeight(20)
                .setHtml("$app.addtext.font")
                .setCustomClass({"KEY":"app-label"})
            , 'text');

            host.tabsCmds.append((new linb.UI.Div)
                .host(host,"vFontSize")
                .setLeft(141)
                .setTop(8)
                .setWidth(80)
                .setHeight(20)
                .setHtml("$app.addtext.fontsize")
                .setCustomClass({"KEY":"app-label"})
            , 'text');

            host.tabsCmds.append((new linb.UI.Div)
                .host(host,"vFontColor")
                .setLeft(121)
                .setTop(41)
                .setHeight(20)
                .setHtml("$app.addtext.fontcolor")
                .setCustomClass({"KEY":"app-label"})
            , 'text');

            host.tabsCmds.append((new linb.UI.Button)
                .host(host,"btnAddText")
                .setLeft(11)
                .setTop(34)
                .setWidth(100)
                .setCaption("$app.caption.addtext")
                .onClick("_btnaddtext_onclick")
            , 'text');

            host.tabsCmds.append((new linb.UI.ComboInput)
                .host(host,"ciFontSize")
                .setLeft(231)
                .setTop(7)
                .setWidth(101)
                .setValueFormat("^\\d\\d*$")
                .setType("helpinput")
                .setValue("32")
                .afterUIValueSet("_fontsize_us")
            , 'text');

            host.tabsCmds.append((new linb.UI.ComboInput)
                .host(host,"ciFontColor")
                .setLeft(231)
                .setTop(40)
                .setWidth(101)
                .setReadonly(true)
                .setType("colorpicker")
                .setValue("#FFFF00")
                .beforeUIValueSet("_cifontcolor_beforeuivalueset")
            , 'text');

            host.tabsCmds.append((new linb.UI.Range)
                .host(host,"rangeCon")
                .setLeft(10)
                .setTop(11)
                .setZIndex("10")
                .setMin(-100)
                .setSingleValue(true)
                .setValue("-100:0")
                .afterUIValueSet("_rangecon_afteruivalueset")
            , 'basic');

            host.tabsCmds.append((new linb.UI.Range)
                .host(host,"rangeBri")
                .setLeft(331)
                .setTop(11)
                .setZIndex("10")
                .setMin(-100)
                .setSingleValue(true)
                .setValue("-100:0")
                .afterUIValueSet("_rangebri_afteruivalueset")
            , 'basic');

            host.tabsCmds.append((new linb.UI.Div)
                .host(host,"div39")
                .setLeft(21)
                .setTop(3)
                .setWidth(180)
                .setHeight(30)
                .setHtml("$app.basic.con")
            , 'basic');

            host.tabsCmds.append((new linb.UI.Div)
                .host(host,"div40")
                .setLeft(347)
                .setTop(3)
                .setWidth(180)
                .setHeight(30)
                .setHtml("$app.basic.bri")
            , 'basic');

            host.tabsCmds.append((new linb.UI.Button)
                .host(host,"button12")
                .setLeft(21)
                .setTop(36)
                .setZIndex("10")
                .setCaption("$app.caption.applyIcon")
                .onClick("_button12_onclick")
            , 'frm2');

            host.tabsCmds.append((new linb.UI.Button)
                .host(host,"button25")
                .setLeft(171)
                .setTop(38)
                .setZIndex("10")
                .setCaption("$app.caption.applyFrm")
                .onClick("_button13_onclick")
            , 'frm');

            host.tabsCmds.append((new linb.UI.Div)
                .host(host,"div46")
                .setLeft(11)
                .setTop(43)
                .setWidth(80)
                .setHeight(20)
                .setZIndex("10")
                .setHtml("$app.caption.frmbg")
                .setCustomClass({"KEY":"app-label"})
            , 'frm');

            host.tabsCmds.append((new linb.UI.ComboInput)
                .host(host,"iBGFrm")
                .setDomId("iBGFrm")
                .setLeft(97)
                .setTop(43)
                .setWidth(70)
                .setZIndex("10")
                .setType("colorpicker")
                .setValue("#FFFFFF")
                .afterUIValueSet("_btnbgfrm_onclick")
            , 'frm');

            host.tabsCmds.append((new linb.UI.Div)
                .host(host,"divFont")
                .setLeft(455)
                .setTop(10)
                .setWidth("auto")
                .setHeight("40")
                .setCustomStyle('KEY','overflow:visible;')
            , 'text');

            host.paneMain.append((new linb.UI.Pane)
                .host(host,"paneInfo")
                .setDomId("paneInfo")
                .setWidth("auto")
                .setHeight("40")
                .setPosition("relative")
            );

            host.paneInfo.append((new linb.UI.Div)
                .host(host,"vInfo")
                .setDomId("vInfo")
                .setLeft(12)
                .setWidth("auto")
                .setHeight("auto")
                .setPosition("relative")
            );

            host.paneInfo.append((new linb.UI.Div)
                .host(host,"vInfo2")
                .setDomId("vInfo2")
                .setLeft(12)
                .setWidth("auto")
                .setHeight("auto")
                .setPosition("relative")
            );

            host.paneMain.append((new linb.UI.Pane)
                .host(host,"panePic")
                .setDomId("panePic")
                .setWidth("auto")
                .setHeight("auto")
                .setPosition("relative")
            );

            host.panePic.append((new linb.UI.Pane)
                .host(host,"paneImageBorder")
                .setDomId("paneImageBorder")
                .setWidth("auto")
                .setHeight("auto")
                .setPosition("relative")
            );

            host.paneImageBorder.append((new linb.UI.Image)
                .host(host,"imgBig")
                .setDomId("imgBig")
                .setPosition("relative")
                .onError("_imgbig_onerror")
                .beforeLoad("_imgbig_beforeload")
                .afterLoad("_imgbig_afterload")
            );

            host.paneMain.append((new linb.UI.Pane)
                .host(host,"paneBottom")
                .setDomId("paneBottom")
                .setWidth("auto")
                .setHeight("auto")
                .setPosition("relative")
            );

            append((new linb.UI.Dialog)
                .host(host,"dlgHistory")
                .setDomId("dlgHistory")
                .setTop(132)
                .setWidth(200)
                .setRight(0)
                .setShadow(false)
                .setCaption("$app.caption.history")
                .setMaxBtn(false)
                .setCloseBtn(false)
                .setPinBtn(false)
            );

            host.dlgHistory.append((new linb.UI.IconList)
                .host(host,"ilHistory")
                .setDomId("ilHistory")
                .setDock("fill")
                .setItemWidth(32)
                .setItemHeight(32)
                .onItemSelected("_il_onitemseletcted")
            );

            append((new linb.UI.Pane)
                .host(host,"paneDemo")
                .setDomId("paneDemo")
                .setLeft(4)
                .setTop(155)
                .setWidth(91)
                .setHeight(385)
            );

            host.paneDemo.append((new linb.UI.Stacks)
                .host(host,"stack")
                .setItems([{"id":"files", "caption":"$app.caption.upload_short"}, {"id":"demos", "caption":"$app.caption.demos_short"}])
                .setValue("demos")
            );

            host.stack.append((new linb.UI.IconList)
                .host(host,"ilDemo")
                .setDock("fill")
                .setSelMode("none")
                .setItemWidth(50)
                .setItemHeight(38)
                .onItemSelected("_ildemo_onitemselected")
            , 'demos');

            host.stack.append((new linb.UI.IconList)
                .host(host,"ilPhoto")
                .setDock("fill")
                .setSelMode("none")
                .setItemWidth(50)
                .setItemHeight(38)
                .onItemSelected("_ilphoto_onitemselected")
            , 'files');

            append((new linb.UI.Button)
                .host(host,"btnUpload")
                .setLeft(3)
                .setTop(62)
                .setWidth(93)
                .setHeight(42)
                .setType('custom')
                .setBorder(true)
                .setCaption("$app.caption.upload")
                .setVAlign("middle")
                .onClick("_btnupload_click")
            );

            append((new linb.UI.Button)
                .host(host,"btnSave")
                .setDomId("btnSave")
                .setLeft(3)
                .setTop(108)
                .setWidth(93)
                .setHeight(42)
                .setType('custom')
                .setBorder(true)
                .setCaption("$app.caption.save")
                .setVAlign("middle")
                .onClick("_btnsave_click")
            );

            append((new linb.UI.ComboInput)
                .host(host,"iBGC")
                .setDomId("iBGC")
                .setLeft(4)
                .setTop(40)
                .setWidth(91)
                .setType("colorpicker")
                .afterUIValueSet("_btnbgc_onclick")
            );

            return children;
            // ]]code created by jsLinb UI Builder
        },
        _onRender:function(){
            linb.CSS.includeLink(linb.getPath('css','main.css','default/'));

            linb('imgBig').setSelectable(false);
            SPA.tabsCmds.fireItemClickEvent('basic');

            var rand=SPA.ilDemo.getItems()[parseInt(Math.random()*6)];
            SPA.ilDemo.fireItemClickEvent(rand.id);
            SPA.iBGC.setValue(linb('body').css('backgroundColor'));
        },
        _tb_onitemseltected:function(profile,item){
            linb('imgBig').onClick(null).attr({width:null,height:null});
            SPA.hideResizer();
            SPA.hideFrm();
            SPA.hideCrop();
            SPA.hideIcon();
            SPA.hideText();
            switch(SPA.curView=item.id){
                case 'resize':
                    SPA.showResizer();
                    break;
                case 'crop':
                    SPA.showCrop();
                    break;
                case 'text':
                    SPA.showText();
                    var hash=_.copy(SPA.paras);
                    hash.action='get_font_list';
                    SPA.request1(hash, function(rsp){
                        var items=[],f=function(o){return '<img src='+o.path+' alt='+o.caption+'>';}
                        _.each(rsp.data,function(o,i){
                            var path=CONF.basePath + 'font/' + o.preview;
                            items.push({id:i, _obj:o, caption:i, path:path, renderer:f});
                        });

                        //
                        SPA.divFont.getRoot().onMouseover(SPA._divfont_mover).onMouseout(SPA._divfont_mout);

                        SPA.$fontFamilies=items;
                        SPA.$fontFamily=items[0].caption;
                        SPA.AddText.getSubNode('INPUT').css('fontFamily',SPA.$fontFamily);
                        SPA.divFont.setHtml('<img style="border:solid 1px #ccc;cursor:pointer;" src='+items[0].path+' alt='+items[0].caption + '/>');
                    });

                    break;
                case 'frm':
                    if(!SPA.ilFrm){
                        SPA.ilFrm=new linb.UI.IconList({selMode:"none",position:'relative',width:'auto',height:'auto',itemWidth:16,itemHeight:16});
                        SPA.ilFrm.onItemSelected(function(profile,item){
                            if(profile.boxing().getStatus(item.id)=='loaded'){
                                SPA.showFrm(item.image);
                                SPA.$frmId=item.id;
                            }else
                                delete SPA.$frmId;
                        });
                        profile.boxing().append(SPA.ilFrm,'frm');
                        var hash=_.copy(SPA.paras);
                        hash.action='get_modern_list';
                        SPA.request1(hash, function(rsp){
                            var items=[];
                            _.each(rsp.data,function(o,i){
                                var path=CONF.basePath + 'template/modern/' + o.filename;
                                items.push({id:i, _obj:o, image: path, transTips:true, tips:'<img border=0 height=300 src='+path+'>'});
                            });
                            SPA.ilFrm.setItems(items);
                        });
                    }
                    break;
                case 'frm2':
                    if(!SPA.ilFrm2){
                        SPA.ilFrm2=new linb.UI.IconList({selMode:"none",position:'relative',width:'auto',height:'auto',itemWidth:16,itemHeight:16});
                        SPA.ilFrm2.onItemSelected(function(profile,item){
                            if(profile.boxing().getStatus(item.id)=='loaded'){
                                SPA.showIcon(item.image);
                                SPA.$iconId=item.id;
                            }else
                                delete SPA.$iconId;
                        });
                        profile.boxing().append(SPA.ilFrm2,'frm2');
                        var hash=_.copy(SPA.paras);
                        hash.action='get_avatar_list';
                        SPA.request1(hash, function(rsp){
                            var items=[];
                            _.each(rsp.data,function(o,i){
                                var path=CONF.basePath + 'template/avatar/' + o.filename;
                                items.push({id:i, _obj:o, image: path,transTips:true, tips:'<img border=0 height=100 src='+path+'>'});
                            });
                            SPA.ilFrm2.setItems(items);
                        });
                    }
                    break;
            }
        },
        _linklangen_onclick:function (profile, e) {
            linb.reLang('en');
            linb.Cookies.set('lang','en');
        },
        _linklangcn_onclick:function (profile, e) {
            linb.reLang('cn');
            linb.Cookies.set('lang','cn');
        },
        _onready:function () {
            SPA=this;

            var getPhotos=function(ses){
                SPA.request1({action:'listphotos',sessionname:ses},function(rsp){
                    if(rsp.data.length>0)
                        SPA.stack.setValue('files',true);
                    SPA.ilPhoto.setItems(rsp.data);
                });
            };

            //get session
            var ses=linb.Cookies.get('csession');
            if(!ses)
                SPA.request1({action:'getsession'},function(rsp){
                    linb.Cookies.set('csession', SPA.paras.sessionname=rsp.data);
                    getPhotos(SPA.paras.sessionname);
                });
            else
                getPhotos(SPA.paras.sessionname=ses);

            //set com factory profile
            linb.ComFactory.setProfile(CONF.ComFactoryProfile).prepareComs(_.toArr(CONF.ComFactoryProfile,true));

            //set demos first
            var path=CONF.basePath+CONF.workingPath+'demos/';
            var items=[{id:'1',big:path+'1.jpg',image:path+"1s.jpg"},{id:'2',big:path+'2.jpg',image:path+"2s.jpg"},{id:'3',big:path+'3.jpg',image:path+"3s.jpg"},{id:'4',big:path+'4.jpg',image:path+"4s.jpg"},{id:'5',big:path+'/5.jpg',image:path+"5s.jpg"},{id:'6',big:path+'6.jpg',image:path+"6s.jpg"},{id:'7',big:path+'7.jpg',image:path+"7s.jpg"}];
            SPA.ilDemo.setItems(items);

            //bottom info
            SPA.paneBottom.setHtml(linb.wrapRes('app.info'));

            //font size
            var fontItems=[];
            _.arr.each([6,8,10,12,14,16,18,24,32,48],function(o){
                fontItems.push({id:''+o,caption:'<div style="font-size:'+o+'px">'+o+'px</div>'});
            });
            SPA.ciFontSize.setItems(fontItems);

        },

        _iniSome:function(){
            SPA.hideFrm();
           // SPA.tabsCmds.fireItemClickEvent('basice',true);
        },
        _il_onitemseletcted:function(profile, item, src){
            var il=profile.boxing();
            SPA.paras = _.copy(item._obj);
            SPA.imgBig.setSrc(SPA.getPath(SPA.paras));

            SPA._iniSome();
        },
        _ildemo_onitemselected:function (profile, item, src) {
            if(SPA.$curID!=item.id){
                SPA.$curID=item.id;
                SPA.vInfo.setHtml(linb.wrapRes('$app.caption.demos') + ' : ' + item.id+'.jpg');

                SPA.imgBig.setSrc(item.big);
                _.merge(SPA.paras,{
                    origin : "demos",
                    tag : "",
                    filename : item.id,
                    fileext :'jpg'

                },'all');

                SPA._iniSome();
            }
        },
        _ilphoto_onitemselected:function (profile, item, src) {
            if(SPA.$curID!=item.id){
                SPA.$curID=item.id;
                SPA.vInfo.setHtml(linb.wrapRes('$app.caption.upload') + ' : ' + item.id+'.'+item.ext);

                SPA.imgBig.setSrc(item.big);
                _.merge(SPA.paras,{
                    origin : "upload",
                    tag : "",
                    filename : item.id,
                    fileext :item.ext
                },'all');

                SPA._iniSome();
            }
        },

        _imgbig_beforeload:function (profile) {
            _.resetRun('$changCon',function(){
                SPA.vInfo2.setHtml('<image src="img/loading.gif"/>');
                _.resetRun('$imgvisible',function(){SPA.imgBig.setDisplay('none')});
            });
        },
        _imgbig_afterload:function (profile, path, width, height) {
            _.resetRun('$changCon',function(){
                SPA.vInfo2.setHtml(linb.wrapRes('app.caption.width') + ' <span class="val-size">'+width + '</span><span style="width:10px;"></span>' + linb.wrapRes('app.caption.height') + ' <span class="val-size">' + height+'</span>');
            });
            _.resetRun('$imgvisible',function(){SPA.imgBig.setDisplay('')});
            SPA.$width=width;
            SPA.$height=height;
        },
        _imgbig_onerror:function (profile) {
            SPA.vInfo2.setHtml('<image src="img/error.gif"/>'+linb.wrapRes('app.imageErr'));
        },
        _btnbgc_onclick:function (profile, o, value) {
            linb.doc.query('html').css('backgroundColor',value);
        },
        _btnbgfrm_onclick:function (profile, o, value) {
            if(SPA.frm && SPA.$frmId){
                SPA.frm.css('background',value);
                SPA.$frmBg=value.slice(1);
            }
        },

        showResizer:function(){
            var resizer;
            if(!(resizer=SPA.resizer)){
                resizer=SPA.resizer=linb.create('div').css({zIndex:1001,position:'absolute'});
                resizer.addResizer({
                    forceVisible : true,
                    minHeight : 50,
                    minWidth : 50,
                    maxWidth : 800,
                    maxHeight : 800,
                    handlerSize : 8
                },function(profile,target){
                    var size=profile.proxy.cssSize();
                    target.cssSize(size);
                    linb('imgBig').attr('width',size.width).attr('height',size.height);

                });
                linb('panePic').append(resizer);
            }
            resizer.cssPos(linb('imgBig').offset(null,linb('panePic'))).cssSize(linb('imgBig').cssSize());
        },
        hideResizer:function(){
            if(SPA.resizer) SPA.resizer.hide();
        },
        showIcon:function(url){
            var icon;
            if(!(icon=SPA.icon)){
                icon=SPA.icon=linb.create('div').css({zIndex:1001,left:0,top:0,width:'100px',height:'100px',position:'absolute',border:'solid 1px #00ff00'});
                icon.append(linb.create('img'));
                icon.addResizer({
                    forceVisible : true,
                    forceMovable : true,
                    minHeight : 10,
                    minWidth : 10,
                    maxWidth : 800,
                    maxHeight : 800,
                    handlerSize : 6
                },function(profile,target,size,pos){
                    profile.box.onUpdate(profile,target,size,pos);
                    icon.first().cssSize(target.cssSize());
                });
                linb('panePic').append(icon);
            }
            icon.first().css({width:'auto',height:'auto'}).attr('src',url)
            icon.cssRegion({left:0,top:0,width:icon.first().attr('width'),height:icon.first().attr('height')});
            if(linb.browser.ie6)
                icon.first().fixPng('scale');
        },
        hideIcon:function(){
            delete SPA.$iconId;
            if(SPA.icon) SPA.icon.hide();
        },
        showFrm:function(url){
            var frm;
            if(!(frm=SPA.frm)){
                var img1,img2;
                frm=SPA.frm=linb.create('div').css({cursor:'move',zIndex:1001,left:0,top:0,position:'relative',overflow:'hidden'});
                frm.append(img1=linb.create('img'));
                frm.append(img2=linb.create('img'));
                linb('panePic').append(frm);

                img1.css({position:'absolute',left:0,top:0,zIndex:1});
                img2.css({position:'absolute',left:0,top:0,zIndex:2});

                frm._left=frm._top=0;
                frm.onMousedown(function(p,e,s){
                    linb([this]).startDrag(e,{
                        dragType:'none'
                    })
                }).onDrag(function(p,e,s){
                    var pro=linb.DragDrop.getProfile();
                    img1.left(frm.$left+pro.offset.x)
                        .top(frm.$top+pro.offset.y);
                }).onDragstop(function(p,e,s){
                    frm.$left=img1.left();
                    frm.$top=img1.top();
                });
                SPA.imgBig.setDisplay('none');
            }

            //reset position
            frm.$left=frm.$top=0;
            frm.first().cssPos({left:0,top:0});

            //set background image size
            frm.last().cssSize({width:'auto',height:'auto'}).attr('src',url);
            var size={width:frm.last().attr('width'),height:frm.last().attr('height')};
            if(linb.browser.ie6)
                frm.last().fixPng('scale');

            frm.first().attr('src',linb('imgBig').attr('src'));

            //background
            var value=SPA.iBGFrm.getUIValue();
            SPA.frm.css('background',value);
            SPA.$frmBg=value.slice(1);
            frm.cssSize(size).cssPos({left:0,top:0});

            //hide the original one
            _.resetRun('$imgvisible',function(){SPA.imgBig.setDisplay('none')});

        },
        hideFrm:function(){
            delete SPA.$frmBg;
            delete SPA.$frmId;
            SPA.iBGFrm.setValue('#FFFFFF',true)
            _.resetRun('$imgvisible',function(){SPA.imgBig.setDisplay('')});
            if(SPA.frm) SPA.frm.hide();
        },
        showCrop:function(){
            var crop;
            if(!(crop=SPA.crop)){
                crop=SPA.crop=linb.create('div').css({zIndex:1001,left:0,top:0,width:'100px',height:'100px',position:'absolute',border:'solid 1px #00ff00'});
                crop.addResizer({
                    forceVisible : true,
                    forceMovable : true,
                    minHeight : 10,
                    minWidth : 10,
                    maxWidth : 800,
                    maxHeight : 800,
                    handlerSize : 6
                },function(profile,target,size,pos){
                    profile.box.onUpdate(profile,target,size,pos);
                });
                linb('panePic').append(crop);
            }
            crop.cssRegion({left:0,top:0,width:100,height:100});
        },
        hideCrop:function(){
            if(SPA.crop) SPA.crop.hide();
        },
        showText:function(){
            var AddText;
            if(!(AddText=SPA.AddText)){
                AddText=SPA.AddText=new linb.UI.Input({
                    multiLines:true,
                    resizer:true
                }).setCustomStyle({
                    BORDER:'background:transparent',
                    INPUT:'background:transparent'
                })
                linb('panePic').append(AddText);

                _.asyRun(function(){
                    var resizer = AddText.getSubNode('BORDER').$getResizer();
                    _.merge(resizer.get(0).properties,{
                        forceVisible : true,
                        forceMovable : true,
                        minHeight : 10,
                        singleDir: true,
                        minWidth : 10,
                        maxWidth : 800,
                        maxHeight : 800,
                        handlerSize : 8
                    },'all');
                    resizer.refreshDom();
                },100);
                SPA.AddText.getSubNode('INPUT').css({fontSize:'32px',color:'#FFFF00',fontFamily:SPA.$fontFamily||''});
            }
            AddText.setLeft(0).setTop(0).setWidth(300).setHeight(100).setValue('freedom');
        },
        hideText:function(){
            if(SPA.AddText) SPA.AddText.hide();
        },
        _btnsave_click:function(){
            var id='ifr_for_download';
            if(!linb.Dom.byId(id))
                linb('body').append(linb.create('<iframe id="'+id+'" name="'+id+'" style="display:none;"/>'));

            var hash=_.copy(SPA.paras);
            hash.action='download';
            linb.Dom.submit(CONF.service, {key:'ImgProcess',para:hash}, 'get', id);
        },
        _btnupload_click:function (profile, e, src) {
            linb.ComFactory.getCom('uploader',function(){
                if(!SPA.com_uploader){
                    var o=SPA.com_uploader=this.getUIComponents();
                    linb('body').append(o);
                }
                var callback=function(rsp){
                    SPA.ilPhoto.insertItems([rsp.data],null,false);
                    SPA.ilPhoto.fireItemClickEvent(rsp.data.id);
                    SPA.ilHistory.clearItems().setTag(rsp.data.filename);

                    SPA.popMsg(linb.getRes('app.message.uploadOK'));
                };
                this.onUpload=function(file){
                    var hash={action:"upload", sessionname:SPA.paras.sessionname};
                    SPA.request1(hash,callback, file);
                    SPA.com_uploader.hide();
                };
                this.onOpenWeb=function(url){
                    var hash={action:"openweb", sessionname:SPA.paras.sessionname,url:url};
                    SPA.request1(hash,callback);
                    SPA.com_uploader.hide();
                };
                var root=SPA.com_uploader.getRoot(),
                    s1=root.cssSize(),
                    s2=linb(src).cssSize();
                root
                .popToTop(src,4)
                .setBlurTrigger(_(), function(){
                    SPA.com_uploader.hide();
                })
            });
        },

        base:[],
        required:["linb.UI.Pane", "linb.UI.Link", "linb.UI.Div", "linb.UI.ComboInput", "linb.UI.Tabs", "linb.UI.Button", "linb.UI.Image", "linb.UI.Dialog", "linb.UI.IconList", "linb.UI.Panel", "linb.UI.Range", "linb.UI.Stacks"],

        _showpopmenu:function(src,type,id){
            var aysid='__'+id, key='com_'+id;
            if(type=='mouseover'){
                _.resetRun(aysid,null);
                if(!SPA[key]){
                    var items=[],
                        set=linb.getRes('app.'+id);
                    _.each(set,function(o,i){
                        items.push({id:i,caption:'$app.'+id+'.'+i});
                    });
                    var o=SPA[key]=new linb.UI.PopMenu({
                        autoHide:true,
                        items:items
                    }).render(true);
                    o.getRoot().onMouseover(function(){
                        _.resetRun(aysid,null);
                    })
                    .onMouseout(function(){
                        _.resetRun(aysid,function(){
                            SPA[key].hide();
                        });
                    });
                    o.onMenuSelected(function (profile, item, src) {
                        var hash=_.copy(SPA.paras);
                        hash.action=item.id;
                        SPA.request2(hash);
                    });
                }
                SPA[key].pop(src);
            }else{
                if(SPA[key])
                    _.resetRun(aysid,function(){
                        SPA[key].hide();
                    });
            }
        },
        _btnrot_beforehovereffect:function (profile, item, e, src, type) {
            this._showpopmenu(src,type,'rotation');
        },
        _btnmir_beforehovereffect:function (profile, item, e, src, type) {
            this._showpopmenu(src,type,'mirror');
        },
        _btnfilter_beforehovereffect:function (profile, item, e, src, type) {
            this._showpopmenu(src,type,'filter');
        },

        _btnone_beforehovereffect:function (profile, item, e, src, type) {
            this._showpopmenu(src,type,'onecolor');
        },

        _showFontFamily:function(src,type,id){
            var aysid='__'+id, key='com_'+id;
            if(type=='mouseover'){
                _.resetRun(aysid,null);

                if(!SPA[key]){
                    var o=SPA[key]=new linb.UI.List({
                        items:SPA.$fontFamilies,
                        width:'480'
                    }).render(true);
                    o.getRoot().onMouseover(function(){
                        _.resetRun(aysid,null);
                    })
                    .onMouseout(function(){
                        _.resetRun(aysid,function(){
                            SPA[key].hide();
                        });
                    });
                    o.onItemSelected(function(profile, item, src) {
                        SPA[key].hide();
                        SPA.$fontFamily=item.caption;
                        SPA.AddText.getSubNode('INPUT').css('fontFamily',SPA.$fontFamily);
                        SPA.divFont.setHtml('<img style="border:solid 1px #ccc;cursor:pointer;" src='+item.path+' alt='+item.caption + '/>');
                    });
                }
                SPA[key].getRoot().popToTop(src);
            }else{
                if(SPA[key])
                    _.resetRun(aysid,function(){
                        SPA[key].hide();
                    });
            }
        },
        _divfont_mover:function(profile, e, src){
            SPA._showFontFamily(src,'mouseover','fontfamily');
        },
        _divfont_mout:function(profile, e, src){
            SPA._showFontFamily(src,'mouseout','fontfamily');
        },

        _fontsize_us:function (profile, o, v) {
            if(SPA.AddText)SPA.AddText.getSubNode('INPUT').css('fontSize',v+'px');
        },
        _cifontcolor_beforeuivalueset:function (profile, oldValue, newValue) {
            if(SPA.AddText)SPA.AddText.getSubNode('INPUT').css('color',newValue);
        },
        _btnaddtext_onclick:function(profile){
            var  hash=_.copy(SPA.paras);
            hash.action='writetext';
            hash.text=SPA.AddText.getUIValue();
            hash.fontcolor=linb.UI.ColorPicker.hex2rgb(SPA.ciFontColor.getUIValue()).join(',');
            hash.x=SPA.AddText.getLeft();
            hash.fontsize=SPA.ciFontSize.getUIValue();
            hash.fontfile=SPA.$fontFamily;
            hash.y=SPA.AddText.getTop() + Number(hash.fontsize);
            SPA.hideText();
            SPA.request2(hash,function(){
                SPA.AddText.getSubNode('INPUT').css({fontSize:'32px',color:'#FFFF00'});
                SPA.AddText.setLeft(0).setTop(0).setWidth(300).setHeight(100);
                SPA.ciFontSize.setValue('32',true);
                SPA.ciFontColor.setValue('#FFFF00',true);

                SPA.showText();
            });
        },
        _crop_onclick:function(profile){
            var img=SPA.imgBig.getRoot(),
                hash=_.copy(SPA.paras);
            hash.action='cut';
            var o=SPA.crop;
                reg=o.cssRegion();
            _.merge(hash, reg);

            SPA.hideCrop();
            SPA.request2(hash,function(){
                SPA.showCrop();
            });
        },
        _resize_onclick:function(profile){
            var img=SPA.imgBig.getRoot(),
                w=img.attr('width'),
                h=img.attr('height'),
                hash=_.copy(SPA.paras);

            if(w!==SPA.$width||h!=SPA.$height){
                hash.action='resize';
                hash.width=w;
                hash.height=h;

                SPA.request2(hash);
            }
        },
        popMsg:function(msg){
            var dlg=linb.UI.Dialog.pop(msg);
            _.asyRun(function(){
                if(dlg.getRoot())dlg.destroy();
                dlg=null;
            },3000);
        },
        request1:function(hash, callback, file){
            linb.Thread.observableRun(null, [function(threadid){
                var data={key:'ImgProcess',para:hash}, options;
                if(file){
                    data.file=file;
                    options={method:'post'};
                }
                linb.request(CONF.service, data, function(rsp){
                    var obj;
                    if(typeof rsp=='string')
                        obj=_.unserialize(rsp);
                    else obj=rsp;
                    if(obj){
                        if(!obj.error)
                            _.tryF(callback,[obj]);
                        else
                            SPA.popMsg(_.serialize(obj.error));
                    }else
                        SPA.popMsg(_.serialize(rsp));
                },function(rsp){
                    SPA.popMsg(_.serialize(rsp));
                }, threadid,options)
            }]);
        },
        request2:function(hash, callback){
            linb.Thread.observableRun(null, [function(threadid){
                linb.request(CONF.service, {key:'ImgProcess',para:hash}, function(rsp){
                    if(typeof rsp=='string')rsp=_.unserialize(rsp);
                    if(rsp.error)
                        SPA.popMsg(_.serialize(rsp.error));
                    else{

                        //another file
                        var tag=SPA.ilHistory.getTag();
                        if(SPA.paras.filename != tag){
                            SPA.ilHistory
                            .clearItems()
                            .setTag(SPA.paras.filename);
                        }

                        //removes the history first
                        var il=SPA.ilHistory,
                            items=il.getItems(),
                            b=false,arr=[];
                        _.each(items, function(o,i){
                            if(b)arr.push(o.id)
                            if(o.id==SPA.paras.tag)b=true;
                        });
                        il.removeItems(arr);

                        //add first for origin
                        if(SPA.paras.origin){
                            var obj=_.copy(SPA.paras);
                            obj.origin=obj.tag=SPA.paras.origin;
                            if(SPA.ilHistory.getItems().length===0)
                                SPA.ilHistory.setItems([{id:obj.tag, image: SPA.imgBig.getSrc(),  _obj:obj}]);
                            delete SPA.paras.origin;
                        }

                        //set momery paras
                        SPA.paras.logindate=rsp.data.logindate;
                        SPA.paras.tag=rsp.data.tag;
                        SPA.imgBig.setSrc(rsp.data.url);

                        //add to history
                        il.insertItems([{id:SPA.paras.tag, image: rsp.data.url, _obj:_.copy(SPA.paras)}], null, false);

                        //clear dirty mark
                        il.setValue(null,true);

                        _.tryF(callback,[rsp]);
                    }
                },function(rsp){
                    linb.message(rsp);
                }, threadid);
            }]);
        },
        _rangecon_afteruivalueset:function (profile, oldValue, newValue) {
           var hash=_.copy(SPA.paras);
           hash.action='filter_contrast';
           hash.value=Number(newValue.split(':')[1]);
           SPA.request2(hash,function(){profile.boxing().setValue('-100:0',true)});
        },
        _rangebri_afteruivalueset:function (profile, oldValue, newValue) {
           var hash=_.copy(SPA.paras);
           hash.action='filter_brightness';
           hash.value=Number(newValue.split(':')[1]);

           SPA.request2(hash,function(){profile.boxing().setValue('-100:0',true)});
        },
        _button12_onclick:function (profile, e, src, value) {
            if(!SPA.$iconId)return;

            var hash=_.copy(SPA.paras);
            hash.action="avatar";
            hash.value=SPA.$iconId;
            var reg=SPA.icon.cssRegion();
            hash.x=reg.left;
            hash.y=reg.top;
            hash.width=reg.width;
            hash.height=reg.height;

            SPA.request2(hash,function(){SPA.hideIcon()});
        },
        _button13_onclick:function (profile, e, src, value) {
            if(!SPA.$frmId)return;
            var hash=_.copy(SPA.paras);
            hash.action="modern_frame";
            hash.value=SPA.$frmId;
            hash.background=SPA.$frmBg;

            hash.x=SPA.frm.$left;
            hash.y=SPA.frm.$top;
            hash.width=linb('imgBig').width();
            hash.height=linb('imgBig').height();

            SPA.request2(hash, function(){SPA.hideFrm()});
        }
    }
});