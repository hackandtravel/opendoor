define [
  'controller/loginController'
  'controller/initController'
  'controller/deviceStoreController'
  'controller/openDoorController'
  'controller/keyController'
], (loginController, initController, deviceStoreController, openDoorController, keyController) ->
  class Controller
    init: initController.init
    login: loginController.login
    getDoors: initController.getDoors
    getToken: (deviceid) -> deviceStoreController.fetch(deviceid)?.token
    openDoor: openDoorController.openDoor
    generateKey: keyController.generateKey

  singleton = -> new Controller
  singleton()
