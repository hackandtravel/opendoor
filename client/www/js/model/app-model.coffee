class app.AppModel extends Backbone.Model
  defaults:
    id: null
    page: ""
    prot: "https://"
    doorUrl: ""
    doorUrls: []

  initialize: -> 
    s = localStorage["doorUrls"]
    if s?
      doorUrls = JSON.parse(s)
      @set 
        page: "openDoor"
        doorUrl: doorUrls[0]
        doorUrls: doorUrls 
    else
      @set
        page: "newDoor"

app.model = new app.AppModel
