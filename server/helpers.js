var serverSide = require('./serverSide.js');
var logger = require("winston");
/**
 *
 * @param numDevices
 * @param withKeys is an object with field days, limit and amount
 * @return Array array of devices
 */
exports.createDevices = function (numDevices, withKeys) {
    // TODO remove for production
    serverSide.devices.remove({},function(err,suc){});
    var doors = [1];
    var devices = [];
    for (var i = 0; i < numDevices; i++) {
        var device = serverSide.createDevice(doors);
        if (withKeys) {
            var time = 1000 * 60 * 60 * 24 * withKeys.days;
            var now = new Date().getTime();
            for (var j = 0; j < withKeys.amount; j++) {
                var key = serverSide.generateKey(device.deviceid, doors, now + time, withKeys.limit);
                logger.info(key);
                device.keys = device.keys.concat(key);

            }
        }
        devices = devices.concat(device);
    }
    return devices;
}
