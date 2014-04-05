class app.AppModel extends Backbone.Model
  defaults:
    id: null
    page: ""
    doorUrl: ""
    doorUrls: []
    disabled: "disabled"

  flatten: (arr) ->
    arr.reduce((sum, a) -> 
      sum.concat(a)
    , [])

  initialize: ->
    s = localStorage.getItem("deviceIds")
    
    if not s?
      @set page: "newDoor"
    else
      deviceIds = JSON.parse(s)

      doors = _.map deviceIds, (deviceId) ->
        device = JSON.parse(localStorage.getItem(deviceId))

        if !device.hasOwnProperty('doors') then throw new Error("Device has no property 'doors'")
        
        return _.map device['doors'], (door) ->
          name: "#{device.name} - #{door.name}"
          deviceId: deviceId
          number: door.number

      names = @flatten(doors)

      console.log names

      @set 
        page: "openDoor"
        doorUrl: names[deviceIds.length - 1].number
        doorUrls: names.map (d) -> d.number
        doorDoor: doors[deviceIds.length - 1]
        disabled: ""

      console.log this

app.model = new app.AppModel
