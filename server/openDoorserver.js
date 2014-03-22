// var spawn = require('child_process').spawn;

/*
var init = spawn('plink', ['-i', 'pi.ppk', 'pi@192.168.1.130', 'gpio', 'mode', '7', 'out']);
init.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});
*/

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');

app.listen(80);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200);
        res.end(data);
      }
    });
}

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
