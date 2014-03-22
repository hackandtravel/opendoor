var http = require('http');
var https = require('https');
var fs = require('fs');

// The 'secret' folder is not shared in git.
// Follow these instructions to create your own:
// http://nodejs.org/api/tls.html
var options;
try {
  options = {
    key: fs.readFileSync(__dirname + '/secret/ryans-key.pem'),
    cert: fs.readFileSync(__dirname + '/secret/ryans-cert.pem')
  };
} catch (ex) {
  throw new Error("SSL key missing. Create your own: http://nodejs.org/api/tls.html")
}

var app = https.createServer(options, function (req, res) {
  res.send(200);
}).listen(3001);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
