/**
 * Created by Philipp on 21.04.2014.
 */


var Promise = require('es6-promise').Promise;
var request = require('request');
exports.url = 'https://localhost:3001/opendoor/';
exports.admin = "admin";
exports.pwd = "password";
exports.getDevice = function () {
    return makeRequest({
        url: url + "createDevice",
        qs: {
            user: admin,
            pwd: pwd,
            doors: 2
        },
        method: 'GET'
    });

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
        url: url + "generateKey",
        json: keyinfo,
        method: 'POST'
    }, deviceinfo.deviceid);

};
function makeRequest(options, deviceid) {
    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
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