// http
http = require("http");
http.get(process.argv[2], function(stream){
	// stream
	stream.setEncoding("utf8");
	stream.on("data", function(data){console.log(data)});

});