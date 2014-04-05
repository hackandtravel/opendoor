(function() {
  define(['httpRequest'], function(httpRequest) {
    var OpenDoorController, singleton;
    OpenDoorController = (function() {
      function OpenDoorController() {}

      OpenDoorController.prototype.openDoor = function(door, token, fs) {
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
        if (fs.setDisabled != null) {
          fs.setDisabled(true);
        }
        return httpRequest({
          method: 'GET',
          url: '/openDoor',
          data: {
            deviceid: door.deviceid,
            doorNumber: door.number,
            token: token
          },
          success: function(res) {
            var buzzTime;
            buzzTime = door.buzztime || 5000;
            if (fs.setLoading != null) {
              fs.setLoading(false);
            }
            if (fs.setDisabled != null) {
              setTimeout(function() {
                return fs.setDisabled(false);
              }, buzzTime);
            }
            if ((typeof navigator !== "undefined" && navigator !== null ? navigator.notification : void 0) != null) {
              return navigator.notification.vibrate(buzzTime);
            }
          },
          error: function(res) {
            if (fs.setStatus != null) {
              fs.setStatus(res.status);
            }
            if (fs.setLoading != null) {
              fs.setLoading(false);
            }
            if (fs.setDisabled != null) {
              return fs.setDisabled(false);
            }
          }
        });
      };

      return OpenDoorController;

    })();
    singleton = function() {
      return new OpenDoorController;
    };
    return singleton();
  });

}).call(this);
