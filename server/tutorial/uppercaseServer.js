// uppercasjsserver
var http = require("http");
var map = require('through2-map')

var server = http.createServer(function(request, response)
{
	console.log(request);
	request.pipe(map(function(chunk) { 
	return chunk.toString().toUpperCase()})).pipe(response);
});
server.listen(8000);
