/**
 * opendoor
 * login
 * generateKey
 * createDevice
 */

var mongo = require('mongodb').MongoClient;
var config = require('./config.js');
var crypto = require('crypto');
var logger = require('winston');
var passwordHash = require('password-hash');
var hat = require('hat').rack(32, 16, 2);

var deviceCollection, adminCollection;
exports.init = function(cb)
{
	logger.info("init called");
	mongo.connect(config.mongoURL, function(err, db) {
		if(err) throw err;
		// collection
		adminCollection = db.collection('admin');
		deviceCollection = db.collection('device');
		exports.devices = deviceCollection;
		cb();
	});
}

function generateToken(deviceid, key) {
    // TODO check if doesnt exist
    //generate token and store it and update device id
    var hasher = crypto.createHash('sha1');
    hasher.update(crypto.randomBytes(256));
    var token = hasher.digest('hex');
    deviceCollection.update(
        {
            deviceid: deviceid,
            'keys.key': key
        },
        {
            $push: {
                'keys.$.token': token
            }
        }
    );
    return token;
}

/**
 *    login
 *    @param deviceid must be number
 *    @param key must be valid (not expired and limit not used)
 *    @param cb callback function which gets called with result (device obj)
 */
exports.login = function (deviceid, key, cb) {
    var now = new Date().getTime();
    deviceCollection.findOne(
        {
            deviceid: deviceid,
            'keys.key': key
        },
        function (err, device) {
            var deviceInfo = null;
            if (err) {
                logger.info(err);
                cb(null);
            }
            if (device) {
                var filteredKeys = device.keys.filter(function (obj) {
                        return obj.key == key;
                    }
                );
                var keyObj = null;
                if (filteredKeys.length > 0) {
                    keyObj = filteredKeys[0];
                }

                if (keyObj && keyObj.expire > now && keyObj.limit >= 1) {
                    deviceCollection.update(
                        {
                            deviceid: deviceid,
                            'keys.key': key
                        },
                        {
                            $inc: {
                                'keys.$.limit': -1
                            }
                        }
                    );

                    var token = generateToken(deviceid, key);
                    deviceInfo = buildDeviceInfo(device, keyObj, token);
                }
            }
            cb(deviceInfo);
        }
    );
};

/**
 *    openDoor
 *    @param deviceid must be number
 *    @param doorNumber must be number
 *    @param token the token used to open the door
 *    @param cb callback function which gets called with result (boolean)
 */
exports.opendoor = function (deviceid, doorNumber, token, cb) {
    var now = new Date().getTime();
    deviceCollection.findOne(
        {
            deviceid: deviceid,
            'doors.number': doorNumber,
            'keys.token': token,
            'keys.expire': {
                $gt: now
            }
        },
        function (err, device) {
            if (err)
                cb(false);
            if (device)
                cb(true);
            else
                cb(false);
        }
    );
}

/**
 *    builds device info
 *    @param device object from db
 *    @param key key object from device from db
 *    @param token the one used
 */
function buildDeviceInfo(device, key, token) {
    doors = device.doors.filter(function (obj) {
            return key.doors.indexOf(obj.number) > -1;
        }
    );

    deviceInfo =
    {
        deviceid: device.deviceid,
        name: device.name,
        token: token,
        doors: doors,
        expire: key.expire,
        limit: key.limit
    };
    return deviceInfo;
}
/**
 *
 * @param deviceid
 * @param doors must be array of numbers
 * @param expire date
 * @param limit how many uses
 */
exports.generateKey = function (deviceid, doors, expire, limit) {
    var randomKey = generateRandomString(6);

    // add to database
    var key = {};
    key.expire = expire;
    key.doors = doors;
    key.limit = limit;
    key.key = randomKey;
    deviceCollection.update(
        {
            deviceid: deviceid
        },
        {
            $push: {
                keys: key
            }
        },
		function(err,suc){}
    );
    return key;
}

function generateRandomString(length) {
    var randomBytes = crypto.randomBytes(256);
    var myHasher = crypto.createHash('sha1');
    myHasher.update(randomBytes);
    var randomString = myHasher.digest('hex').substring(0, length);
    return randomString;
}
/**
 * create a new device so the server can recognize it will
 * return the device with password and generated deviceid
 * @param doors array of numbers one for each door
 */
exports.createDevice = function (doors) {
    var randompw = generateRandomString(8);
    var insert = {};
    insert.deviceid = hat(); // hat generates random hash which dont collide
    insert.name = 'new Device';
    insert.masterpwdhash = passwordHash.generate(randompw);
    insert.doors = [];
    for (var i = 1; i <= doors; i++) {
        var door = {};
        door.name = 'Neue Tür ' + i;
        door.number = i;
        door.buzztime = config.defaultBuzzTime;
        insert.doors.push(door);
    }
    insert.keys = [];
    deviceCollection.insert(insert,function (err,success){logger.info("wrote to db")});
    delete insert.masterpwdhash;
    // add after so it won't get stored in db
    insert.pw = randompw;

    return insert;
};

exports.loginAdmin = function(user, pwd,cb)
{
	adminCollection.findOne({user: user},
        function(err,success)
        {
			logger.info(success);
            if(success)
            {
				logger.info(success.pwd);
                if(passwordHash.verify(pwd,success.pwd))
                    cb(true);
                else    cb(false);
            }
            else        cb(false);
        });
};