define [
  'underscore'
  'model/Door'
  'model/Key'
], (_, Door, Key) ->
  class Device
    defaults: ->
      deviceid: null
      doors: []
      keys: []
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
        
      if args.keys and _.isArray(args.keys)
        @keys = args.keys.map (key, i) ->
          return new Key(key)
      else
        @keys = []
