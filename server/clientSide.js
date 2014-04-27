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
        logger.info(req.method, req.url, req.query, req.body);
        addCORSHeaders(req, res);
        next();
    }
);
app.get(config.path + '/api', function (req, res) {
    res.send('OpenDoor API up and running');
});

app.get(config.path + '/device', function (req, res) {
    var query = url.parse(req.url, true).query;
    if (checkJSON(['deviceid', 'token'], query)) {
        serverSide.getDevice(query.deviceid, query.token).then(
            function (device) {
                res.send(device);
            },
            function (error) {
                res.send(401);
            });
    }
    else res.send(401);
});


app.put(config.path + '/device', function (req, res) {
    var json = req.body;
    if (checkJSON(['deviceid', 'token'], json)) {
        serverSide.putDevice(json.deviceid, json.token).then(
            function (device) {
                res.send(device);
            },
            function (error) {
                res.send(401);
            });
    }
    else res.send(401);
});

app.get(config.path + '/login', function (req, res) {
    var query = url.parse(req.url, true).query;
    var key = query.key;
    var deviceid = query.deviceid;
    var notificationid = query.notificationid;
    serverSide.login(deviceid, key, notificationid).then(function (deviceInfo) {
        if (deviceInfo) {
            logger.info("user login: successful");
            res.send(deviceInfo);
        }
        else {
            res.status(401).send();
            logger.info("user login: bad key or deviceid");
        }
    });
});


app.get(config.path + '/opendoor', function (req, res) {
        var query = url.parse(req.url, true).query;
        var token = query.token;
        var deviceid = query.deviceid;
        var door = parseInt(query.door);

        serverSide.opendoor(deviceid, door, token).then(function (success) {
            logger.info("user opened door " + deviceid + " door: " + door);
            res.send(
                {
                    success: success
                }
            );
        }, function (success) {
            res.status(401).send(
                {
                    success: success
                }
            );
        });
    }
);


/**
 *    creates a new device
 *    @param user
 *    @param pwd
 *    @param doors  : amount of dooors
 */

app.get(config.path + '/createDevice', function (req, res) {
        var query = url.parse(req.url, true).query;
        var doors = parseInt(query.doors);
        var user = query.user;
        var pwd = query.pwd;
        if (doors < 1) {
            res.status(401).send('must be more doors than 0');
        }
        serverSide.loginAdmin(user, pwd, function (success) {
            if (success) {
                var device = serverSide.createDevice(doors);
                res.send(device);
            }
            else res.status(401).send('Wrong password or user');
        });
    }
);
/**
 * creates an admin account to create Devices
 * TODO REMOVE for production
 */
app.get(config.path + '/createAdmin', function (req, res) {
    var query = url.parse(req.url, true).query;
    var pwd = query.pwd;
    var user = query.user;
    serverSide.createAdmin(user, pwd, function (success) {
        if (success) res.send('created admin accoun');
    });
});
/**
 *    generates new devices, expected params:
 *    @param user
 *    @param pwd
 *    @param doors  : amount of dooors
 */

app.post(config.path + '/key', function (req, res) {
        var json = req.body;
        var props = ['deviceid', 'doors', 'expire', 'limit', 'name', 'token'];
        if (!checkJSON(props, json)) {
            res.status(500).send();
        }
        else {
            serverSide.generateKey(json).then(function (suc) {
                    res.json(suc);
                },
                function (err) {
                    res.status(500).send(err);
                });
        }
    }
);

function checkJSON(properties, json) {
    return properties.every(function (one) {
        return one in json
    })
}
//function i(p,o){return p.every(function(a){return a in o})}
//function h(p,o){c=1;p.map(function(a){c&=a in o});return c}
//function j(p,o){c=1;for(a of p)c&=a in o;return c}
//function c(k,j){return k.reduce(function(a,b){return a&b in j},1)}

//function c(k,j){return k.reduce(function(a,b){return a&j.hasOwnProperty(b)},true)}

exports.app = app;

