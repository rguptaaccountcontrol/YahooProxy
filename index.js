var http = require('http');
var urlp = require('url');
var yQuote = require('./AxiosYhQuote.js');
var yHist = require('./AxiosYhHist.js');

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
    urlParts.pathname = urlParts.pathname.replace('/YahooProxy', '');
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
    
    /////////////////////////
    // to take care of CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
      };
    res.writeHead(200, headers);
    ////////////////////////////
    //res.writeHead(200, {"Content-Type":"text/csv"});
    //res.writeHead(200, {"Content-Type":"application/json"});
    var queryObject = urlp.parse(req.url, true).query;
    const{sym} = queryObject;
    
    //console.log(1);
    async function asyncCall() {
        //console.log('calling');
        const result = await yQuote.getQuotes(sym, res);
        //console.log("result",result);
        // expected output: "resolved"
        //console.log(2);
        const obj = {
                    regularMarketTime: result.regularMarketTime,
                    shortName: result.shortName,
                    ytdReturn: result.ytdReturn,
                    fiftyTwoWeekHigh: result.fiftyTwoWeekHigh,
                    open: result.regularMarketOpen,
                    Hi: result.regularMarketDayHigh, 
                    Low: result.regularMarketDayLow,
                    Clo: result.regularMarketPrice, 
                    vol: result.regularMarketVolume,
                    symbol: result.symbol,
                    bid: result.bid,
                    ask: result.ask,
                    limit:  parseFloat((result.bid+result.ask)/2).toFixed(2),
                    chg: result.regularMarketChangePercent.toFixed(2) + "%"
                    };

        res.write(JSON.stringify(obj));

        //console.log(JSON.stringify(obj));
        //console.log(JSON.stringify(result));
        
        res.end(""); 
      }
    asyncCall();

    

    //res.write(JSON.stringify(queryObject));
    //res.end("Hello, we reached yahoo.");  
}

function yahooH(req, res, urlParts) {
    /////////////////////////
    // to take care of CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
        /*'content-type': 'text/csv;charset=utf-8', */
        'content-type': 'text/plain',
      };
    res.writeHead(200, headers);
    ////////////////////////////
    //res.writeHead(200, {"Content-Type":"text/plain"});
    var queryObject = urlp.parse(req.url, true).query;
    const{sym,d1,d2} = queryObject;
    
    //console.log(1);
    /*async function asyncHCall() {
        console.log('calling');
        const result = await yHist.getHist(sym,d1,d2);

        console.log(2);

        res.write(JSON.stringify(result));
        //res.write('<p>' + JSON.stringify(result) + '</p>');
        
        //res.write('<p>' + JSON.stringify(queryObject) + '</p>');
        //res.end("Hello, we reached yahoo."); 
        res.end(""); 

    }

    asyncHCall();
    */
    var hh;
    yHist.getHist(sym,d1,d2,function(a /* a is passed using callback */)
    {
        //console.log(a); // a is 5
        hh = a;  // assign the returned value to a variable
    }
    ).then (function () {
        //console.log(hh);
        res.write(hh);  // display the return value
        res.end(""); 
    }
    );

     
}

var port = process.env.PORT || 3000;
server.listen(port);
console.log('server is running on port: ' + port);