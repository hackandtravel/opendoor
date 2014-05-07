/**
 * Created by Philipp on 21.04.2014.
 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var Promise = require('es6-promise').Promise;
var request = require('request');
exports.url = 'https://192.168.1.15:3001/opendoor/';
var urli = 'https://192.168.1.15:3001/opendoor/';
exports.admin = "admin";
var admin = "admin";
exports.pwd = "password";
var pwd = "password";
exports.getDevice = function () {
    return makeRequest({
        url: urli + "createDevice",
        qs: {
            user: admin,
            pwd: pwd,
            doors: 2
        },
        method: 'GET'
    });

};


exports.login = function (deviceinfo) {
    var keyinfo = {};
    keyinfo.deviceid = deviceinfo.deviceid;
    keyinfo.key = deviceinfo.masterkey;
    return makeRequest({
        url:  urli+ "login",
        qs: keyinfo,
        method: 'GET'
    }, deviceinfo.deviceid);

};


exports.opendoor = function (deviceinfo) {
    var parameter = {};
    parameter.deviceid = deviceinfo.deviceid;
    parameter.token = deviceinfo.token;
    parameter.door = 1;
    return makeRequest({
        url:  urli+ "opendoor",
        qs: parameter,
        method: 'GET'
    }, deviceinfo.deviceid);

};
exports.getKey = function (deviceinfo) {
    var keyinfo = {};
    keyinfo.expire = new Date().getTime() + 1000 * 60 * 60 * 24 * 3; // 3 tage
    keyinfo.limit = 1;
    keyinfo.doors = [1, 2];
    keyinfo.name = "test key";
    keyinfo.deviceid = deviceinfo.deviceid;
    keyinfo.masterpwd = deviceinfo.pw;
    return makeRequest({
        url:  urli+ "generateKey",
        json: keyinfo,
        method: 'POST'
    }, deviceinfo.deviceid);

};
function makeRequest(options, deviceid) {
    console.log(options);
    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("got response" + body)
                if(typeof body == 'string')
                    resolve(JSON.parse(body));
                else
                    body.deviceid = deviceid;
                    resolve(body);
            }
            else {
                console.log("server down? request was:\n" + options.url);
                reject(error);
            }
        });
    });
}
