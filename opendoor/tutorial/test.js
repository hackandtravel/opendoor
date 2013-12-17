
var spawn = require('child_process').spawn;

open = spawn('ping', ['127.0.0.1']);
open.stdout.on('data', function (chunk) {
    console.log(chunk.toString());
  });
  