define [
  'model/Device'
  'controller/deviceStoreController'
], (Device, deviceStoreController) ->
  class InitController
    getDoors: ->
      deviceStoreController.fetchAll().reduce (doors, nextDevice) ->
        doors.concat(nextDevice.doors)
      , []

  singleton = -> new InitController
  singleton()
