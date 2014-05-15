define [
  'controller/apiRequest'
], (apiRequest) ->
  class KeyController
    generateKey: (device, params, fs) =>
      @common('POST')(device, params, fs)

    updateKey: (device, params, fs) =>
      @common('PUT')(device, params, fs)

    deleteKey: (device, params, fs) =>
      @common('DELETE')(device, params, fs)

    restoreKey: (device, params, fs) =>
      params = _.extend({}, params)
      params.valid = true
      @common('PUT')(device, params, fs)

    common: (method) =>
      (device, params, fs) =>
        if fs.setLoading? then fs.setLoading(true)
        if fs.setError? then fs.setError({})

        apiRequest
          method: method
          device: device
          url: '/key'
          data: JSON.stringify params

          success: (res) =>
            if fs.setLoading? then fs.setLoading(false)
            if fs.setStatus? then fs.setStatus(res.key)
            if fs.changePage? then fs.changePage()

          error: (res) =>
            if fs.setLoading? then fs.setLoading(false)
            if fs.setStatus? then fs.setStatus(res.status)

  singleton = ->
    new KeyController
  singleton()
