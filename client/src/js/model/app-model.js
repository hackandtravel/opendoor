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
      prot: "https://",
      doorUrl: "",
      doorUrls: [],
      disabled: "disabled"
    };

    AppModel.prototype.initialize = function() {
      var doorUrls, s, socket;
      socket = io.connect('ws://localhost:80');
      socket.on('news', function(data) {
        console.log(data);
        return socket.emit('my other event', {
          my: 'my data'
        });
      });
      s = localStorage.getItem("doorUrls");
      if (s != null) {
        doorUrls = JSON.parse(s);
        return this.set({
          page: "openDoor",
          doorUrl: doorUrls[doorUrls.length - 1],
          doorUrls: doorUrls,
          disabled: ""
        });
      } else {
        return this.set({
          page: "newDoor"
        });
      }
    };

    return AppModel;

  })(Backbone.Model);

  app.model = new app.AppModel;

}).call(this);
