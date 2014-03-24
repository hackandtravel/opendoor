var frisby = require('frisby');
var config = require('../config.js');
var SERVERADDRESS = 'https://localhost:3001' + config.path;
//var devices = helpers.createDevices(10,{limit:3,amount:4,numDays:5});
var server = require('../server.js');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var numDoor = 1;
frisby.create('Create Device').
    get(SERVERADDRESS + '/createDevice?user=test&pwd=123456&doors=1').
    expectStatus(200).
    expectHeaderContains('content-type', 'application/json').
    expectJSONLength().
    expectJSON(deviceid: function(val) { expect(val).not.toBe(null)}).
    inspectJSON().
    toss();





