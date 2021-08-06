var http = require('http');
var urlp = require('url');
var yQuote = require('./AxiosYhQuote.js')

var server = http.createServer(function(req, res) {
    const { method, url, headers, rawHeaders  } = req;
    //console.log('url: ' + url);
    //console.log('method: ' + method);
    //console.log('port: ' + process.env.PORT);
    //console.log('time: ' + 1);

    //get url infomation
    var urlParts = urlp.parse(req.url, true);
    //console.log(req.url, urlParts);
    ////////////////////////////////////////////
    //direct the request to appropriate function to be processed based on the url pathname
    //console.log(urlParts.pathname.replace('/ProxyYahoo', ''));
    urlParts.pathname = urlParts.pathname.replace('/ProxyYahoo', '');
    //console.log(req.url, urlParts);

    switch(urlParts.pathname) {
        case "/":
            var msg = homepage(req, res);
            res.writeHead(200, {"Content-Type":"text/plain"});
            res.write(JSON.stringify(msg));
            res.end(JSON.stringify(urlParts));
            break;
        case "/yahoo":
                yahoo(req, res, urlParts);
                break;
        case "/yahooH":
                yahooH(req, res, urlParts);
                break;
        default:
            res.writeHead(200, {"Content-Type":"text/plain"});
            res.write("reached default\n");
            res.end(JSON.stringify(urlParts));
            break;
    }
    ////////////////////////////////////////////
    //res.writeHead(200, {"Content-Type":"text/plain"});
    //res.end("Hello World from app ProxyYahoos\n");
})

//functions to process incoming requests
function homepage(req, res) {
    return "Hello, this is the home page 1 :)\n"; 
}
 

function yahoo(req, res, urlParts) {
    //res.writeHead(200, {"Content-Type":"text/csv"});
    res.writeHead(200, {"Content-Type":"application/json"});
    var queryObject = urlp.parse(req.url, true).query;
    const{sym} = queryObject;
    
    console.log(1);
    async function asyncCall() {
        console.log('calling');
        const result = await yQuote.getQuotes(sym, res);
        //console.log("result",result);
        // expected output: "resolved"
        console.log(2);
        const obj = { open: result.regularMarketOpen,
                    Hi: result.regularMarketDayHigh, 
                    Low: result.regularMarketDayLow,
                    Clo: result.regularMarketPrice, 
                    vol: result.regularMarketVolume,
                    name: result.displayName,
                    bid: result.bid,
                    ask: result.ask,
                    limit:  parseFloat((result.bid+result.ask)/2).toFixed(2)
                    };

        res.write(JSON.stringify(obj));
        //res.write('<p>' + JSON.stringify(result) + '</p>');
        
        //res.write('<p>' + JSON.stringify(queryObject) + '</p>');
        //res.end("Hello, we reached yahoo."); 
        res.end(""); 
      }
    asyncCall();

    

    //res.write(JSON.stringify(queryObject));
    //res.end("Hello, we reached yahoo.");  
}

function yahooH(req, res, urlParts) {
    res.writeHead(200, {"Content-Type":"text/plain"});
    var queryObject = urlp.parse(req.url, true).query;
    
    res.write(JSON.stringify(queryObject));
    res.end("Hello, we reached yahooH.");  
}

var port = process.env.PORT || 3000;
server.listen(port);
console.log('server is running on port: ' + port);