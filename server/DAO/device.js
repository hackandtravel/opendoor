/**
 * Created by Philipp on 27.04.2014.
 */

var deviceCollection;
var helpers = require('../helpers.js');
var hat = require('hat').rack(16, 16, 2);
var bcrypt = require('bcrypt');
var Promise = require('es6-promise').Promise;
var logger = require('../logger.js');
var config = require('../config.js');

exports.getDeviceById = getDeviceById;
exports.createDevice = createDevice;
exports.getDevice = getDevice;
exports.putDevice = putDevice;
exports.buildDeviceInfo = buildDeviceInfo;
exports.hasMasterRights = hasMasterRights;
exports.addKey = addKey;
exports.updateKey = updateKey;
exports.getNotificationIDs = getNotificationIDs
exports.authenticateUser = authenticateUser;
exports.init = function (deviceCol) {
    deviceCollection = deviceCol;
    exports.deviceCollection = deviceCollection;
}
/**
 * create a new device so the server can recognize it will
 * return the device with masterkey and generated deviceid
 * @param doors number of doors
 */
function createDevice(doors) {
    var randompw = helpers.generateRandomString(6);
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
            logger.info("created Device, id: " + insert.deviceid);
        }
    });
    delete insert.masterkeyhash;
    // add after so it won't get stored in db
    insert.masterkey = randompw;

    return insert;
};

/**
 * getdevice
 * @param token
 * @param deviceid
 */
function getDevice(deviceid, auth) {
    return new Promise(function (resolve, reject) {
        getDeviceById(deviceid).then(function (device) {
                if (auth.role == helpers.AUTH_STATE.USER)
                    resolve(buildDeviceInfo(device, auth.meta));
                else
                    resolve(buildDeviceInfo(device, null));
            },
            reject);
    });
}

/**
 * put device
 * @param device
 */
function putDevice(device, deviceid) {
    return new Promise(function (resolve, reject) {
            updateDevice(deviceid, device).then(function (deviceupdated) {
                resolve(buildDeviceInfo(deviceupdated, null));
            });
    });
}

function updateDevice(deviceid, newDeviceInfo) {
    return new Promise(function (resolve, reject) {
        deviceCollection.findAndModify({ deviceid: deviceid}, {},
            {
                $set: {
                    doors: newDeviceInfo.doors,
                    name: newDeviceInfo.name
                }
            }, {}, function (err, suc) {
                if (err)reject(err);
                else if (suc && suc != 0) resolve(suc);
                else reject();
            });
    });
}

function updateKey(newDeviceInfo, deviceid) {
    return new Promise(function (resolve, reject) {
        var updateObj = {};
        for(var key in newDeviceInfo)
        {
            updateObj['keys.$.'+key] = newDeviceInfo[key];
        }

        deviceCollection.findAndModify({ deviceid: deviceid, 'keys.key': newDeviceInfo.key},
            {},
            {
                $set: updateObj
            },
            {new: true},
            function (err, suc) {
                if (err)reject(err);
                else if (suc) resolve(suc);
                else resolve();
            });
    });
}
function authenticateUser(deviceid, token) {
    return new Promise(function (resolve, reject) {
        getDeviceById(deviceid).then(function (device) {
            if (device === 0) {
                resolve(helpers.AUTH_STATE.NOTAUTH);
            }
            else {
                        var user = getUserKey(device, token);
                        var master = getMasterToken(device, token);
                        var auth = {};
                        if (user.length > 0)
                        {
                            auth.meta = user[0];
                            auth.role = helpers.AUTH_STATE.USER;
                        }
                        else if (master.length > 0)
                        {
                            auth.meta = master[0];
                            auth.role = helpers.AUTH_STATE.MASTER;
                        }
                        else
                        {
                            auth.role = helpers.AUTH_STATE.NOT_AUTH;
                        }
                        resolve(auth);
                    }
            }
            )
            ;

        });
    }
    function addKey(key, deviceid) {
        return new Promise(function (resolve, reject) {
            deviceCollection.update(
                {
                    deviceid: deviceid
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
    }

    function getDeviceById(deviceid) {
        return new Promise(function (resolve, reject) {
            deviceCollection.findOne({deviceid: deviceid}, function (err, suc) {
                if (err) reject(err);
                else if (suc && suc != 0) resolve(suc);
                else reject();
            });
        });
    };

    function getUserKey(device, token) {
        return device.keys.filter(function (key) {
            var foundKey = key.hasOwnProperty('token') && key.token.filter(function (tok) {
                return tok.token == token;
            });
            return foundKey.length > 0;

        });
    }

    function getMasterToken(device, token) {
        return device.mastertoken.filter(function (obj) {
            return obj.token == token;
        });
    }

    function hasMasterRights(deviceid, token) {
        return new Promise(function (resolve, reject) {
            getDeviceById(deviceid).then(function (device) {
                    if (getMasterToken(device, token).length > 0) {
                        resolve("true");
                    }
                    else reject(false);
                },
                reject);
        });
    }

    /**
     *    builds device info
     *    @param device object from db
     *    @param key key object from device from db
     *    @param token the one used
     */
    function buildDeviceInfo(device, key) {
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
        if (key) {
            delete key.token;
            deviceInfo.keys = key;
        }
        else {
            device.keys.map(function (value) {
                delete value.token;
            });
            deviceInfo.keys = device.keys;
        }

        return deviceInfo;
    }

    function getNotificationIDs(deviceid) {
        return new Promise(function (resolve, reject) {
            {
                getDeviceById(deviceid).then(function (device) {
                    var validNotificationids = device.mastertoken.filter(function (tokenObj) {
                        return tokenObj.notificationid != null;
                    });
                    validNotificationids.map(function (value) {
                        return value.notificationid;
                    });

                    resolve(validNotificationids)
                });
            }
        });
    }
