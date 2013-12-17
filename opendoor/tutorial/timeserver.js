// timeserver
// port 8000
// YYYY-MM-DD hh:mm \n

net = require("net");


server = net.createServer(function(socket){
date = new Date();
	socket.end(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+0+date.getDate()
	+ " " + date.getHours() + ":"+date.getMinutes()+"\n");
});

server.listen(8000);
