var cnt= 10;
var startTime = Date.now();
function fireAjax(url){
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                var parseData = JSON.parse(xmlhttp.responseText);
                diff = Date.now() - startTime;
                if(diff < 60000){
                    resendData(parseData.timestamp);
                }
               // postMessage(xmlhttp.responseText);
        }else{
            //console.log("failed");
        }

    };
    xmlhttp.open("GET",url, true);
    xmlhttp.send();
}


fireAjax("http://durian.aucmint.com:9001/");


function resendData(t){
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
            diff = Date.now() - startTime;
            if(diff < 60000){
                fireAjax("http://durian.aucmint.com:9001/");
            }
//            console.log("Good");
        }
    };

    xmlhttp.open("GET", "http://durian.aucmint.com:9001/?timestamp="+t);
    xmlhttp.send();
}


