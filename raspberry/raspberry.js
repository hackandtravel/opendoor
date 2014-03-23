var helpers = require('./helpers.js');
var config = require('./config.js');

helpers.configurePins(function () {
  console.log('configured pins');
  helpers.connect(config.location);
});
