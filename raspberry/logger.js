var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({'timestamp':true})
  ]
});

exports.logger = logger;
exports.log = logger.log
exports.info = logger.info;
exports.warn = logger.warn;
exports.error = logger.error;
