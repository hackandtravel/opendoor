define [
  'underscore'
  'model/Door'
], (_, Door) ->
  class Device
    defaults: ->
      deviceid: null
      doors: []
      name: null
      token: null
      masterToken: false
      
    constructor: (args) ->
      _.extend this, @defaults(), args

      unless args.hasOwnProperty('doors')
        console.warn("Device without doors makes no sense")
        return
        
      @doors = args.doors.map (door, i) ->
        door.id = args.deviceid + '-' + i
        door.token = args.token
        door.deviceid = args.deviceid
        door.deviceName = args.name
        door.masterToken = args.masterToken
        
        return new Door(door)
