process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var Promise = require('es6-promise').Promise;
var frisby = require('frisby');
var helpers = require('./helpers.js');
//see if app is available
frisby.create('RUNNING check')
    .get(url + "api")
    .expectStatus(200).toss();

/**
 * Test for create Admin
 */
frisby.create('create Admin')
    .get(url + "createAdmin?user=" + helpers.admin + "&pwd=" + helpers.pwd)
    .expectStatus(200).toss();

/**
 * testing create Device
 */
var numDoors = 2;
frisby.create('create Device')
    .get(url + 'createDevice?user=' + helpers.admin + '&pwd=' + helpers.pwd + '&doors=' + numDoors)
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSON({
        keys: function (val) {
            expect(val.length).toBe(0);

        }
    })
    .expectJSONTypes({
        deviceid: String,
        name: String,
        doors: function (val) {
            expect(val.length).toBe(numDoors);

        } // Custom matcher callback
    })
    .toss();


/**
 * Testing generate Key
 */
var keyinfo = {};
keyinfo.expire = new Date().getTime() + 1000 * 60 * 60 * 24 * 3; // 3 tage
keyinfo.limit = 1;
keyinfo.doors = [1, 2];
keyinfo.name = "test key";
/**
 * test key generation
 * @param device
 * @returns {Promise}
 */
function generateKey(device) {
        keyinfo.deviceid = device.deviceid;
        keyinfo.masterpwd = device.pw;
        frisby.create('create a key for the device')
            .post(url + "generateKey", keyinfo, {json: true})
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSON({
                expire: function (ex) {
                    expect(ex).toBeGreaterThan(new Date().getTime())
                },
                key: function (key) {
                    expect(key).toBeDefined();
                }
            })
            .toss();
}

helpers.getDevice().then(generateKey);
helpers.getDevice().then(helpers.getKey).then(loginToDevice);


/**
 * testing login into door
 */
function loginToDevice(keyinfo) {
    return new Promise(function (resolve, reject) {
        frisby.create('login to the device with the provided key')
            .get(url + "login?key=" + keyinfo.key + "&deviceid=" + keyinfo.deviceid)
            .expectJSON({
                token: function (token) {
                    keyinfo.token = token;
                    expect(token).toBeDefined();
                }
            })
            .expectStatus(200)
            .inspectBody()
            .afterJSON(function(body)
            {
                keyinfo.token = body.token;
                opendoor(keyinfo);
                resolve(keyinfo);
            })
            .toss();
    });
}

function opendoor(info) {
    console.log(info);
    frisby.create('try opening the door').
        get(url + "opendoor?deviceid=" + info.deviceid + "&token=" + info.token +"&doorNumber=2")
        .expectStatus(200)
        .toss();
}
