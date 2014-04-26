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
/*frisby.create('create Admin')
    .get(url + "createAdmin?user=" + helpers.admin + "&pwd=" + helpers.pwd)
    .expectStatus(200).toss();*/

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
    .inspectBody()
    .afterJSON(function (body) {
            // login in with master key
            body.key =body.masterkey;
            login(body, true);
        })
    .toss();

/**
 * testing login into door
 */
function login(data, master) {
    frisby.create('login to the device with the provided key')
        .get(url + "login?key=" + data.key + "&deviceid="+data.deviceid)
        .expectJSON({
            token: function (token) {
                expect(token).toBeDefined();
            }


        })
        .expectJSONTypes({
            masterToken: Boolean
        })
        .expectStatus(200)
        .inspectBody()
            .afterJSON(function (body) {
            if(master) {

                body.door = 1;
                opendoor(body);
                generateKey(body);
                getDevice(body);
                putDevice(body);
            }
            else
            {
                body.door = 1;
                opendoor(body);
                getDevice(body);
            }
        })
        .toss();
}

/**
 * testing get device
 */

function getDevice(data)
{
     frisby.create('GET Device')
        .get(url + "device?deviceid=" + data.deviceid +"&token="+data.token)
        .expectJSON({
            deviceid: function (deviceid) {
                expect(deviceid).toBeDefined();
            }
        })
        .expectStatus(200)
        .inspectBody()
        .toss();
}



/**
 * testing get device
 */

function putDevice(data)
{
    // TODO REFINE
    frisby.create('PUT Device')
        .put(url + "device", data, {json:true})
        .expectJSON({
            deviceid: function (deviceid) {
                expect(deviceid).toBeDefined();
            }
        })
        .expectStatus(200)
        .inspectBody()
        .toss();
}
/**
 * test key generation
 * @param device
 */

var keyinfo = {};
keyinfo.expire = new Date().getTime() + 1000 * 60 * 60 * 24 * 3; // 3 tage
keyinfo.limit = 1;
keyinfo.doors = [1, 2];
keyinfo.name = "test key";
function generateKey(data) {
        keyinfo.deviceid = data.deviceid;
        keyinfo.token = data.token;
        frisby.create('create a key for the device')
            .post(url + "key", keyinfo, {json: true})
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
            .afterJSON(function(body)
            {
                login(body, false);
                changeKey(body);
            })
            .toss();
}

/**
 * Test changing a Key
 */

function changeKey(data)
{
    keyinfo.deviceid = data.deviceid;
        keyinfo.token = data.token;
        keyinfo.key = data.key;
        keyinfo.name = "changed name";
        frisby.create('create a key for the device')
            .put(url + "key", keyinfo, {json: true})
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSON({
                expire: function (ex) {
                    expect(ex).toBeGreaterThan(new Date().getTime())
                },
                key: function (key) {
                    expect(key).toBeDefined();
                },
                name : "changed name"
            })
            .toss();
}/**
 * data should contain device id and token and door
 * @param data
 */
function opendoor(data) {
    console.log(data);
    frisby.create('try opening the door').
        get(url + "opendoor?deviceid=" + data.deviceid + "&token=" + data.token +"&door="+data.door)
        .expectStatus(200)
        .toss();
}
