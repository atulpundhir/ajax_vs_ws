var wsUri = "ws://durian.aucmint.com:9001/ws";
var output;
var cnt = 100;
var startTime = Date.now();

function init(){
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) {onOpen(evt);};
    websocket.onclose = function(evt) { onClose(evt);};
    websocket.onmessage = function(evt) { onMessage(evt);};
    websocket.onerror = function(evt){ onError(evt);};
}

function onOpen(evt){
  //  console.log("Connected");
}

function onClose(evt){
    console.log("Disconnected");
}

function onMessage(evt){
    diff = Date.now() - startTime;
    if(diff < 10000){
        var res = JSON.parse(evt.data);
        websocket.send(res.timestamp);
    }
//    postMessage("res");
}

function onError(evt){
    console.log("Errorrrr");
}

function doSend(msg){
   websocket.send(msg);
}

init();
