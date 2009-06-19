
Class('App', 'linb.Com',{
    Instance:{
        events:{onReady:'_onready'}, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.SLabel)
                .host(host,"slabel1")
                .setLeft(157)
                .setTop(40)
                .setCaption("Click to select single cell")
            );
            
            append((new linb.UI.SLabel)
                .host(host,"slabel2")
                .setLeft(51)
                .setTop(194)
                .setCaption("Use Alt or Shift keyboard to select multi cells")
            );
            
            append((new linb.UI.SLabel)
                .host(host,"slabel3")
                .setLeft(156)
                .setTop(114)
                .setCaption("Click to select single row")
            );
            
            append((new linb.UI.SLabel)
                .host(host,"slabel4")
                .setLeft(50)
                .setTop(274)
                .setCaption("Use Alt or Shift keyboard to select multi rows")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput8")
                .setLeft(170)
                .setTop(214)
                .setReadonly(true)
                .setType("popbox")
                .beoforeComboPop("_comboinput8_beoforeComboPop")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput4")
                .setLeft(170)
                .setTop(60)
                .setReadonly(true)
                .setType("popbox")
                .beoforeComboPop("_comboinput4_beoforeComboPop")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput9")
                .setLeft(170)
                .setTop(140)
                .setReadonly(true)
                .setType("popbox")
                .beoforeComboPop("_comboinput9_beoforeComboPop")
            );
            
            append((new linb.UI.ComboInput)
                .host(host,"comboinput10")
                .setLeft(170)
                .setTop(294)
                .setReadonly(true)
                .setType("popbox")
                .beoforeComboPop("_comboinput10_beoforeComboPop")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        _poptg:function(profile, pos, mode1, mode2, callback){
            var g;
            if(!SPA.popTg){
                g=SPA.popTg=new linb.UI.TreeGrid({width:300,height:160,dock:'none',visibility:'hidden',rowHandler:false});
                g.setCustomStyle('KEY','border:solid 1px #888');
                g.setHeader(['a','b','c','d'])
                 .setRows([['1','2','3','4'],['5','6','7','8'],['9','10','11','12'],['13','14','15','16']])
                 .setShowHeader(false);
                linb('body').append(g);
            }
            g=SPA.popTg;
            g.setValue('',true)
             .setActiveMode(mode1)
             .setSelMode(mode2)
             .afterUIValueSet(callback)
             .getRoot().popToTop(pos).setBlurTrigger('__a', function(){
                g.hide();
            });
            linb.Event.keyboardHook('esc',0,0,0,function(){
                g.hide();
                linb.Event.keyboardHook('esc');
            });
        }, 
        _comboinput4_beoforeComboPop:function (profile, pos, e, src) {
            this._poptg(profile,pos,'cell','single',function(p, oldValue, newValue) {
                var a=(newValue||'').split('|');
                newValue=p.boxing().getCellbyRowCol(a[0],a[1]);
                profile.boxing().setUIValue(newValue.value);
                SPA.popTg.hide();
             });
             return false;
        }, 
        _comboinput8_beoforeComboPop:function (profile, pos, e, src) {
            this._poptg(profile,pos,'cell','multi',function(p, oldValue, newValue) {
                newValue=newValue||'';
                var a=[];
                _.arr.each(newValue.split(';'),function(o){
                    var b=(o||'').split('|');
                    o=p.boxing().getCellbyRowCol(b[0],b[1]);
                    a.push(o.value);
                });
                profile.boxing().setUIValue(a.join(';'));
             });
             return false;
        }, 
        _comboinput9_beoforeComboPop:function (profile, pos, e, src) {//
            this._poptg(profile,pos,'row','single',function(p, oldValue, newValue) {
                profile.boxing().setUIValue(newValue);
                SPA.popTg.hide();
             });
             return false;
        }, 
        _comboinput10_beoforeComboPop:function (profile, pos, e, src) {
             this._poptg(profile,pos,'row','multi',function(p, oldValue, newValue) {
                profile.boxing().setUIValue(newValue);
             });
             return false;
        }, 
        _onready:function (com, threadid) {
            SPA=this;
        }
    }
});