/**
 * Created by Philipp on 27.04.2014.
 */

var Promise = require('es6-promise').Promise;
var config = require('../config.js');
var helpers = require('../helpers.js');
var deviceDAO;

exports.init = function(deviceDA)
{
    deviceDAO = deviceDA;
}

    /**
     *
     * @param keyinfo
     * @param  cb
     */
exports.generateKey = function (keyInfo,deviceid, token) {
        return new Promise(function (resolve, reject) {
            deviceDAO.hasMasterRights(deviceid, token).then(
                function (bool) {
                    var randomKey = helpers.generateRandomString(config.keyLength);
                    // add to database
                    var key = {};
                    key.expire = keyInfo.expire;
                    key.doors = keyInfo.doors;
                    key.limit = keyInfo.limit;
                    key.name = keyInfo.name;
                    key.key = randomKey;
                    resolve(deviceDAO.addKey(key,deviceid));
                }, reject);

        });
    };

exports.changeKeye = function (keyInfo,deviceid, token) {
        return new Promise(function (resolve, reject) {
            deviceDAO.hasMasterRights(deviceid, token).then(
                function (bool) {
                    resolve(deviceDAO.addKey(key,keyInfo.deviceid));
                }, reject);

        });
    };
