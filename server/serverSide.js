/**
 * This file contains all functions and handles to device, key
 * login, opendoor
 */

var Promise = require('es6-promise').Promise;
var notifications = require('./notifications.js');
var mongo = require('mongodb').MongoClient;
var config = require('./config.js');
var logger = require('./logger.js');
var hat = require('hat').rack(config.deviceidLength, 16, 2);
var raspberry = require('./raspberrySide.js');
var bcrypt = require('bcrypt');
var deviceDAO = require('./DAO/device.js');
var keyDAO = require('./DAO/key.js');
var adminCollection, deviceCollection;
var helpers = require('./helpers.js');

exports.init = function (cb) {
    logger.info("init called");
    mongo.connect(config.mongoURL, function (err, db) {
        if (err) throw err;
        // collection
        adminCollection = db.collection('admin');
        deviceCollection = db.collection('device');
        deviceDAO.init(deviceCollection);
        keyDAO.init(deviceDAO);
        cb();
    });
};
exports.createDevice = deviceDAO.createDevice;
exports.getDevice = deviceDAO.getDevice;
exports.putDevice = deviceDAO.putDevice;
exports.generateKey = keyDAO.generateKey;
exports.putKey = keyDAO.changeKey;

/**
 * token keys
 * name
 * notificationid
 * @param deviceid
 * @param key
 * @returns {*}
 */
function generateToken(deviceid, key, notificationid) {
    //generate token and store it and update device id
    var token = helpers.generateRandomString(30);
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
                            var token = helpers.generateRandomString(30);
                            deviceCollection.update(
                                {
                                    deviceid: deviceid
                                },
                                {
                                    $push: {
                                        'mastertoken': { token: token , notificationid: notificationid}
                                    }
                                },
                                function (err, suc) {
                                    if (err) reject(err);
                                }
                            );
                            if (device.masterkey) {
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
                            deviceInfo = deviceDAO.buildDeviceInfo(device, {});
                            deviceInfo.token = token;
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
                            var test = keyObj && keyObj.expire > now && keyObj.limit >= 1;
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
                                deviceInfo = deviceDAO.buildDeviceInfo(device, keyObj);
                                deviceInfo.token = token;
                                deviceInfo.masterToken = false;
                                resolve(deviceInfo);
                            }
                            else reject();
                        }
                    });
                } else reject();
            });
    });
};


/**
 *    openDoor
 *    @param deviceid
 *    @param doorNumber must be number
 *    @param token the token used to open the door
 */
exports.opendoor = function (deviceid, doorNumber, token) {
    return new Promise(function (resolve, reject) {
        var now = new Date().getTime();
        var door = null;
        deviceDAO.getDeviceById(deviceid).then(function (device) {
            door = device.doors.filter(function (obj) {
                    return obj.number == doorNumber;
                }
            );
            // if token is found in master token or key tokens
            deviceDAO.checkToken(device, token).then(function(result)
            {
                if(result.hasOwnProperty('key'))
                {
                    if(result.expire > now && doorNumber in result.doors)
                    {
                        resolve(true);
                    }
                    else reject();
                }
                else resolve(true);
                // todo change for production
                raspberry.openDoor(deviceid, doorNumber, door[0].buzztime);
                resolve(true);
            },
                reject);
        }, reject);
    });
}

    exports.loginAdmin = function (user, pwd, cb) {
        adminCollection.findOne({user: user},
            function (err, success) {
                if (success) {
                    bcrypt.compare(pwd, success.pwd, function (err, suc) {
                        if (suc) cb(true);
                        else cb(false)
                    });
                }
                else        cb(false);
            });
    };

    exports.createAdmin = function (user, pwd, cb) {
        adminCollection.insert({user: user, pwd: bcrypt.hashSync(pwd, 8)},
            function (err, success) {
                if (err) cb(false);
                else cb(true);
            });
    };
