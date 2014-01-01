// Generated by CoffeeScript 1.6.3
(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app.OpenDoorView = (function(_super) {
    __extends(OpenDoorView, _super);

    function OpenDoorView() {
      _ref = OpenDoorView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    OpenDoorView.prototype.model = app.model;

    OpenDoorView.prototype.template = Handlebars.compile($("#open-door-template").html());

    OpenDoorView.prototype.events = {
      "click #btn-open-door": "opendoorClicked",
      "change #select-door": "selectedDoorChanged",
      "click #btn-new": "btnNewClicked"
    };

    OpenDoorView.prototype.initialize = function() {
      return this.render();
    };

    OpenDoorView.prototype.render = function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this.$("#select-door").val(this.model.get("doorUrl"));
    };

    OpenDoorView.prototype.opendoorClicked = function(e) {
      var doorUrl, token,
        _this = this;
      this.$("#open-door-brand").html('<div class="loading spin"></div>');
      doorUrl = this.model.get("doorUrl");
      token = localStorage.getItem(doorUrl);
      return $.ajax({
        url: "" + doorUrl + "/opendoor?token=" + token,
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        success: function(resp) {
          var $t;
          _this.$("#open-door-brand").text("OpenDoor");
          $t = $(e.currentTarget);
          $t.addClass("disabled");
          setTimeout(function() {
            return $t.removeClass("disabled");
          }, 5000);
          if (navigator && navigator.notification) {
            return navigator.notification.vibrate(5000);
          }
        },
        error: function(err) {
          return _this.$("#open-door-brand").text(err.status);
        }
      });
    };

    OpenDoorView.prototype.selectedDoorChanged = function(e) {
      var doorUrl;
      doorUrl = $(e.currentTarget).val();
      this.model.set("doorUrl", doorUrl);
      return this.$("#btn-open-door").removeClass("disabled");
    };

    OpenDoorView.prototype.btnNewClicked = function() {
      return this.model.set({
        "page": "newDoor",
        "prot": "https://"
      });
    };

    return OpenDoorView;

  })(Backbone.View);

}).call(this);
