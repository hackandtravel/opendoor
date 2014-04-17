var addr = process.env.DB_PORT_27017_TCP_ADDR;
var port = process.env.DB_PORT_27017_TCP_PORT;

exports.portRasp = 3000;
exports.portClient = 3001;
exports.path = '/opendoor';
exports.mongoURL = 'mongodb://' + addr + ':' + port + '/test';
exports.defaultBuzzTime = 5000;