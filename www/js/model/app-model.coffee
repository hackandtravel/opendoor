class app.AppModel extends Backbone.Model
  defaults:
    id: null
    page: "home"
    doorUrl: ""
    doorUrls: []

  initialize: -> 
    s = localStorage["doorUrls"]
    if s?
      doorUrls = JSON.parse(s)
      @set 
        doorUrl: doorUrls[0]
        doorUrls: doorUrls 

app.model = new app.AppModel
