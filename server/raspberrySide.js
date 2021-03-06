var sockets = {};
var logger = require("./logger.js");
var Promise = require('es6-promise').Promise;

function getIO(server) {
    var io = require('socket.io').listen(server);
    io.set('log level', 2);
    io.sockets.on('connection', function (socket) {
        socket.on('whoami', function (data) {
            var deviceid = data.deviceid;
            logger.info("device connected with id: ", deviceid);
            socket.set('deviceid', deviceid);
            sockets[deviceid] = socket;
        });

        socket.on('status', function (data) {
            if(socket)
            {
            //var cb = socket.get("openDoorCallBack");
            //cb(null, data);
            // todo make callback somehow to client
        }
        if(data && data.status == "opened")
        {

            //cb(null, data);
        }
        // else //cb(new Error("something went wront opening the door"));

        });

        socket.on('disconnect', function() {
            logger.info("device disconnected");

            //delete sockets[socket.get('deviceid')];
        });
    });

    return io;
}

function openDoor(deviceid, door, buzzTime)
{
    return new Promise(function(resolve, reject)
    {
        if(sockets[deviceid]) {
            sockets[deviceid].emit('openDoor', {doorNumber: door, buzzTime: buzzTime});
            resolve("open door command sent");
        }
        else reject(new Error("No device with this ID connected"));
    });
}
exports.openDoor = openDoor;
exports.getIO = getIO;
