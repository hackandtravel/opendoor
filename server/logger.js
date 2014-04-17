var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({'timestamp':true},
    new (winston.transports.File)({ filename: 'server.log' }))
  ]
});

exports.logger = logger;
exports.log = logger.log
exports.info = logger.info;
exports.warn = logger.warn;
exports.error = logger.error;
