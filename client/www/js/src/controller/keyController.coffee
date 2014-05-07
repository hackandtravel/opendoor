define [
  'controller/apiRequest'
], (apiRequest) ->
  class KeyController
    generateKey: (door, params, fs) ->
      # console.log(door, params, fs)
      
      if fs.setLoading? then fs.setLoading(true)
        
      apiRequest
        method: 'POST'
        url: '/key?token=' + door.token + '&deviceid=' + door.deviceid
        data:  JSON.stringify params
        
        success: (res) ->
          if fs.setLoading? then fs.setLoading(false)
          if fs.setStatus? then fs.setStatus(res.key)
          
        error: (res) ->
          if fs.setLoading? then fs.setLoading(false)
          if fs.setStatus? then fs.setStatus(res.status)
          

  singleton = -> new KeyController
  singleton()
