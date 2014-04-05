(function() {
  define(['controller/loginController'], function(loginController) {
    var controller;
    controller = {
      login: loginController.login
    };
    return Object.freeze(controller);
  });

}).call(this);
