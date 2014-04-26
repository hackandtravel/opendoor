/**
 * opendoor
 * login
 * generateKey
 * createDevice
 */

var Promise = require('es6-promise').Promise;
var notifications = require('./notifications.js');
var mongo = require('mongodb').MongoClient;
var config = require('./config.js');
var crypto = require('crypto');
var passwordHash = require('password-hash');
var logger = require('./logger.js');
var hat = require('hat').rack(32, 16, 2);
var raspberry = require('./raspberrySide.js');
var bcrypt = require('bcrypt');

var deviceCollection, adminCollection;
exports.init = function (cb) {
    logger.info("init called");
    mongo.connect(config.mongoURL, function (err, db) {
        if (err) throw err;
        // collection
        adminCollection = db.collection('admin');
        deviceCollection = db.collection('device');
        exports.devices = deviceCollection;
        cb();
    });
}
/**
 * token keys
 * name
 * notificationid
 * @param deviceid
 * @param key
 * @returns {*}
 */
function generateToken(deviceid, key, notificationid) {
    // TODO check if doesnt exist think about generation
    //generate token and store it and update device id
    var hasher = crypto.createHash('sha1');
    hasher.update(crypto.randomBytes(256));
    var token = hasher.digest('hex');
    deviceCollection.update(
        {
            deviceid: deviceid,
            'keys.key': key
        },
        {
            $push: {
                'keys.$.token': { token: token, notificationid: notificationid}
            }
        },
        function (err, suc) {
        }
    );
    return token;
}

/**
 *    login
 *    @param key must be valid (not expired and limit not used) can be masterkey
 */
exports.login = function (deviceid, key, notificationid) {
    return new Promise(function (resolve, reject) {
        var now = new Date().getTime();
        deviceCollection.findOne(
            {
                deviceid: deviceid
            },
            function (err, device) {
                var deviceInfo = null;
                if (err) {
                    logger.info(err);
                    reject(err);
                }
                if (device) {
                    bcrypt.compare(key, device.masterkeyhash, function (err, suc) {
                        if (suc) {
                            // this is a masterkey
                            var hasher = crypto.createHash('sha1');
                            hasher.update(crypto.randomBytes(256));
                            var token = hasher.digest('hex');
                            deviceCollection.update(
                                {
                                    deviceid: deviceid
                                },
                                {
                                    $push: {
                                        'mastertoken': { token: token}
                                    }
                                },
                                function (err, suc) {
                                    if (err) reject(err);
                                }
                            );
                            if (device.masterkey) {
                                // remove cleartext master key
                                deviceCollection.update(
                                    {
                                        deviceid: deviceid
                                    },
                                    {
                                        $unset: { 'masterkey': 1}
                                    },
                                    function (err, suc) {
                                        if (err) logger.error(err);
                                    }
                                );
                            }
                            deviceInfo = buildDeviceInfo(device, {}, token);
                            deviceInfo.masterToken = true;
                            resolve(deviceInfo);
                        }
                        else {
                            var filteredKeys = device.keys.filter(function (obj) {
                                    return obj.key == key;
                                }
                            );
                            var keyObj = null;
                            if (filteredKeys.length > 0) {
                                // key found in user keys
                                keyObj = filteredKeys[0];
                            }

                            if (keyObj && keyObj.expire > now && keyObj.limit >= 1) {
                                deviceCollection.update(
                                    {
                                        deviceid: deviceid,
                                        'keys.key': key
                                    },
                                    {
                                        $inc: {
                                            'keys.$.limit': -1
                                        }
                                    },
                                    function (err, suc) {
                                    }
                                );

                                var token = generateToken(deviceid, key, notificationid);
                                deviceInfo = buildDeviceInfo(device, keyObj, token);
                                deviceInfo.masterToken = false;
                                resolve(deviceInfo);
                            }
                        }
                    });
                }
            });
    });
};
function getDeviceById(deviceid) {
    return new Promise(function (resolve, reject) {
        deviceCollection.findOne({deviceid: deviceid}, function (err, suc) {
            if (err) reject(err);
            if (suc) resolve(suc);
            reject();
        });
    });
}
/**
 * getdevice
 * @param token
 * @param deviceid
 */
exports.getDevice = function (deviceid, token) {
    return new Promise(function (resolve, reject) {
        getDeviceById(deviceid).then(function (device) {
            var user = containsToken(device, token);
            var key = 1;
            if (containsMasterToken(device, token)) {
                resolve(buildDeviceInfo(device, null, null, true));
            }
            else if (user.length > 0) {
                resolve(buildDeviceInfo(device,key));
            }
            reject("no device for you");
        })
    });
}
/**
 *    openDoor
 *    @param deviceid
 *    @param doorNumber must be number
 *    @param token the token used to open the door
 */
exports.opendoor = function (deviceid, doorNumber, token) {
    return new Promise(function (resolve, reject) {
        var now = new Date().getTime();
        deviceCollection.findOne(
            {
                deviceid: deviceid
            }, function (err, device) {
                if (device) {
                    var door = device.doors.filter(function (obj) {
                            return obj.number == doorNumber;
                        }
                    );
                    // if token is found in master token or key tokens
                    var master = containsMasterToken(device, token);
                    var user = containsToken(device, token);
                    if (master || (user.length > 0 && user[0].expire > now && door in user[0].doors)) {
                        // todo change for production
                        raspberry.openDoor(deviceid, doorNumber, door.buzztime);
                        resolve(true);
                    }
                    else {

                    }
                }
                else reject(false);
            });
    });
}

/**
 *    builds device info
 *    @param device object from db
 *    @param key key object from device from db
 *    @param token the one used
 */
function buildDeviceInfo(device, key, token, master) {
    var doors = device.doors;
    if (key && key.doors) {
        doors = device.doors.filter(function (obj) {
                // > -1 found object
                return key.doors.indexOf(obj.number) > -1;
            }
        );
    }

    var deviceInfo =
    {
        deviceid: device.deviceid,
        name: device.name,
        doors: doors
    };
    if(master)
    {
        deviceInfo.keys = device.keys;
    }
    if(key)
    {
        deviceInfo.expire=  key.expire;
        deviceInfo.limit =  key.limit;
    }
    if (token)
        deviceInfo.token = token;
    return deviceInfo;
}

/**
 *
 * @param keyinfo
 * @param  cb
 */
exports.generateKey = function (keyInfo) {
    return new Promise(function (resolve, reject) {
        checkMasterToken(keyInfo.deviceid, keyInfo.token).then(
            function () {
                var randomKey = generateRandomString(config.keyLength);
                // add to database
                var key = {};
                key.expire = keyInfo.expire;
                key.doors = keyInfo.doors;
                key.limit = keyInfo.limit;
                key.name = keyInfo.name;
                key.key = randomKey;
                deviceCollection.update(
                    {
                        deviceid: keyInfo.deviceid
                    },
                    {
                        $push: {
                            keys: key
                        }
                    },
                    function (err, suc) {
                        if (err) {
                            logger.info(err);
                            reject(new Error("mongo error"));
                        }
                        if (suc) {
                            logger.info("successfully added key");
                            resolve(key);
                        }
                        else reject(new Error("update failed"));
                    }
                );
            });
    });
};
function containsToken(device, token) {
    return device.keys.filter(function (key) {
        return key.hasOwnProperty('token') && key.token.filter(function (tok) {
            return tok.token == token;
        })
    });
}

function containsMasterToken(device, token) {
    return device.mastertoken.filter(function (obj) {
        return obj.token == token;
    }).length > 0;
}

function checkMasterToken(deviceid, token) {
    return new Promise(function (resolve, reject) {
        deviceCollection.findOne({deviceid: deviceid},
            function (err, device) {
                if (device) {
                    if (containsMasterToken(device, token))  resolve(true);
                    else reject(false);
                }
                reject(false);
            })
    })
}

function generateRandomString(length) {
    var randomBytes = crypto.randomBytes(256);
    var myHasher = crypto.createHash('sha1');
    myHasher.update(randomBytes);
    var randomString = myHasher.digest('hex').substring(0, length);
    return randomString;
}

/**
 * create a new device so the server can recognize it will
 * return the device with masterkey and generated deviceid
 * @param doors number of doors
 */
exports.createDevice = function (doors) {
    var randompw = generateRandomString(20);
    var insert = {};
    insert.deviceid = hat(); // hat generates random hash which dont collide
    insert.name = 'new Device';
    insert.masterkeyhash = bcrypt.hashSync(randompw, 8);
    insert.doors = [];
    for (var i = 1; i <= doors; i++) {
        var door = {};
        door.name = 'Neue Tür ' + i;
        door.number = i;
        door.buzztime = config.defaultBuzzTime;
        insert.doors.push(door);
    }
    insert.keys = [];
    deviceCollection.insert(insert, function (err, success) {
        if (success) {
            logger.info("created Device")
        }
    });
    delete insert.masterkeyhash;
    // add after so it won't get stored in db
    insert.masterkey = randompw;

    return insert;
};

exports.loginAdmin = function (user, pwd, cb) {
    adminCollection.findOne({user: user},
        function (err, success) {
            if (success) {
                if (passwordHash.verify(pwd, success.pwd))
                    cb(true);
                else    cb(false);
            }
            else        cb(false);
        });
};

exports.createAdmin = function (user, pwd, cb) {
    adminCollection.insert({user: user, pwd: passwordHash.generate(pwd) },
        function (err, success) {
            if (err) cb(false);
            else cb(true);
        });
};