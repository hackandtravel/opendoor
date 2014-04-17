var gcm = require('node-gcm');
var sender = new gcm.Sender("AIzaSyCSVSa5mO1FYYgp3LD5UuK0W-7leSSxsWU");
var logger = require('./logger.js');
/**
 *
 * @param notificationIDs must be array
 */
exports.notifyIDs = function(notificationIDs, door, deviceID){

    var message = new gcm.Message();
    message.addDataWithObject(
        {
            door: door,
            deviceid: deviceID
        });
    sender.send(message, notificationIDs, 4, function(err, result)
    {
        if(err) logger.error("couldn't  send notifications");
    })
}