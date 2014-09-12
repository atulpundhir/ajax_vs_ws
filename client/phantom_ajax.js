var wsUri = ["http://durian.aucmint.com:9002/", "http://durian.aucmint.com:9003/", "http://durian.aucmint.com:9006/", "http://durian.aucmint.com:9007/"];
var cnt= 10;
var startTime = Date.now();

function getMessage() {
   return wsUri[Math.floor(Math.random() * wsUri.length)];
}

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


fireAjax(getMessage());


function resendData(t){
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200){

            var diff = Date.now() - startTime;
            if(diff < 20000){

            fireAjax(getMessage());
        //    postMessage(xmlhttp.responseText);
            }
           // console.log("Good");
        }
    };

    uri =  getMessage()    
    xmlhttp.open("GET", uri+"?timestamp="+t);
    xmlhttp.send();
}


