CONF={
    basePath:'imglib/', 
    service:'request.php', 


    workingPath:'working/', 
    //Dynamic Injector Mechanism for linb.ComFactory
    ComFactoryProfile:{
        //_iniMethod:'create',
        uploader:{
            cls:'App.Upload'
        }
    }
};