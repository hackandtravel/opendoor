define [
  'model/Device'
  'controller/apiRequest'
  'controller/deviceStoreController'
], (Device, apiRequest, deviceStoreController) ->
  class LoginController
    login: (deviceId, key, fs) ->
      unless fs?
        console.error("Must provide callback functions")
        return

      if fs.setStatus? then fs.setStatus(null)
      if fs.setLoading? then fs.setLoading(true)
      if fs.setError? then fs.setError(false)

      apiRequest
        method: 'GET'
        url: '/login'
        data:
          deviceid: deviceId
          key: key

        statusCode:
          401: ->
            if fs.setError? then fs.setError(true)

        success: (res) ->
          device = new Device(res)
            
          if deviceStoreController.save(device)
            if fs.addDevice then fs.addDevice(device)

          if fs.setLoading? then fs.setLoading(false)
          if fs.setRouteHome then fs.setRouteHome()

        error: (res) ->
          if fs.setLoading? then fs.setLoading(false)
          if fs.setStatus? then fs.setStatus(res.status)

  singleton = -> new LoginController
  singleton()

