class app.AppModel extends Backbone.Model
  defaults:
    id: null
    page: ""
    prot: "https://"
    doorUrl: ""
    doorUrls: []
    disabled: "disabled"

  initialize: -> 
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
