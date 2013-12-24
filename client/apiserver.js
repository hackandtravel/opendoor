(function() {
  var app, express;

  express = require('express');

  app = express();

  app.use(express.bodyParser());

  app.configure(function(){
    app.use(function(req, res, next) {
      addCORSHeaders(req, res);
      return next();
    });
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  var addCORSHeaders = function(req, res) {
    res.setHeader("Access-Control-Max-Age", "300")
    res.setHeader("Access-Control-Allow-Origin", req.headers['origin'])
    res.setHeader("Access-Control-Allow-Credentials", "true")

    if(req.headers.hasOwnProperty("Access-Control-Request-Method")) {
      res.setHeader("Access-Control-Allow-Methods", req.header['Access-Control-Request-Method']);
    }

    if(req.headers.hasOwnProperty("Access-Control-Request-Headers")) {
      res.setHeader("Access-Control-Allow-Headers", req.header['Access-Control-Request-Headers']);
    }
  };

  app.get('/login', function(req, res) {
    addCORSHeaders(req, res);
    console.log("request");
    setTimeout(function() { 
      res.send({token: "abc"});
    }, 3000);
  });

  app.get('/opendoor', function(req, res) {
    addCORSHeaders(req, res);
    console.log("request");
    setTimeout(function() { 
      res.send("opend door for 5 seconds");
    }, 3000);
  });

  app.listen(3003);

}).call(this);
