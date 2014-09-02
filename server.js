var express = require('express');
var app = express();
var server = require('http').createServer(app);
var expressWs = require('express-ws')(app,server);
var randomstring = require("randomstring");
var fs = require('fs');

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","X-Reqested-With");
    return next();
});

var responseFileAjax = fs.createWriteStream('data/ajax.csv', {'flags': 'w'});
var responseFileWs = fs.createWriteStream('data/ws.csv', {'flags': 'w'});

responseFileAjax.write('Id,Time\n');
responseFileWs.write('Id,Time\n');
app.use("/public",express.static(__dirname+'/public'));
app.use("/data",express.static(__dirname+'/data'));
app.use("/client",express.static(__dirname+'/client'));
app.get('/', function(req, res, next){
    r = randomstring.generate(1000);
    if(req.query.timestamp && req.query.timestamp != 'undefined'){
        time = new Date().getTime();
        diff_time = (time - req.query.timestamp);
        responseFileAjax.write(time+','+diff_time+'\n');
        res.send("done");
    }else{
        res.send(getResponse());
    }

    res.end();
});

app.get("/reset", function(req, res, next){
    fs.truncate("data/ajax.csv", '' , function(){ responseFileAjax.write('Id,Time\n')});
    res.send("done");
    res.end();
});

app.get("/reset_ws", function(req, res, next){
    fs.truncate("data/ws.csv", '' , function(){ responseFileWs.write('Id,Time\n')});
    res.send("done");
    res.end();
});


app.ws('/ws', function(ws, req){
    ws.send(getResponse());
    ws.on('message', function(msg){
//        ws.send(getResponse());
        time = new Date().getTime();
        diff_time = (time - msg);
        responseFileWs.write(time+','+diff_time+'\n');
    });
});
server.listen(9001);

function getResponse(){
    t = new Date().getTime();
    r = randomstring.generate(1000);
    return JSON.stringify({timestamp: t, response: r});
}
