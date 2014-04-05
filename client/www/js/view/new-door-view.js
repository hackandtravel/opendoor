(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app.NewDoorView = (function(_super) {
    __extends(NewDoorView, _super);

    function NewDoorView() {
      return NewDoorView.__super__.constructor.apply(this, arguments);
    }

    NewDoorView.prototype.model = app.model;

    NewDoorView.prototype.template = Handlebars.compile($("#new-door-template").html());

    NewDoorView.prototype.events = {
      "click #login-btn": "loginClicked",
      "click #back-btn": "backClicked"
    };

    NewDoorView.prototype.initialize = function() {
      return this.render();
    };

    NewDoorView.prototype.render = function() {
      return this.$el.html(this.template(this.model.toJSON()));
    };

    NewDoorView.prototype.loginClicked = function() {
      var deviceId, key;
      deviceId = this.$("#door-url").val();
      key = this.$("#passphrase").val();
      this.$("#new-door-brand").html('<div class="loading spin"></div>');
      this.$(".form-group").removeClass("has-error");
      return $.ajax({
        url: app.location + ("/login?deviceid=" + deviceId + "&key=" + key),
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        statusCode: {
          401: (function(_this) {
            return function() {
              _this.$(".pass-form-group").addClass("has-error");
              return _this.$(".door-form-group").addClass("has-error");
            };
          })(this)
        },
        error: (function(_this) {
          return function(err) {
            return _this.$(".navbar-brand").text(err.status);
          };
        })(this),
        success: (function(_this) {
          return function(resp) {
            var deviceIds, json;
            _this.$("#new-door-brand").text("Add a door");
            _this.$("#door-url").val("");
            _this.$("#passphrase").val("");
            json = localStorage.getItem("deviceIds");
            deviceIds = json != null ? JSON.parse(json) : [];
            if (!_.contains(deviceIds, deviceId)) {
              deviceIds.push(deviceId);
              localStorage.setItem('deviceIds', JSON.stringify(deviceIds));
            }
            localStorage.setItem(deviceId, JSON.stringify(resp));
            return _this.model.set({
              doorUrl: deviceId,
              page: "openDoor",
              disabled: ""
            });
          };
        })(this)
      });
    };

    NewDoorView.prototype.backClicked = function() {
      return this.model.set("page", "openDoor");
    };

    return NewDoorView;

  })(Backbone.View);

}).call(this);
