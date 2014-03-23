/**
 * opendoor
 * login
 * generateKey
 * createDevice
 */

var mongo = require('mongodb');
var monk = require('monk');
var config = require('./config.js');
var crypto = require('crypto');
// connect to MongoDB
var db = monk(config.mongoURL);
var logger = require('winston');
if (db)
{
	logger.info('connected successfully to ' + config.mongoURL);
}
else
{
	logger.error('couldnt connect to db');
	throw new Error('couldnt connect to db')
}
// collection
var deviceCollection = db.get('device');
function rnd(min, max)
{
	return parseInt(Math.random() * (max - min) + min);
}

function generateToken(deviceid, key)
{
	// TODO check if doesnt exist
	//generate token and store it and update device id
	hasher = crypto.createHash('sha1');
	hasher.update(crypto.randomBytes(256));
	token = hasher.digest('hex');
	deviceCollection.update(
	{
		deviceid : deviceid,
		'keys.key' : key
	},
	{
		$push :
		{
			'keys.$.token' : token
		}
	}
	);
	return token;
}
// conditions matching key, deviceid and limit and expire valid
exports.login = function (deviceid, key, cb)
{
	var deviceInfo;
	var now = new Date().getTime();
	deviceCollection.findOne(
	{
		deviceid : deviceid,
		'keys.key' : key
	},
		function (err, device)
	{
		var deviceInfo = null;
		if (err)
		{
			logger.info(err);
			cb(null);
		}
		if (device)
		{
			filteredKeys = device.keys.filter(function (obj)
				{
					return obj.key == key;
				}
				);
			var keyObj = null;
			if (filteredKeys.length > 0)
			{
				keyObj = filteredKeys[0];
			}
			
			logger.info(keyObj.expire, now, keyObj.limit)
			if (keyObj && keyObj.expire > now && keyObj.limit >= 1)
			{
			logger.info(keyObj);
			deviceCollection.update(
				{
					deviceid : deviceid,
					'keys.key' : key
				},
				{
					$inc :
					{
						'keys.$.limit' : -1
					}
				}
				);

				token = generateToken(deviceid, key);
				deviceInfo = buildDeviceInfo(device, keyObj, token);
			}
		}
		cb(deviceInfo);
	}
	);
};

exports.opendoor = function (deviceid, doorNumber, token, cb)
{
	var now = new Date().getTime();
	deviceCollection.findOne(
	{
		deviceid : deviceid,
		'doors.number' : doorNumber,
		'keys.token' : token,
		'keys.expire' :
		{
			$gt : now
		}
	},
		function (err, device)
	{
		if (err)
			cb(false);
		if (device)
			cb(true);
		else
			cb(false);
	}
	);
}
// only hand back door we have access too
function buildDeviceInfo(device, key, token)
{
	doors = device.doors.filter(function (obj)
		{
			logger.info(obj);
			return key.doors.indexOf(obj.number) > -1;
		}
		);

	deviceInfo =
	{
		deviceid : device.deviceid,
		name : device.name,
		token : token,
		doors : doors,
		expire : key.expire,
		limit : key.limit
	};

	return deviceInfo;
}
// doors must be array
// expire in days for now TODO date
function generateKey(deviceid, doors, expire, limit)
{
	// generation algorithm
	var randomBytes = crypto.randomBytes(256);
	var myHasher = crypto.createHash('sha1');
	myHasher.update(randomBytes);
	var randomKey = myHasher.digest('hex').substring(0, 6);

	// add to database
	var key = {};
	key.expire = expire;
	key.doors = doors;
	key.limit = limit;
	key.key = randomKey;
	deviceCollection.update(
	{
		deviceid : deviceid
	},
	{
		$push :
		{
			keys : key
		}
	}
	);

}

exports.createDevice = function (deviceid, doors, numberKeys)
{
	logger.info(deviceid, doors, numberKeys);
	var insert = {};
	insert.deviceid = deviceid;
	insert.name = 'new Device';
	insert.doors = [];
	for (i = 0; i < doors.length; i++)
	{
		var door = {};
		door.name = 'Neue Tür ' + doors[i];
		door.number = doors[i];
		door.buzztime = config.defaultBuzzTime;
		insert.doors.push(door);
	}
	insert.keys = [];
	deviceCollection.insert(insert);
	logger.info(insert);
	var oneDay = 100 * 60 * 60 * 24;
	var now = new Date().getTime();
	for (i = 0; i < numberKeys; i++)
	{
		generateKey(deviceid, doors, now + oneDay, 3);
	}

};
