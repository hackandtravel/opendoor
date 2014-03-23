var http = require('http');
var https = require('https');
var fs = require('fs');
var raspberry = require('./raspberrySide.js');
var clientside = require('./clientSide.js');
var config = require('./config.js');
var winston = require('winston');
var monk = require('monk');

// CONSTANTS


// The 'secret' folder is not shared in git.
// Follow these instructions to create your own:
// http://nodejs.org/api/tls.html
var options;
try {
  options = {
    key: fs.readFileSync(__dirname + '/secret/ryans-key.pem'),
    cert: fs.readFileSync(__dirname + '/secret/ryans-cert.pem')
  };
} catch (ex) {
  throw new Error("SSL key missing. Create your own: http://nodejs.org/api/tls.html")
}

var client = https.createServer(options, clientside.app).listen(config.portClient);

winston.info('Startup');
// call if you want to generate data
// clientside.start();
var rasp = https.createServer(options);
var io = raspberry.getIO(rasp);
rasp.listen(config.portRasp);
