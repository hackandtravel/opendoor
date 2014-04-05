(function() {
  define(['controller/loginController', 'controller/initController', 'controller/deviceStoreController', 'controller/openDoorController'], function(loginController, initController, deviceStoreController, openDoorController) {
    var Controller, singleton;
    Controller = (function() {
      function Controller() {}

      Controller.prototype.login = loginController.login;

      Controller.prototype.getDoors = initController.getDoors;

      Controller.prototype.getToken = function(deviceid) {
        var _ref;
        return (_ref = deviceStoreController.fetch(deviceid)) != null ? _ref.token : void 0;
      };

      Controller.prototype.openDoor = openDoorController.openDoor;

      return Controller;

    })();
    singleton = function() {
      return new Controller;
    };
    return singleton();
  });

}).call(this);
