define [
  'controller/apiRequest'
  'controller/deviceStoreController'
], (apiRequest, deviceStoreController) ->
  class InitController
    init: ->
      # make a fake api call so the next request executes faster
      apiRequest
        method: 'GET'
        url: '/api'

    getDoors: ->
      deviceStoreController.fetchAll().reduce (doors, nextDevice) ->
        doors.concat(nextDevice.doors)
      , []

  singleton = -> new InitController
  singleton()
