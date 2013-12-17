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
var crypto = require('crypto');
var fs = require("fs");
var http = require("http");
var url = require("url");
var mongo = require("mongodb");
var monk = require("monk");
var spawn = require('child_process').spawn;

// connect to MongoDB
var db = monk('localhost:27017/opendoor');

// constants
var path = "/opendoor";
const masterPW = "superpasswort";
const validtoken = "mygeneratedToken"
const validpassphrase ="123456";

// collections
const passphrases = db.get('passphrase');
const tokenCollection = db.get('token');

// TODO make https 
// create key and sign certificate
var server = http.createServer(serverThread);
server.listen(8000);





function generateToken(passphrase, deviceid, options)
{
	// check if passphrase exists

	passphrases.findOne({phrase : passphrase}, function (err, phrase)
	{
		// check if the passphrase is used already
		console.log(phrase)
		if(phrase && phrase.deviceid == null)
		{
			//generate token and store it and update device id
			hasher = crypto.createHash('sha1');
			hasher.update(passphrase+deviceid);
			token = hasher.digest('hex');
			passphrases.update({"_id":phrase._id},
			{
				$set: {"deviceid":deviceid}
			});
			tokenCollection.insert({"token":token});
			options.success(token)
		}
		else
		{
		// does not exist or already used
			options.error()
		}
	});	
}


function generatePassphrase()
{

	// generation algorithm
	var randomBytes = crypto.randomBytes(256);
	myHasher = crypto.createHash('sha1');
	myHasher.update(randomBytes);
	randomPassphrase = myHasher.digest('hex');
	generatedPassphrase = randomPassphrase;
	
	// add to database
	passphrases.insert({"phrase":generatedPassphrase});
	
	success = true;
	if(success) return generatedPassphrase;
	else return ""
}

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
				// TODO run command on raspberry pi	
				open = spawn('ping', ['127.0.0.1 > C:\t.txt']);
				
				open.stdin.end();
			}
			response.end(JSON.stringify({"success": success
					}));
	}
	else if(parsedURL.pathname === path+"/generate")
	{
		pw = parsedURL.query.pw;
		if(pw == masterPW)
		{
			generatedPassphrase = generatePassphrase();
			response.end(JSON.stringify({"token": generatedPassphrase
					}));
		}
		else
		{
			response.writeHead(401, headers);
			response.end("sorry bro");
		}
	}
}


