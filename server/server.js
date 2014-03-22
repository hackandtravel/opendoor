// var spawn = require('child_process').spawn;

/*
 var init = spawn('plink', ['-i', 'pi.ppk', 'pi@192.168.1.130', 'gpio', 'mode', '7', 'out']);
 init.stdout.on('data', function (data) {
 console.log('stdout: ' + data);
 });
 */

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

var app = https.createServer(options,function (req, res) {
  res.writeHead(200);
  res.end("hello world!!!11\n");
}).listen(3000);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
