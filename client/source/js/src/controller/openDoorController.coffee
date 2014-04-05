define [
  'httpRequest'
], (httpRequest) ->
  class OpenDoorController
    openDoor: (door, token, fs) ->

      unless fs?
        console.error("Must provide callback functions")
        return

      if fs.setStatus? then fs.setStatus(null)
      if fs.setLoading? then fs.setLoading(true)
      if fs.setDisabled? then fs.setDisabled(true)

      httpRequest
        method: 'GET'
        url: '/openDoor'
        data:
          deviceid: door.deviceid
          doorNumber: door.number
          token: token

        success: (res) ->
          buzzTime = door.buzztime or 5000

          if fs.setLoading? then fs.setLoading(false)
          if fs.setDisabled? then setTimeout ->
            fs.setDisabled(false)
          , buzzTime

          if navigator?.notification?
            navigator.notification.vibrate(buzzTime)

        error: (res) ->
          if fs.setStatus? then fs.setStatus(res.status)
          if fs.setLoading? then fs.setLoading(false)
          if fs.setDisabled? then fs.setDisabled(false)

  singleton = -> new OpenDoorController
  singleton()

