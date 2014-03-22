(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app.AppView = (function(_super) {
    __extends(AppView, _super);

    function AppView() {
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.el = "#app";

    AppView.prototype.model = app.model;

    AppView.prototype.template = Handlebars.compile($("#app-template").html());

    AppView.prototype.initialize = function() {
      this.listenTo(this.model, "change:page", this.changePage);
      return this.render();
    };

    AppView.prototype.render = function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.newDoorView = new app.NewDoorView({
        model: this.model,
        el: "#page-new-door"
      });
      this.openDoorView = new app.OpenDoorView({
        model: this.model,
        el: "#page-open-door"
      });
      return this.changePage();
    };

    AppView.prototype.changePage = function() {
      switch (this.model.get("page")) {
        case "newDoor":
          this.newDoorView.render();
          this.$("#page-new-door").removeClass("page-right").addClass("page-middle");
          return this.$("#page-open-door").removeClass("page-middle").addClass("page-left");
        case "openDoor":
          this.openDoorView.render();
          this.$("#page-new-door").removeClass("page-middle").addClass("page-right");
          return this.$("#page-open-door").removeClass("page-left").addClass("page-middle");
      }
    };

    return AppView;

  })(Backbone.View);

}).call(this);
