var helpers = require('./helpers.js');
var config = require('./config.js');
var logger = require('./logger.js');

logger.info('-------------------------------------------');
logger.info('(Re-) Starting OpenDoor Raspberry Component');

helpers.configurePins(function () {
  logger.info('Configured pins');
  helpers.connect(config.location);
  helpers.failSafe();
});
