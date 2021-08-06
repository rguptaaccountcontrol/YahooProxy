//This is the one we should use for quoteResponse
var axios = require("axios");

//var rl;

// Want to use async/await? Add the `async` keyword to your outer function/method.
function getQuotes(ticker, res) {
    

        //var ticker = 'aapl';
        var stock_url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${ticker}&format=json`;

    return axios.get(stock_url)  // we need this so await can be used in index.js
    .then (function (response) {
        // handle success
        var stock_data = response;
        var status = response.status;
        var headers = response.headers;
        var config = response.config;

        var q = response.data.quoteResponse.result[0];

        //console.log(q);

        var clo = q.regularMarketPrice;
        var Hi = q.regularMarketDayHigh;
        var Lo = q.regularMarketDayLow;
        var vol = q.regularMarketVolume;
        var open = q.regularMarketOpen;
        var name = q.displayName;
        var bid = q.bid;
        var ask = q.ask;
        
        console.log("clo: ", Hi,Lo,clo,vol,open, name, bid,ask, "limit: ", (bid+ask)/2);  
        console.log(q.symbol);
        
        //console.log("status: " , status);
        //console.log("headers: " , headers);
        //console.log("config: " , config);
        //console.log(response);
        //rl = q;
        return q; // this is what is returned to the next .then (the second then)
    
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function (aaaa) {
        // always executed      
        //console.log("Axios fn: ",aaaa);
        return aaaa; // This is wat is returned to the calling function in index.js
      });
        
  }

  

  module.exports.getQuotes = getQuotes;
 // module.exports.rl = rl;