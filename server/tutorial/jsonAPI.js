// json api server
// return json when you get a path
// api/parsetime
// api/unixtime

var http = require("http");
var map = require('through2-map')
var url = require("url");
var server = http.createServer(function(request, response)
{
	response.writeHead(200, {'Content-Type': 'application/json'});
	console.log(request.url);
	myurl = request.url;
	paths = url.parse(myurl,true);
	
	if(paths.pathname === "/api/parsetime")
	{
		console.log(paths.query.iso);
		date = new Date(paths.query.iso);
		response.end(JSON.stringify({"hour": date.getHours(),
					"minute": date.getMinutes(),
					"second": date.getSeconds()
					}));
	}
	else if(paths.pathname === "/api/unixtime")
	{
		date = new Date(paths.query.iso);
		response.end(JSON.stringify({"unixtime": date.getTime()
					}));
	}
});
server.listen(8000);
