Class("linb.UI.FusionChart", "linb.UI.FusionChartFree",{
    Static:{
        FC_LINKTAG:'j-',
        FC_SWFFILEPRETAG:"",
        DataModel:{
            chartType:{
                combobox:"Column2D,Column3D,Pie2D,Pie3D,Line,Bar2D,Area2D,Doughnut2D,Doughnut3D,MSColumn2D,MSColumn3D,MSLine,MSArea2D,MSBar2D,MSBar3D,StackedColumn2D,StackedColumn3D,StackedArea2D,StackedBar2D,StackedBar3D,MSStackedColumn2D,MSCombi2D,MSCombi3D,MSColumnLine3D,MSCombiDY2D,MSColumn3DLineDY,StackedColumn3DLineDY,MSStackedColumn2DLineDY,Scatter,Bubble,ScrollColumn2D,ScrollLine2D,ScrollArea2D,ScrollStackedColumn2D,ScrollCombi2D,ScrollCombiDY2D".split(',')
            },
            swfPath:"FusionCharts3/Charts/",
            demoDataPath:"FusionCharts3/Data/"
        }
    }
});