define [
  'controller/apiRequest'
  'controller/loginController'
  'controller/initController'
  'controller/deviceStoreController'
  'controller/openDoorController'
  'controller/keyController'
], (apiRequest, loginController, initController, deviceStoreController, openDoorController, keyController) ->
  class Controller
    init: initController.init
    login: loginController.login
    getDoors: initController.getDoors
    getToken: (deviceid) -> deviceStoreController.fetch(deviceid)?.token
    openDoor: openDoorController.openDoor
    generateKey: keyController.generateKey
    getDevice: (id) -> deviceStoreController.fetch(id)
    updateDevice: (device, cb) ->
      apiRequest
        method: 'GET'
        url: '/device?deviceid=' + device.deviceid + '&token=' + device.token
        success: (res) ->
          console.log res
          #deviceStoreController.save(new Device(res))
          cb()
        error: ->
          

  singleton = -> new Controller
  singleton()
