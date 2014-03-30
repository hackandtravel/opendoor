var sockets = {};
var logger = require("winston");
function getIO(server) {
    var io = require('socket.io').listen(server);

    io.sockets.on('connection', function (socket) {
        socket.on('whoami', function (data) {
            var deviceid = data.deviceid;
            logger.info("device connect with id: ", deviceid);
            socket.set('deviceid', deviceid);
            sockets[deviceid] = socket;
        });

        socket.on('status', function (data) {
            if(sockets[deviceid])
            {
                var cb = sockets[deviceid].get("openDoorCallBack");
                cb(null, data);
            }
            if(data && data.status == "opened")
            {

                cb(null, data);
            }
            else cb(new Error("something went wront opening the door"));

        });

        socket.on('disconnect', function() {
            logger.info("device disconnected");

            //delete sockets[socket.get('deviceid')];
        });
    });

    return io;
}

function openDoor(deviceid, door, buzzTime, cb)
{
    if(sockets[deviceid]) {
        sockets[deviceid].set("openDoorCallBack", cb);
        sockets[deviceid].emit('openDoor', {doorNumber: door, buzzTime: buzzTime});
    }
    else cb(new Error("No device with this ID connected"))
}
exports.openDoor = openDoor;
exports.getIO = getIO;
