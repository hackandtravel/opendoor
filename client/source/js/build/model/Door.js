(function() {
  define(['underscore'], function(_) {
    var Door;
    return Door = (function() {
      Door.prototype.defaults = function() {
        return {
          buzztime: 5000,
          name: null,
          number: 1,
          expire: 0
        };
      };

      function Door(args) {
        _.extend(this, this.defaults(), args);
      }

      return Door;

    })();
  });

}).call(this);
