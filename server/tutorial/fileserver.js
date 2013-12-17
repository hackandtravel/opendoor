// http fileserver
fs = require('fs');
http = require('http');

var server = http.createServer(function(request, response)
{
	
	src =fs.createReadStream(process.argv[2])
	src.pipe(response);
});
server.listen(8000);
