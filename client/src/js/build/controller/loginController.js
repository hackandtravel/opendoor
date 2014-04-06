(function() {
  define(['httpRequest', 'model/Device', 'controller/deviceStoreController'], function(httpRequest, Device, deviceStoreController) {
    var LoginController, singleton;
    LoginController = (function() {
      function LoginController() {}

      LoginController.prototype.login = function(deviceId, key, fs) {
        if (fs == null) {
          console.error("Must provide callback functions");
          return;
        }
        if (fs.setStatus != null) {
          fs.setStatus(null);
        }
        if (fs.setLoading != null) {
          fs.setLoading(true);
        }
        if (fs.setError != null) {
          fs.setError(false);
        }
        return httpRequest({
          method: 'GET',
          url: '/login',
          data: {
            deviceid: deviceId,
            key: key
          },
          statusCode: {
            401: function() {
              if (fs.setError != null) {
                return fs.setError(true);
              }
            }
          },
          success: function(res) {
            var device;
            device = new Device(res);
            deviceStoreController.save(device);
            if (fs.setLoading != null) {
              fs.setLoading(false);
            }
            if (fs.addDevice) {
              fs.addDevice(device);
            }
            if (fs.setRouteHome) {
              return fs.setRouteHome();
            }
          },
          error: function(res) {
            if (fs.setLoading != null) {
              fs.setLoading(false);
            }
            if (fs.setStatus != null) {
              return fs.setStatus(res.status);
            }
          }
        });
      };

      return LoginController;

    })();
    singleton = function() {
      return new LoginController;
    };
    return singleton();
  });

}).call(this);
