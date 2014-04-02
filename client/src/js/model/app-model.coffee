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
        
        device['doors'].map (door) ->
          name: "#{device.name} - #{door.name}"
          deviceId: deviceId
          number: door.number
            
      names = @flatten(doors)
      
      @set 
        page: "openDoor"
        doorUrl: names[deviceIds.length - 1]
        doorDoor: doors[deviceIds.length - 1]
        doorUrls: names 
        disabled: ""

app.model = new app.AppModel
