var cnt= 10;
var startTime = Date.now();
function fireAjax(url){
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
            var diff = Date.now() - startTime;
            if(diff < 20000){
                var parseData = JSON.parse(xmlhttp.responseText);
                resendData(parseData.timestamp);
                }
        }else{
           // console.log("failed");
        }

    };
    xmlhttp.open("GET",url, true);
    xmlhttp.send();
}


fireAjax("http://localhost:9001/");


function resendData(t){
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200){

            var diff = Date.now() - startTime;
            if(diff < 20000){

            fireAjax("http://localhost:9001/");
        //    postMessage(xmlhttp.responseText);
            }
           // console.log("Good");
        }
    };

    xmlhttp.open("GET", "http://localhost:9001/?timestamp="+t);
    xmlhttp.send();
}


