 {
     header: [
        {
            "id" : "col1",
            "caption" : "col1",
            "type" : "input",
            "width" : 50
        },
        {
            "id" : "col2",
            "caption" : "col2",
            "type" : "number",
            "format":"^-?\\d\\d*$",
            "width" : 80
        },
        {
            "id" : "col3",
            "caption" : "col3",
            "type" : "checkbox",
            "width" : 40
        }
    ],
    rows: [
        {
            "id" : "row1",
            "cells" : ["cell11",1,false]
        },
        {
            "id" : "row2",
            "cells" : ["cell21",2,false]
        },
        {
            "id" : "row3",
            "cells" : ["cell31",3,false]
        },
        {
            "id" : "row4",
            "cells" : ["cell41",4,false]
        },
        {
            "id" : "row5",
            "cells" : ["cell51",5,false],
            "sub" : [
                {
                    "id" : "row6",
                    "cells" : ["in61",6,false]
                },
                {
                    "id" : "row7",
                    "cells" : ["in71",7,false]
                },
                {
                    "id" : "row8",
                    "cells" : ["in81",8,false]
                },
                {
                    "id" : "row9",
                    "cells" : ["in91",9,false]
                }
            ]
        }
    ]
}