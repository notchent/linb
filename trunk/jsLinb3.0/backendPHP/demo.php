<?php
    // include lib
    include_once("linb.php");

    /**
    * the following code may be in a controller function( for Yii, CodeIgniter etc..)
    **/

    // get request data
    $inputData = linb_getRequestData();
    
    $outputData=new stdClass;

    if(rand(0,1)>0.5){
        // successful
        $ok=true;

        // business logic code
        // $outputData can be any variable
        $outputData->strRresult="str";
        $outputData->intResult=microtime()*1000000;
        
        $outputData->inputData=$inputData;
        
    }else{
        // fail
        $ok=false;
        
        // error info
        $outputData->errid="1";
        $outputData->message="error message";
    }

    // echo result
    linb_echoResponse($inputData, $outputData, $ok);
?>