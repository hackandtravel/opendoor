// openDoor server

/* json api server
 GET Methods:

 -login { passphrase : servergenerated phassphrase
 deviceid : deviceid from device}
 return: token which can be used to open the door

 -opendoor { generated token in server handshake }
 return error or success message

 -generate: this generates a new passphrase which can be handed out to users
 { master password }
 return passphrase


 */
// require
var fs = require("fs");
var express = require('express');
var crypto = require('crypto');
var spawn = require('child_process').spawn;

// constants
const path = "/opendoor";
const masterPW = "superpasswort"; // TODO: do not store in plain text

// read "DB"
var db;

fs.exists('db.json', function (exists) {
    if (exists) {
        db = JSON.parse(fs.readFileSync('db.json', "utf8"));
    }
    else {
        db = {
            passphrases: {},
            tokens: {}
        };
        commit(db);
    }
});

// TODO make https
var app = express();
app.use(express.static('www')); // serve webapp
app.use(express.bodyParser()); //autoparse json
app.listen(8000);

var addCORSHeaders = function (req, res) {
    res.setHeader("Access-Control-Max-Age", "300")
    res.setHeader("Access-Control-Allow-Origin", req.headers['origin'])
    res.setHeader("Access-Control-Allow-Credentials", "true")

    if (req.headers.hasOwnProperty("Access-Control-Request-Method")) {
        res.setHeader("Access-Control-Allow-Methods", req.header['Access-Control-Request-Method']);
    }

    if (req.headers.hasOwnProperty("Access-Control-Request-Headers")) {
        res.setHeader("Access-Control-Allow-Headers", req.header['Access-Control-Request-Headers']);
    }
};

// add CORS headers to every request
app.get(path + '/*', function (req, res, next) {
    addCORSHeaders(req, res);
    next();
});

app.get(path + '/login', function (req, res) {
    var passphrase = req.query.passphrase;
    var deviceid = req.query.deviceId;

    generateToken(passphrase, deviceid, {
        error: function () {
            res.status(401).send();
        },
        success: function (token) {
            res.send({token: token});
        }
    });
});

app.get(path + '/opendoor', function (req, res) {
    var token = req.query.token;

    // check if token exists
    var success = db.tokens[token] == true;

    if (!success) {
        res.status(401).send();
    } else {
        // TODO run command on raspberry pi
        var open = spawn('ping', ['127.0.0.1 > C:\t.txt']);
        open.stdin.end();
        res.status(200).send();
    }
});

app.get(path + '/generate', function (req, res) {
    var pw = req.query.pw;
    if (pw == masterPW) {
        generatePassphrase({
            error: function () {
                res.status(500).send();
            },
            success: function (passphrase) {
                res.status(200).send({"passphrase": passphrase});
            }
        });
    }
    else {
        res.status(401).send();
    }
});

function commit(db) {
    fs.writeFileSync('db.json', JSON.stringify(db));
}

function generateToken(passphrase, deviceid, options) {
    // check if passphrase exists
    var phrase = db.passphrases[passphrase];

    // check if the passphrase is used already
    if (phrase && phrase.deviceid == null) {
        //generate token and store it and update device id
        var hasher = crypto.createHash('sha1');
        hasher.update(passphrase + deviceid);
        var token = hasher.digest('hex');

        phrase.deviceid = deviceid;
        db.tokens[token] = true;
        commit(db);

        options.success(token)
    }
    else {
        // does not exist or already used
        options.error()
    }
}

// TODO: Okay, this is not safe. Allow only for a limited amount of time or revert to hashes
function generatePassphrase(options) {
    var rnd = function (min, max) {
        return parseInt(Math.random() * (max - min) + min);
    };

    fs.readFile('linuxwords.txt', "utf8", function (err, data) {
        if (err) {
            options.error();
        }
        var words = data.split("\n");
        var max = words.length;

        var phrases = [];
        phrases.push(words[rnd(0, max)].toLowerCase());
        phrases.push(words[rnd(0, max)].toLowerCase());
        // phrases.push(rnd(0, 100));

        var passphrase = phrases.join("-");

        db.passphrases[passphrase] = {
            deviceid: null
        };
        commit(db);

        options.success(passphrase);
    });
}
