//http chainer
var bl = require('bl');
var http = require('http');


bla = http.get(process.argv[2],function(stream){
	stream.pipe(bl(function(err,data) {
		var nol = data.length;
		
		console.log(nol +"\n"+data);
	}));
	
});
