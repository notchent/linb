CONF={
    mainTableKey:{
        view_xfactor:'xfactor'
    },
    columns:{
        questionaire:[
            {id:'id',type:'number',caption:'id',width:30},
            {id:'code',caption:'question code',width:80},
            {id:'q_desc',caption:'description',width:400},
            {id:'q_ms',caption:'MS',width:20},
            {id:'q_type',caption:'type',width:50},
            {id:'cat1',caption:'cat1',width:80},
            {id:'weight1',caption:'weight1',width:50,type:'number'},
            {id:'cat2',caption:'cat2',width:80},
            {id:'weight2',caption:'weight2',width:50,type:'number'},
            {id:'keyarea',caption:'key area',width:20}
        ],
        view_xfactor:[
            {id:'id',type:'number',caption:'id',width:30},
            {id:'code',caption:'code',width:120},
            {id:'factor',caption:'factor',width:300},
            {id:'desc',caption:'desc',width:400},
            {id:'category',caption:'category'},
            {id:'order',caption:'order',type:'number',width:50},
            {id:'count',caption:'count',type:'number',width:50}
        ],
        view_oresult:[
            {id:'no',caption:'desc key',width:240},
            {id:'wave',caption:'wave',width:50},
            {id:'X1-outletno',caption:'outlet no',width:50},
            {id:'X2-date',caption:'wave1 date'},
            {id:'X6-date',caption:'wave2 date'},
            {id:'X7-date',caption:'follow date'},
            {id:'count',caption:'checked times',type:'number'}
        ]
    },
    paras:{
    },

    service:'request.php',
    
    XQuestions:[{id:'overall-feeling',group:true,sub:['TL-Q1a','TL-Q1b','TL-Q1c','RC-Q15a','RC-Q15b','RC-Q15c','SR-Q15a','SR-Q15b','SR-Q15c','SP-Q17a','SP-Q17b','SP-Q17c','TD-Q1a','TD-Q1b','TD-Q1c','FU-Q3a','FU-Q3b','FU-Q3c']},
{id:'first-impression',group:true,sub:['FU-Q2','RC-Q1','RC-Q1a','SR-Q1','SR-Q1a','SR-Q2','SR-Q2a','SC-Q1','SC-Q1a']},
{id:'buying-justifacation',group:true,sub:['TD-Q2a','TD-Q2b','TD-Q3a','TD-Q3b']}
],  
    
    ComFactoryProfile:{
        questionaire:{
            cls:'App.Form_questionaire'
        },
        view_oresult:{
            cls:'App.Form_oresult'
        },
        view_xfactor:{
            cls:'App.Form_factor'
        }
    }
};