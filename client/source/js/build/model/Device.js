(function() {
  define(['underscore', 'model/Door'], function(_, Door) {
    var Device;
    return Device = (function() {
      Device.prototype.defaults = function() {
        return {
          deviceid: null,
          doors: [],
          limit: 1,
          name: null,
          token: null
        };
      };

      function Device(args) {
        _.extend(this, this.defaults(), args);
        if (!args.hasOwnProperty('doors')) {
          console.warn("Device without doors makes no sense");
          this.doors = args.doors.map(function(door) {
            return new Door(door);
          });
        }
      }

      return Device;

    })();
  });

}).call(this);
