var mongo = require("mongodb");
var monk = require("monk");

// connect to MongoDB
var db = monk('localhost:27017/opendoor');
// collections
const passphrases = db.get('passphrase');
const tokenCollection = db.get('token');
const path = "/opendoor";
var crypto = require('crypto');

function rnd(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}


function generateToken(key, deviceid, options)
{
	// check if key exists

	keys.findOne({key : key}, function (err, key)
	{
		// check if the key is used already
		console.log(key)
		if(key && key.deviceid == null)
		{
			//generate token and store it and update device id
			hasher = crypto.createHash('sha1');
			hasher.update(key+deviceid);
			token = hasher.digest('hex');
			keys.update({"_id":key._id},
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

function generatePassphrase(response) {



         // generation algorithm
        var randomBytes = crypto.randomBytes(256);
        myHasher = crypto.createHash('sha1');
        myHasher.update(randomBytes);
        randomPassphrase = myHasher.digest('hex');
        generatedPassphrase = randomPassphrase.substring(0,6);
        
    // add to database
        passphrases.insert({"phrase":generatedPassphrase});
        response.end(JSON.stringify({"passphrase": generatedPassphrase}));
}