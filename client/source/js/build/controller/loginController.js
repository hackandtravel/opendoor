(function() {
  define(['jquery', 'config'], function($, CONFIG) {
    var loginController;
    loginController = {
      login: function(deviceId, key, fs) {
        console.log(deviceId, key);
        if ((fs != null ? fs.setLoading : void 0) != null) {
          fs.setLoading(true);
        }
        return $.ajax({
          method: 'GET',
          url: CONFIG.LOCATION + '/login',
          success: function(data) {
            if ((fs != null ? fs.setLoading : void 0) != null) {
              return fs.setLoading(false);
            }
          },
          error: function(err) {
            if ((fs != null ? fs.setLoading : void 0) != null) {
              return fs.setLoading(false);
            }
          }
        });
      }
    };
    return Object.freeze(loginController);
  });

}).call(this);
