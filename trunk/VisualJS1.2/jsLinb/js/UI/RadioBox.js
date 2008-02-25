Class("linb.UI.RadioBox", "linb.UI.List",{
    Initialize:function(){
        //modify default template for shell
        var t = this.getTemplate('default');
        t.$dynamic={
            items:{
                ITEM:{
                    tagName: 'a',
                    href :"javascript:;",
                    tabindex: '{_tabindex}',
                    MARK:{
                        $order:0
                    },
                    ICON:{
                        style:'background:url({icon}) transparent  no-repeat {iconPos};{iconDisplay}',
                        $order:1
                    },
                    CAPTION:{
                        text : '{caption}',
                        className:"{disabled}",
                        $order:2
                    }
                }
            }
        };
        this.setTemplate('default',t);
    },
    Static:{
        Appearances:{'default':{
            ITEM:{
               'font-family':' "Verdana", "Helvetica", "sans-serif"',
               border:0,
               margin:'2px',
               padding:'0 0 0 4px',
               cursor:'pointer',
               'vertical-align':'middle',
               display:linb.browser.gek?['-moz-inline-block', '-moz-inline-box']: 'inline-block',
               'vertical-align':'middle',
               'font-size':'12px'
            },
            'ITEM-checked':{},
            MARK:{
               cursor:'pointer',
               width:'16px',
               height:'16px',
               background: linb.UI.getCSSImgPara('cmds.gif', ' no-repeat -144px top', null, 'linb.UI.Public')
           },
           'ITEM-mouseover MARK':{
                $order:1,
                'background-position':' -144px -17px'
           },
           'ITEM-mousedown MARK':{
                $order:2,
                'background-position':' -144px -34px'
           },
           'ITEM-checked MARK':{
                $order:3,
                'background-position':' -128px top'
           },
           'ITEM-checked-mouseover MARK':{
                $order:4,
                'background-position':' -128px -17px'
           },
           'ITEM-checked-mousedown MARK':{
                $order:5,
                'background-position':' -128px -34px'
            },
            ICON:{
                cursor:'pointer',
                width:'16px',
                height:'16px',
                margin:'0 4px 0 0'
            },
            ITEMS:{
                overflow:'auto',
                'line-height':'12px',
                background:'#fff'
            }
        }}
    }
});
