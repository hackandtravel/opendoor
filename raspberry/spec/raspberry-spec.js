(function() {
  var CALLBACK_JITTER, HIGH, LOW, gpioStub, helpers, jitter, proxyquire;

  proxyquire = require('proxyquire');

  HIGH = 1;

  LOW = 0;

  gpioStub = {};

  helpers = proxyquire('../helpers.js', {
    'pi-gpio': gpioStub,
    './config.js': {
      TIMEOUT: 1000,
      MAX_BUZZ_TIME: 50,
      DOOR_PINS: {
        1: 'gpio0',
        2: 'gpio7',
        3: void 0
      }
    }
  });

  CALLBACK_JITTER = 100;

  jitter = function(cb) {
    return setTimeout(cb, CALLBACK_JITTER * Math.random());
  };

  describe('raspberry', function() {
    it('should not contradict universal laws', function() {
      return expect(true).toBe(true);
    });
    describe('configurePins', function() {
      it('should configure 3 pins', function(done) {
        gpioStub.open = function(pin, inputOrOutput, cb) {
          expect(inputOrOutput).toBe('output');
          return jitter(cb);
        };
        gpioStub.write = function(pin, highOrLow, cb) {
          expect(highOrLow).toBe(LOW);
          return jitter(cb);
        };
        return helpers.configurePins(function() {
          return done();
        });
      });
      it('should also return when an error occurs', function(done) {
        gpioStub.open = function(pin, inputOrOutput, cb) {
          return jitter(cb.bind(void 0, new Error('Mock error')));
        };
        gpioStub.write = function(pin, highOrLow, cb) {
          return jitter(cb.bind(void 0, new Error('Mock error')));
        };
        return helpers.configurePins(function() {
          return done();
        });
      });
      return it('should also return when some callback is not called (displays 3 error messages)', function(done) {
        gpioStub.open = function() {};
        gpioStub.write = function() {};
        return helpers.configurePins(function() {
          return done();
        });
      }, 1100);
    });
    describe('openDoor', function() {
      return it('should open the door', function(done) {
        var i;
        gpioStub.write = function(pin, highOrLow, cb) {
          expect(highOrLow).toBe(HIGH);
          jitter(cb);
          return gpioStub.write = function(pin, highOrLow, cb) {
            expect(highOrLow).toBe(LOW);
            return jitter(cb);
          };
        };
        i = 2;
        return helpers.openDoor(1, 500, function(status) {
          console.log(status);
          i--;
          if (i === 0) {
            return done();
          }
        });
      });
    });
    describe('onOpenDoor', function() {
      it('expects a doorNumber parameter', function() {
        gpioStub.write = function(x, y, cb) {
          return jitter(cb);
        };
        return expect(function() {
          return helpers.onOpenDoor({});
        }).toThrow("Message does not contain 'doorNumber'");
      });
      return it('open the door for a fixed time', function(done) {
        var i;
        i = 2;
        return helpers.onOpenDoor({
          doorNumber: 1
        }, function() {
          i--;
          if (i === 0) {
            return done();
          }
        });
      });
    });
    return describe('connect', function() {
      return it('should connet to a secure socket.io server', function(done) {
        var fs, io, options, server;
        fs = require('fs');
        options = {
          key: fs.readFileSync(__dirname + '/secret/ryans-key.pem'),
          cert: fs.readFileSync(__dirname + '/secret/ryans-cert.pem')
        };
        server = require('https').createServer(options);
        io = require('socket.io').listen(server);
        server.listen(3423);
        io.sockets.on('connection', function(socket) {
          return done();
        });
        return helpers.connect('http://localhost:3423');
      });
    });
  });

}).call(this);
