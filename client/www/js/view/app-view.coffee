class app.AppView extends Backbone.View
  el: "#app"

  model: app.model

  template: Handlebars.compile($("#app-template").html())

  events:
    "click .opendoor-btn": "opendoorClicked"
    "click .login-btn": "loginClicked"
    "change .door-select": "selectedDoorChanged"

  initialize: ->
    @listenTo @model, "change:page", @render
    @render()

  render: ->
    console.log "render app"
    @$el.html(@template(@model.toJSON()))

  loginClicked: ->
    console.log "loginClicked"

    doorUrl = @$("#door-url").val()
    passphrase = @$("#passphrase").val()
    deviceId = "TEST"

    console.log "login", doorUrl, passphrase, deviceId

    $.ajax
      url: "#{doorUrl}/login?passphrase=#{passphrase}&deviceId=#{deviceId}"
      crossDomain: true
      xhrFields: withCredentials: true
      success: (resp) =>
        if resp.hasOwnProperty("token")
          doorUrls = @model.get("doorUrls")
          doorUrls.push doorUrl

          localStorage["doorUrls"] = JSON.stringify(doorUrls)
          localStorage[doorUrl] = resp.token

          @render()

  opendoorClicked: ->
    doorUrl = @model.get("doorUrl")
    token = localStorage[doorUrl]
    $.ajax 
      url: "#{doorUrl}/opendoor?token=#{token}"
      crossDomain: true
      xhrFields: withCredentials: true
      success: (resp) ->
        # TODO
        console.log resp

  selectedDoorChanged: (e) ->
    @model.set "doorUrl", $(e.currentTarget).val()
    console.log @model.get "doorUrl"
