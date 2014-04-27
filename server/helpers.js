var serverSide = require('./serverSide.js');
var logger = require("./logger.js");
var crypto = require('crypto');
/**
 *
 * @param numDevices
 * @param withKeys is an object with field days, limit and amount
 * @return Array array of devices
 */
exports.createDevices = function (numDevices, withKeys, cb) {
    // TODO remove for production
    serverSide.devices.remove({},function(err,suc){});
    var doors = [1,2];

    var devices = [];
    for (var i = 0; i < numDevices; i++) {
        var device = serverSide.createDevice(doors.length);
        devices.push(device);
    }

    var count2 = numDevices;
    var evilCallback  = function() {
        count2--;
        if (count2 === 0) {
            cb(null, devices);
        }
    };

    devices.forEach(function(device) {
        if (withKeys) {
            var time = 1000 * 60 * 60 * 24 * withKeys.days;
            var now = new Date().getTime();

            var count = withKeys.amount;
            for (var j = 0; j < withKeys.amount; j++) {
                serverSide.generateKey(device.deviceid, doors, now + time, withKeys.limit, "For Philipp", device.pw, "id1", function(err,key) {
                    if(err)
                    {
                        logger.error(err);
                    }
                    if(key) {
                        logger.info(key);
                        device.keys = device.keys.concat(key);
                        count--;
                        if (count === 0) {
                            evilCallback();
                        }
                    }
                });
            }
        }

    });
}




exports.generateRandomString = function(length) {
    var randomBytes = crypto.randomBytes(256);
    var myHasher = crypto.createHash('sha1');
    myHasher.update(randomBytes);
    var randomString = myHasher.digest('hex').substring(0, length);
    return randomString;
}