// openDoor server

/* json api server
GET Methods:

-login { passphrase : servergenerated phassphrase
		 deviceid : deviceid from device}
		 return: token which can be used to open the door
		 
-opendoor { generated token in server handshake }
		return error or success message
		
-generate: this generates a new passphrase which can be handed out to users
		{ master password }
		return passphrase


*/
// require

var http = require("http");
var url = require("url");


const masterPW = "blechturmgasseopendoor";
const validtoken = "mygeneratedToken";
function getIO(server)
{
	var io = require('socket.io').listen(server);
	io.sockets.on('connection', function (socket) {
	  socket.emit('news', { hello: 'world' });
	  socket.on('my other event', function (data) {
		console.log(data);
	  });
	});
	return io;
}

exports.getIO = getIO

