define [
  'jquery'
  'config'
], ($, CONFIG) ->
  loginController =
    login: (deviceId, key, fs) ->
      console.log(deviceId, key)

      if fs?.setLoading? then fs.setLoading(true)

      $.ajax
        method: 'GET'
        url: CONFIG.LOCATION + '/login'
        success: (data) ->
          if fs?.setLoading? then fs.setLoading(false)
        error: (err) ->
          if fs?.setLoading? then fs.setLoading(false)

  Object.freeze loginController
