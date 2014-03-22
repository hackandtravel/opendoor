var http = require('http');
var https = require('https');
var fs = require('fs');
var raspberry = require('./raspberrySide.js');
//var clientside = require('./clientSide.js');
//var serverside = require('./serverSide.js');
// CONSTANTS
const portRasp = 3002;
const portClient = 3001;

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

//var client = https.createServer(options, clientside.serverThread(req,res)).listen(portClient);
var rasp = https.createServer(options, function serverThread(req,res){ res.writeHead('200')} )

var io = raspberry.getIO(rasp);
rasp.listen(portRasp);

