linb.Com.load('VisualJS', function(){
    linb(linb.ini.prgId).remove();
    var lang = linb.Cookies.get('lang');
    if(!lang)
        linb.Cookies.set('lang',CONF.dftLang||'en');
}, linb.Cookies.get('lang')||CONF.dftLang||'en');