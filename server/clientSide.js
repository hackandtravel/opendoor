var url = require("url");



function serverThread(request, response) {
  headers = {
    'Content-Type': 'application/json',
    "Access-Control-Max-Age": "300",
    "Access-Control-Allow-Origin": request.headers['origin'],
    "Access-Control-Allow-Credentials": "true"
  };

  if(request.headers.hasOwnProperty("Access-Control-Request-Method")) {
    headers["Access-Control-Allow-Methods"] = request.headers['Access-Control-Request-Method'];
  }

  if(request.headers.hasOwnProperty("Access-Control-Request-Headers")) {
    headers["Access-Control-Allow-Headers"] = request.headers['Access-Control-Request-Headers'];
  }

  response.writeHead(200, headers);

	parsedURL = url.parse(request.url,true);
	
	if(parsedURL.pathname === path+"/login")
	{
		passphrase = parsedURL.query.passphrase;
		deviceid = parsedURL.query.deviceId;
		token = generateToken(passphrase,deviceid, { 
			error: function (){
				response.writeHead(401, headers);
				response.end("sorry bro");
			},
			success: function(token){
				response.end(JSON.stringify({"token": token}));
			}
		});
			
	}
	else if(parsedURL.pathname === path+"/opendoor")
	{
			token = parsedURL.query.token;
			// check if token exists
			success = tokenCollection.findOne({"token":token})!=null;
			
			if(success)
			{
				//  run open door command on raspberry pi	
				//open = spawn('plink', ['-i','pi.ppk','pi@192.168.1.130']);
				open = spawn('plink', ['-i','pi.ppk','pi@192.168.1.130','gpio','write','7','1']);
				open.stdout.on('data', function (data) {
				  console.log('stdout: ' + data);
				});
				open.on('close', function (code) {
				  console.log('child process exited with code ' + code);
				});
				
				// close door after 8 seconds
				setTimeout(function(){close = spawn('plink', ['-i','pi.ppk','pi@192.168.1.130','gpio','write','7','0']);
				close.on('close', function (code) {
				  console.log('Closed code:' + code);
				});},8000);
			}
			response.end(JSON.stringify({"success": success
					}));
	}
	else if(parsedURL.pathname === path+"/generate")
	{
		pw = parsedURL.query.pw;
		if(pw == masterPW)
		{
			generatePassphrase(response, headers);
		}
		else
		{
			response.writeHead(401, headers);
			response.end("sorry bro");
		}
	}
}
