var serverSide = require('./serverSide.js');
var logger = require("./logger.js");
var crypto = require('crypto');


exports.generateRandomString = function (length) {
    var randomBytes = crypto.randomBytes(256);
    var myHasher = crypto.createHash('sha1');
    myHasher.update(randomBytes);
    var randomString = myHasher.digest('hex').substring(0, length);
    //var randomString = myHasher.digest('binary')k;
    var i = 0;
    return randomString;
}

exports.AUTH_STATE = Object.freeze({
    NOT_AUTH: "notauth",
    MASTER: "master",
    USER: "user"
})

