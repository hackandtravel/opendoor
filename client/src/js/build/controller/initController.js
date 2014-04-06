(function() {
  define(['model/Device', 'controller/deviceStoreController'], function(Device, deviceStoreController) {
    var InitController, singleton;
    InitController = (function() {
      function InitController() {}

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
