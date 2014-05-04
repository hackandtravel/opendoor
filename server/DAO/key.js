/**
 * Created by Philipp on 27.04.2014.
 */

var Promise = require('es6-promise').Promise;
var config = require('../config.js');
var helpers = require('../helpers.js');
var logger = require('../logger.js');
var deviceDAO;

exports.init = function (deviceDA) {
    deviceDAO = deviceDA;
}

/**
 *
 * @param keyinfo
 * @param  cb
 */
exports.generateKey = function (keyInfo) {
    return new Promise(function (resolve, reject) {
        deviceDAO.hasMasterRights(keyInfo.deviceid, keyInfo.token).then(
            function (bool) {
                var randomKey = helpers.generateRandomString(config.keyLength);
                // add to database
                var key = {};
                key.expire = keyInfo.expire;
                key.doors = keyInfo.doors;
                key.limit = keyInfo.limit;
                key.name = keyInfo.name;
                key.key = randomKey;
                resolve(addKey(key, keyInfo.deviceid));
            }, reject);

    });
};


function addKey(key, deviceid) {
    return new Promise(function (resolve, reject) {
        deviceDAO.deviceCollection.update(
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
exports.changeKey = function (key, deviceid, token) {
    return new Promise(function (resolve, reject) {
        deviceDAO.hasMasterRights(deviceid, token).then(
            function (bool) {
                // add to database
                resolve(updateKey(key, deviceid));
            }, reject);

    });
};
function updateKey(keyInfo, deviceid) {
    return new Promise(function (resolve, reject) {
        deviceDAO.deviceCollection.findAndModify(
            { deviceid: deviceid,
                'keys.key': keyInfo.key}, [],
            {
                $set: {
                    'keys.$.name': keyInfo.name,
                    'keys.$.expire': keyInfo.expire,
                    'keys.$.doors': keyInfo.doors,
                    'keys.$.limit': keyInfo.limit
                }},{}
            , function (err, suc) {
                if (err)reject(err);
                else if (suc) {
                   logger.info(suc)
                    resolve(suc);
                }
                else reject();
            })
    });

}