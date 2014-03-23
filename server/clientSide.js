var url = require("url");
var express = require('express');
var config = require('./config.js');
var serverSide = require('./serverSide.js');
var winston = require('winston');
/* json api server
GET Methods:

-login { key : generated key
		 deviceid : }
		 return: token which can be used to open the door
		 
-opendoor { generated token in server handshake }
		return error or success message
		
-generate: this generates a new passphrase which can be handed out to users
		{ master password }
		return passphrase


*/

// begin
var app = express(); 
app.use(express.json());
var addCORSHeaders = function (req, res) {
    res.setHeader("Access-Control-Max-Age", "300")
    res.setHeader("Access-Control-Allow-Origin", req.headers['origin'])
    res.setHeader("Access-Control-Allow-Credentials", "true")

    if (req.headers.hasOwnProperty("access-control-request-method")) {
        res.setHeader("Access-Control-Allow-Methods", req.header['access-control-request-method']);
    }

    if (req.headers.hasOwnProperty("access-control-request-headers")) {
        res.setHeader("Access-Control-Allow-Headers", req.header['access-control-request-headers']);
    }
};

// add CORS headers to every request
app.all(config.path + '/*', function (req, res, next) {
    addCORSHeaders(req, res);
    next();
});

app.get(config.path + '/login', function (req, res) {
	query = url.parse(req.url,true).query;
	var key = query.key;
    var deviceid = parseInt(query.deviceid);
	deviceInfo = serverSide.login(deviceid, key);
	
	if(deviceInfo)
	{
		winston.info("login from user");
		res.send(deviceInfo);
	}
	else
	{ 
		res.status(401).send();
	}
});

app.get(config.path + '/opendoor', function (req, res) {
 
});

app.get(config.path + '/generate', function (req, res) {
   
   
});

exports.app = app;
exports.start = function()
{
for(var i=1;i<15;i++)
{
	serverSide.createDevice(i,i%3?[1,2]:[1],i%3);
}

}

