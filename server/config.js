var addr = process.env.DB_PORT_27017_TCP_ADDR;
var port = process.env.DB_PORT_27017_TCP_PORT;

exports.portRasp = 3000;
exports.portClient = 3001;
exports.path = '/opendoor';
exports.mongoURL = 'mongodb://localhost:27017/test';
exports.defaultBuzzTime = 5000;
exports.keyLength = 4;
exports.debug = 1;

