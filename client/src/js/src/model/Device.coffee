define [
  'underscore'
  'model/Door'
], (_, Door) ->
  class Device
    defaults: ->
      deviceid: null
      doors: []
      limit: 1
      name: null
      # token: null

    constructor: (args) ->
      _.extend this, @defaults(), args

      unless args.hasOwnProperty('doors')
        console.warn("Device without doors makes no sense")
      else
        @doors = args.doors.map (door) ->
          door.deviceid = args.deviceid
          unless door.name.startsWith args.name
            door.name = args.name + ' - ' + door.name
          new Door(door)
