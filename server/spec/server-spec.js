(function() {
  var adress, clientSide, https, proxyquire, pwd, user;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  proxyquire = require('proxyquire');

  clientSide = require('../clientSide.js');

  https = require('https');

  adress = 'https://localhost:3001/opendoor/';

  pwd = 'test';

  user = 'test';

  describe('server', function() {
    it('should not contradict universal laws', function() {
      return expect(true).toBe(true);
    });
    it('should create an admin', function(done) {
      return https.get(adress + 'createAdmin?user=test&pw=test', function(res) {
        return res.on('data', function(d) {
          expect(d).toBeDefined();
          return done();
        });
      });
    });
    return describe('clientSide', function() {
      return it('shoulid create and return a device in json', function(done) {
        https.get(adress + 'createDevice?user=' + test + '&pwd=' + test + '&doors=2', function(res) {
          return res.on('data', function(d) {
            return expect(d);
          });
        });
        return done();
      });
    });
  });

}).call(this);
