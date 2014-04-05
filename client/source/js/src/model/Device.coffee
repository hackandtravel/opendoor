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
      token: null

    constructor: (args) ->
      _.extend this, @defaults(), args

      if not args.hasOwnProperty('doors')
        console.warn("Device without doors makes no sense")
        @doors = args.doors.map (door) -> new Door(door)
