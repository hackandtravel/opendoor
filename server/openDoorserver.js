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
var crypto = require('crypto');
var fs = require("fs");
var http = require("http");
var url = require("url");
var spawn = require('child_process').spawn;

// constants
var path = "/opendoor";
const masterPW = "superpasswort";
const validtoken = "mygeneratedToken";
const validpassphrase = "123456";

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

function commit(db) {
    fs.writeFileSync('db.json', JSON.stringify(db));
}

// TODO make https
// create key and sign certificate
var server = http.createServer(serverThread);
server.listen(8000);

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

function generatePassphrase(options) {
    var rnd = function(min, max) {
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

function generateHeaders(request) {
    var headers = {
        'Content-Type': 'application/json',
        "Access-Control-Max-Age": "300",
        "Access-Control-Allow-Origin": request.headers['origin'],
        "Access-Control-Allow-Credentials": "true"
    };

    if (request.headers.hasOwnProperty("Access-Control-Request-Method")) {
        headers["Access-Control-Allow-Methods"] = request.headers['Access-Control-Request-Method'];
    }

    if (request.headers.hasOwnProperty("Access-Control-Request-Headers")) {
        headers["Access-Control-Allow-Headers"] = request.headers['Access-Control-Request-Headers'];
    }

    return headers;
}

function serverThread(request, response) {
    var headers = generateHeaders(request);

    var parsedURL = url.parse(request.url, true);

    if (parsedURL.pathname === path + "/login") {
        var passphrase = parsedURL.query.passphrase;
        var deviceid = parsedURL.query.deviceId;

        generateToken(passphrase, deviceid, {
            error: function () {
                response.writeHead(401, headers);
                response.end("sorry bro");
            },
            success: function (token) {
                response.writeHead(200, headers);
                response.end(JSON.stringify({"token": token}));
            }
        });
    }
    else if (parsedURL.pathname === path + "/opendoor") {
        var token = parsedURL.query.token;

        // check if token exists
        var success = db.tokens[token] == true;

        if (success) {
            // TODO run command on raspberry pi
            var open = spawn('ping', ['127.0.0.1 > C:\t.txt']);
            open.stdin.end();

            response.writeHead(200, headers);
        } else {
            response.writeHead(401, headers);
        }

        response.end(JSON.stringify({"success": success}));

    }
    else if (parsedURL.pathname === path + "/generate") {
        var pw = parsedURL.query.pw;
        if (pw == masterPW) {
            generatePassphrase({
                error: function() {
                    response.writeHead(500, headers);
                    response.end();
                },
                success: function(passphrase) {
                    response.writeHead(200, headers);
                    response.end(JSON.stringify({"passphrase": passphrase}));
                }
            });
        }
        else {
            response.writeHead(401, headers);
            response.end("sorry bro");
        }
    } else {
        response.writeHead(404, headers);
        response.end("sorry bro");
    }
}


