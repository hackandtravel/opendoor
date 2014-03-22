class app.AppModel extends Backbone.Model
  defaults:
    id: null
    page: ""
    prot: "https://"
    doorUrl: ""
    doorUrls: []
    disabled: "disabled"

  initialize: ->
    socket = io.connect(app.location, {secure: true})
    socket.on 'news', (data) ->
      console.log(data)
      socket.emit('my other event', { my: 'my data' })

    s = localStorage.getItem("doorUrls")
    if s?
      doorUrls = JSON.parse(s)
      @set 
        page: "openDoor"
        doorUrl: doorUrls[doorUrls.length - 1]
        doorUrls: doorUrls 
        disabled: ""
    else
      @set
        page: "newDoor"

app.model = new app.AppModel
