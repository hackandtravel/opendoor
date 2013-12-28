// openDoor server

/* json api server
 GET Methods:

 -login this registers a new user {
 passphrase : servergenerated phassphrase
 deviceid : deviceid from device }
 returns: token which can be used to open the door

 -opendoor this opens the door { 
 token : generated token in server handshake }
 returns: error or success message

 -generate: this generates a new passphrase which can be handed out to users { 
 pw : master password 
 name : name the person who's password this is, so you can later revoke the access }
 returns: the new passphrase
 */

// require
var fs = require("fs");
var express = require('express');
var crypto = require('crypto');
var spawn = require('child_process').spawn;

// constants
const path = "/opendoor";
const masterPW = "superpasswort"; // TODO: do not store in plain text

var init = spawn('plink', ['-i','pi.ppk','pi@192.168.1.130','gpio','mode','7','out']);
init.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});

var db;

// read "DB"
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

    var phrase = db.passphrases[passphrase];

    if (phrase && phrase.deviceid == null) {
        var token = generateToken(passphrase, deviceid);
        saveToken(token, phrase, deviceid);
        res.send({token: token});
    } else {
        res.status(401).send();
    }
});

app.get(path + '/opendoor', function (req, res) {
    var token = req.query.token;

    // check if token exists
    var success = db.tokens[token] != null;

    if (!success) {
        res.status(401).send();
    } else {
        //  run open door command on raspberry pi 
        //open = spawn('plink', ['-i','pi.ppk','pi@192.168.1.130']);
        var open = spawn('plink', ['-i','pi.ppk','pi@192.168.1.130','gpio','write','7','1']);
        open.stdout.on('data', function (data) {
          console.log('stdout: ' + data);
        });

        open.on('close', function (code) {
          console.log('child process exited with code ' + code);
        });
        
        // close door after 5 seconds
        setTimeout(function() {
          var close = spawn('plink', ['-i','pi.ppk','pi@192.168.1.130','gpio','write','7','0']);
          close.on('close', function (code) {
            console.log('Closed code:' + code);
          });
        }, 5000);

        res.status(200).send();
    }
});

app.get(path + '/generate', function (req, res) {
    var pw = req.query.pw;
    var name = req.query.name;

    if (pw == null) {
        res.status(500).send("pw query parameter missing");
    } else {
        if (pw != masterPW) {
          res.status(401).send("wrong password");
        } else {
            if (name == null) {
                res.status(500).send("name query parameter missing");
            } else {
                var passphrase = generatePassphrase(name);
                savePassphrase(passphrase, name);
                res.status(200).send({passphrase: passphrase});
            }
        }
    }
});

function commit(db) {
    fs.writeFileSync('db.json', JSON.stringify(db));
}

function generateToken(passphrase, deviceid) {
    var hasher = crypto.createHash('sha1');
    hasher.update(passphrase + deviceid);
    var token = hasher.digest('hex');

    return token;
}

// dao function
function saveToken(token, phrase, deviceid) {
    db.tokens[token] = phrase.name;
    phrase.deviceid = deviceid;
    commit(db);
}

function generatePassphrase(name) {
    var randomBytes = crypto.randomBytes(256);
    var hasher = crypto.createHash('sha1');
    hasher.update(randomBytes);
    var randomPassphrase = hasher.digest('hex');
    var passphrase = randomPassphrase.substring(0,6);

    return passphrase;
}

// dao function
function savePassphrase(passphrase, name) {
    db.passphrases[passphrase] = {
        name: name,
        deviceid: null
    };
    commit(db);
}
