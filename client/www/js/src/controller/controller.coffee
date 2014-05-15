define [
  'underscore'
  'controller/apiRequest'
  'controller/loginController'
  'controller/initController'
  'controller/deviceStoreController'
  'controller/openDoorController'
  'controller/keyController'
  'model/Device'
], (_, apiRequest, loginController, initController, deviceStoreController, openDoorController, keyController, Device) ->
  class Controller
    init: initController.init
    login: loginController.login
    getDoors: initController.getDoors
    getToken: (deviceid) -> deviceStoreController.fetch(deviceid)?.token
    openDoor: openDoorController.openDoor
    generateKey: keyController.generateKey
    updateKey: keyController.updateKey
    deleteKey: keyController.deleteKey
    restoreKey: keyController.restoreKey
    getDevice: (id) -> deviceStoreController.fetch(id)
    updateDevice: (device, cb) ->
      apiRequest
        method: 'GET'
        url: '/device?deviceid=' + device.deviceid + '&token=' + device.token
        success: (res) ->
          _.extend device, res
          deviceStoreController.save(new Device(device))
          cb()
        error: ->
          

  singleton = -> new Controller
  singleton()
