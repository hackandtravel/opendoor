// javascript

var bl = require('bl');
var http = require('http');

var count = 0;
var array = [];
for(var i=0; i <3; i++)
{
	(function(i){
request = http.get(process.argv[i+2],function(stream){
	stream.pipe(bl(function(err,data) {

		count ++;
		array[i] = data.toString();
		if(count == 3)
		{
			for(j=0;j<3;j++)
			{
				console.log(array[j]);
				}
		}

	}));
	
});
	})(i);
}