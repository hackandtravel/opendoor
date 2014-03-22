// hack to accept self signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app = { location: 'http://localhost:3001' };

var io = require('socket.io-client');

var socket = io.connect(app.location, { secure: true});
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'my data' });
});

// var spawn = require('child_process').spawn;

/*
 var init = spawn('plink', ['-i', 'pi.ppk', 'pi@192.168.1.130', 'gpio', 'mode', '7', 'out']);
 init.stdout.on('data', function (data) {
 console.log('stdout: ' + data);
 });
 */
