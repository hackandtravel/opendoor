var mongo = require('mongodb');
var monk = require('monk');
var config = require('./config.js');
var crypto = require('crypto');
// connect to MongoDB
var db = monk(config.mongoURL);
var winston = require('winston');
if(db)
{
	winston.info('connected successfully to ' + config.mongoURL);
}
else
{
	winston.error('couldnt connect to db');
	throw new Error('couldnt connect to db')
}
// collection
var deviceCollection = db.get('device');
var deviceCollection = db.get('device');
function rnd(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}


function generateToken(deviceid, key)
{
		//generate token and store it and update device id
		hasher = crypto.createHash('sha1');
		hasher.update(crypto.randomBytes(256));
		token = hasher.digest('hex');
		deviceCollection.update({deviceid: deviceid, 'keys.key':key},
				{ 	$push: {'keys.$.token': token}	});
		return token;
}
// conditions matchin key, deviceid and limit and expire valid
exports.login = function (deviceid, key)
{
	var now = new Date().getTime();
	deviceCollection.findOne(
	{deviceid: deviceid, 'keys.key':key, 'keys.limit':{$gt:1},'keys.expire':{$gt:now}},
	function (err, device)
	{
		if(err) return null;
		if(device)
		{
			
			deviceCollection.update({deviceid: deviceid, 'keys.key':key},
			{ $inc: {'keys.$.limit': -1}} );
			
			var expire = 1, limit = 1;
			filteredKeys = device.keys.filter(function (obj){ return obj.key == key; });
			if(filteredKeys.length > 0)
			{
				expire = filteredKeys[0].expire;
				limit = filteredKeys[0].limit; 
			}
			token = generateToken(deviceid, key);
			
			return buildDeviceInfo(device, token, expire, limit);
		}
	});
};


function buildDeviceInfo(device, token, expire, limit)
{
	deviceInfo = {
		deviceid : device.deviceid,
		name : device.name,
		token : token,
		doors : device.doors,
		expire : expire,
		limit : limit
	};
	winston.info(deviceInfo);
	return deviceInfo;
}
// doors must be array
// expire in days for now TODO date
function generateKey (deviceid, doors, expire, limit) {
         // generation algorithm
        var randomBytes = crypto.randomBytes(256);
        var myHasher = crypto.createHash('sha1');
        myHasher.update(randomBytes);
        var randomKey = myHasher.digest('hex').substring(0,6);
        
		// add to database
		var key = {};
		key.expire = expire;
        key.doors = doors;
		key.limit = limit;
		key.key = randomKey;
		deviceCollection.update({deviceid: deviceid},
				{ 	$push: {keys: key}	});

}

exports.createDevice = function (deviceid, doors,numberKeys)
{
	winston.info(deviceid,doors, numberKeys);
	var insert = {};
	insert.deviceid = deviceid;
	insert.name = 'new Device';
	insert.doors = [];
	for(i=0; i<doors.length; i++)
	{
		var door = {};
		door.name= 'Neue Tür '+ doors[i];
		door.number = doors[i];
		insert.doors.push(door);
	}
	insert.keys=[];
	deviceCollection.insert(insert);
	winston.info(insert);
	var oneDay = 100*60*60*24;
	var now = new Date().getTime();
	for(i=0; i<numberKeys; i++)
	{
		generateKey(deviceid,doors,now+oneDay, 3);
	}
	
};

