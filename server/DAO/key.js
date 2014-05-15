/**
 * Created by Philipp on 27.04.2014.
 */

var Promise = require('es6-promise').Promise;
var config = require('../config.js');
var helpers = require('../helpers.js');
var logger = require('../logger.js');
var deviceDAO;

exports.init = function(deviceDA)
{
    deviceDAO = deviceDA;
}

exports.changeKey = changeKey;

    /**
     *
     * @param keyinfo
     * @param  cb
     */
exports.generateKey = function (keyInfo,deviceid) {
                    var randomKey = helpers.generateRandomString(config.keyLength);
                    // add to database
                    var key = {};
                    key.expire = keyInfo.expire;
                    key.doors = keyInfo.doors;
                    key.limit = keyInfo.limit;
                    key.name = keyInfo.name;
                    key.valid = true;
                    key.key = randomKey;
                    return deviceDAO.addKey(key,deviceid);
    };

function changeKey(keyInfo,deviceid) {
                    return(deviceDAO.updateKey(keyInfo, deviceid));
    };

exports.deleteKey = function (keyInfo, deviceid)
{
    keyInfo.valid = false;
    return changeKey(keyInfo, deviceid);
}

