var phantom = require('phantom');
var fs = require('fs');


var config = {
    url: "http://nigirizushi.aucmint.com:9001/client/phantom_ws.html"
};

//var responseFile = fs.createWriteStream('response.csv', {'flags': 'a'});

function loadtest(){
    phantom.create(function(ph){
        ph.createPage(function(page){
        page.onConsoleMessage(function(msg){
            console.log(msg);
//            responseFile.write(msg);
 //           responseFile.write("\n");
        });

        page.open(config.url, function(status){
            page.injectJs("/home/wisedev/atul/server/client/js/jquery.min.js", function(){
                var click = page.evaluate(function(){
                    $("#connect").click();
                });
            });
        });
    });
    })
}

loadtest();
