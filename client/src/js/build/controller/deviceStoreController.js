(function() {
  define(['model/Device'], function(Device) {
    var DeviceStoreController, singleton;
    DeviceStoreController = (function() {
      function DeviceStoreController() {}

      DeviceStoreController.prototype.key = 'deviceIds';

      DeviceStoreController.prototype.setItem = function(key, item) {
        return localStorage.setItem(key, JSON.stringify(item));
      };

      DeviceStoreController.prototype.getItem = function(key) {
        var json;
        json = localStorage.getItem(key);
        if (json) {
          return JSON.parse(json);
        } else {
          console.warn('Could not find ' + key + ' in localStore');
          return null;
        }
      };

      DeviceStoreController.prototype.save = function(device) {
        var deviceIds;
        deviceIds = this.getItem(this.key) || [];
        deviceIds = deviceIds.concat(device.deviceid);
        this.setItem(this.key, deviceIds);
        return this.setItem(device.deviceid, device);
      };

      DeviceStoreController.prototype.fetchAll = function() {
        var deviceIds;
        deviceIds = this.getItem(this.key) || [];
        return deviceIds.map(this.fetch.bind(this));
      };

      DeviceStoreController.prototype.fetch = function(id) {
        return new Device(this.getItem(id)) || {};
      };

      return DeviceStoreController;

    })();
    singleton = function() {
      return new DeviceStoreController;
    };
    return singleton();
  });

}).call(this);
