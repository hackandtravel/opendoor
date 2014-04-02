(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app.AppModel = (function(_super) {
    __extends(AppModel, _super);

    function AppModel() {
      return AppModel.__super__.constructor.apply(this, arguments);
    }

    AppModel.prototype.defaults = {
      id: null,
      page: "",
      doorUrl: "",
      doorUrls: [],
      disabled: "disabled"
    };

    AppModel.prototype.flatten = function(arr) {
      return arr.reduce(function(sum, a) {
        return sum.concat(a);
      }, []);
    };

    AppModel.prototype.initialize = function() {
      var deviceIds, doors, names, s;
      s = localStorage.getItem("deviceIds");
      if (s == null) {
        return this.set({
          page: "newDoor"
        });
      } else {
        deviceIds = JSON.parse(s);
        doors = _.map(deviceIds, function(deviceId) {
          var device;
          device = JSON.parse(localStorage.getItem(deviceId));
          if (!device.hasOwnProperty('doors')) {
            throw new Error("Device has no property 'doors'");
          }
          return device['doors'].map(function(door) {
            return {
              name: "" + device.name + " - " + door.name,
              deviceId: deviceId,
              number: door.number
            };
          });
        });
        names = this.flatten(doors);
        return this.set({
          page: "openDoor",
          doorUrl: names[deviceIds.length - 1],
          doorDoor: doors[deviceIds.length - 1],
          doorUrls: names,
          disabled: ""
        });
      }
    };

    return AppModel;

  })(Backbone.Model);

  app.model = new app.AppModel;

}).call(this);
