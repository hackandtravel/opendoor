(function() {
  var admin, adress, clientSide, https, proxyquire, test;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  proxyquire = require('proxyquire');

  clientSide = require('../clientSide.js');

  https = require('https');

  adress = 'https://localhost:3001/opendoor/';

  admin = 'admin';

  test = 'test';

  describe('server', function() {
    it('should not contradict universal laws', function() {
      return expect(true).toBe(true);
    });
    return it('should create an admin', function(done) {
      return https.get(adress + 'createAdmin?user=test&pw=test', function(res) {
        return res.on('data', function(d) {
          expect(d).toBeDefined();
          return done();
        });
      });
    });
  });

}).call(this);
