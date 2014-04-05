define [
  'controller/loginController'
], (loginController) ->
  controller =
    login: loginController.login

  Object.freeze controller
