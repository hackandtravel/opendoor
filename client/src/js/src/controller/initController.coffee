define [
  'httpRequest'
  'model/Device'
  'controller/deviceStoreController'
], (httpRequest, Device, deviceStoreController) ->
  class InitController
    init: ->
      # make a fake api call so the next request executes faster
      httpRequest
        method: 'GET'
        url: '/api'

    getDoors: ->
      deviceStoreController.fetchAll().reduce (doors, nextDevice) ->
        doors.concat(nextDevice.doors)
      , []

  singleton = -> new InitController
  singleton()
