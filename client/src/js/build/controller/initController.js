(function() {
  define(['httpRequest', 'model/Device', 'controller/deviceStoreController'], function(httpRequest, Device, deviceStoreController) {
    var InitController, singleton;
    InitController = (function() {
      function InitController() {}

      InitController.prototype.init = function() {
        return httpRequest({
          method: 'GET',
          url: '/api'
        });
      };

      InitController.prototype.getDoors = function() {
        return deviceStoreController.fetchAll().reduce(function(doors, nextDevice) {
          return doors.concat(nextDevice.doors);
        }, []);
      };

      return InitController;

    })();
    singleton = function() {
      return new InitController;
    };
    return singleton();
  });

}).call(this);
