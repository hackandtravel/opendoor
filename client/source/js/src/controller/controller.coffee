define [
  'controller/loginController'
  'controller/initController'
  'controller/deviceStoreController'
  'controller/openDoorController'
], (loginController, initController, deviceStoreController, openDoorController) ->
  class Controller
    login: loginController.login
    getDoors: initController.getDoors
    getToken: (deviceid) -> deviceStoreController.fetch(deviceid)?.token
    openDoor: openDoorController.openDoor

  singleton = -> new Controller
  singleton()
