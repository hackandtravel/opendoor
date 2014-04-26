var http = require('http');
var https = require('https');
var fs = require('fs');
var raspberry = require('./raspberrySide.js');
var clientside = require('./clientSide.js');
var serverSide = require('./serverSide.js');
var helpers = require('./helpers.js');
var config = require('./config.js');
var winston = require('./logger.js');

// CONSTANTS

// The 'secret' folder is not shared in git.
// Follow these instructions to create your own:
// http://nodejs.org/api/tls.html
// easier http://www.selfsignedcertificate.com/
var options;
try {
    if (process.env.NODE_ENV === 'production') {
      options = {
        key: fs.readFileSync(__dirname + '/secret/opendoor-key.pem'),
        cert: fs.readFileSync(__dirname + '/secret/opendoor-cert.pem')
      };
    } else {
      options = {
        key: fs.readFileSync(__dirname + '/secret/ryans-key.pem'),
        cert: fs.readFileSync(__dirname + '/secret/ryans-cert.pem')
      };
    }
} catch (ex) {
    throw new Error("SSL key missing. Create your own: http://nodejs.org/api/tls.html")
}
serverSide.init(cb);
function cb()
{
var client = https.createServer(options, clientside.app).listen(config.portClient);

winston.info('Startup');
// call if you want to generate data

var rasp = https.createServer(options);
var io = raspberry.getIO(rasp);
rasp.listen(config.portRasp);
}