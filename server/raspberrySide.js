function getIO(server) {
  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function (socket) {
    setTimeout(function () {
      socket.emit('openDoor', { doorNumber: 1 });
    }, 5000);

    socket.on('status', function (data) {
      console.log(data);
    });
  });

  return io;
}

exports.getIO = getIO

