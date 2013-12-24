class app.NewDoorView extends Backbone.View
  model: app.model

  template: Handlebars.compile($("#new-door-template").html())

  events:
    "click #login-btn": "loginClicked"
    "click #back-btn": "backClicked"
    "click #https": "setHttps"
    "click #http": "setHttp"

  initialize: ->
    @render()

  render: ->
    @$el.html(@template(@model.toJSON()))

  loginClicked: ->
    doorUrl = @model.get("prot") + @$("#door-url").val()
    console.log(doorUrl);
    passphrase = @$("#passphrase").val()
    deviceId = if window.device then window.device.uuid else "itsme"

    @$(".form-group").removeClass("has-error")

    $.ajax
      url: "#{doorUrl}/login?passphrase=#{passphrase}&deviceId=#{deviceId}"
      crossDomain: true
      xhrFields: withCredentials: true
      statusCode:
        401: (resp) =>
          @$(".pass-form-group").addClass("has-error")
        404: (resp) =>
          @$(".door-form-group").addClass("has-error")
      error: (err) =>
        @$(".navbar-brand").text(err.status)
      success: (resp) =>
        if not resp.hasOwnProperty("token")
          @$(".navbar-brand").text("500")
        else
          @$(".navbar-brand").text("OpenDoor")
          doorUrls = @model.get("doorUrls")
          doorUrls.push doorUrl

          localStorage["doorUrls"] = JSON.stringify(doorUrls)
          localStorage[doorUrl] = resp.token

          @model.set
            doorUrl: doorUrl
            page: "openDoor"
            disabled: ""

  backClicked: ->
    @model.set("page", "openDoor")

  setHttps: -> 
    @$("#prot-text").text("https://").parent().removeClass("btn-danger")
    @model.set "prot", "https://"

  setHttp: -> 
    @$("#prot-text").text("http://").parent().addClass("btn-danger")
    @model.set "prot", "http://"
