var url = require("url");
var express = require('express');
var config = require('./config.js');
var serverSide = require('./serverSide.js');
var helpers = require('./helpers');
var logger = require('./logger.js');
/** json api server
 *GET Methods:


 */

// begin
var app;
app = express();
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
    }
);
app.get(config.path + '/api', function (req, res) {
    res.send('OpenDoor API up and running');
});

app.get(config.path + '/login', function (req, res) {
        var query = url.parse(req.url, true).query;
        var key = query.key;
        var deviceid = query.deviceid;
        var notificationid = query.notificationid;
        serverSide.login(deviceid, key, notificationid, function (deviceInfo) {
                if (deviceInfo) {
                    logger.info("user login: successful");
                    res.send(deviceInfo);
                }
                else {
                    res.status(401).send();
                    logger.info("user login: bad key or deviceid");
                }
            }
        );
    }
);

app.get(config.path + '/opendoor', function (req, res) {
        var query = url.parse(req.url, true).query;
        var token = query.token;
        var deviceid = query.deviceid;
        var doorNumber = parseInt(query.doorNumber);

        serverSide.opendoor(deviceid, doorNumber, token, function (success) {
                if (success) {
                    logger.info("user opened door " + deviceid + " door: " + doorNumber);
                    res.send(
                        {
                            success: success
                        }
                    );
                } else res.status(401).send(
                    {
                        success: success
                    }
                );
            }
        );
    }
);
/**
*	generates new devices, expected params:
*   TODO only use in test/dev
* 	@param numDevices has to be a number
*	@param withKeys	 boolean
*/
app.get(config.path + '/generate', function (req, res) {
        var query = url.parse(req.url, true).query;
        var numDevices = parseInt(query.numDevices);
        var withKeys = query.withKeys;
        if (!numDevices) res.status(401).send()
        else {
            var devices = {};
            if (withKeys)
                devices = helpers.createDevices(numDevices, {amount: 5, limit: 999, days: 3},function(err,result)
                {
                    if(result) res.send(result);
                });
            else {
                devices = helpers.createDevices(numDevices,false, function(err,result) {
                    if(result) res.send(result);
                });
            }
        }
    }
);

/**
*	generates new devices, expected params:
* 	@param user
*	@param pwd
*	@param doors  : amount of dooors
*/

app.get(config.path + '/createDevice', function (req, res) {
        var query = url.parse(req.url, true).query;
        var doors = parseInt(query.doors);
        var user =  query.user;
        var pwd = query.pwd;
        if(doors < 1)
        {
            res.status(401).send('must be more doors than 0');
        }
        serverSide.loginAdmin(user,pwd, function(success) {
            //TODO change pwd to hash
            if(success) {
                var device = serverSide.createDevice(doors);
                res.send(device);
            }
            else res.status(401).send('Wrong password or user');
        });
    }
);

/**
*	generates new devices, expected params:
* 	@param user
*	@param pwd
*	@param doors  : amount of dooors
*/

app.post(config.path + '/generateKey', function (req, res) {
        var json = req.body;
        var deviceid = json.deviceid;
        var expire = json.expire;
        var limit = json.limit;
        var masterpwd = json.masterpwd;
        var doors = json.doors;
        var name = json.name;
        var props = ['deviceid', 'doors', 'expire', 'limit', 'name', 'masterpwd'];
        if(!checkJSON(props, json))
        {
            res.status(500).send();
        }
        serverSide.generateKey(deviceid,doors, expire, limit,name, masterpwd, function(err,suc)
        {
            if(suc)
                res.json(suc);
            else
                res.status(500).send();
        });
    }
);

function checkJSON(properties,json){
    return properties.every(function(one){return one in json})
}
//function i(p,o){return p.every(function(a){return a in o})}
//function h(p,o){c=1;p.map(function(a){c&=a in o});return c}
//function j(p,o){c=1;for(a of p)c&=a in o;return c}
//function c(k,j){return k.reduce(function(a,b){return a&b in j},1)}

//function c(k,j){return k.reduce(function(a,b){return a&j.hasOwnProperty(b)},true)}

exports.app = app;

