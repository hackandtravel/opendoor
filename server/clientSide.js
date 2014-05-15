var url = require("url");
var express = require('express');
var config = require('./config.js');
var serverSide = require('./serverSide.js');
var helpers = require('./helpers');
var logger = require('./logger.js');
/** json api server
 look for docu at
 http://docs.opendoor.apiary.io/

 */

// begin
var app;
app = express();
app.use(express.json());
app.use(authenticate);
var addCORSHeaders = function (req, res) {
    res.setHeader("Access-Control-Max-Age", "300")
    res.setHeader("Access-Control-Allow-Origin", req.headers['origin'])
    res.setHeader("Access-Control-Allow-Credentials", "true");

    var reqmethod = req.header('access-control-request-method');
    if (reqmethod != null) {
        res.setHeader("Access-Control-Allow-Methods", reqmethod);
    }

    var reqheaders = req.header("access-control-request-headers");
    if (reqheaders != null) {
        res.setHeader("Access-Control-Allow-Headers", reqheaders);
    }
};
function authenticate(req, res, next) {
    if (endsWith(req.path, 'api') || endsWith(req.path, 'login') ||
        endsWith(req.path, 'createDevice') || endsWith(req.path, 'createAdmin')) {
        next();
    }
    else {
        if (!checkAuthentificationHeaders(req.query)) {
            res.status(401).send('Params missing');
        }
        else {
            serverSide.authenticateUser(req.query.deviceid, req.query.token).then(
                function (auth) {
                    if (auth.role === helpers.AUTH_STATE.NOT_AUTH) {
                        res.send(401);
                    }
                    else {
                        req.app.locals.auth = auth;
                        next();

                    }
                }, function () {
                    res.status(500).send('error with db');
                }
            )

        }
    }
}
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
    var query = req.query;
    serverSide.getDevice(query.deviceid, req.app.locals.auth).then(
        function (device) {
            res.send(device);
        },
        function (error) {
            res.send(401);
        });
});


app.put(config.path + '/device', function (req, res) {
    var query = req.query;
    if (req.app.locals.auth.role != helpers.AUTH_STATE.MASTER) {
        res.send(401);
    }
    else {
        serverSide.putDevice(req.body, query.deviceid).then(
            function (device) {
                res.json(device);
            },
            function (error) {
                res.send(401);
            });
    }
});

app.get(config.path + '/login', function (req, res) {
    var key = req.query.key;
    var deviceid = req.query.deviceid;
    var notificationid = req.query.notificationid;
    serverSide.login(deviceid, key, notificationid).then(function (deviceInfo) {
            logger.info("user login: successful");
            res.send(deviceInfo);
        },
        function (error) {
            res.status(401).send();
            logger.info("user login: bad key or deviceid");
        });

});


app.get(config.path + '/opendoor', function (req, res) {
        var token = req.query.token;
        var deviceid = req.query.deviceid;
        var door = parseInt(req.query.door);

        serverSide.opendoor(deviceid, door, req.app.locals.auth).then(function (success) {
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
        var query = req.query;
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


app.post(config.path + '/key', function (req, res) {
        var query = req.body;
        var props = [ 'doors', 'expire', 'limit', 'name'];
        if (!checkJSON(props, query)) {
            res.status(404).send("wrong parameters");
        }
        else {
            if (req.app.locals.auth.role != helpers.AUTH_STATE.MASTER) {
                res.send(401);
            }
            else {
                serverSide.generateKey(query, req.query.deviceid).then(function (suc) {
                        res.json(suc);
                    },
                    function (err) {
                        res.status(401).send(err);
                    });
            }
        }
    }
);

app.put(config.path + '/key', function (req, res) {
        var query = req.body;
        var props = [ 'doors', 'expire', 'limit', 'name'];
        if (!checkJSON(props, query)) {
            res.status(500).send();
        }
        else {
            if (req.app.locals.auth.role != helpers.AUTH_STATE.MASTER) {
                res.send(401);
            }
            else {
                serverSide.putKey(query, req.query.deviceid, req.query.token).then(function (suc) {
                        res.json(suc);
                    },
                    function (err) {
                        res.status(401).send(err);
                    });
            }
        }
    }
);


app.delete(config.path + '/key', function (req, res) {
        var query = req.body;
        var props = [ 'key'];
        if (!checkJSON(props, query)) {
            res.status(404).send("wrong parameters");
        }
        else {
            if (req.app.locals.auth.role != helpers.AUTH_STATE.MASTER) {
                res.send(401);
            }
            else {
                serverSide.deleteKey(req.body, req.query.deviceid).then(function (suc) {
                        res.send(200);
                    },
                    function (err) {
                        res.status(401).send(err);
                    });
            }
        }
    }
);

function checkAuthentificationHeaders(query) {
    var props = ['deviceid', 'token'];
    return checkJSON(props, query);
}
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

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}